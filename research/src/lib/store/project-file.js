// Project file export and import (valibot schema) [M1-DESIGN.md 9.4]. An imported file is untrusted:
// it is parsed, size-capped and validated completely, and the student sees exactly what will be
// added before anything is written. Import always creates a new project (never overwrites).
// OWNER: runtime role.
import * as v from 'valibot';
import { ownerKey, isOwner, newId, StoreError, BLOCK_ROWS, publicRecord } from './db.js';
import { getProject, saveProject, cleanName } from './projects.js';
import { listDatasets, getDataset, estimateRawBytes, checkSpace } from './datasets.js';
import { listAnalyses } from './analyses.js';
import { listLog, appendLogInTx, logKey, sanitizeDetail, LOG_KINDS } from './log.js';
import { validateSpec } from '../runtime/spec.js';
import { ENGINE_VERSION } from '../runtime/protocol.js';
import { reviveNumbers } from '../runtime/envelope.js';

export const PROJECT_FILE_FORMAT = 'vetmock-research-project';
export const PROJECT_FILE_VERSION = 2;
export const PROJECT_FILE_MAX_BYTES = 50 * 1024 * 1024;

const str = (max) => v.pipe(v.string(), v.maxLength(max));
const int = (min = 0) => v.pipe(v.number(), v.integer(), v.minValue(min));

/** A column key as the app makes them (c3, m1, w2, d4): a letter, then letters, digits or underscore. An
 * imported key is written into the SPSS syntax and the R script as a variable name, so anything else is
 * refused at import (review round 1). */
export const COLUMN_KEY_RE = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
const columnKey = v.pipe(v.string(), v.regex(COLUMN_KEY_RE));

const codebookEntry = v.looseObject({
  key: columnKey,
  name: str(500),
  type: str(32),
});
const codebookSchema = v.looseObject({
  columns: v.pipe(v.array(codebookEntry), v.maxLength(2000)),
  clusterKey: v.nullish(columnKey),
});
const stepSchema = v.looseObject({ id: str(64), seq: int(0), kind: str(40), params: v.record(v.string(), v.unknown()), reason: v.nullish(str(2000)) });
const datasetSchema = v.strictObject({
  id: str(64),
  source: v.looseObject({ fileName: str(500) }),
  header: v.pipe(v.array(str(500)), v.maxLength(2000)),
  rowIds: v.pipe(v.array(str(32)), v.maxLength(2000000)),
  rowCount: int(0),
  columns: v.pipe(v.array(v.array(v.string())), v.maxLength(2000)),
  codebook: codebookSchema,
  steps: v.pipe(v.array(stepSchema), v.maxLength(10000)),
  purpose: v.optional(v.picklist(['main', 'merge', 'double-entry'])),
});
const analysisSchema = v.strictObject({
  id: str(64),
  spec: v.unknown(),
  envelope: v.looseObject({ envelopeVersion: v.literal(1), status: v.picklist(['ok', 'stopped', 'invalid']) }),
  frozen: v.boolean(),
  frozenAt: v.nullish(str(40)),
  dataFingerprint: v.nullish(str(128)),
  createdAt: str(40),
});
const logSchema = v.strictObject({ seq: int(1), at: str(40), kind: v.picklist(LOG_KINDS), detail: v.record(v.string(), v.unknown()), egress: v.literal('none') });

export const PROJECT_FILE_SCHEMA = v.strictObject({
  format: v.literal(PROJECT_FILE_FORMAT),
  version: v.picklist([1, PROJECT_FILE_VERSION]),
  exportedAt: str(40),
  engineVersion: str(80),
  project: v.strictObject({ name: str(500), design: v.nullable(str(40)), createdAt: str(40), example: v.optional(v.nullable(str(40))) }),
  datasets: v.pipe(v.array(datasetSchema), v.maxLength(50)),
  analyses: v.pipe(v.array(analysisSchema), v.maxLength(5000)),
  log: v.pipe(v.array(logSchema), v.maxLength(100000)),
});

/** A merge step names another dataset by id; the imported project gives every dataset a new id. */
function remapSteps(steps, idMap) {
  return (steps || []).map((s) => (s.kind === 'merge' && s.params && idMap.has(s.params.sourceDatasetId) ? { ...s, params: { ...s.params, sourceDatasetId: idMap.get(s.params.sourceDatasetId) } } : s));
}

/** `<project name>-<YYYY-MM-DD>.vmresearch.json`, with characters that break file names removed. */
export function projectFileName(name, date = new Date()) {
  const safe = String(name || 'project').normalize('NFC').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'project';
  const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `${safe}-${d}.vmresearch.json`;
}

function jsonReplacer(_k, val) {
  if (typeof val === 'number') {
    if (val === Infinity) return { $number: 'Infinity' };
    if (val === -Infinity) return { $number: '-Infinity' };
    if (Number.isNaN(val)) return null;
  }
  if (ArrayBuffer.isView(val)) return Array.from(/** @type {any} */ (val));
  return val;
}

function jsonReviver(_k, val) {
  // Version 2 distinguishes numeric bounds from literal text, including table labels.
  if (val && typeof val === 'object' && Object.keys(val).length === 1) {
    if (val.$number === 'Infinity') return Infinity;
    if (val.$number === '-Infinity') return -Infinity;
  }
  return val;
}

/**
 * Build the project file object (everything a student needs to restore the project elsewhere).
 * PII columns travel inside it: it is the student's own backup (M1-DESIGN.md 9.4).
 */
export async function buildProjectFile(db, owner, projectId, now = new Date()) {
  const project = await getProject(db, owner, projectId);
  if (!project) throw new StoreError('notFound', 'runtime.store.notFound');
  const metas = await listDatasets(db, owner, projectId);
  const datasets = [];
  // The first dataset is the one analysed. An IndexedDB index sorts by random id, not this order.
  for (const id of project.datasetIds) {
    const m = metas.find((d) => d.id === id);
    if (!m) throw new StoreError('corrupt', 'runtime.store.corrupt');
    const full = await getDataset(db, owner, m.id);
    if (!full) throw new StoreError('corrupt', 'runtime.store.corrupt');
    datasets.push({
      id: m.id, source: m.source, header: full.raw.header, rowIds: full.raw.rowIds, rowCount: full.raw.rowCount,
      columns: full.raw.columns, codebook: m.codebook, steps: m.steps || [], purpose: m.purpose || 'main',
    });
  }
  const analyses = (await listAnalyses(db, owner, projectId)).map((a) => ({
    id: a.id, spec: a.spec, envelope: a.envelope, frozen: Boolean(a.frozen), frozenAt: a.frozenAt ?? null, dataFingerprint: a.dataFingerprint ?? null, createdAt: a.createdAt,
  }));
  const log = (await listLog(db, owner, projectId)).map((e) => ({ seq: e.seq, at: e.at, kind: e.kind, detail: e.detail, egress: 'none' }));
  return {
    format: PROJECT_FILE_FORMAT,
    version: PROJECT_FILE_VERSION,
    exportedAt: now.toISOString(),
    engineVersion: ENGINE_VERSION,
    project: { name: project.name, design: project.design ?? null, createdAt: project.createdAt, ...(project.example ? { example: project.example } : {}) },
    datasets,
    analyses,
    log,
  };
}

/**
 * Export the project as a file for the student to keep, record lastExportAt and log a 'download'.
 * @returns {Promise<Blob>} application/json; a File named `<project name>-<YYYY-MM-DD>.vmresearch.json` where File exists
 */
export async function exportProjectFile(db, owner, projectId, now = new Date()) {
  const data = await buildProjectFile(db, owner, projectId, now);
  const text = JSON.stringify(data, jsonReplacer);
  const name = projectFileName(data.project.name, now);
  const blob = typeof File === 'function' ? new File([text], name, { type: 'application/json' }) : Object.assign(new Blob([text], { type: 'application/json' }), { name });
  const project = await getProject(db, owner, projectId);
  await saveProject(db, owner, { ...project, lastExportAt: now.toISOString() }, project.rev, now);
  await db.tx(['log'], 'readwrite', (ops) => appendLogInTx(ops, owner, projectId, { kind: 'download', detail: { what: 'project-file', fileName: name, bytes: text.length } }, now));
  return blob;
}

/**
 * @param {File|Blob} file
 * @returns {Promise<{ ok: true, preview: { name: string, datasets: number, rows: number, analyses: number, exportedAt: string|null }, data: Object } | { ok: false, key: string }>}
 */
export async function parseProjectFile(file) {
  if (!file || typeof file.size !== 'number') return { ok: false, key: 'runtime.projectFile.notJson' };
  if (file.size > PROJECT_FILE_MAX_BYTES) return { ok: false, key: 'runtime.projectFile.tooBig' };
  let parsed;
  try {
    parsed = JSON.parse(await file.text(), jsonReviver);
  } catch {
    return { ok: false, key: 'runtime.projectFile.notJson' };
  }
  if (!parsed || typeof parsed !== 'object' || parsed.format !== PROJECT_FILE_FORMAT) return { ok: false, key: 'runtime.projectFile.wrongFormat' };
  if (typeof parsed.version === 'number' && parsed.version > PROJECT_FILE_VERSION) return { ok: false, key: 'runtime.projectFile.newerVersion' };
  const res = v.safeParse(PROJECT_FILE_SCHEMA, parsed);
  if (!res.success) return { ok: false, key: 'runtime.projectFile.invalid' };
  const data = res.output;
  for (const d of data.datasets) {
    if (d.header.length !== d.columns.length || d.rowIds.length !== d.rowCount || d.columns.some((c) => c.length !== d.rowCount)) return { ok: false, key: 'runtime.projectFile.invalid' };
    if (new Set(d.rowIds).size !== d.rowIds.length) return { ok: false, key: 'runtime.projectFile.invalid' };
  }
  const datasetIds = new Set(data.datasets.map((d) => d.id));
  if (datasetIds.size !== data.datasets.length) return { ok: false, key: 'runtime.projectFile.invalid' };
  for (const a of data.analyses) {
    // Old files encoded bounds as strings. Keep that reading only inside their result envelopes;
    // raw cells, codebooks, recipes and project names have always been text.
    if (data.version === 1) a.envelope = reviveNumbers(a.envelope);
    const s = validateSpec(a.spec);
    if (!s.ok) return { ok: false, key: 'runtime.projectFile.invalid' };
    // A computed envelope carries its own copy of the spec (the report and the scripts read it): it must be
    // a valid spec, not free JSON (review round 1).
    if (a.envelope.status === 'ok' && a.envelope.spec != null && !validateSpec(a.envelope.spec).ok) return { ok: false, key: 'runtime.projectFile.invalid' };
    if (s.spec.input.kind === 'dataset' && !datasetIds.has(s.spec.input.datasetId)) return { ok: false, key: 'runtime.projectFile.invalid' };
  }
  try {
    cleanName(data.project.name);
  } catch {
    return { ok: false, key: 'runtime.projectFile.invalid' };
  }
  return {
    ok: true,
    preview: {
      name: data.project.name,
      datasets: data.datasets.length,
      rows: data.datasets.reduce((s, d) => s + d.rowCount, 0),
      analyses: data.analyses.length,
      exportedAt: data.exportedAt || null,
    },
    data,
  };
}

/**
 * Writes the validated data as a new project owned by `owner`, with new ids, and logs it. The old log
 * entries come along (renumbered after nothing), followed by a 'project-import' entry.
 * @param {{ estimate?: () => Promise<{usage?: number, quota?: number}>, now?: Date }} [opts]
 * @returns {Promise<import('./projects.js').Project>}
 */
export async function importProjectFile(db, owner, data, opts = {}) {
  if (!isOwner(owner)) throw new StoreError('badOwner', 'runtime.store.failed');
  const now = opts.now || new Date();
  const bytes = data.datasets.reduce((s, d) => s + estimateRawBytes(d), 0);
  await checkSpace(bytes, opts.estimate);
  const projectId = newId();
  const idMap = new Map(data.datasets.map((d) => [d.id, newId()]));
  const at = now.toISOString();
  const project = {
    key: ownerKey(owner, projectId), owner, id: projectId, name: cleanName(data.project.name), design: data.project.design ?? null, example: data.project.example ?? null,
    datasetIds: [...idMap.values()], rev: 1, createdAt: at, updatedAt: at, lastExportAt: null, sizeBytes: bytes,
  };
  await db.tx(['projects', 'datasets', 'blocks', 'analyses', 'log'], 'readwrite', async (ops) => {
    await ops.put('projects', project);
    for (const d of data.datasets) {
      const id = idMap.get(d.id);
      const blockCount = Math.max(1, Math.ceil(d.rowCount / BLOCK_ROWS));
      await ops.put('datasets', {
        key: ownerKey(owner, id), owner, project: projectId, id, projectId, source: d.source, header: d.header, rowIds: d.rowIds,
        rowCount: d.rowCount, colCount: d.columns.length, blockCount, codebook: d.codebook, steps: remapSteps(d.steps, idMap), rev: 1, bytes: estimateRawBytes(d),
        purpose: d.purpose || 'main', createdAt: at, updatedAt: at,
      });
      for (let c = 0; c < d.columns.length; c += 1) {
        for (let b = 0; b < blockCount; b += 1) {
          await ops.put('blocks', { key: ownerKey(owner, `${id}:${c}:${b}`), owner, dataset: id, col: c, block: b, cells: d.columns[c].slice(b * BLOCK_ROWS, (b + 1) * BLOCK_ROWS) });
        }
      }
    }
    for (const a of data.analyses) {
      const id = newId();
      const remap = (spec) => (spec?.input?.kind === 'dataset' ? { ...spec, input: { ...spec.input, datasetId: idMap.get(spec.input.datasetId) } } : spec);
      const envelope = { ...a.envelope, spec: remap(a.envelope.spec) };
      await ops.put('analyses', {
        key: ownerKey(owner, id), owner, project: projectId, id, projectId, spec: remap(a.spec), envelope, frozen: a.frozen,
        frozenAt: a.frozenAt ?? null, dataFingerprint: a.dataFingerprint ?? null, createdAt: a.createdAt, updatedAt: at,
      });
    }
    const sorted = [...data.log].sort((x, y) => x.seq - y.seq);
    let seq = 0;
    for (const e of sorted) {
      seq += 1;
      await ops.put('log', { key: logKey(owner, projectId, seq), owner, project: projectId, projectId, seq, at: e.at, kind: e.kind, detail: sanitizeDetail(e.detail), egress: 'none' });
    }
    await appendLogInTx(ops, owner, projectId, { kind: 'project-import', detail: { datasets: data.datasets.length, analyses: data.analyses.length, exportedAt: data.exportedAt, fromEngine: data.engineVersion } }, now);
  });
  return publicRecord(project);
}
