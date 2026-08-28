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

function strip(s) { return String(s || '').replace(/\*\*/g, '').replace(/\*/g, '').trim(); }

export default function MatchDragDrop({ currentQ, currentAnswer, answerCurrent, revealAnswer }) {
  const [draggedRight, setDraggedRight] = useState(null);
  const [dragCoord, setDragCoord] = useState(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null); // for tap-to-assign left-first
  const [selectedRight, setSelectedRight] = useState(null); // for tap-to-assign right-first

  const slotsRef = useRef([]);
  const pointerStartRef = useRef(null);

  const rightPool = useMemo(() => shuffledRights(currentQ), [currentQ.id, currentQ.subject, currentQ.pairs, currentQ.distractors, currentQ.shuffle]);

  const ans = currentAnswer && typeof currentAnswer === 'object' ? currentAnswer : {};
  const getVal = (i) => (Array.isArray(ans) ? ans[i] : ans[i]) || '';

  // For visual: which rights are already used? (one-to-one)
  const usedRights = new Set(Object.values(ans).filter(Boolean));
  const filledCount = Object.values(ans).filter(Boolean).length;
  const totalSlots = currentQ.pairs.length;

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
      setSelectedLeft(null);
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
      setSelectedRight(null);
      setSelectedLeft((prev) => (prev === leftIdx ? null : leftIdx));
    }
  }, [isRevealed, selectedRight, setPair]);

  const handlePointerDown = (e, rightVal) => {
    if (isRevealed) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    e.stopPropagation(); // Prevent parent handlers

    pointerStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      rightVal,
      isDragging: false,
      lastX: e.clientX,
      lastY: e.clientY,
      currentSlot: null,
    };

    const onMove = (ev) => {
      if (ev.pointerId !== pointerStartRef.current?.pointerId) return;
      const start = pointerStartRef.current;
      
      const dx = ev.clientX - start.startX;
      const dy = ev.clientY - start.startY;
      const dist = Math.hypot(dx, dy);

      if (!start.isDragging) {
        if (dist > 5) {
          start.isDragging = true;
          setDraggedRight(start.rightVal);
          setSelectedRight(null);
          setSelectedLeft(null);
        }
      }

      if (start.isDragging) {
        // Prevent default during active drag to stop page scrolling
        if (ev.cancelable) ev.preventDefault();
        
        start.lastX = ev.clientX;
        start.lastY = ev.clientY;
        setDragCoord({ x: ev.clientX, y: ev.clientY });
        
        const slotIdx = findSlotIndexAtPoint(ev.clientX, ev.clientY);
        start.currentSlot = slotIdx;
        setHoveredSlotIndex(slotIdx);
      }
    };

    const onUp = (ev) => {
      if (ev.pointerId !== pointerStartRef.current?.pointerId) return;
      const start = pointerStartRef.current;
      
      // Cleanup global listeners immediately
      window.removeEventListener('pointermove', onMove, { capture: true });
      window.removeEventListener('pointerup', onUp, { capture: true });
      window.removeEventListener('pointercancel', onUp, { capture: true });
      
      pointerStartRef.current = null;

      if (start.isDragging) {
        const x = ev.clientX !== undefined ? ev.clientX : start.lastX;
        const y = ev.clientY !== undefined ? ev.clientY : start.lastY;
        
        // Trust start.currentSlot if it's set, otherwise recalculate
        const slotIdx = start.currentSlot !== null ? start.currentSlot : findSlotIndexAtPoint(x, y);
        
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

    // Attach global capture listeners to bypass DOM hierarchy and guarantee event delivery
    window.addEventListener('pointermove', onMove, { capture: true, passive: false });
    window.addEventListener('pointerup', onUp, { capture: true, passive: false });
    window.addEventListener('pointercancel', onUp, { capture: true, passive: false });
  };

  const resetSelection = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  return (
    <div className="vmx-match-dnd">
      {/* Top action / instruction bar */}
      <div className="vmx-match-dnd-header">
        <div className="vmx-match-dnd-status">
          {selectedRight ? (
            <div className="vmx-match-status-pill selected">
              <span>✨ กำลังเลือก: <strong>{strip(selectedRight)}</strong> → <em>แตะช่องซ้ายเพื่อจับคู่</em></span>
              <button type="button" className="vmx-match-status-cancel" onClick={resetSelection} title="ยกเลิกการเลือก">✕</button>
            </div>
          ) : selectedLeft !== null ? (
            <div className="vmx-match-status-pill selected">
              <span>🎯 เลือกช่องที่ {selectedLeft + 1} «<strong>{strip(currentQ.pairs[selectedLeft]?.left)}</strong>» → <em>แตะการ์ดขวาเพื่อจับคู่</em></span>
              <button type="button" className="vmx-match-status-cancel" onClick={resetSelection} title="ยกเลิกการเลือก">✕</button>
            </div>
          ) : (
            <span className="vmx-match-dnd-hint">
              💡 <strong>ลาก</strong> การ์ดขวาไปวางที่ช่องซ้าย หรือ <strong>แตะ</strong> เพื่อจับคู่ ({filledCount}/{totalSlots} ข้อ)
            </span>
          )}
        </div>

        {filledCount > 0 && !isRevealed && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-match-clear-all-btn"
            onClick={() => { resetSelection(); answerCurrent({}); }}
            title="ล้างคำตอบที่จับคู่ไว้ทั้งหมดในข้อนี้"
          >
            🗑️ ล้างทั้งหมด
          </button>
        )}
      </div>

      <div className="vmx-match-dnd-grid">
        {/* Left column — Target Slots */}
        <div className="vmx-match-dnd-leftcol" role="region" aria-label="ช่องจับคู่ด้านซ้าย">
          {currentQ.pairs.map((pair, i) => {
            const val = getVal(i);
            const isCorrect = val === pair.right;
            const isAnswered = Boolean(val);
            const isSelected = selectedLeft === i;
            const isHovered = hoveredSlotIndex === i;

            let stateClass = 'empty';
            if (isRevealed && isAnswered) stateClass = isCorrect ? 'correct' : 'wrong';
            else if (isAnswered) stateClass = 'filled';

            if (isSelected) stateClass += ' is-selected';
            if (isHovered) stateClass += ' is-drag-over';

            return (
              <div
                key={i}
                ref={(el) => { slotsRef.current[i] = el; }}
                data-slot-idx={i}
                className={`vmx-match-dnd-slot ${stateClass}`}
                onClick={() => handleSlotTap(i)}
                role="button"
                tabIndex={0}
                aria-label={`ข้อ ${i + 1}: ${strip(pair.left)}. ${val ? 'จับคู่กับ ' + strip(val) : 'ยังไม่ได้จับคู่ แตะเพื่อเลือก'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSlotTap(i);
                  }
                }}
              >
                {/* Index badge */}
                <span className="vmx-match-dnd-slot-num" aria-hidden>{i + 1}</span>

                {/* Left question item */}
                <div className="vmx-match-dnd-left">
                  <RichText text={pair.left} />
                </div>

                {/* Target drop receptacle */}
                <div className="vmx-match-dnd-target" aria-hidden>
                  {val ? (
                    <div className="vmx-match-dnd-chip" title={strip(val)}>
                      <span className="vmx-match-dnd-chip-text">{strip(val)}</span>
                      {!isRevealed && (
                        <button
                          type="button"
                          className="vmx-match-dnd-clear"
                          aria-label={`ลบคำตอบข้อ ${i + 1}`}
                          title="ลบคำตอบนี้"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPair(i, '');
                            if (selectedLeft === i) setSelectedLeft(null);
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="vmx-match-dnd-placeholder">
                      {isHovered ? '✨ ปล่อยเพื่อวาง' : isSelected ? '👉 แตะการ์ดขวา' : '📥 วางที่นี่'}
                    </span>
                  )}
                </div>

                {/* Reveal state badge */}
                {isRevealed && isAnswered && (
                  <span className={`vmx-match-dnd-badge ${isCorrect ? 'ok' : 'no'}`} aria-hidden>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right column — Option Cards */}
        <div className="vmx-match-dnd-rightcol" role="region" aria-label="ตัวเลือกด้านขวา">
          <div className="vmx-match-dnd-rightcol-header">
            <span className="vmx-match-dnd-rightcol-title">🏷️ ตัวเลือกคำตอบ</span>
            <span className="vmx-match-dnd-rightcol-count">{rightPool.length - usedRights.size} ว่าง</span>
          </div>

          <div className="vmx-match-dnd-cards-list">
            {rightPool.map((r, idx) => {
              const isUsed = usedRights.has(r);
              const isDragging = draggedRight === r;
              const isCardSelected = selectedRight === r;

              return (
                <div
                  key={r + '-' + idx}
                  role="button"
                  tabIndex={isRevealed ? -1 : 0}
                  aria-selected={isCardSelected}
                  aria-disabled={isRevealed || undefined}
                  className={`vmx-match-dnd-card ${isUsed ? 'is-used' : ''} ${isDragging ? 'is-dragging' : ''} ${isCardSelected ? 'is-selected' : ''}`}
                  onPointerDown={(e) => handlePointerDown(e, r)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardTap(r);
                    }
                  }}
                  title={isUsed ? 'ใช้แล้ว — แตะหรือลากเพื่อเปลี่ยนตำแหน่ง' : 'ลากหรือแตะเพื่อจับคู่'}
                >
                  <span className="vmx-match-dnd-grip" aria-hidden>⠿</span>
                  <span className="vmx-match-dnd-card-text">{strip(r)}</span>
                  {isUsed && (
                    <span className="vmx-match-dnd-used-badge" aria-hidden>✓ ใส่แล้ว</span>
                  )}
                  {isCardSelected && (
                    <span className="vmx-match-dnd-selected-tag" aria-hidden>เลือกอยู่</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating ghost card while dragging */}
      {dragCoord && draggedRight && (
        <div
          className="vmx-match-dnd-floating-ghost"
          style={{
            left: `${dragCoord.x}px`,
            top: `${dragCoord.y}px`,
          }}
          aria-hidden
        >
          <span className="vmx-match-dnd-grip">⠿</span>
          <span>{strip(draggedRight)}</span>
        </div>
      )}

      {/* Keyboard fallback: native selects (accessible for screen readers & assistive tools) */}
      <details className="vmx-match-dnd-fallback">
        <summary>⌨️ เมนูตัวเลือกแบบข้อความ (Accessibility / Keyboard Fallback)</summary>
        <div className="vmx-match-row" style={{ marginTop: 10 }}>
          {currentQ.pairs.map((pair, i) => (
            <div key={i} className="vmx-match-item">
              <div className="vmx-match-left">
                <strong>{i + 1}.</strong> <RichText text={pair.left} />
              </div>
              <select
                className="vmx-match-select"
                value={getVal(i)}
                aria-label={`จับคู่รายการที่ ${i + 1}: ${strip(pair.left)}`}
                disabled={isRevealed}
                onChange={(e) => setPair(i, e.target.value)}
              >
                <option value="">— เลือกคำตอบ —</option>
                {rightPool.map((r, j) => (
                  <option key={j} value={r}>
                    {strip(r)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </details>

      {/* Instant reveal feedback in Practice Mode */}
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

