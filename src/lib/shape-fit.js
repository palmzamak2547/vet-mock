// ============================================================
// shape-fit — hold a rough shape still and it snaps true
// ============================================================
//
// Given the points of a freehand stroke (normalised [0..1] page space), decide
// whether the student was drawing a line, a rectangle or an ellipse, and if so
// return clean points for that shape — still plain points, so nothing
// downstream (storage, sync, export, undo) has to know shapes exist.
//
// `aspect` is pageWidth / pageHeight: normalised space is not square, and
// without correcting for it a circle drawn on a wide slide measures as a fat
// ellipse and every distance is biased along one axis.

/** Distance from point p to segment a..b, all in isotropic space. */
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/**
 * @param {Array<Array<number>>} points  stroke points, [x, y, ...] normalised
 * @param {number} aspect                page width / height
 * @returns {null | { kind: 'line'|'rect'|'ellipse', points: Array<Array<number>> }}
 */
export function fitShape(points, aspect = 1) {
  if (!points || points.length < 8) return null;
  // Work in isotropic space: x stretched by the aspect so a unit of x and a
  // unit of y are the same physical distance.
  const P = points.map((p) => [p[0] * aspect, p[1]]);
  const xs = P.map((p) => p[0]);
  const ys = P.map((p) => p[1]);
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  const diag = Math.hypot(w, h);
  if (diag < 0.02) return null; // a dot is a dot, not a shape
  // Tolerance scales with the drawing: a sweeping arm wobbles more in
  // absolute terms than a small careful one.
  const tol = Math.max(0.008, diag * 0.07);

  const first = P[0];
  const last = P[P.length - 1];
  const closed = Math.hypot(last[0] - first[0], last[1] - first[1]) < Math.max(0.03, diag * 0.22);

  // ── Line ────────────────────────────────────────────────────
  if (!closed || diag < 0.06) {
    let maxDev = 0;
    for (const [px, py] of P) {
      maxDev = Math.max(maxDev, segDist(px, py, first[0], first[1], last[0], last[1]));
    }
    if (maxDev < tol) {
      return {
        kind: 'line',
        points: [
          [points[0][0], points[0][1]],
          [points[points.length - 1][0], points[points.length - 1][1]],
        ],
      };
    }
    return null;
  }

  // ── Closed: rectangle vs ellipse, whichever the hand meant ─
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rx = Math.max(1e-6, w / 2);
  const ry = Math.max(1e-6, h / 2);

  // Rectangle residual: distance to the nearest bbox edge.
  let rectDev = 0;
  for (const [px, py] of P) {
    const d = Math.min(
      Math.abs(px - minX), Math.abs(px - maxX),
      Math.abs(py - minY), Math.abs(py - maxY),
    );
    rectDev = Math.max(rectDev, d);
  }
  // A rectangle also has to USE its corners — an ellipse hugs the same bbox
  // edges near the axes, so edge distance alone mistakes circles for boxes.
  // Measure how much of the corner regions the path actually visits.
  let cornerHits = 0;
  const cr = Math.max(0.02, diag * 0.12);
  for (const [gx, gy] of [[minX, minY], [maxX, minY], [minX, maxY], [maxX, maxY]]) {
    if (P.some(([px, py]) => Math.hypot(px - gx, py - gy) < cr)) cornerHits++;
  }

  // Ellipse residual: |radial distance − 1| scaled back to length units.
  let elDev = 0;
  for (const [px, py] of P) {
    const r = Math.hypot((px - cx) / rx, (py - cy) / ry);
    elDev = Math.max(elDev, Math.abs(r - 1) * Math.min(rx, ry));
  }

  const rectOk = rectDev < tol && cornerHits >= 3;
  const elOk = elDev < tol * 1.4;
  if (!rectOk && !elOk) return null;

  if (rectOk && (!elOk || rectDev <= elDev)) {
    // Back to page space: undo the aspect stretch.
    const x0 = minX / aspect; const x1 = maxX / aspect;
    return {
      kind: 'rect',
      points: [[x0, minY], [x1, minY], [x1, maxY], [x0, maxY], [x0, minY]],
    };
  }

  const pts = [];
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    pts.push([(cx + rx * Math.cos(a)) / aspect, cy + ry * Math.sin(a)]);
  }
  return { kind: 'ellipse', points: pts };
}

/**
 * True when the point (x, y) touches the stroke — used by the whole-stroke
 * eraser. `reach` is the erase radius, everything in normalised page space
 * made isotropic by `aspect`.
 */
export function strokeHit(stroke, x, y, reach, aspect = 1) {
  const pts = stroke?.points;
  if (!pts || pts.length === 0) return false;
  const px = x * aspect;
  // Cheap bbox reject first — most strokes are nowhere near the eraser.
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  for (const p of pts) {
    const ax = p[0] * aspect;
    if (ax < minX) minX = ax;
    if (ax > maxX) maxX = ax;
    if (p[1] < minY) minY = p[1];
    if (p[1] > maxY) maxY = p[1];
  }
  if (px < minX - reach || px > maxX + reach || y < minY - reach || y > maxY + reach) return false;
  if (pts.length === 1) {
    return Math.hypot(px - pts[0][0] * aspect, y - pts[0][1]) <= reach;
  }
  for (let i = 1; i < pts.length; i++) {
    if (segDist(px, y, pts[i - 1][0] * aspect, pts[i - 1][1], pts[i][0] * aspect, pts[i][1]) <= reach) {
      return true;
    }
  }
  return false;
}
