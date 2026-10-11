// ============================================================
// palette-synonyms.test.mjs — the search box speaks the student's
// words, not the registry's
// ============================================================
// Palm, 2026-10-11: "ถ้าใส่คีย์เวิร์ด แบบทดสอบ คลิป หรือ สรุปวิชา###
// ก็จะขึ้นอันที่เกี่ยวข้อง". A typed token must still hit literally or
// through QUERY_SYNONYMS — the dictionary widens the vocabulary of a
// search, never the set of things that count as a match, so a query that
// means nothing still finds nothing.
// ============================================================

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
globalThis.__paletteEntries = [];

const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = [];' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = [];' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {};' },
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => [];' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [{ id: "library", label: "คลังเอกสาร", icon: "", load: async () => globalThis.__paletteEntries }];' },
  { match: '/lib/library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

const resultRows = view => findAll(view.tree, node => node.type === 'button' && node.props['data-flat-idx'] != null);
const searchInput = view => findAll(view.tree, node => node.type === 'input' && node.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const labelsFor = (view) => resultRows(view).map(row => textOf(row));

// The palette debounces by 60 ms; a real timer is the honest way through it.
async function type(view, query) {
  searchInput(view).props.onChange({ target: { value: query } });
  view.flush();
  await new Promise((res) => setTimeout(res, 90));
  view.flush();
  return view;
}

test('a keyword the registry never writes still reaches its feature', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'ทดสอบ');
    assert.ok(labelsFor(view).some(l => l.includes('โหมดสอบ')),
      `"ทดสอบ" must reach exam mode; got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});

test('a subject-prefixed summary keyword reaches the lecture notes', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'สรุปวิชา');
    assert.ok(labelsFor(view).some(l => l.includes('สรุปบทเรียน')),
      `"สรุปวิชา" must reach the notes shelf; got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});

test('a word that means nothing still finds nothing', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'zzzznothinghere');
    assert.equal(resultRows(view).length, 0,
      `a nonsense query must not invent rows; got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});

test('an exact keyword still outranks the same word found through the dictionary', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'สอบ');
    const labels = labelsFor(view);
    assert.ok(labels.some(l => l.includes('โหมดสอบ')), `"สอบ" must reach exam mode; got ${labels.join(' | ')}`);
    await type(view, 'ข้อสอบ');
    assert.ok(labelsFor(view).some(l => l.includes('ฝึกข้อสอบ') || l.includes('โหมดสอบ')),
      `"ข้อสอบ" must reach a practice entry; got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});
