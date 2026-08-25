#!/usr/bin/env node
// Insert the generated tags into their questions. Runs only after
// verify-tags.mjs is clean — a malformed or container tag costs a student the
// search that would have found the question.
import fs from 'node:fs';
import { bankFiles, readBank } from './lib/bank-file.mjs';

const DIR = '.tags-fix';
const WRITE = process.argv.includes('--write');
const batches = JSON.parse(fs.readFileSync(`${DIR}/batches.json`, 'utf8'));

const tags = new Map();
for (const b of batches) {
  const p = `${DIR}/${b.key}.out.json`;
  if (!fs.existsSync(p)) { console.error(`✗ ${b.key}: no out.json`); process.exit(1); }
  const out = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const r of (Array.isArray(out) ? out : out.results || [])) {
    if (Array.isArray(r.tags) && r.tags.length >= 2) tags.set(r.id, r.tags);
  }
}
console.log(`tags for ${tags.size} question(s)`);
if (!WRITE) { console.log('(dry run — pass --write)'); process.exit(0); }

let n = 0;
for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  const mine = questions.filter((q) => tags.has(q.id) && !(q.tags || []).length);
  if (!mine.length) continue;
  let src = fs.readFileSync(file, 'utf8');
  for (const q of mine) {
    const at = src.search(new RegExp(String.raw`(?:"id"|\bid)\s*:\s*${q.id}\b`));
    if (at === -1) { console.error(`✗ #${q.id} not found in ${file}`); process.exit(1); }
    const eol = src.indexOf('\n', at);
    const indent = (src.slice(src.lastIndexOf('\n', at) + 1).match(/^\s*/) || [''])[0];
    const quoted = src.slice(at, at + 4) === '"id"';
    const key = quoted ? '"tags"' : 'tags';
    const value = quoted
      ? JSON.stringify(tags.get(q.id))
      : `[${tags.get(q.id).map((t) => `'${t.replace(/'/g, "\'")}'`).join(', ')}]`;
    src = `${src.slice(0, eol + 1)}${indent}${key}: ${value},\n${src.slice(eol + 1)}`;
    n++;
  }
  fs.writeFileSync(file, src);
}
console.log(`applied ${n}`);

let have = 0, want = 0;
for (const file of bankFiles()) {
  const { questions } = await readBank(file);
  for (const q of questions) if (tags.has(q.id)) { want++; if ((q.tags || []).length >= 2) have++; }
}
console.log(`verified in the banks: ${have}/${want}`);
if (have !== want) process.exit(1);
