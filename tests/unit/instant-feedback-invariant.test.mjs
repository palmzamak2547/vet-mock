// The data facts tests/e2e/instant-feedback.spec.js stands on, pinned where
// they fail deterministically.
//
// That spec used to draw a random practice set and skip when it held no
// choice question. It now opens one fixed topic and one fixed subject, and
// relies on every question there rendering option buttons (.vmx-option: type
// 'mcq' or untyped; True/False renders .vmx-tf-btn, match and the written
// kinds render other controls) and, for the topic, on every question mapping
// to a VetWiki article. Practice and exam sets are shuffled slices of those
// pools, so when the data drifts (one True/False item added to the topic) the
// browser spec goes red only on the runs whose draw reaches that item, and a
// CI retry turns that into green. This test reads the same SUBJECT and
// TOPIC_HAS_TEXT constants out of the spec and checks the whole pool, so
// drift fails the unit gate on every run and says what to repoint.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadQB } from '../../src/data/questions.js';
import { SUBJECTS, isSubjectInYear } from '../../src/data/curriculum.js';
import { articleForQuestion } from '../../src/lib/vetwiki/registry-lite.js';

const SPEC = 'tests/e2e/instant-feedback.spec.js';
const spec = readFileSync(new URL('../e2e/instant-feedback.spec.js', import.meta.url), 'utf8');
const constant = (name) => spec.match(new RegExp(`const ${name} = '([^']+)'`))?.[1];
const SUBJECT = constant('SUBJECT');
const TOPIC_TEXT = constant('TOPIC_HAS_TEXT');
// The spec's beforeEach stores this year; a subject outside it has no card to click.
const YEAR = Number(spec.match(/vmx-selected-year',\s*'(\d+)'/)?.[1]);

const rendersOptions = (q) => (q.type == null || q.type === 'mcq') && Array.isArray(q.options) && q.options.length >= 2;
const brief = (qs) => qs.slice(0, 8).map((q) => `${q.id}(${q.type ?? 'untyped'})`).join(', ') + (qs.length > 8 ? `, and ${qs.length - 8} more` : '');
const repoint = `Repoint SUBJECT / TOPIC_HAS_TEXT in ${SPEC} (or fix the bank), then keep this test and the spec in step.`;

test('the instant-feedback spec still names a subject and a topic card it can click', () => {
  assert.ok(SUBJECT && TOPIC_TEXT && YEAR, `could not read SUBJECT, TOPIC_HAS_TEXT and the selected year from ${SPEC}`);
  const subject = SUBJECTS.find((s) => s.id === SUBJECT);
  assert.ok(subject, `subject "${SUBJECT}" is gone from the curriculum. ${repoint}`);
  assert.ok(isSubjectInYear(SUBJECT, YEAR), `subject "${SUBJECT}" is not in year ${YEAR}, which the spec selects. ${repoint}`);
  // Playwright's hasText is a substring match, and a locator that matches two cards is a strict-mode error.
  const cards = (subject.topics || []).filter((t) => !t.hidden && String(t.label).includes(TOPIC_TEXT));
  assert.equal(cards.length, 1, `${cards.length} visible topic cards of "${SUBJECT}" contain "${TOPIC_TEXT}"; the spec needs exactly one. ${repoint}`);
});

test('every question in the spec\'s topic renders option buttons and maps to a VetWiki article', async () => {
  const subject = SUBJECTS.find((s) => s.id === SUBJECT);
  const topic = subject.topics.find((t) => !t.hidden && String(t.label).includes(TOPIC_TEXT));
  const qb = await loadQB();
  const pool = qb.filter((q) => q.subject === SUBJECT && q.topic === topic.id);
  assert.ok(pool.length >= 6, `topic "${topic.id}" has only ${pool.length} questions; the wiki test walks up to 6 cards. ${repoint}`);
  const noOptions = pool.filter((q) => !rendersOptions(q));
  assert.deepEqual(noOptions.map((q) => q.id), [],
    `${noOptions.length} of ${pool.length} questions in ${SUBJECT}/${topic.id} render no .vmx-option: ${brief(noOptions)}. The spec's first card would be one of them on some runs. ${repoint}`);
  const noArticle = pool.filter((q) => !articleForQuestion(q));
  assert.deepEqual(noArticle.map((q) => q.id), [],
    `${noArticle.length} of ${pool.length} questions in ${SUBJECT}/${topic.id} map to no VetWiki article: ${brief(noArticle)}. The summary-button test walks the set until it finds a linked one. ${repoint}`);
});

test('every question of the spec\'s subject renders option buttons, so the exam-mode set is deterministic', async () => {
  const qb = await loadQB();
  const pool = qb.filter((q) => q.subject === SUBJECT);
  assert.ok(pool.length >= 3, `subject "${SUBJECT}" has ${pool.length} questions. ${repoint}`);
  const noOptions = pool.filter((q) => !rendersOptions(q));
  assert.deepEqual(noOptions.map((q) => q.id), [],
    `${noOptions.length} of ${pool.length} ${SUBJECT} questions render no .vmx-option: ${brief(noOptions)}. The exam-mode test would fail on the runs that draw one. ${repoint}`);
});
