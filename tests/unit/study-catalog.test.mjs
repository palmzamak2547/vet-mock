import assert from 'node:assert/strict';
import test from 'node:test';

import { createStudyCatalog } from '../../src/lib/study-catalog.js';
import { topicProgressKey } from '../../src/lib/study-progress.js';

test('catalog returns a deterministic missing node for an unknown subject', () => {
  const catalog = createStudyCatalog();
  const result = catalog.browse({ subject: 'does-not-exist' });

  assert.equal(result.status, 'not-found');
  assert.equal(result.kind, 'missing');
  assert.deepEqual(result.topics, []);
});

test('catalog joins question, note, wiki, video, and reading metadata', () => {
  const catalog = createStudyCatalog({
    readingChecklist: { [topicProgressKey('com5', 'rabies')]: 123 },
  });
  const result = catalog.browse({ subject: 'com5' });
  const rabies = result.topics.find((topic) => topic.id === 'rabies');

  assert.equal(result.status, 'ok');
  assert.ok(result.resources.questions.count > 0);
  assert.ok(result.resources.notes.count > 0);
  assert.equal(result.resources.wiki.count, result.resources.notes.count);
  assert.ok(result.resources.videos.count > 0);
  assert.equal(rabies.read, true);
  assert.ok(rabies.questionCount > 0);
  assert.equal(rabies.resources.notes.enabled, true);
  assert.equal(rabies.resources.wiki.intent.href, '/wiki/com5/rabies');
});

test('custom questions overlay generated counts without mutating source metadata', () => {
  const custom = {
    id: 'custom-1',
    subject: 'com5',
    topic: 'rabies',
    sourceType: 'past-paper',
  };
  const before = createStudyCatalog().browse({ subject: 'com5' });
  const after = createStudyCatalog({ customQuestions: [custom] }).browse({ subject: 'com5' });
  const beforeTopic = before.topics.find((topic) => topic.id === 'rabies');
  const afterTopic = after.topics.find((topic) => topic.id === 'rabies');

  assert.equal(after.resources.questions.count, before.resources.questions.count + 1);
  assert.equal(afterTopic.questionCount, beforeTopic.questionCount + 1);
  assert.equal(afterTopic.pastPaperCount, beforeTopic.pastPaperCount + 1);
});

test('open returns only enabled serializable intents', () => {
  const catalog = createStudyCatalog();
  const result = catalog.browse({ subject: 'com5' });
  const wikiIntent = catalog.open(result.topics.find((topic) => topic.id === 'rabies').resources.wiki);

  assert.deepEqual(wikiIntent, {
    status: 'ready',
    view: 'knowledge',
    state: { subject: 'com5', topic: 'rabies' },
    href: '/wiki/com5/rabies',
  });
  assert.equal(catalog.open(null).status, 'unavailable');
});

test('topic identity remains scoped when legacy topic ids collide', () => {
  const checklist = {
    nutrition: 50,
    [topicProgressKey('com3', 'nutrition')]: false,
  };
  const catalog = createStudyCatalog({ readingChecklist: checklist });
  const com3 = catalog.browse({ subject: 'com3' }).topics.find((topic) => topic.id === 'nutrition');
  const poultry = catalog.browse({ subject: 'poultry' }).topics.find((topic) => topic.id === 'nutrition');

  assert.equal(com3.read, false);
  assert.equal(poultry.read, true);
});

// B27: the wiki action followed note availability, but VetWiki covers only
// some note subjects. Year-2 cards (vet-histo "26 บทความ", microbiology,
// physiology…) and 97 topic buttons opened an article that does not exist
// and landed on the index. The wiki action now exists only where an article
// does.
test('the VetWiki action is offered only where a VetWiki article exists', async () => {
  const { SUBJECTS } = await import('../../src/data/curriculum.js');
  const { VETWIKI_TOPIC_KEYS } = await import('../../src/lib/vetwiki/topic-keys.generated.js');
  const keys = new Set(VETWIKI_TOPIC_KEYS);
  const catalog = createStudyCatalog();
  let noteOnly = 0;
  for (const s of SUBJECTS) {
    const r = catalog.browse({ subject: s.id });
    if (r.status !== 'ok') continue;
    const subjectKeys = VETWIKI_TOPIC_KEYS.filter((k) => k.startsWith(`${s.id}--`)).length;
    assert.equal(r.resources.wiki.count, subjectKeys, `${s.id} wiki count`);
    assert.equal(r.resources.wiki.available, subjectKeys > 0, `${s.id} wiki card`);
    assert.equal(r.resources.wiki.action.enabled, subjectKeys > 0, `${s.id} wiki card action`);
    for (const t of r.topics) {
      const has = keys.has(`${s.id}--${t.id}`);
      assert.equal(t.resources.wiki.enabled, has, `${s.id}/${t.id} wiki button`);
      if (t.resources.notes.enabled && !has) noteOnly++;
    }
  }
  // the probe found 97 note topics with no article; the catalog must not
  // pretend they have one
  assert.ok(noteOnly > 0, 'expected note topics without an article in the corpus');
  const histo = catalog.browse({ subject: 'vet-histo' });
  assert.equal(histo.resources.wiki.available, false);
  assert.ok(histo.resources.notes.available);
});

test('a topic with notes but no article does not claim "มีสรุปและ VetWiki"', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8');
  assert.match(src, /hasNotesForTopic \? \(hasWikiForTopic \? 'มีสรุปและ VetWiki' : 'มีสรุป'\)/);
});
