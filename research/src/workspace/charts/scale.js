// Scales and ticks shared by every chart: linear, log (ratios), dates; tick thinning so labels never collide
// at narrow widths [M2-DESIGN.md 8.1].
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number} lo
 * @param {number} hi
 * @param {{ pixels: number, minGapPx: number, log?: boolean }} opts
 * @returns {number[]}
 */
export function niceTicks(lo, hi, opts) {
  throw new Error('not implemented: workspace/charts/scale.niceTicks');
}
