// Every "today" a student reads starts at the same moment, on any device.
//
// The streak and Home's "วันนี้ N ข้อ" counted Bangkok days; the daily
// question, the XP chip's "วันนี้", quests and the daily goal card counted the
// device's. On a phone set to UTC, from 00:00 to 07:00 Bangkok the streak had
// moved to the new day while the daily question (and its tick) had not. They
// all go through lib/study-day.js now. Checked at instants around both
// midnights under three device zones, and the files may not grow a device
// day of their own again.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dayKey, dayKeyBefore, dayKeyStart } from '../../src/lib/study-day.js';
import { todayKey as dailyQDay } from '../../src/lib/daily-q.js';
import { todayKey as questDay } from '../../src/lib/quests.js';
import { dayKey as recordDay } from '../../src/lib/study-record.js';
import { bangkokDayNumber } from '../../src/hooks/utils.js';

const DAY = 86_400_000;
// 11 Nov 2026 16:59:59 and 17:00:00 UTC (23:59:59 and 00:00 Bangkok), and 23:59 / 00:01 UTC.
const INSTANTS = [Date.UTC(2026, 10, 11, 16, 59, 59), Date.UTC(2026, 10, 11, 17, 0, 0), Date.UTC(2026, 10, 11, 23, 59), Date.UTC(2026, 10, 12, 0, 1), Date.UTC(2026, 10, 12, 5, 0)];

function at(ms, fn) {
  const real = Date.now;
  Date.now = () => ms;
  try { return fn(); } finally { Date.now = real; }
}

test('the daily question, quests, the record and the streak agree on the day, whatever the device zone', () => {
  const zone = process.env.TZ;
  try {
    for (const tz of ['UTC', 'Asia/Bangkok', 'America/Los_Angeles']) {
      process.env.TZ = tz;
      for (const ms of INSTANTS) {
        const key = dayKey(ms);
        const streakDay = new Date(bangkokDayNumber(ms) * DAY).toISOString().slice(0, 10);
        assert.equal(key, streakDay, `${tz} ${new Date(ms).toISOString()}: study day against the streak's day`);
        assert.equal(at(ms, dailyQDay), key, `${tz} ${new Date(ms).toISOString()}: daily question`);
        assert.equal(at(ms, questDay), key, `${tz} ${new Date(ms).toISOString()}: quests`);
        assert.equal(recordDay(ms), key, `${tz}: study record`);
      }
    }
  } finally {
    if (zone === undefined) delete process.env.TZ; else process.env.TZ = zone;
  }
});

test('day arithmetic is calendar arithmetic', () => {
  assert.equal(dayKey(Date.UTC(2026, 10, 11, 17, 0)), '2026-11-12');
  assert.equal(dayKey(Date.UTC(2026, 10, 11, 16, 59)), '2026-11-11');
  assert.equal(dayKeyBefore('2026-03-01'), '2026-02-28');
  assert.equal(dayKeyBefore('2026-11-12', 7), '2026-11-05');
  assert.equal(dayKeyStart('2026-11-12'), Date.UTC(2026, 10, 11, 17, 0));
  assert.equal(dayKey(undefined), '', 'a row with no time has no day');
});

test('no "today" counter keeps a device day of its own', () => {
  for (const file of ['src/lib/daily-q.js', 'src/lib/daily-q-history.js', 'src/lib/xp.js', 'src/lib/quests.js', 'src/components/DailyGoalCard.jsx']) {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    assert.match(src, /from '(\.\.\/lib|\.)\/study-day\.js'/, `${file} reads the day from lib/study-day.js`);
    assert.doesNotMatch(src, /\.getDate\(\)\)?\.padStart|setHours\(0, 0, 0, 0\)/, `${file} computes a device-local day`);
  }
});
