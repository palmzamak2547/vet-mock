// ============================================================
// kit.js: the frame, colours and type every share card is drawn with
// ============================================================
// One system for the recap, the daily question and the score card, so a
// student's shares read as one set.
//
// Frame. A 1080x1920 story with a 1080x1350 core centred in it: a feed post
// is that core cut out, so every card is also a complete 4:5 poster. Inside
// the core a 96 px margin gives the live area, which is where anything that
// must be read goes; Instagram's top and bottom bars cover the outer bands,
// so they carry only decoration (crop marks, a ghosted numeral, artwork).
//
// Type. Sizes step by 1.5 from 32 (32 48 72 108 162 243 365); Thai is never
// set below 36. Thai display in Noto Serif Thai, numerals and Latin in
// Fraunces, small labels in the loopless IBM Plex Sans Thai.
//
// Colour. The app's own paper and ink, light and dark, with the accents it
// already uses as text (each at least 4.5:1 on its paper; see the test).
//
// Every text this kit draws is recorded with its ink box, so a test can
// prove nothing leaves the frame or runs into its neighbour.
// ============================================================

import { wrapLines, inkMetrics } from '../canvas-wrap.js';
import { CARD_SERIF, CARD_NUMERAL, CARD_LABEL } from './fonts.js';

export const W = 1080;
export const H = 1920;
export const CORE = { top: 285, bottom: 1635 };
export const MARGIN = 96;
export const LIVE = { left: MARGIN, right: W - MARGIN, top: CORE.top + MARGIN, bottom: CORE.bottom - MARGIN };

// The frames a card can be drawn in. A story keeps its readable content in
// the 4:5 core; a feed post is that core alone, with its masthead and
// signature inside the same 96 px margins.
export const STORY = { w: W, h: H, core: CORE, live: LIVE };
export const POST = {
  w: W, h: 1350,
  core: { top: 34, bottom: 1316 },
  live: { left: MARGIN, right: W - MARGIN, top: 186, bottom: 1206 },
};
export const SIZE = { xs: 36, s: 48, m: 72, l: 108, xl: 162, xxl: 243, hero: 365 };

const THAI = /[฀-๿]/u;

/**
 * WebKit lays the variable Thai serif out at the weight it is asked for but
 * paints its default instance: measured 2026-10-28 in Playwright's WebKit,
 * "ตารางสอบ" at 400 and at 700 inked the same pixels, so every card's Thai
 * heading came out regular on iPhones and Macs. Read by ink, after the fonts
 * load, so an engine that paints the weight (or a fallback face, offline) is
 * left alone.
 */
export function paintsSerifWeight() {
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = 64;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return true;
  const ink = (weight) => {
    x.clearRect(0, 0, c.width, c.height);
    x.font = `${weight} 40px ${CARD_SERIF}`;
    x.fillText('ตารางสอบ', 4, 46);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 128) n += 1;
    return n;
  };
  // A canvas that cannot be read back (a test double, a privacy mode) keeps the plain weight.
  try {
    const regular = ink(400);
    return regular === 0 || ink(700) / regular > 1.15;
  } catch {
    return true;
  }
}

/** The stroke that stands in for a Thai serif weight the engine will not paint (0 when it paints it). */
export function fauxBold({ weight = 400, size = SIZE.s, family = CARD_LABEL } = {}, text, painted) {
  if (painted || family !== CARD_SERIF || weight < 600 || !THAI.test(String(text))) return 0;
  return size * (weight >= 700 ? 0.04 : 0.028);
}

export const PALETTES = {
  light: {
    bg: '#f6efe4', ink: '#2b2419', soft: '#5c5246', rule: 'rgba(43,36,25,0.18)', faint: 'rgba(43,36,25,0.07)',
    sage: '#355a39', sageField: '#4a6b4a', rose: '#93454b', gold: '#76511e', goldField: '#b88940',
    glass: 'rgba(255,255,255,0.55)', grain: '43,36,25', paw: '#fdf8ef',
    // ECG paper is printed pink; the trace is the app's green.
    gridMinor: 'rgba(147,69,75,0.1)', gridMajor: 'rgba(147,69,75,0.22)', trace: '#355a39',
    // Stains on the daily slides and the score scale's fill.
    right: '#4a6b4a', rightEdge: '#6f8f6a', wrong: '#b4555b', wrongEdge: '#d08a8e',
    // The printed timetable's near-white page (timetable-card.js): a printer
    // wastes ink on a tinted sheet and stops short of its edge anyway.
    print: '#fffdf9',
  },
  dark: {
    bg: '#1a1612', ink: '#f0e6d2', soft: '#bcb19e', rule: 'rgba(240,230,210,0.2)', faint: 'rgba(240,230,210,0.07)',
    sage: '#9bc99b', sageField: '#7fae7f', rose: '#edaaaa', gold: '#e4ba73', goldField: '#e4ba73',
    glass: 'rgba(255,255,255,0.05)', grain: '240,230,210', paw: '#fdf8ef',
    gridMinor: 'rgba(237,170,170,0.08)', gridMajor: 'rgba(237,170,170,0.18)', trace: '#9bc99b',
    right: '#7fae7f', rightEdge: '#a6cba3', wrong: '#d98a8f', wrongEdge: '#efb4b6',
  },
};

export const fontOf = (weight, size, family) => `${weight} ${size}px ${family}`;

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** "13 ต.ค. 2569" from a 'YYYY-MM-DD' key, a Date or a timestamp. */
export function thaiDate(value) {
  let d;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, day] = value.split('-').map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = value instanceof Date ? value : new Date(value);
  }
  if (!value || Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
export const FAMILY = { serif: CARD_SERIF, numeral: CARD_NUMERAL, label: CARD_LABEL };

/** A small seeded generator (mulberry32): the same card draws the same grain. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedOf(text) {
  let h = 2166136261;
  for (const ch of String(text)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/**
 * A card to draw on. `text` and `para` draw with the kit's type and record
 * what they drew; `boxes` is the record.
 */
// Trial layouts measure text and draw nothing else, on one canvas per frame
// size: a fresh 1080x1920 canvas per trial cost 8 MB each, a dozen times a
// card, which iOS counts against its canvas memory.
const scratch = new Map();
function scratchCanvas(frame) {
  const k = `${frame.w}x${frame.h}`;
  if (!scratch.has(k)) {
    const c = document.createElement('canvas');
    c.width = frame.w;
    c.height = frame.h;
    scratch.set(k, c);
  }
  return scratch.get(k);
}

// `scale` draws the same layout at more pixels (the A4 timetable prints at 2x);
// every coordinate and every recorded box stays in the frame's own units.
export function createCard(theme = 'light', seed = 1, frame = STORY, { dry = false, scale = 1 } = {}) {
  const canvas = dry ? scratchCanvas(frame) : document.createElement('canvas');
  if (!dry) {
    canvas.width = Math.round(frame.w * scale);
    canvas.height = Math.round(frame.h * scale);
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  if (!dry && scale !== 1) ctx.scale(scale, scale);
  const pal = PALETTES[theme] || PALETTES.light;
  const boxes = [];
  // dry: a trial layout. Text is still set (its boxes are what a trial is
  // for); paper, grain, rules and pictures are skipped.
  const card = { canvas, ctx, pal, theme, boxes, seed, frame, dry };

  /** Set the context's font and colour from a style. */
  card.style = ({ weight = 400, size = SIZE.s, family = FAMILY.label, color = pal.ink, align = 'left' } = {}) => {
    ctx.font = fontOf(weight, size, family);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
  };

  // By the ink when it reaches past the advance, as the layout check does: a
  // line wrapped by advance alone stuck out 2 px ("ย์" at the end of a title).
  card.measure = (s) => {
    const m = ctx.measureText(s);
    return Math.max(m.width, (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0));
  };

  /**
   * Like text, left-aligned by the ink rather than the pen: a 300 px numeral
   * carries a side bearing wide enough to look indented against the column.
   */
  card.textInk = (str, x, y, style = {}, role = 'text') => {
    card.style({ ...style, align: 'left' });
    const left = ctx.measureText(String(str)).actualBoundingBoxLeft ?? 0;
    return card.text(str, x + left, y, { ...style, align: 'left' }, role);
  };

  /** Text on a paper-coloured pad, so it stays legible over a grid or trace. */
  card.padded = (str, x, y, style = {}, role = 'text') => {
    card.style(style);
    const m = ctx.measureText(String(str));
    const w = m.width;
    const left = style.align === 'right' ? x - w : x;
    ctx.save();
    ctx.fillStyle = pal.bg;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    const pad = 10;
    const top = y - (m.actualBoundingBoxAscent ?? style.size) - pad;
    const h = (m.actualBoundingBoxAscent ?? style.size) + (m.actualBoundingBoxDescent ?? 0) + pad * 2;
    if (typeof ctx.roundRect === 'function') ctx.roundRect(left - pad, top, w + pad * 2, h, 10);
    else ctx.rect(left - pad, top, w + pad * 2, h);
    ctx.fill();
    ctx.restore();
    return card.text(str, x, y, style, role);
  };

  /** Draw one line at a baseline; returns its ink box. */
  card.text = (str, x, y, style = {}, role = 'text') => {
    card.style(style);
    const s = String(str);
    ctx.fillText(s, x, y);
    // `embolden`: a stroke in the text's own ink, for an engine that paints a
    // variable face's default weight whatever weight it was asked for. A
    // card that does not set it gets fauxBold's, decided once per card.
    let stroke = dry ? 0 : style.embolden ?? fauxBold(style, s, false);
    if (stroke && style.embolden === undefined) {
      if (card.paintsWeight === undefined) card.paintsWeight = paintsSerifWeight();
      if (card.paintsWeight) stroke = 0;
    }
    if (stroke) {
      ctx.save();
      ctx.lineWidth = stroke;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = ctx.fillStyle;
      ctx.strokeText(s, x, y);
      ctx.restore();
    }
    const m = ctx.measureText(s);
    const box = {
      role, text: s, size: style.size ?? SIZE.s, family: style.family ?? FAMILY.label,
      left: x - (m.actualBoundingBoxLeft ?? 0),
      right: x + (m.actualBoundingBoxRight ?? m.width),
      top: y - (m.actualBoundingBoxAscent ?? 0),
      bottom: y + (m.actualBoundingBoxDescent ?? 0),
    };
    boxes.push(box);
    return box;
  };

  /**
   * Wrapped text from a top edge. The line box comes from the font's real
   * Thai ink (tone marks above, vowels below), not from its size, so stacked
   * marks never touch the line above. Returns the y of the last line's ink.
   */
  card.para = (str, x, top, width, style = {}, { maxLines = 3, balance = true, leading = 1.32, role = 'text' } = {}) => {
    card.style(style);
    const lines = wrapLines(card.measure, str, width, { maxLines, balance });
    // True when the wrap ran out of lines and ended the last one in an ellipsis.
    const cut = lines.length === maxLines && lines[maxLines - 1].endsWith('…') && !String(str).trimEnd().endsWith('…');
    const { ascent, descent } = inkMetrics(ctx);
    const size = style.size ?? SIZE.s;
    const step = Math.max(size * leading, ascent + descent + size * 0.08);
    let y = top + ascent;
    let bottom = top;
    for (const line of lines) {
      const box = (style.align ?? 'left') === 'left' ? card.textInk(line, x, y, style, role) : card.text(line, x, y, style, role);
      bottom = Math.max(bottom, box.bottom);
      y += step;
    }
    // bottom is the ink's, right for a heading followed by something else.
    // lineBottom is the line box's, the same whatever the glyphs: items set
    // one under another stack by it, or a line with no vowel below pulls the
    // next item closer and the list runs unevenly.
    const lineBottom = lines.length ? Math.max(bottom, top + ascent + (lines.length - 1) * step + descent) : bottom;
    return { bottom, lineBottom, lines, step, ascent, cut };
  };

  /** The largest size, from max down to min, at which `str` fits `width`. */
  card.fit = (str, width, { weight = 700, family = FAMILY.serif, max = SIZE.l, min = SIZE.m } = {}) => {
    ctx.font = fontOf(weight, max, family);
    const w = card.measure(str);
    return w <= width ? max : Math.max(min, Math.floor((max * width) / w));
  };

  return card;
}

/** Paper with a fine seeded grain. */
export function paper(card) {
  if (card.dry) return;
  const { ctx, pal } = card;
  const { w, h } = card.frame;
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);
  const r = rng(card.seed);
  for (let i = 0, n = Math.round((5200 * h) / H); i < n; i++) {
    const x = r() * w;
    const y = r() * h;
    const s = 0.7 + r() * 1.3;
    ctx.fillStyle = `rgba(${pal.grain},${(0.025 + r() * 0.05).toFixed(3)})`;
    ctx.fillRect(x, y, s, s);
  }
}

/** Printer's crop marks just outside the 4:5 core: where a feed post is cut. */
export function cropMarks(card) {
  if (card.dry) return;
  const { ctx, pal } = card;
  const len = 34;
  const gap = 14;
  ctx.save();
  ctx.strokeStyle = pal.soft;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const y of [CORE.top, CORE.bottom]) {
    const dir = y === CORE.top ? -1 : 1;
    for (const x of [MARGIN / 2, W - MARGIN / 2]) {
      ctx.moveTo(x, y + dir * gap);
      ctx.lineTo(x, y + dir * (gap + len));
    }
    ctx.moveTo(0, y);
    ctx.lineTo(MARGIN / 2 - gap, y);
    ctx.moveTo(W, y);
    ctx.lineTo(W - MARGIN / 2 + gap, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** A hairline across the live area. */
export function rule(card, y, { from = card.frame.live.left, to = card.frame.live.right, color, width = 1.5 } = {}) {
  if (card.dry) return;
  const { ctx, pal } = card;
  ctx.save();
  ctx.strokeStyle = color || pal.rule;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(from, y);
  ctx.lineTo(to, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * A numeral set as form in an outer band: outlined, huge, cut by the edge.
 * Decoration only, so it is not recorded as text.
 */
export function ghostNumeral(card, str, { baseline = H + 120, size = 620, align = 'right', x = W - 40 } = {}) {
  if (card.dry) return;
  const { ctx, pal } = card;
  ctx.save();
  ctx.font = fontOf(800, size, FAMILY.numeral);
  ctx.textAlign = align;
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 2.5;
  ctx.strokeText(String(str), x, baseline);
  ctx.restore();
}

// The VetMock mark, drawn as vectors from public/vetmock-logo.svg (512 grid),
// so the card needs no image download to carry the brand.
export function logoMark(card, x, y, size) {
  if (card.dry) return;
  const { ctx, pal } = card;
  const k = size / 512;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = pal.sageField;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(0, 0, 512, 512, 96);
  else ctx.rect(0, 0, 512, 512);
  ctx.fill();
  ctx.fillStyle = pal.paw;
  const toes = [[256, 338, 92, 74, 0], [148, 232, 36, 48, -18], [212, 158, 34, 46, -6], [300, 158, 34, 46, 6], [364, 232, 36, 48, 18]];
  for (const [cx, cy, rx, ry, deg] of toes) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (deg * Math.PI) / 180, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** The masthead above the live area: a section name left, a date right. */
export function masthead(card, left, right) {
  const { core, live } = card.frame;
  const y = core.top + 62;
  card.textInk(left, live.left, y, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: card.pal.sage }, 'masthead');
  if (right) {
    const style = { weight: 500, size: SIZE.xs, family: FAMILY.label, color: card.pal.soft, align: 'right' };
    // Set by the ink: a closing mark (the ์ of "สัตว์") inks past the advance
    // and left the live area by 5 px.
    card.style(style);
    const over = Math.max(0, card.ctx.measureText(String(right)).actualBoundingBoxRight ?? 0);
    card.text(right, live.right - over, y, style, 'masthead');
  }
  rule(card, y + 22);
}

/** The signature below the live area: mark and name left, address right. */
export function footer(card, right = 'vetmock.com') {
  const { core, live } = card.frame;
  const y = core.bottom - 40;
  logoMark(card, live.left, y - 40, 48);
  card.text('VetMock', live.left + 64, y, { weight: 600, size: 40, family: FAMILY.numeral, color: card.pal.ink }, 'footer');
  card.text(right, live.right, y, { weight: 500, size: SIZE.xs, family: FAMILY.label, color: card.pal.soft, align: 'right' }, 'footer');
}

const pictures = new Map();
/**
 * A same-origin picture for a card, decoded once and kept. Resolves to null
 * when it cannot load: the card then draws without it.
 */
export function picture(src) {
  if (!src || typeof Image === 'undefined') return Promise.resolve(null);
  if (!pictures.has(src)) {
    pictures.set(src, new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => { pictures.delete(src); resolve(null); };
      img.src = src;
    }));
  }
  return pictures.get(src);
}

/**
 * Mochi in the story's bottom band, outside the 4:5 core: the story gets
 * the mascot, the feed post stays a clean poster. Decoration, so not
 * recorded as text.
 */
export function sticker(card, img, { x = MARGIN - 8, bottom = H - 26, height = 236 } = {}) {
  if (!img || card.frame !== STORY || card.dry) return;
  const w = img.naturalWidth || img.width || 1;
  const h = img.naturalHeight || img.height || 1;
  const width = (height * w) / h;
  card.ctx.drawImage(img, x, bottom - height, width, height);
}

/**
 * An engraving across the story's top band, printed in one ink of the
 * card's palette: `img` is a mask (ink as alpha, scripts/og/prepare-art.mjs),
 * so the same plate prints dark on paper and light on night.
 */
export function frieze(card, img, { top = 112, color } = {}) {
  if (!img || card.frame !== STORY || card.dry) return 0;
  const x = MARGIN;
  const w = W - 2 * MARGIN;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  // The whole strip across the live width: its frames end on their own gaps.
  const h = Math.round((w * ih) / iw);
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const o = off.getContext('2d');
  o.drawImage(img, 0, 0, w, h);
  o.globalCompositeOperation = 'source-in';
  o.fillStyle = color || card.pal.soft;
  o.fillRect(0, 0, w, h);
  card.ctx.drawImage(off, x, top);
  return h;
}

/**
 * The story's top band: an engraving frieze in ink and its credit under it,
 * both outside the 4:5 core (decoration, so not recorded as text).
 */
export function plateBand(card, img, credit) {
  if (!img || card.frame !== STORY || card.dry) return;
  const top = 116;
  const h = frieze(card, img, { top, color: card.pal.ink });
  const { ctx, pal } = card;
  ctx.save();
  ctx.font = fontOf(400, 32, FAMILY.numeral);
  ctx.fillStyle = pal.soft;
  ctx.textAlign = 'center';
  ctx.fillText(credit, W / 2, Math.min(top + h + 44, CORE.top - 22));
  ctx.restore();
}

/**
 * The layout search every story card shares: the largest of `sizes` whose
 * layout is clean, then the gaps opened up to `maxGap` times while the last
 * block keeps a breath above the signature. Every trial is a dry run; only
 * the answer is drawn in full.
 * @param {{ sizes: Array, maxGap?: number, draw: (size, gap, dry) => object }} o
 */
export function fitCard({ sizes, maxGap = 2, draw }) {
  const clean = (c) => layoutProblems(c.boxes, { frame: c.frame }).length === 0;
  const roomy = (c) => clean(c)
    && Math.max(...c.boxes.filter((b) => b.role !== 'footer').map((b) => b.bottom)) <= c.frame.live.bottom - 40;
  let chosen = [sizes[sizes.length - 1], 1];
  for (const size of sizes) {
    if (!clean(draw(size, 1, true))) continue;
    let lo = 1;
    let hi = maxGap;
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      if (roomy(draw(size, mid, true))) lo = mid; else hi = mid;
    }
    chosen = [size, lo];
    break;
  }
  const card = draw(chosen[0], chosen[1], false);
  return { card, problems: layoutProblems(card.boxes, { frame: card.frame }) };
}

export function toBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('the image could not be encoded'))), type, quality);
    } catch (err) {
      reject(err);
    }
  });
}

/** The 4:5 feed post: the core cut out of a finished story card. */
export function feedCut(card) {
  const out = document.createElement('canvas');
  out.width = W;
  out.height = CORE.bottom - CORE.top;
  out.getContext('2d').drawImage(card.canvas, 0, CORE.top, W, out.height, 0, 0, W, out.height);
  return out;
}

/**
 * What a layout check reads: text outside the frame, under the minimum size,
 * or running into another text. Empty means the card is clean.
 */
export function layoutProblems(boxes, { minThai = SIZE.xs, minLatin = 32, frame = STORY } = {}) {
  const problems = [];
  const thai = /[\u0E00-\u0E7F]/u;
  const { core, live } = frame;
  for (const b of boxes) {
    if (b.left < live.left - 1 || b.right > live.right + 1) problems.push(`"${b.text}" leaves the live area sideways`);
    if (b.top < core.top || b.bottom > core.bottom) problems.push(`"${b.text}" leaves the 4:5 core`);
    if (b.role !== 'masthead' && b.role !== 'footer' && (b.top < live.top - 1 || b.bottom > live.bottom + 1)) {
      problems.push(`"${b.text}" leaves the live area`);
    }
    if (b.size < (thai.test(b.text) ? minThai : minLatin)) problems.push(`"${b.text}" is set at ${b.size} px`);
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) {
        problems.push(`"${a.text}" runs into "${b.text}"`);
      }
    }
  }
  return problems;
}
