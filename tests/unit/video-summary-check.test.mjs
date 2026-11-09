// The rules a clip summary is held to (src/lib/video-summary-check.js): each
// case is one a real draft of the endometritis sample broke or nearly broke.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { thaiWords, keyPointCap, lintSummary, coverage, unsupportedClaims, transliterated, voiceErrors, overlap, thaiNumbers, listParts } from '../../src/lib/video-summary-check.js';

const base = (over = {}) => ({
  oneLiner: 'ภาวะ endometritis ในม้า ตั้งแต่ uterine defense ถึงการรักษา',
  keyPoints: [
    { t: 600, text: 'ม้าปกติผสมติดราว 75-90% ตัวที่ไม่ติดต้องหาสาเหตุ' },
    { t: 1100, text: 'Infection ต้องมี adherence penetration และ colonisation' },
    { t: 1500, text: 'PBIE เป็น non-infectious inflammation ต่อ semen' },
    { t: 2000, text: 'Cytology พบ PMN เกิน 2% บ่งชี้ endometritis' },
    { t: 2500, text: 'Pyometra มี active CL ต้องให้ PGF2 alpha ก่อน' },
  ],
  emphasis: [],
  remember: [],
  chapters: [{ id: 'c1', line: 'วัตถุประสงค์ และ uterine defense' }],
  ...over,
});
const opts = { durationSec: 3000, transcriptWords: 10000, chapterIds: ['c1'], teaching: { start: 290, end: 2900 } };

test('Thai words are counted the way a Thai reader counts them', () => {
  assert.equal(thaiWords('มดลูกอักเสบ'), 2);
  assert.ok(thaiWords('Fertility rate ม้าปกติ 75-90 เปอร์เซ็นต์') >= 5);
});

test('the key-point cap grows with the clip, never past its tiers', () => {
  assert.equal(keyPointCap(15 * 60), 4);
  assert.equal(keyPointCap(20 * 60), 5);
  assert.equal(keyPointCap(2 * 60), 1);
  assert.equal(keyPointCap(30 * 60), 7);
  assert.equal(keyPointCap(3 * 3600), 10);
});

test('a clean summary passes', () => {
  const r = lintSummary(base(), opts);
  assert.deepEqual(r.errors, []);
});

test('abbreviations are not sentence breaks; two sentences are', () => {
  const texts = ['เชื้อหลักคือ Streptococcus zooepidemicus, E. coli, Staphylococcus spp.', 'Fluid มากกว่า 2 ซม. ใน 6-36 ชม. หลัง breeding', 'Cytology พบ PMN เกิน 2.5%'];
  const ok = base({ keyPoints: base().keyPoints.map((p, i) => (texts[i] ? { ...p, text: texts[i] } : p)) });
  assert.deepEqual(lintSummary(ok, opts).errors, []);
  const two = base({ keyPoints: [{ t: 600, text: 'PBIE ไม่ติดเชื้อ. ต้องรักษาด้วย oxytocin' }, ...base().keyPoints.slice(1)] });
  assert.ok(lintSummary(two, opts).errors.some((e) => /more than one sentence/.test(e)));
});

test('voice: the fact itself, never the lecturer, a colour, a slide or a middle dot', () => {
  for (const text of ['อาจารย์บอกว่า PBIE ไม่ติดเชื้อ', 'red คือ INFECTION', 'PBIE · non-infectious', 'ตามสไลด์ PBIE ไม่ติดเชื้อ']) {
    const r = lintSummary(base({ keyPoints: [{ t: 600, text }, ...base().keyPoints.slice(1)] }), opts);
    assert.equal(r.ok, false, text);
  }
});

test('the polish pass as rules: no study advice, no summary naming itself, % for percent', () => {
  const bad = [
    base({ oneLiner: 'สรุป endometritis ใน mare: uterine defense, PBIE และการรักษา' }),
    base({ keyPoints: [{ t: 600, text: 'Contamination ไม่เท่ากับ infection ต้องแยก concept นี้ให้ชัด' }, ...base().keyPoints.slice(1)] }),
    base({ keyPoints: [{ t: 600, text: 'Fertility rate ม้าปกติผสมติดประมาณ 75-90 เปอร์เซ็นต์' }, ...base().keyPoints.slice(1)] }),
    // The first batch: exam talk and coaching that passed every other gate.
    base({ emphasis: [{ t: 700, text: 'อุณหภูมิ AV 45 °C เคยออกข้อสอบ' }] }),
    base({ emphasis: [{ t: 700, text: 'ข้อสอบเป็นถูกผิด 10 ข้อ' }] }),
    base({ emphasis: [{ t: 700, text: 'PCR ไม่ใช่แอนติเจน จำไว้ห้ามพลาด' }] }),
  ];
  for (const b of bad) assert.equal(lintSummary(b, opts).ok, false, JSON.stringify(b.oneLiner + b.keyPoints[0].text));
});

test('the voice rules match whole words, and course logistics and set-up talk fail', () => {
  // The review of #147: facts the old substring rules held, and lines they let through.
  for (const fact of ['ไก่พ่อแม่พันธุ์ต้องจำกัดอาหาร', 'เชื้อมาพร้อมนักท่องเที่ยว', 'สัตว์เคยออกอาการชัก', 'ต้องรู้จักโรคนี้', 'BQM ให้คะแนนผ่านที่ 60']) assert.deepEqual(voiceErrors(fact), [], fact);
  for (const bad of ['ต้องจำค่า 45 °C', 'ท่องจำค่าปกติ', 'เรื่องนี้เคยออก', 'แนะนำวิชา 1 หน่วยกิต เกณฑ์คะแนนสอบและเช็คชื่อ', 'จำนวนนิสิต 3-4 คนต่อกลุ่ม', 'ช่วงต้นเป็นการเตรียมระบบถ่ายทอดและส่งไฟล์เรียน']) assert.notDeepEqual(voiceErrors(bad), [], bad);
  assert.equal(lintSummary(base({ oneLiner: 'คลิปสาธิตการผ่าตัดทำหมันสุนัขเพศผู้' }), opts).ok, false);
  // Two numbers, two facts; the same words with the same numbers, one.
  assert.equal(overlap('STT สุนัขปกติ 13-14 มม.', 'STT แมวปกติ 11-12 มม.'), 0);
  assert.ok(overlap('vertical คือเชื้อจากแม่ผ่านฟองไข่มาถึงลูกเจี๊ยบ', 'vertical คือจากแม่ผ่านฟองไข่มาถึงลูกเจี๊ยบ') >= 0.85);
});

test('numbers Scribe writes in Thai words count as evidence, whole words only', () => {
  // The Year-5 final cards, 7 Nov: "82 องศา" was held because the transcript said แปดสิบสอง.
  assert.deepEqual(thaiNumbers('ล้างซากด้วยน้ำร้อนแปดสิบสององศา ห้ามใช้ สามารถทำได้ ศูนย์จุดเก้าเก้า ลบร้อยเก้าสิบหก ยี่สิบห้าวัน สี่ถึงแปดองศา'), ['82', '0.99', '196', '25', '4', '8']);
  const card = { oneLiner: 'x', keyPoints: [{ t: 100, text: 'ล้างซากด้วยน้ำร้อน 82 °C' }], emphasis: [], remember: [], chapters: [] };
  assert.deepEqual(unsupportedClaims(card, () => 'ล้างซากด้วยน้ำร้อนแปดสิบสององศาเซลเซียส'), []);
  assert.equal(unsupportedClaims(card, () => 'ห้ามล้างซากด้วยน้ำร้อน').length, 1, 'ห้าม is no five');
});

test('a card line wholly in English fails; a remember item may be a term and its number', () => {
  assert.ok(lintSummary(base({ oneLiner: 'Endometritis in mare: defense, PBIE, diagnosis and treatment.' }), opts).errors.includes('one-liner: not written in Thai'));
  assert.deepEqual(lintSummary(base({ remember: [{ t: 2500, text: 'Cloprostenol 250 µg IM' }] }), opts).errors, []);
});

test('the card follows the whole lecture: a long stretch with no key point fails', () => {
  const r = lintSummary(base({ keyPoints: base().keyPoints.slice(0, 2) }), opts);
  assert.ok(r.errors.some((e) => /no key point from/.test(e)));
});

test('one fact once across the card', () => {
  const r = lintSummary(base({ remember: [{ t: 610, text: 'ม้าปกติผสมติดราว 75-90%' }] }), opts);
  assert.ok(r.errors.some((e) => /says what keyPoints/.test(e)));
});

test('coverage: concepts and slide numbers by the index, marks and stresses by a nearby line', () => {
  const must = [
    { id: 'c:pbie', kind: 'concept', label: 'PBIE', at: 2000 },
    { id: 'n:30:0', kind: 'number', text: 'Oxytocin (IM 10-20 Unit/mare', at: 2900, page: 30 },
    { id: 'm:30', kind: 'mark', text: '1.2 Ecbolic drugs', at: 1520, page: 30 },
    { id: 's:2410', kind: 'stress', text: 'อย่าลืม', at: 2410 },
    { id: 's:100', kind: 'stress', text: 'อย่าลืม', at: 100 },
  ];
  const r = coverage(base(), must, { chapters: [{ id: 'c1', start: 290, end: 900 }], pageText: (n) => (n === 30 ? 'Ecbolic drugs Oxytocin PGF2 inflammation' : '') });
  assert.deepEqual(r.missing, ['s:100']);
  // The 1500 s point names "inflammation", a word of the mark's own slide.
  assert.equal(r.covered.find((c) => c.id === 'm:30').layer, 'keyPoints');
});

test('nothing invented: numbers, terms and abbreviations must be in the evidence of that moment', () => {
  const s = (text) => base({ keyPoints: [{ t: 600, text }], chapters: [] });
  const ev = () => 'ซับมิวคซ่านะครับ ชั้นไมโอมมิตร มันเป็นโรคของ OI list ต้องรายงาน fluid 2 cm 6-36 h';
  assert.deepEqual(unsupportedClaims(s('Endometrium คือ mucosa รวม submucosa เหนือ myometrium'), ev, ['endometrium', 'mucosa']), []);
  assert.deepEqual(unsupportedClaims(s('CEM อยู่ใน OIE list ต้องรายงาน'), ev, ['cem']), []);
  const bse = unsupportedClaims(s('ป้องกันด้วย BSE'), ev, []);
  assert.deepEqual(bse[0].terms, ['bse']);
  const dose = unsupportedClaims(s('Fluid มากกว่า 3 cm'), ev, ['fluid']);
  assert.deepEqual(dose[0].numbers, ['3']);
});

test('English terms said in Thai script are recognised; decoys are not', () => {
  assert.equal(transliterated('ซับมิวคซ่านะครับ', 'submucosa'), true);
  assert.equal(transliterated('ฉีดออกซิโทซินนะครับ', 'oxytocin'), true);
  assert.equal(transliterated('ให้เจนตามัยซินนะ', 'gentamicin'), true);
  assert.equal(transliterated('เกิดปัญหาการติดพวกสเตอรอยด์ฮอร์โมน', 'cytology'), false);
  assert.equal(transliterated('เรือบรรทุกเครื่องบินนะครับ', 'implantation'), false);
});

test('a chapter line is cut at its list commas, never inside a number', () => {
  // Rejoining every part with ', ' once turned 10,000 into 10, 000 on ten held cards.
  assert.deepEqual(listParts('ป่วยปีละ 10,000 ราย, ปีนี้ 15,000 ราย, จึงเป็นการระบาด'), ['ป่วยปีละ 10,000 ราย', 'ปีนี้ 15,000 ราย', 'จึงเป็นการระบาด']);
  assert.deepEqual(listParts('somatic cell <500,000 cells/ml'), ['somatic cell <500,000 cells/ml']);
  assert.deepEqual(listParts('A,B, C'), ['A', 'B', 'C']);
});

test('red is content unless it names a slide mark; the class arrangements are no content', () => {
  assert.deepEqual(voiceErrors('Red muscle fiber มี myoglobin สูงกว่า white muscle fiber'), []);
  assert.deepEqual(voiceErrors('เนื้อสัตว์แบ่งเป็น Red Meat เนื้อขาว อาหารทะเล และ game meat'), []);
  assert.ok(voiceErrors('คำที่ marked in red คือ ventral edema').includes('reports the lecturer instead of stating the fact'));
  assert.ok(voiceErrors('พักเที่ยงแล้วกลับมาเจอกันตอน 13:00 น.').includes('talks about the class instead of stating the fact'));
  assert.ok(voiceErrors('พัก 10 นาที').includes('talks about the class instead of stating the fact'));
  assert.deepEqual(voiceErrors('ม้าต้องพักฟื้น 2 สัปดาห์หลังผ่าตัด'), []);
});

test('a break inside a stretch is no gap in the key points', () => {
  const kp = (t) => ({ t, text: 'ข้อความ' });
  const teaching = { start: 0, end: 13000 };
  const gap = (s) => s.errors.filter((e) => e.startsWith('no key point'));
  const card = { oneLiner: 'x', keyPoints: [kp(300), kp(2500), kp(5000), kp(10300), kp(12800)], emphasis: [], remember: [], chapters: [] };
  assert.equal(gap(lintSummary(card, { durationSec: 13000, transcriptWords: 20000, teaching })).length, 1, '5000 to 10300 s without a key point');
  assert.equal(gap(lintSummary(card, { durationSec: 13000, transcriptWords: 20000, teaching, breaks: [{ start: 5200, end: 9900 }] })).length, 0, 'most of it a break');
});

test('a stray word from another alphabet is caught; Greek notation is not', () => {
  assert.ok(voiceErrors('ถ้า clear zone เกิน 12 มม. จากหลุม диаметร 10 มม.').includes('letters from another alphabet'));
  assert.ok(voiceErrors('vitreous เป็นวุ้นใส حجمใหญ่สุดในลูกตา').includes('letters from another alphabet'));
  assert.deepEqual(voiceErrors('Power เท่ากับ 1 ลบ β และ Giardia cyst 9-13 μm'), []);
});
