// The quick calculators (/app/tools/openepi) against OpenEpi's own code and textbook formulas.
//
// "OpenEpi" values below were produced on 2026-10-20 by calling OpenEpi's own module functions
// (doStatistics in TwobyTwo.htm, calcPersonTime in PersonTime2.htm, CalcBin in DiagnosticTest.htm)
// on www.openepi.com in a browser, with fmtSigFig replaced by toPrecision(15) so the values carry
// 15 significant digits instead of 4. Dean AG, Sullivan KM, Soe MM. OpenEpi, version 3.01.
// "R" values: R 4.6.0 in webR 0.6.0 (research/scripts/r-parity/setup-webr.mjs), fisher.test,
// poisson.test and binom.test, printed with options(digits = 15).
//
// Where OpenEpi and this tool use the same formula but OpenEpi takes z = 1.96 (its source says
// "zL=1.96") and the engine takes qnorm(0.975) = 1.959964..., the interval agrees to about 1e-4
// relative, and the test says so. Values that come from closed forms (chi-square statistics, point
// estimates) agree to 1e-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTwoByTwo,
  computeDiagnostic,
  computeProportionMethods,
  computePersonTimeRates,
} from '../../src/workspace/screens/tools/openepi-calc.js';

const close = (got, want, rel, label) => {
  assert.ok(Number.isFinite(got), `${label}: got ${got}`);
  assert.ok(Math.abs(got - want) <= rel * Math.abs(want), `${label}: got ${got}, want ${want} (rel ${rel})`);
};

test('2x2 30/70 vs 10/90 matches OpenEpi TwobyTwo: chi-squares exact, Taylor intervals at z=1.96', () => {
  const r = computeTwoByTwo({ a: 30, b: 70, c: 10, d: 90 });
  close(r.tests.uncorrected.stat, 12.5, 1e-12, 'uncorrected');
  close(r.tests.yates.stat, 11.28125, 1e-12, 'Yates');
  close(r.tests.mantelHaenszel.stat, 12.4375, 1e-12, 'MH');
  close(r.tests.uncorrected.p, 0.000406952044320508, 1e-7, 'uncorrected p');
  // Fisher two-tailed: OpenEpi 0.000650410707603421 (twice the one-tailed value; with equal row
  // totals R's definition gives the same number).
  close(r.tests.fisher.p, 0.000650410707603421, 1e-9, 'Fisher p');
  close(r.measures.RR.value, 3, 1e-12, 'RR');
  close(r.measures.RR.ci[0], 1.55089083194958, 1e-4, 'RR lo');
  close(r.measures.RR.ci[1], 5.80311638613941, 1e-4, 'RR hi');
  close(r.measures.RD.ci[0], 0.0926547625648906, 1e-4, 'RD lo');
  close(r.measures.RD.ci[1], 0.307345237435109, 1e-4, 'RD hi');
  close(r.measures.OR.ci[0], 1.76668517623631, 1e-4, 'OR lo (Woolf = OpenEpi Taylor)');
  close(r.measures.OR.ci[1], 8.42116706503579, 1e-4, 'OR hi');
  close(r.measures.AFe.value, 0.666666666666667, 1e-12, 'AFe');
  close(r.measures.AFe.ci[0], 0.355209290428955, 1e-4, 'AFe lo');
  close(r.measures.AFp.value, 0.5, 1e-12, 'AFp');
  close(r.measures.AFeEst.value, 0.740740740740741, 1e-12, 'EFe|OR');
  close(r.measures.AFpEst.value, 0.555555555555556, 1e-12, 'EFp|OR');
});

test('2x2 5/2 vs 1/8: Fisher two-sided is R fisher.test (sum of tables as or less likely), not OpenEpi 2 x one-tail', () => {
  const r = computeTwoByTwo({ a: 5, b: 2, c: 1, d: 8 });
  close(r.tests.uncorrected.stat, 6.11216931216931, 1e-12, 'uncorrected');
  close(r.tests.yates.stat, 3.80952380952381, 1e-12, 'Yates');
  close(r.tests.mantelHaenszel.stat, 5.73015873015873, 1e-12, 'MH');
  // Hypergeometric with rows 7 and 9, first column 6, N = 16, C(16,6) = 8008 tables: a = 5 has 189,
  // a = 6 has 7, a = 0 has 84, every other a has more. OpenEpi: one-tail (a >= 5) 196/8008 = 0.02448,
  // two-tail printed as 0.04895, twice that. R fisher.test sums the tables no more likely than the
  // observed one: (189 + 7 + 84) / 8008 = 0.034965.
  close(r.tests.fisher.p, 280 / 8008, 1e-9, 'Fisher two-sided (R)');
});

test('2x2 with a zero cell: no ratio without Haldane, finite ratio with it', () => {
  const plain = computeTwoByTwo({ a: 0, b: 20, c: 10, d: 20 });
  assert.equal(plain.measures.RR.value, 0);
  assert.equal(plain.measures.RR.ci[0], null);
  close(plain.tests.uncorrected.stat, 8.33333333333333, 1e-12, 'uncorrected');
  // R 4.6.0 fisher.test(matrix(c(0,10,20,20),2))$p.value; OpenEpi prints 0.005850 (2 x one-tail).
  close(plain.tests.fisher.p, 0.0034333738257791, 1e-9, 'Fisher p (R)');
  const h = computeTwoByTwo({ a: 0, b: 20, c: 10, d: 20, zeroCell: 'haldane' });
  close(h.measures.OR.value, (0.5 * 20.5) / (20.5 * 10.5), 1e-12, 'Haldane OR');
});

test('2x2 empty rows and huge counts stay finite or null, never NaN', () => {
  const empty = computeTwoByTwo({ a: 0, b: 0, c: 0, d: 0 });
  assert.equal(empty.tests.uncorrected.stat, null);
  assert.equal(empty.measures.RR.value, null);
  const big = computeTwoByTwo({ a: 120000, b: 880000, c: 90000, d: 910000 });
  close(big.measures.RR.value, 120000 / 90000, 1e-12, 'RR');
  assert.ok(Number.isFinite(big.tests.uncorrected.stat));
  assert.ok(big.tests.fisher.p >= 0 && big.tests.fisher.p < 1e-10, `Fisher p ${big.tests.fisher.p}`);
});

test('diagnostic 42/4/8/146 matches OpenEpi DiagnosticTest (Wilson at z=1.96, DOR log interval)', () => {
  const r = computeDiagnostic({ TP: 42, FP: 4, FN: 8, TN: 146, priorProb: 0.08 });
  close(r.metrics.Se.ci[0], 0.714855190382340, 1e-4, 'Se lo');
  close(r.metrics.Sp.ci[1], 0.989582227708895, 1e-4, 'Sp hi');
  close(r.metrics.PPV.ci[0], 0.796750643647758, 1e-4, 'PPV lo');
  close(r.metrics.NPV.ci[1], 0.973445386002185, 1e-4, 'NPV hi');
  close(r.metrics.accuracy.ci[0], 0.898067364693149, 1e-4, 'accuracy lo');
  close(r.metrics.LRpos.value, 31.5, 1e-12, 'LR+');
  close(r.metrics.LRneg.value, 0.164383561643836, 1e-12, 'LR-');
  close(r.dor.value, 191.625, 1e-12, 'DOR');
  close(r.dor.ci[0], 54.9921158813592, 1e-4, 'DOR lo');
  close(r.dor.ci[1], 667.734638620208, 1e-4, 'DOR hi');
  // LR intervals differ from OpenEpi on purpose: the engine uses Simel, Samsa & Matchar 1991
  // (J Clin Epidemiol 44:763), SE(ln LR+) = sqrt((1-Se)/TP + Sp/FP) = 0.49713; OpenEpi prints
  // 19.13-51.88, narrower than that formula gives. Bayes: odds 0.08/0.92 x LR.
  close(r.metrics.LRpos.ci[0], 31.5 * Math.exp(-1.959963984540054 * Math.sqrt(0.16 / 42 + (146 / 150) / 4)), 1e-9, 'LR+ lo (Simel)');
  close(r.postTest.postProbPos, (0.08 / 0.92 * 31.5) / (1 + 0.08 / 0.92 * 31.5), 1e-12, 'post-test +');
  close(r.postTest.postProbNeg, (0.08 / 0.92 * (8 / 50) / (146 / 150)) / (1 + 0.08 / 0.92 * (8 / 50) / (146 / 150)), 1e-12, 'post-test -');
});

test('diagnostic: a zero true positive or true negative gives DOR 0 or infinite with no interval', () => {
  const r = computeDiagnostic({ TP: 0, FP: 3, FN: 5, TN: 40 });
  assert.equal(r.dor.value, 0);
  assert.deepEqual(r.dor.ci, [null, null]);
});

test('single proportion 18/120 matches OpenEpi Proportion', () => {
  const r = computeProportionMethods(18, 120, 0.95);
  close(r.wilson.ci[0], 0.0970406664179070, 1e-4, 'Wilson lo');
  close(r.wilson.ci[1], 0.224670237079319, 1e-4, 'Wilson hi');
  close(r.agresti.ci[0], 0.0961521847668055, 1e-4, 'Agresti-Coull lo');
  close(r.wald.ci[1], 0.213883194190648, 1e-4, 'Wald hi');
  // OpenEpi finds Clopper-Pearson by bisection (0.0913925, 0.2266687); the engine uses the beta quantile.
  close(r.exact.ci[0], 0.0913925170898438, 1e-4, 'Clopper-Pearson lo');
  close(r.exact.ci[1], 0.226668739318848, 1e-4, 'Clopper-Pearson hi');
  // R binom.test(18, 120)$conf.int, to every printed digit.
  close(r.exact.ci[0], 0.091389572528230, 1e-12, 'Clopper-Pearson lo (R)');
  close(r.exact.ci[1], 0.226667143412628, 1e-12, 'Clopper-Pearson hi (R)');
});

test('single proportion: x above n is refused, not shown as a proportion above 1', () => {
  assert.equal(computeProportionMethods(12, 10, 0.95), null);
});

test('person-time 25/178556 vs 4/200200 (Martin and Austin 1996 benzene data, crude) matches OpenEpi PersonTime2', () => {
  const r = computePersonTimeRates({ a: 25, pt1: 178556, c: 4, pt0: 200200, multiplier: 1 });
  close(r.irr, 7.00760545711149, 1e-12, 'IRR');
  close(r.irrExactCi[0], 2.41975936210830, 1e-9, 'IRR exact lo (OpenEpi "Fisher Exact")');
  close(r.irrExactCi[1], 27.7056692655693, 1e-9, 'IRR exact hi');
  // R poisson.test(c(25, 4), c(178556, 200200))$conf.int: 2.41975936210829, 27.70566926556926.
  close(r.test.z, 4.21422367989465, 1e-12, 'z');
  close(r.test.p, 0.0000250638796150247, 1e-6, 'p two-tailed');
  close(r.afe, 0.857297902097902, 1e-12, 'EFe');
  close(r.afp, 0.739049915601640, 1e-12, 'EFp');
  // Rate difference: Wald SE sqrt(a/pt1^2 + c/pt0^2) (Rothman, Modern Epidemiology 3rd ed., ch. 14);
  // OpenEpi uses Byar, 6.1764e-5 to 1.7830e-4.
  close(r.rdCi[0], 0.0000617637548097988, 1e-3, 'RD lo near Byar');
});

test('person-time: a protective exposure has no etiologic fraction (OpenEpi shows a preventive fraction)', () => {
  // OpenEpi PersonTime2 exercise data: 9 recurrences in 359 patient-weeks treated, 21 in 182 placebo.
  const r = computePersonTimeRates({ a: 9, pt1: 359, c: 21, pt0: 182, multiplier: 1 });
  close(r.irr, 0.217270194986072, 1e-12, 'IRR');
  close(r.irrExactCi[0], 0.0876071673032654, 1e-9, 'IRR exact lo');
  close(r.irrExactCi[1], 0.494859838320258, 1e-9, 'IRR exact hi');
  assert.equal(r.afe, null);
  assert.equal(r.afp, null);
});

test('person-time below one unit is used as entered', () => {
  const r = computePersonTimeRates({ a: 2, pt1: 0.5, c: 1, pt0: 0.5, multiplier: 1 });
  close(r.r1, 4, 1e-12, 'rate 1');
});
