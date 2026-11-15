// A set finished offline waits on the device in pendingExamResults until /api/exam-result takes it.
// Until 5.214 that outbox was in no backup and no export: restored on another device, or after the
// browser was cleared, a finished set's score never reached the account. Now a backup carries it,
// and a restore adds the file's results to the ones already waiting, by id, and only those of the
// account that is signed in: the outbox stops at a record of another account (exam-result-outbox.js),
// so one such record would hold every later result of this account on the device.
// Sending a result the server already has is safe: record_exam_receipt inserts ON CONFLICT (id) DO
// NOTHING and answers ok when the stored submission_fingerprint equals the new one, and that
// fingerprint is made only from the record itself (ids, the versions it carries, its answers), so
// the same record sent twice is the same receipt, one row, counted once.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseUserBackup, userDataPatchFromBackup, describeBackupFields, pendingResultsForBackup } from '../../src/lib/user-data-schema.js';
import { scoreSubmission } from '../../api/_lib/exam-scoring.js';
import { questionRevision } from '../../src/lib/study-events.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const result = (id, user_id = OWNER) => ({
  id, user_id, mode: 'quick', subject: 'com5', total: 1, correct: 1, pct: 100, duration_sec: 40, year: 4, phase: null,
  question_ids: [7], answers: { 7: 2 }, question_versions: { 7: 'q1-0000abcd' },
});
const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const backup = (extra) => ({ exportDate: '2026-11-11T00:00:00.000Z', version: '5.2', history: [], ...extra });

test('a backup carries the results still waiting to be sent, and a restore brings them back', () => {
  const parsed = parseUserBackup(backup({ pendingExamResults: [result(A)] }));
  assert.equal(parsed.success, true, parsed.reason);
  assert.ok(parsed.fields.includes('pendingExamResults'), 'the import sees the outbox in the file');
  const patch = userDataPatchFromBackup(parsed.data, { ownerId: OWNER, current: { pendingExamResults: [] } });
  assert.deepEqual(patch.pendingExamResults.map((r) => r.id), [A]);
  assert.deepEqual(patch.pendingExamResults[0], result(A), 'the record is restored as it was sent from');
});

test('a restore adds to what is waiting, keeps one copy per id, and takes only this account\'s results', () => {
  const parsed = parseUserBackup(backup({ pendingExamResults: [result(A), result(B), result(C, OTHER)] }));
  assert.equal(parsed.success, true, parsed.reason);
  const waiting = { ...result(A), duration_sec: 41 };
  const patch = userDataPatchFromBackup(parsed.data, { ownerId: OWNER, current: { pendingExamResults: [waiting] } });
  assert.deepEqual(patch.pendingExamResults.map((r) => r.id), [A, B]);
  assert.equal(patch.pendingExamResults[0].duration_sec, 41, 'the copy already on the device wins');
  const signedOut = userDataPatchFromBackup(parsed.data, { ownerId: null, current: { pendingExamResults: [] } });
  assert.equal('pendingExamResults' in signedOut, false, 'signed out, nothing can be sent, so the outbox is left as it is');
  const lines = describeBackupFields(parsed.data, parsed.fields, { ownerId: OWNER });
  assert.ok(lines.some((l) => /ผลสอบรอส่ง 2 ชุด/.test(l) && /บัญชีอื่น 1 ชุด/.test(l)), lines.join(' | '));
});

test('a backup with an older format (no outbox) leaves the waiting results alone', () => {
  const parsed = parseUserBackup(backup({}));
  const patch = userDataPatchFromBackup(parsed.data, { ownerId: OWNER, current: { pendingExamResults: [result(A)] } });
  assert.equal('pendingExamResults' in patch, false);
});

test('an outbox record the server cannot take is skipped and counted, and the rest of the file restores', () => {
  const bad = [{ ...result(A), id: 'not-a-uuid' }, { ...result(A), question_ids: 'x' }, { ...result(A), answers: [] }, { ...result(A), user_id: 5 }];
  for (const b of bad) {
    const parsed = parseUserBackup(backup({ pendingExamResults: [b] }));
    assert.equal(parsed.success, true, `${JSON.stringify(b)}: ${parsed.reason}`);
    assert.equal(parsed.skippedPending, 1);
    assert.deepEqual(parsed.data.pendingExamResults, [], 'a skipped record never enters the queue');
  }
});

test('a backup holding one record with no owner still restores history, notes and bookmarks', () => {
  const { user_id: _drop, ...ownerless } = result(B);
  const file = backup({
    history: [{ date: 1, questionId: 7, subject: 'com5', correct: true }],
    notes: { 'com5:7': 'จำได้' }, bookmarks: [7],
    pendingExamResults: [result(A), ownerless],
  });
  const parsed = parseUserBackup(file);
  assert.equal(parsed.success, true, parsed.reason);
  assert.equal(parsed.skippedPending, 1);
  const patch = userDataPatchFromBackup(parsed.data, { ownerId: OWNER, current: { pendingExamResults: [] } });
  assert.equal(patch.history.length, 1);
  assert.deepEqual(patch.notes, { 'com5:7': 'จำได้' });
  assert.deepEqual(patch.bookmarks, [7]);
  assert.deepEqual(patch.pendingExamResults.map((r) => r.id), [A]);
  const lines = describeBackupFields(parsed.data, parsed.fields, { ownerId: OWNER, skippedPending: parsed.skippedPending });
  assert.ok(lines.some((l) => /ข้าม 1 ชุดที่ระบบส่งไม่ได้/.test(l)), lines.join(' | '));
});

test("a backup writes only the signed-in account's sendable waiting results", () => {
  const { user_id: _drop, ...ownerless } = result(B);
  const stored = [result(A), ownerless, result(C, OTHER), { ...result(A), id: 'x' }];
  assert.deepEqual(pendingResultsForBackup(stored, OWNER).map((r) => r.id), [A]);
  assert.deepEqual(pendingResultsForBackup(stored, null), [], 'signed out, nothing could be sent back');
  const dash = readFileSync(new URL('../../src/views/DashboardView.jsx', import.meta.url), 'utf8');
  assert.match(dash, /pendingExamResults: pendingResultsForBackup\(pendingExamResults, ownerId\),/);
});

test('the same record sent twice is one receipt: its fingerprint comes from the record alone', () => {
  const q = { id: 7, type: 'mcq', q: 'stem', options: ['a', 'b', 'c', 'd'], answer: 2, subject: 'com5', year: 4 };
  const record = { ...result(A), question_versions: { 7: questionRevision(q) } };
  const catalog = new Map([['7', q]]);
  const first = scoreSubmission(record, catalog);
  const again = scoreSubmission(JSON.parse(JSON.stringify(record)), catalog);
  assert.equal(again.id, first.id);
  assert.equal(again.submission_fingerprint, first.submission_fingerprint);
  // And the database acknowledges a known id with that fingerprint rather than storing it again.
  const sql = readFileSync(new URL('../../supabase/migrations/20261011120200_exam_receipt_idempotent_ack.sql', import.meta.url), 'utf8');
  assert.match(sql, /ON CONFLICT \(id\) DO NOTHING/);
  assert.match(sql, /stored\.submission_fingerprint = body->>'submission_fingerprint' THEN\s+RETURN jsonb_build_object\('ok', true/);
});
