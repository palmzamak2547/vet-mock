// ============================================================
// Starting a set, and what the Config and Results screens say about it
// ============================================================
// These run App's own startExam, its launchers and buildExamPool, lifted out
// of src/App.jsx and evaluated against a stand-in for React state, plus the
// plain expressions ConfigView and ResultsView render. Each case names what a
// student saw before the fix.
//
//   EX-03  'ข้อที่ยังอ่อน' served the first N weak questions in bank order,
//          not the N most missed, and 'ทบทวนข้อที่ตอบผิด' was re-sorted by id
//          after it had been put in most-missed order.
//   EX-05  A lecturer set or Panic started after opening 'สอบจริง 50' and
//          backing out inherited the exam's one clock for the whole set.
//   EX-06  Config said 'สอบจริง 50' on Swine Clinic runs 50 minutes; the clock
//          gives written and matching items more, so it ran up to 67.
//   EX-07  The time shown and shared on Results grew every time the student
//          came back to Results from the answer review.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

import { QB, loadQB } from '../../src/data/questions.js';
import * as curriculum from '../../src/data/curriculum.js';
import { stillWrong } from '../../src/lib/wrong-pool.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import * as utils from '../../src/hooks/utils.js';
import { scopeForPhase, questionInScope } from '../../src/lib/exam-scope.js';
import { isCurrentScopeQuestion, isHighPredictionQuestion } from '../../src/lib/question-prediction.js';
import { isPastPaperQuestion, panicPool } from '../../src/lib/question-metadata.js';
import { SEMESTER } from '../../src/data/semester.js';
import { createQuestionTiming, newStudySessionId, validSessionId } from '../../src/lib/study-events.js';
import { inflightExamKey, isOwnedExam } from '../../src/lib/exam-recovery.js';
import { secondsUntilDeadline } from '../../src/lib/exam-clock.js';

const { timeForQuestion, questionCategory: catOf, isWritingType } = utils;
const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = read('src/App.jsx');
const HOOK = read('src/hooks/useExamSession.js');
const CONFIG = read('src/views/ConfigView.jsx');
const RESULTS = read('src/views/ResultsView.jsx');

// ── Lifting code out of a source file ────────────────────────────────
// Index just past the bracket that closes the one at `open`. Comments and
// string literals are skipped, template literals are followed into ${}.
function closeOf(src, open) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [];
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    const n = src[i + 1];
    if (c === '/' && n === '/') { i = src.indexOf('\n', i); continue; }
    if (c === '/' && n === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
    if (c === "'" || c === '"') {
      for (i++; src[i] !== c; i++) if (src[i] === '\\') i++;
      continue;
    }
    if (c === '`') {
      for (i++; src[i] !== '`'; i++) {
        if (src[i] === '\\') i++;
        else if (src[i] === '$' && src[i + 1] === '{') i = closeOf(src, i + 1) - 1;
      }
      continue;
    }
    if (pairs[c]) stack.push(pairs[c]);
    else if (c === ')' || c === ']' || c === '}') {
      assert.equal(stack.pop(), c, `unbalanced source near ${JSON.stringify(src.slice(i - 40, i + 10))}`);
      if (!stack.length) return i + 1;
    }
  }
  throw new Error('no closing bracket');
}
// `function name(...) {...}` or `const name = (...) => {...};`. `header` ends
// at the opening parenthesis of the parameter list.
function lift(src, header) {
  const start = src.indexOf(header);
  assert.ok(start >= 0, `source no longer contains: ${header}`);
  const paramsEnd = closeOf(src, start + header.length - 1);
  const body = src.indexOf('{', paramsEnd);
  return `${src.slice(start, closeOf(src, body))};`;
}
function liftConst(name) {
  const m = APP.match(new RegExp(`\\n(?:export )?const ${name} = [^\\n]+;\\n`));
  assert.ok(m, `App.jsx no longer declares ${name}`);
  return m[0].replace('export ', '');
}

const LIFTED = [
  liftConst('PHASE_SEMESTER'),
  liftConst('USER_CURATED_MODES'),
  liftConst('PANIC_SIZE'),
  liftConst('PANIC_SUBJECT_MAX'),
  lift(APP, 'function normalizePracticeMode('),
  lift(APP, 'function categoryPickerShown('),
  lift(APP, 'function appliedCategory('),
  lift(APP, 'function buildExamPool('),
  lift(APP, 'const startExam = async ('),
  lift(APP, 'const startPanicSession = ('),
  lift(APP, 'const startLecturerPractice = ('),
].join('\n');

const MODULE_SCOPE = {
  SUBJECTS: curriculum.SUBJECTS,
  hiddenTopicIdsFor: curriculum.hiddenTopicIdsFor,
  yearForSubject: curriculum.yearForSubject,
  semesterForSubject: curriculum.semesterForSubject,
  stillWrong, isQuestionDeliverable, catOf, scopeForPhase, questionInScope,
  isCurrentScopeQuestion, isHighPredictionQuestion, isPastPaperQuestion, SEMESTER,
  panicPool, timeForQuestion,
};

// App at one render: `state` is what React state holds when the handler runs,
// which is the whole point of EX-05 (a setter called in the same handler does
// not change what this closure reads).
function appAt(state = {}) {
  const calls = [];
  const record = (name) => (value) => calls.push({ [name]: value });
  const ctx = vm.createContext({
    ...MODULE_SCOPE,
    // Deterministic, and visibly not the order it was given.
    shuffle: (qs) => [...qs].reverse(),
    isQBFullyLoaded: () => true,
    isQBYearLoaded: () => true,
    loadQB: async () => {},
    loadQBForYear: async () => {},
    confirmDialog: async () => false,
    alertDialog: record('alert'),
    offerBankRetry: async () => false,
    mode: 'quick', subject: 'all', topic: null, practiceMode: 'all', questionCategory: 'all',
    numQuestions: 10, useTimer: true, timePerQ: 60, panicPending: false,
    selectedYear: 5, selectedPhase: null,
    customQuestions: [], bookmarks: [], analytics: null, history: [], QB: [],
    finishingRef: { current: false },
    setPendingResume() {}, setQbReady() {}, setQbRevision() {},
    setSubject() {}, setTopic() {}, setPracticeMode() {}, setUseTimer() {}, setTimePerQ() {},
    setMode: record('setMode'),
    setView: record('setView'),
    session: {
      startNewSession: (picked, firstTime, opts) => calls.push({ start: { picked, firstTime, opts } }),
    },
    ...state,
  });
  const api = vm.runInContext(
    `(() => {\n${LIFTED}\nreturn { startExam, startPanicSession, startLecturerPractice };\n})()`,
    ctx,
  );
  return {
    ...api,
    calls,
    async started() {
      await new Promise((resolve) => setImmediate(resolve));
      const hit = calls.find((c) => c.start);
      assert.ok(hit, `no session was started: ${JSON.stringify(calls)}`);
      return hit.start;
    },
  };
}

// Two real-shaped past-paper questions from different banks. The lower id is
// first in bank order; the higher id is the one the student keeps missing.
const lower = { id: 8001, subject: 'vca', topic: 'audit-a', type: 'mcq', q: 'a', options: ['x', 'y'], answer: 0, year: 5, examOrigin: 'mid-85' };
const higher = { id: 207575, subject: 'equine-medicine', topic: 'audit-b', type: 'mcq', q: 'b', options: ['x', 'y'], answer: 0, year: 5, examOrigin: 'mid-85' };
// Arrays built inside the lifted code belong to another realm; compare copies.
const ids = (qs) => Array.from(qs, (q) => q.id);
const missed = (q, i) => ({ subject: q.subject, questionId: q.id, correct: false, date: 1_000_000 + i });

// ── EX-03 ────────────────────────────────────────────────────────────

test('a one-question weak set is the most-missed question, not the first in the bank', async () => {
  const app = appAt({ QB: [lower, higher], analytics: { weakQuestions: [higher.id, lower.id] } });
  app.startExam({ practiceMode: 'weak', subject: 'all', topic: null, questionCategory: 'all', numQuestions: 1, useTimer: false });
  const { picked } = await app.started();
  assert.deepEqual(ids(picked), [higher.id],
    'the weak set is sliced in bank order, so a capped set is whichever weak questions load first');
});

test('the weak pool keeps the most-missed order the dashboard ranked', () => {
  const ctx = vm.createContext({ ...MODULE_SCOPE });
  const build = vm.runInContext(`(() => {\n${LIFTED}\nreturn buildExamPool;\n})()`, ctx);
  const pool = build({ questions: [lower, higher], practiceMode: 'weak', questionCategory: 'all',
    selectedYear: 5, weakQuestions: [higher.id, lower.id] });
  assert.deepEqual(pool.map((q) => q.id), [higher.id, lower.id]);
});

test('the wrong-answer review runs most-missed first, as the screen says', async () => {
  // higher missed three times, lower once.
  const history = [missed(lower, 0), missed(higher, 1), missed(higher, 2), missed(higher, 3)];
  const app = appAt({ QB: [lower, higher], history });
  app.startExam({ practiceMode: 'wrong', subject: 'all', topic: null, questionCategory: 'all', numQuestions: 2, useTimer: false });
  const { picked } = await app.started();
  assert.deepEqual(ids(picked), [higher.id, lower.id],
    'both carry examOrigin, and the passage re-sort put them back in id order');
});

test('ordinary practice still shuffles, then keeps passage questions in id order', async () => {
  const passage = [3, 1, 2].map((id) => ({ ...lower, id, subject: 'equine-medicine', topic: 'audit-p' }));
  const app = appAt({ QB: passage });
  app.startExam({ practiceMode: 'all', subject: 'equine-medicine', topic: null, questionCategory: 'all', numQuestions: 3 });
  assert.deepEqual(ids((await app.started()).picked), [1, 2, 3]);

  const loose = [3, 1, 2].map((id) => ({ ...lower, id, subject: 'equine-medicine', topic: 'audit-p', examOrigin: undefined }));
  const plain = appAt({ QB: loose });
  plain.startExam({ practiceMode: 'all', subject: 'equine-medicine', topic: null, questionCategory: 'all', numQuestions: 3 });
  assert.deepEqual(ids((await plain.started()).picked), [2, 1, 3], 'the shuffle is no longer applied');
});
