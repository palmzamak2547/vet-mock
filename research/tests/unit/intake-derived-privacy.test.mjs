import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRecipe, makeStep } from '../../src/lib/intake/recipe.js';
import { proposeCodebook } from '../../src/lib/intake/codebook.js';
import { analysedCsv } from '../../src/lib/export/analysed-data.js';

const raw = { header: ['private number', 'public weight'], columns: [['987654321', '876543210'], ['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2 };
function codebook() {
  const cb = proposeCodebook(raw);
  for (const c of cb.columns) c.type = 'continuous';
  cb.columns[0].hidden = true;
  return cb;
}

test('a saved hidden computed column stays hidden through replay and analysed CSV export', () => {
  const cb = codebook();
  const steps = [makeStep([], 'compute', { target: 'd1', expression: '{c2} * 2', type: 'continuous' })];
  cb.columns.push({ ...cb.columns[1], key: 'd1', name: 'private derived value', hidden: true });
  const table = applyRecipe(raw, cb, steps);
  assert.deepEqual(Array.from(table.columns.d1.values), [20, 40], 'hidden values remain available on device');
  const exported = analysedCsv(table, table.codebook);
  assert.deepEqual(exported.columns.map((c) => c.key), ['c2']);
  assert.equal(exported.csv.includes('private derived value'), false);
});

test('a computed copy of a hidden column inherits its privacy across chained steps', () => {
  const cb = codebook();
  const first = makeStep([], 'compute', { target: 'd1', expression: '{c1}', type: 'continuous' });
  const second = makeStep([first], 'compute', { target: 'd2', expression: '{d1} + 0', type: 'continuous' });
  const table = applyRecipe(raw, cb, [first, second]);
  assert.deepEqual(Array.from(table.columns.d2.values), [987654321, 876543210]);
  assert.deepEqual(analysedCsv(table, table.codebook).columns.map((c) => c.key), ['c2']);
});

test('a saved hidden bin stays hidden while ordinary public derived columns remain exportable', () => {
  const cb = codebook();
  const bin = makeStep([], 'bin', { column: 'c2', target: 'd1', cutpoints: [15], closed: 'left', labels: ['small', 'large'], cutSource: 'typed' });
  const compute = makeStep([bin], 'compute', { target: 'd2', expression: '{c2} * 2', type: 'continuous' });
  cb.columns.push({ ...cb.columns[1], key: 'd1', name: 'hidden bin', hidden: true });
  const table = applyRecipe(raw, cb, [bin, compute]);
  assert.deepEqual(analysedCsv(table, table.codebook).columns.map((c) => c.key), ['c2', 'd2']);
});

test('aggregate cannot expose a hidden minimum through a default-visible saved target', () => {
  const cb = codebook();
  cb.columns.push({ ...cb.columns[1], key: 'd1', name: 'minimum', hidden: false });
  const step = makeStep([], 'aggregate', { by: 'c2', summaries: [{ column: 'c1', fn: 'min', target: 'd1' }] });
  const table = applyRecipe(raw, cb, [step]);
  assert.deepEqual(Array.from(table.columns.d1.values), [987654321, 876543210]);
  assert.deepEqual(analysedCsv(table, table.codebook).columns.map((c) => c.key), ['c2']);
});

test('reshape-long protects a combined measure when any input column is hidden', () => {
  const wide = { header: ['id', 'public', 'private'], columns: [['A', 'B'], ['10', '20'], ['987654321', '876543210']], rowIds: ['r1', 'r2'], rowCount: 2 };
  const cb = proposeCodebook(wide);
  cb.columns[0].type = 'id';
  cb.columns[1].type = cb.columns[2].type = 'continuous';
  cb.columns[2].hidden = true;
  cb.columns.push({ ...cb.columns[1], key: 'd1', name: 'combined', hidden: false });
  const step = makeStep([], 'reshape-long', { idColumns: ['c1'], stubs: [{ target: 'd1', columns: ['c2', 'c3'] }], timeTarget: 'd2', times: ['first', 'second'] });
  const table = applyRecipe(wide, cb, [step]);
  assert.deepEqual(Array.from(table.columns.d1.values), [10, 987654321, 20, 876543210]);
  const exported = analysedCsv(table, table.codebook);
  assert.deepEqual(exported.columns.map((c) => c.key), ['c1', 'd2']);
  assert.equal(exported.csv.includes('987654321'), false);
});
