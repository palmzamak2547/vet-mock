// Planning track: randomisation lists with blinding codes and sampling frames, both from the seeded
// generator in lib/plan/random.js [M2-DESIGN.md 3.4, 7]. Pure data plus valibot schemas (see
// lab.options.js). OWNER: ui-tools role.
//
// design.randomisation has no data file: its units, arms, ratio, strata and seed are params
// (input.kind 'params'). design.sampling reads the project dataset, whose input carries no params, so
// its size, seed and stream are options here; normalizeSpec writes the stream default (54) and the
// provenance line then prints seed and stream with the scheme.
import * as v from 'valibot';

const bool = v.boolean();
const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);
const blockSizes = v.pipe(v.array(v.pipe(v.number(), v.integer(), v.minValue(2), v.maxValue(100))), v.minLength(1), v.maxLength(6));
const uint32 = v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(4294967295));
const size = v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(1000000));

/** @type {import('./index.js').AreaOptions} */
export default {
  area: 'plan',
  defaults: {
    'design.randomisation': { scheme: 'block', blockSizes: [4], blinding: true },
    'design.sampling': { scheme: 'simple', allocation: 'proportional', stream: 54 },
  },
  allowed: {
    'design.randomisation': { scheme: pick(['simple', 'block', 'stratified-block']), blockSizes, blinding: bool },
    'design.sampling': { scheme: pick(['simple', 'systematic', 'stratified']), allocation: pick(['proportional', 'equal']), size, seed: uint32, stream: uint32 },
  },
  extendDefaults: {},
  extendAllowed: {},
  // Lists of units, not tests of animals: G1 does not apply.
  g1Subject: [],
  designFree: ['design.randomisation', 'design.sampling'],
  offers: {},
  routes: [],
  designs: [],
};
