// The e2e duration budget (scripts/e2e-durations.mjs): a test over 40% of its timeout is listed,
// its slowest attempt counts (a retry hides nothing), and skipped tests are not measured.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { slowTests } from '../../scripts/e2e-durations.mjs';

const t = (title, timeout, ...durations) => ({
  title, file: 'a.spec.js',
  tests: [{ projectName: 'webkit-mobile', timeout, results: durations.map((d) => (d === null ? { status: 'skipped', duration: 0 } : { status: 'passed', duration: d })) }],
});

test('lists tests over the share, slowest share first, using the slowest attempt', () => {
  const report = { suites: [{ file: 'a.spec.js', specs: [t('quick', 30_000, 5_000)], suites: [{ specs: [t('journey', 30_000, 21_000), t('retried', 60_000, 10_000, 35_000), t('skipped', 30_000, null)] }] }] };
  const slow = slowTests(report, 0.4);
  assert.deepEqual(slow.map((s) => s.title), ['journey', 'retried']);
  assert.equal(slow[0].share, 0.7);
  assert.equal(slow[1].retried, true);
});

test('every e2e runner in CI writes the JSON report and checks the budget', () => {
  const wf = readFileSync(new URL('../../.github/workflows/smoke-e2e.yml', import.meta.url), 'utf8');
  assert.match(wf, /node scripts\/e2e-durations\.mjs/);
  assert.match(wf, /e2e-durations-\$\{\{ matrix\.report \}\}/);
  assert.match(readFileSync(new URL('../../playwright.config.js', import.meta.url), 'utf8'), /\['json', \{ outputFile:/);
});
