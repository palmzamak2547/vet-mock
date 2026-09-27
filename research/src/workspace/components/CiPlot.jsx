// The CI plot [M1-DESIGN.md 14, 17]: hand-drawn SVG from ci-plot.js, one row per estimate, with the
// same numbers in a data table beside it and an aria-label that carries them, so the picture never
// holds information the table does not. Colours are CSS variables on screen; the export inlines them.
// Download as SVG, or PNG at 300 or 600 dpi for a chosen printed width. OWNER: workspace role.
import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { ciPlotLayout, tickText } from '../lib/ci-plot.js';
import { ticksWithEnds } from './ci-ticks.js';
import ChartExport from './ChartExport.jsx';

/**
 * @typedef {{ label: string, est: number|null, lo: number|null, hi: number|null, muted?: boolean, accent?: boolean, estText: string, ciText: string }} PlotItem
 */

export const CiSvg = forwardRef(function CiSvg({ items, log, refValue, width, labelW, ariaLabel, title, percent = false }, ref) {
  const L = ciPlotLayout(items, { width, labelW, log, ref: refValue });
  // A log axis gets a label near each interval end it would otherwise run past (review round 3: the
  // interval ran to 1.34 on an axis labelled up to 1).
  const ticks = ticksWithEnds(L);
  return (
    <svg ref={ref} className="rs-ciplot" width={L.width} height={L.height} viewBox={`0 0 ${L.width} ${L.height}`} role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <rect x="0" y="0" width={L.width} height={L.height} fill="var(--rs-surface)" />
      {ticks.map((tk) => (
        <g key={tk.v}>
          <line x1={tk.x} x2={tk.x} y1={L.top} y2={L.bottom} stroke="var(--rs-line)" strokeWidth="1" strokeDasharray="2 4" />
          <text x={tk.x} y={L.height - 8} textAnchor="middle" fontSize="12" fill="var(--rs-ink-soft)" fontFamily="Sarabun, sans-serif">{tickText(tk.v, percent)}</text>
        </g>
      ))}
      {L.refX !== null ? <line x1={L.refX} x2={L.refX} y1={L.top} y2={L.bottom} stroke="var(--rs-ink-soft)" strokeWidth="1.4" /> : null}
      {L.rows.map((r) => {
        const col = r.muted ? 'var(--rs-ink-soft)' : r.accent ? 'var(--rs-gold)' : 'var(--rs-sage)';
        return (
          <g key={r.label}>
            <text x="0" y={r.y + 4.5} fontSize="13" fontWeight={r.muted ? 400 : 600} fill={r.muted ? 'var(--rs-ink-soft)' : 'var(--rs-ink)'} fontFamily="Sarabun, sans-serif">{r.label}</text>
            {r.xLo !== null && r.xHi !== null ? (
              <line x1={r.xLo} x2={r.xHi} y1={r.y} y2={r.y} stroke={col} strokeWidth={r.muted ? 2 : 5} strokeLinecap={r.openLo || r.openHi ? 'butt' : 'round'} />
            ) : null}
            {r.openHi && r.xHi !== null ? <path d={`M ${r.xHi - 7} ${r.y - 6} L ${r.xHi} ${r.y} L ${r.xHi - 7} ${r.y + 6}`} fill="none" stroke={col} strokeWidth="2" /> : null}
            {r.openLo && r.xLo !== null ? <path d={`M ${r.xLo + 7} ${r.y - 6} L ${r.xLo} ${r.y} L ${r.xLo + 7} ${r.y + 6}`} fill="none" stroke={col} strokeWidth="2" /> : null}
            {r.xEst !== null ? (
              r.muted
                ? <circle cx={r.xEst} cy={r.y} r="4.5" fill="var(--rs-surface)" stroke={col} strokeWidth="2" />
                : <circle cx={r.xEst} cy={r.y} r="7" fill={col} stroke="var(--rs-surface)" strokeWidth="2" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
});

/**
 * @param {{ items: PlotItem[], log: boolean, refValue: number|null, title: string, fileBase: string, onDownloaded?: (kind: string) => void, levelText: string }} props
 */
export default function CiPlot({ items, log, refValue, title, fileBase, onDownloaded, levelText, percent = false }) {
  const { t } = useT();
  const svgRef = useRef(null);
  const boxRef = useRef(null);
  // The plot is drawn at the width it is shown at, so its text stays 12 to 13 CSS px on a phone and
  // beside a table (review round 1: scaling a 560 px drawing into a narrow column gave 7 px labels).
  const [width, setWidth] = useState(560);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const fit = (w) => { if (w > 0) setWidth((old) => (Math.abs(old - Math.max(200, Math.min(720, w))) >= 4 ? Math.max(200, Math.min(720, w)) : old)); };
    // Measured before the first paint, then kept in step with the column.
    fit(Math.floor(el.clientWidth));
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => fit(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length > 0]);
  if (!items.length) return null;
  const labelW = Math.round(Math.min(170, width * 0.36));
  const ariaLabel = t('ws.plot.aria', { title, rows: items.map((r) => (r.ciText ? t('ws.plot.ariaRowCi', { label: r.label, est: r.estText, level: levelText, ci: r.ciText }) : t('ws.plot.ariaRow', { label: r.label, est: r.estText }))).join('; ') });
  return (
    <figure className="rs-figure">
      <figcaption className="rs-figcap">{title}</figcaption>
      <div className="rs-figure-row">
        <div className="rs-figure-plot" ref={boxRef}>
          <CiSvg ref={svgRef} items={items} log={log} refValue={refValue} width={width} labelW={labelW} ariaLabel={ariaLabel} title={title} percent={percent} />
        </div>
        <table className="rs-table rs-table--compact rs-num">
          <caption className="rs-visually-hidden">{t('ws.plot.tableCaption', { title })}</caption>
          <thead>
            <tr>
              <th scope="col">{t('ws.result.col.measure')}</th>
              <th scope="col" className="rs-r">{t('ws.result.col.estimate')}</th>
              <th scope="col" className="rs-r">{t('ws.result.col.ci', { level: levelText })}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.label}>
                <th scope="row" className={r.muted ? 'rs-soft' : ''}>{r.label}</th>
                <td className="rs-r">{r.estText}</td>
                <td className="rs-r">{r.ciText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rs-soft rs-small">{log ? t('ws.plot.logNote') : t('ws.plot.linearNote')}</p>
      <ChartExport svgRef={svgRef} fileBase={fileBase} onDownloaded={onDownloaded} />
    </figure>
  );
}
