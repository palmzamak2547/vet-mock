// The deck step's fallbacks (scripts/video-pipeline.mjs): a recording and this year's deck of
// the same teaching day carry the same date, and a class timetable is never a deck. On 14 Nov
// the title match took a two-page timetable for two avian lectures and found no deck for six.
import test from 'node:test';
import assert from 'node:assert/strict';
import { titleDate, TIMETABLE } from '../../scripts/video-pipeline.mjs';

test('a recording and a deck of the same day read the same date', () => {
  assert.equal(titleDate('6.One health perspective on food and feed GMOs 4 Nov 69'), '4/11');
  assert.equal(titleDate('One Health perspective of food and feed GMOs (4 พ.ย. 69)'), '4/11');
  assert.equal(titleDate('One Health approach to address environmental health risks II_28 Oct 26'), '28/10');
  assert.equal(titleDate('บทบาทหน้าที่ ความรับผิดชอบ ของสัตวแพทย์ควบคุมฟาร์มสัตว์ปีก (CPF, 10 พ.ย. 69)'), '10/11');
  assert.equal(titleDate('Mycotoxicosis in poultry (27 ต.ค. 69)'), '27/10');
  assert.equal(titleDate('4.2 Mycotoxicosis(ต่อ) 2 Nov 69'), '2/11');
  assert.equal(titleDate('12.Equine reproductive surgery + 13,14 Equine pregnancy & Its complications 29 Oct 69'), '29/10');
  assert.equal(titleDate('Review 3 มี.ค. 69'), '3/3');
});

test('no date where a title carries none', () => {
  assert.equal(titleDate('Bacterial Zoonoses'), null);
  assert.equal(titleDate('PCV2 for swine med 2025'), null, 'a year is no date');
  assert.equal(titleDate('Duck RA DVE DVH DTMUV GP AI Yr5 2026'), null);
  assert.equal(titleDate('10 marked points and 2 decks'), null, 'words that only start like a month');
});

test('a class timetable is never a deck', () => {
  assert.ok(TIMETABLE.test('ตารางเรียนค่ะ'));
  assert.ok(TIMETABLE.test('Course schedule'));
  assert.ok(!TIMETABLE.test('Mycotoxicosis in poultry (27 ต.ค. 69)'));
});
