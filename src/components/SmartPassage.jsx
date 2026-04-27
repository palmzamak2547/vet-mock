import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// ============================================================
// SmartPassage — reading-comprehension passage with annotations
// ============================================================
// Three modes layered on top of a plain-text passage:
//   • READ      — normal selection, no annotations created
//   • HIGHLIGHT — drag to mark text in 3 colors (yellow/green/pink)
//   • PEN       — finger or Apple Pencil drawing on a transparent
//                 canvas overlay (PointerEvents API gives us
//                 pressure for free on Pencil)
//
// Persisted per passage to localStorage:
//   vmx-pass-<hash>-hl  →  [{id, start, end, color}, ...]
//   vmx-pass-<hash>-dr  →  [{color, width, points: [[x,y,p],...]}]
//
// Why offset-based highlights (not Range objects)?
//   Ranges don't survive React re-renders or page reloads. Storing
//   integer offsets into the canonical text means we can rebuild
//   the highlight overlay deterministically every render.
// ============================================================

// Stable hash per passage text — used as the localStorage key so
// the same passage carries its annotations across questions/sessions
// (e.g. the bats passage is reused by Q1101-1108).
function hashPassage(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) + text.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

const HL_COLORS = [
  { id: 'yellow', bg: 'rgba(255, 224, 102, 0.55)', dot: '#f5c518' },
  { id: 'green',  bg: 'rgba(120, 220, 130, 0.50)', dot: '#5fbf6e' },
  { id: 'pink',   bg: 'rgba(255, 150, 180, 0.50)', dot: '#e07b9b' },
];

const PEN_COLORS = [
  { id: 'black', value: '#1a1a1a' },
  { id: 'blue',  value: '#1e6fc7' },
  { id: 'red',   value: '#c73e3e' },
];

export default function SmartPassage({ text, title, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState('read'); // read | highlight | pen | erase
  const [hlColor, setHlColor] = useState('yellow');
  const [penColor, setPenColor] = useState('black');
  const [highlights, setHighlights] = useState([]);
  const [strokes, setStrokes] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const drawingRef = useRef(null);

  const storageKey = useMemo(() => `vmx-pass-${hashPassage(text || '')}`, [text]);

  // ── Load saved annotations on mount / passage swap ──
  useEffect(() => {
    try {
      const hl = localStorage.getItem(`${storageKey}-hl`);
      const dr = localStorage.getItem(`${storageKey}-dr`);
      setHighlights(hl ? JSON.parse(hl) : []);
      setStrokes(dr ? JSON.parse(dr) : []);
    } catch {
      setHighlights([]); setStrokes([]);
    }
  }, [storageKey]);

  // ── Persist highlights ──
  useEffect(() => {
    try {
      if (highlights.length === 0) localStorage.removeItem(`${storageKey}-hl`);
      else localStorage.setItem(`${storageKey}-hl`, JSON.stringify(highlights));
    } catch {}
  }, [highlights, storageKey]);

  // ── Persist strokes ──
  useEffect(() => {
    try {
      if (strokes.length === 0) localStorage.removeItem(`${storageKey}-dr`);
      else localStorage.setItem(`${storageKey}-dr`, JSON.stringify(strokes));
    } catch {}
  }, [strokes, storageKey]);

  // ── Resize canvas to match text container; redraw on every resize
  //    or when strokes / open change. We use devicePixelRatio so the
  //    pen lines stay crisp on retina/Apple Pencil.
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return;

    const redraw = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      strokes.forEach((s) => {
        ctx.strokeStyle = s.color;
        ctx.beginPath();
        for (let i = 0; i < s.points.length; i++) {
          const [x, y, p] = s.points[i];
          ctx.lineWidth = (s.width || 2) * (0.5 + (p || 0.5));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    redraw();
    const ro = new ResizeObserver(redraw);
    ro.observe(wrap);
    window.addEventListener('orientationchange', redraw);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', redraw);
    };
  }, [strokes, open]);

  // ── Text selection → highlight ──
  // We compute the offset of the selection relative to textRef.current's
  // textContent, which is the same string we render and store. This
  // survives reloads since we re-render text the same way.
  const handleSelectionEnd = () => {
    if (mode !== 'highlight') return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const root = textRef.current;
    if (!root) return;
    const range = sel.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return;

    // Walk text nodes to compute integer offsets.
    const offset = (node, off) => {
      let total = 0;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n = walker.nextNode();
      while (n) {
        if (n === node) return total + off;
        total += n.nodeValue.length;
        n = walker.nextNode();
      }
      return total;
    };
    const start = offset(range.startContainer, range.startOffset);
    const end = offset(range.endContainer, range.endOffset);
    if (end - start < 1) return;

    setHighlights((h) => [...h, { id: Date.now() + Math.random(), start, end, color: hlColor }]);
    sel.removeAllRanges();
  };

  // ── Click an existing highlight (in any mode) → remove ──
  const removeHighlight = (id) => setHighlights((h) => h.filter((x) => x.id !== id));

  // ── Pointer handlers (pen) ──
  // We capture pointer so even if the user drags off the canvas the
  // stroke stays continuous. pointerType === 'pen' lets us differentiate
  // Apple Pencil from finger; we accept both but use pressure when
  // available for a more natural-looking line.
  const onPointerDown = (e) => {
    if (mode !== 'pen' && mode !== 'erase') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure > 0 ? e.pressure : 0.5;

    if (mode === 'erase') {
      // Naive eraser: drop strokes whose any point is within 14px
      const r2 = 14 * 14;
      setStrokes((all) => all.filter((s) => !s.points.some((pt) => {
        const dx = pt[0] - x; const dy = pt[1] - y;
        return dx * dx + dy * dy < r2;
      })));
      return;
    }

    drawingRef.current = {
      color: PEN_COLORS.find((c) => c.id === penColor).value,
      width: e.pointerType === 'pen' ? 1.6 : 2.2,
      points: [[x, y, pressure]],
    };
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current) {
      // Continuous erase while dragging in erase mode
      if (mode === 'erase' && e.buttons) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const r2 = 14 * 14;
        setStrokes((all) => all.filter((s) => !s.points.some((pt) => {
          const dx = pt[0] - x; const dy = pt[1] - y;
          return dx * dx + dy * dy < r2;
        })));
      }
      return;
    }
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    const stroke = drawingRef.current;
    stroke.points.push([x, y, pressure]);

    // Draw incrementally so we don't redraw the whole canvas on every
    // pointermove (would tank Apple Pencil framerates).
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = stroke.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const n = stroke.points.length;
    if (n >= 2) {
      const prev = stroke.points[n - 2];
      ctx.lineWidth = stroke.width * (0.5 + (pressure || 0.5));
      ctx.beginPath();
      ctx.moveTo(prev[0], prev[1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const onPointerUp = (e) => {
    if (drawingRef.current) {
      const stroke = drawingRef.current;
      drawingRef.current = null;
      // Drop trivial taps that didn't produce a real stroke.
      if (stroke.points.length >= 2) {
        setStrokes((all) => [...all, stroke]);
      }
    }
    try { canvasRef.current.releasePointerCapture(e.pointerId); } catch {}
  };

  // ── Build text segments, splicing in <mark> for each highlight ──
  // Sort + merge overlaps so adjacent highlights of the same color
  // visually combine; different colors win by latest-on-top.
  const segments = useMemo(() => {
    if (!text) return [];
    if (highlights.length === 0) return [{ text }];
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const out = [];
    let cursor = 0;
    sorted.forEach((hl) => {
      const start = Math.max(hl.start, cursor);
      const end = Math.min(hl.end, text.length);
      if (start > cursor) out.push({ text: text.slice(cursor, start) });
      if (end > start) out.push({ text: text.slice(start, end), hl });
      cursor = Math.max(cursor, end);
    });
    if (cursor < text.length) out.push({ text: text.slice(cursor) });
    return out;
  }, [text, highlights]);

  const clearAll = () => {
    if (!confirm('ลบ highlight + เส้นวาดทั้งหมดของ passage นี้?')) return;
    setHighlights([]); setStrokes([]);
  };

  const undoStroke = () => setStrokes((s) => s.slice(0, -1));

  // ── Mode-aware container styles ──
  const containerStyle = {
    position: 'relative',
    padding: '14px 16px',
    fontSize: 14,
    lineHeight: 1.75,
    color: 'var(--clr-ink)',
    whiteSpace: 'pre-wrap',
    maxHeight: 380,
    overflowY: 'auto',
    // Selection only when highlight or read mode; pen mode disables it
    // so the stylus doesn't accidentally select text instead of drawing.
    userSelect: (mode === 'pen' || mode === 'erase') ? 'none' : 'text',
    WebkitUserSelect: (mode === 'pen' || mode === 'erase') ? 'none' : 'text',
    cursor: mode === 'pen' ? 'crosshair' : mode === 'erase' ? 'cell' : 'auto',
    // Disable browser touch gestures (pinch/scroll) on the canvas while
    // pen-mode is active so the Apple Pencil draws cleanly. Outside of
    // pen mode we leave touch gestures alone (user can scroll).
    touchAction: (mode === 'pen' || mode === 'erase') ? 'none' : 'auto',
  };

  return (
    <div style={{ border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden', background: 'var(--clr-surface-2)' }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', boxSizing: 'border-box', background: 'var(--clr-surface)', borderBottom: open ? '1px solid var(--clr-border)' : 'none' }}
      >
        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)' }}>
          📄 {title || 'Reading Passage'}
        </span>
        {(highlights.length > 0 || strokes.length > 0) && (
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'var(--clr-gold-soft)', color: 'var(--clr-ink)', fontWeight: 600 }}>
            ✏️ {highlights.length + strokes.length}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--clr-ink-soft)' }}>{open ? '▾ ซ่อน' : '▸ ดู passage'}</span>
      </button>

      {open && (
        <>
          {/* Toolbar */}
          <Toolbar
            mode={mode} setMode={setMode}
            hlColor={hlColor} setHlColor={setHlColor}
            penColor={penColor} setPenColor={setPenColor}
            onClear={clearAll}
            onUndo={undoStroke}
            canUndo={strokes.length > 0}
            onHelp={() => setShowHelp((v) => !v)}
          />

          {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

          {/* Passage + canvas overlay */}
          <div ref={wrapperRef} style={{ position: 'relative' }}>
            <div
              ref={textRef}
              style={containerStyle}
              onMouseUp={handleSelectionEnd}
              onTouchEnd={handleSelectionEnd}
            >
              {segments.map((seg, i) => seg.hl ? (
                <mark
                  key={`${seg.hl.id}-${i}`}
                  onClick={(e) => { e.stopPropagation(); removeHighlight(seg.hl.id); }}
                  title="แตะเพื่อลบ highlight"
                  style={{
                    background: HL_COLORS.find((c) => c.id === seg.hl.color)?.bg || HL_COLORS[0].bg,
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '0 1px',
                    borderRadius: 2,
                  }}
                >{seg.text}</mark>
              ) : (
                <span key={i}>{seg.text}</span>
              ))}
            </div>

            {/* Canvas overlay sits inside the same scrollable container.
                pointer-events:none in non-drawing modes lets clicks pass
                through to the highlight text below. */}
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                position: 'absolute',
                left: 0, top: 0, right: 0, bottom: 0,
                width: '100%', height: '100%',
                pointerEvents: (mode === 'pen' || mode === 'erase') ? 'auto' : 'none',
                touchAction: (mode === 'pen' || mode === 'erase') ? 'none' : 'auto',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────
function Toolbar({ mode, setMode, hlColor, setHlColor, penColor, setPenColor, onClear, onUndo, canUndo, onHelp }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderBottom: '1px solid var(--clr-border)',
      background: 'var(--clr-surface)',
    }}>
      <ToolBtn active={mode === 'read'} onClick={() => setMode('read')} title="โหมดอ่าน — เลือก/copy ตามปกติ">
        👁️
      </ToolBtn>
      <ToolBtn active={mode === 'highlight'} onClick={() => setMode('highlight')} title="ไฮไลท์ข้อความ — ลากเพื่อทำเครื่องหมาย">
        🖍️
      </ToolBtn>
      {mode === 'highlight' && (
        <span style={{ display: 'inline-flex', gap: 4, paddingLeft: 4, borderLeft: '1px solid var(--clr-border)', marginLeft: 2 }}>
          {HL_COLORS.map((c) => (
            <button key={c.id} onClick={() => setHlColor(c.id)}
              title={c.id}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                border: hlColor === c.id ? `2px solid var(--clr-ink)` : '2px solid transparent',
                background: c.dot, cursor: 'pointer', padding: 0,
              }} />
          ))}
        </span>
      )}

      <ToolBtn active={mode === 'pen'} onClick={() => setMode('pen')} title="โหมดปากกา — รองรับ Apple Pencil + นิ้ว">
        ✏️
      </ToolBtn>
      {mode === 'pen' && (
        <span style={{ display: 'inline-flex', gap: 4, paddingLeft: 4, borderLeft: '1px solid var(--clr-border)', marginLeft: 2 }}>
          {PEN_COLORS.map((c) => (
            <button key={c.id} onClick={() => setPenColor(c.id)}
              title={c.id}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                border: penColor === c.id ? `2px solid var(--clr-ink)` : '2px solid transparent',
                background: c.value, cursor: 'pointer', padding: 0,
              }} />
          ))}
        </span>
      )}

      <ToolBtn active={mode === 'erase'} onClick={() => setMode('erase')} title="ยางลบ — ลบเฉพาะเส้นวาด">
        🩹
      </ToolBtn>

      <span style={{ flex: 1 }} />

      <ToolBtn onClick={onUndo} disabled={!canUndo} title="ยกเลิกเส้นล่าสุด">
        ↶
      </ToolBtn>
      <ToolBtn onClick={onClear} title="ลบทั้งหมด">
        🗑️
      </ToolBtn>
      <ToolBtn onClick={onHelp} title="คำแนะนำ">
        ?
      </ToolBtn>
    </div>
  );
}

function ToolBtn({ children, onClick, active, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        all: 'unset',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: 30, height: 30,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8,
        background: active ? 'var(--clr-sage-soft, rgba(74,107,74,0.15))' : 'transparent',
        border: active ? '1px solid var(--clr-sage)' : '1px solid transparent',
        fontSize: 14,
      }}
    >{children}</button>
  );
}

function HelpPanel({ onClose }) {
  return (
    <div style={{ padding: '10px 14px', background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)', fontSize: 12, lineHeight: 1.6, color: 'var(--clr-ink-soft)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: 'var(--clr-ink)', marginBottom: 4 }}>📝 วิธีใช้</div>
          <div>👁️ <strong>โหมดอ่าน</strong> — select/copy ปกติ ไม่สร้าง mark</div>
          <div>🖍️ <strong>Highlight</strong> — ลากเลือกข้อความ จะเป็นสีตามที่เลือก · <em>คลิก highlight เพื่อลบ</em></div>
          <div>✏️ <strong>Pen</strong> — เขียนด้วย Apple Pencil หรือนิ้ว · pressure-sensitive ใน Pencil</div>
          <div>🩹 <strong>Eraser</strong> — ลบเฉพาะเส้นที่วาด (ไม่ลบ highlight)</div>
          <div style={{ marginTop: 4, fontStyle: 'italic' }}>💾 บันทึกลงเครื่องอัตโนมัติ — passage เดียวกันมี mark เดียวกันใน mock อื่น</div>
        </div>
        <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', fontSize: 16, padding: 4 }}>✕</button>
      </div>
    </div>
  );
}
