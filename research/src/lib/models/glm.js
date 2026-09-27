// Generalized linear models by IRLS: binomial (logit) and Poisson (log, optional offset from the time role).
// Convergence as R glm.control (deviance change below 1e-8, 25 iterations); Wald and profile-likelihood
// intervals; likelihood-ratio test per term; separation (G14) and overdispersion (G23) findings
// [M2-DESIGN.md 3.2.1].
// OWNER: models role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome (binary, levels.outcomePositive), covariates[]; options ciMethod; farm route 'robust' uses models/robust.js (Wald only).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runLogistic(spec, table) {
  throw new Error('not implemented: models/glm.runLogistic');
}

/**
 * roles outcome (count), covariates[], time (animal-time, log offset; optional); options ciMethod.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPoisson(spec, table) {
  throw new Error('not implemented: models/glm.runPoisson');
}

/**
 * @param {Float64Array[]} X         columns of the design matrix (intercept first)
 * @param {Float64Array} y
 * @param {'binomial'|'poisson'} family
 * @param {{ offset?: Float64Array, maxIter?: number, epsilon?: number }} [opts]
 * @returns {{ beta: number[], vcov: number[][], deviance: number, nullDeviance: number, aic: number, iter: number, converged: boolean, fitted: Float64Array, separated: boolean }}
 */
export function fitGlm(X, y, family, opts) {
  throw new Error('not implemented: models/glm.fitGlm');
}
