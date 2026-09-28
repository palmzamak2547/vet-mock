// A column from a formula, with the function list, a live preview on the first rows and every invalid
// row listed [M2-DESIGN.md 4.4]. The formula is read by a fixed grammar (lib/intake/expr.js); nothing the
// student types is run as code. Columns are written in braces as their header reads ({OD control}).
// A missing value gives a missing result; a value that cannot be computed (division by zero, the square
// root of a negative number) is listed by row. OWNER: ui-tools role.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { evaluateExpression, parseExpression } from '../../../lib/intake/expr.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { Field, Notice, PageHead } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { cellText } from '../../lib/grid-model.js';
import { IdList, PreviewTable } from './ToolBits.jsx';
import { colLabel, freshKeys, newEntry } from './tools-model.js';

/** The fixed function list [M2-DESIGN.md 4.4], each with how it is written. */
export const EXPR_FUNCTIONS = Object.freeze([
  ['abs', 'abs(x)'], ['sqrt', 'sqrt(x)'], ['ln', 'ln(x)'], ['log10', 'log10(x)'], ['exp', 'exp(x)'],
  ['round', 'round(x, 1)'], ['floor', 'floor(x)'], ['ceil', 'ceil(x)'], ['min', 'min(a, b)'], ['max', 'max(a, b)'],
  ['sum', 'sum(a, b, c)'], ['mean', 'mean(a, b, c)'], ['if', 'if(x > 1, a, b)'], ['isMissing', 'isMissing(x)'],
  ['daysBetween', 'daysBetween(a, b)'], ['monthsBetween', 'monthsBetween(birth, event)'],
]);
export const EXPR_TYPES = Object.freeze(['number', 'boolean']);
/** The codebook type the step records for each kind of result (recipe.js validates it against TYPES). */
const STEP_TYPE = Object.freeze({ number: 'continuous', boolean: 'binary' });
const PREVIEW_ROWS = 10;

/** Result cell as text: numbers as their shortest form, yes/no for a comparison. */
function resultText(values, missing, i, type, t) {
  if (missing[i]) return '';
  const v = values[i];
  if (type === 'boolean') return v === 1 ? t('tools.compute.yes') : t('tools.compute.no');
  return Number.isFinite(v) ? String(v) : '';
}

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const cb = p.codebook || p.meta.codebook;
  const cols = (cb?.columns || []).filter((c) => !c.hidden);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('number');
  const [typed, setTyped] = useState(text);
  const area = useRef(null);
  const [target] = freshKeys(p.meta.codebook, steps, 1);

  // Read the formula a moment after the last key, so each key press stays quick on a large file.
  useEffect(() => {
    const id = setTimeout(() => setTyped(text), 180);
    return () => clearTimeout(id);
  }, [text]);

  const refCols = useMemo(() => cols.map((c) => ({ key: c.key, name: c.name, type: c.type, positive: c.positive ?? null })), [cols]);
  const parsed = useMemo(() => {
    if (!typed.trim()) return null;
    try { return parseExpression(typed, refCols); } catch (err) { return { ok: false, key: errorInfo(err).key, at: 0, broken: true }; }
  }, [typed, refCols]);
  const result = useMemo(() => {
    if (!parsed?.ok || !p.table) return null;
    try { return { ...evaluateExpression(parsed.ast, p.table), error: null }; } catch (err) { return { error: errorInfo(err) }; }
  }, [parsed, p.table]);

  useEffect(() => { if (parsed?.ok && EXPR_TYPES.includes(parsed.type)) setType(parsed.type); }, [parsed]);

  const insert = (snippet) => {
    const el = area.current;
    const start = el ? el.selectionStart : text.length;
    const end = el ? el.selectionEnd : text.length;
    const next = text.slice(0, start) + snippet + text.slice(end);
    setText(next);
    requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(start + snippet.length, start + snippet.length); } });
  };

  const invalidRows = useMemo(() => {
    if (!result || result.error) return [];
    if (Array.isArray(result.invalidRows)) return result.invalidRows.map((x) => x.rowId);
    const out = [];
    for (let i = 0; i < (p.table?.n || 0); i += 1) if (result.missing[i] === 5) out.push(p.table.rowIds[i]);
    return out;
  }, [result, p.table]);
  const missingCount = useMemo(() => {
    if (!result || result.error) return 0;
    let n = 0;
    for (let i = 0; i < (p.table?.n || 0); i += 1) if (result.missing[i] && result.missing[i] !== 5) n += 1;
    return n;
  }, [result, p.table]);

  const refKeys = parsed?.ok ? parsed.refs.filter((k) => cols.some((c) => c.key === k)).slice(0, 4) : [];
  const rows = [];
  if (result && !result.error && p.table) {
    for (let i = 0; i < Math.min(PREVIEW_ROWS, p.table.n); i += 1) {
      rows.push([p.table.rowIds[i], ...refKeys.map((k) => cellText(p.table.columns[k], i, lang)), result.missing[i] === 5 ? t('tools.compute.invalidCell') : resultText(result.values, result.missing, i, type, t)]);
    }
  }

  const ready = Boolean(parsed?.ok && name.trim() && result && !result.error);
  const save = async () => {
    let step;
    try { step = makeStep(steps, 'compute', { target, expression: text.trim(), type: STEP_TYPE[type] }, null); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const entry = newEntry(target, name.trim(), type === 'boolean'
      ? { type: 'binary', levels: [{ value: '1', labelTh: t('tools.compute.yes'), labelEn: 'yes' }, { value: '0', labelTh: t('tools.compute.no'), labelEn: 'no' }], positive: '1' }
      : { type: 'continuous' });
    const ok = await p.commitStepsWithColumn([...steps, step], entry, { step: 'compute', stepId: step.id });
    if (ok) {
      notify('ws.steps.added', {}, 'ok');
      setText('');
      setName('');
    }
  };

  const errorAt = parsed && !parsed.ok && !parsed.broken ? Math.max(0, Math.min(typed.length, parsed.at ?? 0)) : null;

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.compute.title')} sub={t('tools.compute.sub')} />
      <div className="rs-tl-cols">
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-compute">
          <h2 id="rs-h-compute" className="rs-h3">{t('tools.compute.formula')}</h2>
          <Field label={t('tools.newColumnName')} htmlFor="rs-compute-name">
            <input id="rs-compute-name" className="rs-input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={t('tools.compute.expression')} hint={t('tools.compute.expressionHint')} htmlFor="rs-compute-expr">
            <textarea id="rs-compute-expr" ref={area} className="rs-input rs-mono rs-tl-expr" rows={3} spellCheck={false} value={text} onChange={(e) => setText(e.target.value)} aria-invalid={Boolean(parsed && !parsed.ok) || undefined} aria-describedby="rs-compute-status" />
          </Field>
          <div id="rs-compute-status" role="status" aria-live="polite">
            {parsed && !parsed.ok ? (
              <Notice tone="stop" title={t('tools.compute.parseTitle')}>
                <p>{t(parsed.key, { ...(parsed.params || {}), at: (errorAt ?? 0) + 1 })}</p>
                {errorAt !== null ? (
                  <p className="rs-mono rs-tl-caret" aria-hidden="true">
                    <span>{typed.slice(0, errorAt)}</span><mark>{typed.slice(errorAt, errorAt + 1) || ' '}</mark><span>{typed.slice(errorAt + 1)}</span>
                  </p>
                ) : null}
                {errorAt !== null ? <p className="rs-soft rs-small">{t('tools.compute.parseAt', { at: errorAt + 1 })}</p> : null}
              </Notice>
            ) : null}
            {result?.error ? <Notice tone="stop" title={t(result.error.key)} /> : null}
          </div>
          <Field label={t('tools.compute.type')} htmlFor="rs-compute-type">
            <select id="rs-compute-type" className="rs-select" value={type} onChange={(e) => setType(e.target.value)}>
              {EXPR_TYPES.map((x) => <option key={x} value={x}>{t(`tools.compute.type.${x}`)}</option>)}
            </select>
          </Field>
          <details className="rs-tl-details" open>
            <summary>{t('tools.compute.columnsTitle')}</summary>
            <div className="rs-row-wrap">
              {cols.map((c) => <button key={c.key} type="button" className="rs-btn rs-btn--sm" onClick={() => insert(`{${c.name}}`)} title={colLabel(c, lang)}>{c.name}</button>)}
            </div>
          </details>
          <details className="rs-tl-details">
            <summary>{t('tools.compute.functionsTitle')}</summary>
            <ul className="rs-plainlist rs-small rs-tl-fnlist">
              {EXPR_FUNCTIONS.map(([fn, how]) => (
                <li key={fn}>
                  <button type="button" className="rs-btn rs-btn--sm rs-mono" onClick={() => insert(`${fn}(`)}>{how}</button>
                  <span>{t(`tools.compute.fn.${fn}`)}</span>
                </li>
              ))}
            </ul>
            <p className="rs-soft rs-small">{t('tools.compute.operators')}</p>
          </details>
        </section>
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-compute-pv">
          <h2 id="rs-h-compute-pv" className="rs-h3">{t('tools.compute.previewTitle', { n: PREVIEW_ROWS })}</h2>
          {!parsed ? <p className="rs-soft">{t('tools.compute.previewEmpty')}</p> : null}
          {rows.length ? (
            <PreviewTable caption={t('tools.compute.previewCaption')} head={[t('tools.rowId'), ...refKeys.map((k) => colLabel(cols.find((c) => c.key === k), lang)), name.trim() || t('tools.compute.resultHead')]} rows={rows} />
          ) : null}
          {result && !result.error ? (
            <>
              <p className="rs-small rs-num">{t('tools.compute.counts', { missing: missingCount.toLocaleString('en-US'), invalid: invalidRows.length.toLocaleString('en-US') })}</p>
              {invalidRows.length ? (
                <Notice tone="warn" title={t('tools.compute.invalidTitle', { n: invalidRows.length.toLocaleString('en-US') })}>
                  <p>{t('tools.compute.invalidBody')}</p>
                  <IdList items={invalidRows} />
                </Notice>
              ) : null}
            </>
          ) : null}
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!ready || p.busy} onClick={save}>
            <Icon name="plus" size={18} />
            {t('tools.compute.save')}
          </button>
          {!name.trim() && parsed?.ok ? <p className="rs-soft rs-small" role="status">{t('tools.compute.needName')}</p> : null}
        </section>
      </div>
    </>
  );
}
