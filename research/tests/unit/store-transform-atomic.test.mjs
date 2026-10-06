import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDb, StoreError } from '../../src/lib/store/db.js';
import { createProject, getProject } from '../../src/lib/store/projects.js';
import { putDataset, getDataset, saveRecipe } from '../../src/lib/store/datasets.js';
import { listLog } from '../../src/lib/store/log.js';
import { proposeCodebook } from '../../src/lib/intake/codebook.js';
import { applyRecipe, makeStep } from '../../src/lib/intake/recipe.js';

async function setup() {
  const db = createMemoryDb();
  const project = await createProject(db, 'guest', { name: 'made-up weights' });
  const raw = { header: ['weight'], columns: [['10', '20']], rowIds: ['r1', 'r2'], rowCount: 2, source: { fileName: 'weights.csv', bytes: 1, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: new Date().toISOString() } };
  const codebook = proposeCodebook(raw);
  codebook.columns[0].type = 'continuous';
  const meta = await putDataset(db, 'guest', project.id, { raw, codebook, steps: [] });
  const step = makeStep([], 'compute', { target: 'd1', expression: '{c1} * 2', type: 'continuous' });
  const entry = { ...codebook.columns[0], key: 'd1', name: 'twice weight', labelEn: 'Double weight', hidden: true };
  return { db, project, raw, meta, steps: [step], codebook: { ...codebook, columns: [...codebook.columns, entry] } };
}

test('a transformation and its named codebook columns commit together at one revision', async () => {
  const { db, project, meta, steps, codebook } = await setup();
  const before = await getProject(db, 'guest', project.id);
  const saved = await saveRecipe(db, 'guest', meta.id, steps, meta.rev, { codebook });
  const loaded = await getDataset(db, 'guest', meta.id);
  assert.deepEqual(loaded.meta.codebook, codebook);
  assert.deepEqual(loaded.meta.steps, steps);
  assert.equal(saved.rev, meta.rev + 1);
  assert.equal((await getProject(db, 'guest', project.id)).rev, before.rev + 1);
  const table = applyRecipe(loaded.raw, loaded.meta.codebook, loaded.meta.steps);
  assert.deepEqual(Array.from(table.columns.d1.values), [20, 40]);
  assert.equal(table.codebook.columns.find((c) => c.key === 'd1').name, 'twice weight');
});

test('a transaction failure rolls back transformation, codebook, project revision and log', async () => {
  const { db, project, meta, steps, codebook } = await setup();
  const before = await getProject(db, 'guest', project.id);
  const entries = await listLog(db, 'guest', project.id);
  const failing = { ...db, tx: (stores, mode, fn) => db.tx(stores, mode, (ops) => fn({ ...ops, put: async (store, record) => {
    if (store === 'log') throw new StoreError('quota', 'runtime.store.notEnoughSpace');
    return ops.put(store, record);
  } })) };
  await assert.rejects(saveRecipe(failing, 'guest', meta.id, steps, meta.rev, { codebook }), { code: 'quota' });
  assert.deepEqual((await getDataset(db, 'guest', meta.id)).meta, meta);
  assert.deepEqual(await getProject(db, 'guest', project.id), before);
  assert.deepEqual(await listLog(db, 'guest', project.id), entries);
});

test('two transformations from one revision cannot overwrite each other', async () => {
  const { db, meta, steps, codebook } = await setup();
  const outcomes = await Promise.allSettled([
    saveRecipe(db, 'guest', meta.id, steps, meta.rev, { codebook }),
    saveRecipe(db, 'guest', meta.id, [], meta.rev, { codebook: meta.codebook }),
  ]);
  assert.deepEqual(outcomes.map((x) => x.status), ['fulfilled', 'rejected']);
  assert.equal(outcomes[1].reason.code, 'conflict');
  const loaded = await getDataset(db, 'guest', meta.id);
  assert.deepEqual(loaded.meta.steps, steps);
  assert.deepEqual(loaded.meta.codebook, codebook);
});
