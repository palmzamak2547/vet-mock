import test from 'node:test';
import assert from 'node:assert/strict';
import { correctRun, isComboMilestone, feedbackReaction, COMBO_MIN } from '../../src/lib/mochi-reactions.js';
import { haptic, hapticPattern, canVibrate } from '../../src/lib/haptics.js';
import { STATES } from '../../src/lib/motion-kit/mochi/motion.js';
import { MOCHI_POSE_ASSETS } from '../../src/data/mochi-poses.generated.js';

const mcq = (id, answer = 1) => ({ id, type: 'mcq', answer, options: ['a', 'b', 'c', 'd'] });
const tf = (id, answer = true) => ({ id, type: 'tf', answer });
const fill = (id) => ({ id, type: 'fill', blanks: ['x'] });

test('the run counts correct verdicts in a row, ending at the question on screen', () => {
  const qs = [mcq('a'), mcq('b'), tf('c'), mcq('d')];
  const all = { a: 1, b: 1, c: true, d: 1 };
  assert.equal(correctRun(qs, all, 3), 4);
  assert.equal(correctRun(qs, all, 1), 2);
  // A wrong answer ends it; so does a question left unanswered.
  assert.equal(correctRun(qs, { ...all, b: 0 }, 3), 2);
  assert.equal(correctRun(qs, { a: 1, c: true, d: 1 }, 3), 2);
  // The question on screen itself wrong: no run.
  assert.equal(correctRun(qs, { ...all, d: 2 }, 3), 0);
  // MCQ index 0 is an answer, not a blank.
  assert.equal(correctRun([mcq('z', 0)], { z: 0 }, 0), 1);
});

test('questions graded at the end neither break nor extend a run', () => {
  const qs = [mcq('a'), fill('f'), mcq('b'), { id: 'e', type: 'essay' }, tf('c', false)];
  assert.equal(correctRun(qs, { a: 1, b: 1, c: false }, 4), 3);
  assert.equal(correctRun(qs, { a: 1, f: ['x'], b: 1, e: 'text', c: false }, 4), 3);
});

test('a run never reads outside the set or from missing data', () => {
  assert.equal(correctRun([], {}, 0), 0);
  assert.equal(correctRun(null, null, 5), 0);
  assert.equal(correctRun([mcq('a')], { a: 1 }, 9), 1);
  assert.equal(correctRun([mcq('a')], { a: 1 }, -1), 0);
});

test('milestones are 3, 5, then every 5 from 10', () => {
  const hits = Array.from({ length: 31 }, (_, n) => n).filter(isComboMilestone);
  assert.deepEqual(hits, [3, 5, 10, 15, 20, 25, 30]);
});

test('Mochi keeps the stamp still and lets only the movement grow with the run', () => {
  assert.deepEqual(feedbackReaction({ ok: false, run: 0 }), { pose: 'encourage', play: 'encourage', haptic: 'wrong' });
  assert.deepEqual(feedbackReaction({ ok: true, run: 1 }), { pose: 'correct', play: 'correct', haptic: 'correct' });
  assert.equal(feedbackReaction({ ok: true, run: COMBO_MIN }).play, 'hop');
  assert.equal(feedbackReaction({ ok: true, run: 3 }).haptic, 'milestone');
  assert.equal(feedbackReaction({ ok: true, run: 4 }).haptic, 'correct');
  assert.equal(feedbackReaction({ ok: true, run: 5 }).play, 'highfive');
  assert.equal(feedbackReaction({ ok: true, run: 12 }).play, 'dance');
  // Every reaction names a still that exists as an image and a state the rig
  // can play; an unknown name would show nothing.
  for (const run of [0, 1, 2, 3, 4, 5, 9, 10, 25]) {
    for (const ok of [true, false]) {
      const r = feedbackReaction({ ok, run });
      assert.ok(MOCHI_POSE_ASSETS[r.pose], r.pose);
      assert.ok(STATES[r.play], r.play);
      assert.ok(hapticPattern(r.haptic), r.haptic);
    }
  }
});

function fakeWindow({ vibrate = true, coarse = true, hidden = false, active = true, result = true } = {}) {
  const calls = [];
  return {
    calls,
    navigator: {
      ...(vibrate ? { vibrate: (pattern) => { calls.push(pattern); return result; } } : {}),
      ...(active === null ? {} : { userActivation: { hasBeenActive: active } }),
    },
    matchMedia: (query) => ({ matches: query === '(pointer: coarse)' && coarse }),
    document: { visibilityState: hidden ? 'hidden' : 'visible' },
  };
}

test('a vibration happens only where it can be felt and the student allows it', () => {
  const on = { haptics: true, mode: 'auto' };
  const win = fakeWindow();
  assert.equal(haptic('correct', on, win), true);
  assert.deepEqual(win.calls, [[14]]);
  // Each pulse is long enough to spin a motor up and short enough to read as a tap.
  for (const kind of ['correct', 'wrong', 'milestone']) {
    const pulses = hapticPattern(kind).filter((_, i) => i % 2 === 0);
    assert.ok(pulses.every((ms) => ms >= 10 && ms <= 30), kind);
  }
  assert.equal(haptic('correct', { haptics: false, mode: 'auto' }, fakeWindow()), false);
  assert.equal(haptic('correct', { haptics: true, mode: 'off' }, fakeWindow()), false);
  assert.equal(haptic('nope', on, fakeWindow()), false);
  assert.equal(haptic('correct', on, fakeWindow({ vibrate: false })), false);
  assert.equal(haptic('correct', on, fakeWindow({ coarse: false })), false);
  assert.equal(haptic('correct', on, fakeWindow({ hidden: true })), false);
  // Before any tap Chrome refuses and logs; skip instead.
  const idle = fakeWindow({ active: false });
  assert.equal(haptic('correct', on, idle), false);
  assert.deepEqual(idle.calls, []);
  // Browsers without userActivation still vibrate.
  assert.equal(haptic('wrong', on, fakeWindow({ active: null })), true);
  assert.equal(canVibrate(fakeWindow({ coarse: false })), false);
  assert.equal(canVibrate(undefined), false);
});

test('inside the Android app the app gives the haptic, under the same setting', () => {
  const kinds = [];
  const app = { ...fakeWindow({ vibrate: false, coarse: false, active: false }), VetMockApp: { haptic: (kind) => kinds.push(kind) } };
  assert.equal(canVibrate(app), true);
  assert.equal(haptic('milestone', { haptics: true, mode: 'auto' }, app), true);
  assert.equal(haptic('correct', { haptics: false, mode: 'auto' }, app), false);
  assert.equal(haptic('nope', { haptics: true, mode: 'auto' }, app), false);
  assert.deepEqual(kinds, ['milestone']);
  const broken = { VetMockApp: { haptic: () => { throw new Error('bridge gone'); } } };
  assert.equal(haptic('correct', { haptics: true, mode: 'auto' }, broken), false);
});
