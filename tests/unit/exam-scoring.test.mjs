import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { scoreSubmission } from '../../api/_lib/exam-scoring.js';
import { signAppPayload } from '../../api/_lib/app-backend.js';
import { questionRevision } from '../../src/lib/study-events.js';

const q1 = { id: 100, year: 4, subject: 'com3', type: 'mcq', q: 'Test', options: ['A', 'B', 'C'], answer: 1 };
const q2 = { ...q1, id: 101, year: 5, subject: 'com5' };
const id = '9466ac62-6c52-4b88-8d7a-a4cb41c38b03';
const catalog = new Map([q1, q2].map(q => [String(q.id), q]));
const input = () => ({ id, question_ids: [100], answers: { 100: 0 }, question_versions: { 100: questionRevision(q1) },
  correct: 999, total: 999, pct: 100, year: 1, subject: 'forged', mode: 'quick' });

test('canonical scoring ignores claimed score and scope', () => {
  const result = scoreSubmission(input(), catalog);
  assert.deepEqual([result.correct, result.total, result.pct, result.year, result.subject, result.score_source], [0, 1, 0, 4, 'com3', 'server']);
  assert.equal(scoreSubmission({ ...input(), answers: { 100: 1 } }, catalog).correct, 1);
});
test('old revisions and custom questions remain explicitly client scored', () => {
  assert.equal(scoreSubmission({ ...input(), question_versions: {}, correct: 1 }, catalog).score_source, 'client');
  assert.equal(scoreSubmission({ ...input(), question_ids: [99999], correct: 0 }, catalog).score_source, 'client');
  assert.throws(() => scoreSubmission({ ...input(), question_versions: {} }, catalog), /invalid-score/);
});
test('duplicate IDs cannot inflate total; mixed years cannot claim a single year', () => {
  assert.throws(() => scoreSubmission({ ...input(), question_ids: [100, 100] }, catalog), /duplicate-questions/);
  const result = scoreSubmission({ ...input(), question_ids: [100, 101],
    question_versions: { 100: questionRevision(q1), 101: questionRevision(q2) } }, catalog);
  assert.equal(result.year, null);
  assert.equal(result.subject, 'all');
});
test('receipts bind exact payload, purpose, current time and owner with a server-only key', () => {
  const secret = 'test-only-key-not-used-by-any-deployment';
  const signed = signAppPayload('exam-result', { user_id: 'owner', id }, { VETMOCK_RPC_SIGNING_KEY: secret });
  assert.equal(signed.signature, createHmac('sha256', secret).update(signed.payload).digest('hex'));
  const data = JSON.parse(signed.payload);
  assert.equal(data.purpose, 'exam-result');
  assert.equal(data.data.user_id, 'owner');
  assert.ok(Math.abs(data.issuedAt - Date.now() / 1000) < 2);
  assert.throws(() => signAppPayload('exam-result', {}, {}), /signing-unavailable/);
});
test('the stored percentage is the one the exam_results check accepts, x.5 rounding up', () => {
  // exam_results_score_shape_check requires pct = round(correct * 100.0 / total): exact
  // arithmetic, half away from zero. correct / total * 100 in floating point lands just
  // under the half for 10 pairs up to 300 questions (23 of 40 gives 57.49999999999999),
  // and that row was refused by the database on every retry, holding the device's queue.
  const qs = Array.from({ length: 40 }, (_, i) => ({ ...q1, id: 1000 + i }));
  const big = new Map(qs.map(q => [String(q.id), q]));
  const body = (right) => ({ id, mode: 'exam', question_ids: qs.map(q => q.id),
    answers: Object.fromEntries(qs.map((q, i) => [q.id, i < right ? 1 : 0])),
    question_versions: Object.fromEntries(qs.map(q => [q.id, questionRevision(q)])) });
  assert.equal(scoreSubmission(body(23), big).pct, 58);
  const exact = (c, t) => Math.floor((200 * c + t) / (2 * t));
  for (let total = 1; total <= 300; total++) {
    for (let correct = 0; correct <= total; correct++) {
      const ids = Array.from({ length: total }, (_, i) => 5000 + i);
      const r = scoreSubmission({ id, question_ids: ids, answers: {}, correct }, new Map());
      if (r.pct !== exact(correct, total)) assert.fail(`${correct}/${total}: ${r.pct}, check wants ${exact(correct, total)}`);
    }
  }
});
