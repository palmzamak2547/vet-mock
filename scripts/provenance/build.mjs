#!/usr/bin/env node
// ============================================================
// build.mjs — the bank side of the provenance crops (docs/PROVENANCE-CROPS.md)
// ============================================================
// export: one JSON per subject with every question and every page it cites,
//         structured (sourcePages) or written as text in source/verified.
// pdf:    the subject's proof PDFs, one per paper it sits, from that JSON and the crop registry.
// all:    export, crops.py, pdf, for one subject or every subject of a year.
//
// The data root lives outside every checkout (VMX_PROVENANCE_DATA, default
// C:\dev\vetmock-provenance-data). Nothing here writes into the repository.
//
// Usage: node scripts/provenance/build.mjs export|pdf|all --subject <id>[,<id>] | --year <n>
// ============================================================
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bankFiles, readBank } from '../lib/bank-file.mjs';
import { citationChunks, pageRuns } from '../lint-source-docs.mjs';
import { wholeStem } from '../../src/lib/rich-blocks.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const imp = (rel) => import(pathToFileURL(path.join(REPO, rel)).href);
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3)
  ?? (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : undefined);

export const DATA = path.resolve(process.env.VMX_PROVENANCE_DATA || 'C:/dev/vetmock-provenance-data');

/** Refuse a data root inside a git work tree: crops and file names must never be committed. */
export function assertPrivateRoot(root = DATA) {
  for (let d = root; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.git'))) throw new Error(`data root ${root} is inside the git work tree ${d}`);
    if (path.dirname(d) === d) return;
  }
}

/** The item label written right after a page run: "หน้า 2 ข้อ 9", "หน้า 4 (ASF ข้อ 1)". */
function itemAfter(text) {
  return text.slice(0, 40).match(/^[\s,]*(?:\([^)]{0,20}?)?(?:ข้อ|item|Q)\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1] ?? null;
}

/** Every page a question cites: [{ slug, edition, page, name, item, structured }].
 *  A text cite takes the registry document whose name ends nearest before
 *  its page run, else the words before the run as `name` (crops.py matches
 *  that against its private aliases). */
export function citesOf(q, docs) {
  const own = docs.filter((d) => d.subject === q.subject);
  const out = (q.sourcePages || []).map((c) => ({ slug: c.doc, edition: c.edition, page: c.page, name: null, item: null, structured: true }));
  for (const chunk of citationChunks(q)) {
    let from = 0;
    let prev = null; // a later run with no name of its own ("... และหน้า 6") belongs to the one before
    for (const run of pageRuns(chunk)) {
      let best = null;
      for (const d of own) {
        const re = new RegExp(d.match.source, `${d.match.flags}g`);
        for (const m of chunk.slice(0, run.index).matchAll(re)) {
          const end = m.index + m[0].length;
          if (!best || end > best.end) best = { d, end };
        }
      }
      let doc = best && best.end > from
        ? { slug: best.d.slug, edition: best.d.editions.length === 1 ? best.d.editions[0].id : null, name: null }
        : { slug: null, edition: null, name: chunk.slice(from, run.index).replace(/\s+/g, ' ').trim().slice(-90) };
      if (prev && from > 0 && !doc.slug) doc = { ...prev, name: doc.name }; // crops.py tries the words as an alias first
      const item = itemAfter(chunk.slice(run.end));
      for (const page of run.pages) {
        const same = out.find((c) => c.page === page && doc.slug && c.slug === doc.slug);
        if (same) { same.item ??= item; continue; }
        // sourcePages is authoritative for a document it names; text pages fill in only the rest.
        if (doc.slug && (q.sourcePages || []).some((c) => c.doc === doc.slug)) continue;
        out.push({ ...doc, page, item, structured: false });
      }
      prev = doc;
      from = run.end;
    }
  }
  // A document named with no page: crops.py searches its pages for the item.
  const raw = citationChunks(q).join(' ; ');
  for (const d of own) {
    if (d.match.test(raw) && !out.some((c) => c.slug === d.slug)) {
      out.push({ slug: d.slug, edition: d.editions.length === 1 ? d.editions[0].id : null, page: null, name: null, item: null, structured: false });
    }
  }
  return out;
}

async function exportSubjects(subjects) {
  const [{ SOURCE_DOCS }, { SUBJECTS }, { EXAM_SCHEDULE }, { scopeOfQuestion }] = await Promise.all([
    imp('src/data/source-docs.js'), imp('src/data/curriculum.js'), imp('src/data/schedule.js'), imp('src/lib/exam-scope.js'),
  ]);
  const rows = [];
  for (const file of bankFiles(path.join(REPO, 'src/data'))) {
    for (const q of (await readBank(file)).questions) if (subjects.includes(q.subject)) rows.push([path.basename(file), q]);
  }
  fs.mkdirSync(path.join(DATA, 'work'), { recursive: true });
  for (const id of subjects) {
    const s = SUBJECTS.find((x) => x.id === id);
    const papers = Object.values(EXAM_SCHEDULE).flat().filter((r) => r.subject === id);
    const topics = (s?.topics || []).map((t, i) => ({ id: t.id, label: t.label, order: i, lecturer: t.lecturer ?? null, examScope: t.examScope ?? null }));
    const questions = rows.filter(([, q]) => q.subject === id).map(([bankFile, q]) => ({
      qid: `${q.subject}:${q.id}`, bankFile, id: q.id, subject: q.subject, topic: q.topic, type: q.type,
      q: wholeStem(q), options: q.options ?? null, answer: q.answer ?? null, model_answer: q.model_answer ?? null,
      keywords: q.keywords ?? null, explain: q.explain ?? '', source: q.source ?? null, verified: q.verified ?? null,
      sourceType: q.sourceType ?? null, examOrigin: q.examOrigin ?? null, scope: scopeOfQuestion(q) ?? null,
      image: q.image ?? null, cites: citesOf(q, SOURCE_DOCS),
    }));
    const out = { subject: { id, name: s?.name ?? id, name_en: s?.name_en ?? null, papers }, topics, questions };
    fs.writeFileSync(path.join(DATA, 'work', `${id}.json`), JSON.stringify(out, null, 1));
    const cited = questions.filter((q) => q.cites.length).length;
    console.log(`${id}: ${questions.length} questions, ${cited} cite a page`);
  }
}

/** Subjects of a year, by the date of their final paper (EXAM_SCHEDULE), then the rest. */
async function subjectsOfYear(year) {
  const [{ SUBJECTS }, { EXAM_SCHEDULE }] = await Promise.all([imp('src/data/curriculum.js'), imp('src/data/schedule.js')]);
  const finals = (EXAM_SCHEDULE[`y${year}`] || []).filter((r) => /final/i.test(`${r.id} ${r.title}`));
  const date = (id) => finals.find((r) => r.subject === id)?.date ?? '9999';
  const { yearForSubject } = await imp('src/data/curriculum.js');
  return SUBJECTS.filter((s) => yearForSubject(s.id) === Number(year)).map((s) => s.id)
    .sort((a, b) => date(a).localeCompare(date(b)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const cmd = process.argv[2];
  assertPrivateRoot();
  const subjects = arg('subject') ? arg('subject').split(',') : arg('year') ? await subjectsOfYear(arg('year')) : [];
  if (!['export', 'pdf', 'all'].includes(cmd) || !subjects.length) {
    console.error('usage: node scripts/provenance/build.mjs export|pdf|all --subject <id>[,<id>] | --year <n>');
    process.exit(1);
  }
  if (cmd !== 'pdf') await exportSubjects(subjects);
  for (const id of subjects) {
    if (cmd === 'all') {
      const crops = (...extra) => execFileSync('python', ['-I', path.join(REPO, 'scripts/provenance/crops.py'), '--subject', id, '--data', DATA, ...extra], { stdio: 'inherit' });
      crops('--covers');   // this year's library files and the earlier decks, first pages
      crops();
    }
    if (cmd !== 'export') await (await import('./pdf.mjs')).buildPdf(id, DATA);
  }
}
