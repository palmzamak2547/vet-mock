# Pending: exam data gaps (from the guard tests)

```js
// Changelog lines (Thai, what a student notices). kind / scope as in src/data/changelog.js.
// The revision change (item 2) is not something a student sees, so it has no line.
{ kind: 'fix', scope: 'system', title: 'ผลสอบที่ยังไม่ได้ส่งอยู่ในไฟล์สำรองแล้ว', desc: 'ชุดที่ทำตอนออฟไลน์และยังไม่ได้ส่งเข้าบัญชี ไฟล์สำรองเก็บผลไว้ด้วย นำเข้าที่เครื่องอื่นแล้วระบบส่งให้ครั้งเดียว' },
{ kind: 'fix', scope: 'system', title: 'ชุดที่ค้างไว้ใช้โจทย์ฉบับล่าสุด', desc: 'กลับมาทำชุดที่ค้างไว้หลังอัปเดต จะเห็นโจทย์ คำอธิบาย และรูปฉบับปัจจุบัน คำตอบ ลำดับข้อ และเวลาที่ทำไว้ยังอยู่ครบ' },
```

Branch `claude/exam-data-gaps`, cut from `origin/claude/infrastructure-wave` (2645cbd2). One commit per item. Each fix
has a unit test that failed on the old code first (run on the reverted files, then restored); only the touched test
files and the existing tests that read the changed modules were run locally (33 files, 319 tests; 55 files, 503 tests;
all green). No cloud run.

## 1. Unsent exam results are in every backup (3b9400bd)
- `pendingExamResults` is now in BACKUP_FIELDS, the backup schema (`id` and `user_id` UUIDs, `question_ids` 1 to 5,000
  ids, `answers` a plain object, optional `question_versions`; at most 1,000 records), the error labels, the import
  preview, the progress backup download and the account export. The progress reset (ล้างความคืบหน้าหลัก, now
  `progressResetPatch()`) leaves it alone: a finished set waiting to be sent is the student's exam result, not
  practice progress, and still reaches the account after a reset (fixed in review; `user-data-field-lists` records it).
- What a restore does: the other fields are replaced by the file's copy, as before. The outbox is added to instead:
  results already waiting on the device stay (the device's copy wins on the same id), and the file's results join
  them, only those whose `user_id` is the signed-in account. Signed out, the outbox is left alone and the preview
  says why. A foreign record could never be stored for this account anyway (the server keeps a result only for
  its caller).
- Restoring phone A's backup on phone B: B's own history, bookmarks, notes, cards, checklist, custom questions and
  streak are replaced by the file's, exactly as before this branch (the preview lists what will be overwritten).
  B's results still waiting stay and are still sent; A's waiting results from the file join them (same account),
  and one the server already has is acknowledged without a second row.
- Nothing may block the outbox for ever (fixed in review):
  - an entry carrying the id of another account's stored result made `record_exam_receipt` raise "Receipt
    unavailable", which `api/exam-result.js` answered 503, a retry, so the outbox stopped at it on every flush. The
    API now answers that error 409 `result_conflict` (`signedRpc` keeps the function's own message as
    `error.detail`); the outbox sets the record aside and sends the rest. No migration;
  - a record of another account at the head (an old device-wide key, the origin move) made the outbox throw on every
    flush. It is now skipped and left where it is;
  - after a single conflict the notice keeps its own words (ส่งจากอีกแท็บ… กรุณาสำรองผลชุดนี้) instead of the
    general line.
  Test: `tests/unit/exam-result-queue-unblocked.test.mjs` (the handler for that error and for a database that is
  down, the outbox past a 409 and past a foreign record). They failed on the old code.
- Sent twice: harmless. `record_exam_receipt` (migration 20261011120200) inserts `ON CONFLICT (id) DO NOTHING` and
  returns ok with the stored row when the stored `submission_fingerprint` equals the new one. The fingerprint
  (`api/_lib/exam-scoring.js`) is a SHA-256 of the record's own question ids, the versions it carries and its
  answers, so the same record always gives the same fingerprint: one row, counted once, acknowledged and dropped
  from the outbox. (A record edited by hand under a known id gets `result_conflict`, 409, and is set aside, as
  before.)
- Test: `tests/unit/pending-exam-results-backup.test.mjs` (round trip, merge by id and owner, older files, malformed
  records refused, same record same fingerprint). Before the fix 3 of its 5 tests failed. `user-data-field-lists`
  no longer lists the outbox as a gap, so it now walks this field through every list.

## 2. `unordered` and `keywords` are in the revision (2023f422)
- `questionRevision` appends `{ unordered, keywords }` to the hashed text only when a question carries one of them.
  Printed over the 9,047 bank questions: 391 revisions change, exactly the 391 that carry them (389 `short`, 2 `fill`:
  questions-poultry.js #4002 and #4012); the other 8,656 are unchanged.
- Short answers (389): never in a sent result (the outbox's `question_ids` and the server's catalog leave out
  written types) and never raced (mcq only). Only the `questionVersion` stored with new attempts differs, and
  nothing reads it back. No result before or after the release changes.
- The two fill questions: a result holding one, finished and sent before the release, is verified as before. One
  finished before and sent after (the outbox) reaches a server whose revision differs, so it is stored with
  `score_source: 'client'` and dropped off the default board. Fixed in review: the server also accepts the previous
  revision of a question that carries `unordered` or `keywords` (`acceptedQuestionRevisions` in study-events.js, the
  same formula without those two fields: #4002 `q1-4f884c30`, #4012 `q1-1a748086`) and re-scores it as usual with
  today's fields, which are the rule the student answered under, so such a result is verified (`server`). Every
  other question accepts only its one revision. Caveat: if `unordered` on those two is ever edited, a result from
  before 5.214 arriving after that edit is graded by the new grouping; the outbox sends within seconds of a
  connection, so this stays theoretical. One finished after the release is verified. A result sent before whose
  response was lost and is retried after is acknowledged by its unchanged fingerprint.
- A set parked before and resumed after takes the new copy (item 3) and is verified, unless one of its questions was
  kept as parked or is missing from the bank: then the server cannot verify that question, treats the whole paper as
  unverified and stores it with `score_source: 'client'` and the device's count. The counts agree; only the flag (and
  with it the default board) is lost.
- Test: `question-revision-coverage.test.mjs` now checks behaviour, not source text: each hashed field changes the
  revision, every other field does not, only the carriers changed against the nine-field hash, and the grader,
  run through a Proxy on every bank question with many answers, reads no field outside the hash (this catches
  destructuring and helpers anywhere). It lists no scoring field outside the hash. Before the fix 2 of 4 failed.

## 3. A resumed set uses the current bank (78de83d6)
- `refreshParkedQuestions(parked, QB)` in `src/lib/exam-recovery.js`, called by `resumePendingExam` in App.jsx for a
  set still being answered, after loading the banks of the set's years (8 s at most; offline it keeps the parked copy).
- Refreshed: the whole question from the bank, so every content field (stem, passage, passage title, `say`,
  explanation and `explainSay`, figures and their text, written guides, filing and provenance, the key, `unordered`,
  `keywords`). Kept: the answers, the order of questions, the current question and the time, which sit beside the
  questions in the parked record and are not touched; and `noShuffle`, the order the options were shown in.
- Options changed: if `type`, `options`, `pairs`, `distractors` or `blanks` differ in any way, the question stays
  exactly as parked, so an index always names the option picked. A corrected key with the same options is taken:
  the student keeps the option they picked, graded by the key now.
- Not refreshed: a question the bank no longer has, an id that now names another subject's question (a student's
  own question), and a submitted set (graded on its parked copy). Questions are found by subject and id (review);
  the bank today has no id shared by two subjects (9,047 ids, 0 shared), so that only guards the future.
- The wait is guarded (fixed in review): one resume runs at a time (a second tap joins the first), the card reads
  กำลังเปิด… and cannot be tapped from the tap until it settles, and after the wait the resume carries on only if the
  student is still on Home with the same parked record (same `sessionId` and `savedAt`). A new set started, or the
  set discarded, during the wait wins. `src/lib/parked-resume.js`; `tests/unit/parked-resume-race.test.mjs` covers
  two taps with the first timing out (answers given after it opened survive, the questions do not change), a new
  set during the wait, a discard during the wait, a newer save of the same set, and a submitted set.
- Races are not changed: two racers on two builds still draw their own copies until the older one reloads.
- Test: `tests/unit/parked-set-refresh.test.mjs`, one test per case, plus the wiring in `resumePendingExam`. On the
  old code the file could not load (no `refreshParkedQuestions`; the resume primed the session from
  `saved.questions` as stored).

## 4. Notes only
- **83 bank and note files without a chunk rule.** Today nothing goes wrong: each is a dynamic import, so Rollup
  makes it its own chunk, and lint:bank-chunks confirms that after every build. What could go wrong: a new file whose
  name starts with an existing rule's text (questions-vca-*, questions-com3-*, questions-y5-swine-clinic-*) would
  share that rule's chunk; `data-chunk-rules.test.mjs` now fails on that before any build. Smallest safe step: none
  before 4 Dec. After it, FRAG-2: derive the chunk name from the file name in one rule. That renames 83 chunks once
  (one cache miss per bank for each student), so it goes with the Vite 8 move.
- **15 handlers with no region decision.** They run in the default, sin1, beside Supabase and R2, which is the
  choice 5.180.0 made for everything not measured as US-bound. Nothing breaks; at worst one is a round trip slower
  than it could be (all but calendar and evidence-pass call the US limiter once). `function-regions.test.mjs` now names them. Smallest safe step:
  measure with `node scripts/probe-api-latency.mjs` after the finals; move one only on that measurement.
- **`connect-apps` without a route.** A reload or a shared link on that screen lands on Home. The OAuth return does
  not depend on it (`external-connect-callback` redirects to `/app/library`), and its buttons stay hidden until the
  provider credentials exist. Smallest safe step: give it `/app/connect` in view-route.js with a cover in
  og-covers.js (lint:og needs one) when the connections are switched on; `view-registration.test.mjs` then asks for
  both.
