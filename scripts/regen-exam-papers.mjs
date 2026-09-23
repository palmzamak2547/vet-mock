#!/usr/bin/env node
/**
 * regen-exam-papers.mjs
 *
 * Writes src/data/exam-papers.generated.js: which papers each subject sits,
 * read straight off the faculty's exam timetable.
 *
 * Why a generated file rather than an import: exam-scope.js is reached from
 * the boot chunk (buildExamPool lives in App.jsx), and schedule.js carries
 * both years of exam timetables, class timetables, milestones and campus
 * events — the same ~9 KB semester.js was split out to avoid. This is the one
 * fact the pool needs from it, at a few hundred bytes.
 *
 * Usage:  node scripts/regen-exam-papers.mjs [--check]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sameGenerated } from './lib/same-generated.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/exam-papers.generated.js');
const { EXAM_SCHEDULE } = await import(pathToFileURL(path.join(ROOT, 'src/data/schedule.js')).href);

const papers = new Map();
for (const entries of Object.values(EXAM_SCHEDULE)) {
  for (const e of entries || []) {
    if (!e?.subject || !e?.term) continue;
    const rec = papers.get(e.subject) || new Set();
    rec.add(e.term);
    papers.set(e.subject, rec);
  }
}

const rows = [...papers.entries()]
  .map(([subject, terms]) => {
    const mid = terms.has('midterm');
    const fin = terms.has('final');
    return [subject, mid && fin ? 'both' : mid ? 'midterm' : fin ? 'final' : 'none'];
  })
  .sort((a, b) => a[0].localeCompare(b[0]));

// Which years the timetable actually covers. A subject in a covered year that
// the timetable never names sits no written paper (POA in 2569-1); a subject
// whose whole year is absent is simply unknown, not continuous.
const coveredYears = Object.keys(EXAM_SCHEDULE)
  .map((k) => Number(String(k).replace(/^y/, '')))
  .filter((n) => Number.isFinite(n))
  .sort((a, b) => a - b);

const body = rows.map(([s, v]) => `  '${s}': '${v}',`).join('\n');
const file = `// ============================================================
// exam-papers.generated.js — AUTO-GENERATED, do NOT hand-edit
// ============================================================
// Which papers each subject sits, from EXAM_SCHEDULE in data/schedule.js.
// Run \`npm run regen:exam-papers\` after the faculty timetable changes;
// \`lint:exam-scope\` fails if this file has drifted from it.
//
// 'both'    — sits a midterm AND a final, so its TOPICS must say which paper
//             they belong to (that split is the whole point of the phase pick).
// 'midterm' — sits only a midterm: everything in the subject is midterm scope.
// 'final'   — sits only a final: nothing in it can appear on a midterm.
// A subject absent from this map sits no written paper in the timetable at
// all; exam-scope.js reads that as 'continuous'.
// ============================================================

export const SUBJECT_PAPERS = Object.freeze({
${body}
});

/** Years whose exam timetable is published, so "not listed here" means "sits
 *  no written paper" rather than "we have not got that year's timetable". */
export const PAPER_COVERED_YEARS = Object.freeze([${coveredYears.join(', ')}]);
`;

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (!sameGenerated(current, file)) {
    console.error('❌ src/data/exam-papers.generated.js is stale — run: npm run regen:exam-papers');
    process.exit(1);
  }
  console.log(`✅ exam-papers.generated.js matches the timetable (${rows.length} subjects)`);
} else {
  fs.writeFileSync(OUT, file, 'utf8');
  console.log(`✓ wrote ${rows.length} subjects → src/data/exam-papers.generated.js`);
}
