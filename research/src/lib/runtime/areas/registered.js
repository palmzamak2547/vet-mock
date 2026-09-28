// Every area's shipped ids merged for runtime/registered.js [M2-DESIGN.md 2]. Plain arrays, safe for the
// landing chunk. OWNER: data role.
import lab from './lab.registered.js';
import models from './models.registered.js';
import measure from './measure.registered.js';
import plan from './plan.registered.js';

/** @type {readonly string[]} */
export const AREA_REGISTERED = Object.freeze([...lab, ...models, ...measure, ...plan]);

// The measure area's ids on their own, for the design and guard checks (read through runtime/catalog.js).
export const MEASURE_SHIPPED = measure;
