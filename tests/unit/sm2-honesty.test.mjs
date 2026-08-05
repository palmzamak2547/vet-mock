import assert from 'node:assert/strict';
import test from 'node:test';

import { initCard, updateCard, getCardStats, getDueCards, previewInterval } from '../../src/hooks/sm2.js';
import { makeLowEaseCard } from '../../src/lib/wrong-to-sr.js';

// The scheduler used to contradict itself in three places at once. These tests
// pin each contradiction shut, because every one of them was invisible from the
// UI: the student saw a plausible number and had no way to know it was wrong.

test('Hard keeps the streak — it is a pass, not a total failure', () => {
  // A card three reviews deep on a 10-day interval.
  const card = { ...initCard(1), repetitions: 3, interval: 10, easeFactor: 2.5 };

  const hard = updateCard(card, 1);
  assert.equal(hard.lapses, 0, 'struggling but recalling is not forgetting');
  assert.equal(hard.repetitions, 4, 'the streak survives a Hard');
  assert.ok(hard.interval > 1, `Hard must not dump the card back to 1 day (got ${hard.interval})`);
  assert.ok(hard.easeFactor < card.easeFactor, 'the difficulty still costs ease');

  // Again, by contrast, really does reset.
  const again = updateCard(card, 0);
  assert.equal(again.lapses, 1);
  assert.equal(again.repetitions, 0);
  assert.equal(again.interval, 1);
});

test('Hard grows more slowly than Good', () => {
  const card = { ...initCard(2), repetitions: 3, interval: 10, easeFactor: 2.5 };
  assert.ok(
    updateCard(card, 1).interval < updateCard(card, 2).interval,
    'Hard should schedule sooner than Good',
  );
});

test('previewInterval reports what updateCard will actually do', () => {
  // A grade button that computes its own label eventually advertises timing the
  // scheduler does not produce. This is the check that keeps them in step.
  const cards = [
    { ...initCard(3) },
    { ...initCard(4), repetitions: 1, interval: 1 },
    { ...initCard(5), repetitions: 4, interval: 12, easeFactor: 2.1 },
    { ...initCard(6), repetitions: 2, interval: 6, easeFactor: 1.3 },
  ];
  for (const card of cards) {
    for (const quality of [0, 1, 2, 3]) {
      assert.equal(
        previewInterval(card, quality),
        updateCard(card, quality).interval,
        `preview disagrees with the scheduler for quality ${quality} on ${JSON.stringify(card)}`,
      );
    }
  }
});

test('a card the app auto-promoted is counted as due, not hidden as new', () => {
  // wrong-to-sr promotes a question the student missed twice. It writes
  // totalReviews: 0, and getCardStats used to require totalReviews > 0 — so
  // getDueCards served the card while every count that would have surfaced it
  // read zero.
  const card = makeLowEaseCard(42);
  card.nextReview = Date.now() - 1000; // its day has come

  const stats = getCardStats({ 42: card });
  assert.equal(stats.due, 1, 'the card the app itself flagged must show up as due');
  assert.equal(stats.new, 0, 'a question missed twice is not an unseen card');
  assert.equal(getDueCards({ 42: card }).length, 1, 'and the session still serves it');
  assert.equal(stats.due + stats.new, stats.total, 'buckets must not double-count');
});

test('a genuinely unseen card still stays out of due', () => {
  // The reason the totalReviews > 0 rule exists: two real users opened the app
  // and were told ~1,800 cards were due. That must not come back.
  const fresh = initCard(7);
  const stats = getCardStats({ 7: fresh });
  assert.equal(stats.due, 0, 'never-reviewed cards are new, not due');
  assert.equal(stats.new, 1);
});
