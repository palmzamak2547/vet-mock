// Numbers, clocks and dates as a Thai reader expects them, the same in Bangkok and in UTC.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { num, pct, clock, duration, thaiDay, thaiDate, yearRange, plateNo, docTitle, LETTERS } from '../../src/lib/format.js';

test('num groups thousands and marks a missing number', () => {
  assert.equal(num(5783), '5,783');
  assert.equal(num(0), '0');
  assert.equal(num(NaN), '–');
  assert.equal(num(undefined), '–');
  assert.equal(num(Infinity), '–');
});

test('pct', () => {
  assert.equal(pct(0.5), '50%');
  assert.equal(pct(0.104, 1), '10.4%');
  assert.equal(pct(1), '100%');
  assert.equal(pct(null), '–');
});

test('clock counts down in minutes, and hours past an hour', () => {
  assert.equal(clock(0), '00:00');
  assert.equal(clock(-5000), '00:00');
  assert.equal(clock(61_000), '01:01');
  assert.equal(clock(59_001), '01:00', 'a started second still shows');
  assert.equal(clock(3_600_000), '1:00:00');
  assert.equal(clock(10_800_000), '3:00:00', 'one part of the paper');
  assert.equal(clock(3_849_000), '1:04:09');
});

test('duration reads in Thai units', () => {
  assert.equal(duration(40_000), '40 วินาที');
  assert.equal(duration(12 * 60_000), '12 นาที');
  assert.equal(duration(72 * 60_000), '1 ชั่วโมง 12 นาที');
  assert.equal(duration(120 * 60_000), '2 ชั่วโมง');
  assert.equal(duration(200 * 54 * 1000), '3 ชั่วโมง', '200 questions at the exam pace');
});

test('thaiDay writes a calendar day in the Buddhist era, whatever the time zone', () => {
  const day = thaiDay('2027-01-23');
  assert.match(day, /23/);
  assert.match(day, /ม\.ค\./);
  assert.match(day, /2570/);
  assert.equal(day, '23 ม.ค. 2570');
  // ICU builds differ on the short Thai weekday: "ส." in some, the whole "เสาร์" in newer CLDR.
  assert.match(thaiDay('2027-01-23', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }), /^(ส\.|เสาร์) 23/, 'a Saturday');
  assert.match(thaiDay('2027-01-24', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }), /^(อา\.|อาทิตย์) 24/, 'a Sunday');
  assert.equal(thaiDay('2027-01-01'), '1 ม.ค. 2570', 'the first of a month stays on it');
  assert.equal(thaiDay('2026-12-31'), '31 ธ.ค. 2569', 'the last day of a year stays in it');
});

test('thaiDate uses the Buddhist era', () => {
  assert.match(thaiDate(Date.UTC(2026, 9, 17, 5)), /2569/);
});

test('yearRange, plate numbers and option letters', () => {
  assert.equal(yearRange({ from: 2558, to: 2568 }), 'พ.ศ. 2558–2568');
  assert.equal(yearRange({ from: 2567, to: 2567 }), 'พ.ศ. 2567');
  assert.equal(yearRange(null), null);
  assert.equal(plateNo(7), 'Pl. 07');
  assert.equal(plateNo(19), 'Pl. 19');
  assert.deepEqual(LETTERS.slice(0, 5), ['A', 'B', 'C', 'D', 'E']);
});

test('a document file name reads as a title', () => {
  assert.equal(docTitle('physio_VCA 66-58'), 'physio VCA 66-58');
  assert.equal(docTitle('VCA-physio_65-58..'), 'VCA-physio 65-58');
  assert.equal(docTitle('Pathology_revised by RT (VCA58-67)'), 'Pathology revised by RT (VCA58-67)');
  assert.equal(docTitle('Anatomy (VCA58-68)'), 'Anatomy (VCA58-68)', 'a clean title is left alone');
});
