// Analysis [M1-DESIGN.md 10, 17; workspace boards "Prevalence", "Association", "PhoneHerd",
// "PhoneResult"]: the methods the study design allows for this screen, the columns for each role, the
// options that change numbers, and the result. When animals share farms and no farm-aware route is
// chosen, the engine stops (G1) and this screen shows ICC, DEFF and effective n with the routes, before
// any comparison; the chosen route is re-run and written into the methods paragraph. OWNER: ui-analysis role
// (M2; workspace in M1). M2 [M2-DESIGN.md 10.2]: the same screen serves the lab, models, survival and measure
// panes. There the methods are listed under the student's question and the study layout it comes from
// (method-questions.js), every option carries a plain sentence on what it changes, the result is followed
// by its charts (chart-inputs.js, drawn by the chart kit) and, after a t-test or ANOVA, a folded
// diagnostics panel that never switches the test. M3a [M3-DESIGN.md 2, 6]: the efficiency boxes of Pfaffl's
// method (one per chosen gene), the dose-response comparison set when groups are chosen, the second within factor
// of repeated measures, and the Firth switch beside the separation stop (it sets options.method = 'firth' when the
// student turns it on; the engine never does).
import { useEffect, useMemo, useState } from 'react';
import { formatNumber } from '../../lib/stats/format.js';
import { useT } from '../../i18n/index.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { clusterPanel } from '../../lib/epi/guardrails.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { useWs, errorInfo } from '../ws-context.js';
import { ALTERNATIVES, CONF_LEVELS, METHOD_UI, buildSpec, columnsForRole, initialChoices, methodsForPane, missingRoles, rolesFor, testValue, visibleOptions, efficiencyGenes, efficiencyRecord, isSeparationStop, optionsOnGroupChange, parseEfficiency, withFirth } from '../lib/method-ui.js';
import { QUESTION_PANES, groupByQuestion, termsFor } from '../lib/method-questions.js';
import { chartsForResult, repeatsCiPlot } from '../lib/chart-inputs.js';
import ResultCharts from '../components/ResultCharts.jsx';
import DiagnosticsPanel from '../components/DiagnosticsPanel.jsx';
import { herdGroups } from '../lib/herd.js';
import { keyPart } from '../lib/keys.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../components/Bits.jsx';
import G1Panel from '../components/G1Panel.jsx';
import Herd from '../components/Herd.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import ResultView, { FMT } from '../components/ResultView.jsx';
import { ownOptionLabel, primaryValueName, valueCells } from '../lib/result-model.js';
import { valueKind } from '../lib/method-ui.js';
import { levelNameFor } from '../report/build.js';

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

/**
 * The plain sentence under an option (what choosing it changes), when the dictionary has one: the
 * method's own sentence first (ws.optHelp.<method>.<option>), else the option's.
 */
function optionHelp(t, method, name) {
  return [`ws.optHelp.${keyPart(method)}.${name}`, `ws.optHelp.${name}`].map((k) => (hasKey(t, k) ? t(k) : null)).find(Boolean) || undefined;
}

/** A role's label and hint: the method's own words when a role means something else there (time on a survival curve). */
function roleWord(t, method, role, kind) {
  const own = `ws.${kind}For.${keyPart(method)}.${role}`;
  return hasKey(t, own) ? t(own) : t(`ws.${kind}.${role}`);
}

/** A level picker's label: the method's own word (qPCR's calibrator), else the level's. */
function levelWord(t, method, level) {
  const own = `ws.levelFor.${keyPart(method)}.${level}`;
  return hasKey(t, own) ? t(own) : t(`ws.level.pick.${level}`);
}

/** An option's label: the method's own word when one option name means two things (qPCR's method, PCA's scale). */
function optionLabel(t, method, name) {
  return ownOptionLabel(t, method, name) || t(`ws.opt.${name}.label`);
}

/** Option controls for one method: a select per option with more than one allowed value. */
function OptionControls({ method, options, setOptions }) {
  const { t } = useT();
  const ui = METHOD_UI[method];
  const entries = visibleOptions(method, DEFAULT_OPTIONS[method] || {});
  return (
    <div className="rs-formgrid">
      {entries.map(([name, vals]) => (
        <Field key={name} label={optionLabel(t, method, name)} hint={optionHelp(t, method, name)} htmlFor={`rs-opt-${name}`}>
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

/**
 * Pfaffl's efficiencies, one box per chosen gene [M3-DESIGN.md 2, 6]: an amplification factor or a percent, the
 * value used shown under the box, a plain sentence when it cannot be used.
 */
function EfficiencyBoxes({ genes, texts, setText, nameOf }) {
  const { t } = useT();
  if (!genes.length) return null;
  return (
    <fieldset className="rs-fieldset">
      <legend className="rs-field-label">{t('ws.qpcr.effTitle')}</legend>
      <div className="rs-formgrid">
        {genes.map((key) => {
          const text = texts[key] ?? '';
          const r = parseEfficiency(text);
          const hint = r.ok
            ? t('ws.qpcr.effReadAs', { factor: formatNumber(r.value, { kind: 'statistic', digits: 3 }), percent: formatNumber((r.value - 1) * 100, { kind: 'statistic', digits: 1 }) })
            : String(text).trim() === '' ? t('ws.qpcr.effHint') : t(r.key);
          return (
            <Field key={key} label={t('ws.qpcr.effLabel', { gene: nameOf(key) })} hint={hint} htmlFor={`rs-eff-${key}`}>
              <input id={`rs-eff-${key}`} className="rs-input rs-input--num rs-num" inputMode="decimal" autoComplete="off" aria-invalid={!r.ok && String(text).trim() !== '' ? true : undefined} value={text} onChange={(e) => setText(key, e.target.value)} />
            </Field>
          );
        })}
      </div>
    </fieldset>
  );
}

/** @param {{ p: any, pane: 'prev'|'assoc'|'lab'|'models'|'survival'|'measure' }} props */
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
  const [kept, setKept] = useState(false);
  // A separation stop was seen on this method: the Firth switch stays in the setup panel from then on.
  const [firthSeen, setFirthSeen] = useState(false);
  const byQuestion = QUESTION_PANES.includes(pane);
  const groups = useMemo(() => (byQuestion ? groupByQuestion(pane, offered) : [{ id: null, layout: null, methods: offered.map((o) => o.method) }]), [byQuestion, pane, offered]);
  const cluster = codebook.columns.find((c) => c.key === codebook.clusterKey) || null;

  useEffect(() => {
    if (!method && offered[0]) setMethod(offered[0].method);
  }, [offered, method]);

  useEffect(() => {
    if (!method) return;
    const o = { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[method] || {}) };
    const start = initialChoices(method, codebook, o);
    // a group the codebook already names turns on the dose-response comparison, as choosing it does
    setOptions(optionsOnGroupChange(method, false, Boolean(start.roles.group), o));
    setChoices(start);
    setExtra({});
    setFirthSeen(false);
    setEnv(null);
    setSpec(null);
    setError(null);
    setCompare([]);
    setIndependent(null);
    setKept(false);
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
  // The one-sample t-test compares the mean with a value the student types (R's mu, 0 until changed).
  // It used to stay at 0 with no box to change it (open since M1).
  const oneSample = method === 'test.tTest' && options.variant === 'one-sample';
  const muText = extra.mu ?? '0';
  const muOk = !oneSample || testValue(muText) !== null;
  // Pfaffl's method needs an efficiency for every chosen gene (the boxes keep their text under 'eff:<column>').
  const qpcr = method === 'qpcr.relative';
  const effTexts = Object.fromEntries(Object.entries(extra).filter(([k]) => k.startsWith('eff:')).map(([k, v]) => [k.slice(4), v]));
  const eff = qpcr ? efficiencyRecord(options.method, choices.roles, effTexts) : null;
  const effOk = !eff || eff.ok;
  const canRun = Boolean(method && engine && cat?.shipped && gaps.length === 0 && !needsCluster && extraOk && countsOk && muOk && effOk && !busy);
  const firthShown = method === 'reg.logistic' && (firthSeen || options.method === 'firth');

  const makeSpec = (route, chosen = options) => {
    const opts = { ...chosen };
    if (eff) opts.efficiency = chosen.method === 'pfaffl' ? efficiencyRecord('pfaffl', choices.roles, effTexts).efficiency : {};
    if (ui?.params) for (const k of ui.params) opts[k] = Number(extra[k]) / (k === 'se' || k === 'sp' ? 100 : 1);
    if (oneSample) opts.mu = testValue(muText);
    // only the roles this method (and its variant) shows: a role left from another t-test variant stays in the
    // choices for when the student comes back, not in the spec (review round 7: after Welch, a paired test
    // stopped on "Outcome", a role the paired screen does not show, and a one-sample test listed Sex)
    const r = Object.fromEntries(Object.entries(choices.roles).filter(([k]) => roles.some((x) => x.role === k)));
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

  const run = async (route = null, chosen = options) => {
    if (!engine) return;
    setBusy(true);
    setError(null);
    setCompare([]);
    setIndependent(null);
    setKept(false);
    try {
      const s = makeSpec(route, chosen);
      const e = await engine.run(s, p.table, codebook, steps);
      setSpec(s);
      setEnv(e);
      if (isSeparationStop(e)) setFirthSeen(true);
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
  const levelOf = levelNameFor(codebook, lang);

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

  const charts = env && env.status === 'ok' ? chartsForResult({ spec, envelope: env }, p.table, { labelOf, levelOf, t }) : [];
  const terms = method ? termsFor(method, { roles: choices.roles, options }) : [];

  return (
    <>
      <PageHead eyebrow={t(`ws.rail.${pane}`)} title={t(`ws.analysis.${pane}.title`)} sub={t(`ws.analysis.${pane}.sub`)} />
      {engineError ? <ErrorBox error={engineError} /> : null}
      {offered.length === 0 ? (
        <Notice tone="info" action={byQuestion ? <Link to={`/app/p/${p.project.id}/design`} className="rs-btn">{t('ws.rail.design')}</Link> : null}>
          {t('ws.analysis.noneForDesign', { design: t(designRow.nameKey) })}
          {byQuestion && hasKey(t, `ws.analysis.${pane}.whichDesign`) ? ` ${t(`ws.analysis.${pane}.whichDesign`)}` : ''}
        </Notice>
      ) : null}
      <div className="rs-analysis">
        <section className="rs-analysis-setup" aria-labelledby="rs-h-setup">
          <h2 id="rs-h-setup" className="rs-visually-hidden">{t('ws.analysis.setup')}</h2>
          <fieldset className="rs-fieldset">
            <legend className="rs-eyebrow">{t(byQuestion ? 'ws.analysis.question' : 'ws.analysis.method')}</legend>
            {groups.map((g) => (
              <div key={g.id || 'all'} className={g.id ? 'rs-qgroup' : undefined} role={g.id ? 'group' : undefined} aria-labelledby={g.id ? `rs-q-${pane}-${g.id}` : undefined}>
                {g.id ? (
                  <div className="rs-qhead">
                    <span id={`rs-q-${pane}-${g.id}`} className="rs-qtitle">{t(`ws.question.${g.id}.title`)}</span>
                    {g.layout ? <span className="rs-chip rs-chip--inline">{t(`ws.layout.${g.layout}`)}</span> : null}
                    <p className="rs-soft rs-small">{t(`ws.question.${g.id}.help`)}</p>
                  </div>
                ) : null}
                <div className="rs-methodlist">
                  {g.methods.map((id) => {
                    const m = getMethod(id);
                    const name = m && hasKey(t, m.nameKey) ? t(m.nameKey) : id;
                    const blurb = byQuestion && hasKey(t, `ws.methodBlurb.${keyPart(id)}`) ? t(`ws.methodBlurb.${keyPart(id)}`) : null;
                    return (
                      <label key={id} className={`rs-choice${method === id ? ' rs-choice--on' : ''}${m?.shipped ? '' : ' rs-choice--soon'}`}>
                        <input type="radio" name={`rs-method-${pane}`} value={id} checked={method === id} onChange={() => setMethod(id)} />
                        <span className="rs-choice-text">
                          <span className="rs-choice-title">{name}</span>
                          {blurb ? <span className="rs-soft rs-small">{blurb}</span> : null}
                          {m?.shipped ? null : <span className="rs-soft rs-xsmall">{t('ws.analysis.notReady')}</span>}
                        </span>
                        <VerifiedBadge show={Boolean(m?.verified)} />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          {method ? (
            <div className="rs-panel rs-pad rs-stack">
              <h3 className="rs-h3">{t('ws.analysis.columns')}</h3>
              {roles.length === 0 && !ui?.counts ? <p className="rs-soft">{t('ws.analysis.noColumns')}</p> : null}
              {roles.map((r) => {
                const fits = columnsForRole(codebook, r);
                const val = choices.roles[r.role];
                if (r.multiple) {
                  // a column holds one role: the outcome, time or event chosen here is not offered again as an
                  // explanatory variable (review round 5: ticked twice, the model fitted and was badged verified)
                  const taken = roles.filter((o) => !o.multiple).map((o) => choices.roles[o.role]).filter(Boolean);
                  const offered = fits.filter((c) => !taken.includes(c.key));
                  const left = fits.filter((c) => taken.includes(c.key));
                  return (
                    <fieldset key={r.role} className="rs-fieldset">
                      <legend className="rs-field-label">{roleWord(t, method, r.role, 'role')}</legend>
                      {hasKey(t, `ws.roleHint.${r.role}`) ? <p className="rs-field-hint">{roleWord(t, method, r.role, 'roleHint')}</p> : null}
                      <div className="rs-checkgrid">
                        {fits.length === 0 ? <p className="rs-soft rs-small">{t('ws.analysis.noFitting')}</p> : null}
                        {offered.map((c) => (
                          <label key={c.key} className="rs-check">
                            <input type="checkbox" checked={(val || []).includes(c.key)} onChange={(e) => setChoices((ch) => ({ ...ch, roles: { ...ch.roles, [r.role]: e.target.checked ? [...(val || []), c.key] : (val || []).filter((x) => x !== c.key) } }))} />
                            {colName(c)}
                          </label>
                        ))}
                      </div>
                      {left.length ? <p className="rs-field-hint">{t('ws.analysis.takenElsewhere', { columns: left.map(colName).join(', ') })}</p> : null}
                    </fieldset>
                  );
                }
                const lv = val ? levelsFor(val) : [];
                return (
                  <div key={r.role} className="rs-rolebox">
                    <Field label={roleWord(t, method, r.role, 'role')} hint={roleWord(t, method, r.role, 'roleHint')} htmlFor={`rs-role-${r.role}`}>
                      <select id={`rs-role-${r.role}`} className="rs-select" value={val || ''} onChange={(e) => {
                        const key = e.target.value || null;
                        const entry = codebook.columns.find((c) => c.key === key);
                        setChoices((ch) => {
                          const levels = { ...ch.levels };
                          // The column leaves any other role it held, a list it was ticked in or another single
                          // choice with its levels (a column holds one role; review round 6: the Poisson time
                          // select still offered the outcome, and the run then stopped).
                          const next = { ...ch.roles, [r.role]: key };
                          if (key) {
                            for (const o of roles) {
                              if (o.role === r.role) continue;
                              if (o.multiple && Array.isArray(next[o.role])) next[o.role] = next[o.role].filter((x) => x !== key);
                              else if (!o.multiple && next[o.role] === key) {
                                next[o.role] = null;
                                if (o.level) levels[o.level] = null;
                                if (o.reference) levels[o.reference] = null;
                              }
                            }
                          }
                          if (r.level) levels[r.level] = (r.level === 'controlLevel' ? entry?.reference : entry?.positive) || null;
                          if (r.reference) levels[r.reference] = entry?.reference || null;
                          return { roles: next, levels };
                        });
                        if (r.role === 'group') setOptions((o) => optionsOnGroupChange(method, Boolean(val), Boolean(key), o));
                      }}>
                        <option value="">{r.optional ? t(r.role === 'group' || r.role === 'strata' ? 'ws.analysis.optionalNone' : 'ws.analysis.optionalEmpty') : t('ws.steps.chooseColumn')}</option>
                        {fits.map((c) => <option key={c.key} value={c.key}>{colName(c)}</option>)}
                      </select>
                    </Field>
                    {val && r.level ? (
                      <Field label={r.role === 'event' ? t('ws.level.pick.event') : levelWord(t, method, r.level)} htmlFor={`rs-lv-${r.level}`}>
                        <select id={`rs-lv-${r.level}`} className="rs-select" value={choices.levels[r.level] || ''} onChange={(e) => setChoices((ch) => ({ ...ch, levels: { ...ch.levels, [r.level]: e.target.value || null } }))}>
                          <option value="">{t('ws.steps.chooseLevel')}</option>
                          {lv.map((v) => <option key={v} value={v}>{levelOf(val, v)}</option>)}
                        </select>
                      </Field>
                    ) : null}
                    {val && r.reference ? (
                      <Field label={t(`ws.level.pick.${r.reference}`)} htmlFor={`rs-lv-${r.reference}`}>
                        <select id={`rs-lv-${r.reference}`} className="rs-select" value={choices.levels[r.reference] || ''} onChange={(e) => setChoices((ch) => ({ ...ch, levels: { ...ch.levels, [r.reference]: e.target.value || null } }))}>
                          <option value="">{t('ws.steps.chooseLevel')}</option>
                          {lv.filter((v) => v !== choices.levels[r.level]).map((v) => <option key={v} value={v}>{levelOf(val, v)}</option>)}
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
              {oneSample ? (
                <div className="rs-formgrid">
                  <Field label={t('ws.opt.mu.label')} hint={t(muOk ? 'ws.optHelp.mu' : 'ws.opt.mu.invalid')} htmlFor="rs-opt-mu">
                    {/* ponytail: no inputMode="decimal": the iPhone decimal pad has no minus sign, and a test value can be negative */}
                    <input id="rs-opt-mu" className="rs-input rs-input--num rs-num" autoComplete="off" aria-invalid={muOk ? undefined : true} value={muText} onChange={(e) => setExtra((x) => ({ ...x, mu: e.target.value }))} />
                  </Field>
                </div>
              ) : null}
              <details className="rs-options">
                <summary>{t('ws.analysis.options')}</summary>
                <OptionControls method={method} options={options} setOptions={setOptions} />
                {qpcr && options.method === 'pfaffl' ? (
                  <EfficiencyBoxes genes={efficiencyGenes(choices.roles)} texts={effTexts} nameOf={labelOf} setText={(key, v) => setExtra((x) => ({ ...x, [`eff:${key}`]: v }))} />
                ) : null}
              </details>
              {firthShown ? (
                <div className="rs-field">
                  <label className="rs-check" htmlFor="rs-opt-firth">
                    <input id="rs-opt-firth" type="checkbox" checked={options.method === 'firth'} onChange={(e) => setOptions((o) => withFirth(o, e.target.checked))} />
                    <span lang="en">{t('ws.firth.switch')}</span>
                  </label>
                  <p className="rs-field-hint">{t('ws.firth.switchHint')}</p>
                </div>
              ) : null}
              {terms.length ? (
                <dl className="rs-g1-glosses rs-small" aria-label={t('ws.analysis.termsTitle')}>
                  {terms.map((k) => (
                    <div key={k}><dt lang="en">{t(`term.${k}.name`)}</dt><dd className="rs-soft">{t(`term.${k}.gloss`)}</dd></div>
                  ))}
                </dl>
              ) : null}
              {needsCluster ? <Notice tone="info">{t('ws.analysis.needsCluster')}</Notice> : null}
              {hasKey(t, `ws.analysis.${pane}.before`) ? <p className="rs-soft rs-small">{t(`ws.analysis.${pane}.before`)}</p> : null}
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              {gaps.length ? <p className="rs-soft rs-small">{t('ws.analysis.stillNeeds', { what: gaps.map((g) => (hasKey(t, `ws.role.${g}`) ? roleWord(t, method, g, 'role') : roles.some((x) => x.role === 'event' && x.level === g) ? t('ws.level.pick.event') : levelWord(t, method, g))).join(', ') })}</p> : null}
              {!gaps.length && eff && !eff.ok ? <p className="rs-soft rs-small">{t('ws.analysis.stillNeeds', { what: t('ws.qpcr.effStill', { genes: eff.bad.map(labelOf).join(', ') }) })}</p> : null}
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
            <G1Panel panel={panel} stops={env.guard.stops} onChoose={(r) => run(r)} busy={busy} columnName={cluster ? colName(cluster) : ''} single={String(method || '').startsWith('freq.')} />
          ) : null}
          {isSeparationStop(env) ? (
            <Notice
              tone="warn"
              title={t('ws.firth.stopTitle')}
              action={<button type="button" className="rs-btn rs-btn--sm" disabled={busy || !engine} onClick={() => { const o = withFirth(options, true); setOptions(o); run(null, o); }}>{t('ws.firth.run')}</button>}
            >
              {t('ws.firth.stopBody')}
            </Notice>
          ) : null}
          {env && !clusterStop ? (
            <ResultView
              envelope={env}
              title={title}
              designRow={designRow}
              extraRows={extraRows}
              headlineLabel={deffShown ? t('ws.prev.adjustedHeadline') : undefined}
              hidePlot={repeatsCiPlot(charts)}
              madeUp={Boolean(p.project?.example)}
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
              onSnapshot={env.status === 'ok' ? async () => { const id = await p.saveSnapshot(spec, env); if (id) setKept(true); } : null}
              onDownloaded={(kind) => p.log('download', { what: kind, method })}
            >
              <ResultCharts charts={charts} caption={title} idBase={`rs-charts-${pane}`} madeUp={Boolean(p.project?.example)} figuresHref={kept ? `/app/p/${p.project.id}/figures` : null} onDownloaded={(kind, chart) => p.log('download', { what: kind, method, chart })} />
              {env.status === 'ok' && spec ? (
                <DiagnosticsPanel spec={spec} table={p.table} codebook={codebook} steps={steps} datasetId={p.meta.id} labelOf={labelOf} onLog={(what) => p.log('analysis', { method, ...what })} />
              ) : null}
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
