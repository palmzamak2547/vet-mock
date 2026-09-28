// Measurement track: ROC with DeLong, Bland-Altman, Cronbach's alpha, and the design-based
// (survey) prevalence interval [M2-DESIGN.md 3.3]. Pure data plus valibot schemas (see
// lab.options.js). OWNER: measure role.
import * as v from 'valibot';

const bool = v.boolean();
const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);

/** @type {import('./index.js').AreaOptions} */
export default {
  area: 'measure',
  defaults: {
    'roc.delong': { direction: 'higher-positive', ciMethod: 'delong', youden: true },
    'agree.blandAltman': { scale: 'absolute', loaMultiplier: 1.96, loaCi: 'approx', proportionalBias: true },
    'rel.cronbach': { ciMethod: 'feldt' },
  },
  allowed: {
    'roc.delong': { direction: pick(['higher-positive', 'lower-positive']), ciMethod: pick(['delong']), youden: bool },
    'agree.blandAltman': { scale: pick(['absolute', 'percent', 'ratio']), loaMultiplier: pick([1.96, 2]), loaCi: pick(['approx', 'none']), proportionalBias: bool },
    'rel.cronbach': { ciMethod: pick(['feldt', 'none']) },
  },
  // freq.proportion gains surveyCi (used only on the 'survey' farm route): allowed, with no default, so
  // M1 envelopes stay identical; the route reads 'logit' (svyciprop's default) when the option is absent
  // and every interval names its method ('survey-logit' or 'survey-mean').
  extendDefaults: {},
  extendAllowed: {
    'freq.proportion': { surveyCi: pick(['logit', 'mean']) },
  },
  g1Subject: ['roc.delong', 'agree.blandAltman', 'rel.cronbach'],
  designFree: [],
  offers: {
    diagnostic: ['roc.delong'],
    agreement: ['agree.blandAltman', 'rel.cronbach'],
    'cross-sectional': ['rel.cronbach'],
    descriptive: ['rel.cronbach'],
    experiment: ['agree.blandAltman'],
  },
  // The design-based interval passes its survey::svyciprop fixture (rparity-m2 survey).
  routes: ['survey'],
  designs: [],
};
