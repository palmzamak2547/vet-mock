#!/usr/bin/env node
// ============================================================
// regen-bank-registry.mjs — generate src/data/bank-registry.generated.js
// ============================================================
// Architecture L2 (Phase 2). Replaces the hand-maintained LOADERS array
// in questions.js. Scans every src/data/questions-*.js bank by ACTUALLY
// IMPORTING it (robust — no filename/regex guessing), detects:
//   • export name  — the array-valued export whose items look like Qs
//   • year         — derived from the questions' own `year` field
//                    (single distinct year → that year; mixed/none → null),
//                    with a CROSS_YEAR filename override for utility banks
//                    that must load for every year (vca/short/mahahon/termpaper)
//   • subjects     — distinct `subject` ids present
//   • count        — number of questions
//
// Emits a generated module exporting BANK_REGISTRY where each entry has a
// `load()` thunk built from a LITERAL import() string so Vite still
// chunk-splits per bank exactly like before.
//
// Usage:  node scripts/regen-bank-registry.mjs        (npm run regen:registry)
//         node scripts/regen-bank-registry.mjs --check  (CI: fail if stale)
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Line endings normalised before comparing. Git checks these files out
// with CRLF on Windows while the generator writes LF, so a byte-for-byte
// comparison called the file STALE on every Windows machine until someone
// regenerated locally — and then called it stale again after the next
// checkout. Same shape as the localeCompare collation bug this file
// already documents: a check that is red for reasons unrelated to its
// subject teaches people to ignore it.
const eol = (s) => String(s).replace(/\r\n/g, '\n');


const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const dataDir = path.join(root, 'src/data');
const outPath = path.join(dataDir, 'bank-registry.generated.js');

// Utility banks that intentionally load for EVERY year (cross-year /
// licensure prep / mixed compilations). Forces year:null regardless of
// the per-question year field. Keep TIGHT — matches the legacy hand-tag.
const CROSS_YEAR = new Set([
  'questions-vca.js',
  'questions-short.js',
  'questions-mahahon.js',
  'questions-termpaper.js',
]);

const checkMode = process.argv.includes('--check');

function looksLikeQuestion(x) {
  return x && typeof x === 'object' &&
    ('q' in x || 'options' in x || ('id' in x && 'answer' in x));
}

const files = fs.readdirSync(dataDir)
  .filter((f) => /^questions-.*\.js$/.test(f))
  .sort();

const entries = [];
const problems = [];

for (const file of files) {
  const mod = await import(pathToFileURL(path.join(dataDir, file)).href);
  // Find array-valued exports; prefer the one whose items look like Qs,
  // else the largest array.
  const arrays = Object.entries(mod).filter(([, v]) => Array.isArray(v));
  if (!arrays.length) { problems.push(`${file}: no array export found`); continue; }
  let pick = arrays.find(([, v]) => v.length && looksLikeQuestion(v[0]));
  if (!pick) pick = arrays.sort((a, b) => b[1].length - a[1].length)[0];
  const [exportName, arr] = pick;

  const years = new Set();
  const subjects = new Set();
  for (const q of arr) {
    if (Number.isFinite(q?.year)) years.add(q.year);
    if (q?.subject) subjects.add(q.subject);
  }

  let year;
  if (CROSS_YEAR.has(file)) {
    year = null;
  } else if (years.size === 1) {
    year = [...years][0];
  } else {
    year = null;
    if (years.size > 1) problems.push(`${file}: mixed years {${[...years].join(',')}} → tagged null (add to CROSS_YEAR or split the bank)`);
    else problems.push(`${file}: no year field on any Q → tagged null`);
  }

  entries.push({ file, export: exportName, year, count: arr.length, subjects: [...subjects].sort() });
}

// Deterministic order: year asc (null last), then file name.
// ⚠️ Code-unit compare, NOT localeCompare: localeCompare without an explicit
// locale follows the MACHINE's locale/ICU. Palm's box is th-TH, CI runners are
// C/en-US — Thai collation ignores the '.' so it sorts
// [lect2, lect3, lect4, lect] while CI sorts [lect, lect2, lect3, lect4].
// The committed registry then looked STALE on every CI run (red build on every
// push) even though its content was identical. Byte order is stable everywhere.
entries.sort((a, b) => {
  const ay = a.year ?? 99, by = b.year ?? 99;
  if (ay !== by) return ay - by;
  return a.file < b.file ? -1 : a.file > b.file ? 1 : 0;
});

const total = entries.reduce((s, e) => s + e.count, 0);

const L = [];
L.push('// ============================================================');
L.push('// bank-registry.generated.js — AUTO-GENERATED, do NOT hand-edit');
L.push('// ============================================================');
L.push('// Run `npm run regen:registry` after adding/removing a questions-*.js');
L.push('// bank or changing its export name / per-question year. Consumed by');
L.push('// data/questions.js to build the lazy LOADERS. Literal import() strings');
L.push('// below keep Vite per-bank chunk-splitting intact.');
L.push('// ============================================================');
L.push('');
L.push('export const BANK_REGISTRY = [');
for (const e of entries) {
  const subj = e.subjects.map((s) => `'${s}'`).join(', ');
  L.push(`  { file: '${e.file}', export: '${e.export}', year: ${e.year === null ? 'null' : e.year}, count: ${e.count},`);
  L.push(`    subjects: [${subj}],`);
  L.push(`    load: () => import('./${e.file}').then((m) => m.${e.export}) },`);
}
L.push('];');
L.push('');
L.push(`// Built: ${new Date().toISOString()} — ${entries.length} banks · ${total} Qs`);
L.push('');
const content = L.join('\n');

if (checkMode) {
  const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  // Compare ignoring the volatile "Built:" timestamp line.
  const strip = (s) => s.replace(/^\/\/ Built:.*$/m, '');
  if (eol(strip(cur)) !== eol(strip(content))) {
    console.error('❌ bank-registry.generated.js is STALE → run: npm run regen:registry');
    process.exit(1);
  }
  console.log('✅ bank-registry.generated.js is up to date.');
} else {
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`✓ wrote ${entries.length} banks · ${total} Qs → src/data/bank-registry.generated.js`);
}

if (problems.length) {
  console.log('\n⚠️  notes:');
  for (const p of problems) console.log('   • ' + p);
}

// Always print the triples so a human / diff can eyeball the year tags.
console.log('\nyear tags:');
const byYear = {};
for (const e of entries) (byYear[e.year ?? 'null'] ||= []).push(e.file.replace(/^questions-|\.js$/g, ''));
for (const y of Object.keys(byYear)) console.log(`   ${y}: ${byYear[y].join(', ')}`);
