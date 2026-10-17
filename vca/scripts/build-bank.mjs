#!/usr/bin/env node
// Builds the VCA site's question bank from the main app's banks, before every dev or build run.
//
// Reads (never writes) ../src: the bank registry, the fail-closed delivery gate, the curriculum's
// subject and topic names, the bookplate registry and the VCA source inventory. Writes, all
// git-ignored:
//   public/bank/<domain>.<hash>.json   one file per domain, fetched when a set needs it
//   public/q/…                          figures a question points at by path, copied as they are
//   src/generated/bank.js               counts, domain cards, subject and topic names, hero samples
//   src/generated/library.js            the VCA documents, shelved by field
//
// Only learner-ready multiple-choice questions enter: the same isQuestionDeliverable gate the
// main app uses, so a question held for answer or figure review is never served here either.
//
// Usage: node scripts/build-bank.mjs [--quiet]

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..');
const REPO = path.resolve(APP, '..');
const QUIET = process.argv.includes('--quiet');
const load = (rel) => import(pathToFileURL(path.join(REPO, rel)).href);

const { BANK_REGISTRY } = await load('src/data/bank-registry.generated.js');
const { isQuestionDeliverable, BLOCKED_QUESTIONS } = await load('src/data/question-delivery.generated.js');
const { SUBJECTS } = await load('src/data/curriculum.js');
const { SUBJECT_COVERS } = await load('src/data/subject-covers.js');
const { VCA_MATERIALS } = await load('src/data/vca-materials.js');
const { isPastPaperQuestion, isExamAlignedQuestion } = await load('src/lib/question-metadata.js');
const { DOMAINS, FAMILIES, EXCLUDED_SUBJECTS, MAPPED_SUBJECTS, domainOf, thPlain } = await import(pathToFileURL(path.join(APP, 'src/data/domains.js')).href);
const { DISCIPLINES, GENERAL_SHELF, shelfOf, yearsOf, formatOf } = await import(pathToFileURL(path.join(APP, 'src/data/disciplines.js')).href);

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
  if (q.subject === 'vca') return 'vca';
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
const scrub = (text) => String(text).replace(DRIVE_URL, '').replace(/[\s;,]+$/, '').trim();

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

// ── one file per domain ────────────────────────────────────────────────────────────────────
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
  const body = JSON.stringify({ domain: d.id, questions: items });
  const file = `${d.id}.${sha(body).slice(0, 10)}.json`;
  writeIfChanged(path.join(BANK_DIR, file), body);
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
  domainCards.push({
    id: d.id, plate: d.plate, family: d.family, th: thPlain(d.th), thw: d.th, en: d.en, tag: d.tag,
    art: `/art/${path.basename(cover.src)}`, paper: cover.paper,
    count: items.length, kinds, file: `/bank/${file}`, bytes: Buffer.byteLength(body),
    subjects: Object.entries(subjects).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n })),
    topics: Object.entries(topics).sort((a, b) => b[1] - a[1]).map(([key, n]) => ({ key, n })),
  });
}

prune(BANK_DIR);
prune(FIG_DIR);

// Topic names only for topics some served question carries.
const usedTopics = new Set(domainCards.flatMap((d) => d.topics.map((t) => t.key)));
const topicLabels = Object.fromEntries([...usedTopics].map((k) => [k, topicNames[k] || null]).filter(([, v]) => v));

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
    years, pages: pages || null, files: files.length,
    formats: [...new Set(files.map((f) => formatOf(f.mime)))],
  });
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
  domains: domainCards.map(({ topics, subjects, ...card }) => card),
  subjects: subjectNames,
  library: {
    documents: LIBRARY.documents, papers: LIBRARY.papers, handouts: LIBRARY.handouts, pages: LIBRARY.pages,
    firstYear: years.length ? Math.min(...years) : null,
    shelves: shelves.filter((sh) => sh.id !== GENERAL_SHELF.id).sort((a, b) => b.count - a.count).slice(0, 10).map(({ id, th, count }) => ({ id, th, count })),
  },
};
const CATALOG = {
  topics: topicLabels,
  domains: Object.fromEntries(domainCards.map((d) => [d.id, { topics: d.topics, subjects: d.subjects }])),
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
  console.log(`  ${domainCards.map((d) => `${d.id} ${d.count} (${kb(d.bytes)})`).join(', ')}`);
  console.log(`  figures copied ${[...figures.values()].filter((v) => v.startsWith('/q/')).length}; samples ${samples.length}`);
  console.log(`vca library: ${LIBRARY.documents} documents (${LIBRARY.papers} past papers, ${LIBRARY.handouts} handouts), ${LIBRARY.files} files, ${LIBRARY.pages} unique PDF pages, ${shelves.length} shelves`);
}
