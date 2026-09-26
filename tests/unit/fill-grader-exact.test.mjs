// ============================================================
// fill-grader-exact.test.mjs — a different number is not the answer
// ============================================================
// B01/B46 (bug hunt 2026-09-26). isCorrect() accepted any typed blank of
// three or more characters that CONTAINED the key. For a number that is a
// different number: the DEB optimum is 250 mEq/kg and "2500" scored correct,
// the Schirmer cut-off is 15 and "150" scored correct, the caudal epidural
// dose is 1 ml/100 kg and "10 ml" scored correct. The wrong mark reached the
// Results percentage, history, XP and, because api/_lib/exam-scoring.js
// imports the same isCorrect, the server-scored leaderboard.
//
// The other direction was wrong too: 4002 asks for the three factors of a
// product (Disease = ____ × ____ × ____), which have no order, and a
// complete answer in another order scored wrong.
//
// Every case here uses the real stem and keys of the corpus item named.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { isCorrect } from '../../src/hooks/utils.js';

const fill = (q, blanks, extra = {}) => ({ type: 'fill', q, blanks, ...extra });

const Q204 = fill('การทดสอบการผลิตน้ำตาใช้ ____ ค่าปกติ > ____ mm/min', ['Schirmer tear test', '15']);
const Q2211 = fill('Caudal epidural block ในวัว: ฉีด lidocaine 2% ที่ ___-___ space (between vertebrae), dose ___ ml/100 kg, max ___ ml', ['S5', 'C1', '1', '6']);
const Q4036 = fill('Optimum Ca:Available P ratio ในไก่เนื้อ (Broiler) = ____ และไก่ไข่ (Layer) = ____ (ตอบในรูป x:1)', ['2:1', '10:1']);
const Q4037 = fill('Dietary Electrolyte Balance (DEB) สูตร = (Na + K) − Cl, ค่า optimum สำหรับ growth = ____ mEq/kg', ['250']);
const Q4042 = fill('Coarse calcium (หินเกล็ดสำหรับไก่ไข่) มีขนาดอนุภาค ____ mm (ตอบเป็นช่วง x-y)', ['2-4']);
const Q4050 = fill('ต้องมีอาหารใน crop ไม่ต่ำกว่า ____ %', ['80-100']);
const Q4052 = fill('วัสดุรองพื้น (bedding) ใช้แกลบในอัตรา ____ kg/m²', ['4']);
const Q4056 = fill('การให้ความร้อนกับกากถั่วเหลืองสูงเกินไป (>____ °C) → Maillard reaction → ลดลง > ____ %', ['135', '50']);
const Q4002 = fill('สมการของ Disease คือ Disease = ____ × ____ × ____', ['Virulence', 'Frequency', 'Dose'], { unordered: true });
const Q4012 = fill('Quality Assurance (QA) มี 5 องค์ประกอบหลัก ได้แก่ Quality ____, Quality ____, Quality ____, Quality ____, และ ____',
  ['Control', 'Audit', 'Accreditation', 'Assessment', 'Traceability'], { unordered: [[0, 1, 2, 3]] });
const Q32 = fill('Splint สำหรับ green stick fracture ของ tibia วางด้าน ____', ['ด้านหน้า']);

test('a numeric key does not accept a longer number that contains it', () => {
  assert.equal(isCorrect(Q204, ['Schirmer tear test', '150']), false, '150 is not 15');
  assert.equal(isCorrect(Q204, ['Schirmer tear test', '115']), false);
  assert.equal(isCorrect(Q4037, ['2500']), false, '2500 is not 250');
  assert.equal(isCorrect(Q4037, ['1250']), false);
  assert.equal(isCorrect(Q4052, ['400']), false, '400 is not 4');
  assert.equal(isCorrect(Q4056, ['1350', '500']), false);
  assert.equal(isCorrect(Q4056, ['135', '500']), false);
  assert.equal(isCorrect(Q2211, ['S5', 'C1', '10 ml', '16 ml']), false, '10 ml/100 kg is ten times the dose');
});

test('a numeric range or ratio key does not accept a different range or ratio', () => {
  assert.equal(isCorrect(Q4042, ['2-40']), false);
  assert.equal(isCorrect(Q4042, ['12-40']), false);
  assert.equal(isCorrect(Q4050, ['80-1000']), false);
  assert.equal(isCorrect(Q4050, ['80-10']), false, 'a fragment of a range is not the range');
  assert.equal(isCorrect(Q4036, ['2:10', '10:1']), false);
  assert.equal(isCorrect(Q4036, ['12:1', '110:1']), false);
  assert.equal(isCorrect(Q4036, ['2-1', '10-1']), false, 'a range is not a ratio');
});

test('the right number is still right with a unit, spacing or another way of writing it', () => {
  assert.equal(isCorrect(Q204, ['Schirmer tear test', '15']), true);
  assert.equal(isCorrect(Q204, ['schirmer tear test', '> 15 mm/min']), true);
  assert.equal(isCorrect(Q4037, ['250 mEq/kg']), true);
  assert.equal(isCorrect(Q4037, ['250.0']), true);
  assert.equal(isCorrect(Q4052, ['4 kg/m2']), true, 'the 2 of m2 is part of the unit, not a second number');
  assert.equal(isCorrect(Q4052, ['4 kg/m²']), true);
  assert.equal(isCorrect(Q4056, ['135°C', '50%']), true);
  assert.equal(isCorrect(Q2211, ['S5', 'C1', '1 ml', '6 ml']), true);
  assert.equal(isCorrect(Q4042, ['2 - 4 mm']), true);
  assert.equal(isCorrect(Q4042, ['2–4']), true, 'an en dash is a dash');
  assert.equal(isCorrect(Q4042, ['2 ถึง 4']), true);
  assert.equal(isCorrect(Q4036, ['2 : 1', '10:1']), true);
  assert.equal(isCorrect(Q4037, ['๒๕๐']), true, 'Thai digits are digits');
});

// R1 (review 2026-09-26): Thai is written without spaces, so a number glued
// to a Thai word ("ประมาณ15") is still the one number the student wrote. Only a
// Latin letter, a digit or a decimal point before it makes it part of a code
// or unit. The containment grader accepted these, so the exact rule must too.
test('a number glued to a Thai word is still the number', () => {
  assert.equal(isCorrect(Q204, ['Schirmer tear test', 'ประมาณ15']), true);
  assert.equal(isCorrect(Q204, ['Schirmer tear test', 'มากกว่า15']), true);
  assert.equal(isCorrect(Q4037, ['ประมาณ250']), true);
  assert.equal(isCorrect(Q4037, ['เป็น250']), true);
  assert.equal(isCorrect(Q4050, ['ประมาณ80-100']), true);
  assert.equal(isCorrect(Q4056, ['มากกว่า135', 'ประมาณ50']), true);
  // The number itself is still checked exactly.
  assert.equal(isCorrect(Q4037, ['ประมาณ2500']), false);
  assert.equal(isCorrect(Q4056, ['มากกว่า1350', '50']), false);
  // A Latin letter before a digit still makes it a code or a unit.
  assert.equal(isCorrect(Q4052, ['4 kg/m2']), true);
});

test('two numbers where the key has one is not an answer', () => {
  assert.equal(isCorrect(Q4037, ['250 หรือ 300']), false);
  assert.equal(isCorrect(Q4052, ['3 or 4']), false);
});

test('a word key is not matched inside a longer word or code', () => {
  assert.equal(isCorrect(Q2211, ['S55', 'C1', '1', '6']), false, 'S55 is not S5');
  assert.equal(isCorrect(Q2211, ['S5', 'C10', '1', '6']), false);
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['noncohesive']), false);
  // The containment the older tests pin is kept.
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['cohesive bandage']), true);
});

const Q3 = fill('อุปกรณ์ใน bandage: ____ ใช้ทับ ____', ['conforming gauze', 'cast padding']);
const Q29 = fill('Approach femur โกนขนตั้งแต่ ____ ถึง ____', ['hip', 'tibia']);
const Q40 = fill('Approach femur กรีดผิวหนังจาก ____ ถึง ____', ['greater trochanter', 'lateral condyle']);

// R2 (review 2026-09-26): the plural of the key names the same structure.
// The word-edge guard stops "S55" for S5, not "hips" for hip.
test('the plural of a word key is the key', () => {
  assert.equal(isCorrect(Q29, ['hips', 'tibias']), true);
  assert.equal(isCorrect(Q40, ['greater trochanters', 'lateral condyles']), true);
  assert.equal(isCorrect(Q3, ['conforming gauzes', 'cast paddings']), true);
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['cohesives']), true);
  assert.equal(isCorrect(Q29, ['hips ของสุนัข', 'tibias']), true);
  // Anything longer than s or es is another word.
  assert.equal(isCorrect(Q29, ['hipster', 'tibia']), false);
  assert.equal(isCorrect(Q29, ['hipsx', 'tibia']), false);
  // A digit after the key is still a different code, plural or not.
  assert.equal(isCorrect(Q2211, ['S55', 'C1', '1', '6']), false);
  assert.equal(isCorrect(Q2211, ['S5s', 'C1', '1', '6']), false, 'a code has no plural');
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['noncohesives']), false);
});

test('a negated key is not the key', () => {
  assert.equal(isCorrect(fill('อวัยวะคือ ____', ['ตับอ่อน']), ['ไม่ใช่ตับอ่อน']), false);
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['not cohesive']), false);
  assert.equal(isCorrect(fill('____ band', ['cohesive']), ['non-cohesive']), false);
  assert.equal(isCorrect(fill('อวัยวะคือ ____', ['ตับอ่อน']), ['ตับอ่อนของสุนัข']), true);
});

test('blanks the question marks unordered are graded as a set', () => {
  assert.equal(isCorrect(Q4002, ['Dose', 'Virulence', 'Frequency']), true, 'the factors of a product have no order');
  assert.equal(isCorrect(Q4002, ['Virulence', 'Frequency', 'Dose']), true);
  assert.equal(isCorrect(Q4002, ['Dose', 'Dose', 'Dose']), false, 'one factor three times is not three factors');
  assert.equal(isCorrect(Q4002, ['Dose', 'Virulence', '']), false);
  assert.equal(isCorrect(Q4012, ['Audit', 'Control', 'Assessment', 'Accreditation', 'Traceability']), true);
  assert.equal(isCorrect(Q4012, ['Traceability', 'Control', 'Assessment', 'Accreditation', 'Audit']), false,
    'only the four Quality slots are a set; the fifth is its own blank');
});

test('without the flag, order still matters', () => {
  const ordered = fill('PDCA ย่อมาจาก ____ → ____', ['Plan', 'Do']);
  assert.equal(isCorrect(ordered, ['Do', 'Plan']), false);
  assert.equal(isCorrect(ordered, ['Plan', 'Do']), true);
});

test('a key that repeats the word the stem prints before the blank accepts the rest', () => {
  // 32: "วางด้าน ____", key "ด้านหน้า". The student who writes หน้า read the stem.
  assert.equal(isCorrect(Q32, ['หน้า']), true);
  assert.equal(isCorrect(Q32, ['ด้านหน้า']), true);
  assert.equal(isCorrect(Q32, ['หลัง']), false);
  assert.equal(isCorrect(Q32, ['น้า']), false, 'a fragment of the rest is not the rest');
  assert.equal(isCorrect(Q32, ['ด้านหลัง']), false);
});

test('every fill item in the corpus accepts its own key', async () => {
  const { BANK_REGISTRY } = await import('../../src/data/bank-registry.generated.js');
  const seen = new Set();
  let n = 0;
  for (const bank of BANK_REGISTRY) {
    for (const q of await bank.load()) {
      if (q?.type !== 'fill' || seen.has(q.id)) continue;
      seen.add(q.id);
      n++;
      assert.equal(isCorrect(q, [...q.blanks]), true, `fill ${q.id} rejects its own key ${JSON.stringify(q.blanks)}`);
    }
  }
  assert.ok(n >= 20, `expected the corpus fill items, found ${n}`);
});

// Review round 2 (26 Sep): the exact-number and negation rules must not mark
// wrong what the stem itself supplies. A unit copied from the stem is not a
// second number, and the stem's own "ไม่ ____" may be written with the key.
const Q202477 = fill('ในการเลี้ยงสัตว์น้ำ ข้อดีของการคัดขนาดสัตว์น้ำคือทำให้สัตว์น้ำไม่ ____ และข้อดีของการจดบันทึกข้อมูลฟาร์มคือทำให้ ____ ข้อมูลย้อนหลังได้ และใช้ประกอบการประเมิน ____ ของฟาร์ม', ['กินกันเอง', 'ตรวจสอบ', 'มาตรฐาน']);

test('numbers the stem prints are not counted against the student', () => {
  const ok = (b2) => isCorrect(Q2211, ['S5', 'C1', b2, '6']);
  assert.equal(ok('1 ml/100 kg'), true);
  assert.equal(ok('1ml/100 kg'), true);
  assert.equal(ok('1 ml ต่อ 100 kg'), true);
  assert.equal(ok('10'), false, '10 is not 1');
  assert.equal(ok('100'), false, 'the stem number alone is not the answer');
  assert.equal(ok('1 ml/10 kg'), false, 'a different unit number is still a second number');
  assert.equal(isCorrect(Q4036, ['2:1', '10:1 (x:1)']), true);
});

test('the stem\'s own negation written with the key is still the answer', () => {
  const rest = ['ตรวจสอบ', 'มาตรฐาน'];
  assert.equal(isCorrect(Q202477, ['ไม่กินกันเอง', ...rest]), true);
  assert.equal(isCorrect(Q202477, ['ไม่ กินกันเอง', ...rest]), true);
  assert.equal(isCorrect(Q202477, ['กินกันเอง', ...rest]), true);
  assert.equal(isCorrect(Q202477, ['ไม่ใช่กินกันเอง', ...rest]), false);
  assert.equal(isCorrect(Q202477, ['ไม่ ใช่กินกันเอง', ...rest]), false);
});
