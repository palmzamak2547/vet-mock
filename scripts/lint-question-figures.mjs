#!/usr/bin/env node
// ============================================================
// lint-question-figures.mjs — a figure shows only what the question holds
// ============================================================
// An explanation (or a passage) may carry one drawn figure, a ```figure block
// (src/lib/figure-spec.js). A figure is a second way of saying what the text
// already says, never a place for a new fact, so this fails on:
//   - a figure where only a line of text fits (a stem, an option, `say`,
//     `explainSay`, a model answer), or in a matching question's explanation;
//   - an explanation with a figure that keeps no paragraph in `explainSay`:
//     the voice, the coach and the AI read that paragraph and must never meet
//     the block;
//   - a figure that does not parse, an unknown kind, or one with more marks
//     than the eye takes in at once (about seven; eight bars);
//   - a figure, a number or a label that the question does not hold: every
//     number and every label must already be in the stem, `say`, the passage,
//     its title, the options or `explainSay`;
//   - a calc whose arithmetic does not give its result (to the result's own
//     decimals), an interval whose estimate is outside its bounds, a band
//     scale whose value falls in no band;
//   - more than one mark flagged as the answer, or a flagged mark that neither
//     the correct option nor the stem holds (the accent means "this answers");
//   - a figure that restates a table in the same text.
//
// Usage: node scripts/lint-question-figures.mjs
// ============================================================
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { splitBlocks } from '../src/lib/rich-blocks.js';
import { figuresIn } from '../src/lib/figure-spec.js';

const LINE_FIELDS = ['q', 'say', 'explainSay', 'model_answer', 'passage_title'];
const LIMIT = { twobytwo: 6, interval: 7, bars: 8, timeline: 7, flow: 7, scale: 5 };

const norm = (s) => String(s ?? '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const numSet = (s) => new Set(figuresIn(s).map((n) => n.replace(/,/g, '')));

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
  try { const v = sum(); return i === tokens.length ? v : null; } catch { return null; }
}
const agrees = (value, result) => {
  const r = String(result).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  if (value == null || !r) return false;
  const places = (r[0].split('.')[1] || '').length;
  return Math.abs(value - Number(r[0])) <= 0.5 * 10 ** -places + 1e-9;
};

/** Everything a figure says, as labels (words) and the marks it draws. */
export function figureParts(fig) {
  const labels = [];
  const numbers = [];
  const marks = [];
  const add = (...xs) => xs.forEach((v) => { if (v != null && String(v).trim()) labels.push(String(v)); });
  switch (fig.kind) {
    case 'twobytwo':
      add(...(fig.cols || []), ...(fig.rows || []).map((r) => r.label), fig.sum?.label, ...(fig.calcs || []).map((c) => c.label));
      for (const r of [...(fig.rows || []), ...(fig.sum ? [fig.sum] : [])]) numbers.push(...r.cells);
      for (const c of fig.calcs || []) { numbers.push(c.expr, ...c.mid, c.result); marks.push({ key: c.key, text: c.expr }); }
      break;
    case 'interval':
      add(...(fig.rows || []).map((r) => r.label), fig.note);
      numbers.push(fig.nil);
      for (const r of fig.rows || []) { numbers.push(...r.text); marks.push({ key: r.key, text: `${r.label} ${r.text[0]}` }); }
      break;
    case 'bars':
      add(...(fig.head || []), fig.unit, ...(fig.bars || []).map((b) => b.label));
      for (const b of fig.bars || []) { numbers.push(b.label, b.text); marks.push({ key: b.key, text: b.text, also: b.label }); }
      break;
    case 'timeline':
      add(fig.unit, fig.start, ...(fig.events || []).map((e) => e.label));
      for (const e of fig.events || []) { numbers.push(e.text); marks.push({ key: e.key, text: e.text, also: e.label }); }
      break;
    case 'flow':
      for (const l of fig.lanes || []) {
        add(l.title);
        marks.push({ key: l.key, text: l.title });
        for (const s of l.steps) { add(s.label, s.detail); numbers.push(s.no); marks.push({ key: s.key, text: s.label, also: s.detail }); }
      }
      break;
    case 'scale':
      add(...(fig.bands || []).map((b) => b.label), fig.value?.label);
      for (const b of fig.bands || []) { numbers.push(...b.text); marks.push({ key: b.key, text: b.label }); }
      numbers.push(fig.value?.text);
      break;
    default:
  }
  const markCount = { twobytwo: (fig.calcs || []).length + 4, interval: (fig.rows || []).length, bars: (fig.bars || []).length, timeline: new Set((fig.events || []).map((e) => e.at)).size + (fig.start ? 1 : 0), flow: (fig.lanes || []).reduce((n, l) => n + l.steps.length, 0), scale: (fig.bands || []).length + (fig.value ? 1 : 0) }[fig.kind] ?? 0;
  return { labels, numbers: numbers.filter((n) => n != null && n !== '').map(String), marks, markCount };
}

function checkFigure(fig, q, held, heldNums, id, name) {
  const out = [];
  const say = (m) => out.push(`${id} ${name} (${fig.kind}): ${m}`);
  for (const e of fig.errors) say(e);
  if (fig.errors.length && !LIMIT[fig.kind]) return out;
  const { labels, numbers, marks, markCount } = figureParts(fig);
  if (markCount > LIMIT[fig.kind]) say(`${markCount} marks; at most ${LIMIT[fig.kind]} read at a glance`);
  // Shape of each kind.
  if (fig.kind === 'twobytwo') {
    const n = (fig.cols || []).length;
    if ((fig.rows || []).length !== 2 || (n !== 2 && n !== 3)) say('two rows under two columns (and a third column of totals at most)');
    for (const r of [...(fig.rows || []), ...(fig.sum ? [fig.sum] : [])]) if (r.cells.length !== n) say(`row "${r.label}" has ${r.cells.length} cells under ${n} columns`);
    if (!(fig.calcs || []).length) say('a 2x2 figure ties at least one calc to its cells');
  }
  if (fig.kind === 'interval') {
    if (fig.nil == null) say('an interval names its no-difference value (null: 1 for a ratio, 0 for a difference)');
    for (const r of fig.rows || []) {
      if ([r.est, r.lo, r.hi].some((v) => v == null)) say(`row "${r.label}" is "label | estimate | lower | upper"`);
      else if (!(r.lo <= r.est && r.est <= r.hi)) say(`row "${r.label}": the estimate ${r.est} is outside ${r.lo} to ${r.hi}`);
    }
  }
  if (fig.kind === 'bars' && (fig.bars || []).some((b) => b.value == null || b.value < 0)) say('every bar is "label | value", a value of 0 or more');
  if (fig.kind === 'timeline' && (fig.events || []).some((e) => e.at == null)) say('every event is "time | label"');
  if (fig.kind === 'flow' && (fig.lanes || []).length > 2) say('at most two lanes, side by side on a phone');
  if (fig.kind === 'scale') {
    const v = fig.value?.value;
    if (v == null) say('a scale has one "value: label = number"');
    else if (!(fig.bands || []).some((b) => (b.lo == null || b.lo <= v) && (b.hi == null || v <= b.hi))) say(`the value ${v} falls in no band`);
    else if ((fig.bands || []).some((b) => b.key && !((b.lo == null || b.lo <= v) && (b.hi == null || v <= b.hi)))) say('the band marked as the answer does not hold the value');
  }
  // Arithmetic.
  for (const c of fig.calcs || []) {
    const steps = [c.expr, ...c.mid];
    for (const s of steps) if (!agrees(evaluate(s), c.result)) say(`"${c.label} = ${s}" does not give ${c.result}`);
  }
  // Nothing the question does not hold.
  for (const l of new Set(labels)) if (!held.includes(norm(l))) say(`the label "${l}" is not in the question (stem, passage, options, explainSay)`);
  const missing = [...new Set(numbers.flatMap((s) => figuresIn(s)).map((n) => n.replace(/,/g, '')))].filter((n) => !heldNums.has(n));
  if (missing.length) say(`shows ${missing.join(', ')}, which the question does not hold`);
  // The accent.
  const keys = marks.filter((m) => m.key);
  if (keys.length > 1) say(`${keys.length} marks flagged as the answer; one accent means one answer`);
  if (q.type === 'mcq' && Array.isArray(q.options) && keys.length === 1) {
    const truth = norm(`${q.options[q.answer] ?? ''}\n${q.say || ''}\n${q.q || ''}`);
    const k = keys[0];
    const hit = [k.text, k.also].filter(Boolean).some((t) => truth.includes(norm(t)) || figuresIn(t).some((n) => numSet(truth).has(n.replace(/,/g, ''))));
    if (!hit) say(`the mark flagged as the answer ("${k.text}") is in neither the correct option nor the stem`);
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
    const held = norm([q.q, q.say, q.passage_title, q.passage, ...options, q.explainSay].filter(Boolean).join('\n'));
    const heldNums = numSet([q.q, q.say, q.passage_title, q.passage, ...options, q.explainSay].filter(Boolean).join('\n'));
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
      // In a passage the figure is the data, so the passage itself does not hold it.
      const own = name === 'passage' ? norm([q.q, q.say, ...options, q.explainSay].filter(Boolean).join('\n')) : held;
      const ownNums = name === 'passage' ? numSet([q.q, q.say, ...options, q.explainSay, q.explain].filter(Boolean).join('\n')) : heldNums;
      const tableNums = blocks.filter((b) => b.type === 'table').map((t) => new Set(t.rows.flat().flatMap((c) => figuresIn(c)).map((n) => n.replace(/,/g, ''))));
      for (const b of drawn) {
        problems.push(...checkFigure(b.fig, q, name === 'passage' ? `${own}\n${norm(q.passage_title)}` : own, ownNums, id, name));
        const mine = new Set(figureParts(b.fig).numbers.flatMap((s) => figuresIn(s)).map((n) => n.replace(/,/g, '')));
        if (mine.size && tableNums.some((t) => [...mine].every((n) => t.has(n)))) problems.push(`${id} ${name}: the figure restates the table above it; keep one`);
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
