// ============================================================
// exam-scope.js — which paper a question belongs to
// ============================================================
// Palm, 2026-09-16: "การแยกกลางภาคกับปลายภาค มันยังแปลกๆอยู่ เหมือนมันปนกัน
// ทั้งๆที่กลางภาคก็ควรอยู่กลางภาค ปลายภาคก็ต้องอยู่ปลายภาค ... แยกให้ชัด
// สร้างมาตรฐานและความมั่นคง".
//
// He was right, and the reason was structural. `examScope` existed as an
// optional field on a question, 218 of 5,387 carried it, and the practice
// pool never read it: the phase control mapped '1-mid' and '1-final' to the
// SAME semester, so choosing กลางภาค and choosing ปลายภาค served an identical
// pool. The separation was a label, not a filter.
//
// THE RULE, and it is a rule about the syllabus rather than about any one
// question: A PAPER EXAMINES TOPICS. The faculty timetable says which papers
// a subject has; the teaching order says which topics fall before the midterm
// week and which after it. So scope belongs to the TOPIC, and a question
// inherits it. Add a question to a topic tomorrow and it lands in the right
// paper with nothing to remember — which is the only way this stays true.
//
// Resolution order for one question, first hit wins:
//   1. `question.examScope` — a hand-set fact about THAT question. Used when a
//      past paper disagrees with where the topic sits this year (Palm: "อาจมี
//      บางปีที่ไม่ตรงกับรุ่นปัจจุบันก็ให้เทียบหัวข้อเอา").
//   2. the topic's `examScope` in curriculum.js — the normal path.
//   3. the subject's `examScope` — for a subject taught as one block.
//   4. THE FACULTY TIMETABLE, which settles a whole subject with no data entry
//      at all when it sits exactly one paper: epidemiology sits only the final,
//      so all 100 of its questions are final scope and none of them can ever
//      pad a midterm set. Only "sits both papers" needs the per-topic split.
//   5. null — unknown, and an unknown scope is never filtered OUT (a student
//      must not lose a question to our missing metadata). `lint:exam-scope`
//      is what stops unknowns from accumulating.
//
// 'both' means examinable on either paper: a recurring fundamental, or a topic
// the faculty revisits. 'continuous' means the course has no written paper at
// all (POA in 2569-1) — those questions belong to neither midterm nor final
// and must never pad one.
// ============================================================

import { SUBJECTS } from '../data/curriculum.js';
import { SUBJECT_PAPERS } from '../data/exam-papers.generated.js';

export const EXAM_SCOPES = ['midterm', 'final', 'both', 'continuous'];
const SCOPE_SET = new Set(EXAM_SCOPES);

export const EXAM_SCOPE_LABEL = {
  midterm: 'กลางภาค',
  final: 'ปลายภาค',
  both: 'กลางภาคและปลายภาค',
  continuous: 'ไม่มีสอบแยก',
};

/** '1-mid' -> 'midterm', '2-final' -> 'final', anything else -> null. */
export function scopeForPhase(selectedPhase) {
  if (typeof selectedPhase !== 'string') return null;
  if (selectedPhase.endsWith('-mid')) return 'midterm';
  if (selectedPhase.endsWith('-final')) return 'final';
  return null;
}

// subject id -> { scope, topics: Map<topicId, scope> }, built once.
const INDEX = (() => {
  const map = new Map();
  for (const subject of SUBJECTS) {
    if (!subject?.id) continue;
    const topics = new Map();
    for (const topic of subject.topics || []) {
      if (topic?.id && SCOPE_SET.has(topic.examScope)) topics.set(topic.id, topic.examScope);
    }
    map.set(subject.id, {
      scope: SCOPE_SET.has(subject.examScope) ? subject.examScope : null,
      topics,
    });
  }
  return map;
})();

/**
 * What the published timetable alone settles for a subject: 'midterm' or
 * 'final' when it sits exactly one paper, and null otherwise.
 *
 * Absence is deliberately NOT read as 'continuous'. The timetable covers the
 * years being taught now, and the bank holds subjects it has no reason to
 * mention — the year-4 COM III/IV/V banks and the VCA compilation, 2,000
 * questions between them. Reading absence as "no paper" dropped every one of
 * those out of a phase-filtered pool on missing data. A course that truly has
 * no paper says so out loud: examScope: 'continuous' on the subject.
 */
export function scopeFromTimetable(subjectId) {
  const papers = SUBJECT_PAPERS[subjectId];
  return papers === 'midterm' || papers === 'final' ? papers : null;
}

/** The scope declared for a topic, else its subject's, else the timetable's. */
export function scopeForTopic(subjectId, topicId) {
  const entry = INDEX.get(subjectId);
  if (entry) {
    if (topicId && entry.topics.has(topicId)) return entry.topics.get(topicId);
    if (entry.scope) return entry.scope;
  }
  return scopeFromTimetable(subjectId);
}

/** The scope of one question: its own field, else its topic's, else null. */
export function scopeOfQuestion(question) {
  if (!question) return null;
  if (SCOPE_SET.has(question.examScope)) return question.examScope;
  return scopeForTopic(question.subject, question.topic);
}

/**
 * Does this question belong on the paper the student picked?
 *
 * Two rules carry the whole separation:
 *   - 'both' sits on either paper; 'continuous' sits on neither.
 *   - an UNKNOWN scope is kept. Filtering on absent metadata would quietly
 *     shrink a student's practice set the day someone adds a topic and forgets
 *     the field, and a missing question is worse than a loosely placed one.
 *     The lint is what keeps unknown from becoming the common case.
 */
export function questionInScope(question, wantedScope) {
  if (!wantedScope) return true;
  const scope = scopeOfQuestion(question);
  if (scope == null) return true;
  if (scope === 'continuous') return false;
  if (scope !== wantedScope && scope !== 'both') return false;
  // A question cannot sit on a paper its own lecture is not on.
  //
  // The two examScope fields do not mean the same thing. A topic's is THIS
  // year's timetable, written beside the entry as "(Course Schedule 2026)". A
  // question's is the paper it was recorded from, and many of those papers
  // belong to another cohort: the aquatic conservation questions are marked
  // midterm because Vet 85 sat that lecture before their midterm, while Vet 86
  // is taught it in the block after theirs.
  //
  // Reading the question's tag alone put four of them into a Vet 86 midterm
  // set for a lecture that has not happened yet, and the topic list — which
  // does follow the timetable — was not showing that topic at all. The list and
  // the set now answer the same question. A topic with no scope of its own
  // still keeps everything, as always.
  const topicScope = scopeForTopic(question?.subject, question?.topic);
  if (!topicScope) return true;
  return topicScope === wantedScope || topicScope === 'both';
}

/** Split a pool by the paper, for counting and for explaining a count. */
export function countByScope(questions) {
  const tally = { midterm: 0, final: 0, both: 0, continuous: 0, unknown: 0 };
  for (const q of questions || []) {
    const scope = scopeOfQuestion(q);
    tally[scope == null ? 'unknown' : scope] += 1;
  }
  return tally;
}

/**
 * A question transcribed from a senior cohort's paper keeps that paper's name
 * in `examOrigin`, and that name must never be rewritten — it is the evidence
 * the question rests on. But a topic can sit on a different paper from one
 * cohort to the next: the equine reproduction pregnancy block was examined at
 * ปลายภาค by an earlier cohort and at กลางภาค by 86. So "Equine reproduction
 * final exam" printed under a question in a midterm cram reads exactly like a
 * leak from the wrong paper, which is what it was reported as.
 *
 * It is not a leak, and the honest fix is not to hide the origin but to say
 * both things: what the source is called, and which paper the question is on
 * now. The note reports the SOURCE's label rather than what a cohort sat,
 * because some of these origins are summary documents carrying a paper's name
 * (24 One Health questions come from one called "One Health final" that in
 * fact covers the whole course) and "รุ่นก่อนหน้าสอบ" would not be true of
 * those. Returns that sentence, or null when the two agree or neither is known.
 */
const ORIGIN_NAMES_FINAL = /final|ปลายภาค/i;
const ORIGIN_NAMES_MID = /\bmid(?:term)?\b|กลางภาค/i;

export function originPaperNote(question) {
  const scope = scopeOfQuestion(question);
  if (scope !== 'midterm' && scope !== 'final') return null;
  const origin = String(question?.examOrigin || '');
  if (!origin) return null;
  const named = ORIGIN_NAMES_FINAL.test(origin)
    ? 'final'
    : (ORIGIN_NAMES_MID.test(origin) ? 'midterm' : null);
  if (!named || named === scope) return null;
  return named === 'final'
    ? 'ชื่อแหล่งที่มาของข้อนี้ระบุปลายภาค แต่หลักสูตรรุ่นนี้จัดเนื้อหานี้ไว้ในกลางภาค'
    : 'ชื่อแหล่งที่มาของข้อนี้ระบุกลางภาค แต่หลักสูตรรุ่นนี้จัดเนื้อหานี้ไว้ในปลายภาค';
}
