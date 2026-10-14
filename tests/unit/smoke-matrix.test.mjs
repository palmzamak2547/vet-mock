// The Smoke e2e workflow is the check Vercel waits for before students get a
// fix. As one job it ran the Chromium step and then the WebKit + Firefox
// step on one runner: 18-23 min per push (median 22.4), and its step caps
// (14 + 16) plus setup exceeded the 30 min job cap, so a slow run could lose
// the report it promised to keep (STAB-14).
//
// It is now seven runners (Chromium desktop and mobile, WebKit in thirds,
// Firefox in halves) and one aggregating job that keeps the required name
// `smoke`. e2e-ci-parity.test.mjs still pins the flags of the two Playwright
// steps against test:e2e:ci.
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

test('every engine runs on runners of its own, the software-GL ones on one worker', () => {
  const e2e = jobs.e2e;
  assert.ok(e2e, 'a matrix job with id e2e');
  assert.match(e2e, /fail-fast: false/);
  const entries = e2e.split(/\n\s+- label: /).slice(1).map((entry) => ({
    group: /^\s+group: (\S+)$/m.exec(entry)?.[1],
    project: /^\s+project: (\S+)$/m.exec(entry)?.[1],
    shard: /^\s+shard: (\S+)$/m.exec(entry)?.[1],
    connected: /^\s+connected: true$/m.test(entry),
  }));
  // One --shard over both projects cut the ordered list, every WebKit test and
  // then every Firefox one, so "half 1" was the whole of WebKit (311 of 311,
  // 13 Oct) and ran out of its cap. Each engine is sharded on its own, and a
  // shard stays near 40% of its cap (WebKit's first half was at 57%).
  const gl = entries.filter((e) => e.group === 'gl').map((e) => `${e.project} ${e.shard}`).sort();
  assert.deepEqual(gl, ['firefox-desktop 1/2', 'firefox-desktop 2/2', 'webkit-mobile 1/3', 'webkit-mobile 2/3', 'webkit-mobile 3/3']);
  // Both Chromium projects on one runner took 12.2-12.3 of 14 min in three of
  // five runs (14 Oct): one project per runner, the connected specs on one.
  const chromium = entries.filter((e) => e.group === 'chromium');
  assert.deepEqual(chromium.map((e) => e.project).sort(), ['chromium-desktop', 'chromium-mobile']);
  assert.equal(chromium.filter((e) => e.connected).length, 1, 'the connected bundle and specs run on one Chromium runner');
  assert.equal(entries.filter((e) => e.connected).length, 1);
  const steps = e2e.split(/\n\s*- name: /);
  const glStep = steps.find((s) => /^Run smoke e2e \(software-GL/.test(s));
  assert.match(glStep, /--project=\$\{\{ matrix\.project \}\}/);
  assert.match(glStep, /--workers=1/);
  assert.match(glStep, /--shard=\$\{\{ matrix\.shard \}\}/);
  assert.match(glStep, /if: matrix\.group == 'gl'/);
  const chromiumStep = steps.find((s) => /^Run smoke e2e \(chromium\)/.test(s));
  assert.match(chromiumStep, /if: matrix\.group == 'chromium'/);
  assert.match(chromiumStep, /--project=\$\{\{ matrix\.project \}\}/);
  for (const name of [/^Build the connected bundle/, /^Keep the placeholder database host/, /^Run the connected specs/, /^The connected specs ran/]) {
    assert.match(steps.find((s) => name.test(s)), /if: matrix\.connected$/m, String(name));
  }
});

test('a runner whose browser step hits its cap still has time to upload the report', () => {
  const e2e = jobs.e2e;
  const jobCap = Number(/^    timeout-minutes: (\d+)$/m.exec(e2e)[1]);
  const stepCaps = [...e2e.matchAll(/^        timeout-minutes: (\d+)$/gm)].map((m) => Number(m[1]));
  assert.ok(stepCaps.length >= 2, 'each browser step has its own cap');
  const SETUP = 2; // checkout, npm ci, browsers, build: 2.0 min in run 35761306637
  assert.ok(jobCap >= SETUP + Math.max(...stepCaps) + 3, `job cap ${jobCap} < setup + ${Math.max(...stepCaps)} + 3`);
  // Every runner uploads into one run: the artifact names must differ.
  assert.match(e2e, /name: playwright-report-\$\{\{ matrix\.report \}\}/);
  const reports = [...e2e.matchAll(/^\s+report: (\S+)$/gm)].map((m) => m[1]);
  assert.equal(new Set(reports).size, reports.length);
});
