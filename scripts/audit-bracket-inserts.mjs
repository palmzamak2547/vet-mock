// A square bracket inside a quotation mark is an editorial insert wearing the
// lecturer's voice.
//
// docs/SUMMARY-CHECK-STANDARD.md already says it, under "A bracket can delete
// the evidence": a bracketed reading overwrites the sounds that were actually
// there, and everything downstream that counts, greps or reasons about those
// sounds is then working from the guess. The rule was written and then 320 of
// them shipped anyway, because a rule in a prose document is a wish. This is the
// gate.
//
// What counts: a `[...]` span containing Thai letters that sits INSIDE a quoted
// run in a shipped summary. Position is decided by counting quote marks before
// it on the line, which is what the renderer sees too.
//
// What does NOT count:
//   - a timestamp or a timestamp range, `[12:34]` / `[32:46-34:30 และ ...]`,
//     which is an anchor, not speech;
//   - a bracket OUTSIDE the quotes. That is the reading, and the reading is
//     allowed to be in brackets — though prose reads better and Palm asked for
//     prose ("ทำไมต้องมี [] ไม่ใช้คำเต็มๆไปเลย ภาษาเครื่องหรือป่าว"), so the
//     census prints those too. They just do not fail the gate.
//
//   node scripts/audit-bracket-inserts.mjs            # census, worst first
//   node scripts/audit-bracket-inserts.mjs --budget   # gate: may only shrink
//   node scripts/audit-bracket-inserts.mjs --write-budget

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const DIR = 'src/data';
const BUDGET_FILE = 'docs/bracket-insert-budget.json';

const args = process.argv.slice(2);
const budgetMode = args.includes('--budget');
const writeBudget = args.includes('--write-budget');

const THAI = /[฀-๿]/;
const TIMESTAMP = /^\[\d+:\d{2}/;

// A bracket the TRANSCRIBER produced is evidence, not an insert. Auto-captions
// write [เสียงสูดหายใจ] and [เสียงกระแอม] for a breath or a throat-clear, and a
// quote that carries one is byte-faithful — deleting it to satisfy a gate would
// remove part of the record. Those are looked up against the transcript and
// excused; every other bracket is a writer's word.
export function scanLine(line, audioText = null) {
  const inside = [];
  const outside = [];
  for (const m of line.matchAll(/\[[^\[\]\n]{1,80}\]/g)) {
    const span = m[0];
    if (!THAI.test(span)) continue;
    if (TIMESTAMP.test(span)) continue;
    // An odd number of quote marks before the bracket means it opened a quote
    // that has not closed yet, so the bracket is being spoken.
    const quotesBefore = (line.slice(0, m.index).match(/"/g) || []).length;
    if (quotesBefore % 2 === 1 && audioText && audioText.includes(span.replace(/\s+/g, ''))) continue;
    (quotesBefore % 2 === 1 ? inside : outside).push(span);
  }
  return { inside, outside };
}

const audioCache = new Map();
function audioFor(id) {
  if (audioCache.has(id)) return audioCache.get(id);
  const p = `data-cache/plain/${id}.txt`;
  const t = existsSync(p) ? readFileSync(p, 'utf8').replace(/\s+/g, '') : null;
  audioCache.set(id, t);
  return t;
}

function measure(file) {
  const src = readFileSync(`${DIR}/${file}`, 'utf8');
  let inside = 0; let outside = 0; const sample = [];
  let id = null;
  for (const line of src.split('\n')) {
    const idm = line.match(/^\s*['"]([A-Za-z0-9_-]{11})['"]\s*:/);
    if (idm) id = idm[1];
    const r = scanLine(line, id ? audioFor(id) : null);
    inside += r.inside.length;
    outside += r.outside.length;
    for (const s of r.inside) if (sample.length < 4) sample.push(s);
  }
  return { file, inside, outside, sample };
}

const files = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => /^video-summaries-/.test(f) && f.endsWith('.js'))
  : [];

const rows = files.map(measure).filter((r) => r.inside || r.outside);
rows.sort((a, b) => b.inside - a.inside);
const total = rows.reduce((a, r) => a + r.inside, 0);
const totalOut = rows.reduce((a, r) => a + r.outside, 0);

if (writeBudget) {
  const budget = {};
  for (const r of rows) if (r.inside > 0) budget[r.file] = r.inside;
  writeFileSync(BUDGET_FILE, `${JSON.stringify({
    note: 'Bracketed editorial inserts sitting INSIDE quoted speech, per shipped '
      + 'summary file. Ratchet: a number may only go down, and a file may only '
      + 'leave. See docs/SUMMARY-CHECK-STANDARD.md, "A bracket can delete the evidence".',
    measured: new Date().toISOString().slice(0, 10),
    total,
    files: budget,
  }, null, 1)}\n`);
  console.log(`wrote ${BUDGET_FILE}: ${Object.keys(budget).length} files, ${total} inserts`);
  process.exit(0);
}

if (budgetMode) {
  const budget = existsSync(BUDGET_FILE)
    ? JSON.parse(readFileSync(BUDGET_FILE, 'utf8'))
    : { files: {} };
  let failed = false;
  for (const r of rows) {
    const cap = budget.files[r.file] ?? 0;
    if (r.inside > cap) {
      console.error(`✖ ${r.file}: ${r.inside} bracketed inserts inside quoted speech, budget ${cap}.`);
      for (const s of r.sample) console.error(`    ${s}`);
      failed = true;
    }
  }
  console.log(`${rows.length} summary files · ${total} inserts inside quotes · ${totalOut} outside`);
  if (failed) {
    console.error('A bracket inside a quotation mark rewrites what the lecturer said. '
      + 'Put the audio inside the marks and the reading outside.');
    process.exit(1);
  }
  console.log('✅ no summary exceeds its bracket-insert budget.');
  process.exit(0);
}

for (const r of rows) {
  console.log(`${String(r.inside).padStart(4)} in-quote ${String(r.outside).padStart(4)} outside  ${r.file}`);
  for (const s of r.sample) console.log(`       ${s}`);
}
console.log(`\n${rows.length} summary files · ${total} inside quoted speech · ${totalOut} outside`);
