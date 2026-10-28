// ============================================================
// exam-origin-parse.js: which cohort sat it, on which paper, in which year
// ============================================================
// Palm, 2026-10-28: "เราจะได้สถิติว่าข้อไหน หรือแนวโน้มแบบไหน ที่ออกซ้ำข้าม
// หลายรุ่นได้นะครับ". Counting what recurs across cohorts needs, for each
// question, the cohort that SAT the paper it came from. The bank holds that
// only as prose: `examOrigin` says whose paper a question sat on, `source`
// names the document it was transcribed from. This module is the one place
// that reads a cohort, a paper and a year out of those strings.
//
// It answers null whenever the string does not say, and it never guesses.
// Three readings look like a cohort and are not one:
//
//   - A file label. "Swine Repro Mid 86", "COM I Final 86", "TJ86" and
//     "ชีทรุ่นพี่ 86" name the cohort a compilation was gathered FOR, not one
//     that sat anything: Palm is Vet 86, and the items inside come from
//     senior cohorts. Only a designator (Vet 85, VET84, CUVET86, รุ่น 85,
//     รุ่นพี่ Vet 85) can name a sitting cohort; a bare "<paper> 86" never does.
//   - An author. "รวบรวมโดยรุ่นพี่ Vet 85", "(Vet 85 compilation)", "Vet 83
//     update commentary", "jubing vet86" name who wrote or annotated a
//     document. A Vet 85 compilation of old papers can hold Vet 83's items,
//     so reading the author as the sitter would invent recurrences.
//   - A recording. `verified` cites "VET86 <video id> [12:06]", the cohort's
//     own lecture recordings. That field is never read here.
//
// Two fields, two contracts, one parser:
//   field 'examOrigin' (default): the field means "whose paper it sat on", so
//     a designator that is not marked as an author IS the sitting cohort.
//   field 'source': the field names a document, so a designator counts only
//     when its own clause says it records a sitting ("บันทึกหลังสอบของรุ่นพี่
//     Vet 85", "Poultry Final Vet 83").
//
// `cohort` has the shape EXAM_ORIGINS uses: a number, an ascending array when
// the string names several ("Vet 84-86 Final", "Vet 84 และ Vet 85"), or null.
// `paper` is one of PAPER_KINDS in exam-origins.js, or null when the string
// names none or names two. `year` is a Common Era year: Buddhist Era years in
// "รอบ 1/2569" and "25/5/65" are converted, an ISO date is a processing stamp
// ("Phase 3 PoC 2026-05-12") and is ignored, and two different years are null.
// ============================================================

/** Plausible cohort numbers: CUVET80-something today, with room either side. */
const COHORT_MIN = 70;
const COHORT_MAX = 99;

// "Vet 85", "VET84", "vet86", "CUVET86", "Vet 84-86", and the Thai forms
// "รุ่น 85", "รุ่นที่ 85", "รุ่นพี่ Vet 85", "รุ่น Vet 85". The Thai form is tried
// first so "รุ่นพี่ Vet 85" is one mention, not two. No lookbehind anywhere in
// this file (Safari before 16.4 cannot parse one, tests/unit/no-lookbehind),
// so "vet" inside a longer Latin word is skipped in code instead.
const DESIGNATOR = /รุ่น(?:ที่|พี่)?\s*(?:(?:cu)?vet\s*-?\s*)?(\d{2})(?!\d)|(?:cu)?vet\s*-?\s*(\d{2})(?:\s*[-–]\s*(\d{2}))?(?!\d)/giu;
const LATIN_LETTER = /[a-z]/i;

// Clause boundaries. Parentheses are not boundaries: "(Vet 85)" belongs to
// the description in front of it.
const SEPARATOR = /\s[·—–|]\s|;|,|\s\+\s/g;

// Words that make a designator the author or annotator of a document. Read
// in the designator's own clause before it, or as the first word after it.
const AUTHOR_BEFORE = /(?:รวบรวม|เรียบเรียง|สรุป|เอกสาร|โน้ต|ชีท|ตาราง|กล่อง|สไลด์|คาบเรียน|notes?\b|summary|compil|slides?\b|deck\b|update|cross-validated|author|\bby\b)/i;
const AUTHOR_AFTER = /^[\s)\],]*(?:compil|update|commentary|notes?\b|summary|annotated|margin|study\b|concept|reorgani[sz]|edit|modif|สรุป|จด|บันทึกไว้|คัด|เตรียม|ทำเครื่องหมาย)/i;
// "บันทึกหลังสอบของรุ่นพี่ Vet 85" is a post-exam record by the cohort that sat
// the paper; it outranks any document word earlier in the clause.
const SAT_RECORD_BEFORE = /บันทึกหลังสอบ(?:ของ)?\s*$/;
// In a document name, a designator is a sitting only beside one of these.
const SAT_WORD = /บันทึกหลังสอบ|recall|ออกสอบ|เคยออก|past\s*(?:paper|exam)|ข้อสอบ|exam\b|(?:^|[^a-z])(?:mid(?:-?\s?term)?|final)(?![a-z])|กลางภาค|ปลายภาค|ไฟนอล|quiz|osce/i;
// A handle written straight onto the designator ("jubing vet86") signs a document.
const HANDLE_BEFORE = /(?:^|\s)[a-z][a-z0-9_.]*\s*$/;

const PAPERS = [
  ['midterm', /(?:^|[^a-z])mid(?:-?\s?terms?)?(?![a-z])|กลางภาค/i],
  ['final', /(?:^|[^a-z])finals?(?![a-z])|ไฟนอล|ปลายภาค/i],
  ['quiz', /(?:^|[^a-z])quiz(?![a-z])|online\s+test/i],
  ['osce', /(?:^|[^a-z])osce(?![a-z])/i],
  ['station', /สถานี|(?:^|[^a-z])station(?![a-z])/i],
];

const ISO_DATE = /(^|\D)\d{4}-\d{2}-\d{2}(?!\d)/g;
const CE_YEAR = /(?:^|[^\d/])(19[89]\d|20[0-4]\d)(?![\d/])/g;
const BE_ROUND = /รอบ\s*\d\s*\/\s*(25\d\d)(?!\d)/g;
const BE_SHORT_DATE = /(?:^|[^\d/])\d{1,2}\/\d{1,2}\/(\d{2})(?![\d/])/g;

// NFC, then the one decomposed spelling PDF extraction leaves behind
// (nikhahit + sara aa for sara am), so "ทำเครื่องหมาย" matches either way.
function prepare(text) {
  if (typeof text !== 'string') return '';
  return text.normalize('NFC').replace(/\u0E4D\u0E32/g, '\u0E33').trim();
}

function inRange(n) {
  return Number.isInteger(n) && n >= COHORT_MIN && n <= COHORT_MAX;
}

function clauseBounds(text, at) {
  let start = 0;
  let end = text.length;
  for (const m of text.matchAll(SEPARATOR)) {
    if (m.index + m[0].length <= at) start = m.index + m[0].length;
    else if (m.index >= at) { end = m.index; break; }
  }
  return [start, end];
}

/** The cohorts one designator names: 85, or 84..86 for a range. */
function cohortsOfMention(m) {
  const first = Number(m[1] ?? m[2]);
  const last = m[3] != null ? Number(m[3]) : first;
  if (!inRange(first) || !inRange(last) || last < first || last - first > 6) return [];
  const out = [];
  for (let n = first; n <= last; n++) out.push(n);
  return out;
}

function mentionRole(text, m, field) {
  const at = m.index;
  const end = at + m[0].length;
  const [clauseStart, clauseEnd] = clauseBounds(text, at);
  const before = text.slice(clauseStart, at);
  const after = text.slice(end, clauseEnd);
  if (text[at - 1] === '#') return 'author';
  if (SAT_RECORD_BEFORE.test(before)) return 'sat';
  if (AUTHOR_BEFORE.test(before) || AUTHOR_AFTER.test(after)) return 'author';
  const sitting = SAT_WORD.test(before) || SAT_WORD.test(after);
  if (/^vet/.test(m[0]) && HANDLE_BEFORE.test(before) && !sitting) return 'author';
  if (field === 'source') return sitting ? 'sat' : 'unknown';
  return 'sat';
}

function readCohort(text, field) {
  const found = new Set();
  for (const m of text.matchAll(DESIGNATOR)) {
    if (m[2] != null && LATIN_LETTER.test(text[m.index - 1] || '')) continue;
    if (mentionRole(text, m, field) !== 'sat') continue;
    for (const n of cohortsOfMention(m)) found.add(n);
  }
  const list = [...found].sort((a, b) => a - b);
  if (!list.length) return null;
  return list.length === 1 ? list[0] : list;
}

function readPaper(text) {
  const named = PAPERS.filter(([, re]) => re.test(text)).map(([kind]) => kind);
  return named.length === 1 ? named[0] : null;
}

function readYear(text) {
  const plain = text.replace(ISO_DATE, '$1 ');
  const years = new Set();
  for (const m of plain.matchAll(CE_YEAR)) years.add(Number(m[1]));
  for (const m of plain.matchAll(BE_ROUND)) years.add(Number(m[1]) - 543);
  for (const m of plain.matchAll(BE_SHORT_DATE)) {
    const yy = Number(m[1]);
    // Thai short dates carry the Buddhist Era year: 25/5/65 is 25 May 2565.
    if (yy >= 50 && yy <= 99) years.add(2500 + yy - 543);
  }
  return years.size === 1 ? [...years][0] : null;
}

/**
 * Read `{ cohort, paper, year }` from one provenance string.
 * @param {string} text the value of `examOrigin` or `source`
 * @param {{ field?: 'examOrigin' | 'source' }} [options]
 */
export function parseProvenance(text, { field = 'examOrigin' } = {}) {
  if (field !== 'examOrigin' && field !== 'source') throw new Error(`parseProvenance: unknown field ${field}`);
  const s = prepare(text);
  if (!s) return { cohort: null, paper: null, year: null };
  return { cohort: readCohort(s, field), paper: readPaper(s), year: readYear(s) };
}

/** `parseProvenance` for the `examOrigin` field. */
export const parseExamOrigin = (text) => parseProvenance(text, { field: 'examOrigin' });

/** Whether the string names a cohort with a designator (Vet 85, รุ่น 85), in any role. */
export function namesCohort(text) {
  const s = prepare(text);
  for (const m of s.matchAll(DESIGNATOR)) {
    if (m[2] != null && LATIN_LETTER.test(s[m.index - 1] || '')) continue;
    if (cohortsOfMention(m).length) return true;
  }
  return false;
}

// "Mid 86", "Final 86", "DC3final 86", "TJ86", "final85": a paper word or TJ
// followed by a cohort number, with no designator.
const FILE_LABEL = /(?:^|[^a-z])(?:mid(?:-?\s?term)?|finals?|tj)\s*-?\s*(\d{2})(?!\d)/gi;

/**
 * The cohorts a string names only as a file label: the cohort a compilation
 * was gathered FOR ("Swine Repro Mid 86", "HHM Ruminant Final TJ86"), never
 * one that sat the paper. Each TJ86 file is headed as senior recall notes
 * compiled for Vet 86 before 86 sat anything; its blocks, where they say,
 * name 85 or 84.
 */
export function compiledForCohorts(text) {
  const found = new Set();
  for (const m of prepare(text).matchAll(FILE_LABEL)) {
    const n = Number(m[1]);
    if (inRange(n)) found.add(n);
  }
  return [...found].sort((a, b) => a - b);
}

/** A parsed (or EXAM_ORIGINS) cohort value as an ascending array. */
export function cohortList(cohort) {
  if (Array.isArray(cohort)) return cohort.filter(inRange).sort((a, b) => a - b);
  return inRange(cohort) ? [cohort] : [];
}
