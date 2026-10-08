import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_W,
  initialStability,
  initialDifficulty,
  retrievability,
  intervalFor,
  nextFsrsState,
  previewFsrsIntervals,
} from '../../src/lib/fsrs.js';

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

// FSRS is a black box to the student: they see four buttons with day counts
// and trust them. Same contract as sm2-honesty — every number a button shows
// must come from the same arithmetic the grader will actually apply.

test('a first grade seeds stability and difficulty from that grade', () => {
  const good = nextFsrsState(null, 2, NOW);
  assert.equal(good.stability, DEFAULT_W[2], 'first Good uses S0(Good) = w2');
  assert.equal(good.difficulty, initialDifficulty(3));
  assert.equal(good.interval, Math.max(1, Math.round(intervalFor(good.stability))));
  assert.equal(good.lastReview, NOW);

  const again = nextFsrsState(null, 0, NOW);
  assert.equal(again.stability, initialStability(1));
  assert.ok(again.difficulty > good.difficulty, 'an Again start is harder than a Good start');
});

test('previewFsrsIntervals reports exactly what nextFsrsState will do', () => {
  const states = [
    null,
    { stability: null, difficulty: null, interval: 0, due: NOW, lastReview: null },
    { stability: 2.3065, difficulty: 5.11, interval: 2, due: NOW - DAY, lastReview: NOW - 2 * DAY },
    { stability: 21, difficulty: 7, interval: 25, due: NOW - 40 * DAY, lastReview: NOW - 60 * DAY },
    { stability: 0.5, difficulty: 9.2, interval: 1, due: NOW - 3 * DAY, lastReview: NOW - 3 * DAY },
  ];
  for (const state of states) {
    const previews = previewFsrsIntervals(state, NOW);
    for (const quality of [0, 1, 2, 3]) {
      assert.equal(
        previews[quality],
        nextFsrsState(state, quality, NOW).interval,
        `preview disagrees with the scheduler for quality ${quality} on ${JSON.stringify(state)}`,
      );
    }
  }
});

test('a pass schedules further out, in grade order', () => {
  const state = { stability: 6, difficulty: 5, interval: 6, due: NOW - DAY, lastReview: NOW - 8 * DAY };
  const hard = nextFsrsState(state, 1, NOW).interval;
  const good = nextFsrsState(state, 2, NOW).interval;
  const easy = nextFsrsState(state, 3, NOW).interval;
  assert.ok(hard < good, 'Hard must schedule sooner than Good');
  assert.ok(good < easy, 'Good must schedule sooner than Easy');
});

test('a lapse shrinks stability instead of pretending the card was easy', () => {
  // A mature card reviewed 60 days after its due date: real recall should
  // grow it, real forgetting must not.
  const state = { stability: 30, difficulty: 5, interval: 30, due: NOW - 30 * DAY, lastReview: NOW - 60 * DAY };
  const forgot = nextFsrsState(state, 0, NOW);
  const recalled = nextFsrsState(state, 2, NOW);
  assert.ok(forgot.stability < state.stability, 'forgetting must reduce stability');
  assert.ok(recalled.stability > state.stability, 'a real recall at ~85% retrievability must grow it');
  assert.ok(forgot.difficulty > state.difficulty, 'a lapse is difficulty evidence');
});

test('same-day reviews use the short-term rule, not the long-term one', () => {
  // Grading Good twice within minutes must not multiply stability by the
  // multi-day growth factor — FSRS-6's same-day increment is capped and
  // passes never shrink it.
  const first = nextFsrsState(null, 2, NOW);
  const second = nextFsrsState(first, 2, NOW + 5 * 60 * 1000);
  const sinc = Math.max(
    Math.exp(DEFAULT_W[17] * (3 - 3 + DEFAULT_W[18])) * first.stability ** (-DEFAULT_W[19]),
    1,
  );
  assert.ok(Math.abs(second.stability - first.stability * sinc) < 1e-9);
  assert.ok(second.interval >= 1, 'same-day pass still schedules at least a day out');
});

test('difficulty moves by evidence and stays in [1, 10]', () => {
  let state = { stability: 1, difficulty: 5, interval: 1, due: NOW, lastReview: NOW - 10 * DAY };
  for (let i = 0; i < 12; i++) {
    state = nextFsrsState(state, 0, NOW + (i + 1) * DAY);
    assert.ok(state.difficulty >= 1 && state.difficulty <= 10, `difficulty escaped its band at step ${i}`);
  }
  assert.ok(state.difficulty > 9.9, 'a card forgotten a dozen times saturates near hardest');
  // The mean-reversion term keeps it a hair inside the clamp; the point is
  // that repeated evidence of forgetting cannot be worn away by luck.
});

test('retrievability hits 90% at t = S by construction', () => {
  assert.ok(Math.abs(retrievability(30, 30) - 0.9) < 1e-9);
  assert.equal(retrievability(0, 30), 1);
  assert.ok(retrievability(60, 30) < 0.9, 'older than stability means less retrievable');
});

test('target interval at the requested retention equals stability', () => {
  assert.ok(Math.abs(intervalFor(42) - 42) < 1e-9,
    'inverting the curve at 0.9 must give the interval the curve was built on');
});
