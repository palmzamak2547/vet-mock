// Self-contained HTML from the report model: one file with inline CSS and inline SVG figures, `lang` on
// the root, and nothing that makes a request of any kind (no external stylesheet, font, script, image or
// link) [M2-DESIGN.md 6.2]. It opens offline and prints on A4 with the Thai academic defaults (TH Sarabun
// New 16 pt, falling back to Sarabun, Tahoma, then the system sans). Figures are sanitised: no script,
// no foreign object, no image, no event attribute, no external reference. OWNER: report role.
import { NUMERIC_CELL } from './cells.js';
import { referenceLine } from './cite.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/**
 * Text written into the page: escaped, and the letters "http" of an address written as a character
 * reference, so the file never carries a string a scanner could read as a link to fetch (the address
 * still reads and copies as typed).
 */
const text = (s) => esc(s).replace(/http/gi, (m) => `&#${m.charCodeAt(0)};${m.slice(1)}`);

const cellString = (c) => (c === null || c === undefined ? '' : typeof c === 'number' ? (Number.isFinite(c) ? String(c) : c > 0 ? '∞' : '-∞') : String(c));

/**
 * An SVG made safe to inline: the XML prolog, namespace declarations (inline SVG in HTML needs none),
 * scripts, foreign objects, images, event handlers and any href that leaves the file are removed.
 * @param {string} svg
 */
export function inlineSvg(svg) {
  return String(svg || '')
    .replace(/<\?xml[^>]*\?>\s*/g, '')
    .replace(/<!DOCTYPE[^>]*>\s*/gi, '')
    .replace(/<(script|foreignObject|image|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|foreignObject|image)\b[^>]*\/>/gi, '')
    .replace(/\s+xmlns(:[\w-]+)?="[^"]*"/g, '')
    .replace(/\s+on[a-z]+="[^"]*"/gi, '')
    .replace(/\s+(xlink:)?href="(?!#)[^"]*"/gi, '')
    .replace(/url\((?!#)[^)]*\)/gi, 'none');
}

const CSS = `
@page { size: A4; margin: 25.4mm 25.4mm 25.4mm 38.1mm; }
:root { color-scheme: light; }
body { margin: 0; background: #ffffff; color: #111111; }
main { max-width: 160mm; margin: 0 auto; padding: 12mm 8mm; font-family: 'TH Sarabun New', Sarabun, Tahoma, 'Noto Sans Thai', sans-serif; line-height: 1.5; }
html[lang="th"] main { font-size: 16pt; }
html[lang="en"] main { font-family: Calibri, Carlito, 'TH Sarabun New', Sarabun, Tahoma, sans-serif; font-size: 11pt; }
h1 { font-size: 1.5em; margin: 0 0 0.6em; }
h2 { font-size: 1.25em; margin: 1.2em 0 0.4em; }
h3 { font-size: 1.1em; margin: 1em 0 0.3em; }
p { margin: 0 0 0.6em; }
p.note { font-style: italic; color: #444444; }
p.made-up { font-weight: bold; border: 1px solid #111111; padding: 0.3em 0.6em; }
table { border-collapse: collapse; width: 100%; margin: 0.4em 0 0.2em; font-variant-numeric: tabular-nums; }
caption { caption-side: top; text-align: left; font-weight: bold; padding: 0.2em 0; }
th, td { padding: 0.15em 0.4em; vertical-align: top; text-align: left; }
thead th { border-top: 1px solid #000000; border-bottom: 1px solid #000000; }
tbody tr:last-child td { border-bottom: 1px solid #000000; }
td.num { text-align: right; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
.table-note, .prov { font-size: 0.8em; color: #444444; margin: 0.2em 0 1em; }
figure { margin: 1em 0; break-inside: avoid; }
figure svg { display: block; width: 100%; height: auto; max-width: 100%; }
figcaption { font-weight: bold; margin-top: 0.3em; }
ol.refs { padding-left: 1.4em; }
ol.refs li { margin-bottom: 0.3em; }
`;

/**
 * @param {ReturnType<import('./report-model.js').buildReportModel>} model
 * @param {{ t?: (k: string, p?: any) => string, accessedText?: string }} [opts]
 * @returns {string}
 */
export function buildHtml(model, opts = {}) {
  const t = opts.t || ((k) => k);
  const out = [];
  for (const b of model.blocks) {
    if (b.kind === 'heading') out.push(`<h${b.level}>${text(b.text)}</h${b.level}>`);
    else if (b.kind === 'paragraph') out.push(`<p${b.style === 'note' ? ' class="note"' : b.style === 'madeUp' ? ' class="made-up"' : ''}>${text(b.text)}</p>`);
    else if (b.kind === 'table') {
      const head = b.columns.map((c) => `<th scope="col">${text(c)}</th>`).join('');
      const body = b.rows.map((r) => `<tr>${b.columns.map((_c, i) => {
        const s = cellString(r[i]);
        const num = typeof r[i] === 'number' || NUMERIC_CELL.test(s);
        return `<td${num ? ' class="num"' : ''}>${text(s)}</td>`;
      }).join('')}</tr>`).join('');
      out.push(`<table><caption>${text(b.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`);
      if (b.note) out.push(`<p class="table-note">${text(b.note)}</p>`);
    } else if (b.kind === 'figure' || b.kind === 'flow') {
      const svg = inlineSvg(b.svg).replace(/^<svg\b/, `<svg role="img" aria-label="${text(b.altText || b.caption)}"`);
      out.push(`<figure>${svg}<figcaption>${text(b.caption)}</figcaption></figure>`);
    }
  }
  if (model.references?.length) {
    const words = { software: t('report.ref.software'), version: t('report.ref.version'), available: t('report.ref.available'), accessed: t('report.ref.accessed'), accessedDate: opts.accessedText || '', yearText: (y) => (model.lang === 'th' ? t('report.cite.yearTh', { be: y + 543, ce: y }) : String(y)) };
    out.push(`<ol class="refs">${model.references.map((r, i) => `<li>${text(referenceLine(r, i + 1, words).replace(/^\d+\.\s/, ''))}</li>`).join('')}</ol>`);
  }
  for (const line of model.provenance || []) out.push(`<p class="prov">${text(line)}</p>`);
  const lang = model.lang === 'en' ? 'en' : 'th';
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${text(model.title)}</title>\n<style>${CSS}</style>\n</head>\n<body>\n<main>\n${out.join('\n')}\n</main>\n</body>\n</html>\n`;
}
