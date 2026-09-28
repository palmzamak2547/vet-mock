// Noncentral t and F distributions for power (R pnt, AS 243; R pnbeta, AS 226 with Frick 1990) [M2-DESIGN.md
// 3.1.7].
// OWNER: lab role (written by the integrator in M2).
//
// Ports of R 4.6.0 src/nmath/pnt.c and pnbeta.c, line for line, in double precision (R sums in long double
// where the platform has it; the difference is far below the series' own error bound).
// Lenth RV. Algorithm AS 243: cumulative distribution function of the non-central t distribution. Appl
// Stat 1989;38:185-189 (with Guenther 1978's twin series; errmax 1e-12, itrmax 1000 as R).
// Lenth RV. Algorithm AS 226: computing noncentral beta probabilities. Appl Stat 1987;36:241-244, with
// Frick H. Algorithm AS R84. Appl Stat 1990;39:311-312 (start the series at the Poisson mode; errmax
// 1e-9, itrmax 10000 as R).
// An upper tail is 1 - lower here, as in R (pnt and pnbeta2 both form it that way), so the numbers are
// R's; a tail smaller than R's absolute error bound is as accurate as that bound, no more (fixture notes).
import { KERNELS, pnormLower, pnormUpper, ptLower, ptUpper } from './dist.js';

const { betainc, gammaln } = KERNELS;
const M_LN_SQRT_PI = 0.572364942924700087071713675677;
const M_SQRT_2dPI = 0.797884560802865355879892119869;
const M_LN2 = 0.693147180559945309417232121458;
const DBL_MIN_EXP = -1021;
const DBL_EPSILON = 2.220446049250313e-16;

/** Regularized incomplete beta I_x(a, b), lower tail. */
function pbetaLower(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return betainc(x, a, b, true, false);
}

/** Normal distribution function with mean and sd, lower or upper tail. */
function pnormMs(x, mean, sd, lower) {
  const z = (x - mean) / sd;
  return lower ? pnormLower(z) : pnormUpper(z);
}

/**
 * @param {number} t
 * @param {number} df
 * @param {number} ncp
 * @param {boolean} lowerTail
 * @returns {number}
 */
export function pnt(t, df, ncp, lowerTail) {
  const itrmax = 1000;
  const errmax = 1e-12;
  if (!(df > 0)) return NaN;
  if (ncp === 0) return lowerTail ? ptLower(t, df) : ptUpper(t, df);
  if (!Number.isFinite(t)) return (t < 0) === lowerTail ? 0 : 1;
  let negdel, tt, del;
  if (t >= 0) {
    negdel = false; tt = t; del = ncp;
  } else {
    if (ncp > 40) return lowerTail ? 0 : 1; // pt(q, df, ncp) <= pnorm(-ncp): R_DT_0
    negdel = true; tt = -t; del = -ncp;
  }
  if (df > 4e5 || del * del > 2 * M_LN2 * -DBL_MIN_EXP) {
    // Abramowitz and Stegun 26.7.10
    const s = 1 / (4 * df);
    return pnormMs(tt * (1 - s), del, Math.sqrt(1 + tt * tt * 2 * s), lowerTail !== negdel);
  }
  let x = t * t;
  x = x / (x + df);
  let tnc;
  if (x > 0) {
    const lambda = del * del;
    let p = 0.5 * Math.exp(-0.5 * lambda);
    if (p === 0) return lowerTail ? 0 : 1; // underflow: R returns R_DT_0 (before the tail is flipped)
    let q = M_SQRT_2dPI * p * del;
    let s = 0.5 - p;
    if (s < 1e-7) s = -0.5 * Math.expm1(-0.5 * lambda);
    let a = 0.5;
    const b = 0.5 * df;
    const rxb = Math.pow(1 - x, b);
    const albeta = M_LN_SQRT_PI + gammaln(b) - gammaln(0.5 + b);
    let xodd = pbetaLower(x, a, b);
    let godd = 2 * rxb * Math.exp(a * Math.log(x) - albeta);
    tnc = b * x;
    let xeven = tnc < DBL_EPSILON ? tnc : 1 - rxb;
    let geven = tnc * rxb;
    tnc = p * xodd + q * xeven;
    for (let it = 1; it <= itrmax; it++) {
      a += 1;
      xodd -= godd;
      xeven -= geven;
      godd *= (x * (a + b - 1)) / a;
      geven *= (x * (a + b - 0.5)) / (a + 0.5);
      p *= lambda / (2 * it);
      q *= lambda / (2 * it + 1);
      tnc += p * xodd + q * xeven;
      s -= p;
      if (s < -1e-10) break; // rounding error: R warns "full precision may not have been achieved"
      if (s <= 0 && it > 1) break;
      const errbd = 2 * s * (xodd - godd);
      if (Math.abs(errbd) < errmax) break;
    }
  } else {
    tnc = 0;
  }
  tnc += pnormLower(-del);
  const lower = lowerTail !== negdel;
  const v = Math.min(tnc, 1);
  return lower ? v : 0.5 - v + 0.5;
}

/** R pnbeta_raw: P(X <= x) for the noncentral beta, x and o_x = 1 - x given separately. */
export function pnbetaRaw(x, oX, a, b, ncp) {
  const errmax = 1e-9;
  const itrmax = 10000;
  if (ncp < 0 || a <= 0 || b <= 0) return NaN;
  if (x < 0 || oX > 1 || (x === 0 && oX === 1)) return 0;
  if (x > 1 || oX < 0 || (x === 1 && oX === 0)) return 1;
  const c = ncp / 2;
  const x0 = Math.floor(Math.max(c - 7 * Math.sqrt(c), 0));
  const a0 = a + x0;
  const lbeta = gammaln(a0) + gammaln(b) - gammaln(a0 + b);
  let temp = x < 0.5 ? pbetaLower(x, a0, b) : 1 - betainc(oX, b, a0, true, false);
  let gx = Math.exp(a0 * Math.log(x) + b * (x < 0.5 ? Math.log1p(-x) : Math.log(oX)) - lbeta - Math.log(a0));
  let q = a0 > a ? Math.exp(-c + x0 * Math.log(c) - gammaln(x0 + 1)) : Math.exp(-c);
  let sumq = 1 - q;
  let ans = q * temp;
  let errbd;
  let j = Math.floor(x0);
  do {
    j++;
    temp -= gx;
    gx *= (x * (a + b + j - 1)) / (a + j);
    q *= c / j;
    sumq -= q;
    ans += temp * q;
    errbd = (temp - gx) * sumq;
  } while (errbd > errmax && j < itrmax + x0);
  return ans;
}

/**
 * @param {number} f
 * @param {number} df1
 * @param {number} df2
 * @param {number} ncp
 * @param {boolean} lowerTail
 * @returns {number}
 */
export function pnf(f, df1, df2, ncp, lowerTail) {
  if (!(df1 > 0) || !(df2 > 0) || !(ncp >= 0) || !Number.isFinite(ncp)) return NaN;
  if (!(f > 0)) return lowerTail ? 0 : 1;
  if (f === Infinity) return lowerTail ? 1 : 0;
  const y = (df1 / df2) * f;
  let ans = pnbetaRaw(y / (1 + y), 1 / (1 + y), df1 / 2, df2 / 2, ncp);
  if (lowerTail) return ans;
  if (ans > 1) ans = 1;
  return 1 - ans;
}
