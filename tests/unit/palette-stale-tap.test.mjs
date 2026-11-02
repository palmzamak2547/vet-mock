// palette-stale-tap — a tap answers for the text in the search box (2 Nov 2026)
// The list applies the box's text 60 ms after it is typed. A paste followed by
// a quick tap landed on a row the previous text had drawn and opened that one.
// A row the box's text still finds opens at once; anything only the previous
// text drew (rows, the course card) does nothing, and the list catches up.
// The palette's real source; only the data modules are stubbed.
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
window.SpeechRecognition = class { start() { globalThis.__rec = this; } stop() { this.onend?.(); } };

globalThis.__paletteQB = [
  { id: 1, subject: 'com5', topic: 'x', q: 'Ketamine stem for the palette test', tags: [] },
  { id: 2, subject: 'com5', topic: 'x', q: 'Xylazine stem for the palette test', tags: [] },
];

const { default: CommandPalette } = await loadModule('src/components/CommandPalette.jsx', { stubs: [
  { match: '/data/questions\\.js$', contents: 'export const QB = globalThis.__paletteQB;' },
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
  // "com5" names a course: the card with its practice button.
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = (q) => (/com5/i.test(q) ? [{ kind: "course", code: "COM5", meta: { id: "com5", name: "COM V", has_questions: true } }] : []); export const detectStudyIntent = () => null; export const studyActions = () => ({ actions: [], missing: null });' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [];' },
  { match: '/lib/library\\.js$', contents: 'export const openDocInTab = async () => {}; export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

function setup() {
  storage.values.clear();
  const calls = [];
  const view = mount(CommandPalette, {
    open: true, onClose() {}, selectedYear: 5, signedIn: true, ownerId: 'A',
    onOpenQuestion: async (id) => { calls.push(['question', id]); return true; },
    setSubject: (id) => calls.push(['subject', id]),
  });
  return { view, calls };
}
const input = (view) => findAll(view.tree, (n) => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const row = (view, text) => findAll(view.tree, (n) => n.type === 'button' && n.props['data-flat-idx'] != null && textOf(n).includes(text))[0];
const practice = (view) => findAll(view.tree, (n) => n.type === 'button' && textOf(n).includes('ฝึกข้อสอบวิชานี้'))[0];
const list = (view) => findAll(view.tree, (n) => n.type === 'div' && Object.hasOwn(n.props, 'aria-busy'))[0];
// The box changes; the list has not applied it yet.
async function paste(view, value) {
  await settle(view);
  input(view).props.onChange({ target: { value } });
  view.flush();
}
async function typed(view, value) {
  await paste(view, value);
  await new Promise((resolve) => setTimeout(resolve, 80)); // the 60 ms debounce
  await settle(view);
}

test('a row only the previous text drew does nothing, and the row for the new text opens', async () => {
  const { view, calls } = setup();
  await typed(view, 'ketamine');
  await paste(view, 'xylazine');
  assert.equal(list(view).props['aria-busy'], true);
  row(view, 'Ketamine stem').props.onClick();
  await settle(view);
  assert.deepEqual(calls, []);

  await new Promise((resolve) => setTimeout(resolve, 80));
  await settle(view);
  assert.equal(row(view, 'Ketamine stem'), undefined);
  row(view, 'Xylazine stem').props.onClick();
  await settle(view);
  assert.deepEqual(calls, [['question', 2]]);
});

test('a row the new text still finds opens at once, before the list catches up', async () => {
  const { view, calls } = setup();
  await typed(view, 'keta');
  await paste(view, 'ketamine');
  row(view, 'Ketamine stem').props.onClick();
  await settle(view);
  assert.deepEqual(calls, [['question', 1]]);
});

test('a recent row the new text still finds opens at once', async () => {
  const { view, calls } = setup();
  storage.setItem('vmx-omni-recents', JSON.stringify([{ type: 'question', label: 'Ketamine stem for the palette test', payload: { subject: 'com5', id: 1 } }]));
  await typed(view, 'k');
  await typed(view, '');
  await paste(view, 'ketamine');
  row(view, 'Ketamine stem').props.onClick();
  await settle(view);
  assert.deepEqual(calls, [['question', 1]]);
});

test('the course card the previous text drew does nothing', async () => {
  const { view, calls } = setup();
  await typed(view, 'com5');
  await paste(view, 'xylazine');
  practice(view).props.onClick();
  await settle(view);
  assert.deepEqual(calls, []);
});

// The guard compares the box's text with the text the list applied. Were the
// debounce ever to trim it, "com5 " would never match "com5" and every card
// and link would stay shut for good.
test('text ending in a space settles: the list is not busy and the card opens', async () => {
  const { view, calls } = setup();
  await typed(view, 'com5 ');
  assert.equal(list(view).props['aria-busy'], undefined);
  practice(view).props.onClick();
  await settle(view);
  assert.deepEqual(calls, [['subject', 'com5']]);
});

// A text input drops a line break from its value; a query that kept one
// never matched the box again.
test('a spoken transcript with a line break reaches the box as one line', async () => {
  const { view } = setup();
  await settle(view);
  findAll(view.tree, (n) => n.type === 'button' && n.props['aria-label'] === 'สั่งงานหรือถามด้วยเสียง')[0].props.onClick();
  view.flush();
  globalThis.__rec.onresult({ results: [[{ transcript: 'ketamine\r\nstem' }]] });
  view.flush();
  assert.equal(input(view).props.value, 'ketamine stem');
});
