// ============================================================
// rich-blocks.js — a table inside a passage or an explanation
// ============================================================
// Palm, 11 Nov 2026: "บางข้อ Epidem ทำเป็นตารางให้อ่านง่ายได้". A 2x2 written as
// a sentence makes the student build the table in their head before the
// question starts.
//
// A passage or an explanation may hold a table, in the form the summaries
// already use:
//
//   | | เพาะเชื้อบวก | เพาะเชื้อลบ |
//   |---|---|---|
//   | ELISA บวก | 102 | 40 |
//
// splitBlocks cuts a text into its runs of prose and the tables between them,
// each with its offsets in the text (SmartPassage keeps highlights by offset).
// A text with no table comes back as one block holding the same string, so
// everything written before this renders exactly as it did.
//
// A stem and an option never hold a table: they sit in a heading and in a
// button. scripts/lint-question-tables.mjs holds the bank to that, and to
// tables that parse.
// ============================================================

const ROW = /^[^\S\n]*\|.*\|[^\S\n]*$/;
const RULE = /^[^\S\n]*\|(?:[^\S\n]*:?-{3,}:?[^\S\n]*\|)+[^\S\n]*$/;

/** A line that reads as a table row, whether or not a table holds it. */
export const isTableRow = (line) => ROW.test(line);

/** One table row to its cells. "\|" is a pipe inside a cell, the GFM escape. */
export function tableCells(row) {
  const cells = [];
  let cell = '';
  for (let k = 0; k < row.length; k++) {
    if (row[k] === '\\' && row[k + 1] === '|') { cell += '|'; k++; }
    else if (row[k] === '|') { cells.push(cell.trim()); cell = ''; }
    else cell += row[k];
  }
  cells.push(cell.trim());
  return cells.slice(1, -1);
}

// A row shorter than the header is padded; a longer one keeps its extra cells
// in the last column, so nothing a writer typed is dropped from the screen.
function fit(cells, n) {
  if (cells.length <= n) return [...cells, ...Array(n - cells.length).fill('')];
  return [...cells.slice(0, n - 1), cells.slice(n - 1).join(' | ')];
}

/**
 * [{ type: 'text', text, start, end } | { type: 'table', head, rows, start, end }]
 * in reading order. start and end are offsets in `text`; the newlines that set
 * a table apart from the prose belong to neither.
 */
export function splitBlocks(text) {
  const str = text == null ? '' : String(text);
  const whole = [{ type: 'text', text: str, start: 0, end: str.length }];
  if (!str.includes('|') || !str.includes('---')) return whole;
  const lines = str.split('\n');
  const at = [];
  let pos = 0;
  for (const line of lines) { at.push(pos); pos += line.length + 1; }
  const blocks = [];
  let from = 0;
  const prose = (to) => {
    let a = from;
    let b = to;
    while (a < b && str[a] === '\n') a++;
    while (b > a && str[b - 1] === '\n') b--;
    if (b > a) blocks.push({ type: 'text', text: str.slice(a, b), start: a, end: b });
  };
  for (let i = 0; i < lines.length - 1; i++) {
    if (!ROW.test(lines[i]) || !RULE.test(lines[i + 1])) continue;
    const head = tableCells(lines[i].trim());
    if (tableCells(lines[i + 1].trim()).length !== head.length) continue;
    const rows = [];
    let j = i + 2;
    while (j < lines.length && ROW.test(lines[j]) && !RULE.test(lines[j])) {
      rows.push(fit(tableCells(lines[j].trim()), head.length));
      j++;
    }
    if (!rows.length) continue;
    prose(at[i]);
    const end = at[j - 1] + lines[j - 1].length;
    blocks.push({ type: 'table', head, rows, start: at[i], end });
    from = Math.min(str.length, end + 1);
    i = j - 1;
  }
  if (!blocks.length) return whole;
  prose(str.length);
  return blocks;
}

/**
 * The question as one sentence that holds its own data. A question whose
 * numbers were moved out of the stem into a passage table keeps the sentence
 * that says them in `say`; for every other question it is the stem. Whatever
 * meets a question without its passage asks here:
 *   - the voice (a passage is not read aloud), in the card and in the clip
 *     generator alike, so both name the same clip and a recorded one is kept;
 *   - the screens that draw a stem and options and nothing else (the daily
 *     question, the race, the share card), and the AI's question corpus;
 *   - the wrong-answer coach and the evidence build, which show it to a model;
 *   - what compares questions by their words: duplicates, recurrence, the
 *     gentle order of a practice set.
 */
export const wholeStem = (q) => (typeof q?.say === 'string' && q.say ? q.say : q?.q || '');

/** A passage that is the question's data rather than a text to read. */
export const hasTable = (text) => splitBlocks(text).some((b) => b.type === 'table');

/**
 * A passage's blocks with its highlights laid in (SmartPassage): each run of
 * prose becomes segments, { text } or { text, hl }, and a table stays a table.
 * A highlight is { start, end, ... } in offsets of `text`, so it never depends
 * on how a block is drawn: one that spans a table marks the prose on both
 * sides. Where two overlap, the earlier keeps its span.
 */
export function highlightParts(text, highlights = []) {
  if (!text) return [];
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  return splitBlocks(text).map((block) => {
    if (block.type === 'table') return block;
    const segs = [];
    let cursor = block.start;
    for (const hl of sorted) {
      const start = Math.max(hl.start, cursor);
      const end = Math.min(hl.end, block.end);
      if (end <= start) continue;   // outside this run, or already covered
      if (start > cursor) segs.push({ text: text.slice(cursor, start) });
      segs.push({ text: text.slice(start, end), hl });
      cursor = end;
    }
    if (cursor < block.end) segs.push({ text: text.slice(cursor, block.end) });
    return { ...block, segs };
  });
}

// Read aloud, a table is one sentence a row, each value after its column's
// name and a pause: "ELISA บวก, เพาะเชื้อบวก: 102, เพาะเชื้อลบ: 40". A header
// with an empty first cell means the first column names the rows. A cell that
// holds only a dash says nothing; a tick or a cross says yes or no, in the
// language of the text around the table (a voice reads a bare "×" as "times").
const TICK = /^[✓✔]$/u;
const CROSS = /^[×✗✘]$/u;
const DASH = /^[-–—]+$/;
function tableSpeech({ head, rows }, thai) {
  const named = head[0] === '';
  const say = (cell) => (TICK.test(cell) ? (thai ? 'ใช่' : 'yes') : CROSS.test(cell) ? (thai ? 'ไม่ใช่' : 'no') : cell);
  return rows.map((row) => {
    const said = row
      .map((cell, k) => (cell && !DASH.test(cell) && !(named && k === 0) ? `${head[k] ? `${head[k]}: ` : ''}${say(cell)}` : ''))
      .filter(Boolean)
      .join(', ');
    return named && row[0] ? `${row[0]}, ${said}` : said;
  }).join('\n');
}

/** The text a voice reads: tables as sentences, everything else unchanged.
 *  A text with no table is returned as it came (the same string). */
export function tablesToSpeech(text) {
  const blocks = splitBlocks(text);
  if (blocks.length === 1 && blocks[0].type === 'text') return text == null ? '' : String(text);
  const thai = /[฀-๿]/.test(String(text));
  return blocks.map((b) => (b.type === 'table' ? tableSpeech(b, thai) : b.text)).join('\n');
}
