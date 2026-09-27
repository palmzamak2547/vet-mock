// Intake: the recipe [M1-DESIGN.md 8.4, 8.5; competitor-gaps.md D4(a)(b); methods.md 5.5]. The raw table
// is never edited; every change is a step replayed in seq order. Expected values are worked by hand
// from the small table below. OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRecipe, makeStep, describeStep, nextDerivedKey, nextRowId, validateStep } from '../../src/lib/intake/recipe.js';
import { proposeCodebook } from '../../src/lib/intake/codebook.js';
import { MISSING } from '../../src/lib/intake/missing.js';
import dict from '../../src/i18n/intake.js';

const RAW = {
  header: ['ฟาร์ม', 'รหัส', 'วันเกิด', 'วันที่ตรวจ', 'พันธุ์', 'น้ำหนัก', 'ผล'],
  columns: [
    ['F1', 'F1', 'F1', 'F2', 'F2', 'F2'],
    ['a1', 'a2', 'a3', 'b1', 'b2', 'b3'],
    ['01/01/2567', '29/02/2567', 'ไม่ทราบ', '15/06/2566', '๐๑/๐๘/๒๕๖๖', '31/12/2568'],
    ['01/08/2569', '01/08/2569', '01/08/2569', '8/8/69', '8/8/69', '8/8/69'],
    ['โฮลสไตน์', 'ลูกผสม ', 'ไม่ระบุ', 'เจอร์ซีย์', 'ไม่ทราบ', 'โฮลสไตน์'],
    ['350', '๔๒๐', '999', '510.5', 'n/d', ''],
    ['บวก', 'ลบ', 'ลบ', 'บวก', 'ลบ', 'บวก'],
  ],
  rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
  rowCount: 6,
  source: { fileName: 't.csv', bytes: 1, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-27T00:00:00.000Z' },
};
const RAW_COPY = JSON.stringify(RAW);

const codebook = () => {
  const cb = proposeCodebook(RAW);
  const by = Object.fromEntries(cb.columns.map((c) => [c.key, c]));
  by.c6.type = 'continuous';
  // as answerPreview writes it: the codebook's missing codes are the ones the student kept
  const pc = perColumn();
  for (const c of cb.columns) c.missingCodes = pc[c.key].missingCodes.slice();
  return cb;
};

const perColumn = () => {
  const base = { thaiDigits: true, trim: true, nfc: true, invisible: true, dates: null, missingCodes: [], cellFixes: [] };
  const pc = {};
  for (let i = 1; i <= 7; i++) pc[`c${i}`] = { ...base, missingCodes: [], cellFixes: [] };
  pc.c3.dates = { order: 'dmy', era: 'BE', twoDigitCentury: null, excelSystem: null };
  pc.c3.missingCodes = [{ code: 'ไม่ทราบ', reason: 'unknown' }];
  pc.c4.dates = { order: 'dmy', era: 'BE', twoDigitCentury: 2500, excelSystem: null };
  pc.c5.missingCodes = [{ code: 'ไม่ทราบ', reason: 'unknown' }];
  pc.c6.missingCodes = [{ code: '999', reason: 'unknown' }, { code: '', reason: 'not-recorded' }];
  return pc;
};

const importStep = () => ({ id: 's1', seq: 1, kind: 'import-conversions', params: { encoding: 'utf-8', perColumn: perColumn() }, reason: null, at: '2026-09-27T00:00:00.000Z' });
const t = (lang) => (key, params) => {
  const s = dict[lang][key];
  if (s === undefined) throw new Error(`missing ${lang} ${key}`);
  return params ? s.replace(/\{(\w+)\}/g, (m, n) => (params[n] === undefined ? m : String(params[n]))) : s;
};
const add = (steps, kind, params, reason) => { steps.push(makeStep(steps, kind, params, reason)); return steps; };
const col = (tb, key) => tb.columns[key];
const iso = (d) => (Number.isFinite(d) ? new Date(d * 864e5).toISOString().slice(0, 10) : null);

test('the import step: Thai digits, BE dates, two-digit years, trims, missing codes with reasons; unreadable cells listed', () => {
  const tb = applyRecipe(RAW, codebook(), [importStep()]);
  assert.equal(JSON.stringify(RAW), RAW_COPY, 'the raw table is never changed');
  assert.deepEqual(tb.rowIds, RAW.rowIds);
  assert.equal(tb.n, 6);
  assert.equal(tb.recipeRev, 1);
  assert.equal(tb.fingerprint, '');
  assert.deepEqual([...col(tb, 'c3').values].map(iso), ['2024-01-01', '2024-02-29', null, '2023-06-15', '2023-08-01', '2025-12-31']);
  assert.equal(col(tb, 'c3').kind, 'date');
  assert.equal(col(tb, 'c3').missing[2], MISSING.unknown);
  assert.deepEqual([...col(tb, 'c4').values].map(iso), ['2026-08-01', '2026-08-01', '2026-08-01', '2026-08-08', '2026-08-08', '2026-08-08']);
  assert.deepEqual([...col(tb, 'c6').values].slice(0, 4), [350, 420, NaN, 510.5]);
  assert.deepEqual([...col(tb, 'c6').missing], [0, 0, MISSING.unknown, 0, MISSING.invalid, MISSING['not-recorded']]);
  assert.deepEqual(tb.invalid.c6.examples, [{ rowId: 'r5', value: 'n/d', key: 'intake.cell.invalid.number' }]);
  assert.equal(tb.invalid.c6.count, 1);
  // breed: the trailing space is trimmed, "ไม่ระบุ" is not a declared code so it stays a level
  const breed = col(tb, 'c5');
  assert.equal(breed.kind, 'category');
  assert.ok(breed.levels.includes('ลูกผสม') && !breed.levels.includes('ลูกผสม '));
  assert.ok(breed.levels.includes('ไม่ระบุ'));
  assert.equal(breed.values[4], -1);
  assert.equal(breed.missing[4], MISSING.unknown);
  assert.deepEqual(col(tb, 'c7').levels, ['ลบ', 'บวก']);
  assert.deepEqual([...col(tb, 'c7').values], [1, 0, 0, 1, 0, 1]);
  assert.equal(col(tb, 'c2').kind, 'text');
});

test('determinism: the same raw table, codebook and steps give the same table', () => {
  const steps = [importStep()];
  add(steps, 'derive-age', { birth: 'c3', event: 'c4', unit: 'months', target: 'd1' });
  const a = applyRecipe(RAW, codebook(), steps);
  const b = applyRecipe(RAW, codebook(), steps.slice().reverse());
  assert.deepEqual(a, b);
});

test('D4(a) cell edit and typed rows: keyed by row, the raw file untouched, a stale edit is rejected', () => {
  const steps = [importStep()];
  add(steps, 'cell-edit', { rowId: 'r5', column: 'c6', from: 'n/d', to: '455' });
  add(steps, 'cell-edit', { rowId: 'r5', column: 'c6', from: 'n/d', to: '1' }); // stale: the cell is now 455
  add(steps, 'row-add', { rowId: nextRowId(steps), values: { c1: 'F2', c2: 'b4', c3: '02/02/2567', c4: '8/8/69', c6: '๓๘๐', c7: 'ลบ' } });
  add(steps, 'cell-edit', { rowId: 'n1', column: 'c5', from: '', to: 'โฮลสไตน์' });
  const tb = applyRecipe(RAW, codebook(), steps);
  assert.equal(JSON.stringify(RAW), RAW_COPY);
  assert.equal(col(tb, 'c6').values[4], 455);
  assert.equal(tb.invalid.c6, undefined);
  assert.deepEqual(tb.rejected, [{ stepId: 's3', key: 'intake.step.rejected.cellChanged', params: { rowId: 'r5', column: 'c6' } }]);
  assert.deepEqual(tb.rowIds, ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'n1']);
  assert.equal(tb.n, 7);
  assert.equal(col(tb, 'c6').values[6], 380);
  assert.equal(iso(col(tb, 'c3').values[6]), '2024-02-02');
  assert.equal(iso(col(tb, 'c4').values[6]), '2026-08-08');
  assert.equal(col(tb, 'c5').levels[col(tb, 'c5').values[6]], 'โฮลสไตน์');
  assert.equal(nextRowId(steps), 'n2');
  assert.throws(() => makeStep(steps, 'row-add', { rowId: 'r9', values: {} }), (e) => e.key === 'intake.step.invalid.row-add');
});

test('D4(b) recode: merge levels into a new column, the original stays; "ไม่ระบุ" merged into a missing value', () => {
  const cb = codebook();
  const steps = [importStep()];
  const d = nextDerivedKey(cb, steps);
  add(steps, 'recode', { column: 'c5', target: d, map: [{ from: ['โฮลสไตน์', 'เจอร์ซีย์'], to: 'พันธุ์แท้' }, { from: ['ไม่ระบุ'], to: null, reason: 'unknown' }] });
  const tb = applyRecipe(RAW, cb, steps);
  const out = col(tb, d);
  assert.equal(d, 'd1');
  assert.deepEqual(out.levels, ['พันธุ์แท้', 'ลูกผสม']);
  assert.deepEqual([...out.values], [0, 1, -1, 0, -1, 0]);
  assert.deepEqual([...out.missing], [0, 0, MISSING.unknown, 0, MISSING.unknown, 0]);
  assert.ok(col(tb, 'c5').levels.includes('ไม่ระบุ'), 'the original column is unchanged');
  const entry = tb.codebook.columns.find((c) => c.key === d);
  assert.equal(entry.derivation.kind, 'recode');
  assert.equal(entry.type, 'nominal');
});

test('D4(b) recode in place and the reference level; a merged reference follows its new name', () => {
  const steps = [importStep()];
  add(steps, 'reference', { column: 'c5', level: 'เจอร์ซีย์' });
  add(steps, 'recode', { column: 'c5', target: 'c5', map: [{ from: ['เจอร์ซีย์', 'ลูกผสม'], to: 'อื่น ๆ' }] });
  add(steps, 'reference', { column: 'c5', level: 'ไม่มีกลุ่มนี้' });
  const tb = applyRecipe(RAW, codebook(), steps);
  const c5 = col(tb, 'c5');
  assert.equal(c5.levels[c5.values[1]], 'อื่น ๆ');
  assert.equal(c5.levels[c5.values[3]], 'อื่น ๆ');
  const entry = tb.codebook.columns.find((c) => c.key === 'c5');
  assert.equal(entry.reference, 'อื่น ๆ');
  assert.deepEqual(tb.rejected.map((r) => r.key), ['intake.step.rejected.unknownLevel']);
});

test('D4(b) bin with stated cut-points; the cut source is kept for G13', () => {
  const steps = [importStep()];
  add(steps, 'bin', { column: 'c6', target: 'd1', cutpoints: [400, 500], closed: 'left', labels: ['เบา', 'กลาง', 'หนัก'], cutSource: 'literature' });
  add(steps, 'bin', { column: 'c6', target: 'd2', cutpoints: [420], closed: 'right', cutSource: 'typed' });
  const tb = applyRecipe(RAW, codebook(), steps);
  const d1 = col(tb, 'd1');
  assert.deepEqual(d1.levels, ['เบา', 'กลาง', 'หนัก']);
  assert.deepEqual([...d1.values], [0, 1, -1, 2, -1, -1]);
  assert.deepEqual([...d1.missing], [0, 0, MISSING.unknown, 0, MISSING.invalid, MISSING['not-recorded']]);
  const d2 = col(tb, 'd2');
  assert.deepEqual(d2.levels, ['<= 420', '> 420']);
  assert.equal(d2.values[1], 0, '420 falls in the lower range when closed right');
  const entry = tb.codebook.columns.find((c) => c.key === 'd1');
  assert.deepEqual({ cutSource: entry.derivation.cutSource, type: entry.type, reference: entry.reference }, { cutSource: 'literature', type: 'ordinal', reference: 'เบา' });
  assert.throws(() => makeStep(steps, 'bin', { column: 'c6', target: 'd3', cutpoints: [5, 5], closed: 'left', cutSource: 'typed' }), (e) => e.key === 'intake.step.invalid.bin');
});

test('D4(b) filter: analyse a subset; filtered rows are counted apart from excluded rows; a reason is required', () => {
  const steps = [importStep()];
  add(steps, 'row-exclude', { rowId: 'r6' }, 'ตัวอย่างเลือดแตก');
  add(steps, 'filter', { conditions: [{ column: 'c6', op: 'ge', value: 400 }, { column: 'c1', op: 'eq', value: 'F2' }], combine: 'or' }, 'เฉพาะโคที่หนักพอ หรืออยู่ฟาร์ม F2');
  const tb = applyRecipe(RAW, codebook(), steps);
  assert.deepEqual(tb.excluded, { r6: 's2', r1: 's3', r3: 's3' });
  assert.deepEqual(tb.excludedBy, { r6: 'row-exclude', r1: 'filter', r3: 'filter' });
  assert.throws(() => makeStep(steps, 'filter', { conditions: [{ column: 'c1', op: 'eq', value: 'F1' }], combine: 'and' }, ''), (e) => e.key === 'intake.step.reasonRequired');
  assert.throws(() => makeStep(steps, 'row-exclude', { rowId: 'r1' }), (e) => e.key === 'intake.step.reasonRequired');
  const s2 = [importStep()];
  add(s2, 'filter', { conditions: [{ column: 'c3', op: 'between', value: ['2024-01-01', '2024-12-31'] }, { column: 'c5', op: 'present' }], combine: 'and' }, 'เกิดในปี 2567 (พ.ศ.)');
  const tb2 = applyRecipe(RAW, codebook(), s2);
  assert.deepEqual(Object.keys(tb2.excluded).sort(), ['r3', 'r4', 'r5', 'r6']);
});

test('derive-age: whole months from birth to sampling, missing when either date is missing', () => {
  const steps = [importStep()];
  add(steps, 'derive-age', { birth: 'c3', event: 'c4', unit: 'months', target: 'd1' });
  add(steps, 'derive-age', { birth: 'c3', event: 'c4', unit: 'years', target: 'd2' });
  const tb = applyRecipe(RAW, codebook(), steps);
  // 2024-01-01 -> 2026-08-01 is 31 months; 2024-02-29 -> 2026-08-01 is 29 (the day has not come); 2023-06-15 -> 2026-08-08 is 37; 2023-08-01 -> 2026-08-08 is 36; 2025-12-31 -> 2026-08-08 is 7
  assert.deepEqual([...col(tb, 'd1').values], [31, 29, NaN, 37, 36, 7]);
  assert.equal(col(tb, 'd1').missing[2], MISSING.unknown);
  assert.deepEqual([...col(tb, 'd2').values], [2, 2, NaN, 3, 3, 0]);
  assert.equal(tb.codebook.columns.find((c) => c.key === 'd1').unit, 'months');
});

test('set-type and missing-code steps; unknown columns are rejected, never thrown', () => {
  const steps = [importStep()];
  add(steps, 'missing-code', { column: 'c5', code: 'ไม่ระบุ', reason: 'not-recorded' });
  add(steps, 'set-type', { column: 'c6', type: 'text' });
  add(steps, 'set-type', { column: 'c99', type: 'text' });
  const tb = applyRecipe(RAW, codebook(), steps);
  assert.equal(col(tb, 'c5').missing[2], MISSING['not-recorded']);
  assert.ok(!col(tb, 'c5').levels.includes('ไม่ระบุ'));
  assert.equal(col(tb, 'c6').kind, 'text');
  assert.equal(col(tb, 'c6').values[4], 'n/d');
  assert.equal(tb.invalid.c6, undefined);
  assert.deepEqual(tb.rejected, [{ stepId: 's4', key: 'intake.step.rejected.unknownColumn', params: { column: 'c99' } }]);
  assert.throws(() => validateStep('set-type', { column: 'c1', type: 'weird' }, null));
  assert.throws(() => validateStep('recode', { column: 'c5', target: 'x', map: [{ from: ['a'], to: 'b' }] }, null));
});

test('describeStep: one plain sentence per step, Thai and English, every key present', () => {
  const steps = [importStep()];
  add(steps, 'recode', { column: 'c5', target: 'd1', map: [{ from: ['ไม่ทราบ', 'ไม่ระบุ'], to: null, reason: 'unknown' }] });
  add(steps, 'bin', { column: 'c6', target: 'd2', cutpoints: [400, 500], closed: 'left', cutSource: 'median' });
  add(steps, 'filter', { conditions: [{ column: 'c1', op: 'in', value: ['F1', 'F2'] }], combine: 'and' }, 'สองฟาร์มแรก');
  add(steps, 'cell-edit', { rowId: 'r5', column: 'c6', from: 'n/d', to: '455' });
  add(steps, 'row-add', { rowId: 'n1', values: { c1: 'F3' } });
  add(steps, 'row-exclude', { rowId: 'r2' }, 'ซ้ำ');
  add(steps, 'reference', { column: 'c7', level: 'ลบ' });
  add(steps, 'set-type', { column: 'c6', type: 'count' });
  add(steps, 'missing-code', { column: 'c6', code: '', reason: 'not-recorded' });
  add(steps, 'derive-age', { birth: 'c3', event: 'c4', unit: 'months', target: 'd3' });
  const names = { c1: 'ฟาร์ม', c3: 'วันเกิด', c4: 'วันที่ตรวจ', c5: 'พันธุ์', c6: 'น้ำหนัก', c7: 'ผล', d1: 'พันธุ์ (รวม)', d2: 'น้ำหนัก (ช่วง)', d3: 'อายุ' };
  const th = steps.map((s) => describeStep(s, t('th'), names));
  const en = steps.map((s) => describeStep(s, t('en'), names));
  assert.equal(th[1], 'สร้าง พันธุ์ (รวม) จาก พันธุ์: "ไม่ทราบ" และ "ไม่ระบุ" เป็นค่าที่หายไป (ไม่ทราบ)');
  assert.equal(en[1], 'Made พันธุ์ (รวม) from พันธุ์: "ไม่ทราบ" and "ไม่ระบุ" to a missing value (unknown)');
  assert.equal(th[10], 'คำนวณ อายุ จาก วันเกิด ถึง วันที่ตรวจ นับเป็นเดือนเต็ม');
  assert.equal(en[3], 'Analysed only the rows where ฟาร์ม is "F1" and "F2". Reason: สองฟาร์มแรก');
  for (const s of [...th, ...en]) assert.ok(s && !/\{\w+\}|\[intake\./.test(s), s);
});
