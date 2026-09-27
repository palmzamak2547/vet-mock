// Distribution functions for every Tier A method [M1-DESIGN.md 7.1; engine.md 4]. Upper tails come
// from complement functions (erfc, the upper regularised incomplete gamma, the incomplete beta with
// swapped arguments), never 1 - cdf: at x = 100, df = 1 the chi-square upper tail is 1.524e-23 and
// 1 - cdf returns 0. The one exception is the studentized range, where R's own ptukey(lower.tail =
// FALSE) is computed as 1 - cdf (src/nmath/ptukey.c, R_DT_val); we match R and say so.
// OWNER: stats role.
import erfc from '@stdlib/math-base-special-erfc';
import gammainc from '@stdlib/math-base-special-gammainc';
import betainc from '@stdlib/math-base-special-betainc';
import gammaln from '@stdlib/math-base-special-gammaln';
import binomcoefln from '@stdlib/math-base-special-binomcoefln';
import normalQuantile from '@stdlib/stats-base-dists-normal-quantile';
import tQuantile from '@stdlib/stats-base-dists-t-quantile';
import chisqQuantile from '@stdlib/stats-base-dists-chisquare-quantile';
import fQuantile from '@stdlib/stats-base-dists-f-quantile';
import betaQuantile from '@stdlib/stats-base-dists-beta-quantile';
import tukeyCdf from '@stdlib/stats-base-dists-studentized-range-cdf';
import tukeyQuantile from '@stdlib/stats-base-dists-studentized-range-quantile';

/** @internal the imported kernels, re-exported for tests that compare wrappers to them */
export const KERNELS = { erfc, gammainc, betainc, gammaln, binomcoefln, normalQuantile, tQuantile, chisqQuantile, fQuantile, betaQuantile, tukeyCdf, tukeyQuantile };

/** P(Z > z) = erfc(z / sqrt 2) / 2. */
export function pnormUpper(z) { void z; throw new Error('not implemented: stats/dist.pnormUpper'); }
/** P(Z < z). */
export function pnormLower(z) { void z; throw new Error('not implemented: stats/dist.pnormLower'); }
/** Two-sided normal p for |z|. */
export function pnormTwoSided(z) { void z; throw new Error('not implemented: stats/dist.pnormTwoSided'); }
/** Normal quantile. */
export function qnorm(p) { void p; throw new Error('not implemented: stats/dist.qnorm'); }

/** P(T > t) for t >= 0 via I_{df/(df+t^2)}(df/2, 1/2) / 2; symmetric for t < 0. */
export function ptUpper(t, df) { void t; void df; throw new Error('not implemented: stats/dist.ptUpper'); }
/** Two-sided t p = I_{df/(df+t^2)}(df/2, 1/2). */
export function ptTwoSided(t, df) { void t; void df; throw new Error('not implemented: stats/dist.ptTwoSided'); }
export function qt(p, df) { void p; void df; throw new Error('not implemented: stats/dist.qt'); }

/** P(X > x), X ~ chi-square(df): upper regularised incomplete gamma Q(df/2, x/2). */
export function pchisqUpper(x, df) { void x; void df; throw new Error('not implemented: stats/dist.pchisqUpper'); }
export function qchisq(p, df) { void p; void df; throw new Error('not implemented: stats/dist.qchisq'); }

/** P(F > f) = I_{d2/(d2+d1 f)}(d2/2, d1/2). */
export function pfUpper(f, d1, d2) { void f; void d1; void d2; throw new Error('not implemented: stats/dist.pfUpper'); }
export function qf(p, d1, d2) { void p; void d1; void d2; throw new Error('not implemented: stats/dist.qf'); }

export function qbeta(p, a, b) { void p; void a; void b; throw new Error('not implemented: stats/dist.qbeta'); }

/** Binomial lower tail P(X <= k) and upper tail P(X >= k) through the incomplete beta. */
export function pbinomLower(k, n, p) { void k; void n; void p; throw new Error('not implemented: stats/dist.pbinomLower'); }
export function pbinomUpper(k, n, p) { void k; void n; void p; throw new Error('not implemented: stats/dist.pbinomUpper'); }

/** Studentized range upper tail, as R computes it: 1 - ptukey(q, nmeans, df). */
export function ptukeyUpper(q, nmeans, df) { void q; void nmeans; void df; throw new Error('not implemented: stats/dist.ptukeyUpper'); }
export function qtukey(p, nmeans, df) { void p; void nmeans; void df; throw new Error('not implemented: stats/dist.qtukey'); }

/** log C(n, k) and log Gamma for exact tests. */
export function lchoose(n, k) { void n; void k; throw new Error('not implemented: stats/dist.lchoose'); }
export function lgamma(x) { void x; throw new Error('not implemented: stats/dist.lgamma'); }
