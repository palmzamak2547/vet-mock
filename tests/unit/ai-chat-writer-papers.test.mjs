// ============================================================
// ai-chat writer + papers — streaming, fallback, output guards, literature
// ============================================================
// The fallback rule is the one that protects a student from a spliced
// answer: switch providers only BEFORE the first word, never after. The
// output filter is the last line against CJK fragments, emoji and the middle
// dot. The paper search must identify itself with the product URL and never
// with anyone's e-mail. All of it runs on stubbed fetch, no network.

import test from 'node:test';
import assert from 'node:assert/strict';

import { writeAnswer, parseDeepSeekEvent, parseAnthropicEvent, alternate } from '../../api/_lib/ai/writer.js';
import { createOutputFilter, plainText } from '../../api/_lib/ai/text.js';
import {
  findPapers, parseEfetchAbstracts, papersFromSummary, invertedAbstract, cleanTerms, pubmedTerm, papersCard, USER_AGENT,
} from '../../api/_lib/ai/papers.js';

const enc = new TextEncoder();
const ds = (text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;

/** A streamed Response: one part per read, then close, error or hang (until
 *  the request is aborted). Pull-based on purpose: erroring a stream drops
 *  whatever is still queued, so parts must be delivered before the error. */
function streamed(parts, { status = 200, errorAfter = false, hang = false, signal } = {}) {
  let i = 0;
  let ctrl;
  signal?.addEventListener('abort', () => { try { ctrl?.error(signal.reason); } catch { /* closed */ } });
  const body = new ReadableStream({
    start(controller) { ctrl = controller; },
    pull(controller) {
      if (i < parts.length) { controller.enqueue(enc.encode(parts[i++])); return undefined; }
      if (errorAfter) { controller.error(new Error('connection reset')); return undefined; }
      if (!hang) { controller.close(); return undefined; }
      return new Promise(() => {}); // never resolves: a provider that went quiet
    },
  });
  return new Response(body, { status, headers: { 'content-type': 'text/event-stream' } });
}

const ENV = { DEEPSEEK_API_KEY: 'test-key' };
const quiet = async (fn) => {
  const err = console.error;
  console.error = () => {};
  try { return await fn(); } finally { console.error = err; }
};

test('a streamed answer arrives piece by piece from the primary provider', async () => {
  const seen = [];
  const bodies = [];
  const r = await writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV,
    onDelta: (t) => seen.push(t),
    fetchImpl: async (url, init) => { bodies.push(JSON.parse(init.body)); return streamed([ds('สวัส'), ': keep-alive\n\n', ds('ดี'), 'data: [DONE]\n\n'], { signal: init.signal }); },
  });
  assert.equal(r.ok, true);
  assert.equal(r.model, 'primary');
  assert.deepEqual(seen, ['สวัส', 'ดี']);
  assert.equal(bodies[0].model, 'deepseek-flash');
  assert.deepEqual(bodies[0].thinking, { type: 'disabled' }, 'thinking off: the empty-content budget trap');
  assert.equal(bodies[0].stream, true);
});

test('a provider that fails before its first word hands over to the next', async () => {
  const models = [];
  const r = await quiet(() => writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV, onDelta: () => {},
    fetchImpl: async (url, init) => {
      const b = JSON.parse(init.body);
      models.push(b.model);
      if (b.model === 'deepseek-flash') return new Response('{"error":"overloaded"}', { status: 503 });
      return streamed([ds('ตอบ'), 'data: [DONE]\n\n'], { signal: init.signal });
    },
  }));
  assert.equal(r.ok, true);
  assert.equal(r.model, 'fallback');
  assert.deepEqual(models, ['deepseek-flash', 'deepseek-chat']);
});

test('an answer that only "thought" and said nothing counts as a failure', async () => {
  const reasoning = `data: ${JSON.stringify({ choices: [{ delta: { reasoning_content: 'thinking…' } }] })}\n\n`;
  let calls = 0;
  const r = await quiet(() => writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV, onDelta: () => {},
    fetchImpl: async (url, init) => {
      calls += 1;
      return calls === 1 ? streamed([reasoning, 'data: [DONE]\n\n'], { signal: init.signal }) : streamed([ds('ok'), 'data: [DONE]\n\n'], { signal: init.signal });
    },
  }));
  assert.equal(r.ok, true);
  assert.equal(r.model, 'fallback');
});

test('after the first word there is no fallback: the answer ends with an error', async () => {
  let calls = 0;
  const seen = [];
  const r = await quiet(() => writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV, onDelta: (t) => seen.push(t),
    fetchImpl: async (url, init) => { calls += 1; return streamed([ds('ครึ่ง')], { errorAfter: true, signal: init.signal }); },
  }));
  assert.equal(r.ok, false);
  assert.equal(r.partial, true);
  assert.equal(r.model, 'primary');
  assert.equal(calls, 1, 'no second provider was asked');
  assert.deepEqual(seen, ['ครึ่ง']);
});

test('a provider that never says a word times out and the next one answers', async () => {
  let calls = 0;
  const r = await quiet(() => writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV, onDelta: () => {}, firstByteMs: 60, idleMs: 60,
    fetchImpl: async (url, init) => {
      calls += 1;
      return calls === 1 ? streamed([': keep-alive\n\n'], { hang: true, signal: init.signal }) : streamed([ds('มาแล้ว'), 'data: [DONE]\n\n'], { signal: init.signal });
    },
  }));
  assert.equal(r.ok, true);
  assert.equal(r.model, 'fallback');
});

test('Anthropic alone is the primary provider, and its turns alternate', async () => {
  const anthropicEvents = [
    'event: message_start\ndata: {"type":"message_start"}\n\n',
    'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"สวัสดี"}}\n\n',
    'event: message_stop\ndata: {"type":"message_stop"}\n\n',
  ];
  let body;
  const r = await writeAnswer({
    system: 's', messages: [{ role: 'assistant', content: 'old' }, { role: 'user', content: 'a' }, { role: 'user', content: 'b' }],
    env: { ANTHROPIC_API_KEY: 'k' }, onDelta: () => {},
    fetchImpl: async (url, init) => { body = JSON.parse(init.body); return streamed(anthropicEvents, { signal: init.signal }); },
  });
  assert.equal(r.ok, true);
  assert.equal(r.model, 'primary');
  assert.deepEqual(body.messages, [{ role: 'user', content: 'a\n\nb' }]);
  assert.deepEqual(alternate([{ role: 'user', content: 'x' }, { role: 'assistant', content: 'y' }]).map((m) => m.role), ['user', 'assistant']);
});

test('stream event parsers read text, the end and errors', () => {
  assert.deepEqual(parseDeepSeekEvent('', '[DONE]'), { done: true });
  assert.equal(parseDeepSeekEvent('', ds('x').slice(6, -2)).text, 'x');
  assert.ok(parseDeepSeekEvent('', '{"error":{"message":"bad"}}').error);
  assert.equal(parseAnthropicEvent('content_block_delta', '{"type":"content_block_delta","delta":{"type":"text_delta","text":"y"}}').text, 'y');
  assert.deepEqual(parseAnthropicEvent('message_stop', '{"type":"message_stop"}'), { done: true });
});

test('the output filter drops CJK and emoji and fixes a middle dot split across chunks', () => {
  const f = createOutputFilter();
  let out = '';
  for (const chunk of ['โรคพิษสุนัขบ้าติดต่อ主要通过', 'การถูกกัด ✅ ', 'A ', '· B', ' ♀ และ ♂ → ต่อ']) out += f.push(chunk);
  out += f.flush();
  assert.equal(out, 'โรคพิษสุนัขบ้าติดต่อการถูกกัด A, B ♀ และ ♂ → ต่อ');
  assert.ok(f.dropped() > 0);
  assert.equal(plainText('Family · Genus **bold** [12:30-13:00]'), 'Family, Genus bold (12:30-13:00)');
});

// ── papers ───────────────────────────────────────────────────────────────
const EFETCH = `<?xml version="1.0"?><PubmedArticleSet>
<PubmedArticle><MedlineCitation><PMID Version="1">111</PMID><Article><Abstract>
<AbstractText Label="BACKGROUND">PRRSV is <i>costly</i> &amp; endemic.</AbstractText>
<AbstractText Label="RESULTS">GP5 deletion &lt;37&gt; changed tropism.</AbstractText>
</Abstract></Article></MedlineCitation></PubmedArticle>
<PubmedArticle><MedlineCitation><PMID Version="1">222</PMID></MedlineCitation></PubmedArticle>
</PubmedArticleSet>`;
const SUMMARY = { result: { uids: ['111', '222'],
  111: { title: 'Novel &lt;i&gt;PRRSV&lt;/i&gt; variant.', fulljournalname: 'Veterinary microbiology', pubdate: '2026 Mar 3', authors: [{ name: 'Lee A', authtype: 'Author' }, { name: 'Kim B', authtype: 'Author' }, { name: 'Chen C', authtype: 'Author' }, { name: 'Wu D', authtype: 'Author' }], articleids: [{ idtype: 'doi', value: '10.1016/j.vetmic.2026.1' }] },
  222: { title: 'Second paper', source: 'Virology', pubdate: '2025', authors: [] },
} };

test('PubMed abstracts and summaries are parsed into clean papers', () => {
  const abs = parseEfetchAbstracts(EFETCH);
  assert.equal(abs.get('111'), 'BACKGROUND: PRRSV is costly & endemic. RESULTS: GP5 deletion <37> changed tropism.');
  assert.equal(abs.has('222'), false);
  const papers = papersFromSummary(SUMMARY, ['111', '222'], abs);
  assert.equal(papers[0].title, 'Novel PRRSV variant');
  assert.equal(papers[0].year, 2026);
  assert.equal(papers[0].authors, 'Lee A, Kim B, Chen C, et al.');
  assert.equal(papers[0].url, 'https://pubmed.ncbi.nlm.nih.gov/111/');
  assert.equal(papers[0].doi, '10.1016/j.vetmic.2026.1');
  assert.equal(papers[1].journal, 'Virology');
  assert.equal(invertedAbstract({ swine: [1], The: [0], virus: [2] }), 'The swine virus');
  const card = papersCard(papers);
  assert.equal(card.type, 'papers');
  assert.ok(card.items[0].abstract.length <= 600);
});

test('search words are ASCII terms; phrases are quoted', () => {
  assert.deepEqual(cleanTerms(['PRRSV', 'ระยะฟักตัว', 'incubation period', 'PRRSV']), ['PRRSV', 'incubation period']);
  assert.equal(pubmedTerm(['rabies', 'incubation period']), 'rabies AND "incubation period"');
});

test('findPapers identifies itself by product URL, never e-mail, and caches for a day', async () => {
  const urls = [];
  const sets = [];
  const fetchImpl = async (url, init) => {
    urls.push(String(url));
    assert.equal(init.headers['User-Agent'], USER_AGENT);
    if (url.includes('esearch')) return Response.json({ esearchresult: { idlist: ['111', '222'] } });
    if (url.includes('esummary')) return Response.json(SUMMARY);
    if (url.includes('efetch')) return new Response(EFETCH);
    throw new Error(`unexpected ${url}`);
  };
  const kv = { get: async () => null, set: async (k, v, ttl) => sets.push({ k, v, ttl }) };
  const r = await findPapers(['PRRSV'], { recent: true, fetchImpl, kv, env: {} });
  assert.equal(r.source, 'pubmed');
  assert.equal(r.papers.length, 2);
  for (const u of urls) {
    const p = new URL(u).searchParams;
    assert.equal(p.get('tool'), 'vetmock-ai');
    assert.equal(p.has('email'), false);
  }
  assert.equal(new URL(urls[0]).searchParams.get('sort'), 'pub_date', 'latest means newest first');
  assert.ok(sets[0].k.startsWith('ai-chat:papers:v1:'));
  assert.equal(sets[0].ttl, 86400);

  const cached = await findPapers(['PRRSV'], { recent: true, fetchImpl: async () => { throw new Error('no network on a hit'); }, kv: { get: async () => ({ papers: r.papers }), set: async () => {} } });
  assert.equal(cached.source, 'cache');
});

test('OpenAlex answers when PubMed fails', async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    const r = await findPapers(['rabies'], {
      kv: { get: async () => null, set: async () => {} },
      env: {},
      fetchImpl: async (url) => {
        if (String(url).includes('eutils')) return new Response('down', { status: 500 });
        return Response.json({ results: [{ display_name: 'Rabies in dogs', publication_year: 2024, ids: { pmid: 'https://pubmed.ncbi.nlm.nih.gov/333' }, doi: 'https://doi.org/10.1/x', primary_location: { source: { display_name: 'Vet J' } }, authorships: [{ author: { display_name: 'A B' } }], abstract_inverted_index: { Dogs: [0], die: [1] } }] });
      },
    });
    assert.equal(r.source, 'openalex');
    assert.equal(r.papers[0].url, 'https://pubmed.ncbi.nlm.nih.gov/333/');
    assert.equal(r.papers[0].abstract, 'Dogs die');
  } finally {
    console.warn = warn;
  }
});
