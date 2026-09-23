// ============================================================
// A subject must not be passable by always picking the longest option
// ============================================================
// lint:questions judged length one question at a time, against the mean
// distractor, and only warned below 1.6x. A key that is merely the longest
// option, by a margin too small to trip that ratio, passed every time, so a
// whole subject could reward "pick the longest" (com1 88%, engprof1 61%,
// vet-pharm-2 60% against a chance rate of 20-25%) and no gate noticed.
//
// The lint now scores each subject for two strategies, always-longest and
// always-shortest (ties split evenly, as year4-longest-option.test.mjs
// does), and fails when a subject beats chance by more than the margin
// unless it is listed in the budget, which may only fall.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  lintQuestions,
  loadQuestions,
  lengthStrategyScores,
  LENGTH_STRATEGY_BUDGET,
  STRATEGY_MARGIN,
  STRATEGY_MIN_N,
} = require('../../scripts/lint-questions.cjs');

let nextId = 997000;
// One MCQ whose key sits at `answerAt`, with option lengths chosen by `lens`.
const mcq = (subject, lens, answerAt) => ({
  id: nextId++, subject, topic: 't', type: 'mcq', q: 'fixture',
  options: lens.map((n, i) => `${'ก'.repeat(n)}${i}`),
  answer: answerAt, explain: 'fixture',
});
const bank = (subject, n, pick) => Array.from({ length: n }, (_, i) => pick(i));
const strategyErrors = (qs, opts) => lintQuestions(qs, opts).errors.filter((f) => f.kind === 'length-strategy');

test('a subject whose key is always the longest option fails the lint', () => {
  // key 12 chars, distractors 10: never the 1.6x per-question ratio, always longest
  const qs = bank('fixture-longest', 25, (i) => mcq('fixture-longest', [10, 10, 12, 10], 2));
  assert.deepEqual(lintQuestions(qs).findings.filter((f) => f.kind === 'length-bias'), [], 'no per-question finding');
  const errs = strategyErrors(qs);
  assert.equal(errs.length, 1);
  assert.equal(errs[0].strategy, 'longest');
  assert.equal(errs[0].subject, 'fixture-longest');
});

test('always-shortest is scored the same way', () => {
  const qs = bank('fixture-shortest', 25, () => mcq('fixture-shortest', [12, 12, 10, 12], 2));
  const errs = strategyErrors(qs);
  assert.deepEqual(errs.map((e) => e.strategy), ['shortest']);
});

test('a subject whose key is the longest only at chance passes', () => {
  // key rotates through the positions of a fixed length ladder, so the key is
  // longest in one question of four: 25%, the chance rate
  const qs = bank('fixture-fair', 24, (i) => mcq('fixture-fair', [10, 11, 12, 13], i % 4));
  assert.deepEqual(strategyErrors(qs), []);
});

test('a small subject is not judged', () => {
  const qs = bank('fixture-small', STRATEGY_MIN_N - 1, () => mcq('fixture-small', [10, 10, 12, 10], 2));
  assert.deepEqual(strategyErrors(qs), []);
});

test('a listed subject may stay at its budget and fall, never rise', () => {
  const qs = bank('fixture-listed', 20, (i) => mcq('fixture-listed', [10, 10, 12, 10], i < 10 ? 2 : 0));
  // longest wins 10 of 20 = 50%
  const at = { longest: { 'fixture-listed': 50 }, shortest: {} };
  assert.deepEqual(strategyErrors(qs, { strategyBudget: at }), []);
  const below = { longest: { 'fixture-listed': 49 }, shortest: {} };
  assert.equal(strategyErrors(qs, { strategyBudget: below }).length, 1, 'rose above its budget');
  const loose = { longest: { 'fixture-listed': 60 }, shortest: {} };
  const warns = lintQuestions(qs, { strategyBudget: loose }).warns.filter((f) => f.kind === 'length-strategy-budget');
  assert.equal(warns.length, 1, 'a budget above the score asks to be lowered');
});

// The live bank against the committed budget.
const live = await loadQuestions();

test('the live bank is within its length-strategy budget', () => {
  assert.deepEqual(strategyErrors(live).map((e) => `${e.subject} ${e.strategy} ${e.score}%`), []);
});

test('the budget lists exactly the subjects that still beat chance, and no others', () => {
  const scores = lengthStrategyScores(live);
  for (const strategy of ['longest', 'shortest']) {
    const over = scores
      .filter((s) => s.n >= STRATEGY_MIN_N && s[strategy] - s.chance > STRATEGY_MARGIN)
      .map((s) => s.subject).sort();
    assert.deepEqual(Object.keys(LENGTH_STRATEGY_BUDGET[strategy]).sort(), over, strategy);
  }
});
