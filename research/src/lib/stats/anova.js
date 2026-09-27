// One-way ANOVA with Tukey HSD (Tukey-Kramer for unequal n) and pairwise t with Holm or Bonferroni
// [M1-DESIGN.md 7.7]. OWNER: stats role.

/** Implementation for 'test.anova1' (and 'posthoc.tukey' through options.posthoc). @type {import('../runtime/registry.js').MethodImpl} */
export function runAnova1(spec, table) { void spec; void table; throw new Error('not implemented: stats/anova.runAnova1'); }

/**
 * @param {number[][]} groups
 * @returns {{ F: number|null, df1: number, df2: number, p: number|null, ssBetween: number, ssWithin: number, msWithin: number, means: number[], ns: number[] }}
 */
export function anova1(groups) { void groups; throw new Error('not implemented: stats/anova.anova1'); }

/**
 * Pairs in R's TukeyHSD order (level j minus level i for i < j), diff, CI and adjusted p.
 * @param {number[][]} groups @param {string[]} labels @param {number} confLevel
 * @returns {{ pair: string, diff: number, ci: [number, number], p: number }[]}
 */
export function tukeyHsd(groups, labels, confLevel) { void groups; void labels; void confLevel; throw new Error('not implemented: stats/anova.tukeyHsd'); }
