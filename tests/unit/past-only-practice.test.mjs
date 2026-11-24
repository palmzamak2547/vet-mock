// ============================================================
// past-only-practice.test.mjs — practise only the questions that have been
// on a real paper, and every number beside that choice is the set it serves
// ============================================================
// A friend's ask, 23 Nov 2026: whether VetMock can practise only the
// questions that have been on a real paper (ข้อสอบเก่า). The engine already
// had the filter (a lecturer card's "ฝึกเฉพาะข้อสอบเก่า"); the topic screen
// now has a ทุกข้อ / ข้อสอบเก่า switch over its grid, the config screen a
// ข้อที่ใช้ row, and the results page continues a past-only set as one.
//
// What this holds:
//   1. buildExamPool narrows to past papers as its LAST step, after the
//      paper. Before the paper, a topic whose past papers all sat the other
//      paper emptied the paper filter, and its never-empty guard served those
//      other-paper questions under a switch whose count said 0.
//   2. Over the real bank, for every course, year and period: the past-only
//      set is exactly the plain set's past papers, and the number the topic
//      screen prints under the switch (รวมทุกหัวข้อ, each topic, each
//      collection) is the size of the set its button opens.
//   3. The config screen's row: drawn for the plain pools only, hidden for a
//      set with no past paper, the summary names the set, an empty past-only
//      set says why.
//   4. The topic screen's switch: kept on the device, counts follow it, a
//      topic with no past paper stays in place and opens nothing, a tap hands
//      the config screen the set it counted.
//   5. App and the results page: the choice lives for one config visit, is
//      read only where its row is drawn, and a past-only set's next sets
//      (ทำอีก 5 ข้อ, the next rung) stay past-only.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { buildExamPool, pastOnlyShown, pastPapersOf } from '../../src/lib/exam-pool.js';
import { ladderPreset } from '../../src/lib/practice-ladder.js';
import { isPastPaperQuestion } from '../../src/lib/question-metadata.js';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import * as library from '../../src/lib/library.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import * as C from '../../src/data/q-counts.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

let nextId = 950_000;
const q = (subject, extra = {}) => ({
  id: nextId++, subject, topic: 'fixture-topic', type: 'mcq', q: 'fixture', options: ['a', 'b'], answer: 0, ...extra,
});
const ids = (pool) => pool.map((x) => x.id);
const build = (args) => buildExamPool({ practiceMode: 'all', subject: 'all', topic: null, questionCategory: 'all', bookmarks: [], weakQuestions: [], history: [], ...args });

// ── 1. The filter's place in the pool ─────────────────────────────────
test('past papers only never borrows the other paper', () => {
  const subject = 'equine-medicine';
  const finalPast = q(subject, { examScope: 'final', sourceType: 'past-paper' });
  const midLecture = q(subject, { examScope: 'midterm', sourceType: 'lecture-derived' });
  const args = { questions: [finalPast, midLecture], subject, topic: 'fixture-topic', selectedYear: 5, selectedPhase: '1-mid' };
  // Premise: the plain midterm set of this topic is its midterm question.
  assert.deepEqual(ids(build(args)), [midLecture.id], 'the fixture no longer splits by paper');
  // The midterm holds no past paper of this topic, so the past-only set is
  // empty: never the final's past paper through the never-empty guard.
  assert.deepEqual(ids(build({ ...args, onlyPastPaper: true })), []);
  // Under the final it is that past paper.
  assert.deepEqual(ids(build({ ...args, selectedPhase: '1-final', onlyPastPaper: true })), [finalPast.id]);
});

// Palm, 23 Nov 2026: "การแยกกลางภาคปลายภาคยังต้องอยู่นะครับ อย่าให้ปนกัน".
test('a paper with no past paper of a subject gets none, never the other paper\'s', () => {
  // Epidemiology sits only the final: the timetable settles every question.
  const subject = 'epidemiology';
  const finalPast = q(subject, { sourceType: 'past-paper' });
  const finalLecture = q(subject, { sourceType: 'lecture-derived' });
  const args = { questions: [finalPast, finalLecture], subject, selectedYear: 5 };
  // Premise: the plain midterm set falls back to the whole subject (the
  // never-empty guard, for a subject the student named); nothing here changes it.
  assert.deepEqual(ids(build({ ...args, selectedPhase: '1-mid' })).sort(), [finalPast.id, finalLecture.id].sort(),
    'the premise moved: the plain set no longer falls back, so this fixture proves nothing');
  // Past papers only under กลางภาค: none.
  assert.deepEqual(ids(build({ ...args, selectedPhase: '1-mid', onlyPastPaper: true })), []);
  assert.deepEqual(ids(pastPapersOf(build({ ...args, selectedPhase: '1-mid' }), { subject, selectedYear: 5, selectedPhase: '1-mid' })), [],
    'the config row counts the same set its chip serves');
  // Under ปลายภาค: the final's past paper.
  assert.deepEqual(ids(build({ ...args, selectedPhase: '1-final', onlyPastPaper: true })), [finalPast.id]);
});

test('past papers only is the plain set\'s past papers and leaves curated pools alone', () => {
  const subject = 'avian-medicine';
  const paper = q(subject, { sourceType: 'past-paper' });
  const lecture = q(subject, { sourceType: 'lecture-derived' });
  const questions = [paper, lecture];
  const plain = build({ questions, subject, selectedYear: 5 });
  assert.deepEqual(ids(build({ questions, subject, selectedYear: 5, onlyPastPaper: true })), ids(pastPapersOf(plain)));
  assert.deepEqual(ids(pastPapersOf(plain)), [paper.id]);
  // A bookmark list is the student's own; the row is never drawn there.
  const marked = build({ questions, practiceMode: 'bookmarks', bookmarks: [paper.id, lecture.id], selectedYear: 5, onlyPastPaper: true });
  assert.deepEqual(ids(marked).sort(), [paper.id, lecture.id].sort());
});

test('the row is drawn for the plain pools only', () => {
  assert.equal(pastOnlyShown('all'), true);
  assert.equal(pastOnlyShown('adaptive'), true);
  for (const mode of ['bookmarks', 'weak', 'wrong', 'current-scope', 'predicted', undefined]) {
    assert.equal(pastOnlyShown(mode), false, `${mode} would be narrowed by a row it does not show`);
  }
});

// ── 2. The real bank: the switch's numbers are the sets it serves ─────
test('every number under the switch is the past-only set its button opens', async () => {
  const { QB, loadQB } = await import('../../src/data/questions.js');
  const { SUBJECTS_BY_YEAR, yearForSubject } = await import('../../src/data/curriculum.js');
  const { phaseForCourse, topicOnPaper } = await import('../../src/lib/exam-scope.js');
  const { createStudyCatalog } = await import('../../src/lib/study-catalog.js');
  await loadQB();
  const catalog = createStudyCatalog();
  const bySubject = new Map();
  for (const x of QB) {
    if (!bySubject.has(x.subject)) bySubject.set(x.subject, []);
    bySubject.get(x.subject).push(x);
  }
  const sum = (o) => Object.values(o || {}).reduce((a, b) => a + b, 0);
  const wrong = [];
  let checked = 0;
  for (const year of Object.keys(SUBJECTS_BY_YEAR).map(Number).filter(Number.isFinite)) {
    for (const s of SUBJECTS_BY_YEAR[year] || []) {
      if (!s?.id || yearForSubject(s.id) !== year) continue;
      for (const phase of [null, '1-mid', '1-final', '2-mid', '2-final']) {
        const coursePhase = phaseForCourse(s.id, year, phase);
        const page = catalog.browse({ subject: s.id });
        const scoped = coursePhase ? (C.Q_COUNTS_BY_TOPIC_BY_SCOPE[coursePhase]?.[s.id] || {}) : null;
        const scopedPast = coursePhase ? (C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[coursePhase]?.[s.id] || {}) : null;
        const topics = (page.topics || []).filter((t) => topicOnPaper(s.id, t.id, coursePhase));
        // TopicSelectView's pastPaperCountFor, as the switch reads it.
        const pastFor = (topicId) => {
          if (topicId === 'all') return scopedPast ? sum(scopedPast) : (page.resources?.questions?.pastPaperCount || 0);
          const coll = (page.collections || []).find((c) => c.id === topicId);
          if (coll) {
            if (!scopedPast) return coll.pastPaperCount || 0;
            const prefix = coll.topicPrefix || String(coll.id).replace(/^_|-all$/g, '');
            return Object.entries(scopedPast).filter(([id]) => id.startsWith(prefix)).reduce((a, [, n]) => a + n, 0);
          }
          return scopedPast ? (scopedPast[topicId] || 0) : (topics.find((t) => t.id === topicId)?.pastPaperCount || 0);
        };
        // TopicSelectView's countFor: a card prints a number, and opens a
        // set, only where this is above zero (counts-contract holds it to
        // the set its button serves).
        const countFor = (topicId) => {
          if (topicId === 'all') return scoped ? sum(scoped) : (page.resources?.questions?.count || 0);
          const coll = (page.collections || []).find((c) => c.id === topicId);
          if (coll) {
            if (!scoped) return coll.questionCount || 0;
            const prefix = coll.topicPrefix || String(coll.id).replace(/^_|-all$/g, '');
            return Object.entries(scoped).filter(([id]) => id.startsWith(prefix)).reduce((a, [, n]) => a + n, 0);
          }
          return scoped ? (scoped[topicId] || 0) : (topics.find((t) => t.id === topicId)?.questionCount || 0);
        };
        const questions = bySubject.get(s.id) || [];
        for (const topicId of ['all', ...topics.map((t) => t.id), ...(page.collections || []).map((c) => c.id)]) {
          const args = { questions, subject: s.id, topic: topicId === 'all' ? null : topicId, selectedYear: year, selectedPhase: phase };
          const plain = build(args);
          const past = build({ ...args, onlyPastPaper: true });
          checked++;
          const expect = ids(pastPapersOf(plain, args));
          if (ids(past).join() !== expect.join()) wrong.push(`${s.id}/${topicId} y${year} ${phase}: past-only set is not the plain set's past papers on its paper`);
          if (countFor(topicId) > 0 && pastFor(topicId) !== past.length) {
            wrong.push(`${s.id}/${topicId} y${year} ${phase}: switch says ${pastFor(topicId)}, serves ${past.length}`);
          }
        }
      }
    }
  }
  assert.ok(checked > 500, `only ${checked} sets checked; the matrix lost its courses`);
  assert.deepEqual(wrong.slice(0, 20), []);
});

// Palm, 23 Nov 2026: "การแยกกลางภาคปลายภาคยังต้องอยู่นะครับ อย่าให้ปนกัน".
// Every set a student can open under ข้อสอบเก่า (a course of the paper's own
// term: รวมทุกหัวข้อ, each listed topic, each collection) sits that paper:
// each question is on it by the one resolver (lib/exam-scope.js, the topic
// decides), and no cohort is served its own sat paper under the other one.
// What sits both papers sits both by its topic's declared scope ('both'), or
// by a paper nobody has recorded, which Rule 10 never filters out.
test('past papers only never leaves the picked paper', async () => {
  const { QB, loadQB } = await import('../../src/data/questions.js');
  const { SUBJECTS_BY_YEAR, yearForSubject, semesterForSubject } = await import('../../src/data/curriculum.js');
  const { phaseForCourse, scopeForPhase, questionInScope, scopeOfQuestion, topicOnPaper } = await import('../../src/lib/exam-scope.js');
  const { createStudyCatalog } = await import('../../src/lib/study-catalog.js');
  const { originEntry } = await import('../../src/data/exam-origins.js');
  const { SEMESTER } = await import('../../src/data/semester.js');
  const { cohortForYear } = await import('../../src/lib/public-identity.js');
  await loadQB();
  const catalog = createStudyCatalog();
  const bySubject = new Map();
  for (const x of QB) {
    if (!bySubject.has(x.subject)) bySubject.set(x.subject, []);
    bySubject.get(x.subject).push(x);
  }
  const wrong = [];
  let served = 0;
  for (const year of Object.keys(SUBJECTS_BY_YEAR).map(Number).filter(Number.isFinite)) {
    const cohort = Number(String(cohortForYear(year, SEMESTER.cohortNote) || '').replace(/\D/g, '')) || null;
    for (const s of SUBJECTS_BY_YEAR[year] || []) {
      if (!s?.id || yearForSubject(s.id) !== year) continue;
      const term = semesterForSubject(s.id);
      for (const phase of ['1-mid', '1-final', '2-mid', '2-final']) {
        // A course of the other term lists nothing under this period.
        if ((term === 1 || term === 2) && !phase.startsWith(`${term}-`)) continue;
        const coursePhase = phaseForCourse(s.id, year, phase);
        const paper = scopeForPhase(coursePhase);
        if (!paper) continue;
        const page = catalog.browse({ subject: s.id });
        const topics = (page.topics || []).filter((t) => topicOnPaper(s.id, t.id, coursePhase)).map((t) => t.id);
        for (const topic of [null, ...topics, ...(page.collections || []).map((c) => c.id)]) {
          const set = build({ questions: bySubject.get(s.id) || [], subject: s.id, topic, selectedYear: year, selectedPhase: phase, onlyPastPaper: true });
          served += set.length;
          for (const x of set) {
            if (!questionInScope(x, paper)) wrong.push(`${s.id}/${topic ?? 'all'} y${year} ${phase}: #${x.id} sits ${scopeOfQuestion(x)}, not ${paper}`);
            const filed = originEntry(x.examOrigin);
            const sat = filed?.kind === 'paper' ? filed.paper : null;
            const cohorts = [].concat(filed?.cohort ?? []);
            if (cohort && cohorts.includes(cohort) && (sat === 'midterm' || sat === 'final') && sat !== paper) {
              wrong.push(`${s.id}/${topic ?? 'all'} y${year} ${phase}: #${x.id} is Vet ${cohort}'s own ${sat} under ${paper}`);
            }
          }
        }
      }
    }
  }
  assert.ok(served > 1000, `only ${served} past-paper questions served across the matrix; it lost its courses`);
  assert.deepEqual([...new Set(wrong)].slice(0, 20), []);
});

// ── 3. The config screen's row ────────────────────────────────────────
const { default: ConfigView } = await loadModule('src/views/ConfigView.jsx', {
  stubs: [
    { match: '\\.css$', contents: '' },
    { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
    { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true, preferences: { mode: "off", companion: false, loader: "off", celebration: "off" } });' },
    { match: '/lib/question-difficulty\\.js$', contents: 'export const loadQuestionDifficulty = async () => ({}); export const loadDifficultyResolver = async () => () => 1500;' },
  ],
});

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.localStorage = storage();
  globalThis.sessionStorage = storage();
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/topics'), addEventListener() {}, removeEventListener() {} };
  t.after(() => { delete globalThis.localStorage; delete globalThis.sessionStorage; delete globalThis.window; });
}

const configProps = (over = {}) => {
  const calls = { setPastOnly: [], setNumQuestions: [], startExam: [] };
  const rec = (k) => (v) => calls[k].push(v);
  return {
    calls,
    props: {
      practiceMode: 'all', setPracticeMode() {}, subject: 'zoonoses', setSubject() {}, topic: null, setTopic() {},
      numQuestions: 10, setNumQuestions: rec('setNumQuestions'), useTimer: false, setUseTimer() {}, timePerQ: 60, setTimePerQ() {},
      questionCategory: 'all', setQuestionCategory() {}, instantFeedback: true, setInstantFeedback() {},
      startExam: rec('startExam'), goHome() {}, availableCount: 248, availablePool: null, mode: 'quick', setMode() {},
      selectedYear: 5, selectedPhase: '1-final', panicPending: false, setPanicPending() {},
      pastOnly: false, setPastOnly: rec('setPastOnly'), pastCount: 142,
      ...over,
    },
  };
};
const poolRow = (tree) => findAll(tree, (n) => n.props?.['aria-labelledby'] === 'vmx-config-pool-label')[0];
const chip = (row, label) => findAll(row, (n) => n.type === 'button' && textOf(n).trim() === label)[0];

test('the config row offers every question or past papers, and says which is in force', (t) => {
  browser(t);
  const { calls, props } = configProps();
  const view = mount(ConfigView, props);
  const row = poolRow(view.tree);
  assert.ok(row, 'a plain set holding past papers draws the row');
  assert.equal(chip(row, 'ทุกข้อ').props['aria-pressed'], true);
  assert.equal(chip(row, 'ข้อสอบเก่า').props['aria-pressed'], false);
  assert.match(textOf(row), /ในชุดนี้เป็นข้อสอบเก่า 142 ข้อ/, 'the other choice says what it holds');
  chip(row, 'ข้อสอบเก่า').props.onClick();
  assert.deepEqual(calls.setPastOnly, [true]);
  view.unmount();
});

test('a past-only set names itself in the summary, and an empty one says why', (t) => {
  browser(t);
  const on = mount(ConfigView, configProps({ pastOnly: true, availableCount: 142, numQuestions: 10 }).props);
  const summary = findAll(on.tree, (n) => n.props?.id === 'vmx-config-summary')[0];
  assert.match(textOf(summary), /ข้อสอบเก่า 10 ข้อ/);
  const row = poolRow(on.tree);
  assert.equal(chip(row, 'ข้อสอบเก่า').props['aria-pressed'], true);
  assert.match(textOf(row), /เฉพาะข้อที่เคยออกสอบจริง/);
  on.unmount();
  const empty = mount(ConfigView, configProps({ pastOnly: true, availableCount: 0, pastCount: 0 }).props);
  assert.match(textOf(empty.tree), /ชุดนี้ยังไม่มีข้อสอบเก่า/);
  assert.ok(poolRow(empty.tree), 'the row stays, so the student can switch back');
  empty.unmount();
});

test('the row is not drawn where it could not change the set', (t) => {
  browser(t);
  const none = mount(ConfigView, configProps({ pastCount: 0 }).props);
  assert.equal(poolRow(none.tree), undefined, 'a set with no past paper offers no dead chip');
  none.unmount();
  const curated = mount(ConfigView, configProps({ practiceMode: 'wrong', setPastOnly: null }).props);
  assert.equal(poolRow(curated.tree), undefined, 'a curated pool never shows it');
  curated.unmount();
  const counting = mount(ConfigView, configProps({ pastCount: null, availableCount: null }).props);
  assert.ok(poolRow(counting.tree), 'while counting the row is kept, so it does not appear under the student\'s eyes');
  counting.unmount();
});

test('switching back to every question gives the count back', (t) => {
  browser(t);
  const { calls, props } = configProps({ numQuestions: 20, availableCount: 248 });
  const view = mount(ConfigView, props);
  chip(poolRow(view.tree), 'ข้อสอบเก่า').props.onClick();
  // App answers with the smaller set; the clamp fits the count to it.
  view.update({ pastOnly: true, availableCount: 7, numQuestions: 20 });
  assert.equal(calls.setNumQuestions.at(-1), 7);
  view.update({ numQuestions: 7 });
  chip(poolRow(view.tree), 'ทุกข้อ').props.onClick();
  view.update({ pastOnly: false, availableCount: 248 });
  assert.equal(calls.setNumQuestions.at(-1), 20, 'the 20 the student set comes back');
  view.unmount();
});

test('on a set the app decided, the app\'s count follows the switch', (t) => {
  browser(t);
  // Arrived from the topic screen under ข้อสอบเก่า: rung 1 capped to the 7
  // past papers, exactly the app's decision.
  const rung1 = ladderPreset('understand', { available: 248 }).numQuestions;
  assert.ok(rung1 > 7, 'the fixture needs a rung count above the past-only set');
  const { calls, props } = configProps({ pastOnly: true, availableCount: 7, numQuestions: 7 });
  const view = mount(ConfigView, props);
  assert.match(textOf(findAll(view.tree, (n) => n.props?.id === 'vmx-config-summary')[0]), /^จัดให้แล้ว/,
    'the premise: the line says the app decided this set');
  chip(poolRow(view.tree), 'ทุกข้อ').props.onClick();
  view.update({ pastOnly: false, availableCount: 248 });
  assert.equal(calls.setNumQuestions.at(-1), rung1, 'the whole set gets the rung\'s own count, not the 7 it was capped to');
  view.unmount();
});

// ── 4. The topic screen's switch ──────────────────────────────────────
globalThis.__pastOnlyLibrary = { ...library, librarySubjectCounts: async () => new Map() };
const { default: TopicSelectView, PAST_ONLY_PREF } = await loadModule('src/views/TopicSelectView.jsx', {
  stubs: [
    { match: '\\.css$', contents: '' },
    { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
    { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
    { match: '/lib/library\\.js$', contents: `export const { ${Object.keys(library).join(', ')} } = globalThis.__pastOnlyLibrary;` },
  ],
});

// A year-5 course of term 1 whose final holds topics with past papers and
// topics without: the switch has something to show either way.
const PHASE = '1-final';
const subjectWithBoth = ['epidemiology', 'swine-clinic', 'aquatic-clinic', 'zoonoses', 'milk-meat-hygiene'].find((id) => {
  const all = C.Q_COUNTS_BY_TOPIC_BY_SCOPE[PHASE]?.[id] || {};
  const past = C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[PHASE]?.[id] || {};
  return Object.keys(all).some((t) => all[t] > 0 && past[t] > 0) && Object.keys(all).some((t) => all[t] > 0 && !past[t]);
});
assert.ok(subjectWithBoth, 'no term-1 course holds both kinds of topic under the final; pick another fixture');
const SUBJ = subjectWithBoth;
const allCounts = C.Q_COUNTS_BY_TOPIC_BY_SCOPE[PHASE][SUBJ];
const pastCounts = C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[PHASE][SUBJ];
const labelOf = (topicId) => SUBJECTS.find((s) => s.id === SUBJ).topics.find((x) => x.id === topicId).label;

const topicProps = (over = {}) => {
  const calls = { setPastOnly: [], setNumQuestions: [], setView: [], setTopic: [] };
  const rec = (k) => (v) => calls[k].push(v);
  return {
    calls,
    props: {
      subject: SUBJ, selectedYear: 5, selectedPhase: PHASE, mode: 'quick', setMode() {}, setSubject() {},
      setView: rec('setView'), setTopic: rec('setTopic'), setNumQuestions: rec('setNumQuestions'), setUseTimer() {},
      setInstantFeedback() {}, setTimePerQ() {}, setPastOnly: rec('setPastOnly'), customQuestions: [],
      ...over,
    },
  };
};
const switchOf = (tree) => findAll(tree, (n) => n.props?.['aria-label'] === 'ข้อที่ใช้ฝึก')[0];
const cardOf = (tree, topicId) => findAll(tree, (n) => n.props?.className === 'vmx-topic-card'
  && findAll(n, (m) => m.props?.className === 'title' && textOf(m) === labelOf(topicId)).length)[0];
const mainOf = (card) => findAll(card, (n) => n.props?.className === 'vmx-topic-main')[0];

test('the switch counts past papers, keeps a topic without them in place, and is kept on the device', async (t) => {
  browser(t);
  const { calls, props } = topicProps();
  const view = mount(TopicSelectView, props);
  await settle(view);
  const sw = switchOf(view.tree);
  assert.ok(sw, `${SUBJ} holds past papers under the final, so the switch is drawn`);
  const pastChip = findAll(sw, (n) => n.type === 'button' && textOf(n).trim() === 'ข้อสอบเก่า')[0];
  assert.equal(pastChip.props['aria-pressed'], false, 'every question until the student asks');
  pastChip.props.onClick();
  view.flush();
  assert.equal(globalThis.localStorage.getItem(PAST_ONLY_PREF), '1');

  const withPast = Object.keys(allCounts).find((id) => allCounts[id] > 0 && pastCounts[id] > 0 && cardOf(view.tree, id));
  const noPast = Object.keys(allCounts).find((id) => allCounts[id] > 0 && !pastCounts[id] && cardOf(view.tree, id));
  assert.ok(withPast && noPast, 'the fixture lost one of its two kinds of topic');
  const a = cardOf(view.tree, withPast);
  assert.match(textOf(a), new RegExp(`ข้อสอบเก่า ${pastCounts[withPast]} ข้อ`));
  assert.equal(findAll(a, (n) => n.props?.className === 'vmx-topic-past').length, 0, 'the share chip would only repeat the count');
  const b = cardOf(view.tree, noPast);
  assert.equal(b.props['data-no-past'], '', 'the card is marked for its quieter style');
  assert.equal(mainOf(b).props.disabled, true, 'a topic with no past paper opens no empty set');
  assert.match(textOf(b), /ไม่มีข้อสอบเก่า/);

  // A tap hands the config screen exactly the set its card counted.
  mainOf(a).props.onClick();
  assert.deepEqual(calls.setPastOnly, [true]);
  assert.deepEqual(calls.setTopic, [withPast]);
  assert.ok(calls.setNumQuestions.at(-1) <= pastCounts[withPast], 'the count was capped by the past-only set');
  assert.deepEqual(calls.setView, ['config']);
  view.unmount();

  // Back on the screen later: the switch is where the student left it.
  const again = mount(TopicSelectView, topicProps().props);
  await settle(again);
  const kept = findAll(switchOf(again.tree), (n) => n.type === 'button' && textOf(n).trim() === 'ข้อสอบเก่า')[0];
  assert.equal(kept.props['aria-pressed'], true);
  again.unmount();
});

test('the plain grid is untouched, and a tap there asks for every question', async (t) => {
  browser(t);
  const { calls, props } = topicProps();
  const view = mount(TopicSelectView, props);
  await settle(view);
  const id = Object.keys(allCounts).find((x) => allCounts[x] > 0 && cardOf(view.tree, x));
  assert.match(textOf(cardOf(view.tree, id)), new RegExp(`${allCounts[id]} ข้อ`));
  mainOf(cardOf(view.tree, id)).props.onClick();
  assert.deepEqual(calls.setPastOnly, [false], 'a stale choice from an earlier visit is cleared');
  view.unmount();
});

test('a subject with no past paper on the paper draws no switch, whatever was kept', async (t) => {
  browser(t);
  globalThis.localStorage.setItem(PAST_ONLY_PREF, '1');
  const { yearForSubject } = await import('../../src/data/curriculum.js');
  const total = (table, phase, id) => Object.values(table[phase]?.[id] || {}).reduce((x, y) => x + y, 0);
  // A course with questions on a paper and no past paper among them.
  let bare = null;
  for (const phase of ['1-mid', '1-final', '2-mid', '2-final']) {
    const id = Object.keys(C.Q_COUNTS_BY_TOPIC_BY_SCOPE[phase] || {}).find((x) => total(C.Q_COUNTS_BY_TOPIC_BY_SCOPE, phase, x) > 0
      && total(C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE, phase, x) === 0 && Number.isFinite(yearForSubject(x)));
    if (id) { bare = { id, phase, year: yearForSubject(id) }; break; }
  }
  assert.ok(bare, 'every course now holds a past paper on every paper; build this fixture another way');
  const { calls, props } = topicProps({ subject: bare.id, selectedYear: bare.year, selectedPhase: bare.phase });
  const view = mount(TopicSelectView, props);
  await settle(view);
  assert.equal(switchOf(view.tree), undefined);
  const card = findAll(view.tree, (n) => n.props?.className === 'vmx-subject-card' && textOf(n).includes('รวมทุกหัวข้อ'))[0];
  assert.doesNotMatch(textOf(card), /ข้อสอบเก่า/, 'a kept switch never narrows a page that does not show it');
  card.props.onClick();
  assert.deepEqual(calls.setPastOnly, [false]);
  view.unmount();
});

// ── 5. App and the results page ───────────────────────────────────────
test('the choice lives for one config visit and is read only where its row is drawn', () => {
  const app = read('src/App.jsx');
  assert.match(app, /if \(view !== 'config'\) \{ setPanicPending\(false\); setPastOnly\(false\); \}/,
    'the past-only choice must end with the config visit, like Panic');
  assert.match(app, /const _onlyPastPaper = overrides\.onlyPastPaper === true && pastOnlyShown\(_practiceMode\);/);
  assert.match(app, /const configPastOnly = pastOnly && configPastShown;/);
  assert.match(app, /setPastOnly=\{configPastShown \? setPastOnly : null\}/, 'the row gets its setter only where it is drawn');
  assert.match(app, /setSessionPastOnly\(_onlyPastPaper\);/, 'the set remembers how it was drawn');
  assert.match(app, /pastOnly: sessionPastOnly,\r?\n {4}\};/, 'the in-flight record keeps it for a resumed set');
  // The submitted record replaces the in-flight one under the same key, and a
  // results page that failed to load is recovered from it: it keeps the flag
  // too, or ทำอีก 5 ข้อ after a recovery would draw from every question.
  assert.match(app, /submitted: true, submittedAt: completedAt, pastOnly: sessionPastOnly,/,
    'the submitted record drops the past-only flag');
  assert.match(app, /setSessionPastOnly\(saved\.pastOnly === true\);/);
});

test('a past-only set continues as one from the results page', () => {
  const results = read('src/views/ResultsView.jsx');
  const starts = [...results.matchAll(/startExam\(\{[\s\S]*?\}\);/g)].map((m) => m[0]);
  const continuing = starts.filter((s) => /excludeIds|step\.count/.test(s));
  assert.equal(continuing.length, 3, 'ทำอีก 5 ข้อ and the two ladder starts');
  for (const s of continuing) assert.match(s, /onlyPastPaper: pastOnly/);
  assert.match(results, /const pastTag = pastOnly \? ', ข้อสอบเก่า' : '';/, 'the rows say the set stays on past papers');
});
