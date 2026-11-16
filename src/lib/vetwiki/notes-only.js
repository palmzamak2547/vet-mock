// ============================================================
// notes-only.js — subjects with notes that have no VetWiki articles yet
// ============================================================
// A VetWiki article is a note topic whose every section is checked against a
// source (scripts/lint-wiki-coverage.mjs). Seven Year 2 subjects (97 topics)
// have notes that have not been through that check, so they have no articles,
// and the index left them out: a student looking in the wiki could not find
// those notes at all. The index lists them under the shelves and opens them in
// the notes reader, marked as not yet checked, instead of passing them off as
// articles. Built from the two generated registries, so the index loads no
// note: a new notes subject appears here until its articles exist.
// ============================================================
import { SUBJECTS_WITH_NOTES, NOTE_TOPIC_KEYS } from '../../data/notes-registry.generated.js';
import { SHELF_SUBJECTS } from './shelf.generated.js';
import { SUBJECTS, yearForSubject } from '../../data/curriculum.js';

/** [{ id, topics }] for every subject with notes and no VetWiki shelf, in course order. */
export function notesOnlySubjects() {
  const order = new Map(SUBJECTS.map((s, i) => [s.id, i]));
  const topics = new Map();
  for (const key of NOTE_TOPIC_KEYS) {
    const id = key.split('/')[0];
    topics.set(id, (topics.get(id) || 0) + 1);
  }
  return [...SUBJECTS_WITH_NOTES]
    .filter((id) => !Object.prototype.hasOwnProperty.call(SHELF_SUBJECTS, id))
    .map((id) => ({ id, year: yearForSubject(id) || 0, topics: topics.get(id) || 0 }))
    .sort((a, b) => (order.get(a.id) ?? 1e9) - (order.get(b.id) ?? 1e9));
}
