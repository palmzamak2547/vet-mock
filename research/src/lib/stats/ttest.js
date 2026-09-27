// t-tests: Welch (default), pooled, paired, one-sample, as R's t.test [M1-DESIGN.md 7.6]. OWNER: stats role.

/** Implementation for method 'test.tTest'. @type {import('../runtime/registry.js').MethodImpl} */
export function runTTest(spec, table) { void spec; void table; throw new Error('not implemented: stats/ttest.runTTest'); }

/**
 * Pure core on arrays (tests call it directly).
 * @param {number[]} x @param {number[]|null} y
 * @param {{ variant: 'welch'|'pooled'|'paired'|'one-sample', mu: number, alternative: 'two.sided'|'less'|'greater', confLevel: number }} opts
 * @returns {{ t: number|null, df: number|null, p: number|null, estimate: number|null, ci: [number|null, number|null], se: number|null }}
 */
export function tTest(x, y, opts) { void x; void y; void opts; throw new Error('not implemented: stats/ttest.tTest'); }
