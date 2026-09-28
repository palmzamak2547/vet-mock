// One result [M1-DESIGN.md 10, 14, 17]: the method and its verified badge (only when the method is
// pinned by fixtures), the headline estimate with its interval, then p; the values and tests table;
// the CI plot with its data table; warnings and notes from the guardrails; any tables the method
// returns; the provenance line with every option one tap away; copy to Word, CSV, chart downloads,
// and "keep this result". Everything is read from the envelope; nothing is typed. OWNER: workspace role.
import { useMemo } from 'react';
import { useT, translate } from '../../i18n/index.js';
import { formatCi, formatNumber, formatP } from '../../lib/stats/format.js';
import { provenanceLines } from '../../lib/runtime/provenance.js';
import { copyTable, download, tableToCsv } from '../../lib/runtime/export.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { ciLevelText, exportTable, pText, plottable, primaryValueName, testLabel, valueCells, valueLabel, valueRows } from '../lib/result-model.js';
import { safeFileBase } from '../lib/files.js';
import { useWs, errorInfo } from '../ws-context.js';
import { Notice, VerifiedBadge } from './Bits.jsx';
import CiPlot from './CiPlot.jsx';
import Paragraphs from './Paragraphs.jsx';
import { columnNameFor, levelNameFor, resultParagraphs } from '../report/build.js';
import { envTableText, guardText, optionItems, tableWord } from '../report/result-words.js';
import { copyParagraph } from '../lib/clipboard.js';
import Icon from './Icon.jsx';

export { safeFileBase, envTableText, guardText, tableWord };
export const FMT = { formatNumber, formatP, formatCi };

const hasKey = (t, key) => t(key) !== `[${key}]`;
/** Tables longer than this are folded under a summary line. */
const FOLD_ROWS = 12;

function GuardList({ items, tone }) {
  const { t } = useT();
  if (!items?.length) return null;
  return items.map((g) => {
    const x = guardText(g, t);
    return <Notice key={`${g.id}-${g.key}`} tone={tone} title={x.title}>{x.body}</Notice>;
  });
}

/**
 * @param {{ table: any, note?: string, fileBase?: string, onDownloaded?: (kind: string) => void, words?: any }} props
 * `words` names what the table was made from (spec, codebook), so a 2x2 table is labelled with its own levels.
 */
export function EnvTable({ table, note = '', fileBase = 'table', onDownloaded, words = {} }) {
  const { t } = useT();
  const { notify } = useWs();
  const tx = envTableText(table, t, words);
  const copy = async () => {
    try {
      const how = await copyTable({ caption: tx.caption, columns: tx.columns, rows: tx.rows, note: [...tx.notes, note].filter(Boolean).join(' ') });
      notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.table', {}, how === 'failed' ? 'error' : 'ok');
      if (how !== 'failed') onDownloaded?.('clipboard');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const csv = () => {
    try {
      const noteRows = tx.notes.map((n) => [n, ...tx.columns.slice(1).map(() => '')]);
      download(new Blob([tableToCsv({ columns: tx.columns, rows: [...tx.rows, ...noteRows] })], { type: 'text/csv;charset=utf-8' }), `${safeFileBase(`${fileBase}-${table.id}`)}.csv`);
      onDownloaded?.('csv');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  return (
    <div className="rs-envtable">
      <div className="rs-tablewrap">
        <table className="rs-table rs-num">
          <caption className="rs-table-cap">{tx.caption}</caption>
          <thead><tr>{tx.columns.map((h, i) => <th key={i} scope="col" className={i ? 'rs-r' : ''}>{h}</th>)}</tr></thead>
          <tbody>
            {tx.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((text, ci) => (ci === 0 ? <th key={ci} scope="row">{text}</th> : <td key={ci} className="rs-r">{text}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tx.notes.map((n, i) => <p key={i} className="rs-soft rs-small">{n}</p>)}
      <div className="rs-row-wrap">
        <button type="button" className="rs-btn rs-btn--sm" onClick={copy}><Icon name="copy" size={16} />{t('ws.action.copyWord')}</button>
        <button type="button" className="rs-btn rs-btn--sm" onClick={csv}><Icon name="down" size={16} />{t('ws.action.downloadCsv')}</button>
      </div>
    </div>
  );
}

/**
 * This result's methods and results sentences in Thai and English, built by the same functions the
 * Report draft uses (report/build.js), so the words under a result are the words the report will say.
 * Columns are named from the codebook, as the report names them (review round 3: the column key c13 in a sentence).
 */
function ResultParagraphs({ env, designRow, codebook, onDownloaded }) {
  const { t } = useT();
  const { notify } = useWs();
  const paras = useMemo(() => {
    if (!env || env.status !== 'ok') return null;
    const nameKeyOf = (id) => getMethod(id)?.nameKey || null;
    const make = (lg) => {
      try {
        return resultParagraphs(env, { t: (k, params) => translate(lg, k, params), fmt: FMT, lang: lg, codebook, designRow, nameKeyOf });
      } catch {
        return { methods: '', results: '' };
      }
    };
    return { th: make('th'), en: make('en') };
  }, [env, designRow, codebook]);
  if (!paras) return null;
  const copy = async (text, lg) => {
    const how = await copyParagraph(text, { lang: lg });
    notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.paragraph', {}, how === 'failed' ? 'error' : 'ok');
    if (how !== 'failed') onDownloaded?.('paragraph-clipboard');
  };
  return (
    <section className="rs-result-paras" aria-label={t('ws.result.parasTitle')} data-testid="result-paragraphs">
      <h3 className="rs-h3">{t('ws.result.parasTitle')}</h3>
      <Paragraphs label={t('ws.report.methods')} th={paras.th.methods} en={paras.en.methods} onCopy={copy} />
      <Paragraphs label={t('ws.report.results')} th={paras.th.results} en={paras.en.results} onCopy={copy} />
    </section>
  );
}

/**
 * @param {{ envelope: any, title?: string, caption?: string, designRow?: any, extraRows?: any[], onSnapshot?: (() => void) | null, onDownloaded?: (kind: string) => void, headlineLabel?: string, children?: any, afterPlot?: any, stale?: boolean }} props
 * `title` is the heading; the method's name is shown under it only when it says something the heading
 * does not (review round 3: the prevalence method name printed as both heading and subtitle). `caption` names the copied
 * table and the downloaded files (the heading by default). `afterPlot` sits under the headline, the
 * table and the CI plot, where the board puts an explanation of the result. `hidePlot` leaves the CI plot
 * out when a chart below the result already draws the same intervals (a forest plot of a model's ratios).
 */
export default function ResultView({ envelope, title, caption: captionProp = '', designRow = null, extraRows = [], onSnapshot = null, onDownloaded, headlineLabel, children = null, afterPlot = null, stale = false, hideTables = false, labelOf, codebook = null, paragraphs = true, primaryName = null, primaryPlotLabel, hidePlot = false }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const env = envelope;
  const method = env?.method?.id ? getMethod(env.method.id) : null;
  const methodName = method && hasKey(t, method.nameKey) ? t(method.nameKey) : env?.method?.id;
  // The headline is the answer: a screen may name it (the sample size needed, not the first value).
  const primary = primaryName && env?.values?.[primaryName] ? primaryName : primaryValueName(env, designRow);
  const rows = useMemo(() => valueRows(env, primary), [env, primary]);
  const head = rows.find((r) => r.name === primary);
  const level = ciLevelText(env);
  const plot = useMemo(() => plottable(env, primary), [env, primary]);
  const items = [...extraRows, ...plot.rows.map((r) => {
    const c = valueCells(r, FMT, lang, t);
    return { label: r.name === primary && primaryPlotLabel ? primaryPlotLabel : valueLabel(r.name, t, env?.method?.id), est: r.value, lo: r.ci?.[0] ?? null, hi: r.ci?.[1] ?? null, estText: c.est, ciText: c.ci };
  })];
  let lines = [];
  try { lines = provenanceLines(env, lang, t, labelOf); } catch { lines = []; }
  const heading = title || methodName;
  const caption = captionProp || heading;
  const note = lines.join(' ');
  const fileBase = safeFileBase(`${caption}`);
  const columnName = labelOf || columnNameFor(codebook, lang);
  const words = { spec: env?.spec || null, codebook, columnName, levelName: levelNameFor(codebook, lang) };
  const options = useMemo(() => (env ? optionItems(env, t, { columnName, lang }) : []), [env, t, columnName, lang]);
  // A model's effects are named by the student's own columns ("breed x diet"), not by a letter.
  const testCtx = { methodId: env?.method?.id || null, roles: env?.spec?.roles || null, columnName };

  const copy = async () => {
    try {
      const how = await copyTable(exportTable(env, { t, fmt: FMT, lang, caption, note, primary, columnName }));
      notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.table', {}, how === 'failed' ? 'error' : 'ok');
      if (how !== 'failed') onDownloaded?.('clipboard');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const csv = () => {
    try {
      const text = tableToCsv(exportTable(env, { t, fmt: FMT, lang, caption, note, primary, columnName }));
      download(new Blob([text], { type: 'text/csv;charset=utf-8' }), `${fileBase}.csv`);
      onDownloaded?.('csv');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };

  if (!env) return null;
  const tests = env.tests || [];
  // The third column holds intervals and p-values; a result with neither (a sample size) has no such column.
  const thirdCol = tests.length > 0 || rows.some((r) => Array.isArray(r.ci));
  // A result that only counts (Table 1: rows described, farms) has no answer to lead with; its counts
  // stay in the table instead of a headline that the table repeats (review round 3).
  const countsOnly = rows.length > 0 && !tests.length && rows.every((r) => r.kind === 'count' && !Array.isArray(r.ci));
  const lead = countsOnly ? null : head;
  // A table that would only repeat the headline's one value is left out, and so are its copy buttons.
  const valuesTable = (rows.length || tests.length) && !(lead && rows.length === 1 && !tests.length);
  return (
    <section className="rs-result" aria-label={caption}>
      <div className="rs-result-head">
        <div className="rs-grow">
          <h2 className="rs-h2">{heading}</h2>
          {/* The method name shows only when it says something the title does not (review round 3). */}
          {title && methodName && !title.includes(methodName) && !methodName.includes(title) ? <p className="rs-soft">{methodName}</p> : null}
        </div>
        <VerifiedBadge show={Boolean(env.verified)} />
      </div>
      {stale ? <Notice tone="warn" title={t('ws.result.staleTitle')}>{t('ws.result.staleBody')}</Notice> : null}
      {env.status === 'invalid' ? <Notice tone="stop" title={t('ws.result.invalidTitle')}><GuardList items={env.guard?.stops} tone="stop" />{t('ws.result.invalidBody')}</Notice> : null}
      {env.status === 'stopped' ? <GuardList items={env.guard?.stops} tone="stop" /> : null}

      {lead ? (
        <div className="rs-headline">
          <div className="rs-eyebrow">{headlineLabel || valueLabel(head.name, t, env?.method?.id)}</div>
          {head.value === null || head.value === undefined ? (
            <>
              <div className="rs-bignum rs-num" aria-hidden="true">—</div>
              <p>{head.reasonKey ? t(head.reasonKey) : t('ws.result.undefinedNoReason')}</p>
            </>
          ) : (
            <div className="rs-headline-row">
              <span className="rs-bignum rs-num">{valueCells(head, FMT, lang, t).est}</span>
              {head.ci ? <span className="rs-ci rs-num">{t('ws.result.ciInline', { level, ci: valueCells(head, FMT, lang, t).ci })}</span> : null}
            </div>
          )}
          {tests[0] ? (
            <p className="rs-num">
              {tests[0].p === null || tests[0].p === undefined
                ? t('ws.result.pWithheld')
                : t('ws.result.pLine', { p: pText(FMT, tests[0].p), test: testLabel(tests[0], t, testCtx) })}
            </p>
          ) : null}
        </div>
      ) : null}

      {valuesTable ? (
        <div className="rs-tablewrap">
          <table className="rs-table rs-num">
            <caption className="rs-table-cap">{t('ws.result.valuesCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('ws.result.col.measure')}</th>
                <th scope="col" className="rs-r">{t('ws.result.col.estimate')}</th>
                {thirdCol ? <th scope="col" className="rs-r">{t('ws.result.col.ci', { level })}</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const c = valueCells(r, FMT, lang, t);
                return (
                  <tr key={r.name}>
                    <th scope="row">{valueLabel(r.name, t, env?.method?.id)}{c.note ? <div className="rs-soft rs-small">{c.note}</div> : null}</th>
                    <td className="rs-r">{c.est}</td>
                    {thirdCol ? <td className="rs-r">{c.ci}</td> : null}
                  </tr>
                );
              })}
              {tests.map((test) => (
                <tr key={test.id}>
                  <th scope="row">{testLabel(test, t, testCtx)}{test.p === null && test.reasonKey ? <div className="rs-soft rs-small">{t(test.reasonKey)}</div> : null}</th>
                  <td className="rs-r">
                    {test.statistic?.value === null || test.statistic?.value === undefined ? '—' : formatNumber(test.statistic.value, { kind: 'statistic' })}
                    {test.df !== null && test.df !== undefined ? <span className="rs-soft"> {t('ws.result.df', { df: formatNumber(test.df, { kind: 'statistic' }) })}</span> : null}
                  </td>
                  <td className="rs-r">{pText(FMT, test.p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {items.length && !hidePlot ? <CiPlot items={items} log={plot.log} refValue={plot.ref} percent={plot.rows[0]?.kind === 'proportion'} title={caption} fileBase={fileBase} onDownloaded={onDownloaded} levelText={level} /> : null}
      {afterPlot}

      <GuardList items={env.guard?.warnings} tone="warn" />
      <GuardList items={env.guard?.notes} tone="info" />
      {hideTables ? null : (env.tables || []).map((tb) => (
        // A long table (a stratum per farm) is folded under a one-line summary, so the estimate and
        // the paragraphs are not pushed a screen away (review round 2: 49 strata rows, 4374 px).
        (tb.rows?.length || 0) > FOLD_ROWS ? (
          <details key={tb.id} className="rs-foldtable">
            <summary>{t('ws.table.folded', { caption: envTableText(tb, t, words).caption, n: tb.rows.length })}</summary>
            <EnvTable table={tb} note={note} fileBase={fileBase} onDownloaded={onDownloaded} words={words} />
          </details>
        ) : <EnvTable key={tb.id} table={tb} note={note} fileBase={fileBase} onDownloaded={onDownloaded} words={words} />
      ))}
      {children}

      {paragraphs ? <ResultParagraphs env={env} designRow={designRow} codebook={codebook} onDownloaded={onDownloaded} /> : null}

      <div className="rs-prov">
        {lines.map((l, i) => <p key={i} className="rs-prov-line">{l}</p>)}
        {options.length ? (
          <details className="rs-prov-more">
            <summary>{t('ws.result.allOptions')}</summary>
            <dl className="rs-deflist">
              {options.map((o) => (
                <div key={o.name} className="rs-defrow">
                  <dt>{o.label}</dt>
                  <dd>{o.text}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : null}
      </div>

      <div className="rs-row-wrap">
        {valuesTable ? (
          <>
            <button type="button" className="rs-btn" onClick={copy}>
              <Icon name="copy" size={18} />
              {t('ws.action.copyWord')}
            </button>
            <button type="button" className="rs-btn" onClick={csv}>
              <Icon name="down" size={18} />
              {t('ws.action.downloadCsv')}
            </button>
          </>
        ) : null}
        {onSnapshot ? (
          <button type="button" className="rs-btn" onClick={onSnapshot}>
            <Icon name="mark" size={18} />
            {t('ws.action.snapshot')}
          </button>
        ) : null}
      </div>
    </section>
  );
}
