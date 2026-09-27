// Multi-panel figures: panels in a grid with A, B, C labels, at a journal column width (Elsevier artwork
// sizes 90, 140 and 190 mm, or typed) [M2-DESIGN.md 8.3].
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {ReturnType<import('./model.js').buildChart>[]} panels
 * @param {{ columns: number, widthMm: number, labels: boolean }} opts
 * @returns {{ svg: string, widthMm: number, heightMm: number }}
 */
export function composeFigure(panels, opts) {
  throw new Error('not implemented: workspace/charts/figure.composeFigure');
}
