// Random selection from a sampling frame (the project dataset: one row per farm or animal): simple,
// systematic with a random start, stratified with proportional or equal allocation [M2-DESIGN.md 7].
// OWNER: ui-tools role. STUB(m2): each export throws until its owner fills it in.

/**
 * input dataset; params size, seed; roles strata (for 'stratified'); options scheme, allocation. Table 'selected' (row id, stratum, order drawn).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runSampling(spec, table) {
  throw new Error('not implemented: plan/sampling.runSampling');
}
