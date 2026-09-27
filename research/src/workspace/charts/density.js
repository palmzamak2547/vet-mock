// Kernel density for violins: Gaussian kernel with R's bw.nrd0 bandwidth, evaluated directly (not R's binned
// FFT) [M2-DESIGN.md 8.2].
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number[]} x
 * @returns {number}
 */
export function bwNrd0(x) {
  throw new Error('not implemented: workspace/charts/density.bwNrd0');
}

/**
 * @param {number[]} x
 * @param {number} bw
 * @param {number[]} at
 * @returns {number[]}
 */
export function kde(x, bw, at) {
  throw new Error('not implemented: workspace/charts/density.kde');
}
