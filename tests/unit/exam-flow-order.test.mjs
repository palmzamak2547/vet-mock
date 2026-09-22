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

// ── EX-05 ────────────────────────────────────────────────────────────

const tfItem = { id: 987654321, subject: 'equine-medicine', topic: 'audit-topic', type: 'tf', q: 'audit', answer: true, year: 5 };
const mcqItem = { id: 987654322, subject: 'equine-medicine', topic: 'audit-topic', type: 'mcq', q: 'audit', options: ['a', 'b'], answer: 0, year: 5 };
const LECTURER = { subjectId: 'equine-medicine', topics: ['audit-topic'], questionCategory: 'tf', numQuestions: 1 };

for (const staleMode of ['exam', 'quick']) {
  test(`a lecturer set runs on a 45-second clock per true/false item (mode was '${staleMode}')`, async () => {
    const app = appAt({ mode: staleMode, QB: [tfItem] });
    app.startLecturerPractice(LECTURER);
    const { firstTime, opts } = await app.started();
    assert.equal(opts.sessionBudget, false, 'the set inherited the exam clock from สอบจริง 50');
    assert.equal(firstTime, 45);
  });

  test(`Panic runs on a clock per question (mode was '${staleMode}')`, async () => {
    const app = appAt({ mode: staleMode, QB: [mcqItem] });
    app.startPanicSession('30');
    const { firstTime, opts } = await app.started();
    assert.equal(opts.sessionBudget, false, 'Panic from the palette inherited the exam clock');
    assert.equal(firstTime, 60);
  });
}

test('the Mock Exam and สอบจริง 50 still run on one clock for the paper', async () => {
  // Both reach startExam from the config screen with mode 'exam' in state and
  // only the count and the per-question time as overrides.
  const app = appAt({ mode: 'exam', subject: 'equine-medicine', QB: [mcqItem, tfItem], numQuestions: 50 });
  app.startExam({ numQuestions: 50, timePerQ: 60 });
  const { opts, picked } = await app.started();
  assert.equal(opts.sessionBudget, true);
  assert.equal(picked.length, 2);
});

// useExamSession under a stand-in for React: one render's worth of hooks.
function hookAt(props) {
  const src = HOOK.replace(/^import [^\n]*\n/gm, '').replace('export function useExamSession', 'function useExamSession');
  const ctx = vm.createContext({
    useState: (init) => {
      const cell = { value: typeof init === 'function' ? init() : init };
      return [cell.value, (v) => { cell.value = typeof v === 'function' ? v(cell.value) : v; }];
    },
    useRef: (current) => ({ current }),
    useCallback: (fn) => fn,
    useEffect: () => {},
    timeForQuestion, isWritingType, confirmDialog: async () => true,
    inflightExamKey, isOwnedExam, secondsUntilDeadline,
    createQuestionTiming, newStudySessionId, validSessionId,
  });
  return vm.runInContext(`${src}\nuseExamSession`, ctx)(props);
}

test('the clock a launcher names is the clock the session runs and saves', async () => {
  // App builds the hook with sessionBudget from `mode`; a stale 'exam' is the
  // case that matters. The in-flight record saves clockKind(), and a resume
  // restores exactly that, so this is also the clock a resumed set keeps.
  const lecturer = appAt({ mode: 'exam', QB: [tfItem] });
  lecturer.startLecturerPractice(LECTURER);
  const started = await lecturer.started();
  const hook = hookAt({ view: 'config', useTimer: true, timePerQ: 60, ownerId: null, sessionBudget: true });
  hook.startNewSession(started.picked, started.firstTime, started.opts);
  assert.equal(hook.clockKind(), 'per-question');

  const exam = hookAt({ view: 'config', useTimer: true, timePerQ: 60, ownerId: null, sessionBudget: true });
  exam.startNewSession([mcqItem, tfItem], 60, { sessionBudget: true });
  assert.equal(exam.clockKind(), 'session', 'an exam is still one budget for the paper');
});

// ── EX-06 ────────────────────────────────────────────────────────────

await loadQB();
const poolOf = (subject) => {
  const ctx = vm.createContext({ ...MODULE_SCOPE });
  const build = vm.runInContext(`(() => {\n${LIFTED}\nreturn buildExamPool;\n})()`, ctx);
  return build({ questions: QB, practiceMode: 'all', subject, topic: null, questionCategory: 'all', selectedYear: 5 });
};

// What the timer line on the config screen reads, from ConfigView's own code.
function configClockLabel({ numQuestions, timePerQ, availablePool }) {
  // From the first examBudget declaration to the blank line after the label.
  const m = CONFIG.match(/\n {2}(const examBudget[\s\S]+?;)\n\n/);
  assert.ok(m && m[1].includes('const examBudgetLabel = '), 'ConfigView no longer declares examBudgetLabel');
  const ctx = vm.createContext({ ...utils, numQuestions, timePerQ, availablePool });
  return vm.runInContext(`${m[1]}\nexamBudgetLabel`, ctx);
}
// Minutes named in a label: '50 นาที' -> [50], '50 ถึง 67 นาที' -> [50, 67].
const minutesIn = (label) => [...label.matchAll(/\d+/g)].map((x) => Number(x[0]));
const clockFor = (qs, base) => qs.reduce((total, q) => total + timeForQuestion(q, base), 0);

test('an MCQ-only subject shows exactly its minutes', () => {
  const pool = poolOf('equine-repro');
  assert.ok(pool.length >= 50 && pool.every((q) => timeForQuestion(q, 60) === 60),
    'equine-repro is no longer an all-base-allowance pool; pick another for this case');
  assert.equal(configClockLabel({ numQuestions: 50, timePerQ: 60, availablePool: pool }), '50 นาที');
});

for (const subject of ['swine-clinic', 'engprof']) {
  test(`${subject}: the config clock is never below what the engine gives any draw`, () => {
    const pool = poolOf(subject);
    const n = Math.min(50, pool.length);
    const byAllowance = [...pool].sort((a, b) => timeForQuestion(a, 60) - timeForQuestion(b, 60));
    const least = clockFor(byAllowance.slice(0, n), 60);
    const most = clockFor(byAllowance.slice(-n), 60);
    assert.ok(most > least, `${subject} no longer mixes allowances; the case is moot`);
    const label = configClockLabel({ numQuestions: 50, timePerQ: 60, availablePool: pool });
    const named = minutesIn(label);
    assert.ok(Math.max(...named) * 60 >= most,
      `Config says "${label}", but a draw of ${n} can get ${Math.ceil(most / 60)} minutes`);
    assert.ok(Math.min(...named) * 60 <= least,
      `Config says "${label}", but a draw of ${n} can get as little as ${Math.floor(least / 60)} minutes`);
  });
}

test('the timer line is unchanged while the pool is still being counted, and for 0 questions', () => {
  assert.equal(configClockLabel({ numQuestions: 50, timePerQ: 60, availablePool: null }), '50 นาที');
  assert.equal(configClockLabel({ numQuestions: 0, timePerQ: 60, availablePool: poolOf('swine-clinic') }), '0 นาที');
  assert.equal(configClockLabel({ numQuestions: 1, timePerQ: 45, availablePool: null }), '45 วินาที');
  assert.ok(CONFIG.includes("{!useTimer ? 'ปิด — โหมดอ่านไม่จับเวลา'"), 'the timer-off wording moved');
});

test('Config is handed the pool it counts, so the clock and the count describe one set', () => {
  // .test, not assert.match: a failed match would print all of App.jsx.
  assert.ok(/<ConfigView [^\n]*availablePool=\{configServedPool\}/.test(APP), 'ConfigView is not given the pool');
  assert.ok(/availableCount=\{configAvailableCount\}/.test(APP), 'ConfigView is not given the count');
  const memo = APP.slice(APP.indexOf('const configServedPool'), APP.indexOf('// startExam accepts'));
  assert.ok(memo.includes('return panicPending ? panicPool(pool) : pool;'),
    'the pool handed over must be the one a Panic set is drawn from');
  assert.ok(memo.includes('const configAvailableCount = configServedPool ? configServedPool.length : null;'));
});
