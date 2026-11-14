// ============================================================
// library-pii.mjs — what never becomes a public library document
// ============================================================
// On 2 Nov 2026 two score announcements were found public in library_docs:
// com4 "คะแนนสอบ Midterm (คะแนนดิบ)", whose seven pages of text were
// searchable, and poultry "คะแนนกลางภาค", a spreadsheet. Two more had been
// archived by hand on 20 Oct. The rule "never ingest a score announcement"
// lived only in notes, so this module is that rule, shared by every step that
// can let one in:
//   - scripts/mcv-manifest.mjs leaves the file out of the manifest and says why;
//   - publicationMetadata() in scripts/ingest-library.mjs refuses it, which
//     covers ingest-library.mjs and ingest-local-docs.mjs before any byte is
//     read, and scripts/upload-library-doc.mjs refuses its --title;
//   - scripts/audit-library-pii.mjs lists any public row that carries one;
//   - scripts/mcv-sync.mjs holds it, and holds a title that reads as a list of
//     students (rosterReason, below) for a person to decide.
//
// The title test is deliberately narrow. คะแนน alone is "score" in every sense
// ("Class 10 G.6 คะแนน PISA ลดลง" is a lecture topic, "รายงาน 10 คะแนน" an
// assignment's weight), and "grade" or เกรด alone is a tumour grade, a murmur
// grade or a carcass grade. A file whose title says nothing is caught by its
// content instead: library-pages.py holds a page of student IDs whatever the
// document is called.

// สอบ followed by these is not an exam: สอบสวน (investigate, so ผลการสอบสวนโรค
// is an outbreak report), สอบเทียบ (calibrate), สอบถาม (ask), สอบทาน (audit).
const EXAM_TH = 'สอบ(?!สวน|เทียบ|ถาม|ทาน)';
const EXAM_EN = String.raw`(?:mid-?\s?terms?|finals?|exams?|examinations?|quiz(?:zes)?)`;

// First match wins, so the most specific reason comes first.
const RULES = [
  ['คะแนนสอบ (exam scores)', new RegExp(`คะแนน\\s*(?:การ\\s*)?${EXAM_TH}`)],
  ['คะแนน with a paper or a mark type', new RegExp(
    String.raw`คะแนน\s*(?:กลางภาค|ปลายภาค|มิดเทอม|ไฟนอล|ควิซ|เก็บ|ดิบ|ภาคปฏิบัติ|ปฏิบัติการ|แล็?[บป]|(?:ของ)?นิสิต|`
    + String.raw`(?:${EXAM_EN}|labs?|raw)\b)`, 'i')],
  ['ประกาศคะแนน (score announcement)', /ประกาศ\s*(?:ผล\s*)?คะแนน/],
  ['สรุปคะแนน, แจ้งคะแนน or ใบคะแนน', /(?:สรุป|แจ้ง|ใบ)\s*คะแนน/],
  ['ผลสอบ (exam results)', new RegExp(`ผล\\s*(?:การ\\s*)?${EXAM_TH}`)],
  ['ผลการเรียน (course results)', /ผล\s*การ\s*เรียน(?!\s*รู้)/],
  ['a grade announcement', /ประกาศ\s*(?:ผล\s*)?เกรด|เกรด\s*(?:ของ)?(?:นิสิต|รายวิชา|ประจำภาค|กลางภาค|ปลายภาค|เฉลี่ย|สะสม)/],
  ['a bare score heading', /^(?:ประกาศ\s*)?(?:คะแนน|เกรด|scores?|grades?|marks?)[\s\d()./:-]*$/i],
  ['an exam with its scores', new RegExp(
    String.raw`\b(?:${EXAM_EN}|practicals?|osce|course|semester|students?)\b[\s\d:.()#-]*(?:exams?\s*)?(?:raw\s*)?(?:scores?|grades?|marks?)\b`, 'i')],
  ['an exam with its results', new RegExp(String.raw`\b(?:mid-?\s?terms?|exams?|examinations?|quiz(?:zes)?)\b[\s\d:.()#-]*results?\b`, 'i')],
  ['scores of an exam', new RegExp(
    String.raw`\b(?:raw\s*)?(?:scores?|grades?|marks?)\b[\s:.()-]*(?:(?:of|for)\s+(?:the\s+)?)?${EXAM_EN}\b`, 'i')],
  ['a score sheet or grade report', new RegExp(
    String.raw`\bscores?\s*(?:sheets?|announcements?)\b|\bgrades?\s*(?:sheets?|announcements?|reports?|lists?|books?)\b|`
    + String.raw`\bmarks?\s*(?:sheets?|lists?)\b|\bgradebook\b|\bgpax?\b|\braw\s*scores?\b`, 'i')],
];

// The forms a MyCourseVille name arrives in (see cleanDisplayText in
// ingest-library.mjs): Thai flattened to "u0e04u0e30…", a backslash left in
// front of each Thai letter, HTML entities, underscores for spaces. A title is
// tested as a person would read it.
export function readableTitle(s) {
  return String(s ?? '')
    .replace(/(?:u0e[0-9a-f]{2})+/gi, (run) => run.match(/u0e[0-9a-f]{2}/gi)
      .map((c) => String.fromCharCode(parseInt(c.slice(1), 16))).join(''))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/gi, '&')
    .replace(/\\(?=[฀-๿/])/g, '')
    .normalize('NFC')
    .replace(/ํา/g, 'ำ') // ํา typed as two marks reads as ำ
    .replace(/[_\s]+/g, ' ')
    .trim();
}

function firstRule(title, rules) {
  const text = readableTitle(title);
  if (!text) return null;
  for (const [reason, re] of rules) {
    const m = text.match(re);
    if (m) return { reason, text, matched: m[0].trim() };
  }
  return null;
}

/** The rule a title breaks, or null. */
export function scoreTitleMatch(title) {
  return firstRule(title, RULES);
}

export const isScoreTitle = (title) => Boolean(scoreTitleMatch(title));

// A list of students: who is in the class, in which group, in which seat, who
// attended. Unlike a score announcement it is not refused everywhere, because a
// person may still decide to shelve one. It is what scripts/mcv-sync.mjs holds
// by title, since nobody reads a file between MyCourseVille and the shelf there
// and the title is the only place a scanned sheet or a spreadsheet says what it
// is (library-pages.py reads text, and only a PDF's).
//
// Calibrated on 13 Nov 2026 over the 2,167 library rows (title, folder, file
// name): 39 match. 34 are lists of students: 31 the text check had already
// held, and two scanned attendance sheets and a spreadsheet it could not read.
// The other 5 a person would let through (two lab lists called รายชื่อ in the
// file name only, two decks filed in a folder that also holds a roster, a blank
// sign-in form). รายชื่อ is "list of names", and an anatomy lab's list of
// structures is titled the same way ("รายชื่อที่สำคัญในปฏิบัติการ integument",
// "รายชื่อสิ่งที่ต้องรู้…"), so those three continuations pass and every other
// รายชื่อ is held. กลุ่ม alone is not a signal ("PBL สำหรับกลุ่มที่ 1" is the case
// handed to a group), and "group assignment" is a task as often as an allocation.
const ROSTER_RULES = [
  ['a list of names (รายชื่อ)', /รายชื่อ(?!\s*(?:ที่สำคัญ|สิ่งที่|ใน\s*ปฏิบัติการ))/],
  ['a group allocation', /(?:แบ่ง|จัด)\s*กลุ่ม|กลุ่ม\s*(?:ของ\s*)?นิสิต/],
  ['an attendance record', /เช็[คก]\s*ชื่อ|ใบ\s*ลง\s*ชื่อ|(?:สรุป|ผล|ประกาศ|บันทึก)\s*(?:ผล\s*)?(?:การ\s*)?เข้า\s*(?:ชั้น\s*)?เรียน/],
  ['a seat or examinee list', /ที่นั่ง|ผัง\s*(?:ห้อง\s*)?สอบ|ผู้\s*(?:เข้า|มี\s*สิทธิ์?)\s*สอบ/],
  ['a list of students', new RegExp(
    String.raw`\b(?:name|student|class|group|seat(?:ing)?)s?\s*lists?\b|\blists?\s+of\s+(?:students?|names?|groups?|members?)\b|`
    + String.raw`\broster\b|\battendance\b|\bseating\b|\bseat\s*(?:plan|chart|map|no|numbers?)\b|\bgroup\s*(?:members?|allocation)\b|`
    + String.raw`\bsign[- ]?(?:in|up)\s*sheets?\b`, 'i')],
];

/** The roster rule a title matches, or null. */
export function rosterTitleMatch(title) {
  return firstRule(title, ROSTER_RULES);
}

// A file name, from a local path or a URL: last segment, decoded, without its
// extension or MyCourseVille's "-<upload id>-<timestamp>" tail.
function fileStem(p) {
  const last = String(p ?? '').split(/[?#]/)[0].split(/[\\/]/).pop() || '';
  let name = last;
  try { name = decodeURIComponent(last); } catch { /* keep it as it came */ }
  return name.replace(/\.[a-z0-9]{1,5}$/i, '').replace(/-\d{4,}-\d{8,}$/, '');
}

/** Why a manifest item (MCV or local) must not enter the library, or null.
 *  Reads the title it would carry, its MCV folder and its file name; not a
 *  free-text description, where "สัดส่วนคะแนนสอบ 40%" is a syllabus line. */
export function scoreSheetReason(item = {}) {
  return titledReason(item, scoreTitleMatch);
}

/** Why a manifest item reads as a list of students, groups, seats or attendance,
 *  or null. Same fields as scoreSheetReason. */
export function rosterReason(item = {}) {
  return titledReason(item, rosterTitleMatch);
}

function titledReason(item, match) {
  const fields = [
    ['name', item.name], ['title', item.title], ['folder', item.folder],
    ['file', fileStem(item.path)], ['file', fileStem(item.url)], ['file', fileStem(item.sourceUrl ?? item.source_url)],
  ];
  for (const [field, value] of fields) {
    const hit = match(value);
    if (hit) return `${field} "${hit.text}" reads as ${hit.reason} ("${hit.matched}")`;
  }
  return null;
}

// A Chula student ID is ten digits: the entry year (two digits of the
// Buddhist year), a programme digit, a five-digit running number and the
// faculty (31 is Veterinary Science). library-pages.py holds a document with
// one contiguous vet ID; a roster or score sheet is caught here by count, IDs
// of any faculty, contiguous or grouped the way the com4 sheet printed them
// ("653 xxxxx 31", which the contiguous pattern never saw). The pattern is
// written to mean the same in Python, JavaScript and Postgres: library-pages.py
// carries this exact string (a unit test compares them) and the audit runs it
// in SQL. Calibrated on 7 Nov 2026 over all 55,118 stored pages: every page
// with 3 or more was a roster, an attendance sheet, a score sheet or a group
// report listing its members; the most an ordinary page reached was 1 (a dairy
// sire catalogue's registration numbers).
export const ROSTER_ID_PATTERN = '(?<![0-9.,])[4-7][0-9][ -]?[3-8][ -]?[0-9]{5}[ -]?[2-5][0-9](?![0-9])';
export const ROSTER_IDS = 3;
