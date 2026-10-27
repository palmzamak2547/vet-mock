import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTime, usualStudyTime, reminderIcs, googleReminderUrl, reminderIcsUrl } from '../../src/lib/study-reminder.js';

// 2026-10-22 10:00 Bangkok = 03:00 UTC.
const NOW = Date.UTC(2026, 9, 22, 3, 0);
const bkk = (day, hh, mm) => Date.UTC(2026, 9, day, hh - 7, mm);
// One session = one answer row (recentSessions splits on subject or a 45 min gap).
const rows = (...times) => times.map((t, i) => ({ date: t, subject: `s${i}`, correct: true, questionId: i }));

test('times parse only as a real 24-hour clock', () => {
  assert.deepEqual(parseTime('20:00'), { hour: 20, minute: 0 });
  assert.deepEqual(parseTime('07:30'), { hour: 7, minute: 30 });
  for (const bad of ['24:00', '7:30', '20:60', '', null, '20:00 ', '20.00']) assert.equal(parseTime(bad), null, String(bad));
});

test('the usual time is the median session start of the last two weeks, to the half hour', () => {
  assert.equal(usualStudyTime(rows(bkk(20, 20, 5), bkk(19, 20, 40), bkk(18, 21, 10)), NOW), '20:30');
  // Fewer than three sessions is not a habit.
  assert.equal(usualStudyTime(rows(bkk(20, 20, 0), bkk(19, 20, 0)), NOW), null);
  // Older than 14 days does not count.
  assert.equal(usualStudyTime(rows(bkk(1, 9, 0), bkk(2, 9, 0), bkk(20, 20, 0), bkk(19, 20, 0)), NOW), null);
});

test('late-night habits stay late at night, across midnight', () => {
  // 23:30, 00:10, 00:45: the habit is just after midnight, not midday.
  assert.equal(usualStudyTime(rows(bkk(19, 23, 30), bkk(20, 0, 10), bkk(21, 0, 45)), NOW), '00:00');
  assert.equal(usualStudyTime(rows(bkk(19, 23, 50), bkk(20, 23, 40), bkk(21, 0, 50)), NOW), '00:00');
});

test('the .ics repeats daily at that Bangkok time, rings at the start, and has one id per time', () => {
  const ics = reminderIcs('20:00', { now: NOW });
  assert.match(ics, /\r\nDTSTART:20261022T130000Z\r\n/);
  assert.match(ics, /\r\nRRULE:FREQ=DAILY\r\n/);
  assert.match(ics, /\r\nUID:study-2000@vetmock\.com\r\n/);
  assert.match(ics, /BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:[^\r]+\r\nTRIGGER:PT0M\r\nEND:VALARM/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  // RFC 5545 3.1: no line over 75 octets.
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, line);
  assert.equal(reminderIcs('25:00'), null);
  // Just after midnight Bangkok is still "today" in Bangkok.
  assert.match(reminderIcs('07:00', { now: Date.UTC(2026, 9, 21, 17, 30) }), /DTSTART:20261022T000000Z/);
});

test('the Google link fills in the same event, and the .ics link only takes a real time', () => {
  const url = new URL(googleReminderUrl('07:30', { now: NOW }));
  assert.equal(url.origin + url.pathname, 'https://calendar.google.com/calendar/render');
  assert.equal(url.searchParams.get('action'), 'TEMPLATE');
  assert.equal(url.searchParams.get('dates'), '20261022T003000Z/20261022T004500Z');
  assert.equal(url.searchParams.get('recur'), 'RRULE:FREQ=DAILY');
  assert.equal(reminderIcsUrl('07:30'), 'https://vetmock.com/api/calendar?study=07%3A30');
  assert.equal(reminderIcsUrl('javascript:alert(1)'), null);
  assert.equal(googleReminderUrl('nope'), null);
});

test('/api/calendar serves the reminder file, refuses a time that does not parse, keeps the exam feed', async () => {
  const { default: handler } = await import('../../api/calendar.js');
  const { CALENDAR_YEARS } = await import('../../src/lib/exam-calendar.js');
  const res = () => ({ headers: {}, statusCode: 0, body: null, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; }, send(b) { this.body = b; return this; }, json(b) { this.body = b; return this; }, end() { return this; } });
  const ok = res();
  handler({ method: 'GET', query: { study: '07:30' } }, ok);
  assert.equal(ok.statusCode, 200);
  assert.match(ok.headers['Content-Type'], /^text\/calendar/);
  assert.match(ok.headers['Content-Disposition'], /vetmock-study-0730\.ics/);
  assert.match(ok.body, /RRULE:FREQ=DAILY/);
  for (const bad of ['7:30pm', '', '24:00']) {
    const r = res();
    handler({ method: 'GET', query: { study: bad } }, r);
    assert.equal(r.statusCode, 400, bad);
  }
  const exam = res();
  handler({ method: 'GET', query: { year: String(CALENDAR_YEARS.at(-1)) } }, exam);
  assert.equal(exam.statusCode, 200);
  assert.match(exam.body, /X-WR-CALNAME/);
});
