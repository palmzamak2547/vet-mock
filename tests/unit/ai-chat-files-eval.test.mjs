// ============================================================
// ai-chat files eval — the related-files card under an answer
// ============================================================
// Each case in tests/fixtures/ai-files-eval.json is a question as a student
// typed it on production, the plan the production planner made for it, and
// what the production study library answered for the phrases the route
// searched (titles, kinds, subjects, page counts and hit counts; no page
// text). The turn runs through the real pipeline with that library and a
// stub writer, so no network, and the card is read as the page would show it.
//
// Recorded 2026-10-28 from production after the 3 พ.ย. 69 decks were shelved:
// "ORT ในไก่ ... ควบคุมป้องกันอย่างไร" showed three epidemiology decks that
// ควบคุม found (two titled ควบคุม and ป้องกัน) and not the deck named for ORT.
// The plans were made again by the production planner (same prompt and
// model; the route does not log them) and the library rows read back for the
// phrases those plans search. The pyometra case takes its plan from
// ai-retrieval-eval.json: weighing words by specificity once put an
// entomology question set and a sample-collection lab, which only say
// ยาฆ่าเชื้อ, in place of the dog reproduction decks. Add a case whenever a
// card shows the wrong files; never loosen one. A card may show fewer files,
// never unrelated ones (`every`).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { runChat } from '../../api/_lib/ai/pipeline.js';

const cases = JSON.parse(readFileSync(new URL('../fixtures/ai-files-eval.json', import.meta.url), 'utf8'));
const ENV = { VITE_SUPABASE_URL: 'https://db.example', VITE_SUPABASE_ANON_KEY: 'anon', DEEPSEEK_API_KEY: 'test' };

/** The recorded library; a page asked for gets placeholder text (the fixture keeps none). */
function recordedLibrary({ search, docs }) {
  const bySlug = new Map(docs.map((d) => [d.slug, { ...d, id: d.slug, mime: 'application/pdf' }]));
  return async (url, init) => {
    const u = decodeURIComponent(String(url));
    if (u.includes('/rpc/library_search')) return Response.json(search[JSON.parse(init.body).q] || []);
    if (u.includes('/library_doc_pages')) {
      const asked = [...u.matchAll(/doc_id\.eq\.([^,)]+),page\.eq\.(\d+)/g)];
      return Response.json(asked.map(([, id, page]) => ({ doc_id: id, page: Number(page), body: `placeholder page text ${page}. `.repeat(20) })));
    }
    if (u.includes('/library_docs')) return Response.json([...u.matchAll(/"([^"]+)"/g)].map((m) => bySlug.get(m[1])).filter(Boolean));
    if (u.includes('api.deepseek.com')) {
      const body = `data: ${JSON.stringify({ choices: [{ delta: { content: 'คำตอบ' } }] })}\n\ndata: [DONE]\n\n`;
      return new Response(new Blob([body]).stream(), { headers: { 'Content-Type': 'text/event-stream' } });
    }
    return new Response('[]', { status: 404 });
  };
}

async function turn(c) {
  const events = [];
  const { log, warn } = console;
  console.log = () => {}; console.warn = () => {};
  try {
    await runChat({ messages: [{ role: 'user', content: c.q }], image: null, question: c.q }, {
      send: (event, data) => { events.push({ event, data }); return true; },
      env: ENV,
      deps: {
        chat: async () => ({ ok: true, text: JSON.stringify({ intent: 'answer', ...c.plan }) }),
        fetchImpl: recordedLibrary(c.library),
        kv: { get: async () => null, set: async () => {} },
      },
    });
  } finally { console.log = log; console.warn = warn; }
  const card = events.filter((e) => e.event === 'cards').flatMap((e) => e.data.items).find((x) => x.type === 'files');
  const sources = events.find((e) => e.event === 'sources')?.data.items || [];
  return { card: card?.items || [], library: sources.filter((s) => s.kind === 'library') };
}

for (const c of cases) {
  test(c.q, { todo: c.todo || false }, async () => {
    const { card, library } = await turn(c);
    const shown = card.map((f) => `${f.slug} | ${f.title}`).join('\n');
    assert.equal(card[0]?.slug, c.first, `expected ${c.first} first, the card shows:\n${shown}`);
    // `cites`: the slide page the answer quotes first comes from this document
    if (c.cites) assert.match(library[0]?.title || '', new RegExp(c.cites, 'i'), `cited: ${library.map((s) => s.title).join(' | ')}`);
    // `never`: a document that must not be on the card at all
    if (c.never) assert.ok(!card.some((f) => new RegExp(c.never, 'i').test(f.title)), `shows ${c.never}:\n${shown}`);
    // `every`: what each file on the card is about, as a student would expect
    if (c.every) assert.ok(card.every((f) => new RegExp(c.every, 'i').test(f.title)), `not all ${c.every}:\n${shown}`);
  });
}
