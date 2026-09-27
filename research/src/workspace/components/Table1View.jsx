// Table 1 as printed in a paper [M1-DESIGN.md 7.4; workspace board "Table1"]: one table per level of
// organisation (animals, then farms), a row per variable and category, a column per group, missing
// counts under each variable, no p-values. Every block copies to Word and downloads as CSV with the
// provenance line under it. OWNER: workspace role.
import { useT } from '../../i18n/index.js';
import { copyTable, download, tableToCsv } from '../../lib/runtime/export.js';
import { table1Blocks, table1Export } from '../lib/table1-model.js';
import { useWs, errorInfo } from '../ws-context.js';
import { FMT, safeFileBase } from './ResultView.jsx';
import { Notice } from './Bits.jsx';
import Icon from './Icon.jsx';

/** @param {{ envelope: any, labelOf: (key: string) => string, note: string, fileBase: string, onDownloaded?: (kind: string) => void }} props */
export default function Table1View({ envelope, labelOf, note, fileBase, onDownloaded }) {
  const { t } = useT();
  const { notify } = useWs();
  const { blocks, inconsistent } = table1Blocks(envelope, { t, fmt: FMT, labelOf });
  const captionOf = (b) => (b.unit === 'cluster' ? t('ws.table1.block.cluster') : t('ws.table1.block.unit', { unit: t(`ws.level.${b.unit}`) }));

  const copy = async (b) => {
    try {
      const how = await copyTable(table1Export(b, captionOf(b), note));
      notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.table', {}, how === 'failed' ? 'error' : 'ok');
      if (how !== 'failed') onDownloaded?.('clipboard');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };
  const csv = (b) => {
    try {
      download(new Blob([tableToCsv(table1Export(b, captionOf(b), note))], { type: 'text/csv;charset=utf-8' }), `${safeFileBase(`${fileBase}-${b.unit}`)}.csv`);
      onDownloaded?.('csv');
    } catch (err) { notify(errorInfo(err).key, {}, 'error'); }
  };

  return (
    <div className="rs-stack">
      {inconsistent.length ? (
        <Notice tone="warn" title={t('ws.table1.inconsistentTitle')}>
          {inconsistent.map((x) => <div key={x.variable}>{t('ws.table1.inconsistent', { name: x.variable, n: x.clusters })}</div>)}
        </Notice>
      ) : null}
      {blocks.map((b) => (
        <div key={b.id} className="rs-envtable">
          <div className="rs-tablewrap">
            <table className="rs-table rs-table--t1 rs-num">
              <caption className="rs-table-cap">{captionOf(b)}</caption>
              <thead>
                <tr>{b.columns.map((h, i) => <th key={i} scope="col" className={i ? 'rs-r' : ''}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri} className={`rs-t1-${r.kind}`}>
                    <th scope="row">{r.label}</th>
                    {r.cells.map((c, ci) => <td key={ci} className="rs-r">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rs-row-wrap">
            <button type="button" className="rs-btn rs-btn--sm" onClick={() => copy(b)}><Icon name="copy" size={16} />{t('ws.action.copyWord')}</button>
            <button type="button" className="rs-btn rs-btn--sm" onClick={() => csv(b)}><Icon name="down" size={16} />{t('ws.action.downloadCsv')}</button>
          </div>
        </div>
      ))}
      <p className="rs-soft rs-small">{t('ws.table1.noTests')}</p>
    </div>
  );
}
