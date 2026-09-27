// t-tests: Welch (default), pooled, paired, one-sample, as R's t.test [M1-DESIGN.md 7.6]. OWNER: stats role.
//
// Arithmetic follows R's stats:::t.test.default: the interval is built on the t scale and then
// scaled by the standard error (cint <- tstat + c(-q, q); cint <- mu + cint * stderr), the quantile
// is qt(1 - alpha/2, df) with alpha = 1 - conf.level, and data that are essentially constant
// (stderr < 10 * eps * max |mean|) give no t statistic (R stops with an error; we return null with
// the reason stats.undefined.constantData).
//
// Values reported by runTTest: estimate (difference in means, or the mean for one-sample, or the
// mean difference for paired) with its CI and SE; meanX, meanY, sdX, sdY, nX, nY. Test 'tTest':
// statistic t, df, p, variant.
import { ptUpper, ptTwoSided, qt } from './dist.js';
import { mean, variance, val, nullVal, testRow, role, common, completeRows, numbersAt, column } from './common.js';

function pFor(t, df, alternative) {
  if (alternative === 'less') return ptUpper(-t, df);
  if (alternative === 'greater') return ptUpper(t, df);
  return ptTwoSided(t, df);
}

function ciFor(t, df, alternative, confLevel, mu, stderr) {
  const alpha = 1 - confLevel;
  let lo;
  let hi;
  if (alternative === 'less') { lo = -Infinity; hi = t + qt(confLevel, df); }
  else if (alternative === 'greater') { lo = t - qt(confLevel, df); hi = Infinity; }
  else { const q = qt(1 - alpha / 2, df); lo = t - q; hi = t + q; }
  return [mu + lo * stderr, mu + hi * stderr];
}

const EMPTY = { t: null, df: null, p: null, estimate: null, ci: [null, null], se: null };

/**
 * Pure core on arrays (tests call it directly).
 * @param {number[]} x @param {number[]|null} y
 * @param {{ variant: 'welch'|'pooled'|'paired'|'one-sample', mu: number, alternative: 'two.sided'|'less'|'greater', confLevel: number }} opts
 * @returns {{ t: number|null, df: number|null, p: number|null, estimate: number|null, ci: [number|null, number|null], se: number|null, reasonKey?: string, meanX?: number|null, meanY?: number|null }}
 */
export function tTest(x, y, opts) {
  const variant = opts?.variant ?? 'welch';
  const mu = opts?.mu ?? 0;
  const alternative = opts?.alternative ?? 'two.sided';
  const confLevel = opts?.confLevel ?? 0.95;
  let dx = x;
  let oneSample = variant === 'one-sample' || !y;
  if (variant === 'paired') {
    if (!y || y.length !== x.length) return { ...EMPTY, reasonKey: 'stats.undefined.pairedLength' };
    dx = x.map((xi, i) => xi - y[i]);
    oneSample = true;
  }
  if (oneSample) {
    const n = dx.length;
    if (n < 2) return { ...EMPTY, reasonKey: 'stats.undefined.needTwo' };
    const mx = mean(dx);
    const vx = variance(dx);
    const df = n - 1;
    const stderr = Math.sqrt(vx / n);
    if (stderr < 10 * Number.EPSILON * Math.abs(mx)) return { ...EMPTY, estimate: mx, reasonKey: 'stats.undefined.constantData' };
    if (!(stderr > 0)) return { ...EMPTY, estimate: mx, reasonKey: 'stats.undefined.zeroVariance' };
    const t = (mx - mu) / stderr;
    return { t, df, p: pFor(t, df, alternative), estimate: mx, ci: ciFor(t, df, alternative, confLevel, mu, stderr), se: stderr, meanX: mx };
  }
  const nx = x.length;
  const ny = y.length;
  const mx = mean(x);
  const my = mean(y);
  if (variant === 'pooled') {
    if (nx < 1 || ny < 1 || nx + ny < 3) return { ...EMPTY, reasonKey: 'stats.undefined.needTwo' };
  } else if (nx < 2 || ny < 2) return { ...EMPTY, reasonKey: 'stats.undefined.needTwoPerGroup' };
  const vx = nx > 1 ? variance(x) : 0;
  const vy = ny > 1 ? variance(y) : 0;
  let df;
  let stderr;
  if (variant === 'pooled') {
    df = nx + ny - 2;
    let v = 0;
    if (nx > 1) v = v + (nx - 1) * vx;
    if (ny > 1) v = v + (ny - 1) * vy;
    v = v / df;
    stderr = Math.sqrt(v * (1 / nx + 1 / ny));
  } else {
    const stderrx = Math.sqrt(vx / nx);
    const stderry = Math.sqrt(vy / ny);
    stderr = Math.sqrt(stderrx ** 2 + stderry ** 2);
    df = stderr ** 4 / (stderrx ** 4 / (nx - 1) + stderry ** 4 / (ny - 1));
  }
  const est = mx - my;
  if (stderr < 10 * Number.EPSILON * Math.max(Math.abs(mx), Math.abs(my))) return { ...EMPTY, estimate: est, reasonKey: 'stats.undefined.constantData', meanX: mx, meanY: my };
  if (!(stderr > 0)) return { ...EMPTY, estimate: est, reasonKey: 'stats.undefined.zeroVariance', meanX: mx, meanY: my };
  const t = (est - mu) / stderr;
  return { t, df, p: pFor(t, df, alternative), estimate: est, ci: ciFor(t, df, alternative, confLevel, mu, stderr), se: stderr, meanX: mx, meanY: my };
}

/**
 * Implementation for method 'test.tTest'.
 * Roles: independent variants use `outcome` (number) and `group` (category with exactly two levels
 * present; the difference is first level minus second, as R's formula interface); paired uses `x`
 * and `y` (two number columns on the same rows) or `outcome` with `pair`; one-sample uses `outcome`
 * (or `x`) and options.mu.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runTTest(spec, table) {
  const o = spec.options || {};
  const { confLevel, alternative } = common(spec);
  const variant = o.variant ?? 'welch';
  const mu = o.mu ?? 0;
  const base = { variant, mu, alternative, confLevel };
  let res;
  let used;
  let dropped;
  let labels = null;
  let extra = {};
  if (variant === 'paired') {
    const a = role(spec, 'x') ?? role(spec, 'outcome');
    const b = role(spec, 'y');
    if (!a || !b) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
    ({ rows: used, dropped } = completeRows(table, [a, b]));
    res = tTest(numbersAt(table, a, used), numbersAt(table, b, used), base);
    extra = { n: val(used.length) };
  } else if (variant === 'one-sample') {
    const a = role(spec, 'outcome') ?? role(spec, 'x');
    if (!a) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
    ({ rows: used, dropped } = completeRows(table, [a]));
    res = tTest(numbersAt(table, a, used), null, base);
    extra = { n: val(used.length) };
  } else {
    const yKey = role(spec, 'outcome');
    const gKey = role(spec, 'group') ?? role(spec, 'exposure');
    if (!yKey || !gKey) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
    ({ rows: used, dropped } = completeRows(table, [yKey, gKey]));
    const g = column(table, gKey);
    const y = numbersAt(table, yKey, used);
    const present = [];
    used.forEach((i) => { if (!present.includes(g.values[i])) present.push(g.values[i]); });
    present.sort((p, q) => p - q);
    if (present.length !== 2) return { status: 'invalid', values: { reason: nullVal('stats.undefined.needTwoGroups') }, tests: [], tables: [], used: used.length, dropped };
    const xs = [];
    const ys = [];
    used.forEach((i, j) => (g.values[i] === present[0] ? xs : ys).push(y[j]));
    res = tTest(xs, ys, base);
    labels = [g.levels[present[0]], g.levels[present[1]]];
    const vx = xs.length > 1 ? Math.sqrt(variance(xs)) : null;
    const vy = ys.length > 1 ? Math.sqrt(variance(ys)) : null;
    extra = {
      nX: val(xs.length), nY: val(ys.length),
      meanX: xs.length ? val(mean(xs)) : nullVal('stats.undefined.noData'),
      meanY: ys.length ? val(mean(ys)) : nullVal('stats.undefined.noData'),
      sdX: vx === null ? nullVal('stats.undefined.needTwo') : val(vx),
      sdY: vy === null ? nullVal('stats.undefined.needTwo') : val(vy),
    };
  }
  const estimate = res.estimate === null
    ? nullVal(res.reasonKey || 'stats.undefined.notComputable')
    : val(res.estimate, res.t === null ? { reasonKey: res.reasonKey } : { ci: res.ci, ciLevel: confLevel, ciMethod: 't', se: res.se });
  return {
    status: res.t === null ? 'invalid' : 'ok',
    values: { estimate, ...extra },
    tests: [testRow({ id: 'tTest', name: 't', statistic: res.t, df: res.df, p: res.p, alternative, variant, reasonKey: res.reasonKey })],
    tables: labels ? [{ id: 'groups', columns: ['first', 'second'], rows: [labels] }] : [],
    used: used.length,
    dropped,
  };
}
