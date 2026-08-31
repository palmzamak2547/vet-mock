// ============================================================
// ink — how a stroke becomes pixels
// ============================================================
//
// Lifted out of PdfAnnotateView when the reader became a scrolling column of
// pages: every page draws its own ink, the export draws it again at print
// resolution, and a second implementation of any of this would eventually
// disagree with the first. These functions are pure — a context, a stroke,
// the canvas size, and a scale.
//
// Strokes carry points in normalised [0..1] space so the same stroke redraws
// correctly at any zoom, on any canvas, and in the exported file.

/** Sets up the context for one instrument. */
export function applyBrush(ctx, stroke) {
  ctx.lineJoin = 'round';
  if (stroke.mode === 'eraser') {
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else if (stroke.mode === 'highlighter') {
    // Flat cap and a squat, translucent line: the point of a highlighter is
    // that the words underneath stay readable.
    ctx.lineCap = 'butt';
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.38;
    ctx.strokeStyle = stroke.color;
  } else {
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.strokeStyle = stroke.color;
  }
}

export function resetBrush(ctx) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

/**
 * Width for one point. A pen that reports real pressure (Apple Pencil, S Pen)
 * gets a line that thickens as it is pressed; a mouse reports a constant 0.5
 * and would only get noise from this, so it keeps an even line. Tilt adds up
 * to half again on top, the way a pencil laid over covers more paper.
 */
export function widthAt(stroke, pt, scale) {
  const base = stroke.mode === 'eraser' ? stroke.size * 4
    : stroke.mode === 'highlighter' ? stroke.size * 4.5
      : stroke.size;
  if (!stroke.pressure || pt.length < 3) return base * scale;
  const tilt = pt.length > 3 ? (pt[3] || 0) : 0;
  return base * scale * (0.45 + pt[2] * 1.1) * (1 + tilt * 0.5);
}

/**
 * One path, one stroke() — the only way a translucent instrument keeps an even
 * tone across its own overlaps. Stroking a highlighter segment by segment
 * multiplies each overlap into the last and reaches full opacity in about ten
 * segments, which is a marker that blacks out the words underneath.
 */
export function strokeAsOnePath(ctx, pts, canvasW, canvasH, width) {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(pts[0][0] * canvasW, pts[0][1] * canvasH);
  if (pts.length === 1) {
    ctx.lineTo(pts[0][0] * canvasW + 0.01, pts[0][1] * canvasH);
  } else {
    for (let i = 1; i < pts.length; i++) {
      const x = pts[i][0] * canvasW;
      const y = pts[i][1] * canvasH;
      const px = pts[i - 1][0] * canvasW;
      const py = pts[i - 1][1] * canvasH;
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
    }
    ctx.lineTo(pts[pts.length - 1][0] * canvasW, pts[pts.length - 1][1] * canvasH);
  }
  ctx.stroke();
}

/**
 * Draws a stroke as a chain of quadratic curves through the midpoints of
 * consecutive samples, which is what turns a polyline of pointer events into
 * something that reads as handwriting. Each segment is stroked on its own so
 * the width can follow pressure along the line.
 */
export function drawStroke(ctx, stroke, canvasW, canvasH, scale = 1) {
  const pts = stroke?.points;
  if (!pts || pts.length === 0) return;
  applyBrush(ctx, stroke);
  const X = (i) => pts[i][0] * canvasW;
  const Y = (i) => pts[i][1] * canvasH;

  if (stroke.mode === 'highlighter') {
    strokeAsOnePath(ctx, pts, canvasW, canvasH, widthAt(stroke, pts[0], scale));
    resetBrush(ctx);
    return;
  }

  if (pts.length === 1) {
    // A tap is a dot, not nothing.
    ctx.lineWidth = widthAt(stroke, pts[0], scale);
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    ctx.lineTo(X(0) + 0.01, Y(0));
    ctx.stroke();
    resetBrush(ctx);
    return;
  }
  let px = X(0); let py = Y(0);
  for (let i = 1; i < pts.length; i++) {
    const mx = (px + X(i)) / 2;
    const my = (py + Y(i)) / 2;
    ctx.lineWidth = widthAt(stroke, pts[i], scale);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px, py, mx, my);
    ctx.lineTo(X(i), Y(i));
    ctx.stroke();
    px = X(i); py = Y(i);
  }
  resetBrush(ctx);
}

/** Clears and repaints a whole overlay. */
export function redrawInk(canvas, strokes, scale) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { desynchronized: true });
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const stroke of strokes || []) drawStroke(ctx, stroke, canvas.width, canvas.height, scale);
}

/**
 * How far from upright a stylus is, 0 (vertical) to 1 (almost flat). Safari
 * has reported altitudeAngle since 16.4 and it is the accurate source;
 * tiltX/tiltY are the older, wider-support fallback. Hardware that reports
 * neither returns 0 and the brush behaves as though tilt did not exist.
 */
export function tiltOf(e) {
  if (typeof e.altitudeAngle === 'number' && e.altitudeAngle > 0) {
    return Math.min(1, Math.max(0, 1 - e.altitudeAngle / (Math.PI / 2)));
  }
  const tx = e.tiltX || 0;
  const ty = e.tiltY || 0;
  if (!tx && !ty) return 0;
  return Math.min(1, Math.hypot(tx, ty) / 90);
}

/** The device pixel ratio this reader draws at, capped so a 3x phone does not
 *  triple every bitmap it holds. */
export const inkDpr = () => Math.min(typeof window === 'undefined' ? 1 : (window.devicePixelRatio || 1), 2);
