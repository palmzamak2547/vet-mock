// ============================================================
// conflict-index — where the lecture and the literature disagree, by topic
// ============================================================
// The corpus holds 200+ conflict notes, each carrying exam advice for a paper
// the lecturer marks. Until now they rendered in exactly one place: partway
// down the right wiki article, visible only to a student who had already
// scrolled to the right section. That is the narrowest possible aperture for
// the most exam-actionable content in the repo.
//
// This derives an index from data that is ALREADY keyed for it. A correction
// key is `subject--topic--slug`, so subject, topic and section anchor all fall
// out with zero authoring and no second source of truth to drift.
//
// Nothing here invents a number: every count is the length of a real array in
// corrections.js.
// ============================================================

import { CORRECTIONS } from './corrections.js';

/** `subject--topic--slug` → its three parts. Slugs cannot contain `--`
 *  (slug() collapses each run of non-alphanumerics to ONE dash), so the
 *  first two segments are always subject and topic. */
function splitKey(key) {
  const parts = String(key).split('--');
  if (parts.length < 3) return null;
  return { subject: parts[0], topic: parts[1], anchor: parts.slice(2).join('--') };
}

const INDEX = (() => {
  /** @type {Map<string, {total: number, contradicts: number, narrows: number, sections: Array<{anchor: string, severity: string}>}>} */
  const byTopic = new Map();
  for (const [key, notes] of Object.entries(CORRECTIONS)) {
    const p = splitKey(key);
    if (!p || !Array.isArray(notes) || notes.length === 0) continue;
    const tId = `${p.subject}--${p.topic}`;
    if (!byTopic.has(tId)) byTopic.set(tId, { total: 0, contradicts: 0, narrows: 0, sections: [] });
    const row = byTopic.get(tId);
    for (const n of notes) {
      row.total++;
      if (n.severity === 'contradicts') row.contradicts++;
      else row.narrows++;
    }
    // strongest severity present on this section, for a single marker
    const severity = notes.some((n) => n.severity === 'contradicts') ? 'contradicts' : 'narrows';
    row.sections.push({ anchor: p.anchor, severity });
  }
  return byTopic;
})();

const EMPTY = Object.freeze({ total: 0, contradicts: 0, narrows: 0, sections: [] });

/** How many disagreements this topic carries, and on which sections.
 *  Always returns an object, so callers never branch on null. */
export function conflictsForTopic(subject, topic) {
  return INDEX.get(`${subject}--${topic}`) || EMPTY;
}

/** Anchor → strongest severity, for marking a table of contents. */
export function conflictAnchors(subject, topic) {
  const map = new Map();
  for (const s of conflictsForTopic(subject, topic).sections) map.set(s.anchor, s.severity);
  return map;
}

/** Corpus-wide totals, for an honest one-line summary. */
export function conflictTotals() {
  let notes = 0, sections = 0;
  for (const row of INDEX.values()) { notes += row.total; sections += row.sections.length; }
  return { notes, sections, topics: INDEX.size };
}
