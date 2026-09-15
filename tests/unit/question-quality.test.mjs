// ============================================================
// question-quality.test.mjs
// ============================================================
// The flags exist so a wrong key is noticed before a student reports it.
// Each case here is a shape the real data has already produced.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { qualityFlags, answerDistribution, rankQuestions, fillDaily, wrongRate } from '../../src/lib/question-quality.js';

test('a question nobody has ever answered correctly is flagged, a fresh one is not', () => {
  const never = qualityFlags({ attempts: 8, wrong: 8, users: 2, users_wrong: 2, answers: {} });
  assert.deepEqual(never.map((f) => f.key), ['always-wrong']);
  assert.deepEqual(qualityFlags({ attempts: 2, wrong: 2, users: 1, users_wrong: 1, answers: {} }), []);
  assert.deepEqual(qualityFlags(null), []);
});

test('most users wrong needs three people, not one person three times', () => {
  const crowd = qualityFlags({ attempts: 6, wrong: 6, users: 4, users_wrong: 4, answers: {} });
  assert.deepEqual(crowd.map((f) => f.key), ['always-wrong', 'most-users-wrong']);
  const one = qualityFlags({ attempts: 6, wrong: 5, users: 1, users_wrong: 1, answers: {} });
  assert.deepEqual(one.map((f) => f.key), ['high-wrong']);
});

test('one distractor taking the crowd is flagged only when the key is known', () => {
  const row = { attempts: 10, wrong: 7, users: 5, users_wrong: 4, answers: { 0: 1, 2: 7, 3: 2, null: 1 } };
  assert.ok(!qualityFlags(row, null).some((f) => f.key === 'one-distractor'));
  const flagged = qualityFlags(row, 3);
  const f = flagged.find((x) => x.key === 'one-distractor');
  assert.ok(f);
  assert.match(f.label, /ตัวเลือก C/);
  // If C IS the key, the crowd is right and there is nothing to flag.
  assert.ok(!qualityFlags(row, 2).some((x) => x.key === 'one-distractor'));
});

test('answer distribution drops unanswered and sorts by option', () => {
  assert.deepEqual(answerDistribution({ 3: 2, null: 5, 1: 4, x: 9 }), [{ index: 1, count: 4 }, { index: 3, count: 2 }]);
  assert.deepEqual(answerDistribution(null), []);
});

test('ranking puts the worst wrong rate first and breaks ties by people caught', () => {
  const rows = [
    { question_id: 1, attempts: 10, wrong: 5, users: 5, users_wrong: 3 },
    { question_id: 2, attempts: 4, wrong: 4, users: 4, users_wrong: 4 },
    { question_id: 3, attempts: 3, wrong: 3, users: 1, users_wrong: 1 },
  ];
  assert.deepEqual(rankQuestions(rows).map((r) => r.question_id), [2, 3, 1]);
  assert.equal(wrongRate(rows[0]), 0.5);
});

test('fillDaily gives every day in the window, zeros where nothing happened', () => {
  const today = new Date(2026, 8, 15, 12);
  const out = fillDaily([{ d: '2026-09-14', attempts: 3, correct: 1, users: 1 }], 7, today);
  assert.equal(out.length, 7);
  assert.equal(out[0].d, '2026-09-09');
  assert.equal(out[6].d, '2026-09-15');
  assert.deepEqual(out[5], { d: '2026-09-14', attempts: 3, correct: 1, users: 1 });
  assert.equal(out[6].attempts, 0);
});
