#!/usr/bin/env node
// ============================================================
// lint-deck-references.mjs — a question must stand on its own
// ============================================================
// Usage: node scripts/lint-deck-references.mjs [--write]
//
// The slide is where the ANSWER came from. It is not part of what is being
// asked. A stem that says "ตามสไลด์" can only be answered by someone holding
// that particular deck, and it tests what a document printed rather than what
// is true of the animal.
//
// Two kinds, and only one survives:
//   TRIM  the reference is filler wrapped around a real question, and cutting
//         it leaves the question intact.
//   DROP  the document is the subject — "สไลด์วงเล็บกำกับชื่อพ้องของ
//         endopeduncular nucleus ไว้ว่าอย่างไร" asks what a deck printed, and
//         no amount of trimming makes that a question about neuroanatomy.
//
// Without --write this only reports, so it can run as a gate.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

const WRITE = process.argv.includes('--write');
const DIR = 'src/data';

const TRIM = [
  /\s*ตามที่(สไลด์|เด็ค|เดค|บทเรียน|เอกสาร|คู่มือ)[^?]{0,24}?(บรรยาย|ระบุ|เขียน|กำกับ|อธิบาย|สรุป|เน้น|ให้ไว้|บอก|จัดไว้)ไว้?/g,
  /\s*ที่(สไลด์|เด็ค|เดค)(นี้)?(ระบุ|เขียน|บรรยาย|กำกับ|สรุป|เน้น|บอก)ไว้?/g,
  /\s*(ตาม|ใน|จาก|บน)(สไลด์|เด็ค|เดค|เอกสาร|คู่มือ)(นี้|ชุดนี้)?\s*/g,
  /\s*ตามที่เด็?คระบุ/g,
  /\s*according to the (slide|deck|handout)s?/gi,
  /\s*\((หน้า|p\.)\s?\d+(\s*[-–,]\s*\d+)*\)/g,
];

const DROP = [
  /^\s*(สไลด์|เด็ค|เดค|เอกสาร|คู่มือ|checklist)/i,
  /(สไลด์|เด็ค|เดค|checklist)[^?]{0,44}(แบ่ง|ลิสต์|จัดเรียง|วางไว้|เรียงไว้|มีกี่|กี่หน้า|กี่สไลด์|ไม่ได้บอก|ไม่มีข้อความ|ว่างเปล่า|เปรียบเทียบ.{0,20}ไว้อย่างไร)/i,
  /(หน้าถัดไป|หน้าที่แล้ว|สไลด์ถัดไป|สไลด์ก่อนหน้า|ภาพที่ \d|ชุดย้อม|รายการสไลด์)/,
  /ถูกลิสต์ไว้ถัดจาก/,
];

const clean = (s) => s.replace(/\s{2,}/g, ' ').replace(/\s+([?？])/g, '$1').trim();

let total = 0, trimmed = 0, dropped = 0, filesTouched = 0;
const perFile = [];

for (const file of fs.readdirSync(DIR).filter((f) => /^questions-.*\.js$/.test(f))) {
  const p = path.join(DIR, file);
  const src = fs.readFileSync(p, 'utf8');
  const open = src.indexOf('[');
  const close = src.lastIndexOf(']');
  if (open < 0 || close < open) continue;
  let qs;
  try { qs = JSON.parse(src.slice(open, close + 1)); } catch { continue; }

  const keep = [];
  let t = 0, d = 0;
  for (const q of qs) {
    total++;
    const stem = String(q.q || '');
    if (DROP.some((re) => re.test(stem))) { d++; dropped++; continue; }
    let next = stem;
    for (const re of TRIM) next = next.replace(re, ' ');
    next = clean(next);
    // If trimming guts the sentence, the reference was load-bearing and the
    // question was really about the document.
    if (next.length < 15 || next.length < stem.length * 0.45) { d++; dropped++; continue; }
    if (next !== stem) { q.q = next; t++; trimmed++; }
    keep.push(q);
  }

  if (t || d) {
    perFile.push({ file, n: qs.length, t, d });
    filesTouched++;
    if (WRITE) {
      fs.writeFileSync(p, src.slice(0, open) + JSON.stringify(keep, null, 2) + src.slice(close + 1));
    }
  }
}

for (const r of perFile.sort((a, b) => (b.t + b.d) - (a.t + a.d))) {
  console.log(`${String(r.t).padStart(4)} trimmed ${String(r.d).padStart(3)} dropped   of ${String(r.n).padStart(4)}   ${r.file}`);
}
console.log(`\n${total} question(s) across the corpus: ${trimmed} trimmed, ${dropped} dropped, ${filesTouched} bank(s) touched`);

if (!WRITE) {
  if (trimmed || dropped) {
    console.log('\n(dry run — pass --write to apply)');
    process.exit(1);
  }
  console.log('✅ no question leans on a deck reference.');
}
