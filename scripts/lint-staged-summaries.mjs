#!/usr/bin/env node
/**
 * lint-staged-summaries.mjs
 *
 * Checks a summary while it is still a staged .md, before the generator
 * imports it into src/data.
 *
 * Why this exists rather than relying on the prompt: every rule below was
 * broken at least once in the Milk Hygiene batch, by an agent or by me, and
 * each one cost a repair afterwards. Worse, `rebuild-video-summaries.mjs`
 * never overwrites an id that is already in src/data — so a fix applied to the
 * .md after the first rebuild is silently ignored, and the only way out is to
 * restore the generated files to HEAD and rebuild. Catching it here means the
 * repair happens while it is still cheap.
 *
 * Usage:
 *   node scripts/lint-staged-summaries.mjs                # every staged .md not yet shipped
 *   node scripts/lint-staged-summaries.mjs <id> [<id>...] # named ones
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data');
const GENERATED = path.join(ROOT, 'data-cache', 'generated');

const NOTE_HEADING = 'หมายเหตุท้ายบท';
const REQUIRED_FRONT = ['videoId', 'title', 'subject', 'date'];

// Words that describe the transcription machinery. A student reads this file;
// the pipeline that produced it is none of their business.
const MACHINE_WORDS = ['ASR', 'ถอดเสียง', 'ถอดได้', 'transcript', 'auto-caption', 'คำบรรยายอัตโนมัติ'];

// Phrases that assert a fact against the lecture. Allowed, but only inside the
// closing note — never woven into what the lecturer is saying.
// A bare mention of a textbook is usually the lecturer's own ('เค้าบอกว่าที่ 68 แหละ
// แต่ทำจริงที่ 71'), so only phrases that assert a correction are listed.
const CORRECTION_PHRASES = ['ตามตำรา', 'ตำราจัด', 'ที่ถูกต้องคือ', 'ข้อเท็จจริงคือ'];

const shipped = new Set();
for (const f of fs.readdirSync(DATA)) {
  if (!/^video-summaries-.+\.js$/.test(f)) continue;
  const txt = fs.readFileSync(path.join(DATA, f), 'utf8');
  for (const m of txt.matchAll(/["']?videoId["']?:\s*["']([^"']+)["']/g)) shipped.add(m[1]);
}

const named = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const files = (fs.existsSync(GENERATED) ? fs.readdirSync(GENERATED) : [])
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .filter((id) => (named.length ? named.includes(id) : !shipped.has(id)));

let errors = 0;
let warnings = 0;
const err = (id, msg) => {
  errors++;
  console.log(`  error  ${id}: ${msg}`);
};
const warn = (id, msg) => {
  warnings++;
  console.log(`  warn   ${id}: ${msg}`);
};

if (!files.length) {
  console.log('\nNo staged summaries awaiting a check.\n');
  process.exit(0);
}

console.log(`\nChecking ${files.length} staged summary(ies)\n`);

for (const id of files) {
  // Agents write these on Windows, so line endings are mixed; normalise before matching.
  const md = fs.readFileSync(path.join(GENERATED, `${id}.md`), 'utf8')
    .split(String.fromCharCode(13) + String.fromCharCode(10))
    .join(String.fromCharCode(10));

  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    err(id, 'no YAML front matter');
  } else {
    for (const field of REQUIRED_FRONT) {
      if (!new RegExp(`^${field}:`, 'm').test(fm[1])) err(id, `front matter missing ${field}`);
    }
    const declared = fm[1].match(/^videoId:\s*(\S+)/m);
    if (declared && declared[1] !== id) {
      err(id, `front matter videoId is ${declared[1]}, filename says ${id}`);
    }
  }

  const body = fm ? md.slice(fm[0].length) : md;

  const dots = (md.match(/·/g) || []).length;
  if (dots) err(id, `${dots} middle dot separator(s) — the owner's standing rule`);

  for (const w of MACHINE_WORDS) {
    const n = (md.match(new RegExp(w, 'g')) || []).length;
    if (n) err(id, `machine vocabulary "${w}" x${n} — write it as plain Thai`);
  }

  // A correction belongs in the closing note, so measure from where that starts.
  //
  // Anchor on the heading, not on the words. indexOf(NOTE_HEADING) used to
  // match the first mention of the phrase anywhere, and nearly every summary
  // mentions it in prose — a trap line that says the extra observations live
  // in หมายเหตุท้ายบท, a pointer inside a part. One file put that sentence on
  // line 51 of 1,190, so `beforeNote` was 50 lines long and this check ran
  // over four percent of the document while reporting a clean pass. It let
  // ตามตำรา through in the body, on the same line that had turned the
  // lecturer's hyposecretion into hypersecretion.
  //
  // The note is the last such heading in the file, so search from the end.
  const headings = [...body.matchAll(new RegExp('^#{1,6}[^\\n]*' + NOTE_HEADING, 'gm'))];
  const noteAt = headings.length ? headings[headings.length - 1].index : -1;
  const beforeNote = noteAt === -1 ? body : body.slice(0, noteAt);
  for (const phrase of CORRECTION_PHRASES) {
    if (beforeNote.includes(phrase)) {
      err(
        id,
        `"${phrase}" appears in the lecture body — a correction goes in the ${NOTE_HEADING} section at the end`,
      );
    }
  }

  // Stars rate a section's importance, so they belong on headings. One file
  // put 412 of them in the body as well, in front of terms that were already
  // bold — emphasis on top of emphasis, 626 marks in one document. Palm read
  // the result and said the emphasis was everywhere, which is what happens
  // when a mark stops selecting anything.
  //
  // Measured per 1,000 characters of body text, outside headings: the three
  // reference summaries and Milk 6 sit at 0, the other avian files at 0.65 and
  // 0.84, and the file that drew the complaint at 5.0. A ceiling of 1.0 leaves
  // a deliberate star on a genuinely critical line alone and catches drift.
  const bodyStars = body
    .split(/\r?\n/)
    .filter((l) => !/^\s*#/.test(l))
    .reduce((n, l) => n + (l.match(/⭐/g) || []).length, 0);
  const starRate = bodyStars / (body.length / 1000);
  if (starRate > 1) {
    warn(
      id,
      `${bodyStars} stars outside headings (${starRate.toFixed(1)} per 1,000 chars; the accepted files run 0 to 0.84) — `
        + 'a star on every point marks nothing, and bold already carries the emphasis',
    );
  }

  if (!/^#\s+\S/m.test(body)) err(id, 'no H1 heading');

  const timestamps = (body.match(/\[\d{1,3}:\d{2}/g) || []).length;
  if (timestamps === 0) err(id, 'no timestamps — every claim must be traceable');
  else if (timestamps < 20) warn(id, `only ${timestamps} timestamps`);

  const chars = body.length;
  if (chars < 12000) err(id, `${chars} characters — too thin, the accepted ones run about 30,000`);
  else if (chars < 20000) warn(id, `${chars} characters, below the usual 30,000`);

  const parts = (body.match(/^#+\s*🔻/gm) || []).length;
  if (parts && parts < 10) warn(id, `only ${parts} parts`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s).`);
if (errors) {
  console.log('\nFix the .md now. After the generator has imported an id into src/data,');
  console.log('edits to the staged file are ignored until you restore and rebuild.');
}
process.exit(errors ? 1 : 0);
