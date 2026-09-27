// Table 1 [M1-DESIGN.md 7.4]. Pin: the serosurvey numbers (numbers.json `table1`, recomputed
// independently by check.py with NumPy; family serosurvey-numbers) when the intake role has
// committed tests/fixtures/serosurvey/ (serosurvey-2569.csv + numbers.json), or from the folder in
// RS_SEROSURVEY_DIR; otherwise that test is skipped with a message. A small hand-computed table
// always runs. The CSV is read here with its own decoder (windows-874) and age rule, the same rule
// as check.py, so this test does not depend on the intake pipeline. OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { table1, runTable1 } from '../../src/lib/stats/table1.js';
import { makeTable, spec, pinned } from './stats-fixtures.mjs';

const cell = (t, id, variable, level, stat, group) => {
  const rows = t.tables.find((x) => x.id === id).rows.filter((r) => r[0] === variable && r[1] === level && r[2] === stat && r[3] === group);
  assert.equal(rows.length, 1, `${id} ${variable} ${level} ${stat} ${group}: ${rows.length} rows`);
  return rows[0][4];
};

test('Table 1: hand-computed cells, both levels, missing by reason, no p-values', () => {
  const t = makeTable({
    farm: { kind: 'category', levels: ['F1', 'F2', 'F3'], values: ['F1', 'F1', 'F2', 'F2', 'F2', 'F3'] },
    herd: { kind: 'number', values: [30, 30, 50, 50, 50, 70] },
    age: { kind: 'number', values: [10, 20, null, 40, 50, null], missing: [0, 0, 2, 0, 0, 3] },
    sex: { kind: 'category', levels: ['F', 'M'], values: ['F', 'F', 'M', 'F', null, 'F'] },
    out: { kind: 'category', levels: ['pos', 'neg'], values: ['pos', 'neg', 'pos', 'neg', 'neg', 'pos'] },
  });
  const r = table1(t, { variables: ['herd', 'age', 'sex'], group: 'out', cluster: 'farm', columnLevels: { herd: 'farm' }, quantileType: 7 });
  assert.equal(r.clusters, 3);
  // farm level: herd sizes 30, 50, 70 (one per farm)
  assert.equal(cell(r, 'table1.cluster', 'herd', null, 'n', 'all'), 3);
  assert.equal(cell(r, 'table1.cluster', 'herd', null, 'median', 'all'), 50);
  assert.equal(cell(r, 'table1.cluster', 'herd', null, 'q1', 'all'), 40);
  // animal level: ages 10, 20, 40, 50 known; one unknown, one not applicable
  assert.equal(cell(r, 'table1.animal', 'age', null, 'n', 'all'), 4);
  assert.equal(cell(r, 'table1.animal', 'age', null, 'median', 'all'), 30);
  assert.equal(cell(r, 'table1.animal', 'age', null, 'missing.unknown', 'all'), 1);
  assert.equal(cell(r, 'table1.animal', 'age', null, 'missing.notApplicable', 'all'), 1);
  assert.equal(cell(r, 'table1.animal', 'age', null, 'median', 'pos'), 10);
  // categories: percent of the known values
  assert.equal(cell(r, 'table1.animal', 'sex', null, 'known', 'all'), 5);
  assert.equal(cell(r, 'table1.animal', 'sex', 'F', 'count', 'all'), 4);
  assert.equal(cell(r, 'table1.animal', 'sex', 'F', 'percent', 'all'), 80);
  assert.equal(cell(r, 'table1.animal', 'sex', null, 'missing.blank', 'all'), 1);
  assert.deepEqual(r.tables.find((x) => x.id === 'table1.groups').rows, [['all', 6], ['pos', 3], ['neg', 3]]);
  const out = runTable1(spec('desc.table1', { roles: { covariates: ['herd', 'age', 'sex'], group: 'out' }, cluster: { route: null, column: 'farm' }, options: { quantileType: 7, summaries: {}, showMissing: true, byLevel: true, columnLevels: { herd: 'farm' } } }), t);
  assert.equal(out.status, 'ok');
  assert.equal(out.tests.length, 0, 'Table 1 never carries a test (G10)');
  assert.equal(out.values.clusters.value, 3);
  // a farm-level variable that varies inside a farm is flagged
  t.columns.herd.values[1] = 31;
  const flagged = runTable1(spec('desc.table1', { roles: { covariates: ['herd'] }, cluster: { route: null, column: 'farm' }, options: { columnLevels: { herd: 'farm' } } }), t);
  assert.deepEqual(flagged.tables.find((x) => x.id === 'table1.inconsistentWithinCluster').rows, [['herd', 1]]);
});

// ---------------------------------------------------------------- serosurvey (optional)

function seroDir() {
  const inRepo = fileURLToPath(new URL('../fixtures/serosurvey/', import.meta.url));
  if (existsSync(path.join(inRepo, 'serosurvey-2569.csv')) && existsSync(path.join(inRepo, 'numbers.json'))) return inRepo;
  const env = process.env.RS_SEROSURVEY_DIR;
  if (env && existsSync(path.join(env, 'numbers.json'))) return env;
  return null;
}

function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) if (line.length) rows.push(line.split(','));
  return rows;
}

function loadSerosurvey(dir) {
  const csvPath = existsSync(path.join(dir, 'serosurvey-2569.csv')) ? path.join(dir, 'serosurvey-2569.csv') : path.join(dir, 'data', 'serosurvey-2569.csv');
  const text = new TextDecoder('windows-874').decode(readFileSync(csvPath));
  const [head, ...rows] = parseCsv(text);
  const C = Object.fromEntries(head.map((h, i) => [h, i]));
  const TH = (s) => s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
  const date = (s) => {
    const [d, m, y0] = TH(s.trim()).split('/').map(Number);
    const y = y0 < 100 ? y0 + 2500 : y0;
    return [y - 543, m, d];
  };
  const MISS = new Set(['ไม่ทราบ', '-', '', '999']);
  const cat = (name, map = (v) => v) => {
    const vals = rows.map((r) => map(r[C[name]]));
    const levels = [...new Set(vals.filter((v) => v !== null))].sort(new Intl.Collator('th').compare);
    return { vals, levels };
  };
  const age = rows.map((r) => {
    const b = r[C['วันเกิด']];
    if (MISS.has(b)) return null;
    const s = date(r[C['วันที่เก็บตัวอย่าง']]);
    const bb = date(b);
    return (s[0] - bb[0]) * 12 + (s[1] - bb[1]) - (s[2] < bb[2] ? 1 : 0);
  });
  const parityRaw = rows.map((r) => r[C['จำนวนครั้งที่คลอด']]);
  const breed = cat('พันธุ์', (v) => (v.trim() === '' ? null : v.trim()));
  const vacc = cat('วัคซีนใน 6 เดือน', (v) => (v === 'ไม่ทราบ' ? null : v));
  const sex = cat('เพศ');
  const farm = cat('ฟาร์ม');
  const buy = cat('ซื้อโคเข้าฝูงใน 12 เดือน');
  const elisa = rows.map((r) => r[C['ผล ELISA']]);
  return makeTable({
    farm: { kind: 'category', levels: farm.levels, values: farm.vals },
    herd: { kind: 'number', values: rows.map((r) => Number(TH(r[C['ขนาดฝูง (ตัว)']]))) },
    buy: { kind: 'category', levels: buy.levels, values: buy.vals },
    age: { kind: 'number', values: age },
    sex: { kind: 'category', levels: sex.levels, values: sex.vals },
    breed: { kind: 'category', levels: breed.levels, values: breed.vals },
    parity: { kind: 'number', values: parityRaw.map((v) => (v === '999' || v === '-' ? null : Number(TH(v)))), missing: parityRaw.map((v) => (v === '999' ? 2 : v === '-' ? 3 : 0)) },
    vacc: { kind: 'category', levels: vacc.levels, values: vacc.vals, missing: vacc.vals.map((v) => (v === null ? 2 : 0)) },
    elisa: { kind: 'category', levels: ['บวก', 'ลบ'], values: elisa },
  });
}

test('Table 1: serosurvey numbers (numbers.json table1)', (t) => {
  const dir = seroDir();
  if (!dir) { t.skip('serosurvey fixture not committed yet (intake role, M1-DESIGN.md 8.6); set RS_SEROSURVEY_DIR to run'); return; }
  const N = pinned(JSON.parse(readFileSync(path.join(dir, 'numbers.json'), 'utf8')).table1);
  const table = loadSerosurvey(dir);
  const r = table1(table, {
    variables: ['herd', 'buy', 'age', 'sex', 'breed', 'parity', 'vacc'],
    group: 'elisa',
    cluster: 'farm',
    columnLevels: { herd: 'farm', buy: 'farm' },
    quantileType: 7,
  });
  assert.equal(r.clusters, N.farms.n);
  assert.deepEqual(['median', 'q1', 'q3'].map((s) => cell(r, 'table1.cluster', 'herd', null, s, 'all')), N.farms.herd);
  assert.equal(cell(r, 'table1.cluster', 'buy', 'ซื้อ', 'count', 'all'), N.farms.purchased);
  const groups = { all: 'all', pos: 'บวก', neg: 'ลบ' };
  for (const [k, g] of Object.entries(groups)) {
    const A = N.animals[k];
    const id = 'table1.animal';
    assert.equal(r.tables.find((x) => x.id === 'table1.groups').rows.find((x) => x[0] === g)[1], A.n, `${k} n`);
    assert.deepEqual(['median', 'q1', 'q3'].map((s) => cell(r, id, 'age', null, s, g)), A.age, `${k} age`);
    assert.equal(cell(r, id, 'age', null, 'n', g), A.ageKnown, `${k} age known`);
    assert.equal(A.n - cell(r, id, 'age', null, 'n', g), A.ageMissing, `${k} age missing`);
    assert.equal(cell(r, id, 'sex', 'เมีย', 'count', g), A.female, `${k} female`);
    for (const [breed, count] of Object.entries(A.breeds)) assert.equal(cell(r, id, 'breed', breed, 'count', g), count, `${k} ${breed}`);
    assert.equal(cell(r, id, 'breed', null, 'known', g), A.breedKnown, `${k} breed known`);
    if (A.breedMissing) assert.equal(cell(r, id, 'breed', null, 'missing.blank', g), A.breedMissing, `${k} breed missing`);
    assert.deepEqual(['median', 'q1', 'q3'].map((s) => cell(r, id, 'parity', null, s, g)), A.parity, `${k} parity`);
    assert.equal(cell(r, id, 'parity', null, 'n', g), A.parityKnown, `${k} parity known`);
    assert.equal(cell(r, id, 'parity', null, 'missing.unknown', g), A.parityUnknown, `${k} parity unknown`);
    assert.equal(cell(r, id, 'parity', null, 'missing.notApplicable', g), A.parityNA, `${k} parity not applicable`);
    assert.equal(cell(r, id, 'vacc', 'ฉีด', 'count', g), A.vacc, `${k} vaccinated`);
    assert.equal(cell(r, id, 'vacc', null, 'known', g), A.vaccKnown, `${k} vaccine known`);
    assert.equal(cell(r, id, 'vacc', null, 'missing.unknown', g), A.vaccUnknown, `${k} vaccine unknown`);
  }
});
