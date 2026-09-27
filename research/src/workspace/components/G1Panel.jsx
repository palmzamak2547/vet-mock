// The farm stop (G1) [M1-DESIGN.md 7.20; workspace boards "Association" and "PhoneResult"]: when
// animals from the same farm are in the data and no farm-aware route is chosen, no p-value and no
// comparison is shown. ICC, design effect and effective n come first, then the routes the data allow,
// each with why it fits or not. The student chooses by design, before any result exists; the choice
// is written into the methods paragraph. OWNER: workspace role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { formatNumber } from '../../lib/stats/format.js';
import Icon from './Icon.jsx';
import { keyPart } from '../lib/keys.js';

const ROUTE_ORDER = ['mh-within', 'deff', 'aggregate', 'gee', 'mixed'];

/**
 * @param {{ panel: any|null, stops: any[], nFarmsText?: string, onChoose: (route: string) => void, busy?: boolean, columnName: string }} props
 *   panel: result of epi/guardrails.clusterPanel() or null when it could not be computed
 */
export default function G1Panel({ panel, stops, onChoose, busy = false, columnName }) {
  const { t } = useT();
  const [route, setRoute] = useState(null);
  const g1 = stops.find((s) => s.id === 'G1') || stops.find((s) => s.id === 'G2') || stops[0];
  const routes = [...(panel?.routes || []).map((r) => ({ ...r }))];
  for (const id of ['gee', 'mixed']) if (!routes.some((r) => r.id === id)) routes.push({ id, enabled: false, reasonKey: 'ws.route.m3' });
  routes.sort((a, b) => ROUTE_ORDER.indexOf(a.id) - ROUTE_ORDER.indexOf(b.id));
  const stat = (v, labelKey, kind) => (
    <div className="rs-stat">
      <div className="rs-stat-num rs-num">{v && v.value !== null && v.value !== undefined ? formatNumber(v.value, { kind }) : '—'}</div>
      <div className="rs-soft rs-small">{t(labelKey)}</div>
    </div>
  );
  return (
    <section className="rs-stop" aria-labelledby="rs-g1-title">
      <div className="rs-stop-head">
        <span className="rs-stop-icon"><Icon name="stop" size={22} /></span>
        <div>
          <h2 id="rs-g1-title" className="rs-h2">{t('ws.g1.title')}</h2>
          <p>{g1 ? t(g1.bodyKey || g1.key, g1.params) : t('ws.g1.body', { column: columnName })}</p>
        </div>
      </div>
      {panel ? (
        <>
          <div className="rs-stats3">
            {stat(panel.icc, 'ws.g1.icc', 'statistic')}
            {stat(panel.deff, 'ws.g1.deff', 'ratio')}
            {stat(panel.nEff, 'ws.g1.nEff', 'count')}
          </div>
          <p className="rs-soft rs-small">{t('term.icc.gloss')} {t('term.deff.gloss')}</p>
        </>
      ) : null}
      <fieldset className="rs-fieldset">
        <legend className="rs-h3">{t('ws.g1.choose')}</legend>
        <div className="rs-choices">
          {routes.map((r) => (
            <label key={r.id} className={`rs-choice${r.enabled ? '' : ' rs-choice--off'}${route === r.id ? ' rs-choice--on' : ''}`}>
              <input type="radio" name="rs-g1-route" value={r.id} disabled={!r.enabled} checked={route === r.id} onChange={() => setRoute(r.id)} />
              <span className="rs-choice-text">
                <span className="rs-choice-title">{t(`ws.route.${keyPart(r.id)}.title`)}</span>
                <span className="rs-soft rs-small">{t(`ws.route.${keyPart(r.id)}.desc`, { column: columnName })}</span>
                {!r.enabled && r.reasonKey ? <span className="rs-soft rs-small">{t(r.reasonKey)}</span> : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="rs-soft">{t('ws.g1.byDesign')}</p>
      <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!route || busy} onClick={() => route && onChoose(route)}>
        {route ? t('ws.g1.run') : t('ws.g1.chooseFirst')}
      </button>
    </section>
  );
}
