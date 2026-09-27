// Kaplan-Meier with Greenwood standard errors (R survival 3.8-6 survfit: conf.type log, log-log or plain;
// median with R's interval rule) and the log-rank test (survdiff, rho = 0) [M2-DESIGN.md 3.2.3].
// OWNER: models role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles time, event (levels.outcomePositive names the event level), group (optional); options confType, test.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runKaplanMeier(spec, table) {
  throw new Error('not implemented: models/survival.runKaplanMeier');
}

/**
 * @param {number[]} time
 * @param {boolean[]} event
 * @param {'log'|'log-log'|'plain'} confType
 * @param {number} confLevel
 * @returns {{ time: number[], nRisk: number[], nEvent: number[], nCensor: number[], surv: number[], se: (number|null)[], lower: (number|null)[], upper: (number|null)[], median: number|null, medianCi: [number|null, number|null] }}
 */
export function kaplanMeier(time, event, confType, confLevel) {
  throw new Error('not implemented: models/survival.kaplanMeier');
}

/**
 * @param {number[]} time
 * @param {boolean[]} event
 * @param {number[]} group   group index per row
 * @returns {{ statistic: number, df: number, p: number, observed: number[], expected: number[] }}
 */
export function logRank(time, event, group) {
  throw new Error('not implemented: models/survival.logRank');
}
