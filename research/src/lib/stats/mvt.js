// Multivariate t probabilities for Dunnett comparisons: with every comparison sharing the control, the
// correlation is lambda_i lambda_j with lambda_i = sqrt(n_i / (n_i + n_0)), so the probability is a two-
// dimensional integral (over the normal and the chi variable) [M2-DESIGN.md 3.1.4].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * P(|T_i| <= c for every i).
 * @param {number} c
 * @param {number[]} lambda
 * @param {number} df
 * @returns {number}
 */
export function dunnettProbability(c, lambda, df) {
  throw new Error('not implemented: stats/mvt.dunnettProbability');
}

/**
 * The c with dunnettProbability(c) = conf (Brent, stats/rootfind.js).
 * @param {number} conf
 * @param {number[]} lambda
 * @param {number} df
 * @returns {number}
 */
export function dunnettQuantile(conf, lambda, df) {
  throw new Error('not implemented: stats/mvt.dunnettQuantile');
}
