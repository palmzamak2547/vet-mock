// Bytes -> text [M1-DESIGN.md 8.1; methods.md 5.1]. Strict UTF-8 first (BOM aware, UTF-16 by BOM),
// then windows-874 (the WHATWG label for TIS-620). Never guesses silently: the preview shows the
// encoding used and why. Pure, runs in the worker and in Node. OWNER: intake role.

/** @param {ArrayBuffer|Uint8Array} bytes */
function asU8(bytes) {
  if (bytes instanceof Uint8Array) return bytes;
  if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
  if (ArrayBuffer.isView(bytes)) return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  throw new TypeError('decodeBytes: expected bytes');
}

/**
 * Offset of the first byte that breaks UTF-8 (overlongs, surrogates and code points above U+10FFFF
 * included), or -1 when the whole buffer is valid UTF-8. A sequence cut off by the end of the buffer
 * is invalid at its lead byte.
 * @param {Uint8Array} u8 @param {number} [start]
 */
export function firstInvalidUtf8(u8, start = 0) {
  let i = start;
  const n = u8.length;
  while (i < n) {
    const b = u8[i];
    if (b < 0x80) { i += 1; continue; }
    let need;
    let min;
    if (b >= 0xc2 && b <= 0xdf) { need = 1; min = 0x80; }
    else if (b >= 0xe0 && b <= 0xef) { need = 2; min = 0x800; }
    else if (b >= 0xf0 && b <= 0xf4) { need = 3; min = 0x10000; }
    else return i;
    if (i + need >= n) return i;
    let cp = b & (need === 1 ? 0x1f : need === 2 ? 0x0f : 0x07);
    for (let k = 1; k <= need; k++) {
      const c = u8[i + k];
      if (c === undefined || (c & 0xc0) !== 0x80) return i;
      cp = (cp << 6) | (c & 0x3f);
    }
    if (cp < min || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return i;
    i += need + 1;
  }
  return -1;
}

const LABELS = Object.freeze({ 'utf-8': 'utf-8', 'utf-8-bom': 'utf-8', 'utf-16le': 'utf-16le', 'utf-16be': 'utf-16be', 'windows-874': 'windows-874' });

function countReplacement(text) {
  let n = 0;
  for (let i = text.indexOf('�'); i !== -1; i = text.indexOf('�', i + 1)) n += 1;
  return n;
}

/**
 * @param {ArrayBuffer|Uint8Array} bytes
 * @param {{ encoding?: 'auto'|'utf-8'|'utf-16le'|'utf-16be'|'windows-874' }} [opts]  a forced encoding (the
 *   student changed the select) decodes leniently and counts replacement characters
 * @returns {{ text: string, encoding: 'utf-8'|'utf-8-bom'|'utf-16le'|'utf-16be'|'windows-874', reasonKey: string, params: Object, replacementChars: number, bom: boolean }}
 *   reasonKey e.g. 'intake.encoding.utf8Strict' or 'intake.encoding.fallback874' (params.byte = the
 *   0-based offset where strict UTF-8 failed); utf-16be is decoded when the file carries its BOM
 */
export function decodeBytes(bytes, opts = {}) {
  const u8 = asU8(bytes);
  const forced = opts.encoding && opts.encoding !== 'auto' ? opts.encoding : null;
  const hasUtf8Bom = u8.length >= 3 && u8[0] === 0xef && u8[1] === 0xbb && u8[2] === 0xbf;
  const hasLeBom = u8.length >= 2 && u8[0] === 0xff && u8[1] === 0xfe;
  const hasBeBom = u8.length >= 2 && u8[0] === 0xfe && u8[1] === 0xff;

  if (forced) {
    let body = u8;
    let bom = false;
    let enc = forced;
    if (forced === 'utf-8' && hasUtf8Bom) { body = u8.subarray(3); bom = true; enc = 'utf-8-bom'; }
    if (forced === 'utf-16le' && hasLeBom) { body = u8.subarray(2); bom = true; }
    if (forced === 'utf-16be' && hasBeBom) { body = u8.subarray(2); bom = true; }
    const text = new TextDecoder(LABELS[forced], { fatal: false, ignoreBOM: true }).decode(body);
    const replacementChars = countReplacement(text);
    return { text, encoding: /** @type {any} */ (enc), reasonKey: replacementChars ? 'intake.encoding.chosenWithErrors' : 'intake.encoding.chosen', params: { count: replacementChars }, replacementChars, bom };
  }

  if (hasLeBom || hasBeBom) {
    const enc = hasLeBom ? 'utf-16le' : 'utf-16be';
    const text = new TextDecoder(enc, { fatal: false, ignoreBOM: true }).decode(u8.subarray(2));
    const replacementChars = countReplacement(text);
    return { text, encoding: enc, reasonKey: 'intake.encoding.utf16Bom', params: { count: replacementChars }, replacementChars, bom: true };
  }

  const start = hasUtf8Bom ? 3 : 0;
  const bad = firstInvalidUtf8(u8, start);
  if (bad === -1) {
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(u8.subarray(start));
    return { text, encoding: hasUtf8Bom ? 'utf-8-bom' : 'utf-8', reasonKey: hasUtf8Bom ? 'intake.encoding.utf8Bom' : 'intake.encoding.utf8Strict', params: {}, replacementChars: 0, bom: hasUtf8Bom };
  }
  // Not UTF-8. Thai files that are not UTF-8 are windows-874 (TIS-620 plus a few punctuation marks).
  const text = new TextDecoder('windows-874', { fatal: false }).decode(u8);
  const replacementChars = countReplacement(text);
  return {
    text,
    encoding: 'windows-874',
    reasonKey: replacementChars ? 'intake.encoding.fallback874WithErrors' : 'intake.encoding.fallback874',
    params: { byte: bad, count: replacementChars },
    replacementChars,
    bom: false,
  };
}

/** @param {ArrayBuffer|Uint8Array} bytes @returns {Promise<string>} lowercase hex SHA-256 */
export async function sha256Hex(bytes) {
  const u8 = asU8(bytes);
  const subtle = globalThis.crypto && globalThis.crypto.subtle;
  if (!subtle) throw new Error('sha256Hex: WebCrypto is not available');
  const digest = await subtle.digest('SHA-256', u8);
  const out = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < out.length; i++) hex += out[i].toString(16).padStart(2, '0');
  return hex;
}
