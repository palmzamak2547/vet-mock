// ============================================================
// study-coach-cache-revision — a content fix invalidates the coach cache
// ============================================================
// B14 / B52 (bug hunt 2026-09-26). The coach caches each answer in the
// shared KV: a miss explanation for 7 days under coach:v2:miss:<qid>:<chosen>,
// a recall set for 7 days under coach:v2:recall:<videoId>, a review for a day
// under a hash of (id, picked text). None of those keys changes when the
// question's key, its option text or the lecture summary is corrected, so an
// explanation written against the OLD answer key, or a recall "verbatim
// quote" the summary no longer contains, kept being served after the fix.
//
// This drives the real handler with a stand-in for the Upstash REST pipeline
// and the provider, so the cache is exercised as it runs in production.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

process.env.UPSTASH_REDIS_REST_URL = 'https://kv.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
process.env.DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'test-key';

const { default: handler } = await import('../../api/study-coach.js');
const { questionCatalog } = await import('../../api/_lib/question-catalog.js');
const { VIDEO_META } = await import('../../src/data/video-summaries-meta.js');
const { loadVideoSummariesForSubject } = await import('../../src/data/video-summaries.js');

const kv = new Map();
const counters = new Map();
let providerCalls = 0;
let modelAnswer = null;

function upstash(commands) {
  return commands.map(([cmd, key, value]) => {
    if (cmd === 'INCR') { const n = (counters.get(key) || 0) + 1; counters.set(key, n); return { result: n }; }
    if (cmd === 'EXPIRE') return { result: 1 };
    if (cmd === 'TTL') return { result: 60 };
    if (cmd === 'GET') return { result: kv.has(key) ? kv.get(key) : null };
    if (cmd === 'SET') { kv.set(key, value); return { result: 'OK' }; }
    return { result: null };
  });
}

async function call(body) {
  const real = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith('https://kv.test')) {
      return new Response(JSON.stringify(upstash(JSON.parse(init.body))), { status: 200 });
    }
    providerCalls++;
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(modelAnswer) } }] }), { status: 200 });
  };
  const res = { statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; }, status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; }, end() { return res; } };
  try {
    await handler({ method: 'POST', headers: { host: 'vetmock.test' }, socket: { remoteAddress: `10.77.0.${providerCalls % 250}` }, body }, res);
  } finally { globalThis.fetch = real; }
  return res;
}

const CATALOG = await questionCatalog();
const Q = [...CATALOG.values()].find((q) => q.type === 'mcq' && Array.isArray(q.options) && q.options.length >= 3 && q.answer !== 0);

test('a miss explanation cached before the answer key moved is not served after it', async () => {
  modelAnswer = { trap: 'ตัวเลือกนี้เป็นของภาวะอื่นที่อาการคล้ายกัน', tell: 'โจทย์ระบุเงื่อนไขที่ตัดข้อนี้ออกไป' };
  const body = { mode: 'miss', qid: String(Q.id), chosen: 0 };
  const before = providerCalls;
  assert.equal((await call(body)).statusCode, 200);
  const again = await call(body);
  assert.equal(again.body.cached, true, 'an unchanged question is served from the cache');
  assert.equal(providerCalls - before, 1);

  const saved = { options: Q.options, answer: Q.answer };
  try {
    // An in-place content fix: the option text the student picked is rewritten.
    Q.options = Q.options.map((o, i) => (i === 0 ? `${o} (แก้ไข)` : o));
    const fixed = await call(body);
    assert.equal(fixed.statusCode, 200);
    assert.notEqual(fixed.body.cached, true, 'an explanation of the old option text was served after the fix');
    assert.equal(providerCalls - before, 2);

    // A re-key: the correct answer moves.
    Q.answer = Q.options.length - 1 === saved.answer ? 1 : Q.options.length - 1;
    const rekeyed = await call(body);
    assert.notEqual(rekeyed.body.cached, true, 'an explanation written against the old key was served');
  } finally { Q.options = saved.options; Q.answer = saved.answer; }
});

test('a review cached before a correction is not served after it', async () => {
  const [A, B] = [...CATALOG.values()].filter((q) => q.type === 'mcq' && q.options?.length >= 3 && q.answer !== 0).slice(0, 2);
  modelAnswer = { patterns: [], focus: 'ทบทวนเนื้อหาของสองข้อนี้อีกครั้ง' };
  const body = { mode: 'review', items: [{ qid: String(A.id), chosen: 0 }, { qid: String(B.id), chosen: 0 }] };
  await call(body);
  assert.equal((await call(body)).body.cached, true);
  const saved = A.answer;
  try {
    A.answer = A.options.length - 1 === saved ? 1 : A.options.length - 1;
    assert.notEqual((await call(body)).body.cached, true, 'a review built on the old correct answer was served');
  } finally { A.answer = saved; }
});

test('a recall set cached before the summary was corrected is not served after it', async () => {
  const lecture = Object.values(VIDEO_META).find((m) => m.subject);
  const entry = (await loadVideoSummariesForSubject(lecture.subject))[lecture.videoId];
  const line = entry.summary.split('\n').map((s) => s.replace(/^[-*#>\s]+/, '').trim()).filter((s) => s.length >= 20 && s.length <= 150);
  modelAnswer = { items: line.slice(0, 2).map((quote) => ({ q: 'เนื้อหาส่วนนี้กล่าวถึงอะไร', quote })) };
  const body = { mode: 'recall', videoId: lecture.videoId };
  const first = await call(body);
  assert.equal(first.statusCode, 200, JSON.stringify(first.body));
  assert.equal((await call(body)).body.cached, true);
  const saved = entry.summary;
  try {
    entry.summary = saved.replace(line[0], `${line[0]} (ฉบับแก้ไข)`);
    assert.notEqual((await call(body)).body.cached, true, 'a recall set quoting the old summary was served');
  } finally { entry.summary = saved; }
});

test('the VetWiki answer cache is keyed on the sections it answers from', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../api/wiki-explain.js', import.meta.url), 'utf8');
  assert.match(src, /const cacheKey = `ask:\$\{createHash\('sha1'\)\.update\(JSON\.stringify\(\{ norm, subject, topic, wanted, sectionsRev \}\)\)/,
    'a corrected section must retire the cached answer');
  const lookup = src.indexOf('await kvGetJSON(cacheKey)');
  assert.ok(lookup > src.indexOf('picked = '), 'the lookup runs after the sections are chosen');
  assert.ok(src.indexOf('const sectionsRev') < lookup);
});
