// 2x2 measures [M1-DESIGN.md 7.15]. Fixtures and their sources:
// - r-4.6.0: tests/fixtures/r/out/twobytwo.json (formulas in base R with the papers cited,
//   PropCIs::riskscoreci for the Koopman score interval, fisher.test for the exact OR; R 4.6.0 in
//   webR 0.6.0), when present;
// - scipy-1.17.1: tests/fixtures/crosscheck/scipy-crosscheck.json twoByTwo.serosurvey, twoByTwo.small;
// - serosurvey-numbers: numbers.json assoc (crude PR and POR, the DEFF-widened PR), via epi-fixtures.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoByTwo, runTwoByTwo, koopmanStatistic, koopmanCi, newcombeCi } from '../../src/lib/epi/twobytwo.js';
import { qnorm } from '../../src/lib/stats/dist.js';
import { SERO, SERO_ROLES, serosurveyTable, spec, readFixture, close, closeUniroot, CLOSED, ITER } from './epi-fixtures.mjs';

const x = readFixture('crosscheck/scipy-crosscheck.json');
const ALL = ['RR', 'OR', 'RD', 'AFe', 'AFp', 'AFeEst', 'AFpEst'];

test('serosurvey 2x2: PR, POR, PD with Wald and Newcombe intervals (serosurvey-numbers, scipy-1.17.1)', () => {
  const s = x['twoByTwo.serosurvey'];
  const w = twoByTwo(s.table, { measures: ['PR', 'POR', 'PD'], confLevel: 0.95 });
  close(w.PR.value, SERO.assoc.crudePR.est, CLOSED, 'PR');
  close(w.PR.se, SERO.assoc.crudePR.se, CLOSED, 'SE of log PR');
  close(w.PR.ci[0], s['RR.waldLog'][0], CLOSED, 'PR lower');
  close(w.PR.ci[1], s['RR.waldLog'][1], CLOSED, 'PR upper');
  close(w.POR.value, SERO.assoc.crudePOR.est, CLOSED, 'POR');
  close(w.POR.ci[0], s['OR.woolf'][0], CLOSED, 'POR lower');
  close(w.POR.ci[1], s['OR.woolf'][1], CLOSED, 'POR upper');
  close(w.PD.value, s.RD, CLOSED, 'PD');
  close(w.PD.ci[0], s['RD.wald'][0], CLOSED, 'PD Wald lower');
  close(w.PD.ci[1], s['RD.wald'][1], CLOSED, 'PD Wald upper');
  close(w.p1.value, SERO.assoc.risk1, CLOSED, 'prevalence exposed');
  close(w.p0.value, SERO.assoc.risk0, CLOSED, 'prevalence reference');
  const n = twoByTwo(s.table, { measures: ['PD'], rdCi: 'newcombe', confLevel: 0.95 });
  close(n.PD.ci[0], s['RD.newcombe10'][0], CLOSED, 'Newcombe lower');
  close(n.PD.ci[1], s['RD.newcombe10'][1], CLOSED, 'Newcombe upper');
});

test('[[12, 8], [5, 15]]: RR, OR, RD, AFe, AFp and the case-control fractions (scipy-1.17.1)', () => {
  const s = x['twoByTwo.small'];
  const r = twoByTwo(s.table, { measures: ALL, confLevel: 0.95 });
  close(r.RR.value, s.RR, CLOSED, 'RR');
  close(r.RR.ci[0], s['RR.waldLog'][0], CLOSED, 'RR lower');
  close(r.OR.ci[1], s['OR.woolf'][1], CLOSED, 'OR upper');
  close(r.RD.ci[0], s['RD.wald'][0], CLOSED, 'RD lower');
  close(r.AFe.value, s.AFe, CLOSED, 'AFe');
  close(r.AFp.value, s.AFp, CLOSED, 'AFp');
  close(r.AFeEst.value, s.AFeFromOR, CLOSED, 'AFe from OR');
  close(r.AFpEst.value, s.AFeFromOR * (12 / 17), CLOSED, 'AFp from OR');
});

test('R pin: every case in r/out/twobytwo.json (r-4.6.0)', (t) => {
  const pin = readFixture('r/out/twobytwo.json');
  if (!pin) return t.skip('r/out/twobytwo.json not generated yet (rparity)');
  for (const [name, c] of Object.entries(pin.cases)) {
    const v = c.values;
    const o = { measures: ALL, confLevel: c.confLevel, zeroCell: c.zeroCell ?? 'none' };
    const w = twoByTwo(c.table, o);
    close(w.p1.value, v.risk1, CLOSED, `${name} risk1`);
    close(w.p0.value, v.risk0, CLOSED, `${name} risk0`);
    for (const m of ['RR', 'OR', 'RD']) {
      close(w[m].value, v[m].value, CLOSED, `${name} ${m}`);
      close(w[m].se, v[m].se, CLOSED, `${name} ${m} se`);
      close(w[m].ci[0], v[m].ci[0], CLOSED, `${name} ${m} lower`);
      close(w[m].ci[1], v[m].ci[1], CLOSED, `${name} ${m} upper`);
    }
    close(w.AFe.value, v.AFe, CLOSED, `${name} AFe`);
    close(w.AFp.value, v.AFp, CLOSED, `${name} AFp`);
    close(w.AFeEst.value, v.AFeFromOR, CLOSED, `${name} AFe from OR`);
    close(w.AFpEst.value, v.AFpFromOR, CLOSED, `${name} AFp from OR`);
    const nw = twoByTwo(c.table, { ...o, rdCi: 'newcombe' });
    close(nw.RD.ci[0], v.RD.newcombe[0], CLOSED, `${name} Newcombe lower`);
    close(nw.RD.ci[1], v.RD.newcombe[1], CLOSED, `${name} Newcombe upper`);
    if (v.RR.score) {
      const sc = twoByTwo(c.table, { ...o, rrCi: 'score' });
      // PropCIs::riskscoreci solves Koopman's equation as a cubic, so the bounds are exact: 1e-6.
      close(sc.RR.ci[0], v.RR.score[0], ITER, `${name} score lower`);
      close(sc.RR.ci[1], v.RR.score[1], ITER, `${name} score upper`);
    }
    if (c.exactOR) {
      const ex = twoByTwo(c.table, { ...o, orCi: 'exact' });
      closeUniroot(ex.OR.value, c.exactOR.estimate, `${name} conditional MLE`);
      closeUniroot(ex.OR.ci[0], c.exactOR.ci[0], `${name} exact lower`);
      closeUniroot(ex.OR.ci[1], c.exactOR.ci[1], `${name} exact upper`);
    }
  }
});

test('Koopman score interval: the statistic equals the chi-square critical value at both bounds', () => {
  const crit = qnorm(0.975) ** 2;
  for (const [a, n1, c, n0] of [[12, 20, 5, 20], [116, 480, 27, 236], [3, 1000, 1, 1000]]) {
    const [lo, hi] = koopmanCi(a, n1, c, n0, 0.95);
    close(koopmanStatistic(a, n1, c, n0, lo), crit, 1e-9, `lower bound ${a}/${n1} vs ${c}/${n0}`);
    close(koopmanStatistic(a, n1, c, n0, hi), crit, 1e-9, `upper bound ${a}/${n1} vs ${c}/${n0}`);
    assert.ok(lo < (a / n1) / (c / n0) && hi > (a / n1) / (c / n0));
    close(koopmanStatistic(a, n1, c, n0, (a / n1) / (c / n0)), 0, 0, 'zero at the estimate');
  }
  // No positives in the reference group: the upper bound is open.
  assert.equal(koopmanCi(5, 20, 0, 20, 0.95)[1], Infinity);
  assert.equal(koopmanCi(0, 20, 5, 20, 0.95)[0], 0);
});

test('Newcombe interval stays inside -1 to 1 and contains the difference', () => {
  const [lo, hi] = newcombeCi(20, 20, 0, 20, 0.95);
  assert.ok(lo > 0 && hi <= 1);
});

test('zero cells: undefined ratios are null with a reason unless Haldane or exact is chosen', () => {
  const t = [[7, 0], [2, 5]];
  const none = twoByTwo(t, { measures: ['RR', 'OR'], zeroCell: 'none' });
  assert.equal(none.OR.value, null);
  assert.equal(none.OR.reasonKey, 'epi.undefined.zeroOddsDenominator');
  assert.equal(none.RR.value, 3.5);
  const hal = twoByTwo(t, { measures: ['RR', 'OR'], zeroCell: 'haldane' });
  close(hal.OR.value, 33, CLOSED, 'Haldane OR');
  assert.equal(hal.OR.ciMethod, 'woolf+haldane');
  const ref0 = twoByTwo([[5, 5], [0, 10]], { measures: ['RR'] });
  assert.equal(ref0.RR.value, null);
  assert.equal(ref0.RR.reasonKey, 'epi.undefined.zeroReferenceRisk');
  const exp0 = twoByTwo([[0, 10], [5, 5]], { measures: ['RR'] });
  assert.equal(exp0.RR.value, 0);
  assert.deepEqual(exp0.RR.ci, [null, null]);
  assert.equal(exp0.RR.reasonKey, 'epi.undefined.zeroCellCi');
  const empty = twoByTwo([[0, 0], [5, 5]], { measures: ['RR'] });
  assert.equal(empty.RR.reasonKey, 'epi.undefined.emptyRow');
});

test('exact OR with a zero cell is Infinity, not null (scipy-1.17.1 fisher.zeroCell)', () => {
  const f = x['fisher.zeroCell'];
  const r = twoByTwo(f.table, { measures: ['OR'], orCi: 'exact' });
  assert.equal(r.OR.value, Infinity);
  assert.equal(r.OR.ci[1], Infinity);
  closeUniroot(r.OR.ci[0], f.exactCI[0], 'exact lower');
});

test('a protective exposure leaves the attributable fractions undefined', () => {
  const r = twoByTwo([[5, 15], [12, 8]], { measures: ['AFe', 'AFp'] });
  assert.equal(r.AFe.value, null);
  assert.equal(r.AFe.reasonKey, 'epi.undefined.afProtective');
});

test('runTwoByTwo on the rebuilt serosurvey: rows, the DEFF route and the within-farm route', () => {
  const t = serosurveyTable();
  const ds = { kind: 'dataset', datasetId: 'd', recipeRev: 1 };
  const plain = runTwoByTwo(spec('epi.twoByTwo', ds, { ...SERO_ROLES, design: 'cross-sectional' }), t);
  assert.equal(plain.status, 'ok');
  assert.deepEqual(plain.tables[0].rows.slice(0, 2), [['exposed', 116, 364, 480], ['reference', 27, 209, 236]]);
  assert.equal(plain.used, SERO.assoc.nKnown);
  assert.deepEqual(plain.dropped, [{ reason: 'missing', column: 'age', count: SERO.assoc.nDropped }]);
  assert.deepEqual(Object.keys(plain.values).filter((k) => ['PR', 'POR', 'PD'].includes(k)).sort(), ['PD', 'POR', 'PR']);
  assert.equal(plain.values.RR, undefined, 'a cross-sectional design reports PR, not RR');

  const deff = runTwoByTwo(spec('epi.twoByTwo', ds, { ...SERO_ROLES, design: 'cross-sectional', route: 'deff' }), t);
  // DEFF from every animal with an ELISA result (728), as the board says: "ICC of the whole set".
  close(deff.values.deff.value, SERO.deff, CLOSED, 'DEFF');
  close(deff.values.PR.value, SERO.assoc.deffPR.est, CLOSED, 'PR');
  close(deff.values.PR.ci[0], SERO.assoc.deffPR.ci[0], 1e-7, 'DEFF PR lower (numbers.json z = 1.959964)');
  close(deff.values.PR.ci[1], SERO.assoc.deffPR.ci[1], 1e-7, 'DEFF PR upper');
  assert.equal(deff.values.PR.ciMethod, 'wald-log+deff');
  // Where the ICC and the farm size come from (review round 3): 728 animals in 49 farms, mean
  // 728 / 49 = 14.857, while the 2x2 uses the 716 with a known age.
  assert.equal(deff.values.nIcc.value, SERO.n);
  assert.equal(deff.values.clusters.value, 49);
  close(deff.values.meanSize.value, SERO.mBar, CLOSED, 'mean farm size');
  assert.equal(deff.used, SERO.assoc.nKnown);

  const within = runTwoByTwo(spec('epi.twoByTwo', ds, { ...SERO_ROLES, design: 'cross-sectional', route: 'mh-within' }), t);
  close(within.values.PR.value, SERO.assoc.mh.pr.est, CLOSED, 'MH PR');
  close(within.values.POR.value, SERO.assoc.mh.or.est, CLOSED, 'MH POR');
  close(within.tests[0].statistic.value, SERO.assoc.mh.cmh, CLOSED, 'CMH');
  assert.equal(within.values.strataInformative.value, SERO.assoc.mh.informative);
});

test('counts input: the DEFF route needs a DEFF given with the counts', () => {
  const s = spec('epi.twoByTwo', { kind: 'counts', counts: { table: SERO.assoc.table } }, { design: 'cross-sectional', route: 'deff' });
  assert.equal(runTwoByTwo(s, null).reasonKey, 'epi.route.deffNeedsValue');
  const g = runTwoByTwo(spec('epi.twoByTwo', { kind: 'counts', counts: { table: SERO.assoc.table, deff: SERO.deff } }, { design: 'cross-sectional', route: 'deff' }), null);
  close(g.values.PR.ci[1], SERO.assoc.deffPR.ci[1], 1e-7, 'DEFF PR upper from counts');
});

test('a case-control design reports OR and the estimated fractions only', () => {
  const out = runTwoByTwo(spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[12, 8], [5, 15]] } }, { design: 'case-control' }), null);
  assert.deepEqual(Object.keys(out.values).sort(), ['AFeEst', 'AFpEst', 'OR']);
  close(out.values.OR.value, 4.5, CLOSED, 'OR');
});

test('a zero-width Wald interval is never printed as a 95% CI (review round 1)', () => {
  // a=10,b=0,c=10,d=0: both rows 100% positive, RR 1 and RD 0 with Wald SE 0
  const all = twoByTwo([[10, 0], [10, 0]], { measures: ['RR', 'RD', 'AFe'] });
  assert.deepEqual(all.RR.ci, [null, null]);
  assert.equal(all.RR.reasonKey, 'epi.undefined.waldNoVariance');
  assert.deepEqual(all.RD.ci, [null, null]);
  assert.equal(all.RD.reasonKey, 'epi.undefined.waldNoVariance');
  assert.equal(all.AFe.value, 0);
  assert.deepEqual(all.AFe.ci, [null, null]);
  const none = twoByTwo([[0, 10], [0, 10]], { measures: ['RD'] });
  assert.equal(none.RD.value, 0);
  assert.deepEqual(none.RD.ci, [null, null]);
  // Newcombe still gives a real interval for the same table
  const nc = twoByTwo([[0, 10], [0, 10]], { measures: ['RD'], rdCi: 'newcombe' });
  assert.ok(nc.RD.ci[0] < 0 && nc.RD.ci[1] > 0);
});

test('the DEFF route says where its ICC and farm size come from: 728 animals, while vaccine x ELISA uses 682 rows (review round 3)', async () => {
  const { serosurveyTable: studioTable } = await import('./runtime-m1-specs.mjs');
  const { handleRequest } = await import('../../src/lib/runtime/engine-core.js');
  const { makeSpec } = await import('../../src/lib/runtime/spec.js');
  const { table, codebook, steps, keys } = await studioTable();
  const s = makeSpec('epi.twoByTwo', { kind: 'dataset', datasetId: 'd', recipeRev: 3 }, {
    design: 'cross-sectional', roles: { exposure: keys.vaccine, outcome: keys.elisa },
    levels: { outcomePositive: 'บวก', exposureLevel: 'ไม่ฉีด', referenceLevel: 'ฉีด' },
    cluster: { route: 'deff', column: codebook.clusterKey },
  });
  const { result: env } = await handleRequest('run', { spec: s, table, codebook, steps }, { mode: 'worker' });
  assert.equal(env.status, 'ok');
  // 46 cows answered "ไม่ทราบ" for the vaccine (numbers.json conv.missing): 728 - 46 = 682 in the 2x2.
  assert.equal(env.provenance.rowsUsed, 682);
  assert.equal(env.values.nIcc.value, 728);
  assert.equal(env.values.clusters.value, 49);
  close(env.values.meanSize.value, 728 / 49, CLOSED, 'mean farm size of the ICC animals');
  close(env.values.deff.value, SERO.deff, CLOSED, 'DEFF from the ICC of the whole set');
});

