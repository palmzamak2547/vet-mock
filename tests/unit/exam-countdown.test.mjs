// ============================================================
// exam-countdown.test.mjs
// ============================================================
// The hero countdown is read the night before a paper, so it is pinned to
// the published ภาคต้น 2569 timetable at three moments: the week before,
// mid-week with two days sat, and the morning after the last paper. Every
// instant is written on Bangkok's clock: the countdown reads the timetable
// in Bangkok time, so the test means the same thing whatever zone the
// machine that runs it is set to (exam-tz.test.mjs replays other zones).
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { examWindow, examWindowFor, facultyExamWindow, splitCountdown, STRIP_MAX_DAYS } from '../../src/lib/exam-countdown.js';

// An instant given as Bangkok's wall clock, 'YYYY-MM-DDTHH:mm'.
const bangkok = (local) => new Date(`${local}+07:00`);

test('the faculty window has no year in it and rolls midterm to final to nothing', () => {
  const before = facultyExamWindow(bangkok('2026-09-15T20:00'));
  assert.equal(before.term, 'midterm');
  assert.equal(before.during, false);
  assert.equal(before.targetMs, bangkok('2026-09-21T08:30').getTime());
  const during = facultyExamWindow(bangkok('2026-09-23T10:00'));
  assert.equal(during.during, true);
  assert.equal(during.targetMs, bangkok('2026-09-25T17:00').getTime());
  assert.equal(facultyExamWindow(bangkok('2026-09-26T09:00')).term, 'final');
  assert.equal(facultyExamWindow(bangkok('2026-12-05T09:00')), null);
});

test('the clock splits cleanly and never goes negative', () => {
  assert.deepEqual(splitCountdown(((5 * 24 + 13) * 3600 + 42 * 60 + 7) * 1000), { days: 5, hours: 13, minutes: 42, seconds: 7 });
  assert.deepEqual(splitCountdown(59_999), { days: 0, hours: 0, minutes: 0, seconds: 59 });
  assert.deepEqual(splitCountdown(-5000), { days: 0, hours: 0, minutes: 0, seconds: 0 });
});
import { getUpcomingExams } from '../../src/data/schedule.js';

const y5 = () => getUpcomingExams('y5');

test('a week out: six days to the first of nine midterm papers, strip from today', () => {
  const w = examWindow(y5(), bangkok('2026-09-15T20:00'));
  assert.equal(w.term, 'midterm');
  assert.equal(w.papers.length, 9);
  assert.equal(w.done, 0);
  assert.equal(w.daysToNext, 6);
  assert.equal(w.inWindow, false);
  assert.equal(w.first, '2026-09-21');
  assert.equal(w.last, '2026-09-25');
  assert.equal(w.next.subject, 'one-health');
  assert.equal(w.countdown, null);
  // 15th through 25th inclusive
  assert.equal(w.cells.length, 11);
  assert.equal(w.cells[0].today, true);
  assert.deepEqual(
    w.cells.filter((c) => c.exams.length).map((c) => [c.day, c.exams.length]),
    [[21, 2], [22, 2], [23, 2], [24, 2], [25, 1]],
  );
  assert.equal(w.cells.find((c) => c.day === 20).weekend, true);
});

test('mid-week, mid-paper: four sat, the running paper is next, sat days read as done', () => {
  const w = examWindow(y5(), bangkok('2026-09-23T10:00'));
  assert.equal(w.done, 4);
  assert.equal(w.remaining, 5);
  assert.equal(w.next.subject, 'equine-medicine');
  assert.equal(w.daysToNext, 0);
  assert.equal(w.inWindow, true);
  assert.equal(w.countdown?.kind, 'now');
  // strip starts at the first paper, not today
  assert.equal(w.cells[0].day, 21);
  assert.equal(w.cells.length, 5);
  assert.equal(w.cells[0].done, true);
  assert.equal(w.cells[1].done, true);
  assert.equal(w.cells[2].done, false);
  assert.equal(w.cells[2].today, true);
});

test('the morning after: rolls to the final on its own, and the gap is too long for a strip', () => {
  const w = examWindow(y5(), bangkok('2026-09-26T09:00'));
  assert.equal(w.term, 'final');
  assert.equal(w.first, '2026-11-23');
  assert.ok(w.daysToNext > STRIP_MAX_DAYS);
  assert.deepEqual(w.cells, []);
});

test('nothing ahead: null, so the component renders nothing', () => {
  assert.equal(examWindow(y5(), bangkok('2027-01-10T00:00')), null);
  assert.equal(examWindowFor('y3', bangkok('2026-09-15T00:00')), null);
  assert.equal(examWindow([], bangkok('2026-09-15T00:00')), null);
});

test('every cell sits inside the window and exam days sum to the paper count', () => {
  const w = examWindow(y5(), bangkok('2026-09-18T00:00'));
  const total = w.cells.reduce((n, c) => n + c.exams.length, 0);
  assert.equal(total, w.papers.length);
  for (const c of w.cells) assert.ok(c.date >= '2026-09-18' && c.date <= w.last, c.date);
});
