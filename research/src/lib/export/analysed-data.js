// The "analysed data" CSV the SPSS syntax and the R script read [M2-DESIGN.md 6.3, 6.4]: the rows in use
// (after every recipe step), the columns in codebook order, hidden PII columns left out, missing cells
// blank, categories as their stored value (the scripts attach the labels), dates as ISO 8601 (CE), numbers
// as the shortest text that reads back to the same double. The header carries a variable name SPSS and R
// both accept, made once here so the CSV and both scripts agree. Built on the device. OWNER: report role.

/** Names SPSS or R reserve, compared in lower case. */
const RESERVED = new Set(['all', 'and', 'by', 'eq', 'ge', 'gt', 'le', 'lt', 'ne', 'not', 'or', 'to', 'with',
  'if', 'else', 'repeat', 'while', 'function', 'for', 'next', 'break', 'true', 'false', 'null', 'inf', 'nan', 'na', 'in']);
const SAFE = /^[A-Za-z][A-Za-z0-9_]{0,31}$/;
const NUMERIC_TEXT = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
const CATEGORICAL = new Set(['binary', 'nominal', 'ordinal']);

/**
 * @typedef {{ key: string, name: string, header: string, label: string, type: 'number'|'string'|'date', codebookType: string,
 *   levels: string[], levelLabels: Record<string, string>, reference: string|null, positive: string|null, width: number }} ScriptColumn
 */

/** A name valid in SPSS and R made from any text: other characters become _, a letter goes first. */
export function safeIdent(key) {
  let s = String(key ?? '').replace(/[^A-Za-z0-9_]/g, '_').slice(0, 30);
  if (!/^[A-Za-z]/.test(s)) s = `v${s}`;
  return RESERVED.has(s.toLowerCase()) ? `${s}_` : s;
}

/** Bytes a value takes in UTF-8 (SPSS string widths count bytes). */
const utf8Bytes = (s) => new TextEncoder().encode(String(s)).length;

/**
 * The columns an export carries, in codebook order, with a name valid in both SPSS and R: the header
 * when it already is one (letters, digits and underscore, starting with a letter, at most 32 characters,
 * not reserved), else the column key (c3, d1). A second use of a name gets the key.
 * @param {any} codebook
 * @param {any} [table]   the working table, for the storage kind and string widths
 * @param {'th'|'en'} [lang]
 * @returns {ScriptColumn[]}
 */
export function scriptColumns(codebook, table = null, lang = 'th') {
  const used = new Set();
  const out = [];
  for (const c of codebook?.columns || []) {
    if (c.hidden) continue;
    const col = table?.columns?.[c.key];
    if (table && !col) continue;
    let name = String(c.name || '').trim();
    const key = safeIdent(c.key);
    if (!SAFE.test(name) || RESERVED.has(name.toLowerCase()) || used.has(name.toLowerCase())) name = key;
    for (let i = 2; used.has(name.toLowerCase()); i += 1) name = `${key}_${i}`;
    used.add(name.toLowerCase());
    const levels = (c.levels || []).map((l) => l?.value).filter((v) => typeof v === 'string');
    const levelLabels = Object.fromEntries((c.levels || []).filter((l) => l && typeof l.value === 'string').map((l) => [l.value, (lang === 'en' ? l.labelEn : l.labelTh) || '']));
    let type;
    if (col) type = col.kind === 'number' ? 'number' : col.kind === 'date' ? 'date' : col.kind === 'category' ? (levelsNumeric(col.levels || levels) ? 'number' : 'string') : 'string';
    else type = c.type === 'continuous' || c.type === 'count' ? 'number' : c.type === 'date' ? 'date' : CATEGORICAL.has(c.type) && levelsNumeric(levels) ? 'number' : 'string';
    let width = 255;
    if (col && type === 'string') {
      width = 1;
      for (let i = 0; i < table.rowIds.length; i += 1) {
        const s = cellText(col, i);
        if (s) width = Math.max(width, utf8Bytes(s));
      }
    }
    out.push({
      key: c.key, name, header: c.name || c.key, label: (lang === 'en' ? c.labelEn : c.labelTh) || c.name || c.key,
      type, codebookType: c.type || 'text', levels: col?.kind === 'category' && col.levels ? col.levels.slice() : levels, levelLabels,
      reference: c.reference ?? null, positive: c.positive ?? null, width,
    });
  }
  return out;
}

function levelsNumeric(levels) {
  return Array.isArray(levels) && levels.length > 0 && levels.every((v) => NUMERIC_TEXT.test(String(v)));
}

const pad2 = (n) => String(n).padStart(2, '0');

/** Days since 1970-01-01 (proleptic Gregorian) as YYYY-MM-DD. */
export function isoDay(days) {
  if (!Number.isFinite(days)) return '';
  const d = new Date(Math.round(days) * 86400000);
  const y = d.getUTCFullYear();
  return `${y < 0 ? '-' : ''}${String(Math.abs(y)).padStart(4, '0')}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** The text of one cell of a working-table column, '' when missing. */
export function cellText(col, i) {
  if (!col || (col.missing && col.missing[i])) return '';
  const v = col.values[i];
  switch (col.kind) {
    case 'number': return Number.isFinite(v) ? String(Object.is(v, -0) ? 0 : v) : '';
    case 'date': return isoDay(v);
    case 'category': return typeof v === 'number' && v >= 0 && col.levels?.[v] !== undefined ? String(col.levels[v]) : '';
    default: return v === null || v === undefined ? '' : String(v);
  }
}

/** RFC 4180 field. */
const csvField = (s) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/**
 * @param {any} table     the working table after the recipe
 * @param {any} codebook
 * @param {'th'|'en'} [lang]
 * @returns {{ csv: string, columns: ScriptColumn[], rows: number }}
 */
export function analysedCsv(table, codebook, lang = 'th') {
  const columns = scriptColumns(codebook, table, lang);
  const excluded = table?.excluded || {};
  const lines = [columns.map((c) => csvField(c.name)).join(',')];
  let rows = 0;
  for (let i = 0; i < (table?.rowIds || []).length; i += 1) {
    if (table.rowIds[i] in excluded) continue;
    rows += 1;
    lines.push(columns.map((c) => csvField(cellText(table.columns[c.key], i))).join(','));
  }
  return { csv: `﻿${lines.join('\r\n')}\r\n`, columns, rows };
}
