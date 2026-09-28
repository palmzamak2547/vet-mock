// Study design first [M1-DESIGN.md 6; workspace board "Design"]: the student names the design before
// choosing a method, because the design decides which measures exist (no risk or relative risk from a
// case-control study, prevalence ratio first for a cross-sectional 2x2). The screen lists what the
// design can compute and what it cannot, with the reason, from lib/epi/design.js. OWNER: ui-analysis role
// (M2; workspace in M1). M2: each offered method links to its own screen, the lab, models, survival and
// measure panes included.
import { useT } from '../../i18n/index.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { METHOD_UI } from '../lib/method-ui.js';
import { keyPart } from '../lib/keys.js';
import { Notice, PageHead, VerifiedBadge } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';

const PANE_OF = { prev: 'prev', assoc: 'assoc', table1: 'table1', lab: 'lab', models: 'models', survival: 'survival', measure: 'measure' };
/** Where "next" goes for a design: the screen that answers its first question. */
const NEXT_PANE = { diagnostic: 'assoc', agreement: 'assoc', experiment: 'lab' };

/** @param {{ p: any }} props */
export default function DesignPane({ p }) {
  const { t, lang } = useT();
  const chosen = DESIGNS.find((d) => d.id === p.project.design) || null;
  const cluster = p.meta?.codebook?.columns?.find((c) => c.key === p.meta?.codebook?.clusterKey);
  const has = (k) => t(k) !== `[${k}]`;
  return (
    <>
      <PageHead eyebrow={t('ws.design.eyebrow')} title={t('ws.design.title')} sub={t('ws.design.sub')} />
      <div className="rs-design">
        <fieldset className="rs-fieldset rs-design-list">
          <legend className="rs-eyebrow">{t('ws.design.pickOne')}</legend>
          {DESIGNS.map((d) => (
            <label key={d.id} className={`rs-choice rs-choice--big${chosen?.id === d.id ? ' rs-choice--on' : ''}`}>
              <input type="radio" name="rs-design" value={d.id} checked={chosen?.id === d.id} onChange={() => p.setDesign(d.id)} />
              <span className="rs-choice-text">
                <span className="rs-choice-title">
                  {t(d.nameKey)}
                  {lang === 'th' ? <span className="rs-soft rs-choice-en" lang="en"> {t(`ws.design.en.${keyPart(d.id)}`)}</span> : null}
                </span>
                <span className="rs-soft rs-small">{t(d.descKey)}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <aside className="rs-design-side">
          {chosen ? (
            <>
              <section className="rs-panel rs-pad" aria-labelledby="rs-h-can">
                <h2 id="rs-h-can" className="rs-h3">{t('ws.design.canTitle', { design: t(chosen.nameKey) })}</h2>
                <ul className="rs-checklist">
                  {chosen.offers.filter((o) => getMethod(o.method)?.shipped).map((o) => {
                    const m = getMethod(o.method);
                    const ui = METHOD_UI[o.method];
                    const pane = ui ? PANE_OF[ui.pane] : null;
                    const name = m && has(m.nameKey) ? t(m.nameKey) : o.method;
                    return (
                      <li key={o.method} className="rs-checkitem">
                        <Icon name="check" size={18} />
                        <span className="rs-grow">
                          {pane && p.meta ? <Link to={`/app/p/${p.project.id}/${pane}?m=${encodeURIComponent(o.method)}`} className="rs-strong">{name}</Link> : <span className="rs-strong">{name}</span>}
                          {o.measures?.length ? <span className="rs-soft rs-small"> {o.measures.map((x) => (has(`ws.value.${x}`) ? t(`ws.value.${x}`) : x)).join(', ')}</span> : null}
                        </span>
                        <VerifiedBadge show={Boolean(m?.verified)} />
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section className="rs-panel rs-pad" aria-labelledby="rs-h-cannot">
                <h2 id="rs-h-cannot" className="rs-h3">{t('ws.design.cannotTitle')}</h2>
                <ul className="rs-checklist">
                  {chosen.blocked.map((b) => (
                    <li key={b.reasonKey} className="rs-checkitem rs-checkitem--no">
                      <Icon name="stop" size={18} />
                      <span>{t(b.reasonKey)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <Notice tone="info" title={t('ws.design.noneTitle')}>{t('ws.design.noneBody')}</Notice>
          )}
          {cluster ? <Notice tone="warn">{t('ws.design.clusterNote', { column: cluster.name })}</Notice> : null}
          {chosen && p.meta ? (
            <Link to={`/app/p/${p.project.id}/${NEXT_PANE[chosen.id] || 'prev'}`} className="rs-btn rs-btn--primary">
              {t('ws.design.next')}
              <Icon name="arrow" size={18} />
            </Link>
          ) : null}
        </aside>
      </div>
    </>
  );
}
