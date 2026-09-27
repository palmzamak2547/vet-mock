// The herd picture [workspace boards "Prevalence" and "PhoneHerd"]: one group of dots per farm, filled
// dots are positives, the farm id under each group. Still (no motion) and drawn from the rows in use;
// it prints no statistics: the numbers on the screen come from the engine. A text alternative says what
// the picture shows. OWNER: workspace role.
import { useMemo } from 'react';
import { useT } from '../../i18n/index.js';
import { herdLayout } from '../lib/herd.js';

/** @param {{ groups: { id: string, n: number, pos: number }[], clusterName: string }} props */
export default function Herd({ groups, clusterName }) {
  const { t } = useT();
  const L = useMemo(() => herdLayout(groups, { cols: 7, step: 11, cellW: 74, cellH: 64 }), [groups]);
  if (!groups.length) return null;
  return (
    <figure className="rs-panel rs-pad rs-herd">
      <figcaption className="rs-h3">{t('ws.herd.title', { column: clusterName })}</figcaption>
      <div className="rs-herd-svgwrap">
        <svg viewBox={`0 0 ${L.width} ${L.height}`} width={L.width} height={L.height} role="img" aria-label={t('ws.herd.alt', { column: clusterName })}>
          {L.dots.map((d, k) => (d.pos
            ? <circle key={k} cx={d.x} cy={d.y} r="4.2" fill="var(--rs-rose)" />
            : <circle key={k} cx={d.x} cy={d.y} r="3.6" fill="none" stroke="var(--rs-ink-soft)" strokeOpacity="0.6" strokeWidth="1.2" />))}
          {L.labels.map((l) => <text key={l.id} x={l.x} y={l.y} textAnchor="middle" fontSize="10.5" fill="var(--rs-ink-soft)">{l.id}</text>)}
        </svg>
      </div>
      <div className="rs-legend rs-soft rs-small">
        <span className="rs-legend-item"><svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="var(--rs-rose)" /></svg>{t('ws.herd.positive')}</span>
        <span className="rs-legend-item"><svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.2" fill="none" stroke="var(--rs-ink-soft)" strokeWidth="1.3" /></svg>{t('ws.herd.negative')}</span>
        <span>{t('ws.herd.note')}</span>
      </div>
    </figure>
  );
}
