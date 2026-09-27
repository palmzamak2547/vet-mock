// AnalysisSpec normalisation and validation (M1-DESIGN.md 10.1). OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSpec, validateSpec, makeSpec, DEFAULT_OPTIONS, ALLOWED, METHOD_IDS } from '../../src/lib/runtime/spec.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';

const base = (method, input = { kind: 'counts', counts: { table: [[1, 2], [3, 4]] } }) => ({ specVersion: 1, method, input, design: null, roles: {}, levels: {}, options: {}, cluster: { route: null, column: null } });

test('every M1 catalogue method has defaults and allowed values, and nothing else does', () => {
  const m1 = METHODS.filter((m) => m.milestone === 'M1').map((m) => m.id).sort();
  assert.deepEqual([...METHOD_IDS].sort(), m1);
  for (const id of METHOD_IDS) {
    assert.ok(ALLOWED[id], `no allowed values for ${id}`);
    for (const k of Object.keys(DEFAULT_OPTIONS[id])) assert.ok(ALLOWED[id][k], `${id}.${k} has a default but no allowed list`);
  }
});

test('normalizeSpec writes every option in and never mutates its argument', () => {
  for (const id of METHOD_IDS) {
    const raw = base(id);
    const frozen = JSON.stringify(raw);
    const s = normalizeSpec(raw, null);
    assert.equal(JSON.stringify(raw), frozen);
    assert.equal(s.options.confLevel, 0.95);
    assert.equal(s.options.alternative, 'two.sided');
    for (const [k, v] of Object.entries(DEFAULT_OPTIONS[id])) assert.deepEqual(s.options[k], v, `${id}.${k}`);
    const r = validateSpec(s);
    assert.ok(r.ok, `${id}: ${JSON.stringify(r.issues)}`);
  }
});

test('typed options win over defaults', () => {
  const s = normalizeSpec({ ...base('test.tTest'), options: { variant: 'pooled', confLevel: 0.9 } }, null);
  assert.equal(s.options.variant, 'pooled');
  assert.equal(s.options.confLevel, 0.9);
  assert.equal(s.options.mu, 0);
});

test('validateSpec rejects unknown methods, unknown options, values outside the lists and extra fields', () => {
  assert.deepEqual(validateSpec({ ...base('test.tTest'), method: 'test.magic' }).issues, [{ path: 'method', key: 'runtime.spec.unknownMethod' }]);
  assert.equal(validateSpec({ ...base('test.tTest'), options: { variant: 'student' } }).issues[0].path, 'options.variant');
  assert.equal(validateSpec({ ...base('test.tTest'), options: { tails: 1 } }).issues[0].key, 'runtime.spec.unknownField');
  assert.equal(validateSpec({ ...base('test.tTest'), options: { confLevel: 1.2 } }).ok, false);
  assert.equal(validateSpec({ ...base('test.tTest'), extra: true }).ok, false);
  assert.equal(validateSpec({ ...base('test.tTest'), roles: { outcome: 'c1', color: 'c2' } }).ok, false);
  assert.equal(validateSpec(null).ok, false);
});

test('a farm route needs a farm column', () => {
  const s = normalizeSpec({ ...base('epi.twoByTwo', { kind: 'dataset', datasetId: 'd', recipeRev: 0 }), cluster: { route: 'deff', column: null } }, { columns: [], unitOfAnalysis: 'animal', clusterKey: null });
  assert.deepEqual(validateSpec(s).issues, [{ path: 'cluster.column', key: 'runtime.spec.clusterColumnMissing' }]);
  const withFarm = normalizeSpec(s, { columns: [], unitOfAnalysis: 'animal', clusterKey: 'c2' });
  assert.equal(withFarm.cluster.column, 'c2');
  assert.ok(validateSpec(withFarm).ok);
});

test('counts may be nested (strata of 2x2 tables)', () => {
  const s = makeSpec('epi.mantelHaenszel', { kind: 'counts', counts: { strata: [[[10, 20], [5, 25]], [[8, 12], [6, 24]]] } });
  assert.ok(validateSpec(s).ok);
});

test('Table 1 summaries come from the codebook type and skip ids, text, PII and the farm column', () => {
  const codebook = {
    unitOfAnalysis: 'animal',
    clusterKey: 'c1',
    columns: [
      { key: 'c1', type: 'id', role: 'cluster' },
      { key: 'c2', type: 'continuous', role: 'none' },
      { key: 'c3', type: 'binary', role: 'outcome' },
      { key: 'c4', type: 'text', role: 'none' },
      { key: 'c5', type: 'nominal', role: 'none', pii: 'name', hidden: true },
      { key: 'c6', type: 'ordinal', role: 'none' },
    ],
  };
  const s = normalizeSpec({ ...base('desc.table1', { kind: 'dataset', datasetId: 'd', recipeRev: 0 }), options: { summaries: { c2: 'mean-sd' } } }, codebook);
  assert.deepEqual(s.options.summaries, { c2: 'mean-sd', c3: 'n-percent', c6: 'n-percent' });
});

test('parameters may be flat lists (adjust.pValues) and a dataset may name an animal-time column', () => {
  const adj = validateSpec(makeSpec('adjust.pValues', { kind: 'params', params: { p: [0.01, 0.04, null], labels: ['a', 'b', 'c'] } }));
  assert.equal(adj.ok, true, JSON.stringify(adj.issues));
  const nested = validateSpec({ ...makeSpec('adjust.pValues', { kind: 'params', params: { p: [0.01] } }), input: { kind: 'params', params: { p: [[0.01]] } } });
  assert.equal(nested.ok, false, 'lists of lists are counts, not parameters');
  const rate = validateSpec(makeSpec('freq.incidenceRate', { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'cohort', roles: { outcome: 'c3', time: 'c9' }, levels: { outcomePositive: 'yes' } }));
  assert.equal(rate.ok, true, JSON.stringify(rate.issues));
});
