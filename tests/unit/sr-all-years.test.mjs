// ============================================================
// Spaced repetition's 'ทุกปี' has to load every year before it can show them
// ============================================================
// A cold visit loads only the selected year's banks (plus the cross-year
// ones). The 'ทุกปี' chip in the review planner only removed the year filter,
// so right after opening the app it offered this year's cards and the
// cross-year ones, and nothing said the other years had not loaded: on the
// 2026-09-20 audit, 2,813 cards instead of 4,739 for a year-5 student.
//
// These run SRSessionView's own code against the real question bank: the
// allQuestions memo, the due-pool memo and the load effect, lifted out of the
// view, with a small stand-in for React that recomputes a memo only when its
// dependency list changes and runs an effect only when its list changes. App's
// own loader callback is lifted the same way. Each test gets a fresh, cold
// copy of the question-bank module, so the order the tests run in is free.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { isFlashcardCompatible, reviewQuestionsInContext } from '../../src/hooks/sr-filter.js';
import { initCard, getDueCards, getCardStats } from '../../src/hooks/sm2.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { questionInScope, scopeForPhase } from '../../src/lib/exam-scope.js';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const SR = read('src/views/SRSessionView.jsx');
const APP = read('src/App.jsx');

let fresh = 0;
const coldBank = async () => import(`../../src/data/questions.js?cold=${++fresh}`);

// ── The pieces of the view ───────────────────────────────────────────
const ALL_QUESTIONS = (() => {
  const m = SR.match(/const allQuestions = useMemo\(\n\s*(\(\) => \[[\s\S]*?\n {4}\]),\n[\s\S]*?\n {4}(\[[^\]\n]*\]),\n {2}\);/);
  assert.ok(m, 'SRSessionView no longer memoises allQuestions in the shape this test reads');
  return { factory: m[1], deps: m[2] };
})();
const DUE_POOL = (() => {
  const from = SR.indexOf('const { duePool');
  const m = SR.slice(from).match(/= useMemo\(\(\) => \{([\s\S]*?)\n {2}\}, \[([^\]]*)\]\);/);
  assert.ok(from >= 0 && m, 'SRSessionView no longer builds the due pool in one memo');
  return { body: m[1], deps: `[${m[2]}]` };
})();
const STATS = (() => {
  const from = SR.indexOf('const stats = useMemo');
  const m = SR.slice(from).match(/= useMemo\(\(\) => \{([\s\S]*?)\n {2}\}, \[([^\]]*)\]\);/);
  assert.ok(from >= 0 && m, 'SRSessionView no longer builds stats in one memo');
  return { body: m[1], deps: `[${m[2]}]` };
})();
const EFFECTS = [...SR.matchAll(/useEffect\(\(\) => \{([\s\S]*?)\n {2}\}, \[([^\]]*)\]\);/g)]
  .map((m) => ({ body: m[1], deps: `[${m[2]}]` }))
  // The only effect this is about: the one that fetches the other years.
  .filter((e) => e.body.includes('loadAllYears'));
const CURRENT_Q = (() => {
  const m = SR.match(/const currentQ = ([\s\S]*?);\n/);
  assert.ok(m, 'SRSessionView no longer resolves the current card to a question');
  return m[1];
})();
const APP_LOADER = APP.match(/const loadAllYears = useCallback\(([\s\S]*?), \[\]\);/)?.[1] ?? null;

const same = (a, b) => a.length === b.length && a.every((x, i) => Object.is(x, b[i]));

// SRSessionView over one bank, with App behind it.
async function openSR({ yearScope, network = 'up', selectedPhase = null, subjectFilter = 'all',
  phaseScope = 'current', customQuestions = [], userCards = [], srCards = {} }) {
  const bank = await coldBank();
  await bank.loadQBForYear(5);
  const app = { qbRevision: 1, network };
  const pending = [];
  const appLoader = APP_LOADER && vm.runInContext(`(${APP_LOADER})`, vm.createContext({
    loadQB: () => (app.network === 'up' ? bank.loadQB() : Promise.reject(new Error('offline'))),
    setQbReady() {},
    setQbRevision: (next) => { app.qbRevision = typeof next === 'function' ? next(app.qbRevision) : next; },
  }));
  const state = { yearScope, subjectFilter, selectedPhase, phaseScope, srCards, allYearsLoad: 'idle', allYearsTry: 0 };
  const cells = new Map();
  const memo = (key, deps, compute) => {
    const cell = cells.get(key);
    if (cell && same(cell.deps, deps)) return cell.value;
    const value = compute();
    cells.set(key, { deps, value });
    return value;
  };
  const effectDeps = new Map();
  // Stable across renders, as App's useCallback(..., []) is.
  const loadAllYears = appLoader && (() => { const p = appLoader(); pending.push(p); return p; });

  function render() {
    const scope = vm.createContext({
      QB: bank.QB, isQBFullyLoaded: bank.isQBFullyLoaded,
      isQuestionDeliverable, isFlashcardCompatible, reviewQuestionsInContext, initCard, getDueCards, getCardStats,
      loadUserFlashcards: () => userCards, loadOcclusionCards: () => [],
      customQuestions, qbReady: true, qbRevision: app.qbRevision, selectedYear: 5,
      loadAllYears,
      ...state,
      setAllYearsLoad: (v) => { state.allYearsLoad = typeof v === 'function' ? v(state.allYearsLoad) : v; },
      setAllYearsTry: (v) => { state.allYearsTry = typeof v === 'function' ? v(state.allYearsTry) : v; },
    });
    const at = (code) => vm.runInContext(code, scope);
    scope.allQuestions = memo('allQuestions', at(ALL_QUESTIONS.deps), () => at(`(${ALL_QUESTIONS.factory})()`));
    const pool = memo('duePool', at(DUE_POOL.deps), () => at(`(() => {${DUE_POOL.body}\n})()`));
    const stats = memo('stats', at(STATS.deps), () => at(`(() => {${STATS.body}\n})()`));
    EFFECTS.forEach((effect, i) => {
      const deps = at(effect.deps);
      if (effectDeps.has(i) && same(effectDeps.get(i), deps)) return;
      effectDeps.set(i, deps);
      at(`(() => {${effect.body}\n})()`);
    });
    return { ...pool, stats, allQuestions: scope.allQuestions, lookup: (card) => at(`((currentCard) => ${CURRENT_Q})`)(card) };
  }

  // Let whatever the effects started finish, then render what App renders next.
  async function settle() {
    await Promise.allSettled(pending.splice(0));
    await new Promise((resolve) => setImmediate(resolve));
    return render();
  }
  return { bank, app, state, render, settle, set: (patch) => { Object.assign(state, patch); return render(); } };
}

// Every year's flashcard-eligible cards, counted on a bank of its own that was loaded in full.
const FULL = await (async () => {
  const bank = await coldBank();
  await bank.loadQB();
  return bank.QB.filter(isQuestionDeliverable).filter(isFlashcardCompatible).length;
})();

// ── EX-02 ────────────────────────────────────────────────────────────

test('cold page, ทุกปี tapped: once it has loaded, every year is offered', async () => {
  const sr = await openSR({ yearScope: 'current' });
  const thisYear = sr.render().eligibleCount;
  assert.ok(thisYear > 0);

  sr.set({ yearScope: 'all' });
  assert.equal(sr.state.allYearsLoad, 'loading', 'nothing says the other years are still on their way');
  const after = await sr.settle();
  assert.ok(sr.bank.isQBFullyLoaded(), 'tapping ทุกปี never fetched the other years');
  assert.equal(after.eligibleCount, FULL,
    'ทุกปี offers only what the cold visit happened to load');
  assert.ok(after.eligibleCount > thisYear);
  assert.notEqual(sr.state.allYearsLoad, 'loading');

  // 'ปี 5 เท่านั้น' is exactly what it was: the other years add nothing to it.
  assert.equal(sr.set({ yearScope: 'current' }).eligibleCount, thisYear);
});

test('a ทุกปี remembered from last time loads on the way in', async () => {
  const sr = await openSR({ yearScope: 'all' });
  const cold = sr.render().eligibleCount;
  const after = await sr.settle();
  assert.equal(after.eligibleCount, FULL);
  assert.ok(after.eligibleCount > cold, `still ${cold} cards after opening with ทุกปี`);
});

test('offline, the planner says so, keeps this year usable, and retry loads once it is back', async () => {
  const sr = await openSR({ yearScope: 'all', network: 'down' });
  const cold = sr.render().eligibleCount;
  const failed = await sr.settle();
  assert.equal(sr.state.allYearsLoad, 'failed', 'a failed load is silent');
  assert.equal(failed.eligibleCount, cold, 'the loaded cards must stay in the planner');
  assert.ok(failed.eligibleCount > 0);
  // The failure has words and a way out on the planner itself.
  assert.ok(SR.includes('ยังโหลดทุกปีไม่ครบ'), 'the failure copy is gone');
  assert.ok(/onClick=\{\(\) => setAllYearsTry\(\(n\) => n \+ 1\)\}/.test(SR), 'there is no retry that re-runs the load');

  // Still offline: the retry fails again, cleanly.
  sr.set({ allYearsTry: sr.state.allYearsTry + 1 });
  await sr.settle();
  assert.equal(sr.state.allYearsLoad, 'failed');

  // Back online: the same button finishes the job.
  sr.app.network = 'up';
  sr.set({ allYearsTry: sr.state.allYearsTry + 1 });
  const after = await sr.settle();
  assert.equal(after.eligibleCount, FULL);
  assert.notEqual(sr.state.allYearsLoad, 'failed');
});

test('a load that lands mid-session leaves the dealt cards exactly as dealt', async () => {
  const sr = await openSR({ yearScope: 'all' });
  const before = sr.render();
  // startSession slices the due pool into state once; this is that slice.
  const dealt = before.duePool.slice(0, before.duePool.length);
  const shown = dealt.map((card) => before.lookup(card));
  const after = await sr.settle();
  assert.ok(after.allQuestions.length > before.allQuestions.length, 'the load did not land');
  dealt.forEach((card, i) => {
    assert.equal(after.lookup(card), shown[i], `card ${card.subject}:${card.questionId} now shows a different question`);
  });
  // And nothing re-deals: no effect in the view touches the dealt cards.
  for (const m of SR.matchAll(/useEffect\(\(\) => \{([\s\S]*?)\n {2}\}, \[/g)) {
    assert.ok(!m[1].includes('setSessionCards'), 'an effect re-deals the running session');
  }
});

test('App loads for SR the way it loads for everything else, and says so to every screen', () => {
  assert.ok(APP_LOADER, 'App does not give SR a way to load the other years');
  assert.ok(APP_LOADER.includes('setQbRevision((revision) => revision + 1)'),
    'the load must bump the revision, which is what Home\'s due badge recounts from');
  const tag = APP.slice(APP.indexOf("{view === 'sr-session' && <SRSessionView"));
  const line = tag.slice(0, tag.indexOf('\n'));
  assert.ok(line.includes('qbRevision') && line.includes('loadAllYears'),
    'SR is not told when the bank grows, so a year switched on Home stays missing until SR is reopened');
});

test('SR uses the selected paper for both the queue and its stats, retaining unknown and personal cards', async () => {
  const q = (id, examScope, over = {}) => ({ id, subject: 'sr-test', type: 'tf', q: 'Recall', answer: true,
    year: 5, examScope, ...over });
  const customQuestions = [q(60001, 'midterm'), q(60002, 'final'), q(60003, 'both'),
    q(60004, undefined), q(60005, 'continuous'), q(60006, 'midterm', { type: 'short' })];
  const userCards = ['flashcard', 'cloze', 'image-occlusion'].map((type, i) => q(75001 + i, 'final', { type }));
  const srCards = Object.fromEntries([...customQuestions, ...userCards].map((question) => [question.id, {
    ...initCard(question.id), nextReview: 1, totalReviews: 5, repetitions: 5, interval: 21,
  }]));
  srCards[99999] = { ...initCard(99999), nextReview: 1, totalReviews: 1 };
  const saved = structuredClone(srCards);
  const sr = await openSR({ yearScope: 'current', selectedPhase: '1-mid', subjectFilter: 'sr-test',
    customQuestions, userCards, srCards });
  const ids = (result) => Array.from(result.duePool, (card) => card.questionId).sort((a, b) => a - b);
  const mid = sr.render();
  assert.deepEqual(ids(mid), [60001, 60003, 60004, 75001, 75002, 75003]);
  assert.equal(mid.stats.due, mid.dueReviewedCount, 'same scope for the count and the dealt queue');
  assert.equal(mid.stats.mastered, 6);
  assert.equal(mid.excludedCount, 1, 'incompatible format is counted after paper scoping');

  const final = sr.set({ selectedPhase: '1-final' });
  assert.deepEqual(ids(final), [60002, 60003, 60004, 75001, 75002, 75003]);
  assert.equal(final.stats.due, 6, 'paper dependency must refresh the stats too');
  const all = sr.set({ phaseScope: 'all' });
  assert.deepEqual(ids(all), [60001, 60002, 60003, 60004, 60005, 75001, 75002, 75003]);
  assert.equal(all.stats.due, 8, 'the all-paper escape includes continuous content');
  assert.deepEqual(srCards, saved, 'scope changes never mutate archived or scheduled cards');
  for (const card of mid.duePool) assert.equal(all.lookup(card), mid.lookup(card), 'a dealt card remains resolvable');
});

test('SR delegates topic precedence and unknown scope to the existing exam-scope resolver', () => {
  const subject = SUBJECTS.find((s) => s.topics?.some((t) => t.examScope === 'final'));
  const topic = subject.topics.find((t) => t.examScope === 'final');
  const question = { id: 60011, subject: subject.id, topic: topic.id, examScope: 'midterm', type: 'tf' };
  assert.equal(reviewQuestionsInContext([question], { selectedPhase: '1-mid' }).length, 0,
    'a past-paper question label must not override the current curriculum topic');
  assert.equal(reviewQuestionsInContext([question], { selectedPhase: '1-final' }).length, 1);
  const unknown = { id: 60012, subject: 'no-timetable', type: 'tf' };
  assert.equal(reviewQuestionsInContext([unknown], { selectedPhase: '1-mid' }).length, 1);
  assert.equal(reviewQuestionsInContext([question], { selectedPhase: null }).length, 1);
});

test('SR keeps explicit saved subject and year filters while applying the selected paper', () => {
  const questions = [
    { id: 1, subject: 'previous-year', year: 4, examScope: 'midterm' },
    { id: 2, subject: 'previous-year', year: 4, examScope: 'final' },
    { id: 3, subject: 'current-year', year: 5, examScope: 'midterm' },
    { id: 4, subject: 'personal', type: 'flashcard' },
  ];
  const context = { selectedYear: 5, selectedPhase: '1-mid' };
  assert.deepEqual(reviewQuestionsInContext(questions, context).map((q) => q.id), [3, 4]);
  assert.deepEqual(reviewQuestionsInContext(questions, { ...context, yearScope: 'all' }).map((q) => q.id), [1, 3, 4]);
  assert.deepEqual(reviewQuestionsInContext(questions, { ...context, subjectFilter: 'previous-year' }).map((q) => q.id), [1]);
  assert.deepEqual(reviewQuestionsInContext(questions, { ...context, subjectFilter: 'previous-year', selectedPhase: '1-final' }).map((q) => q.id), [2]);
  assert.deepEqual(reviewQuestionsInContext(questions, { ...context, subjectFilter: 'missing-subject' }), [],
    'a saved subject must never silently expand into an unrelated pool');
});

test('real-bank SR paper selection agrees with the canonical resolver in both phases', async () => {
  const bank = await coldBank();
  await bank.loadQBForYear(5);
  const questions = bank.QB.filter(isQuestionDeliverable);
  for (const selectedPhase of ['1-mid', '1-final']) {
    const scope = scopeForPhase(selectedPhase);
    const expected = questions.filter((q) => (q.year == null || q.year === 5) && questionInScope(q, scope));
    assert.deepEqual(reviewQuestionsInContext(questions, { selectedYear: 5, selectedPhase }), expected);
  }
});
