// Reading a WorkingTable for the epi methods: binary indicators, 2x2 and k x k tables, strata and
// clusters, with rows dropped counted per column [M1-DESIGN.md 7 general rules, 8.5]. Pure; no DOM.
// OWNER: epi role.
//
// Row rules shared by every epi method:
// - A row listed in table.excluded (row-exclude or filter step) is skipped and NOT counted here;
//   run.js counts those from table.excluded because it knows which step removed each row.
// - A row with a missing cell in any role column is dropped and counted once, against the first role
//   column (in the order the method lists its roles) where it is missing; reason 'missing', or
//   'invalid' when the column's missing code is 5 (value could not be read).
// - A row whose exposure (or test, or rater) level is outside the two levels being compared is
//   dropped with reason 'filter' against that column: the comparison chose two levels.

/** @typedef {import('../runtime/types.js').WorkingTable} WorkingTable */
/** @typedef {import('../runtime/types.js').Column} Column */

/** Missing code 5 means the cell could not be read (types.js Column.missing). */
const INVALID = 5;

/**
 * @param {WorkingTable} table
 * @param {string} key
 * @returns {Column}
 */
export function getColumn(table, key) {
  const col = table?.columns?.[key];
  if (!col) throw Object.assign(new Error(`column ${key} not in table`), { key: 'epi.error.columnNotFound' });
  return col;
}

/** Index of a level value in a category column, or -1. */
export function levelIndex(col, value) {
  if (col.kind !== 'category' || value == null) return -1;
  return col.levels.indexOf(String(value));
}

/** Is row r of this column missing? Returns 0 (present), or the missing code (1..5). */
export function missingCode(col, r) {
  const m = col.missing?.[r] ?? 0;
  if (m) return m;
  const v = col.values[r];
  if (col.kind === 'category') return v < 0 ? 1 : 0;
  if (col.kind === 'number' || col.kind === 'date') return Number.isNaN(v) ? 1 : 0;
  return v == null ? 1 : 0;
}

/**
 * Walk the rows in use. `roles` is an ordered list of column keys; `visit(r)` is called for every
 * row present in all of them. Returns used and dropped counts.
 * @param {WorkingTable} table
 * @param {string[]} keys
 * @param {(r: number) => ('filter'|void)} visit  return 'filter' plus set `filterColumn` to drop a row by level
 */
export function eachRow(table, keys, visit) {
  const cols = keys.map((k) => getColumn(table, k));
  const excluded = table.excluded || {};
  const drops = new Map();
  const bump = (reason, column) => {
    const id = `${reason}|${column}`;
    drops.set(id, (drops.get(id) || 0) + 1);
  };
  let used = 0;
  for (let r = 0; r < table.n; r++) {
    if (excluded[table.rowIds[r]]) continue;
    let dropped = false;
    for (let i = 0; i < cols.length; i++) {
      const m = missingCode(cols[i], r);
      if (m) { bump(m === INVALID ? 'invalid' : 'missing', keys[i]); dropped = true; break; }
    }
    if (dropped) continue;
    const out = visit(r);
    if (out && typeof out === 'object' && out.filter) { bump('filter', out.filter); continue; }
    used++;
  }
  const dropped = [...drops.entries()].map(([id, count]) => {
    const [reason, column] = id.split('|');
    return { reason, column, count };
  });
  return { used, dropped };
}

/**
 * Turn a column into a 0/1 reader for one level (category) or for a numeric 0/1 column.
 * @returns {(r: number) => (0|1|null)}  null when the row holds a level outside the pair compared
 */
export function binaryReader(col, positive, negative = null) {
  if (col.kind === 'category') {
    const pos = levelIndex(col, positive);
    if (pos < 0) throw Object.assign(new Error(`level ${positive} not in column ${col.key}`), { key: 'epi.error.levelNotFound' });
    const neg = negative == null ? -1 : levelIndex(col, negative);
    if (negative != null && neg < 0) throw Object.assign(new Error(`level ${negative} not in column ${col.key}`), { key: 'epi.error.levelNotFound' });
    return (r) => {
      const v = col.values[r];
      if (v === pos) return 1;
      if (neg < 0 || v === neg) return 0;
      return null;
    };
  }
  if (col.kind === 'number') {
    const pos = positive == null ? 1 : Number(positive);
    const neg = negative == null ? null : Number(negative);
    return (r) => {
      const v = col.values[r];
      if (v === pos) return 1;
      if (neg == null ? v === 0 : v === neg) return 0;
      return null;
    };
  }
  throw Object.assign(new Error(`column ${col.key} is not categorical or numeric`), { key: 'epi.error.notBinary' });
}

/** Key of a row's value for grouping (cluster or stratum): level text, number, or string. */
export function groupReader(col) {
  if (col.kind === 'category') return (r) => col.levels[col.values[r]];
  return (r) => String(col.values[r]);
}

/**
 * Build [[a, b], [c, d]] (rows exposed, reference; columns positive, negative), optionally one per
 * stratum (strata listed in the order first met).
 * @param {WorkingTable} table
 * @param {{ exposure: string, exposureLevel: string, referenceLevel?: string|null, outcome: string, outcomePositive: string, strata?: string|null }} a
 */
export function twoByTwoFromTable(table, a) {
  const keys = [a.exposure, a.outcome].concat(a.strata ? [a.strata] : []);
  const ex = binaryReader(getColumn(table, a.exposure), a.exposureLevel, a.referenceLevel ?? null);
  const out = binaryReader(getColumn(table, a.outcome), a.outcomePositive, null);
  const st = a.strata ? groupReader(getColumn(table, a.strata)) : null;
  const total = [[0, 0], [0, 0]];
  const strata = new Map();
  const res = eachRow(table, keys, (r) => {
    const e = ex(r);
    if (e === null) return { filter: a.exposure };
    const o = out(r);
    if (o === null) return { filter: a.outcome };
    const i = e ? 0 : 1;
    const j = o ? 0 : 1;
    total[i][j]++;
    if (st) {
      const s = st(r);
      if (!strata.has(s)) strata.set(s, [[0, 0], [0, 0]]);
      strata.get(s)[i][j]++;
    }
    return undefined;
  });
  return { table: total, strata: st ? [...strata.values()] : null, strataLabels: st ? [...strata.keys()] : null, used: res.used, dropped: res.dropped };
}

/** Count rows positive for one binary role: { x, n }. */
export function countPositive(table, key, positive) {
  const rd = binaryReader(getColumn(table, key), positive, null);
  let x = 0;
  const res = eachRow(table, [key], (r) => {
    const v = rd(r);
    if (v === null) return { filter: key };
    x += v;
    return undefined;
  });
  return { x, n: res.used, used: res.used, dropped: res.dropped };
}

/** Normalise a 2x2 given as [[a,b],[c,d]] or { a, b, c, d }. Throws on negative or non-integer. */
export function asTwoByTwo(t) {
  const m = Array.isArray(t) ? t : [[t.a, t.b], [t.c, t.d]];
  for (const row of m) for (const v of row) {
    if (!Number.isFinite(v) || v < 0 || Math.round(v) !== v) throw Object.assign(new Error('cells must be whole counts'), { key: 'epi.error.badCounts' });
  }
  return m;
}

/** An 'invalid' method output with a reason. */
export function invalidOutput(reasonKey, extra = {}) {
  return { status: 'invalid', reasonKey, values: {}, tests: [], tables: [], used: 0, dropped: [], ...extra };
}

/** A reported number [runtime/types.js Value]. */
export function val(value, extra = {}) {
  return { value, ...extra };
}

/** An undefined quantity: null with the sentence key, never 0. */
export function nul(reasonKey, extra = {}) {
  return { value: null, reasonKey, ...extra };
}

/** Run a MethodImpl body and turn a thrown input error (with an i18n key) into an invalid output. */
export function guarded(fn) {
  try {
    return fn();
  } catch (err) {
    if (err && typeof err.key === 'string') return invalidOutput(err.key);
    throw err;
  }
}
