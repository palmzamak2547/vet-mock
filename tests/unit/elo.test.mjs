import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_RATING,
  DIFFICULTY_MIN_ATTEMPTS,
  expectedScore,
  updateElo,
  clampRating,
  questionDifficulty,
  hasMeasuredDifficulty,
} from '../../src/lib/elo.js';

// The adaptive mode asks these numbers to pick a student's next question. A
// rating that drifts, flips or vanishes silently would serve the wrong pool
// while looking perfectly plausible — so the arithmetic is pinned like the
// SM-2 scheduler before it.

test('expectedScore is a symmetric logistic centred at 1500', () => {
  assert.equal(expectedScore(1500, 1500), 0.5);
  assert.ok(Math.abs(expectedScore(1600, 1500) - (1 - expectedScore(1500, 1600))) < 1e-12,
    'expected(A beats B) must mirror expected(B beats A)');
  assert.ok(Math.abs(expectedScore(1500, 1100) - 0.9) < 0.01,
    'a 400-point gap should land near the classic 10:1 odds');
});

test('expectedScore rises with own rating and falls with difficulty', () => {
  assert.ok(expectedScore(1700, 1500) > expectedScore(1600, 1500));
  assert.ok(expectedScore(1500, 1400) > expectedScore(1500, 1500));
});

test('updateElo moves toward the result, scaled by K', () => {
  const win = updateElo(1500, 0.5, 1);
  const loss = updateElo(1500, 0.5, 0);
  assert.equal(win, 1516);
  assert.equal(loss, 1484);
  // Beating a question that was expected to beat you moves you more.
  const upset = updateElo(1400, 0.36, 1);
  const expectedWin = updateElo(1400, 0.64, 1);
  assert.ok(upset > expectedWin, 'surprise is worth more than confirmation');
});

test('clampRating keeps ability inside the servable band', () => {
  assert.equal(clampRating(700), 800);
  assert.equal(clampRating(2400), 2200);
  assert.equal(clampRating(1500), 1500);
});

test('difficulty ladder: real attempts win once they are trustworthy', () => {
  const question = { id: 8037 };
  const data = { '8037': { rating: 1380, n: DIFFICULTY_MIN_ATTEMPTS } };
  assert.equal(questionDifficulty(question, data), 1380,
    'enough real attempts decide the rating');

  const thin = { '8037': { rating: 1380, n: DIFFICULTY_MIN_ATTEMPTS - 1 } };
  assert.equal(questionDifficulty(question, thin), DEFAULT_RATING,
    'a thin sample falls through to the neutral default');
});

test('difficulty ladder: the exam-likelihood tier is not a difficulty', () => {
  // predictionTier says how likely a question is to sit on the current paper
  // (docs/QUESTION-STANDARD.md D6 keeps that a separate axis). Reading it as
  // difficulty pushed the questions curators flagged as most likely on the
  // paper away from every average student in adaptive practice.
  for (const predictionTier of ['high', 'medium', 'low']) {
    assert.equal(questionDifficulty({ id: 107605, predictionTier }), DEFAULT_RATING,
      `a ${predictionTier}-tier question with no measured rating is a neutral question`);
  }
  const data = { '107605': { rating: 1420, n: DIFFICULTY_MIN_ATTEMPTS } };
  assert.equal(questionDifficulty({ id: 107605, predictionTier: 'high' }, data), 1420,
    'only measured attempts move it');
});

test('difficulty ladder: unknown is never missing', () => {
  assert.equal(questionDifficulty({ id: 4 }), DEFAULT_RATING,
    'most questions carry no measured rating; they must still resolve to a difficulty');
  assert.equal(questionDifficulty(null), DEFAULT_RATING);
  assert.equal(questionDifficulty({ id: 5 }, { '5': { rating: Number.NaN, n: 99 } }), DEFAULT_RATING,
    'a malformed entry is ignored, not trusted');
});

test('hasMeasuredDifficulty answers exactly when the ladder uses a measured rating', () => {
  const data = {
    '1': { rating: 1380, n: DIFFICULTY_MIN_ATTEMPTS },
    '2': { rating: 1380, n: DIFFICULTY_MIN_ATTEMPTS - 1 },
    '3': { rating: 'hard', n: 99 },
  };
  for (const id of [1, 2, 3, 4]) {
    const measured = hasMeasuredDifficulty({ id }, data);
    assert.equal(measured, questionDifficulty({ id }, data) !== DEFAULT_RATING || data[id]?.rating === DEFAULT_RATING,
      `question ${id}`);
  }
  assert.equal(hasMeasuredDifficulty({ id: 1 }, data), true);
  assert.equal(hasMeasuredDifficulty({ id: 2 }, data), false);
  assert.equal(hasMeasuredDifficulty({ id: 1 }, undefined), false);
});

test('the shipped generated snapshot is structurally sound', async () => {
  const mod = await import('../../src/data/question-difficulty.generated.js');
  assert.equal(typeof mod.QUESTION_DIFFICULTY_UPDATED_AT, 'string');
  assert.ok(!Number.isNaN(Date.parse(mod.QUESTION_DIFFICULTY_UPDATED_AT)));
  assert.equal(typeof mod.QUESTION_DIFFICULTY, 'object');
  assert.ok(mod.QUESTION_DIFFICULTY !== null);
  assert.ok(!Array.isArray(mod.QUESTION_DIFFICULTY));
  for (const [id, entry] of Object.entries(mod.QUESTION_DIFFICULTY)) {
    assert.match(id, /^[A-Za-z0-9_-]+$/);
    assert.ok(Number.isFinite(entry.rating) && entry.rating >= 800 && entry.rating <= 2200, `rating of ${id}`);
    assert.ok(Number.isInteger(entry.n) && entry.n >= DIFFICULTY_MIN_ATTEMPTS, `n of ${id}`);
  }
});
