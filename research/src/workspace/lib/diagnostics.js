// The diagnostics panel beside a result [M2-DESIGN.md 3.1.5, 10.2]: which checks can be run for the
// analysis the student just ran, with which columns. The checks are shown and never used to switch
// tests (methods.md anti-pattern 2): nothing here reads their p-values. Pure. OWNER: ui-analysis role.

/** The checks, in the order the panel shows them. */
export const DIAG_METHODS = Object.freeze(['diag.shapiro', 'diag.brownForsythe']);

/**
 * The checks that fit one result, each with the roles and options its spec takes; `null` when the panel
 * has nothing honest to offer for this analysis (a paired t-test's differences, a model's residuals: the
 * checks' roles cannot say what those are). A two-way ANOVA with its interaction is checked on its six (or
 * however many) cells: the checks take the second factor (factorB), and with the interaction the model's
 * residuals are each value minus its cell mean (normality.js cellsAt; pinned to R's residuals(aov(y ~ A * B))
 * and car::leveneTest(y ~ A * B) in rparity-m2). Without the interaction the residuals are not cell
 * residuals, so nothing is offered.
 * @param {any} spec   the AnalysisSpec of the result
 * @returns {{ method: string, roles: Record<string, string>, options: Record<string, any> }[] | null}
 */
export function diagnosticChecks(spec) {
  const r = spec?.roles || {};
  const o = spec?.options || {};
  switch (spec?.method) {
    case 'test.tTest':
      if (o.variant === 'one-sample' && r.outcome) return [{ method: 'diag.shapiro', roles: { outcome: r.outcome }, options: { on: 'residuals' } }];
      if ((o.variant === 'welch' || o.variant === 'pooled' || !o.variant) && r.outcome && r.group) return both(r.outcome, r.group);
      return null;
    case 'test.anova1':
    case 'posthoc.gamesHowell':
    case 'posthoc.dunnett':
      return r.outcome && r.group ? both(r.outcome, r.group) : null;
    case 'anova.twoWay':
      return r.outcome && r.group && r.factorB && o.interaction !== false ? both(r.outcome, r.group, r.factorB) : null;
    default:
      return null;
  }
}

function both(outcome, group, factorB = null) {
  const roles = factorB ? { outcome, group, factorB } : { outcome, group };
  return [
    { method: 'diag.shapiro', roles, options: { on: 'residuals' } },
    { method: 'diag.brownForsythe', roles, options: { center: 'median' } },
  ];
}

/** Methods whose result gets a diagnostics panel at all (for the tests and the i18n coverage). */
export const DIAG_FOR = Object.freeze(['test.tTest', 'test.anova1', 'posthoc.gamesHowell', 'posthoc.dunnett', 'anova.twoWay']);
