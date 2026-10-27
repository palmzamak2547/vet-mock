// ============================================================
// ai-chat route — the contract the ai.vetmock.com page is built against
// ============================================================
// The real handler and the real pipeline, with fetch stubbed (planner reply,
// streamed answer, paper search): CORS, the GET health/stats shape and cache
// policy, every refusal that must come before the stream, and the order and
// shape of the events of a whole turn. Also: no vendor or model name in any
// user-facing field.

import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import handler from '../../api/ai-chat.js';
import { runChat } from '../../api/_lib/ai/pipeline.js';

function fakeRes() {
  const res = new EventEmitter();
  Object.assign(res, {
    statusCode: 200, headers: {}, body: undefined, chunks: [], ended: false,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    getHeader(k) { return res.headers[k.toLowerCase()]; },
    flushHeaders() {},
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; res.ended = true; return res; },
    write(c) { res.chunks.push(String(c)); return true; },
    end() { res.ended = true; res.emit('close'); return res; },
  });
  return res;
}

let ipSeq = 1;
function fakeReq({ method = 'POST', origin = 'https://ai.vetmock.com', body, badJson = false } = {}) {
  const req = { method, headers: { host: 'vetmock.com', ...(origin ? { origin } : {}) }, socket: { remoteAddress: `10.9.0.${ipSeq++}` } };
  Object.defineProperty(req, 'body', { get() { if (badJson) throw new Error('Invalid JSON'); return body; } });
  return req;
}

function parseEvents(chunks) {
  return chunks.join('').split('\n\n').filter(Boolean).map((block) => ({
    event: /^event: (.+)$/m.exec(block)[1],
    data: JSON.parse(/^data: (.*)$/m.exec(block)[1]),
  }));
}

const plannerReply = (plan) => Response.json({ choices: [{ message: { content: JSON.stringify(plan) } }] });
function sse(parts) {
  const enc = new TextEncoder();
  return new Response(new ReadableStream({ start(c) { for (const p of parts) c.enqueue(enc.encode(p)); c.close(); } }), { headers: { 'content-type': 'text/event-stream' } });
}
const ds = (text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;

async function withEnv(vars, fn) {
  const saved = {};
  for (const [k, v] of Object.entries(vars)) { saved[k] = process.env[k]; if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  try { return await fn(); } finally {
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
}
async function withFetch(stub, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = stub;
  try { return await fn(); } finally { globalThis.fetch = real; }
}
const silent = async (fn) => {
  const { log, error, warn } = console;
  console.log = () => {}; console.error = () => {}; console.warn = () => {};
  try { return await fn(); } finally { Object.assign(console, { log, error, warn }); }
};

test('OPTIONS answers the chat origins with the agreed preflight', async () => {
  for (const origin of ['https://ai.vetmock.com', 'http://localhost:43130', 'http://localhost:43131']) {
    const res = fakeRes();
    await handler(fakeReq({ method: 'OPTIONS', origin }), res);
    assert.equal(res.statusCode, 204);
    assert.equal(res.headers['access-control-allow-origin'], origin);
    assert.equal(res.headers['access-control-allow-methods'], 'POST, GET, OPTIONS');
    assert.equal(res.headers['access-control-allow-headers'], 'Content-Type');
    assert.equal(res.headers['access-control-max-age'], '7200');
  }
  const res = fakeRes();
  await handler(fakeReq({ method: 'OPTIONS', origin: 'https://evil.example' }), res);
  assert.equal(res.headers['access-control-allow-origin'], undefined);
});

test('GET reports configuration and counts from the loaded corpora, edge-cacheable', async () => {
  const res = fakeRes();
  await withEnv({ DEEPSEEK_API_KEY: undefined, ANTHROPIC_API_KEY: undefined }, () => silent(() => handler(fakeReq({ method: 'GET', origin: null }), res)));
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.configured, false);
  const keys = ['questions', 'wikiSections', 'wikiTopics', 'noteSections', 'videos', 'guideItems'];
  assert.deepEqual(Object.keys(res.body.stats).sort(), [...keys].sort());
  for (const k of keys) assert.ok(Number.isInteger(res.body.stats[k]) && res.body.stats[k] > 0, k);
  assert.equal(res.headers['cache-control'], 'public, s-maxage=600, stale-while-revalidate=3600');
  assert.equal(res.headers['access-control-allow-origin'], '*');
});

test('refusals come before the stream as JSON the page can read', async () => {
  await withEnv({ DEEPSEEK_API_KEY: 'test' }, async () => {
    const bad = fakeRes();
    await handler(fakeReq({ badJson: true }), bad);
    assert.equal(bad.statusCode, 400);
    assert.equal(bad.body.error, 'input');

    const long = fakeRes();
    await handler(fakeReq({ body: { messages: [{ role: 'user', content: 'ก'.repeat(4001) }] } }), long);
    assert.equal(long.statusCode, 400);
    assert.ok(/4,000/.test(long.body.message));

    const foreign = fakeRes();
    await handler(fakeReq({ origin: 'https://evil.example', body: { messages: [{ role: 'user', content: 'x' }] } }), foreign);
    assert.equal(foreign.statusCode, 403);

    const method = fakeRes();
    await handler(fakeReq({ method: 'PUT' }), method);
    assert.equal(method.statusCode, 405);
  });
  const unconfigured = fakeRes();
  await withEnv({ DEEPSEEK_API_KEY: undefined, ANTHROPIC_API_KEY: undefined }, () => handler(fakeReq({ body: { messages: [{ role: 'user', content: 'x' }] } }), unconfigured));
  assert.equal(unconfigured.statusCode, 503);
});

test('a whole turn streams status, sources, deltas, check and done, in that order', async () => {
  const res = fakeRes();
  const calls = [];
  await withEnv({ DEEPSEEK_API_KEY: 'test', ANTHROPIC_API_KEY: undefined, LLM_MODEL: undefined }, () => withFetch(async (url, init) => {
    const body = JSON.parse(init?.body || '{}');
    calls.push({ url: String(url), stream: body.stream === true });
    if (!String(url).includes('api.deepseek.com')) throw new Error(`no other network: ${url}`);
    if (body.stream !== true) return plannerReply({ intent: 'answer', query_th: 'ระยะฟักตัวของโรคพิษสุนัขบ้าในสุนัข', terms_en: ['rabies', 'incubation period', 'dog'], subjects: [] });
    // The answer cites [1] and invents a number to be caught.
    return sse([ds('จากแหล่ง [1] ระยะฟักตัว'), ds(' 999 วัน'), 'data: [DONE]\n\n']);
  }, () => silent(() => handler(fakeReq({ body: { messages: [{ role: 'user', content: 'ระยะฟักตัวของโรคพิษสุนัขบ้าในสุนัขนานเท่าไหร่' }], image: null } }), res))));

  assert.equal(res.headers['content-type'], 'text/event-stream; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'no-cache, no-transform');
  assert.equal(res.headers['x-accel-buffering'], 'no');
  assert.equal(res.headers['access-control-allow-origin'], 'https://ai.vetmock.com');
  const events = parseEvents(res.chunks);
  const names = events.map((e) => e.event);
  assert.deepEqual(events[0], { event: 'status', data: { phase: 'plan', label: 'กำลังทำความเข้าใจคำถาม' } });
  const iSources = names.indexOf('sources');
  const iDelta = names.indexOf('delta');
  assert.ok(iSources > 0 && iSources < iDelta, names.join(','));
  assert.equal(names.filter((n) => n === 'sources').length, 1);
  assert.deepEqual(names.slice(-2), ['check', 'done']);
  const sources = events[iSources].data;
  assert.equal(sources.covered, true);
  assert.ok(sources.items.length > 0 && sources.items.length <= 8);
  for (const s of sources.items) {
    assert.ok(s.n >= 1 && s.url.startsWith('https://') && s.snippet.length <= 220 && s.title);
  }
  assert.equal(events.filter((e) => e.event === 'delta').map((e) => e.data.text).join(''), 'จากแหล่ง [1] ระยะฟักตัว 999 วัน');
  const check = events.find((e) => e.event === 'check').data;
  assert.deepEqual(check.ungrounded, ['999']);
  assert.deepEqual(check.invalidCitations, []);
  const done = events.at(-1).data;
  assert.equal(done.model, 'primary');
  assert.ok(Number.isInteger(done.ms));
  assert.ok(!/deepseek|anthropic|claude|sonnet|gpt/i.test(res.chunks.join('')), 'no vendor or model name reaches the page');
  assert.deepEqual(calls.map((c) => c.stream), [false, true], 'one planner call, one streamed answer');
});

/** runChat with injected dependencies, events collected. */
async function turn(messages, { plan, answer = ['ลองทำดู'], fetchExtra = null, writerStatus = 200 } = {}) {
  const events = [];
  const fetchImpl = async (url, init) => {
    if (String(url).includes('api.deepseek.com')) {
      if (writerStatus !== 200) return new Response('{"error":"down"}', { status: writerStatus });
      return sse([...answer.map(ds), 'data: [DONE]\n\n']);
    }
    if (fetchExtra) return fetchExtra(url, init);
    throw new Error(`unexpected ${url}`);
  };
  await silent(() => runChat({ messages, image: null, question: messages.at(-1).content }, {
    send: (event, data) => { events.push({ event, data }); return true; },
    env: { DEEPSEEK_API_KEY: 'test' },
    deps: { chat: async () => ({ ok: true, text: JSON.stringify(plan) }), fetchImpl, kv: { get: async () => null, set: async () => {} } },
  }));
  return events;
}

test('a planner reading that finds nothing does not take the typed question\'s sources away', async () => {
  const q = 'อาการของโรคไข้หัดสุนัขมีอะไรบ้าง';
  const stray = { intent: 'answer', query_th: 'quantum chromodynamics ของ gluon คืออะไร', terms_en: ['quantum chromodynamics', 'gluon'], subjects: [] };
  const events = await turn([{ role: 'user', content: q }], { plan: stray });
  const sources = events.find((e) => e.event === 'sources').data;
  assert.equal(sources.covered, true);
  assert.match(sources.items[0].title, /distemper/i, sources.items.map((s) => s.title).join('\n'));
  // a follow-up has no reading of its own: the planner's stands, and says not covered
  const follow = await turn([
    { role: 'user', content: q }, { role: 'assistant', content: 'ไข้หัดสุนัขมีอาการ...' }, { role: 'user', content: 'แล้วในแมวล่ะ' },
  ], { plan: stray });
  assert.equal(follow.find((e) => e.event === 'sources').data.covered, false);
});

test('a quiz request gets a card of real questions before the answer', async () => {
  const events = await turn([{ role: 'user', content: 'ขอข้อสอบ COM5 5 ข้อ' }], { plan: { intent: 'quiz', query_th: 'ขอข้อสอบ COM V 5 ข้อ', terms_en: [], subjects: ['com5'], quiz_n: 5 } });
  const names = events.map((e) => e.event);
  const cards = events.find((e) => e.event === 'cards');
  assert.ok(names.indexOf('cards') < names.indexOf('delta'));
  const quiz = cards.data.items.find((c) => c.type === 'quiz');
  assert.equal(quiz.questions.length, 5);
  for (const q of quiz.questions) assert.ok(q.stem && q.options.length >= 2 && Number.isInteger(q.answer) && q.url.includes('?qset='));
  assert.equal(events.at(-1).event, 'done');
});

test('a research request leads with papers and sends a papers card', async () => {
  const EFETCH = '<PubmedArticle><PMID Version="1">111</PMID><AbstractText>PRRSV abstract 2026.</AbstractText></PubmedArticle>';
  const events = await turn([{ role: 'user', content: 'หางานวิจัย PRRSV ล่าสุด' }], {
    plan: { intent: 'research', query_th: 'งานวิจัย PRRSV ล่าสุด', terms_en: ['PRRSV'], subjects: [], recent: true },
    answer: ['งานล่าสุด [1]'],
    fetchExtra: async (url) => {
      if (String(url).includes('esearch')) return Response.json({ esearchresult: { idlist: ['111'] } });
      if (String(url).includes('esummary')) return Response.json({ result: { 111: { title: 'A PRRSV paper', fulljournalname: 'Vet Microbiol', pubdate: '2026', authors: [] } } });
      return new Response(EFETCH);
    },
  });
  const statuses = events.filter((e) => e.event === 'status').map((e) => e.data.phase);
  assert.ok(statuses.includes('research'));
  const sources = events.find((e) => e.event === 'sources').data;
  assert.equal(sources.items[0].kind, 'paper');
  assert.equal(sources.items[0].url, 'https://pubmed.ncbi.nlm.nih.gov/111/');
  const papers = events.find((e) => e.event === 'cards').data.items.find((c) => c.type === 'papers');
  assert.equal(papers.items[0].pmid, '111');
});

test('a provider failure after the stream opened is an error event, and the stream ends without done', async () => {
  const events = await turn([{ role: 'user', content: 'รักษาพาร์โวยังไง' }], {
    plan: { intent: 'answer', query_th: 'รักษาพาร์โวในสุนัขยังไง', terms_en: ['canine parvovirus', 'treatment'], subjects: [] },
    writerStatus: 503,
  });
  const last = events.at(-1);
  assert.equal(last.event, 'error');
  assert.equal(last.data.reason, 'provider');
  assert.ok(/[฀-๿]/.test(last.data.message));
  assert.ok(!events.some((e) => e.event === 'done'));
});

test('a greeting skips the planner and is answered without sources', async () => {
  let planned = false;
  const events = [];
  await silent(() => runChat({ messages: [{ role: 'user', content: 'สวัสดีครับ' }], image: null, question: 'สวัสดีครับ' }, {
    send: (event, data) => { events.push({ event, data }); return true; },
    env: { DEEPSEEK_API_KEY: 'test' },
    deps: { chat: async () => { planned = true; return { ok: false }; }, fetchImpl: async () => sse([ds('สวัสดีครับ'), 'data: [DONE]\n\n']) },
  }));
  assert.equal(planned, false);
  assert.deepEqual(events.find((e) => e.event === 'sources').data, { covered: true, items: [] });
  assert.equal(events.at(-1).event, 'done');
});
