// The project rail [workspace boards, rail()]: data (import, codebook, data), analysis (design,
// prevalence, association, Table 1), report, tools (sample size), and the project log with the egress
// line and the file fingerprint. On a phone it is a drawer opened from the top bar. OWNER: ui-analysis role
// (M2; workspace in M1). M2 items [M2-DESIGN.md 10.1]: data tools, the lab/models/survival/measure panes,
// figures, and the power and randomisation tools.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { formatMoment } from '../lib/era.js';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';
import Link from './Link.jsx';
import { keyPart } from '../lib/keys.js';

export const RAIL = [
  { h: 'ws.rail.group.data' },
  { id: 'import', label: 'ws.rail.import', icon: 'upload' },
  { id: 'codebook', label: 'ws.rail.codebook', icon: 'book', needsData: true },
  { id: 'data', label: 'ws.rail.data', icon: 'grid', needsData: true },
  { h: 'ws.rail.group.dataTools' },
  { id: 'merge', label: 'ws.rail.merge', icon: 'plus', needsData: true },
  { id: 'reshape', label: 'ws.rail.reshape', icon: 'table', needsData: true },
  { id: 'aggregate', label: 'ws.rail.aggregate', icon: 'folder', needsData: true },
  { id: 'compute', label: 'ws.rail.compute', icon: 'calc', needsData: true },
  { id: 'clean', label: 'ws.rail.clean', icon: 'filter', needsData: true },
  { id: 'compare', label: 'ws.rail.compare', icon: 'copy', needsData: true },
  { h: 'ws.rail.group.analysis' },
  { id: 'design', label: 'ws.rail.design', icon: 'design' },
  { id: 'prev', label: 'ws.rail.prev', icon: 'percent', needsData: true },
  { id: 'assoc', label: 'ws.rail.assoc', icon: 'pair', needsData: true },
  { id: 'lab', label: 'ws.rail.lab', icon: 'pair', needsData: true },
  { id: 'models', label: 'ws.rail.models', icon: 'arrow', needsData: true },
  { id: 'survival', label: 'ws.rail.survival', icon: 'down', needsData: true },
  { id: 'measure', label: 'ws.rail.measure', icon: 'check', needsData: true },
  { id: 'table1', label: 'ws.rail.table1', icon: 'table', needsData: true },
  { h: 'ws.rail.group.report' },
  { id: 'report', label: 'ws.rail.report', icon: 'doc' },
  { id: 'figures', label: 'ws.rail.figures', icon: 'image', needsData: true },
  { h: 'ws.rail.group.tools' },
  { id: 'sampleSize', label: 'ws.rail.sampleSize', icon: 'calc', href: '/app/tools/sample-size' },
  { id: 'power', label: 'ws.rail.power', icon: 'calc', href: '/app/tools/power' },
  { id: 'randomise', label: 'ws.rail.randomise', icon: 'lock', href: '/app/tools/randomise' },
  { id: 'sampling', label: 'ws.rail.sampling', icon: 'search', needsData: true },
];

/**
 * @param {{ projectId?: string, pane?: string|null, hasData?: boolean, log?: any[], fingerprint?: string|null, open?: boolean, onClose?: () => void, items?: any[], fileLineKey?: string }} props
 */
export default function Rail({ projectId, pane = null, hasData = false, log = [], fingerprint = null, open = false, onClose = () => {}, items = RAIL, fileLineKey = null }) {
  const { t, lang } = useT();
  const [showLog, setShowLog] = useState(false);
  const egress = log.filter((e) => e.egress && e.egress !== 'none').length;
  return (
    <>
      {open ? <div className="rs-rail-scrim rs-only-narrow" onClick={onClose} aria-hidden="true" /> : null}
      <nav id="rs-rail" className={`rs-rail${open ? ' rs-rail--open' : ''}`} aria-label={t('ws.rail.label')}>
        <Link to="/app" className="rs-rail-link rs-rail-back" onClick={onClose}>
          <Icon name="back" size={18} />
          <span>{t('ws.rail.allProjects')}</span>
        </Link>
        {items.map((it) => {
          if (it.h) return <div key={it.h} className="rs-rail-h">{t(it.h)}</div>;
          const href = it.href || `/app/p/${projectId}/${it.id}`;
          const on = it.id === pane;
          const disabled = it.needsData && !hasData;
          if (disabled) {
            return (
              <span key={it.id} className="rs-rail-link rs-rail-link--off" aria-disabled="true" title={t('ws.rail.needsData')}>
                <Icon name={it.icon} />
                <span>{t(it.label)}</span>
              </span>
            );
          }
          return (
            <Link key={it.id} to={href} className={`rs-rail-link${on ? ' rs-rail-link--on' : ''}`} aria-current={on ? 'page' : undefined}>
              <Icon name={it.icon} />
              <span>{t(it.label)}</span>
            </Link>
          );
        })}
        <span className="rs-grow" />
        <div className="rs-rail-foot">
          <button type="button" className="rs-rail-logbtn" onClick={() => setShowLog(true)} disabled={!projectId}>
            <Icon name="log" size={18} />
            {t('ws.rail.log')}
          </button>
          <div className="rs-soft rs-small">{egress ? t('ws.rail.egressSome', { n: egress }) : t('ws.rail.egressNone')}</div>
          {fileLineKey ? <div className="rs-soft rs-xsmall">{t(fileLineKey)}</div> : null}
          {fingerprint ? <div className="rs-soft rs-xsmall rs-mono" title={t('ws.rail.fingerprintTitle')}>{t('ws.rail.fingerprint', { hash: fingerprint.slice(0, 8) })}</div> : null}
        </div>
      </nav>
      <Dialog open={showLog} onClose={() => setShowLog(false)} title={t('ws.log.title')} wide>
        <p className="rs-soft">{t('ws.log.intro')}</p>
        {log.length === 0 ? <p>{t('ws.log.empty')}</p> : (
          <ol className="rs-log">
            {[...log].reverse().map((e) => (
              <li key={`${e.seq}-${e.at}`} className="rs-log-item">
                <span className="rs-log-kind">{t(`ws.log.kind.${keyPart(e.kind)}`)}</span>
                <span className="rs-soft rs-small">{formatMoment(e.at, lang, { time: true })}</span>
                <span className="rs-soft rs-small">{e.egress === 'none' ? t('ws.log.egressNone') : t('ws.log.egressSome')}</span>
              </li>
            ))}
          </ol>
        )}
      </Dialog>
    </>
  );
}
