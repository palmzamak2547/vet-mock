// Implementations of the measure area's methods, for registry.js [M2-DESIGN.md 2]. `module` is the path under
// src/lib/ (the registry test reads it to check the function has left its stub). A method ships only
// when its id is also in measure.registered.js. OWNER: measure role.
import { runRoc } from '../../epi/roc.js';
import { runBlandAltman } from '../../epi/blandaltman.js';
import { runCronbach } from '../../epi/cronbach.js';

/** @type {Record<string, { impl: import('../registry.js').MethodImpl, module: string, fn: string }>} */
export default {
  'roc.delong': { impl: runRoc, module: 'epi/roc.js', fn: 'runRoc' },
  'agree.blandAltman': { impl: runBlandAltman, module: 'epi/blandaltman.js', fn: 'runBlandAltman' },
  'rel.cronbach': { impl: runCronbach, module: 'epi/cronbach.js', fn: 'runCronbach' },
};
