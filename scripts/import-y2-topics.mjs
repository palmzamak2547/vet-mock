// Derive Year-2 curriculum topics from the real course file tree.
//
// The tree is Subject/<Midterm|Final|Lab...>/<lecture title>.pdf, so a file
// name IS the lecture title as the faculty distributed it. Nothing here reads
// a PDF — this only turns real file names into topic entries, so it stays
// cheap and re-runnable when a folder gains lectures.
//
// Three kinds of file live in those folders and only one becomes a topic:
//   lecture  — a lecture deck            → becomes a topic
//   summary  — a senior's own summary    → not a lecture, not a topic
//   admin    — syllabus, forms, images   → not a topic
// Anything carrying a person's identity is dropped outright and never named
// in the output.
//
// Fills empty topic arrays only, so re-run it after restoring curriculum.js.
//
//   node scripts/import-y2-topics.mjs [--root <path>] [--json <out>]

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const argOf = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i === -1 ? dflt : args[i + 1];
};

const ROOT = argOf('--root', 'C:/Users/palmz/Desktop/📚 เรียน/CUVET ปี 2');
const JSON_OUT = argOf('--json', null);

// Folder name → curriculum subject id. The two Gen-Ed folders are absent on
// purpose: they are university electives, not veterinary curriculum.
const SUBJECT_OF_FOLDER = {
  'Biochemistry II': 'biochem-2',
  'Prin Anl Hus II': 'husbandry-2',
  'Vet Anat II': 'vet-anat-2',
  'Vet Histol': 'vet-histo',
  'Vet Physiol I': 'vet-physio-1',
  'Vet Physiol lab I': 'vet-physio-lab-1',
  'ANI BREEDING': 'animal-breeding',
  'VET MICRO I': 'vet-microbio-1',
  'VET NEURO': 'vet-neuroanat',
  'VET PARASITOL I': 'vet-parasit-1',
  'VET PHYSIOL II': 'vet-physio-2',
  'VET PHYSIOL II LAB': 'vet-physio-lab-2',
  'VET PHYSIOL III': 'vet-physio-3',
};

// ── Classification ──────────────────────────────────────────────────────

// A file that carries somebody's identity. Dropped before anything else, and
// its name is never echoed into the report.
const IDENTITY = [
  /^\d{1,4}[_\s-]+[\u0E00-\u0E7F]/,      // "136_<ชื่อ>_<นามสกุล>"
  /\b\d{10}\b/,                           // student id
  /ของ[฀-๿]{2,}/,               // "PBL Case 6 Endocrine ของ<ชื่อ>"
  /รายชื่อ/,                               // a class name list
  /ตอบคำถาม[฀-๿]/,              // "…ตอบคำถาม<ชื่อ>สุดน่ารักก"
];

// Not a lecture: the student's own summary, or a past-paper compilation.
const SUMMARY = [
  /สรุป/, /โพย/, /^ติว/, /ชีท/, /รวมมิตร/,
  /\bsum(mary)?\b/i, /^finall+/i,
  /ติ๊กข้อสอบ/, /ข้อสอบ/,
];

// Not a lecture: course admin, schedules, textbooks, or lab checklists. A
// checklist is an aid for a lab that already has its own topic, and a textbook
// is a reference the course cites — neither is a lecture.
const ADMIN = [
  /^JPEG image/i, /^IMG[_\s]/i, /^Scan/i, /^image\b/i, /^Imagine$/i,
  /ประมวลรายวิชา/, /ปฏิทินการสอน/, /learning contract/i, /^LC format$/i,
  /course\s*syllabus/i, /^หน้าปก/, /^คำทักทาย$/, /เตือนความจำ/,
  /^Note เพิ่มเติม$/, /^First Class$/i, /orientation/i,
  /ตารางสอน/, /ตารางเรียน/, /ตารางบรรยาย/, /^ตาราง /, /\bschedule\b/i,
  /\b\d{1,2}(st|nd|rd|th)\s+edition\b/i, /\bedition\b/i, /\btextbook\b/i,
  /^atlas[-\s]/i, /\bdukes/i, /^comparative-veterinary-anatomy/i,
  /^CHAPTER-\d/i, /^DownloadChapter/i, /หนังสือ/,
  /che?c?k\s*-?\s*list/i, /^Slide Viewer /i,
  // A bare session number carries no subject matter, and a "รวม …" file is an
  // aggregate of labs that already have their own topics.
  /^lab\s*(ครั้งที่?)?\s*\d+\s*$/i, /^PBL\s*$/i, /^รวม\s+lab/i, /^Jod /i,
  /^Student View Point$/i, /แบบฝึกหัด/, /homework/i,
  /เปิดให้ถามคำถาม/, /^\d+\s*กับ/, /(ต้น|ปลาย)\s*25\d\d\s*$/,
  /summary\s*\d/i,
  /^physio[-\s]?(mid|lab)\b/i,
  /^\d{1,2}[\s-]\w{3}[\s-]?\d{2}$/,      // "1 Sep 66" — a class date, not a title
];

const match = (patterns, s) => patterns.some((re) => re.test(s));

// ── Title cleanup ───────────────────────────────────────────────────────

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;

function toLabel(base) {
  let s = base
    .replace(EMOJI, ' ')
    // LMS export suffix the download adds: "…-818387-16911211036017"
    .replace(/-\d{6}-\d{10,}\s*$/, '')
    .replace(/_/g, ' ')
    // leading lecture numbering: "01 ", "02.4 - ", "3."
    .replace(/^\s*\d{1,2}(\.\d{1,2})*\s*[-–.]?\s*/, '')
    // "Neuro exam anatomy2024 pdf.pdf" — the extension typed into the name
    .replace(/\s+pdf\s*$/i, '')
    // ".นิสิต" marks the student handout of a deck, not part of its title
    .replace(/\.นิสิต\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  // Trailing faculty annotations that are real information, kept verbatim
  // rather than invented, so leave them alone beyond whitespace.
  return s;
}

function slugify(subjectId, label) {
  const stem = label
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  // Keep the trailing digit. Physiology I, II and III are three separate
  // subjects, so collapsing them to one prefix would let a title that appears
  // in two of them produce one id.
  const prefix = subjectId.replace(/^vet-/, '');
  return `${prefix}--${stem}`;
}

// ── Walk ────────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.toLowerCase().endsWith('.pdf')) out.push(p);
  }
  return out;
}

if (!fs.existsSync(ROOT)) {
  console.error(`✗ course tree not found: ${ROOT}`);
  process.exit(1);
}

const bySubject = new Map();
const stats = { lecture: 0, summary: 0, admin: 0, identity: 0, unmapped: 0 };

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep);
  const folder = rel[1];                       // เทอม N / <folder> / ...
  const subjectId = SUBJECT_OF_FOLDER[folder];
  if (!subjectId) { stats.unmapped++; continue; }

  const base = path.basename(file, '.pdf');
  // Section = the exam block folder directly under the subject, when present.
  // A folder someone named after themselves marks the whole copy as theirs.
  const section = rel[2] && rel.length > 3 ? rel[2].replace(EMOJI, '').trim() : '';

  // Classify against the spaced form: half these files were saved with
  // underscores, so "Lab_check_list" has to read as "Lab check list".
  const probe = base.replace(/_/g, ' ').trim();
  if (match(IDENTITY, probe) || match(IDENTITY, section)) { stats.identity++; continue; }
  if (match(SUMMARY, probe)  || match(SUMMARY, section))  { stats.summary++;  continue; }
  if (match(ADMIN, probe))    { stats.admin++;    continue; }

  let label = toLabel(base);
  if (!label || label.length < 3) { stats.admin++; continue; }

  // "ไม่ออกสอบ" is the faculty saying the deck is background reading. Real
  // information, so it becomes a flag rather than noise inside the title.
  let notExamined = false;
  const NOT_EXAMINED = /\s*\(?\s*ไม่(ออก)?สอบ\s*\)?\s*/;
  if (NOT_EXAMINED.test(label)) {
    notExamined = true;
    label = label.replace(NOT_EXAMINED, ' ').replace(/\s{2,}/g, ' ').trim();
  }
  if (label.length < 3) { stats.admin++; continue; }

  if (!bySubject.has(subjectId)) bySubject.set(subjectId, []);
  const topic = { id: slugify(subjectId, label), label, section };
  if (notExamined) topic.notExamined = true;
  bySubject.get(subjectId).push(topic);
  stats.lecture++;
}

// The same lecture handed out in a lab folder and a lecture folder is one
// topic, so collapse on the title itself rather than on the slug.
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
for (const [id, list] of bySubject) {
  const seen = new Map();
  for (const t of list) {
    const k = norm(t.label);
    if (!seen.has(k)) seen.set(k, t);
    else if (!seen.get(k).section && t.section) seen.set(k, t);
  }
  bySubject.set(id, [...seen.values()]);
}

// ── Report ──────────────────────────────────────────────────────────────

const subjectIds = Object.values(SUBJECT_OF_FOLDER);
let total = 0;
for (const id of subjectIds) {
  const list = bySubject.get(id) || [];
  total += list.length;
  console.log(`\n${id}  (${list.length})`);
  for (const t of list) console.log(`  ${t.section ? `[${t.section}] ` : ''}${t.label}`);
}

console.log(`\n── ${total} topics across ${bySubject.size} subjects`);
console.log(`   lecture ${stats.lecture}  summary ${stats.summary}  admin ${stats.admin}  identity ${stats.identity}  gen-ed/unmapped ${stats.unmapped}`);

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(Object.fromEntries(bySubject), null, 2));
  console.log(`   wrote ${JSON_OUT}`);
}

// ── Apply to curriculum.js ──────────────────────────────────────────────
// The course tree only exists on the machine that holds the material, so this
// writes once rather than running as a build gate.

if (!args.includes('--apply')) {
  console.log('\n   (dry run — pass --apply to write into src/data/curriculum.js)');
  process.exit(0);
}

// The folder a deck sits in says what kind of session it belongs to. That is
// real information from the course, so it picks the icon.
const SECTION_ICON = [
  [/lab|ปฏิบัติการ/i, '🔬'],
  [/lecture|บรรยาย/i, '📖'],
  [/midterm/i, '📘'],
  [/final/i, '📗'],
  [/bacteria/i, '🦠'],
  [/fungi/i, '🍄'],
  [/virus/i, '🧬'],
];
const iconFor = (section) =>
  (SECTION_ICON.find(([re]) => re.test(section || ''))?.[1]) || '📄';

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const CURRICULUM = 'src/data/curriculum.js';
let src = fs.readFileSync(CURRICULUM, 'utf8');
const eol = src.includes('\r\n') ? '\r\n' : '\n';

let applied = 0;
for (const [subjectId, list] of bySubject) {
  if (!list.length) continue;

  const anchor = src.indexOf(`{ id: '${subjectId}',`);
  if (anchor === -1) { console.error(`✗ ${subjectId}: not found in ${CURRICULUM}`); process.exit(1); }
  const at = src.indexOf('topics: []', anchor);
  if (at === -1) { console.error(`✗ ${subjectId}: no empty topics array to fill`); process.exit(1); }

  const rows = list.map((t) => {
    const extra = t.notExamined ? ', notExamined: true' : '';
    return `        { id: '${esc(t.id)}', label: '${esc(t.label)}', icon: '${iconFor(t.section)}'${extra} },`;
  });
  const block = `topics: [${eol}${rows.join(eol)}${eol}      ]`;

  src = src.slice(0, at) + block + src.slice(at + 'topics: []'.length);
  applied++;
}

fs.writeFileSync(CURRICULUM, src);
console.log(`\n✓ wrote ${total} topics into ${applied} subjects in ${CURRICULUM}`);
