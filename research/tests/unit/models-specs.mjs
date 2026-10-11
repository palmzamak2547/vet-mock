// End-to-end cases for the models area's methods (runtime-area-specs.mjs reads this file): one case per
// registered method on the serosurvey working table (farm column cleared by the runner, so the
// independent-animal methods run instead of stopping at G1). The numbers are pinned by models-*.test.mjs
// and rparity-m2.test.mjs; these prove the runner, the registry and the specs agree.
// reg.negbin (M3a) runs on quine (MASS; Aitkin 1978, days absent from school), read from the rows the
// negbin.json fixture carries: the serosurvey's counts vary no more than Poisson allows, so negative binomial
// regression there answers models.invalid.negbinTheta, which is a result, not a run.
// OWNER: models role (the cases were written with the models role's notes by the integrator).
import { readFileSync } from 'node:fs';
import { makeSpec } from '../../src/lib/runtime/spec.js';

const QUINE = JSON.parse(readFileSync(new URL('../fixtures/r/out/negbin.json', import.meta.url), 'utf8')).datasets.quine;

/** @param {{ keys: Record<string, string>, smallTable: Function }} ctx */
export function specs({ keys: k, smallTable }) {
  const ds = { kind: 'dataset', datasetId: 'd-sero', recipeRev: 3 };
  const none = { route: null, column: null };
  const d = (method, extra) => ({ spec: makeSpec(method, ds, { design: 'cross-sectional', cluster: none, ...extra }) });
  const pos = { outcomePositive: 'บวก' };
  return [
    d('reg.logistic', { roles: { outcome: k.elisa, covariates: [k.ageBin, k.vaccine, k.herd] }, levels: pos }),
    d('reg.poisson', { design: 'cohort', roles: { outcome: k.parity, covariates: [k.breed], time: k.age } }),
    d('surv.kaplanMeier', { design: 'cohort', roles: { time: k.age, event: k.elisa, group: k.sex }, levels: pos }),
    {
      spec: makeSpec('reg.negbin', { kind: 'dataset', datasetId: 'd-quine', recipeRev: 0 }, { design: 'cross-sectional', cluster: none, roles: { outcome: 'c1', covariates: ['c2', 'c3', 'c4'] } }),
      ...smallTable([
        { name: 'Days', type: 'count', values: QUINE.Days },
        { name: 'Eth', type: 'nominal', levels: ['A', 'N'], values: QUINE.Eth },
        { name: 'Sex', type: 'nominal', levels: ['F', 'M'], values: QUINE.Sex },
        { name: 'Age', type: 'nominal', levels: ['F0', 'F1', 'F2', 'F3'], values: QUINE.Age },
      ]),
    },
  ];
}
