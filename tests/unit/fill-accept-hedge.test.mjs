// Fill-in grading: accepted alternatives, one answer per blank, and "filled in full".
//
// Measured on the 27 fill-in items (audit of 25 Nov 2026):
//   - a right answer in another standard form was marked wrong, because an item had one string
//     per blank and nothing else: "Act" for PDCA's Action, "STT" for the Schirmer tear test,
//     "tomcat catheter", "C. psittaci", "2/1" for 2:1;
//   - "Piperazine หรือ Levamisole" was marked right: the answer held the key as a whole word, so a
//     student could name every candidate in one blank;
//   - one blank typed of three counted as answered on the exam map and in the submit dialog.
// The score stays all or nothing; the per-blank report is for display.
import test from 'node:test';
import assert from 'node:assert/strict';

import * as utils from '../../src/hooks/utils.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { fillStemParts, fillHead, fillStemNumbered, fillKeyLine, fillOrderNote } from '../../src/lib/fill-stem.js';

const { isCorrect, isAnswered, timeForQuestion } = utils;
const fill = (q, blanks, extra = {}) => ({ type: 'fill', q, blanks, ...extra });

const BANK = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) if (q.type === 'fill') BANK.push(q);
const item = (subject, id) => {
  const q = BANK.find((x) => x.subject === subject && x.id === id);
  assert.ok(q, `fill item ${subject} ${id} is in the bank`);
  return q;
};
// The item's own key, with one blank replaced by what a student typed.
const typed = (q, i, text) => q.blanks.map((b, k) => (k === i ? text : b));

test('a standard form of the key that the item accepts is right', () => {
  const cases = [
    ['poultry', 4013, 3, 'Act'], ['poultry', 4013, 3, 'act'],
    ['surg2', 204, 0, 'STT'], ['surg2', 204, 0, 'Schirmer test'], ['surg2', 204, 0, "Schirmer's tear test"],
    ['repro', 66, 0, 'tomcat catheter'], ['repro', 66, 0, 'Tom-cat catheter'],
    ['poultry', 2200, 0, 'C. psittaci'], ['poultry', 2200, 0, 'c.psittaci'],
    ['poultry', 4036, 0, '2/1'], ['poultry', 4036, 1, '10/1'],
    ['surg3', 32, 0, 'cranial'], ['surg3', 32, 0, 'ด้าน cranial'],
    ['practrum', 2210, 0, 'TRP'], ['practrum', 2211, 1, 'Co1'],
    ['repro-lect', 2230, 2, 'tumour'],
    ['poultry', 4031, 0, 'Met'], ['poultry', 4031, 1, 'Lys'], ['poultry', 4031, 2, 'Thr'], ['poultry', 4032, 0, 'Lys'],
  ];
  for (const [subject, id, i, text] of cases) {
    const q = item(subject, id);
    assert.equal(isCorrect(q, typed(q, i, text)), true, `${subject} ${id} blank ${i + 1}: ${text}`);
  }
});

test('an accept entry belongs to its own blank and is matched by the rules of the key, never loosely', () => {
  const pdca = item('poultry', 4013);
  assert.equal(isCorrect(pdca, ['Act', 'Do', 'Check', 'Action']), false, 'Act is accepted for the fourth blank only');
  assert.equal(isCorrect(pdca, ['Plan', 'Do', 'Check', 'Ac']), false, 'two letters are not Act');
  assert.equal(isCorrect(pdca, ['Plan', 'Do', 'Check', 'Acting']), false, 'Act inside a longer word');
  assert.equal(isCorrect(pdca, ['Plan', 'Do', 'Check', 'React']), false);
  const ratio = item('poultry', 4036);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '12/1')), false, '12/1 is not 2/1');
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/10')), false, '2/10 is not 2/1');
  // One letter apart and a different acid: alternatives are written by hand, nothing is guessed.
  assert.equal(isCorrect(fill('EFA คือ ____ acid', ['Linoleic']), ['linolenic']), false);
  assert.equal(isCorrect(fill('คือ ____', ['Action'], { accept: { 0: ['Act'] } }), ['Axt']), false);
  // A malformed accept is no accept.
  for (const accept of [null, 'Act', ['Act'], { 0: 'Act' }, { 0: [''] }, { 0: [null, 7] }]) {
    const q = fill('คือ ____', ['Action'], { accept });
    assert.equal(isCorrect(q, ['Action']), true);
    assert.equal(isCorrect(q, ['Act']), false, `accept ${JSON.stringify(accept)}`);
  }
});

test('an accepted alternative works in a group answered in any order', () => {
  const q = fill('Disease = ____ × ____ × ____', ['Virulence', 'Frequency', 'Dose'], { unordered: true, accept: { 2: ['dosage'] } });
  assert.equal(isCorrect(q, ['dosage', 'virulence', 'frequency']), true);
  assert.equal(isCorrect(q, ['dosage', 'dose', 'frequency']), false, 'one key cannot be used twice');
});

test('a blank that names two answers is wrong, in either order and with any joiner', () => {
  const q = item('poultry', 4011);
  for (const text of ['Piperazine หรือ Levamisole', 'Levamisole หรือ Piperazine', 'Piperazineหรือ Levamisole', 'piperazine or levamisole',
    'Levamisole or Piperazine', 'Piperazine / Levamisole', 'Piperazine/Levamisole', 'Piperazine, Levamisole หรือ Ivermectin']) {
    assert.equal(isCorrect(q, [text]), false, text);
  }
  const two = item('surg3', 40);
  assert.equal(isCorrect(two, ['greater trochanter or lesser trochanter', 'lateral condyle']), false);
});

test('a comma is not a joiner, and an accepted form that holds a joiner is one answer', () => {
  // A comma opens an explanation as often as a list, and nothing tells the two apart.
  const stt = item('surg2', 204);
  assert.equal(isCorrect(stt, typed(stt, 0, 'Schirmer tear test, the standard test for tear production')), true);
  // "2/1" is the item's own accepted form of 2:1. It does not let a second ratio through.
  const ratio = item('poultry', 4036);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 or 8/1')), false);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 หรือ 12/1')), false);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 / 2:1')), true, 'two forms of the same answer');
  // Each alternative by its own key's rule: a ratio by the number rule.
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 or 2:1.5')), false);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 หรือ 2:1 ถึง 3:1')), false);
  // A form set aside whole is still read for "not" before it.
  assert.equal(isCorrect(fill('คือ ____', ['T3/T4']), ['not T3/T4 or T3/T4']), false);
  assert.equal(isCorrect(fill('คือ ____', ['T3/T4']), ['T3/T4 หรือ T3/T4']), true);
});

test('every alternative is read whole and by its own rule: a number, "not", a decimal, a plural, a bracketed or', () => {
  // A number blank takes one number in every alternative, and a number the stem prints is no way out.
  const dose = item('practrum', 2211);
  assert.equal(isCorrect(dose, typed(dose, 2, '1 ml หรือ 100 ml')), false);
  assert.equal(isCorrect(dose, typed(dose, 2, '1 ml/100 kg หรือ 1 ml ต่อ 100 kg')), true);
  const n = fill('ให้ยา ____ mg', ['15']);
  assert.equal(isCorrect(n, ['15 mg หรือ 15mg']), true);
  assert.equal(isCorrect(n, ['15 หรือ 20']), false);
  assert.equal(isCorrect(n, ['หรือ']), false);
  assert.equal(isCorrect(fill('ช่วง ____', ['80-100']), ['80–100 หรือ 80 ถึง 100']), true);
  assert.equal(isCorrect(fill('นับได้ ____ cells', ['2500000']), ['2,500,000 cells']), true);
  // A separator only in a whole thousands group: a decimal followed by commas is not the key.
  assert.equal(isCorrect(fill('ค่า ____', ['1.25']), ['1.2,500,000']), false);
  assert.equal(isCorrect(fill('ค่า ____', ['1500.5']), ['1,500.5']), true);
  assert.equal(isCorrect(fill('นับได้ ____ cells', ['1000']), ['1,000, based on the cell count']), true);
  // Words beside the number are not a second answer.
  assert.equal(isCorrect(dose, typed(dose, 2, '1 ml per 100 kg (body mass or live weight)')), true);
  const oddsRatio = fill('ค่า OR = ____', ['2.5']);
  for (const text of ['OR = 2.5', 'odds ratio (OR) 2.5', 'odds ratio OR = 2.5']) assert.equal(isCorrect(oddsRatio, [text]), true, text);
  // "not" before a number, before an alternative, or before a second form in one alternative.
  for (const text of ['ไม่ใช่ 15', 'not 15', '15 mg or not (15 mg)', '15 mg or not [15 mg]', '15 mg หรือ ไม่ใช่:15 mg']) {
    assert.equal(isCorrect(n, [text]), false, text);
  }
  const ratio = item('poultry', 4036);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1 or not 2:1')), false);
  assert.equal(isCorrect(ratio, typed(ratio, 0, '2/1หรือไม่ใช่2:1')), false);
  assert.equal(isCorrect(fill('คือ ____', ['T3/T4']), ['T3/T4 not T3/T4 or T3/T4']), false);
  // A decimal goes on: 2/1.5, 1.2/1 and .2/1 are not 2/1.
  for (const text of ['2/1.5', '1.2/1', '.2/1', '2/1.5 or 2/1', '1.2/1 หรือ 2/1']) {
    assert.equal(isCorrect(ratio, typed(ratio, 0, text)), false, text);
  }
  // A plural is the same answer, also in a form set aside whole.
  assert.equal(isCorrect(fill('คือ ____', ['Na/K pump']), ['Na/K pump or Na/K pumps']), true);
  // "or" after a bracket or a slash still joins two answers; "(OR)" alone is an abbreviation.
  const drug = item('poultry', 4011);
  for (const text of ['Piperazine (or Levamisole)', 'Piperazine (หรือ Levamisole)', 'Piperazine and/or Levamisole',
    'Piperazine citrate / Levamisole', 'Piperazine citrate // Levamisole']) {
    assert.equal(isCorrect(drug, [text]), false, text);
  }
  assert.equal(isCorrect(ratio, typed(ratio, 0, '(2/1) / 8/1')), false);
  assert.equal(isCorrect(fill('คือ ____', ['odds ratio']), ['Odds ratio (OR)']), true);
  // After a dash, OR is the abbreviation, not a joiner.
  assert.equal(isCorrect(fill('คือ ____', ['odds ratio']), ['Odds ratio—OR measures association']), true);
  // A slash joins two answers with the key on one side and no unit on the other, however short that side,
  // and between two plain words outside brackets; a slash in a unit, ratio or code beside the key does not.
  for (const [key, text] of [['IgG', 'IgG/IgM'], ['IgG', 'IgG/M'], ['IgG', 'IgGs/IgMs'], ['H5', 'H5/H7'], ['T3', 'T3/T4'],
    ['K', 'K/Na'], ['Na', 'K/Na'], ['ไข้หวัดนก', 'ND/ไข้หวัดนก'], ['ตับ', 'ไต/ตับ'], ['ตับ', 'เนื้อตับ/ไต'], ['ตับ', 'ไต/เนื้อตับ']]) {
    assert.equal(isCorrect(fill('คือ ____', [key]), [text]), false, text);
  }
  for (const [key, text] of [['Ketamine', 'Ketamine 10 mg/kg/day'], ['thyroid hormone', 'thyroid hormone (T3/T4)'],
    ['BID', 'BID (2 ครั้ง/วัน)'], ['Schirmer tear test', 'Schirmer tear test (mm/min)'], ['tachypnea', 'tachypnea 60 breaths/min'],
    ['sodium-potassium pump', 'sodium-potassium pump (Na+/K+ ATPase)'], ['Schirmer tear test', 'Schirmer tear test (millimeters/minute)'],
    ['ตรวจนับเกล็ดเลือด', 'ตรวจนับเกล็ดเลือด (เกล็ดเลือด/ไมโครลิตร)'], ['CFU', 'CFU/mL (colony-forming units per milliliter)'],
    ['Ketamine', 'Ketamine/kg'], ['Clavamox', 'Clavamox (amoxicillin/clavulanate)']]) {
    assert.equal(isCorrect(fill('คือ ____', [key]), [text]), true, text);
  }
  // A blank holds a short answer: text far past the field's 200 characters is not graded as one.
  assert.equal(isCorrect(fill('คือ ____', ['Ketamine']), [`Ketamine ${'a'.repeat(40000)}`]), false);
});

test('one answer written with more words, or two forms of the same answer, is still right', () => {
  const q = item('poultry', 4011);
  for (const text of ['Piperazine', 'piperazine citrate', 'ยา Piperazine', 'Piperazine (GABA agonist)', 'piperazin', 'Piperazine,', 'Piperazine /']) {
    assert.equal(isCorrect(q, [text]), true, text);
  }
  const pdca = item('poultry', 4013);
  assert.equal(isCorrect(pdca, typed(pdca, 3, 'Act / Action')), true, 'both are right answers for the blank');
  assert.equal(isCorrect(pdca, typed(pdca, 3, 'Action หรือ Act')), true);
  assert.equal(isCorrect(pdca, typed(pdca, 3, 'Act หรือ Adjust')), false);
  // "or" is a joiner only as a word of its own.
  assert.equal(isCorrect(fill('คือ ____', ['anterior horn']), ['the anterior horn']), true);
  assert.equal(isCorrect(fill('คือ ____', ['sensor']), ['sensor organ']), true);
  // A key that holds a joiner of its own is matched as written.
  assert.equal(isCorrect(fill('คือ ____', ['Na/K pump']), ['the Na/K pump']), true);
  assert.equal(isCorrect(fill('คือ ____', ['กินหรือดื่ม']), ['กินหรือดื่ม']), true);
  // Numbers keep their own rule: units and ranges are not a second answer.
  const dose = item('practrum', 2211);
  assert.equal(isCorrect(dose, typed(dose, 2, '1 ml/100 kg')), true);
});

test('every fill item in the bank passes its own key and each of its accept entries', () => {
  assert.equal(BANK.length >= 27, true, `fill items: ${BANK.length}`);
  let accepts = 0;
  for (const q of BANK) {
    assert.equal(isCorrect(q, q.blanks.map(String)), true, `${q.subject} ${q.id}: its own key`);
    if (q.accept === undefined) continue;
    assert.equal(typeof q.accept === 'object' && !Array.isArray(q.accept) && q.accept !== null, true, `${q.subject} ${q.id}: accept is a map by blank index`);
    for (const [index, list] of Object.entries(q.accept)) {
      const i = Number(index);
      assert.ok(Number.isInteger(i) && i >= 0 && i < q.blanks.length, `${q.subject} ${q.id}: accept index ${index} is a blank`);
      assert.ok(Array.isArray(list) && list.length > 0, `${q.subject} ${q.id}: accept ${index} is a list`);
      for (const text of list) {
        accepts += 1;
        assert.equal(typeof text === 'string' && text.trim() === text && text.length > 0, true, `${q.subject} ${q.id}: accept entry ${JSON.stringify(text)}`);
        assert.equal(isCorrect(q, typed(q, i, text)), true, `${q.subject} ${q.id} blank ${i + 1}: accept entry ${text}`);
        assert.equal(isCorrect({ ...q, accept: undefined }, typed(q, i, text)), false, `${q.subject} ${q.id} blank ${i + 1}: ${text} already passes without the entry, so the entry is noise`);
      }
    }
  }
  assert.ok(accepts >= 10, `accept entries checked: ${accepts}`);
});

test('fillFilled is true only when every blank holds text; isAnswered keeps its own rule', () => {
  const { fillFilled, fillFilledCount } = utils;
  assert.equal(typeof fillFilled, 'function', 'utils exports fillFilled');
  const q = fill('a ____ b ____ c ____', ['x', 'y', 'z']);
  assert.equal(fillFilled(q, ['x', '', '']), false);
  assert.equal(isAnswered(['x', '', '']), true, 'one blank typed is still an answer for results and the redo set');
  assert.equal(fillFilled(q, ['x', 'y']), false, 'a short array has an empty blank');
  assert.equal(fillFilled(q, ['x', '  ', 'z']), false, 'spaces are not text');
  assert.equal(fillFilled(q, ['x', 'y', 'z']), true);
  assert.equal(fillFilled(q, undefined), false);
  assert.equal(fillFilled(q, {}), false);
  assert.equal(fillFilledCount(q, ['x', '', 'z']), 2);
  // Every other type follows isAnswered.
  assert.equal(fillFilled({ type: 'mcq', options: ['a', 'b'], answer: 0 }, 0), true);
  assert.equal(fillFilled({ type: 'mcq', options: ['a', 'b'], answer: 0 }, undefined), false);
  assert.equal(fillFilled({ type: 'tf', answer: false }, false), true);
  assert.equal(fillFilled({ type: 'short' }, ' '), false);
  assert.equal(fillFilled({ type: 'match', pairs: [] }, {}), false);
});

test('the per-blank report names the key under a wrong blank and marks an accepted alternative', () => {
  const { fillBlankReport } = utils;
  assert.equal(typeof fillBlankReport, 'function', 'utils exports fillBlankReport');
  const pdca = item('poultry', 4013);
  assert.deepEqual(fillBlankReport(pdca, ['Plan', 'Go', 'Check', 'Act']), [
    { ok: true, key: 'Plan', alt: false }, { ok: false, key: 'Do', alt: false },
    { ok: true, key: 'Check', alt: false }, { ok: true, key: 'Action', alt: true },
  ]);
  // Any order: each right blank shows the key it took, each wrong one a key nobody took.
  const q = fill('Disease = ____ × ____ × ____', ['Virulence', 'Frequency', 'Dose'], { unordered: true });
  assert.deepEqual(fillBlankReport(q, ['dose', 'host', 'virulence']).map((b) => [b.ok, b.key]), [[true, 'Dose'], [false, 'Frequency'], [true, 'Virulence']]);
  const report = fillBlankReport(q, ['x', 'y', 'z']);
  assert.deepEqual(report.map((b) => b.key).sort(), ['Dose', 'Frequency', 'Virulence'], 'each key printed once');
  // The report never disagrees with the score.
  for (const item27 of BANK) {
    assert.equal(fillBlankReport(item27, item27.blanks).every((b) => b.ok), true, `${item27.subject} ${item27.id}`);
    const wrong = item27.blanks.map(() => 'zzzz');
    assert.equal(fillBlankReport(item27, wrong).some((b) => b.ok), false);
    assert.equal(isCorrect(item27, wrong), false);
  }
});

test('a fill item gets 15 seconds for each blank after the first, as matching does per pair', () => {
  assert.equal(timeForQuestion(fill('____', ['a']), 60), 60);
  assert.equal(timeForQuestion(fill('____ ____', ['a', 'b']), 60), 75);
  assert.equal(timeForQuestion(fill('____ ____ ____ ____ ____', ['a', 'b', 'c', 'd', 'e']), 60), 120);
  assert.equal(timeForQuestion(fill('____ ____', ['a', 'b']), 0), 0, 'no timer stays no timer');
});

test('every fill stem in the bank cuts at its gaps, and each gap of a several-blank item has words to head its field', () => {
  const bare = [];
  for (const q of BANK) {
    const parts = fillStemParts(q.q, q.blanks.length);
    assert.ok(parts, `${q.subject} ${q.id}: gap count is its blank count`);
    assert.equal(parts.texts.length, q.blanks.length + 1);
    assert.equal(parts.texts.join('____').replace(/_+/g, '_'), q.q.replace(/_+/g, '_'), 'the stem is whole');
    if (q.blanks.length < 2) continue;
    for (const [i, head] of parts.heads.entries()) {
      const h = fillHead(head);
      assert.ok(h.text.length <= 34, `${q.subject} ${q.id} gap ${i + 1}: head "${h.text}"`);
      assert.doesNotMatch(h.text, /_{3,}|\n/);
      // A gap between two bare commas has no words of its own: its field is headed by its number.
      if (!h.text) { assert.equal(h.side, 'none'); bare.push(`${q.id}:${i + 1}`); }
    }
  }
  assert.deepEqual(bare, ['4031:2'], 'gaps with no words beside them');
  assert.equal(fillStemParts('no gap here', 1), null);
  assert.equal(fillStemParts('one ____ gap', 2), null, 'a stem whose gaps are not its blanks is left as written');
  const parts = fillStemParts('Broiler = ____ และ Layer = ____ (ตอบในรูป x:1)', 2);
  assert.deepEqual(parts.heads.map((h) => fillHead(h).label), ['Broiler = …', 'Layer = …'], 'a lone bracket after the last gap is an instruction, not a name');
  assert.deepEqual(fillHead(fillStemParts('____ ใช้ทับ ____', 2).heads[0]), { text: 'ใช้ทับ', label: '… ใช้ทับ', side: 'after', said: 'ก่อน ใช้ทับ' });
  // A bracket after every gap describes its gap; a list number alone does not name one.
  const levels = fillStemParts('ได้แก่ ____ (ตำแหน่งฟาร์ม), ____ (อาคาร), และ ____ (SOP)', 3);
  assert.deepEqual(levels.heads.map((h) => fillHead(h).label), ['… (ตำแหน่งฟาร์ม)', '… (อาคาร)', '… (SOP)']);
  const list = fillStemParts('แบ่งเป็น:\n1) ___ Biosecurity = แผนผัง\n2) ___ Biosecurity = อุปกรณ์', 2);
  assert.deepEqual(list.heads.map((h) => fillHead(h).label), ['1) … Biosecurity = แผนผัง', '2) … Biosecurity = อุปกรณ์']);
});

test('the printed key numbers its blanks and says when the order is free', () => {
  assert.equal(fillKeyLine(fill('____', ['Piperazine'])), 'Piperazine');
  assert.equal(fillKeyLine(fill('____ ____', ['2:1', '10:1'])), '(1) 2:1 (2) 10:1');
  assert.equal(fillKeyLine(fill('____ ____ ____', ['Virulence', 'Frequency', 'Dose'], { unordered: true })), '(1) Virulence (2) Frequency (3) Dose ลำดับใดก็ได้');
  assert.equal(fillOrderNote(fill('a b c d e', ['a', 'b', 'c', 'd', 'e'], { unordered: [[0, 1, 2, 3]] })), 'ช่อง 1, 2, 3, 4 ลำดับใดก็ได้');
  assert.equal(fillOrderNote(fill('____ ____', ['a', 'b'])), '');
  assert.equal(fillStemNumbered('a ____ b ____', 2, (n) => `(${n})`), 'a (1) b (2)');
  assert.equal(fillStemNumbered('a ____ b', 2), 'a ____ b');
});
