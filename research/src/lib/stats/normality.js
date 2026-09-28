// Diagnostics shown beside a result and never used to switch tests (methods.md anti-pattern 2): Shapiro-Wilk
// (Royston 1995, AS R94, as R shapiro.test), Q-Q points (R qqnorm), Brown-Forsythe [M2-DESIGN.md 3.1.5].
// OWNER: lab role.
//
// shapiroWilk() is a line-by-line port of R's src/library/stats/src/swilk.c (AS R94 with R's changes):
// the coefficients from normal scores with Royston's polynomial corrections for the two largest, W as
// the squared correlation between the ordered data and the coefficients computed as 1 - W1 with W1 =
// (sqrt(ssa ssx) - sax)(sqrt(ssa ssx) + sax) / (ssa ssx) so W near 1 keeps its digits, the exact p for
// n = 3, and Royston's normalising transformations for 4 <= n <= 11 and n >= 12 with the upper normal tail
// from erfc. qqPoints() follows qqnorm: ppoints(n) = (i - a) / (n + 1 - 2a), a = 3/8 for n <= 10 else
// 1/2, assigned to the data in their own order (ties by position, as order(order(x))). Brown-Forsythe is a
// one-way ANOVA on the absolute deviations from each group's median (type 7); center 'mean' gives the
// classic Levene (1960) test.
import { qnorm, pnormUpper } from './dist.js';
import { anova1 } from './anova.js';
import { quantile } from './descriptive.js';
import { mean, val, nullVal, testRow, role, completeRows, groupsAt, numbersAt, invalid, column } from './common.js';

const SMALL = 1e-19;
const G = [-2.273, 0.459];
const C1 = [0, 0.221157, -0.147981, -2.07119, 4.434685, -2.706056];
const C2 = [0, 0.042981, -0.293762, -1.752461, 5.682633, -3.582633];
const C3 = [0.544, -0.39978, 0.025054, -6.714e-4];
const C4 = [1.3822, -0.77857, 0.062767, -0.0020322];
const C5 = [-1.5861, -0.31082, -0.083751, 0.0038915];
const C6 = [-0.4803, -0.082676, 0.0030302];

/** R swilk.c poly(): cc[0] + cc[1] x + ... evaluated as in the C code. */
function poly(cc, x) {
  const nord = cc.length;
  let ret = cc[0];
  if (nord > 1) {
    let p = x * cc[nord - 1];
    for (let j = nord - 2; j > 0; j--) p = (p + cc[j]) * x;
    ret += p;
  }
  return ret;
}

/**
 * @param {number[]} x
 * @returns {{ W: number, p: number }|null}  null when n is outside 3..5000 or every value is the same
 */
export function shapiroWilk(x) {
  const xs = x.filter((v) => Number.isFinite(v)).slice().sort((p, q) => p - q);
  const n = xs.length;
  if (n < 3 || n > 5000) return null;
  const rng0 = xs[n - 1] - xs[0];
  if (rng0 < 1e-10) return null;
  const nn2 = Math.floor(n / 2);
  const a = new Array(nn2 + 1).fill(0); // 1-based
  const an = n;
  if (n === 3) a[1] = Math.SQRT1_2;
  else {
    const an25 = an + 0.25;
    let summ2 = 0;
    for (let i = 1; i <= nn2; i++) {
      const m = qnorm((i - 0.375) / an25);
      a[i] = m; // the lower normal score (negative), AS R94 M(I)
      summ2 += m * m;
    }
    summ2 *= 2;
    const ssumm2 = Math.sqrt(summ2);
    const rsn = 1 / Math.sqrt(an);
    const a1 = poly(C1, rsn) - a[1] / ssumm2;
    let i1;
    let fac;
    if (n > 5) {
      i1 = 3;
      const a2 = -a[2] / ssumm2 + poly(C2, rsn);
      fac = Math.sqrt((summ2 - 2 * (a[1] * a[1]) - 2 * (a[2] * a[2])) / (1 - 2 * (a1 * a1) - 2 * (a2 * a2)));
      a[2] = a2;
    } else {
      i1 = 2;
      fac = Math.sqrt((summ2 - 2 * (a[1] * a[1])) / (1 - 2 * (a1 * a1)));
    }
    a[1] = a1;
    for (let i = i1; i <= nn2; i++) a[i] /= -fac;
  }
  const range = xs[n - 1] - xs[0];
  if (range < SMALL) return null;
  const sign = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
  let sx = xs[0] / range;
  let sa = -a[1];
  for (let i = 1, j = n - 1; i < n; j--) {
    const xi = xs[i] / range;
    sx += xi;
    i++;
    if (i !== j) sa += sign(i - j) * a[Math.min(i, j)];
  }
  sa /= n;
  sx /= n;
  let ssa = 0;
  let ssx = 0;
  let sax = 0;
  for (let i = 0, j = n - 1; i < n; i++, j--) {
    const asa = i !== j ? sign(i - j) * a[1 + Math.min(i, j)] - sa : -sa;
    const xsx = xs[i] / range - sx;
    ssa += asa * asa;
    ssx += xsx * xsx;
    sax += asa * xsx;
  }
  const ssassx = Math.sqrt(ssa * ssx);
  const w1 = ((ssassx - sax) * (ssassx + sax)) / (ssa * ssx);
  const W = 1 - w1;
  if (n === 3) {
    const pi6 = 1.90985931710274;
    const stqr = 1.0471975511966;
    return { W, p: Math.max(0, pi6 * (Math.asin(Math.sqrt(W)) - stqr)) };
  }
  let y = Math.log(w1);
  const lxx = Math.log(an);
  let m;
  let s;
  if (n <= 11) {
    const gamma = poly(G, an);
    if (y >= gamma) return { W, p: 1e-99 };
    y = -Math.log(gamma - y);
    m = poly(C3, an);
    s = Math.exp(poly(C4, an));
  } else {
    m = poly(C5, lxx);
    s = Math.exp(poly(C6, lxx));
  }
  return { W, p: pnormUpper((y - m) / s) };
}

/**
 * Theoretical normal quantiles at R's ppoints(n) in the order of x (as qqnorm).
 * @param {number[]} x
 * @returns {{ theoretical: number[], sample: number[] }}
 */
export function qqPoints(x) {
  const n = x.length;
  const a = n <= 10 ? 3 / 8 : 1 / 2;
  const order = x.map((_, i) => i).sort((p, q) => (x[p] - x[q]) || (p - q));
  const theoretical = new Array(n);
  order.forEach((i, r) => { theoretical[i] = qnorm((r + 1 - a) / (n + 1 - 2 * a)); });
  return { theoretical, sample: x.slice() };
}

const NEVER = { id: 'diagnostic', severity: 'note', key: 'lab.note.diagnosticOnly' };

/**
 * The cells of a two-way layout (every present pair of levels of `group` and `factorB`) as groups, in the
 * order of the first factor's levels, then the second's. With the interaction in the model the fitted value
 * of every animal is its cell mean, so the residuals of the two-way ANOVA are the values minus their cell
 * mean (R residuals(aov(y ~ A * B))), and car::leveneTest(y ~ A * B) compares the spread of these cells.
 */
function cellsAt(table, yKey, aKey, bKey, rows) {
  const a = column(table, aKey), b = column(table, bKey), y = column(table, yKey);
  const idx = (c, r) => (c.kind === 'category' ? c.values[r] : null);
  const text = (c, r) => (c.kind === 'category' ? c.levels[c.values[r]] : String(c.values[r]));
  const cells = new Map();
  for (const r of rows) {
    const key = `${text(a, r)} × ${text(b, r)}`;
    if (!cells.has(key)) cells.set(key, { ia: idx(a, r), ib: idx(b, r), first: r, values: [] });
    cells.get(key).values.push(y.values[r]);
  }
  const list = [...cells.entries()].sort(([, p], [, q]) => (p.ia ?? 0) - (q.ia ?? 0) || (p.ib ?? 0) - (q.ib ?? 0) || p.first - q.first);
  return { labels: list.map(([k]) => k), groups: list.map(([, c]) => c.values) };
}

/**
 * roles outcome, group (optional); options on 'residuals' (value minus its group mean, one test) or 'groups' (one test per group). n outside 3..5000 gives null with lab.undefined.shapiroN.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runShapiro(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group');
  const bKey = gKey ? role(spec, 'factorB') : null;
  if (!yKey) return invalid('stats.error.missingRole');
  const on = spec.options?.on ?? 'residuals';
  const { rows, dropped } = completeRows(table, [yKey, gKey, bKey].filter(Boolean));
  // Residuals: each value minus its group's mean (the overall mean without a group), one test; W does not
  // change with a shift, so without a group it is the test of the values themselves. Groups: one per group.
  // With a second factor (factorB) the groups are the two-way cells (cellsAt).
  const { labels, groups } = bKey ? cellsAt(table, yKey, gKey, bKey, rows) : gKey ? groupsAt(table, yKey, gKey, rows) : { labels: [null], groups: [numbersAt(table, yKey, rows)] };
  let sets;
  if (gKey && on === 'groups') sets = groups.map((g, j) => ({ label: labels[j], values: g }));
  else {
    const res = [];
    for (const g of groups) { const m = mean(g); for (const v of g) res.push(v - m); }
    sets = [{ label: null, values: res }];
  }
  const tests = [];
  const qqRows = [];
  const swRows = [];
  for (const s of sets) {
    const n = s.values.length;
    const r = shapiroWilk(s.values);
    const reasonKey = n < 3 || n > 5000 ? 'lab.undefined.shapiroN' : 'stats.undefined.zeroVariance';
    tests.push(testRow({ id: 'shapiro', name: 'W', statistic: r ? r.W : null, p: r ? r.p : null, variant: s.label === null ? on : `group:${s.label}`, reasonKey: r ? undefined : reasonKey }));
    swRows.push([s.label, n, r ? r.W : null, r ? r.p : null]);
    const q = qqPoints(s.values);
    q.theoretical.forEach((t, i) => qqRows.push([s.label, t, q.sample[i]]));
  }
  const first = tests[0];
  return {
    status: tests.some((t) => t.p !== null) ? 'ok' : 'invalid',
    values: { W: first.statistic.value === null ? nullVal(first.reasonKey) : val(first.statistic.value), n: val(sets.reduce((s, x) => s + x.values.length, 0)) },
    tests,
    tables: [
      { id: 'shapiro', columns: ['group', 'n', 'W', 'p'], rows: swRows },
      { id: 'qq', columns: ['group', 'theoretical', 'sample'], rows: qqRows },
    ],
    used: rows.length,
    dropped,
    notes: [NEVER],
  };
}

/**
 * Brown-Forsythe (center 'median') or Levene (center 'mean') F on the absolute deviations.
 * @param {number[][]} groups @param {'median'|'mean'} center
 */
export function brownForsythe(groups, center = 'median') {
  const centers = groups.map((g) => (center === 'mean' ? mean(g) : quantile(g.slice().sort((p, q) => p - q), 0.5, 7)));
  const dev = groups.map((g, j) => g.map((v) => Math.abs(v - centers[j])));
  return { ...anova1(dev), centers, meanAbsDev: dev.map((d) => mean(d)) };
}

/**
 * roles outcome, group; options center 'median' (Brown-Forsythe) or 'mean' (Levene 1960): a one-way ANOVA on absolute deviations.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runBrownForsythe(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group');
  const bKey = role(spec, 'factorB');
  if (!yKey || !gKey) return invalid('stats.error.missingRole');
  const center = spec.options?.center ?? 'median';
  const { rows, dropped } = completeRows(table, [yKey, gKey, bKey].filter(Boolean));
  // With a second factor the groups are the two-way cells, as car::leveneTest(y ~ A * B).
  const { labels, groups } = bKey ? cellsAt(table, yKey, gKey, bKey, rows) : groupsAt(table, yKey, gKey, rows);
  if (groups.length < 2) return invalid('stats.undefined.needTwoGroups', { used: rows.length, dropped });
  const r = brownForsythe(groups, center);
  return {
    status: r.F === null ? 'invalid' : 'ok',
    values: { groups: val(groups.length) },
    tests: [testRow({ id: 'brownForsythe', name: 'F', statistic: r.F, dfPair: [r.df1, r.df2], p: r.p, variant: center, reasonKey: r.reasonKey })],
    tables: [{ id: 'groups', columns: ['level', 'n', 'center', 'meanAbsDev'], rows: groups.map((g, j) => [labels[j], g.length, r.centers[j], r.meanAbsDev[j]]) }],
    used: rows.length,
    dropped,
    notes: [NEVER],
  };
}
