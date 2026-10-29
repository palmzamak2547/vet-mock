// ============================================================
// What the lecturer block says: its reveal switch (COPY-10) and a failed
// deck download (OV-ui-20)
// ============================================================
// COPY-10. The block's switch turns instant feedback off with its second
// choice, so nothing shows until the set is submitted, as its own hint says
// ("เห็นเฉลยทั้งชุดหลังส่งคำตอบ"). It was labelled "เฉลยหลังทำครบ", the
// matching set's wording, where "after" means once every row is filled.
// It now uses the shared word for that moment, the one a written answer's
// switch already uses.
//
// OV-ui-20. A deck kept on another host that refused the download showed
// the student the HTTP status: "ดาวน์โหลดไม่สำเร็จ (403)". An expired or
// missing link now says to reopen the page; anything else, to try again.
//
// Driven through the real LecturerSets source (fake-react harness).
// ============================================================

import test, { before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

const DOC = { slug: 'role-of-veterinarians-in-one-health-sj-5-aug-2026-735daf', title: 'Role of Veterinarians', storage_provider: 'r2', status: 'public', sha256_16: 'abcd1234abcd1234' };

let LecturerSets;
let REVEAL_LABELS;
const saved = {};
const activeTimers = new Set();
before(async () => {
  globalThis.__deckDoc = DOC;
  const mod = await loadModule('src/components/LecturerSets.jsx', {
    stubs: [{
      match: '/lib/library\\.js$',
      contents: `const docs = () => ({ docs: [globalThis.__deckDoc] });
        export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(docs()), fresh: Promise.resolve(docs()) });
        export const readerPayload = (d) => d;
        export const recordRecentDoc = () => {};
        export const resolveDocUrl = async () => 'https://files.example.org/decks/one-health.pdf';`,
    }],
  });
  LecturerSets = mod.default;
  REVEAL_LABELS = (await loadModule('src/components/AnswerReveal.jsx', {
    stubs: ['AiGradePanel', 'TermLinkedRichText'].map((name) => ({ match: `${name}\.jsx$`, contents: 'export default function Stub() { return null; }' })),
  })).REVEAL_LABELS;
  for (const k of ['window', 'document', 'fetch', 'URL', 'setTimeout', 'localStorage']) saved[k] = globalThis[k];
  globalThis.setTimeout = (fn, ms, ...a) => {
    const t = saved.setTimeout(() => { activeTimers.delete(t); fn(...a); }, ms);
    activeTimers.add(t);
    return t;
  };
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
});
afterEach(() => {
  for (const t of activeTimers) clearTimeout(t);
  activeTimers.clear();
});
after(() => {
  for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; }
  delete globalThis.__deckDoc;
});

function fakeBrowser(status) {
  globalThis.window = {
    location: { href: 'https://vetmock.com/app/topics', origin: 'https://vetmock.com' },
    open() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  };
  globalThis.document = { body: { appendChild() {} }, createElement: () => ({ click() {}, remove() {} }) };
  globalThis.fetch = async () => ({ ok: status < 400, status, blob: async () => ({ size: 3 }) });
  globalThis.URL = class extends saved.URL {};
  globalThis.URL.createObjectURL = () => 'blob:x';
  globalThis.URL.revokeObjectURL = () => {};
}

const props = (extra = {}) => ({ subject: 'one-health', topics: [], onStart: () => {}, onOpenDoc: () => {}, selectedYear: 5, selectedPhase: '1-mid', ...extra });

async function downloadNote(status) {
  fakeBrowser(status);
  const inst = mount(LecturerSets, props());
  await settle(inst);
  const btn = findAll(inst.tree, (n) => n.type === 'button' && n.props['aria-label'] === 'ดาวน์โหลดสไลด์ Role of Veterinarians in One Health')[0];
  assert.ok(btn, 'the deck download button did not render');
  await btn.props.onClick();
  await settle(inst);
  // Each lecturer card prints the note; one wording is what matters here.
  const notes = findAll(inst.tree, (n) => n.type === 'p' && n.props.className === 'vmx-lect-dl-note').map(textOf);
  inst.unmount();
  return [...new Set(notes)];
}

for (const status of [403, 404, 410]) {
  test(`a deck link the other host refuses with ${status} says to reopen the page, without the status`, async () => {
    const notes = await downloadNote(status);
    assert.deepEqual(notes, ['ลิงก์ไฟล์หมดอายุ เปิดหน้านี้ใหม่แล้วลองอีกครั้ง']);
  });
}

for (const status of [500, 503, 429]) {
  test(`any other failure (${status}) says to try again, without the status`, async () => {
    const notes = await downloadNote(status);
    assert.deepEqual(notes, ['ดาวน์โหลดไม่สำเร็จ ลองอีกครั้ง']);
  });
}

test('a download that works leaves no note', async () => {
  assert.deepEqual(await downloadNote(200), []);
});

test("the block's reveal switch names the moment it means", async () => {
  fakeBrowser(200);
  const inst = mount(LecturerSets, props({ instantFeedback: false, setInstantFeedback: () => {} }));
  await settle(inst);
  const group = findAll(inst.tree, (n) => n.props?.className === 'vmx-reveal-toggle')[0];
  assert.ok(group, 'the reveal switch did not render');
  const labels = findAll(group, (n) => n.type === 'button').map(textOf);
  assert.deepEqual(labels, ['เฉลยทีละข้อ', 'เฉลยหลังส่งทั้งชุด']);
  assert.deepEqual(labels, [REVEAL_LABELS.row, REVEAL_LABELS.end], 'the switch spells its own labels');
  const on = findAll(group, (n) => n.type === 'button' && n.props['aria-pressed'] === true).map(textOf);
  assert.deepEqual(on, ['เฉลยหลังส่งทั้งชุด']);
  const hint = findAll(inst.tree, (n) => n.props?.className === 'vmx-lect-reveal-hint').map(textOf)[0];
  assert.match(hint, /หลังส่ง/, 'the hint and the switch name different moments');
  inst.unmount();
});
