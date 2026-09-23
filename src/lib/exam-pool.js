// ============================================================
// exam-pool.js — which questions a practice set is drawn from
// ============================================================
// One pool definition for both the config screen's count and startExam's
// selection, so the number a student is shown is the set they are served.
// It lived inside App.jsx, where the only way to test it was to slice the
// source text; here tests/unit/exam-pool.test.mjs calls it on fixture banks.
// The code below was moved from App.jsx unchanged apart from `export`.
// ============================================================

import { stillWrong } from './wrong-pool.js';
import { SUBJECTS, hiddenTopicIdsFor, yearForSubject, semesterForSubject } from '../data/curriculum.js';
import { questionCategory as catOf } from '../hooks/utils.js';
import { isQuestionDeliverable } from '../data/question-delivery.generated.js';
import { SEMESTER } from '../data/semester.js';
import { isCurrentScopeQuestion, isHighPredictionQuestion } from './question-prediction.js';
import { scopeForPhase, questionInScope } from './exam-scope.js';
import { isPastPaperQuestion } from './question-metadata.js';

// Which semester each exam phase belongs to. Mid vs final inside one semester
// cannot be scoped from ordinary question data, so the phase narrows the pool
// to its term and no further.
const PHASE_SEMESTER = { '1-mid': 1, '1-final': 1, '2-mid': 2, '2-final': 2 };

// How many questions a Panic session asks for, per "how long have I got".
export const PANIC_SIZE = { 15: 12, 30: 25, 60: 50, tonight: 120 };
// A per-subject Panic serves everything it has rather than a slice of it, so
// this is a ceiling, not a size. The largest subject pool today is 237.
export const PANIC_SUBJECT_MAX = 1000;

// 'weak' means "the questions you miss most", which is why it is capped and
// ordered — that is what separates it from 'wrong' (everything ever missed).
// The cap was 25, below what Panic Mode offers: picking "I have an hour" asked
// for 50 and picking "tonight" asked for 120, so the session quietly ended at
// 25 or fewer once year-scoping had run. The same 25 also truncated the weak
// count shown on the dashboard. Sized against the largest Panic ask, and a
// unit test holds the two together.
export const WEAK_POOL_CAP = 150;

export const USER_CURATED_MODES = new Set(['bookmarks', 'weak', 'wrong']);

export function normalizePracticeMode(mode, subject, explicitMode = false) {
  if (!explicitMode && subject && subject !== 'all' && USER_CURATED_MODES.has(mode)) {
    return 'all';
  }
  return mode;
}

// The type picker (all types, auto-marked, written) is on the config screen
// for English only, and the pick is plain state that nothing resets. It used
// to be applied everywhere after English, unseen: a written-only pick there,
// then COM IV, and the screen said ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ with Start
// greyed out and no control that explained it; the sidebar Mock Exam served
// 70 written items out of a 1,981-question year. So the filter applies only
// where its picker is on screen. The pick itself is kept, so it is still
// selected when the student goes back to English. ConfigView is handed this
// same answer instead of working it out again.
export function categoryPickerShown(subject, practiceMode) {
  return subject === 'engprof' && practiceMode !== 'bookmarks' && practiceMode !== 'weak';
}

export function appliedCategory(category, subject, practiceMode) {
  return categoryPickerShown(subject, practiceMode) ? category : 'all';
}

/**
 * One pool definition for both ConfigView's truthful availability count and
 * startExam's actual selection. Keeping these paths together prevents the UI
 * from promising 10 questions when the engine can only produce 5.
 */
export function buildExamPool({
  questions,
  practiceMode,
  subject,
  topic,
  questionCategory,
  selectedYear,
  selectedPhase = null,
  excludeIds = null,
  onlyTopics = null,
  onlyPastPaper = false,
  bookmarks = [],
  weakQuestions = [],
  history = [],
}) {
  const curated = USER_CURATED_MODES.has(practiceMode);
  const deliverableQuestions = questions.filter(isQuestionDeliverable);
  let pool;

  if (practiceMode === 'bookmarks') {
    pool = deliverableQuestions.filter((q) => bookmarks.includes(q.id));
  } else if (practiceMode === 'weak') {
    // Year-scoped like every other practice path: the dashboard promises a
    // year-scoped count, and serving lifetime cross-year questions under
    // that number made the two disagree.
    //
    // weakQuestions arrives most-missed first, and the pool keeps that rank.
    // Filtering the bank by membership kept BANK order instead, so a 10-
    // question set was whichever ten weak questions loaded first, not the
    // student's ten most missed.
    const rank = new Map(weakQuestions.map((id, i) => [id, i]));
    pool = deliverableQuestions.filter((q) => rank.has(q.id)
      && (q.year == null || !selectedYear || q.year === selectedYear))
      .sort((a, b) => rank.get(a.id) - rank.get(b.id));
  } else if (practiceMode === 'wrong') {
    // Still wrong, not ever wrong: see lib/wrong-pool.js. A question answered
    // wrong once and then correctly ten times used to stay here permanently.
    const { keys: wrongSet, counts: wrongCount } = stillWrong(history);
    // Year-scoped, like 'weak' directly above. The home chip counts this
    // year's wrong answers, so serving every year's meant the button said
    // one number and handed over a different set — the same divergence the
    // 'weak' branch was fixed for, left behind here.
    pool = deliverableQuestions.filter((q) => wrongSet.has(`${q.subject}:${q.id}`)
      && (q.year == null || !selectedYear || q.year === selectedYear));
    // Most-missed first. ConfigView and the Home chip both promise
    // "เรียงตามความถี่ (ผิดบ่อยขึ้นก่อน)"; a Set-membership filter kept bank
    // order and startExam then shuffled it, so the promise was never kept.
    pool.sort((a, b) => (wrongCount.get(`${b.subject}:${b.id}`) || 0)
      - (wrongCount.get(`${a.subject}:${a.id}`) || 0));
  } else {
    pool = subject === 'all'
      ? deliverableQuestions.filter((q) => !selectedYear || yearForSubject(q.subject) === selectedYear)
      : deliverableQuestions.filter((q) => q.subject === subject);

    // Honour the phase the student picked. Until now only the curated
    // current-scope and predicted modes looked at it, so an ordinary
    // "เทอม 1 กลางภาค" set was filtered by YEAR alone: a probe for year 4 term
    // 1 midterm returned 1,981 questions of which 1,633 belonged to term 2,
    // and the id list was identical to the term 2 final set.
    //
    // Only the SEMESTER can be honoured here. Ordinary questions carry no
    // mid/final marker, so narrowing further would be a promise the data
    // cannot keep — the phase screen's own wording says which part is scoped.
    // Semester 0 means the course runs all year and always qualifies. A
    // specific chosen subject is left alone: the student named it.
    const phaseSemester = PHASE_SEMESTER[selectedPhase];
    if (phaseSemester && subject === 'all') {
      const scoped = pool.filter((q) => {
        const sem = semesterForSubject(q.subject);
        return sem == null || sem === 0 || sem === phaseSemester;
      });
      // The phase narrows the pool; it must never empty it. Years 1 and 3
      // have no term-1 banks at all (every subject that carries questions
      // there is semester 2), and the year card still advertises 298 and 62
      // questions — so filtering unconditionally handed a student who tapped
      // ปี 1 in September, when the phase defaults to เทอม 1, a year that
      // promised questions and then had none. Where there is nothing in scope,
      // the whole year is better than an empty screen.
      if (scoped.length) pool = scoped;
    }

    // ...and then by the PAPER. The term filter above is only half of what
    // "เทอม 1 กลางภาค" says: until now '1-mid' and '1-final' both mapped to
    // semester 1 and nothing else, so the two picks served an identical pool
    // — the midterm pile and the final pile were the same pile. lib/exam-scope
    // resolves each question to its paper (its own field, its topic's, or the
    // faculty timetable, which alone settles a subject sitting one paper:
    // epidemiology has no midterm, POA has no written paper at all).
    //
    // Unlike the term filter this applies to a named subject too: picking
    // กลางภาค and then สุขศาสตร์น้ำนม asks for that subject's midterm content,
    // not all of it. A question whose paper is still unknown stays in — see
    // questionInScope — so this can only ever remove content we KNOW belongs
    // to the other paper.
    if (topic) {
      if (topic.startsWith('_') && topic.endsWith('-all')) {
        const collectionId = topic.slice(1, -4);
        const subjectMeta = SUBJECTS.find((item) => item.id === subject);
        const collection = subjectMeta?.collections?.find((item) => item.id === topic);
        const prefix = collection?.topicPrefix || collectionId;
        pool = pool.filter((q) => q.topic?.startsWith(prefix));
      } else {
        pool = pool.filter((q) => q.topic === topic);
      }
    } else if (subject !== 'all') {
      const hidden = hiddenTopicIdsFor(subject);
      if (hidden.size) pool = pool.filter((q) => !hidden.has(q.topic));
    } else {
      // hiddenTopicIdsFor does a SUBJECTS.find plus a fresh Set per call;
      // once per subject, not once per question (20x on a 2,000-row pool).
      const hiddenBySubject = new Map();
      pool = pool.filter((q) => {
        let hiddenForSubject = hiddenBySubject.get(q.subject);
        if (!hiddenForSubject) {
          hiddenForSubject = hiddenTopicIdsFor(q.subject);
          hiddenBySubject.set(q.subject, hiddenForSubject);
        }
        return !hiddenForSubject.has(q.topic);
      });
    }

    // A lecturer's part of a paper spans several topics at once, so the set
    // is a Set of topic ids rather than a second topic argument. It runs after
    // the single-topic branch above and narrows only; the card that opened
    // the session printed a count from exactly these topics.
    if (onlyTopics && onlyTopics.size) {
      // A printed matching set belongs to every disease its bank names.
      pool = pool.filter((q) => onlyTopics.has(q.topic)
        || (Array.isArray(q.topics) && q.topics.some((t) => onlyTopics.has(t))));
    }
    // "ฝึกเฉพาะข้อสอบเก่า": the lecturer's part, past papers only.
    if (onlyPastPaper) pool = pool.filter(isPastPaperQuestion);

    if (practiceMode === 'current-scope' || practiceMode === 'predicted') {
      const matchesScope = practiceMode === 'predicted'
        ? isHighPredictionQuestion
        : isCurrentScopeQuestion;
      pool = pool.filter((q) => matchesScope(q, {
          curriculumVersion: SEMESTER.id,
          selectedPhase,
        }));
    }
  }

  if (!curated && (!subject || subject === 'all')) {
    pool = pool.filter((q) => q.year == null || q.year === selectedYear);
  }

  if (questionCategory === 'mcq') pool = pool.filter((q) => catOf(q) === 'mcq');
  else if (questionCategory === 'writing') pool = pool.filter((q) => catOf(q) === 'writing');
  // The lecturer sets practise ONE format, because that is how each part of
  // the paper is written: อ.เกรียงวิชญ์ sets 24 true/false items, อ.ณทยา sets
  // matching. 'mcq' above keeps its wider meaning for the config screen,
  // everything marked automatically (MCQ, true/false and matching, while
  // fill-in-the-blank is typed and goes with 'writing'); these are exact.
  else if (questionCategory === 'tf') pool = pool.filter((q) => q.type === 'tf');
  // The lecturer cards' ปรนัย: exactly what regen-q-counts counts as mcq —
  // not tf, match or a written type — so the card's number is what is served.
  else if (questionCategory === 'mcq-only') pool = pool.filter((q) => !['tf', 'match', 'short', 'essay', 'fill'].includes(q.type));
  else if (questionCategory === 'match') pool = pool.filter((q) => q.type === 'match');

  // Applied last so it holds for every mode. Compound keys, because ids
  // collide across subjects.
  // The paper filter runs LAST, after the topic narrowing, and that order is
  // the point: a student who names a topic has asked for exactly that content,
  // so when the filter would empty their pool the never-empty guard hands it
  // straight back. Filtering before the topic step instead gave 0 questions
  // for หัวข้อ fiqc-aquatic under เทอม 1 กลางภาค — the syllabus marks it
  // "ไม่ออกสอบ — handout only", which is a reason to keep it out of a WHOLE-
  // subject set, not a reason to refuse the student who asked for it by name.
  const wantedScope = scopeForPhase(selectedPhase);
  if (wantedScope && !curated) {
    const onPaper = pool.filter((q) => questionInScope(q, wantedScope));
    // The never-empty guard is only kind when the student NAMED what they
    // want. Across all subjects it was the opposite: a subject holding
    // nothing for the chosen paper got its whole other-paper bank handed
    // back, so a midterm cram served all 100 epidemiology questions (that
    // subject has no midterm), all 46 vet-juris and every com1 topic.
    // That is what "ทำไม Equine Repro มี final ติดมาด้วย" looks like at scale,
    // and the pool is in no danger of emptying when it spans a whole year.
    const named = subject !== 'all' || Boolean(topic);
    if (onPaper.length || !named) pool = onPaper;
  }

  if (excludeIds && excludeIds.size) {
    pool = pool.filter((q) => !excludeIds.has(`${q.subject}:${q.id}`));
  }

  return pool;
}
