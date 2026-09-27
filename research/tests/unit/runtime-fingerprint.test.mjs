// Data fingerprint (M1-DESIGN.md 10.4). The expected hash below was computed independently with
// Python's hashlib on the literal canonical CSV (27 Sep 2026):
//   python -c "import hashlib; print(hashlib.sha256(CSV.encode('utf-8')).hexdigest())"
// with CSV = the EXPECTED_CSV string in this file. The SHA-256 test vectors for 'abc' and '' are
// FIPS 180-2 Appendix B.1 and the empty-string digest. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalCsv, fingerprint, sha256Hex, sha256Sync, daysToIso, compareRowIds } from '../../src/lib/runtime/fingerprint.js';

const EXPECTED_CSV = 'c1,c2,c3,c4\nF01,1.5,2024-02-29,"a, ""quoted"" note"\nF02,,1969-12-31,ไก่\nF01,-0.1,,\n';
const EXPECTED_SHA = 'b622643bf71e8ab886a3a0260b2f934d2afdd76f47324cc6bfdb522e73394a8c';

function table() {
  // source order n1, r2, r1, r3; r3 excluded by a recipe step
  return {
    rowIds: ['n1', 'r2', 'r1', 'r3'],
    n: 4,
    recipeRev: 1,
    excluded: { r3: 's2' },
    fingerprint: '',
    columns: {
      c1: { kind: 'category', levels: ['F01', 'F02'], values: Int32Array.from([0, 1, 0, 1]), missing: new Uint8Array(4) },
      c2: { kind: 'number', values: Float64Array.from([-0.1, Number.NaN, 1.5, 9]), missing: Uint8Array.from([0, 2, 0, 0]) },
      c3: { kind: 'date', values: Float64Array.from([Number.NaN, -1, 19782, 0]), missing: Uint8Array.from([1, 0, 0, 0]) },
      c4: { kind: 'text', values: [null, 'ไก่', 'a, "quoted" note', 'x'], missing: Uint8Array.from([1, 0, 0, 0]) },
    },
  };
}

test('canonical CSV: codebook order, row-id order, shortest numbers, CE dates, level text, RFC 4180, LF', () => {
  assert.equal(canonicalCsv(table(), ['c1', 'c2', 'c3', 'c4']), EXPECTED_CSV);
});

test('fingerprint matches the independent hash', async () => {
  assert.equal(await fingerprint(table(), ['c1', 'c2', 'c3', 'c4']), EXPECTED_SHA);
});

test('one changed cell changes the fingerprint', async () => {
  const t = table();
  t.columns.c2.values[2] = 1.5000000000000002;
  assert.notEqual(await fingerprint(t, ['c1', 'c2', 'c3', 'c4']), EXPECTED_SHA);
});

test('the fallback SHA-256 equals crypto.subtle on the standard vectors and on the CSV', async () => {
  const hex = (u8) => [...u8].map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(hex(sha256Sync(new TextEncoder().encode('abc'))), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(hex(sha256Sync(new Uint8Array(0))), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(hex(sha256Sync(new TextEncoder().encode(EXPECTED_CSV))), EXPECTED_SHA);
  const long = new TextEncoder().encode('x'.repeat(1000));
  assert.equal(hex(sha256Sync(long)), await sha256Hex(long));
});

test('dates and row ids', () => {
  assert.equal(daysToIso(0), '1970-01-01');
  assert.equal(daysToIso(19782), '2024-02-29');
  assert.equal(daysToIso(-719162), '0001-01-01');
  assert.deepEqual(['n2', 'r10', 'n1', 'r2', 'r1'].sort(compareRowIds), ['r1', 'r2', 'r10', 'n1', 'n2']);
});
