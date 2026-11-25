// ============================================================
// ui-translate.test.mjs: how a Thai string on screen finds its English
// ============================================================
// The English interface is the Thai one looked up string by string
// (src/lib/ui-translate.js). These are the lookup rules; the page side, which
// React writes to, is walked in tests/e2e/ui-language.spec.js.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compileDictionary, translateString } from '../../src/lib/ui-translate.js';
import UI_EN from '../../src/data/ui-en.js';

const dict = compileDictionary({
  'ฝึกข้อสอบ': 'Practice',
  '{0} ข้อ': { one: '{0} question', other: '{0} questions' },
  '{0}/{1} วิชา': '{0} of {1} subjects',
  'สรุป {a}': '{a} summary',
  'โรคติดต่อระหว่างสัตว์และคน': 'Zoonoses',
  '{a} ข้อที่ยังไม่ได้ทำ': '{a} not done yet',
  'เหลือ {a} วัน': { one: '{a} day left', other: '{a} days left' },
});

test('an exact string, with the spaces around it kept', () => {
  assert.equal(translateString('ฝึกข้อสอบ', dict), 'Practice');
  assert.equal(translateString('  ฝึกข้อสอบ ', dict), '  Practice ');
  assert.equal(translateString('ฝึก   ข้อสอบ', dict), null, 'a space inside is part of the words');
});

test('numbers fill {0} and {1}, and a count picks one or other', () => {
  assert.equal(translateString('1 ข้อ', dict), '1 question');
  assert.equal(translateString('2,014 ข้อ', dict), '2,014 questions');
  assert.equal(translateString('2/13 วิชา', dict), '2 of 13 subjects');
});

test('{a} takes any text, and Thai inside it is looked up too', () => {
  assert.equal(translateString('สรุป โรคติดต่อระหว่างสัตว์และคน', dict), 'Zoonoses summary');
  assert.equal(translateString('สรุป Rabies', dict), 'Rabies summary');
  assert.equal(translateString('12 ข้อที่ยังไม่ได้ทำ', dict), '12 not done yet', 'a pattern that opens with {a}');
  assert.equal(translateString('เหลือ 1 วัน', dict), '1 day left');
  assert.equal(translateString('เหลือ 3 วัน', dict), '3 days left');
});

test('a joined list is read part by part; a part with no entry stays as written', () => {
  assert.equal(translateString('ฝึกข้อสอบ | VetMock', dict), 'Practice | VetMock');
  assert.equal(translateString('ฝึกข้อสอบ, โรคติดต่อระหว่างสัตว์และคน', dict), 'Practice, Zoonoses');
  assert.equal(translateString('ฝึกข้อสอบ, คำที่ไม่มีในพจนานุกรม', dict), 'Practice, คำที่ไม่มีในพจนานุกรม');
  assert.equal(translateString('Zoonoses — โรคติดต่อระหว่างสัตว์และคน', dict), 'Zoonoses', 'one name given twice reads once');
  // A pattern's capture can itself be such a list.
  assert.equal(translateString('สรุป ฝึกข้อสอบ, โรคติดต่อระหว่างสัตว์และคน', dict), 'Practice, Zoonoses summary');
  // A page title splits at its bar before a pattern can swallow the whole line.
  assert.equal(translateString('สรุป โรคติดต่อระหว่างสัตว์และคน | VetMock', dict), 'Zoonoses summary | VetMock');
  // Inside a list, a part a pattern only half reads does not count as found.
  assert.equal(translateString('สรุป คำที่ไม่มี, ฝึกข้อสอบ', dict), 'คำที่ไม่มี, Practice summary');
});

test('the most specific pattern wins, and two values written side by side read as one', () => {
  const d = compileDictionary({
    'ช': 'G', 'เปิด{a}{b}': 'Open {a}{b}', 'ชั้นผิวหนัง': 'the skin layer',
    'หมวด {a}': 'Category {a}', 'แสดง{a}': 'Show {a}', 'แสดงหมวด {a}': 'Show the {a} group', 'ผิวหนัง': 'Skin',
  });
  // Split at the first letter, "ชั้น" lost its "ช" to the option letter G.
  assert.equal(translateString('เปิดชั้นผิวหนัง', d), 'Open the skin layer');
  assert.equal(translateString('แสดงหมวด ผิวหนัง', d), 'Show the Skin group');
});

test('a Thai date reads as an English one, the Buddhist-era year as its Common Era year', () => {
  assert.equal(translateString('21 พ.ย. 2569', dict), '21 Nov 2026');
  assert.equal(translateString('สรุป 5 มี.ค.', dict), '5 Mar summary');
});

test('a weekday and a two-digit year read the English way, and a time drops its น.', () => {
  const d = compileDictionary({ 'ระบาดวิทยา': 'Veterinary Epidemiology', 'พรุ่งนี้': 'Tomorrow' });
  assert.equal(translateString('ศุกร์ 25 ก.ย.', d), 'Fri 25 Sep');
  assert.equal(translateString('23 พ.ย. - 4 ธ.ค. 69', d), '23 Nov - 4 Dec 2026');
  assert.equal(translateString('วันจันทร์ 10:00 น. ระบาดวิทยา', d), 'Mon 10:00 Veterinary Epidemiology');
  assert.equal(translateString('พรุ่งนี้ 10:00 น. ระบาดวิทยา', d), 'Tomorrow 10:00 Veterinary Epidemiology');
  // Two digits with Thai after them count something; they are not a year.
  assert.match(translateString('15 ธ.ค. 80 ข้อ', d) ?? '', /^15 Dec 80 /);
});

test('a label led by an emoji is read without it, unless the emoji is part of an entry', () => {
  const d = compileDictionary({ 'สัตว์น้ำ — Fish & Shrimp': 'Fish & Shrimp', '📋 มีเอกสาร': 'Documents attached' });
  assert.equal(translateString('🐟 สัตว์น้ำ — Fish & Shrimp', d), '🐟 Fish & Shrimp');
  assert.equal(translateString('📋 มีเอกสาร', d), 'Documents attached');
});

test('no Thai, or no entry, is left alone', () => {
  assert.equal(translateString('Rabies', dict), null);
  assert.equal(translateString('', dict), null);
  assert.equal(translateString('คำที่ไม่มีในพจนานุกรม', dict), null);
});

// A Thai word in quotation marks is named, not left untranslated: the contribution checks tell a writer
// which Thai word to use instead.
test('the dictionary itself: no Thai outside quotation marks, every placeholder kept, no middle dot', () => {
  const thai = /[\u0E00-\u0E7F]/;
  const holes = (s) => (s.match(/\{(?:\d+|[a-h])\}/g) || []).sort().join(',');
  const problems = [];
  for (const [th, en] of Object.entries(UI_EN)) {
    const forms = typeof en === 'string' ? [en] : [en.one, en.other];
    for (const form of forms) {
      if (typeof form !== 'string') { problems.push(`${th}: not a string`); continue; }
      if (thai.test(form.replace(/"[^"]*"/g, ''))) problems.push(`${th}: Thai in "${form}"`);
      if (form.includes('\u00B7')) problems.push(`${th}: middle dot in "${form}"`);
      if (typeof en === 'string' && holes(form) !== holes(th)) problems.push(`${th}: placeholders of "${form}"`);
    }
  }
  assert.deepEqual(problems, []);
  assert.ok(Object.keys(UI_EN).length > 4000, 'the interface has thousands of strings');
});
