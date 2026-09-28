// STROBE-Vet participant flow (item 13) from the recipe and the provenance: rows imported, rows added,
// rows excluded with their written reasons (by category), rows filtered, then per kept analysis the rows
// left out for a missing value and the rows analysed [M2-DESIGN.md 4.7]. Counts come from the working
// table (`excluded`: row id -> step id, what the recipe replay actually removed) and from each envelope's
// provenance; a count that cannot be known is null and is drawn as "—", never 0. `flowSvg` draws the
// flow for the report exports. Pure: `t` is passed in. OWNER: report role.

/** Exclusion categories (STROBE-Vet item 13, ARRIVE item 3) [M2-DESIGN.md 4.5]; anything else is 'other'. */
export const EXCLUSION_CATEGORIES = Object.freeze(['ineligible', 'lost', 'protocol-deviation', 'measurement-error', 'duplicate', 'other']);

/** Row drops an analysis makes for a value it could not use (not an exclusion from the study). */
const MISSING_REASONS = new Set(['missing', 'incomplete', 'invalid', 'unmatched']);

const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
const sum = (xs) => (xs.some((x) => x === null) ? null : xs.reduce((a, b) => a + b, 0));

/**
 * @param {{ rawRows: number|null, steps: any[], analyses: any[], codebook: any, excluded?: Record<string, string> }} input
 *   rawRows: rows in the imported file; steps: the recipe; analyses: kept results (with `envelope`);
 *   excluded: the working table's map of excluded row id to the step that excluded it.
 * @returns {{ boxes: { id: string, count: number|null, labelKey: string, params?: any }[], exclusions: { stepId: string, category: string, reason: string, count: number|null }[], filters: { stepId: string, reason: string, count: number|null }[] }}
 */
export function strobeFlow(input) {
  const steps = (input?.steps || []).slice().sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
  const map = input?.excluded && typeof input.excluded === 'object' ? input.excluded : null;
  const removedBy = new Map();
  if (map) for (const stepId of Object.values(map)) removedBy.set(stepId, (removedBy.get(stepId) || 0) + 1);
  const countOf = (step, fallback) => (map ? removedBy.get(step.id) || 0 : fallback);

  const exclusions = [];
  const filters = [];
  let added = 0;
  for (const s of steps) {
    const p = s.params || {};
    if (s.kind === 'row-add') added += 1;
    else if (s.kind === 'row-exclude' || s.kind === 'exclude-where') {
      const category = EXCLUSION_CATEGORIES.includes(p.category) ? p.category : 'other';
      const fallback = s.kind === 'row-exclude' ? 1 : num(p.count);
      exclusions.push({ stepId: s.id, category, reason: String(s.reason || ''), count: countOf(s, fallback) });
    } else if (s.kind === 'filter') {
      filters.push({ stepId: s.id, reason: String(s.reason || ''), count: countOf(s, num(p.count)) });
    }
  }

  const raw = num(input?.rawRows);
  const boxes = [{ id: 'imported', count: raw, labelKey: 'report.flow.imported' }];
  if (added) boxes.push({ id: 'added', count: added, labelKey: 'report.flow.added' });
  const excludedTotal = sum(exclusions.map((e) => e.count));
  if (exclusions.length) {
    const byCategory = EXCLUSION_CATEGORIES.map((c) => ({ category: c, count: sum(exclusions.filter((e) => e.category === c).map((e) => e.count)) }))
      .filter((c) => exclusions.some((e) => e.category === c.category));
    boxes.push({ id: 'excluded', count: excludedTotal, labelKey: 'report.flow.excluded', params: { byCategory } });
  }
  const included = raw === null || excludedTotal === null ? null : raw + added - excludedTotal;
  boxes.push({ id: 'included', count: included, labelKey: 'report.flow.included' });
  if (filters.length) {
    const filtered = sum(filters.map((f) => f.count));
    boxes.push({ id: 'filtered', count: filtered, labelKey: 'report.flow.filtered' });
    boxes.push({ id: 'inScope', count: included === null || filtered === null ? null : included - filtered, labelKey: 'report.flow.inScope' });
  }

  for (const a of input?.analyses || []) {
    const env = a?.envelope;
    if (!env || env.status !== 'ok') continue;
    if ((env.spec || a.spec)?.input?.kind && (env.spec || a.spec).input.kind !== 'dataset') continue;
    const prov = env.provenance || {};
    const drops = (prov.rowsDropped || []).filter((d) => d && d.count > 0);
    const missingByColumn = drops.filter((d) => MISSING_REASONS.has(d.reason)).map((d) => ({ column: d.column || null, reason: d.reason, count: d.count }));
    const aggregated = drops.filter((d) => d.reason === 'aggregated').reduce((s, d) => s + d.count, 0);
    const methodId = prov.methodId || env.method?.id || (env.spec || a.spec)?.method || '';
    boxes.push({
      id: `analysis.${a.id}`,
      count: num(prov.rowsUsed),
      labelKey: aggregated > 0 ? 'report.flow.analysedFarms' : 'report.flow.analysed',
      params: { analysisId: a.id, methodId, missing: missingByColumn.reduce((s, d) => s + d.count, 0), missingByColumn, animals: aggregated > 0 ? num(prov.rowsUsed) + aggregated : null },
    });
  }
  return { boxes, exclusions, filters };
}

/** The flow has something to say: rows were counted and at least one analysis used them. */
export function flowComplete(flow) {
  const imported = flow?.boxes?.find((b) => b.id === 'imported');
  const analyses = (flow?.boxes || []).filter((b) => b.id.startsWith('analysis.'));
  return Boolean(imported && imported.count !== null && analyses.length && analyses.every((b) => b.count !== null));
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const count = (n) => (typeof n === 'number' && Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '—');

/**
 * Break text into lines of at most `max` characters at word boundaries (Thai words through
 * Intl.Segmenter where the runtime has it), never cutting a word or a Thai cluster in two.
 */
export function wrapText(text, max) {
  const s = String(text || '').trim();
  if (!s) return [];
  let words;
  try {
    const seg = new Intl.Segmenter('th', { granularity: 'word' });
    words = [...seg.segment(s)].map((x) => x.segment);
  } catch {
    words = s.split(/(\s+)/);
  }
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + w).trim().length > max) {
      lines.push(cur.trim());
      cur = w.trimStart();
    } else cur += w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

/**
 * The flow as a standalone SVG (no CSS, no external font or image): the main column of boxes with arrows,
 * the exclusions and filters in boxes to the right with their written reasons.
 * @param {ReturnType<typeof strobeFlow>} flow
 * @param {{ t: (k: string, p?: any) => string, methodName: (id: string) => string, columnName?: (k: string) => string }} ctx
 * @returns {{ svg: string, width: number, height: number, text: string[] }} text: the same words, one line per box, for a screen reader and the alt text
 */
export function flowSvg(flow, ctx) {
  const { t } = ctx;
  const W = 640;
  const mainX = 20;
  const mainW = 330;
  const sideX = 380;
  const sideW = 240;
  const line = 18;
  const pad = 10;
  const gap = 26;
  const font = "font-family=\"'TH Sarabun New', Sarabun, Tahoma, Arial, sans-serif\"";
  const parts = [];
  const text = [];
  let y = 16;
  let prevBottom = null;

  const boxLines = (b) => {
    const p = b.params || {};
    const head = t(b.labelKey, { n: count(b.count), method: p.methodId ? ctx.methodName(p.methodId) : '', animals: count(p.animals) });
    const extra = [];
    if (b.id === 'excluded') for (const c of p.byCategory || []) extra.push(t('report.flow.byCategory', { category: t(`report.flow.category.${c.category === 'protocol-deviation' ? 'protocolDeviation' : c.category === 'measurement-error' ? 'measurementError' : c.category}`), n: count(c.count) }));
    if (b.id.startsWith('analysis.') && p.missing > 0) extra.push(t('report.flow.missing', { n: count(p.missing) }));
    return [head, ...extra];
  };

  const drawBox = (x, w, lines, yTop, bold) => {
    const wrapped = lines.flatMap((l, i) => wrapText(l, Math.floor(w / 7.4)).map((s) => ({ s, first: i === 0 })));
    const h = pad * 2 + wrapped.length * line;
    parts.push(`<rect x="${x}" y="${yTop}" width="${w}" height="${h}" rx="4" fill="#ffffff" stroke="#333333" stroke-width="1.2"/>`);
    wrapped.forEach((r, i) => {
      parts.push(`<text x="${x + pad}" y="${yTop + pad + (i + 1) * line - 4}" ${font} font-size="14" fill="#111111"${bold && r.first ? ' font-weight="bold"' : ''}>${esc(r.s)}</text>`);
    });
    return h;
  };

  const analyses = (flow.boxes || []).filter((b) => b.id.startsWith('analysis.'));
  for (const b of (flow.boxes || []).filter((x) => !x.id.startsWith('analysis.'))) {
    const lines = boxLines(b);
    text.push(lines.join(' '));
    const isSide = b.id === 'excluded' || b.id === 'filtered' || b.id === 'added';
    if (isSide && prevBottom !== null) {
      // A side box hangs off the arrow between the box before it and the next main box.
      let sideLines = lines;
      if (b.id === 'excluded') sideLines = [...lines, ...(flow.exclusions || []).map((e) => t('report.flow.reason', { reason: e.reason, n: count(e.count) }))];
      if (b.id === 'filtered') sideLines = [...lines, ...(flow.filters || []).map((f) => t('report.flow.reason', { reason: f.reason, n: count(f.count) }))];
      const yTop = y;
      const h = drawBox(sideX, sideW, sideLines, yTop, true);
      const arrowY = yTop + 14;
      parts.push(`<line x1="${mainX + mainW / 2}" y1="${arrowY}" x2="${sideX - 4}" y2="${arrowY}" stroke="#333333" stroke-width="1.2"/>`);
      parts.push(`<path d="M${sideX - 4} ${arrowY - 4} L${sideX} ${arrowY} L${sideX - 4} ${arrowY + 4} Z" fill="#333333"/>`);
      y = yTop + h + gap;
      continue;
    }
    if (prevBottom !== null) {
      parts.push(`<line x1="${mainX + mainW / 2}" y1="${prevBottom}" x2="${mainX + mainW / 2}" y2="${y - 4}" stroke="#333333" stroke-width="1.2"/>`);
      parts.push(`<path d="M${mainX + mainW / 2 - 4} ${y - 5} L${mainX + mainW / 2} ${y} L${mainX + mainW / 2 + 4} ${y - 5} Z" fill="#333333"/>`);
    }
    const h = drawBox(mainX, mainW, lines, y, false);
    prevBottom = y + h;
    y = y + h + gap;
  }
  // Each kept analysis branches from the last box: they are parallel uses of the same rows, not a chain.
  if (analyses.length && prevBottom !== null) {
    const trunkX = mainX + 24;
    const branchX = mainX + 60;
    let lastMid = prevBottom;
    for (const b of analyses) {
      const lines = boxLines(b);
      text.push(lines.join(' '));
      const h = drawBox(branchX, mainW + sideW - 20, lines, y, false);
      const mid = y + Math.min(h / 2, 20);
      parts.push(`<line x1="${trunkX}" y1="${lastMid}" x2="${trunkX}" y2="${mid}" stroke="#333333" stroke-width="1.2"/>`);
      parts.push(`<line x1="${trunkX}" y1="${mid}" x2="${branchX - 4}" y2="${mid}" stroke="#333333" stroke-width="1.2"/>`);
      parts.push(`<path d="M${branchX - 5} ${mid - 4} L${branchX} ${mid} L${branchX - 5} ${mid + 4} Z" fill="#333333"/>`);
      lastMid = mid;
      y = y + h + gap / 2;
    }
    y += gap / 2;
  }
  const height = Math.max(40, y - gap + 16);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}"><rect x="0" y="0" width="${W}" height="${height}" fill="#ffffff"/>${parts.join('')}</svg>`;
  return { svg, width: W, height, text };
}
