// Area under the curve per animal [M3-DESIGN.md 3.1.2, C12]: the trapezoid rule on each animal's own times, total
// and net of the first value, Welch's t-test (second level minus first) or one-way ANOVA on the areas. Pins: R 4.6.0
// on the made-up gtt data (ข้อมูลสมมุติ / made-up data), tests/fixtures/r/out/auc.json; the three-group ANOVA reuses
// the `three` pin of tests/fixtures/r/out/anova.json (each animal's area is built to equal one value of `three`).
// STATS_INJECT=1 turns every pinned comparison red (stats-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trapezoid, areaOf, runAuc } from '../../src/lib/stats/auc.js';
import { close, TOL, makeTable, spec, readJson } from './stats-fixtures.mjs';
import { THREE } from './lab-fixtures.mjs';

const tol = TOL.closed;
const FX = readJson('r/out/auc.json');
const D = FX.datasets.gtt;
const ANOVA = readJson('r/out/anova.json').cases['anova1.three'].values;

/** Long table of the gtt data, optionally without some (animal, time) cells. */
function gttTable({ skip = [], group = true } = {}) {
  const y = [];
  const animal = [];
  const time = [];
  const grp = [];
  D.glucose.forEach((row, i) => row.forEach((v, j) => {
    if (skip.some(([a, t]) => a === i && t === j)) return;
    y.push(v); animal.push(D.animal[i]); time.push(D.times[j]); grp.push(D.group[i]);
  }));
  const cols = {
    glucose: { kind: 'number', values: y },
    animal: { kind: 'category', levels: D.animal, values: animal },
    minute: { kind: 'number', values: time },
  };
  if (group) cols.arm = { kind: 'category', levels: ['control', 'treated'], values: grp };
  return makeTable(cols);
}

const roles = { outcome: 'glucose', subject: 'animal', time: 'minute', group: 'arm' };

test('trapezoid areas per animal, total and net of the first value, as R', () => {
  D.glucose.forEach((y, i) => {
    close(trapezoid(D.times, y), FX.cases.gtt.values.total[i], tol, `total ${D.animal[i]}`);
    close(areaOf(D.times, y, 'zero'), FX.cases.gtt.values.total[i], tol, `zero ${D.animal[i]}`);
    close(areaOf(D.times, y, 'first'), FX.cases.gtt.values.net[i], tol, `first ${D.animal[i]}`);
  });
});

for (const [baseline, pre, areaKey] of [['zero', 'total', 'total'], ['first', 'net', 'net']]) {
  test(`runAuc, baseline ${baseline}: the areas table and Welch's t (treated minus control) as R`, () => {
    const out = runAuc(spec('calc.auc', { roles, options: { baseline } }), gttTable());
    assert.equal(out.status, 'ok');
    assert.equal(out.used, 48);
    assert.deepEqual(out.dropped, []);
    const areas = out.tables.find((t) => t.id === 'areas');
    assert.deepEqual(areas.columns, ['animal', 'group', 'area', 'nTimes']);
    assert.deepEqual(areas.rows.map((r) => r[0]), FX.cases.gtt.values.animal);
    assert.deepEqual(areas.rows.map((r) => r[1]), D.group);
    areas.rows.forEach((r, i) => { close(r[2], FX.cases.gtt.values[areaKey][i], tol, `area ${r[0]}`); assert.equal(r[3], 6); });
    const d = out.values.difference;
    close(d.value, FX.cases.gtt.values[`${pre}Diff`], tol, 'difference');
    close(d.ci[0], FX.cases.gtt.values[`${pre}Lower`], tol, 'lower');
    close(d.ci[1], FX.cases.gtt.values[`${pre}Upper`], tol, 'upper');
    const t = out.tests.find((x) => x.id === 'tTest');
    assert.equal(t.variant, 'welch');
    close(t.statistic.value, FX.cases.gtt.values[`${pre}T`], tol, 't');
    close(t.df, FX.cases.gtt.values[`${pre}Df`], tol, 'df');
    close(t.p, FX.cases.gtt.values[`${pre}P`], tol, 'p');
    assert.equal(out.values.nAnimals.value, 8);
    assert.equal(out.values.nIncomplete.value, 0);
    assert.ok(out.notes.some((n) => n.key === `lab.note.aucBaseline.${baseline}`));
    assert.deepEqual(out.notes.find((n) => n.key === 'lab.note.aucDifference').params, { first: 'control', second: 'treated' });
    assert.ok(!out.notes.some((n) => n.key === 'lab.note.aucTimesDiffer'), 'one set of times: no note');
  });
}

test('group means of the areas with t intervals, and the outcome at each time for the time-course chart', () => {
  const out = runAuc(spec('calc.auc', { roles }), gttTable());
  const g = out.tables.find((t) => t.id === 'groups');
  assert.deepEqual(g.columns, ['level', 'n', 'mean', 'sd', 'lower', 'upper']);
  const ctrl = FX.cases.gtt.values.total.slice(0, 4);
  const m = ctrl.reduce((a, b) => a + b, 0) / 4;
  close(g.rows[0][2], m, tol, 'control mean area');
  assert.ok(g.rows[0][4] < g.rows[0][2] && g.rows[0][2] < g.rows[0][5]);
  const means = out.tables.find((t) => t.id === 'means');
  assert.deepEqual(means.columns, ['time', 'group', 'n', 'mean', 'sd', 'lower', 'upper']);
  assert.equal(means.rows.length, 12);
  const at0 = means.rows.find((r) => r[0] === 0 && r[1] === 'control');
  close(at0[3], D.glucose.slice(0, 4).reduce((s, r) => s + r[0], 0) / 4, tol, 'control mean at 0 minutes');
  assert.equal(at0[2], 4);
});

test('animals on different times: each area on its own times, with a note; one time only: dropped as incomplete', () => {
  // A1 misses 90 minutes; B4 has only the first time
  const skipB4 = [1, 2, 3, 4, 5].map((t) => [7, t]);
  const out = runAuc(spec('calc.auc', { roles }), gttTable({ skip: [[0, 4], ...skipB4] }));
  assert.equal(out.status, 'ok');
  const areas = out.tables.find((t) => t.id === 'areas');
  assert.equal(areas.rows.length, 7);
  const own = D.times.filter((_, j) => j !== 4);
  close(areas.rows[0][2], trapezoid(own, D.glucose[0].filter((_, j) => j !== 4)), tol, 'A1 on its own five times');
  assert.equal(areas.rows[0][3], 5);
  assert.deepEqual(out.dropped, [{ reason: 'incomplete', column: 'animal', count: 1 }]);
  assert.equal(out.values.nIncomplete.value, 1);
  assert.equal(out.used, 41, '48 rows, 6 skipped, the one row of B4 dropped');
  assert.deepEqual(out.notes.find((n) => n.key === 'lab.note.aucTimesDiffer').params, { sets: 2 });
  assert.deepEqual(out.notes.find((n) => n.key === 'lab.note.aucIncomplete').params, { animals: 1, rows: 1 });
});

test('three or more groups: one-way ANOVA on the areas (the areas equal R\'s `three`, F and p as summary(aov))', () => {
  const groups = THREE;
  // each animal measured at 0 and 1 with the same value v: its trapezoid area is exactly v
  const y = [];
  const animal = [];
  const time = [];
  const grp = [];
  let n = 0;
  for (const [g, vals] of Object.entries(groups)) for (const v of vals) { n += 1; for (const t of [0, 1]) { y.push(v); animal.push(`a${n}`); time.push(t); grp.push(g); } }
  const tab = makeTable({ y: { kind: 'number', values: y }, animal: { kind: 'category', levels: [...new Set(animal)], values: animal }, t: { kind: 'number', values: time }, g: { kind: 'category', levels: Object.keys(groups), values: grp } });
  const out = runAuc(spec('calc.auc', { roles: { outcome: 'y', subject: 'animal', time: 't', group: 'g' } }), tab);
  assert.equal(out.status, 'ok');
  const f = out.tests.find((x) => x.id === 'anova');
  close(f.statistic.value, ANOVA.F, tol, 'F');
  assert.deepEqual(f.dfPair, [ANOVA.df1, ANOVA.df2]);
  close(f.p, ANOVA.p, tol, 'p');
  assert.equal(out.values.difference, undefined);
});

test('without a group: the mean area with its t interval and no test', () => {
  const out = runAuc(spec('calc.auc', { roles: { outcome: 'glucose', subject: 'animal', time: 'minute' } }), gttTable({ group: false }));
  assert.equal(out.status, 'ok');
  assert.equal(out.tests.length, 0);
  const x = FX.cases.gtt.values.total;
  const m = x.reduce((a, b) => a + b, 0) / x.length;
  close(out.values.meanArea.value, m, tol, 'mean area');
  assert.ok(out.values.meanArea.ci[0] < m && m < out.values.meanArea.ci[1]);
  assert.equal(out.tables.find((t) => t.id === 'areas').rows[0][1], null);
});

test('two values at one time for an animal, a group that changes, or a time that is not a number make it invalid', () => {
  const t = gttTable();
  t.columns.minute.values[1] = 0; // A1 now has minute 0 twice
  assert.equal(runAuc(spec('calc.auc', { roles }), t).values.reason.reasonKey, 'lab.invalid.duplicateTime');
  const g = gttTable();
  g.columns.arm.values[1] = 1;
  assert.equal(runAuc(spec('calc.auc', { roles }), g).values.reason.reasonKey, 'lab.invalid.groupChanges');
  const c = makeTable({ y: { kind: 'number', values: [1, 2] }, a: { kind: 'category', levels: ['x'], values: ['x', 'x'] }, t: { kind: 'category', levels: ['T1', 'T2'], values: ['T1', 'T2'] } });
  assert.equal(runAuc(spec('calc.auc', { roles: { outcome: 'y', subject: 'a', time: 't' } }), c).values.reason.reasonKey, 'stats.error.needsNumber');
  assert.equal(runAuc(spec('calc.auc', { roles: { outcome: 'glucose', subject: 'animal' } }), gttTable()).values.reason.reasonKey, 'stats.error.missingRole');
});
