// Multi-panel figures from the charts of saved results, at a journal column width, exported as SVG, PNG, TIFF
// or printed to PDF [M2-DESIGN.md 8.3]. The composer (components/FigureComposer.jsx, ui-analysis) lists the
// charts of the kept results and lays them out with the chart kit's composeFigure; this pane adds the
// epidemic curve of a date column in the data now open (counts by day, ISO week or month; empty bins drawn
// as zero), which is a picture of the data rather than of a result. Every file is made on this device.
// OWNER: graphs role.
import { useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { formatCi, formatNumber, formatP } from '../../lib/stats/format.js';
import { AutoChart } from '../charts/Chart.jsx';
import { epiCurveInput } from '../charts/from-result.js';
import { safeFileBase } from '../lib/files.js';
import { Field, Notice, PageHead } from '../components/Bits.jsx';
import FigureComposer from '../components/FigureComposer.jsx';
import { levelNameFor } from '../report/build.js';

const FMT = Object.freeze({ formatNumber, formatP, formatCi });
const UNITS = ['day', 'isoWeek', 'month'];

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  const { t, lang } = useT();
  const table = p.table || null;
  const codebook = p.codebook || p.meta?.codebook || null;
  const labelOf = (key) => {
    const c = codebook?.columns?.find((x) => x.key === key);
    return c ? (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name) : key;
  };
  const cols = Object.entries(table?.columns || {});
  const dateKeys = cols.filter(([, c]) => c?.kind === 'date').map(([k]) => k);
  const groupKeys = cols.filter(([, c]) => c?.kind === 'category' && (c.levels?.length || 0) >= 2 && c.levels.length <= 8).map(([k]) => k);
  const [dateKey, setDateKey] = useState('');
  const [groupKey, setGroupKey] = useState('');
  const [unit, setUnit] = useState('isoWeek');
  const dk = dateKeys.includes(dateKey) ? dateKey : dateKeys[0] || '';
  const gk = groupKeys.includes(groupKey) ? groupKey : '';
  const madeUp = Boolean(p.project?.madeUp || p.meta?.madeUp);
  const epi = useMemo(() => {
    if (!dk) return null;
    const inp = epiCurveInput(table, dk, gk || null, labelOf, levelNameFor(codebook, lang));
    return inp.series.length ? { ...inp, unit } : null;
  }, [table, dk, gk, unit, lang]);

  return (
    <>
      <PageHead eyebrow={t('graphs.figures.eyebrow')} title={t('graphs.figures.title')} sub={t('graphs.figures.sub')} />
      <FigureComposer p={p} />
      <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-epi">
        <h2 id="rs-h-epi" className="rs-h3">{t('graphs.figures.epi.title')}</h2>
        {!dateKeys.length ? <Notice tone="info">{t('graphs.figures.epi.noDate')}</Notice> : (
          <>
            <div className="rs-row-wrap">
              <Field label={t('graphs.figures.epi.date')} htmlFor="rs-epi-date">
                <select id="rs-epi-date" className="rs-select" value={dk} onChange={(e) => setDateKey(e.target.value)}>
                  {dateKeys.map((k) => <option key={k} value={k}>{labelOf(k)}</option>)}
                </select>
              </Field>
              <Field label={t('graphs.figures.epi.group')} htmlFor="rs-epi-group">
                <select id="rs-epi-group" className="rs-select" value={gk} onChange={(e) => setGroupKey(e.target.value)}>
                  <option value="">{t('graphs.figures.epi.none')}</option>
                  {groupKeys.map((k) => <option key={k} value={k}>{labelOf(k)}</option>)}
                </select>
              </Field>
            </div>
            <fieldset className="rs-fieldset">
              <legend className="rs-field-label">{t('graphs.figures.epi.unit')}</legend>
              <div className="rs-seg" role="presentation">
                {UNITS.map((u) => (
                  <label key={u} className="rs-seg-btn rs-seg-radio">
                    <input type="radio" name="rs-epi-unit" value={u} checked={unit === u} onChange={() => setUnit(u)} />
                    {t(`graphs.epi.unit.${u}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            {epi ? (
              <AutoChart
                kind="epiCurve"
                input={epi}
                title={t('graphs.kind.epiCurve')}
                madeUp={madeUp}
                fmt={FMT}
                fileBase={safeFileBase(`${p.project?.name || 'figure'}-${labelOf(dk)}`)}
                onDownloaded={(kind) => p.log?.('download', { what: kind, chart: 'epiCurve' })}
              />
            ) : <Notice tone="info">{t('graphs.error.noDates')}</Notice>}
          </>
        )}
      </section>
    </>
  );
}
