// The TIFF writer [M2-DESIGN.md 8.3]: 8-bit RGB, LZW, resolution in pixels per inch. Pinned by decoding
// every file with a reader written here from the TIFF 6.0 specification (Adobe 1992: section 2 file
// structure, section 13 LZW with the code widths libtiff reads, section 14 horizontal differencing), not
// from the writer's code, and once with Pillow 12.2.0 (graphs role notes, 28 Sep 2026: five sizes from 1 x 1
// to 640 x 400, mode RGB, compression tiff_lzw, dpi as written, pixels byte-equal).
// OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeTiff, lzwEncode } from '../../src/lib/export/tiff.js';

/** TIFF LZW decoder (spec section 13): codes MSB first, 9 bits, widening one code early, Clear 256, EOI 257. */
function lzwDecode(bytes) {
  const out = [];
  let bitPos = 0;
  let width = 9;
  let table = [];
  const reset = () => { table = []; for (let i = 0; i < 256; i += 1) table.push([i]); table.push(null, null); width = 9; };
  reset();
  const read = () => {
    let v = 0;
    for (let i = 0; i < width; i += 1) {
      const byte = bytes[(bitPos + i) >> 3];
      if (byte === undefined) return 257;
      v = (v << 1) | ((byte >> (7 - ((bitPos + i) & 7))) & 1);
    }
    bitPos += width;
    return v;
  };
  let prev = null;
  for (;;) {
    const code = read();
    if (code === 257) break;
    if (code === 256) { reset(); prev = null; continue; }
    let entry;
    if (prev === null) entry = table[code];
    else {
      if (code < table.length) {
        entry = table[code];
        table.push([...table[prev], entry[0]]);
      } else {
        entry = [...table[prev], table[prev][0]];
        table.push(entry);
      }
    }
    out.push(...entry);
    prev = code;
    if (table.length + 1 >= (1 << width) && width < 12) width += 1;
  }
  return Uint8Array.from(out);
}

/** Read a baseline little-endian TIFF: tags, then the RGB pixels (undoing Predictor 2). */
function readTiff(buf) {
  const v = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  assert.equal(String.fromCharCode(buf[0], buf[1]), 'II');
  assert.equal(v.getUint16(2, true), 42);
  const ifd = v.getUint32(4, true);
  const count = v.getUint16(ifd, true);
  const tags = {};
  const SIZE = { 3: 2, 4: 4, 5: 8 };
  let last = 0;
  for (let i = 0; i < count; i += 1) {
    const e = ifd + 2 + i * 12;
    const tag = v.getUint16(e, true);
    assert.ok(tag > last, 'tags in ascending order');
    last = tag;
    const type = v.getUint16(e + 2, true);
    const n = v.getUint32(e + 4, true);
    const inline = SIZE[type] * n <= 4;
    const at = inline ? e + 8 : v.getUint32(e + 8, true);
    const vals = [];
    for (let k = 0; k < n; k += 1) {
      if (type === 3) vals.push(v.getUint16(at + k * 2, true));
      else if (type === 4) vals.push(v.getUint32(at + k * 4, true));
      else if (type === 5) vals.push(v.getUint32(at + k * 8, true) / v.getUint32(at + k * 8 + 4, true));
    }
    tags[tag] = vals;
  }
  assert.equal(v.getUint32(ifd + 2 + count * 12, true), 0, 'one image');
  const width = tags[256][0];
  const height = tags[257][0];
  const rps = tags[278][0];
  const rgb = new Uint8Array(width * height * 3);
  let row = 0;
  tags[273].forEach((off, s) => {
    const strip = lzwDecode(buf.subarray(off, off + tags[279][s]));
    const rows = Math.min(rps, height - row);
    assert.equal(strip.length, rows * width * 3, `strip ${s} length`);
    for (let r = 0; r < rows; r += 1) {
      for (let x = 0; x < width; x += 1) {
        for (let c = 0; c < 3; c += 1) {
          const i = (r * width + x) * 3 + c;
          const left = x ? strip[i - 3] : 0;
          if (tags[317]?.[0] === 2) strip[i] = (strip[i] + left) & 0xff;
          rgb[((row + r) * width + x) * 3 + c] = strip[i];
        }
      }
    }
    row += rows;
  });
  return { tags, width, height, rgb };
}

function image(w, h, seed) {
  const a = new Uint8ClampedArray(w * h * 4);
  let s = seed >>> 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      const i = (y * w + x) * 4;
      a[i] = (x * 3 + y) & 255;
      a[i + 1] = (s >>> 16) & 255;
      a[i + 2] = ((x ^ y) * 7) & 255;
      a[i + 3] = 255;
    }
  }
  return a;
}

const rgbOf = (rgba) => Uint8Array.from(rgba.filter((_v, i) => i % 4 !== 3));

test('RGB pixels survive the round trip, for tiny, odd, multi-strip and table-resetting images', () => {
  for (const [w, h, dpi] of [[1, 1, 300], [3, 2, 600], [97, 61, 300], [640, 400, 600], [1000, 30, 300]]) {
    const px = image(w, h, w * 31 + h);
    const t = readTiff(encodeTiff(px, w, h, dpi));
    assert.equal(t.width, w);
    assert.equal(t.height, h);
    assert.deepEqual(t.rgb, rgbOf(px), `${w} x ${h}`);
  }
});

test('the tags say 8-bit RGB, LZW, horizontal differencing and the dpi in pixels per inch', () => {
  for (const dpi of [300, 600]) {
    const t = readTiff(encodeTiff(image(50, 40, 7), 50, 40, dpi));
    assert.deepEqual(t.tags[258], [8, 8, 8], 'BitsPerSample');
    assert.deepEqual(t.tags[259], [5], 'Compression LZW');
    assert.deepEqual(t.tags[262], [2], 'Photometric RGB');
    assert.deepEqual(t.tags[277], [3], 'SamplesPerPixel');
    assert.deepEqual(t.tags[284], [1], 'PlanarConfiguration chunky');
    assert.deepEqual(t.tags[296], [2], 'ResolutionUnit inch');
    assert.deepEqual(t.tags[317], [2], 'Predictor horizontal');
    assert.equal(t.tags[282][0], dpi, 'XResolution');
    assert.equal(t.tags[283][0], dpi, 'YResolution');
  }
});

test('LZW compresses a flat figure and handles long runs past the 4094-entry table', () => {
  const white = new Uint8ClampedArray(800 * 600 * 4).fill(255);
  const file = encodeTiff(white, 800, 600, 300);
  assert.ok(file.length < 800 * 600 * 3 / 20, `a blank page compresses (${file.length} bytes)`);
  assert.deepEqual(readTiff(file).rgb, rgbOf(white));
  for (const len of [0, 1, 2, 300, 5000, 70000]) {
    const data = Uint8Array.from({ length: len }, (_v, i) => (i * 7919) % 251);
    assert.deepEqual(lzwDecode(lzwEncode(data)), data, `length ${len}`);
  }
});

test('an image smaller than its size, or of no size, is refused', () => {
  assert.throws(() => encodeTiff(new Uint8ClampedArray(4), 2, 2, 300));
  assert.throws(() => encodeTiff(new Uint8ClampedArray(0), 0, 0, 300));
});
