// Descriptive statistics [M1-DESIGN.md 7.3]. OWNER: stats role.

/**
 * @param {Float64Array|number[]} x   NaN = missing (counted, not used)
 * @param {{ quantileType: 6|7 }} opts  7 = R default, 6 = SPSS / Minitab
 * @returns {{ n: number, missing: number, mean: number|null, sd: number|null, se: number|null, min: number|null, q1: number|null, median: number|null, q3: number|null, max: number|null }}
 */
export function summary(x, opts) { void x; void opts; throw new Error('not implemented: stats/descriptive.summary'); }

/** Hyndman-Fan quantile of sorted data, type 6 or 7. */
export function quantile(sorted, prob, type) { void sorted; void prob; void type; throw new Error('not implemented: stats/descriptive.quantile'); }

/** Counts and percentages of a category column; denominators exclude missing, missing reported separately. */
export function frequency(codes, levels) { void codes; void levels; throw new Error('not implemented: stats/descriptive.frequency'); }

/** Implementation for method 'desc.summary'. @type {import('../runtime/registry.js').MethodImpl} */
export function runSummary(spec, table) { void spec; void table; throw new Error('not implemented: stats/descriptive.runSummary'); }
