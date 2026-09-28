// The herd guardrail on every M2 method that assumes independent animals [M2-DESIGN.md 2]: on a table whose
// farm column repeats and no farm route is chosen, each stops at G1 and prints no p-value. Review round 1
// found diag.shapiro and diag.brownForsythe running with p-values (0.0069, 0.98) on 10 farms x 8 animals.
// Data: made-up, built here (10 farms, 8 animals each, a farm effect on every outcome).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTable } from './stats-fixtures.mjs';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { AREA_G1_SUBJECT } from '../../src/lib/runtime/areas/index.js';
import { clusterPanel } from '../../src/lib/epi/guardrails.js';

function lcg(seed) { let v = seed; return () => { v = (v * 1103515245 + 12345) % 2147483648; return v / 2147483648; }; }
function farmData(G, m) {
  const rnd = lcg(777);
  const rn = () => Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd());
  const col = { farm: [], y: [], x: [], g: [], t: [], ev: [], grp3: [], b2: [], A: [], Bm: [], sc: [] };
  for (let f = 0; f < G; f++) {
    const u = rn() * 1.2;
    for (let i = 0; i < m; i++) {
      col.farm.push('F' + f); const xi = Math.round(rn() * 1000) / 1000; col.x.push(xi);
      col.y.push(rnd() < 1 / (1 + Math.exp(-(u + 0.3 * xi))) ? 'pos' : 'neg');
      col.g.push(f % 2 ? 'b' : 'a'); col.t.push(1 + Math.floor(rnd() * 20)); col.ev.push(rnd() < 0.6 ? 1 : 0);
      col.grp3.push(['a', 'b', 'c'][i % 3]); col.b2.push(['p', 'q'][Math.floor(i / 2) % 2]);
      col.A.push(Math.round((10 + u + rn()) * 100) / 100); col.Bm.push(Math.round((10 + u + rn() + 0.2) * 100) / 100);
      col.sc.push(Math.round((5 + u * 2 + rn()) * 100) / 100);
    }
  }
  const cat = (v, levels) => ({ kind: 'category', levels: levels || [...new Set(v)], values: v });
  const num = (v) => ({ kind: 'number', values: v });
  return makeTable({
    farm: cat(col.farm), y: cat(col.y, ['neg', 'pos']), x: num(col.x), g: cat(col.g, ['a', 'b']), t: num(col.t), ev: num(col.ev),
    grp3: cat(col.grp3, ['a', 'b', 'c']), b2: cat(col.b2, ['p', 'q']), A: num(col.A), Bm: num(col.Bm), sc: num(col.sc),
  });
}

const CASES = {
  'reg.logistic': { outcome: 'y', covariates: ['x', 'g'] },
  'reg.poisson': { outcome: 't', covariates: ['x'] },
  'surv.kaplanMeier': { time: 't', event: 'ev', group: 'g' },
  'anova.twoWay': { outcome: 'sc', group: 'grp3', factorB: 'b2' },
  'anova.repeated': { outcome: 'sc', subject: 'farm', time: 'grp3' },
  'posthoc.dunnett': { outcome: 'sc', group: 'grp3' },
  'posthoc.gamesHowell': { outcome: 'sc', group: 'grp3' },
  'posthoc.dunn': { outcome: 'sc', group: 'grp3' },
  'test.friedman': { outcome: 'sc', subject: 'farm', time: 'grp3' },
  'roc.delong': { test: 'sc', reference: 'y' },
  'agree.blandAltman': { raterA: 'A', raterB: 'Bm' },
  'rel.cronbach': { items: ['A', 'Bm', 'sc'] },
  'diag.shapiro': { outcome: 'sc' },
  'diag.brownForsythe': { outcome: 'sc', group: 'grp3' },
};

test('every M2 method that assumes independent animals is listed for G1', () => {
  for (const m of Object.keys(CASES)) assert.ok(AREA_G1_SUBJECT.includes(m), m);
});

test('each stops at G1 on a repeating farm column with no route, with no p-value', () => {
  const T = farmData(10, 8);
  for (const [m, roles] of Object.entries(CASES)) {
    const design = m.startsWith('roc') ? 'diagnostic' : m.startsWith('agree') || m.startsWith('rel') ? 'agreement' : 'cohort';
    const levels = m.startsWith('roc') ? { referencePositive: 'pos' } : m.startsWith('reg') ? { outcomePositive: 'pos' } : {};
    const s = makeSpec(m, { kind: 'dataset', datasetId: 'd1', recipeRev: 1 }, { roles, design, levels, cluster: { route: null, column: 'farm' } });
    const env = runAnalysis(s, T, null);
    assert.equal(env.status, 'stopped', m);
    assert.ok(env.guard.stops.some((x) => x.id === 'G1'), `${m}: G1`);
    assert.ok((env.tests || []).every((x) => x.p === null), `${m}: no p-value`);
  }
});

// Review round 3 (blocker): the G1 panel offered 'aggregate' to ROC, Bland-Altman and Cronbach, and to two-way
// ANOVA with the second factor on the animal. A farm mean of each reading answers another question (limits of
// agreement 2.7 times narrower, alpha 0.80 -> 0.96, AUC 0.79 -> 1; the ANOVA ran on 8 of 16 farms). The panel
// must never enable a route that changes what is being estimated.
function specFor(m, roles) {
  const design = m.startsWith('roc') ? 'diagnostic' : m.startsWith('agree') || m.startsWith('rel') ? 'agreement' : 'cohort';
  const levels = m.startsWith('roc') ? { referencePositive: 'pos' } : m.startsWith('reg') ? { outcomePositive: 'pos' } : {};
  return makeSpec(m, { kind: 'dataset', datasetId: 'd1', recipeRev: 1 }, { roles, design, levels, cluster: { route: null, column: 'farm' } });
}

test('the G1 panel never enables one row per farm when a role column other than the outcome varies inside farms, nor for measurements', () => {
  const T = farmData(10, 8);
  for (const [m, roles] of Object.entries(CASES)) {
    const env = runAnalysis(specFor(m, roles), T, null);
    const agg = (env.cluster?.panel?.routes || env.panel?.routes || clusterPanel(specFor(m, roles), T, null).routes).find((r) => r.id === 'aggregate');
    assert.ok(agg, `${m}: aggregate listed`);
    if (m === 'diag.shapiro') assert.equal(agg.enabled, true, m); // outcome only: the farm mean is the same question on farms
    else assert.equal(agg.enabled, false, `${m}: aggregate must be off`);
  }
});

test('measurement methods are refused one row per farm with their own reason, and two-way ANOVA with B on the animal is refused', () => {
  const T = farmData(10, 8);
  for (const m of ['roc.delong', 'agree.blandAltman', 'rel.cronbach']) {
    const agg = clusterPanel(specFor(m, CASES[m]), T, null).routes.find((r) => r.id === 'aggregate');
    assert.equal(agg.reasonKey, 'epi.route.aggregate.notForMeasure', m);
  }
  // A on the farm (g: a/b by farm), B on the animal (b2): the old check read A only and enabled the route.
  const agg = clusterPanel(specFor('anova.twoWay', { outcome: 'sc', group: 'g', factorB: 'b2' }), T, null).routes.find((r) => r.id === 'aggregate');
  assert.equal(agg.enabled, false);
  assert.equal(agg.reasonKey, 'epi.route.aggregate.roleOnAnimal');
  // Choosing the route anyway is refused by run.js (only routes the panel enables are accepted).
  const s = makeSpec('anova.twoWay', { kind: 'dataset', datasetId: 'd1', recipeRev: 1 }, { roles: { outcome: 'sc', group: 'g', factorB: 'b2' }, design: 'cohort', cluster: { route: 'aggregate', column: 'farm' } });
  const env = runAnalysis(s, T, null);
  assert.ok((env.tests || []).every((x) => x.p === null), 'no p-value on a refused route');
});
