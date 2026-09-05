// ============================================================
// citation-gate-real-ids.test.mjs — the gate must find real questions
// ============================================================
// getEligibleCitationForQuestion rejected every non-string and then compared
// a string to the bank's numeric ids, so it returned null for every real
// question and the "Citation" block in QSourceChip never rendered. The
// eligibility guards (approved page, approved anchor, mappingEligible,
// a sourceApprovalRef) are untouched — this only proves the lookup works.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { QB, loadQB } from '../../src/data/questions.js';
import { getEligibleCitationForQuestion } from '../../src/lib/citation-gate.js';

await loadQB();

test('a numeric bank id resolves to its citation', () => {
  const c = getEligibleCitationForQuestion(501, 'com5');
  assert.ok(c, 'com5:501 carries an approved, verified wiki reference');
  assert.equal(c.url, '/wiki/com5-canine-viral-enteritis#clinical-presentation');
  assert.equal(c.mappingEligible, true);
});

test('the same id as a string resolves the same way', () => {
  assert.deepEqual(getEligibleCitationForQuestion('501', 'com5'), getEligibleCitationForQuestion(501, 'com5'));
});

test('a question object is still refused — the gate takes ids, not payloads', () => {
  const q = QB.find((x) => x.id === 501 && x.subject === 'com5');
  assert.equal(getEligibleCitationForQuestion(q, 'com5'), null);
});

test('the subject scopes the lookup, because ids repeat across banks', () => {
  const dup = QB.filter((x) => x.id === 501);
  assert.ok(dup.length >= 1);
  assert.equal(getEligibleCitationForQuestion(501, 'no-such-subject'), null);
});

test('more than a handful of real questions are eligible now', () => {
  let eligible = 0;
  for (const q of QB) {
    if (!(q.questionWikiRef || (Array.isArray(q.wikiRefs) && q.wikiRefs.length))) continue;
    if (getEligibleCitationForQuestion(q.id, q.subject)) eligible++;
  }
  assert.ok(eligible >= 3, `expected eligible citations in the real corpus, found ${eligible}`);
});
