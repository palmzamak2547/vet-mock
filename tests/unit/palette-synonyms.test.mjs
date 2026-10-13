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
import { readFileSync } from 'node:fs';
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
  // One question whose stem hides the English alternate of "เกม" inside another word (ligA-MEnt: "game").
  { match: '/data/questions\\.js$', contents: 'export const QB = [{ id: 9001, subject: "surg", q: "Cranial cruciate ligament rupture in the dog", tags: [] }];' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = { a: { title: "COM5 respiratory clip", subject: "com5", videoId: "vid-c5", instructor: "Dr A" }, b: { title: "COM3 renal clip", subject: "com3", videoId: "vid-c3", instructor: "Dr B" }, c: { title: "วิดีโอ ระบบหายใจ", subject: "anat", videoId: "vid-th", instructor: "Dr C" }, d: { title: "Respiratory overview", subject: "anat", videoId: "vid-en", instructor: "Dr D" } };' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {};' },
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => []; export const detectStudyIntent = () => null; export const studyActions = () => ({ actions: [], missing: null });' },
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

// 5.144.5 renamed พักกับ Mochi to พักใจ and gave the game one name. A student
// types what the cards used to say, or what the door says now.
test('the rest page and its game answer to their old names and to the door\'s', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    for (const [query, label] of [['พักกับ Mochi', 'พักใจ'], ['พักกับ', 'พักใจ'], ['มินิเกม', 'เกมลูกไก่หนีเชื้อโรค'], ['เกมลูกไก่', 'เกมลูกไก่หนีเชื้อโรค'], ['ลูกไก่หนีเชื้อโรค', 'เกมลูกไก่หนีเชื้อโรค']]) {
      await type(view, query);
      assert.ok(labelsFor(view).some(l => l.includes(label)), `"${query}" must reach ${label}; got ${labelsFor(view).join(' | ')}`);
    }
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

    // The ranks themselves. "วิดีโอ" is in the title of one clip summary and
    // reaches every other summary only through its dictionary words (video,
    // คลิป, summary). The literal one has to come first.
    await type(view, 'วิดีโอ');
    const ranked = labelsFor(view);
    const literal = ranked.findIndex(l => l.includes('วิดีโอ ระบบหายใจ'));
    const viaDictionary = ranked.findIndex(l => l.includes('Respiratory overview'));
    assert.ok(literal >= 0 && viaDictionary >= 0, `both clips must be found; got ${ranked.join(' | ')}`);
    assert.ok(literal < viaDictionary,
      `the title that contains "วิดีโอ" must rank above a clip found only through the dictionary; got ${ranked.join(' | ')}`);
  } finally { view.unmount(); }
});

test('a synonym widens only feature actions and clip summaries, never a question stem that holds the letters', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    // "เกม" -> "game": the mini game, but not "ligament", which hides g-a-m-e inside it.
    await type(view, 'เกม');
    const labels = labelsFor(view);
    assert.ok(labels.some(l => l.includes('เกมลูกไก่หนีเชื้อโรค')), `"เกม" must still reach the game; got ${labels.join(' | ')}`);
    assert.ok(!labels.some(l => l.includes('ligament')),
      `a question stem is matched literally only; got ${labels.join(' | ')}`);
    // The same stem is still found by its own words.
    await type(view, 'ligament');
    assert.ok(labelsFor(view).some(l => l.includes('Cranial cruciate ligament')), `got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});

test('a prefix glued to a course code searches the code, like the same words with a space', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'สรุปวิชา com5');
    const spaced = labelsFor(view);
    assert.ok(spaced.some(l => l.includes('COM5 respiratory clip')), `the spaced query must reach the COM5 clip; got ${spaced.join(' | ')}`);
    assert.ok(!spaced.some(l => l.includes('COM3 renal clip')), `another course must not match; got ${spaced.join(' | ')}`);
    for (const glued of ['สรุปวิชาcom5', 'สรุปวิชาCOM5', 'สรุปcom5']) {
      await type(view, glued);
      assert.deepEqual(labelsFor(view), spaced, `"${glued}" must behave like "สรุปวิชา com5"`);
    }
    // Still conjunctive: a code that matches nothing finds nothing.
    await type(view, 'สรุปวิชาzzzz');
    assert.equal(resultRows(view).length, 0, `got ${labelsFor(view).join(' | ')}`);
  } finally { view.unmount(); }
});

test('the palette source has no stray math symbol inside a Thai word, and the comment keeps its tone marks', () => {
  const source = readFileSync(new URL('../../src/components/CommandPalette.jsx', import.meta.url), 'utf8');
  // U+22FB once sat inside "แต่คำเหล่านี้ป...นำไปหา" in the synonym comment.
  const block = (from, to) => `[${String.fromCharCode(from)}-${String.fromCharCode(to)}]`;
  const thai = block(0x0E00, 0x0E7F);
  const stray = source.match(new RegExp(`${thai}${block(0x2200, 0x22FF)}${thai}`, 'g')) || [];
  assert.deepEqual(stray, [], 'a symbol from the math block sits between two Thai letters');
  assert.ok(source.includes('ไม่กลายเป็นการเดา'), 'the "never a guess" note lost its tone mark again');
});

// The box is cleared when the palette closes, never by an effect after it
// opens: that effect runs once the box is on screen, and on vetmock.com it
// wiped what a quick typist had already typed (WebKit, 5.144.4).
test('the palette keeps what was typed while open, and starts empty the next time', async () => {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try {
    await settle(view);
    await type(view, 'ketamine');
    view.update({ open: true });
    view.flush();
    assert.equal(searchInput(view).props.value, 'ketamine', 'a render while open keeps the query');
    view.update({ open: false });
    view.flush();
    view.update({ open: true });
    view.flush();
    assert.equal(searchInput(view).props.value, '', 'the next open starts empty');
  } finally { view.unmount(); }
  const src = readFileSync(new URL('../../src/components/CommandPalette.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /if \(open\) \{\s*setQuery\(''\)/, 'no clearing in the branch that runs on open');
});
