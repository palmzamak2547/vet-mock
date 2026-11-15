// The question card's header line (type, subject, topic, paper) truncates beside the
// controls. It is a button that unfolds it only while it is cut off; see Question.jsx.

/** Whether the header line is cut off: its text is wider than the box that shows it. */
export function metaLineCut(el) {
  return Boolean(el) && el.scrollWidth > el.clientWidth + 1;
}
