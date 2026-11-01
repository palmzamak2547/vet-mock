// ============================================================
// course-doc-card.js: a course's syllabus and teaching timetable as A4 pages
// ============================================================
// The two pages lib/course-docs.js models, drawn as the exam timetable is
// (timetable-card.js): the same page, masthead, title block, stamp and
// signature, the kit's type and ink, every text recorded for the layout
// check. A page tries its settings from roomiest to tightest as dry runs and
// draws the first whose body ends above the notes with nothing cut. The
// teaching timetable that fits no single page continues on a second one,
// split after the midterm. When nothing fits, the tightest is drawn and the
// check reports what was cut (data-layout in the sheet, read by the e2e).
//
// Colour marks the paper a session sits on: gold for the midterm and sage
// for the final, as the timetable page labels them.
// ============================================================

import { createCard, rule, logoMark, layoutProblems, FAMILY } from './kit.js';
import { wrapLines, inkMetrics } from '../canvas-wrap.js';
import { A4, SCALE, textRight, roundRect } from './timetable-card.js';

const MIN = { thai: 22, latin: 20 };
const FRAME = 40;
const SIGN_BASELINE = 1668;
const STAMP = { w: 236, h: 120, top: 154 };
const NOTE = { size: MIN.thai, leading: 1.32, gap: 8, lines: 4 };
const BAR_W = 22;
// Teaching rows: the paper's bar, the date, the session, its lecturers.
const COL = { date: A4.live.left + BAR_W, title: A4.live.left + 172, who: A4.live.right - 300 };
// Two pages drawn at 2x and stacked for the picture would pass what an iPhone
// allows one canvas; 1.5x still prints at 225 dpi.
const MULTI_PAGE_SCALE = 1.5;

const barColor = (pal, paper) => (paper === 'midterm' ? pal.goldField : paper === 'final' ? pal.sageField : pal.rule);
const inkColor = (pal, paper) => (paper === 'midterm' ? pal.gold : paper === 'final' ? pal.sage : pal.soft);

function bar(card, x, top, h, paper) {
  if (card.dry || h <= 0) return;
  card.ctx.fillStyle = barColor(card.pal, paper);
  roundRect(card.ctx, x, top, 6, h, 3);
  card.ctx.fill();
}

/** Paper, frame and masthead, as the exam timetable prints them. */
function page(card, doc) {
  const { ctx, pal } = card;
  const { left, right } = A4.live;
  if (!card.dry) {
    ctx.fillStyle = pal.print || pal.bg;
    ctx.fillRect(0, 0, A4.w + 1, A4.h + 1);
    ctx.strokeStyle = pal.rule;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(FRAME, FRAME, A4.w - 2 * FRAME, A4.h - 2 * FRAME);
  }
  logoMark(card, left, 62, 38);
  card.text('VetMock', left + 50, 92, { weight: 600, size: 28, family: FAMILY.numeral }, 'masthead');
  textRight(card, doc.semester, right, 92, { weight: 500, size: 24, color: pal.soft }, 'masthead');
  rule(card, 116);
}

/**
 * Kicker, course name (two lines when long), code line, issue stamp, double
 * rule. Returns where the body starts. The teaching timetable sets the name
 * smaller: its rows need the room more than its title does.
 */
function head(card, doc) {
  const { ctx, pal } = card;
  const { left, right } = A4.live;
  const width = right - left - STAMP.w - 28;
  const kicker = card.para(doc.kicker, left, 150, width, { weight: 600, size: 26, color: pal.sage }, { maxLines: 1, balance: false }).lineBottom;
  const serif = { weight: 700, family: FAMILY.serif };
  const [max, min] = doc.kind === 'teaching' ? [60, 44] : [76, 56];
  const size = card.fit(doc.title, width, { ...serif, max, min });
  const title = card.para(doc.title, left, kicker + 12, width, { ...serif, size }, { maxLines: 2, leading: 1.2 });
  // Below the stamp the code line has the page's whole width.
  const subTop = title.lineBottom + 14;
  const sub = card.para(doc.subtitle, left, subTop, subTop > STAMP.top + STAMP.h + 8 ? right - left : width, { weight: 500, size: 26, color: pal.soft }, { maxLines: 2, balance: false });
  const sx = right - STAMP.w;
  if (!card.dry) {
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, sx, STAMP.top, STAMP.w, STAMP.h, 10);
    ctx.stroke();
  }
  card.text('ฉบับวันที่', sx + STAMP.w / 2, STAMP.top + 44, { weight: 500, size: MIN.thai, color: pal.soft, align: 'center' }, 'stamp');
  card.text(doc.issued, sx + STAMP.w / 2, STAMP.top + 92, { weight: 600, size: 32, family: FAMILY.serif, align: 'center' }, 'stamp');
  const y = Math.max(sub.lineBottom, STAMP.top + STAMP.h) + 24;
  rule(card, y, { color: pal.ink, width: 3 });
  rule(card, y + 7, { color: pal.ink, width: 1 });
  return { y: y + 7 + 22, cut: title.cut || sub.cut };
}

/** Where the notes start so the last one ends above the signature. */
function notesTop(card, notes) {
  const { left, right } = A4.live;
  card.style({ weight: 500, size: NOTE.size });
  const { ascent, descent } = inkMetrics(card.ctx);
  const step = Math.max(NOTE.size * NOTE.leading, ascent + descent + NOTE.size * 0.08);
  let h = 0;
  for (const n of notes) {
    const lines = wrapLines(card.measure, n, right - left, { maxLines: NOTE.lines });
    h += ascent + (lines.length - 1) * step + descent + NOTE.gap;
  }
  return SIGN_BASELINE - 54 - h;
}

/** The notes from `top`, the first in ink, then the signature. */
function foot(card, notes, top) {
  const { pal } = card;
  const { left, right } = A4.live;
  rule(card, top - 16, { color: pal.ink, width: 1 });
  let y = top;
  const cut = [];
  for (const [k, n] of notes.entries()) {
    const p = card.para(n, left, y, right - left, { weight: k === 0 ? 600 : 500, size: NOTE.size, color: k === 0 ? pal.ink : pal.soft }, { maxLines: NOTE.lines, balance: false, role: 'note' });
    if (p.cut) cut.push(`the note "${n}" is cut`);
    y = p.lineBottom + NOTE.gap;
  }
  logoMark(card, left, SIGN_BASELINE - 26, 30);
  card.text('VetMock', left + 42, SIGN_BASELINE, { weight: 600, size: 24, family: FAMILY.numeral }, 'footer');
  textRight(card, 'vetmock.com/app/schedule', right, SIGN_BASELINE, { weight: 500, size: MIN.thai, color: pal.soft }, 'footer');
  return cut;
}

/** One page with one setting: dry, or drawn. `body(card, y, opts)` returns { end, cut }. */
function attempt(doc, notes, body, opts, { dry, scale }) {
  const card = createCard('light', 11, A4, { dry, scale });
  page(card, doc);
  const top = head(card, doc);
  const limit = notesTop(card, notes) - 34;
  const b = body(card, top.y, opts);
  const cut = [...(top.cut ? ['the title is cut'] : []), ...b.cut, ...foot(card, notes, limit + 34)];
  if (b.end > limit) cut.push(`the body ends at ${Math.round(b.end)}, past ${Math.round(limit)}`);
  return { card, cut, slack: Math.round(limit - b.end) };
}

/** The index of the first setting a page fits with, or -1. */
const fitting = (doc, notes, body, settings) => settings.findIndex((o) => attempt(doc, notes, body, o, { dry: true }).cut.length === 0);

/** Draw a page in full: { card, problems, slack }, slack the room left above the notes. */
function render(doc, notes, body, opts, scale) {
  const { card, cut, slack } = attempt(doc, notes, body, opts, { dry: false, scale });
  return { card, slack, problems: [...layoutProblems(card.boxes, { minThai: MIN.thai, minLatin: MIN.latin, frame: A4 }), ...cut] };
}

/** A paragraph that reports itself when cut. */
function para(card, cut, str, x, top, width, style, opts) {
  const p = card.para(str, x, top, width, style, { balance: false, ...opts });
  if (p.cut) cut.push(`"${str}" is cut`);
  return p;
}

/**
 * A list of names, ", " between them, packed into lines that never break
 * inside a name: the word dictionary splits a surname ("ภักดีพาณิชย์ / กิจ").
 * A name wider than `width` is a finding. Returns { lineBottom, ascent }.
 */
function nameLines(card, list, width, style) {
  card.style(style);
  const lines = [];
  for (const n of list.split(', ')) {
    const last = lines.at(-1);
    if (last !== undefined && card.measure(`${last}, ${n}`) <= width) lines[lines.length - 1] = `${last}, ${n}`;
    else lines.push(n);
  }
  return lines;
}

function names(card, cut, list, x, top, width, style, role = 'names') {
  const lines = nameLines(card, list, width, style);
  for (const n of list.split(', ')) if (card.measure(n) > width + 1) cut.push(`the name "${n}" is wider than its column`);
  const { ascent, descent } = inkMetrics(card.ctx);
  const size = style.size;
  const step = Math.max(size * 1.32, ascent + descent + size * 0.08);
  lines.forEach((l, i) => card.textInk(l, x, top + ascent + i * step, style, role));
  return { lineBottom: top + ascent + (lines.length - 1) * step + descent, ascent, lines: lines.length };
}

/** The widest single name in the lists, as `style` sets it. */
function widestName(card, lists, style) {
  card.style(style);
  return Math.max(0, ...lists.flatMap((l) => l.split(', ')).map((n) => card.measure(n)));
}

// ── The syllabus ─────────────────────────────────────────────

const SYLLABUS_SETTINGS = [
  { size: 24, head: 32, gap: 28, row: 12 },
  { size: 22, head: 30, gap: 22, row: 10 },
  { size: 22, head: 28, gap: 16, row: 7 },
  { size: 22, head: 28, gap: 10, row: 4 },
  { size: 22, head: 26, gap: 6, row: 2 },
  { size: 22, head: 24, gap: 4, row: 1 },
];

function syllabusBody(card, doc, y, o) {
  const { pal } = card;
  const { left, right } = A4.live;
  const cut = [];
  // A label column as wide as the widest label.
  card.style({ weight: 600, size: o.size });
  const labelW = Math.max(...[...doc.facts.map((f) => f.label), 'สัดส่วนคะแนน'].map((l) => card.measure(l))) + 24;
  for (const f of doc.facts) {
    card.para(f.label, left, y, labelW, { weight: 600, size: o.size, color: pal.sage }, { maxLines: 1, balance: false, role: 'fact' });
    const style = { weight: 500, size: o.size };
    y = (f.names ? names(card, cut, f.text, left + labelW, y, right - left - labelW, style)
      : para(card, cut, f.text, left + labelW, y, right - left - labelW, style, { maxLines: 3 })).lineBottom + o.row;
  }

  for (const paper of doc.papers) {
    y += o.gap;
    const top = y;
    const h = card.text(paper.heading, left + BAR_W, y + o.head, { weight: 600, size: o.head, family: FAMILY.serif, color: inkColor(pal, paper.term) }, 'paper');
    if (paper.when) {
      const size = card.fit(paper.when, right - h.right - 30, { weight: 600, family: FAMILY.label, max: o.size, min: MIN.thai });
      textRight(card, paper.when, right, y + o.head, { weight: 600, size, color: pal.ink }, 'paper');
    }
    y += o.head + 12;
    if (paper.covers) y = para(card, cut, paper.covers, left + BAR_W, y, right - left - BAR_W, { weight: 500, size: MIN.thai, color: pal.soft }, { maxLines: 2 }).lineBottom + o.row;
    // Who taught what for this paper: the lecturers left, in a column as wide
    // as the longest name, their sessions right; a team whose names would
    // stack past two lines heads its row instead.
    const whoStyle = { weight: 600, size: MIN.thai, color: inkColor(pal, paper.term) };
    const whoW = Math.min(340, Math.ceil(widestName(card, paper.groups.map((g) => g.who), whoStyle))) + 20;
    for (const g of paper.groups) {
      const full = right - left - BAR_W;
      const tall = nameLines(card, g.who, whoW - 20, whoStyle).length > 2;
      const who = names(card, cut, g.who, left + BAR_W, y, tall ? full : whoW - 20, whoStyle);
      const x = left + BAR_W + (tall ? 0 : whoW);
      const what = para(card, cut, g.text, x, tall ? who.lineBottom + 4 : y, right - x, { weight: 500, size: o.size }, { maxLines: 6 });
      y = Math.max(who.lineBottom, what.lineBottom) + o.row;
    }
    bar(card, left, top + 4, y - top - 4 - o.row, paper.term);
  }
  if (doc.noPaper) {
    y += o.gap;
    y = para(card, cut, doc.noPaper, left, y, right - left, { weight: 600, size: o.size }, { maxLines: 2 }).lineBottom;
  }

  // The score split as one more row of the facts' table: each part, its share,
  // and the lecturers' shares within it where the syllabus gives them.
  y += o.gap;
  card.para('สัดส่วนคะแนน', left, y, labelW, { weight: 600, size: o.size, color: pal.sage }, { maxLines: 1, balance: false, role: 'fact' });
  const lines = doc.assessment
    ? doc.assessment.map((a) => `${a.label} ${a.pct}%${a.parts ? ` (${a.parts})` : ''}`)
    : ['ประมวลรายวิชาไม่ได้ระบุสัดส่วนคะแนน'];
  for (const l of lines) {
    y = para(card, cut, l, left + labelW, y, right - left - labelW, { weight: 500, size: o.size, color: doc.assessment ? pal.ink : pal.soft }, { maxLines: 3 }).lineBottom + 4 + o.row;
  }
  return { end: y, cut };
}

/** Draw the syllabus page: { card, problems, slack, setting } (the setting's index; the last when none fits). */
export async function drawSyllabus(doc, { scale = SCALE } = {}) {
  const notes = [...doc.notes, doc.source];
  const body = (card, y, o) => syllabusBody(card, doc, y, o);
  const i = fitting(doc, notes, body, SYLLABUS_SETTINGS);
  const setting = i < 0 ? SYLLABUS_SETTINGS.length - 1 : i;
  return { ...render(doc, notes, body, SYLLABUS_SETTINGS[setting], scale), setting };
}

// ── The teaching timetable ───────────────────────────────────

const TEACHING_SETTINGS = [
  { size: 24, en: true, pad: 12 },
  { size: 22, en: true, pad: 10 },
  { size: 22, en: false, pad: 10 },
  { size: 22, en: false, pad: 7 },
  { size: 22, en: false, pad: 5 },
];

/** The weekly slot, what each bar colour means (on the slot's line when it fits), then the column heads. */
function legend(card, doc, y, cut) {
  const { pal } = card;
  const { left, right } = A4.live;
  const style = { weight: 600, size: MIN.thai };
  const labels = doc.legend.map((t) => [t, t === 'midterm' ? 'เนื้อหาสอบกลางภาค' : 'เนื้อหาสอบปลายภาค']);
  card.style(style);
  const keyW = labels.reduce((w, [, l]) => w + 16 + card.measure(l) + 32, 0);
  const slot = para(card, cut, doc.slot, left, y, right - left, style, { maxLines: 2 });
  const inline = slot.lines.length === 1 && card.measure(slot.lines[0]) + 40 + keyW <= right - left;
  let x = inline ? right - keyW + 32 : left;
  let ky = inline ? y : slot.lineBottom + 10;
  for (const [term, label] of labels) {
    bar(card, x, ky + 1, 26, term);
    x = card.text(label, x + 16, ky + slot.ascent, { ...style, color: inkColor(pal, term) }, 'legend').right + 32;
  }
  y = (labels.length && !inline ? ky + MIN.thai + 8 : slot.lineBottom) + 8;
  if (doc.staff) y = names(card, cut, doc.staff, left, y, right - left, { weight: 500, size: MIN.thai, color: pal.soft }).lineBottom + 8;
  y += 6;
  const headStyle = { weight: 600, size: MIN.thai, color: pal.soft };
  card.text('วันที่', COL.date, y + MIN.thai, headStyle, 'colhead');
  card.text('หัวข้อ', COL.title, y + MIN.thai, headStyle, 'colhead');
  card.text('ผู้สอน', COL.who, y + MIN.thai, headStyle, 'colhead');
  y += MIN.thai + 14;
  rule(card, y, { from: left + BAR_W, to: right, color: pal.ink, width: 1.5 });
  return y;
}

function teachingBody(card, doc, rows, y, o) {
  const { pal } = card;
  const { right } = A4.live;
  const cut = [];
  y = legend(card, doc, y, cut);
  const titleW = COL.who - 24 - COL.title;
  const whoW = right - COL.who;
  for (const [i, r] of rows.entries()) {
    const top = y;
    if (i > 0) rule(card, top, { from: COL.date, to: right, width: 1 });
    const y0 = top + o.pad;
    // A row that examines nothing reads quieter, where the course has papers at all.
    const quiet = r.kind === 'holiday' || r.kind === 'activity' || (doc.legend.length > 0 && r.paper === null && r.kind !== 'exam');
    const ink = quiet ? pal.soft : pal.ink;
    let t;
    if (r.kind === 'exam') {
      t = para(card, cut, r.title, COL.title, y0, titleW, { weight: 700, size: o.size, family: FAMILY.serif, color: inkColor(pal, r.paper) }, { maxLines: 2 }).lineBottom;
    } else {
      t = para(card, cut, r.title, COL.title, y0, titleW, { weight: r.kind === 'holiday' ? 500 : 600, size: o.size, color: ink }, { maxLines: 4 }).lineBottom;
      if (o.en && r.en) t = para(card, cut, r.en, COL.title, t + 4, titleW, { weight: 500, size: MIN.thai, color: pal.soft }, { maxLines: 3 }).lineBottom;
    }
    // The date, and the row's own time under it when it has one.
    let d = para(card, cut, r.when, COL.date, y0, COL.title - COL.date - 12, { weight: 600, size: MIN.thai, color: ink }, { maxLines: 1 }).lineBottom;
    if (r.time && r.kind !== 'exam') d = para(card, cut, r.time, COL.date, d + 4, COL.title - COL.date - 12, { weight: 500, size: MIN.latin + 2, family: FAMILY.numeral, color: pal.soft }, { maxLines: 1 }).lineBottom;
    const w = r.lecturers ? names(card, cut, r.lecturers, COL.who, y0, whoW, { weight: 500, size: MIN.thai, color: r.kind === 'exam' ? pal.ink : pal.soft }).lineBottom : y0;
    y = Math.max(t, d, w);
    // A note and an announced change run under the whole row, title to edge.
    if (r.note) y = para(card, cut, r.note, COL.title, y + 4, right - COL.title, { weight: 500, size: MIN.thai, color: pal.soft }, { maxLines: 2 }).lineBottom;
    if (r.change) y = para(card, cut, r.change, COL.title, y + 4, right - COL.title, { weight: 600, size: MIN.thai, color: pal.rose }, { maxLines: 2 }).lineBottom;
    y += o.pad;
    bar(card, A4.live.left, top + 5, y - top - 10, r.paper);
  }
  return { end: y, cut };
}

/**
 * Two pages: cut after the midterm paper when both halves fit, else after
 * the most rows the first page holds. Each half with its setting index (the
 * last when it fits none).
 */
function twoPages(doc, notes, bodyOf) {
  // The staff the rows call "all of them" are named once, on the first page.
  const half = (rows, k) => ({ rows, doc: { ...doc, kicker: `${doc.kicker}, หน้า ${k + 1} จาก 2`, staff: k ? '' : doc.staff } });
  const tightest = TEACHING_SETTINGS.length - 1;
  // A cut is tried at the tightest setting first, one dry run a page, and
  // only one that fits looks for the roomiest setting both pages take.
  const fitsAtAll = (p) => attempt(p.doc, notes, bodyOf(p.rows), TEACHING_SETTINGS[tightest], { dry: true }).cut.length === 0;
  const n = doc.rows.length;
  const mid = doc.rows.findIndex((r) => r.kind === 'exam' && r.paper === 'midterm') + 1;
  const cuts = [...(mid > 0 && mid < n ? [mid] : []), ...Array.from({ length: n - 1 }, (_, k) => n - 1 - k)];
  for (const at of cuts) {
    const parts = [half(doc.rows.slice(0, at), 0), half(doc.rows.slice(at), 1)];
    if (!fitsAtAll(parts[0]) || !fitsAtAll(parts[1])) continue;
    return { parts, i: Math.max(...parts.map((p) => fitting(p.doc, notes, bodyOf(p.rows), TEACHING_SETTINGS))) };
  }
  const at = mid > 0 && mid < n ? mid : Math.ceil(n / 2);
  return { parts: [half(doc.rows.slice(0, at), 0), half(doc.rows.slice(at), 1)], i: TEACHING_SETTINGS.length - 1 };
}

/** Draw the teaching timetable: { card, cards, problems }, `cards` one page or two. */
export async function drawTeaching(doc, { scale = SCALE } = {}) {
  const notes = [...doc.notes, doc.source];
  const bodyOf = (rows) => (card, y, o) => teachingBody(card, doc, rows, y, o);
  const one = fitting(doc, notes, bodyOf(doc.rows), TEACHING_SETTINGS);
  if (one >= 0) {
    const { card, problems, slack } = render(doc, notes, bodyOf(doc.rows), TEACHING_SETTINGS[one], scale);
    return { card, cards: [card], problems, slack, setting: one };
  }
  // One setting for both pages, so they read as one table.
  const { parts, i } = twoPages(doc, notes, bodyOf);
  const drawn = parts.map((p) => render(p.doc, notes, bodyOf(p.rows), TEACHING_SETTINGS[i], Math.min(scale, MULTI_PAGE_SCALE)));
  return { card: drawn[0].card, cards: drawn.map((x) => x.card), problems: drawn.flatMap((x) => x.problems), slack: Math.min(...drawn.map((x) => x.slack)), setting: i };
}
