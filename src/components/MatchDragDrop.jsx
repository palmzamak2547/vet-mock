import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { useRevealTiming, RevealTimingToggle, REVEAL_ROW, explainParagraphFor } from './AnswerReveal.jsx';

const SESSION_SEED = (() => {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0];
    }
  } catch {}
  return ((Date.now() & 0xffffffff) ^ (Math.random() * 0xffffffff)) >>> 0;
})();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledRights(q) {
  const pool = [
    ...q.pairs.map((p) => p.right),
    ...((Array.isArray(q.distractors) ? q.distractors : [])),
  ];
  if (q.shuffle === false) return pool;
  const idNum = Number.isFinite(q.id)
    ? q.id
    : Array.from(String((q.subject || '') + ':' + (q.id || ''))).reduce((h, ch) => ((h * 31) + ch.charCodeAt(0)) >>> 0, 0);
  const rand = mulberry32((idNum ^ SESSION_SEED) >>> 0);
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function strip(s) { return String(s || '').replace(/\*\*/g, '').replace(/\*/g, '').trim(); }

// Rows that have shown their answer ("เฉลยทีละข้อ"), per question, for this
// page load. A row that printed its key stays locked for the rest of the
// set: neither ล้างทั้งหมด nor switching to "เฉลยหลังทำครบ" may reopen it, or
// the key just read could be entered and scored as the student's own. Kept
// outside the component because one instance serves consecutive questions
// (ExamView renders the card without a key) and a set may be revisited.
const LOCKED = new Map();
const lockKey = (q) => `${q?.subject || '?'}:${q?.id}`;

// Keys that move a closed <select>'s value on Windows (and fire change at
// once) without the student having settled on an option.
const BROWSE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

export default function MatchDragDrop({ currentQ, currentAnswer, answerCurrent, revealAnswer }) {
  // A printed matching set: `bank` is the answer list in printed order (A, B,
  // C ...) and the items reuse those letters — seven viruses across eighteen
  // statements. So the pool is the bank itself, unshuffled, and a letter is
  // never "used up". Without `bank` this is the ordinary one-to-one match.
  const bank = Array.isArray(currentQ.bank) && currentQ.bank.length ? currentQ.bank : null;
  const rightPool = useMemo(
    () => (bank ? bank : shuffledRights(currentQ)),
    [bank, currentQ.id, currentQ.subject, currentQ.pairs, currentQ.distractors, currentQ.shuffle],
  );
  const letterOf = (r) => (bank ? String.fromCharCode(65 + bank.indexOf(r)) : '');

  const ans = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
  const getVal = (i) => (Array.isArray(ans) ? ans[i] : ans[i]) || '';

  const usedRights = new Set(Object.values(ans).filter(Boolean));
  const filledCount = Object.values(ans).filter(Boolean).length;
  const totalSlots = currentQ.pairs.length;

  // `revealAnswer` is the instant-feedback SETTING — true for the whole
  // practice session, not a statement about this question. Reading it
  // directly disabled every dropdown and printed the answer key before the
  // student had touched a match question, so with instant feedback on (the
  // default) match questions were unanswerable and spoiled at once.
  //
  // MCQ already gets this right one file up: it reveals only once an
  // answer is on record. The equivalent for a match question is all pairs
  // filled — revealing after the first selection would lock the rest.
  const isRevealed = Boolean(revealAnswer) && totalSlots > 0 && filledCount === totalSlots;
  // The student's choice (AnswerReveal): with "เฉลยทีละข้อ" a row shows its
  // verdict and answer as soon as its choice is committed, and locks for the
  // rest of the set (see `locked` below); the set's score
  // banner still waits for the last row. "เฉลยหลังทำครบ" is the rule above.
  // Scoring never changes — only when a row shows what it holds.
  const [timing, setTiming] = useRevealTiming();
  const rowReveals = Boolean(revealAnswer) && timing === REVEAL_ROW;

  // Which rows are locked. A row locks when its choice is committed in row
  // mode: at once for a pick from the option list (touch, mouse), and on
  // leaving the row or Enter when the keyboard is browsing, because arrow
  // keys and type-ahead on a closed select change its value on every step.
  // Entering a set, the rows already answered in row mode count as seen.
  const qKey = lockKey(currentQ);
  const answeredIdx = () => Object.keys(ans).filter((k) => ans[k]).map(Number);
  const answered = answeredIdx();
  const [locked, setLocked] = useState(() => new Set());
  const [lockedFor, setLockedFor] = useState(null);
  const [wasRow, setWasRow] = useState(rowReveals);
  let nextLocked = null;
  if (lockedFor !== qKey) {
    // A new set (or the same set again): what was already seen stays seen.
    nextLocked = new Set([...(LOCKED.get(qKey) || [])].filter((i) => answered.includes(i)));
    if (rowReveals) for (const i of answered) nextLocked.add(i);
    setLockedFor(qKey);
  } else if (locked.size > 0 && answered.length === 0) {
    // Locked rows are never cleared inside a set, so an empty answer is a
    // fresh start of the same question (a new session): nothing is seen.
    nextLocked = new Set();
  } else if (rowReveals && !wasRow) {
    // Switched to row by row: the rows already filled show their answer.
    nextLocked = new Set([...locked, ...answered]);
  }
  if (rowReveals !== wasRow) setWasRow(rowReveals);
  if (nextLocked) {
    LOCKED.set(qKey, nextLocked);
    setLocked(nextLocked);
  }
  const lastLocked = useRef(null);
  const lockRow = (i) => {
    if (!rowReveals || locked.has(i)) return;
    const next = new Set(locked);
    next.add(i);
    LOCKED.set(qKey, next);
    lastLocked.current = i;
    setLocked(next);
  };
  const browsing = useRef(null); // row index the keyboard is stepping through

  const setPair = useCallback((leftIdx, rightVal) => {
    let obj = {};
    if (ans && typeof ans === 'object') {
      if (Array.isArray(ans)) {
        ans.forEach((v, i) => { if (v) obj[i] = v; });
      } else {
        obj = { ...ans };
      }
    }
    
    // Remove the rightVal from other slots if it's already used — not in a
    // bank set, where the same letter answers several items.
    if (rightVal && !bank) {
      for (const k of Object.keys(obj)) {
        if (obj[k] === rightVal && Number(k) !== leftIdx) {
          delete obj[k];
        }
      }
    }
    
    if (!rightVal) {
      delete obj[leftIdx];
    } else {
      obj[leftIdx] = rightVal;
    }
    
    answerCurrent(obj);
  }, [ans, answerCurrent, bank]);

  // Revealing the answer disables every select at once. Whichever one the
  // keyboard user was standing on stops being focusable, so the browser drops
  // focus to <body> and the next Tab restarts from the top of the page. Catch
  // it and hand focus to this block, so Tab continues from the question they
  // just answered.
  const rootRef = useRef(null);
  const selectRefs = useRef([]);
  useEffect(() => {
    if (!isRevealed) return;
    const root = rootRef.current;
    if (!root) return;
    const active = document.activeElement;
    // Only intervene if focus was inside here AND has been let go.
    if (active && active !== document.body && root.contains(active)) return;
    if (active && active !== document.body) return;
    root.focus({ preventScroll: true });
  }, [isRevealed]);
  // The same drop, one row at a time: a row locked from the option list
  // disables the select that holds focus. Hand focus to the next open row,
  // or to this block when none is left.
  useEffect(() => {
    const i = lastLocked.current;
    if (i == null) return;
    lastLocked.current = null;
    if (typeof document === 'undefined') return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    const n = currentQ.pairs.length;
    for (let j = 1; j < n; j++) {
      const k = (i + j) % n;
      if (!locked.has(k) && !getVal(k)) {
        const el = selectRefs.current[k];
        if (el) { el.focus({ preventScroll: true }); return; }
      }
    }
    rootRef.current?.focus({ preventScroll: true });
  }, [locked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filled rows the student may still change (for ล้างทั้งหมด).
  const clearable = answered.filter((i) => !locked.has(i));

  return (
    <div className="vmx-match-dnd" ref={rootRef} tabIndex={-1} style={{ outline: 'none' }}>
      <div className="vmx-match-dnd-header">
        <div className="vmx-match-dnd-status">
          <span className="vmx-match-dnd-hint" style={{ fontSize: '15px' }}>
            💡 <strong>เลือกคำตอบ</strong> {bank ? 'ตามตัวอักษรของรายการด้านล่างในแต่ละข้อ ตัวเลือกใช้ซ้ำได้' : 'จากเมนูตัวเลือกในแต่ละข้อ'} ({filledCount}/{totalSlots} ข้อ)
          </span>
          {revealAnswer && <RevealTimingToggle mode={timing} onChange={setTiming} />}
        </div>
        {clearable.length > 0 && !isRevealed && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-match-clear-all-btn"
            onClick={() => {
              // Rows that have shown their answer keep it; only open rows clear.
              const keep = {};
              for (const i of locked) { const v = getVal(i); if (v) keep[i] = v; }
              answerCurrent(keep);
            }}
            title={locked.size ? 'ล้างคำตอบของข้อที่ยังไม่เฉลย' : 'ล้างคำตอบทั้งหมด'}
          >
            🗑️ ล้างทั้งหมด
          </button>
        )}
      </div>

      {bank && (
        <ol className="vmx-match-bank" aria-label="รายการคำตอบ">
          {bank.map((r, k) => (
            <li key={k}><span className="vmx-match-bank-letter">{String.fromCharCode(65 + k)}.</span> <RichText text={r} /></li>
          ))}
        </ol>
      )}

      <div className="vmx-match-select-grid">
        {currentQ.pairs.map((pair, i) => {
          const val = getVal(i);
          const isCorrect = val === pair.right;
          const isAnswered = Boolean(val);
          const revealed = isRevealed || (locked.has(i) && isAnswered);
          // The set's explain is written organism by organism; a wrong row
          // gets the paragraph of the card it should have chosen.
          const why = revealed && isAnswered && !isCorrect ? explainParagraphFor(currentQ.explain, pair.right) : null;
          
          let stateClass = 'empty';
          if (revealed && isAnswered) stateClass = isCorrect ? 'correct' : 'wrong';
          else if (isAnswered) stateClass = 'filled';

          return (
            <div key={i} className={`vmx-match-select-row ${stateClass}`}>
              <div className="vmx-match-select-left">
                <span className="vmx-match-dnd-slot-num">{i + 1}</span>
                <div className="vmx-match-select-text">
                  <RichText text={pair.left} />
                </div>
              </div>
              
              <div className="vmx-match-select-right">
                <select
                  ref={(el) => { selectRefs.current[i] = el; }}
                  className={`vmx-match-native-select ${isAnswered ? 'has-value' : ''}`}
                  value={val}
                  disabled={revealed}
                  onKeyDown={(e) => {
                    if (BROWSE_KEYS.has(e.key) || (String(e.key || '').length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) browsing.current = i;
                    else if (e.key === 'Enter' && val) { browsing.current = null; lockRow(i); }
                  }}
                  onChange={(e) => {
                    setPair(i, e.target.value);
                    if (e.target.value && browsing.current !== i) lockRow(i);
                  }}
                  onBlur={() => {
                    if (browsing.current === i) browsing.current = null;
                    if (val) lockRow(i);
                  }}
                  aria-label={`จับคู่ข้อ ${i + 1}: ${strip(pair.left)}`}
                >
                  <option value="">— เลือกคำตอบ —</option>
                  {rightPool.map((r, j) => {
                    const isUsedElsewhere = !bank && usedRights.has(r) && r !== val;
                    const label = bank ? `${letterOf(r)}. ${strip(r)}` : strip(r);
                    return (
                      <option key={j} value={r} disabled={isUsedElsewhere}>
                        {isUsedElsewhere ? `[ใช้แล้ว] ${label}` : label}
                      </option>
                    );
                  })}
                </select>
                
                {revealed && isAnswered && (
                  <span className={`vmx-match-dnd-badge ${isCorrect ? 'ok' : 'no'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}

                {/* The answer, on the row it belongs to.
                    After revealing, this screen showed the student's own choice
                    in a disabled select and a ✗ beside it, while the banner said
                    "ดูเฉลยด้านล่าง" — and nothing below it carried the answer.
                    pair.right was never rendered anywhere, so a student who got
                    three of four pairs wrong could not find out what the right
                    pairing was from the page that told them to look. */}
                {revealed && !isCorrect && (
                  <div className="vmx-match-answer">
                    <span className="vmx-match-answer-label">เฉลย</span>
                    <span className="vmx-match-answer-text">{bank ? `${letterOf(pair.right)}. ` : ''}{strip(pair.right)}</span>
                    {why && (
                      <details className="vmx-match-why">
                        <summary>เหตุผล</summary>
                        <RichText text={why} />
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isRevealed && (
        <div className="vmx-match-dnd-reveal" role="status">
          {(() => {
            let correct = 0;
            for (let i = 0; i < currentQ.pairs.length; i++) {
              if (getVal(i) === currentQ.pairs[i].right) correct++;
            }
            const total = currentQ.pairs.length;
            const pct = Math.round((correct / total) * 100);
            const isAllCorrect = correct === total;
            return (
              <div className={`vmx-match-reveal-banner ${isAllCorrect ? 'pass' : correct > 0 ? 'partial' : 'fail'}`}>
                <span className="vmx-match-reveal-score">
                  {isAllCorrect ? '🎉' : correct > 0 ? '⚡' : '❌'} ได้ <strong>{correct}/{total}</strong> คู่ ({pct}%)
                </span>
                <span className="vmx-match-reveal-msg">
                  {isAllCorrect
                    ? 'ถูกต้องครบทุกคู่!'
                    : 'เฉลยของคู่ที่ยังไม่ถูก แสดงไว้ใต้ช่องคำตอบของคู่นั้นแล้ว'}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
