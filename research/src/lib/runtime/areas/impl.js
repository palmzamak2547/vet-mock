// Every area's implementations merged for registry.js [M2-DESIGN.md 2]. Imports statistics code, so only
// registry.js (worker and main-thread engine) may import this file. OWNER: data role.
import lab from './lab.impl.js';
import models from './models.impl.js';
import measure from './measure.impl.js';
import plan from './plan.impl.js';

/** @type {Record<string, { impl: import('../registry.js').MethodImpl, module: string, fn: string }>} */
export const AREA_CANDIDATES = Object.freeze({ ...lab, ...models, ...measure, ...plan });
