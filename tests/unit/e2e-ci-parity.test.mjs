// `npm run gate` runs Playwright with the config's local defaults: half the
// cores as workers, no retry, test.only allowed. CI runs the same suite in two
// steps under CI=true (chromium on 2 workers, the software-GL engines on 1,
// one retry, forbid-only). Fourteen local gates in a row came back red on
// failures CI never showed, so a verdict took an hour of reruns.
//
// test:e2e:ci reproduces the CI steps with CLI flags. It cannot use a
// `CI=1 ...` prefix: npm runs scripts under cmd.exe on Windows, where that is
// a syntax error. This test keeps the local scripts and the workflow in step.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const { scripts } = JSON.parse(read('package.json'));
const workflow = read('.github/workflows/smoke-e2e.yml');

// The config's CI branch is what a flag-less CI step inherits.
process.env.CI = '1';
const { default: ciConfig } = await import('../../playwright.config.js');

const flag = (cmd, name) => cmd.match(new RegExp(`--${name}=(\\d+)`))?.[1];
const projectsOf = (cmd) => [...cmd.matchAll(/--project=([\w-]+)/g)].map((m) => m[1]).sort();

const playwrightSteps = workflow
  .split(/\n\s*- name: /)
  .filter((step) => /npx playwright test/.test(step));
// One step is not part of the suite: it runs a few named specs against a second,
// database-configured bundle (see the last test). It names its spec files; the
// two suite steps never do.
const namesSpecFiles = (step) => /tests\/e2e\/[\w-]+\.spec\.js/.test(step);
const ciSteps = playwrightSteps
  .filter((step) => !namesSpecFiles(step))
  .map((step) => ({
    projects: projectsOf(step),
    workers: Number(flag(step, 'workers') ?? ciConfig.workers),
    retries: Number(flag(step, 'retries') ?? ciConfig.retries),
    forbidOnly: /--forbid-only\b/.test(step) || ciConfig.forbidOnly,
  }));

// Local scripts run without CI set, so every setting has to be a flag.
const localStep = (name) => {
  const cmd = scripts[name];
  assert.equal(typeof cmd, 'string', `package.json must define ${name}`);
  assert.doesNotMatch(cmd, /(^|\s)CI=/, `${name} must not set CI with an env prefix (cmd.exe)`);
  assert.match(cmd, /^playwright test /);
  return {
    projects: projectsOf(cmd),
    workers: Number(flag(cmd, 'workers')),
    retries: Number(flag(cmd, 'retries')),
    forbidOnly: /--forbid-only\b/.test(cmd),
  };
};

test('the Smoke e2e workflow still runs Playwright in two steps', () => {
  assert.equal(ciSteps.length, 2, 'update test:e2e:ci when the workflow changes shape');
});

test('test:e2e:ci runs each CI step with the same projects, workers, retries and forbid-only', () => {
  assert.equal(scripts['test:e2e:ci'], 'npm run test:e2e:chromium && npm run test:e2e:gl');
  assert.deepEqual(
    [localStep('test:e2e:chromium'), localStep('test:e2e:gl')],
    ciSteps,
  );
});

test('between them the two steps cover every Playwright project', () => {
  const covered = [...localStep('test:e2e:chromium').projects, ...localStep('test:e2e:gl').projects].sort();
  assert.deepEqual(covered, ciConfig.projects.map((p) => p.name).sort());
});

// Specs that model a signed-in account skip themselves when the bundle has no
// database configuration, and the suite steps above build none, so they ran
// nowhere in CI while the check stayed green. The workflow builds a second,
// configured bundle and runs exactly those specs against it on chromium. This
// keeps that list equal to the specs that skip, so a fifth one cannot go unrun.
test('the connected-bundle step runs every spec that skips without a database, and only on chromium', () => {
  const skipping = readdirSync(new URL('../e2e/', import.meta.url))
    .filter((name) => name.endsWith('.spec.js'))
    .filter((name) => /no Supabase configuration/.test(read(`tests/e2e/${name}`)))
    .map((name) => `tests/e2e/${name}`)
    .sort();
  assert.ok(skipping.length >= 4, `expected at least the four known specs, found ${skipping.join(', ')}`);
  const connected = playwrightSteps.filter(namesSpecFiles);
  assert.equal(connected.length, 1, 'one step runs the specs that need a configured bundle');
  const [step] = connected;
  const named = [...step.matchAll(/tests\/e2e\/[\w-]+\.spec\.js/g)].map((m) => m[0]).sort();
  assert.deepEqual(named, skipping, 'every spec that skips without database settings must be named in the connected step');
  assert.deepEqual(projectsOf(step), ['chromium-desktop', 'chromium-mobile']);
  // The settings live on the build of that second bundle, never on the suite build.
  assert.match(workflow, /VITE_SUPABASE_URL: https:\/\/mpovsdzdggvksmeehqfj\.supabase\.co/);
  assert.match(step, /PLAYWRIGHT_BASE_URL: http:\/\/127\.0\.0\.1:\d+/);
  const suiteBuild = workflow.split(/\n\s*- name: /).find((s) => /^Build production bundle/.test(s));
  assert.doesNotMatch(suiteBuild, /SUPABASE/, 'the suite bundle stays unconfigured: other specs assume no backend');
});
