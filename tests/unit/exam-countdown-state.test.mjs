// ============================================================
// exam-countdown-state.test.mjs — what a Home subject card says about its paper
// ============================================================
// On 23 Sep the One Health, Avian, FIQC and Milk Hygiene cards still read
// "สอบกลางภาค 21/22 ก.ย." in the same green as that day's two equine papers,
// while the countdown on the same page already said four of nine were sat.
// subjectExamState is what the card now asks: done, today or upcoming.
//
// The timetable is Bangkok's, so the answer must not depend on the clock of
// the machine that asks. CI runs in UTC, and a day-boundary test pinned with
// +07:00 has passed on this machine and failed on the runner before, so the
// same instants are replayed in child processes under three other zones.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { subjectExamState, examStartTime } from '../../src/lib/exam-countdown.js';
import { EXAM_SCHEDULE } from '../../src/data/schedule.js';

const MODULE_URL = new URL('../../src/lib/exam-countdown.js', import.meta.url).href;
const SCHEDULE_URL = new URL('../../src/data/schedule.js', import.meta.url).href;

const paper = (subject, term = 'midterm') => {
  const found = EXAM_SCHEDULE.y5.find((e) => e.subject === subject && e.term === term);
  assert.ok(found, `the y5 timetable has a ${term} paper for ${subject}`);
  return found;
};

// The moment the audit measured, and the instants either side of the two
// boundaries that matter: Bangkok midnight, and the end of a running paper.
const CASES = [
  ['2026-09-23T01:36:00+07:00', 'one-health', 'done'],
  ['2026-09-23T01:36:00+07:00', 'avian-medicine', 'done'],
  ['2026-09-23T01:36:00+07:00', 'food-industry', 'done'],
  ['2026-09-23T01:36:00+07:00', 'milk-meat-hygiene', 'done'],
  ['2026-09-23T01:36:00+07:00', 'equine-medicine', 'today'],
  ['2026-09-23T01:36:00+07:00', 'equine-repro', 'today'],
  ['2026-09-23T01:36:00+07:00', 'swine-clinic', 'upcoming'],
  ['2026-09-23T01:36:00+07:00', 'aquatic-clinic', 'upcoming'],
  ['2026-09-23T01:36:00+07:00', 'zoonoses', 'upcoming'],
  // One second before Bangkok midnight the equine paper is still tomorrow's.
  ['2026-09-22T23:59:59+07:00', 'equine-medicine', 'upcoming'],
  ['2026-09-23T00:00:00+07:00', 'equine-medicine', 'today'],
  // A paper being sat is today's; it is done the moment it ends (08:30 + 180 min).
  ['2026-09-23T10:00:00+07:00', 'equine-medicine', 'today'],
  ['2026-09-23T11:29:59+07:00', 'equine-medicine', 'today'],
  ['2026-09-23T11:30:00+07:00', 'equine-medicine', 'done'],
  // The afternoon paper on the same day is still today's after the morning one ends.
  ['2026-09-23T11:30:00+07:00', 'equine-repro', 'today'],
  // Late on the last day nothing of the midterm is left.
  ['2026-09-25T23:00:00+07:00', 'zoonoses', 'done'],
];

test('at 01:36 on 23 Sep: four papers sat, both equine papers today, the rest still ahead', () => {
  for (const [at, subject, want] of CASES) {
    assert.equal(subjectExamState(paper(subject), new Date(at)), want, `${subject} at ${at}`);
  }
});

test('the final papers are all still ahead during the midterm week', () => {
  const at = new Date('2026-09-23T10:00:00+07:00');
  for (const e of EXAM_SCHEDULE.y5.filter((x) => x.term === 'final')) {
    assert.equal(subjectExamState(e, at), 'upcoming', e.subject);
  }
});

test('no paper, no claim', () => {
  assert.equal(subjectExamState(null, new Date()), null);
  assert.equal(subjectExamState({ subject: 'x' }, new Date()), null);
});

test('the start time a today card prints', () => {
  assert.equal(examStartTime(paper('equine-medicine')), '08:30');
  assert.equal(examStartTime(paper('equine-repro')), '13:00');
  assert.equal(examStartTime({ date: '2026-09-23' }), '');
});

// Replays every case in a fresh process under another zone. Setting
// process.env.TZ inside this process is not enough on every platform, so
// each zone gets its own node.
for (const tz of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
  test(`the same answers under TZ=${tz}`, () => {
    const script = `
      const { subjectExamState } = await import(${JSON.stringify(MODULE_URL)});
      const { EXAM_SCHEDULE } = await import(${JSON.stringify(SCHEDULE_URL)});
      const cases = ${JSON.stringify(CASES)};
      const out = cases.map(([at, subject]) => subjectExamState(
        EXAM_SCHEDULE.y5.find((e) => e.subject === subject && e.term === 'midterm'), new Date(at)));
      process.stdout.write(JSON.stringify({ tz: Intl.DateTimeFormat().resolvedOptions().timeZone, out }));
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, TZ: tz },
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    const { tz: seen, out } = JSON.parse(run.stdout);
    assert.equal(seen, tz, 'the child really ran in the zone under test');
    CASES.forEach(([at, subject, want], i) => {
      assert.equal(out[i], want, `${subject} at ${at} under TZ=${tz}`);
    });
  });
}
