// The exam feed students subscribe to: valid iCalendar, Bangkok times as UTC
// instants, folded lines that never split a Thai character.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { examCalendar, CALENDAR_YEARS } from '../../src/lib/exam-calendar.js';
import { EXAM_SCHEDULE } from '../../src/data/schedule.js';

test('each year with a timetable gets a feed with one event per dated paper', () => {
  assert.ok(CALENDAR_YEARS.length > 0);
  for (const year of CALENDAR_YEARS) {
    const ics = examCalendar(year, { now: 0 });
    const dated = EXAM_SCHEDULE[`y${year}`].filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date || ''));
    assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, dated.length, `year ${year}`);
    assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
    const utf8 = new TextEncoder();
    for (const line of ics.split('\r\n')) assert.ok(utf8.encode(line).length <= 75, line);
    assert.ok(!/\uFFFD/.test(ics.split('\r\n ').join('')), 'unfolding restores every character');
  }
  assert.equal(examCalendar(1), null);
});

test('a 08:30 paper in Bangkok starts at 01:30 UTC and runs its duration', () => {
  const year = CALENDAR_YEARS.at(-1);
  const exam = EXAM_SCHEDULE[`y${year}`].find((e) => /^08:30/.test(e.time || '') && e.duration_min);
  const ics = examCalendar(year, { now: 0 }).split('\r\n ').join('');
  const block = ics.slice(ics.indexOf(`UID:${exam.id}@`));
  const day = exam.date.replace(/-/g, '');
  assert.match(block, new RegExp(`DTSTART:${day}T013000Z`));
  const end = new Date(Date.UTC(+exam.date.slice(0, 4), +exam.date.slice(5, 7) - 1, +exam.date.slice(8), 1, 30) + exam.duration_min * 60000);
  assert.match(block, new RegExp(`DTEND:${end.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`));
});
