// Lane Y (polish 2026-10-20): the search palette for screen readers and
// phones. Combobox + listbox semantics tied to the keyboard's active row,
// 44 px controls and 14 px Thai on touch, a placeholder that fits 360 px,
// and human labels instead of question ids and tag slugs.
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
// A phone: coarse pointer, narrow screen, reduced motion (placeholder parks).
globalThis.matchMedia = () => ({ matches: true });
window.SpeechRecognition = function SR() {};

const QUESTION = { id: 91033, subject: 'com5', topic: 'cve', q: 'ลูกสุนัขอายุ 8 สัปดาห์ ถ่ายเหลวเป็นเลือด อาเจียน สาเหตุที่เป็นไปได้มากที่สุดคือข้อใด', tags: ['equine-imaging', 'parvo'] };
globalThis.__paletteQB = [QUESTION];

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
  { match: '/lib/omni-intents\\.js$', contents: 'export const detectIntents = () => []; export const detectStudyIntent = () => null; export const studyActions = () => ({ actions: [], missing: null });' },
  { match: '/lib/omni-sources\\.js$', contents: 'export const OMNI_SOURCES = [];' },
  { match: '/lib/library\\.js$', contents: 'export const docOpenMode = () => ({ action: "read" }); export const readerPayload = doc => doc; export const recordRecentDoc = () => {}; export const resolveDocUrl = async () => "";' },
] });

function setup({ notes = {} } = {}) {
  storage.values.clear();
  storage.setItem('vmx-notes', JSON.stringify(notes));
  storage.setItem('vmx-user-sync-owner-v1', JSON.stringify('A'));
  window.dispatchEvent(new Event('vmx-palette-invalidate'));
  return mount(CommandPalette, { open: true, onClose() {}, selectedYear: 4, signedIn: true, ownerId: 'A' });
}
const input = view => findAll(view.tree, n => n.type === 'input' && n.props['aria-label'] === 'ค้นหาใน VetMock')[0];
const rows = view => findAll(view.tree, n => n.type === 'button' && n.props['data-flat-idx'] != null);
const byId = (view, id) => findAll(view.tree, n => n.props?.id === id)[0];
async function typed(view, value) {
  await settle(view);
  input(view).props.onChange({ target: { value } });
  view.flush();
  await new Promise(res => setTimeout(res, 80)); // the 60 ms debounce
  await settle(view);
}

test('the search box is a combobox that names the listbox and the active row', async () => {
  const view = setup();
  try {
    await settle(view);
    const box = input(view);
    assert.equal(box.props.role, 'combobox');
    assert.equal(box.props['aria-expanded'], true);
    assert.equal(box.props['aria-autocomplete'], 'list');
    const listbox = byId(view, box.props['aria-controls']);
    assert.ok(listbox, 'aria-controls points at an element');
    assert.equal(listbox.props.role, 'listbox');

    const options = findAll(listbox, n => n.props?.role === 'option' && n.props['data-flat-idx'] != null);
    assert.ok(options.length >= 2, 'rows are options');
    const ids = options.map(o => o.props.id);
    assert.equal(new Set(ids).size, ids.length, 'option ids are unique');
    assert.equal(box.props['aria-activedescendant'], options[0].props.id);
    assert.equal(options[0].props['aria-selected'], true);
    assert.equal(options[1].props['aria-selected'], false);

    // Groups are labelled by their visible heading.
    const groups = findAll(listbox, n => n.props?.role === 'group');
    assert.ok(groups.length > 0);
    for (const g of groups) {
      const head = byId(view, g.props['aria-labelledby']);
      assert.ok(head && textOf(head).trim(), 'group heading exists and has text');
    }

    // Arrow keys move the active descendant exactly as they move the highlight.
    const firstId = options[0].props.id;
    input(view).props.onKeyDown({ key: 'ArrowDown', preventDefault() {} });
    view.flush();
    const after = findAll(view.tree, n => n.props?.role === 'option' && n.props['data-flat-idx'] === 1)[0];
    assert.equal(input(view).props['aria-activedescendant'], after.props.id);
    assert.equal(after.props['aria-selected'], true);
    assert.equal(after.props.id, ids[1], 'the id of a row is stable across renders');
    assert.notEqual(after.props.id, firstId);
  } finally { view.unmount(); }
});

test('on touch, rows and controls are 44 px tall and Thai text is 14 px', async () => {
  const view = setup();
  try {
    await settle(view);
    for (const row of rows(view)) {
      assert.ok(Number(row.props.style.minHeight) >= 44, `row ${row.props['data-flat-idx']} min-height`);
      for (const div of findAll(row, n => n.type === 'div' && n.props.style?.fontSize != null)) {
        assert.ok(Number(div.props.style.fontSize) >= 14, `row text ${div.props.style.fontSize}px`);
      }
    }
    const more = findAll(view.tree, n => n.type === 'button' && /แสดงเพิ่ม/.test(textOf(n)))[0];
    assert.ok(more, 'a group is long enough to show "แสดงเพิ่ม"');
    assert.ok(Number(more.props.style.minHeight) >= 44);
    assert.ok(Number(more.props.style.fontSize) >= 14);
    const mic = findAll(view.tree, n => n.type === 'button' && /เสียง/.test(n.props['aria-label'] || ''))[0];
    assert.ok(mic && Number(mic.props.style.height) >= 44 && Number(mic.props.style.width) >= 44, 'voice button is 44 px');
  } finally { view.unmount(); }
});

test('the placeholder is short enough for a 360 px phone', async () => {
  const view = setup();
  try {
    await settle(view);
    // 208 px is what the input gets at 360 px; Sarabun 16 px measured ~7.3 px
    // per Thai character, so 22 characters is the ceiling.
    const placeholder = input(view).props.placeholder;
    assert.ok(placeholder.length <= 22, `"${placeholder}" is ${placeholder.length} characters`);
  } finally { view.unmount(); }
});

test('a question row shows its course and topic, never its id or tag slugs', async () => {
  const view = setup({ notes: { 91033: 'parvo ต้องแยก coronavirus' } });
  try {
    await typed(view, 'ลูกสุนัขอายุ');
    const q = rows(view).find(r => /ลูกสุนัข/.test(textOf(r)));
    assert.ok(q, 'the question is found');
    const text = textOf(q);
    assert.doesNotMatch(text, /91033/);
    assert.doesNotMatch(text, /equine-imaging|parvo/);
    assert.match(text, /COM V/);
    assert.match(text, /CVE — CPV \/ CCV/);

    await typed(view, 'coronavirus');
    const note = rows(view).find(r => /coronavirus/.test(textOf(r)));
    assert.ok(note, 'the note is found');
    assert.doesNotMatch(textOf(note), /91033/);
    assert.match(textOf(note), /COM V/);
  } finally { view.unmount(); }
});

test('a tag slug still finds its question', async () => {
  const view = setup();
  try {
    await typed(view, 'equine-imaging');
    assert.ok(rows(view).some(r => /ลูกสุนัข/.test(textOf(r))));
  } finally { view.unmount(); }
});
