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
import { ciLevelText, exportTable, fmtKind, pText, plottable, primaryValueName, testLabel, valueCells, valueLabel, valueRows } from '../lib/result-model.js';
import { keyPart } from '../lib/keys.js';
import { safeFileBase } from '../lib/files.js';
import { useWs, errorInfo } from '../ws-context.js';
import { Notice, VerifiedBadge } from './Bits.jsx';
import CiPlot from './CiPlot.jsx';
import Paragraphs from './Paragraphs.jsx';
import { methodsSentence, resultsSentence } from '../report/build.js';
import { copyParagraph } from '../lib/clipboard.js';
import Icon from './Icon.jsx';

export { safeFileBase };
export const FMT = { formatNumber, formatP, formatCi };

const hasKey = (t, key) => t(key) !== `[${key}]`;
/** Tables longer than this are folded under a summary line. */
const FOLD_ROWS = 12;


/**
 * A guardrail finding: epi findings carry a title key and a body key; other findings (runtime notes)
 * carry one sentence in `key`.
 */
export function guardText(g, t) {
  // G25 names only the steps this sample size still misses (review round 2: the whole list was shown
  // right after the design effect had been applied).
  if (g.id === 'G25' && Array.isArray(g.params?.missing) && g.params.missing.length) {
    return { title: t(g.key, g.params), body: g.params.missing.map((m) => t(`epi.guard.G25.step.${m}`)).join(' ') };
  }
  if (g.bodyKey) return { title: t(g.key, g.params), body: t(g.bodyKey, g.params) };
  const titleKey = `epi.guard.${g.id}.title`;
  return { title: g.key !== titleKey && hasKey(t, titleKey) ? t(titleKey, g.params) : undefined, body: t(g.key, g.params) };
}

function GuardList({ items, tone }) {
  const { t } = useT();
  if (!items?.length) return null;
  return items.map((g) => {
    const x = guardText(g, t);
    return <Notice key={`${g.id}-${g.key}`} tone={tone} title={x.title}>{x.body}</Notice>;
  });
}

/**
 * A word a method table carries (a column name such as 'unrounded', a step id such as 'fpc', or a
 * dictionary key such as 'epi.ss.formula.base'): the dictionary's text when it has one, else the
 * word itself (level names and farm ids are data, shown as they are).
 */
export function tableWord(word, t, group) {
  const s = String(word);
  if (hasKey(t, s)) return t(s);
  const k = `ws.${group}.${keyPart(s)}`;
  return hasKey(t, k) ? t(k) : s;
}

/** Text of a table the method returned: numbers through the stats formatter, words through the dictionary. */
export function envTableText(table, t) {
  const columns = table.columns.map((c) => tableWord(c, t, 'col'));
  const rows = table.rows.map((row) => row.map((cell) => {
    if (cell === null || cell === undefined) return '—';
    if (typeof cell === 'number') return Number.isFinite(cell) ? formatNumber(cell, { kind: Number.isInteger(cell) ? 'count' : 'statistic' }) : cell > 0 ? t('ws.result.noUpper') : t('ws.result.noLower');
    return tableWord(cell, t, 'cell');
  }));
  const capKey = `ws.table.${keyPart(table.id)}`;
  // A dash in a cell is explained under the table, and the 2x2 cell letters are named (review round 1).
  const notes = [];
  if (['a', 'b', 'c', 'd'].every((c) => table.columns.includes(c))) notes.push(t('ws.table.abcdLegend'));
  if (rows.some((row) => row.slice(1).includes('—'))) notes.push(t('ws.table.dashNote'));
  return { columns, rows, caption: hasKey(t, capKey) ? t(capKey) : table.id, notes };
}

export function EnvTable({ table, note = '', fileBase = 'table', onDownloaded }) {
  const { t } = useT();
  const { notify } = useWs();
  const tx = envTableText(table, t);
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
 */
function ResultParagraphs({ env, designRow, codebook, onDownloaded }) {
  const { t } = useT();
  const { notify } = useWs();
  const paras = useMemo(() => {
    if (!env || env.status !== 'ok') return null;
    const analysis = { spec: env.spec, envelope: env };
    const nameKeyOf = (id) => getMethod(id)?.nameKey || null;
    const make = (lg) => {
      const tl = (k, params) => translate(lg, k, params);
      const has = (k) => tl(k) !== `[${k}]`;
      const columnName = (key) => {
        const c = codebook?.columns?.find((x) => x.key === key);
        if (!c) return key;
        return (lg === 'en' ? c.labelEn || c.name : c.labelTh || c.name) || key;
      };
      const valueLabel = (name) => {
        for (const k of [`ws.value.${keyPart(env.method?.id || '')}.${name}`, `ws.value.${name}`]) if (has(k)) return tl(k);
        return name;
      };
      try {
        return {
          methods: methodsSentence(analysis, { t: tl, lang: lg, nameKeyOf, columnName }),
          results: resultsSentence(analysis, { t: tl, fmt: FMT, lang: lg, nameKeyOf, designRow, valueLabel }),
        };
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
 * @param {{ envelope: any, title?: string, designRow?: any, extraRows?: any[], onSnapshot?: (() => void) | null, onDownloaded?: (kind: string) => void, headlineLabel?: string, children?: any, stale?: boolean }} props
 */
export default function ResultView({ envelope, title, designRow = null, extraRows = [], onSnapshot = null, onDownloaded, headlineLabel, children = null, stale = false, hideTables = false, labelOf, codebook = null, paragraphs = true, primaryName = null, primaryPlotLabel }) {
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
  const caption = title || methodName;
  const note = lines.join(' ');
  const fileBase = safeFileBase(`${caption}`);

  const copy = async () => {
    try {
      const how = await copyTable(exportTable(env, { t, fmt: FMT, lang, caption, note, primary }));
      notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.table', {}, how === 'failed' ? 'error' : 'ok');
      if (how !== 'failed') onDownloaded?.('clipboard');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const csv = () => {
    try {
      const text = tableToCsv(exportTable(env, { t, fmt: FMT, lang, caption, note, primary }));
      download(new Blob([text], { type: 'text/csv;charset=utf-8' }), `${fileBase}.csv`);
      onDownloaded?.('csv');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };

  if (!env) return null;
  const tests = env.tests || [];
  // The third column holds intervals and p-values; a result with neither (a sample size) has no such column.
  const thirdCol = tests.length > 0 || rows.some((r) => Array.isArray(r.ci));
  return (
    <section className="rs-result" aria-label={caption}>
      <div className="rs-result-head">
        <div className="rs-grow">
          <h2 className="rs-h2">{caption}</h2>
          {title && methodName ? <p className="rs-soft">{methodName}</p> : null}
        </div>
        <VerifiedBadge show={Boolean(env.verified)} />
      </div>
      {stale ? <Notice tone="warn" title={t('ws.result.staleTitle')}>{t('ws.result.staleBody')}</Notice> : null}
      {env.status === 'invalid' ? <Notice tone="stop" title={t('ws.result.invalidTitle')}><GuardList items={env.guard?.stops} tone="stop" />{t('ws.result.invalidBody')}</Notice> : null}
      {env.status === 'stopped' ? <GuardList items={env.guard?.stops} tone="stop" /> : null}

      {head ? (
        <div className="rs-headline">
          <div className="rs-eyebrow">{headlineLabel || valueLabel(head.name, t, env?.method?.id)}</div>
          {head.value === null || head.value === undefined ? (
            <>
              <div className="rs-bignum rs-num" aria-hidden="true">—</div>
              <p>{head.reasonKey ? t(head.reasonKey) : t('ws.result.undefinedNoReason')}</p>
            </>
          ) : (
            <div className="rs-headline-row">
              <span className="rs-bignum rs-num">{formatNumber(head.value, { kind: fmtKind(head.kind) })}</span>
              {head.ci ? <span className="rs-ci rs-num">{t('ws.result.ciInline', { level, ci: valueCells(head, FMT, lang, t).ci })}</span> : null}
            </div>
          )}
          {tests[0] ? (
            <p className="rs-num">
              {tests[0].p === null || tests[0].p === undefined
                ? t('ws.result.pWithheld')
                : t('ws.result.pLine', { p: pText(FMT, tests[0].p), test: testLabel(tests[0], t) })}
            </p>
          ) : null}
        </div>
      ) : null}

      {rows.length || tests.length ? (
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
                  <th scope="row">{testLabel(test, t)}{test.p === null && test.reasonKey ? <div className="rs-soft rs-small">{t(test.reasonKey)}</div> : null}</th>
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

      {items.length ? <CiPlot items={items} log={plot.log} refValue={plot.ref} percent={plot.rows[0]?.kind === 'proportion'} title={caption} fileBase={fileBase} onDownloaded={onDownloaded} levelText={level} /> : null}

      <GuardList items={env.guard?.warnings} tone="warn" />
      <GuardList items={env.guard?.notes} tone="info" />
      {hideTables ? null : (env.tables || []).map((tb) => (
        // A long table (a stratum per farm) is folded under a one-line summary, so the estimate and
        // the paragraphs are not pushed a screen away (review round 2: 49 strata rows, 4374 px).
        (tb.rows?.length || 0) > FOLD_ROWS ? (
          <details key={tb.id} className="rs-foldtable">
            <summary>{t('ws.table.folded', { caption: envTableText(tb, t).caption, n: tb.rows.length })}</summary>
            <EnvTable table={tb} note={note} fileBase={fileBase} onDownloaded={onDownloaded} />
          </details>
        ) : <EnvTable key={tb.id} table={tb} note={note} fileBase={fileBase} onDownloaded={onDownloaded} />
      ))}
      {children}

      {paragraphs ? <ResultParagraphs env={env} designRow={designRow} codebook={codebook} onDownloaded={onDownloaded} /> : null}

      <div className="rs-prov">
        {lines.map((l, i) => <p key={i} className="rs-prov-line">{l}</p>)}
        <details className="rs-prov-more">
          <summary>{t('ws.result.allOptions')}</summary>
          <dl className="rs-deflist">
            {Object.entries(env.provenance?.options || env.spec?.options || {}).map(([k, v]) => (
              <div key={k} className="rs-defrow">
                <dt>{hasKey(t, `ws.opt.${keyPart(k)}.label`) ? t(`ws.opt.${keyPart(k)}.label`) : k}</dt>
                <dd className="rs-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>

      <div className="rs-row-wrap">
        {rows.length || tests.length ? (
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
