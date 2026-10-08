import assert from 'node:assert/strict';
import test from 'node:test';

import { initCard, updateCard } from '../../src/hooks/sm2.js';
import {
  normalizeScheduler,
  algorithmFor,
  deriveFsrsState,
  ensureFsrsState,
  gradeCard,
  getDueCards,
  getCardStats,
  previewIntervals,
} from '../../src/lib/sr-scheduler.js';

// Dispatcher tests read real due filters (Date.now() inside), so timestamps
// here are relative to the real clock.
const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

// The dispatcher's whole job is to make switching schedulers safe. These tests
// pin the guarantees the switch depends on: SM-2 arithmetic unchanged, the
// FSRS state advancing in parallel, and bucket semantics that do not depend
// on which scheduler happens to be selected.

test('normalizeScheduler falls back to SM-2 on anything unknown', () => {
  assert.equal(normalizeScheduler('sm2'), 'sm2');
  assert.equal(normalizeScheduler('fsrs'), 'fsrs');
  assert.equal(normalizeScheduler('bogus'), 'sm2');
  assert.equal(normalizeScheduler(undefined), 'sm2');
});

test('algorithmFor names the review-event algorithm per scheduler', () => {
  assert.equal(algorithmFor('sm2'), 'vetmock-sm2-v1');
  assert.equal(algorithmFor('fsrs'), 'vetmock-fsrs6-v1');
});

test('deriveFsrsState reads a card without one and never mutates it', () => {
  const reviewed = { ...initCard(1), totalReviews: 6, interval: 14, easeFactor: 2.2, repetitions: 6, lastReview: NOW - 10 * DAY, nextReview: NOW + 4 * DAY };
  const derived = deriveFsrsState(reviewed);
  assert.equal(derived.stability, 14, 'the SM-2 interval is the stability proxy');
  assert.ok(Math.abs(derived.difficulty - 4.9375) < 1e-9, 'ease 2.2 maps to difficulty 4.9375');
  assert.equal(derived.due, reviewed.nextReview);
  assert.equal(reviewed.fsrs, undefined, 'derivation is read-only');

  const fresh = initCard(2);
  const freshDerived = deriveFsrsState(fresh);
  assert.equal(freshDerived.stability, null, 'an unseen card has no FSRS stability yet');
});

test('ensureFsrsState accepts a stored sub-object and re-derives a broken one', () => {
  const stored = { stability: 9, difficulty: 6, interval: 9, due: NOW, lastReview: NOW };
  assert.equal(ensureFsrsState({ fsrs: stored }), stored);
  assert.equal(ensureFsrsState({ fsrs: { due: 'soon' } }).stability, null,
    'a shape-invalid sub-object falls back to derivation');
});

test('gradeCard advances the SM-2 fields exactly as updateCard always has', () => {
  const card = { ...initCard(3), repetitions: 3, interval: 10, easeFactor: 2.5, totalReviews: 3, lastReview: NOW - 10 * DAY };
  const DAY_MS = 24 * 60 * 60 * 1000;
  for (const scheduler of ['sm2', 'fsrs']) {
    for (const quality of [0, 1, 2, 3]) {
      const viaDispatcher = gradeCard(card, quality, { now: NOW, scheduler });
      const direct = updateCard(card, quality);
      // The updateCard formula is anchored to the grade's canonical `now`
      // (updateCard itself stamps the wall clock), so the formula outputs are
      // compared exactly and the timestamps are checked against that anchor.
      assert.equal(viaDispatcher.interval, direct.interval, `interval under ${scheduler}`);
      assert.equal(viaDispatcher.easeFactor, direct.easeFactor, `ease under ${scheduler}`);
      assert.equal(viaDispatcher.repetitions, direct.repetitions, `repetitions under ${scheduler}`);
      assert.equal(viaDispatcher.lapses, direct.lapses, `lapses under ${scheduler}`);
      assert.equal(viaDispatcher.lastReview, NOW, `lastReview anchored under ${scheduler}`);
      assert.equal(viaDispatcher.nextReview, NOW + viaDispatcher.interval * DAY_MS, `nextReview anchored under ${scheduler}`);
    }
  }
});

test('gradeCard keeps the fsrs sub-object current under both schedulers', () => {
  const card = { ...initCard(4), totalReviews: 4, interval: 12, easeFactor: 2.4, repetitions: 4, lastReview: NOW - 12 * DAY, nextReview: NOW - DAY };
  const asSm2 = gradeCard(card, 2, { now: NOW, scheduler: 'sm2' });
  const asFsrs = gradeCard(card, 2, { now: NOW, scheduler: 'fsrs' });
  assert.ok(asSm2.fsrs, 'SM-2 mode also writes the fsrs sub-object');
  assert.ok(asSm2.fsrs.stability > 0);
  assert.equal(asSm2.fsrs.lastReview, NOW);
  // Same inputs, same parallel state — the scheduler choice only decides
  // which schedule is *read*, never which one is maintained.
  assert.equal(asSm2.fsrs.stability, asFsrs.fsrs.stability);
  assert.equal(asSm2.fsrs.due, asFsrs.fsrs.due);
  assert.ok(asFsrs.fsrs.due > NOW);
});

test('getDueCards reads the selected scheduler due date', () => {
  const sm2Due = { ...initCard(10), nextReview: NOW - 1000 };
  const fsrsDue = { ...initCard(11), nextReview: NOW - 1000, fsrs: { stability: 8, difficulty: 5, interval: 30, due: NOW + 10 * DAY, lastReview: NOW - 5 * DAY } };
  const cards = { 10: sm2Due, 11: fsrsDue };

  assert.deepEqual(getDueCards(cards, 0, 'sm2').map((c) => c.questionId), [10, 11],
    'SM-2 mode serves by nextReview, the fsrs sub-object is invisible to it');
  assert.deepEqual(getDueCards(cards, 0, 'fsrs').map((c) => c.questionId), [10],
    'FSRS mode serves by fsrs.due');
});

test('FSRS bucket semantics mirror SM-2 exactly', () => {
  // The 2026-05-12 inflation bug (1,800 "due" for a fresh user) must not be
  // able to come back under the new scheduler's stats.
  const fresh = initCard(20);
  const promoted = makePromoted(21);
  const mature = {
    ...initCard(22), totalReviews: 6, repetitions: 6, interval: 30, easeFactor: 2.6,
    lastReview: NOW - 31 * DAY, nextReview: NOW - DAY,
    fsrs: { stability: 30, difficulty: 4, interval: 30, due: NOW - DAY, lastReview: NOW - 31 * DAY },
  };
  const cards = { 20: fresh, 21: promoted, 22: mature };
  const stats = getCardStats(cards, 'fsrs');
  assert.equal(stats.total, 3);
  assert.equal(stats.due, 2, 'the mature card and the auto-promoted card are due');
  assert.equal(stats.new, 1, 'an unseen card is new, never due');
  assert.equal(stats.due + stats.new, stats.total, 'buckets must not double-count');
  assert.equal(stats.mastered, 1, 'fsrs interval ≥ 21 with a real history counts as mastered');

  function makePromoted(id) {
    const card = initCard(id);
    card.autoPromoted = true;
    card.nextReview = NOW - 1000;
    return card;
  }
});

test('previewIntervals serves the selected scheduler from the same arithmetic', () => {
  const card = { ...initCard(30), repetitions: 3, interval: 10, easeFactor: 2.5, totalReviews: 3, lastReview: NOW - 10 * DAY };
  const sm2Previews = previewIntervals(card, 'sm2');
  for (const quality of [0, 1, 2, 3]) {
    assert.equal(sm2Previews[quality], updateCard(card, quality).interval - 0, 'SM-2 preview matches its scheduler');
  }
  const fsrsPreviews = previewIntervals(card, 'fsrs');
  assert.ok(fsrsPreviews.every((n) => Number.isInteger(n) && n >= 1), 'FSRS previews are whole days, at least 1');
});
