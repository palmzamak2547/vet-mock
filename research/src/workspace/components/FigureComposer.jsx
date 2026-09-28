// The figure composer [M2-DESIGN.md 8.3]: the charts of the kept results are listed; the student ticks
// the two to six panels a figure needs, puts them in order, picks the columns and a journal column width
// (or types one) and whether the panels carry A, B, C, sees the figure, and downloads it as SVG, PNG or
// TIFF at 300 or 600 dpi, or prints it to PDF from a page the size of the figure. Every panel is the chart
// the result showed, built again at its printed width by the chart kit (charts/figure.js, raster.js and
// print.js, graphs role); every file is made on this device. The multi-panel figures pane mounts this.
// OWNER: ui-analysis role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { composeFigure } from '../charts/figure.js';
import { downloadFigure } from '../charts/raster.js';
import { printFigure } from '../charts/print.js';
import { formatMoment } from '../lib/era.js';
import { safeFileBase } from '../lib/files.js';
import { FIGURE_WIDTHS, FIGURE_WIDTH_RANGE, MAX_COLUMNS, PANEL_RANGE, figureCandidates, figureLayout, movePanel, panelCountOk, panelLetter, panelWidthMm, parseWidth, togglePanel } from '../lib/figure-model.js';
import { useWs, errorInfo } from '../ws-context.js';
import { Field, Notice } from './Bits.jsx';
import { tryBuildChart } from './ChartSlot.jsx';
import Icon from './Icon.jsx';
import Link from './Link.jsx';
import { levelNameFor } from '../report/build.js';

/** @param {{ p: any }} props */
export default function FigureComposer({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const codebook = p.codebook || p.meta?.codebook || null;
  const labelOf = (key) => {
    const c = codebook?.columns?.find((x) => x.key === key);
    return c ? (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name) : key;
  };
  const candidates = useMemo(
    () => figureCandidates(p.analyses || [], p.table || null, { labelOf, levelOf: levelNameFor(codebook, lang), fingerprint: p.table?.fingerprint ?? null, t }),
    // labelOf follows the codebook and the language
    [p.analyses, p.table, codebook, lang, t],
  );
  const [keys, setKeys] = useState([]);
  const [columns, setColumns] = useState(2);
  const [widthChoice, setWidthChoice] = useState('174');
  const [typed, setTyped] = useState('');
  const [labels, setLabels] = useState(true);
  const [dpi, setDpi] = useState(300);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  // A kept result that was deleted takes its panels with it.
  useEffect(() => { setKeys((k) => k.filter((x) => candidates.some((c) => c.key === x))); }, [candidates]);

  const typedWidth = widthChoice === 'typed' ? parseWidth(typed) : null;
  const widthMm = widthChoice === 'typed' ? (typedWidth?.ok ? typedWidth.mm : null) : Number(widthChoice);
  const chosen = keys.map((k) => candidates.find((c) => c.key === k)).filter(Boolean);
  const layout = widthMm ? figureLayout({ columns, widthMm, labels }, chosen.length) : null;
  const full = keys.length >= PANEL_RANGE[1];

  const figure = useMemo(() => {
    if (!layout || !panelCountOk(chosen.length)) return null;
    const models = chosen.map((c) => tryBuildChart(c, { lang, t, widthMm: panelWidthMm(layout), title: t(c.titleKey) }));
    if (models.some((m) => !m)) return { failed: true };
    try {
      return composeFigure(models, { ...layout, theme: 'print', madeUpNote: p.project?.example ? t('graphs.madeUp') : '' });
    } catch {
      return { failed: true };
    }
  }, [chosen.map((c) => c.key).join('|'), layout?.columns, layout?.widthMm, layout?.labels, lang, t]);

  useEffect(() => {
    if (!figure?.svg) { setPreview(null); return undefined; }
    const url = URL.createObjectURL(new Blob([figure.svg], { type: 'image/svg+xml' }));
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [figure?.svg]);

  const fileBase = safeFileBase(`${p.project?.name || 'figure'}-${t('ws.figure.fileWord')}${p.project?.example ? `-${t('graphs.madeUp')}` : ''}`);
  const save = async (format) => {
    setBusy(true);
    try {
      await downloadFigure(format, { svgText: figure.svg, fileBase, widthMm: figure.widthMm, dpi });
      await p.log?.('download', { what: 'figure', format, panels: chosen.length });
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    } finally {
      setBusy(false);
    }
  };
  const savePdf = () => {
    try {
      printFigure(figure.svg, { widthMm: figure.widthMm, heightMm: figure.heightMm, title: fileBase });
      p.log?.('download', { what: 'figure', format: 'pdf', panels: chosen.length });
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const nameOf = (c) => {
    const m = getMethod(c.methodId);
    return m ? t(m.nameKey) : c.methodId;
  };

  if (!candidates.length) {
    return (
      <Notice tone="info" title={t('ws.figure.emptyTitle')} action={<Link to={`/app/p/${p.project.id}/design`} className="rs-btn">{t('ws.rail.design')}</Link>}>
        {t('ws.figure.emptyBody')}
      </Notice>
    );
  }

  return (
    <div className="rs-composer">
      <section className="rs-composer-pick rs-panel rs-pad rs-stack" aria-labelledby="rs-h-panels">
        <h2 id="rs-h-panels" className="rs-h3">{t('ws.figure.panelsTitle')}</h2>
        <p className="rs-soft rs-small">{t('ws.figure.panelsHelp', { min: PANEL_RANGE[0], max: PANEL_RANGE[1] })}</p>
        <ul className="rs-plainlist rs-composer-list">
          {candidates.map((c) => {
            const pos = keys.indexOf(c.key);
            const title = t(c.titleKey);
            return (
              <li key={c.key} className={`rs-composer-item${pos >= 0 ? ' rs-composer-item--on' : ''}`}>
                <label className="rs-check">
                  <input type="checkbox" checked={pos >= 0} disabled={pos < 0 && full} onChange={() => setKeys((k) => togglePanel(k, c.key))} />
                  <span className="rs-choice-text">
                    <span className="rs-choice-title">{pos >= 0 && labels ? `${panelLetter(pos)} ` : ''}{title}</span>
                    <span className="rs-soft rs-small">{nameOf(c)}{c.createdAt ? `, ${formatMoment(c.createdAt, lang, { time: true })}` : ''}</span>
                    {c.stale ? <span className="rs-soft rs-small">{t('ws.figure.stale')}</span> : null}
                  </span>
                </label>
                {pos >= 0 ? (
                  <span className="rs-row">
                    <button type="button" className="rs-iconbtn rs-iconbtn--sm" onClick={() => setKeys((k) => movePanel(k, c.key, -1))} disabled={pos === 0} aria-label={t('ws.figure.moveUp', { panel: title })}><Icon name="chevUp" size={16} /></button>
                    <button type="button" className="rs-iconbtn rs-iconbtn--sm" onClick={() => setKeys((k) => movePanel(k, c.key, 1))} disabled={pos === keys.length - 1} aria-label={t('ws.figure.moveDown', { panel: title })}><Icon name="chev" size={16} /></button>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
        {full ? <p className="rs-soft rs-small">{t('ws.figure.full', { max: PANEL_RANGE[1] })}</p> : null}
      </section>

      <section className="rs-composer-layout rs-stack" aria-labelledby="rs-h-layout">
        <h2 id="rs-h-layout" className="rs-h3">{t('ws.figure.layoutTitle')}</h2>
        <fieldset className="rs-fieldset">
          <legend className="rs-field-label">{t('ws.figure.width')}</legend>
          <div className="rs-seg rs-seg--wrap" role="presentation">
            {[...FIGURE_WIDTHS.map(String), 'typed'].map((w) => (
              <label key={w} className="rs-seg-btn rs-seg-radio">
                <input type="radio" name="rs-fig-width" value={w} checked={widthChoice === w} onChange={() => setWidthChoice(w)} />
                {t(`ws.figure.width.${w}`)}
              </label>
            ))}
          </div>
          {widthChoice === 'typed' ? (
            <Field label={t('ws.figure.typedWidth')} hint={typedWidth && !typedWidth.ok && typed ? t(typedWidth.key, { min: FIGURE_WIDTH_RANGE[0], max: FIGURE_WIDTH_RANGE[1] }) : t('ws.figure.typedHint', { min: FIGURE_WIDTH_RANGE[0], max: FIGURE_WIDTH_RANGE[1] })} htmlFor="rs-fig-typed">
              <input id="rs-fig-typed" className="rs-input rs-input--num rs-num" inputMode="decimal" value={typed} onChange={(e) => setTyped(e.target.value)} />
            </Field>
          ) : null}
        </fieldset>
        <Field label={t('ws.figure.columns')} htmlFor="rs-fig-cols">
          <select id="rs-fig-cols" className="rs-select" value={String(columns)} onChange={(e) => setColumns(Number(e.target.value))}>
            {Array.from({ length: MAX_COLUMNS }, (_, i) => i + 1).map((n) => <option key={n} value={String(n)}>{t('ws.figure.columnsValue', { n })}</option>)}
          </select>
        </Field>
        <label className="rs-check">
          <input type="checkbox" checked={labels} onChange={(e) => setLabels(e.target.checked)} />
          {t('ws.figure.labels')}
        </label>
      </section>

      <section className="rs-composer-preview rs-stack" aria-labelledby="rs-h-preview" aria-live="polite">
        <h2 id="rs-h-preview" className="rs-h3">{t('ws.figure.previewTitle')}</h2>
        {chosen.length < PANEL_RANGE[0] ? <p className="rs-soft">{t('ws.figure.pickFirst', { min: PANEL_RANGE[0] })}</p> : null}
        {chosen.length >= PANEL_RANGE[0] && !layout ? <p className="rs-soft">{t('ws.figure.widthFirst')}</p> : null}
        {figure?.failed ? <Notice tone="warn">{t('ws.figure.cannotDraw')}</Notice> : null}
        {preview && figure?.svg ? (
          <>
            <img className="rs-composer-img" src={preview} alt={t('ws.figure.previewAlt', { n: chosen.length, width: figure.widthMm })} />
            <p className="rs-soft rs-small rs-num">{t('ws.figure.size', { width: Math.round(figure.widthMm), height: Math.round(figure.heightMm) })}</p>
            {figure.scaled?.length ? <p className="rs-soft rs-small">{t('ws.figure.scaled', { panels: figure.scaled.map(panelLetter).join(', ') })}</p> : null}
            <fieldset className="rs-fieldset">
              <legend className="rs-field-label">{t('ws.chart.dpi')}</legend>
              <div className="rs-seg" role="presentation">
                {[300, 600].map((d) => (
                  <label key={d} className="rs-seg-btn rs-seg-radio">
                    <input type="radio" name="rs-fig-dpi" value={d} checked={dpi === d} onChange={() => setDpi(d)} />
                    {t('ws.chart.dpiValue', { dpi: d })}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="rs-row-wrap">
              <button type="button" className="rs-btn" onClick={() => save('svg')} disabled={busy}><Icon name="down" size={18} />{t('ws.chart.svg')}</button>
              <button type="button" className="rs-btn" onClick={() => save('png')} disabled={busy}><Icon name="down" size={18} />{t('ws.chart.png')}</button>
              <button type="button" className="rs-btn" onClick={() => save('tiff')} disabled={busy}><Icon name="down" size={18} />{t('ws.figure.tiff')}</button>
              <button type="button" className="rs-btn" onClick={savePdf} disabled={busy}><Icon name="doc" size={18} />{t('ws.figure.pdf')}</button>
            </div>
            <p className="rs-soft rs-small">{t('ws.figure.onDevice')}</p>
          </>
        ) : null}
      </section>
    </div>
  );
}
