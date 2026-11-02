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
// Pages drawn at 2x and stacked for the picture would pass what an iPhone
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
  const kick = card.para(doc.kicker, left, 150, width, { weight: 600, size: 26, color: pal.sage }, { maxLines: 1, balance: false });
  const kicker = kick.lineBottom;
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
  return { y: y + 7 + 22, cut: kick.cut || title.cut || sub.cut };
}

/** Where the notes start so the last one ends above the signature, each measured at the weight foot() sets it. */
function notesTop(card, notes) {
  const { left, right } = A4.live;
  let h = 0;
  for (const [k, n] of notes.entries()) {
    card.style({ weight: k === 0 ? 600 : 500, size: NOTE.size });
    const { ascent, descent } = inkMetrics(card.ctx);
    const step = Math.max(NOTE.size * NOTE.leading, ascent + descent + NOTE.size * 0.08);
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
  try {
    page(card, doc);
    const top = head(card, doc);
    const limit = notesTop(card, notes) - 34;
    const b = body(card, top.y, opts);
    const cut = [...(top.cut ? ['the heading is cut'] : []), ...b.cut, ...foot(card, notes, limit + 34)];
    const over = b.end > limit;
    if (over) cut.push(`the body ends at ${Math.round(b.end)}, past ${Math.round(limit)}`);
    return { card, cut, over, slack: Math.round(limit - b.end) };
  } catch (err) {
    // A page that could not be drawn gives its pixels back now; a phone holds them until collected.
    if (!dry) { card.canvas.width = 0; card.canvas.height = 0; }
    throw err;
  }
}

/** The index of the first setting a page fits with at `scale` (the one it will be drawn at), or -1. */
const fitting = (doc, notes, body, settings, scale) => settings.findIndex((o) => attempt(doc, notes, body, o, { dry: true, scale }).cut.length === 0);

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

/** "เดิม 7 และ 21 ส.ค." broken only before "และ" or after a comma, never inside "21 ส.ค.". */
export function statusLines(card, text, width, style) {
  card.style(style);
  // Pieces that start at "และ" or follow a comma (no lookbehind: older Safari cannot parse one).
  const pieces = text.split(/(?= และ )/).flatMap((part) => part.split(', ').map((p, i, all) => (i < all.length - 1 ? `${p}, ` : p)));
  const lines = [];
  for (const piece of pieces) {
    const last = lines.at(-1);
    // A line keeps its trailing space until the next piece joins it.
    if (last !== undefined && card.measure((last + piece).trimEnd()) <= width) lines[lines.length - 1] = last + piece;
    else lines.push(piece.trimStart());
  }
  return lines.map((l) => l.trimEnd());
}

function names(card, cut, list, x, top, width, style, role = 'names') {
  const lines = nameLines(card, list, width, style);
  for (const n of list.split(', ')) if (card.measure(n) > width + 1) cut.push(`the name "${n}" is wider than its column`);
  return drawLines(card, lines, x, top, style, role);
}

/** Lines at the house leading from `top`, in the style last set: { lineBottom, ascent, lines }. */
function drawLines(card, lines, x, top, style, role) {
  const { ascent, descent } = inkMetrics(card.ctx);
  const step = Math.max(style.size * 1.32, ascent + descent + style.size * 0.08);
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
  // Firefox at 2x set Zoonoses a few pixels past one page with the row above.
  { size: 22, head: 24, gap: 2, row: 0 },
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
  if (doc.score === false) return { end: y, cut };
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

/** Draw the syllabus: { card, cards, problems, slack, setting } (the setting's index; the last when none fits). */
export async function drawSyllabus(doc, { scale = SCALE } = {}) {
  const notes = [...doc.notes, doc.source];
  const bodyOf = (d) => (card, y, o) => syllabusBody(card, d, y, o);
  const last = SYLLABUS_SETTINGS.length - 1;
  const i = fitting(doc, notes, bodyOf(doc), SYLLABUS_SETTINGS, scale);
  if (i >= 0 || !doc.papers.length) {
    const setting = i < 0 ? last : i;
    const page = render(doc, notes, bodyOf(doc), SYLLABUS_SETTINGS[setting], scale);
    return { ...page, cards: [page.card], setting };
  }
  // Thai set wider than one page holds at the tightest setting (another
  // engine's metrics, or the fallback faces): page 1 takes as many lecturer
  // groups as it holds, ending at the first paper when that is in reach.
  const multi = Math.min(scale, MULTI_PAGE_SCALE);
  const groups = doc.papers.reduce((n, p) => n + p.groups.length, 0);
  const holds = (k) => attempt(splitSyllabus(doc, k)[0], notes, bodyOf(splitSyllabus(doc, k)[0]), SYLLABUS_SETTINGS[last], { dry: true, scale: multi }).cut.length === 0;
  let k = 0;
  for (let lo = 0, hi = groups; lo <= hi;) {
    const m = (lo + hi) >> 1;
    if (holds(m)) { k = m; lo = m + 1; } else hi = m - 1;
  }
  k = Math.min(k, doc.papers[0].groups.length);
  const parts = splitSyllabus(doc, k);
  const fit = parts.map((d) => fitting(d, notes, bodyOf(d), SYLLABUS_SETTINGS, multi));
  const j = fit.includes(-1) ? last : Math.max(...fit);
  return renderPages(parts, notes, bodyOf, SYLLABUS_SETTINGS[j], scale, j);
}

/**
 * The syllabus over two pages, cut after its k-th lecturer group counted
 * across the papers: page 1 the facts and those groups, page 2 the rest (a
 * paper cut in two heads its second part "(ต่อ)") and the score split.
 */
function splitSyllabus(doc, k) {
  const first = [];
  const second = [];
  let left = k;
  for (const p of doc.papers) {
    const take = Math.min(left, p.groups.length);
    left -= take;
    if (take) first.push({ ...p, groups: p.groups.slice(0, take) });
    if (take < p.groups.length) second.push(take ? { ...p, heading: `${p.heading} (ต่อ)`, when: '', covers: '', groups: p.groups.slice(take) } : p);
  }
  return [
    { ...doc, kicker: `${doc.kicker}, หน้า 1 จาก 2`, papers: first, score: false },
    { ...doc, kicker: `${doc.kicker}, หน้า 2 จาก 2`, facts: [], papers: second, noPaper: '' },
  ];
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
    // The date; under it how the row is known (moved from the plan, or only
    // the plan), then the row's own time when it has one.
    const dateW = COL.title - COL.date - 12;
    let d = para(card, cut, r.when, COL.date, y0, dateW, { weight: 600, size: MIN.thai, color: ink }, { maxLines: 1 }).lineBottom;
    if (r.status) {
      const st = { weight: 600, size: MIN.thai, color: r.status === 'ตามแผน' ? pal.soft : pal.rose };
      const ls = statusLines(card, r.status, dateW, st);
      for (const l of ls) if (card.measure(l) > dateW + 1) cut.push(`the status "${l}" is wider than its column`);
      d = drawLines(card, ls, COL.date, d + 4, st, 'text').lineBottom;
    }
    // At the smallest Latin size: "09:00–09:30" one size up filled the column
    // to within a few pixels, and an engine whose digits set wider cut it.
    if (r.time && r.kind !== 'exam') d = para(card, cut, r.time, COL.date, d + 4, dateW, { weight: 400, size: MIN.latin, family: FAMILY.numeral, color: pal.soft }, { maxLines: 1 }).lineBottom;
    const w = r.lecturers ? names(card, cut, r.lecturers, COL.who, y0, whoW, { weight: 500, size: MIN.thai, color: r.kind === 'exam' ? pal.ink : pal.soft }).lineBottom : y0;
    // A note and an announced change run under the title and the lecturers,
    // title to edge, beside a date column that may run longer.
    let n = Math.max(t, w);
    if (r.note) n = para(card, cut, r.note, COL.title, n + 4, right - COL.title, { weight: 500, size: MIN.thai, color: pal.soft }, { maxLines: 2 }).lineBottom;
    if (r.change) n = para(card, cut, r.change, COL.title, n + 4, right - COL.title, { weight: 600, size: MIN.thai, color: pal.rose }, { maxLines: 2 }).lineBottom;
    y = Math.max(n, d) + o.pad;
    bar(card, A4.live.left, top + 5, y - top - 10, r.paper);
  }
  return { end: y, cut };
}

/** A page of a longer table: its rows, its number, and the staff named once, on page 1. */
const pageOf = (doc, rows, k, total) => ({ ...doc, rows, kicker: `${doc.kicker}, หน้า ${k + 1} จาก ${total}`, staff: k ? '' : doc.staff });

/**
 * A table longer than a page: as few pages as hold every row, the midterm's
 * rows and the final's each from a fresh page when that costs no page, else
 * each page as full as it goes, at the roomiest setting that keeps the count.
 * Another engine's Thai can run wider than the one this was checked on, so
 * the count is found where the page is drawn, never fixed. { parts, i }.
 */
function paginate(doc, notes, bodyOf, settings, scale) {
  const last = settings.length - 1;
  // The kicker's "หน้า 1 จาก 9" sets as wide as the final count's.
  const trial = (rows, k, o) => {
    const d = pageOf(doc, rows, k, 9);
    return attempt(d, notes, bodyOf(d), o, { dry: true, scale });
  };
  // Page after page from page k0, each taking the most rows it holds (a page
  // that holds m rows holds fewer, so a binary search finds it). `clean`:
  // nothing cut and nothing past the notes; else only nothing past the notes,
  // for a row cut whatever page it is on, which the check then names.
  const fill = (rows, k0, o, clean) => {
    const parts = [];
    for (let at = 0; at < rows.length;) {
      let take = 0;
      for (let lo = 1, hi = rows.length - at; lo <= hi;) {
        const m = (lo + hi) >> 1;
        const t = trial(rows.slice(at, at + m), k0 + parts.length, o);
        if (clean ? t.cut.length === 0 : !t.over) { take = m; lo = m + 1; } else hi = m - 1;
      }
      if (!take) return null;
      parts.push(rows.slice(at, at + take));
      at += take;
    }
    return parts;
  };
  const done = (parts, i) => ({ parts: parts.map((rows, k) => pageOf(doc, rows, k, parts.length)), i });
  const mid = doc.rows.findIndex((r) => r.kind === 'exam' && r.paper === 'midterm') + 1;
  const split = (o, clean) => {
    if (mid <= 0 || mid >= doc.rows.length) return null;
    const a = fill(doc.rows.slice(0, mid), 0, o, clean);
    const b = a && fill(doc.rows.slice(mid), a.length, o, clean);
    return b && [...a, ...b];
  };
  for (const clean of [true, false]) {
    const fewest = fill(doc.rows, 0, settings[last], clean);
    if (!fewest) continue;
    for (const [i, o] of settings.entries()) {
      const parts = split(o, clean);
      if (parts && parts.length === fewest.length) return done(parts, i);
    }
    for (const [i, o] of settings.entries()) {
      const parts = i === last ? fewest : fill(doc.rows, 0, o, clean);
      if (parts && parts.length === fewest.length) return done(parts, i);
    }
  }
  // A row taller than a page: one page, drawn anyway, and the check names it.
  return done([doc.rows], last);
}

/** Draw each page at one setting; a page that cannot be drawn gives back the canvases already drawn. */
function renderPages(parts, notes, bodyOf, o, scale, setting) {
  const drawn = [];
  try {
    for (const d of parts) drawn.push(render(d, notes, bodyOf(d), o, Math.min(scale, MULTI_PAGE_SCALE)));
  } catch (err) {
    for (const x of drawn) { x.card.canvas.width = 0; x.card.canvas.height = 0; }
    throw err;
  }
  return {
    card: drawn[0].card,
    cards: drawn.map((x) => x.card),
    problems: drawn.flatMap((x) => x.problems),
    slack: Math.min(...drawn.map((x) => x.slack)),
    setting,
  };
}

/** Draw the teaching timetable: { card, cards, problems, slack, setting }, `cards` one a page. */
export async function drawTeaching(doc, { scale = SCALE } = {}) {
  const notes = [...doc.notes, doc.source];
  const bodyOf = (d) => (card, y, o) => teachingBody(card, d, d.rows, y, o);
  const one = fitting(doc, notes, bodyOf(doc), TEACHING_SETTINGS, scale);
  if (one >= 0) {
    const { card, problems, slack } = render(doc, notes, bodyOf(doc), TEACHING_SETTINGS[one], scale);
    return { card, cards: [card], problems, slack, setting: one };
  }
  const { parts, i } = paginate(doc, notes, bodyOf, TEACHING_SETTINGS, Math.min(scale, MULTI_PAGE_SCALE));
  return renderPages(parts, notes, bodyOf, TEACHING_SETTINGS[i], scale, i);
}
