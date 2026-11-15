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
import { humanSource } from './source-label.js';
import { SUBJECTS } from '../data/curriculum.js';
// Both read by scripts/lint-source-line.mjs with the Node-only check and the
// parser, so the browser carries two short lists instead of either.
import { TOPIC_CHIP_HELD, COHORT_UNCONFIRMED } from '../data/source-line.generated.js';

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

/** Shown beside the line while the full source waits for the key. Short, so
 *  on a phone the kind of source keeps the room ("ข้อสอบเก่า Vet 85 กลางภาค"). */
export const SOURCE_LINE_WAIT = 'ดูเต็มหลังเฉลย';

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
  const list = (Array.isArray(cohort) ? cohort : [cohort]).filter(Number.isInteger).sort((a, b) => a - b);
  return list.length ? `Vet ${list.join(', ')}` : '';
}

/**
 * The line a student reads while the question is open: the kind of source,
 * and for a past paper the cohort that sat it and the paper, as filed.
 * "ข้อสอบเก่า Vet 85 ปลายภาค", "อิงแนวข้อสอบ", "เขียนจากเนื้อหาที่เรียน".
 *
 * A filed cohort shows only where exam-origin-parse.js, the one reader of who
 * sat a paper, finds the same one. On 30 legacy origins the filing copies a
 * file label's number ("COM I Final 86", "Swine Herd Mid TJ86"), a cohort the
 * file was gathered FOR, and "Vet 86" there would claim Vet 86 sat it; the
 * lint lists those in COHORT_UNCONFIRMED until the filing is corrected.
 */
export function sourceLineBeforeAnswer(question) {
  const kind = sourceKind(question);
  if (kind !== 'past') return SOURCE_KIND_LABEL[kind];
  const origin = question?.examOrigin;
  const filed = originEntry(origin);
  const paper = filed?.kind === 'paper' ? filed : null;
  const cohort = paper && !COHORT_UNCONFIRMED.has(origin) ? paper.cohort : null;
  return [SOURCE_KIND_LABEL.past, cohortLabel(cohort), PAPER_LABEL[paper?.paper] || '']
    .filter(Boolean)
    .join(' ');
}

// Stored origins join their parts with "·" (exam-origins.js keys them that
// way); a student reads commas. The stored text is never rewritten.
export const readableSource = (s) => String(s).replace(/\s*·\s*/g, ', ');

// ── The topic chip in the card's meta row ────────────────────────────────
// The same rule holds above the stem: on 129 questions the topic label alone
// named the key ("Autoimmune Skin Diseases" above "Sebaceous Adenitis
// เป็นโรคที่"). Which labels would is decided by scripts/lint-source-line.mjs
// with the same check, written to source-line.generated.js (the browser has
// no Thai word segmenter on iOS 14, and a second rule in the browser could
// drift from the lint's). The card prints TOPIC_CHIP_WAIT in the label's
// place until the key is on screen.

/** The topic as the card prints it: a "คาบ 3, " session prefix is dropped. */
export const topicChipText = (label) => String(label ?? '').replace(/^คาบ\s*\d+(-\d+)?\s*,\s*/, '');

/** Shown where a held topic label will appear. */
export const TOPIC_CHIP_WAIT = 'หัวข้อแสดงหลังเฉลย';

/**
 * The tags as a student can read them: a tag that is a topic's id becomes that
 * topic's label, and a tag that is only a working slug ("placentation-types")
 * is left out. The panel drops its row when nothing is left.
 */
let topicLabels = null;
export function tagTopicLabels(question) {
  if (!Array.isArray(question?.tags) || !question.tags.length) return [];
  if (!topicLabels) {
    topicLabels = new Map();
    for (const s of SUBJECTS) for (const t of s.topics || []) if (!topicLabels.has(t.id)) topicLabels.set(t.id, topicChipText(t.label));
  }
  return [...new Set(question.tags.map((t) => topicLabels.get(t)).filter(Boolean))];
}

/** Whether this question's topic label waits for the key. */
export const holdsTopicChip = (question) => TOPIC_CHIP_HELD.has(`${question?.subject}:${question?.id}`);

// ── The caution chip under the stem ──────────────────────────────────────
// A label earns a place on the card only when it changes what the student
// does with the answer (Palm, 11 Nov 2026: "อย่าให้มันเยอะไปจนน่ารำคาญ").
// A disputed key does: the chip is for `severity: 'major'` alone. A minor
// flag is a note on the source, read in the panel ("ดูเต็ม") as หมายเหตุ;
// an unclear flag is withheld from delivery (question-prediction.js).

/** Whether the card draws the caution chip for this flag. */
export const cautionChipShown = (flag) => flag?.severity === 'major';

/** The chip's words, the same before and after the answer; its note opens
 *  only once the key is on screen (Question.jsx). */
export const CAUTION_CHIP_TEXT = 'ข้อควรระวัง';

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
