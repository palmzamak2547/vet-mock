// For every bracketed insert sitting inside a quotation mark, print the printed
// quote beside the run of audio it was made from.
//
// Repairing these by hand means answering one question per span: what did the
// clip actually say where the bracket is? Reading a 300k-char transcript per
// span to find out is not workable, so this aligns them.
//
// Alignment: strip whitespace from both sides (Thai has no inter-word spaces, so
// every space in an auto-caption is the transcriber's), binary-search the
// longest prefix of the quote that occurs in the transcript, and print the
// transcript from that anchor for roughly the quote's length. Where the printed
// quote and the audio diverge is where the writer edited.
//
//   node scripts/bracket-repair-worksheet.mjs <subject> [> work/file.txt]

import { readFileSync, existsSync } from 'node:fs';

const THAI = /[฀-๿]/;
const TIMESTAMP = /^\[\d+:\d{2}/;
// Markdown emphasis is layout, not speech: a quote written as
// **"…"** with bold fragments inside must have its asterisks removed before
// it can be compared with the audio, or the anchor search fails outright.
const strip = (s) => s.replace(/[*_`]/g, '').replace(/\s+/g, '');

const subject = process.argv[2];
if (!subject) {
  console.error('usage: node scripts/bracket-repair-worksheet.mjs <subject>');
  process.exit(2);
}

const file = `src/data/video-summaries-${subject}.js`;
if (!existsSync(file)) { console.error(`no such file: ${file}`); process.exit(2); }

const cache = new Map();
function audio(id) {
  if (cache.has(id)) return cache.get(id);
  const p = `data-cache/plain/${id}.txt`;
  const t = existsSync(p)
    ? strip(readFileSync(p, 'utf8').replace(/^#.*$/gm, '').replace(/\[\d+:\d\d(?::\d\d)?\]/g, ''))
    : null;
  cache.set(id, t);
  return t;
}

function longestPrefixIn(needle, hay) {
  let lo = 0; let hi = needle.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (hay.includes(needle.slice(0, mid))) lo = mid; else hi = mid - 1;
  }
  return lo;
}

const lines = readFileSync(file, 'utf8').split('\n');
let id = null; let n = 0;

for (let ln = 0; ln < lines.length; ln += 1) {
  const line = lines[ln];
  const idm = line.match(/^\s*['"]([A-Za-z0-9_-]{11})['"]\s*:/);
  if (idm) id = idm[1];
  for (const m of line.matchAll(/\[[^\[\]\n]{1,80}\]/g)) {
    const span = m[0];
    if (!THAI.test(span) || TIMESTAMP.test(span)) continue;
    if ((line.slice(0, m.index).match(/"/g) || []).length % 2 !== 1) continue;

    const open = line.lastIndexOf('"', m.index);
    const close = line.indexOf('"', m.index + span.length);
    if (open < 0 || close < 0) continue;
    const quote = line.slice(open + 1, close);
    const t = id ? audio(id) : null;

    n += 1;
    console.log(`\n### ${n}  ${subject}  ${id}  line ${ln + 1}`);
    console.log(`BRACKET : ${span}`);
    console.log(`PRINTED : ${quote}`);
    if (!t) { console.log('AUDIO   : (no transcript)'); continue; }
    // Anchor on the text immediately BEFORE the bracket, not on the start of
    // the quote. Thai sentences share openings ("ถ้า", "เขา"), so a prefix
    // search lands in a different sentence and the window it prints is from
    // somewhere else in the lecture entirely — which is worse than no answer.
    const head = strip(line.slice(open + 1, m.index).replace(/[\[\]]/g, ''));
    let key = head.slice(-28);
    while (key.length > 6 && !t.includes(key)) key = key.slice(1);
    if (key.length <= 6 || !t.includes(key)) {
      console.log('AUDIO   : (cannot anchor — the words before the bracket are not in the transcript either)');
      continue;
    }
    const at = t.indexOf(key) + key.length;
    console.log(`ANCHOR  : ...${key}`);
    console.log(`AUDIO   : ...${key}  >>>  ${t.slice(at, at + 60)}`);
  }
}
console.log(`\n${n} spans in ${subject}.`);
