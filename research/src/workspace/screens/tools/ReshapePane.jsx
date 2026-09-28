// Reshape wide to long (one row per animal and time) and long to wide, with a preview [M2-DESIGN.md 4.2].
// Wide to long is what repeated-measures analyses read (a weight column per week becomes one row per
// animal and week). The step is saved in the recipe like any other; a step after it refers to the new
// row ids. OWNER: ui-tools role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { Busy, ErrorBox, Field, Notice, PageHead } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { ColumnChecks, ColumnSelect, PreviewTable, Rejected } from './ToolBits.jsx';
import { colLabel, freshKeys, newEntry, previewRows } from './tools-model.js';

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const cb = p.codebook || p.meta.codebook;
  const cols = (cb?.columns || []).filter((c) => !c.hidden);
  const [mode, setMode] = useState('long');
  // wide to long
  const [idColumns, setIdColumns] = useState(() => cols.filter((c) => c.type === 'id' || c.key === cb?.clusterKey).map((c) => c.key));
  const [stubs, setStubs] = useState([{ name: '', columns: [] }]);
  const [timeName, setTimeName] = useState('');
  const [times, setTimes] = useState('');
  // long to wide
  const [idColumn, setIdColumn] = useState('');
  const [timeColumn, setTimeColumn] = useState('');
  const [valueColumns, setValueColumns] = useState([]);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setPreview(null); }, [mode, idColumns.join(','), JSON.stringify(stubs), timeName, times, idColumn, timeColumn, valueColumns.join(',')]);

  const width = stubs[0]?.columns.length || 0;
  const timeList = times.split(',').map((s) => s.trim()).filter(Boolean);
  const timesOk = timeList.length === 0 || (timeList.length === width && new Set(timeList).size === timeList.length);
  const stubsOk = stubs.length > 0 && stubs.every((s) => s.name.trim() && s.columns.length >= 2 && s.columns.length === width);
  const keys = useMemo(() => freshKeys(p.meta.codebook, steps, stubs.length + 1), [p.meta.codebook, steps, stubs.length]);

  const build = () => {
    if (mode === 'long') {
      const tl = timeList.length ? timeList : Array.from({ length: width }, (_, i) => String(i + 1));
      const params = { idColumns, stubs: stubs.map((s, i) => ({ target: keys[i + 1], columns: s.columns })), timeTarget: keys[0], times: tl };
      const first = cb.columns.find((c) => c.key === stubs[0].columns[0]);
      const entries = [
        newEntry(keys[0], timeName.trim() || t('tools.reshape.timeDefault'), { type: 'ordinal', role: 'time', level: 'visit', levels: tl.map((v) => ({ value: v, labelTh: v, labelEn: v })) }),
        ...stubs.map((s, i) => {
          const src = cb.columns.find((c) => c.key === s.columns[0]) || first;
          return newEntry(keys[i + 1], s.name.trim(), { type: src?.type || 'continuous', unit: src?.unit ?? null, level: 'visit', role: src?.role === 'outcome' ? 'outcome' : 'none', levels: src?.levels || [] });
        }),
      ];
      return { kind: 'reshape-long', params, entries };
    }
    return { kind: 'reshape-wide', params: { idColumn, timeColumn, valueColumns }, entries: [] };
  };
  const ready = mode === 'long' ? stubsOk && timesOk && idColumns.length > 0 : Boolean(idColumn && timeColumn && valueColumns.length && idColumn !== timeColumn);

  const look = async () => {
    setBusy(true);
    setError(null);
    try {
      const b = build();
      const step = makeStep(steps, b.kind, b.params, null);
      const tb = await p.previewSteps([...steps, step]);
      setPreview({ step, table: tb });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const b = build();
    let step;
    try { step = makeStep(steps, b.kind, b.params, null); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const next = [...steps, step];
    const detail = { step: b.kind, stepId: step.id };
    const ok = b.entries.length ? await p.commitStepsWithColumn(next, b.entries, detail) : await p.commitSteps(next, detail);
    if (ok) { notify('ws.steps.added', {}, 'ok'); setPreview(null); }
  };

  const setStub = (i, patch) => setStubs((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const pv = preview?.table;
  const pvCols = (pv?.codebook?.columns || []).filter((c) => !c.hidden).slice(0, 7);

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.reshape.title')} sub={t('tools.reshape.sub')} />
      <div className="rs-row-wrap" role="radiogroup" aria-label={t('tools.reshape.modeLabel')}>
        {['long', 'wide'].map((m) => (
          <button key={m} type="button" role="radio" aria-checked={mode === m} className={`rs-btn${mode === m ? ' rs-btn--chosen' : ''}`} onClick={() => setMode(m)}>
            {mode === m ? <Icon name="check" size={18} /> : null}
            {t(`tools.reshape.mode.${m}`)}
          </button>
        ))}
      </div>
      <p className="rs-soft rs-small">{t(`tools.reshape.modeHint.${mode}`)}</p>
      <ErrorBox error={error} />
      <div className="rs-tl-cols">
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-reshape">
          <h2 id="rs-h-reshape" className="rs-h3">{t('tools.settings')}</h2>
          {mode === 'long' ? (
            <>
              <ColumnChecks legend={t('tools.reshape.idColumns')} hint={t('tools.reshape.idColumnsHint')} columns={cols} value={idColumns} onChange={setIdColumns} />
              {stubs.map((s, i) => (
                <fieldset key={i} className="rs-fieldset rs-tl-box">
                  <legend className="rs-field-label">{t('tools.reshape.measure', { n: i + 1 })}</legend>
                  <Field label={t('tools.reshape.measureName')} hint={t('tools.reshape.measureNameHint')} htmlFor={`rs-stub-${i}`}>
                    <input id={`rs-stub-${i}`} className="rs-input" value={s.name} maxLength={60} onChange={(e) => setStub(i, { name: e.target.value })} />
                  </Field>
                  <ColumnChecks legend={t('tools.reshape.measureColumns')} hint={t('tools.reshape.measureColumnsHint')} columns={cols.filter((c) => !idColumns.includes(c.key))} value={s.columns} onChange={(v) => setStub(i, { columns: v })} />
                  {stubs.length > 1 ? <button type="button" className="rs-btn rs-btn--sm rs-btn--quiet" onClick={() => setStubs((l) => l.filter((_, j) => j !== i))}><Icon name="trash" size={16} />{t('tools.remove')}</button> : null}
                </fieldset>
              ))}
              <button type="button" className="rs-btn rs-btn--sm" onClick={() => setStubs((l) => [...l, { name: '', columns: [] }])}><Icon name="plus" size={16} />{t('tools.reshape.addMeasure')}</button>
              <Field label={t('tools.reshape.timeName')} htmlFor="rs-reshape-time">
                <input id="rs-reshape-time" className="rs-input" value={timeName} maxLength={60} placeholder={t('tools.reshape.timeDefault')} onChange={(e) => setTimeName(e.target.value)} />
              </Field>
              <Field label={t('tools.reshape.times')} hint={t('tools.reshape.timesHint', { n: width })} htmlFor="rs-reshape-times">
                <input id="rs-reshape-times" className="rs-input" value={times} onChange={(e) => setTimes(e.target.value)} aria-invalid={!timesOk || undefined} />
              </Field>
              {!stubsOk && stubs.some((s) => s.columns.length) ? <p className="rs-small rs-rose-text" role="status">{t('tools.reshape.sameCount')}</p> : null}
              {!timesOk ? <p className="rs-small rs-rose-text" role="status">{t('tools.reshape.timesBad', { n: width })}</p> : null}
            </>
          ) : (
            <>
              <ColumnSelect id="rs-wide-id" label={t('tools.reshape.idColumn')} value={idColumn} onChange={setIdColumn} columns={cols} />
              <ColumnSelect id="rs-wide-time" label={t('tools.reshape.timeColumn')} value={timeColumn} onChange={setTimeColumn} columns={cols.filter((c) => c.key !== idColumn)} />
              <ColumnChecks legend={t('tools.reshape.valueColumns')} columns={cols.filter((c) => c.key !== idColumn && c.key !== timeColumn)} value={valueColumns} onChange={setValueColumns} />
              <Notice tone="info">{t('tools.reshape.wideNote')}</Notice>
            </>
          )}
        </section>
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-reshape-pv" aria-live="polite">
          <h2 id="rs-h-reshape-pv" className="rs-h3">{t('tools.previewTitle')}</h2>
          <p className="rs-soft rs-small">{t('tools.previewBody')}</p>
          <button type="button" className="rs-btn" disabled={!ready || busy} onClick={look}><Icon name="eye" size={18} />{t('tools.previewButton')}</button>
          {busy ? <Busy label={t('tools.previewing')} /> : null}
          {pv ? (
            <>
              <Rejected table={pv} stepId={preview.step.id} />
              <p className="rs-strong rs-num">{t('tools.reshape.result', { before: (p.table?.n ?? 0).toLocaleString('en-US'), after: (pv.n ?? 0).toLocaleString('en-US') })}</p>
              <PreviewTable caption={t('tools.previewCaption')} head={[t('tools.rowId'), ...pvCols.map((c) => colLabel(c, lang))]} rows={previewRows(pv, pvCols.map((c) => c.key), 8, lang)} />
            </>
          ) : null}
          <Notice tone="info">{t('tools.reshape.afterNote')}</Notice>
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!ready || p.busy} onClick={save}>{t('tools.saveStep')}</button>
        </section>
      </div>
    </>
  );
}
