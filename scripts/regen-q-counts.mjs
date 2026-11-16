#!/usr/bin/env node
// ============================================================
// regen-q-counts.mjs — regenerate src/data/q-counts.js
// ============================================================
// Why this file exists:
//   HomeView / YearSelectView / ScheduleView only need to KNOW how many
//   Qs each subject has — they don't render any Q content. Statically
//   importing the full QB barrel just to count length pulls every
//   per-subject chunk into the entry's load graph (~2 MB of Q data
//   on the home screen).
//
//   This script reads every questions-*.js file and writes two small
//   modules of leaves (one row per subject and topic): src/data/q-counts.js
//   and src/data/q-kind-counts.generated.js. The tables the screens read are
//   summed from those leaves when the modules load (src/lib/q-count-tables.js),
//   so two pull requests that add questions to different topics merge without
//   a conflict (scripts/lib/merge-friendly.mjs).
//
// Usage:
//   node scripts/regen-q-counts.mjs           (npm run regen:q-counts)
//   node scripts/regen-q-counts.mjs --check   (npm run lint:q-counts)
//
// --check rebuilds both modules in memory, compares them with the checked-in
// copies (ignoring CRLF), names the first leaf that differs and exits 1
// without writing. lint:all runs it, so a push that moves questions between
// papers or kinds cannot ship stale per-paper counts even when every total
// still matches.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildQCountLeaves, renderQCounts, renderQKindCounts } from './lib/q-count-leaves.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const CHECK = process.argv.includes('--check');
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href);

// The QB barrel is the source of truth: the same array every consumer sees.
const { QB, loadQB } = await load('src/data/questions.js');
const { SUBJECTS, semesterForSubject } = await load('src/data/curriculum.js');
const { isPastPaperQuestion, questionTopicId, panicRank } = await load('src/lib/question-metadata.js');
const { isCurrentScopeQuestion, isHighPredictionQuestion } = await load('src/lib/current-scope.js');
const { isQuestionDeliverable } = await load('src/data/question-delivery.generated.js');
const { questionInScope, scopeOfQuestion } = await load('src/lib/exam-scope.js');
if (!Array.isArray(QB)) throw new Error('QB import did not return an array');

// QB exports empty until loadQB() resolves; without this the regen would emit
// zero counts.
await loadQB();

// The hidden-topic set per subject, as hiddenTopicIdsFor() reads it at runtime.
const hiddenBySubject = {};
for (const s of SUBJECTS) {
  if (!s?.id || !Array.isArray(s.topics)) continue;
  const set = new Set();
  for (const t of s.topics) if (t.hidden) set.add(t.id);
  if (set.size) hiddenBySubject[s.id] = set;
}

const leaves = buildQCountLeaves(QB, {
  isQuestionDeliverable,
  questionTopicId,
  isPastPaperQuestion,
  panicRank,
  questionInScope,
  scopeOfQuestion,
  isCurrentScopeQuestion,
  isHighPredictionQuestion,
  semesterForSubject,
  hiddenBySubject,
});

const outPath = path.join(root, 'src/data/q-counts.js');
const kindOut = path.join(root, 'src/data/q-kind-counts.generated.js');
const outputs = [[outPath, renderQCounts(leaves)], [kindOut, renderQKindCounts(leaves)]];

// null when the file on disk matches the fresh build, otherwise where it first
// differs: the leaf (its header line names it) or the line number. Git checks
// these files out with CRLF on Windows while the generator writes LF; that is
// not staleness.
function firstStale(onDisk, fresh) {
  const have = onDisk.replace(/\r\n/g, '\n').split('\n');
  const want = fresh.split('\n');
  const n = Math.max(have.length, want.length);
  for (let i = 0; i < n; i += 1) {
    if (have[i] === want[i]) continue;
    for (let j = i; j >= 0; j -= 1) {
      const header = /^\s*\/\/ (\[.*\])$/.exec(want[j] ?? '');
      if (header) return `leaf ${header[1]}`;
      if (/^(const|export const) /.test(want[j] ?? '')) break;
    }
    return `line ${i + 1}`;
  }
  return null;
}

if (CHECK) {
  for (const [file, body] of outputs) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const where = firstStale(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '', body);
    if (where) {
      console.error(`❌ ${rel} is STALE at ${where} → run: npm run regen:q-counts`);
      process.exitCode = 1;
    }
  }
  if (!process.exitCode) console.log('✅ q-counts.js and q-kind-counts.generated.js are up to date.');
} else {
  for (const [file, body] of outputs) fs.writeFileSync(file, body, 'utf8');
  const blocked = leaves.countLeaves.reduce((n, l) => n + l[2], 0);
  console.log(`✓ wrote ${leaves.countLeaves.length} topic leaves (${QB.length - blocked}/${QB.length} deliverable Qs) → src/data/q-counts.js, ${Math.round(fs.statSync(outPath).size / 1024)} KB`);
  console.log(`✓ wrote ${leaves.kindLeaves.length} per-kind topic leaves → ${path.relative(root, kindOut)}, ${Math.round(fs.statSync(kindOut).size / 1024)} KB`);
}
