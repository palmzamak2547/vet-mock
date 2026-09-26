// ============================================================
// atlas-error-text.test.mjs — the Atlas never shows a browser's English error
// (B41)
// ============================================================
// loadAtlasAsset rethrew fetch() and body-stream errors unwrapped, and the
// scene printed error.message as the student-facing line: a Wi-Fi drop in the
// middle of a 16 MB model read "network error" (Chrome), "Load failed"
// (Safari) or "terminated" (Node's fetch), and the comparison pane read
// "ภาพเปรียบเทียบเปิดไม่ได้: network error". Transport failures are now Thai,
// and an abort stays an abort so the scene can tell a timeout apart.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const THAI = /[฀-๿]/;

function asset() {
  const bytes = new Uint8Array(64);
  new DataView(bytes.buffer).setUint32(0, 0x46546c67, true);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  return { bytes, asset: { model: `/atlas/err-${sha256.slice(0, 12)}.glb`, bytes: bytes.length, sha256 } };
}

async function withNoCache(fn) {
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  Object.defineProperty(globalThis, 'caches', { configurable: true, value: { open: async () => ({
    match: async () => undefined, keys: async () => [], put: async () => {},
  }) } });
  try { return await fn(); } finally {
    if (prior) Object.defineProperty(globalThis, 'caches', prior); else delete globalThis.caches;
  }
}

const { loadAtlasAsset } = await import('../../src/lib/atlas-cache.js?error-text');

for (const [label, failure] of [
  ['Chrome, no network', new TypeError('Failed to fetch')],
  ['Safari, no network', new TypeError('Load failed')],
  ['Firefox, no network', new TypeError('NetworkError when attempting to fetch resource.')],
]) {
  test(`a request that never connects reads in Thai (${label})`, async (t) => {
    const { asset: a } = asset();
    t.mock.method(globalThis, 'fetch', async () => { throw failure; });
    const error = await withNoCache(() => loadAtlasAsset(a).then(() => null, (e) => e));
    assert.ok(error, 'the load failed');
    assert.match(error.message, THAI, `raw "${error.message}" reached the student`);
    assert.equal(error.cause, failure, 'the original error is kept for debugging');
  });
}

for (const text of ['network error', 'Load failed', 'Error in body stream', 'terminated']) {
  test(`a download dropped halfway reads in Thai ("${text}")`, async (t) => {
    const { bytes, asset: a } = asset();
    let sent = false;
    const body = new ReadableStream({
      pull(controller) {
        if (!sent) { sent = true; controller.enqueue(bytes.slice(0, 16)); return; }
        controller.error(new TypeError(text));
      },
    });
    t.mock.method(globalThis, 'fetch', async () => new Response(body));
    const error = await withNoCache(() => loadAtlasAsset(a).then(() => null, (e) => e));
    assert.ok(error);
    assert.match(error.message, THAI, `raw "${error.message}" reached the student`);
  });
}

test('an abort is still an abort, and a Thai error is passed on as it is', async (t) => {
  const { asset: a } = asset();
  t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
  const aborted = await withNoCache(() => loadAtlasAsset(a).then(() => null, (e) => e));
  assert.equal(aborted.name, 'AbortError');
  t.mock.method(globalThis, 'fetch', async () => new Response('x', { status: 503 }));
  const offline = await withNoCache(() => loadAtlasAsset(a).then(() => null, (e) => e));
  assert.equal(offline.message, 'โหลดไฟล์โมเดลไม่สำเร็จ');
});
