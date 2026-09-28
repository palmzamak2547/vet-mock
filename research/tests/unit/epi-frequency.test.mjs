// Disease frequency [M1-DESIGN.md 7.17]. Fixtures and their sources:
// - course-2026: tests/fixtures/course/epi-course-2026.json items 107002 (17/179 = 9.5%), 107003
//   (period 50%, point 38.89%), 107004 (20/(200 - 5) = 10.26%), 107006 (7 per 1,089 animal-months =
//   6.4 per 1,000);
// - scipy-1.17.1: scipy-crosscheck.json proportion.17of179, incidenceRate.course107006,
//   truePrevalence.closedForm;
// - serosurvey-numbers: numbers.json prev (Wilson, DEFF-widened Wald, herd-level 43/49, true
//   prevalence with Se 0.95 and Sp 0.98), via epi-fixtures.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { roganGladen, runProportion, runIncidenceRisk, runIncidenceRate, runTruePrevalence } from '../../src/lib/epi/frequency.js';
import { SERO, SERO_ROLES, serosurveyTable, spec, readFixture, close, CLOSED } from './epi-fixtures.mjs';

const course = readFixture('course/epi-course-2026.json');
const item = (id) => course.items.find((i) => i.id === id);
const x = readFixture('crosscheck/scipy-crosscheck.json');
const counts = (method, c, extra) => spec(method, { kind: 'counts', counts: c }, extra);
const ds = { kind: 'dataset', datasetId: 'd', recipeRev: 1 };
const seroProp = { roles: { outcome: 'elisa' }, levels: { outcomePositive: 'pos' }, clusterColumn: 'farm' };

test('107002: 17/179 = 9.5% with Wilson, exact and Wald intervals', () => {
  const it = item(107002);
  const s = x['proportion.17of179'];
  for (const [m, key] of [['wilson', 'wilson'], ['exact', 'exact'], ['wald', 'wald']]) {
    const out = runProportion(counts('freq.proportion', it.input, { options: { ciMethod: m } }), null);
    close(out.values.prevalence.value, it.value, CLOSED, `${m} value`);
    close(out.values.prevalence.ci[0], s[key][0], 1e-9, `${m} lower`);
    close(out.values.prevalence.ci[1], s[key][1], 1e-9, `${m} upper`);
  }
  assert.equal((it.value * 100).toFixed(1), '9.5');
});

test('107003: period and point prevalence with their own denominators', () => {
  const it = item(107003);
  const period = runProportion(counts('freq.proportion', it.input.period), null);
  const point = runProportion(counts('freq.proportion', it.input.point), null);
  close(period.values.prevalence.value, it.value.period, CLOSED, 'period');
  close(point.values.prevalence.value, it.value.point, CLOSED, 'point');
});

test('107004: incidence risk removes animals already diseased at the start', () => {
  const it = item(107004);
  const out = runIncidenceRisk(counts('freq.incidenceRisk', it.input), null);
  close(out.values.risk.value, it.value, CLOSED, 'risk');
  assert.equal(out.values.atRisk.value, 195);
  assert.equal((out.values.risk.value * 100).toFixed(2), '10.26');
});

test('107006: incidence rate 6.4 per 1,000 animal-months with the exact Poisson interval', () => {
  const it = item(107006);
  const s = x['incidenceRate.course107006'];
  const out = runIncidenceRate(counts('freq.incidenceRate', it.input, { options: { per: 1000 } }), null);
  close(out.values.rate.value, it.value, CLOSED, 'rate');
  close(out.values.rate.ci[0], s.exact[0] * 1000, 1e-9, 'lower');
  close(out.values.rate.ci[1], s.exact[1] * 1000, 1e-9, 'upper');
  assert.equal(out.values.rate.value.toFixed(1), '6.4');
});

test('Rogan-Gladen closed form (scipy-1.17.1) and the undefined case', () => {
  const s = x['truePrevalence.closedForm'];
  close(roganGladen(s.AP, s.Se, s.Sp), s.TP, CLOSED, 'true prevalence');
  assert.equal(roganGladen(0.2, 0.5, 0.5), null);
  const out = runTruePrevalence(counts('freq.truePrevalence', { x: 20, n: 100 }, { options: { se: 0.5, sp: 0.4 } }), null);
  assert.equal(out.values.truePrevalence.value, null);
  assert.equal(out.values.truePrevalence.reasonKey, 'epi.undefined.seSpUninformative');
});

test('serosurvey: Wilson prevalence, then the DEFF route and the herd-level route (serosurvey-numbers)', () => {
  const t = serosurveyTable();
  const plain = runProportion(spec('freq.proportion', ds, seroProp), t);
  close(plain.values.prevalence.value, SERO.p, CLOSED, 'prevalence');
  close(plain.values.prevalence.ci[0], SERO.wilsonIndependent[0], 1e-7, 'Wilson lower');
  assert.equal(plain.used, 728);
  const deff = runProportion(spec('freq.proportion', ds, { ...seroProp, route: 'deff' }), t);
  close(deff.values.deff.value, SERO.deff, CLOSED, 'DEFF');
  close(deff.values.nEff.value, SERO.nEff, CLOSED, 'effective n');
  // numbers.json used z = 1.959964; check.py compares these bounds at 1e-7.
  close(deff.values.prevalence.ci[0], SERO.waldDeff[0], 1e-7, 'DEFF lower');
  close(deff.values.prevalence.ci[1], SERO.waldDeff[1], 1e-7, 'DEFF upper');
  assert.equal(deff.values.prevalence.ciMethod, 'wald-deff');
  const herd = runProportion(spec('freq.proportion', ds, { ...seroProp, route: 'aggregate' }), t);
  assert.equal(herd.values.clustersPositive.value, SERO.farmsWithPositive);
  close(herd.values.prevalence.value, 43 / 49, CLOSED, 'herd-level prevalence');
  assert.equal(herd.values.prevalence.noteKey, 'epi.note.herdLevel');
  close(herd.values.prevalence.ci[0], SERO.farmsWithPositiveCI[0], 1e-7, 'herd Wilson lower');
  close(herd.values.prevalence.ci[1], SERO.farmsWithPositiveCI[1], 1e-7, 'herd Wilson upper');
});

test('serosurvey true prevalence on the DEFF route: Rogan-Gladen of the widened bounds (serosurvey-numbers)', () => {
  const out = runTruePrevalence(spec('freq.truePrevalence', ds, { ...seroProp, route: 'deff', options: { se: SERO.trueP.se, sp: SERO.trueP.sp } }), serosurveyTable());
  close(out.values.truePrevalence.value, SERO.trueP.p, CLOSED, 'true prevalence');
  close(out.values.truePrevalence.ci[0], SERO.trueP.ci[0], 1e-7, 'lower');
  close(out.values.truePrevalence.ci[1], SERO.trueP.ci[1], 1e-7, 'upper');
});

test('true prevalence below zero is clipped with a note, not hidden', () => {
  const out = runTruePrevalence(counts('freq.truePrevalence', { x: 1, n: 100 }, { options: { se: 0.9, sp: 0.95, apparentCiMethod: 'wilson' } }), null);
  assert.equal(out.values.truePrevalence.value, 0);
  assert.equal(out.values.truePrevalence.noteKey, 'epi.note.truePrevalenceClipped');
});

test('dataset incidence rate sums cases and animal-time over rows with both', () => {
  const t = {
    rowIds: ['r1', 'r2', 'r3', 'r4'], n: 4, recipeRev: 1, excluded: {}, fingerprint: 't',
    columns: {
      ev: { key: 'ev', kind: 'number', values: Float64Array.from([1, 0, 2, NaN]), missing: Uint8Array.from([0, 0, 0, 2]) },
      tm: { key: 'tm', kind: 'number', values: Float64Array.from([10, 20, 30, 5]), missing: new Uint8Array(4) },
    },
  };
  const out = runIncidenceRate(spec('freq.incidenceRate', ds, { roles: { outcome: 'ev', time: 'tm' }, options: { per: 100 } }), t);
  assert.equal(out.values.cases.value, 3);
  assert.equal(out.values.animalTime.value, 60);
  close(out.values.rate.value, 5, CLOSED, 'per 100');
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'ev', count: 1 }]);
});

test('no denominator is null with a reason, never 0', () => {
  const out = runProportion(counts('freq.proportion', { x: 0, n: 0 }), null);
  assert.equal(out.values.prevalence.value, null);
  assert.equal(out.values.prevalence.reasonKey, 'epi.undefined.noDenominator');
  assert.equal(runProportion(counts('freq.proportion', { x: 5, n: 3 }), null).status, 'invalid');
  assert.equal(SERO_ROLES.clusterColumn, 'farm');
});

test('a low prevalence on the DEFF route is never printed below 0 (review round 1, 2/100 with DEFF 2)', () => {
  // unclipped: 0.02 +/- 1.959964 * sqrt(0.02 * 0.98 / 100) * sqrt(2) = [-0.0188, 0.0588]
  const deffSpec = counts('freq.proportion', { x: 2, n: 100, deff: 2 }, { route: 'deff' });
  deffSpec.cluster = { route: 'deff', deff: 2 };
  const out = runProportion(deffSpec, null);
  const v = out.values.prevalence;
  assert.equal(v.ci[0], 0);
  close(v.ci[1], 0.02 + 1.959963984540054 * Math.sqrt((0.02 * 0.98) / 100) * Math.SQRT2, 1e-12, 'upper kept');
  assert.equal(v.noteKey, 'stats.note.ciTruncated');
  const tpSpec = counts('freq.truePrevalence', { x: 2, n: 100, deff: 2 }, { options: { se: 0.95, sp: 0.98 } });
  tpSpec.cluster = { route: 'deff', deff: 2 };
  const tp = runTruePrevalence(tpSpec, null);
  assert.equal(tp.values.apparent.ci[0], 0);
  assert.equal(tp.values.apparent.noteKey, 'stats.note.ciTruncated');
});

test('serosurvey through runAnalysis on the survey farm route: no G1 loop, the survey 4.5 logit interval (r-4.6.0 survey.json)', async () => {
  // Review round 2: guardrails.js did not count 'survey' as accounting for farms, so choosing it raised G1 again
  // and offered 'survey' in the same stop; the route could never produce a result.
  const { runAnalysis } = await import('../../src/lib/runtime/run.js');
  const pin = JSON.parse(readFileSync(fileURLToPath(new URL('../fixtures/r/out/survey.json', import.meta.url)), 'utf8')).cases.serosurvey.values;
  const t = serosurveyTable();
  const env = runAnalysis(spec('freq.proportion', ds, { ...seroProp, design: 'cross-sectional', route: 'survey' }), t, null);
  assert.equal(env.status, 'ok');
  assert.deepEqual(env.guard.stops, []);
  close(env.values.prevalence.value, pin.p, CLOSED, 'survey p');
  close(env.values.prevalence.ci[0], pin.logitLower, 1e-6, 'survey logit lower');
  close(env.values.prevalence.ci[1], pin.logitUpper, 1e-6, 'survey logit upper');
  close(env.values.prevalence.ci[0], 0.16443, 1e-4, 'survey logit lower (0.16443)');
  close(env.values.prevalence.ci[1], 0.24230, 1e-4, 'survey logit upper (0.24230)');
  // the robust route of the regression models is farm-aware for the same reason
  const { FARM_AWARE } = await import('../../src/lib/epi/guardrails.js');
  for (const r of ['survey', 'robust', 'deff', 'mh-within', 'aggregate']) assert.ok(FARM_AWARE.has(r), r);
});
