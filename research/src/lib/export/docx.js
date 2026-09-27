// Word (.docx) from the report model: real Word tables (w:tbl, header row repeated), figures as PNG at 300
// dpi sized in EMU from millimetres, Thai text in the complex-script font slot; zipped with fflate on the
// device [M2-DESIGN.md 6.1]. Loaded lazily.
// OWNER: report role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {ReturnType<import('./report-model.js').buildReportModel>} model
 * @param {{ rasterize: (svg: string, widthMm: number, dpi: number) => Promise<Uint8Array> }} deps   PNG bytes from graphs' exporter
 * @returns {Promise<Uint8Array>}
 */
export function buildDocx(model, deps) {
  throw new Error('not implemented: export/docx.buildDocx');
}
