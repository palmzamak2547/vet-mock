#!/usr/bin/env node
// ============================================================
// perf-budget.mjs — the size budgets, checked against the build
// ============================================================
// Usage (npm run perf:budget, after npm run build):
//   node scripts/perf-budget.mjs            check dist/ against perf-budgets.json; exits 1 on a breach
//   node scripts/perf-budget.mjs --write    re-measure and rewrite the bundle section of perf-budgets.json
//   node scripts/perf-budget.mjs --json     print the measured sizes as JSON (nothing is checked)
//
// What it measures: for each route in perf-budgets.json's bundle.routes, the JavaScript and CSS the
// browser has to fetch, gzipped (level 9, Node zlib, each file on its own as the browser fetches it).
// The first load is index.html's entry, its static imports and the CSS of all of them, read from
// dist/.vite/manifest.json (Vite's build.manifest). A lazy view is its own chunk and the chunks and CSS
// it imports statically, minus whatever the first load already holds: what opening it adds. Nothing
// here opens a browser or reads the clock, so the numbers are the same on every machine, and a
// breach is a code change, never a slow runner.
//
// A budget is an alarm. It sits at the measured size plus 3%, rounded up to 100 bytes. When it goes
// off: find what grew (the biggest files of the route are listed below the table). If the growth is
// worth its weight, raise the budget with --write and give the measured reason in the pull request
// (docs/GITFLOW.md section 1). tests/unit/perf-budget.test.mjs rejects a budget that is not exactly
// measured + headroom, so a bigger number cannot be typed in.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEADROOM, budgetFor, checkSizes, entryFiles, gzipBytes, routeSizes } from './lib/perf-logic.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;

const distDir = path.resolve(ROOT, option('dist', 'dist'));
const budgetsPath = path.resolve(ROOT, option('budgets', 'perf-budgets.json'));
const manifestPath = path.join(distDir, '.vite', 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`perf:budget: ${path.relative(ROOT, manifestPath)} not found; run npm run build first`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const budgets = JSON.parse(fs.readFileSync(budgetsPath, 'utf8'));
const routes = budgets.bundle?.routes ?? {};
const read = (file) => fs.readFileSync(path.join(distDir, file));

// Measure every route. A route names its manifest entries (a key, or a chunk name) and, for a lazy view,
// the route whose files it comes after (`after`): what it adds to a visit that has loaded those already.
const sizes = {};
const files = {};
const problems = {};
for (const [name, route] of Object.entries(routes)) {
  try {
    const except = route.after ? entryFiles(manifest, routes[route.after].entries) : null;
    const measured = routeSizes(manifest, route.entries, read, { except });
    sizes[name] = { js: measured.js, css: measured.css };
    files[name] = measured.files;
  } catch (error) {
    sizes[name] = null;
    problems[name] = error.message;
  }
}

if (flag('json')) {
  console.log(JSON.stringify(sizes, null, 2));
  process.exit(0);
}

const kb = (n) => (n === null ? '-' : `${n} (${(n / 1024).toFixed(1)} KB)`);
const pct = (n) => `${n >= 0 ? '+' : ''}${(n * 100).toFixed(1)}%`;

if (flag('write')) {
  for (const [name, route] of Object.entries(routes)) {
    if (!sizes[name]) {
      console.error(`perf:budget --write: route ${name}: ${problems[name]}; fix its entries in ${path.basename(budgetsPath)} first`);
      process.exit(1);
    }
    for (const kind of ['js', 'css']) {
      route[kind] = { measured: sizes[name][kind], budget: budgetFor(sizes[name][kind], budgets.headroom ?? HEADROOM) };
    }
  }
  fs.writeFileSync(budgetsPath, `${JSON.stringify(budgets, null, 2)}\n`);
  console.log(`perf:budget: wrote ${Object.keys(routes).length} routes to ${path.relative(ROOT, budgetsPath)}`);
  for (const [name, route] of Object.entries(routes)) {
    console.log(`  ${name.padEnd(14)} js ${String(route.js.measured).padStart(8)} B -> ${String(route.js.budget).padStart(8)} B   css ${String(route.css.measured).padStart(7)} B -> ${String(route.css.budget).padStart(7)} B`);
  }
  process.exit(0);
}

const rows = checkSizes(routes, Object.fromEntries(Object.entries(sizes).map(([name, size]) => [name, size ?? {}])));
const table = rows.map((r) => {
  const slack = r.measured === null || r.budget === 0 ? null : (r.budget - r.measured) / r.budget;
  return {
    ...r, label: routes[r.name].label || r.name, slack,
    // The budget was set at measured + 3%; a build now well under it has room to spare that
    // would let a regression of that size through unnoticed.
    loose: r.ok && slack !== null && slack > 0.15,
  };
});

const lines = [
  '## Bundle size budget (gzip bytes, JS and CSS)',
  '',
  '| route | kind | measured | budget | room | |',
  '|---|---|---|---|---|---|',
  ...table.map((r) => `| ${r.name} | ${r.kind} | ${kb(r.measured)} | ${kb(r.budget)} | ${r.slack === null ? '-' : pct(r.slack)} | ${r.ok ? (r.loose ? 'ok, can be tightened' : 'ok') : '**OVER**'} |`),
];
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);

const over = table.filter((r) => !r.ok);
for (const r of table.filter((x) => x.loose)) {
  console.log(`note: ${r.name} ${r.kind} is ${pct(-r.slack)} under its budget; node scripts/perf-budget.mjs --write tightens it`);
}
if (over.length) {
  console.error(`\nperf:budget: ${over.length} budget(s) exceeded`);
  const reported = new Set();
  for (const r of over) {
    const route = routes[r.name];
    if (r.measured === null) {
      if (reported.has(r.name)) continue;
      reported.add(r.name);
      console.error(`  ${r.name} ${r.kind}: ${problems[r.name]}. Was the file renamed or removed? Update its entries in ${path.basename(budgetsPath)}.`);
      console.log(`::error title=Bundle budget::${r.name}: ${problems[r.name]}`);
      continue;
    }
    const by = r.measured - r.budget;
    console.error(`  ${r.name} ${r.kind}: ${r.measured} B gzip against a budget of ${r.budget} B, over by ${by} B${r.budget ? ` (${pct(by / r.budget)})` : ''} - ${route.label || route.entries.join(', ')}`);
    console.log(`::error title=Bundle budget::${r.name} ${r.kind} is ${r.measured} B gzip, ${by} B over its ${r.budget} B budget`);
    const biggest = (files[r.name]?.[r.kind] ?? [])
      .map((file) => ({ file, gz: gzipBytes(read(file)) }))
      .sort((a, b) => b.gz - a.gz)
      .slice(0, 5);
    console.error('      the largest files of this route, gzipped:');
    for (const f of biggest) console.error(`      ${String(f.gz).padStart(8)} B  ${f.file}`);
  }
  console.error('\nA budget is an alarm. Find what grew; if the growth is worth it, run node scripts/perf-budget.mjs --write and');
  console.error('put the measured reason in the pull request (docs/GITFLOW.md section 1).');
  process.exit(1);
}
console.log(`\nperf:budget: ${Object.keys(routes).length} routes within their budgets`);
