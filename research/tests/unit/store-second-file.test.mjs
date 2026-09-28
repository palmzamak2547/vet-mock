// A second file in a project (M2-DESIGN.md 4.1, 4.7): its purpose is stored, it is logged as
// 'dataset-add', and a merge step that names it keeps pointing at it after a project-file round trip
// (every dataset gets a new id on import). OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDb } from '../../src/lib/store/db.js';
import { createProject } from '../../src/lib/store/projects.js';
import { putDataset, listDatasets, DATASET_PURPOSES } from '../../src/lib/store/datasets.js';
import { listLog, LOG_KINDS, appendLog } from '../../src/lib/store/log.js';
import { exportProjectFile, parseProjectFile, importProjectFile } from '../../src/lib/store/project-file.js';

const A = 'u.22222222-2222-4222-8222-222222222222';
const bigSpace = async () => ({ usage: 0, quota: 1e12 });
const rawOf = (header, columns) => ({
  header, columns, rowIds: columns[0].map((_, i) => `r${i + 1}`), rowCount: columns[0].length,
  source: { fileName: 'x.csv', bytes: 10, sha256: 'aa', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-28T00:00:00Z' },
});
const cb = (n) => ({ unitOfAnalysis: 'animal', clusterKey: null, columns: Array.from({ length: n }, (_, i) => ({ key: `c${i + 1}`, name: `v${i + 1}`, type: 'text' })) });
const asFile = (text) => ({ size: text.length, text: async () => text });

test('a second file keeps its purpose, is logged as dataset-add, and a merge step follows it through export and import', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'สองไฟล์', design: 'cross-sectional' });
  const animals = await putDataset(db, A, p.id, { raw: rawOf(['id', 'farm'], [['a1', 'a2'], ['F1', 'F2']]), codebook: cb(2), steps: [] }, { estimate: bigSpace });
  const farms = await putDataset(db, A, p.id, { raw: rawOf(['farm', 'herd'], [['F1', 'F2'], ['10', '20']]), codebook: cb(2), steps: [] }, { estimate: bigSpace, purpose: 'merge' });
  assert.equal(animals.purpose, 'main');
  assert.equal(farms.purpose, 'merge');
  const log = await listLog(db, A, p.id);
  assert.deepEqual(log.map((e) => e.kind), ['import', 'dataset-add']);
  assert.equal(log[1].detail.purpose, 'merge');
  await assert.rejects(() => putDataset(db, A, p.id, { raw: rawOf(['x'], [['1']]), codebook: cb(1), steps: [] }, { estimate: bigSpace, purpose: 'other' }), (e) => e.key === 'runtime.store.badTable');
  assert.deepEqual(DATASET_PURPOSES, ['main', 'merge', 'double-entry']);

  // the animal file's merge step names the farm file by id
  const mergeStep = { id: 's1', seq: 1, kind: 'merge', params: { sourceDatasetId: farms.id, leftKey: 'c2', rightKey: 'c1', columns: ['c2'] }, reason: null, at: 'x' };
  const blob = await exportProjectFile(db, A, p.id, new Date('2026-09-28T10:00:00Z'));
  const data = JSON.parse(await blob.text());
  assert.deepEqual(data.datasets.map((d) => d.purpose).sort(), ['main', 'merge']);
  // put the step into the exported file the way a saved recipe would carry it
  data.datasets.find((d) => d.purpose === 'main').steps = [mergeStep];
  const parsed = await parseProjectFile(asFile(JSON.stringify(data)));
  assert.equal(parsed.ok, true);
  const copy = await importProjectFile(db, A, parsed.data, { estimate: bigSpace });
  const ds = await listDatasets(db, A, copy.id);
  const main = ds.find((d) => d.purpose === 'main');
  const second = ds.find((d) => d.purpose === 'merge');
  assert.ok(main && second && second.id !== farms.id);
  assert.equal(main.steps[0].params.sourceDatasetId, second.id);
});

test('the M2 log kinds are accepted and carry counts, never cell values', async () => {
  for (const k of ['dataset-add', 'compare', 'randomise', 'sample']) assert.ok(LOG_KINDS.includes(k), k);
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'log', design: null });
  const e = await appendLog(db, A, p.id, { kind: 'compare', detail: { datasetA: 'x', datasetB: 'y', cellsCompared: 24, cellsDiffering: 3, values: ['24', '42'] } });
  assert.deepEqual(e.detail, { datasetA: 'x', datasetB: 'y', cellsCompared: 24, cellsDiffering: 3 });
  const r = await appendLog(db, A, p.id, { kind: 'randomise', detail: { seed: 42, stream: 54, algorithm: 'pcg32', units: 24 } });
  assert.equal(r.egress, 'none');
});
