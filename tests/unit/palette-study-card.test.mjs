// ============================================================
// palette-study-card.test.mjs — the search card for "ข้อสอบ com5",
// "เอกสาร epidem": every button opens something real
// ============================================================
// Review of 5.144.0. Two ways the card led nowhere:
//   • In year 5, "ข้อสอบ com5" offered "ฝึกข้อสอบ COM V 129 ข้อ, ปี 4".
//     App loads only the selected year's question banks, so Enter opened
//     topics that each said ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ with start disabled.
//   • Before the document shelf had loaded (or offline), "เอกสาร epidem" said
//     ยังไม่มีเอกสารของวิชานี้ในคลัง and Enter opened practice: a count of
//     zero was read as "none" while it was still "not known yet".
// The palette's real source with the real intent reader; only the network
// and the heavy data modules are stubbed.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

class Storage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
const storage = new Storage();
globalThis.window = new EventTarget(); window.localStorage = storage;
globalThis.localStorage = storage; globalThis.sessionStorage = storage;
globalThis.matchMedia = () => ({ matches: true });
// The document shelf, as each test needs it: still loading, failed, or loaded.
globalThis.__studyLibrary = { load: () => new Promise(() => {}) };

const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = [];' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = {};' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {};' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [{ id: "library", label: "คลังเอกสาร", icon: "", load: () => globalThis.__studyLibrary.load() }];' },
  { match: '(^|/)library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => ""; export const subjectMeta = () => null;' },
] });

const searchInput = (view) => findAll(view.tree, (n) => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const cardButton = (view) => findAll(view.tree, (n) => n.type === 'button' && n.props['data-flat-idx'] === 0)[0];

async function type(view, value) {
  searchInput(view).props.onChange({ target: { value } });
  view.flush();
  await new Promise((resolve) => setTimeout(resolve, 90));
  view.flush();
}
const pressEnter = (view) => searchInput(view).props.onKeyDown({ key: 'Enter', preventDefault() {} });

function setup(selectedYear) {
  storage.clear();
  const calls = [];
  const view = mount(CommandPalette, {
    open: true, onClose() {}, selectedYear, signedIn: true, ownerId: 'A',
    goView: (...a) => calls.push(['view', ...a]),
    setSubject: (v) => calls.push(['subject', v]),
    setTopic: (v) => calls.push(['topic', v]),
    setPracticeMode: (v) => calls.push(['mode', v]),
    onOpenWiki: (...a) => calls.push(['wiki', ...a]),
  });
  return { view, calls };
}

test('in year 5 a year-4 course offers what opens in any year, never its practice', async () => {
  globalThis.__studyLibrary = { load: async () => [] };
  const { view, calls } = setup(5);
  try {
    await settle(view);
    await type(view, 'ข้อสอบ com5');
    const first = cardButton(view);
    assert.ok(first, 'the card still leads');
    assert.ok(textOf(first).includes('COM V'), textOf(first));
    assert.ok(!textOf(first).includes('ฝึกข้อสอบ'), `the card must not offer another year's practice: ${textOf(first)}`);
    const text = textOf(view.tree);
    assert.ok(!text.includes('ฝึกข้อสอบ COM V'), text);
    assert.ok(text.includes('ข้อสอบวิชานี้อยู่ในชั้นปี 4'), 'asked for practice, the card says where the questions are');
    pressEnter(view);
    assert.ok(!calls.some(([kind, v]) => kind === 'view' && v === 'topic-select'), `Enter must not open COM V's topics: ${JSON.stringify(calls)}`);
    assert.deepEqual(calls, [['subject', 'com5'], ['topic', null], ['view', 'notes']], 'Enter opens the first shelf that opens: the notes');
  } finally { view.unmount(); }
});

test('in its own year the same card still leads with practice', async () => {
  globalThis.__studyLibrary = { load: async () => [] };
  const { view, calls } = setup(4);
  try {
    await settle(view);
    await type(view, 'ข้อสอบ com5');
    assert.ok(textOf(cardButton(view)).includes('ฝึกข้อสอบ'), textOf(cardButton(view)));
    pressEnter(view);
    assert.deepEqual(calls.at(-1), ['view', 'topic-select']);
  } finally { view.unmount(); }
});

// ── The document shelf's count: known only once the shelf has loaded ──────
const doc = (id, subject) => ({ type: 'library-doc', label: id, _labelLc: id, _hayLc: id, payload: { id, subject, status: 'public' } });
const MISSING_DOCS = 'ยังไม่มีเอกสารของวิชานี้ในคลัง';

for (const [state, load] of [
  ['still loading', () => new Promise(() => {})],
  ['failed (offline)', async () => { throw new Error('offline'); }],
]) {
  test(`while the shelf is ${state}, asking for documents opens the shelf and never says it is empty`, async () => {
    globalThis.__studyLibrary = { load };
    const { view, calls } = setup(5);
    const logged = console.error;
    console.error = () => {}; // the palette logs a failed source on purpose
    try {
      await settle(view);
      await type(view, 'เอกสาร epidem');
      const text = textOf(view.tree);
      assert.ok(!text.includes(MISSING_DOCS), `a count that is not known yet is not "none": ${text}`);
      assert.ok(textOf(cardButton(view)).includes('คลังเอกสาร'), `the shelf asked for leads: ${textOf(cardButton(view))}`);
      assert.ok(!/\d+ ไฟล์/.test(textOf(cardButton(view))), 'and promises no count');
      pressEnter(view);
      assert.equal(sessionStorage.getItem('vmx-library-subject'), 'epidemiology');
      assert.deepEqual(calls, [['view', 'library']], `Enter opens that subject's shelf, not practice: ${JSON.stringify(calls)}`);
    } finally { console.error = logged; view.unmount(); }
  });
}

test('once the shelf has loaded, a subject with no documents says so and offers what it has', async () => {
  globalThis.__studyLibrary = { load: async () => [doc('a', 'avian-medicine')] };
  const { view } = setup(5);
  try {
    await settle(view);
    await type(view, 'เอกสาร epidem');
    assert.ok(textOf(view.tree).includes(MISSING_DOCS));
    assert.ok(!textOf(cardButton(view)).includes('คลังเอกสาร'), 'no shelf button for a shelf that is known to be empty');
  } finally { view.unmount(); }
});

test('once the shelf has loaded, the documents are counted', async () => {
  globalThis.__studyLibrary = { load: async () => [doc('e1', 'epidemiology'), doc('e2', 'epidemiology'), doc('a', 'avian-medicine')] };
  const { view } = setup(5);
  try {
    await settle(view);
    await type(view, 'เอกสาร epidem');
    assert.ok(textOf(cardButton(view)).includes('คลังเอกสาร'));
    assert.ok(textOf(cardButton(view)).includes('2 ไฟล์'), textOf(cardButton(view)));
    assert.ok(!textOf(view.tree).includes(MISSING_DOCS));
  } finally { view.unmount(); }
});
