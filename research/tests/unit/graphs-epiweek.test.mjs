// Epidemic curve bins [M2-DESIGN.md 8.2]: ISO 8601 weeks and empty bins drawn as zero.
// Source: Python 3 datetime.date.fromisoformat(s).isocalendar(), run by the graphs role on 28 Sep 2026
// (day numbers are (date - 1970-01-01).days). The three design pins: 2026-01-01 is 2026 W1 (a Thursday),
// 2026-12-28 is 2026 W53, 2027-01-01 is 2026 W53. OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binDates, dayNumber, isoDate, isoWeek, isoWeekday } from '../../src/workspace/charts/epiweek.js';

// [date, day number, ISO year, ISO week, ISO weekday] from Python isocalendar()
const PY = [
  ['2026-01-01', 20454, 2026, 1, 4],
  ['2026-12-28', 20815, 2026, 53, 1],
  ['2027-01-01', 20819, 2026, 53, 5],
  ['2026-12-31', 20818, 2026, 53, 4],
  ['2027-01-03', 20821, 2026, 53, 7],
  ['2027-01-04', 20822, 2027, 1, 1],
  ['2024-12-30', 20087, 2025, 1, 1],
  ['2021-01-03', 18630, 2020, 53, 7],
  ['2020-12-31', 18627, 2020, 53, 4],
  ['2015-12-31', 16800, 2015, 53, 4],
  ['2016-01-03', 16803, 2015, 53, 7],
  ['1970-01-01', 0, 1970, 1, 4],
  ['2026-09-28', 20724, 2026, 40, 1],
  ['2000-02-29', 11016, 2000, 9, 2],
];

test('ISO 8601 week and weekday equal Python isocalendar()', () => {
  for (const [s, days, y, w, wd] of PY) {
    const [yy, mm, dd] = s.split('-').map(Number);
    assert.equal(dayNumber(yy, mm, dd), days, `${s} day number`);
    assert.equal(isoDate(days), s);
    assert.deepEqual(isoWeek(days), { year: y, week: w }, s);
    assert.equal(isoWeekday(days), wd, `${s} weekday`);
  }
});

test('every ISO week of 2015 to 2030 has 7 days and weeks follow each other without a gap', () => {
  let prev = isoWeek(dayNumber(2015, 1, 1));
  for (let d = dayNumber(2015, 1, 2); d < dayNumber(2031, 1, 1); d += 1) {
    const w = isoWeek(d);
    if (isoWeekday(d) === 1) {
      const next = prev.week + 1;
      const ok = (w.year === prev.year && w.week === next) || (w.year === prev.year + 1 && w.week === 1 && (prev.week === 52 || prev.week === 53));
      assert.ok(ok, `${isoDate(d)}: ${prev.year}W${prev.week} then ${w.year}W${w.week}`);
    } else assert.deepEqual(w, prev, isoDate(d));
    prev = w;
  }
});

test('bins run from the first to the last date with empty bins as zero', () => {
  const d = (s) => { const [y, m, dd] = s.split('-').map(Number); return dayNumber(y, m, dd); };
  const days = [d('2026-01-01'), d('2026-01-01'), d('2026-01-05'), d('2026-01-20'), Number.NaN];
  const byDay = binDates(days, 'day');
  assert.equal(byDay.length, 20);
  assert.equal(byDay[0].count, 2);
  assert.equal(byDay.reduce((a, b) => a + b.count, 0), 4, 'a missing date is not counted');
  assert.equal(byDay.filter((b) => b.count === 0).length, 17);
  const byWeek = binDates(days, 'isoWeek');
  // 2026-01-01 is in W1 (Monday 2025-12-29); 2026-01-05 opens W2; 2026-01-20 is in W4
  assert.deepEqual(byWeek.map((b) => [isoDate(b.start), b.count]), [['2025-12-29', 2], ['2026-01-05', 1], ['2026-01-12', 0], ['2026-01-19', 1]]);
  for (const b of byWeek) assert.equal(isoWeekday(b.start), 1, 'weeks start on Monday');
  const byMonth = binDates([d('2026-11-30'), d('2027-02-01')], 'month');
  assert.deepEqual(byMonth.map((b) => [isoDate(b.start), isoDate(b.end), b.count]), [['2026-11-01', '2026-12-01', 1], ['2026-12-01', '2027-01-01', 0], ['2027-01-01', '2027-02-01', 0], ['2027-02-01', '2027-03-01', 1]]);
  assert.deepEqual(binDates([], 'day'), []);
  assert.throws(() => binDates([1], 'year'));
});
