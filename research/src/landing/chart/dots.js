// Where each herd dot lands in the methods chart [M1-DESIGN.md 15.3]. Given the bars exactly as the
// HTML chart lays them out (origin, length and row centre in canvas CSS px), every bar gets a row of
// dots whose first dot starts at the bar's origin and whose last dot ends exactly at the bar's end, so
// the dots finish on the lengths the chart prints. Bars shorter than one dot get one dot as wide as the
// bar. Dots left over fade out on the way (use = 0). OWNER: landing role. Pure module.

/**
 * @typedef {{ x: number, y: number, length: number, height: number, now: boolean }} Bar
 *   x: left edge of the bar (its zero), y: vertical centre, length: drawn length in CSS px
 */

/**
 * @param {Bar[]} bars
 * @param {{ total: number, pointPx: number, pitch: number }} opts
 * @returns {{ grid: Float32Array, sizes: Float32Array, use: Float32Array, pos: Float32Array, used: number, pitch: number,
 *   perBar: { first: number, count: number, left: number, right: number, size: number }[] }}
 */
export function layoutBarDots(bars, { total, pointPx, pitch: pitch0 }) {
  let pitch = Math.max(pitch0, 1e-6);
  let plan;
  for (let guard = 0; guard < 60; guard++) {
    plan = bars.map((b) => {
      const L = Math.max(0, b.length);
      const size = Math.max(0, Math.min(pointPx, L, b.height > 0 ? b.height : pointPx));
      const n = L <= 0 ? 0 : Math.max(1, Math.round((L - size) / pitch) + 1);
      return { L, size, n };
    });
    const need = plan.reduce((s, p) => s + p.n, 0);
    if (need <= total) break;
    pitch *= need / total + 0.01;
  }
  const grid = new Float32Array(total * 2);
  const sizes = new Float32Array(total);
  const use = new Float32Array(total);
  const pos = new Float32Array(total);
  const perBar = [];
  let j = 0;
  bars.forEach((b, bi) => {
    const { L, size, n } = plan[bi];
    const first = j;
    for (let k = 0; k < n; k++) {
      const cx = n === 1 ? b.x + L - size / 2 : b.x + size / 2 + ((L - size) * k) / (n - 1);
      grid[j * 2] = cx;
      grid[j * 2 + 1] = b.y;
      sizes[j] = size;
      use[j] = 1;
      pos[j] = b.now ? 1 : 0;
      j++;
    }
    perBar.push({ first, count: n, left: n ? grid[first * 2] - size / 2 : b.x, right: n ? grid[(j - 1) * 2] + size / 2 : b.x, size });
  });
  const used = j;
  // Leftover dots travel toward the top of the chart and fade out before they arrive.
  const x0 = bars.length ? bars[0].x : 0;
  const y0 = bars.length ? bars[0].y : 0;
  for (; j < total; j++) {
    grid[j * 2] = x0 + ((j * 37) % 97);
    grid[j * 2 + 1] = y0;
    sizes[j] = pointPx;
    use[j] = 0;
    pos[j] = 0;
  }
  return { grid, sizes, use, pos, used, pitch, perBar };
}
