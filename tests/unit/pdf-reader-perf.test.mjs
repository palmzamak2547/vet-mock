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
