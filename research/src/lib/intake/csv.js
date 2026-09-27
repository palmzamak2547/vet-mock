// CSV and TSV parsing (RFC 4180 with quotes, CRLF/LF, delimiter sniffing among , ; tab) [M1-DESIGN.md 8.1].
// OWNER: intake role.

/**
 * @param {string} text
 * @param {{ delimiter?: ','|';'|'\t'|'auto', headerRow?: number }} [opts]
 * @returns {{ header: string[], rows: string[][], delimiter: string, headerRow: number, ragged: number }}
 *   ragged = rows whose cell count differs from the header (padded with '' or truncated, reported)
 */
export function parseDelimited(text, opts = {}) {
  void text; void opts;
  throw new Error('not implemented: intake/csv.parseDelimited');
}

/**
 * Header row detection: the first row whose cells are mostly non-numeric, distinct and non-empty.
 * @param {string[][]} rows first 20 rows
 * @returns {number}
 */
export function detectHeaderRow(rows) {
  void rows;
  throw new Error('not implemented: intake/csv.detectHeaderRow');
}
