// Forms that add a recipe step [M1-DESIGN.md 8.4; competitor-gaps.md D4(a)(b)]: merge categories
// (recode), cut a number into groups (bin, with where the cut-points came from), set the reference
// level, keep a subset (filter, reason required), exclude one row (reason required), compute age,
// and type in a new row from a paper questionnaire. Each form only builds the step's params; the
// pane saves the step through the store. OWNER: workspace role.
import { useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { nextDerivedKey } from '../../lib/intake/recipe.js';
import { Field } from './Bits.jsx';

const colLabel = (c, lang) => (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name);

function ColumnSelect({ id, value, onChange, columns, lang, t }) {
  return (
    <select id={id} className="rs-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{t('ws.steps.chooseColumn')}</option>
      {columns.map((c) => <option key={c.key} value={c.key}>{colLabel(c, lang)}</option>)}
    </select>
  );
}

function ReasonField({ value, onChange, t, required }) {
  return (
    <Field label={required ? t('ws.steps.reasonRequired') : t('ws.steps.reason')} htmlFor="rs-step-reason">
      <input id="rs-step-reason" className="rs-input" value={value} onChange={(e) => onChange(e.target.value)} maxLength={200} required={required} />
    </Field>
  );
}

/**
 * @param {{ kind: string, codebook: any, steps?: any[], rowId?: string, typedRowId?: string, onSubmit: (kind: string, params: Object, reason: string|null) => void, onCancel: () => void, busy?: boolean }} props
 */
export default function StepForm({ kind, codebook, steps = [], rowId, typedRowId, onSubmit, onCancel, busy = false }) {
  const { t, lang } = useT();
  const cols = codebook.columns.filter((c) => !c.hidden);
  const cats = cols.filter((c) => ['binary', 'nominal', 'ordinal'].includes(c.type));
  const nums = cols.filter((c) => ['continuous', 'count'].includes(c.type));
  const dates = cols.filter((c) => c.type === 'date');
  const [column, setColumn] = useState('');
  const [reason, setReason] = useState('');
  const [target, setTarget] = useState('new');
  const [map, setMap] = useState({});
  const [cuts, setCuts] = useState('');
  const [closed, setClosed] = useState('left');
  const [cutSource, setCutSource] = useState('typed');
  const [labels, setLabels] = useState('');
  const [level, setLevel] = useState('');
  const [conds, setConds] = useState([{ column: '', op: 'eq', value: '' }]);
  const [combine, setCombine] = useState('and');
  const [birth, setBirth] = useState('');
  const [event, setEvent] = useState('');
  const [unit, setUnit] = useState('months');
  const [values, setValues] = useState({});
  const entry = codebook.columns.find((c) => c.key === column);
  const levels = (entry?.levels || []).map((l) => l.value);
  const cutList = useMemo(() => cuts.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean).map(Number), [cuts]);
  const cutsOk = cutList.length > 0 && cutList.every(Number.isFinite) && cutList.every((v, i) => i === 0 || v > cutList[i - 1]);

  let body = null;
  let params = null;
  let needReason = false;
  let valid = false;
  switch (kind) {
    case 'recode': {
      body = (
        <>
          <Field label={t('ws.steps.column')} htmlFor="rs-s-col"><ColumnSelect id="rs-s-col" value={column} onChange={(v) => { setColumn(v); setMap({}); }} columns={cats} lang={lang} t={t} /></Field>
          {levels.length ? (
            <fieldset className="rs-fieldset">
              <legend className="rs-field-label">{t('ws.steps.recodeMap')}</legend>
              {levels.map((v) => (
                <div key={v} className="rs-row">
                  <span className="rs-mono rs-grow">{v}</span>
                  <input className="rs-input" aria-label={t('ws.steps.recodeTo', { value: v })} value={map[v] ?? v} onChange={(e) => setMap((m) => ({ ...m, [v]: e.target.value }))} />
                </div>
              ))}
            </fieldset>
          ) : null}
          <fieldset className="rs-fieldset">
            <legend className="rs-field-label">{t('ws.steps.target')}</legend>
            <label className="rs-radio"><input type="radio" checked={target === 'new'} onChange={() => setTarget('new')} />{t('ws.steps.targetNew')}</label>
            <label className="rs-radio"><input type="radio" checked={target === 'same'} onChange={() => setTarget('same')} />{t('ws.steps.targetSame')}</label>
          </fieldset>
        </>
      );
      const groups = {};
      for (const v of levels) {
        const to = String(map[v] ?? v).trim();
        if (!to) continue;
        (groups[to] = groups[to] || []).push(v);
      }
      params = { column, target: target === 'new' ? nextDerivedKey(codebook, steps) : column, map: Object.entries(groups).map(([to, from]) => ({ from, to })) };
      valid = Boolean(column) && params.map.length > 0;
      break;
    }
    case 'bin': {
      body = (
        <>
          <Field label={t('ws.steps.column')} htmlFor="rs-s-col"><ColumnSelect id="rs-s-col" value={column} onChange={setColumn} columns={nums} lang={lang} t={t} /></Field>
          <Field label={t('ws.steps.cuts')} hint={t('ws.steps.cutsHint')} htmlFor="rs-s-cuts">
            <input id="rs-s-cuts" className="rs-input" inputMode="decimal" value={cuts} onChange={(e) => setCuts(e.target.value)} />
          </Field>
          <fieldset className="rs-fieldset">
            <legend className="rs-field-label">{t('ws.steps.closed')}</legend>
            <label className="rs-radio"><input type="radio" checked={closed === 'left'} onChange={() => setClosed('left')} />{t('ws.steps.closedLeft')}</label>
            <label className="rs-radio"><input type="radio" checked={closed === 'right'} onChange={() => setClosed('right')} />{t('ws.steps.closedRight')}</label>
          </fieldset>
          <Field label={t('ws.steps.cutSource')} hint={t('ws.steps.cutSourceHint')} htmlFor="rs-s-src">
            <select id="rs-s-src" className="rs-select" value={cutSource} onChange={(e) => setCutSource(e.target.value)}>
              {['typed', 'literature', 'median', 'quantile'].map((v) => <option key={v} value={v}>{t(`ws.steps.cutSource.${v}`)}</option>)}
            </select>
          </Field>
          <Field label={t('ws.steps.binLabels')} hint={t('ws.steps.binLabelsHint', { n: cutsOk ? cutList.length + 1 : 0 })} htmlFor="rs-s-lab">
            <input id="rs-s-lab" className="rs-input" value={labels} onChange={(e) => setLabels(e.target.value)} />
          </Field>
        </>
      );
      const labs = labels.split(',').map((s) => s.trim()).filter(Boolean);
      params = { column, target: nextDerivedKey(codebook, steps), cutpoints: cutList, closed, labels: labs.length === cutList.length + 1 ? labs : [], cutSource };
      valid = Boolean(column) && cutsOk && (labs.length === 0 || labs.length === cutList.length + 1);
      break;
    }
    case 'reference': {
      body = (
        <>
          <Field label={t('ws.steps.column')} htmlFor="rs-s-col"><ColumnSelect id="rs-s-col" value={column} onChange={(v) => { setColumn(v); setLevel(''); }} columns={cats} lang={lang} t={t} /></Field>
          {levels.length ? (
            <Field label={t('ws.steps.referenceLevel')} htmlFor="rs-s-lvl">
              <select id="rs-s-lvl" className="rs-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">{t('ws.steps.chooseLevel')}</option>
                {levels.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
          ) : null}
        </>
      );
      params = { column, level };
      valid = Boolean(column && level);
      break;
    }
    case 'filter': {
      needReason = true;
      const OPS = ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'missing', 'present'];
      body = (
        <>
          {conds.map((cd, k) => {
            const e2 = codebook.columns.find((c) => c.key === cd.column);
            const lv = (e2?.levels || []).map((l) => l.value);
            return (
              <div key={k} className="rs-condrow">
                <ColumnSelect id={`rs-s-fc-${k}`} value={cd.column} onChange={(v) => setConds((cs) => cs.map((x, j) => (j === k ? { ...x, column: v, value: '' } : x)))} columns={cols} lang={lang} t={t} />
                <select className="rs-select" aria-label={t('ws.steps.op')} value={cd.op} onChange={(e) => setConds((cs) => cs.map((x, j) => (j === k ? { ...x, op: e.target.value } : x)))}>
                  {OPS.map((o) => <option key={o} value={o}>{t(`ws.steps.op.${o}`)}</option>)}
                </select>
                {cd.op === 'missing' || cd.op === 'present' ? null : lv.length ? (
                  <select className="rs-select" aria-label={t('ws.steps.value')} value={cd.value} onChange={(e) => setConds((cs) => cs.map((x, j) => (j === k ? { ...x, value: e.target.value } : x)))}>
                    <option value="">{t('ws.steps.chooseLevel')}</option>
                    {lv.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                ) : (
                  <input className="rs-input" aria-label={t('ws.steps.value')} value={cd.value} onChange={(e) => setConds((cs) => cs.map((x, j) => (j === k ? { ...x, value: e.target.value } : x)))} />
                )}
                {conds.length > 1 ? <button type="button" className="rs-btn rs-btn--quiet rs-btn--sm" onClick={() => setConds((cs) => cs.filter((_, j) => j !== k))}>{t('ws.steps.removeCond')}</button> : null}
              </div>
            );
          })}
          <div className="rs-row-wrap">
            <button type="button" className="rs-btn rs-btn--sm" onClick={() => setConds((cs) => [...cs, { column: '', op: 'eq', value: '' }])}>{t('ws.steps.addCond')}</button>
            {conds.length > 1 ? (
              <select className="rs-select" aria-label={t('ws.steps.combine')} value={combine} onChange={(e) => setCombine(e.target.value)}>
                <option value="and">{t('ws.steps.combine.and')}</option>
                <option value="or">{t('ws.steps.combine.or')}</option>
              </select>
            ) : null}
          </div>
          <p className="rs-soft rs-small">{t('ws.steps.filterNote')}</p>
        </>
      );
      const numeric = (key) => ['continuous', 'count'].includes(codebook.columns.find((c) => c.key === key)?.type);
      params = { conditions: conds.map((c) => ({ column: c.column, op: c.op, value: c.op === 'missing' || c.op === 'present' ? null : numeric(c.column) && c.value !== '' ? Number(c.value) : c.value })), combine };
      valid = conds.every((c) => c.column && (c.op === 'missing' || c.op === 'present' || String(c.value) !== '')) && reason.trim().length > 0;
      break;
    }
    case 'row-exclude': {
      needReason = true;
      body = <p>{t('ws.steps.excludeBody', { row: rowId || '' })}</p>;
      params = { rowId };
      valid = Boolean(rowId) && reason.trim().length > 0;
      break;
    }
    case 'derive-age': {
      body = (
        <>
          <Field label={t('ws.steps.birth')} htmlFor="rs-s-b"><ColumnSelect id="rs-s-b" value={birth} onChange={setBirth} columns={dates} lang={lang} t={t} /></Field>
          <Field label={t('ws.steps.event')} htmlFor="rs-s-e"><ColumnSelect id="rs-s-e" value={event} onChange={setEvent} columns={dates} lang={lang} t={t} /></Field>
          <Field label={t('ws.steps.unit')} htmlFor="rs-s-u">
            <select id="rs-s-u" className="rs-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              {['months', 'days', 'years'].map((u) => <option key={u} value={u}>{t(`ws.steps.unit.${u}`)}</option>)}
            </select>
          </Field>
          <p className="rs-soft rs-small">{t('ws.steps.ageNote')}</p>
        </>
      );
      params = { birth, event, unit, target: nextDerivedKey(codebook, steps) };
      valid = Boolean(birth && event && birth !== event);
      break;
    }
    case 'row-add': {
      body = (
        <>
          <p className="rs-soft">{t('ws.steps.addRowBody', { row: typedRowId || '' })}</p>
          <div className="rs-formgrid">
            {cols.filter((c) => !/^d\d+$/.test(c.key)).map((c) => (
              <Field key={c.key} label={colLabel(c, lang)} htmlFor={`rs-s-v-${c.key}`} hint={c.type === 'date' ? t('ws.steps.dateHint') : undefined}>
                {(c.levels || []).length && ['binary', 'nominal', 'ordinal'].includes(c.type) ? (
                  <select id={`rs-s-v-${c.key}`} className="rs-select" value={values[c.key] || ''} onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}>
                    <option value="">{t('ws.steps.blank')}</option>
                    {c.levels.map((l) => <option key={l.value} value={l.value}>{l.value}</option>)}
                  </select>
                ) : (
                  <input id={`rs-s-v-${c.key}`} className="rs-input" inputMode={['continuous', 'count'].includes(c.type) ? 'decimal' : undefined} value={values[c.key] || ''} onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))} />
                )}
              </Field>
            ))}
          </div>
        </>
      );
      params = { rowId: typedRowId, values: Object.fromEntries(Object.entries(values).filter(([, v]) => String(v).trim() !== '').map(([k, v]) => [k, String(v).normalize('NFC').trim()])) };
      valid = Object.keys(params.values).length > 0;
      break;
    }
    default:
      break;
  }

  return (
    <form
      className="rs-stepform"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !busy) onSubmit(kind, params, reason.trim() || null);
      }}
    >
      {body}
      {kind !== 'row-add' && kind !== 'derive-age' && kind !== 'reference' ? <ReasonField value={reason} onChange={setReason} t={t} required={needReason} /> : null}
      <div className="rs-row-wrap rs-stepform-actions">
        <button type="button" className="rs-btn" onClick={onCancel}>{t('ws.action.cancel')}</button>
        <button type="submit" className="rs-btn rs-btn--primary" disabled={!valid || busy}>{t('ws.steps.add')}</button>
      </div>
    </form>
  );
}
