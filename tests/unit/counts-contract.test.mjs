// ============================================================
// counts-contract.test.mjs: every number beside a practice button is the set
// that button serves, for every course, year and period
// ============================================================
// Palm, 1 Nov 2026: "อยากให้ดูพวกตัวเลขที่แสดงผลต่างๆของระบบด้วย ดูให้มันสอดคล้อง
// กัน ตรงกัน ไม่มีจุดผิดเพี้ยนหรือแปลกๆ ต้องmake sense".
//
// The screens print numbers from the generated tables (q-counts.js and
// q-kind-counts.generated.js) so the home screen never loads the bank. The set
// a tap opens is built by buildExamPool from the bank itself. This loads the
// real bank, the real tables and the real selectors, and holds the two
// together: a card, a topic, a year, past papers, Panic, the current-term sets
// and the wrong-answer chip. It also holds the sums: topics add up to their
// subject, the two papers reconcile with the subject's split, and no table
// prints a negative count, a fraction, or a ratio above one.
//
// What each screen prints, and which lookup this test mirrors:
//   Home and the subject list: the subject card, Q_VISIBLE_COUNTS_BY_SUBJECT
//     _BY_SCOPE[phase] (whole subject with no period), for the period's term.
//   The topic screen: รวมทุกหัวข้อ, each listed topic and collection, the
//     ข้อสอบเก่า X/Y chip, and the Panic card, under phaseForCourse.
//   The year card รวมทุกวิชา: Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE.
//   Home's ตามสไลด์ปัจจุบัน and ชุดน่าจะออก: Q_CURRENT_SCOPE_COUNTS and
//     Q_HIGH_PREDICTION_COUNTS summed over the period's subjects.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { QB, loadQB } from '../../src/data/questions.js';
import * as C from '../../src/data/q-counts.js';
import { Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE } from '../../src/data/q-kind-counts.generated.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, yearForSubject, hiddenTopicIdsFor } from '../../src/data/curriculum.js';
import { SEMESTER } from '../../src/data/semester.js';
import { isQuestionDeliverable, BLOCKED_QUESTIONS } from '../../src/data/question-delivery.generated.js';
import { PANIC_CARD_PAPERS, hasPanicCard } from '../../src/data/panic-cards.js';
import { buildExamPool, stillWrongInYear, wrongChip, WEAK_POOL_CAP } from '../../src/lib/exam-pool.js';
import { panicPool, isPastPaperQuestion } from '../../src/lib/question-metadata.js';
import { phaseForCourse, scopeForPhase, topicOnPaper, countByScope } from '../../src/lib/exam-scope.js';
import { examScopeForPhase } from '../../src/lib/question-prediction.js';
import { createStudyCatalog } from '../../src/lib/study-catalog.js';

await loadQB();

const PHASES = [null, '1-mid', '1-final', '2-mid', '2-final'];
const PHASE_TERM = { '1-mid': 1, '1-final': 1, '2-mid': 2, '2-final': 2 };
const YEARS = Object.keys(SUBJECTS_BY_YEAR).map(Number).filter(Number.isFinite);
const catalog = createStudyCatalog();
const sum = (obj) => Object.values(obj || {}).reduce((a, b) => a + b, 0);

// buildExamPool filters a named subject by q.subject and a year by the
// subject's year first, so handing it just those questions is the same set,
// fifty times faster across the whole matrix.
const bySubject = new Map();
const byYear = new Map();
for (const q of QB) {
  if (!bySubject.has(q.subject)) bySubject.set(q.subject, []);
  bySubject.get(q.subject).push(q);
  const y = yearForSubject(q.subject);
  if (!byYear.has(y)) byYear.set(y, []);
  byYear.get(y).push(q);
}
const served = (args) => buildExamPool({
  practiceMode: 'all', topic: null, questionCategory: 'all',
  bookmarks: [], weakQuestions: [], history: [],
  ...args,
  questions: args.subject === 'all' ? (byYear.get(args.selectedYear) || []) : (bySubject.get(args.subject) || []),
});

// The courses of a year, each once, with what its own year's period makes of it.
function coursesOf(year) {
  return (SUBJECTS_BY_YEAR[year] || []).filter((s) => s?.id && yearForSubject(s.id) === year);
}
const inTerm = (s, phase) => !phase || s.semester == null || s.semester === 0 || s.semester === PHASE_TERM[phase];
const subjectCard = (id, phase) => (phase
  ? (C.Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE[phase]?.[id] || 0)
  : (C.Q_VISIBLE_COUNTS_BY_SUBJECT[id] || 0));

// The topic screen's lookups, as TopicSelectView makes them.
function topicScreen(subjectId, year, phase) {
  const coursePhase = phaseForCourse(subjectId, year, phase);
  const page = catalog.browse({ subject: subjectId });
  const scoped = coursePhase ? (C.Q_COUNTS_BY_TOPIC_BY_SCOPE[coursePhase]?.[subjectId] || {}) : null;
  const scopedPast = coursePhase ? (C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[coursePhase]?.[subjectId] || {}) : null;
  const topics = (page.topics || []).filter((t) => topicOnPaper(subjectId, t.id, coursePhase));
  const countFor = (topicId) => {
    if (topicId === 'all') return scoped ? sum(scoped) : (page.resources?.questions?.count || 0);
    const coll = (page.collections || []).find((c) => c.id === topicId);
    if (coll) {
      if (!scoped) return coll.questionCount || 0;
      const prefix = coll.topicPrefix || String(coll.id).replace(/^_|-all$/g, '');
      return Object.entries(scoped).filter(([id]) => id.startsWith(prefix)).reduce((a, [, n]) => a + n, 0);
    }
    if (scoped) return scoped[topicId] || 0;
    return topics.find((t) => t.id === topicId)?.questionCount || 0;
  };
  const pastFor = (topicId) => (scopedPast ? (scopedPast[topicId] || 0) : (topics.find((t) => t.id === topicId)?.pastPaperCount || 0));
  return { coursePhase, page, topics, countFor, pastFor };
}

test('a subject card prints what its card serves, for every course, year and period', () => {
  const wrong = [];
  for (const year of YEARS) {
    for (const phase of PHASES) {
      for (const s of coursesOf(year)) {
        if (!inTerm(s, phase)) continue; // Home lists only the period's term
        const card = subjectCard(s.id, phase);
        const set = served({ subject: s.id, selectedYear: year, selectedPhase: phase }).length;
        if (card > 0 && card !== set) wrong.push(`${s.id} year ${year} ${phase || 'no period'}: card ${card}, set ${set}`);
        // A zero on the card (the set behind it would be the never-empty
        // fallback to the other paper) must agree with the topic screen: it
        // lists no topic with questions, only ones still waiting for them.
        if (card === 0 && set > 0) {
          const filled = topicScreen(s.id, year, phase).topics.filter((t) => (C.Q_COUNTS_BY_TOPIC[s.id]?.[t.id] || 0) > 0);
          if (filled.length) wrong.push(`${s.id} year ${year} ${phase}: card 0 but the topic screen lists ${filled.map((t) => t.id).slice(0, 3).join(', ')}`);
        }
      }
    }
  }
  assert.deepEqual(wrong, []);
});

test('every topic the topic screen lists prints what its button serves', () => {
  const wrong = [];
  for (const year of YEARS) {
    for (const phase of PHASES) {
      for (const s of coursesOf(year)) {
        const screen = topicScreen(s.id, year, phase);
        const all = screen.countFor('all');
        const allSet = served({ subject: s.id, selectedYear: year, selectedPhase: phase }).length;
        if (all > 0 && all !== allSet) wrong.push(`${s.id} y${year} ${phase}: รวมทุกหัวข้อ ${all}, set ${allSet}`);
        for (const t of screen.topics) {
          const card = screen.countFor(t.id);
          const pool = served({ subject: s.id, topic: t.id, selectedYear: year, selectedPhase: phase });
          // A listed topic with questions behind it never says รอเนื้อหาเพิ่ม.
          if (card === 0 && (C.Q_COUNTS_BY_TOPIC[s.id]?.[t.id] || 0) > 0) {
            wrong.push(`${s.id}/${t.id} y${year} ${phase}: listed with 0 over a topic that has questions`);
          }
          if (card > 0 && card !== pool.length) wrong.push(`${s.id}/${t.id} y${year} ${phase}: card ${card}, set ${pool.length}`);
          const past = screen.pastFor(t.id);
          const pastSet = pool.filter(isPastPaperQuestion).length;
          if (card > 0 && past !== pastSet) wrong.push(`${s.id}/${t.id} y${year} ${phase}: ข้อสอบเก่า ${past}, past papers served ${pastSet}`);
          if (past > card) wrong.push(`${s.id}/${t.id} y${year} ${phase}: ข้อสอบเก่า ${past}/${card} is above 100%`);
        }
        for (const coll of screen.page.collections || []) {
          const card = screen.countFor(coll.id);
          const set = served({ subject: s.id, topic: coll.id, selectedYear: year, selectedPhase: phase }).length;
          if (card > 0 && card !== set) wrong.push(`${s.id}/${coll.id} y${year} ${phase}: card ${card}, set ${set}`);
        }
      }
    }
  }
  assert.deepEqual(wrong, []);
});

test('a course of the other term lists no topic under the period, as its card says', () => {
  // COM V is a year-4 term-2 course. Under เทอม 1 its card says ไม่อยู่ในช่วงสอบนี้,
  // and its topic screen listed every topic over a count of 0, each saying
  // รอเนื้อหาเพิ่ม above questions the bank holds for term 2.
  assert.equal(topicScreen('com5', 4, '1-final').topics.length, 0);
  assert.ok(topicScreen('com5', 4, '2-final').topics.length > 0);
  assert.ok(topicScreen('com5', 5, '1-final').topics.length > 0, 'another year\'s course is studied whole');
  // A course that sits only the final lists nothing under กลางภาค, whether or
  // not each topic names its paper: English for Vet Profession I's name none.
  assert.equal(topicScreen('engprof1', 4, '1-mid').topics.length, 0);
  assert.ok(topicScreen('engprof1', 4, '1-final').topics.length > 0);
});

test('the topic screen, Home and the reading list ask one predicate which topics are on a paper', () => {
  const read = (path) => readFileSync(new URL(`../../src/${path}`, import.meta.url), 'utf8');
  assert.match(read('views/TopicSelectView.jsx'), /\.filter\(\(t\) => topicOnPaper\(subject, t\?\.id, selectedPhase\)\)/);
  assert.match(read('views/HomeView.jsx'), /!t\.hidden && topicOnPaper\(s\.id, t\.id, selectedPhase\)/);
  assert.match(read('views/ReadingChecklistView.jsx'), /topicOnPaper\(s\.id, t\.id, selectedPhase\)/);
  // A card says ไม่อยู่ในช่วงสอบนี้ only when the paper holds none of the
  // course; topics on the paper with no questions yet read ยังไม่มีชุดข้อสอบ.
  const noTopicOnPaper = /!\(s\.topics \|\| \[\]\)\.some\(\(t\) => !t\.hidden && topicOnPaper\(s\.id, t\.id, selectedPhase\)\)/;
  assert.match(read('views/HomeView.jsx'), noTopicOnPaper);
  assert.match(read('views/SubjectSelectView.jsx'), noTopicOnPaper);
  // The topic screen's อ่านแล้ว X/Y counts X over the Y topics it lists; the
  // catalog's figure spans both papers and printed 10/5.
  const topicView = read('views/TopicSelectView.jsx');
  assert.match(topicView, /const subjReadDone = topics\.filter\(\(t\) => t\.read\)\.length;/);
  assert.doesNotMatch(topicView, /subjectPage\.progress\?\.read/);
});

test('the year card prints what รวมทุกวิชา serves, under every period', () => {
  const wrong = [];
  for (const year of YEARS) {
    for (const phase of PHASES) {
      const card = phase ? (C.Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE[phase]?.[year] || 0) : (C.Q_VISIBLE_COUNTS_BY_YEAR[year] || 0);
      const set = served({ subject: 'all', selectedYear: year, selectedPhase: phase }).length;
      if (card !== set) wrong.push(`year ${year} ${phase || 'no period'}: card ${card}, set ${set}`);
    }
  }
  assert.deepEqual(wrong, []);
});

test('the topics of a subject add up to its card, less only the questions filed under no topic', () => {
  // Questions with no curriculum topic still count in the subject (they are in
  // รวมทุกหัวข้อ) but no topic card can show them. That is a data gap, held to
  // the subjects that have it today, and the list may only shrink.
  const UNFILED = { surg2: 9, surg3: 8, repro: 19, com4: 4 };
  const wrong = [];
  const unfiled = {};
  for (const s of SUBJECTS) {
    if (!s?.id) continue;
    const hidden = hiddenTopicIdsFor(s.id);
    const topicIds = new Set((s.topics || []).map((t) => t.id));
    const visible = (bySubject.get(s.id) || []).filter((q) => isQuestionDeliverable(q) && !hidden.has(q.topic));
    const orphans = visible.filter((q) => !q.topic || !topicIds.has(q.topic)).length;
    if (orphans) unfiled[s.id] = orphans;
    const topicSum = (s.topics || []).filter((t) => !t.hidden).reduce((n, t) => n + (C.Q_COUNTS_BY_TOPIC[s.id]?.[t.id] || 0), 0);
    if (topicSum + orphans !== (C.Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0)) {
      wrong.push(`${s.id}: topics ${topicSum} + unfiled ${orphans} != subject ${C.Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0}`);
    }
    for (const phase of PHASES.slice(1)) {
      if (!inTerm(s, phase)) continue;
      const scoped = C.Q_COUNTS_BY_TOPIC_BY_SCOPE[phase]?.[s.id] || {};
      const listedSum = (s.topics || []).filter((t) => !t.hidden && topicOnPaper(s.id, t.id, phase)).reduce((n, t) => n + (scoped[t.id] || 0), 0);
      const unfiledOnPaper = Object.entries(scoped).filter(([id]) => !topicIds.has(id)).reduce((n, [, c]) => n + c, 0);
      if (listedSum + unfiledOnPaper !== subjectCard(s.id, phase)) {
        wrong.push(`${s.id} ${phase}: listed topics ${listedSum} + unfiled ${unfiledOnPaper} != card ${subjectCard(s.id, phase)}`);
      }
    }
  }
  assert.deepEqual(wrong, []);
  for (const [id, n] of Object.entries(unfiled)) {
    assert.ok(n <= (UNFILED[id] || 0), `${id}: ${n} questions filed under no topic (allowed ${UNFILED[id] || 0}); file them, never raise this`);
  }
});

test('the two papers reconcile with each subject\'s split', () => {
  // Under a paper a subject keeps its own paper's questions, the ones on both,
  // and the ones whose paper nobody recorded (unknown is never filtered out);
  // a course with no written paper sits neither.
  const wrong = [];
  for (const s of SUBJECTS) {
    if (!s?.id) continue;
    const hidden = hiddenTopicIdsFor(s.id);
    const visible = (bySubject.get(s.id) || []).filter((q) => isQuestionDeliverable(q) && !hidden.has(q.topic));
    if (!visible.length) continue;
    const t = countByScope(visible);
    if (visible.length !== t.midterm + t.final + t.both + t.continuous + t.unknown) wrong.push(`${s.id}: the split does not add up`);
    const term = s.semester === 2 ? 2 : 1;
    const mid = subjectCard(s.id, `${term}-mid`);
    const fin = subjectCard(s.id, `${term}-final`);
    if (mid !== t.midterm + t.both + t.unknown) wrong.push(`${s.id}: midterm card ${mid}, split ${t.midterm}+${t.both}+${t.unknown}`);
    if (fin !== t.final + t.both + t.unknown) wrong.push(`${s.id}: final card ${fin}, split ${t.final}+${t.both}+${t.unknown}`);
    if (visible.length !== subjectCard(s.id, null)) wrong.push(`${s.id}: whole card ${subjectCard(s.id, null)}, visible ${visible.length}`);
  }
  assert.deepEqual(wrong, []);
});

test('every Panic card prints what its session serves, and Panic is a part of the subject', () => {
  const wrong = [];
  let checked = 0;
  for (const yearKey of Object.values(PANIC_CARD_PAPERS)) {
    for (const [year, papers] of Object.entries(yearKey)) {
      for (const phase of Object.keys(papers)) {
        for (const subject of papers[phase].cards || []) {
          if (!hasPanicCard(subject, Number(year), phase)) continue;
          // TopicSelectView: the paper's count, else the subject's, else รวมทุกหัวข้อ.
          const coursePhase = phaseForCourse(subject, Number(year), phase);
          const paper = scopeForPhase(coursePhase);
          const scopedCount = paper ? C.Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE[paper]?.[subject] : undefined;
          const card = scopedCount ?? C.Q_PANIC_COUNTS_BY_SUBJECT[subject] ?? topicScreen(subject, Number(year), phase).countFor('all');
          const subjectSet = served({ subject, selectedYear: Number(year), selectedPhase: phase });
          const session = panicPool(subjectSet.slice()).length;
          checked += 1;
          if (card !== session) wrong.push(`${subject} y${year} ${phase}: card ${card}, session ${session}`);
          if (session > subjectSet.length) wrong.push(`${subject} y${year} ${phase}: Panic ${session} is more than the subject's ${subjectSet.length}`);
          if (card <= 0) wrong.push(`${subject} y${year} ${phase}: a card with nothing behind it`);
        }
      }
    }
  }
  assert.ok(checked > 0, 'no Panic card was checked');
  assert.deepEqual(wrong, []);
});

test('Home\'s current-term sets print what they serve, for every year and period', () => {
  const wrong = [];
  for (const year of YEARS) {
    for (const phase of PHASES) {
      // HomeView: the period's subjects, the table's bucket for the paper.
      const subjects = coursesOf(year).filter((s) => !phase || s.semester === PHASE_TERM[phase] || s.semester === 0);
      const scope = examScopeForPhase(phase) || 'all';
      for (const [mode, table] of [['current-scope', C.Q_CURRENT_SCOPE_COUNTS], ['predicted', C.Q_HIGH_PREDICTION_COUNTS]]) {
        const bucket = table[SEMESTER.id]?.[scope] || {};
        const card = subjects.reduce((n, s) => n + (bucket[s.id] || 0), 0);
        const set = served({ subject: 'all', selectedYear: year, selectedPhase: phase, practiceMode: mode }).length;
        if (card !== set) wrong.push(`${mode} year ${year} ${phase || 'no period'}: card ${card}, set ${set}`);
      }
    }
  }
  assert.deepEqual(wrong, []);
});

test('the wrong-answer chip counts the set it opens: the year\'s misses, both terms, never a blocked question', () => {
  const pick = (pred) => QB.filter((q) => isQuestionDeliverable(q) && pred(q));
  const [termOne] = pick((q) => q.subject === 'equine-medicine');
  const termTwo = pick((q) => q.subject === 'livestock-pathology').slice(0, 2); // year 5, term 2
  const [otherYear] = pick((q) => q.subject === 'com5');
  const blocked = BLOCKED_QUESTIONS.find((b) => yearForSubject(b.key.split(':')[0]) === 5)?.key;
  assert.ok(termOne && termTwo.length === 2 && otherYear && blocked, 'the fixture questions moved');
  const [blockedSubject, blockedId] = blocked.split(':');
  const row = (q, correct, date) => ({ subject: q.subject, questionId: q.id, year: q.year, correct, date });
  // A row from before rows carried their year names only its subject.
  const legacy = (q, correct, date) => ({ subject: q.subject, questionId: q.id, correct, date });
  const history = [
    legacy(termTwo[0], false, 1), legacy(termTwo[1], false, 2), row(otherYear, false, 3),
    { subject: blockedSubject, questionId: Number.isNaN(Number(blockedId)) ? blockedId : Number(blockedId), year: 5, correct: false, date: 4 },
    // A question missed then answered right is no longer wrong.
    row(termOne, false, 5), row(termOne, true, 6),
  ];
  const chip = stillWrongInYear(history, 5).keys.size;
  const set = buildExamPool({ questions: QB, practiceMode: 'wrong', subject: 'all', topic: null, questionCategory: 'all', selectedYear: 5, selectedPhase: '1-final', history, bookmarks: [], weakQuestions: [] }).length;
  assert.equal(chip, 2, 'the two term-two misses are this year\'s, the blocked one is never served');
  assert.equal(chip, set, `the chip says ${chip} and the set serves ${set}`);
  // A row with no subject keys as ":id", which the set can never serve.
  const noSubject = { questionId: termTwo[0].id, year: 5, correct: false, date: 7 };
  assert.equal(stillWrongInYear([...history, noSubject], 5).keys.size, chip, 'a row with no subject was counted');
  const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.match(home, /stillWrongInYear\(history, selectedYear\)/);
  assert.doesNotMatch(home, /requestedCount : 50\)/);
});

test('when the wrong-answer chip caps, the number it prints is the set it opens', () => {
  // More of this year's questions still wrong than WEAK_POOL_CAP.
  const seen = new Set();
  const many = QB.filter((q) => {
    const key = `${q.subject}:${q.id}`;
    if (seen.has(key) || !isQuestionDeliverable(q) || yearForSubject(q.subject) !== 5 || q.year !== 5) return false;
    seen.add(key);
    return true;
  }).slice(0, WEAK_POOL_CAP + 40);
  const history = many.map((q, i) => ({ subject: q.subject, questionId: q.id, year: q.year, correct: false, date: i + 1 }));
  const total = stillWrongInYear(history, 5).keys.size;
  assert.equal(total, WEAK_POOL_CAP + 40);
  const chip = wrongChip(total);
  assert.deepEqual(chip, { serve: WEAK_POOL_CAP, total, label: `${WEAK_POOL_CAP} จาก ${total}` });
  // The set: the 'wrong' pool holds every one of them, and startExam cuts it to
  // the count the chip asks for (ranked.slice(0, min(count, pool))).
  const pool = buildExamPool({ questions: QB, practiceMode: 'wrong', subject: 'all', topic: null, questionCategory: 'all', selectedYear: 5, selectedPhase: '1-final', history, bookmarks: [], weakQuestions: [] });
  assert.equal(pool.length, total);
  const opened = pool.slice(0, Math.min(chip.serve, pool.length)).length;
  assert.equal(opened, Number(chip.label.split(' ')[0]), `the chip prints "${chip.label}" and opens ${opened}`);
  // Under the cap the chip prints the whole set and opens all of it.
  assert.deepEqual(wrongChip(12), { serve: 12, total: 12, label: '12' });
  assert.deepEqual(wrongChip(0), { serve: 0, total: 0, label: '0' });
  // Home launches with the chip's count and prints the chip's label.
  const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.match(home, /const \{ serve \} = wrongChip\(quickStats\.wrongCount\);/);
  assert.match(home, /\{wrongChip\(quickStats\.wrongCount\)\.label\}/);
});

test('no table prints a negative count, a fraction, or a part larger than its whole', () => {
  const bad = [];
  const walk = (value, path) => {
    if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
    } else if (typeof value === 'number' && (!Number.isInteger(value) || value < 0)) {
      bad.push(`${path} = ${value}`);
    }
  };
  for (const [name, table] of Object.entries(C)) walk(table, name);
  walk(Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE, 'Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE');
  for (const phase of PHASES.slice(1)) {
    for (const [subject, topics] of Object.entries(C.Q_COUNTS_BY_TOPIC_BY_SCOPE[phase] || {})) {
      for (const [topic, count] of Object.entries(topics)) {
        const past = C.Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE[phase]?.[subject]?.[topic] || 0;
        if (past > count) bad.push(`${phase} ${subject}/${topic}: past ${past} > ${count}`);
        const kinds = Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE[phase]?.[subject]?.[topic];
        const kindSum = kinds ? kinds.mcq + kinds.tf + kinds.match + kinds.writing : 0;
        if (kindSum !== count) bad.push(`${phase} ${subject}/${topic}: kinds add to ${kindSum}, topic ${count}`);
      }
    }
  }
  for (const paper of ['midterm', 'final']) {
    for (const [subject, panic] of Object.entries(C.Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE[paper] || {})) {
      if (panic > (C.Q_PANIC_COUNTS_BY_SUBJECT[subject] || 0)) bad.push(`${paper} panic ${subject}: ${panic} > the subject's Panic`);
      if (panic > (C.Q_VISIBLE_COUNTS_BY_SUBJECT[subject] || 0)) bad.push(`${paper} panic ${subject}: ${panic} > the subject`);
    }
  }
  assert.deepEqual(bad, []);
  // The back office's total is the year rows beside it and the landing page's
  // figure; QB_TOTAL also holds questions under hidden topics.
  assert.equal(sum(C.Q_VISIBLE_COUNTS_BY_SUBJECT), sum(C.Q_VISIBLE_COUNTS_BY_YEAR));
  const admin = readFileSync(new URL('../../src/views/AdminView.jsx', import.meta.url), 'utf8');
  assert.match(admin, /const openTotal = sum\(Q_VISIBLE_COUNTS_BY_SUBJECT\);/);
  assert.match(admin, /label="โจทย์ที่เปิดให้ทำ" value=\{n\(openTotal\)\}/);
});
