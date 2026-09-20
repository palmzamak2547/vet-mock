import { test } from 'node:test';
import assert from 'node:assert/strict';
import { humanSource, humanSourceParts, sessionLabel } from '../../src/lib/source-label.js';

test('a recording becomes the session a student sat in', () => {
  // avian คาบแรก, 4 ส.ค.
  assert.equal(sessionLabel('7XyI0SjnuBA'), 'คาบ 1 (4 ส.ค.)');
  assert.equal(humanSource('7XyI0SjnuBA [12:34]'), 'คาบ 1 (4 ส.ค.) นาที 12:34');
  assert.equal(humanSource('VET86 7XyI0SjnuBA [6:15-7:09]'), 'คาบ 1 (4 ส.ค.) นาที 6:15-7:09');
  assert.equal(humanSource('7XyI0SjnuBA [5:24], [3:47-4:01]'), 'คาบ 1 (4 ส.ค.) นาที 5:24, 3:47-4:01');
});

test('one recording that carries two timetabled sessions names both', () => {
  // One Health 9 ก.ย. and 16 ก.ย. are the same video
  assert.equal(sessionLabel('xkJw4A0OS7A'), 'คาบ 5 และ 6 (9 ก.ย.)');
});

test('an id that is not a taught session is left exactly as written', () => {
  assert.equal(sessionLabel('ZZZZZZZZZZZ'), null);
  assert.equal(humanSource('ZZZZZZZZZZZ [1:00]'), 'ZZZZZZZZZZZ [1:00]');
});

test('decks, compilations and notes read as what they are', () => {
  assert.equal(humanSource('deck oh-vet-role.pdf p4, p7'), 'สไลด์ หน้า 4, 7');
  assert.equal(humanSource('deck oh-eid.pdf p12-13'), 'สไลด์ หน้า 12-13');
  assert.equal(humanSource('TJ p5, p6'), 'ชีทรุ่นพี่ หน้า 5, 6');
  assert.equal(humanSource('deck p9'), 'สไลด์ หน้า 9');
  assert.equal(humanSource('MID 86 audit p71'), 'บันทึกรุ่นพี่ หน้า 71');
  assert.equal(humanSource('audit p12'), 'บันทึกรุ่นพี่ หน้า 12');
  assert.equal(humanSource('TJ p5'), 'ชีทรุ่นพี่ หน้า 5');
});

test('a scanned page of a senior paper reads as a scan, not as a file path', () => {
  assert.equal(
    humanSource('images/7.jpg ข้อ 15 ลักษณะเชื้อ Mycoplasma'),
    'ภาพสแกนข้อสอบเก่า ข้อ 15 ลักษณะเชื้อ Mycoplasma',
  );
});

test('a past-paper pointer is already readable and is not touched', () => {
  assert.equal(humanSource('ข้อสอบเก่า 203013'), 'ข้อสอบเก่า 203013');
  assert.equal(humanSource('TJ p5, ข้อสอบเก่า 202275'), 'ชีทรุ่นพี่ หน้า 5, ข้อสอบเก่า 202275');
});

test('empty and rubbish input do not throw', () => {
  assert.equal(humanSource(''), '');
  assert.equal(humanSource(null), '');
  assert.equal(humanSource(undefined), '');
  assert.equal(humanSource('   '), '');
});

test('a compound citation splits into readable pieces', () => {
  assert.deepEqual(
    humanSourceParts('7XyI0SjnuBA [8:15-8:42]; deck oh-vet-role.pdf p4'),
    ['คาบ 1 (4 ส.ค.) นาที 8:15-8:42', 'สไลด์ หน้า 4'],
  );
});
