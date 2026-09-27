// Implementations of the models area's methods, for registry.js [M2-DESIGN.md 2]. `module` is the path under
// src/lib/ (the registry test reads it to check the function has left its stub). A method ships only
// when its id is also in models.registered.js. OWNER: models role.
import { runLogistic, runPoisson } from '../../models/glm.js';
import { runKaplanMeier } from '../../models/survival.js';

/** @type {Record<string, { impl: import('../registry.js').MethodImpl, module: string, fn: string }>} */
export default {
  'reg.logistic': { impl: runLogistic, module: 'models/glm.js', fn: 'runLogistic' },
  'reg.poisson': { impl: runPoisson, module: 'models/glm.js', fn: 'runPoisson' },
  'surv.kaplanMeier': { impl: runKaplanMeier, module: 'models/survival.js', fn: 'runKaplanMeier' },
};
