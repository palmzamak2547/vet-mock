// One place where the M2 areas plug into the M1 registration points [M2-DESIGN.md 2]. Each builder role
// edits only its own `<area>.options.js`, `<area>.impl.js` and `<area>.registered.js`; spec.js,
// run.js, registry.js, registered.js and epi/design.js read the merged view below and never need a
// second author. Pure data: no statistics code is imported here (the landing reads the catalogue).
// OWNER: data role (the merge rules); the area files belong to their roles.
import lab from './lab.options.js';
import models from './models.options.js';
import measure from './measure.options.js';
import plan from './plan.options.js';

/**
 * @typedef {Object} AreaOptions
 * @property {string} area
 * @property {Record<string, Record<string, any>>} defaults          new methods: option defaults
 * @property {Record<string, Record<string, any>>} allowed           new methods: valibot schema per option
 * @property {Record<string, Record<string, any>>} extendDefaults    options this area adds to methods it does not own
 * @property {Record<string, Record<string, any>>} extendAllowed     schemas for those options (replace an M1 schema of the same name)
 * @property {string[]} g1Subject                                    methods that assume independent animals (G1)
 * @property {string[]} designFree                                   methods offered without a design
 * @property {Record<string, string[]>} offers                       design id -> methods this area adds to that design
 * @property {import('../../epi/design.js').DesignRow[]} designs      design rows this area adds
 * @property {string[]} routes                                       farm routes this area runs, offered by the G1 panel ('survey', 'robust')
 */

/** @type {readonly AreaOptions[]} */
export const AREAS = Object.freeze([lab, models, measure, plan]);

/** Method id -> area name, for every method an area defines. */
export const AREA_OF = Object.freeze(Object.fromEntries(AREAS.flatMap((a) => Object.keys(a.defaults).map((id) => [id, a.area]))));

/** New methods' defaults, merged. Throws at load on an id two areas both define. */
export const AREA_DEFAULTS = Object.freeze(mergeOnce(AREAS.map((a) => a.defaults)));
/** New methods' allowed-value schemas, merged. */
export const AREA_ALLOWED = Object.freeze(mergeOnce(AREAS.map((a) => a.allowed)));
/** Options areas add to other methods (per method, per option). Later areas may not overwrite earlier ones. */
export const AREA_EXTEND_DEFAULTS = Object.freeze(mergeNested(AREAS.map((a) => a.extendDefaults)));
export const AREA_EXTEND_ALLOWED = Object.freeze(mergeNested(AREAS.map((a) => a.extendAllowed)));
export const AREA_G1_SUBJECT = Object.freeze(AREAS.flatMap((a) => a.g1Subject));
export const AREA_DESIGN_FREE = Object.freeze(AREAS.flatMap((a) => a.designFree));
export const AREA_DESIGNS = Object.freeze(AREAS.flatMap((a) => a.designs));
export const AREA_ROUTES = Object.freeze(AREAS.flatMap((a) => a.routes || []));

/**
 * Methods the areas add to one design, in area order.
 * @param {string} designId
 * @returns {{ method: string }[]}
 */
export function areaOffers(designId) {
  const out = [];
  for (const a of AREAS) for (const m of a.offers[designId] || []) if (!out.some((o) => o.method === m)) out.push({ method: m });
  return out;
}

function mergeOnce(list) {
  const out = {};
  for (const obj of list) {
    for (const [k, val] of Object.entries(obj || {})) {
      if (Object.prototype.hasOwnProperty.call(out, k)) throw new Error(`areas: method ${k} is defined twice`);
      out[k] = val;
    }
  }
  return out;
}

function mergeNested(list) {
  const out = {};
  for (const obj of list) {
    for (const [method, opts] of Object.entries(obj || {})) {
      out[method] = out[method] || {};
      for (const [k, val] of Object.entries(opts)) {
        if (Object.prototype.hasOwnProperty.call(out[method], k)) throw new Error(`areas: option ${method}.${k} is extended twice`);
        out[method][k] = val;
      }
    }
  }
  return out;
}
