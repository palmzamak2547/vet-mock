// Rank tests [M1-DESIGN.md 7.9]. Pins: R 4.6.0 wilcox.test and kruskal.test (r/out/rank.json,
// rparity role), including R 4.6.0's exact conditional p-values with ties and zeros. Cross-check:
// SciPy 1.17.1. OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankSum, signedRank, kruskalWallis, pwilcoxLower, psignrankLower, runMannWhitney, runSignedRank, runKruskalWallis } from '../../src/lib/stats/rank.js';
import { readJson, close, TOL, makeTable, groupsTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/rank.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const D = SCIPY.datasets;
const diff = D.paired.before.map((v, i) => v - D.paired.after[i]);

const RUN = {
  'mannWhitney.exact': () => rankSum(D.two.g1, D.two.g2),
  'mannWhitney.normalTiesCC': () => rankSum(D.three.A, D.three.B, { exact: 'normal', continuityCorrection: true }),
  'mannWhitney.autoTies': () => rankSum(D.three.A, D.three.B),
  'mannWhitney.normalNoCC': () => rankSum(D.two.g1, D.two.g2, { exact: 'normal', continuityCorrection: false }),
  'mannWhitney.exact.less': () => rankSum(D.two.g1, D.two.g2, { alternative: 'less' }),
  'signedRank.exact': () => signedRank(diff),
  'signedRank.normal': () => signedRank(diff, { exact: 'normal', continuityCorrection: true }),
  'signedRank.zerosTies': () => signedRank([0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4]),
  'signedRank.zerosTies.normal': () => signedRank([0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4], { exact: 'normal' }),
};

test('rank tests: R 4.6.0 pins (r/out/rank.json), every case', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  for (const [name, c] of Object.entries(R.cases)) {
    const tol = TOL[c.tol] ?? TOL.closed;
    if (name.startsWith('kruskalWallis')) {
      const r = kruskalWallis([D.three.A, D.three.B, D.three.C]);
      close(r.H, c.values.H, tol, `R ${c.call} H`);
      assert.equal(r.df, c.values.df);
      close(r.p, c.values.p, tol, `R ${c.call} p`);
      continue;
    }
    const run = RUN[name];
    assert.ok(run, `no inputs for R case ${name}`);
    const r = run();
    close(r.W ?? r.V, c.values.statistic, tol, `R ${c.call} statistic`);
    close(r.p, c.values.p, tol, `R ${c.call} p`);
  }
});

test('rank tests: R 4.6.0 uses the exact conditional distribution with ties and zeros', () => {
  const ties = rankSum(D.three.A, D.three.B);
  assert.equal(ties.exact, true);
  assert.equal(ties.conditional, true);
  const z = signedRank([0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4]);
  assert.equal(z.exact, true);
  assert.equal(z.zeros, 1);
  // 50 or more per group: normal approximation
  const big = Array.from({ length: 50 }, (_, i) => i);
  assert.equal(rankSum(big, big.map((v) => v + 0.5)).exact, false);
});

test('rank tests: exact distributions are proper (sum to 1, symmetric)', () => {
  close(pwilcoxLower(24, 4, 6), 1, 1e-15, 'P(W <= m n) = 1');
  close(pwilcoxLower(5, 4, 6) + pwilcoxLower(24 - 6, 4, 6), 1, 1e-14, 'W symmetric about mn/2');
  close(psignrankLower(55, 10), 1, 1e-15, 'P(V <= n(n+1)/2) = 1');
  close(psignrankLower(3, 10), 5 / 1024, 1e-14, 'P(V <= 3) for n = 10 (subsets {}, {1}, {2}, {3}, {1,2})');
});

test('rank tests: SciPy cross-check', () => {
  close(rankSum(D.two.g1, D.two.g2).p, SCIPY['mannWhitney.exact'].p, 1e-9, 'scipy MW exact');
  close(rankSum(D.three.A, D.three.B, { exact: 'normal' }).p, SCIPY['mannWhitney.normalTiesCC'].p, 1e-9, 'scipy MW normal');
  close(signedRank(diff).p, SCIPY['wilcoxonSignedRank.exact'].p, 1e-12, 'scipy signed rank exact');
  close(kruskalWallis([D.three.A, D.three.B, D.three.C]).H, SCIPY.kruskalWallis.H, 1e-12, 'scipy KW H');
});

test('rank tests: run functions on a WorkingTable', () => {
  const t = groupsTable({ g1: D.two.g1, g2: D.two.g2 });
  const mw = runMannWhitney(spec('test.mannWhitney', { roles: { outcome: 'y', group: 'g' }, options: { exact: 'auto', continuityCorrection: true } }), t);
  assert.equal(mw.status, 'ok');
  assert.equal(mw.tests[0].statistic.value, 1);
  assert.equal(mw.tests[0].variant, 'exact');
  close(mw.tests[0].p, R.cases['mannWhitney.exact'].values.p, TOL.closed, 'runMannWhitney p');
  const pt = makeTable({ a: { kind: 'number', values: D.paired.before }, b: { kind: 'number', values: D.paired.after } });
  const sr = runSignedRank(spec('test.wilcoxonSignedRank', { roles: { x: 'a', y: 'b' }, options: { exact: 'auto', continuityCorrection: true } }), pt);
  assert.equal(sr.tests[0].statistic.value, 52);
  const kw = runKruskalWallis(spec('test.kruskalWallis', { roles: { outcome: 'y', group: 'g' } }), groupsTable({ A: D.three.A, B: D.three.B, C: D.three.C }));
  close(kw.tests[0].statistic.value, R.cases['kruskalWallis.three'].values.H, TOL.closed, 'runKruskalWallis H');
  const allTied = kruskalWallis([[1, 1], [1, 1]]);
  assert.equal(allTied.H, null);
  assert.equal(allTied.p, null);
});
