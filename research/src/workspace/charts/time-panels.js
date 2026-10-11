// Repeated measures with two within factors (anova.repeated with factorB) [M3-DESIGN.md 3.1.5, C11]: the means of
// every combination with their t intervals, from the envelope's 'means' table [time, factorB, group, n, mean, ...].
//
// Decided here: the first within factor (time) runs along the x axis, one line per level of the second within
// factor (one colour, marker and legend entry per level, the same in every panel), and one panel per group of the
// between factor, side by side when the width allows (each panel at least 22 em wide) and stacked below each
// other on a phone. All panels share one value axis, so heights compare across groups. Why panels and not colours
// for the groups: the lines already use the colours for the second factor, and groups times levels colours (three
// groups of three levels is nine lines) would run past the eight Okabe-Ito colours and leave a reader matching
// nine legend entries; a panel per group keeps every line one colour across the figure, and a comparison of groups
// is a comparison of panels drawn on the same axis. Without a between factor it is one panel without a title.
// Each panel is the kit's time-course drawing (kinds-xy.js timeCourseChart), so the two charts read the same.
// Pure. OWNER: graphs role.
import { paddedDomain } from './scale.js';
import { finish } from './kinds-groups.js';
import { timeCourseChart } from './kinds-xy.js';
import { fitTitle, groupLegend, legendNodes, makeCtx, minFont, PT_PER_MM, r2, titleNodes } from './frame.js';
import { fmtCi, fmtN, levelText, lineMarker, noData, num } from './common.js';

/**
 * @param {{ times: string[], panels: { label: string|null, series: { label: string, points: { time: number, mean: number|null, lo: number|null, hi: number|null, n?: number }[] }[] }[], seriesTitle?: string, panelTitle?: string, xTitle?: string, yTitle?: string, level?: number }} input
 *   every panel lists the same series (levels of the second factor) in the same order; points[].time indexes `times`.
 */
export function timePanelsChart(input, opts) {
  const ctx = makeCtx(opts);
  const { t, fs } = ctx;
  const times = input?.times || [];
  const panels = (input?.panels || []).filter((p) => (p.series || []).length);
  if (!times.length || !panels.length) noData('no means');
  const level = input.level ?? 0.95;
  const lv = levelText(level);
  const seriesLabels = panels[0].series.map((s) => s.label);
  const allY = panels.flatMap((p) => p.series.flatMap((s) => s.points.flatMap((q) => [q.mean, q.lo, q.hi]))).filter(num);
  if (!allY.length) noData('no means');
  const yDomain = paddedDomain(allY, { pad: 0.06 });
  const P = panels.length;
  const cols = Math.max(1, Math.min(P, Math.floor(ctx.width / (fs * 22))));
  const rowsN = Math.ceil(P / cols);
  const panelW = ctx.width / cols;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const panelH = ctx.unit === 'pt' ? clamp(panelW * 0.72, 120, 230) : clamp(panelW * 0.7, 220, 360);
  // the legend names the second factor with each level ('hour 1'), so a bare level never stands alone
  const legend = groupLegend(seriesLabels.map((l) => (input.seriesTitle ? t('graphs.panels.legend', { factor: input.seriesTitle, level: l }) : l))).map((l) => ({ ...l, line: true }));
  const legendW = ctx.width - fs;
  const legendH = seriesLabels.length > 1 ? legendNodes(ctx, legend, 0, 0, legendW, lineMarker(ctx)).height + fs * 0.4 : 0;
  const titled = P > 1 || Boolean(panels[0].label);
  const titleOf = (p) => (input.panelTitle ? t('graphs.panels.title', { factor: input.panelTitle, level: p.label ?? '' }) : String(p.label ?? ''));
  const fits = titled ? panels.map((p) => fitTitle(titleOf(p), panelW - fs, fs, minFont(ctx))) : [];
  const titleH = titled ? Math.max(...fits.map((f) => f.lines.length * f.size * 1.05)) + fs * 0.7 : 0;
  const size = ctx.unit === 'pt' ? { widthMm: panelW / PT_PER_MM, fontPt: fs } : { width: panelW };

  const nodes = [];
  if (legendH) nodes.push(...legendNodes(ctx, legend, fs * 0.5, fs * 0.2, legendW, lineMarker(ctx)).nodes);
  panels.forEach((p, k) => {
    const row = Math.floor(k / cols);
    const col = k % cols;
    const x = col * panelW;
    const y = legendH + row * (titleH + panelH);
    // every panel keeps the x title, so every plot has the same height on the shared value axis
    const m = timeCourseChart({ times, series: p.series, xTitle: input.xTitle || '', yTitle: col === 0 ? input.yTitle || '' : '', level, yDomain, noLegend: true }, { ...size, height: panelH, lang: ctx.lang, t, fmt: ctx.fmt });
    if (titled) nodes.push(...titleNodes(x + panelW / 2, y + fs * 0.35 + (fits[k].lines.length * fits[k].size * 1.05) / 2, fits[k], { 'text-anchor': 'middle', fill: 'ink', 'font-weight': 600 }));
    nodes.push({ t: 'g', a: { transform: `translate(${r2(x)} ${r2(y + titleH)})` }, c: m.marks });
  });
  const height = legendH + rowsN * (titleH + panelH);

  const rows = [];
  for (const p of panels) for (const s of p.series) for (const q of s.points) rows.push([p.label ?? '—', s.label, times[q.time], q.n ?? '', fmtN(ctx, q.mean, 'mean'), fmtCi(ctx, q.mean, q.lo, q.hi, 'mean')]);
  const columns = [input.panelTitle || t('graphs.col.group'), input.seriesTitle || t('graphs.col.level'), input.xTitle || t('graphs.col.time'), t('graphs.col.n'), t('graphs.col.mean'), t('graphs.col.ci', { level: lv })];
  const say = (r) => `${titled ? `${r[0]} ` : ''}${r[1]} ${r[2]} ${r[4]} (${r[5]})`;
  return finish(ctx, {
    kind: 'timeCourse',
    height,
    nodes,
    axes: [{ id: 'x', title: input.xTitle || '', categories: times }, { id: 'y', title: input.yTitle || '', domain: yDomain }],
    legend,
    drawLegend: legendH > 0,
    table: titled ? { columns, rows } : { columns: columns.slice(1), rows: rows.map((r) => r.slice(1)) },
    summary: t('graphs.summary.timePanels', { panels: P, series: seriesLabels.length, times: times.length, rows: rows.map(say).join('; ') }),
    notes: [t(titled ? 'graphs.note.timePanels' : 'graphs.note.timePanelsOne', { level: lv, factor: input.seriesTitle || t('graphs.col.level'), panel: input.panelTitle || t('graphs.col.group') })],
    extras: { panels: { count: P, columns: cols, yDomain } },
  });
}
