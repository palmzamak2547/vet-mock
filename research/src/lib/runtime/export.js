// Local exports [M1-DESIGN.md 14; competitor-gaps.md D4(c)]. Everything is built in the browser and
// handed to the student as a download ("ดาวน์โหลด") or the clipboard; nothing is sent anywhere.
// Hidden PII columns never appear in these exports: a table may carry `hidden: boolean[]` per column
// and every function here drops those columns first. OWNER: runtime role.
import { appendLog } from '../store/log.js';

/**
 * @typedef {Object} ExportTable
 * @property {string} [caption]
 * @property {string[]} columns
 * @property {(string|number|null)[][]} rows
 * @property {string} [note]           the provenance line, printed under the table
 * @property {boolean[]} [hidden]      true for a column that must not leave the screen (PII hidden in the codebook)
 */

/** The table without its hidden columns. @param {ExportTable} table @returns {ExportTable} */
export function withoutHidden(table) {
  const hidden = table.hidden || [];
  if (!hidden.some(Boolean)) return table;
  const keep = table.columns.map((_c, i) => !hidden[i]);
  return {
    ...table,
    columns: table.columns.filter((_c, i) => keep[i]),
    rows: table.rows.map((r) => r.filter((_c, i) => keep[i])),
    hidden: undefined,
  };
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cellString = (c) => (c === null || c === undefined ? '' : typeof c === 'number' ? (Number.isFinite(c) ? String(c) : c > 0 ? 'Infinity' : c < 0 ? '-Infinity' : '') : String(c));
const NUMERIC = /^\s*[<>≤≥]?\s*[-−+]?\d[\d,]*(\.\d+)?\s*%?\s*(\([^)]*\))?\s*$/;

/**
 * An HTML table that Word keeps formatted when pasted: <table> with inline border-collapse,
 * thead, numbers right-aligned, caption, and the provenance line as a <p> after the table.
 * @param {ExportTable} table
 * @returns {string}
 */
export function tableToHtml(table) {
  const t = withoutHidden(table);
  const cell = 'border:1px solid #444;padding:4px 8px;font-family:Sarabun,Tahoma,Arial,sans-serif;font-size:11pt;vertical-align:top;';
  const head = t.columns.map((c) => `<th style="${cell}font-weight:bold;text-align:left;background:#f2f2f2;">${escapeHtml(c)}</th>`).join('');
  const body = t.rows.map((r) => `<tr>${r.map((c) => {
    const s = cellString(c);
    const right = typeof c === 'number' || NUMERIC.test(s);
    return `<td style="${cell}text-align:${right ? 'right' : 'left'};">${escapeHtml(s)}</td>`;
  }).join('')}</tr>`).join('');
  const caption = t.caption ? `<caption style="caption-side:top;text-align:left;font-weight:bold;padding:4px 0;font-family:Sarabun,Tahoma,Arial,sans-serif;">${escapeHtml(t.caption)}</caption>` : '';
  const note = t.note ? `<p style="font-family:Sarabun,Tahoma,Arial,sans-serif;font-size:9pt;color:#444;margin:4px 0 0;">${escapeHtml(t.note)}</p>` : '';
  return `<table style="border-collapse:collapse;border:1px solid #444;">${caption}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${note}`;
}

/** RFC 4180 field. */
function csvField(s) {
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * RFC 4180 CSV with a UTF-8 BOM so Excel on Windows reads Thai. CRLF line ends (what Excel writes).
 * @param {ExportTable} table
 * @returns {string}
 */
export function tableToCsv(table) {
  const t = withoutHidden(table);
  const lines = [t.columns.map((c) => csvField(cellString(c))).join(',')];
  for (const r of t.rows) lines.push(r.map((c) => csvField(cellString(c))).join(','));
  return `﻿${lines.join('\r\n')}\r\n`;
}

/** Tab-separated text for the plain-text clipboard flavour (tabs and line breaks inside cells become spaces). */
export function tableToTsv(table) {
  const t = withoutHidden(table);
  const clean = (c) => cellString(c).replace(/[\t\r\n]+/g, ' ');
  return [t.columns.map(clean).join('\t'), ...t.rows.map((r) => r.map(clean).join('\t'))].join('\n');
}

/**
 * Copy a table as both text/html and text/plain (tab-separated) through the async Clipboard API,
 * with a hidden-textarea fallback where ClipboardItem is missing.
 * @param {ExportTable} table
 * @returns {Promise<'html'|'text'|'failed'>}
 */
export async function copyTable(table) {
  const html = tableToHtml(table);
  const text = tableToTsv(table);
  const nav = globalThis.navigator;
  try {
    if (nav?.clipboard?.write && typeof globalThis.ClipboardItem === 'function') {
      await nav.clipboard.write([new globalThis.ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      })]);
      return 'html';
    }
  } catch { /* fall through to text */ }
  try {
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(text);
      return 'text';
    }
  } catch { /* fall through to the textarea */ }
  try {
    const doc = globalThis.document;
    const ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    doc.body.appendChild(ta);
    ta.select();
    const ok = doc.execCommand('copy');
    ta.remove();
    return ok ? 'text' : 'failed';
  } catch {
    return 'failed';
  }
}

const STYLE_PROPS = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'letter-spacing'];

/**
 * Serialise an <svg> chart for download: inline the computed colours as attributes (no CSS
 * variables survive outside the page), embed nothing external.
 * @param {SVGSVGElement} svg
 * @returns {string}
 */
export function svgToString(svg) {
  const clone = /** @type {SVGSVGElement} */ (svg.cloneNode(true));
  const src = [svg, ...svg.querySelectorAll('*')];
  const dst = [clone, ...clone.querySelectorAll('*')];
  const view = svg.ownerDocument?.defaultView || globalThis;
  src.forEach((el, i) => {
    const out = dst[i];
    const cs = view.getComputedStyle ? view.getComputedStyle(el) : null;
    if (cs) {
      for (const p of STYLE_PROPS) {
        const v = cs.getPropertyValue(p);
        if (v && v !== 'normal' && !(p === 'stroke-dasharray' && v === 'none')) out.setAttribute(p, v.trim());
      }
    }
    for (const a of [...out.attributes]) {
      if (/var\(/.test(a.value) && cs) out.setAttribute(a.name, cs.getPropertyValue(a.name) || '');
      if (/^on/i.test(a.name) || (a.name === 'href' && !a.value.startsWith('#')) || (a.name === 'xlink:href' && !a.value.startsWith('#'))) out.removeAttribute(a.name);
    }
    out.removeAttribute('class');
    out.removeAttribute('style');
  });
  for (const bad of clone.querySelectorAll('script, foreignObject, image, use[href^="http"]')) bad.remove();
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const box = svg.viewBox?.baseVal;
  if (!clone.getAttribute('width') && box?.width) clone.setAttribute('width', String(box.width));
  if (!clone.getAttribute('height') && box?.height) clone.setAttribute('height', String(box.height));
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

/** Pixels for a figure `widthMm` wide printed at `dpi`: round(widthMm / 25.4 x dpi). */
export function pixelsFor(widthMm, dpi) {
  return Math.round((widthMm / 25.4) * dpi);
}

let crcTable = null;
function crc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];

/**
 * Put a pHYs chunk (pixels per metre, unit metre) right after IHDR, replacing any pHYs already there,
 * so Word and journals read the intended physical size.
 * @param {Uint8Array} png
 * @param {number} dpi
 * @returns {Uint8Array}
 */
export function setPngDpi(png, dpi) {
  if (!PNG_SIG.every((b, i) => png[i] === b)) throw new Error('not a PNG');
  const ppm = Math.round(dpi / 0.0254);
  const chunks = [];
  let off = 8;
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  while (off < png.length) {
    const len = view.getUint32(off);
    const type = String.fromCharCode(png[off + 4], png[off + 5], png[off + 6], png[off + 7]);
    chunks.push({ type, bytes: png.subarray(off, off + 12 + len) });
    off += 12 + len;
    if (type === 'IEND') break;
  }
  const phys = new Uint8Array(21);
  const pv = new DataView(phys.buffer);
  pv.setUint32(0, 9);
  phys.set([0x70, 0x48, 0x59, 0x73], 4); // 'pHYs'
  pv.setUint32(8, ppm);
  pv.setUint32(12, ppm);
  phys[16] = 1;
  pv.setUint32(17, crc32(phys.subarray(4, 17)));
  const parts = [new Uint8Array(PNG_SIG)];
  for (const c of chunks) {
    if (c.type === 'pHYs') continue;
    parts.push(c.bytes);
    if (c.type === 'IHDR') parts.push(phys);
  }
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

/** Read the dpi a PNG's pHYs chunk declares, or null. @param {Uint8Array} png */
export function readPngDpi(png) {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let off = 8;
  while (off + 8 <= png.length) {
    const len = view.getUint32(off);
    const type = String.fromCharCode(png[off + 4], png[off + 5], png[off + 6], png[off + 7]);
    if (type === 'pHYs' && png[off + 16] === 1) return Math.round(view.getUint32(off + 8) * 0.0254);
    if (type === 'IEND') break;
    off += 12 + len;
  }
  return null;
}

/**
 * Rasterise an SVG string to PNG at a print resolution. widthMm is the figure width on paper;
 * pixels = round(widthMm / 25.4 * dpi). The PNG carries a pHYs chunk with the dpi so Word and
 * journals read the intended size. White background (journals reject transparent figures).
 * @param {string} svgText
 * @param {{ widthMm: number, dpi: 300|600 }} opts
 * @returns {Promise<Blob>}
 */
export async function svgToPng(svgText, opts) {
  const dpi = opts.dpi === 600 ? 600 : 300;
  const width = pixelsFor(opts.widthMm, dpi);
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const root = doc.documentElement;
  const vb = (root.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
  const w0 = vb.length === 4 && vb[2] > 0 ? vb[2] : Number.parseFloat(root.getAttribute('width')) || 1;
  const h0 = vb.length === 4 && vb[3] > 0 ? vb[3] : Number.parseFloat(root.getAttribute('height')) || 1;
  const height = Math.max(1, Math.round((width * h0) / w0));
  root.setAttribute('width', String(width));
  root.setAttribute('height', String(height));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(root)], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('svg did not load'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png failed'))), 'image/png'));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return new Blob([setPngDpi(bytes, dpi)], { type: 'image/png' });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Hand a Blob to the student as a download through an object URL.
 * @param {Blob} blob
 * @param {string} fileName
 */
export function download(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/**
 * Download and write a 'download' entry to the project log (egress 'none': a file the student saves
 * is not data leaving the device through VetMock).
 * @param {Blob} blob
 * @param {string} fileName
 * @param {{ db: import('../store/db.js').ResearchDb, owner: string, projectId: string, what: 'csv'|'html'|'svg'|'png'|'report'|'project-file' }} ctx
 */
export async function downloadAndLog(blob, fileName, ctx) {
  download(blob, fileName);
  if (ctx?.db && ctx.projectId) await appendLog(ctx.db, ctx.owner, ctx.projectId, { kind: 'download', detail: { what: ctx.what, fileName, bytes: blob.size } });
}
