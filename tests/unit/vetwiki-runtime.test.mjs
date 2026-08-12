import assert from 'node:assert/strict';
import test from 'node:test';

import { listTopics, loadTopic } from '../../src/lib/vetwiki/runtime.js';
import { loadTopic as loadCanonicalTopic } from '../../src/lib/vetwiki/index.js';

test('every metadata-only VetWiki route resolves through the lazy runtime', async () => {
  const topics = listTopics();
  assert.ok(topics.length > 0);
  for (const topic of topics) {
    const article = await loadTopic(topic.subject, topic.topic);
    assert.ok(article, `missing lazy article ${topic.subject}/${topic.topic}`);
    assert.equal(article.subject, topic.subject);
    assert.equal(article.topic, topic.topic);
    assert.ok(article.sections.length > 0, `empty lazy article ${topic.subject}/${topic.topic}`);
  }
});

test('unknown lazy VetWiki topics resolve to null', async () => {
  assert.equal(await loadTopic('not-a-subject', 'nope'), null);
  assert.equal(await loadTopic('com5', 'nope'), null);
});

test('lazy per-subject articles preserve canonical evidence and corrections', async () => {
  for (const topic of listTopics()) {
    const [runtimeArticle, canonicalArticle] = await Promise.all([
      loadTopic(topic.subject, topic.topic),
      Promise.resolve(loadCanonicalTopic(topic.subject, topic.topic)),
    ]);
    const withoutDecorativeIcon = ({ icon: _icon, ...article }) => article;
    assert.deepEqual(
      withoutDecorativeIcon(runtimeArticle),
      withoutDecorativeIcon(canonicalArticle),
      `runtime projection drifted for ${topic.id}`,
    );
  }
});

test('on-demand browser search still matches Thai article bodies', async () => {
  const { searchTopics } = await import('../../src/lib/vetwiki/runtime-search.js');
  const results = await searchTopics('วัคซีน');
  const rabies = results.find((result) => result.topic.id === 'com5--rabies');
  assert.ok(rabies?.matchedSections.length, 'Thai body query reports matching rabies sections');
  assert.deepEqual(await searchTopics('no-such-vetwiki-term-xyz'), []);
});
