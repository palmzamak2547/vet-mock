// Friedman rank sum test (R friedman.test) [M2-DESIGN.md 3.1.3].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome, group (the treatments or times), subject (the blocks); a block with any missing value is dropped whole.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runFriedman(spec, table) {
  throw new Error('not implemented: stats/friedman.runFriedman');
}

/**
 * @param {number[][]} blocks   one row per block, one column per treatment
 * @returns {{ statistic: number, df: number, p: number }}
 */
export function friedman(blocks) {
  throw new Error('not implemented: stats/friedman.friedman');
}
