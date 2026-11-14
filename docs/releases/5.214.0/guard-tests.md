# Pending: guard tests (debt register phase 1, batch P1)

```js
// Changelog line (Thai). Nothing here changes what a student sees, so by Rule 2 this may stay in git history only;
// if the release keeps a line for it, this is the one. kind / scope as in src/data/changelog.js.
{ kind: 'fix', scope: 'system', title: 'ตรวจความครบถ้วนก่อนปล่อยอัปเดต', desc: 'หน้าใหม่ คลังข้อสอบใหม่ และข้อมูลการเรียนช่องใหม่ ถูกตรวจว่าลงทะเบียนครบทุกที่ก่อนปล่อย ลดโอกาสที่ข้อมูลสำรองจะตกหล่นหรือหน้าเปิดไม่ขึ้น' },
```

Tests only, plus two offline checks joined to `lint:data`. No file a student loads changed. Each test was shown to fail
on a planted mistake (planted, run, reverted); the plants are listed per row.

## FRAG-1a: every list that names a screen (`tests/unit/view-registration.test.mjs`)
- Derives the screens from App.jsx's render branches (`{view === 'x' && <Component`, plus the landing early return):
  50 ids today. Holds to them: lazy-views.js (every branch draws a lazy view, every lazy view is drawn),
  view-route.js (every route opens a screen; every screen has a route or a reason), og-covers.js (every route has a
  cover filed under its own id; every /app cover names a route), feature-registry.js view invokes, App.jsx's
  WIDE/FOCUS/GATE_PUBLIC/FOOTER/AUTH_REQUIRED sets, YEAR_SCOPED_VIEWS, MOCHI_PAGE_POSES, NAV_ITEMS, every
  feature id nav.js names, viewTitle (every screen has a header title or a reason), and that the branches guarded
  by `user &&` are exactly AUTH_REQUIRED_VIEWS.
- Exceptions written in the test: 17 screens without a route (stateful flows, VetWiki's own /wiki pages, #lab,
  the profile hub, legacy mock ids, group-detail, connect-apps), 6 without a header title, 3 covers that are not
  app screens, 2 components that are not screens.
- Planted: a new `bench-two` branch (failed: no route, no title); the pinboard cover removed (failed); `race`
  dropped from AUTH_REQUIRED_VIEWS (failed: a guest would get a blank page); a lazy view declared and never drawn
  (failed).
- Found today: nothing out of step. One thing to decide: `connect-apps` has no address, so a reload on it lands
  on Home.

## FRAG-2a: a chunk rule per bank and note file (`tests/unit/data-chunk-rules.test.mjs`)
- Derives the files from `src/data/(questions|notes)-*.js` (143), the rules from vite.config.js in Vite's order,
  and checks them against `manualChunks` itself. Fails when a rule's text also claims another file, when two files
  would share a chunk, when a rule names no file, when a file is never `import()`ed, and when a new file has no rule.
- Found today: AGENTS says every bank gets an exact rule, but 83 of 143 files have none (all `notes-85-*`,
  `notes-y2-*`, most `notes-y5-*`, the biochem, mid86 and most y5 2026 banks). They are their own chunk only through
  Rollup's default for a dynamic import, which lint:bank-chunks confirms after a build, so nothing is broken. They
  are listed as `NO_RULE_YET`; the list may only shrink. Giving them rules renames their chunks, which is FRAG-2
  (after 4 Dec, with Vite 8).
- Planted: a new `questions-vca-2570.js` (failed: claimed by the `questions-vca` rule, the exact shared-chunk bug
  the vca-reviewed comment describes); the poultry rule renamed (failed: dead rule and a file without a rule); a new
  bank with no rule (failed).

## FRAG-3a: the lists of study-data fields (`tests/unit/user-data-field-lists.test.mjs`)
- Lists named: USER_DATA_FIELDS, BACKUP_FIELDS, the backup schema, its error labels, the import preview, the
  progress screen's backup download and its reset, the account screen's export, and the server's allow-list in the
  newest migration defining `sync_user_data_v2`. Also: the record-key guard in `parseUserBackup` covers exactly the
  keyed-object fields, and the account purge removes every per-account prefix the sync engine writes.
  move-base.js and the purge's prefixes already have pins (move-base.test.mjs, account-local-purge.test.mjs).
- Disagreements today, kept as named gaps (no data path changed):
  - `pendingExamResults` (the exam-result outbox, local only) is in no backup, export, schema or label. A set
    finished offline and not yet sent is lost if the student restores a backup on another device or clears the
    browser first: its score never reaches the server (leaderboard, results). Its answers stay in history.
  - `streak` (legacy number) is in the backup lists but not synced: read on import as streakData, written for older
    versions. Harmless.
  - `customQuestions` is kept by "ล้างความคืบหน้าหลัก". Its dialog lists what it clears and does not name them, so
    this reads as intended. Nothing is lost.
- Checked and fine: the server's allow-list equals the client's synced fields; the purge covers all five
  per-account prefixes.
- Planted: a new synced field `flashDecks` (failed in BACKUP_FIELDS and on the server allow-list);
  readingChecklist dropped from the progress backup (failed); `vmx-user-intent-v2:` dropped from the purge (failed);
  `history` dropped from the SQL allow-list (failed).

## FRAG-6: endpoint lists from the folder (`tests/helpers/api-handlers.mjs`, `chula-api-gate`, `function-regions`)
- `origin/claude/server-hardening` lists handlers inline (`readdirSync(API).filter(.js)` in
  api-hostile-requests.test.mjs) and exports no helper, so this branch adds the smallest local one,
  `tests/helpers/api-handlers.mjs` (`apiHandlerNames()`). That branch's test can switch to it after both merge.
- chula-api-gate: the hand-typed list of 20 gated handlers is gone. A handler is gated when its source awaits
  `requireChula`/`chulaGate` on its request; any other must be in `OPEN`, now a map with each reason. (The old test
  already failed on a new file; now gating one needs no list edit, and a gate removed from a gated file fails.)
- function-regions: every handler must sit in a region list: US_BOUND or the exam flow (iad1), PINNED_SIN1 (ai-chat,
  ai-transcribe), or DEFAULT_SIN1 (the 15 with no vercel.json entry). Before this, 15 of 28 handlers had no decision
  anywhere.
- Planted: a new `api/new-thing.js` with no gate (failed in both); the gate call removed from `api/tts.js` (failed).

## FRAG-7a: what changes a question's revision (`tests/unit/question-revision-coverage.test.mjs`)
- Pins the nine hashed fields (type, q, front, back, options, answer, blanks, pairs, distractors), read from the
  source. Every one of the 52 fields the 9,047 questions carry today is either hashed or in `NOT_HASHED` with what a
  student sees when it is edited. Fails on a new field, on the grader reading a field outside the hash, and on any
  change to the hash.
- What the code does with an unhashed edit: a parked or open set keeps the question objects it began with (App.jsx
  `writeInflight`, resumed by useExamSession), so it finishes on the old passage, figure and explanation. A race lets
  racers on two builds share a room under one revision; the race screen draws `wholeStem` (`say`), so an edited `say`
  shows racers different stems. The server re-scores a sent result on its own current copy with `isCorrect`, so only
  fields the grader reads can move a score.
- Found today, the two to read first:
  - `unordered` (fill: which blanks may come in any order) is read by the grader and not hashed. Edited in a release,
    a result finished before it and sent after is re-scored by the server under the new grouping and still counts as
    verified (`score_source: 'server'`), so the stored score can differ from the one the student saw. 2 questions
    carry it.
  - `keywords` (short answers) is read by the grader and not hashed. Short answers are left out of the server's
    score, so only the device's verdict moves; history keeps two verdicts under one revision.
  - A figure renamed in a release (`image`/`imagePath`) shows as missing in a set parked before it, because the
    parked copy keeps the old path.
  - A passage edit that changes the data a key rests on (5.212.0 moved stem numbers into passage tables) keeps the
    revision: a resumed set answers the old data, and a race may mix the two.
- Planted: a new `hint` field on a com5 question (failed); `isCorrect` reading a new `q.alsoAccept` (failed);
  `distractors` dropped from the hash (failed).

## CI-3: checks that ran nowhere
136 scripts, 102 reached from CI or the gate. The 34 others:
- Joined to `lint:data` (offline, about a second each, green today):
  - `lint:coherence` = `audit-coherence.mjs --check`. The audit printed HIGH findings and always exited 0;
    `--check` exits 1 on any HIGH. Planted a question under subject `com5-planted`: failed.
  - `lint:wiki-sources` = `wiki-coverage.mjs`, which already exits 1 when a claim cites a source missing from the
    registry. Planted `planted-missing-source` in verification.js: failed. (`wiki:coverage` stays as the report name.)
- Valid, needs a database CI has only in a workflow this branch may not touch: `test:rpc-boundaries` (16 of 16 pass
  against pglite 0.5.8, 2.6 s). Add a step beside the three harnesses in smoke-e2e.yml (`--backend=postgres` with
  `PG_CONTAINER`) once the workflow branches land.
- Already covered by the unit suite: `eval:vetwiki` (vetwiki-ask-eval.test.mjs holds the same eval to its floors;
  the script prints the report; 100% hit@5 today).
- Need the network: `verify:sources` (fetches every wiki source link), `audit:instructors` (faculty rosters),
  `test:e2e:prod` (vetmock.com). Keep them manual.
- Need a build or a browser: `perf`, `analyze`, `test:e2e:ui`, `lint:all` (lint:data plus lint:dist, both already
  run by CI).
- Reports, not checks: `wiki:gap`, `wiki:unverified`, `wiki:link-candidates`, `video:progress`.
- Writers and tools: `dev`, `predev`, `release:new`, `fonts:convert`, `regen:question-difficulty` (its `--check` is
  `lint:question-difficulty`, which runs), `fix:academic-safety`, `fix:length`, `fetch:videos`, `flat:transcript`,
  `ping:indexnow`, `clean:local`, `prerender:wiki` (run by `build` by path), `wiki:hashes`, `research:instructors`,
  `research:faculty-expansion`, `generate:instructors`, `ratchet:question-standard`, `prep:explain-rewrite`,
  `sync:wiki-unmapped`.
- None to delete.

## CI-5: the 21 skipped tests in the chromium desktop job
Read from main's run 43026125873 (dd5b5539): 419 passed, 21 skipped, then "the connected specs" step 40 passed.
- 18 need the connected bundle and run, and pass, in that step of the same job: admin-recovery.spec.js:75 and :93,
  chula-wall.spec.js (11: :84, :99, :106, :117, :134, :143, :156, :164, :177, :211, :228),
  external-doc-recovery.spec.js:77, :128, :144, pdf-recent-delete.spec.js:116, private-notes-reader.spec.js:6.
  Reason as written: "Built bundle has no Supabase configuration" (or the "ไม่ได้ต่อกับฐานข้อมูล" screen). On purpose,
  not dead. Recommendation: skip them by project or grep in the plain run rather than at runtime, so the skip count
  falls to 3 and a new skip stands out.
- 3 are phone checks, skipped on desktop on purpose and run on the phone projects: mobile-compat.spec.js:507 ("a
  phone check"), profile-nav.spec.js:35 ("the bottom bar is the phone surface"), smoke.spec.js:545 ("the pill is the
  phone layout"). Keep.
- Skipped because flaky: none. Dead: none. Nothing was unskipped.

## Unit suite
- Added: about 2.5 s over the five new or changed files (view-registration 0.2 s, data-chunk-rules 0.9 s,
  user-data-field-lists 0.2 s, question-revision-coverage 0.4 s, gate and regions 0.3 s). No build, no network.
