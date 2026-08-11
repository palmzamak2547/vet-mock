import assert from 'node:assert/strict';
import test from 'node:test';

import { QUESTION_LINKS } from '../../src/lib/vetwiki/question-links.generated.js';
import {
  articleForQuestion,
  hasTopic,
  listTopics,
} from '../../src/lib/vetwiki/registry.js';
import {
  articleForQuestion as canonicalArticleForQuestion,
  listTopics as listCanonicalTopics,
} from '../../src/lib/vetwiki/index.js';

test('light VetWiki registry stays identical to the canonical note corpus', () => {
  assert.deepEqual(listTopics(), listCanonicalTopics());
  assert.ok(listTopics().every((topic) => hasTopic(topic.subject, topic.topic)));
});

test('light registry preserves own-topic precedence and judged fallbacks', () => {
  const own = listTopics()[0];
  assert.deepEqual(
    articleForQuestion({ id: 'anything', subject: own.subject, topic: own.topic }),
    { subject: own.subject, topic: own.topic, derived: false },
  );

  const [questionId, link] = Object.entries(QUESTION_LINKS)
    .find(([, candidate]) => hasTopic(candidate.subject, candidate.topic));
  assert.deepEqual(
    articleForQuestion({ id: questionId, subject: '__missing__', topic: '__missing__' }),
    { ...link, derived: true },
  );

  for (const topic of listTopics()) {
    const q = { id: '__own__', subject: topic.subject, topic: topic.topic };
    assert.deepEqual(articleForQuestion(q), canonicalArticleForQuestion(q));
  }
  for (const id of Object.keys(QUESTION_LINKS)) {
    const q = { id, subject: '__missing__', topic: '__missing__' };
    assert.deepEqual(articleForQuestion(q), canonicalArticleForQuestion(q));
  }
});

test('light registry returns fresh records rather than mutable shared metadata', () => {
  const first = listTopics();
  first[0].title = 'mutated';
  assert.notEqual(listTopics()[0].title, 'mutated');
});
