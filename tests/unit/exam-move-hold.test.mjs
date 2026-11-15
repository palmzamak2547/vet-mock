// ============================================================
// One move at a time, and never stuck (learner hunt, 11 Nov 2026)
// ============================================================
// A double tap on ข้อถัดไป moved a timed paper two questions. useExamSession
// now holds a move until the next question has painted and at least
// MOVE_FLOOR_MS have passed. A move that changes nothing (a stale nextQ after
// the clock moved the set on, App.jsx's keyboard handler holding an older
// closure) is refused by position; a hold no frame released lapses after
// MOVE_HOLD_MAX_MS.
//
// Driven through the real useExamSession source under a stand-in for React
// whose state persists between renders and whose effects never run, so only
// the time limits can release a hold here.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { timeForQuestion, isWritingType } from '../../src/hooks/utils.js';
import { inflightExamKey, isOwnedExam } from '../../src/lib/exam-recovery.js';
import { secondsUntilDeadline, examNow } from '../../src/lib/exam-clock.js';
import { resumedDeadline } from '../../src/lib/app-flow.js';
import { createQuestionTiming, newStudySessionId, validSessionId } from '../../src/lib/study-events.js';

const HOOK = readFileSync(new URL('../../src/hooks/useExamSession.js', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/^import [^\n]*\n/gm, '')
  .replace('export function useExamSession', 'function useExamSession');

const mcq = (id) => ({ id, type: 'mcq', q: `ข้อ ${id}`, options: ['a', 'b'], answer: 0 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function session(onFinish = () => {}) {
  const cells = [];
  let cursor = 0;
  const slot = (init) => { const i = cursor++; if (!(i in cells)) cells[i] = init(); return i; };
  const ctx = vm.createContext({
    useState: (init) => {
      const i = slot(() => (typeof init === 'function' ? init() : init));
      return [cells[i], (v) => { cells[i] = typeof v === 'function' ? v(cells[i]) : v; }];
    },
    useRef: (init) => cells[slot(() => ({ current: init }))],
    useCallback: (fn) => fn,
    useEffect: () => {},
    performance,
    timeForQuestion, isWritingType, confirmDialog: async () => true,
    inflightExamKey, isOwnedExam, secondsUntilDeadline, examNow, resumedDeadline,
    createQuestionTiming, newStudySessionId, validSessionId,
  });
  const useExamSession = vm.runInContext(`${HOOK}\nuseExamSession`, ctx);
  const props = { view: 'exam', useTimer: false, timePerQ: 60, onFinish, ownerId: null, sessionBudget: false };
  const render = () => { cursor = 0; return useExamSession(props); };
  render().startNewSession([mcq(1), mcq(2), mcq(3), mcq(4)], 0);
  return render;
}

test('a second move straight after the first is refused', async () => {
  const render = session();
  await render().nextQ();
  assert.equal(render().currentIdx, 1);
  await render().nextQ();
  render().jumpToQ(3);
  render().prevQ();
  assert.equal(render().currentIdx, 1, 'a second tap, a map jump or a step back moved the set within the hold');
});

test('a handler from the previous question moves nothing, and leaves no hold behind', async () => {
  const render = session();
  const stale = render();
  await stale.nextQ(); // 0 -> 1, the hold is taken
  assert.equal(render().currentIdx, 1);
  await wait(1100); // past MOVE_HOLD_MAX_MS: no frames run here
  // The clock moved the set on meanwhile, and a handler still holding the
  // first render's closure fires. It used to set index 1 again from its own
  // old index, moving the student back; now it is refused by position.
  render().setCurrentIdx(2);
  await stale.nextQ();
  assert.equal(render().currentIdx, 2, 'a handler from question 1 moved the set');
  await render().nextQ();
  assert.equal(render().currentIdx, 3, 'the refused stale call left a hold behind');
});

test('on a slow phone the second tap of a double tap is refused after the old 250 ms lapse', async () => {
  const render = session();
  await render().nextQ(); // tap 1: 0 -> 1, the hold is taken
  assert.equal(render().currentIdx, 1);
  // The next question takes 400 ms to draw and no frame has released the hold
  // yet. Tap 2 waited in the queue and now runs, from the new question's button.
  await wait(400);
  await render().nextQ();
  assert.equal(render().currentIdx, 1, 'tap 2 skipped the question it landed on');
});

test('answering the new question and pressing next at once moves on', async () => {
  const render = session();
  await render().nextQ(); // 0 -> 1, the hold is taken; no frame releases it here
  assert.equal(render().currentIdx, 1);
  render().answerCurrent(0); // an answer on question 2: it was seen
  // Only the press that asks for the next question is freed: a step back straight after still waits.
  render().prevQ();
  assert.equal(render().currentIdx, 1, 'an answer let a step back through the hold');
  await render().nextQ();
  assert.equal(render().currentIdx, 2, 'the press that asks for the next question was swallowed');
  // The hold is taken again by that move: a second press straight after it is still refused.
  await render().nextQ();
  assert.equal(render().currentIdx, 2, 'the double tap after it skipped a question');
});

test("the per-question clock's own move holds the next tap too", () => {
  const at = HOOK.indexOf('setTimedOutIdx(currentIdx);');
  assert.ok(at > 0);
  const branch = HOOK.slice(at, HOOK.indexOf('setCurrentIdx((i) => i + 1);', at));
  assert.match(branch, /holdMove\(\);/, 'the time-out move does not take the hold');
});

test('finishing on the last question goes through within the floor', async () => {
  let finished = 0;
  const render = session(() => { finished += 1; });
  render().jumpToQ(3); // a move: the hold is taken
  assert.equal(render().currentIdx, 3);
  // The submit dialog's confirm calls nextQ straight after the key press.
  await render().nextQ();
  assert.equal(finished, 1, 'the submit confirm was refused by the move hold');
});
