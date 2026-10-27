// ============================================================
// ai-chat planner + links — reading a turn, and where the chat may send you
// ============================================================
// The planner is a convenience: a junk or half-wrong reply must degrade to
// the regex plan field by field, and a subject or feature id the model made
// up must never survive. Links are absolute (the chat lives on another
// origin) and are built with the app's own URL code, so they open what the
// app actually serves.

import test from 'node:test';
import assert from 'node:assert/strict';

import { heuristicPlan, parsePlan, runPlanner, isFollowUp, PLANNER_SYSTEM } from '../../api/_lib/ai/planner.js';
import { subjectsInText, resolveSubjectRef } from '../../api/_lib/ai/subjects.js';
import {
  wikiLink, videoLink, questionSetLink, librarySubjectLink, viewLink, featureLink, paperLink,
} from '../../api/_lib/ai/links.js';
import { decodeQuizSet } from '../../src/lib/share-link.js';
import { FEATURES } from '../../src/lib/feature-registry.js';

const turn = (content) => [{ role: 'user', content }];

test('the regex plan reads the common shapes of a turn', () => {
  const quiz = heuristicPlan(turn('ขอข้อสอบ COM5 5 ข้อ'));
  assert.equal(quiz.intent, 'quiz');
  assert.deepEqual(quiz.subjects, ['com5']);
  assert.equal(quiz.quiz_n, 5);

  const research = heuristicPlan(turn('หางานวิจัย PRRSV ล่าสุด'));
  assert.equal(research.intent, 'research');
  assert.equal(research.recent, true);

  assert.equal(heuristicPlan(turn('สวัสดีครับ')).intent, 'chat');
  assert.equal(heuristicPlan(turn('ขอบคุณค่ะ')).intent, 'chat');
  assert.equal(heuristicPlan(turn('VetMock มีอะไรใหม่')).intent, 'guide');
  assert.equal(heuristicPlan(turn('ปลายภาคสอบวิชาอะไรบ้าง')).intent, 'guide');
  assert.equal(heuristicPlan(turn('เปิดคลังเอกสารวิชาระบาด')).intent, 'action');
  assert.equal(heuristicPlan(turn('รักษาพาร์โวในลูกสุนัขยังไง')).intent, 'answer');
});

test('a follow-up is read together with the turn before it', () => {
  assert.equal(isFollowUp('แล้วในแมวล่ะ'), true);
  assert.equal(isFollowUp('การวินิจฉัยโรคพิษสุนัขบ้าในสัตว์ที่ยังมีชีวิตใช้เกณฑ์อะไรบ้าง'), false);
  const plan = heuristicPlan([
    { role: 'user', content: 'รักษาพาร์โวในลูกสุนัขยังไง' },
    { role: 'assistant', content: 'supportive [1]' },
    { role: 'user', content: 'แล้วในแมวล่ะ' },
  ]);
  assert.ok(plan.query_th.includes('พาร์โว') && plan.query_th.includes('แมว'));
});

test('a planner reply is read leniently and validated field by field', () => {
  const fallback = heuristicPlan(turn('ขอข้อสอบ COM V 3 ข้อ'));
  assert.equal(parsePlan('not json at all', fallback).source, 'heuristic');

  const p = parsePlan('noise {"intent":"quiz","query_th":"ข้อสอบ COM V","terms_en":["rabies",7,""],"subjects":["COM V","made-up-999"],"quiz_n":99,"extra":true} trailing', fallback);
  assert.equal(p.source, 'model');
  assert.equal(p.intent, 'quiz');
  assert.deepEqual(p.terms_en, ['rabies']);
  assert.deepEqual(p.subjects, ['com5'], 'an invented id is dropped, a name is resolved');
  assert.equal(p.quiz_n, 10, 'clamped to the card maximum');

  const bad = parsePlan('{"intent":"hack","query_th":5}', fallback);
  assert.equal(bad.intent, 'quiz', 'an unknown intent falls back to the regex one');
  assert.equal(bad.query_th, fallback.query_th);

  const action = parsePlan('{"intent":"action","action":{"type":"feature","feature":"rm -rf","subject":"nope"}}', heuristicPlan(turn('เปิดอะไรสักอย่าง')));
  assert.equal(action.action.feature, '', 'a feature id not in the registry is dropped');
});

test('runPlanner never throws and falls back on failure', async () => {
  const ok = await runPlanner(turn('ระยะฟักตัว rabies'), {
    chat: async ({ system }) => {
      assert.equal(system, PLANNER_SYSTEM);
      return { ok: true, text: '{"intent":"answer","query_th":"ระยะฟักตัวของ rabies ในสุนัข","terms_en":["rabies","incubation period"],"subjects":[]}' };
    },
  });
  assert.equal(ok.source, 'model');
  assert.deepEqual(ok.terms_en, ['rabies', 'incubation period']);

  const down = await runPlanner(turn('ระยะฟักตัว rabies'), { chat: async () => ({ ok: false, status: 504 }) });
  assert.equal(down.source, 'heuristic');
  assert.equal(down.failed, 504);

  const thrown = await runPlanner(turn('x'), { chat: async () => { throw new Error('boom'); } });
  assert.equal(thrown.source, 'heuristic');
});

test('the planner prompt names no vendor and lists only real ids', () => {
  assert.ok(!/deepseek|anthropic|claude|openai|gpt/i.test(PLANNER_SYSTEM));
  assert.ok(PLANNER_SYSTEM.includes('com5='));
});

test('subjects are read from ids, codes, names and the COM numbering', () => {
  assert.deepEqual(subjectsInText('ขอข้อสอบ COM5'), ['com5']);
  assert.deepEqual(subjectsInText('ข้อสอบ com v หน่อย'), ['com5']);
  assert.deepEqual(subjectsInText('รหัส 3107417'), ['com5']);
  assert.deepEqual(subjectsInText('คลินิกสัตว์น้ำ'), ['aquatic-clinic']);
  assert.equal(resolveSubjectRef('epidemiology'), 'epidemiology');
  assert.equal(resolveSubjectRef('made-up'), null);
  assert.deepEqual(subjectsInText('ม้า'), [], 'an ambiguous nickname picks nothing');
});

test('links are absolute and open what the app reads back', () => {
  assert.equal(wikiLink('com5', 'rabies', 'com5--rabies--overview'), 'https://vetmock.com/wiki/com5/rabies#com5--rabies--overview');
  assert.equal(videoLink('9m6IQXmL8EI', 1823), 'https://vetmock.com/app/videos?v=9m6IQXmL8EI&at=1823');
  assert.equal(videoLink('9m6IQXmL8EI', -5), 'https://vetmock.com/app/videos?v=9m6IQXmL8EI&at=0');
  const url = questionSetLink([{ subject: 'com5', id: 579 }]);
  assert.ok(url.startsWith('https://vetmock.com/?qset='));
  assert.deepEqual(decodeQuizSet(new URL(url).searchParams.get('qset')), [{ subject: 'com5', id: 579 }]);
  assert.equal(questionSetLink([{ subject: 'com5', id: 60001 }]), null, 'a custom question cannot travel in a link');
  assert.equal(librarySubjectLink('one-health'), 'https://vetmock.com/app/library?subject=one-health');
  assert.equal(viewLink('schedule'), 'https://vetmock.com/app/schedule');
  assert.equal(viewLink('knowledge'), 'https://vetmock.com/wiki');
  assert.equal(viewLink('no-such-view'), null);
});

test('a feature links only where it really opens', () => {
  const byId = (id) => FEATURES.find((f) => f.id === id);
  assert.equal(featureLink(byId('faculty')), 'https://vetmock.com/app/faculty');
  assert.equal(featureLink(byId('research-studio')), 'https://research.vetmock.com');
  assert.equal(featureLink(byId('vetcalc')), null, 'a calculator popup has no address');
});

test('papers link to PubMed by PMID, else to the DOI', () => {
  assert.equal(paperLink({ pmid: '123456' }), 'https://pubmed.ncbi.nlm.nih.gov/123456/');
  assert.equal(paperLink({ doi: '10.1016/j.vetmic.2024.110001' }), 'https://doi.org/10.1016/j.vetmic.2024.110001');
  assert.equal(paperLink({ pmid: 'abc', doi: 'nope' }), null);
});
