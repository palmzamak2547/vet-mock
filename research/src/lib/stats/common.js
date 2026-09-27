// Helpers shared by the stats modules: Value objects, reading columns out of a WorkingTable with
// missing rows dropped and counted, and numerically careful sums. Pure; no DOM, no storage.
// OWNER: stats role.
//
// Row accounting [M1-DESIGN.md 7 general rules, 10.3]: a row whose id is in `table.excluded` was
// removed by a recipe step (row-exclude or filter); run.js counts those from the recipe, so this file
// skips them without counting. A row with a missing value in any role column is dropped and counted
// once, against the first role column (in the order the method lists its roles) where it is missing,
// so the per-column counts add up to the rows dropped.

/**
 * @typedef {import('../runtime/types.js').Value} Value
 * @typedef {import('../runtime/types.js').WorkingTable} WorkingTable
 * @typedef {import('../runtime/types.js').Column} Column
 */

/**
 * A reported number. Non-finite numbers other than an open interval bound are refused: a value that
 * cannot be computed goes through nullValue() with a reason.
 * @param {number} v
 * @param {Partial<Value>} [extra]
 * @returns {Value}
 */
export function val(v, extra = {}) {
  if (typeof v !== 'number' || Number.isNaN(v)) return nullVal(extra.reasonKey || 'stats.undefined.notComputable');
  const out = { value: v };
  for (const k of ['ci', 'ciLevel', 'ciMethod', 'se', 'reasonKey']) if (extra[k] !== undefined) out[k] = extra[k];
  if (out.se !== undefined && out.se !== null && Number.isNaN(out.se)) out.se = null;
  if (out.ci) out.ci = [nanToNull(out.ci[0]), nanToNull(out.ci[1])];
  return out;
}

/** @param {string} reasonKey @returns {Value} */
export function nullVal(reasonKey) { return { value: null, reasonKey }; }

/** NaN (and undefined) becomes null; Infinity stays (an open bound). */
export function nanToNull(x) { return typeof x === 'number' && !Number.isNaN(x) ? x : null; }

/** Test row with p never rounded; a NaN p becomes null with a reason. */
export function testRow({ id, name, statistic, df = null, dfPair, p, alternative = 'two.sided', variant, reasonKey }) {
  const row = { id, statistic: { name, value: nanToNull(statistic) }, df: df === null ? null : nanToNull(df), p: nanToNull(p), alternative, variant };
  if (dfPair !== undefined) row.dfPair = dfPair;
  if (row.p === null || row.statistic.value === null) row.reasonKey = reasonKey || 'stats.undefined.notComputable';
  else if (reasonKey) row.reasonKey = reasonKey;
  return row;
}

/** Neumaier-compensated sum. */
export function ksum(xs) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
}

/** Mean with a second-pass correction (the mean of the residuals from the first estimate). */
export function mean(xs) {
  const n = xs.length;
  if (n === 0) return NaN;
  const m0 = ksum(xs) / n;
  let r = 0;
  for (let i = 0; i < n; i++) r += xs[i] - m0;
  return m0 + r / n;
}

/** Sum of squared deviations from the mean, two-pass with the compensated mean. */
export function sumSqDev(xs, m = mean(xs)) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < xs.length; i++) {
    const d = xs[i] - m;
    s += d * d;
    c += d;
  }
  // corrected two-pass (Chan, Golub and LeVeque 1983): subtract the residual bias of the mean
  return s - (c * c) / xs.length;
}

/** Sample variance (n - 1); NaN when n < 2. */
export function variance(xs) {
  const n = xs.length;
  if (n < 2) return NaN;
  return sumSqDev(xs) / (n - 1);
}

/** Average ranks (ties share the mean rank), as R's rank(ties.method = 'average'). */
export function rankAvg(xs) {
  const n = xs.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => xs[a] - xs[b]);
  const r = new Array(n);
  const ties = [];
  let i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && xs[idx[j + 1]] === xs[idx[i]]) j++;
    const avg = (i + j + 2) / 2;
    for (let k = i; k <= j; k++) r[idx[k]] = avg;
    if (j > i) ties.push(j - i + 1);
    i = j + 1;
  }
  return { ranks: r, ties };
}

// ---------------------------------------------------------------- reading a WorkingTable

/** @param {WorkingTable} table @param {string} key @returns {Column} */
export function column(table, key) {
  const c = table?.columns?.[key];
  if (!c) throw Object.assign(new Error(`stats: unknown column ${key}`), { key: 'stats.error.unknownColumn', detail: key });
  return c;
}

/** Is cell i of column c missing? */
export function isMissing(c, i) {
  if (c.missing && c.missing[i]) return true;
  const v = c.values[i];
  if (c.kind === 'number' || c.kind === 'date') return typeof v !== 'number' || Number.isNaN(v);
  if (c.kind === 'category') return v === -1 || v === undefined || v === null;
  return v === null || v === undefined || v === '';
}

/** Row indexes not removed by a recipe step. */
export function activeRows(table) {
  const ex = table.excluded || {};
  const out = [];
  for (let i = 0; i < table.n; i++) if (!Object.prototype.hasOwnProperty.call(ex, table.rowIds[i])) out.push(i);
  return out;
}

/**
 * Rows complete in every listed column, with the dropped rows counted against the first missing column.
 * @param {WorkingTable} table
 * @param {string[]} keys  role columns in the method's role order
 * @returns {{ rows: number[], dropped: {reason: 'missing', column: string, count: number}[] }}
 */
export function completeRows(table, keys) {
  const cols = keys.map((k) => column(table, k));
  const counts = new Map();
  const rows = [];
  for (const i of activeRows(table)) {
    let miss = -1;
    for (let j = 0; j < cols.length; j++) if (isMissing(cols[j], i)) { miss = j; break; }
    if (miss < 0) rows.push(i);
    else counts.set(keys[miss], (counts.get(keys[miss]) || 0) + 1);
  }
  const dropped = [];
  for (const k of keys) if (counts.get(k)) dropped.push({ reason: 'missing', column: k, count: counts.get(k) });
  return { rows, dropped };
}

/** Numeric values of column `key` at `rows`. Refuses a non-number column. */
export function numbersAt(table, key, rows) {
  const c = column(table, key);
  if (c.kind !== 'number') throw Object.assign(new Error(`stats: ${key} is not a number column`), { key: 'stats.error.needsNumber', detail: key });
  return rows.map((i) => c.values[i]);
}

/**
 * Split numeric `y` by the levels of category column `g` (levels in codebook order; empty levels are
 * left out of the analysis and listed).
 */
export function groupsAt(table, yKey, gKey, rows) {
  const g = column(table, gKey);
  if (g.kind !== 'category') throw Object.assign(new Error(`stats: ${gKey} is not a category column`), { key: 'stats.error.needsCategory', detail: gKey });
  const y = numbersAt(table, yKey, rows);
  const levels = g.levels || [];
  const buckets = levels.map(() => []);
  rows.forEach((i, j) => { buckets[g.values[i]].push(y[j]); });
  const labels = [];
  const groups = [];
  const empty = [];
  buckets.forEach((b, j) => { if (b.length) { labels.push(levels[j]); groups.push(b); } else empty.push(levels[j]); });
  return { labels, groups, empty };
}

/** The role value as a single column key, or null. */
export function role(spec, name) {
  const r = spec?.roles?.[name];
  if (Array.isArray(r)) return r[0] ?? null;
  return r ?? null;
}

/** Common options with R's defaults. */
export function common(spec) {
  const o = spec?.options || {};
  return { confLevel: o.confLevel ?? 0.95, alternative: o.alternative ?? 'two.sided' };
}

/** An 'invalid' method output with one reason. */
export function invalid(reasonKey, extra = {}) {
  return { status: 'invalid', values: { reason: nullVal(reasonKey) }, tests: [], tables: [], used: 0, dropped: [], ...extra };
}
