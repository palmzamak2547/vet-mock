// The course's worked sample-size examples shown on the sample-size screen [M1-DESIGN.md 7.22;
// workspace board "Course"]. Only the inputs live here; every word the screen shows about an example
// (its name, the course answer, the formula, the deck it comes from) is in the dictionaries under
// ws.ss.example.<id>, ws.ss.ex.<id>.* and ws.ss.deck.*. The inputs are copied from the committed
// fixture research/tests/fixtures/course/epi-course-2026.json (bank items of
// src/data/questions-y5-epidemiology-2026-c.js); tests/unit/workspace-course-examples.test.mjs
// fails when they drift from it. `explain` marks an example that teaches a choice rather than giving
// a full calculation (the course gives no d for "prevalence unknown"). OWNER: workspace role.

/** @typedef {{ id: number, method: string, deck: 'sampleSize', input: Record<string, any>, explain?: boolean }} CourseExample */

/** @type {readonly CourseExample[]} */
export const COURSE_EXAMPLES = Object.freeze([
  { id: 107029, method: 'ss.caseControl', deck: 'sampleSize', input: { OR: 3, p0: 0.25, ratio: 1, confidence: 0.95, power: 0.8 } },
  { id: 107035, method: 'ss.paired', deck: 'sampleSize', input: { d: 0.8, confidence: 0.95, power: 0.8 } },
  { id: 107036, method: 'ss.mean', deck: 'sampleSize', input: { sd: 0.5, margin: 0.1, confidence: 0.95 } },
  { id: 107037, method: 'ss.proportion', deck: 'sampleSize', input: { pUnknown: true }, explain: true },
  { id: 107038, method: 'ss.proportion', deck: 'sampleSize', input: { n0: 544, N: 2000 } },
  { id: 107039, method: 'ss.proportion', deck: 'sampleSize', input: { n: 428, m: 15, rho: 0.05 } },
  { id: 107040, method: 'ss.proportion', deck: 'sampleSize', input: { n: 200, nonResponse: 0.4 } },
]);

/** Inputs each method cannot run without (a given sample size replaces p and d for ss.proportion). */
const REQUIRED = Object.freeze({
  'ss.proportion': [['p', 'd'], ['baseN']],
  'ss.twoProportions': [['p1', 'p2']],
  'ss.caseControl': [['OR', 'p0']],
  'ss.mean': [['sd', 'margin']],
  'ss.twoMeans': [['sd', 'delta']],
  'ss.paired': [['d']],
});

/**
 * The empty inputs that stop a calculation, for the message that names them. A method with two ways
 * in (ss.proportion: p and d, or a sample size already computed) names the fields of the way the
 * student has started, else the first way.
 * @param {string} method
 * @param {Record<string, number>} params parsed numbers (empty fields left out)
 * @returns {string[]}
 */
export function missingRequired(method, params) {
  const ways = REQUIRED[method] || [];
  if (!ways.length) return [];
  const has = (k) => typeof params?.[k] === 'number' && Number.isFinite(params[k]);
  if (ways.some((w) => w.every(has))) return [];
  const started = ways.find((w) => w.some(has)) || ways[0];
  return started.filter((k) => !has(k));
}
