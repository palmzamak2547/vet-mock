// End-to-end cases for the plan area's methods (runtime-area-specs.mjs reads this file): a randomisation
// list from params, and a stratified random selection from the serosurvey table used as a sampling
// frame. One case per method, as the runner asks; the numbers of every scheme are pinned by
// plan-golden.test.mjs, and these prove the runner, the registry and the specs agree.
// OWNER: ui-tools role.
import { makeSpec } from '../../src/lib/runtime/spec.js';

/** @param {{ keys: Record<string, string> }} ctx */
export function specs({ keys }) {
  const none = { route: null, column: null };
  const ds = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
  return [
    { spec: makeSpec('design.randomisation', { kind: 'params', params: { n: 24, arms: ['A', 'B'], ratio: [1, 1], seed: 42, stream: 54 } }, { cluster: none, options: { scheme: 'block', blockSizes: [4, 6], blinding: true } }) },
    { spec: makeSpec('design.sampling', ds, { cluster: none, roles: { strata: keys.breed }, options: { scheme: 'stratified', allocation: 'proportional', size: 30, seed: 7 } }) },
  ];
}
