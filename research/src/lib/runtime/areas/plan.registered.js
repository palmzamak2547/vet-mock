// Ids of the plan area's methods that ship. Kept apart from plan.impl.js so the landing (which reads the
// catalogue) never loads statistics code. Add an id only after its fixture test is green and the
// injected-wrong-value proof is written in the role notes [M2-DESIGN.md 4]. OWNER: ui-tools role.
// design.randomisation and design.sampling: tests/unit/plan-{random,golden,properties}.test.mjs green
// against tests/fixtures/plan/golden.json (an independent Python PCG32); the red runs with a wrong
// multiplier, a reversed block and a shifted systematic start are in work/loop-2026-09-26/research-m2/ui-tools.md.

/** @type {readonly string[]} */
export default Object.freeze(['design.randomisation', 'design.sampling']);
