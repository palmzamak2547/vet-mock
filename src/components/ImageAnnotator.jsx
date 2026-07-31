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
import { alertDialog } from '../lib/dialog.js';

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
  // Palm rejection — when ON, only pointerType==='pen' (Apple Pencil /
  // Surface Pen / Android stylus) draws. Touch + mouse are ignored,
  // letting the user rest their palm on the iPad while writing.
  const [palmReject, setPalmReject] = useState(() => {
    try { return localStorage.getItem('vmx-anno-palm-reject') === '1'; }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('vmx-anno-palm-reject', palmReject ? '1' : '0'); }
    catch {}
  }, [palmReject]);
  // Transient "palm rejected" toast — { x, y, t } where t is the
  // mount timestamp. Cleared by a 1.5 s timer.
  const [palmFlash, setPalmFlash] = useState(null);
  // Stroke state: points = [{ x, y, p }] where p is pressure (0..1).
  // We store the whole stroke (not just lastX/lastY) so we can render
  // smoothed quadratic-Bezier segments AND apply variable line width
  // per segment based on pen pressure.
  const drawingRef = useRef({ on: false, points: [] });

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

  // Map raw pointer pressure (0..1) to a stroke-width multiplier in
  // 0.4..1.6. Pressure==0 happens on devices that don't report it
  // (mouse on some browsers, finger on iOS without 3D Touch) — those
  // arrive as 0.5 from the web spec, so the multiplier lands at 1.0
  // and the line looks identical to the pre-stylus behaviour.
  function pressureToWidthMul(p) {
    const clamped = Math.max(0.05, Math.min(1, p || 0.5));
    return 0.4 + clamped * 1.2; // 0.05→0.46, 0.5→1.0, 1.0→1.6
  }

  // Configure the draw context for the current tool. Called once per
  // segment so highlighter alpha + eraser composite mode are correct.
  function applyToolStyle(ctx, widthMul) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 4; // pressure ignored on eraser
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.globalAlpha = 1;
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = size * 4; // wide constant nib for highlighter
      ctx.strokeStyle = HIGHLIGHTER;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = Math.max(0.5, size * widthMul);
      ctx.strokeStyle = PEN_COLORS.find((p) => p.id === color)?.rgb || '#c0392b';
      ctx.globalAlpha = 1;
    }
  }

  function startStroke(e) {
    const c = drawRef.current;
    if (!c) return;
    // Palm rejection — only the actual stylus is allowed to draw.
    // Flash a small toast so the user knows why their finger was
    // ignored (otherwise it looks like the app froze).
    if (palmReject && e.pointerType !== 'pen') {
      const rect = c.getBoundingClientRect();
      setPalmFlash({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: Date.now() });
      setTimeout(() => setPalmFlash((f) => (f && Date.now() - f.t >= 1400 ? null : f)), 1500);
      return;
    }
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (c.width / rect.width);
    const y = (e.clientY - rect.top) * (c.height / rect.height);
    const p = e.pressure > 0 ? e.pressure : 0.5;
    drawingRef.current = { on: true, points: [{ x, y, p }] };
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
    // Pointer Events spec: pressure is 0 when the device doesn't
    // report it (typical for fingers on iOS) — fall back to 0.5 so
    // the multiplier lands at 1.0 and the line looks unchanged.
    const p = e.pressure > 0 ? e.pressure : 0.5;
    const pts = ref.points;
    pts.push({ x, y, p });
    const ctx = c.getContext('2d');
    const n = pts.length;
    // Eraser uses raw line segments — spatial accuracy matters more
    // than visual smoothness, and the wide nib hides any blockiness.
    if (tool === 'eraser') {
      applyToolStyle(ctx, 1.0);
      const a = pts[n - 2], b = pts[n - 1];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      return;
    }
    if (n === 2) {
      // First segment — straight line, no smoothing possible yet.
      const a = pts[0], b = pts[1];
      applyToolStyle(ctx, pressureToWidthMul(b.p));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    } else if (n >= 3) {
      // Quadratic Bezier midpoint smoothing: draw a curve from the
      // midpoint of (n-3, n-2) to the midpoint of (n-2, n-1), with
      // (n-2) as the control point. This removes the polygonal look
      // without losing the user's actual track.
      const a = pts[n - 3], b = pts[n - 2], d = pts[n - 1];
      const m1x = (a.x + b.x) / 2, m1y = (a.y + b.y) / 2;
      const m2x = (b.x + d.x) / 2, m2y = (b.y + d.y) / 2;
      applyToolStyle(ctx, pressureToWidthMul(b.p));
      ctx.beginPath();
      ctx.moveTo(m1x, m1y);
      ctx.quadraticCurveTo(b.x, b.y, m2x, m2y);
      ctx.stroke();
    }
  }

  function endStroke() {
    const ref = drawingRef.current;
    if (!ref.on) return;
    // Close out the last segment so the stroke reaches the final
    // raw point (smoothing leaves us at the midpoint between the
    // last two points; without this tail the line falls short).
    const c = drawRef.current;
    if (c && tool !== 'eraser' && ref.points.length >= 2) {
      const pts = ref.points;
      const n = pts.length;
      const b = pts[n - 2], d = pts[n - 1];
      const mx = (b.x + d.x) / 2, my = (b.y + d.y) / 2;
      const ctx = c.getContext('2d');
      applyToolStyle(ctx, pressureToWidthMul(d.p));
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
    }
    drawingRef.current = { on: false, points: [] };
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
              alertDialog('บันทึกไม่ได้: ภาพต้นฉบับมีข้อจำกัด CORS — ลองคลิกขวาที่รูปภาพแล้ว Save image แทน');
              return;
            }
            triggerDownload(overlayBlob, `vetmock-overlay-${Date.now()}.png`);
          }, 'image/png');
          return;
        }
        triggerDownload(blob, `vetmock-annotation-${Date.now()}.png`);
      }, 'image/png');
    } catch (e) {
      alertDialog('บันทึก PNG ผิดพลาด: ' + (e.message || 'unknown'));
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
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ✏️ {mode === 'sketch' ? 'กระดานวาด' : mode === 'template' ? 'Template + วาดทับ' : 'ภาพ + วาดทับ'}
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>{mode === 'sketch' ? 'วาดสรุป / แผนภาพ' : mode === 'template' ? 'วาดบน template' : 'วาดทับภาพ'}</h2>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
          <button type="button" className={`vmx-chip ${tool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')}>ปากกา</button>
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
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={clearAll}>Clear</button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={downloadPNG}>Save PNG</button>
          <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
          <button
            type="button"
            className={`vmx-chip ${palmReject ? 'active' : ''}`}
            onClick={() => setPalmReject((v) => !v)}
            title={palmReject ? 'รับเฉพาะปากกา/สไตลัส — แตะนิ้วจะไม่วาด (เลื่อนหน้าจอได้)' : 'รับทุกอินพุต — แตะนิ้วก็วาดได้'}
          >
            {palmReject ? '⛔ ปฏิเสธฝ่ามือ' : '✋ รับทุกอินพุต'}
          </button>
        </div>

        {/* Canvas stack — base image + draw overlay */}
        <div ref={wrapRef} style={{ flex: 1, overflow: 'auto', background: '#000', borderRadius: 8, border: '1px solid var(--clr-border)' }}>
          {!imgReady && <div className="vmx-empty" style={{ color: '#ccc' }}>กำลังโหลดภาพ…</div>}
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', lineHeight: 0 }}>
            <canvas ref={baseRef} style={{ display: 'block', maxWidth: '100%', height: 'auto', touchAction: palmReject ? 'pan-y' : 'none' }} />
            <canvas
              ref={drawRef}
              onPointerDown={startStroke}
              onPointerMove={moveStroke}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={endStroke}
              // When palm rejection is on we want finger scrolls to
              // pan the viewport (so users can still scroll a tall
              // image), but the pen still draws because
              // pointer-cancel-on-scroll never fires for stylus.
              style={{ position: 'absolute', top: 0, left: 0, maxWidth: '100%', height: 'auto', touchAction: palmReject ? 'pan-y' : 'none', cursor: tool === 'eraser' ? 'crosshair' : 'crosshair' }}
            />
            {palmFlash && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: Math.max(8, palmFlash.x - 110),
                  top: Math.max(8, palmFlash.y - 36),
                  background: 'rgba(20, 20, 20, 0.92)',
                  color: '#fff',
                  fontSize: 12,
                  padding: '6px 10px',
                  borderRadius: 6,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
              >
                ⛔ ฝ่ามือถูกปฏิเสธ (ใช้ปากกาเท่านั้น)
              </div>
            )}
          </div>
        </div>

        <div className="vmx-btn-row" style={{ marginTop: 12 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">ปิด (esc)</button>
        </div>
      </div>
    </div>
  );
}
