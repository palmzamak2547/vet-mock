#!/usr/bin/env node
// ============================================================
// lint-academic-safety.mjs — scrub vocabulary that signals
// academic-integrity issues to Thai faculty readers
// ============================================================
//
// Successor to scripts/strip-poey-word.mjs. Expanded scope after Palm
// directive (2026-05-13) to "ปูทางอนาคตเลย" — prevent reintroduction
// of risky phrasing in all future Q-bank ingestions.
//
// What this catches:
//   • "โพย" family — cheat-sheet word (already handled by strip-poey)
//   • "ออกตามนี้" / "ตรงข้อสอบ" / "ตรงเป๊ะ" — implies prior knowledge
//     of exam contents (academic-integrity red flag)
//   • "ข้อสอบรั่ว" / "leaked exam" — direct cheating reference
//   • "ซซดาวที่ออก" / similar — senior-attribution that doubles as
//     "this came out on the test" hint
//
// SAFE substitutions (faculty-neutral phrasing):
//   ออกตามนี้      → อิงแนวสอบรอบเดียวกัน
//   ตรงข้อสอบ      → ตรงตามแนวสอบ
//   ตรงเป๊ะ        → ใกล้เคียง (or remove)
//   ข้อสอบรั่ว     → เอกสารบันทึกหลังสอบ
//   leaked exam   → past-paper note
//   ซซดาวที่ออก    → ซซดาวบันทึก
//
// Modes:
//   node scripts/lint-academic-safety.mjs            # lint-only (exit 1 on hits)
//   node scripts/lint-academic-safety.mjs --apply    # auto-strip + rewrite
//   node scripts/lint-academic-safety.mjs --json     # machine-readable report
//
// CI usage (future): add to package.json as `lint:academic-safety` +
// wire to a pre-commit hook so faculty-risk vocabulary can never leak
// into a commit again.
// ============================================================

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const JSON_OUT = args.includes('--json');

// ── Banned word substitution table ──────────────────────────────
// Order matters: compound forms BEFORE bare forms so the longer
// match wins. Same logic as the original strip-poey-word script.
const REPLACEMENTS = [
  // ── โพย family (existing, kept for re-run safety) ──
  ['ค่ดโพย', 'คัดสรุป'],
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
  ['โพย', 'สรุป'],

  // ── "exam-leak" / "prior-knowledge" patterns ──
  // "ออกตามนี้" implies the senior had inside info on what came up
  ['Vet 85 ออกตามนี้', 'อิงแนวสอบ Vet 85'],
  ['85 ออกตามนี้', 'อิงแนวสอบ Vet 85'],
  ['Vet 84 ออกตามนี้', 'อิงแนวสอบ Vet 84'],
  ['ออกตามนี้', 'อิงแนวสอบรอบเดียวกัน'],

  // "ตรงข้อสอบ" / "ตรงเป๊ะ" — implies seeing the actual paper
  ['ตรงข้อสอบ', 'ตรงตามแนวสอบ'],
  ['ตรงเป๊ะ', 'ใกล้เคียง'],
  ['ตรงสอบ', 'ตรงแนวสอบ'],
  ['ตรงโจทย์', 'ตรงตามแนวสอบ'],

  // Direct cheating words
  ['ข้อสอบรั่ว', 'เอกสารบันทึกหลังสอบ'],
  ['ข้อสอบหลุด', 'เอกสารบันทึกหลังสอบ'],
  ['leaked exam', 'past-paper note'],
  ['leaked', 'past-paper'],

  // Senior-attribution "X marked which came out" pattern
  ['ซซดาวที่ออก 84', 'ซซดาวบันทึก Vet 84'],
  ['ซซดาวที่ออก', 'ซซดาวบันทึก'],
];

// ── File walker ───────────────────────────────────────────────
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
      out.push(...walk(path));
    } else if (/\.(js|jsx|mjs|md|json)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

// ── Scan + (optionally) apply ──────────────────────────────────
const files = walk(SRC_DIR);
const findings = []; // [{ file, pattern, count }]
let totalHits = 0;

for (const f of files) {
  let content = readFileSync(f, 'utf8');
  const before = content;
  for (const [pat, rep] of REPLACEMENTS) {
    let count = 0;
    while (content.includes(pat)) {
      content = content.replace(pat, rep);
      count++;
    }
    if (count > 0) {
      findings.push({ file: relative(ROOT, f), pattern: pat, replacement: rep, count });
      totalHits += count;
    }
  }
  if (APPLY && content !== before) {
    writeFileSync(f, content, 'utf8');
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify({ totalHits, findings }, null, 2));
  process.exit(totalHits > 0 && !APPLY ? 1 : 0);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('ACADEMIC-SAFETY VOCABULARY LINT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Mode: ${APPLY ? '✏️  APPLY (rewriting files)' : '🔍 LINT-ONLY (exit 1 on hits)'}`);
console.log(`Files scanned: ${files.length}`);
console.log(`Banned patterns: ${REPLACEMENTS.length}`);
console.log(`Hits: ${totalHits}`);
console.log('');

if (totalHits === 0) {
  console.log('✅ Clean. No academic-safety vocabulary found.');
  process.exit(0);
}

// Group by pattern for readability
const byPattern = new Map();
for (const f of findings) {
  if (!byPattern.has(f.pattern)) byPattern.set(f.pattern, { count: 0, files: [], replacement: f.replacement });
  byPattern.get(f.pattern).count += f.count;
  byPattern.get(f.pattern).files.push(`${f.file} (×${f.count})`);
}

const sorted = [...byPattern.entries()].sort((a, b) => b[1].count - a[1].count);
for (const [pat, info] of sorted) {
  console.log(`  ${info.count.toString().padStart(4)}× "${pat}" → "${info.replacement}"`);
  for (const f of info.files.slice(0, 3)) console.log(`         ${f}`);
  if (info.files.length > 3) console.log(`         ... and ${info.files.length - 3} more`);
}

console.log('');
if (APPLY) {
  console.log(`✏️  Applied ${totalHits} substitution(s). Run lint again to verify clean.`);
  process.exit(0);
} else {
  console.log('💡 Run with --apply to auto-fix:');
  console.log('     node scripts/lint-academic-safety.mjs --apply');
  console.log('');
  console.log(`❌ ${totalHits} academic-safety violation(s). Fix before commit.`);
  process.exit(1);
}
