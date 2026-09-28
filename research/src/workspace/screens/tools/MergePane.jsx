// Merge a second file into this dataset by a key (a farm file into an animal file), with the unmatched
// rows listed before the step is saved [M2-DESIGN.md 4.1]. Many-to-one only: a key that repeats in the
// second file stops the step with the list. Rows of this dataset whose key the second file does not have
// stay, with the brought columns missing (reason: no match), and are counted here first.
// OWNER: ui-tools role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { makeStep } from '../../../lib/intake/recipe.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { Busy, ErrorBox, Notice, PageHead } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import { ColumnChecks, ColumnSelect, IdList, PreviewTable, Rejected, SecondFile } from './ToolBits.jsx';
import { colLabel, keyMatch, previewRows } from './tools-model.js';

const KEY_TYPES = ['id', 'nominal', 'text', 'count', 'binary', 'ordinal'];

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const steps = p.meta.steps || [];
  const cb = p.codebook || p.meta.codebook;
  const [sourceId, setSourceId] = useState(null);
  const [right, setRight] = useState(null);
  const [leftKey, setLeftKey] = useState('');
  const [rightKey, setRightKey] = useState('');
  const [columns, setColumns] = useState([]);
  const [preview, setPreview] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const source = (p.others || []).find((o) => o.meta.id === sourceId) || null;
  const rightCb = right?.codebook || source?.meta.codebook || null;

  useEffect(() => {
    if (sourceId || !(p.others || []).length) return;
    const first = p.others.find((o) => !o.meta.purpose || o.meta.purpose === 'merge');
    if (first) setSourceId(first.meta.id);
  }, [p.others, sourceId]);

  useEffect(() => {
    let live = true;
    setRight(null);
    setPreview(null);
    if (!source) return undefined;
    p.otherTable(source.meta.id).then((tb) => { if (live) setRight(tb); }).catch((err) => { if (live) setError(errorInfo(err)); });
    return () => { live = false; };
  }, [source?.meta.id, source?.meta.rev]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sensible first choices: the farm column on both sides.
  useEffect(() => {
    if (!leftKey && cb?.clusterKey) setLeftKey(cb.clusterKey);
    if (!rightKey && rightCb) {
      const byName = rightCb.columns.find((c) => c.name === cb?.columns.find((x) => x.key === cb?.clusterKey)?.name);
      const pick = byName || rightCb.columns.find((c) => c.key === rightCb.clusterKey) || rightCb.columns.find((c) => c.type === 'id');
      if (pick) setRightKey(pick.key);
    }
  }, [cb, rightCb]); // eslint-disable-line react-hooks/exhaustive-deps

  const leftCols = (cb?.columns || []).filter((c) => !c.hidden && KEY_TYPES.includes(c.type));
  const rightKeyCols = (rightCb?.columns || []).filter((c) => !c.hidden && KEY_TYPES.includes(c.type));
  const bringable = (rightCb?.columns || []).filter((c) => !c.hidden && c.key !== rightKey);
  const report = useMemo(() => (p.table && right && leftKey && rightKey ? keyMatch(p.table, leftKey, right, rightKey) : null), [p.table, right, leftKey, rightKey]);
  const params = source && leftKey && rightKey && columns.length ? { sourceDatasetId: source.meta.id, sourceRev: source.meta.rev, leftKey, rightKey, columns } : null;
  const duplicates = report?.duplicateRight.length || 0;
  const unmatched = report ? report.unmatchedLeft.length : 0;

  useEffect(() => { setAgreed(false); setPreview(null); }, [leftKey, rightKey, columns.join(','), sourceId]);

  const candidate = () => makeStep(steps, 'merge', params, null);

  const look = async () => {
    setBusy(true);
    setError(null);
    try {
      const step = candidate();
      const tb = await p.previewSteps([...steps, step]);
      const added = (tb?.codebook?.columns || []).filter((c) => !(p.table?.codebook?.columns || cb.columns).some((x) => x.key === c.key));
      setPreview({ step, table: tb, added });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    let step;
    try { step = candidate(); } catch (err) { notify(errorInfo(err).key, {}, 'error'); return; }
    const ok = await p.commitSteps([...steps, step], { step: 'merge', stepId: step.id, matched: report?.matched ?? null, unmatched });
    if (ok) {
      notify('tools.merge.saved', { n: columns.length }, 'ok');
      setColumns([]);
      setPreview(null);
    }
  };

  const nameOf = (list, key) => colLabel((list || []).find((c) => c.key === key), lang);
  // What the recipe itself reported when the preview replayed the step (the counts the saved step will have).
  const engineReport = preview ? (preview.table?.transforms || []).find((x) => x.stepId === preview.step.id)?.report || null : null;

  return (
    <>
      <PageHead eyebrow={t('ws.rail.group.dataTools')} title={t('tools.merge.title')} sub={t('tools.merge.sub')} />
      <SecondFile p={p} purpose="merge" value={sourceId} onChange={setSourceId} />
      <ErrorBox error={error} />
      {source && sourceId !== 'new' ? (
        <div className="rs-tl-cols">
          <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-merge-keys">
            <h2 id="rs-h-merge-keys" className="rs-h3">{t('tools.merge.keysTitle')}</h2>
            <p className="rs-soft rs-small">{t('tools.merge.keysBody')}</p>
            <ColumnSelect id="rs-merge-left" label={t('tools.merge.leftKey')} value={leftKey} onChange={setLeftKey} columns={leftCols} />
            <ColumnSelect id="rs-merge-right" label={t('tools.merge.rightKey', { file: source.meta.source?.fileName || '' })} value={rightKey} onChange={setRightKey} columns={rightKeyCols} />
            {right ? (
              <ColumnChecks legend={t('tools.merge.bring')} hint={t('tools.merge.bringHint')} columns={bringable} value={columns} onChange={setColumns} />
            ) : <Busy label={t('common.loading')} />}
          </section>
          <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-merge-report" aria-live="polite">
            <h2 id="rs-h-merge-report" className="rs-h3">{t('tools.merge.reportTitle')}</h2>
            {!report ? <p className="rs-soft">{t('tools.merge.reportEmpty')}</p> : (
              <>
                <dl className="rs-deflist">
                  <div className="rs-defrow"><dt>{t('tools.merge.matched')}</dt><dd className="rs-num">{report.matched.toLocaleString('en-US')}</dd></div>
                  <div className="rs-defrow"><dt>{t('tools.merge.unmatchedLeft')}</dt><dd className="rs-num">{unmatched.toLocaleString('en-US')}</dd></div>
                  <div className="rs-defrow"><dt>{t('tools.merge.unmatchedRight')}</dt><dd className="rs-num">{report.unmatchedRight.length.toLocaleString('en-US')}</dd></div>
                </dl>
                {duplicates ? (
                  <Notice tone="stop" title={t('tools.merge.duplicatesTitle', { n: duplicates })}>
                    <p>{t('tools.merge.duplicatesBody', { column: nameOf(rightCb?.columns, rightKey) })}</p>
                    <IdList items={report.duplicateRight} />
                  </Notice>
                ) : null}
                {unmatched ? (
                  <Notice tone="warn" title={t('tools.merge.unmatchedTitle', { n: unmatched.toLocaleString('en-US') })}>
                    <p>{t('tools.merge.unmatchedBody')}</p>
                    <IdList items={report.unmatchedLeft.map((u) => (u.key === '' ? t('tools.merge.blankKeyRow', { row: u.rowId }) : u.key))} />
                  </Notice>
                ) : null}
                {report.unmatchedRight.length ? (
                  <div>
                    <p className="rs-small">{t('tools.merge.unmatchedRightBody', { file: source.meta.source?.fileName || '' })}</p>
                    <IdList items={report.unmatchedRight} />
                  </div>
                ) : null}
                <button type="button" className="rs-btn" disabled={!params || duplicates > 0 || busy} onClick={look}>
                  <Icon name="eye" size={18} />
                  {t('tools.previewButton')}
                </button>
                {busy ? <Busy label={t('tools.previewing')} /> : null}
                {preview ? (
                  <>
                    <Rejected table={preview.table} stepId={preview.step.id} />
                    {engineReport ? <p className="rs-small rs-num">{t('tools.merge.engineLine', { matched: (engineReport.matched ?? 0).toLocaleString('en-US'), unmatched: ((engineReport.unmatchedLeft?.length || 0) + (engineReport.missingLeftKey?.length || 0)).toLocaleString('en-US') })}</p> : null}
                    <PreviewTable
                      caption={t('tools.merge.previewCaption')}
                      head={[t('tools.rowId'), nameOf(cb.columns, leftKey), ...preview.added.map((c) => colLabel(c, lang))]}
                      rows={previewRows(preview.table, [leftKey, ...preview.added.map((c) => c.key)], 8, lang)}
                    />
                  </>
                ) : null}
                {unmatched ? (
                  <label className="rs-check">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <span>{t('tools.merge.agree', { n: unmatched.toLocaleString('en-US') })}</span>
                  </label>
                ) : null}
                <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!params || duplicates > 0 || (unmatched > 0 && !agreed) || p.busy} onClick={save}>
                  {t('tools.merge.save', { n: columns.length })}
                </button>
                {!columns.length ? <p className="rs-soft rs-small" role="status">{t('tools.merge.needColumns')}</p> : null}
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
