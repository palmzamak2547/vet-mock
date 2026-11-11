#!/usr/bin/env node
// ============================================================
// lint-question-tables.mjs — a table in the bank is one the card can draw
// ============================================================
// A passage or an explanation may hold a table (src/lib/rich-blocks.js). The
// card draws what parses and shows the rest as typed, so a table with a
// missing rule line or an uneven row would reach a student as bars and
// dashes. This fails on:
//   - a table, or a line that reads as a table row, in a stem, an option, a
//     model answer or a passage title (they sit in a heading or a button);
//   - a table in the explanation of a matching question (its review cuts the
//     explanation into sections and titles each from its first words);
//   - a table row in a passage or an explanation that no table holds: the
//     |---| line is missing, a blank line splits the table, a row lost its
//     opening or closing bar, or the whole table was typed without outer bars;
//   - a row whose cells do not match its header, a table with under 2 or
//     over 6 columns, a header with no words;
//   - a passage table with no sentence right above it saying what it is;
//   - a spoken stem (`say`, the sentence a voice reads where the numbers moved
//     out of the stem into a passage table) on a question with no such table,
//     one whose figures are not the figures on screen (title, passage, stem):
//     the voice would say a figure the student cannot see, or stay silent on
//     one they can; or one that no longer ends as the stem ends;
//   - a spoken explanation (`explainSay`, the paragraph an explanation was
//     written as before it was laid out as steps) that says a figure the
//     explanation on screen does not show, or an explanation that shows a
//     figure neither its paragraph nor the question holds.
//
// A formula between bars is not a row: |x − μ| and |0.39 − 0.04| = |−0.35|
// have no space inside their bars, and a row does ("| a | b |").
//
// Usage: node scripts/lint-question-tables.mjs
// ============================================================
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { splitBlocks, tableCells } from '../src/lib/rich-blocks.js';

const MAX_COLUMNS = 6;   // the card's limit; a phone shows three or four without scrolling (standard C5)
const ASK_TAIL = 15;     // characters at the end of a stem that must also end its spoken sentence
const BLOCK_FIELDS = ['passage', 'explain'];

const bars = (line) => (line.match(/(?<!\\)\|/g) || []).length;
// A row as a writer types it: bars around at least two cells, a space (or an empty cell) inside the outer bars.
const rowish = (line) => bars(line) >= 3 && /^\s*\|[\s|]/.test(line) && /[\s|]\|\s*$/.test(line);
// The |---| line typed without its outer bars: "---|---".
const bareRule = (line) => /^\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+$/.test(line);

// Every figure of a text, once: 1,200 and 0.39 are one figure each, and a comma that ends a clause is not part of one.
const numbersOf = (s) => new Set((String(s).match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => n.replace(/,$/, '')));

const inlineFields = (q) => [
  ['q', q.q],
  ['model_answer', q.model_answer],
  ['say', q.say],
  ['explainSay', q.explainSay],
  ['passage_title', q.passage_title],
  ...(Array.isArray(q.options) ? q.options.map((o, i) => [`options[${i}]`, o]) : []),
];

export function lintQuestionTables(questions) {
  const problems = [];
  let tables = 0;
  for (const q of questions) {
    const id = `${q.subject}:${q.id}`;
    for (const [name, value] of inlineFields(q)) {
      if (typeof value !== 'string' || !value.includes('|')) continue;
      if (splitBlocks(value).some((b) => b.type === 'table') || value.split('\n').some((l) => rowish(l) || bareRule(l))) {
        problems.push(`${id} ${name}: a table row where only a line of text fits; put the data in the passage`);
      }
    }
    if (q.say != null) {
      const data = typeof q.passage === 'string' && splitBlocks(q.passage).some((b) => b.type === 'table');
      if (typeof q.say !== 'string' || !q.say.trim() || q.say === q.q) problems.push(`${id} say: the sentence a voice reads, a text that differs from the stem`);
      else if (!data) problems.push(`${id} say: only a question whose passage holds a table has a spoken stem`);
      else {
        // A set of figures, typed alike on both sides (1,200 is not 1200): it catches a figure dropped or
        // added, not two cells swapped. A reviewer still reads each table against its sentence.
        const [said, shown] = [numbersOf(q.say), numbersOf(`${q.passage_title || ''}\n${q.passage}\n${q.q}`)];
        const unsaid = [...shown].filter((n) => !said.has(n));
        const unseen = [...said].filter((n) => !shown.has(n));
        if (unsaid.length) problems.push(`${id} say: the voice never says ${unsaid.join(', ')}, which the title, the passage or the stem shows`);
        if (unseen.length) problems.push(`${id} say: the voice says ${unseen.join(', ')}, which the screen does not show`);
        // `say` and the stem are two copies of what is asked: an edit to one that misses the other would
        // leave the voice, a recorded clip and the wrong-answer coach on the old question.
        if (!q.say.trim().endsWith(String(q.q || '').trim().slice(-ASK_TAIL))) problems.push(`${id} say: the stem's last words are not the last words of \`say\`; they ask the same thing, so edit both`);
      }
    }
    // An explanation laid out as steps keeps the paragraph it was written as (`explainSay`): the voice, the
    // coach and the AI's corpus read that paragraph. The two say the same thing, so no figure of the
    // paragraph may be missing on screen, and the screen may add none the question does not hold.
    if (q.explainSay != null) {
      if (typeof q.explainSay !== 'string' || !q.explainSay.trim() || q.explainSay === q.explain) problems.push(`${id} explainSay: the paragraph a voice reads, a text that differs from the explanation`);
      else if (typeof q.explain !== 'string' || !q.explain.trim()) problems.push(`${id} explainSay: only an explanation keeps a paragraph`);
      else {
        const [said, shown] = [numbersOf(q.explainSay), numbersOf(q.explain)];
        const held = numbersOf([q.explainSay, q.q, q.passage, q.passage_title, ...(Array.isArray(q.options) ? q.options : [])].filter(Boolean).join('\n'));
        const unshown = [...said].filter((n) => !shown.has(n));
        const brought = [...shown].filter((n) => !held.has(n));
        if (unshown.length) problems.push(`${id} explainSay: the voice says ${unshown.join(', ')}, which the explanation on screen does not show`);
        if (brought.length) problems.push(`${id} explain: shows ${brought.join(', ')}, which neither its paragraph nor the question holds`);
      }
    }
    for (const name of BLOCK_FIELDS) {
      const text = q[name];
      if (typeof text !== 'string' || !text.includes('|')) continue;
      const found = splitBlocks(text).filter((b) => b.type === 'table');
      tables += found.length;
      if (found.length && name === 'explain' && q.type === 'match') problems.push(`${id} explain: a table in a matching question's explanation, which its review cannot draw`);
      if (name === 'passage') {
        const blocks = splitBlocks(text);
        if (blocks.some((b, i) => b.type === 'table' && blocks[i - 1]?.type !== 'text')) problems.push(`${id} passage: a table with no sentence above it; say in one line what the table is`);
      }
      const lines = text.split('\n');
      const starts = [];
      let at = 0;
      for (const line of lines) { starts.push(at); at += line.length + 1; }
      const inTable = (i) => found.some((t) => starts[i] >= t.start && starts[i] < t.end);
      lines.forEach((line, i) => {
        if (inTable(i)) return;
        const shown = line.trim().slice(0, 60);
        if (bareRule(line)) problems.push(`${id} ${name}: a table typed without its outer bars: ${shown}`);
        else if (rowish(line)) problems.push(`${id} ${name}: a table row no table holds (missing the |---| line under the header, or a blank line inside): ${shown}`);
        // A row that lost a bar sits right against a table and still starts or ends like one.
        else if (i > 0 && inTable(i - 1) && /^\s*\|/.test(line)) problems.push(`${id} ${name}: a row that lost its closing bar: ${shown}`);
        else if (i + 1 < lines.length && inTable(i + 1) && bars(line) >= 2 && /\|\s*$/.test(line)) problems.push(`${id} ${name}: a row that lost its opening bar: ${shown}`);
      });
      for (const t of found) {
        const rows = text.slice(t.start, t.end).split('\n');
        const n = t.head.length;
        if (n < 2 || n > MAX_COLUMNS) problems.push(`${id} ${name}: a table of ${n} columns (2 to ${MAX_COLUMNS})`);
        if (!t.head.some(Boolean)) problems.push(`${id} ${name}: a table whose header is empty`);
        rows.slice(2).forEach((line, r) => {
          const cells = tableCells(line.trim());
          if (cells.length !== n) problems.push(`${id} ${name}: row ${r + 1} has ${cells.length} cells under a header of ${n}`);
          else if (!cells.some(Boolean)) problems.push(`${id} ${name}: row ${r + 1} is empty`);
        });
      }
    }
  }
  return { problems, tables };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  const { problems, tables } = lintQuestionTables(questions);
  if (problems.length) {
    console.error(`✗ question tables: ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
    for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`✓ question tables: ${tables} table${tables === 1 ? '' : 's'}, all drawn as tables`);
}
