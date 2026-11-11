#!/usr/bin/env node
// ============================================================
// lint-question-figures.mjs — a figure shows only what the question says
// ============================================================
// An explanation (or a passage) may carry one drawn figure, a ```figure block
// (src/lib/figure-spec.js). A figure is a second way of saying what the
// question's own text already says, never a place for a new fact. "The
// question's own text" is the stem, `say`, the passage and its title, and
// `explainSay` (the paragraph the explanation was written as): never the
// options, so a figure cannot borrow a wrong option's words.
//
// This fails on:
//   - a figure where only a line of text fits (a stem, an option, `say`,
//     `explainSay`, a model answer), or in a matching question's explanation;
//   - an explanation with a figure that keeps no paragraph in `explainSay`;
//   - a figure that does not parse (the parser refuses a repeated key, a
//     number that is not one, a bound at or below 0 on a ratio's log scale,
//     an estimate outside its interval, a negative bar), an unknown kind, or
//     more marks than the eye takes in at once;
//   - any number or label the question's own text does not hold;
//   - a pairing the text does not make: a step drawn under a number the text
//     does not give it, an event at a time the text does not put it, a bar's
//     value away from its label, a band's bounds away from its name, an
//     estimate away from its interval;
//   - a 2x2 whose cells or headers differ from the passage's own table, or
//     whose totals are not the sums of their cells;
//   - a calc whose arithmetic does not give its result (to its own decimals);
//   - an interval note that does not name the no-difference value or sits on
//     an interval that does not cross it;
//   - a mark flagged as the answer in a passage (on screen before the answer);
//   - in a multiple-choice explanation, a figure of a kind that marks an
//     answer (bars, timeline, flow, scale) with no mark flagged, more than one,
//     or one that agrees with a wrong option rather than the correct one;
//   - a figure that restates a table in the same text, or a 2x2 that restates
//     the passage's table and adds no reading of it (one cell over its total).
//
// What a machine cannot check: whether two numbers the text gives in a list
// ("270, 471 และ 663 ... 90%, 97% และ 99% ตามลำดับ") are paired in the right
// order, and whether a label paraphrases its source faithfully. A reviewer
// reads every figure against its paragraph.
//
// Usage: node scripts/lint-question-figures.mjs
// ============================================================
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { splitBlocks } from '../src/lib/rich-blocks.js';
import { figuresIn } from '../src/lib/figure-spec.js';

const LINE_FIELDS = ['q', 'say', 'explainSay', 'model_answer', 'passage_title'];
const LIMIT = { twobytwo: 6, interval: 7, bars: 8, timeline: 7, flow: 7, scale: 5 };
const MARKS_AN_ANSWER = new Set(['bars', 'timeline', 'flow', 'scale']);
const NEAR = 80;  // characters within which the text must pair two things a figure pairs

const norm = (s) => String(s ?? '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const clean = (n) => String(n).replace(/,/g, '');
const numSet = (s) => new Set(figuresIn(s).map(clean));
const isNum = (s) => /^\d[\d,]*(?:\.\d+)?$/.test(String(s).trim());

/** Evaluate + − × / and brackets; null when the text is not arithmetic. */
export function evaluate(expr) {
  const src = String(expr).replace(/\s+[x*×]\s+|[×*]/g, ' * ').replace(/[−–]/g, '-').replace(/,/g, '');
  const tokens = src.match(/\d+(?:\.\d+)?|[-+*/()]/g);
  if (!tokens || tokens.join('') !== src.replace(/\s+/g, '')) return null;
  let i = 0;
  const atom = () => {
    const t = tokens[i++];
    if (t === '(') { const v = sum(); if (tokens[i++] !== ')') throw new Error('bracket'); return v; }
    if (t === '-') return -atom();
    const v = Number(t);
    if (!Number.isFinite(v)) throw new Error('number');
    return v;
  };
  const product = () => { let v = atom(); while (tokens[i] === '*' || tokens[i] === '/') v = tokens[i++] === '*' ? v * atom() : v / atom(); return v; };
  const sum = () => { let v = product(); while (tokens[i] === '+' || tokens[i] === '-') v = tokens[i++] === '+' ? v + product() : v - product(); return v; };
  try { const v = sum(); return i === tokens.length && Number.isFinite(v) ? v : null; } catch { return null; }
}
const agrees = (value, result) => {
  const r = String(result).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  if (value == null || !r) return false;
  const places = (r[0].split('.')[1] || '').length;
  return Math.abs(value - Number(r[0])) <= 0.5 * 10 ** -places + 1e-9;
};

// Where a word or a number occurs in a text: [start, end) pairs. A number is a whole token (1 is not in 10 or 0.1).
function spots(text, what) {
  const out = [];
  const w = norm(what);
  if (!w) return out;
  if (isNum(w)) {
    for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) if (clean(m[0]) === clean(w)) out.push([m.index, m.index + m[0].length]);
    return out;
  }
  for (let i = text.indexOf(w); i !== -1; i = text.indexOf(w, i + 1)) out.push([i, i + w.length]);
  return out;
}
const gap = ([a, b], [c, d]) => Math.max(0, c - b, a - d);
/** Some one text holds `a` and `b` within `within` characters of each other. */
const paired = (texts, a, b, within = NEAR) => texts.some((t) => spots(t, a).some((x) => spots(t, b).some((y) => gap(x, y) <= within)));
/**
 * At some occurrence of `label`, the first number on its `side` (or, if none is near on that side, on the
 * other) is `n`. Thai puts a step's number after its name ("... อยู่ในขั้นตอนที่ 2") and a time before
 * its event ("ภายใน 1 ชม. ลูกยืนได้").
 */
function nearestIs(texts, label, n, side) {
  return texts.some((t) => spots(t, label).some(([from, to]) => {
    const nums = [...t.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => ({ at: m.index, end: m.index + m[0].length, v: clean(m[0]) }));
    const after = nums.find((m) => m.at >= to && m.at - to <= NEAR);
    const before = [...nums].reverse().find((m) => m.end <= from && from - m.end <= NEAR);
    const first = side === 'after' ? after || before : before || after;
    return first?.v === clean(n);
  }));
}

// Character bigrams, for "which option does this mark read like".
const grams = (s) => { const t = norm(s).replace(/\s+/g, ''); const g = new Map(); for (let i = 0; i < t.length - 1; i++) g.set(t.slice(i, i + 2), (g.get(t.slice(i, i + 2)) || 0) + 1); return g; };
function dice(a, b) {
  const [x, y] = [grams(a), grams(b)];
  let both = 0; let n = 0;
  for (const [k, v] of x) { both += Math.min(v, y.get(k) || 0); n += v; }
  for (const v of y.values()) n += v;
  return n ? (2 * both) / n : 0;
}

/** Everything a figure says: its labels, its numbers, its marks (with what each mark reads as). */
export function figureParts(fig) {
  const labels = [];
  const numbers = [];
  const marks = [];
  const add = (...xs) => xs.forEach((v) => { if (v != null && String(v).trim() && !isNum(v)) labels.push(String(v)); });
  switch (fig.kind) {
    case 'twobytwo':
      add(...(fig.cols || []), ...(fig.rows || []).map((r) => r.label), fig.sum?.label, ...(fig.calcs || []).map((c) => c.label));
      for (const r of [...(fig.rows || []), ...(fig.sum ? [fig.sum] : [])]) numbers.push(...r.cells);
      for (const c of fig.calcs || []) { numbers.push(c.expr, ...c.mid, c.result); marks.push({ key: c.key, parts: [c.expr, c.result] }); }
      break;
    case 'interval':
      add(...(fig.rows || []).map((r) => r.label), fig.note);
      numbers.push(fig.nil);
      for (const r of fig.rows || []) { numbers.push(...r.text); marks.push({ key: r.key, parts: [r.label, ...r.text] }); }
      break;
    case 'bars':
      add(...(fig.head || []), fig.unit, ...(fig.bars || []).map((b) => b.label));
      for (const b of fig.bars || []) { numbers.push(b.label, b.text); marks.push({ key: b.key, parts: [b.text, b.label] }); }
      break;
    case 'timeline':
      add(fig.unit, fig.start, ...(fig.events || []).map((e) => e.label));
      for (const e of fig.events || []) { numbers.push(e.text); marks.push({ key: e.key, parts: [e.label, e.text] }); }
      break;
    case 'flow':
      for (const l of fig.lanes || []) {
        add(l.title);
        marks.push({ key: l.key, parts: [l.title, ...l.steps.flatMap((s) => [s.label, s.detail])] });
        for (const s of l.steps) { add(s.label, s.detail); numbers.push(s.no); marks.push({ key: s.key, parts: [s.label, s.detail] }); }
      }
      break;
    case 'scale':
      add(...(fig.bands || []).map((b) => b.label), fig.value?.label);
      for (const b of fig.bands || []) { numbers.push(...b.text); marks.push({ key: b.key, parts: [b.label] }); }
      numbers.push(fig.value?.text);
      break;
    default:
  }
  const markCount = { twobytwo: (fig.calcs || []).length + 4, interval: (fig.rows || []).length, bars: (fig.bars || []).length, timeline: new Set((fig.events || []).map((e) => e.at)).size + (fig.start ? 1 : 0), flow: (fig.lanes || []).reduce((n, l) => n + l.steps.length, 0), scale: (fig.bands || []).length + (fig.value ? 1 : 0) }[fig.kind] ?? 0;
  return { labels, numbers: numbers.filter((n) => n != null && n !== '').map(String), marks: marks.map((m) => ({ ...m, parts: m.parts.filter((p) => p && String(p).trim()) })), markCount };
}

// The passage's own table for a 2x2: its header (corner dropped) and rows by label.
function passageTable(q) {
  if (typeof q.passage !== 'string') return null;
  return splitBlocks(q.passage).filter((b) => b.type === 'table').map((t) => ({
    head: t.head.slice(1).map(norm),
    rows: new Map(t.rows.map((r) => [norm(r[0]), r.slice(1).map(clean)])),
  }));
}

function checkTwoByTwo(fig, q, say) {
  const rows = fig.rows || [];
  const cols = fig.cols || [];
  const n = cols.length;
  if (rows.length !== 2 || (n !== 2 && n !== 3)) say('two rows under two columns (and a third column of totals at most)');
  for (const r of [...rows, ...(fig.sum ? [fig.sum] : [])]) if (r.cells.length !== n) say(`row "${r.label}" has ${r.cells.length} cells under ${n} columns`);
  if (!(fig.calcs || []).length) say('a 2x2 figure ties at least one calc to its cells');
  const v = (s) => Number(clean(s));
  // Totals are the sums of their cells.
  if (n === 3) for (const r of rows) if (v(r.cells[0]) + v(r.cells[1]) !== v(r.cells[2])) say(`row "${r.label}": ${r.cells[2]} is not ${r.cells[0]} + ${r.cells[1]}`);
  if (fig.sum) for (let k = 0; k < Math.min(2, n); k++) if (rows.reduce((t, r) => t + v(r.cells[k]), 0) !== v(fig.sum.cells[k])) say(`column "${cols[k]}": ${fig.sum.cells[k]} is not the sum of its cells`);
  // The same cells, under the same headers, as the passage's table.
  for (const t of passageTable(q) || []) {
    const matched = rows.filter((r) => t.rows.has(norm(r.label)));
    if (!matched.length) continue;
    if (matched.length !== rows.length) { say('its rows are not the rows of the passage\'s table'); continue; }
    cols.forEach((c, k) => {
      const j = t.head.indexOf(norm(c));
      if (j === -1) { if (k < 2) say(`the column "${c}" is not a column of the passage's table`); return; }
      for (const r of [...rows, ...(fig.sum && t.rows.has(norm(fig.sum.label)) ? [fig.sum] : [])]) {
        const want = t.rows.get(norm(r.label))?.[j];
        if (want != null && want !== clean(r.cells[k])) say(`"${r.label}" under "${c}" is ${r.cells[k]}, the passage's table has ${want}`);
      }
    });
    // A figure that redraws the passage's table must add a reading of it: one cell over its row's or column's total.
    const reads = (fig.calcs || []).some((c) => figuresIn(c.num).length === 1 && figuresIn(c.den).length === 1);
    if (!reads) say('it redraws the passage\'s table and adds no reading of it (one cell over its total); drop it or say what it adds');
  }
}

function checkFigure(fig, q, own, ownNums, id, name) {
  const out = [];
  const say = (m) => out.push(`${id} ${name} (${fig.kind}): ${m}`);
  for (const e of fig.errors) say(e);
  if (!LIMIT[fig.kind]) return out;
  const { labels, numbers, marks, markCount } = figureParts(fig);
  const texts = own.texts;
  if (markCount > LIMIT[fig.kind]) say(`${markCount} marks; at most ${LIMIT[fig.kind]} read at a glance`);
  if (fig.kind === 'twobytwo') checkTwoByTwo(fig, q, say);
  if (fig.kind === 'interval') {
    if (fig.nil == null) say('an interval names its no-difference value (null: 1 for a ratio, 0 for a difference)');
    for (const r of fig.rows || []) {
      if ([r.est, r.lo, r.hi].some((x) => x == null)) continue;
      // The estimate is the number the text gives just before its interval, and just after its name.
      if (!nearestIs(texts, r.text[1], r.text[0], 'before') || !paired(texts, r.text[1], r.text[2], 30)) say(`"${r.label}": the text never gives ${r.text[0]} with its interval ${r.text[1]} to ${r.text[2]}`);
      if (!nearestIs(texts, r.label, r.text[0], 'after')) say(`the text never gives "${r.label}" as ${r.text[0]}`);
    }
    if (fig.note) {
      const crosses = (fig.rows || []).some((r) => r.lo <= fig.nil && fig.nil <= r.hi);
      if (!figuresIn(fig.note).map(clean).includes(clean(fig.nil))) say(`the note "${fig.note}" stands at the no-difference line and must name ${fig.nil}`);
      if (!crosses) say(`the note "${fig.note}" sits at ${fig.nil}, which no interval crosses`);
    }
  }
  if (fig.kind === 'bars') for (const b of fig.bars || []) if (b.value != null && !paired(texts, b.label, b.text)) say(`the text never gives "${b.label}" as ${b.text}`);
  if (fig.kind === 'timeline') for (const e of fig.events || []) if (e.label && e.at != null && !nearestIs(texts, e.label, e.text.split(/\s*-\s*/)[0])) say(`the text never puts "${e.label}" at ${e.text}`);
  if (fig.kind === 'flow') {
    if ((fig.lanes || []).length > 2) say('at most two lanes, side by side on a phone');
    for (const l of fig.lanes || []) for (const s of l.steps) if (s.no && !nearestIs(texts, s.label, s.no, 'after')) say(`the text never numbers "${s.label}" as step ${s.no}`);
  }
  if (fig.kind === 'scale') {
    const v = fig.value?.value;
    if (v == null) say('a scale has one "value: label = number"');
    else {
      if (!(fig.bands || []).some((b) => (b.lo == null || b.lo <= v) && (b.hi == null || v <= b.hi))) say(`the value ${v} falls in no band`);
      if ((fig.bands || []).some((b) => b.key && !((b.lo == null || b.lo <= v) && (b.hi == null || v <= b.hi)))) say('the band marked as the answer does not hold the value');
      if (!paired(texts, fig.value.label, fig.value.text)) say(`the text never gives ${fig.value.label} as ${fig.value.text}`);
    }
    for (const b of fig.bands || []) for (const bound of b.text) if (bound && !paired(texts, b.label, bound, 40)) say(`the text never bounds "${b.label}" at ${bound}`);
  }
  // Arithmetic.
  for (const c of fig.calcs || []) for (const s of [c.expr, ...c.mid]) if (!agrees(evaluate(s), c.result)) say(`"${c.label} = ${s}" does not give ${c.result}`);
  // Nothing the question's own text does not hold.
  for (const l of new Set(labels)) if (!own.all.includes(norm(l))) say(`the label "${l}" is not in the stem, the passage or explainSay`);
  const missing = [...new Set(numbers.flatMap((s) => figuresIn(s)).map(clean))].filter((x) => !ownNums.has(x));
  if (missing.length) say(`shows ${missing.join(', ')}, which the stem, the passage and explainSay do not hold`);
  // The accent.
  const keys = marks.filter((m) => m.key);
  if (name === 'passage' && keys.length) say('a passage is on screen before the answer: it flags no mark as the answer');
  if (keys.length > 1) say(`${keys.length} marks flagged as the answer; one accent means one answer`);
  if (name === 'explain' && q.type === 'mcq' && Array.isArray(q.options)) {
    if (!keys.length && MARKS_AN_ANSWER.has(fig.kind)) say('a multiple-choice figure of this kind flags the mark that answers (| key)');
    if (keys.length === 1) {
      const right = q.options[q.answer] ?? '';
      const wrong = q.options.filter((_, i) => i !== q.answer);
      const hits = (opt) => keys[0].parts.some((p) => (isNum(p) ? numSet(opt).has(clean(p)) : norm(opt).includes(norm(p)) && norm(p).length >= 3));
      const text = keys[0].parts.join(' ');
      if (!hits(right)) {
        if (wrong.some(hits)) say(`the mark flagged as the answer ("${keys[0].parts[0]}") is a wrong option's`);
        else if (!(dice(text, right) > Math.max(0, ...wrong.map((o) => dice(text, o))))) say(`the mark flagged as the answer ("${keys[0].parts[0]}") reads more like a wrong option than the correct one`);
      }
    }
  }
  return out;
}

export function lintQuestionFigures(questions) {
  const problems = [];
  let figures = 0;
  for (const q of questions) {
    const id = `${q.subject}:${q.id}`;
    const options = Array.isArray(q.options) ? q.options : [];
    for (const [name, value] of [...LINE_FIELDS.map((f) => [f, q[f]]), ...options.map((o, i) => [`options[${i}]`, o])]) {
      if (typeof value === 'string' && value.includes('```figure')) problems.push(`${id} ${name}: a figure where only a line of text fits`);
    }
    for (const name of ['explain', 'passage']) {
      const text = q[name];
      if (typeof text !== 'string' || !text.includes('```figure')) continue;
      const blocks = splitBlocks(text);
      const drawn = blocks.filter((b) => b.type === 'figure');
      if (!drawn.length) { problems.push(`${id} ${name}: a \`\`\`figure fence that never closes`); continue; }
      figures += drawn.length;
      if (drawn.length > 1) problems.push(`${id} ${name}: ${drawn.length} figures; one figure carries one point`);
      if (name === 'explain' && q.type === 'match') problems.push(`${id} explain: a figure in a matching question's explanation, which its review cannot draw`);
      if (name === 'explain' && !(typeof q.explainSay === 'string' && q.explainSay.trim())) problems.push(`${id} explain: a figure needs the paragraph in explainSay, which the voice and the AI read instead`);
      // The question's own text: what the figure may draw from. A passage figure is the passage's data, so the
      // passage's prose around it (not the figure itself) counts, with the stem and explainSay.
      const prose = (t) => (typeof t === 'string' ? splitBlocks(t).filter((b) => b.type !== 'figure').map((b) => (b.type === 'text' ? b.text : [b.head, ...b.rows].map((r) => r.join(' ')).join('\n'))).join('\n') : '');
      const texts = [q.q, q.say, q.passage_title, prose(q.passage), q.explainSay].filter(Boolean).map(norm);
      const own = { texts, all: texts.join('\n') };
      const ownNums = numSet(texts.join('\n'));
      const tableNums = blocks.filter((b) => b.type === 'table').map((t) => new Set(t.rows.flat().flatMap((c) => figuresIn(c)).map(clean)));
      for (const b of drawn) {
        problems.push(...checkFigure(b.fig, q, own, ownNums, id, name));
        const mine = new Set(figureParts(b.fig).numbers.flatMap((s) => figuresIn(s)).map(clean));
        if (mine.size && tableNums.some((t) => [...mine].every((x) => t.has(x)))) problems.push(`${id} ${name}: the figure restates the table above it; keep one`);
      }
    }
  }
  return { problems, figures };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  const { problems, figures } = lintQuestionFigures(questions);
  if (problems.length) {
    console.error(`✗ question figures: ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
    for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`✓ question figures: ${figures} figure${figures === 1 ? '' : 's'}, each holding only what its question says`);
}
