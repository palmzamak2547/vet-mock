// The numbers a chart draws that are not in an envelope [M2-DESIGN.md 8.1, 8.2], each pinned:
// - the OLS confidence band: R 4.6.0 predict(lm(y ~ x), newdata, interval = 'confidence') on corr (M1-DESIGN.md
//   section 7), at 0, 1.2, 3, 5.63, 8, 10.5 and 12, levels 0.95 and 0.9 (graphs role run, 28 Sep 2026,
//   webR 0.6.0; work/loop-2026-09-26/research-m2/graphs-r/charts.out);
// - the per-group mean interval: R t.test(two$g1)$conf.int, tests/fixtures/r/out/ttest.json case oneSample
//   (the interval of a one-sample t-test does not depend on mu);
// - quartiles and whiskers: R quantile(type = 7) and boxplot.stats on two small sets (same run); the kit's
//   whiskers use type 7 quartiles, R's boxplot uses hinges (fivenum), and both are pinned to show where they differ;
// - the p-value function: tests/fixtures/serosurvey/numbers.json assoc.mh.pFunction (14 points, MH PR
//   2.17392147567125, SE 0.2002407915579817; check.py, Python and SciPy);
// - the number at risk under a Kaplan-Meier plot: R summary(survfit(Surv(time, status) ~ x, aml), times =
//   0 to 60 by 10, extend = TRUE)$n.risk, survival 3.8.6 (same run).
// OWNER: graphs role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beeswarm, boxStats, meanCi, medianIqr, olsBand, pFunction, seFromLogCi } from '../../src/workspace/charts/helpers.js';
import { atRisk } from '../../src/workspace/charts/kinds-xy.js';

const rel = (a, b) => Math.abs(a - b) / Math.max(1e-300, Math.abs(b));
const corr = { x: [1.2, 2.3, 3.1, 4.8, 5.0, 6.7, 7.1, 8.4, 9.0, 10.5], y: [2.1, 2.9, 3.8, 5.2, 4.9, 7.3, 6.8, 8.9, 9.5, 10.1] };
const AT = [0, 1.2, 3, 5.63, 8, 10.5, 12];
const R_BAND = {
  fit: [0.84631295499767578, 1.9417388506952296, 3.5848776942415603, 5.9856861156453656, 8.1491522596480337, 10.431289542351273, 11.800571911973215],
  lwr: [0.22763788525114104, 1.4228854044864407, 3.2002715748237076, 5.7090800718170307, 7.8030735264091389, 9.9059656144352122, 11.149289630539311],
  upr: [1.4649880247442106, 2.4605922969040184, 3.9694838136594131, 6.2622921594737004, 8.4952309928869276, 10.956613470267333, 12.451854193407119],
  lwr90: [0.34741705353191255, 1.5233385135343971, 3.2747336040088162, 5.7626326448741061, 7.8700764247867978, 10.007671447174769, 11.27538174868158],
  upr90: [1.345208856463439, 2.360139187856062, 3.8950217844743045, 6.208739586416625, 8.4282280945092705, 10.854907637527777, 12.32576207526485],
  coef: [0.84631295499767578, 0.91285491308129485],
};

test('OLS line and confidence band equal R predict(lm, interval = "confidence") at 95% and 90% (r-4.6.0)', () => {
  const b = olsBand(corr.x, corr.y, AT, 0.95);
  assert.ok(rel(b.intercept, R_BAND.coef[0]) < 1e-12 && rel(b.slope, R_BAND.coef[1]) < 1e-12, 'coefficients');
  AT.forEach((a, i) => {
    assert.ok(rel(b.fit[i], R_BAND.fit[i]) < 1e-12, `fit at ${a}`);
    // the t quantile comes from stdlib (R's qt agrees to about 1e-13 on these df)
    assert.ok(rel(b.lo[i], R_BAND.lwr[i]) < 1e-10, `lower at ${a}: ${b.lo[i]} vs ${R_BAND.lwr[i]}`);
    assert.ok(rel(b.hi[i], R_BAND.upr[i]) < 1e-10, `upper at ${a}`);
  });
  const b90 = olsBand(corr.x, corr.y, AT, 0.9);
  AT.forEach((a, i) => assert.ok(rel(b90.lo[i], R_BAND.lwr90[i]) < 1e-10 && rel(b90.hi[i], R_BAND.upr90[i]) < 1e-10, `90% at ${a}`));
  assert.equal(olsBand([1, 1, 1], [1, 2, 3], [1]), null, 'constant x has no line');
  assert.equal(olsBand([1, 2], [1, 2], [1]), null, 'two points leave no residual df');
});

test('the mean and its 95% t interval per group equal R t.test (r-4.6.0 ttest.json oneSample)', () => {
  const fx = JSON.parse(readFileSync(new URL('../fixtures/r/out/ttest.json', import.meta.url), 'utf8'));
  const r = fx.cases.oneSample.values;
  const g1 = [5.1, 4.9, 6.2, 5.8, 6.0, 5.5, 5.3, 6.4];
  const s = meanCi(g1, 0.95);
  assert.ok(rel(s.center, 5.65) < 1e-12);
  assert.ok(rel(s.lo, r.ci[0]) < 1e-10 && rel(s.hi, r.ci[1]) < 1e-10, `${s.lo} ${s.hi} vs ${r.ci}`);
  const one = meanCi([3]);
  assert.equal(one.lo, null);
  assert.equal(one.reasonKey, 'graphs.undefined.oneValue');
  assert.equal(meanCi([2, 2, 2]).lo, null, 'constant values give no interval, never a zero-width one');
  assert.equal(meanCi([]).center, null);
});

test('quartiles are type 7 and whiskers stop at the last value within 1.5 IQR; values beyond are kept (r-4.6.0)', () => {
  // R: quantile(c(2, 4, 4, 5, 7, 9, 10, 12)) 25/50/75% = 4, 6, 9.25; boxplot.stats hinges 4, 9.5
  const a = boxStats([2, 4, 4, 5, 7, 9, 10, 12]);
  assert.deepEqual([a.q1, a.median, a.q3], [4, 6, 9.25]);
  assert.deepEqual([a.lowWhisker, a.highWhisker, a.outside.length], [2, 12, 0]);
  // R: quantile(c(1:7, 30)) = 2.75, 4.5, 6.25; boxplot.stats whiskers 1 and 7, out 30
  const b = boxStats([1, 2, 3, 4, 5, 6, 7, 30]);
  assert.deepEqual([b.q1, b.median, b.q3], [2.75, 4.5, 6.25]);
  assert.deepEqual([b.lowWhisker, b.highWhisker, b.outside], [1, 7, [30]]);
  // 11.7 lies 1.54 IQR above the type 7 box (fence 11.5): drawn beyond the whisker. R's hinges (2.5, 6.5)
  // put its fence at 12.5, so R's boxplot would reach it; the footnote says the kit uses the table's quartiles.
  const c = boxStats([1, 2, 3, 4, 5, 6, 7, 11.7]);
  assert.deepEqual([c.q1, c.q3, c.highWhisker, c.outside], [2.75, 6.25, 7, [11.7]]);
  const m = medianIqr([1, 2, 3, 4, 5, 6, 7, 30]);
  assert.deepEqual([m.center, m.lo, m.hi], [4.5, 2.75, 6.25]);
  assert.equal(boxStats([]), null);
});

test('p-value function equals numbers.json assoc.mh.pFunction and is 1 - conf at the CI bounds (serosurvey-numbers)', () => {
  const nums = JSON.parse(readFileSync(new URL('../fixtures/serosurvey/numbers.json', import.meta.url), 'utf8'));
  const est = 2.17392147567125;
  const se = 0.2002407915579817;
  for (const [theta, p] of nums.assoc.mh.pFunction) assert.ok(rel(pFunction(est, se, theta), p) < 1e-9, `theta ${theta}: ${pFunction(est, se, theta)} vs ${p}`);
  // numbers.json assoc.mh PR interval (Greenland-Robins, Wald on the log scale)
  const ci = [1.4682451741496192, 3.218763913269349];
  const se2 = seFromLogCi(ci, 0.95);
  assert.ok(rel(se2, se) < 1e-9, `SE from the interval ${se2}`);
  assert.ok(Math.abs(pFunction(est, se2, ci[0]) - 0.05) < 1e-12 && Math.abs(pFunction(est, se2, ci[1]) - 0.05) < 1e-12, 'p = 0.05 at the bounds');
  assert.equal(pFunction(est, se, est), 1);
  assert.equal(seFromLogCi([0, 2]), null);
  assert.equal(seFromLogCi([1, Infinity]), null);
});

test('number at risk under the Kaplan-Meier axis equals R summary(survfit, times) (r-4.6.0, survival 3.8.6)', () => {
  // survfit(Surv(time, status) ~ x, aml): every distinct time with n.risk
  const maintained = { time: [9, 13, 18, 23, 28, 31, 34, 45, 48, 161], nRisk: [11, 10, 8, 7, 6, 5, 4, 3, 2, 1] };
  const non = { time: [5, 8, 12, 16, 23, 27, 30, 33, 43, 45], nRisk: [12, 10, 8, 7, 6, 5, 4, 3, 2, 1] };
  const times = [0, 10, 20, 30, 40, 50, 60];
  assert.deepEqual(times.map((t) => atRisk(maintained, t)), [11, 10, 7, 5, 3, 1, 1]);
  assert.deepEqual(times.map((t) => atRisk(non, t)), [12, 8, 6, 4, 2, 0, 0]);
});

test('the beeswarm is deterministic and no two dots overlap while there is room', () => {
  const pos = [10, 10, 10, 11, 12, 30, 30.5, 10, 50];
  const d = 6;
  const a = beeswarm(pos, d, 100);
  assert.deepEqual(beeswarm(pos, d, 100), a, 'same input, same picture');
  for (let i = 0; i < pos.length; i += 1) {
    for (let j = i + 1; j < pos.length; j += 1) {
      const dist = Math.hypot(pos[i] - pos[j], a[i] - a[j]);
      assert.ok(dist >= d - 1e-3, `dots ${i} and ${j} overlap (${dist})`);
    }
  }
  assert.equal(a[8], 0, 'a lone dot stays on the centre line');
  const tight = beeswarm(Array(40).fill(5), 6, 20);
  assert.ok(Math.max(...tight.map(Math.abs)) <= 20 + 1e-9, 'a wide swarm is squeezed into its band');
});
