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

test('no Thai, or no entry, is left alone', () => {
  assert.equal(translateString('Rabies', dict), null);
  assert.equal(translateString('', dict), null);
  assert.equal(translateString('คำที่ไม่มีในพจนานุกรม', dict), null);
});

test('the dictionary itself: no Thai in an answer, every placeholder kept, no middle dot', () => {
  const thai = /[\u0E00-\u0E7F]/;
  const holes = (s) => (s.match(/\{(?:\d+|[a-h])\}/g) || []).sort().join(',');
  const problems = [];
  for (const [th, en] of Object.entries(UI_EN)) {
    const forms = typeof en === 'string' ? [en] : [en.one, en.other];
    for (const form of forms) {
      if (typeof form !== 'string') { problems.push(`${th}: not a string`); continue; }
      if (thai.test(form)) problems.push(`${th}: Thai in "${form}"`);
      if (form.includes('\u00B7')) problems.push(`${th}: middle dot in "${form}"`);
      if (typeof en === 'string' && holes(form) !== holes(th)) problems.push(`${th}: placeholders of "${form}"`);
    }
  }
  assert.deepEqual(problems, []);
  assert.ok(Object.keys(UI_EN).length > 4000, 'the interface has thousands of strings');
});
