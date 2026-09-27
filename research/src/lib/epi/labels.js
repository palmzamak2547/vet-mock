// Dictionary keys for what the epi engine returns, so a screen never builds a label from an engine
// string by hand [M1-DESIGN.md 4.1: names are keys resolved in the component]. OWNER: epi role.

/** Label key of a value name in an envelope, e.g. 'PR' -> 'epi.value.PR'. */
export function valueLabelKey(name) {
  return `epi.value.${name}`;
}

const CI = {
  'wald-log': 'waldLog',
  'score-koopman': 'scoreKoopman',
  woolf: 'woolf',
  'exact-conditional': 'exactConditional',
  wald: 'wald',
  'newcombe-10': 'newcombe10',
  wilson: 'wilson',
  exact: 'exact',
  'agresti-coull': 'agrestiCoull',
  rgb: 'rgb',
  'greenland-robins': 'greenlandRobins',
  'fleiss-cohen-everitt': 'fleissCohenEveritt',
  log: 'log',
  'exact-poisson': 'exactPoisson',
  'wald-deff': 'waldDeff',
};

/**
 * Keys for a ciMethod string. Engine strings may carry modifiers: '+haldane' (0.5 added to every
 * cell), '+deff' (widened by the design effect), a 'from-rr-' / 'from-or-' prefix (an attributable
 * fraction converted from the ratio interval) and a 'rogan-gladen-' prefix (true prevalence from the
 * apparent interval). Returns the base key first, then the modifier keys, in reading order.
 * @param {string|undefined} ciMethod
 * @returns {string[]}
 */
export function ciMethodKeys(ciMethod) {
  if (!ciMethod) return [];
  let s = ciMethod;
  const out = [];
  const mods = [];
  if (s.startsWith('rogan-gladen-')) { out.push('epi.ciMethod.roganGladen'); s = s.slice('rogan-gladen-'.length); }
  if (s.startsWith('from-rr-') || s.startsWith('from-or-')) { mods.push('epi.ciMethod.fromRatio'); s = s.slice(8); }
  const parts = s.split('+');
  const base = CI[parts[0]];
  if (base) out.push(`epi.ciMethod.${base}`);
  for (const m of parts.slice(1)) if (m === 'haldane' || m === 'deff') mods.push(`epi.ciMethod.${m}`);
  return out.concat(mods);
}

/** Label key of a test variant in an epi envelope. */
export function testLabelKey(variant) {
  return {
    cmh: 'epi.test.cmh',
    'cmh-continuity': 'epi.test.cmhContinuity',
    'breslow-day-tarone': 'epi.test.breslowDayTarone',
    'breslow-day': 'epi.test.breslowDay',
    woolf: 'epi.test.woolf',
  }[variant] ?? null;
}

/** Name and description keys of a G1 route id ('mh-within' -> 'epi.route.mhWithin.name'). */
export function routeKeys(id) {
  const k = { 'mh-within': 'mhWithin', deff: 'deff', aggregate: 'aggregate', gee: 'gee', mixed: 'mixed' }[id];
  return k ? { nameKey: `epi.route.${k}.name`, descKey: `epi.route.${k}.desc` } : null;
}

/** Key of the step label in a sample-size chain ('nonResponse' -> 'epi.ss.step.nonResponse'). */
export function ssStepKey(id) {
  return `epi.ss.step.${id}`;
}
