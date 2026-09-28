// Word (.docx) from the report model: real Word tables (w:tbl, header row repeated on every page, numbers
// right-aligned with tabular figures), figures as PNG at 300 dpi sized in EMU from millimetres (width mm x
// 36000), Thai text in the complex-script font slot, zipped with fflate on the device [M2-DESIGN.md 6.1].
// Loaded lazily (only when the Word button is pressed).
//
// Thai academic defaults: A4, left margin 1.5 inch and 1 inch elsewhere, TH Sarabun New 16 pt for Thai. A
// Thai document sets every font slot to TH Sarabun New 16 pt (a Thai thesis prints its English words in the
// same face); an English document sets Latin text in Calibri 11 pt and keeps TH Sarabun New 16 pt for Thai
// words from the data. TH Sarabun New does not ship with Windows or macOS: the font table names Tahoma as
// the stated fallback and marks the face as Thai (charset DE), so a computer without it shows Thai in
// Tahoma, never a row of boxes. OWNER: report role.
import { zipSync, strToU8 } from 'fflate';
import { NUMERIC_CELL } from './cells.js';
import { readPngSize, setPngDpi, readPngDpi } from './png.js';
import { referenceLine } from './cite.js';

/** A4 in twips, and the text width left between the margins. */
const PAGE = { w: 11906, h: 16838, left: 2160, right: 1440, top: 1440, bottom: 1440 };
export const TEXT_WIDTH_TWIPS = PAGE.w - PAGE.left - PAGE.right;
/** The widest figure the text block holds, in millimetres (1 mm = 56.6929 twips). */
export const MAX_FIGURE_MM = Math.floor((TEXT_WIDTH_TWIPS / 56.6929) * 10) / 10;
/** English Metric Units per millimetre: Word sizes drawings in EMU. */
export const EMU_PER_MM = 36000;
export const FIGURE_DPI = 300;

export const THAI_FONT = 'TH Sarabun New';
export const FALLBACK_FONT = 'Tahoma';
const LATIN_FONT_EN = 'Calibri';

const NS = {
  w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  pic: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
  w14: 'http://schemas.microsoft.com/office/word/2010/wordml',
  mc: 'http://schemas.openxmlformats.org/markup-compatibility/2006',
};
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/** Text safe inside an XML element or attribute: escaped, and the control characters XML 1.0 forbids removed. */
// eslint-disable-next-line no-control-regex
export const xmlText = (s) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Run properties in schema order (rFonts, b, bCs, i, iCs, color, sz, szCs, lang, then the w14 extension). */
function rPr({ bold = false, italic = false, size = null, color = null, tabular = false } = {}) {
  const x = [];
  if (bold) x.push('<w:b/><w:bCs/>');
  if (italic) x.push('<w:i/><w:iCs/>');
  if (color) x.push(`<w:color w:val="${color}"/>`);
  if (size) x.push(`<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`);
  if (tabular) x.push('<w14:numSpacing w14:val="tabular"/>');
  return x.length ? `<w:rPr>${x.join('')}</w:rPr>` : '';
}

/** Runs for a text: a line break inside the text becomes w:br, spaces are kept. */
function runs(text, props) {
  const lines = String(text ?? '').split(/\r?\n/);
  return lines.map((line, i) => `<w:r>${rPr(props)}${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${xmlText(line)}</w:t></w:r>`).join('');
}

/** A paragraph with a style and optional alignment, keep-with-next. */
function para(text, { style = null, jc = null, keepNext = false, run = {} } = {}) {
  const p = [];
  if (style) p.push(`<w:pStyle w:val="${style}"/>`);
  if (keepNext) p.push('<w:keepNext/>');
  if (jc) p.push(`<w:jc w:val="${jc}"/>`);
  return `<w:p>${p.length ? `<w:pPr>${p.join('')}</w:pPr>` : ''}${runs(text, run)}</w:p>`;
}

/** Column widths in twips from the longest text of each column, summing to the text width. */
function columnWidths(columns, rows) {
  const len = columns.map((c, i) => Math.max(4, String(c ?? '').length, ...rows.map((r) => String(r[i] ?? '').length)));
  const capped = len.map((n) => Math.min(n, 60));
  const total = capped.reduce((a, b) => a + b, 0);
  const w = capped.map((n) => Math.floor((n / total) * TEXT_WIDTH_TWIPS));
  w[w.length - 1] += TEXT_WIDTH_TWIPS - w.reduce((a, b) => a + b, 0);
  return w;
}

const cellString = (c) => (c === null || c === undefined ? '' : typeof c === 'number' ? (Number.isFinite(c) ? String(c) : c > 0 ? '∞' : '-∞') : String(c));

/**
 * A result table as a real Word table: the caption above, a header row marked w:tblHeader (it repeats on
 * each page), rules above and below the header and under the last row (the academic three-rule table),
 * numbers right-aligned in tabular figures, the provenance line below.
 * @param {{ caption: string, columns: string[], rows: any[][], note: string|null }} block
 */
export function tableXml(block) {
  const widths = columnWidths(block.columns, block.rows);
  const rule = (side) => `<w:${side} w:val="single" w:sz="8" w:space="0" w:color="000000"/>`;
  const cell = (text, i, { header = false, last = false } = {}) => {
    const s = cellString(text);
    const numeric = !header && (typeof text === 'number' || NUMERIC_CELL.test(s));
    const borders = header ? `<w:tcBorders>${rule('top')}${rule('bottom')}</w:tcBorders>` : last ? `<w:tcBorders>${rule('bottom')}</w:tcBorders>` : '';
    return `<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/>${borders}<w:vAlign w:val="top"/></w:tcPr>`
      + `<w:p><w:pPr><w:pStyle w:val="TableText"/>${numeric ? '<w:jc w:val="right"/>' : ''}</w:pPr>${runs(s, { bold: header, tabular: numeric })}</w:p></w:tc>`;
  };
  const grid = `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
  const head = `<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${block.columns.map((c, i) => cell(c, i, { header: true })).join('')}</w:tr>`;
  const body = block.rows.map((r, ri) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${block.columns.map((_c, i) => cell(r[i], i, { last: ri === block.rows.length - 1 })).join('')}</w:tr>`).join('');
  const tbl = `<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH_TWIPS}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/></w:tblPr>${grid}${head}${body}</w:tbl>`;
  const caption = para(block.caption, { style: 'Caption', keepNext: true });
  const note = block.note ? para(block.note, { style: 'TableNote' }) : '';
  return `${caption}${tbl}${note}`;
}

/**
 * An inline picture: extent cx = widthMm x 36000 EMU, cy from the PNG's aspect ratio.
 * @param {{ rId: string, id: number, widthMm: number, pxW: number, pxH: number, altText: string, name: string }} f
 */
export function drawingXml(f) {
  const cx = Math.round(f.widthMm * EMU_PER_MM);
  const cy = Math.round((cx * f.pxH) / f.pxW);
  const alt = xmlText(f.altText);
  return '<w:r><w:drawing>'
    + `<wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>`
    + `<wp:docPr id="${f.id}" name="${xmlText(f.name)}" descr="${alt}"/>`
    + `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="${NS.a}" noChangeAspect="1"/></wp:cNvGraphicFramePr>`
    + `<a:graphic xmlns:a="${NS.a}"><a:graphicData uri="${NS.pic}"><pic:pic xmlns:pic="${NS.pic}">`
    + `<pic:nvPicPr><pic:cNvPr id="${f.id}" name="${xmlText(f.name)}" descr="${alt}"/><pic:cNvPicPr/></pic:nvPicPr>`
    + `<pic:blipFill><a:blip r:embed="${f.rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
    + `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>`
    + '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
}

function stylesXml(lang) {
  const th = lang === 'th';
  const latin = th ? THAI_FONT : LATIN_FONT_EN;
  const size = th ? 32 : 22;
  const style = (id, name, { based = 'Normal', next = 'Normal', size: sz = null, bold = false, italic = false, before = 0, after = 120, keepNext = false, outline = null, color = null } = {}) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="${based}"/><w:next w:val="${next}"/><w:qFormat/>`
    + `<w:pPr>${keepNext ? '<w:keepNext/>' : ''}<w:spacing w:before="${before}" w:after="${after}"/>${outline !== null ? `<w:outlineLvl w:val="${outline}"/>` : ''}</w:pPr>`
    + `<w:rPr>${bold ? '<w:b/><w:bCs/>' : ''}${italic ? '<w:i/><w:iCs/>' : ''}${color ? `<w:color w:val="${color}"/>` : ''}${sz ? `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>` : ''}</w:rPr></w:style>`;
  return `${XML_HEAD}<w:styles xmlns:w="${NS.w}">`
    + '<w:docDefaults><w:rPrDefault><w:rPr>'
    + `<w:rFonts w:ascii="${latin}" w:hAnsi="${latin}" w:eastAsia="${latin}" w:cs="${THAI_FONT}"/>`
    + `<w:sz w:val="${size}"/><w:szCs w:val="32"/>`
    + `<w:lang w:val="${th ? 'th-TH' : 'en-GB'}" w:eastAsia="en-US" w:bidi="th-TH"/>`
    + '</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    + style('Title', 'Title', { size: th ? 40 : 32, bold: true, after: 240 })
    + style('Heading1', 'heading 1', { size: th ? 36 : 28, bold: true, before: 240, keepNext: true, outline: 0 })
    + style('Heading2', 'heading 2', { size: th ? 34 : 26, bold: true, before: 200, keepNext: true, outline: 1 })
    + style('Heading3', 'heading 3', { size: th ? 32 : 24, bold: true, before: 160, keepNext: true, outline: 2 })
    + style('Caption', 'caption', { bold: true, before: 160, after: 60, keepNext: true })
    + style('TableText', 'Table Text', { after: 0 })
    + style('TableNote', 'Table Note', { size: th ? 26 : 18, color: '444444', before: 60, after: 160 })
    + style('Note', 'Note', { italic: true, color: '444444' })
    + style('Reference', 'Reference', { after: 80 })
    + '</w:styles>';
}

function fontTableXml() {
  return `${XML_HEAD}<w:fonts xmlns:w="${NS.w}">`
    + `<w:font w:name="${THAI_FONT}"><w:altName w:val="${FALLBACK_FONT}"/><w:charset w:val="DE"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>`
    + `<w:font w:name="${FALLBACK_FONT}"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>`
    + `<w:font w:name="${LATIN_FONT_EN}"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>`
    + '</w:fonts>';
}

function settingsXml(lang) {
  return `${XML_HEAD}<w:settings xmlns:w="${NS.w}"><w:zoom w:percent="100"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/>`
    + '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>'
    + `<w:themeFontLang w:val="${lang === 'th' ? 'th-TH' : 'en-GB'}" w:bidi="th-TH"/></w:settings>`;
}

const iso = (d) => `${d}T00:00:00Z`;

function coreXml(model, today) {
  return `${XML_HEAD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`
    + `<dc:title>${xmlText(model.title)}</dc:title><dc:language>${model.lang === 'th' ? 'th-TH' : 'en-GB'}</dc:language>`
    + `<dcterms:created xsi:type="dcterms:W3CDTF">${iso(today)}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${iso(today)}</dcterms:modified>`
    + '</cp:coreProperties>';
}

function appXml() {
  return `${XML_HEAD}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>VetMock Research</Application></Properties>`;
}

/**
 * @param {ReturnType<import('./report-model.js').buildReportModel>} model
 * @param {{ rasterize: (svg: string, widthMm: number, dpi: number) => Promise<Uint8Array>, t?: (k: string, p?: any) => string, today?: string }} deps
 *   PNG bytes from graphs' exporter; `t` for the words the file itself prints (a figure that could not be
 *   drawn, the reference list words); `today` 'YYYY-MM-DD'.
 * @returns {Promise<Uint8Array>}
 */
export async function buildDocx(model, deps) {
  const t = deps?.t || ((k) => k);
  const today = deps?.today || new Date().toISOString().slice(0, 10);
  const body = [];
  const media = [];
  let figId = 0;

  const figure = async (b) => {
    const widthMm = Math.min(b.widthMm || MAX_FIGURE_MM, MAX_FIGURE_MM);
    let png = null;
    try {
      png = await deps.rasterize(b.svg, widthMm, FIGURE_DPI);
      if (png && readPngDpi(png) !== FIGURE_DPI) png = setPngDpi(png, FIGURE_DPI);
    } catch { png = null; }
    const size = png ? readPngSize(png) : null;
    if (!size) {
      // A figure that could not be drawn is said so where it would stand, never dropped silently.
      body.push(para(t('report.docx.figureFailed'), { style: 'Note' }));
      body.push(para(b.caption, { style: 'Caption' }));
      return;
    }
    figId += 1;
    const rId = `rIdImg${figId}`;
    const name = `fig${figId}.png`;
    media.push({ rId, name, bytes: png });
    body.push(`<w:p><w:pPr><w:keepNext/><w:jc w:val="center"/></w:pPr>${drawingXml({ rId, id: figId, widthMm, pxW: size.width, pxH: size.height, altText: b.altText || b.caption, name })}</w:p>`);
    body.push(para(b.caption, { style: 'Caption' }));
  };

  for (const b of model.blocks) {
    if (b.kind === 'heading') body.push(para(b.text, { style: b.level === 1 ? 'Title' : `Heading${b.level - 1}` }));
    else if (b.kind === 'paragraph') body.push(para(b.text, { style: b.style === 'note' || b.style === 'madeUp' ? 'Note' : null, run: b.style === 'madeUp' ? { bold: true } : {} }));
    else if (b.kind === 'table') body.push(tableXml(b));
    else if (b.kind === 'figure' || b.kind === 'flow') await figure(b);
  }
  const words = {
    software: t('report.ref.software'), version: t('report.ref.version'), available: t('report.ref.available'), accessed: t('report.ref.accessed'),
    accessedDate: deps?.accessedText || today,
    // the year with its era in Thai, as the /cite page writes it
    yearText: (y) => (model.lang === 'th' ? t('report.cite.yearTh', { be: y + 543, ce: y }) : String(y)),
  };
  model.references.forEach((r, i) => body.push(para(referenceLine(r, i + 1, words), { style: 'Reference' })));
  for (const line of model.provenance || []) body.push(para(line, { style: 'TableNote' }));

  const sect = `<w:sectPr><w:pgSz w:w="${PAGE.w}" w:h="${PAGE.h}"/><w:pgMar w:top="${PAGE.top}" w:right="${PAGE.right}" w:bottom="${PAGE.bottom}" w:left="${PAGE.left}" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>`;
  const document = `${XML_HEAD}<w:document xmlns:w="${NS.w}" xmlns:r="${NS.r}" xmlns:wp="${NS.wp}" xmlns:a="${NS.a}" xmlns:pic="${NS.pic}" xmlns:w14="${NS.w14}" xmlns:mc="${NS.mc}" mc:Ignorable="w14"><w:body>${body.join('')}${sect}</w:body></w:document>`;

  const docRels = `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rIdStyles" Type="${REL}/styles" Target="styles.xml"/>`
    + `<Relationship Id="rIdSettings" Type="${REL}/settings" Target="settings.xml"/>`
    + `<Relationship Id="rIdFonts" Type="${REL}/fontTable" Target="fontTable.xml"/>`
    + media.map((m) => `<Relationship Id="${m.rId}" Type="${REL}/image" Target="media/${m.name}"/>`).join('')
    + '</Relationships>';
  const rootRels = `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="${REL}/officeDocument" Target="word/document.xml"/>`
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
    + `<Relationship Id="rId3" Type="${REL}/extended-properties" Target="docProps/app.xml"/>`
    + '</Relationships>';
  const wml = 'application/vnd.openxmlformats-officedocument.wordprocessingml';
  const types = `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Default Extension="png" ContentType="image/png"/>'
    + `<Override PartName="/word/document.xml" ContentType="${wml}.document.main+xml"/>`
    + `<Override PartName="/word/styles.xml" ContentType="${wml}.styles+xml"/>`
    + `<Override PartName="/word/settings.xml" ContentType="${wml}.settings+xml"/>`
    + `<Override PartName="/word/fontTable.xml" ContentType="${wml}.fontTable+xml"/>`
    + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
    + '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
    + '</Types>';

  /** @type {Record<string, [Uint8Array, { level: 0|6 }]>} */
  const files = {
    '[Content_Types].xml': [strToU8(types), { level: 6 }],
    '_rels/.rels': [strToU8(rootRels), { level: 6 }],
    'word/document.xml': [strToU8(document), { level: 6 }],
    'word/styles.xml': [strToU8(stylesXml(model.lang)), { level: 6 }],
    'word/settings.xml': [strToU8(settingsXml(model.lang)), { level: 6 }],
    'word/fontTable.xml': [strToU8(fontTableXml()), { level: 6 }],
    'word/_rels/document.xml.rels': [strToU8(docRels), { level: 6 }],
    'docProps/core.xml': [strToU8(coreXml(model, today)), { level: 6 }],
    'docProps/app.xml': [strToU8(appXml()), { level: 6 }],
  };
  for (const m of media) files[`word/media/${m.name}`] = [m.bytes, { level: 0 }];
  // A fixed modification time keeps the zip bytes the same for the same model (fflate stores mtime).
  return zipSync(files, { mtime: new Date('2026-01-01T00:00:00Z') });
}
