// Models track: logistic and Poisson regression (GLM by IRLS) and Kaplan-Meier with the log-rank
// test [M2-DESIGN.md 3.2]; M3a [M3-DESIGN.md 2, 3.2]: Firth's correction as reg.logistic's option method 'firth'
// (C9) and negative binomial regression reg.negbin (C10). Pure data plus valibot schemas (see lab.options.js).
// OWNER: models role.
//
// reg.logistic's method has an allowed list and no written default: a spec without it is maximum likelihood
// (glm.js reads only method === 'firth'). A written default 'ml' would put method: 'ml' into every logistic
// envelope's options, and the provenance line prints the option name 'method' as the p-value adjustment of
// adjust.pValues ("p-values adjusted by ml", runtime/provenance.js OTHER_OPTIONS); M2's logistic envelopes stay
// as they were. The screen sets method 'firth' from the switch beside the separation stop.
import * as v from 'valibot';

const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);

/** @type {import('./index.js').AreaOptions} */
export default {
  area: 'models',
  defaults: {
    'reg.logistic': { ciMethod: 'profile' },
    'reg.poisson': { ciMethod: 'profile' },
    'surv.kaplanMeier': { confType: 'log', test: 'logrank' },
    'reg.negbin': { ciMethod: 'profile' },
  },
  allowed: {
    'reg.logistic': { ciMethod: pick(['profile', 'wald']), method: pick(['ml', 'firth']) },
    'reg.poisson': { ciMethod: pick(['profile', 'wald']) },
    'surv.kaplanMeier': { confType: pick(['log', 'log-log', 'plain']), test: pick(['logrank', 'none']) },
    'reg.negbin': { ciMethod: pick(['profile', 'wald']) },
  },
  extendDefaults: {},
  extendAllowed: {},
  g1Subject: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier', 'reg.negbin'],
  designFree: [],
  offers: {
    'cross-sectional': ['reg.logistic', 'reg.poisson', 'reg.negbin'],
    cohort: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier', 'reg.negbin'],
    'case-control': ['reg.logistic'],
    trial: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier', 'reg.negbin'],
    experiment: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier', 'reg.negbin'],
    descriptive: ['surv.kaplanMeier'],
  },
  // Cluster-robust SE for the GLMs: sandwich::vcovCL fixture green (tests/unit/models-robust.test.mjs).
  // Kaplan-Meier has no farm route: on clustered animals G1 stops it. Neither Firth's correction nor reg.negbin
  // runs the robust route (no pinned sandwich estimator for either); each refuses it with its own reason.
  routes: ['robust'],
  designs: [],
};
