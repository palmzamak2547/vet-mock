#!/usr/bin/env node
// Evidence-backed links from study-library PAGES to curriculum topics.
//
//   node scripts/library-links.mjs propose   -> .library-links/proposal.{json,md}
//   node scripts/library-links.mjs apply     -> writes the proposal's links
//   node scripts/library-links.mjs selftest
//
// Env: SUPABASE_ACCESS_TOKEN (Management API PAT for mpovsdzdggvksmeehqfj).
//
// How a link is made (method 'term', reviewed = false):
// 1. Each topic label in src/data/curriculum.js is cut into terms
//    ("CVE — CPV / CCV" -> CVE, CPV, CCV). Generic words and lesson labels
//    ("Lab", "คาบ 15-16", "ทั่วไป") are dropped; see termsFor().
// 2. A term matches a page of a document of the SAME subject, as a whole word
//    for Latin terms and as a substring for Thai ones (Thai has no spaces).
// 3. A one-word term found in more than 80% of a subject's documents (10+)
//    says nothing about any of them and is dropped for that subject. A page
//    naming 5+ of the subject's topics (schedule, syllabus, contents) is skipped.
// 4. Per topic, the 8 documents matching the most of its terms (then the most
//    pages) are kept, with up to 5 pages each.
// The evidence is cut from the page's own stored text in SQL, and a trigger on
// library_doc_links refuses any row whose evidence is not on that page.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.library-links');
const REF = 'mpovsdzdggvksmeehqfj';
const DOCS_PER_TOPIC = 8;
const PAGES_PER_DOC = 5;
const MAX_DF = 0.8;
const LISTING_TOPICS = 5;
const BATCH_BYTES = 500_000; // Management API rejects bodies above ~1-2 MB

const STOP = new Set([
  'lab', 'lecture', 'lect', 'exam', 'intro', 'introduction', 'overview', 'general', 'basic', 'basics',
  'review', 'summary', 'part', 'others', 'other', 'misc', 'principles', 'principle', 'concept', 'concepts',
  'disease', 'diseases', 'disorder', 'disorders', 'management', 'treatment', 'diagnosis', 'animal', 'animals',
  'clinical', 'practice', 'practical', 'case', 'cases', 'session', 'week', 'midterm', 'final', 'quiz',
  'guidelines', 'guideline', 'exercise', 'small', 'large', 'and', 'system', 'systems', 'medicine', 'veterinary', 'module', 'unit', 'chapter',
  'ทั่วไป', 'อื่นๆ', 'อื่น ๆ', 'บทนำ', 'ภาพรวม', 'สรุป', 'เอกสาร', 'ปฏิบัติการ', 'ข้อสอบ', 'ทบทวน',
]);
const THAI = /[฀-๿]/;

// Topic label -> distinct match terms. Pure, covered by selftest.
export function termsFor(label) {
  let s = String(label || '')
    .replace(/^\s*(lab|lecture|lect)\s*[—–-]\s*/i, '')
    .replace(/คาบ\s*[\d\s\-–,]+[,:]?/g, ' ')
    .replace(/\b\d{1,2}\s*[A-Za-z]{3}\s*\d{2,4}\b/g, ' ') // 11Aug23
    .replace(/\b(19|20)\d{2}\b/g, ' ');
  const out = new Set();
  // "and" stays inside a piece ("Head and neck"); "&", "/", "," and "vs" split.
  for (let piece of s.split(/[—–/&+,;:()|[\]]|\s-\s|\s+vs\.?\s+/i)) {
    piece = piece.replace(/\s+/g, ' ').trim()
      .replace(/^[\d.\-\s]+/, '').replace(/[\s.\-]+$/, '')
      .replace(/\s+(?:I{1,3}|IV|VI{0,3}|\d+)$/, '') // "Lymphatic System I" -> "Lymphatic System"
      .trim();
    if (!piece) continue;
    const words = piece.split(' ');
    // Drop generic words at either end ("Feline URI" stays, "Lab Bone" -> "Bone").
    while (words.length && STOP.has(words[0].toLowerCase())) words.shift();
    while (words.length && STOP.has(words[words.length - 1].toLowerCase())) words.pop();
    const t = words.join(' ');
    if (!t || STOP.has(t.toLowerCase()) || /^[\d\s\p{P}\p{S}]+$/u.test(t)) continue;
    if (words.length > 5) continue; // a sentence, not a term
    if (THAI.test(t)) { if (t.length >= 4) out.add(t); continue; }
    // Latin: one word needs 5+ letters, or is an acronym of 3+ capitals.
    if (words.length === 1 && t.length < 5 && !/^[A-Z][A-Z0-9]{2,}$/.test(t)) continue;
    out.add(t);
  }
  return [...out];
}

// The regex Postgres runs (~* / regexp_instr 'i'): whole word for Latin.
export function patternFor(term) {
  const esc = term.replace(/[.^$*+?()[\]{}|\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return THAI.test(term) ? esc : `\\m${esc}\\M`;
}

function selftest() {
  const eq = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} != ${JSON.stringify(b)}`); };
  eq(termsFor('CVE — CPV / CCV'), ['CVE', 'CPV', 'CCV']);
  eq(termsFor('Sporotrichosis & Cryptococcosis'), ['Sporotrichosis', 'Cryptococcosis']);
  eq(termsFor('คาบ 15-16, Neuro Exam + Localization'), ['Neuro', 'Localization']);
  eq(termsFor('Lab — ทั่วไป'), []);
  eq(termsFor('Lecture — Amino acid & protein'), ['Amino acid', 'protein']);
  eq(termsFor('Cytology Lab 11Aug23'), ['Cytology']);
  eq(termsFor('Bone'), []);
  eq(termsFor('Head and neck II'), ['Head and neck']);
  eq(termsFor('Lymphatic System I'), ['Lymphatic']);
  eq(termsFor('Small vs large bowel diarrhea'), ['bowel diarrhea']);
  eq(termsFor('Lab Exercise 1'), []);
  eq(termsFor('Vaccine guidelines (WSAVA/VPAT)'), ['Vaccine', 'WSAVA', 'VPAT']);
  eq(termsFor('Lab — เครื่องมือ/เทคนิคพื้นฐาน'), ['เครื่องมือ', 'เทคนิคพื้นฐาน']);
  eq(patternFor('Amino acid'), '\\mAmino\\s+acid\\M');
  eq(patternFor('C. perfringens'), '\\mC\\.\\s+perfringens\\M');
  eq(patternFor('ไข้หวัดนก'), 'ไข้หวัดนก');
  console.log('selftest ok');
}

const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

async function sql(query) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error('missing env SUPABASE_ACCESS_TOKEN');
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'vetmock-library-links' },
      body: JSON.stringify({ query }),
    });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt)); continue; }
    throw new Error(`SQL ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
}

async function loadTopics() {
  const { SUBJECTS_BY_YEAR } = await import('../src/data/curriculum.js');
  const topics = [];
  for (const subs of Object.values(SUBJECTS_BY_YEAR)) for (const s of subs) for (const t of s.topics || []) {
    if (t.hidden) continue;
    topics.push({ target: `${s.id}/${t.id}`, subject: s.id, label: t.label, terms: termsFor(t.label) });
  }
  return topics;
}

async function propose() {
  const topics = await loadTopics();
  const bySubject = new Map();
  for (const t of topics) { if (!bySubject.has(t.subject)) bySubject.set(t.subject, []); bySubject.get(t.subject).push(t); }

  const links = [];
  let listingPages = 0;
  const dropped = [];
  const perTopic = [];
  for (const [subject, list] of bySubject) {
    // One query per spelling: "Epithelium" and "epithelium" are one term.
    const terms = [...new Map(list.flatMap((t) => t.terms).map((x) => [x.toLowerCase(), x])).values()];
    if (!terms.length) continue;
    const [{ n }] = await sql(`select count(*)::int as n from library_docs where subject = ${lit(subject)}
      and status in ('public','restricted') and text_status in ('ok','partial')`);
    if (!n) continue;
    const rows = await sql(`
      with t(term, pat) as (values ${terms.map((x) => `(${lit(x)}, ${lit(patternFor(x))})`).join(',')}),
      m as (
        select t.term, p.doc_id, p.page
        from t
        join library_doc_pages p on p.body ~* t.pat
        join library_docs d on d.id = p.doc_id
        where d.subject = ${lit(subject)} and d.status in ('public','restricted') and d.text_status in ('ok','partial')
      )
      select m.term, m.doc_id, d.slug, d.title, count(*)::int as pages, array_agg(m.page order by m.page) as all_pages
      from m join library_docs d on d.id = m.doc_id
      group by m.term, m.doc_id, d.slug, d.title`);
    const df = new Map();
    for (const r of rows) df.set(r.term, (df.get(r.term) || 0) + 1);
    const generic = new Set([...df].filter(([t, c]) => !t.includes(' ') && n >= 10 && c / n > MAX_DF).map(([t]) => t));
    for (const t of generic) dropped.push({ subject, term: t, docs: df.get(t), of: n });

    // A page naming many of the subject's topics is a schedule, syllabus or
    // contents page: true words, but no help to someone studying one topic.
    const topicsOnPage = new Map();
    for (const topic of list) {
      const own = new Set(topic.terms.map((x) => x.toLowerCase()));
      const seen = new Set();
      for (const r of rows) if (own.has(r.term.toLowerCase())) for (const pg of r.all_pages) seen.add(`${r.doc_id}:${pg}`);
      for (const k of seen) topicsOnPage.set(k, (topicsOnPage.get(k) || 0) + 1);
    }
    const listing = new Set([...topicsOnPage].filter(([, c]) => c >= LISTING_TOPICS).map(([k]) => k));
    listingPages += listing.size;

    for (const topic of list) {
      const docs = new Map();
      for (const r of rows) {
        if (!topic.terms.some((x) => x.toLowerCase() === r.term.toLowerCase()) || generic.has(r.term)) continue;
        const pagesHere = r.all_pages.filter((pg) => !listing.has(`${r.doc_id}:${pg}`));
        if (!pagesHere.length) continue;
        const d = docs.get(r.doc_id) || { doc_id: r.doc_id, slug: r.slug, title: r.title, terms: new Set(), pages: 0, pageTerms: new Map() };
        d.terms.add(r.term);
        d.pages += pagesHere.length;
        for (const pg of pagesHere) {
          const prev = d.pageTerms.get(pg);
          if (!prev || r.term.length > prev.length) d.pageTerms.set(pg, r.term);
        }
        docs.set(r.doc_id, d);
      }
      // A document whose own title names the topic comes first; then the one
      // matching more of the topic's terms, then more pages.
      const own = topic.terms.map((x) => x.toLowerCase());
      for (const d of docs.values()) d.titled = own.some((x) => String(d.title).toLowerCase().includes(x)) ? 1 : 0;
      const ranked = [...docs.values()].sort((a, b) => b.titled - a.titled || b.terms.size - a.terms.size || b.pages - a.pages || a.slug.localeCompare(b.slug))
        .slice(0, DOCS_PER_TOPIC);
      perTopic.push({ target: topic.target, label: topic.label, terms: topic.terms, docs: ranked.length });
      for (const [rank, d] of ranked.entries()) {
        for (const [page, term] of [...d.pageTerms].sort((a, b) => a[0] - b[0]).slice(0, PAGES_PER_DOC)) {
          links.push({ target: topic.target, doc_id: d.doc_id, slug: d.slug, title: d.title, page, term, rank: rank + 1 });
        }
      }
    }
    process.stdout.write(`${subject}: ${n} docs, ${terms.length} terms, ${generic.size} generic, ${rows.length} term-doc hits\n`);
  }

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'proposal.json'), JSON.stringify({ at: new Date().toISOString(), links, dropped, perTopic }, null, 1));
  const linked = perTopic.filter((t) => t.docs > 0);
  const noTerms = topics.filter((t) => !t.terms.length);
  const sample = [];
  for (let i = 0; i < linked.length && sample.length < 40; i += Math.max(1, Math.floor(linked.length / 40))) sample.push(linked[i]);
  const md = [
    `# Library page links, proposal (${new Date().toISOString()})`, '',
    `- Topics: ${topics.length} (no usable term: ${noTerms.length})`,
    `- Topics with at least one document: ${linked.length}`,
    `- Links (page-level): ${links.length}, documents: ${new Set(links.map((l) => l.doc_id)).size}`,
    `- Terms dropped as generic (one word, in >${MAX_DF * 100}% of a subject's 10+ documents): ${dropped.length}`,
    `- Pages skipped as listings (naming ${LISTING_TOPICS}+ topics of the subject): ${listingPages}`, '',
    '## Dropped generic terms', '', ...dropped.map((d) => `- ${d.subject}: "${d.term}" in ${d.docs}/${d.of}`), '',
    '## Sample topics', '',
    ...sample.flatMap((t) => [`### ${t.target} (${t.label})`, `terms: ${t.terms.join(', ')}`, '',
      ...links.filter((l) => l.target === t.target).slice(0, 6).map((l) => `- ${l.title} p.${l.page}, "${l.term}"`), '']),
    '## Topics with no usable term', '', ...noTerms.map((t) => `- ${t.target}: ${t.label}`),
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'proposal.md'), md);
  console.log(`proposal: ${links.length} links, ${linked.length}/${topics.length} topics -> ${path.relative(ROOT, OUT)}`);
}

async function apply() {
  const { links } = JSON.parse(fs.readFileSync(path.join(OUT, 'proposal.json'), 'utf8'));
  let batch = []; let bytes = 0; let written = 0;
  const flush = async () => {
    if (!batch.length) return;
    // Evidence is cut from the page itself around the term's first whole-word
    // match; the strpos filter keeps the trigger from failing a whole batch.
    const [{ n }] = await sql(`
      with v(doc_id, page, target, term, pat, rank) as (values ${batch.join(',')}),
      e as (
        select v.*, p.body, regexp_instr(p.body, v.pat, 1, 1, 0, 'i') as at
        from v join library_doc_pages p on p.doc_id = v.doc_id::uuid and p.page = v.page
      ),
      ins as (
        insert into library_doc_links (doc_id, page, target_kind, target_id, term, evidence, method, reviewed, rank)
        select doc_id::uuid, page, 'topic', target, term,
          substr(body, greatest(1, at - 60), length(term) + 120), 'term', false, rank
        from e
        where at > 0 and strpos(lower(substr(body, greatest(1, at - 60), length(term) + 120)), lower(term)) > 0
        on conflict do nothing
        returning 1
      )
      select count(*)::int as n from ins`);
    written += n; batch = []; bytes = 0;
    process.stdout.write(`\rwritten ${written}`);
  };
  for (const l of links) {
    const row = `(${lit(l.doc_id)}, ${l.page}, ${lit(l.target)}, ${lit(l.term)}, ${lit(patternFor(l.term))}, ${l.rank})`;
    bytes += Buffer.byteLength(row);
    batch.push(row);
    if (bytes > BATCH_BYTES) await flush();
  }
  await flush();
  console.log(`\napplied ${written} of ${links.length} proposed`);
}

const cmd = process.argv[2];
if (cmd === 'selftest') selftest();
else if (cmd === 'propose') { selftest(); await propose(); }
else if (cmd === 'apply') await apply();
else { console.error('usage: library-links.mjs propose|apply|selftest'); process.exit(1); }
