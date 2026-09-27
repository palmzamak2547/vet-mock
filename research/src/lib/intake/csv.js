// CSV and TSV parsing (RFC 4180 with quotes, CRLF/LF/CR, embedded newlines, delimiter sniffing among
// , ; tab) [M1-DESIGN.md 8.1]. Pure. OWNER: intake role.
import { thaiDigitsToArabic } from './thai.js';

const CANDIDATES = [',', ';', '\t'];

/**
 * Split text into records of fields. Quotes follow RFC 4180 ("" inside a quoted field is one quote);
 * a quote that appears in the middle of an unquoted field is kept as a character (Excel does the same).
 * @param {string} text
 * @param {string} delimiter
 * @param {number} [limit]  stop after this many records (for sniffing)
 * @returns {string[][]}
 */
export function splitRecords(text, delimiter, limit = Infinity) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quotedField = false;
  const n = text.length;
  let i = 0;
  if (text.charCodeAt(0) === 0xfeff) i = 1; // a BOM left in decoded text
  for (; i < n; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"' && field === '' && !quotedField) { inQuotes = true; quotedField = true; continue; }
    if (ch === delimiter) { row.push(field); field = ''; quotedField = false; continue; }
    if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      quotedField = false;
      if (rows.length >= limit) return rows;
      continue;
    }
    field += ch;
  }
  if (field !== '' || row.length > 0 || quotedField) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * The delimiter that gives the same number of fields (at least two) on most of the first records.
 * @param {string} text
 * @returns {{ delimiter: ','|';'|'\t', consistent: number, sampled: number }}
 */
export function sniffDelimiter(text) {
  let best = { delimiter: /** @type {','|';'|'\t'} */ (','), score: -1, consistent: 0, sampled: 0 };
  for (const d of CANDIDATES) {
    const recs = splitRecords(text, d, 30).filter((r) => !(r.length === 1 && r[0] === ''));
    if (!recs.length) continue;
    const counts = new Map();
    for (const r of recs) counts.set(r.length, (counts.get(r.length) || 0) + 1);
    let modeWidth = 1;
    let modeCount = 0;
    for (const [w, c] of counts) if (c > modeCount || (c === modeCount && w > modeWidth)) { modeWidth = w; modeCount = c; }
    if (modeWidth < 2) continue;
    // Consistency first, then width (a tab file split on commas can still be consistent by chance).
    const score = modeCount / recs.length + modeWidth * 1e-3;
    if (score > best.score) best = { delimiter: /** @type {any} */ (d), score, consistent: modeCount, sampled: recs.length };
  }
  return { delimiter: best.delimiter, consistent: best.consistent, sampled: best.sampled };
}

const NUMERIC_RE = /^[-+]?(\d+([.,]\d+)*|\.\d+)(e[-+]?\d+)?%?$/i;
const isNumericText = (s) => NUMERIC_RE.test(thaiDigitsToArabic(s.trim()));

/**
 * Header row detection: the first row whose cells are mostly non-numeric, distinct and non-empty.
 * A title line above the table ("แบบสำรวจฟาร์ม ปี 2569" in one cell) and blank lines are skipped.
 * @param {string[][]} rows first 20 rows
 * @returns {number}
 */
export function detectHeaderRow(rows) {
  const sample = rows.slice(0, 20);
  const width = sample.reduce((m, r) => Math.max(m, r.filter((c) => c.trim() !== '').length), 0);
  if (width < 2) return 0;
  for (let i = 0; i < sample.length; i++) {
    const cells = sample[i].map((c) => c.trim()).filter((c) => c !== '');
    if (cells.length < Math.max(2, Math.ceil(width * 0.6))) continue;
    const textual = cells.filter((c) => !isNumericText(c)).length;
    const distinct = new Set(cells).size;
    if (textual / cells.length >= 0.7 && distinct === cells.length) return i;
  }
  return 0;
}

/**
 * Cut the records into a header and data rows: drop wholly blank rows after the header (counted), drop
 * empty trailing columns, pad short rows with '', and keep every non-empty cell of a long row by adding
 * unnamed columns to the header (extraColumns) instead of cutting data. Empty trailing cells (Excel
 * writes ",,," after a row) are not data.
 * @param {string[][]} all @param {number} headerRow
 * @returns {{ header: string[], rows: string[][], ragged: number, extraColumns: number, blankRowsDropped: number, sourceRows: number[] }}
 *   sourceRows[i] = index in `all` of data row i
 */
export function shapeRecords(all, headerRow) {
  const header = (all[headerRow] || []).map((c) => String(c ?? ''));
  const body = [];
  const sourceRows = [];
  let blankRowsDropped = 0;
  for (let i = headerRow + 1; i < all.length; i++) {
    const r = all[i].map((c) => String(c ?? ''));
    if (r.every((c) => c.trim() === '')) { blankRowsDropped += 1; continue; }
    body.push(r);
    sourceRows.push(i);
  }
  let width = header.length;
  while (width > 0 && header[width - 1].trim() === '' && body.every((r) => (r[width - 1] ?? '').trim() === '')) width -= 1;
  header.length = width;
  let ragged = 0;
  let extraColumns = 0;
  const rows = body.map((r) => {
    let end = r.length;
    while (end > width && r[end - 1].trim() === '') end -= 1;
    const cells = end !== r.length ? r.slice(0, end) : r;
    if (cells.length !== width) ragged += 1;
    if (cells.length > header.length) {
      extraColumns += cells.length - header.length;
      while (header.length < cells.length) header.push('');
    }
    return cells;
  });
  for (const r of rows) while (r.length < header.length) r.push('');
  return { header, rows, ragged, extraColumns, blankRowsDropped, sourceRows };
}

/**
 * @param {string} text
 * @param {{ delimiter?: ','|';'|'	'|'auto', headerRow?: number }} [opts]
 * @returns {{ header: string[], rows: string[][], delimiter: string, headerRow: number, ragged: number, extraColumns: number, blankRowsDropped: number }}
 *   ragged = rows whose cell count differs from the header (see shapeRecords for what happens to them)
 */
export function parseDelimited(text, opts = {}) {
  const delimiter = !opts.delimiter || opts.delimiter === 'auto' ? sniffDelimiter(text).delimiter : opts.delimiter;
  const all = splitRecords(text, delimiter);
  const headerRow = Number.isInteger(opts.headerRow) && opts.headerRow >= 0 ? opts.headerRow : detectHeaderRow(all.slice(0, 20));
  const shaped = shapeRecords(all, headerRow);
  return { header: shaped.header, rows: shaped.rows, delimiter, headerRow, ragged: shaped.ragged, extraColumns: shaped.extraColumns, blankRowsDropped: shaped.blankRowsDropped };
}
