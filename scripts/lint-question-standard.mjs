#!/usr/bin/env node
// ============================================================
// lint-question-standard.mjs — how far each year is from the standard
// ============================================================
// Usage: node scripts/lint-question-standard.mjs [--strict]
//
// docs/QUESTION-STANDARD.md says what a good question looks like. This says
// where the corpus actually stands, per year, so "ทุกชั้นปี" is a number
// rather than an intention.
//
// Two of the rows are FAILURES — a question that names its source document, or
// an explanation that narrates it, is defective and must be zero. The rest are
// COVERAGE: how much of each year has reached the benchmark's habits. Coverage
// is not something to fail a build over; it is the gap being closed.
//
// --strict exits non-zero when a defect row is above zero.
// ============================================================

import fs from 'node:fs';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { DEFECTS, COVERAGE } from './lib/question-standard.mjs';

const m = await import('../src/data/curriculum.js');
const yearOf = new Map();
for (const y of m.YEARS) for (const s of (m.SUBJECTS_BY_YEAR[y.id] || [])) yearOf.set(s.id, y.id);

const byYear = new Map();
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  for (const q of questions) {
    const y = yearOf.get(q.subject) ?? q.year ?? 0;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(q);
  }
}


// An exemption that no longer applies is a decision nobody made. The wiki
// governance gate shipped exactly this bug once: a mistyped id sat in the
// exemption file looking deliberate while the section it named stayed counted.
const { FIGURE_EXEMPT } = await import('../src/data/figure-exempt.js');
const allIds = new Set([...byYear.values()].flat().map((q) => q.id));
const dangling = Object.keys(FIGURE_EXEMPT).map(Number).filter((id) => !allIds.has(id));
if (dangling.length) {
  console.error(`✗ figure-exempt.js names ${dangling.length} question(s) that do not exist: ${dangling.join(', ')}`);
  process.exitCode = 1;
}

const years = [...byYear.keys()].sort((a, b) => a - b);
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '—');
const col = (s) => String(s).padStart(7);

console.log('\nDEFECTS — these must be zero\n');
console.log('  '.padEnd(30) + years.map((y) => col(`ปี ${y}`)).join(''));
let defective = 0;
for (const [label, test] of DEFECTS) {
  const cells = years.map((y) => byYear.get(y).filter(test).length);
  defective += cells.reduce((a, b) => a + b, 0);
  console.log('  ' + label.padEnd(28) + cells.map((n) => col(n || '·')).join(''));
}

console.log('\nCOVERAGE — the gap being closed\n');
console.log('  '.padEnd(30) + years.map((y) => col(`ปี ${y}`)).join(''));
for (const [label, test] of COVERAGE) {
  console.log('  ' + label.padEnd(28) + years.map((y) => {
    const l = byYear.get(y);
    return col(pct(l.filter(test).length, l.length));
  }).join(''));
}
console.log('  ' + 'questions'.padEnd(28) + years.map((y) => col(byYear.get(y).length)).join(''));

const total = [...byYear.values()].reduce((a, l) => a + l.length, 0);
console.log(`\n${defective} defect(s) across ${total} questions`);

// The ratchet. Palm: "สร้างมาตรฐานที่ดียิ่งขึ้นไปเรื่อยๆ ... ดีขึ้นเรื่อยๆ".
// Aspiration does not survive a busy session, so the number is written down and
// the build fails if it goes up. 514 explanations still narrate their source;
// failing outright would block every unrelated commit until they are rewritten,
// while allowing them silently is how 354 deck-naming stems accumulated. A
// ceiling that can only fall is the honest middle.
const BASELINE = 'docs/question-standard-baseline.json';
if (process.argv.includes('--ratchet')) {
  const counts = Object.fromEntries(DEFECTS.map(([label, test]) =>
    [label, [...byYear.values()].flat().filter(test).length]));

  if (!fs.existsSync(BASELINE)) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(counts, null, 2)}\n`);
    console.log(`\nwrote first baseline to ${BASELINE}`);
    process.exit(0);
  }

  const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  let worse = false, better = false;
  for (const [label, n] of Object.entries(counts)) {
    // A row the baseline has never seen is a NEW MEASUREMENT, not a
    // regression. Those 26 figure-less questions were always there; counting
    // them for the first time is progress. Adopt the current number as its
    // ceiling — from here it can only fall.
    if (!(label in base)) { console.log(`+ ${label}: first measured at ${n}`); better = true; continue; }
    const was = base[label];
    if (n > was) { console.error(`✗ ${label}: ${was} → ${n}. The standard does not move backwards.`); worse = true; }
    else if (n < was) { console.log(`✓ ${label}: ${was} → ${n}`); better = true; }
  }
  for (const label of Object.keys(base)) {
    if (!(label in counts)) console.log(`· "${label}" is no longer measured — drop it from the baseline`);
  }
  if (worse) process.exit(1);
  if (better) {
    fs.writeFileSync(BASELINE, `${JSON.stringify(counts, null, 2)}\n`);
    console.log(`\nbaseline lowered — ${BASELINE} updated, commit it`);
  } else if (!worse) {
    console.log('\nno movement, no regression');
  }
}

if (process.argv.includes('--strict') && defective) process.exit(1);
