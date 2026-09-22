// VetWiki's practice button. 32 articles have no question of their own, and
// "ฝึกจากหัวข้อนี้" on one of them (equine-hoof, the meat-cutting decks) opened
// a "หัวข้อนี้ยังไม่มีข้อสอบ" dialog asking whether to practise the whole
// subject instead. The button now says "ฝึกทั้งวิชา" there and opens the
// subject set directly. No count is printed on it: the session serves
// min(pool, numQuestions), so a topic total would misstate the length.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { wikiPracticeTarget } from '../../src/lib/vetwiki/practice-target.js';
import { Q_COUNTS_BY_TOPIC } from '../../src/data/q-counts.js';
import { VETWIKI_TOPICS } from '../../src/lib/vetwiki/topic-registry.generated.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

test('an article with no questions of its own offers the whole subject, with no dialog step', () => {
  assert.equal(Q_COUNTS_BY_TOPIC['equine-medicine']?.['equine-hoof'] || 0, 0, 'fixture: equine-hoof has no questions');
  assert.deepEqual(wikiPracticeTarget('equine-medicine', 'equine-hoof'), { label: 'ฝึกทั้งวิชา', topic: null });
});

test('an article with questions keeps its topic practice', () => {
  assert.ok(Q_COUNTS_BY_TOPIC['aquatic-clinic']['aqua-fish-diseases'] > 0);
  assert.deepEqual(wikiPracticeTarget('aquatic-clinic', 'aqua-fish-diseases'), { label: 'ฝึกจากหัวข้อนี้', topic: 'aqua-fish-diseases' });
  assert.deepEqual(wikiPracticeTarget('x', 'y', { x: { y: 3 } }), { label: 'ฝึกจากหัวข้อนี้', topic: 'y' });
  assert.deepEqual(wikiPracticeTarget('x', 'y', { x: { y: 0 } }), { label: 'ฝึกทั้งวิชา', topic: null });
});

test('the count it reads is the pool a topic session filters, for every wiki article', async () => {
  // startExam keeps deliverable rows whose topic equals the article's topic,
  // so a zero here means that session could only ever be empty.
  await loadQB();
  const live = new Map();
  for (const q of QB) if (isQuestionDeliverable(q)) live.set(`${q.subject}--${q.topic}`, (live.get(`${q.subject}--${q.topic}`) || 0) + 1);
  const drift = VETWIKI_TOPICS
    .filter((t) => (Q_COUNTS_BY_TOPIC[t.subject]?.[t.topic] || 0) !== (live.get(t.id) || 0))
    .map((t) => `${t.id}: q-counts ${Q_COUNTS_BY_TOPIC[t.subject]?.[t.topic] || 0}, bank ${live.get(t.id) || 0}`);
  assert.deepEqual(drift, [], 'run npm run regen:q-counts');
  const wholeSubject = VETWIKI_TOPICS.filter((t) => wikiPracticeTarget(t.subject, t.topic).topic === null);
  assert.ok(wholeSubject.length > 0 && wholeSubject.length < VETWIKI_TOPICS.length);
});

test('the article renders the label and passes the target topic to startExam', () => {
  const view = fs.readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8');
  assert.ok(view.includes("import { wikiPracticeTarget } from '../lib/vetwiki/practice-target.js';"));
  assert.ok(view.includes('onClick={goPractice}>{practiceLabel}</button>'), 'the button says what it will open');
  assert.ok(view.includes('topic: practice.topic,'), 'a whole-subject set is asked for directly, so no dialog');
  assert.ok(!view.includes('>ฝึกจากหัวข้อนี้</button>'), 'no hard-coded label left');
});
