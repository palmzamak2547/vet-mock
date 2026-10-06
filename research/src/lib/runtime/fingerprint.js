// Data fingerprint for frozen snapshots and provenance [M1-DESIGN.md 10.4]. OWNER: runtime role.

const MS_PER_DAY = 86400000;

/** Row id order: file rows r1..rN first, then typed rows n1..nK, then anything else, each numerically. */
export function compareRowIds(a, b) {
  const pa = rowIdParts(a);
  const pb = rowIdParts(b);
  return pa[0] - pb[0] || pa[1] - pb[1] || (a < b ? -1 : a > b ? 1 : 0);
}

function rowIdParts(id) {
  const m = /^([rn])(\d+)$/.exec(id);
  if (!m) return [2, 0];
  return [m[1] === 'r' ? 0 : 1, Number(m[2])];
}

/** Days since 1970-01-01 (proleptic Gregorian, CE) to YYYY-MM-DD. */
export function daysToIso(days) {
  const d = new Date(Math.round(days) * MS_PER_DAY);
  const y = d.getUTCFullYear();
  const yy = y < 0 ? `-${String(-y).padStart(6, '0')}` : y > 9999 ? `+${String(y).padStart(6, '0')}` : String(y).padStart(4, '0');
  return `${yy}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/** RFC 4180 field. */
export function csvField(s) {
  const text = s === null || s === undefined ? '' : String(s);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** One cell as canonical text, or '' when missing. */
export function cellText(col, i) {
  if (!col) return '';
  if (col.missing && col.missing[i]) return '';
  const v = col.values[i];
  switch (col.kind) {
    case 'number':
      return typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
    case 'date':
      return typeof v === 'number' && Number.isFinite(v) ? daysToIso(v) : '';
    case 'category':
      return typeof v === 'number' && v >= 0 && col.levels && col.levels[v] !== undefined ? col.levels[v] : '';
    default:
      return v === null || v === undefined ? '' : String(v);
  }
}

/**
 * Canonical CSV of the rows in use: header = column keys in codebook order, rows in rowId order,
 * numbers printed with Number.prototype.toString (shortest round-trip), dates as YYYY-MM-DD (CE),
 * categories as their level text, missing as the empty field, LF line ends, UTF-8 without BOM,
 * RFC 4180 quoting. Hidden PII columns are included (the fingerprint never leaves the device).
 * Rows a recipe step excluded or filtered are not in use and are left out.
 * @param {import('./types.js').WorkingTable} table
 * @param {string[]} keys  column keys in codebook order
 * @returns {string}
 */
export function canonicalCsv(table, keys) {
  const excluded = table.excluded || {};
  const order = table.rowIds.map((id, i) => ({ id, i })).filter((r) => !excluded[r.id]);
  order.sort((a, b) => compareRowIds(a.id, b.id));
  const lines = [keys.map(csvField).join(',')];
  for (const { i } of order) lines.push(keys.map((k) => csvField(cellText(table.columns[k], i))).join(','));
  return `${lines.join('\n')}\n`;
}

/**
 * SHA-256 of canonicalCsv(), hex. Uses crypto.subtle.digest when present (workers and pages over
 * https and localhost), otherwise the small implementation below, so the value never depends on where
 * it was computed.
 * @param {import('./types.js').WorkingTable} table
 * @param {string[]} keys
 * @returns {Promise<string>}
 */
export async function fingerprint(table, keys) {
  return sha256Hex(new TextEncoder().encode(canonicalCsv(table, keys)));
}

/** Interpretation and export visibility are not cell values; keep their hash separate from the canonical CSV. */
export async function fingerprintCodebook(codebook) {
  const text = JSON.stringify(codebook, (_key, value) => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, value[key]])) : value);
  return sha256Hex(new TextEncoder().encode(text));
}

/** @param {Uint8Array|ArrayBuffer} bytes @returns {Promise<string>} */
export async function sha256Hex(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const buf = await subtle.digest('SHA-256', data);
    return toHex(new Uint8Array(buf));
  }
  return toHex(sha256Sync(data));
}

function toHex(u8) {
  let s = '';
  for (let i = 0; i < u8.length; i += 1) s += u8[i].toString(16).padStart(2, '0');
  return s;
}

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

/** Plain SHA-256 (FIPS 180-4), used only where crypto.subtle is missing. @param {Uint8Array} msg */
export function sha256Sync(msg) {
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const bitLen = msg.length * 8;
  const padded = new Uint8Array(((msg.length + 9 + 63) >> 6) << 6);
  padded.set(msg);
  padded[msg.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000));
  view.setUint32(padded.length - 4, bitLen >>> 0);
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < padded.length; off += 64) {
    for (let t = 0; t < 16; t += 1) w[t] = view.getUint32(off + t * 4);
    for (let t = 16; t < 64; t += 1) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let t = 0; t < 64; t += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[t] + w[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
  }
  const out = new Uint8Array(32);
  const ov = new DataView(out.buffer);
  for (let i = 0; i < 8; i += 1) ov.setUint32(i * 4, h[i]);
  return out;
}
