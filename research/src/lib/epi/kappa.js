// Agreement [M1-DESIGN.md 7.19]: percent agreement (course 107027), Cohen's kappa with the
// Fleiss-Cohen-Everitt asymptotic SE and CI, weighted kappa (linear = irr "equal", quadratic =
// irr "squared") for ordered categories, and for 2x2 tables PABAK with prevalence and bias indices
// (G17). The course's descriptive bands are reported beside kappa, named as the course's.
// OWNER: epi role.

/**
 * @param {number[][]} table  k x k, rows rater A, columns rater B, categories in codebook order
 * @param {{ weights: 'none'|'linear'|'quadratic', confLevel: number }} opts
 * @returns {Object<string, import('../runtime/types.js').Value>}  po, pe, kappa, and for 2x2 PABAK, prevalenceIndex, biasIndex
 */
export function kappa(table, opts) { void table; void opts; throw new Error('not implemented: epi/kappa.kappa'); }

/** Implementation for 'agree.kappa'. @type {import('../runtime/registry.js').MethodImpl} */
export function runKappa(spec, table) { void spec; void table; throw new Error('not implemented: epi/kappa.runKappa'); }
/** Implementation for 'agree.percent'. @type {import('../runtime/registry.js').MethodImpl} */
export function runPercentAgreement(spec, table) { void spec; void table; throw new Error('not implemented: epi/kappa.runPercentAgreement'); }
