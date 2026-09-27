// STROBE-Vet participant flow (item 13) from the recipe and the provenance: rows imported, excluded with
// their written reasons, filtered, missing per analysis, analysed [M2-DESIGN.md 4.7].
// OWNER: report role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {{ rawRows: number, steps: any[], analyses: any[], codebook: any }} input
 * @returns {{ boxes: { id: string, count: number, labelKey: string, params?: any }[], exclusions: { stepId: string, category: string, reason: string, count: number }[] }}
 */
export function strobeFlow(input) {
  throw new Error('not implemented: workspace/report/flow.strobeFlow');
}
