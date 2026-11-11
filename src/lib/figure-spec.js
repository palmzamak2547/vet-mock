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
 * { kind, ...fields, errors: [] }. An unknown key or a malformed line is kept
 * in `errors` (the lint fails on it; the card draws what it understood).
 */
export function parseFigure(kind, body) {
  const fig = { kind, errors: [] };
  const keys = FIGURE_KINDS[kind];
  if (!keys) { fig.errors.push(`unknown figure kind "${kind}"`); return fig; }
  const list = (k) => (fig[k] ||= []);
  for (const raw of String(body).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!m || !keys.includes(m[1])) { fig.errors.push(`a line the ${kind} figure does not read: ${line.slice(0, 50)}`); continue; }
    const [, k, v] = m;
    const [cells, key] = keyed(cut(v));
    if (k === 'cols' || k === 'head') fig[k] = cells;
    else if (k === 'unit' || k === 'start' || k === 'note') fig[k] = v.trim();
    else if (k === 'null') fig.nil = num(v);
    else if (k === 'row' && kind === 'twobytwo') list('rows').push({ label: cells[0], cells: cells.slice(1) });
    else if (k === 'sum') fig.sum = { label: cells[0], cells: cells.slice(1) };
    else if (k === 'calc') {
      // "<name> = <expression> = <result>"
      const parts = v.split(/\s+=\s+/).map((s) => s.trim());
      if (parts.length < 3) { fig.errors.push(`a calc line is "<name> = <expression> = <result>": ${line.slice(0, 50)}`); continue; }
      const [top, bottom] = fraction(parts[1]);
      list('calcs').push({ label: parts[0], expr: parts[1], num: unwrap(top), den: bottom ? unwrap(bottom) : '', mid: parts.slice(2, -1), result: parts[parts.length - 1], key });
    } else if (k === 'row') list('rows').push({ label: cells[0], est: num(cells[1]), lo: num(cells[2]), hi: num(cells[3]), text: cells.slice(1, 4), key });
    else if (k === 'bar') list('bars').push({ label: cells[0], value: num(cells[1]), text: cells[1], key });
    else if (k === 'at') list('events').push({ at: num(cells[0]), text: cells[0], label: cells[1] || '', key });
    else if (k === 'span') {
      const [a, b] = cells[0].split(/\s*-\s*/);
      list('events').push({ at: num(a), to: num(b), text: cells[0], label: cells[1] || '', key });
    } else if (k === 'lane') list('lanes').push({ title: cells[0], key, steps: [] });
    else if (k === 'step') {
      if (!fig.lanes) fig.lanes = [{ title: '', key: false, steps: [] }];
      // A step that opens with its number ("step: 7 | ...") is drawn with the number as a badge.
      const no = /^\d+$/.test(cells[0]) ? cells.shift() : '';
      fig.lanes[fig.lanes.length - 1].steps.push({ no, label: cells[0] || '', detail: cells[1] || '', key });
    } else if (k === 'band') list('bands').push({ lo: num(cells[0]), hi: num(cells[1]), text: [cells[0], cells[1]], label: cells[2] || '', key });
    else if (k === 'value') {
      const [label, n] = v.split(/\s+=\s+/);
      fig.value = { label: (label || '').trim(), value: num(n), text: (n || '').trim() };
    }
  }
  return fig;
}

/**
 * The height a figure takes, in px, decided before its drawing code arrives,
 * so the box is reserved and nothing below it moves when it does. The drawing
 * (ExplainFigure.jsx) lays itself out to these same heights.
 */
export function figureHeight(fig) {
  // Fitted to a 375 px phone (the box's padding and border included); a wider screen only adds a little.
  const n = (a) => (Array.isArray(a) ? a.length : 0);
  switch (fig.kind) {
    case 'twobytwo': return 75 + 52 * (n(fig.rows) + (fig.sum ? 1 : 0)) + 79 * Math.max(1, n(fig.calcs)) + 13; // calcs stack on a phone, pair on a wider screen
    case 'interval': return 72 + 56 * Math.max(1, n(fig.rows)) + (fig.note ? 0 : -24);
    case 'bars': return 44 + 44 * Math.max(1, n(fig.bars)) + (fig.head ? 28 : 0) + (fig.unit ? 24 : 0);
    case 'timeline': return 52 + 52 * Math.max(1, new Set((fig.events || []).map((e) => e.at)).size) + (fig.start ? 44 : 0);
    case 'flow': {
      const steps = Math.max(1, ...(fig.lanes || []).map((l) => n(l.steps)));
      // Two lanes halve each box's width, so their steps wrap to more lines.
      if (n(fig.lanes) > 1) return 52 + 100 * steps;
      return (fig.lanes?.[0]?.title ? 32 : 0) + 42 + 84 * steps;
    }
    case 'scale': return 162;
    default: return 0;
  }
}
