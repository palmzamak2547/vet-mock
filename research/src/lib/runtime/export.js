// Local exports [M1-DESIGN.md 14; competitor-gaps.md D4(c)]. Everything is built in the browser and
// handed to the student as a download ("ดาวน์โหลด") or the clipboard; nothing is sent anywhere.
// OWNER: runtime role.

/**
 * An HTML table that Word keeps formatted when pasted: <table> with inline border-collapse,
 * thead, numbers right-aligned, caption, and the provenance line as a <p> after the table.
 * @param {{ caption: string, columns: string[], rows: (string|number|null)[][], note?: string }} table
 * @returns {string}
 */
export function tableToHtml(table) {
  void table;
  throw new Error('not implemented: runtime/export.tableToHtml');
}

/**
 * RFC 4180 CSV with a UTF-8 BOM so Excel on Windows reads Thai.
 * @param {{ columns: string[], rows: (string|number|null)[][] }} table
 * @returns {string}
 */
export function tableToCsv(table) {
  void table;
  throw new Error('not implemented: runtime/export.tableToCsv');
}

/**
 * Copy a table as both text/html and text/plain (tab-separated) through the async Clipboard API,
 * with a hidden-textarea fallback where ClipboardItem is missing.
 * @param {{ caption: string, columns: string[], rows: (string|number|null)[][], note?: string }} table
 * @returns {Promise<'html'|'text'|'failed'>}
 */
export async function copyTable(table) {
  void table;
  throw new Error('not implemented: runtime/export.copyTable');
}

/**
 * Serialise an <svg> chart for download: inline the computed colours as attributes (no CSS
 * variables survive outside the page), embed nothing external.
 * @param {SVGSVGElement} svg
 * @returns {string}
 */
export function svgToString(svg) {
  void svg;
  throw new Error('not implemented: runtime/export.svgToString');
}

/**
 * Rasterise an SVG string to PNG at a print resolution. widthMm is the figure width on paper;
 * pixels = round(widthMm / 25.4 * dpi). The PNG carries a pHYs chunk with the dpi so Word and
 * journals read the intended size.
 * @param {string} svgText
 * @param {{ widthMm: number, dpi: 300|600 }} opts
 * @returns {Promise<Blob>}
 */
export async function svgToPng(svgText, opts) {
  void svgText; void opts;
  throw new Error('not implemented: runtime/export.svgToPng');
}

/**
 * Hand a Blob to the student as a download through an object URL.
 * @param {Blob} blob
 * @param {string} fileName
 */
export function download(blob, fileName) {
  void blob; void fileName;
  throw new Error('not implemented: runtime/export.download');
}
