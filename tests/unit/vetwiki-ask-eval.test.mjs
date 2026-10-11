// ============================================================
// vetwiki-ask-eval.test.mjs — the floor under ถามคลังความรู้'s retrieval
// ============================================================
// The owner's review (5.141.6): "ฟีเจอร์การค้นหา ถามคลังความรู้ ยังใช้ไม่ได้
// จริง". Retrieval decides what the model may answer from, so it is graded
// on questions students actually type (tests/fixtures/vetwiki-ask-eval.json,
// every expectation read from the corpus). Measured 2026-10-12 with
// scripts/eval-vetwiki-retrieval.mjs:
//
//                    before    after
//   hit@5            72.2%     100%
//   recall@5         59.4%     93.8%
//   MRR@10           0.555     0.914
//   English hit@5    0/3       3/3
//   not covered,     0/4       3/4
//   recognised
//
// The blind holdout (tests/fixtures/vetwiki-ask-eval-holdout.json, 23
// questions by a second author who saw only the corpus, never tuned on).
// "blind" is the one measurement taken before anything was changed with it
// in view; "now" is after the fixes that reading it justified.
//
//                    before    blind     now
//   hit@5            90.0%     100%      100%
//   recall@5         68.3%     81.7%     80.8%
//   MRR@10           0.653     0.883     0.908
//   Thai hit@5       8/10      10/10     10/10
//   not covered,     0/3       3/3 (one  2/3
//   recognised                 by luck)
//
// The floors sit a little under the measurement so a corpus edit can move a
// section by one rank without failing CI, and far above where retrieval was.

import test from 'node:test';
import assert from 'node:assert/strict';

import { loadEval, checkFixture, scoreRetrieval, productionRetrieve } from '../../scripts/eval-vetwiki-retrieval.mjs';
import { retrieveForQuestion, questionTokens, vocabularyGaps, explainQuestion } from '../../src/lib/vetwiki/retrieve.js';
import { latinPattern } from '../../src/lib/vetwiki/query-terms.js';

const data = loadEval();

test('the eval key is grounded in the corpus as it is today', async () => {
  assert.deepEqual(await checkFixture(data), []);
  assert.ok(data.items.length >= 40, 'about forty questions or more');
  const langs = new Set(data.items.map((i) => i.lang));
  for (const lang of ['th', 'en', 'mixed']) assert.ok(langs.has(lang), `the set includes ${lang} questions`);
});

test('the blind holdout is grounded too, and retrieval generalises to it', async () => {
  const holdout = loadEval({ holdout: true });
  assert.deepEqual(await checkFixture(holdout), []);
  const report = scoreRetrieval(await productionRetrieve(), holdout);
  assert.ok(report.hitAtK >= 0.9, `holdout hit@5 ${report.hitAtK.toFixed(3)}`);
  assert.ok(report.recallAtK >= 0.75, `holdout recall@5 ${report.recallAtK.toFixed(3)}`);
  assert.ok(report.mrr10 >= 0.8, `holdout MRR@10 ${report.mrr10.toFixed(3)}`);
  assert.ok(report.emptyCorrect >= 0.6, `holdout not-covered recognised ${report.emptyCorrect.toFixed(2)}`);
});

test('retrieval stays above the measured floor', async () => {
  const report = scoreRetrieval(await productionRetrieve(), data);
  const misses = report.rows.filter((r) => (r.empty ? !r.ok : !r.hit)).map((r) => r.id);
  assert.ok(report.hitAtK >= 0.94, `hit@5 ${report.hitAtK.toFixed(3)}; misses: ${misses.join(', ')}`);
  assert.ok(report.recallAtK >= 0.85, `recall@5 ${report.recallAtK.toFixed(3)}`);
  assert.ok(report.mrr10 >= 0.8, `MRR@10 ${report.mrr10.toFixed(3)}`);
  assert.ok(report.byLang.th.hit >= 0.9, `Thai hit@5 ${report.byLang.th.hit.toFixed(3)}`);
  assert.ok(report.emptyCorrect >= 0.75, `not-covered questions recognised: ${report.emptyCorrect.toFixed(2)}`);
});

test('the same question always retrieves the same sections', () => {
  for (const item of data.items.slice(0, 12)) {
    assert.deepEqual(retrieveForQuestion(item.q, { maxSections: 10 }), retrieveForQuestion(item.q, { maxSections: 10 }), item.id);
  }
});

test('every curated alias names something the corpus actually contains', () => {
  assert.deepEqual(vocabularyGaps(), []);
});

test('a Thai alias only fires on whole words: ไต never inside ไตรมาส', () => {
  const labels = explainQuestion('ไตรมาสแรกของการตั้งท้องโค').concepts.map((c) => c.label);
  assert.ok(!labels.includes('ไต'), `got ${labels.join(', ')}`);
  assert.ok(labels.includes('ตั้งท้อง'), 'the pregnancy alias still fires');
});

test('a short code matches only itself: PED never rides on "peds"', () => {
  const re = new RegExp(latinPattern('ped'));
  assert.equal(re.test('peds geri'), false);
  assert.equal(re.test('ped ในลูกสุกร'), true);
});

test('เท่าไหร่ is a question, not the word เท่า', () => {
  const t = questionTokens('subclinical ketosis ค่า BHBA เท่าไหร่');
  assert.ok(!t.includes('เท่า') && !t.includes('ไหร่'), `got ${t.join(', ')}`);
  assert.ok(t.includes('bhba'));
});

test('a misspelt term is read as the word the corpus uses', () => {
  const r = retrieveForQuestion('rabbies diagnosis', { maxSections: 10 });
  assert.ok(r.picks.slice(0, 5).some((p) => p.sectionId === 'com5--rabies--diagnosis'), r.picks.map((p) => p.sectionId).join(', '));
  assert.deepEqual(r.unmatched, [], 'a corrected word is not reported as missing');
});

test('a Thai question finds the section the notes wrote in English', () => {
  // ลมชัก appears nowhere in the corpus; the seizure chapter is in English.
  const r = retrieveForQuestion('ลมชักในสุนัข ควรเริ่มยากันชักเมื่อไหร่', { maxSections: 10 });
  assert.equal(r.picks[0]?.sectionId, 'com3--seizure--approach-when-to-start-aed');
});

test('a question about something VetWiki never mentions is reported, not guessed at', () => {
  const tplo = retrieveForQuestion('TPLO ผ่าตัดยังไง');
  assert.equal(tplo.covered, false);
  assert.deepEqual(tplo.picks, []);
  assert.ok(tplo.unmatched.includes('tplo'));
  // A code survives as one word, hyphen and all.
  assert.ok(retrieveForQuestion('FIP รักษาด้วย GS-441524 ได้ไหม').unmatched.includes('gs-441524'));
});

test('related sections are offered only when they account for at least half of the question', () => {
  for (const q of ['TPLO ผ่าตัดยังไง', 'Norberg angle วัดยังไง']) {
    const r = retrieveForQuestion(q);
    assert.ok(r.related.every((s) => s.coverage >= 0.5), `${q}: ${r.related.map((s) => `${s.sectionId}=${s.coverage}`).join(', ')}`);
  }
  assert.deepEqual(retrieveForQuestion('TPLO ผ่าตัดยังไง').related, []);
});
