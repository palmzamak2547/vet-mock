// Tap-to-define worked on about one question in four overall, and on 3 of 346
// aquatic questions (0.9%): no glossary entry used the aquatic family, so WSSV,
// EHP, hepatopancreas and Aeromonas were plain text. scripts/report-glossary-
// gaps.mjs lists, per subject, the terms that five or more questions use and
// that no in-scope entry defines; the aquatic entries it pointed at are now
// written from the aquatic notes and recordings.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { glossaryGaps } from '../../scripts/report-glossary-gaps.mjs';
import { GLOSSARY, resolveGlossaryEntry, expandScope } from '../../src/data/glossary.js';
import { detectTerms } from '../../src/lib/term-detect.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

const text = (q) => `${q.q || ''}\n${q.explain || ''}\n${q.model_answer || ''}`;
const row = (id, q) => ({ id, subject: 'aquatic-clinic', q, explain: '' });

test('a term five questions use, with no in-scope entry, is reported', () => {
  const qs = [1, 2, 3, 4, 5].map((i) => row(i, `Foobarvirus ในกุ้ง ${i}`));
  const none = () => null;
  assert.deepEqual(glossaryGaps(qs, { resolve: none }).map((g) => [g.subject, g.term, g.questions]), [['aquatic-clinic', 'Foobarvirus', 5]]);
  assert.deepEqual(glossaryGaps(qs.slice(0, 4), { resolve: none }), [], 'four questions is under the bar');
  assert.deepEqual(glossaryGaps(qs, { resolve: () => ({}) }), [], 'a term that resolves in scope is not a gap');
  assert.deepEqual(glossaryGaps([1, 2, 3, 4, 5].map((i) => row(i, `disease of the water ${i}`)), { resolve: none }), [], 'plain English words are not terms');
});

test('a word inside a phrase that already opens a card is not a gap', () => {
  // "antennal" alone resolves to nothing, but "antennal gland" has a card, so
  // listing "antennal" would send an author to write a card that exists.
  const qs = [1, 2, 3, 4, 5].map((i) => row(i, `antennal gland ของกุ้ง ${i}`));
  assert.equal(resolveGlossaryEntry('antennal', 'aquatic-clinic'), null);
  assert.deepEqual(glossaryGaps(qs, { resolve: resolveGlossaryEntry, covered: detectTerms }), []);
  const alone = [1, 2, 3, 4, 5].map((i) => row(i, `antennal ของกุ้ง ${i}`));
  assert.deepEqual(glossaryGaps(alone, { resolve: resolveGlossaryEntry, covered: detectTerms }).map((g) => g.term), ['antennal'],
    'the same word outside the phrase still counts');
});

test('every aquatic entry is scoped to aquatic and names a term aquatic questions use', async () => {
  await loadQB();
  const aq = QB.filter((q) => q.subject === 'aquatic-clinic' && isQuestionDeliverable(q));
  const entries = GLOSSARY.filter((e) => Array.isArray(e.scope) && e.scope.includes('aquatic'));
  assert.ok(entries.length >= 12, `only ${entries.length} aquatic entries`);
  for (const e of entries) {
    assert.deepEqual(e.scope, ['aquatic'], `${e.term}: aquatic entries stay inside aquatic`);
    assert.ok(expandScope(e.scope).has('aquatic-clinic'));
    assert.equal(resolveGlossaryEntry(e.term, 'aquatic-clinic'), e, `${e.term} resolves on an aquatic question`);
    const used = aq.filter((q) => detectTerms(text(q), 'aquatic-clinic').some((h) => h.entry === e)).length;
    assert.ok(used >= 1, `${e.term}: no aquatic question uses it`);
  }
});

test('at least one aquatic question in five has a term to tap', async () => {
  await loadQB();
  const aq = QB.filter((q) => q.subject === 'aquatic-clinic' && isQuestionDeliverable(q));
  const hit = aq.filter((q) => detectTerms(text(q), 'aquatic-clinic').length > 0).length;
  assert.ok(hit / aq.length >= 0.2, `aquatic coverage ${hit}/${aq.length} (${(100 * hit / aq.length).toFixed(1)}%)`);
});
