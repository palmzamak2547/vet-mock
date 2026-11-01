// ============================================================
// source-line.js — the "ที่มา" line under a question, before and after
// ============================================================
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// The line printed examOrigin, else the source pointer, while the question
// was still open: "Master 86 p6 (Cysteine + Tyrosine semi-essential)" sat
// under "กรดอะมิโนคู่ใดที่จัดเป็น semi-essential ในไก่", and "ดูเต็ม" opened
// the tags and the checking note ("splenic-puncture", "ติดดาวและไฮไลต์
// Transmammary") before any answer was given.
//
// Before the key is shown the line names only the KIND of source, read from
// sourceType and the person-filed EXAM_ORIGINS entry through the same
// predicates Panic Mode bands by: a past paper with its cohort and paper, a
// point a senior cohort marked, the course material, a senior's sheet, a
// mock. No document title, page, lecturer or topic word, so nothing a later
// ingest writes into `source` or `examOrigin` can reach it. Once the key is
// on screen the full line returns, exactly as before.
//
// The stored fields stay as written (they are evidence); only what is shown,
// and when, is decided here. scripts/lint-source-line.mjs and
// tests/unit/source-line-no-spoiler.test.mjs hold every question to it.
// ============================================================
import { isPastPaperQuestion, isExamAlignedQuestion } from './question-metadata.js';
import { originEntry } from '../data/exam-origins.js';
import { parseExamOrigin, cohortList } from './exam-origin-parse.js';
import { humanSource } from './source-label.js';

/** The paper a filed origin names, as the timetable words it. */
const PAPER_LABEL = Object.freeze({
  midterm: 'กลางภาค',
  final: 'ปลายภาค',
  quiz: 'ควิซ',
  osce: 'OSCE',
  station: 'สอบสถานี',
});

/** One fixed phrase per kind of source; none of them can name an answer. */
export const SOURCE_KIND_LABEL = Object.freeze({
  past: 'ข้อสอบเก่า',
  aligned: 'อิงแนวข้อสอบ',
  lecture: 'เขียนจากเนื้อหาที่เรียน',
  compilation: 'จากชีทรุ่นพี่',
  mock: 'ข้อสอบจำลอง',
  // A legacy row with no sourceType and no filed origin: its kind is not
  // recorded, and the pointer itself is what may give the key away.
  unknown: 'มีแหล่งอ้างอิง',
});

/** Shown beside the line while the full source waits for the key. */
export const SOURCE_LINE_WAIT = 'ดูเต็มหลังเห็นเฉลย';

// Written from the course itself: the recording, the slides, study notes.
const COURSE_TYPES = new Set(['lecture-derived', 'lecture', 'lecture-verified-draft', 'practice']);

/**
 * The kind of source a question has, in Panic Mode's order: a sat paper,
 * then a point a cohort marked, then how the rest reached the bank.
 * @returns {'past'|'aligned'|'mock'|'lecture'|'compilation'|'unknown'}
 */
export function sourceKind(question) {
  if (isPastPaperQuestion(question)) return 'past';
  if (isExamAlignedQuestion(question)) return 'aligned';
  const filed = originEntry(question?.examOrigin);
  if (filed?.kind === 'mock') return 'mock';
  if (COURSE_TYPES.has(question?.sourceType)) return 'lecture';
  if (question?.sourceType === 'student-compilation') return 'compilation';
  if (filed?.kind === 'source-doc') return 'lecture';
  return 'unknown';
}

/**
 * Whether the card's "อิงแนวเดิม" chip may show: the origin is a sat paper, a
 * point a cohort marked, or a mock written to the paper's pattern. It used to
 * show for any examOrigin, so 370 rows written from a recording or a summary
 * ("Kim TJ86") read "อิงแนวเดิม" above a line that says เขียนจากเนื้อหาที่เรียน.
 */
export function followsExamPattern(question) {
  return Boolean(question?.examOrigin) && ['past', 'aligned', 'mock'].includes(sourceKind(question));
}

/** "Vet 85", "Vet 84, 85", or '' when no cohort is named. */
function cohortLabel(cohort) {
  const list = cohortList(cohort);
  return list.length ? `Vet ${list.join(', ')}` : '';
}

/**
 * The line a student reads while the question is open: the kind of source,
 * and for a past paper the cohort that sat it and the paper.
 * "ข้อสอบเก่า Vet 85 ปลายภาค", "อิงแนวข้อสอบ", "เขียนจากเนื้อหาที่เรียน".
 *
 * The paper is the filed one. The cohort is read by exam-origin-parse.js,
 * the one reader of who sat a paper: on 30 legacy origins the filing copies a
 * file label's number ("COM I Final 86", "Swine Herd Mid TJ86"), a cohort the
 * file was gathered FOR, and printing "Vet 86" there would claim Vet 86 sat it.
 */
export function sourceLineBeforeAnswer(question) {
  const kind = sourceKind(question);
  if (kind !== 'past') return SOURCE_KIND_LABEL[kind];
  const origin = question?.examOrigin;
  const filed = originEntry(origin);
  const parsed = origin ? parseExamOrigin(origin) : { cohort: null, paper: null };
  const paper = (filed?.kind === 'paper' ? filed.paper : null) || parsed.paper;
  return [SOURCE_KIND_LABEL.past, cohortLabel(parsed.cohort), PAPER_LABEL[paper] || '']
    .filter(Boolean)
    .join(' ');
}

// Stored origins join their parts with "·" (exam-origins.js keys them that
// way); a student reads commas. The stored text is never rewritten.
export const readableSource = (s) => String(s).replace(/\s*·\s*/g, ', ');

/**
 * The full line once the key is on screen, as it always read: the origin,
 * else the source pointer through humanSource ("คาบ 3 (2 ก.ย.) นาที 28:22"),
 * else what kind of reference the question carries.
 */
export function sourceLineAfterAnswer(question, { hasWikiRefs = false } = {}) {
  if (question?.examOrigin) return readableSource(question.examOrigin);
  if (typeof question?.source === 'string') return readableSource(humanSource(question.source).replace(/\.pdf.*$/, '.pdf'));
  return hasWikiRefs ? 'มีข้อมูลอ้างอิง Wiki' : 'มีแหล่งอ้างอิง';
}
