import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { makeStep } from '../../src/lib/intake/recipe.js';
import { proposeCodebook } from '../../src/lib/intake/codebook.js';
import { createMemoryDb } from '../../src/lib/store/db.js';
import { createProject } from '../../src/lib/store/projects.js';
import { putDataset, getDataset, saveCodebook } from '../../src/lib/store/datasets.js';
import { putAnalysis, listAnalyses, isStale } from '../../src/lib/store/analyses.js';
import { buildProjectFile, parseProjectFile, importProjectFile } from '../../src/lib/store/project-file.js';
import { isStale as resultIsStale } from '../../src/workspace/lib/result-model.js';
import { buildReportModel } from '../../src/lib/export/report-model.js';
import { buildHtml } from '../../src/lib/export/html.js';
import { tOf } from './export-helpers.mjs';

const context = { mode: 'main-thread' };
const apply = async (raw, codebook, steps = []) => (await handleRequest('apply', { raw, codebook, steps }, context)).result;

async function setup() {
  const db = createMemoryDb();
  const project = await createProject(db, 'guest', { name: 'made-up groups', design: 'cross-sectional' });
  const raw = { header: ['weight', 'group'], columns: [['10', '11', '13', '19', '21', '22'], ['A', 'A', 'A', 'B', 'B', 'B']], rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'], rowCount: 6, source: { fileName: 'groups.csv', bytes: 1, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: new Date().toISOString() } };
  const codebook = proposeCodebook(raw);
  codebook.columns[0].type = 'continuous';
  codebook.columns[1].type = 'nominal';
  codebook.columns[1].reference = 'A';
  const meta = await putDataset(db, 'guest', project.id, { raw, codebook, steps: [] });
  const first = await apply(raw, codebook);
  const spec = makeSpec('reg.ols', { kind: 'dataset', datasetId: meta.id, recipeRev: 0 }, { design: 'cross-sectional', roles: { outcome: 'c1', covariates: ['c2'] } });
  const envelope = (await handleRequest('run', { spec, table: first, codebook: first.codebook }, context)).result;
  assert.equal(envelope.status, 'ok');
  const saved = await putAnalysis(db, 'guest', { projectId: project.id, spec, envelope, frozen: true });
  return { db, project, raw, codebook, meta, first, saved, spec };
}

test('a reference-only recipe changes model interpretation without changing the canonical data hash', async () => {
  const { raw, codebook, first, saved, spec } = await setup();
  const reference = makeStep([], 'reference', { column: 'c2', level: 'B' });
  const changed = await apply(raw, codebook, [reference]);
  assert.equal(changed.fingerprint, first.fingerprint);
  const rerun = (await handleRequest('run', { spec, table: changed, codebook: changed.codebook }, context)).result;
  assert.equal(rerun.status, 'ok');
  assert.notDeepEqual(rerun.tables, saved.envelope.tables, 'the same cells now use the other reference group');
  for (const check of [isStale, resultIsStale]) {
    assert.equal(check(saved, first.fingerprint, first.codebookFingerprint), false);
    assert.equal(check(saved, changed.fingerprint, changed.codebookFingerprint), true);
  }
  const t = tOf('en');
  const model = buildReportModel({ project: { name: 'made-up', design: 'cross-sectional' }, dataset: { table: changed, codebook: changed.codebook, steps: [reference], rawRows: 6 }, analyses: [saved], lang: 'en', t });
  assert.match(buildHtml(model, { t }), /computed on an earlier|earlier version|older version/);
});

test('a codebook-only edit marks frozen results stale and unchanged backup/import stays current', async () => {
  const { db, project, meta, raw, codebook, first, saved } = await setup();
  const text = JSON.stringify(await buildProjectFile(db, 'guest', project.id));
  const parsed = await parseProjectFile(new Blob([text]));
  assert.equal(parsed.ok, true);
  const restored = await importProjectFile(db, 'guest', parsed.data);
  const ds = await getDataset(db, 'guest', restored.datasetIds[0]);
  const restoredTable = await apply(ds.raw, ds.meta.codebook, ds.meta.steps);
  const [restoredAnalysis] = await listAnalyses(db, 'guest', restored.id);
  assert.equal(isStale(restoredAnalysis, restoredTable.fingerprint, restoredTable.codebookFingerprint), false);
  const changedCodebook = structuredClone(codebook);
  changedCodebook.columns[1].reference = 'B';
  await saveCodebook(db, 'guest', meta.id, changedCodebook, meta.rev);
  const changed = await apply(raw, changedCodebook);
  assert.equal(changed.fingerprint, first.fingerprint);
  assert.equal(isStale(saved, changed.fingerprint, changed.codebookFingerprint), true);
});

test('legacy results without a codebook fingerprint retain their data-fingerprint check', () => {
  const legacy = { envelope: { provenance: { dataFingerprint: 'same' } } };
  assert.equal(resultIsStale(legacy, 'same', 'new-codebook-hash'), false);
  assert.equal(resultIsStale(legacy, 'different', 'new-codebook-hash'), true);
});
