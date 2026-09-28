// Random selection from the project dataset as a sampling frame, with the seed recorded [M2-DESIGN.md 7].
// The frame is this project's rows in use (one row per farm or animal). The seed is shown before the
// sample is drawn; the same seed, stream and settings draw the same sample again. The log keeps the
// seed and settings, never the list. The sample can be downloaded as CSV (settings in the first rows)
// or kept as a filter step when a column identifies each row. OWNER: ui-tools role.
import { useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { download } from '../../../lib/runtime/export.js';
import { drawSeed, GENERATOR, isSeed } from '../../../lib/plan/random.js';
import { getMethod } from '../../../lib/runtime/catalog.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { buildSpec } from '../../lib/method-ui.js';
import { formatMoment } from '../../lib/era.js';
import { safeFileBase } from '../../lib/files.js';
import { cellText } from '../../lib/grid-model.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { ColumnSelect, PreviewTable } from './ToolBits.jsx';
import { colLabel, csvWithSettings, uniqueIdColumns } from './tools-model.js';

export const SAMPLING_SCHEMES = Object.freeze(['simple', 'systematic', 'stratified']);
export const ALLOCATIONS = Object.freeze(['proportional', 'equal']);
const CAT = ['binary', 'nominal', 'ordinal'];

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { engine, notify } = useWs();
  const cb = p.codebook || p.meta.codebook;
  const cols = (cb?.columns || []).filter((c) => !c.hidden);
  const [scheme, setScheme] = useState('simple');
  const [strata, setStrata] = useState('');
  const [allocation, setAllocation] = useState('proportional');
  const [size, setSize] = useState('');
  const [seed, setSeed] = useState(() => String(drawSeed()));
  const [stream, setStream] = useState(String(GENERATOR.defaultStream));
  const [env, setEnv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState('');
  const idCols = useMemo(() => uniqueIdColumns(p.table, cb), [p.table, cb]);
  const [idKey, setIdKey] = useState('');
  const idCol = idCols.find((c) => c.key === idKey) || idCols[0] || null;
  const frameN = Object.keys(p.table?.excluded || {}).length ? (p.table.n - Object.keys(p.table.excluded).length) : p.table?.n || 0;
  const cat = getMethod('design.sampling');

  const n = Number(size);
  const seedN = Number(seed);
  const streamN = Number(stream);
  const ok = Number.isInteger(n) && n >= 1 && isSeed(seedN) && isSeed(streamN) && (scheme !== 'stratified' || strata);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const spec = buildSpec({
        method: 'design.sampling', datasetId: p.meta.id, recipeRev: p.table?.recipeRev ?? 0,
        roles: scheme === 'stratified' ? { strata } : {},
        options: { scheme, allocation, size: n, seed: seedN, stream: streamN },
      });
      const e = await engine.run(spec, p.table, p.codebook, p.meta.steps || []);
      setEnv(e);
      if (e.status === 'ok') p.log('sample', { scheme, allocation: scheme === 'stratified' ? allocation : null, size: n, seed: seedN, stream: streamN, frame: e.values?.frame?.value ?? null, strata: scheme === 'stratified' ? strata : null });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const selected = env?.status === 'ok' ? env.tables.find((tb) => tb.id === 'selected') : null;
  const strataTable = env?.status === 'ok' ? env.tables.find((tb) => tb.id === 'strata') : null;
  const rowIndex = useMemo(() => new Map((p.table?.rowIds || []).map((id, i) => [id, i])), [p.table]);
  const idText = (rowId) => (idCol ? cellText(p.table.columns[idCol.key], rowIndex.get(rowId), lang) : '');

  const settings = () => [
    [t('tools.csv.program'), t('common.appName')],
    [t('tools.csv.what'), t('tools.sampling.csvWhat')],
    [t('tools.csv.generator'), `${GENERATOR.name} (${GENERATOR.reference})`],
    [t('tools.csv.seed'), seedN],
    [t('tools.csv.stream'), streamN],
    [t('tools.sampling.scheme'), t(`tools.sampling.scheme.${scheme}`)],
    ...(scheme === 'stratified' ? [[t('tools.sampling.strata'), colLabel(cb.columns.find((c) => c.key === strata), lang)], [t('tools.sampling.allocation'), t(`tools.sampling.allocation.${allocation}`)]] : []),
    [t('tools.sampling.frame'), env?.values?.frame?.value ?? frameN],
    [t('tools.sampling.size'), n],
    [t('tools.csv.made'), formatMoment(new Date(), lang, { time: true })],
    [t('tools.csv.reproduce'), t('tools.csv.reproduceBody')],
  ];

  const csv = async () => {
    const table = {
      columns: [t('tools.sampling.order'), t('tools.rowId'), ...(idCol ? [colLabel(idCol, lang)] : []), ...(scheme === 'stratified' ? [t('tools.sampling.stratum')] : [])],
      rows: selected.rows.map((r) => [r[2], r[0], ...(idCol ? [idText(r[0])] : []), ...(scheme === 'stratified' ? [r[1]] : [])]),
    };
    const blob = new Blob([csvWithSettings(settings(), table)], { type: 'text/csv;charset=utf-8' });
    const name = `${safeFileBase(`${p.project?.name || 'sample'}-${t('tools.sampling.fileWord')}-${seedN}`)}.csv`;
    download(blob, name);
    p.log('download', { what: 'csv', format: 'csv', fileName: name, bytes: blob.size });
  };

  const keepAsFilter = async () => {
    const steps = p.meta.steps || [];
    const ids = selected.rows.map((r) => idText(r[0]));
    let step;
    try { step = makeStep(steps, 'filter', { conditions: [{ column: idCol.key, op: 'in', value: ids }], combine: 'and' }, reason.trim()); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const done = await p.commitSteps([...steps, step], { step: 'filter', stepId: step.id, source: 'sample', seed: seedN });
    if (done) notify('tools.sampling.kept', {}, 'ok');
  };

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.tools')} title={t('tools.sampling.title')} sub={t('tools.sampling.sub')} />
      <div className="rs-analysis">
        <section className="rs-analysis-setup rs-panel rs-pad rs-stack" aria-labelledby="rs-h-samp">
          <div className="rs-row">
            <h2 id="rs-h-samp" className="rs-h3 rs-grow">{t('tools.settings')}</h2>
            <VerifiedBadge show={Boolean(cat?.verified)} />
          </div>
          <p className="rs-soft rs-small">{t('tools.sampling.frameLine', { n: frameN.toLocaleString('en-US') })}</p>
          <Field label={t('tools.sampling.scheme')} htmlFor="rs-samp-scheme">
            <select id="rs-samp-scheme" className="rs-select" value={scheme} onChange={(e) => setScheme(e.target.value)}>
              {SAMPLING_SCHEMES.map((s) => <option key={s} value={s}>{t(`tools.sampling.scheme.${s}`)}</option>)}
            </select>
          </Field>
          <p className="rs-soft rs-small">{t(`tools.sampling.schemeHint.${scheme}`)}</p>
          {scheme === 'stratified' ? (
            <>
              <ColumnSelect id="rs-samp-strata" label={t('tools.sampling.strata')} value={strata} onChange={setStrata} columns={cols.filter((c) => CAT.includes(c.type))} />
              <Field label={t('tools.sampling.allocation')} htmlFor="rs-samp-alloc">
                <select id="rs-samp-alloc" className="rs-select" value={allocation} onChange={(e) => setAllocation(e.target.value)}>
                  {ALLOCATIONS.map((a) => <option key={a} value={a}>{t(`tools.sampling.allocation.${a}`)}</option>)}
                </select>
              </Field>
            </>
          ) : null}
          <Field label={t('tools.sampling.size')} htmlFor="rs-samp-size">
            <input id="rs-samp-size" className="rs-input rs-num" inputMode="numeric" value={size} onChange={(e) => setSize(e.target.value)} aria-invalid={(size !== '' && !(Number.isInteger(n) && n >= 1)) || undefined} />
          </Field>
          <SeedFields seed={seed} setSeed={setSeed} stream={stream} setStream={setStream} idPrefix="rs-samp" />
          <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !ok || !cat?.shipped} onClick={run}>
            <Icon name="search" size={18} />
            {t('tools.sampling.run')}
          </button>
          {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
        </section>
        <section className="rs-analysis-result rs-stack" aria-live="polite" aria-busy={busy || undefined}>
          {busy ? <Busy label={t('ws.analysis.running')} /> : null}
          <ErrorBox error={error} />
          {env && env.status !== 'ok' ? (
            <Notice tone="stop" title={t('tools.invalidTitle')}>
              {(env.guard?.notes || []).filter((x) => x.id === 'plan').map((x, i) => <p key={i}>{t(x.key, x.params || {})}</p>)}
              {Object.values(env.values || {}).filter((v) => v?.reasonKey && v.value === null).slice(0, 1).map((v, i) => <p key={`v${i}`}>{t(v.reasonKey)}</p>)}
            </Notice>
          ) : null}
          {selected ? (
            <>
              <p className="rs-strong">{t('tools.sampling.done', { n: selected.rows.length.toLocaleString('en-US'), frame: (env.values.frame?.value ?? 0).toLocaleString('en-US'), seed: seedN })}</p>
              {env.values.interval ? <p className="rs-soft rs-small rs-num">{t('tools.sampling.interval', { k: env.values.interval.value.toFixed(4) })}</p> : null}
              {(env.provenance?.rowsDropped || []).filter((d) => d.reason === 'missing').map((d, i) => <p key={i} className="rs-soft rs-small">{t('tools.sampling.noStratum', { n: d.count })}</p>)}
              {idCols.length > 1 ? (
                <ColumnSelect id="rs-samp-id" label={t('tools.sampling.idColumn')} value={idCol?.key || ''} onChange={setIdKey} columns={idCols} />
              ) : null}
              {strataTable ? (
                <PreviewTable caption={t('tools.sampling.strataCaption')} head={[t('tools.sampling.stratum'), t('tools.sampling.frame'), t('tools.sampling.selected')]} rows={strataTable.rows.map((r) => [r[0], r[1].toLocaleString('en-US'), r[2].toLocaleString('en-US')])} />
              ) : null}
              <PreviewTable
                caption={t('tools.sampling.listCaption')}
                head={[t('tools.rowId'), t('tools.sampling.order'), ...(idCol ? [colLabel(idCol, lang)] : []), ...(scheme === 'stratified' ? [t('tools.sampling.stratum')] : [])]}
                rows={selected.rows.slice(0, 100).map((r) => [r[0], String(r[2]), ...(idCol ? [idText(r[0])] : []), ...(scheme === 'stratified' ? [r[1]] : [])])}
                note={selected.rows.length > 100 ? t('tools.andMore', { n: (selected.rows.length - 100).toLocaleString('en-US') }) : undefined}
              />
              <SettingsList items={settings()} />
              <div className="rs-row-wrap">
                <button type="button" className="rs-btn" onClick={csv}><Icon name="down" size={18} />{t('tools.sampling.download')}</button>
              </div>
              <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-samp-keep">
                <h3 id="rs-h-samp-keep" className="rs-h3">{t('tools.sampling.keepTitle')}</h3>
                {idCol ? (
                  <>
                    <p className="rs-soft rs-small">{t('tools.sampling.keepBody', { column: colLabel(idCol, lang) })}</p>
                    <Field label={t('ws.steps.reasonRequired')} htmlFor="rs-samp-reason">
                      <input id="rs-samp-reason" className="rs-input" value={reason} maxLength={200} placeholder={t('tools.sampling.reasonExample', { seed: seedN })} onChange={(e) => setReason(e.target.value)} />
                    </Field>
                    <button type="button" className="rs-btn" disabled={!reason.trim() || p.busy} onClick={keepAsFilter}>{t('tools.sampling.keep')}</button>
                  </>
                ) : <p className="rs-soft rs-small">{t('tools.sampling.noId')}</p>}
              </section>
            </>
          ) : !busy && !env ? <p className="rs-soft">{t('tools.sampling.empty')}</p> : null}
        </section>
      </div>
    </>
  );
}

/** The settings a list was drawn with, as a short definition list. */
export function SettingsList({ items }) {
  const { t } = useT();
  return (
    <details className="rs-tl-details">
      <summary>{t('tools.csv.settingsTitle')}</summary>
      <dl className="rs-deflist rs-small">
        {items.map(([k, v]) => <div key={k} className="rs-defrow"><dt>{k}</dt><dd className="rs-num">{String(v)}</dd></div>)}
      </dl>
    </details>
  );
}

/**
 * The seed (shown before anything is drawn, with a button for a new one) and the stream.
 * @param {{ seed: string, setSeed: (s: string) => void, stream: string, setStream: (s: string) => void, idPrefix: string }} props
 */
export function SeedFields({ seed, setSeed, stream, setStream, idPrefix }) {
  const { t } = useT();
  const bad = seed !== '' && !isSeed(Number(seed));
  const badStream = stream !== '' && !isSeed(Number(stream));
  return (
    <>
      <Field label={t('tools.seed.label')} hint={t('tools.seed.hint')} htmlFor={`${idPrefix}-seed`}>
        <div className="rs-row">
          <input id={`${idPrefix}-seed`} className="rs-input rs-num rs-grow" inputMode="numeric" value={seed} onChange={(e) => setSeed(e.target.value.trim())} aria-invalid={bad || undefined} />
          <button type="button" className="rs-btn rs-btn--sm" onClick={() => setSeed(String(drawSeed()))}>{t('tools.seed.new')}</button>
        </div>
      </Field>
      {bad ? <p className="rs-small rs-rose-text" role="status">{t('tools.invalid.seed')}</p> : null}
      <details className="rs-tl-details">
        <summary>{t('tools.seed.more')}</summary>
        <Field label={t('tools.seed.stream')} hint={t('tools.seed.streamHint')} htmlFor={`${idPrefix}-stream`}>
          <input id={`${idPrefix}-stream`} className="rs-input rs-num" inputMode="numeric" value={stream} onChange={(e) => setStream(e.target.value.trim())} aria-invalid={badStream || undefined} />
        </Field>
        {badStream ? <p className="rs-small rs-rose-text" role="status">{t('tools.invalid.stream')}</p> : null}
      </details>
    </>
  );
}
