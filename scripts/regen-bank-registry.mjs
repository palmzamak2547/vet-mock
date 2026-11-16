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
//   • leaves       — subject, topic and year of each question, for the
//                    digest on a bank of several subjects or years (no
//                    count is written: scripts/lib/bank-registry-text.mjs)
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

// Line endings (and the Built stamp) are ignored when comparing. Git checks
// these files out with CRLF on Windows while the generator writes LF, so a
// byte-for-byte comparison called the file STALE on every Windows machine
// until someone regenerated locally — and then called it stale again after
// the next checkout. A check that is red for reasons unrelated to its
// subject teaches people to ignore it. One helper serves every generator.
import { sameGenerated } from './lib/same-generated.mjs';
import { compareRegistryEntries, renderBankRegistry } from './lib/bank-registry-text.mjs';


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
  const leaves = [];
  for (const q of arr) {
    leaves.push([q?.subject ?? null, q?.topic ?? null, Number.isFinite(q?.year) ? q.year : null]);
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

  entries.push({ file, export: exportName, year, count: arr.length, subjects: [...subjects].sort(), leaves });
}

// Deterministic order: year asc (null last), then file name.
// ⚠️ Code-unit compare, NOT localeCompare: localeCompare without an explicit
// locale follows the MACHINE's locale/ICU. Palm's box is th-TH, CI runners are
// C/en-US — Thai collation ignores the '.' so it sorts
// [lect2, lect3, lect4, lect] while CI sorts [lect, lect2, lect3, lect4].
// The committed registry then looked STALE on every CI run (red build on every
// push) even though its content was identical. Byte order is stable everywhere.
entries.sort(compareRegistryEntries);

const total = entries.reduce((s, e) => s + e.count, 0);

const content = renderBankRegistry(entries);

if (checkMode) {
  const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  if (!sameGenerated(cur, content)) {
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
