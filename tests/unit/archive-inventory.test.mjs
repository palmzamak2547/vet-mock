import test from 'node:test';
import assert from 'node:assert/strict';
import { categorise, documentQuality, thaiPageQuality } from '../../scripts/lib/archive-inventory.mjs';

test('a clean Thai page is ok and an empty one is an image', () => {
  const prose = 'ภาวะโลหิตจางในสุนัขที่เป็นโรคไตเรื้อรังเกิดจากไตสร้างฮอร์โมนอีริโทรโพอีตินได้น้อยลง ทำให้ไขกระดูกสร้างเม็ดเลือดแดงลดลง';
  assert.equal(thaiPageQuality(prose).kind, 'ok');
  assert.equal(thaiPageQuality('  12 ').kind, 'image');
});

test('substituted glyphs, private-use marks and a split sara am read as damaged Thai', () => {
  // Measured in the 2569 archive: ü for ว, Ā for ห, ÿ for ส inside Thai words.
  assert.equal(thaiPageQuality('CKD ทำใĀ้ GI blood loss ตัüเĀลือง ÿุนัขตัüนึงตรüจพบ ไม่ÿามารถเĀ็นได้').kind, 'bad');
  assert.equal(thaiPageQuality('วิชาการจัดการอะควาเรียม ส าหรับนิสิตสัตวแพทยศาสตร์ คุณภาพน ้าและสวัสดิภาพ').kind, 'bad');
  assert.equal(thaiPageQuality('หนาขอที่ถูกต้อง เลือกคำตอบที่ถูกต้องที่สุดจากตัวเลือกด้านล่างนี้').kind, 'bad');
});

test('few tone marks in a long Thai page asks for a render, not a rejection', () => {
  const terse = 'ระบบทางเดินอาหาร การตรวจวินิจฉัย การรักษา การดูแลหลังการผ่าตัด การวางแผนการรักษา ระบบทางเดินปัสสาวะ';
  assert.equal(thaiPageQuality(terse).kind, 'low');
});

test('categorise reads the path the way the archive is laid out', () => {
  assert.equal(categorise('ปี 4/เทอม 1/COM ANI CLIN SCI I/Final/com1 final TJ.pdf'), 'exam');
  assert.equal(categorise('ปี 3/เทอม 1/Ani Nutrition/Midterm/รวมโพย Nutrition Midterm.pdf'), 'exam');
  assert.equal(categorise('ปี 2/เทอม 2/VET NEURO/Lecture/Midterm/📓Neuroanatomy sum.pdf'), 'summary');
  assert.equal(categorise('ปี 3/เทอม 2/Vet Anes/ประมวลรายวิชาของ 3106302 (2024-2)x - myCourseVille.pdf'), 'syllabus');
  assert.equal(categorise('ปี 1/🔥สำคัญ!!! แวะมาอ่านก่อน!!!.pdf'), 'syllabus');
  assert.equal(categorise('ปี 3/เทอม 2/Vet Pathol II/Lecture/Block 2 (midterm)/Respiratory.goodnotes'), 'goodnotes');
  assert.equal(categorise('⭐️Textbook/Anatomy/Guide To The Dissection Of The Dog.pdf'), 'textbook');
  assert.equal(categorise('CUVC 2025/AKI_CUVC 2025..pdf'), 'outside');
});

test('a word that only contains "test" is a lecture deck, not an exam', () => {
  assert.equal(categorise('ปี 4/เทอม 1/COM ANI CLIN SCI I/Midterm/🟥 01 Gastrointestinal System.pdf'), 'deck');
  assert.equal(categorise('ปี 3/เทอม 2/Vet Clin Chem/Midterm/Lab/Quiz/Quiz Clinchem Lab Mid.pdf'), 'exam');
});

test('documentQuality names the pages that need a render', () => {
  const q = documentQuality(['ok', 'bad', 'image', 'ok']);
  assert.deepEqual(q.needsRender, [2, 3]);
  assert.equal(q.verdict, 'mixed');
  assert.equal(documentQuality(['image', 'image', 'image', 'image', 'image']).verdict, 'scan');
  assert.equal(documentQuality(['bad', 'bad', 'ok']).verdict, 'damaged-thai');
  assert.equal(documentQuality(['ok', 'ok', 'low']).verdict, 'text');
});
