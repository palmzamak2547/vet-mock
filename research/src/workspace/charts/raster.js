// Figure files built on the student's device [M2-DESIGN.md 8.3; B11]: PNG at 300 or 600 dpi (pHYs set),
// TIFF at 300 or 600 dpi (lib/export/tiff.js, loaded only when asked for), SVG, and a vector PDF
// through the browser's print dialog (print.js). Pixels for a printed width: round(width / 25.4 x
// dpi). A picture drawn through an image cannot use the page's web fonts, so PNG and TIFF text uses the
// system's Thai font (the chart's font list names Tahoma and Leelawadee UI after Sarabun); the SVG and the
// printed PDF keep Sarabun. Nothing is sent anywhere, and no request is made. OWNER: graphs role.
import { download, pixelsFor, setPngDpi } from '../../lib/runtime/export.js';

/** The SVG text and its size in pixels for a printed width. */
function sized(svgText, widthMm, dpi) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const root = doc.documentElement;
  const vb = (root.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
  const w0 = vb.length === 4 && vb[2] > 0 ? vb[2] : Number.parseFloat(root.getAttribute('width')) || 1;
  const h0 = vb.length === 4 && vb[3] > 0 ? vb[3] : Number.parseFloat(root.getAttribute('height')) || 1;
  const width = pixelsFor(widthMm, dpi);
  const height = Math.max(1, Math.round((width * h0) / w0));
  root.setAttribute('width', String(width));
  root.setAttribute('height', String(height));
  return { text: new XMLSerializer().serializeToString(root), width, height };
}

/**
 * Draw the SVG on a white canvas at the printed size.
 * @param {string} svgText
 * @param {{ widthMm: number, dpi: 300|600 }} o
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function rasterise(svgText, o) {
  const dpi = o.dpi === 600 ? 600 : 300;
  const s = sized(svgText, o.widthMm, dpi);
  const url = URL.createObjectURL(new Blob([s.text], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(Object.assign(new Error('svg did not load'), { key: 'graphs.export.failed' }));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = s.width;
    canvas.height = s.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s.width, s.height);
    ctx.drawImage(img, 0, 0, s.width, s.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** PNG with a pHYs chunk that says the dpi. */
export async function figurePng(svgText, o) {
  const canvas = await rasterise(svgText, o);
  const blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png failed'))), 'image/png'));
  return new Blob([setPngDpi(new Uint8Array(await blob.arrayBuffer()), o.dpi === 600 ? 600 : 300)], { type: 'image/png' });
}

/** TIFF (RGB, LZW, dpi in the resolution tags); the encoder is a separate chunk loaded here. */
export async function figureTiff(svgText, o) {
  const [{ encodeTiff }, canvas] = await Promise.all([import('../../lib/export/tiff.js'), rasterise(svgText, o)]);
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  return new Blob([encodeTiff(data, canvas.width, canvas.height, o.dpi === 600 ? 600 : 300)], { type: 'image/tiff' });
}

/**
 * Build and download one figure file.
 * @param {'svg'|'png'|'tiff'} format
 * @param {{ svgText: string, fileBase: string, widthMm: number, dpi: 300|600 }} o
 * @returns {Promise<string>} the file name
 */
export async function downloadFigure(format, o) {
  if (format === 'svg') {
    const name = `${o.fileBase}.svg`;
    download(new Blob([o.svgText], { type: 'image/svg+xml' }), name);
    return name;
  }
  const name = `${o.fileBase}-${o.widthMm}mm-${o.dpi}dpi.${format === 'tiff' ? 'tif' : 'png'}`;
  const blob = format === 'tiff' ? await figureTiff(o.svgText, o) : await figurePng(o.svgText, o);
  download(blob, name);
  return name;
}
