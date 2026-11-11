// ============================================================
// explain-fold.js — the "ทำไมข้ออื่นผิด" section of an explanation
// ============================================================
// On 2,397 questions the explanation ends with a paragraph headed
// "❌ ทำไมข้ออื่นผิด" that restates every other option, and it made the
// answer panel a median 1.25 screens. A student who answered correctly folds
// it behind one row (Question.jsx); a wrong answer or a reveal without one
// keeps it open, exactly as before.
//
// This finds the paragraph and nothing finer: never an option inside it. The
// text is not changed, only cut in three where it already breaks, so the
// three parts joined are the explanation as written, and what is read aloud,
// the coach's input and the Anki export (which read the field) are untouched.
// ============================================================

// The heading alone on its line: "❌ ทำไมข้ออื่นผิด", "✗ ทำไมข้ออื่นผิด:".
// A heading that carries its own words ("ทำไมข้ออื่นผิด ในความหมายว่า...")
// says something of its own and stays open.
const HEADING = /^[ \t]*(?:❌|✗)?[ \t]*ทำไมข้ออื่นผิด[ \t]*:?[ \t]*$/;

/**
 * Cut an explanation around its "ทำไมข้ออื่นผิด" paragraph.
 * @returns {{ before: string, heading: string, body: string, after: string } | null}
 *   null when there is no such paragraph, when it is the first paragraph (the
 *   explanation's opening is never folded), or when it has no body.
 */
export function otherOptionsFold(text) {
  if (typeof text !== 'string' || !text.includes('ทำไมข้ออื่นผิด')) return null;
  // Paragraph starts: offset 0 and every offset after a blank line.
  const starts = [0];
  const blank = /\n[ \t]*\n/g;
  let m;
  while ((m = blank.exec(text))) starts.push(m.index + m[0].length);
  for (let i = 1; i < starts.length; i++) {
    const start = starts[i];
    const lineEnd = text.indexOf('\n', start);
    const headingLine = text.slice(start, lineEnd === -1 ? text.length : lineEnd);
    if (!HEADING.test(headingLine) || lineEnd === -1) continue;
    // The paragraph runs to the next blank line, or to the end.
    blank.lastIndex = lineEnd;
    const next = blank.exec(text);
    const end = next ? next.index : text.length;
    const body = text.slice(lineEnd + 1, end);
    if (!body.trim()) return null;
    // before + heading + '\n' + body + after is the text as written.
    return { before: text.slice(0, start), heading: headingLine, body, after: text.slice(end) };
  }
  return null;
}
