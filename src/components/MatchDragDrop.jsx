import { useMemo, useCallback, useRef, useEffect } from 'react';
import { RichText } from '../lib/richtext.jsx';

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

export default function MatchDragDrop({ currentQ, currentAnswer, answerCurrent, revealAnswer }) {
  const rightPool = useMemo(() => shuffledRights(currentQ), [currentQ.id, currentQ.subject, currentQ.pairs, currentQ.distractors, currentQ.shuffle]);

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

  const setPair = useCallback((leftIdx, rightVal) => {
    let obj = {};
    if (ans && typeof ans === 'object') {
      if (Array.isArray(ans)) {
        ans.forEach((v, i) => { if (v) obj[i] = v; });
      } else {
        obj = { ...ans };
      }
    }
    
    // Remove the rightVal from other slots if it's already used
    if (rightVal) {
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
  }, [ans, answerCurrent]);

  // Revealing the answer disables every select at once. Whichever one the
  // keyboard user was standing on stops being focusable, so the browser drops
  // focus to <body> and the next Tab restarts from the top of the page. Catch
  // it and hand focus to this block, so Tab continues from the question they
  // just answered.
  const rootRef = useRef(null);
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

  return (
    <div className="vmx-match-dnd" ref={rootRef} tabIndex={-1} style={{ outline: 'none' }}>
      <div className="vmx-match-dnd-header">
        <div className="vmx-match-dnd-status">
          <span className="vmx-match-dnd-hint" style={{ fontSize: '15px' }}>
            💡 <strong>เลือกคำตอบ</strong> จากเมนูตัวเลือกในแต่ละข้อ ({filledCount}/{totalSlots} ข้อ)
          </span>
        </div>
        {filledCount > 0 && !isRevealed && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-match-clear-all-btn"
            onClick={() => answerCurrent({})}
            title="ล้างคำตอบทั้งหมด"
          >
            🗑️ ล้างทั้งหมด
          </button>
        )}
      </div>

      <div className="vmx-match-select-grid">
        {currentQ.pairs.map((pair, i) => {
          const val = getVal(i);
          const isCorrect = val === pair.right;
          const isAnswered = Boolean(val);
          
          let stateClass = 'empty';
          if (isRevealed && isAnswered) stateClass = isCorrect ? 'correct' : 'wrong';
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
                  className={`vmx-match-native-select ${isAnswered ? 'has-value' : ''}`}
                  value={val}
                  disabled={isRevealed}
                  onChange={(e) => setPair(i, e.target.value)}
                  aria-label={`จับคู่ข้อ ${i + 1}: ${strip(pair.left)}`}
                >
                  <option value="">— เลือกคำตอบ —</option>
                  {rightPool.map((r, j) => {
                    const isUsedElsewhere = usedRights.has(r) && r !== val;
                    return (
                      <option key={j} value={r} disabled={isUsedElsewhere}>
                        {isUsedElsewhere ? `[ใช้แล้ว] ${strip(r)}` : strip(r)}
                      </option>
                    );
                  })}
                </select>
                
                {isRevealed && isAnswered && (
                  <span className={`vmx-match-dnd-badge ${isCorrect ? 'ok' : 'no'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
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
                  {isAllCorrect ? 'ถูกต้องครบทุกคู่!' : correct > 0 ? 'ถูกบางคู่ — ดูเฉลยด้านล่าง' : 'ยังไม่ถูก — ลองศึกษาเฉลยอีกครั้ง'}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
