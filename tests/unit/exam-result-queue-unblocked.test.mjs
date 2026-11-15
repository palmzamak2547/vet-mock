// Nothing may hold the exam-result outbox for ever. A finished set waits on the device until
// /api/exam-result takes it, and the outbox stops its batch at the first result that fails for a
// reason worth retrying. Three ways one record could stop every later result on every flush:
//   - a record carrying the id of another account's stored result (an edited backup):
//     record_exam_receipt skips the insert, finds no row for this caller and raises "Receipt
//     unavailable"; the API answered 503 result_pending, a retry. It now answers 409
//     result_conflict, which the outbox sets aside for the session, sending the rest;
//   - a record of another account at the head of the queue (an old device-wide key, the origin
//     move): the outbox threw at it. It now skips it and leaves it where it is;
// and one way a student lost a result's verification for no fault of theirs: the two fill questions
// whose revision changed in 5.214 (only the formula changed) made a set finished before the release
// and sent after it count as unverified. The server now accepts their previous revision.
// After a single conflict the outbox also keeps the conflict's own words instead of the general line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createExamResultOutbox } from '../../src/lib/exam-result-outbox.js';
import { scoreSubmission } from '../../api/_lib/exam-scoring.js';
import { questionRevision, acceptedQuestionRevisions } from '../../src/lib/study-events.js';
import { resetChulaGate } from '../../api/_lib/chula-gate.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const SESSION = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

async function callHandler(rpcResponse) {
  const previous = { ...process.env };
  const realFetch = globalThis.fetch;
  Object.assign(process.env, { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef', VETMOCK_RPC_SIGNING_KEY: 'test-only' });
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.endsWith('/rpc/chula_access_state')) return Response.json({ enforce: false, signed_in: true, member: true, uid: OWNER });
    if (u.endsWith('/auth/v1/user')) return Response.json({ id: OWNER });
    if (u.endsWith('/rpc/record_exam_receipt')) return rpcResponse();
    throw new Error(`unexpected fetch ${u}`);
  };
  resetChulaGate();
  try {
    const { default: handler } = await import('../../api/exam-result.js');
    const res = { headers: {}, statusCode: 0, body: null, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, end() { return this; } };
    const body = { id: SESSION, question_ids: ['no-such-question'], answers: {}, correct: 0, mode: 'quick', subject: 'com5', duration_sec: 10 };
    await handler({ method: 'POST', headers: { authorization: 'Bearer member.token.0123456789abcdef' }, body }, res);
    return res;
  } finally {
    process.env = previous;
    globalThis.fetch = realFetch;
    resetChulaGate();
  }
}

test('a result whose id is another account\'s row is a conflict, not a retry', async () => {
  const refused = await callHandler(() => Response.json({ code: '42501', message: 'Receipt unavailable' }, { status: 403 }));
  assert.equal(refused.statusCode, 409);
  assert.equal(refused.body.error, 'result_conflict');
  const down = await callHandler(() => new Response('{"message":"upstream"}', { status: 500 }));
  assert.equal(down.statusCode, 503, 'a database that is down is still worth retrying');
  assert.equal(down.body.error, 'result_pending');
});

function outbox(pending, send) {
  const sent = [], notices = [];
  let queue = pending;
  const box = createExamResultOutbox({
    snapshot: () => ({ userId: 'me', pending: queue }),
    send: async (r) => { sent.push(r.id); return send(r); },
    acknowledge: (_o, id) => { queue = queue.filter((r) => r.id !== id); return { accepted: true }; },
    notify: (_o, n) => notices.push(n),
  });
  return { box, sent, notices, queue: () => queue };
}
const conflict = () => { const e = new Error('ชุดนี้ถูกส่งจากอีกแท็บด้วยคำตอบต่างกันแล้ว กรุณาสำรองผลชุดนี้'); e.status = 409; e.conflict = true; return e; };

test('the outbox sets a 409 aside and sends the result behind it, saying the conflict\'s own words', async () => {
  const o = outbox([{ id: 'poisoned', user_id: 'me' }, { id: 'mine', user_id: 'me' }], async (r) => { if (r.id === 'poisoned') throw conflict(); return { ok: true }; });
  await o.box.flush();
  assert.deepEqual(o.sent, ['poisoned', 'mine']);
  assert.deepEqual(o.queue().map((r) => r.id), ['poisoned'], 'the refused record stays on the device; the next one was sent');
  assert.match(o.notices.at(-1).error, /ส่งจากอีกแท็บ.*กรุณาสำรอง/);
});

test('another account\'s record at the head is skipped and left where it is', async () => {
  const o = outbox([{ id: 'theirs', user_id: 'someone-else' }, { id: 'mine', user_id: 'me' }], async () => ({ ok: true }));
  await o.box.flush();
  assert.deepEqual(o.sent, ['mine']);
  assert.deepEqual(o.queue().map((r) => r.id), ['theirs']);
  assert.equal(o.notices.at(-1).error, null);
});

const nineField = (q) => {
  const text = JSON.stringify([q.type, q.q, q.front, q.back, q.options, q.answer, q.blanks, q.pairs, q.distractors]);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return `q1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
};

test('a fill question\'s revision from before 5.214 is still verified and re-scored', async () => {
  const bank = await BANK_REGISTRY.find((e) => e.file === 'questions-poultry.js').load();
  const q = bank.find((x) => x.id === 4002);
  assert.ok(q && q.type === 'fill' && q.unordered !== undefined, 'poultry 4002 is the fill question with unordered');
  const before = nineField(q);
  assert.notEqual(before, questionRevision(q));
  assert.deepEqual(acceptedQuestionRevisions(q), [questionRevision(q), before]);
  const right = q.blanks.map((b) => (Array.isArray(b) ? b[0] : b));
  const body = { id: SESSION, question_ids: [4002], answers: { 4002: right }, question_versions: { 4002: before }, correct: 0, mode: 'quick', subject: 'x' };
  const scored = scoreSubmission(body, new Map([['4002', q]]));
  assert.equal(scored.score_source, 'server');
  assert.equal(scored.correct, 1, 're-scored by the server, not the claimed 0');
  // A plain question accepts only the revision it has.
  const plain = bank.find((x) => x.unordered === undefined && x.keywords === undefined);
  assert.deepEqual(acceptedQuestionRevisions(plain), [questionRevision(plain)]);
  const stale = scoreSubmission({ ...body, question_ids: [plain.id], answers: {}, question_versions: { [plain.id]: 'q1-00000000' } }, new Map([[String(plain.id), plain]]));
  assert.equal(stale.score_source, 'client');
});
