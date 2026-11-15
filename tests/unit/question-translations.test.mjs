// ============================================================
// ยามข้อมูลของระบบภาษาอังกฤษ (นำร่อง zoonoses)
// — โจทย์ฉบับ EN ต้องครบกับคลัง ตัวเลือกเรียงตรงต้นฉบับ
// — กล่องศัพท์ท้ายบท VetWiki ต้องมี 16 บท แถวครบช่อง
// — ตรึงการแก้จากการตรวจของเจ้าของ (ก.ย.–พ.ย. 2568) ไม่ให้ย้อนกลับ
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { QUESTION_TRANSLATIONS_ZOONOSES } from '../../src/data/question-translations-zoonoses.js';
import { VETWIKI_GLOSSARY_ZOONOSES } from '../../src/data/vetwiki-glossary-zoonoses.js';
import { QUESTIONS_MID86_ZOONOSES } from '../../src/data/questions-mid86-zoonoses.js';
import { QB_Y5_ZOONOSES_0925 } from '../../src/data/questions-y5-zoonoses-0925.js';
import { QB_Y5_ZOONOSES_0925B } from '../../src/data/questions-y5-zoonoses-0925b.js';
import { QB_Y5_ZOONOSES_2026 } from '../../src/data/questions-y5-zoonoses-2026.js';
import { QUESTIONS_Y5_ZOONOSES_2026_B } from '../../src/data/questions-y5-zoonoses-2026-b.js';
import { QUESTIONS_Y5_ZOONOSES_2026_C } from '../../src/data/questions-y5-zoonoses-2026-c.js';
import { QUESTIONS_Y5_ZOONOSES_2026_D } from '../../src/data/questions-y5-zoonoses-2026-d.js';
import { QB_Y5_FINAL_MIXED } from '../../src/data/questions-y5-final-mixed.js';

const banks = [
  QUESTIONS_MID86_ZOONOSES,
  QB_Y5_ZOONOSES_0925,
  QB_Y5_ZOONOSES_0925B,
  QB_Y5_ZOONOSES_2026,
  QUESTIONS_Y5_ZOONOSES_2026_B,
  QUESTIONS_Y5_ZOONOSES_2026_C,
  QUESTIONS_Y5_ZOONOSES_2026_D,
  QB_Y5_FINAL_MIXED,
];
const bankById = new Map(
  banks.flat().filter((q) => q.subject === 'zoonoses').map((q) => [String(q.id), q]),
);

const wordsAfterReview = [
  'แมลงทรัพยาหลวง',
  'แทคีโซซิต',
  'แบรดีโซซิต',
  'ตัวเหี้ยน',
  'พองาม',
  'M-pox',
  'สัตว์เคี้ยวพืช',
  '[ภาพประกอบ]',
  '[Figure]',
];

test('โจทย์ฉบับอังกฤษครบทุกข้อ zoonoses ในคลัง (367 ข้อ)', () => {
  const ids = Object.keys(QUESTION_TRANSLATIONS_ZOONOSES);
  assert.equal(ids.length, 367);
  assert.equal(bankById.size, 367);
  for (const id of bankById.keys()) {
    assert.ok(QUESTION_TRANSLATIONS_ZOONOSES[id], `ข้อ ${id} ในคลังไม่มีฉบับแปล`);
  }
  for (const id of ids) {
    assert.ok(bankById.has(id), `ฉบับแปลมีข้อ ${id} ซึ่งไม่ใช่ข้อ zoonoses ในคลัง`);
  }
});

test('ทุกข้อมีโจทย์ และตัวเลือกเรียง/นับตรงกับคลัง', () => {
  for (const [id, t] of Object.entries(QUESTION_TRANSLATIONS_ZOONOSES)) {
    const bank = bankById.get(id);
    assert.ok(t.q && t.q.length > 10, `ข้อ ${id} โจทย์ฉบับแปลว่าง`);
    if (bank.type === 'tf') {
      assert.ok(!t.options, `ข้อ ${id} (tf) ต้องไม่มี options — ปุ่ม True/False เป็นของ UI`);
      continue;
    }
    if (!Array.isArray(bank.options)) {
      // ข้อเขียน/ตอบสั้นไม่มี options ตามต้นฉบับ — ฉบับแปลก็ต้องไม่มี
      assert.ok(!t.options, `ข้อ ${id} คลังไม่มี options (${bank.type}) แต่ฉบับแปลมี`);
      continue;
    }
    assert.ok(Array.isArray(t.options), `ข้อ ${id} ไม่มี options ในฉบับแปล`);
    assert.equal(t.options.length, bank.options.length, `ข้อ ${id} จำนวนตัวเลือกไม่ตรงคลัง`);
    t.options.forEach((opt, i) => {
      assert.ok(opt && opt.length > 0, `ข้อ ${id} ตัวเลือก ${i} ว่าง`);
    });
    // ตัวเลือกบางข้อในคลังไทยเป็นศัพท์อังกฤษอยู่แล้ว (ชื่อ study design ฯลฯ)
    // จึงตรวจที่โจทย์ซึ่งเป็นภาษาไทย: ฉบับแปลต้องไม่เหมือนต้นฉบับ
    assert.notEqual(t.q, bank.q, `ข้อ ${id} โจทย์ฉบับแปลเหมือนต้นฉบับไทย — ไม่น่าจะแปลแล้ว`);
  }
});

test('คำที่ผู้ตรวจสั่งแก้ (พ.ย. 2568) ต้องไม่ย้อนกลับมาในไฟล์ข้อมูล', () => {
  const text = JSON.stringify(QUESTION_TRANSLATIONS_ZOONOSES) + JSON.stringify(VETWIKI_GLOSSARY_ZOONOSES);
  for (const word of wordsAfterReview) {
    assert.ok(!text.includes(word), `ยังพบ "${word}" ซึ่งผู้ตรวจสั่งแก้แล้ว`);
  }
  assert.ok(JSON.stringify(QUESTION_TRANSLATIONS_ZOONOSES).includes('Mansonia mosquitoes'), '208041 ต้องใช้ Mansonia mosquitoes');
  assert.ok(JSON.stringify(QUESTION_TRANSLATIONS_ZOONOSES).includes('2519 BE (1976)'), '8031 ต้องเป็นปี 2519 BE (1976) ตามหลักฐาน');
  assert.ok(!JSON.stringify(QUESTION_TRANSLATIONS_ZOONOSES).includes('2499 BE'), 'ห้ามกลับไปปี 2499 BE');
});

test('กล่องศัพท์ครบ 16 บท anchor จริง แถวมีครบทั้งสามช่อง ศัพท์ไม่ซ้ำในบทเดียว', () => {
  const anchors = Object.keys(VETWIKI_GLOSSARY_ZOONOSES);
  assert.equal(anchors.length, 16);
  const notesText = readFileSync(
    fileURLToPath(new URL('../../src/data/notes-y5-zoonoses.js', import.meta.url)),
    'utf8',
  );
  for (const [anchor, rows] of Object.entries(VETWIKI_GLOSSARY_ZOONOSES)) {
    assert.ok(notesText.includes(anchor), `anchor ${anchor} ไม่พบใน notes-y5-zoonoses.js`);
    assert.ok(rows.length >= 6, `บท ${anchor} มีศัพท์เพียง ${rows.length} คำ`);
    const seen = new Set();
    for (const row of rows) {
      assert.ok(row.term && row.th && row.meaning, `บท ${anchor} มีแถวไม่ครบช่อง`);
      assert.notEqual(row.term, row.th, `บท ${anchor} คำ "${row.term}" คำแปลเหมือนศัพท์`);
      assert.ok(!seen.has(row.term), `บท ${anchor} ศัพท์ "${row.term}" ซ้ำ (React key จะชนกัน)`);
      seen.add(row.term);
    }
  }
});
