// ============================================================
// corrections.test.mjs — the lecture-vs-evidence notes stay honest
// ============================================================
// src/lib/vetwiki/corrections.js records places where a source we could follow
// disagrees with what the lecture taught. It is generated, so the risk is not a
// typo — it is drift: a section gets renamed or removed and the conflict note
// silently detaches, or an entry loses the half that makes it fair to publish.
//
// A one-sided note is the failure mode that matters. Saying the lecture is
// wrong without saying what the source found, or without telling the student
// what to do in an exam their lecturer marks, is worse than saying nothing.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { CORRECTIONS, correctionsFor } from '../../src/lib/vetwiki/corrections.js';
import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';

const realSectionIds = new Set();
for (const t of listTopics()) {
  for (const s of loadTopic(t.subject, t.topic)?.sections || []) realSectionIds.add(s.id);
}

test('every correction is attached to a section that still exists', () => {
  const orphans = Object.keys(CORRECTIONS).filter((id) => !realSectionIds.has(id));
  assert.deepEqual(orphans, [], `orphaned correction(s): ${orphans.join(', ')}`);
});

test('a correction always carries both sides and exam advice', () => {
  for (const [sectionId, items] of Object.entries(CORRECTIONS)) {
    assert.ok(items.length > 0, `${sectionId} has an empty correction list`);
    for (const c of items) {
      assert.ok(c.lectureSays?.trim(), `${sectionId}: missing what the lecture said`);
      assert.ok(c.evidenceSays?.trim(), `${sectionId}: missing what the source found`);
      assert.ok(c.examAdvice?.trim(), `${sectionId}: missing exam advice`);
    }
  }
});

// A reader has to be able to go and check. That means either a numeric handle
// somewhere (PMID, DOI, a standard's document number, a reported figure) or the
// name of a body that publishes findable documents.
const AUTHORITY = /PMID|doi|DOI|WOAH|OIE|WSAVA|WHO|FAO|Codex|CXC|EFSA|USDA|FDA|AVMA|ACVIM|IVETF|NRC|ISO/;

test('what the source found is traceable — a number, a source, or an identifier', () => {
  for (const [sectionId, items] of Object.entries(CORRECTIONS)) {
    for (const c of items) {
      const both = `${c.evidenceSays} ${c.sourceRef || ''}`;
      const traceable = /\d/.test(both) && (AUTHORITY.test(both) || /\d/.test(c.evidenceSays));
      assert.ok(traceable, `${sectionId}: evidence cites nothing a reader could follow`);
    }
  }
});

test('severity is one the reader-facing note knows how to render', () => {
  for (const [sectionId, items] of Object.entries(CORRECTIONS)) {
    for (const c of items) {
      assert.ok(['contradicts', 'narrows'].includes(c.severity), `${sectionId}: unexpected severity '${c.severity}'`);
    }
  }
});

test('no middle-dot separators reach the reader', () => {
  for (const [sectionId, items] of Object.entries(CORRECTIONS)) {
    for (const c of items) {
      const text = `${c.lectureSays} ${c.evidenceSays} ${c.examAdvice}`;
      assert.ok(!text.includes(' · '), `${sectionId}: middle-dot separator in reader-facing text`);
    }
  }
});

test('correctionsFor returns an array for a section with none', () => {
  assert.deepEqual(correctionsFor('definitely--not--a-section'), []);
});
