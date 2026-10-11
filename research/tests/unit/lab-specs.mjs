// End-to-end cases for the lab area's methods (runtime-area-specs.mjs reads this file): one case per
// registered method, each on a small table of its own (warpbreaks, the made-up rm data, RoundingTimes,
// three), so the runner, the registry and the specs are proven to agree. The numbers are pinned by
// lab-*.test.mjs. OWNER: lab role.
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { WARPBREAKS, WB_WOOL, WB_TENSION, RM, RM_GROUP, ROUNDING, THREE } from './lab-fixtures.mjs';
// M3a curves: the datasets of the R fixture (ryegrass, the made-up two-arm curves, Puromycin)
// M3a auc, qpcr, pca: the R fixtures' own datasets (made-up gtt, qpcr, dilution; R's USArrests)
import { readJson } from './stats-fixtures.mjs';

/** @param {{ smallTable: Function }} ctx */
export function specs({ smallTable }) {
  const ds = { kind: 'dataset', datasetId: 'd-lab', recipeRev: 0 };
  const none = { route: null, column: null };
  const d = (method, extra) => makeSpec(method, ds, { design: 'experiment', cluster: none, ...extra });
  const p = (method, params, options) => makeSpec(method, { kind: 'params', params }, { cluster: none, options });

  const wb = smallTable([
    { name: 'breaks', type: 'continuous', values: WARPBREAKS },
    { name: 'wool', type: 'nominal', levels: ['A', 'B'], values: WB_WOOL.map((x) => ['A', 'B'][x]) },
    { name: 'tension', type: 'nominal', levels: ['L', 'M', 'H'], values: WB_TENSION.map((x) => ['L', 'M', 'H'][x]) },
  ]);
  const rmLong = { y: [], animal: [], time: [], group: [] };
  RM.forEach((row, i) => row.forEach((v, t) => { rmLong.y.push(v); rmLong.animal.push(`a${i + 1}`); rmLong.time.push(`T${t + 1}`); rmLong.group.push(RM_GROUP[i] ? 'B' : 'A'); }));
  const rm = smallTable([
    { name: 'weight', type: 'continuous', values: rmLong.y },
    { name: 'animal', type: 'id', values: rmLong.animal },
    { name: 'time', type: 'ordinal', levels: ['T1', 'T2', 'T3', 'T4'], values: rmLong.time },
    { name: 'diet', type: 'nominal', levels: ['A', 'B'], values: rmLong.group },
  ]);
  const rt = { y: [], player: [], method: [] };
  ROUNDING.forEach((row, i) => row.forEach((v, j) => { rt.y.push(v); rt.player.push(`p${i + 1}`); rt.method.push(['round out', 'narrow angle', 'wide angle'][j]); }));
  const rounding = smallTable([
    { name: 'time', type: 'continuous', values: rt.y },
    { name: 'player', type: 'id', values: rt.player },
    { name: 'method', type: 'nominal', levels: ['round out', 'narrow angle', 'wide angle'], values: rt.method },
  ]);
  const y = [];
  const g = [];
  for (const [l, vals] of Object.entries(THREE)) for (const v of vals) { y.push(v); g.push(l); }
  const three = smallTable([
    { name: 'y', type: 'continuous', values: y },
    { name: 'dose', type: 'nominal', levels: ['A', 'B', 'C'], values: g },
  ]);
  const grp = { outcome: 'c1', group: 'c2' };
  // M3a curves: ryegrass with two unknowns (blank concentration), the two-arm curves, Puromycin
  const NL = readJson('r/out/nonlinear.json').datasets;
  const elisa = smallTable([
    { name: 'conc', type: 'continuous', values: [...NL.ryegrass.conc, null, null] },
    { name: 'root', type: 'continuous', values: [...NL.ryegrass.rootl, 2, 4] },
  ]);
  const arms = smallTable([
    { name: 'arm', type: 'nominal', levels: ['control', 'drug'], values: NL.curves.arm },
    { name: 'dose', type: 'continuous', values: NL.curves.dose },
    { name: 'resp', type: 'continuous', values: NL.curves.resp },
  ]);
  const enzyme = smallTable([
    { name: 'conc', type: 'continuous', values: NL.puromycin.conc },
    { name: 'rate', type: 'continuous', values: NL.puromycin.rate },
  ]);

  return [
    { spec: d('anova.twoWay', { roles: { outcome: 'c1', group: 'c2', factorB: 'c3' } }), ...wb },
    { spec: d('anova.repeated', { roles: { outcome: 'c1', subject: 'c2', time: 'c3', group: 'c4' } }), ...rm },
    { spec: d('test.friedman', { roles: { outcome: 'c1', subject: 'c2', group: 'c3' } }), ...rounding },
    { spec: d('posthoc.dunn', { roles: grp }), ...three },
    { spec: d('posthoc.gamesHowell', { roles: grp }), ...three },
    { spec: d('posthoc.dunnett', { roles: grp, levels: { controlLevel: 'A' } }), ...three },
    { spec: d('diag.shapiro', { roles: grp }), ...three },
    { spec: d('diag.brownForsythe', { roles: grp }), ...three },
    // Power and sample size: parameters only (R's power.anova.test, power.t.test and pwr examples, M2-DESIGN.md 3.1.7).
    { spec: p('power.anova', { groups: 3, betweenVar: 1, withinVar: 3, power: 0.8 }, { solveFor: 'n', sigLevel: 0.05 }) },
    { spec: p('power.tTest', { delta: 1, sd: 1, n: 20 }, { solveFor: 'power', sigLevel: 0.05, type: 'two-sample' }) },
    { spec: p('power.correlation', { r: 0.3, power: 0.8, m: 10, icc: 0.05 }, { solveFor: 'n', sigLevel: 0.05 }) },
    { spec: p('power.regression', { u: 3, f2: 0.15, power: 0.8 }, { solveFor: 'n', sigLevel: 0.05 }) },
    // M3a curves
    { spec: d('nls.fourPL', { roles: { x: 'c1', outcome: 'c2' }, options: { model: '4pl' } }), ...elisa },
    { spec: d('nls.doseResponse', { roles: { x: 'c2', outcome: 'c3', group: 'c1' }, options: { model: '4pl', compare: 'ec50' } }), ...arms },
    { spec: d('nls.equation', { roles: { x: 'c1', outcome: 'c2' }, options: { equation: 'michaelisMenten' } }), ...enzyme },
    // M3a auc, qpcr, pca (numbers pinned by lab-auc, lab-qpcr and lab-pca.test.mjs)
    ...m3aCases(d, smallTable),
  ];
}

// M3a auc, qpcr, pca
function m3aCases(d, smallTable) {
  const gtt = readJson('r/out/auc.json').datasets.gtt;
  const g = { y: [], animal: [], t: [], arm: [] };
  gtt.glucose.forEach((row, i) => row.forEach((v, j) => { g.y.push(v); g.animal.push(gtt.animal[i]); g.t.push(gtt.times[j]); g.arm.push(gtt.group[i]); }));
  const auc = smallTable([
    { name: 'glucose', type: 'continuous', values: g.y },
    { name: 'animal', type: 'id', values: g.animal },
    { name: 'minute', type: 'continuous', values: g.t },
    { name: 'arm', type: 'nominal', levels: ['control', 'treated'], values: g.arm },
  ]);
  const q = readJson('r/out/qpcr.json').datasets;
  const qpcr = smallTable([
    { name: 'target', type: 'continuous', values: q.qpcr.target },
    { name: 'gapdh', type: 'continuous', values: q.qpcr.gapdh },
    { name: 'actb', type: 'continuous', values: q.qpcr.actb },
    { name: 'arm', type: 'nominal', levels: ['control', 'treated'], values: q.qpcr.group },
  ]);
  const dilution = smallTable([
    { name: 'log10input', type: 'continuous', values: q.dilution.log10input },
    { name: 'ct', type: 'continuous', values: q.dilution.ct },
  ]);
  const us = readJson('r/out/pca.json').datasets.USArrests;
  const arrests = smallTable([
    ...us.columns.map((name, j) => ({ name, type: 'continuous', values: us.values.map((r) => r[j]) })),
    { name: 'state', type: 'id', values: us.rows },
  ]);
  return [
    { spec: d('calc.auc', { roles: { outcome: 'c1', subject: 'c2', time: 'c3', group: 'c4' }, options: { baseline: 'zero' } }), ...auc },
    { spec: d('qpcr.relative', { roles: { outcome: 'c1', items: ['c2', 'c3'], group: 'c4' }, levels: { controlLevel: 'control' } }), ...qpcr },
    { spec: d('qpcr.efficiency', { roles: { x: 'c1', outcome: 'c2' } }), ...dilution },
    { spec: d('mv.pca', { roles: { items: ['c1', 'c2', 'c3', 'c4'], subject: 'c5' }, options: { scale: true } }), ...arrests },
  ];
}
