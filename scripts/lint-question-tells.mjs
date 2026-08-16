// Catch the giveaways a machine can catch, before paying a reader to find them.
//
// The first two question runs sent every drafted item to a solver whose job was
// to crack it from wording alone. That solver is worth its cost for the tells
// that need judgement — an option assembled from phrases the distractors reuse,
// a stem that answers a sibling question. It is not worth its cost for the ones
// that are arithmetic: an option nobody else's length is near, a catch-all, two
// options that say the same thing, a stem that repeats one option's rare word.
//
// Of 128 flagged in the Histology run, 43 were of the arithmetic kind. Those
// are now removed here, for nothing.
//
//   node scripts/lint-question-tells.mjs <dir-of-*.q.json> [--write]

import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!DIR) { console.error('usage: lint-question-tells.mjs <dir> [--write]'); process.exit(2); }

const CATCH_ALL = /(ถูกทุกข้อ|ผิดทุกข้อ|ไม่มีข้อใดถูก|ทั้งข้อ\s*[กขคง]\s*และ|all of the above|none of the above)/i;

const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const words = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 3));

function tellsFor(q) {
  const out = [];
  const opts = q.options || [];
  if (opts.length < 4 || opts.length > 5) return ['malformed'];

  if (opts.some((o) => CATCH_ALL.test(o))) out.push('catch-all-option');

  // Two options that say the same thing cannot both be the answer, so the
  // reader can strike both without knowing anything.
  const seen = new Map();
  for (const o of opts) {
    const k = norm(o);
    if (seen.has(k)) out.push('duplicate-options');
    seen.set(k, true);
  }

  const lens = opts.map((o) => o.length);
  const correct = lens[q.answer];
  const others = lens.filter((_, i) => i !== q.answer);
  const mean = others.reduce((a, b) => a + b, 0) / others.length;
  if (correct > mean * 1.5) out.push('longest-option');
  // The mirror case: three padded distractors around a terse key reads the
  // same way to a test-wise student.
  if (correct * 1.5 < mean) out.push('shortest-option');

  // A rare word that appears in the stem and in exactly one option.
  const stem = words(q.q);
  const only = opts.map((o) => words(o));
  for (const w of stem) {
    const hits = only.map((s, i) => (s.has(w) ? i : -1)).filter((i) => i >= 0);
    if (hits.length === 1 && hits[0] === q.answer) { out.push('answer-in-stem'); break; }
  }

  return [...new Set(out)];
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.q.json'));
let total = 0, flagged = 0;
const counts = {};

for (const f of files) {
  const p = path.join(DIR, f);
  const o = JSON.parse(fs.readFileSync(p, 'utf8'));
  const keep = [];
  for (const q of o.questions || []) {
    total++;
    const tells = tellsFor(q);
    if (!tells.length) { keep.push(q); continue; }
    flagged++;
    for (const t of tells) counts[t] = (counts[t] || 0) + 1;
  }
  if (WRITE && keep.length !== (o.questions || []).length) {
    o.questions = keep;
    fs.writeFileSync(p, JSON.stringify(o, null, 1));
  }
}

console.log(`${total} question(s), ${flagged} carry a mechanical tell`);
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
if (!WRITE && flagged) console.log('(dry run — pass --write to drop them)');
