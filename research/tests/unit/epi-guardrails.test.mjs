// Guardrails [M1-DESIGN.md 7.20; methods.md section 4]. Fixture families:
// - serosurvey-numbers: numbers.json prev (ICC 0.05057853226668923, DEFF 1.7008739471241223,
//   effective n 428.01525723344724 with m = 728/49), via epi-fixtures.mjs SERO on the rebuilt table.
// (Course item 107039, DEFF 1.70, is pinned in epi-cluster.test.mjs.)
// Every finding's title and body key must exist in both languages. OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUARDS, evaluateGuards, resultGuards, clusterPanel, expectedCheck } from '../../src/lib/epi/guardrails.js';
import { routeKeys } from '../../src/lib/epi/labels.js';
import dict from '../../src/i18n/epi.js';
import { SERO, SERO_ROLES, serosurveyTable, spec, close, CLOSED } from './epi-fixtures.mjs';

const ids = (list) => list.map((f) => f.id);
const all = (r) => [...r.stops, ...r.warnings, ...r.notes];

/** A category column from string values; null is missing. */
function cat(key, values) {
  const levels = [...new Set(values.filter((v) => v !== null))];
  return {
    key, kind: 'category', levels,
    values: Int32Array.from(values.map((v) => (v === null ? 0 : levels.indexOf(v)))),
    missing: Uint8Array.from(values.map((v) => (v === null ? 2 : 0))),
  };
}
function table(cols) {
  const n = Object.values(cols)[0].length;
  const columns = Object.fromEntries(Object.entries(cols).map(([k, v]) => [k, cat(k, v)]));
  return { rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), columns, n, recipeRev: 1, excluded: {}, fingerprint: 't' };
}

test('the M1 set: G1 to G13, G16 to G20, G24 to G26, each with a title and body in Thai and English', () => {
  assert.deepEqual(ids(GUARDS), ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G16', 'G17', 'G18', 'G19', 'G20', 'G24', 'G25', 'G26']);
  for (const g of GUARDS) {
    assert.ok(['stop', 'warn', 'note'].includes(g.severity), g.id);
    for (const lang of ['th', 'en']) {
      assert.ok(dict[lang][`epi.guard.${g.id}.title`], `${lang} epi.guard.${g.id}.title`);
      assert.ok(dict[lang][`epi.guard.${g.id}.body`], `${lang} epi.guard.${g.id}.body`);
    }
  }
  for (const id of ['G1', 'G2', 'G3', 'G6', 'G9', 'G16', 'G26']) assert.equal(GUARDS.find((g) => g.id === id).severity, 'stop', id);
});

test('G1 on the serosurvey: stops with 49 farms and offers the within-farm and DEFF routes (serosurvey-numbers)', () => {
  const t = serosurveyTable();
  const s = spec('epi.twoByTwo', { kind: 'dataset' }, { ...SERO_ROLES, design: 'cross-sectional' });
  const r = evaluateGuards(s, t, null);
  const g1 = r.stops.find((f) => f.id === 'G1');
  assert.ok(g1, 'G1 stops');
  assert.deepEqual(g1.params, { cluster: 'farm', clusters: 49 });
  assert.deepEqual(g1.routes, ['mh-within', 'deff']);
  // The same guard set also warns that 12 animals without an age were left out (G24).
  const g24 = r.warnings.find((f) => f.id === 'G24');
  assert.deepEqual(g24.params, { used: 716, recorded: 728, byColumn: [{ column: 'age', count: 12 }] });
  // A chosen route clears G1; the MH analysis with farm as stratum is itself the within-farm route.
  for (const route of ['deff', 'mh-within', 'aggregate']) {
    assert.ok(!ids(evaluateGuards({ ...s, cluster: { ...s.cluster, route } }, t, null).stops).includes('G1'), route);
  }
  const mh = spec('epi.mantelHaenszel', { kind: 'dataset' }, { ...SERO_ROLES, roles: { ...SERO_ROLES.roles, strata: 'farm' }, design: 'cross-sectional' });
  assert.ok(!ids(evaluateGuards(mh, t, null).stops).includes('G1'));
});

test('G1 panel: ICC, DEFF and effective n come first (serosurvey-numbers)', () => {
  const t = serosurveyTable();
  const p = clusterPanel(spec('epi.twoByTwo', { kind: 'dataset' }, { ...SERO_ROLES, design: 'cross-sectional' }), t, null);
  close(p.icc.value, SERO.icc, CLOSED, 'ICC');
  close(p.deff.value, SERO.deff, CLOSED, 'DEFF');
  close(p.nEff.value, SERO.nEff, CLOSED, 'effective n');
  close(p.meanSize, SERO.mBar, CLOSED, 'mean farm size');
  assert.equal(p.clusters, 49);
  const byId = Object.fromEntries(p.routes.map((r) => [r.id, r]));
  assert.equal(byId['mh-within'].enabled, true);
  assert.equal(byId.deff.enabled, true);
  assert.deepEqual([byId.aggregate.enabled, byId.aggregate.reasonKey], [false, 'epi.route.aggregate.exposureOnAnimal']);
  assert.deepEqual([byId.gee.enabled, byId.mixed.enabled], [false, false]);
  for (const r of p.routes) {
    const k = routeKeys(r.id);
    for (const lang of ['th', 'en']) {
      assert.ok(dict[lang][k.nameKey] && dict[lang][k.descKey], `${lang} ${r.id}`);
      if (r.reasonKey) assert.ok(dict[lang][r.reasonKey], `${lang} ${r.reasonKey}`);
    }
  }
  assert.equal(clusterPanel(spec('epi.twoByTwo', { kind: 'dataset' }, { roles: SERO_ROLES.roles }), { ...t, columns: { age: t.columns.age, elisa: t.columns.elisa } }, null), null);
});

test('G2: an exposure that is the same for every animal of a farm allows only the farm-level route', () => {
  const t = table({
    farm: ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'D'],
    vaccinated: ['y', 'y', 'y', 'n', 'n', 'n', 'y', 'y', 'n', 'n'],
    sick: ['pos', 'neg', 'neg', 'pos', 'pos', 'neg', 'neg', 'neg', 'pos', 'neg'],
  });
  const s = spec('epi.twoByTwo', { kind: 'dataset' }, { roles: { exposure: 'vaccinated', outcome: 'sick' }, levels: { exposureLevel: 'y', referenceLevel: 'n', outcomePositive: 'pos' }, clusterColumn: 'farm', design: 'cohort' });
  const r = evaluateGuards(s, t, null);
  const g2 = r.stops.find((f) => f.id === 'G2');
  assert.deepEqual(g2.routes, ['aggregate']);
  assert.ok(!ids(r.stops).includes('G1'));
  assert.ok(!ids(evaluateGuards({ ...s, cluster: { ...s.cluster, route: 'aggregate' } }, t, null).stops).includes('G2'));
  // The panel names why the within-farm route is closed.
  assert.equal(clusterPanel(s, t, null).routes.find((x) => x.id === 'mh-within').reasonKey, 'epi.route.mhWithin.exposureConstant');
});

test('G4 warns for an odds ratio of a common outcome; not for a rare one or a case-control study', () => {
  const common = spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[30, 20], [15, 35]] } }, { design: 'cohort' });
  const g4 = evaluateGuards(common, null, null).warnings.find((f) => f.id === 'G4');
  assert.deepEqual(g4.params, { share: 0.45, beside: 'RR' });
  const rare = spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[3, 97], [1, 99]] } }, { design: 'cohort' });
  assert.ok(!ids(all(evaluateGuards(rare, null, null))).includes('G4'));
  const cc = spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[30, 20], [15, 35]] } }, { design: 'case-control' });
  assert.ok(!ids(all(evaluateGuards(cc, null, null))).includes('G4'));
  const xs = spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[30, 20], [15, 35]] } }, { design: 'cross-sectional' });
  assert.equal(evaluateGuards(xs, null, null).warnings.find((f) => f.id === 'G4').params.beside, 'PR');
});

test('G5 by Cochran\'s rule: more than 20% of expected counts below 5, or any below 1', () => {
  const e = expectedCheck([[1, 2], [3, 4]]);
  close(e.minExpected, 1.2, CLOSED, 'smallest expected count (3 x 4 / 10)');
  assert.equal(e.shareBelow5, 1);
  const s = (tab) => spec('test.chisq', { kind: 'counts', counts: { table: tab } }, { design: 'cohort' });
  const g5 = evaluateGuards(s([[1, 2], [3, 4]]), null, null).warnings.find((f) => f.id === 'G5');
  assert.deepEqual(g5.routes, ['test.fisher2x2']);
  assert.ok(!ids(all(evaluateGuards(s([[20, 30], [25, 25]]), null, null))).includes('G5'));
  // 3 x 2: one cell of six below 5 (4.89, 16.7%) and none below 1 passes; two of six (33%) warns.
  assert.ok(!ids(all(evaluateGuards(s([[20, 20], [20, 20], [4, 6]]), null, null))).includes('G5'));
  assert.ok(ids(all(evaluateGuards(s([[10, 10], [10, 10], [2, 6]]), null, null))).includes('G5'));
});

test('stops: G6 pair column, G9 observed power, G16 correlation as agreement, G26 open import questions', () => {
  const t = table({ g: ['a', 'b', 'a', 'b'], y: ['1', '0', '1', '1'], pairId: ['p1', 'p1', 'p2', 'p2'] });
  const indep = spec('test.chisq', { kind: 'dataset' }, { roles: { exposure: 'g', outcome: 'y', pair: 'pairId' }, design: 'trial' });
  assert.deepEqual(evaluateGuards(indep, t, null).stops.find((f) => f.id === 'G6').routes, ['test.tTest:paired', 'test.wilcoxonSignedRank', 'test.mcnemar']);
  const paired = spec('test.tTest', { kind: 'dataset' }, { roles: { y: 'y', pair: 'pairId' }, options: { variant: 'paired' } });
  assert.ok(!ids(evaluateGuards(paired, t, null).stops).includes('G6'));
  const power = spec('test.tTest', { kind: 'counts', counts: {} }, { options: { observedPower: true } });
  assert.ok(ids(evaluateGuards(power, null, null).stops).includes('G9'));
  const corr = spec('corr.pearson', { kind: 'counts', counts: {} }, { design: 'agreement' });
  assert.deepEqual(evaluateGuards(corr, null, null).stops.find((f) => f.id === 'G16').routes[0], 'agree.kappa');
  const open = evaluateGuards(spec('freq.proportion', { kind: 'dataset' }, { roles: { outcome: 'y' } }), t, null, { importQuestionsOpen: 2 });
  assert.deepEqual(open.stops.find((f) => f.id === 'G26').params, { open: 2 });
});

test('warnings and notes: G7, G10, G11, G13, G17, G18, G19, G20, G25', () => {
  const w = (sp, tbl = null, cb = null, ctx = {}) => ids(all(evaluateGuards(sp, tbl, cb, ctx)));
  assert.ok(w(spec('adjust.pValues', { kind: 'counts', counts: { p: [0.01, 0.04, 0.2] } }, { options: { method: 'none' } })).includes('G7'));
  assert.ok(w(spec('desc.table1', { kind: 'counts', counts: {} }, { options: { showP: true } })).includes('G10'));
  const cb = { columns: [{ key: 'breed', role: 'confounder' }] };
  assert.ok(w(spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[5, 5], [5, 5]] } }, { design: 'cohort' }), null, cb).includes('G11'));
  const steps = [{ kind: 'bin', params: { target: 'age', cutSource: 'median' } }];
  assert.ok(w(spec('epi.twoByTwo', { kind: 'counts', counts: { table: [[5, 5], [5, 5]] } }, { roles: { exposure: 'age' }, design: 'cohort' }), null, null, { steps }).includes('G13'));
  const ordinal = { columns: [{ key: 'a', type: 'ordinal' }, { key: 'b', type: 'ordinal' }] };
  assert.ok(w(spec('agree.kappa', { kind: 'counts', counts: {} }, { roles: { raterA: 'a', raterB: 'b' } }), null, ordinal).includes('G17'));
  assert.ok(!w(spec('agree.kappa', { kind: 'counts', counts: {} }, { roles: { raterA: 'a', raterB: 'b' }, options: { weights: 'linear' } }), null, ordinal).includes('G17'));
  assert.ok(w(spec('freq.proportion', { kind: 'counts', counts: { x: 17, n: 179 } }), null, null, { testSe: 0.95, testSp: 0.98 }).includes('G18'));
  assert.ok(!w(spec('freq.proportion', { kind: 'counts', counts: { x: 17, n: 179 } })).includes('G18'));
  assert.equal(evaluateGuards(spec('dx.accuracy', { kind: 'counts', counts: {} }), null, null).notes[0].id, 'G19');
  assert.ok(w(spec('dx.accuracy', { kind: 'counts', counts: {} }, { options: { combine: 'series' } })).includes('G20'));
  const g25 = evaluateGuards(spec('ss.proportion', { kind: 'params', params: { p: 0.2, d: 0.05, clustered: true, N: 2000 } }, { options: { fpc: 'none' } }), null, null).warnings.find((f) => f.id === 'G25');
  assert.deepEqual(g25.params.missing, ['deff', 'fpc', 'nonResponse']);
  assert.ok(!w(spec('ss.proportion', { kind: 'params', params: { p: 0.2, d: 0.05, nonResponse: 0.4 } })).includes('G25'));
});

test('result guards: G8 for p above 0.05, G12 for strata that disagree', () => {
  const out = { status: 'ok', tests: [{ id: 'cmh', p: 0.3 }, { id: 'homogeneity', p: 0.01, variant: 'breslow-day-tarone' }] };
  const r = resultGuards({}, out);
  assert.deepEqual(r.warnings.map((f) => f.id), ['G8', 'G12']);
  assert.deepEqual(r.warnings[1].params, { p: 0.01, test: 'breslow-day-tarone' });
  assert.deepEqual(resultGuards({}, { status: 'ok', tests: [{ id: 'cmh', p: 0.001 }, { id: 'homogeneity', p: 0.9 }] }).warnings, []);
  assert.deepEqual(resultGuards({}, { status: 'stopped' }).warnings, []);
  // A null p (an undefined test) raises nothing.
  assert.deepEqual(resultGuards({}, { status: 'ok', tests: [{ id: 'cmh', p: null }] }).warnings, []);
});
