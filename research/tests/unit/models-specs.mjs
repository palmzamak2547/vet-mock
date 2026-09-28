// End-to-end cases for the models area's methods (runtime-area-specs.mjs reads this file): one case per
// registered method on the serosurvey working table (farm column cleared by the runner, so the
// independent-animal methods run instead of stopping at G1). The numbers are pinned by models-*.test.mjs
// and rparity-m2.test.mjs; these prove the runner, the registry and the specs agree.
// OWNER: models role (the cases were written with the models role's notes by the integrator).
import { makeSpec } from '../../src/lib/runtime/spec.js';

/** @param {{ keys: Record<string, string> }} ctx */
export function specs({ keys: k }) {
  const ds = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
  const none = { route: null, column: null };
  const d = (method, extra) => ({ spec: makeSpec(method, ds, { design: 'cross-sectional', cluster: none, ...extra }) });
  const pos = { outcomePositive: 'บวก' };
  return [
    d('reg.logistic', { roles: { outcome: k.elisa, covariates: [k.ageBin, k.vaccine, k.herd] }, levels: pos }),
    d('reg.poisson', { design: 'cohort', roles: { outcome: k.parity, covariates: [k.breed], time: k.age } }),
    d('surv.kaplanMeier', { design: 'cohort', roles: { time: k.age, event: k.elisa, group: k.sex }, levels: pos }),
  ];
}
