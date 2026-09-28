// Geometry of the hand-drawn CI plot [M1-DESIGN.md 14, 17; fit.md D17]: one row per estimate, the
// interval as a line, the estimate as a dot, a reference line at no effect (1 for ratios, 0 for
// differences). Open bounds (Infinity) run to the plot edge and are marked as open. Pure: the SVG
// component draws what this returns, so the export and the screen are the same picture.
// Ticks come from the chart kit's niceTicks with a minimum label gap, so a narrow plot never crowds its
// labels (M2 carried item 7); the fixed 1-2-5 lists below stay for callers that want them.
// OWNER: graphs role (moved under the chart kit in M2).
import { niceTicks } from '../charts/scale.js';
import { MIN_TICK_GAP } from '../components/ci-ticks.js';

/**
 * @typedef {{ label: string, est: number|null, lo: number|null, hi: number|null, muted?: boolean, accent?: boolean }} PlotRow
 */

const finite = (v) => typeof v === 'number' && Number.isFinite(v);

/** Nice linear ticks (1, 2, 2.5 or 5 times a power of ten), about `count` of them. */
export function linearTicks(min, max, count = 5) {
  if (!(max > min)) return [min];
  const raw = (max - min) / Math.max(1, count);
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) || 10 * pow;
  const out = [];
  const start = Math.ceil(min / step - 1e-9) * step;
  for (let v = start; v <= max + step * 1e-9; v += step) out.push(Number(v.toPrecision(12)));
  return out;
}

/** Ticks for a log axis: 1, 2 and 5 times powers of ten inside the domain, and 1 when inside. */
export function logTicks(min, max) {
  const out = [];
  for (let e = Math.floor(Math.log10(min)) - 1; e <= Math.ceil(Math.log10(max)) + 1; e += 1) {
    for (const m of [1, 2, 5]) {
      const v = Number((m * 10 ** e).toPrecision(12));
      if (v >= min * (1 - 1e-9) && v <= max * (1 + 1e-9)) out.push(v);
    }
  }
  if (out.length < 3) {
    for (let e = Math.floor(Math.log10(min)) - 1; e <= Math.ceil(Math.log10(max)) + 1; e += 1) {
      for (const m of [1.5, 3, 4, 7]) {
        const v = Number((m * 10 ** e).toPrecision(12));
        if (v >= min && v <= max) out.push(v);
      }
    }
    out.sort((a, b) => a - b);
  }
  return out;
}

/**
 * @param {PlotRow[]} rows
 * @param {{ width?: number, labelW?: number, rowH?: number, log?: boolean, ref?: number|null, minGapPx?: number }} [opts]
 *   minGapPx: smallest distance between two tick labels (default MIN_TICK_GAP, 36 px)
 */
export function ciPlotLayout(rows, opts = {}) {
  const width = opts.width ?? 560;
  const labelW = opts.labelW ?? 150;
  const rowH = opts.rowH ?? 40;
  const log = Boolean(opts.log);
  const ref = opts.ref ?? null;
  const top = 6;
  const L = labelW + 14;
  const R = 12;
  const pts = [];
  for (const r of rows) for (const v of [r.est, r.lo, r.hi]) if (finite(v) && (!log || v > 0)) pts.push(v);
  if (finite(ref) && (!log || ref > 0)) pts.push(ref);
  let min = pts.length ? Math.min(...pts) : log ? 0.5 : 0;
  let max = pts.length ? Math.max(...pts) : log ? 2 : 1;
  if (log) {
    const span = Math.log(max / min) || Math.log(2);
    min = Math.exp(Math.log(min) - span * 0.08);
    max = Math.exp(Math.log(max) + span * 0.08);
  } else {
    const span = max - min || Math.abs(max) || 1;
    min -= span * 0.08;
    max += span * 0.08;
  }
  const t = (v) => (log ? (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)) : (v - min) / (max - min));
  const x = (v) => L + Math.min(1, Math.max(0, t(v))) * (width - L - R);
  const bottom = top + rows.length * rowH;
  const height = bottom + 28;
  const ticks = niceTicks(min, max, { pixels: width - L - R, minGapPx: opts.minGapPx ?? MIN_TICK_GAP, log }).map((v) => ({ v, x: x(v) }));
  const laid = rows.map((r, i) => {
    const y = top + i * rowH + rowH / 2;
    const openLo = r.lo === -Infinity || (log && r.lo === 0);
    const openHi = r.hi === Infinity;
    const has = finite(r.est) || finite(r.lo) || finite(r.hi) || openLo || openHi;
    return {
      ...r,
      y,
      has,
      xEst: finite(r.est) && (!log || r.est > 0) ? x(r.est) : null,
      xLo: openLo ? L : finite(r.lo) && (!log || r.lo > 0) ? x(r.lo) : null,
      xHi: openHi ? width - R : finite(r.hi) ? x(r.hi) : null,
      openLo,
      openHi,
    };
  });
  return {
    width,
    height,
    labelW,
    plotLeft: L,
    plotRight: width - R,
    top,
    bottom,
    log,
    domain: [min, max],
    refX: finite(ref) && (!log || ref > 0) ? x(ref) : null,
    ticks,
    rows: laid,
  };
}

/** Axis number text: integers as they are, others with up to 3 significant digits. */
export function tickText(v, percent = false) {
  // A proportion's axis is read in percent, like every other number beside it (review round 2).
  if (percent) {
    const x = Number((v * 100).toPrecision(3));
    return `${Number.isInteger(x) ? x : x}%`;
  }
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toPrecision(3)));
}
