// End-to-end cases for the lab area's methods (runtime-area-specs.mjs reads this file): one case per
// registered method, each on a small table of its own (warpbreaks, the made-up rm data, RoundingTimes,
// three), so the runner, the registry and the specs are proven to agree. The numbers are pinned by
// lab-*.test.mjs. OWNER: lab role.
import { makeSpec } from '../../src/lib/runtime/spec.js';
import { WARPBREAKS, WB_WOOL, WB_TENSION, RM, RM_GROUP, ROUNDING, THREE } from './lab-fixtures.mjs';

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
  ];
}
