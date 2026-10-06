import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { buildRScript } from '../../src/lib/export/rscript.js';
import { buildSps } from '../../src/lib/export/sps.js';
import { figureCandidates } from '../../src/workspace/lib/figure-model.js';
import { buildDraft } from '../../src/workspace/report/build.js';
import { formatNumber, formatP, formatCi } from '../../src/lib/stats/format.js';
import { tOf, sampleAnalyses, CODEBOOK } from './export-helpers.mjs';

const column = { key: 'c1', name: 'private_result', type: 'continuous', hidden: false, levels: [] };
const codebook = { unitOfAnalysis: 'animal', clusterKey: null, columns: [column] };
const spec = makeSpec('desc.summary', { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'descriptive', roles: { outcome: 'c1' } });
const analysis = { id: 'a1', spec, envelope: { envelopeVersion: 1, status: 'ok', method: { id: 'desc.summary' }, spec, values: { mean: { value: 987654, ci: [987653, 987655] } }, tables: [], tests: [], provenance: {} } };

test('hiding a kept analysis input removes its result numbers from R and SPSS downloads', () => {
  for (const build of [buildRScript, buildSps]) {
    const input = { analyses: [analysis], codebook, csvName: 'data.csv', lang: 'en', t: tOf('en') };
    assert.equal(build(input).includes('987654'), true, 'public result remains reproducible');
    const hidden = { ...codebook, columns: [{ ...column, hidden: true }] };
    assert.equal(build({ ...input, codebook: hidden }).includes('987654'), false);
  }
});

test('a hidden kept analysis cannot become a figure panel', () => {
  const table = { codebook, fingerprint: 'same', rowIds: ['r1'], n: 1, excluded: {}, columns: { c1: { kind: 'number', values: Float64Array.of(987654), missing: Uint8Array.of(0) } } };
  assert.ok(figureCandidates([analysis], table).length > 0, 'the public result has a chart');
  assert.deepEqual(figureCandidates([analysis], { ...table, codebook: { ...codebook, columns: [{ ...column, hidden: true }] } }), []);
});

test('the legacy report draft download uses the same hidden-input boundary', () => {
  const [kept] = sampleAnalyses();
  const hidden = { ...CODEBOOK, columns: CODEBOOK.columns.map((c) => c.key === 'c2' ? { ...c, hidden: true } : c) };
  const ctx = { t: tOf('en'), lang: 'en', fmt: { formatNumber, formatP, formatCi }, nameKeyOf: () => null, designNameKey: null, describeStep: () => '' };
  assert.deepEqual(buildDraft({ analyses: [kept], codebook: CODEBOOK, project: {}, steps: [] }, ctx).used, [kept.id]);
  const draft = buildDraft({ analyses: [kept], codebook: hidden, project: {}, steps: [] }, ctx);
  assert.deepEqual(draft.used, []);
  assert.equal(draft.results, '');
});
