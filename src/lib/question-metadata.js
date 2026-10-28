// Canonical metadata rules shared by the runtime catalog, generators, and
// validators. Keeping these predicates in one dependency-light module avoids
// count drift when legacy question banks are migrated incrementally.

import { originEntry } from '../data/exam-origins.js';

export const UNASSIGNED_TOPIC = '__unassigned__';

const PAST_PAPER_SOURCE_PATTERN = /ข้อสอบ(?:เก่า)?|\b(?:FINAL|MID)\s*86\b|past\s*(?:paper|exam)/i;
const PAST_PAPER_ORIGIN_PATTERN = /ข้อสอบเก่า|past\s*(?:paper|exam)|exam(?:ination)?\s*recall|\b(?:final|mid(?:term)?|osce|prac\s*final|lab\s*final)\b|\bER\s*Q\d+/i;
// The word that names the DOCUMENT wins over the word that names the paper
// it was written for: "Swine Medicine midterm study notes" is notes, not the
// midterm, and counting it as a paper put #105636 in band 0 and in the swine
// wrap-up's ข้อสอบเก่า list (DATA-05, 2026-10-11).
const NON_PAPER_ORIGIN_PATTERN = /\bmock\b|station\s+prep|study\s+notes|lecture\s+slides/i;

export function questionTopicId(question) {
  return question?.topic || UNASSIGNED_TOPIC;
}

// `sourceType` is the canonical marker and wins when present. `examOrigin` is
// considered only for legacy questions without that marker and must itself
// name a real exam context. A nonempty value is not enough: practice mocks and
// senior summaries also use this field. The source-text fallback keeps
// still-older banks compatible until metadata is normalized.
export function isPastPaperQuestion(question) {
  if (question?.sourceType === 'past-paper') return true;
  // Every other declared sourceType but one names material nobody sat:
  // `lecture-derived` is written from the recording, `exam-aligned` from what a
  // compilation marked, `lecture`, `practice` and `lecture-verified-draft` from
  // the course material (SOURCE_TYPES in src/data/exam-origins.js). A paper
  // origin on such a row says what it was written FROM, not that it was sat.
  if (question?.sourceType && question.sourceType !== 'student-compilation') return false;
  // Anything else — most often `student-compilation` — still has to answer for
  // itself through examOrigin. The two markers say DIFFERENT things:
  // sourceType is how the question reached us, examOrigin is whose paper it
  // was on. A question tagged student-compilation whose origin reads
  // "Aj. Sirawit FIQC Vet 85 Midterm" was sat by Vet 85; it merely travelled
  // here through a senior's compilation.
  //
  // Returning early on any nonempty sourceType hid exactly those: Food
  // Industry counted 0 past papers while holding 20 that name a cohort and a
  // paper, so the "ฝึกเฉพาะข้อสอบเก่า" button never rendered for that subject
  // at all, and panicRank put them behind freshly written items. "อิงแนวข้อสอบ"
  // is still not a paper and still does not count — it names no cohort.
  const origin = String(question?.examOrigin || '');
  // A compilation row answers through src/data/exam-origins.js, where a person
  // read the document and filed its exact origin. The wording is not guessed
  // at: "Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ" names a sat paper the
  // pattern below cannot read, and 55 recalled items (22 swine finals, 25
  // zoonoses) sat in band 1 behind it until 2026-10-28. lint:provenance fails
  // on an unfiled origin, and on a new origin filed as a paper that only the
  // map can read until a person adds it to its reviewed list.
  const filed = question?.sourceType ? originEntry(origin) : null;
  if (filed) return filed.kind === 'paper';
  const originNamesAPaper = originWordingNamesAPaper(origin);
  // The free-text `source` fallback stays for LEGACY rows only — the ones with
  // no sourceType at all. It matches the bare word ข้อสอบ, which appears in
  // plenty of compilation citations, so letting a typed row reach it counted
  // 32 "อิงแนวข้อสอบ" items as sat papers. A row that carries a sourceType has
  // to earn it through examOrigin, which names a cohort or does not.
  if (question?.sourceType) return originNamesAPaper;
  return originNamesAPaper || PAST_PAPER_SOURCE_PATTERN.test(String(question?.source || ''));
}

/** Whether an origin's wording alone reads as a sat paper: the rule for rows with no sourceType. */
export function originWordingNamesAPaper(origin) {
  const text = String(origin || '');
  return !NON_PAPER_ORIGIN_PATTERN.test(text) && PAST_PAPER_ORIGIN_PATTERN.test(text);
}

// Questions written FROM a senior cohort's compilation — the starred and
// highlighted points in it — rather than transcribed from a paper. They are
// marked "อิงแนวข้อสอบ" at the point they are authored, which is the only
// honest claim available: nobody knows what will be asked.
const EXAM_ALIGNED = 'อิงแนวข้อสอบ';

export function isExamAlignedQuestion(question) {
  if (Array.isArray(question?.tags) && question.tags.some((t) => String(t).includes(EXAM_ALIGNED))) return true;
  // Three fields, because the marker has been written into all three across
  // successive ingests. Reading only two left 46 One Health questions out of
  // the band they belong to, and Panic Mode — which serves bands 0 and 1 and
  // nothing else — opened that subject with three short-answer questions.
  return String(question?.verified || '').includes(EXAM_ALIGNED)
    || String(question?.examOrigin || '').includes(EXAM_ALIGNED);
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
