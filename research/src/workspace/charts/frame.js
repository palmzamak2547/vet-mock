// Shared pieces of every chart model: the size and type of the drawing (screen pixels, or points for a
// figure at its printed width), the plot frame, axes with ticks from niceTicks, tick text, legends and
// the node helpers the kinds build marks from. Pure. OWNER: graphs role.
import { niceTicks, textWidth } from './scale.js';
import { seriesShape, seriesToken } from './palette.js';

/** Points per millimetre (1 pt = 1/72 inch). */
export const PT_PER_MM = 72 / 25.4;

/**
 * Drawing context from the chart options. Screen charts are drawn in CSS pixels at the width they are
 * shown (12 px type, as M1's CI plot). A figure for a journal (`widthMm` given) is drawn in points at
 * its printed width, with `fontPt` type (8 pt unless asked; journals ask for 7 to 9 pt at final size).
 * @param {{ width?: number, widthMm?: number, fontPt?: number, height?: number, lang?: 'th'|'en', t?: Function, fmt?: any }} opts
 */
export function makeCtx(opts = {}) {
  const t = opts.t || ((k) => k);
  const lang = opts.lang || 'th';
  if (opts.widthMm) {
    const fs = Math.min(9, Math.max(7, opts.fontPt ?? 8));
    return { unit: 'pt', width: opts.widthMm * PT_PER_MM, widthMm: opts.widthMm, fs, u: fs / 12, lang, t, fmt: opts.fmt, heightHint: opts.height ?? null };
  }
  const width = Math.max(200, opts.width ?? 560);
  return { unit: 'px', width, widthMm: null, fs: 12, u: 1, lang, t, fmt: opts.fmt, heightHint: opts.height ?? null };
}

/** Real minus for negative numbers on the chart (U+2212), as a manuscript prints them. */
export function minus(s) {
  return String(s).replace(/^-/, '−');
}

/** Decimals that show a tick step without noise (0.25 needs 2, 0.5 needs 1, 20 needs 0). */
function decimalsFor(step) {
  if (!(step > 0) || !Number.isFinite(step)) return 0;
  for (let d = 0; d <= 10; d += 1) if (Math.abs(Math.round(step * 10 ** d) - step * 10 ** d) < 1e-6) return d;
  return 10;
}

/**
 * Tick text: linear ticks with the decimals their step needs; log ticks with up to 3 significant
 * digits; a proportion axis in percent.
 * @param {number[]} ticks
 * @param {{ log?: boolean, percent?: boolean }} [o]
 * @returns {string[]}
 */
export function tickLabels(ticks, o = {}) {
  if (o.log) return ticks.map((v) => minus(String(Number(v.toPrecision(3)))));
  const steps = ticks.slice(1).map((v, i) => v - ticks[i]);
  const step = steps.length ? Math.min(...steps) : Math.abs(ticks[0] || 1);
  if (o.percent) {
    const d = Math.max(0, decimalsFor(step * 100));
    return ticks.map((v) => `${minus((v * 100).toFixed(d))}%`);
  }
  const d = decimalsFor(step);
  return ticks.map((v) => minus((Math.abs(v) < 1e-12 ? 0 : v).toFixed(d).replace(/^-0(\.0+)?$/, '0$1')).replace(/\B(?=(\d{3})+(?!\d))(?=[^.]*$)/g, ','));
}

/** Round to 2 decimals for SVG attributes (keeps files small, sub-pixel exact enough). */
export const r2 = (v) => Math.round(v * 100) / 100;

/** How far a rotated line's glyphs reach from its baseline, in em: Thai stacks a tone mark on an upper vowel
 * (ที่, ขึ้น) about 1.3 em above the baseline, where Latin reaches about 0.8 em (review round 5: the tone marks
 * of 'น้ำหนักที่เพิ่มขึ้น' were cut at the left edge of every saved figure). */
export const ROTATED_REACH = 1.3;
/** How far Thai lower vowels (ุ ู) reach below the baseline, in em. */
export const TITLE_DESCENT = 0.4;

/** A text node. */
export function text(x, y, s, a = {}) {
  return { t: 'text', a: { x: r2(x), y: r2(y), ...a }, text: String(s) };
}

/** A line node. */
export function line(x1, y1, x2, y2, a = {}) {
  return { t: 'line', a: { x1: r2(x1), y1: r2(y1), x2: r2(x2), y2: r2(y2), ...a } };
}

/** A path node from points (open polyline, or closed when `close`). */
export function pathOf(pts, a = {}, close = false) {
  const good = pts.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (!good.length) return null;
  const d = `M${good.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}${close ? 'Z' : ''}`;
  return { t: 'path', a: { d, ...a } };
}

/** A rect node. */
export function rect(x, y, w, h, a = {}) {
  return { t: 'rect', a: { x: r2(x), y: r2(y), width: r2(Math.max(0, w)), height: r2(Math.max(0, h)), ...a } };
}

/**
 * Margins that fit the tick labels and titles.
 * @param {any} ctx
 * @param {{ yLabels?: string[], yTitle?: string, xTitle?: string, rightLabels?: string[], top?: number, bottomExtra?: number, minLeft?: number, height?: number }} o
 */
export function margins(ctx, o = {}) {
  const fs = ctx.fs;
  const yLab = Math.max(0, ...(o.yLabels || []).map((s) => textWidth(s, fs)));
  const right = Math.ceil(Math.max(10 * ctx.u, ...(o.rightLabels || []).map((s) => textWidth(s, fs) + fs * 0.6)));
  const top = Math.ceil(o.top ?? fs * 0.8);
  const bottom = Math.ceil(fs * 1.9 + (o.xTitle ? fs * 1.5 : 0) + (o.bottomExtra || 0));
  // The y title's room: ROTATED_REACH left of its first line, its other lines and their descenders to the right
  // (review round 5: a three-line Thai title ran into the tick labels). With the chart height it is fitted as yAxis
  // will fit it; the room is never less than the 2 em it always had.
  let yRoom = 0;
  if (o.yTitle) {
    const fit = o.height ? fitTitle(o.yTitle, o.height - top - bottom, fs, minFont(ctx)) : { lines: [o.yTitle], size: fs };
    yRoom = Math.max(fs * 2, ((fit.lines.length - 1) * 1.05 + ROTATED_REACH + TITLE_DESCENT) * fit.size);
  }
  const left = Math.ceil(Math.max(o.minLeft || 0, yLab + fs * 0.6 + yRoom + 4 * ctx.u));
  return { left, right, top, bottom };
}

/**
 * An axis title that fits the length of its axis: the full font when it fits, else a smaller font (down to
 * 0.75 of it), else two or three lines at that font (review round 1: "...ใน 21 วั" cut at the panel edge of an 85 mm
 * figure, a rotated y title running past the plot height).
 * @returns {{ lines: string[], size: number }}
 */
export function fitTitle(title, room, fs, floor = null) {
  const w = textWidth(title, fs);
  if (w <= room || room <= 0) return { lines: [String(title)], size: fs };
  const min = floor ?? fs * 0.75;
  const size = Math.max(min, (fs * room) / w);
  if (textWidth(title, size) <= room) return { lines: [String(title)], size: r2(size) };
  const lines = wrapWords(title, room, min);
  return { lines: lines.length > 3 ? [lines[0], lines[1], lines.slice(2).join(' ')] : lines, size: r2(min) };
}

/** The smallest type a chart prints: 7 pt at print size (the floor journals set for 85 and 174 mm figures,
 * review round 2: titles fitted down to 6 pt), three quarters of the screen font on screen. */
export function minFont(ctx) {
  return ctx.unit === 'pt' ? Math.min(ctx.fs, 7) : ctx.fs * 0.75;
}

/** Title nodes along an axis: one line centred, or two lines stacked around the same centre. */
export function titleNodes(cx, cy, fit, attrs, rotate = false) {
  const step = fit.size * 1.05;
  return fit.lines.map((l, i) => {
    const off = (i - (fit.lines.length - 1) / 2) * step;
    const x = rotate ? cx + off : cx;
    const y = rotate ? cy : cy + off;
    return text(x, y, l, { ...attrs, 'font-size': fit.size, ...(rotate ? { transform: `rotate(-90 ${r2(x)} ${r2(y)})` } : {}) });
  });
}

/** The x axis title centred under the plot, fitted to the room it has on both sides of that centre. */
export function xTitleNodes(ctx, box, title, extra = 0) {
  const cx = (box.left + box.right) / 2;
  const room = 2 * Math.min(cx, ctx.width - cx) - ctx.fs * 0.5;
  return titleNodes(cx, box.bottom + ctx.fs * 2.9 + extra, fitTitle(title, room, ctx.fs, minFont(ctx)), { 'text-anchor': 'middle', fill: 'ink' });
}

/**
 * A numeric y axis on the left: line, ticks, labels, gridlines, title.
 * @returns {any[]} nodes
 */
export function yAxis(ctx, box, scale, ticks, labels, title, o = {}) {
  const u = ctx.u;
  const nodes = [];
  for (let i = 0; i < ticks.length; i += 1) {
    const y = scale(ticks[i]);
    if (y === null || !Number.isFinite(y)) continue;
    if (o.grid !== false) nodes.push(line(box.left, y, box.right, y, { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` }));
    nodes.push(line(box.left - 4 * u, y, box.left, y, { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(box.left - 6 * u, y + ctx.fs * 0.35, labels[i], { 'text-anchor': 'end', 'font-size': ctx.fs, fill: 'soft' }));
  }
  nodes.push(line(box.left, box.top, box.left, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  if (title) {
    const cy = (box.top + box.bottom) / 2;
    const fit = fitTitle(title, box.bottom - box.top, ctx.fs, minFont(ctx));
    // the first of one to three lines sits ROTATED_REACH in from the left edge, so no stacked Thai mark is cut
    // (review round 2, a 390 px screen; round 5, every saved figure with a Thai y title)
    const cx = Math.max(ctx.fs * ROTATED_REACH, ((fit.lines.length - 1) / 2) * fit.size * 1.05 + fit.size * ROTATED_REACH);
    nodes.push(...titleNodes(cx, cy, fit, { 'text-anchor': 'middle', fill: 'ink' }, true));
  }
  return nodes;
}

/**
 * A numeric x axis at the bottom.
 * @returns {any[]} nodes
 */
export function xAxis(ctx, box, scale, ticks, labels, title, o = {}) {
  const u = ctx.u;
  const nodes = [];
  for (let i = 0; i < ticks.length; i += 1) {
    const x = scale(ticks[i]);
    if (x === null || !Number.isFinite(x)) continue;
    if (o.grid) nodes.push(line(x, box.top, x, box.bottom, { stroke: 'line', 'stroke-width': r2(0.8 * u), 'stroke-dasharray': `${r2(2 * u)} ${r2(3 * u)}` }));
    nodes.push(line(x, box.bottom, x, box.bottom + 4 * u, { stroke: 'soft', 'stroke-width': r2(u) }));
    nodes.push(text(x, box.bottom + ctx.fs * 1.35, labels[i], { 'text-anchor': 'middle', 'font-size': ctx.fs, fill: 'soft' }));
  }
  nodes.push(line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) }));
  if (title) nodes.push(...xTitleNodes(ctx, box, title));
  return nodes;
}

/**
 * How group labels sit under a band axis: every label is printed (review round 2: thinning dropped a diet's
 * name from a journal figure). A label that is too wide for its band is wrapped to two lines, then set in a
 * smaller font down to the floor, then staggered so neighbours alternate between two rows.
 * @param {string[]} labels @param {number} room width of one band minus the gap between labels
 * @returns {{ size: number, lines: string[][], stagger: boolean, rows: number, extra: number }}
 */
export function categoryLayout(ctx, labels, room) {
  const floor = minFont(ctx);
  const fits = (size, width) => {
    const lines = labels.map((l) => (textWidth(l, size) <= width ? [String(l)] : wrapWords(l, width, size)));
    const ok = lines.every((ls) => ls.length <= 2 && ls.every((x) => textWidth(x, size) <= width));
    return ok ? lines : null;
  };
  const sizes = [];
  for (let s = ctx.fs; s > floor + 1e-9; s -= ctx.fs * 0.0625) sizes.push(s);
  sizes.push(floor);
  let size = ctx.fs;
  let lines = null;
  let stagger = false;
  for (const s of sizes) { lines = fits(s, room); if (lines) { size = s; break; } }
  if (!lines && labels.length > 1) {
    size = floor;
    stagger = true;
    lines = labels.map((l) => (textWidth(l, size) <= 2 * room ? [String(l)] : wrapWords(l, 2 * room, size)));
  }
  if (!lines) { size = floor; lines = labels.map((l) => wrapWords(l, room, size)); }
  const per = Math.max(1, ...lines.map((ls) => ls.length));
  const rows = stagger ? 2 * per : per;
  return { size: r2(size), lines, stagger, rows, extra: (rows - 1) * size * 1.2 };
}

/**
 * Category labels under a band axis, all of them (see categoryLayout).
 * @param {{ pos: number, label: string }[]} cats
 */
export function categoryAxis(ctx, box, cats, title) {
  const u = ctx.u;
  const nodes = [line(box.left, box.bottom, box.right, box.bottom, { stroke: 'soft', 'stroke-width': r2(u) })];
  const bw = cats.length > 1 ? Math.abs(cats[1].pos - cats[0].pos) : box.right - box.left;
  const L = categoryLayout(ctx, cats.map((c) => c.label), bw - 6 * u);
  const step = L.size * 1.2;
  const per = L.stagger ? L.rows / 2 : L.rows;
  cats.forEach((c, i) => {
    const y0 = box.bottom + ctx.fs * 1.35 + (L.stagger && i % 2 ? per * step : 0);
    L.lines[i].forEach((ln, k) => nodes.push(text(c.pos, y0 + k * step, ln, { 'text-anchor': 'middle', 'font-size': L.size, fill: 'ink' })));
  });
  if (title) nodes.push(...xTitleNodes(ctx, box, title, L.extra));
  return nodes;
}

/**
 * Nice ticks for a linear value axis `pixels` long, labels at least 2.5 em apart (vertical axes need
 * only the text height apart, so they pass a smaller gap).
 */
export function ticksFor(ctx, domain, pixels, o = {}) {
  const gap = o.minGapPx ?? (o.vertical ? ctx.fs * 2.2 : ctx.fs * 3.4);
  return niceTicks(domain[0], domain[1], { pixels, minGapPx: gap, log: Boolean(o.log) });
}

/**
 * Legend entries for groups: colour token and shape by index.
 * @param {string[]} labels
 */
export function groupLegend(labels) {
  return labels.map((label, i) => ({ label, color: seriesToken(i), shape: seriesShape(i) }));
}

/**
 * Legend nodes drawn in one or more rows above the plot, each a marker (or a line sample) and its label.
 * Returns the nodes and the height they take.
 */
/** Words of a label on lines no wider than `room` (a word longer than the line keeps its own line). */
export function wrapWords(label, room, fs) {
  // Tokens carry the separator they had in the label (a space, or nothing inside a word), so a line is the
  // label's own text. A word wider than the line is broken at Thai word boundaries (Intl.Segmenter), then
  // at grapheme clusters, and the rest carries to the next line: no character is dropped and a vowel or
  // tone mark never leaves its consonant (review round 4: Thai column names have no spaces, and the old cut
  // added a dash and dropped the rest of the name).
  // A number stays with the word after it ('6 ชั่วโมง', '21 วัน') whenever the pair fits (review round 5).
  const words = [];
  for (const w of String(label).split(/\s+/).filter(Boolean)) {
    const prev = words[words.length - 1];
    if (prev && /^[-+]?[\d.,]+%?$/.test(prev) && textWidth(`${prev} ${w}`, fs) <= room) words[words.length - 1] = `${prev} ${w}`;
    else words.push(w);
  }
  const tokens = [];
  for (const [i, w] of words.entries()) {
    const first = i === 0 ? '' : ' ';
    if (textWidth(w, fs) <= room) { tokens.push({ sep: first, text: w }); continue; }
    splitWide(w, room, fs).forEach((piece, k) => tokens.push({ sep: k === 0 ? first : '', text: piece.text, solo: piece.solo }));
  }
  // ... and with the first piece of a long word after it when the whole word does not fit.
  for (let i = tokens.length - 2; i >= 0; i -= 1) {
    const a = tokens[i], b = tokens[i + 1];
    if (/^[-+]?[\d.,]+%?$/.test(a.text) && b.sep === ' ' && !b.solo && textWidth(`${a.text} ${b.text}`, fs) <= room) tokens.splice(i, 2, { sep: a.sep, text: `${a.text} ${b.text}` });
  }
  const out = [];
  let cur = '';
  for (const tk of tokens) {
    // a line cut out of one word by letters shares its line with nothing ('ชั่ว / โมง', never 'โมงหลัง')
    if (tk.solo) { if (cur) out.push(cur); out.push(tk.text); cur = ''; continue; }
    const next = cur ? `${cur}${tk.sep}${tk.text}` : tk.text;
    if (cur && textWidth(next, fs) > room) { out.push(cur); cur = tk.text; } else cur = next;
  }
  if (cur) out.push(cur);
  return out.length ? out : [String(label)];
}

const segmenter = (granularity) => {
  try { return typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity }) : null; } catch { return null; }
};
const WORDS = segmenter('word');
/** น้ำ, the head of น้ำหนัก, น้ำนม, น้ำเหลือง (escaped: workspace code carries no Thai text of its own). */
const WATER = '\u0e19\u0e49\u0e33';
const GRAPHEMES = segmenter('grapheme');

/** Grapheme clusters of a string; without Intl.Segmenter, a base character with the marks that follow it. */
export function graphemes(s) {
  const raw = GRAPHEMES ? Array.from(GRAPHEMES.segment(s), (x) => x.segment) : String(s).match(/\P{M}\p{M}*/gu) || [];
  // A Thai leading vowel (U+0E40 to U+0E44) is its own grapheme but is read with the consonant after it: keep them
  // together so a line never ends on one.
  const out = [];
  for (let i = 0; i < raw.length; i += 1) {
    const cp = raw[i].length === 1 ? raw[i].codePointAt(0) : 0;
    if (cp >= 0x0e40 && cp <= 0x0e44 && i + 1 < raw.length) { out.push(raw[i] + raw[i + 1]); i += 1; } else out.push(raw[i]);
  }
  return out;
}

/**
 * A space-free word wider than `room`, in lines that each fit (word segments first, then graphemes). A line cut
 * out of a single segment by letters is `solo`: nothing else joins it.
 * @returns {{ text: string, solo: boolean }[]}
 */
function splitWide(word, room, fs) {
  // A word without Thai letters is never broken: 'Da / ys' reads worse than a word that runs past the room
  // (review round 5, 'Days followed' in an 85 mm two-column panel). Only Thai, which has no spaces, is cut.
  if (!/[\u0e01-\u0e5b]/.test(word)) return [{ text: word, solo: false }];
  const raw = WORDS ? Array.from(WORDS.segment(word), (x) => x.segment) : [word];
  // ICU sometimes ends a segment on the first letter of the next word's initial cluster ('หลังค|ลอด' for
  // หลัง|คลอด): a bare cluster initial after a bare consonant moves forward when the next segment starts with
  // ร, ล or ว.
  for (let i = 0; i + 1 < raw.length; i += 1) {
    if (/[\u0e01-\u0e2e][\u0e01\u0e02\u0e04\u0e15\u0e1b\u0e1c\u0e1e]$/.test(raw[i]) && /^[\u0e23\u0e25\u0e27]/.test(raw[i + 1])) { raw[i + 1] = raw[i].slice(-1) + raw[i + 1]; raw[i] = raw[i].slice(0, -1); }
  }
  // Where to break: between the segmenter's words, and inside one only when that word alone is wider than the
  // line. Each place has a cost: inside a word 4; after น้ำ 3 (ICU splits น้ำ|หนัก and น้ำ|เหลือง, and a line
  // ending in น้ำ cuts the compound); next to a segment of one or two letters 1 (แรก|เกิด, นม|น้ำ, ที่|ได้ are
  // often parts of one term); between two longer words 0. The fewest lines win, then the lowest cost, then the
  // most even lines (review round 6: the old rule glued every short segment to its neighbour, so น้ำหนักแรกเกิด
  // became one unit and was then cut by letters as 'น้ำหนักแรกเกิ / ด').
  const units = [];
  const cost = [];
  const seg = [];
  raw.forEach((sg, i) => {
    const whole = textWidth(sg, fs) <= room;
    for (const part of whole ? [sg] : graphemes(sg)) { units.push(part); cost.push(4); seg.push(whole ? -1 : i); }
    if (i + 1 < raw.length) cost[cost.length - 1] = sg === WATER ? 3 : graphemes(sg).length <= 2 || graphemes(raw[i + 1]).length <= 2 ? 1 : 0;
  });
  return bestLines(units, cost, seg, room, fs);
}

/**
 * Units on as few lines no wider than `room` as they fit on (a unit wider than the line keeps a line of its own);
 * among those, the lowest total cost of the places broken, then the most even lines. cost[i] is the cost of
 * breaking after units[i]; seg[i] >= 0 marks a letter of a word cut by letters, and such a line holds letters
 * of that word only.
 */
function bestLines(units, cost, seg, room, fs) {
  const mixes = (i, j) => { for (let u = i; u < j; u += 1) if ((seg[u] >= 0 || seg[j - 1] >= 0) && seg[u] !== seg[j - 1]) return true; return false; };
  const best = [{ lines: 0, cost: 0, slack: 0, from: -1 }];
  for (let j = 1; j <= units.length; j += 1) {
    let pick = null;
    for (let i = j - 1; i >= 0; i -= 1) {
      const width = textWidth(units.slice(i, j).join(''), fs);
      if (j - i > 1 && (width > room || mixes(i, j))) break;
      const p = best[i];
      const c = { lines: p.lines + 1, cost: p.cost + (i > 0 ? cost[i - 1] : 0), slack: p.slack + (room - Math.min(width, room)) ** 2, from: i };
      if (!pick || c.lines < pick.lines || (c.lines === pick.lines && (c.cost < pick.cost || (c.cost === pick.cost && c.slack < pick.slack)))) pick = c;
    }
    best.push(pick);
  }
  const lines = [];
  for (let j = units.length; j > 0; j = best[j].from) lines.unshift({ text: units.slice(best[j].from, j).join(''), solo: seg[best[j].from] >= 0 });
  return lines;
}

export function legendNodes(ctx, legend, x0, y0, maxWidth, markerFor) {
  const nodes = [];
  const fs = ctx.fs;
  let x = x0;
  let y = y0 + fs * 0.9;
  for (const item of legend) {
    // A label wider than the line is wrapped at its spaces onto lines of its own (review round 1: the ROC
    // legend's "AUC 0.922 (95% CI ...)" ran past the right edge at 84 mm and on screen).
    const room = maxWidth - fs * 1.4;
    const lines = textWidth(item.label, fs) <= room ? [item.label] : wrapWords(item.label, room, fs);
    const w = fs * 1.4 + Math.max(...lines.map((l) => textWidth(l, fs))) + fs * 1.2;
    if (x > x0 && (lines.length > 1 || x + w > x0 + maxWidth)) {
      x = x0;
      y += fs * 1.5;
    }
    nodes.push(...markerFor(item, x + fs * 0.5, y - fs * 0.33));
    lines.forEach((l, i) => nodes.push(text(x + fs * 1.3, y + i * fs * 1.25, l, { 'font-size': fs, fill: 'ink' })));
    if (lines.length > 1) {
      y += (lines.length - 1) * fs * 1.25;
      x = x0 + maxWidth;
    } else x += w;
  }
  return { nodes, height: legend.length ? y - y0 + fs * 0.7 : 0 };
}
