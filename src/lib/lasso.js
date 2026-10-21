// lasso: choose strokes by drawing a loop around them, then move or resize them.
//
// Pure, like ink.js: strokes carry points in normalised [0..1] page space
// ([x, y, pressure?, tilt?]), so everything here works in that space and the
// page's aspect (height / width) is passed where distances must be true ones.
//
// A transformed stroke is a NEW stroke (new id); the reader deletes the old
// ids, the same way the stroke eraser does, so sync and undo need nothing new.

/** Even-odd test of one point against a closed polygon of [x, y]. */
export function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Strokes the loop takes. A stroke counts when at least `share` of its points
 * lie inside, so a loop drawn a little short of a long underline still takes
 * it, and one that only brushes a neighbour does not. Erasers are never taken:
 * they are holes in other ink, not ink.
 */
export function selectStrokes(strokes, loop, { share = 0.6 } = {}) {
  if (!Array.isArray(loop) || loop.length < 3) return [];
  return (strokes || []).filter((s) => {
    if (!s?.points?.length || s.mode === 'eraser') return false;
    let n = 0;
    for (const p of s.points) if (pointInPolygon(p[0], p[1], loop)) n += 1;
    return n / s.points.length >= share;
  });
}

/** Box around strokes, padded so thin lines are not hugged: {x, y, w, h}. */
export function boundsOf(strokes, pad = 0) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const s of strokes || []) {
    for (const p of s.points || []) {
      if (p[0] < x0) x0 = p[0];
      if (p[1] < y0) y0 = p[1];
      if (p[0] > x1) x1 = p[0];
      if (p[1] > y1) y1 = p[1];
    }
  }
  if (!Number.isFinite(x0)) return null;
  return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Move by (dx, dy) and scale by k about (ox, oy). One k for both axes: a
 * handwritten word stretched in one direction stops reading as handwriting.
 * Points stay on the page; the line width scales with the ink, as on paper
 * under a photocopier's zoom.
 */
export function transformStroke(stroke, { dx = 0, dy = 0, k = 1, ox = 0, oy = 0 }, newId) {
  const points = stroke.points.map((p) => {
    const q = p.slice();
    q[0] = clamp01(ox + (p[0] - ox) * k + dx);
    q[1] = clamp01(oy + (p[1] - oy) * k + dy);
    return q;
  });
  return { ...stroke, id: newId, points, size: Math.max(0.5, stroke.size * k) };
}

/** The scale a corner handle asks for, kept within [min, max]. */
export function scaleFromHandle(box, corner, px, py, { min = 0.2, max = 6 } = {}) {
  const ox = corner.includes('l') ? box.x + box.w : box.x;
  const oy = corner.includes('t') ? box.y + box.h : box.y;
  const kx = Math.abs(px - ox) / Math.max(box.w, 1e-6);
  const ky = Math.abs(py - oy) / Math.max(box.h, 1e-6);
  return { k: Math.min(max, Math.max(min, Math.max(kx, ky))), ox, oy };
}
