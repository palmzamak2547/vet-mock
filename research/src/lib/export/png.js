// PNG chunk helpers shared by the figure download and the Word export: the physical resolution (pHYs, so
// Word and journals read the intended size) and the pixel size from IHDR. No dependency, so the Word
// writer can load it without the store. OWNER: report role.

let crcTable = null;
export function crc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];

/**
 * Put a pHYs chunk (pixels per metre, unit metre) right after IHDR, replacing any pHYs already there,
 * so Word and journals read the intended physical size.
 * @param {Uint8Array} png
 * @param {number} dpi
 * @returns {Uint8Array}
 */
export function setPngDpi(png, dpi) {
  if (!PNG_SIG.every((b, i) => png[i] === b)) throw new Error('not a PNG');
  const ppm = Math.round(dpi / 0.0254);
  const chunks = [];
  let off = 8;
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  while (off < png.length) {
    const len = view.getUint32(off);
    const type = String.fromCharCode(png[off + 4], png[off + 5], png[off + 6], png[off + 7]);
    chunks.push({ type, bytes: png.subarray(off, off + 12 + len) });
    off += 12 + len;
    if (type === 'IEND') break;
  }
  const phys = new Uint8Array(21);
  const pv = new DataView(phys.buffer);
  pv.setUint32(0, 9);
  phys.set([0x70, 0x48, 0x59, 0x73], 4); // 'pHYs'
  pv.setUint32(8, ppm);
  pv.setUint32(12, ppm);
  phys[16] = 1;
  pv.setUint32(17, crc32(phys.subarray(4, 17)));
  const parts = [new Uint8Array(PNG_SIG)];
  for (const c of chunks) {
    if (c.type === 'pHYs') continue;
    parts.push(c.bytes);
    if (c.type === 'IHDR') parts.push(phys);
  }
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

/** Read the dpi a PNG's pHYs chunk declares, or null. @param {Uint8Array} png */
export function readPngDpi(png) {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let off = 8;
  while (off + 8 <= png.length) {
    const len = view.getUint32(off);
    const type = String.fromCharCode(png[off + 4], png[off + 5], png[off + 6], png[off + 7]);
    if (type === 'pHYs' && png[off + 16] === 1) return Math.round(view.getUint32(off + 8) * 0.0254);
    if (type === 'IEND') break;
    off += 12 + len;
  }
  return null;
}

/** Width and height in pixels from the IHDR chunk, or null when the bytes are not a PNG. @param {Uint8Array} png */
export function readPngSize(png) {
  if (!png || png.length < 24 || !PNG_SIG.every((b, i) => png[i] === b)) return null;
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}
