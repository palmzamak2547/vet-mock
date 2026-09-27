// Disease frequency with correct denominators [M1-DESIGN.md 7.17; methods.md M3]: proportion
// (apparent prevalence), incidence risk (prevalent animals removed from the denominator, course
// 107004), incidence rate per animal-time with the exact Poisson interval (course 107006), and
// true prevalence by Rogan-Gladen with the apparent interval transformed (clipped to 0..1 with a
// note when the formula leaves it). OWNER: epi role.

/** Implementation for 'freq.proportion'. @type {import('../runtime/registry.js').MethodImpl} */
export function runProportion(spec, table) { void spec; void table; throw new Error('not implemented: epi/frequency.runProportion'); }
/** Implementation for 'freq.incidenceRisk'. @type {import('../runtime/registry.js').MethodImpl} */
export function runIncidenceRisk(spec, table) { void spec; void table; throw new Error('not implemented: epi/frequency.runIncidenceRisk'); }
/** Implementation for 'freq.incidenceRate'. @type {import('../runtime/registry.js').MethodImpl} */
export function runIncidenceRate(spec, table) { void spec; void table; throw new Error('not implemented: epi/frequency.runIncidenceRate'); }
/** Implementation for 'freq.truePrevalence'. @type {import('../runtime/registry.js').MethodImpl} */
export function runTruePrevalence(spec, table) { void spec; void table; throw new Error('not implemented: epi/frequency.runTruePrevalence'); }

/** Rogan-Gladen: (AP + Sp - 1) / (Se + Sp - 1); null with a reason when Se + Sp <= 1. */
export function roganGladen(ap, se, sp) { void ap; void se; void sp; throw new Error('not implemented: epi/frequency.roganGladen'); }
