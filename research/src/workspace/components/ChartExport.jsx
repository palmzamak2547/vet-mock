// Chart download [M1-DESIGN.md 14; competitor-gaps.md D4(c)]: SVG with colours inlined, or PNG at
// 300 or 600 dpi for a printed width in millimetres (pixels = width / 25.4 x dpi; the PNG carries the
// dpi). The file goes to the student's own device; nothing is sent anywhere. OWNER: workspace role.
import { useState } from 'react';
import { useT } from '../../i18n/index.js';
import { download, svgToPng, svgToString } from '../../lib/runtime/export.js';
import { useWs, errorInfo } from '../ws-context.js';
import Icon from './Icon.jsx';

const WIDTHS = [84, 120, 174];

/** @param {{ svgRef: { current: SVGSVGElement|null }, fileBase: string, onDownloaded?: (kind: string) => void }} props */
export default function ChartExport({ svgRef, fileBase, onDownloaded }) {
  const { t } = useT();
  const { notify } = useWs();
  const [dpi, setDpi] = useState(300);
  const [widthMm, setWidthMm] = useState(120);
  const [busy, setBusy] = useState(false);
  const px = Math.round((widthMm / 25.4) * dpi);

  const saveSvg = () => {
    try {
      const text = svgToString(svgRef.current);
      download(new Blob([text], { type: 'image/svg+xml' }), `${fileBase}.svg`);
      onDownloaded?.('svg');
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };
  const savePng = async () => {
    setBusy(true);
    try {
      const blob = await svgToPng(svgToString(svgRef.current), { widthMm, dpi });
      download(blob, `${fileBase}-${dpi}dpi.png`);
      onDownloaded?.('png');
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    } finally {
      setBusy(false);
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
          <button type="button" className="rs-btn" onClick={saveSvg}>
            <Icon name="down" size={18} />
            {t('ws.chart.svg')}
          </button>
          <button type="button" className="rs-btn" onClick={savePng} disabled={busy}>
            <Icon name="down" size={18} />
            {t('ws.chart.png')}
          </button>
        </div>
      </div>
    </details>
  );
}
