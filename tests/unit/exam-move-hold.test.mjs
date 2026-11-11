// ============================================================
// One move at a time, and never stuck (learner hunt, 11 Nov 2026)
// ============================================================
// A double tap on ข้อถัดไป moved a timed paper two questions. useExamSession
// now holds a move until the next question has painted and at least
// MOVE_FLOOR_MS have passed. A move that changes nothing (a stale nextQ after
// the clock moved the set on, App.jsx's keyboard handler holding an older
// closure) has no paint to release it, so a hold also lapses: the next tap
// must move within 300 ms.
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

function session() {
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
  const props = { view: 'exam', useTimer: false, timePerQ: 60, onFinish: () => {}, ownerId: null, sessionBudget: false };
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

test('a move from a stale handler that changed nothing does not leave the student stuck', async () => {
  const render = session();
  const stale = render();
  await stale.nextQ(); // 0 -> 1, the hold is taken
  assert.equal(render().currentIdx, 1);
  await wait(300);
  // The clock moved the set on meanwhile, and a handler still holding the
  // first render's closure fires (it sets index 1 from its own old index, as a
  // stale nextQ always has; not changed here). The hold must not outlive it.
  render().setCurrentIdx(2);
  await stale.nextQ();
  const at = render().currentIdx;
  await wait(300);
  await render().nextQ();
  assert.equal(render().currentIdx, at + 1, 'the next tap did not move within 300 ms of the stale move');
});
