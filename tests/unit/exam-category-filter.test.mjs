// ============================================================
// The question-type filter applies only where its picker is on screen
// ============================================================
// The config screen shows a type picker (ทุกประเภท / ปรนัย / ข้อเขียน) for
// English only. The choice was plain state that nothing reset, so it followed
// the student everywhere after English, unseen. Pick the written-only chip in
// English, open COM IV, and the screen said ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ with
// Start greyed out and no control that explained it (291 questions, 0 served).
// The sidebar Mock Exam served 70 written items out of a 1,981-question year.
//
// These tests run the real pool builder (src/lib/exam-pool.js), and the exact
// expressions the config count and startExam use to decide which category to
// filter by, lifted out of src/App.jsx and evaluated over the real question
// bank. Counts
// are compared against the same subject with the filter off, never hard-coded,
// so adding questions cannot break them.
//
// The second half holds the chip labels to questionCategory(), which puts
// fill-in-the-blank under the written chip and matching under the auto-marked
// one, while the chips put fill with MCQ and did not name matching at all.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

import { QB, loadQB } from '../../src/data/questions.js';
import * as curriculum from '../../src/data/curriculum.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { questionCategory as catOf } from '../../src/hooks/utils.js';
import {
  buildExamPool,
  normalizePracticeMode,
  categoryPickerShown,
  appliedCategory,
} from '../../src/lib/exam-pool.js';

await loadQB();

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = read('src/App.jsx');
const CONFIG = read('src/views/ConfigView.jsx');
const QUESTION = read('src/components/Question.jsx');

// ── The expressions App evaluates, in a sandbox holding what App imports ──
const sandbox = vm.createContext({ categoryPickerShown, appliedCategory });

// The category the config screen's count filters by, as App computes it.
function configCountCategoryExpr() {
  const block = APP.slice(APP.indexOf('const configServedPool'), APP.indexOf('// startExam accepts'));
  const args = block.slice(block.indexOf('buildExamPool({'));
  const m = args.match(/\n\s*questionCategory(?:\s*:\s*([^\n]+?))?,\n/);
  assert.ok(m, 'the config count no longer passes a questionCategory to buildExamPool');
  return m[1] || 'questionCategory';
}
// The category startExam falls back to when the caller passes none.
function startExamCategoryExpr() {
  const block = APP.slice(APP.indexOf('const startExam = async'), APP.indexOf('const examQuestions = [...QB'));
  const m = block.match(/const _questionCategory = ([\s\S]+?);\n/);
  assert.ok(m, 'startExam no longer resolves _questionCategory');
  return m[1];
}
const configExpr = configCountCategoryExpr();
const startExpr = startExamCategoryExpr();
const evalConfigCategory = vm.runInContext(
  `(function (questionCategory, subject, practiceMode, configPracticeMode) { return (${configExpr}); })`,
  sandbox,
);
const evalStartCategory = vm.runInContext(
  `(function (overrides, questionCategory, subject, practiceMode, _subject, _practiceMode) { return (${startExpr}); })`,
  sandbox,
);

// What the config screen prints for this App state.
function configCount({ questionCategory, subject, practiceMode = 'all', topic = null, selectedYear, selectedPhase = null }) {
  const configPracticeMode = normalizePracticeMode(practiceMode, subject, false);
  const category = evalConfigCategory(questionCategory, subject, practiceMode, configPracticeMode);
  return buildExamPool({
    questions: QB, practiceMode: configPracticeMode, subject, topic,
    questionCategory: category, selectedYear, selectedPhase,
  }).length;
}
// What startExam serves for this App state and these overrides.
function startPool({ state, overrides = {} }) {
  const { questionCategory, subject, practiceMode = 'all', topic = null, selectedYear, selectedPhase = null } = state;
  const rawMode = 'practiceMode' in overrides ? overrides.practiceMode : practiceMode;
  const _subject = 'subject' in overrides ? overrides.subject : subject;
  const _topic = 'topic' in overrides ? overrides.topic : topic;
  const category = evalStartCategory(overrides, questionCategory, subject, practiceMode, _subject, rawMode);
  const mode = normalizePracticeMode(rawMode, _subject, 'practiceMode' in overrides);
  return {
    category,
    size: buildExamPool({
      questions: QB, practiceMode: mode, subject: _subject, topic: _topic,
      questionCategory: category, selectedYear, selectedPhase,
    }).length,
  };
}
const yearOf = (subject) => curriculum.yearForSubject(subject);
// ConfigView's Start button passes only the count and the clock.
const CONFIG_START = { numQuestions: 20, timePerQ: 60 };

// ── EX-01 ─────────────────────────────────────────────────────────────
test('a written-only pick in English does not follow the student into COM IV', () => {
  const selectedYear = yearOf('com4');
  const unfiltered = configCount({ questionCategory: 'all', subject: 'com4', selectedYear });
  assert.ok(unfiltered > 0, 'COM IV should hold questions');
  const carried = configCount({ questionCategory: 'writing', subject: 'com4', selectedYear });
  assert.equal(carried, unfiltered,
    `COM IV printed ${carried} of its ${unfiltered} questions: the English filter is still applied, with no picker on screen`);
  const started = startPool({ state: { questionCategory: 'writing', subject: 'com4', selectedYear }, overrides: CONFIG_START });
  assert.equal(started.size, unfiltered, 'Start must serve the set the count printed');
});

test('no subject without a type picker is narrowed by a filter chosen elsewhere', () => {
  const subjects = [...new Set(QB.map((q) => q.subject))].filter((s) => s !== 'engprof');
  const narrowed = [];
  for (const subject of subjects) {
    const selectedYear = yearOf(subject);
    for (const questionCategory of ['writing', 'mcq']) {
      const want = configCount({ questionCategory: 'all', subject, selectedYear });
      const got = configCount({ questionCategory, subject, selectedYear });
      if (got !== want) narrowed.push(`${subject} ${questionCategory}: ${got}/${want}`);
    }
  }
  assert.deepEqual(narrowed, [], 'these subjects were filtered by a picker they never showed');
});

test('the sidebar Mock Exam after English serves the whole year', () => {
  // startMockExam resets subject, topic and mode, and nothing else.
  for (const selectedPhase of [null, '1-mid']) {
    const state = { questionCategory: 'writing', subject: 'all', practiceMode: 'all', selectedYear: 4, selectedPhase };
    const want = configCount({ ...state, questionCategory: 'all' });
    assert.ok(want > 0);
    assert.equal(configCount(state), want, `year-4 Mock (${selectedPhase ?? 'whole term'}) counted only written items`);
    assert.equal(startPool({ state, overrides: CONFIG_START }).size, want);
  }
});

test('the picker still works inside English, and the choice waits there', () => {
  const selectedYear = yearOf('engprof');
  const deliverable = QB.filter((q) => q.subject === 'engprof' && isQuestionDeliverable(q));
  const writtenCount = deliverable.filter((q) => catOf(q) === 'writing').length;
  const autoCount = deliverable.filter((q) => catOf(q) === 'mcq').length;
  assert.ok(writtenCount > 0 && autoCount > 0, 'English should hold both kinds');
  const all = configCount({ questionCategory: 'all', subject: 'engprof', selectedYear });

  const written = configCount({ questionCategory: 'writing', subject: 'engprof', selectedYear });
  assert.equal(written, writtenCount);
  assert.ok(written < all);
  assert.equal(configCount({ questionCategory: 'mcq', subject: 'engprof', selectedYear }), autoCount);
  const started = startPool({ state: { questionCategory: 'writing', subject: 'engprof', selectedYear }, overrides: CONFIG_START });
  assert.equal(started.category, 'writing');
  assert.equal(started.size, writtenCount);

  // English, somewhere else, English: the state is untouched, so the pick
  // is still selected and still applied when the student comes back.
  assert.equal(configCount({ questionCategory: 'writing', subject: 'com4', selectedYear: yearOf('com4') }),
    configCount({ questionCategory: 'all', subject: 'com4', selectedYear: yearOf('com4') }));
  assert.equal(configCount({ questionCategory: 'writing', subject: 'engprof', selectedYear }), writtenCount);
});

test('a caller that names a category keeps its exact pool', () => {
  // Home's planned practice asks for 'mcq'; lecturer cards ask for one
  // format each. None of them depends on what the picker holds.
  for (const wanted of ['mcq', 'writing', 'tf', 'match', 'mcq-only', 'all']) {
    for (const held of ['all', 'writing']) {
      const r = startPool({
        state: { questionCategory: held, subject: 'engprof', selectedYear: 4 },
        overrides: { subject: 'com4', topic: null, practiceMode: 'all', questionCategory: wanted },
      });
      assert.equal(r.category, wanted, `override ${wanted} (picker held ${held}) resolved to ${r.category}`);
    }
  }
});

test('startExam reads the subject it is starting, not the one on screen', () => {
  // A caller can pass a subject without a category while English (with a
  // written-only pick) is still the subject in state.
  const r = startPool({
    state: { questionCategory: 'writing', subject: 'engprof', selectedYear: yearOf('com4') },
    overrides: { subject: 'com4', topic: null },
  });
  assert.equal(r.category, 'all');
  assert.equal(r.size, configCount({ questionCategory: 'all', subject: 'com4', selectedYear: yearOf('com4') }));
});

test('the config screen shows the picker exactly where App applies it', () => {
  // One answer, computed once in App and handed to ConfigView, so the
  // screen and the pool cannot disagree about whether a filter is live.
  assert.match(APP, /showCategoryPicker=\{categoryPickerShown\(subject, practiceMode\)\}/,
    'App must hand ConfigView the same predicate it filters by');
  assert.ok(!/subject === 'engprof'/.test(CONFIG),
    'ConfigView must not keep a second copy of the picker rule');
  for (const subject of ['engprof', 'com4', 'all', null]) {
    for (const mode of ['all', 'bookmarks', 'weak', 'wrong', 'current-scope', 'predicted']) {
      assert.equal(appliedCategory('writing', subject, mode), categoryPickerShown(subject, mode) ? 'writing' : 'all',
        `${subject}/${mode}: the filter and the picker disagree`);
    }
  }
});

// ── EX-09 ─────────────────────────────────────────────────────────────
function chips() {
  const start = CONFIG.indexOf('const CATEGORIES = [');
  assert.ok(start >= 0, 'ConfigView no longer declares CATEGORIES');
  const src = CONFIG.slice(start + 'const CATEGORIES = '.length, CONFIG.indexOf('];', start) + 1);
  return vm.runInNewContext(`(${src})`);
}
function badgeNames() {
  const names = {};
  for (const m of QUESTION.matchAll(/currentQ\.type === '(\w+)' && '([^']+)'/g)) names[m[1]] = m[2];
  // Since UI-07 the exam card's meta row reads the names from one map.
  const map = QUESTION.match(/const TYPE_LABEL = (\{[\s\S]*?\});/);
  if (map) Object.assign(names, vm.runInNewContext(`(${map[1]})`));
  return names;
}

test('each type is named on the chip that actually serves it', () => {
  const byId = Object.fromEntries(chips().map((c) => [c.id, c]));
  const names = badgeNames();
  const types = ['fill', 'match', 'mcq', 'tf', 'short', 'essay'];
  for (const t of types) assert.ok(names[t], `the question badge has no name for ${t}`);
  for (const t of types) {
    const home = catOf({ type: t });
    assert.ok(byId[home], `no chip for category ${home}`);
    const text = (c) => `${c.label} ${c.desc}`;
    assert.ok(text(byId[home]).includes(names[t]),
      `${t} (${names[t]}) is served by the "${byId[home].label}" chip, which does not name it`);
    for (const other of ['mcq', 'writing'].filter((id) => id !== home)) {
      assert.ok(!text(byId[other]).includes(names[t]),
        `the "${byId[other].label}" chip names ${names[t]} but serves none of them`);
    }
  }
});

test('the chips use no middle dot', () => {
  for (const c of chips()) {
    assert.ok(!`${c.label}${c.desc}`.includes('·'), `chip ${c.id} uses a middle dot`);
  }
});

test('relabelling the chips left the filter itself alone', () => {
  // The two chips split the bank exactly as questionCategory() does: fill
  // under the written chip, matching under the auto-marked one.
  const deliverable = QB.filter(isQuestionDeliverable);
  const one = ['mcq', 'tf', 'match', 'fill', 'short', 'essay'].map((type) => {
    const found = deliverable.find((q) => q.type === type);
    assert.ok(found, `the bank holds no deliverable ${type} item`);
    return found;
  });
  const served = (questionCategory) => buildExamPool({
    questions: one, practiceMode: 'bookmarks', bookmarks: one.map((q) => q.id), questionCategory,
  }).map((q) => q.type).sort();
  assert.deepEqual(served('all').length, one.length);
  assert.deepEqual(served('mcq'), one.filter((q) => catOf(q) === 'mcq').map((q) => q.type).sort());
  assert.deepEqual(served('writing'), one.filter((q) => catOf(q) === 'writing').map((q) => q.type).sort());
  assert.ok(served('writing').includes('fill') && served('mcq').includes('match'));
  assert.ok(!read('src/lib/exam-pool.js').includes('MCQ + T/F + fill'), 'the comment still says fill sits with MCQ');
});
