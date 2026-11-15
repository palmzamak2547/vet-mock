// tests/e2e/unsteady.json: the only e2e tests allowed to pass on their retry (scripts/e2e-unsteady.mjs
// fails any other one in CI). The list may only shrink: BUDGET is its length today, and an entry fixed
// at its cause comes off the list and lowers BUDGET in the same pull request. Never raise it.
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allowedBy, flakyTests, readUnsteady } from '../../scripts/e2e-unsteady.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BUDGET = 24; // 16 Nov 2026, seeded from 35 runs; only ever lowered
const PROJECTS = ['chromium-desktop', 'chromium-mobile', 'webkit-mobile', 'firefox-desktop'];

test('the unsteady list can only shrink', () => {
  const list = readUnsteady(repo);
  assert.ok(list.length <= BUDGET, `tests/e2e/unsteady.json holds ${list.length} entries, over its budget of ${BUDGET}: fix the new unsteady test at its cause instead of listing it`);
});

test('every entry names a real test, a reason, a date and the engines it is unsteady on', () => {
  for (const e of readUnsteady(repo)) {
    const where = `${e.spec} "${e.title}"`;
    assert.ok(fs.existsSync(path.join(repo, e.spec)), `${where}: no such spec file`);
    const source = fs.readFileSync(path.join(repo, e.spec), 'utf8');
    assert.ok(source.includes(e.title.replace(/^.*› /, '')) || /\$\{/.test(source), `${where}: no test with that title in the file`);
    assert.ok(typeof e.reason === 'string' && e.reason.length >= 40, `${where}: say what was found, not just that it is unsteady`);
    assert.match(e.since, /^\d{4}-\d{2}-\d{2}$/, `${where}: the date it was listed`);
    assert.ok(Array.isArray(e.projects) && e.projects.length && e.projects.every((p) => PROJECTS.includes(p)), `${where}: the engines it is unsteady on`);
  }
});

test('the check reads a Playwright report: a flaky test fails unless its title is listed for that engine', () => {
  const report = { suites: [{ file: 'a.spec.js', specs: [
    { file: 'a.spec.js', line: 9, title: 'steady', tests: [{ projectName: 'webkit-mobile', status: 'expected' }] },
    { file: 'a.spec.js', line: 20, title: 'wobbly', tests: [{ projectName: 'webkit-mobile', status: 'flaky' }, { projectName: 'chromium-desktop', status: 'flaky' }] },
  ] }] };
  const flaky = flakyTests(report);
  assert.deepEqual(flaky.map((t) => `${t.file}:${t.line} ${t.project}`), ['a.spec.js:20 webkit-mobile', 'a.spec.js:20 chromium-desktop']);
  const list = [{ spec: 'tests/e2e/a.spec.js', title: 'wobbly', projects: ['webkit-mobile'] }];
  assert.ok(allowedBy(flaky[0], list), 'listed for WebKit');
  assert.equal(allowedBy(flaky[1], list), undefined, 'not listed for Chromium');
  // A line that moved does not take a listed test's retry away.
  assert.ok(allowedBy({ ...flaky[0], line: 31 }, list));
});

test('every e2e runner runs the check after its tests', () => {
  const wf = fs.readFileSync(path.join(repo, '.github/workflows/smoke-e2e.yml'), 'utf8');
  assert.match(wf, /run: node scripts\/e2e-unsteady\.mjs e2e-results\.json connected-e2e\.json/);
});
