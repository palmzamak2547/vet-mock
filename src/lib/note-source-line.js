// ============================================================
// note-source-line.js — a note section's source line, as a reader sees it
// ============================================================
// The notes reader and the VetWiki article show the same stored pointer
// ("Role_of_Vet_in_One_Health_Saharuetai_2026 p.2-5"). Both read it through
// noteSourceLabel with the registered titles, so one surface cannot print the
// raw file name while the other prints the label. The stored text is never
// changed: this is display only.
// ============================================================
import { noteSourceLabel } from './source-label.js';
import { NOTE_SOURCE_TITLES } from '../data/note-source-titles.generated.js';

/** The registered document title for a file name the notes cite, or null. */
export const registeredTitle = (name) => (Object.prototype.hasOwnProperty.call(NOTE_SOURCE_TITLES, name) ? NOTE_SOURCE_TITLES[name] : null);

/** A stored source line as the reader sees it. */
export function noteSourceLine(raw) {
  return noteSourceLabel(String(raw ?? '').replace(/\s*·\s*/g, ', '), registeredTitle);
}
