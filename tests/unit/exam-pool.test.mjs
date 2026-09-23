// ============================================================
// exam-pool.test.mjs — the one pool definition, called directly
// ============================================================
// buildExamPool decides which questions a student is served, and the config
// screen prints its length as the count. It used to live inside App.jsx, where
// the only way to test it was to slice the source text and look for the right
// lines. These tests call it on small fixture banks instead, so each check
// fails on what a student would be served, not on where the code sits.
//
// The fixtures use real subject ids: the pool reads the curriculum (which year
// and term a subject belongs to, which topics are hidden) and the exam-scope
// resolver, and a made-up subject would skip exactly the code under test. Each
// fixture's premise is asserted before it is used, so a curriculum change that
// removes the premise fails loudly instead of letting the test pass vacuously.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildExamPool,
  normalizePracticeMode,
  categoryPickerShown,
  appliedCategory,
  USER_CURATED_MODES,
} from '../../src/lib/exam-pool.js';
import { SUBJECTS, semesterForSubject, yearForSubject, hiddenTopicIdsFor } from '../../src/data/curriculum.js';
import { scopeOfQuestion } from '../../src/lib/exam-scope.js';
import { BLOCKED_QUESTIONS } from '../../src/data/question-delivery.generated.js';
import { SEMESTER } from '../../src/data/semester.js';
import { isCurrentScopeQuestion, isHighPredictionQuestion } from '../../src/lib/question-prediction.js';

let nextId = 900_000;
const q = (subject, extra = {}) => ({
  id: nextId++, subject, topic: 'fixture-topic', type: 'mcq', q: 'fixture', options: ['a', 'b'], answer: 0, ...extra,
});
const keys = (pool) => pool.map((x) => `${x.subject}:${x.id}`);
const ids = (pool) => pool.map((x) => x.id);
const build = (args) => buildExamPool({ practiceMode: 'all', subject: 'all', topic: null, questionCategory: 'all', ...args });

// ── Premises the fixtures rest on ──────────────────────────────────────
test('the fixture subjects still sit where the tests assume', () => {
  assert.equal(yearForSubject('equine-medicine'), 5);
  assert.equal(semesterForSubject('equine-medicine'), 1);
  assert.equal(semesterForSubject('zoonoses'), 1);
  assert.equal(semesterForSubject('ruminant-clinical'), 2);
  assert.equal(yearForSubject('ruminant-clinical'), 5);
  assert.equal(semesterForSubject('vca'), 0, 'vca runs all year');
  assert.equal(yearForSubject('biochem-1'), 1);
  assert.equal(semesterForSubject('biochem-1'), 2);
  assert.ok(hiddenTopicIdsFor('poultry').has('physiology'));
  assert.ok(hiddenTopicIdsFor('exotic').has('rabbit'));
  assert.equal(yearForSubject('poultry'), 4);
  // An unknown topic in these subjects has no scope of its own, so the
  // question's own examScope decides which paper it sits.
  for (const subject of ['equine-medicine', 'zoonoses', 'ruminant-clinical', 'vca', 'biochem-1']) {
    assert.equal(scopeOfQuestion(q(subject)), null, `${subject} now settles fixture topics by itself`);
    assert.equal(scopeOfQuestion(q(subject, { examScope: 'final' })), 'final');
  }
});

// ── Which mode is in force ─────────────────────────────────────────────
test('a named subject drops a sticky curated mode unless the caller asked for it', () => {
  for (const mode of ['bookmarks', 'weak', 'wrong']) {
    assert.ok(USER_CURATED_MODES.has(mode));
    assert.equal(normalizePracticeMode(mode, 'com4', false), 'all', `${mode} bled into COM IV`);
    assert.equal(normalizePracticeMode(mode, 'com4', true), mode, 'an explicit caller keeps its mode');
    assert.equal(normalizePracticeMode(mode, 'all', false), mode, 'across all subjects the mode stands');
    assert.equal(normalizePracticeMode(mode, null, false), mode);
  }
  for (const mode of ['all', 'current-scope', 'predicted']) {
    assert.equal(normalizePracticeMode(mode, 'com4', false), mode);
  }
});

test('the type filter applies only where its picker is on screen', () => {
  for (const subject of ['engprof', 'com4', 'all', null]) {
    for (const mode of ['all', 'bookmarks', 'weak', 'wrong', 'current-scope', 'predicted']) {
      const shown = subject === 'engprof' && mode !== 'bookmarks' && mode !== 'weak';
      assert.equal(categoryPickerShown(subject, mode), shown, `${subject}/${mode}`);
      assert.equal(appliedCategory('writing', subject, mode), shown ? 'writing' : 'all', `${subject}/${mode}`);
    }
  }
});

// ── The delivery gate ──────────────────────────────────────────────────
test('a blocked question is never served, in any mode', () => {
  const [subject, rawId] = BLOCKED_QUESTIONS[0].key.split(':');
  const blocked = { ...q(subject), id: Number(rawId) };
  const open = q(subject);
  const questions = [blocked, open];
  const year = yearForSubject(subject);
  const history = [{ subject, questionId: blocked.id, correct: false, date: 1 }];
  const pools = {
    all: build({ questions, subject, selectedYear: year }),
    allSubjects: build({ questions, selectedYear: year }),
    bookmarks: build({ questions, practiceMode: 'bookmarks', bookmarks: [blocked.id, open.id], selectedYear: year }),
    weak: build({ questions, practiceMode: 'weak', weakQuestions: [blocked.id, open.id], selectedYear: year }),
    wrong: build({ questions, practiceMode: 'wrong', history, selectedYear: year }),
  };
  for (const [name, pool] of Object.entries(pools)) {
    assert.ok(!ids(pool).includes(blocked.id), `${name} served a blocked question`);
  }
  assert.deepEqual(ids(pools.all), [open.id], 'the open question next to it still comes through');
});

// ── The curated modes ──────────────────────────────────────────────────
test('bookmarks serve exactly the bookmarked questions', () => {
  const a = q('equine-medicine');
  const b = q('com4');
  const c = q('zoonoses');
  const pool = build({ questions: [a, b, c], practiceMode: 'bookmarks', bookmarks: [c.id, a.id], selectedYear: 5 });
  assert.deepEqual(new Set(ids(pool)), new Set([a.id, c.id]));
});

test('the weak set is this year\'s, in the most-missed order it was ranked in', () => {
  const first = q('equine-medicine', { year: 5 });
  const second = q('zoonoses');
  const otherYear = q('com4', { year: 4 });
  const pool = build({
    questions: [first, second, otherYear],
    practiceMode: 'weak',
    weakQuestions: [second.id, otherYear.id, first.id],
    selectedYear: 5,
  });
  assert.deepEqual(ids(pool), [second.id, first.id],
    'bank order instead of rank order, or another year\'s question in this year\'s count');
});

test('the wrong-answer set holds what is still wrong, most missed first', () => {
  const once = q('equine-medicine');
  const thrice = q('zoonoses');
  const learnt = q('ruminant-clinical');
  // Same id, another subject: ids collide across banks.
  const namesake = { ...q('com4', { year: 4 }), id: thrice.id };
  const miss = (x, date) => ({ subject: x.subject, questionId: x.id, correct: false, date });
  const history = [
    miss(once, 1), miss(thrice, 2), miss(thrice, 3), miss(thrice, 4),
    miss(learnt, 5), { subject: learnt.subject, questionId: learnt.id, correct: true, date: 6 },
  ];
  const pool = build({ questions: [once, learnt, namesake, thrice], practiceMode: 'wrong', history, selectedYear: 5 });
  assert.deepEqual(keys(pool), [`zoonoses:${thrice.id}`, `equine-medicine:${once.id}`],
    'a question answered right since came back, the order is not most-missed, or a namesake leaked in');
});

test('the wrong-answer set is year-scoped like the chip that counts it', () => {
  const thisYear = q('equine-medicine', { year: 5 });
  const lastYear = q('com4', { year: 4 });
  const history = [thisYear, lastYear].map((x, i) => ({ subject: x.subject, questionId: x.id, correct: false, date: i }));
  const pool = build({ questions: [thisYear, lastYear], practiceMode: 'wrong', history, selectedYear: 5 });
  assert.deepEqual(ids(pool), [thisYear.id]);
});

// ── Ordinary practice: subject, topic, hidden topics ──────────────────
test('a named subject serves that subject and none of its hidden topics', () => {
  const shown = q('poultry', { topic: 'avian-fixture' });
  const hidden = q('poultry', { topic: 'physiology' });
  const other = q('exotic');
  const pool = build({ questions: [shown, hidden, other], subject: 'poultry', selectedYear: 4 });
  assert.deepEqual(ids(pool), [shown.id]);
});

test('a named topic serves that topic, and a collection serves its prefix', () => {
  const inTopic = q('poultry', { topic: 'avian-fixture' });
  const elsewhere = q('poultry', { topic: 'avian-other' });
  assert.deepEqual(ids(build({ questions: [inTopic, elsewhere], subject: 'poultry', topic: 'avian-fixture', selectedYear: 4 })),
    [inTopic.id]);

  // '_termpaper-all' reads its topic prefix from the curriculum ('group'),
  // not from its own id.
  const collection = SUBJECTS.find((s) => s.id === 'repro-lect')?.collections?.find((c) => c.id === '_termpaper-all');
  assert.equal(collection?.topicPrefix, 'group', 'the fixture collection moved');
  const grouped = q('repro-lect', { topic: 'group-3' });
  const namedLikeId = q('repro-lect', { topic: 'termpaper-3' });
  assert.deepEqual(ids(build({ questions: [grouped, namedLikeId], subject: 'repro-lect', topic: '_termpaper-all', selectedYear: 4 })),
    [grouped.id]);
  // Without a curriculum entry the prefix falls back to the id.
  const mahahon = q('poultry', { topic: 'mahahon-poultry-2' });
  assert.deepEqual(ids(build({ questions: [mahahon, inTopic], subject: 'poultry', topic: '_mahahon-poultry-all', selectedYear: 4 })),
    [mahahon.id]);
});

test('across all subjects, the year is the selected one and hidden topics stay hidden', () => {
  const shown = q('poultry', { topic: 'avian-fixture' });
  const hiddenPoultry = q('poultry', { topic: 'physiology' });
  const hiddenExotic = q('exotic', { topic: 'rabbit' });
  const shownExotic = q('exotic', { topic: 'exotic-fixture' });
  const year5 = q('equine-medicine');
  const taggedOtherYear = q('com4', { year: 5 });
  const pool = build({ questions: [shown, hiddenPoultry, hiddenExotic, shownExotic, year5, taggedOtherYear], selectedYear: 4 });
  assert.deepEqual(new Set(ids(pool)), new Set([shown.id, shownExotic.id]));
});

test('the hidden-topic set is looked up once per subject, not once per question', () => {
  // hiddenTopicIdsFor walks SUBJECTS with find() and builds a fresh Set on
  // every call; per question that is 2,000 walks on a whole-year pool.
  const questions = [];
  for (let i = 0; i < 300; i++) questions.push(q(['poultry', 'exotic', 'com4'][i % 3], { topic: `t-${i % 7}` }));
  const realFind = SUBJECTS.find;
  let calls = 0;
  SUBJECTS.find = function countedFind(...args) { calls += 1; return realFind.apply(this, args); };
  let pool;
  try {
    pool = build({ questions, selectedYear: 4 });
  } finally {
    delete SUBJECTS.find;
  }
  assert.equal(SUBJECTS.find, realFind, 'the probe must leave SUBJECTS as it found it');
  assert.equal(pool.length, 300);
  assert.ok(calls <= 3, `the curriculum was searched ${calls} times for a 300-question, 3-subject pool`);
});

// ── The term the student picked ────────────────────────────────────────
test('across all subjects, the phase narrows the pool to its term and to year-long courses', () => {
  const term1 = q('equine-medicine');
  const term2 = q('ruminant-clinical');
  const yearLong = q('vca');
  const questions = [term1, term2, yearLong];
  assert.deepEqual(new Set(ids(build({ questions, selectedYear: 5, selectedPhase: '1-mid' }))), new Set([term1.id, yearLong.id]));
  assert.deepEqual(new Set(ids(build({ questions, selectedYear: 5, selectedPhase: '1-final' }))), new Set([term1.id, yearLong.id]));
  assert.deepEqual(new Set(ids(build({ questions, selectedYear: 5, selectedPhase: '2-mid' }))), new Set([term2.id, yearLong.id]));
  assert.equal(build({ questions, selectedYear: 5, selectedPhase: null }).length, 3, 'no phase, no term filter');
});

test('a subject the student named is not narrowed away by the term', () => {
  const term2 = q('ruminant-clinical');
  assert.deepEqual(ids(build({ questions: [term2], subject: 'ruminant-clinical', selectedYear: 5, selectedPhase: '1-mid' })), [term2.id]);
});

test('the term narrows a year and never empties one', () => {
  // Year 1 holds questions only in a term-2 subject here, as years 1 and 3 do
  // in the real bank. A term-1 phase would filter every one of them away while
  // the year card still advertised them.
  const onlyTerm2 = [q('biochem-1'), q('biochem-1')];
  assert.deepEqual(new Set(ids(build({ questions: onlyTerm2, selectedYear: 1, selectedPhase: '1-mid' }))), new Set(ids(onlyTerm2)));
});

// ── The paper the student picked ───────────────────────────────────────
test('across all subjects, the other paper\'s content is dropped and unknown is kept', () => {
  const mid = q('equine-medicine', { examScope: 'midterm' });
  const fin = q('equine-medicine', { examScope: 'final' });
  const both = q('zoonoses', { examScope: 'both' });
  const unknown = q('zoonoses');
  const noPaper = q('zoonoses', { examScope: 'continuous' });
  const questions = [mid, fin, both, unknown, noPaper];
  assert.deepEqual(new Set(ids(build({ questions, selectedYear: 5, selectedPhase: '1-mid' }))), new Set([mid.id, both.id, unknown.id]));
  assert.deepEqual(new Set(ids(build({ questions, selectedYear: 5, selectedPhase: '1-final' }))), new Set([fin.id, both.id, unknown.id]));
});

test('a named subject or topic gets its content back rather than nothing', () => {
  const finals = [q('equine-medicine', { examScope: 'final' }), q('equine-medicine', { examScope: 'final' })];
  assert.deepEqual(new Set(ids(build({ questions: finals, subject: 'equine-medicine', selectedYear: 5, selectedPhase: '1-mid' }))),
    new Set(ids(finals)), 'a student who named the subject was refused it');
  assert.deepEqual(new Set(ids(build({ questions: finals, subject: 'equine-medicine', topic: 'fixture-topic', selectedYear: 5, selectedPhase: '1-mid' }))),
    new Set(ids(finals)), 'a student who named the topic was refused it');
  // Across a whole year nothing was named, so the other paper is not handed back.
  assert.deepEqual(build({ questions: finals, selectedYear: 5, selectedPhase: '1-mid' }), []);
  // ...and when the subject does hold this paper, the other paper stays out.
  const mid = q('equine-medicine', { examScope: 'midterm' });
  assert.deepEqual(ids(build({ questions: [...finals, mid], subject: 'equine-medicine', selectedYear: 5, selectedPhase: '1-mid' })), [mid.id]);
});

test('the curated modes are not narrowed by the paper', () => {
  const fin = q('equine-medicine', { examScope: 'final' });
  const pool = build({ questions: [fin], practiceMode: 'weak', weakQuestions: [fin.id], selectedYear: 5, selectedPhase: '1-mid' });
  assert.deepEqual(ids(pool), [fin.id]);
});

// ── Home's current-scope and predicted sets ────────────────────────────
test('the current-scope and predicted sets serve only what their metadata vouches for', () => {
  // Home launches both. Each is a filter on top of ordinary practice, so
  // without it the student is handed every question in the subject under a
  // label that promises checked answers from this term's slides.
  const vouched = (extra = {}) => q('equine-medicine', {
    answerStatus: 'verified', curriculumVersion: SEMESTER.id, examScope: 'midterm', sourceType: 'lecture-derived',
    predictionTier: 'medium', predictionSignals: ['current-lecture'], ...extra,
  });
  const high = vouched({
    predictionTier: 'high', predictionSignals: ['current-lecture', 'senior-recurrence'],
    predictionEvidence: ['current lecture slides', 'recurs across senior papers'],
  });
  const medium = vouched();
  const unchecked = vouched({ answerStatus: 'needs-review' });
  const otherTerm = vouched({ curriculumVersion: '2568-2' });
  const plain = q('equine-medicine', { examScope: 'midterm' });
  // The term the curriculum is on now, so the test follows SEMESTER forward.
  const term = SEMESTER.id.split('-')[1];
  const mid = `${term}-mid`;
  const phase = { curriculumVersion: SEMESTER.id, selectedPhase: mid };
  assert.ok(isCurrentScopeQuestion(high, phase) && isCurrentScopeQuestion(medium, phase), 'the vouched fixtures lost a field');
  assert.ok(isHighPredictionQuestion(high, phase) && !isHighPredictionQuestion(medium, phase));

  const args = { questions: [high, medium, unchecked, otherTerm, plain], subject: 'equine-medicine', selectedYear: 5, selectedPhase: mid };
  assert.deepEqual(new Set(ids(build({ ...args, practiceMode: 'current-scope' }))), new Set([high.id, medium.id]),
    'current-scope served an unchecked, other-term or unlabelled question');
  assert.deepEqual(ids(build({ ...args, practiceMode: 'predicted' })), [high.id], 'predicted served below the high tier');
  assert.equal(build({ ...args, practiceMode: 'all' }).length, 5, 'ordinary practice is not narrowed by the metadata');

  // The paper is part of the promise. A final-paper item stays out of the
  // midterm set even for a named subject, where the never-empty guard would
  // otherwise hand it back.
  const finalOnly = vouched({ examScope: 'final' });
  const named = { questions: [finalOnly], subject: 'equine-medicine', selectedYear: 5, practiceMode: 'current-scope' };
  assert.deepEqual(build({ ...named, selectedPhase: mid }), [], 'a final-paper item was served as midterm scope');
  assert.deepEqual(ids(build({ ...named, selectedPhase: `${term}-final` })), [finalOnly.id]);
});

// ── A lecturer's part, past papers, formats, exclusions ───────────────
test('a lecturer\'s topics include a printed set filed under another of its diseases', () => {
  const inPart = q('avian-medicine', { topic: 'avian-a' });
  const bankSet = q('avian-medicine', { topic: 'avian-z', type: 'match', topics: ['avian-z', 'avian-b'] });
  const outside = q('avian-medicine', { topic: 'avian-c' });
  const pool = build({ questions: [inPart, bankSet, outside], subject: 'avian-medicine', selectedYear: 5, onlyTopics: new Set(['avian-a', 'avian-b']) });
  assert.deepEqual(ids(pool), [inPart.id, bankSet.id]);
});

test('ฝึกเฉพาะข้อสอบเก่า serves past papers only', () => {
  const paper = q('avian-medicine', { sourceType: 'past-paper' });
  const lecture = q('avian-medicine', { sourceType: 'lecture-derived' });
  assert.deepEqual(ids(build({ questions: [paper, lecture], subject: 'avian-medicine', selectedYear: 5, onlyPastPaper: true })), [paper.id]);
});

test('each format filter serves exactly its types', () => {
  const byType = Object.fromEntries(['mcq', 'tf', 'match', 'fill', 'short', 'essay'].map((type) => [type, q('equine-medicine', { type })]));
  const questions = Object.values(byType);
  const served = (questionCategory) => build({ questions, subject: 'equine-medicine', selectedYear: 5, questionCategory })
    .map((x) => x.type).sort();
  // 'mcq' is everything marked automatically; fill-in is typed, so it is written.
  assert.deepEqual(served('mcq'), ['match', 'mcq', 'tf']);
  assert.deepEqual(served('writing'), ['essay', 'fill', 'short']);
  assert.deepEqual(served('tf'), ['tf']);
  assert.deepEqual(served('match'), ['match']);
  assert.deepEqual(served('mcq-only'), ['mcq']);
  assert.equal(served('all').length, 6);
});

test('"more questions" leaves out the ones just answered, by subject and id', () => {
  const answered = q('equine-medicine');
  const namesake = { ...q('zoonoses'), id: answered.id };
  const fresh = q('equine-medicine');
  const pool = build({ questions: [answered, namesake, fresh], selectedYear: 5, excludeIds: new Set([`equine-medicine:${answered.id}`]) });
  assert.deepEqual(keys(pool), [`zoonoses:${answered.id}`, `equine-medicine:${fresh.id}`]);
});
