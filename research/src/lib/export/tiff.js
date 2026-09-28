// TIFF writer for figures: 8-bit RGB, LZW compression, XResolution and YResolution in pixels per inch, so a
// journal reads the dpi the student chose [M2-DESIGN.md 8.3]. Loaded lazily (only when the TIFF button is
// pressed). Own encoder, no dependency: TIFF 6.0 (Adobe 1992) with LZW (section 13, the "early change"
// code widths libtiff reads) and horizontal differencing (Predictor 2, section 14), little-endian, one
// image, strips of about 8 KB. The alpha channel is dropped (the rasteriser paints on white first).
// Pinned by tests/unit/graphs-tiff.test.mjs with a small reader written from the specification, and once
// with Pillow 12.2.0 (notes of the graphs role).
// OWNER: graphs role.

const CLEAR = 256;
const EOI = 257;

/**
 * TIFF LZW of one strip: MSB-first codes, 9 to 12 bits, Clear first and whenever the table fills.
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
export function lzwEncode(data) {
  const out = [];
  let acc = 0;
  let nacc = 0;
  let width = 9;
  const put = (code) => {
    acc = (acc << width) | code;
    nacc += width;
    while (nacc >= 8) {
      nacc -= 8;
      out.push((acc >>> nacc) & 0xff);
    }
    acc &= (1 << nacc) - 1;
  };
  let dict = new Map();
  let next = 258;
  put(CLEAR);
  if (!data.length) {
    put(EOI);
    if (nacc > 0) out.push((acc << (8 - nacc)) & 0xff);
    return Uint8Array.from(out);
  }
  let w = data[0];
  for (let i = 1; i < data.length; i += 1) {
    const k = data[i];
    const key = w * 256 + k;
    const hit = dict.get(key);
    if (hit !== undefined) {
      w = hit;
      continue;
    }
    put(w);
    dict.set(key, next);
    next += 1;
    if (next === 4094) {
      put(CLEAR);
      dict = new Map();
      next = 258;
      width = 9;
    } else if (next > (1 << width) - 1 && width < 12) {
      width += 1;
    }
    w = k;
  }
  put(w);
  // The decoder adds one more entry on reading w, so the EOI goes at the width it will then expect
  // (libtiff LZWPostEncode): a full table gets a Clear first, as inside the loop.
  if (next + 1 === 4094) {
    put(CLEAR);
    width = 9;
  } else if (next + 1 > (1 << width) - 1 && width < 12) {
    width += 1;
  }
  put(EOI);
  if (nacc > 0) out.push((acc << (8 - nacc)) & 0xff);
  return Uint8Array.from(out);
}

/**
 * @param {Uint8ClampedArray} rgba
 * @param {number} width
 * @param {number} height
 * @param {number} dpi
 * @returns {Uint8Array}
 */
export function encodeTiff(rgba, width, height, dpi) {
  if (!(width > 0) || !(height > 0) || rgba.length < width * height * 4) throw new Error('tiff: bad image size');
  const rowBytes = width * 3;
  const rowsPerStrip = Math.max(1, Math.floor(8192 / rowBytes));
  const strips = [];
  for (let y0 = 0; y0 < height; y0 += rowsPerStrip) {
    const rows = Math.min(rowsPerStrip, height - y0);
    const raw = new Uint8Array(rows * rowBytes);
    for (let r = 0; r < rows; r += 1) {
      const src = (y0 + r) * width * 4;
      const dst = r * rowBytes;
      let pr = 0;
      let pg = 0;
      let pb = 0;
      for (let x = 0; x < width; x += 1) {
        const R = rgba[src + x * 4];
        const G = rgba[src + x * 4 + 1];
        const B = rgba[src + x * 4 + 2];
        // Predictor 2: each sample minus the same sample of the pixel to its left
        raw[dst + x * 3] = (R - pr) & 0xff;
        raw[dst + x * 3 + 1] = (G - pg) & 0xff;
        raw[dst + x * 3 + 2] = (B - pb) & 0xff;
        pr = R;
        pg = G;
        pb = B;
      }
    }
    strips.push(lzwEncode(raw));
  }
  const n = strips.length;
  const tags = [
    [256, 4, 1, width],
    [257, 4, 1, height],
    [258, 3, 3, 'bps'],
    [259, 3, 1, 5],
    [262, 3, 1, 2],
    [273, 4, n, 'offsets'],
    [277, 3, 1, 3],
    [278, 4, 1, rowsPerStrip],
    [279, 4, n, 'counts'],
    [282, 5, 1, 'xres'],
    [283, 5, 1, 'yres'],
    [284, 3, 1, 1],
    [296, 3, 1, 2],
    [317, 3, 1, 2],
  ];
  const ifdOffset = 8;
  const ifdSize = 2 + tags.length * 12 + 4;
  let extra = ifdOffset + ifdSize;
  const place = (bytes) => {
    const at = extra;
    extra += bytes + (bytes % 2);
    return at;
  };
  const bpsAt = place(6);
  const xresAt = place(8);
  const yresAt = place(8);
  const offAt = n > 1 ? place(4 * n) : null;
  const cntAt = n > 1 ? place(4 * n) : null;
  const dataStart = extra;
  const stripOffsets = [];
  let pos = dataStart;
  for (const s of strips) {
    stripOffsets.push(pos);
    pos += s.length;
  }
  const total = pos;
  const buf = new Uint8Array(total);
  const v = new DataView(buf.buffer);
  buf[0] = 0x49;
  buf[1] = 0x49;
  v.setUint16(2, 42, true);
  v.setUint32(4, ifdOffset, true);
  v.setUint16(ifdOffset, tags.length, true);
  const dpiNum = Math.round(dpi * 10000);
  tags.forEach(([tag, type, count, val], i) => {
    const e = ifdOffset + 2 + i * 12;
    v.setUint16(e, tag, true);
    v.setUint16(e + 2, type, true);
    v.setUint32(e + 4, count, true);
    let value = val;
    if (val === 'bps') value = bpsAt;
    else if (val === 'xres') value = xresAt;
    else if (val === 'yres') value = yresAt;
    else if (val === 'offsets') value = n > 1 ? offAt : stripOffsets[0];
    else if (val === 'counts') value = n > 1 ? cntAt : strips[0].length;
    if (type === 3 && count === 1) v.setUint16(e + 8, value, true);
    else v.setUint32(e + 8, value, true);
  });
  v.setUint32(ifdOffset + 2 + tags.length * 12, 0, true);
  for (let k = 0; k < 3; k += 1) v.setUint16(bpsAt + k * 2, 8, true);
  v.setUint32(xresAt, dpiNum, true);
  v.setUint32(xresAt + 4, 10000, true);
  v.setUint32(yresAt, dpiNum, true);
  v.setUint32(yresAt + 4, 10000, true);
  if (n > 1) {
    stripOffsets.forEach((o, k) => v.setUint32(offAt + k * 4, o, true));
    strips.forEach((s, k) => v.setUint32(cntAt + k * 4, s.length, true));
  }
  strips.forEach((s, k) => buf.set(s, stripOffsets[k]));
  return buf;
}
