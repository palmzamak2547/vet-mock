// The STROBE-Vet check beside the report draft [workspace board "Report"; M2-DESIGN.md 4.7]: which items
// the kept results and the recipe already cover. It reads what was saved; it never judges the science,
// only whether the draft has what the item asks the reader to be told. Items 13 (numbers at each stage),
// 12(c) (missing data) and 14(b) (missing per variable) are marked from the participant flow when one is
// passed (flow.js). Pure. Each row's words live under `${ns}.strobe.<key>` (ns 'ws' for the M1 rows,
// 'report' for rows added in M2). OWNER: report role.
import { flowComplete } from './flow.js';

/**
 * Which STROBE-Vet items the kept results and the recipe already cover.
 * @param {{ analyses: any[], steps: any[], codebook: any, flow?: ReturnType<import('./flow.js').strobeFlow>|null }} input
 * @returns {{ item: string, key: string, ok: boolean, ns?: 'ws'|'report' }[]}
 */
export function strobeStatus({ analyses, steps, codebook, flow = null }) {
  const specs = analyses.map((a) => a.envelope?.spec || a.spec).filter(Boolean);
  const routes = new Set(specs.map((s) => s.cluster?.route).filter((r) => r && r !== 'none'));
  const dropped = analyses.some((a) => (a.envelope?.provenance?.rowsDropped || []).some((d) => d.count > 0));
  const bins = (steps || []).filter((s) => s.kind === 'bin');
  const table1 = specs.some((s) => s.method === 'desc.table1');
  const flowOk = flow ? flowComplete(flow) : null;
  // Every analysis in the flow says which column each dropped row was missing in.
  const perColumn = Boolean(flowOk) && (flow.boxes || []).filter((b) => b.id.startsWith('analysis.')).every((b) => (b.params?.missingByColumn || []).every((d) => d.column));
  return [
    // Data without a farm column say so in their own words; data with one say whether a kept result
    // accounts for farms (review round 3: one line covering both read as a rule, not a status).
    codebook?.clusterKey
      ? { item: '12(a)', key: 'clustering', ok: routes.size > 0 }
      : { item: '12(a)', key: 'clusteringNoFarm', ok: true },
    { item: '12(c)', key: 'missing', ok: flowOk === null ? dropped || analyses.length > 0 : flowOk },
    { item: '13', key: 'flow', ok: flowOk === null ? analyses.length > 0 : flowOk },
    table1 || !perColumn
      ? { item: '14(b)', key: 'missingPerVariable', ok: table1 }
      : { item: '14(b)', key: 'missingPerVariableFlow', ok: true, ns: 'report' },
    { item: '16(a)', key: 'crudeAdjusted', ok: specs.some((s) => s.method === 'epi.mantelHaenszel' || (s.cluster?.route && s.cluster.route !== 'none')) && specs.some((s) => s.method === 'epi.twoByTwo') },
    // With no number cut into groups the row says so, instead of claiming every cut-point was set beforehand.
    bins.length === 0
      ? { item: '16(b)', key: 'cutpointsNone', ok: true }
      : { item: '16(b)', key: 'cutpoints', ok: bins.every((b) => b.params?.cutSource === 'typed' || b.params?.cutSource === 'literature') },
    { item: '12(e)', key: 'sensitivity', ok: routes.size > 1 },
  ];
}
