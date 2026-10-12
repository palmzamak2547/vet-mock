// ============================================================
// palette-ask-states.test.mjs — the search box when there is no plain answer
// ============================================================
// Owner review (5.141.6): "ถามคลังความรู้ ยังใช้ไม่ได้จริง", with a bare
// "ตอบไม่สำเร็จ ลองใหม่อีกครั้ง" on screen. The palette's real source, driven
// with the network stubbed:
//   • a transient failure is retried once by itself, never more;
//   • a failure that stays shows what happened and one tap to ask again;
//   • a quota answer is told straight, with no retry;
//   • "VetWiki has nothing on this" offers the sections that exist;
//   • "คลิป COM5" puts the course's clips first, and Enter opens them.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

class Storage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}
const storage = new Storage();
globalThis.window = new EventTarget(); window.localStorage = storage;
globalThis.localStorage = storage; globalThis.sessionStorage = storage;
globalThis.matchMedia = () => ({ matches: true });

const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = [];' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = {};' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [{ subject: "com3", topic: "seizure", title: "Seizure & Narcolepsy", summary: "status epilepticus" }];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {};' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [];' },
  { match: '(^|/)library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => ""; export const subjectMeta = () => null;' },
] });

const searchInput = (view) => findAll(view.tree, (n) => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const buttons = (view, text) => findAll(view.tree, (n) => n.type === 'button' && textOf(n).includes(text));

async function type(view, value) {
  searchInput(view).props.onChange({ target: { value } });
  view.flush();
  await new Promise((resolve) => setTimeout(resolve, 90));
  view.flush();
}
async function ask(view) {
  searchInput(view).props.onKeyDown({ key: 'Enter', ctrlKey: true, preventDefault() {} });
  await settle(view, 12);
}

const json = (status, body) => ({ ok: status < 400, status, headers: { get: () => 'application/json' }, json: async () => body });
const ANSWER = {
  claims: [{ id: 'c1', text: 'การวินิจฉัยหลักคือ DFA', supportType: 'vetwiki-verified', support: [{ sectionId: 'com5--rabies--diagnosis' }] }],
  meta: { covered: true, sections: [{ sectionId: 'com5--rabies--diagnosis', subject: 'com5', topic: 'rabies', topicTitle: 'Rabies', heading: 'Diagnosis' }] },
};
const QUESTION = 'โรคพิษสุนัขบ้าวินิจฉัยยังไง';

// The automatic retry waits 1.2 s; the test does not need to.
const realTimeout = globalThis.setTimeout;
function fastRetry() {
  globalThis.setTimeout = (fn, ms, ...rest) => realTimeout(fn, ms === 1200 ? 5 : ms, ...rest);
  return () => { globalThis.setTimeout = realTimeout; };
}

function withFetch(handler) {
  const calls = [];
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, init) => { calls.push(JSON.parse(init.body).question); return handler(calls.length); };
  return { calls, restore: () => { globalThis.fetch = previous; } };
}

test('a transient failure is retried once by itself and the answer arrives', async () => {
  const restoreTimers = fastRetry();
  const net = withFetch((n) => (n === 1 ? json(502, { reason: 'provider' }) : json(200, ANSWER)));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    await type(view, QUESTION);
    await ask(view);
    await settle(view, 12);
    assert.equal(net.calls.length, 2, 'one automatic retry');
    assert.ok(textOf(view.tree).includes('การวินิจฉัยหลักคือ DFA'), textOf(view.tree));
  } finally { view.unmount(); net.restore(); restoreTimers(); }
});

test('a failure that stays says what happened and offers one tap to ask again, never a loop', async () => {
  const restoreTimers = fastRetry();
  const net = withFetch(() => json(504, { reason: 'timeout' }));
  const opened = [];
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, onOpenWiki: (...a) => opened.push(a) });
  try {
    await settle(view);
    await type(view, 'ลมชักในสุนัขรักษายังไงดี');
    await ask(view);
    await settle(view, 12);
    assert.equal(net.calls.length, 2, 'the first try and one automatic retry, no more');
    const text = textOf(view.tree);
    assert.ok(text.includes('ตอบไม่สำเร็จ') && text.includes('คำตอบใช้เวลานานเกินไป'), text);
    // The question is near an article the student can open instead
    // (ลมชัก names the English-titled seizure article).
    const near = buttons(view, 'Seizure & Narcolepsy')[0];
    assert.ok(near, `the nearest article is offered; got ${text}`);
    near.props.onClick();
    assert.deepEqual(opened, [['com3', 'seizure', undefined]]);
    const retry = buttons(view, 'ลองถามอีกครั้ง')[0];
    assert.ok(retry, 'the retry is a button');
    retry.props.onClick();
    await settle(view, 12);
    assert.equal(net.calls.length, 3, 'a retry the student asked for is one request');
  } finally { view.unmount(); net.restore(); restoreTimers(); }
});

// A 200 whose body was cut off: the headers arrived, the JSON did not.
const cutOff = () => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => { throw new SyntaxError('Unexpected end of JSON input'); } });

test('a reply cut off mid-body is retried once by itself, not read as "nothing on this"', async () => {
  const restoreTimers = fastRetry();
  const net = withFetch((n) => (n === 1 ? cutOff() : json(200, ANSWER)));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    await type(view, QUESTION);
    await ask(view);
    await settle(view, 12);
    assert.equal(net.calls.length, 2, 'one automatic retry');
    const text = textOf(view.tree);
    assert.ok(text.includes('การวินิจฉัยหลักคือ DFA'), text);
    assert.ok(!text.includes('คลังความรู้ยังไม่มีคำตอบเรื่องนี้'), text);
  } finally { view.unmount(); net.restore(); restoreTimers(); }
});

test('a reply that stays cut off says the connection failed and offers to ask again', async () => {
  const restoreTimers = fastRetry();
  const net = withFetch(() => cutOff());
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    await type(view, QUESTION);
    await ask(view);
    await settle(view, 12);
    assert.equal(net.calls.length, 2, 'the first try and one automatic retry, no more');
    const text = textOf(view.tree);
    assert.ok(text.includes('ตอบไม่สำเร็จ') && text.includes('เชื่อมต่อไม่ได้'), text);
    assert.ok(!text.includes('คลังความรู้ยังไม่มีคำตอบเรื่องนี้'), 'never "VetWiki has nothing on this"');
    assert.ok(buttons(view, 'ลองถามอีกครั้ง')[0], 'one tap to ask again');
  } finally { view.unmount(); net.restore(); restoreTimers(); }
});

test('a spent daily quota is told straight and not retried', async () => {
  const net = withFetch(() => json(503, { reason: 'budget' }));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    await type(view, QUESTION);
    await ask(view);
    assert.equal(net.calls.length, 1);
    assert.ok(textOf(view.tree).includes('วันนี้ถามครบโควตาแล้ว'));
    assert.equal(buttons(view, 'ลองถามอีกครั้ง').length, 0);
  } finally { view.unmount(); net.restore(); }
});

test('"nothing on this" names the missing term and opens the related section it offers', async () => {
  const net = withFetch(() => json(200, {
    claims: [{ id: 'c1', text: 'ยังไม่มีเนื้อหาในคลังความรู้ที่ตอบคำถามนี้ได้', supportType: 'insufficient-evidence', support: [] }],
    meta: { covered: false, unmatched: ['norberg'], related: [{ subject: 'com3', topic: 'spinal', topicTitle: 'Spinal Disorder & Injuries', sectionId: 'com3--spinal--hansen-type-i-ivdd', heading: 'Hansen Type I IVDD' }] },
  }));
  const opened = [];
  let closed = 0;
  const view = mount(CommandPalette, { open: true, onClose() { closed++; }, selectedYear: 5, onOpenWiki: (...a) => opened.push(a) });
  try {
    await settle(view);
    await type(view, 'Norberg angle วัดยังไง');
    await ask(view);
    const text = textOf(view.tree);
    assert.ok(text.includes('คลังความรู้ยังไม่มีคำตอบเรื่องนี้'), text);
    assert.ok(text.includes('ไม่พบคำว่า “norberg” ในคลังความรู้'), text);
    const link = buttons(view, 'Spinal Disorder & Injuries')[0];
    assert.ok(link, 'the related section is a button');
    link.props.onClick();
    assert.deepEqual(opened, [['com3', 'spinal', 'com3--spinal--hansen-type-i-ivdd']]);
    assert.equal(closed, 1);
  } finally { view.unmount(); net.restore(); }
});

test('an answer that names no related section is not given titles guessed on this device', async () => {
  // The server reads the whole corpus and offered nothing on purpose
  // (production, "TPLO ผ่าตัดยังไง": covered false, related []). The title
  // guess is for when the server could not be reached at all.
  const net = withFetch(() => json(200, {
    claims: [{ id: 'c1', text: 'ยังไม่มีเนื้อหาในคลังความรู้ที่ตอบคำถามนี้ได้', supportType: 'insufficient-evidence', support: [] }],
    meta: { covered: false, unmatched: [], related: [] },
  }));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    // ลมชัก names the seizure article, so a title guess would offer it.
    await type(view, 'ลมชักในสุนัขรักษายังไงดี');
    await ask(view);
    const text = textOf(view.tree);
    assert.ok(text.includes('คลังความรู้ยังไม่มีคำตอบเรื่องนี้'), text);
    assert.equal(buttons(view, 'Seizure & Narcolepsy').length, 0, `no guessed article under the server's answer: ${text}`);
    assert.ok(!text.includes('หัวข้อที่ใกล้เคียงที่สุด'), 'and no empty heading either');
  } finally { view.unmount(); net.restore(); }
});

test('"คลิป COM5" puts the course\'s clips first and Enter opens them', async () => {
  const calls = [];
  let closed = 0;
  const view = mount(CommandPalette, {
    open: true, onClose() { closed++; }, selectedYear: 4, signedIn: true, ownerId: 'A',
    goView: (...a) => calls.push(a), setSubject: (v) => calls.push(['subject', v]),
  });
  try {
    await settle(view);
    await type(view, 'คลิป COM5');
    const first = findAll(view.tree, (n) => n.type === 'button' && n.props['data-flat-idx'] === 0)[0];
    assert.ok(first && textOf(first).includes('คลิปย้อนหลัง') && textOf(first).includes('COM V'), first && textOf(first));
    assert.equal(buttons(view, 'ถามคลังความรู้').length, 0, 'a request to go somewhere gets no ask row');
    searchInput(view).props.onKeyDown({ key: 'Enter', preventDefault() {} });
    assert.deepEqual(calls, [['videos', { subject: 'com5' }]]);
    assert.equal(closed, 1);
  } finally { view.unmount(); }
});

test('a typed ask is the only ask: the settled-question timer does not send the same text again', async () => {
  const net = withFetch(() => json(200, ANSWER));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5 });
  try {
    await settle(view);
    await type(view, QUESTION);
    await ask(view); // before the 900 ms settle timer fires
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await settle(view, 12);
    assert.equal(net.calls.length, 1);
  } finally { view.unmount(); net.restore(); }
});
