// ============================================================
// wiki-citations.test.mjs: VetWiki phase 3, sources and the chapter end
// ============================================================
// A source is numbered once per article and keeps its number from the chip
// under a section to the list at the end; the strip counts the same list.
// The chapter end writes รายการอ่าน itself, and only for a topic it lists.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { readFileSync } from 'node:fs';
import { articleCitations, sourceShortName, sourceChipLabel, citationText, SOURCE_KIND } from '../../src/lib/vetwiki/cite.js';
import { listTopics, loadTopic, provenanceSummary } from '../../src/lib/vetwiki/index.js';
import { SOURCES, resolveSource } from '../../src/lib/vetwiki/sources.js';
import { SHELF_RELATED } from '../../src/lib/vetwiki/shelf.generated.js';
import { sharedSources } from '../../scripts/lib/vetwiki-shelf.mjs';
import { topicProgressKey } from '../../src/lib/study-progress.js';

const { default: KnowledgeView } = await loadModule('src/views/KnowledgeView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/(FeatureTip|ReadingEffects|ReportConcern|SlideFigures|ConflictNote|StatePanel|OptionalFeature)\\.jsx$',
    contents: 'export default (p) => (p && p.children) || null;' },
] });

function browser(t) {
  const stored = new Map([['vmx-selected-year', '4']]);
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
}

test('a source keeps one number from its first chip to the list, numbered in order of first use', () => {
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    const { list, perSection } = articleCitations(k.sections, resolveSource);
    assert.deepEqual(list.map((e) => e.n), list.map((_, i) => i + 1), t.id);
    assert.equal(list.length, provenanceSummary(k).sources.length, `${t.id}: the strip's แหล่งอ้างอิง is the list's length`);
    let seen = 0;
    perSection.forEach((chips, si) => {
      const fresh = chips.filter((c) => c.n > seen).map((c) => c.n);
      assert.deepEqual(fresh, fresh.map((_, i) => seen + i + 1), `${t.id} section ${si + 1}: new numbers follow on`);
      seen += fresh.length;
      for (const chip of chips) {
        assert.equal(list[chip.n - 1].src, chip.src, `${t.id}: chip ${chip.n} names the list's source ${chip.n}`);
        assert.ok(list[chip.n - 1].sections.includes(si), `${t.id}: source ${chip.n} links back to section ${si + 1}`);
      }
      // Every checked point's sources are under its section.
      for (const claim of k.sections[si].claims || []) {
        for (const ref of claim.sourceRefs || []) {
          const src = resolveSource(ref);
          if (!src) continue;
          const chip = chips.find((c) => (c.src.work || c.src.id) === (src.work || src.id));
          assert.ok(chip && chip.claims.some((c) => c.claim === claim), `${t.id}: ${claim.id} is under its source's chip`);
        }
      }
    });
    for (const entry of list) {
      for (const si of entry.sections) assert.ok(perSection[si].some((c) => c.n === entry.n), `${t.id}: back link ${entry.n} to ${si + 1}`);
    }
  }
});

test("a chip's name is short and says whose source it is", () => {
  assert.equal(sourceShortName({ organization: 'WOAH (World Organisation for Animal Health)' }), 'WOAH');
  assert.equal(sourceShortName({ organization: 'World Organisation for Animal Health (WOAH, formerly OIE)' }), 'WOAH');
  assert.equal(sourceShortName({ organization: 'World Health Organization (WHO)' }), 'WHO');
  assert.equal(sourceShortName({ organization: 'Codex Alimentarius Commission (FAO/WHO)' }), 'Codex Alimentarius…');
  assert.equal(sourceShortName({ organization: 'J Infect Dis' }), 'J Infect Dis');
  assert.equal(sourceShortName({ organization: '', citation: 'Sheridan N. Neuroanatomy, Thalamic Nuclei.. 2026.' }), 'Sheridan');
  assert.equal(sourceChipLabel({ organization: 'J Infect Dis', year: 1982 }), 'J Infect Dis 1982');
  assert.equal(sourceChipLabel({ organization: 'Merck & Co., Inc. (MSD Animal Health outside the US/Canada)' }), 'Merck & Co., Inc.');
  // A place in brackets is not the organisation's acronym.
  assert.equal(sourceShortName({ organization: 'Mar Biotechnol (NY)' }), 'Mar Biotechnol');
  assert.equal(sourceShortName({ organization: 'StatPearls Publishing, Treasure Island (FL)' }), 'StatPearls Publishing…');
  // A cut name ends on a word, never on a comma.
  assert.equal(sourceShortName({ organization: 'Department of Fisheries, Ministry of Agriculture' }), 'Department of Fisheries…');
  for (const src of Object.values(SOURCES)) {
    const name = sourceShortName(src);
    assert.ok(name && Array.from(name).length <= 25, `${src.id}: "${name}"`);
    assert.ok(SOURCE_KIND[src.kind], `${src.id}: the kind ${src.kind} has a word`);
  }
});

test('อ้างแหล่งเดียวกัน: two shared sources at least, most first, four at most, never the topic itself', () => {
  const works = { a: new Set([1, 2, 3]), b: new Set([1, 2]), c: new Set([1]), d: new Set([1, 2, 3]), e: new Set([2, 3]) };
  assert.deepEqual(sharedSources(works), {
    a: [['d', 3], ['b', 2], ['e', 2]],
    b: [['a', 2], ['d', 2]],
    d: [['a', 3], ['b', 2], ['e', 2]],
    e: [['a', 2], ['d', 2]],
  });
  const ids = new Set(listTopics().map((t) => t.id));
  assert.ok(Object.keys(SHELF_RELATED).length > 0);
  for (const [id, near] of Object.entries(SHELF_RELATED)) {
    assert.ok(ids.has(id) && near.length >= 1 && near.length <= 4, id);
    for (const [other, n] of near) {
      assert.ok(ids.has(other) && other !== id && n >= 2, `${id} -> ${other}`);
    }
    assert.deepEqual(near.map(([, n]) => n), near.map(([, n]) => n).sort((x, y) => y - x), `${id}: most shared first`);
  }
});

const button = (v, label) => findAll(v.tree, (n) => n.type === 'button' && textOf(n).trim() === label)[0];

test('the chips and the list carry the same numbers, and the strip counts the list', async (t) => {
  browser(t);
  const v = mount(KnowledgeView, { subject: 'com5', topic: 'rabies', openNonce: 41, goHome() {}, setView() {} });
  await settle(v);
  const chipNumbers = new Set(findAll(v.tree, (n) => n.props?.className === 'vw-chip-n').map((n) => Number(textOf(n))));
  const listed = findAll(v.tree, (n) => n.type === 'li' && /^vw-src-\d+$/.test(n.props.id || '')).map((n) => Number(n.props.id.slice(7)));
  assert.ok(listed.length > 0);
  assert.deepEqual(listed, listed.map((_, i) => i + 1));
  for (const n of chipNumbers) assert.ok(listed.includes(n), `chip ${n} is in the list`);
  assert.deepEqual([...chipNumbers].sort((a, b) => a - b), listed, 'every listed source has a chip');
  const strip = findAll(v.tree, (n) => n.props?.className === 'vw-strip-cell' && n.props.href === '#vw-sources')[0];
  assert.ok(textOf(strip).includes(String(listed.length)), 'the strip counts the list');
  assert.ok(textOf(v.tree).includes(`แหล่งอ้างอิงทั้งหมด ${listed.length} แหล่ง`));
  v.unmount();
});

test('ทำเครื่องหมายว่าอ่านแล้ว writes รายการอ่าน itself, and says so', async (t) => {
  browser(t);
  let checklist = {};
  const setReadingChecklist = (fn) => { checklist = typeof fn === 'function' ? fn(checklist) : fn; return { accepted: true }; };
  const v = mount(KnowledgeView, { subject: 'com5', topic: 'rabies', openNonce: 42, goHome() {}, setView() {}, readingChecklist: checklist, setReadingChecklist });
  await settle(v);
  button(v, 'ทำเครื่องหมายว่าอ่านแล้ว').props.onClick();
  const at = checklist[topicProgressKey('com5', 'rabies')];
  assert.ok(Number.isFinite(at) && at > 0, 'the same key รายการอ่าน reads, with the time');
  v.update({ readingChecklist: checklist });
  const text = textOf(v.tree);
  assert.ok(text.includes('อ่านแล้ว') && text.includes('3107417'), 'the stamp, with the course code');
  assert.ok(!button(v, 'ทำเครื่องหมายว่าอ่านแล้ว'), 'the button gives way to the stamp');
  button(v, 'ยกเลิกว่าอ่านแล้ว').props.onClick();
  assert.equal(checklist[topicProgressKey('com5', 'rabies')], false, 'an explicit unread, as รายการอ่าน writes it');
  v.unmount();
});

test('a VetWiki-only topic offers no mark, since รายการอ่าน does not list it', async (t) => {
  browser(t);
  const v = mount(KnowledgeView, {
    subject: 'exotic', topic: 'rabbit-nutritional-requirements', openNonce: 43, goHome() {}, setView() {},
    readingChecklist: {}, setReadingChecklist: () => ({ accepted: true }),
  });
  await settle(v);
  assert.ok(textOf(v.tree).includes('ในเล่มเดียวกัน'), 'the article rendered');
  assert.ok(!button(v, 'ทำเครื่องหมายว่าอ่านแล้ว'));
  v.unmount();
});

test('the topics either side follow the course, and the volume marks this one', async (t) => {
  browser(t);
  const v = mount(KnowledgeView, { subject: 'com5', topic: 'rabies', openNonce: 44, goHome() {}, setView() {} });
  await settle(v);
  const siblings = listTopics().filter((x) => x.subject === 'com5');
  const at = siblings.findIndex((x) => x.topic === 'rabies');
  const pager = findAll(v.tree, (n) => n.type === 'button' && /vw-pager-btn/.test(n.props.className || '')).map((n) => textOf(n));
  assert.ok(pager[0].includes('หัวข้อก่อนหน้า') && pager[0].includes(siblings[at - 1].title));
  assert.ok(pager[1].includes('หัวข้อถัดไป') && pager[1].includes(siblings[at + 1].title));
  const here = findAll(v.tree, (n) => n.props?.['aria-current'] === 'page');
  assert.equal(here.length, 1);
  assert.ok(textOf(here[0]).includes('หัวข้อนี้'));
  v.unmount();
});

test('no source in the registry carries a doubled full stop, and the importer no longer writes one', () => {
  assert.equal(citationText({ title: 'A title only' }), 'A title only');
  for (const src of Object.values(SOURCES)) {
    for (const field of ['citation', 'title']) {
      assert.doesNotMatch(String(src[field] || ''), /[^.]\.\.(\s|$)/, `${src.id}.${field} has a doubled full stop`);
    }
  }
  const fekadu = Object.values(SOURCES).find((s) => /saliva of dogs/.test(s.citation || ''));
  if (fekadu) assert.match(fekadu.citation, /saliva of dogs\. J Infect Dis/);
  const importer = readFileSync(new URL('../../scripts/ingest-verifications.mjs', import.meta.url), 'utf8');
  assert.match(importer, /\.filter\(Boolean\)\.map\(\(part\) => String\(part\)\.replace\(\/\\.\+\$\/, ''\)\)\.join\('\. '\)/);
});
