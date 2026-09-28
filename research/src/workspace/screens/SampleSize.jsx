// Sample size and power without a data file [M1-DESIGN.md 7.22; workspace board "Course"]: course mode
// reproduces the worked examples of the Veterinary Epidemiology course step by step with the formula
// named, and shows the common alternatives beside it (never instead of it). The examples' inputs are
// in lib/course-examples.js (pinned to the committed course fixture by a test); every word about an
// example is in the dictionaries. Post hoc power is refused (G9). OWNER: ui-tools role (M2; workspace in
// M1). M2: the rail reaches the power and randomisation tools [M2-DESIGN.md 10.3], and a line under the
// kinds sends a student planning an experiment (ANOVA, t-test, correlation, regression) to power.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { formatNumber } from '../../lib/stats/format.js';
import { useWs, errorInfo } from '../ws-context.js';
import { METHOD_UI, buildSpec } from '../lib/method-ui.js';
import { keyPart } from '../lib/keys.js';
import { exampleParams, parseParams } from '../lib/sample-size.js';
import { COURSE_EXAMPLES, missingRequired } from '../lib/course-examples.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Rail from '../components/Rail.jsx';
import ResultView from '../components/ResultView.jsx';
import TopBar from '../components/TopBar.jsx';
import Link from '../components/Link.jsx';
import { TOOL_RAIL } from './tools/tool-rail.js';

const SS = ['ss.proportion', 'ss.caseControl', 'ss.twoProportions', 'ss.mean', 'ss.twoMeans', 'ss.paired'];
/** Which option names the alternatives beside the course answer. */
const ALT_OPTION = { 'ss.caseControl': 'formula', 'ss.twoProportions': 'formula', 'ss.proportion': 'fpc' };

const hasKey = (t, k) => t(k) !== `[${k}]`;
/** The first key the dictionary has (a method's own wording before the general one), else ''. */
const pick = (t, ...keys) => { const k = keys.find((x) => hasKey(t, x)); return k ? t(k) : ''; };

export default function SampleSize() {
  const { t, lang } = useT();
  const { engine, engineError } = useWs();
  const [menu, setMenu] = useState(false);
  const [method, setMethod] = useState('ss.proportion');
  const [params, setParams] = useState({});
  const [conf, setConf] = useState(0.95);
  const [courseMode, setCourseMode] = useState(true);
  const [example, setExample] = useState(null);
  const [unused, setUnused] = useState([]);
  const [env, setEnv] = useState(null);
  const [spec, setSpec] = useState(null);
  const [alts, setAlts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ui = METHOD_UI[method];
  const cat = getMethod(method);
  const examples = useMemo(() => COURSE_EXAMPLES.filter((i) => i.method === method), [method]);
  const tabRefs = useRef({});
  const fields = useMemo(() => {
    const keys = [...(ui?.params || [])];
    for (const k of Object.keys(params)) if (!keys.includes(k)) keys.push(k);
    return keys;
  }, [ui, params]);

  useEffect(() => { setParams({}); setExample(null); setUnused([]); setEnv(null); setAlts([]); setError(null); }, [method]);
  useEffect(() => { document.title = `${t('ws.ss.title')} | ${t('common.appName')}`; }, [t]);

  const loadExample = (item) => {
    const ex = exampleParams(item);
    if (ex.confidence !== null) setConf(ex.confidence);
    setParams(ex.params);
    setUnused(ex.unused);
    setExample(item);
    setEnv(null);
    setAlts([]);
  };

  const parsed = parseParams(params);
  const numericParams = () => parsed.params;
  const missing = missingRequired(method, parsed.params);
  const paramsOk = parsed.ok && missing.length === 0;
  const fieldName = (k) => pick(t, `ws.ss.param.${keyPart(method)}.${keyPart(k)}`, `ws.ss.param.${keyPart(k)}`) || k;
  // Field names inside a sentence: English lower-cases a label mid-sentence ("Enter expected proportion
  // (p) and acceptable error (d)", review round 3), acronyms kept; the last two are joined with "and".
  const fieldList = (keys) => {
    const names = keys.map((k) => {
      const x = fieldName(k);
      return lang === 'en' && /^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x;
    });
    if (names.length < 2) return names.join('');
    return t('report.list.and', { a: names.slice(0, -1).join(lang === 'en' ? ', ' : ' '), b: names[names.length - 1] });
  };
  // Tabs: one tab stop, arrows move between the kinds (roving tabindex).
  const onTabKey = (e) => {
    const i = SS.indexOf(method);
    const next = e.key === 'ArrowRight' ? SS[(i + 1) % SS.length] : e.key === 'ArrowLeft' ? SS[(i - 1 + SS.length) % SS.length] : e.key === 'Home' ? SS[0] : e.key === 'End' ? SS[SS.length - 1] : null;
    if (!next) return;
    e.preventDefault();
    setMethod(next);
    tabRefs.current[next]?.focus();
  };

  const optionsFor = (override = {}) => ({
    ...COMMON_OPTIONS,
    ...(DEFAULT_OPTIONS[method] || {}),
    confLevel: conf,
    z: courseMode ? 'course-1.96' : 'exact',
    ...override,
  });

  const run = async () => {
    setBusy(true);
    setError(null);
    setAlts([]);
    try {
      const s = buildSpec({ method, params: numericParams(), options: optionsFor() });
      const e = await engine.run(s, null, null);
      setSpec(s);
      setEnv(e);
      const altName = ALT_OPTION[method];
      // One table of alternatives per result: a method that returns its own ('alternatives') is not
      // given a second; the population correction is compared only when a population size was given.
      const ownTable = (e?.tables || []).some((tb) => tb.id === 'alternatives');
      const applies = altName !== 'fpc' || Number.isFinite(numericParams().N);
      if (altName && e?.status === 'ok' && !ownTable && applies) {
        const rows = [];
        for (const v of ui.options[altName]) {
          const s2 = buildSpec({ method, params: numericParams(), options: optionsFor({ [altName]: v }) });
          const e2 = await engine.run(s2, null, null).catch(() => null);
          if (!e2 || e2.status !== 'ok') continue;
          // Each formula's final sample size (review round 2: the first computed value was shown).
          rows.push({ value: v, isDefault: v === s.options[altName], v: e2.values?.n || null, name: 'n' });
        }
        setAlts(rows);
      }
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const altName = ALT_OPTION[method];
  return (
    <div className="rs-ws">
      <TopBar crumb={t('ws.ss.crumb')} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />
      <div className="rs-ws-body">
        <Rail pane="sampleSize" items={TOOL_RAIL} open={menu} onClose={() => setMenu(false)} fileLineKey="ws.ss.noFile" />
        <main id="rs-main" className="rs-main">
          <PageHead eyebrow={t('ws.ss.eyebrow')} title={t('ws.ss.title')} sub={t('ws.ss.sub')} />
          {engineError ? <ErrorBox error={engineError} /> : null}
          <div className="rs-tabs" role="tablist" aria-label={t('ws.ss.kinds')}>
            {SS.map((id) => {
              const m = getMethod(id);
              return (
                <button key={id} ref={(el) => { tabRefs.current[id] = el; }} type="button" role="tab" aria-selected={method === id} tabIndex={method === id ? 0 : -1} onKeyDown={onTabKey} className={`rs-tab${method === id ? ' rs-tab--on' : ''}`} onClick={() => setMethod(id)}>
                  {m && hasKey(t, m.nameKey) ? t(m.nameKey) : id}
                </button>
              );
            })}
          </div>
          <p className="rs-soft rs-small">{t('tools.power.fromSampleSize')} <Link to="/app/tools/power" className="rs-plainlink">{t('tools.power.fromSampleSizeLink')}</Link></p>
          <div className="rs-analysis">
            <section className="rs-analysis-setup rs-panel rs-pad rs-stack" aria-labelledby="rs-h-ss">
              <div className="rs-row">
                <h2 id="rs-h-ss" className="rs-h3 rs-grow">{cat && hasKey(t, cat.nameKey) ? t(cat.nameKey) : method}</h2>
                <VerifiedBadge show={Boolean(cat?.verified)} />
              </div>
              <label className="rs-switch">
                <input type="checkbox" checked={courseMode} onChange={(e) => setCourseMode(e.target.checked)} />
                <span>{t('ws.ss.courseMode')}</span>
              </label>
              <p className="rs-soft rs-small">{courseMode ? t('ws.ss.courseModeOn') : t('ws.ss.courseModeOff')}</p>
              {examples.length ? (
                <fieldset className="rs-fieldset">
                  <legend className="rs-field-label">{t('ws.ss.examples')}</legend>
                  <div className="rs-row-wrap">
                    {examples.map((it) => (
                      <button key={it.id} type="button" className={`rs-btn rs-btn--sm${example?.id === it.id ? ' rs-btn--chosen' : ''}`} onClick={() => loadExample(it)}>
                        {t(`ws.ss.example.${it.id}`) !== `[ws.ss.example.${it.id}]` ? t(`ws.ss.example.${it.id}`) : t('ws.ss.exampleItem')}
                      </button>
                    ))}
                  </div>
                  {example ? (
                    <div className="rs-soft rs-small">
                      <p>{t('ws.ss.exampleFrom', { deck: t(`ws.ss.deck.${example.deck}`) })}</p>
                      <p>{t(`ws.ss.ex.${example.id}.formula`)}</p>
                      {unused.length ? <p>{t('ws.ss.unused', { names: fieldList(unused) })}</p> : null}
                    </div>
                  ) : null}
                  {example?.explain ? <Notice tone="info" title={t('ws.ss.explainTitle')}>{t(`ws.ss.ex.${example.id}.explain`)}</Notice> : null}
                </fieldset>
              ) : null}
              <div className="rs-formgrid">
                {fields.map((k) => (
                  <Field key={k} label={fieldName(k)} hint={pick(t, `ws.ss.hint.${keyPart(method)}.${keyPart(k)}`, `ws.ss.hint.${keyPart(k)}`) || undefined} htmlFor={`rs-ss-${k}`}>
                    <input id={`rs-ss-${k}`} className="rs-input rs-num" inputMode="decimal" aria-invalid={parsed.bad.includes(k) || undefined} value={params[k] ?? ''} onChange={(e) => setParams((x) => ({ ...x, [k]: e.target.value }))} />
                  </Field>
                ))}
                <Field label={t('ws.opt.confLevel.labelPlan')} htmlFor="rs-ss-conf">
                  <select id="rs-ss-conf" className="rs-select" value={String(conf)} onChange={(e) => setConf(Number(e.target.value))}>
                    {[0.95, 0.9, 0.99].map((v) => <option key={v} value={String(v)}>{`${Math.round(v * 100)}%`}</option>)}
                  </select>
                </Field>
              </div>
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              {parsed.bad.length ? <p className="rs-small rs-rose-text" role="status">{t('ws.ss.badFields', { names: fieldList(parsed.bad) })}</p> : null}
              {missing.length && !parsed.bad.length ? <p className="rs-soft rs-small" role="status">{t('ws.ss.needFields', { names: fieldList(missing) })}</p> : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !paramsOk || !cat?.shipped} onClick={run}>
                <Icon name="calc" size={18} />
                {t('ws.ss.run')}
              </button>
              <Notice tone="warn">{t('ws.ss.noPostHoc')}</Notice>
            </section>
            <section className="rs-analysis-result" aria-live="polite" aria-busy={busy || undefined}>
              {busy ? <Busy label={t('ws.analysis.running')} /> : null}
              <ErrorBox error={error} />
              {env && env.status === 'invalid' ? (
                <Notice tone="stop" title={t('ws.ss.invalidTitle')}>{t('ws.ss.invalidBody', { names: fieldList(missing.length ? missing : Object.keys(parsed.params)) })}</Notice>
              ) : env ? (
                // The setup panel's heading already names the method, so the result has its own heading
                // (review round 3: two headings saying the same); copies and files keep the method's name.
                <ResultView envelope={env} title={t('ws.ss.resultTitle')} caption={cat && hasKey(t, cat.nameKey) ? t(cat.nameKey) : method} paragraphs={false} primaryName="n" headlineLabel={pick(t, `ws.ss.headline.${keyPart(method)}`, 'ws.ss.headline')}>
                  {alts.length ? (
                    <div className="rs-tablewrap">
                      <table className="rs-table rs-num">
                        <caption className="rs-table-cap">{t('ws.ss.altCaption')}</caption>
                        <thead><tr><th scope="col">{t('ws.ss.altFormula')}</th><th scope="col" className="rs-r">{t('ws.ss.altValue')}</th></tr></thead>
                        <tbody>
                          {alts.map((r) => (
                            <tr key={String(r.value)}>
                              <th scope="row">{t(`ws.opt.${altName}.${keyPart(r.value)}`)}{r.isDefault ? ' ' : null}{r.isDefault ? <span className="rs-chip rs-chip--sage rs-chip--inline">{t('ws.ss.courseChip')}</span> : null}</th>
                              <td className="rs-r">{r.v && r.v.value !== null ? formatNumber(r.v.value, { kind: 'statistic' }) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="rs-soft rs-small">{t('ws.ss.altNote')}</p>
                    </div>
                  ) : null}
                  {spec && example ? <p className="rs-soft rs-small">{t('ws.ss.courseAnswer', { answer: t(`ws.ss.ex.${example.id}.answer`) })}</p> : null}
                </ResultView>
              ) : !busy ? <p className="rs-soft">{t('ws.ss.empty')}</p> : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
