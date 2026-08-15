// Assemble drafted Year-2 topic JSON into a notes module.
//
// The drafting agents write one JSON per topic; this turns the directory into
// src/data/notes-y2-<subject>.js. Assembly is deterministic on purpose — the
// agents propose content, nothing they produce reaches the repo without the
// topic id matching curriculum.js first, so a note can never attach to an
// article that does not exist.
//
//   node scripts/build-y2-notes.mjs --subject vet-neuroanat --in <dir> [--write]

import fs from 'node:fs';
import path from 'node:path';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const SUBJECT = argOf('--subject', null);
const IN = argOf('--in', null);
const WRITE = process.argv.includes('--write');
if (!SUBJECT || !IN) { console.error('need --subject and --in'); process.exit(1); }

const subject = (SUBJECTS_BY_YEAR[2] || []).find((s) => s.id === SUBJECT);
if (!subject) { console.error(`✗ ${SUBJECT} is not a year-2 subject`); process.exit(1); }
const known = new Map((subject.topics || []).map((t) => [t.id, t]));

const files = fs.readdirSync(IN).filter((f) => f.endsWith('.json')).sort();
if (!files.length) { console.error(`✗ no drafts in ${IN}`); process.exit(1); }

// Anything that would put a person into the repo. The extraction already drops
// files named after someone, but a deck can print a name on a slide, so the
// text is swept again on the way in.
const IDENTITY = [
  /\b\d{10}\b/,                       // student id
  /line\s*id\s*[:：]/i,
  /@[A-Za-z0-9_.]{3,}/,               // handle
];

const notes = {};
const problems = [];
let sectionCount = 0;

for (const f of files) {
  let draft;
  try { draft = JSON.parse(fs.readFileSync(path.join(IN, f), 'utf8')); }
  catch (e) { problems.push(`${f}: not valid JSON (${e.message})`); continue; }

  const topic = known.get(draft.topicId);
  if (!topic) { problems.push(`${f}: topicId "${draft.topicId}" is not a topic of ${SUBJECT}`); continue; }
  if (!Array.isArray(draft.sections) || !draft.sections.length) {
    problems.push(`${f}: no sections`); continue;
  }

  const flat = JSON.stringify(draft);
  for (const re of IDENTITY) {
    const m = flat.match(re);
    if (m) problems.push(`${f}: looks like it carries an identity (${m[0].slice(0, 24)})`);
  }

  notes[draft.topicId] = {
    topic: draft.topicId,
    title: draft.title,
    icon: topic.icon || '📖',
    ...(draft.lecturer ? { lecturer: draft.lecturer } : {}),
    summary: draft.summary,
    sections: draft.sections,
  };
  sectionCount += draft.sections.length;
}

if (problems.length) {
  console.error('✗ refusing to build:');
  for (const p of problems) console.error(`   ${p}`);
  process.exit(1);
}

const slug = SUBJECT.replace(/^vet-/, '');
const CONST = `NOTES_Y2_${slug.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
const OUT = `src/data/notes-y2-${slug}.js`;

const header = `// ============================================================
// ${subject.name} (${subject.name_en}) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส ${subject.code} ที่แจกจริงในรายวิชา ทุก section
// อ้างอิงชื่อชุดสไลด์พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหา
// นอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// ชื่อ รหัสนิสิต และ handle ของบุคคลถูกตัดออกตั้งแต่ขั้นตอนสกัด
//
// Body item types:
//   { bullets: [string] }        — bulleted list
//   { sub, body }                — sub-section
//   { callout, kind }            — kind: 'tip' | 'warn' | 'flag'
//   { text }                     — paragraph
// ============================================================

export const ${CONST} = `;

const body = `${header}${JSON.stringify(notes, null, 2)};\n`;

if (!WRITE) {
  console.log(`would write ${OUT}`);
  console.log(`  ${Object.keys(notes).length} topics, ${sectionCount} sections, export ${CONST}`);
  for (const [id, n] of Object.entries(notes)) console.log(`   ${String(n.sections.length).padStart(3)}  ${id}`);
  process.exit(0);
}

fs.writeFileSync(OUT, body);
console.log(`✓ ${OUT} — ${Object.keys(notes).length} topics, ${sectionCount} sections`);
console.log(`  export ${CONST}`);
