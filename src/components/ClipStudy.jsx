// ============================================================
// ClipStudy — the study panel beside a lecture video: the summary, the
// chapters on a timeline, the index of terms and slide numbers, and the
// transcript that follows playback. Every time in it seeks the player.
// ============================================================
// The player owns the clock: this panel gets `currentTime` and `seek` and
// works the same over the library's own copy and over YouTube's embed.
// docs/VIDEO-LIBRARY.md has the summary policy the card follows.
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import '../styles-clip.css';
import {
  loadVideoCard, loadVideoRegistry, fetchVideoAsset, clock,
  readPosition, savePosition, readSeen, markSeen, seenShare,
} from '../lib/video-library.js';

const TABS = [
  ['summary', 'สรุป'],
  ['chapters', 'ช่วงเนื้อหา'],
  ['index', 'ดัชนี'],
  ['transcript', 'ถอดความ'],
];

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

export default function ClipStudy({ videoId, currentTime = 0, seek, duration: playerDuration = 0 }) {
  const [card, setCard] = useState(undefined); // undefined: loading, null: none
  const [entry, setEntry] = useState(null);
  const [tab, setTab] = useState('summary');
  const [seen, setSeen] = useState(() => readSeen(videoId));
  const [resumeAt, setResumeAt] = useState(() => readPosition(videoId));
  const [transcript, setTranscript] = useState({ status: 'idle' });
  const [frames, setFrames] = useState([]);
  const [query, setQuery] = useState('');
  const tabRefs = useRef({});
  const listRef = useRef(null);
  const lastScroll = useRef(0);
  const prevTime = useRef(0);
  const savedAt = useRef(0);

  useEffect(() => {
    let off = false;
    setCard(undefined);
    setEntry(null);
    setTranscript({ status: 'idle' });
    setFrames([]);
    setSeen(readSeen(videoId));
    setResumeAt(readPosition(videoId));
    loadVideoCard(videoId).then((c) => { if (!off) setCard(c); }).catch(() => { if (!off) setCard(null); });
    loadVideoRegistry().then((r) => { if (!off) setEntry(r[videoId] || null); }).catch(() => {});
    return () => { off = true; };
  }, [videoId]);

  // Slides are worth one request as soon as the copy exists; the transcript
  // waits for its tab.
  useEffect(() => {
    if (!entry?.media) return undefined;
    let off = false;
    fetchVideoAsset(videoId, 'frames').then((r) => { if (!off && r.status === 'ok') setFrames(r.data.frames || []); });
    return () => { off = true; };
  }, [videoId, entry?.media]);
  useEffect(() => {
    if (tab !== 'transcript' || transcript.status !== 'idle') return undefined;
    if (!entry?.media) { setTranscript({ status: 'none' }); return undefined; }
    let off = false;
    setTranscript({ status: 'loading' });
    fetchVideoAsset(videoId, 'transcript').then((r) => {
      if (off) return;
      setTranscript(r.status === 'ok' ? { status: 'ok', lines: (r.data.lines || []).map(([t, text]) => ({ t, text })) } : r);
    });
    return () => { off = true; };
  }, [tab, videoId, entry?.media, transcript.status]);

  // Watched marks grow only while the video plays forward; the place the
  // student stopped is kept every five seconds.
  useEffect(() => {
    const step = currentTime - prevTime.current;
    prevTime.current = currentTime;
    if (!(currentTime > 0)) return;
    if (step > 0 && step < 3) setSeen((s) => markSeen(videoId, currentTime, s));
    if (Math.abs(currentTime - savedAt.current) >= 5) { savePosition(videoId, currentTime); savedAt.current = currentTime; }
    if (resumeAt && Math.abs(currentTime - resumeAt) > 5 && currentTime > 10) setResumeAt(0);
  }, [videoId, currentTime, resumeAt]);

  const duration = playerDuration || entry?.durationSec || 0;
  const chapters = card?.chapters || [];
  const current = at(chapters, currentTime);
  const lines = transcript.status === 'ok' ? transcript.lines : [];
  const activeLine = at(lines, currentTime + 0.5);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? lines.filter((l) => l.text.toLowerCase().includes(q)) : lines;
  }, [lines, query]);

  // The transcript follows playback unless the student scrolled it in the last few seconds.
  useEffect(() => {
    if (tab !== 'transcript' || query || activeLine < 0 || Date.now() - lastScroll.current < 4000) return;
    const row = listRef.current?.querySelector('[aria-current="true"]');
    row?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [tab, query, activeLine]);

  if (card === undefined && !entry) {
    return <div className="vmx-clip vmx-clip-skeleton" aria-busy="true" aria-label="กำลังโหลดสรุปคลิป"><span /><span /><span /></div>;
  }
  if (!card && !entry) return null;

  const onSeek = (t) => seek?.(t);
  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length][0];
    setTab(next);
    tabRefs.current[next]?.focus();
  };
  const frameFor = (start, end) => frames.find((f) => f.t >= start && f.t < end);

  return (
    <section className="vmx-clip" aria-label="สรุปและช่วงเนื้อหาของคลิป">
      {resumeAt > 30 && resumeAt < duration - 30 && (
        <button type="button" className="vmx-clip-resume" onClick={() => { onSeek(resumeAt); setResumeAt(0); }}>
          ดูต่อจาก {clock(resumeAt)}
        </button>
      )}

      {chapters.length > 1 && duration > 0 && (
        // A picture of the lecture's parts; the chapter list is the same thing for keyboards and screen readers.
        <div className="vmx-clip-bar" aria-hidden="true">
          {chapters.map((c, i) => {
            const end = chapters[i + 1]?.t ?? duration;
            return (
              <div
                key={c.t}
                className={`vmx-clip-seg ${i === current ? 'is-current' : ''}`}
                style={{ flexGrow: Math.max(1, end - c.t), '--seen': seenShare(seen, c.t, end) }}
                title={`${clock(c.t)} ${c.title}`}
                onClick={() => onSeek(c.t)}
              />
            );
          })}
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
        {tab === 'summary' && (card ? (
          <>
            <p className="vmx-clip-one">{card.oneLiner}</p>
            <ol className="vmx-clip-list">
              {card.keyPoints.map((p) => (
                <li key={p.t}>
                  <TimeRow t={p.t} onSeek={onSeek}>
                    {p.text}
                    {p.stressed && <span className="vmx-clip-tag">จุดเน้น</span>}
                  </TimeRow>
                </li>
              ))}
            </ol>
            {card.emphasis.length > 0 && (
              <section className="vmx-clip-box" aria-labelledby="vmx-clip-emph">
                <h4 id="vmx-clip-emph">จุดเน้น</h4>
                <ul className="vmx-clip-list">{card.emphasis.map((p) => <li key={p.t}><TimeRow t={p.t} onSeek={onSeek}>{p.text}</TimeRow></li>)}</ul>
              </section>
            )}
            {card.remember.length > 0 && (
              <section className="vmx-clip-box" aria-labelledby="vmx-clip-mem">
                <h4 id="vmx-clip-mem">ต้องจำ</h4>
                <ul className="vmx-clip-list">{card.remember.map((p) => <li key={p.t}><TimeRow t={p.t} onSeek={onSeek}>{p.text}</TimeRow></li>)}</ul>
              </section>
            )}
          </>
        ) : <p className="vmx-clip-note">คลิปนี้ยังไม่มีสรุป ดูช่วงเนื้อหาและถอดความได้จากแท็บด้านบน</p>)}

        {tab === 'chapters' && (chapters.length ? (
          <ol className="vmx-clip-list">
            {chapters.map((c, i) => {
              const end = chapters[i + 1]?.t ?? duration;
              const pic = frameFor(c.t, end);
              const done = seenShare(seen, c.t, end) >= 0.8;
              return (
                <li key={c.t}>
                  <TimeRow t={c.t} onSeek={onSeek} active={i === current} className="vmx-clip-chapter">
                    <strong className="vmx-clip-ctitle">{c.title}</strong>
                    {c.line && <span className="vmx-clip-cline">{c.line}</span>}
                    {done && <span className="vmx-clip-tag is-done">ดูแล้ว</span>}
                  </TimeRow>
                  {pic && <img className="vmx-clip-slide" src={pic.url} alt={`สไลด์ช่วง ${c.title}`} loading="lazy" decoding="async" width="320" height="180" />}
                </li>
              );
            })}
          </ol>
        ) : <p className="vmx-clip-note">คลิปนี้ยังไม่ได้แบ่งช่วงเนื้อหา</p>)}

        {tab === 'index' && (card?.index?.length ? (
          <>
            <h4 className="vmx-clip-h">ศัพท์ในคลิป</h4>
            <div className="vmx-clip-chips">
              {card.index.filter((x) => x.term).sort((a, b) => a.t - b.t).map((x) => (
                <button key={`${x.term}${x.t}`} type="button" className="vmx-clip-chip" onClick={() => onSeek(x.t)}>
                  {x.term} <span className="vmx-clip-t">{clock(x.t)}</span>
                </button>
              ))}
            </div>
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
            : transcript.status === 'login' ? <p className="vmx-clip-note">เข้าสู่ระบบเพื่ออ่านคำบรรยายและเปิดสไลด์ของคลิปนี้</p>
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
                      <ol className="vmx-clip-list vmx-clip-transcript" ref={listRef} onScroll={() => { lastScroll.current = Date.now(); }}>
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
