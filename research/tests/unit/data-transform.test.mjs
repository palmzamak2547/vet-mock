// The structural recipe steps and the new row steps, replayed by applyRecipe [M2-DESIGN.md 4.1 to 4.5].
// Expected values are worked out by hand beside each case from the small made-up tables below
// (ข้อมูลสมมุติ / made-up data); the repeated-measures table is M2-DESIGN.md 3's `rm` dataset.
// OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRecipe, makeStep, validateStep, describeStep, nextDerivedKey, STEP_KINDS, M2_STEP_KINDS, EXCLUSION_CATEGORIES } from '../../src/lib/intake/recipe.js';
import { quantile7 } from '../../src/lib/intake/transform.js';
import { MISSING } from '../../src/lib/intake/missing.js';
import { exclusionCounts } from '../../src/lib/runtime/run.js';
import intake from '../../src/i18n/intake.js';
import data from '../../src/i18n/data.js';

const AT = '2026-09-28T00:00:00.000Z';

/** A raw table and its codebook from typed columns. */
function table(cols, opts = {}) {
  const n = cols[0].values.length;
  const raw = {
    header: cols.map((c) => c.name),
    columns: cols.map((c) => c.values.map((v) => (v == null ? '' : String(v)))),
    rowIds: Array.from({ length: n }, (_, i) => `r${i + 1}`),
    rowCount: n,
    source: { fileName: 'made-up.csv', bytes: 0, sha256: '', encoding: 'utf-8', format: 'csv', sheet: null, headerRow: 0, importedAt: AT },
  };
  const codebook = {
    columns: cols.map((c, i) => ({
      key: `c${i + 1}`, name: c.name, labelTh: c.name, labelEn: '', type: c.type, role: c.role || 'none', level: c.level || 'animal', unit: null,
      levels: (c.levels || []).map((v) => ({ value: v, labelTh: v, labelEn: '' })), reference: null, positive: c.positive ?? null,
      missingCodes: c.missingCodes || [], range: null, pii: null, hidden: false,
    })),
    unitOfAnalysis: opts.unit || 'animal',
    clusterKey: opts.clusterKey ?? null,
  };
  return { raw, codebook };
}
const step = (steps, kind, params, reason = null) => { const s = makeStep(steps, kind, params, reason); s.at = AT; steps.push(s); return s; };
const nums = (wt, key) => Array.from(wt.columns[key].values);
const texts = (wt, key) => {
  const c = wt.columns[key];
  return Array.from(c.values, (v, i) => (c.missing[i] ? null : c.kind === 'category' ? c.levels[v] : v));
};

// ---------------------------------------------------------------- merge

const animals = () => table([
  { name: 'รหัสสัตว์', type: 'id', values: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'] },
  { name: 'ฟาร์ม', type: 'nominal', values: ['F01', 'F01', 'F02', 'F03', '', 'F02'], role: 'cluster' },
  { name: 'น้ำหนัก', type: 'continuous', values: [410, 390, 455, 500, 372, 'abc'] },
], { clusterKey: 'c2' });
const farms = (dup = false) => table([
  { name: 'ฟาร์ม', type: 'nominal', values: dup ? ['F01', 'F02', 'F01'] : ['F01', 'F02', 'F04'] },
  { name: 'ขนาดฝูง', type: 'count', values: [120, 999, 45], missingCodes: [{ code: '999', reason: 'unknown' }] },
  { name: 'ภาค', type: 'nominal', values: ['เหนือ', 'กลาง', 'ใต้'], level: 'farm' },
]);

test('merge: many to one by key, unmatched rows kept with reason 6, unmatched keys listed, reasons carried', () => {
  const { raw, codebook } = animals();
  const f = farms();
  const steps = [];
  step(steps, 'merge', { sourceDatasetId: 'farms', sourceRev: 0, leftKey: 'c2', rightKey: 'c1', columns: ['c2', 'c3'] });
  const wt = applyRecipe(raw, codebook, steps, { farms: { raw: f.raw, codebook: f.codebook, steps: [] } });
  assert.deepEqual(wt.rejected, []);
  const rep = wt.transforms[0].report;
  // A1, A2 -> F01; A3, A6 -> F02; A4 -> F03 has no farm row; A5 has no farm at all; F04 has no animal
  assert.equal(rep.matched, 4);
  assert.deepEqual(rep.unmatchedLeft, ['r4']);
  assert.deepEqual(rep.missingLeftKey, ['r5']);
  assert.deepEqual(rep.unmatchedRight, ['F04']);
  assert.deepEqual(rep.keys, { c2: 'm1', c3: 'm2' });
  assert.deepEqual(wt.rowIds, ['r1', 'r2', 'r3', 'r4', 'r5', 'r6']);
  // herd size 120 for F01, F02's 999 is its missing code (unknown, reason 2), F03 and blank farm unmatched (6)
  assert.deepEqual(Array.from(wt.columns.m1.missing), [0, 0, 2, 6, 6, 2]);
  assert.deepEqual(nums(wt, 'm1').slice(0, 2), [120, 120]);
  assert.deepEqual(texts(wt, 'm2'), ['เหนือ', 'เหนือ', 'กลาง', null, null, 'กลาง']);
  assert.equal(MISSING.unmatched, 6);
  const m2 = wt.codebook.columns.find((c) => c.key === 'm2');
  assert.equal(m2.level, 'farm');
  assert.equal(m2.derivation.kind, 'merge');
  // the invalid weight before the merge is reported once, as before
  assert.equal(wt.invalid.c3.count, 1);
  assert.deepEqual(wt.invalid.c3.examples.map((e) => e.rowId), ['r6']);
  assert.equal(wt.codebook.clusterKey, 'c2');
});

test('merge: a key repeated on the right refuses the step with the list; the table is unchanged', () => {
  const { raw, codebook } = animals();
  const f = farms(true);
  const steps = [];
  step(steps, 'merge', { sourceDatasetId: 'farms', leftKey: 'c2', rightKey: 'c1', columns: ['c2'] });
  const wt = applyRecipe(raw, codebook, steps, { farms: { ...f, steps: [] } });
  assert.deepEqual(wt.rejected, [{ stepId: 's1', key: 'data.merge.duplicateKeys', params: { count: 1, list: 'F01' } }]);
  assert.equal(wt.columns.m1, undefined);
  assert.deepEqual(wt.transforms[0].report.duplicateRightKeys, ['F01']);
});

test('merge: a missing source or a loop is refused; the source is replayed with its own recipe first', () => {
  const { raw, codebook } = animals();
  const steps = [];
  step(steps, 'merge', { sourceDatasetId: 'farms', leftKey: 'c2', rightKey: 'c1', columns: ['c2'] });
  assert.equal(applyRecipe(raw, codebook, steps).rejected[0].key, 'data.merge.sourceMissing');
  // the farm file's own step excludes F02 (a row it drops before the merge)
  const f = farms();
  const fsteps = [];
  step(fsteps, 'row-exclude', { rowId: 'r2', category: 'duplicate' }, 'entered twice');
  const wt = applyRecipe(raw, codebook, steps, { farms: { ...f, steps: fsteps } });
  assert.deepEqual(Array.from(wt.columns.m1.missing), [0, 0, 6, 6, 6, 6]);
  assert.equal(wt.transforms[0].report.sourceRev, 1);
  // a loop: the farm file merges the animal file, which merges the farm file
  const loop = [];
  step(loop, 'merge', { sourceDatasetId: 'animals', leftKey: 'c1', rightKey: 'c2', columns: ['c1'] });
  const a = animals();
  const w2 = applyRecipe(raw, codebook, steps, { farms: { ...f, steps: loop }, animals: { ...a, steps } });
  assert.equal(w2.rejected.length, 0);
  // inside the farm file's replay the animal file's merge back to farms is refused (not an endless loop)
  assert.ok(w2.columns.m1);
});

test('merge then later steps: a filter and a computed column can use the brought columns', () => {
  const { raw, codebook } = animals();
  const f = farms();
  const steps = [];
  step(steps, 'merge', { sourceDatasetId: 'farms', leftKey: 'c2', rightKey: 'c1', columns: ['c2'] });
  step(steps, 'compute', { target: 'd1', expression: '{น้ำหนัก} / {ขนาดฝูง}', name: 'ต่อตัว' });
  step(steps, 'filter', { conditions: [{ column: 'm1', op: 'present' }], combine: 'and' }, 'farms with a known herd size');
  const wt = applyRecipe(raw, codebook, steps, { farms: { ...f, steps: [] } });
  assert.deepEqual(wt.rejected, []);
  // 410 / 120 and 390 / 120
  assert.equal(nums(wt, 'd1')[0], 410 / 120);
  assert.equal(nums(wt, 'd1')[1], 390 / 120);
  assert.deepEqual(Object.keys(wt.excluded).sort(), ['r3', 'r4', 'r5', 'r6']);
});

// ---------------------------------------------------------------- reshape

// M2-DESIGN.md 3 `rm`: eight animals x four times, animals 1-4 group A, 5-8 group B
const RM = [[45, 50, 55, 70], [42, 42, 45, 60], [36, 41, 43, 62], [39, 35, 40, 53], [51, 55, 59, 70], [44, 49, 56, 65], [40, 48, 51, 58], [47, 53, 57, 71]];
const rmWide = () => table([
  { name: 'animal', type: 'id', values: RM.map((_, i) => `a${i + 1}`) },
  { name: 'group', type: 'nominal', values: RM.map((_, i) => (i < 4 ? 'A' : 'B')) },
  ...[0, 1, 2, 3].map((t) => ({ name: `T${t + 1}`, type: 'continuous', values: RM.map((r) => r[t]) })),
]);

test('reshape long: one row per animal and time, row ids r7.1, times as an ordered column', () => {
  const { raw, codebook } = rmWide();
  const steps = [];
  step(steps, 'reshape-long', { idColumns: ['c1', 'c2'], stubs: [{ target: 'd2', columns: ['c3', 'c4', 'c5', 'c6'], name: 'weight' }], timeTarget: 'd1', times: ['T1', 'T2', 'T3', 'T4'], timeName: 'time' });
  const wt = applyRecipe(raw, codebook, steps);
  assert.deepEqual(wt.rejected, []);
  assert.equal(wt.n, 32);
  assert.deepEqual(wt.rowIds.slice(0, 5), ['r1.1', 'r1.2', 'r1.3', 'r1.4', 'r2.1']);
  assert.deepEqual(nums(wt, 'd2').slice(0, 8), [45, 50, 55, 70, 42, 42, 45, 60]);
  assert.deepEqual(texts(wt, 'd1').slice(0, 5), ['T1', 'T2', 'T3', 'T4', 'T1']);
  assert.deepEqual(texts(wt, 'c1').slice(0, 5), ['a1', 'a1', 'a1', 'a1', 'a2']);
  const time = wt.codebook.columns.find((c) => c.key === 'd1');
  assert.equal(time.type, 'ordinal');
  assert.deepEqual(time.levels.map((l) => l.value), ['T1', 'T2', 'T3', 'T4']);
  assert.equal(wt.codebook.unitOfAnalysis, 'visit');
  assert.equal(wt.columns.c3, undefined);
  // a later step names the new row ids
  const more = steps.slice();
  step(more, 'row-exclude', { rowId: 'r8.4', category: 'measurement-error' }, 'scale reset');
  const w2 = applyRecipe(raw, codebook, more);
  assert.deepEqual(w2.excluded, { 'r8.4': 's2' });
  // sum of the 31 values left: every value of rm (220 + 189 + 182 + 167 + 235 + 214 + 197 + 228 = 1,632) less 71
  assert.equal(nums(w2, 'd2').filter((_, i) => !(w2.rowIds[i] in w2.excluded)).reduce((a, b) => a + b, 0), 1632 - 71);
});

test('reshape wide undoes reshape long; a double row for one animal and time refuses the step', () => {
  const { raw, codebook } = rmWide();
  const steps = [];
  step(steps, 'reshape-long', { idColumns: ['c1', 'c2'], stubs: [{ target: 'd2', columns: ['c3', 'c4', 'c5', 'c6'] }], timeTarget: 'd1', times: ['T1', 'T2', 'T3', 'T4'] });
  step(steps, 'reshape-wide', { idColumn: 'c1', timeColumn: 'd1', valueColumns: ['d2'] });
  const wt = applyRecipe(raw, codebook, steps);
  assert.deepEqual(wt.rejected, []);
  assert.deepEqual(wt.rowIds, ['r1.1', 'r2.1', 'r3.1', 'r4.1', 'r5.1', 'r6.1', 'r7.1', 'r8.1']);
  const keys = wt.transforms[1].report.keys.d2;
  assert.deepEqual(keys, { T1: 'w1', T2: 'w2', T3: 'w3', T4: 'w4' });
  for (let t = 0; t < 4; t++) assert.deepEqual(nums(wt, keys[`T${t + 1}`]), RM.map((r) => r[t]));
  assert.deepEqual(texts(wt, 'c2'), ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']);
  assert.deepEqual(wt.transforms[1].report.varying, []);
  // a typed row for a3 at T2 (after the long step) makes two rows for one animal and time
  const extra = steps.slice(0, 1);
  step(extra, 'row-add', { rowId: 'n1', values: { c1: 'a3', d1: 'T2', d2: '40' } });
  const bad = applyRecipe(raw, codebook, [...extra, { ...steps[1], seq: 3, id: 's3' }]);
  assert.deepEqual(bad.rejected, [{ stepId: 's3', key: 'data.reshape.conflicts', params: { count: 1, list: 'a3 (T2)' } }]);
  assert.deepEqual(bad.transforms[1].report.conflicts, [{ id: 'a3', time: 'T2', rowIds: ['r3.2', 'n1'] }]);
});

test('reshape wide: conflicts listed by animal and time', () => {
  const t = table([
    { name: 'animal', type: 'id', values: ['a1', 'a1', 'a1', 'a2', 'a2'] },
    { name: 'time', type: 'ordinal', values: ['T1', 'T2', 'T2', 'T1', 'T2'], levels: ['T1', 'T2'] },
    { name: 'y', type: 'continuous', values: [1, 2, 3, 4, 5] },
  ]);
  const steps = [];
  step(steps, 'reshape-wide', { idColumn: 'c1', timeColumn: 'c2', valueColumns: ['c3'] });
  const wt = applyRecipe(t.raw, t.codebook, steps);
  assert.deepEqual(wt.rejected, [{ stepId: 's1', key: 'data.reshape.conflicts', params: { count: 1, list: 'a1 (T2)' } }]);
  assert.deepEqual(wt.transforms[0].report.conflicts, [{ id: 'a1', time: 'T2', rowIds: ['r2', 'r3'] }]);
  assert.equal(wt.n, 5);
});

// ---------------------------------------------------------------- aggregate

test('aggregate to farms: mean, median, count, proportion, any, all, first, min and max, in Thai-numeric key order', () => {
  const t = table([
    { name: 'farm', type: 'nominal', values: ['F10', 'F2', 'F2', 'F10', 'F10', 'F2', '', 'F2'] },
    { name: 'age', type: 'continuous', values: [30, 24, 18, 60, 'ไม่ทราบ', 36, 20, 12], missingCodes: [{ code: 'ไม่ทราบ', reason: 'unknown' }] },
    { name: 'elisa', type: 'binary', values: ['บวก', 'ลบ', 'บวก', 'บวก', 'ลบ', 'ลบ', 'บวก', 'ลบ'], levels: ['ลบ', 'บวก'], positive: 'บวก' },
    { name: 'sampled', type: 'date', values: ['2026-08-03', '2026-08-04', '2026-08-01', '2026-08-10', '2026-08-02', '2026-08-05', '2026-08-06', '2026-08-07'] },
  ]);
  const steps = [];
  step(steps, 'row-exclude', { rowId: 'r8', category: 'ineligible' }, 'calf under 12 months');
  step(steps, 'aggregate', {
    by: 'c1', level: 'farm', summaries: [
      { column: 'c2', fn: 'mean', target: 'd1' }, { column: 'c2', fn: 'median', target: 'd2' }, { column: 'c2', fn: 'count', target: 'd3' },
      { column: 'c3', fn: 'proportion', level: 'บวก', target: 'd4' }, { column: 'c3', fn: 'any', level: 'บวก', target: 'd5' },
      { column: 'c3', fn: 'all', level: 'บวก', target: 'd6' }, { column: 'c2', fn: 'first', target: 'd7' },
      { column: 'c4', fn: 'min', target: 'd8' }, { column: 'c4', fn: 'max', target: 'd9' }, { column: 'c2', fn: 'sum', target: 'd10' },
    ],
  });
  const wt = applyRecipe(t.raw, t.codebook, steps);
  assert.deepEqual(wt.rejected, []);
  // groups F2 (r2, r3, r6; r8 excluded) and F10 (r1, r4, r5); r7 has no farm
  assert.deepEqual(wt.rowIds, ['a1', 'a2']);
  assert.deepEqual(texts(wt, 'c1'), ['F2', 'F10']);
  assert.deepEqual(wt.transforms[0].report, { groups: 2, excludedRows: 1, missingBy: ['r7'] });
  // F2 ages 24, 18, 36: mean 26, median 24, count 3, sum 78; F10 ages 30, 60 (r5 unknown): mean 45, median 45, count 2, sum 90
  assert.deepEqual(nums(wt, 'd1'), [26, 45]);
  assert.deepEqual(nums(wt, 'd2'), [24, 45]);
  assert.deepEqual(nums(wt, 'd3'), [3, 2]);
  assert.deepEqual(nums(wt, 'd10'), [78, 90]);
  // F2 elisa ลบ, บวก, ลบ: 1/3 positive, any yes, all no; F10 บวก, บวก, ลบ: 2/3, yes, no
  assert.deepEqual(nums(wt, 'd4'), [1 / 3, 2 / 3]);
  assert.deepEqual(texts(wt, 'd5'), ['1', '1']);
  assert.deepEqual(texts(wt, 'd6'), ['0', '0']);
  assert.deepEqual(nums(wt, 'd7'), [24, 30]);
  // dates: F2 2026-08-04, 08-01, 08-05 -> min 08-01, max 08-05
  const d = wt.codebook.columns.find((c) => c.key === 'd8');
  assert.equal(d.type, 'date');
  assert.equal(nums(wt, 'd8')[0], nums(wt, 'd9')[0] - 4);
  assert.equal(wt.codebook.unitOfAnalysis, 'farm');
  assert.deepEqual(wt.excluded, {});
  assert.equal(quantile7([1, 2, 3, 4], 0.5), 2.5);
  assert.equal(quantile7([10, 20, 30, 40, 50], 0.25), 20);
});

test('aggregate refuses a mean of a category and a proportion without a level', () => {
  const t = table([
    { name: 'farm', type: 'nominal', values: ['F1', 'F1'] },
    { name: 'sex', type: 'nominal', values: ['m', 'f'], levels: ['m', 'f'] },
  ]);
  const s1 = [];
  step(s1, 'aggregate', { by: 'c1', summaries: [{ column: 'c2', fn: 'mean', target: 'd1' }] });
  assert.equal(applyRecipe(t.raw, t.codebook, s1).rejected[0].key, 'data.aggregate.needsNumber');
  assert.throws(() => validateStep('aggregate', { by: 'c1', summaries: [{ column: 'c2', fn: 'proportion', target: 'd1' }] }), (e) => e.key === 'data.step.invalid.aggregate');
  const s2 = [];
  step(s2, 'aggregate', { by: 'c1', summaries: [{ column: 'c2', fn: 'proportion', level: 'x', target: 'd1' }] });
  assert.equal(applyRecipe(t.raw, t.codebook, s2).rejected[0].key, 'data.aggregate.needsLevel');
});

// ---------------------------------------------------------------- compute and exclude-where

test('compute: a derived column from a formula; invalid rows listed; a yes/no result is binary; a parse error rejects with its position', () => {
  const t = table([
    { name: 'OD', type: 'continuous', values: [0.5, 0.2, '', 0.9] },
    { name: 'OD control', type: 'continuous', values: [1, 0, 1, 1.8] },
  ]);
  const steps = [];
  step(steps, 'compute', { target: 'd1', expression: '100 * (1 - {OD} / {OD control})', name: 'inhibition' });
  step(steps, 'compute', { target: 'd2', expression: '{d1} >= 50', name: 'high' });
  step(steps, 'compute', { target: 'd3', expression: '{OD} = 1' });
  const wt = applyRecipe(t.raw, t.codebook, steps);
  // r1 100 x (1 - 0.5) = 50; r2 divides by zero; r3 blank; r4 100 x (1 - 0.5) = 50
  assert.deepEqual(nums(wt, 'd1').map((v) => (Number.isNaN(v) ? null : v)), [50, null, null, 50]);
  assert.deepEqual(Array.from(wt.columns.d1.missing), [0, 5, 1, 0]);
  assert.equal(wt.invalid.d1.count, 1);
  assert.deepEqual(wt.invalid.d1.examples, [{ rowId: 'r2', value: '', key: 'data.expr.invalid.divideByZero' }]);
  const d2 = wt.codebook.columns.find((c) => c.key === 'd2');
  assert.equal(d2.type, 'binary');
  assert.equal(d2.positive, '1');
  assert.deepEqual(texts(wt, 'd2'), ['1', null, null, '1']);
  assert.deepEqual(wt.rejected, [{ stepId: 's3', key: 'data.expr.singleEquals', params: { at: 6 } }]);
  assert.equal(wt.codebook.columns.find((c) => c.key === 'd1').derivation.expression, '100 * (1 - {OD} / {OD control})');
});

test('exclude-where: rows leave the study with a category and a reason, counted as exclusions', () => {
  const t = table([
    { name: 'age', type: 'continuous', values: [3, 30, 40, 2, 50] },
    { name: 'sex', type: 'nominal', values: ['f', 'f', 'm', 'f', 'f'], levels: ['f', 'm'] },
  ]);
  const steps = [];
  step(steps, 'exclude-where', { conditions: [{ column: 'c1', op: 'lt', value: 6 }], combine: 'and', category: 'ineligible' }, 'younger than 6 months');
  step(steps, 'filter', { conditions: [{ column: 'c2', op: 'eq', value: 'f' }], combine: 'and' }, 'cows only');
  const wt = applyRecipe(t.raw, t.codebook, steps);
  assert.deepEqual(wt.excluded, { r1: 's1', r4: 's1', r3: 's2' });
  assert.deepEqual(wt.excludedBy, { r1: 'exclude-where', r4: 'exclude-where', r3: 'filter' });
  assert.deepEqual(exclusionCounts(wt, steps), [{ reason: 'excluded', column: null, count: 2 }, { reason: 'filter', column: null, count: 1 }]);
  assert.throws(() => validateStep('exclude-where', { conditions: [{ column: 'c1', op: 'lt', value: 6 }], combine: 'and', category: 'ineligible' }, ''), (e) => e.key === 'intake.step.reasonRequired');
  assert.throws(() => validateStep('exclude-where', { conditions: [{ column: 'c1', op: 'lt', value: 6 }], combine: 'and', category: 'bored' }, 'x'), (e) => e.key === 'data.step.invalid.category');
  assert.throws(() => validateStep('row-exclude', { rowId: 'r1', category: 'bored' }, 'x'), (e) => e.key === 'data.step.invalid.category');
  validateStep('row-exclude', { rowId: 'r1' }, 'x');
  for (const c of EXCLUSION_CATEGORIES) validateStep('row-exclude', { rowId: 'r1', category: c }, 'x');
});

// ---------------------------------------------------------------- bookkeeping

test('nextDerivedKey sees the targets of reshape and aggregate steps', () => {
  const steps = [
    { id: 's1', seq: 1, kind: 'reshape-long', params: { idColumns: ['c1'], stubs: [{ target: 'd4', columns: ['c2', 'c3'] }], timeTarget: 'd2', times: ['a', 'b'] } },
    { id: 's2', seq: 2, kind: 'aggregate', params: { by: 'c1', summaries: [{ column: 'd4', fn: 'mean', target: 'd7' }] } },
  ];
  assert.equal(nextDerivedKey({ columns: [] }, steps), 'd8');
});

test('describeStep: one sentence per new step in Thai and English, every key present', () => {
  const t = (lang) => (key, params = {}) => {
    const s = (key.startsWith('data.') ? data : intake)[lang][key];
    assert.ok(s, `${lang} ${key}`);
    return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] === undefined ? m : String(params[k])));
  };
  const steps = [
    { id: 's1', seq: 1, kind: 'merge', params: { sourceDatasetId: 'x', leftKey: 'c2', rightKey: 'c1', columns: ['c2', 'c3'] }, reason: null },
    { id: 's2', seq: 2, kind: 'reshape-long', params: { idColumns: ['c1'], stubs: [{ target: 'd2', columns: ['c2', 'c3'] }], timeTarget: 'd1', times: ['T1', 'T2'] }, reason: null },
    { id: 's3', seq: 3, kind: 'reshape-wide', params: { idColumn: 'c1', timeColumn: 'd1', valueColumns: ['d2'] }, reason: null },
    { id: 's4', seq: 4, kind: 'aggregate', params: { by: 'c1', level: 'farm', summaries: [{ column: 'c2', fn: 'proportion', level: 'บวก', target: 'd3' }, { column: 'c3', fn: 'mean', target: 'd4' }] }, reason: null },
    { id: 's5', seq: 5, kind: 'compute', params: { target: 'd5', expression: '{OD} * 2' }, reason: null },
    { id: 's6', seq: 6, kind: 'exclude-where', params: { conditions: [{ column: 'c1', op: 'lt', value: 6 }], combine: 'and', category: 'lost' }, reason: 'sold' },
    { id: 's7', seq: 7, kind: 'row-exclude', params: { rowId: 'r3', category: 'duplicate' }, reason: 'typed twice' },
  ];
  for (const lang of ['th', 'en']) {
    const lines = steps.map((s) => describeStep(s, t(lang), { c1: 'farm', c2: 'elisa', c3: 'age' }));
    for (const l of lines) assert.ok(!/\[|undefined|\{(column|columns|target|key|rightKey|count|stubs|times|id|time|by|level|summaries|expression|conditions|category|reason|rowId)\}/.test(l), l);
  }
  assert.equal(describeStep(steps[3], t('en'), { c1: 'farm', c2: 'elisa', c3: 'age' }), 'Summarised to one row per farm by farm: proportion with elisa "บวก" and mean of age');
  assert.deepEqual(M2_STEP_KINDS.filter((k) => !STEP_KINDS.includes(k)), []);
});

test('M1 replays are unchanged by the M2 machinery: no transforms, same codebook shape', () => {
  const t = table([{ name: 'x', type: 'continuous', values: [1, 2] }]);
  const wt = applyRecipe(t.raw, t.codebook, []);
  assert.deepEqual(wt.transforms, []);
  assert.deepEqual(Object.keys(wt.codebook), ['columns', 'unitOfAnalysis', 'clusterKey']);
});

test('dryRunStep shows what a merge would do before it is saved; outOfRange lists cells beyond the codebook range', async () => {
  const { dryRunStep, outOfRange } = await import('../../src/lib/intake/recipe.js');
  const { raw, codebook } = animals();
  const f = farms();
  const cand = makeStep([], 'merge', { sourceDatasetId: 'farms', leftKey: 'c2', rightKey: 'c1', columns: ['c2'] });
  const dry = dryRunStep(raw, codebook, [], cand, { farms: { ...f, steps: [] } });
  assert.equal(dry.rejected, null);
  assert.equal(dry.report.matched, 4);
  const bad = dryRunStep(raw, codebook, [], cand, { farms: { ...farms(true), steps: [] } });
  assert.deepEqual(bad.rejected, { key: 'data.merge.duplicateKeys', params: { count: 1, list: 'F01' } });
  // weight range 380..480 kg: 372 (r5) and 500 (r4) and 455 inside; r6 'abc' is not a number
  const cb2 = JSON.parse(JSON.stringify(codebook));
  cb2.columns[2].range = { min: 380, max: 480 };
  const wt = applyRecipe(raw, cb2, []);
  assert.deepEqual(outOfRange(wt), [{ column: 'c3', rowId: 'r4', value: 500, min: 380, max: 480 }, { column: 'c3', rowId: 'r5', value: 372, min: 380, max: 480 }]);
});
