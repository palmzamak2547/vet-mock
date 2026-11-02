// The video library's generated files (scripts/video-registry.mjs): every
// record points at a channel with permission on file, a real subject and real
// topics, inside its own length; every card keeps the summary policy of
// docs/VIDEO-LIBRARY.md section 4 at the surface students read.

import test from 'node:test';
import assert from 'node:assert/strict';
import { VIDEO_REGISTRY } from '../../src/data/video-registry.generated.js';
import { VIDEO_CARD_LOADERS, VIDEO_INDEX } from '../../src/data/video-cards.generated.js';
import { VIDEO_TOPIC_INDEX } from '../../src/data/video-topic-index.generated.js';
import { VIDEO_CHANNELS } from '../../src/data/video-channels.js';
import { SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';
import { LIMITS, keyPointCap, thaiWords } from '../../src/lib/video-summary-check.js';
import { topicFits } from '../../scripts/video-registry.mjs';

const subjects = new Map(Object.values(SUBJECTS_BY_YEAR).flat().map((s) => [s.id, s]));
const topics = new Set([...subjects.values()].flatMap((s) => (s.topics || []).map((t) => t.id)));
const entries = Object.entries(VIDEO_REGISTRY);

test('every video names a channel with permission on file, a real subject and real topics', () => {
  assert.ok(entries.length > 0);
  for (const [id, v] of entries) {
    assert.match(id, /^[0-9A-Za-z_-]{11}$/);
    assert.ok(VIDEO_CHANNELS[v.channel]?.permission?.date, `${id}: channel ${v.channel} has no permission record`);
    assert.ok(subjects.has(v.subject), `${id}: unknown subject ${v.subject}`);
    assert.ok(v.durationSec > 0, `${id}: no length`);
    assert.match(v.date, /^\d{4}-\d{2}-\d{2}$/, `${id}: date`);
    for (const [topic, s, e, conf] of v.topics) {
      assert.ok(topics.has(topic), `${id}: unknown topic ${topic}`);
      assert.ok(s >= 0 && s < e && e <= v.durationSec + 1, `${id}: ${topic} ${s}-${e} outside ${v.durationSec} s`);
      assert.ok(['high', 'medium', 'ambiguous'].includes(conf), `${id}: confidence ${conf}`);
    }
  }
});

test('a topic stretch is published only as the session\'s own topic', () => {
  // The first batch's full check: each wrong stretch named a topic the title does not.
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'CSF supplement'), false);
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'ASF'), false);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'Respiratory'), false);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'POA equine'), false, 'a species word alone is no match');
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'Respiratory viral diseases in swine'), true);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'Equine anesthesia'), true);
  assert.equal(topicFits('Anatomy function and clinical examination of stallion', 'Male reproductive organ functions'), true);
  // The lecturer's own set settles it, whatever the title says.
  assert.equal(topicFits('7.Endometritis in mare 1 Oct 69', 'Uterine defense', new Set(['eqrepro-defense']), 'eqrepro-defense'), true);
});

test('the small index and the card loaders agree with the registry', () => {
  assert.deepEqual(Object.keys(VIDEO_INDEX).sort(), Object.keys(VIDEO_REGISTRY).sort());
  for (const [id, v] of entries) assert.equal(Boolean(VIDEO_CARD_LOADERS[id]), v.card, `${id}: card flag and loader disagree`);
  for (const [topic, list] of Object.entries(VIDEO_TOPIC_INDEX)) {
    assert.ok(topics.has(topic), `topic index: unknown topic ${topic}`);
    for (const x of list) {
      const v = VIDEO_REGISTRY[x.v];
      assert.ok(v, `topic index: ${x.v} is not in the registry`);
      assert.ok(x.s < x.e && x.e <= v.durationSec + 1, `${topic}: ${x.v} ${x.s}-${x.e}`);
      assert.notEqual(x.conf, 'ambiguous', 'an ambiguous stretch never links from a topic');
    }
  }
});

test('every card keeps the summary policy where students read it', async () => {
  for (const [id, load] of Object.entries(VIDEO_CARD_LOADERS)) {
    const card = (await load()).default;
    const d = VIDEO_REGISTRY[id].durationSec;
    const where = (p) => `${id} [${p.t}] ${p.text || p.line || ''}`;
    assert.ok(thaiWords(card.oneLiner) <= LIMITS.oneLiner, `${id}: one-liner too long`);
    assert.ok(card.keyPoints.length >= 1 && card.keyPoints.length <= Math.min(keyPointCap(d), LIMITS.ceiling), `${id}: ${card.keyPoints.length} key points for ${d} s`);
    assert.ok(card.emphasis.length <= LIMITS.emphasis && card.remember.length <= LIMITS.remember, `${id}: emphasis or remember over cap`);
    const points = [...card.keyPoints, ...card.emphasis, ...card.remember];
    for (const p of points) {
      assert.ok(p.t >= 0 && p.t <= d, `${where(p)} outside the video`);
      assert.ok(thaiWords(p.text) <= LIMITS.point, `${where(p)} longer than one sentence allows`);
    }
    let last = -1;
    for (const c of card.chapters) {
      assert.ok(c.t > last && c.t <= d, `${id}: chapter ${c.title} out of order`);
      assert.ok(thaiWords(c.line) <= LIMITS.chapterLine, `${where(c)} chapter line too long`);
      last = c.t;
    }
    const text = JSON.stringify(card);
    assert.ok(!text.includes('·'), `${id}: middle dot`);
    assert.ok(!/อาจารย์(?:กล่าว|บอก|พูด)ว่า/.test(text), `${id}: speaks about the lecturer instead of the content`);
  }
});
