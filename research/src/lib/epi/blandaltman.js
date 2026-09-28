// Bland-Altman agreement: bias and limits of agreement for the difference as measured, as a percent of the
// mean, or as a ratio on the log scale; approximate intervals for the limits (Bland and Altman 1986, 1999);
// proportional bias as a regression of difference on mean [M2-DESIGN.md 3.3.2].
// OWNER: measure role.
//
// Sources: Bland JM, Altman DG. Statistical methods for assessing agreement between two methods of
// clinical measurement. Lancet 1986;327(8476):307-310 (limits = mean difference +/- 1.96 or 2 SD; the
// standard error of a limit approximated by sqrt(3 s^2 / n), t on n - 1 df; the PEFR data of Table 1).
// Bland JM, Altman DG. Measuring agreement in method comparison studies. Stat Methods Med Res
// 1999;8:135-160 (section 5: log transformation, limits back-transformed to ratios; section 3.1:
// the percentage difference; section 3.2: regression of the difference on the mean when the bias
// changes with the size of the measurement).
//
// Scales. For each pair (A, B):
// - 'absolute': difference d = A - B, mean m = (A + B) / 2;
// - 'percent':  d = 100 (A - B) / m, m = (A + B) / 2 (a pair with m = 0 has no percent: refused);
// - 'ratio':    d = ln A - ln B, m = (ln A + ln B) / 2 (A and B above zero, else refused); the bias,
//   the limits and their intervals are computed on the log scale and printed as exp(): the geometric
//   mean ratio A / B and the ratio limits. The points table carries A / B and the geometric mean
//   sqrt(A B), the plot's axes.
// Bias CI: mean(d) +/- t(1 - (1 - conf) / 2, n - 1) s / sqrt n. Limits: mean(d) +/- k s with k the option
// loaMultiplier (1.96 or 2, used as typed; never qnorm(0.975)). Limit CI (loaCi 'approx'): limit +/-
// t(1 - (1 - conf) / 2, n - 1) sqrt(3 s^2 / n), the 1986 paper's approximation, named 'bland-altman-1986'.
// Proportional bias (information only, never used to change the analysis): least squares d on m; slope
// with its t interval and the t test of slope = 0 on n - 2 df.
import { qt, ptTwoSided } from '../stats/dist.js';
import { mean, sumSqDev } from '../stats/common.js';
import { getColumn, eachRow, invalidOutput, val, nul, guarded } from './_table.js';

/** @typedef {import('../runtime/types.js').Value} Value */

export const LOA_CI_METHOD = 'bland-altman-1986';

function err(key) { return Object.assign(new Error(key), { key }); }

/**
 * Least squares of y on x: slope, intercept, slope SE, t, p (two-sided, n - 2 df) and the slope's CI.
 * @returns {{ slope: number|null, intercept: number|null, se: number|null, t: number|null, df: number, p: number|null, ci: [number|null, number|null], reasonKey?: string }}
 */
export function slopeFit(x, y, confLevel = 0.95) {
  const n = x.length;
  const df = n - 2;
  const none = (reasonKey) => ({ slope: null, intercept: null, se: null, t: null, df, p: null, ci: [null, null], reasonKey });
  if (n < 3) return none('measure.undefined.needThreePairs');
  const mx = mean(x), my = mean(y);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - mx; sxx += dx * dx; sxy += dx * (y[i] - my); }
  if (!(sxx > 0)) return none('measure.undefined.meansAllEqual');
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let rss = 0;
  for (let i = 0; i < n; i++) { const e = y[i] - intercept - slope * x[i]; rss += e * e; }
  const s2 = rss / df;
  if (!(s2 > 0)) return { slope, intercept, se: null, t: null, df, p: null, ci: [null, null], reasonKey: 'measure.undefined.exactLine' };
  const se = Math.sqrt(s2 / sxx);
  const t = slope / se;
  const q = qt(1 - (1 - confLevel) / 2, df);
  return { slope, intercept, se, t, df, p: ptTwoSided(t, df), ci: [slope - q * se, slope + q * se] };
}

/**
 * Bias and limits of agreement from the working-scale differences.
 * @param {number[]} d  differences on the working scale (A - B, percent, or ln A - ln B)
 * @param {{ loaMultiplier?: number, loaCi?: 'approx'|'none', confLevel?: number }} [opts]
 * @returns {{ n: number, bias: number|null, sd: number|null, biasSe: number|null, biasCi: [number|null, number|null], lower: number|null, upper: number|null, loaSe: number|null, lowerCi: [number|null, number|null], upperCi: [number|null, number|null], reasonKey?: string }}
 */
export function agreementLimits(d, opts = {}) {
  const k = opts.loaMultiplier ?? 1.96;
  const conf = opts.confLevel ?? 0.95;
  const n = d.length;
  const bias = n > 0 ? mean(d) : null;
  const empty = { n, bias, sd: null, biasSe: null, biasCi: [null, null], lower: null, upper: null, loaSe: null, lowerCi: [null, null], upperCi: [null, null] };
  if (n === 0) return { ...empty, reasonKey: 'measure.undefined.noPairs' };
  if (n < 2) return { ...empty, reasonKey: 'measure.undefined.needTwoPairs' };
  const sd = Math.sqrt(sumSqDev(d, bias) / (n - 1));
  const q = qt(1 - (1 - conf) / 2, n - 1);
  const biasSe = sd / Math.sqrt(n);
  const lower = bias - k * sd, upper = bias + k * sd;
  const out = { n, bias, sd, biasSe, biasCi: [bias - q * biasSe, bias + q * biasSe], lower, upper, loaSe: null, lowerCi: [null, null], upperCi: [null, null] };
  if ((opts.loaCi ?? 'approx') === 'approx') {
    const loaSe = Math.sqrt((3 * sd * sd) / n);
    out.loaSe = loaSe;
    out.lowerCi = [lower - q * loaSe, lower + q * loaSe];
    out.upperCi = [upper - q * loaSe, upper + q * loaSe];
  }
  return out;
}

/**
 * Working-scale differences and means for the pairs, plus the plot's points on the reading scale.
 * @param {number[]} a @param {number[]} b
 * @param {'absolute'|'percent'|'ratio'} scale
 */
export function workingScale(a, b, scale) {
  const d = [], m = [], px = [], py = [];
  for (let i = 0; i < a.length; i++) {
    const A = a[i], B = b[i];
    if (scale === 'ratio') {
      if (!(A > 0) || !(B > 0)) throw err('measure.error.ratioNeedsPositive');
      const la = Math.log(A), lb = Math.log(B);
      d.push(la - lb); m.push((la + lb) / 2);
      px.push(Math.sqrt(A * B)); py.push(A / B);
    } else if (scale === 'percent') {
      const mm = (A + B) / 2;
      if (mm === 0) throw err('measure.error.percentNeedsNonZeroMean');
      d.push((100 * (A - B)) / mm); m.push(mm);
      px.push(mm); py.push((100 * (A - B)) / mm);
    } else {
      d.push(A - B); m.push((A + B) / 2);
      px.push((A + B) / 2); py.push(A - B);
    }
  }
  return { d, m, px, py };
}

/** A working-scale number shown on the reading scale (exp for ratio; the interval likewise). */
function shown(x, scale) {
  if (x === null) return null;
  return scale === 'ratio' ? Math.exp(x) : x;
}

/**
 * Implementation for 'agree.blandAltman'. Roles raterA (method A), raterB (method B), both number
 * columns; options scale, loaMultiplier (1.96 or 2), loaCi, proportionalBias, confLevel. Table 'points'
 * (mean, difference) for the plot, in row order.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runBlandAltman(spec, table) {
  return guarded(() => {
    if (!table) return invalidOutput('measure.error.noData');
    const o = spec.options || {};
    const scale = o.scale ?? 'absolute';
    const conf = o.confLevel ?? 0.95;
    const aKey = spec.roles?.raterA, bKey = spec.roles?.raterB;
    if (!aKey || !bKey) return invalidOutput('measure.error.needTwoMethods');
    if (aKey === bKey) return invalidOutput('measure.error.sameColumnTwice');
    const A = getColumn(table, aKey), B = getColumn(table, bKey);
    if (A.kind !== 'number' || B.kind !== 'number') return invalidOutput('measure.error.methodsNotNumber');
    const a = [], b = [], rows = [];
    const res = eachRow(table, [aKey, bKey], (r) => { a.push(A.values[r]); b.push(B.values[r]); rows.push(table.rowIds[r]); return undefined; });
    const w = workingScale(a, b, scale);
    const L = agreementLimits(w.d, { loaMultiplier: o.loaMultiplier, loaCi: o.loaCi, confLevel: conf });
    const values = {};
    const why = L.reasonKey;
    const ci = (pair) => (pair[0] === null ? [null, null] : [shown(pair[0], scale), shown(pair[1], scale)]);
    const biasName = scale === 'ratio' ? 'ratioGeoMean' : scale === 'percent' ? 'biasPercent' : 'bias';
    const sdName = scale === 'ratio' ? 'sdLogRatio' : scale === 'percent' ? 'sdPercent' : 'sdDifference';
    values.n = val(L.n);
    values[biasName] = L.bias === null ? nul(why)
      : val(shown(L.bias, scale), L.sd === null
        ? { ci: [null, null], ciLevel: conf, ciMethod: 't', reasonKey: why }
        : { ci: ci(L.biasCi), ciLevel: conf, ciMethod: 't', ...(scale === 'ratio' ? {} : { se: L.biasSe }) });
    values[sdName] = L.sd === null ? nul(why) : val(L.sd);
    const limit = (x, xci) => {
      if (x === null) return nul(why);
      const extra = { ciLevel: conf };
      if ((o.loaCi ?? 'approx') === 'approx') {
        extra.ci = ci(xci);
        extra.ciMethod = LOA_CI_METHOD;
        if (scale !== 'ratio') extra.se = L.loaSe;
      }
      return val(shown(x, scale), extra);
    };
    values.loaLower = limit(L.lower, L.lowerCi);
    values.loaUpper = limit(L.upper, L.upperCi);
    const tests = [];
    const notes = [];
    if (o.proportionalBias ?? true) {
      const f = slopeFit(w.m, w.d, conf);
      values.proportionalSlope = f.slope === null ? nul(f.reasonKey)
        : val(f.slope, f.se === null ? { ci: [null, null], ciLevel: conf, reasonKey: f.reasonKey } : { ci: f.ci, ciLevel: conf, ciMethod: 't', se: f.se });
      values.proportionalIntercept = f.intercept === null ? nul(f.reasonKey) : val(f.intercept);
      const row = { id: 'proportionalBias', statistic: { name: 't', value: f.t }, df: f.slope === null ? null : f.df, p: f.p, alternative: 'two.sided', variant: 'ols-slope' };
      if (f.p === null) row.reasonKey = f.reasonKey;
      tests.push(row);
      notes.push({ id: 'proportionalBiasInfo', severity: 'note', key: `measure.note.proportionalBiasInfo.${scale}` });
    }
    if (scale === 'ratio') notes.push({ id: 'ratioBackTransformed', severity: 'note', key: 'measure.note.ratioBackTransformed' });
    if (o.loaMultiplier === 2) notes.push({ id: 'loaMultiplierTwo', severity: 'note', key: 'measure.note.loaMultiplierTwo' });
    return {
      status: 'ok', values, tests,
      tables: [{ id: 'points', columns: ['rowId', 'mean', 'difference'], rows: w.px.map((x, i) => [rows[i], x, w.py[i]]) }],
      used: res.used, dropped: res.dropped, notes,
    };
  });
}
