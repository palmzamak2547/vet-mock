// p.adjust [M1-DESIGN.md 7.8]. Pins: R 4.6.0 p.adjust (r/out/padjust.json, rparity role: the course
// example, ties, values that cap at 1, and an NA kept out of m). Cross-check: SciPy padjust.
// OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pAdjust, runPAdjust } from '../../src/lib/stats/padjust.js';
import { readJson, close, TOL, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/padjust.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const INPUTS = {
  course: [0.010, 0.040, 0.030, 0.005],
  ties: [0.020, 0.020, 0.500, 0.001, 0.200],
  big: [0.30, 0.60, 0.90, 0.45],
  withNA: [0.01, null, 0.04, 0.03],
};

test('p.adjust: R 4.6.0 pins (r/out/padjust.json)', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  for (const [name, c] of Object.entries(R.cases)) {
    const p = INPUTS[name];
    assert.ok(p, `no input for ${name}`);
    for (const method of ['holm', 'bonferroni']) {
      const got = pAdjust(p, method);
      c.values[method].forEach((want, i) => close(got[i], want, TOL.closed, `R ${c.call} ${method}[${i}]`));
    }
  }
});

test('p.adjust: SciPy cross-check and none', () => {
  const c = SCIPY.padjust;
  assert.deepEqual(pAdjust(c.p, 'holm').map((v) => +v.toFixed(12)), c.holm);
  assert.deepEqual(pAdjust(c.p, 'bonferroni').map((v) => +v.toFixed(12)), c.bonferroni);
  assert.deepEqual(pAdjust([0.2, null], 'none'), [0.2, null]);
});

test('p.adjust: runPAdjust from entered p-values', () => {
  const out = runPAdjust(spec('adjust.pValues', { input: { kind: 'params', params: { p: INPUTS.course, labels: ['a', 'b', 'c', 'd'] } }, options: { method: 'holm' } }), null);
  assert.equal(out.status, 'ok');
  assert.equal(out.values.m.value, 4);
  assert.deepEqual(out.tables[0].rows.map((r) => r[2]), R.cases.course.values.holm);
  const bad = runPAdjust(spec('adjust.pValues', { input: { kind: 'params', params: { p: [0.2, 1.4] } } }), null);
  assert.equal(bad.status, 'invalid');
});
