#!/usr/bin/env node
// ============================================================
// build-question-bank.mjs — turn drafted questions into a bank file
// ============================================================
// Usage:
//   node scripts/build-question-bank.mjs <dir> --subject <id> --out <file> --export <SYMBOL> [--write]
//
// Reads one JSON per topic ({questions:[...]}), checks each question against the
// rules that make an item guessable, and emits a bank file with ids allocated
// above everything already in the corpus.
//
// The checks are here rather than left to lint:questions because a rejected
// question should never reach the file in the first place. Anything that fails
// is dropped and named, not silently repaired — a question quietly "fixed" by a
// script is one nobody has read.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';
import { SUBJECTS } from '../src/data/curriculum.js';
import { namesDocument, narratesDocument, examOriginIsADeck } from './lib/question-standard.mjs';

const args = process.argv.slice(2);
const DIR = args[0];
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const SUBJECT = flag('--subject');
const OUT = flag('--out');
const SYMBOL = flag('--export');
const WRITE = args.includes('--write');
if (!DIR || !SUBJECT || !OUT || !SYMBOL) {
  console.error('usage: build-question-bank.mjs <dir> --subject <id> --out <file> --export <SYMBOL> [--write]');
  process.exit(2);
}

const { SUBJECTS_BY_YEAR } = await import('../src/data/curriculum.js');
// The bank used to hardcode year 5, which was true of every subject that had
// one. A Year-2 bank inherits the same field and then fails lint:curriculum.
const subjectYear = Number(Object.entries(SUBJECTS_BY_YEAR)
  .find(([, list]) => list.some((s) => s.id === SUBJECT))?.[0]) || 5;

const validTopics = new Set((SUBJECTS.find((s) => s.id === SUBJECT)?.topics || []).map((t) => t.id));

// highest id in use anywhere, so a new bank cannot collide with an old one
let maxId = 0;
for (const e of BANK_REGISTRY) {
  for (const q of await e.load()) if (typeof q?.id === 'number' && q.id > maxId) maxId = q.id;
}

const BANNED_IN_OPTION = [
  { re: /★/, why: 'star marks the answer' },
  { re: /\*\*/, why: 'bold marks the answer' },
  { re: /…|\.\.\./, why: 'ellipsis reads as unfinished' },
  { re: / · /, why: 'middle-dot separator clusters on the answer' },
  { re: /ถูกทุกข้อ|ไม่มีข้อใดถูก|all of the above|none of the above/i, why: 'catch-all option' },
];

const kept = [], dropped = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const { questions = [] } = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  for (const q of questions) {
    const fail = (why) => dropped.push({ topic: q.topic, why, q: (q.q || '').slice(0, 56) });

    if (!validTopics.has(q.topic)) { fail(`topic '${q.topic}' not in ${SUBJECT}`); continue; }
    // 4 or 5. The Year-4 semester-2 banks, which are the quality Palm points
    // at, are 28% five-option; a bank that is uniformly four reads generated.
    const nOpts = Array.isArray(q.options) ? q.options.length : 0;
    if (nOpts < 4 || nOpts > 5) { fail('needs 4 or 5 options'); continue; }
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= nOpts) { fail('answer index out of range'); continue; }
    if (new Set(q.options.map((o) => o.trim())).size !== nOpts) { fail('duplicate options'); continue; }

    // The stem must stand on its own: the deck is where the ANSWER came from,
    // never part of what is asked. Same for the explanation — 92% of the first
    // Year-2 batch narrated the slide ("สไลด์ให้ไทม์ไลน์ไว้ว่า…") where all
    // 1,746 Year-4 semester-2 questions state the fact and move on.
    if (namesDocument(q)) { fail('stem names the source document'); continue; }
    if (narratesDocument(q)) { fail('explanation narrates the source document'); continue; }

    let bad = null;
    for (const o of q.options) for (const b of BANNED_IN_OPTION) if (b.re.test(o)) bad = b.why;
    if (bad) { fail(bad); continue; }

    // length bias: the correct option must not tower over the distractors
    const lens = q.options.map((o) => o.length);
    const correct = lens[q.answer];
    const others = lens.filter((_, i) => i !== q.answer);
    const mean = others.reduce((a, b) => a + b, 0) / others.length;
    if (mean > 0 && correct / mean > 1.5) { fail(`answer ${Math.round(correct / mean * 100)}% of distractor mean length`); continue; }

    // A question must say where it came from. Slide-derived items cite the
    // slide page in `verified`; senior-material items may instead carry
    // `examOrigin` (the provenance string the corpus already uses on 1,305
    // questions). Either satisfies the citation rule — having neither fails.
    if (!q.verified && !q.examOrigin) { fail('no citation (verified or examOrigin)'); continue; }

    // `examOrigin` means a real past paper — "COM III Final 2019". A lecture
    // deck is a `source`. Filling examOrigin with a deck name (which a
    // house-style pass did to all 145 Year-2 questions) makes a slide-derived
    // question wear the authority of a past exam. Refuse it rather than guess.
    if (examOriginIsADeck(q)) { fail(`examOrigin names a deck, not an exam: ${q.examOrigin}`); continue; }

    kept.push({
      id: ++maxId,
      subject: SUBJECT,
      topic: q.topic,
      year: subjectYear,
      type: 'mcq',
      q: q.q,
      options: q.options,
      answer: q.answer,
      explain: q.explain,
      verified: q.verified || q.examOrigin,
      // Provenance pass-through: these two fields are how the app has always
      // distinguished past-paper and student-compilation items from
      // lecture-derived ones. Dropping them here would silently launder the
      // provenance the extraction was careful to record.
      ...(q.source ? { source: q.source } : {}),
      ...(Array.isArray(q.tags) && q.tags.length ? { tags: q.tags } : {}),
      ...(q.sourceType ? { sourceType: q.sourceType } : {}),
      ...(q.examOrigin ? { examOrigin: q.examOrigin } : {}),
    });
  }
}

// position bias across the finished bank
const spread = kept.reduce((a, q) => { a[q.answer] = (a[q.answer] || 0) + 1; return a; }, {});
const worst = Math.max(...Object.values(spread));
const skew = kept.length ? worst / kept.length : 0;

console.log(`kept    : ${kept.length}`);
console.log(`dropped : ${dropped.length}`);
for (const d of dropped) console.log(`  ✗ [${d.topic}] ${d.why} — ${d.q}`);
console.log(`answer spread: ${JSON.stringify(spread)}  (worst index ${(skew * 100).toFixed(0)}%)`);
if (skew > 0.4) console.log('⚠️  answer index is clustered — lint:questions flags above 60%, this is worth a look');
console.log(`id range: ${kept.length ? `${kept[0].id}-${kept[kept.length - 1].id}` : 'n/a'}`);

if (!WRITE) { console.log('\n(dry run — pass --write to emit)'); process.exit(0); }

const meta = SUBJECTS.find((s) => s.id === SUBJECT);
const body = `// ============================================================
// ${meta?.name || SUBJECT} — question bank (lecture 2569)
// ============================================================
// Written from the governed notes for this subject, which are themselves
// derived from the lecture slides. Every question carries the slide page it
// came from in "verified".
//
// Generated by scripts/build-question-bank.mjs, which drops rather than repairs
// anything that would let a student answer without knowing the material:
// emphasis markers or ellipses inside options, catch-all options, duplicate
// options, or a correct answer more than 1.5x the mean distractor length.
// ============================================================

export const ${SYMBOL} = ${JSON.stringify(kept, null, 2)};
`;
fs.writeFileSync(OUT, body);
console.log(`\n✅ wrote ${OUT}`);
