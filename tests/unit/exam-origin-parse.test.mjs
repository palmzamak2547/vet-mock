// src/lib/exam-origin-parse.js reads which cohort sat a question, on which
// paper and in which year, out of the prose in `examOrigin` and `source`.
// Every string below is copied from the bank as it stood on 2026-10-28. The
// rule the cases pin: a cohort is named only by a designator (Vet 85, VET84,
// รุ่นพี่ Vet 85) that the string does not mark as an author, and never by a
// file label such as "Mid 86" or "TJ86", which names the cohort a
// compilation was made for. Anything the string does not say stays null.
import assert from 'node:assert/strict';
import test from 'node:test';
import { EXAM_ORIGINS } from '../../src/data/exam-origins.js';
import {
  cohortList,
  compiledForCohorts,
  namesCohort,
  parseExamOrigin,
  parseProvenance,
} from '../../src/lib/exam-origin-parse.js';

const read = (text) => parseExamOrigin(text);
const fromSource = (text) => parseProvenance(text, { field: 'source' });

test('a recall or a paper names the cohort that sat it, and the paper', () => {
  const cases = [
    ['Equine Med midterm recall (Vet 85)', { cohort: 85, paper: 'midterm', year: null }],
    ['Zoonoses midterm recall (Vet 85, TJ86)', { cohort: 85, paper: 'midterm', year: null }],
    ['Equine Reproduction กลางภาค Vet 85', { cohort: 85, paper: 'midterm', year: null }],
    ['Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1', { cohort: 85, paper: 'final', year: null }],
    ['Aj. Mintra FIQC Vet 83 Midterm', { cohort: 83, paper: 'midterm', year: null }],
    ['Equine dentistry online test (Vet 81)', { cohort: 81, paper: 'quiz', year: null }],
    ['บันทึกหลังสอบสถานี POA วิชาอายุรศาสตร์และศัลยศาสตร์ม้า (Vet 85)', { cohort: 85, paper: 'station', year: null }],
    ['ข้อเขียนที่รุ่นพี่ Vet 85 บันทึกว่าเคยออกในข้อสอบกลางภาค Avian Medicine', { cohort: 85, paper: 'midterm', year: null }],
    ['Zoonoses (Vet 85) recalled matching section', { cohort: 85, paper: null, year: null }],
    ['VET84 ER Q13', { cohort: 84, paper: null, year: null }],
    ['Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update', { cohort: 81, paper: 'final', year: null }],
  ];
  for (const [text, want] of cases) assert.deepEqual(read(text), want, text);
});

test('several cohorts come back as an ascending list, a range expanded', () => {
  assert.deepEqual(read('Aj. Ekasingh Vet 84-86 Final').cohort, [84, 85, 86]);
  assert.deepEqual(read('Aquatic Med 3107520 คลังข้อสอบพาร์ทหน่วยงานและองค์กร (Vet 84 และ Vet 85)').cohort, [84, 85]);
  assert.deepEqual(cohortList([85, 84]), [84, 85]);
  assert.deepEqual(cohortList(85), [85]);
  assert.deepEqual(cohortList(null), []);
});

test('the cohort that updated or annotated a document is not the cohort that sat it', () => {
  assert.equal(read('Vet 80 past paper · Vet 83 update commentary').cohort, 80);
  assert.equal(read('Vet 81 Animal Repro Clinic (canine/feline content) · Vet 83 update tags 30% direct match · examiner = พี่นุ่น').cohort, 81);
  for (const text of [
    'Avian Medicine final recall (Vet 85 compilation)',
    'Milk Hygiene mid-term recall (Vet 86 compilation)',
    'แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดวัคซีน Mycoplasma',
    'แนวข้อเขียนที่รุ่นพี่ Vet 85 คัดมาจากสรุปรุ่นก่อนหน้าและบันทึกว่าอาจารย์สอนเน้น',
    'จุดที่รุ่นพี่ Vet 85 ทำเครื่องหมายว่าข้อสอบใช้ชื่อโรคในสรุปสรุป',
    'อิงแนวข้อสอบ จากคำตอบเรื่องโรคระบบประสาทที่รุ่นพี่ Vet 85 เตรียมไว้ ข้อนี้ไม่ได้ออกในรอบของรุ่นนั้น',
    'แต่งจากสรุป Zoonoses mid ของรุ่น Vet 85',
    'เขียนจากคาบเรียนเคสจริงที่รุ่นพี่ Vet 85 จดไว้',
    'เขียนขึ้นจากสรุปเคส SFTS ที่เพชรบูรณ์ในเอกสาร Vet 85',
    'Equine Sx concept (Vet 85) margin marks bandaging as a recurring VCA item',
    'Equine Sx concept deck (Vet 85 annotated slides)',
    'Equine Repro (Vet 85) study summary',
    'Swine Medicine midterm study notes, author-added lesion list (Vet 85)',
  ]) assert.equal(read(text).cohort, null, text);
});

// The year-4 origins EXAM_ORIGINS filed as cohort 86 cite the TJ files, each
// headed as senior recall notes compiled for Vet 86 before 86 sat the paper;
// where a block names its cohort it is 85 or 84. "86" here is who the file
// was for, so these read as no cohort at all, with the paper kept.
const FOR_86 = [
  ['COM I Final 86', 'final'],
  ['COM II Final 86', 'final'],
  ['COM III Final 86', 'final'],
  ['Food Safety Final 86', 'final'],
  ['Food Safety Mid 86', 'midterm'],
  ['HHM Ruminant Final TJ86', 'final'],
  ['HHM Ruminant Final TJ86 (Clinical Fluid Therapy in Cattle)', 'final'],
  ['HHM Ruminant Final TJ86 (Piyanat Prasomsri)', 'final'],
  ['HHM Ruminant Final TJ86 (Responsible Antimicrobial Selection)', 'final'],
  ['HHM Ruminant Final TJ86 (Saranporn Poothong)', 'final'],
  ['HHM Ruminant Final TJ86 (Sirirat Wataradee)', 'final'],
  ['HHM Ruminant Final TJ86 (Sirirat Wataradee Part III)', 'final'],
  ['HHM Ruminant Final TJ86 (Thanasak Boonserm)', 'final'],
  ['Swine Health Final TJ86', 'final'],
  ['Swine Health Final TJ86 อ.พรชลิต', 'final'],
  ['Swine Health Final TJ86 อ.สุพจน์', 'final'],
  ['Swine Health Final TJ86 อ.อธิภู', 'final'],
  ['Swine Herd Mid TJ86', 'midterm'],
  ['Swine Herd Mid TJ86 อ.บุญฤทธิ์', 'midterm'],
  ['Swine Herd Mid TJ86 อ.เพราพิลาส', 'midterm'],
  ['Swine Herd Mid TJ86 อ.รุ่งธรรม', 'midterm'],
  ['Swine Herd Mid TJ86 อ.อจิมา', 'midterm'],
  ['Swine Herd Mid TJ86 อ.อนุศกุล', 'midterm'],
  ['Swine Repro Final 86', 'final'],
  ['Swine Repro Mid 86', 'midterm'],
  ['Vet Imaging Final 86', 'final'],
  ['Vet Imaging Final 86 — Lab', 'final'],
  ['TJ86', null],
];

test('a "for 86" or TJ86 label never names the cohort that sat the paper', () => {
  for (const [text, paper] of FOR_86) {
    assert.deepEqual(read(text), { cohort: null, paper, year: null }, text);
    assert.equal(namesCohort(text), false, `${text} has no designator`);
    assert.deepEqual(compiledForCohorts(text), [86], `${text} is a file made for Vet 86`);
    // Read as a source too, the label is still no sitting.
    assert.equal(fromSource(text).cohort, null, text);
  }
});

test('other file labels are read the same way', () => {
  for (const [text, paper, label] of [
    ['Surg Lab Final 85', 'final', [85]],
    ['Poultry Final 86 study compilation', 'final', [86]],
  ]) {
    assert.deepEqual(read(text), { cohort: null, paper, year: null }, text);
    assert.deepEqual(compiledForCohorts(text), label, text);
  }
  assert.deepEqual(compiledForCohorts('DC3final 86'), [86]);
  assert.deepEqual(compiledForCohorts('Vet Prac Rum Final 2025 (Vet 85)'), [], 'a year after a paper word is not a label');
  assert.equal(namesCohort('Milk Hygiene mid-term recall (Vet 86 compilation)'), true, 'a designator, here an author, is still a designator');
  assert.equal(namesCohort('ชีทรุ่นพี่ 86 (Milk hygiene mid TJ) p34 — Lect 4.1 Composition & quality of raw milk, pre-test ข้อ 1'), true);
});

test('years: Common Era, Buddhist Era converted, a processing stamp ignored, two years unknown', () => {
  assert.deepEqual(read('Vet Prac Rum Final 2025 (Vet 85)'), { cohort: 85, paper: 'final', year: 2025 });
  assert.deepEqual(read('Vet Prac Rum 2023 (Vet 83)'), { cohort: 83, paper: null, year: 2023 });
  assert.deepEqual(read('Biochemistry I 3102113 · Lab Midterm 2022'), { cohort: null, paper: 'midterm', year: 2022 });
  assert.deepEqual(read('Veterinary Developmental Anatomy Final (3101102), 25/5/65'), { cohort: null, paper: 'final', year: 2022 });
  assert.deepEqual(read('VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)'), { cohort: null, paper: null, year: 2026 });
  // 2026-05-12 is when the page was extracted, not when the paper sat.
  assert.deepEqual(read('OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)'), { cohort: null, paper: 'osce', year: null });
  // An OSCE prep sheet names two kinds of paper; neither is chosen.
  assert.deepEqual(read('OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc'), { cohort: null, paper: null, year: 2025 });
  assert.deepEqual(read('Swine clinical practice past paper · year unknown · SAQ #1'), { cohort: null, paper: null, year: null });
});

test('in a source, a cohort counts only where its own clause records a sitting', () => {
  assert.equal(fromSource('Zoonosis Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)').cohort, 85);
  assert.equal(fromSource('Swine Med Mid 86.pdf หน้า 2 (บันทึกหลังสอบของรุ่นพี่ Vet 85)').cohort, 85);
  assert.equal(fromSource('Kimchii85 Poultry Final Vet 83 — Aj. Somsak MCQ#4 (page 3)').cohort, 83);
  for (const text of [
    'Aqua Med Mid 86 (รวบรวมโดยรุ่นพี่ Vet 85)',
    'EQUINE MED MID 86.pdf (ฉบับ 44 หน้า) หน้า 10 (รวบรวมโดยรุ่นพี่ Vet 85)',
    'ชีทรุ่นพี่ 86 (Milk hygiene mid TJ) p34 — Lect 4.1 Composition & quality of raw milk, pre-test ข้อ 1',
    'POULTRY FINAL 86.pdf, jubing vet86 — Aj. Niwat drug page',
    'Clin approach final TJ p1 #1 (Vet 86 reorganized)',
    'TJ p3 (Vet 85 #2)',
  ]) assert.equal(fromSource(text).cohort, null, text);
});

test('empty and odd input is unknown, and only two fields can be read', () => {
  for (const value of [undefined, null, '', '   ', 85, {}]) {
    assert.deepEqual(read(value), { cohort: null, paper: null, year: null });
  }
  // `verified` cites the cohort's own lecture recordings ("VET86 8ekNMuG25gI [5:24]").
  assert.throws(() => parseProvenance('VET86 8ekNMuG25gI [5:24]', { field: 'verified' }), /unknown field/);
});

test('Thai spelled with a decomposed sara am still reads', () => {
  const decomposed = 'จุดที่รุ่นพี่ Vet 85 ท\u0E4D\u0E32เครื่องหมายว่าข้อสอบใช้ชื่อโรคในสรุปสรุป';
  assert.equal(read(decomposed).cohort, null);
});

// The hand-filed map is a person's reading of the same strings. The parser
// may say less than the filing (it leaves "Final 86" labels and compilation
// authors unattributed), but where it names a cohort it must name the one
// the filing names, or the statistics would carry a cohort nobody filed.
test('wherever the parser names a cohort, EXAM_ORIGINS files that same cohort as a paper', () => {
  const conflicts = [];
  for (const [text, entry] of Object.entries(EXAM_ORIGINS)) {
    const parsed = read(text);
    if (parsed.cohort == null) continue;
    const filed = entry.kind === 'paper' ? cohortList(entry.cohort) : [];
    if (JSON.stringify(cohortList(parsed.cohort)) !== JSON.stringify(filed)) {
      conflicts.push(`${text}: parsed ${JSON.stringify(parsed.cohort)}, filed ${entry.kind} ${JSON.stringify(entry.cohort ?? null)}`);
    }
  }
  assert.deepEqual(conflicts, []);
});

test('the paper the parser reads agrees with every paper EXAM_ORIGINS files', () => {
  const conflicts = [];
  for (const [text, entry] of Object.entries(EXAM_ORIGINS)) {
    if (entry.kind !== 'paper' || !entry.paper) continue;
    const { paper } = read(text);
    if (paper !== entry.paper) conflicts.push(`${text}: parsed ${paper}, filed ${entry.paper}`);
  }
  assert.deepEqual(conflicts, []);
});
