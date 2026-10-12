// ============================================================
// palette-ask-library.test.mjs — the document-shelf link after an ask with
// no answer counts what the shelf itself will show
// ============================================================
// Review of 5.144.0. After "คลังมีเรื่องการทำ TPLO ไหม" found nothing, the
// card offered ค้นในคลังเอกสาร “คลัง” with a count of every file: the palette's
// own index adds the words "library เอกสาร คลัง ชีท สไลด์" to every document,
// so คลัง matched them all, and the shelf, which searches its own index,
// then opened on nothing. The link now counts against the shelf's own words
// for each document, and never offers a word that only names the shelf.
// Entries are built with the real libraryDocEntry, as the palette gets them.

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { libraryDocEntry } from '../../src/lib/omni-sources.js';

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

const shelf = (docs) => docs.map((d) => libraryDocEntry({ status: 'public', kind: 'slide', year: 4, semester: 1, ...d }));
globalThis.__askShelf = [];

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
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [{ id: "library", label: "คลังเอกสาร", icon: "", load: async () => globalThis.__askShelf }];' },
  { match: '(^|/)library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => ""; export const subjectMeta = () => null;' },
] });

const searchInput = (view) => findAll(view.tree, (n) => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const libraryLink = (view) => findAll(view.tree, (n) => n.type === 'button' && textOf(n).startsWith('ค้นในคลังเอกสาร'))[0];
const json = (status, body) => ({ ok: status < 400, status, headers: { get: () => 'application/json' }, json: async () => body });
const NOTHING = (unmatched) => json(200, {
  claims: [{ id: 'c1', text: 'ยังไม่มีเนื้อหาในคลังความรู้ที่ตอบคำถามนี้ได้', supportType: 'insufficient-evidence', support: [] }],
  meta: { covered: false, unmatched, related: [] },
});

async function askWith(view, question) {
  searchInput(view).props.onChange({ target: { value: question } });
  view.flush();
  await new Promise((resolve) => setTimeout(resolve, 90));
  view.flush();
  searchInput(view).props.onKeyDown({ key: 'Enter', ctrlKey: true, preventDefault() {} });
  await settle(view, 12);
}

function withFetch(handler) {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => handler();
  return () => { globalThis.fetch = previous; };
}

const SHELF = [
  { id: 'd1', slug: 'd1', title: 'GI anatomy', subject: 'com5', description: 'Lecture Slides' },
  { id: 'd2', slug: 'd2', title: 'Avian respiratory diseases', subject: 'avian-medicine' },
  { id: 'd3', slug: 'd3', title: 'Equine lameness exam', subject: 'equine-medicine', lecturer: 'อ.สมศรี' },
];

test('a word that only names the shelf is never offered, whatever the palette\'s index carries', async () => {
  globalThis.__askShelf = shelf(SHELF);
  for (const question of ['คลังมีเรื่องการทำ TPLO ไหม', 'มีสไลด์เรื่อง TPLO ไหม']) {
    const restore = withFetch(() => NOTHING(['tplo']));
    const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
    try {
      await settle(view);
      await askWith(view, question);
      assert.ok(textOf(view.tree).includes('คลังความรู้ยังไม่มีคำตอบเรื่องนี้'), textOf(view.tree));
      const link = libraryLink(view);
      assert.equal(link, undefined, `${question}: no document mentions TPLO, so no link; got "${link && textOf(link)}"`);
    } finally { view.unmount(); restore(); }
  }
});

test('the link counts the documents the shelf\'s own search will list', async () => {
  globalThis.__askShelf = shelf([...SHELF, { id: 'd4', slug: 'd4', title: 'Stifle surgery: TPLO and TTA', subject: 'cliapprum' }]);
  const opened = [];
  const restore = withFetch(() => NOTHING(['tplo']));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A', goView: (v) => opened.push(v) });
  try {
    await settle(view);
    await askWith(view, 'คลังมีเรื่องการทำ TPLO ไหม');
    const link = libraryLink(view);
    assert.ok(link, 'a document mentions TPLO');
    assert.equal(textOf(link), 'ค้นในคลังเอกสาร “tplo” 1 ไฟล์');
    link.props.onClick();
    assert.equal(storage.getItem('vmx-library-q'), 'tplo');
    assert.deepEqual(opened, ['library']);
  } finally { view.unmount(); restore(); }
});

test('a word only the shelf indexes (a lecturer) is counted the way the shelf finds it', async () => {
  globalThis.__askShelf = shelf(SHELF);
  const restore = withFetch(() => NOTHING([]));
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await askWith(view, 'สมศรีสอนเรื่องอะไรบ้าง');
    const link = libraryLink(view);
    assert.ok(link, 'the shelf lists the lecturer\'s documents');
    assert.equal(textOf(link), 'ค้นในคลังเอกสาร “สมศรี” 1 ไฟล์');
  } finally { view.unmount(); restore(); }
});
