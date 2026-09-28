// What the tool screens compute before a step is saved or a file is downloaded (screens/tools/
// tools-model.js): merge key matching, values outside the codebook range, rows a condition catches, fresh
// derived keys, CSV files with their settings rows, the three randomisation files, and the sources a merge
// step needs [M2-DESIGN.md 4, 7]. Made-up data (ข้อมูลสมมุติ). OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeRows, csvWithSettings, freshKeys, keyMatch, listTables, matchingRows, rangeFlags, uniqueIdColumns } from '../../src/workspace/screens/tools/tools-model.js';
import { sourceIds, sourcesFor } from '../../src/workspace/screens/useProject.js';

const cat = (levels, idx) => ({ kind: 'category', levels, values: Int32Array.from(idx), missing: Uint8Array.from(idx.map((i) => (i < 0 ? 1 : 0))) });
const num = (vals) => ({ kind: 'number', values: Float64Array.from(vals.map((v) => (v === null ? NaN : v))), missing: Uint8Array.from(vals.map((v) => (v === null ? 1 : 0))) });
const table = (rowIds, columns, excluded = {}) => ({ rowIds, n: rowIds.length, columns, excluded });

// Animals on farms F1..F3 (F3 unknown to the farm file), one without a farm; the farm file repeats F2.
const animals = table(['r1', 'r2', 'r3', 'r4', 'r5'], { c1: cat(['F1', 'F2', 'F3'], [0, 1, 1, 2, -1]), c2: num([12, 250, 30, 41, null]) }, { r5: 's9' });
const farms = table(['r1', 'r2', 'r3', 'r4'], { c1: cat(['F1', 'F2', 'F9'], [0, 1, 1, 2]) });

test('keyMatch counts matched rows, lists unmatched and repeated codes, skips excluded rows', () => {
  const m = keyMatch(animals, 'c1', farms, 'c1');
  assert.equal(m.matched, 3);
  assert.deepEqual(m.unmatchedLeft, [{ rowId: 'r4', key: 'F3' }]);
  assert.deepEqual(m.unmatchedRight, ['F9']);
  assert.deepEqual(m.duplicateRight, ['F2']);
  assert.equal(m.blankLeft, 0, 'r5 has no farm but is excluded');
  assert.deepEqual(activeRows(animals), [0, 1, 2, 3]);
});

test('rangeFlags lists values outside the codebook range and nothing else', () => {
  const codebook = { columns: [{ key: 'c2', range: { min: 0, max: 100 }, hidden: false }, { key: 'c1', range: null }] };
  assert.deepEqual(rangeFlags(animals, codebook), [{ rowId: 'r2', column: 'c2', value: 250, min: 0, max: 100 }]);
  assert.deepEqual(rangeFlags(animals, { columns: [{ key: 'c2', range: null }] }), []);
});

test('matchingRows reads each condition as the filter step does', () => {
  assert.deepEqual(matchingRows(animals, [{ column: 'c2', op: 'gt', value: '35' }]), ['r2', 'r4']);
  assert.deepEqual(matchingRows(animals, [{ column: 'c1', op: 'eq', value: 'F2' }, { column: 'c2', op: 'lt', value: '100' }], 'and'), ['r3']);
  assert.deepEqual(matchingRows(animals, [{ column: 'c1', op: 'eq', value: 'F1' }, { column: 'c2', op: 'ge', value: '250' }], 'or'), ['r1', 'r2']);
  assert.deepEqual(matchingRows(animals, [{ column: 'c2', op: 'eq', value: '30' }]), ['r3'], 'numbers compare as numbers');
  assert.deepEqual(matchingRows(animals, [{ column: 'c2', op: 'ne', value: '30' }]), ['r1', 'r2', 'r4'], 'a missing cell meets only missing');
  assert.deepEqual(matchingRows(animals, []), []);
});

test('freshKeys continues after every derived key the codebook and the steps use', () => {
  const cb = { columns: [{ key: 'c1' }, { key: 'd2' }] };
  const steps = [{ params: { target: 'd4' } }, { params: { stubs: [{ target: 'd6' }], timeTarget: 'd5' } }, { params: { summaries: [{ target: 'd7' }] } }];
  assert.deepEqual(freshKeys(cb, steps, 3), ['d8', 'd9', 'd10']);
  assert.deepEqual(freshKeys({ columns: [] }, [], 1), ['d1']);
});

test('csvWithSettings: BOM, settings rows, a blank row, then the table, fields quoted when needed', () => {
  const s = csvWithSettings([['Seed', 42], ['Arms', 'A (1); B (1)']], { columns: ['unit', 'arm'], rows: [[1, 'A'], [2, 'B, "x"']] });
  assert.equal(s, '﻿Seed,42\r\nArms,A (1); B (1)\r\n\r\nunit,arm\r\n1,A\r\n2,"B, ""x"""\r\n');
});

test('listTables: the code sheet never names the group; the key sorts by code', () => {
  const rows = [[1, null, 1, 'B', 'TH12'], [2, null, 1, 'A', 'AC03']];
  const heads = { unit: 'unit', stratum: 'stratum', block: 'block', arm: 'arm', code: 'code' };
  const f = listTables(rows, heads, false);
  assert.deepEqual(f.full.columns, ['unit', 'block', 'arm', 'code']);
  assert.deepEqual(f.codes.columns, ['unit', 'code']);
  assert.ok(!f.codes.rows.flat().includes('A') && !f.codes.rows.flat().includes('B'));
  assert.deepEqual(f.key.rows, [['AC03', 'A'], ['TH12', 'B']]);
  assert.deepEqual(listTables(rows, heads, true).codes.columns, ['unit', 'stratum', 'code']);
});

test('uniqueIdColumns: only columns with a value in every row, all different', () => {
  const t = table(['r1', 'r2', 'r3'], { c1: cat(['a', 'b'], [0, 1, 1]), c2: num([7, 8, 9]), c3: num([1, null, 2]) });
  const cb = { columns: [{ key: 'c1', type: 'nominal' }, { key: 'c2', type: 'count' }, { key: 'c3', type: 'count' }] };
  assert.deepEqual(uniqueIdColumns(t, cb).map((c) => c.key), ['c2']);
});

test('sourcesFor gives the engine every dataset a merge step names, and only those', () => {
  const steps = [{ kind: 'merge', params: { sourceDatasetId: 'ds2' } }, { kind: 'filter', params: {} }, { kind: 'merge', params: { sourceDatasetId: 'ds2' } }];
  const others = [{ meta: { id: 'ds2', codebook: { columns: [] }, steps: [{ id: 's1' }] }, raw: { header: ['farm'] } }, { meta: { id: 'ds3', codebook: {}, steps: [] }, raw: {} }];
  assert.deepEqual(sourceIds(steps), ['ds2']);
  assert.deepEqual(sourcesFor(steps, others), { ds2: { raw: { header: ['farm'] }, codebook: { columns: [] }, steps: [{ id: 's1' }] } });
  assert.deepEqual(sourcesFor([], others), {});
});
