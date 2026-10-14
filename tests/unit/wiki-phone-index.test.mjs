// ============================================================
// wiki-phone-index — VetWiki on a phone: subjects first, a way back up
// ============================================================
// At 390px the index was one 33,000px column of 210 topic summaries, in
// subject order with the reader's own year wherever it happened to fall. The
// subjects now come with the reader's year first, fold on a phone (wider
// screens keep them open), and a search opens every subject it found
// something in. A long article offers a way back to its contents once the
// contents have scrolled away, decided by an observer rather than a scroll
// listener.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { storedSelectedYear, COMPACT_READING_QUERY } from '../../src/lib/reading-layout.js';
import { yearForSubject } from '../../src/data/curriculum.js';

const store = (value) => ({ getItem: (k) => (k === 'vmx-selected-year' ? value : null) });

test('the stored year is read the way App writes it', () => {
  assert.equal(storedSelectedYear(store('5')), 5);
  assert.equal(storedSelectedYear(store('"4"')), 4);
  assert.equal(storedSelectedYear(store('null')), null, 'useLocalStorage writes the string null before a pick');
  assert.equal(storedSelectedYear(store(null)), null);
  assert.equal(storedSelectedYear(store('{oops')), null);
  assert.equal(storedSelectedYear(null), null);
});

const { default: KnowledgeView } = await loadModule('src/views/KnowledgeView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/(FeatureTip|ReadingEffects|ReportConcern|SlideFigures|ConflictNote|StatePanel|OptionalFeature)\\.jsx$',
    contents: 'export default (p) => (p && p.children) || null;' },
] });

function browser(t, { compact, year = '5' }) {
  // These tests are about the list view; the index opens on the shelves.
  const local = { getItem: (k) => (k === 'vmx-selected-year' ? year : k === 'vmx-wiki-layout' ? 'list' : null), setItem() {}, removeItem() {} };
  globalThis.localStorage = local;
  globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  globalThis.window = {
    localStorage: local, location: new URL('https://vetmock.com/wiki'),
    matchMedia: (q) => ({ matches: compact && q === COMPACT_READING_QUERY }),
    history: { state: null, pushState() {}, replaceState() {} },
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout,
  };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage']) delete globalThis[k]; });
}
const toggles = (v) => findAll(v.tree, (n) => n.type === 'button' && /vmx-wiki-subject-toggle/.test(n.props.className || ''));
const subjectSections = (v) => findAll(v.tree, (n) => n.type === 'section' && /vmx-wiki-subject/.test(n.props.className || ''));
const topicRows = (v) => subjectSections(v).flatMap((section) => findAll(section, (n) => n.type === 'li'));

test('on a phone the index is a short list of subjects, the reader\'s year first', async (t) => {
  browser(t, { compact: true });
  const v = mount(KnowledgeView, { goHome() {}, setView() {} });
  await settle(v);
  const rows = toggles(v);
  assert.ok(rows.length >= 10, 'one row per subject');
  assert.ok(rows.every((b) => b.props['aria-expanded'] === false), 'every subject starts folded');
  assert.equal(topicRows(v).length, 0, 'no topic is listed until a subject opens');
  // The first subject belongs to year 5, the reader's year, and every year-5
  // subject comes before any other year's.
  const years = subjectSections(v).map((section) => yearForSubject(section.key));
  assert.equal(years[0], 5);
  assert.equal(years.lastIndexOf(5), years.filter((y) => y === 5).length - 1);
  // WikiIndex is a nested component, which this harness renders statelessly,
  // so the tap itself is proven in the browser pass, not here.
  assert.equal(typeof rows[0].props.onClick, 'function');
  v.unmount();
});

test('wider screens keep every subject open', async (t) => {
  browser(t, { compact: false });
  const v = mount(KnowledgeView, { goHome() {}, setView() {} });
  await settle(v);
  assert.ok(toggles(v).every((b) => b.props['aria-expanded'] === true));
  assert.ok(topicRows(v).length >= 100);
  v.unmount();
});

test('the way back to the contents follows the reading once a frame, and leaves print alone', () => {
  const src = readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const article = src.slice(src.indexOf('function WikiArticle('), src.indexOf('// ================= SHELL'));
  // The one scroll listener is the reading position (progress, the rail's
  // entry, and the pill): passive, at most once a frame, and no render unless
  // something changed. The pill is measured there, not observed: a jump past
  // the contents box (a shared #section link) never made an observer fire.
  assert.doesNotMatch(article, /new IntersectionObserver\(/);
  assert.match(article, /setTocAway\(tocRef\.current\.getBoundingClientRect\(\)\.bottom < 0\)/);
  assert.equal(article.match(/addEventListener\('scroll'/g)?.length, 1);
  assert.match(article, /addEventListener\('scroll', onScroll, \{ passive: true \}\)/);
  assert.match(article, /if \(!frame\) frame = window\.requestAnimationFrame\(measure\)/);
  assert.match(article, /className="vmx-wiki-toc-return"/);
  assert.match(article, /target\?\.focus\(\{ preventScroll: true \}\)/, 'focus follows the jump for keyboard users');
  const sheet = src.slice(src.indexOf('function TocSheet('), src.indexOf('function ReadMark('));
  assert.match(sheet, /const dialogRef = useModalFocus\(\{ onClose, initialFocusRef: activeRef \}\)/, "the pill's sheet holds focus, from the entry being read");
  assert.match(article, /onClick=\{\(\) => setSheetOpen\(true\)\}/, 'the pill opens the sheet');
  assert.match(article, /\{hasToc && \(sheetOpen \|\| \(tocAway && !endNear\)\) && \(/, 'the pill stays while its sheet is open, to take focus back');
  assert.match(article, /motionIsReduced\(\) \? 'auto' : 'smooth'/, 'no smooth scroll under reduced motion');
  const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /@media print \{\s*\.vmx-wiki-toc-return \{ display: none !important; \}/);
});
