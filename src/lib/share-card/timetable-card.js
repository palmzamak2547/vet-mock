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
import { wrapLines } from '../canvas-wrap.js';

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
const BODY_BOTTOM = 1466;
const NOTES_TOP = 1486;
const SIGN_BASELINE = 1668;
const WEEK_H = 58;
const WEEK_GAP = 14;
const VIGNETTE_X = 300;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const THAI = /[฀-๿]/u;

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
function pill(card, str, right, baseline, { color, fill }) {
  const style = { weight: 600, size: MIN.thai, color };
  card.style(style);
  const m = card.ctx.measureText(str);
  const pad = 12;
  const w = card.measure(str) + pad * 2;
  const up = (m.actualBoundingBoxAscent ?? 18) + 8;
  const down = (m.actualBoundingBoxDescent ?? 6) + 8;
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

function drawRow(card, r, img, top, h, f, { showDate }) {
  const { ctx, pal } = card;
  const { left, right } = A4.live;
  const mid = top + h / 2;
  const ink = r.past ? pal.soft : pal.ink;

  // The paper's own colour as a thin bar: decoration, never text.
  if (r.color && !card.dry) {
    ctx.save();
    ctx.globalAlpha = r.past ? 0.4 : 1;
    ctx.fillStyle = r.color;
    roundRect(ctx, left, top + 14, 5, h - 28, 2.5);
    ctx.fill();
    ctx.restore();
  }

  if (showDate) {
    // Day numerals right-aligned, so 1 and 30 end on one edge.
    const dayRight = left + 98;
    card.text(String(r.day), dayRight, mid + f.numeral * 0.35, { weight: 800, size: f.numeral, family: FAMILY.numeral, color: ink, align: 'right' }, 'row');
    card.text(r.weekday, dayRight + 14, mid - 5, { weight: 600, size: MIN.thai, color: ink }, 'row');
    card.text(r.month, dayRight + 14, mid + 25, { weight: 500, size: MIN.thai, color: pal.soft }, 'row');
  }

  const d = Math.min(86, h - 20);
  vignette(card, img, r.cover, VIGNETTE_X + d / 2, mid, d, r.past);

  // The right column first: the course text takes what it leaves.
  const timeStyle = { weight: 600, size: f.time, family: FAMILY.numeral, color: ink };
  const subStyle = { weight: 500, size: MIN.thai, color: pal.soft };
  const sub = [r.room, r.duration].filter(Boolean).join(', ');
  const timeBox = textRight(card, r.time, right, mid - 5, timeStyle, 'row');
  const tag = r.past ? 'สอบแล้ว' : r.session;
  const tagLeft = tag
    ? pill(card, tag, timeBox.left - 12, mid - 5, r.past
      ? { color: pal.soft, fill: pal.faint }
      : { color: r.session === 'เช้า' ? pal.sage : pal.gold, fill: pal.faint })
    : timeBox.left;
  const subBox = textRight(card, sub, right, mid + 27, subStyle, 'row');
  const column = Math.min(tagLeft, subBox.left);

  const x = VIGNETTE_X + d + 26;
  const width = column - 28 - x;
  const size = card.fit(r.name, width, { weight: 600, family: FAMILY.serif, max: f.name, min: MIN.thai });
  line(card, r.name, x, mid - 5, width, { weight: 600, size, family: FAMILY.serif, color: ink, embolden: f.bold(size, 600, r.name) });
  // The course code first, so a long English name is what gets cut.
  const code = r.code ? line(card, r.code, x, mid + 27, width, { ...subStyle, weight: 600 }) : null;
  const ex = code ? code.right + 14 : x;
  if (r.nameEn) line(card, r.nameEn, ex, mid + 27, x + width - ex, subStyle);
}

/** One line at a baseline, cut with an ellipsis where it would pass `width`. */
function line(card, str, x, baseline, width, style) {
  card.style(style);
  const [first = ''] = wrapLines(card.measure, String(str), width, { maxLines: 1 });
  return card.textInk(first, x, baseline, style, 'row');
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

  ctx.fillStyle = pal.print || pal.bg;
  ctx.fillRect(0, 0, A4.w, A4.h);
  // A hairline frame inside the printer's margin.
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(FRAME, FRAME, A4.w - 2 * FRAME, A4.h - 2 * FRAME);

  // Masthead: the mark and name left, the semester right.
  logoMark(card, left, 62, 38);
  card.text('VetMock', left + 50, 92, { weight: 600, size: 28, family: FAMILY.numeral }, 'masthead');
  textRight(card, table.semester, right, 92, { weight: 500, size: 24, color: pal.soft }, 'masthead');
  rule(card, 116);

  // Title block, with the issue date stamped on the right.
  const kicker = card.para(table.kicker, left, 150, 640, { weight: 600, size: 26, color: pal.sage }, { maxLines: 1, balance: false });
  const titleSize = card.fit(table.title, 680, { weight: 700, family: FAMILY.serif, max: 96, min: 64 });
  const title = card.para(table.title, left, kicker.lineBottom + 12, 680, { weight: 700, size: titleSize, family: FAMILY.serif, embolden: bold(titleSize, 700, table.title) }, { maxLines: 1, balance: false, leading: 1.2 });
  const subtitle = card.para(`${table.range}, ${table.subjects} วิชา`, left, title.lineBottom + 16, 680, { weight: 500, size: 28, color: pal.soft }, { maxLines: 1, balance: false });

  const stamp = { w: 236, h: 120, top: 154 };
  const sx = right - stamp.w;
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 1.5;
  roundRect(ctx, sx, stamp.top, stamp.w, stamp.h, 10);
  ctx.stroke();
  card.text('ฉบับวันที่', sx + stamp.w / 2, stamp.top + 44, { weight: 500, size: MIN.thai, color: pal.soft, align: 'center' }, 'stamp');
  card.text(table.issued, sx + stamp.w / 2, stamp.top + 92, { weight: 600, size: 32, family: FAMILY.serif, align: 'center' }, 'stamp');

  let y = Math.max(subtitle.lineBottom, stamp.top + stamp.h) + 30;
  rule(card, y, { color: pal.ink, width: 3 });
  rule(card, y + 7, { color: pal.ink, width: 1 });
  y += 7 + 22;

  // Rows share what is left above the notes.
  const showWeeks = table.weeks.length > 1;
  const n = table.rows.length;
  const headers = showWeeks ? table.weeks.length * WEEK_H + (table.weeks.length - 1) * WEEK_GAP : 0;
  const h = clamp(Math.floor((BODY_BOTTOM - y - headers) / n), 66, 118);
  const f = {
    numeral: clamp(Math.round(h * 0.54), 40, 62),
    name: clamp(Math.round(h * 0.31), 25, 34),
    time: clamp(Math.round(h * 0.29), 24, 31),
    bold,
  };

  let i = 0;
  for (const [w, week] of table.weeks.entries()) {
    if (showWeeks) {
      if (w > 0) y += WEEK_GAP;
      const label = card.text(week.label, left, y + 36, { weight: 700, size: 26, family: FAMILY.serif, color: pal.sage, embolden: bold(26, 700, week.label) }, 'week');
      const range = card.text(week.range, label.right + 16, y + 36, { weight: 500, size: 24, color: pal.soft }, 'week');
      rule(card, y + 28, { from: range.right + 18, to: right });
      y += WEEK_H;
    }
    week.rows.forEach((r, k) => {
      const showDate = k === 0 || week.rows[k - 1].date !== r.date;
      drawRow(card, r, art[i], y, h, f, { showDate });
      const next = week.rows[k + 1];
      if (next) {
        // Two papers on one day share the date: a shorter rule between them.
        rule(card, y + h, { from: next.date === r.date ? VIGNETTE_X : left + 20, to: right, width: 1 });
      }
      y += h;
      i += 1;
    });
  }

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

  const problems = layoutProblems(card.boxes, { minThai: MIN.thai, minLatin: MIN.latin, frame: A4 });
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
