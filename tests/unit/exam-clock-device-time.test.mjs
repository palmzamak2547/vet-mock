// A timed paper cannot be stretched by the device's clock.
//
// The countdown was the deadline minus Date.now(), so setting a phone's time
// back an hour during a mock exam gave an hour more, and the deadline watch
// never fired. The exam's time (lib/exam-clock.js) now advances by whichever
// of the wall clock and the page's monotonic clock moved further: a clock set
// back adds nothing, a sleep (the monotonic clock may stand still) still
// counts, a time zone change touches neither, and the record still stores a
// wall-clock deadline beside savedAt, so stored sessions keep their shape.
import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { examNow, deadlineOnWall, resetExamClock, secondsUntilDeadline } from '../../src/lib/exam-clock.js';
import { resumedDeadline } from '../../src/lib/app-flow.js';

const T0 = Date.UTC(2026, 10, 20, 2, 0, 0);
beforeEach(() => resetExamClock());

test('a clock set back an hour adds nothing to the paper', () => {
  examNow(T0, 0);
  const deadline = T0 + 600_000; // ten minutes
  examNow(T0 + 60_000, 60_000); // a minute of work
  // The student sets the phone back an hour; one more second passes.
  const now = examNow(T0 + 61_000 - 3_600_000, 61_000);
  assert.equal(secondsUntilDeadline(deadline, now), 539, 'nine minutes left, as before the change');
});

test('a clock set back keeps running, and expiry still comes on time', () => {
  examNow(T0, 0);
  const deadline = T0 + 120_000;
  examNow(T0 - 3_600_000, 1_000);
  let now = 0;
  for (let s = 2; s <= 120; s++) now = examNow(T0 - 3_600_000 + (s - 1) * 1000, s * 1000);
  assert.equal(secondsUntilDeadline(deadline, now), 0, 'the paper ends at its own two minutes');
});

// A paper of `dur` driven step by step; returns how early (negative) or late it ends, in seconds.
function endsAt({ wall, mono, step = 1000, dur = 3_600_000, q = 0 }) {
  resetExamClock();
  const Q = (x) => (q ? Math.floor(x / q) * q : x);
  const deadline = examNow(T0 + Q(wall(0)), Q(mono(0))) + dur;
  for (let t = step; t < 3 * dur; t += step) {
    if (secondsUntilDeadline(deadline, examNow(T0 + Q(wall(t)), Q(mono(t)))) <= 0) return (t - dur) / 1000;
  }
  return Infinity;
}
const H = 3_600_000;
const same = (t) => t;

test('a clock set back and then corrected costs an honest student nothing', () => {
  // Back an hour at minute 10, corrected at minute 20 (the reviewer's case: it ended 40 min early).
  const late = endsAt({ wall: (t) => (t >= 600_000 && t < 1_200_000 ? t - H : t), mono: same });
  assert.ok(Math.abs(late) <= 1, `ends ${late} s from an honest paper`);
  // Back five minutes, then corrected.
  assert.ok(Math.abs(endsAt({ wall: (t) => (t >= 600_000 && t < 900_000 ? t - 300_000 : t), mono: same })) <= 1);
  // Network time flapping by 30 s every two minutes.
  assert.ok(Math.abs(endsAt({ wall: (t) => (Math.floor(t / 120_000) % 2 ? t - 30_000 : t), mono: same })) <= 1);
});

test('coarse timers do not make the paper run fast', () => {
  // Both clocks read in 100 ms steps, read every 333 ms, for an hour.
  const late = endsAt({ wall: same, mono: (t) => t + 37, step: 333, q: 100 });
  assert.ok(Math.abs(late) <= 1, `ends ${late} s from an honest paper`);
});

test('the set-back and sleep cases hold under the anchor too', () => {
  assert.equal(endsAt({ wall: (t) => (t >= 600_000 ? t - H : t), mono: same }), 0, 'setting back gains nothing');
  // Ten minutes asleep with the monotonic clock stopped still count.
  const asleep = endsAt({ wall: same, mono: (t) => (t < 600_000 ? t : t < 1_200_000 ? 600_000 : t - 600_000) });
  assert.ok(Math.abs(asleep) <= 1, `ends ${asleep} s from an honest paper`);
});

test('a sleep that stops the monotonic clock still counts', () => {
  examNow(T0, 0);
  const deadline = T0 + 300_000;
  const now = examNow(T0 + 240_000, 1_000); // four minutes asleep, the page clock moved one second
  assert.equal(secondsUntilDeadline(deadline, now), 60);
});

test('a time zone change moves nothing: Date.now() is the same instant', () => {
  const zone = process.env.TZ;
  try {
    examNow(T0, 0);
    process.env.TZ = 'America/Los_Angeles';
    const now = examNow(T0 + 1000, 1000);
    assert.equal(now, T0 + 1000);
  } finally {
    if (zone === undefined) delete process.env.TZ; else process.env.TZ = zone;
  }
});

test('the exam time never runs backwards', () => {
  let prev = examNow(T0, 0);
  const walls = [T0 + 5000, T0 - 99_000, T0 + 2_000_000, T0 + 10, T0 + 2_000_500];
  walls.forEach((w, i) => {
    const n = examNow(w, (i + 1) * 1000);
    assert.ok(n >= prev, `step ${i}`);
    prev = n;
  });
});

test('a saved record keeps a wall deadline, and resumes with exactly what was left', () => {
  examNow(T0, 0);
  examNow(T0 - 3_600_000, 1000); // clock set back: exam time is now an hour ahead of the wall
  const deadline = examNow(T0 - 3_600_000, 1000) + 300_000; // five minutes left in exam time
  const wall = T0 - 3_600_000;
  const saved = { questionDeadline: deadlineOnWall(deadline, wall), savedAt: wall };
  // A fresh page reads the wall clock as its exam time.
  resetExamClock();
  const later = wall + 3 * 3_600_000; // parked three hours
  const resumed = resumedDeadline(saved, examNow(later, 0));
  assert.equal(secondsUntilDeadline(resumed, examNow(later, 0)), 300);
});

test('the session, the clock and the save read the exam time, not Date.now()', () => {
  const hook = readFileSync(new URL('../../src/hooks/useExamSession.js', import.meta.url), 'utf8');
  assert.match(hook, /setQuestionDeadline\(examNow\(\) \+ duration \* 1000\)/);
  assert.match(hook, /questionDeadline - examNow\(\)/);
  assert.match(hook, /resumedDeadline\(saved, examNow\(\)\)/);
  assert.doesNotMatch(hook, /[Dd]eadline\w* - Date\.now\(\)|Date\.now\(\) \+ duration/);
  const clock = readFileSync(new URL('../../src/components/ExamClock.jsx', import.meta.url), 'utf8');
  assert.match(clock, /deadline - examNow\(\)/);
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /questionDeadline: deadlineOnWall\(snap\.questionDeadline\)/);
});
