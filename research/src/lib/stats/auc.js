// Area under the curve per animal, then the groups compared on the areas [M3-DESIGN.md 3.1.2, C12]. OWNER: lab role.
//
// A summary measure per animal (each animal gives one number, so its repeated measurements count once):
// the trapezoid rule on the animal's own times, sum over k of (t[k+1] - t[k]) (y[k] + y[k+1]) / 2, with
// `baseline` 'zero' (total area from 0) or 'first' (the area of y - y[first], so time spent below the
// animal's first value counts negative; this is not Wolever's incremental area, which drops that part).
// Animals measured at different times are allowed, each on its own times, and a note says so. An animal
// with fewer than two times has no area: it is dropped whole with reason 'incomplete'.
//
// Comparison on the areas, reusing the M1 functions: Welch's t-test for two groups (stats/ttest.js; the
// difference is the second level minus the first, in codebook order), one-way ANOVA for three or more
// (stats/anova.js). Without a group, the mean area with its t interval.
//
// runAuc output (the contract other roles read):
//   values  nAnimals (animals with an area), nIncomplete (animals left out), and
//           difference (two groups: mean area of the second level minus the first, ci, se, ciMethod 't') or
//           meanArea (no group: mean area, ci, se)
//   tests   'tTest' (two groups: t, df, p, variant 'welch') or 'anova' (three or more: F, dfPair, p, variant
//           'oneway')
//   tables  'areas'  [animal, group, area, nTimes], one row per animal in order of first appearance
//           'groups' [level, n, mean, sd, lower, upper], mean area per group with its t interval (with a group)
//           'means'  [time, group, n, mean, sd, lower, upper], the outcome at each distinct time, over the
//                    animals with an area (for the time-course chart; group null without one)
//   notes   lab.note.aucBaseline.zero | lab.note.aucBaseline.first, lab.note.aucDifference {first, second}
//           (two groups), lab.note.aucTimesDiffer {sets}, lab.note.aucIncomplete {animals, rows}
//   dropped missing values per role column, then 'incomplete' (rows of animals with fewer than two times)
import { tTest } from './ttest.js';
import { anova1 } from './anova.js';
import { qt } from './dist.js';
import { mean, ksum, variance, val, nullVal, testRow, role, common, completeRows, column, invalid } from './common.js';

/**
 * Trapezoid area of y over t (t ascending, same length, at least two points).
 * @param {number[]} t @param {number[]} y
 * @returns {number}
 */
export function trapezoid(t, y) {
  const parts = [];
  for (let k = 0; k + 1 < t.length; k++) parts.push((t[k + 1] - t[k]) * (y[k] + y[k + 1]) / 2);
  return ksum(parts);
}

/**
 * One animal's area: from 0 ('zero') or net of its first value ('first').
 * @param {number[]} t   times, ascending
 * @param {number[]} y
 * @param {'zero'|'first'} [baseline]
 * @returns {number}
 */
export function areaOf(t, y, baseline = 'zero') {
  if (baseline === 'first') {
    const y0 = y[0];
    return trapezoid(t, y.map((v) => v - y0));
  }
  return trapezoid(t, y);
}

/** The text a subject, group or label cell shows: a category's level, else the value itself. */
export function cellLabel(col, i) {
  const v = col.values[i];
  if (col.kind === 'category') return (col.levels || [])[v] ?? null;
  return v ?? null;
}

/** Mean, SD and t interval of a list (null parts when there are too few values). */
function meanCi(x, confLevel) {
  const m = x.length ? mean(x) : null;
  const sd = x.length > 1 ? Math.sqrt(variance(x)) : null;
  const half = sd === null ? null : qt(1 - (1 - confLevel) / 2, x.length - 1) * sd / Math.sqrt(x.length);
  return { n: x.length, mean: m, sd, lower: half === null ? null : m - half, upper: half === null ? null : m + half, se: sd === null ? null : sd / Math.sqrt(x.length) };
}

/**
 * roles outcome (number), subject (animal), time (number), group (category, optional); long data, one row per
 * animal and time. options baseline 'zero' | 'first', confLevel, alternative (the two-group t-test).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runAuc(spec, table) {
  const yKey = role(spec, 'outcome');
  const sKey = role(spec, 'subject');
  const tKey = role(spec, 'time');
  const gKey = role(spec, 'group');
  if (!yKey || !sKey || !tKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const baseline = o.baseline === 'first' ? 'first' : 'zero';
  const { confLevel, alternative } = common(spec);
  const yc = column(table, yKey);
  const tc = column(table, tKey);
  const sc = column(table, sKey);
  const gc = gKey ? column(table, gKey) : null;
  if (yc.kind !== 'number' || tc.kind !== 'number') return invalid('stats.error.needsNumber');
  if (gc && gc.kind !== 'category') return invalid('stats.error.needsCategory');
  const keys = gKey ? [yKey, sKey, tKey, gKey] : [yKey, sKey, tKey];
  const { rows, dropped } = completeRows(table, keys);

  // one record per animal, in order of first appearance
  const animals = new Map();
  for (const i of rows) {
    const id = sc.values[i];
    if (!animals.has(id)) animals.set(id, { label: cellLabel(sc, i), group: gc ? gc.values[i] : 0, t: [], y: [], rows: 0 });
    const a = animals.get(id);
    if (gc && a.group !== gc.values[i]) return invalid('lab.invalid.groupChanges', { used: rows.length, dropped });
    a.t.push(tc.values[i]);
    a.y.push(yc.values[i]);
    a.rows += 1;
  }
  const kept = [];
  let incompleteRows = 0;
  let incompleteAnimals = 0;
  for (const a of animals.values()) {
    const order = a.t.map((_, j) => j).sort((p, q) => a.t[p] - a.t[q]);
    const t = order.map((j) => a.t[j]);
    const y = order.map((j) => a.y[j]);
    for (let j = 1; j < t.length; j++) if (t[j] === t[j - 1]) return invalid('lab.invalid.duplicateTime', { used: rows.length, dropped });
    if (t.length < 2) { incompleteRows += a.rows; incompleteAnimals += 1; continue; }
    kept.push({ ...a, t, y, area: areaOf(t, y, baseline) });
  }
  const allDropped = incompleteRows ? [...dropped, { reason: 'incomplete', column: sKey, count: incompleteRows }] : dropped;
  const used = kept.reduce((s, a) => s + a.rows, 0);
  const base = { used, dropped: allDropped };
  if (!kept.length) return invalid('lab.undefined.aucNoAnimal', base);

  // groups present among the animals with an area, in codebook order
  let labels = [null];
  let gIdx = kept.map(() => 0);
  if (gc) {
    const present = new Set(kept.map((a) => a.group));
    const lv = (gc.levels || []).map((l, j) => [l, j]).filter(([, j]) => present.has(j));
    const map = new Map(lv.map(([, j], x) => [j, x]));
    labels = lv.map(([l]) => l);
    gIdx = kept.map((a) => map.get(a.group));
  }
  const k = labels.length;
  const groupAreas = labels.map((_, h) => kept.filter((_, i) => gIdx[i] === h).map((a) => a.area));

  const values = { nAnimals: val(kept.length), nIncomplete: val(incompleteAnimals) };
  const tests = [];
  const notes = [{ id: 'baseline', severity: 'note', key: `lab.note.aucBaseline.${baseline}` }];
  let ok = true;
  if (gc && k < 2) {
    ok = false;
    values.reason = nullVal('lab.undefined.aucNeedTwoGroups');
  } else if (gc && k === 2) {
    const res = tTest(groupAreas[1], groupAreas[0], { variant: 'welch', alternative, confLevel });
    values.difference = res.estimate === null
      ? nullVal(res.reasonKey || 'stats.undefined.notComputable')
      : val(res.estimate, res.t === null ? { reasonKey: res.reasonKey } : { ci: res.ci, ciLevel: confLevel, ciMethod: 't', se: res.se });
    tests.push(testRow({ id: 'tTest', name: 't', statistic: res.t, df: res.df, p: res.p, alternative, variant: 'welch', reasonKey: res.reasonKey }));
    notes.push({ id: 'difference', severity: 'note', key: 'lab.note.aucDifference', params: { first: labels[0], second: labels[1] } });
    ok = res.t !== null;
  } else if (gc) {
    const a = anova1(groupAreas);
    tests.push(testRow({ id: 'anova', name: 'F', statistic: a.F, dfPair: [a.df1, a.df2], p: a.p, variant: 'oneway', reasonKey: a.reasonKey }));
    ok = a.F !== null;
  } else {
    const s = meanCi(groupAreas[0], confLevel);
    values.meanArea = s.sd === null ? val(s.mean, { reasonKey: 'stats.undefined.needTwo' }) : val(s.mean, { ci: [s.lower, s.upper], ciLevel: confLevel, ciMethod: 't', se: s.se });
  }

  // a note when the animals do not share one set of times
  const sets = new Set(kept.map((a) => a.t.join(' ')));
  if (sets.size > 1) notes.push({ id: 'timesDiffer', severity: 'note', key: 'lab.note.aucTimesDiffer', params: { sets: sets.size } });
  if (incompleteAnimals) notes.push({ id: 'incomplete', severity: 'note', key: 'lab.note.aucIncomplete', params: { animals: incompleteAnimals, rows: incompleteRows } });

  const tables = [{ id: 'areas', columns: ['animal', 'group', 'area', 'nTimes'], rows: kept.map((a, i) => [a.label, gc ? labels[gIdx[i]] : null, a.area, a.t.length]) }];
  if (gc) {
    tables.push({ id: 'groups', columns: ['level', 'n', 'mean', 'sd', 'lower', 'upper'], rows: groupAreas.map((x, h) => { const s = meanCi(x, confLevel); return [labels[h], s.n, s.mean, s.sd, s.lower, s.upper]; }) });
  }
  // the outcome at each distinct time over the animals with an area, for the time-course chart
  const times = [...new Set(kept.flatMap((a) => a.t))].sort((p, q) => p - q);
  const meansRows = [];
  for (let h = 0; h < k; h++) {
    for (const t of times) {
      const x = [];
      kept.forEach((a, i) => { if (gIdx[i] !== h) return; const j = a.t.indexOf(t); if (j >= 0) x.push(a.y[j]); });
      if (!x.length) continue;
      const s = meanCi(x, confLevel);
      meansRows.push([t, gc ? labels[h] : null, s.n, s.mean, s.sd, s.lower, s.upper]);
    }
  }
  tables.push({ id: 'means', columns: ['time', 'group', 'n', 'mean', 'sd', 'lower', 'upper'], rows: meansRows });
  return { status: ok ? 'ok' : 'invalid', values, tests, tables, used, dropped: allDropped, notes };
}
