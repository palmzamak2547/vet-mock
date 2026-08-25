#!/usr/bin/env node
// ============================================================
// resolve-question-figures.mjs — find the deck page behind a question
// ============================================================
// Usage: node scripts/resolve-question-figures.mjs
//
// Every question that needs a figure already names where its answer came from
// in `verified` ("AP2_Fish_bio p.22"). This turns that into a real file path
// and page number, writing .fig-fix/resolved.json for extract-question-figures.
//
// The deck name in a citation is not always the filename — six questions cited
// "Aquaculture_Industry_Tech" while the file on disk is "Aquactic med 2026.pdf"
// — so scripts/lib/deck-aliases.js carries the mappings, each one confirmed by
// reading the cited page rather than by the names looking similar.
//
// Matching is deliberately strict. An earlier loose version paired
// "Aquaculture_Industry_Tech" with a fried-fish recipe and "Introduction to
// Epidemiology" with a poultry-feed deck: attaching a figure from the wrong
// deck is worse than attaching none.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { needsFigure } from './lib/question-standard.mjs';
import { DECK_ALIASES } from './lib/deck-aliases.js';

const ROOT = 'C:/Users/palmz/Desktop/📚 เรียน';
const pdfs = [];
(function walk(d) {
  let entries; try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.pdf$/i.test(e.name)) pdfs.push(p);
  }
})(ROOT);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const pageCache = new Map();
const pageCount = (p) => {
  if (pageCache.has(p)) return pageCache.get(p);
  let n = 0;
  try { n = Number((execFileSync('pdfinfo', [p], { encoding: 'latin1' }).match(/^Pages:\s*(\d+)/m) || [])[1] || 0); } catch {}
  pageCache.set(p, n);
  return n;
};

const rows = [];
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  for (const q of questions) {
    if (!needsFigure(q)) continue;
    const cite = String(q.verified || q.source || '');
    const m = cite.match(/^(.*?)\s*(?:p\.|น\.|หน้า)\s*(\d+)/);
    if (!m) { rows.push({ id: q.id, subject: q.subject, cite, why: 'no deck+page in the citation' }); continue; }
    const [, deckRaw, pageStr] = m;
    const deck = deckRaw.trim();
    const page = Number(pageStr);

    let pdf = null;
    const alias = DECK_ALIASES[deck];
    if (alias) pdf = path.join(ROOT, alias);
    else {
      const key = norm(deck);
      const hits = key.length < 4 ? [] : pdfs
        .map((p) => ({ p, base: norm(path.basename(p, '.pdf')) }))
        .filter(({ base }) => (key.length >= 8 ? base.includes(key) : base.startsWith(key)))
        .sort((a, b) => a.base.length - b.base.length);
      pdf = hits[0]?.p || null;
    }
    if (pdf && !fs.existsSync(pdf)) pdf = null;
    // Never lift a figure out of a senior compilation. Those are screenshots of
    // an answered quiz, not illustrations — one pulled from "รวมโพย Ploy83.pdf"
    // came with the correct option highlighted green, which would have handed
    // students the answer.
    if (pdf && /โพย|ชีท|ชีต|สรุปรุ่นพี่/.test(path.basename(pdf))) {
      rows.push({ id: q.id, subject: q.subject, deck, page, pdf: null, total: 0, ok: false, cite, why: "source is a senior compilation — figures there are answer screenshots" });
      continue;
    }
    const total = pdf ? pageCount(pdf) : 0;
    rows.push({ id: q.id, subject: q.subject, deck, page, pdf, total, ok: Boolean(pdf) && page > 0 && page <= total, cite });
  }
}

fs.mkdirSync('.fig-fix', { recursive: true });
fs.writeFileSync('.fig-fix/resolved.json', JSON.stringify(rows, null, 1));

const ok = rows.filter((r) => r.ok);
console.log('RESOLVED');
for (const r of ok) console.log(`  #${r.id} ${String(r.deck).slice(0, 32).padEnd(32)} p.${String(r.page).padEnd(4)} → ${path.basename(r.pdf).slice(0, 44)} (${r.total}p)`);
console.log('\nUNRESOLVED');
for (const r of rows.filter((x) => !x.ok)) console.log(`  #${r.id} ${String(r.deck ?? r.why).slice(0, 40).padEnd(40)} p.${r.page ?? '?'} ${r.pdf ? `(deck has ${r.total}p)` : '— no deck on disk'}`);
console.log(`\n${ok.length} resolved · ${rows.length - ok.length} not · ${pdfs.length} PDFs indexed`);
