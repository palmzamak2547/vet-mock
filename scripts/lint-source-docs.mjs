#!/usr/bin/env node
// ============================================================
// lint-source-docs.mjs — a page citation names a real page of a real edition
// ============================================================
// Page citations were free text, 258 different document labels for a few
// dozen files, and nothing checked them. "EQUINE MED MID 86.pdf หน้า 21" is
// one page in the 44-page edition and the next page in the 45-page one, and
// nothing in the text said which.
//
// src/data/source-docs.js now lists the most-cited documents with the page
// count of each edition, and a question citing one of them carries
// `sourcePages: [{ doc, edition, page }]` beside its raw source/verified text.
// This fails when:
//   - the registry is malformed (a duplicate slug, an unknown subject, an
//     edition with no page count, a `match` that is global or sticky);
//   - a structured cite names an unknown slug or edition, or a page outside
//     that edition, or belongs to another subject's document;
//   - a structured cite disagrees with the raw text it stands beside: the raw
//     text must name the document and that page. The raw strings are never
//     rewritten, so this keeps the two from drifting apart;
//   - a question cites a document that has more than one edition at a page
//     and does not say which edition;
//   - the page citations still held only as text grow past the budget. That
//     number may only go down: lower FREE_TEXT_BUDGET when a migration
//     shrinks it, never raise it.
//
// Usage: node scripts/lint-source-docs.mjs [--list]
// ============================================================
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';

// Page citations held only as text on 2026-09-23: 6219 before the first
// migration, 4412 after it moved 1533 cites on 1384 questions into sourcePages.
export const FREE_TEXT_BUDGET = 4412;

// "p.43", "p43", "pp. 4", "หน้า 21", "น.3" — not the p in "step 2" or "top 10".
const MARK = String.raw`(?:(?<![A-Za-z])pp?\.?|หน้า|น\.)`;
// A run of pages as the bank writes them: "หน้า 18, 19 และ 25", "p.8-9",
// "p12-p17", "น.4, น.5".
const PAGE_RUN = new RegExp(String.raw`${MARK}\s*(\d+)((?:\s*(?:,|และ|and|[-–])\s*${MARK}?\s*\d+)*)`, 'gi');
const RUN_NEXT = new RegExp(String.raw`\s*(,|และ|and|[-–])\s*${MARK}?\s*(\d+)`, 'gi');

/** Every run of page numbers in a text: [{ index, end, pages }]. A short
 *  range lists every page in it; a long one only its two ends. */
export function pageRuns(text) {
  const runs = [];
  for (const m of String(text ?? '').matchAll(PAGE_RUN)) {
    const pages = [Number(m[1])];
    let prev = pages[0];
    for (const part of m[2].matchAll(RUN_NEXT)) {
      const n = Number(part[2]);
      if (/[-–]/.test(part[1]) && n > prev && n - prev <= 12) for (let p = prev + 1; p <= n; p++) pages.push(p);
      else pages.push(n);
      prev = n;
    }
    runs.push({ index: m.index, end: m.index + m[0].length, pages });
  }
  return runs;
}

/** The page numbers written in a piece of text, in order. */
export function pageNumbers(text) {
  return pageRuns(text).flatMap((r) => r.pages);
}

/** One citation per piece: the raw fields separate them with ; | and +. */
export function citationChunks(q) {
  return [q?.source, q?.verified]
    .filter((v) => typeof v === 'string')
    .flatMap((v) => v.split(/[;|+]/));
}

/**
 * Every problem with the registry and with the questions' structured cites,
 * and the count of page citations still held only as text.
 * @param questions every bank row
 * @param docs SOURCE_DOCS
 * @param subjects the curriculum's subject ids
 */
export function checkSourceDocs({ questions, docs, subjects }) {
  const errors = [];
  const bySlug = new Map();
  for (const d of docs) {
    const at = `source-docs ${d?.slug ?? '(no slug)'}`;
    if (typeof d?.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) errors.push(`${at}: slug must be lowercase words joined by -`);
    else if (bySlug.has(d.slug)) errors.push(`${at}: slug is listed twice`);
    else bySlug.set(d.slug, d);
    if (!subjects.has(d?.subject)) errors.push(`${at}: unknown subject ${JSON.stringify(d?.subject)}`);
    if (typeof d?.title !== 'string' || !d.title.trim()) errors.push(`${at}: no title`);
    if (!(d?.match instanceof RegExp)) errors.push(`${at}: match must be a RegExp`);
    else if (d.match.global || d.match.sticky) errors.push(`${at}: match must not be global or sticky (test() would keep state)`);
    const editions = Array.isArray(d?.editions) ? d.editions : [];
    if (!editions.length) errors.push(`${at}: no editions`);
    const ids = new Set();
    for (const e of editions) {
      if (typeof e?.id !== 'string' || !e.id) errors.push(`${at}: an edition has no id`);
      else if (ids.has(e.id)) errors.push(`${at}: edition ${e.id} is listed twice`);
      else ids.add(e.id);
      if (!Number.isInteger(e?.pages) || e.pages < 1) errors.push(`${at}: edition ${e?.id} has no page count`);
    }
  }

  let freeText = 0;
  const freeTextByLabel = new Map();
  for (const q of questions) {
    const where = `${q.subject}#${q.id}`;
    const raw = citationChunks(q).join(' ; ');
    const cited = new Set();
    if (q.sourcePages !== undefined) {
      if (!Array.isArray(q.sourcePages) || !q.sourcePages.length) {
        errors.push(`${where}: sourcePages must be a non-empty array`);
      } else {
        const seen = new Set();
        for (const c of q.sourcePages) {
          const keys = c && typeof c === 'object' ? Object.keys(c).sort().join(',') : '';
          if (keys !== 'doc,edition,page') { errors.push(`${where}: a sourcePages entry must be { doc, edition, page }`); continue; }
          const d = bySlug.get(c.doc);
          if (!d) { errors.push(`${where}: unknown document slug ${JSON.stringify(c.doc)}`); continue; }
          cited.add(d.slug);
          const e = d.editions.find((x) => x.id === c.edition);
          if (!e) { errors.push(`${where}: ${d.slug} has no edition ${JSON.stringify(c.edition)}`); continue; }
          if (!Number.isInteger(c.page) || c.page < 1 || c.page > e.pages) {
            errors.push(`${where}: page ${c.page} is past the end of ${d.slug} ${e.id} (${e.pages} pages)`);
          }
          if (q.subject !== d.subject) errors.push(`${where}: ${d.slug} belongs to ${d.subject}`);
          if (!d.match.test(raw)) errors.push(`${where}: the raw citation does not name ${d.title}`);
          else if (!pageNumbers(raw).includes(c.page)) errors.push(`${where}: the raw citation has no page ${c.page}`);
          const key = `${c.doc}|${c.edition}|${c.page}`;
          if (seen.has(key)) errors.push(`${where}: ${key} is listed twice`);
          seen.add(key);
        }
      }
    }
    for (const chunk of citationChunks(q)) {
      const pages = pageNumbers(chunk);
      if (!pages.length) continue;
      const own = docs.filter((d) => d.match instanceof RegExp && d.subject === q.subject && d.match.test(chunk));
      // A document that exists in more than one edition must be cited with one.
      for (const d of own) {
        if (d.editions.length > 1 && !cited.has(d.slug)) {
          errors.push(`${where}: cites ${d.title} at a page without saying which edition (${d.editions.map((e) => e.id).join(', ')})`);
        }
      }
      if (own.some((d) => cited.has(d.slug))) continue;
      freeText += pages.length;
      const label = chunk.replace(/\s+/g, ' ').trim().split(/\s(?:pp?\.?|หน้า|น\.)\s?\d/i)[0].slice(-40) || '(no label)';
      freeTextByLabel.set(label, (freeTextByLabel.get(label) || 0) + pages.length);
    }
  }
  return { errors, freeText, freeTextByLabel };
}

export async function loadQuestions(root) {
  const rows = [];
  for (const file of bankFiles(path.join(root, 'src/data'))) rows.push(...(await readBank(file)).questions);
  return rows;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);
  const [{ SOURCE_DOCS }, { SUBJECTS }, questions] = await Promise.all([
    imp('src/data/source-docs.js'), imp('src/data/curriculum.js'), loadQuestions(root),
  ]);
  const { errors, freeText, freeTextByLabel } = checkSourceDocs({
    questions, docs: SOURCE_DOCS, subjects: new Set(SUBJECTS.map((s) => s.id)),
  });
  const structured = questions.filter((q) => Array.isArray(q.sourcePages)).length;
  console.log(`${SOURCE_DOCS.length} documents; ${structured} questions carry structured page cites; ${freeText} page citations are still text only (budget ${FREE_TEXT_BUDGET})`);
  if (process.argv.includes('--list')) {
    for (const [label, n] of [...freeTextByLabel].sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(`  ${String(n).padStart(4)}  ${label}`);
  }
  for (const e of errors.slice(0, 60)) console.error(`  ${e}`);
  if (errors.length > 60) console.error(`  ... and ${errors.length - 60} more`);
  if (freeText > FREE_TEXT_BUDGET) errors.push('budget');
  if (errors.length) {
    if (freeText > FREE_TEXT_BUDGET) console.error(`✗ ${freeText} text-only page citations, over the budget of ${FREE_TEXT_BUDGET}: cite a listed document with sourcePages, or list the document`);
    console.error(`✗ lint:source-docs failed`);
    process.exit(1);
  }
  if (freeText < FREE_TEXT_BUDGET) console.log(`  the count went down: lower FREE_TEXT_BUDGET to ${freeText}`);
  console.log('✓ every structured page cite names a real page of a real edition');
}
