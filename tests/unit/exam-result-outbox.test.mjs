import test from 'node:test';
import assert from 'node:assert/strict';
import { createExamResultOutbox } from '../../src/lib/exam-result-outbox.js';

test('a failed send remains pending and a retry acknowledges only a confirmed record', async () => {
  let pending = [{ id: 'run', user_id: 'a' }], offline = true, calls = 0;
  const box = createExamResultOutbox({
    snapshot: () => ({ userId: 'a', pending }),
    send: async () => { calls++; if (offline) throw new Error('offline'); },
    acknowledge: (_owner, id) => { pending = pending.filter(row => row.id !== id); return { accepted: true }; },
  });
  await box.flush(); assert.equal(pending.length, 1);
  offline = false; await box.flush();
  assert.equal(pending.length, 0); assert.equal(calls, 2);
});

test('a result with no owner stays on the device, is not sent, and the notice says so', async () => {
  let pending = [
    { id: 'other', user_id: 'b' },
    { id: 'nobody' },
    { id: 'mine', user_id: 'a' },
  ];
  const sent = [], notices = [];
  const box = createExamResultOutbox({
    snapshot: () => ({ userId: 'a', pending }),
    send: async (record) => { sent.push(record.id); },
    acknowledge: (_owner, id) => { pending = pending.filter(row => row.id !== id); return { accepted: true }; },
    notify: (_owner, state) => notices.push(state),
  });
  await box.flush();
  assert.deepEqual(sent, ['mine']);
  assert.deepEqual(pending.map(row => row.id), ['other', 'nobody']);
  const last = notices.at(-1);
  assert.equal(last.sending, false);
  assert.match(last.error, /ผลสอบ 1 ชุดไม่รู้ว่าเป็นของบัญชีไหน/);
  assert.ok(!last.error.includes('·'));
});

test('an account change during a send cannot acknowledge another account queue', async () => {
  let owner = 'a', resolve;
  const pending = [{ id: 'run', user_id: 'a' }], acknowledgements = [];
  const box = createExamResultOutbox({
    snapshot: () => ({ userId: owner, pending }),
    send: () => new Promise(done => { resolve = done; }),
    acknowledge: (...args) => acknowledgements.push(args),
  });
  const task = box.flush(); owner = 'b'; resolve(); await task;
  assert.equal(acknowledgements.length, 0);
});
