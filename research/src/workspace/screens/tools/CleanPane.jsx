// Exclusions with a written reason and a STROBE-Vet category, values outside the codebook range flagged
// for review, never removed by a test [M2-DESIGN.md 4.5]. An exclusion takes rows out of the study and
// the participant flow counts it; a filter (on the data screen) is a subset for one analysis. There is
// no button that deletes outliers by a test: a value outside the range is shown here with its row, and
// the student decides with the paper record in hand. OWNER: ui-tools role.
import { useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { Field, Notice, PageHead } from '../../components/Bits.jsx';
import Dialog from '../../components/Dialog.jsx';
import Icon from '../../components/Icon.jsx';
import { formatNumber } from '../../../lib/stats/format.js';
import { keyPart } from '../../lib/keys.js';
import { IdList } from './ToolBits.jsx';
import { CONDITION_OPS, colLabel, matchingRows, rangeFlags } from './tools-model.js';

/** STROBE-Vet item 13 and ARRIVE item 3 reasons [M2-DESIGN.md 4.5]. */
export const EXCLUSION_CATEGORIES = Object.freeze(['ineligible', 'lost', 'protocol-deviation', 'measurement-error', 'duplicate', 'other']);
const NEEDS_VALUE = new Set(['eq', 'ne', 'lt', 'le', 'gt', 'ge']);

function CategoryField({ id, value, onChange }) {
  const { t } = useT();
  return (
    <Field label={t('tools.clean.category')} hint={t('tools.clean.categoryHint')} htmlFor={id}>
      <select id={id} className="rs-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t('tools.choose')}</option>
        {EXCLUSION_CATEGORIES.map((c) => <option key={c} value={c}>{t(`tools.clean.cat.${keyPart(c)}`)}</option>)}
      </select>
    </Field>
  );
}

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const cb = p.codebook || p.meta.codebook;
  const cols = (cb?.columns || []).filter((c) => !c.hidden);
  const [conds, setConds] = useState([{ column: '', op: 'eq', value: '' }]);
  const [combine, setCombine] = useState('and');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [rowFor, setRowFor] = useState(null);
  const [rowCat, setRowCat] = useState('');
  const [rowReason, setRowReason] = useState('');

  const flags = useMemo(() => rangeFlags(p.table, cb), [p.table, cb]);
  const hits = useMemo(() => matchingRows(p.table, conds.filter((c) => c.column && (!NEEDS_VALUE.has(c.op) || String(c.value).trim() !== '')), combine), [p.table, conds, combine]);
  const exclusions = steps.filter((s) => s.kind === 'row-exclude' || s.kind === 'exclude-where');
  const excludedNow = Object.values(p.table?.excluded || {}).length;
  const nameOf = (key) => colLabel(cb.columns.find((c) => c.key === key), lang);

  const add = async (kind, params, why) => {
    let step;
    try { step = makeStep(steps, kind, params, why); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return false; }
    const ok = await p.commitSteps([...steps, step], { step: kind, stepId: step.id, category: params.category || null });
    if (ok) notify('tools.clean.saved', {}, 'ok');
    return ok;
  };

  const saveWhere = async () => {
    const conditions = conds.filter((c) => c.column).map((c) => (NEEDS_VALUE.has(c.op) ? { column: c.column, op: c.op, value: c.value } : { column: c.column, op: c.op }));
    const ok = await add('exclude-where', { conditions, combine, category }, reason.trim());
    if (ok) { setConds([{ column: '', op: 'eq', value: '' }]); setReason(''); setCategory(''); }
  };

  const saveRow = async () => {
    const ok = await add('row-exclude', { rowId: rowFor.rowId, category: rowCat }, rowReason.trim());
    if (ok) { setRowFor(null); setRowReason(''); setRowCat(''); }
  };

  const whereOk = conds.some((c) => c.column) && conds.every((c) => !c.column || !NEEDS_VALUE.has(c.op) || String(c.value).trim() !== '') && category && reason.trim().length > 0;
  const setCond = (i, patch) => setConds((l) => l.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.clean.title')} sub={t('tools.clean.sub')} />
      <Notice tone="info">{t('tools.clean.notFilter')}</Notice>
      <div className="rs-tl-cols">
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-flags">
          <h2 id="rs-h-flags" className="rs-h3">{t('tools.clean.flagsTitle')}</h2>
          <p className="rs-soft rs-small">{t('tools.clean.flagsBody')}</p>
          {flags.length === 0 ? <p className="rs-soft">{t('tools.clean.flagsNone')}</p> : (
            <div className="rs-tablewrap">
              <table className="rs-table rs-table--compact">
                <caption className="rs-table-cap">{t('tools.clean.flagsCaption', { n: flags.length.toLocaleString('en-US') })}</caption>
                <thead><tr><th scope="col">{t('tools.rowId')}</th><th scope="col">{t('tools.column')}</th><th scope="col" className="rs-r">{t('tools.clean.value')}</th><th scope="col">{t('tools.clean.range')}</th><th scope="col"><span className="rs-visually-hidden">{t('tools.clean.action')}</span></th></tr></thead>
                <tbody>
                  {flags.slice(0, 200).map((f) => (
                    <tr key={`${f.rowId}-${f.column}`}>
                      <th scope="row" className="rs-mono">{f.rowId}</th>
                      <td>{nameOf(f.column)}</td>
                      <td className="rs-r rs-num">{formatNumber(f.value, { kind: 'statistic' })}</td>
                      <td className="rs-num">{t('tools.clean.rangeText', { min: f.min ?? '—', max: f.max ?? '—' })}</td>
                      <td><button type="button" className="rs-btn rs-btn--sm" onClick={() => setRowFor(f)}>{t('tools.clean.excludeRow')}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {flags.length > 200 ? <p className="rs-soft rs-small">{t('tools.andMore', { n: (flags.length - 200).toLocaleString('en-US') })}</p> : null}
            </div>
          )}
          <p className="rs-soft rs-small">{t('tools.clean.noOutlierTest')}</p>
        </section>
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-where">
          <h2 id="rs-h-where" className="rs-h3">{t('tools.clean.whereTitle')}</h2>
          <p className="rs-soft rs-small">{t('tools.clean.whereBody')}</p>
          {conds.map((c, i) => {
            const entry = cb.columns.find((x) => x.key === c.column);
            const levels = (entry?.levels || []).map((l) => l.value);
            return (
              <div key={i} className="rs-condrow">
                <select aria-label={t('tools.column')} className="rs-select" value={c.column} onChange={(e) => setCond(i, { column: e.target.value, value: '' })}>
                  <option value="">{t('ws.steps.chooseColumn')}</option>
                  {cols.map((x) => <option key={x.key} value={x.key}>{colLabel(x, lang)}</option>)}
                </select>
                <select aria-label={t('tools.clean.op')} className="rs-select rs-select--sm" value={c.op} onChange={(e) => setCond(i, { op: e.target.value })}>
                  {CONDITION_OPS.map((o) => <option key={o} value={o}>{t(`ws.steps.op.${o}`)}</option>)}
                </select>
                {NEEDS_VALUE.has(c.op) ? (levels.length && (c.op === 'eq' || c.op === 'ne') ? (
                  <select aria-label={t('tools.clean.value')} className="rs-select" value={c.value} onChange={(e) => setCond(i, { value: e.target.value })}>
                    <option value="">{t('tools.choose')}</option>
                    {levels.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                ) : (
                  <input aria-label={t('tools.clean.value')} className="rs-input" value={c.value} onChange={(e) => setCond(i, { value: e.target.value })} />
                )) : null}
                {conds.length > 1 ? <button type="button" className="rs-iconbtn" aria-label={t('tools.remove')} onClick={() => setConds((l) => l.filter((_, j) => j !== i))}><Icon name="trash" size={16} /></button> : null}
              </div>
            );
          })}
          <div className="rs-row-wrap">
            <button type="button" className="rs-btn rs-btn--sm" onClick={() => setConds((l) => [...l, { column: '', op: 'eq', value: '' }])}><Icon name="plus" size={16} />{t('tools.clean.addCondition')}</button>
            {conds.length > 1 ? (
              <label className="rs-field--inline">
                <span className="rs-soft rs-small">{t('tools.clean.combine')}</span>
                <select className="rs-select rs-select--sm" value={combine} onChange={(e) => setCombine(e.target.value)}>
                  <option value="and">{t('tools.clean.and')}</option>
                  <option value="or">{t('tools.clean.or')}</option>
                </select>
              </label>
            ) : null}
          </div>
          <p className="rs-strong rs-num" role="status">{t('tools.clean.hits', { n: hits.length.toLocaleString('en-US') })}</p>
          <IdList items={hits} />
          <CategoryField id="rs-clean-cat" value={category} onChange={setCategory} />
          <Field label={t('ws.steps.reasonRequired')} htmlFor="rs-clean-reason">
            <input id="rs-clean-reason" className="rs-input" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!whereOk || hits.length === 0 || p.busy} onClick={saveWhere}>{t('tools.clean.saveWhere', { n: hits.length.toLocaleString('en-US') })}</button>
        </section>
      </div>
      <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-excl">
        <h2 id="rs-h-excl" className="rs-h3">{t('tools.clean.listTitle', { n: excludedNow.toLocaleString('en-US') })}</h2>
        {exclusions.length === 0 ? <p className="rs-soft">{t('tools.clean.listEmpty')}</p> : (
          <ul className="rs-plainlist">
            {exclusions.map((s) => (
              <li key={s.id} className="rs-tl-exclusion">
                <span className="rs-chip">{s.params?.category ? t(`tools.clean.cat.${keyPart(s.params.category)}`) : t('tools.clean.cat.none')}</span>
                <span>{s.kind === 'row-exclude' ? t('tools.clean.rowItem', { row: s.params.rowId }) : t('tools.clean.whereItem', { n: (s.params?.conditions || []).length })}</span>
                {s.reason ? <span className="rs-soft rs-small"> {t('ws.steps.because', { reason: s.reason })}</span> : null}
              </li>
            ))}
          </ul>
        )}
        <p className="rs-soft rs-small">{t('tools.clean.flowNote')}</p>
      </section>
      <Dialog
        open={Boolean(rowFor)}
        onClose={() => setRowFor(null)}
        title={t('tools.clean.excludeRowTitle', { row: rowFor?.rowId || '' })}
        footer={(
          <>
            <button type="button" className="rs-btn" onClick={() => setRowFor(null)}>{t('ws.action.cancel')}</button>
            <button type="button" className="rs-btn rs-btn--primary" disabled={!rowCat || !rowReason.trim() || p.busy} onClick={saveRow}>{t('tools.clean.excludeRow')}</button>
          </>
        )}
      >
        {rowFor ? (
          <div className="rs-stack">
            <p>{t('tools.clean.excludeRowBody', { column: nameOf(rowFor.column), value: formatNumber(rowFor.value, { kind: 'statistic' }) })}</p>
            <CategoryField id="rs-clean-rowcat" value={rowCat} onChange={setRowCat} />
            <Field label={t('ws.steps.reasonRequired')} htmlFor="rs-clean-rowreason">
              <input id="rs-clean-rowreason" className="rs-input" value={rowReason} maxLength={200} onChange={(e) => setRowReason(e.target.value)} data-autofocus />
            </Field>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
