// ============================================================
// timetable-card.js: the exam timetable as a printed A4 page
// ============================================================
// One page per exam period (lib/exam-timetable.js), drawn with the share
// cards' type, ink and course prints (kit.js), at 300 dpi so the PDF prints
// sharp and the PNG still reads on a phone with a pinch. The page is near
// white, not the cards' warm paper: it is meant for a printer, where a tinted
// sheet wastes ink and stops short of the edge anyway.
//
// Every text goes through the kit, so the layout check that guards the share
// cards guards this page too (data-layout in the sheet, read by the e2e).
// ============================================================

import { createCard, rule, logoMark, picture, layoutProblems, FAMILY } from './kit.js';
import { wrapLines, inkMetrics } from '../canvas-wrap.js';

/** A4 at 150 px per inch, drawn at SCALE (300 dpi). */
export const A4 = {
  w: 1240, h: 1754,
  core: { top: 0, bottom: 1754 },
  live: { left: 88, right: 1152, top: 80, bottom: 1690 },
};
export const SCALE = 2;
const POINTS = { w: 595.28, h: 841.89 };
// Smallest sizes on paper: 22 px is 10.6 pt, 20 px is 9.6 pt.
const MIN = { thai: 22, latin: 20 };
const FRAME = 40;
export const BODY_BOTTOM = 1466;
const NOTES_TOP = 1486;
const SIGN_BASELINE = 1668;
const VIGNETTE_X = 300;
// The course code and about eighteen letters of the English name: what the
// room line leaves on its line however long the room is.
const LINE_TWO_MIN = 300;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const THAI = /[฀-๿]/u;

// A page with more papers than regular rows hold is set compact: a smaller
// title closer to the rows, shorter week headers, and rows down to 60 px.
// Below that two lines of 22 px Thai cannot clear each other: a stacked mark
// (ชั่) stands 28 px above its baseline in WebKit, a vowel below (ุ) 8 px
// under it.
// `top`: the kicker's top; the issue stamp sits 4 below it. The regular
// title is fitted to 680 px, so "ตารางสอบปลายภาค" sets at about 77.
const HEAD = {
  regular: { top: 150, title: 96, titleMin: 64, before: 30, after: 22 },
  compact: { top: 136, title: 64, titleMin: 56, before: 18, after: 12 },
};
export const ROWS = {
  regular: { min: 66, max: 118, weekH: 58, weekGap: 14, week: { size: 26, range: 24, base: 36, rule: 28 } },
  compact: { min: 60, max: 66, weekH: 36, weekGap: 6, week: { size: 24, range: 22, base: 28, rule: 20 } },
};

/** Baselines (from the row's middle) and type sizes for a row `h` tall. */
function rowStyle(h) {
  if (h >= ROWS.regular.min) {
    return {
      lines: [-5, 27], date: [-5, 25], pad: 8,
      numeral: clamp(Math.round(h * 0.54), 40, 62),
      name: clamp(Math.round(h * 0.31), 25, 34),
      time: clamp(Math.round(h * 0.29), 24, 31),
    };
  }
  return { lines: [-4, 24], date: [-7, 23], pad: 4, numeral: clamp(Math.round(h * 0.54), 32, 40), name: 23, time: MIN.thai };
}

/**
 * Where the rows go. `top` is where the body starts under the regular title
 * and under the compact one ({ regular, compact }, or one number for both);
 * `rows` papers in `weeks` week groups (a header each when there are two or
 * more) share what is left above `bottom`. Regular rows when they fit, else
 * compact ones; `fits` is false when even those pass `bottom`, and `end` is
 * where the last row ends. `mode` forces one. Pure: numbers in, numbers out.
 */
export function rowMetrics({ top, bottom = BODY_BOTTOM, rows, weeks, mode }) {
  const tops = typeof top === 'number' ? { regular: top, compact: top } : top;
  const plan = (kind) => {
    const r = ROWS[kind];
    const headers = weeks > 1 ? weeks * r.weekH + (weeks - 1) * r.weekGap : 0;
    const ideal = Math.floor((bottom - tops[kind] - headers) / Math.max(1, rows));
    const h = clamp(ideal, r.min, r.max);
    return {
      compact: kind === 'compact', top: tops[kind], h, headers,
      weekH: r.weekH, weekGap: r.weekGap, week: r.week,
      end: tops[kind] + headers + rows * h, fits: ideal >= r.min,
      ...rowStyle(h),
    };
  };
  if (mode) return plan(mode);
  const regular = plan('regular');
  return regular.fits ? regular : plan('compact');
}

/**
 * WebKit lays the variable Thai serif out at the weight it is asked for but
 * paints its default instance: measured 2026-10-28 in Playwright's WebKit,
 * "ตารางสอบ" at 400 and at 700 inked the same pixels, so every heading came out
 * regular. Read by ink, after the fonts load, so an engine that paints the
 * weight (or a fallback face, offline) is left alone.
 */
function paintsSerifWeight() {
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = 64;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return true;
  const ink = (weight) => {
    x.clearRect(0, 0, c.width, c.height);
    x.font = `${weight} 40px ${FAMILY.serif}`;
    x.fillText('ตารางสอบ', 4, 46);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 128) n += 1;
    return n;
  };
  const regular = ink(400);
  return regular === 0 || ink(700) / regular > 1.15;
}

/** Right-aligned by the ink: a closing mark (the ์ of "ศัลย์") inks past the advance. */
function textRight(card, str, x, y, style, role) {
  // Measured left-aligned: card.text never relies on the canvas's own alignment.
  card.style({ ...style, align: 'left' });
  const m = card.ctx.measureText(String(str));
  const over = Math.max(0, (m.actualBoundingBoxRight ?? m.width) - m.width);
  return card.text(str, x - over, y, { ...style, align: 'right' }, role);
}

function widthOf(card, str, style) {
  card.style(style);
  return card.measure(String(str));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

/** A small label on a tinted pill, right edge at `right`; returns its left edge. */
function pill(card, str, right, baseline, { color, fill, padY = 8 }) {
  const style = { weight: 600, size: MIN.thai, color };
  card.style(style);
  const m = card.ctx.measureText(str);
  const pad = 12;
  const w = card.measure(str) + pad * 2;
  const up = (m.actualBoundingBoxAscent ?? 18) + padY;
  const down = (m.actualBoundingBoxDescent ?? 6) + padY;
  if (!card.dry) {
    card.ctx.fillStyle = fill;
    roundRect(card.ctx, right - w, baseline - up, w, up + down, (up + down) / 2);
    card.ctx.fill();
  }
  card.text(str, right - w + pad, baseline, style, 'row');
  return right - w;
}

/** The course's own print on its paper tone, in a circle. */
function vignette(card, img, cover, cx, cy, d, past) {
  if (card.dry) return;
  const { ctx, pal } = card;
  ctx.save();
  ctx.globalAlpha = past ? 0.45 : 1;
  ctx.beginPath();
  ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
  ctx.fillStyle = cover?.paper || pal.faint;
  ctx.fill();
  if (img) {
    ctx.clip();
    const iw = img.naturalWidth || img.width || 1;
    const ih = img.naturalHeight || img.height || 1;
    const k = (d * 0.84) / Math.max(iw, ih);
    ctx.drawImage(img, cx - (iw * k) / 2, cy - (ih * k) / 2, iw * k, ih * k);
  }
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = past ? 0.45 : 1;
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * One paper's row. Each line of the course text is bounded by the right
 * column on its own line: the name by the session and time, the code and the
 * English name by the room. Returns what had to be cut from what a student
 * needs (the name, the room), for the layout check.
 */
function drawRow(card, r, img, top, m, { showDate, bold }) {
  const { ctx, pal } = card;
  const { left, right } = A4.live;
  const { h } = m;
  const mid = top + h / 2;
  const [one, two] = m.lines.map((dy) => mid + dy);
  const ink = r.past ? pal.soft : pal.ink;
  const cut = [];

  // The paper's own colour as a thin bar: decoration, never text.
  if (r.color && !card.dry) {
    ctx.save();
    ctx.globalAlpha = r.past ? 0.4 : 1;
    ctx.fillStyle = r.color;
    roundRect(ctx, left, top + Math.min(14, h * 0.2), 5, h - 2 * Math.min(14, h * 0.2), 2.5);
    ctx.fill();
    ctx.restore();
  }

  if (showDate) {
    // Day numerals right-aligned, so 1 and 30 end on one edge.
    const dayRight = left + 98;
    card.text(String(r.day), dayRight, mid + m.numeral * 0.35, { weight: 800, size: m.numeral, family: FAMILY.numeral, color: ink, align: 'right' }, 'row');
    card.text(r.weekday, dayRight + 14, mid + m.date[0], { weight: 600, size: MIN.thai, color: ink }, 'row');
    card.text(r.month, dayRight + 14, mid + m.date[1], { weight: 500, size: MIN.thai, color: pal.soft }, 'row');
  }

  const d = Math.min(86, h - 20);
  vignette(card, img, r.cover, VIGNETTE_X + d / 2, mid, d, r.past);

  // The right column first; the course text takes what it leaves on each line.
  const timeStyle = { weight: 600, size: m.time, family: FAMILY.numeral, color: ink };
  const subStyle = { weight: 500, size: MIN.thai, color: pal.soft };
  const codeStyle = { ...subStyle, weight: 600 };
  const timeBox = textRight(card, r.time, right, one, timeStyle, 'row');
  const tag = r.past ? 'สอบแล้ว' : r.session;
  const tagLeft = tag
    ? pill(card, tag, timeBox.left - 12, one, r.past
      ? { color: pal.soft, fill: pal.faint, padY: m.pad }
      : { color: r.session === 'เช้า' ? pal.sage : pal.gold, fill: pal.faint, padY: m.pad })
    : timeBox.left;

  const x = VIGNETTE_X + d + 26;
  // The room line leaves the code and the start of the English name their
  // width. Past that it drops the duration when the time already says it
  // (13:00–16:00 is three hours), then is cut, and a cut room is a finding.
  const codeW = r.code ? widthOf(card, r.code, codeStyle) : 0;
  const enW = r.nameEn ? widthOf(card, r.nameEn, subStyle) : 0;
  const keep = Math.min(LINE_TWO_MIN, codeW + (r.code && r.nameEn ? 14 : 0) + enW);
  const room = roomLine(card, r, right - x - 28 - keep, subStyle, { compact: m.compact });
  if (room.cut) cut.push(`the room "${r.room}" is cut to fit its line`);
  const subLeft = room.text ? textRight(card, room.text, right, two, subStyle, 'row').left : right;

  const nameWidth = tagLeft - 28 - x;
  const size = card.fit(r.name, nameWidth, { weight: 600, family: FAMILY.serif, max: m.name, min: MIN.thai });
  const name = line(card, r.name, x, one, nameWidth, { weight: 600, size, family: FAMILY.serif, color: ink, embolden: bold(size, 600, r.name) });
  if (name.cut) cut.push(`the name "${r.name}" is cut to fit its line`);
  // The course code first, so a long English name is what gets cut.
  const width = subLeft - 28 - x;
  const code = r.code ? line(card, r.code, x, two, width, codeStyle) : null;
  const ex = code ? code.right + 14 : x;
  if (r.nameEn && x + width - ex > 0) line(card, r.nameEn, ex, two, x + width - ex, subStyle);
  return cut;
}

/**
 * The room and duration as one line no wider than `width`: whole when it
 * fits; else the room alone when the time gives the duration, which compact
 * rows always do; else the room cut with an ellipsis (`cut`).
 */
function roomLine(card, r, width, style, { compact }) {
  const ranged = /\d–\d/.test(r.time);
  const full = [r.room, r.duration].filter(Boolean).join(', ');
  const tries = compact && ranged ? [r.room] : ranged ? [full, r.room] : [full];
  card.style(style);
  for (const t of tries) if (card.measure(t) <= width) return { text: t, cut: false };
  const last = tries.at(-1);
  if (width <= 0) return { text: '', cut: Boolean(last) };
  const [first = ''] = wrapLines(card.measure, last, width, { maxLines: 1 });
  return { text: first, cut: ellipsized(first, last) };
}

const ellipsized = (shown, whole) => shown.endsWith('…') && !String(whole).trimEnd().endsWith('…');

/** One line at a baseline, cut with an ellipsis where it would pass `width`. */
function line(card, str, x, baseline, width, style) {
  card.style(style);
  const [first = ''] = wrapLines(card.measure, String(str), width, { maxLines: 1 });
  return { ...card.textInk(first, x, baseline, style, 'row'), cut: ellipsized(first, str) };
}

/**
 * The title block: the kicker, the title and the range left, the issue
 * stamp right, then a double rule. Returns where the body starts. With
 * `draw: false` it only measures, at the same sizes and gaps, so the page can
 * pick its title before anything is drawn.
 */
function head(card, table, { compact, bold, draw }) {
  const { ctx, pal } = card;
  const { left, right } = A4.live;
  const s = compact ? HEAD.compact : HEAD.regular;
  const set = (str, top, width, style, opts = {}) => {
    if (draw) return card.para(str, left, top, width, style, { maxLines: 1, balance: false, ...opts }).lineBottom;
    card.style(style);
    const { ascent, descent } = inkMetrics(ctx);
    return top + ascent + descent;
  };
  const kicker = set(table.kicker, s.top, 640, { weight: 600, size: 26, color: pal.sage });
  const titleSize = card.fit(table.title, 680, { weight: 700, family: FAMILY.serif, max: s.title, min: s.titleMin });
  const title = set(table.title, kicker + 12, 680, { weight: 700, size: titleSize, family: FAMILY.serif, embolden: bold(titleSize, 700, table.title) }, { leading: 1.2 });
  const subtitle = set(`${table.range}, ${table.subjects} วิชา`, title + 16, 680, { weight: 500, size: 28, color: pal.soft });

  const stamp = { w: 236, h: 120, top: s.top + 4 };
  if (draw) {
    const sx = right - stamp.w;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, sx, stamp.top, stamp.w, stamp.h, 10);
    ctx.stroke();
    card.text('ฉบับวันที่', sx + stamp.w / 2, stamp.top + 44, { weight: 500, size: MIN.thai, color: pal.soft, align: 'center' }, 'stamp');
    card.text(table.issued, sx + stamp.w / 2, stamp.top + 92, { weight: 600, size: 32, family: FAMILY.serif, align: 'center' }, 'stamp');
  }

  const y = Math.max(subtitle, stamp.top + stamp.h) + s.before;
  if (draw) {
    rule(card, y, { color: pal.ink, width: 3 });
    rule(card, y + 7, { color: pal.ink, width: 1 });
  }
  return y + 7 + s.after;
}

/**
 * Draw the page. Resolves to the card and the layout check's findings
 * (empty when every text sits inside the page and clear of its neighbours).
 */
export async function drawTimetable(table, { scale = SCALE } = {}) {
  const art = await Promise.all(table.rows.map((r) => picture(r.cover?.src)));
  const card = createCard('light', 11, A4, { scale });
  const faux = !paintsSerifWeight();
  const bold = (size, weight, str) => (faux && THAI.test(String(str)) ? size * (weight >= 700 ? 0.04 : 0.028) : 0);
  const { ctx, pal } = card;
  const { left, right } = A4.live;

  // One unit past the page on both edges: at 1.25x the page is 2192.5 device
  // pixels tall on a canvas of 2193, and the unpainted half row printed as a
  // grey line along the bottom.
  ctx.fillStyle = pal.print || pal.bg;
  ctx.fillRect(0, 0, A4.w + 1, A4.h + 1);
  // A hairline frame inside the printer's margin.
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(FRAME, FRAME, A4.w - 2 * FRAME, A4.h - 2 * FRAME);

  // Masthead: the mark and name left, the semester right.
  logoMark(card, left, 62, 38);
  card.text('VetMock', left + 50, 92, { weight: 600, size: 28, family: FAMILY.numeral }, 'masthead');
  textRight(card, table.semester, right, 92, { weight: 500, size: 24, color: pal.soft }, 'masthead');
  rule(card, 116);

  // The title block is measured both ways first: the page is set compact
  // only when the regular rows would not fit under the regular title.
  const n = table.rows.length;
  const weeks = table.weeks.length;
  const plan = rowMetrics({
    top: { regular: head(card, table, { compact: false, bold, draw: false }), compact: head(card, table, { compact: true, bold, draw: false }) },
    rows: n, weeks,
  });
  let y = head(card, table, { compact: plan.compact, bold, draw: true });
  // The rows share what is left above the notes, from where the title ended.
  const m = rowMetrics({ top: y, rows: n, weeks, mode: plan.compact ? 'compact' : 'regular' });
  const cut = [];

  let i = 0;
  for (const [w, week] of table.weeks.entries()) {
    if (weeks > 1) {
      if (w > 0) y += m.weekGap;
      const wk = m.week;
      const label = card.text(week.label, left, y + wk.base, { weight: 700, size: wk.size, family: FAMILY.serif, color: pal.sage, embolden: bold(wk.size, 700, week.label) }, 'week');
      const range = card.text(week.range, label.right + 16, y + wk.base, { weight: 500, size: wk.range, color: pal.soft }, 'week');
      rule(card, y + wk.rule, { from: range.right + 18, to: right });
      y += m.weekH;
    }
    week.rows.forEach((r, k) => {
      const showDate = k === 0 || week.rows[k - 1].date !== r.date;
      cut.push(...drawRow(card, r, art[i], y, m, { showDate, bold }));
      const next = week.rows[k + 1];
      if (next) {
        // Two papers on one day share the date: a shorter rule between them.
        rule(card, y + m.h, { from: next.date === r.date ? VIGNETTE_X : left + 20, to: right, width: 1 });
      }
      y += m.h;
      i += 1;
    });
  }
  // Rows that pass the body run under the notes' rule, where no text box
  // records them: the check says so itself.
  if (y > BODY_BOTTOM) cut.push(`the rows end at ${Math.round(y)}, past the body's end at ${BODY_BOTTOM}`);

  // Notes, then the signature, inside the frame.
  rule(card, NOTES_TOP, { color: pal.ink, width: 1 });
  const notes = ['เวลาและห้องสอบอาจเปลี่ยนตามประกาศของคณะ ตรวจสอบอีกครั้งก่อนวันสอบ'];
  if (table.edition) notes.push(`ตาม${table.edition}`);
  if (table.source) notes.push(`ช่วงสอบ${table.source}`);
  let ny = NOTES_TOP + 16;
  for (const [k, note] of notes.entries()) {
    const p = card.para(note, left, ny, right - left, { weight: k === 0 ? 600 : 500, size: MIN.thai, color: k === 0 ? pal.ink : pal.soft }, { maxLines: 2, balance: false, role: 'note' });
    ny = p.lineBottom + 8;
  }
  logoMark(card, left, SIGN_BASELINE - 26, 30);
  card.text('VetMock', left + 42, SIGN_BASELINE, { weight: 600, size: 24, family: FAMILY.numeral }, 'footer');
  textRight(card, 'vetmock.com/app/schedule', right, SIGN_BASELINE, { weight: 500, size: MIN.thai, color: pal.soft }, 'footer');

  const problems = [...layoutProblems(card.boxes, { minThai: MIN.thai, minLatin: MIN.latin, frame: A4 }), ...cut];
  return { card, problems };
}

/** The page as a one-page A4 PDF: the JPEG fills the sheet. */
export async function timetablePdf(jpeg, { title } = {}) {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(jpeg);
  const page = doc.addPage([POINTS.w, POINTS.h]);
  page.drawImage(image, { x: 0, y: 0, width: POINTS.w, height: POINTS.h });
  if (title) doc.setTitle(title);
  doc.setAuthor('VetMock');
  doc.setCreator('vetmock.com');
  doc.setProducer('VetMock');
  return doc.save();
}
