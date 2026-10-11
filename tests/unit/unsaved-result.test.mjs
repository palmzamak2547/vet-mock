// ============================================================
// unsaved-result.test.mjs — a finished set whose result never reached the
// local store is work to protect (OV-exam-2), the saved subject is the set's
// own (OV-exam-5)
// ============================================================
// What a student could lose before the fix: after changeUserData refused the
// local save, finishExam kept the result only in finishedEntriesRef and in the
// in-flight record (submitted: true, localSaved: false). The results screen
// then offered แก้ข้อที่ผิด and ทำต่ออีก 5 ข้อ with no check; unfinishedWork
// returned null for any submitted record, useExamSession's replay removed the
// key, the autosave of the new set overwrote it, and App nulled the refs on
// the new session id. The only copy was gone without a word.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { unsavedResult, unfinishedWork, runSubjectFor } from '../../src/lib/app-flow.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = read('src/App.jsx');
const SESSION = read('src/hooks/useExamSession.js');

test('a submitted record that was never saved locally is an unsaved result; anything else is not', () => {
  const base = { questions: [{ id: 1 }, { id: 2 }, { id: 3 }], answers: { 1: 0, 2: 'ตับ', 3: '' } };
  assert.deepEqual(unsavedResult({ ...base, submitted: true, localSaved: false }), { answered: 2, total: 3 });
  assert.equal(unsavedResult({ ...base, submitted: true, localSaved: true }), null, 'saved: nothing to protect');
  assert.equal(unsavedResult({ ...base, submitted: true }), null, 'a record from before the flag is not claimed');
  assert.equal(unsavedResult({ ...base, submitted: false, localSaved: false }), null, 'an unfinished set is unfinishedWork, not this');
  assert.equal(unsavedResult({ submitted: true, localSaved: false, questions: [], answers: {} }), null);
  assert.equal(unsavedResult(null), null);
  // Age never matters: a result that was never saved is worth as much a day later.
  assert.deepEqual(unsavedResult({ ...base, submitted: true, localSaved: false, savedAt: Date.now() - 48 * 60 * 60 * 1000 }), { answered: 2, total: 3 });
  // ...and unfinishedWork still says nothing about it, which is why both are checked.
  assert.equal(unfinishedWork({ ...base, submitted: true, localSaved: false }), null);
});

test('the saved subject is the set\'s own: one subject names it, a mix is all', () => {
  assert.equal(runSubjectFor([{ subject: 'one-health' }, { subject: 'one-health' }]), 'one-health');
  assert.equal(runSubjectFor([{ subject: 'one-health' }, { subject: 'zoonoses' }]), 'all');
  assert.equal(runSubjectFor([]), 'all');
  assert.equal(runSubjectFor([{ subject: 'vca' }, {}]), 'vca', 'a question without a subject does not make a mix');
});

test('App protects an unsaved result before a new set or a redo round replaces it', () => {
  const guard = APP.slice(APP.indexOf('const protectUnsavedResult = async'), APP.indexOf('const retryDetails = async'));
  assert.ok(guard.length > 0, 'the guard is declared beside the retry and backup handlers it calls');
  assert.match(guard, /unsavedResult\(record\)/);
  assert.match(guard, /confirmLabel: canRetry \? 'ลองบันทึกอีกครั้ง' : 'ดาวน์โหลดข้อมูลสำรอง'/);
  assert.match(guard, /cancelLabel: canRetry \? 'ดาวน์โหลดข้อมูลสำรอง' : 'ยังไม่เริ่ม'/);
  assert.match(guard, /confirmLabel: 'เริ่มชุดใหม่', cancelLabel: 'ยังไม่เริ่ม'/, 'the record is discarded only on this confirmation');
  const start = APP.slice(APP.indexOf('const confirmReplaceUnfinished'), APP.indexOf('const startExam = async'));
  assert.match(start, /if \(!\(await protectUnsavedResult\(/, 'the start guard asks first');
  const replay = APP.slice(APP.indexOf('const replayQuestions = useCallback'), APP.indexOf('// Open ONE named question'));
  assert.match(replay, /if \(!\(await unsavedGuardRef\.current\(requestOwner\)\)\) return;/, 'the redo round asks too');
  assert.match(APP, /unsavedGuardRef\.current = protectUnsavedResult;/, 'through a ref, because the redo callback is memoised once');
});

test('the session replay leaves an unsaved result in storage for App to decide about', () => {
  const replay = SESSION.slice(SESSION.indexOf('const replayQuestions = useCallback'), SESSION.indexOf('const startNewSession'));
  assert.match(replay, /unsavedResult\(/, 'the key is read before it is removed');
  assert.doesNotMatch(replay, /^\s*try \{ window\.localStorage\?\.removeItem\(inflightExamKey\(ownerId\)\); \} catch \{\}/m,
    'the unconditional removal is gone');
});

test('finishExam records the subject of the set it graded, not the subject on screen', () => {
  const finish = APP.slice(APP.indexOf('const finishExam = async () => {'), APP.indexOf('finishExamRef.current = finishExam;'));
  assert.match(finish, /const runSubject = runSubjectFor\(autoQs\);/);
  assert.match(finish, /id: examSessionId, user_id: user\.id, mode, subject: runSubject,/, 'the leaderboard run');
  assert.match(finish, /mode, subject: runSubject, topic, practiceMode, selectedYear, selectedPhase,/, 'the ทำซ้ำ preset');
  assert.equal((finish.match(/\bsubject,\n/g) || []).length, 0, 'no copy of the screen subject is saved any more');
});
