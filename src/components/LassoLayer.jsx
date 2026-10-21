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
import React, { useRef } from 'react';
import NavIcon from './NavIcon.jsx';
import { scaleFromHandle } from '../lib/lasso.js';

const CORNERS = ['tl', 'tr', 'bl', 'br'];
// Below this many CSS px a pointer that went down and up is a tap, not a drag.
const DRAG_SLOP = 3;

export default function LassoLayer({
  w, h, loop = null, selection = null, preview = null, colors = [],
  onPreview, onCommit, onDelete, onDuplicate, onRecolor, onDone,
}) {
  const dragRef = useRef(null);
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
  // The action bar sits above the box, or below it when the box is near the top.
  const barBelow = shown && shown.y * h < 64;

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
            style={{ left: shown.x * w, top: shown.y * h, width: Math.max(12, shown.w * w), height: Math.max(12, shown.h * h) }}
            onPointerDown={down('move')} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          >
            {CORNERS.map((c) => (
              <span key={c} className={`vmx-lasso-handle is-${c}`}
                onPointerDown={down(c)} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
            ))}
          </div>
          <div
            className="vmx-lasso-bar"
            role="toolbar"
            aria-label="จัดการเส้นที่เลือก"
            style={{ left: (shown.x + shown.w / 2) * w, top: barBelow ? (shown.y + shown.h) * h + 10 : shown.y * h - 10, transform: `translate(-50%, ${barBelow ? '0' : '-100%'})` }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="vmx-lasso-count">{selection.ids.length} เส้น</span>
            {colors.map((c) => (
              <button key={c.id} type="button" className="vmx-lasso-swatch" aria-label={`เปลี่ยนเป็นสี${c.name}`} title={c.name}
                style={{ '--swatch': c.rgb }} onClick={() => onRecolor?.(c.rgb)} />
            ))}
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
        </>
      )}
    </div>
  );
}
