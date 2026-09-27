// The STROBE-Vet check beside the report draft [workspace board "Report"]: which items the kept
// results and the recipe already cover. It reads what was saved; it never judges the science, only
// whether the draft has what the item asks the reader to be told. Pure. OWNER: workspace role.

/** Which STROBE-Vet items the kept results and the recipe already cover. */
export function strobeStatus({ analyses, steps, codebook }) {
  const specs = analyses.map((a) => a.envelope?.spec || a.spec).filter(Boolean);
  const routes = new Set(specs.map((s) => s.cluster?.route).filter((r) => r && r !== 'none'));
  const dropped = analyses.some((a) => (a.envelope?.provenance?.rowsDropped || []).some((d) => d.count > 0));
  const bins = (steps || []).filter((s) => s.kind === 'bin');
  return [
    { item: '12(a)', key: 'clustering', ok: !codebook?.clusterKey || routes.size > 0 },
    { item: '12(c)', key: 'missing', ok: dropped || analyses.length > 0 },
    { item: '13', key: 'flow', ok: analyses.length > 0 },
    { item: '14(b)', key: 'missingPerVariable', ok: specs.some((s) => s.method === 'desc.table1') },
    { item: '16(a)', key: 'crudeAdjusted', ok: specs.some((s) => s.method === 'epi.mantelHaenszel' || (s.cluster?.route && s.cluster.route !== 'none')) && specs.some((s) => s.method === 'epi.twoByTwo') },
    { item: '16(b)', key: 'cutpoints', ok: bins.length === 0 || bins.every((b) => b.params?.cutSource === 'typed' || b.params?.cutSource === 'literature') },
    { item: '12(e)', key: 'sensitivity', ok: routes.size > 1 },
  ];
}
