#!/usr/bin/env node
// ============================================================
// lint-q-dupes.mjs — Detect duplicate Q TEXT across all subjects
// ============================================================
// Usage: node scripts/lint-q-dupes.mjs
//
// Why: Same question copy-pasted into multiple Q files is wasteful
// (user sees the same prompt twice during exam mode) and indicates
// content drift between past-paper sources. This catches near-dupes
// where the question stem has been re-typed almost identically.
//
// Logic:
//   1. Load QB (the spread of every subject Q file).
//   2. Normalize each Q's text:
//        - lowercase
//        - strip markdown bold/italics/strike: ** * _ ~
//        - strip middle-dot · (bullet style varies per file)
//        - collapse all whitespace to single space
//   3. Take the first 80 chars of the normalized text as the dupe key.
//      (Past-paper Qs often share an identical stem but diverge in
//      multiple-choice options or the exact final phrase — comparing
//      the lead-in catches the duplicates without false-flagging
//      legitimately-different questions.)
//   4. When the Q has a `passage`/`passage_title` (research-reading
//      mocks share generic stems like "What was the purpose of the
//      study?" applied to DIFFERENT passages — Mock 1 PASSAGE_PETS vs
//      Mock 4 PASSAGE_AMR), prefix the key with the passage_title or
//      passage hash so each passage-Q pair gets its own dupe bucket.
//   5. Group Qs sharing a key. Anything with >1 entry is a dupe set.
//
// Exit code 0 if no dupes, 1 otherwise (CI-friendly).
//
// Mirrors the style of scripts/lint-q-ids.mjs.
// ============================================================

import { QB } from '../src/data/questions.js';

function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[*_~·]/g, '')          // strip markdown emphasis + middle-dot
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

// Passage fingerprint: prefer the BODY over title because mock-exam
// passage_titles are intentionally generic ("Read this article and
// write a summary" appears on every Part II Q across all mocks). The
// first 80 normalized chars of the body discriminate cleanly between
// PASSAGE_BATS / PASSAGE_ATOPIC / PASSAGE_EARABSCESS without false
// flags. Falls back to title when body absent (rare).
function passageKey(item) {
  if (item.passage) return normalizeText(item.passage).slice(0, 80);
  if (item.passage_title) return normalizeText(item.passage_title).slice(0, 60);
  return '';
}

const byKey = new Map();

for (const item of QB) {
  const text = item.q || '';
  const norm = normalizeText(text);
  if (norm.length < 10) continue;     // skip near-empty stems
  // Passage-aware key: when present, a generic stem like "What was
  // the purpose of the study?" applied to two distinct passages should
  // NOT be flagged as a dupe (they're different exam items by design).
  const stemKey = norm.slice(0, 80);
  const passage = passageKey(item);
  const key = passage ? `${passage}|${stemKey}` : stemKey;
  if (!byKey.has(key)) byKey.set(key, []);
  byKey.get(key).push(item);
}

const dupeGroups = [...byKey.entries()].filter(([, arr]) => arr.length > 1);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Q TEXT DUPLICATE LINT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total Qs: ${QB.length}`);
console.log(`Unique 80-char keys: ${byKey.size}`);
console.log(`Duplicate groups: ${dupeGroups.length}`);
const dupeQCount = dupeGroups.reduce((acc, [, arr]) => acc + arr.length, 0);
console.log(`Qs involved in duplicates: ${dupeQCount}`);
console.log('');

if (dupeGroups.length === 0) {
  console.log('✅ No duplicate Q text found. No action needed.');
  process.exit(0);
}

// Sort biggest groups first so the worst offenders are obvious.
dupeGroups.sort((a, b) => b[1].length - a[1].length);

console.log('Duplicate groups (subject:topic#id):');
console.log('');
for (const [key, arr] of dupeGroups) {
  const preview = key.length > 70 ? key.slice(0, 70) + '…' : key;
  console.log(`  ▸ "${preview}"`);
  for (const q of arr) {
    const subject = q.subject || '?';
    const topic = q.topic || q.tags?.[0] || '-';
    const id = q.id ?? '?';
    console.log(`      ${subject} :: ${topic} :: id=${id}`);
  }
  console.log('');
}

console.log('💡 To resolve:');
console.log('   1. Pick the canonical Q (best wording / most complete options)');
console.log('   2. Delete the others, OR rephrase the stem if both questions');
console.log('      really do test different concepts and just happen to share');
console.log('      a lead-in.');
console.log('   3. Re-run `npm run lint:dupes` until clean.');

process.exit(1);
