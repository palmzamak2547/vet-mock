// Implementations of the plan area's methods, for registry.js [M2-DESIGN.md 2]. `module` is the path under
// src/lib/ (the registry test reads it to check the function has left its stub). A method ships only
// when its id is also in plan.registered.js. OWNER: ui-tools role.
import { runRandomisation } from '../../plan/randomise.js';
import { runSampling } from '../../plan/sampling.js';

/** @type {Record<string, { impl: import('../registry.js').MethodImpl, module: string, fn: string }>} */
export default {
  'design.randomisation': { impl: runRandomisation, module: 'plan/randomise.js', fn: 'runRandomisation' },
  'design.sampling': { impl: runSampling, module: 'plan/sampling.js', fn: 'runSampling' },
};
