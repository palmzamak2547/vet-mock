// ============================================================
// VetWiki registry-lite — existence checks without the topic catalog
// ============================================================
// Home prefetches the results and review views at idle; through the full
// registry they dragged the whole topic catalog (~125 KB of source) into
// every boot for a yes/no answer. The lite module answers from the generated
// id list, and gives the same answers as the full registry.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as lite from '../../src/lib/vetwiki/registry-lite.js';
import * as full from '../../src/lib/vetwiki/registry.js';
import { VETWIKI_TOPICS } from '../../src/lib/vetwiki/topic-registry.generated.js';
import { VETWIKI_TOPIC_KEYS } from '../../src/lib/vetwiki/topic-keys.generated.js';
import { QUESTION_LINKS } from '../../src/lib/vetwiki/question-links.generated.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('the generated key list is exactly the catalog\'s ids', () => {
  assert.deepEqual(VETWIKI_TOPIC_KEYS, VETWIKI_TOPICS.map((t) => t.id));
});

test('lite and full registries agree on every topic and every linked question', () => {
  for (const t of VETWIKI_TOPICS) assert.equal(lite.hasTopic(t.subject, t.topic), true, t.id);
  assert.equal(lite.hasTopic('no-such', 'topic'), false);
  assert.equal(full.hasTopic, lite.hasTopic, 'the full registry re-exports the lite check');
  assert.equal(full.articleForQuestion, lite.articleForQuestion);
  for (const [id, link] of Object.entries(QUESTION_LINKS).slice(0, 200)) {
    const q = { id, subject: 'x', topic: 'y' };
    assert.deepEqual(lite.articleForQuestion(q), lite.hasTopic(link.subject, link.topic) ? { ...link, derived: true } : null);
  }
});

test('the prefetched views import the lite module, not the catalog', () => {
  // ReviewView and SRSessionView reach the wiki through the shared
  // WikiLinkForQuestion button now (instant-feedback release), which
  // itself imports registry-lite; ResultsView still calls it directly.
  // The contract is the one that matters for the boot diet: none of
  // these surfaces may pull the ~125 KB topic catalog.
  for (const file of ['../../src/views/ResultsView.jsx', '../../src/views/ReviewView.jsx', '../../src/views/SRSessionView.jsx', '../../src/components/WikiLinkForQuestion.jsx']) {
    const src = read(file);
    assert.doesNotMatch(src, /from '\.\.\/lib\/vetwiki\/registry\.js'/, file);
    assert.doesNotMatch(src, /topic-registry\.generated/, file);
  }
  assert.match(read('../../src/components/WikiLinkForQuestion.jsx'), /registry-lite\.js/);
  assert.doesNotMatch(read('../../src/lib/vetwiki/registry-lite.js'), /topic-registry\.generated/);
});
