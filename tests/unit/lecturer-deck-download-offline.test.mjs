// ============================================================
// A deck download offline says so when the file was never opened (B24)
// ============================================================
// Offline, resolveDocUrl hands back the worker's cache URL,
// /api/library-blob?offline=1&h=…, and the worker answers it with 503
// {error:'offline_not_cached'} when this device never opened the deck.
// LecturerSets clicked an <a download> at that URL and printed
// "เริ่มดาวน์โหลดแล้ว" straight away, so the student was told the file was
// on its way while the browser saved nothing. The offline URL is now read
// first: a cached copy is saved, a 503 becomes the Thai "never opened on
// this device" note, and no anchor is clicked.
//
// Driven through the real LecturerSets source (fake-react harness).
// ============================================================

import test, { before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll } from '../helpers/fake-react.mjs';

const SLUG = 'role-of-veterinarians-in-one-health-sj-5-aug-2026-735daf';
const DOC = { slug: SLUG, title: 'Role of Veterinarians', storage_provider: 'r2', status: 'public', sha256_16: 'abcd1234abcd1234' };

let LecturerSets;
const saved = {};
const activeTimers = new Set();
before(async () => {
  globalThis.__deckDoc = DOC;
  LecturerSets = (await loadModule('src/components/LecturerSets.jsx', {
    stubs: [{
      match: '/lib/library\\.js$',
      contents: `const docs = () => ({ docs: [globalThis.__deckDoc] });
        export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(docs()), fresh: Promise.resolve(docs()) });
        export const readerPayload = (d) => d;
        export const recordRecentDoc = () => {};
        export const resolveDocUrl = async (d) => '/api/library-blob?offline=1&h=' + d.sha256_16;`,
    }],
  })).default;
  for (const k of ['window', 'document', 'fetch', 'URL', 'setTimeout']) saved[k] = globalThis[k];
  globalThis.setTimeout = (fn, ms, ...a) => {
    let t;
    t = saved.setTimeout(() => {
      activeTimers.delete(t);
      fn(...a);
    }, ms);
    activeTimers.add(t);
    return t;
  };
});
afterEach(() => {
  for (const t of activeTimers) clearTimeout(t);
  activeTimers.clear();
});
after(() => {
  for (const t of activeTimers) clearTimeout(t);
  activeTimers.clear();
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
  delete globalThis.__deckDoc;
});

function fakeBrowser({ response }) {
  const clicked = [];
  const fetched = [];
  const body = { appendChild() {}, removeChild() {} };
  globalThis.window = { location: { href: 'https://vetmock.vercel.app/app/topics', origin: 'https://vetmock.vercel.app' }, open() {} };
  globalThis.document = {
    body,
    createElement: () => ({ click() { clicked.push(this.href); }, remove() {} }),
  };
  globalThis.fetch = async (u) => { fetched.push(String(u)); return response; };
  const RealURL = saved.URL;
  globalThis.URL = class extends RealURL {};
  globalThis.URL.createObjectURL = () => 'blob:x';
  globalThis.URL.revokeObjectURL = () => {};
  return { clicked, fetched };
}

async function pressDownload() {
  const inst = mount(LecturerSets, { subject: 'one-health', topics: [], onStart: () => {}, onOpenDoc: () => {}, selectedPhase: '1-mid' });
  await settle(inst);
  const btn = findAll(inst.tree, (n) => n.type === 'button' && n.props['aria-label'] === 'ดาวน์โหลดสไลด์ Role of Veterinarians in One Health')[0];
  assert.ok(btn, 'the deck download button did not render');
  await btn.props.onClick();
  await settle(inst);
  const note = findAll(inst.tree, (n) => n.type === 'p' && n.props.className === 'vmx-lect-dl-note');
  inst.unmount();
  return note.map((n) => String([].concat(n.props.children).join('')));
}

test('offline, a deck this device never opened: no anchor, and the note says it cannot be downloaded offline', async () => {
  const { clicked } = fakeBrowser({ response: { ok: false, status: 503, blob: async () => null } });
  const notes = await pressDownload();
  assert.deepEqual(clicked, [], 'an <a download> was clicked at a URL the worker answers with 503');
  assert.ok(notes.length >= 1, 'no note after the download failed');
  for (const n of notes) {
    assert.doesNotMatch(n, /เริ่มดาวน์โหลด/);
    assert.match(n, /ยังไม่เคยเปิดไฟล์นี้ในเครื่องนี้/);
  }
});

test('offline, a deck already cached on this device: the cached bytes are saved', async () => {
  const { clicked, fetched } = fakeBrowser({ response: { ok: true, status: 200, blob: async () => ({ size: 3 }) } });
  const notes = await pressDownload();
  assert.equal(fetched.length, 1);
  assert.match(fetched[0], /offline=1/);
  assert.deepEqual(clicked, ['blob:x'], 'the cached copy should be saved through a blob link');
  assert.deepEqual(notes, []);
});
