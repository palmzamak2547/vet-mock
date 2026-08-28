// ============================================================
// vetwiki-retrieve + llm adapter — the AI layer's deterministic halves
// ============================================================
// Retrieval decides what the model is ALLOWED to know, so these tests pin
// the rankings that were verified by hand against the real corpus on
// 2026-08-29. If a corpus edit or a scoring tweak knocks the feline-URI
// article off a feline-URI question, this file is where it gets caught —
// every failure mode below was hit live while tuning:
//   • "uri" scoring every "urine" in the corpus (substring vs boundary)
//   • เกิดจากเชื้อ inventing the bigram เกิดเชื้อ after stopword removal
//   • tf without idf sending rabies questions to poultry vaccine programs

import test from 'node:test';
import assert from 'node:assert/strict';

import { questionTokens, retrieveSections } from '../../src/lib/vetwiki/retrieve.js';
import { chatJSON } from '../../api/_lib/llm.js';

// ── tokenization ──────────────────────────────────────────────────────────

test('Thai questions segment into content words, stopwords out', () => {
  const t = questionTokens('โรคพิษสุนัขบ้ามีกี่ระยะ');
  assert.ok(t.includes('ระยะ'));
  assert.ok(!t.includes('กี่'), 'question words are intent, not content');
  assert.ok(t.some((w) => w === 'สุนัขบ้า' || w === 'พิษสุนัข'), 'adjacent compounds re-form as bigrams');
});

test('bigrams come from raw adjacency, never across a removed stopword', () => {
  const t = questionTokens('เกิดจากเชื้ออะไร');
  assert.ok(!t.includes('เกิดเชื้อ'), 'เกิด-จาก-เชื้อ must not fuse into เกิดเชื้อ');
});

// ── ranking, pinned against the live corpus ──────────────────────────────

const topIds = (q, n = 3) => retrieveSections(q).slice(0, n).map((p) => p.sectionId);

test('a feline-URI question retrieves the feline-URI article first', () => {
  assert.equal(topIds('feline URI เกิดจากเชื้ออะไรบ้าง')[0], 'com5--feline-uri--5-pathogens-overview');
});

test('"uri" must not ride on "urine" — no litter-box articles up top', () => {
  const top = topIds('feline URI เกิดจากเชื้ออะไรบ้าง', 5);
  assert.ok(!top.some((id) => id.includes('elimination')), `got ${top.join(', ')}`);
});

test('a DFA question lands on rabies diagnosis', () => {
  const top = topIds('การตรวจ DFA คืออะไร', 2);
  assert.ok(top.includes('com5--rabies--diagnosis'), `got ${top.join(', ')}`);
});

test('a pasteurization question lands on milk processing', () => {
  assert.match(topIds('นมพาสเจอร์ไรส์ต่างจาก UHT ยังไง')[0], /milk-meat-hygiene--milk-processing/);
});

test('a rabies-vaccine question retrieves the prevention CPG section', () => {
  const top = topIds('วัคซีนพิษสุนัขบ้าฉีดตอนอายุเท่าไหร่', 3);
  assert.ok(top.includes('com5--rabies--prevention-pre-exposure-thai-rabies-cpg'), `got ${top.join(', ')}`);
});

test('nonsense retrieves nothing rather than something', () => {
  assert.deepEqual(retrieveSections('zzzz qqqq xxxx'), []);
});

// ── provider adapter (fetch injected via global) ─────────────────────────

const withFetch = async (impl, fn) => {
  const orig = globalThis.fetch;
  globalThis.fetch = impl;
  try { return await fn(); } finally { globalThis.fetch = orig; }
};
const jsonRes = (obj, status = 200) => ({
  ok: status < 400, status,
  json: async () => obj,
  text: async () => JSON.stringify(obj),
});

test('chatJSON returns the first provider answer', async () => {
  const calls = [];
  const out = await withFetch(async (url, init) => {
    calls.push(JSON.parse(init.body).model);
    return jsonRes({ choices: [{ message: { content: '{"claims":[]}' } }] });
  }, () => chatJSON({ system: 's', user: 'u', env: { DEEPSEEK_API_KEY: 'k' } }));
  assert.equal(out.ok, true);
  assert.equal(out.model, 'deepseek-v4-flash');
  assert.deepEqual(calls, ['deepseek-v4-flash']);
  // the primary call must disable thinking — with it on, the whole token
  // budget went to reasoning_content and content came back EMPTY (probed live)
});

test('an empty content (thinking ate the budget) falls to the alias', async () => {
  const calls = [];
  const out = await withFetch(async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ model: body.model, thinking: body.thinking?.type || null });
    if (calls.length === 1) return jsonRes({ choices: [{ message: { content: '', reasoning_content: 'x'.repeat(50) } }] });
    return jsonRes({ choices: [{ message: { content: '{"ok":1}' } }] });
  }, () => chatJSON({ system: 's', user: 'u', env: { DEEPSEEK_API_KEY: 'k' } }));
  assert.equal(out.ok, true);
  assert.equal(out.model, 'deepseek-chat');
  assert.equal(calls[0].thinking, 'disabled');
  assert.equal(calls[1].thinking, null);
});

test('all providers down → not ok, with the last status', async () => {
  const out = await withFetch(async () => jsonRes({ error: 'x' }, 500),
    () => chatJSON({ system: 's', user: 'u', env: { DEEPSEEK_API_KEY: 'k' } }));
  assert.equal(out.ok, false);
  assert.equal(out.status, 500);
});

test('no keys at all → 503 without a single network call', async () => {
  const out = await withFetch(async () => { throw new Error('must not be called'); },
    () => chatJSON({ system: 's', user: 'u', env: {} }));
  assert.deepEqual(out, { ok: false, status: 503 });
});
