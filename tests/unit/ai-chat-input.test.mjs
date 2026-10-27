// ============================================================
// ai-chat input — the caps the chat page is built against
// ============================================================
// Every refusal here happens before anything is spent, and its sentence is
// what the student reads, so the contract is pinned: what is refused, what is
// trimmed instead, and that an image is judged by its bytes, not its label.

import test from 'node:test';
import assert from 'node:assert/strict';

import { validateChatInput, base64Bytes, INPUT_MESSAGES } from '../../api/_lib/ai/input.js';
import { MAX_MESSAGES, MAX_MESSAGE_CHARS, MAX_TOTAL_CHARS, MAX_IMAGE_BYTES } from '../../api/_lib/ai/config.js';

const PNG_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const JPEG_HEAD = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1]).toString('base64');
const WEBP_HEAD = Buffer.concat([Buffer.from('RIFF'), Buffer.from([26, 0, 0, 0]), Buffer.from('WEBPVP8 '), Buffer.alloc(8)]).toString('base64');
const user = (content) => ({ role: 'user', content });
const bot = (content) => ({ role: 'assistant', content });

test('a plain question passes and its text is the question', () => {
  const r = validateChatInput({ messages: [user('  สวัสดี  ')], image: null });
  assert.equal(r.ok, true);
  assert.equal(r.question, 'สวัสดี');
  assert.equal(r.image, null);
  assert.deepEqual(r.messages, [{ role: 'user', content: '  สวัสดี  ' }]);
});

test('malformed requests are refused with the Thai shape message', () => {
  for (const body of [null, 'x', [], { messages: 'hi' }, { messages: [{ role: 'system', content: 'x' }] },
    { messages: [{ role: 'user', content: 5 }] }, { messages: [user('a'), bot('b')] }]) {
    const r = validateChatInput(body);
    assert.equal(r.ok, false, JSON.stringify(body));
    assert.ok(/[฀-๿]/.test(r.message), 'the message is Thai');
  }
  assert.equal(validateChatInput({ messages: [] }).message, INPUT_MESSAGES.empty);
  assert.equal(validateChatInput({ messages: [user('   ')] }).message, INPUT_MESSAGES.empty);
});

test('the current turn over the cap is refused; the same length in history is clipped', () => {
  const long = 'ก'.repeat(MAX_MESSAGE_CHARS + 1);
  assert.equal(validateChatInput({ messages: [user(long)] }).message, INPUT_MESSAGES.tooLong);
  const r = validateChatInput({ messages: [user('a'), bot(long), user('ต่อ')] });
  assert.equal(r.ok, true);
  assert.equal(r.messages[1].content.length, MAX_MESSAGE_CHARS);
});

test('history is trimmed oldest first to the message and character budgets', () => {
  const many = [];
  for (let i = 0; i < 20; i++) many.push(i % 2 ? bot(`a${i}`) : user(`q${i}`));
  many.push(user('ล่าสุด'));
  const r = validateChatInput({ messages: many });
  assert.equal(r.ok, true);
  assert.ok(r.messages.length <= MAX_MESSAGES);
  assert.equal(r.messages.at(-1).content, 'ล่าสุด');
  assert.equal(r.messages[0].role, 'user', 'a conversation handed to a model starts with the student');

  const big = 'ข'.repeat(3900);
  const r2 = validateChatInput({ messages: [user(big), bot(big), user(big), bot(big), user(big), bot(big), user('คำถาม')] });
  assert.equal(r2.ok, true);
  assert.ok(r2.messages.reduce((n, m) => n + m.content.length, 0) <= MAX_TOTAL_CHARS);
  assert.equal(r2.messages.at(-1).content, 'คำถาม');
  assert.ok(r2.trimmed > 0);
});

test('control characters that hide text from a reader are removed', () => {
  const r = validateChatInput({ messages: [user('a\u0000b\u0007c\r\nd')] });
  assert.equal(r.messages[0].content, 'abc\nd');
});

test('images: type, bytes, size and label must all agree', () => {
  const ok = validateChatInput({ messages: [user('ภาพนี้คืออะไร')], image: { mediaType: 'image/png', data: PNG_1PX } });
  assert.equal(ok.ok, true);
  assert.equal(ok.image.mediaType, 'image/png');

  const viaDataUrl = validateChatInput({ messages: [user('x')], image: { mediaType: 'image/png', data: `data:image/png;base64,${PNG_1PX}` } });
  assert.equal(viaDataUrl.ok, true, 'a data URL prefix is accepted');

  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/jpeg', data: JPEG_HEAD } }).ok, true);
  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/webp', data: WEBP_HEAD } }).ok, true);

  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/gif', data: PNG_1PX } }).message, INPUT_MESSAGES.imageType);
  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/jpeg', data: PNG_1PX } }).message, INPUT_MESSAGES.imageBad, 'a PNG labelled JPEG');
  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/png', data: 'not base64!!' } }).message, INPUT_MESSAGES.imageBad);
  const huge = PNG_1PX.slice(0, 24) + 'A'.repeat(Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 8);
  assert.equal(validateChatInput({ messages: [user('x')], image: { mediaType: 'image/png', data: huge } }).message, INPUT_MESSAGES.imageSize);
  // An image alone is a turn.
  assert.equal(validateChatInput({ messages: [user('')], image: { mediaType: 'image/png', data: PNG_1PX } }).ok, true);
});

test('base64Bytes counts decoded bytes, padding included', () => {
  assert.equal(base64Bytes('QUJD'), 3);
  assert.equal(base64Bytes('QUI='), 2);
  assert.equal(base64Bytes('QQ=='), 1);
  assert.equal(base64Bytes(PNG_1PX), Buffer.from(PNG_1PX, 'base64').length);
});
