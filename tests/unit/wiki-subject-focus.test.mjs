// ============================================================
// wiki-subject-focus — the search card's VetWiki button lands on its subject
// ============================================================
// Review of 5.144.0. The study card ("VetWiki COM V") calls
// onOpenWiki(subject, null). On a phone that opened /wiki with every subject
// folded, COM V about 1,245 px down; from inside an article it changed
// nothing at all, because the reader only followed a subject AND a topic.
// A request for a subject now closes any article, opens that subject's group
// and brings it into view (no smooth scroll under reduced motion). A mount
// from anywhere else, which carries App's last subject too, does not move.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll } from '../helpers/fake-react.mjs';
import { COMPACT_READING_QUERY } from '../../src/lib/reading-layout.js';

const { default: KnowledgeView } = await loadModule('src/views/KnowledgeView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/(FeatureTip|ReadingEffects|ReportConcern|SlideFigures|ConflictNote|StatePanel)\\.jsx$',
    contents: 'export default (p) => (p && p.children) || null;' },
] });

function browser(t, { reduced = false, search = null } = {}) {
  // `search`: a VetWiki search left from earlier in the visit.
  const session = new Map(search ? [['vmx-wiki-q', search]] : []);
  const local = { getItem: (k) => (k === 'vmx-selected-year' ? '5' : null), setItem() {}, removeItem() {} };
  globalThis.localStorage = local;
  globalThis.sessionStorage = { getItem: (k) => session.get(k) ?? null, setItem: (k, v) => session.set(k, String(v)), removeItem: (k) => session.delete(k) };
  const scrolled = [];
  globalThis.document = { getElementById: (id) => ({ scrollIntoView: (opts) => scrolled.push({ id, ...opts }) }) };
  const pushed = [];
  globalThis.window = {
    localStorage: local, location: new URL('https://vetmock.com/wiki'),
    matchMedia: (q) => ({ matches: q === COMPACT_READING_QUERY || (reduced && q === '(prefers-reduced-motion: reduce)') }),
    history: {
      state: null,
      pushState: (_s, _t, path) => { pushed.push(path); window.location = new URL(path, window.location.href); },
      replaceState: (_s, _t, path) => { window.location = new URL(path, window.location.href); },
    },
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout,
  };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage', 'document']) delete globalThis[k]; });
  return { scrolled, pushed, session };
}

const sections = (v) => findAll(v.tree, (n) => n.type === 'section' && /vmx-wiki-subject/.test(n.props.className || ''));
const section = (v, subject) => sections(v).find((n) => n.key === subject);
const toggleOf = (node) => findAll(node, (n) => n.type === 'button' && /vmx-wiki-subject-toggle/.test(n.props.className || ''))[0];
const isOpen = (v, subject) => toggleOf(section(v, subject))?.props['aria-expanded'] === true;

test('from the search card the index opens at the subject, folded around it', async (t) => {
  const { scrolled } = browser(t);
  const v = mount(KnowledgeView, { subject: 'com5', topic: null, openNonce: 1, goHome() {}, setView() {} });
  await settle(v);
  assert.ok(section(v, 'com5'), 'COM V is listed');
  assert.equal(isOpen(v, 'com5'), true, 'the asked-for subject is open on a phone');
  assert.ok(sections(v).filter((s) => s.key !== 'com5').every((s) => toggleOf(s)?.props['aria-expanded'] === false), 'the others stay folded');
  const anchor = section(v, 'com5').props.id;
  assert.ok(anchor, 'the subject has an anchor to scroll to');
  assert.deepEqual(scrolled, [{ id: anchor, block: 'start', behavior: 'smooth' }], 'and is brought into view');
  v.unmount();
});

test('a search left from earlier does not hide the subject asked for', async (t) => {
  const { scrolled, session } = browser(t, { search: 'rabies' });
  const v = mount(KnowledgeView, { subject: 'epidemiology', topic: null, openNonce: 2, goHome() {}, setView() {} });
  await settle(v);
  assert.equal(session.get('vmx-wiki-q'), undefined, 'the earlier search is cleared');
  assert.ok(toggleOf(section(v, 'epidemiology')), 'every subject is listed as a folding row again');
  assert.equal(isOpen(v, 'epidemiology'), true);
  assert.equal(scrolled.length, 1);
  v.unmount();
});

test('from inside an article the request closes it and lands on the subject', async (t) => {
  const { scrolled, pushed } = browser(t, { reduced: true });
  const v = mount(KnowledgeView, { subject: 'com5', topic: 'rabies', openNonce: 3, goHome() {}, setView() {} });
  await settle(v);
  assert.equal(sections(v).length, 0, 'the article is open, not the index');
  v.update({ subject: 'com5', topic: null, openNonce: 4 });
  await settle(v);
  assert.ok(sections(v).length > 0, 'the index replaces the article');
  assert.equal(isOpen(v, 'com5'), true);
  assert.equal(pushed.at(-1), '/wiki', 'the address follows the screen');
  assert.deepEqual(scrolled, [{ id: section(v, 'com5').props.id, block: 'start', behavior: 'auto' }], 'no smooth scroll under reduced motion');
  v.unmount();
});

test('a mount from anywhere else keeps the plain index, even with a subject left in App', async (t) => {
  // App keeps the last subject it opened; the Home tile mounts the reader
  // with it and the nonce of a request already handled.
  const { scrolled, session } = browser(t);
  const first = mount(KnowledgeView, { subject: 'epidemiology', topic: null, openNonce: 5, goHome() {}, setView() {} });
  await settle(first);
  first.unmount();
  scrolled.length = 0;
  session.delete('vmx-wiki-q');
  const again = mount(KnowledgeView, { subject: 'epidemiology', topic: null, openNonce: 5, goHome() {}, setView() {} });
  await settle(again);
  assert.ok(sections(again).every((s) => toggleOf(s)?.props['aria-expanded'] === false), 'every subject folded, as on any other visit');
  assert.deepEqual(scrolled, [], 'nothing moves');
  again.unmount();
  // A subject with no VetWiki article is not a place to land.
  const none = mount(KnowledgeView, { subject: 'not-a-subject', topic: null, openNonce: 6, goHome() {}, setView() {} });
  await settle(none);
  assert.deepEqual(scrolled, []);
  none.unmount();
});
