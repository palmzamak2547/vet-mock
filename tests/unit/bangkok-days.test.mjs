// ============================================================
// bangkok-days.test.mjs: every day count a student reads is a Bangkok day
// ============================================================
// The timetable, the registrar and the students are in Bangkok (UTC+7, no
// daylight saving), and CI runs in UTC. A helper that reads the device's
// midnight agrees with Bangkok only on a phone set to Bangkok, so from 17:00
// to midnight UTC (00:00 to 07:00 in Bangkok) it was a day off: a review card
// due this morning read เมื่อวาน, a streak kept on two Bangkok days stayed one
// day, and the registrar chip said วันสุดท้าย hours after the window shut.
//
// Every case is an absolute instant, and the whole set is replayed in child
// processes under several zones, so a helper that slips back to the device's
// clock fails here whatever zone this process runs in.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const UTILS_URL = new URL('../../src/hooks/utils.js', import.meta.url).href;
const SCHEDULE_URL = new URL('../../src/data/schedule.js', import.meta.url).href;

// Self-contained: the zone replays run this source in child processes.
async function readDays(utilsUrl, scheduleUrl) {
  const { fmtDate, updateStreak, streakShown } = await import(utilsUrl);
  const schedule = await import(scheduleUrl);
  const at = (iso) => new Date(iso).getTime();
  // 00:30 on Tuesday 3 Nov in Bangkok; still Monday the 2nd in UTC.
  const NOW = at('2026-11-02T17:30:00Z');
  const milestone = (id, iso) => {
    const m = schedule.describeMilestone(schedule.ACADEMIC_MILESTONES.find((x) => x.id === id), new Date(iso));
    return [m.daysLeftToEnd, m.active, m.past];
  };
  return {
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    due: [
      fmtDate(at('2026-11-02T16:00:00Z'), NOW), // 23:00 on the 2nd in Bangkok
      fmtDate(at('2026-11-03T10:00:00Z'), NOW), // 17:00 on the 3rd
      fmtDate(at('2026-11-04T01:00:00Z'), NOW), // 08:00 on the 4th
      fmtDate(at('2026-10-30T12:00:00Z'), NOW), // 19:00 on 30 Oct
    ],
    streak: [
      // Last set 17:00 on the 2nd, this one 00:30 on the 3rd: the next day.
      updateStreak(at('2026-11-02T10:00:00Z'), 4, null, NOW).streak,
      // Last set 06:30 on the 3rd in Bangkok, the 2nd 23:30 in UTC: the same day.
      updateStreak(at('2026-11-02T23:30:00Z'), 4, null, NOW + 3 * 3600_000).streak,
      // The day it is written starts at Bangkok's midnight.
      new Date(updateStreak(null, 0, null, NOW).lastDate).toISOString(),
    ],
    shown: [
      streakShown({ streak: 6, lastDate: at('2026-11-02T10:00:00Z') }, NOW), // yesterday: alive
      streakShown({ streak: 6, lastDate: at('2026-11-01T10:00:00Z') }, NOW), // the freeze can still save it
      streakShown({ streak: 6, lastDate: at('2026-11-01T10:00:00Z'), freezeUsedAt: at('2026-10-20T00:00:00Z') }, NOW),
      streakShown({ streak: 3, lastDate: at('2026-11-01T10:00:00Z') }, NOW), // too short for the freeze
      streakShown({ streak: 10, lastDate: at('2026-10-10T10:00:00Z') }, NOW), // weeks ago
      streakShown({ streak: 10, lastDate: null }, NOW),
    ],
    registrar: [
      // Round 3 of the second term shuts at 12.00 on 29 Dec (its row prints the
      // opening hour first: "เปิด 12.00 น. ปิด 12.00 น. ของวันที่ 29 ธ.ค.").
      milestone('s2-reg-r3', '2026-12-29T04:00:00Z'), // 11:00, still open
      milestone('s2-reg-r3', '2026-12-29T06:00:00Z'), // 13:00, shut
      // Round 1 runs "เปิด 00.01 น. ปิด 23.59 น." to 8 Nov.
      milestone('s2-reg-r1', '2026-11-08T16:30:00Z'), // 23:30 on the 8th, open
      milestone('s2-reg-r1', '2026-11-08T17:00:00Z'), // 00:00 on the 9th, over
      schedule.getTopMilestone(new Date('2026-12-29T06:00:00Z'))?.id === 's2-reg-r3',
    ],
  };
}

const EXPECTED = {
  due: ['เมื่อวาน', 'วันนี้', 'พรุ่งนี้', '4 วันที่แล้ว'],
  streak: [5, 4, '2026-11-02T17:00:00.000Z'],
  shown: [6, 6, 0, 0, 0, 0],
  registrar: [[0, true, false], [0, false, true], [0, true, false], [-1, false, true], false],
};

function check(seen, where) {
  for (const key of Object.keys(EXPECTED)) assert.deepEqual(seen[key], EXPECTED[key], `${key} ${where}`);
}

test('review due days, the streak and the registrar windows are Bangkok days in this process', async (t) => {
  const seen = await readDays(UTILS_URL, SCHEDULE_URL);
  t.diagnostic(`process zone ${seen.zone}`);
  check(seen, `in this process (${seen.zone})`);
});

for (const tz of ['UTC', 'America/Los_Angeles', 'Asia/Bangkok']) {
  test(`the same days under TZ=${tz}`, () => {
    const script = `
      ${readDays.toString()}
      const seen = await readDays(${JSON.stringify(UTILS_URL)}, ${JSON.stringify(SCHEDULE_URL)});
      console.log(JSON.stringify(seen));
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, TZ: tz },
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    const seen = JSON.parse(run.stdout.trim().split('\n').at(-1));
    assert.equal(seen.zone, tz, 'the child did not take the zone');
    check(seen, `under TZ=${tz}`);
  });
}

// The surfaces that print these, read as source: each must go through the
// Bangkok helper rather than the device's clock or a raw stored number.
test('the screens read the Bangkok helpers', () => {
  const read = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), 'utf8');
  // A run that ended reads 0 everywhere it is printed.
  assert.match(read('components/HeaderBar.jsx'), /const streakNow = streakShown\(streakData\);/);
  assert.match(read('views/ProfileView.jsx'), /streak: streakShown\(streakData\),/);
  assert.match(read('App.jsx'), /streak: streakShown\(streakData\), streakData,/);
  assert.match(read('views/HomeView.jsx'), /if \(streakData\?\.lastDate\) streak = streakShown\(streakData\);/);
  // Home's "today" and its streak walk count Bangkok days.
  assert.match(read('views/HomeView.jsx'), /const ymd = \(d\) => bangkokDayNumber\(d\);/);
  // The recap counts calendar days on Bangkok's clock.
  assert.match(read('views/PhaseWrappedView.jsx'), /return calendarDaysBetween\(now, date\);/);
  // A paper is sat once it has ended, and the date tile prints the row's day.
  const schedule = read('views/ScheduleView.jsx');
  assert.match(schedule, /const isOver = \(e\) => e\.daysLeft < 0 \|\| examEndMs\(e\) <= nowMs;/);
  assert.match(schedule, /const isPast = isOver\(exam\);/);
  assert.match(schedule, /\{new Date\(exam\.date\)\.getUTCDate\(\)\}/);
  assert.doesNotMatch(schedule, /\{new Date\(exam\.date\)\.getDate\(\)\}/);
});

test('the countdown phrases read as Thai', () => {
  const read = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), 'utf8');
  // shortCountdown says อีก… or กำลังสอบอยู่ itself; "สอบใน" in front doubled it.
  const home = read('views/HomeView.jsx');
  assert.doesNotMatch(home, /สอบใน \$\{countdown\.text\}/);
  assert.match(home, /countdown\.kind === 'now' \? `เป้าหมาย: \$\{countdown\.text\}` : `เป้าหมาย: สอบ\$\{countdown\.text\}`/);
  // Under a day the face shows no day count, and neither does its label.
  const countdown = read('components/ExamCountdown.jsx');
  assert.match(countdown, /อีก \$\{hoursOnly \? '' : `\$\{clock\.days\} วัน `\}\$\{clock\.hours\} ชั่วโมง/);
  assert.doesNotMatch(countdown, /อีก \$\{clock\.days\} วัน \$\{clock\.hours\} ชั่วโมง/);
});
