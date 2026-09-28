// The charts of one result [M2-DESIGN.md 8.2, 10.2]: one chart at a time, the first the kit offers (for
// a group comparison, every animal as a dot with the mean and its interval, Weissgerber 2015), with a
// choice of the others (box, violin, the estimate with its interval, the p-value function) as radio
// buttons, so a result is followed by one picture, not five. A kept result says its charts can go into a
// multi-panel figure. OWNER: ui-analysis role.
import { useEffect, useState } from 'react';
import { useT } from '../../i18n/index.js';
import ChartSlot from './ChartSlot.jsx';
import Link from './Link.jsx';

/**
 * @param {{ charts: { id: string, kind: string, titleKey: string, input: any }[], caption: string, idBase: string, figuresHref?: string|null, onDownloaded?: (kind: string, chartId: string) => void }} props
 *   figuresHref: when the result is kept, the figures pane, where its charts become panels
 */
export default function ResultCharts({ charts, caption, idBase, figuresHref = null, madeUp = false, onDownloaded }) {
  const { t } = useT();
  const [pick, setPick] = useState(charts[0]?.id || null);
  useEffect(() => {
    if (!charts.some((c) => c.id === pick)) setPick(charts[0]?.id || null);
  }, [charts, pick]);
  if (!charts.length) return null;
  const shown = charts.find((c) => c.id === pick) || charts[0];
  return (
    <section className="rs-charts rs-stack" aria-labelledby={`${idBase}-h`}>
      <h3 id={`${idBase}-h`} className="rs-h3">{t('ws.chart.sectionTitle')}</h3>
      {charts.length > 1 ? (
        <fieldset className="rs-fieldset">
          <legend className="rs-field-label">{t('ws.chart.which')}</legend>
          <div className="rs-seg rs-seg--wrap" role="presentation">
            {charts.map((c) => (
              <label key={c.id} className="rs-seg-btn rs-seg-radio">
                <input type="radio" name={`${idBase}-kind`} value={c.id} checked={shown.id === c.id} onChange={() => setPick(c.id)} />
                {t(c.titleKey)}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <ChartSlot key={shown.id} chart={shown} caption={caption} madeUp={madeUp} onDownloaded={(kind) => onDownloaded?.(kind, shown.id)} />
      {figuresHref ? (
        <p className="rs-soft rs-small">
          {t('ws.figure.savedHint')}{' '}
          <Link to={figuresHref} className="rs-plainlink">{t('ws.rail.figures')}</Link>
        </p>
      ) : null}
    </section>
  );
}
