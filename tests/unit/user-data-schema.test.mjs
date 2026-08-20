import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeBackupFields,
  parseCustomQuestion,
  parseUserBackup,
} from '../../src/lib/user-data-schema.js';

test('custom question parser accepts every supported renderer contract', () => {
  const fixtures = [
    { type: 'mcq', q: 'เลือกข้อใด', subject: 'com5', options: ['ก', 'ข'], answer: 1 },
    { type: 'tf', q: 'ถูกหรือผิด', subject: 'com5', answer: true },
    { type: 'fill', q: 'เติมคำ', subject: 'com5', blanks: ['rabies'] },
    { type: 'match', q: 'จับคู่', subject: 'com5', pairs: [{ left: 'A', right: 'B' }] },
    { type: 'short', q: 'ตอบสั้น', subject: 'com5', keywords: ['one health'] },
    { type: 'essay', q: 'อธิบาย', subject: 'com5', model_answer: 'ตัวอย่าง' },
  ];
  for (const fixture of fixtures) assert.equal(parseCustomQuestion(fixture).success, true, fixture.type);
});

test('custom question parser rejects data that would break or misgrade a renderer', () => {
  assert.match(parseCustomQuestion({ type: 'mcq', q: 'x', subject: 'com5', options: ['ก'], answer: 4 }).reason, /อย่างน้อย 2/);
  assert.match(parseCustomQuestion({ type: 'mcq', q: 'x', subject: 'com5', options: ['ก', 'ข'], answer: 4 }).reason, /นอกจำนวนตัวเลือก/);
  assert.match(parseCustomQuestion({ type: 'match', q: 'x', subject: 'com5', pairs: [{ left: 'A' }] }).reason, /ด้านขวา/);
  assert.match(parseCustomQuestion({ type: 'unknown', q: 'x', subject: 'com5' }).reason, /ไม่รองรับ/);
});

test('backup parser preserves empty datasets and normalizes legacy SR defaults', () => {
  const parsed = parseUserBackup({
    version: '5.0',
    bookmarks: [],
    history: [{ questionId: 1, correct: false }],
    notes: {},
    srCards: { 1: { questionId: 1 } },
    streak: 0,
    customQuestions: [],
  });
  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.data.bookmarks, []);
  assert.equal(parsed.data.srCards['1'].easeFactor, 2.5);
  assert.equal(parsed.data.srCards['1'].totalReviews, 0);
  assert.ok(parsed.fields.includes('bookmarks'));
  assert.ok(describeBackupFields(parsed.data, parsed.fields).some((line) => line.includes('0 ข้อ')));
});

test('backup parser fails closed before malformed data can overwrite local state', () => {
  assert.equal(parseUserBackup([]).success, false);
  assert.match(parseUserBackup({ bookmarks: 'all' }).reason, /ข้อที่บันทึกไว้/);
  assert.match(parseUserBackup({ notes: { 1: { text: 'not a string' } } }).reason, /โน้ต/);
  assert.match(parseUserBackup({ srCards: { 1: 'bad' } }).reason, /การ์ดทบทวน/);
  assert.equal(parseUserBackup({ version: '5.1' }).success, false);
});
