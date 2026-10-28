// The exam's calendar: which round is next, the paper's pace, and the calendar file a phone
// imports (RFC 5545: CRLF lines of at most 75 octets, folded between characters).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUNDS, FORMAT, EXAM_SECONDS, PASS_MARK, SOURCES, allDay, partTime, upcomingRound, upcomingRounds, resultsLag, roundCalendar } from '../../src/data/exam.js';

test('the next round is the first whose last day has not passed', () => {
  assert.equal(upcomingRound('2026-01-01').id, '1/2569');
  assert.equal(upcomingRound('2026-06-07').id, '1/2569', 'still on the second day of 1/2569');
  assert.equal(upcomingRound('2026-06-08').id, '2/2569');
  assert.equal(upcomingRound('2026-10-17').id, '2/2569');
  assert.equal(upcomingRound('2027-01-23').id, '2/2569');
  assert.equal(upcomingRound('2027-01-24').id, '2/2569', 'part 3 sits on the 24th');
  assert.equal(upcomingRound('2027-01-25').id, '1/2570');
  assert.equal(upcomingRound('2027-06-06').id, '1/2570', 'part 3 sits on the 6th');
  assert.equal(upcomingRound('2027-06-07'), null, 'no round announced after 1/2570');
  assert.deepEqual(upcomingRounds('2026-10-28').map((r) => r.id), ['2/2569', '1/2570']);
});

test('a round the centre has not published keeps its half day and no invented hours', () => {
  const r = ROUNDS.find((x) => x.id === '1/2570');
  assert.equal(r.source, 'faculty');
  assert.equal(SOURCES.faculty.url, null, 'a meeting, not a page anyone can open');
  assert.match(SOURCES.faculty.short, /รอประกาศทางการ/);
  assert.equal(r.results, null);
  assert.deepEqual(r.parts.map((p) => [p.part, p.date, p.slot, p.from]), [[2, '2027-06-05', 'บ่าย', undefined], [3, '2027-06-06', 'เช้า', undefined]]);
  assert.equal(partTime(r.parts[0]), 'ช่วงบ่าย รอประกาศเวลา');
  assert.equal(partTime(ROUNDS[0].parts[0]), '13:30–16:30');
});

test('rounds are in date order, each part on its own day with a three-hour sitting', () => {
  for (let i = 1; i < ROUNDS.length; i += 1) assert.ok(ROUNDS[i - 1].parts[0].date < ROUNDS[i].parts[0].date);
  for (const r of ROUNDS.filter((x) => x.source === 'council')) {
    assert.ok(SOURCES[r.source]?.url, `${r.id}: a source with an address`);
    assert.deepEqual(r.parts.map((p) => p.part), [2, 3]);
    assert.ok(r.parts[0].date < r.parts[1].date, `${r.id}: part 2 before part 3`);
    for (const p of r.parts) {
      const [h1, m1] = p.from.split(':').map(Number);
      const [h2, m2] = p.to.split(':').map(Number);
      assert.equal((h2 * 60 + m2) - (h1 * 60 + m1), FORMAT.minutesPerPart, `${r.id} part ${p.part}`);
    }
    assert.ok(r.results > r.parts[1].date, `${r.id}: results after the exam`);
  }
});

test('the paper sets 72 seconds a question and a pass at 83 of 150', () => {
  assert.equal(FORMAT.perPart, 150);
  assert.equal(FORMAT.minutesPerPart, 180);
  assert.equal(EXAM_SECONDS, 72);
  assert.equal(PASS_MARK, 83, '55% of 150 is 82.5');
  assert.deepEqual([FORMAT.recall, FORMAT.applied], [[50, 60], [90, 100]]);
  assert.ok(FORMAT.recall[1] + FORMAT.applied[1] >= FORMAT.perPart && FORMAT.recall[0] + FORMAT.applied[0] <= FORMAT.perPart);
});

test('results arrive 47 and 32 days after the last day', () => {
  assert.deepEqual(resultsLag(), [47, 32]);
});

const round = ROUNDS.find((r) => r.id === '2/2569');
const ics = roundCalendar(round);
const physical = ics.split('\r\n');
const unfolded = ics.replace(/\r\n[ \t]/g, '').split('\r\n');

test('the calendar file uses CRLF line endings only', () => {
  assert.ok(ics.endsWith('\r\n'));
  assert.ok(!/[^\r]\n/.test(ics), 'a bare LF');
  assert.ok(!/\r(?!\n)/.test(ics), 'a bare CR');
  assert.equal(physical.at(-1), '', 'ends after the last CRLF');
});

test('no physical line is longer than 75 octets', () => {
  for (const line of physical) assert.ok(Buffer.byteLength(line, 'utf8') <= 75, `${Buffer.byteLength(line)} octets: ${line}`);
});

test('folding never splits a character', () => {
  for (const line of physical) {
    assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(line), `lone surrogate in ${line}`);
    assert.equal(Buffer.from(line, 'utf8').toString('utf8'), line);
  }
});

test('one event per part, at the right instants in UTC', () => {
  assert.equal(unfolded.filter((l) => l === 'BEGIN:VEVENT').length, 2);
  assert.equal(unfolded.filter((l) => l === 'END:VEVENT').length, 2);
  assert.ok(unfolded.includes('DTSTART:20270123T063000Z'), '13:30 Bangkok on 23 Jan');
  assert.ok(unfolded.includes('DTEND:20270123T093000Z'), '16:30 Bangkok on 23 Jan');
  assert.ok(unfolded.includes('DTSTART:20270124T023000Z'), '09:30 Bangkok on 24 Jan');
  assert.ok(unfolded.includes('DTEND:20270124T053000Z'), '12:30 Bangkok on 24 Jan');
  assert.equal(new Set(unfolded.filter((l) => l.startsWith('UID:'))).size, 2, 'distinct UIDs');
  assert.equal(unfolded[0], 'BEGIN:VCALENDAR');
  assert.equal(unfolded.at(-2), 'END:VCALENDAR');
  assert.ok(unfolded.includes('VERSION:2.0'));
});

test('unfolding restores the Thai summary and the full announcement address', () => {
  const summaries = unfolded.filter((l) => l.startsWith('SUMMARY:'));
  assert.equal(summaries.length, 2);
  assert.match(summaries[0], /VCA/);
  assert.match(summaries[0], /หมวด 2/);
  assert.match(summaries[1], /หมวด 3/);
  for (const s of summaries) assert.match(s, /2\/2569/);
  const descriptions = unfolded.filter((l) => l.startsWith('DESCRIPTION:') && l.includes('http'));
  assert.ok(descriptions.length >= 2);
  for (const d of descriptions) assert.ok(d.includes(SOURCES[round.source].url), `address cut in ${d}`);
});

test('each part reminds the day before', () => {
  assert.equal(unfolded.filter((l) => l === 'TRIGGER:-P1D').length, 2);
});

test('a round with unannounced hours goes into the calendar as two all-day events', () => {
  const cal = roundCalendar(ROUNDS.find((x) => x.id === '1/2570')).replace(/\r\n[ \t]/g, '').split('\r\n');
  assert.ok(cal.includes('DTSTART;VALUE=DATE:20270605'));
  assert.ok(cal.includes('DTEND;VALUE=DATE:20270606'), 'the end of an all-day event is the next day');
  assert.ok(cal.includes('DTSTART;VALUE=DATE:20270606'));
  assert.ok(cal.includes('DTEND;VALUE=DATE:20270607'));
  assert.equal(cal.filter((l) => /^DTSTART:/.test(l)).length, 0, 'no invented hours');
  for (const d of cal.filter((l) => l.startsWith('DESCRIPTION:') && l.includes('http'))) {
    assert.ok(d.includes(SOURCES.council.url), 'the place to check is the centre');
    assert.match(d, /รอประกาศ/);
  }
  assert.deepEqual(allDay('2027-06-30'), ['20270630', '20270701'], 'across a month end');
});
