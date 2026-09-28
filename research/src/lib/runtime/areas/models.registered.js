// Ids of the models area's methods that ship. Kept apart from models.impl.js so the landing (which reads the
// catalogue) never loads statistics code. Add an id only after its fixture test is green and the
// injected-wrong-value proof is written in the role notes [M2-DESIGN.md 4]. OWNER: models role.

/** @type {readonly string[]} */
export default Object.freeze(['reg.logistic', 'reg.poisson', 'surv.kaplanMeier']);
