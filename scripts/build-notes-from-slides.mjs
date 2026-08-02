#!/usr/bin/env node
// ============================================================
// build-notes-from-slides.mjs — turn extracted lecture decks into notes files
// ============================================================
// Usage:
//   node scripts/build-notes-from-slides.mjs <topics.json>          # report
//   node scripts/build-notes-from-slides.mjs <topics.json> --write  # generate
//
// Input is the per-deck extraction output: topicId, title, lecturer, icon,
// summary, and sections that each cite a slide page.
//
// Two destinations, because the subjects are in different states:
//   • avian-medicine has no notes file at all — one is created
//   • epidemiology already has four topics — the new ones are merged in, and
//     the existing four are re-emitted from the live module rather than
//     re-parsed from the file, so nothing already written can be damaged by a
//     regex that did not quite fit.
//
// Refuses to overwrite an existing topic. A deck is a new article, never a
// silent replacement of one somebody already reviewed.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { SUBJECTS } from '../src/data/curriculum.js';

const [, , FILE] = process.argv;
const WRITE = process.argv.includes('--write');
if (!FILE) { console.error('usage: build-notes-from-slides.mjs <topics.json> [--write]'); process.exit(2); }

const incoming = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const TARGETS = {
  'avian-medicine': { file: 'src/data/notes-y5-avian-medicine.js', symbol: 'NOTES_Y5_AVIAN_MEDICINE', existing: null },
  epidemiology: { file: 'src/data/notes-y5-epidemiology.js', symbol: 'NOTES_Y5_EPIDEMIOLOGY', existing: 'NOTES_Y5_EPIDEMIOLOGY' },
};

// which subject each incoming topic belongs to, taken from the curriculum
// rather than trusted from the extraction
const subjectOf = new Map();
for (const s of SUBJECTS) for (const t of (s.topics || [])) subjectOf.set(t.id, s.id);

const bySubject = new Map();
const rejected = [];
for (const t of Object.values(incoming)) {
  const subject = subjectOf.get(t.topicId);
  if (!subject) { rejected.push(`${t.topicId}: not a topic in curriculum.js`); continue; }
  if (!TARGETS[subject]) { rejected.push(`${t.topicId}: no notes file configured for subject '${subject}'`); continue; }
  if (!t.sections?.length) { rejected.push(`${t.topicId}: no sections`); continue; }
  const bad = (t.sections || []).filter((s) => !s.source || !/p\.\s*\d/.test(s.source));
  if (bad.length) { rejected.push(`${t.topicId}: ${bad.length} section(s) cite no slide page`); continue; }
  if (!bySubject.has(subject)) bySubject.set(subject, []);
  bySubject.get(subject).push(t);
}

const HEADER = (subjectName, code) => `// ============================================================
// ${subjectName} — Study Notes
// ============================================================
// เขียนจาก lecture ${code} ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
// พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหานอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// Body item types:
//   { bullets: [string] }        — bulleted list
//   { sub, body }                — sub-section
//   { callout, kind }            — kind: 'tip' | 'warn' | 'flag'
//   { text }                     — paragraph
// ============================================================
`;

const toTopic = (t) => ({
  topic: t.topicId,
  title: t.title,
  lecturer: t.lecturer || undefined,
  icon: t.icon || '📄',
  summary: t.summary,
  sections: t.sections.map((s) => ({ heading: s.heading, source: s.source, body: s.body })),
});

let report = [];
for (const [subject, topics] of bySubject) {
  const target = TARGETS[subject];
  const meta = SUBJECTS.find((s) => s.id === subject);
  const full = path.join(process.cwd(), target.file);

  let merged = {};
  if (target.existing && fs.existsSync(full)) {
    // read the live module, not the file text — existing content is data and
    // re-emitting it from the parsed object cannot mangle what is already there
    const mod = await import(`file:///${full.replace(/\\/g, '/')}`);
    merged = { ...(mod[target.existing] || {}) };
  }

  const added = [], skipped = [];
  for (const t of topics) {
    if (merged[t.topicId]) { skipped.push(t.topicId); continue; }
    merged[t.topicId] = toTopic(t);
    added.push(t.topicId);
  }

  report.push({ subject, file: target.file, added, skipped, total: Object.keys(merged).length });

  if (WRITE) {
    const body = `${HEADER(meta?.name || subject, meta?.code || '')}
export const ${target.symbol} = ${JSON.stringify(merged, null, 2)};
`;
    fs.writeFileSync(full, body);
  }
}

for (const r of report) {
  console.log(`${r.subject.padEnd(18)} ${r.file}`);
  console.log(`  added   : ${r.added.length ? r.added.join(', ') : '(none)'}`);
  if (r.skipped.length) console.log(`  skipped : ${r.skipped.join(', ')} (already present — not overwritten)`);
  console.log(`  topics in file: ${r.total}`);
}
if (rejected.length) {
  console.log(`\nrejected (${rejected.length}):`);
  for (const r of rejected) console.log(`  ✗ ${r}`);
}
console.log(WRITE ? '\n✅ written' : '\n(dry run — pass --write to generate)');
