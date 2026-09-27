// Cluster-robust (sandwich) covariance for a GLM, as sandwich::vcovCL(fit, cluster = ~farm, type = 'HC0')
// with its default G / (G - 1) adjustment [M2-DESIGN.md 3.2.2].
// OWNER: models role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {{ X: Float64Array[], y: Float64Array, fitted: Float64Array, family: 'binomial'|'poisson', bread: number[][] }} fit
 * @param {Int32Array|number[]} cluster   cluster index per row
 * @returns {number[][]}
 */
export function clusterRobustVcov(fit, cluster) {
  throw new Error('not implemented: models/robust.clusterRobustVcov');
}
