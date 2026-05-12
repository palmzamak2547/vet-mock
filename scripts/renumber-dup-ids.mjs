#!/usr/bin/env node
// ============================================================
// renumber-dup-ids.mjs — One-shot ID collision resolver
// ============================================================
//
// Strategy:
//   1. Build map of dup IDs from QB (subject + oldId)
//   2. Walk ALL `src/data/questions-*.js` files, find each
//      `{ id: <oldId>, subject: '<X>'` occurrence, replace `<oldId>`
//      with new ID from reserved range
//   3. Emit migration map (subject:oldId → newId) for App boot script
//
// Why scan all files: a Q with `subject: 'repro-lect'` doesn't have
// to live in questions-repro-lect.js — repro-lect Qs are sprinkled
// across questions-mahahon.js + questions-repro-lect.js (and
// historically others). Filename ≠ subject.
//
// Renumber plan:
//   exotic     IDs (collide with com3)            → 50000-50999
//   engprof    IDs (collide with com4)            → 51000-51999
//   repro-lect IDs (collide with poultry/practrum) → 52000-52999
//
// Iron Rule 0: emits map. Migration of user data lives in
// `src/lib/id-migration.js` and runs once per user at boot.
// ============================================================

import { QB } from '../src/data/questions.js';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const RENUMBER_PLAN = {
  exotic:       { startId: 50000 },
  engprof:      { startId: 51000 },
  'repro-lect': { startId: 52000 },
};

// Step 1 — find dup IDs from QB
const byId = new Map();
for (const q of QB) {
  if (!byId.has(q.id)) byId.set(q.id, []);
  byId.get(q.id).push(q);
}

// Step 2 — collect Qs to renumber
const toRenumber = []; // [{ subject, oldId, newId }]
const cursor = { exotic: 0, engprof: 0, 'repro-lect': 0 };

// Stable iteration order: sort by id ascending so renumbering is
// deterministic between runs and the assigned newId mapping is
// reproducible (helps diff review).
const sortedDupes = [...byId.entries()]
  .filter(([, qs]) => qs.length > 1)
  .sort((a, b) => a[0] - b[0]);

for (const [, qs] of sortedDupes) {
  for (const q of qs) {
    if (RENUMBER_PLAN[q.subject]) {
      const newId = RENUMBER_PLAN[q.subject].startId + cursor[q.subject];
      cursor[q.subject]++;
      toRenumber.push({ subject: q.subject, oldId: q.id, newId });
    }
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Q ID RENUMBER PLAN');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total Qs to renumber: ${toRenumber.length}`);
for (const subj of Object.keys(RENUMBER_PLAN)) {
  const renumbers = toRenumber.filter((r) => r.subject === subj);
  if (renumbers.length === 0) continue;
  const oldRange = `${Math.min(...renumbers.map(r => r.oldId))}-${Math.max(...renumbers.map(r => r.oldId))}`;
  const newRange = `${renumbers[0].newId}-${renumbers[renumbers.length - 1].newId}`;
  console.log(`  • ${subj}: ${renumbers.length} Qs · old ${oldRange} → new ${newRange}`);
}
console.log('');

// Step 3 — find each Q in source files + replace
// Scan all questions-*.js files. For each Q to renumber, find the
// FIRST line matching `{ id: <oldId>, subject: '<subject>'` and
// replace the oldId. Track which file held each Q so we can apply
// edits per-file in one pass per file.

const dataFiles = readdirSync(DATA_DIR)
  .filter((f) => /^questions(-|\.).+\.js$/.test(f) && !f.endsWith('-meta.js'))
  .map((f) => join(DATA_DIR, f));

// First pass: locate each {subject, oldId} pair in source files
const renumberByFile = new Map(); // file → [{ oldId, newId, subject }]
const located = new Set();        // 'subject:oldId' that we found

for (const file of dataFiles) {
  const content = readFileSync(file, 'utf8');
  for (const r of toRenumber) {
    if (located.has(`${r.subject}:${r.oldId}`)) continue;
    // Match a Q literal: `{ id: <oldId>, subject: '<subject>'`
    // possibly preceded by whitespace and/or comment line.
    const pattern = new RegExp(
      `(\\{\\s*id:\\s*)${r.oldId}(\\s*,\\s*subject:\\s*['"]${r.subject}['"])`,
      ''
    );
    if (pattern.test(content)) {
      if (!renumberByFile.has(file)) renumberByFile.set(file, []);
      renumberByFile.get(file).push(r);
      located.add(`${r.subject}:${r.oldId}`);
    }
  }
}

// Report any Qs we couldn't locate (shouldn't happen if QB import is sane)
const missing = toRenumber.filter((r) => !located.has(`${r.subject}:${r.oldId}`));
if (missing.length > 0) {
  console.log(`⚠️  Could not locate ${missing.length} Qs in source files:`);
  for (const m of missing.slice(0, 8)) {
    console.log(`     ${m.subject}:${m.oldId} → ${m.newId}`);
  }
  if (missing.length > 8) console.log(`     ... and ${missing.length - 8} more`);
  console.log('');
}

// Step 4 — apply edits, one pass per file
const migrationMap = {}; // 'subject:oldId' → newId
let totalApplied = 0;

for (const [file, list] of renumberByFile) {
  let content = readFileSync(file, 'utf8');
  let applied = 0;
  for (const { subject, oldId, newId } of list) {
    const pattern = new RegExp(
      `(\\{\\s*id:\\s*)${oldId}(\\s*,\\s*subject:\\s*['"]${subject}['"])`,
      ''
    );
    const before = content;
    content = content.replace(pattern, `$1${newId}$2`);
    if (content !== before) {
      migrationMap[`${subject}:${oldId}`] = newId;
      applied++;
    }
  }
  writeFileSync(file, content, 'utf8');
  const filename = file.split(/[\\/]/).pop();
  console.log(`✅ ${filename}: ${applied} Q${applied === 1 ? '' : 's'} renumbered`);
  totalApplied += applied;
}

// Step 5 — emit migration map
const mapFile = join(DATA_DIR, '..', 'lib', 'id-migration-map.json');
writeFileSync(mapFile, JSON.stringify(migrationMap, null, 2), 'utf8');
console.log('');
console.log(`📝 Migration map: ${Object.keys(migrationMap).length} entries → src/lib/id-migration-map.json`);
console.log(`📊 Total renumbered: ${totalApplied} Qs across ${renumberByFile.size} file(s)`);
console.log('');
console.log('Next steps:');
console.log('  1. Run `npm run lint:ids` to verify 0 duplicates');
console.log('  2. Verify src/lib/id-migration.js applies map at boot');
console.log('  3. `npm run build` + smoke test in preview');
