// ============================================================
// agent-actions — the catalog validator + the model-output parser
// ============================================================
// The agent's whole safety story is that the model only PICKS and the
// validator re-grounds. Every rejection path here was designed against a
// failure seen live on the first battery run.

import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCatalog, validateAction } from '../../api/_lib/agent-actions.js';
import { extractJSON, hasCJK } from '../../api/_lib/llm.js';

const catalog = buildCatalog();

test('the catalog is built from real app data', () => {
  assert.ok(catalog.practiceSubjects.some((s) => s.id === 'com5'));
  assert.ok(catalog.practiceSubjects.every((s) => s.id === 'all' || s.id));
  assert.ok(catalog.wikiTopics.some((t) => t.subject === 'com5' && t.topic === 'rabies'));
  assert.ok(catalog.features.some((f) => f.id === 'vetcalc'));
});

test('a fabricated subject id cannot become an action', () => {
  const v = validateAction({ type: 'practice', params: { subject: 'made-up-999', numQuestions: 20 } }, catalog);
  assert.equal(v.ok, false);
});

test('a fabricated wiki pair cannot become an action', () => {
  const v = validateAction({ type: 'wiki', params: { subject: 'com5', topic: 'no-such-topic' } }, catalog);
  assert.equal(v.ok, false);
});

test('a fabricated feature id cannot become an action', () => {
  const v = validateAction({ type: 'feature', params: { id: 'rm -rf' } }, catalog);
  assert.equal(v.ok, false);
});

test('numbers are clamped to the app limits, not trusted', () => {
  const v = validateAction({ type: 'practice', params: { subject: 'com5', numQuestions: 9999, useTimer: true, timePerQ: 1 } }, catalog);
  assert.equal(v.ok, true);
  assert.equal(v.action.invoke.numQuestions, 50);
  assert.equal(v.action.invoke.timePerQ, 20);
});

test('a valid practice request becomes the exact invoke the palette already dispatches', () => {
  const v = validateAction({ type: 'practice', params: { subject: 'com5', numQuestions: 30 } }, catalog);
  assert.equal(v.ok, true);
  assert.deepEqual(v.action.invoke, {
    kind: 'practice', mode: 'quick', subject: 'com5', practiceMode: 'all', numQuestions: 30,
  });
});

test('type none and unknown types both refuse', () => {
  assert.equal(validateAction({ type: 'none', params: { reason: 'x' } }, catalog).ok, false);
  assert.equal(validateAction({ type: 'shell', params: {} }, catalog).ok, false);
  assert.equal(validateAction(null, catalog).ok, false);
});

// ── extractJSON — the parser that replaced lastIndexOf('}') ──────────────

test('extractJSON survives the trailing junk a model appended live', () => {
  assert.deepEqual(extractJSON('{"a":{"b":1}}"}'), { a: { b: 1 } });
  assert.deepEqual(extractJSON('noise {"x":"}"} tail'), { x: '}' });
  assert.equal(extractJSON('no json here'), null);
  assert.equal(extractJSON('{"broken":'), null);
});

// ── hasCJK — output-language enforcement ─────────────────────────────────
// The primary model dropped "主要通过" into a Thai claim on prod
// (2026-08-29). The detector must fire on any CJK while never flagging
// the Thai + English-technical-term mix every legitimate answer uses.

test('hasCJK catches the exact contamination seen live, and kana', () => {
  assert.equal(hasCJK('โรคพิษสุนัขบ้าติดต่อ主要通过การถูกสัตว์กัด'), true);
  assert.equal(hasCJK('ผลตรวจ：ปกติ'), true); // fullwidth CJK punctuation
  assert.equal(hasCJK('ワクチン'), true);
});

test('hasCJK never flags normal Thai-English veterinary prose', () => {
  assert.equal(hasCJK('ยา amoxicillin 12 mg/kg PO q12h (ห้ามใช้ในแมว)'), false);
  assert.equal(hasCJK('ล้างแผล ใส่ยา กักหมา หาหมอ และฉีดวัคซีนให้ครบ 99%'), false);
  assert.equal(hasCJK(''), false);
  assert.equal(hasCJK(null), false);
});
