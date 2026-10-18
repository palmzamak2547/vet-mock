#!/usr/bin/env node
// Builds the VCA site's question bank from the main app's banks, before every dev or build run.
//
// Reads (never writes) ../src: the bank registry, the fail-closed delivery gate, the curriculum's
// subject and topic names, the bookplate registry and the VCA source inventory. Writes, all
// git-ignored:
//   public/bank/<domain>.index.<hash>.json   per domain: every question's key, source, topic and
//                                       place, no text (a few KB), fetched by whatever draws a set
//   public/bank/<domain>-<n>.<hash>.json     per domain, shards of SHARD_SIZE questions each in full,
//                                       fetched only when one of their questions is wanted
//                                       (scripts/bank-shards.mjs, src/lib/bank-index.js)
//   public/q/…                          figures a question points at by path, copied as they are
//   src/generated/bank.js               counts, domain cards, subject names, hero samples
//   src/generated/catalog.js            per domain: its topic counts, the subjects behind it and the
//                                       topic rows its page lists (names cleaned in lib/topic-label.js)
//   src/generated/library.js            the VCA documents, shelved by field
//
// Only learner-ready multiple-choice questions enter: the same isQuestionDeliverable gate the
// main app uses, so a question held for answer or figure review is never served here either.
//
// Usage: node scripts/build-bank.mjs [--quiet]
//
// Importing this file runs the build (it is a script), and exports what it made so a test can
// check the files against it: DOMAIN_ITEMS, each domain's records in bank order, exactly what the
// per-domain file used to hold.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SHARD_SIZE, shardDomain } from './bank-shards.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..');
const REPO = path.resolve(APP, '..');
const QUIET = process.argv.includes('--quiet') || process.env.VCA_BUILD_QUIET === '1';

/** @type {Map<string, object[]>} domain id -> its question records, as written into its shards */
export const DOMAIN_ITEMS = new Map();
const load = (rel) => import(pathToFileURL(path.join(REPO, rel)).href);

const { BANK_REGISTRY } = await load('src/data/bank-registry.generated.js');
const { isQuestionDeliverable, BLOCKED_QUESTIONS } = await load('src/data/question-delivery.generated.js');
const { SUBJECTS } = await load('src/data/curriculum.js');
const { SUBJECT_COVERS } = await load('src/data/subject-covers.js');
const { VCA_MATERIALS } = await load('src/data/vca-materials.js');
const { isPastPaperQuestion, isExamAlignedQuestion } = await load('src/lib/question-metadata.js');
const { DOMAINS, FAMILIES, EXCLUDED_SUBJECTS, MAPPED_SUBJECTS, domainOf, thPlain } = await import(pathToFileURL(path.join(APP, 'src/data/domains.js')).href);
const { DISCIPLINES, GENERAL_SHELF, shelfOf, yearsOf, formatOf } = await import(pathToFileURL(path.join(APP, 'src/data/disciplines.js')).href);
const { topicRows, TOPICS_LISTED } = await import(pathToFileURL(path.join(APP, 'src/lib/topic-label.js')).href);

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ── read every bank once ───────────────────────────────────────────────────────────────────
const all = [];
for (const bank of BANK_REGISTRY) {
  const questions = await bank.load();
  if (!Array.isArray(questions)) throw new Error(`bank ${bank.file} did not load as a list`);
  for (const q of questions) all.push(q);
}

/** Why a question stays out, or null when it can be served as a VCA-style item. */
export function rejection(q) {
  if (!isQuestionDeliverable(q)) return 'held';
  if ((q.type || 'mcq') !== 'mcq') return 'type';
  if (!Array.isArray(q.options) || q.options.length < 2) return 'type';
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) return 'answer';
  if (!String(q.q || '').trim()) return 'empty';
  if (q.options.some((o) => typeof o !== 'string' || !o.trim())) return 'answer';
  if (q.passage) return 'passage';
  return null;
}

function kindOf(q) {
  // The VCA bank is VCA guidance, except the papers students recalled after sitting the exam.
  if (q.subject === 'vca') return isPastPaperQuestion(q) ? 'paper' : 'vca';
  if (isPastPaperQuestion(q)) return 'paper';
  if (isExamAlignedQuestion(q)) return 'aligned';
  if (/^lecture/.test(q.sourceType || '')) return 'lecture';
  return 'course';
}

// A figure the question points at by path is copied next to the bank; inline SVG stays inline.
// Directories are updated in place: new files written, stale ones removed afterwards. Deleting
// and recreating them under a running dev server left its public-file watcher serving the
// page shell for every bank URL.
const FIG_DIR = path.join(APP, 'public', 'q');
const written = new Set();
function prune(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) if (!written.has(path.join(dir, name))) fs.rmSync(path.join(dir, name), { force: true });
}
function writeIfChanged(file, bytes) {
  written.add(file);
  if (fs.existsSync(file) && Buffer.compare(fs.readFileSync(file), Buffer.from(bytes)) === 0) return;
  fs.writeFileSync(file, bytes);
}
const figures = new Map();
function figure(src) {
  if (typeof src !== 'string' || !src) return undefined;
  if (src.startsWith('data:image/')) return src;
  if (!src.startsWith('/')) return undefined;
  if (figures.has(src)) return figures.get(src);
  const from = path.join(REPO, 'public', src.replace(/^\//, ''));
  if (!fs.existsSync(from)) throw new Error(`figure ${src} is referenced by a deliverable question but missing`);
  const bytes = fs.readFileSync(from);
  const ext = path.extname(from).toLowerCase();
  const name = `${path.basename(from, ext).replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.${sha(bytes).slice(0, 10)}${ext}`;
  fs.mkdirSync(FIG_DIR, { recursive: true });
  writeIfChanged(path.join(FIG_DIR, name), bytes);
  figures.set(src, `/q/${name}`);
  return `/q/${name}`;
}

// Links in provenance text: public pages stay links; a Drive file is the collection's private
// copy, so it is named, never linked from this public site, and its address is left out of the
// text the site ships as well.
const DRIVE_URL = /\s*;?\s*https?:\/\/(?:drive|docs)\.google\.com\/[^\s,;)]*/g;
// Drive links go (they need a sign-in); so do the separators a removed link or a file name
// left at either end ("-swine herd mid….pdf").
const scrub = (text) => String(text).replace(DRIVE_URL, '').replace(/^[\s;,:|\-–—]+/, '').replace(/[\s;,:|\-–—]+$/, '').trim();

function refsOf(q) {
  const list = Array.isArray(q.verificationSources) ? q.verificationSources : [];
  return list.map((r) => {
    const url = typeof r?.url === 'string' && /^https:\/\//.test(r.url) && !/(?:drive|docs)\.google\.com/.test(r.url) ? r.url : undefined;
    return { title: String(r?.title || '').trim(), locator: r?.locator ? String(r.locator) : undefined, url };
  }).filter((r) => r.title);
}

const ready = [];
const out = { held: 0, type: 0, answer: 0, empty: 0, passage: 0 };
const excludedBySubject = {};
const unmapped = {};
for (const q of all) {
  const inScope = MAPPED_SUBJECTS.includes(q.subject);
  if (!inScope) {
    // Counted as the main app counts them: learner-ready questions only.
    if (!isQuestionDeliverable(q)) continue;
    if (EXCLUDED_SUBJECTS[q.subject]) excludedBySubject[q.subject] = (excludedBySubject[q.subject] || 0) + 1;
    else unmapped[q.subject] = (unmapped[q.subject] || 0) + 1;
    continue;
  }
  const why = rejection(q);
  if (why) { out[why] += 1; continue; }
  const domain = domainOf(q);
  if (!domain) { unmapped[`${q.subject}/${q.topic || '?'}`] = (unmapped[`${q.subject}/${q.topic || '?'}`] || 0) + 1; continue; }
  ready.push({ q, domain });
}

// ── names the cards and the review panel show ──────────────────────────────────────────────
const subjectNames = {};
const topicNames = {};
for (const s of SUBJECTS) {
  if (!MAPPED_SUBJECTS.includes(s.id)) continue;
  subjectNames[s.id] = { th: s.name, en: s.name_en || s.name };
  for (const t of s.topics || []) topicNames[`${s.id}/${t.id}`] = String(t.label || t.id).trim();
}

// ── an index and shards per domain ─────────────────────────────────────────────────────────
const BANK_DIR = path.join(APP, 'public', 'bank');
fs.mkdirSync(BANK_DIR, { recursive: true });

const byKey = (a, b) => (a.subject === b.subject ? Number(a.id) - Number(b.id) || String(a.id).localeCompare(String(b.id)) : a.subject.localeCompare(b.subject));

function record(q) {
  const r = {
    id: q.id, subject: q.subject, topic: q.topic || undefined, kind: kindOf(q),
    q: String(q.q).trim(), options: q.options.map((o) => String(o)), answer: q.answer,
    explain: q.explain ? String(q.explain) : undefined,
    source: q.source ? scrub(q.source) || undefined : undefined,
    origin: q.examOrigin && !String(q.examOrigin).includes('อิงแนวข้อสอบ') ? String(q.examOrigin) : undefined,
    verified: typeof q.verified === 'string' && q.verified.trim() && q.verified.trim() !== 'อิงแนวข้อสอบ' ? scrub(q.verified) || undefined : undefined,
    refs: undefined, image: figure(q.image || q.imagePath), imageAlt: q.imageAlt || undefined,
    explainImage: figure(q.explainImage), explainImageAlt: q.explainImageAlt || undefined,
    noShuffle: q.noShuffle === true ? true : undefined,
  };
  const refs = refsOf(q);
  if (refs.length) r.refs = refs;
  return JSON.parse(JSON.stringify(r));
}

const domainCards = [];
let total = 0;
const totalsByKind = { vca: 0, paper: 0, aligned: 0, lecture: 0, course: 0 };
for (const d of DOMAINS) {
  const items = ready.filter((x) => x.domain === d.id).map((x) => x.q).sort(byKey).map(record);
  DOMAIN_ITEMS.set(d.id, items);
  const files = shardDomain(d.id, items);
  for (const shard of files.shards) writeIfChanged(path.join(BANK_DIR, shard.name), shard.body);
  writeIfChanged(path.join(BANK_DIR, files.indexName), files.indexBody);
  const kinds = { vca: 0, paper: 0, aligned: 0, lecture: 0, course: 0 };
  const topics = {};
  const subjects = {};
  for (const r of items) {
    kinds[r.kind] += 1;
    totalsByKind[r.kind] += 1;
    const t = `${r.subject}/${r.topic || ''}`;
    topics[t] = (topics[t] || 0) + 1;
    subjects[r.subject] = (subjects[r.subject] || 0) + 1;
  }
  total += items.length;
  const cover = SUBJECT_COVERS[d.art];
  if (!cover) throw new Error(`domain ${d.id}: no bookplate ${d.art} in subject-covers.js`);
  const topicList = Object.entries(topics).sort((a, b) => b[1] - a[1]).map(([key, n]) => ({ key, n }));
  // What the domain page lists under "most questions": names cleaned for a student, near-duplicates
  // merged, a name that only repeats the domain left out, none at all under four (lib/topic-label.js).
  const listed = topicRows(topicList, topicNames, d);
  domainCards.push({
    id: d.id, plate: d.plate, family: d.family, th: thPlain(d.th), thw: d.th, en: d.en, tag: d.tag,
    art: `/art/${path.basename(cover.src)}`, paper: cover.paper,
    count: items.length, kinds, index: `/bank/${files.indexName}`, shards: files.shards.length, bytes: files.bytes,
    subjects: Object.entries(subjects).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n })),
    topics: topicList,
    topicCount: listed.length,
    shown: listed.slice(0, TOPICS_LISTED),
  });
}

prune(BANK_DIR);
prune(FIG_DIR);

// ── hero samples: short, self-contained VCA items, one per field, in a fixed order ──────────
const SAMPLE_TOPICS = ['aquatic', 'swine', 'dogcat', 'poultry', 'immunology', 'equine', 'ruminant', 'exotic', 'ophthalmology', 'clinical-pathology'];
const samples = [];
for (const topic of SAMPLE_TOPICS) {
  const pick = ready.map((x) => x.q).filter((q) => q.subject === 'vca' && q.topic === topic).sort(byKey).find((q) => {
    const stem = String(q.q);
    return stem.length >= 24 && stem.length <= 120 && q.options.length >= 4 && q.options.every((o) => String(o).length <= 46)
      && String(q.explain || '').length >= 40 && String(q.explain || '').length <= 260 && !q.image && !q.imagePath;
  });
  if (pick) samples.push({ ...record(pick), domain: domainOf(pick) });
}

const heldInScope = BLOCKED_QUESTIONS.filter((b) => MAPPED_SUBJECTS.includes(String(b.key).split(':')[0])).length;

const GEN_DIR = path.join(APP, 'src', 'generated');
fs.mkdirSync(GEN_DIR, { recursive: true });
const banner = '// AUTO-GENERATED by vca/scripts/build-bank.mjs from ../src/data. Do not edit; it is rebuilt before every dev and build run.\n';

// ── the VCA documents, by shelf ────────────────────────────────────────────────────────────
const docs = [];
const seenPdf = new Map();
for (const m of VCA_MATERIALS) {
  const files = (m.files || []).filter((f) => !f.archiveOnly);
  if (!files.length) continue;
  const shelf = shelfOf(m);
  let pages = 0;
  for (const f of files) {
    if (f.mime === 'application/pdf' && f.pages && f.sha256 && !seenPdf.has(f.sha256)) seenPdf.set(f.sha256, f.pages);
    if (f.mime === 'application/pdf' && f.pages) pages = Math.max(pages, f.pages);
  }
  const years = yearsOf(m.title) || files.map((f) => yearsOf(f.title)).find(Boolean) || null;
  docs.push({
    id: m.id, title: String(m.title).trim(), shelf: shelf.id, kind: m.kind === 'pastpaper' ? 'paper' : 'handout',
    years, pages: pages || null, fileKeys: files.map((f) => f.sha256 || f.id || f.path || `${f.title}:${f.mime}`),
    formats: [...new Set(files.map((f) => formatOf(f.mime)))],
  });
}
// One set uploaded twice (a scan in one folder, the scan and its transcript in another) is one
// set on the shelf, with every format it comes in: same shelf, kind, title and years.
const sameSet = (d) => [d.shelf, d.kind, d.title.toLowerCase().replace(/[’`]/g, "'").replace(/_+/g, ' ').replace(/[\s.]*\.{2,}\s*$/, '').replace(/\s+/g, ' ').trim(), d.years?.from, d.years?.to].join('|');
const merged = new Map();
for (const d of docs) {
  const key = sameSet(d);
  const had = merged.get(key);
  if (!had) { merged.set(key, d); continue; }
  had.id = had.id < d.id ? had.id : d.id;
  had.pages = Math.max(had.pages || 0, d.pages || 0) || null;
  had.fileKeys = [...new Set([...had.fileKeys, ...d.fileKeys])];
  had.formats = [...new Set([...had.formats, ...d.formats])];
}
docs.length = 0;
for (const d of merged.values()) {
  const { fileKeys, ...rest } = d;
  docs.push({ ...rest, files: fileKeys.length });
}
const collator = new Intl.Collator('th');
const shelfOrder = [...DISCIPLINES.map((d) => d.id), GENERAL_SHELF.id];
docs.sort((a, b) => shelfOrder.indexOf(a.shelf) - shelfOrder.indexOf(b.shelf)
  || (a.kind === b.kind ? 0 : a.kind === 'paper' ? -1 : 1)
  || (b.years?.to || 0) - (a.years?.to || 0)
  || collator.compare(a.title, b.title));
const shelves = [...DISCIPLINES, GENERAL_SHELF].map((d) => ({
  id: d.id, family: d.family, domain: d.domain, th: d.th, en: d.en,
  count: docs.filter((x) => x.shelf === d.id).length,
})).filter((s) => s.count > 0);
const LIBRARY = {
  documents: docs.length,
  papers: docs.filter((d) => d.kind === 'paper').length,
  handouts: docs.filter((d) => d.kind === 'handout').length,
  files: docs.reduce((n, d) => n + d.files, 0),
  pages: [...seenPdf.values()].reduce((n, p) => n + p, 0),
  shelves,
  docs,
};
writeIfChanged(path.join(GEN_DIR, 'library.js'), `${banner}export const LIBRARY = ${JSON.stringify(LIBRARY)};\n`);

// The entry carries only what the front door shows; topic maps and the document list are
// separate modules, imported by the pages that need them.
const years = docs.map((d) => d.years?.from).filter(Boolean);
const BANK = {
  total,
  kinds: totalsByKind,
  held: heldInScope,
  families: FAMILIES.map((f) => ({ ...f, th: thPlain(f.th), thw: f.th })),
  domains: domainCards.map(({ topics, subjects, shown, ...card }) => card),
  subjects: subjectNames,
  library: {
    documents: LIBRARY.documents, papers: LIBRARY.papers, handouts: LIBRARY.handouts, pages: LIBRARY.pages,
    firstYear: years.length ? Math.min(...years) : null,
    shelves: shelves.filter((sh) => sh.id !== GENERAL_SHELF.id).sort((a, b) => b.count - a.count).slice(0, 10).map(({ id, th, count }) => ({ id, th, count })),
  },
};
const CATALOG = {
  // topics: every topic key with its question count (adds up to the domain's count); shown: the
  // rows the domain page draws, ready to draw: { label, n, keys }.
  domains: Object.fromEntries(domainCards.map((d) => [d.id, { topics: d.topics, subjects: d.subjects, shown: d.shown }])),
  left: out,
  excludedSubjects: Object.entries(excludedBySubject).map(([id, n]) => ({ id, n, why: EXCLUDED_SUBJECTS[id], name: SUBJECTS.find((x) => x.id === id)?.name || id })),
  unmapped,
};
writeIfChanged(path.join(GEN_DIR, 'bank.js'), `${banner}export const BANK = ${JSON.stringify(BANK)};\n\nexport const SAMPLES = ${JSON.stringify(samples)};\n`);
writeIfChanged(path.join(GEN_DIR, 'catalog.js'), `${banner}export const CATALOG = ${JSON.stringify(CATALOG)};\n`);

if (!QUIET) {
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`vca bank: ${total} questions in ${DOMAINS.length} domains (vca ${totalsByKind.vca}, past papers ${totalsByKind.paper}), held in scope ${heldInScope}`);
  console.log(`  left out: ${Object.entries(out).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}; excluded subjects ${Object.values(excludedBySubject).reduce((a, b) => a + b, 0)}`);
  if (Object.keys(unmapped).length) console.warn(`  ⚠ not mapped to a domain: ${JSON.stringify(unmapped)} (map them in vca/src/data/domains.js)`);
  console.log(`  ${domainCards.map((d) => `${d.id} ${d.count} (${d.shards} shards, ${kb(d.bytes)})`).join(', ')}`);
  console.log(`  ${domainCards.reduce((n, d) => n + d.shards, 0)} shards of up to ${SHARD_SIZE} questions and ${domainCards.length} indexes in public/bank`);
  console.log(`  figures copied ${[...figures.values()].filter((v) => v.startsWith('/q/')).length}; samples ${samples.length}`);
  const unlisted = domainCards.filter((d) => !d.topicCount).map((d) => d.id);
  console.log(`  topic lists: ${domainCards.length - unlisted.length} of ${domainCards.length} domains${unlisted.length ? ` (none for ${unlisted.join(', ')}: under four topics)` : ''}, ${domainCards.reduce((n, d) => n + d.shown.length, 0)} rows listed`);
  console.log(`vca library: ${LIBRARY.documents} documents (${LIBRARY.papers} past papers, ${LIBRARY.handouts} handouts), ${LIBRARY.files} files, ${LIBRARY.pages} unique PDF pages, ${shelves.length} shelves`);
}
