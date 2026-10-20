// ============================================================
// notes-phone-reading — the topic is the first thing on a phone, and the
// end of a topic leads to the next one
// ============================================================
// Up to 880px the topic sidebar used to stack above the article: every
// subject pill of the year plus every topic, capped into a nested scroll box,
// so the topic the student had just chosen started a screen and a half down
// (owner review 2026-10-12: phone 4/10 against iPad 8/10). The narrow layout
// now gets one native picker row per choice (CSS hides the sidebar there),
// the topic header says where in the subject the student is, printing sits
// with the topic on every screen, and the end of a topic offers the next.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';

const NOTES = {
  first: { title: 'First topic', icon: '', sections: [{ heading: 'One', body: ['Body one'] }] },
  second: { title: 'Second topic', icon: '', lecturer: 'Aj. Example', sections: [{ heading: 'Two', body: ['Body two'] }] },
  third: { title: 'Third topic', icon: '', sections: [{ heading: 'Three', body: ['Body three'] }] },
};
globalThis.__notesFixture = NOTES;

const { default: NotesView } = await loadModule('src/views/NotesView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: '/data/note-corpus\\.js$', contents: `
    export const NOTE_SUBJECT_IDS = ['fixture-a', 'fixture-b'];
    export const clearNotesSubjectCache = () => {};
    export const getCachedNotesSubject = () => globalThis.__notesFixture;
    export const loadNotesSubject = async () => globalThis.__notesFixture;
    export const preloadNotesSubject = () => {};` },
  { match: '/data/curriculum\\.js$', contents: `
    export const SUBJECTS = [
      { id: 'fixture-a', name: 'Fixture A', icon: '', semester: 1, topics: [{ id: 'first' }, { id: 'second' }, { id: 'third' }] },
      { id: 'fixture-b', name: 'Fixture B', icon: '', semester: 2, topics: [] },
    ];
    export const YEARS = [{ id: 5, label: 'ปี 5' }];
    export const yearForSubject = () => 5;` },
  { match: '/components/(Mochi|ReadingEffects|MotionLoader|SlideFigures|ConflictNote|FeatureTip|ImageAnnotator|TemplateLibrary|BackBar|NavIcon)\\.jsx$',
    contents: 'export default (p) => p && p.children ? p.children : null;' },
  { match: '/components/MotionFeedback\\.jsx$', contents: 'export const MotionEnter = (p) => p.children;' },
  { match: '/lib/richtext\\.jsx$', contents: 'export const RichText = (p) => p.text;' },
  { match: '/lib/vetwiki/registry\\.js$', contents: 'export const hasTopic = () => false;' },
  { match: '/lib/vetwiki/corrections\\.js$', contents: 'export const correctionsFor = () => [];' },
  { match: '/lib/vetwiki/schema\\.js$', contents: 'export const sectionId = (s, t, h) => `${s}--${t}--${h}`;' },
  { match: '/lib/feature-registry\\.js$', contents: 'export const FEATURE_FLAGS = {};' },
  { match: '/lib/note-retry\\.js$', contents: 'export const saveNoteRetryTarget = () => true;' },
  { match: '/lib/quests\\.js$', contents: "export const recordQuestEvent = () => {}; export const todayKey = () => '2026-10-12';" },
] });

function view(t) {
  const prior = { window: globalThis.window, localStorage: globalThis.localStorage };
  globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  globalThis.window = { history: { state: null, replaceState() {} }, print() { view.printed = (view.printed || 0) + 1; } };
  const v = mount(NotesView, { subject: 'fixture-a', initialTopic: 'first', goHome: () => {} });
  t.after(() => { v.unmount(); globalThis.window = prior.window; globalThis.localStorage = prior.localStorage; });
  return v;
}
const heading = (v) => textOf(findAll(v.tree, n => n.type === 'h2')[0]).trim();
const pickers = (v) => findAll(v.tree, n => n.type === 'select');

test('a native topic picker lists every topic in order and opens the chosen one', async t => {
  const v = view(t);
  await settle(v);
  const [subjectPicker, topicPicker] = pickers(v); // subject first: the topics depend on it
  assert.ok(topicPicker, 'the narrow layout has a topic picker');
  assert.deepEqual(findAll(topicPicker, n => n.type === 'option').map(textOf), ['1. First topic', '2. Second topic', '3. Third topic']);
  assert.equal(topicPicker.props.value, 'first');
  assert.ok(subjectPicker, 'and a subject picker grouped by year');
  assert.equal(findAll(subjectPicker, n => n.type === 'optgroup')[0].props.label, 'ปี 5');
  topicPicker.props.onChange({ target: { value: 'second' } });
  await settle(v);
  assert.equal(heading(v), 'Second topic');
  assert.match(textOf(v.tree), /หัวข้อ 2 จาก 3, ผู้สอน Aj\. Example/, 'the header says where in the subject this is');
});

test('the end of a topic offers the next and the previous one', async t => {
  const v = view(t);
  await settle(v);
  const pager = () => findAll(v.tree, n => n.type === 'nav' && n.props['aria-label'] === 'หัวข้อก่อนหน้าและถัดไป')[0];
  assert.equal(findAll(pager(), n => n.type === 'button').length, 1, 'the first topic has only a next');
  assert.match(textOf(pager()), /หัวข้อถัดไป.*Second topic/);
  findAll(pager(), n => n.type === 'button')[0].props.onClick();
  await settle(v);
  assert.equal(heading(v), 'Second topic');
  assert.match(textOf(pager()), /หัวข้อก่อนหน้า.*First topic/);
  assert.match(textOf(pager()), /หัวข้อถัดไป.*Third topic/);
});

test('printing sits with the topic, so a phone can reach it', async t => {
  const v = view(t);
  await settle(v);
  // The label stays exactly "พิมพ์": the how-to guide and the daily hint tell
  // students to press that word on this page.
  const print = findAll(v.tree, n => n.type === 'button' && textOf(n).trim() === 'พิมพ์');
  assert.equal(print.length, 1, 'one print control, not one per column');
  print[0].props.onClick();
  assert.equal(view.printed, 1);
  const search = findAll(v.tree, n => n.type === 'input' && n.props.type === 'search')[0];
  assert.equal(search.props.placeholder, 'ค้นหาในหัวข้อนี้', 'plain Thai, no English word in the hint');
});

test('the narrow layout swaps the sidebar for the picker and reads at 16px', () => {
  const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const block = css.slice(css.indexOf('/* === night-a2 === */'), css.indexOf('/* === end night-a2 === */'));
  const narrow = block.slice(block.indexOf('@media (max-width: 880px)'));
  assert.match(narrow, /\.vmx-notes-sidebar \{ display: none; \}/);
  assert.match(narrow, /\.vmx-notes-picker \{[^}]*display: grid/);
  assert.match(narrow, /\.vmx-notes-section-body \{[^}]*font-size: var\(--text-md\)/);
  assert.match(narrow, /select \{[^}]*font-size: max\(16px, 1em\)/, 'iOS does not zoom on a 16px select');
  assert.match(block, /@media print \{\s*\.vmx-notes-picker, \.vmx-notes-pager, \.vmx-reading-return \{ display: none !important; \}/);
});

test('a search that finds nothing offers one way back to the whole topic', async t => {
  const v = view(t);
  await settle(v);
  const search = () => findAll(v.tree, n => n.type === 'input' && n.props.type === 'search')[0];
  search().props.onChange({ target: { value: 'no such words' } });
  v.flush();
  await new Promise((resolve) => setTimeout(resolve, 120));
  await settle(v);
  const clear = findAll(v.tree, n => n.type === 'button' && textOf(n).trim() === 'ล้างคำค้น')[0];
  assert.ok(clear, 'the empty result has its next step');
  clear.props.onClick();
  await settle(v);
  assert.equal(search().props.value, '');
  assert.equal(findAll(v.tree, n => n.type === 'button' && textOf(n).trim() === 'ล้างคำค้น').length, 0);
});

test('a long topic has a way back to its header, observed rather than polled', () => {
  const src = readFileSync(new URL('../../src/views/NotesView.jsx', import.meta.url), 'utf8');
  assert.match(src, /new IntersectionObserver\(/);
  assert.doesNotMatch(src, /addEventListener\('scroll'/);
  assert.match(src, /className="vmx-wiki-toc-return vmx-reading-return" onClick=\{backToTopicHead\}/);
  assert.match(src, /motionIsReduced\(\) \? 'auto' : 'smooth'/);
});
