// One row per group (farm, pen, animal) with chosen summaries per column [M2-DESIGN.md 4.3]. The step is
// for the student's own farm table (farm-level prevalence, mean weight per pen); the herd guardrail's
// own route to farms keeps its M1 code. After this step each row is one group. OWNER: ui-tools role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { Busy, ErrorBox, Field, Notice, PageHead } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { ColumnSelect, PreviewTable, Rejected } from './ToolBits.jsx';
import { AGG_FNS, colLabel, freshKeys, newEntry, previewRows } from './tools-model.js';

const NUM = new Set(['continuous', 'count']);
const CAT = new Set(['binary', 'nominal', 'ordinal']);
const fnsFor = (c) => (NUM.has(c?.type) ? AGG_FNS.number : CAT.has(c?.type) ? AGG_FNS.category : AGG_FNS.other);

/** The codebook type of a summary column. */
function summaryType(fn, src) {
  if (fn === 'count') return 'count';
  if (fn === 'any' || fn === 'all') return 'binary';
  if (fn === 'first') return src?.type || 'text';
  return 'continuous';
}

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const cb = p.codebook || p.meta.codebook;
  const cols = (cb?.columns || []).filter((c) => !c.hidden);
  const [by, setBy] = useState(cb?.clusterKey || '');
  const [rows, setRows] = useState([{ column: '', fn: '', level: '', name: '' }]);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const keys = useMemo(() => freshKeys(p.meta.codebook, steps, rows.length), [p.meta.codebook, steps, rows.length]);
  useEffect(() => { setPreview(null); }, [by, JSON.stringify(rows)]);

  const byCol = cols.find((c) => c.key === by);
  const entryOf = (k) => cols.find((c) => c.key === k);
  const needsLevel = (fn) => fn === 'proportion' || fn === 'any' || fn === 'all';
  const rowOk = (r) => r.column && r.fn && (!needsLevel(r.fn) || r.level) && r.name.trim();
  const ready = Boolean(by) && rows.length > 0 && rows.every(rowOk);
  const defaultName = (r) => {
    const c = entryOf(r.column);
    if (!c || !r.fn) return '';
    return t(`tools.aggregate.nameFor.${r.fn}`, { column: colLabel(c, lang), level: r.level || '' });
  };
  const setRow = (i, patch) => setRows((list) => list.map((r, j) => {
    if (j !== i) return r;
    const next = { ...r, ...patch };
    // The name follows the choices until the student types one.
    if (!r.touched && ('column' in patch || 'fn' in patch || 'level' in patch)) next.name = defaultName(next);
    return next;
  }));

  const build = () => {
    const summaries = rows.map((r, i) => ({ column: r.column, fn: r.fn, ...(needsLevel(r.fn) ? { level: r.level } : {}), target: keys[i] }));
    const entries = rows.map((r, i) => {
      const src = entryOf(r.column);
      const type = summaryType(r.fn, src);
      return newEntry(keys[i], r.name.trim(), { type, unit: ['mean', 'median', 'sum', 'min', 'max', 'first'].includes(r.fn) ? src?.unit ?? null : null, level: byCol?.level || 'farm', levels: r.fn === 'first' ? src?.levels || [] : [] });
    });
    // The rows become groups at the by-column's level (a farm row), recorded with the step.
    return { params: { by, summaries, ...(byCol?.level ? { level: byCol.level } : {}) }, entries };
  };

  const look = async () => {
    setBusy(true);
    setError(null);
    try {
      const b = build();
      const step = makeStep(steps, 'aggregate', b.params, null);
      setPreview({ step, table: await p.previewSteps([...steps, step]) });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const b = build();
    let step;
    try { step = makeStep(steps, 'aggregate', b.params, null); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const ok = await p.commitStepsWithColumn([...steps, step], b.entries, { step: 'aggregate', stepId: step.id });
    if (ok) { notify('ws.steps.added', {}, 'ok'); setPreview(null); }
  };

  const pv = preview?.table;
  const aggReport = pv ? (pv.transforms || []).find((x) => x.stepId === preview.step.id)?.report || null : null;
  const pvKeys = [by, ...keys.slice(0, rows.length)];

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.aggregate.title')} sub={t('tools.aggregate.sub')} />
      <ErrorBox error={error} />
      <div className="rs-tl-cols">
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-agg">
          <h2 id="rs-h-agg" className="rs-h3">{t('tools.settings')}</h2>
          <ColumnSelect id="rs-agg-by" label={t('tools.aggregate.by')} hint={t('tools.aggregate.byHint')} value={by} onChange={setBy} columns={cols.filter((c) => ['id', 'nominal', 'ordinal', 'binary', 'text', 'count'].includes(c.type))} />
          {rows.map((r, i) => {
            const src = entryOf(r.column);
            return (
              <fieldset key={i} className="rs-fieldset rs-tl-box">
                <legend className="rs-field-label">{t('tools.aggregate.summary', { n: i + 1 })}</legend>
                <ColumnSelect id={`rs-agg-col-${i}`} label={t('tools.aggregate.column')} value={r.column} onChange={(v) => setRow(i, { column: v, fn: '', level: '' })} columns={cols.filter((c) => c.key !== by)} />
                <Field label={t('tools.aggregate.fn')} htmlFor={`rs-agg-fn-${i}`}>
                  <select id={`rs-agg-fn-${i}`} className="rs-select" value={r.fn} disabled={!src} onChange={(e) => setRow(i, { fn: e.target.value })}>
                    <option value="">{t('tools.choose')}</option>
                    {fnsFor(src).map((f) => <option key={f} value={f}>{t(`tools.aggregate.fn.${f}`)}</option>)}
                  </select>
                </Field>
                {needsLevel(r.fn) ? (
                  <Field label={t('tools.aggregate.level')} htmlFor={`rs-agg-lv-${i}`}>
                    <select id={`rs-agg-lv-${i}`} className="rs-select" value={r.level} onChange={(e) => setRow(i, { level: e.target.value })}>
                      <option value="">{t('tools.choose')}</option>
                      {(src?.levels || []).map((l) => <option key={l.value} value={l.value}>{l.value}</option>)}
                    </select>
                  </Field>
                ) : null}
                <Field label={t('tools.newColumnName')} htmlFor={`rs-agg-name-${i}`}>
                  <input id={`rs-agg-name-${i}`} className="rs-input" value={r.name} maxLength={60} onChange={(e) => setRows((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value, touched: true } : x)))} />
                </Field>
                {r.fn ? <p className="rs-soft rs-small">{t(`tools.aggregate.fnHint.${r.fn}`)}</p> : null}
                {rows.length > 1 ? <button type="button" className="rs-btn rs-btn--sm rs-btn--quiet" onClick={() => setRows((l) => l.filter((_, j) => j !== i))}><Icon name="trash" size={16} />{t('tools.remove')}</button> : null}
              </fieldset>
            );
          })}
          <button type="button" className="rs-btn rs-btn--sm" onClick={() => setRows((l) => [...l, { column: '', fn: '', level: '', name: '' }])}><Icon name="plus" size={16} />{t('tools.aggregate.add')}</button>
        </section>
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-agg-pv" aria-live="polite">
          <h2 id="rs-h-agg-pv" className="rs-h3">{t('tools.previewTitle')}</h2>
          {byCol ? <Notice tone="warn" title={t('tools.aggregate.unitTitle', { level: t(`ws.level.${byCol.level}`) })}>{t('tools.aggregate.unitBody')}</Notice> : null}
          <button type="button" className="rs-btn" disabled={!ready || busy} onClick={look}><Icon name="eye" size={18} />{t('tools.previewButton')}</button>
          {busy ? <Busy label={t('tools.previewing')} /> : null}
          {pv ? (
            <>
              <Rejected table={pv} stepId={preview.step.id} />
              {aggReport?.missingBy?.length ? <p className="rs-small">{t('tools.aggregate.missingBy', { n: aggReport.missingBy.length.toLocaleString('en-US') })}</p> : null}
              <p className="rs-strong rs-num">{t('tools.aggregate.result', { before: (p.table?.n ?? 0).toLocaleString('en-US'), after: (pv.n ?? 0).toLocaleString('en-US') })}</p>
              <PreviewTable caption={t('tools.previewCaption')} head={[t('tools.rowId'), colLabel(byCol, lang), ...rows.map((r) => r.name)]} rows={previewRows(pv, pvKeys, 8, lang)} />
            </>
          ) : null}
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!ready || p.busy} onClick={save}>{t('tools.saveStep')}</button>
        </section>
      </div>
    </>
  );
}
