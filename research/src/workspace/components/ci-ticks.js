// Labelled ends for the CI plot's log axis [M1-DESIGN.md 14, 17]. ci-plot.js labels 1, 2 and 5 times a
// power of ten (and a few fallbacks when that gives too few), so an interval such as 0.43 to 1.34 ran
// past the last label, 1, with nothing to read its end against (review round 3). When the data run
// more than a tenth of the axis past the outermost label, this adds the nice value nearest the data
// end on that side, if it is inside the drawn domain and clear of the other labels. Pure: CiPlot.jsx
// draws what this returns, so the screen and the downloaded chart are the same picture.
// OWNER: landing role (art fix, round 3), used by workspace/components/CiPlot.jsx.

/** Nice mantissas for extra log-axis labels (1.4 and 0.7 pair up around 1, as forest plots do). */
const NICE = [1, 1.2, 1.4, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];
/** Share of the axis the data may run past the outermost label before one is added. */
const RUN_OVER = 0.1;
/** Smallest distance in px between two label centres (a label such as "0.25" is about 26 px wide). */
export const MIN_TICK_GAP = 36;

/**
 * @param {{ log: boolean, domain: [number, number], plotLeft: number, plotRight: number,
 *   ticks: { v: number, x: number }[], rows: { est?: number|null, lo?: number|null, hi?: number|null }[] }} L
 *   the layout from ciPlotLayout
 * @returns {{ v: number, x: number }[]} the ticks to draw, in order
 */
export function ticksWithEnds(L) {
  const ticks = [...L.ticks];
  if (!L.log || !ticks.length) return ticks;
  const [min, max] = L.domain;
  const span = Math.log(max) - Math.log(min);
  if (!(span > 0)) return ticks;
  const xOf = (v) => L.plotLeft + ((Math.log(v) - Math.log(min)) / span) * (L.plotRight - L.plotLeft);
  const vals = [];
  for (const r of L.rows) for (const v of [r.est, r.lo, r.hi]) if (typeof v === 'number' && Number.isFinite(v) && v > 0) vals.push(v);
  if (!vals.length) return ticks;
  const nice = [];
  for (let e = Math.floor(Math.log10(min)) - 1; e <= Math.ceil(Math.log10(max)) + 1; e += 1) {
    for (const m of NICE) {
      const v = Number((m * 10 ** e).toPrecision(12));
      if (v >= min && v <= max) nice.push(v);
    }
  }
  const clear = (v) => ticks.every((tk) => Math.abs(tk.x - xOf(v)) >= MIN_TICK_GAP);
  const add = (end, beyond) => {
    const pick = nice
      .filter((v) => beyond(v) && clear(v))
      .sort((a, b) => Math.abs(Math.log(a / end)) - Math.abs(Math.log(b / end)))[0];
    if (pick !== undefined) ticks.push({ v: pick, x: xOf(pick) });
  };
  const top = ticks[ticks.length - 1].v;
  const dataMax = Math.max(...vals);
  if ((Math.log(dataMax) - Math.log(top)) / span > RUN_OVER) add(dataMax, (v) => v > top);
  const bottom = ticks[0].v;
  const dataMin = Math.min(...vals);
  if ((Math.log(bottom) - Math.log(dataMin)) / span > RUN_OVER) add(dataMin, (v) => v < bottom);
  return ticks.sort((a, b) => a.v - b.v);
}
