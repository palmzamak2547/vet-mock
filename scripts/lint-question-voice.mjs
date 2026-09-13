#!/usr/bin/env node
/**
 * lint-question-voice.mjs
 *
 * A question stem must read like an exam paper, not like a note to whoever
 * wrote it. Questions authored from lecture material kept the scaffolding of
 * their own making — "เชื้อสาเหตุที่เอกสารระบุว่าพบในไทยคือข้อใด",
 * "คำอธิบายใดตรงกับเอกสารมากที่สุด", "ตามนิยามในเลกเชอร์ ..." — and 65 of
 * them shipped that way. It reads as machine-written because it is, and it
 * points a student at a document they cannot open.
 *
 * A real paper asks the fact. If the answer is only true "according to the
 * lecture", the scope belongs in the stem as a real condition
 * ("ในประเทศไทย", "ตามประกาศกรมปศุสัตว์"), not as a reference to the source
 * the question was written from — that is what the `verified` field is for,
 * and it is not shown to the student.
 *
 * Usage:  node scripts/lint-question-voice.mjs
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { BANK_REGISTRY } = await import(pathToFileURL(path.join(ROOT, 'src/data/bank-registry.generated.js')).href);

// Referring to the source the question was WRITTEN FROM.
const SCAFFOLDING = [
  [/เอกสาร(ระบุ|กล่าว|บอก|แนะนำ|เตือน|สรุป|ให้ไว้|บันทึก)/, 'อ้างถึงเอกสารต้นทาง'],
  [/(ตามที่|ที่)เอกสาร/, 'อ้างถึงเอกสารต้นทาง'],
  [/(ตามเอกสาร|ในเอกสารระบุ|ตรงกับเอกสาร|สอดคล้องกับเอกสาร)/, 'อ้างถึงเอกสารต้นทาง'],
  [/(ตามบทเรียน|ตามสไลด์|ในสไลด์|ตามเลกเชอร์|ในเลกเชอร์|ตามนิยามในเลกเชอร์)/, 'อ้างถึงสไลด์หรือเลกเชอร์'],
  [/(ตามที่เรียนมา|ตามที่สอน|ตามที่บันทึกไว้\s*$)/, 'อ้างถึงสิ่งที่เรียนมา'],
  [/กระดาษคำตอบ(ระบุ|บอก|ให้|กำหนด)|เฉลย(ระบุ|บอก)ว่า/, 'อ้างถึงกระดาษคำตอบหรือเฉลย'],
];

// Stems that are genuinely ABOUT documents — a quality record, an audit
// finding, a slaughterhouse form. The reference is the subject matter, not
// scaffolding, so each one is listed by id rather than pattern-matched away.
const ABOUT_DOCUMENTS = new Set([
  1954,    // NCR — the question asks which document an audit issues
  8550,    // OSCE station brief
  101106,  // ระบบเอกสารของศูนย์รวบรวมน้ำนมดิบ, ข้อ 9.2
  109560,  // slaughterhouse paperwork for an injured pig
]);

const questions = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) questions.push(q);

const errors = [];
for (const q of questions) {
  if (!q.q || ABOUT_DOCUMENTS.has(q.id)) continue;
  for (const [re, why] of SCAFFOLDING) {
    if (re.test(q.q)) {
      errors.push(`${q.id} [${q.subject}] ${why}: ${q.q.slice(0, 70)}`);
      break;
    }
  }
}

if (errors.length) {
  console.error(`✗ question voice: ${errors.length} stem(s) reference the source they were written from`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('  Ask the fact directly. If the claim only holds in a narrow scope, put the scope in the stem as a real condition.');
  process.exit(1);
}
console.log(`✓ ${questions.length} stems read as exam questions (${ABOUT_DOCUMENTS.size} genuinely about documents, allowed by id)`);
