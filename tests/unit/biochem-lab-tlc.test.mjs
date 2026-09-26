// ============================================================
// biochem-lab-tlc.test.mjs — Q70008 cannot mark a right answer wrong
// ============================================================
// 70008 (Biochem I lab final, TLC) asks which known spots the unknown lines
// up with. Its options held both "C และ D" and "D และ C", the same pair,
// and only "D และ C" was keyed, so a student who read the plate correctly
// and tapped the other one was marked wrong. And the plate the stem reads
// from was never attached, so nobody could answer it at all (B47).
//
// The duplicate is replaced with a distinct pair, and until the plate is
// scanned in, the question carries an "unclear" flag, which the delivery
// generator (scripts/regen-question-delivery.mjs) reads through
// questionNeedsAnswerReview and keeps out of every learner pool.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

import { QB_BIOCHEM_LAB } from '../../src/data/questions-biochem-lab.js';
import { questionNeedsAnswerReview } from '../../src/lib/question-prediction.js';

// "D และ C" and "C and D" name the same set {C, D}. A comma list is left
// alone: in this bank it is an order ("A, C, B, D" in 70034), where the
// sequence is the answer.
const asSet = (text) => String(text).split(/\s+(?:และ|and)\s+/i).map((s) => s.trim()).filter(Boolean).sort().join('|');

test('no biochem lab question offers the same set twice', () => {
  for (const q of QB_BIOCHEM_LAB) {
    if (!Array.isArray(q.options)) continue;
    const seen = new Map();
    q.options.forEach((opt, i) => {
      const key = asSet(opt);
      assert.ok(!seen.has(key), `${q.id}: options ${seen.get(key)} and ${i} are the same answer ("${q.options[seen.get(key)]}" / "${opt}")`);
      seen.set(key, i);
    });
  }
});

test('70008 keeps its key and stays out of learner pools until the TLC plate is attached', () => {
  const q = QB_BIOCHEM_LAB.find((r) => r.id === 70008);
  assert.ok(q, '70008 is in the bank');
  assert.equal(q.options[q.answer], 'D และ C', 'the examiner key is unchanged');
  if (!q.image && !q.imagePath) {
    assert.equal(questionNeedsAnswerReview(q), true, 'a plate-reading stem without the plate is held back');
  }
});
