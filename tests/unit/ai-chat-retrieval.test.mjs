// ============================================================
// ai-chat retrieval, guide and quiz — against the real corpus
// ============================================================
// These load the same corpus the route loads (VetWiki, notes, clip
// summaries, the deliverable bank) and check outcomes a student would judge:
// a rabies question cites rabies material, a treatment question lands on the
// treatment section, "what's new" is the newest release, the timetable is the
// one in schedule.js, and a quiz is made only of deliverable bank questions.

import test from 'node:test';
import assert from 'node:assert/strict';

import { loadCorpus, isQuizzable } from '../../api/_lib/ai/corpus.js';
import { searchCorpus, selectDocs, isCovered, toSource, numberSources, snippetNeedles, headingSeconds } from '../../api/_lib/ai/retrieve.js';
import { retrieveGuide, loadReleases, guideRoutes, thaiShortDate } from '../../api/_lib/ai/guide.js';
import { pickQuiz, toQuizQuestion } from '../../api/_lib/ai/quiz.js';
import { buildActionCard } from '../../api/_lib/ai/actions.js';
import { buildConcepts } from '../../api/_lib/ai/concepts.js';
import { questionCatalog } from '../../api/_lib/question-catalog.js';
import { isQuestionDeliverable, BLOCKED_QUESTIONS } from '../../src/data/question-delivery.generated.js';
import { decodeQuizSet } from '../../src/lib/share-link.js';
import { SEMESTER } from '../../src/data/semester.js';

const corpus = await loadCorpus();
const pick = (question, terms = []) => {
  const found = searchCorpus(corpus, { text: question, terms, wikiQueries: [question] });
  return { found, selected: selectDocs(found.ranked) };
};
const where = (r) => `${r.doc.kind}:${r.doc.subject}/${r.doc.topic || r.doc.videoId || ''}#${r.doc.heading || ''}`;

test('the corpus holds every kind of VetMock content', () => {
  for (const k of ['wiki', 'note', 'video', 'question']) assert.ok(corpus.counts[k] > 100, `${k}: ${corpus.counts[k]}`);
});

test('a rabies incubation question cites rabies material, from more than the wiki', () => {
  const { found, selected } = pick('ระยะฟักตัวของโรคพิษสุนัขบ้าในสุนัขนานเท่าไหร่', ['rabies', 'incubation period', 'dog']);
  assert.ok(isCovered(selected));
  const top = selected.slice(0, 4).map(where);
  assert.ok(top.every((w) => /rabies|zoo-rabies|9m6IQXmL8EI/i.test(w)), top.join('\n'));
  assert.ok(selected.some((r) => r.doc.kind === 'video' && r.doc.videoId === '9m6IQXmL8EI'), 'the rabies lecture clip');
  assert.ok(!selected.slice(0, 3).some((r) => r.doc.subject === 'avian-medicine'), 'not the avian incubation headings');
  assert.deepEqual(found.unmatched, []);
});

test('a disease the question names keeps its own lecture first when the planner adds its genus', () => {
  // production 2026-10-28: "morbillivirus" counted as part of the question, the
  // distemper clips fell under half coverage and rinderpest questions were cited
  const { found, selected } = pick('อาการของโรคไข้หัดสุนัข (canine distemper) มีอะไรบ้าง', ['canine distemper', 'distemper', 'morbillivirus', 'dog', 'clinical signs']);
  assert.ok(isCovered(selected));
  assert.match(String(selected[0].doc.title), /distemper/i, where(selected[0]));
  const about = selected.map((r) => `${r.doc.title} ${r.doc.topic || ''} ${r.doc.heading || ''}`);
  assert.ok(about.every((a) => !/rinderpest|ephemeral|ruminant/i.test(a)), about.join('\n'));
  assert.equal(found.concepts.find((c) => c.label === 'morbillivirus').core, false);
  // with nothing named in the question, the planner's term is still what it is about
  assert.equal(buildConcepts('อาการเป็นอย่างไร', { extraTerms: ['leptospirosis'] }).concepts.find((c) => c.label === 'leptospirosis').core, true);
});

test('a treatment question lands on the treatment section of the right article', () => {
  const { selected } = pick('รักษาลำไส้อักเสบจากพาร์โวไวรัสในลูกสุนัขยังไง', ['canine parvovirus', 'treatment']);
  assert.ok(selected.slice(0, 3).some((r) => r.doc.kind === 'wiki' && r.doc.topic === 'cve' && /treatment/i.test(r.doc.heading)), selected.map(where).join('\n'));

  const cat = pick('การรักษาลำไส้อักเสบจากพาร์โวไวรัสในแมวทำอย่างไร', ['feline panleukopenia', 'feline parvovirus', 'treatment']);
  assert.match(where(cat.selected[0]), /CbRDV3iORso#20\. การรักษา/, 'the FPV lecture section that is about treatment');
});

test('a question about something VetMock never mentions is not covered', () => {
  const { found, selected } = pick('quantum chromodynamics ของ gluon คืออะไร');
  assert.ok(found.unmatched.length > 0);
  assert.equal(isCovered(selected), false);
});

test('sources are numbered, absolute, short and inside the context budget', () => {
  const { found, selected } = pick('อาการของโรคพิษสุนัขบ้าในสุนัขมีกี่ระยะ', ['rabies', 'clinical signs']);
  const needles = snippetNeedles(found.concepts);
  const { items, contextBlocks } = numberSources(selected.map((r) => toSource(r, { needles })), { budget: 6000 });
  assert.deepEqual(items.map((s) => s.n), items.map((_, i) => i + 1));
  for (const s of items) {
    assert.ok(s.url.startsWith('https://'), s.url);
    assert.ok(s.snippet.length <= 220, s.snippet);
    assert.ok(['wiki', 'note', 'video', 'question', 'guide', 'library', 'paper'].includes(s.kind));
    assert.ok(!s.title.includes('·'));
  }
  assert.ok(contextBlocks.length <= 6000 + items.length * 200);
  assert.ok(items.some((s) => /3 ?(phases|เฟส)/i.test(`${s.subtitle} ${s.title}`)));
  assert.equal(headingSeconds('9. เมื่อสัตว์ของเราถูกกัด [30:23-37:33]'), 1823);
  assert.equal(headingSeconds('ไม่มีเวลา'), 0);
});

test('"what is new" is answered from the newest releases, newest first', async () => {
  const releases = await loadReleases();
  const g = await retrieveGuide('VetMock มีอะไรใหม่', buildConcepts('VetMock มีอะไรใหม่').concepts, {});
  const versions = g.picks.filter((p) => p.doc.gtype === 'release').map((p) => p.doc.version);
  assert.equal(versions[0], releases[0].version);
  assert.equal(g.featureId, 'about');
  assert.ok(g.routed);
});

test('the final-exam timetable is the current term in schedule.js, the current year first', async () => {
  assert.deepEqual(guideRoutes('ปลายภาคสอบวิชาอะไรบ้าง').exam, { term: 'final', year: null });
  const g = await retrieveGuide('ปลายภาคสอบวิชาอะไรบ้าง', [], { now: new Date('2026-10-27T03:00:00Z') });
  const exams = g.picks.filter((p) => p.doc.gtype === 'exam');
  assert.ok(exams.length >= 1);
  assert.equal(exams[0].doc.term, 'final');
  assert.equal(exams[0].doc.year, 5);
  assert.ok(exams[0].doc.text.includes(SEMESTER.finalPeriod.labelTh));
  assert.ok(exams[0].doc.text.includes('ระบาดวิทยา'), 'epidemiology sits only the final');
  assert.equal(g.featureId, 'schedule');
  assert.equal(thaiShortDate('2026-11-23'), '23 พ.ย. 2569');
});

test('a quiz is made only of deliverable, showable bank questions of the subject asked for', async () => {
  const catalog = await questionCatalog();
  const blocked = new Set(BLOCKED_QUESTIONS.map((b) => b.key));
  for (let round = 0; round < 5; round++) {
    const r = pickQuiz(corpus, { subjects: ['com5'], concepts: [], n: 5 });
    assert.equal(r.card.type, 'quiz');
    assert.equal(r.card.questions.length, 5);
    for (const q of r.card.questions) {
      const bank = catalog.get(String(q.id));
      assert.ok(bank, `question ${q.id} is in the deliverable catalog`);
      assert.equal(bank.subject, 'com5');
      assert.ok(isQuestionDeliverable(bank));
      assert.ok(!blocked.has(`${bank.subject}:${bank.id}`));
      assert.ok(isQuizzable(bank));
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
      assert.deepEqual(decodeQuizSet(new URL(q.url).searchParams.get('qset')), [{ subject: 'com5', id: Number(q.id) }]);
    }
  }
  // A subject full of blocked keys never leaks one.
  for (let round = 0; round < 5; round++) {
    const r = pickQuiz(corpus, { subjects: ['livestock-pathology'], concepts: [], n: 10 });
    for (const q of r.card?.questions || []) assert.ok(!blocked.has(`livestock-pathology:${q.id}`));
  }
});

test('quiz size is clamped, topic words narrow the pool, and nothing comes back for nothing', () => {
  assert.equal(pickQuiz(corpus, { subjects: ['com5'], n: 50 }).card.questions.length, 10);
  assert.equal(pickQuiz(corpus, { subjects: ['com5'], n: 0 }).card.questions.length, 5);
  const rabies = pickQuiz(corpus, { subjects: [], concepts: buildConcepts('ข้อสอบเรื่อง rabies').concepts, n: 4 });
  assert.ok(rabies.card.questions.every((q) => /rabies|พิษสุนัขบ้า/i.test(`${q.stem} ${q.explain} ${q.topic || ''}`)), JSON.stringify(rabies.card.questions.map((q) => q.stem)));
  assert.equal(pickQuiz(corpus, { subjects: [], concepts: [], n: 5 }).card, null);
  const tf = toQuizQuestion({ id: 1, subject: 'com5', topic: 'rabies', type: 'tf', q: 'จริงไหม', answer: false, explain: 'ผิด' });
  assert.deepEqual([tf.options, tf.answer], [['ถูก', 'ผิด'], 1]);
});

test('an action button exists only when the catalog validator accepts it', () => {
  const practice = buildActionCard({ type: 'practice', subject: 'com5', num: 10 }, { corpus });
  assert.equal(practice.card.type, 'action');
  assert.ok(practice.card.url.startsWith('https://vetmock.com/?qset='));
  assert.equal(decodeQuizSet(new URL(practice.card.url).searchParams.get('qset')).length, 10);
  assert.equal(buildActionCard({ type: 'practice', subject: 'made-up-999' }, { corpus }).card, null);
  assert.equal(buildActionCard({ type: 'feature', feature: 'rm -rf' }, { corpus }).card, null);
  assert.equal(buildActionCard({ type: 'feature', feature: 'schedule' }, { corpus }).card.url, 'https://vetmock.com/app/schedule');
  assert.equal(buildActionCard({ type: 'library', subject: 'one-health' }, { corpus }).card.url, 'https://vetmock.com/app/library?subject=one-health');
  assert.equal(buildActionCard({ type: 'wiki', wiki: { subject: 'com5', topic: 'rabies' } }, { corpus }).card.url, 'https://vetmock.com/wiki/com5/rabies');
  assert.equal(buildActionCard({ type: 'wiki', wiki: { subject: 'com5', topic: 'nope' } }, { corpus }).card, null);
});
