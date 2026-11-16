// The check a recorded clip passes before it is kept (scripts/lib/tts-check.mjs):
// numbers and units strict, terms confirmed or listed as unverified, never a
// reason to voice a clip again. Script and transcript pairs are real lines of
// the Swine run's ledger (16 Nov 2026), the transcript as ElevenLabs Scribe
// (Thai) wrote it, and Paxa speech to text where a second one is given.
import test from 'node:test';
import assert from 'node:assert/strict';
import { compare, englishNumbers, numbersIn, termHeard, thaiNumber, THAI_SPELLING } from '../../scripts/lib/tts-check.mjs';

test('a term written in Thai script by the transcript is heard', () => {
  for (const [script, heard] of [
    ['เพิ่มไขมันในอาหาร และคง fiber ไว้เท่าเดิม', 'เพิ่มไขมันในอาหารและคงไฟเบอร์ไว้เท่าเดิม'],
    ['ลำไส้ส่วน ileum ไต กระเพาะอาหาร และ ปอด', 'ลำไส้ส่วนอีเลียม ไต กระเพาะอาหาร และปอด'],
    ['ELISA ตรวจแอนติบอดีจากซีรัมของทั้งฝูง', 'เอไลซ่าตรวจแอนติบอดี้จากซีรัมของทั้งฝูง'],
  ]) assert.deepEqual(compare(script, heard), { ok: true, problems: [], unverified: [] }, script);
});

test('a Latin name no transcript confirms is unverified, and the clip still passes', () => {
  const c = compare('Mycoplasma suis ติดต่อสู่สุกรทางใด', 'Mycoplasma Sways ติดต่อสู่สุกรทางใด');
  assert.equal(c.ok, true);
  assert.deepEqual(c.unverified, ['suis']);
  assert.deepEqual(c.problems, []);
});

test('a second transcript can confirm a term the first one missed', () => {
  const script = 'hyopneumoniae และ atrophic rhinitis ตามลำดับ';
  assert.deepEqual(compare(script, 'Hyaline Pneumonia และ Atrophic Rhinitis ตามลำดับ').unverified, ['hyopneumoniae']);
  assert.deepEqual(compare(script, ['Hyaline Pneumonia และ Atrophic Rhinitis ตามลำดับ', 'hyopneumonia และ atrophic rhinitis ตามลำดับ']).unverified, []);
});

test('an acronym said as a Thai word is not confirmed', () => {
  // The run before the respelling: "APP" said as the word "app".
  assert.deepEqual(compare('ซึ่งเป็นโรคที่ต้องแยกจาก APP', ['ซึ่งเป็นโรคที่ต้องแยกจากแอฟ', 'ซึ่งเป็นโรคที่ต้องแยกจากแอป']).unverified, ['APP']);
  // Spelled letter by letter, as the respelling now sends it: in Latin letters or Thai letter names.
  assert.equal(termHeard('APP', 'ซึ่งเป็นโรคที่ต้องแยกจาก A P P'), true);
  assert.equal(termHeard('APP', 'ซึ่งเป็นโรคที่ต้องแยกจากเอ พี พี'), true);
  assert.equal(termHeard('HP-PRRSV', 'เอชพี พีอาร์อาร์เอสวี'), true);
  assert.equal(termHeard('HP-PRRSV', 'เอชพี พีอาร์เอสวี'), false);
});

test('a number said in English and written as English words is heard', () => {
  assert.equal(compare('ไวรัสทำลายเยื่อบุ และในประเทศไทยพบ 3 สายพันธุ์ คือ A, O และ Asia1', 'ไวรัสทำลายเยื่อบุและในประเทศไทยพบสามสายพันธุ์คือ A O และ Asia One').ok, true);
  assert.equal(compare('3 strains (A, O, Asia1) = FMD ไม่ใช่ Seneca', 'Three strains A. Oh Asia One equals FMD Metasenika').ok, true);
  assert.equal(compare('3.1 Mycoplasma hyopneumoniae 3.2 Actinobacillus', 'Three point one Mycoplasma hyopneumoniae Three point two Actinobacillus').ok, true);
});

test('numbers stay strict', () => {
  // Both voicings of this clip were heard without its numbers: voiced again, then listed as failed.
  const c = compare('arthritis. ตอบ 2 ใน 5.', 'Arthritis of so many hands');
  assert.equal(c.ok, false);
  assert.deepEqual(c.problems.map((p) => p.want), ['2', '5']);
  assert.equal(compare('ให้ยาขนาด 10 มิลลิกรัม', 'ให้ยาขนาดสิบห้ามิลลิกรัม').ok, false);
  assert.equal(compare('ให้ยาขนาด 10 มิลลิกรัม', 'ให้ยาขนาดสิบมิลลิกรัม').ok, true);
  // Two transcripts cannot add up to one reading: each must hold every number.
  assert.equal(compare('พบ 3 ใน 5 ตัว', ['พบสามในสี่ตัว', 'พบสองในห้าตัว']).ok, false);
  assert.equal(compare('พบ 3 ใน 5 ตัว', ['พบสามในสี่ตัว', 'พบสามในห้าตัว']).ok, true);
});

test('a second transcript settles numbers the first one joined or glossed', () => {
  // The three Swine clips that failed twice on 16 Nov 2026: Scribe (Thai), then Paxa speech to text.
  for (const [script, scribe, paxa] of [
    ['arthritis. ตอบ 2 ใน 5.', 'Arthritis อักเสบในข้อ', 'Arthritis ตอบ 2 ใน 5'],
    ['3, 6, 8, 13 และ 14', 'สาม หก แปดสิบสาม และสิบสี่', '3, 6, 8, 13 และ 14'],
    ['3 ถึง 6-8 และ 4 ถึง 7 และแต่ละพื้นที่พบ serotype ต่างกัน ชุดที่มี 3, 6, 8 จึงเป็นกลุ่ม cross reaction',
      'สามถึงหกถึงแปดและสี่ถึงเจ็ด และแต่ละพื้นที่พบ Serotype ต่างกัน ชุดที่มีสามหกแปดจึงเป็นกลุ่ม Cross Reaction',
      '3 ถึง 6 ถึง 8 และ 4 ถึง 7 และแต่ละพื้นที่พบ stereotype ต่างกัน ชุดที่มี 3 6 8 จึงเป็นกลุ่ม cross-reaction'],
  ]) {
    assert.equal(compare(script, scribe).ok, false, script);
    assert.equal(compare(script, [scribe, paxa]).ok, true, script);
  }
});

test('table values written back run together are the same reading; a different run is not', () => {
  // Equine Medicine lab tables, 16 Nov 2026: Paxa speech to text joins neighbouring values.
  assert.equal(compare('Plasma protein (g/dl) 4.0 5.0 5.2 ถึง 7.9 Fibrinogen (mg/dl) 0 600 100 ถึง 400',
    'Plasma protein G/DL 4.05.05.2-7.9 Fibrinogen MG/DL 0 600 100-400').ok, true);
  assert.equal(compare('Lymph (10 ยกกำลัง 3 /µl) 0.66 0.8 1.5 ถึง 5', 'Lymph 10 ยกกำลัง 3/ไมโครลิส 0.66 0.81.5 ถึง 5').ok, true);
  // "108 10" said as one run is heard as 180 (ร้อยแปดสิบ): that is not the same reading.
  assert.equal(compare('Creatine kinase (μ/l): 108 10 ถึง 350', 'Creatine Kinase MuL 180 ถึง 350').ok, false);
  // A decimal point in another place is another number.
  assert.equal(compare('3.26 2.48', '32.6 24.8').ok, false);
});

test('a unit heard as its homophone counts', () => {
  assert.equal(compare('ให้น้ำเกลือ 20 ลิตร', 'ให้น้ำเกลือ 20 ลิส').ok, true);
});

test('units stay strict', () => {
  assert.deepEqual(compare('ให้ยา 10 มิลลิกรัม', 'ให้ยาสิบกรัม').problems.map((p) => p.kind), ['unit']);
  assert.equal(compare('ให้ยา 10 มิลลิกรัม', 'ให้ยา 10 mg').ok, true);
});

test('an empty transcript fails', () => {
  assert.equal(compare('Mycoplasma suis', '').ok, false);
  assert.equal(compare('Mycoplasma suis', ['', '  ']).ok, false);
});

test('number words', () => {
  assert.equal(thaiNumber('สี่สิบเอ็ดจุดห้า'), '41.5');
  assert.deepEqual(englishNumbers('twenty four pigs, three point one, one hundred and five'), ['24', '3.1', '105']);
  assert.deepEqual(englishNumbers('Asia One'), ['1']);
  assert.deepEqual(numbersIn('1,250 ตัว 3.50'), ['1250', '3.5']);
});

test('the Thai spelling map holds Thai script only, keyed by lower-case letters', () => {
  for (const [k, v] of Object.entries(THAI_SPELLING)) {
    assert.match(k, /^[a-z]+$/);
    for (const s of v) assert.match(s, /^[฀-๿]+$/, `${k}: ${s}`);
  }
});
