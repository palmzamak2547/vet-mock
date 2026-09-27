// Date bins for epidemic curves: day, ISO 8601 week (Monday start), month; dates as days since 1970-01-01
// [M2-DESIGN.md 8.2].
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number} days
 * @returns {{ year: number, week: number }}
 */
export function isoWeek(days) {
  throw new Error('not implemented: workspace/charts/epiweek.isoWeek');
}

/**
 * @param {number[]} days
 * @param {'day'|'isoWeek'|'month'} unit
 * @returns {{ start: number, end: number, count: number }[]}
 */
export function binDates(days, unit) {
  throw new Error('not implemented: workspace/charts/epiweek.binDates');
}
