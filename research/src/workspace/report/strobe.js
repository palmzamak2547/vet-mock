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
    // Data without a farm column say so in their own words; data with one say whether a kept result
    // accounts for farms (review round 3: one line covering both read as a rule, not a status).
    codebook?.clusterKey
      ? { item: '12(a)', key: 'clustering', ok: routes.size > 0 }
      : { item: '12(a)', key: 'clusteringNoFarm', ok: true },
    { item: '12(c)', key: 'missing', ok: dropped || analyses.length > 0 },
    { item: '13', key: 'flow', ok: analyses.length > 0 },
    { item: '14(b)', key: 'missingPerVariable', ok: specs.some((s) => s.method === 'desc.table1') },
    { item: '16(a)', key: 'crudeAdjusted', ok: specs.some((s) => s.method === 'epi.mantelHaenszel' || (s.cluster?.route && s.cluster.route !== 'none')) && specs.some((s) => s.method === 'epi.twoByTwo') },
    // With no number cut into groups the row says so, instead of claiming every cut-point was set beforehand.
    bins.length === 0
      ? { item: '16(b)', key: 'cutpointsNone', ok: true }
      : { item: '16(b)', key: 'cutpoints', ok: bins.every((b) => b.params?.cutSource === 'typed' || b.params?.cutSource === 'literature') },
    { item: '12(e)', key: 'sensitivity', ok: routes.size > 1 },
  ];
}
