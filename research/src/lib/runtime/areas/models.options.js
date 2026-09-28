// Models track: logistic and Poisson regression (GLM by IRLS) and Kaplan-Meier with the log-rank
// test [M2-DESIGN.md 3.2]. Pure data plus valibot schemas (see lab.options.js). OWNER: models role.
import * as v from 'valibot';

const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);

/** @type {import('./index.js').AreaOptions} */
export default {
  area: 'models',
  defaults: {
    'reg.logistic': { ciMethod: 'profile' },
    'reg.poisson': { ciMethod: 'profile' },
    'surv.kaplanMeier': { confType: 'log', test: 'logrank' },
  },
  allowed: {
    'reg.logistic': { ciMethod: pick(['profile', 'wald']) },
    'reg.poisson': { ciMethod: pick(['profile', 'wald']) },
    'surv.kaplanMeier': { confType: pick(['log', 'log-log', 'plain']), test: pick(['logrank', 'none']) },
  },
  extendDefaults: {},
  extendAllowed: {},
  g1Subject: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier'],
  designFree: [],
  offers: {
    'cross-sectional': ['reg.logistic', 'reg.poisson'],
    cohort: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier'],
    'case-control': ['reg.logistic'],
    trial: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier'],
    experiment: ['reg.logistic', 'reg.poisson', 'surv.kaplanMeier'],
    descriptive: ['surv.kaplanMeier'],
  },
  // Cluster-robust SE for the GLMs: sandwich::vcovCL fixture green (tests/unit/models-robust.test.mjs).
  // Kaplan-Meier has no farm route: on clustered animals G1 stops it.
  routes: ['robust'],
  designs: [],
};
