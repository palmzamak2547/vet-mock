// ============================================================
// A blank written answer on the last question asks once, not twice (OV-exam-1)
// ============================================================
// On the last question ExamView opens its own submit dialog, which already
// counts the blanks ("ยังไม่ได้ตอบอีก N ข้อ"), and its ส่งข้อสอบ button calls
// nextQ(). nextQ then asked again for a blank short or essay item, in a
// second dialog whose confirm was also labelled ส่งข้อสอบ, so a student who
// had just confirmed was asked the same thing twice. Every path to the last
// question's nextQ goes through that dialog (App's Space/Enter and J raise it
// on the last question, ArrowRight stops one short), so the per-question
// guard is only for moving on.
//
// Driven through the real useExamSession source under a stand-in for React
// whose state persists between renders.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { timeForQuestion, isWritingType } from '../../src/hooks/utils.js';
import { inflightExamKey, isOwnedExam } from '../../src/lib/exam-recovery.js';
import { secondsUntilDeadline } from '../../src/lib/exam-clock.js';
import { resumedDeadline } from '../../src/lib/app-flow.js';
import { createQuestionTiming, newStudySessionId, validSessionId } from '../../src/lib/study-events.js';

const HOOK = readFileSync(new URL('../../src/hooks/useExamSession.js', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/^import [^\n]*\n/gm, '')
  .replace('export function useExamSession', 'function useExamSession');

const mcq = { id: 'last-blank-mcq', type: 'mcq', q: 'Which?', options: ['a', 'b'], answer: 0 };
const short = { id: 'last-blank-short', type: 'short', q: 'Name it', keywords: ['x'] };
const essay = { id: 'last-blank-essay', type: 'essay', q: 'Discuss' };

// One hook instance whose useState and useRef cells survive a re-render.
function session({ confirmAnswer = true } = {}) {
  const asked = [];
  const finished = [];
  const cells = [];
  let cursor = 0;
  const slot = (init) => {
    const i = cursor++;
    if (!(i in cells)) cells[i] = init();
    return i;
  };
  const ctx = vm.createContext({
    useState: (init) => {
      const i = slot(() => (typeof init === 'function' ? init() : init));
      return [cells[i], (v) => { cells[i] = typeof v === 'function' ? v(cells[i]) : v; }];
    },
    useRef: (init) => cells[slot(() => ({ current: init }))],
    useCallback: (fn) => fn,
    useEffect: () => {},
    timeForQuestion, isWritingType,
    confirmDialog: async (opts) => { asked.push(opts); return confirmAnswer; },
    inflightExamKey, isOwnedExam, secondsUntilDeadline, resumedDeadline,
    createQuestionTiming, newStudySessionId, validSessionId,
  });
  const useExamSession = vm.runInContext(`${HOOK}\nuseExamSession`, ctx);
  let props = { view: 'config', useTimer: false, timePerQ: 60, onFinish: () => finished.push(true), ownerId: null, sessionBudget: false };
  const render = (next = {}) => {
    props = { ...props, ...next };
    cursor = 0;
    return useExamSession(props);
  };
  return { render, asked, finished };
}

// A set started from config, rendered as the exam, standing on question `at`.
function onQuestion(questions, at, opts) {
  const s = session(opts);
  s.render().startNewSession(questions, 60);
  s.render({ view: 'exam' }).jumpToQ(at);
  return { ...s, hook: s.render() };
}

for (const item of [short, essay]) {
  test(`the last question, a blank ${item.type}: the submit dialog's ส่งข้อสอบ submits without a second confirm`, async () => {
    const s = onQuestion([mcq, item], 1);
    assert.equal(s.hook.currentQ.id, item.id);
    await s.hook.nextQ();
    assert.equal(s.asked.length, 0, `nextQ asked again after the submit dialog: ${JSON.stringify(s.asked)}`);
    assert.equal(s.finished.length, 1, 'the set was not submitted');
  });
}

test('a blank written answer before the last question still asks before moving on', async () => {
  const s = onQuestion([short, mcq], 0);
  await s.hook.nextQ();
  assert.equal(s.asked.length, 1, 'skipping a blank written answer no longer asks');
  assert.equal(s.asked[0].confirmLabel, 'ข้ามไปข้อถัดไป');
  assert.equal(s.render().currentIdx, 1, 'confirming did not move on');
  assert.equal(s.finished.length, 0);
});

test('cancelling that question keeps the student on the blank answer', async () => {
  const s = onQuestion([essay, mcq], 0, { confirmAnswer: false });
  await s.hook.nextQ();
  assert.equal(s.asked.length, 1);
  assert.equal(s.render().currentIdx, 0, 'cancelling moved on anyway');
});

test('an answered written item moves on without asking', async () => {
  const s = onQuestion([short, mcq], 0);
  s.hook.answerCurrent('x marks the spot');
  await s.render().nextQ();
  assert.equal(s.asked.length, 0);
  assert.equal(s.render().currentIdx, 1);
});
