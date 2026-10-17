// Calendar days in the device's time zone. The suite runs in Bangkok (npm test) and in UTC
// (npm run test:utc); these hold in both.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localDay, dayStart, daysBetween, previousDay, isDay } from '../../src/lib/dates.js';

test('localDay writes the device\'s calendar day as YYYY-MM-DD', () => {
  assert.match(localDay(), /^\d{4}-\d{2}-\d{2}$/);
  const d = new Date(2027, 0, 5, 23, 59);
  assert.equal(localDay(d.getTime()), '2027-01-05');
  assert.equal(localDay(new Date(2026, 9, 17, 0, 0).getTime()), '2026-10-17');
});

test('dayStart is local midnight, and round-trips through localDay', () => {
  const t = dayStart('2026-10-17');
  const d = new Date(t);
  assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()], [2026, 9, 17, 0, 0]);
  for (const day of ['2026-01-01', '2026-02-28', '2028-02-29', '2026-12-31']) assert.equal(localDay(dayStart(day)), day);
});

test('daysBetween counts whole calendar days, signed', () => {
  assert.equal(daysBetween('2026-10-17', '2026-10-17'), 0);
  assert.equal(daysBetween('2026-10-17', '2027-01-23'), 98);
  assert.equal(daysBetween('2027-01-23', '2026-10-17'), -98);
  assert.equal(daysBetween('2027-02-28', '2027-03-01'), 1);
  assert.equal(daysBetween('2028-02-28', '2028-03-01'), 2, 'leap year');
  assert.equal(daysBetween('2026-01-01', '2027-01-01'), 365);
});

test('previousDay crosses months, years and leap days', () => {
  assert.equal(previousDay('2026-10-17'), '2026-10-16');
  assert.equal(previousDay('2026-03-01'), '2026-02-28');
  assert.equal(previousDay('2028-03-01'), '2028-02-29');
  assert.equal(previousDay('2027-01-01'), '2026-12-31');
});

test('isDay accepts YYYY-MM-DD and nothing else', () => {
  assert.equal(isDay('2026-10-17'), true);
  for (const bad of ['2026-1-7', '17/10/2026', '2026-10-17T00:00', '', null, undefined, 20261017, 'abcd-ef-gh']) {
    assert.equal(isDay(bad), false, String(bad));
  }
});
