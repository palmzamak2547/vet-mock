// ============================================================
// WrapParts — the pieces a wrap-up line is drawn with, in reading mode and
// in the revision deck alike, so a line looks the same in both
// ============================================================
import { createContext, useContext } from 'react';
import { momentHref, questionPointerLabel } from '../lib/source-label.js';
import { citeParts, citedText } from '../lib/wrap-cite.js';
import { keyTerm } from '../lib/wrap-keyline.js';
import { selfNumbered } from '../data/exam-wrapups.js';
import NavIcon from './NavIcon.jsx';

// What a citation needs from the page to name a cited question: the cohorts
// and paper filed for each id (wrap-cohorts.js originIndex, loaded lazily, so
// null at first) and, when the app can open one question, how.
export const WrapCiteContext = createContext({ origins: null, openQuestion: null });

// A question the line cites, named by the paper it was sat on, never by its
// bank id. Where the app can open one question, each id is a button that does.
function CitedQuestion({ pointer }) {
  const { origins, openQuestion } = useContext(WrapCiteContext);
  const label = questionPointerLabel(pointer, pointer.ids.flatMap((id) => origins?.get(id) || []));
  return (
    <span className="vmx-wrap-q">
      <span className="vmx-wrap-q-name">{label}</span>
      {openQuestion && !pointer.range && pointer.ids.map((id, i) => (
        <button
          key={id}
          type="button"
          className="vmx-wrap-q-open"
          onClick={() => openQuestion(id)}
          aria-label={pointer.ids.length > 1 ? `เปิดข้อที่ ${i + 1} ของ${label}` : `เปิดข้อนี้: ${label}`}
        >
          {pointer.ids.length > 1 ? `ข้อ ${i + 1}` : 'เปิดข้อนี้'}
        </button>
      ))}
    </span>
  );
}

// Where a line was said. A cited clip minute is a link that opens that clip
// at that minute, in a new tab so the page keeps its place; the rest of the
// citation (a deck page, a past paper) reads as text. A line with no clip
// shows its citation as before.
export function Cite({ src, course }) {
  const parts = citeParts(src, course);
  if (!parts.length) return null;
  return (
    <small className="vmx-wrap-src">
      {parts.map((p, i) => (p.kind === 'text' ? (
        <span key={i} className="vmx-wrap-src-text">{p.text}</span>
      ) : p.kind === 'question' ? (
        <CitedQuestion key={i} pointer={p.pointer} />
      ) : (
        <span key={i} className="vmx-wrap-clip">
          <span className="vmx-wrap-clip-name">{p.session} นาที</span>
          {p.moments.map((m) => (
            <a
              key={m.seconds}
              className="vmx-wrap-min"
              href={momentHref(m)}
              target="_blank"
              rel="noopener"
              aria-label={`เปิด${m.label.startsWith('คลิป') ? '' : 'คลิป'}${m.label}`}
              title="เปิดคลิปที่นาทีนี้ในแท็บใหม่"
            >
              <span className="vmx-wrap-min-face"><NavIcon name="play" size={12} />{m.stamp}</span>
            </a>
          ))}
        </span>
      )))}
    </small>
  );
}

// The three kinds of line, each with its own icon, so a student scanning the
// page finds "what the lecturer stressed", "what past papers asked" and "the
// usual mix-up" by shape before reading a word. The icon is decorative: the
// label beside it says the same thing to a screen reader.
export const SIGNAL_ICON = { emphasis: 'said', examined: 'sheet', pitfall: 'caution' };
export function SignalLabel({ kind, children, as: Tag = 'div' }) {
  return (
    <Tag className={`vmx-wrap-list-label is-${kind}`}>
      <span className="vmx-wrap-signal"><NavIcon name={SIGNAL_ICON[kind]} size={16} /></span>
      {children}
    </Tag>
  );
}

/** Text the page prints, with any question it names drawn by its paper (CitedQuestion). */
export function CitedText({ text, human = false }) {
  return citedText(text, { human }).map((p, i) => (p.kind === 'question'
    ? <CitedQuestion key={i} pointer={p.pointer} />
    : <span key={i}>{p.text}</span>));
}

/**
 * A line, its citation, and the slide it cites when there is a picture for it
 * (`slide` is the element to draw, or null).
 */
export function Line({ line, course, slide = null }) {
  return (
    <li>
      <span><CitedText text={line.text} /></span>
      {line.src && <Cite src={line.src} course={course} />}
      {slide}
    </li>
  );
}

// Short keywords are chips; a line to memorise (a definition with its
// clauses, a numbered principle) reads as a row. When the lecturer's own
// numbering is already in the text ("1 Emerging Infectious Diseases", "2
// Public Health"), the list must not add a second set of numbers beside it.
// A plain list leads each 'Term — explanation' or 'Term: explanation' line
// with the term in bold, chips included, so the eye lands on the term first
// (lib/wrap-keyline.js decides what is a term).
export function Keywords({ keywords, rows = false }) {
  if (!keywords?.length) return null;
  const numbered = selfNumbered(keywords);
  if (rows || keywords.some((k) => k.length > 44)) {
    return (
      <ul className={`vmx-wrap-keylist${numbered ? ' is-self-numbered' : ''}`} aria-label="คีย์เวิร์ดและรายการที่ต้องจำ">
        {keywords.map((k) => {
          const parts = numbered ? null : keyTerm(k);
          return <li key={k}>{parts ? <><b>{parts.term}</b>{parts.sep}{parts.rest}</> : k}</li>;
        })}
      </ul>
    );
  }
  return (
    <div className="vmx-wrap-keys" aria-label="คีย์เวิร์ด">
      {keywords.map((k) => {
        const parts = numbered ? null : keyTerm(k);
        return parts
          ? <span key={k} className="vmx-wrap-key has-term"><b>{parts.term}</b>{parts.sep}{parts.rest}</span>
          : <span key={k} className="vmx-wrap-key">{k}</span>;
      })}
    </div>
  );
}
