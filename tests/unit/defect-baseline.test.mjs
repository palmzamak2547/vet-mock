// The defect sweep's baseline (tests/e2e/defect-baseline.json) may only fall. The sweep itself runs on
// demand (`npm run sweep:defects`, about an hour), so this test holds the file: its shape, its numbers
// never above main's, the comparison the sweep makes, and the allow list's reasons.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DETECTORS, baselineProblems, compareBaseline, countFindings, lowerBaseline } from '../../scripts/lib/defect-baseline.mjs';
import { DETECTORS as SWEEP_DETECTORS } from '../../tests/e2e/lib/defects.js';
import { ALLOW } from '../../tests/e2e/lib/defect-allow.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REL = 'tests/e2e/defect-baseline.json';
const file = JSON.parse(readFileSync(path.join(ROOT, REL), 'utf8'));

test('the baseline names every detector, each with a whole count', () => {
  assert.deepEqual(baselineProblems(file), []);
  assert.deepEqual(DETECTORS, SWEEP_DETECTORS, 'the sweep and its baseline name the same twelve detectors');
  assert.equal(DETECTORS.length, 12);
});

test('the baseline never rises above main', (t) => {
  let main;
  try {
    main = JSON.parse(execFileSync('git', ['show', `origin/main:${REL}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    t.skip('no baseline on origin/main yet (or no origin/main here)');
    return;
  }
  const { rose } = compareBaseline(file.counts, file.counts, main.counts);
  assert.deepEqual(rose, [], 'a baseline number went up: fix the fault instead, or allow-list a design that is right, with its reason');
});

test('the comparison: over fails, under is reported, a rise above main is named, --write only lowers', () => {
  const base = Object.fromEntries(DETECTORS.map((d) => [d, 2]));
  assert.deepEqual(compareBaseline({ ...base }, base), { over: [], under: [], rose: [] });
  assert.equal(compareBaseline({ ...base, overlap: 3 }, base).over.length, 1);
  assert.equal(compareBaseline({ ...base, overlap: 1 }, base).under.length, 1);
  assert.deepEqual(compareBaseline(base, { ...base, focus: 3 }, base).rose, ["focus: 3 > main's 2"]);
  assert.equal(lowerBaseline({ ...base, overlap: 9, target: 0 }, base).overlap, 2, 'never raised');
  assert.equal(lowerBaseline({ ...base, overlap: 9, target: 0 }, base).target, 0, 'lowered');
});

test('what is counted: allowed rows, sweep notes and the dev pass layout rows are not', () => {
  const rows = [
    { detector: 'overlap' },
    { detector: 'overlap', allowed: 'a badge on an avatar' },
    { detector: 'console', unreached: true },
    { detector: 'contrast', build: 'dev' },
    { detector: 'console', build: 'dev' },
  ];
  const counts = countFindings(rows);
  assert.equal(counts.overlap, 1);
  assert.equal(counts.contrast, 0);
  assert.equal(counts.console, 1);
});

test('every allow-list row names a detector and says why', () => {
  for (const row of ALLOW) {
    assert.ok(DETECTORS.includes(row.detector), `unknown detector ${row.detector}`);
    assert.ok(typeof row.reason === 'string' && row.reason.length >= 20, `a row for ${row.detector} needs a reason a reader can check`);
    assert.ok(row.a || row.b || row.text || row.route, 'a row that matches everything would hide a whole detector');
  }
});
