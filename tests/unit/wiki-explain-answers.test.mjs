// ============================================================
// wiki-explain-answers.test.mjs — what ถามคลังความรู้ says when it cannot
// simply answer
// ============================================================
// The owner saw "ตอบไม่สำเร็จ ลองใหม่อีกครั้ง" for "Ivermectin" (5.141.6).
// These run the real handler with the provider stubbed:
//   • a question VetWiki does not cover is answered as such, with no model
//     call and nothing that spends the shared daily budget;
//   • a term no section mentions is named to the model and to the client;
//   • a reply cut off at the token limit keeps its complete claims;
//   • every failure carries a reason the search box can act on.

import test from 'node:test';
import assert from 'node:assert/strict';

const { default: handler, config, salvageClaims } = await import('../../api/wiki-explain.js');
const { retrieveForQuestion } = await import('../../src/lib/vetwiki/retrieve.js');

function fakeRes() {
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    end() { return res; },
  };
  return res;
}

let ip = 0;
const ask = (question) => ({
  method: 'POST',
  headers: { host: 'vetmock.test' },
  socket: { remoteAddress: `10.66.0.${++ip}` },
  body: { question },
});

async function run(question, fetchStub) {
  const previousKey = process.env.DEEPSEEK_API_KEY;
  const previousAnthropic = process.env.ANTHROPIC_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.DEEPSEEK_API_KEY = 'test-key';
  delete process.env.ANTHROPIC_API_KEY;
  globalThis.fetch = fetchStub;
  const res = fakeRes();
  try {
    await handler(ask(question), res);
    return res;
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = previousKey;
    if (previousAnthropic !== undefined) process.env.ANTHROPIC_API_KEY = previousAnthropic;
  }
}

const reply = (content) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
  headers: { 'content-type': 'application/json' },
});

test('the platform limit sits above the model deadline', () => {
  assert.ok(config.maxDuration >= 30, 'a slow answer must end in the handler, not the platform');
});

test('a question VetWiki does not cover is answered as such without asking the model', async () => {
  let calls = 0;
  const res = await run('TPLO ผ่าตัดยังไง', async () => { calls++; throw new Error('the model must not be asked'); });
  assert.equal(calls, 0);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.meta.covered, false);
  assert.deepEqual(res.body.meta.unmatched, ['tplo']);
  assert.ok(Array.isArray(res.body.meta.related));
  // Clients built before meta.covered still show an honest sentence.
  assert.equal(res.body.claims[0].supportType, 'insufficient-evidence');
});

test('a term no section mentions is named to the model and returned to the client', async () => {
  let prompt = '';
  const res = await run('Norberg angle วัดยังไง', async (_url, init) => {
    prompt = JSON.parse(init.body).messages.at(-1).content;
    return reply('{"claims":[{"id":"c1","text":"คลังความรู้ยังไม่มีเรื่อง Norberg angle","supportType":"insufficient-evidence","support":[]}]}');
  });
  assert.equal(res.statusCode, 200);
  assert.match(prompt, /no supplied section mentions: norberg/);
  assert.deepEqual(res.body.meta.unmatched, ['norberg']);
  assert.equal(res.body.meta.covered, true);
});

test('a reply cut off at the token limit keeps the claims that were complete', async () => {
  const cut = '{"claims":[{"id":"c1","text":"วัคซีนพิษสุนัขบ้าในลูกสุนัขฉีด 2 เข็ม","supportType":"vetwiki-verified","support":[{"sectionId":"S1"}]},{"id":"c2","text":"บูสเตอร์ที่อาย';
  const res = await run('วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม', async () => reply(cut));
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.claims.length, 1);
  assert.equal(res.body.claims[0].id, 'c1');
  // The short alias S1 was mapped back to the first section sent, and validated.
  const first = retrieveForQuestion('วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม', { maxSections: 10 }).picks[0].sectionId;
  assert.deepEqual(res.body.claims[0].support.map((x) => x.sectionId), [first]);
});

test('every failure says why, so the search box can offer the right next step', async () => {
  const timeout = await run('วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม', async () => { throw new DOMException('aborted', 'AbortError'); });
  assert.equal(timeout.statusCode, 504);
  assert.equal(timeout.body.reason, 'timeout');

  const provider = await run('วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม', async () => new Response('{"error":"down"}', { status: 500 }));
  assert.equal(provider.statusCode, 502);
  assert.equal(provider.body.reason, 'provider');

  const malformed = await run('วัคซีนพิษสุนัขบ้าฉีดกี่เข็ม', async () => reply('ขออภัย ตอบเป็น JSON ไม่ได้'));
  assert.equal(malformed.statusCode, 502);
  assert.equal(malformed.body.reason, 'malformed');
});

test('salvage reads strings with escaped quotes and brackets, and gives up on nothing', () => {
  const BACKSLASH = String.fromCharCode(92);
  const text = `{"claims":[{"id":"c1","text":"he said ${BACKSLASH}"ok${BACKSLASH}" [1]","supportType":"vetmock-analysis","support":[]},{"id":"c2","text":"cut`;
  assert.deepEqual(salvageClaims(text), { claims: [{ id: 'c1', text: 'he said "ok" [1]', supportType: 'vetmock-analysis', support: [] }] });
  assert.equal(salvageClaims('{"claims":[{"id":"c1","text":"never closed'), null);
  assert.equal(salvageClaims('no json here'), null);
  assert.equal(salvageClaims(''), null);
});
