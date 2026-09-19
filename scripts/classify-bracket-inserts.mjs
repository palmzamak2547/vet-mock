// Which of the bracketed inserts are safe to simply un-bracket?
//
// A bracket inside a quotation mark is forbidden, but the repair is not the same
// in every case, and guessing the repair is how you turn a formatting defect
// into a content defect. There are exactly two kinds:
//
//   RESTORED — the bracketed characters ARE in the audio at that point. The
//   writer bracketed a word the transcriber had mangled and then wrote the real
//   one, so removing the brackets makes the quote byte-faithful. Mechanical,
//   provable, safe.
//
//   GUESS — the bracketed characters are NOT in the audio. The writer supplied a
//   word the clip never said. Removing the brackets would publish a fabricated
//   quote. The quote has to be cut back to the run that IS in the transcript and
//   the reading moved outside the marks — a judgement, per span, with the
//   transcript open.
//
// The test is the same one audit-quote-fidelity.mjs uses: ignore whitespace on
// both sides, because Thai has no inter-word spaces and every space in an
// auto-caption belongs to the transcriber.
//
//   node scripts/classify-bracket-inserts.mjs [subject ...]

import { readFileSync, readdirSync, existsSync } from 'node:fs';

const THAI = /[฀-๿]/;
const TIMESTAMP = /^\[\d+:\d{2}/;
const strip = (s) => s.replace(/\s+/g, '');

const only = new Set(process.argv.slice(2).filter((a) => !a.startsWith('--')));
const files = readdirSync('src/data')
  .filter((f) => /^video-summaries-/.test(f) && f.endsWith('.js') && f !== 'video-summaries-meta.js')
  .filter((f) => !only.size || only.has(f.replace('video-summaries-', '').replace('.js', '')));

const transcripts = new Map();
function audio(id) {
  if (transcripts.has(id)) return transcripts.get(id);
  const p = `data-cache/plain/${id}.txt`;
  const text = existsSync(p)
    ? strip(readFileSync(p, 'utf8').replace(/^#.*$/gm, '').replace(/\[\d+:\d\d(?::\d\d)?\]/g, ''))
    : null;
  transcripts.set(id, text);
  return text;
}

let restored = 0; let guess = 0; let noAudio = 0;
const guessRows = [];

for (const file of files) {
  const src = readFileSync(`src/data/${file}`, 'utf8');
  const lines = src.split('\n');
  let currentId = null;
  for (const line of lines) {
    // Each summary object opens with its video id as the key.
    const idMatch = line.match(/^\s*['"]([A-Za-z0-9_-]{11})['"]\s*:/);
    if (idMatch) currentId = idMatch[1];
    for (const m of line.matchAll(/\[[^\[\]\n]{1,80}\]/g)) {
      const span = m[0];
      if (!THAI.test(span) || TIMESTAMP.test(span)) continue;
      const quotesBefore = (line.slice(0, m.index).match(/"/g) || []).length;
      if (quotesBefore % 2 !== 1) continue; // outside a quote, not this gate's business
      const text = currentId ? audio(currentId) : null;
      if (!text) { noAudio += 1; continue; }
      // Test the WHOLE quoted span, not the bracket's contents. A short word
      // like [เชื้อ] occurs somewhere in any 300k-char transcript, so proving
      // the word exists proves nothing about this sentence. What has to hold is
      // that the quote MINUS its brackets is a contiguous run of the audio.
      const openIdx = line.lastIndexOf('"', m.index);
      const closeIdx = line.indexOf('"', m.index + span.length);
      const whole = openIdx >= 0 && closeIdx > openIdx
        ? line.slice(openIdx + 1, closeIdx)
        : null;
      const unbracketed = whole ? whole.replace(/[\[\]]/g, '') : null;
      if (unbracketed && strip(unbracketed).length >= 8 && text.includes(strip(unbracketed))) restored += 1;
      else {
        guess += 1;
        guessRows.push({ file: file.replace('video-summaries-', '').replace('.js', ''), id: currentId, span });
      }
    }
  }
}

console.log(`RESTORED (bracketed text IS in the audio — safe to un-bracket): ${restored}`);
console.log(`GUESS    (NOT in the audio — quote must be cut, reading moved out): ${guess}`);
if (noAudio) console.log(`no transcript available: ${noAudio}`);

const bySubject = {};
for (const r of guessRows) (bySubject[r.file] ||= []).push(r.span);
console.log('\nGUESS spans by subject:');
for (const [s, spans] of Object.entries(bySubject).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(spans.length).padStart(4)}  ${s}   ${[...new Set(spans)].slice(0, 6).join(' ')}`);
}
