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
import { thaiError } from '../lib/errors.js';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { useFullscreen } from '../hooks/useFullscreen.js';
import NavIcon from './NavIcon.jsx';
import { createInkEngine } from '../lib/ink/engine.js';

const PEN_COLORS = [
  { id: 'red',    rgb: '#c0392b', name: 'แดง' },
  { id: 'green',  rgb: '#27ae60', name: 'เขียว' },
  { id: 'blue',   rgb: '#2980b9', name: 'น้ำเงิน' },
  { id: 'gold',   rgb: '#b88940', name: 'ทอง' },
];
const HIGHLIGHTER = '#f1c40f';

// Pen only (รับเฉพาะปากกา) is remembered while the app stays open, so closing
// and reopening the markup keeps the choice.
let penOnlyChoice = false;

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
  // Esc (and a tap outside) while full screen only leaves full screen: closing
  // the board there threw the drawing away with it.
  const fsRef = useRef(null);
  const dismiss = () => {
    if (fsRef.current?.on) { fsRef.current.exit(); return; }
    if (fsRef.current?.justExited()) return;
    onClose();
  };
  const dialogRef = useModalFocus({ onClose: dismiss });
  const fullscreen = useFullscreen(dialogRef);
  fsRef.current = fullscreen;
  const [tool, setTool] = useState('pen');         // pen | highlighter | eraser
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(3);
  const [history, setHistory] = useState([]);      // stack of dataURLs for undo
  const [imgReady, setImgReady] = useState(false);
  // Palm rejection — when ON, only pointerType==='pen' (Apple Pencil /
  // Surface Pen / Android stylus) draws. Touch + mouse are ignored,
  // letting the user rest their palm on the iPad while writing.
  const [palmReject, setPalmReject] = useState(() => penOnlyChoice);
  useEffect(() => { penOnlyChoice = palmReject; }, [palmReject]);
  // Transient "palm rejected" toast — { x, y, t } where t is the
  // mount timestamp. Cleared by a 1.5 s timer.
  const [palmFlash, setPalmFlash] = useState(null);
  // The pointer loop is lib/ink/engine.js. A stroke's points are [x, y, p]
  // in canvas pixels, p the pressure (0..1); the whole stroke is kept so
  // each segment is a smoothed curve at its own pressure width.
  const engineRef = useRef(null);
  if (!engineRef.current) engineRef.current = createInkEngine();
  const engine = engineRef.current;

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

  // A point in canvas pixels, [x, y, p]. Pointer Events spec: pressure is 0
  // when the device doesn't report it (typical for fingers on iOS) — fall
  // back to 0.5 so the multiplier lands at 1.0 and the line looks unchanged.
  function canvasPoint(e) {
    const c = drawRef.current;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (c.width / rect.width);
    const y = (e.clientY - rect.top) * (c.height / rect.height);
    return [x, y, e.pressure > 0 ? e.pressure : 0.5];
  }

  // Palm rejection — only the actual stylus is allowed to draw. Flash a
  // small toast so the user knows why their finger was ignored (otherwise
  // it looks like the app froze).
  function flashPalm(e) {
    const c = drawRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    setPalmFlash({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: Date.now() });
    setTimeout(() => setPalmFlash((f) => (f && Date.now() - f.t >= 1400 ? null : f)), 1500);
  }

  // Paint the segment that the n-th point of a stroke adds.
  function paintTo(pts, n) {
    const ctx = drawRef.current.getContext('2d');
    // Eraser uses raw line segments — spatial accuracy matters more
    // than visual smoothness, and the wide nib hides any blockiness.
    if (tool === 'eraser') {
      applyToolStyle(ctx, 1.0);
      const a = pts[n - 2], b = pts[n - 1];
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
      return;
    }
    if (n === 2) {
      // First segment — straight line, no smoothing possible yet.
      const a = pts[0], b = pts[1];
      applyToolStyle(ctx, pressureToWidthMul(b[2]));
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    } else if (n >= 3) {
      // Quadratic Bezier midpoint smoothing: draw a curve from the
      // midpoint of (n-3, n-2) to the midpoint of (n-2, n-1), with
      // (n-2) as the control point. This removes the polygonal look
      // without losing the user's actual track.
      const a = pts[n - 3], b = pts[n - 2], d = pts[n - 1];
      const m1x = (a[0] + b[0]) / 2, m1y = (a[1] + b[1]) / 2;
      const m2x = (b[0] + d[0]) / 2, m2y = (b[1] + d[1]) / 2;
      applyToolStyle(ctx, pressureToWidthMul(b[2]));
      ctx.beginPath();
      ctx.moveTo(m1x, m1y);
      ctx.quadraticCurveTo(b[0], b[1], m2x, m2y);
      ctx.stroke();
    }
  }

  function endStroke(stroke) {
    // Close out the last segment so the stroke reaches the final
    // raw point (smoothing leaves us at the midpoint between the
    // last two points; without this tail the line falls short).
    const c = drawRef.current;
    if (c && tool !== 'eraser' && stroke.points.length >= 2) {
      const pts = stroke.points;
      const n = pts.length;
      const b = pts[n - 2], d = pts[n - 1];
      const mx = (b[0] + d[0]) / 2, my = (b[1] + d[1]) / 2;
      const ctx = c.getContext('2d');
      applyToolStyle(ctx, pressureToWidthMul(d[2]));
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(d[0], d[1]);
      ctx.stroke();
    }
    pushHistory();
  }

  // What this surface asks of the engine: every pointer draws (with pen only
  // on, only the stylus), no pinch, no double tap, one sample per event and
  // no duplicate drop, as this markup always drew.
  engine.setHost({
    penOnly: palmReject,
    pinch: false,
    tool,
    size,
    beforeDown: () => !!drawRef.current,
    onTouchIgnored: flashPalm,
    toStored: (e) => canvasPoint(e),
    samples: (e) => [e],
    near: () => false,
    newId: () => 0,
    colorFor: () => null,
    surface: () => drawRef.current,
    grow: (stroke, added) => {
      const n = stroke.points.length;
      for (let i = Math.max(2, n - added + 1); i <= n; i++) paintTo(stroke.points, i);
    },
    commit: (stroke) => endStroke(stroke),
  });

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
              alertDialog('บันทึกไม่ได้: ภาพต้นฉบับมีข้อจำกัด CORS ลองคลิกขวาที่รูปภาพแล้ว Save image แทน');
              return;
            }
            triggerDownload(overlayBlob, `vetmock-overlay-${Date.now()}.png`);
          }, 'image/png');
          return;
        }
        triggerDownload(blob, `vetmock-annotation-${Date.now()}.png`);
      }, 'image/png');
    } catch (e) {
      // A tainted canvas throws here ("Tainted canvases may not be exported"),
      // so the fallback names the one thing that still works.
      alertDialog(thaiError(e, 'บันทึกภาพ PNG ไม่สำเร็จ ลองคลิกขวาที่รูปแล้วเลือก Save image แทน'));
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
    <div className="vmx-modal-overlay" onClick={dismiss}>
      <div
        ref={dialogRef}
        className={`vmx-modal vmx-annot vmx-fs-target${fullscreen.on ? ' is-fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={fullscreen.on ? undefined : { maxWidth: 960, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        role="dialog"
        aria-modal="true"
        aria-label={alt || 'Image annotator'}
        tabIndex={-1}
        data-vmx-modal="true"
      >
        <div className="vmx-annot-head">
          <h2>{mode === 'sketch' ? 'วาดสรุปหรือแผนภาพ' : mode === 'template' ? 'วาดบนแม่แบบ' : 'วาดทับภาพ'}</h2>
          <button type="button" className="vmx-annot-tool" onClick={fullscreen.toggle} aria-pressed={fullscreen.on}
            aria-label={fullscreen.on ? 'ออกจากเต็มจอ' : 'เต็มจอ'} title={fullscreen.on ? 'ออกจากเต็มจอ' : 'เต็มจอ'}>
            <NavIcon name={fullscreen.on ? 'fullscreen-exit' : 'fullscreen'} size={20} />
          </button>
          <button type="button" className="vmx-annot-tool" onClick={onClose} aria-label="ปิด" title="ปิด">
            <NavIcon name="close" size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="vmx-annot-bar" role="toolbar" aria-label="เครื่องมือวาด">
          {[['pen', 'ปากกา'], ['highlighter', 'ไฮไลต์'], ['eraser', 'ยางลบ']].map(([id, label]) => (
            <button key={id} type="button" className={`vmx-annot-tool${tool === id ? ' is-active' : ''}`}
              onClick={() => setTool(id)} aria-pressed={tool === id} aria-label={label} title={label}>
              <NavIcon name={id} size={20} />
            </button>
          ))}
          <span className="vmx-annot-sep" aria-hidden="true" />
          {tool === 'pen' && PEN_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.id)}
              title={c.name}
              aria-label={`สี ${c.name}`}
              aria-pressed={color === c.id}
              style={{
                width: 44, height: 44, padding: 10, boxSizing: 'border-box', borderRadius: '50%', backgroundClip: 'content-box',
                border: color === c.id ? '2px solid var(--clr-ink)' : '2px solid transparent',
                background: c.rgb, cursor: 'pointer',
              }}
            />
          ))}
          <span className="vmx-annot-sep" aria-hidden="true" />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, minHeight: 44 }}>
            ขนาด
            <input type="range" min="1" max="10" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} aria-label="ขนาดปากกา" style={{ width: 80 }} />
          </label>
          <span className="vmx-annot-sep" aria-hidden="true" />
          <button type="button" className="vmx-annot-tool" onClick={undo} disabled={history.length <= 1} aria-label="ย้อนเส้นล่าสุด" title="ย้อนเส้นล่าสุด">
            <NavIcon name="undo" size={20} />
          </button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={clearAll}>ล้าง</button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={downloadPNG}>บันทึกเป็นรูป</button>
          <span className="vmx-annot-sep" aria-hidden="true" />
          <button
            type="button"
            className={`vmx-chip ${palmReject ? 'active' : ''}`}
            onClick={() => setPalmReject((v) => !v)}
            aria-pressed={palmReject}
            title={palmReject ? 'รับเฉพาะปากกา นิ้วใช้เลื่อนหน้า' : 'รับทั้งนิ้วและปากกา'}
          >
            รับเฉพาะปากกา
          </button>
        </div>

        {/* Canvas stack — base image + draw overlay */}
        <div ref={wrapRef} className="vmx-annot-stage" style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#000', borderRadius: fullscreen.on ? 0 : 8, border: fullscreen.on ? 0 : '1px solid var(--clr-border)' }}>
          {!imgReady && <div className="vmx-empty" style={{ color: '#ccc' }}>กำลังโหลดภาพ…</div>}
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', lineHeight: 0 }}>
            <canvas ref={baseRef} style={{ display: 'block', maxWidth: '100%', height: 'auto', touchAction: palmReject ? 'pan-y' : 'none' }} />
            <canvas
              ref={drawRef}
              onPointerDown={engine.onPointerDown}
              onPointerMove={engine.onPointerMove}
              onPointerUp={engine.onPointerUp}
              onPointerCancel={engine.onPointerUp}
              onPointerLeave={engine.onPointerUp}
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
                  fontSize: 14,
                  padding: '6px 10px',
                  borderRadius: 6,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
              >
                ไม่นับนิ้วและฝ่ามือ เขียนด้วยปากกา
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
