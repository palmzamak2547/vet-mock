import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import vm from 'node:vm';
import { buildExamPool, normalizePracticeMode, WEAK_POOL_CAP } from '../../src/lib/exam-pool.js';
import { stillWrong } from '../../src/lib/wrong-pool.js';
import { SUBJECTS, yearForSubject } from '../../src/data/curriculum.js';
import { initCard, updateCard } from '../../src/hooks/sm2.js';
import { computeSubjectProgress } from '../../src/lib/subject-progress.js';
import { normalizeUserHistory } from '../../src/lib/user-data-row.js';

// Exercise the actual memo and handlers without loading the whole browser app.
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const app = read('src/App.jsx');
const analyticsBody = app.split('const analytics = useMemo(() => {')[1].split('}, [history, allQuestions]);')[0];
const analytics = (history, questions) => new Function('history', 'allQuestions', 'SUBJECTS', 'stillWrong', 'WEAK_POOL_CAP', 'WEAK_TAG_MAX_PCT', analyticsBody)(
  history, questions, SUBJECTS, stillWrong, WEAK_POOL_CAP, 70,
);
const question = (subject, year, id = 990_001) => ({ id, subject, year, topic: 'fixture', type: 'mcq', q: 'Recall', options: ['A', 'B'], answer: 0 });
const attempt = (q, correct, date) => ({ questionId: q.id, subject: q.subject, year: q.year, correct, date });
const keys = pool => pool.map(q => `${q.subject}:${q.id}`);

test('an unloaded subject cannot borrow another subject with the same question ID', () => {
  const missing = question('com4', 4);
  const loaded = question('com5', 5);
  const result = analytics([attempt(missing, false, 1)], [loaded]);
  assert.equal(result.totalScored, 0);
  assert.equal(result.bySubject.com5.total, 0);
  assert.deepEqual(result.weakQuestions, []);
  // Subject-less historical rows still use the legacy ID lookup.
  assert.equal(analytics([{ questionId: loaded.id, correct: true, date: 1 }], [loaded]).totalScored, 1);
});

test('weak practice keeps compound identity and original numeric/string IDs', () => {
  const learnt = question('com4', 4);
  const weak = question('exotic', 4);
  const personal = question('com4', 4, 'external-id');
  const history = [attempt(learnt, false, 1), attempt(learnt, true, 4), attempt(weak, false, 2), attempt(personal, false, 3)];
  const result = analytics(history, [learnt, weak, personal]);
  assert.deepEqual(result.weakQuestions, [weak.id, personal.id]);
  assert.deepEqual(result.weakQuestionKeys, [`exotic:${weak.id}`, 'com4:external-id']);
  const pool = buildExamPool({ questions: [learnt, weak, personal], practiceMode: 'weak', selectedYear: 4,
    weakQuestions: result.weakQuestions, weakQuestionKeys: result.weakQuestionKeys });
  assert.deepEqual(keys(pool), [`exotic:${weak.id}`, 'com4:external-id']);
});

test('cold weak launch reads history after banks load instead of the old analytics snapshot', () => {
  const weak = question('com4', 4);
  const history = [attempt(weak, false, 1)];
  const oldAnalytics = analytics(history, []);
  const pool = buildExamPool({ questions: [weak], practiceMode: 'weak', selectedYear: 4, history,
    weakQuestions: oldAnalytics.weakQuestions, weakQuestionKeys: oldAnalytics.weakQuestionKeys });
  assert.deepEqual(keys(pool), [`com4:${weak.id}`]);
});
test('legacy subject-less history retains the same first-ID fallback in the weak launch', () => {
  const weak = question('com4', 4);
  const history = [{ questionId: weak.id, correct: false, date: 1 }];
  const result = analytics(history, [weak]);
  const pool = buildExamPool({ questions: [weak], practiceMode: 'weak', selectedYear: 4, history,
    weakQuestions: result.weakQuestions, weakQuestionKeys: result.weakQuestionKeys });
  assert.deepEqual(keys(pool), [`com4:${weak.id}`]);
});

test('weak ranking remains most-missed first and excludes relearnt namesakes', () => {
  const once = question('com4', 4, 990_002);
  const twice = question('exotic', 4);
  const learnt = question('com4', 4);
  const history = [attempt(once, false, 1), attempt(twice, false, 2), attempt(twice, false, 3),
    attempt(learnt, false, 4), attempt(learnt, true, 5)];
  const pool = buildExamPool({ questions: [once, learnt, twice], practiceMode: 'weak', selectedYear: 4, history });
  assert.deepEqual(keys(pool), [`exotic:${twice.id}`, `com4:${once.id}`]);
});
test('wrong and weak practice order retained legacy ISO timestamps rather than synced array order', () => {
  const q = question('com4', 4);
  const earlier = Date.parse('2026-10-05T01:00:00Z');
  const later = earlier + 3600000;
  for (const history of [
    [attempt(q, true, new Date(later).toISOString()), attempt(q, false, new Date(earlier).toISOString())],
    [attempt(q, true, new Date(later).toISOString()), attempt(q, false, earlier)],
  ]) {
    const retained = normalizeUserHistory(history);
    assert.equal(retained[0].date, history[0].date, 'legacy normalization retains existing ISO dates');
    assert.equal(stillWrong(retained).keys.size, 0, 'a newer correct answer clears the old wrong attempt');
    for (const practiceMode of ['wrong', 'weak']) {
      assert.deepEqual(buildExamPool({ questions: [q], practiceMode, selectedYear: 4, history: retained }), []);
    }
  }
});
test('subject coverage includes a valid imported question ID of zero', () => {
  const imported = question('com4', 4, 0);
  const result = computeSubjectProgress({ history: [attempt(imported, true, 1)], customQuestions: [imported] });
  assert.deepEqual(result.com4, { covered: 1, total: 1, pct: 100 });
});

const viewCode = file => {
  const source = read(file);
  const body = parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body
    .find(node => node.type === 'ExportDefaultDeclaration').declaration.body.body;
  const declarations = [];
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'VariableDeclarator') declarations.push(node);
    Object.values(node).forEach(value => Array.isArray(value) ? value.forEach(visit) : visit(value));
  };
  body.forEach(visit);
  return {
    has: name => declarations.some(node => node.id.name === name),
    initializer: name => {
      const node = declarations.find(node => node.id.name === name)?.init;
      assert.ok(node, `${file} still has ${name}`);
      return source.slice(node.start, node.end);
    },
  };
};
const dashboard = viewCode('src/views/DashboardView.jsx');
for (const mode of ['weak', 'bookmarks']) test(`Dashboard ${mode} launcher clears a previous named subject before configuration`, async () => {
  const source = read('src/views/DashboardView.jsx');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  let onClick;
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXAttribute' && node.name.name === 'onClick') {
      const callback = node.value.expression;
      if (source.slice(callback.start, callback.end).includes(`setPracticeMode('${mode}')`)) onClick = callback;
    }
    Object.values(node).forEach(value => Array.isArray(value) ? value.forEach(visit) : visit(value));
  };
  visit(ast);
  assert.ok(onClick);
  const state = { subject: 'com4', topic: 'old-topic', practiceMode: 'all' };
  const scope = vm.createContext({
    setSubject: value => { state.subject = value; }, setTopic: value => { state.topic = value; },
    setPracticeMode: value => { state.practiceMode = value; }, setMode() {}, setView: value => { state.view = value; },
  });
  await vm.runInContext(`(${source.slice(onClick.start, onClick.end)})()`, scope);
  assert.equal(state.subject, 'all');
  assert.equal(state.topic, null);
  assert.equal(state.view, 'config');
  const selected = question('exotic', 4);
  const stale = question('com4', 4, 990_002);
  const pool = buildExamPool({ questions: [stale, selected], selectedYear: 4, subject: state.subject, topic: state.topic,
    practiceMode: normalizePracticeMode(state.practiceMode, state.subject),
    history: [attempt(selected, false, 1)], bookmarks: [selected.id] });
  assert.deepEqual(keys(pool), [`exotic:${selected.id}`]);
});
test('the year-scoped dashboard cannot count a wrong other-year namesake', () => {
  const current = question('com4', 4);
  const other = question('com5', 5);
  const scopedHistory = [attempt(current, false, 1), attempt(current, true, 2)];
  const result = analytics([...scopedHistory, attempt(other, false, 3)], [current, other]);
  const scope = vm.createContext({ analytics: result, scopedHistory, yearScope: 'current', stillWrong,
    QB: [current, other], customQuestions: [], selectedYear: 4, buildExamPool,
    useMemo: callback => callback() });
  const scoped = vm.runInContext(dashboard.initializer('scopedAnalytics'), scope);
  assert.equal(scoped.weakQuestions.length, 0);
});
test('the dashboard scopes before the weak cap so other years cannot hide actionable questions', () => {
  const other = Array.from({ length: WEAK_POOL_CAP }, (_, i) => question('com5', 5, 995_000 + i));
  const current = question('com4', 4);
  const scopedHistory = [attempt(current, false, 999)];
  const history = [...other.flatMap(q => [attempt(q, false, 1), attempt(q, false, 2)]), ...scopedHistory];
  const result = analytics(history, [...other, current]);
  const scope = vm.createContext({ analytics: result, scopedHistory, yearScope: 'current', stillWrong,
    QB: [...other, current], customQuestions: [], selectedYear: 4, buildExamPool,
    useMemo: callback => callback() });
  const scoped = vm.runInContext(dashboard.initializer('scopedAnalytics'), scope);
  assert.deepEqual(Array.from(scoped.weakQuestions), [current.id]);
});

const sr = viewCode('src/views/SRSessionView.jsx');
test('a remembered SR subject loads its own year, including refusal and retry', async () => {
  const calls = [];
  const state = { starting: false, bankError: false, session: null, refuse: true };
  const ticket = { intent: 'saved-com4' };
  const scope = vm.createContext({ ownerId: null, selectedYear: 5, selectedPhase: null, subjectFilter: 'com4',
    yearScope: 'current', phaseScope: 'current', sessionSize: 25, yearForSubject,
    startRequestRef: { current: null }, latestStartRef: { current: { intent: ticket.intent,
      queue: () => [{ ...initCard(990_001), question: question('com4', 4) }] } }, startIntent: ticket.intent,
    loadQBForYear: async year => { calls.push(year); if (state.refuse) throw new Error('offline'); },
    loadQB: async () => { throw new Error('unexpected all-year load'); },
    setStarting: value => { state.starting = value; }, setBankError: value => { state.bankError = value; },
    timingRef: { current: { reset() {} } }, setReviewSessionId() {}, newStudySessionId: () => 'session',
    gradedRef: { current: null }, setSessionCards: value => { state.session = value; }, setPartialReview() {},
    setCurrentIdx() {}, setShowAnswer() {}, setReviewedCount() {}, setCorrectCount() {},
    isQBYearLoaded: year => year === 5, isQBFullyLoaded: () => false,
  });
  if (sr.has('reviewYear')) scope.reviewYear = vm.runInContext(sr.initializer('reviewYear'), scope);
  const ready = vm.runInContext(sr.initializer('scopeReady'), scope);
  assert.equal(ready, false, 'a loaded year 5 cannot declare the selected year-4 subject ready');
  const start = vm.runInContext(sr.initializer('startSession'), scope);
  await start();
  assert.equal(state.bankError, true);
  assert.equal(state.session, null);
  assert.equal(state.starting, false);
  state.refuse = false;
  await start();
  assert.deepEqual(calls, [4, 4]);
  assert.equal(state.session[0].question.subject, 'com4');
  assert.equal(state.bankError, false);
});
function grade(quality, accepted = true) {
  const questionId = 9_100_001;
  let cards = { [questionId]: initCard(questionId) };
  const state = { correct: 0, reviewed: 0, index: 0, errors: 0 };
  const scope = vm.createContext({ quality, reviewSessionId: 'review', currentIdx: 0, gradedRef: { current: null },
    currentCard: cards[questionId], currentQ: { id: questionId, type: 'flashcard', front: 'F', back: 'B' },
    sessionCards: [cards[questionId]], correctCount: 0, reviewedCount: 0, RELEARN_CAP: 2,
    timingRef: { current: { snapshot: () => ({}) } },
    srCardFor: (value, q) => value[q.id], initCard, updateCard, createReviewEvent: () => null,
    setSrCards: updater => { if (accepted) cards = updater(cards); return { accepted }; },
    alertDialog: () => { state.errors++; }, window: { dispatchEvent() {} }, CustomEvent: class {},
    setCorrectCount: value => { state.correct = value; }, setReviewedCount: value => { state.reviewed = value; },
    setCurrentIdx: value => { state.index = value; }, setShowAnswer() {}, setSessionCards() {},
  });
  const handleGrade = vm.runInContext(sr.initializer('handleGrade'), scope);
  handleGrade(quality);
  handleGrade(quality);
  return { ...state, cards };
}
test('Hard is successful recall in the actual SR summary, while Again is not', () => {
  assert.equal(grade(1).correct, 1);
  assert.equal(grade(0).correct, 0);
  assert.equal(grade(2).reviewed, 1, 'same-card double click receives one review');
});
test('a refused SR save preserves the card for retry', () => {
  const failed = grade(1, false);
  assert.equal(failed.reviewed, 0);
  assert.equal(failed.index, 0);
  assert.equal(failed.cards[9_100_001].totalReviews, 0);
  assert.equal(failed.errors, 2, 'both attempts report their refusal');
  assert.equal(grade(1).cards[9_100_001].totalReviews, 1);
});
