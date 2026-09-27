// Bytes -> text [M1-DESIGN.md 8.1; methods.md 5.1]. Strict UTF-8 first (BOM aware, UTF-16 LE by BOM),
// then windows-874 (the WHATWG label for TIS-620). Never guesses silently: the preview shows the
// encoding used and why. Pure, runs in the worker and in Node. OWNER: intake role.

/**
 * @param {ArrayBuffer|Uint8Array} bytes
 * @returns {{ text: string, encoding: 'utf-8'|'utf-8-bom'|'utf-16le'|'windows-874', reasonKey: string, replacementChars: number }}
 *   reasonKey e.g. 'intake.encoding.utf8Strict' or 'intake.encoding.fallback874' (strict UTF-8 failed at byte N)
 */
export function decodeBytes(bytes) {
  void bytes;
  throw new Error('not implemented: intake/decode.decodeBytes');
}

/** @param {ArrayBuffer|Uint8Array} bytes @returns {Promise<string>} lowercase hex SHA-256 */
export async function sha256Hex(bytes) {
  void bytes;
  throw new Error('not implemented: intake/decode.sha256Hex');
}
