// ============================================================
// pdf-export-geometry.test.mjs — exported ink lands where it was drawn
// ============================================================
// The reader authors a stroke in the frame pdf.js displays: the CropBox,
// turned by the page's /Rotate. The export used to stamp the ink raster at
// (0, 0) over the raw MediaBox, so on a rotated or cropped page (a scanned
// deck, slides exported sideways) a mark came back on another quarter of the
// page. The frame helper is pinned by number first; then the real export is
// rendered back with pdf.js and the red dot is looked for where it was drawn.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { exportAnnotatedPdf, inkFrame } from '../../src/lib/pdf-export.js';
import { drawStroke } from '../../src/lib/ink.js';

const paint = (ctx, strokes, w, h, scale) => { for (const s of strokes) drawStroke(ctx, s, w, h, scale); };
const dot = (x, y) => ({ id: `dot-${x}-${y}`, mode: 'pen', color: '#ff0000', size: 5, points: [[x, y]] });

// ── the frame, pinned by number ──────────────────────────────────────

test('an unrotated, uncropped page keeps its ink where it was', () => {
  const f = inkFrame({ mediaBox: { x: 0, y: 0, width: 600, height: 800 }, cropBox: null, rotate: 0 });
  assert.deepEqual(f, { rotation: 0, width: 600, height: 800, x: 0, y: 0 });
});

test('a rotated page turns the raster back onto the box, anchored corner by corner', () => {
  const mediaBox = { x: 0, y: 0, width: 600, height: 800 };
  assert.deepEqual(inkFrame({ mediaBox, cropBox: null, rotate: 90 }),
    { rotation: 90, width: 800, height: 600, x: 600, y: 0 });
  assert.deepEqual(inkFrame({ mediaBox, cropBox: null, rotate: 180 }),
    { rotation: 180, width: 600, height: 800, x: 600, y: 800 });
  assert.deepEqual(inkFrame({ mediaBox, cropBox: null, rotate: 270 }),
    { rotation: 270, width: 800, height: 600, x: 0, y: 800 });
});

test('the frame is the crop box, and a crop offset moves the anchor with it', () => {
  const mediaBox = { x: 0, y: 0, width: 600, height: 800 };
  const cropBox = { x: 100, y: 200, width: 300, height: 300 };
  assert.deepEqual(inkFrame({ mediaBox, cropBox, rotate: 0 }),
    { rotation: 0, width: 300, height: 300, x: 100, y: 200 });
  assert.deepEqual(inkFrame({ mediaBox, cropBox, rotate: 90 }),
    { rotation: 90, width: 300, height: 300, x: 400, y: 200 });
});

test('the frame follows pdf.js on the odd cases', () => {
  const mediaBox = { x: 0, y: 0, width: 600, height: 800 };
  // A crop box that spills past the media box is clipped to it …
  assert.deepEqual(inkFrame({ mediaBox, cropBox: { x: -50, y: 700, width: 200, height: 300 }, rotate: 0 }),
    { rotation: 0, width: 150, height: 100, x: 0, y: 700 });
  // … one that misses it entirely is ignored …
  assert.deepEqual(inkFrame({ mediaBox, cropBox: { x: 900, y: 900, width: 10, height: 10 }, rotate: 0 }),
    { rotation: 0, width: 600, height: 800, x: 0, y: 0 });
  // … a negative angle wraps, one that is not a multiple of 90 counts as 0 …
  assert.equal(inkFrame({ mediaBox, cropBox: null, rotate: -90 }).rotation, 270);
  assert.equal(inkFrame({ mediaBox, cropBox: null, rotate: 45 }).rotation, 0);
  // … and a box written upper-right corner first reads the way pdf.js reads it.
  assert.deepEqual(inkFrame({ mediaBox: { x: 600, y: 800, width: -600, height: -800 }, cropBox: null, rotate: 0 }),
    { rotation: 0, width: 600, height: 800, x: 0, y: 0 });
});

// ── the export, rendered back and measured ───────────────────────────

// pdf.js and @napi-rs/canvas render the exported page exactly as the reader
// would show it. The canvas package is pdf.js's own optional dependency; a
// checkout without it keeps the frame pins above and skips the pixels.
async function canvasLib() {
  try { return await import('@napi-rs/canvas'); } catch { return null; }
}

// The export draws its raster on a DOM canvas; hand it the node one.
async function withCanvasDocument(createCanvas, fn) {
  const had = Object.getOwnPropertyDescriptor(globalThis, 'document');
  globalThis.document = { createElement: (name) => { assert.equal(name, 'canvas'); return createCanvas(1, 1); } };
  try { return await fn(); } finally {
    if (had) Object.defineProperty(globalThis, 'document', had); else delete globalThis.document;
  }
}

async function fixture({ rotate = 0, crop = null, size = [600, 800] } = {}) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const page = pdf.addPage(size);
  if (rotate) page.setRotation(degrees(rotate));
  if (crop) page.setCropBox(...crop);
  // Inside every crop box used below, so it is on the displayed page.
  page.drawText('Zoonosis', { x: 150, y: 250, size: 14, font });
  return pdf.save();
}

// Where the red ink sits in the frame pdf.js displays for the page, as the
// reader's own normalised coordinates, plus what else the page still says.
async function measure(bytes, pageNo, createCanvas) {
  // pdf.js takes the buffer it is handed (the reader re-reads its bytes for
  // export for the same reason), so it gets a copy.
  const doc = await getDocument({ data: new Uint8Array(bytes) }).promise;
  const page = await doc.getPage(pageNo);
  const viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, canvas, viewport }).promise;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let n = 0; let sx = 0; let sy = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 180 && data[i + 1] < 80 && data[i + 2] < 80 && data[i + 3] > 200) {
      n += 1; sx += (i / 4) % canvas.width; sy += Math.floor(i / 4 / canvas.width);
    }
  }
  const text = (await page.getTextContent()).items.map((it) => it.str).join('');
  const out = { n, x: sx / n / canvas.width, y: sy / n / canvas.height, width: viewport.width, height: viewport.height, text, numPages: doc.numPages };
  await doc.destroy();
  return out;
}

const near = (seen, x, y) => Math.hypot(seen.x - x, seen.y - y) < 0.01;

const FIXTURES = [
  { name: 'plain', rotate: 0 },
  { name: 'rotated 90', rotate: 90 },
  { name: 'rotated 180', rotate: 180 },
  { name: 'rotated 270', rotate: 270 },
  { name: 'rotated -90', rotate: -90 },
  { name: 'cropped', crop: [100, 200, 400, 500] },
  { name: 'cropped and rotated 90', rotate: 90, crop: [100, 200, 400, 500] },
];

for (const fx of FIXTURES) {
  test(`ink exported from a ${fx.name} page covers the content it was drawn over`, async (t) => {
    const lib = await canvasLib();
    if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
    const original = await fixture(fx);
    const before = await measure(original, 1, lib.createCanvas);
    const blob = await withCanvasDocument(lib.createCanvas, () => exportAnnotatedPdf({
      bytes: original, strokesByPage: { 1: [dot(0.25, 0.25)] }, paint,
    }));
    const exported = new Uint8Array(await blob.arrayBuffer());
    const seen = await measure(exported, 1, lib.createCanvas);
    assert.ok(seen.n > 0, 'no red ink was found on the exported page at all');
    assert.ok(near(seen, 0.25, 0.25), `the dot moved to (${seen.x.toFixed(3)}, ${seen.y.toFixed(3)})`);
    // The page itself is untouched: same displayed frame, same words.
    assert.deepEqual([seen.width, seen.height], [before.width, before.height], 'the export changed the displayed page size');
    assert.ok(seen.text.includes('Zoonosis'), 'the text layer did not survive the export');
    const kept = await PDFDocument.load(exported);
    const was = await PDFDocument.load(original);
    assert.deepEqual(kept.getPage(0).getMediaBox(), was.getPage(0).getMediaBox());
    assert.deepEqual(kept.getPage(0).getCropBox(), was.getPage(0).getCropBox());
    assert.equal(kept.getPage(0).getRotation().angle, was.getPage(0).getRotation().angle, 'the export rewrote /Rotate');
  });
}

test('pages of different sizes each get their own frame, and annotated-only keeps only the inked ones', async (t) => {
  const lib = await canvasLib();
  if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
  const pdf = await PDFDocument.create();
  pdf.addPage([600, 800]).setRotation(degrees(90));
  pdf.addPage([400, 300]);
  pdf.addPage([500, 500]);
  const original = await pdf.save();
  const blob = await withCanvasDocument(lib.createCanvas, () => exportAnnotatedPdf({
    bytes: original, paint, annotatedOnly: true,
    strokesByPage: { 1: [dot(0.25, 0.25)], 2: [dot(0.8, 0.6)] },
  }));
  const exported = new Uint8Array(await blob.arrayBuffer());
  const first = await measure(exported, 1, lib.createCanvas);
  assert.equal(first.numPages, 2, 'the page without ink should have been dropped');
  assert.deepEqual([first.width, first.height], [800, 600], 'the turned page lost its displayed proportions');
  assert.ok(near(first, 0.25, 0.25), `page 1's dot moved to (${first.x.toFixed(3)}, ${first.y.toFixed(3)})`);
  const second = await measure(exported, 2, lib.createCanvas);
  assert.deepEqual([second.width, second.height], [400, 300]);
  assert.ok(near(second, 0.8, 0.6), `page 2's dot moved to (${second.x.toFixed(3)}, ${second.y.toFixed(3)})`);
});

// ── the raster is encoded without holding the page ───────────────────
// toDataURL encodes the PNG on the main thread and then base64s it, once per
// inked page, and the reader cannot respond while it does. toBlob hands the
// same encode to the browser; what reaches the PDF must not change.

// Every canvas the export makes, with a count of the synchronous encodes.
function countingCanvas(createCanvas, { withoutToBlob = false, blob = null } = {}) {
  const seen = { toDataURL: 0, toBlob: 0 };
  const make = (w, h) => {
    const c = createCanvas(w, h);
    const sync = c.toDataURL.bind(c);
    c.toDataURL = (...args) => { seen.toDataURL += 1; return sync(...args); };
    if (withoutToBlob) {
      c.toBlob = undefined;
    } else if (blob) {
      // A browser whose toBlob answers, but not with anything readable.
      c.toBlob = (cb) => { seen.toBlob += 1; setImmediate(() => cb(blob())); };
    } else {
      const async = c.toBlob.bind(c);
      c.toBlob = (...args) => { seen.toBlob += 1; return async(...args); };
    }
    return c;
  };
  return { seen, make };
}

// The whole rendered page, pixel for pixel.
async function pixels(bytes, pageNo, createCanvas) {
  const doc = await getDocument({ data: new Uint8Array(bytes) }).promise;
  const page = await doc.getPage(pageNo);
  const viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, canvas, viewport }).promise;
  const data = Buffer.from(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  await doc.destroy();
  return data;
}

const INK = {
  1: [dot(0.25, 0.25), { id: 'line', mode: 'pen', color: '#1a3c8c', size: 3, points: [[0.1, 0.6], [0.5, 0.65], [0.9, 0.55]] }],
  2: [{ id: 'hl', mode: 'highlighter', color: 'rgb(255,214,0)', size: 3, points: [[0.2, 0.3], [0.7, 0.3]] }],
};

test('an inked page is encoded through toBlob, never the synchronous toDataURL', async (t) => {
  const lib = await canvasLib();
  if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
  const pdf = await PDFDocument.create();
  pdf.addPage([600, 800]);
  pdf.addPage([720, 540]);
  const original = await pdf.save();
  const { seen, make } = countingCanvas(lib.createCanvas);
  await withCanvasDocument(make, () => exportAnnotatedPdf({ bytes: original, strokesByPage: INK, paint }));
  assert.equal(seen.toDataURL, 0, `the export encoded ${seen.toDataURL} page(s) synchronously on the main thread`);
  assert.equal(seen.toBlob, 2, 'each inked page is encoded once');
});

test('the exported pages are pixel-identical to the synchronous encode', async (t) => {
  const lib = await canvasLib();
  if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
  const pdf = await PDFDocument.create();
  pdf.addPage([600, 800]).setRotation(degrees(90));
  pdf.addPage([720, 540]);
  const original = await pdf.save();
  const oldWay = countingCanvas(lib.createCanvas, { withoutToBlob: true });
  const before = await withCanvasDocument(oldWay.make, () => exportAnnotatedPdf({ bytes: original, strokesByPage: INK, paint }));
  assert.equal(oldWay.seen.toDataURL, 2, 'a canvas without toBlob still exports, the way it always did');
  const newWay = countingCanvas(lib.createCanvas);
  const after = await withCanvasDocument(newWay.make, () => exportAnnotatedPdf({ bytes: original, strokesByPage: INK, paint }));
  assert.deepEqual(newWay.seen, { toDataURL: 0, toBlob: 2 }, 'the comparison did not go through toBlob');
  for (const pageNo of [1, 2]) {
    const a = await pixels(new Uint8Array(await before.arrayBuffer()), pageNo, lib.createCanvas);
    const b = await pixels(new Uint8Array(await after.arrayBuffer()), pageNo, lib.createCanvas);
    assert.equal(a.length, b.length);
    assert.ok(a.equals(b), `page ${pageNo} renders differently once encoded through toBlob`);
  }
});

test('a toBlob that answers with nothing usable falls back to the old encode instead of failing or hanging', async (t) => {
  const lib = await canvasLib();
  if (!lib) { t.skip('@napi-rs/canvas is not installed on this checkout'); return; }
  const original = await fixture();
  const expected = await measure(await (await withCanvasDocument(countingCanvas(lib.createCanvas, { withoutToBlob: true }).make,
    () => exportAnnotatedPdf({ bytes: original, strokesByPage: { 1: [dot(0.25, 0.25)] }, paint }))).arrayBuffer(), 1, lib.createCanvas);
  const answers = {
    'no blob': () => null,
    'a blob that cannot be read': () => ({ size: 1 }),
    'a blob whose read fails': () => ({ size: 1, arrayBuffer: () => Promise.reject(new Error('NotReadableError')) }),
  };
  for (const [name, blob] of Object.entries(answers)) {
    const { seen, make } = countingCanvas(lib.createCanvas, { blob });
    const out = await withCanvasDocument(make, () => exportAnnotatedPdf({ bytes: original, strokesByPage: { 1: [dot(0.25, 0.25)] }, paint }));
    assert.deepEqual(seen, { toDataURL: 1, toBlob: 1 }, `${name}: the export did not fall back once`);
    const seenPage = await measure(new Uint8Array(await out.arrayBuffer()), 1, lib.createCanvas);
    assert.ok(seenPage.n > 0 && near(seenPage, expected.x, expected.y), `${name}: the ink did not survive the fallback`);
  }
});
