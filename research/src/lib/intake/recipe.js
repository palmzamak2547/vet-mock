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
import { cleanCell, thaiDigitsToArabic, compareThai } from './thai.js';
import { parseNumber, keyForIndex } from './infer.js';
import { parseDate, monthsBetween } from './dates.js';
import { MISSING, reasonCode } from './missing.js';
import { CATEGORICAL, NUMERIC, TYPES } from './codebook.js';

/** Step kinds and their params (M1-DESIGN.md 8.4 has the full table). */
export const STEP_KINDS = Object.freeze([
  'import-conversions', 'set-type', 'missing-code', 'cell-edit', 'row-add', 'row-exclude',
  'recode', 'bin', 'reference', 'filter', 'derive-age',
]);

const FILTER_OPS = Object.freeze(['eq', 'ne', 'in', 'lt', 'le', 'gt', 'ge', 'between', 'missing', 'present']);
const DERIVED_KEY = /^d\d+$/;
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
  if (!p || typeof p !== 'object') fail(`intake.step.invalid.${kind}`);
  const bad = () => fail(`intake.step.invalid.${kind}`);
  const str = (v) => typeof v === 'string' && v.length > 0;
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
  for (const s of steps || []) see(s.params && s.params.target);
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
 * @returns {import('../runtime/types.js').WorkingTable & { codebook: import('../runtime/types.js').Codebook, excludedBy: Record<string, 'row-exclude'|'filter'>,
 *   rejected: { stepId: string, key: string, params?: Object }[],
 *   invalid: Record<string, { count: number, examples: { rowId: string, value: string, key: string }[], byKey: Record<string, number>, values: { value: string, count: number, key: string }[] }> }}
 *   fingerprint left '' (runtime fills it). codebook is the effective codebook after the steps
 *   (set types, references, levels merged by recodes, derived columns appended in creation order).
 */
export function applyRecipe(raw, codebook, steps) {
  const ordered = (steps || []).slice().sort((a, b) => a.seq - b.seq || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const rowIds = raw.rowIds.slice();
  const rowIndex = new Map(rowIds.map((id, i) => [id, i]));
  const excluded = {};
  const excludedBy = {};
  const rejected = [];
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
    if (col.forced[r]) return { miss: col.forced[r], text: null, num: NaN };
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
      else if (NUMERIC.has(col.entry.type) && def.kind !== 'derive-age') {
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
    // levels: codebook order, then any value met that the codebook does not list, in Thai order
    if (CATEGORICAL.has(type)) {
      const known = new Set(levelValues(col));
      const extra = new Set();
      for (const x of reads) if (!x.miss && x.text != null && !known.has(x.text)) extra.add(x.text);
      if (extra.size) col.entry.levels = col.entry.levels.concat([...extra].sort(compareThai).map((v) => ({ value: v, labelTh: v, labelEn: '' })));
    }
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
    let bad = null;
    for (let r = 0; r < n; r++) {
      miss[r] = reads[r].miss;
      if (reads[r].miss === MISSING.invalid) {
        if (!bad) bad = { count: 0, examples: [], byKey: {}, values: new Map() };
        const why = reads[r].key || 'intake.cell.invalid.number';
        const text = reads[r].text ?? '';
        bad.count += 1;
        bad.byKey[why] = (bad.byKey[why] || 0) + 1;
        if (bad.examples.length < EXAMPLES) bad.examples.push({ rowId: rowIds[r], value: text, key: why });
        const v = bad.values.get(text);
        if (v) v.count += 1;
        else if (bad.values.size < 200) bad.values.set(text, { value: text, count: 1, key: why });
      }
    }
    if (bad) invalid[key] = { count: bad.count, examples: bad.examples, byKey: bad.byKey, values: [...bad.values.values()] };
    const column = { key, kind, values, missing: miss };
    if (kind === 'category') column.levels = levelValues(col);
    columns[key] = column;
  }

  const outCodebook = {
    columns: order.map((k) => cols.get(k).entry),
    unitOfAnalysis: codebook?.unitOfAnalysis || 'animal',
    clusterKey: codebook?.clusterKey ?? null,
  };
  return { rowIds, columns, n, recipeRev: applied, excluded, excludedBy, rejected, invalid, fingerprint: '', codebook: outCodebook };

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
    default:
      return t('intake.step.describe.unknown');
  }
}
