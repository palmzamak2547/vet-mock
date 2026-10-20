#!/usr/bin/env node
// node scripts/e2e-durations.mjs <playwright json report>... [--fail] [--share=0.4]
//
// The test-duration budget. A test that needs most of its timeout fails the day the runner is a
// little slower or a retry lands on top of it: on 20 Oct a 21 s WebKit journey ran into its 30 s
// cap under load, and a Firefox service-worker spec took 35-55 s of 60. This reads Playwright's
// JSON report and lists every test whose slowest attempt took more than --share (default 40%) of
// its timeout, as GitHub warnings and a table in the step summary, slowest share first. --fail
// turns a breach into a non-zero exit; without it the step only warns, so CI shows the debt
// without going red over a test that passed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
const share = Number(args.find((a) => a.startsWith('--share='))?.slice(8) || 0.4);
const fail = args.includes('--fail');

export function slowTests(report, limit = share) {
  const out = [];
  const walk = (suite, file) => {
    for (const s of suite.suites || []) walk(s, s.file || file);
    for (const spec of suite.specs || []) {
      for (const t of spec.tests || []) {
        const runs = (t.results || []).filter((r) => r.status !== 'skipped');
        if (!runs.length || !t.timeout) continue;
        const ms = Math.max(...runs.map((r) => r.duration));
        out.push({ file: spec.file || file, title: spec.title, project: t.projectName, ms, timeout: t.timeout,
          share: ms / t.timeout, retried: runs.length > 1 });
      }
    }
  };
  for (const s of report.suites || []) walk(s, s.file);
  return out.filter((t) => t.share > limit).sort((a, b) => b.share - a.share);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const slow = [];
  for (const f of files) {
    if (!fs.existsSync(f)) { console.log(`no report at ${f}`); continue; }
    slow.push(...slowTests(JSON.parse(fs.readFileSync(f, 'utf8'))));
  }
  slow.sort((a, b) => b.share - a.share);
  const pct = (x) => `${Math.round(x * 100)}%`;
  const lines = [`## e2e tests over ${pct(share)} of their timeout: ${slow.length}`, '',
    '| share | time | timeout | project | test |', '|---|---|---|---|---|',
    ...slow.map((t) => `| ${pct(t.share)} | ${(t.ms / 1000).toFixed(1)} s | ${t.timeout / 1000} s | ${t.project} | ${t.file}: ${t.title}${t.retried ? ' (retried)' : ''} |`)];
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
  for (const t of slow) {
    console.log(`::warning file=tests/e2e/${t.file},title=e2e duration budget::${t.title} (${t.project}) took ${(t.ms / 1000).toFixed(1)} s, ${pct(t.share)} of its ${t.timeout / 1000} s timeout`);
  }
  if (fail && slow.length) process.exit(1);
}
