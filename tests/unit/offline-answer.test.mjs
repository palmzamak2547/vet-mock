// ============================================================
// offline-answer.test.mjs: the worker's offline 503 reads as offline
// ============================================================
// public/sw.js answers a request it could not send with a 503 of its own,
// so fetch() resolves. Three clients only knew offline from a thrown fetch:
//
//  - feedback: offline, a student was told the mail system was down and to
//    write an email instead (the "server" sentence);
//  - outside documents: the body says "Offline", a key with no message, so
//    the generic "could not open" line showed instead of the offline one;
//  - Atlas models: "โหลดไฟล์โมเดลไม่สำเร็จ" instead of "not stored on this device".
//
// Offline audit, 15 Nov 2026 (OFFLINE-20261115.md).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { isOfflineAnswer } from '../../src/lib/offline-answer.js';
import { sendFeedback, FEEDBACK_MESSAGES } from '../../src/lib/feedback-client.js';
import { loadModule } from '../helpers/fake-react.mjs';

const workerAnswer = (body, { header = true } = {}) => new Response(typeof body === 'string' ? body : JSON.stringify(body), {
  status: 503,
  headers: { 'Content-Type': 'application/json', ...(header ? { 'X-VMX-Offline': '1' } : {}) },
});

test('the helper knows the worker by its header, or by the bodies an older worker sends', () => {
  assert.equal(isOfflineAnswer(workerAnswer({ error: 'Offline' })), true);
  assert.equal(isOfflineAnswer(workerAnswer({}, { header: true })), true);
  assert.equal(isOfflineAnswer(workerAnswer({}, { header: false }), { error: 'Offline' }), true);
  assert.equal(isOfflineAnswer(workerAnswer({}, { header: false }), { error: 'offline_not_cached' }), true);
  assert.equal(isOfflineAnswer(workerAnswer('', { header: false }), 'Offline'), true);
  // A real server fault is not offline.
  assert.equal(isOfflineAnswer(new Response('{}', { status: 503 }), { error: 'mailer_down' }), false);
  assert.equal(isOfflineAnswer(new Response('{}', { status: 500, headers: { 'X-VMX-Offline': '1' } })), false);
  assert.equal(isOfflineAnswer(null), false);
});

for (const header of [true, false]) {
  test(`feedback sent offline says offline, not that the mail system is down (header ${header})`, async () => {
    const result = await sendFeedback({ type: 'bug', subject: 's', message: 'm' }, {
      fetch: async () => workerAnswer({ error: 'Offline' }, { header }),
      auth: async () => ({}),
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, 'offline');
    assert.equal(result.messageTh, FEEDBACK_MESSAGES.offline);
  });
}

test('an outside document asked for offline gets the offline reason, which has a message', async (t) => {
  const client = await loadModule('src/lib/external-doc-client.js', { stubs: [
    { match: '/supabase\\.js$', contents: 'export const getSupabase = () => globalThis.__externalClientSdk();' },
  ] });
  const previous = { fetch: globalThis.fetch, sdk: globalThis.__externalClientSdk };
  globalThis.__externalClientSdk = async () => ({ auth: { getSession: async () => ({ data: { session: null } }) } });
  globalThis.fetch = async () => workerAnswer({ error: 'Offline' });
  t.after(() => { globalThis.fetch = previous.fetch; globalThis.__externalClientSdk = previous.sdk; });
  const result = await client.fetchExternalDoc('https://docs.google.com/document/d/ACCOUNTAPRIVATEDOC00001/edit');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'offline');
  assert.match(client.messageFor(result.reason), /ออฟไลน์/);
});

test('an Atlas model the worker could not fetch offline says it is not stored on this device', async (t) => {
  const bytes = new Uint8Array(64);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const asset = { model: `/atlas/off-${sha256.slice(0, 12)}.glb`, bytes: bytes.length, sha256 };
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  Object.defineProperty(globalThis, 'caches', { configurable: true, value: { open: async () => ({
    match: async () => undefined, keys: async () => [], put: async () => {},
  }) } });
  t.after(() => { if (prior) Object.defineProperty(globalThis, 'caches', prior); else delete globalThis.caches; });
  t.mock.method(globalThis, 'fetch', async () => new Response('Offline', { status: 503, headers: { 'X-VMX-Offline': '1' } }));
  const { loadAtlasAsset } = await import('../../src/lib/atlas-cache.js?offline-answer');
  const error = await loadAtlasAsset(asset).then(() => null, (e) => e);
  assert.ok(error);
  assert.match(error.message, /ยังไม่ได้เก็บไว้ในเครื่อง/);
});

// A set finished offline imports study-event-log.js to keep its answers. The
// module was loaded only at that moment, so a device that had not finished a
// set since the last release could not save them offline and showed "ยังบันทึก
// รายละเอียดคำตอบไม่ได้" with a backup button. Home warms it with the exam views.
test('Home warms the module that saves a finished set, beside the exam views', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  const at = src.indexOf("import('./ExamView.jsx')");
  assert.notEqual(at, -1, 'the exam-flow warm-up is still in HomeView');
  const block = src.slice(at, at + 900);
  assert.match(block, /import\('\.\.\/lib\/study-event-log\.js'\)\.catch\(/);
  const appSrc = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(appSrc, /import\('\.\/lib\/study-event-log\.js'\)/, 'App still saves a finished set through this module');
});
