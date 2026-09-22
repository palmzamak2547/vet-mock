import assert from 'node:assert/strict';
import test from 'node:test';

import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';
import { CORRECTIONS, correctionsFor } from '../../src/lib/vetwiki/corrections.js';
import { sectionId } from '../../src/lib/vetwiki/schema.js';
import { VETWIKI_CONFLICT_COUNTS, conflictCountFor } from '../../src/lib/vetwiki/conflict-summary.generated.js';

// The conflict notes are the most exam-actionable content in the corpus, and
// they are addressed by a string key built independently on three surfaces:
// the wiki article (via the adapter), the notes page (via sectionId()), and the
// count badge (conflict-summary.generated.js, which splits the key at build
// time; the app reads that file, so the checks below read it too). A drift in
// any one of them fails silently — the note simply does not appear, and
// nothing reports it.

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

test('the count badge the app shows agrees with the notes themselves', () => {
  const badged = Object.values(VETWIKI_CONFLICT_COUNTS).reduce((sum, n) => sum + n, 0);
  assert.equal(badged, TOTAL_NOTES, 'a badge must never claim a note that is not written down');

  let summed = 0;
  for (const t of listTopics()) summed += conflictCountFor(t.subject, t.topic);
  assert.equal(summed, TOTAL_NOTES, 'every note belongs to exactly one governed topic');

  for (const t of listTopics()) {
    let onPage = 0;
    for (const sec of loadTopic(t.subject, t.topic)?.sections || []) onPage += sec.corrections?.length || 0;
    assert.equal(
      conflictCountFor(t.subject, t.topic), onPage,
      `${t.subject}/${t.topic}: the badge says ${conflictCountFor(t.subject, t.topic)}, the article shows ${onPage}`,
    );
  }
});

test('a topic with no disagreement reports zero rather than throwing', () => {
  assert.equal(conflictCountFor('no-such-subject', 'no-such-topic'), 0);
});
