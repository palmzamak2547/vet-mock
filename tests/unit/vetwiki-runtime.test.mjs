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

test('a word pasted from a slide finds what the same word typed finds', async () => {
  // Copied out of a PDF or a document, น้ำนม can carry a zero-width space or
  // write สระอำ as two codepoints, in either order around the tone mark; the
  // index stores the one-codepoint ำ, so the pasted word found nothing.
  const { searchTopics } = await import('../../src/lib/vetwiki/runtime-search.js');
  const shape = (results) => results.map((r) => [r.topic.id, r.inTitle, r.matchedSections.map((s) => s.id)]);
  const [NIKHAHIT, MAI_THO, ZWSP, SOFT_HYPHEN] = [0x0e4d, 0x0e49, 0x200b, 0x00ad].map((c) => String.fromCharCode(c));
  for (const [typed, pasted] of [
    ['น้ำนม', [`น${MAI_THO}${NIKHAHIT}านม`, `น${NIKHAHIT}${MAI_THO}านม`, `น้ำ${ZWSP}นม`, `${ZWSP}น้ำนม${ZWSP}`]],
    ['จำนวน', [`จ${NIKHAHIT}านวน`, `จำ${SOFT_HYPHEN}นวน`]],
    ['พ.ศ. 25', ['พ.ศ. ๒๕']],
  ]) {
    const expected = shape(await searchTopics(typed));
    assert.ok(expected.length > 0, `"${typed}" is meant to be in VetWiki`);
    for (const q of pasted) {
      const got = await searchTopics(q);
      assert.deepEqual(shape(got), expected, `${JSON.stringify(q)} found something other than "${typed}"`);
      assert.equal(got.incompleteSubjects, 0);
    }
  }
  // Invisible characters alone are still no search at all.
  assert.deepEqual(await searchTopics(ZWSP), []);
});

test('on-demand browser search still matches Thai article bodies', async () => {
  const { searchTopics } = await import('../../src/lib/vetwiki/runtime-search.js');
  const results = await searchTopics('วัคซีน');
  const rabies = results.find((result) => result.topic.id === 'com5--rabies');
  assert.ok(rabies?.matchedSections.length, 'Thai body query reports matching rabies sections');
  assert.deepEqual(await searchTopics('no-such-vetwiki-term-xyz'), []);
});
