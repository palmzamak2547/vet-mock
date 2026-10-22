// LassoLayer: the loop being drawn, and the box around what it took.
//
// Lives inside one PdfPage (absolute, over the ink). Geometry comes in as
// normalised page space ([0..1]) and is laid out in CSS px from the page's
// width and height, so it follows zoom with no bookkeeping of its own.
//
// The box is moved by dragging it and resized from its corners. While a drag
// runs, the layer reports the transform on every frame (onPreview) and once at
// the end (onCommit); the reader repaints the ink and owns the strokes. A tap
// on the box without moving does nothing, so a student never nudges ink by
// accident while reaching for the action bar.
import React, { useRef, useState } from 'react';
import NavIcon from './NavIcon.jsx';
import { scaleFromHandle } from '../lib/lasso.js';

const CORNERS = ['tl', 'tr', 'bl', 'br'];
// The box is never smaller than a fingertip, so a single underline can still
// be dragged; the corner handles sit OUTSIDE it, so they never cover the part
// that moves.
const MIN_BOX = 44;
// The bar keeps clear of the corner handles (40 px outside the box) and of the
// page's edges. Its width is known: count, four 44 px buttons and padding.
const HANDLE_REACH = 34;
const BAR_W = 4 * 44 + 12;
const BAR_H = 52;
// Below this many CSS px a pointer that went down and up is a tap, not a drag.
const DRAG_SLOP = 3;

export default function LassoLayer({
  w, h, loop = null, selection = null, preview = null, colors = [],
  onPreview, onCommit, onDelete, onDuplicate, onRecolor, onDone,
}) {
  const dragRef = useRef(null);
  const [palette, setPalette] = useState(false);
  const box = selection?.box || null;
  const t = preview || { dx: 0, dy: 0, k: 1, ox: 0, oy: 0 };
  // The box as the ink will look after the transform.
  const shown = box && {
    x: t.ox + (box.x - t.ox) * t.k + t.dx,
    y: t.oy + (box.y - t.oy) * t.k + t.dy,
    w: box.w * t.k,
    h: box.h * t.k,
  };

  const toNorm = (e) => {
    const r = e.currentTarget.closest('.vmx-pdf-page').getBoundingClientRect();
    return [(e.clientX - r.left) / Math.max(1, r.width), (e.clientY - r.top) / Math.max(1, r.height)];
  };

  const down = (mode) => (e) => {
    if (!box) return;
    e.preventDefault();
    e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    const [x, y] = toNorm(e);
    dragRef.current = { mode, id: e.pointerId, x, y, cx: e.clientX, cy: e.clientY, moved: false };
  };
  const move = (e) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    if (!d.moved && Math.hypot(e.clientX - d.cx, e.clientY - d.cy) < DRAG_SLOP) return;
    d.moved = true;
    const [x, y] = toNorm(e);
    const next = d.mode === 'move'
      ? { dx: x - d.x, dy: y - d.y, k: 1, ox: 0, oy: 0 }
      : { dx: 0, dy: 0, ...scaleFromHandle(box, d.mode, x, y) };
    d.last = next;
    onPreview?.(next);
  };
  const up = (e) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    dragRef.current = null;
    if (d.moved && d.last) onCommit?.(d.last);
    else onPreview?.(null);
  };

  const loopPath = loop && loop.length > 1
    ? loop.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * w).toFixed(1)} ${(y * h).toFixed(1)}`).join(' ')
    : null;
  // The box as drawn: never under a fingertip's size, centred on the ink.
  const dbox = shown && (() => {
    const bw = Math.max(MIN_BOX, shown.w * w);
    const bh = Math.max(MIN_BOX, shown.h * h);
    return { left: (shown.x + shown.w / 2) * w - bw / 2, top: (shown.y + shown.h / 2) * h - bh / 2, width: bw, height: bh };
  })();
  // The bar above the box when there is room (handles included), else below;
  // centred on it, kept inside the page.
  const bar = dbox && (() => {
    const above = dbox.top - HANDLE_REACH - BAR_H >= 0;
    const half = BAR_W / 2;
    const cx = Math.min(Math.max(dbox.left + dbox.width / 2, half + 4), Math.max(half + 4, (w || 0) - half - 4));
    // Anchored on the side facing the box, so the colour row opens AWAY from
    // the ink instead of over it.
    return above
      ? { left: cx - half, bottom: (h || 0) - (dbox.top - HANDLE_REACH), above }
      : { left: cx - half, top: dbox.top + dbox.height + HANDLE_REACH, above };
  })();

  return (
    <div className="vmx-lasso" aria-hidden={!box}>
      {loopPath && (
        <svg className="vmx-lasso-loop" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <path d={`${loopPath} Z`} />
        </svg>
      )}
      {shown && (
        <>
          <div
            className="vmx-lasso-box"
            role="group"
            aria-label={`เลือกไว้ ${selection.ids.length} เส้น ลากเพื่อย้าย ลากมุมเพื่อย่อหรือขยาย`}
            style={dbox}
            onPointerDown={down('move')} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          >
            {CORNERS.map((c) => (
              <span key={c} className={`vmx-lasso-handle is-${c}`}
                onPointerDown={down(c)} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
            ))}
          </div>
          <div
            className={`vmx-lasso-bar${bar.above ? " is-above" : ""}`}
            role="toolbar"
            aria-label={`จัดการ ${selection.ids.length} เส้นที่เลือก`}
            style={{ left: bar.left, top: bar.top, bottom: bar.bottom, width: BAR_W, flexDirection: bar.above ? 'column-reverse' : 'column' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="vmx-lasso-row">
            <button type="button" className="vmx-lasso-act" aria-expanded={palette}
              onClick={() => setPalette((v) => !v)} aria-label="เปลี่ยนสี" title="เปลี่ยนสี">
              <span className="vmx-lasso-palette" aria-hidden="true" />
            </button>
            <button type="button" className="vmx-lasso-act" onClick={onDuplicate} aria-label="ทำสำเนา" title="ทำสำเนา (Ctrl+D)">
              <NavIcon name="copy" size={18} />
            </button>
            <button type="button" className="vmx-lasso-act" onClick={onDelete} aria-label="ลบเส้นที่เลือก" title="ลบ (Delete)">
              <NavIcon name="trash" size={18} />
            </button>
            <button type="button" className="vmx-lasso-act is-done" onClick={onDone} aria-label="เสร็จ" title="เสร็จ (Esc)">
              <NavIcon name="check" size={18} />
            </button>
            </div>
            {palette && (
              <div className="vmx-lasso-colors" role="group" aria-label="สี">
                {colors.map((c) => (
                  <button key={c.id} type="button" className="vmx-lasso-swatch" aria-label={`เปลี่ยนเป็นสี${c.name}`} title={c.name}
                    style={{ '--swatch': c.rgb }} onClick={() => { setPalette(false); onRecolor?.(c.rgb); }} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
