// ============================================================
// schedule-next-class.test.mjs
// ============================================================
// After the last class of the day the home chip used to go dark for the
// whole evening. getNextClass looks past today so it can say "พรุ่งนี้".
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getNextClass, getNextClassToday, getClassesForDay, bangkokMs } from '../../src/data/schedule.js';

// Instants on Bangkok's clock, so the cases mean the same in every zone (CI runs
// in UTC): the timetable is Bangkok's, and so are its days and hours.
const DAY = 24 * 60 * 60 * 1000;
const at = (ymd, hour, minute = 0) => new Date(bangkokMs(ymd, hour, minute));
const ymdOf = (d) => new Date(d.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

const firstDayWithClasses = (year) => {
  for (let i = 0; i < 7; i++) {
    const d = at(`2026-09-${14 + i}`, 9); // week of 14 Sep 2026, a Monday
    if (getClassesForDay(year, d).length) return d;
  }
  return null;
};

test('during the day it is the next class today, with dayOffset 0', () => {
  const d = firstDayWithClasses(5);
  assert.ok(d, 'year 5 has a timetable this week');
  const early = at(ymdOf(d), 0, 1);
  const next = getNextClass(5, early);
  assert.equal(next.dayOffset, 0);
  assert.equal(next.start, getNextClassToday(5, early).start);
});

test('after the last class it rolls to the first class of a later day', () => {
  const d = firstDayWithClasses(5);
  const late = at(ymdOf(d), 23, 30);
  assert.equal(getNextClassToday(5, late), null);
  const next = getNextClass(5, late);
  assert.ok(next, 'a later day this week has a class');
  assert.ok(next.dayOffset >= 1 && next.dayOffset <= 7);
  const target = new Date(late.getTime() + next.dayOffset * DAY);
  assert.equal(next.start, getClassesForDay(5, target)[0].start);
});

test('a year with no timetable gives null, not a crash', () => {
  assert.equal(getNextClass(1, at('2026-09-15', 20)), null);
});

test("the day, the weekday and the hour are Bangkok's, whatever zone the device is in", () => {
  const d = firstDayWithClasses(5);
  // 00:30 in Bangkok is 17:30 the evening before in UTC: on a phone set to UTC
  // the old reading took the previous evening and offered this morning's first
  // class as tomorrow's.
  const justAfterMidnight = at(ymdOf(d), 0, 30);
  const next = getNextClass(5, justAfterMidnight);
  assert.equal(next.dayOffset, 0, 'the class later this Bangkok morning is today');
  assert.equal(next.start, getClassesForDay(5, at(ymdOf(d), 12))[0].start);
});
