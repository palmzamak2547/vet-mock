// ============================================================
// ImageAnnotator — light canvas markup overlay
// ============================================================
//
// Lets users mark up Q images while reviewing — point at a lesion,
// highlight a structure, scribble a thought. Pure canvas, no library.
//
// Tools: pen (3 colors), highlighter, eraser, undo, clear, save PNG.
// Pointer events so pen + finger + mouse all work; pinch-zoom is
// disabled inside the canvas only (touch-action: none) so a stroke
// doesn't accidentally pan the page.
//
// Data is intentionally NOT persisted — these are study aids, not
// notes. Wiping on close keeps localStorage clean and avoids stale
// drawings across exam reattempts. User can save PNG locally if
// they want a permanent copy.
// ============================================================

import { useEffect, useRef, useState } from 'react';

const PEN_COLORS = [
  { id: 'red',    rgb: '#c0392b', name: 'แดง' },
  { id: 'green',  rgb: '#27ae60', name: 'เขียว' },
  { id: 'blue',   rgb: '#2980b9', name: 'น้ำเงิน' },
  { id: 'gold',   rgb: '#b88940', name: 'ทอง' },
];
const HIGHLIGHTER = '#f1c40f';

export default function ImageAnnotator({ src, alt, onClose, mode = 'annotate', templateUrl = null }) {
  // mode='annotate' → image background (from src prop, e.g. Q image).
  // mode='sketch'   → blank white pad.
  // mode='template' → SVG template (from templateUrl) drawn as canvas
  //                   background; same code path as 'annotate' but the
  //                   source is a same-origin /templates/*.svg file.
  const effectiveSrc = mode === 'template' ? templateUrl : src;
  const wrapRef = useRef(null);
  const baseRef = useRef(null);
  const drawRef = useRef(null);
  const [tool, setTool] = useState('pen');         // pen | highlighter | eraser
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(3);
  const [history, setHistory] = useState([]);      // stack of dataURLs for undo
  const [imgReady, setImgReady] = useState(false);
  const drawingRef = useRef({ on: false, lastX: 0, lastY: 0 });

  // Load image + size canvas to image's natural dimensions (clamped to
  // a reasonable max so giant radiographs don't blow up the modal).
  // In sketch mode (no src), use a fixed-size blank canvas instead.
  // Template mode reuses the image-loading path with a same-origin
  // /templates/*.svg URL so the canvas isn't tainted on export.
  useEffect(() => {
    if (!effectiveSrc || mode === 'sketch') {
      // Blank sketch pad — fixed size keeps proportions sane and
      // avoids re-flow if the user resizes the modal.
      const base = baseRef.current, draw = drawRef.current;
      if (!base || !draw) return;
      const cw = 800, ch = 560;
      base.width = cw; base.height = ch;
      draw.width = cw; draw.height = ch;
      // Paint base white so saved PNG has a non-transparent background
      const bctx = base.getContext('2d');
      bctx.fillStyle = '#ffffff';
      bctx.fillRect(0, 0, cw, ch);
      setImgReady(true);
      pushHistory();
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous'; // best effort — works for same-origin/Supabase
    img.onload = () => {
      // SVG templates declare 800×1000 in their viewBox; rasterise at
      // that size (or scale down if needed). For uploaded images we
      // clamp to 900 px on the long edge so the modal doesn't blow up.
      const max = mode === 'template' ? 1000 : 900;
      const naturalW = img.naturalWidth || 800;
      const naturalH = img.naturalHeight || 1000;
      const scale = Math.min(1, max / Math.max(naturalW, naturalH));
      const cw = Math.round(naturalW * scale);
      const ch = Math.round(naturalH * scale);
      const base = baseRef.current, draw = drawRef.current;
      if (!base || !draw) return;
      base.width = cw; base.height = ch;
      draw.width = cw; draw.height = ch;
      const bctx = base.getContext('2d');
      // Template SVGs already declare a white background, but paint
      // white first as a safety net (the SVG could be partially
      // transparent if a future template forgets the bg rect).
      if (mode === 'template') {
        bctx.fillStyle = '#ffffff';
        bctx.fillRect(0, 0, cw, ch);
      }
      bctx.drawImage(img, 0, 0, cw, ch);
      setImgReady(true);
      pushHistory(); // initial blank-overlay snapshot
    };
    img.onerror = () => setImgReady(true); // still allow drawing on blank canvas
    img.src = effectiveSrc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSrc, mode]);

  function pushHistory() {
    const c = drawRef.current;
    if (!c) return;
    try {
      const url = c.toDataURL();
      setHistory((h) => [...h.slice(-9), url]); // keep last 10
    } catch {}
  }

  function undo() {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const trimmed = h.slice(0, -1);
      const last = trimmed[trimmed.length - 1];
      const c = drawRef.current;
      if (!c) return trimmed;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = last;
      return trimmed;
    });
  }

  function clearAll() {
    const c = drawRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    pushHistory();
  }

  function startStroke(e) {
    const c = drawRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (c.width / rect.width);
    const y = (e.clientY - rect.top) * (c.height / rect.height);
    drawingRef.current = { on: true, lastX: x, lastY: y };
    c.setPointerCapture?.(e.pointerId);
  }

  function moveStroke(e) {
    const ref = drawingRef.current;
    if (!ref.on) return;
    const c = drawRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (c.width / rect.width);
    const y = (e.clientY - rect.top) * (c.height / rect.height);
    const ctx = c.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 4;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = size * 4;
      ctx.strokeStyle = HIGHLIGHTER;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = size;
      ctx.strokeStyle = PEN_COLORS.find((p) => p.id === color)?.rgb || '#c0392b';
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ctx.moveTo(ref.lastX, ref.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    drawingRef.current = { on: true, lastX: x, lastY: y };
  }

  function endStroke() {
    if (!drawingRef.current.on) return;
    drawingRef.current.on = false;
    pushHistory();
  }

  function downloadPNG() {
    const base = baseRef.current, draw = drawRef.current;
    if (!base || !draw) return;
    const out = document.createElement('canvas');
    out.width = base.width; out.height = base.height;
    const ctx = out.getContext('2d');
    try {
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(draw, 0, 0);
      // Cross-origin images without CORS headers taint the canvas;
      // toBlob then returns null. Try-catch + null-check so we surface
      // a friendly fallback (export only the overlay) instead of
      // silent-failing.
      out.toBlob((blob) => {
        if (!blob) {
          // Fallback: export ONLY the user's drawing (no base image)
          // — the overlay canvas isn't tainted so it always exports.
          draw.toBlob((overlayBlob) => {
            if (!overlayBlob) {
              alert('บันทึกไม่ได้: ภาพต้นฉบับมีข้อจำกัด CORS — ลองคลิกขวาที่รูปภาพแล้ว Save image แทน');
              return;
            }
            triggerDownload(overlayBlob, `vetmock-overlay-${Date.now()}.png`);
          }, 'image/png');
          return;
        }
        triggerDownload(blob, `vetmock-annotation-${Date.now()}.png`);
      }, 'image/png');
    } catch (e) {
      alert('บันทึก PNG ผิดพลาด: ' + (e.message || 'unknown'));
    }
  }
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="vmx-modal-overlay" onClick={onClose} role="dialog" aria-label={alt || 'Image annotator'}>
      <div className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ✏️ {mode === 'sketch' ? 'กระดานวาด' : mode === 'template' ? 'Template + วาดทับ' : 'ภาพ + วาดทับ'}
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>{mode === 'sketch' ? 'วาดสรุป / แผนภาพ' : mode === 'template' ? 'วาดบน template' : 'วาดทับภาพ'}</h2>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
          <button type="button" className={`vmx-chip ${tool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')}>✏️ ปากกา</button>
          <button type="button" className={`vmx-chip ${tool === 'highlighter' ? 'active' : ''}`} onClick={() => setTool('highlighter')}>🖍 highlight</button>
          <button type="button" className={`vmx-chip ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')}>🧽 ลบ</button>
          <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
          {tool === 'pen' && PEN_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.id)}
              title={c.name}
              aria-label={`สี ${c.name}`}
              style={{
                width: 24, height: 24, borderRadius: '50%', border: color === c.id ? '2px solid var(--clr-ink)' : '1px solid var(--clr-border)',
                background: c.rgb, cursor: 'pointer', padding: 0,
              }}
            />
          ))}
          <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            ขนาด
            <input type="range" min="1" max="10" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} style={{ width: 80 }} />
          </label>
          <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={undo} disabled={history.length <= 1}>↶ Undo</button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={clearAll}>🗑 Clear</button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={downloadPNG}>📥 Save PNG</button>
        </div>

        {/* Canvas stack — base image + draw overlay */}
        <div ref={wrapRef} style={{ flex: 1, overflow: 'auto', background: '#000', borderRadius: 8, border: '1px solid var(--clr-border)' }}>
          {!imgReady && <div className="vmx-empty" style={{ color: '#ccc' }}>กำลังโหลดภาพ…</div>}
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', lineHeight: 0 }}>
            <canvas ref={baseRef} style={{ display: 'block', maxWidth: '100%', height: 'auto', touchAction: 'none' }} />
            <canvas
              ref={drawRef}
              onPointerDown={startStroke}
              onPointerMove={moveStroke}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={endStroke}
              style={{ position: 'absolute', top: 0, left: 0, maxWidth: '100%', height: 'auto', touchAction: 'none', cursor: tool === 'eraser' ? 'crosshair' : 'crosshair' }}
            />
          </div>
        </div>

        <div className="vmx-btn-row" style={{ marginTop: 12 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">ปิด (esc)</button>
        </div>
      </div>
    </div>
  );
}
