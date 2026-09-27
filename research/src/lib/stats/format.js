// Number display rules shared by every screen and export [M1-DESIGN.md 10.6]. OWNER: stats role.
// - p is never printed as 0, 0.000 or .000: below 0.001 it prints "< 0.001"; otherwise 3 decimals
//   (0.049, 0.050), keeping a leading zero; never stars.
// - estimates and CI bounds: 2 decimals for ratios below 10, 1 above 10, percentages with 1 decimal;
//   never more significant digits than the method's fixture tolerance proves.
// - an undefined value (null) prints "—"; the sentence comes from the value's reasonKey.
// - Arabic digits, en-US grouping, a thin space never used.

/** @param {number|null} p @returns {string} */
export function formatP(p) { void p; throw new Error('not implemented: stats/format.formatP'); }

/**
 * @param {number|null} x
 * @param {{ kind: 'ratio'|'proportion'|'percent'|'difference'|'mean'|'count'|'statistic', digits?: number }} opts
 * @returns {string}
 */
export function formatNumber(x, opts) { void x; void opts; throw new Error('not implemented: stats/format.formatNumber'); }

/** "2.11 (1.43 to 3.12)" in English, "2.11 (1.43 ถึง 3.12)" in Thai; open bounds print as "ไม่มีขอบบน" / "no upper limit". */
export function formatCi(value, lang) { void value; void lang; throw new Error('not implemented: stats/format.formatCi'); }
