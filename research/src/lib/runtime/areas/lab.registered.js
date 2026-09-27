// Ids of the lab area's methods that ship. Kept apart from lab.impl.js so the landing (which reads the
// catalogue) never loads statistics code. Add an id only after its fixture test is green and the
// injected-wrong-value proof is written in the role notes [M2-DESIGN.md 4]. OWNER: lab role.

/** @type {readonly string[]} */
export default Object.freeze([]);
