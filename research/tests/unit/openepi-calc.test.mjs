// Unit tests for OpenEpi quick calculations (pure functions).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTwoByTwo,
  computeDiagnostic,
  computeProportionMethods,
  computePersonTimeRates,
} from '../../src/workspace/screens/tools/openepi-calc.js';

test('computeTwoByTwo: cohort study calculates RR, OR, RD, and Chi-square', () => {
  const res = computeTwoByTwo({ a: 30, b: 70, c: 10, d: 90, design: 'cohort', confLevel: 0.95 });

  assert.equal(res.marginals.n1, 100);
  assert.equal(res.marginals.n0, 100);
  assert.equal(res.marginals.m1, 40);
  assert.equal(res.marginals.m0, 160);
  assert.equal(res.marginals.N, 200);

  // RR = 0.3 / 0.1 = 3.0
  assert.ok(Math.abs(res.measures.RR.value - 3.0) < 1e-4);
  // OR = (30 * 90) / (70 * 10) = 27 / 7 = 3.8571
  assert.ok(Math.abs(res.measures.OR.value - 3.8571) < 1e-3);
  // RD = 0.3 - 0.1 = 0.2
  assert.ok(Math.abs(res.measures.RD.value - 0.2) < 1e-4);

  // Chi-square uncorrected: N * (ad - bc)^2 / (n1 * n0 * m1 * m0) = 200 * (2000)^2 / (100 * 100 * 40 * 160) = 12.5
  assert.ok(Math.abs(res.tests.uncorrected.stat - 12.5) < 1e-4);
  assert.ok(res.tests.uncorrected.p < 0.001);
  assert.ok(res.tests.fisher.p < 0.001);
});

test('computeTwoByTwo: handles zero cell with Haldane adjustment option', () => {
  const res = computeTwoByTwo({ a: 0, b: 20, c: 10, d: 20, design: 'caseControl', confLevel: 0.95, zeroCell: 'haldane' });
  assert.ok(Number.isFinite(res.measures.OR.value));
  assert.ok(res.measures.OR.value > 0);
});

test('computeDiagnostic: evaluates Se, Sp, PPV, NPV, LR, Accuracy, and Post-Test', () => {
  const res = computeDiagnostic({ TP: 80, FP: 10, FN: 20, TN: 190, confLevel: 0.95, priorProb: 0.1 });

  assert.equal(res.counts.N, 300);
  assert.equal(res.counts.dpos, 100);
  assert.equal(res.counts.dneg, 200);

  // Se = 80 / 100 = 0.8
  assert.ok(Math.abs(res.metrics.Se.value - 0.8) < 1e-4);
  // Sp = 190 / 200 = 0.95
  assert.ok(Math.abs(res.metrics.Sp.value - 0.95) < 1e-4);
  // PPV = 80 / 90 = 0.8889
  assert.ok(Math.abs(res.metrics.PPV.value - 0.8889) < 1e-3);
  // NPV = 190 / 210 = 0.9048
  assert.ok(Math.abs(res.metrics.NPV.value - 0.9048) < 1e-3);
  // LR+ = 0.8 / 0.05 = 16.0
  assert.ok(Math.abs(res.metrics.LRpos.value - 16.0) < 1e-3);
  // Accuracy = 270 / 300 = 0.9
  assert.ok(Math.abs(res.metrics.accuracy.value - 0.9) < 1e-4);

  // Post-test probability at prior 0.10:
  // preOdds = 0.1 / 0.9 = 0.1111
  // postOddsPos = 0.1111 * 16 = 1.7777 -> postProbPos = 1.7777 / 2.7777 = 0.64 (64%)
  assert.ok(res.postTest.postProbPos > 0.63 && res.postTest.postProbPos < 0.65);
});

test('computeProportionMethods: compares Wilson, Exact, Agresti, and Wald', () => {
  const res = computeProportionMethods(25, 100, 0.95);
  assert.equal(res.p, 0.25);
  assert.ok(res.wilson.ci[0] > 0.17 && res.wilson.ci[1] < 0.35);
  assert.ok(res.exact.ci[0] > 0.16 && res.exact.ci[1] < 0.35);
  assert.ok(res.wald.ci[0] > 0.16 && res.wald.ci[1] < 0.34);
});

test('computePersonTimeRates: calculates incidence rates, IRR, and rate difference', () => {
  const res = computePersonTimeRates({ a: 15, pt1: 1000, c: 5, pt0: 1000, multiplier: 1000, confLevel: 0.95 });
  assert.ok(res !== null);
  assert.equal(res.scaledR1, 15);
  assert.equal(res.scaledR0, 5);
  assert.equal(res.irr, 3.0);
  assert.ok(Math.abs(res.rd - 10.0) < 1e-9);
  assert.ok(res.irrExactCi[0] > 1.0);
  assert.ok(res.test.p < 0.05);
});
