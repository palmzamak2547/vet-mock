// Profile-likelihood intervals for GLM coefficients, as R 4.6.0 confint() on a glm (stats:::profile.glm and
// its interpolation) [M2-DESIGN.md 3.2.1].
// OWNER: models role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {Parameters<import('./glm.js').fitGlm>} fitArgs
 * @param {number} j            coefficient index
 * @param {number} confLevel
 * @returns {[number|null, number|null]}
 */
export function profileCi(fitArgs, j, confLevel) {
  throw new Error('not implemented: models/profile.profileCi');
}
