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
// The first version of this file tried to TRIM the reference out and keep the
// question. That was wrong twice over. It produced broken Thai — "โครงสร้างคู่
// Plasma cell และ Golgi apparatus เดคสั่งให้หา ใดบ้าง" is what survived one of
// those trims — and its patterns were delicate enough that 106 stems still
// naming a deck passed the gate as clean. A gate that reports success while the
// thing it guards is present is worse than no gate.
//
// So: no trimming, no clever patterns. If the stem contains one of these words,
// the question goes. The words are unambiguous — no veterinary question needs
// to say "สไลด์" — and a plain substring test cannot quietly stop matching.
// ============================================================

import fs from 'node:fs';

const WRITE = process.argv.includes('--write');

// Deliberately plain. Substring, case-insensitive for the Latin ones.
const BANNED = [
  'สไลด์', 'เด็ค', 'เดค', 'เอกสารนี้', 'คู่มือนี้', 'บทเรียนนี้',
  'checklist', 'deck', 'handout', 'lecture นี้',
  'หน้าถัดไป', 'หน้าที่แล้ว', 'ภาพที่ 1', 'ชุดย้อม',
];

const hits = (stem) => {
  const s = stem.toLowerCase();
  return BANNED.filter((w) => s.includes(w.toLowerCase()));
};

let total = 0, dropped = 0;
const perFile = [];

for (const file of fs.readdirSync('src/data').filter((f) => /^questions-.*\.js$/.test(f))) {
  const p = `src/data/${file}`;
  const src = fs.readFileSync(p, 'utf8');
  const open = src.indexOf('[');
  const close = src.lastIndexOf(']');
  if (open < 0 || close < open) continue;
  let qs;
  try { qs = JSON.parse(src.slice(open, close + 1)); } catch { continue; }

  const keep = [];
  let d = 0;
  for (const q of qs) {
    total++;
    if (hits(String(q.q || '')).length) { d++; dropped++; continue; }
    keep.push(q);
  }
  if (d) {
    perFile.push({ file, n: qs.length, d });
    if (WRITE) fs.writeFileSync(p, src.slice(0, open) + JSON.stringify(keep, null, 2) + src.slice(close + 1));
  }
}

for (const r of perFile.sort((a, b) => b.d - a.d)) {
  console.log(`${String(r.d).padStart(4)} of ${String(r.n).padStart(4)} name a deck   ${r.file}`);
}
console.log(`\n${total} question(s): ${dropped} name a deck in the stem`);

if (!WRITE) {
  if (dropped) { console.log('\n(dry run — pass --write to drop them)'); process.exit(1); }
  console.log('✅ no question names a deck.');
}
