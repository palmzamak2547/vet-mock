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

test('Games-Howell: one pair with Welch df below 2 stays null on its own; the other five pairs stand', () => {
  // Seed 777001 of the round 1 review harness (review-numbers-r4.md). Pair B-A: Welch df 1.938, where the
  // studentized range is undefined and R's ptukey returns NaN (it refuses df < 2), so p and the interval are null.
  // The other pairs are pinned to SciPy 1.17.1 studentized_range (sf and ppf) on the same data, computed
  // 28 Sep 2026: d, SE and df closed form (1e-10), p and bounds from an independent integration (1e-5).
  const data = { A: [5.494, 7.741, 3.467, 6.36], B: [9.279, 6.567], C: [11.497, 4.355, 5.504, 6.153, 2.796, 0.558], D: [19.973, 17.581, 25.211, 9.007, 11.151] };
  const out = runGamesHowell(spec('posthoc.gamesHowell', { roles: { outcome: 'y', group: 'g' } }), groupsTable(data));
  assert.equal(out.status, 'ok');
  assert.equal(out.values.reason, undefined);
  const rows = Object.fromEntries(out.tables[0].rows.map((r) => [r[0], r]));
  const ba = rows['B-A'];
  close(ba[3], 1.938486680048653, 1e-10, 'B-A df');
  assert.equal(ba[5], null); assert.equal(ba[6], null); assert.equal(ba[7], null);
  const scipy = {
    'C-A': [-0.6216666666666661, 1.7579099648288148, 7.567234149526726, 0.9836864103241103, -6.325956999881321, 5.082623666547989],
    'D-A': [10.819100000000002, 3.0810248581708435, 4.717868104020456, 0.06435044962533909, -0.8168334895251785, 22.455033489525185],
    'C-B': [-2.779166666666667, 2.031726612459899, 3.847279968983337, 0.5767776776876511, -11.215830538579564, 5.65749720524623],
    'D-B': [8.661600000000002, 3.245054662097389, 4.979939408220901, 0.14542170177344216, -3.331058586034697, 20.6542585860347],
    'D-C': [11.440766666666669, 3.3137321538980453, 6.04881153369684, 0.050021617972011656, -0.0012336276804170154, 22.882766961013754],
  };
  for (const [pair, [d, se, df, p, lo, hi]] of Object.entries(scipy)) {
    const r = rows[pair];
    close(r[1], d, 1e-10, `${pair} diff`); close(r[2], se, 1e-10, `${pair} se`); close(r[3], df, 1e-10, `${pair} df`);
    close(r[5], p, 1e-5, `${pair} p`);
    close(r[6], lo, 1e-5, `${pair} lower`); close(r[7], hi, 1e-5, `${pair} upper`);
  }
  const note = out.notes.find((n) => n.id === 'pairLowDf');
  assert.equal(note.key, 'lab.note.ghPairLowDf');
  assert.equal(note.params.pairs, 'B-A');
  assert.ok(!out.notes.some((n) => n.key === 'stats.undefined.zeroVariance'));
});

test('Games-Howell: zero spread is named only when a pair truly has SE 0; all pairs undefined makes the result invalid', () => {
  const g = spec('posthoc.gamesHowell', { roles: { outcome: 'y', group: 'g' } });
  const flat = runGamesHowell(g, groupsTable({ A: [2, 2, 2], B: [5, 5, 5] }));
  assert.equal(flat.status, 'invalid');
  assert.equal(flat.values.reason.reasonKey, 'stats.undefined.zeroVariance');
  const mixed = runGamesHowell(g, groupsTable({ A: [2, 2, 2], B: [5, 5, 5], C: [1, 4, 6, 9] }));
  assert.equal(mixed.status, 'ok');
  assert.equal(mixed.notes.find((n) => n.id === 'pairNoSpread').params.pairs, 'B-A');
  const tiny = runGamesHowell(g, groupsTable({ A: [1, 9], B: [4, 4.5] }));
  assert.equal(tiny.status, 'invalid');
  assert.equal(tiny.values.reason.reasonKey, 'lab.undefined.ghLowDf');
});

test('Games-Howell: a low-df pair with a zero difference keeps p = 1 and still gets the low-df note; a mix of causes names both', () => {
  const g = spec('posthoc.gamesHowell', { roles: { outcome: 'y', group: 'g' } });
  // Review round 5: C-B has df 1 and a difference of exactly 0, so p = 1 (R: ptukey(0, 3, 1, lower.tail = FALSE) = 1)
  // with a null interval; the note used to name only C-A because it was built from p === null.
  const zero = runGamesHowell(g, groupsTable({ A: [2, 2, 2], B: [5, 5, 5], C: [1, 9] }));
  assert.equal(zero.status, 'ok');
  const cb = zero.tables[0].rows.find((r) => r[0] === 'C-B');
  assert.equal(cb[5], 1); assert.equal(cb[6], null); assert.equal(cb[7], null);
  assert.deepEqual(zero.notes.find((n) => n.id === 'pairLowDf').params.pairs.split(', ').sort(), ['C-A', 'C-B']);
  assert.equal(zero.notes.find((n) => n.id === 'pairNoSpread').params.pairs, 'B-A');
  // Every pair undefined, for two different causes: the reason names both, not "every pair has a low df".
  const mixed = runGamesHowell(g, groupsTable({ A: [2, 2, 2], B: [5, 5, 5], C: [1, 8] }));
  assert.equal(mixed.status, 'invalid');
  assert.equal(mixed.values.reason.reasonKey, 'lab.undefined.ghMixed');
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

test('Dunnett at a huge residual df uses the df = Infinity form instead of throwing (review round 1)', async () => {
  const { dunnettQuantile } = await import('../../src/lib/stats/mvt.js');
  const inf = dunnettQuantile(0.95, [0.9, 0.9, 0.9], Infinity);
  const big = dunnettQuantile(0.95, [0.9, 0.9, 0.9], 1e9);
  assert.equal(big, inf);
  assert.ok(Math.abs(dunnettQuantile(0.95, [0.9, 0.9, 0.9], 3e6) - inf) < 1e-5);
});
