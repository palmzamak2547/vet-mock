// ============================================================
// One streak number, and it is the one that knows about the freeze
// ============================================================
// A skipped day with a streak of 5+ is forgiven once: updateStreak keeps
// the run going. HomeView also derived a streak of its own by walking back
// over days that had answers — and a frozen day has none, so that walk
// stopped there. The result was the home screen saying "your 8-day streak
// was saved" directly above a card reading 1.
//
// This pins the freeze behaviour and the reason the walk cannot stand in
// for it. Both numbers advance on the same event (a graded set), so
// deferring to the saved one costs no freshness.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { updateStreak } from '../../src/hooks/utils.js';

const DAY = 86400000;
const dayStart = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const today = dayStart(Date.now());

test('a single skipped day is forgiven once when the streak is long enough', () => {
  const r = updateStreak(today - 2 * DAY, 7, null);
  assert.equal(r.streak, 8, 'a 7-day streak was reset by one missed day');
  assert.ok(r.freezeJustUsed, 'the freeze fired without telling anyone');
  assert.ok(r.freezeUsedAt, 'the freeze was not recorded, so it could be spent twice');
});

test('the freeze is spent once per run, not once per gap', () => {
  const r = updateStreak(today - 2 * DAY, 9, today - 30 * DAY);
  assert.equal(r.streak, 1, 'a second skipped day still kept the streak alive');
});

test('a short streak gets no freeze', () => {
  assert.equal(updateStreak(today - 2 * DAY, 4, null).streak, 1);
});

test('walking back over days that have answers cannot see a freeze', () => {
  // The exact shape HomeView used: yesterday skipped, so the run reads as 1
  // even though updateStreak says 8. This is why the saved value wins.
  const days = new Set([today, today - 2 * DAY, today - 3 * DAY].map((t) => new Date(t).toLocaleDateString('en-CA')));
  let walked = 0;
  for (let c = new Date(today); days.has(new Date(c).toLocaleDateString('en-CA')); c = new Date(c - DAY)) walked++;
  assert.equal(walked, 1, 'the walk no longer stops at the gap — re-check the claim below');
  assert.equal(updateStreak(today - 2 * DAY, 7, null).streak, 8);
});

test('HomeView defers to the saved streak', () => {
  const SRC = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.match(
    SRC,
    /if \(streakData\?\.lastDate\) streak = streakData\.streak/,
    'HomeView is computing its own streak again — it will contradict the freeze toast',
  );
});
