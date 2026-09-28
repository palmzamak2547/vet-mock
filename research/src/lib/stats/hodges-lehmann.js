// Hodges-Lehmann estimates and intervals for the rank tests (R wilcox.test(conf.int = TRUE)), exact when n <
// 50 [M2-DESIGN.md 3.1.6].
// OWNER: lab role (written by the integrator in M2).
//
// A port of R 4.6.0 wilcox.test.default's conf.int branches (src/library/stats/R/wilcox.test.R):
// - exact, no ties (and, paired, no zero differences): the estimate is the median of the n1 n2 differences
//   x_i - y_j (two samples) or of the n (n + 1) / 2 Walsh averages (paired); the two-sided interval is the
//   order statistics [qu, N - qu + 1] with qu = qwilcox(alpha / 2, n1, n2) or qsignrank(alpha / 2, n)
//   (qu = 1 when the quantile is 0);
// - otherwise the normal approximation: the interval ends are the shifts d where the continuity-corrected,
//   tie-corrected z of the data shifted by d equals -/+ qnorm(1 - alpha / 2), and the estimate is the
//   shift where the uncorrected z is 0 (R finds each with uniroot(tol = 1e-4) on [min, max]; here a
//   bisection on the same step function to 1e-10, so the numbers sit at the jump R's root approaches).
// Hodges JL, Lehmann EL. Estimates of location based on rank tests. Ann Math Stat 1963;34:598-611.
import { qnorm } from './dist.js';
import { rankAvg } from './common.js';
import { pwilcoxLower, psignrankLower } from './rank.js';

const DBL_EPSILON = 2.220446049250313e-16;

/** R qwilcox(p, m, n) for p <= 0.5: the smallest q with P(W <= q) >= p. */
export function qwilcox(p, m, n) {
  const x = p - 10 * DBL_EPSILON;
  for (let q = 0; q <= m * n; q++) if (pwilcoxLower(q, m, n) >= x) return q;
  return m * n;
}

/** R qsignrank(p, n) for p <= 0.5. */
export function qsignrank(p, n) {
  const x = p - 10 * DBL_EPSILON;
  const max = (n * (n + 1)) / 2;
  for (let q = 0; q <= max; q++) if (psignrankLower(q, n) >= x) return q;
  return max;
}

function median(sorted) {
  const n = sorted.length;
  const h = Math.floor(n / 2);
  return n % 2 ? sorted[h] : (sorted[h - 1] + sorted[h]) / 2;
}

/** Sum over tie groups of (t^3 - t) (the tie sizes rankAvg reports). */
function tieSum(ties) {
  let s = 0;
  for (const t of ties) s += t * t * t - t;
  return s;
}

/** A root of the non-increasing step function f on [lo, hi] (f(lo) > 0 > f(hi)) by bisection. */
function stepRoot(f, lo, hi) {
  let a = lo, b = hi;
  for (let i = 0; i < 200 && b - a > 1e-10 * Math.max(1, Math.abs(a), Math.abs(b)); i++) {
    const mid = (a + b) / 2;
    if (f(mid) > 0) a = mid; else b = mid;
  }
  return (a + b) / 2;
}

/** R's root(zq): the ends of the range when the statistic never reaches zq there. */
function rootAt(W, zq, lo, hi) {
  if (W(lo) - zq <= 0) return lo;
  if (W(hi) - zq >= 0) return hi;
  return stepRoot((d) => W(d) - zq, lo, hi);
}

const hasTies = (xs) => new Set(xs).size !== xs.length;

/**
 * @param {number[]} x
 * @param {number[]} y
 * @param {{ confLevel: number, exact: boolean, correct: boolean }} opts
 * @returns {{ estimate: number, ci: [number, number], exact: boolean }}
 */
export function hodgesLehmannTwo(x, y, opts) {
  const conf = opts?.confLevel ?? 0.95;
  const alpha = 1 - conf;
  const nx = x.length, ny = y.length;
  const exact = (opts?.exact ?? (nx < 50 && ny < 50)) && !hasTies([...x, ...y]);
  if (exact) {
    const diffs = [];
    for (const a of x) for (const b of y) diffs.push(a - b);
    diffs.sort((a, b) => a - b);
    let qu = qwilcox(alpha / 2, nx, ny);
    if (qu === 0) qu = 1;
    const ql = nx * ny - qu;
    return { estimate: median(diffs), ci: [diffs[qu - 1], diffs[ql]], exact: true };
  }
  const correct = opts?.correct ?? true;
  const N = nx + ny;
  const W = (d, cc) => {
    const { ranks: dr, ties } = rankAvg([...x.map((v) => v - d), ...y]);
    let sx = 0;
    for (let i = 0; i < nx; i++) sx += dr[i];
    const dz = sx - (nx * (nx + 1)) / 2 - (nx * ny) / 2;
    const corr = cc ? Math.sign(dz) * 0.5 : 0;
    const sigma = Math.sqrt(((nx * ny) / 12) * ((N + 1) - tieSum(ties) / (N * (N - 1))));
    return (dz - corr) / sigma;
  };
  const lo = Math.min(...x) - Math.max(...y);
  const hi = Math.max(...x) - Math.min(...y);
  const zq = qnorm(1 - alpha / 2);
  const Wc = (d) => W(d, correct);
  const l = rootAt(Wc, zq, lo, hi);
  const u = rootAt(Wc, -zq, lo, hi);
  const estimate = rootAt((d) => W(d, false), 0, lo, hi);
  return { estimate, ci: [l, u], exact: false };
}

/**
 * @param {number[]} d   differences x - y
 * @param {{ confLevel: number, exact: boolean, correct: boolean }} opts
 * @returns {{ estimate: number, ci: [number, number], exact: boolean }}
 */
export function hodgesLehmannPaired(d, opts) {
  const conf = opts?.confLevel ?? 0.95;
  const alpha = 1 - conf;
  const zeros = d.some((v) => v === 0);
  const x = d.filter((v) => v !== 0);
  const n = x.length;
  const exact = (opts?.exact ?? n < 50) && !hasTies(x.map(Math.abs)) && !zeros;
  if (exact) {
    const walsh = [];
    for (let i = 0; i < n; i++) for (let j = i; j < n; j++) walsh.push((x[i] + x[j]) / 2);
    walsh.sort((a, b) => a - b);
    let qu = qsignrank(alpha / 2, n);
    if (qu === 0) qu = 1;
    const ql = (n * (n + 1)) / 2 - qu;
    return { estimate: median(walsh), ci: [walsh[qu - 1], walsh[ql]], exact: true };
  }
  const correct = opts?.correct ?? true;
  const W = (dd, cc) => {
    const xd = x.map((v) => v - dd).filter((v) => v !== 0);
    const nx = xd.length;
    if (nx === 0) return 0;
    const { ranks: dr, ties } = rankAvg(xd.map(Math.abs));
    let zd = -(nx * (nx + 1)) / 4;
    for (let i = 0; i < nx; i++) if (xd[i] > 0) zd += dr[i];
    const sigma = Math.sqrt((nx * (nx + 1) * (2 * nx + 1)) / 24 - tieSum(ties) / 48);
    const corr = cc ? Math.sign(zd) * 0.5 : 0;
    return (zd - corr) / sigma;
  };
  const lo = Math.min(...x), hi = Math.max(...x);
  const zq = qnorm(1 - alpha / 2);
  const l = rootAt((v) => W(v, correct), zq, lo, hi);
  const u = rootAt((v) => W(v, correct), -zq, lo, hi);
  const estimate = rootAt((v) => W(v, false), 0, lo, hi);
  return { estimate, ci: [l, u], exact: false };
}
