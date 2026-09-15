// ============================================================
// schedule-next-class.test.mjs
// ============================================================
// After the last class of the day the home chip used to go dark for the
// whole evening. getNextClass looks past today so it can say "พรุ่งนี้".
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getNextClass, getNextClassToday, getClassesForDay } from '../../src/data/schedule.js';

const firstDayWithClasses = (year) => {
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 8, 14 + i, 9, 0); // week of 14 Sep 2026, a Monday
    if (getClassesForDay(year, d).length) return d;
  }
  return null;
};

test('during the day it is the next class today, with dayOffset 0', () => {
  const d = firstDayWithClasses(5);
  assert.ok(d, 'year 5 has a timetable this week');
  const early = new Date(d); early.setHours(0, 1);
  const next = getNextClass(5, early);
  assert.equal(next.dayOffset, 0);
  assert.equal(next.start, getNextClassToday(5, early).start);
});

test('after the last class it rolls to the first class of a later day', () => {
  const d = firstDayWithClasses(5);
  const late = new Date(d); late.setHours(23, 30);
  assert.equal(getNextClassToday(5, late), null);
  const next = getNextClass(5, late);
  assert.ok(next, 'a later day this week has a class');
  assert.ok(next.dayOffset >= 1 && next.dayOffset <= 7);
  const target = new Date(late); target.setDate(target.getDate() + next.dayOffset);
  assert.equal(next.start, getClassesForDay(5, target)[0].start);
});

test('a year with no timetable gives null, not a crash', () => {
  assert.equal(getNextClass(1, new Date(2026, 8, 15, 20, 0)), null);
});
