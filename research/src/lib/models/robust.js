// Cluster-robust (sandwich) covariance for a GLM, as sandwich::vcovCL(fit, cluster = ~farm, type = 'HC0')
// with its default G / (G - 1) adjustment [M2-DESIGN.md 3.2.2].
// OWNER: models role.
//
// sandwich 3.1.1: estfun.glm is the working residual times the working weight times x (glm's own
// residuals(fit, 'working') and weights(fit, 'working'): the weights are those of the last IRLS
// iteration, so the product is (y - mu) x only up to the fit tolerance; the fixture needs the exact
// product); bread.glm is n (X'WX)^-1; meatCL sums the
// estimating functions within each cluster, takes the outer products, divides by n and multiplies by
// G / (G - 1). The n cancels: V = B [sum_g u_g u_g'] B G / (G - 1) with B = (X'WX)^-1. HC1 multiplies by
// (n - 1) / (n - k) as well.

/**
 * @param {{ X: Float64Array[], y: Float64Array, fitted: Float64Array, family: 'binomial'|'poisson', bread: number[][], workingWeights?: Float64Array, workingResiduals?: Float64Array }} fit
 *   X: the non-aliased columns; bread: the unscaled covariance (X'WX)^-1 for those columns; the working
 *   weights and residuals of the fit (models/glm.js fitGlm returns both); without them (y - mu) is used
 * @param {Int32Array|number[]} cluster   cluster index per row
 * @param {{ type?: 'HC0'|'HC1', cadjust?: boolean }} [opts]
 * @returns {number[][]}
 */
export function clusterRobustVcov(fit, cluster, opts = {}) {
  const { X, y, fitted, bread, workingWeights, workingResiduals } = fit;
  const k = X.length;
  const n = y.length;
  const type = opts.type ?? 'HC0';
  const cadjust = opts.cadjust !== false;
  const G = new Set(Array.from(cluster)).size;
  const sums = new Map();
  for (let i = 0; i < n; i++) {
    const r = workingWeights && workingResiduals ? workingResiduals[i] * workingWeights[i] : y[i] - fitted[i];
    let u = sums.get(cluster[i]);
    if (!u) { u = new Array(k).fill(0); sums.set(cluster[i], u); }
    for (let j = 0; j < k; j++) u[j] += r * X[j][i];
  }
  const meat = Array.from({ length: k }, () => new Array(k).fill(0));
  for (const u of sums.values()) for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) meat[a][b] += u[a] * u[b];
  let adj = cadjust && G > 1 ? G / (G - 1) : 1;
  if (type === 'HC1') adj *= (n - 1) / (n - k);
  const BM = bread.map((row) => meat[0].map((_, b) => row.reduce((s, v, c) => s + v * meat[c][b], 0)));
  return BM.map((row) => bread[0].map((_, b) => adj * row.reduce((s, v, c) => s + v * bread[c][b], 0)));
}
