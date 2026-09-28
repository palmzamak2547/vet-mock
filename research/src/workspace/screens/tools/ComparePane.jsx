// Double-entry check: a second typing of the same forms, every differing cell listed and settled as a cell
// edit [M2-DESIGN.md 4.6]. Cells are compared as typed (after spaces and invisible characters are
// cleaned, before any conversion), so "1.0" against "1" shows. Columns are paired by header text. Each
// difference is settled against the paper form: keep what this file has, or take the second typing's
// value as a cell edit whose reason names the form. The log records the counts only, never a value.
// Columns are keyed by their raw keys (c1, c2, ..), as lib/intake/double-entry.js reads them, and shown by
// their codebook labels in the page language.
// OWNER: ui-tools role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { compareEntries, differencesToCsv, pairColumnsByName } from '../../../lib/intake/double-entry.js';
import { keyForIndex } from '../../../lib/intake/infer.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { download } from '../../../lib/runtime/export.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { ErrorBox, Field, Notice, PageHead } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { rawColumnIndex } from '../../lib/grid-model.js';
import { safeFileBase } from '../../lib/files.js';
import { IdList, SecondFile } from './ToolBits.jsx';
import { colLabel } from './tools-model.js';
import { levelNameFor } from '../../report/build.js';

const SHOW = 200;

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const [otherId, setOtherId] = useState(null);
  const other = (p.others || []).find((o) => o.meta.id === otherId) || null;
  const headerA = p.raw?.header || [];
  const headerB = other?.raw?.header || [];
  const [keyA, setKeyA] = useState('');
  const [keyB, setKeyB] = useState('');
  const [result, setResult] = useState(null);
  const [settled, setSettled] = useState(() => new Set());
  const [form, setForm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (otherId || !(p.others || []).length) return;
    const first = p.others.find((o) => o.meta.purpose === 'double-entry') || p.others.find((o) => !o.meta.purpose || o.meta.purpose === 'main');
    if (first) setOtherId(first.meta.id);
  }, [p.others, otherId]);

  // First guess: this file's id column, and the column of the same header in the second typing.
  useEffect(() => {
    if (!other) return;
    const cbA = p.meta.codebook;
    const idA = cbA.columns.find((c) => c.type === 'id') || cbA.columns[0];
    const ia = idA ? rawColumnIndex(cbA, p.raw).get(idA.key) ?? 0 : 0;
    const ib = headerB.indexOf(headerA[ia]);
    setKeyA(keyForIndex(ia));
    setKeyB(keyForIndex(ib >= 0 ? ib : 0));
    setResult(null);
  }, [other?.meta.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const pairing = useMemo(() => (other && keyA && keyB ? pairColumnsByName(p.raw, other.raw, keyA, keyB) : null), [p.raw, other, keyA, keyB]);
  useEffect(() => { setResult(null); }, [keyA, keyB, otherId]);

  const run = () => {
    setError(null);
    try {
      const res = compareEntries(p.raw, other.raw, { keyA, keyB });
      setResult(res);
      setSettled(new Set());
      p.log('compare', { datasetId: other.meta.id, rowsCompared: res.rowsCompared, cellsCompared: res.cellsCompared, differences: res.cellsDiffering, onlyInA: res.onlyInA.length, onlyInB: res.onlyInB.length, duplicateKeys: res.duplicateKeys.a.length + res.duplicateKeys.b.length });
    } catch (err) {
      setError(errorInfo(err));
    }
  };

  // Raw column key (c1..) -> this file's codebook key, for the cell edit.
  const codebookKeyOf = useMemo(() => {
    const out = new Map();
    for (const [key, i] of rawColumnIndex(p.meta.codebook, p.raw)) out.set(keyForIndex(i), key);
    return out;
  }, [p.meta.codebook, p.raw]);

  const takeB = async (d) => {
    const column = codebookKeyOf.get(d.column);
    if (!column) { notify('tools.compare.noColumn', {}, 'error'); return; }
    let step;
    try { step = makeStep(steps, 'cell-edit', { rowId: d.rowIdA, column, from: d.a, to: d.b }, form.trim()); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const ok = await p.commitSteps([...steps, step], { step: 'cell-edit', stepId: step.id, source: 'double-entry' });
    if (ok) { setSettled((s) => new Set(s).add(`${d.key}|${d.column}`)); notify('tools.compare.taken', {}, 'ok'); }
  };
  const keepA = (d) => setSettled((s) => new Set(s).add(`${d.key}|${d.column}`));

  const csv = () => {
    const text = differencesToCsv(result, { key: t('tools.compare.key'), rowA: t('tools.compare.rowA'), rowB: t('tools.compare.rowB'), column: t('tools.column'), a: t('tools.compare.valueA'), b: t('tools.compare.valueB') });
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const name = `${safeFileBase(`${p.project?.name || 'project'}-${t('tools.compare.fileWord')}`)}.csv`;
    download(blob, name);
    p.log('download', { what: 'csv', format: 'csv', fileName: name, bytes: blob.size });
  };

  const open = (result?.differences || []).filter((d) => !settled.has(`${d.key}|${d.column}`));
  const dup = result ? result.duplicateKeys.a.length + result.duplicateKeys.b.length : 0;
  const blanks = result ? result.blankKeys.a.length + result.blankKeys.b.length : 0;
  // Columns and values by the codebook's words in the page language, the file header in brackets when it
  // differs (review round 3: the pickers and the table printed raw headers and raw Thai values in English).
  const rawToCodebook = (codebook, raw) => {
    const m = new Map();
    for (const [key, i] of rawColumnIndex(codebook, raw)) m.set(keyForIndex(i), codebook.columns.find((c) => c.key === key));
    return m;
  };
  const colsA = useMemo(() => rawToCodebook(p.meta.codebook, p.raw), [p.meta.codebook, p.raw]);
  const colsB = useMemo(() => (other ? rawToCodebook(other.meta.codebook, other.raw) : new Map()), [other]);
  const nameIn = (cols, header, rawKey) => {
    const c = cols.get(rawKey);
    const label = c ? colLabel(c, lang) : '';
    const h = header[Number(rawKey.slice(1)) - 1] ?? rawKey;
    return label && label !== h ? `${label} (${h})` : h;
  };
  const levelOf = levelNameFor(p.meta.codebook, lang);
  const valueCell = (rawKey, v) => {
    if (v === '') return <span className="rs-soft">{t('tools.blankValue')}</span>;
    const key = colsA.get(rawKey)?.key;
    const shown = key ? levelOf(key, v) : v;
    return shown === v ? v : <>{shown} <span className="rs-soft rs-mono">({v})</span></>;
  };

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.compare.title')} sub={t('tools.compare.sub')} />
      <SecondFile p={p} purpose="double-entry" value={otherId} onChange={setOtherId} />
      <ErrorBox error={error} />
      {other && otherId !== 'new' ? (
        <>
          <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-cmp-set">
            <h2 id="rs-h-cmp-set" className="rs-h3">{t('tools.compare.setTitle')}</h2>
            <div className="rs-formgrid">
              <Field label={t('tools.compare.keyA')} htmlFor="rs-cmp-ka">
                <select id="rs-cmp-ka" className="rs-select" value={keyA} onChange={(e) => setKeyA(e.target.value)}>
                  {headerA.map((h, i) => <option key={i} value={keyForIndex(i)}>{nameIn(colsA, headerA, keyForIndex(i))}</option>)}
                </select>
              </Field>
              <Field label={t('tools.compare.keyB', { file: other.meta.source?.fileName || '' })} htmlFor="rs-cmp-kb">
                <select id="rs-cmp-kb" className="rs-select" value={keyB} onChange={(e) => setKeyB(e.target.value)}>
                  {headerB.map((h, i) => <option key={i} value={keyForIndex(i)}>{nameIn(colsB, headerB, keyForIndex(i))}</option>)}
                </select>
              </Field>
            </div>
            {pairing ? <p className="rs-small">{t('tools.compare.pairs', { n: pairing.pairs.length })}</p> : null}
            {pairing?.onlyA.length ? (
              <div>
                <p className="rs-soft rs-small">{t('tools.compare.unpaired', { n: pairing.onlyA.length })}</p>
                <IdList items={pairing.onlyA.map((k) => nameIn(colsA, headerA, k))} />
              </div>
            ) : null}
            <button type="button" className="rs-btn rs-btn--primary" disabled={!keyA || !keyB || !pairing?.pairs.length} onClick={run}>
              <Icon name="search" size={18} />
              {t('tools.compare.run')}
            </button>
          </section>
          {result ? (
            <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-cmp-res" aria-live="polite">
              <h2 id="rs-h-cmp-res" className="rs-h3">{t('tools.compare.resultTitle')}</h2>
              <dl className="rs-deflist">
                <div className="rs-defrow"><dt>{t('tools.compare.rows')}</dt><dd className="rs-num">{result.rowsCompared.toLocaleString('en-US')}</dd></div>
                <div className="rs-defrow"><dt>{t('tools.compare.cells')}</dt><dd className="rs-num">{result.cellsCompared.toLocaleString('en-US')}</dd></div>
                <div className="rs-defrow"><dt>{t('tools.compare.differences')}</dt><dd className="rs-num">{result.cellsDiffering.toLocaleString('en-US')}</dd></div>
                <div className="rs-defrow"><dt>{t('tools.compare.open')}</dt><dd className="rs-num">{open.length.toLocaleString('en-US')}</dd></div>
              </dl>
              {result.onlyInA.length ? <div><p className="rs-small">{t('tools.compare.onlyInA', { n: result.onlyInA.length })}</p><IdList items={result.onlyInA} /></div> : null}
              {result.onlyInB.length ? <div><p className="rs-small">{t('tools.compare.onlyInB', { n: result.onlyInB.length })}</p><IdList items={result.onlyInB} /></div> : null}
              {dup ? (
                <Notice tone="warn" title={t('tools.compare.dupTitle', { n: dup })}>
                  <IdList items={[...result.duplicateKeys.a, ...result.duplicateKeys.b]} />
                </Notice>
              ) : null}
              {blanks ? <p className="rs-soft rs-small">{t('tools.compare.blankKeys', { n: blanks })}</p> : null}
              {result.differences.length === 0 ? <Notice tone="ok">{t('tools.compare.none')}</Notice> : (
                <>
                  <button type="button" className="rs-btn rs-btn--sm" onClick={csv}><Icon name="down" size={16} />{t('tools.compare.download')}</button>
                  <Field label={t('tools.compare.form')} hint={t('tools.compare.formHint')} htmlFor="rs-cmp-form">
                    <input id="rs-cmp-form" className="rs-input" value={form} maxLength={200} onChange={(e) => setForm(e.target.value)} />
                  </Field>
                  <div className="rs-tablewrap">
                    <table className="rs-table rs-table--compact">
                      <caption className="rs-table-cap">{t('tools.compare.caption', { n: open.length.toLocaleString('en-US') })}</caption>
                      <thead>
                        <tr>
                          <th scope="col">{t('tools.compare.key')}</th>
                          <th scope="col">{t('tools.column')}</th>
                          <th scope="col">{t('tools.compare.valueA')}</th>
                          <th scope="col">{t('tools.compare.valueB')}</th>
                          <th scope="col"><span className="rs-visually-hidden">{t('tools.clean.action')}</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {open.slice(0, SHOW).map((d) => (
                          <tr key={`${d.key}|${d.column}`}>
                            <th scope="row" className="rs-mono">{d.key}</th>
                            <td>{nameIn(colsA, headerA, d.column)}</td>
                            <td>{valueCell(d.column, d.a)}</td>
                            <td>{valueCell(d.column, d.b)}</td>
                            <td>
                              <div className="rs-row-wrap">
                                <button type="button" className="rs-btn rs-btn--sm" onClick={() => keepA(d)}>{t('tools.compare.keepA')}</button>
                                <button type="button" className="rs-btn rs-btn--sm" disabled={!form.trim() || p.busy} onClick={() => takeB(d)}>{t('tools.compare.takeB')}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {open.length > SHOW ? <p className="rs-soft rs-small">{t('tools.andMore', { n: (open.length - SHOW).toLocaleString('en-US') })}</p> : null}
                  {!form.trim() ? <p className="rs-soft rs-small" role="status">{t('tools.compare.needForm')}</p> : null}
                  <p className="rs-soft rs-small">{t('tools.compare.keepNote')}</p>
                </>
              )}
            </section>
          ) : null}
        </>
      ) : null}
    </>
  );
}
