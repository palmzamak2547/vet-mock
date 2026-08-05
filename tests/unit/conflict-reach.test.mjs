import assert from 'node:assert/strict';
import test from 'node:test';

import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';
import { CORRECTIONS, correctionsFor } from '../../src/lib/vetwiki/corrections.js';
import { sectionId } from '../../src/lib/vetwiki/schema.js';
import { conflictsForTopic, conflictTotals } from '../../src/lib/vetwiki/conflict-index.js';

// The conflict notes are the most exam-actionable content in the corpus, and
// they are addressed by a string key built independently on three surfaces:
// the wiki article (via the adapter), the notes page (via sectionId()), and the
// index badge (via splitting the key). A drift in any one of them fails
// silently — the note simply does not appear, and nothing reports it.

const TOTAL_NOTES = Object.values(CORRECTIONS).flat().length;

test('every conflict note is attached to a section that actually exists', () => {
  let reachable = 0;
  for (const t of listTopics()) {
    for (const s of loadTopic(t.subject, t.topic)?.sections || []) {
      reachable += s.corrections?.length || 0;
    }
  }
  assert.equal(
    reachable, TOTAL_NOTES,
    `${TOTAL_NOTES - reachable} conflict note(s) are keyed to a section no article renders`,
  );
});

test('the notes page derives the same key the wiki does', () => {
  // NotesView has no adapter: it builds the key itself from the raw note
  // heading. If slug() or the key format ever changes on one side only, a
  // student revising from Notes silently stops being warned.
  for (const t of listTopics()) {
    const topic = loadTopic(t.subject, t.topic);
    for (const s of topic?.sections || []) {
      if (!s.corrections?.length) continue;
      const viaNotes = correctionsFor(sectionId(t.subject, t.topic, s.heading));
      assert.equal(
        viaNotes.length, s.corrections.length,
        `${t.subject}/${t.topic} "${s.heading}": wiki sees ${s.corrections.length}, notes sees ${viaNotes.length}`,
      );
    }
  }
});

test('the index badge totals agree with the notes themselves', () => {
  const totals = conflictTotals();
  assert.equal(totals.notes, TOTAL_NOTES, 'a badge must never claim a note that is not written down');

  let summed = 0;
  for (const t of listTopics()) summed += conflictsForTopic(t.subject, t.topic).total;
  assert.equal(summed, TOTAL_NOTES, 'every note belongs to exactly one governed topic');
});

test('a topic with no disagreement reports zero rather than throwing', () => {
  const none = conflictsForTopic('no-such-subject', 'no-such-topic');
  assert.equal(none.total, 0);
  assert.deepEqual(none.sections, []);
});
