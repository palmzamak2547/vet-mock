// The read page's provenance line ("หัวข้อนี้มี N จุดที่ตรวจทาน...") is computed once, in
// schema.js, for both the build-time API (index.js) and the browser runtime (runtime.js). The
// browser copy once counted every claim instead of verified ones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { summarizeProvenance } from '../../src/lib/vetwiki/schema.js';

test('only verified claims count, and one work cited under two ids is one source', () => {
  const works = { a: { id: 'a', work: 'w1' }, b: { id: 'b', work: 'w1' }, c: { id: 'c' } };
  const topic = { sections: [
    { reviewStatus: 'verified', claims: [
      { reviewStatus: 'verified', sourceRefs: [{ sourceId: 'a' }] },
      { reviewStatus: 'draft', sourceRefs: [{ sourceId: 'b' }] },
    ] },
    { reviewStatus: 'draft', claims: [{ reviewStatus: 'verified', sourceRefs: [{ sourceId: 'c' }] }] },
    { reviewStatus: 'metadata', claims: [] },
  ] };
  const p = summarizeProvenance(topic, (ref) => works[ref.sourceId] || null);
  assert.equal(p.verifiedClaimCount, 2);
  assert.equal(p.sources.length, 2);
  assert.equal(p.draftSectionCount, 1);
  assert.equal(p.metadataSectionCount, 1);
  assert.match(p.headline, /2 จุด/);
  assert.equal(summarizeProvenance(null, () => null), null);
});

test('index.js and runtime.js both delegate to it', () => {
  for (const f of ['index.js', 'runtime.js']) {
    const src = readFileSync(new URL(`../../src/lib/vetwiki/${f}`, import.meta.url), 'utf8');
    assert.match(src, /return summarizeProvenance\(knowledgeTopic, resolveSource\);/, f);
  }
});
