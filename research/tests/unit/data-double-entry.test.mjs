// Double-entry comparison [M2-DESIGN.md 4.6]: two typings of the same paper forms, every differing cell
// listed; the expected list is written by hand in tests/fixtures/intake/double-expected.json.
// OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDelimited } from '../../src/lib/intake/csv.js';
import { compareEntries, differencesToCsv, pairColumnsByName } from '../../src/lib/intake/double-entry.js';

const fx = (name) => new URL(`../fixtures/intake/${name}`, import.meta.url);
const expected = JSON.parse(readFileSync(fx('double-expected.json'), 'utf8'));

function rawOf(name) {
  const p = parseDelimited(readFileSync(fx(name), 'utf8'), { headerRow: 0 });
  const n = p.rows.length;
  return {
    header: p.header, columns: p.header.map((_, c) => p.rows.map((r) => r[c] ?? '')), rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), rowCount: n,
    source: { fileName: name, bytes: 0, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-28T00:00:00.000Z' },
  };
}

test('the two typings: every differing cell, keys only in one file, repeated keys (fixture written by hand)', () => {
  const res = compareEntries(rawOf('double-a.csv'), rawOf('double-b.csv'), { keyA: 'c1', keyB: 'c1' });
  const { _fixture, ...want } = expected;
  assert.deepEqual(res, want);
});

test('explicit column pairs, and columns paired by header text regardless of order', () => {
  const a = rawOf('double-a.csv');
  const b = rawOf('double-b.csv');
  const only = compareEntries(a, b, { keyA: 'c1', keyB: 'c1', columnPairs: [['c3', 'c3']] });
  assert.deepEqual(only.differences.map((d) => [d.key, d.a, d.b]), [['C002', '24', '42']]);
  assert.equal(only.cellsCompared, 6);
  // file 2 with its columns in another order and one extra column
  const b2 = { ...b, header: [b.header[0], b.header[4], b.header[3], b.header[2], b.header[1], 'หมายเหตุ'], columns: [b.columns[0], b.columns[4], b.columns[3], b.columns[2], b.columns[1], b.columns[0].map(() => '')] };
  const p = pairColumnsByName(a, b2, 'c1', 'c1');
  assert.deepEqual(p.pairs, [['c2', 'c5'], ['c3', 'c4'], ['c4', 'c3'], ['c5', 'c2']]);
  assert.deepEqual(p.onlyB, ['c6']);
  const res = compareEntries(a, b2, { keyA: 'c1', keyB: 'c1' });
  assert.deepEqual(res.differences.map((d) => [d.key, d.column, d.columnB]), [['C002', 'c3', 'c4'], ['C002', 'c5', 'c2'], ['C004', 'c4', 'c3']]);
  assert.deepEqual(res.unpairedColumns, { a: [], b: ['c6'] });
});

test('the difference list downloads as CSV with a byte order mark and formula-safe cells', () => {
  const res = compareEntries(rawOf('double-a.csv'), rawOf('double-b.csv'), { keyA: 'c1', keyB: 'c1' });
  const csv = differencesToCsv(res, { key: 'Key', rowA: 'Row 1', rowB: 'Row 2', column: 'Column', a: 'File 1', b: 'File 2' });
  assert.ok(csv.startsWith('﻿Key,Row 1,Row 2,Column,File 1,File 2\r\n'));
  assert.ok(csv.includes('C002,r2,r2,อายุ (เดือน),24,42\r\n'));
  assert.equal(csv.split('\r\n').length, 5);
  const tricky = differencesToCsv({ differences: [{ key: 'k', rowIdA: 'r1', rowIdB: 'r1', name: 'x', a: '=HYPERLINK("x")', b: '-2' }] }, { key: 'k', rowA: 'a', rowB: 'b', column: 'c', a: 'a', b: 'b' });
  assert.ok(tricky.includes('"\'=HYPERLINK(""x"")"'));
  assert.ok(tricky.includes(',-2\r\n'), 'a negative number stays a number');
});

test('a key column that does not exist is refused with a key', () => {
  assert.throws(() => compareEntries(rawOf('double-a.csv'), rawOf('double-b.csv'), { keyA: 'c9', keyB: 'c1' }), (e) => e.key === 'data.double.noKey');
});
