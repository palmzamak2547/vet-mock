// Randomisation lists and samples equal the golden lists that an independent Python implementation
// (tests/fixtures/plan/golden.py, its own PCG32) wrote into golden.json, and they reach the student
// through the engine with the seed, stream and settings in the envelope [M2-DESIGN.md 7].
// OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runRandomisation } from '../../src/lib/plan/randomise.js';
import { runSampling } from '../../src/lib/plan/sampling.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';

const golden = JSON.parse(readFileSync(new URL('../fixtures/plan/golden.json', import.meta.url), 'utf8'));
assert.equal(golden._fixture.family, 'python-golden');

/** Spec params for one golden randomisation case (strata travel as two flat lists). */
export function randParams(c) {
  const stratified = c.scheme === 'stratified-block';
  return {
    params: {
      arms: c.arms,
      ratio: c.ratio,
      seed: c.seed,
      stream: c.stream,
      ...(stratified ? { strata: c.strata.map((s) => s[0]), strataN: c.strata.map((s) => s[1]) } : { n: c.strata[0][1] }),
    },
    options: { scheme: c.scheme, blockSizes: c.blockSizes.length ? c.blockSizes : [4], blinding: c.blinding },
  };
}

/** A WorkingTable holding a golden frame: one row per unit, the stratum as a category column. */
export function frameTable(c) {
  const rowIds = c.frame.map((f) => f[0]);
  const levels = c.levels;
  const values = new Int32Array(rowIds.length);
  const missing = new Uint8Array(rowIds.length);
  c.frame.forEach((f, i) => {
    if (f[1] === null) { values[i] = -1; missing[i] = 1; } else values[i] = levels.indexOf(f[1]);
  });
  return { rowIds, n: rowIds.length, recipeRev: 1, excluded: {}, fingerprint: 'f'.repeat(64), columns: { c1: { key: 'c1', kind: 'category', levels, values, missing } } };
}

for (const c of golden.randomisation) {
  test(`randomisation ${c.id} equals the Python list`, () => {
    const { params, options } = randParams(c);
    const out = runRandomisation({ input: { kind: 'params', params }, options }, null);
    assert.equal(out.status, 'ok');
    const list = out.tables.find((t) => t.id === 'list');
    assert.deepEqual(list.rows, c.expected.list);
    const cut = (out.notes || []).map((n) => ({ stratum: n.params.stratum === '' ? null : n.params.stratum, size: n.params.size, taken: n.params.taken }));
    assert.deepEqual(cut, c.expected.cut);
    assert.equal(out.values.seed.value, c.seed);
    assert.equal(out.values.stream.value, c.stream);
  });
}

for (const c of golden.sampling) {
  test(`sampling ${c.id} equals the Python sample`, () => {
    const table = frameTable(c);
    const spec = { roles: c.scheme === 'stratified' ? { strata: 'c1' } : {}, options: { scheme: c.scheme, allocation: c.allocation, size: c.size, seed: c.seed, stream: c.stream } };
    const out = runSampling(spec, table);
    assert.equal(out.status, 'ok');
    assert.deepEqual(out.tables.find((t) => t.id === 'selected').rows, c.expected.selected);
    if (c.expected.allocation) assert.deepEqual(out.tables.find((t) => t.id === 'strata').rows.map((r) => r[2]), c.expected.allocation);
  });
}

test('through the engine: the envelope carries the list, the seed and the settings', () => {
  const c = golden.randomisation[0];
  const { params, options } = randParams(c);
  const spec = makeSpec('design.randomisation', { kind: 'params', params }, { options });
  const env = runAnalysis(spec, null, null, { now: () => new Date('2026-09-28T00:00:00Z') });
  assert.equal(env.status, 'ok', JSON.stringify(env.issues || env.error || env.guard));
  assert.deepEqual(env.tables.find((t) => t.id === 'list').rows, c.expected.list);
  assert.equal(env.spec.input.params.seed, 42);
  assert.equal(env.provenance.options.scheme, 'block');
  assert.deepEqual(env.provenance.options.blockSizes, [4]);
});

test('through the engine: a sample from a dataset, size and seed in the options', () => {
  const c = golden.sampling[2];
  const table = frameTable(c);
  const codebook = { unitOfAnalysis: 'farm', clusterKey: null, columns: [{ key: 'c1', name: 'zone', labelTh: 'zone', labelEn: 'zone', type: 'nominal', role: 'none', level: 'farm', unit: null, levels: c.levels.map((v) => ({ value: v, labelTh: v, labelEn: v })), reference: null, positive: null, missingCodes: [], range: null, pii: null, hidden: false }] };
  const spec = makeSpec('design.sampling', { kind: 'dataset', datasetId: 'x', recipeRev: 1 }, { roles: { strata: 'c1' }, options: { scheme: 'stratified', allocation: 'proportional', size: c.size, seed: c.seed } });
  const env = runAnalysis(spec, table, codebook, { now: () => new Date('2026-09-28T00:00:00Z') });
  assert.equal(env.status, 'ok', JSON.stringify(env.issues || env.error || env.guard));
  assert.deepEqual(env.tables.find((t) => t.id === 'selected').rows, c.expected.selected);
  assert.equal(env.provenance.options.stream, 54, 'the default stream is written into the options');
  assert.deepEqual(env.provenance.rowsDropped.filter((d) => d.reason === 'missing'), [{ reason: 'missing', column: 'c1', count: 2 }]);
});
