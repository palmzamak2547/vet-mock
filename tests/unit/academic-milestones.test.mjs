// ============================================================
// academic-milestones.test.mjs — the registrar's windows on Bangkok's calendar
// ============================================================
// Home's chip names one window. The second term's payment window opened on
// 27 Oct and runs to 17 Jan, and the chip used to name any open payment first,
// so for 83 days it hid every registration round closing inside it, the first
// of them on 8 Nov. It now names the open window that closes first.
//
// The windows are the registrar's dates, Bangkok's. Counting them from the
// device's own midnight put a phone in another zone a day off; every answer
// below is replayed in child processes under zones either side of Bangkok,
// the way exam-tz.test.mjs does, because setting process.env.TZ inside a
// running process is not enough on every platform.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { transformSync } from 'esbuild';

import * as schedule from '../../src/data/schedule.js';

const { ACADEMIC_MILESTONES, COURSE_GROUPS, SEMESTER, getTopMilestone, semesterLabelTh } = schedule;
const SCHEDULE_URL = new URL('../../src/data/schedule.js', import.meta.url).href;
const top = (iso, list) => {
  const m = getTopMilestone(new Date(iso), list);
  return m && [m.id, m.active ? m.daysLeftToEnd : -m.daysLeft];
};

test('the chip names the open window that closes first', () => {
  // First week of term-two registration: round 1 closes on 8 Nov, the
  // payment on 17 Jan.
  assert.deepEqual(top('2026-10-28T20:00:00+07:00'), ['s2-reg-r1', 11]);
  assert.deepEqual(top('2026-11-07T09:00:00+07:00'), ['s2-reg-r1', 1]);
  // Round 1 over and the next one a month away: the payment is what closes next.
  assert.deepEqual(top('2026-11-09T09:00:00+07:00'), ['s2-payment', 69]);
  // Late registration and the first roll check both close on 15 Jan: the
  // registration round is named.
  assert.deepEqual(top('2027-01-10T09:00:00+07:00'), ['s2-late-reg', 5]);
  // The payment closes first again on its last two days.
  assert.deepEqual(top('2027-01-16T09:00:00+07:00'), ['s2-payment', 1]);
  // Term one: the deadline is named on its own day.
  assert.deepEqual(top('2026-09-11T09:00:00+07:00'), ['drop-last', 0]);
});

test('two windows closing on one day: a deadline, then a round, then the payment', () => {
  const day = (id, kind, start, end) => ({ id, kind, start, end, titleTh: id, shortTh: id });
  const now = '2026-12-10T09:00:00+07:00';
  const pay = day('pay', 'payment', '2026-12-01', '2026-12-12');
  const round = day('round', 'registration', '2026-12-05', '2026-12-12');
  const drop = day('drop', 'deadline', '2026-12-12', '2026-12-12');
  const check = day('check', 'checkpoint', '2026-12-08', '2026-12-12');
  assert.deepEqual(top(now, [pay, check, round]), ['round', 2]);
  assert.deepEqual(top(now, [check, pay]), ['pay', 2]);
  // Not open yet, so not named over an open one.
  assert.deepEqual(top(now, [pay, drop]), ['pay', 2]);
  assert.deepEqual(top('2026-12-12T09:00:00+07:00', [pay, check, round, drop]), ['drop', 0]);
  // Nothing open: the next to open within ten days, else nothing.
  assert.deepEqual(top(now, [day('soon', 'registration', '2026-12-13', '2026-12-20')]), ['soon', -3]);
  assert.equal(top(now, [day('later', 'registration', '2026-12-25', '2026-12-30')]), null);
});

test('every window has a short name for the chip, and a next-term one says its term', () => {
  for (const m of ACADEMIC_MILESTONES) {
    assert.ok(m.shortTh && m.shortTh.length < m.titleTh.length, `${m.id} short name`);
    assert.doesNotMatch(m.shortTh, /[:·]/, `${m.id} short name reads as words`);
    const term = /^(ภาค\S+?):/.exec(m.titleTh)?.[1];
    if (term) assert.ok(m.shortTh.endsWith(` ${term}`), `${m.id}: "${m.shortTh}" names ${term}`);
  }
  assert.equal(ACADEMIC_MILESTONES.find((m) => m.id === 's2-reg-r1').shortTh, 'แสดงความจำนง รอบ 1 ภาคปลาย');
});

test('a term is named from its id, the current one as SEMESTER names it', () => {
  assert.equal(semesterLabelTh(SEMESTER.id), SEMESTER.labelTh);
  assert.equal(semesterLabelTh('2569-1'), 'ภาคการศึกษาต้น 2569');
  assert.equal(semesterLabelTh('2569-2'), 'ภาคการศึกษาปลาย 2569');
  assert.equal(semesterLabelTh('2570-3'), 'ภาคฤดูร้อน 2570');
  assert.equal(semesterLabelTh('next term'), '');
  assert.equal(semesterLabelTh(undefined), '');
  for (const [key, group] of Object.entries(COURSE_GROUPS)) {
    assert.ok(semesterLabelTh(group.semester), `${key}: the course group says which term its code registers`);
  }
});

// The schedule page's calendar, compiled from its source and rendered with a
// stand-in for React, as schedule-study-launch.test.mjs renders the page.
function renderCalendar(groups) {
  const source = readFileSync(new URL('../../src/components/AcademicCalendar.jsx', import.meta.url), 'utf8');
  const body = source.replace(/^import[\s\S]*?;\r?\n/gm, '').replace('export default function ', 'function ');
  const { code } = transformSync(body, { loader: 'jsx', jsxFactory: 'h', jsxFragment: 'Fragment' });
  const h = (type, props, ...children) => {
    const node = { type, props: props || {}, children: children.flat(Infinity) };
    return typeof type === 'function' ? type({ ...node.props, children: node.children }) : node;
  };
  const deps = { ...schedule, COURSE_GROUPS: groups, h, Fragment: 'Fragment', useState: (init) => [init, () => {}] };
  const Calendar = new Function(...Object.keys(deps), `${code}\nreturn AcademicCalendar;`)(...Object.values(deps));
  const textOf = (node) => (node == null || typeof node === 'boolean' ? ''
    : typeof node !== 'object' ? String(node)
      : Array.isArray(node) ? node.map(textOf).join('') : textOf(node.children));
  return textOf(Calendar({ year: 5 }));
}

test('the course-group box names the term its code registers', () => {
  const text = renderCalendar(COURSE_GROUPS);
  assert.match(text, /ภาคการศึกษาต้น 2569: ลงทะเบียนทั้งชุดด้วยรหัสกลุ่ม 3190501/);
  // From the data, whichever term it is.
  const next = renderCalendar({ y5: { ...COURSE_GROUPS.y5, semester: '2569-2', groupCode: '3190599' } });
  assert.match(next, /ภาคการศึกษาปลาย 2569: ลงทะเบียนทั้งชุดด้วยรหัสกลุ่ม 3190599/);
});

// What the chip, the schedule page's lists and the events read at each
// instant. Self-contained: the zone replays run this source in child processes.
function readCalendar(api, { instants, eventsAt }) {
  return {
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cases: instants.map((at) => {
      const now = new Date(at);
      const t = api.getTopMilestone(now);
      const r1 = api.describeMilestone(api.ACADEMIC_MILESTONES.find((m) => m.id === 's2-reg-r1'), now);
      return {
        top: t && `${t.id} ${t.daysLeft} ${t.daysLeftToEnd}`,
        open: api.getActiveMilestones(14, now).map((m) => `${m.id}${m.active ? '' : ` in ${m.daysLeft}`}`),
        r1: [r1.daysLeft, r1.daysLeftToEnd, r1.active, r1.past],
      };
    }),
    events: api.getUpcomingEvents(5, 60, new Date(eventsAt)).map((e) => `${e.id} ${e.daysLeft}`),
  };
}

const CASES = [
  // 03:00 on 8 Nov in Bangkok, round 1's last day; still the 7th in UTC and
  // in Los Angeles.
  ['2026-11-08T03:00:00+07:00', { top: 's2-reg-r1 -13 0', open: ['s2-reg-r1', 's2-payment'], r1: [-13, 0, true, false] }],
  // 06:00 on 9 Nov in Bangkok: round 1 has closed, while it is the 8th, its
  // last day, in UTC and in Los Angeles.
  ['2026-11-09T06:00:00+07:00', { top: 's2-payment -13 69', open: ['s2-payment'], r1: [-14, -1, false, true] }],
  // 23:30 on 7 Dec in Bangkok, the result window opens tomorrow; already the
  // 8th at Kiritimati.
  ['2026-12-07T23:30:00+07:00', { top: 's2-payment -41 41', open: ['s2-payment', 's2-reg-r1-result in 1', 's2-reg-r2 in 7'], r1: [-42, -29, false, true] }],
];
// 03:00 on 4 Aug in Bangkok, the first stethoscope day; the 3rd in UTC and LA.
const EVENTS_AT = '2026-08-04T03:00:00+07:00';
const EVENTS = ['stetho-3m-2026 0', 'stetho-mdf-2026 1'];
const INPUT = { instants: CASES.map(([at]) => at), eventsAt: EVENTS_AT };

function check(seen, where) {
  CASES.forEach(([at, want], i) => assert.deepEqual(seen.cases[i], want, `${at} ${where}`));
  assert.deepEqual(seen.events, EVENTS, `events at ${EVENTS_AT} ${where}`);
}

test("the windows' days are Bangkok's in this process's zone", (t) => {
  const seen = readCalendar(schedule, INPUT);
  t.diagnostic(`process zone ${seen.zone}`);
  check(seen, `in this process (${seen.zone})`);
});

for (const tz of ['UTC', 'Asia/Bangkok', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
  test(`the same days under TZ=${tz}`, () => {
    const script = `
      const api = await import(${JSON.stringify(SCHEDULE_URL)});
      const readCalendar = ${readCalendar.toString()};
      process.stdout.write(JSON.stringify(readCalendar(api, ${JSON.stringify(INPUT)})));
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
