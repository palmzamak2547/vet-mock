// ============================================================
// wiki-search-parity.test.mjs — the Wiki search reads a prebuilt index
// ============================================================
// The first word typed into the VetWiki search box used to fetch every
// subject's note chunk and evidence chunk (56 chunks, about 1.8 MB compressed
// and 7.6 MB of script) and run all 208 articles through noteToKnowledge on
// the phone's main thread, holding about 27 MB more memory, only to build the
// text the search matches against. That text depends on nothing the student
// does, so the regen step now writes it once per subject
// (search-index-subject-*.generated.js) and the search reads that instead.
//
// The old in-browser pass is frozen below, verbatim, as the oracle. The new
// search must give identical ordered results, section ids, inTitle flags and
// incompleteSubjects counts, and a first search must never load a note body,
// an evidence chunk or the article adapter.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(process.cwd());
const moduleUrl = (rel) => pathToFileURL(resolve(ROOT, rel)).href;
const RUNTIME_SEARCH = moduleUrl('src/lib/vetwiki/runtime-search.js');

// ---- The oracle: runtime-search.js as it was before the index existed ----
// Only change: loadTopic is a parameter, so a failed subject can be simulated.

function flattenBody(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) {
      for (const bullet of item.bullets) {
        out.push(typeof bullet === 'string' ? bullet : `${bullet.label} ${bullet.value}`);
      }
    }
    if (item.sub) { out.push(item.sub); flattenBody(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      for (const heading of item.table.headers || []) out.push(heading);
      for (const row of item.table.rows || []) for (const cell of row) out.push(cell);
    }
  }
  return out;
}

const normalize = (value) => String(value || '')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .toLocaleLowerCase();

async function createOracle(loadTopicOverride) {
  const runtime = await import(moduleUrl('src/lib/vetwiki/runtime.js'));
  const { listTopics } = runtime;
  const loadTopic = loadTopicOverride || runtime.loadTopic;
  const cache = new Map();

  async function indexTopic(topic) {
    if (cache.has(topic.id)) return cache.get(topic.id);
    const knowledge = await loadTopic(topic.subject, topic.topic);
    if (!knowledge) return null;
    const entry = {
      sections: knowledge.sections.map((section) => ({
        id: section.id,
        heading: section.heading,
        text: normalize([
          section.heading,
          ...flattenBody(section.body),
          ...(section.claims || []).map((claim) => claim.statement),
        ].join(' \n ')),
      })),
    };
    cache.set(topic.id, entry);
    return entry;
  }

  async function searchTopics(query) {
    const normalized = normalize(query).trim();
    const topics = listTopics();
    if (!normalized) {
      return topics.map((topic) => ({ topic, matchedSections: [], inTitle: false }));
    }
    const failedSubjects = new Set();
    const indexed = await Promise.all(topics.map(async (topic) => ({
      topic,
      index: await indexTopic(topic).catch(() => { failedSubjects.add(topic.subject); return null; }),
    })));
    const results = [];
    for (const { topic, index } of indexed) {
      if (!index) continue;
      const inTitle = normalize(topic.title).includes(normalized)
        || normalize(topic.summary).includes(normalized);
      const matchedSections = index.sections
        .filter((section) => section.text.includes(normalized))
        .map((section) => ({ id: section.id, heading: section.heading }));
      if (inTitle || matchedSections.length > 0) {
        results.push({ topic, matchedSections, inTitle });
      }
    }
    results.sort((a, b) => (Number(b.inTitle) - Number(a.inTitle))
      || (b.matchedSections.length - a.matchedSections.length));
    Object.defineProperty(results, 'incompleteSubjects', { value: failedSubjects.size });
    return results;
  }

  return { searchTopics, indexTopic, listTopics, loadTopic: runtime.loadTopic };
}

let oraclePromise = null;
const oracle = () => (oraclePromise ||= createOracle());

// ---- Queries ----------------------------------------------------------------

const FIXED_QUERIES = [
  // English, including case, padding and emphasis markers the old pass stripped
  'rabies', 'RABIES', '  Rabies  ', '**rabies**', 'rabies vaccine', 'vaccine',
  'protozoa', 'salmonella', 'mastitis', 'e. coli', 'pcr', 'elisa', 'diagnosis',
  'treatment', 'biosecurity', 'one health', 'haccp', 'aflatoxin', 'newcastle',
  'avian influenza', 'strangles', 'colic', 'babesia', 'brucella', 'leptospira',
  'anthrax', 'tuberculosis', 'asf', 'pcv2', 'ketamine', 'xylazine',
  'cryptosporidium', 'giardia', 'mycoplasma', 'endometritis', 'thalamus',
  'paraphrasing', 'dog', 'cat',
  // Thai
  'พิษสุนัขบ้า', 'วัคซีน', 'ไข้หวัดนก', 'เต้านมอักเสบ', 'วัณโรค', 'ยาสลบ',
  'การรักษา', 'อาการ', 'สุกร', 'ม้า', 'ไก่', 'ปลา', 'โค', 'นม', 'เนื้อ',
  'ปรสิต', 'เชื้อ', 'การวินิจฉัย', 'ภูมิคุ้มกัน',
  // Degenerate input
  '', '   ', 'xyzzy-no-such-vetwiki-term', 'a', 'ก', '*', '(', '1', '%', '-',
];

/** Queries cut from article bodies and claim statements, so section-only and
 *  claim-only hits are exercised with text no title contains. Deterministic. */
async function derivedQueries() {
  const { listTopics, loadTopic } = await oracle();
  const topics = listTopics();
  const titles = topics.map((t) => `${normalize(t.title)} ${normalize(t.summary)}`);
  const inAnyTitle = (q) => titles.some((t) => t.includes(q));
  const bodyOnly = [];
  let claimOnly = null;
  for (let i = 0; i < topics.length; i += 1) {
    const topic = topics[i];
    const knowledge = await loadTopic(topic.subject, topic.topic);
    for (const [s, section] of knowledge.sections.entries()) {
      const pieces = flattenBody(section.body).map((p) => normalize(p).trim()).filter((p) => p.length >= 16);
      if (i % 9 === 0 && s === 1 && pieces.length) {
        const piece = pieces[Math.floor(pieces.length / 2)];
        const start = Math.floor(piece.length / 3);
        const q = piece.slice(start, start + 10).trim();
        if (q && !inAnyTitle(q)) bodyOnly.push(q);
      }
      if (!claimOnly && (section.claims || []).length) {
        const bodyText = normalize([section.heading, ...flattenBody(section.body)].join(' \n '));
        for (const claim of section.claims) {
          const statement = normalize(claim.statement);
          for (let at = 0; at + 14 <= statement.length && !claimOnly; at += 7) {
            const q = statement.slice(at, at + 14).trim();
            if (q.length >= 10 && !bodyText.includes(q) && !inAnyTitle(q)) {
              claimOnly = { query: q, sectionId: section.id, topicId: topic.id };
            }
          }
        }
      }
    }
  }
  return { bodyOnly, claimOnly };
}

// ---- Tests ------------------------------------------------------------------

test('a first search never loads a note body, an evidence chunk or the article adapter', () => {
  // A fresh process, so nothing an earlier test imported can hide a load.
  const script = `
    import { registerHooks } from 'node:module';
    const seen = [];
    registerHooks({
      resolve(specifier, context, nextResolve) {
        const resolved = nextResolve(specifier, context);
        seen.push(resolved.url);
        return resolved;
      },
    });
    const { searchTopics } = await import(${JSON.stringify(RUNTIME_SEARCH)});
    const results = await searchTopics('rabies');
    const thai = await searchTopics('พิษสุนัขบ้า');
    process.stdout.write(JSON.stringify({
      hits: results.length, thaiHits: thai.length,
      incomplete: results.incompleteSubjects, seen,
    }));
  `;
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  assert.equal(run.status, 0, run.stderr);
  const { hits, thaiHits, incomplete, seen } = JSON.parse(run.stdout);
  const corpus = seen.filter((url) => /\/src\/data\/notes-|\/vetwiki\/runtime-adapter\.js$|\/vetwiki\/adapter\.js$|\/vetwiki\/runtime-data\//.test(url));
  assert.deepEqual(corpus, [],
    'the search box must not fetch the note corpus or adapt articles to build its text');
  assert.ok(hits > 0 && thaiHits > 0, 'and it must still find rabies in English and Thai');
  assert.equal(incomplete, 0);
});

test('the prebuilt index holds exactly the text the article pass built, for every topic', async () => {
  const { listTopics, indexTopic } = await oracle();
  const { loadSearchIndex } = await import(moduleUrl('src/lib/vetwiki/search-index-loaders.generated.js'));
  const bySubject = new Map();
  for (const topic of listTopics()) {
    if (!bySubject.has(topic.subject)) bySubject.set(topic.subject, await loadSearchIndex(topic.subject));
    const expected = await indexTopic(topic);
    const rows = bySubject.get(topic.subject)[topic.id];
    assert.ok(rows, `no search index entry for ${topic.id}`);
    const actual = { sections: rows.map(([id, heading, text]) => ({ id, heading, text })) };
    assert.deepEqual(actual, expected, `search index drifted for ${topic.id}; run npm run regen:wiki-runtime`);
  }
});

test('40+ Thai and English queries give the same ordered results as the article pass', async () => {
  const { searchTopics: before } = await oracle();
  const { searchTopics: after } = await import(RUNTIME_SEARCH);
  const { bodyOnly, claimOnly } = await derivedQueries();
  assert.ok(bodyOnly.length >= 10, `expected body-cut queries, got ${bodyOnly.length}`);
  assert.ok(claimOnly, 'expected a query only a verified claim statement contains');
  const queries = [...FIXED_QUERIES, ...bodyOnly, claimOnly.query];
  assert.ok(queries.length >= 40);
  assert.ok(queries.includes('rabies') && queries.includes('พิษสุนัขบ้า'));

  let sectionOnlyHits = 0;
  for (const query of queries) {
    const [expected, actual] = await Promise.all([before(query), after(query)]);
    assert.deepEqual(actual, expected, `results differ for ${JSON.stringify(query)}`);
    assert.equal(actual.incompleteSubjects, expected.incompleteSubjects, `incompleteSubjects differs for ${JSON.stringify(query)}`);
    sectionOnlyHits += actual.filter((r) => !r.inTitle && r.matchedSections.length > 0).length;
  }
  assert.ok(sectionOnlyHits > 0, 'the set must exercise hits found only inside article sections');

  const claimHit = (await after(claimOnly.query)).find((r) => r.topic.id === claimOnly.topicId);
  assert.ok(claimHit?.matchedSections.some((s) => s.id === claimOnly.sectionId),
    'verified claim statements are searchable, as they were');
});

test('a subject that fails to load is counted once, as before, and the next search recovers it', async () => {
  const { createSearchTopics } = await import(RUNTIME_SEARCH);
  const { loadSearchIndex } = await import(moduleUrl('src/lib/vetwiki/search-index-loaders.generated.js'));
  const { loadTopic } = await oracle();
  const down = new Set(['com5']);
  const calls = new Map();
  const after = createSearchTopics((subject) => {
    calls.set(subject, (calls.get(subject) || 0) + 1);
    return down.has(subject) ? Promise.reject(new Error('Failed to fetch dynamically imported module')) : loadSearchIndex(subject);
  });
  const { searchTopics: before } = await createOracle((subject, topic) => (
    down.has(subject) ? Promise.reject(new Error('Failed to fetch dynamically imported module')) : loadTopic(subject, topic)
  ));

  for (const query of ['rabies', 'พิษสุนัขบ้า', 'vaccine']) {
    const [expected, actual] = await Promise.all([before(query), after(query)]);
    assert.deepEqual(actual, expected, `partial results differ for ${query}`);
    assert.equal(expected.incompleteSubjects, 1);
    assert.equal(actual.incompleteSubjects, 1, 'one failed subject is one subject, not one per article');
  }

  // Connection back: the in-place retry (ค้นอีกครั้ง while offline re-runs
  // the search) must ask for the failed subject again, not replay the failure.
  down.clear();
  const { searchTopics: full } = await oracle();
  const recovered = await after('rabies');
  assert.deepEqual(recovered, await full('rabies'));
  assert.equal(recovered.incompleteSubjects, 0);
  assert.equal(calls.get('com5'), 4, 'the failed subject is requested again once it can load');
  assert.equal(calls.get('com4'), 1, 'a subject that loaded is not requested again');
});

test('searches in flight together share one request per subject', async () => {
  const { createSearchTopics } = await import(RUNTIME_SEARCH);
  const { loadSearchIndex } = await import(moduleUrl('src/lib/vetwiki/search-index-loaders.generated.js'));
  const calls = new Map();
  const search = createSearchTopics((subject) => {
    calls.set(subject, (calls.get(subject) || 0) + 1);
    return loadSearchIndex(subject);
  });
  await Promise.all([search('r'), search('ra'), search('rab'), search('พิษ')]);
  assert.ok(calls.size > 1);
  for (const [subject, count] of calls) assert.equal(count, 1, `${subject} was requested ${count} times`);
});
