// Kernel density for violins: Gaussian kernel with R's bw.nrd0 bandwidth, evaluated directly (not R's binned
// FFT) [M2-DESIGN.md 8.2]. Pinned by tests/unit/graphs-density.test.mjs against R 4.6.0 bw.nrd0 and
// density() on two.g1, three and RoundingTimes. OWNER: graphs role.
import { quantile } from '../../lib/stats/descriptive.js';

/**
 * R's bw.nrd0 (stats/R/bandwidths.R): 0.9 min(sd, IQR / 1.34) n^(-1/5), with R's fallbacks when that
 * minimum is 0 (the sd, then |x[1]|, then 1). IQR is quantile type 7, R's IQR() default.
 * @param {number[]} x
 * @returns {number}
 */
export function bwNrd0(x) {
  const n = x.length;
  if (n < 2) throw new Error('need at least 2 data points');
  let m = 0;
  for (const v of x) m += v;
  m /= n;
  let ss = 0;
  for (const v of x) ss += (v - m) * (v - m);
  const hi = Math.sqrt(ss / (n - 1));
  const s = [...x].sort((a, b) => a - b);
  const iqr = quantile(s, 0.75, 7) - quantile(s, 0.25, 7);
  let lo = Math.min(hi, iqr / 1.34);
  if (!lo) lo = hi || Math.abs(x[0]) || 1;
  return 0.9 * lo * n ** -0.2;
}

const INV_SQRT_2PI = 1 / Math.sqrt(2 * Math.PI);

/**
 * Gaussian kernel density of x with bandwidth bw (the kernel's SD), at each point of `at`.
 * @param {number[]} x
 * @param {number} bw
 * @param {number[]} at
 * @returns {number[]}
 */
export function kde(x, bw, at) {
  const n = x.length;
  if (!n || !(bw > 0)) return at.map(() => 0);
  const c = INV_SQRT_2PI / (n * bw);
  return at.map((a) => {
    let s = 0;
    for (const v of x) {
      const z = (a - v) / bw;
      s += Math.exp(-0.5 * z * z);
    }
    return c * s;
  });
}

/**
 * The violin outline: density on `points` equally spaced values from min - cut bw to max + cut bw
 * (R's density() default cut = 3).
 * @param {number[]} x
 * @param {{ points?: number, cut?: number }} [opts]
 * @returns {{ bw: number, at: number[], y: number[] }|null}  null with fewer than 2 values
 */
export function violinDensity(x, opts = {}) {
  if (x.length < 2) return null;
  const bw = bwNrd0(x);
  const cut = opts.cut ?? 3;
  const points = opts.points ?? 96;
  const lo = Math.min(...x) - cut * bw;
  const hi = Math.max(...x) + cut * bw;
  const at = Array.from({ length: points }, (_v, i) => lo + ((hi - lo) * i) / (points - 1));
  return { bw, at, y: kde(x, bw, at) };
}
