import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Markdown, inline } from '../lib/markdown.jsx';
import { IconArrowOut, IconCheck, IconCopy, IconRetry, IconSpeaker, IconStop, IconBook, IconShare, IconDownload } from './icons.jsx';
import { IN_APP } from '../lib/env.js';
import ShareMenu, { toast } from './ShareMenu.jsx';
import { GENERAL_NOTE, shareText } from '../lib/share.js';
import { speak } from '../lib/speech.js';
import { speciesOf } from '../lib/species.js';

export const KIND = {
  wiki: 'VetWiki',
  note: 'โน้ต',
  video: 'สรุปคลิป',
  question: 'ข้อสอบ',
  guide: 'คู่มือ VetMock',
  library: 'ห้องสมุด',
  paper: 'งานวิจัย',
};

const SPIN = ['.', ':', '-', '=', '+', '*', '#', '%', '@', '%', '#', '*', '+', '=', '-', ':'];

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % SPIN.length), 90);
    return () => clearInterval(id);
  }, []);
  return <span className="spin" aria-hidden="true">{SPIN[i]}</span>;
}

// a shown card is centred on its chip, then slid back inside the window
function placeCard(e) {
  const b = e.currentTarget;
  const r = b.getBoundingClientRect();
  const w = Math.min(300, innerWidth - 32);
  const left = r.left + r.width / 2 - w / 2;
  b.style.setProperty('--dx', `${Math.round(Math.min(Math.max(16, left), innerWidth - 16 - w) - left)}px`);
}

function Cite({ n, source, onPick }) {
  return (
    <button type="button" className="cite" onClick={() => onPick(n)} onPointerEnter={placeCard} onFocus={placeCard} aria-label={`แหล่งที่ ${n}: ${source?.title || ''}`}>
      {n}
      {source && (
        <span className="cite-card" role="tooltip">
          <span className="cite-kind">{KIND[source.kind] || source.kind}</span>
          <span className="cite-title">{source.title}</span>
          {source.snippet && <span className="cite-snip">{source.snippet}</span>}
        </span>
      )}
    </button>
  );
}

// "ข้อสอบ, COM5" not "ข้อสอบ, ข้อสอบ COM5": a subtitle that repeats the kind drops it
function kindLine(s) {
  const kind = KIND[s.kind] || s.kind;
  const sub = s.subtitle && s.subtitle.startsWith(kind) ? s.subtitle.slice(kind.length).replace(/^[\s,]+/, '') : s.subtitle;
  return sub ? `${kind}, ${sub}` : kind;
}

function Sources({ items, open, setOpen, highlight }) {
  if (!items?.length) return null;
  return (
    <section className={`sources${open ? ' is-open' : ''}`} aria-label="แหล่งที่มา">
      <button
        type="button"
        className="sources-head"
        aria-expanded={open}
        onClick={(e) => {
          setOpen(!open);
          // opened low on the screen: bring the list up instead of opening it under the box
          const r = e.currentTarget.getBoundingClientRect();
          if (!open && r.top > innerHeight * 0.55) {
            const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            requestAnimationFrame(() => window.scrollBy({ top: r.top - innerHeight * 0.3, behavior }));
          }
        }}
      >
        {/* the closed deck: a card per source, a pixel animal on the ones that name a species */}
        <span className="deck" aria-hidden="true">
          {items.slice(0, 4).map((s, i) => {
            const sp = speciesOf(s);
            return (
              <span key={s.n} className={`deck-card k-${s.kind}${sp ? ' has-plate' : ''}`} style={{ '--i': i }}>
                {sp && <span className="deck-ink" style={{ '--plate': `url(/art/specimens/${sp}-s.svg)` }} />}
              </span>
            );
          })}
        </span>
        <span>แหล่งที่มา {items.length}</span>
      </button>
      {open && (
        <ol className="sources-list">
          {items.map((s, i) => {
            const sp = speciesOf(s);
            return (
            <li key={s.n} id={`src-${s.n}`} className={`source k-${s.kind}${highlight === s.n ? ' is-hi' : ''}`} style={{ '--i': i }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {sp ? (
                  // the animal the source is about, from VetMock's own engravings (scripts/specimens.mjs)
                  <span className="plate">
                    <span className="plate-ink" aria-hidden="true" style={{ '--plate': `url(/art/specimens/${sp}.svg)` }} />
                    <span className="source-n">{s.n}</span>
                  </span>
                ) : (
                  <span className="source-n">{s.n}</span>
                )}
                <span className="source-body">
                  <span className="source-kind">{kindLine(s)}</span>
                  <span className="source-title">{s.title}</span>
                  {s.snippet && <span className="source-snip">{s.snippet}</span>}
                </span>
                <IconArrowOut size={16} className="source-out" />
              </a>
            </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function QuizCard({ card }) {
  const [at, setAt] = useState(0);
  const [picks, setPicks] = useState({});
  const qs = card.questions || [];
  if (!qs.length) return null;
  const done = at >= qs.length;
  const score = qs.reduce((n, q, i) => n + (picks[i] === q.answer ? 1 : 0), 0);
  const q = qs[Math.min(at, qs.length - 1)];
  const picked = picks[at];
  const ctx = {};
  return (
    <div className="card quiz">
      <div className="card-head">
        <span className="card-kind">แบบฝึก</span>
        <span className="card-title">{card.title}</span>
        <span className="quiz-count">{done ? `${score}/${qs.length}` : `${at + 1}/${qs.length}`}</span>
      </div>
      {done ? (
        <div className="quiz-end">
          <p className="quiz-score">ได้ {score} จาก {qs.length} ข้อ</p>
          <div className="quiz-actions">
            <button type="button" className="btn" onClick={() => { setPicks({}); setAt(0); }}>ทำอีกรอบ</button>
            {qs[0]?.url && <a className="btn btn-ghost" href={qs[0].url} target="_blank" rel="noopener noreferrer">ฝึกต่อใน VetMock</a>}
          </div>
        </div>
      ) : (
        <>
          <p className="quiz-stem">{inline(q.stem || '', ctx, `q${at}`)}</p>
          <ol className="quiz-options">
            {q.options.map((o, i) => {
              const state = picked === undefined ? '' : i === q.answer ? ' is-right' : i === picked ? ' is-wrong' : ' is-dim';
              return (
                <li key={i}>
                  <button type="button" className={`opt${state}`} disabled={picked !== undefined} onClick={() => setPicks((p) => ({ ...p, [at]: i }))}>
                    <span className="opt-key">{String.fromCharCode(65 + i)}</span>
                    <span>{inline(String(o), ctx, `o${at}${i}`)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {picked !== undefined && (
            <div className="quiz-after">
              <p className={picked === q.answer ? 'quiz-verdict ok' : 'quiz-verdict no'}>{picked === q.answer ? 'ถูก' : `ยังไม่ใช่ คำตอบคือ ${String.fromCharCode(65 + q.answer)}`}</p>
              {q.explain && <p className="quiz-explain">{inline(q.explain, ctx, `e${at}`)}</p>}
              <div className="quiz-actions">
                <button type="button" className="btn" onClick={() => setAt(at + 1)} autoFocus>{at + 1 < qs.length ? 'ข้อต่อไป' : 'ดูผล'}</button>
                {q.url && <a className="btn btn-ghost" href={q.url} target="_blank" rel="noopener noreferrer">เปิดใน VetMock</a>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ActionCard({ card }) {
  return (
    <a className="card action" href={card.url} target="_blank" rel="noopener noreferrer">
      <IconBook size={20} />
      <span className="action-say">{card.say}</span>
      <span className="btn">{card.label}</span>
    </a>
  );
}

function PapersCard({ card }) {
  const [open, setOpen] = useState(null);
  if (!card.items?.length) return null;
  return (
    <div className="card papers">
      <div className="card-head"><span className="card-kind">งานวิจัย</span><span className="card-title">{card.items.length} ชิ้น</span></div>
      <ol className="paper-list">
        {card.items.map((p, i) => (
          <li key={p.url || i} className="paper">
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="paper-title">{p.title}</a>
            <span className="paper-meta">{[p.journal, p.year].filter(Boolean).join(', ')}{p.authors ? ` ${p.authors}` : ''}</span>
            {p.abstract && (
              <>
                <button type="button" className="link" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>{open === i ? 'ซ่อนบทคัดย่อ' : 'บทคัดย่อ'}</button>
                {open === i && <p className="paper-abs">{p.abstract}</p>}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

const fmtSize = (b) => (!b ? '' : b >= 1e6 ? `${(b / 1e6).toFixed(b >= 1e7 ? 0 : 1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

/** One study file: what it is, where the topic is in it, and two ways in. */
function FileRow({ f, i }) {
  const sp = speciesOf({ title: f.title, subject: f.subjectName });
  const meta = [f.kindLabel, f.subjectName, f.lecturer, f.pages ? `${f.pages} หน้า` : '', [f.format, fmtSize(f.bytes)].filter(Boolean).join(' ')].filter(Boolean);
  return (
    <li className={`file kf-${f.kind}`} style={{ '--i': i }}>
      {sp ? (
        <span className="plate file-thumb" aria-hidden="true">
          <span className="plate-ink" style={{ '--plate': `url(/art/specimens/${sp}.svg)` }} />
        </span>
      ) : (
        // a page with its corner turned: the format, and how many pages
        <span className="file-sheet file-thumb" aria-hidden="true">
          <span className="file-sheet-format">{f.format || 'FILE'}</span>
          {f.pages ? <span className="file-sheet-pages">{f.pages}</span> : null}
        </span>
      )}
      <div className="file-body">
        <a className="file-title" href={f.open} target="_blank" rel="noopener noreferrer">{f.title}</a>
        <span className="file-meta">{meta.join(', ')}</span>
        {f.snippet && (
          <p className="file-snip">{f.page > 1 ? <span className="file-page">หน้า {f.page}</span> : null}{f.snippet}</p>
        )}
        <div className="file-actions">
          <a className="chip-btn" href={f.open} target="_blank" rel="noopener noreferrer">
            <IconArrowOut size={15} /> {f.page > 1 ? `เปิดหน้า ${f.page}` : 'เปิด'}
          </a>
          {/* in-app browsers do not save files; there the file opens and saves from its own viewer */}
          {!IN_APP && (
            <a className="chip-btn" href={f.download} rel="noopener">
              <IconDownload size={15} /> ดาวน์โหลด
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

/** Files from the study library: the answer to "ขอสไลด์...", or the decks
 *  behind an answer (related), each opened at the page that discusses it. */
function FilesCard({ card }) {
  const items = card.items || [];
  if (!items.length) return null;
  return (
    <section className={`card files${card.related ? ' is-related' : ''}`} aria-label={card.related ? 'สไลด์ที่เกี่ยวข้อง' : 'สไลด์และเอกสาร'}>
      <div className="card-head">
        <span className="card-kind">{card.related ? 'สไลด์ที่เกี่ยวข้อง' : 'สไลด์และเอกสาร'}</span>
        <span className="card-title">{items.length} ไฟล์ จากห้องสมุด VetMock</span>
      </div>
      <ol className="file-list">
        {items.map((f, i) => <FileRow key={f.slug} f={f} i={i} />)}
      </ol>
    </section>
  );
}

function Card({ card }) {
  if (card.type === 'quiz') return <QuizCard card={card} />;
  if (card.type === 'action') return <ActionCard card={card} />;
  if (card.type === 'papers') return <PapersCard card={card} />;
  if (card.type === 'files') return <FilesCard card={card} />;
  return null;
}

/** What went wrong, and the way back. The button already says ลองอีกครั้ง, so the
 *  message does not; after a rate limit the button counts down to when it may. */
function ErrorNote({ text, retryAt, onRetry }) {
  const [now, setNow] = useState(() => Date.now());
  const left = retryAt ? Math.ceil((retryAt - now) / 1000) : 0;
  useEffect(() => {
    if (left <= 0) return undefined;
    const id = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(id);
  }, [left, now]);
  return (
    <div className="msg-error" role="alert">
      <p>{onRetry ? text.replace(/\s*ลอง(?:ใหม่)?อีกครั้ง$/, '') : text}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry} disabled={left > 0}>
          <IconRetry size={16} /> {left > 0 ? `ลองอีกครั้งใน ${left} วินาที` : 'ลองอีกครั้ง'}
        </button>
      )}
    </div>
  );
}

/** The rendered answer as HTML for pasting elsewhere: citation chips become [n]. */
function htmlFor(el) {
  if (!el) return '';
  const c = el.cloneNode(true);
  c.querySelectorAll('.cite').forEach((b) => b.replaceWith(`[${b.firstChild?.textContent || ''}]`));
  return c.innerHTML;
}

function AssistantMessage({ m, last, onRetry, canSpeak, streaming, question = '' }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(null);
  const [copied, setCopied] = useState(false);
  const [talking, setTalking] = useState(null);
  const [sharing, setSharing] = useState(false);
  const shareBtn = useRef(null);
  const body = useRef(null);
  const sources = m.sources?.items || [];
  // only an explicit miss earns the note: quiz, action and greeting turns send covered with no items
  const general = m.sources?.covered === false;
  const flagged = useMemo(() => new Set((m.check?.ungrounded || []).map((x) => String(Number(String(x).replace(/,/g, ''))))), [m.check]);
  const pick = (n) => {
    setOpen(true);
    setHi(n);
    requestAnimationFrame(() => document.getElementById(`src-${n}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };
  const CiteBound = useMemo(() => function C({ n }) { return <Cite n={n} source={sources[n - 1]} onPick={pick} />; }, [sources]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => talking?.stop(), [talking]);
  const copy = async () => {
    try {
      // the numbers in the text come with the sources they point to
      await navigator.clipboard.writeText(shareText(question, m.content, { sources, general, limit: Infinity }));
      setCopied(true);
      toast('คัดลอกแล้ว');
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast('เบราว์เซอร์นี้ไม่ให้คัดลอก ลองกดค้างที่ข้อความแทน');
    }
  };
  const waiting = !m.content && !m.cards?.length && !m.error && !m.done;
  return (
    <article className={`msg msg-ai${streaming ? ' is-streaming' : ''}`} aria-busy={streaming}>
      {m.status && waiting && (
        <p className="status" aria-live="polite"><Spinner /> {m.status.label}</p>
      )}
      {general && !waiting && <p className="ground-note">{GENERAL_NOTE}</p>}
      {m.content && <div ref={body}><Markdown text={m.content} streaming={streaming} sources={sources} flagged={flagged} Cite={CiteBound} /></div>}
      {m.cards?.map((c, i) => <Card key={i} card={c} />)}
      {m.error && <ErrorNote text={m.error} retryAt={m.retryAt} onRetry={last ? onRetry : null} />}
      {m.stopped && <p className="ground-note">หยุดแล้ว</p>}
      {flagged.size > 0 && m.done && <p className="ground-note">ตัวเลขที่ขีดเส้นประ ไม่พบในแหล่งที่อ้าง</p>}
      <Sources items={sources} open={open} setOpen={setOpen} highlight={hi} />
      {m.done && m.content && (
        <div className="msg-actions">
          <button type="button" className="act" onClick={copy} aria-label="คัดลอก" title="คัดลอก">{copied ? <IconCheck size={18} /> : <IconCopy size={18} />}</button>
          {canSpeak && (
            <button type="button" className={`act${talking ? ' is-on' : ''}`} aria-label={talking ? 'หยุดอ่าน' : 'อ่านออกเสียง'} title="อ่านออกเสียง"
              onClick={() => (talking ? talking.stop() : setTalking(speak(m.content, { onEnd: () => setTalking(null) })))}>
              {talking ? <IconStop size={18} /> : <IconSpeaker size={18} />}
            </button>
          )}
          <button ref={shareBtn} type="button" className={`act${sharing ? ' is-on' : ''}`} onClick={() => setSharing((s) => !s)} aria-label="ส่งต่อ" aria-expanded={sharing} title="ส่งต่อ"><IconShare size={18} /></button>
          {last && <button type="button" className="act" onClick={onRetry} aria-label="ตอบใหม่" title="ตอบใหม่"><IconRetry size={18} /></button>}
          {sharing && (
            <ShareMenu
              anchor={shareBtn.current}
              question={question}
              answer={m.content}
              sources={sources}
              general={general}
              quiz={(m.cards || []).filter((c) => c.type === 'quiz').flatMap((c) => c.questions || [])}
              files={(m.cards || []).filter((c) => c.type === 'files').flatMap((c) => c.items || [])}
              getHtml={() => htmlFor(body.current)}
              onClose={() => setSharing(false)}
            />
          )}
        </div>
      )}
    </article>
  );
}

function UserMessage({ m }) {
  return (
    <article className="msg msg-user">
      {m.image?.preview && <img className="msg-img" src={m.image.preview} alt="รูปที่ส่ง" />}
      {m.hadImage && !m.image && <span className="ground-note">มีรูปแนบ</span>}
      <p>{m.content}</p>
    </article>
  );
}

export default memo(function Message(props) {
  const ref = useRef(null);
  return (
    <div ref={ref} className="msg-wrap" data-role={props.m.role}>
      {props.m.role === 'user' ? <UserMessage m={props.m} /> : <AssistantMessage {...props} />}
    </div>
  );
});
