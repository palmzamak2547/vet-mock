// ============================================================
// vetwiki-sources-work.test.mjs: one work, one count
// ============================================================
// Review of 5.146.0. The ingest pipeline minted a registry id per citation
// string, so the WOAH rabies chapter (one PDF) was three entries and the
// masthead's "แหล่งอ้างอิง" counted ids, not works: 2,114 where the corpus
// cites 2,102. sources.js now names each alias's work (SAME_WORK), pages
// count works, and a new duplicate must be named before it can ship.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, SAME_WORK, DISTINCT_AT_SAME_LINK, workOf } from '../../src/lib/vetwiki/sources.js';
import { loadTopic, provenanceSummary } from '../../src/lib/vetwiki/index.js';
import { SHELF_TOTALS } from '../../src/lib/vetwiki/shelf.generated.js';

const norm = (u) => String(u || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[#?].*$/, '').replace(/\/+$/, '');

test('every alias names a registered work that is not itself an alias', () => {
  for (const [alias, work] of Object.entries(SAME_WORK)) {
    assert.ok(SOURCES[alias], `${alias} is registered`);
    assert.ok(SOURCES[work], `${alias} -> ${work} is registered`);
    assert.equal(SAME_WORK[work], undefined, `${work} is a work, not an alias`);
    assert.equal(workOf(SOURCES[alias]), work);
  }
});

test('entries that share a link, a PMID or a DOI are one work, or listed as different works', () => {
  const distinct = new Set(DISTINCT_AT_SAME_LINK.map((pair) => [...pair].sort().join('|')));
  const keys = [['link', (s) => s.url && norm(s.url)], ['PMID', (s) => s.pmid], ['DOI', (s) => s.doi && s.doi.toLowerCase()]];
  for (const [kind, key] of keys) {
    const by = new Map();
    for (const s of Object.values(SOURCES)) {
      const k = key(s);
      if (k) by.set(k, [...(by.get(k) || []), s]);
    }
    for (const [k, group] of by) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const [a, b] = [group[i], group[j]];
          const listed = distinct.has([a.id, b.id].sort().join('|'));
          assert.ok(workOf(a) === workOf(b) || listed,
            `${a.id} and ${b.id} share a ${kind} (${k}): name the work in SAME_WORK or list them in DISTINCT_AT_SAME_LINK`);
        }
      }
    }
  }
});

test('a topic counts a work once: Rabies cites the WOAH chapter under two ids and lists it once', () => {
  const k = loadTopic('com5', 'rabies');
  const cited = new Set();
  for (const s of k.sections) for (const c of s.claims || []) for (const r of c.sourceRefs || []) if (SOURCES[r.sourceId]) cited.add(r.sourceId);
  assert.ok(cited.has('woah-tahm-rabies') && cited.has('guide-world-organisation-for-2023'), 'both ids are cited on the page');
  const p = provenanceSummary(k);
  const works = p.sources.map(workOf);
  assert.equal(new Set(works).size, works.length, 'no work listed twice');
  assert.ok(p.sources.length < cited.size, `${p.sources.length} works from ${cited.size} ids`);
});

test('the masthead counts works', () => {
  assert.equal(SHELF_TOTALS.sources, 2106); // 2102 + four zoonoses works (5.146.1)
});
