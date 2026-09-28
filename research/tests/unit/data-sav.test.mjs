// The SPSS reader [M2-DESIGN.md 5]. The three haven 2.5.5 files (R 4.6.0 in webR 0.6.0) are pinned
// against tests/fixtures/sav/expected.json, which is what haven::read_sav(user_na = TRUE) returned.
// Files haven does not write (legacy windows-874 with a code page and no encoding record, a UTF-8 file
// with record 7.20, a big-endian file, a missing-value range, damaged files) are built here by a small
// writer that follows the PSPP manual's layout; the values each should read back are written beside it.
// Made-up data (ข้อมูลสมมุติ). OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readSav, readSavSync, SavError } from '../../src/lib/intake/sav.js';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';
import { applyRecipe } from '../../src/lib/intake/recipe.js';

const dir = new URL('../fixtures/sav/', import.meta.url);
const expected = JSON.parse(readFileSync(new URL('expected.json', dir), 'utf8'));
const FILES = ['cows-none.sav', 'cows-byte.sav', 'cows-zsav.zsav'];
const bytesOf = (f) => new Uint8Array(readFileSync(new URL(f, dir)));

// ---------------------------------------------------------------- the haven files

test('the fixture files are the ones expected.json describes (size and sha256)', () => {
  for (const f of FILES) {
    const b = bytesOf(f);
    assert.equal(b.length, expected.files[f].bytes, f);
    assert.equal(createHash('sha256').update(b).digest('hex'), expected.files[f].sha256, f);
  }
});

/** The cell text the import should carry for one expected variable (labels applied, SYSMIS blank). */
function expectedCells(v) {
  const label = new Map(v.valueLabels.map((l) => [String(l.value), l.label]));
  if (v.dates) return v.dates;
  if (v.characters) return null;
  return v.values.map((x) => (x === null ? '' : label.get(String(x)) ?? String(x)));
}

for (const f of FILES) {
  test(`${f}: every variable, label, value label, user-missing value and cell as haven read it`, async () => {
    const r = await readSav(bytesOf(f));
    assert.equal(r.compression, expected.files[f].compression);
    assert.equal(r.encoding, 'utf-8');
    assert.equal(r.raw.rowCount, expected.rows);
    assert.deepEqual(r.raw.rowIds, ['r1', 'r2', 'r3', 'r4', 'r5', 'r6']);
    assert.deepEqual(r.raw.header, expected.variables.map((v) => v.name));
    expected.variables.forEach((v, i) => {
      const got = r.variables[i];
      assert.equal(got.name, v.name);
      assert.equal(got.type, v.type, v.name);
      assert.equal(got.format, v.format, v.name);
      assert.equal(got.label, v.label, v.name);
      assert.deepEqual(got.valueLabels.map((l) => [l.value, l.label]).sort(), v.valueLabels.map((l) => [String(l.value), l.label]).sort(), v.name);
      assert.deepEqual(got.userMissing.values, v.userMissing.map(String), v.name);
      const cells = expectedCells(v);
      if (cells) assert.deepEqual(r.raw.columns[i], cells, v.name);
    });
    // the very long string: 900 bytes in segments, trailing padding cut
    const notes = r.raw.columns[9];
    assert.deepEqual(notes.map((x) => [...x].length), expected.variables[9].characters);
    assert.equal(notes[0], 'ก'.repeat(300));
    assert.equal(notes[4], 'abc '.repeat(80).trimEnd());
    assert.equal(r.variables[9].width, 900);
    // user-missing proposed as the text the cell carries: the label for elisa, the number for age
    assert.deepEqual(r.variables[3].userMissing.codes, ['ไม่ทราบ']);
    assert.deepEqual(r.variables[4].userMissing.codes, ['-99']);
    assert.equal(r.variables[6].isDate, true);
    assert.deepEqual(r.conversions.map((c) => [c.kind, c.column, c.count]), [['value-labels', 'c3', 6], ['value-labels', 'c4', 6], ['sav-date', 'c7', 6], ['value-labels', 'c9', 6]]);
  });
}

// ---------------------------------------------------------------- a small writer for the other files

/** Thai to TIS-620 / windows-874 bytes (U+0E01..U+0E5B -> 0xA1..0xFB), ASCII as is. */
function tis620(s) {
  return Uint8Array.from([...s].map((ch) => { const c = ch.codePointAt(0); if (c < 0x80) return c; if (c >= 0x0e01 && c <= 0x0e5b) return c - 0x0e00 + 0xa0; throw new Error(`no TIS-620 byte for ${ch}`); }));
}
const utf8 = (s) => new TextEncoder().encode(s);

/**
 * @param {{ le?: boolean, compression?: 'none'|'bytecode', codePage?: number|null, encodingRecord?: string|null, enc?: (s: string) => Uint8Array,
 *   vars: { name: string, short?: string, width: number, label?: string, fmt?: [number, number, number], missing?: number[]|string[], range?: [number, number], valueLabels?: [number|string, string][] }[],
 *   rows: (number|string|null)[][], cases?: number, truncateData?: number }} o
 */
function writeSav(o) {
  const le = o.le !== false;
  const enc = o.enc || utf8;
  const parts = [];
  const i32 = (v) => { const b = new Uint8Array(4); new DataView(b.buffer).setInt32(0, v, le); parts.push(b); };
  const f64 = (v) => { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v, le); parts.push(b); };
  const raw = (b) => parts.push(b);
  const pad = (b, n, fill = 0x20) => { const out = new Uint8Array(n).fill(fill); out.set(b.subarray(0, n)); return out; };
  const elems = (w) => (w === 0 ? 1 : Math.ceil(w / 8));
  const total = o.vars.reduce((s, v) => s + elems(v.width), 0);
  raw(pad(utf8('$FL2'), 4));
  raw(pad(utf8('@(#) SPSS DATA FILE made-up test writer'), 60));
  i32(2); i32(total); i32(o.compression === 'bytecode' ? 1 : 0); i32(0); i32(o.cases ?? o.rows.length); f64(100);
  raw(pad(utf8('28 Sep 26'), 9)); raw(pad(utf8('12:00:00'), 8)); raw(pad(new Uint8Array(0), 64)); raw(new Uint8Array(3));
  let dictIndex = 0;
  const firstIndex = [];
  o.vars.forEach((v, vi) => {
    dictIndex += 1;
    firstIndex[vi] = dictIndex;
    const short = (v.short || v.name).toUpperCase().slice(0, 8);
    const [ft, fw, fd] = v.fmt || (v.width === 0 ? [5, 8, 2] : [1, v.width, 0]);
    const fmt = (ft << 16) | (fw << 8) | fd;
    i32(2); i32(v.width); i32(v.label ? 1 : 0);
    const nMiss = v.range ? (v.missing && v.missing.length ? -3 : -2) : (v.missing ? v.missing.length : 0);
    i32(nMiss); i32(fmt); i32(fmt); raw(pad(utf8(short), 8));
    if (v.label) { const b = enc(v.label); i32(b.length); raw(pad(b, Math.ceil(b.length / 4) * 4, 0)); }
    if (v.range) { f64(v.range[0]); f64(v.range[1]); }
    for (const m of v.missing || []) { if (v.width === 0) f64(m); else raw(pad(enc(m), 8)); }
    for (let k = 1; k < elems(v.width); k++) { dictIndex += 1; i32(2); i32(-1); i32(0); i32(0); i32(0); i32(0); raw(pad(new Uint8Array(0), 8)); }
  });
  o.vars.forEach((v, vi) => {
    if (!v.valueLabels) return;
    i32(3); i32(v.valueLabels.length);
    for (const [value, label] of v.valueLabels) {
      if (v.width === 0) f64(value); else raw(pad(enc(String(value)), 8));
      const b = enc(label);
      const rec = new Uint8Array(Math.ceil((b.length + 1) / 8) * 8);
      rec[0] = b.length; rec.set(b, 1); raw(rec);
    }
    i32(4); i32(1); i32(firstIndex[vi]);
  });
  // a hand-made record 3/4 pair: numeric labels on the listed 1-based variable numbers (repeats kept as written)
  if (o.labelSet) {
    i32(3); i32(o.labelSet.labels.length);
    for (const [value, label] of o.labelSet.labels) {
      f64(value);
      const b = enc(label);
      const rec = new Uint8Array(Math.ceil((b.length + 1) / 8) * 8);
      rec[0] = b.length; rec.set(b, 1); raw(rec);
    }
    i32(4); i32(o.labelSet.vars.length);
    for (const x of o.labelSet.vars) i32(firstIndex[x - 1]);
  }
  if (o.codePage != null) { i32(7); i32(3); i32(4); i32(8); for (const x of [20, 0, 0, -1, 1, 1, 2, o.codePage]) i32(x); }
  // record 7.13: a mixed-case or long name, as SPSS writes it (the short name is upper case)
  const longNames = o.vars.map((v) => [(v.short || v.name).toUpperCase().slice(0, 8), v.name]).filter(([sh, n]) => sh !== n).map(([sh, n]) => `${sh}=${n}`).join('\t');
  if (longNames) { const b = utf8(longNames); i32(7); i32(13); i32(1); i32(b.length); raw(b); }
  if (o.encodingRecord) { const b = utf8(o.encodingRecord); i32(7); i32(20); i32(1); i32(b.length); raw(b); }
  i32(999); i32(0);
  // data
  const cells = [];
  for (const row of o.rows) {
    o.vars.forEach((v, vi) => {
      const x = row[vi];
      if (v.width === 0) cells.push({ num: x === null ? -Number.MAX_VALUE : x });
      else { const b = pad(enc(x ?? ''), elems(v.width) * 8); for (let k = 0; k < elems(v.width); k++) cells.push({ str: b.subarray(k * 8, k * 8 + 8) }); }
    });
  }
  const data = [];
  const num8 = (v) => { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v, le); return b; };
  if (o.compression === 'bytecode') {
    let codes = [];
    let pending = [];
    const flush = () => { while (codes.length < 8) codes.push(0); data.push(Uint8Array.from(codes)); for (const p of pending) data.push(p); codes = []; pending = []; };
    for (const c of cells) {
      if (c.num !== undefined) {
        if (c.num === -Number.MAX_VALUE) codes.push(255);
        else if (Number.isInteger(c.num) && c.num >= -99 && c.num <= 151) codes.push(c.num + 100);
        else { codes.push(253); pending.push(num8(c.num)); }
      } else if (c.str.every((x) => x === 0x20)) codes.push(254);
      else { codes.push(253); pending.push(c.str); }
      if (codes.length === 8) flush();
    }
    codes.push(252);
    flush();
  } else {
    for (const c of cells) data.push(c.num !== undefined ? num8(c.num) : c.str);
  }
  for (const d of data) raw(d);
  const size = parts.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(size);
  let at = 0;
  for (const b of parts) { out.set(b, at); at += b.length; }
  return out;
}

const THAI = {
  vars: [
    { name: 'id', width: 0 },
    { name: 'farm', width: 8, label: 'ฟาร์ม' },
    { name: 'breed_group', short: 'BREED_GR', width: 0, label: 'สายพันธุ์', valueLabels: [[1, 'โคนมลูกผสม'], [2, 'โคพื้นเมือง']] },
    { name: 'owner', width: 20 },
    { name: 'titer', width: 0, label: 'ระดับแอนติบอดี', range: [900, Number.MAX_VALUE], missing: [-1] },
    { name: 'status', width: 3, missing: ['NA'], valueLabels: [['P', 'บวก'], ['N', 'ลบ']] },
  ],
  rows: [
    [1, 'ฟ001', 1, 'สมศรี', 12.5, 'P'],
    [2, 'ฟ001', 2, 'สมศรี', 999, 'N'],
    [3, 'ฟ002', 1, 'ประยูร', -1, 'NA'],
    [4, 'ฟ002', null, 'ประยูร', 1024, 'P'],
  ],
};
// what every THAI file reads back, worked out from the rows above
const THAI_CELLS = [
  ['1', '2', '3', '4'],
  ['ฟ001', 'ฟ001', 'ฟ002', 'ฟ002'],
  ['โคนมลูกผสม', 'โคพื้นเมือง', 'โคนมลูกผสม', ''],
  ['สมศรี', 'สมศรี', 'ประยูร', 'ประยูร'],
  ['12.5', '999', '-1', '1024'],
  ['บวก', 'ลบ', 'NA', 'บวก'],
];
function checkThai(r, from) {
  assert.equal(r.encodingFrom, from);
  assert.deepEqual(r.raw.header, ['id', 'farm', 'breed_group', 'owner', 'titer', 'status']);
  assert.deepEqual(r.raw.columns, THAI_CELLS);
  assert.equal(r.variables[1].label, 'ฟาร์ม');
  assert.equal(r.variables[2].label, 'สายพันธุ์');
  assert.deepEqual(r.variables[4].userMissing.range, [900, Infinity]);
  assert.deepEqual(r.variables[4].userMissing.values, ['-1']);
  // the discrete value, then every value in the data inside 900..HIGHEST, in order
  assert.deepEqual(r.variables[4].userMissing.codes, ['-1', '999', '1024']);
  assert.deepEqual(r.variables[5].userMissing.codes, ['NA']);
  assert.deepEqual(r.variables[5].valueLabels, [{ value: 'P', label: 'บวก' }, { value: 'N', label: 'ลบ' }]);
}

test('a legacy Thai file: windows-874 bytes, code page 874 in record 7.3, no record 7.20', () => {
  const b = writeSav({ ...THAI, codePage: 874, enc: tis620 });
  checkThai(readSavSync(b), 'code-page');
  assert.equal(readSavSync(b).encoding, 'windows-874');
  checkThai(readSavSync(writeSav({ ...THAI, codePage: 874, enc: tis620, compression: 'bytecode' })), 'code-page');
});

test('record 7.20 names the encoding; with neither record, UTF-8 is used only when every byte reads as UTF-8', () => {
  checkThai(readSavSync(writeSav({ ...THAI, encodingRecord: 'UTF-8' })), 'record-7.20');
  checkThai(readSavSync(writeSav({ ...THAI, encodingRecord: 'windows-874', enc: tis620 })), 'record-7.20');
  checkThai(readSavSync(writeSav({ ...THAI })), 'utf-8-check');
  const legacy = writeSav({ ...THAI, enc: tis620 });
  assert.throws(() => readSavSync(legacy), (e) => e instanceof SavError && e.key === 'data.sav.encodingUnknown');
  checkThai(readSavSync(legacy, { encoding: 'windows-874' }), 'chosen');
});

test('big-endian files (layout code read the other way round), uncompressed and bytecode', () => {
  checkThai(readSavSync(writeSav({ ...THAI, le: false, codePage: 65001 })), 'code-page');
  checkThai(readSavSync(writeSav({ ...THAI, le: false, codePage: 65001, compression: 'bytecode' })), 'code-page');
});

test('SYSMIS is a blank; dates are days from 1582-10-14', () => {
  // 2026-08-03 is 141428 + 20668 days after 1582-10-14 (20668 days from 1970-01-01), in seconds
  const secs = (141428 + 20668) * 86400;
  const b = writeSav({ vars: [{ name: 'd', width: 0, fmt: [20, 11, 0] }, { name: 'x', width: 0 }], rows: [[secs, null], [secs + 86400 + 3600, 1.5]], codePage: 65001 });
  const r = readSavSync(b);
  assert.deepEqual(r.raw.columns, [['2026-08-03', '2026-08-04'], ['', '1.5']]);
  assert.equal(r.variables[0].format, 'DATE11');
});

// ---------------------------------------------------------------- damaged files

function mustFailCleanly(bytes) {
  try {
    readSavSync(bytes);
    return 'read';
  } catch (e) {
    assert.ok(e instanceof SavError, `not a SavError: ${e && e.stack}`);
    assert.match(e.key, /^data\.sav\./);
    return e.key;
  }
}

test('a file cut short at any point fails with a message, never hangs or crashes', () => {
  const t0 = Date.now();
  for (const f of FILES) {
    const b = bytesOf(f);
    for (let n = 0; n < b.length; n += n < 800 ? 1 : 13) {
      const res = mustFailCleanly(b.subarray(0, n));
      assert.notEqual(res, 'read', `${f} cut at ${n} was read as a whole file`);
    }
  }
  assert.ok(Date.now() - t0 < 20000, 'fast');
});

test('random byte changes (seeded, 600 per file) either read or fail with a message', () => {
  let s = 28092026;
  const rnd = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 2 ** 32; };
  const t0 = Date.now();
  let failed = 0;
  for (const f of FILES) {
    const b = bytesOf(f);
    for (let i = 0; i < 600; i++) {
      const c = b.slice();
      const k = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < k; j++) c[Math.floor(rnd() * c.length)] = Math.floor(rnd() * 256);
      if (mustFailCleanly(c) !== 'read') failed += 1;
    }
  }
  assert.ok(failed > 0);
  assert.ok(Date.now() - t0 < 30000, 'fast');
});

test('specific damage: not SPSS, a bad layout code, a bad record type, an oversized count', () => {
  const b = bytesOf('cows-byte.sav');
  assert.equal(mustFailCleanly(new TextEncoder().encode('id,farm\n1,F01\n'.repeat(20))), 'data.sav.notSav');
  const layout = b.slice(); layout[64] = 9; layout[67] = 9;
  assert.equal(mustFailCleanly(layout), 'data.sav.badHeader');
  const rec = b.slice(); new DataView(rec.buffer).setInt32(176, 42, true);
  assert.equal(mustFailCleanly(rec), 'data.sav.badRecord');
  // a variable label length far beyond the file
  const lab = writeSav({ vars: [{ name: 'x', width: 0, label: 'abc' }], rows: [[1]], codePage: 65001 });
  new DataView(lab.buffer).setInt32(176 + 32, 60000, true); // record type, width, label flag, missing count, formats and the 8-byte name come first
  assert.equal(mustFailCleanly(lab), 'data.sav.truncated');
  // a declared case count larger than the data
  const many = writeSav({ vars: [{ name: 'x', width: 0 }], rows: [[1], [2]], cases: 5, codePage: 65001 });
  assert.equal(mustFailCleanly(many), 'data.sav.truncated');
  assert.equal(mustFailCleanly(new Uint8Array(51 * 1024 * 1024)), 'data.sav.tooBig');
});

// ---------------------------------------------------------------- into the M1 import

test('the import preview reads a .sav like a CSV: labels applied, user-missing asked (G26), labels proposed', async () => {
  const p = await buildPreview(bytesOf('cows-byte.sav'), { fileName: 'cows-byte.sav', now: '2026-09-28T00:00:00.000Z' });
  assert.equal(p.file.format, 'sav');
  assert.equal(p.raw.source.sha256, expected.files['cows-byte.sav'].sha256);
  const q = p.questions.filter((x) => x.key === 'data.sav.question.userMissing').map((x) => [x.column, x.params.code, x.default]);
  assert.deepEqual(q, [['c4', 'ไม่ทราบ', 'unknown'], ['c5', '-99', 'unknown']]);
  const col = (k) => p.codebook.columns.find((c) => c.key === k);
  assert.equal(col('c3').labelTh, 'เพศ');
  assert.equal(col('c4').labelTh, 'ผล ELISA');
  assert.equal(col('c5').type, 'continuous');
  assert.equal(col('c7').type, 'date');
  assert.ok(p.conversions.some((c) => c.kind === 'value-labels' && c.column === 'c3'));
  // the student says -99 means "not recorded"; the recipe then counts it as missing with that reason
  const a = answerPreview(p, { 'q:c5:missing:-99': 'not-recorded' });
  const wt = applyRecipe(a.raw, a.codebook, [a.importStep]);
  assert.deepEqual(Array.from(wt.columns.c5.missing), [0, 0, 4, 0, 0, 0]);
  assert.deepEqual(Array.from(wt.columns.c5.values).filter(Number.isFinite), [30, 24, 41, 18.5, 60]);
  assert.deepEqual(Array.from(wt.columns.c7.missing), [0, 0, 0, 0, 0, 0]);
  assert.equal(wt.invalid.c7, undefined);
});

// ---------------------------------------------------------------- review round 1: bounded work and size

test('a user-missing range over 100,000 distinct values reads quickly and proposes at most 200 codes', () => {
  const n = 100000;
  const rows = Array.from({ length: n }, (_, i) => [i + 0.5]);
  const b = writeSav({ vars: [{ name: 'x', width: 0, range: [0, 1e9] }], rows, codePage: 65001 });
  const t0 = Date.now();
  const r = readSavSync(b);
  const ms = Date.now() - t0;
  assert.ok(ms < 3000, `read in ${ms} ms (the O(k^2) list took about 10 s)`);
  assert.equal(r.variables[0].userMissing.codes.length, 200);
  assert.equal(r.variables[0].userMissing.inRange, n);
  assert.ok(r.notes.some((x) => x.key === 'data.sav.note.rangeCodes' && x.params.count === n && x.params.shown === 200));
});

test('a small compressed file that expands past the row cap is refused with its own message', () => {
  // Bytecode 101 (value 1) stores each row of one variable in one byte: 1.2 million rows in 1.2 MB, which
  // would be 9.6 MB of numbers once read.
  const rows = Array.from({ length: 1_200_000 }, () => [1]);
  const b = writeSav({ vars: [{ name: 'x', width: 0 }], rows, compression: 'bytecode', codePage: 65001 });
  assert.ok(b.length < 1_300_000);
  assert.equal(mustFailCleanly(b), 'data.sav.tooManyRows');
});

test('value labels: a variable index repeated in record 4 counts once, and a label flood is refused quickly', () => {
  // Review round 2: one numeric variable, 1,000 labels, record 4 listing variable 1 a thousand times. The old
  // reader kept every repeat and built 1,000,000 labels (287 MB); a 160 KB file crashed the tab out of memory.
  const labels = Array.from({ length: 1000 }, (_, i) => [i, 'L' + i]);
  const rep = writeSav({ vars: [{ name: 'x', width: 0 }], rows: [], codePage: 65001, labelSet: { labels, vars: new Array(1000).fill(1) } });
  assert.ok(rep.length < 25_000, `crafted file is ${rep.length} B`);
  let t0 = Date.now();
  const r = readSavSync(rep);
  assert.ok(Date.now() - t0 < 1000, `read in ${Date.now() - t0} ms`);
  assert.equal(r.variables[0].valueLabels.length, 1000);
  // 600 variables sharing 500 labels = 300,000 label assignments, over the cap: refused with its own message.
  const vars = Array.from({ length: 600 }, (_, i) => ({ name: 'v' + i, width: 0 }));
  const flood = writeSav({ vars, rows: [], codePage: 65001, labelSet: { labels: labels.slice(0, 500), vars: vars.map((_, i) => i + 1) } });
  t0 = Date.now();
  assert.equal(mustFailCleanly(flood), 'data.sav.tooManyLabels');
  assert.ok(Date.now() - t0 < 1000, `refused in ${Date.now() - t0} ms`);
});
