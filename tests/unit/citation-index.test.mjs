// ============================================================
// citation-index — the ask guard's generated ground truth
// ============================================================
// The palette validates AI citations against citation-index.generated.js
// instead of loading the corpus barrel. That is only safe if the index is
// SEMANTICALLY the same derivation — not merely a file the lint says is
// fresh — so the first test rebuilds the map from the live corpus and
// compares every entry. The second pins the guard behaviour the palette
// relies on: a section id the build does not have can never validate.

import test from 'node:test';
import assert from 'node:assert/strict';

import { CITATION_INDEX } from '../../src/lib/vetwiki/citation-index.generated.js';
import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';
import { allowedFromSections, validateAnswer } from '../../src/lib/vetwiki/answer.js';

test('the generated index IS allowedFromSections over the live corpus', () => {
  const live = {};
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    if (!k) continue;
    for (const [id, v] of allowedFromSections(k.id, k.sections)) {
      live[id] = [v.topicId, v.verified ? 1 : 0];
    }
  }
  assert.deepEqual(CITATION_INDEX, live);
  assert.ok(Object.keys(live).length > 1500, 'corpus-sized, not a stub');
});

test('a fabricated sectionId cannot validate a citation through the index', () => {
  // Mirror the palette's allowed-map build: server-declared sections
  // intersected with what this build really has.
  const metaSections = [
    { sectionId: 'com5--rabies--no-such-section' },
    { sectionId: Object.keys(CITATION_INDEX)[0] },
  ];
  const allowed = new Map();
  for (const m of metaSections) {
    const hit = CITATION_INDEX[m.sectionId];
    if (!hit) continue;
    allowed.set(m.sectionId, { sectionId: m.sectionId, topicId: hit[0], verified: !!hit[1] });
  }
  assert.equal(allowed.size, 1);

  const { claims, downgraded } = validateAnswer([
    { id: 'c1', text: 'x', supportType: 'vetwiki-verified', support: [{ sectionId: 'com5--rabies--no-such-section' }] },
  ], allowed);
  assert.equal(claims[0].support.length, 0);
  assert.ok(downgraded >= 1);
  assert.notEqual(claims[0].supportType, 'vetwiki-verified');
});
