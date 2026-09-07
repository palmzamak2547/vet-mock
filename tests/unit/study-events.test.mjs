import test from 'node:test';
import assert from 'node:assert/strict';
import { createAttemptEntries, createQuestionTiming, createReviewEvent, newStudySessionId, questionRevision, validSessionId } from '../../src/lib/study-events.js';
import { memoryIndexedDb } from '../helpers/memory-indexed-db.mjs';
import { initCard, updateCard } from '../../src/hooks/sm2.js';
import { parseStudyEventArchive, studyEventArchive } from '../../src/lib/study-event-archive.js';

const question = { id: 10, type: 'mcq', q: 'Example?', options: ['a', 'b'], answer: 1, subject: 'com5', year: 4 };
const attempts = (sessionId = newStudySessionId()) => createAttemptEntries({ questions: [question], answers: { 10: 1 }, sessionId, questionTimes: { 10: 2500 }, now: 1000 });

test('attempts keep the chosen answer and revision without inventing confidence', () => {
  const id = newStudySessionId();
  assert.equal(validSessionId(id), true);
  const [event] = attempts(id);
  assert.equal(event.correct, true);
  assert.equal(event.answer, 1);
  assert.equal(event.elapsedMs, 2500);
  assert.equal(event.confidence, null);
  assert.equal(event.id, attempts(id)[0].id);
  assert.notEqual(questionRevision(question), questionRevision({ ...question, answer: 0 }));
});

test('visible-time accounting excludes hidden tabs and survives a resume', () => {
  let now = 100;
  const timing = createQuestionTiming({}, () => now);
  timing.enter(10);
  now = 600; timing.visibility(false);
  now = 10000; timing.visibility(true);
  now = 10200;
  assert.equal(timing.snapshot()[10], 700);
  timing.enter(11);
  now = 10500; timing.stop();
  assert.deepEqual(timing.snapshot(), { 10: 700, 11: 300 });
  timing.reset(timing.snapshot()); timing.enter(10); now += 100;
  assert.equal(timing.snapshot()[10], 800);
});

test('review events preserve the explicit 0-3 rating and before/after state', () => {
  const before = initCard(10), after = updateCard(before, 1);
  const event = createReviewEvent({ question, before, after, quality: 1, sessionId: newStudySessionId() });
  assert.equal(event.quality, 1);
  assert.equal(event.before.interval, before.interval);
  assert.equal(event.after.interval, after.interval);
  assert.equal(parseStudyEventArchive(studyEventArchive([event])).success, true);
});

test('the detailed ledger isolates owners, retries idempotently and keeps failed writes exportable', async () => {
  const db = memoryIndexedDb();
  globalThis.indexedDB = db;
  try {
    const log = await import('../../src/lib/study-event-log.js?test=owners');
    const events = attempts();
    assert.equal((await log.appendStudyEvents('a', events)).ok, true);
    assert.equal((await log.appendStudyEvents('a', events)).ok, true);
    assert.equal((await log.listStudyEvents('a')).length, 1);
    assert.equal((await log.listStudyEvents('b')).length, 0);
    assert.equal((await log.pendingStudyEvents('a')).length, 1);
    await log.markStudyEventsSynced('a', [events[0].id]);
    assert.equal((await log.pendingStudyEvents('a')).length, 0);
    db.failWrites = true;
    const next = attempts();
    assert.equal((await log.appendStudyEvents('a', next)).ok, false);
    assert.equal((await log.listStudyEvents('a')).length, 2, 'the unsaved event must still be exportable');
    db.failWrites = false;
    assert.equal((await log.appendStudyEvents('a', next)).ok, true);
    assert.equal((await log.listStudyEvents('a')).length, 2);
  } finally { delete globalThis.indexedDB; }
});


test('an acknowledged memory event is durable after reload, and export never treats failed reads as empty', async () => {
  const db=memoryIndexedDb();globalThis.indexedDB=db;
  try {
    const log=await import('../../src/lib/study-event-log.js?ack=first');
    const events=attempts();db.failWrites=true;
    assert.equal((await log.appendStudyEvents('a',events)).ok,false);
    db.failWrites=false;
    assert.equal((await log.markStudyEventsSynced('a',[events[0].id])).ok,true);
    const reload=await import('../../src/lib/study-event-log.js?ack=reload');
    assert.equal((await reload.listStudyEvents('a')).length,1);
    assert.equal((await reload.pendingStudyEvents('a')).length,0);
    db.failReads=true;
    await assert.rejects(reload.listStudyEvents('a'),/read-unavailable/);
  } finally {delete globalThis.indexedDB;}
});
