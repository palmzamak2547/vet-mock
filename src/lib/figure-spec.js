// ============================================================
// figure-spec.js — a figure inside an explanation or a passage
// ============================================================
// An explanation may carry one drawn figure, fenced like code:
//
//   ```figure twobytwo
//   cols: มดลูกอักเสบ | ปกติ
//   row: ฉีดยาคุมกำเนิด | 10 | 6
//   row: ไม่ฉีดยาคุมกำเนิด | 5 | 12
//   calc: OR = (10 x 12)/(6 x 5) = 120/30 = 4
//   ```
//
// One `key: value` a line, cells split by " | ", a trailing "| key" marks the
// mark that answers the question. The kinds and their keys:
//
//   twobytwo  cols, row, sum, calc        a 2x2 with margins; the cells a calc uses light up
//   interval  null, row, note             estimates and their confidence intervals
//   bars      head, unit, bar             up to eight values side by side
//   timeline  unit, start, at, span       events and ranges on a time axis
//   flow      lane, step                  steps top to bottom, at most two lanes
//   scale     band, value                 a banded scale and one value on it
//
// Everything about how it looks is decided here and in ExplainFigure.jsx, not
// by the writer: the scale, the order, the one accent, where labels sit. The
// writer states the facts and which one answers.
//
// The figure is for the eye only. An explanation that holds one keeps its
// paragraph in `explainSay` (wholeExplain), so the voice, the coach and the AI
// never meet it; scripts/lint-question-figures.mjs holds every figure, label
// and claim in it to what the question already says.
// ============================================================

export const FIGURE_KINDS = {
  twobytwo: ['cols', 'row', 'sum', 'calc'],
  interval: ['null', 'row', 'note'],
  bars: ['head', 'unit', 'bar'],
  timeline: ['unit', 'start', 'at', 'span'],
  flow: ['lane', 'step'],
  scale: ['band', 'value'],
};

export const FENCE_OPEN = /^[^\S\n]*```figure[^\S\n]+([a-z]+)[^\S\n]*$/;
export const FENCE_CLOSE = /^[^\S\n]*```[^\S\n]*$/;

const cut = (v) => v.split('|').map((s) => s.trim());
const num = (s) => {
  const n = Number(String(s).replace(/,/g, ''));
  return String(s).trim() !== '' && Number.isFinite(n) ? n : null;
};
// "| key" at the end of a line marks the answer.
const keyed = (cells) => (cells[cells.length - 1] === 'key' ? [cells.slice(0, -1), true] : [cells, false]);

// Split an arithmetic expression at its top-level "/" (outside brackets).
function fraction(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === '/' && depth === 0) return [expr.slice(0, i).trim(), expr.slice(i + 1).trim()];
  }
  return [expr.trim(), ''];
}
const unwrap = (s) => (/^\(.*\)$/.test(s) && fraction(s.slice(1, -1))[1] === '' ? s.slice(1, -1).trim() : s);
export const figuresIn = (s) => (String(s).match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => n.replace(/,$/, ''));

/**
 * The lines between the fences to a figure:
 * { kind, ...fields, plain, errors: [] }. An unknown key, a repeated key that
 * holds one value, or a malformed line is kept in errors (the lint fails on
 * it; the card draws what it understood). plain is the figure in words, for
 * any surface that cannot draw it (readableText in rich-blocks.js).
 */
const ONCE = ['cols', 'head', 'unit', 'start', 'note', 'null', 'sum', 'value'];
export function parseFigure(kind, body) {
  const fig = { kind, errors: [], plain: '' };
  const keys = FIGURE_KINDS[kind];
  if (!keys) { fig.errors.push('unknown figure kind "' + kind + '"'); return fig; }
  const list = (k) => (fig[k] ||= []);
  const seen = new Set();
  const words = [];
  const need = (n, what, line) => { if (n == null) fig.errors.push(what + ' is not a number: ' + line.slice(0, 50)); return n; };
  for (const raw of String(body).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!m || !keys.includes(m[1])) { fig.errors.push('a line the ' + kind + ' figure does not read: ' + line.slice(0, 50)); continue; }
    const [, k, v] = m;
    if (ONCE.includes(k)) {
      if (seen.has(k)) { fig.errors.push('"' + k + '" given twice; it holds one value'); continue; }
      seen.add(k);
    }
    const [cells, key] = keyed(cut(v));
    if (k !== 'null') words.push(k === 'calc' || k === 'value' ? v.trim() : cells.filter(Boolean).join(', '));
    if (k === 'cols' || k === 'head') fig[k] = cells;
    else if (k === 'unit' || k === 'start' || k === 'note') fig[k] = v.trim();
    else if (k === 'null') fig.nil = need(num(v), 'null', line);
    else if (k === 'row' && kind === 'twobytwo') list('rows').push({ label: cells[0], cells: cells.slice(1) });
    else if (k === 'sum') fig.sum = { label: cells[0], cells: cells.slice(1) };
    else if (k === 'calc') {
      // "<name> = <expression> = <result>"
      const parts = v.split(/\s+=\s+/).map((x) => x.trim());
      if (parts.length < 3) { fig.errors.push('a calc line is "<name> = <expression> = <result>": ' + line.slice(0, 50)); continue; }
      const [top, bottom] = fraction(parts[1]);
      list('calcs').push({ label: parts[0], expr: parts[1], num: unwrap(top), den: bottom ? unwrap(bottom) : '', mid: parts.slice(2, -1), result: parts[parts.length - 1], key });
    } else if (k === 'row') {
      const [est, lo, hi] = [1, 2, 3].map((i) => need(num(cells[i]), 'an interval bound', line));
      if (est != null && lo != null && hi != null && !(lo <= est && est <= hi)) fig.errors.push('the estimate ' + est + ' is outside ' + lo + ' to ' + hi);
      list('rows').push({ label: cells[0], est, lo, hi, text: cells.slice(1, 4), key });
    } else if (k === 'bar') {
      const value = need(num(cells[1]), 'a bar', line);
      if (value != null && value < 0) fig.errors.push('a bar starts at zero and cannot be negative: ' + line.slice(0, 50));
      list('bars').push({ label: cells[0], value, text: cells[1], key });
    } else if (k === 'at') list('events').push({ at: need(num(cells[0]), 'a time', line), text: cells[0], label: cells[1] || '', key });
    else if (k === 'span') {
      const [x, y] = cells[0].split(/\s*-\s*/);
      const [at, to] = [need(num(x), 'a span start', line), need(num(y), 'a span end', line)];
      if (at != null && to != null && to < at) fig.errors.push('a span ends before it starts: ' + line.slice(0, 50));
      list('events').push({ at, to, text: cells[0], label: cells[1] || '', key });
    } else if (k === 'lane') list('lanes').push({ title: cells[0], key, steps: [] });
    else if (k === 'step') {
      if (!fig.lanes) fig.lanes = [{ title: '', key: false, steps: [] }];
      // A step that opens with its number ("step: 7 | ...") is drawn with the number as a badge.
      const no = /^\d+$/.test(cells[0]) ? cells.shift() : '';
      fig.lanes[fig.lanes.length - 1].steps.push({ no, label: cells[0] || '', detail: cells[1] || '', key });
    } else if (k === 'band') list('bands').push({ lo: num(cells[0]), hi: num(cells[1]), text: [cells[0], cells[1]], label: cells[2] || '', key });
    else if (k === 'value') {
      const [label, n] = v.split(/\s+=\s+/);
      fig.value = { label: (label || '').trim(), value: need(num(n), 'the value', line), text: (n || '').trim() };
    }
  }
  // A ratio's axis is logarithmic: every bound must be above zero.
  if (kind === 'interval' && fig.nil === 1 && (fig.rows || []).some((r) => !(r.lo > 0))) fig.errors.push('a ratio (null: 1) is drawn on a log scale, so every bound must be above 0');
  fig.plain = words.join('\n');
  return fig;
}

/** The same figure with no mark flagged as the answer: what a passage may show before the answer. */
export function withoutKeys(fig) {
  const off = (m) => ({ ...m, key: false });
  return {
    ...fig,
    ...(fig.rows && { rows: fig.rows.map(off) }), ...(fig.bars && { bars: fig.bars.map(off) }),
    ...(fig.events && { events: fig.events.map(off) }), ...(fig.bands && { bands: fig.bands.map(off) }),
    ...(fig.calcs && { calcs: fig.calcs.map(off) }),
    ...(fig.lanes && { lanes: fig.lanes.map((l) => ({ ...off(l), steps: l.steps.map(off) })) }),
  };
}

// ── Layout ─────────────────────────────────────────────────────────────────
// The figure's geometry for the width it has, decided here, before its drawing
// arrives: FigureSlot holds the box at this height and ExplainFigure lays its
// rows out to these same numbers, in normal flow, so nothing below moves when
// the drawing replaces the held box, at 320 px, at 200% zoom or on a desktop.
const BOX = 28; // the box's padding and border (styles.css .vmx-fig)
// A generous width for a run of text: Thai combining marks take no width, every other character about 0.56 em.
const ems = (text, px = 15) => [...String(text ?? '')].filter((c) => !/[ัิ-ฺ็-๎]/.test(c)).length * px * 0.56;
const lines = (text, width, px = 15) => Math.max(1, Math.ceil(ems(text, px) / Math.max(24, width)));

/** { height, narrow, ... } for a figure drawn `width` px wide (0: a 375 px phone). */
export function figureLayout(fig, width = 0) {
  const inner = Math.max(60, (width || 343) - BOX);
  const narrow = inner < 240;
  const n = (a) => (Array.isArray(a) ? a.length : 0);
  // Too narrow to draw (200% zoom on a phone): the figure is listed in words instead, item by item.
  const tooNarrow = { twobytwo: inner < 44 * Math.max(2, n(fig.cols)) + 8, bars: inner < 140, timeline: inner < 150, flow: inner < 150, interval: inner < 170, scale: inner < 150 }[fig.kind];
  if (tooNarrow) {
    const items = listItems(fig);
    return { height: BOX + items.reduce((h, t) => h + lines(t, inner - 14, 15) * 22 + 4, 0), narrow: true, list: items };
  }
  switch (fig.kind) {
    case 'twobytwo': {
      const cols = Math.max(2, n(fig.cols));
      const colW = narrow ? (inner - 4 * (cols - 1)) / cols : (inner - 4 * cols) / (cols + 1.15);
      const head = Math.max(36, Math.max(...(fig.cols || ['']).map((c) => lines(c, colW - 4, 14))) * 19 + 6);
      const rows = n(fig.rows) + (fig.sum ? 1 : 0);
      const labelRows = narrow ? rows * 24 : 0;
      const calcCols = !narrow && n(fig.calcs) > 1 && inner >= 250 ? 2 : 1;
      const calcW = (inner - 12 * (calcCols - 1)) / calcCols;
      const calcH = Math.max(...(fig.calcs || [{ label: '' }]).map((c) => lines(`${c.label} อ่านลงตามคอลัมน์`, calcW, 14) * 20 + 52 + (c.mid?.length ? 30 : 0) + 10));
      const calcs = Math.ceil(Math.max(1, n(fig.calcs)) / calcCols) * calcH + 13;
      return { height: BOX + head + 4 + rows * 54 + labelRows + calcs, narrow, head, calcCols, calcH };
    }
    case 'interval': {
      const row = narrow ? 82 : 58;
      return { height: BOX + 24 + row * Math.max(1, n(fig.rows)) + (fig.note ? lines(fig.note, inner, 15) * 22 : 0) + (fig.nil === 1 ? 22 : 0), narrow };
    }
    case 'bars': {
      const labelW = 4.6 * 14;
      const slim = inner < 180;
      const heads = fig.head || [];
      const head = heads.length
        ? (slim ? heads.reduce((h, t) => h + lines(t, inner, 14) * 20, 4) : Math.max(lines(heads[0], labelW, 14), lines(heads[1] || '', inner - labelW - 10, 14)) * 20 + 8)
        : 0;
      const bar = slim ? 70 : 44; // slim: label, bar, then its value under it
      return { height: BOX + head + bar * Math.max(1, n(fig.bars)) + (fig.unit ? lines(fig.unit, inner, 14) * 20 + 4 : 0), narrow: slim };
    }
    case 'timeline': {
      const evs = (fig.events || []).filter((e) => e.at != null);
      const times = [...new Set(evs.map((e) => e.at))].sort((p, q) => p - q);
      const steps = times.slice(1).map((t, i) => t - times[i]).filter((d) => d > 0);
      const unitStep = steps.length ? Math.min(...steps) : 1;
      const labelW = inner - 4.2 * 15 - 24;
      const words = (labels) => labels.reduce((h, l) => h + lines(l.label, labelW, 15) * 22, 0) + 8;
      const rows = [];
      if (fig.start) rows.push({ start: true, labels: [{ label: fig.start }], text: '', dt: unitStep });
      times.forEach((t, i) => {
        const here = evs.filter((e) => e.at === t);
        rows.push({ text: here[0].text, key: here.some((e) => e.key), labels: here.map((e) => ({ label: e.label, key: e.key })), dt: i ? t - times[i - 1] : unitStep });
      });
      // A row is as tall as the time to the next one (up to three steps), and never shorter than its labels.
      rows.forEach((r, i) => {
        const next = rows[i + 1];
        r.height = next ? Math.max(Math.round(44 * Math.min(3, next.dt / unitStep)), words(r.labels)) : words(r.labels);
      });
      return { height: BOX + rows.reduce((h, r) => h + r.height, 0), narrow, rows };
    }
    case 'flow': {
      const lanes = fig.lanes || [];
      const stacked = narrow || lanes.length < 2 || inner < 300;
      const laneW = stacked ? inner : (inner - 10) / lanes.length;
      const box = (st) => Math.max(62, lines(st.label, laneW - (st.no ? 56 : 22), 15) * 21 + (st.detail ? lines(st.detail, laneW - (st.no ? 56 : 22), 14) * 19 : 0) + 18);
      const laneH = (l) => (lanes.length > 1 || l.title ? lines(l.title, laneW, 14) * 20 + 12 : 0) + l.steps.reduce((h, st, i) => h + (i ? 18 : 0) + box(st), 0);
      const hs = lanes.map(laneH);
      return { height: BOX + (stacked ? hs.reduce((a, b) => a + b + 10, -10) : Math.max(0, ...hs)), narrow: stacked };
    }
    case 'scale': return { height: BOX + 30 + 34 + 24 * Math.max(1, n(fig.bands)) + 8, narrow };
    default: return { height: 0, narrow };
  }
}

/** The figure as a list of short lines (what a screen reader is told, and what a too-narrow screen shows). */
export function listItems(fig) {
  const k = (m) => (m.key ? ' (คำตอบ)' : '');
  const x = (t) => String(t).replace(/s+[x*]s+/g, ' × ');
  switch (fig.kind) {
    case 'twobytwo': return [...(fig.rows || []), ...(fig.sum ? [fig.sum] : [])].map((r) => `${r.label}: ${r.cells.map((c, i) => `${(fig.cols || [])[i] || ''} ${c}`).join(', ')}`)
      .concat((fig.calcs || []).map((c) => `${c.label} = ${x(c.num)}${c.den ? ` / ${x(c.den)}` : ''} = ${c.result}${k(c)}`));
    case 'interval': return (fig.rows || []).map((r) => `${r.label} ${r.text[0]} (${r.text[1]} ถึง ${r.text[2]})${k(r)}`).concat(fig.note ? [fig.note] : []);
    case 'bars': return (fig.bars || []).map((b) => `${b.label}: ${b.text}${k(b)}`);
    case 'timeline': return (fig.start ? [fig.start] : []).concat((fig.events || []).map((e) => `${e.text} ${fig.unit || ''}: ${e.label}${k(e)}`));
    case 'flow': return (fig.lanes || []).flatMap((l) => (l.title ? [`${l.title}${k(l)}`] : []).concat(l.steps.map((st) => `${st.no ? `${st.no}. ` : ''}${st.label}${st.detail ? `, ${st.detail}` : ''}${k(st)}`)));
    case 'scale': return (fig.value ? [`${fig.value.label} = ${fig.value.text}`] : []).concat((fig.bands || []).map((b) => `${b.label} ${b.text[0] || ''} ถึง ${b.text[1] || ''}${k(b)}`));
    default: return [fig.plain || ''];
  }
}

/** The height a figure takes at `width` (FigureSlot holds this before the drawing arrives). */
export const figureHeight = (fig, width = 0) => figureLayout(fig, width).height;
