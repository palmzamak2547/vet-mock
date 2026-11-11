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

// The job's name is an expression since 9 Nov 2026: `smoke` on every push to main, dispatch and
// pull request that is not a draft, and another name on a draft (see the draft tests below). Since
// 11 Nov "a draft" is the `state` job's answer when the run starts, never the event's payload.
const SMOKE_NAME = /^    name: \$\{\{ needs\.state\.outputs\.draft == 'true' && '([^']+)' \|\| 'smoke' \}\}$/m;

test('the workflow keeps its name and a job called smoke', () => {
  assert.match(workflow, /^name: Smoke e2e$/m);
  assert.ok(jobs.smoke, 'a job with id smoke');
  assert.match(jobs.smoke, SMOKE_NAME);
});

// 9 Nov 2026: a draft runs Build only, and marking it ready runs this workflow once.
test('a draft pull request runs no e2e and no PostgreSQL job, and marking it ready runs both', () => {
  const triggers = workflow.split(/\njobs:\n/)[0];
  assert.match(triggers, /^  pull_request:\n    branches: \[main\]\n(?:    #.*\n)*    types: \[opened, synchronize, reopened, ready_for_review\]$/m,
    'GitHub\'s three default types plus ready_for_review');
  assert.match(triggers, /^  push:\n    branches: \[main\]$/m, 'a push to main is untouched');
  // Skipping `changes` skips every job that needs it: the runners and the PostgreSQL job.
  assert.match(jobs.changes, /^    needs: state\n    if: needs\.state\.outputs\.draft == 'false'$/m);
  for (const id of ['e2e', 'annotation-db']) {
    assert.match(jobs[id], /^    needs: changes$/m, `${id} needs changes`);
    assert.match(jobs[id], /^    if: needs\.changes\.outputs\.app == 'true'$/m, `${id} runs only when changes ran and said app`);
  }
  // A newer push still replaces a pull request's run, and never a main commit's.
  assert.match(workflow, /^  group: smoke-\$\{\{ github\.ref == 'refs\/heads\/main' && github\.sha \|\| github\.ref \}\}$/m);
  assert.match(workflow, /^  cancel-in-progress: \$\{\{ github\.ref != 'refs\/heads\/main' \}\}$/m);
});

// A skipped job passes a required check. Had a draft's `smoke` passed (or skipped) under its own
// name, marking the draft ready and merging at once could merge on that stale result before the
// ready run created its own; with no result named `smoke`, the ruleset waits for that run.
test('a draft never carries a result named smoke, and nothing else is ever renamed', () => {
  const draftName = SMOKE_NAME.exec(jobs.smoke)[1];
  assert.notEqual(draftName, 'smoke');
  assert.ok(!['build', 'Annotation PostgreSQL', 'VCA', 'Research R parity'].includes(draftName), 'not another required check either');
  // It runs on a draft (so its name is evaluated) and only says so; the gate step is a non-draft's.
  const steps = jobs.smoke.split(/\n\s*- name: /);
  assert.match(steps.find((s) => /^A draft runs no e2e/.test(s)), /^        if: needs\.state\.outputs\.draft == 'true'$/m);
  assert.match(steps.find((s) => /^Every e2e runner passed/.test(s)), /^        if: needs\.state\.outputs\.draft != 'true'$/m);
});

// PR #200, 11 Nov 2026: a push and "ready for review" seconds apart left two runs on one commit; the
// newer came from the push, whose payload still said draft, so the newest run had no `smoke` and the
// pull request sat blocked with every check green. The draft state is read when the run starts.
test('the draft state comes from the pull request when the run starts, never from the event payload', () => {
  const state = jobs.state;
  assert.ok(state, 'a job with id state');
  assert.doesNotMatch(state, /^    needs:/m, 'state is the first job');
  assert.match(state, /pull-requests: read/);
  assert.match(state, /\[ "\$ACTION" = ready_for_review \]; then draft=false/, 'ready_for_review is ready by definition');
  assert.match(state, /gh api "repos\/\$\{\{ github\.repository \}\}\/pulls\/\$NUMBER" --jq \.draft/);
  // The payload is read only by state, as its fallback when the API does not answer.
  const others = Object.entries(jobs).filter(([id]) => id !== 'state').map(([, block]) => block).join('\n');
  assert.doesNotMatch(others, /github\.event\.pull_request\.draft/, 'nothing but state reads the payload draft');
  // A run that read draft on a ready pull request fails loudly rather than leave smoke unreported.
  const draftStep = jobs.smoke.split(/\n\s*- name: /).find((s) => /^A draft runs no e2e/.test(s));
  // It reads three times, and anything but "draft" on any read fails: a stale answer (false) and an
  // API error (unknown) alike, since neither proves a newer run exists.
  assert.match(draftStep, /for attempt in 1 2 3; do/);
  assert.match(draftStep, /\|\| now=unknown/);
  assert.match(draftStep, /\*false\*\|\*unknown\*\)[\s\S]*gh pr update-branch \$NUMBER[\s\S]*exit 1/);
  assert.doesNotMatch(draftStep, /gh run rerun/, 'a re-run keeps state\'s first answer, so it is not the way out');
});

test('Annotation PostgreSQL lives here, under its required name, and nowhere else', () => {
  assert.match(jobs['annotation-db'], /^    name: Annotation PostgreSQL$/m);
  for (const harness of ['test-annotation-db', 'test-user-data-db', 'test-chula-wall-db']) {
    assert.match(jobs['annotation-db'], new RegExp(`run: node scripts/${harness}\\.mjs --backend=postgres`));
  }
  const build = readFileSync(new URL('../../.github/workflows/build.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(build, /Annotation PostgreSQL$|test-annotation-db/m, 'build.yml no longer runs it, so it cannot report twice');
  // Build keeps the trigger types a draft push fires (it is the draft's cheap signal) and never
  // reruns when a draft is marked ready: that commit's build already ran.
  assert.doesNotMatch(build, /ready_for_review/);
});

test('smoke waits for every e2e runner and passes only when all of them passed', () => {
  assert.match(jobs.smoke, /^    needs: \[state, changes, e2e\]$/m);
  // Without always(), a failed runner would SKIP smoke, and a skipped job
  // satisfies a required check.
  assert.match(jobs.smoke, /^    if: always\(\)$/m);
  assert.match(jobs.smoke, /RESULT: \$\{\{ needs\.e2e\.result \}\}/);
  assert.match(jobs.smoke, /test "\$CHANGES" = "success"/);
  assert.match(jobs.smoke, /test "\$RESULT" = "success"/);
  // The success test runs on every run that is not a draft: its step has no other condition, and
  // the one way out before it is the docs-only skip.
  const gate = jobs.smoke.split(/\n\s*- name: /).find((s) => /^Every e2e runner passed/.test(s));
  assert.match(gate, /^        if: needs\.state\.outputs\.draft != 'true'$/m);
  assert.equal((gate.match(/^        if:/gm) || []).length, 1, 'one condition on the gate step');
  const beforeTest = gate.split('test "$RESULT" = "success"')[0];
  const exits = beforeTest.split('\n').filter((line) => /\bexit\b/.test(line)).map((line) => line.trim());
  assert.deepEqual(exits, ['if [ "$APP" = "false" ]; then exit 0; fi'], 'no early exit before the success test but the docs-only one');
});

// 27 Oct: a pull request that changes only docs/ and root markdown skips the
// runners; push and dispatch never do, because Vercel waits for smoke there.
// (A draft skips them too, through `changes` itself: see the draft tests.)
test('a docs-only pull request skips the e2e runners, and push and dispatch never do', () => {
  assert.ok(jobs.changes, 'a job with id changes');
  assert.match(jobs.changes, /github\.event_name \}\}" != pull_request \]; then app=true/);
  assert.match(jobs.changes, /git diff --quiet HEAD\^1 HEAD -- \. ':\(exclude\)docs' ':\(exclude,glob\)\*\.md'; then app=false/);
  assert.match(jobs.e2e, /^    needs: changes$/m);
  assert.match(jobs.e2e, /^    if: needs\.changes\.outputs\.app == 'true'$/m);
  // The skip is only ever for app=false: a changes job that failed fails smoke.
  assert.match(jobs.smoke, /if \[ "\$APP" = "false" \]; then exit 0; fi/);
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
  // five runs (14 Oct): one project per runner, the connected specs on one. On
  // 11 Nov chromium desktop took 12.8 minutes against Playwright's 13-minute
  // globalTimeout: each Chromium project is now in halves.
  const chromium = entries.filter((e) => e.group === 'chromium');
  assert.deepEqual(chromium.map((e) => `${e.project} ${e.shard}`).sort(),
    ['chromium-desktop 1/2', 'chromium-desktop 2/2', 'chromium-mobile 1/2', 'chromium-mobile 2/2']);
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
  // Exactly these conditions: one added to either would silently drop a runner's tests.
  assert.match(chromiumStep, /^        if: matrix\.group == 'chromium'$/m);
  assert.match(glStep, /^        if: matrix\.group == 'gl'$/m);
  assert.match(chromiumStep, /--project=\$\{\{ matrix\.project \}\}/);
  assert.match(chromiumStep, /--shard=\$\{\{ matrix\.shard \}\}/);
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

// 11 Nov 2026: a runner added or removed must show in the workflow header's list, which carries
// the minutes measured when the matrix last changed, and the required aggregate must wait for every
// job that runs e2e: a job outside smoke's needs could fail without turning smoke red.
test('the runner list in the header, the matrix and smoke\'s needs agree', () => {
  const labels = jobs.e2e.split(/\n\s+- label: /).slice(1).map((entry) => entry.split('\n')[0].trim());
  assert.equal(new Set(labels).size, labels.length, 'labels are unique');
  const header = workflow.split(/\nname: Smoke e2e\n/)[0];
  const listed = /^# Runners: ([\s\S]*?)\.\n/m.exec(header)?.[1].replace(/\n# /g, ' ').split('; ').map((l) => l.trim());
  assert.deepEqual(listed?.slice().sort(), labels.slice().sort(), 'the header lists exactly the matrix runners');
  assert.match(header.replace(/\n# /g, ' '), /split a job when its tests pass 9 of the 13 minutes/);
  const needs = /^    needs: \[([^\]]*)\]$/m.exec(jobs.smoke)[1].split(',').map((n) => n.trim());
  const runsE2e = Object.entries(jobs).filter(([, block]) => /npx playwright test/.test(block)).map(([id]) => id);
  assert.ok(runsE2e.length >= 1);
  for (const id of runsE2e) assert.ok(needs.includes(id), `smoke needs ${id}`);
  // The aggregate passes only when the whole matrix passed: a failed or skipped leg fails it.
  assert.match(jobs.smoke, /test "\$RESULT" = "success"/);
});
