// A question as a specimen label: plate and catalogue number on top, the stem, the options as a
// radio group, then (once revealed) the verdict, the explanation and where the question came from.
//
// `order` maps display rows to original option indices and `choice` is an original index, so
// the same question redraws identically after a reload. The page owns the keys (1-5, A-E);
// arrow keys move between options here, as in any radio group.

import { memo, useRef } from 'react';
import { RichText } from '@vetmock/lib/richtext.jsx';
import { Icon } from './Icon.jsx';
import { KindBadge } from './bits.jsx';
import { CARD_BY_ID, subjectName } from '../lib/bank.js';
import { LETTERS, plateNo } from '../lib/format.js';

const DRIVE = /(?:drive|docs)\.google\.com/;

/** Provenance text with its links: public pages stay links, the collection's Drive copies do not. */
function SourceText({ text }) {
  const parts = String(text).split(/(https?:\/\/[^\s,;)]+)/g);
  return parts.map((p, i) => {
    if (!/^https?:\/\//.test(p)) return p.replace(/\s*;\s*$/, '');
    if (DRIVE.test(p)) return null;
    let host = p;
    try { host = new URL(p).hostname.replace(/^www\./, ''); } catch { /* keep the text */ }
    return <a key={i} href={p} target="_blank" rel="noopener noreferrer">{host}</a>;
  });
}

export function Provenance({ q }) {
  const rows = [];
  if (q.subject !== 'vca') rows.push(['รายวิชา', subjectName(q.subject)]);
  if (q.origin) rows.push(['ข้อสอบ', q.origin]);
  if (q.source) rows.push(['ที่มา', <SourceText key="s" text={q.source} />]);
  if (q.verified && q.verified !== q.source) rows.push(['ตรวจทาน', <SourceText key="v" text={q.verified} />]);
  return (
    <div className="prov">
      <div className="prov-head"><KindBadge kind={q.kind} /><span className="prov-no">No. {q.id}</span></div>
      {rows.length > 0 && (
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="prov-row"><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      )}
      {q.refs?.length > 0 && (
        <ul className="prov-refs">
          {q.refs.map((r, i) => (
            <li key={i}>
              {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a> : r.title}
              {r.locator && <span className="prov-loc">{r.locator}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * @param {{ q: any, order: number[], choice: number|null, revealed: boolean,
 *   onChoose?: (original: number) => void, number?: number, total?: number,
 *   mode: 'practice'|'mock'|'review'|'sample', stemId?: string, showProvenance?: boolean }} props
 */
export const Question = memo(function Question({ q, order, choice, revealed, onChoose, number, total, mode, stemId = 'q-stem', showProvenance = true, head = true }) {
  const card = CARD_BY_ID[q.domain];
  const groupRef = useRef(null);
  const locked = revealed || !onChoose;
  const right = choice === q.answer;
  const answerRow = order.indexOf(q.answer);

  // Roving focus: the chosen row (or the first) is the one Tab stop; arrows move inside.
  const tabRow = Math.max(0, choice == null ? 0 : order.indexOf(choice));
  const onKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const rows = [...groupRef.current.querySelectorAll('[role="radio"]')];
    const at = rows.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    let next = at;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (at + 1) % rows.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (at - 1 + rows.length) % rows.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = rows.length - 1;
    rows[next].focus();
  };

  return (
    <article className={`q q-${mode}${revealed ? ' is-revealed' : ''}`} aria-labelledby={stemId}>
      {head && (
        <header className="q-head">
          {card && <span className="q-plate"><span className="q-plate-no">{plateNo(card.plate)}</span>{card.th}</span>}
          {number != null && <span className="q-count">ข้อ {number}{total ? <span className="q-of"> / {total}</span> : null}</span>}
        </header>
      )}

      <h2 id={stemId} className="q-stem" tabIndex={-1}><RichText text={q.q} /></h2>

      {q.image && (
        <figure className="q-fig">
          <img src={q.image} alt={q.imageAlt || 'ภาพประกอบโจทย์'} loading="lazy" decoding="async" />
        </figure>
      )}

      <div className="opts" role="radiogroup" aria-labelledby={stemId} ref={groupRef} onKeyDown={onKeyDown}>
        {order.map((orig, row) => {
          const chosen = choice === orig;
          let state = '';
          if (revealed) {
            if (orig === q.answer) state = 'right';
            else if (chosen) state = 'wrong';
            else state = 'rest';
          } else if (chosen) state = 'chosen';
          return (
            <button
              key={orig}
              type="button"
              role="radio"
              aria-checked={chosen}
              aria-disabled={locked || undefined}
              tabIndex={row === tabRow ? 0 : -1}
              className={`opt ${state}`}
              data-row={row}
              onClick={() => { if (!locked) onChoose(orig); }}
            >
              <span className="opt-key" aria-hidden="true">{LETTERS[row]}</span>
              <span className="opt-text"><RichText text={q.options[orig]} /></span>
              {state === 'right' && <span className="opt-mark"><Icon name="check" size={18} strokeWidth={2.2} /><span className="sr">คำตอบที่ถูก</span></span>}
              {state === 'wrong' && <span className="opt-mark"><Icon name="x" size={18} strokeWidth={2.2} /><span className="sr">คำตอบของคุณ</span></span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <section className="why" aria-label="เฉลยและคำอธิบาย">
          {(mode === 'practice' || mode === 'sample' || mode === 'review') && (
            <p className={`verdict ${choice == null ? 'skip' : right ? 'ok' : 'no'}`} role="status">
              {choice == null ? (
                <>ข้อนี้ข้ามไป คำตอบคือ <b>{LETTERS[answerRow]}</b></>
              ) : right ? (
                <><Icon name="check" size={18} strokeWidth={2.2} /> ถูกต้อง</>
              ) : (
                <><Icon name="x" size={18} strokeWidth={2.2} /> ยังไม่ถูก คำตอบคือ <b>{LETTERS[answerRow]}</b></>
              )}
            </p>
          )}
          {q.explain ? (
            <div className="why-body">
              <span className="why-label">ทำไม</span>
              <p><RichText text={q.explain} /></p>
              {q.explainImage && (
                <figure className="q-fig"><img src={q.explainImage} alt={q.explainImageAlt || 'ภาพประกอบคำอธิบาย'} loading="lazy" decoding="async" /></figure>
              )}
            </div>
          ) : (
            <p className="why-none">ข้อนี้ยังไม่มีคำอธิบาย</p>
          )}
          {showProvenance && <Provenance q={q} />}
        </section>
      )}
    </article>
  );
});
