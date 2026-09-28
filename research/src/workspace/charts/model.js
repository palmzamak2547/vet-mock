// The chart kit: a chart is a pure model (scales, ticks, marks, a data table and an accessible summary)
// built from engine output, then drawn by Chart.jsx or serialised to SVG [M2-DESIGN.md 8]. Every number
// on a chart comes from its input (the engine's envelope or the rows the result used) or from a pinned
// helper (charts/helpers.js, density.js, epiweek.js); a chart never computes a statistic of its own.
// Hand-drawn SVG, no chart library. OWNER: graphs role.
import { boxChart, dotChart, estimationChart, violinChart } from './kinds-groups.js';
import { blandAltmanChart, ciFunctionChart, kaplanMeierChart, rocChart, scatterChart, timeCourseChart } from './kinds-xy.js';
import { ciChart, epiCurveChart, forestChart } from './kinds-other.js';
import { modelToSvg } from './render.js';

/** The kinds the kit draws, and what each needs as input (see each builder's JSDoc). */
export const CHART_KINDS = Object.freeze(['dot', 'box', 'violin', 'scatter', 'timeCourse', 'epiCurve', 'forest', 'estimation', 'ciFunction', 'kaplanMeier', 'roc', 'blandAltman', 'ci']);

const BUILDERS = {
  dot: dotChart,
  box: boxChart,
  violin: violinChart,
  estimation: estimationChart,
  scatter: scatterChart,
  timeCourse: timeCourseChart,
  kaplanMeier: kaplanMeierChart,
  roc: rocChart,
  blandAltman: blandAltmanChart,
  ciFunction: ciFunctionChart,
  forest: forestChart,
  epiCurve: epiCurveChart,
  ci: ciChart,
};

/**
 * @param {'dot'|'box'|'violin'|'scatter'|'timeCourse'|'epiCurve'|'forest'|'estimation'|'ciFunction'|'kaplanMeier'|'roc'|'blandAltman'|'ci'} kind
 * @param {any} input      what that kind needs (see M2-DESIGN.md 8.2 and the builder's JSDoc)
 * @param {{ width?: number, widthMm?: number, fontPt?: number, height?: number, title?: string, lang: 'th'|'en', t: (k: string, p?: any) => string, fmt: any }} opts
 *   width: screen pixels (the chart is drawn at the width it is shown). widthMm: a figure at its
 *   printed width, drawn in points with 7 to 9 pt type (fontPt, 8 by default).
 * @returns {{ kind: string, unit: 'px'|'pt', width: number, height: number, widthMm: number|null, heightMm: number|null, fontSize: number, marks: any[], axes: any[], legend: any[], table: { columns: string[], rows: (string|number|null)[][] }, summary: string, notes: string[], title?: string }}
 */
export function buildChart(kind, input, opts) {
  const build = BUILDERS[kind];
  if (!build) throw Object.assign(new Error(`unknown chart kind ${kind}`), { key: 'graphs.error.kind' });
  const model = build(input, opts || {});
  if (opts?.title) model.title = opts.title;
  if (opts?.title) model.summary = `${opts.title}: ${model.summary}`;
  return model;
}

/**
 * Standalone SVG text with colours inlined (no CSS variables), for download and for the exporters.
 * @param {ReturnType<typeof buildChart>} model
 * @param {{ theme: 'light'|'dark'|'print' }} opts
 * @returns {string}
 */
export function chartToSvg(model, opts) {
  return modelToSvg(model, opts?.theme);
}
