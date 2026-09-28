// Every method in the catalogue with its status, milestone, the fixture families it passes and the files
// and sources behind them, from catalog.js, verified.generated.js and fixtures.generated.js; nothing typed
// by hand [M2-DESIGN.md 11.1]. The per-fixture facts (R and package versions, the NIST pages, the course
// bank commit, tolerances, the date the tests last passed) are read from the fixture files by
// scripts/regen-verified.mjs. Method names live in the stats, epi and runtime dictionaries (M2-DESIGN.md
// B2), registered here so the landing never carries them. OWNER: trust role.
import { useEffect, useMemo, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import stats from '../i18n/stats.js';
import epi from '../i18n/epi.js';
import { getCatalog } from '../lib/runtime/catalog.js';
import { FIXTURES } from '../lib/runtime/fixtures.generated.js';
import { valueSlug } from '../lib/runtime/provenance.js';
import PublicShell from './PublicShell.jsx';
import { buildMethodsModel, fixtureUrl, formatDate, repoUrl, testUrl, toleranceWords } from './model.js';
import '../styles/pages.css';

registerArea('stats', stats);
registerArea('epi', epi);

/** A fixture family's name: the runtime's label when it has one, else the family id itself. */
function useFamilyName() {
  const { t } = useT();
  return (id) => {
    const key = `runtime.family.fixture.${valueSlug(id)}`;
    const s = t(key);
    return s === `[${key}]` ? id : s;
  };
}

function Source({ source }) {
  const { t, lang } = useT();
  const parts = [];
  if (source.r) parts.push(<li key="r">{source.webR ? t('trust.methods.src.r', { r: source.r, webR: source.webR }) : t('trust.methods.src.rNative', { r: source.r })}</li>);
  if (source.packages) parts.push(<li key="p">{t('trust.methods.src.packages', { list: Object.entries(source.packages).map(([k, v]) => `${k} ${v}`).join(', ') })}</li>);
  if (source.python) parts.push(<li key="py">{t('trust.methods.src.python', { list: Object.entries(source.python).map(([k, v]) => (k === 'python' ? v : `${k} ${v}`)).join(', ') })}</li>);
  if (source.script) parts.push(<li key="s"><a href={repoUrl(source.script)} rel="noopener noreferrer" target="_blank" className="rs-mono">{t('trust.methods.src.script', { script: source.script.split('/').pop() })}</a></li>);
  if (source.file) parts.push(<li key="b">{t('trust.methods.src.bank', { file: source.file, commit: String(source.commit || '').slice(0, 8) })}</li>);
  for (const u of source.urls || []) parts.push(<li key={u}><a href={u} rel="noopener noreferrer" target="_blank" className="rs-pub-url">{u}</a></li>);
  if (source.date) parts.push(<li key="d">{t('trust.methods.src.date', { date: formatDate(source.date, lang) })}</li>);
  if (source.text) parts.push(<li key="n"><span className="rs-soft">{t('trust.methods.src.note')}: </span><span lang="en">{source.text}</span></li>);
  return parts.length ? <ul className="rs-pub-facts">{parts}</ul> : <p className="rs-soft">{t('trust.dash')}</p>;
}

export function FixtureCard({ f }) {
  const { t, lang } = useT();
  const family = useFamilyName();
  return (
    <li className="rs-pub-fixture">
      <p className="rs-pub-fixture-head">
        <span className={`rs-chip ${f.kind === 'pin' ? 'rs-chip--sage' : 'rs-chip--gold'} rs-chip--badge`}>{t(`trust.methods.kind.${f.kind === 'pin' ? 'pin' : 'crosscheck'}`)}</span>
        <strong>{family(f.family)}</strong>
      </p>
      <dl className="rs-pub-dl">
        <dt>{t('trust.methods.file')}</dt>
        <dd><a className="rs-mono rs-pub-url" href={fixtureUrl(f.file)} rel="noopener noreferrer" target="_blank" title={t('trust.methods.github')}>{f.file}</a></dd>
        <dt>{t('trust.methods.source')}</dt>
        <dd><Source source={f.source} /></dd>
        <dt>{t('trust.methods.tolerance')}</dt>
        <dd>
          {f.tolerance.length ? (
            <ul className="rs-pub-facts">
              {f.tolerance.map((tol, i) => {
                const w = toleranceWords(tol);
                return <li key={i} className={tol.text !== undefined ? 'rs-mono' : undefined}>{t(w.key, w.params)}</li>;
              })}
            </ul>
          ) : (
            <p className="rs-soft">{t('trust.methods.tolerance.none')}</p>
          )}
        </dd>
        <dt>{t('trust.methods.tests')}</dt>
        <dd>
          <ul className="rs-pub-facts">
            {f.tests.map((name) => (
              <li key={name}><a className="rs-mono rs-pub-url" href={testUrl(name)} rel="noopener noreferrer" target="_blank">{name}</a></li>
            ))}
          </ul>
        </dd>
        <dt>{t('trust.methods.lastPassed')}</dt>
        <dd>{f.lastPassed ? formatDate(f.lastPassed, lang) : <><span aria-hidden="true">—</span> <span className="rs-soft">{t('trust.methods.lastPassed.none')}</span></>}</dd>
      </dl>
    </li>
  );
}

function MethodRow({ row }) {
  const { t } = useT();
  const family = useFamilyName();
  // The fixture cards are built only once the reader opens the list: about 60 methods share the same
  // few fixture files, and rendering every card up front made the page heavy on a phone.
  const [open, setOpen] = useState(false);
  const families = [...new Set(row.fixtures.map((f) => f.family))];
  return (
    <li className="rs-pub-method" id={`m-${row.id}`}>
      <div className="rs-pub-method-head">
        <h3 className="rs-pub-method-name">{t(row.nameKey)}</h3>
        <span className={`rs-chip rs-chip--badge ${row.status === 'verified' ? 'rs-chip--sage' : row.status === 'shipped' ? 'rs-chip--gold' : ''}`}>{t(`trust.methods.status.${row.status}`)}</span>
      </div>
      <p className="rs-pub-method-id rs-mono rs-soft">{row.id}</p>
      {families.length ? (
        <p className="rs-pub-method-families">
          <span className="rs-soft">{t('trust.methods.col.checks')}: </span>
          {families.map((f) => family(f)).join(', ')}
        </p>
      ) : (
        <p className="rs-soft">{t('trust.methods.noChecks')}</p>
      )}
      {row.fixtures.length ? (
        <details className="rs-pub-details" onToggle={(e) => setOpen(e.currentTarget.open)}>
          <summary>{t('trust.methods.details', { count: row.fixtures.length })}</summary>
          {open ? (
            <ul className="rs-pub-fixtures">
              {row.fixtures.map((f) => <FixtureCard key={f.file} f={f} />)}
            </ul>
          ) : null}
        </details>
      ) : null}
    </li>
  );
}

export default function Page() {
  const { t } = useT();
  const [show, setShow] = useState(/** @type {'all'|'shipped'|'planned'} */ ('all'));
  const model = useMemo(() => buildMethodsModel(getCatalog(), FIXTURES), []);
  useEffect(() => { document.title = `${t('trust.page.methods.title')} | ${t('common.appName')}`; }, [t]);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const groups = model.groups.filter((g) => show === 'all' || (show === 'shipped' ? g.id === 'now' : g.id !== 'now'));
  return (
    <PublicShell current="methods">
      <main id="rs-main" className="rs-main rs-main--narrow rs-pub-main">
        <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.methods.title')}</h1>
        <p className="rs-sub">{t('trust.methods.intro')}</p>
        <p>{t('trust.methods.how')}</p>
        <p className="rs-pub-summary">{t('trust.methods.summary', { shipped: model.shipped, verified: model.verified, total: model.total })}</p>
        <p className="rs-soft rs-small">{t('trust.methods.kindNote')}</p>
        <div className="rs-seg" role="group" aria-label={t('trust.methods.filter.label')}>
          {['all', 'shipped', 'planned'].map((k) => (
            <button key={k} type="button" className="rs-seg-btn" aria-pressed={show === k} onClick={() => setShow(/** @type {any} */ (k))}>
              {t(`trust.methods.filter.${k}`)}
            </button>
          ))}
        </div>
        {groups.map((g) => (
          <section key={g.id} className="rs-pub-group" aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="rs-h2">{t(`trust.methods.group.${g.id}`)} <span className="rs-soft rs-small">({g.rows.length})</span></h2>
            <ul className="rs-pub-methods">
              {g.rows.map((r) => <MethodRow key={r.id} row={r} />)}
            </ul>
          </section>
        ))}
        <p className="rs-soft rs-small">{t('trust.methods.generated')}</p>
      </main>
    </PublicShell>
  );
}
