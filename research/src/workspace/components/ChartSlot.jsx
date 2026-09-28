// One chart under a result [M2-DESIGN.md 8, 10.2]: the chart kit's drawing at the width of its column,
// with its data table beside it and the SVG, PNG and TIFF downloads (charts/Chart.jsx AutoChart, graphs
// role). The chart's input comes from lib/chart-inputs.js, which reads it out of the envelope. A chart
// the kit cannot draw leaves one plain sentence, never an error screen: the result's tables already carry
// every number. OWNER: ui-analysis role.
import { Component } from 'react';
import { useT } from '../../i18n/index.js';
import { formatCi, formatNumber, formatP } from '../../lib/stats/format.js';
import { buildChart } from '../charts/model.js';
import { AutoChart } from '../charts/Chart.jsx';
import { safeFileBase } from '../lib/files.js';

export const CHART_FMT = Object.freeze({ formatNumber, formatP, formatCi });

/** Shows its fallback when the drawing throws, so one chart can never take the result down with it. */
class Quiet extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {}

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}

/**
 * A chart model at a printed width for the figure composer, or null when the kit cannot draw it.
 * @param {{ kind: string, input: any }} chart
 * @param {{ lang: 'th'|'en', t: any, widthMm: number, title?: string }} opts
 */
export function tryBuildChart(chart, opts) {
  try {
    return buildChart(chart.kind, chart.input, { ...opts, fmt: CHART_FMT });
  } catch {
    return null;
  }
}

/**
 * @param {{ chart: { id: string, kind: string, titleKey: string, input: any }, caption: string, madeUp?: boolean, onDownloaded?: (kind: string) => void }} props
 */
export default function ChartSlot({ chart, caption, madeUp = false, onDownloaded }) {
  const { t } = useT();
  const title = t(chart.titleKey);
  return (
    <section className="rs-chartslot" aria-label={title}>
      <Quiet fallback={<p className="rs-soft rs-small">{t('ws.chart.drawFailed')}</p>}>
        <AutoChart kind={chart.kind} input={chart.input} title={title} madeUp={madeUp} fileBase={safeFileBase(`${caption}-${title}`)} onDownloaded={onDownloaded} fmt={CHART_FMT} />
      </Quiet>
    </section>
  );
}
