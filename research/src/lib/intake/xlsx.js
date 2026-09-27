// XLSX and XLS through SheetJS CE 0.20.3 (installed from cdn.sheetjs.com, never the npm "xlsx" 0.18.5)
// [M1-DESIGN.md 8.1]. Imported only inside the worker (and the main-thread fallback), so the landing
// and the workspace shell never load it. Cells are read as their formatted text AND raw value, and
// the date system (1900 or 1904) is taken from the workbook. OWNER: intake role.

/**
 * @param {ArrayBuffer} bytes
 * @returns {string[]} sheet names in workbook order
 */
export function listSheets(bytes) {
  void bytes;
  throw new Error('not implemented: intake/xlsx.listSheets');
}

/**
 * @param {ArrayBuffer} bytes
 * @param {{ sheet: string|null, headerRow?: number }} opts
 * @returns {{ header: string[], rows: string[][], headerRow: number, dateSystem: '1900'|'1904', excelDateCells: { row: number, col: number, serial: number }[] }}
 *   excelDateCells lists cells Excel stored as dates, so an ID Excel turned into a date ("7-Apr") is shown
 */
export function readSheet(bytes, opts) {
  void bytes; void opts;
  throw new Error('not implemented: intake/xlsx.readSheet');
}
