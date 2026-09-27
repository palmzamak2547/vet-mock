// What the result view, the CI plot, Table 1 and the sample-size screen show, built from envelopes.
// Numbers are never typed here: the expected numbers come from the course fixture (the sample-size
// test runs the engine and compares with the course's own answers) or are passed through unchanged.
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportTable, isStale, pText, plottable, primaryValueName, testLabel, valueCells, valueLabel, valueRows, ciLevelText, plotSummary } from '../../src/workspace/lib/result-model.js';
import { ciPlotLayout, linearTicks, logTicks, tickText } from '../../src/workspace/lib/ci-plot.js';
import { table1Blocks, table1Export } from '../../src/workspace/lib/table1-model.js';
import { exampleParams, parseParams } from '../../src/workspace/lib/sample-size.js';
import { buildSpec } from '../../src/workspace/lib/method-ui.js';
import { table1 } from '../../src/lib/stats/table1.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../src/lib/runtime/spec.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import ws from '../../src/i18n/workspace.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const courseFile = path.resolve(here, '../fixtures/course/epi-course-2026.json');
const course = JSON.parse(readFileSync(courseFile, 'utf8'));

/** The workspace dictionary as `t`, with {name} placeholders filled; a missing key comes back bracketed. */
const tOf = (lang) => (key, params) => {
  const s = ws[lang][key];
  if (s === undefined) return `[${key}]`;
  return params ? s.replace(/\{(\w+)\}/g, (m, n) => (params[n] === undefined ? m : String(params[n]))) : s;
};
const t = tOf('en');

/** A plain formatter: the numbers pass through as they are, so the test sees where each one lands. */
const fmt = {
  formatNumber: (x, o = {}) => (x === null || x === undefined ? '—' : o.kind === 'percent' ? `${x}%` : String(x)),
  formatP: (p) => (p < 0.001 ? '< 0.001' : p.toFixed(3)),
  formatCi: (v) => (Array.isArray(v.ci) ? `${v.value} (${v.ci[0]} to ${v.ci[1]})` : String(v.value)),
};

const env = {
  status: 'ok',
  method: { id: 'epi.twoByTwo' },
  spec: { method: 'epi.twoByTwo', options: { confLevel: 0.95 } },
  values: {
    POR: { value: 2.47, ci: [1.57, 3.88], ciLevel: 0.95 },
    PR: { value: 2.11, ci: [1.43, 3.12], ciLevel: 0.95 },
    PD: { value: null, ci: null, reasonKey: 'ws.result.undefinedNoReason' },
    n: { value: 716 },
  },
  tests: [{ id: 'chisq', statistic: { name: 'X2', value: 16.03 }, df: 1, p: 0.0000623 }],
  provenance: { dataFingerprint: 'aaaa1111' },
};

test('values: the design’s primary measure first, undefined values print a dash and a sentence', () => {
  assert.equal(primaryValueName(env, { twoByTwoMeasures: { primary: 'PR' } }), 'PR');
  assert.equal(primaryValueName(env, null), 'POR', 'without a design, the first value with an interval');
  assert.deepEqual(valueRows(env, 'PR').map((r) => r.name), ['PR', 'POR', 'PD', 'n']);
  const pd = valueCells(valueRows(env).find((r) => r.name === 'PD'), fmt, 'en', t);
  assert.deepEqual(pd, { est: '—', ci: '', note: ws.en['ws.result.undefinedNoReason'] });
  const pr = valueCells(valueRows(env).find((r) => r.name === 'PR'), fmt, 'en', t);
  assert.deepEqual(pr, { est: '2.11', ci: '1.43 to 3.12', note: '' });
  assert.equal(ciLevelText(env), '95%');
});

test('export table: estimate and interval come before p; p gets "=" only when the formatter did not print "<"', () => {
  const tb = exportTable(env, { t, fmt, lang: 'en', caption: 'PR', note: 'provenance', primary: 'PR' });
  assert.deepEqual(tb.columns, ['Measure', 'Estimate', '95% CI', 'Note']);
  assert.deepEqual(tb.rows[0], ['Prevalence ratio (PR)', '2.11', '1.43 to 3.12', '']);
  const last = tb.rows[tb.rows.length - 1];
  assert.equal(last[0], 'Chi-square (X2)');
  assert.equal(last[2], 'p < 0.001');
  assert.equal(pText(fmt, 0.0123), 'p = 0.012');
  assert.equal(pText(fmt, null), 'p —');
  assert.equal(tb.note, 'provenance');
});

test('labels: a value can mean something else per method; tests are named with their statistic', () => {
  assert.equal(valueLabel('estimate', t, 'test.tTest'), 'Difference in means');
  assert.equal(valueLabel('estimate', t, 'corr.pearson'), 'r');
  assert.equal(valueLabel('estimate', t, 'freq.proportion'), 'Estimate');
  assert.equal(valueLabel('somethingNew', t), 'somethingNew', 'an unknown value keeps its own name');
  assert.equal(testLabel({ id: 'cmh', statistic: { name: 'X2' } }, t), 'Cochran-Mantel-Haenszel (X2)');
  assert.equal(testLabel({ id: 'unknownTest', statistic: { name: 'Z' } }, t), 'Z');
});

test('CI plot: one scale per plot (ratios on a log axis with the line at 1), counts never plotted', () => {
  const p = plottable(env, 'PR');
  assert.equal(p.log, true);
  assert.equal(p.ref, 1);
  assert.deepEqual(p.rows.map((r) => r.name), ['PR', 'POR']);
  const L = ciPlotLayout(p.rows.map((r) => ({ label: r.name, est: r.value, lo: r.ci[0], hi: r.ci[1] })), { width: 560, labelW: 150, log: true, ref: 1 });
  assert.ok(L.refX > L.plotLeft && L.refX < L.plotRight, 'the no-effect line is inside the plot');
  for (const r of L.rows) assert.ok(r.xLo < r.xEst && r.xEst < r.xHi, 'dot inside its interval');
  assert.ok(L.ticks.some((tk) => tk.v === 1));
  const summary = plotSummary(p.rows, fmt, 'en', t, 'epi.twoByTwo');
  assert.ok(summary.includes('2.11 (1.43 to 3.12)'), 'the aria text carries the numbers');
});

test('CI plot: an open bound runs to the edge and is marked open', () => {
  const L = ciPlotLayout([{ label: 'OR', est: Infinity, lo: 1.449, hi: Infinity }], { log: true, ref: 1 });
  const r = L.rows[0];
  assert.equal(r.openHi, true);
  assert.equal(r.xHi, L.plotRight);
  assert.equal(r.xEst, null, 'an infinite estimate has no dot');
  assert.deepEqual(linearTicks(0, 1, 5), [0, 0.2, 0.4, 0.6, 0.8, 1]);
  assert.ok(logTicks(0.5, 20).includes(1) && logTicks(0.5, 20).includes(10));
  assert.equal(tickText(0.30000000000000004), '0.3');
});

test('a kept result is marked as computed on an earlier version when the data fingerprint changed', () => {
  assert.equal(isStale({ envelope: env }, 'aaaa1111'), false);
  assert.equal(isStale({ envelope: env }, 'bbbb2222'), true);
  assert.equal(isStale({ dataFingerprint: null, envelope: {} }, 'x'), false);
});

// Table 1: the real stats core on a small table, then the pivot.
function t1table() {
  return {
    rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
    n: 6,
    excluded: {},
    columns: {
      age: { kind: 'number', values: Float64Array.from([10, 20, 30, 40, NaN, 60]), missing: Uint8Array.from([0, 0, 0, 0, 2, 0]) },
      buy: { kind: 'category', levels: ['ใช่', 'ไม่ใช่'], values: Int32Array.from([0, 1, 1, 0, 1, -1]), missing: Uint8Array.from([0, 0, 0, 0, 0, 1]) },
      elisa: { kind: 'category', levels: ['บวก', 'ลบ'], values: Int32Array.from([0, 0, 1, 1, 1, 1]), missing: Uint8Array.from([0, 0, 0, 0, 0, 0]) },
    },
  };
}

test('Table 1 pivot: one row per variable and category, a column per group, missing counts under each variable', () => {
  const res = table1(t1table(), { variables: ['age', 'buy'], group: 'elisa', summaries: { age: 'median-iqr', buy: 'n-percent' }, quantileType: 7 });
  const envT1 = { tables: res.tables };
  const labelOf = (k) => ({ age: 'Age', buy: 'Bought cattle' }[k] || k);
  const { blocks } = table1Blocks(envT1, { t, fmt, labelOf });
  assert.equal(blocks.length, 1);
  const b = blocks[0];
  assert.deepEqual(b.columns, ['Variable', 'All', 'บวก (n = 2)', 'ลบ (n = 4)']);
  const rows = Object.fromEntries(b.rows.map((r) => [r.label, r.cells]));
  // Age over all 5 known values 10, 20, 30, 40, 60: R quantile type 7 gives 20, 30, 40.
  assert.deepEqual(rows['Age, median (IQR)'], ['30 (20 to 40)', '15 (12.5 to 17.5)', '40 (35 to 50)']);
  assert.deepEqual(rows['Number with a value'], ['5', '2', '3']);
  assert.deepEqual(rows.unknown, ['1', '0', '1'], 'the missing age is under the age rows, in the group it belongs to');
  assert.deepEqual(rows['Bought cattle, n (%)'], ['5 known', '2 known', '3 known']);
  assert.deepEqual(rows['ใช่'], ['2 (40%)', '1 (50%)', `1 (${(100 * 1) / 3}%)`], 'percent of the known values, passed through unrounded to the formatter');
  assert.deepEqual(rows.blank, ['1', '0', '1']);
  const ex = table1Export(b, 'Animals', 'note');
  assert.equal(ex.rows[0][0], 'Age, median (IQR)');
  assert.ok(ex.rows[1][0].startsWith('   '), 'category and count rows are indented in the export');
  assert.equal(ex.note, 'note');
});

test('sample size: the course examples map to the engine’s inputs and reproduce the course answers', async () => {
  // Answers as the course file states them (courseAnswer), for the items that give one number.
  const expected = { 107029: 59, 107035: 13, 107036: 97, 107038: 428, 107039: 728, 107040: 334 };
  for (const item of course.items.filter((i) => i.method.startsWith('ss.'))) {
    const ex = exampleParams(item);
    const parsed = parseParams(ex.params);
    assert.equal(parsed.ok, true, `course ${item.id} gives numbers`);
    const spec = buildSpec({ method: item.method, params: parsed.params, options: { ...COMMON_OPTIONS, ...DEFAULT_OPTIONS[item.method], confLevel: ex.confidence ?? 0.95, z: 'course-1.96' } });
    const out = await runAnalysis(spec, null, null);
    if (expected[item.id] === undefined) {
      assert.equal(String(item.id), '107037', 'only the "p unknown" concept question has no single answer');
      assert.equal(ex.params.p, '0.5', 'p unknown loads as 0.5');
      continue;
    }
    assert.equal(out.status, 'ok', `course ${item.id}`);
    assert.equal(out.values.n.value, expected[item.id], `course ${item.id}: ${item.courseAnswer} (fixture ${path.basename(courseFile)})`);
    assert.ok(String(item.courseAnswer).includes(String(expected[item.id])), `the pinned answer is the course file's own (${item.courseAnswer})`);
  }
  assert.deepEqual(exampleParams({ input: { n0: 544, N: 2000, rho: 0.05, confidence: 0.9, note: 'x' } }), { params: { baseN: '544', N: '2000', icc: '0.05' }, confidence: 0.9, unused: ['note'] });
  assert.deepEqual(parseParams({ a: '1.5', b: '', c: 'x' }), { ok: false, params: { a: 1.5 }, bad: ['c'] });
});
