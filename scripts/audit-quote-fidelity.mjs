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
const FUSED = /[฀-๿][A-Za-z]|[A-Za-z][฀-๿]/;
// A line that tells the reader the sound was incomplete is doing its job.
// `เสียงที่ได้คือ` is the same declaration in another hand — a summary that
// names the sound it captured is doing its job whichever phrasing it reaches
// for, and leaving this one out reported a correctly-written line as a defect.
const DECLARES_GARBLE = /ฟังไม่ชัด|ออกเสียง|ออกมาเป็น|ได้ยิน|เสียงที่|เสียงในคลิป|เสียงตรงนี้|คลิปเขียน|ยืนยัน|สะกด|อ่านได้ว่า|อ่านไม่ออก|อ่านได้แค่|ไม่ชัดพอ|ยังไม่พอ|ครึ่งไทยครึ่งอังกฤษ|ไม่เขียนชื่อ|พยางค์/;

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

  // How much of what a student reads is transcript pasted inside quotes, and
  // how much of that is unreadable. Byte-faithful quoting is the rule, but a
  // page built OUT of quotes is a transcript dump: the mean across the corpus
  // is 9%, while the batch written under the fidelity rule reached 74%, and
  // Palm read it as "บางคำไม่เป็นภาษา บางอันเหมือนพิมพ์ไม่จบ". The gate below
  // counts absent spans, so quoting more is the cheapest way to stay green —
  // this measures the other side of that incentive.
  const thaiSpans = spans.filter((s) => THAI.test(s));
  const thaiChars = (md.match(/[฀-๿]/g) || []).length;
  const quotedChars = thaiSpans.reduce((a, s) => a + s.length, 0);
  const share = thaiChars ? quotedChars / thaiChars : 0;
  // Thai and Latin letters fused inside ONE token: areีย, harบonyma,
  // Profเฟessเซอร์. A Thai quote that merely contains an English word reads fine.
  //
  // But a garble the sentence is ABOUT is correct usage, not a defect — the
  // page's own good pattern is "ชื่อยาในคลิปออกเสียงไม่ครบคำ จึงไม่เขียนไว้"
  // beside the raw sound. Counting those flagged two files as broken when every
  // span in them was already handled properly. Only a garble sitting BARE in
  // the reading flow, with nothing on its line telling the reader what it is,
  // is what a student cannot read.
  let garbled = 0; let declaredGarbles = 0;
  for (const line of md.split('\n')) {
    const hits = [...line.matchAll(/"([^"\n]{2,})"/g)].map((m) => m[1])
      .filter((s) => THAI.test(s) && s.split(/\s+/).some((w) => FUSED.test(w)));
    if (!hits.length) continue;
    if (DECLARES_GARBLE.test(line)) declaredGarbles += hits.length;
    else garbled += hits.length;
  }

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
  return { id, spans: present + absent, present, absent, sample, share, garbled, thaiSpans: thaiSpans.length };
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
  // The readable half of the same promise, and it is NOT the quoted share.
  // ezb2wLM_R2o is 75% quoted with zero garbles and reads well: the lecturer's
  // own clean Thai, in sections and tables. IJaulz_PkS8 is 49% quoted with 193
  // garbles and reads as broken — `areีย`, `harบonyma`, `Profเฟessเซอร์`. What a
  // student cannot read is a token with Thai and Latin letters fused inside it,
  // sitting in the reading flow. Gating on share would have forced rewrites of
  // files that are fine.
  for (const r of rows) {
    const cap = budget.garbles?.[r.id] ?? 0;
    if (r.garbled > cap) {
      console.error(`✖ ${r.id}: ${r.garbled} of ${r.thaiSpans} quotes contain a token with Thai and Latin `
        + `fused inside one word and nothing on the line says so, budget ${cap}. A reader cannot read those.`);
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
    console.log(`${r.id} thai-spans=${String(r.spans).padStart(4)} not-in-audio=${String(r.absent).padStart(4)}`
      + ` quoted-share=${(r.share * 100).toFixed(0).padStart(3)}% garbled=${String(r.garbled).padStart(3)}`);
    for (const s of r.sample) console.log(`    ${s}`);
  }
  const unreadable = rows.filter((r) => r.garbled > 0).sort((a, b) => b.garbled - a.garbled);
  if (unreadable.length) {
    console.log(`
${unreadable.length} summaries hold quotes a reader cannot read, worst first:`);
    for (const r of unreadable.slice(0, 12)) {
      console.log(`  ${String(r.garbled).padStart(3)} of ${String(r.thaiSpans).padEnd(5)} ${r.id}  (${(r.share * 100).toFixed(0)}% quoted)`);
    }
    console.log(`  total ${unreadable.reduce((a, r) => a + r.garbled, 0)} across ${unreadable.length} files`);
  }
  const clean = rows.filter((r) => !r.absent).length;
  console.log(`\n${rows.length} summaries with Thai quotes · ${tot.spans} spans · ${tot.absent} not in the audio · ${clean} files clean`);
}

if (writeBudget) {
  const files = {};
  for (const r of rows) if (r.absent > 0) files[r.id] = r.absent;
  // A quoted share over the ceiling is recorded so it can only come down.
  const garbles = {};
  for (const r of rows) if (r.garbled > 0) garbles[r.id] = r.garbled;
  writeFileSync(BUDGET_FILE, `${JSON.stringify({
    note: 'Quoted spans that are not in the clip transcript, per summary. Whitespace is ignored '
      + '(Thai spacing in an auto-caption is the transcriber\'s artifact, not speech); a changed '
      + 'character is what counts. Ratchet: a number may only go down, and a file may only leave. '
      + 'See docs/SUMMARY-CHECK-STANDARD.md class 10.',
    measured: new Date().toISOString().slice(0, 10),
    total: tot.absent,
    files,
    garbles,
  }, null, 1)}\n`);
  console.log(`wrote ${BUDGET_FILE}: ${Object.keys(files).length} files, ${tot.absent} spans`);
}
