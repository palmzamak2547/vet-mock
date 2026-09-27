// The document every export writes: one model built from envelopes, the codebook and the recipe, never from
// typed numbers; .docx, HTML, .sps and R read it [M2-DESIGN.md 6].
// OWNER: report role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {{ project: any, dataset: any, analyses: any[], log: any[], lang: 'th'|'en', t: (k: string, p?: any) => string }} input
 * @returns {{ title: string, lang: 'th'|'en', blocks: ({ kind: 'heading', level: 1|2|3, text: string } | { kind: 'paragraph', text: string } | { kind: 'table', caption: string, columns: string[], rows: (string|number|null)[][], note: string|null } | { kind: 'figure', caption: string, svg: string, widthMm: number, altText: string } | { kind: 'flow', model: any })[], references: any[], provenance: string[] }}
 */
export function buildReportModel(input) {
  throw new Error('not implemented: export/report-model.buildReportModel');
}
