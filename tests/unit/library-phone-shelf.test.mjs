// ============================================================
// library-phone-shelf — the shelf on a phone opens on the reader's year,
// one subject at a time
// ============================================================
// At 390px the shelf was a 37,000px page: years in numeric order with the
// reader's own year last, every subject of the open year expanded into a
// single column of cards, each card repeating the year and term its headings
// already said, and slide decks captioned "Lecture Slides" under a "สไลด์"
// label. Now the reader's year comes first, subjects fold on a phone (wide
// screens keep them open), a capped subject offers a one-tap filter instead
// of only "use the search", and a card prints each fact once.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';
import { ownYearFirst, cardDescription, prefersCompactReading, COMPACT_READING_QUERY } from '../../src/lib/reading-layout.js';

test('own year first is a stable partition, never a reorder of the rest', () => {
  const rows = [{ y: 1 }, { y: 2 }, { y: 5 }, { y: 3 }, { y: 5, n: 2 }];
  assert.deepEqual(ownYearFirst(rows, (r) => r.y, 5), [{ y: 5 }, { y: 5, n: 2 }, { y: 1 }, { y: 2 }, { y: 3 }]);
  assert.deepEqual(ownYearFirst(rows, (r) => r.y, null), rows);
  assert.deepEqual(ownYearFirst(rows, (r) => r.y, 6), rows, 'a year with no rows changes nothing');
  assert.notEqual(ownYearFirst(rows, (r) => r.y, null), rows, 'a copy, so callers may not mutate the source by accident');
});

test('a card description that only restates the kind is not printed twice', () => {
  assert.equal(cardDescription({ kind: 'slide', description: 'Lecture Slides' }), null);
  assert.equal(cardDescription({ kind: 'handout', description: ' Supplementary Materials ' }), null);
  assert.equal(cardDescription({ kind: 'handout', description: 'Laboratory direction' }), 'Laboratory direction');
  assert.equal(cardDescription({ kind: 'pastpaper', description: 'Lecture Slides' }), 'Lecture Slides', 'only an echo of its own kind is dropped');
  assert.equal(cardDescription({ kind: 'slide' }), null);
  assert.equal(cardDescription({ kind: 'handout', description: 'เอกสารประกอบ' }, 'เอกสารประกอบ'), null, 'nor the Thai label the card already shows');
  assert.equal(cardDescription({ kind: 'handout', description: 'คู่มือแล็บ' }, 'เอกสารประกอบ'), 'คู่มือแล็บ');
});

test('compact means a phone, not the iPad', () => {
  assert.equal(COMPACT_READING_QUERY, '(max-width: 640px)');
  assert.equal(prefersCompactReading({ matchMedia: (q) => ({ matches: q === COMPACT_READING_QUERY }) }), true);
  assert.equal(prefersCompactReading({ matchMedia: () => ({ matches: false }) }), false);
  assert.equal(prefersCompactReading(null), false);
  assert.equal(prefersCompactReading({ matchMedia: () => { throw new Error('no media'); } }), false);
});

const DOCS = [
  ...Array.from({ length: 3 }, (_, i) => ({ id: `y1-${i}`, slug: `y1-${i}`, title: `Anatomy ${i}`, kind: 'slide', description: 'Lecture Slides', subject: 'vet-anat-1', year: 1, semester: 1, academic_year: 2026, status: 'public' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `ep-${i}`, slug: `ep-${i}`, title: `Epidemiology ${i}`, kind: 'slide', description: 'Lecture Slides', subject: 'epidemiology', year: 5, semester: 1, academic_year: 2026, status: 'public' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `aq-${i}`, slug: `aq-${i}`, title: `Aquatic ${i}`, kind: 'handout', description: 'Field guide', subject: 'aquatic-clinic', year: 5, semester: 1, academic_year: 2025, status: 'public' })),
];
globalThis.__libraryPhoneFunctions = library;
globalThis.__libraryPhoneDocs = DOCS;
const { default: LibraryView } = await loadModule('src/views/LibraryView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/BackBar\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/FeatureTip\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/ExternalDocsSection\\.jsx$', contents: "export default () => 'EXTERNAL READER';" },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `
    export const { LIBRARY_KINDS, SEMESTERS, buddhistYear, docOpenMode, prefetchDocUrl, docTypeLabel,
      displayDocTitle, filterIndexed, formatBytes, groupByYearSubject, indexDocs, kindLabel, listRecentDocs,
      readerPayload, recordRecentDoc, resolveDocUrl, semesterLabel, subjectMeta } = globalThis.__libraryPhoneFunctions;
    export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(null), fresh: Promise.resolve({ docs: globalThis.__libraryPhoneDocs, configured: true }) });` },
] });

function browser(t, { compact }) {
  const map = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = map();
  globalThis.localStorage = map();
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  globalThis.cancelAnimationFrame = clearTimeout;
  globalThis.document = { querySelector: () => null };
  globalThis.window = {
    localStorage, sessionStorage, location: new URL('https://vetmock.com/app/library'),
    matchMedia: (q) => ({ matches: compact && q === COMPACT_READING_QUERY }),
    addEventListener() {}, removeEventListener() {},
    requestIdleCallback: () => 0, cancelIdleCallback() {},
    history: { state: { vmxView: 'library' }, replaceState(state, _t, url) { this.state = state; window.location = new URL(url, window.location.href); } },
  };
  t.after(() => {
    for (const k of ['window', 'localStorage', 'sessionStorage', 'requestAnimationFrame', 'cancelAnimationFrame', 'document']) delete globalThis[k];
  });
}
const yearHeadings = (v) => findAll(v.tree, (n) => n.type === 'h2').map((n) => textOf(n));
const subjectToggles = (v) => findAll(v.tree, (n) => n.type === 'button' && n.props.className === 'vmx-lib-subject-toggle');
const cards = (v) => findAll(v.tree, (n) => n.type === 'article');

test('on a phone the reader\'s year comes first and its subjects start folded', async (t) => {
  browser(t, { compact: true });
  const v = mount(LibraryView, { selectedYear: 5, goHome() {}, onOpenDoc() {} });
  await settle(v);
  assert.match(yearHeadings(v)[0], /ชั้นปี 5/, 'the open year leads, not year 1');
  const toggles = subjectToggles(v);
  assert.equal(toggles.length, 2, 'year 5 lists its two subjects');
  assert.ok(toggles.every((b) => b.props['aria-expanded'] === false), 'folded on a phone');
  assert.equal(cards(v).length, 0, 'no card is mounted until a subject is opened');
  toggles.find((b) => /ระบาดวิทยา|Epidemiology|epidemiology/i.test(textOf(b))).props.onClick();
  v.flush();
  assert.equal(cards(v).length, 2);
  const card = textOf(cards(v)[0]);
  assert.doesNotMatch(card, /Lecture Slides/, 'the kind label already says it is a slide deck');
  assert.doesNotMatch(card, /ปี 5|ภาคต้น/, 'the headings already say the year and the term');
  assert.match(card, /ปีการศึกษา 2569/, 'what the headings do not say stays');
  v.unmount();
});

test('wider screens keep every subject of the open year expanded', async (t) => {
  browser(t, { compact: false });
  const v = mount(LibraryView, { selectedYear: 5, goHome() {}, onOpenDoc() {} });
  await settle(v);
  assert.ok(subjectToggles(v).every((b) => b.props['aria-expanded'] === true));
  assert.equal(cards(v).length, 4);
  assert.match(textOf(cards(v).find((c) => /Aquatic/.test(textOf(c)))), /Field guide/, 'a real description is kept');
  v.unmount();
});
