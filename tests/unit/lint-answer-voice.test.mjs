// ============================================================
// An explanation explains; it does not narrate its source
// ============================================================
// lint:answer-voice reported 0 narrating explanations over the whole bank on
// 2026-09-23 while ~180 still said "เอกสารเขียนว่า…", "รุ่นพี่บันทึกว่าอาจารย์
// ออก…", "(Aj. Rosama เน้น)", "Vet 81 group ตอบ B" or "ข้อสอบชอบถามคู่กัน…".
// Its word list had never met those phrasings, and it did not read
// model_answer at all. Another ~65 explanations pointed at options by letter
// or position ("ข้อ D จึงถูก", "ตัวเลือกแรกผิดเพราะ") on rows whose options are
// shuffled per student, so the letter named a different row on screen.
//
// Each phrase class below is one the lint used to miss; each false positive is
// one a broader pattern would wrongly catch.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FIELDS, scanQuestions, voiceHits } from '../../scripts/lint-answer-voice.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

let nextId = 995000;
const row = (explain, extra = {}) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'tf', explain, ...extra });
const mcq = (explain, extra = {}) => row(explain, { type: 'mcq', options: ['หนึ่ง', 'สอง', 'สาม', 'สี่'], answer: 0, ...extra });
const rulesOf = (q) => [...new Set(voiceHits(q).map((h) => h.rule))];

test('each narrating phrase class the lint used to miss is now caught', () => {
  const cases = [
    ['เอกสารเขียนไว้ตรงว่า AE มีข้อจำกัดกว่าโรคอื่น', 'deck'],
    ['เอกสารแบ่งเกณฑ์ไว้ว่า 500 = mild', 'deck'],
    ['เอกสารให้เหตุผลว่าเป็นการแยกเชื้อชนิดอื่นออก', 'deck'],
    ['ตัวอย่างที่เอกสารยกคือ African horse sickness', 'deck'],
    ['เอกสารเน้นว่า TGE ทำให้ลูกสุกรแรกเกิดท้องเสียรุนแรง', 'deck'],
    ['รุ่นพี่บันทึกกำกับไว้ว่าอีกหนึ่งข้อของพาร์ทนี้คือ', 'senior-sheet'],
    ['💡 รุ่นพี่ทำดาวไว้ที่ข้อ "ไม่มีวัคซีน"', 'senior-sheet'],
    ['เกณฑ์ในชีทกำหนดเชื้อรามากกว่า 1 x 10^5 colony/g', 'senior-sheet'],
    ['💡 พาร์ท Ebola และ Nipah อาจารย์ออกละเอียด', 'lecturer'],
    ['ข้อนี้อาจารย์พรชลิตให้เป็นข้อหลัก', 'lecturer'],
    ['Azathioprine ห้ามใช้ในแมว ★★ (Aj. Rosama เน้น)', 'lecturer'],
    ['Aj.Vachira: ห้ามฉีด vaccine ในช่วงสังเกตอาการ', 'lecturer'],
    ['Lecture 2026 (อ.ภัทร์มนฉัตร PB): Greater risks', 'lecturer'],
    ['Vet 81 group ตอบ B (Lepto + Aflatoxin)', 'cohort'],
    ['Vet 83 mark X — กลุ่มนี้ไม่ตรงทั้งคู่', 'cohort'],
    ['💡 ข้อสอบชอบถามคู่กันสองชั้น', 'exam-prediction'],
    ['ท่อนี้เป็นจุดที่มักออกข้อสอบ', 'exam-prediction'],
    ['— เป็นจุดออกสอบทุกปี', 'exam-prediction'],
    ['จุดที่นักศึกษามักพลาดคือเหมารวมว่า', 'classmates'],
    ['Per Exercise 2 KEY: vaccination is the primary control approach', 'answer-sheet'],
    ['ข้อที่ผิดตามเฉลยคือข้อ "ใช้ voltage เป็นตัวแสดง"', 'answer-sheet'],
    ['✓ Answer Key: syllable 5 is circled.', 'answer-sheet'],
    ['สรุปทำเครื่องหมายดาวไว้ว่า MS ต้องการ NAD', 'deck'],
    ['ovulation ตาม slide ประมาณ 5-8 ng/mL', 'deck'],
    ['ผู้สรุปเขียนวิธีจำไว้ว่า วิเคราะห์เท่ากับ ประเมิน', 'senior-sheet'],
    ['ส่วนการจัดการโคลิกเน้นด้วยหมึกสีแดงว่า', 'marker-hand'],
    ['โน้ตระบุว่าค่า ORP สัมพันธ์กับโอโซน', 'marker-hand'],
    ['ข้อสอบเก่าระบุ rabbit gestation ประมาณ 30 วัน', 'prior-paper'],
    ['ซึ่งเป็นคู่เทียบที่ใช้แยกกันในข้อสอบ', 'prior-paper'],
    ['💡 ข้อสอบชุดนี้ชอบวางอาหารดิบหลายชนิดไว้ให้เลือก', 'prior-paper'],
  ];
  for (const [explain, rule] of cases) {
    assert.ok(rulesOf(row(explain)).includes(rule), `"${explain}" should hit ${rule}, got ${rulesOf(row(explain)).join(',') || 'nothing'}`);
  }
});

test('the phrases that only look like narration are left alone', () => {
  const innocent = [
    'ตัวเมียชอบออกมาวางไข่รอบรูก้นในช่วงเช้า ม้าจึงคันและเอาก้นไปถูผนังคอก',
    'faculty development พัฒนาอาจารย์ และ organizational development สร้างผู้นำ',
    'ไม่อนุญาตให้เข้าฆ่ากรณีสัตว์ไม่มีเอกสารรับรองที่ออกโดยเจ้าหน้าที่ผู้มีอำนาจ',
    'ผู้ขนส่งต้องมีเอกสารเคลื่อนย้ายและใบรับรอง',
    'มาตรฐานตาม อ.ย. 2556 กำหนดไว้',
    'ส่งน้ำนมเข้าศูนย์รวบรวมน้ำนมของ อ.ส.ค. และประสานกับ อ.บ.ต. ในพื้นที่',
    'ปล่อยให้เข้าฆ่าก่อนแล้วตามเอกสารทีหลัง',
    'จัดทำเอกสารและบันทึก และมี 12 ขั้นตอนในการนำไปปฏิบัติ',
    'เก็บตามเงื่อนไขที่ผู้ผลิตระบุบนฉลาก/เอกสารกำกับยา',
    '💡 เอกสาร แยกสัมผัส อุณหภูมิ และรถสะอาดต้องมาครบ',
    'หนังสือรับรองสุขภาพฝูงสัตว์ไม่ใช่เอกสารตั้งต้นของกระบวนการนี้',
    'ทิศทางถูกแต่ตีกรอบผิด edge effect เกิดได้ทุกที่',
    'Mineral oil on slide → microscope LP/HP → look for adult mites',
  ];
  for (const explain of innocent) assert.deepEqual(rulesOf(row(explain)), [], explain);
});

test('a model answer is read in the same voice as the explanation', () => {
  assert.ok(FIELDS.includes('model_answer'));
  const q = row('ปัจจัยมีหกข้อ', { type: 'short', model_answer: 'ปัจจัยที่อาจารย์ให้ไว้มีหกข้อ ข้อแรกคือ human demographic changes' });
  const hits = voiceHits(q);
  assert.deepEqual(hits.map((h) => `${h.field}/${h.rule}`), ['model_answer/lecturer']);
});

test('an option named by letter or position fails only where the options shuffle', () => {
  const pointing = [
    'ข้อ D จึงถูก ส่วนตัวลวงที่คนพลาดบ่อยคือข้อ B',
    'ตัวเลือกแรกผิดเพราะ CEO แพร่ระหว่างตัวได้',
    'จึงตัดตัวเลือกสุดท้ายออก',
    'ส่วนสองตัวเลือกแรกเป็นตัวเลขไขมันตั้งต้น',
    'ข้อที่ล่อให้ตอบผิดคือข้อสุดท้าย เพราะสรุปผิด',
    'ตัวเลือก a ผิด — Bulldog เป็น barrel-chested',
    'ช่วงอาหารเหลือทิ้ง ข้อแรกเป็นนิยามของ rotational grazing',
    'ตั้งอุณหภูมิสูงกว่าปกติ สองข้อแรกเป็นช่วง LTLT และ HTST',
    '"C × A" = เป็นการคูณเหมือนข้อแรก แค่สลับที่กัน',
    'ผู้ที่ท่องเพียงว่าสารเร่งเนื้อแดงคือ beta-agonist จะเลือกข้อแรกทันที',
  ];
  for (const explain of pointing) {
    assert.ok(rulesOf(mcq(explain)).includes('option-position'), `shuffled: "${explain}"`);
    assert.ok(!rulesOf(mcq(explain, { noShuffle: true })).includes('option-position'), `noShuffle keeps the order: "${explain}"`);
    assert.ok(!rulesOf(row(explain)).includes('option-position'), `no options, nothing to shuffle: "${explain}"`);
  }
  const ordinary = [
    'ประชากรหนาแน่นเป็นปัจจัยข้อแรกที่ระบุไว้',
    'amoxicillin จึงไม่ใช่ตัวเลือกแรก — enrofloxacin ครอบคลุมกว้าง',
    'high-fat/raw/fiber ไม่ใช่ตัวเลือกแรก',
    'ยาตัวเลือกแรกของ Staph pyoderma คือ cephalexin',
    'ประวัติสุขภาพโดยรวมคือข้อแรกของการซักประวัติแม่ม้า',
    'ปัจจัยโน้มนำข้อแรกคือแผลปลายขาที่ epithelialization ช้า',
    '"มีมาตรการควบคุมหรือไม่" = คำถามข้อแรกถูก แต่จำนวนคำถามผิด',
    'Vitamin D3 ต่างจาก vitamin D2',
  ];
  for (const explain of ordinary) assert.ok(!rulesOf(mcq(explain)).includes('option-position'), explain);
});

// The live bank: every explanation and model answer in the voice of the answer.
const rows = [];
for (const f of fs.readdirSync(path.join(ROOT, 'src/data')).filter((n) => /^questions-.*\.js$/.test(n))) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/data', f)).href);
  const entry = Object.values(mod).find(Array.isArray);
  if (entry) for (const q of entry) rows.push({ q, f });
}

test('no explanation or model answer in the bank narrates its source', () => {
  assert.ok(rows.length > 6000, `only ${rows.length} rows loaded`);
  const hits = [];
  for (const { q, f } of rows) {
    const { hits: h } = scanQuestions([q], { file: f });
    for (const x of h) hits.push(`#${x.id} ${f} ${x.quote[0]}`);
  }
  assert.deepEqual(hits, []);
});

test('no question text or note uses นักศึกษา for the reader', () => {
  const found = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'src/data')).filter((n) => /^(?:questions|notes)-.*\.js$/.test(n))) {
    const src = fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8');
    src.split('\n').forEach((line, i) => { if (line.includes('นักศึกษา')) found.push(`${f}:${i + 1}`); });
  }
  assert.deepEqual(found, []);
});

// Three swine short-answer rows (8355, 8356, 8358) had no model_answer, so
// after writing an answer the reader got no คำตอบตัวอย่าง box and no AI
// grading. Every written swine-clinic row now carries one, in answer voice.
test('every written swine-clinic row has a model answer in the voice of the answer', () => {
  const written = rows.filter(({ q }) => q.subject === 'swine-clinic' && ['short', 'essay'].includes(q.type));
  assert.ok(written.some(({ q }) => q.id === 8355), 'the swine short rows are loaded');
  const missing = written.filter(({ q }) => !String(q.model_answer || '').trim()).map(({ q }) => q.id);
  assert.deepEqual(missing, []);
  for (const { q } of written) assert.deepEqual(voiceHits(q), [], `#${q.id}`);
});
