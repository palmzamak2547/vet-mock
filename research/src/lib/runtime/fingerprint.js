// Data fingerprint for frozen snapshots and provenance [M1-DESIGN.md 10.4]. OWNER: runtime role.

/**
 * Canonical CSV of the rows in use: header = column keys in codebook order, rows in rowId order,
 * numbers printed with Number.prototype.toString (shortest round-trip), dates as YYYY-MM-DD (CE),
 * categories as their level text, missing as the empty field, LF line ends, UTF-8 without BOM,
 * RFC 4180 quoting. Hidden PII columns are included (the fingerprint never leaves the device).
 * @param {import('./types.js').WorkingTable} table
 * @param {string[]} keys  column keys in codebook order
 * @returns {string}
 */
export function canonicalCsv(table, keys) {
  void table; void keys;
  throw new Error('not implemented: runtime/fingerprint.canonicalCsv');
}

/**
 * SHA-256 of canonicalCsv(), hex. Uses crypto.subtle.digest (available in workers and on the main
 * thread over https and localhost).
 * @param {import('./types.js').WorkingTable} table
 * @param {string[]} keys
 * @returns {Promise<string>}
 */
export async function fingerprint(table, keys) {
  void table; void keys;
  throw new Error('not implemented: runtime/fingerprint.fingerprint');
}
