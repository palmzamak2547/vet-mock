// Pearson chi-square for r x c (Yates as a visible option for 2x2), expected counts for G5, and the
// chi-square test for trend in proportions (R's prop.trend.test) [M1-DESIGN.md 7.12]. OWNER: stats role.

/** @returns {{ X2: number, df: number, p: number, expected: number[][], minExpected: number, shareBelow5: number }} */
export function chisqTest(table, opts) { void table; void opts; throw new Error('not implemented: stats/chisq.chisqTest'); }

/** @returns {{ X2: number, df: 1, p: number }} */
export function trendTest(x, n, scores) { void x; void n; void scores; throw new Error('not implemented: stats/chisq.trendTest'); }

/** Implementation for 'test.chisq'. @type {import('../runtime/registry.js').MethodImpl} */
export function runChisq(spec, table) { void spec; void table; throw new Error('not implemented: stats/chisq.runChisq'); }
/** Implementation for 'test.trend'. @type {import('../runtime/registry.js').MethodImpl} */
export function runTrend(spec, table) { void spec; void table; throw new Error('not implemented: stats/chisq.runTrend'); }
