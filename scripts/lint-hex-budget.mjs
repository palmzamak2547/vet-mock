#!/usr/bin/env node
// ============================================================
// lint-hex-budget.mjs — a one-way ratchet on hardcoded hex colors
// ============================================================
// Usage: node scripts/lint-hex-budget.mjs [--write]
//
// Dark mode and the 5 palettes are var-driven: a component that
// hardcodes #hex renders wrong the moment the theme flips. The debt
// is ~700 hexes across ~100 files (2026-09 count), too much to clear
// in one pass — so the budget only moves one way:
//
//   • docs/hex-budget-baseline.json records each file's current count
//   • a file OVER its baseline fails the lint — fix colors to go down
//   • a file UNDER baseline is fine; --write re-records the new low
//
// Exempt by design:
//   • styles.css / styles-landing.css — the token DEFINITION layer;
//     hexes there are the values the vars point at
//   • scoped color-mix/gradient art the product can't express as a
//     theme var yet can be listed in the baseline's "exempt" map
//     with a reason, reviewed like any other decision
//
// This mirrors lint-question-standard's ratchet: coverage debt is a
// number to drive down, not a wall to fail every build against.
// ============================================================

import fs from 'node:fs';
import { resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = resolve(ROOT, 'src');
const BASELINE_PATH = resolve(ROOT, 'docs/hex-budget-baseline.json');

// Only app source counts: marketing (styles-landing) is tokenized
// already, and test fixtures aren't shipped UI.
const SCANNED_ROOTS = [
  resolve(SRC, 'views'),
  resolve(SRC, 'components'),
  resolve(SRC, 'lib'),
  resolve(SRC, 'hooks'),
  resolve(SRC, 'App.jsx'),
];

// 3- or 6-digit hex colors, not inside var() definitions (those live
// in styles.css anyway). rgba()/var() usage is not hex debt.
const HEX_RE = /#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b/g;

function listFiles(p) {
  const stat = fs.statSync(p);
  if (stat.isFile()) return [p];
  return fs.readdirSync(p, { withFileTypes: true }).flatMap((e) => {
    const full = resolve(p, e.name);
    if (e.isDirectory()) return listFiles(full);
    return /\.(jsx?|mjs)$/.test(e.name) ? [full] : [];
  });
}

const files = SCANNED_ROOTS.flatMap(listFiles);
const counts = {};
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
    // Strip comments so an explanatory mention of a hex doesn't count.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const n = (code.match(HEX_RE) || []).length;
  // Baseline keys are posix (`views/HomeView.jsx`); resolve() hands back
  // backslashes on Windows, and a `views\HomeView.jsx` key matches no
  // budget row — every budgeted file then reads as "gone" and the lint
  // fails on Palm's machine while passing on the Linux runner.
  if (n > 0) counts[f.slice(SRC.length + 1).split(sep).join('/')] = n;
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const exempt = new Set(Object.keys(baseline.exempt || {}));
const budget = baseline.budget || {};

const failures = [];
const lowered = {};
for (const [file, n] of Object.entries(counts)) {
  if (exempt.has(file)) continue;
  const cap = budget[file];
  if (cap == null) {
    // First run: everything current is the budget. --write records it.
    continue;
  }
  if (n > cap) failures.push(`${file}: ${n} > budget ${cap}`);
  else if (n < cap) lowered[file] = n;
}

// A budget row for a file that no longer exists (or hit 0 and was
// cleaned up) is a stale exemption — flag it like question-standard
// flags dead exemptions.
const gone = Object.keys(budget).filter((f) => counts[f] == null && !exempt.has(f));

if (process.argv.includes('--write')) {
  for (const [f, n] of Object.entries(counts)) budget[f] = n;
  for (const f of gone) delete budget[f];
  budget && Object.keys(budget).forEach((f) => { if (budget[f] === 0) delete budget[f]; });
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ budget, exempt: baseline.exempt || {} }, null, 2) + '\n');
  console.log(`hex budget: recorded ${Object.keys(counts).length} files, total ${Object.values(counts).reduce((a, b) => a + b, 0)} hexes`);
  process.exit(0);
}

if (failures.length) {
  console.error('lint:hex-budget — files over their hex budget:');
  for (const f of failures) console.error(`  ${f}`);
  console.error('Convert hardcoded colors to var(--clr-*) / var(--vmx-*) tokens, or lower the budget with --write if a hex was removed.');
  process.exit(1);
}
if (gone.length) {
  console.error('lint:hex-budget — baseline rows for files with no hexes left; run --write to record the improvement:');
  for (const f of gone) console.error(`  ${f}`);
  process.exit(1);
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`lint:hex-budget — OK (${total} hexes across ${Object.keys(counts).length} files, all within budget)`);
