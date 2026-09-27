// Power and sample size for ANOVA (R power.anova.test), t-tests (R power.t.test), correlation (pwr.r.test)
// and regression (pwr.f2.test), each with the farm design effect as an optional step [M2-DESIGN.md 3.1.7].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * input params: groups, betweenVar, withinVar, n or power, m, icc; options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerAnova(spec, table) {
  throw new Error('not implemented: stats/power.runPowerAnova');
}

/**
 * input params: delta, sd, n or power, m, icc; options type, solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerTTest(spec, table) {
  throw new Error('not implemented: stats/power.runPowerTTest');
}

/**
 * input params: r, n or power, m, icc; options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerCorrelation(spec, table) {
  throw new Error('not implemented: stats/power.runPowerCorrelation');
}

/**
 * input params: u (predictors tested), f2, n or power, m, icc (n = v + u + 1); options solveFor, sigLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPowerRegression(spec, table) {
  throw new Error('not implemented: stats/power.runPowerRegression');
}
