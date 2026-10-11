// The standard curve (nls.fourPL) [M3-DESIGN.md 5]: the dose-response drawing (dose-response.js) of one curve, plus
// each interpolated unknown as a cross on the curve with dotted lines to both axes. An unknown outside the curve
// (its response beyond the bottom or the top, M3-DESIGN.md C5) has no concentration: it is listed under the chart
// and in the number table as outside the standard curve, never drawn. Every concentration and interval is the
// envelope's 'unknowns' table. Pure. OWNER: graphs role.
import { curveModel } from './dose-response.js';

/**
 * @param {import('./dose-response.js').CurvesInput} input  one curve; `unknowns` from the envelope (label = row id)
 */
export function standardCurveChart(input, opts) {
  return curveModel('standardCurve', input, opts);
}
