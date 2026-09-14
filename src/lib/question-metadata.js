// Canonical metadata rules shared by the runtime catalog, generators, and
// validators. Keeping these predicates in one dependency-light module avoids
// count drift when legacy question banks are migrated incrementally.

export const UNASSIGNED_TOPIC = '__unassigned__';

const PAST_PAPER_SOURCE_PATTERN = /ข้อสอบ(?:เก่า)?|\b(?:FINAL|MID)\s*86\b|past\s*(?:paper|exam)/i;
const PAST_PAPER_ORIGIN_PATTERN = /ข้อสอบเก่า|past\s*(?:paper|exam)|exam(?:ination)?\s*recall|\b(?:final|mid(?:term)?|osce|prac\s*final|lab\s*final)\b|\bER\s*Q\d+/i;
const NON_PAPER_ORIGIN_PATTERN = /\bmock\b|station\s+prep/i;

export function questionTopicId(question) {
  return question?.topic || UNASSIGNED_TOPIC;
}

// `sourceType` is the canonical marker and wins when present. `examOrigin` is
// considered only for legacy questions without that marker and must itself
// name a real exam context. A nonempty value is not enough: practice mocks and
// senior summaries also use this field. The source-text fallback keeps
// still-older banks compatible until metadata is normalized.
export function isPastPaperQuestion(question) {
  if (question?.sourceType) return question.sourceType === 'past-paper';
  const origin = String(question?.examOrigin || '');
  return (!NON_PAPER_ORIGIN_PATTERN.test(origin) && PAST_PAPER_ORIGIN_PATTERN.test(origin))
    || PAST_PAPER_SOURCE_PATTERN.test(String(question?.source || ''));
}

// Questions written FROM a senior cohort's compilation — the starred and
// highlighted points in it — rather than transcribed from a paper. They are
// marked "อิงแนวข้อสอบ" at the point they are authored, which is the only
// honest claim available: nobody knows what will be asked.
const EXAM_ALIGNED = 'อิงแนวข้อสอบ';

export function isExamAlignedQuestion(question) {
  if (Array.isArray(question?.tags) && question.tags.some((t) => String(t).includes(EXAM_ALIGNED))) return true;
  return String(question?.verified || '').includes(EXAM_ALIGNED);
}

/** 0 = sat by a previous cohort, 1 = written from what they marked, 2 = neither. */
export function panicRank(question) {
  if (isPastPaperQuestion(question)) return 0;
  if (isExamAlignedQuestion(question)) return 1;
  return 2;
}

/**
 * The pool Panic Mode draws from, in the order it should be worked through.
 *
 * Panic Mode is opened in the last day before a paper, so what it puts first
 * has to be the highest-value thing in the subject. Two rules, in order:
 *
 *   1. PROVENANCE. Questions from a real paper a previous cohort sat, then the
 *      ones written from what that cohort starred and highlighted. Nothing
 *      else — this is a filter, not a re-ordering, and that is the point of
 *      the mode.
 *   2. WHAT THIS STUDENT KEEPS MISSING. Within each of those bands, the ones
 *      they are currently getting wrong come first, most-missed at the top.
 *      Everything else holds the order it came in, which is shuffled, so two
 *      crams of the same subject are not the same sequence.
 *
 * The one exception to rule 1 is a subject that holds neither kind, where
 * filtering would open an empty session: there the whole subject is returned,
 * because something to revise beats a card that does nothing. Of the eleven
 * subjects Panic Mode covers, that is now only ระบาดวิทยา. อายุรศาสตร์ม้า and
 * โรคสัตว์สู่คน closed on 2026-09-14, when the Vet 85 midterm compilations were
 * ingested: 0 to 60 and 2 to 33.
 *
 * @param {Array} questions
 * @param {(q) => number} [missCountOf] how often this student has missed it
 */
export function panicPool(questions, missCountOf) {
  const list = questions || [];
  const shaped = list.filter((q) => panicRank(q) < 2);
  const pool = shaped.length ? shaped : list.slice();
  const missed = typeof missCountOf === 'function' ? missCountOf : () => 0;
  // Stable sort: questions that tie on both rules keep the caller's order.
  return pool.sort((a, b) => panicRank(a) - panicRank(b) || missed(b) - missed(a));
}
