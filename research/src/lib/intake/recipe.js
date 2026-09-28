// The recipe: every change is a step replayed over the raw table, which is never edited
// [M1-DESIGN.md 8.4; methods.md 5.5; competitor-gaps.md D4(a)(b)]. Deterministic: the same raw
// table, codebook and steps always give the same WorkingTable. OWNER: intake role.
//
// Model. Each source column keeps its cell TEXT (after the import conversions and any edits), a set
// of missing codes with reasons, and a type from the codebook; typed values are read from the text
// only when a step needs them (filter, bin, derive-age) and once at the end. Derived columns (recode
// to a new key, bin, derive-age) are definitions over other columns, evaluated when read, so a
// derived column always agrees with the data at the point it is read. A step that cannot apply (a
// cell-edit whose `from` no longer matches, an unknown column) is skipped and reported in
// `rejected`; a cell whose text cannot be read as its type becomes missing with reason 5 (invalid)
// and is listed in `invalid`, so no value becomes missing silently.
//
// M2 [M2-DESIGN.md 4]. `compute` adds a derived column defined by a formula (expr.js), read like any
// other derived column. `exclude-where` removes rows from the study with a category and a written
// reason (a filter only narrows one analysis; the STROBE-Vet flow counts exclusions). The structural
// steps `merge`, `reshape-long`, `reshape-wide` and `aggregate` change the rows or bring columns from
// another dataset: at such a step the replay writes its current state out as text (transform.js,
// TableState), the transform makes the new table, and the replay carries on over it, so a step after
// a reshape names the new row ids and a step after a merge can use the brought columns. Missing
// reasons survive the write-out. The other datasets a merge names come in `sources`.
import { cleanCell, thaiDigitsToArabic, compareThai } from './thai.js';
import { parseNumber, keyForIndex } from './infer.js';
import { parseDate, monthsBetween, isoFromDays } from './dates.js';
import { MISSING, reasonCode } from './missing.js';
import { CATEGORICAL, NUMERIC, TYPES, LEVELS } from './codebook.js';
import { parseExpression, evalRow, MAX_LENGTH as EXPR_MAX_LENGTH } from './expr.js';
import { mergeTables, reshapeLong, reshapeWide, aggregateRows, SUMMARY_FNS, numText } from './transform.js';

/** Step kinds of M1 (M1-DESIGN.md 8.4 has the full table). */
export const M1_STEP_KINDS = Object.freeze([
  'import-conversions', 'set-type', 'missing-code', 'cell-edit', 'row-add', 'row-exclude',
  'recode', 'bin', 'reference', 'filter', 'derive-age',
]);
/** Step kinds M2 adds (M2-DESIGN.md 4); their messages live in the data dictionary (data.step.*). */
export const M2_STEP_KINDS = Object.freeze(['merge', 'reshape-long', 'reshape-wide', 'aggregate', 'compute', 'exclude-where']);
/** Every step kind. */
export const STEP_KINDS = Object.freeze([...M1_STEP_KINDS, ...M2_STEP_KINDS]);
/** Steps that change the rows or bring columns from another dataset. */
export const STRUCTURAL_KINDS = Object.freeze(['merge', 'reshape-long', 'reshape-wide', 'aggregate']);
/** Why a row leaves the study (STROBE-Vet item 13, ARRIVE 2.0 item 3). */
export const EXCLUSION_CATEGORIES = Object.freeze(['ineligible', 'lost', 'protocol-deviation', 'measurement-error', 'duplicate', 'other']);
/** Codebook types a computed column may take, by the formula's type. */
const COMPUTE_TYPES = Object.freeze({ number: ['continuous', 'count'], boolean: ['binary'], date: ['date'] });

const FILTER_OPS = Object.freeze(['eq', 'ne', 'in', 'lt', 'le', 'gt', 'ge', 'between', 'missing', 'present']);
const DERIVED_KEY = /^d\d+$/;
const MAX_LIST = 10;
// Dates written out by a structural step are ISO 8601 CE; a date typed later (a cell edit) is read
// day first, with the era told from the year (2400 and later is BE).
const BASE_DATES = Object.freeze({ order: 'dmy', era: 'mixed', twoDigitCentury: null, excelSystem: null });
const ADDED_ROW = /^n\d+$/;
const EXAMPLES = 5;

const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));

const DEFAULT_SETTINGS = Object.freeze({ thaiDigits: false, trim: false, nfc: true, invisible: false, dates: null, missingCodes: [], cellFixes: [] });

// ------------------------------------------------------------------ step validation

function fail(key) {
  const e = new Error(key);
  e.key = key;
  throw e;
}

/**
 * Throw (with an i18n key on error.key) when a step's params do not fit its kind.
 * @param {string} kind @param {Object} p @param {string|null} reason
 */
export function validateStep(kind, p, reason) {
  if (!STEP_KINDS.includes(kind)) fail('intake.step.invalid.kind');
  const area = M2_STEP_KINDS.includes(kind) ? 'data' : 'intake';
  if (!p || typeof p !== 'object') fail(`${area}.step.invalid.${kind}`);
  const bad = () => fail(`${area}.step.invalid.${kind}`);
  const str = (v) => typeof v === 'string' && v.length > 0;
  const strList = (v, min = 1) => Array.isArray(v) && v.length >= min && v.every(str) && new Set(v).size === v.length;
  switch (kind) {
    case 'import-conversions':
      if (!p.perColumn || typeof p.perColumn !== 'object') bad();
      break;
    case 'set-type':
      if (!str(p.column) || !TYPES.includes(p.type)) bad();
      break;
    case 'missing-code':
      if (!str(p.column) || typeof p.code !== 'string' || !['unknown', 'not-applicable', 'not-recorded'].includes(p.reason)) bad();
      break;
    case 'cell-edit':
      if (!str(p.rowId) || !str(p.column) || typeof p.from !== 'string' || typeof p.to !== 'string') bad();
      break;
    case 'row-add':
      if (!str(p.rowId) || !ADDED_ROW.test(p.rowId) || !p.values || typeof p.values !== 'object') bad();
      for (const v of Object.values(p.values)) if (typeof v !== 'string') bad();
      break;
    case 'row-exclude':
      if (!str(p.rowId)) bad();
      if (p.category != null && !EXCLUSION_CATEGORIES.includes(p.category)) fail('data.step.invalid.category');
      if (!str(reason)) fail('intake.step.reasonRequired');
      break;
    case 'recode':
      if (!str(p.column) || !str(p.target) || !Array.isArray(p.map) || !p.map.length) bad();
      if (p.target !== p.column && !DERIVED_KEY.test(p.target)) bad();
      for (const m of p.map) {
        if (!m || !Array.isArray(m.from) || !m.from.length || m.from.some((v) => typeof v !== 'string')) bad();
        if (!(typeof m.to === 'string' || m.to === null)) bad();
        if (m.to === null && m.reason != null && !['unknown', 'not-applicable', 'not-recorded'].includes(m.reason)) bad();
      }
      {
        const froms = p.map.flatMap((m) => m.from);
        if (new Set(froms).size !== froms.length) bad();
      }
      break;
    case 'bin': {
      if (!str(p.column) || !str(p.target) || !DERIVED_KEY.test(p.target)) bad();
      if (!Array.isArray(p.cutpoints) || !p.cutpoints.length || p.cutpoints.some((c) => !Number.isFinite(c))) bad();
      for (let i = 1; i < p.cutpoints.length; i++) if (!(p.cutpoints[i] > p.cutpoints[i - 1])) bad();
      if (p.closed !== 'left' && p.closed !== 'right') bad();
      if (p.labels != null && (!Array.isArray(p.labels) || p.labels.length !== p.cutpoints.length + 1 || p.labels.some((l) => !str(l)) || new Set(p.labels).size !== p.labels.length)) bad();
      if (!['typed', 'literature', 'median', 'quantile'].includes(p.cutSource)) bad();
      break;
    }
    case 'reference':
      if (!str(p.column) || typeof p.level !== 'string') bad();
      break;
    case 'filter':
      if (!Array.isArray(p.conditions) || !p.conditions.length || (p.combine !== 'and' && p.combine !== 'or')) bad();
      for (const c of p.conditions) {
        if (!c || !str(c.column) || !FILTER_OPS.includes(c.op)) bad();
        if ((c.op === 'in' || c.op === 'between') && !Array.isArray(c.value)) bad();
        if (c.op === 'between' && c.value.length !== 2) bad();
      }
      if (!str(reason)) fail('intake.step.reasonRequired');
      break;
    case 'derive-age':
      if (!str(p.birth) || !str(p.event) || !['months', 'days', 'years'].includes(p.unit) || !str(p.target) || !DERIVED_KEY.test(p.target)) bad();
      break;
    case 'exclude-where':
      if (!Array.isArray(p.conditions) || !p.conditions.length || (p.combine !== 'and' && p.combine !== 'or')) bad();
      for (const c of p.conditions) {
        if (!c || !str(c.column) || !FILTER_OPS.includes(c.op)) bad();
        if ((c.op === 'in' || c.op === 'between') && !Array.isArray(c.value)) bad();
        if (c.op === 'between' && c.value.length !== 2) bad();
      }
      if (!EXCLUSION_CATEGORIES.includes(p.category)) fail('data.step.invalid.category');
      if (!str(reason)) fail('intake.step.reasonRequired');
      break;
    case 'compute':
      if (!str(p.target) || !DERIVED_KEY.test(p.target) || !str(p.expression) || p.expression.length > EXPR_MAX_LENGTH) bad();
      if (p.type != null && !TYPES.includes(p.type)) bad();
      break;
    case 'merge':
      if (!str(p.sourceDatasetId) || !str(p.leftKey) || !str(p.rightKey) || !strList(p.columns)) bad();
      if (p.sourceRev != null && !Number.isInteger(p.sourceRev)) bad();
      if (p.level != null && !LEVELS.includes(p.level)) bad();
      break;
    case 'reshape-long': {
      if (!strList(p.idColumns) || !Array.isArray(p.stubs) || !p.stubs.length || !str(p.timeTarget) || !DERIVED_KEY.test(p.timeTarget)) bad();
      if (!strList(p.times, 2)) bad();
      for (const st of p.stubs) {
        if (!st || !str(st.target) || !DERIVED_KEY.test(st.target) || !strList(st.columns, 2) || st.columns.length !== p.times.length) bad();
      }
      const targets = [p.timeTarget, ...p.stubs.map((st) => st.target)];
      if (new Set(targets).size !== targets.length) bad();
      break;
    }
    case 'reshape-wide':
      if (!str(p.idColumn) || !str(p.timeColumn) || p.idColumn === p.timeColumn || !strList(p.valueColumns)) bad();
      if (p.valueColumns.includes(p.idColumn) || p.valueColumns.includes(p.timeColumn)) bad();
      break;
    case 'aggregate': {
      if (!str(p.by) || !Array.isArray(p.summaries) || !p.summaries.length) bad();
      if (p.level != null && !LEVELS.includes(p.level)) bad();
      for (const sm of p.summaries) {
        if (!sm || !str(sm.column) || !SUMMARY_FNS.includes(sm.fn) || !str(sm.target) || !DERIVED_KEY.test(sm.target)) bad();
        if (['proportion', 'any', 'all'].includes(sm.fn) && typeof sm.level !== 'string') bad();
      }
      const targets = p.summaries.map((sm) => sm.target);
      if (new Set(targets).size !== targets.length) bad();
      break;
    }
    default:
      bad();
  }
}

/**
 * Make a new step with the next id and seq; validates params for its kind (throws with an i18n key).
 * @param {import('../runtime/types.js').RecipeStep[]} steps
 * @param {import('../runtime/types.js').RecipeStep['kind']} kind
 * @param {Object} params
 * @param {string|null} [reason]
 * @returns {import('../runtime/types.js').RecipeStep}
 */
export function makeStep(steps, kind, params, reason = null) {
  validateStep(kind, params, reason);
  let maxSeq = 0;
  let maxId = 0;
  for (const s of steps || []) {
    if (s.seq > maxSeq) maxSeq = s.seq;
    const m = /^s(\d+)$/.exec(s.id || '');
    if (m && Number(m[1]) > maxId) maxId = Number(m[1]);
  }
  return { id: `s${maxId + 1}`, seq: maxSeq + 1, kind, params: clone(params), reason: reason == null ? null : String(reason), at: new Date().toISOString() };
}

/** The next free derived key ('d1', 'd2', ..) given the codebook and the steps so far. */
export function nextDerivedKey(codebook, steps) {
  let max = 0;
  const see = (k) => { const m = DERIVED_KEY.exec(k || ''); if (m && Number(k.slice(1)) > max) max = Number(k.slice(1)); };
  for (const c of codebook?.columns || []) see(c.key);
  for (const s of steps || []) {
    const p = s.params || {};
    see(p.target);
    see(p.timeTarget);
    for (const st of Array.isArray(p.stubs) ? p.stubs : []) see(st && st.target);
    for (const sm of Array.isArray(p.summaries) ? p.summaries : []) see(sm && sm.target);
  }
  return `d${max + 1}`;
}

/** The next free typed-row id ('n1', 'n2', ..). */
export function nextRowId(steps) {
  let max = 0;
  for (const s of steps || []) {
    if (s.kind !== 'row-add') continue;
    const n = Number(String(s.params.rowId).slice(1));
    if (n > max) max = n;
  }
  return `n${max + 1}`;
}

// ------------------------------------------------------------------ the replay

function binLabels(cutpoints, closed) {
  const fmt = (x) => String(x);
  const k = cutpoints.length;
  const out = [];
  if (closed === 'left') {
    out.push(`< ${fmt(cutpoints[0])}`);
    for (let i = 0; i < k - 1; i++) out.push(`[${fmt(cutpoints[i])}, ${fmt(cutpoints[i + 1])})`);
    out.push(`>= ${fmt(cutpoints[k - 1])}`);
  } else {
    out.push(`<= ${fmt(cutpoints[0])}`);
    for (let i = 0; i < k - 1; i++) out.push(`(${fmt(cutpoints[i])}, ${fmt(cutpoints[i + 1])}]`);
    out.push(`> ${fmt(cutpoints[k - 1])}`);
  }
  return out;
}

/** @param {number[]} cut @param {'left'|'right'} closed @param {number} x */
function binIndex(cut, closed, x) {
  let i = 0;
  if (closed === 'left') { while (i < cut.length && x >= cut[i]) i += 1; }
  else { while (i < cut.length && x > cut[i]) i += 1; }
  return i;
}

/**
 * @param {import('../runtime/types.js').RawTable} raw
 * @param {import('../runtime/types.js').Codebook} codebook
 * @param {import('../runtime/types.js').RecipeStep[]} steps
 * @param {Record<string, { raw: import('../runtime/types.js').RawTable, codebook: import('../runtime/types.js').Codebook, steps: import('../runtime/types.js').RecipeStep[] }>|null} [sources]
 *   the other datasets a merge step names, by dataset id (each is replayed with its own recipe first)
 * @returns {import('../runtime/types.js').WorkingTable & { codebook: import('../runtime/types.js').Codebook, excludedBy: Record<string, 'row-exclude'|'filter'|'exclude-where'>,
 *   rejected: { stepId: string, key: string, params?: Object }[],
 *   invalid: Record<string, { count: number, examples: { rowId: string, value: string, key: string }[], byKey: Record<string, number>, values: { value: string, count: number, key: string }[] }>,
 *   transforms: { stepId: string, kind: string, report: Object }[] }}
 *   fingerprint left '' (runtime fills it). codebook is the effective codebook after the steps
 *   (set types, references, levels merged by recodes, derived columns appended in creation order;
 *   after a structural step, the columns of the new table). `transforms` holds what each structural
 *   step found (matched and unmatched keys, conflicts, groups) for the screens that show it.
 */
export function applyRecipe(raw, codebook, steps, sources = null) {
  return replay(raw, codebook, steps, sources, []);
}

const MAX_SOURCE_DEPTH = 4;

function replay(raw, codebook, steps, sources, stack) {
  const ordered = (steps || []).slice().sort((a, b) => a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const rowIds = raw.rowIds.slice();
  const rowIndex = new Map(rowIds.map((id, i) => [id, i]));
  const excluded = {};
  const excludedBy = {};
  const rejected = [];
  const transforms = [];
  const invalidAcc = new Map();
  let unit = codebook?.unitOfAnalysis || 'animal';
  let clusterKey = codebook?.clusterKey ?? null;
  const storedAll = new Map((codebook?.columns || []).map((c) => [c.key, c]));
  const reject = (step, key, params) => rejected.push(params ? { stepId: step.id, key, params } : { stepId: step.id, key });

  /** @type {Map<string, any>} */
  const cols = new Map();
  const order = [];
  // Source columns: codebook entries whose key names a file column; a file column without an entry
  // gets a text entry so nothing in the file disappears.
  const byKey = new Map((codebook?.columns || []).map((c) => [c.key, c]));
  raw.header.forEach((h, i) => {
    const key = keyForIndex(i);
    const entry = clone(byKey.get(key)) || { key, name: h, labelTh: h, labelEn: '', type: 'text', role: 'none', level: codebook?.unitOfAnalysis || 'animal', unit: null, levels: [], reference: null, positive: null, missingCodes: [], range: null, pii: null, hidden: false };
    cols.set(key, { entry, source: i, settings: { ...DEFAULT_SETTINGS }, text: [], forced: new Uint8Array(rowIds.length), codes: new Map(), derived: null });
    order.push(key);
  });
  // Derived entries already in the stored codebook are rebuilt by their steps; keep their labels.
  const storedDerived = new Map((codebook?.columns || []).filter((c) => DERIVED_KEY.test(c.key)).map((c) => [c.key, c]));

  const initText = (col) => {
    if (col.base) {
      col.text = col.base.text.slice();
      col.forced = Uint8Array.from(col.base.miss);
      col.carried = new Set();
      col.base.miss.forEach((m, r) => { if (m === MISSING.invalid) col.carried.add(r); });
      col.codes = new Map();
      for (const m of col.entry.missingCodes || []) col.codes.set(m.code, reasonCode(m.reason));
      return;
    }
    const s = col.settings;
    const src = raw.columns[col.source] || [];
    const fixes = new Map((s.cellFixes || []).map((f) => [f.rowId, f]));
    col.text = new Array(rowIds.length);
    for (let r = 0; r < rowIds.length; r++) {
      if (r >= raw.rowCount) { col.text[r] = col.text[r] ?? ''; continue; }
      let t = cleanCell(src[r] ?? '', { nfc: s.nfc !== false, invisible: !!s.invisible, trim: !!s.trim }).value;
      const fix = fixes.get(rowIds[r]);
      if (fix && fix.from === t) t = fix.to;
      if (s.thaiDigits) t = thaiDigitsToArabic(t);
      col.text[r] = t;
    }
    col.forced = new Uint8Array(rowIds.length);
    col.codes = new Map();
    for (const m of s.missingCodes || []) col.codes.set(s.thaiDigits ? thaiDigitsToArabic(m.code) : m.code, reasonCode(m.reason));
    for (const m of col.entry.missingCodes || []) col.codes.set(s.thaiDigits ? thaiDigitsToArabic(m.code) : m.code, reasonCode(m.reason));
  };
  for (const key of order) initText(cols.get(key));

  const cleanTyped = (col, v) => {
    const s = col.settings || DEFAULT_SETTINGS;
    let t = cleanCell(v ?? '', { nfc: s.nfc !== false, invisible: !!s.invisible, trim: !!s.trim }).value;
    if (s.thaiDigits) t = thaiDigitsToArabic(t);
    return t;
  };

  // ---- reading a cell: { miss, text, num }  (num: number for numeric, days for date, level index for categorical)
  const dateRule = (col) => {
    const d = col.settings && col.settings.dates;
    return { order: d?.order ?? null, era: d?.era ?? null, twoDigitCentury: d?.twoDigitCentury ?? null, excelSystem: d?.excelSystem ?? null };
  };

  /** @returns {{ miss: number, text: string|null, num: number, key?: string }} */
  function read(key, r) {
    const col = cols.get(key);
    if (col.derived) return readDerived(col, r);
    if (col.forced[r]) return col.carried && col.carried.has(r) ? { miss: col.forced[r], text: null, num: NaN, carried: true } : { miss: col.forced[r], text: null, num: NaN };
    const t = col.text[r];
    if (col.codes.has(t)) return { miss: col.codes.get(t), text: t, num: NaN };
    if (t === '') return { miss: MISSING.blank, text: '', num: NaN };
    return typedFromText(col, t);
  }

  function typedFromText(col, t) {
    const type = col.entry.type;
    if (NUMERIC.has(type)) {
      const x = parseNumber(t);
      return Number.isFinite(x) ? { miss: 0, text: t, num: x } : { miss: MISSING.invalid, text: t, num: NaN, key: 'intake.cell.invalid.number' };
    }
    if (type === 'date') {
      const d = parseDate(t, dateRule(col));
      return 'days' in d ? { miss: 0, text: t, num: d.days } : { miss: MISSING.invalid, text: t, num: NaN, key: d.invalid };
    }
    if (CATEGORICAL.has(type)) {
      const idx = col.entry.levels.findIndex((l) => l.value === t);
      return { miss: 0, text: t, num: idx };
    }
    return { miss: 0, text: t, num: NaN };
  }

  function readDerived(col, r) {
    const def = col.derived;
    let out;
    if (def.kind === 'recode') {
      const src = read(def.column, r);
      const hit = src.text != null ? def.lookup.get(src.text) : undefined;
      if (hit === undefined) {
        if (src.miss) out = { miss: src.miss, text: null, num: NaN };
        else out = { miss: 0, text: src.text, num: NaN };
      } else if (hit.to === null) out = { miss: reasonCode(hit.reason || 'unknown'), text: null, num: NaN };
      else out = { miss: 0, text: hit.to, num: NaN };
    } else if (def.kind === 'bin') {
      const src = read(def.column, r);
      if (src.miss) out = { miss: src.miss, text: null, num: NaN };
      else if (!Number.isFinite(src.num)) out = { miss: MISSING.invalid, text: src.text, num: NaN, key: 'intake.cell.invalid.number' };
      else out = { miss: 0, text: def.labels[binIndex(def.cutpoints, def.closed, src.num)], num: NaN };
    } else if (def.kind === 'compute') {
      const res = evalRow(def.ast, (k) => read(k, r));
      if (res.m) out = res.key ? { miss: res.m, text: null, num: NaN, key: res.key } : { miss: res.m, text: null, num: NaN };
      else if (def.type === 'date') { const d = Math.floor(res.v); out = { miss: 0, text: isoFromDays(d), num: d }; }
      else if (def.type === 'boolean') out = { miss: 0, text: res.v !== 0 ? '1' : '0', num: NaN };
      else out = { miss: 0, text: numText(res.v), num: res.v };
    } else {
      const b = read(def.birth, r);
      const e = read(def.event, r);
      if (b.miss) out = { miss: b.miss, text: null, num: NaN };
      else if (e.miss) out = { miss: e.miss, text: null, num: NaN };
      else {
        let v;
        if (def.unit === 'days') v = e.num - b.num;
        else {
          const months = monthsBetween(b.num, e.num);
          v = def.unit === 'years' ? Math.floor(months / 12) : months;
        }
        out = e.num < b.num ? { miss: MISSING.invalid, text: null, num: NaN, key: 'intake.cell.invalid.eventBeforeBirth' } : { miss: 0, text: String(v), num: v };
      }
    }
    // post maps from in-place recodes of this derived column
    for (const post of def.post || []) {
      if (out.miss || out.text == null) continue;
      const hit = post.get(out.text);
      if (hit === undefined) continue;
      out = hit.to === null ? { miss: reasonCode(hit.reason || 'unknown'), text: null, num: NaN } : { miss: 0, text: hit.to, num: NaN };
    }
    if (out.miss === 0 && out.text != null) {
      if (CATEGORICAL.has(col.entry.type)) out.num = col.entry.levels.findIndex((l) => l.value === out.text);
      else if (NUMERIC.has(col.entry.type) && def.kind !== 'derive-age' && def.kind !== 'compute') {
        const x = parseNumber(out.text);
        out = Number.isFinite(x) ? { ...out, num: x } : { miss: MISSING.invalid, text: out.text, num: NaN, key: 'intake.cell.invalid.number' };
      }
    }
    return out;
  }

  const levelValues = (col) => col.entry.levels.map((l) => l.value);

  // ---- steps
  let applied = 0;
  for (const step of ordered) {
    const p = step.params || {};
    try {
      validateStep(step.kind, p, step.reason);
    } catch (e) {
      reject(step, e.key || 'intake.step.invalid.kind');
      continue;
    }
    const need = (key) => {
      if (!cols.has(key)) { reject(step, 'intake.step.rejected.unknownColumn', { column: key }); return null; }
      return cols.get(key);
    };
    switch (step.kind) {
      case 'import-conversions': {
        for (const key of order) {
          const col = cols.get(key);
          const s = p.perColumn[key];
          col.settings = s ? { ...DEFAULT_SETTINGS, ...clone(s) } : { ...DEFAULT_SETTINGS };
          initText(col);
        }
        break;
      }
      case 'set-type': {
        const col = need(p.column);
        if (!col) continue;
        col.entry.type = p.type;
        if (!CATEGORICAL.has(p.type)) { col.entry.levels = []; col.entry.reference = null; col.entry.positive = null; }
        break;
      }
      case 'missing-code': {
        const col = need(p.column);
        if (!col) continue;
        if (col.derived) { reject(step, 'intake.step.rejected.derivedColumn', { column: p.column }); continue; }
        const code = col.settings.thaiDigits ? thaiDigitsToArabic(p.code) : p.code;
        col.codes.set(code, reasonCode(p.reason));
        col.entry.missingCodes = (col.entry.missingCodes || []).filter((m) => m.code !== p.code).concat([{ code: p.code, reason: p.reason }]);
        break;
      }
      case 'cell-edit': {
        const col = need(p.column);
        if (!col) continue;
        if (col.derived) { reject(step, 'intake.step.rejected.derivedColumn', { column: p.column }); continue; }
        const r = rowIndex.get(p.rowId);
        if (r === undefined) { reject(step, 'intake.step.rejected.unknownRow', { rowId: p.rowId }); continue; }
        const current = col.forced[r] ? '' : col.text[r];
        if (current !== p.from) { reject(step, 'intake.step.rejected.cellChanged', { rowId: p.rowId, column: p.column }); continue; }
        col.text[r] = cleanTyped(col, p.to);
        col.forced[r] = 0;
        break;
      }
      case 'row-add': {
        if (rowIndex.has(p.rowId)) { reject(step, 'intake.step.rejected.rowExists', { rowId: p.rowId }); continue; }
        const unknown = Object.keys(p.values).find((k) => !cols.has(k) || cols.get(k).derived);
        if (unknown) { reject(step, 'intake.step.rejected.unknownColumn', { column: unknown }); continue; }
        const r = rowIds.length;
        rowIds.push(p.rowId);
        rowIndex.set(p.rowId, r);
        for (const key of order) {
          const col = cols.get(key);
          if (col.derived) continue;
          col.text.push(cleanTyped(col, p.values[key] ?? ''));
          const f = new Uint8Array(rowIds.length);
          f.set(col.forced);
          col.forced = f;
        }
        break;
      }
      case 'row-exclude': {
        if (!rowIndex.has(p.rowId)) { reject(step, 'intake.step.rejected.unknownRow', { rowId: p.rowId }); continue; }
        if (!(p.rowId in excluded)) { excluded[p.rowId] = step.id; excludedBy[p.rowId] = 'row-exclude'; }
        break;
      }
      case 'recode': {
        const col = need(p.column);
        if (!col) continue;
        const lookup = new Map();
        for (const m of p.map) for (const v of m.from) lookup.set(col.derived ? v : cleanTyped(col, v), { to: m.to === null ? null : m.to, reason: m.reason ?? null });
        const newLevels = (oldValues) => {
          // merged targets take the place of the first level they absorb; untouched levels keep their order
          const out = [];
          const push = (v) => { if (v != null && !out.includes(v)) out.push(v); };
          for (const v of oldValues) {
            const hit = lookup.get(v);
            if (hit === undefined) push(v);
            else push(hit.to);
          }
          for (const m of p.map) push(m.to);
          return out;
        };
        if (p.target === p.column) {
          if (col.derived) {
            col.derived.post = (col.derived.post || []).concat([lookup]);
          } else {
            for (let r = 0; r < rowIds.length; r++) {
              const t = col.forced[r] ? null : col.text[r];
              if (t == null) continue;
              const hit = lookup.get(t);
              if (hit === undefined) continue;
              if (hit.to === null) col.forced[r] = reasonCode(hit.reason || 'unknown');
              else col.text[r] = hit.to;
            }
          }
          if (CATEGORICAL.has(col.entry.type)) {
            const prev = new Map(col.entry.levels.map((l) => [l.value, l]));
            col.entry.levels = newLevels(levelValues(col)).map((v) => prev.get(v) || { value: v, labelTh: v, labelEn: '' });
            if (col.entry.reference != null && !col.entry.levels.some((l) => l.value === col.entry.reference)) col.entry.reference = lookup.get(col.entry.reference)?.to ?? null;
            if (col.entry.positive != null && !col.entry.levels.some((l) => l.value === col.entry.positive)) col.entry.positive = lookup.get(col.entry.positive)?.to ?? null;
          }
        } else {
          if (cols.has(p.target)) { reject(step, 'intake.step.rejected.targetExists', { column: p.target }); continue; }
          const srcEntry = col.entry;
          const type = p.type && TYPES.includes(p.type) ? p.type : CATEGORICAL.has(srcEntry.type) ? srcEntry.type : 'nominal';
          const baseLevels = CATEGORICAL.has(srcEntry.type) ? levelValues(col) : [];
          const levels = CATEGORICAL.has(type) ? newLevels(baseLevels) : [];
          const stored = storedDerived.get(p.target);
          const entry = {
            key: p.target,
            name: p.name ?? stored?.name ?? srcEntry.name,
            labelTh: p.labelTh ?? stored?.labelTh ?? srcEntry.labelTh,
            labelEn: p.labelEn ?? stored?.labelEn ?? srcEntry.labelEn,
            type, role: stored?.role ?? 'none', level: srcEntry.level, unit: NUMERIC.has(type) ? srcEntry.unit : null,
            levels: levels.map((v) => ({ value: v, labelTh: v, labelEn: '' })),
            reference: stored?.reference && levels.includes(stored.reference) ? stored.reference : null,
            positive: stored?.positive && levels.includes(stored.positive) ? stored.positive : null,
            missingCodes: [], range: null, pii: srcEntry.pii, hidden: srcEntry.hidden,
            derivation: { kind: 'recode', from: p.column, step: step.id },
          };
          cols.set(p.target, { entry, derived: { kind: 'recode', column: p.column, lookup, post: [] } });
          order.push(p.target);
        }
        break;
      }
      case 'bin': {
        const col = need(p.column);
        if (!col) continue;
        if (!NUMERIC.has(col.entry.type)) { reject(step, 'intake.step.rejected.notNumeric', { column: p.column }); continue; }
        if (cols.has(p.target)) { reject(step, 'intake.step.rejected.targetExists', { column: p.target }); continue; }
        const labels = p.labels ? p.labels.slice() : binLabels(p.cutpoints, p.closed);
        const stored = storedDerived.get(p.target);
        const entry = {
          key: p.target,
          name: p.name ?? stored?.name ?? col.entry.name,
          labelTh: p.labelTh ?? stored?.labelTh ?? col.entry.labelTh,
          labelEn: p.labelEn ?? stored?.labelEn ?? col.entry.labelEn,
          type: labels.length === 2 ? 'binary' : 'ordinal', role: stored?.role ?? 'none', level: col.entry.level, unit: null,
          levels: labels.map((v) => ({ value: v, labelTh: v, labelEn: '' })),
          reference: stored?.reference && labels.includes(stored.reference) ? stored.reference : labels[0],
          positive: stored?.positive && labels.includes(stored.positive) ? stored.positive : null,
          missingCodes: [], range: null, pii: null, hidden: false,
          derivation: { kind: 'bin', from: p.column, cutpoints: p.cutpoints.slice(), closed: p.closed, cutSource: p.cutSource, step: step.id },
        };
        cols.set(p.target, { entry, derived: { kind: 'bin', column: p.column, cutpoints: p.cutpoints.slice(), closed: p.closed, labels, post: [] } });
        order.push(p.target);
        break;
      }
      case 'reference': {
        const col = need(p.column);
        if (!col) continue;
        if (!CATEGORICAL.has(col.entry.type) || !col.entry.levels.some((l) => l.value === p.level)) { reject(step, 'intake.step.rejected.unknownLevel', { column: p.column, level: p.level }); continue; }
        col.entry.reference = p.level;
        break;
      }
      case 'filter': {
        const missingCol = p.conditions.find((c) => !cols.has(c.column));
        if (missingCol) { reject(step, 'intake.step.rejected.unknownColumn', { column: missingCol.column }); continue; }
        for (let r = 0; r < rowIds.length; r++) {
          const id = rowIds[r];
          if (id in excluded) continue;
          const results = p.conditions.map((c) => testCondition(cols.get(c.column), read(c.column, r), c));
          const keep = p.combine === 'and' ? results.every(Boolean) : results.some(Boolean);
          if (!keep) { excluded[id] = step.id; excludedBy[id] = 'filter'; }
        }
        break;
      }
      case 'exclude-where': {
        const missingCol = p.conditions.find((c) => !cols.has(c.column));
        if (missingCol) { reject(step, 'intake.step.rejected.unknownColumn', { column: missingCol.column }); continue; }
        for (let r = 0; r < rowIds.length; r++) {
          const id = rowIds[r];
          if (id in excluded) continue;
          const results = p.conditions.map((c) => testCondition(cols.get(c.column), read(c.column, r), c));
          const hit = p.combine === 'and' ? results.every(Boolean) : results.some(Boolean);
          if (hit) { excluded[id] = step.id; excludedBy[id] = 'exclude-where'; }
        }
        break;
      }
      case 'compute': {
        if (cols.has(p.target)) { reject(step, 'intake.step.rejected.targetExists', { column: p.target }); continue; }
        const refs = order.map((k) => { const e = cols.get(k).entry; return { key: k, name: e.name, type: e.type, positive: e.positive }; });
        const parsed = parseExpression(p.expression, refs);
        if (!parsed.ok) { reject(step, parsed.key, { ...(parsed.params || {}), at: parsed.at + 1 }); continue; }
        const allowed = COMPUTE_TYPES[parsed.type];
        const type = p.type == null ? allowed[0] : p.type;
        if (!allowed.includes(type)) { reject(step, 'data.compute.typeMismatch', { type }); continue; }
        const stored = storedAll.get(p.target);
        const boolLevels = [{ value: '1', labelTh: '1', labelEn: '1' }, { value: '0', labelTh: '0', labelEn: '0' }];
        const levels = type === 'binary' ? (stored && Array.isArray(stored.levels) && stored.levels.length === 2 ? clone(stored.levels) : boolLevels) : [];
        const entry = {
          key: p.target, name: p.name ?? stored?.name ?? p.target, labelTh: p.labelTh ?? stored?.labelTh ?? p.name ?? '', labelEn: p.labelEn ?? stored?.labelEn ?? '',
          type, role: stored?.role ?? 'none', level: stored?.level ?? unit, unit: stored?.unit ?? null, levels,
          reference: type === 'binary' ? '0' : null, positive: type === 'binary' ? '1' : null,
          missingCodes: [], range: null, pii: null, hidden: false,
          derivation: { kind: 'compute', expression: p.expression, refs: parsed.refs, step: step.id },
        };
        cols.set(p.target, { entry, derived: { kind: 'compute', ast: parsed.ast, type: parsed.type, post: [] } });
        order.push(p.target);
        break;
      }
      case 'merge':
      case 'reshape-long':
      case 'reshape-wide':
      case 'aggregate': {
        let res;
        try {
          res = structural(step, p);
        } catch (e) {
          reject(step, e.key || `data.step.invalid.${step.kind}`, e.params);
          continue;
        }
        if (!res) continue;
        break;
      }
      case 'derive-age': {
        const b = need(p.birth);
        const e = need(p.event);
        if (!b || !e) continue;
        if (b.entry.type !== 'date' || e.entry.type !== 'date') { reject(step, 'intake.step.rejected.notDate'); continue; }
        if (cols.has(p.target)) { reject(step, 'intake.step.rejected.targetExists', { column: p.target }); continue; }
        const stored = storedDerived.get(p.target);
        const entry = {
          key: p.target, name: p.name ?? stored?.name ?? '', labelTh: p.labelTh ?? stored?.labelTh ?? '', labelEn: p.labelEn ?? stored?.labelEn ?? '',
          type: 'continuous', role: stored?.role ?? 'none', level: b.entry.level, unit: p.unit, levels: [], reference: null, positive: null,
          missingCodes: [], range: null, pii: null, hidden: false,
          derivation: { kind: 'derive-age', birth: p.birth, event: p.event, unit: p.unit, step: step.id },
        };
        cols.set(p.target, { entry, derived: { kind: 'derive-age', birth: p.birth, event: p.event, unit: p.unit, post: [] } });
        order.push(p.target);
        break;
      }
      default:
        break;
    }
    applied = Math.max(applied, step.seq);
  }

  // ---- structural steps: write the state out, transform it, carry on over the new table

  /** @returns {Object|null} the report, or null when the step was rejected */
  function structural(step, p) {
    let res;
    let created;
    if (step.kind === 'merge') {
      const src = sources && Object.prototype.hasOwnProperty.call(sources, p.sourceDatasetId) ? sources[p.sourceDatasetId] : null;
      if (!src || !src.raw) { reject(step, 'data.merge.sourceMissing'); return null; }
      if (stack.includes(p.sourceDatasetId) || stack.length >= MAX_SOURCE_DEPTH) { reject(step, 'data.merge.sourceLoop'); return null; }
      const other = replay(src.raw, src.codebook, src.steps || [], sources, [...stack, p.sourceDatasetId]);
      res = mergeTables(snapshot(), tableToState(other), p);
      res.report.sourceRev = other.recipeRev;
      res.report.sourceChanged = p.sourceRev != null && p.sourceRev !== other.recipeRev;
      if (!res.state) {
        transforms.push({ stepId: step.id, kind: step.kind, report: res.report });
        reject(step, 'data.merge.duplicateKeys', listParams(res.report.duplicateRightKeys));
        return null;
      }
      created = Object.values(res.report.keys);
    } else if (step.kind === 'reshape-long') {
      res = { state: reshapeLong(snapshot(), p), report: null };
      res.report = { rowsIn: rowIds.length, rowsOut: res.state.rowIds.length };
      created = [p.timeTarget, ...p.stubs.map((st) => st.target)];
    } else if (step.kind === 'reshape-wide') {
      res = reshapeWide(snapshot(), p);
      if (!res.state) {
        transforms.push({ stepId: step.id, kind: step.kind, report: res.report });
        reject(step, 'data.reshape.conflicts', listParams(res.report.conflicts.map((c) => `${c.id} (${c.time})`)));
        return null;
      }
      created = Object.values(res.report.keys).flatMap((m) => Object.values(m));
    } else {
      const state = aggregateRows(snapshot(), p);
      res = { state, report: state.report };
      delete state.report;
      created = p.summaries.map((sm) => sm.target);
    }
    transforms.push({ stepId: step.id, kind: step.kind, report: res.report });
    install(res.state, new Set(created));
    return res.report;
  }

  function listParams(list) {
    return { count: list.length, list: list.slice(0, MAX_LIST).join(', ') };
  }

  function noteInvalid(key, rowId, x) {
    if (!invalidAcc.has(key)) invalidAcc.set(key, { count: 0, examples: [], byKey: {}, values: new Map() });
    const bad = invalidAcc.get(key);
    const why = x.key || 'intake.cell.invalid.number';
    const text = x.text ?? '';
    bad.count += 1;
    bad.byKey[why] = (bad.byKey[why] || 0) + 1;
    if (bad.examples.length < EXAMPLES) bad.examples.push({ rowId, value: text, key: why });
    const v = bad.values.get(text);
    if (v) v.count += 1;
    else if (bad.values.size < 200) bad.values.set(text, { value: text, count: 1, key: why });
  }

  /** levels: codebook order, then any value met that the codebook does not list, in Thai order */
  function extendLevels(col, reads) {
    if (!CATEGORICAL.has(col.entry.type)) return;
    const known = new Set(levelValues(col));
    const extra = new Set();
    for (const x of reads) if (!x.miss && x.text != null && !known.has(x.text)) extra.add(x.text);
    if (extra.size) col.entry.levels = col.entry.levels.concat([...extra].sort(compareThai).map((v) => ({ value: v, labelTh: v, labelEn: '' })));
  }

  /** The current state as text (transform.js TableState). */
  function snapshot() {
    const n = rowIds.length;
    const st = { rowIds: rowIds.slice(), order: order.slice(), entries: {}, text: {}, miss: {}, excluded: { ...excluded }, excludedBy: { ...excludedBy }, unitOfAnalysis: unit, clusterKey };
    for (const key of order) {
      const col = cols.get(key);
      const type = col.entry.type;
      const reads = new Array(n);
      for (let r = 0; r < n; r++) reads[r] = read(key, r);
      extendLevels(col, reads);
      const text = new Array(n);
      const miss = new Uint8Array(n);
      for (let r = 0; r < n; r++) {
        const x = reads[r];
        if (x.miss) {
          text[r] = '';
          miss[r] = x.miss;
          if (x.miss === MISSING.invalid && !x.carried) noteInvalid(key, rowIds[r], x);
          continue;
        }
        text[r] = NUMERIC.has(type) ? numText(x.num) : type === 'date' ? isoFromDays(x.num) : (x.text ?? '');
      }
      st.entries[key] = clone(col.entry);
      st.text[key] = text;
      st.miss[key] = miss;
    }
    return st;
  }

  /** Replace the working state with a new table; `created` keys take labels a student saved for them. */
  function install(st, created) {
    rowIds.length = 0;
    for (const id of st.rowIds) rowIds.push(id);
    rowIndex.clear();
    rowIds.forEach((id, i) => rowIndex.set(id, i));
    for (const k of Object.keys(excluded)) delete excluded[k];
    for (const k of Object.keys(excludedBy)) delete excludedBy[k];
    Object.assign(excluded, st.excluded);
    Object.assign(excludedBy, st.excludedBy);
    cols.clear();
    order.length = 0;
    for (const key of st.order) {
      let entry = st.entries[key];
      if (created.has(key) && storedAll.has(key)) entry = adoptStored(entry, storedAll.get(key));
      const col = { entry, source: null, base: { text: st.text[key], miss: st.miss[key] }, settings: { ...DEFAULT_SETTINGS, dates: entry.type === 'date' ? { ...BASE_DATES } : null }, text: [], forced: null, codes: new Map(), derived: null, carried: null };
      initText(col);
      cols.set(key, col);
      order.push(key);
    }
    unit = st.unitOfAnalysis;
    clusterKey = st.clusterKey;
  }

  // ---- final typing
  const n = rowIds.length;
  const columns = {};
  const invalid = {};
  for (const key of order) {
    const col = cols.get(key);
    const type = col.entry.type;
    const miss = new Uint8Array(n);
    const reads = new Array(n);
    for (let r = 0; r < n; r++) reads[r] = read(key, r);
    extendLevels(col, reads);
    let kind;
    let values;
    if (NUMERIC.has(type) || type === 'date') {
      kind = type === 'date' ? 'date' : 'number';
      values = new Float64Array(n);
      for (let r = 0; r < n; r++) values[r] = reads[r].miss ? NaN : reads[r].num;
    } else if (CATEGORICAL.has(type)) {
      kind = 'category';
      values = new Int32Array(n);
      const idx = new Map(col.entry.levels.map((l, i) => [l.value, i]));
      for (let r = 0; r < n; r++) values[r] = reads[r].miss || reads[r].text == null ? -1 : idx.get(reads[r].text);
    } else {
      kind = 'text';
      values = new Array(n);
      for (let r = 0; r < n; r++) values[r] = reads[r].miss ? null : reads[r].text;
    }
    for (let r = 0; r < n; r++) {
      miss[r] = reads[r].miss;
      if (reads[r].miss === MISSING.invalid && !reads[r].carried) noteInvalid(key, rowIds[r], reads[r]);
    }
    const column = { key, kind, values, missing: miss };
    if (kind === 'category') column.levels = levelValues(col);
    // The codebook's reference level travels with the column, so a model with several categorical
    // terms uses each one's own (M2 models: treatment contrasts against the reference).
    if (kind === 'category' && col.entry.reference != null && column.levels.includes(col.entry.reference)) column.reference = col.entry.reference;
    columns[key] = column;
  }

  for (const [key, bad] of invalidAcc) invalid[key] = { count: bad.count, examples: bad.examples, byKey: bad.byKey, values: [...bad.values.values()] };

  const outCodebook = {
    columns: order.map((k) => cols.get(k).entry),
    unitOfAnalysis: unit,
    clusterKey: clusterKey && cols.has(clusterKey) ? clusterKey : null,
  };
  return { rowIds, columns, n, recipeRev: applied, excluded, excludedBy, rejected, invalid, transforms, fingerprint: '', codebook: outCodebook };

  function testCondition(col, cell, c) {
    if (c.op === 'missing') return cell.miss !== 0;
    if (c.op === 'present') return cell.miss === 0;
    if (cell.miss !== 0) return false;
    const type = col.entry.type;
    const asNum = (v) => {
      if (type === 'date') {
        if (typeof v === 'number') return v;
        const d = parseDate(String(v), { order: 'ymd', era: 'CE' });
        return 'days' in d ? d.days : NaN;
      }
      if (type === 'ordinal') return typeof v === 'number' ? v : col.entry.levels.findIndex((l) => l.value === v);
      return typeof v === 'number' ? v : parseNumber(String(v));
    };
    const ordinalNum = () => col.entry.levels.findIndex((l) => l.value === cell.text);
    const x = NUMERIC.has(type) || type === 'date' ? cell.num : type === 'ordinal' ? ordinalNum() : NaN;
    const eqText = (v) => (NUMERIC.has(type) || type === 'date' ? x === asNum(v) : cell.text === String(v));
    switch (c.op) {
      case 'eq': return eqText(c.value);
      case 'ne': return !eqText(c.value);
      case 'in': return c.value.some(eqText);
      case 'lt': return x < asNum(c.value);
      case 'le': return x <= asNum(c.value);
      case 'gt': return x > asNum(c.value);
      case 'ge': return x >= asNum(c.value);
      case 'between': return x >= asNum(c.value[0]) && x <= asNum(c.value[1]);
      default: return false;
    }
  }
}

/** Labels, role and unit a student saved for a column a structural step makes; levels keep their values. */
function adoptStored(entry, stored) {
  const out = { ...entry };
  for (const f of ['name', 'labelTh', 'labelEn', 'role', 'unit', 'hidden']) if (stored[f] !== undefined && stored[f] !== null && stored[f] !== '') out[f] = stored[f];
  if (Array.isArray(entry.levels) && Array.isArray(stored.levels)) {
    const byValue = new Map(stored.levels.map((l) => [l.value, l]));
    out.levels = entry.levels.map((l) => ({ ...l, ...(byValue.has(l.value) ? { labelTh: byValue.get(l.value).labelTh || l.labelTh, labelEn: byValue.get(l.value).labelEn || l.labelEn } : {}) }));
    const has = (v) => out.levels.some((l) => l.value === v);
    if (stored.reference != null && has(stored.reference)) out.reference = stored.reference;
    if (stored.positive != null && has(stored.positive)) out.positive = stored.positive;
  }
  return out;
}

/**
 * A finished WorkingTable written out as a TableState (transform.js): numbers as their shortest text,
 * dates as ISO 8601 CE, categories as their level value, missing cells as '' with their reason code.
 * @param {ReturnType<typeof applyRecipe>} wt
 */
export function tableToState(wt) {
  const entries = {};
  const text = {};
  const miss = {};
  const order = wt.codebook.columns.map((c) => c.key).filter((k) => wt.columns[k]);
  for (const key of order) {
    const c = wt.columns[key];
    entries[key] = clone(wt.codebook.columns.find((e) => e.key === key));
    const t = new Array(wt.n);
    for (let r = 0; r < wt.n; r++) {
      if (c.missing[r]) { t[r] = ''; continue; }
      const v = c.values[r];
      t[r] = c.kind === 'number' ? numText(v) : c.kind === 'date' ? isoFromDays(v) : c.kind === 'category' ? (c.levels[v] ?? '') : (v ?? '');
    }
    text[key] = t;
    miss[key] = Uint8Array.from(c.missing);
  }
  return {
    rowIds: wt.rowIds.slice(), order, entries, text, miss, excluded: { ...wt.excluded }, excludedBy: { ...(wt.excludedBy || {}) },
    unitOfAnalysis: wt.codebook.unitOfAnalysis, clusterKey: wt.codebook.clusterKey ?? null,
  };
}

// ------------------------------------------------------------------ one line per step

const quoted = (v) => `"${v}"`;

function joinList(t, items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(t('intake.list.separator'))}${t('intake.list.and')}${items[items.length - 1]}`;
}

/**
 * One line per step for the project log and the methods paragraph, e.g. "รวมระดับ 'ไม่ทราบ' กับ 'ไม่ระบุ' เป็นค่าที่หายไป".
 * @param {import('../runtime/types.js').RecipeStep} step
 * @param {(key: string, params?: Object) => string} t
 * @param {Record<string, string>} [names]  column key -> display name (defaults to the key)
 * @returns {string}
 */
export function describeStep(step, t, names = {}) {
  const p = step.params || {};
  const name = (k) => names[k] ?? k;
  const reason = (r) => t(`intake.missing.reason.${r || 'unknown'}`);
  switch (step.kind) {
    case 'import-conversions': {
      const cols = Object.keys(p.perColumn || {}).length;
      const codes = Object.values(p.perColumn || {}).reduce((n, s) => n + (s.missingCodes || []).length, 0);
      return t('intake.step.describe.importConversions', { encoding: p.encoding || '', columns: cols, codes });
    }
    case 'set-type':
      return t('intake.step.describe.setType', { column: name(p.column), type: t(`intake.type.${p.type}`) });
    case 'missing-code':
      return t('intake.step.describe.missingCode', { column: name(p.column), code: p.code === '' ? t('intake.missing.blank') : quoted(p.code), reason: reason(p.reason) });
    case 'cell-edit':
      return t('intake.step.describe.cellEdit', { column: name(p.column), rowId: p.rowId, from: p.from === '' ? t('intake.missing.blank') : quoted(p.from), to: p.to === '' ? t('intake.missing.blank') : quoted(p.to) });
    case 'row-add':
      return t('intake.step.describe.rowAdd', { rowId: p.rowId, count: Object.keys(p.values || {}).length });
    case 'row-exclude':
      if (p.category) return t('data.step.describe.rowExcludeCategory', { rowId: p.rowId, category: t(`data.exclusion.category.${p.category}`), reason: step.reason || '' });
      return t('intake.step.describe.rowExclude', { rowId: p.rowId, reason: step.reason || '' });
    case 'recode': {
      const parts = (p.map || []).map((m) => t(m.to === null ? 'intake.step.describe.recodeToMissing' : 'intake.step.describe.recodePart', {
        from: joinList(t, m.from.map((v) => (v === '' ? t('intake.missing.blank') : quoted(v)))),
        to: m.to === null ? reason(m.reason) : quoted(m.to),
      }));
      return t(p.target === p.column ? 'intake.step.describe.recodeInPlace' : 'intake.step.describe.recodeNew', { column: name(p.column), target: name(p.target), parts: joinList(t, parts) });
    }
    case 'bin':
      return t(`intake.step.describe.bin.${p.closed === 'right' ? 'right' : 'left'}`, { column: name(p.column), target: name(p.target), cutpoints: joinList(t, (p.cutpoints || []).map(String)), source: t(`intake.step.cutSource.${p.cutSource}`) });
    case 'reference':
      return t('intake.step.describe.reference', { column: name(p.column), level: quoted(p.level) });
    case 'filter': {
      const conds = (p.conditions || []).map((c) => t(`intake.step.op.${c.op}`, { column: name(c.column), value: Array.isArray(c.value) ? joinList(t, c.value.map((v) => quoted(v))) : quoted(c.value ?? '') }));
      const joined = conds.join(t(p.combine === 'or' ? 'intake.step.combine.or' : 'intake.step.combine.and'));
      return t('intake.step.describe.filter', { conditions: joined, reason: step.reason || '' });
    }
    case 'derive-age':
      return t('intake.step.describe.deriveAge', { birth: name(p.birth), event: name(p.event), target: name(p.target), unit: t(`intake.unit.${p.unit}`) });
    case 'exclude-where': {
      const conds = (p.conditions || []).map((c) => t(`intake.step.op.${c.op}`, { column: name(c.column), value: Array.isArray(c.value) ? joinList(t, c.value.map((v) => quoted(v))) : quoted(c.value ?? '') }));
      const joined = conds.join(t(p.combine === 'or' ? 'intake.step.combine.or' : 'intake.step.combine.and'));
      return t('data.step.describe.excludeWhere', { conditions: joined, category: t(`data.exclusion.category.${p.category}`), reason: step.reason || '' });
    }
    case 'compute':
      return t('data.step.describe.compute', { target: name(p.target), expression: p.expression });
    case 'merge':
      return t('data.step.describe.merge', { columns: joinList(t, (p.columns || []).map((c) => name(c))), key: name(p.leftKey), rightKey: name(p.rightKey), count: (p.columns || []).length });
    case 'reshape-long':
      return t('data.step.describe.reshapeLong', { stubs: joinList(t, (p.stubs || []).map((st) => name(st.target))), times: joinList(t, (p.times || []).map((v) => quoted(v))), count: (p.times || []).length });
    case 'reshape-wide':
      return t('data.step.describe.reshapeWide', { id: name(p.idColumn), time: name(p.timeColumn), columns: joinList(t, (p.valueColumns || []).map((c) => name(c))) });
    case 'aggregate':
      return t('data.step.describe.aggregate', { by: name(p.by), level: t(`data.level.${p.level || 'farm'}`), count: (p.summaries || []).length, summaries: joinList(t, (p.summaries || []).map((sm) => t(`data.aggregate.fn.${sm.fn}`, { column: name(sm.column), level: quoted(sm.level ?? '') }))) });
    default:
      return t('intake.step.describe.unknown');
  }
}

// ------------------------------------------------------------------ helpers for the data-tool panes

/**
 * Replay the recipe with one more step without saving it, so a pane can show what the step would do
 * (matched and unmatched keys, conflicts, groups, rejected with its reason) before the student confirms
 * [M2-DESIGN.md 4.1].
 * @param {import('../runtime/types.js').RawTable} raw
 * @param {import('../runtime/types.js').Codebook} codebook
 * @param {import('../runtime/types.js').RecipeStep[]} steps
 * @param {import('../runtime/types.js').RecipeStep} candidate   a step made with makeStep(steps, ...)
 * @param {Parameters<typeof applyRecipe>[3]} [sources]
 * @returns {{ table: ReturnType<typeof applyRecipe>, report: Object|null, rejected: { key: string, params?: Object }|null }}
 */
export function dryRunStep(raw, codebook, steps, candidate, sources = null) {
  const table = applyRecipe(raw, codebook, [...(steps || []), candidate], sources);
  const t = table.transforms.find((x) => x.stepId === candidate.id);
  const r = table.rejected.find((x) => x.stepId === candidate.id);
  return { table, report: t ? t.report : null, rejected: r ? (r.params ? { key: r.key, params: r.params } : { key: r.key }) : null };
}

/**
 * Cells outside the range the codebook gives a number column (min and max), for the clean pane to show
 * for review. Nothing is removed: there is no delete-by-outlier button (competitor-gaps D1); the student
 * edits a cell or excludes a row with a written reason.
 * @param {ReturnType<typeof applyRecipe>} table
 * @returns {{ column: string, rowId: string, value: number, min: number|null, max: number|null }[]}
 */
export function outOfRange(table) {
  const out = [];
  for (const entry of table.codebook.columns) {
    const col = table.columns[entry.key];
    const range = entry.range;
    if (!col || col.kind !== 'number' || !range || (range.min == null && range.max == null)) continue;
    for (let r = 0; r < table.n; r++) {
      if (col.missing[r]) continue;
      const x = col.values[r];
      if ((range.min != null && x < range.min) || (range.max != null && x > range.max)) out.push({ column: entry.key, rowId: table.rowIds[r], value: x, min: range.min, max: range.max });
    }
  }
  return out;
}
