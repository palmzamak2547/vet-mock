// ============================================================
// ClipStudy — the study panel beside a lecture video: the summary, the
// chapters on a timeline, the index of terms and slide numbers, and the
// transcript that follows playback. Every time in it seeks the player.
// ============================================================
// The player owns the clock: this panel gets `currentTime` and `seek` and
// works the same over the library's own copy and over YouTube's embed.
// docs/VIDEO-LIBRARY.md has the summary policy the card follows and the
// skip list (section 11): stamps keep the original times, so nothing drifts.
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles-clip.css';
import { VIDEO_INDEX } from '../data/video-cards.generated.js';
import {
  hasVideoCard, loadVideoCard, loadVideoRegistry, fetchVideoAsset, clock,
  readPosition, savePosition, readSeen, markSeen, seenShare, readSkip, saveSkip,
} from '../lib/video-library.js';

const TABS = [
  ['summary', 'สรุป'],
  ['chapters', 'ช่วงเนื้อหา'],
  ['index', 'ดัชนี'],
  ['transcript', 'ถอดความ'],
];
const FIRST_POINTS = 3; // the card opens on the one-liner and these; ดูเพิ่ม shows the rest
const SKIP_WORTH = 60; // seconds saved before the skip switch is worth showing

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Index of the last item whose `t` is at or before `time` (items sorted by t). */
function at(items, time) {
  let lo = 0;
  let hi = items.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (items[mid].t <= time) { found = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return found;
}

function TimeRow({ t, onSeek, children, active = false, className = '' }) {
  return (
    <button type="button" className={`vmx-clip-row ${active ? 'is-active' : ''} ${className}`} onClick={() => onSeek(t)} aria-current={active ? 'true' : undefined}>
      <span className="vmx-clip-t">{clock(t)}</span>
      <span className="vmx-clip-text">{children}</span>
    </button>
  );
}

const Line = memo(function Line({ t, text, active, onSeek }) {
  return <li><TimeRow t={t} onSeek={onSeek} active={active}>{text}</TimeRow></li>;
});

const Points = ({ items, onSeek }) => items.map((p, i) => (
  <li key={`${p.t}-${i}`}>
    <TimeRow t={p.t} onSeek={onSeek}>
      {p.text}
      {p.stressed && <span className="vmx-clip-tag">จุดเน้น</span>}
    </TimeRow>
  </li>
));

export default function ClipStudy({ videoId, currentTime = 0, seek, duration: playerDuration = 0 }) {
  const [, , , hasCopy = 0, skipSec = 0, length = 0] = VIDEO_INDEX[videoId] || [];
  const carded = hasVideoCard(videoId);
  const [card, setCard] = useState(undefined); // undefined: loading, null: none
  const [skips, setSkips] = useState([]);
  const [skipOn, setSkipOn] = useState(readSkip);
  const [tab, setTab] = useState('summary');
  const [more, setMore] = useState(false);
  const [seen, setSeen] = useState(() => readSeen(videoId));
  // A place worth offering: past the first half minute.
  const [resumeAt, setResumeAt] = useState(() => (readPosition(videoId) > 30 ? readPosition(videoId) : 0));
  const [transcript, setTranscript] = useState({ status: 'idle' });
  const [frames, setFrames] = useState([]);
  const [query, setQuery] = useState('');
  const tabRefs = useRef({});
  const listRef = useRef(null);
  const lastScroll = useRef(0);
  const prevTime = useRef(0);
  const savedAt = useRef(0);
  const watched = useRef(0); // seconds played forward since the clip opened
  const studentSeeked = useRef(false); // the student moved the playhead from this panel
  const transcriptFor = useRef(null); // the clip whose transcript is on its way
  const autoScrollUntil = useRef(0); // scroll events before this are the panel's own

  useEffect(() => {
    let off = false;
    setCard(undefined);
    setSkips([]);
    setMore(false);
    setTranscript({ status: 'idle' });
    setFrames([]);
    setSeen(readSeen(videoId));
    setResumeAt(readPosition(videoId) > 30 ? readPosition(videoId) : 0);
    watched.current = 0;
    studentSeeked.current = false;
    transcriptFor.current = null;
    loadVideoCard(videoId).then((c) => { if (!off) setCard(c); }).catch(() => { if (!off) setCard(null); });
    // The stretches to jump come with the registry, which only a video with some needs.
    if (skipSec >= SKIP_WORTH) loadVideoRegistry().then((r) => { if (!off) setSkips(r[videoId]?.skips || []); }).catch(() => {});
    return () => { off = true; };
  }, [videoId, skipSec]);

  // Slides are worth one request as soon as the copy exists; the transcript
  // waits for its tab.
  useEffect(() => {
    if (!hasCopy || !carded) return undefined;
    let off = false;
    fetchVideoAsset(videoId, 'frames').then((r) => { if (!off && r.status === 'ok') setFrames(r.data.frames || []); });
    return () => { off = true; };
  }, [videoId, hasCopy, carded]);
  useEffect(() => {
    if (tab !== 'transcript' || transcript.status !== 'idle') return;
    // Every card's transcript is kept, with or without our copy of the video.
    if (!carded) { setTranscript({ status: 'none' }); return; }
    // Setting "loading" runs this effect again, so the answer is matched to its
    // clip by a ref; a cleanup here would throw every answer away.
    const id = videoId;
    transcriptFor.current = id;
    setTranscript({ status: 'loading' });
    fetchVideoAsset(id, 'transcript').then((r) => {
      if (transcriptFor.current !== id) return;
      setTranscript(r.status === 'ok' ? { status: 'ok', lines: (r.data.lines || []).map(([t, text]) => ({ t, text })) } : r.code === 404 ? { status: 'none' } : r);
    });
  }, [tab, videoId, carded, transcript.status]);

  // Watched marks grow only while the video plays forward; the place the
  // student stopped is kept every five seconds. Playing on into a stretch
  // that teaches nothing jumps it, and so does a clip that starts playing
  // from zero inside the wait before the lecture; a seek that lands inside a
  // stretch is the student's choice and plays.
  useEffect(() => {
    const prev = prevTime.current;
    const step = currentTime - prev;
    prevTime.current = currentTime;
    if (!(currentTime > 0)) return;
    if (skipOn && step > 0 && step < 3) {
      const fresh = prev === 0 && currentTime < 3 && !studentSeeked.current;
      const k = skips.find(([s, e]) => (prev < s || (s === 0 && fresh)) && currentTime >= s && currentTime < e - 1);
      if (k) { seek?.(k[1]); return; }
    }
    if (step > 0 && step < 3) {
      watched.current += step;
      setSeen((s) => markSeen(videoId, currentTime, s));
    }
    // An offer to resume holds the saved place, so a player that starts from
    // zero cannot overwrite it; a minute of watching elsewhere settles it.
    if (resumeAt) { if (watched.current >= 60) setResumeAt(0); return; }
    if (Math.abs(currentTime - savedAt.current) >= 5) { savePosition(videoId, currentTime); savedAt.current = currentTime; }
  }, [videoId, currentTime, resumeAt, skipOn, skips, seek]);

  const duration = playerDuration || length;
  const chapters = card?.chapters || [];
  const current = at(chapters, currentTime);
  const lines = transcript.status === 'ok' ? transcript.lines : [];
  const activeLine = at(lines, currentTime + 0.5);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? lines.filter((l) => l.text.toLowerCase().includes(q)) : lines;
  }, [lines, query]);

  // The transcript follows playback unless the student scrolled it in the
  // last few seconds. Only the list scrolls, never the dialog around it, and
  // its own scrolling is not mistaken for the student's.
  useEffect(() => {
    if (tab !== 'transcript' || query || activeLine < 0 || Date.now() - lastScroll.current < 4000) return;
    const list = listRef.current;
    const row = list?.querySelector('[aria-current="true"]');
    if (!list || !row) return;
    autoScrollUntil.current = Date.now() + 800;
    list.scrollTo({ top: Math.max(0, row.offsetTop - list.clientHeight / 3), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [tab, query, activeLine]);

  // Stable, so a memoised transcript line re-renders only when it becomes or stops being current.
  const onSeek = useCallback((t) => { studentSeeked.current = true; seek?.(t); }, [seek]);
  const skipSwitch = skipSec >= SKIP_WORTH && (
    <label className="vmx-clip-skip">
      <input type="checkbox" checked={skipOn} onChange={(e) => { setSkipOn(e.target.checked); saveSkip(e.target.checked); }} />
      <span>ข้ามช่วงที่ไม่มีเนื้อหา</span>
      <span className="vmx-clip-fine">ประหยัด {Math.round(skipSec / 60)} นาที</span>
    </label>
  );
  const resume = resumeAt > 30 && (!duration || resumeAt < duration - 30) && (
    <button type="button" className="vmx-clip-resume" onClick={() => { onSeek(resumeAt); setResumeAt(0); }}>
      ดูต่อจาก {clock(resumeAt)}
    </button>
  );
  const tools = (resume || skipSwitch) && <div className="vmx-clip-tools">{resume}{skipSwitch}</div>;

  // A video without a card has only its tools; one with a card holds its
  // space while the card loads, shaped like what comes.
  if (!carded) return tools ? <section className="vmx-clip" aria-label="การเล่นคลิป">{tools}</section> : null;
  if (card === undefined) {
    return (
      <div className="vmx-clip vmx-clip-skeleton" aria-busy="true" aria-label="กำลังโหลดสรุปคลิป">
        <span className="is-bar" /><span className="is-tabs" /><span /><span /><span /><span />
      </div>
    );
  }
  if (!card) return tools ? <section className="vmx-clip" aria-label="การเล่นคลิป">{tools}</section> : null;

  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length][0];
    setTab(next);
    tabRefs.current[next]?.focus();
  };
  const frameFor = (start, end) => frames.find((f) => f.t >= start && f.t < end);
  const hasMore = card.keyPoints.length > FIRST_POINTS || card.emphasis.length > 0 || card.remember.length > 0;
  const barEnd = duration || chapters.at(-1)?.t || 0;

  return (
    <section className="vmx-clip" aria-label="สรุปและช่วงเนื้อหาของคลิป">
      {tools}

      {chapters.length > 1 && barEnd > 0 && (
        // A picture of the lecture's parts; the chapter list is the same thing for keyboards and screen readers.
        <div className="vmx-clip-bar" aria-hidden="true">
          {/* The minutes before the first chapter, so every mark sits at its own time. */}
          {chapters[0].t > 0 && (
            <div className="vmx-clip-seg is-lead" style={{ flexGrow: chapters[0].t }} onClick={() => onSeek(0)}>
              <span className="vmx-clip-seen" style={{ transform: `scaleX(${seenShare(seen, 0, chapters[0].t)})` }} />
            </div>
          )}
          {chapters.map((c, i) => {
            const end = chapters[i + 1]?.t ?? barEnd;
            return (
              <div
                key={c.t}
                className={`vmx-clip-seg ${i === current ? 'is-current' : ''}`}
                style={{ flexGrow: Math.max(1, end - c.t) }}
                title={`${clock(c.t)} ${c.title || c.line}`}
                onClick={() => onSeek(c.t)}
              >
                <span className="vmx-clip-seen" style={{ transform: `scaleX(${seenShare(seen, c.t, end)})` }} />
              </div>
            );
          })}
          {skipOn && duration > 0 && skips.map(([s, e]) => (
            <span key={s} className="vmx-clip-skipmark" style={{ left: `${(s / duration) * 100}%`, width: `${((e - s) / duration) * 100}%` }} />
          ))}
        </div>
      )}

      <div className="vmx-clip-tabs" role="tablist" aria-label="มุมมองของคลิป">
        {TABS.map(([id, label], i) => (
          <button
            key={id}
            ref={(el) => { tabRefs.current[id] = el; }}
            type="button"
            role="tab"
            id={`vmx-clip-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`vmx-clip-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            className="vmx-clip-tab"
            onClick={() => setTab(id)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="vmx-clip-panel" role="tabpanel" id={`vmx-clip-panel-${tab}`} aria-labelledby={`vmx-clip-tab-${tab}`}>
        {tab === 'summary' && (
          <>
            <p className="vmx-clip-one">{card.oneLiner}</p>
            <ol className="vmx-clip-list">
              <Points items={more ? card.keyPoints : card.keyPoints.slice(0, FIRST_POINTS)} onSeek={onSeek} />
            </ol>
            {more && card.emphasis.length > 0 && (
              <section className="vmx-clip-box" aria-labelledby="vmx-clip-emph">
                <h4 id="vmx-clip-emph">จุดเน้น</h4>
                <ul className="vmx-clip-list"><Points items={card.emphasis} onSeek={onSeek} /></ul>
              </section>
            )}
            {more && card.remember.length > 0 && (
              <section className="vmx-clip-box" aria-labelledby="vmx-clip-mem">
                <h4 id="vmx-clip-mem">ต้องจำ</h4>
                <ul className="vmx-clip-list"><Points items={card.remember} onSeek={onSeek} /></ul>
              </section>
            )}
            {hasMore && (
              <button type="button" className="vmx-clip-more" aria-expanded={more} onClick={() => setMore(!more)}>
                {more ? 'แสดงน้อยลง' : 'ดูเพิ่ม'}
              </button>
            )}
          </>
        )}

        {tab === 'chapters' && (chapters.length ? (
          <ol className="vmx-clip-list">
            {chapters.map((c, i) => {
              const end = chapters[i + 1]?.t ?? barEnd;
              const pic = frameFor(c.t, end);
              const done = seenShare(seen, c.t, end) >= 0.8;
              return (
                <li key={c.t}>
                  <TimeRow t={c.t} onSeek={onSeek} active={i === current} className="vmx-clip-chapter">
                    {/* A stretch with no slide heading has no title: its line says what it teaches. */}
                    {c.title && <strong className="vmx-clip-ctitle">{c.title}</strong>}
                    {c.line && <span className="vmx-clip-cline">{c.line}</span>}
                    {done && <span className="vmx-clip-tag is-done">ดูแล้ว</span>}
                  </TimeRow>
                  {pic && <img className="vmx-clip-slide" src={pic.url} alt={`สไลด์ช่วง ${c.title || clock(c.t)}`} loading="lazy" decoding="async" width="320" height="180" />}
                </li>
              );
            })}
          </ol>
        ) : <p className="vmx-clip-note">คลิปนี้ยังไม่ได้แบ่งช่วงเนื้อหา</p>)}

        {tab === 'index' && (card.index?.length ? (
          <>
            {card.index.some((x) => x.term) && (
              <>
                <h4 className="vmx-clip-h">ศัพท์ในคลิป</h4>
                <div className="vmx-clip-chips">
                  {card.index.filter((x) => x.term).sort((a, b) => a.t - b.t).map((x) => (
                    <button key={`${x.term}${x.t}`} type="button" className="vmx-clip-chip" onClick={() => onSeek(x.t)}>
                      {x.term} <span className="vmx-clip-t">{clock(x.t)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {card.index.some((x) => x.number) && (
              <>
                <h4 className="vmx-clip-h">ตัวเลขบนสไลด์</h4>
                <ul className="vmx-clip-list">
                  {card.index.filter((x) => x.number).map((x) => <li key={`${x.number}${x.t}`}><TimeRow t={x.t} onSeek={onSeek}>{x.number}</TimeRow></li>)}
                </ul>
              </>
            )}
          </>
        ) : <p className="vmx-clip-note">คลิปนี้ยังไม่มีดัชนี</p>)}

        {tab === 'transcript' && (
          transcript.status === 'loading' || transcript.status === 'idle' ? <p className="vmx-clip-note" aria-busy="true">กำลังโหลดคำบรรยาย</p>
            : transcript.status === 'login' ? <p className="vmx-clip-note">{hasCopy ? 'เข้าสู่ระบบเพื่ออ่านคำบรรยายและเปิดสไลด์ของคลิปนี้' : 'เข้าสู่ระบบเพื่ออ่านคำบรรยายของคลิปนี้'}</p>
              : transcript.status === 'offline' ? <p className="vmx-clip-note">ออฟไลน์อยู่ ต่ออินเทอร์เน็ตแล้วเปิดแท็บนี้อีกครั้ง</p>
                : transcript.status === 'none' ? <p className="vmx-clip-note">คลิปนี้ยังไม่มีคำบรรยาย</p>
                  : transcript.status !== 'ok' ? (
                    <p className="vmx-clip-note">โหลดคำบรรยายไม่สำเร็จ <button type="button" className="vmx-clip-retry" onClick={() => setTranscript({ status: 'idle' })}>ลองใหม่</button></p>
                  ) : (
                    <>
                      <label className="vmx-clip-search">
                        <span className="vmx-sr-only">ค้นในคำบรรยาย</span>
                        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นในคำบรรยาย" />
                      </label>
                      {query && <p className="vmx-clip-note" role="status">พบ {shown.length} บรรทัด</p>}
                      <ol className="vmx-clip-list vmx-clip-transcript" ref={listRef} onScroll={() => { if (Date.now() > autoScrollUntil.current) lastScroll.current = Date.now(); }}>
                        {shown.map((l) => <Line key={l.t} t={l.t} text={l.text} active={!query && lines[activeLine] === l} onSeek={onSeek} />)}
                      </ol>
                      <p className="vmx-clip-fine">คำบรรยายถอดจากเสียงอัตโนมัติ ศัพท์บางคำอาจสะกดผิด</p>
                    </>
                  )
        )}
      </div>
    </section>
  );
}
