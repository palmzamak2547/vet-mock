// Pieces the data-tool panes share: a column picker, a preview table, the chooser for a project's second
// file (one already added, or a new one through the import flow), and the list of what a step would do
// before it is saved [M2-DESIGN.md 10.3]. Every word comes from the dictionaries. OWNER: ui-tools role.
import { useT } from '../../../i18n/index.js';
import { Field } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { ImportFlow } from '../ImportPane.jsx';
import { colLabel } from './tools-model.js';
import '../../../styles/tools.css';

/** @param {{ id: string, label: string, hint?: string, value: string, onChange: (v: string) => void, columns: any[], empty?: string }} props */
export function ColumnSelect({ id, label, hint, value, onChange, columns, empty }) {
  const { t, lang } = useT();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select id={id} className="rs-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">{empty || t('ws.steps.chooseColumn')}</option>
        {columns.map((c) => <option key={c.key} value={c.key}>{colLabel(c, lang)}</option>)}
      </select>
    </Field>
  );
}

/** Tick boxes for several columns (kept in the order the codebook lists them). */
export function ColumnChecks({ legend, columns, value, onChange, hint }) {
  const { lang } = useT();
  const set = new Set(value || []);
  const toggle = (k) => {
    const next = new Set(set);
    if (next.has(k)) next.delete(k); else next.add(k);
    onChange(columns.map((c) => c.key).filter((x) => next.has(x)));
  };
  return (
    <fieldset className="rs-fieldset">
      <legend className="rs-field-label">{legend}</legend>
      <div className="rs-tl-checks">
        {columns.map((c) => (
          <label key={c.key} className="rs-check">
            <input type="checkbox" checked={set.has(c.key)} onChange={() => toggle(c.key)} />
            <span>{colLabel(c, lang)}</span>
          </label>
        ))}
      </div>
      {hint ? <p className="rs-field-hint">{hint}</p> : null}
    </fieldset>
  );
}

/**
 * @param {{ caption: string, head: string[], rows: (string|number|null)[][], note?: string }} props
 * The first column is the row id (a row header); every other cell is text as the grid shows it.
 */
export function PreviewTable({ caption, head, rows, note }) {
  const { t } = useT();
  return (
    <div className="rs-tablewrap">
      <table className="rs-table rs-table--compact">
        <caption className="rs-table-cap">{caption}</caption>
        <thead><tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="rs-mono">{c}</th> : <td key={j}>{c === '' || c === null || c === undefined ? <span className="rs-soft" title={t('ws.grid.legendMissing')}>—</span> : c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
      {note ? <p className="rs-soft rs-small">{note}</p> : null}
    </div>
  );
}

/** A short list of ids or values, the rest counted ("and 12 more"). */
export function IdList({ items, limit = 12 }) {
  const { t } = useT();
  if (!items?.length) return null;
  const shown = items.slice(0, limit);
  return (
    <p className="rs-small rs-tl-ids">
      {shown.map((x, i) => <span key={i} className="rs-chip rs-mono">{x === '' ? t('tools.blankValue') : x}</span>)}
      {items.length > limit ? <span className="rs-soft"> {t('tools.andMore', { n: (items.length - limit).toLocaleString('en-US') })}</span> : null}
    </p>
  );
}

/**
 * The project's other datasets for this purpose, or the import flow for a new one.
 * @param {{ p: any, purpose: 'merge'|'double-entry', value: string|null, onChange: (id: string|null) => void }} props
 */
export function SecondFile({ p, purpose, value, onChange }) {
  const { t } = useT();
  const fit = (p.others || []).filter((o) => !o.meta.purpose || o.meta.purpose === purpose);
  const adding = value === 'new' || fit.length === 0;
  if (adding) {
    return (
      <ImportFlow
        p={p}
        purpose={purpose}
        onDone={(meta) => onChange(meta?.id || null)}
        onCancel={fit.length ? () => onChange(fit[0].meta.id) : undefined}
      />
    );
  }
  return (
    <fieldset className="rs-fieldset rs-panel rs-pad">
      <legend className="rs-field-label">{t(purpose === 'merge' ? 'tools.second.pickMerge' : 'tools.second.pickCompare')}</legend>
      {fit.map((o) => (
        <label key={o.meta.id} className="rs-radio">
          <input type="radio" name={`rs-second-${purpose}`} checked={value === o.meta.id} onChange={() => onChange(o.meta.id)} />
          <Icon name="file" size={18} />
          <span className="rs-strong">{o.meta.source?.fileName || o.meta.id}</span>
          <span className="rs-soft rs-small rs-num">{t('tools.second.rows', { n: (o.meta.rowCount ?? 0).toLocaleString('en-US'), cols: o.meta.colCount ?? 0 })}</span>
        </label>
      ))}
      <button type="button" className="rs-btn rs-btn--sm rs-btn--quiet" onClick={() => onChange('new')}>
        <Icon name="upload" size={16} />
        {t('tools.second.another')}
      </button>
    </fieldset>
  );
}

/** Rows the recipe could not apply for this step (the engine's `rejected` list). */
export function Rejected({ table, stepId }) {
  const { t } = useT();
  const mine = (table?.rejected || []).filter((r) => r.stepId === stepId);
  if (!mine.length) return null;
  return (
    <div className="rs-notice rs-notice--stop" role="alert">
      <span className="rs-notice-icon"><Icon name="stop" size={20} /></span>
      <div className="rs-notice-text">
        <strong className="rs-notice-title">{t('tools.rejected.title')}</strong>
        {mine.map((r, i) => <div key={i}>{t(r.key, r.params || {})}</div>)}
      </div>
    </div>
  );
}
