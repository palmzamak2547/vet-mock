// Take the square brackets off a word that is already the word.
//
// Palm read a summary and asked why it was full of `[...]`: "ทำไมต้องมี []
// ด้วย ไม่ใช้คำเต็มๆไปเลย … ภาษาเครื่องหรือป่าว". In the great majority of
// cases the bracket carries an ordinary Thai word that the auto-caption simply
// dropped or mangled — `ใช้[ใน]มนุษย์` where the caption has `ใช้มนุษย์`,
// `[ไข้หวัด]นก` where it has `เข้านก`. The reading is right, it is a fact, and
// the only thing wrong with it is the brackets, which make a sentence a student
// is trying to revise from read like a diff.
//
// So: remove the brackets, keep the word. What this does NOT touch —
//   - a bracket outside a quotation mark (that is already the reading);
//   - a timestamp or timestamp range;
//   - a bracket the transcriber produced, e.g. [เสียงสูดหายใจ] — evidence;
//   - a PLACEHOLDER such as [ฟังไม่ชัด], which is not a word at all and has to
//     be rewritten into a sentence by hand, because deleting its brackets would
//     print the words "ฟังไม่ชัด" as if the lecturer had said them.
//
//   node scripts/unbracket-in-quote.mjs <subject> [--dry]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const THAI = /[฀-๿]/;
const TIMESTAMP = /^\[\d+:\d{2}/;
const PLACEHOLDER = /ฟังไม่ชัด|ไม่ชัด|ออกเสียง|ได้ยินเป็น|มาไม่ชัด/;

const [subject, ...rest] = process.argv.slice(2);
const dry = rest.includes('--dry');
// `--outside` does the same job for a bracket that sits OUTSIDE the quotes. Palm
// did not distinguish the two ("เห็นหลายจุดเลย") and he is right that they read
// the same on the page: `สิ่ง[ปลูก]สร้าง` is machine output wherever it sits.
const outside = rest.includes('--outside');
if (!subject) { console.error('usage: node scripts/unbracket-in-quote.mjs <subject> [--dry]'); process.exit(2); }

const file = `src/data/video-summaries-${subject}.js`;
const lines = readFileSync(file, 'utf8').split('\n');

const audioCache = new Map();
function audioFor(id) {
  if (audioCache.has(id)) return audioCache.get(id);
  const p = `data-cache/plain/${id}.txt`;
  const t = existsSync(p) ? readFileSync(p, 'utf8').replace(/\s+/g, '') : null;
  audioCache.set(id, t);
  return t;
}

let changed = 0; let skippedPlaceholder = 0; let skippedTranscriber = 0;
const samples = [];
let id = null;

for (let i = 0; i < lines.length; i += 1) {
  const idm = lines[i].match(/^\s*['"]([A-Za-z0-9_-]{11})['"]\s*:/);
  if (idm) id = idm[1];
  const audio = id ? audioFor(id) : null;

  // Rebuild the line left to right so the quote parity is computed against the
  // text as it originally stood, not against a string being mutated underneath.
  let out = ''; let cursor = 0; let touched = false;
  for (const m of lines[i].matchAll(/\[([^\[\]\n]{1,80})\]/g)) {
    const span = m[0]; const inner = m[1];
    if (!THAI.test(span) || TIMESTAMP.test(span)) continue;
    const quotesBefore = (lines[i].slice(0, m.index).match(/"/g) || []).length;
    if ((quotesBefore % 2 === 1) === outside) continue;
    if (audio && audio.includes(span.replace(/\s+/g, ''))) { skippedTranscriber += 1; continue; }
    if (PLACEHOLDER.test(inner)) { skippedPlaceholder += 1; continue; }
    out += lines[i].slice(cursor, m.index) + inner;
    cursor = m.index + span.length;
    touched = true;
    changed += 1;
    if (samples.length < 6) samples.push(`${span} -> ${inner}`);
  }
  if (touched) lines[i] = out + lines[i].slice(cursor);
}

console.log(`${subject}${outside ? ' (outside quotes)' : ''}: unbracketed ${changed}`
  + `, left ${skippedPlaceholder} placeholder(s) for a hand rewrite`
  + `, left ${skippedTranscriber} transcriber annotation(s) alone`);
for (const s of samples) console.log(`    ${s}`);
if (!dry) writeFileSync(file, lines.join('\n'));
else console.log('(dry run — nothing written)');
