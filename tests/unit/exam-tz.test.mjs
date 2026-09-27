// ============================================================
// exam-tz.test.mjs — the near-exam card reads the timetable on Bangkok's clock
// ============================================================
// EX-TZ. Every date and time in schedule.js is Bangkok's (UTC+7 all year, no
// daylight saving), but the soonest paper, its countdown, the days-left count
// and the printed date were read on the device's clock. With the browser in
// UTC at 13:00 UTC on 22 Sep (20:00 in Bangkok), Home still offered the 13:00
// to 16:00 Milk Hygiene paper as the next one, four hours after it had ended,
// and a phone west of Greenwich printed every paper a day early.
//
// Each instant below carries its zone, and every answer is Bangkok's. The
// answers must not depend on the zone that reads them: this file checks them
// in its own zone, then replays every case in a fresh node under zones either
// side of Bangkok, because setting process.env.TZ inside a running process is
// not enough on every platform.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import * as schedule from '../../src/data/schedule.js';
import * as countdown from '../../src/lib/exam-countdown.js';

const SCHEDULE_URL = new URL('../../src/data/schedule.js', import.meta.url).href;
const COUNTDOWN_URL = new URL('../../src/lib/exam-countdown.js', import.meta.url).href;

// Everything the near-exam card, the countdown and the schedule print, read
// at the given instants. Self-contained on purpose: the zone replays run this
// same source in child processes.
function readAll(api, { instants, daysAt, labels, ranges }) {
  const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const snapshot = (at) => {
    const now = new Date(at);
    const next = api.getNextExam('y5', now);
    const w = api.examWindowFor('y5', now);
    const f = api.facultyExamWindow(now);
    return {
      next: next ? next.id : null,
      msUntil: next ? api.msUntilExam(next, now) : null,
      countdown: next ? api.shortCountdown(next, now) : null,
      daysLeft: next ? next.daysLeft : null,
      date: next ? api.fmtThaiDate(next.date) : null,
      window: w && {
        term: w.term,
        next: w.next.id,
        done: w.done,
        remaining: w.remaining,
        inWindow: w.inWindow,
        daysToNext: w.daysToNext,
        range: w.range,
        // One entry per day of the strip: its date, the weekday and the day
        // of the month it prints, then xN for the N papers that fall on it.
        cells: w.cells.map((c) => [
          c.date, WEEKDAY[c.dow], c.day,
          c.weekend && 'weekend',
          c.exams.length > 0 && `x${c.exams.length}`,
          c.today && 'today',
          c.done && 'done',
        ].filter((part) => part !== false).join(' ')),
      },
      faculty: f && { term: f.term, during: f.during, target: new Date(f.targetMs).toISOString(), range: f.range },
    };
  };
  return {
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cases: instants.map((at) => snapshot(at)),
    days: api.getUpcomingExams('y5', new Date(daysAt)).map((e) => `${e.id} ${e.daysLeft}`),
    dates: labels.map((label) => api.fmtThaiDate(label)),
    ranges: ranges.map(([from, to]) => api.fmtThaiRange(from, to)),
  };
}

const MIDTERM = '21 - 25 ก.ย. 69';
const FINAL = '23 พ.ย. - 4 ธ.ค. 69';
// The midterm strip, Mon 21 to Fri 25 Sep: `today` is Bangkok's day of the
// month (0 outside the week), and every day up to `satThrough` has had all
// of its papers sat.
const MIDTERM_WEEK = (today, satThrough) => [
  [21, 'Mon', 2], [22, 'Tue', 2], [23, 'Wed', 2], [24, 'Thu', 2], [25, 'Fri', 1],
].map(([day, weekday, papers]) => `2026-09-${day} ${weekday} ${day} x${papers}`
  + `${day === today ? ' today' : ''}${day <= satThrough ? ' done' : ''}`);

const CASES = [
  // The evidence: 20:00 in Bangkok. Milk Hygiene (13:00-16:00) ended at 16:00;
  // the next paper is Equine Medicine at 08:30 tomorrow, 12 h 30 min away.
  ['2026-09-22T13:00:00Z', {
    next: 'y5-equine-med-mid',
    msUntil: 45_000_000,
    countdown: { kind: 'soon', text: 'อีก 12 ชม.' },
    daysLeft: 1,
    date: 'พุธ 23 ก.ย. 2569',
    window: { term: 'midterm', next: 'y5-equine-med-mid', done: 4, remaining: 5, inWindow: true, daysToNext: 1, range: MIDTERM, cells: MIDTERM_WEEK(22, 22) },
    faculty: { term: 'midterm', during: true, target: '2026-09-25T10:00:00.000Z', range: MIDTERM },
  }],
  // One second before Equine Medicine (08:30 + 180 min) ends: still being sat.
  ['2026-09-23T11:29:59+07:00', {
    next: 'y5-equine-med-mid',
    msUntil: -10_799_000,
    countdown: { kind: 'now', text: 'กำลังสอบอยู่' },
    daysLeft: 0,
    date: 'พุธ 23 ก.ย. 2569',
    window: { term: 'midterm', next: 'y5-equine-med-mid', done: 4, remaining: 5, inWindow: true, daysToNext: 0, range: MIDTERM, cells: MIDTERM_WEEK(23, 22) },
    faculty: { term: 'midterm', during: true, target: '2026-09-25T10:00:00.000Z', range: MIDTERM },
  }],
  // The moment it ends, the afternoon paper takes over.
  ['2026-09-23T11:30:00+07:00', {
    next: 'y5-equine-repro-mid',
    msUntil: 5_400_000,
    countdown: { kind: 'imminent', text: 'อีก 1 ชม. 30 นาที' },
    daysLeft: 0,
    date: 'พุธ 23 ก.ย. 2569',
    window: { term: 'midterm', next: 'y5-equine-repro-mid', done: 5, remaining: 4, inWindow: true, daysToNext: 0, range: MIDTERM, cells: MIDTERM_WEEK(23, 22) },
    faculty: { term: 'midterm', during: true, target: '2026-09-25T10:00:00.000Z', range: MIDTERM },
  }],
  // Either side of Bangkok midnight before the first paper. It is still the
  // 20th in UTC and in Los Angeles at both instants.
  ['2026-09-20T23:59:59+07:00', {
    next: 'y5-one-health-mid',
    msUntil: 30_601_000,
    countdown: { kind: 'imminent', text: 'อีก 8 ชม. 30 นาที' },
    daysLeft: 1,
    date: 'จันทร์ 21 ก.ย. 2569',
    window: {
      term: 'midterm', next: 'y5-one-health-mid', done: 0, remaining: 9, inWindow: false, daysToNext: 1, range: MIDTERM,
      cells: ['2026-09-20 Sun 20 weekend today', ...MIDTERM_WEEK(0, 0)],
    },
    faculty: { term: 'midterm', during: false, target: '2026-09-21T01:30:00.000Z', range: MIDTERM },
  }],
  ['2026-09-21T00:00:00+07:00', {
    next: 'y5-one-health-mid',
    msUntil: 30_600_000,
    countdown: { kind: 'imminent', text: 'อีก 8 ชม. 30 นาที' },
    daysLeft: 0,
    date: 'จันทร์ 21 ก.ย. 2569',
    window: { term: 'midterm', next: 'y5-one-health-mid', done: 0, remaining: 9, inWindow: true, daysToNext: 0, range: MIDTERM, cells: MIDTERM_WEEK(21, 0) },
    faculty: { term: 'midterm', during: false, target: '2026-09-21T01:30:00.000Z', range: MIDTERM },
  }],
  // The final fortnight, across a month end, while Los Angeles is on
  // standard time: 03:00 on the 23rd here is noon on the 22nd there.
  ['2026-11-23T03:00:00+07:00', {
    next: 'y5-swine-final',
    msUntil: 36_000_000,
    countdown: { kind: 'imminent', text: 'อีก 10 ชม. 0 นาที' },
    daysLeft: 0,
    date: 'จันทร์ 23 พ.ย. 2569',
    window: {
      term: 'final', next: 'y5-swine-final', done: 0, remaining: 10, inWindow: true, daysToNext: 0, range: FINAL,
      cells: [
        '2026-11-23 Mon 23 x1 today',
        '2026-11-24 Tue 24 x1',
        '2026-11-25 Wed 25 x1',
        '2026-11-26 Thu 26 x1',
        '2026-11-27 Fri 27 x1',
        '2026-11-28 Sat 28 weekend',
        '2026-11-29 Sun 29 weekend',
        '2026-11-30 Mon 30 x1',
        '2026-12-01 Tue 1 x1',
        '2026-12-02 Wed 2 x1',
        '2026-12-03 Thu 3 x1',
        '2026-12-04 Fri 4 x1',
      ],
    },
    faculty: { term: 'final', during: false, target: '2026-11-23T01:30:00.000Z', range: FINAL },
  }],
  // The last paper has just ended: nothing ahead for the card, while the
  // faculty's exam period runs to 17:00.
  ['2026-12-04T11:30:00+07:00', {
    next: null,
    msUntil: null,
    countdown: null,
    daysLeft: null,
    date: null,
    window: null,
    faculty: { term: 'final', during: true, target: '2026-12-04T10:00:00.000Z', range: FINAL },
  }],
];

// 03:00 on 22 Sep in Bangkok is still the 21st in UTC and in Los Angeles.
const DAYS_AT = '2026-09-22T03:00:00+07:00';
const DAYS = [
  'y5-one-health-mid -1',
  'y5-avian-mid -1',
  'y5-food-ind-mid 0',
  'y5-milk-meat-mid 0',
  'y5-equine-med-mid 1',
  'y5-equine-repro-mid 1',
  'y5-swine-mid 2',
  'y5-aqua-mid 2',
  'y5-zoonoses-mid 3',
  'y5-swine-final 62',
  'y5-equine-med-final 63',
  'y5-one-health-final 64',
  'y5-zoonoses-final 65',
  'y5-aqua-final 66',
  'y5-milk-meat-final 69',
  'y5-equine-repro-final 70',
  'y5-avian-final 71',
  'y5-food-ind-final 72',
  'y5-epid-final 73',
];

// A date label is the day it names, whatever the zone; the last two cross a
// year end, where printing the day before also prints the wrong year.
const LABELS = [
  ['2026-09-21', 'จันทร์ 21 ก.ย. 2569'],
  ['2026-11-30', 'จันทร์ 30 พ.ย. 2569'],
  ['2026-12-31', 'พฤหัสบดี 31 ธ.ค. 2569'],
  ['2027-01-01', 'ศุกร์ 1 ม.ค. 2570'],
];
const RANGES = [
  [['2026-08-03', '2026-08-14'], '3 - 14 ส.ค. 69'],
  [['2026-09-11', '2026-09-11'], '11 ก.ย. 69'],
  [['2026-11-23', '2026-12-04'], FINAL],
];

const INPUT = {
  instants: CASES.map(([at]) => at),
  daysAt: DAYS_AT,
  labels: LABELS.map(([label]) => label),
  ranges: RANGES.map(([pair]) => pair),
};

function check(seen, where) {
  CASES.forEach(([at, want], i) => assert.deepEqual(seen.cases[i], want, `${at} ${where}`));
  assert.deepEqual(seen.days, DAYS, `days left at ${DAYS_AT} ${where}`);
  assert.deepEqual(seen.dates, LABELS.map(([, want]) => want), `fmtThaiDate ${where}`);
  assert.deepEqual(seen.ranges, RANGES.map(([, want]) => want), `fmtThaiRange ${where}`);
}

test("the soonest paper, its countdown, the days left and the dates are Bangkok's in this process's zone", (t) => {
  const seen = readAll({ ...schedule, ...countdown }, INPUT);
  t.diagnostic(`process zone ${seen.zone}`);
  check(seen, `in this process (${seen.zone})`);
});

// Replays every case in a fresh process under another zone. The child also
// reports the zone it resolved, so a zone the platform ignored cannot pass
// for one it honoured.
for (const tz of ['UTC', 'Asia/Bangkok', 'America/Los_Angeles', 'Asia/Tokyo', 'Pacific/Kiritimati', 'Pacific/Pago_Pago']) {
  test(`the same answers under TZ=${tz}`, () => {
    const script = `
      const api = { ...(await import(${JSON.stringify(SCHEDULE_URL)})), ...(await import(${JSON.stringify(COUNTDOWN_URL)})) };
      const readAll = ${readAll.toString()};
      process.stdout.write(JSON.stringify(readAll(api, ${JSON.stringify(INPUT)})));
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, TZ: tz },
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    const seen = JSON.parse(run.stdout);
    assert.equal(seen.zone, tz, 'the child really ran in the zone under test');
    check(seen, `under TZ=${tz}`);
  });
}
