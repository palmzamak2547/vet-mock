// ============================================================
// pdf-reader-perf.test.mjs — the reader does each expensive thing once
// ============================================================
// Opening a personal PDF read the whole file twice: once to fingerprint it
// (the key its ink is filed under) and once more for pdf.js, so a 50 MB deck
// held two copies of itself at the peak of the open. One read now serves
// both. The order is load-bearing: pdf.js transfers the buffer it is given to
// its worker, which leaves this side's copy empty, and a fingerprint taken
// after that would be the fingerprint of nothing, shared by every file.
//
// The reader's real callback is cut from the source and run under vm, the
// way pdf-reader-races.test.mjs does it.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { hashFile } from '../../src/lib/pdf-annotations.js';

const VIEW = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(src, start, end) {
  const a = src.indexOf(start);
  assert.notEqual(a, -1, `the source must still contain ${JSON.stringify(start)}`);
  const b = src.indexOf(end, a);
  assert.notEqual(b, -1, `the source must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return src.slice(a + start.length, b);
}

const tick = () => new Promise((r) => setImmediate(r));

// Bytes that look like the start of a PDF and differ per call.
let serial = 0;
function pdfBytes(size = 4096) {
  serial += 1;
  const out = new Uint8Array(size);
  out.set(new TextEncoder().encode(`%PDF-1.7\n% deck ${serial}\n`));
  for (let i = 32; i < size; i++) out[i] = (i * 31 + serial) & 0xff;
  return out;
}

// A File as the file picker hands one over, counting how often it is read.
function pickedFile(bytes, name = 'deck.pdf') {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const file = {
    name, type: 'application/pdf', size: blob.size, lastModified: 1, reads: 0,
    arrayBuffer: async () => { file.reads += 1; return blob.arrayBuffer(); },
  };
  return file;
}

// What pdf.js does with the buffer it is given: transfer it to the worker.
function transferAway(buf) {
  structuredClone(buf, { transfer: [buf] });
}

// ── opening a personal file ──────────────────────────────────────────

function localOpen() {
  const state = { order: [], handedBytes: null, Error: null, PdfDoc: null };
  const ctx = {
    console: { error() {} },
    ownerId: null,
    sourceRef: { current: null },
    resumeTo: { current: 0 },
    currentStrokesRef: { current: [] },
    loadGenRef: { current: 0 },
    pendingTaskRef: { current: null },
    pendingAbortRef: { current: null },
    useCallback: (fn) => fn,
    SIZE_WARN_MB: 30,
    SIZE_HARD_MB: 60,
    // The real fingerprint, so the key the ink is filed under is checked too.
    hashFile: async (...args) => { const h = await hashFile(...args); state.order.push('hash'); return h; },
    loadPdfjs: async () => ({
      getDocument: ({ data }) => {
        state.order.push('getDocument');
        state.handedBytes = data.byteLength;
        transferAway(data.buffer ?? data);
        return { promise: Promise.resolve({ numPages: 3, destroy: async () => {} }) };
      },
    }),
    loadAnnotations: async () => null,
    pullAndMerge: async () => null,
    loadLegacyAnnotations: async () => null,
    saveAnnotations: async () => ({ ok: true }),
    refreshRecent() {},
    storageHealth: () => ({ persistent: true }),
    showToast() {},
    thaiError: (e) => String(e?.message || e),
  };
  for (const s of ['Error', 'DownloadProgress', 'Loading', 'LoadingMsg', 'LegacyAvailable', 'Deleted', 'FileHash', 'FileName', 'PageCount', 'StrokesByPage', 'CurrentPage', 'PdfDoc']) {
    ctx[`set${s}`] = (v) => { state[s] = v; };
  }
  vm.createContext(ctx);
  ctx.supersedeOpen = vm.runInContext(`(${cut(VIEW, 'const supersedeOpen = useCallback(', '\n  }, []);')}\n  })`, ctx);
  const ingestFile = vm.runInContext(`(${cut(VIEW, 'const ingestFile = useCallback(', '\n  }, [showToast, refreshRecent]);')}\n  })`, ctx);
  return { state, ctx, ingestFile };
}

test('a personal PDF is read from disk once to open it, and filed under its real fingerprint', async () => {
  const bytes = pdfBytes(64 * 1024);
  const file = pickedFile(bytes);
  const r = localOpen();
  await r.ingestFile(file);
  assert.equal(r.state.Error, null, `the open failed: ${r.state.Error}`);
  assert.ok(r.state.PdfDoc, 'the document never reached the screen');
  assert.equal(file.reads, 1, `the file was read ${file.reads} times to open it`);
  assert.equal(r.state.handedBytes, bytes.length, 'pdf.js was not given the whole file');
  const expected = await hashFile(new Blob([bytes]));
  assert.equal(r.state.FileHash, expected, 'the ink would be filed under a different key from the one it always had');
  assert.deepEqual(r.state.order, ['hash', 'getDocument'],
    'the fingerprint must be taken before pdf.js takes the buffer over to its worker');
  // Export reads the File again rather than the buffer pdf.js now owns.
  assert.equal(r.ctx.sourceRef.current?.kind, 'file');
  assert.equal(r.ctx.sourceRef.current?.file, file);
});

test('two different files never share a fingerprint because a buffer was already taken', async () => {
  const seen = new Set();
  for (let i = 0; i < 3; i++) {
    const r = localOpen();
    await r.ingestFile(pickedFile(pdfBytes(8192 + i)));
    assert.equal(r.state.Error, null);
    seen.add(r.state.FileHash);
  }
  assert.equal(seen.size, 3, 'different files were filed under one key');
});

test('hashFile digests the bytes it is handed instead of reading the file again', async () => {
  const bytes = pdfBytes();
  const expected = await hashFile(new Blob([bytes]));
  const file = pickedFile(bytes);
  const buf = await new Blob([bytes]).arrayBuffer();
  assert.equal(await hashFile(file, buf), expected);
  assert.equal(file.reads, 0, 'the file was read again although its bytes were handed over');
  assert.equal(await hashFile(file, new Uint8Array(buf)), expected, 'a view over the same bytes digests the same');
  assert.equal(await hashFile(file), expected, 'the one-argument form changed');
  assert.equal(file.reads, 1);
});

test('hashFile reads the file itself when the bytes it was handed are no longer the whole file', async () => {
  const bytes = pdfBytes();
  const expected = await hashFile(new Blob([bytes]));
  const file = pickedFile(bytes);
  const taken = await new Blob([bytes]).arrayBuffer();
  transferAway(taken);
  assert.equal(taken.byteLength, 0);
  assert.equal(await hashFile(file, taken), expected, 'an emptied buffer was fingerprinted as if it were the file');
  assert.equal(file.reads, 1);
  const partial = (await new Blob([bytes]).arrayBuffer()).slice(0, 100);
  assert.equal(await hashFile(pickedFile(bytes), partial), expected, 'a partial buffer was fingerprinted as if it were the file');
  assert.notEqual(expected, await hashFile(new Blob([])), 'the test bytes must not digest like nothing');
});

// ── a page's size at every zoom ──────────────────────────────────────
// Each row of the reader used to learn its size from an effect keyed on the
// scale: every zoom step sent every page back to pdf.js, and until that
// answered the row kept its old height under the new scale. The zoom anchor
// then had to wait for a column of rows to resize a tick after the zoom. The
// size at a scale is getViewport's arithmetic on a page pdf.js has already
// answered with, so it is known in the same render as the scale.
//
// The row's own hook code is cut from PdfPage.jsx and run under a small hooks
// runtime (state, refs, memo, effects flushed after each render), against
// real pdf.js pages. Nothing here has a DOM, so the raster never paints; what
// is measured is the height the row reserves, which is what the column, the
// zoom anchor and jump-to-page all read.

const PAGE_SRC = readFileSync(new URL('../../src/components/PdfPage.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function hooksRuntime() {
  const slots = [];
  let cursor = 0;
  let queue = [];
  const rt = { dirty: false };
  const same = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  rt.api = {
    useRef(init = null) { const k = cursor++; if (!slots[k]) slots[k] = { current: init }; return slots[k]; },
    useState(init) {
      const k = cursor++;
      if (!slots[k]) slots[k] = { value: typeof init === 'function' ? init() : init };
      const slot = slots[k];
      return [slot.value, (next) => {
        const v = typeof next === 'function' ? next(slot.value) : next;
        if (!Object.is(v, slot.value)) { slot.value = v; rt.dirty = true; }
      }];
    },
    useMemo(fn, deps) {
      const k = cursor++;
      if (slots[k] && same(slots[k].deps, deps)) return slots[k].value;
      slots[k] = { deps, value: fn() };
      return slots[k].value;
    },
    useCallback(fn, deps) { return rt.api.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const k = cursor++;
      const prev = slots[k];
      if (prev && deps && same(prev.deps, deps)) return;
      const slot = { deps, cleanup: null };
      slots[k] = slot;
      queue.push(() => { prev?.cleanup?.(); const c = fn(); slot.cleanup = typeof c === 'function' ? c : null; });
    },
  };
  rt.begin = () => { cursor = 0; };
  rt.flush = () => { const q = queue; queue = []; for (const run of q) run(); };
  return rt;
}

// One row of the reader, mounted. `render` is one React render plus its
// effects; `settle` lets pdf.js answer and re-renders for whatever it set.
function mountRow(props) {
  const rt = hooksRuntime();
  const ctx = vm.createContext({ ...rt.api, console, RUNWAY: 1, redrawInk() {}, inkDpr: () => 1 });
  const body = cut(PAGE_SRC, 'export default memo(function PdfPage({', '\n  return (');
  const Row = vm.runInContext(`(function PdfPage({${body}\n  return { w, h };\n})`, ctx);
  let current = props;
  const render = (next = current) => {
    current = next;
    rt.begin();
    const out = Row(current);
    rt.flush();
    return { w: out.w, h: out.h };
  };
  const settle = async (pending = []) => {
    let out = render();
    for (let i = 0; i < 40; i++) {
      await Promise.allSettled(pending);
      await tick();
      if (rt.dirty) { rt.dirty = false; out = render(); }
    }
    return out;
  };
  return { render, settle, props: () => current };
}

// A document that counts how often it is asked for a page.
function counted(doc) {
  const spy = { calls: 0, pending: [] };
  spy.doc = {
    numPages: doc.numPages,
    getPage: (n) => { spy.calls += 1; const p = doc.getPage(n); spy.pending.push(p); return p; },
  };
  return spy;
}

// Pages of every shape the reader meets: A4 in fractional points, a 16:9
// slide, a turned page, a cropped and turned one with odd offsets, and one
// that declares a UserUnit.
async function shapesDeck() {
  const { PDFDocument, PDFName, PDFNumber, degrees } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  pdf.addPage([595.28, 841.89]);
  pdf.addPage([960, 540]);
  pdf.addPage([612, 792]).setRotation(degrees(90));
  const cropped = pdf.addPage([960, 540]);
  cropped.setRotation(degrees(270));
  cropped.setCropBox(13.7, 21.3, 500.5, 377.25);
  pdf.addPage([720, 540]).node.set(PDFName.of('UserUnit'), PDFNumber.of(1.5));
  return pdf.save();
}

async function openDeck(bytes) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  return getDocument({ data: new Uint8Array(bytes), verbosity: 0 }).promise;
}

// What the row has always reserved: pdf.js's own viewport at that scale,
// floored.
async function viewportSize(doc, pageNum, scale) {
  const vp = (await doc.getPage(pageNum)).getViewport({ scale });
  return { w: Math.floor(vp.width), h: Math.floor(vp.height) };
}

// The zoom steps, and scales a fit-to-width frame produces.
const SCALES = [0.4, 0.5, 0.75, 1, 1.1234, 1.25, 1.5, (1280 - 24) / 960, 1.75, 2, 2.5, 3, 4];

test('a zoom step gives the page its new size in the same render, without asking pdf.js again', async () => {
  const doc = await openDeck(await shapesDeck());
  try {
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const spy = counted(doc);
      const row = mountRow({ pdfDoc: spy.doc, pageNum, scale: 1 });
      assert.deepEqual(await row.settle(spy.pending), await viewportSize(doc, pageNum, 1));
      for (const scale of SCALES) {
        const now = row.render({ ...row.props(), scale });
        assert.deepEqual(now, await viewportSize(doc, pageNum, scale),
          `page ${pageNum} at ${scale.toFixed(3)}x kept its old size for a render after the zoom`);
        await row.settle(spy.pending);
      }
      assert.equal(spy.calls, 1, `page ${pageNum} was asked of pdf.js ${spy.calls} times over ${SCALES.length} zoom steps`);
    }
  } finally {
    await doc.destroy();
  }
});

test('every page reserves exactly the size it always did, at every zoom', async () => {
  const doc = await openDeck(await shapesDeck());
  try {
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      for (const scale of SCALES) {
        const spy = counted(doc);
        const row = mountRow({ pdfDoc: spy.doc, pageNum, scale });
        assert.deepEqual(await row.settle(spy.pending), await viewportSize(doc, pageNum, scale),
          `page ${pageNum} opened at ${scale.toFixed(3)}x reserved a different size`);
      }
    }
  } finally {
    await doc.destroy();
  }
});

test('a row handed another document keeps its height until that document answers, then takes its size', async () => {
  const { PDFDocument } = await import('pdf-lib');
  const other = await PDFDocument.create();
  other.addPage([400, 300]);
  const [first, second] = [await openDeck(await shapesDeck()), await openDeck(await other.save())];
  try {
    const a = counted(first);
    const row = mountRow({ pdfDoc: a.doc, pageNum: 1, scale: 1.5 });
    const before = await row.settle(a.pending);
    assert.deepEqual(before, await viewportSize(first, 1, 1.5));
    // The next document, not yet answered: the column must not jump to a
    // placeholder under the reader for the length of one worker round trip.
    let answer;
    const gate = new Promise((r) => { answer = r; });
    const b = { calls: 0, doc: { numPages: 1, getPage: (n) => { b.calls += 1; return gate.then(() => second.getPage(n)); } } };
    assert.deepEqual(row.render({ ...row.props(), pdfDoc: b.doc }), before);
    await tick();
    assert.deepEqual(row.render(), before);
    answer();
    assert.deepEqual(await row.settle([gate]), await viewportSize(second, 1, 1.5), 'the row kept the previous document\'s size');
    assert.equal(b.calls, 1);
  } finally {
    await first.destroy();
    await second.destroy();
  }
});
