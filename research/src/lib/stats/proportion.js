// Confidence intervals for one proportion [M1-DESIGN.md 7.5]. Used by stats and epi. OWNER: stats role.
//
// - wilson: R's prop.test(correct = FALSE) interval (score interval), bounds kept inside 0..1 exactly
//   as R does (a bound is 0 when p = 0 and 1 when p = 1).
// - exact: Clopper-Pearson as R's binom.test: qbeta(alpha/2, x, n - x + 1) and qbeta(1 - alpha/2,
//   x + 1, n - x), 0 and 1 at the ends.
// - wald: p +/- z sqrt(p (1 - p) / n) (it collapses to 0 to 0 at p = 0); the value carries reasonKey
//   'stats.note.waldPoor' when it misbehaves, so the page says why it is not the default.
// - agresti-coull: n~ = n + z^2, p~ = (x + z^2 / 2) / n~, p~ +/- z sqrt(p~ (1 - p~) / n~).
// A proportion cannot be below 0 or above 1, so a Wald or Agresti-Coull bound that the formula puts
// outside 0..1 is held at the edge and the value carries noteKey 'stats.note.ciTruncated' (review
// round 1: "-2.4%" was printed for 0 of 25). The R pins are the formula as written; the tests clip them.
// z = qnorm(1 - alpha / 2) with alpha = 1 - confLevel (two-sided intervals only).
import { qnorm, qbeta, qchisq } from './dist.js';

/**
 * Hold an interval for a proportion inside 0..1.
 * @param {number} lo
 * @param {number} hi
 * @returns {{ ci: [number, number], truncated: boolean }}
 */
export function clipCi01(lo, hi) {
  const truncated = lo < 0 || hi > 1;
  return { ci: [Math.max(0, Math.min(1, lo)), Math.min(1, Math.max(0, hi))], truncated };
}

/**
 * @param {number} x successes
 * @param {number} n trials (n = 0 gives null bounds with reasonKey 'stats.undefined.noDenominator')
 * @param {'wilson'|'exact'|'wald'|'agresti-coull'} method  exact = Clopper-Pearson through qbeta
 * @param {number} confLevel
 * @returns {import('../runtime/types.js').Value}
 */
export function proportionCi(x, n, method = 'wilson', confLevel = 0.95) {
  if (!(n > 0)) return { value: null, ci: [null, null], ciLevel: confLevel, ciMethod: method, reasonKey: 'stats.undefined.noDenominator' };
  if (x < 0 || x > n) return { value: null, ci: [null, null], ciLevel: confLevel, ciMethod: method, reasonKey: 'stats.error.countOutOfRange' };
  const p = x / n;
  const alpha = 1 - confLevel;
  const z = qnorm(1 - alpha / 2);
  let lo;
  let hi;
  let reasonKey;
  if (method === 'exact') {
    lo = x === 0 ? 0 : qbeta(alpha / 2, x, n - x + 1);
    hi = x === n ? 1 : qbeta(1 - alpha / 2, x + 1, n - x);
  } else if (method === 'wald') {
    const h = z * Math.sqrt((p * (1 - p)) / n);
    lo = p - h;
    hi = p + h;
    if (x === 0 || x === n || lo < 0 || hi > 1) reasonKey = 'stats.note.waldPoor';
  } else if (method === 'agresti-coull') {
    const nt = n + z * z;
    const pt = (x + (z * z) / 2) / nt;
    const h = z * Math.sqrt((pt * (1 - pt)) / nt);
    lo = pt - h;
    hi = pt + h;
  } else if (method === 'wilson') {
    // R prop.test, YATES = 0, z <- qnorm((1 + conf.level) / 2)
    const zw = qnorm((1 + confLevel) / 2);
    const z22n = (zw * zw) / (2 * n);
    const pu = p >= 1 ? 1 : (p + z22n + zw * Math.sqrt((p * (1 - p)) / n + z22n / (2 * n))) / (1 + 2 * z22n);
    const pl = p <= 0 ? 0 : (p + z22n - zw * Math.sqrt((p * (1 - p)) / n + z22n / (2 * n))) / (1 + 2 * z22n);
    lo = Math.max(0, pl);
    hi = Math.min(1, pu);
  } else {
    throw new Error(`stats: proportion interval ${method} is not offered`);
  }
  const se = Math.sqrt((p * (1 - p)) / n);
  const clipped = clipCi01(lo, hi);
  const out = { value: p, ci: clipped.ci, ciLevel: confLevel, ciMethod: method, se };
  if (reasonKey) out.reasonKey = reasonKey;
  if (clipped.truncated) out.noteKey = 'stats.note.ciTruncated';
  return out;
}

/**
 * Exact Poisson interval for a count over person-time (chi-square quantiles), as poisson.test:
 * lower qgamma(alpha/2, x) = qchisq(alpha/2, 2x)/2 (0 when x = 0), upper qchisq(1 - alpha/2, 2x + 2)/2,
 * both divided by the time.
 * @returns {import('../runtime/types.js').Value}
 */
export function poissonRateCi(count, time, confLevel = 0.95) {
  if (!(time > 0)) return { value: null, ci: [null, null], ciLevel: confLevel, ciMethod: 'exact-poisson', reasonKey: 'stats.undefined.noDenominator' };
  const alpha = (1 - confLevel) / 2;
  const lo = count === 0 ? 0 : qchisq(alpha, 2 * count) / 2;
  const hi = qchisq(1 - alpha, 2 * count + 2) / 2;
  return { value: count / time, ci: [lo / time, hi / time], ciLevel: confLevel, ciMethod: 'exact-poisson' };
}
