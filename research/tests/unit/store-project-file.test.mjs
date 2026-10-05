// Project file export and import (M1-DESIGN.md 9.4): round trip with new ids, Infinity survives,
// untrusted files are size-capped and fully validated before anything is written. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDb } from '../../src/lib/store/db.js';
import { createProject, getProject, listProjects } from '../../src/lib/store/projects.js';
import { putDataset, listDatasets, getDataset } from '../../src/lib/store/datasets.js';
import { putAnalysis, listAnalyses } from '../../src/lib/store/analyses.js';
import { listLog } from '../../src/lib/store/log.js';
import { exportProjectFile, parseProjectFile, importProjectFile, projectFileName, PROJECT_FILE_MAX_BYTES, PROJECT_FILE_VERSION } from '../../src/lib/store/project-file.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';

const A = 'u.11111111-1111-4111-8111-111111111111';
const bigSpace = async () => ({ usage: 0, quota: 1e12 });
const raw = {
  header: ['farm', 'result', 'phone'],
  columns: [['F1', 'F1', 'F2'], ['pos', 'neg', 'pos'], ['0001', '0002', '0003']],
  rowIds: ['r1', 'r2', 'r3'],
  rowCount: 3,
  source: { fileName: 'x.csv', bytes: 10, sha256: 'aa', encoding: 'windows-874', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-27T00:00:00Z' },
};
const codebook = { unitOfAnalysis: 'animal', clusterKey: 'c1', columns: [{ key: 'c1', name: 'farm', type: 'id' }, { key: 'c2', name: 'result', type: 'binary' }, { key: 'c3', name: 'phone', type: 'text', pii: 'phone', hidden: true }] };

async function seeded() {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'ความชุก / ELISA', design: 'cross-sectional' });
  const d = await putDataset(db, A, p.id, { raw, codebook, steps: [{ id: 's1', seq: 1, kind: 'import-conversions', params: { encoding: 'windows-874', perColumn: {} }, reason: null, at: 'x' }] }, { estimate: bigSpace });
  const spec = makeSpec('test.fisher2x2', { kind: 'dataset', datasetId: d.id, recipeRev: 1 }, { design: 'cross-sectional' });
  await putAnalysis(db, A, { projectId: p.id, spec, envelope: { envelopeVersion: 1, status: 'ok', spec, values: { OR: { value: Infinity, ci: [1.449, Infinity] } }, tests: [], provenance: { dataFingerprint: 'ff' } } });
  return { db, p, d };
}

const asFile = (text) => ({ size: text.length, text: async () => text });

test('file names carry the project name and the date, without characters that break file systems', () => {
  assert.equal(projectFileName('ความชุก / ELISA: รอบ 1', new Date(2026, 8, 27)), 'ความชุก ELISA รอบ 1-2026-09-27.vmresearch.json');
});

test('export then import gives a new project with new ids and the same content', async () => {
  const { db, p, d } = await seeded();
  const now = new Date('2026-09-27T10:00:00Z');
  const blob = await exportProjectFile(db, A, p.id, now);
  assert.ok(blob.name.endsWith('-2026-09-27.vmresearch.json'));
  const text = await blob.text();
  assert.ok(text.includes('"Infinity"'), 'an open upper bound is written as a string');
  assert.ok(text.includes('0003'), 'hidden PII columns travel in the student’s own backup');
  assert.equal((await getProject(db, A, p.id)).lastExportAt, now.toISOString());
  assert.equal((await listLog(db, A, p.id)).at(-1).kind, 'download');

  const parsed = await parseProjectFile(asFile(text));
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.preview, { name: 'ความชุก / ELISA', datasets: 1, rows: 3, analyses: 1, exportedAt: now.toISOString() });

  const copy = await importProjectFile(db, A, parsed.data, { estimate: bigSpace });
  assert.notEqual(copy.id, p.id);
  assert.equal((await listProjects(db, A)).length, 2);
  const [nd] = await listDatasets(db, A, copy.id);
  assert.notEqual(nd.id, d.id);
  assert.deepEqual((await getDataset(db, A, nd.id)).raw.columns, raw.columns);
  const [na] = await listAnalyses(db, A, copy.id);
  assert.equal(na.spec.input.datasetId, nd.id, 'the analysis points at the new dataset');
  assert.equal(na.envelope.values.OR.ci[1], Infinity);
  const log = await listLog(db, A, copy.id);
  assert.equal(log.at(-1).kind, 'project-import');
  assert.deepEqual(log.map((e) => e.seq), log.map((_e, i) => i + 1));
});

test('untrusted files: too big, not JSON, wrong format, newer version, tampered', async () => {
  const { db, p } = await seeded();
  const text = await (await exportProjectFile(db, A, p.id)).text();
  assert.deepEqual(await parseProjectFile({ size: PROJECT_FILE_MAX_BYTES + 1, text: async () => '' }), { ok: false, key: 'runtime.projectFile.tooBig' });
  assert.deepEqual(await parseProjectFile(asFile('{not json')), { ok: false, key: 'runtime.projectFile.notJson' });
  assert.deepEqual(await parseProjectFile(asFile('{"format":"other"}')), { ok: false, key: 'runtime.projectFile.wrongFormat' });
  const obj = JSON.parse(text);
  assert.deepEqual(await parseProjectFile(asFile(JSON.stringify({ ...obj, version: PROJECT_FILE_VERSION + 1 }))), { ok: false, key: 'runtime.projectFile.newerVersion' });
  const short = structuredClone(obj);
  short.datasets[0].columns[1].pop();
  assert.equal((await parseProjectFile(asFile(JSON.stringify(short)))).key, 'runtime.projectFile.invalid');
  const extra = { ...obj, script: '<script>' };
  assert.equal((await parseProjectFile(asFile(JSON.stringify(extra)))).key, 'runtime.projectFile.invalid');
  const badSpec = structuredClone(obj);
  badSpec.analyses[0].spec.options.orCi = 'magic';
  assert.equal((await parseProjectFile(asFile(JSON.stringify(badSpec)))).key, 'runtime.projectFile.invalid');
  const leak = structuredClone(obj);
  leak.log[0].egress = 'server';
  assert.equal((await parseProjectFile(asFile(JSON.stringify(leak)))).key, 'runtime.projectFile.invalid');
});

test('import checks the storage estimate before writing', async () => {
  const { db, p } = await seeded();
  const parsed = await parseProjectFile(asFile(await (await exportProjectFile(db, A, p.id)).text()));
  const before = (await listProjects(db, A)).length;
  await assert.rejects(importProjectFile(db, A, parsed.data, { estimate: async () => ({ usage: 999, quota: 1000 }) }), (e) => e.key === 'runtime.store.notEnoughSpace');
  assert.equal((await listProjects(db, A)).length, before);
});

test('a backup preserves literal Infinity text alongside infinite result bounds', async () => {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'Infinity' });
  const textRaw = { ...raw, header: ['Infinity', 'result', 'phone'], columns: [['Infinity', '-Infinity', 'F2'], ...raw.columns.slice(1)] };
  const cb = structuredClone(codebook);
  cb.columns[0].name = 'Infinity';
  const d = await putDataset(db, A, p.id, { raw: textRaw, codebook: cb, steps: [] }, { estimate: bigSpace });
  const spec = makeSpec('test.fisher2x2', { kind: 'dataset', datasetId: d.id, recipeRev: 0 });
  const envelope = { envelopeVersion: 1, status: 'ok', spec, values: { OR: { value: Infinity, ci: [-Infinity, Infinity] } }, tables: [{ id: 'labels', columns: ['group', 'estimate'], rows: [['Infinity', Infinity], ['-Infinity', -Infinity]] }] };
  await putAnalysis(db, A, { projectId: p.id, spec, envelope });
  const parsed = await parseProjectFile(await exportProjectFile(db, A, p.id));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.project.name, 'Infinity');
  assert.deepEqual(parsed.data.datasets[0].columns, textRaw.columns);
  assert.deepEqual(parsed.data.datasets[0].header, textRaw.header);
  assert.deepEqual(parsed.data.analyses[0].envelope, envelope);
  const copy = await importProjectFile(db, A, parsed.data, { estimate: bigSpace });
  assert.deepEqual((await getDataset(db, A, copy.datasetIds[0])).raw.columns, textRaw.columns);
});

test('legacy version 1 backups restore numeric bounds without interpreting raw text', async () => {
  const { db, p } = await seeded();
  const legacy = JSON.parse(await (await exportProjectFile(db, A, p.id)).text());
  legacy.version = 1;
  legacy.analyses[0].envelope.values.OR = { value: 'Infinity', ci: [1.449, 'Infinity'] };
  legacy.datasets[0].columns[0][0] = 'Infinity';
  const parsed = await parseProjectFile(asFile(JSON.stringify(legacy)));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.datasets[0].columns[0][0], 'Infinity');
  assert.equal(parsed.data.analyses[0].envelope.values.OR.ci[1], Infinity);
});
