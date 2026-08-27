import { useMemo, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';

// Stable shuffle — same mulberry32 as Question.jsx MCQ shuffle
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

function strip(s) { return String(s||'').replace(/\*\*/g,'').replace(/\*/g,'').trim(); }

export default function MatchDragDrop({ currentQ, currentAnswer, answerCurrent, revealAnswer }) {
  const [draggedRight, setDraggedRight] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null); // for tap-to-assign fallback

  const rightPool = useMemo(() => shuffledRights(currentQ), [currentQ.id, currentQ.subject, currentQ.pairs, currentQ.distractors, currentQ.shuffle]);

  const ans = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
  const getVal = (i) => (Array.isArray(ans) ? ans[i] : ans[i]) || '';

  // For visual: which rights are already used? (allow reuse? No — one-to-one)
  const usedRights = new Set(Object.values(ans).filter(Boolean));

  const setPair = (leftIdx, rightVal) => {
    const obj = { ...(Array.isArray(ans) ? Object.fromEntries(ans.map((v,i)=>[i,v])) : ans) };
    // If rightVal already used elsewhere, swap
    if (rightVal) {
      for (const [k, v] of Object.entries(obj)) {
        if (Number(k) !== leftIdx && v === rightVal) delete obj[k];
      }
    }
    if (!rightVal) delete obj[leftIdx];
    else obj[leftIdx] = rightVal;
    answerCurrent(obj);
  };

  const onDrop = (e, leftIdx) => {
    e.preventDefault();
    const val = e.dataTransfer?.getData('text/plain') || draggedRight;
    if (val) setPair(leftIdx, val);
    setDraggedRight(null);
  };
  const onDragOver = (e) => e.preventDefault();

  const isRevealed = Boolean(revealAnswer);
  // partial feedback: no revealAnswer => interactive; revealAnswer => show correctness per row

  return (
    <div className="vmx-match-dnd">
      <div className="vmx-match-dnd-header">
        <span className="vmx-match-dnd-hint">ลาก <strong>การ์ดขวา</strong> ไปวางที่ <strong>ช่องซ้าย</strong> — หรือแตะซ้ายแล้วเลือกขวา (รองรับมือถือ/คีย์บอร์ด)</span>
        {Object.keys(ans).length > 0 && !isRevealed && (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => answerCurrent({})}>ล้างทั้งหมด</button>
        )}
      </div>

      <div className="vmx-match-dnd-grid">
        {/* Left column */}
        <div className="vmx-match-dnd-leftcol">
          {currentQ.pairs.map((pair, i) => {
            const val = getVal(i);
            const isCorrect = val === pair.right;
            const isAnswered = Boolean(val);
            const isSelected = selectedLeft === i;
            let state = 'empty';
            if (isRevealed && isAnswered) state = isCorrect ? 'correct' : 'wrong';
            else if (isAnswered) state = 'filled';
            if (isSelected) state += ' is-selected';

            return (
              <div
                key={i}
                className={`vmx-match-dnd-slot ${state} ${isSelected ? 'selected' : ''}`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, i)}
                onClick={() => setSelectedLeft(isSelected ? null : i)}
                role="button"
                tabIndex={0}
                aria-label={`ซ้าย ${i+1}: ${strip(pair.left)} ${val ? 'จับคู่กับ ' + strip(val) : 'ว่าง'}`}
                onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); setSelectedLeft(isSelected?null:i); } }}
              >
                <div className="vmx-match-dnd-left"><RichText text={pair.left} /></div>
                <div className="vmx-match-dnd-target" aria-hidden>
                  {val ? <span className="vmx-match-dnd-chip">{strip(val)}</span> : <span className="vmx-match-dnd-placeholder">วางที่นี่</span>}
                  {val && !isRevealed && <button type="button" className="vmx-match-dnd-clear" aria-label={`ลบการจับคู่ ${i+1}`} onClick={(e) => { e.stopPropagation(); setPair(i, ''); setSelectedLeft(null); }}>×</button>}
                </div>
                {isRevealed && isAnswered && (
                  <span className={`vmx-match-dnd-badge ${isCorrect ? 'ok' : 'no'}`} aria-hidden>{isCorrect ? '✓' : '✗'}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right pool */}
        <div className="vmx-match-dnd-rightcol" role="listbox" aria-label="ตัวเลือกด้านขวา (ลากหรือแตะเพื่อจับคู่)">
          {rightPool.map((r, idx) => {
            const isUsed = usedRights.has(r);
            const isDragging = draggedRight === r;
            return (
              <button
                key={r + '-' + idx}
                type="button"
                draggable={!isRevealed}
                role="option"
                aria-selected={isUsed}
                aria-disabled={isRevealed || undefined}
                className={`vmx-match-dnd-card ${isUsed ? 'is-used' : ''} ${isDragging ? 'is-dragging' : ''}`}
                onDragStart={(e) => { if (isRevealed) return; setDraggedRight(r); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', r); }}
                onDragEnd={() => setDraggedRight(null)}
                onClick={() => {
                  if (isRevealed) return;
                  if (selectedLeft != null) {
                    setPair(selectedLeft, r);
                    setSelectedLeft(null);
                  } else {
                    // assign to first empty slot
                    const empty = currentQ.pairs.findIndex((_, i) => !getVal(i));
                    if (empty !== -1) setPair(empty, r);
                    else {
                      // all filled — replace last selected or first
                      setPair(0, r);
                    }
                  }
                }}
                title={isUsed ? 'ใช้แล้ว — แตะเพื่อย้าย' : 'ลากหรือแตะเพื่อจับคู่'}
              >
                {strip(r)}
                {isUsed && <span className="vmx-match-dnd-used-dot" aria-hidden>• ใช้แล้ว</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard fallback: native selects (screen reader / no-drag) */}
      <details className="vmx-match-dnd-fallback">
        <summary>⌨️ ใช้แป้นพิมพ์ / โปรแกรมอ่านหน้าจอ (fallback)</summary>
        <div className="vmx-match-row" style={{ marginTop: 8 }}>
          {currentQ.pairs.map((pair, i) => (
            <div key={i} className="vmx-match-item">
              <div className="vmx-match-left"><RichText text={pair.left} /></div>
              <select
                className="vmx-match-select"
                value={getVal(i)}
                aria-label={`จับคู่รายการที่ ${i + 1}: ${strip(pair.left)}`}
                disabled={isRevealed}
                onChange={(e) => setPair(i, e.target.value)}
              >
                <option value="">— เลือก —</option>
                {rightPool.map((r, j) => <option key={j} value={r}>{strip(r)}</option>)}
              </select>
            </div>
          ))}
        </div>
      </details>

      {isRevealed && (
        <div className="vmx-match-dnd-reveal" role="status">
          {(() => {
            let correct = 0;
            for (let i=0;i<currentQ.pairs.length;i++) if (getVal(i)===currentQ.pairs[i].right) correct++;
            const total = currentQ.pairs.length;
            const pct = Math.round(correct/total*100);
            return <span>ได้ {correct}/{total} ({pct}%) {correct===total ? '— ถูกต้องทั้งหมด ✓' : correct===0 ? '— ลองใหม่' : '— ได้บางส่วน'}</span>;
          })()}
        </div>
      )}
    </div>
  );
}
