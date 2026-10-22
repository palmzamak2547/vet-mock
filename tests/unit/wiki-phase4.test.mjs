// ============================================================
// wiki-phase4.test.mjs: VetWiki phase 4, the checking history and the map
// ============================================================
// The history is built only from the claims' own review dates, newest first,
// and adds up to the article's checked points. The map lists every topic the
// index lists, once, each as a real link to its article.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { reviewHistory } from '../../src/lib/vetwiki/cite.js';
import { listTopics, loadTopic, provenanceSummary } from '../../src/lib/vetwiki/index.js';
import { resolveSource } from '../../src/lib/vetwiki/sources.js';
import { yearForSubject } from '../../src/data/curriculum.js';
import { wikiPath } from '../../src/lib/vetwiki/url.js';

test('the checking history: newest day first, every checked point counted once, on its own day', () => {
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    const days = reviewHistory(k.sections, resolveSource);
    const dates = days.map((d) => d.date);
    assert.deepEqual(dates, [...new Set(dates)].sort().reverse(), `${t.id}: one entry a day, newest first`);
    const dated = k.sections.flatMap((s) => s.claims || []).filter((c) => c.review?.reviewedAt).length;
    assert.equal(days.reduce((n, d) => n + d.claims, 0), dated, `${t.id}: every dated point once`);
    for (const d of days) {
      assert.deepEqual(d.sections, [...d.sections].sort((a, b) => a - b), `${t.id} ${d.date}: sections in article order`);
      for (const si of d.sections) {
        assert.ok((k.sections[si].claims || []).some((c) => c.review?.reviewedAt === d.date), `${t.id} ${d.date}: section ${si + 1} has a point checked that day`);
      }
      assert.ok(d.sources >= 1 && d.sources <= provenanceSummary(k).sources.length, `${t.id} ${d.date}: sources within the article's`);
    }
  }
  assert.deepEqual(reviewHistory([], resolveSource), []);
  assert.deepEqual(reviewHistory([{ claims: [{ statement: 'x' }] }], resolveSource), [], 'an undated point makes no entry');
});

function browser(t) {
  globalThis.document = { activeElement: null, getElementById: () => null, addEventListener() {}, removeEventListener() {}, body: {} };
  globalThis.window = { addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false }), requestAnimationFrame: (f) => f(), setTimeout, clearTimeout };
  t.after(() => { delete globalThis.document; delete globalThis.window; });
}

test('the map lists every topic once, grouped year then subject, each a link to its article', async (t) => {
  browser(t);
  const { default: WikiMap } = await loadModule('src/components/WikiMap.jsx', { stubs: [
    { match: 'useModalFocus\\.js$', contents: 'export const useModalFocus = () => null;' },
  ] });
  const topics = listTopics();
  const bySubject = new Map();
  for (const tp of topics) {
    if (!bySubject.has(tp.subject)) bySubject.set(tp.subject, []);
    bySubject.get(tp.subject).push(tp);
  }
  const byYear = new Map();
  for (const [id, list] of bySubject) {
    const y = yearForSubject(id);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push([id, list]);
  }
  const yearGroups = [...byYear.entries()];
  const read = new Set([topics[0].id]);
  const opened = [];
  const inst = mount(WikiMap, {
    yearGroups, nameOf: (id) => `name:${id}`, isRead: (tp) => read.has(tp.id),
    onOpen: (id) => opened.push(id), onClose() {},
  });
  const links = findAll(inst.tree, (n) => n.type === 'a');
  assert.equal(links.length, topics.length, 'one leaf a topic');
  assert.deepEqual(links.map((a) => a.props.href).sort(), topics.map((tp) => wikiPath(tp.subject, tp.topic)).sort());
  const text = textOf(inst.tree);
  assert.match(text, new RegExp(`${topics.length} หัวข้อ ใน ${bySubject.size} วิชา`));
  for (const id of bySubject.keys()) assert.ok(text.includes(`name:${id}`), id);
  const marked = links.filter((a) => textOf(a).includes('อ่านแล้ว'));
  assert.equal(marked.length, 1);

  let prevented = false;
  links[1].props.onClick({ button: 0, preventDefault: () => { prevented = true; } });
  assert.ok(prevented);
  assert.deepEqual(opened, [topics.find((tp) => wikiPath(tp.subject, tp.topic) === links[1].props.href).id]);
  // A new-tab click is the browser's: the link is left alone.
  links[2].props.onClick({ button: 0, ctrlKey: true, preventDefault: () => assert.fail('ctrl-click kept') });
  assert.equal(opened.length, 1);
});

// D6: every prerendered article carries a readable copy in <noscript>.
test('the static copy for readers without JavaScript holds every section, escaped, links only to the web', async () => {
  const { articleNoscript } = await import('../../scripts/lib/wiki-static.mjs');
  const { citationText } = await import('../../src/lib/vetwiki/cite.js');
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    const prov = provenanceSummary(k);
    const html = articleNoscript(k, { subjectName: 'S', sources: prov.sources, citation: citationText });
    assert.ok(html.startsWith('<noscript>') && html.endsWith('</noscript>'), t.id);
    assert.equal(html.match(/<noscript>/g).length, 1, `${t.id}: one noscript, never nested`);
    assert.doesNotMatch(html, /<script|<\/noscript>.+<\/noscript>|javascript:/i, t.id);
    assert.doesNotMatch(html, /undefined: |: undefined<|\[object Object\]/, `${t.id}: a body shape the copy does not know`);
    assert.equal((html.match(/<h2>/g) || []).length, k.sections.length + (prov.sources.length ? 1 : 0), `${t.id}: a heading per section`);
    for (const href of html.match(/href="[^"]*"/g) || []) assert.match(href, /^href="(\/wiki|https?:\/\/)/, `${t.id}: ${href}`);
  }
  const evil = articleNoscript({ title: '<b>x</b>', sections: [{ heading: 'a & b', body: ['</noscript><script>1</script>'] }] },
    { subjectName: '<i>', sources: [{ url: 'javascript:alert(1)', citation: 'c' }], citation: (s) => s.citation });
  assert.doesNotMatch(evil, /<script|<b>x|<i>|javascript:/);
  assert.match(evil, /&lt;\/noscript&gt;/);
});
