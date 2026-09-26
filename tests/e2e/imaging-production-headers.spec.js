// The Practical decodes compressed DICOM in a worker whose codecs are
// WebAssembly. `vite preview` sends no CSP, so every other spec ran without
// the production policy, and on production those codecs were refused: a
// JPEG 2000, JPEG-LS, HTJ2K or greyscale JPEG file opened to a black viewer
// reading "? × ? pixels" (2026-09-25). This spec serves dist/ with the headers
// vercel.json gives production and opens one file per codec.
import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { serveDist } from '../helpers/vercel-static.mjs';

const require = createRequire(import.meta.url);

function element(group, el, vr, value, undefinedLength = false) {
  const long = ['OB', 'OW', 'SQ', 'UN', 'UT'].includes(vr);
  const head = Buffer.alloc(long ? 12 : 8);
  head.writeUInt16LE(group, 0);
  head.writeUInt16LE(el, 2);
  head.write(vr, 4, 2, 'ascii');
  if (long) head.writeUInt32LE(undefinedLength ? 0xffffffff : value.length, 8);
  else head.writeUInt16LE(value.length, 6);
  return Buffer.concat([head, value]);
}
const even = (text, pad) => Buffer.from(text.length % 2 ? text + pad : text, 'latin1');
const us = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
const item = (el, data) => {
  const head = Buffer.alloc(8);
  head.writeUInt16LE(0xfffe, 0);
  head.writeUInt16LE(el, 2);
  head.writeUInt32LE(data.length, 4);
  return Buffer.concat([head, data]);
};

// 8-bit greyscale Secondary Capture; `frame` is native pixels or one encapsulated fragment.
function dicom(ts, size, frame, encapsulated) {
  const uid = `1.2.826.0.1.3680043.8.498.20260925.${size}`;
  const meta = Buffer.concat([
    element(0x0002, 0x0001, 'OB', Buffer.from([0, 1])),
    element(0x0002, 0x0002, 'UI', even('1.2.840.10008.5.1.4.1.1.7', '\0')),
    element(0x0002, 0x0003, 'UI', even(uid, '\0')),
    element(0x0002, 0x0010, 'UI', even(ts, '\0')),
  ]);
  const data = Buffer.from(frame.length % 2 ? [...frame, 0] : frame);
  const pixels = encapsulated
    ? Buffer.concat([element(0x7fe0, 0x0010, 'OB', Buffer.alloc(0), true), item(0xe000, Buffer.alloc(0)), item(0xe000, data), item(0xe0dd, Buffer.alloc(0))])
    : element(0x7fe0, 0x0010, 'OB', data);
  const metaLength = Buffer.alloc(4);
  metaLength.writeUInt32LE(meta.length);
  return Buffer.concat([
    Buffer.alloc(128), Buffer.from('DICM'), element(0x0002, 0x0000, 'UL', metaLength), meta,
    element(0x0008, 0x0016, 'UI', even('1.2.840.10008.5.1.4.1.1.7', '\0')),
    element(0x0008, 0x0018, 'UI', even(uid, '\0')),
    element(0x0028, 0x0002, 'US', us(1)),
    element(0x0028, 0x0004, 'CS', even('MONOCHROME2', ' ')),
    element(0x0028, 0x0010, 'US', us(size)),
    element(0x0028, 0x0011, 'US', us(size)),
    element(0x0028, 0x0100, 'US', us(8)),
    element(0x0028, 0x0101, 'US', us(8)),
    element(0x0028, 0x0102, 'US', us(7)),
    element(0x0028, 0x0103, 'US', us(0)),
    pixels,
  ]);
}

// The codecs' own encoders run here in Node, where no CSP applies.
async function encode(pkg, cls, pixels, size, setup) {
  const factory = require(pkg);
  const codec = await factory();
  const encoder = new codec[cls]();
  encoder.getDecodedBuffer({ width: size, height: size, bitsPerSample: 8, componentCount: 1, isSigned: false, isUsingColorTransform: false }).set(pixels);
  setup?.(encoder);
  encoder.encode();
  const out = encoder.getEncodedBuffer().slice();
  encoder.delete();
  return out;
}

// A distinct size per file, so each "N × N pixels" line names the file it decoded.
const CASES = [
  { name: 'explicit-le', size: 30, ts: '1.2.840.10008.1.2.1' },
  { name: 'jpeg-2000', size: 32, ts: '1.2.840.10008.1.2.4.90', codec: ['@cornerstonejs/codec-openjpeg/wasmjs', 'J2KEncoder'] },
  { name: 'jpeg-ls', size: 34, ts: '1.2.840.10008.1.2.4.80', codec: ['@cornerstonejs/codec-charls/wasmjs', 'JpegLSEncoder'] },
  { name: 'htj2k', size: 36, ts: '1.2.840.10008.1.2.4.201', codec: ['@cornerstonejs/codec-openjph/wasmjs', 'HTJ2KEncoder'] },
  { name: 'jpeg-baseline-grey', size: 38, ts: '1.2.840.10008.1.2.4.50', codec: ['@cornerstonejs/codec-libjpeg-turbo-8bit/wasmjs', 'JPEGEncoder'], setup: (e) => e.setQuality(95) },
];

test.describe('Practical Imaging under production headers', () => {
  let server;
  const files = [];
  // JPEG XL: Cornerstone 4.22 has no decoder for it, so the pixel bytes never matter.
  const unreadable = { name: 'jpeg-xl.dcm', mimeType: 'application/dicom', buffer: dicom('1.2.840.10008.1.2.4.110', 40, Uint8Array.from([1, 2, 3, 4]), true) };
  test.beforeAll(async () => {
    server = await serveDist();
    for (const c of CASES) {
      const pixels = Uint8Array.from({ length: c.size * c.size }, (_, i) => (i * 7) & 0xff);
      const frame = c.codec ? await encode(...c.codec, pixels, c.size, c.setup) : pixels;
      files.push({ name: `${c.name}.dcm`, mimeType: 'application/dicom', buffer: dicom(c.ts, c.size, frame, !!c.codec), size: c.size });
    }
  });
  test.afterAll(async () => { await server?.close(); });

  test('every codec decodes in the worker, the page cannot compile WebAssembly, and an unreadable file says so', async ({ page, context }) => {
    test.setTimeout(90_000);
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error?.message ?? error)));
    await context.addInitScript(() => {
      try {
        localStorage.setItem('vmx-selected-year', '4');
        localStorage.setItem('vmx-seen-landing', '1');
      } catch { /* storage blocked */ }
    });
    // Keep the optional public case list off the network, as connected-study does.
    await page.route(/\/rest\/v1\/imaging_cases(?:\?|$)/, (route) => {
      const headers = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info',
      };
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      return route.fulfill({ status: 200, contentType: 'application/json', headers, body: '[]' });
    });
    const workerResponse = page.waitForResponse(/\/assets\/decodeImageFrameWorker-[^/]+\.js$/);
    await page.goto(`${server.origin}/#lab`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: 'Practical Imaging Lab' })).toBeVisible();

    // The document keeps the strict policy: the exception belongs to the worker alone.
    const pageCompile = await page.evaluate(() => WebAssembly.compile(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]))
      .then(() => 'compiled', (error) => error.name));
    expect(pageCompile, 'the app document must not be able to compile WebAssembly').toBe('CompileError');

    const input = page.locator('input[type="file"][accept*="dcm"]');
    for (const pair of [files.slice(0, 2), files.slice(2, 4), files.slice(4)]) {
      if (!(await input.count())) await page.getByRole('button', { name: '← Back to drop zone' }).click();
      await input.setInputFiles(pair.map(({ size, ...file }) => file));
      for (const file of pair) {
        await expect(page.getByText(`${file.size} × ${file.size} pixels`), `${file.name} should decode`).toBeVisible({ timeout: 30_000 });
      }
    }
    const worker = await workerResponse;
    expect(worker.headers()['content-security-policy'], 'vercel.json must give the decode worker its own policy')
      .toMatch(/script-src 'self' 'wasm-unsafe-eval'/);
    expect(pageErrors).toEqual([]);

    // A load that yields no image must say so, not sit "ready" over a black
    // canvas. (Cornerstone leaves its own rejection unhandled, hence no page
    // error check after this point.)
    await page.getByRole('button', { name: '← Back to drop zone' }).click();
    await input.setInputFiles(unreadable);
    await expect(page.getByText('อ่านภาพในไฟล์นี้ไม่ได้')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('? × ? pixels')).toHaveCount(0);
  });
});
