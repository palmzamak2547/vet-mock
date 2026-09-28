// One-way ANOVA, Tukey HSD and pairwise t [M1-DESIGN.md 7.7]. Pins: R 4.6.0 (r/out/anova.json:
// summary(aov()), TukeyHSD at 95% and 90%, pairwise.t.test with holm / bonferroni / none, rparity
// role) and NIST StRD ANOVA (stats/nist-strd/: SiRstv, SmLs01-03 lower, AtmWtAg, SmLs04-06 average;
// every certified value with LRE >= 9). Cross-check: SciPy 1.17.1. OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anova1, tukeyHsd, pairwiseT, runAnova1 } from '../../src/lib/stats/anova.js';
import { ptukeyUpper, qtukey } from '../../src/lib/stats/dist.js';
import { readJson, readText, close, lre, TOL, groupsTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/anova.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const NIST = readJson('stats/nist-strd/fixture.json');
const T = SCIPY.datasets.three;
const three = [T.A, T.B, T.C];
const labels = ['A', 'B', 'C'];

test('ANOVA: R 4.6.0 pins (r/out/anova.json)', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  const c = R.cases['anova1.three'];
  const a = anova1(three);
  for (const k of ['F', 'df1', 'df2', 'p', 'ssBetween', 'ssWithin', 'msWithin']) close(a[k], c.values[k], TOL.closed, `R ${c.call} ${k}`);
  c.values.means.forEach((m, i) => close(a.means[i], m, TOL.closed, `R ${c.call} mean ${i}`));
  assert.deepEqual(a.ns, c.values.ns);
  const four = R.cases['anova1.four'];
  const a4 = anova1(Object.values(four.groups));
  for (const k of ['F', 'df1', 'df2', 'p']) close(a4[k], four.values[k], TOL.closed, `R ${four.call} ${k}`);
});

test('Tukey HSD: R 4.6.0 pins at 95% and 90% (ptukey and qtukey are iterative: 1e-6)', () => {
  for (const [name, conf] of [['tukey.three', 0.95], ['tukey.three.90', 0.9]]) {
    const c = R.cases[name];
    const got = tukeyHsd(three, labels, conf);
    assert.deepEqual(got.map((g) => g.pair), c.values.pairs.map((p) => p.pair), 'R pair order');
    c.values.pairs.forEach((want, i) => {
      close(got[i].diff, want.diff, TOL.closed, `R ${c.call} ${want.pair} diff`);
      close(got[i].p, want.p, TOL.iterative, `R ${c.call} ${want.pair} p`);
      // a bound is diff +/- qtukey * s; qtukey is R's secant iteration, so the 1e-6 applies to the
      // half-width, not to a bound that happens to sit near zero (C-B upper at 90% is 0.027)
      const half = (want.ci[1] - want.ci[0]) / 2;
      for (const j of [0, 1]) {
        const err = Math.abs(got[i].ci[j] - want.ci[j]);
        assert.ok(err <= TOL.iterative * Math.max(Math.abs(want.ci[j]), half), `R ${c.call} ${want.pair} ci[${j}]: got ${got[i].ci[j]}, want ${want.ci[j]}`);
      }
      close(got[i].ci[1] - got[i].ci[0], 2 * half, TOL.iterative, `R ${c.call} ${want.pair} interval width`);
    });
  }
});

test('pairwise t (pooled SD): R 4.6.0 pins for holm, bonferroni and none', () => {
  for (const [name, method] of [['pairwiseT.holm', 'holm'], ['pairwiseT.bonferroni', 'bonferroni'], ['pairwiseT.none', 'none']]) {
    const c = R.cases[name];
    const got = pairwiseT(three, labels, method);
    for (const g of got) close(g.pAdjusted, c.values[g.pair], TOL.closed, `R ${c.call} ${g.pair}`);
  }
});

test('ANOVA: SciPy cross-check', () => {
  const a = anova1(three);
  close(a.F, SCIPY.anova1.F, 1e-9, 'scipy F');
  close(a.p, SCIPY.anova1.p, 1e-9, 'scipy p');
  const tk = tukeyHsd(three, labels, 0.95);
  close(tk[0].p, SCIPY['anova1.tukey'].pairs['B-A'].p, 1e-6, 'scipy tukey B-A p');
});

function parseAnova(name) {
  const lines = readText(`stats/nist-strd/${name}.dat`).split(/\r?\n/);
  const nums = (re, k) => lines.find((l) => re.test(l)).trim().split(/\s+/).slice(-k).map(Number);
  const [dfB, ssB, msB, F] = nums(/^Between/, 4);
  const [dfW, ssW, msW] = nums(/^Within/, 3);
  const r2 = Number(lines.find((l) => /R-Squared/.test(l)).trim().split(/\s+/).pop());
  const sd = Number(lines[lines.findIndex((l) => /Certified Residual/.test(l)) + 1].trim().split(/\s+/).pop());
  const di = lines.findLastIndex((l) => /^Data:/.test(l));
  const g = new Map();
  for (const l of lines.slice(di + 1)) {
    const t = l.trim().split(/\s+/);
    if (t.length === 2 && t[0] !== '') { if (!g.has(t[0])) g.set(t[0], []); g.get(t[0]).push(Number(t[1])); }
  }
  return { groups: [...g.values()], dfB, ssB, msB, F, dfW, ssW, msW, r2, sd };
}

test('ANOVA: NIST StRD certified values, LRE >= 9 (lower and average difficulty)', () => {
  assert.equal(NIST._fixture.family, 'nist-strd');
  for (const [level, names] of Object.entries(NIST.anova)) {
    const min = NIST.minLRE[level];
    for (const name of names) {
      const d = parseAnova(name);
      const a = anova1(d.groups);
      assert.equal(a.df1, d.dfB, `${name} between df`);
      assert.equal(a.df2, d.dfW, `${name} within df`);
      const checks = { ssBetween: [a.ssBetween, d.ssB], msBetween: [a.msBetween, d.msB], F: [a.F, d.F], ssWithin: [a.ssWithin, d.ssW], msWithin: [a.msWithin, d.msW], r2: [a.rSquared, d.r2], residualSd: [Math.sqrt(a.msWithin), d.sd] };
      for (const [k, [got, cert]] of Object.entries(checks)) {
        const l = lre(got, cert);
        assert.ok(l >= min, `NIST ${name} (${level}) ${k}: LRE ${l.toFixed(2)} < ${min} (got ${got}, certified ${cert})`);
      }
    }
  }
});

test('ANOVA: runAnova1 on a WorkingTable with the post hoc table', () => {
  const t = groupsTable({ A: T.A, B: T.B, C: T.C });
  const out = runAnova1(spec('test.anova1', { roles: { outcome: 'y', group: 'g' }, options: { posthoc: 'tukey' } }), t);
  assert.equal(out.status, 'ok');
  close(out.tests[0].statistic.value, R.cases['anova1.three'].values.F, TOL.closed, 'runAnova1 F');
  assert.deepEqual(out.tests[0].dfPair, [2, 15]);
  const post = out.tables.find((x) => x.id === 'posthoc');
  assert.deepEqual(post.rows.map((r) => r[0]), ['B-A', 'C-A', 'C-B']);
  const holm = runAnova1(spec('test.anova1', { roles: { outcome: 'y', group: 'g' }, options: { posthoc: 'pairwise-t-holm' } }), t);
  close(holm.tables.find((x) => x.id === 'posthoc').rows[1][4], R.cases['pairwiseT.holm'].values['C-A'], TOL.closed, 'runAnova1 holm C-A');
  const one = runAnova1(spec('test.anova1', { roles: { outcome: 'y', group: 'g' } }), groupsTable({ A: [1, 2, 3] }));
  assert.equal(one.status, 'invalid');
  assert.equal(one.tests[0].p, null);
});

test('studentized range at a large df: the documented tolerance against R 4.6.0 (df 3000 and 2500)', () => {
  // Source: R 4.6.0 (webR), review round 5 (work/loop-2026-09-26/research-m2/findings-r5.json, numbers lens):
  //   1 - ptukey(3.5, 3, 3000) = 0.035687   qtukey(0.95, 3, 2500) = 3.31647
  // The @stdlib studentized range switches to its df = Infinity form somewhere between df 2,001 and 2,500
  // (R switches at 25,000). The written tolerance: relative 0.5% for an upper tail near 0.05 and 0.1% for
  // the 95% quantile. Deeper tails drift further (q 4.5: 1.0%, q 5.5: 2.1%, so p near 1e-3 and below is
  // off by a few per cent), which never moves a p across 0.05 by more than its last printed digit.
  const p = ptukeyUpper(3.5, 3, 3000);
  const want = 0.035687;
  assert.ok(Math.abs(p - want) / want <= 0.005, `1 - ptukey(3.5, 3, 3000): got ${p}, R ${want}`);
  const q = qtukey(0.95, 3, 2500);
  assert.ok(Math.abs(q - 3.31647) / 3.31647 <= 0.001, `qtukey(0.95, 3, 2500): got ${q}, R 3.31647`);
  // The pin is not loose enough to hide a wrong value: the df 30 tail is 0.049, far outside it.
  assert.ok(Math.abs(ptukeyUpper(3.5, 3, 30) - want) / want > 0.005);
});
