// Review-first applier for the reader workflow's proposals.
//
//   node apply-rewrites.tmp.mjs                 → writes review.md, changes nothing
//   node apply-rewrites.tmp.mjs --apply 1,2,3   → rewrites ONLY those ids, in place
//
// Every proposal is printed old → new with its basis, and nothing touches a
// bank file unless its id is named on the command line. The regex pass earlier
// tonight wrote first and broke four stems; this one cannot write what has not
// been read.
import fs from 'node:fs';
import { BANK_REGISTRY } from './src/data/bank-registry.generated.js';

const JOURNAL = 'C:/Users/palmz/.claude/projects/C--Users-palmz-Desktop-vet-mock/2ee8829a-8aa3-4695-ae2e-1422b4c01961/subagents/workflows/wf_9cc8ec6b-c07/journal.jsonl';
const OUT = 'C:/Users/palmz/AppData/Local/Temp/claude/C--Users-palmz-Desktop-vet-mock/2ee8829a-8aa3-4695-ae2e-1422b4c01961/scratchpad/thai/review.md';

const rows = fs.readFileSync(JOURNAL, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const flagged = rows.filter((r) => r.type === 'result' && r.result && Array.isArray(r.result.flagged)).flatMap((r) => r.result.flagged);
const read = rows.filter((r) => r.type === 'result' && r.result).reduce((n, r) => n + (r.result.read || 0), 0);

const all = new Map();
for (const e of BANK_REGISTRY) for (const q of await e.load()) all.set(q.id, q);

// De-duplicate by id (a stem could sit in two batches only if the split were
// wrong, but be safe) and drop anything whose id is not a real question.
const byId = new Map();
for (const f of flagged) if (all.has(f.id) && !byId.has(f.id)) byId.set(f.id, f);
const list = [...byId.values()];

const applyIds = new Set((process.argv[process.argv.indexOf('--apply') + 1] || '').split(',').map(Number).filter(Boolean));
const applying = process.argv.includes('--apply');

let md = `# Reader proposals — ${read} stems read, ${list.length} flagged\n\n`;
md += `garbled: ${list.filter((f) => f.severity === 'garbled').length} · awkward: ${list.filter((f) => f.severity === 'awkward').length} · unrecoverable: ${list.filter((f) => f.unrecoverable).length}\n\n`;
for (const f of list.sort((a, b) => (a.severity === 'garbled' ? 0 : 1) - (b.severity === 'garbled' ? 0 : 1) || a.id - b.id)) {
  const q = all.get(f.id);
  md += `## ${f.id} [${q.subject}] ${f.severity}${f.unrecoverable ? ' — UNRECOVERABLE' : ''}\n`;
  md += `- problem: ${f.problem}\n- basis: ${f.basis}\n- OLD: ${q.q}\n- NEW: ${f.rewrite || '(none)'}\n`;
  if (f.optionsRewrite && f.optionsRewrite.length) {
    md += `- OLD opts: ${JSON.stringify(q.options)}\n- NEW opts: ${JSON.stringify(f.optionsRewrite)}\n`;
    if (!q.options || q.options.length !== f.optionsRewrite.length) md += `- ⚠ option COUNT differs — do not apply\n`;
  }
  md += '\n';
}
fs.writeFileSync(OUT, md, 'utf8');
console.log(`read ${read} · flagged ${list.length} · review written to ${OUT}`);

if (!applying) process.exit(0);

// ── apply only what was named ──────────────────────────────────────
const files = fs.readdirSync('src/data').filter((f) => f.startsWith('questions-') && f.endsWith('.js')).map((f) => `src/data/${f}`);
const cache = new Map();
const readF = (f) => { if (!cache.has(f)) cache.set(f, fs.readFileSync(f, 'utf8')); return cache.get(f); };
const jsStr = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

let done = 0; const missed = [];
for (const f of list) {
  if (!applyIds.has(f.id) || f.unrecoverable || !f.rewrite) continue;
  const q = all.get(f.id);
  let placed = false;
  // Banks are stored two ways: hand-written JS with single quotes, and JSON
  // style with double quotes. Try the exact literal in both encodings.
  const forms = [[jsStr, jsStr], [JSON.stringify, JSON.stringify]];
  for (const file of files) {
    const src = readF(file);
    for (const [enc, encNew] of forms) {
      const oldLit = enc(q.q);
      if (!src.includes(oldLit)) continue;
      let next = src.replace(oldLit, encNew(f.rewrite));
      // An empty optionsRewrite means "leave the options alone"; a T/F item
      // has no options at all, and 0 === 0 must not walk into q.options.length.
      if (Array.isArray(f.optionsRewrite) && f.optionsRewrite.length > 0 && Array.isArray(q.options) && f.optionsRewrite.length === q.options.length) {
        for (let i = 0; i < q.options.length; i += 1) {
          const o = enc(q.options[i]); const n = encNew(f.optionsRewrite[i]);
          if (o !== n && next.includes(o)) next = next.replace(o, n);
        }
      }
      cache.set(file, next); placed = true; done += 1; break;
    }
    if (placed) break;
  }
  if (!placed) missed.push(f.id);
}
for (const [file, src] of cache) fs.writeFileSync(file, src, 'utf8');
console.log(`applied ${done}${missed.length ? ` · could not locate verbatim: ${missed.join(', ')}` : ''}`);
