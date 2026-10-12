// ============================================================
// library-show-more — a subject past the card cap opens further
// ============================================================
// Review of 5.144.0. The shelf mounts at most 150 cards in browse mode (a few
// hundred at once froze phones), and a capped subject offered
// "แสดงเฉพาะวิชานี้". That filter did not lift the cap: the VCA shelf (294
// files) still showed 150, now with "แสดง 150 จาก 294 ไฟล์
// กดแสดงเฉพาะวิชานี้เพื่อดูที่เหลือ" and no such button any more. Each capped
// subject now offers "แสดงอีก N ไฟล์", which raises that subject's own cap
// one step at a time without taking other subjects' share, and the line
// above the buttons only states what is shown.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';

const docs = (subject, n) => Array.from({ length: n }, (_, i) => ({
  id: `${subject}-${i}`, slug: `${subject}-${i}`, title: `${subject} ${String(i).padStart(3, '0')}`,
  kind: 'pastpaper', subject, year: 5, semester: 1, academic_year: 2026, status: 'public',
}));

globalThis.__libraryShowMoreFunctions = library;
globalThis.__libraryShowMoreDocs = [];
const { default: LibraryView } = await loadModule('src/views/LibraryView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/BackBar\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/FeatureTip\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/ExternalDocsSection\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/lib/library\\.js$', contents: `
    export const { LIBRARY_KINDS, SEMESTERS, buddhistYear, docOpenMode, prefetchDocUrl, docTypeLabel,
      filterIndexed, formatBytes, groupByYearSubject, indexDocs, kindLabel, listRecentDocs,
      readerPayload, recordRecentDoc, resolveDocUrl, semesterLabel, subjectMeta } = globalThis.__libraryShowMoreFunctions;
    export const getLibraryCatalogFast = () => ({ stale: Promise.resolve(null), fresh: Promise.resolve({ docs: globalThis.__libraryShowMoreDocs, configured: true }) });` },
] });

function browser(t, { subject = null } = {}) {
  const map = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = map();
  globalThis.localStorage = map();
  if (subject) sessionStorage.setItem('vmx-library-subject', subject);
  globalThis.document = { querySelector: () => null };
  globalThis.window = {
    localStorage, sessionStorage, location: new URL('https://vetmock.com/app/library'),
    matchMedia: () => ({ matches: false }), // a wide screen: subjects open by default
    addEventListener() {}, removeEventListener() {},
    requestIdleCallback: () => 0, cancelIdleCallback() {},
    history: { state: { vmxView: 'library' }, replaceState(state, _t, url) { this.state = state; window.location = new URL(url, window.location.href); } },
  };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage', 'document']) delete globalThis[k]; });
}

const subjectBlocks = (v) => findAll(v.tree, (n) => n.type === 'div' && n.props.className === 'vmx-lib-subject');
const block = (v, subject) => subjectBlocks(v).find((n) => n.key === subject);
const cardsIn = (node) => findAll(node, (n) => n.type === 'article');
const buttonIn = (node, re) => findAll(node, (n) => n.type === 'button' && re.test(textOf(n)))[0];
const cappedLine = (node) => findAll(node, (n) => n.type === 'div' && n.props.className === 'vmx-lib-capped')
  .map((capped) => textOf(findAll(capped, (n) => n.type === 'p')[0]))[0] ?? null;

// Copy may name a control only while that control is on screen.
function assertNoDeadPointer(node) {
  const line = cappedLine(node);
  if (line == null) return;
  if (/แสดงเฉพาะวิชานี้/.test(line)) assert.ok(buttonIn(node, /^แสดงเฉพาะวิชานี้$/), `"${line}" points at a button that is not there`);
}

test('a subject filtered on its own opens past the cap, one step at a time', async (t) => {
  browser(t, { subject: 'vca' });
  globalThis.__libraryShowMoreDocs = [...docs('vca', 294), ...docs('epidemiology', 3)];
  const v = mount(LibraryView, { selectedYear: 5, goHome() {}, onOpenDoc() {} });
  await settle(v);
  const vca = block(v, 'vca');
  assert.ok(vca, 'the VCA subject is listed');
  assert.equal(cardsIn(vca).length, 150, 'the first screen still mounts at most 150 cards');
  assertNoDeadPointer(vca);
  assert.equal(buttonIn(vca, /^แสดงเฉพาะวิชานี้$/), undefined, 'the shelf is already this subject only');
  const more = buttonIn(vca, /^แสดงอีก/);
  assert.ok(more, `a capped subject offers more of itself; got "${textOf(vca).slice(-120)}"`);
  assert.equal(textOf(more), 'แสดงอีก 144 ไฟล์', 'the button says how many it adds');
  more.props.onClick();
  v.flush();
  assert.equal(cardsIn(block(v, 'vca')).length, 294, 'every file of the subject is now on screen');
  assert.equal(cappedLine(block(v, 'vca')), null, 'nothing is left to explain');
  v.unmount();
});

test('raising one subject never takes another subject\'s share, and a starved subject opens too', async (t) => {
  browser(t);
  // Year 5 opens by default; avian sorts first and spends the shared budget.
  globalThis.__libraryShowMoreDocs = [...docs('avian-medicine', 160), ...docs('vca', 20)];
  const v = mount(LibraryView, { selectedYear: 5, goHome() {}, onOpenDoc() {} });
  await settle(v);
  assert.equal(cardsIn(block(v, 'avian-medicine')).length, 150);
  assert.equal(cardsIn(block(v, 'vca')).length, 0, 'the budget is spent before the second subject');
  for (const subject of ['avian-medicine', 'vca']) assertNoDeadPointer(block(v, subject));
  assert.equal(cappedLine(block(v, 'vca')), 'ยังไม่ได้แสดง 20 ไฟล์ของวิชานี้');
  assert.equal(cappedLine(block(v, 'avian-medicine')), 'แสดง 150 จาก 160 ไฟล์');
  assert.ok(buttonIn(block(v, 'vca'), /^แสดงเฉพาะวิชานี้$/), 'the one-subject filter is still offered beside it');
  const more = buttonIn(block(v, 'vca'), /^แสดงอีก/);
  assert.ok(more, 'a starved subject offers its files too');
  assert.equal(textOf(more), 'แสดงอีก 20 ไฟล์');
  more.props.onClick();
  v.flush();
  assert.equal(cardsIn(block(v, 'vca')).length, 20);
  assert.equal(cardsIn(block(v, 'avian-medicine')).length, 150, 'the first subject keeps its cards');
  buttonIn(block(v, 'avian-medicine'), /^แสดงอีก/).props.onClick();
  v.flush();
  assert.equal(cardsIn(block(v, 'avian-medicine')).length, 160);
  assert.equal(cardsIn(block(v, 'vca')).length, 20, 'and raising it leaves the second subject alone');
  v.unmount();
});
