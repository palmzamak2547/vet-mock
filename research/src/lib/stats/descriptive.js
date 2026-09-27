// Descriptive statistics [M1-DESIGN.md 7.3]. OWNER: stats role.
//
// Quantiles follow R's quantile() exactly (Hyndman and Fan 1996): type 7 is R's default, type 6 is
// what SPSS and Minitab print. The arithmetic below is R's own (src/library/stats/R/quantile.R), so
// the numbers agree to the last bit, not only to a tolerance.
//
// Values reported by runSummary (method 'desc.summary'): n, missing, mean, sd, se, min, q1, median,
// q3, max; for a category column: one row per level in the table 'frequency'.
import { val, nullVal, mean as cmean, sumSqDev, column, activeRows, isMissing, role, completeRows } from './common.js';

const FUZZ = 4 * Number.EPSILON; // R: fuzz <- 4 * .Machine$double.eps

/**
 * Hyndman-Fan quantile of sorted data, type 6 or 7.
 * @param {number[]|Float64Array} sorted  ascending, no missing
 * @param {number} prob in [0, 1]
 * @param {6|7} type
 * @returns {number}  NaN when there is no data
 */
export function quantile(sorted, prob, type) {
  const n = sorted.length;
  if (n === 0) return NaN;
  if (type === 7) {
    const index = 1 + Math.max(n - 1, 0) * prob; // 1-based as in R
    const lo = Math.floor(index);
    const hi = Math.ceil(index);
    let qs = sorted[lo - 1];
    const xhi = sorted[hi - 1];
    if (index > lo && xhi !== qs) {
      const h = index - lo;
      qs = (1 - h) * qs + h * xhi;
    }
    return qs;
  }
  if (type === 6) {
    // R: a = b = 0, m = p; nppm = p + p * n; j = floor(nppm + fuzz); h = nppm - j (0 when |h| < fuzz)
    const nppm = 0 + prob * (n + 1 - 0 - 0); // R: a + probs * (n + 1 - a - b), a = b = 0
    const j = Math.floor(nppm + FUZZ);
    let h = nppm - j;
    if (Math.abs(h) < FUZZ) h = 0;
    // x padded as c(x[1], x[1], x, x[n], x[n]); R indexes x[j + 2] and x[j + 3] of the padded vector,
    // which are x[j] and x[j + 1] of the data clamped to the ends (1-based)
    const at = (k) => sorted[Math.min(Math.max(k, 1), n) - 1];
    const lower = at(j);
    const upper = at(j + 1);
    if (h === 1) return upper;
    if (h > 0 && h < 1 && lower !== upper) return (1 - h) * lower + h * upper;
    return lower;
  }
  throw new Error(`stats: quantile type ${type} is not offered`);
}

/**
 * @param {Float64Array|number[]} x   NaN = missing (counted, not used)
 * @param {{ quantileType: 6|7 }} opts  7 = R default, 6 = SPSS / Minitab
 * @returns {{ n: number, missing: number, mean: number|null, sd: number|null, se: number|null, min: number|null, q1: number|null, median: number|null, q3: number|null, max: number|null }}
 */
export function summary(x, opts = { quantileType: 7 }) {
  const type = opts?.quantileType ?? 7;
  const v = [];
  let missing = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    if (typeof xi === 'number' && !Number.isNaN(xi)) v.push(xi);
    else missing++;
  }
  const n = v.length;
  if (n === 0) return { n: 0, missing, mean: null, sd: null, se: null, min: null, q1: null, median: null, q3: null, max: null };
  const s = v.slice().sort((a, b) => a - b);
  const m = cmean(v);
  const sd = n > 1 ? Math.sqrt(Math.max(0, sumSqDev(v, m)) / (n - 1)) : null;
  return {
    n,
    missing,
    mean: m,
    sd,
    se: sd === null ? null : sd / Math.sqrt(n),
    min: s[0],
    q1: quantile(s, 0.25, type),
    median: quantile(s, 0.5, type),
    q3: quantile(s, 0.75, type),
    max: s[n - 1],
  };
}

/**
 * Counts and percentages of a category column; denominators exclude missing, missing reported separately.
 * @param {Int32Array|number[]} codes  level index, -1 = missing
 * @param {string[]} levels
 * @returns {{ levels: { level: string, count: number, percent: number|null }[], known: number, missing: number }}
 */
export function frequency(codes, levels) {
  const counts = new Array(levels.length).fill(0);
  let missing = 0;
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === -1 || c === null || c === undefined || c < 0 || c >= levels.length) missing++;
    else counts[c]++;
  }
  const known = counts.reduce((a, b) => a + b, 0);
  return {
    levels: levels.map((level, j) => ({ level, count: counts[j], percent: known > 0 ? (100 * counts[j]) / known : null })),
    known,
    missing,
  };
}

const SUMMARY_KEYS = ['n', 'missing', 'mean', 'sd', 'se', 'min', 'q1', 'median', 'q3', 'max'];

function summaryValues(s) {
  const out = {};
  for (const k of SUMMARY_KEYS) {
    const v = s[k];
    if (v === null) out[k] = nullVal(s.n === 0 ? 'stats.undefined.noData' : 'stats.undefined.needTwo');
    else out[k] = val(v);
  }
  return out;
}

/**
 * Implementation for method 'desc.summary'. Roles: `x` (or `outcome`) is the column described;
 * `group` (optional, category) splits the description by level.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runSummary(spec, table) {
  const xKey = role(spec, 'x') ?? role(spec, 'outcome');
  if (!xKey) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
  const type = spec?.options?.quantileType ?? 7;
  const gKey = role(spec, 'group');
  const col = column(table, xKey);
  const rowsAll = activeRows(table);

  if (col.kind === 'category') {
    const levels = col.levels || [];
    const keys = gKey ? [gKey] : [];
    const { rows, dropped } = keys.length ? completeRows(table, keys) : { rows: rowsAll, dropped: [] };
    const codes = rows.map((i) => (isMissing(col, i) ? -1 : col.values[i]));
    const f = frequency(codes, levels);
    const trows = f.levels.map((l) => ['all', l.level, l.count, l.percent]);
    if (gKey) {
      const g = column(table, gKey);
      (g.levels || []).forEach((gl, gj) => {
        const sub = rows.filter((i) => g.values[i] === gj).map((i) => (isMissing(col, i) ? -1 : col.values[i]));
        frequency(sub, levels).levels.forEach((l) => trows.push([gl, l.level, l.count, l.percent]));
      });
    }
    return {
      status: 'ok',
      values: { n: val(f.known), missing: val(f.missing) },
      tests: [],
      tables: [{ id: 'frequency', columns: ['group', 'level', 'count', 'percent'], rows: trows }],
      used: f.known,
      dropped: f.missing ? [...dropped, { reason: 'missing', column: xKey, count: f.missing }] : dropped,
    };
  }

  if (col.kind !== 'number') return { status: 'invalid', values: { reason: nullVal('stats.error.needsNumber') }, tests: [], tables: [], used: 0, dropped: [] };
  const keys = gKey ? [xKey, gKey] : [xKey];
  const { rows, dropped } = completeRows(table, keys);
  const x = rows.map((i) => col.values[i]);
  const s = summary(x, { quantileType: type });
  // missing counted by the row accounting above; summary() saw only complete rows
  s.missing = dropped.find((d) => d.column === xKey)?.count ?? 0;
  const tableRows = [['all', ...SUMMARY_KEYS.map((k) => s[k])]];
  if (gKey) {
    const g = column(table, gKey);
    (g.levels || []).forEach((gl, gj) => {
      const sub = rows.filter((i) => g.values[i] === gj).map((i) => col.values[i]);
      const sg = summary(sub, { quantileType: type });
      tableRows.push([gl, ...SUMMARY_KEYS.map((k) => sg[k])]);
    });
  }
  return {
    status: s.n > 0 ? 'ok' : 'invalid',
    values: summaryValues(s),
    tests: [],
    tables: [{ id: 'summary', columns: ['group', ...SUMMARY_KEYS], rows: tableRows }],
    used: s.n,
    dropped,
  };
}
