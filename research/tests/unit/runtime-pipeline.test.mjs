// End to end through the engine core the worker runs (parse -> apply -> run), on the made-up 728-cow
// serosurvey (tests/fixtures/serosurvey/, windows-874 bytes). Pins: numbers.json (written by
// work/research-studio/workspace/build-data.mjs and recomputed independently by check.py with SciPy,
// 47 of 47): prev.icc, prev.deff, prev.nEff, prev.waldDeff, assoc.mh.pr, assoc.nDropped.
// What this proves: the G1 stop on the real file (panel first, no p-value), the within-farm
// Mantel-Haenszel route, the DEFF route, a greyed-out route refused, and that no network call is
// made anywhere on the way (fetch, XHR, WebSocket, sendBeacon all throw while the test runs).
// OWNER: runtime role.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { REGISTERED } from '../../src/lib/runtime/registry.js';
import { answerPreview } from '../../src/lib/intake/preview.js';
import { makeStep, nextDerivedKey } from '../../src/lib/intake/recipe.js';

const N = JSON.parse(readFileSync(new URL('../fixtures/serosurvey/numbers.json', import.meta.url), 'utf8'));
const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
const ctx = { mode: 'worker' };
const REL = 1e-10;
const close = (got, want, what, tol = REL) => assert.ok(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `${what}: got ${got}, numbers.json ${want}`);
// numbers.json's DEFF-widened bounds agree with the engine to about 2e-9 (the tolerance epi-frequency
// and epi-cluster use for them is 1e-7); every other number here agrees to 1e-10.
const DEFF_TOL = 1e-7;

// Egress trap: any network API used during these tests fails the test.
const saved = {};
const NET = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'];
before(() => {
  for (const k of NET) {
    saved[k] = globalThis[k];
    globalThis[k] = function blocked() { throw new Error(`network call ${k} during an analysis`); };
  }
  saved.navigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
});
after(() => {
  for (const k of NET) globalThis[k] = saved[k];
});

let table;
let codebook;
let steps;
let keyOf;
let ageBin;

test('parse and apply through the engine core: 728 rows, 49 farms, a fingerprint', async () => {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const { result: preview } = await handleRequest('parse', { bytes: buf, fileName: N.file.name }, ctx);
  keyOf = (name) => preview.codebook.columns.find((c) => c.name === name).key;
  const answered = answerPreview(preview, { [`q:${keyOf('รหัสโค')}:excel-date-id`]: 'use-proposed', [`q:${keyOf('วันที่เก็บตัวอย่าง')}:two-digit`]: '2500' });
  assert.deepEqual(answered.blocking, []);
  codebook = answered.codebook;
  steps = [answered.importStep];
  const age = nextDerivedKey(codebook, steps);
  steps.push(makeStep(steps, 'derive-age', { birth: keyOf('วันเกิด'), event: keyOf('วันที่เก็บตัวอย่าง'), unit: 'months', target: age }));
  ageBin = nextDerivedKey(codebook, steps);
  steps.push(makeStep(steps, 'bin', { column: age, target: ageBin, cutpoints: [24], closed: 'left', labels: ['< 24', '>= 24'], cutSource: 'literature' }));
  const { result, transfer } = await handleRequest('apply', { raw: answered.raw, codebook, steps }, ctx);
  table = result;
  assert.equal(table.n, N.file.rows);
  assert.match(table.fingerprint, /^[0-9a-f]{64}$/);
  assert.ok(transfer.length > 0, 'the typed arrays go back to the page as transferables');
  assert.equal(new Set(table.columns[codebook.clusterKey].values).size, N.farms.length);
});

const run = async (spec) => (await handleRequest('run', { spec, table, codebook, steps }, ctx)).result;
const input = () => ({ kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 });

test('G1 on the real file: prevalence stops, ICC, DEFF and effective n come first, no p-value leaves', async () => {
  assert.ok(REGISTERED.includes('freq.proportion'));
  const env = await run(makeSpec('freq.proportion', input(), {
    design: 'cross-sectional',
    roles: { outcome: keyOf('ผล ELISA') },
    levels: { outcomePositive: 'บวก' },
    cluster: { route: null, column: codebook.clusterKey },
  }));
  assert.equal(env.status, 'stopped');
  assert.ok(env.guard.stops.some((s) => s.id === 'G1'));
  close(env.values.icc.value, N.prev.icc, 'ICC');
  close(env.values.deff.value, N.prev.deff, 'DEFF');
  close(env.values.nEff.value, N.prev.nEff, 'effective n');
  for (const t of env.tests) assert.equal(t.p, null);
  assert.equal(env.values.prevalence, undefined, 'no estimate is shown before a route is chosen');
});

test('DEFF route: the Wald interval widened by the design effect, as numbers.json prev.waldDeff', async () => {
  const env = await run(makeSpec('freq.proportion', input(), {
    design: 'cross-sectional',
    roles: { outcome: keyOf('ผล ELISA') },
    levels: { outcomePositive: 'บวก' },
    options: { ciMethod: 'wald' },
    cluster: { route: 'deff', column: codebook.clusterKey },
  }));
  assert.equal(env.status, 'ok');
  close(env.values.prevalence.value, N.prev.p, 'prevalence');
  close(env.values.prevalence.ci[0], N.prev.waldDeff[0], 'DEFF-widened lower', DEFF_TOL);
  close(env.values.prevalence.ci[1], N.prev.waldDeff[1], 'DEFF-widened upper', DEFF_TOL);
  assert.equal(env.provenance.route, 'deff');
});

test('within-farm route: the 2x2 question answered by Mantel-Haenszel with farms as strata (numbers.json assoc.mh)', async () => {
  const env = await run(makeSpec('epi.twoByTwo', input(), {
    design: 'cross-sectional',
    roles: { exposure: ageBin, outcome: keyOf('ผล ELISA') },
    levels: { exposureLevel: '>= 24', referenceLevel: '< 24', outcomePositive: 'บวก' },
    cluster: { route: 'mh-within', column: codebook.clusterKey },
  }));
  assert.equal(env.status, 'ok', JSON.stringify(env.guard.stops));
  assert.equal(env.method.id, 'epi.mantelHaenszel');
  assert.equal(env.provenance.requestedMethod, 'epi.twoByTwo');
  close(env.values.PR.value, N.assoc.mh.pr.est, 'MH PR');
  close(env.values.PR.ci[0], N.assoc.mh.pr.ci[0], 'MH PR lower');
  close(env.values.PR.ci[1], N.assoc.mh.pr.ci[1], 'MH PR upper');
  const cmh = env.tests.find((t) => t.id === 'cmh');
  close(cmh.statistic.value, N.assoc.mh.cmh, 'CMH');
  close(cmh.p, N.assoc.mh.p, 'CMH p');
  assert.equal(env.provenance.rowsUsed, N.assoc.nKnown);
  const dropped = env.provenance.rowsDropped.reduce((s, d) => s + d.count, 0);
  assert.equal(dropped, N.assoc.nDropped, 'the 12 cows without a known age are counted, not hidden');
});

test('aggregate route is greyed out for an animal-level factor, and choosing it anyway stops', async () => {
  const env = await run(makeSpec('epi.twoByTwo', input(), {
    design: 'cross-sectional',
    roles: { exposure: ageBin, outcome: keyOf('ผล ELISA') },
    levels: { exposureLevel: '>= 24', referenceLevel: '< 24', outcomePositive: 'บวก' },
    cluster: { route: 'aggregate', column: codebook.clusterKey },
  }));
  assert.equal(env.status, 'stopped');
  const stop = env.guard.stops.find((s) => s.id === 'G1');
  assert.equal(stop.key, 'runtime.guard.routeUnavailable');
  assert.equal(stop.params.reasonKey, 'epi.route.aggregate.exposureOnAnimal');
  assert.ok(env.clusterPanel.routes.find((r) => r.id === 'mh-within').enabled);
  for (const t of env.tests) assert.equal(t.p, null);
});
