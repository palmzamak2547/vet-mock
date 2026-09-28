// Double-entry comparison: two files of the same paper forms typed by different people, matched by a
// key column, every cell that differs listed by key, row ids and column (as EpiData does). Cells are
// compared as text after cleanCell (NFC, zero-width characters removed, spaces trimmed and collapsed),
// never after type conversion, so "1.0" against "1" is shown as a difference for the student to settle.
// Keys are matched after the same cleaning with Thai digits read as Arabic digits. A key that appears
// twice in one file is listed and its rows are not compared (which pair would be the same form is not
// known). The student settles each difference with a cell-edit step whose reason names the paper form
// [M2-DESIGN.md 4.6]. Pure; the difference list is built and downloaded on the device.
// OWNER: data role.
import { cleanCell, thaiDigitsToArabic } from './thai.js';
import { keyForIndex } from './infer.js';

const clean = (v) => cleanCell(v ?? '').value;
const keyOf = (v) => thaiDigitsToArabic(clean(v));

function columnIndex(raw, key) {
  for (let i = 0; i < raw.header.length; i++) if (keyForIndex(i) === key) return i;
  return -1;
}

function index(raw, keyCol) {
  const byKey = new Map();
  const blank = [];
  for (let r = 0; r < raw.rowCount; r++) {
    const k = keyOf(raw.columns[keyCol][r]);
    if (k === '') { blank.push(raw.rowIds[r]); continue; }
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(r);
  }
  return { byKey, blank };
}

/**
 * Pair the columns of two files by their header text (after cleaning), leaving out the key columns.
 * @param {import('../runtime/types.js').RawTable} a
 * @param {import('../runtime/types.js').RawTable} b
 * @param {string} keyA @param {string} keyB
 * @returns {{ pairs: [string, string][], onlyA: string[], onlyB: string[] }}
 */
export function pairColumnsByName(a, b, keyA, keyB) {
  const bByName = new Map();
  b.header.forEach((h, i) => { const k = keyForIndex(i); if (k !== keyB && !bByName.has(clean(h))) bByName.set(clean(h), k); });
  const pairs = [];
  const usedB = new Set();
  const onlyA = [];
  a.header.forEach((h, i) => {
    const k = keyForIndex(i);
    if (k === keyA) return;
    const kb = bByName.get(clean(h));
    if (kb && !usedB.has(kb)) { pairs.push([k, kb]); usedB.add(kb); } else onlyA.push(k);
  });
  const onlyB = b.header.map((_, i) => keyForIndex(i)).filter((k) => k !== keyB && !usedB.has(k));
  return { pairs, onlyA, onlyB };
}

/**
 * @param {import('../runtime/types.js').RawTable} a     the first typist's file
 * @param {import('../runtime/types.js').RawTable} b     the second typist's file
 * @param {{ keyA: string, keyB: string, columnPairs?: [string, string][] }} opts
 *   column keys (c1, c2, ...) of each file; without `columnPairs`, columns are paired by header text
 * @returns {{ differences: { key: string, rowIdA: string, rowIdB: string, column: string, columnB: string, name: string, a: string, b: string }[],
 *   onlyInA: string[], onlyInB: string[], duplicateKeys: { a: string[], b: string[] }, blankKeys: { a: string[], b: string[] },
 *   unpairedColumns: { a: string[], b: string[] }, rowsCompared: number, cellsCompared: number, cellsDiffering: number }}
 *   differences in the first file's row order, then column-pair order; keys listed in Intl.Collator('th') order
 */
export function compareEntries(a, b, opts) {
  const ka = columnIndex(a, opts.keyA);
  const kb = columnIndex(b, opts.keyB);
  if (ka < 0 || kb < 0) {
    const e = new Error('data.double.noKey');
    e.key = 'data.double.noKey';
    throw e;
  }
  let pairs;
  let unpaired = { a: [], b: [] };
  if (Array.isArray(opts.columnPairs)) {
    pairs = opts.columnPairs.filter(([x, y]) => columnIndex(a, x) >= 0 && columnIndex(b, y) >= 0);
  } else {
    const p = pairColumnsByName(a, b, opts.keyA, opts.keyB);
    pairs = p.pairs;
    unpaired = { a: p.onlyA, b: p.onlyB };
  }
  const idxPairs = pairs.map(([x, y]) => [x, y, columnIndex(a, x), columnIndex(b, y)]);
  const ia = index(a, ka);
  const ib = index(b, kb);
  const coll = new Intl.Collator('th', { numeric: true });
  const dupA = [...ia.byKey].filter(([, rows]) => rows.length > 1).map(([k]) => k).sort(coll.compare);
  const dupB = [...ib.byKey].filter(([, rows]) => rows.length > 1).map(([k]) => k).sort(coll.compare);
  const dups = new Set([...dupA, ...dupB]);
  const onlyInA = [...ia.byKey.keys()].filter((k) => !ib.byKey.has(k)).sort(coll.compare);
  const onlyInB = [...ib.byKey.keys()].filter((k) => !ia.byKey.has(k)).sort(coll.compare);
  const differences = [];
  let rowsCompared = 0;
  let cellsCompared = 0;
  const seen = new Set();
  for (let r = 0; r < a.rowCount; r++) {
    const k = keyOf(a.columns[ka][r]);
    if (k === '' || dups.has(k) || seen.has(k) || !ib.byKey.has(k)) continue;
    seen.add(k);
    const rb = ib.byKey.get(k)[0];
    rowsCompared += 1;
    for (const [x, y, ca, cb] of idxPairs) {
      cellsCompared += 1;
      const va = clean(a.columns[ca][r]);
      const vb = clean(b.columns[cb][rb]);
      if (va !== vb) differences.push({ key: k, rowIdA: a.rowIds[r], rowIdB: b.rowIds[rb], column: x, columnB: y, name: a.header[ca], a: va, b: vb });
    }
  }
  return {
    differences, onlyInA, onlyInB, duplicateKeys: { a: dupA, b: dupB }, blankKeys: { a: ia.blank, b: ib.blank },
    unpairedColumns: unpaired, rowsCompared, cellsCompared, cellsDiffering: differences.length,
  };
}

const csvCell = (v) => {
  const s = String(v ?? '');
  // a cell a spreadsheet would read as a formula gets a leading apostrophe; a negative number stays a number
  const safe = /^[=+@\t\r]|^-(?![\d.])/.test(s) ? `'${s}` : s;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/**
 * The difference list as CSV text (UTF-8 with a byte order mark so Excel reads Thai), built on the
 * device for a download. Column titles come from the caller's dictionary.
 * @param {ReturnType<typeof compareEntries>} result
 * @param {{ key: string, rowA: string, rowB: string, column: string, a: string, b: string }} titles
 * @returns {string}
 */
export function differencesToCsv(result, titles) {
  const lines = [[titles.key, titles.rowA, titles.rowB, titles.column, titles.a, titles.b].map(csvCell).join(',')];
  for (const d of result.differences) lines.push([d.key, d.rowIdA, d.rowIdB, d.name, d.a, d.b].map(csvCell).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}
