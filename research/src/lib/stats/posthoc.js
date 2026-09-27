// Post hoc comparisons: Dunn after Kruskal-Wallis, Games-Howell, Dunnett against a control [M2-DESIGN.md
// 3.1.4].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome, group; options adjust (holm, bonferroni, bh, none). Dunn (1964) z with the tie correction; table 'pairs' (later level minus earlier, R's order).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runDunn(spec, table) {
  throw new Error('not implemented: stats/posthoc.runDunn');
}

/**
 * roles outcome, group; Welch-type SE and df per pair, p from the studentized range (upper tail as 1 - cdf, A8), interval at confLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runGamesHowell(spec, table) {
  throw new Error('not implemented: stats/posthoc.runGamesHowell');
}

/**
 * roles outcome, group; levels.controlLevel; two-sided only (another alternative returns status 'invalid' with lab.invalid.dunnettTwoSided).
 * Adjusted p and the critical value from stats/mvt.js, never by simulation.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runDunnett(spec, table) {
  throw new Error('not implemented: stats/posthoc.runDunnett');
}
