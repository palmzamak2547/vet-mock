// The diagnostics panel [M2-DESIGN.md 3.1.5, 10.2]: folded under a t-test or ANOVA result, it runs the
// Shapiro-Wilk check (with its Q-Q plot) and the Brown-Forsythe check on the same columns when the
// student opens it. It says in plain words that these checks never change the test: the choice of test
// comes from the design and the question, not from a p-value of a check. OWNER: ui-analysis role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { formatNumber } from '../../lib/stats/format.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { COMMON_OPTIONS, DEFAULT_OPTIONS } from '../../lib/runtime/spec.js';
import { useWs, errorInfo } from '../ws-context.js';
import { buildSpec } from '../lib/method-ui.js';
import { diagnosticChecks } from '../lib/diagnostics.js';
import { extraCharts } from '../lib/chart-inputs.js';
import { pText, testLabel, valueCells, valueLabel, valueRows } from '../lib/result-model.js';
import { Busy, ErrorBox } from './Bits.jsx';
import ChartSlot from './ChartSlot.jsx';
import { FMT } from './ResultView.jsx';

/**
 * @param {{ spec: any, table: any, codebook: any, steps: any[], datasetId: string, labelOf: (k: string) => string, onLog?: (what: object) => void }} props
 */
export default function DiagnosticsPanel({ spec, table, codebook, steps, datasetId, labelOf, onLog }) {
  const { t, lang } = useT();
  const { engine } = useWs();
  const [state, setState] = useState({ runs: null, busy: false, error: null });
  const checks = (diagnosticChecks(spec) || []).filter((c) => getMethod(c.method)?.shipped);
  if (!checks.length) return null;

  const runAll = async () => {
    if (state.runs || state.busy || !engine) return;
    setState({ runs: null, busy: true, error: null });
    try {
      const runs = [];
      for (const c of checks) {
        const s = buildSpec({
          method: c.method, datasetId, recipeRev: spec.input?.recipeRev ?? 0, design: spec.design,
          roles: c.roles, levels: {}, options: { ...COMMON_OPTIONS, ...(DEFAULT_OPTIONS[c.method] || {}), ...c.options, confLevel: spec.options?.confLevel ?? 0.95 },
          cluster: { route: null, column: spec.cluster?.column ?? null },
        });
        runs.push({ method: c.method, env: await engine.run(s, table, codebook, steps) });
      }
      setState({ runs, busy: false, error: null });
      onLog?.({ diagnostics: checks.map((c) => c.method) });
    } catch (err) {
      setState({ runs: null, busy: false, error: errorInfo(err) });
    }
  };

  return (
    <details className="rs-diag" onToggle={(e) => { if (e.currentTarget.open) runAll(); }}>
      <summary className="rs-diag-sum">{t('ws.diag.title')}</summary>
      <div className="rs-diag-body rs-stack">
        <p className="rs-small">{t('ws.diag.never')}</p>
        {state.busy ? <Busy label={t('ws.diag.running')} /> : null}
        <ErrorBox error={state.error} />
        {(state.runs || []).map(({ method, env }) => {
          const m = getMethod(method);
          const name = m ? t(m.nameKey) : method;
          if (env?.status !== 'ok') {
            return <p key={method} className="rs-soft rs-small">{t('ws.diag.notRun', { name })}</p>;
          }
          const rows = valueRows(env);
          return (
            <section key={method} className="rs-diag-item" aria-label={name}>
              <h4 className="rs-h3">{name}</h4>
              <div className="rs-tablewrap">
                <table className="rs-table rs-table--compact rs-num">
                  <caption className="rs-visually-hidden">{name}</caption>
                  <tbody>
                    {(env.tests || []).map((test) => (
                      <tr key={test.id}>
                        <th scope="row">{testLabel(test, t, { methodId: method, roles: env.spec?.roles, columnName: labelOf })}{test.p === null && test.reasonKey ? <div className="rs-soft rs-small">{t(test.reasonKey)}</div> : null}</th>
                        <td className="rs-r">
                          {test.statistic?.value === null || test.statistic?.value === undefined ? '—' : formatNumber(test.statistic.value, { kind: 'statistic' })}
                          {test.df !== null && test.df !== undefined ? <span className="rs-soft"> {t('ws.result.df', { df: formatNumber(test.df, { kind: 'statistic' }) })}</span> : null}
                        </td>
                        <td className="rs-r">{pText(FMT, test.p)}</td>
                      </tr>
                    ))}
                    {rows.map((r) => {
                      const c = valueCells(r, FMT, lang, t);
                      return (
                        <tr key={r.name}>
                          <th scope="row">{valueLabel(r.name, t, method)}{c.note ? <div className="rs-soft rs-small">{c.note}</div> : null}</th>
                          <td className="rs-r">{c.est}</td>
                          <td className="rs-r">{c.ci}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {extraCharts(env, labelOf).map((ch) => <ChartSlot key={ch.id} chart={ch} caption={name} />)}
            </section>
          );
        })}
      </div>
    </details>
  );
}
