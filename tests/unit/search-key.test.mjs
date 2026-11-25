// ============================================================
// search-key.test.mjs: one folding rule for every search box, and a
// search box that counts and reaches every hit
// ============================================================
// A word pasted from a PDF or LINE carries a zero-width space or a sara am
// written as two characters, and a Thai keyboard types ๒๕๖๙; each found
// nothing in the search box, the shelf, the notes, the clips and the subject
// list. The box itself cut its hits to 80 before grouping them, so a busy word
// counted 80 in total and "a" showed no question at all; it searched only the
// first 100 characters of a stem; and it took two questions whose first 50
// characters match for one (57 different questions in the bank were hidden).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { searchKey, searchTerms, matchesAll } from '../../src/lib/search-key.js';
import { indexDocs, filterIndexed } from '../../src/lib/library.js';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

const ZWSP = String.fromCharCode(0x200B);
const NIKHAHIT = String.fromCharCode(0x0E4D);
const MAI_THO = String.fromCharCode(0x0E49);
const SARA_AA = String.fromCharCode(0x0E32);
// "น้ำตาล" as PDF text layers store it: the tone, then sara am in two pieces.
const SUGAR_PDF = 'น' + MAI_THO + NIKHAHIT + SARA_AA + 'ตาล';

test('one key for the forms a typed or pasted word arrives in', () => {
  assert.equal(searchKey('พิษ' + ZWSP + 'สุนัขบ้า'), 'พิษสุนัขบ้า');
  assert.equal(searchKey(SUGAR_PDF), 'น้ำตาล');
  assert.equal(searchKey('น' + NIKHAHIT + MAI_THO + SARA_AA + 'ตาล'), 'น้ำตาล', 'nikhahit before the tone');
  assert.equal(searchKey('ปี ๒๕๖๙'), 'ปี 2569');
  assert.equal(searchKey('  Rabies\n\tVIRUS  '), 'rabies virus');
  assert.equal(searchKey('e' + String.fromCharCode(0x0301)), String.fromCharCode(0xE9), 'NFC');
  assert.notEqual(searchKey('ไก่'), searchKey('ไก'), 'a tone mark is part of the word');
  assert.equal(searchKey(null), '');
  assert.deepEqual(searchTerms('  ๒๕๖๙   Rabies '), ['2569', 'rabies']);
  assert.deepEqual(searchTerms(''), []);
  assert.ok(matchesAll('rabies vaccine dog', ['dog', 'rabies']), 'every word, in any order');
  assert.ok(!matchesAll('rabies vaccine', ['rabies', 'cat']));
  assert.ok(matchesAll('anything', []));
});

test('the document shelf finds a title by a pasted or Thai-digit query', () => {
  const index = indexDocs([{ id: 'a', title: 'น้ำตาลในเลือด ปี 2569', subject: 'x' }, { id: 'b', title: 'Renal', subject: 'x' }]);
  assert.deepEqual(filterIndexed(index, { query: SUGAR_PDF + ' ๒๕๖๙' }).map((d) => d.id), ['a']);
  assert.deepEqual(filterIndexed(index, { query: 'Re' + ZWSP + 'nal' }).map((d) => d.id), ['b']);
});

// ── The search box over a bank shaped like the real one ─────────────────
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

const SHARED = 'Which of the following is the drug of choice for a ';
const BANK = [
  ...Array.from({ length: 90 }, (_, i) => ({ id: 7000 + i, subject: 'com5', q: `Rabies exposure, case ${i}: which step comes first?`, tags: [] })),
  { id: 8001, subject: 'com5', q: SHARED + 'dog with leptospirosis?', tags: [] },
  { id: 8002, subject: 'com5', q: SHARED + 'cow with brucellosis?', tags: [] },
  { id: 8003, subject: 'com5', q: 'A seven-year-old intact male Labrador is presented with a three-day history of lethargy and anorexia. On examination the oral mucosa shows ulceration. What is the next step?', tags: [] },
  { id: 8004, subject: 'com5', q: 'น้ำตาลในเลือดต่ำในลูกสุนัขแรกเกิด ปี 2569 เกิดจากอะไร', tags: [] },
];
globalThis.__searchKeyBank = BANK;

const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = globalThis.__searchKeyBank;' },
  { match: '/data/schedule\\.js$', contents: 'export const getUpcomingExams = () => []; export const fmtThaiDate = () => "";' },
  { match: '/data/video-summaries-meta\\.js$', contents: 'export const VIDEO_META = { a: { title: "Rabies in Thailand", subject: "com5", videoId: "vid-r", instructor: "Dr A" } };' },
  { match: '/data/instructors\\.js$', contents: 'export const ALL_INSTRUCTORS = [];' },
  { match: '/data/question-delivery\\.generated\\.js$', contents: 'export const isQuestionDeliverable = () => true;' },
  { match: '/lib/user-flashcards\\.js$', contents: 'export const loadUserFlashcards = () => [];' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const listTopics = () => [];' },
  { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '(^|/)ErrorBoundary\\.jsx$', contents: 'export default ({ children }) => children;' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = () => {}; export const confirmDialog = async () => false;' },
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => []; export const detectStudyIntent = () => null; export const studyActions = () => ({ actions: [], missing: null });' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [];' },
  { match: '/lib/library\\.js$', contents: 'export const openDocInTab = async () => {}; export const displayDocTitle = t => t; export const openDocOrOffer = async () => "opened"; export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

const searchInput = (view) => findAll(view.tree, (n) => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const rows = (view) => findAll(view.tree, (n) => n.type === 'button' && n.props['data-flat-idx'] != null).map((n) => textOf(n));
// The number a group's header shows, or null when the group is not listed.
function groupCount(view, type) {
  const head = findAll(view.tree, (n) => typeof n.props?.id === 'string' && n.props.id.endsWith(`-group-${type}`))[0];
  if (!head) return null;
  return Number((textOf(head).match(/[\d,]+$/) || ['0'])[0].replace(/,/g, ''));
}
async function type(view, query) {
  searchInput(view).props.onChange({ target: { value: query } });
  view.flush();
  await new Promise((res) => setTimeout(res, 90));
  view.flush();
  return view;
}
async function withPalette(fn) {
  const view = mount(CommandPalette, { open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A' });
  try { await settle(view); await fn(view); } finally { view.unmount(); }
}

test('a group counts every hit, and a busy group never pushes another group out', async () => {
  assert.ok(SHARED.length >= 50);
  await withPalette(async (view) => {
    await type(view, 'rabies');
    assert.equal(groupCount(view, 'question'), 90, 'all 90 questions are counted');
    assert.equal(groupCount(view, 'summary'), 1, 'the clip is still listed beside them');
    const shown = rows(view).filter((r) => r.includes('Rabies exposure')).length;
    assert.ok(shown > 0 && shown < 90, 'a group shows its first rows, with the rest one tap away');
  });
});

test('a word typed with a zero-width space, a split sara am or Thai digits finds what the plain word finds', async () => {
  await withPalette(async (view) => {
    await type(view, 'rabies');
    const plain = rows(view);
    await type(view, 'ra' + ZWSP + 'bies');
    assert.deepEqual(rows(view), plain);
    await type(view, SUGAR_PDF);
    assert.ok(rows(view).some((r) => r.includes('น้ำตาลในเลือดต่ำ')), `got ${rows(view).join(' | ')}`);
    await type(view, '๒๕๖๙');
    assert.ok(rows(view).some((r) => r.includes('น้ำตาลในเลือดต่ำ')), `got ${rows(view).join(' | ')}`);
  });
});

test('two questions that open alike are two rows, and a word late in a stem finds its question', async () => {
  await withPalette(async (view) => {
    await type(view, 'brucellosis');
    assert.ok(rows(view).some((r) => r.includes('Which of the following')), 'the second of two look-alike stems is listed');
    await type(view, 'leptospirosis');
    assert.ok(rows(view).some((r) => r.includes('Which of the following')), 'and so is the first');
    await type(view, 'ulceration');
    assert.ok(rows(view).some((r) => r.includes('seven-year-old')), 'a word past the 100 characters the row shows');
  });
});
