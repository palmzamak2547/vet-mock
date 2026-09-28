// Post hoc comparisons and the adjustments [M2-DESIGN.md 3.1.4]: Dunn after Kruskal-Wallis (Holm,
// Bonferroni, Sidak, Benjamini-Hochberg, none), Games-Howell, Dunnett against a control (multivariate t by
// numerical integration with an error bound), Sidak and BH in p.adjust and the pairwise t tests. Pins:
// R 4.6.0 and mvtnorm 1.2.4 (lab-fixtures.mjs); an independent mpmath value for five comparisons.
// OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dunn, gamesHowell, dunnett, runDunn, runGamesHowell, runDunnett } from '../../src/lib/stats/posthoc.js';
import { dunnettUpper, dunnettProbability, dunnettQuantile, integrate } from '../../src/lib/stats/mvt.js';
import { pAdjust, runPAdjust } from '../../src/lib/stats/padjust.js';
import { pairwiseT, runAnova1 } from '../../src/lib/stats/anova.js';
import { ptTwoSided } from '../../src/lib/stats/dist.js';
import { close, TOL, groupsTable, spec } from './stats-fixtures.mjs';
import { closeAbs, THREE, CHICKWTS, POSTHOC as P, PADJUST } from './lab-fixtures.mjs';

const three = [THREE.A, THREE.B, THREE.C];
const labels = ['A', 'B', 'C'];
const tol = TOL.closed;

test('p.adjust gains Sidak and Benjamini-Hochberg (R p.adjust BH; Sidak 1967 closed form)', () => {
  pAdjust(PADJUST.p, 'sidak').forEach((v, i) => close(v, PADJUST.sidak[i], tol, `sidak ${i}`));
  pAdjust(PADJUST.p, 'bh').forEach((v, i) => close(v, PADJUST.bh[i], tol, `bh ${i}`));
  // a missing p stays missing and does not count toward m
  assert.deepEqual(pAdjust([0.01, null, 0.02], 'bh'), [0.02, null, 0.02]);
  // a tiny p keeps its digits (1 - (1 - p)^m would lose them)
  close(pAdjust([1e-18, 0.5], 'sidak')[0], 2e-18, 1e-12, 'sidak small p');
  const out = runPAdjust(spec('adjust.pValues', { input: { kind: 'params', params: { p: PADJUST.p } }, options: { method: 'bh' } }), null);
  assert.equal(out.status, 'ok');
  out.tables[0].rows.forEach((r, i) => close(r[2], PADJUST.bh[i], tol, `runPAdjust bh ${i}`));
});

test('pairwise t after one-way ANOVA with BH and Sidak (R pairwise.t.test)', () => {
  const none = pairwiseT(three, labels, 'none');
  none.forEach((r, i) => close(r.pAdjusted, P.pairwiseT.none[i], tol, `raw ${r.pair}`));
  pairwiseT(three, labels, 'bh').forEach((r, i) => close(r.pAdjusted, P.pairwiseT.bh[i], tol, `BH ${r.pair}`));
  pairwiseT(three, labels, 'sidak').forEach((r, i) => close(r.pAdjusted, P.pairwiseT.sidak[i], tol, `Sidak ${r.pair}`));
  const out = runAnova1(spec('test.anova1', { roles: { outcome: 'y', group: 'g' }, options: { posthoc: 'pairwise-t-bh' } }), groupsTable(THREE));
  out.tables.find((t) => t.id === 'posthoc').rows.forEach((r, i) => close(r[4], P.pairwiseT.bh[i], tol, `runAnova1 BH ${r[0]}`));
});

test('Dunn: z with the tie correction, raw p and every adjustment (R formula)', () => {
  const holm = dunn(three, labels, 'holm');
  assert.deepEqual(holm.map((r) => r.pair), ['B-A', 'C-A', 'C-B']);
  holm.forEach((r, i) => { close(r.z, P.dunn.z[i], tol, `z ${r.pair}`); close(r.p, P.dunn.p[i], tol, `p ${r.pair}`); close(r.pAdjusted, P.dunn.holm[i], tol, `holm ${r.pair}`); });
  dunn(three, labels, 'bonferroni').forEach((r, i) => close(r.pAdjusted, P.dunn.bonferroni[i], tol, `bonferroni ${r.pair}`));
  dunn(three, labels, 'bh').forEach((r, i) => close(r.pAdjusted, P.dunn.bh[i], tol, `bh ${r.pair}`));
  dunn(three, labels, 'sidak').forEach((r, i) => close(r.pAdjusted, P.dunnSidak[i], tol, `sidak ${r.pair}`));
  dunn(three, labels, 'none').forEach((r, i) => close(r.pAdjusted, P.dunn.p[i], tol, `none ${r.pair}`));
});

test('runDunn: Kruskal-Wallis beside the pairs, G7 when no adjustment is chosen', () => {
  const out = runDunn(spec('posthoc.dunn', { roles: { outcome: 'y', group: 'g' }, options: { adjust: 'holm' } }), groupsTable(THREE));
  assert.equal(out.status, 'ok');
  assert.equal(out.tests[0].id, 'kruskalWallis');
  const pairs = out.tables.find((t) => t.id === 'pairs');
  assert.deepEqual(pairs.columns, ['pair', 'meanRankDiff', 'z', 'p', 'pAdjusted']);
  pairs.rows.forEach((r, i) => close(r[4], P.dunn.holm[i], tol, `holm ${r[0]}`));
  assert.deepEqual(out.warnings, []);
  const none = runDunn(spec('posthoc.dunn', { roles: { outcome: 'y', group: 'g' }, options: { adjust: 'none' } }), groupsTable(THREE));
  assert.equal(none.warnings[0].id, 'G7');
});

test('Games-Howell: Welch SE and df, studentized range p and interval (R ptukey / qtukey)', () => {
  const r = gamesHowell(three, labels, 0.95);
  const g = P.gamesHowell;
  r.forEach((x, i) => {
    close(x.diff, g.diff[i], tol, `diff ${x.pair}`);
    close(x.se, g.se[i], tol, `se ${x.pair}`);
    close(x.df, g.df[i], tol, `df ${x.pair}`);
    close(x.q, g.q[i], tol, `q ${x.pair}`);
    // ptukey and qtukey at a fractional df are iterative (stdlib, M1-DESIGN.md A8): 1e-6
    close(x.p, g.p[i], TOL.iterative, `p ${x.pair}`);
    const half = (g.upr[i] - g.lwr[i]) / 2;
    close(x.upper - x.lower, 2 * half, TOL.iterative, `interval width ${x.pair}`);
  });
  const out = runGamesHowell(spec('posthoc.gamesHowell', { roles: { outcome: 'y', group: 'g' } }), groupsTable(THREE));
  assert.equal(out.status, 'ok');
  assert.deepEqual(out.tables[0].columns, ['pair', 'diff', 'se', 'df', 'q', 'pAdjusted', 'lower', 'upper']);
  // a group of one animal has no variance: the method says so instead of printing a number
  assert.equal(runGamesHowell(spec('posthoc.gamesHowell', { roles: { outcome: 'y', group: 'g' } }), groupsTable({ A: [1], B: [2, 3], C: [4, 5] })).values.reason.reasonKey, 'lab.undefined.groupTooSmall');
});

test('the integrator: Gauss-Kronrod 21 on a known integral', () => {
  const r = integrate((x) => Math.exp(-x * x), [-9, 0, 9], 1e-15);
  close(r.value, Math.sqrt(Math.PI), 1e-14, 'integral of exp(-x^2)');
  assert.ok(r.error < 1e-13);
});

test('Dunnett, one comparison: the integral equals the two-sided t tail', () => {
  for (const [t, df] of [[3, 65], [6.95, 65], [2.1, 4]]) close(dunnettUpper(t, [0.674], df).value, ptTwoSided(t, df), 1e-10, `t ${t} df ${df}`);
});

test('Dunnett on three, control A: R mvtnorm TVPACK (two comparisons)', () => {
  const d = dunnett(three, labels, 0, 0.95);
  const g = P.dunnett;
  assert.equal(d.df, g.df);
  d.lambda.forEach((l, i) => close(l, g.lambda[i], tol, `lambda ${i}`));
  close(d.crit, g.crit, 1e-8, 'critical value');
  assert.ok(d.error < 1e-10, `stated error bound ${d.error}`);
  d.rows.forEach((x, i) => {
    close(x.diff, g.diff[i], tol, `diff ${x.pair}`);
    close(x.se, g.se[i], tol, `se ${x.pair}`);
    close(x.t, g.t[i], tol, `t ${x.pair}`);
    closeAbs(x.p, g.p[i], 1e-8, `adjusted p ${x.pair}`);
    close(x.lower, g.lwr[i], 1e-8, `lower ${x.pair}`);
    close(x.upper, g.upr[i], 1e-8, `upper ${x.pair}`);
  });
  close(dunnettProbability(g.crit, g.lambda, g.df), 0.95, 1e-12, 'P at R\'s critical value');
});

test('Dunnett on chickwts, three comparisons: R mvtnorm TVPACK in three dimensions', () => {
  const g = P.dunnett3;
  const L = ['casein', 'horsebean', 'linseed', 'meatmeal'];
  const d = dunnett(L.map((k) => CHICKWTS[k]), L, 0, 0.95);
  assert.equal(d.df, g.df);
  close(d.crit, g.crit, 1e-8, 'critical value');
  d.rows.forEach((x, i) => {
    close(x.t, g.t[i], tol, `t ${x.pair}`);
    closeAbs(x.p, g.p[i], 1e-8, `adjusted p ${x.pair}`);
    close(x.lower, g.lwr[i], 1e-8, `lower ${x.pair}`);
    close(x.upper, g.upr[i], 1e-8, `upper ${x.pair}`);
  });
  // the smallest p keeps relative digits (the complement is integrated directly)
  close(d.rows[0].p, g.p[0], 1e-7, 'p of 1.1e-7 to 7 digits');
});

test('Dunnett on chickwts, five comparisons: within GenzBretz error, and the extreme p inside its bounds', () => {
  const g = P.dunnett5;
  const L = Object.keys(CHICKWTS);
  const d = dunnett(L.map((k) => CHICKWTS[k]), L, 0, 0.95);
  assert.equal(d.df, g.df);
  d.lambda.forEach((l, i) => close(l, g.lambda[i], tol, `lambda ${i}`));
  d.rows.forEach((x, i) => {
    close(x.t, g.t[i], tol, `t ${x.pair}`);
    if (i === 0) return;
    // GenzBretz is randomised and its error estimate is optimistic here (see lab-fixtures.mjs): a loose check
    closeAbs(x.p, g.pGenz[i], Math.max(1e-6, 3 * g.errGenz[i]), `adjusted p ${x.pair} vs GenzBretz`);
  });
  // |t| = 6.96: P(max |T_j| > t) lies between one comparison's tail and the Bonferroni sum of all five
  const t0 = Math.abs(g.t[0]);
  const single = g.lambda.map(() => ptTwoSided(t0, g.df));
  const p0 = d.rows[0].p;
  assert.ok(p0 >= single[0] && p0 <= single.reduce((a, b) => a + b, 0), `p ${p0} within [${single[0]}, ${5 * single[0]}]`);
  // mpmath (lab-r/dunnett_mp20.py, 20 digits): the same integral by an independent implementation
  g.pMpmath.forEach((want, i) => close(d.rows[i].p, want, 1e-9, `mpmath ${d.rows[i].pair}`));
  // GenzBretz's critical value is itself noisy: its root sits at P - 0.95 = -3.1e-7 by its own estimate
  closeAbs(d.crit, g.critGenz, 1e-4, 'critical value vs qmvt');
  close(dunnettProbability(d.crit, d.lambda, d.df), 0.95, 1e-12, 'P at our critical value');
});

test('runDunnett: control level from the spec, two-sided only, the error bound printed', () => {
  const t = groupsTable(THREE);
  const out = runDunnett(spec('posthoc.dunnett', { roles: { outcome: 'y', group: 'g' }, levels: { controlLevel: 'A' } }), t);
  assert.equal(out.status, 'ok');
  assert.deepEqual(out.tables[0].rows.map((r) => r[0]), ['B-A', 'C-A']);
  closeAbs(out.tables[0].rows[0][4], P.dunnett.p[0], 1e-8, 'adjusted p');
  close(out.values.critical.value, P.dunnett.crit, 1e-8, 'critical');
  assert.ok(out.values.integrationError.value < 1e-10);
  assert.ok(out.notes.some((n) => n.key === 'lab.note.dunnettIntegration'));
  const c = runDunnett(spec('posthoc.dunnett', { roles: { outcome: 'y', group: 'g' }, levels: { controlLevel: 'C' } }), t);
  assert.deepEqual(c.tables[0].rows.map((r) => r[0]), ['A-C', 'B-C']);
  assert.equal(runDunnett(spec('posthoc.dunnett', { roles: { outcome: 'y', group: 'g' }, levels: { controlLevel: 'Z' } }), t).values.reason.reasonKey, 'lab.invalid.controlNotFound');
  assert.equal(runDunnett(spec('posthoc.dunnett', { roles: { outcome: 'y', group: 'g' }, options: { alternative: 'greater' } }), t).values.reason.reasonKey, 'lab.invalid.dunnettTwoSided');
  const first = runDunnett(spec('posthoc.dunnett', { roles: { outcome: 'y', group: 'g' } }), t);
  assert.ok(first.notes.some((n) => n.key === 'lab.note.controlFirst'));
  assert.equal(typeof dunnettQuantile, 'function');
});
