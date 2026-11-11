// ============================================================
// explain-fold.js — the "ทำไมข้ออื่นผิด" section of an explanation
// ============================================================
// On about 2,400 questions the explanation ends with a section headed
// "❌ ทำไมข้ออื่นผิด" that restates every other option, and it made the
// answer panel a median 1.25 screens. A student who answered correctly folds
// it behind one row (Question.jsx); a wrong answer or a reveal without one
// keeps it open, exactly as before.
//
// This finds the section and nothing finer: never an option inside it. The
// text is not changed, only cut in three where it already breaks, so the
// three parts joined are the explanation as written, and what is read aloud,
// the coach's input and the Anki export (which read the field) are untouched.
// ============================================================

// The heading alone on its line: "❌ ทำไมข้ออื่นผิด", "✗ ทำไมข้ออื่นผิด:".
// A heading that carries its own words ("ทำไมข้ออื่นผิด ในความหมายว่า...")
// says something of its own and stays open.
const HEADING = /^[ \t]*(?:❌|✗)?[ \t]*ทำไมข้ออื่นผิด[ \t]*:?[ \t]*$/;
const BLANK = /\n[ \t]*\n/g;

/**
 * Cut an explanation around its "ทำไมข้ออื่นผิด" section.
 *
 * The heading starts a line: after a blank line (most of the bank), or after a
 * single newline (75 food-industry explanations write it so). The section runs
 * to the next blank line, or to the end.
 * @returns {{ before: string, heading: string, body: string, after: string } | null}
 *   null when there is no such heading, when it is the first line (the
 *   explanation's opening is never folded), or when it has no body.
 */
export function otherOptionsFold(text) {
  if (typeof text !== 'string' || !text.includes('ทำไมข้ออื่นผิด')) return null;
  let start = 0;
  for (;;) {
    const nl = text.indexOf('\n', start);
    if (nl === -1) return null;
    start = nl + 1;
    const lineEnd = text.indexOf('\n', start);
    const headingLine = text.slice(start, lineEnd === -1 ? text.length : lineEnd);
    if (!HEADING.test(headingLine)) continue;
    if (lineEnd === -1 || !text.slice(0, start).trim()) return null;
    BLANK.lastIndex = lineEnd;
    const next = BLANK.exec(text);
    const end = next ? next.index : text.length;
    const body = text.slice(lineEnd + 1, end);
    if (!body.trim()) return null;
    // before + heading + '\n' + body + after is the text as written.
    return { before: text.slice(0, start), heading: headingLine, body, after: text.slice(end) };
  }
}
