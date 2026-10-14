// ============================================================
// wiki-review-fixes.test.mjs: the 5.146.0 review, held
// ============================================================
// Three reviews of the VetWiki redesign (logic and access, CSS and print,
// numbers and words) found these on real screens; each test fails on the
// code they found it in.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { conflictCountFor } from '../../src/lib/vetwiki/conflict-summary.generated.js';
import { listTopics } from '../../src/lib/vetwiki/index.js';
import { listTopics as listRegistry } from '../../src/lib/vetwiki/registry.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { provenanceHeadline } from '../../src/lib/vetwiki/schema.js';

const { default: KnowledgeView, WikiIndex } = await loadModule('src/views/KnowledgeView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/(FeatureTip|ReadingEffects|ReportConcern|SlideFigures|ConflictNote|StatePanel|OptionalFeature)\\.jsx$',
    contents: 'export default (p) => (p && p.children) || null;' },
] });

function browser(t, { layout = 'list' } = {}) {
  const stored = new Map([['vmx-selected-year', '5'], ['vmx-wiki-layout', layout]]);
  const local = { getItem: (k) => stored.get(k) ?? null, setItem: (k, v) => stored.set(k, String(v)), removeItem: (k) => stored.delete(k) };
  globalThis.localStorage = local;
  globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  globalThis.document = { getElementById: () => null, addEventListener() {}, removeEventListener() {} };
  globalThis.window = {
    localStorage: local, location: new URL('https://vetmock.com/wiki'), innerHeight: 800,
    matchMedia: () => ({ matches: false }),
    history: { state: null, pushState() {}, replaceState() {} },
    addEventListener() {}, removeEventListener() {}, scrollTo() {}, setTimeout, clearTimeout,
  };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage', 'document']) delete globalThis[k]; });
  return { stored };
}
const rows = (v) => findAll(v.tree, (n) => n.type === 'button' && n.props.className === 'vw-topic');
const filterButton = (v) => findAll(v.tree, (n) => n.type === 'button' && /vw-filter/.test(n.props.className || ''))[0];
const titles = (v) => rows(v).map((r) => textOf(r));
const byTitle = new Map(listTopics().map((t) => [t.title, t]));
// The index on its own, so its state (the filter, the view) is real.
const index = () => mount(WikiIndex, { topics: listRegistry(), onOpen() {}, onOpenSection() {}, goHome() {} });

test('the conflicts filter cuts the list, never a search', async (t) => {
  browser(t);
  const v = index();
  await settle(v);
  const all = rows(v).length;
  filterButton(v).props.onClick();
  v.flush();
  const filtered = rows(v).length;
  assert.ok(filtered > 0 && filtered < all, `filtered ${filtered} of ${all}`);
  const search = findAll(v.tree, (n) => n.type === 'input' && n.props.id === 'vw-search')[0];
  search.props.onChange({ target: { value: 'a' } });
  v.flush();
  const hits = titles(v).map((s) => [...byTitle.keys()].find((k) => s.startsWith(k))).filter(Boolean).map((k) => byTitle.get(k));
  assert.ok(hits.some((h) => conflictCountFor(h.subject, h.topic) === 0), 'a search lists topics without a conflict too');
  assert.equal(filterButton(v), undefined, 'and the filter is not on screen to be undone');
  v.unmount();
});

test("the colophon's button lists the conflicts for this visit and keeps the reader's own view", async (t) => {
  const { stored } = browser(t, { layout: 'shelf' });
  const v = index();
  await settle(v);
  findAll(v.tree, (n) => n.type === 'button' && textOf(n).includes('ดูหัวข้อที่มีจุดเหล่านี้'))[0].props.onClick();
  v.flush();
  assert.equal(stored.get('vmx-wiki-layout'), 'shelf', 'the stored choice is not overwritten');
  assert.equal(filterButton(v).props['aria-pressed'], true);
  assert.ok(rows(v).length > 0);
  v.unmount();
});

test('a copy that fails says so', async () => {
  const src = readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const start = src.indexOf('  const copyPage = async () => {');
  const body = src.slice(start, src.indexOf('\n  };\n', start) + 5);
  const got = [];
  const ctx = {
    closeShare() {}, shareUrl: 'https://vetmock.com/wiki/com5/rabies', copyTimer: { current: null },
    copyText: async () => ({ ok: false, reason: 'execCommand-failed' }),
    setCopied: (s) => got.push(s), clearTimeout() {}, setTimeout: () => 0,
  };
  vm.createContext(ctx);
  const copyPage = vm.runInContext(`(() => { ${body} return copyPage; })()`, ctx);
  await copyPage();
  assert.deepEqual(got, ['fail:__page__'], 'copyText answers { ok }; the object itself is always truthy');
});

test('an article with no checked point says so, and shows no "0 checked"', async (t) => {
  browser(t);
  const v = mount(KnowledgeView, { subject: 'swine-clinic', topic: 'swine-asf', openNonce: 7, goHome() {}, setView() {} });
  await settle(v);
  const text = textOf(v.tree);
  assert.ok(text.includes(provenanceHeadline(0, 0)), 'the headline stands where the strip would');
  assert.ok(!text.includes('จุดที่ตรวจทานแล้ว'), 'no zero count');
  assert.ok(!text.includes('ที่มาในเลกเชอร์'), 'a senior summary is not called a lecture');
  v.unmount();
});

test("a subject's topics follow the course, so 'หัวข้อที่ N' is the Nth lecture", () => {
  const registry = listTopics();
  for (const s of SUBJECTS) {
    const listed = registry.filter((t) => t.subject === s.id).map((t) => t.topic);
    if (!listed.length) continue;
    const course = (s.topics || []).map((x) => x.id).filter((id) => listed.includes(id));
    assert.deepEqual(listed.slice(0, course.length), course, `${s.id}: the course's topics first, in its order`);
  }
});

test('the provenance line counts checked points and never claims every point', () => {
  assert.equal(provenanceHeadline(96, 0), 'หัวข้อนี้มี 96 จุดที่ตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว');
  assert.ok(!/ทุกจุด|เลกเชอร์/.test([provenanceHeadline(3, 0), provenanceHeadline(3, 2), provenanceHeadline(0, 0)].join(' ')));
});
