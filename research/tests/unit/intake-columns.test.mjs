// Intake: type inference over whole columns, missing-value candidates, personal-data detection and
// the codebook [M1-DESIGN.md 8.2, 8.3; methods.md 5.1, 5.4, 5.6, 5.9]. OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inferColumn, parseNumber, suggestCluster, orderedLevels } from '../../src/lib/intake/infer.js';
import { findMissingCodes } from '../../src/lib/intake/missing.js';
import { detectPii, maskValue, isThaiNationalId, isThaiPhone } from '../../src/lib/intake/pii.js';
import { proposeCodebook, checkCodebook, binaryPolarity, unitFromHeader } from '../../src/lib/intake/codebook.js';

/** A Thai national ID with a valid check digit, built from 12 digits (the published checksum rule). */
function withCheckDigit(twelve) {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(twelve[i]) * (13 - i);
  return twelve + String((11 - (sum % 11)) % 10);
}

test('numbers: Thai digits, thousands commas; percent signs and decimal commas are not guessed', () => {
  assert.equal(parseNumber('๑๒.๕'), 12.5);
  assert.equal(parseNumber('1,234.5'), 1234.5);
  assert.equal(parseNumber(' -3e2 '), -300);
  assert.ok(Number.isNaN(parseNumber('25%')));
  assert.ok(Number.isNaN(parseNumber('12,5')));
  assert.ok(Number.isNaN(parseNumber('')));
});

test('inference reads the whole column: a text value on the last row is a conflict, not ignored', () => {
  const values = Array.from({ length: 1500 }, (_, i) => String(i % 40));
  values.push('n/d');
  const inf = inferColumn(values, 'น้ำหนัก (kg)');
  assert.equal(inf.type, 'count');
  assert.equal(inf.confidence, 'ask');
  assert.deepEqual(inf.conflicts, [{ value: 'n/d', count: 1 }]);
  const cont = inferColumn(['1.5', '2.25', 'ไม่ทราบ', ''], 'weight');
  assert.equal(cont.type, 'continuous');
  assert.deepEqual(cont.conflicts, [], 'candidate missing codes are not conflicts');
});

test('inference: binary, nominal, ordinal, id, text, dates', () => {
  assert.equal(inferColumn(['บวก', 'ลบ', 'บวก'], 'ผล ELISA').type, 'binary');
  assert.deepEqual(inferColumn(['1', '0', '1', '0'], 'x').levels, ['0', '1']);
  const nom = inferColumn(['โฮลสไตน์', 'ลูกผสมโฮลสไตน์', 'เจอร์ซีย์ลูกผสม', 'โฮลสไตน์', 'โฮลสไตน์', 'ลูกผสมโฮลสไตน์'], 'พันธุ์');
  assert.equal(nom.type, 'nominal');
  assert.deepEqual(nom.levels, ['เจอร์ซีย์ลูกผสม', 'โฮลสไตน์', 'ลูกผสมโฮลสไตน์'].sort(new Intl.Collator('th').compare));
  const ord = inferColumn(['มาก', 'น้อย', 'ปานกลาง', 'น้อย'], 'ความรุนแรง');
  assert.equal(ord.type, 'ordinal');
  assert.deepEqual(ord.levels, ['น้อย', 'ปานกลาง', 'มาก']);
  assert.deepEqual(orderedLevels(['severe', 'mild']), ['mild', 'severe']);
  assert.equal(inferColumn(['F01-001', 'F01-002', 'F01-003', 'F02-001', 'F02-002', 'F02-003'], 'รหัสโค').type, 'id');
  const zeros = inferColumn(['007', '012', '013', '101', '102', '103'], 'หมายเลขสัตว์');
  assert.equal(zeros.type, 'id', 'numbers written with leading zeros stay IDs');
  assert.equal(inferColumn(['15/11/2566', '01/06/2558', 'ไม่ทราบ', '-'], 'วันเกิด').type, 'date');
  assert.equal(inferColumn(['ป่วยเป็นไข้', 'ไอเล็กน้อย', 'ปกติดี', 'ท้องเสีย', 'ซึม'], 'อาการ').type, 'text');
});

test('missing codes: offered with a suggested reason; 999 only far above the other values', () => {
  const parity = ['0', '1', '2', '999', '-', '3', '999', ''];
  const found = findMissingCodes(parity);
  const byCode = Object.fromEntries(found.map((f) => [f.code, f]));
  assert.equal(byCode['999'].count, 2);
  assert.equal(byCode['999'].suggestedReason, 'unknown');
  assert.equal(byCode['-'].suggestedReason, 'not-recorded');
  assert.equal(byCode[''].count, 1);
  assert.deepEqual(byCode['999'].rows, [3, 6]);
  // 999 is a real weight here: not proposed
  assert.equal(findMissingCodes(['850', '999', '1020', '760']).some((f) => f.code === '999'), false);
  // Thai-digit 999 is the same code
  assert.equal(findMissingCodes(['1', '๙๙๙', '2']).find((f) => f.code === '999').count, 1);
  assert.equal(findMissingCodes(['ไม่ทราบ', 'ฉีด'])[0].suggestedReason, 'unknown');
  assert.equal(findMissingCodes(['-', '1'], { notApplicableRows: new Set([0]) })[0].suggestedReason, 'not-applicable');
});

test('personal data: 13-digit national ID with checksum, phone shapes, names, email, LINE ID, address', () => {
  const id = withCheckDigit('110170012345');
  assert.ok(isThaiNationalId(id));
  assert.ok(isThaiNationalId(`${id[0]}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id[12]}`));
  const wrong = id.slice(0, 12) + String((Number(id[12]) + 1) % 10);
  assert.ok(!isThaiNationalId(wrong), 'a wrong check digit is not an ID');
  assert.equal(detectPii([id, withCheckDigit('310120045678'), withCheckDigit('510160098765')], 'เลขบัตร').kind, 'national-id');
  assert.equal(detectPii(['1234567890123', '9876543210987'], 'รหัส'), null, '13 digits without a valid checksum');
  // phone shapes, including the 000- shape of the repo's serosurvey fixture (no operator assigns it)
  for (const p of ['086-931-1307', '0869311307', '02-218-9000', '+66 86 931 1307', '000-001-1307']) assert.ok(isThaiPhone(p), p);
  assert.ok(!isThaiPhone('F04-007') && !isThaiPhone('12345'));
  assert.equal(detectPii(['000-001-1307', '000-002-4471', '000-003-0902'], 'เบอร์โทร').kind, 'phone');
  assert.equal(detectPii(['ชัยวัฒน์ รักษ์ไทย', 'สมศรี ใจดี', 'บุญมี ทองดี'], 'ชื่อเจ้าของ').kind, 'name');
  assert.equal(detectPii(['นายสมชาย ใจดี', 'นางสาวมาลี มีสุข'], 'ผู้ให้ข้อมูล').kind, 'name', 'titles without a name header');
  assert.equal(detectPii(['John Smith', 'Mary Jones'], 'Owner name').kind, 'name');
  assert.equal(detectPii(['โฮลสไตน์', 'ลูกผสม'], 'ชื่อพันธุ์'), null, 'a breed name is not a person');
  assert.equal(detectPii(['ข้าวหอม', 'ถั่วดำ'], 'ชื่อสุนัข'), null, "a dog's name is not a person");
  assert.equal(detectPii(['a@b.co', 'c.d@e.org'], 'contact').kind, 'email');
  assert.equal(detectPii(['@farmdee', 'somchai.99'], 'LINE').kind, 'line-id');
  assert.equal(detectPii(['12 หมู่ 3 ต.หนองโพ อ.โพธาราม จ.ราชบุรี', '45/2 ม.1 ต.บ้านเลือก'], 'ที่อยู่').kind, 'address');
  assert.equal(detectPii(['F01', 'F02'], 'ฟาร์ม'), null);
});

test('masks: names keep the first letter of each word, phones the first and last two digits', () => {
  assert.equal(maskValue('ชัยวัฒน์ รักษ์ไทย', 'name'), 'ช*** ร***');
  assert.equal(maskValue('086-931-1307', 'phone'), '08x-xxx-xx07');
  assert.equal(maskValue('000-001-1307', 'phone'), '00x-xxx-xx07');
  assert.equal(maskValue('1-1017-00123-45-6', 'national-id'), 'x-xxxx-xxxx3-45-6');
  assert.equal(maskValue('somchai@farm.co.th', 'email'), 's***@farm.co.th');
  assert.equal(maskValue('', 'name'), '');
});

test('binary polarity, units from headers', () => {
  assert.deepEqual(binaryPolarity(['บวก', 'ลบ']), { negative: 'ลบ', positive: 'บวก' });
  assert.deepEqual(binaryPolarity(['ฉีด', 'ไม่ฉีด']), { negative: 'ไม่ฉีด', positive: 'ฉีด' });
  assert.deepEqual(binaryPolarity(['Yes', 'No']), { negative: 'No', positive: 'Yes' });
  assert.equal(binaryPolarity(['เมีย', 'ผู้']), null);
  assert.equal(unitFromHeader('ขนาดฝูง (ตัว)'), 'ตัว');
  assert.equal(unitFromHeader('น้ำหนัก [kg]'), 'kg');
  assert.equal(unitFromHeader('อายุ'), null);
});

const RAW = {
  header: ['ฟาร์ม', 'รหัสสัตว์', 'ชื่อเจ้าของ', 'เพศ', 'ผล', 'ขนาดฝูง (ตัว)'],
  columns: [
    ['F1', 'F1', 'F1', 'F2', 'F2', 'F3', 'F3', 'F3'],
    ['a1', 'a2', 'a3', 'b1', 'b2', 'c1', 'c2', 'c3'],
    ['สมชาย ใจดี', 'สมชาย ใจดี', 'สมชาย ใจดี', 'มาลี มีสุข', 'มาลี มีสุข', 'วีระ ทองดี', 'วีระ ทองดี', 'วีระ ทองดี'],
    ['เมีย', 'เมีย', 'ผู้', 'เมีย', 'เมีย', 'ผู้', 'เมีย', 'เมีย'],
    ['บวก', 'ลบ', 'ลบ', 'บวก', 'บวก', 'ลบ', 'ลบ', 'บวก'],
    ['30', '30', '30', '12', '12', '55', '55', '55'],
  ],
  rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'],
  rowCount: 8,
  source: { fileName: 't.csv', bytes: 1, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: '2026-09-27T00:00:00.000Z' },
};

test('cluster suggestion: the farm column (herd size repeats per farm but is a count, never a group)', () => {
  const c = suggestCluster(RAW, { skip: new Set(['c3']) });
  assert.deepEqual(c, { key: 'c1', groups: 3, meanSize: 8 / 3, level: 'farm' });
});

test('proposeCodebook: roles, levels, polarity, farm-level columns, personal data hidden', () => {
  const cb = proposeCodebook(RAW);
  assert.equal(cb.clusterKey, 'c1');
  assert.equal(cb.unitOfAnalysis, 'animal');
  const by = Object.fromEntries(cb.columns.map((c) => [c.key, c]));
  assert.equal(by.c1.role, 'cluster');
  assert.equal(by.c1.level, 'farm');
  assert.equal(by.c2.role, 'id');
  assert.equal(by.c3.pii, 'name');
  assert.equal(by.c3.hidden, true);
  assert.equal(by.c3.type, 'text');
  assert.equal(by.c3.level, 'farm', 'one owner per farm');
  assert.equal(by.c4.level, 'animal');
  assert.equal(by.c5.role, 'outcome');
  assert.deepEqual(by.c5.levels.map((l) => l.value), ['ลบ', 'บวก']);
  assert.equal(by.c5.positive, 'บวก');
  assert.equal(by.c5.reference, 'ลบ');
  assert.equal(by.c5.labelEn, '');
  assert.equal(by.c6.type, 'count');
  assert.equal(by.c6.level, 'farm');
  assert.equal(by.c6.unit, 'ตัว');
  assert.deepEqual(by.c6.range, { min: 12, max: 55 });
  assert.deepEqual(checkCodebook(cb), { ok: true, issues: [] });
});

test('checkCodebook catches what a student edit can break', () => {
  const cb = proposeCodebook(RAW);
  const bad = JSON.parse(JSON.stringify(cb));
  const by = Object.fromEntries(bad.columns.map((c) => [c.key, c]));
  by.c4.role = 'cluster';
  by.c5.positive = 'ไม่มี';
  by.c4.type = 'binary';
  by.c4.levels = [{ value: 'ผู้', labelTh: 'ผู้', labelEn: '' }, { value: 'ผู้', labelTh: 'ผู้', labelEn: '' }, { value: 'เมีย', labelTh: 'เมีย', labelEn: '' }];
  by.c6.missingCodes = [{ code: '999', reason: 'lost' }];
  const r = checkCodebook(bad);
  const keys = r.issues.map((i) => i.key);
  assert.equal(r.ok, false);
  for (const k of ['manyClusters', 'positiveUnknown', 'duplicateLevel', 'binaryLevels', 'missingReason']) assert.ok(keys.includes(`intake.codebook.issue.${k}`), k);
});

test('PII: phone numbers that lost their leading 0 and English names in any case (review round 1)', () => {
  assert.equal(detectPii(['812345678', '891112222', '623334444'], 'เบอร์โทร').kind, 'phone');
  assert.equal(detectPii(['812345678', '891112222', '623334444'], 'Phone').kind, 'phone');
  assert.equal(detectPii(['23456789', '25551234'], 'โทรศัพท์บ้าน').kind, 'phone', 'a landline without its 0');
  assert.equal(detectPii(['812345678', '891112222', '623334444'], 'จำนวนโค'), null, 'plain numbers without a phone header stay data');
  assert.equal(detectPii(['john smith', 'mary jones'], 'name').kind, 'name');
  assert.equal(detectPii(['JOHN SMITH', 'MARY JONES'], 'Owner').kind, 'name');
  assert.equal(detectPii(['John A. Smith', 'Mary B. Jones'], 'Name').kind, 'name');
  assert.equal(detectPii(['สมชาย ใจดี', 'มาลี มีสุข'], 'ชื่อ-นามสกุล').kind, 'name');
  assert.equal(detectPii(['A', 'B'], 'Name'), null, 'initials alone are not a name');
  assert.equal(detectPii(['Holstein', 'Brahman'], 'Breed name'), null);
  assert.equal(maskValue('812345678', 'phone'), '81xxxxx78');
});

test('PII shapes: a bracketed area code and a bracketed nickname (review round 2)', () => {
  assert.ok(isThaiPhone('(02) 345 6789'));
  assert.ok(!isThaiPhone('(ไม่มี)'));
  const d = detectPii(['สมชาย ใจดี (ต้น)', 'สมหญิง รักษ์ดี (แดง)', 'บุญมี ศรีสุข (หนุ่ม)', 'วิชัย ทองดี'], 'ชื่อเจ้าของ');
  assert.equal(d?.kind, 'name');
});
