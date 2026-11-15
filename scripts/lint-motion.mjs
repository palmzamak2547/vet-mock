#!/usr/bin/env node
// lint:motion — a one-way ratchet on motion that the motion family rules out.
//
//   node scripts/lint-motion.mjs            check
//   node scripts/lint-motion.mjs --write    record lower counts (never raises a number)
//   node scripts/lint-motion.mjs --json     print today's counts
//
// The family is src/lib/motion/springs.js: transform and opacity only, a reduced-motion rule
// per effect, timing from the --vm-* tokens. What is counted, and why, is in
// scripts/lib/motion-lint.mjs. Today's debt is recorded per file in docs/motion-budget.json,
// so each team rebuilding a screen brings its own files' numbers down without touching
// anyone else's rows.
//
// The budget only falls:
//   - a count over its budget fails (move the motion to transform, opacity and the tokens);
//   - a count under its budget fails until --write records the lower number, so the headroom
//     cannot be spent again;
//   - a file with no row has budget 0;
//   - a budget number higher than main's (origin/main, fetched by lint:release-number earlier
//     in lint:data) fails, so a hand edit cannot raise it either. With no main here, or no
//     budget on main yet, that comparison is skipped and the lint says so.
//   - --write lowers numbers and drops zeros; it never raises one and never adds a row.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { countMotion, compareBudget, lowerBudget } from './lib/motion-lint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUDGET_REL = 'docs/motion-budget.json';
const BUDGET_PATH = path.join(ROOT, BUDGET_REL);

function walk(dir, test, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(full, test, acc); } else if (test(e.name)) acc.push(full);
  }
  return acc;
}
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

export function readSources(root = ROOT) {
  const src = path.join(root, 'src');
  const css = {};
  const scripts = {};
  for (const f of walk(src, (n) => n.endsWith('.css'))) css[path.relative(root, f).split(path.sep).join('/')] = fs.readFileSync(f, 'utf8');
  for (const f of walk(src, (n) => /\.(jsx?|mjs)$/.test(n) && !/\.(test|spec)\./.test(n))) {
    const r = path.relative(root, f).split(path.sep).join('/');
    if (r.startsWith('src/data/')) continue;
    scripts[r] = fs.readFileSync(f, 'utf8');
  }
  return { css, scripts };
}

function mainBudget() {
  try {
    const text = execFileSync('git', ['show', `origin/main:${BUDGET_REL}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return JSON.parse(text).files || {};
  } catch {
    return null;
  }
}

const total = (counts) => {
  const t = {};
  for (const row of Object.values(counts)) for (const [m, n] of Object.entries(row)) t[m] = (t[m] || 0) + n;
  return t;
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const counts = countMotion(readSources());
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ total: total(counts), files: counts }, null, 1));
    process.exit(0);
  }
  const exists = fs.existsSync(BUDGET_PATH);
  const budget = exists ? JSON.parse(fs.readFileSync(BUDGET_PATH, 'utf8')).files || {} : {};
  if (process.argv.includes('--write')) {
    // The first record of the debt is the only time a number is written from the counts.
    const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
    const next = exists ? lowerBudget(counts, budget) : sorted(counts);
    const { over } = compareBudget(counts, next);
    fs.writeFileSync(BUDGET_PATH, `${JSON.stringify({ about: 'lint:motion budget, per file. Numbers only fall: see scripts/lint-motion.mjs.', files: next }, null, 2)}\n`);
    console.log(`lint:motion — budget ${exists ? 'lowered' : 'recorded'}: ${JSON.stringify(total(next))}`);
    if (over.length) {
      console.error('Still over budget (--write never raises a number):');
      for (const line of over) console.error(`  ${line}`);
      process.exit(1);
    }
    process.exit(0);
  }
  if (!exists) {
    console.error(`lint:motion — ${BUDGET_REL} is missing.`);
    process.exit(1);
  }
  const main = mainBudget();
  const { over, under, rose } = compareBudget(counts, budget, main);
  if (over.length) {
    console.error('lint:motion — motion over its budget (use transform and opacity, a reduced-motion rule per effect, and the --vm-* tokens):');
    for (const line of over) console.error(`  ${line}`);
  }
  if (rose.length) {
    console.error(`lint:motion — ${BUDGET_REL} rose above main's; the budget only falls:`);
    for (const line of rose) console.error(`  ${line}`);
  }
  if (under.length) {
    console.error('lint:motion — lower than the budget; record it with `node scripts/lint-motion.mjs --write`:');
    for (const line of under) console.error(`  ${line}`);
  }
  if (over.length || rose.length || under.length) process.exit(1);
  console.log(`lint:motion — OK ${JSON.stringify(total(counts))}${main ? '' : ' (no budget on main to compare with; skipped that check)'}`);
}
