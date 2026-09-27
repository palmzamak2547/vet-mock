// Intake: dates, Buddhist Era, two-digit years, 29 February, Excel serials [M1-DESIGN.md 8.2;
// methods.md 5.3]. Reference values: the civil calendar (checked against Date.UTC below), Microsoft's
// documented 1900 and 1904 systems (1,462 days apart; serial 60 is the Lotus 29 Feb 1900), and the
// serosurvey numbers.json conv block. OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  daysFromCivil, civilFromDays, isoFromDays, beToCe, parseDate, sniffDates, excelSerialToDays, monthsBetween,
  formatDate, excelDateIdParts, dateParts, monthFromName,
} from '../../src/lib/intake/dates.js';
import { decodeBytes } from '../../src/lib/intake/decode.js';
import { parseDelimited } from '../../src/lib/intake/csv.js';
import { inferColumn } from '../../src/lib/intake/infer.js';

const expected = JSON.parse(readFileSync(new URL('../fixtures/intake/expected.json', import.meta.url), 'utf8'));
const iso = (r) => ('days' in r ? isoFromDays(r.days) : r.invalid);

test('civil calendar arithmetic agrees with Date.UTC over 1800..2300 (every 97th day)', () => {
  for (let d = daysFromCivil(1800, 1, 1); d < daysFromCivil(2300, 1, 1); d += 97) {
    const [y, m, dd] = civilFromDays(d);
    assert.equal(Date.UTC(y, m - 1, dd) / 864e5, d);
    assert.equal(daysFromCivil(y, m, dd), d);
  }
  assert.equal(daysFromCivil(1970, 1, 1), 0);
  assert.equal(isoFromDays(daysFromCivil(2024, 2, 29)), '2024-02-29');
});

test('BE to CE: 543 years, 542 for January to March before BE 2484 (the year began on 1 April)', () => {
  assert.equal(beToCe(2569, 9), 2026);
  assert.equal(beToCe(2482, 2), 1940);
  assert.equal(beToCe(2482, 4), 1939);
  assert.equal(iso(parseDate('15/01/2482', { order: 'dmy', era: 'BE' })), '1940-01-15');
});

test('29 February exists in BE 2567 (CE 2024) and not in "2567" read as CE', () => {
  assert.equal(iso(parseDate('29/02/2567', { order: 'dmy', era: 'BE' })), '2024-02-29');
  assert.equal(iso(parseDate('29/02/2567', { order: 'dmy', era: 'CE' })), 'intake.date.invalid.feb29');
  assert.equal(iso(parseDate('29/02/2566', { order: 'dmy', era: 'BE' })), 'intake.date.invalid.feb29');
  const s = sniffDates(['29/02/2567', '15/03/2566', '01/01/2567']);
  assert.equal(s.era, 'BE');
  assert.deepEqual({ count: s.feb29.count, validAsBE: s.feb29.validAsBE, validAsCE: s.feb29.validAsCE }, { count: 1, validAsBE: 1, validAsCE: 0 });
  assert.ok(s.evidence.some((e) => e.key === 'intake.date.evidence.feb29OnlyBE'));
});

test('two-digit years are asked once per column: "8/8/69" is BE 2569 with century 2500, CE 2069 with 2000', () => {
  assert.equal(iso(parseDate('8/8/69', { order: 'dmy', era: 'BE', twoDigitCentury: null })), 'intake.date.invalid.twoDigitUnanswered');
  assert.equal(iso(parseDate('8/8/69', { order: 'dmy', era: 'BE', twoDigitCentury: 2500 })), '2026-08-08');
  assert.equal(iso(parseDate('8/8/69', { order: 'dmy', era: 'BE', twoDigitCentury: 2000 })), '2069-08-08');
  assert.equal(iso(parseDate('8/8/69', { order: 'dmy', era: 'CE', twoDigitCentury: 1900 })), '1969-08-08');
  const s = sniffDates(['03/08/2569', '8/8/69', '8/8/69']);
  assert.equal(s.twoDigitYears, 2);
  assert.equal(s.twoDigitExample, '8/8/69');
  assert.equal(s.confident, false);
});

test('day-first unless a value settles otherwise; a value above 12 in each position is a conflict', () => {
  assert.equal(sniffDates(['13/08/2569', '03/08/2569']).order, 'dmy');
  assert.equal(sniffDates(['08/13/2026', '08/03/2026']).order, 'mdy');
  const unsettled = sniffDates(['03/08/2569', '05/07/2569']);
  assert.equal(unsettled.order, null);
  assert.ok(unsettled.evidence.some((e) => e.key === 'intake.date.evidence.orderUnsettled'));
  const clash = sniffDates(['13/08/2026', '08/13/2026']);
  assert.equal(clash.order, null);
  assert.equal(clash.orderConflict, true);
  assert.equal(iso(parseDate('03/08/2569', { order: 'mdy', era: 'BE' })), '2026-03-08');
  assert.equal(iso(parseDate('03/08/2569', { order: null, era: 'BE' })), 'intake.date.invalid.orderUnanswered');
  assert.equal(sniffDates(['2024-02-29']).order, 'ymd');
});

test('Thai digits, Thai and English month names, ISO dates and times', () => {
  assert.equal(iso(parseDate('๒๖/๐๘/๒๕๖๖', { order: 'dmy', era: 'BE' })), '2023-08-26');
  assert.equal(iso(parseDate('25 ก.ย. 2569', { order: 'dmy', era: 'BE' })), '2026-09-25');
  assert.equal(iso(parseDate('25 กันยายน 2569', { order: 'dmy', era: 'BE' })), '2026-09-25');
  assert.equal(iso(parseDate('25-Sep-2026', { order: 'dmy', era: 'CE' })), '2026-09-25');
  assert.equal(iso(parseDate('Sep 25, 2026', { order: 'dmy', era: 'CE' })), '2026-09-25');
  assert.equal(iso(parseDate('2026-09-25', { order: null, era: null })), '2026-09-25');
  assert.equal(iso(parseDate('2569-09-25', { order: null, era: null })), '2026-09-25', 'a BE year typed into an ISO date cell');
  const t = parseDate('2026-09-25 14:30', { order: null, era: null });
  assert.equal(iso(t), '2026-09-25');
  assert.equal(t.time, true);
  assert.equal(monthFromName('มี.ค.'), 3);
  assert.equal(dateParts('F04-001'), null);
});

test('Excel serials: 1900 system (Lotus 29 Feb 1900 at 60) and 1904 system, 1,462 days apart', () => {
  assert.equal(isoFromDays(excelSerialToDays(1, '1900')), '1900-01-01');
  assert.equal(isoFromDays(excelSerialToDays(59, '1900')), '1900-02-28');
  assert.ok(Number.isNaN(excelSerialToDays(60, '1900')));
  assert.equal(isoFromDays(excelSerialToDays(61, '1900')), '1900-03-01');
  assert.equal(isoFromDays(excelSerialToDays(25569, '1900')), '1970-01-01');
  assert.equal(isoFromDays(excelSerialToDays(45000, '1900')), '2023-03-15');
  assert.equal(isoFromDays(excelSerialToDays(45000.75, '1900')), '2023-03-15');
  assert.equal(isoFromDays(excelSerialToDays(0, '1904')), '1904-01-01');
  assert.equal(excelSerialToDays(45000 - 1462, '1904'), excelSerialToDays(45000, '1900'));
  const e = expected['excel-serials.csv'];
  const p = parseDelimited(decodeBytes(new Uint8Array(readFileSync(new URL('../fixtures/intake/excel-serials.csv', import.meta.url)))).text);
  const col = p.rows.map((r) => r[0]);
  const inf = inferColumn(col, p.header[0]);
  assert.equal(inf.type, e.type);
  assert.equal(inf.excelSerial, e.excelSerial);
  assert.deepEqual(col.map((v) => iso(parseDate(v, { order: null, era: null, excelSystem: '1900' }))), e.iso1900);
  assert.deepEqual(col.map((v) => iso(parseDate(v, { order: null, era: null, excelSystem: '1904' }))), e.iso1904);
});

test('age in whole months as numbers.json computes it; dates print with their era', () => {
  const b = daysFromCivil(2023, 11, 15);
  assert.equal(monthsBetween(b, daysFromCivil(2026, 8, 3)), 32);
  assert.equal(monthsBetween(b, daysFromCivil(2026, 8, 15)), 33);
  assert.equal(monthsBetween(daysFromCivil(2024, 2, 29), daysFromCivil(2026, 8, 8)), 29);
  assert.equal(formatDate(daysFromCivil(2026, 9, 25), 'th'), '25 ก.ย. พ.ศ. 2569');
  assert.equal(formatDate(daysFromCivil(2026, 9, 25), 'en'), '25 Sep 2026 CE');
  assert.equal(formatDate(NaN, 'en'), '—');
});

test('IDs Excel turned into dates: "7-Apr" and "Apr-12" give day and month; real IDs do not', () => {
  assert.deepEqual(excelDateIdParts('7-Apr'), { day: 7, month: 4 });
  assert.deepEqual(excelDateIdParts('Apr-12'), { day: 12, month: 4 });
  assert.deepEqual(excelDateIdParts('7-เม.ย.'), { day: 7, month: 4 });
  assert.equal(excelDateIdParts('F04-007'), null);
  assert.equal(excelDateIdParts('4-7'), null);
});

test('feb29-be.csv: the file settles its own era (fixtures/intake/expected.json)', () => {
  const e = expected['feb29-be.csv'];
  const p = parseDelimited(decodeBytes(new Uint8Array(readFileSync(new URL('../fixtures/intake/feb29-be.csv', import.meta.url)))).text);
  const col = p.rows.map((r) => r[0]);
  const s = sniffDates(col);
  assert.equal(s.era, e.era);
  assert.equal(s.evidence.some((x) => x.key === 'intake.date.evidence.feb29OnlyBE'), e.feb29OnlyBE);
  assert.deepEqual(col.map((v) => iso(parseDate(v, { order: 'dmy', era: s.era }))), e.iso);
});
