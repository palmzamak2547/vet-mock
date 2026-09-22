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
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const { scripts } = JSON.parse(read('package.json'));
const workflow = read('.github/workflows/smoke-e2e.yml');

// The config's CI branch is what a flag-less CI step inherits.
process.env.CI = '1';
const { default: ciConfig } = await import('../../playwright.config.js');

const flag = (cmd, name) => cmd.match(new RegExp(`--${name}=(\\d+)`))?.[1];
const projectsOf = (cmd) => [...cmd.matchAll(/--project=([\w-]+)/g)].map((m) => m[1]).sort();

const ciSteps = workflow
  .split(/\n\s*- name: /)
  .filter((step) => /npx playwright test/.test(step))
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
