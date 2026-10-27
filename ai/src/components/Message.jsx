import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Markdown, inline } from '../lib/markdown.jsx';
import { IconArrowOut, IconCheck, IconCopy, IconRetry, IconSpeaker, IconStop, IconBook, IconShare } from './icons.jsx';
import ShareMenu, { toast } from './ShareMenu.jsx';
import { speak } from '../lib/speech.js';

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
        <span className="deck" aria-hidden="true">
          {items.slice(0, 4).map((s, i) => <span key={s.n} className={`deck-card k-${s.kind}`} style={{ '--i': i }} />)}
        </span>
        <span>แหล่งที่มา {items.length}</span>
      </button>
      {open && (
        <ol className="sources-list">
          {items.map((s, i) => (
            <li key={s.n} id={`src-${s.n}`} className={`source k-${s.kind}${highlight === s.n ? ' is-hi' : ''}`} style={{ '--i': i }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                <span className="source-n">{s.n}</span>
                <span className="source-body">
                  <span className="source-kind">{KIND[s.kind] || s.kind}{s.subtitle ? `, ${s.subtitle}` : ''}</span>
                  <span className="source-title">{s.title}</span>
                  {s.snippet && <span className="source-snip">{s.snippet}</span>}
                </span>
                <IconArrowOut size={16} className="source-out" />
              </a>
            </li>
          ))}
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

function Card({ card }) {
  if (card.type === 'quiz') return <QuizCard card={card} />;
  if (card.type === 'action') return <ActionCard card={card} />;
  if (card.type === 'papers') return <PapersCard card={card} />;
  return null;
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
      await navigator.clipboard.writeText(m.content);
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
      {/* only an explicit miss earns the note: quiz, action and greeting turns send covered with no items */}
      {m.sources?.covered === false && !waiting && (
        <p className="ground-note">ไม่พบในคลัง VetMock ตอบจากความรู้ทั่วไป</p>
      )}
      {m.content && <div ref={body}><Markdown text={m.content} streaming={streaming} sources={sources} flagged={flagged} Cite={CiteBound} /></div>}
      {m.cards?.map((c, i) => <Card key={i} card={c} />)}
      {m.error && (
        <div className="msg-error" role="alert">
          <p>{m.error}</p>
          {last && <button type="button" className="btn" onClick={onRetry}><IconRetry size={16} /> ลองอีกครั้ง</button>}
        </div>
      )}
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
              quiz={(m.cards || []).filter((c) => c.type === 'quiz').flatMap((c) => c.questions || [])}
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
