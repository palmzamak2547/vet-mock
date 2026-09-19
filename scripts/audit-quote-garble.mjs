// A garbled quote is not a quote.
//
// Palm read two summaries that shipped on 2026-09-19 and said "ทำไมเริ่มมีภาษา
// แปลกๆหลุดมาอีกแล้ว" and "มันดูรกมาก". He was right, and the measurement is
// blunt: 474 fused Thai+Latin tokens inside quotation marks in one file, 282 in
// the other, and 9–23% of every quoted span in the whole corpus carries one.
//
// The rule that produced it was almost right. SUMMARY-CHECK-STANDARD says a
// garbled word stays garbled inside the marks and the reading goes outside
// them, which protects fidelity — but it never said what to do when the WHOLE
// sentence came out as `produิce`, `byัก`, `epิumsแวareมน`, `การทำsurรี่`. So the
// writers quoted the noise and then explained it underneath:
//
//   เสียงที่ได้ยินคือ **"...ที่produิceมาจากแพนเคียส... แล้วก็พวกbyักต่างๆ..."**
//   คือ **เอนไซม์จากตับอ่อน และสารที่มาจากตับ**
//
// The meaning is already there in plain Thai. The quote in front of it is what
// a student has to read past. A quotation mark is a promise that the reader is
// hearing the lecturer; if the transcription is mush, the promise is not kept
// by printing the mush.
//
// So: write the content as prose and keep the anchor, or keep the raw sound in
// the closing note when the disputed TERM is the point. Not both, not in the
// body.
//
// What counts: a Thai letter directly against a Latin letter, inside a quoted
// run of a shipped summary. That pattern does not occur in written Thai — it is
// the signature of the transcriber fusing a half-heard English word into a Thai
// one. Latin words standing on their own are normal in a vet lecture and are
// not counted.
//
//   node scripts/audit-quote-garble.mjs                # census, worst first
//   node scripts/audit-quote-garble.mjs --budget       # gate: may only shrink
//   node scripts/audit-quote-garble.mjs --write-budget

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const DIR = 'src/data';
const BUDGET_FILE = 'docs/quote-garble-budget.json';

const args = process.argv.slice(2);
const budgetMode = args.includes('--budget');
const writeBudget = args.includes('--write-budget');

const FUSED = /[฀-๿][A-Za-z]|[A-Za-z][฀-๿]/g;

export function garbleOnLine(line) {
  // Both sides of the quote character, because counting one side is how this
  // gate lied twice. Splitting gives alternating outside/inside segments, the
  // same parity the renderer sees: odd indexes are quoted speech, even indexes
  // are the writer's own prose.
  //
  // On 2026-09-19, AFTER this gate shipped green, Palm read the summaries again
  // and said "why am I finding strange words again, every single round". He was
  // right, and the shape was the same as the square-bracket bug that morning:
  // the rule was enforced on one side only. 50 distinct fused tokens across 64
  // places were sitting in ORDINARY PROSE, where nothing looked. Worse, the
  // standard sent them there: it says to record a raw sound in the closing note,
  // which is outside quotes by definition, so tables of captured noise grew
  // there unwatched. Prose makes no fidelity promise, so a fused token there is
  // never evidence - it is only a word the reader cannot read.
  const parts = line.split('"');
  let tokens = 0; let spans = 0; let outside = 0;
  for (let i = 0; i < parts.length; i += 1) {
    const n = (parts[i].match(FUSED) || []).length;
    if (!n) continue;
    if (i % 2 === 1) { tokens += n; spans += 1; } else { outside += n; }
  }
  return { tokens, spans, outside };
}

function measure(file) {
  const src = readFileSync(`${DIR}/${file}`, 'utf8');
  let tokens = 0; let spans = 0; let outside = 0; const sample = [];
  for (const line of src.split('\n')) {
    const r = garbleOnLine(line);
    tokens += r.tokens;
    spans += r.spans;
    outside += r.outside;
    if (r.tokens >= 3 && sample.length < 3) {
      const parts = line.split('"');
      for (let i = 1; i < parts.length; i += 2) {
        if ((parts[i].match(FUSED) || []).length >= 3) { sample.push(parts[i].slice(0, 70)); break; }
      }
    }
  }
  return { file, tokens, spans, outside, sample };
}

const files = existsSync(DIR)
  ? readdirSync(DIR).filter((f) => /^video-summaries-/.test(f) && f.endsWith('.js') && !f.includes('meta'))
  : [];

const rows = files.map(measure).filter((r) => r.tokens || r.outside);
rows.sort((a, b) => b.tokens - a.tokens);
const total = rows.reduce((a, r) => a + r.tokens, 0);
const totalSpans = rows.reduce((a, r) => a + r.spans, 0);

if (writeBudget) {
  const budget = {};
  for (const r of rows) budget[r.file] = r.tokens;
  const budgetOut = {};
  for (const r of rows) if (r.outside) budgetOut[r.file] = r.outside;
  writeFileSync(BUDGET_FILE, `${JSON.stringify({
    note: 'Fused Thai+Latin tokens sitting INSIDE quoted speech, per shipped summary '
      + 'file. A quotation mark promises the reader is hearing the lecturer; a '
      + 'sentence transcribed as `produิce` / `การทำsurรี่` does not keep that promise. '
      + 'Ratchet: a number may only go down and a file may only leave. Write the '
      + 'reading as prose and keep the anchor, or put the raw sound in the closing '
      + 'note — not both, and not in the body. See docs/SUMMARY-CHECK-STANDARD.md, '
      + '"A garbled quote is not a quote".',
    measured: new Date().toISOString().slice(0, 10),
    total,
    totalSpans,
    totalOutside: rows.reduce((a, r) => a + r.outside, 0),
    files: budget,
    outsideFiles: budgetOut,
  }, null, 1)}\n`);
  console.log(`wrote ${BUDGET_FILE}: ${rows.length} files, ${total} fused tokens in ${totalSpans} quoted spans`);
  process.exit(0);
}

if (budgetMode) {
  const budget = existsSync(BUDGET_FILE)
    ? JSON.parse(readFileSync(BUDGET_FILE, 'utf8'))
    : { files: {} };
  let failed = false;
  for (const r of rows) {
    const cap = budget.files[r.file] ?? 0;
    if (r.tokens > cap) {
      console.error(`✖ ${r.file}: ${r.tokens} fused tokens inside quoted speech, budget ${cap}.`);
      for (const s of r.sample) console.error(`    "${s}"`);
      failed = true;
    }
    const capOut = budget.outsideFiles?.[r.file] ?? 0;
    if (r.outside > capOut) {
      console.error(`✖ ${r.file}: ${r.outside} fused tokens in ordinary prose, budget ${capOut}`
        + ' - prose makes no fidelity promise, so a word the reader cannot read has no reason to be there.');
      failed = true;
    }
  }
  console.log(`${rows.length} summary files · ${total} fused tokens inside ${totalSpans} quoted spans · `
    + `${rows.reduce((a, r) => a + r.outside, 0)} in ordinary prose`);
  if (failed) {
    console.error('A quote the reader cannot read is not evidence, it is noise. Write the '
      + 'reading as ordinary Thai and keep the timestamp; put the raw sound in the closing '
      + 'note only when the disputed word is the point.');
    process.exit(1);
  }
  console.log('✅ no summary exceeds its quote-garble budget.');
  process.exit(0);
}

for (const r of rows) {
  console.log(`${String(r.tokens).padStart(5)} tokens ${String(r.spans).padStart(4)} spans  ${r.file}`);
  for (const s of r.sample) console.log(`        "${s}"`);
}
console.log(`\n${rows.length} summary files · ${total} fused tokens inside ${totalSpans} quoted spans`);
