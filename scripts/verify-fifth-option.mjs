#!/usr/bin/env node
// ============================================================
// verify-fifth-option.mjs — the arithmetic a refuter should not have to do
// ============================================================
// Usage: node scripts/verify-fifth-option.mjs
//
// The refuter judges whether a new option could be defensible. This judges what
// is countable: banned markers, duplicates, and the length tells that let a
// student pick the answer without knowing anything.
// ============================================================

import fs from 'node:fs';

const DIR = '.opt-fix';
const input = new Map(JSON.parse(fs.readFileSync(`${DIR}/in.json`, 'utf8')).map((q) => [q.id, q]));
const out = JSON.parse(fs.readFileSync(`${DIR}/out.json`, 'utf8'));
const results = Array.isArray(out) ? out : (out.results || []);
const verdicts = fs.existsSync(`${DIR}/verdict.json`)
  ? new Map((() => { const v = JSON.parse(fs.readFileSync(`${DIR}/verdict.json`, 'utf8')); return (Array.isArray(v) ? v : v.verdicts || []).map((x) => [x.id, x]); })())
  : new Map();

const BANNED = [
  [/★|\*\*/, 'emphasis marker'],
  [/…|\.\.\./, 'ellipsis'],
  [/ · /, 'middle-dot separator'],
  [/ถูกทุกข้อ|ผิดทุกข้อ|ไม่มีข้อใดถูก|all of the above|none of the above/i, 'catch-all'],
];

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').trim();

let checked = 0, problems = 0;
for (const r of results) {
  const q = input.get(r.id);
  if (!q) { console.log(`✗ #${r.id}: not in the batch`); problems++; continue; }
  if (r.action !== 'add') continue;
  checked++;

  const opt = String(r.option || '').trim();
  if (!opt) { console.log(`✗ #${r.id}: add with no option`); problems++; continue; }

  for (const [re, why] of BANNED) if (re.test(opt)) { console.log(`✗ #${r.id}: ${why}`); problems++; }

  if (q.options.some((o) => norm(o) === norm(opt))) { console.log(`✗ #${r.id}: duplicates an existing option`); problems++; }

  // length tells, measured over the finished five
  const five = [...q.options, opt];
  const lens = five.map((o) => o.length);
  const answerLen = lens[q.answer];
  const others = lens.filter((_, i) => i !== q.answer);
  const mean = others.reduce((a, b) => a + b, 0) / others.length;
  if (mean > 0 && answerLen / mean > 1.5) { console.log(`✗ #${r.id}: the answer becomes ${Math.round(100 * answerLen / mean)}% of the distractor mean`); problems++; }
  const optMean = q.options.reduce((a, o) => a + o.length, 0) / q.options.length;
  if (optMean > 0 && (opt.length > optMean * 1.8 || opt.length < optMean * 0.4)) {
    console.log(`· #${r.id}: new option ${opt.length} chars against a mean of ${Math.round(optMean)} — visible as an odd one out`);
  }
  if (!r.why_wrong) { console.log(`✗ #${r.id}: no reason given for why it is wrong`); problems++; }
}

const cleared = results.filter((r) => r.action === 'add' && verdicts.get(r.id)?.verdict === 'ok').length;
const rejected = results.filter((r) => r.action === 'add' && verdicts.get(r.id)?.verdict === 'refuted').length;
console.log(`\n${results.length} decided · ${checked} options written · ${problems} mechanical problem(s)`);
console.log(`refuter: ${cleared} cleared · ${rejected} rejected${verdicts.size ? '' : ' (no verdicts yet)'}`);
process.exitCode = problems ? 1 : 0;
