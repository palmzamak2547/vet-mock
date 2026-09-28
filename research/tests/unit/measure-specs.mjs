// End-to-end cases for the measure area's methods (runtime-area-specs.mjs reads this file): ROC with a
// second test on the made-up `roc` data (M2-DESIGN.md 3, ข้อมูลสมมุติ / made-up data), Bland-Altman and
// Cronbach on serosurvey columns (a smoke test of the runner, not an analysis anyone should do). The
// numbers are pinned by measure-*.test.mjs and rparity-m2.test.mjs.
// OWNER: measure role (the cases were written with the measure role's notes by the integrator).
import { makeSpec } from '../../src/lib/runtime/spec.js';

const STATUS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const M1 = [0.82, 1.10, 0.95, 1.43, 0.66, 1.25, 0.90, 1.58, 0.71, 1.02, 1.37, 0.88, 0.35, 0.52, 0.41, 0.78, 0.29, 0.60, 0.47, 0.93, 0.38, 0.55, 0.44, 0.69, 0.31, 0.83, 0.50, 0.62, 0.40, 0.72];
const M2 = [12.1, 15.4, 9.8, 18.2, 11.5, 14.0, 8.9, 16.7, 13.3, 10.2, 17.1, 12.8, 9.5, 11.2, 8.1, 13.6, 7.4, 10.9, 9.9, 12.5, 8.8, 10.4, 7.9, 11.8, 9.1, 14.2, 10.1, 8.4, 12.0, 9.6];

/** @param {{ keys: Record<string, string>, smallTable: Function }} ctx */
export function specs({ keys: k, smallTable }) {
  const none = { route: null, column: null };
  const sero = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
  const roc = smallTable([
    { name: 'culture', type: 'binary', levels: ['0', '1'], positive: '1', values: STATUS.map(String) },
    { name: 'marker1', type: 'continuous', values: M1 },
    { name: 'marker2', type: 'continuous', values: M2 },
  ]);
  return [
    {
      spec: makeSpec('roc.delong', { kind: 'dataset', datasetId: 'd-roc', recipeRev: 0 }, { design: 'diagnostic', cluster: none, roles: { test: 'c2', reference: 'c1', test2: 'c3' }, levels: { referencePositive: '1' } }),
      ...roc,
    },
    { spec: makeSpec('agree.blandAltman', sero, { design: 'agreement', cluster: none, roles: { raterA: k.age, raterB: k.parity } }) },
    { spec: makeSpec('rel.cronbach', sero, { design: 'cross-sectional', cluster: none, roles: { items: [k.age, k.parity, k.herd] } }) },
  ];
}
