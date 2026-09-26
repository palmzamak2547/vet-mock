// ============================================================
// exam-result-outbox-refusal — one refused result cannot hold the queue
// ============================================================
// B12 (bug hunt 2026-09-26). The outbox sent pending results in order and
// stopped at the first failure. A result the server refuses for good (a
// retry after a question-bank edit comes back 409 result_conflict, or a 400
// for a malformed body) failed on every flush, so every result behind it
// stayed on the device and never reached the account or the leaderboard.
// A permanent refusal is now set aside for the session (the record itself is
// kept in the device queue, never dropped) and the next result is sent.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createExamResultOutbox } from '../../src/lib/exam-result-outbox.js';

function refusal(status) {
  const error = new Error('ชุดนี้ถูกส่งจากอีกแท็บด้วยคำตอบต่างกันแล้ว กรุณาสำรองผลชุดนี้');
  error.status = status;
  error.retryAfter = 0;
  return error;
}

function harness(sendImpl) {
  let pending = [
    { id: 'poisoned', user_id: 'a' },
    { id: 'next-exam', user_id: 'a' },
    { id: 'exam-after-that', user_id: 'a' },
  ];
  const sent = [];
  const notices = [];
  const box = createExamResultOutbox({
    snapshot: () => ({ userId: 'a', pending }),
    send: async (record) => { sent.push(record.id); return sendImpl(record); },
    acknowledge: (_owner, id) => { pending = pending.filter((row) => row.id !== id); return { accepted: true }; },
    notify: (_owner, next) => notices.push(next),
  });
  return { box, sent, notices, pending: () => pending };
}

test('a result the server refuses for good does not stop the results behind it', async () => {
  const h = harness(async (record) => { if (record.id === 'poisoned') throw refusal(409); });
  await h.box.flush();
  assert.deepEqual(h.pending().map((r) => r.id), ['poisoned'], 'the later results reached the account');
  assert.deepEqual(h.sent, ['poisoned', 'next-exam', 'exam-after-that']);
  const last = h.notices.at(-1);
  assert.equal(last.sending, false);
  assert.match(last.error, /1 ชุด/, 'the student is told how many results could not be sent');
  assert.doesNotMatch(last.error, /อีกแท็บ/, 'the message is about the held result, not a tab race');
});

test('the refused record stays on the device and is not re-sent every 30 seconds', async () => {
  const h = harness(async (record) => { if (record.id === 'poisoned') throw refusal(409); });
  await h.box.flush();
  await h.box.flush();
  await h.box.flush();
  assert.equal(h.sent.filter((id) => id === 'poisoned').length, 1, 'one attempt per session');
  assert.ok(h.pending().some((r) => r.id === 'poisoned'), 'never silently dropped');
});

test('a 400 for a malformed body is also set aside; a network failure still stops and retries', async () => {
  const bad = harness(async (record) => { if (record.id === 'poisoned') throw refusal(400); });
  await bad.box.flush();
  assert.deepEqual(bad.pending().map((r) => r.id), ['poisoned']);

  let offline = true;
  const net = harness(async () => { if (offline) { const e = new Error('offline'); e.retryAfter = 0; throw e; } });
  await net.box.flush();
  assert.equal(net.pending().length, 3, 'a transient failure keeps order and waits');
  assert.deepEqual(net.sent, ['poisoned']);
  offline = false;
  await net.box.flush();
  assert.equal(net.pending().length, 0, 'the transient failure is retried, not set aside');
});
