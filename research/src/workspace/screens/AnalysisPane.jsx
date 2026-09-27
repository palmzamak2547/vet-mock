// Analysis [M1-DESIGN.md 10, 17; workspace boards "Prevalence", "Association", "PhoneHerd",
// "PhoneResult"]: the methods the study design allows for this screen, the columns for each role, the
// options that change numbers, and the result. When animals share farms and no farm-aware route is
// chosen, the engine stops (G1) and this screen shows ICC, DEFF and effective n with the routes, before
// any comparison; the chosen route is re-run and written into the methods paragraph. OWNER: workspace role.
import { useEffect, useMemo, useState } from 'react';
import { formatNumber } from '../../lib/stats/format.js';
import { useT } from '../../i18n/index.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { clusterPanel } from '../../lib/epi/guardrails.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { useWs, errorInfo } from '../ws-context.js';
import { ALTERNATIVES, CONF_LEVELS, METHOD_UI, buildSpec, columnsForRole, initialChoices, methodsForPane, missingRoles, rolesFor } from '../lib/method-ui.js';
import { herdGroups } from '../lib/herd.js';
import { keyPart } from '../lib/keys.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../components/Bits.jsx';
import G1Panel from '../components/G1Panel.jsx';
import Herd from '../components/Herd.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import ResultView, { FMT } from '../components/ResultView.jsx';
import { primaryValueName, valueCells } from '../lib/result-model.js';
import { valueKind } from '../lib/method-ui.js';

const hasKey = (t, k) => t(k) !== `[${k}]`;

/**
 * A single prevalence has no p-value, so G1 has nothing to hold back: when the data have a farm
 * column the screen shows the farm-adjusted prevalence straight away through the design effect, as
 * the Prevalence board does, and the route stays switchable (review round 2). Comparisons still stop.
 */
const PREV_DEFAULT_DEFF = new Set(['freq.proportion', 'freq.truePrevalence']);

function methodFromQuery() {
  try { return new URLSearchParams(window.location.search).get('m'); } catch { return null; }
}

/** Option controls for one method: a select per option with more than one allowed value. */
function OptionControls({ method, options, setOptions }) {
  const { t } = useT();
  const ui = METHOD_UI[method];
  const entries = Object.entries(ui?.options || {}).filter(([, vals]) => vals.length > 1);
  return (
    <div className="rs-formgrid">
      {entries.map(([name, vals]) => (
        <Field key={name} label={t(`ws.opt.${name}.label`)} htmlFor={`rs-opt-${name}`}>
          <select id={`rs-opt-${name}`} className="rs-select" value={String(options[name])} onChange={(e) => {
            const raw = e.target.value;
            const v = vals.find((x) => String(x) === raw);
            setOptions((o) => ({ ...o, [name]: v }));
          }}>
            {vals.map((v) => <option key={String(v)} value={String(v)}>{t(`ws.opt.${name}.${keyPart(v)}`)}</option>)}
          </select>
        </Field>
      ))}
      <Field label={t('ws.opt.confLevel.label')} htmlFor="rs-opt-conf">
        <select id="rs-opt-conf" className="rs-select" value={String(options.confLevel)} onChange={(e) => setOptions((o) => ({ ...o, confLevel: Number(e.target.value) }))}>
          {CONF_LEVELS.map((v) => <option key={v} value={String(v)}>{`${Math.round(v * 100)}%`}</option>)}
        </select>
      </Field>
      {ui?.alternative ? (
        <Field label={t('ws.opt.alternative.label')} htmlFor="rs-opt-alt">
          <select id="rs-opt-alt" className="rs-select" value={options.alternative} onChange={(e) => setOptions((o) => ({ ...o, alternative: e.target.value }))}>
            {ALTERNATIVES.map((v) => <option key={v} value={v}>{t(`ws.opt.alternative.${keyPart(v)}`)}</option>)}
          </select>
        </Field>
      ) : null}
    </div>
  );
}

/** @param {{ p: any, pane: 'prev'|'assoc' }} props */
export default function AnalysisPane({ p, pane }) {
  const { t, lang } = useT();
  const { engine, engineError } = useWs();
  const codebook = p.codebook || p.meta.codebook;
  const steps = p.meta.steps || [];
  const designRow = DESIGNS.find((d) => d.id === p.project.design) || null;
  const offered = useMemo(() => methodsForPane(pane, designRow), [pane, designRow]);
  const [method, setMethod] = useState(() => {
    const q = methodFromQuery();
    return offered.some((o) => o.method === q) ? q : offered[0]?.method || null;
  });
  const [options, setOptions] = useState({});
  const [choices, setChoices] = useState({ roles: {}, levels: {} });
  const [extra, setExtra] = useState({});
  const [env, setEnv] = useState(null);
  const [spec, setSpec] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [compare, setCompare] = useState([]);
  const [independent, setIndependent] = useState(null);
  const cluster = codebook.columns.find((c) => c.key === codebook.clusterKey) || null;

  useEffect(() => {
    if (!method && offered[0]) setMethod(offered[0].method);
  }, [offered, method]);

  useEffect(() => {
    if (!method) return;
    const o = { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[method] || {}) };
    setOptions(o);
    setChoices(initialChoices(method, codebook, o));
    setExtra({});
    setEnv(null);
    setSpec(null);
    setError(null);
    setCompare([]);
    setIndependent(null);
  }, [method, codebook]);

  const levelsFor = (key) => {
    const fromCb = codebook.columns.find((c) => c.key === key)?.levels?.map((l) => l.value) || [];
    return fromCb.length ? fromCb : p.table?.columns?.[key]?.levels || [];
  };

  const ui = method ? METHOD_UI[method] : null;
  const cat = method ? getMethod(method) : null;
  const roles = method ? rolesFor(method, options) : [];
  const gaps = method ? missingRoles(method, choices, options) : [];
  const needsCluster = ui?.needsCluster && !cluster;
  const extraOk = !ui?.params || ui.params.every((k) => Number.isFinite(Number(extra[k])) && String(extra[k]).trim() !== '');
  const countsOk = !ui?.counts || ui.counts.every((k) => Number.isFinite(Number(extra[k])) && Number(extra[k]) >= 0 && String(extra[k]).trim() !== '');
  const canRun = Boolean(method && engine && cat?.shipped && gaps.length === 0 && !needsCluster && extraOk && countsOk && !busy);

  const makeSpec = (route) => {
    const opts = { ...options };
    if (ui?.params) for (const k of ui.params) opts[k] = Number(extra[k]) / (k === 'se' || k === 'sp' ? 100 : 1);
    const r = { ...choices.roles };
    if (ui?.needsCluster && cluster) r.cluster = cluster.key;
    return buildSpec({
      method,
      datasetId: p.meta.id,
      recipeRev: p.table?.recipeRev ?? p.meta.rev,
      design: p.project.design,
      roles: r,
      levels: choices.levels,
      options: opts,
      cluster: { route: route ?? null, column: cluster?.key ?? null },
      counts: ui?.counts ? Object.fromEntries(ui.counts.map((k) => [k, Number(extra[k])])) : null,
    });
  };

  const run = async (route = null) => {
    if (!engine) return;
    setBusy(true);
    setError(null);
    setCompare([]);
    setIndependent(null);
    try {
      const s = makeSpec(route);
      const e = await engine.run(s, p.table, codebook, steps);
      setSpec(s);
      setEnv(e);
      // Beside a farm-adjusted prevalence, the same count read as if every animal were independent:
      // the engine's Wald interval on x of n, so the plot shows how much the farms widen it.
      if (route === 'deff' && method === 'freq.proportion' && e?.status === 'ok' && e.values?.x && e.values?.n) {
        const ind = await engine.run({
          specVersion: 1, method: 'freq.proportion', input: { kind: 'counts', counts: { x: e.values.x.value, n: e.values.n.value } },
          design: p.project.design || null, roles: {}, levels: {}, options: { ...COMMON_OPTIONS, ciMethod: 'wald', confLevel: s.options.confLevel },
          cluster: { route: null, column: null },
        }, null, null).catch(() => null);
        if (ind?.status === 'ok') setIndependent(ind);
      }
      await p.log('analysis', { method, route: route || null, status: e?.status });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const runCompare = async () => {
    if (!env || !spec?.cluster?.route) return;
    setBusy(true);
    try {
      const routes = (panel?.routes || []).filter((r) => r.enabled && r.id !== spec.cluster.route).map((r) => r.id);
      const rows = [];
      // spec is already a built AnalysisSpec: only the route changes between the runs. A run that
      // ignores the farms is never offered: the engine stops it (G1), by design.
      for (const r of routes) {
        const e = await engine.run({ ...spec, cluster: { route: r, column: spec.cluster.column } }, p.table, codebook, steps).catch(() => null);
        if (e?.status === 'ok') rows.push({ route: r, env: e });
      }
      setCompare(rows);
      await p.log('analysis', { method, compare: rows.map((r) => r.route) });
    } finally {
      setBusy(false);
    }
  };

  const stopped = env?.status === 'stopped';
  const clusterStop = stopped && (env.guard?.stops || []).some((s) => s.id === 'G1' || s.id === 'G2');
  const panel = useMemo(() => {
    if (!clusterStop && !spec?.cluster?.route) return null;
    try { return clusterPanel(spec, p.table, codebook); } catch { return null; }
  }, [clusterStop, spec, p.table, codebook]);

  const herd = useMemo(() => {
    if (pane !== 'prev' || !cluster || !choices.roles.outcome || !choices.levels.outcomePositive) return [];
    return herdGroups(p.table, cluster.key, choices.roles.outcome, choices.levels.outcomePositive);
  }, [pane, cluster, choices, p.table]);

  const colName = (c) => (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name);
  const labelOf = (key) => {
    const c = codebook.columns.find((x) => x.key === key);
    return c ? colName(c) : key;
  };

  if (!designRow) {
    return (
      <>
        <PageHead eyebrow={t(`ws.rail.${pane}`)} title={t(`ws.analysis.${pane}.title`)} />
        <Notice tone="info" title={t('ws.analysis.designFirstTitle')} action={<Link to={`/app/p/${p.project.id}/design`} className="rs-btn rs-btn--primary">{t('ws.rail.design')}</Link>}>
          {t('ws.analysis.designFirstBody')}
        </Notice>
      </>
    );
  }

  const title = cat && hasKey(t, cat.nameKey) ? t(cat.nameKey) : method;
  const indRow = (() => {
    const v = independent?.values?.prevalence;
    if (!v || !env || spec?.cluster?.route !== 'deff') return null;
    const cells = valueCells({ ...v, name: 'prevalence', kind: 'proportion' }, FMT, lang, t);
    return { label: t('ws.prev.independentRow'), est: v.value, lo: v.ci?.[0] ?? null, hi: v.ci?.[1] ?? null, muted: true, estText: cells.est, ciText: cells.ci };
  })();
  const deffShown = env?.status === 'ok' && spec?.cluster?.route === 'deff' && method === 'freq.proportion';
  const why = (() => {
    if (!deffShown || !indRow) return null;
    const v = env.values || {};
    const main = v.prevalence;
    if (!v.icc || !v.meanSize || !v.deff || !v.nEff || !main?.ci || indRow.lo === null) return null;
    const pts = (a, b) => formatNumber((b - a) * 100, { kind: 'statistic', digits: 1 });
    return {
      idea: t('ws.prev.why.idea', { n: formatNumber(v.n?.value, { kind: 'count' }) }),
      data: t('ws.prev.why.data', { icc: formatNumber(v.icc.value, { kind: 'statistic', digits: 4 }), m: formatNumber(v.meanSize.value, { kind: 'statistic', digits: 2 }), deff: formatNumber(v.deff.value, { kind: 'statistic', digits: 2 }), nEff: formatNumber(Math.round(v.nEff.value), { kind: 'count' }) }),
      result: t('ws.prev.why.result', { from: pts(indRow.lo, indRow.hi), to: pts(main.ci[0], main.ci[1]), p: formatNumber(main.value, { kind: 'proportion' }) }),
    };
  })();
  const extraRows = [indRow, ...compare.map((c) => {
    const k = primaryValueName(c.env, designRow);
    const v = k ? c.env.values?.[k] : null;
    if (!v) return null;
    const cells = valueCells({ ...v, name: k, kind: valueKind(k) }, FMT, lang, t);
    return { label: t(`ws.route.${keyPart(c.route)}.short`), est: v.value, lo: v.ci?.[0] ?? null, hi: v.ci?.[1] ?? null, muted: true, estText: cells.est, ciText: cells.ci };
  })].filter(Boolean);

  return (
    <>
      <PageHead eyebrow={t(`ws.rail.${pane}`)} title={t(`ws.analysis.${pane}.title`)} sub={t(`ws.analysis.${pane}.sub`)} />
      {engineError ? <ErrorBox error={engineError} /> : null}
      {offered.length === 0 ? <Notice tone="info">{t('ws.analysis.noneForDesign', { design: t(designRow.nameKey) })}</Notice> : null}
      <div className="rs-analysis">
        <section className="rs-analysis-setup" aria-labelledby="rs-h-setup">
          <h2 id="rs-h-setup" className="rs-visually-hidden">{t('ws.analysis.setup')}</h2>
          <fieldset className="rs-fieldset">
            <legend className="rs-eyebrow">{t('ws.analysis.method')}</legend>
            <div className="rs-methodlist">
              {offered.map((o) => {
                const m = getMethod(o.method);
                const name = m && hasKey(t, m.nameKey) ? t(m.nameKey) : o.method;
                return (
                  <label key={o.method} className={`rs-choice${method === o.method ? ' rs-choice--on' : ''}${m?.shipped ? '' : ' rs-choice--soon'}`}>
                    <input type="radio" name={`rs-method-${pane}`} value={o.method} checked={method === o.method} onChange={() => setMethod(o.method)} />
                    <span className="rs-choice-text">
                      <span className="rs-choice-title">{name}</span>
                      {m?.shipped ? null : <span className="rs-soft rs-xsmall">{t('ws.analysis.notReady')}</span>}
                    </span>
                    <VerifiedBadge show={Boolean(m?.verified)} />
                  </label>
                );
              })}
            </div>
          </fieldset>

          {method ? (
            <div className="rs-panel rs-pad rs-stack">
              <h3 className="rs-h3">{t('ws.analysis.columns')}</h3>
              {roles.length === 0 && !ui?.counts ? <p className="rs-soft">{t('ws.analysis.noColumns')}</p> : null}
              {roles.map((r) => {
                const fits = columnsForRole(codebook, r);
                const val = choices.roles[r.role];
                if (r.multiple) {
                  return (
                    <fieldset key={r.role} className="rs-fieldset">
                      <legend className="rs-field-label">{t(`ws.role.${r.role}`)}</legend>
                      <div className="rs-checkgrid">
                        {fits.map((c) => (
                          <label key={c.key} className="rs-check">
                            <input type="checkbox" checked={(val || []).includes(c.key)} onChange={(e) => setChoices((ch) => ({ ...ch, roles: { ...ch.roles, [r.role]: e.target.checked ? [...(val || []), c.key] : (val || []).filter((x) => x !== c.key) } }))} />
                            {colName(c)}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                }
                const lv = val ? levelsFor(val) : [];
                return (
                  <div key={r.role} className="rs-rolebox">
                    <Field label={t(`ws.role.${r.role}`)} hint={t(`ws.roleHint.${r.role}`)} htmlFor={`rs-role-${r.role}`}>
                      <select id={`rs-role-${r.role}`} className="rs-select" value={val || ''} onChange={(e) => {
                        const key = e.target.value || null;
                        const entry = codebook.columns.find((c) => c.key === key);
                        setChoices((ch) => {
                          const levels = { ...ch.levels };
                          if (r.level) levels[r.level] = entry?.positive || null;
                          if (r.reference) levels[r.reference] = entry?.reference || null;
                          return { roles: { ...ch.roles, [r.role]: key }, levels };
                        });
                      }}>
                        <option value="">{r.optional ? t('ws.analysis.optionalNone') : t('ws.steps.chooseColumn')}</option>
                        {fits.map((c) => <option key={c.key} value={c.key}>{colName(c)}</option>)}
                      </select>
                    </Field>
                    {val && r.level ? (
                      <Field label={t(`ws.level.pick.${r.level}`)} htmlFor={`rs-lv-${r.level}`}>
                        <select id={`rs-lv-${r.level}`} className="rs-select" value={choices.levels[r.level] || ''} onChange={(e) => setChoices((ch) => ({ ...ch, levels: { ...ch.levels, [r.level]: e.target.value || null } }))}>
                          <option value="">{t('ws.steps.chooseLevel')}</option>
                          {lv.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>
                    ) : null}
                    {val && r.reference ? (
                      <Field label={t(`ws.level.pick.${r.reference}`)} htmlFor={`rs-lv-${r.reference}`}>
                        <select id={`rs-lv-${r.reference}`} className="rs-select" value={choices.levels[r.reference] || ''} onChange={(e) => setChoices((ch) => ({ ...ch, levels: { ...ch.levels, [r.reference]: e.target.value || null } }))}>
                          <option value="">{t('ws.steps.chooseLevel')}</option>
                          {lv.filter((v) => v !== choices.levels[r.level]).map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>
                    ) : null}
                  </div>
                );
              })}
              {ui?.counts ? (
                <div className="rs-formgrid">
                  {ui.counts.map((k) => (
                    <Field key={k} label={t(`ws.counts.${k}`)} htmlFor={`rs-c-${k}`}>
                      <input id={`rs-c-${k}`} className="rs-input rs-num" inputMode="decimal" value={extra[k] ?? ''} onChange={(e) => setExtra((x) => ({ ...x, [k]: e.target.value }))} />
                    </Field>
                  ))}
                </div>
              ) : null}
              {ui?.params ? (
                <div className="rs-formgrid">
                  {ui.params.map((k) => (
                    <Field key={k} label={t(`ws.param.${k}`)} hint={t('ws.param.fromKit')} htmlFor={`rs-x-${k}`}>
                      <div className="rs-row"><input id={`rs-x-${k}`} className="rs-input rs-input--num rs-num" inputMode="decimal" value={extra[k] ?? ''} onChange={(e) => setExtra((x) => ({ ...x, [k]: e.target.value }))} /><span>%</span></div>
                    </Field>
                  ))}
                </div>
              ) : null}
              <details className="rs-options">
                <summary>{t('ws.analysis.options')}</summary>
                <OptionControls method={method} options={options} setOptions={setOptions} />
              </details>
              {needsCluster ? <Notice tone="info">{t('ws.analysis.needsCluster')}</Notice> : null}
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              {gaps.length ? <p className="rs-soft rs-small">{t('ws.analysis.stillNeeds', { what: gaps.map((g) => t(hasKey(t, `ws.role.${g}`) ? `ws.role.${g}` : `ws.level.pick.${g}`)).join(', ') })}</p> : null}
              {cluster && !ui?.needsCluster && ui?.input === 'dataset' ? <p className="rs-soft rs-small">{t('ws.analysis.clusterAhead', { column: cluster.name })}</p> : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!canRun} onClick={() => run(pane === 'prev' && cluster && PREV_DEFAULT_DEFF.has(method) ? 'deff' : null)}>
                <Icon name="play" size={18} />
                {t('ws.analysis.run')}
              </button>
            </div>
          ) : null}
        </section>

        <section className="rs-analysis-result" aria-live="polite" aria-busy={busy || undefined}>
          {busy ? <Busy label={t('ws.analysis.running')} /> : null}
          <ErrorBox error={error} />
          {herd.length ? <Herd groups={herd} clusterName={cluster?.name || ''} /> : null}
          {clusterStop ? (
            <G1Panel panel={panel} stops={env.guard.stops} onChoose={(r) => run(r)} busy={busy} columnName={cluster?.name || ''} single={String(method || '').startsWith('freq.')} />
          ) : null}
          {env && !clusterStop ? (
            <ResultView
              envelope={env}
              title={title}
              designRow={designRow}
              extraRows={extraRows}
              headlineLabel={deffShown ? t('ws.prev.adjustedHeadline') : undefined}
              primaryPlotLabel={deffShown ? t('ws.prev.adjustedRow') : undefined}
              afterPlot={why ? (
                // Under the headline and the CI plot, as the board has it (review round 3: it came first).
                <section className="rs-panel rs-pad" aria-labelledby="rs-h-why">
                  <h3 id="rs-h-why" className="rs-h3">{t('ws.prev.why.title')}</h3>
                  <dl className="rs-why">
                    <div><dt>{t('ws.prev.why.ideaLabel')}</dt><dd>{why.idea}</dd></div>
                    <div><dt>{t('ws.prev.why.dataLabel')}</dt><dd className="rs-num">{why.data}</dd></div>
                    <div><dt>{t('ws.prev.why.resultLabel')}</dt><dd className="rs-num">{why.result}</dd></div>
                  </dl>
                </section>
              ) : null}
              labelOf={labelOf}
              codebook={codebook}
              onSnapshot={env.status === 'ok' ? () => p.saveSnapshot(spec, env) : null}
              onDownloaded={(kind) => p.log('download', { what: kind, method })}
            >
              {spec?.cluster?.route && spec.cluster.route !== 'none' ? (
                <div className="rs-panel rs-pad rs-stack">
                  <h3 className="rs-h3">{t('ws.analysis.routeUsed', { route: t(`ws.route.${keyPart(spec.cluster.route)}.title`) })}</h3>
                  <p className="rs-soft rs-small">{t('ws.analysis.routeWrites')}</p>
                  <div className="rs-row-wrap">
                    <button type="button" className="rs-btn rs-btn--sm" onClick={runCompare} disabled={busy}>{t('ws.analysis.compareRoutes')}</button>
                    <Link to={`/app/p/${p.project.id}/report`} className="rs-btn rs-btn--sm rs-btn--quiet">{t('ws.analysis.toReport')}<Icon name="arrow" size={16} /></Link>
                  </div>
                  {compare.length ? <p className="rs-soft rs-small">{t('ws.analysis.compareNote')}</p> : null}
                </div>
              ) : null}
            </ResultView>
          ) : null}
          {!env && !busy && !error && method ? <p className="rs-soft">{t('ws.analysis.empty')}</p> : null}
        </section>
      </div>
    </>
  );
}
