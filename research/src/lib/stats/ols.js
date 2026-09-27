// Ordinary least squares by Householder QR (never the normal equations) [M1-DESIGN.md 7.11].
// Categorical predictors expand to treatment contrasts against the codebook's reference level.
// NIST StRD Longley and Norris are the certified pins. OWNER: stats role.

/**
 * @param {number[][]} X   design matrix rows, intercept column included by the caller when wanted
 * @param {number[]} y
 * @returns {{ coef: number[], se: number[], t: number[], p: number[], df: number, sigma: number, r2: number, adjR2: number, F: number|null, pF: number|null, rank: number }}
 */
export function olsQr(X, y) { void X; void y; throw new Error('not implemented: stats/ols.olsQr'); }

/** Implementation for 'reg.ols'. @type {import('../runtime/registry.js').MethodImpl} */
export function runOls(spec, table) { void spec; void table; throw new Error('not implemented: stats/ols.runOls'); }
