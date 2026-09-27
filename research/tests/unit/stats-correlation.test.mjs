// Pearson and Spearman [M1-DESIGN.md 7.10]. Pins: R 4.6.0 cor.test (r/out/correlation.json, rparity
// role). The Spearman p-value is R's AS 89 (prho.c); it is pinned to R only (SciPy's default is the
// t approximation). Cross-check: SciPy 1.17.1 (r, CI, rho). OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pearson, spearman, prho, runPearson, runSpearman } from '../../src/lib/stats/correlation.js';
import { readJson, close, TOL, makeTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/correlation.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const D = SCIPY.datasets;

test('correlation: R 4.6.0 pins (r/out/correlation.json)', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  const c1 = R.cases['pearson.corr'];
  const p1 = pearson(D.corr.x, D.corr.y);
  for (const k of ['r', 't', 'df', 'p']) close(p1[k], c1.values[k], TOL.closed, `R ${c1.call} ${k}`);
  close(p1.ci[0], c1.values.ci[0], TOL.closed, `R ${c1.call} ci lower`);
  close(p1.ci[1], c1.values.ci[1], TOL.closed, `R ${c1.call} ci upper`);
  const c2 = R.cases['pearson.weak.90'];
  const p2 = pearson(D.two.g1, c2.y, { confLevel: c2.confLevel });
  for (const k of ['r', 't', 'df', 'p']) close(p2[k], c2.values[k], TOL.closed, `R ${c2.call} ${k}`);
  close(p2.ci[0], c2.values.ci[0], TOL.closed, `R ${c2.call} ci lower`);
  close(p2.ci[1], c2.values.ci[1], TOL.closed, `R ${c2.call} ci upper`);
  const c3 = R.cases['spearman.corr'];
  const s3 = spearman(D.corr.x, D.corr.y);
  close(s3.rho, c3.values.rho, TOL.closed, `R ${c3.call} rho`);
  close(s3.S, c3.values.S, 1e-9, `R ${c3.call} S`);
  assert.equal(s3.p, c3.values.p, `R ${c3.call} p (AS 89 Edgeworth clamps to 0 here, as R does)`);
  const c4 = R.cases['spearman.ties'];
  const s4 = spearman(D.corr.x, c4.y);
  close(s4.rho, c4.values.rho, TOL.closed, `R ${c4.call} rho`);
  close(s4.S, c4.values.S, TOL.closed, `R ${c4.call} S`);
  close(s4.p, c4.values.p, TOL.closed, `R ${c4.call} p`);
  assert.equal(s4.exact, false);
});

test('correlation: AS 89 exact branch (n <= 9) counts every permutation', () => {
  // n = 4: S = sum (i - p_i)^2 over the 24 permutations; P(S >= 18) = P(S = 18 or 20)
  const perms = [];
  const rec = (a, rest) => (rest.length ? rest.forEach((v, i) => rec([...a, v], rest.filter((_, j) => j !== i))) : perms.push(a));
  rec([], [1, 2, 3, 4]);
  const S = perms.map((p) => p.reduce((s, v, i) => s + (i + 1 - v) ** 2, 0));
  const upper = S.filter((v) => v >= 18).length / 24;
  close(prho(4, 18, false), upper, 1e-15, 'prho(4, 18) upper equals the enumeration');
  close(prho(4, 18, true), 1 - upper, 1e-15, 'prho(4, 18) lower');
});

test('correlation: SciPy cross-check', () => {
  const p = pearson(D.corr.x, D.corr.y);
  close(p.r, SCIPY['corr.pearson'].r, 1e-12, 'scipy r');
  close(p.ci[1], SCIPY['corr.pearson'].ciFisherZ[1], 1e-12, 'scipy ci');
  close(spearman(D.corr.x, D.corr.y).rho, SCIPY['corr.spearman'].rho, 1e-12, 'scipy rho');
});

test('correlation: run functions and undefined cases', () => {
  const t = makeTable({ x: { kind: 'number', values: [...D.corr.x, null] }, y: { kind: 'number', values: [...D.corr.y, 3] } });
  const out = runPearson(spec('corr.pearson', { roles: { x: 'x', y: 'y' }, options: { ciMethod: 'fisher-z' } }), t);
  assert.equal(out.status, 'ok');
  close(out.values.estimate.value, R.cases['pearson.corr'].values.r, TOL.closed, 'runPearson r');
  assert.equal(out.values.estimate.ciMethod, 'fisher-z');
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'x', count: 1 }]);
  const sp = runSpearman(spec('corr.spearman', { roles: { x: 'x', y: 'y' }, options: { exact: 'auto' } }), t);
  assert.equal(sp.tests[0].variant, 'exact-as89');
  const flat = pearson([1, 2, 3], [4, 4, 4]);
  assert.equal(flat.r, null);
  assert.equal(flat.reasonKey, 'stats.undefined.zeroVariance');
  assert.equal(pearson([1, 2], [3, 4]).p, null);
});
