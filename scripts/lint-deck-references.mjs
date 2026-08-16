#!/usr/bin/env node
// ============================================================
// lint-deck-references.mjs — a question must stand on its own
// ============================================================
// Usage: node scripts/lint-deck-references.mjs [--write]
//
// The slide is where the ANSWER came from. It is not part of what is asked.
// A stem naming a deck can only be answered by someone holding that deck, and
// it tests what a document printed rather than what is true of the animal.
//
// This file has been wrong twice, both times in ways that reported success:
//
//   • It first tried to TRIM the reference and keep the question. Its patterns
//     were delicate enough that 106 stems still saying "สไลด์" passed as clean,
//     and what it did rewrite it sometimes broke — "โครงสร้างคู่ Plasma cell
//     และ Golgi apparatus เดคสั่งให้หา ใดบ้าง" is a stem it produced.
//   • It then read banks with JSON.parse inside a try/catch. Older banks carry
//     section comments inside the array, so 37 of 65 banks — 2,846 questions —
//     were skipped without a word, and 92 deck-naming stems sat in them.
//
// So: read every bank the way the app does, test with a plain substring, and
// only ever drop. No pattern here can quietly stop matching, and no bank can
// quietly fail to be read.
// ============================================================

import { bankFiles, readBank, removeQuestions } from './lib/bank-file.mjs';

const WRITE = process.argv.includes('--write');

// Words no veterinary question needs. Substring, case-insensitive.
const BANNED = [
  'สไลด์', 'เด็ค', 'เดค', 'เอกสารนี้', 'คู่มือนี้', 'บทเรียนนี้',
  'checklist', 'deck', 'handout', 'lecture นี้',
  'หน้าถัดไป', 'หน้าที่แล้ว', 'ชุดย้อม',
];

const names = (stem) => {
  const s = String(stem || '').toLowerCase();
  return BANNED.some((w) => s.includes(w.toLowerCase()));
};

let total = 0, flagged = 0, banks = 0;
const rows = [];

for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  banks++;
  total += questions.length;
  const bad = questions.filter((q) => names(q.q));
  if (!bad.length) continue;
  flagged += bad.length;
  rows.push({ file, n: questions.length, bad: bad.length });
  if (WRITE) {
    const removed = removeQuestions(file, new Set(bad.map((q) => q.id)));
    if (removed !== bad.length) {
      console.error(`✗ ${file}: expected to remove ${bad.length}, removed ${removed}`);
      process.exit(1);
    }
  }
}

for (const r of rows.sort((a, b) => b.bad - a.bad)) {
  console.log(`${String(r.bad).padStart(4)} of ${String(r.n).padStart(4)} name a deck   ${r.file.split(/[\\/]/).pop()}`);
}
console.log(`\n${banks} bank(s), ${total} question(s): ${flagged} name a deck in the stem`);

if (!WRITE) {
  if (flagged) { console.log('\n(dry run — pass --write to drop them)'); process.exit(1); }
  console.log('✅ no question names a deck.');
}
