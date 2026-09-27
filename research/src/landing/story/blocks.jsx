// Content of the scroll story [M1-DESIGN.md 15.1]: the four panels, their captions, the accuracy card,
// the result card and the device chapter. The same blocks render in the pinned story (absolute layers
// animated by layout.js) and in the still story (reduced motion: every layer in the page flow, all
// information shown). Every number comes from the herd (herd/data.js) or the sample cells (demo.js).
// OWNER: landing role.
import { useT } from '../../i18n/index.js';
import { HERD_DESIGN, herdFacts } from '../herd/data.js';
import { RAW_FILE, RAW_HEADERS, RAW_ROWS, CLEAN_HEADERS, CLEAN_NAME, markedCells, conversionCounts, cleanRows } from './demo.js';
import { formatDayMonth } from '../shell/dates.js';

/** Two dictionary keys shown as two lines of one heading. */
export function Lines({ a, b }) {
  const { t } = useT();
  return (
    <>
      {t(a)}
      <br />
      {t(b)}
    </>
  );
}

function FileIcon() {
  return (
    <svg className="rs-l-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 1.5 H9.5 L12.5 4.5 V14.5 H4 Z M9.5 1.5 V4.5 H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/** A panel in the stack: surface card with a head row. */
function PanelShell({ reg, k, head, children }) {
  return (
    <div className="rs-l-panel" data-rs={k} ref={reg?.(k)}>
      <div className="rs-l-panel-head">{head}</div>
      {children}
    </div>
  );
}

export function Panel0({ reg }) {
  const { t } = useT();
  const d = herdFacts().display;
  const marked = new Set(markedCells().map(([r, c]) => `${r}:${c}`));
  return (
    <PanelShell
      reg={reg}
      k="p0"
      head={
        <>
          <FileIcon />
          <span className="rs-mono rs-l-file">{RAW_FILE}</span>
          <span className="rs-l-grow" />
          <span className="rs-l-tag">{t('landing.p0.badge')}</span>
        </>
      }
    >
      <table className="rs-l-table">
        <thead>
          <tr>
            {RAW_HEADERS.map((h) => (
              <th key={h} scope="col" lang="th">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RAW_ROWS.map((row, i) => (
            <tr key={row[0]}>
              {row.map((cell, c) => (
                <td key={c} lang="th" className={`${c === 0 ? 'rs-mono' : ''}${marked.has(`${i}:${c}`) ? ' rs-l-mark' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="rs-l-panel-foot">{t('landing.p0.foot', { shown: RAW_ROWS.length, n: d.n })}</p>
    </PanelShell>
  );
}

const CODEBOOK = [
  ['animal_id', 'id', 'id'],
  ['farm_id', 'cluster', 'cluster'],
  ['sample_date', 'date', 'date'],
  ['age_y', 'number', 'number'],
  ['elisa', 'binary', 'binary'],
];
/** The phone board shows what one row is, the farm column and the outcome, then the farm question:
 * the point of the chapter fits the panel at rest (review round 3: five rows cut the question off). */
export const CODEBOOK_COMPACT = Object.freeze(['animal_id', 'farm_id', 'elisa']);

export function Panel1({ reg, compact = false }) {
  const { t } = useT();
  const d = herdFacts().display;
  const rows = compact ? CODEBOOK.filter(([name]) => CODEBOOK_COMPACT.includes(name)) : CODEBOOK;
  return (
    <PanelShell
      reg={reg}
      k="p1"
      head={
        <>
          <span className="rs-mono rs-l-file">{t('landing.p1.title')}</span>
          <span className="rs-l-grow" />
          <span className="rs-l-tag">{t('landing.p1.badge')}</span>
        </>
      }
    >
      <table className="rs-l-table">
        <thead>
          <tr>
            <th scope="col">{t('landing.p1.col.variable')}</th>
            <th scope="col">{t('landing.p1.col.type')}</th>
            <th scope="col">{t('landing.p1.col.note')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, note]) => (
            <tr key={name} className={type === 'cluster' ? 'rs-l-hlrow' : undefined}>
              <td className="rs-mono">{name}</td>
              <td className={type === 'cluster' ? 'rs-l-strong' : undefined}>{t(`landing.p1.type.${type}`)}</td>
              <td className={type === 'cluster' ? undefined : 'rs-l-soft'}>{t(`landing.p1.note.${note}`, { farms: d.farms })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rs-l-ask">
        <span className="rs-l-ask-q">{t('landing.p1.question')}</span>
        <span className="rs-l-grow" />
        <span className="rs-l-ask-yes">{t('landing.p1.yes')}</span>
        <span className="rs-l-ask-no">{t('landing.p1.no')}</span>
      </div>
    </PanelShell>
  );
}

export function Panel2({ reg }) {
  const { t, lang } = useT();
  const c = conversionCounts();
  const rows = cleanRows();
  const exampleIso = (() => {
    const [dd, mm, yy] = c.confirmedExample.split('/').map(Number);
    return `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  })();
  return (
    <PanelShell
      reg={reg}
      k="p2"
      head={
        <>
          <span className="rs-mono rs-l-file">{CLEAN_NAME}</span>
          <span className="rs-l-grow" />
          <span className="rs-l-tag rs-l-tag-sage">{t('landing.p2.badge')}</span>
        </>
      }
    >
      <table className="rs-l-table">
        <thead>
          <tr>
            {CLEAN_HEADERS.map((h) => (
              <th key={h} scope="col" className="rs-mono">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className={i === 0 || i === 2 ? 'rs-mono' : undefined} lang={i === 4 && cell ? 'th' : undefined}>
                  {cell === null ? <span className="rs-l-na">{t('landing.na')}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rs-l-log">
        <span className="rs-l-log-title">{t('landing.p2.log')}</span>
        <span>{t('landing.p2.be', { count: c.be })}</span>
        <span>{t('landing.p2.confirmed', { example: c.confirmedExample, date: formatDayMonth(exampleIso, lang), count: c.confirmed })}</span>
        <span>{t('landing.p2.digits', { count: c.thaiDigits })}</span>
        <span>{t('landing.p2.missing', { count: c.missing })}</span>
      </div>
    </PanelShell>
  );
}

export function Panel3({ reg }) {
  const { t } = useT();
  const d = herdFacts().display;
  return (
    <PanelShell
      reg={reg}
      k="p3"
      head={
        <>
          <span className="rs-l-file">{t('landing.p3.title')}</span>
          <span className="rs-l-grow" />
          <span className="rs-l-tag">{t('landing.p3.badge')}</span>
        </>
      }
    >
      <dl className="rs-l-design">
        <div>
          <dt>{t('landing.p3.design')}</dt>
          <dd className="rs-l-chips">
            <span className="rs-l-chip rs-l-chip-on">{t('landing.p3.crossSectional')}</span>
            <span className="rs-l-chip">{t('landing.p3.caseControl')}</span>
            <span className="rs-l-chip">{t('landing.p3.cohort')}</span>
          </dd>
        </div>
        <div>
          <dt>{t('landing.p3.outcome')}</dt>
          <dd>{t('landing.p3.outcomeValue')}</dd>
        </div>
        <div>
          <dt>{t('landing.p3.unit')}</dt>
          <dd>{t('landing.p3.unitValue', { farms: d.farms })}</dd>
        </div>
        <div>
          <dt>{t('landing.p3.get')}</dt>
          <dd className="rs-l-strong">{t('landing.p3.getValue')}</dd>
        </div>
      </dl>
      <p className="rs-l-design-note">{t('landing.p3.note')}</p>
    </PanelShell>
  );
}

export const PANELS = [Panel0, Panel1, Panel2, Panel3];

/** Caption for step i (0..3). */
export function Caption({ i, reg, short = false, as: Tag = 'div' }) {
  const { t } = useT();
  const k = `c${i}`;
  return (
    <Tag className="rs-l-cap" data-rs={k} ref={reg?.(k)}>
      <p className="rs-l-eyebrow">{t('landing.step', { i: i + 1, n: 4 })}</p>
      <h2 className="rs-l-cap-title">
        <Lines a={`landing.c${i}.title1`} b={`landing.c${i}.title2`} />
      </h2>
      <p className="rs-l-cap-body">{t(`landing.c${i}.${short ? 'bodyShort' : 'body'}`)}</p>
    </Tag>
  );
}

/** Axis for the CI plot, derived from the intervals: 5-point steps with at least 3 points of margin. */
export function ciAxis(stats) {
  const lo = Math.floor((stats.ci[0] * 100 - 3) / 5) * 5;
  const hi = Math.ceil((stats.ci[1] * 100 + 3) / 5) * 5;
  const ticks = [];
  for (let v = lo; v <= hi + 1e-9; v += 5) ticks.push(v);
  const x = (pct) => ((pct - lo) / (hi - lo)) * 100;
  return { lo, hi, ticks, x };
}

export function FoldCard({ reg, short = false, still = false }) {
  const { t } = useT();
  const { stats, display: d } = herdFacts();
  const ax = ciAxis(stats);
  const indL = ax.x(stats.ciIndependent[0] * 100);
  const indR = ax.x(stats.ciIndependent[1] * 100);
  const mid = ax.x(stats.p * 100);
  const params = { n: d.n, farms: d.farms, icc: d.icc, per: d.perFarmRounded, deff: d.deff, effN: d.effN, widen: d.widen };
  return (
    <div className="rs-l-card rs-l-fold" data-rs="fold" ref={reg?.('fold')}>
      <p className="rs-l-eyebrow">{t('landing.fold.eyebrow')}</p>
      <h2 className="rs-l-fold-title">{t('landing.fold.title')}</h2>
      <p className="rs-l-fold-body">{t(short ? 'landing.fold.bodyShort' : 'landing.fold.body', params)}</p>
      <div className="rs-l-ci" role="img" aria-label={`${t('landing.fold.independent')} ${t('landing.range', { lo: d.indLo, hi: d.indHi })}. ${t('landing.fold.adjusted')} ${t('landing.range', { lo: d.ciLo, hi: d.ciHi })}.`}>
        <div className="rs-l-ci-row">
          <span className="rs-l-soft">{t('landing.fold.independent')}</span>
          <span className="rs-mono rs-num">{t('landing.range', { lo: d.indLo, hi: d.indHi })}</span>
        </div>
        <div className="rs-l-ci-line" style={{ left: `${indL}%`, width: `${indR - indL}%` }} />
        <div className="rs-l-ci-tick rs-l-ci-tick-a" style={{ left: `${indL}%` }} />
        <div className="rs-l-ci-tick rs-l-ci-tick-a" style={{ left: `${indR}%` }} />
        <div className="rs-l-ci-dot rs-l-ci-dot-a" style={{ left: `${mid}%` }} />
        <div className="rs-l-ci-row rs-l-ci-row2" data-rs="ciRow2" ref={reg?.('ciRow2')}>
          <span className="rs-l-sage">{t('landing.fold.adjusted')}</span>
          <span className="rs-mono rs-num">{t('landing.range', { lo: d.ciLo, hi: d.ciHi })}</span>
        </div>
        <div className="rs-l-ci-bar" data-rs="ciBar" ref={reg?.('ciBar')} style={{ left: `${indL}%`, width: `${indR - indL}%`, transform: still ? `scaleX(${stats.widen})` : undefined }} />
        <div className="rs-l-ci-dot rs-l-ci-dot-b" style={{ left: `${mid}%` }} />
        <div className="rs-l-ci-axis">
          {ax.ticks.map((v) => (
            <span key={v} className="rs-mono rs-num" style={{ left: `${ax.x(v)}%` }}>
              {v}%
            </span>
          ))}
        </div>
      </div>
      <div className="rs-l-fold-n">
        {/* The still shows the adjusted line only; both lines are two moments of the animation (review round 2). */}
        {still ? null : <span data-rs="n1" ref={reg?.('n1')}>{t('landing.fold.n1', { p: d.prevalence, n: d.n })}</span>}
        <span data-rs="n2" ref={reg?.('n2')}>{t('landing.fold.n2', { p: d.prevalence, n: d.n, effN: d.effN })}</span>
      </div>
      <div className="rs-l-fold-math rs-mono">
        <span>{t('landing.fold.deffLine', { m: d.meanSize, icc: d.iccFormula, deff: d.deff })}</span>
        <span>{t('landing.fold.widen', { deff: d.deff, widen: d.widen })}</span>
      </div>
      <div className="rs-l-legend">
        <span><span className="rs-l-sw rs-l-sw-pos" aria-hidden="true" />{t('landing.fold.legend.pos')}</span>
        <span><span className="rs-l-sw rs-l-sw-neg" aria-hidden="true" />{t('landing.fold.legend.neg')}</span>
        <span><span className="rs-l-sw rs-l-sw-farm" aria-hidden="true" />{t('landing.fold.legend.farm')}</span>
      </div>
      <p className="rs-l-fold-note">
        {short ? t('landing.fold.noteShort') : t('landing.fold.note', { n: HERD_DESIGN.animals, per: HERD_DESIGN.perFarm, icc: HERD_DESIGN.icc, code: HERD_DESIGN.courseCode })}
      </p>
    </div>
  );
}

/** Plain glosses for the English terms the accuracy chapter uses (once per page). */
export function Glosses({ titled = false }) {
  const { t } = useT();
  return (
    <div className="rs-l-terms">
    {titled ? <h2 className="rs-l-terms-title">{t('landing.fold.glossTitle')}</h2> : null}
    <dl className="rs-l-gloss">
      <div>
        <dt>{t('landing.gloss.icc')}</dt>
        <dd>{t('term.icc.gloss')}</dd>
      </div>
      <div>
        <dt>{t('landing.gloss.deff')}</dt>
        <dd>{t('term.deff.gloss')}</dd>
      </div>
      <div>
        <dt>{t('landing.gloss.effectiveN')}</dt>
        <dd>{t('term.effectiveN.gloss')}</dd>
      </div>
      <div>
        <dt>{t('landing.gloss.ci95')}</dt>
        <dd>{t('term.ci95.gloss')}</dd>
      </div>
    </dl>
    </div>
  );
}

export function ResultCaption({ reg, short = false }) {
  const { t } = useT();
  return (
    <div className="rs-l-cap rs-l-cap-wide" data-rs="rcap" ref={reg?.('rcap')}>
      <p className="rs-l-eyebrow">{t('landing.res.eyebrow')}</p>
      <h2 className="rs-l-cap-title rs-l-cap-title-lg">
        <Lines a="landing.res.title1" b="landing.res.title2" />
      </h2>
      <p className="rs-l-cap-body">{t(short ? 'landing.res.bodyShort' : 'landing.res.body')}</p>
    </div>
  );
}

export function ResultCard({ reg, compact = false }) {
  const { t, lang } = useT();
  const d = herdFacts().display;
  return (
    <div className="rs-l-card rs-l-rcard" data-rs="rcard" ref={reg?.('rcard')}>
      <div className="rs-l-rcard-head">
        <span className="rs-l-eyebrow-soft">{t('landing.card.label')}</span>
        <span className="rs-l-grow" />
        <span className="rs-l-tag">{t('landing.card.sim')}</span>
      </div>
      <p className="rs-l-rcard-title">{t('landing.card.title')}</p>
      <p className="rs-l-rcard-big">
        <span className="rs-l-rcard-est rs-num">{d.prevalence}%</span>
        <span className="rs-l-rcard-ci rs-num">{t('landing.card.ci', { lo: d.ciLo, hi: d.ciHi })}</span>
      </p>
      <p className="rs-l-rcard-count rs-num">{t('landing.card.count', { x: d.positives, n: d.n, farms: d.farms, effN: d.effN })}</p>
      <div className="rs-l-chips">
        <span className="rs-l-chip">{t('landing.card.chipWald')}</span>
        <span className="rs-l-chip">{t('landing.card.chipCluster')}</span>
        <span className="rs-l-chip">{t('landing.card.chipIcc', { icc: d.icc })}</span>
      </div>
      <div className="rs-l-prov-win" data-rs="provWin" ref={reg?.('provWin')}>
        <div className="rs-l-prov rs-mono" data-rs="prov" ref={reg?.('prov')}>
          {t('landing.card.prov', { deff: d.deff, n: d.n })}
        </div>
      </div>
      <div className="rs-l-methods">
        {!compact || lang === 'en' ? (
          <div>
            <p className="rs-l-methods-label rs-mono">{t('landing.card.methodsEnLabel')}</p>
            <p lang="en">{t('landing.card.methodsEn', { deff: d.deff, icc: d.icc, m: d.meanSize1 })}</p>
          </div>
        ) : null}
        {!compact || lang === 'th' ? (
          <div>
            <p className="rs-l-methods-label rs-mono">{t('landing.card.methodsThLabel')}</p>
            <p lang="th">{t('landing.card.methodsTh', { deff: d.deff, icc: d.icc, m: d.meanSize1 })}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PrivacyCaption({ reg, short = false }) {
  const { t } = useT();
  return (
    <div className="rs-l-cap rs-l-cap-wide" data-rs="dcap" ref={reg?.('dcap')}>
      <p className="rs-l-eyebrow">{t('landing.priv.eyebrow')}</p>
      <h2 className="rs-l-cap-title rs-l-cap-title-lg">
        <Lines a="landing.priv.title1" b="landing.priv.title2" />
      </h2>
      <p className="rs-l-cap-body">{t(short ? 'landing.priv.bodyShort' : 'landing.priv.body')}</p>
      <ul className="rs-l-checks">
        {['chip1', 'chip2', 'chip3'].map((k) => (
          <li key={k}>
            <span className="rs-l-check" aria-hidden="true" />
            {t(`landing.priv.${k}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Laptop (desktop board) or phone (phone board) outline: CSS boxes and borders, no SVG strokes. */
export function Device({ reg, variant }) {
  return (
    <div className={`rs-l-device rs-l-device-${variant}`} data-rs="device" ref={reg?.('device')} aria-hidden="true">
      <div className="rs-l-device-a" />
      <div className="rs-l-device-b" />
      <div className="rs-l-device-c" />
      <div className="rs-l-device-d" />
    </div>
  );
}
