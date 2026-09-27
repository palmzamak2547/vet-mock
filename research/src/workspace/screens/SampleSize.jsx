// Sample size and power without a data file [M1-DESIGN.md 7.22; workspace board "Course"]: course mode
// reproduces the worked examples of the Veterinary Epidemiology course step by step with the formula
// named, and shows the common alternatives beside it (never instead of it). The examples' inputs come
// from the committed course fixture, which names the bank item and the deck. Post hoc power is refused
// (G9). OWNER: workspace role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { formatNumber } from '../../lib/stats/format.js';
import course from '../../../tests/fixtures/course/epi-course-2026.json';
import { useWs, errorInfo } from '../ws-context.js';
import { METHOD_UI, buildSpec } from '../lib/method-ui.js';
import { keyPart } from '../lib/keys.js';
import { primaryValueName } from '../lib/result-model.js';
import { exampleParams, parseParams } from '../lib/sample-size.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Rail from '../components/Rail.jsx';
import ResultView from '../components/ResultView.jsx';
import TopBar from '../components/TopBar.jsx';

const SS = ['ss.proportion', 'ss.caseControl', 'ss.twoProportions', 'ss.mean', 'ss.twoMeans', 'ss.paired'];
const TOOL_RAIL = [{ h: 'ws.rail.group.tools' }, { id: 'sampleSize', label: 'ws.rail.sampleSize', icon: 'calc', href: '/app/tools/sample-size' }];
/** Which option names the alternatives beside the course answer. */
const ALT_OPTION = { 'ss.caseControl': 'formula', 'ss.twoProportions': 'formula', 'ss.proportion': 'fpc' };

const hasKey = (t, k) => t(k) !== `[${k}]`;
/** The first key the dictionary has (a method's own wording before the general one), else ''. */
const pick = (t, ...keys) => { const k = keys.find((x) => hasKey(t, x)); return k ? t(k) : ''; };

export default function SampleSize() {
  const { t } = useT();
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
  const examples = useMemo(() => (course.items || []).filter((i) => i.method === method), [method]);
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
  const paramsOk = parsed.ok;

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
      if (altName && e?.status === 'ok') {
        const rows = [];
        for (const v of ui.options[altName]) {
          const s2 = buildSpec({ method, params: numericParams(), options: optionsFor({ [altName]: v }) });
          const e2 = await engine.run(s2, null, null).catch(() => null);
          if (!e2 || e2.status !== 'ok') continue;
          const name = primaryValueName(e2);
          rows.push({ value: v, isDefault: v === s.options[altName], v: name ? e2.values[name] : null, name });
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
                <button key={id} type="button" role="tab" aria-selected={method === id} className={`rs-tab${method === id ? ' rs-tab--on' : ''}`} onClick={() => setMethod(id)}>
                  {m && hasKey(t, m.nameKey) ? t(m.nameKey) : id}
                </button>
              );
            })}
          </div>
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
                      <p>{t('ws.ss.exampleFrom', { deck: example.deck })}</p>
                      <p className="rs-mono">{example.formula}</p>
                      {unused.length ? <p>{t('ws.ss.unused', { names: unused.join(', ') })}</p> : null}
                    </div>
                  ) : null}
                </fieldset>
              ) : null}
              <div className="rs-formgrid">
                {fields.map((k) => (
                  <Field key={k} label={pick(t, `ws.ss.param.${keyPart(method)}.${keyPart(k)}`, `ws.ss.param.${keyPart(k)}`)} hint={pick(t, `ws.ss.hint.${keyPart(method)}.${keyPart(k)}`, `ws.ss.hint.${keyPart(k)}`) || undefined} htmlFor={`rs-ss-${k}`}>
                    <input id={`rs-ss-${k}`} className="rs-input rs-num" inputMode="decimal" aria-invalid={parsed.bad.includes(k) || undefined} value={params[k] ?? ''} onChange={(e) => setParams((x) => ({ ...x, [k]: e.target.value }))} />
                  </Field>
                ))}
                <Field label={t('ws.opt.confLevel.label')} htmlFor="rs-ss-conf">
                  <select id="rs-ss-conf" className="rs-select" value={String(conf)} onChange={(e) => setConf(Number(e.target.value))}>
                    {[0.95, 0.9, 0.99].map((v) => <option key={v} value={String(v)}>{`${Math.round(v * 100)}%`}</option>)}
                  </select>
                </Field>
              </div>
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !paramsOk || !cat?.shipped} onClick={run}>
                <Icon name="calc" size={18} />
                {t('ws.ss.run')}
              </button>
              <Notice tone="warn">{t('ws.ss.noPostHoc')}</Notice>
            </section>
            <section className="rs-analysis-result" aria-live="polite" aria-busy={busy || undefined}>
              {busy ? <Busy label={t('ws.analysis.running')} /> : null}
              <ErrorBox error={error} />
              {env ? (
                <ResultView envelope={env} title={cat && hasKey(t, cat.nameKey) ? t(cat.nameKey) : method} paragraphs={false}>
                  {alts.length ? (
                    <div className="rs-tablewrap">
                      <table className="rs-table rs-num">
                        <caption className="rs-table-cap">{t('ws.ss.altCaption')}</caption>
                        <thead><tr><th scope="col">{t('ws.ss.altFormula')}</th><th scope="col" className="rs-r">{t('ws.ss.altValue')}</th></tr></thead>
                        <tbody>
                          {alts.map((r) => (
                            <tr key={String(r.value)}>
                              <th scope="row">{t(`ws.opt.${altName}.${keyPart(r.value)}`)}{r.isDefault ? <span className="rs-chip rs-chip--sage rs-chip--inline">{t('ws.ss.courseChip')}</span> : null}</th>
                              <td className="rs-r">{r.v && r.v.value !== null ? formatNumber(r.v.value, { kind: 'statistic' }) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="rs-soft rs-small">{t('ws.ss.altNote')}</p>
                    </div>
                  ) : null}
                  {spec && example ? <p className="rs-soft rs-small">{t('ws.ss.courseAnswer', { answer: example.courseAnswer })}</p> : null}
                </ResultView>
              ) : !busy ? <p className="rs-soft">{t('ws.ss.empty')}</p> : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
