import assert from 'node:assert/strict';
import test from 'node:test';

import {
  NOTE_SOURCES,
  NOTE_SUBJECT_IDS,
  clearNotesSubjectCache,
  loadNotesSubject,
} from '../../src/data/note-corpus.js';
import {
  NOTE_TOPIC_COUNTS_BY_SUBJECT,
  SUBJECTS_WITH_NOTES,
} from '../../src/data/notes-registry.generated.js';

test('shared lazy note corpus and generated availability stay aligned', async () => {
  assert.deepEqual(
    [...NOTE_SUBJECT_IDS].sort(),
    [...SUBJECTS_WITH_NOTES].sort(),
  );

  for (const subject of NOTE_SUBJECT_IDS) {
    const notes = await loadNotesSubject(subject);
    assert.equal(
      Object.keys(notes).length,
      NOTE_TOPIC_COUNTS_BY_SUBJECT[subject],
      `topic count drifted for ${subject}`,
    );
  }
});

test('concurrent consumers share one loaded subject and unknown ids stay empty', async () => {
  clearNotesSubjectCache('com5');
  const [notesViewCopy, wikiCopy] = await Promise.all([
    loadNotesSubject('com5'),
    loadNotesSubject('com5'),
  ]);
  assert.strictEqual(notesViewCopy, wikiCopy);
  assert.deepEqual(await loadNotesSubject('not-a-subject'), {});
});

test('multi-source subjects preserve lecture-first order and senior provenance', async () => {
  const [lecture, senior] = await Promise.all(NOTE_SOURCES.zoonoses.map((item) => item.load()));
  const merged = await loadNotesSubject('zoonoses');
  const overlap = Object.keys(lecture).find((topic) => senior[topic]);

  assert.ok(overlap, 'fixture needs an overlapping zoonoses topic');
  assert.equal(merged[overlap].has85, true);
  assert.deepEqual(
    merged[overlap].sections,
    [...lecture[overlap].sections, ...senior[overlap].sections],
  );
});
