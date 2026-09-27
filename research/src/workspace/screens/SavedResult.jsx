// A kept result at /app/p/<id>/r/<analysisId> [M1-DESIGN.md 2, 9.2]: the frozen envelope exactly as it
// was computed, marked when the data changed since (never recomputed silently), with the same exports
// as a live result and a delete button. OWNER: workspace role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { navigate } from '../../router.js';
import { formatMoment } from '../lib/era.js';
import { isStale } from '../lib/result-model.js';
import { Notice, PageHead } from '../components/Bits.jsx';
import Dialog from '../components/Dialog.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import ResultView, { safeFileBase } from '../components/ResultView.jsx';
import Table1View from '../components/Table1View.jsx';
import { provenanceLines } from '../../lib/runtime/provenance.js';

/** @param {{ p: any, analysisId: string }} props */
export default function SavedResult({ p, analysisId }) {
  const { t, lang } = useT();
  const [confirm, setConfirm] = useState(false);
  const a = p.analyses.find((x) => x.id === analysisId);
  if (!a) {
    return (
      <>
        <PageHead title={t('ws.saved.missingTitle')} />
        <Notice tone="info">{t('ws.saved.missingBody')}</Notice>
        <Link to={`/app/p/${p.project.id}/report`} className="rs-btn">{t('ws.rail.report')}</Link>
      </>
    );
  }
  const cols = p.codebook?.columns || [];
  const labelOf = (key) => {
    const c = cols.find((x) => x.key === key);
    return c ? (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name) : key;
  };
  const isT1 = a.envelope?.method?.id === 'desc.table1';
  let note = '';
  try { note = isT1 ? provenanceLines(a.envelope, lang, t, labelOf).join(' ') : ''; } catch { note = ''; }
  const m = getMethod(a.spec?.method);
  const name = m ? t(m.nameKey) : a.spec?.method;
  const designRow = DESIGNS.find((d) => d.id === (a.spec?.design || p.project.design)) || null;
  return (
    <>
      <PageHead
        eyebrow={t('ws.saved.eyebrow')}
        title={name}
        sub={t('ws.saved.sub', { date: formatMoment(a.createdAt, lang, { time: true }) })}
        right={(
          <button type="button" className="rs-btn rs-btn--quiet" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={18} />
            {t('ws.saved.delete')}
          </button>
        )}
      />
      <ResultView envelope={a.envelope} title={t('ws.ss.resultTitle')} caption={name} designRow={designRow} labelOf={labelOf} codebook={p.codebook || p.meta?.codebook} hideTables={isT1} stale={isStale(a, p.table?.fingerprint)} onDownloaded={(kind) => p.log('download', { what: kind, analysisId: a.id })}>
        {isT1 && a.envelope?.status === 'ok' ? <Table1View envelope={a.envelope} labelOf={labelOf} note={note} fileBase={safeFileBase(name)} onDownloaded={(kind) => p.log('download', { what: kind, analysisId: a.id })} /> : null}
      </ResultView>
      <Link to={`/app/p/${p.project.id}/report`} className="rs-btn rs-btn--quiet">{t('ws.analysis.toReport')}<Icon name="arrow" size={16} /></Link>
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t('ws.saved.deleteTitle')}
        footer={(
          <>
            <button type="button" className="rs-btn" onClick={() => setConfirm(false)} data-autofocus>{t('ws.action.cancel')}</button>
            <button type="button" className="rs-btn rs-btn--danger" onClick={async () => { if (await p.removeSnapshot(a.id)) navigate(`/app/p/${p.project.id}/report`); }}>{t('ws.saved.deleteConfirm')}</button>
          </>
        )}
      >
        <p>{t('ws.saved.deleteBody')}</p>
      </Dialog>
    </>
  );
}
