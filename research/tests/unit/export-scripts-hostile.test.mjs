// A hostile project file cannot put code into the R script or the SPSS syntax the app builds for download
// (review round 1): an envelope spec with code in an option, a values key and a test id with a line break,
// a codebook key that is not a column key. The import refuses what it can check; the script builders never
// print what they read from a project as code, whatever reaches them. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDb } from '../../src/lib/store/db.js';
import { createProject } from '../../src/lib/store/projects.js';
import { putDataset } from '../../src/lib/store/datasets.js';
import { putAnalysis } from '../../src/lib/store/analyses.js';
import { exportProjectFile, parseProjectFile } from '../../src/lib/store/project-file.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { buildSps } from '../../src/lib/export/sps.js';
import { buildRScript } from '../../src/lib/export/rscript.js';
import { tOf } from './export-helpers.mjs';

const A = 'u.11111111-1111-4111-8111-111111111111';
const bigSpace = async () => ({ usage: 0, quota: 1e12 });
const PAYLOAD = 'system("id")';
const raw = {
  header: ['farm', 'result'], columns: [['F1', 'F2'], ['pos', 'neg']], rowIds: ['r1', 'r2'], rowCount: 2,
  source: { fileName: 'x.csv', bytes: 10, sha256: 'aa', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-27T00:00:00Z' },
};
const codebook = { unitOfAnalysis: 'animal', clusterKey: null, columns: [{ key: 'c1', name: 'farm', type: 'id' }, { key: 'c2', name: 'result', type: 'binary', levels: [{ value: 'pos' }, { value: 'neg' }] }, { key: 'c3', name: 'weight', type: 'continuous', labelTh: 'น้ำหนัก', labelEn: 'Weight', levels: [{ value: "1 'x') HOST COMMAND=['calc'] /c1 2", labelTh: 'lab', labelEn: 'lab' }, { value: '2', labelTh: 'สอง', labelEn: 'two' }] }] };

async function exported() {
  const db = createMemoryDb();
  const p = await createProject(db, A, { name: 'hostile', design: 'cross-sectional' });
  const d = await putDataset(db, A, p.id, { raw, codebook, steps: [] }, { estimate: bigSpace });
  const spec = makeSpec('freq.proportion', { kind: 'dataset', datasetId: d.id, recipeRev: 0 }, { design: 'cross-sectional', roles: { outcome: 'c2' }, levels: { outcomePositive: 'pos' }, options: { ciMethod: 'exact' } });
  await putAnalysis(db, A, { projectId: p.id, spec, envelope: { envelopeVersion: 1, status: 'ok', spec, values: { proportion: { value: 0.5 } }, tests: [], provenance: { dataFingerprint: 'ff' } } });
  return JSON.parse(await (await exportProjectFile(db, A, p.id)).text());
}
const asFile = (obj) => { const text = JSON.stringify(obj); return { size: text.length, text: async () => text }; };

test('import refuses an envelope spec that is not a valid spec, and a codebook key that is not a column key', async () => {
  const base = await exported();
  assert.equal((await parseProjectFile(asFile(base))).ok, true, 'the untouched file imports');
  const bad1 = structuredClone(base);
  bad1.analyses[0].envelope.spec = { ...bad1.analyses[0].envelope.spec, options: { ...bad1.analyses[0].envelope.spec.options, confLevel: `0.95); ${PAYLOAD}; (` } };
  assert.deepEqual(await parseProjectFile(asFile(bad1)), { ok: false, key: 'runtime.projectFile.invalid' });
  const bad2 = structuredClone(base);
  bad2.datasets[0].codebook.columns[1].key = `x"]);${PAYLOAD};#`;
  assert.deepEqual(await parseProjectFile(asFile(bad2)), { ok: false, key: 'runtime.projectFile.invalid' });
});

// Whatever reaches the builders (an older store, a future bug): no line outside a comment carries the payload.
function hostileAnalyses() {
  const spec = makeSpec('freq.proportion', { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'cross-sectional', roles: { outcome: `c2"]);${PAYLOAD};#` }, levels: { outcomePositive: `pos'\n${PAYLOAD}\n'` }, options: { ciMethod: 'exact' } });
  const envSpec = { ...spec, options: { ...spec.options, confLevel: `0.95); ${PAYLOAD}; (` } };
  const env = {
    envelopeVersion: 1, status: 'ok', spec: envSpec,
    values: { [`c9\n${PAYLOAD}\n#`]: { value: 0.5 } },
    tests: [{ id: `t\r\n${PAYLOAD}\r\n*`, statistic: { name: `z\n${PAYLOAD}`, value: 1 }, df: null, p: 0.5 }],
  };
  const power = makeSpec('power.tTest', { kind: 'params', params: { d: `1)\n${PAYLOAD}\n#`, power: 0.8 } }, {});
  const envP = { envelopeVersion: 1, status: 'ok', spec: power, values: { n: { value: 10 } }, tests: [] };
  return [{ id: 'a1', spec, envelope: env }, { id: 'a2', spec: power, envelope: envP }];
}
const hostileCodebook = { columns: [{ key: `x"]);${PAYLOAD};#`, name: 'bad name', type: 'continuous', levels: [] }, { key: 'c2', name: 'result', type: 'binary', labelTh: `ผล\n${PAYLOAD}`, levels: [{ value: 'pos', labelTh: `บวก\r\n${PAYLOAD}` }, { value: 'neg' }] }] };

for (const lang of ['th', 'en']) {
  test(`${lang}: a hostile project reaches the R script only inside comments and strings`, () => {
    const r = buildRScript({ analyses: hostileAnalyses(), codebook: hostileCodebook, csvName: `d\n${PAYLOAD}.csv`, lang, t: tOf(lang) });
    for (const line of r.split('\n')) {
      if (line.startsWith('#')) continue;
      // a payload inside an R string literal is text, not code
      const code = line.replace(/"(?:[^"\\]|\\.)*"/g, '""');
      assert.ok(!code.includes('system('), `code line: ${line}`);
    }
    assert.ok(!r.includes('0.95); system'), 'the unchecked envelope option never reaches the code');
  });

  test(`${lang}: a hostile project reaches the SPSS syntax only inside comments and strings`, () => {
    const s = buildSps({ analyses: hostileAnalyses(), codebook: hostileCodebook, csvName: `d\r\n${PAYLOAD}.csv`, lang, t: tOf(lang) });
    for (const line of s.replace(/^﻿/, '').split('\r\n')) {
      assert.ok(!/[\n\r]/.test(line));
      if (line.startsWith('*')) continue;
      const code = line.replace(/'(?:[^']|'')*'/g, "''");
      assert.ok(!code.includes('system('), `command line: ${line}`);
    }
  });

  test(`${lang}: a codebook level on a number column is a numeric literal only when it is a number`, () => {
    // Review round 2: VALUE LABELS wrote the level of a number column raw, whatever its text.
    const cb = { columns: [{ key: 'c3', name: 'weight', type: 'continuous', labelTh: 'น้ำหนัก', labelEn: 'Weight', levels: [{ value: "1 'x') HOST COMMAND=['calc'] /c1 2", labelTh: 'lab', labelEn: 'lab' }, { value: '2', labelTh: 'สอง', labelEn: 'two' }] }] };
    const s = buildSps({ analyses: [], codebook: cb, csvName: 'd.csv', lang, t: tOf(lang) });
    const rows = s.replace(/^\uFEFF/, '').split(/\r?\n/);
    const line = rows.find((l) => /^\s*\/?weight /.test(l) && l.includes('lab'));
    assert.ok(line && line.includes("'1 ''x'') HOST COMMAND=[''calc''] /c1 2' 'lab' 2 '"), `value labels line: ${line}`);
    for (const l of rows) if (!l.startsWith('*')) assert.ok(!l.replace(/'(?:[^']|'')*'/g, "''").includes('HOST'), l);
  });

  test(`${lang}: T-TEST GROUPS writes a level of a number column bare only when it is a number`, () => {
    // Review round 3: the round-2 fix covered VALUE LABELS only; T-TEST GROUPS still printed the level raw.
    const lvl = "1 2) /VARIABLES=w /CRITERIA=CI(.95). HOST COMMAND=['calc'] /X=(1";
    const cb = { columns: [{ key: 'c3', name: 'grp', type: 'continuous', levels: [{ value: lvl }, { value: '2' }] }, { key: 'c4', name: 'w', type: 'continuous', levels: [] }] };
    const spec = makeSpec('test.tTest', { kind: 'dataset', datasetId: 'd1', recipeRev: 0 }, { design: 'experiment', roles: { group: 'c3', outcome: 'c4' }, options: { variant: 'welch' } });
    const env = { envelopeVersion: 1, status: 'ok', spec, values: {}, tests: [] };
    const s = buildSps({ analyses: [{ id: 'a1', spec, envelope: env }], codebook: cb, csvName: 'd.csv', lang, t: tOf(lang) });
    const line = s.replace(/^﻿/, '').split(/\r?\n/).find((l) => l.startsWith('T-TEST GROUPS'));
    assert.ok(line, 'a T-TEST line');
    assert.ok(!line.replace(/'(?:[^']|'')*'/g, "''").includes('HOST'), line);
    assert.ok(/ 2\) \/VARIABLES=w /.test(line), line);
  });
}
