// Multivariate t probabilities for Dunnett comparisons: with every comparison sharing the control, the
// correlation is lambda_i lambda_j with lambda_i = sqrt(n_i / (n_i + n_0)), so the probability is a two-
// dimensional integral (over the normal and the chi variable) [M2-DESIGN.md 3.1.4]. OWNER: lab role.
//
// With T_i = (lambda_i Z + sqrt(1 - lambda_i^2) Z_i) / S, Z and Z_i independent standard normals and
// S = sqrt(chi-square(df) / df), conditioning on S = s and Z = z makes the T_i independent:
//   P(|T_i| <= c for every i) = E_S E_Z prod_i [Phi(b_i) - Phi(a_i)],
//   a_i = (-c s - lambda_i z) / r_i,  b_i = (c s - lambda_i z) / r_i,  r_i = sqrt(1 - lambda_i^2)
// (Dunnett 1955; the same reduction Genz and Bretz 2009, section 2.3, describe for product correlation).
// Nothing is simulated. The integral is taken for the complement 1 - P directly, with 1 - prod(1 - q_i)
// = -expm1(sum log1p(-q_i)) and q_i = Phi(a_i) + Phi(-b_i) from erfc, so an adjusted p-value of 1e-12
// keeps its digits instead of being 1 minus a number near 1.
//
// Both integrals are adaptive Gauss-Kronrod (10-point Gauss inside 21-point Kronrod, QUADPACK qk21 nodes),
// bisecting the panel with the largest error estimate until the total estimate is below the tolerance.
// The outer variable is u = log s with density 2 w^(df/2) exp(-w) / Gamma(df/2), w = df e^(2u) / 2, on a
// range whose left-out tails are below 1e-19; the inner one is z on [-9, 9] (|z| > 9 carries < 2e-19).
// The returned error bound is the outer estimate plus the largest inner estimate (the outer density
// integrates to 1), and it stays honest when a panel budget (below) runs out. Tolerances: 1e-13 absolute
// outer, 1e-15 absolute inner; the Dunnett fixtures check p to 1e-8 absolute and the critical value to
// 1e-8 relative against mvtnorm TVPACK, and five comparisons against an independent mpmath evaluation.
import erfc from '@stdlib/math-base-special-erfc';
import { lgamma, qt } from './dist.js';
import { uniroot } from './rootfind.js';

const XGK = [
  0.995657163025808080735527280689003, 0.973906528517171720077964012084452, 0.930157491355708226001207180059508,
  0.865063366688984510732096688423493, 0.780817726586416897063717578345042, 0.679409568299024406234327365114874,
  0.562757134668604683339000099272694, 0.433395394129247190799265943165784, 0.294392862701460198131126603103866,
  0.148874338981631210884826001129720, 0,
];
const WGK = [
  0.011694638867371874278064396062192, 0.032558162307964727478818972459390, 0.054755896574351996031381300244580,
  0.075039674810919952767043140916190, 0.093125454583697605535065465083366, 0.109387158802297641899210590325805,
  0.123491976262065851077208980761030, 0.134709217311473325928054001771707, 0.142775938577060080797094273138717,
  0.147739104901338491374841515972068, 0.149445554002916905664936468389821,
];
const WG = [0.066671344308688137593568809893332, 0.149451349150580593145776339657697, 0.219086362515982043995534934228163, 0.269266719309996355091226921569469, 0.295524224714752870173892994651146];

/** One qk21 panel: Kronrod value and |Kronrod - Gauss|. */
function qk21(f, a, b) {
  const c = (a + b) / 2;
  const h = (b - a) / 2;
  const fc = f(c);
  let resk = fc * WGK[10];
  let resg = 0;
  for (let j = 0; j < 10; j++) {
    const x = h * XGK[j];
    const s = f(c - x) + f(c + x);
    resk += WGK[j] * s;
    if (j % 2 === 1) resg += WG[(j - 1) / 2] * s;
  }
  return { value: resk * h, error: Math.abs((resk - resg) * h) };
}

/**
 * Adaptive Gauss-Kronrod over [a, b] split first at the given points.
 * @param {(x: number) => number} f
 * @param {number[]} points  sorted, the ends included
 * @param {number} absTol
 * @param {number} [maxPanels]
 * @returns {{ value: number, error: number }}
 */
export function integrate(f, points, absTol, maxPanels = 400) {
  const panels = [];
  for (let i = 0; i + 1 < points.length; i++) {
    const r = qk21(f, points[i], points[i + 1]);
    panels.push({ a: points[i], b: points[i + 1], ...r });
  }
  const total = () => panels.reduce((s, p) => s + p.error, 0);
  while (total() > absTol && panels.length < maxPanels) {
    let w = 0;
    for (let i = 1; i < panels.length; i++) if (panels[i].error > panels[w].error) w = i;
    const { a, b } = panels[w];
    const m = (a + b) / 2;
    if (!(m > a && m < b)) break;
    panels.splice(w, 1, { a, b: m, ...qk21(f, a, m) }, { a: m, b, ...qk21(f, m, b) });
  }
  let value = 0;
  let c = 0;
  for (const p of panels) { const y = p.value - c; const t = value + y; c = (t - value) - y; value = t; }
  return { value, error: total() };
}

// Work caps: a smooth integrand meets the tolerances long before them (each fixture call takes 10 to 50 ms
// here). If a panel budget runs out the estimate is kept and its larger error is what the method prints,
// so the time an analysis takes stays bounded (at most 80 x 21 outer points, each a 40-panel inner integral).
const INNER_PANELS = 40;
const OUTER_PANELS = 80;
const SQRT1_2 = Math.SQRT1_2;
const LOG_2PI_HALF = 0.5 * Math.log(2 * Math.PI);
/** Standard normal density. */
function dnorm(z) { return Math.exp(-0.5 * z * z - LOG_2PI_HALF); }
/** Phi(x) from erfc (no 1 - cdf). */
function pnormLow(x) { return 0.5 * erfc(-x * SQRT1_2); }

/**
 * 1 - P(|T_i| <= c for every i), with its error bound.
 * @param {number} c @param {number[]} lambda @param {number} df
 * @returns {{ value: number, error: number }}
 */
export function dunnettUpper(c, lambda, df) {
  if (!(c > 0)) return { value: 1, error: 0 };
  if (c === Infinity) return { value: 0, error: 0 };
  const lam = lambda.map(Number);
  const r = lam.map((l) => Math.sqrt((1 - l) * (1 + l)));
  let innerErr = 0;
  const inner = (s) => {
    const cs = c * s;
    const g = (z) => {
      let acc = 0;
      for (let i = 0; i < lam.length; i++) {
        const q = pnormLow((-cs - lam[i] * z) / r[i]) + pnormLow((-cs + lam[i] * z) / r[i]);
        if (q >= 1) return dnorm(z);
        acc += Math.log1p(-q);
      }
      return -Math.expm1(acc) * dnorm(z);
    };
    const res = integrate(g, [-9, -3, -1, 0, 1, 3, 9], 1e-15, INNER_PANELS);
    if (res.error > innerErr) innerErr = res.error;
    return res.value;
  };
  if (!Number.isFinite(df)) {
    const res = inner(1);
    return { value: Math.min(1, Math.max(0, res)), error: innerErr };
  }
  const logConst = Math.log(2) - lgamma(df / 2);
  const outer = (u) => {
    const w = (df * Math.exp(2 * u)) / 2;
    const dens = Math.exp(logConst + (df / 2) * Math.log(w) - w);
    return dens > 0 ? dens * inner(Math.exp(u)) : 0;
  };
  const lo = -Math.max(Math.sqrt(90 / df), 90 / df + 0.5);
  const hi = Math.max(0.5 * Math.log1p(200 / df), Math.sqrt(90 / df));
  const pts = [lo, lo / 2, lo / 4, 0, hi / 4, hi / 2, hi];
  const res = integrate(outer, pts, 1e-13, OUTER_PANELS);
  return { value: Math.min(1, Math.max(0, res.value)), error: res.error + innerErr };
}

/**
 * P(|T_i| <= c for every i).
 * @param {number} c
 * @param {number[]} lambda
 * @param {number} df
 * @returns {number}
 */
export function dunnettProbability(c, lambda, df) {
  return 1 - dunnettUpper(c, lambda, df).value;
}

/**
 * The c with dunnettProbability(c) = conf (Brent, stats/rootfind.js).
 * @param {number} conf
 * @param {number[]} lambda
 * @param {number} df
 * @returns {number}
 */
export function dunnettQuantile(conf, lambda, df) {
  const alpha = 1 - conf;
  const k = lambda.length;
  const single = qt(1 - alpha / 2, df);
  if (k === 1) return single;
  const bonf = qt(1 - alpha / (2 * k), df);
  const f = (c) => dunnettUpper(c, lambda, df).value - alpha;
  return uniroot(f, [single * (1 - 1e-6), bonf * (1 + 1e-6)], { tol: 1e-12 }).root;
}
