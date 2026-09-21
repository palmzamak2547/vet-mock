// ============================================================
// private-notes.js — how a local document becomes database rows
// ============================================================
// The admin picks a file off their own disk and the browser writes it into
// private_notes one part at a time. A part is an exam section, which is the
// unit the viewer pages through and small enough that a single write never
// carries the whole paper.
// ============================================================

/** Split an answer-key file into the rows the table stores. One part per
 *  exam section when the file names them, otherwise the whole thing in one. */
export function splitKey(key) {
  const questions = Array.isArray(key?.questions) ? key.questions : null;
  if (!questions) return [{ part: 1, payload: key }];
  const groups = new Map();
  for (const q of questions) {
    const g = q.sectionFile || q.section || 'all';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(q);
  }
  const order = [...groups.keys()].sort();
  return order.map((g, i) => {
    const qs = groups.get(g);
    const payload = {
      part: i + 1,
      sectionFile: g,
      section: qs[0].section || g,
      range: [qs[0].n, qs[qs.length - 1].n],
      questions: qs,
    };
    if (i === 0) payload.meta = { ...key, questions: undefined };
    return { part: i + 1, payload };
  });
}

/** A slug the primary key can carry: lowercase, ascii, no run of dashes. */
export function slugify(s) {
  return String(s || '').toLowerCase().replace(/\.json$/, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}
