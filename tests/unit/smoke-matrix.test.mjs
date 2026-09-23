// The Smoke e2e workflow is the check Vercel waits for before students get a
// fix. As one job it ran the Chromium step and then the WebKit + Firefox
// step on one runner: 18-23 min per push (median 22.4), and its step caps
// (14 + 16) plus setup exceeded the 30 min job cap, so a slow run could lose
// the report it promised to keep (STAB-14).
//
// It is now three runners (chromium; webkit + firefox in two shards) and one
// aggregating job that keeps the required name `smoke`. e2e-ci-parity.test.mjs
// still pins the flags of the two Playwright steps against test:e2e:ci.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../../.github/workflows/smoke-e2e.yml', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n');

// Top-level jobs: two-space indent under `jobs:`.
const jobs = Object.fromEntries(
  workflow.split(/\njobs:\n/)[1].split(/\n(?=  [\w-]+:\n)/).map((block) => {
    const id = /^\s*([\w-]+):/.exec(block)[1];
    return [id, block];
  }),
);

test('the workflow keeps its name and a job called smoke', () => {
  assert.match(workflow, /^name: Smoke e2e$/m);
  assert.ok(jobs.smoke, 'a job with id smoke');
  assert.match(jobs.smoke, /^    name: smoke$/m);
});

test('smoke waits for every e2e runner and passes only when all of them passed', () => {
  assert.match(jobs.smoke, /^    needs: e2e$/m);
  // Without always(), a failed runner would SKIP smoke, and a skipped job
  // satisfies a required check.
  assert.match(jobs.smoke, /^    if: always\(\)$/m);
  assert.match(jobs.smoke, /RESULT: \$\{\{ needs\.e2e\.result \}\}/);
  assert.match(jobs.smoke, /test "\$RESULT" = "success"/);
});

test('the software-GL engines are split across two runners, one worker each', () => {
  const e2e = jobs.e2e;
  assert.ok(e2e, 'a matrix job with id e2e');
  assert.match(e2e, /fail-fast: false/);
  const shards = [...e2e.matchAll(/^\s+shard: (\S+)$/gm)].map((m) => m[1]).sort();
  assert.deepEqual(shards, ['1/2', '2/2']);
  const gl = e2e.split(/\n\s*- name: /).find((s) => /--project=webkit-mobile/.test(s));
  assert.match(gl, /--workers=1/);
  assert.match(gl, /--shard=\$\{\{ matrix\.shard \}\}/);
  assert.match(gl, /if: matrix\.group == 'gl'/);
  const chromium = e2e.split(/\n\s*- name: /).find((s) => /--project=chromium-desktop/.test(s));
  assert.match(chromium, /if: matrix\.group == 'chromium'/);
});

test('a runner whose browser step hits its cap still has time to upload the report', () => {
  const e2e = jobs.e2e;
  const jobCap = Number(/^    timeout-minutes: (\d+)$/m.exec(e2e)[1]);
  const stepCaps = [...e2e.matchAll(/^        timeout-minutes: (\d+)$/gm)].map((m) => Number(m[1]));
  assert.ok(stepCaps.length >= 2, 'each browser step has its own cap');
  const SETUP = 2; // checkout, npm ci, browsers, build: 2.0 min in run 35761306637
  assert.ok(jobCap >= SETUP + Math.max(...stepCaps) + 3, `job cap ${jobCap} < setup + ${Math.max(...stepCaps)} + 3`);
  // Three runners upload into one run: the artifact names must differ.
  assert.match(e2e, /name: playwright-report-\$\{\{ matrix\.report \}\}/);
  const reports = [...e2e.matchAll(/^\s+report: (\S+)$/gm)].map((m) => m[1]);
  assert.equal(new Set(reports).size, reports.length);
});
