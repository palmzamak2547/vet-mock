import { useMemo, useState, useRef, useCallback } from 'react';
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
  const [dragCoord, setDragCoord] = useState(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null); // for tap-to-assign fallback
  const [selectedRight, setSelectedRight] = useState(null); // for tap-to-assign right-first

  const slotsRef = useRef([]);
  const pointerStartRef = useRef(null);

  const rightPool = useMemo(() => shuffledRights(currentQ), [currentQ.id, currentQ.subject, currentQ.pairs, currentQ.distractors, currentQ.shuffle]);

  const ans = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
  const getVal = (i) => (Array.isArray(ans) ? ans[i] : ans[i]) || '';

  // For visual: which rights are already used? (one-to-one)
  const usedRights = new Set(Object.values(ans).filter(Boolean));

  const isRevealed = Boolean(revealAnswer);

  const setPair = useCallback((leftIdx, rightVal) => {
    const obj = { ...(Array.isArray(ans) ? Object.fromEntries(ans.map((v, i) => [i, v])) : ans) };
    // If rightVal already used elsewhere, remove old assignment
    if (rightVal) {
      for (const [k, v] of Object.entries(obj)) {
        if (Number(k) !== leftIdx && v === rightVal) delete obj[k];
      }
    }
    if (!rightVal) delete obj[leftIdx];
    else obj[leftIdx] = rightVal;
    answerCurrent(obj);
  }, [ans, answerCurrent]);

  const findSlotIndexAtPoint = useCallback((x, y) => {
    if (!slotsRef.current) return null;
    for (let i = 0; i < slotsRef.current.length; i++) {
      const el = slotsRef.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i;
      }
    }
    return null;
  }, []);

  const handleCardTap = useCallback((rightVal) => {
    if (isRevealed) return;
    if (selectedLeft != null) {
      setPair(selectedLeft, rightVal);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight((prev) => (prev === rightVal ? null : rightVal));
    }
  }, [isRevealed, selectedLeft, setPair]);

  const handleSlotTap = useCallback((leftIdx) => {
    if (isRevealed) return;
    if (selectedRight != null) {
      setPair(leftIdx, selectedRight);
      setSelectedRight(null);
      setSelectedLeft(null);
    } else {
      setSelectedLeft((prev) => (prev === leftIdx ? null : leftIdx));
    }
  }, [isRevealed, selectedRight, setPair]);

  const handlePointerDown = (e, rightVal) => {
    if (isRevealed) return;
    if (e.button !== undefined && e.button !== 0) return;
    pointerStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      rightVal,
      isDragging: false,
    };
  };

  const handlePointerMove = (e) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;

    const dx = e.clientX - start.startX;
    const dy = e.clientY - start.startY;
    const dist = Math.hypot(dx, dy);

    if (!start.isDragging) {
      if (dist > 5) {
        start.isDragging = true;
        setDraggedRight(start.rightVal);
        setSelectedRight(null);
        try {
          e.currentTarget?.setPointerCapture?.(e.pointerId);
        } catch {}
      }
    }

    if (start.isDragging) {
      setDragCoord({ x: e.clientX, y: e.clientY });
      const slotIdx = findSlotIndexAtPoint(e.clientX, e.clientY);
      setHoveredSlotIndex(slotIdx);
    }
  };

  const handlePointerUp = (e) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    pointerStartRef.current = null;

    try {
      e.currentTarget?.releasePointerCapture?.(e.pointerId);
    } catch {}

    if (start.isDragging) {
      const slotIdx = findSlotIndexAtPoint(e.clientX, e.clientY);
      if (slotIdx !== null && slotIdx >= 0 && slotIdx < currentQ.pairs.length) {
        setPair(slotIdx, start.rightVal);
      }
      setDraggedRight(null);
      setDragCoord(null);
      setHoveredSlotIndex(null);
    } else {
      handleCardTap(start.rightVal);
    }
  };

  const handlePointerCancel = (e) => {
    if (pointerStartRef.current?.pointerId === e.pointerId) {
      pointerStartRef.current = null;
      setDraggedRight(null);
      setDragCoord(null);
      setHoveredSlotIndex(null);
    }
  };

  return (
    <div className="vmx-match-dnd">
      <div className="vmx-match-dnd-header">
        <span className="vmx-match-dnd-hint">ลาก <strong>การ์ดขวา</strong> ไปวางที่ <strong>ช่องซ้าย</strong> — หรือแตะซ้ายแล้วเลือกขวา (รองรับมือถือ/ทัชสกรีน/คีย์บอร์ด)</span>
        {Object.keys(ans).length > 0 && !isRevealed && (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setSelectedLeft(null); setSelectedRight(null); answerCurrent({}); }}>ล้างทั้งหมด</button>
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
            const isHovered = hoveredSlotIndex === i;
            let state = 'empty';
            if (isRevealed && isAnswered) state = isCorrect ? 'correct' : 'wrong';
            else if (isAnswered) state = 'filled';
            if (isSelected) state += ' is-selected';
            if (isHovered) state += ' is-drag-over';

            return (
              <div
                key={i}
                ref={(el) => { slotsRef.current[i] = el; }}
                data-slot-idx={i}
                className={`vmx-match-dnd-slot ${state} ${isSelected ? 'selected' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setHoveredSlotIndex(i);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget === e.target) {
                    setHoveredSlotIndex(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const valDrop = e.dataTransfer?.getData('text/plain') || draggedRight;
                  if (valDrop) setPair(i, valDrop);
                  setDraggedRight(null);
                  setDragCoord(null);
                  setHoveredSlotIndex(null);
                }}
                onClick={() => handleSlotTap(i)}
                role="button"
                tabIndex={0}
                aria-label={`ซ้าย ${i+1}: ${strip(pair.left)} ${val ? 'จับคู่กับ ' + strip(val) : 'ว่าง'}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSlotTap(i); } }}
              >
                <div className="vmx-match-dnd-left"><RichText text={pair.left} /></div>
                <div className="vmx-match-dnd-target" aria-hidden>
                  {val ? <span className="vmx-match-dnd-chip">{strip(val)}</span> : <span className="vmx-match-dnd-placeholder">วางที่นี่</span>}
                  {val && !isRevealed && (
                    <button
                      type="button"
                      className="vmx-match-dnd-clear"
                      aria-label={`ลบการจับคู่ ${i+1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPair(i, '');
                        if (selectedLeft === i) setSelectedLeft(null);
                      }}
                    >
                      ×
                    </button>
                  )}
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
            const isCardSelected = selectedRight === r;
            return (
              <div
                key={r + '-' + idx}
                role="button"
                tabIndex={isRevealed ? -1 : 0}
                draggable={!isRevealed}
                aria-selected={isUsed || isCardSelected}
                aria-disabled={isRevealed || undefined}
                className={`vmx-match-dnd-card ${isUsed ? 'is-used' : ''} ${isDragging ? 'is-dragging' : ''} ${isCardSelected ? 'is-selected' : ''}`}
                onPointerDown={(e) => handlePointerDown(e, r)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onDragStart={(e) => {
                  if (isRevealed) return;
                  setDraggedRight(r);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', r);
                }}
                onDragEnd={() => {
                  setDraggedRight(null);
                  setHoveredSlotIndex(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardTap(r);
                  }
                }}
                title={isUsed ? 'ใช้แล้ว — แตะหรือลากเพื่อเปลี่ยนตำแหน่ง' : 'ลากหรือแตะเพื่อจับคู่'}
              >
                {strip(r)}
                {isUsed && <span className="vmx-match-dnd-used-dot" aria-hidden>• ใช้แล้ว</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating ghost card while dragging */}
      {dragCoord && draggedRight && (
        <div
          className="vmx-match-dnd-floating-ghost"
          style={{
            left: dragCoord.x,
            top: dragCoord.y,
          }}
        >
          {strip(draggedRight)}
        </div>
      )}

      {/* Keyboard fallback: native selects (screen reader / no-drag) */}
      <details className="vmx-match-dnd-fallback">
        <summary>⌨️ ใช้แป้นพิมพ์ / เมนูตัวเลือก (fallback)</summary>
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
            for (let i = 0; i < currentQ.pairs.length; i++) if (getVal(i) === currentQ.pairs[i].right) correct++;
            const total = currentQ.pairs.length;
            const pct = Math.round((correct / total) * 100);
            return <span>ได้ {correct}/{total} ({pct}%) {correct === total ? '— ถูกต้องทั้งหมด ✓' : correct === 0 ? '— ลองใหม่' : '— ได้บางส่วน'}</span>;
          })()}
        </div>
      )}
    </div>
  );
}
