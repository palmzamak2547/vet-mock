// Ids of the measure area's methods that ship. Kept apart from measure.impl.js so the landing (which reads the
// catalogue) never loads statistics code. Add an id only after its fixture test is green and the
// injected-wrong-value proof is written in the role notes [M2-DESIGN.md 4]. OWNER: measure role.
//
// agree.blandAltman: tests/unit/measure-blandaltman.test.mjs (R 4.6.0 and the Lancet 1986 PEFR table),
// injected proof in work/loop-2026-09-26/research-m2/measure.md. rel.cronbach: tests/unit/measure-cronbach.test.mjs
// (R 4.6.0 and psych 2.6.5), injected proof likewise.
// roc.delong: tests/unit/measure-roc.test.mjs and rparity-m2 roc (pROC 1.19.0.1), injected proof in
// work/loop-2026-09-26/research-m2/integrator.md. The 'survey' route of freq.proportion: rparity-m2 survey (survey 4.5).

/** @type {readonly string[]} */
export default Object.freeze(['roc.delong', 'agree.blandAltman', 'rel.cronbach']);
