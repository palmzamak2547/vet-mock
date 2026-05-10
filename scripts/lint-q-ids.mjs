#!/usr/bin/env node
// ============================================================
// lint-q-ids.mjs — Detect duplicate Q IDs across all subjects
// ============================================================
// Usage: node scripts/lint-q-ids.mjs
//
// Why: Q IDs should be unique globally because some lookups index Qs
// by ID alone (e.g. SR cards in srCards[id], bookmarks). Currently
// pre-existing duplicates exist (com4↔engprof, com3↔exotic, etc.).
//
// Run after adding any new Q file to ensure no new collisions.
// Exits non-zero if duplicates found (good for CI gate).
//
// Reserved ID ranges (see vault/projects/vetmock/04-content-pipeline.md):
//   1-1610          → exotic + scattered legacy
//   1700-1959       → poultry / repro-lect
//   2000-2089       → mahahon
//   2700-3700       → com3 + com4
//   4000+           → poultry past papers
//   5000+           → cliapprum
//   6001-7999       → VCA tab (316 used 6001-7162)
//   8000-8999       → reserved for future Y5 sem 1/2 lecture Qs
//   9000-9999       → reserved for Y6 / Y4 sem 1 / Y1-Y3 scaffold years
// ============================================================

import { QB } from '../src/data/questions.js';

const byId = new Map();
const byCompound = new Map();

for (const q of QB) {
  if (!byId.has(q.id)) byId.set(q.id, []);
  byId.get(q.id).push(q);

  const compound = `${q.subject}:${q.id}`;
  if (byCompound.has(compound)) {
    console.error(`⚠️ Compound collision: ${compound}`);
  }
  byCompound.set(compound, q);
}

const dupes = [...byId.entries()].filter(([id, arr]) => arr.length > 1);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Q ID UNIQUENESS LINT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total Qs: ${QB.length}`);
console.log(`Unique IDs: ${byId.size}`);
console.log(`Duplicate IDs: ${dupes.length}`);
console.log('');

if (dupes.length === 0) {
  console.log('✅ All Q IDs are globally unique. No action needed.');
  process.exit(0);
}

// Group by subject pair
const byPair = new Map();
for (const [id, arr] of dupes) {
  const subjects = [...new Set(arr.map(q => q.subject))].sort().join(' ↔ ');
  if (!byPair.has(subjects)) byPair.set(subjects, []);
  byPair.get(subjects).push(parseInt(id));
}

console.log('Subject pairs with collisions:');
for (const [pair, ids] of byPair) {
  ids.sort((a, b) => a - b);
  console.log(`  • ${pair}: ${ids.length} dupes (range ${ids[0]}-${ids[ids.length - 1]})`);
}
console.log('');
console.log('💡 Pre-existing duplicates from older Q files. To fix:');
console.log('   1. Pick one side per collision pair to renumber');
console.log('   2. Use IDs in 9000-9999 range (reserved for renumbering)');
console.log('   3. Add migration script in App.jsx onMount to map old→new IDs');
console.log('      in user localStorage (bookmarks, srCards, history)');
console.log('');
console.log('Note: HomeView qIndex uses compound key (subject + ":" + id)');
console.log('      to work around this. SRSessionView still uses bare id.');

process.exit(dupes.length > 0 ? 1 : 0);
