// ============================================================
// omni-ask.test.mjs — every state ถามคลังความรู้ can land a student in
// ============================================================
// The palette's reading of a reply, pinned without React: which failures
// are retried once by themselves, which are told straight, when an answer
// is really "VetWiki has nothing on this", and what the student is offered
// instead of a dead end.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ASK_COPY, classifyAskResponse, shouldAutoRetry, isEmptyAnswer, relatedSections,
  relatedTopicsFor, libraryTerms, unmatchedLine,
} from '../../src/lib/omni-ask.js';

const JSON_CT = 'application/json; charset=utf-8';

test('a dropped connection or a 5xx is transient and retried once by itself', () => {
  const offline = classifyAskResponse({ networkError: true });
  assert.equal(offline.kind, 'transient');
  assert.equal(offline.message, ASK_COPY.network);
  assert.equal(shouldAutoRetry(offline), true);
  for (const [status, body, message] of [
    [502, { reason: 'provider' }, ASK_COPY.provider],
    [502, { reason: 'malformed' }, ASK_COPY.provider],
    [500, { reason: 'unexpected' }, ASK_COPY.provider],
    [504, { reason: 'timeout' }, ASK_COPY.timeout],
  ]) {
    const r = classifyAskResponse({ status, contentType: JSON_CT, body });
    assert.equal(r.kind, 'transient', `${status} ${body.reason}`);
    assert.equal(r.message, message);
    assert.equal(shouldAutoRetry(r), true);
  }
});

test('the platform\'s own timeout page is a transient failure, not "this is not the real site"', () => {
  const r = classifyAskResponse({ status: 504, contentType: 'text/plain' });
  assert.equal(r.kind, 'transient');
  assert.equal(r.message, ASK_COPY.timeout);
});

test('quota, missing setup, rate limits and local dev are told straight and never retried', () => {
  const budget = classifyAskResponse({ status: 503, contentType: JSON_CT, body: { reason: 'budget' } });
  assert.equal(budget.kind, 'budget');
  assert.match(budget.message, /วันนี้ถามครบโควตาแล้ว/);
  const busy = classifyAskResponse({ status: 503, contentType: JSON_CT, body: { reason: 'temporarily_unavailable' } });
  assert.equal(busy.kind, 'busy');
  assert.equal(busy.retryable, true, 'a busy limiter can be asked again by hand');
  assert.equal(classifyAskResponse({ status: 503, contentType: JSON_CT, body: {} }).kind, 'unconfigured');
  assert.equal(classifyAskResponse({ status: 429, contentType: JSON_CT, body: {} }).kind, 'rate');
  assert.equal(classifyAskResponse({ status: 200, contentType: 'text/html' }).kind, 'local-only');
  assert.equal(classifyAskResponse({ status: 400, contentType: JSON_CT, body: {} }).kind, 'bad-request');
  for (const r of [budget, busy]) assert.equal(shouldAutoRetry(r), false);
});

test('a JSON 200 is a reply to read', () => {
  const body = { claims: [] };
  assert.deepEqual(classifyAskResponse({ status: 200, contentType: JSON_CT, body }), { kind: 'reply', body });
});

test('"VetWiki has nothing on this" is recognised whichever way it arrives', () => {
  const insufficient = [{ id: 'c1', text: 'ยังไม่มีเนื้อหา', supportType: 'insufficient-evidence', support: [] }];
  assert.equal(isEmptyAnswer(insufficient, { covered: false }), true);
  assert.equal(isEmptyAnswer(insufficient, { covered: true }), true, 'a model that found nothing');
  assert.equal(isEmptyAnswer([], {}), true);
  const sourced = [{ id: 'c1', text: 'x', supportType: 'vetwiki-verified', support: [{ sectionId: 's' }] }, ...insufficient];
  assert.equal(isEmptyAnswer(sourced, { covered: true }), false);
  const analysis = [{ id: 'c1', text: 'x', supportType: 'vetmock-analysis', support: [] }];
  assert.equal(isEmptyAnswer(analysis, { covered: true }), false, 'labelled analysis is still an answer');
});

test('related sections are real, deduplicated and few', () => {
  const s = (id) => ({ subject: 'com5', topic: 'rabies', topicTitle: 'Rabies', sectionId: id, heading: id });
  const out = relatedSections({ related: [s('a'), s('a'), { sectionId: 'x' }, s('b'), s('c'), s('d')] });
  assert.deepEqual(out.map((r) => r.sectionId), ['a', 'b', 'c']);
  assert.deepEqual(relatedSections(undefined), []);
});

const TOPICS = [
  { subject: 'com3', topic: 'seizure', title: 'Seizure & Narcolepsy', summary: 'Generalized vs focal, status epilepticus' },
  { subject: 'com5', topic: 'rabies', title: 'Rabies — โรคพิษสุนัขบ้า', summary: 'Lyssavirus, 3 phases' },
  { subject: 'com5', topic: 'vaccine', title: 'Pet Vaccination Guidelines', summary: 'WSAVA 2024 core vaccination' },
];

test('without the server, a Thai question still finds the English-titled article it is about', () => {
  assert.equal(relatedTopicsFor('ลมชักในสุนัขรักษายังไง', TOPICS)[0]?.topic, 'seizure');
  assert.equal(relatedTopicsFor('โรคพิษสุนัขบ้ามีกี่ระยะ', TOPICS)[0]?.topic, 'rabies');
  assert.deepEqual(relatedTopicsFor('zzzz qqqq', TOPICS), []);
  // "cat" is not inside "vaccination"
  assert.ok(!relatedTopicsFor('cat', TOPICS).some((t) => t.topic === 'vaccine'));
});

test('the document shelf is offered one real word at a time, most specific first', () => {
  assert.deepEqual(libraryTerms('Norberg angle วัดยังไง').slice(0, 2), ['norberg', 'angle']);
  assert.ok(!libraryTerms('ค่าเทอมเท่าไหร่').includes('เท่า'));
});

test('the missing-term line quotes at most three terms and says nothing when there are none', () => {
  assert.equal(unmatchedLine(['norberg']), 'ไม่พบคำว่า “norberg” ในคลังความรู้');
  assert.equal(unmatchedLine([]), '');
  assert.equal(unmatchedLine(['a', 'b', 'c', 'd']).match(/“/g).length, 3);
});

test('the copy is plain Thai: no separator dots and no tooling words', () => {
  for (const [key, text] of Object.entries(ASK_COPY)) {
    assert.ok(!text.includes('·'), `${key} uses a middle dot`);
    assert.doesNotMatch(text, /\b(AI|model|Claude|DeepSeek|LLM)\b/i, `${key} names tooling`);
    assert.ok(!text.includes('ข้อสอบเก่า'), key);
  }
});

test('a weak guess offers nothing: no short Thai fragments, no animal alone, no "examine" titles', () => {
  const topics = [
    { subject: 'avian-medicine', topic: 'avian-coryza', title: 'Infectious Coryza (หวัดหน้าบวม)', summary: 'Avibacterium paragallinarum' },
    { subject: 'com4', topic: 'derm-parasitic', title: 'Parasitic Skin Diseases', summary: 'Demodex (deep scrape), Sarcoptes (zoonotic)' },
    { subject: 'com5', topic: 'cve', title: 'CVE — Canine Viral Enteritis', summary: 'CPV + CCV' },
    { subject: 'equine-repro', topic: 'eqrepro-exam-mare', title: 'การตรวจระบบสืบพันธุ์แม่ม้า', summary: '' },
  ];
  // วัด (measure) is inside หวัด (cold); only an alias knows where a word ends.
  assert.deepEqual(relatedTopicsFor('Norberg angle วัดยังไง', topics), []);
  // Wet mange is Demodex: the dog and "ตรวจ" alone must not pull in CVE or a mare exam.
  assert.deepEqual(relatedTopicsFor('ขี้เรื้อนเปียกในสุนัขตรวจยังไง', topics).map((t) => t.topic), ['derm-parasitic']);
});
