// Where the herd's dots settle in the entrance [M1-DESIGN.md 16]: evenly along the border of a
// rounded rectangle (the drop zone of the first screen, or the project list), so as the entrance
// fades the dots become the dashed border that is really there. Dots left over fade out on the way.
// Pure: tests/unit/landing-entrance.test.mjs checks every used dot lies on the border. OWNER: landing role.

/**
 * Point at distance s along the perimeter of a rounded rectangle, clockwise from the top-left
 * straight edge. @returns {[number, number]}
 */
export function perimeterPoint(rect, radius, s) {
  const { x, y, w, h } = rect;
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  const top = w - 2 * r;
  const side = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const segs = [top, arc, side, arc, top, arc, side, arc];
  const total = segs.reduce((a, b) => a + b, 0);
  let d = ((s % total) + total) % total;
  let i = 0;
  while (i < segs.length - 1 && d > segs[i]) {
    d -= segs[i];
    i++;
  }
  const ang = r > 0 ? d / r : 0;
  switch (i) {
    case 0: return [x + r + d, y];
    case 1: return [x + w - r + r * Math.sin(ang), y + r - r * Math.cos(ang)];
    case 2: return [x + w, y + r + d];
    case 3: return [x + w - r + r * Math.cos(ang), y + h - r + r * Math.sin(ang)];
    case 4: return [x + w - r - d, y + h];
    case 5: return [x + r - r * Math.sin(ang), y + h - r + r * Math.cos(ang)];
    case 6: return [x, y + h - r - d];
    default: return [x + r - r * Math.cos(ang), y + r - r * Math.sin(ang)];
  }
}

/** Perimeter length of a rounded rectangle. */
export function perimeterLength(rect, radius) {
  const r = Math.max(0, Math.min(radius, rect.w / 2, rect.h / 2));
  return 2 * (rect.w - 2 * r) + 2 * (rect.h - 2 * r) + 2 * Math.PI * r;
}

/**
 * @param {{ x: number, y: number, w: number, h: number }[]} rects  one or more borders (CSS px, canvas top-left origin)
 * @param {{ total: number, pitch: number, radius: number, pointPx: number }} opts
 * @returns {{ grid: Float32Array, sizes: Float32Array, use: Float32Array, pos: Float32Array, used: number }}
 */
export function gatherToBorders(rects, { total, pitch, radius, pointPx }) {
  const grid = new Float32Array(total * 2);
  const sizes = new Float32Array(total).fill(pointPx);
  const use = new Float32Array(total);
  const pos = new Float32Array(total);
  const lengths = rects.map((r) => perimeterLength(r, radius));
  let step = Math.max(pitch, 1e-6);
  let need = lengths.reduce((s, L) => s + Math.max(1, Math.floor(L / step)), 0);
  if (need > total) {
    step *= need / total + 0.01;
    need = lengths.reduce((s, L) => s + Math.max(1, Math.floor(L / step)), 0);
  }
  let j = 0;
  rects.forEach((rect, ri) => {
    const n = Math.max(1, Math.floor(lengths[ri] / step));
    const gap = lengths[ri] / n;
    for (let k = 0; k < n && j < total; k++) {
      const [px, py] = perimeterPoint(rect, radius, k * gap);
      grid[j * 2] = px;
      grid[j * 2 + 1] = py;
      use[j] = 1;
      // Every third dot in gold, the rest in the herd's muted tone: the border reads as dashes.
      pos[j] = k % 3 === 0 ? 1 : 0;
      j++;
    }
  });
  const used = j;
  const cx = rects.length ? rects[0].x + rects[0].w / 2 : 0;
  const cy = rects.length ? rects[0].y + rects[0].h / 2 : 0;
  for (; j < total; j++) {
    grid[j * 2] = cx;
    grid[j * 2 + 1] = cy;
    use[j] = 0;
  }
  return { grid, sizes, use, pos, used };
}
