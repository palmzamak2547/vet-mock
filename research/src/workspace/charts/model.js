// The chart kit: a chart is a pure model (scales, ticks, marks, a data table and an accessible summary)
// built from engine output, then drawn by Chart.jsx or serialised to SVG [M2-DESIGN.md 8].
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {'dot'|'box'|'violin'|'scatter'|'timeCourse'|'epiCurve'|'forest'|'estimation'|'ciFunction'|'kaplanMeier'|'roc'|'blandAltman'|'ci'} kind
 * @param {any} input      what that kind needs (see M2-DESIGN.md 8.2)
 * @param {{ widthMm?: number, lang: 'th'|'en', t: (k: string, p?: any) => string, fmt: any }} opts
 * @returns {{ kind: string, width: number, height: number, marks: any[], axes: any[], legend: any[], table: { columns: string[], rows: (string|number|null)[][] }, summary: string }}
 */
export function buildChart(kind, input, opts) {
  throw new Error('not implemented: workspace/charts/model.buildChart');
}

/**
 * Standalone SVG text with colours inlined (no CSS variables), for download and for the exporters.
 * @param {ReturnType<typeof buildChart>} model
 * @param {{ theme: 'light'|'dark'|'print' }} opts
 * @returns {string}
 */
export function chartToSvg(model, opts) {
  throw new Error('not implemented: workspace/charts/model.chartToSvg');
}
