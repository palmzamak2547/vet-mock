#!/usr/bin/env node
// ============================================================
// verify-explain-rewrite.mjs — check the rewrites before they land
// ============================================================
// Usage: node scripts/verify-explain-rewrite.mjs [batchKey ...]
//
// The workflow's refuter judges MEANING. This judges what arithmetic can:
// no id lost, nothing still narrating the deck, and above all no NUMBER that
// was not already in the question. A rewritten explanation is allowed to say
// what a distractor actually is; it is not allowed to invent "ประมาณ 10^5
// CFU/ml" out of nowhere, and that is checkable without reading a word.
// ============================================================

import fs from 'node:fs';
import { narratesDocument } from './lib/question-standard.mjs';

const DIR = '.explain-fix';
const keys = process.argv.slice(2).length
  ? process.argv.slice(2)
  : JSON.parse(fs.readFileSync(`${DIR}/batches.json`, 'utf8')).map((b) => b.key);

// Numbers already in play for a question. Superscripts and separators removed
// so "1,000" and "1000" are the same number.
const numbersIn = (s) => new Set(
  String(s).replace(/[,\s]/g, '').match(/\d+(?:\.\d+)?/g) || [],
);

let total = 0, problems = 0, missing = 0;
const report = [];

for (const key of keys) {
  const inPath = `${DIR}/${key}.in.json`;
  const outPath = `${DIR}/${key}.out.json`;
  const vPath = `${DIR}/${key}.verdict.json`;
  if (!fs.existsSync(outPath)) { report.push(`✗ ${key}: no out.json — the write stage did not finish`); missing++; continue; }

  const input = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const out = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const results = Array.isArray(out) ? out : (out.results || []);
  const byId = new Map(input.map((q) => [q.id, q]));

  const verdicts = fs.existsSync(vPath)
    ? (() => { const v = JSON.parse(fs.readFileSync(vPath, 'utf8')); return new Map((Array.isArray(v) ? v : v.verdicts || []).map((x) => [x.id, x])); })()
    : new Map();

  const seen = new Set();
  for (const r of results) {
    const src = byId.get(r.id);
    total++;
    if (!src) { report.push(`✗ ${key} #${r.id}: not in the batch`); problems++; continue; }
    if (seen.has(r.id)) { report.push(`✗ ${key} #${r.id}: returned twice`); problems++; }
    seen.add(r.id);

    const ex = String(r.explain || '').trim();
    if (!ex) { report.push(`✗ ${key} #${r.id}: empty explanation`); problems++; continue; }
    if (narratesDocument({ explain: ex })) { report.push(`✗ ${key} #${r.id}: still names the document`); problems++; }

    // no number that was not already in the stem, the options or the old text
    const known = numbersIn([src.q, ...(src.options || []), src.explain].join(' '));
    const added = [...numbersIn(ex)].filter((n) => !known.has(n) && n.length > 1);
    if (added.length) { report.push(`✗ ${key} #${r.id}: new number(s) ${added.join(', ')}`); problems++; }

    // the "why the others are wrong" block should account for the distractors
    const lines = (ex.match(/^—/gm) || []).length;
    const wrongs = Math.max(0, (src.options || []).length - 1);
    if (/❌/.test(ex) && lines < wrongs) report.push(`· ${key} #${r.id}: ${lines} of ${wrongs} distractors addressed`);
  }

  for (const q of input) if (!seen.has(q.id)) { report.push(`✗ ${key} #${q.id}: no rewrite returned`); missing++; }

  const refuted = [...verdicts.values()].filter((v) => v.verdict === 'refuted');
  const okCount = [...verdicts.values()].filter((v) => v.verdict === 'ok').length;
  report.push(`  ${key}: ${results.length} rewritten · ${okCount} survived refutation · ${refuted.length} refuted${verdicts.size ? '' : ' (no verdicts yet)'}`);
}

for (const line of report) console.log(line);
console.log(`\n${total} rewrite(s) checked · ${problems} mechanical problem(s) · ${missing} missing`);
process.exitCode = problems || missing ? 1 : 0;
