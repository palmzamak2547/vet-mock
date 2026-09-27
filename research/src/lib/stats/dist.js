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

const SQRT1_2 = Math.SQRT1_2;

/**
 * I_x(a, b) evaluated from whichever side keeps the argument away from 1, so a tail that is tiny is
 * never obtained by subtracting two numbers close to 1. `xc` is 1 - x computed by the caller without
 * cancellation. Returns the LOWER regularised incomplete beta I_x(a, b).
 */
function ibeta(x, xc, a, b) {
  if (x <= 0) return 0;
  if (xc <= 0) return 1;
  if (x <= 0.5) return betainc(x, a, b, true, false);
  // I_x(a, b) = 1 - I_{1-x}(b, a) = upper regularised incomplete beta of (1 - x, b, a)
  return betainc(xc, b, a, true, true);
}

// ---------------------------------------------------------------- normal

/** P(Z > z) = erfc(z / sqrt 2) / 2. */
export function pnormUpper(z) {
  if (Number.isNaN(z)) return NaN;
  return 0.5 * erfc(z * SQRT1_2);
}
/** P(Z < z). */
export function pnormLower(z) {
  if (Number.isNaN(z)) return NaN;
  return 0.5 * erfc(-z * SQRT1_2);
}
/** Two-sided normal p for |z|: erfc(|z| / sqrt 2). */
export function pnormTwoSided(z) {
  if (Number.isNaN(z)) return NaN;
  return Math.min(1, erfc(Math.abs(z) * SQRT1_2));
}
export { qnorm } from './qnorm.js';
import { qnorm } from './qnorm.js';

// ---------------------------------------------------------------- t

/**
 * P(T > t) for t >= 0 via I_{df/(df+t^2)}(df/2, 1/2) / 2; for t < 0 the value is 1 minus the tail
 * of |t| (>= 0.5, so no cancellation). df may be non-integer (Welch) or Infinity (normal).
 */
export function ptUpper(t, df) {
  if (Number.isNaN(t) || Number.isNaN(df) || df <= 0) return NaN;
  if (!Number.isFinite(df)) return pnormUpper(t);
  if (t === Infinity) return 0;
  if (t === -Infinity) return 1;
  const t2 = t * t;
  const x = df / (df + t2);
  const xc = t2 / (df + t2);
  const tail = 0.5 * ibeta(x, xc, df / 2, 0.5);
  return t >= 0 ? tail : 1 - tail;
}
/** P(T < t). */
export function ptLower(t, df) { return ptUpper(-t, df); }
/** Two-sided t p = I_{df/(df+t^2)}(df/2, 1/2). */
export function ptTwoSided(t, df) {
  if (Number.isNaN(t) || Number.isNaN(df) || df <= 0) return NaN;
  if (!Number.isFinite(df)) return pnormTwoSided(t);
  if (!Number.isFinite(t)) return 0;
  const t2 = t * t;
  return Math.min(1, ibeta(df / (df + t2), t2 / (df + t2), df / 2, 0.5));
}
/** t quantile (lower tail). */
export function qt(p, df) {
  if (!Number.isFinite(df)) return qnorm(p);
  return tQuantile(p, df);
}

// ---------------------------------------------------------------- chi-square

/** P(X > x), X ~ chi-square(df): upper regularised incomplete gamma Q(df/2, x/2). */
export function pchisqUpper(x, df) {
  if (Number.isNaN(x) || Number.isNaN(df) || df <= 0) return NaN;
  if (x <= 0) return 1;
  if (x === Infinity) return 0;
  return gammainc(x / 2, df / 2, true, true);
}
/** P(X < x). */
export function pchisqLower(x, df) {
  if (Number.isNaN(x) || Number.isNaN(df) || df <= 0) return NaN;
  if (x <= 0) return 0;
  if (x === Infinity) return 1;
  return gammainc(x / 2, df / 2, true, false);
}
export function qchisq(p, df) { return chisqQuantile(p, df); }

// ---------------------------------------------------------------- F

/** P(F > f) = I_{d2/(d2+d1 f)}(d2/2, d1/2). */
export function pfUpper(f, d1, d2) {
  if (Number.isNaN(f) || !(d1 > 0) || !(d2 > 0)) return NaN;
  if (f <= 0) return 1;
  if (f === Infinity) return 0;
  const den = d2 + d1 * f;
  return ibeta(d2 / den, (d1 * f) / den, d2 / 2, d1 / 2);
}
export function qf(p, d1, d2) { return fQuantile(p, d1, d2); }

export function qbeta(p, a, b) { return betaQuantile(p, a, b); }

// ---------------------------------------------------------------- binomial

/** P(X <= k), X ~ Binomial(n, p) = I_{1-p}(n - k, k + 1). */
export function pbinomLower(k, n, p) {
  k = Math.floor(k + 1e-7);
  if (k < 0) return 0;
  if (k >= n) return 1;
  if (p <= 0) return 1;
  if (p >= 1) return 0;
  return ibeta(1 - p, p, n - k, k + 1);
}
/** P(X >= k) = I_p(k, n - k + 1). */
export function pbinomUpper(k, n, p) {
  k = Math.ceil(k - 1e-7);
  if (k <= 0) return 1;
  if (k > n) return 0;
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return ibeta(p, 1 - p, k, n - k + 1);
}
/** P(X = k). */
export function dbinom(k, n, p) {
  if (k < 0 || k > n || k !== Math.floor(k)) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p));
}

// ---------------------------------------------------------------- hypergeometric

/**
 * P(X = x) for X the number of white balls in k draws from an urn with m white and n black balls
 * (R's dhyper(x, m, n, k)).
 */
export function dhyper(x, m, n, k) {
  if (x !== Math.floor(x) || x < Math.max(0, k - n) || x > Math.min(k, m)) return 0;
  return Math.exp(lchoose(m, x) + lchoose(n, k - x) - lchoose(m + n, k));
}
/** P(X <= x), summed from the side nearer the requested tail so small tails stay exact. */
export function phyperLower(x, m, n, k) {
  x = Math.floor(x + 1e-7);
  const lo = Math.max(0, k - n);
  const hi = Math.min(k, m);
  if (x < lo) return 0;
  if (x >= hi) return 1;
  let s = 0;
  for (let i = lo; i <= x; i++) s += dhyper(i, m, n, k);
  return Math.min(1, s);
}
/** P(X >= x). */
export function phyperUpper(x, m, n, k) {
  x = Math.ceil(x - 1e-7);
  const lo = Math.max(0, k - n);
  const hi = Math.min(k, m);
  if (x <= lo) return 1;
  if (x > hi) return 0;
  let s = 0;
  for (let i = hi; i >= x; i--) s += dhyper(i, m, n, k);
  return Math.min(1, s);
}

// ---------------------------------------------------------------- studentized range

/** Studentized range upper tail, as R computes it: 1 - ptukey(q, nmeans, df) (M1-DESIGN.md A8). */
export function ptukeyUpper(q, nmeans, df) {
  if (Number.isNaN(q)) return NaN;
  if (q <= 0) return 1;
  const c = tukeyCdf(q, nmeans, df);
  return Number.isNaN(c) ? NaN : 1 - c;
}
export function qtukey(p, nmeans, df) { return tukeyQuantile(p, nmeans, df); }

// ---------------------------------------------------------------- helpers

/** log C(n, k) and log Gamma for exact tests. */
export function lchoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  return binomcoefln(n, k);
}
export function lgamma(x) { return gammaln(x); }
