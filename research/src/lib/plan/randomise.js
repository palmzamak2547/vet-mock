// Randomisation lists (simple, permuted blocks with block sizes drawn from a list, stratified blocks) and
// blinding codes, as a method so the list carries its envelope, seed and options [M2-DESIGN.md 7].
// OWNER: ui-tools role. STUB(m2): each export throws until its owner fills it in.

/**
 * input params: n (units) or strata [{ name, n }], arms (labels), ratio (integers), seed; options scheme, blockSizes, blinding.
 * Table 'list' (unit, stratum, block, arm, code); values seed.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runRandomisation(spec, table) {
  throw new Error('not implemented: plan/randomise.runRandomisation');
}
