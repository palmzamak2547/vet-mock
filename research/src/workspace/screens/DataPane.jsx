// Data [M1-DESIGN.md 8.4, 17; competitor-gaps.md D4(a)(b); workspace board "Data"]: the grid after the
// recipe with filter chips and search, and the recipe beside it: every change the student made, one
// sentence each, undo for the last one, and the forms that add a step (edit a cell, type a row, merge
// categories, cut into groups, reference level, keep a subset, exclude a row, compute age). The raw
// file is never changed. OWNER: workspace role.
import { useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { describeStep, makeStep } from '../../lib/intake/recipe.js';
import { useWs, errorInfo } from '../ws-context.js';
import { editedCells, filterRows, nextTypedRowId, rawColumnIndex, rawRowIndex, rowCounts, visibleColumns } from '../lib/grid-model.js';
import { Chip, PageHead } from '../components/Bits.jsx';
import { keyPart } from '../lib/keys.js';
import DataGrid from '../components/DataGrid.jsx';
import Dialog from '../components/Dialog.jsx';
import Icon from '../components/Icon.jsx';
import StepForm from '../components/StepForms.jsx';

const ADD_KINDS = ['row-add', 'recode', 'bin', 'reference', 'filter', 'derive-age'];

/** Codebook entry for a column a step creates. */
function derivedEntry(kind, params, codebook, t) {
  const src = codebook.columns.find((c) => c.key === params.column || c.key === params.birth);
  const base = { key: params.target, unit: null, reference: null, positive: null, missingCodes: [], range: null, pii: null, hidden: false, role: 'none', level: src?.level || 'animal' };
  if (kind === 'recode') {
    const lv = params.map.map((m) => ({ value: m.to, labelTh: m.to, labelEn: m.to }));
    return { ...base, name: t('ws.steps.derivedName.recode', { column: src?.name || params.column }), labelTh: t('ws.steps.derivedName.recode', { column: src?.labelTh || src?.name || '' }), labelEn: '', type: lv.length === 2 ? 'binary' : src?.type === 'ordinal' ? 'ordinal' : 'nominal', levels: lv, role: src?.role || 'none' };
  }
  if (kind === 'bin') {
    const lv = (params.labels || []).map((l) => ({ value: l, labelTh: l, labelEn: l }));
    return { ...base, name: t('ws.steps.derivedName.bin', { column: src?.name || params.column }), labelTh: t('ws.steps.derivedName.bin', { column: src?.labelTh || src?.name || '' }), labelEn: '', type: lv.length === 2 ? 'binary' : 'ordinal', levels: lv, role: src?.role === 'exposure' ? 'exposure' : 'none' };
  }
  return { ...base, name: t('ws.steps.derivedName.age'), labelTh: t('ws.steps.derivedName.age'), labelEn: '', type: 'continuous', levels: [], unit: params.unit };
}

/** @param {{ p: any }} props */
export default function DataPane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const [mode, setMode] = useState('all');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(null);
  const [rowFor, setRowFor] = useState(null);
  const steps = p.meta.steps || [];
  const effective = p.codebook || p.meta.codebook;
  const cols = useMemo(() => visibleColumns(effective), [effective]);
  const hidden = (p.meta.codebook.columns || []).filter((c) => c.hidden).length;
  const ctx = useMemo(() => ({
    table: p.table,
    raw: p.raw,
    rawCols: rawColumnIndex(effective, p.raw),
    rawRows: rawRowIndex(p.raw),
    edited: editedCells(steps),
  }), [p.table, p.raw, effective, steps]);
  const counts = useMemo(() => rowCounts(ctx, cols, lang), [ctx, cols, lang]);
  const rows = useMemo(() => filterRows(ctx, cols, mode, query, lang), [ctx, cols, mode, query, lang]);

  const addStep = async (kind, params, reason) => {
    let step;
    try {
      step = makeStep(steps, kind, params, reason);
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      return;
    }
    const next = [...steps, step];
    const detail = { step: kind, stepId: step.id };
    const ok = params.target && params.target !== params.column && ['recode', 'bin', 'derive-age'].includes(kind)
      ? await p.commitStepsWithColumn(next, derivedEntry(kind, params, effective, t), detail)
      : await p.commitSteps(next, detail);
    if (ok) {
      setForm(null);
      setRowFor(null);
      notify('ws.steps.added', {}, 'ok');
    }
  };

  const undo = async () => {
    if (steps.length <= 1) return;
    const last = steps[steps.length - 1];
    const ok = await p.commitSteps(steps.slice(0, -1), { undo: last.kind, stepId: last.id });
    if (ok) notify('ws.steps.undone', {}, 'ok');
  };

  const onEdit = (i, column, from, to) => addStep('cell-edit', { rowId: p.table.rowIds[i], column, from, to }, null);

  const names = useMemo(() => Object.fromEntries((effective.columns || []).map((c) => [c.key, lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name])), [effective, lang]);
  const describe = (s) => {
    try { return describeStep(s, t, names); } catch { return t(`ws.steps.kind.${keyPart(s.kind)}`); }
  };

  const chip = (id, n) => (
    <button key={id} type="button" className={`rs-btn rs-btn--sm${mode === id ? ' rs-btn--chosen' : ''}`} aria-pressed={mode === id} onClick={() => setMode(id)}>
      {t(`ws.grid.filter.${id}`)} <span className="rs-num">{n.toLocaleString('en-US')}</span>
    </button>
  );

  return (
    <>
      <PageHead eyebrow={t('ws.data.eyebrow')} title={t('ws.data.title')} sub={t('ws.data.sub')} />
      <div className="rs-data">
        <section className="rs-data-main" aria-label={t('ws.data.gridLabel')}>
          <div className="rs-toolbar">
            <div role="group" aria-label={t('ws.grid.filterLabel')} className="rs-row-wrap">
              {chip('all', counts.all)}
              {chip('missing', counts.missing)}
              {chip('converted', counts.converted)}
              {counts.excluded ? chip('excluded', counts.excluded) : null}
            </div>
            <span className="rs-grow" />
            {hidden ? <Chip icon="eyeOff">{t('ws.grid.hiddenPii', { n: hidden })}</Chip> : null}
            <label className="rs-search">
              <Icon name="search" size={16} />
              <input type="search" className="rs-search-input" placeholder={t('ws.grid.search')} aria-label={t('ws.grid.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          {p.table ? (
            <DataGrid ctx={ctx} cols={cols} rows={rows} onEdit={onEdit} onRowAction={(i) => setRowFor(i)} label={t('ws.data.gridLabel')} />
          ) : null}
          <div className="rs-legend rs-soft rs-small">
            <span className="rs-num">{t('ws.grid.showing', { n: rows.length.toLocaleString('en-US'), total: counts.all.toLocaleString('en-US') })}</span>
            <span className="rs-legend-item"><span className="rs-swatch rs-swatch--conv" aria-hidden="true" />{t('ws.grid.legendConv')}</span>
            <span className="rs-legend-item"><span className="rs-swatch rs-swatch--edit" aria-hidden="true" />{t('ws.grid.legendEdit')}</span>
            <span className="rs-legend-item"><span aria-hidden="true">—</span> {t('ws.grid.legendMissing')}</span>
          </div>
          <p className="rs-soft rs-small">{t('ws.grid.keys')}</p>
        </section>
        <aside className="rs-data-side">
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-steps">
            <h2 id="rs-h-steps" className="rs-h3">{t('ws.steps.title')}</h2>
            <p className="rs-soft rs-small">{t('ws.steps.sub')}</p>
            <ol className="rs-steps">
              {steps.map((s, k) => (
                <li key={s.id} className="rs-step">
                  <span className="rs-step-n rs-num" aria-hidden="true">{k + 1}</span>
                  <span className="rs-grow">{describe(s)}{s.reason ? <span className="rs-soft rs-small"> {t('ws.steps.because', { reason: s.reason })}</span> : null}</span>
                </li>
              ))}
            </ol>
            <button type="button" className="rs-btn rs-btn--sm" onClick={undo} disabled={steps.length <= 1 || p.busy}>
              <Icon name="undo" size={16} />
              {t('ws.steps.undo')}
            </button>
          </section>
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-add">
            <h2 id="rs-h-add" className="rs-h3">{t('ws.steps.addTitle')}</h2>
            <div className="rs-stack">
              {ADD_KINDS.map((k) => (
                <button key={k} type="button" className="rs-btn rs-btn--left" onClick={() => setForm(k)}>
                  <Icon name={k === 'filter' ? 'filter' : k === 'row-add' ? 'plus' : 'edit'} size={18} />
                  {t(`ws.steps.kind.${keyPart(k)}`)}
                </button>
              ))}
            </div>
            <p className="rs-soft rs-small">{t('ws.steps.cellHint')}</p>
          </section>
        </aside>
      </div>
      <Dialog open={Boolean(form)} onClose={() => setForm(null)} title={form ? t(`ws.steps.kind.${keyPart(form)}`) : ''} wide={form === 'row-add'}>
        {form ? <StepForm kind={form} codebook={effective} steps={steps} typedRowId={nextTypedRowId(p.table?.rowIds)} onSubmit={addStep} onCancel={() => setForm(null)} busy={p.busy} /> : null}
      </Dialog>
      <Dialog open={rowFor !== null} onClose={() => setRowFor(null)} title={t('ws.steps.kind.rowExclude')}>
        {rowFor !== null ? <StepForm kind="row-exclude" codebook={effective} steps={steps} rowId={p.table.rowIds[rowFor]} onSubmit={addStep} onCancel={() => setRowFor(null)} busy={p.busy} /> : null}
      </Dialog>
    </>
  );
}
