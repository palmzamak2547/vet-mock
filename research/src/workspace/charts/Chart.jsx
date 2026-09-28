// Draws a chart model (charts/model.js) as SVG with the data table beside it (fit.md D17) and the
// accessible summary as its title [M2-DESIGN.md 8.1]. The SVG comes from the same render tree the
// downloads use (render.js), with CSS variables for colour so it follows the light and dark themes.
// `AutoChart` measures the column and builds the model at the width it is shown (text stays 12 px on a
// phone), and hands the export a builder at the printed width (7 to 9 pt type in the file).
// OWNER: graphs role.
import { createElement, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { buildChart } from './model.js';
import { renderTree, withMadeUpNote } from './render.js';
import ChartExport from '../components/ChartExport.jsx';
import '../../styles/charts.css';

const camel = (k) => (k.startsWith('aria-') || k.startsWith('data-') || k === 'xmlns' ? k : k.replace(/-([a-z])/g, (_m, c) => c.toUpperCase()));

/** A render tree node as React elements. */
function toReact(node, key) {
  if (!node) return null;
  const props = { key };
  for (const [k, v] of Object.entries(node.a || {})) if (v !== undefined && v !== null) props[camel(k)] = v;
  const kids = [];
  if (node.text !== undefined) kids.push(node.text);
  (node.c || []).forEach((c, i) => kids.push(toReact(c, i)));
  return createElement(node.t, props, ...kids);
}

/**
 * @param {{ model: ReturnType<import('./model.js').buildChart>, title?: string, madeUp?: boolean, fileBase?: string, onDownloaded?: (kind: string) => void, exportModel?: (widthMm: number) => ReturnType<import('./model.js').buildChart>, plotRef?: any }} props
 */
/** Chart number tables longer than this are folded. */
const FOLD_ROWS = 12;

export default function Chart({ model, title, madeUp = false, fileBase, onDownloaded, exportModel, plotRef }) {
  const { t } = useT();
  const tree = useMemo(() => renderTree(model, 'screen', { title: title || model.title || '' }), [model, title]);
  const heading = title || model.title || '';
  // A long number table (a whole life table) is folded under the chart instead of standing beside it
  // (review round 2: 32 rows, about 1,900 px, open under every Kaplan-Meier chart).
  const long = (model.table?.rows?.length || 0) > FOLD_ROWS;
  const tableEl = (
    <table className="rs-table rs-table--compact rs-num">
      <caption className="rs-visually-hidden">{t('graphs.tableCaption', { title: heading || t(`graphs.kind.${model.kind}`) })}</caption>
      <thead>
        <tr>{model.table.columns.map((c, i) => <th key={i} scope="col" className={i ? 'rs-r' : ''}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {model.table.rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (j === 0
              ? <th key={j} scope="row">{c === null || c === undefined ? '—' : String(c)}</th>
              : <td key={j} className="rs-r">{c === null || c === undefined ? '—' : String(c)}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <figure className="rs-chart" data-chart={model.kind}>
      {heading || madeUp ? (
        <figcaption className="rs-figcap">
          {heading}
          {madeUp ? <> <span className="rs-chart-madeup">{t('graphs.madeUp')}</span></> : null}
        </figcaption>
      ) : null}
      <div className={`rs-chart-row${long ? '' : ' rs-chart-row--side'}`}>
        <div className="rs-chart-plot" ref={plotRef}>{toReact(tree, 'svg')}</div>
        {long ? null : <div className="rs-chart-table">{tableEl}</div>}
      </div>
      {long ? (
        <details className="rs-chart-table rs-chart-table--folded">
          <summary className="rs-small">{t('ws.table.folded', { caption: t('graphs.tableCaption', { title: heading || t(`graphs.kind.${model.kind}`) }), n: model.table.rows.length })}</summary>
          {tableEl}
        </details>
      ) : null}
      {model.notes?.length ? <div className="rs-chart-notes rs-soft rs-small">{model.notes.map((n, i) => <p key={i}>{n}</p>)}</div> : null}
      {exportModel && fileBase ? <ChartExport build={exportModel} fileBase={fileBase} onDownloaded={onDownloaded} title={heading} /> : null}
    </figure>
  );
}

/**
 * Builds the chart at the width of its column and draws it; exports are rebuilt at the printed width.
 * @param {{ kind: string, input: any, title?: string, madeUp?: boolean, fileBase?: string, onDownloaded?: (kind: string) => void, fmt: any }} props
 */
export function AutoChart({ kind, input, title, madeUp, fileBase, onDownloaded, fmt }) {
  const { t, lang } = useT();
  const boxRef = useRef(null);
  const [width, setWidth] = useState(560);
  useLayoutEffect(() => {
    // the plot column is sized by the grid (minmax(0, ...)), never by the drawing inside it
    const el = boxRef.current;
    if (!el) return undefined;
    const fit = (w) => { if (w > 0) setWidth((old) => { const next = Math.max(260, Math.min(760, Math.floor(w))); return Math.abs(old - next) >= 4 ? next : old; }); };
    fit(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => fit(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const result = useMemo(() => {
    try {
      return { model: buildChart(kind, input, { width, lang, t, fmt, title }) };
    } catch (err) {
      return { error: err?.key || 'graphs.error.noData' };
    }
  }, [kind, input, width, lang, t, fmt, title]);
  // Every file made from a chart of made-up data says so in its margin (withMadeUpNote).
  const exportModel = useMemo(() => (widthMm) => {
    const m = buildChart(kind, input, { widthMm, lang, t, fmt, title });
    return madeUp ? withMadeUpNote(m, t('graphs.madeUp')) : m;
  }, [kind, input, lang, t, fmt, title, madeUp]);
  if (result.error) return <p className="rs-soft" ref={boxRef}>{t(result.error)}</p>;
  return <Chart model={result.model} title={title} madeUp={madeUp} fileBase={fileBase} onDownloaded={onDownloaded} exportModel={exportModel} plotRef={boxRef} />;
}
