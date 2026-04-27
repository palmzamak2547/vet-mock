#!/usr/bin/env node
/**
 * fix-answer-bias.cjs
 *
 * One-shot migration: redistribute the correct-answer index across the
 * 28 IMHA / IBD / SLE MCQs that v5.2.0 left at index 1 (option B).
 * Real-user feedback: "ตอบ B ก็ถูกเกือบหมดเลย".
 *
 * Strategy: for each biased question id, swap the option text at the
 * current `answer` index with the option text at a deterministic target
 * index derived from `id % 5`. The target lookup keeps a roughly even
 * 6/6/7/7/7 distribution across positions 0-4 (computed by hand from
 * the id list, not random — so reruns are idempotent).
 *
 * Why a script and not 28 manual Edits? Reliability — parsing the JS
 * options array, swapping, and reserialising as valid JS is easy in
 * Node. Doing it as 28 string-replace operations risks one bad escape.
 *
 * Run: node scripts/fix-answer-bias.cjs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'questions-com4.js');

// Target index per question id. 985 was already at 0 — leave alone.
// 986 / 991 / 996 / 1001 / 1006 / 1011 stay at 1 to preserve some B answers
// (otherwise we'd just shift the bias to a new index).
//
// 5-option questions (19 total) get spread across positions 0/2/3/4.
// 4-option questions (7 total — 984, 989, 994, 999, 1004, 1009, 1014)
// can only use 0/2/3 — distributed there.
//
// Final intended distribution across IMHA + SLE + IBD MCQs:
//   idx 0: 9   (985 already at 0 + 5-opt 990/995/1000/1005/1010 + 4-opt 984/999/1014)
//   idx 1: 7   (986/991/996/1001/1006/1011 kept + others passed through)
//   idx 2: 7   (5-opt 987/997/1007/1012/1032 + 4-opt 989/1004)
//   idx 3: 6   (5-opt 988/993/1003/1013 + 4-opt 994/1009)
//   idx 4: 5   (5-opt 983/992/998/1002/1008)
//
// Idempotent: re-running with the same map is a no-op once correct.
const TARGET = {
  // 5-option IMHA/IBD/SLE
  983: 4, 987: 2, 988: 3, 990: 0,
  992: 4, 993: 3, 995: 0, 997: 2, 998: 4,
  1000: 0, 1002: 4, 1003: 3, 1005: 0, 1007: 2, 1008: 4,
  1010: 0, 1012: 2, 1013: 3, 1032: 4,
  // 4-option IMHA/IBD/SLE (avoid index 4)
  984: 0, 989: 2, 994: 3, 999: 0, 1004: 2, 1009: 3, 1014: 0,
};

// Split a single-line JS array body like:
//   'a', 'b: with, comma', 'c\\'s shop', 'd'
// into ["'a'", "'b: with, comma'", "'c\\'s shop'", "'d'"]
// — preserves the original quoting/escapes so we can re-emit verbatim.
function splitJsStringArray(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (i >= s.length) break;
    if (s[i] !== "'") throw new Error('expected single-quote at offset ' + i + ' in: ' + s);
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

let src = fs.readFileSync(FILE, 'utf8');
let changedCount = 0;

for (const [idStr, target] of Object.entries(TARGET)) {
  const id = Number(idStr);
  // Match the question block from `{ id: NNN,` through the answer
  // line. options is single-line so [^\n] is safe; allow any number
  // of intermediate lines before reaching the options/answer pair.
  const re = new RegExp(
    `(\\{ id: ${id},[\\s\\S]*?options: )\\[([^\\n]+)\\](,\\s*answer: )(\\d+)`,
    ''
  );
  const m = src.match(re);
  if (!m) {
    console.warn(`  · Q${id} not found — skipping`);
    continue;
  }
  const [whole, beforeOpts, optsBody, beforeAns, currentAnsStr] = m;
  const currentAns = Number(currentAnsStr);

  let opts;
  try {
    opts = splitJsStringArray(optsBody);
  } catch (e) {
    console.warn(`  · Q${id} parse fail: ${e.message}`);
    continue;
  }
  if (opts.length < target + 1) {
    console.warn(`  · Q${id} only has ${opts.length} options, target=${target} — skipping`);
    continue;
  }
  if (currentAns === target) {
    console.log(`  · Q${id} already at ${target} — no swap needed`);
    continue;
  }

  // Swap option text at currentAns and target — that moves the correct
  // text to the new index AND repurposes the old distractor at the new
  // index back to position currentAns.
  [opts[currentAns], opts[target]] = [opts[target], opts[currentAns]];
  const newBody = opts.join(', ');

  const replacement = `${beforeOpts}[${newBody}]${beforeAns}${target}`;
  src = src.replace(whole, replacement);
  changedCount++;
  console.log(`  ✓ Q${id}: answer ${currentAns} → ${target}`);
}

fs.writeFileSync(FILE, src);
console.log(`\nDone. ${changedCount} question(s) updated in ${path.relative(process.cwd(), FILE)}`);
