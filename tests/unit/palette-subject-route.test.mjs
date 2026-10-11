// ============================================================
// palette-subject-route.test.mjs — a subject picked in search starts clean
// ============================================================
// OV-exam-3 (triage 2026-10-12): Home's "ซ้อมใกล้สอบ" leaves practiceMode at
// 'current-scope'. Picking another subject from ⌘K only called setSubject and
// opened the topic screen, which never resets the mode, so the next practice
// set for the new subject was still scoped to the old shortcut. A subject
// chosen from search is a fresh start: no topic, the whole-subject mode.
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
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => []; export const detectStudyIntent = () => null; export const studyActions = () => ({ actions: [], missing: null });' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [];' },
  { match: '/lib/library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

const resultRows = (view) => findAll(view.tree, (node) => node.type === 'button' && node.props['data-flat-idx'] != null);
const searchInput = (view) => findAll(view.tree, (node) => node.type === 'input' && node.props['aria-label'] === 'ค้นหาใน VetMock')[0];

test('a subject chosen from search clears a leftover topic and practice scope before opening it', async () => {
  const calls = [];
  const view = mount(CommandPalette, {
    open: true, onClose() {}, selectedYear: 4, signedIn: true, ownerId: 'A',
    setSubject: (value) => calls.push(['subject', value]),
    setTopic: (value) => calls.push(['topic', value]),
    setPracticeMode: (value) => calls.push(['mode', value]),
    goView: (value) => calls.push(['view', value]),
  });
  try {
    await settle(view);
    searchInput(view).props.onChange({ target: { value: 'COM V' } });
    view.flush();
    await new Promise((resolve) => setTimeout(resolve, 90));
    view.flush();
    const row = resultRows(view).find((node) => textOf(node).includes('COM V'));
    assert.ok(row, `the COM V subject row must be listed; got ${resultRows(view).map(textOf).join(' | ')}`);
    row.props.onClick();
    assert.deepEqual(calls, [['topic', null], ['mode', 'all'], ['subject', 'com5'], ['view', 'topic-select']]);
  } finally { view.unmount(); }
});
