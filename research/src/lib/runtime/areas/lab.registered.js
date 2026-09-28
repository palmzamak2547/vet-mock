// Ids of the lab area's methods that ship. Kept apart from lab.impl.js so the landing (which reads the
// catalogue) never loads statistics code. Add an id only after its fixture test is green and the
// injected-wrong-value proof is written in the role notes [M2-DESIGN.md 4]. OWNER: lab role.

/** @type {readonly string[]} */
export default Object.freeze([
  'anova.twoWay', 'anova.repeated', 'test.friedman',
  'posthoc.dunn', 'posthoc.gamesHowell', 'posthoc.dunnett',
  'diag.shapiro', 'diag.brownForsythe',
  // power.*: rparity-m2 power and noncentral (R 4.6.0 power.anova.test, power.t.test; pwr 1.3.0), injected
  // proof in work/loop-2026-09-26/research-m2/integrator.md.
  'power.anova', 'power.tTest', 'power.correlation', 'power.regression',
]);
