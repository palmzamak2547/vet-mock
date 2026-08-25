#!/usr/bin/env node
// Append the fifth options a refuter cleared. Appending keeps the recorded
// answer index valid; Question.jsx shuffles options at render anyway, and its
// pinned "tail" is only catch-all text, which is banned here.
import fs from 'node:fs';
import { bankFiles, readBank } from './lib/bank-file.mjs';

const DIR = '.opt-fix';
const WRITE = process.argv.includes('--write');
const input = new Map(JSON.parse(fs.readFileSync(`${DIR}/in.json`, 'utf8')).map((q) => [q.id, q]));
const out = JSON.parse(fs.readFileSync(`${DIR}/out.json`, 'utf8'));
const results = Array.isArray(out) ? out : (out.results || []);
if (!fs.existsSync(`${DIR}/verdict.json`)) { console.error('no verdict file — nothing lands unrefuted'); process.exit(1); }
const v = JSON.parse(fs.readFileSync(`${DIR}/verdict.json`, 'utf8'));
const verdicts = new Map((Array.isArray(v) ? v : v.verdicts || []).map((x) => [x.id, x]));

const accept = new Map();
const held = [];
for (const r of results) {
  if (r.action !== 'add') { held.push(`#${r.id} skipped by the writer`); continue; }
  const verdict = verdicts.get(r.id);
  if (!verdict || verdict.verdict !== 'ok') { held.push(`#${r.id} ${(verdict?.problem || 'no verdict').slice(0, 74)}`); continue; }
  accept.set(r.id, String(r.option).trim());
}
console.log(`accept ${accept.size} · held ${held.length}`);
for (const h of held) console.log(`  · ${h}`);
if (!WRITE) { console.log('\n(dry run)'); process.exit(0); }

let n = 0;
for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  const mine = questions.filter((q) => accept.has(q.id) && q.options.length === 4);
  if (!mine.length) continue;
  let src = fs.readFileSync(file, 'utf8');
  for (const q of mine) {
    const at = src.search(new RegExp(String.raw`(?:"id"|\bid)\s*:\s*${q.id}\b`));
    if (at === -1) { console.error(`✗ #${q.id} not found`); process.exit(1); }
    // find this question's options array and append before its closing bracket
    const optKey = src.search(new RegExp(String.raw`(?:"options"|\boptions)\s*:\s*\[`, 'g'));
    const start = src.indexOf('[', src.search(new RegExp(String.raw`(?:"options"|\boptions)\s*:\s*\[`)) );
    const from = src.indexOf('options', at);
    const open = src.indexOf('[', from);
    let depth = 0, i = open;
    for (; i < src.length; i++) { if (src[i] === '[') depth++; else if (src[i] === ']') { depth--; if (!depth) break; } }
    const body = src.slice(open + 1, i);
    const quoted = /^\s*"/.test(body);
    const indentM = body.match(/\n(\s*)["']/);
    const indent = indentM ? indentM[1] : '  ';
    const literal = quoted ? JSON.stringify(accept.get(q.id)) : `'${accept.get(q.id).replace(/'/g, "\'")}'`;
    const trimmed = body.replace(/\s*$/, '');
    const multiline = /\n/.test(body);
    const insert = multiline ? `${trimmed},\n${indent}${literal}\n${indent.slice(0, -2)}` : `${trimmed}, ${literal}`;
    src = `${src.slice(0, open + 1)}${insert}${src.slice(i)}`;
    n++;
  }
  fs.writeFileSync(file, src);
}
console.log(`\nappended ${n}`);

let five = 0, bad = 0;
for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  for (const q of questions) if (accept.has(q.id)) {
    if (q.options.length === 5 && q.options[4] === accept.get(q.id)) five++;
    else { console.error(`✗ #${q.id}: ${q.options.length} options`); bad++; }
  }
}
console.log(`verified: ${five}/${accept.size} now five-option`);
if (bad) process.exit(1);
