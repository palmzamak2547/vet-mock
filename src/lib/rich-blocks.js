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

/**
 * The passage a reader of `wholeStem(q)` still needs: none when `say` holds the whole sentence
 * (its numbers would be said twice), else the passage itself. The wrong-answer coach shows it to
 * the model, and its footer names it, by this one rule.
 */
export const passageBesideStem = (q) => {
  if (typeof q?.say === 'string' && q.say) return '';
  return typeof q?.passage === 'string' ? q.passage.trim() : '';
};

/**
 * The explanation as one paragraph. An explanation laid out as steps, lines and a table for the eye
 * keeps the paragraph it was written as in `explainSay`; for every other question it is `explain`.
 * The voice reads it (in the card and in the clip generator alike, so a recorded clip keeps its name),
 * and so does whatever shows an explanation to a model: the coach, the AI's corpus, the evidence build.
 */
export const wholeExplain = (q) => (typeof q?.explainSay === 'string' && q.explainSay ? q.explainSay : q?.explain || '');

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

// ============================================================
// Prose typeset as blocks (15 Nov 2026)
// ============================================================
// A stem or an explanation is stored as its writer recorded it: lines of
// plain text. Drawn as equal lines, the story, a run of lab values, the
// results of a test, a numbered list and the question itself all looked
// alike, and the question was the last of sixteen equal lines.
//
// proseBlocks cuts a run of prose into typed blocks and changes no character:
//   para     one or more lines; a blank line ends it
//   pairs    3 or more lines "label: value | range", or 3 or more lines
//            "label: value", never the two mixed
//   results  2 or more lines that end in a result in brackets, "Fetlock (Negative)"
//   list     2 or more lines that open with the same kind of marker:
//            1.  1)  ก.  ก)  a.  a)  -  •  —
//   ask      a stem's last line, when it is the question (splitStem)
// A short line directly above a pairs or results block ("Flexion test"), or a
// sentence there that ends in ดังนี้ / ดังต่อไปนี้ / ":", is that block's `lead`.
//
// Every block has start and end offsets in the text, and they meet: the first
// starts at 0, each starts where the one before ends, the last ends at the
// text's length (the newlines after a block's last line belong to it). So the
// slices joined give the text back character for character, and a line's
// parts joined give the line. When in doubt a line is para: a wrong guess
// costs nothing, because the words are the same either way.
// ============================================================

// RBC (10⁶/μl): 5.1 | 6.0–12.0
const LAB_LINE = /^(\S[^:|\n]{0,59}?)(\s*:\s+)([^|\s][^|\n]*?)(\s+\|\s+)([^|\s][^|\n]*)$/;
// Heart rate: 100 BPM
const KEY_LINE = /^(\S[^:|\n]{0,39}?)(\s*:\s+)(\S[^|\n]*)$/;
// Fetlock (Negative)
// The bracket holds a result word, not any word: a sentence that ends in a
// remark in brackets ("renal tubular damage (ชัด)") stays a sentence.
const RESULT_LINE = /^(\S.{0,59}?)(\s+)(\((?:negative|positive|normal|abnormal|neg|pos|ปกติ|ผิดปกติ|พบ|ไม่พบ|บวก|ลบ|\+|-)\))(\s*)$/i;
// 1. item, 1) item, ก. item, a) item, - item, • item, — item
const LIST_LINE = /^(\s*)(\d{1,2}[.)]|[ก-ฮ][.)]|[A-Za-z][.)]|[-•—])(\s+)(\S.*)$/;
// A number marker may sit on its word ("4.ตรวจ"), as long as no digit follows ("1.5 mg" is a figure).
const NUMBER_TIGHT = /^(\s*)(\d{1,2}[.)])()([^\s\d].*)$/;
// The order letters run in. A letter list starts at a, A or ก and goes on in this order: two lines that both
// open with "C. " (a genus initial, "C. parvum") are not a list.
const THAI_ORDER = 'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
const LATIN_ORDER = 'abcdefghijklmnopqrstuvwxyz';
const ordinal = (marker) => {
  const m = marker.trim().slice(0, -1);
  if (/^\d+$/.test(m)) return Number(m);
  if (/^[A-Za-z]$/.test(m)) return LATIN_ORDER.indexOf(m.toLowerCase());
  return THAI_ORDER.indexOf(m);
};
// A run of numbered or lettered lines is a list only when its markers count on by one (a letter list from its
// first letter); a run is all or nothing, so a line that breaks the count leaves the whole run as plain lines.
const inSequence = (lines) => {
  const first = lines[0].parts.marker;
  if (/^[-•—]$/.test(first)) return true;
  const start = ordinal(first);
  if (start < 0 || (!/^\d/.test(first) && start !== 0)) return false;
  return lines.every((l, k) => ordinal(l.parts.marker) === start + k);
};
// A line that only carries on from the one above ("→ MD ไม่ได้แพร่ ...") never leads a block.
const CARRIES_ON = /^(?:[→⇒➜➔↳=]|->|=>)/;
const LEAD_END = /(?:ดังนี้|ดังต่อไปนี้|:)\s*(?:\([^()\n]*\))?\s*$/;
const LETTER = /[A-Za-zก-ฮ]/;
const LEAD_SHORT = 32;
const LEAD_LABEL = 40;
// A line that asks: it ends in a question mark, or holds a question word.
// Words are matched as words: จง only as a command (จงระบุ, never จงอาง), a Thai question word only where it ends
// a word, an English command only where it opens the line ("Problem list: anorexia" does not ask).
const ASKS = new RegExp([
  '[?？]\\s*$',
  '(?:^|\\s)จง(?:ระบุ|เรียง|บอก|อธิบาย|เขียน|ตอบ|หา|คำนวณ|วินิจฉัย|เลือก|ยกตัวอย่าง|เติม|จับคู่|แปลผล|สรุป|เปรียบเทียบ|พิจารณา|วาด)',
  // Whole words that only ever ask ("ข้อใดถูก" runs on into the next word, as Thai does) ...
  'อะไร|ข้อใด|อย่างไร|เท่าไร|เท่าใด',
  // ... and short ones that ask only where they end a word ("ที่ไหนมาก่อน" is narrative).
  '(?:หรือไม่|ไหน|ใด)(?=\\s|$|[?？)]|บ้าง)',
  'ตอบไม่เกิน',
  '\\b(?:what|which|how|why|who|when|where)\\b',
  '^\\s*(?:name|list|identify|describe|give|state)\\b',
].join('|'), 'i');
const ASK_LONGEST = 200;
const MIN_RUN = { lab: 3, key: 3, result: 2, list: 2 };

const markerKind = (m) => {
  if (/^\d/.test(m)) return `n${m.slice(-1)}`;
  if (/^[ก-ฮ]/.test(m)) return `t${m.slice(-1)}`;
  if (/^[A-Za-z]/.test(m)) return `l${m.slice(-1)}`;
  return m;
};

/** What one line reads as, with its parts (joined, they are the line). */
export function lineShape(text) {
  if (!text.trim()) return { kind: 'blank' };
  let m = LIST_LINE.exec(text) || NUMBER_TIGHT.exec(text);
  if (m) return { kind: 'list', run: `list:${markerKind(m[2])}`, parts: { indent: m[1], marker: m[2], gap: m[3], body: m[4] } };
  m = LAB_LINE.exec(text);
  if (m && LETTER.test(m[1])) return { kind: 'lab', run: 'lab', parts: { label: m[1], sep: m[2], value: m[3], bar: m[4], range: m[5] } };
  m = KEY_LINE.exec(text);
  if (m && LETTER.test(m[1])) return { kind: 'key', run: 'key', parts: { label: m[1], sep: m[2], value: m[3] } };
  m = RESULT_LINE.exec(text);
  if (m) return { kind: 'result', run: 'result', parts: { label: m[1], gap: m[2], result: m[3], tail: m[4] } };
  return { kind: 'text' };
}

const TYPE = { lab: 'pairs', key: 'pairs', result: 'results', list: 'list' };

/**
 * [{ type: 'para' | 'pairs' | 'results' | 'list', start, end, lines, lead? }]
 * lines: [{ text, start, end, parts? }]; a pairs block also says `range`
 * (true when its lines carry "| range"). See the head of this section.
 */
export function proseBlocks(text) {
  const str = text == null ? '' : String(text);
  const lines = [];
  let pos = 0;
  for (const t of str.split('\n')) { lines.push({ text: t, start: pos, end: pos + t.length }); pos += t.length + 1; }
  const shapes = lines.map((l) => lineShape(l.text));
  // A list run whose markers do not count on is plain lines, every line of it.
  for (let a = 0; a < lines.length;) {
    let b = a + 1;
    if (shapes[a].kind === 'list') while (b < lines.length && shapes[b].run === shapes[a].run) b++;
    if (shapes[a].kind === 'list' && b - a >= MIN_RUN.list && !inSequence(shapes.slice(a, b))) {
      for (let k = a; k < b; k++) shapes[k] = { kind: 'text' };
    }
    a = b;
  }
  // How many lines from i on share line i's run.
  const runLen = new Array(lines.length).fill(0);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!shapes[i].run) continue;
    runLen[i] = i + 1 < lines.length && shapes[i + 1].run === shapes[i].run ? runLen[i + 1] + 1 : 1;
  }
  const runAt = (i) => shapes[i].run && runLen[i] >= MIN_RUN[shapes[i].kind];
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    if (shapes[i].kind === 'blank') { i++; continue; }
    if (runAt(i)) {
      const n = runLen[i];
      const kind = shapes[i].kind;
      const block = {
        type: TYPE[kind],
        lines: lines.slice(i, i + n).map((l, k) => ({ ...l, parts: shapes[i + k].parts })),
        from: i,
      };
      if (kind === 'lab') block.range = true;
      // The line just above, when it introduces this block, is its lead.
      const prev = blocks[blocks.length - 1];
      if ((block.type === 'pairs' || block.type === 'results') && prev?.type === 'para' && prev.to === i - 1) {
        const above = prev.lines[prev.lines.length - 1];
        const said = above.text.trim();
        if (!CARRIES_ON.test(said) && (said.length <= LEAD_SHORT || LEAD_END.test(said))) {
          // Only a short label ("Flexion test") is set apart in weight; a sentence that
          // leads in stays regular, so nothing the paper did not emphasise reads as a clue.
          block.lead = { ...above, label: said.length <= LEAD_LABEL };
          block.from = i - 1;
          prev.lines.pop();
          prev.to = i - 2;
          if (!prev.lines.length) blocks.pop();
        }
      }
      block.to = i + n - 1;
      blocks.push(block);
      i += n;
      continue;
    }
    const from = i;
    const para = [];
    while (i < lines.length && shapes[i].kind !== 'blank' && (i === from || !runAt(i))) para.push(lines[i++]);
    blocks.push({ type: 'para', lines: para, from, to: i - 1 });
  }
  if (!blocks.length) return [{ type: 'para', start: 0, end: str.length, lines: [] }];
  return blocks.map((b, k) => {
    const { from, to, ...rest } = b;
    const start = k === 0 ? 0 : (b.lead || b.lines[0]).start;
    const next = blocks[k + 1];
    const end = next ? (next.lead || next.lines[0]).start : str.length;
    return { ...rest, start, end };
  });
}

/** The lines a block draws, as one string (its slice without the trailing newlines). */
export const blockText = (text, block) => {
  const first = block.lead || block.lines[0];
  const last = block.lines[block.lines.length - 1] || first;
  return first ? String(text).slice(first.start, last.end) : '';
};

/** True when a text draws as anything but one paragraph of its own lines. */
export const isTypeset = (text) => {
  const blocks = proseBlocks(text);
  return blocks.length > 1 || blocks[0].type !== 'para';
};

/**
 * A long stem cut into its body and its ask. When a stem has 4 or more lines
 * that hold words, and its last one is not part of a run and reads as the
 * question (a question mark or a question word, in at most 200 characters),
 * that last line is the ask: it alone is the card's heading, and everything
 * above it is the stem body, drawn as blocks. A stem that asks first and
 * gives the case after it (its first line asks too), or ends on its data, is
 * not cut: a paragraph of findings must not become the heading. Every other stem gives null and is
 * drawn as it always was.
 * { body: blocks, ask: { type: 'ask', start, end, lines }, bodyText, askText }
 */
export function splitStem(text) {
  const str = text == null ? '' : String(text);
  if (!str.includes('\n')) return null;
  const blocks = proseBlocks(str);
  const count = blocks.reduce((n, b) => n + b.lines.length + (b.lead ? 1 : 0), 0);
  if (count < 4) return null;
  const last = blocks[blocks.length - 1];
  if (last.type !== 'para' || !last.lines.length) return null;
  const line = last.lines[last.lines.length - 1];
  if (line.text.trim().length > ASK_LONGEST || !ASKS.test(line.text)) return null;
  // A stem that asks on its first line too gives its question first: its last line is data, not the ask.
  const opening = blocks[0].lead || blocks[0].lines[0];
  if (opening && opening !== line && ASKS.test(opening.text)) return null;
  const body = blocks.slice(0, -1);
  if (last.lines.length > 1) body.push({ ...last, lines: last.lines.slice(0, -1), end: line.start });
  if (!body.length) return null;
  const ask = { type: 'ask', start: line.start, end: str.length, lines: [line] };
  return { body, ask, bodyText: str.slice(0, line.start), askText: str.slice(line.start) };
}
