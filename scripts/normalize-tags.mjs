#!/usr/bin/env node
// ============================================================
// normalize-tags.mjs — one spelling per idea, inside the tags array only
// ============================================================
// Usage: node scripts/normalize-tags.mjs [--write]
//
// Twenty agents tagging in parallel produced "Staphylococcus-aureus" in one
// batch and "staphylococcus-aureus" in another, and the corpus already held 113
// such pairs of its own. A tag spelled two ways halves the search that finds it.
//
// ⚠️ The first version of this did `src.split("'ibd'").join("'IBD'")` over the
// whole file. Every OTHER field holding that quoted value went with it: 24
// topic ids became "IBD", and three student-visible option strings became
// "trichomonas", "salmonella" and "imha". An unscoped replace has no way to
// know a string is a tag.
//
// So this rewrites the tags ARRAY, located per question id, and touches nothing
// else in the file by construction.
// ============================================================

import fs from 'node:fs';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { buildTagResolver } from './lib/tag-case.mjs';

const WRITE = process.argv.includes('--write');

const banks = [];
const all = [];
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  banks.push({ f, questions });
  for (const q of questions) all.push(...(q.tags || []));
}
const { resolve, conflicts } = buildTagResolver(all);
console.log(`${all.length} tag uses · ${new Set(all).size} distinct · ${conflicts.size} idea(s) spelled two ways`);
for (const [k, w] of [...conflicts].slice(0, 8)) console.log(`  ${k} → "${w}"`);

/** Replace the tags array of one id, and only that. */
function rewriteTags(src, id, tags) {
  const at = src.search(new RegExp(String.raw`(?:"id"|\bid)\s*:\s*${id}\b`));
  if (at === -1) return null;
  const key = new RegExp(String.raw`(?:"tags"|'tags'|\btags)\s*:\s*\[`).exec(src.slice(at));
  if (!key) return null;
  const open = at + key.index + key[0].length - 1;
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'") {                      // skip string contents
      const quote = c;
      for (i++; i < src.length; i++) { if (src[i] === '\\') { i++; continue; } if (src[i] === quote) break; }
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (!depth) break; }
  }
  if (depth !== 0) return null;
  const body = src.slice(open + 1, i);
  const quoted = /"/.test(body.slice(0, 8)) || !/'/.test(body);
  const multiline = /\n/.test(body);
  const indent = (body.match(/\n(\s*)/) || [, '      '])[1];
  const lit = (t) => (quoted ? JSON.stringify(t) : `'${t.replace(/'/g, "\'")}'`);
  const inner = multiline
    ? `\n${tags.map((t) => indent + lit(t)).join(',\n')}\n${indent.slice(0, -2)}`
    : tags.map(lit).join(',');
  return src.slice(0, open + 1) + inner + src.slice(i);
}

let changed = 0, files = 0;
for (const { f, questions } of banks) {
  const need = questions.filter((q) => (q.tags || []).some((t) => resolve(t) !== t));
  if (!need.length) continue;
  let src = fs.readFileSync(f, 'utf8');
  let hits = 0;
  for (const q of need) {
    const next = rewriteTags(src, q.id, q.tags.map(resolve));
    if (next === null) { console.error(`✗ #${q.id}: could not locate its tags array`); process.exit(1); }
    src = next; hits++;
  }
  changed += hits; files++;
  if (WRITE) fs.writeFileSync(f, src);
}
console.log(`\n${changed} question(s) across ${files} file(s)${WRITE ? ' rewritten' : ' would change (dry run)'}`);

if (WRITE) {
  const after = [];
  for (const f of bankFiles()) { const { questions } = await readBank(f); for (const q of questions) after.push(...(q.tags || [])); }
  const { conflicts: left } = buildTagResolver(after);
  console.log(`remaining split spellings: ${left.size}`);
  if (left.size) process.exit(1);
}
