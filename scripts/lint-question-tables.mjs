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
//     over 6 columns, a header with no words.
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
const BLOCK_FIELDS = ['passage', 'explain'];

const bars = (line) => (line.match(/(?<!\\)\|/g) || []).length;
// A row as a writer types it: bars around at least two cells, a space (or an empty cell) inside the outer bars.
const rowish = (line) => bars(line) >= 3 && /^\s*\|[\s|]/.test(line) && /[\s|]\|\s*$/.test(line);
// The |---| line typed without its outer bars: "---|---".
const bareRule = (line) => /^\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+$/.test(line);

const inlineFields = (q) => [
  ['q', q.q],
  ['model_answer', q.model_answer],
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
    for (const name of BLOCK_FIELDS) {
      const text = q[name];
      if (typeof text !== 'string' || !text.includes('|')) continue;
      const found = splitBlocks(text).filter((b) => b.type === 'table');
      tables += found.length;
      if (found.length && name === 'explain' && q.type === 'match') problems.push(`${id} explain: a table in a matching question's explanation, which its review cannot draw`);
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
