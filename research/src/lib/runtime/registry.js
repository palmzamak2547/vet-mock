// Method id -> implementation [M1-DESIGN.md 10.3]. A method counts as shipped only when it has a row
// here, so the catalogue (and the landing chart that reads it) cannot claim a method that does not
// run. Each implementation takes (spec, table) and returns the partial envelope fields
// { status, values, tests, tables, used, dropped } that run.js wraps with provenance and guardrails.
// OWNER: runtime role. stats and epi export the functions; runtime adds the row when a method's
// fixture test is green.

/**
 * @typedef {import('./types.js').AnalysisSpec} AnalysisSpec
 * @typedef {import('./types.js').WorkingTable} WorkingTable
 * @typedef {Object} MethodOutput
 * @property {'ok'|'invalid'} status
 * @property {Object<string, import('./types.js').Value>} values
 * @property {import('./types.js').TestResult[]} tests
 * @property {{id: string, columns: string[], rows: (string|number|null)[][]}[]} tables
 * @property {number} used                      rows that entered the computation
 * @property {import('./types.js').Provenance['rowsDropped']} dropped
 * @typedef {(spec: AnalysisSpec, table: WorkingTable|null) => MethodOutput} MethodImpl
 */

/** @type {Record<string, MethodImpl>} Empty until each method lands with its fixtures. */
export const IMPLEMENTED = {};
