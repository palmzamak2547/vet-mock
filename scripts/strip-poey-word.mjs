#!/usr/bin/env node
// ============================================================
// strip-poey-word.mjs — Remove "โพย" from all source files
// ============================================================
//
// Palm directive: the word "โพย" carries academic-integrity baggage
// (sounds like cheating). All user-facing strings must avoid it.
// Code comments too — Palm shows the source to advisors / friends.
//
// Replacement table is context-aware (compound forms first, then bare).
// Most safe substitution: "สรุป" (summary) or "เฉลย" (answer key).
// ============================================================

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', 'src');

// Order matters: compound forms first so "โพย" doesn't get replaced
// before its context-aware form. Each entry: [pattern, replacement].
const REPLACEMENTS = [
  // Compound forms with semantic prefix/suffix
  ['ค่ดโพย', 'คัดสรุป'],          // typo + word
  ['ซซโน้ตโพย', 'ซซโน้ตสรุป'],
  ['ในไฟล์โพย', 'ในไฟล์สรุป'],
  ['ตามคีย์โพย', 'ตามคีย์เฉลย'],
  ['เฉลยโพย', 'เฉลย'],
  ['เขียนโพย', 'เขียนสรุป'],
  ['ตรงโพย', 'ตรงเฉลย'],
  ['รวมโพยไก่', 'สรุปรวมไก่'],
  ['รวมโพย', 'สรุปรวม'],
  ['โพยรุ่นพี่', 'สรุปจากรุ่นพี่'],
  ['โพยนี้', 'สรุปนี้'],
  ['ในโพย', 'ในสรุป'],
  ['กับโพย', 'กับสรุป'],
  ['โพย+สรุป', 'สรุป+บันทึก'],
  // Bare form last
  ['โพย', 'สรุป'],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    else if (/\.(js|jsx|md|json)$/.test(name)) out.push(path);
  }
  return out;
}

const files = walk(SRC_DIR);
let totalReplaced = 0;
const fileSummary = [];

for (const f of files) {
  let content = readFileSync(f, 'utf8');
  const before = content;
  let replaced = 0;
  for (const [pat, rep] of REPLACEMENTS) {
    while (content.includes(pat)) {
      content = content.replace(pat, rep);
      replaced++;
    }
  }
  if (content !== before) {
    writeFileSync(f, content, 'utf8');
    fileSummary.push({ file: f.replace(SRC_DIR, 'src'), replaced });
    totalReplaced += replaced;
  }
}

console.log(`Replaced ${totalReplaced} occurrence(s) across ${fileSummary.length} file(s):`);
for (const { file, replaced } of fileSummary) {
  console.log(`  ${replaced.toString().padStart(4)}  ${file}`);
}
