// Intake: XLSX and XLS through SheetJS CE 0.20.3 [M1-DESIGN.md 8.1]. Workbooks are written in the test
// with SheetJS itself, so every cell's stored serial and number format is known exactly.
// Reference: Excel's 1900 system (serial 45000 = 2023-03-15) and 1904 system (1,462 days apart).
// OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { listSheets, readSheet } from '../../src/lib/intake/xlsx.js';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';

function book({ date1904 = false, bookType = 'xlsx' } = {}) {
  const off = date1904 ? 1462 : 0;
  const ws = {
    A1: { t: 's', v: 'แบบบันทึกฟาร์มโคนม' },
    A3: { t: 's', v: 'ฟาร์ม' }, B3: { t: 's', v: 'รหัสโค' }, C3: { t: 's', v: 'วันเกิด' }, D3: { t: 's', v: 'น้ำหนัก' },
    A4: { t: 's', v: 'F01' }, B4: { t: 's', v: 'F01-001' }, C4: { t: 'n', v: 45000 - off, z: 'dd/mm/yyyy' }, D4: { t: 'n', v: 1 / 3, z: '0.00' },
    A5: { t: 's', v: 'F01' }, B5: { t: 'n', v: 46024 - off, z: 'd-mmm' }, C5: { t: 'n', v: 45001.5 - off, z: 'dd/mm/yyyy hh:mm' }, D5: { t: 'n', v: 350 },
    A6: { t: 's', v: 'F01' }, B6: { t: 's', v: 'F01-003' }, C6: { t: 'n', v: 45002 - off, z: 'dd/mm/yyyy' }, D6: { t: 'e', v: 0x2a, w: '#N/A' },
    A7: { t: 's', v: 'F02' }, B7: { t: 's', v: 'F02-001' }, C7: { t: 'n', v: 45003 - off, z: 'dd/mm/yyyy' }, D7: { t: 'n', v: 402.5 },
    '!ref': 'A1:D7',
  };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ข้อมูล');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['note'], ['x']]), 'Notes');
  if (date1904) wb.Workbook = { ...(wb.Workbook || {}), WBProps: { date1904: true } };
  return new Uint8Array(XLSX.write(wb, { type: 'array', bookType }));
}

test('listSheets returns the sheet names in workbook order', async () => {
  assert.deepEqual(await listSheets(book()), ['ข้อมูล', 'Notes']);
});

for (const date1904 of [false, true]) {
  test(`readSheet, ${date1904 ? '1904' : '1900'} date system: title row skipped, dates from serials, raw numbers, ID Excel turned into a date`, async () => {
    const r = await readSheet(book({ date1904 }), { sheet: null });
    assert.equal(r.sheet, 'ข้อมูล');
    assert.equal(r.dateSystem, date1904 ? '1904' : '1900');
    assert.equal(r.headerRow, 2);
    assert.deepEqual(r.header, ['ฟาร์ม', 'รหัสโค', 'วันเกิด', 'น้ำหนัก']);
    assert.deepEqual(r.rows.map((x) => x[2]), ['2023-03-15', '2023-03-16 12:00:00', '2023-03-17', '2023-03-18']);
    assert.equal(r.rows[0][3], String(1 / 3), 'the stored value, not the two-decimal display');
    assert.equal(r.rows[2][3], '#N/A');
    assert.equal(r.errorCells, 1);
    // 46024 is 2 January 2026 in the 1900 system (typed "1-2"), shown with a format that has no year
    assert.equal(r.rows[1][1], '2-Jan');
    const idCell = r.excelDateCells.find((d) => d.col === 1);
    assert.deepEqual({ row: idCell.row, shown: idCell.shown }, { row: 1, shown: '2-Jan' });
    assert.equal(r.excelDateCells.filter((d) => d.col === 2).length, 4);
  });
}

test('readSheet: a named sheet, and a missing sheet is an error with an i18n key', async () => {
  const r = await readSheet(book(), { sheet: 'Notes' });
  assert.deepEqual(r.header, ['note']);
  await assert.rejects(() => readSheet(book(), { sheet: 'nope' }), (e) => e.key === 'intake.xlsx.sheetMissing');
});

test('old .xls (BIFF8, an OLE compound file) reads through the same path', async () => {
  const r = await readSheet(book({ bookType: 'biff8' }), { sheet: null });
  assert.deepEqual(r.header, ['ฟาร์ม', 'รหัสโค', 'วันเกิด', 'น้ำหนัก']);
  assert.equal(r.rows[0][2], '2023-03-15');
});

test('buildPreview on an xlsx: dates need no era question, the ID Excel turned into a date is proposed back', async () => {
  let p = await buildPreview(book(), { fileName: 'farm.xlsx', now: '2026-09-27T00:00:00.000Z' });
  assert.equal(p.file.format, 'xlsx');
  assert.equal(p.raw.source.encoding, 'xlsx');
  const entry = p.codebook.columns.find((c) => c.name === 'วันเกิด');
  assert.equal(entry.type, 'date');
  assert.ok(!p.questions.some((q) => q.column === entry.key && (q.kind === 'era' || q.kind === 'order')));
  const conv = p.conversions.find((c) => c.kind === 'excel-date-id');
  assert.deepEqual(conv.examples, [{ rowId: 'r2', from: '2-Jan', to: 'F01-002' }]);
  p = answerPreview(p, { [conv.questionId]: 'use-proposed' });
  const weight = p.blocking.find((b) => b.params.column === 'น้ำหนัก');
  assert.ok(weight, '#N/A in a number column needs an answer');
  p = answerPreview(p, { [weight.questionId]: 'missing' });
  assert.deepEqual(p.blocking, []);
  const cid = p.codebook.columns.find((c) => c.name === 'รหัสโค').key;
  assert.deepEqual(p.importStep.params.perColumn[cid].cellFixes, [{ rowId: 'r2', from: '2-Jan', to: 'F01-002', why: 'excel-date-id' }]);
});
