// ============================================================
// art-integration.test.mjs
// ============================================================
// The illustrations themselves cannot be unit-tested, but the two pieces of
// logic that decide WHICH one appears can, and both can be wrong in a way
// that is embarrassing rather than merely broken: a badge claiming something
// the student did not do, or a cheering Mochi shown to someone whose exam is
// still a month away.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { earnedBadges, longestDayStreak, answersInHourRange } from '../../src/lib/badges.js';
import { seasonalMochiKey } from '../../src/lib/seasonal-mochi.js';
import { EMPTY_ART, SUBJECT_MOCHI, BADGE_ART, IG_BACKGROUNDS, GAME_ART, LOADING_ART, SEASONAL_MOCHI, allArtPaths } from '../../src/data/art.js';

const day = (d, h = 12) => new Date(`2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00`).toISOString();

// ── streaks ──────────────────────────────────────────────────────
test('a streak counts consecutive days, not answers', () => {
  const history = [
    { date: day(1) }, { date: day(1) }, { date: day(2) }, { date: day(3) },
    { date: day(7) }, { date: day(8) },
  ];
  assert.equal(longestDayStreak(history), 3);
});

test('an empty or unparseable history has no streak', () => {
  assert.equal(longestDayStreak([]), 0);
  assert.equal(longestDayStreak([{ date: 'not a date' }]), 0);
  assert.equal(longestDayStreak(null), 0);
});

test('an hour window that crosses midnight still counts', () => {
  const history = [{ date: day(1, 23) }, { date: day(2, 1) }, { date: day(2, 15) }];
  assert.equal(answersInHourRange(history, 22, 4), 2);
  assert.equal(answersInHourRange(history, 5, 8), 0);
});

// ── badges ───────────────────────────────────────────────────────
test('a badge is not awarded before it is earned', () => {
  const history = Array.from({ length: 99 }, (_, i) => ({ date: day(1), correct: true, id: i }));
  const ids = earnedBadges({ history }).map((b) => b.id);
  assert.ok(!ids.includes('questions-100'), '99 answers is not 100');
});

test('a badge carries the reason it was given', () => {
  const history = Array.from({ length: 120 }, (_, i) => ({ date: day(1), correct: true, id: i }));
  const badge = earnedBadges({ history }).find((b) => b.id === 'questions-100');
  assert.ok(badge, 'should be earned at 120');
  assert.match(badge.why, /120/);
  assert.ok(badge.src && badge.label);
});

test('a perfect set needs to be a real set, not one lucky answer', () => {
  const history = [{ date: day(1), correct: true, id: 1 }];
  const few = earnedBadges({ history, stats: { correctPct: 100, qCount: 3 } }).map((b) => b.id);
  assert.ok(!few.includes('perfect'), '3 questions is not a set');
  const real = earnedBadges({ history, stats: { correctPct: 100, qCount: 20 } }).map((b) => b.id);
  assert.ok(real.includes('perfect'));
});

test('going back and fixing a wrong answer is what earns that badge', () => {
  // Wrong first, right later, on the same question — 20 of them.
  const history = [];
  for (let i = 0; i < 20; i += 1) {
    history.push({ date: day(1), correct: false, id: i, subject: 'com3' });
    history.push({ date: day(2), correct: true, id: i, subject: 'com3' });
  }
  const ids = earnedBadges({ history }).map((b) => b.id);
  assert.ok(ids.includes('corrected-mistakes'));

  // Answering 40 different questions correctly first time is not the same
  // thing and must not earn it.
  const cleanRun = Array.from({ length: 40 }, (_, i) => ({ date: day(1), correct: true, id: i, subject: 'com3' }));
  assert.ok(!earnedBadges({ history: cleanRun }).map((b) => b.id).includes('corrected-mistakes'));
});

test('every earned badge has art that exists in the registry', () => {
  const history = Array.from({ length: 1200 }, (_, i) => ({ date: day((i % 28) + 1, 23), correct: true, id: i }));
  for (const b of earnedBadges({ history, stats: { correctPct: 100, qCount: 60 } })) {
    assert.ok(BADGE_ART[b.id], `${b.id} has no art`);
    assert.equal(b.src, BADGE_ART[b.id].src);
  }
});

// ── seasonal ─────────────────────────────────────────────────────
test('the seasonal Mochi only appears inside a window the schedule puts you in', () => {
  const now = new Date('2026-09-14T10:00:00');
  assert.equal(seasonalMochiKey({ now, daysLeft: 30 }), null, 'a month out is ordinary');
  assert.equal(seasonalMochiKey({ now, daysLeft: null }), null, 'no exam is ordinary');
  assert.equal(seasonalMochiKey({ now, daysLeft: 5 }), 'exam-week');
  assert.equal(seasonalMochiKey({ now, daysLeft: 1 }), 'exam-eve');
  assert.equal(seasonalMochiKey({ now, daysLeft: 0 }), 'exam-eve');
});

test('the days after the last paper celebrate, then settle', () => {
  const last = '2026-09-10T09:00:00';
  assert.equal(seasonalMochiKey({ now: new Date('2026-09-11T10:00:00'), lastExamDate: last }), 'exam-finished');
  assert.equal(seasonalMochiKey({ now: new Date('2026-09-20T10:00:00'), lastExamDate: last }), 'holiday');
});

test('new year outranks the exam windows', () => {
  const now = new Date('2026-12-31T10:00:00');
  assert.equal(seasonalMochiKey({ now, daysLeft: 3 }), 'new-year');
});

test('every seasonal key maps to art', () => {
  for (const key of ['exam-week', 'exam-eve', 'exam-finished', 'holiday', 'new-year']) {
    assert.ok(SEASONAL_MOCHI[key]?.src, `${key} has no art`);
  }
});

// ── the registry itself ──────────────────────────────────────────
test('every registry entry points at a webp under /art/', () => {
  for (const p of allArtPaths()) {
    assert.match(p, /^\/art\/[a-z-]+\/[a-z0-9-]+\.webp$/, `${p} is not a normal art path`);
  }
});

test('illustrations that a screen reader meets carry alt text', () => {
  for (const [id, entry] of Object.entries(EMPTY_ART)) {
    assert.ok(entry.alt && entry.alt.length > 4, `${id} needs alt describing the picture`);
  }
  for (const [id, entry] of Object.entries(SEASONAL_MOCHI)) {
    assert.ok(entry.alt && entry.alt.length > 4, `${id} needs alt`);
  }
});

test('the IG picker opens on "no pattern"', () => {
  // The plain gradient has to stay reachable, and it is what an unchanged
  // workflow produces.
  assert.equal(IG_BACKGROUNDS[0].id, 'none');
  assert.equal(IG_BACKGROUNDS[0].src, null);
});

test('the game names every sprite it draws', () => {
  for (const key of ['chickRunning', 'chickJumping', 'chickTumbling', 'germRound', 'germTall', 'shield', 'speed']) {
    assert.ok(GAME_ART[key], `${key} missing`);
  }
});

test('the loading book is the one marked as spinnable', () => {
  // Only a radially symmetrical drawing can be rotated without looking wrong.
  assert.equal(LOADING_ART.book.spin, true);
  assert.equal(LOADING_ART.plane.spin, false);
});
