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
//   - a table row in a passage or an explanation that no table holds;
//   - a row whose cells do not match its header, a table with under 2 or
//     over 6 columns, a header with no words.
//
// Usage: node scripts/lint-question-tables.mjs
// ============================================================
import { pathToFileURL } from 'node:url';
import { bankFiles, readBank } from './lib/bank-file.mjs';
import { isTableRow, splitBlocks, tableCells } from '../src/lib/rich-blocks.js';

const MAX_COLUMNS = 6;   // what a phone shows without scrolling far
const BLOCK_FIELDS = ['passage', 'explain'];

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
      if (typeof value !== 'string') continue;
      if (value.split('\n').some(isTableRow)) problems.push(`${id} ${name}: a table row where only a line of text fits; put the data in the passage`);
    }
    for (const name of BLOCK_FIELDS) {
      const text = q[name];
      if (typeof text !== 'string' || !text.includes('|')) continue;
      const found = splitBlocks(text).filter((b) => b.type === 'table');
      tables += found.length;
      let at = 0;
      for (const line of text.split('\n')) {
        const start = at;
        at += line.length + 1;
        if (isTableRow(line) && !found.some((t) => start >= t.start && start < t.end)) {
          problems.push(`${id} ${name}: a table row no table holds (missing the |---| line under the header, or a blank line inside): ${line.trim().slice(0, 60)}`);
        }
      }
      for (const t of found) {
        const lines = text.slice(t.start, t.end).split('\n');
        const n = t.head.length;
        if (n < 2 || n > MAX_COLUMNS) problems.push(`${id} ${name}: a table of ${n} columns (2 to ${MAX_COLUMNS})`);
        if (!t.head.some(Boolean)) problems.push(`${id} ${name}: a table whose header is empty`);
        lines.slice(2).forEach((line, r) => {
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
