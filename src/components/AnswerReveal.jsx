// ============================================================
// AnswerReveal — when and how a matching set or a written answer shows เฉลย
// ============================================================
// Multiple choice reveals the moment a choice is made. A matching set has
// eighteen rows and a written answer is typed over a minute, so "the
// moment" is a choice the student makes: after each row or after the
// whole set (matching); on a button press for this question or not until
// the review (written). One stored preference, read by both. Palm asked
// for the choice on 2026-09-20 — the review page had been printing an
// eighteen-row set as one run-on line.
//
// Also here: the review page's per-row table for a matching set, the
// explain of a set split into its organism paragraphs, and the written
// answer's keyword checklist (the same matcher SmartGrader uses).
// ============================================================

import { useMemo, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import TermLinkedRichText from './TermLinkedRichText.jsx';
import { keywordCoverage } from './SmartGrader.jsx';

const KEY = 'vmx-reveal-timing';
export const REVEAL_ROW = 'row';
export const REVEAL_END = 'end';

export function readRevealTiming() {
  try { return localStorage.getItem(KEY) === REVEAL_ROW ? REVEAL_ROW : REVEAL_END; } catch { return REVEAL_END; }
}

export function writeRevealTiming(m) {
  try { localStorage.setItem(KEY, m); } catch {}
}

export function useRevealTiming() {
  const [mode, set] = useState(readRevealTiming);
  const setMode = (m) => {
    set(m);
    writeRevealTiming(m);
  };
  return [mode, setMode];
}

export function RevealTimingToggle({ mode, onChange, rowLabel = 'เฉลยทีละข้อ', endLabel = 'เฉลยหลังทำครบ' }) {
  return (
    <div className="vmx-reveal-toggle" role="group" aria-label="เวลาที่แสดงเฉลย">
      <button type="button" className={mode === REVEAL_ROW ? 'is-on' : ''} aria-pressed={mode === REVEAL_ROW} onClick={() => onChange(REVEAL_ROW)}>{rowLabel}</button>
      <button type="button" className={mode === REVEAL_END ? 'is-on' : ''} aria-pressed={mode === REVEAL_END} onClick={() => onChange(REVEAL_END)}>{endLabel}</button>
    </div>
  );
}

const strip = (s) => String(s || '').replace(/[*_`]/g, '').trim();

/** The explain of a set, paragraph by paragraph (blank-line separated). */
export function explainParagraphs(explain) {
  return String(explain || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** The paragraph of a set's explain that belongs to one answer card. The
 *  printed sets and the session banks explain organism by organism, each
 *  paragraph opening with the organism's name; anything else gets null. */
export function explainParagraphFor(explain, right) {
  const name = strip(right).toLowerCase();
  if (!name) return null;
  const paras = explainParagraphs(explain);
  // A session bank's explain is the source sets' paragraphs, each covering
  // several organisms; the paragraph that names this one is still the
  // right one to read. A single-paragraph explain is not worth repeating
  // under every wrong row.
  return paras.find((p) => p.toLowerCase().startsWith(name))
    || paras.find((p) => p.slice(0, 80).toLowerCase().includes(name))
    || (paras.length > 1 ? paras.find((p) => p.toLowerCase().includes(name)) : null)
    || null;
}

/** First clause of a paragraph, for an accordion summary. No lookbehind:
 *  older Safari rejects the whole module at parse time. */
function paragraphTitle(p) {
  const head = p.split(/\s(?=ข้อ\s\d)|\sเป็นคำตอบ|\sคือ\s|\. /)[0] || p;
  return head.length > 90 ? head.slice(0, 88) + ' ' : head;
}

/**
 * A matching question on the review page: one row per item, the student's
 * card against the answer, wrong rows first by default, and the explain as
 * one section per organism, open only where the student slipped.
 */
export function MatchReview({ q, userAns, answered }) {
  const bank = Array.isArray(q.bank) && q.bank.length ? q.bank : null;
  const letterOf = (r) => (bank ? String.fromCharCode(65 + bank.indexOf(r)) + '. ' : '');
  const rows = q.pairs.map((p, i) => {
    const ua = answered && userAns ? (Array.isArray(userAns) ? userAns[i] : userAns[i]) : '';
    return { i, left: p.left, right: p.right, ua: ua || '', ok: Boolean(ua) && ua === p.right };
  });
  const wrong = rows.filter((r) => !r.ok);
  const [onlyWrong, setOnlyWrong] = useState(wrong.length > 0 && wrong.length < rows.length);
  const [openRows, setOpenRows] = useState(() => new Set());
  const shown = onlyWrong ? wrong : rows;
  const paras = useMemo(() => explainParagraphs(q.explain), [q.explain]);
  const missedNames = [...new Set(wrong.map((r) => strip(r.right).toLowerCase()))];
  // Several paragraphs read better as sections: the printed sets explain
  // organism by organism (each paragraph opens with the name), a session
  // bank paragraph by source set. A section opens by itself when it names
  // an organism the student missed.
  const sectioned = paras.length > 1;
  return (
    <div className="vmx-match-review">
      <div className="vmx-match-review-head">
        <span className="vmx-match-review-score">ได้ <strong>{rows.length - wrong.length}/{rows.length}</strong> ข้อ</span>
        {wrong.length > 0 && wrong.length < rows.length && (
          <label className="vmx-match-review-filter">
            <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} /> แสดงเฉพาะที่ผิด ({wrong.length})
          </label>
        )}
      </div>
      <ol className="vmx-match-review-rows">
        {shown.map((r) => {
          const open = openRows.has(r.i);
          return (
            <li key={r.i} className={`vmx-match-review-row ${r.ok ? 'is-ok' : (r.ua ? 'is-wrong' : 'is-blank')}`}>
              <span className="n">{r.i + 1}</span>
              <div className="body">
                <button type="button" className={`left${open ? ' is-open' : ''}`} onClick={() => setOpenRows((s) => { const n = new Set(s); n.has(r.i) ? n.delete(r.i) : n.add(r.i); return n; })} title={open ? 'ย่อโจทย์' : 'อ่านโจทย์เต็ม'}>
                  <RichText text={r.left} />
                </button>
                <div className="ans">
                  {r.ok
                    ? <span className="ok">✓ {letterOf(r.right)}{strip(r.right)}</span>
                    : (
                      <>
                        <span className="you">{r.ua ? `คุณตอบ ${letterOf(r.ua)}${strip(r.ua)}` : 'ไม่ได้ตอบ'}</span>
                        <span className="key">เฉลย {letterOf(r.right)}{strip(r.right)}</span>
                      </>
                    )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {q.explain && (sectioned ? (
        <div className="vmx-explain-acc">
          <div className="k">เหตุผล</div>
          {paras.map((p, k) => {
            const lower = p.toLowerCase();
            const name = bank ? bank.find((b) => lower.startsWith(strip(b).toLowerCase())) : null;
            const missed = name ? missedNames.includes(strip(name).toLowerCase()) : missedNames.some((n) => lower.includes(n));
            return (
              <details key={k} open={missed || undefined} className={missed ? 'is-missed' : ''}>
                <summary>{name ? `${letterOf(name)}${strip(name)}` : paragraphTitle(p)}{missed ? ' — มีข้อที่พลาด' : ''}</summary>
                <RichText text={p} />
              </details>
            );
          })}
        </div>
      ) : (
        <div className="vmx-review-explain"><span className="k">เหตุผล:</span><RichText text={q.explain} /></div>
      ))}
    </div>
  );
}

/**
 * A written question's เฉลย inside the session: the keyword checklist
 * against what the student has written so far (live, so a missing point
 * can still be added), the model answer, the explain.
 */
export function WrittenReveal({ q, answer, subject }) {
  const text = typeof answer === 'string' ? answer : '';
  const cov = keywordCoverage(text, q.keywords);
  return (
    <div className="vmx-written-reveal" role="status">
      {cov && (
        <div className="vmx-written-reveal-kw">
          <div className="k">คีย์เวิร์ดที่ควรมี <span className="c">{cov.found.length}/{cov.found.length + cov.missing.length}</span></div>
          <ul className="vmx-kw-list">
            {(q.keywords || []).map((kw) => {
              const hit = cov.found.includes(kw);
              return <li key={kw} className={hit ? 'is-found' : 'is-missing'}><span aria-hidden="true">{hit ? '✓' : '○'}</span> {kw}</li>;
            })}
          </ul>
          {cov.missing.length > 0 && <div className="vmx-written-reveal-hint">ยังเขียนต่อได้ รายการจะอัปเดตตามที่พิมพ์</div>}
        </div>
      )}
      {q.model_answer && (
        <div className="vmx-written-reveal-model">
          <div className="k">คำตอบตัวอย่าง</div>
          <TermLinkedRichText text={q.model_answer} subject={subject} />
        </div>
      )}
      {q.explain && (
        <div className="vmx-written-reveal-why">
          <div className="k">เหตุผล</div>
          <TermLinkedRichText text={q.explain} subject={subject} />
        </div>
      )}
    </div>
  );
}
