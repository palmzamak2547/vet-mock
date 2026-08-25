#!/usr/bin/env node
// ============================================================
// apply-explain-rewrite.mjs — land the rewrites that survived
// ============================================================
// Usage: node scripts/apply-explain-rewrite.mjs [--write] [batchKey ...]
//
// Applies ONLY rewrites a refuter marked "ok". A batch with no verdict file is
// skipped entirely rather than applied on trust: an unrefuted rewrite is an
// unread one, and the whole point of the second stage is that the agent which
// wrote a claim is never the one that clears it.
//
// Refuted items keep their old explanation. They still narrate the deck, so
// they stay in the defect count and stay visible — which is the honest state,
// not a silent gap.
// ============================================================

import fs from 'node:fs';
import { bankFiles, readBank, updateField } from './lib/bank-file.mjs';
import { narratesDocument } from './lib/question-standard.mjs';

const DIR = process.argv.find((a) => a.startsWith("--dir="))?.slice(6) || ".explain-fix";
const WRITE = process.argv.includes('--write');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const keys = args.length ? args : JSON.parse(fs.readFileSync(`${DIR}/batches.json`, 'utf8')).map((b) => b.key);

const accepted = new Map();     // id -> explain
const rejected = [];
const unrefuted = [];

for (const key of keys) {
  const outPath = `${DIR}/${key}.out.json`;
  const vPath = `${DIR}/${key}.verdict.json`;
  if (!fs.existsSync(outPath)) continue;
  if (!fs.existsSync(vPath)) { unrefuted.push(key); continue; }

  const out = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const results = Array.isArray(out) ? out : (out.results || []);
  const v = JSON.parse(fs.readFileSync(vPath, 'utf8'));
  const verdicts = new Map((Array.isArray(v) ? v : v.verdicts || []).map((x) => [x.id, x]));

  for (const r of results) {
    const verdict = verdicts.get(r.id);
    if (!verdict) { rejected.push(`#${r.id} no verdict`); continue; }
    if (verdict.verdict !== 'ok') { rejected.push(`#${r.id} ${verdict.problem || 'refuted'}`); continue; }
    const ex = String(r.explain || '').trim();
    if (!ex || narratesDocument({ explain: ex })) { rejected.push(`#${r.id} failed the mechanical check`); continue; }
    accepted.set(r.id, ex);
  }
}

if (unrefuted.length) console.log(`skipped, no verdict file: ${unrefuted.join(', ')}`);
console.log(`accepted ${accepted.size} · rejected ${rejected.length}`);
for (const r of rejected.slice(0, 12)) console.log(`  · ${r}`);
if (rejected.length > 12) console.log(`  … ${rejected.length - 12} more`);

if (!WRITE) { console.log('\n(dry run — pass --write to apply)'); process.exit(0); }

let applied = 0;
for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  const mine = new Map();
  for (const q of questions) if (accepted.has(q.id)) mine.set(q.id, accepted.get(q.id));
  if (!mine.size) continue;
  const n = updateField(file, 'explain', mine);
  if (n !== mine.size) { console.error(`✗ ${file}: wrote ${n} of ${mine.size}`); process.exit(1); }
  applied += n;
}
console.log(`\napplied ${applied} of ${accepted.size}`);
if (applied !== accepted.size) process.exit(1);
