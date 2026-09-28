// Chart download [M1-DESIGN.md 14; M2-DESIGN.md 8.3; competitor-gaps.md D4(c), D6]: SVG with colours
// inlined, PNG or TIFF at 300 or 600 dpi for a printed width in millimetres (pixels = width / 25.4 x
// dpi; the file carries the dpi), and a vector PDF through the browser's print dialog at the figure's
// size. A chart of the kit is rebuilt at the printed width (`build`), so its text is 7 to 9 pt in the
// file; M1's CI plot passes its drawn <svg> (`svgRef`). Files use white paper and black ink, as
// journals ask. Every file is made on the student's own device; nothing is sent anywhere.
// OWNER: graphs role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { svgToString } from '../../lib/runtime/export.js';
import { modelToSvg } from '../charts/render.js';
import { downloadFigure } from '../charts/raster.js';
import { printFigure } from '../charts/print.js';
import { useWs, errorInfo } from '../ws-context.js';
import Icon from './Icon.jsx';

// 85 mm, one column, as the figure composer says it (review round 5: '84 มม. (ครึ่งหน้า)' vs '85 mm (one column)').
const WIDTHS = [85, 120, 174];

/** Height in mm of an SVG drawn `widthMm` wide, from its viewBox. */
function heightMmOf(svgText, widthMm) {
  const m = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(svgText);
  if (!m) return widthMm * 0.66;
  return Math.round(((widthMm * Number(m[2])) / Number(m[1])) * 100) / 100;
}

/**
 * @param {{ svgRef?: { current: SVGSVGElement|null }, build?: (widthMm: number) => any, fileBase: string, onDownloaded?: (kind: string) => void, title?: string }} props
 */
export default function ChartExport({ svgRef, build, fileBase, onDownloaded, title }) {
  const { t } = useT();
  const { notify } = useWs();
  const [dpi, setDpi] = useState(300);
  const [widthMm, setWidthMm] = useState(120);
  const [busy, setBusy] = useState(false);
  const px = Math.round((widthMm / 25.4) * dpi);

  /** The file's SVG and its printed height. */
  const figure = () => {
    if (build) {
      const model = build(widthMm);
      return { svgText: modelToSvg(model, 'print'), heightMm: model.heightMm };
    }
    const svgText = svgToString(svgRef.current);
    return { svgText, heightMm: heightMmOf(svgText, widthMm) };
  };

  const save = async (format) => {
    setBusy(true);
    try {
      const { svgText } = figure();
      await downloadFigure(format, { svgText, fileBase, widthMm, dpi });
      onDownloaded?.(format);
    } catch (err) {
      notify(err?.key || errorInfo(err).key, {}, 'error');
    } finally {
      setBusy(false);
    }
  };

  const print = () => {
    try {
      const { svgText, heightMm } = figure();
      printFigure(svgText, { widthMm, heightMm, title: title || fileBase });
      onDownloaded?.('pdf');
    } catch (err) {
      notify(err?.key || errorInfo(err).key, {}, 'error');
    }
  };

  return (
    <details className="rs-export">
      <summary className="rs-export-sum">
        <Icon name="image" size={18} />
        {t('ws.chart.download')}
      </summary>
      <div className="rs-export-body">
        <fieldset className="rs-fieldset">
          <legend className="rs-field-label">{t('ws.chart.width')}</legend>
          <div className="rs-seg" role="presentation">
            {WIDTHS.map((w) => (
              <label key={w} className="rs-seg-btn rs-seg-radio">
                <input type="radio" name={`w-${fileBase}`} value={w} checked={widthMm === w} onChange={() => setWidthMm(w)} />
                {t(`ws.chart.width.${w}`)}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="rs-fieldset">
          <legend className="rs-field-label">{t('ws.chart.dpi')}</legend>
          <div className="rs-seg" role="presentation">
            {[300, 600].map((d) => (
              <label key={d} className="rs-seg-btn rs-seg-radio">
                <input type="radio" name={`d-${fileBase}`} value={d} checked={dpi === d} onChange={() => setDpi(d)} />
                {t('ws.chart.dpiValue', { dpi: d })}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="rs-soft rs-small rs-num">{t('ws.chart.pixels', { px, mm: widthMm, dpi })}</p>
        <div className="rs-row-wrap">
          <button type="button" className="rs-btn" onClick={() => save('svg')} disabled={busy}>
            <Icon name="down" size={18} />
            {t('ws.chart.svg')}
          </button>
          <button type="button" className="rs-btn" onClick={() => save('png')} disabled={busy}>
            <Icon name="down" size={18} />
            {t('ws.chart.png')}
          </button>
          <button type="button" className="rs-btn" onClick={() => save('tiff')} disabled={busy}>
            <Icon name="down" size={18} />
            {t('graphs.export.tiff')}
          </button>
          <button type="button" className="rs-btn" onClick={print} disabled={busy}>
            <Icon name="image" size={18} />
            {t('graphs.export.pdf')}
          </button>
        </div>
        <p className="rs-soft rs-small">{t('graphs.export.hint')}</p>
      </div>
    </details>
  );
}
