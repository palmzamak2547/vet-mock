// Do the quotation marks in a lecture summary hold what was said?
//
// docs/SUMMARY-CHECK-STANDARD.md, defect class 10: a quote that has been
// smoothed, de-stuttered, or had an ASR garble quietly corrected is not a
// quote. The class was written from two files measured by hand — 372 of 719
// spans, and 137 of 389. This is the same measurement over every summary that
// has a transcript beside it, so the debt is a number instead of an impression.
//
// WHITESPACE IS NOT EVIDENCE, and that is the one judgement built into this
// script. Thai is written without spaces between words; every space in an
// auto-caption is an artifact of the transcriber, not something the lecturer
// did. So `อัน นี้` and `อันนี้` are the same utterance and the comparison
// ignores spacing on both sides. Two write passes on the same day disagreed
// about this — one treated 9 such spans as drift and fixed them, the other
// accepted 256 — and the disagreement cost real time. Restoring the ASR's
// spacing into a quote makes the page read like a typo and proves nothing
// about speech.
//
// What IS counted is a changed character: a garble corrected (`วิลาย` written
// as `วิลลัส`), a filler deleted, a stutter tidied, a bracketed guess placed
// inside the marks. Those are the sins the class was written for.
//
// This script reports and gates. It does not fix: the prescribed repair — put
// the audio inside the marks and the reading outside — needs the transcript and
// a judgement per span.
//
//   node scripts/audit-quote-fidelity.mjs                  # census, worst first
//   node scripts/audit-quote-fidelity.mjs <id> [<id>...]   # just these
//   node scripts/audit-quote-fidelity.mjs --budget         # gate: may only shrink
//   node scripts/audit-quote-fidelity.mjs --write-budget   # after lowering it

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const GEN = 'data-cache/generated';
const PLAIN = 'data-cache/plain';
const BUDGET_FILE = 'docs/quote-fidelity-budget.json';

const args = process.argv.slice(2);
const budgetMode = args.includes('--budget');
const writeBudget = args.includes('--write-budget');
const only = new Set(args.filter((a) => !a.startsWith('--')));

const THAI = /[฀-๿]/;

function measure(id) {
  const md = readFileSync(`${GEN}/${id}.md`, 'utf8');
  const plain = readFileSync(`${PLAIN}/${id}.txt`, 'utf8');
  // The transcript's own markup is not speech: `# ...` headers and inline
  // [m:ss] cues. Missing this step reported every quote that spans a cue
  // marker as a defect, which is how this audit first lied to me.
  const joined = plain
    .replace(/^#.*$/gm, '')
    .replace(/\[\d+:\d\d(?::\d\d)?\]/g, '')
    .replace(/\s+/g, '');

  const spans = [...md.matchAll(/"([^"\n]{2,})"/g)].map((m) => m[1]);
  let present = 0; let absent = 0; const sample = [];
  for (const s of spans) {
    // A span carrying markdown bold or a table pipe was mis-paired by the
    // extractor, not written by a careless hand; a pure-ASCII span is a term or
    // a slide caption, which Thai audio has no reason to contain.
    if (s.includes('**') || s.includes('|')) continue;
    if (!THAI.test(s)) continue;
    if (joined.includes(s.replace(/\s+/g, ''))) { present += 1; continue; }
    absent += 1;
    if (sample.length < 3) sample.push(s.slice(0, 60));
  }
  return { id, spans: present + absent, present, absent, sample };
}

// data-cache/ is gitignored, so a fresh clone (CI) has neither the summaries
// nor the transcripts. Say so and pass, rather than crash or pretend to check.
if (!existsSync(GEN) || !existsSync(PLAIN)) {
  console.log('data-cache/ is not present, so quote fidelity cannot be checked here. '
    + 'Run this where the transcripts live.');
  process.exit(0);
}

const ids = readdirSync(GEN)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .filter((id) => existsSync(`${PLAIN}/${id}.txt`))
  .filter((id) => !only.size || only.has(id));

const rows = ids.map(measure).filter((r) => r.spans > 0);
rows.sort((a, b) => b.absent - a.absent);
const tot = rows.reduce((a, r) => ({ spans: a.spans + r.spans, absent: a.absent + r.absent }), { spans: 0, absent: 0 });

if (budgetMode) {
  const budget = JSON.parse(readFileSync(BUDGET_FILE, 'utf8'));
  let failed = false;
  for (const r of rows) {
    const cap = budget.files[r.id] ?? 0;
    if (r.absent > cap) {
      console.error(`✖ ${r.id}: ${r.absent} quoted spans are not in the audio, budget ${cap}.`);
      for (const s of r.sample) console.error(`    ${s}`);
      failed = true;
    }
  }
  console.log(`${rows.length} summaries · ${tot.spans} Thai quoted spans · ${tot.absent} not in the audio`);
  if (failed) {
    console.error('\nA quote must hold what was said. Put the audio inside the marks and the');
    console.error('reading outside them, or drop the marks. Never raise a budget.');
    process.exitCode = 1;
  } else {
    console.log('✅ no summary exceeds its quote-fidelity budget.');
  }
} else {
  for (const r of rows) {
    if (!r.absent) continue;
    console.log(`${r.id} thai-spans=${String(r.spans).padStart(4)} in-audio=${String(r.present).padStart(4)} not-in-audio=${String(r.absent).padStart(4)}`);
    for (const s of r.sample) console.log(`    ${s}`);
  }
  const clean = rows.filter((r) => !r.absent).length;
  console.log(`\n${rows.length} summaries with Thai quotes · ${tot.spans} spans · ${tot.absent} not in the audio · ${clean} files clean`);
}

if (writeBudget) {
  const files = {};
  for (const r of rows) if (r.absent > 0) files[r.id] = r.absent;
  writeFileSync(BUDGET_FILE, `${JSON.stringify({
    note: 'Quoted spans that are not in the clip transcript, per summary. Whitespace is ignored '
      + '(Thai spacing in an auto-caption is the transcriber\'s artifact, not speech); a changed '
      + 'character is what counts. Ratchet: a number may only go down, and a file may only leave. '
      + 'See docs/SUMMARY-CHECK-STANDARD.md class 10.',
    measured: new Date().toISOString().slice(0, 10),
    total: tot.absent,
    files,
  }, null, 1)}\n`);
  console.log(`wrote ${BUDGET_FILE}: ${Object.keys(files).length} files, ${tot.absent} spans`);
}
