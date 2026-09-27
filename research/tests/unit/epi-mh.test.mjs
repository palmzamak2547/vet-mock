// Mantel-Haenszel [M1-DESIGN.md 7.16]. Fixtures and their sources:
// - r-4.6.0: tests/fixtures/r/out/mh.json (mantelhaen.test and the formulas in tests/fixtures/r/mh.R,
//   R 4.6.0 through webR 0.6.0), when present;
// - scipy-1.17.1: tests/fixtures/crosscheck/scipy-crosscheck.json mantelHaenszel.threeStrata (formula
//   written in Python by scipy_crosscheck.py);
// - serosurvey-numbers: numbers.json assoc.mh (check.py recomputes it), 49 farm strata in epi-fixtures.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mantelHaenszel, runMantelHaenszel, breslowDay, expectedAAtOr } from '../../src/lib/epi/mh.js';
import { SERO, SERO_STRATA, SERO_ROLES, serosurveyTable, spec, readFixture, close, CLOSED, ITER } from './epi-fixtures.mjs';

const THREE = [[[10, 20], [5, 25]], [[8, 12], [6, 24]], [[15, 5], [9, 11]]];

test('three strata: OR_MH, RGB interval, CMH, Breslow-Day and Tarone (scipy-1.17.1)', () => {
  const x = readFixture('crosscheck/scipy-crosscheck.json')['mantelHaenszel.threeStrata'];
  const r = mantelHaenszel(x.strata, { measure: 'OR', cmhContinuity: true, confLevel: 0.95 });
  close(r.estimate.value, x.ORmh, CLOSED, 'OR_MH');
  close(r.estimate.ci[0], x.ciRGB[0], CLOSED, 'RGB lower');
  close(r.estimate.ci[1], x.ciRGB[1], CLOSED, 'RGB upper');
  close(r.cmh.X2, x.CMHcorrected, CLOSED, 'CMH corrected');
  close(r.cmh.p, x.pCMH, CLOSED, 'CMH p');
  close(r.homogeneity.X2, x.breslowDay, ITER, 'Breslow-Day');
  close(r.homogeneity.p, x.pBreslowDay, ITER, 'Breslow-Day p');
  close(r.homogeneity.tarone.X2, x.tarone, ITER, 'Tarone');
  close(r.homogeneity.tarone.p, x.pTarone, ITER, 'Tarone p');
  assert.equal(r.homogeneity.df, 2);
});

test('R pin: every case in r/out/mh.json (r-4.6.0)', (t) => {
  const pin = readFixture('r/out/mh.json');
  if (!pin) return t.skip('r/out/mh.json not generated yet (rparity)');
  for (const [name, c] of Object.entries(pin.cases)) {
    const v = c.values;
    const or = mantelHaenszel(c.strata, { measure: 'OR', cmhContinuity: true, confLevel: c.confLevel });
    const rr = mantelHaenszel(c.strata, { measure: 'RR', cmhContinuity: true, confLevel: c.confLevel });
    const nc = mantelHaenszel(c.strata, { measure: 'OR', cmhContinuity: false, confLevel: c.confLevel });
    close(or.estimate.value, v.OR.value, CLOSED, `${name} OR`);
    close(or.estimate.ci[0], v.OR.ci[0], CLOSED, `${name} OR lower`);
    close(or.estimate.ci[1], v.OR.ci[1], CLOSED, `${name} OR upper`);
    close(rr.estimate.value, v.RR.value, CLOSED, `${name} RR`);
    close(rr.estimate.se, v.RR.seLog, CLOSED, `${name} RR se`);
    close(rr.estimate.ci[0], v.RR.ci[0], CLOSED, `${name} RR lower`);
    close(rr.estimate.ci[1], v.RR.ci[1], CLOSED, `${name} RR upper`);
    close(or.cmh.X2, v.cmh.X2, CLOSED, `${name} CMH`);
    close(or.cmh.p, v.cmh.p, CLOSED, `${name} CMH p`);
    close(nc.cmh.X2, v.cmhNoCorrection.X2, CLOSED, `${name} CMH no correction`);
    close(nc.cmh.p, v.cmhNoCorrection.p, CLOSED, `${name} CMH no correction p`);
    assert.equal(or.informative, v.informative, `${name} informative`);
    assert.equal(or.skipped, v.skipped, `${name} skipped`);
    close(or.homogeneity.X2, v.breslowDay.X2, ITER, `${name} Breslow-Day`);
    assert.equal(or.homogeneity.df, v.breslowDay.df, `${name} Breslow-Day df`);
    close(or.homogeneity.p, v.breslowDay.p, ITER, `${name} Breslow-Day p`);
    if (v.tarone) close(or.homogeneity.tarone.X2, v.tarone.X2, ITER, `${name} Tarone`);
    close(rr.homogeneity.X2, v.woolfRR.X2, CLOSED, `${name} Woolf RR`);
    assert.equal(rr.homogeneity.df, v.woolfRR.df, `${name} Woolf df`);
    close(rr.homogeneity.p, v.woolfRR.p, CLOSED, `${name} Woolf p`);
  }
});

test('serosurvey, farm as stratum (the G1 within-farm route): numbers.json assoc.mh', () => {
  const m = SERO.assoc.mh;
  const pr = mantelHaenszel(SERO_STRATA, { measure: 'RR', cmhContinuity: true, confLevel: 0.95 });
  const or = mantelHaenszel(SERO_STRATA, { measure: 'OR', cmhContinuity: true, confLevel: 0.95 });
  const nc = mantelHaenszel(SERO_STRATA, { measure: 'OR', cmhContinuity: false, confLevel: 0.95 });
  assert.equal(SERO_STRATA.length, m.strata);
  assert.equal(pr.informative, m.informative);
  close(pr.estimate.value, m.pr.est, CLOSED, 'MH PR');
  close(pr.estimate.se, m.pr.se, CLOSED, 'MH PR se');
  // numbers.json bounds were computed with z = 1.959964; check.py compares them at 1e-7.
  close(pr.estimate.ci[0], m.pr.ci[0], 1e-7, 'MH PR lower');
  close(pr.estimate.ci[1], m.pr.ci[1], 1e-7, 'MH PR upper');
  close(or.estimate.value, m.or.est, CLOSED, 'MH OR');
  close(or.estimate.ci[0], m.or.ci[0], 1e-7, 'MH OR lower');
  close(or.estimate.ci[1], m.or.ci[1], 1e-7, 'MH OR upper');
  close(or.cmh.X2, m.cmh, CLOSED, 'CMH');
  close(or.cmh.p, m.p, 1e-7, 'CMH p');
  close(nc.cmh.X2, m.cmhNoCorr, CLOSED, 'CMH no correction');
  close(nc.cmh.p, m.pNoCorr, 1e-7, 'CMH no correction p');
});

test('runMantelHaenszel on the rebuilt table names the measure by design and counts rows', () => {
  const out = runMantelHaenszel(spec('epi.mantelHaenszel', { kind: 'dataset', datasetId: 'd', recipeRev: 1 }, {
    ...SERO_ROLES, roles: { ...SERO_ROLES.roles, strata: 'farm' }, design: 'cross-sectional', options: { measure: 'RR', cmhContinuity: true, homogeneity: 'woolf' },
  }), serosurveyTable());
  assert.equal(out.status, 'ok');
  close(out.values.PR.value, SERO.assoc.mh.pr.est, CLOSED, 'PR named for cross-sectional');
  assert.equal(out.used, 716);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'age', count: 12 }]);
  assert.equal(out.values.strataInformative.value, 43);
  assert.equal(out.tests[0].id, 'cmh');
  assert.equal(out.tests[1].variant, 'woolf');
  assert.equal(out.tables[0].rows.length, 49);
});

test('strata with fewer than two animals are skipped and counted', () => {
  const r = mantelHaenszel([...THREE, [[1, 0], [0, 0]], [[0, 0], [0, 0]]], { measure: 'OR' });
  assert.equal(r.skipped, 2);
  assert.equal(r.strata.length, 3);
  const base = mantelHaenszel(THREE, { measure: 'OR' });
  close(r.estimate.value, base.estimate.value, CLOSED, 'same estimate');
});

test('no informative stratum gives null with a reason, never 0', () => {
  const r = mantelHaenszel([[[0, 5], [0, 5]], [[0, 3], [0, 4]]], { measure: 'OR' });
  assert.equal(r.estimate.value, null);
  assert.ok(r.estimate.reasonKey.startsWith('epi.undefined.'));
  assert.equal(r.cmh.X2, null);
});

test('expected cell at a given OR solves the Breslow-Day quadratic', () => {
  // With psi = 1 the expected a is n1 m1 / T.
  close(expectedAAtOr(30, 30, 15, 1), 7.5, CLOSED, 'psi 1');
  const ea = expectedAAtOr(20, 20, 24, 2.5);
  close((ea * (20 - 24 + ea)) / ((20 - ea) * (24 - ea)), 2.5, 1e-12, 'odds ratio of the expected table');
  assert.equal(breslowDay([[[1, 1], [1, 1]]], 1).X2, null);
});
