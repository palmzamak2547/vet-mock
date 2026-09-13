// ============================================================
// study-coach — the guards between a generated sentence and a student
// ============================================================
// The three study aids all put model-written Thai in front of someone
// revising for an exam. What makes that acceptable is not the prompt; it is
// that each mode has a property the server re-checks after the model answers,
// and fails the block when it does not hold:
//
//   miss    — no figure that was not in the material
//   review  — no pattern citing a question we did not send
//   recall  — no answer that is not a verbatim quote of the summary
//
// These tests drive the real handler with the provider stubbed, so the guard
// is exercised as it will run, not as it is described.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { numbersIn, ungroundedNumbers, quotesFrom, checkText } from '../../api/_lib/grounding.js';
import { questionCatalog } from '../../api/_lib/question-catalog.js';
import { VIDEO_META } from '../../src/data/video-summaries-meta.js';
import { loadVideoSummariesForSubject } from '../../src/data/video-summaries.js';

process.env.DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'test-key';
const { default: handler } = await import('../../api/study-coach.js');

function fakeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    end() { return res; },
  };
  return res;
}

/** Every request gets its own IP so the per-IP limiter never colours a result. */
let ipSeq = 0;
const post = (body) => ({
  method: 'POST',
  headers: { host: 'vetmock.test' },
  socket: { remoteAddress: `10.9.${Math.floor(ipSeq / 250)}.${(ipSeq++) % 250}` },
  body,
});

const reply = (obj) => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(obj) } }] }), {
  status: 200, headers: { 'content-type': 'application/json' },
});

async function run(body, modelAnswer) {
  const real = globalThis.fetch;
  globalThis.fetch = async () => reply(modelAnswer);
  const res = fakeRes();
  try { await handler(post(body), res); } finally { globalThis.fetch = real; }
  return res;
}

// ── fixtures drawn from the live corpus ─────────────────────────────
const CATALOG = await questionCatalog();
const MCQS = [...CATALOG.values()].filter((q) => q.type === 'mcq' && Array.isArray(q.options) && q.options.length >= 3);
assert.ok(MCQS.length >= 2, 'the corpus must contain multiple choice questions');
const [Q1, Q2] = MCQS;
const wrongIndex = (q) => (q.answer === 0 ? 1 : 0);

const LECTURE = Object.values(VIDEO_META).find((m) => m.subject);
const LECTURE_TEXT = (await loadVideoSummariesForSubject(LECTURE.subject))[LECTURE.videoId].summary;

// ── the number guard, on its own ─────────────────────────────────────
test('a figure that was not in the material is not grounded', () => {
  assert.deepEqual(ungroundedNumbers('ให้ 5 mg/kg', 'ขนาดที่ใช้คือ 10 mg/kg'), ['5']);
  assert.deepEqual(ungroundedNumbers('ให้ 10 mg/kg', 'ขนาดที่ใช้คือ 10 mg/kg'), []);
  // Same number, different typing. A thousands separator or a Thai digit is
  // not a new fact and must not read as one.
  assert.deepEqual(ungroundedNumbers('1,200 ตัว', 'มี 1200 ตัว'), []);
  assert.deepEqual(ungroundedNumbers('พบ ๗๕%', 'พบ 75% ของทั้งหมด'), []);
  assert.deepEqual([...numbersIn('อายุ 2-3 สัปดาห์')].sort(), ['2', '3']);
});

test('a block of prose fails for exactly one reason at a time', () => {
  assert.equal(checkText('', 'x').reason, 'empty');
  assert.equal(checkText('ก'.repeat(401), 'x').reason, 'too-long');
  assert.equal(checkText('โรคนี้主要通过การกัด', 'x').reason, 'cjk');
  assert.equal(checkText('ใช้ 42 หน่วย', 'ไม่มีตัวเลข').reason, 'ungrounded-number');
  assert.equal(checkText('อธิบายได้ตามเนื้อหา', 'เนื้อหา').ok, true);
});

test('a quote counts only when the source really says it', () => {
  assert.equal(quotesFrom('bats เป็น reservoir', 'ปัจจัย bats เป็น\n   reservoir บ่อยที่สุด'), true);
  assert.equal(quotesFrom('cats เป็น reservoir', 'bats เป็น reservoir'), false);
  assert.equal(quotesFrom('สั้น', 'สั้นเกินกว่าจะเป็นการอ้างอิง'), false, 'a fragment is not a quote');
});

// ── mode: miss ───────────────────────────────────────────────────────
test('a miss explanation that invents a figure is withheld rather than shown', async () => {
  const res = await run(
    { mode: 'miss', qid: String(Q1.id), chosen: wrongIndex(Q1) },
    { trap: 'ตัวเลือกนี้เป็นของอีกโรคหนึ่ง', tell: 'ต้องใช้ 987654 หน่วยจึงจะเข้าเกณฑ์' },
  );
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.blocked, 'ungrounded-number');
  assert.equal(res.body.trap, undefined, 'no half of a blocked answer may leak');
});

test('a miss explanation grounded in the question is returned', async () => {
  const res = await run(
    { mode: 'miss', qid: String(Q1.id), chosen: wrongIndex(Q1) },
    { trap: 'ตัวเลือกนี้เป็นของภาวะอื่นที่อาการคล้ายกัน', tell: 'โจทย์ระบุเงื่อนไขที่ตัดข้อนี้ออกไป' },
  );
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.match(res.body.trap, /ภาวะอื่น/);
  assert.match(res.body.tell, /โจทย์/);
  assert.equal(res.headers['cache-control'], 'private, no-store');
});

test('half an explanation is not shown as a whole one', async () => {
  const res = await run(
    { mode: 'miss', qid: String(Q1.id), chosen: wrongIndex(Q1) },
    { trap: 'ตัวเลือกนี้เป็นของภาวะอื่น', tell: '' },
  );
  assert.equal(res.body.blocked, 'no-answer');
});

test('the miss route cannot be pointed at anything outside the corpus', async () => {
  let called = false;
  const real = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return reply({}); };
  const res = fakeRes();
  try {
    await handler(post({ mode: 'miss', qid: 'not-a-question', chosen: 0 }), res);
  } finally { globalThis.fetch = real; }
  assert.equal(res.statusCode, 400);
  assert.equal(called, false, 'an unknown question must never reach the provider');
});

test('an answer that was right spends nothing', async () => {
  let called = false;
  const real = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return reply({}); };
  const res = fakeRes();
  try {
    await handler(post({ mode: 'miss', qid: String(Q1.id), chosen: Q1.answer }), res);
  } finally { globalThis.fetch = real; }
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
});

test('an option index outside the question is refused', async () => {
  const res = await run({ mode: 'miss', qid: String(Q1.id), chosen: 99 }, {});
  assert.equal(res.statusCode, 400);
});

// ── mode: review ─────────────────────────────────────────────────────
const reviewBody = () => ({
  mode: 'review',
  items: [
    { qid: String(Q1.id), chosen: wrongIndex(Q1) },
    { qid: String(Q2.id), chosen: wrongIndex(Q2) },
  ],
});

test('a pattern citing a question we never sent is dropped', async () => {
  const res = await run(reviewBody(), {
    patterns: [
      { text: 'สับสนระหว่างสองภาวะที่อาการใกล้เคียงกัน', qids: ['Q1', 'Q2'] },
      { text: 'อ่านเงื่อนไขในโจทย์ไม่ครบ', qids: ['Q7', 'Q8'] },
    ],
    focus: 'ทบทวนจุดที่ใช้แยกสองภาวะนี้',
  });
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.patterns.length, 1);
  assert.deepEqual(res.body.patterns[0].questionIds, [String(Q1.id), String(Q2.id)]);
});

test('one question is not a pattern', async () => {
  const res = await run(reviewBody(), {
    patterns: [{ text: 'พลาดเพราะจำชื่อผิด', qids: ['Q1'] }],
    focus: '',
  });
  assert.equal(res.body.blocked, 'no-pattern');
});

test('a session with one miss never reaches the provider', async () => {
  let called = false;
  const real = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return reply({}); };
  const res = fakeRes();
  try {
    await handler(post({ mode: 'review', items: [{ qid: String(Q1.id), chosen: wrongIndex(Q1) }] }), res);
  } finally { globalThis.fetch = real; }
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
});

// ── mode: recall ─────────────────────────────────────────────────────
test('a recall answer that is not in the summary is dropped, and the rest survive', async () => {
  // Three real lines out of the lecture, plus one the lecture never said.
  const lines = LECTURE_TEXT.split('\n').map((l) => l.replace(/^[#>\-*\s]+/, '').trim())
    .filter((l) => l.length > 20 && l.length < 180).slice(0, 3);
  assert.ok(lines.length === 3, 'the fixture lecture must have quotable lines');
  const res = await run({ mode: 'recall', videoId: LECTURE.videoId }, {
    items: [
      ...lines.map((quote) => ({ q: 'บรรทัดนี้พูดถึงเรื่องอะไร', quote })),
      { q: 'คำถามที่ไม่มีคำตอบในสรุป', quote: 'ประโยคนี้ไม่เคยปรากฏในสรุปของคลิปนี้เลยแม้แต่ครั้งเดียว' },
    ],
  });
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.items.length, 3);
  assert.ok(res.body.items.every((it) => LECTURE_TEXT.replace(/\s+/g, ' ').includes(it.quote.replace(/\s+/g, ' '))));
});

test('a recall set with nothing quotable is withheld, not padded', async () => {
  const res = await run({ mode: 'recall', videoId: LECTURE.videoId }, {
    items: [
      { q: 'ถามอะไรสักอย่าง', quote: 'ข้อความที่แต่งขึ้นเองล้วน ๆ ไม่ได้มาจากสรุป' },
      { q: 'ถามอีกอย่าง', quote: 'ข้อความที่แต่งขึ้นเองอีกอันหนึ่งซึ่งไม่มีในสรุป' },
    ],
  });
  assert.equal(res.body.blocked, 'no-quotable-items');
});

test('a lecture we do not hold is a 404 and costs nothing', async () => {
  let called = false;
  const real = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return reply({}); };
  const res = fakeRes();
  try { await handler(post({ mode: 'recall', videoId: 'zzzzzzzzzzz' }), res); } finally { globalThis.fetch = real; }
  assert.equal(res.statusCode, 404);
  assert.equal(called, false);
});

// ── the envelope ─────────────────────────────────────────────────────
test('an unknown mode is refused before any lookup', async () => {
  const res = await run({ mode: 'freeform', prompt: 'write me an essay' }, {});
  assert.equal(res.statusCode, 400);
});

test('a cross-origin caller that is not ours is refused', async () => {
  const res = fakeRes();
  await handler({ ...post({ mode: 'miss' }), headers: { host: 'vetmock.test', origin: 'https://evil.example' } }, res);
  assert.equal(res.statusCode, 403);
});

test('every route on the shared key checks the same daily ceiling', async () => {
  const { readFileSync } = await import('node:fs');
  const routes = ['grade-summary', 'study-coach', 'wiki-explain'];
  for (const route of routes) {
    const src = readFileSync(new URL(`../../api/${route}.js`, import.meta.url), 'utf8');
    assert.match(src, /rateLimit\('provider:llm:daily', LLM_DAILY_BUDGET/,
      `${route} must read the shared budget rather than its own number`);
  }
});

// ── the button that does not appear ──────────────────────────────────
test('no explanation is offered for an option the bank already walks through', async () => {
  const { alreadyExplained } = await import('../../src/lib/study-coach.js');
  // A section that goes through the wrong options covers all of them.
  const walksThem = 'เฉลยคือ A เพราะ ... ทำไมข้อนี้ผิด — "สปอร์ขนาด 3.5 x 2.0-2.4 µm" = ขนาดใหญ่เกินจริง';
  assert.equal(alreadyExplained(walksThem, 'สปอร์ขนาด 1.1 x 0.6-0.7 µm มี polar filament ขด 10-12 รอบ'), true);
  // Without that section, only an option the explanation actually quotes.
  const quotesOne = 'เฉลยคือ A เพราะสปอร์ขนาด 3.5 x 2.0-2.4 µm มี polar filament ขด 4-5 รอบ นั้นใหญ่เกินจริง';
  assert.equal(alreadyExplained(quotesOne, 'สปอร์ขนาด 3.5 x 2.0-2.4 µm มี polar filament ขด 4-5 รอบ'), true);
  assert.equal(alreadyExplained(quotesOne, 'สปอร์ขนาด 1.1 x 0.6-0.7 µm มี polar filament ขด 10-12 รอบ'), false);
  // Whitespace and line wrapping in the source must not decide it.
  assert.equal(alreadyExplained('ทำไมผิด —\n   ขนาดใหญ่เกินจริง\nมากสำหรับสปอร์ชนิดนี้', 'ขนาดใหญ่เกินจริง มากสำหรับสปอร์ชนิดนี้'), true);
  assert.equal(alreadyExplained('', 'อะไรก็ได้ที่ยาวพอ'), false);
  assert.equal(alreadyExplained('ก ข ค', 'สั้น'), false, 'a short option must not match by accident');
});

test('a True/False question is not a miss the coach takes on', async () => {
  const tf = [...CATALOG.values()].find((q) => q.type === 'tf');
  if (!tf) return;
  let called = false;
  const real = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return reply({}); };
  const res = fakeRes();
  try { await handler(post({ mode: 'miss', qid: String(tf.id), chosen: !tf.answer }), res); }
  finally { globalThis.fetch = real; }
  assert.equal(res.statusCode, 400);
  assert.equal(called, false);
});
