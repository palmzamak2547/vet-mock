#!/usr/bin/env node
// Land the table-reference fixes a refuter cleared. Anything rejected keeps its
// current text: it stays in the defect count, visible, rather than closed by a
// version nobody vouched for.
import fs from 'node:fs';
import { bankFiles, readBank, updateStems, updateField, removeQuestions } from './lib/bank-file.mjs';
import { namesDocument, narratesDocument } from './lib/question-standard.mjs';

const DIR = '.table-fix';
const WRITE = process.argv.includes('--write');
if (!fs.existsSync(`${DIR}/out.json`)) { console.error('no out.json — the fix stage has not finished'); process.exit(1); }
if (!fs.existsSync(`${DIR}/verdict.json`)) { console.error('no verdict.json — nothing lands unrefuted'); process.exit(1); }

const out = JSON.parse(fs.readFileSync(`${DIR}/out.json`, 'utf8'));
const v = JSON.parse(fs.readFileSync(`${DIR}/verdict.json`, 'utf8'));
const verdicts = new Map((Array.isArray(v) ? v : v.verdicts || []).map((x) => [`${x.kind}:${x.id}`, x]));

const reword = new Map(), drop = new Set(), explain = new Map(), held = [];

for (const s of (out.stems || [])) {
  const verdict = verdicts.get(`stem:${s.id}`);
  if (!verdict || verdict.verdict !== 'ok') { held.push(`stem #${s.id} ${(verdict?.problem || 'no verdict').slice(0, 72)}`); continue; }
  if (s.action === 'drop') drop.add(s.id);
  else if (s.q && !namesDocument({ q: s.q })) reword.set(s.id, s.q);
  else held.push(`stem #${s.id} still names a document`);
}
for (const e of (out.explains || [])) {
  const verdict = verdicts.get(`explain:${e.id}`);
  if (!verdict || verdict.verdict !== 'ok') { held.push(`explain #${e.id} ${(verdict?.problem || 'no verdict').slice(0, 72)}`); continue; }
  if (e.explain && !narratesDocument({ explain: e.explain })) explain.set(e.id, e.explain);
  else held.push(`explain #${e.id} still narrates a document`);
}

console.log(`reword ${reword.size} · drop ${drop.size} · explain ${explain.size} · held ${held.length}`);
for (const h of held) console.log(`  · ${h}`);
if (!WRITE) { console.log('\n(dry run)'); process.exit(0); }

let rw = 0, dr = 0, ex = 0;
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  const ids = new Set(questions.map((q) => q.id));
  const mineR = new Map([...reword].filter(([id]) => ids.has(id)));
  const mineE = new Map([...explain].filter(([id]) => ids.has(id)));
  const mineD = new Set([...drop].filter((id) => ids.has(id)));
  if (!mineR.size && !mineE.size && !mineD.size) continue;
  const a = updateStems(f, mineR);
  const b = updateField(f, 'explain', mineE);
  const c = removeQuestions(f, mineD);
  if (a !== mineR.size || b !== mineE.size || c !== mineD.size) {
    console.error(`✗ ${f}: stems ${a}/${mineR.size}, explains ${b}/${mineE.size}, drops ${c}/${mineD.size}`);
    process.exit(1);
  }
  rw += a; ex += b; dr += c;
}
console.log(`\napplied: ${rw} reworded, ${ex} explanations, ${dr} dropped`);

let left = 0;
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  left += questions.filter((q) => namesDocument(q) || narratesDocument(q)).length;
}
console.log(`still referring to a document: ${left}`);
