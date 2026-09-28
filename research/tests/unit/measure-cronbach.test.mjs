// Cronbach's alpha [M2-DESIGN.md 3.3.3]. Fixtures and their sources:
// - r-4.6.0 base-R formula and psych 2.6.5 alpha(): the architect's measure.R / measure.out
//   (work/loop-2026-09-26/research-m2/architect-r/, 28 Sep 2026) on the made-up `items` data
//   (twelve respondents, five Likert items), and the measure role's agree.R / agree.out
//   (work/loop-2026-09-26/research-m2/measure-r/, R 4.6.0 (2026-04-24) in webR 0.6.0, 28 Sep 2026: the
//   90% Feldt interval, two-item and three-item subsets, psych's r.drop and alpha.drop raw_alpha);
//   printed with sprintf('%.17g'). The rparity role turns both into tests/fixtures/r/ files.
// The `items` data are made-up data (ข้อมูลสมมุติ).
// Injected-wrong-value proof: EPI_INJECT=1 node --test tests/unit/measure-cronbach.test.mjs must go red.
// OWNER: measure role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runCronbach, cronbach, feldtCi, rawAlpha } from '../../src/lib/epi/cronbach.js';
import { close, CLOSED } from './epi-fixtures.mjs';

// Made-up data (M2-DESIGN.md 3 `items`): rows are respondents, columns items 1 to 5.
const ROWS = [
  [4, 5, 4, 4, 5], [3, 3, 4, 3, 3], [5, 5, 5, 4, 5], [2, 3, 2, 2, 3], [4, 4, 3, 4, 4], [3, 2, 3, 3, 2],
  [5, 4, 5, 5, 4], [2, 2, 1, 2, 3], [4, 4, 4, 5, 4], [3, 4, 3, 3, 3], [1, 2, 2, 1, 2], [4, 3, 4, 4, 5],
];
const COLS = [0, 1, 2, 3, 4].map((j) => ROWS.map((r) => r[j]));
const KEYS = ['c1', 'c2', 'c3', 'c4', 'c5'];

function numberTable(cols, keys = KEYS) {
  const n = cols[0].length;
  const columns = {};
  cols.forEach((c, j) => {
    columns[keys[j]] = { key: keys[j], kind: 'number', values: Float64Array.from(c, (x) => (x === null ? NaN : x)), missing: Uint8Array.from(c, (x) => (x === null ? 1 : 0)) };
  });
  return { rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`), columns, n, recipeRev: 0, excluded: {}, fingerprint: '' };
}
const spec = (items = KEYS, options = {}) => ({ method: 'rel.cronbach', roles: { items }, options: { confLevel: 0.95, ciMethod: 'feldt', ...options } });

test('five items: alpha, Feldt interval, standardized alpha, item-rest r and alpha if dropped (r-4.6.0, psych 2.6.5)', () => {
  const r = runCronbach(spec(), numberTable(COLS));
  assert.equal(r.status, 'ok');
  assert.equal(r.used, 12);
  close(r.values.alpha.value, 0.94618055555555558, CLOSED, 'alpha');
  close(r.values.alpha.ci[0], 0.87613325929912034, CLOSED, 'Feldt lower');
  close(r.values.alpha.ci[1], 0.98232950151725773, CLOSED, 'Feldt upper');
  assert.equal(r.values.alpha.ciMethod, 'feldt-1965');
  close(r.values.alphaStandardized.value, 0.9460883028988506, CLOSED, 'standardized');
  const t = r.tables.find((x) => x.id === 'items');
  assert.deepEqual(t.columns, ['item', 'mean', 'sd', 'itemRest', 'alphaIfDropped']);
  const dropped = [0.9151943462897526, 0.94300116324156646, 0.93624161073825507, 0.92808219178082185, 0.94300116324156646];
  const itemRest = [0.9511012772444225, 0.79872974488773252, 0.83996244722706359, 0.88366066133078569, 0.79872974488773252];
  const means = [3.3333333333333335, 3.4166666666666665, 3.3333333333333335, 3.3333333333333335, 3.5833333333333335];
  const sds = [1.2309149097933274, 1.0836246694508318, 1.2309149097933274, 1.2309149097933274, 1.0836246694508318];
  t.rows.forEach((row, j) => {
    assert.equal(row[0], KEYS[j]);
    close(row[1], means[j], CLOSED, `mean ${j + 1}`);
    close(row[2], sds[j], CLOSED, `sd ${j + 1}`);
    close(row[3], itemRest[j], CLOSED, `item-rest ${j + 1}`);
    close(row[4], dropped[j], CLOSED, `alpha if dropped ${j + 1}`);
  });
});

test('Feldt interval at 90% (r-4.6.0)', () => {
  const r = runCronbach(spec(KEYS, { confLevel: 0.9 }), numberTable(COLS));
  close(r.values.alpha.ci[0], 0.89160516252044109, CLOSED, 'lower');
  close(r.values.alpha.ci[1], 0.97864228464359371, CLOSED, 'upper');
  assert.equal(r.values.alpha.ciLevel, 0.9);
});

test('three items (1, 3, 5) and two items (1, 2) (r-4.6.0)', () => {
  const three = runCronbach(spec(['c1', 'c3', 'c5']), numberTable(COLS));
  close(three.values.alpha.value, 0.91331923890063427, CLOSED, 'alpha');
  close(three.values.alpha.ci[0], 0.77056884172315776, CLOSED, 'lower');
  close(three.values.alpha.ci[1], 0.97288723733668492, CLOSED, 'upper');
  close(three.values.alphaStandardized.value, 0.91314282996569052, CLOSED, 'standardized');
  const rows = three.tables[0].rows;
  [0.79045996592844969, 0.88188976377952755, 0.93617021276595747].forEach((v, j) => close(rows[j][4], v, CLOSED, `dropped ${j}`));
  [0.92225928056009077, 0.81937175856881794, 0.74983411572036851].forEach((v, j) => close(rows[j][3], v, CLOSED, `item-rest ${j}`));
  const two = runCronbach(spec(['c1', 'c2']), numberTable(COLS));
  close(two.values.alpha.value, 0.86762360446570974, CLOSED, 'alpha');
  close(two.values.alpha.ci[0], 0.54016424044637623, CLOSED, 'lower');
  close(two.values.alpha.ci[1], 0.96189180651878514, CLOSED, 'upper');
  close(two.values.alphaStandardized.value, 0.8716044356775835, CLOSED, 'standardized');
  close(two.tables[0].rows[0][3], 0.77242809457600814, CLOSED, 'with two items the item-rest r is their correlation');
  assert.equal(two.tables[0].rows[0][4], null, 'one item left has no alpha');
  assert.ok(two.notes.some((n) => n.key === 'measure.note.twoItems'));
});

test('ciMethod none: alpha without an interval', () => {
  const r = runCronbach(spec(KEYS, { ciMethod: 'none' }), numberTable(COLS));
  close(r.values.alpha.value, 0.94618055555555558, CLOSED, 'alpha');
  assert.equal(r.values.alpha.ci, undefined);
});

test('ordinal items whose levels are numbers are scored by the number, not the position', () => {
  const t = numberTable(COLS);
  // Item 1 as an ordinal column with levels written in Thai digits and out of order: the score is the number.
  const levels = ['๕', '๔', '๓', '๒', '๑'];
  t.columns.c1 = { key: 'c1', kind: 'category', levels, values: Int32Array.from(COLS[0], (x) => 5 - x), missing: new Uint8Array(12) };
  const r = runCronbach(spec(), t);
  close(r.values.alpha.value, 0.94618055555555558, CLOSED, 'same alpha');
  t.columns.c2 = { key: 'c2', kind: 'category', levels: ['เห็นด้วย', 'ไม่เห็นด้วย'], values: Int32Array.from(COLS[1], (x) => x % 2), missing: new Uint8Array(12) };
  assert.equal(runCronbach(spec(), t).reasonKey, 'measure.error.itemsNeedScores');
});

test('a respondent with a missing answer is dropped whole and counted once', () => {
  const cols = COLS.map((c) => c.slice());
  cols[2][0] = null; cols[4][0] = null; cols[1][7] = null;
  const r = runCronbach(spec(), numberTable(cols));
  assert.equal(r.used, 10);
  const byCol = Object.fromEntries(r.dropped.map((d) => [d.column, d.count]));
  assert.deepEqual(byCol, { c3: 1, c2: 1 });
  const rest = COLS.map((c) => c.filter((_, i) => i !== 0 && i !== 7));
  close(r.values.alpha.value, rawAlpha(rest), CLOSED, 'alpha on the complete rows');
});

test('undefined values are null with a sentence; negative alpha and reversed items get a note', () => {
  const flat = runCronbach(spec(['c1', 'c2']), numberTable([[3, 3, 3], [3, 3, 3]], ['c1', 'c2']));
  assert.equal(flat.values.alpha.value, null);
  assert.equal(flat.values.alpha.reasonKey, 'measure.undefined.noTotalVariance');
  assert.equal(flat.values.alphaStandardized.reasonKey, 'measure.undefined.itemNoVariance');
  const one = runCronbach(spec(['c1', 'c2']), numberTable([[3], [4]], ['c1', 'c2']));
  assert.equal(one.values.alpha.reasonKey, 'measure.undefined.needTwoRespondents');
  assert.equal(one.tables[0].rows[1][1], 4);
  // Item 3 scored the wrong way round: alpha falls and its item-rest r is negative.
  const rev = COLS.map((c, j) => (j === 2 ? c.map((x) => 6 - x) : c));
  const r = runCronbach(spec(), numberTable(rev));
  assert.ok(r.notes.some((n) => n.key === 'measure.note.itemRestNegative' && n.params.columns.includes('c3')));
  const neg = runCronbach(spec(['c1', 'c2']), numberTable([[1, 2, 3, 4], [4, 3, 1, 2]], ['c1', 'c2']));
  assert.ok(neg.values.alpha.value < 0);
  assert.ok(neg.notes.some((n) => n.key === 'measure.note.alphaNegative'));
  // Two exactly opposed items (r = -1): 1 + (k - 1) r = 0, so standardized alpha is null with a reason, never -Infinity.
  const opp = runCronbach(spec(['c1', 'c2']), numberTable([[1, 2, 3, 4, 5, 3], [5, 4, 3, 2, 1, 3]], ['c1', 'c2']));
  assert.equal(opp.values.alphaStandardized.value, null);
  assert.equal(opp.values.alphaStandardized.reasonKey, 'measure.undefined.itemsOpposed');
});

test('refusals: one item, the same item twice, no data', () => {
  assert.equal(runCronbach(spec(['c1']), numberTable(COLS)).reasonKey, 'measure.error.needTwoItems');
  assert.equal(runCronbach(spec('c1'), numberTable(COLS)).reasonKey, 'measure.error.needTwoItems');
  assert.equal(runCronbach(spec(['c1', 'c1']), numberTable(COLS)).reasonKey, 'measure.error.sameColumnTwice');
  assert.equal(runCronbach(spec(), null).reasonKey, 'measure.error.noData');
  assert.throws(() => cronbach([[1, 2]]), (e) => e.key === 'measure.error.needTwoItems');
});

test('feldtCi is the F interval of psych alpha.ci', () => {
  const [lo, hi] = feldtCi(0.94618055555555558, 12, 5, 0.95);
  close(lo, 0.87613325929912034, CLOSED, 'lower');
  close(hi, 0.98232950151725773, CLOSED, 'upper');
});
