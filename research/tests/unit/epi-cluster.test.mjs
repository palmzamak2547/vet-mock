// Clustering [M1-DESIGN.md 7.21]: ICC (one-way ANOVA, unequal sizes), DEFF, effective n, DEFF-widened
// Wald, aggregation to the farm. Fixtures and their sources:
// - serosurvey-numbers: work/research-studio/workspace/numbers.json prev block, recomputed by check.py
//   (SciPy); the same 49 farm counts are the landing herd, seed 27953 (design/README.md: 146 positives,
//   ICC 0.051, DEFF 1.70, effective n 428, DEFF-adjusted Wald 16.3 to 23.8);
// - scipy-1.17.1: tests/fixtures/crosscheck/scipy-crosscheck.json icc.continuous;
// - course-2026: tests/fixtures/course/epi-course-2026.json item 107039 (m 15, ICC 0.05 -> DEFF 1.70).
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iccOneWay, iccFromCounts, designEffect, deffWaldCi, aggregateToCluster, runIccDeff, outcomeIcc } from '../../src/lib/epi/cluster.js';
import { SERO, FARM_SIZES, FARM_POSITIVES, serosurveyTable, spec, readFixture, close, CLOSED } from './epi-fixtures.mjs';

test('serosurvey farm counts: ICC, DEFF, effective n (serosurvey-numbers; herd seed 27953)', () => {
  const r = iccFromCounts(FARM_SIZES, FARM_POSITIVES);
  close(r.icc, SERO.icc, CLOSED, 'ICC');
  close(r.meanSize, SERO.mBar, CLOSED, 'mean farm size');
  const d = designEffect(r.icc, r.meanSize, r.n);
  close(d.deff, SERO.deff, CLOSED, 'DEFF');
  close(d.nEff, SERO.nEff, CLOSED, 'effective n');
  // The landing prints the herd's own numbers rounded: 146, 0.051, 1.70, 428.
  assert.equal(FARM_POSITIVES.reduce((s, x) => s + x, 0), 146);
  assert.equal(r.icc.toFixed(3), '0.051');
  assert.equal(d.deff.toFixed(2), '1.70');
  assert.equal(Math.round(d.nEff), 428);
});

test('serosurvey DEFF-widened Wald interval for the prevalence (serosurvey-numbers)', () => {
  const p = SERO.x / SERO.n;
  const se = Math.sqrt((p * (1 - p)) / SERO.n);
  const ci = deffWaldCi(p, se, SERO.deff, 0.95, 'identity');
  // numbers.json was written with z = 1.959964 (six decimals, herd-seed.mjs) and check.py compares
  // these bounds at 1e-7; the engine uses the exact normal quantile, 1.8e-9 apart.
  close(ci[0], SERO.waldDeff[0], 1e-7, 'lower');
  close(ci[1], SERO.waldDeff[1], 1e-7, 'upper');
  assert.equal((ci[0] * 100).toFixed(1), '16.3');
  assert.equal((ci[1] * 100).toFixed(1), '23.8');
});

test('per-animal ICC equals the count form (728 animals from the rebuilt table)', () => {
  const t = serosurveyTable();
  assert.equal(t.n, 728);
  const r = outcomeIcc(t, 'elisa', 'pos', 'farm');
  close(r.icc, SERO.icc, CLOSED, 'ICC from rows');
  assert.equal(r.n, 728);
  assert.equal(r.k, 49);
});

test('continuous clusters: MSB, MSW, n0, ICC (scipy-1.17.1 crosscheck)', () => {
  const x = readFixture('crosscheck/scipy-crosscheck.json')['icc.continuous'];
  const y = [], g = [];
  for (const [id, vals] of Object.entries(x.clusters)) for (const v of vals) { y.push(v); g.push(id); }
  const r = iccOneWay(y, g);
  close(r.msb, x.MSB, CLOSED, 'MSB');
  close(r.msw, x.MSW, CLOSED, 'MSW');
  close(r.n0, x.n0, CLOSED, 'n0');
  close(r.icc, x.ICC, CLOSED, 'ICC');
  close(designEffect(r.icc, r.meanSize, r.n).deff, x.DEFFmeanSize, CLOSED, 'DEFF with mean size');
});

test('course 107039: m 15, ICC 0.05 gives DEFF 1.70 and 428 x 1.70 = 727.6 (course-2026)', () => {
  const item = readFixture('course/epi-course-2026.json').items.find((i) => i.id === 107039);
  const out = runIccDeff(spec('cluster.iccDeff', { kind: 'params', params: { icc: item.input.rho, m: item.input.m, n: 728 } }), null);
  assert.equal(out.status, 'ok');
  close(out.values.deff.value, item.value.deff, CLOSED, 'DEFF');
  close(item.input.n * out.values.deff.value, item.value.n, CLOSED, 'n x DEFF');
});

test('undefined ICC is null with a reason, never 0', () => {
  assert.equal(iccOneWay([1, 0, 1], [1, 1, 1]).icc, null);
  assert.equal(iccOneWay([1, 0, 1], [1, 1, 1]).reasonKey, 'epi.undefined.iccOneCluster');
  assert.equal(iccOneWay([1, 0], [1, 2]).reasonKey, 'epi.undefined.iccOneAnimalPerCluster');
  assert.equal(iccOneWay([1, 1, 1, 1], [1, 1, 2, 2]).reasonKey, 'epi.undefined.iccNoVariation');
});

test('a negative ICC is reported as estimated; DEFF uses 0 (M1-DESIGN.md 7.21)', () => {
  // Every farm half positive: between-farm variation smaller than chance.
  const y = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], g = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
  const out = runIccDeff(spec('cluster.iccDeff', { kind: 'counts', counts: { sizes: [2, 2, 2, 2, 2, 2], positives: [1, 1, 1, 1, 1, 1] } }), null);
  assert.ok(iccOneWay(y, g).icc < 0);
  assert.ok(out.values.icc.value < 0);
  assert.equal(out.values.icc.noteKey, 'epi.note.iccNegative');
  assert.equal(out.values.deff.value, 1);
});

test('runIccDeff on the rebuilt serosurvey table', () => {
  const out = runIccDeff(spec('cluster.iccDeff', { kind: 'dataset', datasetId: 'd', recipeRev: 1 }, { roles: { outcome: 'elisa', cluster: 'farm' }, levels: { outcomePositive: 'pos' }, clusterColumn: 'farm' }), serosurveyTable());
  assert.equal(out.status, 'ok');
  close(out.values.icc.value, SERO.icc, CLOSED, 'ICC');
  close(out.values.deff.value, SERO.deff, CLOSED, 'DEFF');
  close(out.values.nEff.value, SERO.nEff, CLOSED, 'effective n');
  assert.equal(out.values.clusters.value, 49);
  assert.equal(out.used, 728);
});

test('aggregateToCluster: herd status and farm-level columns, as a WorkingTable', () => {
  const t = serosurveyTable();
  const agg = aggregateToCluster(t, 'farm', ['elisa', 'age'], { positive: { elisa: 'pos' } });
  assert.equal(agg.n, 49);
  const pos = agg.columns.elisa.levels.indexOf('pos');
  const herdPositive = [...agg.columns.elisa.values].filter((v) => v === pos).length;
  assert.equal(herdPositive, SERO.farmsWithPositive);
  // Age varies inside farms, so without a positive level the farm value is missing (code 5).
  assert.ok([...agg.columns.age.missing].every((m) => m === 5 || m === 0));
  assert.ok([...agg.columns.age.missing].some((m) => m === 5));
  assert.deepEqual(agg.sizes, FARM_SIZES);
});

test('the serosurvey numbers file, when committed, still says what this test pins', () => {
  const committed = readFixture('serosurvey/numbers.json');
  if (!committed) return;
  close(committed.prev.icc, SERO.icc, 0, 'icc');
  close(committed.prev.deff, SERO.deff, 0, 'deff');
  assert.deepEqual(committed.prev.farmPositives, FARM_POSITIVES);
});
