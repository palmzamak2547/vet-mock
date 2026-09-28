// What the tool screens compute for themselves before a step is saved or a list is downloaded: key
// matching for a merge, values outside the codebook range, how many rows a condition catches,
// preview rows, fresh derived keys, and CSV files that carry their
// settings in the first rows [M2-DESIGN.md 4, 7, 10.3]. Pure: no DOM, no storage, no words (the
// screens pass translated labels in). OWNER: ui-tools role.
import { cellCanonical, cellText } from '../../lib/grid-model.js';

/** Summaries an aggregate step offers for each kind of column [M2-DESIGN.md 4.3]. */
export const AGG_FNS = Object.freeze({
  number: ['mean', 'median', 'sum', 'min', 'max', 'count', 'first'],
  category: ['proportion', 'any', 'all', 'count', 'first'],
  other: ['count', 'first'],
});

/** The column's name in the page language. */
export const colLabel = (c, lang) => (lang === 'en' ? c?.labelEn || c?.name || c?.key || '' : c?.labelTh || c?.name || c?.key || '');

const norm = (s) => String(s ?? '').normalize('NFC').trim();

/** Row indexes a recipe step has not excluded or filtered out. */
export function activeRows(table) {
  const ex = table?.excluded || {};
  const out = [];
  for (let r = 0; r < (table?.n || 0); r += 1) if (!ex[table.rowIds[r]]) out.push(r);
  return out;
}

/** A key cell as text (the level, the number or the text), trimmed; '' when missing. */
export function keyText(table, key, r) {
  return norm(cellCanonical(table?.columns?.[key], r));
}

/**
 * How a merge would match: every row in use of this dataset against the other dataset's key.
 * @returns {{ matched: number, unmatchedLeft: { rowId: string, key: string }[], blankLeft: number, unmatchedRight: string[], duplicateRight: string[], rightKeys: number }}
 */
export function keyMatch(left, leftKey, right, rightKey) {
  const counts = new Map();
  for (const r of activeRows(right)) {
    const k = keyText(right, rightKey, r);
    if (k === '') continue;
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const duplicateRight = [...counts].filter(([, c]) => c > 1).map(([k]) => k);
  const used = new Set();
  let matched = 0;
  let blankLeft = 0;
  const unmatchedLeft = [];
  for (const r of activeRows(left)) {
    const k = keyText(left, leftKey, r);
    if (k === '') { blankLeft += 1; unmatchedLeft.push({ rowId: left.rowIds[r], key: '' }); continue; }
    if (counts.has(k)) { matched += 1; used.add(k); } else unmatchedLeft.push({ rowId: left.rowIds[r], key: k });
  }
  const unmatchedRight = [...counts.keys()].filter((k) => !used.has(k));
  return { matched, unmatchedLeft, blankLeft, unmatchedRight, duplicateRight, rightKeys: counts.size };
}

/**
 * Values outside the range the codebook gives a number column, for review (never removed by a test).
 * @returns {{ rowId: string, column: string, value: number, min: number|null, max: number|null }[]}
 */
export function rangeFlags(table, codebook) {
  const out = [];
  if (!table) return out;
  for (const c of codebook?.columns || []) {
    const rg = c.range;
    if (!rg || (rg.min == null && rg.max == null) || c.hidden) continue;
    const col = table.columns[c.key];
    if (!col || col.kind !== 'number') continue;
    for (const r of activeRows(table)) {
      if (col.missing?.[r]) continue;
      const v = col.values[r];
      if (!Number.isFinite(v)) continue;
      if ((rg.min != null && v < rg.min) || (rg.max != null && v > rg.max)) out.push({ rowId: table.rowIds[r], column: c.key, value: v, min: rg.min ?? null, max: rg.max ?? null });
    }
  }
  return out;
}

export const CONDITION_OPS = Object.freeze(['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'missing', 'present']);
const NUMERIC_OPS = new Set(['lt', 'le', 'gt', 'ge']);

/** Whether row r meets one condition, read as the filter step reads it (a missing cell meets only 'missing'). */
export function meets(table, cond, r) {
  const col = table?.columns?.[cond.column];
  if (!col) return false;
  const text = norm(cellCanonical(col, r));
  const missing = text === '';
  if (cond.op === 'missing') return missing;
  if (cond.op === 'present') return !missing;
  if (missing) return false;
  if (NUMERIC_OPS.has(cond.op)) {
    if (col.kind !== 'number') return false;
    const v = col.values[r];
    const x = Number(cond.value);
    if (!Number.isFinite(x)) return false;
    return cond.op === 'lt' ? v < x : cond.op === 'le' ? v <= x : cond.op === 'gt' ? v > x : v >= x;
  }
  const same = col.kind === 'number' ? Number(text) === Number(cond.value) && norm(cond.value) !== '' : text === norm(cond.value);
  return cond.op === 'eq' ? same : !same;
}

/** Row ids (in use) that meet the conditions, combined with 'and' or 'or'. */
export function matchingRows(table, conditions, combine = 'and') {
  const conds = (conditions || []).filter((c) => c.column && CONDITION_OPS.includes(c.op));
  if (!conds.length || !table) return [];
  const out = [];
  for (const r of activeRows(table)) {
    const hits = conds.map((c) => meets(table, c, r));
    if (combine === 'or' ? hits.some(Boolean) : hits.every(Boolean)) out.push(table.rowIds[r]);
  }
  return out;
}

/** The first rows of a table as text, for a preview. */
export function previewRows(table, keys, limit = 8, lang = 'th') {
  const rows = [];
  if (!table) return rows;
  for (const r of activeRows(table).slice(0, limit)) rows.push([table.rowIds[r], ...keys.map((k) => cellText(table.columns[k], r, lang))]);
  return rows;
}

/** `count` fresh derived keys ('d7', 'd8', ..) after every key the codebook and the steps use. */
export function freshKeys(codebook, steps, count) {
  let max = 0;
  const see = (k) => { const m = /^d(\d+)$/.exec(k || ''); if (m && Number(m[1]) > max) max = Number(m[1]); };
  for (const c of codebook?.columns || []) see(c.key);
  for (const s of steps || []) {
    const p = s.params || {};
    see(p.target);
    see(p.timeTarget);
    for (const x of p.stubs || []) see(x.target);
    for (const x of p.summaries || []) see(x.target);
  }
  return Array.from({ length: count }, (_, i) => `d${max + 1 + i}`);
}

/** A codebook entry for a column a tool step creates (the name is what the student typed). */
export function newEntry(key, name, patch = {}) {
  return {
    key, name, labelTh: name, labelEn: '', type: 'continuous', role: 'none', level: 'animal', unit: null, levels: [],
    reference: null, positive: null, missingCodes: [], range: null, pii: null, hidden: false, ...patch,
  };
}

const csvField = (s) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
const cell = (c) => (c === null || c === undefined ? '' : String(c));

/**
 * A CSV file whose first rows say how it was made (label, value), then a blank row, then the table.
 * UTF-8 with a byte-order mark so Excel reads Thai.
 * @param {[string, string|number][]} settings
 * @param {{ columns: string[], rows: (string|number|null)[][] }} table
 */
export function csvWithSettings(settings, table) {
  const lines = settings.map(([k, v]) => [k, cell(v)].map(csvField).join(','));
  lines.push('');
  lines.push(table.columns.map((c) => csvField(cell(c))).join(','));
  for (const r of table.rows) lines.push(r.map((c) => csvField(cell(c))).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}

/**
 * The three files a blinded list gives: the full list (who gets what), the code sheet (unit and code,
 * no arm: for labelling), and the key (code and arm, kept apart until the analysis).
 * @param {(string|number|null)[][]} rows  the envelope's 'list' rows: unit, stratum, block, arm, code
 * @param {{ unit: string, stratum: string, block: string, arm: string, code: string }} heads
 * @param {boolean} stratified
 */
export function listTables(rows, heads, stratified) {
  const s = stratified;
  const full = { columns: [heads.unit, ...(s ? [heads.stratum] : []), heads.block, heads.arm, heads.code], rows: rows.map((r) => [r[0], ...(s ? [r[1]] : []), r[2], r[3], r[4]]) };
  const codes = { columns: [heads.unit, ...(s ? [heads.stratum] : []), heads.code], rows: rows.map((r) => [r[0], ...(s ? [r[1]] : []), r[4]]) };
  const key = { columns: [heads.code, heads.arm], rows: rows.map((r) => [r[4], r[3]]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)) };
  return { full, codes, key };
}

/** Columns whose values are all present and all different among the rows in use (usable as a row id). */
export function uniqueIdColumns(table, codebook) {
  const out = [];
  if (!table) return out;
  const rows = activeRows(table);
  for (const c of codebook?.columns || []) {
    if (c.hidden || !['id', 'text', 'nominal', 'count', 'continuous'].includes(c.type)) continue;
    const col = table.columns[c.key];
    if (!col) continue;
    const seen = new Set();
    let ok = rows.length > 0;
    for (const r of rows) {
      const k = norm(cellCanonical(col, r));
      if (k === '' || seen.has(k)) { ok = false; break; }
      seen.add(k);
    }
    if (ok) out.push(c);
  }
  return out;
}
