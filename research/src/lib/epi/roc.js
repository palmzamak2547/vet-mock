// ROC curve, AUC with the DeLong interval, and the paired DeLong comparison of two tests on the same animals
// (pROC 1.19.0.1: roc, ci.auc, roc.test) [M2-DESIGN.md 3.3.1].
// OWNER: measure role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles test (a number), reference (binary, levels.referencePositive), test2 (optional, same animals); options direction (never 'auto'), youden.
 * Tables 'coords' (threshold, Se, Sp), 'compare' when test2 is given. The Youden cut-off carries the G13 note (a cut-off chosen on these animals overstates accuracy).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runRoc(spec, table) {
  throw new Error('not implemented: epi/roc.runRoc');
}

/**
 * @param {number[]} positives   marker values of animals with the condition
 * @param {number[]} negatives
 * @returns {{ auc: number, variance: number, v10: number[], v01: number[] }}
 */
export function delong(positives, negatives) {
  throw new Error('not implemented: epi/roc.delong');
}
