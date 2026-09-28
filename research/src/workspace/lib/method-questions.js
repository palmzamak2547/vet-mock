// The M2 method picker asks the student's question before it names a test [M2-DESIGN.md 10.2; methods.md
// 3-6]: "two factors at once", "the same animals measured again", "doses against one control", "how long
// until death or recovery", "how well does a test separate sick from healthy". Each question names the
// study layout it comes from, so the lab designs (factorial experiment, repeated measures, dose groups
// against a control), the survival cohort and the diagnostic ROC study each have a heading of their own.
// The methods under a question are still filtered by the study design the student chose (design.js
// offers), so a question the design cannot answer is simply absent. Pure. OWNER: ui-analysis role.
import { METHOD_UI } from './method-ui.js';

/**
 * @typedef {{ id: string, pane: 'lab'|'models'|'survival'|'measure', layout: string, methods: string[] }} Question
 *   id        dictionary segment: ws.question.<id>.title, .help and ws.layout.<layout>
 *   layout    the study layout the question comes from (ws.layout.<layout>), shown as a small label
 *   methods   in the order the picker lists them (the first shipped one is chosen by default)
 */

/** @type {readonly Question[]} */
export const QUESTIONS = Object.freeze([
  { id: 'twoFactors', pane: 'lab', layout: 'factorial', methods: ['anova.twoWay'] },
  { id: 'sameAnimals', pane: 'lab', layout: 'repeated', methods: ['anova.repeated', 'test.friedman'] },
  { id: 'againstControl', pane: 'lab', layout: 'doseControl', methods: ['posthoc.dunnett'] },
  { id: 'whichPairs', pane: 'lab', layout: 'groups', methods: ['posthoc.gamesHowell', 'posthoc.dunn'] },
  { id: 'assumptions', pane: 'lab', layout: 'check', methods: ['diag.shapiro', 'diag.brownForsythe'] },
  { id: 'binaryOutcome', pane: 'models', layout: 'regression', methods: ['reg.logistic'] },
  { id: 'countOutcome', pane: 'models', layout: 'regression', methods: ['reg.poisson'] },
  { id: 'timeToEvent', pane: 'survival', layout: 'survivalCohort', methods: ['surv.kaplanMeier'] },
  { id: 'separateSick', pane: 'measure', layout: 'diagnosticRoc', methods: ['roc.delong'] },
  { id: 'twoMethodsAgree', pane: 'measure', layout: 'methodComparison', methods: ['agree.blandAltman'] },
  { id: 'scaleConsistent', pane: 'measure', layout: 'questionnaire', methods: ['rel.cronbach'] },
]);

/** Panes that list methods by question (M1's prevalence and association screens keep a flat list). */
export const QUESTION_PANES = Object.freeze(['lab', 'models', 'survival', 'measure']);

/**
 * The picker's groups for one pane: every question with at least one method the design offers, in
 * QUESTIONS order, then any offered method no question names (under 'other', so nothing offered is
 * ever hidden).
 * @param {string} pane
 * @param {{ method: string, measures: string[]|null }[]} offered   methodsForPane(pane, designRow)
 * @returns {{ id: string, layout: string|null, methods: string[] }[]}
 */
export function groupByQuestion(pane, offered) {
  const ids = new Set(offered.map((o) => o.method));
  const used = new Set();
  const out = [];
  for (const q of QUESTIONS) {
    if (q.pane !== pane) continue;
    const methods = q.methods.filter((m) => ids.has(m) && !used.has(m));
    if (!methods.length) continue;
    for (const m of methods) used.add(m);
    out.push({ id: q.id, layout: q.layout, methods });
  }
  const rest = offered.map((o) => o.method).filter((m) => !used.has(m));
  if (rest.length) out.push({ id: 'other', layout: null, methods: rest });
  return out;
}

/** The question a method answers, or null. */
export function questionOf(methodId) {
  return QUESTIONS.find((q) => q.methods.includes(methodId)) || null;
}

/**
 * Methods that a pane shows but no question names: an entry here means a method was added to
 * METHOD_UI without a question (checked by the workspace tests).
 * @param {string} pane
 */
export function unquestioned(pane) {
  const named = new Set(QUESTIONS.flatMap((q) => q.methods));
  return Object.entries(METHOD_UI).filter(([id, ui]) => ui.pane === pane && !named.has(id)).map(([id]) => id);
}

/**
 * Statistics terms a method's screen explains once (term.<id>.name and term.<id>.gloss, i18n/terms.js):
 * the English name stays English, the gloss is plain words [M2-DESIGN.md 9].
 */
export const METHOD_TERMS = Object.freeze({
  'anova.twoWay': ['interaction', 'typeIII'],
  'anova.repeated': ['sphericity'],
  'posthoc.dunnett': ['posthoc'],
  'posthoc.gamesHowell': ['posthoc'],
  'posthoc.dunn': ['posthoc'],
  'diag.shapiro': ['residual'],
  'reg.poisson': ['rateRatio'],
  'surv.kaplanMeier': ['censored'],
  'roc.delong': ['auc', 'youden'],
  'agree.blandAltman': ['loa'],
  'rel.cronbach': ['cronbachAlpha'],
});
