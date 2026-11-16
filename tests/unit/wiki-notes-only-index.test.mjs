import assert from 'node:assert/strict';
import test from 'node:test';

import { SUBJECTS_WITH_NOTES } from '../../src/data/notes-registry.generated.js';
import { SHELF_SUBJECTS } from '../../src/lib/vetwiki/shelf.generated.js';
import { notesOnlySubjects } from '../../src/lib/vetwiki/notes-only.js';
import { noteSourceLine } from '../../src/lib/note-source-line.js';

// The VetWiki index left out seven Year 2 subjects (97 topics) that have notes
// but no checked articles: a student could not find those notes from the wiki.
// Every subject with notes is now either a shelf or a notes-only row.

test('every subject with notes is in the VetWiki index, as a shelf or a notes-only row', () => {
  const listed = new Set([...Object.keys(SHELF_SUBJECTS), ...notesOnlySubjects().map((s) => s.id)]);
  const missing = [...SUBJECTS_WITH_NOTES].filter((id) => !listed.has(id));
  assert.deepEqual(missing, []);
});

test('a notes-only row is a subject with notes and no shelf', () => {
  const rows = notesOnlySubjects();
  for (const row of rows) {
    assert.ok(SUBJECTS_WITH_NOTES.has(row.id), row.id);
    assert.equal(Object.prototype.hasOwnProperty.call(SHELF_SUBJECTS, row.id), false, row.id);
  }
  // The seven Year 2 subjects found missing on 16 Nov 2026 (until their articles exist).
  for (const id of ['vet-histo', 'vet-physio-3', 'biochem-2', 'vet-microbio-1', 'vet-parasit-1', 'vet-physio-lab-1', 'vet-physio-lab-2']) {
    assert.ok(SHELF_SUBJECTS[id] || rows.some((r) => r.id === id), id);
  }
});

test('a source line reads as a label, the stored pointer untouched', () => {
  const raw = 'Role_of_Vet_in_One_Health_Saharuetai_2026 p.2-5';
  assert.equal(noteSourceLine(raw), 'Role of Vet in One Health Saharuetai 2026 p.2-5');
  assert.equal(noteSourceLine('4 - Helminthic zoonoses.pdf p.3'), 'Helminthic Zoonoses p.3');
  assert.equal(raw, 'Role_of_Vet_in_One_Health_Saharuetai_2026 p.2-5');
});
