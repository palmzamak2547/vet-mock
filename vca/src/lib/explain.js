// An explanation as the pages show it.
//
// The bank writes explanations with emoji bullets: a bulb before the takeaway, a cross before the
// options that are wrong, a warning sign, a tick box. It also writes a heading line, "ทำไมข้ออื่นผิด",
// above the reasons the other options fail. The site draws no emoji, and a heading is a label like
// the "ทำไม" that heads the box, not a sentence in the middle of it.
//
// cleanExplain() takes the text as the bank holds it (which belongs to the main app and is never
// edited) and returns blocks to draw: text, and labels. Every word is kept; only the markers go.
// The ✓ and ✗ marks stay: they are plain text that says which option is right, not emoji.
//
// Nothing here uses a look-behind: this file ships to phones (see emoji.js).

import { EMOJI_SOURCE } from './emoji.js';

const PICTURE = `(?:${EMOJI_SOURCE})`;

// Pictures at the start of a line, with the bullet in front of them if the line has one.
const LEADING = new RegExp(`^(\\s*(?:[•*–—-]\\s+)?)(?:${PICTURE}\\s*)+`, 'u');
// A picture anywhere else, with the blanks around it.
const MIDDLE = new RegExp(`[ \\t]*(?:${PICTURE}[ \\t]*)+`, 'gu');

// The headings the bank writes over the other options. A tick or a cross may stand in for the
// picture, and a colon may follow.
const HEADING = '(?:ทำไม)?ข้ออื่น(?:ผิด|ถูก)?';
const HEADING_LINE = new RegExp(`^\\s*(?:${PICTURE}|[✗✘✓✔×])?\\s*(${HEADING})\\s*[:：]?\\s*$`, 'u');
// Five explanations run the heading into the line: "... sentence ❌ ทำไมข้ออื่นผิด — reason — reason".
const HEADING_INLINE = new RegExp(`\\s+(?:${PICTURE}\\s*)+(ทำไมข้ออื่น(?:ผิด|ถูก))(?=\\s*[—–:-])`, 'u');

const OPENERS = /[([{"“‘']$/;
const CLOSERS = /^[:;,.!?)\]}]/;

/** A line without its picture markers. */
function tidy(line) {
  const s = line.replace(LEADING, '$1').replace(MIDDLE, (blanks, at, whole) => {
    const before = whole.slice(0, at);
    const after = whole.slice(at + blanks.length);
    // Between two words the picture leaves one space; at an edge, or against a bracket or a
    // colon, it leaves none.
    const between = /\S$/.test(before) && /^\S/.test(after) && !OPENERS.test(before) && !CLOSERS.test(after);
    return between && /\s/.test(blanks) ? ' ' : '';
  });
  return s.replace(/[ \t]+$/, '');
}

/**
 * @param {unknown} text an explanation as the bank holds it
 * @returns {{ kind: 'text'|'label', text: string }[]}
 *   Text blocks keep their line breaks; a label stands on a line of its own. The blank line that
 *   sat above a heading stays at the end of the text before it.
 */
export function cleanExplain(text) {
  if (text === null || text === undefined) return [];
  const blocks = [];
  let run = [];

  // The lines gathered so far become one text block. When a label follows, the line break that
  // separates them is kept, so a blank line above the heading stays a blank line.
  const flush = (labelFollows) => {
    let body = run.join('\n');
    run = [];
    body = body.replace(/^\n+/, '');
    if (!labelFollows) body = body.replace(/\s+$/, '');
    if (body.trim()) blocks.push({ kind: 'text', text: labelFollows ? `${body}\n` : body });
  };

  for (const line of String(text).replace(/\r\n?/g, '\n').split('\n')) {
    const whole = HEADING_LINE.exec(line);
    if (whole) {
      flush(true);
      blocks.push({ kind: 'label', text: whole[1] });
      continue;
    }
    const inline = HEADING_INLINE.exec(line);
    if (inline) {
      run.push(tidy(line.slice(0, inline.index)), '');
      flush(true);
      blocks.push({ kind: 'label', text: inline[1] });
      run.push(tidy(line.slice(inline.index + inline[0].length).replace(/^\s*:\s*/, '').replace(/^\s+/, '')));
      continue;
    }
    run.push(tidy(line));
  }
  flush(false);
  return blocks;
}
