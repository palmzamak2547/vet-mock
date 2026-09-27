// Confidence intervals for one proportion [M1-DESIGN.md 7.5]. Used by stats and epi. OWNER: stats role.

/**
 * @param {number} x successes
 * @param {number} n trials (n = 0 gives null bounds with reasonKey 'stats.undefined.noDenominator')
 * @param {'wilson'|'exact'|'wald'|'agresti-coull'} method  exact = Clopper-Pearson through qbeta
 * @param {number} confLevel
 * @returns {import('../runtime/types.js').Value}
 */
export function proportionCi(x, n, method, confLevel) { void x; void n; void method; void confLevel; throw new Error('not implemented: stats/proportion.proportionCi'); }

/** Exact Poisson interval for a count over person-time (chi-square quantiles), as poisson.test. */
export function poissonRateCi(count, time, confLevel) { void count; void time; void confLevel; throw new Error('not implemented: stats/proportion.poissonRateCi'); }
