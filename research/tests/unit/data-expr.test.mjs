// Computed columns: the formula parser and evaluator [M2-DESIGN.md 4.4]. Each expected value is worked
// out by hand beside the expression (a textbook-style worked example, not a number copied from the code
// under test). The rejection cases prove the text is never run as code: names that reach an object's
// prototype chain in JavaScript, backticks, quotes and property access are refused with a position.
// OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExpression, evalRow, evaluateExpression, roundHalfAway, MAX_LENGTH, MAX_DEPTH } from '../../src/lib/intake/expr.js';
import { daysFromCivil } from '../../src/lib/intake/dates.js';

const COLS = [
  { key: 'c1', name: 'OD', type: 'continuous' },
  { key: 'c2', name: 'OD control', type: 'continuous' },
  { key: 'c3', name: 'W0', type: 'continuous' },
  { key: 'c4', name: 'W28', type: 'continuous' },
  { key: 'c5', name: 'วันเริ่ม', type: 'date' },
  { key: 'c6', name: 'วันชั่ง', type: 'date' },
  { key: 'c7', name: 'น้ำหนัก (กก.)', type: 'continuous' },
  { key: 'c8', name: 'ความยาว (ซม.)', type: 'continuous' },
  { key: 'c9', name: 'ผล ELISA', type: 'binary', positive: 'บวก' },
  { key: 'c10', name: 'เพศ', type: 'nominal' },
  { key: 'c11', name: 'จำนวนลูก', type: 'count' },
  { key: 'd1', name: 'อายุ', type: 'continuous' },
];
const day = (iso) => { const [y, m, d] = iso.split('-').map(Number); return daysFromCivil(y, m, d); };
const ROW = {
  c1: { miss: 0, num: 0.412, text: '0.412' },
  c2: { miss: 0, num: 1.25, text: '1.25' },
  c3: { miss: 0, num: 40.25, text: '40.25' },
  c4: { miss: 0, num: 52.5, text: '52.5' },
  c5: { miss: 0, num: day('2026-08-03'), text: '' },
  c6: { miss: 0, num: day('2026-08-31'), text: '' },
  c7: { miss: 0, num: 60, text: '60' },
  c8: { miss: 0, num: 120, text: '120' },
  c9: { miss: 0, num: 1, text: 'บวก' },
  c10: { miss: 0, num: 0, text: 'เมีย' },
  c11: { miss: 2, num: NaN, text: null }, // unknown (reason 2)
  d1: { miss: 0, num: 30, text: '30' },
};
const run = (text, row = ROW) => {
  const p = parseExpression(text, COLS);
  assert.ok(p.ok, `${text}: ${JSON.stringify(p)}`);
  return { ...evalRow(p.ast, (k) => row[k]), type: p.type };
};
const close = (a, b, msg) => assert.ok(Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b)), `${msg}: ${a} vs ${b}`);

// expression, expected value, worked out by hand
const VALUES = [
  // percent inhibition: 100 x (1 - 0.412 / 1.25) = 100 x (1 - 0.3296) = 67.04
  ['100 * (1 - {OD} / {OD control})', 67.04],
  // weight gain over 28 days: 52.5 - 40.25 = 12.25 kg
  ['{W28} - {W0}', 12.25],
  // average daily gain: 12.25 / 28 days = 0.4375 kg a day
  ['({W28} - {W0}) / daysBetween({วันเริ่ม}, {วันชั่ง})', 0.4375],
  // a BMI-style ratio: 60 / (120 / 100)^2 = 60 / 1.44 = 41.666...
  ['{น้ำหนัก (กก.)} / ({ความยาว (ซม.)} / 100)^2', 60 / 1.44],
  // precedence
  ['-2^2', -4], ['(-2)^2', 4], ['2^3^2', 512], ['2^-1', 0.5], ['2 * 3 + 4', 10], ['2 * (3 + 4)', 14],
  ['10 - 4 - 3', 3], ['100 / 10 / 5', 2], ['-{W0} + 50', 9.75], ['1 + 2 < 4', 1], ['1 + 2 >= 4', 0],
  ['not 0', 1], ['not 1 < 2', 0], ['1 and 0', 0], ['1 or 0', 1], ['0 or 0 and 1', 0], ['{OD} == 0.412', 1], ['{OD} != 0.412', 0],
  ['{OD} <> 1', 1], ['3 − 1', 2], ['2 × 3', 6], ['9 ÷ 3', 3], ['2 ≤ 2', 1], ['3 ≥ 4', 0], ['3 ≠ 4', 1],
  // functions
  ['abs(-3)', 3], ['sqrt(16)', 4], ['ln(exp(1))', 1], ['log10(1000)', 3], ['floor(-1.5)', -2], ['ceil(-1.5)', -1],
  ['min(3, 1, 2)', 1], ['max(3, 1, 2)', 3], ['sum(1, 2, 3)', 6], ['mean(1, 2, 3, 4)', 2.5], ['if(0, 1, 2)', 2], ['if(1, 1, 2)', 1],
  // round, half away from zero
  ['round(2.5)', 3], ['round(-2.5)', -3], ['round(1.005, 2)', 1.01], ['round(0.125, 2)', 0.13], ['round(1234.5, -2)', 1200], ['round(-0.4)', 0],
  // a yes/no column reads 1 when it is the positive level
  ['if({ผล ELISA}, 10, 20)', 10], ['{ผล ELISA} + 0', 1],
  // missing handled by isMissing
  ['isMissing({จำนวนลูก})', 1], ['isMissing({OD})', 0], ['if(isMissing({จำนวนลูก}), 0, {จำนวนลูก})', 0],
  // dates: 2026-08-03 to 2026-08-31 is 28 days
  ['daysBetween({วันเริ่ม}, {วันชั่ง})', 28], ['{วันชั่ง} - {วันเริ่ม}', 28],
  // Thai digits are read as Arabic digits; bare keys work; the same column by name or key
  ['๑๒ + 1', 13], ['c3 + 1', 41.25], ['{c3} + 1', 41.25], ['{d1} * 2', 60],
];

test('each formula gives the value worked out by hand', () => {
  for (const [text, want] of VALUES) {
    const r = run(text);
    assert.equal(r.m, 0, `${text} missing ${r.m}`);
    close(r.v, want, text);
  }
});

test('types: comparisons are yes/no, a date plus days is a date, a date minus a date is days', () => {
  assert.equal(parseExpression('{OD} > 1', COLS).type, 'boolean');
  assert.equal(parseExpression('{วันเริ่ม} + 30', COLS).type, 'date');
  assert.equal(parseExpression('30 + {วันเริ่ม}', COLS).type, 'date');
  assert.equal(parseExpression('{วันชั่ง} - {วันเริ่ม}', COLS).type, 'number');
  assert.equal(parseExpression('max({วันเริ่ม}, {วันชั่ง})', COLS).type, 'date');
  assert.equal(parseExpression('if({OD} > 1, {วันเริ่ม}, {วันชั่ง})', COLS).type, 'date');
  assert.equal(run('{วันเริ่ม} + 28').v, day('2026-08-31'));
  assert.deepEqual(parseExpression('{OD} + {W0} + {OD}', COLS).refs, ['c1', 'c3']);
});

test('a missing operand gives a missing result with its reason; invalid results are reason 5 with a key', () => {
  assert.deepEqual(run('{จำนวนลูก} * 2'), { v: NaN, m: 2, type: 'number' });
  assert.deepEqual(run('1 + {จำนวนลูก} > 3'), { v: NaN, m: 2, type: 'boolean' });
  // if takes only the branch it needs
  assert.equal(run('if(1, 5, {จำนวนลูก})').v, 5);
  const bad = [
    ['1 / 0', 'data.expr.invalid.divideByZero'], ['{OD} / ({OD} - {OD})', 'data.expr.invalid.divideByZero'],
    ['sqrt(-1)', 'data.expr.invalid.sqrtNegative'], ['ln(0)', 'data.expr.invalid.logNotPositive'], ['log10(-5)', 'data.expr.invalid.logNotPositive'],
    ['(-8)^(1/3)', 'data.expr.invalid.power'], ['exp(1000)', 'data.expr.invalid.tooLarge'], ['10^400', 'data.expr.invalid.tooLarge'],
    ['round(1.5, 0.5)', 'data.expr.invalid.roundDigits'], ['round(1, 16)', 'data.expr.invalid.roundDigits'],
    ['monthsBetween({วันชั่ง}, {วันเริ่ม})', 'data.expr.invalid.eventBeforeBirth'],
  ];
  for (const [text, key] of bad) {
    const r = run(text);
    assert.equal(r.m, 5, text);
    assert.equal(r.key, key, text);
  }
});

// expression, error key, 0-based position
const ERRORS = [
  ['', 'data.expr.empty', 0], ['   ', 'data.expr.empty', 0],
  ['{OD} = 1', 'data.expr.singleEquals', 5],
  ['1 +', 'data.expr.unexpectedEnd', 3],
  ['(1 + 2', 'data.expr.unclosedParen', 0],
  ['1 + 2)', 'data.expr.unexpectedClose', 5],
  ['1 2', 'data.expr.unexpectedToken', 2],
  ['1..2', 'data.expr.badNumber', 0], ['1.2.3', 'data.expr.badNumber', 0], ['1.', 'data.expr.badNumber', 0],
  ['{OD', 'data.expr.unclosedBrace', 0], ['{}', 'data.expr.emptyColumn', 0], ['OD}', 'data.expr.unexpectedChar', 2],
  ['{ไม่มีคอลัมน์นี้} + 1', 'data.expr.unknownColumn', 0],
  ['{เพศ} + 1', 'data.expr.columnNotNumber', 0],
  ['1 < 2 < 3', 'data.expr.chainedComparison', 6],
  ['{วันเริ่ม} * 2', 'data.expr.dateArithmetic', 11],
  ['{วันเริ่ม} + {วันชั่ง}', 'data.expr.dateArithmetic', 11],
  ['5 - {วันเริ่ม}', 'data.expr.dateArithmetic', 2],
  ['{วันเริ่ม} > 3', 'data.expr.dateCompare', 11],
  ['if(1, {วันเริ่ม}, 3)', 'data.expr.ifTypes', 0],
  ['daysBetween(1, 2)', 'data.expr.needsDates', 0],
  ['sum()', 'data.expr.argCountMin', 0], ['round(1, 2, 3)', 'data.expr.argCountRange', 0], ['sqrt(1, 2)', 'data.expr.argCount', 0],
  ['abs', 'data.expr.needsBrackets', 0], ['abs(', 'data.expr.unexpectedEnd', 4],
  ['and 1', 'data.expr.unexpectedToken', 0],
  // nothing reaches JavaScript itself
  ['constructor', 'data.expr.unknownName', 0], ['__proto__', 'data.expr.unknownName', 0], ['this', 'data.expr.unknownName', 0],
  ['toString', 'data.expr.unknownName', 0], ['hasOwnProperty', 'data.expr.unknownName', 0], ['Function', 'data.expr.unknownName', 0],
  ['window', 'data.expr.unknownName', 0], ['globalThis', 'data.expr.unknownName', 0], ['process', 'data.expr.unknownName', 0],
  ['constructor(1)', 'data.expr.unknownFunction', 0], ['eval(1)', 'data.expr.unknownFunction', 0], ['toString()', 'data.expr.unknownFunction', 0],
  ['__proto__(1)', 'data.expr.unknownFunction', 0], ['valueOf(1)', 'data.expr.unknownFunction', 0],
  ['`1`', 'data.expr.unexpectedChar', 0], ["'a'", 'data.expr.unexpectedChar', 0], ['"a"', 'data.expr.unexpectedChar', 0],
  ['{OD}.x', 'data.expr.unexpectedChar', 4], ['{OD}[0]', 'data.expr.unexpectedChar', 4], ['abs(1);', 'data.expr.unexpectedChar', 6],
  ['x => 1', 'data.expr.singleEquals', 2], ['a.b', 'data.expr.unexpectedChar', 1], ['c99', 'data.expr.unknownName', 0],
  ['1 = = 1', 'data.expr.singleEquals', 2], ['$', 'data.expr.unexpectedChar', 0], ['ก + 1', 'data.expr.unexpectedChar', 0],
];

test('every mistake is refused with a key and the position of the problem', () => {
  for (const [text, key, at] of ERRORS) {
    const p = parseExpression(text, COLS);
    assert.equal(p.ok, false, `${text} parsed`);
    assert.equal(p.key, key, `${text}: ${p.key}`);
    assert.equal(p.at, at, `${text}: position ${p.at}`);
  }
});

test('bounded: too long and too deep are refused, never recursed through', () => {
  assert.equal(parseExpression('1+'.repeat(600) + '1', COLS).key, 'data.expr.tooLong');
  assert.equal(parseExpression('1'.repeat(MAX_LENGTH + 1), COLS).key, 'data.expr.tooLong');
  const deep = '('.repeat(MAX_DEPTH + 5) + '1' + ')'.repeat(MAX_DEPTH + 5);
  assert.equal(parseExpression(deep, COLS).key, 'data.expr.tooDeep');
  const ok = '('.repeat(20) + '1' + ')'.repeat(20);
  assert.equal(parseExpression(ok, COLS).ok, true);
  assert.equal(parseExpression('-'.repeat(MAX_DEPTH + 5) + '1', COLS).key, 'data.expr.tooDeep');
  assert.equal(parseExpression('abs('.repeat(40) + '1' + ')'.repeat(40), COLS).key, 'data.expr.tooDeep');
});

test('random text never throws: every string parses or is refused with a key (seeded, 3000 strings)', () => {
  let s = 20260928;
  const rnd = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 2 ** 32; };
  const alphabet = ['1', '2', '.', '+', '-', '*', '/', '^', '(', ')', ',', '{', '}', 'OD', ' ', '<', '=', '!', 'and', 'or', 'not', 'if', 'abs', 'round', 'x', '`', '๑', 'W0', 'c3', 'ก'];
  const t0 = Date.now();
  for (let i = 0; i < 3000; i++) {
    let text = '';
    const len = Math.floor(rnd() * 25);
    for (let j = 0; j < len; j++) text += alphabet[Math.floor(rnd() * alphabet.length)];
    const p = parseExpression(text, COLS);
    if (!p.ok) {
      assert.match(p.key, /^data\.expr\./, text);
      assert.ok(Number.isInteger(p.at) && p.at >= 0 && p.at <= Math.max(text.length, MAX_LENGTH), text);
    } else {
      const r = evalRow(p.ast, (k) => ROW[k]);
      assert.ok(r.m === 0 ? Number.isFinite(r.v) : r.m > 0, text);
    }
  }
  assert.ok(Date.now() - t0 < 5000, 'fast');
});

test('the source has no eval, no new Function and no property lookup on names', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/lib/intake/expr.js', import.meta.url), 'utf8').replace(/\/\/.*$/gm, '');
  assert.ok(!/\beval\s*\(/.test(src));
  assert.ok(!/new\s+Function/.test(src));
  assert.ok(!/\bwith\s*\(/.test(src));
});

test('roundHalfAway: half away from zero on the decimal text', () => {
  assert.equal(roundHalfAway(0.5), 1);
  assert.equal(roundHalfAway(-0.5), -1);
  assert.equal(roundHalfAway(2.675, 2), 2.68);
  assert.equal(roundHalfAway(1e-7, 3), 0);
  assert.equal(roundHalfAway(15, -1), 20);
  assert.equal(Object.is(roundHalfAway(-0.2), 0), true);
});

test('evaluateExpression over a WorkingTable: values, missing reasons, invalid rows listed', () => {
  const table = {
    rowIds: ['r1', 'r2', 'r3', 'r4'], n: 4,
    columns: {
      c1: { key: 'c1', kind: 'number', values: Float64Array.from([0.5, 0.2, NaN, 0.9]), missing: Uint8Array.from([0, 0, 1, 0]) },
      c2: { key: 'c2', kind: 'number', values: Float64Array.from([1, 0, 1, 1.8]), missing: new Uint8Array(4) },
      c9: { key: 'c9', kind: 'category', values: Int32Array.from([0, 1, 0, -1]), levels: ['ลบ', 'บวก'], missing: Uint8Array.from([0, 0, 0, 2]) },
    },
  };
  const p = parseExpression('100 * (1 - {OD} / {OD control}) + {ผล ELISA}', COLS);
  const out = evaluateExpression(p.ast, table);
  close(out.values[0], 50, 'r1'); // 100 x (1 - 0.5) + 0
  assert.ok(Number.isNaN(out.values[1]));
  assert.deepEqual([...out.missing], [0, 5, 1, 2]); // r2 divides by zero, r3 blank, r4 unknown
  assert.deepEqual(out.invalidRows, [{ rowId: 'r2', key: 'data.expr.invalid.divideByZero' }]);
  assert.equal(out.invalid, 1);
});
