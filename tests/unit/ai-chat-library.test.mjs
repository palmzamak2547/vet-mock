// ============================================================
// ai-chat library — slides and handouts: found, ranked, opened, downloaded
// ============================================================
// The study library answers two kinds of turn: a request for files (the card
// is the answer) and an ordinary question (the matching slide pages become
// sources the answer may cite, and their decks a card under it). These tests
// pin the ranking against the real failure (a 952-page compilation burying
// the deck named "Rabies"), the mis-encoded Thai filter, the links, the
// planner's separation of files from quizzes and questions, and a whole turn
// of each kind with a fake database.

import test from 'node:test';
import assert from 'node:assert/strict';

import { garbled, rankFiles, searchPhrases, fileLinks, findFiles, pageSource, subjectLabel } from '../../api/_lib/ai/library.js';
import { heuristicPlan, parsePlan, fileKindIn } from '../../api/_lib/ai/planner.js';
import { runChat } from '../../api/_lib/ai/pipeline.js';

const ENV = { VITE_SUPABASE_URL: 'https://db.example', VITE_SUPABASE_ANON_KEY: 'anon', DEEPSEEK_API_KEY: 'test' };
const turn = (content) => [{ role: 'user', content }];

test('mis-encoded Thai is caught, real Thai and English with units are not', () => {
  assert.equal(garbled('ne 13. o°ÄÁÈª´¸µÁ¨º° °Â¤ª(non y core vaccine)'), true);
  assert.equal(garbled('Negri bodies Histopathology การวินิจฉัยโรคพิษสุนัขบ้า'), false);
  assert.equal(garbled('Give 0.1 mg/kg (100 µg/kg) at 37 °C, ± 2 hours'), false);
  assert.equal(garbled(''), false);
});

test('a deck named for the topic beats a long compilation that mentions it often', () => {
  const docs = [
    { slug: 'vetku-80', title: 'เฉลย Vetku 80', kind: 'pastpaper', subject: 'vca', page_count: 952, hits: 187 },
    { slug: 'rabies', title: 'Rabies', kind: 'slide', subject: 'com5', page_count: 34, hits: 6 },
    { slug: 'who', title: 'WHO Expert Consultation on Rabies', kind: 'guideline', subject: 'zoonoses', page_count: 195, hits: 187 },
    { slug: 'vax', title: 'Vaccine considerations', kind: 'slide', subject: 'com5', page_count: 41, hits: 14 },
  ];
  const ranked = rankFiles(docs, { terms: ['rabies'] }).map((d) => d.slug);
  assert.equal(ranked.at(-1) === 'vetku-80' || ranked.indexOf('vetku-80') > ranked.indexOf('rabies'), true);
  assert.ok(ranked.indexOf('rabies') < ranked.indexOf('vetku-80'), `deck before compilation: ${ranked}`);
  assert.ok(ranked.indexOf('rabies') < ranked.indexOf('vax'));
  // asked for past papers, a past paper comes first
  assert.equal(rankFiles(docs, { terms: ['rabies'], kind: 'pastpaper' })[0].slug, 'vetku-80');
  // the subject asked about lifts its documents
  assert.equal(rankFiles(docs.filter((d) => d.slug !== 'rabies'), { terms: ['rabies'], subjects: ['com5'] })[0].subject, 'zoonoses');
});

test('search phrases: specific English first, then the pair, then the strongest Thai term', () => {
  assert.deepEqual(searchPhrases({ terms: ['rabies', 'incubation period'], needles: ['ระยะฟักตัว', 'rabies'] }), ['rabies', 'rabies incubation period', 'ระยะฟักตัว']);
  assert.deepEqual(searchPhrases({ terms: [], needles: ['พิษสุนัขบ้า'] }), ['พิษสุนัขบ้า']);
  assert.deepEqual(searchPhrases({ terms: ['ab'], needles: [] }), [], 'too short to search');
  assert.equal(searchPhrases({ title: 'Avian 2.1', terms: ['avian influenza'] })[0], 'avian 2.1');
});

test('links open at the matching page and download under the document title', () => {
  const l = fileLinks('การวินิจฉัย-rabies', 12, 'Rabies: diagnosis.pdf');
  assert.ok(l.open.startsWith('https://vetmock.com/api/library-file?slug=%E0%B8%81'));
  assert.ok(l.open.endsWith('&open=1#page=12'));
  const d = new URL(l.download);
  assert.equal(d.searchParams.get('dl'), '1');
  assert.equal(d.searchParams.get('name'), 'Rabies: diagnosis.pdf');
  assert.ok(!fileLinks('x-deck', 1).open.includes('#page'), 'page 1 needs no fragment');
  assert.equal(subjectLabel('xyz'), 'XYZ', 'an id with no name is shown as itself');
});

/** A fake library: search rows per phrase, catalog rows, page bodies. */
function fakeLibrary({ search = {}, docs = [], pages = [] } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const u = String(url);
    calls.push(u);
    if (u.includes('/rpc/library_search')) return Response.json(search[JSON.parse(init.body).q] || []);
    if (u.includes('/library_doc_pages')) return Response.json(pages);
    if (u.includes('/library_docs')) {
      const q = decodeURIComponent(u);
      if (q.includes('title=ilike')) return Response.json(docs.filter((d) => q.toLowerCase().includes(String(d.title).toLowerCase().split(' ')[0])));
      return Response.json(docs.filter((d) => q.includes(`"${d.slug}"`)));
    }
    throw new Error(`unexpected ${u}`);
  };
  return { fetchImpl, calls };
}

const DOCS = [
  { id: 'd1', slug: 'rabies-com5', title: 'Rabies', kind: 'slide', subject: 'com5', year: 4, lecturer: 'อ.ก', page_count: 34, byte_size: 3_853_000, mime: 'application/pdf' },
  { id: 'd2', slug: 'vetku-80', title: 'เฉลย Vetku 80', kind: 'pastpaper', subject: 'vca', year: 5, page_count: 952, byte_size: 64_000_000, mime: 'application/pdf' },
];
const SEARCH = {
  rabies: [{ slug: 'vetku-80', page: 80, hits: 39, snippet: 'ne 13. o°ÄÁÈª´¸µÁ¨º° °Â¤ª' }, { slug: 'rabies-com5', page: 12, hits: 6, snippet: 'Negri bodies Histopathology การวินิจฉัยโรคพิษสุนัขบ้า' }],
};

test('a request for files: ranked documents with links, a garbled snippet dropped', async () => {
  const lib = fakeLibrary({ search: SEARCH, docs: DOCS });
  const r = await findFiles({ terms: ['rabies'], files: true }, { env: ENV, fetchImpl: lib.fetchImpl });
  assert.equal(r.failed, false);
  assert.equal(r.items[0].slug, 'rabies-com5');
  assert.equal(r.items[0].kindLabel, 'สไลด์');
  assert.equal(r.items[0].page, 12);
  assert.ok(r.items[0].open.endsWith('#page=12'));
  assert.ok(r.items[0].snippet.includes('Negri'));
  const paper = r.items.find((i) => i.slug === 'vetku-80');
  assert.equal(paper.snippet, '', 'mis-encoded text never reaches the page');
  assert.deepEqual(r.pages, [], 'a request for files quotes no pages');
});

test('an answer gets the text of the best pages, garbled ones skipped', async () => {
  const lib = fakeLibrary({ search: SEARCH, docs: DOCS, pages: [{ doc_id: 'd1', page: 12, body: 'Negri bodies\nHistopathology\nการวินิจฉัยโรคพิษสุนัขบ้า' }, { doc_id: 'd2', page: 80, body: 'o°ÄÁÈª´¸µÁ¨º° °Â¤ª o°ÄÁÈª´' }] });
  const r = await findFiles({ terms: ['rabies'], needles: ['พิษสุนัขบ้า'] }, { env: ENV, fetchImpl: lib.fetchImpl });
  assert.equal(r.items.length <= 3, true);
  assert.equal(r.pages.length, 1);
  const s = pageSource(r.pages[0], { needles: ['Negri'] });
  assert.equal(s.kind, 'library');
  assert.equal(s.subtitle, 'สไลด์ com5, หน้า 12'.replace('com5', subjectLabel('com5')));
  assert.ok(s.url.endsWith('#page=12') && s.context.includes('Negri'));
});

test('no config, a slow or broken database: no files, never an error', async () => {
  assert.deepEqual(await findFiles({ terms: ['rabies'] }, { env: {} }), { items: [], pages: [], failed: true });
  const broken = await findFiles({ terms: ['rabies'] }, { env: ENV, fetchImpl: async () => new Response('down', { status: 503 }) });
  assert.deepEqual(broken.items, []);
});

test('the planner keeps files, quizzes, openings and questions apart', () => {
  const slides = heuristicPlan(turn('ขอสไลด์ rabies หน่อย'));
  assert.equal(slides.intent, 'files');
  assert.equal(slides.files.kind, 'slide');
  assert.equal(heuristicPlan(turn('ขอข้อสอบเก่า COM5')).files.kind, 'pastpaper');
  assert.equal(heuristicPlan(turn('ขอข้อสอบ COM5 5 ข้อ')).intent, 'quiz');
  assert.equal(heuristicPlan(turn('เปิดคลังเอกสารวิชาระบาด')).intent, 'action');
  assert.equal(heuristicPlan(turn('ขอชีท PRRS')).files.kind, 'handout');
  assert.equal(heuristicPlan(turn('rabies ในสุนัขมีระยะฟักตัวเท่าไหร่')).intent, 'answer');
  assert.equal(fileKindIn('ขอตำรา pathology'), 'textbook');
  assert.equal(fileKindIn('ขอไฟล์'), 'any');
  const model = parsePlan(JSON.stringify({ intent: 'files', query_th: 'สไลด์ Avian 2.1', terms_en: ['avian influenza'], files: { kind: 'slide', title: 'Avian 2.1' } }), heuristicPlan(turn('ขอสไลด์ Avian 2.1')));
  assert.deepEqual(model.files, { kind: 'slide', title: 'Avian 2.1' });
  const junk = parsePlan(JSON.stringify({ intent: 'files', files: { kind: 'video' } }), heuristicPlan(turn('ขอสไลด์')));
  assert.equal(junk.files.kind, 'slide', 'an unknown kind falls back to what the words said');
});

/** A whole turn with the fake library and a fake writer. */
async function chatTurn(content, plan, lib) {
  const events = [];
  const sse = (lines) => new Response(new ReadableStream({ start(c) { for (const l of lines) c.enqueue(new TextEncoder().encode(l)); c.close(); } }), { headers: { 'Content-Type': 'text/event-stream' } });
  const fetchImpl = async (url, init) => (String(url).includes('api.deepseek.com')
    ? sse([`data: ${JSON.stringify({ choices: [{ delta: { content: 'ไฟล์แรกคือสไลด์ Rabies' } }] })}\n\n`, 'data: [DONE]\n\n'])
    : lib.fetchImpl(url, init));
  const log = console.log; const warn = console.warn;
  console.log = () => {}; console.warn = () => {};
  try {
    await runChat({ messages: turn(content), image: null, question: content }, {
      send: (event, data) => { events.push({ event, data }); return true; },
      env: ENV,
      deps: { chat: async () => ({ ok: true, text: JSON.stringify(plan) }), fetchImpl, kv: { get: async () => null, set: async () => {} } },
    });
  } finally { console.log = log; console.warn = warn; }
  return events;
}

test('a files turn: the card carries the files, before the short introduction', async () => {
  const events = await chatTurn('ขอสไลด์ rabies', { intent: 'files', query_th: 'ขอสไลด์ rabies', terms_en: ['rabies'], subjects: [], files: { kind: 'slide', title: '' } }, fakeLibrary({ search: SEARCH, docs: DOCS }));
  const names = events.map((e) => e.event);
  const card = events.find((e) => e.event === 'cards').data.items.find((c) => c.type === 'files');
  assert.ok(card && !card.related);
  assert.equal(card.items[0].title, 'Rabies');
  assert.ok(names.indexOf('cards') < names.indexOf('delta'));
  assert.equal(events.find((e) => e.event === 'sources').data.items.length, 0);
  assert.equal(events.find((e) => e.event === 'sources').data.covered, true);
  assert.equal(events.at(-1).event, 'done');
});

test('an answer turn: slide pages join the sources, their decks a related card', async () => {
  const lib = fakeLibrary({ search: SEARCH, docs: DOCS, pages: [{ doc_id: 'd1', page: 12, body: 'Negri bodies การวินิจฉัยโรคพิษสุนัขบ้า' }] });
  const events = await chatTurn('rabies วินิจฉัยยังไง', { intent: 'answer', query_th: 'วินิจฉัย rabies ยังไง', terms_en: ['rabies'], subjects: [] }, lib);
  const sources = events.find((e) => e.event === 'sources').data.items;
  const slide = sources.find((s) => s.kind === 'library');
  assert.ok(slide, 'a slide page is a citable source');
  assert.ok(slide.url.includes('/api/library-file?slug=rabies-com5') && slide.url.endsWith('#page=12'));
  const card = events.find((e) => e.event === 'cards').data.items.find((c) => c.type === 'files');
  assert.equal(card.related, true);
  assert.ok(card.items.length >= 1 && card.items.length <= 3);
});

test('needles arrive as objects: only real words become phrases, never "[object Object]"', () => {
  // the shape retrieve.js hands over: { thai } or { re }
  const needles = [{ re: /\bswine\b/gi }, { thai: 'เก่า' }, { thai: 'วิชา' }, { thai: 'สุกร' }];
  const phrases = searchPhrases({ terms: [], needles });
  assert.deepEqual(phrases, ['สุกร'], 'stop words skipped, the topic word kept');
  assert.ok(!phrases.some((p) => /object/.test(p)));
  assert.deepEqual(searchPhrases({ terms: [], needles: [{ re: /x/ }, { thai: 'โรค' }] }), [], 'no topic word, no search');
  const s = pageSource({ doc: { slug: 'a', title: 'Swine medicine.pdf', kind: 'pastpaper', subject: 'xyz' }, page: 3, body: 'Intro text. Swine fever is a viral disease of pigs.' }, { needles: [{ re: /\bswine fever\b/g }] });
  assert.equal(s.title, 'Swine medicine');
  assert.ok(s.snippet.startsWith('Intro text. Swine fever') || s.snippet.includes('Swine fever'));
});

test('two uploads of the same title are one file', async () => {
  const docs = [
    { id: 'a', slug: 'cfm-1', title: 'Canine and Feline Medicine (58-66).pdf', kind: 'handout', subject: 'vca', page_count: 72, byte_size: 1, mime: 'application/pdf' },
    { id: 'b', slug: 'cfm-2', title: 'Canine and Feline Medicine (58-66)', kind: 'handout', subject: 'vca', page_count: 78, byte_size: 1, mime: 'application/pdf' },
  ];
  const lib = fakeLibrary({ search: { distemper: [{ slug: 'cfm-1', page: 9, hits: 3, snippet: 'distemper' }, { slug: 'cfm-2', page: 10, hits: 3, snippet: 'distemper' }] }, docs });
  const r = await findFiles({ terms: ['distemper'], files: true }, { env: ENV, fetchImpl: lib.fetchImpl });
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].title, 'Canine and Feline Medicine (58-66)');
});

test('a syllabus that names the topic does not sit beside an answer', () => {
  const docs = [
    { slug: 'cdv', title: 'Canine Distemper', kind: 'slide', subject: 'com5', page_count: 28, hits: 7 },
    { slug: 'syl', title: 'course syllabus', kind: 'handout', subject: 'vet-path-2', page_count: 14, hits: 3 },
    { slug: 'wsava', title: 'WSAVA 2025 Vaccine Guideline', kind: 'guideline', subject: 'immuno', page_count: 40, hits: 11 },
  ];
  const ranked = rankFiles(docs, { terms: ['canine distemper'] });
  const syl = ranked.find((d) => d.slug === 'syl');
  assert.ok(syl.score < 3.5, `syllabus score ${syl.score.toFixed(2)} is under the floor`);
  assert.equal(ranked[0].slug, 'cdv');
});
