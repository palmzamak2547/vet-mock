// The few numbers a chart draws that are not in an envelope, each from a pinned routine [M2-DESIGN.md 8.1]:
// the per-group mean with its t interval (stats/ttest.js one-sample, pinned against R's t.test), the
// median and quartiles (stats/descriptive.js type 7, pinned against R's quantile), the box whiskers
// (Tukey's 1.5 IQR rule on those quartiles), the confidence band of an OLS line (R's
// predict(lm, interval = 'confidence'), pinned in tests/unit/graphs-helpers.test.mjs), the p-value
// function (pinned against numbers.json assoc.mh.pFunction), and the deterministic beeswarm layout.
// Pure. OWNER: graphs role.
import { tTest } from '../../lib/stats/ttest.js';
import { quantile } from '../../lib/stats/descriptive.js';
import { qt, pnormUpper } from '../../lib/stats/dist.js';
import normalQuantile from '@stdlib/stats-base-dists-normal-quantile';

/**
 * Mean with its t interval, as R's t.test(x, conf.level = level)$conf.int. null values with a reason
 * when there are fewer than 2 values (no interval) or no values.
 * @param {number[]} x
 * @param {number} [level]
 * @returns {{ kind: 'mean', center: number|null, lo: number|null, hi: number|null, n: number, reasonKey?: string }}
 */
export function meanCi(x, level = 0.95) {
  const n = x.length;
  if (!n) return { kind: 'mean', center: null, lo: null, hi: null, n, reasonKey: 'graphs.undefined.noData' };
  const m = x.reduce((a, b) => a + b, 0) / n;
  if (n < 2) return { kind: 'mean', center: m, lo: null, hi: null, n, reasonKey: 'graphs.undefined.oneValue' };
  const r = tTest(x, null, { variant: 'one-sample', mu: 0, alternative: 'two.sided', confLevel: level });
  if (r.ci?.[0] === null || r.ci?.[0] === undefined) return { kind: 'mean', center: m, lo: null, hi: null, n, reasonKey: 'graphs.undefined.constant' };
  return { kind: 'mean', center: r.estimate ?? m, lo: r.ci[0], hi: r.ci[1], n };
}

/**
 * Median and quartiles (type 7, the numbers the tables print).
 * @param {number[]} x
 * @returns {{ kind: 'median', center: number|null, lo: number|null, hi: number|null, n: number, reasonKey?: string }}
 */
export function medianIqr(x) {
  const n = x.length;
  if (!n) return { kind: 'median', center: null, lo: null, hi: null, n, reasonKey: 'graphs.undefined.noData' };
  const s = [...x].sort((a, b) => a - b);
  return { kind: 'median', center: quantile(s, 0.5, 7), lo: quantile(s, 0.25, 7), hi: quantile(s, 0.75, 7), n };
}

/**
 * Box statistics: quartiles type 7; whiskers to the most extreme values within 1.5 IQR of the box;
 * every value beyond is returned in `outside` (drawn, never removed).
 * @param {number[]} x
 * @returns {{ n: number, q1: number, median: number, q3: number, lowWhisker: number, highWhisker: number, outside: number[] }|null}
 */
export function boxStats(x) {
  if (!x.length) return null;
  const s = [...x].sort((a, b) => a - b);
  const q1 = quantile(s, 0.25, 7);
  const median = quantile(s, 0.5, 7);
  const q3 = quantile(s, 0.75, 7);
  const f = 1.5 * (q3 - q1);
  const inside = s.filter((v) => v >= q1 - f && v <= q3 + f);
  return {
    n: s.length,
    q1,
    median,
    q3,
    lowWhisker: inside.length ? inside[0] : q1,
    highWhisker: inside.length ? inside[inside.length - 1] : q3,
    outside: s.filter((v) => v < q1 - f || v > q3 + f),
  };
}

/**
 * Least-squares line of y on x with the confidence band of the mean at each point of `at`, as R's
 * predict(lm(y ~ x), newdata, interval = 'confidence', level).
 * @param {number[]} x
 * @param {number[]} y
 * @param {number[]} at
 * @param {number} [level]
 * @returns {{ intercept: number, slope: number, fit: number[], lo: number[], hi: number[], df: number }|null}  null when x is constant or n < 3
 */
export function olsBand(x, y, at, level = 0.95) {
  const n = x.length;
  if (n < 3 || y.length !== n) return null;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i += 1) {
    sxx += (x[i] - mx) ** 2;
    sxy += (x[i] - mx) * (y[i] - my);
  }
  if (!(sxx > 0)) return null;
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let rss = 0;
  for (let i = 0; i < n; i += 1) rss += (y[i] - intercept - slope * x[i]) ** 2;
  const df = n - 2;
  const s = Math.sqrt(rss / df);
  const q = qt(1 - (1 - level) / 2, df);
  const fit = at.map((a) => intercept + slope * a);
  const half = at.map((a) => q * s * Math.sqrt(1 / n + (a - mx) ** 2 / sxx));
  return { intercept, slope, fit, lo: fit.map((f, i) => f - half[i]), hi: fit.map((f, i) => f + half[i]), df };
}

/**
 * The p-value function of a ratio: p(theta) = 2 Phi(-|ln est - ln theta| / SE), the two-sided p of the
 * Wald test of theta on the log scale. At a bound of the (1 - alpha) Wald interval it equals alpha.
 * @param {number} est
 * @param {number} se  standard error of ln(est)
 * @param {number} theta
 */
export function pFunction(est, se, theta) {
  const z = Math.abs(Math.log(est) - Math.log(theta)) / se;
  return 2 * pnormUpper(z);
}

/**
 * SE of ln(estimate) recovered from a Wald interval on the log scale: (ln hi - ln lo) / (2 z).
 * @param {[number, number]} ci
 * @param {number} level
 * @returns {number|null}
 */
export function seFromLogCi(ci, level = 0.95) {
  const [lo, hi] = ci || [];
  if (!(lo > 0) || !(hi > lo) || !Number.isFinite(hi)) return null;
  return (Math.log(hi) - Math.log(lo)) / (2 * normalQuantile(1 - (1 - level) / 2, 0, 1));
}

/**
 * Deterministic beeswarm: each value keeps its position on the value axis; points are placed in
 * ascending order at the offset nearest the centre line that does not overlap a placed point (ties
 * go left, then right, alternating by rank). No random jitter: the same data give the same picture.
 * When the swarm is wider than `halfWidth`, offsets are scaled down to fit (points may then touch).
 * @param {number[]} pos  pixel position of each value on the value axis
 * @param {number} diameter  marker diameter in the same units
 * @param {number} halfWidth  room on each side of the centre line
 * @returns {number[]} offset of each point across the axis, in input order
 */
export function beeswarm(pos, diameter, halfWidth) {
  const order = pos.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const placed = []; // [pos, offset]
  const out = new Array(pos.length).fill(0);
  const d2 = diameter * diameter;
  order.forEach(([p, i], rank) => {
    const near = placed.filter(([q]) => Math.abs(q - p) < diameter);
    const ok = (o) => near.every(([q, oq]) => (q - p) ** 2 + (oq - o) ** 2 >= d2 - 1e-9);
    // candidate offsets: 0, then the tangent positions beside each close neighbour, nearest first
    const cands = [0];
    for (const [q, oq] of near) {
      const dx = Math.sqrt(Math.max(0, d2 - (q - p) ** 2));
      cands.push(oq + dx, oq - dx);
    }
    const leftFirst = rank % 2 === 0;
    cands.sort((a, b) => Math.abs(a) - Math.abs(b) || (leftFirst ? a - b : b - a));
    const o = cands.find(ok) ?? 0;
    placed.push([p, o]);
    out[i] = o;
  });
  const widest = Math.max(0, ...out.map(Math.abs));
  if (widest > halfWidth && widest > 0) {
    const k = halfWidth / widest;
    for (let j = 0; j < out.length; j += 1) out[j] *= k;
  }
  return out.map((o) => Math.round(o * 1000) / 1000);
}
