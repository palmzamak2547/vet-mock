// The chart kind the report draws for a kept result, when it draws one [M2-DESIGN.md 8.2; M3-DESIGN.md 5]. Pure (moved
// out of ReportPane.jsx so a test can read it): the Word and HTML figures (ReportPane's figuresFor) take the chart of
// this kind from the chart kit's reading of the result (chart-inputs.js), and fall back to the CI plot. OWNER: report role.
import { plottable } from '../lib/result-model.js';

/**
 * @param {any} env a kept result's envelope
 * @returns {string|null}
 */
export function chartKindFor(env) {
  switch (env?.method?.id || env?.spec?.method) {
    case 'surv.kaplanMeier': return 'kaplanMeier';
    case 'roc.delong': return 'roc';
    case 'agree.blandAltman': return 'blandAltman';
    case 'epi.mantelHaenszel': return 'forest';
    // the models' ratios by the kit's labelled forest (review round 2: the plottable fallback printed c2=, c4);
    // negative binomial regression (M3a) reports incidence rate ratios as Poisson regression does
    case 'reg.logistic':
    case 'reg.poisson':
    case 'reg.negbin': return 'forest';
    case 'anova.repeated': return 'timeCourse';
    // two-way ANOVA: the cell means from the envelope (review round 2: the Word file had no figure and no word why)
    case 'anova.twoWay': return 'timeCourse';
    // M3a lab methods (fix-stats finding 8): the curve or plot each result is about, which the kit draws from the
    // envelope alone. The CI-plot fallback put parameters of different units on one axis (Vmax with Km, a slope
    // with an efficiency) and drew a standard curve as a lone IC50 dot. A dilution series' scatter needs the rows,
    // so qPCR efficiency has no figure rather than a wrong one.
    case 'nls.fourPL': return 'standardCurve';
    case 'nls.doseResponse': return 'doseResponse';
    case 'nls.equation': return 'fittedCurve';
    case 'qpcr.relative': return 'qpcrFold';
    case 'calc.auc': return 'dot';
    case 'mv.pca': return 'scree';
    case 'qpcr.efficiency': return null;
    default: return plottable(env).rows.length ? 'ci' : null;
  }
}
