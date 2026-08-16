#!/usr/bin/env node
// ============================================================
// batch-narrating-explains.mjs — prepare the explanation rewrite
// ============================================================
// Usage: node scripts/batch-narrating-explains.mjs [--max 32]
//
// Collects every question whose EXPLANATION narrates its source document
// ("สไลด์ให้ไทม์ไลน์ไว้ว่า…") and writes them into agent-sized batches under
// .explain-fix/, grouped by bank so each batch stays inside one subject.
//
// The batches feed scripts/workflows/explain-rewrite.mjs:
//
//   node scripts/batch-narrating-explains.mjs
//   # then run the workflow with .explain-fix/batches.json as `batches`
//
// Everything under .explain-fix/ is derived and gitignored — regenerating it
// from the corpus is always safe and always current.
// ============================================================

import fs from 'node:fs';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { narratesDocument } from './lib/question-standard.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? Number(process.argv[i + 1]) : d; };
const MAX = arg('--max', 32);         // one agent, one readable sitting
const DIR = '.explain-fix';

const groups = new Map();
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  const bad = questions.filter(narratesDocument);
  if (bad.length) groups.set(f.split(/[\\/]/).pop().replace(/^questions-|\.js$/g, ''), bad);
}

// Only what the rewriter needs. The old explanation goes with it: the fact is
// already in there, wrapped in narration, and unwrapping it is the job —
// which is also why nothing here needs the deck re-read.
const slim = (q) => ({ id: q.id, q: q.q, options: q.options, answer: q.answer, explain: q.explain, verified: q.verified || q.source, tags: q.tags });

fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const batches = [], tiny = [];
for (const [key, items] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  if (items.length <= 4) { tiny.push(...items); continue; }
  const n = Math.ceil(items.length / MAX);
  const size = Math.ceil(items.length / n);
  for (let i = 0; i < n; i++) {
    const slice = items.slice(i * size, (i + 1) * size);
    if (slice.length) batches.push({ key: n > 1 ? `${key}-${i + 1}` : key, subject: key, items: slice });
  }
}
if (tiny.length) batches.push({ key: 'assorted', subject: 'mixed', items: tiny });

for (const b of batches) fs.writeFileSync(`${DIR}/${b.key}.in.json`, JSON.stringify(b.items.map(slim), null, 1));
const index = batches.map((b) => ({ key: b.key, subject: b.subject, n: b.items.length }));
fs.writeFileSync(`${DIR}/batches.json`, `${JSON.stringify(index, null, 1)}\n`);

for (const b of index) console.log(`${String(b.n).padStart(3)}  ${b.key}`);
console.log(`\n${batches.length} batch(es), ${index.reduce((a, b) => a + b.n, 0)} question(s) → ${DIR}/`);
console.log('next: run scripts/workflows/explain-rewrite.mjs with batches.json as `batches`');
