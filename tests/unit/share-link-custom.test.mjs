// ============================================================
// share-link-custom.test.mjs — a question the student wrote cannot travel
// by link (OV-tools-38)
// ============================================================
// A share or challenge link encodes subject and id; a friend's app looks the
// ids up in the bank. Custom questions (ids in CUSTOM_QUESTION_ID_RANGE) live
// only in the author's own store, so a link made of them landed the friend on
// Home with no message. The sender now leaves them out and says so; the
// receiver says why a link opened nothing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { encodeQuizSet, decodeQuizSet, buildShareUrl, shareableQuestions, isShareableQuestion } from '../../src/lib/share-link.js';
import { CUSTOM_QUESTION_ID_RANGE } from '../../src/lib/custom-question-ids.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const [MIN, MAX] = CUSTOM_QUESTION_ID_RANGE;
const bank = (id) => ({ subject: 'one-health', id, q: 'x' });
const custom = (id) => ({ subject: 'one-health', id, q: 'x' });

test('a custom id is not shareable; a bank id is', () => {
  assert.equal(isShareableQuestion(bank(123)), true);
  assert.equal(isShareableQuestion(custom(MIN)), false);
  assert.equal(isShareableQuestion(custom(MAX)), false);
  assert.equal(isShareableQuestion(bank(MIN - 1)), true);
  assert.equal(isShareableQuestion(bank(MAX + 1)), true);
  assert.equal(isShareableQuestion({ subject: 'one-health', id: 'c-mare' }), false, 'a non-numeric id cannot round-trip');
  assert.equal(isShareableQuestion({ id: 5 }), false, 'no subject, no lookup');
  assert.deepEqual(shareableQuestions([bank(1), custom(MIN + 5), bank(2)]).map((q) => q.id), [1, 2]);
  assert.deepEqual(shareableQuestions(null), []);
});

test('the encoded set skips custom questions, and a custom-only set makes no link', () => {
  const mixed = encodeQuizSet([bank(1), custom(MIN + 1), bank(2)]);
  assert.deepEqual(decodeQuizSet(mixed), [{ subject: 'one-health', id: 1 }, { subject: 'one-health', id: 2 }]);
  assert.equal(encodeQuizSet([custom(MIN), custom(MAX)]), '');
  assert.equal(buildShareUrl([custom(MIN)]), null);
  assert.match(buildShareUrl([bank(7)]), /\?qset=/);
});

test('the results screen offers the link only for what can travel, and says why otherwise', () => {
  const results = read('src/views/ResultsView.jsx');
  assert.match(results, /const shareable = shareableQuestions\(questions\)/);
  assert.ok(results.includes('ข้อที่สร้างเองแชร์ผ่านลิงก์ไม่ได้'), 'the hint when nothing can be shared');
  const invite = results.slice(results.indexOf('<details className="vmx-invite">'), results.indexOf('</details>'));
  assert.match(invite, /shareable\.length > 0 \? \(/, 'the link buttons are drawn only when there is a link to make');
  assert.match(invite, /<ChallengeQuizButton questions=\{shareable\}/);
  assert.match(invite, /<SendToGroupButton questions=\{shareable\}/);
  const writing = results.slice(results.indexOf('if (autoQs.length === 0) {'), results.indexOf('const handleRedoWrong'));
  assert.match(writing, /<ShareQuizButton questions=\{shareable\} \/>/);
});

test('a link that opens nothing says so before Home', () => {
  const app = read('src/App.jsx');
  const resolver = app.slice(app.indexOf('const resolveSharedSet = async'), app.indexOf('resolveSharedSet();'));
  assert.equal((resolver.match(/alertDialog\('ลิงก์นี้ไม่มีข้อที่เปิดได้ในคลัง'\)/g) || []).length, 2,
    'both an undecodable set and a set that matches nothing in the bank say so');
});
