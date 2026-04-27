#!/usr/bin/env node
/**
 * fix-length-bias.cjs
 *
 * Pattern recognised by lint: most length-biased questions have a
 * "correct option = comprehensive sentence with parenthetical detail"
 * vs "distractor = 1-2 words". The cleanest reduction without losing
 * pedagogy is to:
 *
 *   1. Strip the trailing parenthetical "(...)" or em-dash detail
 *      "— ..." from the correct option ONLY when the distractors
 *      don't have similar trailing detail. The bare core answer
 *      stays; the detail moves to the explain field as a 💡 note.
 *   2. Re-emit options + explain, swap nothing else (positions stay
 *      where fix-question-bias.cjs put them).
 *
 * What it WON'T do:
 *   • Pad short distractors with new clinical content (would need
 *     domain knowledge — risk of wrong distractors).
 *   • Trim mid-sentence detail (only trailing parenthetical / em-dash).
 *   • Touch correct options with no parenthetical / em-dash to trim.
 *
 * Run:
 *   node scripts/fix-length-bias.cjs --dry-run   # preview changes
 *   node scripts/fix-length-bias.cjs             # apply
 *   node scripts/fix-length-bias.cjs --threshold 1.8   # only trim
 *                                                if bias ≥ this ratio
 */

const fs = require('fs');
const path = require('path');

const FILES = [
  'src/data/questions-com3.js',
  'src/data/questions-com4.js',
  'src/data/questions-com5.js',
  'src/data/questions-engprof.js',
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const thresholdArg = args.find((a) => a.startsWith('--threshold'));
const RATIO_THRESHOLD = thresholdArg ? Number(thresholdArg.split('=')[1] || args[args.indexOf('--threshold') + 1]) : 1.6;

// Same string-array splitter — keeps escapes/quotes verbatim.
function splitJsStringArray(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (i >= s.length) break;
    if (s[i] !== "'") return null;
    const start = i;
    i++;
    while (i < s.length) {
      if (s[i] === '\\') { i += 2; continue; }
      if (s[i] === "'") { i++; break; }
      i++;
    }
    out.push(s.slice(start, i));
  }
  return out;
}

// Trailing parenthetical or em-dash detail trimmer. Returns
// { core, detail } where core is the un-paren version of the
// option literal (still wrapped in single quotes) and detail is
// the stripped Thai/EN text.
//
// Operates on the option content WITHOUT the surrounding quotes.
// Examples handled:
//   "8-12 สัปดาห์ (ดูผลที่ 4 wk แรก)"
//     → core "8-12 สัปดาห์",   detail "ดูผลที่ 4 wk แรก"
//   "Crystalloid 10-20 ml/kg — fix perfusion + dehydration"
//     → core "Crystalloid 10-20 ml/kg",   detail "fix perfusion..."
function stripTrailingDetail(content) {
  // 1. "(...)" at the very end. Cheapest, safest — supplementary detail.
  let m = content.match(/^([\s\S]+?)\s*\(([^()]+)\)\s*$/);
  if (m && m[1].length >= 4) {
    return { core: m[1].trim(), detail: m[2].trim(), kind: 'paren' };
  }
  // 2. " — ..." or " - ..." em-dash at end. Trailing explanation.
  m = content.match(/^([\s\S]+?)\s*[—–-]\s+(.{6,})$/);
  if (m && m[1].length >= 4) {
    return { core: m[1].trim(), detail: m[2].trim(), kind: 'dash' };
  }
  // 3. " · " (mid-dot) bullet-list separator. Many of my answers list
  //    "A · B · C · D · E" while distractors are single items. Take
  //    just the first component, move the rest to explain. The first
  //    component on its own should still be a recognisable answer
  //    (otherwise the question is broken).
  if (content.includes(' · ')) {
    const parts = content.split(' · ');
    if (parts.length >= 2 && parts[0].trim().length >= 4) {
      return {
        core: parts[0].trim(),
        detail: parts.slice(1).join(' · ').trim(),
        kind: 'mid-dot',
      };
    }
  }
  // 4. ", " comma-list with 4+ items where first item alone is meaningful.
  //    e.g. "PU/PD, polyphagia, Cushing's, GI ulcer, ..." → first 2 stay.
  if (/, /.test(content) && content.length > 60) {
    const parts = content.split(', ');
    if (parts.length >= 4) {
      const head = parts.slice(0, 2).join(', ').trim();
      const tail = parts.slice(2).join(', ').trim();
      if (head.length >= 12 && tail.length >= 12) {
        return { core: head, detail: tail, kind: 'comma-list' };
      }
    }
  }
  return null;
}

function escapeForJsLiteral(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Per-question fix: returns mutated block text, or null if no change.
function fixBlock(blockText) {
  const optsMatch = blockText.match(/(options: )\[([\s\S]*?)\](?=,\s*\n)/);
  const ansMatch = blockText.match(/answer: (\d+)/);
  if (!optsMatch || !ansMatch) return null;

  const opts = splitJsStringArray(optsMatch[2]);
  if (!opts || opts.length < 3) return null;
  const answerIdx = Number(ansMatch[1]);
  if (answerIdx < 0 || answerIdx >= opts.length) return null;

  // Parse content of each (strip outer quotes)
  const contents = opts.map((o) => o.slice(1, -1));
  const correctLen = contents[answerIdx].length;
  const distractorLens = contents.filter((_, i) => i !== answerIdx).map((c) => c.length);
  const meanD = distractorLens.reduce((a, b) => a + b, 0) / distractorLens.length;
  if (meanD === 0) return null;
  const ratio = correctLen / meanD;
  if (ratio < RATIO_THRESHOLD) return null;

  // Try to strip trailing detail from correct option.
  const trimmed = stripTrailingDetail(contents[answerIdx]);
  if (!trimmed) return null;

  // Sanity check — would the new ratio actually go down meaningfully?
  const newRatio = trimmed.core.length / meanD;
  if (newRatio >= ratio * 0.9) return null; // not enough improvement

  // Rebuild options array
  contents[answerIdx] = trimmed.core;
  const newOpts = contents.map((c) => `'${escapeForJsLiteral(c)}'`).join(', ');

  // Append detail to explain field as a 💡 note. We only touch single-
  // quoted explain values that DON'T already have this detail (idempotent).
  let next = blockText.replace(optsMatch[0], `${optsMatch[1]}[${newOpts}]`);
  const explainRe = /(explain: ')((?:[^'\\]|\\.)+)(')/;
  const em = next.match(explainRe);
  if (em && !em[2].includes(trimmed.detail)) {
    const noteFragment = `\\n\\n💡 ${trimmed.detail}`;
    next = next.replace(explainRe, `$1$2${noteFragment}$3`);
  }

  return { newBlock: next, oldRatio: ratio, newRatio };
}

// Walk + apply
function walkAndFix(src) {
  const re = /\n {2}\{ id: (\d+),/g;
  const starts = [];
  let m;
  while ((m = re.exec(src)) !== null) starts.push({ index: m.index, id: Number(m[1]) });

  // Iterate from the END so earlier offsets stay valid as we rewrite later
  // blocks first. Track per-id changes for reporting.
  const changes = [];
  for (let i = starts.length - 1; i >= 0; i--) {
    const start = starts[i].index + 1;
    const end = i + 1 < starts.length ? starts[i + 1].index + 1 : src.lastIndexOf('];');
    const blockText = src.slice(start, end);
    const result = fixBlock(blockText);
    if (!result) continue;
    src = src.slice(0, start) + result.newBlock + src.slice(end);
    changes.push({ id: starts[i].id, oldRatio: result.oldRatio.toFixed(2), newRatio: result.newRatio.toFixed(2) });
  }
  return { src, changes };
}

const root = path.resolve(__dirname, '..');
let totalFixed = 0;
for (const rel of FILES) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  const src = fs.readFileSync(abs, 'utf8');
  const { src: out, changes } = walkAndFix(src);
  if (changes.length === 0) continue;
  console.log(`\n  [${rel}] ${changes.length} question(s) trimmed:`);
  changes.slice(0, 10).forEach((c) => console.log(`    Q${c.id}: ${c.oldRatio}× → ${c.newRatio}×`));
  if (changes.length > 10) console.log(`    ... and ${changes.length - 10} more`);
  totalFixed += changes.length;
  if (!dryRun) fs.writeFileSync(abs, out);
}

console.log(`\nDone. ${totalFixed} option(s) trimmed${dryRun ? ' (dry-run, no files written)' : ''}.`);
console.log('Re-run lint to see remaining bias: npm run lint:questions');
