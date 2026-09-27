// What each data grid cell shows [M1-DESIGN.md 17; workspace board "Data"]: the value after the
// recipe, a dash with the reason when missing, a tint when the import changed the file's text (the
// file's text on hover), a mark when the student edited the cell. Pure: no DOM, no React.
// OWNER: workspace role.
import { beDayText, canonicalDay, formatDayCell } from './era.js';

/** Missing reason codes of Column.missing [types.js] and their dictionary keys. */
export const MISSING_KEYS = Object.freeze({
  1: 'ws.missing.blank',
  2: 'ws.missing.unknown',
  3: 'ws.missing.notApplicable',
  4: 'ws.missing.notRecorded',
  5: 'ws.missing.invalid',
});

/** Codes that count as "has a missing value" for the row filter; not applicable is not a gap. */
const GAP_CODES = new Set([1, 2, 4, 5]);

/**
 * Columns the grid shows, in codebook order: personal-data columns hidden by the codebook stay out.
 * @param {import('../../lib/runtime/types.js').Codebook} codebook
 * @param {{ showHidden?: boolean }} [opts]
 */
export function visibleColumns(codebook, opts = {}) {
  return (codebook?.columns || []).filter((c) => opts.showHidden || !c.hidden).map((c) => ({
    key: c.key,
    entry: c,
    derived: /^d\d+$/.test(c.key),
  }));
}

/**
 * Codebook key -> index of that column in the raw table. Keys 'c<n>' map to raw column n - 1 when the
 * header name agrees; otherwise the header name decides. Derived columns have no raw column.
 * @returns {Map<string, number>}
 */
export function rawColumnIndex(codebook, raw) {
  const out = new Map();
  if (!raw?.header) return out;
  for (const c of codebook?.columns || []) {
    const m = /^c(\d+)$/.exec(c.key);
    const byKey = m ? Number(m[1]) - 1 : -1;
    if (byKey >= 0 && byKey < raw.header.length && raw.header[byKey] === c.name) out.set(c.key, byKey);
    else {
      const byName = raw.header.indexOf(c.name);
      if (byName >= 0 && !/^d\d+$/.test(c.key)) out.set(c.key, byName);
      else if (byKey >= 0 && byKey < raw.header.length) out.set(c.key, byKey);
    }
  }
  return out;
}

/** @returns {Map<string, number>} raw row id -> index in raw.columns[c] */
export function rawRowIndex(raw) {
  const out = new Map();
  (raw?.rowIds || []).forEach((id, i) => out.set(id, i));
  return out;
}

/** Cells the student edited through cell-edit steps: Set of `${rowId}|${column}`. */
export function editedCells(steps) {
  const out = new Set();
  for (const s of steps || []) if (s.kind === 'cell-edit' && s.params) out.add(`${s.params.rowId}|${s.params.column}`);
  return out;
}

const missingAt = (col, i) => (col.missing ? col.missing[i] || 0 : 0);

/**
 * Text of one cell as the grid shows it in the page language; '' when missing.
 * @param {import('../../lib/runtime/types.js').Column} col
 * @param {number} i row index in the working table
 * @param {'th'|'en'} lang
 */
export function cellText(col, i, lang) {
  if (!col || missingAt(col, i)) return '';
  const v = col.values[i];
  switch (col.kind) {
    case 'number': return Number.isFinite(v) ? String(v) : '';
    case 'date': return formatDayCell(v, lang);
    case 'category': return v >= 0 && col.levels ? col.levels[v] ?? '' : '';
    default: return v == null ? '' : String(v);
  }
}

/**
 * The value in the form a cell-edit step records as `from` (and expects as `to`): numbers as the
 * shortest JS text, dates as CE 'YYYY-MM-DD', categories as the level value, '' when missing.
 */
export function cellCanonical(col, i) {
  if (!col || missingAt(col, i)) return '';
  const v = col.values[i];
  switch (col.kind) {
    case 'number': return Number.isFinite(v) ? String(v) : '';
    case 'date': return canonicalDay(v);
    case 'category': return v >= 0 && col.levels ? col.levels[v] ?? '' : '';
    default: return v == null ? '' : String(v);
  }
}

/** The text a Thai file would hold for this value, used only to spot cells the import changed. */
function fileLikeText(col, i) {
  if (col.kind === 'date') return beDayText(col.values[i]);
  return cellCanonical(col, i);
}

const norm = (s) => String(s ?? '').normalize('NFC').trim();

/**
 * Everything the grid needs about one cell.
 * @param {{ table: any, raw: any, rawCols: Map<string, number>, rawRows: Map<string, number>, edited: Set<string> }} ctx
 * @param {string} key column key
 * @param {number} i row index in the working table
 * @param {'th'|'en'} lang
 * @returns {{ text: string, missing: number, rawText: string|null, converted: boolean, edited: boolean }}
 */
export function cellInfo(ctx, key, i, lang) {
  const col = ctx.table.columns[key];
  const rowId = ctx.table.rowIds[i];
  const missing = col ? missingAt(col, i) : 1;
  const rc = ctx.rawCols.get(key);
  const rr = ctx.rawRows.get(rowId);
  const rawText = rc !== undefined && rr !== undefined ? ctx.raw.columns[rc]?.[rr] ?? null : null;
  const edited = ctx.edited.has(`${rowId}|${key}`);
  const text = col ? cellText(col, i, lang) : '';
  const converted = !edited && !missing && rawText !== null && norm(rawText) !== '' && norm(rawText) !== fileLikeText(col, i);
  return { text, missing, rawText, converted, edited };
}

/**
 * Row indexes for the grid's filter chips and search box.
 * @param {{ table: any, raw: any, rawCols: Map<string, number>, rawRows: Map<string, number>, edited: Set<string> }} ctx
 * @param {{ key: string, entry: any }[]} cols visible columns
 * @param {'all'|'missing'|'converted'|'excluded'} mode
 * @param {string} query matched against row ids and id or cluster columns
 * @param {'th'|'en'} lang
 * @returns {number[]}
 */
export function filterRows(ctx, cols, mode, query, lang) {
  const n = ctx.table.rowIds.length;
  const q = norm(query).toLowerCase();
  const searchKeys = cols.filter((c) => c.entry.role === 'id' || c.entry.role === 'cluster' || c.entry.type === 'id').map((c) => c.key);
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const rowId = ctx.table.rowIds[i];
    if (mode === 'excluded' && !ctx.table.excluded?.[rowId]) continue;
    if (mode === 'missing' && !cols.some((c) => GAP_CODES.has(ctx.table.columns[c.key]?.missing?.[i] || 0))) continue;
    if (mode === 'converted' && !cols.some((c) => cellInfo(ctx, c.key, i, lang).converted)) continue;
    if (q) {
      const hit = rowId.toLowerCase().includes(q) || searchKeys.some((k) => cellText(ctx.table.columns[k], i, lang).toLowerCase().includes(q));
      if (!hit) continue;
    }
    out.push(i);
  }
  return out;
}

/** Counts shown on the filter chips. */
export function rowCounts(ctx, cols, lang) {
  return {
    all: ctx.table.rowIds.length,
    missing: filterRows(ctx, cols, 'missing', '', lang).length,
    converted: filterRows(ctx, cols, 'converted', '', lang).length,
    excluded: Object.keys(ctx.table.excluded || {}).length,
  };
}

/** Next id for a typed row: n1, n2, ... after the highest in use. */
export function nextTypedRowId(rowIds) {
  let max = 0;
  for (const id of rowIds || []) {
    const m = /^n(\d+)$/.exec(id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `n${max + 1}`;
}
