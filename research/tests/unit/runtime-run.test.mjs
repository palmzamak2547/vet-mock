// runAnalysis (M1-DESIGN.md 10.3, 7.20): validation, design check, guardrails, the G1 stop that shows
// ICC, DEFF and effective n before any p-value, the farm routes, exclusions and provenance. The
// statistics modules are replaced by stubs here so the runner is tested on its own; each method's
// numbers are tested by its owner's fixture test. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runAnalysis, activeTable, exclusionCounts, g1Applies, roleColumns } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { ENGINE_VERSION } from '../../src/lib/runtime/protocol.js';
import { value } from '../../src/lib/runtime/envelope.js';

const NOW = () => new Date('2026-09-27T12:00:00.000Z');

/** Three farms, 10 animals; exposure varies inside farms; row r10 excluded, r9 filtered. */
function table() {
  const farm = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2];
  const expo = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const outc = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0];
  const col = (vals, levels) => ({ kind: 'category', values: Int32Array.from(vals), levels, missing: new Uint8Array(vals.length) });
  return {
    rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10'],
    n: 10,
    recipeRev: 3,
    excluded: { r10: 's7', r9: 's8' },
    fingerprint: 'abcdef0123456789',
    columns: {
      c1: col(farm, ['F01', 'F02', 'F03']),
      c2: col(expo, ['no', 'yes']),
      c3: col(outc, ['neg', 'pos']),
    },
  };
}
const codebook = { unitOfAnalysis: 'animal', clusterKey: 'c1', columns: [{ key: 'c1', type: 'id', role: 'cluster' }, { key: 'c2', type: 'binary', role: 'exposure' }, { key: 'c3', type: 'binary', role: 'outcome' }] };
const steps = [{ id: 's7', kind: 'row-exclude' }, { id: 's8', kind: 'filter' }];

const okOutput = (extra = {}) => ({
  status: 'ok',
  values: { PR: value(2.1, { ci: [1.4, 3.1], ciLevel: 0.95, ciMethod: 'wald-log' }) },
  tests: [{ id: 'chisq', statistic: { name: 'X2', value: 5 }, df: 1, p: 0.025, alternative: 'two.sided', variant: 'pearson' }],
  tables: [],
  used: 8,
  dropped: [],
  ...extra,
});

function deps(overrides = {}) {
  const calls = { impl: [], guards: 0, panel: 0, aggregate: [] };
  const d = {
    checkDesign: () => ({ allowed: true, reasonKey: null, measures: ['PR', 'POR', 'PD'] }),
    evaluateGuards: () => { calls.guards += 1; return { stops: [], warnings: [], notes: [] }; },
    clusterPanel: () => {
      calls.panel += 1;
      return { icc: value(0.0506), deff: value(1.70), nEff: value(428.0), clusters: 3, meanSize: 3.33, routes: [{ id: 'mh-within', enabled: true, reasonKey: null }, { id: 'deff', enabled: true, reasonKey: null }, { id: 'aggregate', enabled: false, reasonKey: 'epi.guard.G1.aggregateAnimalLevel' }, { id: 'gee', enabled: false, reasonKey: 'epi.guard.G1.m3' }] };
    },
    aggregateToCluster: (t, key) => { calls.aggregate.push(key); return { ...t, n: 3, rowIds: ['F01', 'F02', 'F03'] }; },
    implemented: {
      'epi.twoByTwo': (spec, t) => { calls.impl.push({ method: spec.method, n: t?.n, spec }); return okOutput(); },
      'epi.mantelHaenszel': (spec, t) => { calls.impl.push({ method: spec.method, n: t?.n, spec }); return okOutput({ values: { RR: value(2.17) } }); },
      'test.mannWhitney': (spec) => { calls.impl.push({ method: spec.method }); return okOutput({ resolvedOptions: { exact: 'normal' } }); },
      'test.tTest': () => { throw new Error('boom'); },
      'ss.proportion': (spec) => { calls.impl.push({ method: spec.method }); return { status: 'ok', values: { n: value(385) }, tests: [], tables: [], used: 0, dropped: [] }; },
    },
    ...overrides,
  };
  return { d, calls };
}

const dataSpec = (method, extra = {}) => makeSpec(method, { kind: 'dataset', datasetId: 'd1', recipeRev: 3 }, { design: 'cross-sectional', roles: { exposure: 'c2', outcome: 'c3' }, cluster: { route: null, column: 'c1' }, ...extra });

test('G1: a repeating farm column with no route stops, shows ICC, DEFF and effective n, and never runs the method', () => {
  const { d, calls } = deps();
  const env = runAnalysis(dataSpec('epi.twoByTwo'), table(), codebook, { deps: d, now: NOW, steps });
  assert.equal(env.status, 'stopped');
  assert.equal(calls.impl.length, 0, 'the method must not run before a route is chosen');
  assert.equal(env.guard.stops[0].id, 'G1');
  assert.deepEqual(Object.keys(env.values).sort(), ['deff', 'icc', 'nEff']);
  assert.equal(env.values.deff.value, 1.7);
  assert.equal(env.tests.length, 0);
  assert.ok(env.clusterPanel.routes.some((r) => r.id === 'aggregate' && !r.enabled), 'aggregate is shown switched off for an animal-level factor');
  assert.ok(env.clusterPanel.routes.some((r) => r.id === 'gee'), 'GEE is shown as coming');
  assert.equal(env.verified, false);
});

test('G1 from the guard table is not duplicated by the safety net', () => {
  const { d } = deps({ evaluateGuards: () => ({ stops: [{ id: 'G1', severity: 'stop', key: 'epi.guard.G1.title' }], warnings: [], notes: [] }) });
  const env = runAnalysis(dataSpec('epi.twoByTwo'), table(), codebook, { deps: d, now: NOW });
  assert.equal(env.guard.stops.filter((s) => s.id === 'G1').length, 1);
});

test('route none does not escape G1; a farm-aware route lets the method run', () => {
  const { d, calls } = deps();
  const none = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'none', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(none.status, 'stopped');
  const deff = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d, now: NOW, steps });
  assert.equal(deff.status, 'ok');
  assert.equal(calls.impl.length, 1);
  assert.equal(calls.impl[0].n, 8, 'excluded and filtered rows never reach the method');
  assert.equal(deff.tests[0].p, 0.025);
  assert.ok(deff.guard.notes.some((n) => n.key === 'runtime.note.routeDeff'));
  assert.equal(deff.provenance.route, 'deff');
});

test('within-farm route runs Mantel-Haenszel with the farm as stratum', () => {
  const { d, calls } = deps();
  const env = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'mh-within', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(env.status, 'ok');
  assert.equal(calls.impl[0].method, 'epi.mantelHaenszel');
  assert.equal(calls.impl[0].spec.roles.strata, 'c1');
  assert.equal(calls.impl[0].spec.options.measure, 'RR', 'cross-sectional reports a ratio of prevalences');
  assert.equal(env.method.id, 'epi.mantelHaenszel');
  assert.equal(env.provenance.requestedMethod, 'epi.twoByTwo');
  const cc = runAnalysis(dataSpec('epi.twoByTwo', { design: 'case-control', cluster: { route: 'mh-within', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(cc.spec.options.measure, 'OR');
});

test('aggregate route hands the method one row per farm and counts the merged rows', () => {
  const base = deps().d;
  const { d, calls } = deps({
    clusterPanel: (...a) => { const p = base.clusterPanel(...a); return { ...p, routes: p.routes.map((r) => (r.id === 'aggregate' ? { ...r, enabled: true, reasonKey: null } : r)) }; },
  });
  const env = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'aggregate', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.deepEqual(calls.aggregate, ['c1']);
  assert.equal(calls.impl[0].n, 3);
  assert.deepEqual(env.provenance.rowsDropped.find((r) => r.reason === 'aggregated'), { reason: 'aggregated', column: 'c1', count: 5 });
});

test('a route the G1 panel greys out is no way around G1: stop, panel first, no p-value, method never runs', () => {
  const { d, calls } = deps();
  // The mock panel disables 'aggregate' (the factor is measured on the animal).
  const env = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'aggregate', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(env.status, 'stopped');
  assert.equal(calls.impl.length, 0);
  assert.equal(calls.aggregate.length, 0);
  const stop = env.guard.stops.find((s) => s.id === 'G1');
  assert.equal(stop.key, 'runtime.guard.routeUnavailable');
  assert.equal(stop.params.reasonKey, 'epi.guard.G1.aggregateAnimalLevel');
  assert.deepEqual(stop.routes, ['mh-within', 'deff']);
  assert.ok(env.clusterPanel && env.values.icc && env.values.deff && env.values.nEff);
  for (const t of env.tests) assert.equal(t.p, null);
  // 'deff' for a method that does not widen its own CI (the panel greys it out) stops the same way.
  const { d: d2, calls: c2 } = deps({ clusterPanel: () => ({ icc: value(0.05), deff: value(1.7), nEff: value(428), clusters: 3, meanSize: 3, routes: [{ id: 'deff', enabled: false, reasonKey: 'epi.route.deff.notForMethod' }] }) });
  const tt = runAnalysis(dataSpec('test.mannWhitney', { roles: { group: 'c2', y: 'c3' }, cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d2, now: NOW });
  assert.equal(tt.status, 'stopped');
  assert.equal(c2.impl.length, 0);
});

test('provenance: engine version, fingerprint, recipe rev, clock, exclusions counted by kind', () => {
  const { d } = deps();
  const env = runAnalysis(dataSpec('epi.twoByTwo', { cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d, now: NOW, steps });
  assert.equal(env.provenance.engineVersion, ENGINE_VERSION);
  assert.equal(env.provenance.engineTier, 'A');
  assert.equal(env.provenance.dataFingerprint, 'abcdef0123456789');
  assert.equal(env.provenance.recipeRev, 3);
  assert.equal(env.provenance.computedAt, '2026-09-27T12:00:00.000Z');
  assert.deepEqual(env.provenance.rowsDropped, [{ reason: 'excluded', column: null, count: 1 }, { reason: 'filter', column: null, count: 1 }]);
  assert.equal(env.provenance.rowsUsed, 8);
  assert.deepEqual(env.spec.options.measures, ['PR', 'POR', 'PD'], 'the design decides which 2x2 measures are reported');
});

test('G3: the design blocks a method before anything runs', () => {
  const { d, calls } = deps({ checkDesign: () => ({ allowed: false, reasonKey: 'epi.design.blocked.noRiskFromCaseControl', measures: null }) });
  const env = runAnalysis(dataSpec('epi.twoByTwo', { design: 'case-control', cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(env.status, 'stopped');
  assert.equal(env.guard.stops[0].id, 'G3');
  assert.equal(env.guard.stops[0].key, 'epi.design.blocked.noRiskFromCaseControl');
  assert.equal(calls.impl.length, 0);
});

test('invalid specs, failing methods and unshipped methods give an invalid envelope, never a number', () => {
  const { d } = deps();
  const bad = runAnalysis({ ...dataSpec('epi.twoByTwo'), options: { orCi: 'magic' } }, table(), codebook, { deps: d, now: NOW });
  assert.equal(bad.status, 'invalid');
  assert.ok(bad.issues.length > 0);
  const boom = runAnalysis(dataSpec('test.tTest', { cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(boom.status, 'invalid');
  assert.equal(boom.error.key, 'runtime.engine.methodFailed');
  assert.deepEqual(boom.values, {});
  const missing = runAnalysis(makeSpec('corr.pearson', { kind: 'counts', counts: { x: [1, 2], y: [2, 3] } }), null, null, { deps: d, now: NOW });
  assert.equal(missing.status, 'invalid');
  assert.equal(missing.error.key, 'runtime.engine.methodNotShipped');
});

test('auto choices the method settles are written back into the envelope with a note', () => {
  const { d } = deps();
  const env = runAnalysis(dataSpec('test.mannWhitney', { roles: { outcome: 'c3', group: 'c2' }, cluster: { route: 'deff', column: 'c1' } }), table(), codebook, { deps: d, now: NOW });
  assert.equal(env.spec.options.exact, 'normal');
  assert.equal(env.provenance.options.exact, 'normal');
  assert.ok(env.guard.notes.some((n) => n.key === 'runtime.note.autoResolved'));
});

test('sample size needs no design and no data, and G1 never applies to it', () => {
  const { d, calls } = deps({ checkDesign: () => { throw new Error('design must not be asked'); } });
  const env = runAnalysis(makeSpec('ss.proportion', { kind: 'params', params: { p: 0.5, d: 0.05 } }), null, null, { deps: d, now: NOW });
  assert.equal(env.status, 'ok');
  assert.equal(env.values.n.value, 385);
  assert.equal(calls.impl[0].method, 'ss.proportion');
});

test('helpers: activeTable, exclusionCounts, g1Applies, roleColumns', () => {
  const t = table();
  const a = activeTable(t);
  assert.equal(a.n, 8);
  assert.deepEqual(a.rowIds, ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8']);
  assert.ok(a.columns.c1.values instanceof Int32Array);
  assert.equal(a.columns.c1.values.length, 8);
  assert.equal(t.columns.c1.values.length, 10, 'the input table is not changed');
  assert.deepEqual(exclusionCounts(t, []), [{ reason: 'excluded', column: null, count: 2 }]);
  const single = { ...a, columns: { ...a.columns, c1: { ...a.columns.c1, values: Int32Array.from([0, 1, 2, 3, 4, 5, 6, 7]) } } };
  assert.equal(g1Applies(dataSpec('epi.twoByTwo'), single), false, 'no repeat, no stop');
  assert.equal(g1Applies(dataSpec('epi.twoByTwo'), a), true);
  assert.equal(g1Applies(dataSpec('desc.summary'), a), false);
  assert.deepEqual(roleColumns({ roles: { exposure: 'c2', outcome: 'c3', cluster: 'c1', covariates: ['c4', 'c2'] } }), ['c2', 'c3', 'c4']);
});
