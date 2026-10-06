// The structural recipe steps: merge (many-to-one, by key), reshape long and wide, aggregate to a level
// [M2-DESIGN.md 4.1 to 4.3]. Pure; called by recipe.js at the point in the replay where the step sits.
//
// They work on a TableState, the recipe's working state written out as text: every present cell in a
// canonical text (numbers as their shortest round-trip text, dates as ISO 8601 CE, categories as the
// level value), every missing cell as '' with its reason code kept in `miss`, so a reason recorded
// before a reshape is still the reason after it. Each function returns a new state and never edits the
// one it was given. A request that cannot be met (duplicate keys on the side a merge brings columns
// from, two rows for one animal and time in a wide reshape) returns `state: null` with the list, and
// recipe.js rejects the step: nothing is dropped or chosen silently.
// OWNER: data role.
import { cleanCell, compareThai } from './thai.js';
import { MISSING } from './missing.js';
import { CATEGORICAL, NUMERIC } from './codebook.js';
import { daysFromCivil, isoFromDays } from './dates.js';

/**
 * @typedef {Object} TableState
 * @property {string[]} rowIds
 * @property {string[]} order                           column keys in display order
 * @property {Record<string, any>} entries              key -> codebook entry
 * @property {Record<string, string[]>} text            key -> canonical cell text ('' when missing)
 * @property {Record<string, Uint8Array>} miss          key -> missing reason code per row (0 present)
 * @property {Record<string, string>} excluded          rowId -> step id that excluded or filtered it
 * @property {Record<string, string>} excludedBy       rowId -> step kind
 * @property {string} unitOfAnalysis
 * @property {string|null} clusterKey
 */

export const UNMATCHED = MISSING.unmatched;
const SUMMARY_FNS = Object.freeze(['mean', 'median', 'sum', 'min', 'max', 'count', 'any', 'all', 'first', 'proportion']);
export { SUMMARY_FNS };

const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
let groupCollator = null;
/** Order of group keys: Intl.Collator('th') with numeric parts read as numbers ("F2" before "F10"). */
function compareGroup(a, b) {
  if (!groupCollator) groupCollator = new Intl.Collator('th', { numeric: true });
  return groupCollator.compare(a, b);
}

function bad(key, params) {
  const e = new Error(key);
  e.key = key;
  if (params) e.params = params;
  throw e;
}

function needColumn(state, key) {
  if (!state.entries[key]) bad('intake.step.rejected.unknownColumn', { column: key });
  return state.entries[key];
}

function keyText(state, key, r) {
  if (state.miss[key][r]) return null;
  const t = cleanCell(state.text[key][r]).value;
  return t === '' ? null : t;
}

/** The next free key with a prefix ('m' for merged columns, 'w' for wide columns). */
function nextKey(prefix, taken, extra = []) {
  let max = 0;
  const re = new RegExp(`^${prefix}(\\d+)$`);
  for (const k of [...taken, ...extra]) {
    const m = re.exec(k);
    if (m && Number(m[1]) > max) max = Number(m[1]);
  }
  return `${prefix}${max + 1}`;
}

function emptyState(from, rowIds) {
  return { rowIds, order: [], entries: {}, text: {}, miss: {}, excluded: {}, excludedBy: {}, unitOfAnalysis: from.unitOfAnalysis, clusterKey: null };
}

// ------------------------------------------------------------------ merge

/**
 * Bring columns from a second table (a farm file) into this one (an animal file) by a key. Many to
 * one only: a key that appears twice among the rows in use on the right refuses the merge with the list.
 * Rows on the left without a match are kept with the brought columns missing (reason 6, unmatched).
 * @param {TableState} left       the recipe's working state
 * @param {TableState} right      the other dataset after its own recipe
 * @param {{ leftKey: string, rightKey: string, columns: string[], level?: string }} params
 * @returns {{ state: TableState|null, report: { matched: number, unmatchedLeft: string[], missingLeftKey: string[], unmatchedRight: string[], duplicateRightKeys: string[], keys: Record<string, string> } }}
 *   `keys` maps each brought right column to its new key (m1, m2, ...)
 */
export function mergeTables(left, right, params) {
  needColumn(left, params.leftKey);
  needColumn(right, params.rightKey);
  for (const c of params.columns) needColumn(right, c);
  // right: rows in use, by key text
  const index = new Map();
  const dup = new Set();
  for (let r = 0; r < right.rowIds.length; r++) {
    if (right.rowIds[r] in right.excluded) continue;
    const k = keyText(right, params.rightKey, r);
    if (k === null) continue;
    if (index.has(k)) dup.add(k);
    else index.set(k, r);
  }
  const duplicateRightKeys = [...dup].sort(compareGroup);
  const keys = {};
  const taken = left.order.slice();
  for (const c of params.columns) {
    const k = nextKey('m', taken);
    keys[c] = k;
    taken.push(k);
  }
  const used = new Set();
  const unmatchedLeft = [];
  const missingLeftKey = [];
  const hit = new Int32Array(left.rowIds.length).fill(-1);
  let matched = 0;
  for (let r = 0; r < left.rowIds.length; r++) {
    const k = keyText(left, params.leftKey, r);
    if (k === null) { missingLeftKey.push(left.rowIds[r]); continue; }
    const j = index.get(k);
    if (j === undefined) { unmatchedLeft.push(left.rowIds[r]); continue; }
    hit[r] = j;
    used.add(k);
    matched += 1;
  }
  const unmatchedRight = [...index.keys()].filter((k) => !used.has(k)).sort(compareGroup);
  const report = { matched, unmatchedLeft, missingLeftKey, unmatchedRight, duplicateRightKeys, keys };
  if (duplicateRightKeys.length) return { state: null, report };

  const out = { ...left, order: left.order.slice(), entries: { ...left.entries }, text: { ...left.text }, miss: { ...left.miss } };
  const level = params.level || 'farm';
  for (const c of params.columns) {
    const k = keys[c];
    const src = right.entries[c];
    const entry = clone(src);
    entry.key = k;
    entry.level = level;
    entry.role = 'none';
    entry.derivation = { kind: 'merge', from: c, by: params.rightKey };
    const n = left.rowIds.length;
    const text = new Array(n);
    const miss = new Uint8Array(n);
    for (let r = 0; r < n; r++) {
      const j = hit[r];
      if (j < 0) { text[r] = ''; miss[r] = UNMATCHED; continue; }
      text[r] = right.text[c][j];
      miss[r] = right.miss[c][j];
    }
    out.order.push(k);
    out.entries[k] = entry;
    out.text[k] = text;
    out.miss[k] = miss;
  }
  return { state: out, report };
}

// ------------------------------------------------------------------ reshape

/**
 * Wide to long: one row per animal and time. Row ids become `<row id>.<time number>` (r7.1, r7.2).
 * Only the id columns listed are carried; every stub gathers its columns (one per time) into one.
 * @param {TableState} state
 * @param {{ idColumns: string[], stubs: { target: string, columns: string[], name?: string }[], timeTarget: string, times: string[], timeName?: string }} params
 * @returns {TableState}
 */
export function reshapeLong(state, params) {
  const { idColumns, stubs, timeTarget, times } = params;
  for (const c of idColumns) needColumn(state, c);
  const seen = new Set(idColumns);
  const gathered = new Set();
  for (const s of stubs) {
    if (s.columns.length !== times.length) bad('data.reshape.timesMismatch', { target: s.target });
    const first = needColumn(state, s.columns[0]);
    for (const c of s.columns) {
      const e = needColumn(state, c);
      if (seen.has(c)) bad('data.reshape.columnTwice', { column: c });
      seen.add(c);
      gathered.add(c);
      if (kindOf(e) !== kindOf(first)) bad('data.reshape.mixedTypes', { target: s.target });
    }
  }
  const targets = [timeTarget, ...stubs.map((s) => s.target)];
  if (new Set(targets).size !== targets.length) bad('data.reshape.targetTwice');
  for (const t of targets) if (idColumns.includes(t) || (state.entries[t] && !gathered.has(t))) bad('intake.step.rejected.targetExists', { column: t });
  if (new Set(times).size !== times.length) bad('data.reshape.timesTwice');

  const nIn = state.rowIds.length;
  const k = times.length;
  const rowIds = new Array(nIn * k);
  for (let r = 0; r < nIn; r++) for (let j = 0; j < k; j++) rowIds[r * k + j] = `${state.rowIds[r]}.${j + 1}`;
  const out = emptyState(state, rowIds);
  out.clusterKey = idColumns.includes(state.clusterKey) ? state.clusterKey : null;
  for (let r = 0; r < nIn; r++) {
    const id = state.rowIds[r];
    if (id in state.excluded) for (let j = 0; j < k; j++) { out.excluded[`${id}.${j + 1}`] = state.excluded[id]; out.excludedBy[`${id}.${j + 1}`] = state.excludedBy[id]; }
  }
  const put = (key, entry, text, miss) => { out.order.push(key); out.entries[key] = entry; out.text[key] = text; out.miss[key] = miss; };
  for (const c of idColumns) {
    const text = new Array(nIn * k);
    const miss = new Uint8Array(nIn * k);
    for (let r = 0; r < nIn; r++) for (let j = 0; j < k; j++) { text[r * k + j] = state.text[c][r]; miss[r * k + j] = state.miss[c][r]; }
    put(c, clone(state.entries[c]), text, miss);
  }
  {
    const text = new Array(nIn * k);
    for (let r = 0; r < nIn; r++) for (let j = 0; j < k; j++) text[r * k + j] = times[j];
    const name = params.timeName || 'time';
    put(timeTarget, {
      key: timeTarget, name, labelTh: name, labelEn: '', type: 'ordinal', role: 'time', level: 'visit', unit: null,
      levels: times.map((v) => ({ value: v, labelTh: v, labelEn: '' })), reference: times[0], positive: null,
      missingCodes: [], range: null, pii: null, hidden: false, derivation: { kind: 'reshape-long', times: times.slice() },
    }, text, new Uint8Array(nIn * k));
  }
  for (const s of stubs) {
    const text = new Array(nIn * k);
    const miss = new Uint8Array(nIn * k);
    for (let r = 0; r < nIn; r++) {
      for (let j = 0; j < k; j++) { text[r * k + j] = state.text[s.columns[j]][r]; miss[r * k + j] = state.miss[s.columns[j]][r]; }
    }
    const entry = clone(state.entries[s.columns[0]]);
    entry.hidden = s.columns.some((c) => state.entries[c].hidden);
    entry.pii = s.columns.map((c) => state.entries[c].pii).find(Boolean) || null;
    entry.key = s.target;
    entry.name = s.name || entry.name;
    entry.labelTh = s.name || entry.labelTh;
    // Named as one measure over time: the first wide column's English label ("Weight at week 0") would
    // misname it; the typed name, or the column name, is the label in both languages (review round 1).
    entry.labelEn = s.name || entry.name;
    entry.level = 'visit';
    entry.role = 'none';
    if (CATEGORICAL.has(entry.type)) {
      // levels: the union over the gathered columns, first column's order first
      const vals = entry.levels.map((l) => l.value);
      for (const c of s.columns.slice(1)) for (const l of state.entries[c].levels || []) if (!vals.includes(l.value)) { vals.push(l.value); entry.levels.push(clone(l)); }
    }
    entry.missingCodes = [];
    entry.derivation = { kind: 'reshape-long', from: s.columns.slice() };
    put(s.target, entry, text, miss);
  }
  out.unitOfAnalysis = 'visit';
  return out;
}

function kindOf(entry) {
  if (NUMERIC.has(entry.type)) return 'number';
  if (entry.type === 'date') return 'date';
  if (CATEGORICAL.has(entry.type)) return 'category';
  return 'text';
}

/**
 * Long to wide: one row per animal. The row keeps the id of the animal's first row. Columns other than
 * the time and the value columns are taken from the first row; a column whose value differs within
 * an animal is listed in the report (the first value is kept, so the student can see what was kept).
 * Two rows for the same animal and time refuse the step with the list.
 * @param {TableState} state
 * @param {{ idColumn: string, timeColumn: string, valueColumns: string[] }} params
 * @returns {{ state: TableState|null, report: { conflicts: { id: string, time: string, rowIds: string[] }[], varying: string[], missingKey: string[], excludedRows: number, keys: Record<string, Record<string, string>> } }}
 */
export function reshapeWide(state, params) {
  const { idColumn, timeColumn, valueColumns } = params;
  needColumn(state, idColumn);
  const timeEntry = needColumn(state, timeColumn);
  for (const c of valueColumns) {
    needColumn(state, c);
    if (c === idColumn || c === timeColumn) bad('data.reshape.columnTwice', { column: c });
  }
  if (idColumn === timeColumn) bad('data.reshape.columnTwice', { column: idColumn });
  const groups = new Map(); // id -> { first: r, byTime: Map(time -> r[]) }
  const timeValues = [];
  const missingKey = [];
  let excludedRows = 0;
  for (let r = 0; r < state.rowIds.length; r++) {
    if (state.rowIds[r] in state.excluded) { excludedRows += 1; continue; }
    const id = keyText(state, idColumn, r);
    const time = keyText(state, timeColumn, r);
    if (id === null || time === null) { missingKey.push(state.rowIds[r]); continue; }
    if (!groups.has(id)) groups.set(id, { first: r, byTime: new Map() });
    const g = groups.get(id);
    if (!g.byTime.has(time)) g.byTime.set(time, []);
    g.byTime.get(time).push(r);
    if (!timeValues.includes(time)) timeValues.push(time);
  }
  const conflicts = [];
  for (const [id, g] of groups) {
    for (const [time, rows] of g.byTime) if (rows.length > 1) conflicts.push({ id, time, rowIds: rows.map((r) => state.rowIds[r]) });
  }
  const times = orderTimes(timeValues, timeEntry);
  const keys = {};
  const taken = state.order.slice();
  for (const c of valueColumns) {
    keys[c] = {};
    for (const t of times) { const k = nextKey('w', taken); keys[c][t] = k; taken.push(k); }
  }
  const report = { conflicts, varying: [], missingKey, excludedRows, keys };
  if (conflicts.length) return { state: null, report };

  const ids = [...groups.keys()];
  const firstRows = ids.map((id) => groups.get(id).first);
  const out = emptyState(state, firstRows.map((r) => state.rowIds[r]));
  out.clusterKey = state.clusterKey && state.clusterKey !== timeColumn && !valueColumns.includes(state.clusterKey) ? state.clusterKey : null;
  const carried = state.order.filter((c) => c !== timeColumn && !valueColumns.includes(c));
  for (const c of carried) {
    const text = firstRows.map((r) => state.text[c][r]);
    const miss = Uint8Array.from(firstRows, (r) => state.miss[c][r]);
    // does it vary within an animal?
    let varies = false;
    for (const id of ids) {
      const g = groups.get(id);
      const f = g.first;
      for (const rows of g.byTime.values()) for (const r of rows) if (state.text[c][r] !== state.text[c][f] || state.miss[c][r] !== state.miss[c][f]) varies = true;
      if (varies) break;
    }
    if (varies) report.varying.push(c);
    out.order.push(c);
    out.entries[c] = clone(state.entries[c]);
    out.text[c] = text;
    out.miss[c] = miss;
  }
  for (const c of valueColumns) {
    for (const t of times) {
      const k = keys[c][t];
      const text = new Array(ids.length);
      const miss = new Uint8Array(ids.length);
      ids.forEach((id, i) => {
        const rows = groups.get(id).byTime.get(t);
        if (!rows) { text[i] = ''; miss[i] = MISSING.blank; return; }
        text[i] = state.text[c][rows[0]];
        miss[i] = state.miss[c][rows[0]];
      });
      const entry = clone(state.entries[c]);
      entry.key = k;
      entry.name = `${entry.name}_${t}`;
      entry.labelTh = `${entry.labelTh || state.entries[c].name}_${t}`;
      entry.labelEn = entry.labelEn ? `${entry.labelEn}_${t}` : '';
      entry.role = 'none';
      entry.derivation = { kind: 'reshape-wide', from: c, time: t };
      out.order.push(k);
      out.entries[k] = entry;
      out.text[k] = text;
      out.miss[k] = miss;
    }
  }
  out.unitOfAnalysis = state.entries[idColumn].level || 'animal';
  return { state: out, report };
}

function orderTimes(values, entry) {
  if (CATEGORICAL.has(entry.type)) {
    const lv = (entry.levels || []).map((l) => l.value);
    const known = lv.filter((v) => values.includes(v));
    const extra = values.filter((v) => !lv.includes(v)).sort(compareThai);
    return [...known, ...extra];
  }
  if (NUMERIC.has(entry.type) || entry.type === 'date') {
    return values.slice().sort((a, b) => {
      const x = entry.type === 'date' ? a : Number(a);
      const y = entry.type === 'date' ? b : Number(b);
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  return values.slice().sort(compareThai);
}

// ------------------------------------------------------------------ aggregate

/**
 * One row per level (a farm table from an animal table). Rows in use only: rows a step excluded or
 * filtered out are not summarised, and rows without a group are counted. Rows get ids a1..aK in the
 * order of the group key (Intl.Collator('th'), numbers inside keys read as numbers).
 * Summaries: mean, median (type 7), sum, min, max over the values present; count of values present;
 * proportion, any and all of one level (`level`) among the values present; first value present in
 * row order. A group with no value present gets a missing cell (reason blank); count gives 0.
 * @param {TableState} state
 * @param {{ by: string, level?: string, summaries: { column: string, fn: string, level?: string, target: string, name?: string }[] }} params
 * @returns {TableState & { report: { groups: number, excludedRows: number, missingBy: string[] } }}
 */
export function aggregateRows(state, params) {
  const byEntry = needColumn(state, params.by);
  const targets = new Set();
  for (const s of params.summaries) {
    const e = needColumn(state, s.column);
    if (!SUMMARY_FNS.includes(s.fn)) bad('data.aggregate.badFunction', { fn: String(s.fn) });
    if (targets.has(s.target) || s.target === params.by) bad('data.aggregate.targetTwice', { column: s.target });
    targets.add(s.target);
    const numericFn = ['mean', 'median', 'sum'].includes(s.fn);
    if (numericFn && !NUMERIC.has(e.type)) bad('data.aggregate.needsNumber', { column: s.column, fn: s.fn });
    if ((s.fn === 'min' || s.fn === 'max') && !NUMERIC.has(e.type) && e.type !== 'date') bad('data.aggregate.needsNumber', { column: s.column, fn: s.fn });
    if (['proportion', 'any', 'all'].includes(s.fn)) {
      if (!CATEGORICAL.has(e.type) || typeof s.level !== 'string' || !(e.levels || []).some((l) => l.value === s.level)) bad('data.aggregate.needsLevel', { column: s.column, fn: s.fn });
    }
  }
  const groups = new Map();
  let excludedRows = 0;
  const missingBy = [];
  for (let r = 0; r < state.rowIds.length; r++) {
    if (state.rowIds[r] in state.excluded) { excludedRows += 1; continue; }
    const k = keyText(state, params.by, r);
    if (k === null) { missingBy.push(state.rowIds[r]); continue; }
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  const keys = [...groups.keys()].sort(compareGroup);
  const rowIds = keys.map((_, i) => `a${i + 1}`);
  const out = emptyState(state, rowIds);
  const level = params.level || 'farm';
  out.unitOfAnalysis = level;
  const byOut = clone(byEntry);
  byOut.level = level;
  byOut.role = byOut.role === 'cluster' ? 'id' : byOut.role;
  out.order.push(params.by);
  out.entries[params.by] = byOut;
  out.text[params.by] = keys.map((k) => state.text[params.by][groups.get(k)[0]]);
  out.miss[params.by] = new Uint8Array(keys.length);
  for (const s of params.summaries) {
    const src = state.entries[s.column];
    const text = new Array(keys.length);
    const miss = new Uint8Array(keys.length);
    keys.forEach((k, i) => {
      const rows = groups.get(k).filter((r) => !state.miss[s.column][r]);
      const cell = summarise(s, src, rows.map((r) => state.text[s.column][r]));
      text[i] = cell === null ? '' : cell;
      miss[i] = cell === null ? MISSING.blank : 0;
    });
    out.order.push(s.target);
    out.entries[s.target] = summaryEntry(s, src, level);
    out.text[s.target] = text;
    out.miss[s.target] = miss;
  }
  out.report = { groups: keys.length, excludedRows, missingBy };
  return out;
}

const numOf = (t, entry) => (entry.type === 'date' ? daysOfIso(t) : Number(t));

function summarise(s, entry, texts) {
  const n = texts.length;
  switch (s.fn) {
    case 'count': return String(n);
    case 'first': return n ? texts[0] : null;
    case 'proportion': return n ? numText(texts.filter((t) => t === s.level).length / n) : null;
    case 'any': return n ? (texts.some((t) => t === s.level) ? '1' : '0') : null;
    case 'all': return n ? (texts.every((t) => t === s.level) ? '1' : '0') : null;
    default: break;
  }
  if (!n) return null;
  const xs = texts.map((t) => numOf(t, entry));
  if (xs.some((x) => !Number.isFinite(x))) return null;
  switch (s.fn) {
    case 'sum': return numText(sumOf(xs));
    case 'mean': return numText(sumOf(xs) / n);
    case 'median': return numText(quantile7(xs, 0.5));
    case 'min': { const x = Math.min(...xs); return entry.type === 'date' ? isoOfDays(x) : numText(x); }
    case 'max': { const x = Math.max(...xs); return entry.type === 'date' ? isoOfDays(x) : numText(x); }
    default: return null;
  }
}

function summaryEntry(s, src, level) {
  const name = s.name || `${src.name} (${s.fn})`;
  const base = {
    key: s.target, name, labelTh: name, labelEn: '', role: 'none', level, unit: null, levels: [], reference: null, positive: null,
    missingCodes: [], range: null, pii: src.pii || null, hidden: Boolean(src.hidden), derivation: { kind: 'aggregate', from: s.column, fn: s.fn, level: s.level ?? null },
  };
  switch (s.fn) {
    case 'count': return { ...base, type: 'count' };
    case 'proportion': return { ...base, type: 'continuous' };
    case 'any':
    case 'all':
      return { ...base, type: 'binary', levels: [{ value: '1', labelTh: '1', labelEn: '1' }, { value: '0', labelTh: '0', labelEn: '0' }], positive: '1', reference: '0' };
    case 'first': {
      const e = clone(src);
      return { ...e, key: s.target, name, labelTh: s.name || e.labelTh, role: 'none', level, derivation: base.derivation };
    }
    case 'min':
    case 'max':
      return { ...base, type: src.type === 'date' ? 'date' : src.type, unit: src.unit ?? null };
    default:
      return { ...base, type: 'continuous', unit: src.unit ?? null };
  }
}

function sumOf(xs) {
  // Neumaier summation, so a farm total does not depend on row order in the last digit
  let s = 0;
  let c = 0;
  for (const x of xs) {
    const t = s + x;
    c += Math.abs(s) >= Math.abs(x) ? (s - t) + x : (x - t) + s;
    s = t;
  }
  return s + c;
}

/** Quantile type 7 (R's default): h = (n - 1) p, linear between the order statistics. */
export function quantile7(xs, p) {
  const a = xs.slice().sort((x, y) => x - y);
  const h = (a.length - 1) * p;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  return a[lo] + (h - lo) * (a[hi] - a[lo]);
}

/** Shortest round-trip text of a number; -0 is written as 0. */
export function numText(x) {
  return x === 0 ? '0' : String(x);
}

function daysOfIso(t) {
  const m = /^(-?\d{4,})-(\d{2})-(\d{2})$/.exec(t);
  return m ? daysFromCivil(Number(m[1]), Number(m[2]), Number(m[3])) : NaN;
}
const isoOfDays = (d) => isoFromDays(d);
