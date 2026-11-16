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
import { encodeQuizSet, decodeQuizSet, buildShareUrl, buildShortShareUrl, decodeShareCode, readShareUrlFromLocation, shareableQuestions, isShareableQuestion } from '../../src/lib/share-link.js';
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

test('the short link leaves custom questions out, and a custom-only set makes no link', () => {
  const url = buildShortShareUrl([bank(1), custom(MIN + 1), bank(2)], 'https://vetmock.com');
  assert.match(url, /^https:\/\/vetmock\.com\/s\/[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeShareCode(url.split('/s/')[1]), [{ subject: 'one-health', id: 1 }, { subject: 'one-health', id: 2 }]);
  assert.equal(buildShortShareUrl([custom(MIN), custom(MAX)], 'https://vetmock.com'), null);
});

// 5.282.0: the results screen's one share entry makes this link.
test('a /s/ link round-trips the set, ids and order, and carries nothing else', () => {
  const set = Array.from({ length: 10 }, (_, i) => ({ subject: 'epidemiology', id: 107019 - i, q: 'stem', answer: 0 }));
  const url = buildShortShareUrl(set, 'https://vetmock.com');
  assert.ok(url.length <= 60, `short: ${url.length} characters`);
  const code = url.slice('https://vetmock.com/s/'.length);
  assert.deepEqual(decodeShareCode(code), set.map(({ subject, id }) => ({ subject, id })));
  assert.equal(/[?&#]/.test(url), false, 'no score, time or name parameters');
  // What api/s.js sends a browser on to opens the same set in the app.
  const target = `?qset=${encodeQuizSet(set)}`;
  assert.deepEqual(readShareUrlFromLocation({ search: target }), decodeShareCode(code));
});

test('a set the short form cannot hold falls back to the old link, still without a score', () => {
  const url = buildShortShareUrl([{ subject: 'not-in-the-table', id: 5 }], 'https://vetmock.com');
  assert.equal(url, 'https://vetmock.com/?qset=' + encodeQuizSet([{ subject: 'not-in-the-table', id: 5 }]));
  assert.equal(/[&](sc|t|by)=/.test(url), false);
});

test('links sent before 5.282.0 still open, score, time and name included', () => {
  const old = buildShareUrl([bank(7), bank(9)], { senderScore: { correct: 1, total: 2 }, senderName: 'ฟ้า', senderTimeSec: 61 });
  const loc = new URL(old);
  assert.deepEqual(readShareUrlFromLocation(loc), [{ subject: 'one-health', id: 7 }, { subject: 'one-health', id: 9 }]);
  assert.deepEqual(readShareUrlFromLocation({ search: '' }), []);
  assert.deepEqual(readShareUrlFromLocation({ search: '?qset=%%%' }), []);
});

test('a link that opens nothing says so before Home', () => {
  const app = read('src/App.jsx');
  const resolver = app.slice(app.indexOf('const resolveSharedSet = async'), app.indexOf('resolveSharedSet();'));
  assert.equal((resolver.match(/alertDialog\('ลิงก์นี้ไม่มีข้อที่เปิดได้ในคลัง'\)/g) || []).length, 2,
    'both an undecodable set and a set that matches nothing in the bank say so');
});
