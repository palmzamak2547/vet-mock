// A question must stand on its own. The slide is where the ANSWER came from,
// not part of what is being asked.
//
// Palm, on reading the first Year-2 banks: "ทำไมคำถามถึงชอบถาม ว่าสไลด์นี้
// สไลด์นี้หน้านี้ … ผมอยากให้คำถาม มันตอบได้ทุกคน". He is right — a stem that
// says "ตามสไลด์" can only be answered by someone holding that deck, and reads
// as bookkeeping rather than veterinary knowledge.
//
// Two kinds, and only one is salvageable:
//   TRIM  the reference is filler around a real question. "Glycogen body ของนก
//         อยู่ที่ตำแหน่งใดตามที่สไลด์บรรยาย" is a good question once the tail
//         is gone.
//   DROP  the slide is the subject. "สไลด์วงเล็บกำกับชื่อพ้องของ endopeduncular
//         nucleus ไว้ว่าอย่างไร" asks what a particular deck printed, and no
//         trimming turns that into a question about the animal.
//
//   node scripts/lint-question-deckrefs.mjs <dir-of-*.q.json> [--write]

import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!DIR) { console.error('usage: lint-question-deckrefs.mjs <dir> [--write]'); process.exit(2); }

// Filler that can be cut without touching the question itself.
const TRIM = [
  /\s*ตามที่(สไลด์|เด็ค|เดค|บทเรียน|เอกสาร)[^?]{0,24}?(บรรยาย|ระบุ|เขียน|กำกับ|อธิบาย|สรุป|เน้น|ให้ไว้|บอก)ไว้?/g,
  /\s*(ตาม|ใน|จาก)(สไลด์|เด็ค|เดค|เอกสาร|คู่มือ|แล็ป|แลป)(นี้)?\s*/g,
  /\s*ที่(สไลด์|เด็ค|เดค)(นี้)?(ระบุ|เขียน|บรรยาย|กำกับ|สรุป|เน้น|บอก)ไว้?/g,
  /\s*ตามที่เด็?คระบุ/g,
  /\s*\(?(หน้า|p\.)\s?\d+(\s*[-–,]\s*\d+)*\)?/g,
  /\s*according to the (slide|deck)s?/gi,
];

// The reference is the grammatical subject — the question is about the document.
const DROP = [
  /^(สไลด์|เด็ค|เดค|เอกสาร|คู่มือ|checklist|แล็ป|แลป)/i,
  /(สไลด์|เด็ค|เดค|checklist)[^?]{0,40}(แบ่ง|ลิสต์|จัดเรียง|วางไว้|เรียงไว้|มีกี่|กี่หน้า|กี่สไลด์|ไม่ได้บอก|ไม่มีข้อความ|ว่างเปล่า)/i,
  /(หน้าถัดไป|หน้าที่แล้ว|สไลด์ถัดไป|สไลด์ก่อนหน้า)/,
  /(ภาพที่ \d|ชุดย้อม|รายการสไลด์)/,
];

const clean = (s) => s.replace(/\s{2,}/g, ' ').replace(/\s+([?？])/g, '$1').trim();

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.q.json'));
let total = 0, trimmed = 0, dropped = 0, untouched = 0;
const samples = { trim: [], drop: [] };

for (const f of files) {
  const p = path.join(DIR, f);
  const o = JSON.parse(fs.readFileSync(p, 'utf8'));
  const keep = [];
  for (const q of o.questions || []) {
    total++;
    if (DROP.some((re) => re.test(q.q))) {
      dropped++;
      if (samples.drop.length < 4) samples.drop.push(q.q.slice(0, 80));
      continue;
    }
    let stem = q.q;
    for (const re of TRIM) stem = stem.replace(re, ' ');
    stem = clean(stem);
    // A trim that guts the sentence means the reference was load-bearing.
    if (stem.length < 15 || stem.length < q.q.length * 0.45) {
      dropped++;
      if (samples.drop.length < 4) samples.drop.push(q.q.slice(0, 80));
      continue;
    }
    if (stem !== q.q) {
      trimmed++;
      if (samples.trim.length < 4) samples.trim.push(`${q.q.slice(0, 60)} → ${stem.slice(0, 60)}`);
      q.q = stem;
    } else untouched++;
    keep.push(q);
  }
  if (WRITE) { o.questions = keep; fs.writeFileSync(p, JSON.stringify(o, null, 1)); }
}

console.log(`${total} question(s): ${untouched} clean, ${trimmed} trimmed, ${dropped} dropped`);
for (const s of samples.trim) console.log(`  trim  ${s}`);
for (const s of samples.drop) console.log(`  drop  ${s}`);
if (!WRITE) console.log('(dry run — pass --write)');
