// The quote check was only ever looking at the archive, not at what ships.
//
// audit-quote-fidelity.mjs reads data-cache/generated/<id>.md. That is the file
// a writer produces. It is NOT the file the app renders — that is
// src/data/video-summaries-<subject>.js, and once an id is in there the
// rebuild treats it as authoritative and never overwrites it from the archive.
//
// So on 2026-09-19, when three agents edited the shipped files directly to pull
// garbled quotes out of the body, nothing in lint:all could have told us
// whether a quote that SURVIVED that edit still matched the audio. A hand or an
// agent could have changed a word inside quotation marks and every gate would
// have stayed green. This closes that hole: it reads the shipped modules, not
// the archive.
//
//   node scripts/audit-shipped-quotes.mjs                 # every subject
//   node scripts/audit-shipped-quotes.mjs zoonoses ...    # named subjects
//
// What the absolute number does and does not mean. A sample of the misses in
// an older subject came back as `"ความเร็ว"`, `"mortem = ตาย"` — quotation marks
// used to name a term or gloss a word, not to quote speech. Nothing in the text
// distinguishes those from a real quote, so the corpus total mixes the two and
// is not a verdict on anything. What IS meaningful is the direction for one
// file: a number that goes UP after an edit means a quote was altered. That is
// the question this was written to answer, and it answered it — three files
// were rewritten by agents on 2026-09-19 and every one came back with zero new
// misses. So this ratchets per file rather than judging the total.
//
// Needs data-cache/plain/<id>.txt, which is gitignored, so on a fresh clone it
// says so and exits 0 — same posture as audit-quote-fidelity.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DIR = 'src/data';
const PLAIN = 'data-cache/plain';

const THAI = /[฀-๿]/;
const strip = (s) => s.replace(/\s+/g, '');
const MIN = 8;

if (!existsSync(PLAIN)) {
  console.log('data-cache/plain is not present, so shipped-quote fidelity cannot be checked here.');
  process.exit(0);
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const files = readdirSync(DIR)
  .filter((f) => /^video-summaries-.+\.js$/.test(f) && !f.includes('meta'))
  .filter((f) => !args.length || args.some((a) => f === `video-summaries-${a}.js`));

const audioCache = new Map();
function audioFor(id) {
  if (audioCache.has(id)) return audioCache.get(id);
  const p = `${PLAIN}/${id}.txt`;
  const t = existsSync(p) ? strip(readFileSync(p, 'utf8')) : null;
  audioCache.set(id, t);
  return t;
}

const BUDGET_FILE = 'docs/shipped-quote-budget.json';
const budgetMode = process.argv.includes('--budget');
const writeBudget = process.argv.includes('--write-budget');
const perFile = {};
let totalSpans = 0; let totalMissing = 0; let checkedEntries = 0; let noAudio = 0;
const problems = [];

for (const file of files) {
  const mod = await import(pathToFileURL(`${process.cwd()}/${DIR}/${file}`).href);
  const table = Object.values(mod).find((v) => v && typeof v === 'object' && !Array.isArray(v));
  if (!table) continue;
  for (const [id, entry] of Object.entries(table)) {
    const body = typeof entry?.summary === 'string' ? entry.summary : '';
    if (!body) continue;
    const audio = audioFor(id);
    if (!audio) { noAudio += 1; continue; }
    checkedEntries += 1;
    for (const line of body.split('\n')) {
      // Pair the marks by position, not with a regex carrying a length floor.
      // A floor skips a short quote like "ดรา", and the next match then runs
      // from that quote's CLOSING mark to the next opening one, capturing the
      // prose between two real quotes and reporting it as a quote that is not
      // in the audio. Four such phantoms appeared the first time this ran
      // against an edited file, and the edit was innocent. Splitting keeps the
      // pairing the renderer sees.
      const parts = line.split('"');
      for (let i = 1; i < parts.length; i += 2) {
        const raw = parts[i];
        const span = strip(raw);
        if (!THAI.test(span) || span.length < MIN) continue;
        totalSpans += 1;
        if (!audio.includes(span)) {
          totalMissing += 1;
          perFile[file] = (perFile[file] || 0) + 1;
          if (problems.length < 25) problems.push(`${file} ${id}: "${raw.slice(0, 70)}"`);
        }
      }
    }
  }
}

if (writeBudget) {
  writeFileSync(BUDGET_FILE, `${JSON.stringify({
    note: 'Quoted Thai spans in SHIPPED summaries that are not in the recording, per '
      + 'file. The total mixes real speech quotes with quotation marks used to name a '
      + 'term, so read the direction, not the number: a file that goes up had a quote '
      + 'altered. Ratchet — a number may only go down.',
    measured: new Date().toISOString().slice(0, 10),
    total: totalMissing,
    spans: totalSpans,
    files: perFile,
  }, null, 1)}
`);
  console.log(`wrote ${BUDGET_FILE}: ${totalMissing} of ${totalSpans} spans`);
  process.exit(0);
}

if (budgetMode) {
  const budget = existsSync(BUDGET_FILE) ? JSON.parse(readFileSync(BUDGET_FILE, 'utf8')) : { files: {} };
  let failed = false;
  for (const [f, n] of Object.entries(perFile)) {
    const cap = budget.files[f] ?? 0;
    if (n > cap) { console.error(`✖ ${f}: ${n} quoted spans not in the audio, budget ${cap} — a quote was altered.`); failed = true; }
  }
  console.log(`${checkedEntries} shipped summaries · ${totalSpans} Thai quoted spans · ${totalMissing} not in the audio`);
  if (failed) process.exit(1);
  console.log('✅ no shipped summary drifted further from its recording.');
  process.exit(0);
}

for (const p of problems) console.error(`  ✖ ${p}`);
console.log(`${checkedEntries} shipped summaries with audio · ${totalSpans} Thai quoted spans · `
  + `${totalMissing} not in the audio${noAudio ? ` · ${noAudio} entries have no transcript on this machine` : ''}`);

if (totalMissing) {
  console.error('\nA quote in a shipped summary says the lecturer said exactly this. '
    + 'Put the audio inside the marks and the reading outside them.');
  process.exit(1);
}
console.log('✅ every quoted span in the shipped summaries is in its recording.');
