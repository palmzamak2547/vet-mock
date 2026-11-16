// "ยังไม่มีเนื้อหา" and its neighbours may be shown only when they are true.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { subjectCardCopy, topicPrimaryLabel, previewYearSubtitle, NO_CONTENT_TEXT } from '../../src/lib/empty-state-copy.js';

const base = { qbLoading: false, count: 0, hasNotes: false, docs: 0, docsChecked: true, outOfPhase: false };

test('a subject card says "no content" only when the shelf is known to be empty too', () => {
  assert.equal(subjectCardCopy(base).text, NO_CONTENT_TEXT);
  assert.equal(subjectCardCopy({ ...base, qbLoading: true }).kind, 'loading');
  assert.notEqual(subjectCardCopy({ ...base, docs: null, docsChecked: false }).text, NO_CONTENT_TEXT);
  assert.notEqual(subjectCardCopy({ ...base, docs: null, docsChecked: true }).text, NO_CONTENT_TEXT);
  assert.notEqual(subjectCardCopy({ ...base, docs: 3 }).text, NO_CONTENT_TEXT);
  assert.notEqual(subjectCardCopy({ ...base, hasNotes: true }).text, NO_CONTENT_TEXT);
  assert.notEqual(subjectCardCopy({ ...base, count: 5 }).text, NO_CONTENT_TEXT);
  assert.notEqual(subjectCardCopy({ ...base, outOfPhase: true }).text, NO_CONTENT_TEXT);
});

test('the card tooltip says "no content" only in the same case', () => {
  for (const o of [{ docs: null, docsChecked: false }, { docs: null }, { docs: 2 }, { hasNotes: true }, { count: 4 }, { outOfPhase: true }, { qbLoading: true }]) {
    assert.ok(!subjectCardCopy({ ...base, ...o }).title.includes('ยังไม่มีเนื้อหา'), JSON.stringify(o));
  }
  assert.ok(subjectCardCopy(base).title.includes('ยังไม่มีเนื้อหา'));
});

test('an empty, disabled card is the only dead card', () => {
  assert.equal(subjectCardCopy(base).dead, true);
  assert.equal(subjectCardCopy({ ...base, docs: null, docsChecked: false }).dead, false);
  assert.equal(subjectCardCopy({ ...base, docs: 1 }).dead, false);
});

test('a topic with only a VetWiki article is not labelled as having no content', () => {
  assert.ok(topicPrimaryLabel({ label: 'X' }).includes('ยังไม่มีเนื้อหา'));
  assert.ok(!topicPrimaryLabel({ label: 'X', wiki: true }).includes('ยังไม่มีเนื้อหา'));
  assert.ok(!topicPrimaryLabel({ label: 'X', notes: true }).includes('ยังไม่มีเนื้อหา'));
  assert.ok(!topicPrimaryLabel({ label: 'X', count: 3 }).includes('ยังไม่มีเนื้อหา'));
});

test('a preview year subtitle promises documents only when one subject has some', () => {
  const ids = ['a', 'b'];
  assert.equal(previewYearSubtitle({ subjectIds: ids }), '');
  assert.ok(previewYearSubtitle({ subjectIds: ids, docCounts: new Map([['a', 2]]) }).includes('เปิดอ่านได้เลย'));
  assert.ok(!previewYearSubtitle({ subjectIds: ids, docCounts: new Map([['c', 2], ['a', 0]]) }).includes('เปิดอ่านได้เลย'));
  assert.ok(!previewYearSubtitle({ subjectIds: ids, docCounts: null, docsChecked: true }).includes('เปิดอ่านได้เลย'));
});

test('the screens take these words from the helper, not from literals', () => {
  const subj = fs.readFileSync('src/views/SubjectSelectView.jsx', 'utf8');
  const topic = fs.readFileSync('src/views/TopicSelectView.jsx', 'utf8');
  assert.ok(!/['`][^'`]*ยังไม่มีเนื้อหา/.test(subj.replace(/\/\/.*$/gm, '')), 'SubjectSelectView holds no literal');
  assert.ok(!/ยังไม่มีเนื้อหาพร้อมใช้/.test(topic), 'TopicSelectView label comes from topicPrimaryLabel');
  assert.ok(!/เปิดอ่านได้เลย/.test(subj), 'the preview-year subtitle comes from previewYearSubtitle');
});

test('the "waiting for data" phrase is only a comment', () => {
  const lines = fs.readFileSync('src/data/scores.js', 'utf8').split(/\r?\n/).filter((l) => l.includes('รอข้อมูล'));
  assert.ok(lines.every((l) => l.trim().startsWith('//')));
});

test('the held-question queue lists exactly the questions the gate holds', async () => {
  const { BLOCKED_QUESTIONS } = await import('../../src/data/question-delivery.generated.js');
  const rows = fs.readFileSync('docs/content-repair-queue.csv', 'utf8').replace(/^﻿/, '').split(/\r?\n/).slice(1).filter(Boolean);
  assert.deepEqual(rows.map((r) => r.split(',')[0].replace(/"/g, '')), BLOCKED_QUESTIONS.map((b) => b.key));
});
