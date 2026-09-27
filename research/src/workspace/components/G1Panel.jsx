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
const hasSingle = (t, id) => { const k = `ws.route.${keyPart(id)}.descSingle`; return t(k) !== `[${k}]`; };

/**
 * @param {{ panel: any|null, stops: any[], nFarmsText?: string, onChoose: (route: string) => void, busy?: boolean, columnName: string, single?: boolean }} props
 *   panel: result of epi/guardrails.clusterPanel() or null when it could not be computed
 *   single: one estimate (a prevalence), not a comparison: no groups, no p-value, no within-farm route
 */
export default function G1Panel({ panel, stops, onChoose, busy = false, columnName, single = false }) {
  const { t } = useT();
  const [route, setRoute] = useState(null);
  const g1 = stops.find((s) => s.id === 'G1') || stops.find((s) => s.id === 'G2') || stops[0];
  // A prevalence has no groups to compare within a farm (review round 1): its routes are the widened
  // interval and the farm-level prevalence, described for one estimate.
  const routes = [...(panel?.routes || []).map((r) => ({ ...r }))].filter((r) => !single || r.id !== 'mh-within');
  for (const id of ['gee', 'mixed']) if (!routes.some((r) => r.id === id)) routes.push({ id, enabled: false, reasonKey: 'ws.route.m3' });
  routes.sort((a, b) => ROUTE_ORDER.indexOf(a.id) - ROUTE_ORDER.indexOf(b.id));
  // The ICC keeps four decimals and the effective n prints whole, as in the result table (review round 3).
  const stat = (v, labelKey, kind, { digits, whole = false } = {}) => (
    <div className="rs-stat">
      <div className="rs-stat-num rs-num">{v && v.value !== null && v.value !== undefined ? formatNumber(whole && Number.isFinite(v.value) ? Math.round(v.value) : v.value, { kind, ...(digits === undefined ? {} : { digits }) }) : '—'}</div>
      <div className="rs-soft rs-small">{t(labelKey)}</div>
    </div>
  );
  return (
    <section className="rs-stop" aria-labelledby="rs-g1-title">
      <div className="rs-stop-head">
        <span className="rs-stop-icon"><Icon name="stop" size={22} /></span>
        <div>
          <h2 id="rs-g1-title" className="rs-h2">{t(single ? 'ws.g1.titleSingle' : 'ws.g1.title')}</h2>
          <p>{single ? t('ws.g1.bodySingle', { column: columnName }) : g1 ? t(g1.bodyKey || g1.key, g1.params) : t('ws.g1.body', { column: columnName })}</p>
        </div>
      </div>
      {panel ? (
        <>
          <div className="rs-stats3">
            {stat(panel.icc, 'ws.g1.icc', 'statistic', { digits: 4 })}
            {stat(panel.deff, 'ws.g1.deff', 'ratio')}
            {stat(panel.nEff, 'ws.g1.nEff', 'count', { whole: true })}
          </div>
          <dl className="rs-g1-glosses rs-small">
            <div><dt>{t('ws.g1.icc')}</dt><dd className="rs-soft">{t('term.icc.gloss')}</dd></div>
            <div><dt>{t('ws.g1.deff')}</dt><dd className="rs-soft">{t('term.deff.gloss')}</dd></div>
          </dl>
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
                <span className="rs-soft rs-small">{t(single && hasSingle(t, r.id) ? `ws.route.${keyPart(r.id)}.descSingle` : `ws.route.${keyPart(r.id)}.desc`, { column: columnName })}</span>
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
