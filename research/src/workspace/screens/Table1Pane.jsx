// Table 1 [M1-DESIGN.md 7.4; workspace board "Table1"]: describes the farms and the animals, by level of
// organisation, optionally by a group column. No p-values and no CI in this table (G10): it describes,
// it does not test. Median with quartiles for skewed or ordinal columns, counts with the denominator and
// the missing count of every variable. Copy to Word and CSV per table. OWNER: workspace role.
import { useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { useWs, errorInfo } from '../ws-context.js';
import { buildSpec } from '../lib/method-ui.js';
import { Busy, ErrorBox, Field, Notice, PageHead } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import ResultView, { safeFileBase } from '../components/ResultView.jsx';
import Table1View from '../components/Table1View.jsx';
import { provenanceLines } from '../../lib/runtime/provenance.js';

const DESCRIBABLE = ['continuous', 'count', 'binary', 'nominal', 'ordinal'];
const defaultSummary = (type) => (type === 'continuous' || type === 'count' ? 'median-iqr' : 'n-percent');

/** @param {{ p: any }} props */
export default function Table1Pane({ p }) {
  const { t, lang } = useT();
  const { engine, engineError } = useWs();
  const codebook = p.codebook || p.meta.codebook;
  const cols = codebook.columns.filter((c) => !c.hidden && !c.pii && DESCRIBABLE.includes(c.type) && c.key !== codebook.clusterKey);
  const groups = codebook.columns.filter((c) => !c.hidden && ['binary', 'nominal'].includes(c.type));
  const [group, setGroup] = useState(() => codebook.columns.find((c) => c.role === 'outcome' && c.type === 'binary')?.key || '');
  const [chosen, setChosen] = useState(() => Object.fromEntries(cols.filter((c) => c.role !== 'outcome').map((c) => [c.key, defaultSummary(c.type)])));
  const [quantileType, setQuantileType] = useState(7);
  const [env, setEnv] = useState(null);
  const [spec, setSpec] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const method = getMethod('desc.table1');
  const colName = (c) => (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name);
  const count = useMemo(() => Object.keys(chosen).length, [chosen]);
  const labelOf = (key) => {
    const c = codebook.columns.find((x) => x.key === key);
    return c ? colName(c) : key;
  };
  let note = '';
  try { note = env ? provenanceLines(env, lang, t, labelOf).join(' ') : ''; } catch { note = ''; }

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const s = buildSpec({
        method: 'desc.table1',
        datasetId: p.meta.id,
        recipeRev: p.table?.recipeRev ?? p.meta.rev,
        design: p.project.design,
        roles: { covariates: cols.map((c) => c.key).filter((k) => chosen[k] !== undefined && k !== group), ...(group ? { group } : {}) },
        options: { ...COMMON_OPTIONS, ...DEFAULT_OPTIONS['desc.table1'], quantileType, summaries: Object.fromEntries(Object.entries(chosen).filter(([k]) => k !== group)) },
        cluster: { route: null, column: codebook.clusterKey || null },
      });
      const e = await engine.run(s, p.table, codebook, p.meta.steps || []);
      setSpec(s);
      setEnv(e);
      await p.log('analysis', { method: 'desc.table1' });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead eyebrow={t('ws.table1.eyebrow')} title={t('ws.table1.title')} sub={t('ws.table1.sub')} />
      {engineError ? <ErrorBox error={engineError} /> : null}
      <div className="rs-analysis">
        <section className="rs-analysis-setup rs-panel rs-pad rs-stack" aria-labelledby="rs-h-t1setup">
          <h2 id="rs-h-t1setup" className="rs-h3">{t('ws.table1.setup')}</h2>
          <Field label={t('ws.table1.group')} htmlFor="rs-t1-group" hint={t('ws.table1.groupHint')}>
            <select id="rs-t1-group" className="rs-select" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">{t('ws.table1.noGroup')}</option>
              {groups.map((c) => <option key={c.key} value={c.key}>{colName(c)}</option>)}
            </select>
          </Field>
          <fieldset className="rs-fieldset">
            <legend className="rs-field-label">{t('ws.table1.columns', { n: count })}</legend>
            <ul className="rs-plainlist rs-t1cols">
              {cols.filter((c) => c.key !== group).map((c) => {
                const on = chosen[c.key] !== undefined;
                const numeric = c.type === 'continuous' || c.type === 'count';
                return (
                  <li key={c.key} className="rs-row-wrap">
                    <label className="rs-check rs-grow">
                      <input type="checkbox" checked={on} onChange={(e) => setChosen((ch) => {
                        const next = { ...ch };
                        if (e.target.checked) next[c.key] = defaultSummary(c.type); else delete next[c.key];
                        return next;
                      })} />
                      {colName(c)}
                      <span className="rs-soft rs-xsmall">{t(`ws.level.${c.level}`)}</span>
                    </label>
                    {on && numeric ? (
                      <select className="rs-select rs-select--sm" aria-label={t('ws.table1.summaryFor', { column: colName(c) })} value={chosen[c.key]} onChange={(e) => setChosen((ch) => ({ ...ch, [c.key]: e.target.value }))}>
                        <option value="median-iqr">{t('ws.table1.medianIqr')}</option>
                        <option value="mean-sd">{t('ws.table1.meanSd')}</option>
                      </select>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </fieldset>
          <Field label={t('ws.opt.quantileType.label')} htmlFor="rs-t1-q">
            <select id="rs-t1-q" className="rs-select" value={quantileType} onChange={(e) => setQuantileType(Number(e.target.value))}>
              <option value={7}>{t('ws.opt.quantileType.7')}</option>
              <option value={6}>{t('ws.opt.quantileType.6')}</option>
            </select>
          </Field>
          <ul className="rs-checklist rs-small">
            {['levels', 'missing', 'noP', 'skewed', 'thaiOrder'].map((k) => (
              <li key={k} className="rs-checkitem"><Icon name="check" size={16} /><span>{t(`ws.table1.rule.${k}`)}</span></li>
            ))}
          </ul>
          {method && !method.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !count || !method?.shipped} onClick={run}>
            <Icon name="play" size={18} />
            {t('ws.table1.run')}
          </button>
        </section>
        <section className="rs-analysis-result" aria-live="polite" aria-busy={busy || undefined}>
          {busy ? <Busy label={t('ws.analysis.running')} /> : null}
          <ErrorBox error={error} />
          {env ? (
            <ResultView
              envelope={env}
              title={t('ws.table1.resultTitle')}
              hideTables
              labelOf={labelOf}
              codebook={codebook}
              onSnapshot={env.status === 'ok' ? () => p.saveSnapshot(spec, env) : null}
              onDownloaded={(kind) => p.log('download', { what: kind, method: 'desc.table1' })}
            >
              {env.status === 'ok' ? <Table1View envelope={env} labelOf={labelOf} note={note} fileBase={safeFileBase(t('ws.table1.title'))} onDownloaded={(kind) => p.log('download', { what: kind, method: 'desc.table1' })} /> : null}
            </ResultView>
          ) : !busy ? <p className="rs-soft">{t('ws.table1.empty')}</p> : null}
        </section>
      </div>
    </>
  );
}
