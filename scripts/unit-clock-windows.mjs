#!/usr/bin/env node
// npm run test:unit:clock [-- --window=<name>] [--jobs=N] [--list]
//
// The unit suite in UTC (as CI runs it) with the wall clock moved into each window where a test that
// reads the real clock or the machine's zone breaks, while the clock keeps running:
//
//   evening-utc       today 17:05 UTC: Bangkok has already turned the next day, UTC has not
//   before-midnight   today 23:55 UTC: the last minutes of the UTC day
//   month-end         the last day of this month, 17:30 UTC: Bangkok is on the 1st of the next month
//   leap-day          the next 29 February, 16:30 UTC: 23:30 on 29 Feb in Bangkok
//
// On 15 Nov 2026 tests/unit/storage-honesty.test.mjs built "today" from the runner's local date while
// the product counts study days in Bangkok (src/lib/study-day.js); it was green all day and failed
// every Build from 17:00 to 24:00 UTC (pull request #283). A test like that passes or fails by the
// hour, so nobody sees it until a night run is blocked. Here it fails on any day, at any hour.
//
// The clock moves through tests/unit/clock-shift.mjs, loaded with NODE_OPTIONS so that node processes
// a test starts read the same clock. Exit 1 when a test failed in any window. --list prints the windows.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The windows for a given moment (UTC), each an ISO instant. */
export function clockWindows(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const iso = (ms) => new Date(ms).toISOString();
  let leapYear = y;
  const isLeap = (yr) => (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
  while (!isLeap(leapYear) || Date.UTC(leapYear, 1, 29, 16, 30) < now.getTime()) leapYear += 1;
  return {
    'evening-utc': iso(Date.UTC(y, m, d, 17, 5)),
    'before-midnight': iso(Date.UTC(y, m, d, 23, 55)),
    'month-end': iso(Date.UTC(y, m + 1, 0, 17, 30)),
    'leap-day': iso(Date.UTC(leapYear, 1, 29, 16, 30)),
  };
}

/**
 * Failed test cases from a JUnit report: [{ file, name }]. A `todo` case that fails is reported with
 * both <skipped type="todo"> and <failure>; `node --test` (and so `npm run test:unit`) does not fail on
 * it, so neither does this.
 */
export function failuresFromJunit(xml) {
  const out = [];
  // An attribute value may hold a raw `>` (the failure message does), so the tag ends at the first `>`
  // outside quotes.
  const re = /<testcase\b((?:[^>"]|"[^"]*")*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  for (const m of xml.matchAll(re)) {
    const body = m[3] || '';
    if (!/<failure\b/.test(body)) continue;
    if (/<skipped\b[^>]*\btype="todo"/.test(body)) continue;
    const attr = (k) => (new RegExp(`\\b${k}="([^"]*)"`).exec(m[1]) || [])[1] || '';
    const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    out.push({ file: unesc(attr('file') || attr('classname')), name: unesc(attr('name')) });
  }
  return out;
}

function runWindow(name, at, { cwd = repo } = {}) {
  return new Promise((resolve) => {
    const report = path.join(os.tmpdir(), `vetmock-unit-clock-${name}-${process.pid}.xml`);
    const preload = pathToFileURL(path.join(cwd, 'tests', 'unit', 'clock-shift.mjs')).href;
    const env = {
      ...process.env,
      TZ: 'UTC',
      VMX_CLOCK_AT: at,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim(),
    };
    const args = ['--import', './tests/unit/setup-generated.mjs', '--test', '--test-concurrency=2',
      '--test-reporter=dot', '--test-reporter-destination=stdout',
      '--test-reporter=junit', `--test-reporter-destination=${report}`, 'tests/unit/*.test.mjs'];
    const t0 = Date.now();
    let output = '';
    const child = spawn(process.execPath, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (b) => { output += b; });
    child.stderr.on('data', (b) => { output += b; });
    child.on('close', (code) => {
      let failed = [];
      try { failed = failuresFromJunit(fs.readFileSync(report, 'utf8')); fs.rmSync(report, { force: true }); } catch { /* no report */ }
      // A suite that failed with no failing case in its report (a crash, a file that did not load) is a failure too.
      if (code !== 0 && !failed.length) failed = [{ file: '(suite)', name: `exited ${code}: ${output.trim().split(/\r?\n/).slice(-5).join(' | ')}` }];
      resolve({ name, at, code, failed, ms: Date.now() - t0 });
    });
  });
}

async function main(argv) {
  const windows = clockWindows();
  if (argv.includes('--list')) {
    for (const [k, v] of Object.entries(windows)) console.log(`${k.padEnd(16)} ${v}`);
    return 0;
  }
  const pick = argv.find((a) => a.startsWith('--window='))?.slice(9);
  const names = pick ? pick.split(',') : Object.keys(windows);
  for (const n of names) if (!windows[n]) throw new Error(`no window named ${n} (${Object.keys(windows).join(', ')})`);
  const jobs = Math.max(1, Number(argv.find((a) => a.startsWith('--jobs='))?.slice(7)) || 1);
  console.log(`unit suite, TZ=UTC, clock moved into: ${names.map((n) => `${n} (${windows[n]})`).join(', ')}`);
  const results = [];
  const queue = [...names];
  await Promise.all(Array.from({ length: Math.min(jobs, names.length) }, async () => {
    while (queue.length) {
      const n = queue.shift();
      const r = await runWindow(n, windows[n]);
      results.push(r);
      console.log(`${r.failed.length ? '✗' : '✓'} ${n.padEnd(16)} ${windows[n]}  ${(r.ms / 1000).toFixed(0)} s${r.failed.length ? `, ${r.failed.length} failed` : ''}`);
      for (const f of r.failed) console.log(`    ${f.file} :: ${f.name}`);
    }
  }));
  const bad = results.filter((r) => r.failed.length);
  if (bad.length) {
    console.log('\nA test above passes or fails by the hour or the date it runs. Give it one fixed instant (and read Bangkok days through src/lib/study-day.js), never the real clock or the machine\'s zone.');
    return 1;
  }
  console.log(`\nno test depends on the hour or the date (${names.length} window(s))`);
  return 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main(process.argv.slice(2)).then((c) => { process.exitCode = c; }, (e) => { console.error(`✗ ${e.stack || e.message}`); process.exitCode = 1; });
}
