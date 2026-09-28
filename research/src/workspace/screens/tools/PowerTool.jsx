// Power and sample size for experiments without a data file: ANOVA, t-tests, correlation, regression, each
// with the farm design effect step [M2-DESIGN.md 3.1.7, 10.3]. Every number comes from the engine
// (lib/stats/power.js, pinned to R's power.anova.test, power.t.test and the pwr package); the screen
// only asks for the inputs. The design effect 1 + (m - 1) ICC multiplies n as its own step when animals
// sit in farms. Power computed after the data are in is refused (G9): it only restates the p-value.
// OWNER: ui-tools role.
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { getMethod } from '../../../lib/runtime/catalog.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { buildSpec } from '../../lib/method-ui.js';
import { parseParams } from '../../lib/sample-size.js';
import { keyPart } from '../../lib/keys.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import Rail from '../../components/Rail.jsx';
import ResultView from '../../components/ResultView.jsx';
import { powerUnit } from '../../lib/result-model.js';
import TopBar from '../../components/TopBar.jsx';
import { TOOL_RAIL } from './tool-rail.js';
import '../../../styles/tools.css';

/** Each calculator's inputs besides n or power (which one is asked depends on what is solved for). */
export const POWER_METHODS = Object.freeze({
  'power.anova': { fields: ['groups', 'betweenVar', 'withinVar'] },
  'power.tTest': { fields: ['delta', 'sd'], types: ['two-sample', 'paired', 'one-sample'] },
  'power.correlation': { fields: ['r'] },
  'power.regression': { fields: ['u', 'f2'] },
});
export const POWER_IDS = Object.freeze(Object.keys(POWER_METHODS));
export const SOLVE_FOR = Object.freeze(['n', 'power']);
export const SIG_LEVELS = Object.freeze([0.05, 0.01, 0.1]);
/** The optional design-effect inputs (farm size and ICC). */
export const DEFF_FIELDS = Object.freeze(['m', 'icc']);

/** Fields a calculator asks for, given what it solves for. */
export function powerFields(method, solveFor) {
  const base = POWER_METHODS[method]?.fields || [];
  return [...base, solveFor === 'n' ? 'power' : 'n'];
}

const hasKey = (t, k) => t(k) !== `[${k}]`;

export default function Tool() {
  const { t } = useT();
  const { engine, engineError } = useWs();
  const [menu, setMenu] = useState(false);
  const [method, setMethod] = useState('power.anova');
  const [solveFor, setSolveFor] = useState('n');
  const [sigLevel, setSigLevel] = useState(0.05);
  const [ttype, setTtype] = useState('two-sample');
  const [fields, setFields] = useState({});
  const [farms, setFarms] = useState(false);
  const [env, setEnv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const tabRefs = useRef({});
  const cat = getMethod(method);

  useEffect(() => { setEnv(null); setError(null); }, [method, solveFor, ttype]);
  useEffect(() => { document.title = `${t('ws.rail.power')} | ${t('common.appName')}`; }, [t]);

  const wanted = powerFields(method, solveFor);
  const asked = [...wanted, ...(farms ? DEFF_FIELDS : [])];
  const typed = Object.fromEntries(asked.map((k) => [k, fields[k] ?? '']));
  const parsed = parseParams(typed);
  const missing = asked.filter((k) => parsed.params[k] === undefined);
  const ok = parsed.bad.length === 0 && missing.length === 0;
  const label = (k) => t(`tools.power.param.${keyPart(method)}.${k}`) !== `[tools.power.param.${keyPart(method)}.${k}]` ? t(`tools.power.param.${keyPart(method)}.${k}`) : t(`tools.power.param.${k}`);

  const onTabKey = (e) => {
    const i = POWER_IDS.indexOf(method);
    const next = e.key === 'ArrowRight' ? POWER_IDS[(i + 1) % POWER_IDS.length] : e.key === 'ArrowLeft' ? POWER_IDS[(i - 1 + POWER_IDS.length) % POWER_IDS.length] : e.key === 'Home' ? POWER_IDS[0] : e.key === 'End' ? POWER_IDS[POWER_IDS.length - 1] : null;
    if (!next) return;
    e.preventDefault();
    setMethod(next);
    tabRefs.current[next]?.focus();
  };

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const options = { solveFor, sigLevel, ...(method === 'power.tTest' ? { type: ttype } : {}) };
      const spec = buildSpec({ method, params: parsed.params, options });
      setEnv(await engine.run(spec, null, null));
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const name = (id) => { const m = getMethod(id); return m && hasKey(t, m.nameKey) ? t(m.nameKey) : id; };

  return (
    <div className="rs-ws">
      <TopBar crumb={t('tools.power.crumb')} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />
      <div className="rs-ws-body">
        <Rail pane="power" items={TOOL_RAIL} open={menu} onClose={() => setMenu(false)} fileLineKey="ws.ss.noFile" />
        <main id="rs-main" className="rs-main">
          <PageHead eyebrow={t('ws.rail.group.tools')} title={t('tools.power.title')} sub={t('tools.power.sub')} />
          {engineError ? <ErrorBox error={engineError} /> : null}
          <p className="rs-soft rs-small">{t('tools.power.gloss')}</p>
          <div className="rs-tabs" role="tablist" aria-label={t('tools.power.kinds')}>
            {POWER_IDS.map((id) => (
              <button key={id} ref={(el) => { tabRefs.current[id] = el; }} type="button" role="tab" aria-selected={method === id} tabIndex={method === id ? 0 : -1} onKeyDown={onTabKey} className={`rs-tab${method === id ? ' rs-tab--on' : ''}`} onClick={() => setMethod(id)}>
                {name(id)}
              </button>
            ))}
          </div>
          <div className="rs-analysis">
            <section className="rs-analysis-setup rs-panel rs-pad rs-stack" aria-labelledby="rs-h-power">
              <div className="rs-row">
                <h2 id="rs-h-power" className="rs-h3 rs-grow">{name(method)}</h2>
                <VerifiedBadge show={Boolean(cat?.verified)} />
              </div>
              <p className="rs-soft rs-small">{t(`tools.power.about.${keyPart(method)}`)}</p>
              <fieldset className="rs-fieldset">
                <legend className="rs-field-label">{t('tools.power.solveFor')}</legend>
                <div className="rs-row-wrap">
                  {SOLVE_FOR.map((s) => (
                    <label key={s} className="rs-radio">
                      <input type="radio" name="rs-power-solve" checked={solveFor === s} onChange={() => setSolveFor(s)} />
                      {t(`tools.power.solve.${s}`)}
                    </label>
                  ))}
                </div>
              </fieldset>
              {method === 'power.tTest' ? (
                <Field label={t('tools.power.ttype')} htmlFor="rs-power-type">
                  <select id="rs-power-type" className="rs-select" value={ttype} onChange={(e) => setTtype(e.target.value)}>
                    {POWER_METHODS['power.tTest'].types.map((x) => <option key={x} value={x}>{t(`tools.power.ttype.${keyPart(x)}`)}</option>)}
                  </select>
                </Field>
              ) : null}
              <div className="rs-formgrid">
                {wanted.map((k) => (
                  <Field key={k} label={label(k)} hint={t(`tools.power.hint.${k}`)} htmlFor={`rs-power-${k}`}>
                    <input id={`rs-power-${k}`} className="rs-input rs-num" inputMode="decimal" aria-invalid={parsed.bad.includes(k) || undefined} value={fields[k] ?? ''} onChange={(e) => setFields((x) => ({ ...x, [k]: e.target.value }))} />
                  </Field>
                ))}
                <Field label={t('tools.power.sigLevel')} htmlFor="rs-power-alpha">
                  <select id="rs-power-alpha" className="rs-select" value={String(sigLevel)} onChange={(e) => setSigLevel(Number(e.target.value))}>
                    {SIG_LEVELS.map((v) => <option key={v} value={String(v)}>{String(v)}</option>)}
                  </select>
                </Field>
              </div>
              <label className="rs-switch">
                <input type="checkbox" checked={farms} onChange={(e) => setFarms(e.target.checked)} />
                <span>{t('tools.power.farms')}</span>
              </label>
              {farms ? (
                <div className="rs-formgrid">
                  {DEFF_FIELDS.map((k) => (
                    <Field key={k} label={t(`tools.power.param.${k}`)} hint={t(`tools.power.hint.${k}`)} htmlFor={`rs-power-${k}`}>
                      <input id={`rs-power-${k}`} className="rs-input rs-num" inputMode="decimal" aria-invalid={parsed.bad.includes(k) || undefined} value={fields[k] ?? ''} onChange={(e) => setFields((x) => ({ ...x, [k]: e.target.value }))} />
                    </Field>
                  ))}
                </div>
              ) : null}
              {farms ? <p className="rs-soft rs-small">{t('tools.power.farmsHint')}</p> : null}
              {parsed.bad.length ? <p className="rs-small rs-rose-text" role="status">{t('tools.power.bad', { names: parsed.bad.map(label).join(', ') })}</p> : null}
              {missing.length && !parsed.bad.length ? <p className="rs-soft rs-small" role="status">{t('tools.power.need', { names: missing.map((k) => (DEFF_FIELDS.includes(k) ? t(`tools.power.param.${k}`) : label(k))).join(', ') })}</p> : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !ok || !cat?.shipped} onClick={run}>
                <Icon name="calc" size={18} />
                {t(`tools.power.run.${solveFor}`)}
              </button>
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              <Notice tone="warn">{t('tools.power.noPostHoc')}</Notice>
            </section>
            <section className="rs-analysis-result" aria-live="polite" aria-busy={busy || undefined}>
              {busy ? <Busy label={t('ws.analysis.running')} /> : null}
              <ErrorBox error={error} />
              {env && env.status === 'invalid' ? (
                <Notice tone="stop" title={t('tools.invalidTitle')}>
                  {Object.values(env.values || {}).filter((v) => v?.reasonKey).slice(0, 2).map((v, i) => <p key={i}>{t(v.reasonKey)}</p>)}
                  {!Object.values(env.values || {}).some((v) => v?.reasonKey) ? <p>{t('tools.power.invalidBody')}</p> : null}
                </Notice>
              ) : env ? (
                <ResultView envelope={env} title={t('tools.power.resultTitle')} caption={name(method)} paragraphs={false} primaryName={solveFor === 'n' ? 'n' : 'power'} headlineLabel={solveFor === 'n' ? t(`tools.power.headline.nUnit.${powerUnit(method, env.spec)}`) : t('tools.power.headline.power')} />
              ) : !busy ? <p className="rs-soft">{t('tools.power.empty')}</p> : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
