// ============================================================
// question-links.test.mjs — a derived link never sends a reader nowhere
// ============================================================
// These links exist because a reader who gets a past-paper question wrong was
// being offered nothing, while the article they needed already existed. The
// failure mode of the fix is worse than the gap it closes: a button that opens
// an article which does not answer the question teaches the reader that the
// wiki is not worth opening.
//
// Precision was bought by a judge that rejected 209 of 525 shortlisted
// candidates. What this file guards is the part a judge cannot: that every
// surviving link still points at something real, and that own-topic routing is
// never overridden by a derived guess.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_LINKS } from '../../src/lib/vetwiki/question-links.generated.js';
import { listTopics, loadTopic, hasTopic, articleForQuestion } from '../../src/lib/vetwiki/index.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const sections = new Set();
for (const t of listTopics()) {
  for (const s of loadTopic(t.subject, t.topic)?.sections || []) sections.add(s.id);
}

const byId = new Map();
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) if (q?.id != null) byId.set(String(q.id), q);
}

test('every linked question exists', () => {
  const ghosts = Object.keys(QUESTION_LINKS).filter((id) => !byId.has(id));
  assert.deepEqual(ghosts, [], `link(s) for question id(s) that do not exist: ${ghosts.join(', ')}`);
});

test('every link points at a section and topic that still exist', () => {
  const broken = [];
  for (const [id, l] of Object.entries(QUESTION_LINKS)) {
    if (!hasTopic(l.subject, l.topic)) broken.push(`${id}: topic ${l.subject}/${l.topic}`);
    else if (!sections.has(l.sectionId)) broken.push(`${id}: section ${l.sectionId}`);
  }
  assert.deepEqual(broken, []);
});

test('the section a link names belongs to the topic it opens', () => {
  const mismatched = Object.entries(QUESTION_LINKS)
    .filter(([, l]) => !l.sectionId.startsWith(`${l.subject}--${l.topic}--`))
    .map(([id, l]) => `${id}: ${l.sectionId} is not in ${l.subject}/${l.topic}`);
  assert.deepEqual(mismatched, []);
});

test('a derived link never overrides a question that already has its own article', () => {
  const overridden = Object.keys(QUESTION_LINKS)
    .map((id) => byId.get(id))
    .filter((q) => q && hasTopic(q.subject, q.topic))
    .map((q) => `${q.id} (${q.subject}/${q.topic})`);
  assert.deepEqual(overridden, [],
    'question already reachable through its own topic should not carry a derived link');
});

test('articleForQuestion prefers the question own topic over any derived link', () => {
  const governed = listTopics()[0];
  const q = { id: Object.keys(QUESTION_LINKS)[0], subject: governed.subject, topic: governed.topic };
  const got = articleForQuestion(q);
  assert.equal(got.derived, false);
  assert.equal(got.topic, governed.topic);
});

test('confidence is a value the caller knows how to read', () => {
  for (const [id, l] of Object.entries(QUESTION_LINKS)) {
    assert.ok(['strong', 'supporting'].includes(l.confidence), `${id}: unexpected confidence '${l.confidence}'`);
  }
});
