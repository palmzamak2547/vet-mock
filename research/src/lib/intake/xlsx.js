// XLSX and XLS through SheetJS CE 0.20.3 (installed from cdn.sheetjs.com, never the npm "xlsx" 0.18.5)
// [M1-DESIGN.md 8.1]. SheetJS is loaded with a dynamic import on first use, so only the worker (and
// the main-thread fallback) ever downloads it; the landing and the workspace shell never do. The code
// page tables (needed for Thai text in old .xls files) load only for .xls. Cells are read as their raw
// value, and the date system (1900 or 1904) is taken from the workbook. OWNER: intake role.
import { detectHeaderRow, shapeRecords } from './csv.js';
import { excelSerialToDays, isoFromDays } from './dates.js';

let libPromise = null;
let cpPromise = null;

/** @param {Uint8Array} u8 An OLE compound file (.xls), which may need code page tables. */
const isCompoundFile = (u8) => u8.length >= 8 && u8[0] === 0xd0 && u8[1] === 0xcf && u8[2] === 0x11 && u8[3] === 0xe0;

async function loadSheetJs(u8) {
  if (!libPromise) libPromise = import('xlsx');
  const X = await libPromise;
  if (isCompoundFile(u8) && !cpPromise) {
    cpPromise = import('xlsx/dist/cpexcel.full.mjs').then((cp) => { X.set_cptable(cp); return true; });
  }
  if (cpPromise) await cpPromise;
  return X;
}

const asU8 = (bytes) => (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));

/** A number as the shortest text that reads back to the same double (never the rounded display). */
function numberText(v) {
  if (Number.isInteger(v) && Math.abs(v) < 1e21) return String(v);
  return String(v);
}

function timeText(serial) {
  const frac = serial - Math.floor(serial);
  if (frac <= 0) return '';
  const secs = Math.round(frac * 86400);
  const hh = Math.floor(secs / 3600) % 24;
  const mm = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;
  return ` ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/**
 * @param {ArrayBuffer|Uint8Array} bytes
 * @returns {Promise<string[]>} sheet names in workbook order
 */
export async function listSheets(bytes) {
  const u8 = asU8(bytes);
  const X = await loadSheetJs(u8);
  const wb = X.read(u8, { type: 'array', bookSheets: true });
  return wb.SheetNames.slice();
}

/**
 * @param {ArrayBuffer|Uint8Array} bytes
 * @param {{ sheet: string|null, headerRow?: number }} opts
 * @returns {Promise<{ sheet: string, header: string[], rows: string[][], headerRow: number, dateSystem: '1900'|'1904', excelDateCells: { row: number, col: number, serial: number, shown: string }[],
 *   ragged: number, extraColumns: number, blankRowsDropped: number, errorCells: number }>}
 *   Cells Excel stores as dates become 'YYYY-MM-DD' text (CE, with ' HH:MM:SS' when a time is
 *   stored), except when the date format has no year (an ID Excel turned into a date, shown as
 *   "7-Apr"): those keep the text Excel showed. excelDateCells lists every date cell (row = index in
 *   `rows`, col = column index) with its serial and the text Excel showed, so the preview can list them.
 *   Error cells (#N/A, #DIV/0!) keep their text and are counted.
 */
export async function readSheet(bytes, opts = {}) {
  const u8 = asU8(bytes);
  const X = await loadSheetJs(u8);
  const wb = X.read(u8, { type: 'array', cellDates: false, cellNF: true, cellText: true, cellStyles: false });
  const name = opts.sheet != null && wb.SheetNames.includes(opts.sheet) ? opts.sheet : wb.SheetNames[0];
  if (opts.sheet != null && !wb.SheetNames.includes(opts.sheet)) throw Object.assign(new Error('sheet not found'), { key: 'intake.xlsx.sheetMissing' });
  const ws = wb.Sheets[name];
  const dateSystem = wb.Workbook && wb.Workbook.WBProps && wb.Workbook.WBProps.date1904 ? '1904' : '1900';
  const grid = [];
  const dateCellsGrid = [];
  let errorCells = 0;
  if (ws && ws['!ref']) {
    const range = X.utils.decode_range(ws['!ref']);
    for (let r = range.s.r; r <= range.e.r; r++) {
      const row = [];
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = ws[X.utils.encode_cell({ r, c })];
        let text = '';
        if (cell) {
          if (cell.t === 'n') {
            const fmt = cell.z == null ? '' : String(cell.z);
            if (fmt && X.SSF.is_date(fmt)) {
              const shown = cell.w != null ? String(cell.w) : '';
              const hasYear = /y|e|b[12]?/i.test(fmt.replace(/"[^"]*"|\[[^\]]*\]/g, ''));
              const days = excelSerialToDays(cell.v, dateSystem);
              text = hasYear && Number.isFinite(days) ? isoFromDays(days) + timeText(cell.v) : shown;
              dateCellsGrid.push({ r: r - range.s.r, c: c - range.s.c, serial: cell.v, shown });
            } else text = numberText(cell.v);
          } else if (cell.t === 'b') text = cell.v ? 'TRUE' : 'FALSE';
          else if (cell.t === 'e') { text = cell.w != null ? String(cell.w) : '#ERROR'; errorCells += 1; }
          else if (cell.t === 'z') text = '';
          else text = cell.v == null ? '' : String(cell.v);
        }
        row.push(text);
      }
      grid.push(row);
    }
  }
  const headerRow = Number.isInteger(opts.headerRow) && opts.headerRow >= 0 ? opts.headerRow : detectHeaderRow(grid.slice(0, 20));
  const shaped = shapeRecords(grid, headerRow);
  const toRow = new Map(shaped.sourceRows.map((src, i) => [src, i]));
  const excelDateCells = [];
  for (const d of dateCellsGrid) {
    if (!toRow.has(d.r) || d.c >= shaped.header.length) continue;
    excelDateCells.push({ row: toRow.get(d.r), col: d.c, serial: d.serial, shown: d.shown });
  }
  return {
    sheet: name, header: shaped.header, rows: shaped.rows, headerRow, dateSystem, excelDateCells,
    ragged: shaped.ragged, extraColumns: shaped.extraColumns, blankRowsDropped: shaped.blankRowsDropped, errorCells,
  };
}
