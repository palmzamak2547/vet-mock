// The figure composer's bookkeeping [M2-DESIGN.md 8.3]: which charts of the kept results can be a
// panel, the order the student put them in, the column count, the printed width (the journal column
// widths the chart kit offers, or a typed width) and the panel letters. The widths, the panel count and
// the drawing are the chart kit's (charts/figure.js, graphs role), so the composer can never ask for a
// figure the kit refuses. Pure. OWNER: ui-analysis role.
import { FIGURE_WIDTHS, FIGURE_WIDTH_RANGE, PANEL_RANGE, panelWidthMm as kitPanelWidth } from '../charts/figure.js';
import { chartsForResult } from './chart-inputs.js';
import { isStale } from './result-model.js';

export { FIGURE_WIDTHS, FIGURE_WIDTH_RANGE, PANEL_RANGE };
/** Most columns a figure may have. */
export const MAX_COLUMNS = 3;

/**
 * Every chart of every kept result, newest result first, each with a stable key. A chart of every
 * animal is offered only when the result was computed on the data now open.
 * @param {{ id: string, createdAt?: string, spec?: any, envelope?: any, dataFingerprint?: string }[]} analyses
 * @param {any} table   the working table now open, or null
 * @param {{ labelOf?: (key: string) => string, fingerprint?: string|null, t?: any }} [ctx]
 * @returns {{ key: string, analysisId: string, chartId: string, kind: string, titleKey: string, input: any, methodId: string, createdAt: string|null, stale: boolean }[]}
 */
export function figureCandidates(analyses, table, ctx = {}) {
  const sorted = [...(analyses || [])].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const out = [];
  for (const a of sorted) {
    const stale = isStale(a, ctx.fingerprint ?? null);
    for (const ch of chartsForResult(a, table, { labelOf: ctx.labelOf, stale, t: ctx.t })) {
      out.push({
        key: `${a.id}|${ch.id}`, analysisId: a.id, chartId: ch.id, kind: ch.kind, titleKey: ch.titleKey, input: ch.input,
        methodId: a?.envelope?.method?.id || a?.spec?.method || '', createdAt: a.createdAt || null, stale,
      });
    }
  }
  return out;
}

/** Add a panel at the end (while the figure has room for one more), or take it out. */
export function togglePanel(keys, key, max = PANEL_RANGE[1]) {
  if (keys.includes(key)) return keys.filter((k) => k !== key);
  return keys.length >= max ? keys : [...keys, key];
}

/** Move a panel one place earlier (-1) or later (+1); unchanged at the ends. */
export function movePanel(keys, key, dir) {
  const i = keys.indexOf(key);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= keys.length) return keys;
  const out = [...keys];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

/** Panel letter for position i (the kit labels panels A to F; a figure holds at most six). */
export function panelLetter(i) {
  return String.fromCharCode(65 + i);
}

/**
 * A typed width in millimetres, or the key of the sentence that says why it cannot be used.
 * Thai digits are read as digits.
 * @param {string} text
 * @returns {{ ok: true, mm: number } | { ok: false, key: string }}
 */
export function parseWidth(text) {
  const s = String(text ?? '').trim().replace(/[\u0E50-\u0E59]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
  if (!/^\d+(\.\d+)?$/.test(s)) return { ok: false, key: 'ws.figure.widthNotNumber' };
  const mm = Number(s);
  if (mm < FIGURE_WIDTH_RANGE[0] || mm > FIGURE_WIDTH_RANGE[1]) return { ok: false, key: 'ws.figure.widthRange' };
  return { ok: true, mm };
}

/**
 * The layout the kit is asked for: columns held between 1 and the panel count (and MAX_COLUMNS).
 * @param {{ columns: number, widthMm: number, labels: boolean }} layout
 * @param {number} count
 */
export function figureLayout(layout, count) {
  const columns = Math.max(1, Math.min(MAX_COLUMNS, count || 1, Math.round(Number(layout.columns) || 1)));
  return { columns, widthMm: layout.widthMm, labels: Boolean(layout.labels) };
}

/** Printed width each panel is built at, so its text keeps 7 to 9 pt in the figure (the kit's rule). */
export function panelWidthMm(layout) {
  return kitPanelWidth(layout.widthMm, layout.columns);
}

/** Whether the chosen panels make a figure the kit draws (2 to 6 panels). */
export function panelCountOk(n) {
  return n >= PANEL_RANGE[0] && n <= PANEL_RANGE[1];
}
