// Fisher's exact test for 2x2 with the conditional MLE odds ratio and its exact interval, as R's
// fisher.test (two-sided p sums tables no more probable than the observed, with R's relative
// tolerance 1 + 1e-7) [M1-DESIGN.md 7.13]. An infinite estimate or bound is Infinity, not null.
// OWNER: stats role.

/**
 * @param {[[number, number], [number, number]]} table
 * @param {{ alternative: 'two.sided'|'less'|'greater', confLevel: number }} opts
 * @returns {{ p: number, estimate: number, ci: [number, number] }}
 */
export function fisher2x2(table, opts) { void table; void opts; throw new Error('not implemented: stats/fisher.fisher2x2'); }

/** Implementation for 'test.fisher2x2'. @type {import('../runtime/registry.js').MethodImpl} */
export function runFisher(spec, table) { void spec; void table; throw new Error('not implemented: stats/fisher.runFisher'); }
