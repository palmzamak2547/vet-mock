```js
// Changelog entry for the wave's release file (src/data/changelog/<version>.js).
{ kind: 'fix', scope: 'system', title: 'ระบบตรวจตัวเองละเอียดขึ้น', desc: 'ก่อนปล่อยแต่ละรุ่น แอปจะเปิดทุกหน้าบนจอมือถือและตรวจการคิดคะแนนทุกแบบข้อสอบโดยอัตโนมัติ หน้าที่พังหรือคะแนนที่คิดผิดจึงหลุดไปถึงนิสิตได้ยากขึ้น' },
```

# Structural guards

Four guards, each closing a class of failure that happened or would cost the most if it did.
Tooling and tests only: nothing a student sees and nothing about scoring changes.

## 1. Two lanes can never take the same release number

- **Failure it closes.** `release:new` saw only numbers in open pull requests, so lanes that ran it
  before either opened its pull request collided: 5.206.0, 5.207.0 and 5.212.0 were each taken twice
  on 11 Nov.
- **Mechanism.** `release:new` now reserves the number on the remote before writing the file: it
  pushes a marker commit (empty tree, one line naming the branch) to `refs/vmx-release/<version>`
  with `--force-with-lease=<ref>:`, which the remote accepts only if that ref does not exist. A refused
  caller adds that number to the taken set and tries the next. Numbers already reserved count as
  taken. If the remote cannot be reached the old pick is used with a loud warning and the command
  to reserve it by hand. `--help`, `minor|patch` work as before; new: `--no-reserve`, `--remote`.
  `lint:release-number` (in `lint:data`, so in Build) fails when a release file the branch adds names
  a version main already holds from another pull request (same file with other content, main's
  `changelog.js`, or main's `docs/releases/<v>.md` added after the branch started); it works on a
  branch (merge base) and on a pull request's merge commit (first parent), fetching main fresh.
  Renumbering is written down once, in `src/data/changelog/README.md`.
- **Proof.** `tests/unit/release-reserve.test.mjs`: five separate processes with five clones race
  against one bare remote from the same view of main; all five get different, consecutive numbers,
  the remote holds exactly those five refs, and at least one caller was refused and moved on. An
  unreachable remote falls back and says why. Against GitHub itself: a probe ref under
  `refs/vmx-release-probe/` was created, a second create was refused (`stale info`), and the probe was
  deleted. `tests/unit/lint-release-number.test.mjs`: a collision fails on a branch and on a merge
  commit made before main took the number; editing an old release file or taking a free number passes.
- **Unproven.** The first real reservation on GitHub happens when the wave's number is taken. A lane
  on an older checkout still uses the old script until it rebases.

## 2. A green pull request can always merge, and e2e always runs before a merge

- **Failure it closes.** PR #200 sat blocked with every check green: a push and "ready for review"
  seconds apart made two Smoke e2e runs on one commit; the newer came from the push, whose payload
  still said draft, so its job was `smoke (draft, ...)`, and GitHub, which reads a required check
  from the newest run, answered `Required status check "smoke" is expected`.
- **Mechanism.** A first job, `state`, reads whether the pull request is a draft from the API when
  the run starts (`ready_for_review` is ready by definition; if the API does not answer, the payload
  decides, with a warning). `changes`, every job after it and the name of the job behind `smoke` use
  that answer. With the per-pull-request concurrency group the newest run is created after every
  toggle before it, so it reads the state as it is. A run that read draft on a pull request that is
  ready by its end fails loudly and says to re-run the whole run. The header of `smoke-e2e.yml` has
  the table of every ordering (push then ready, ready then push, both within a second, back to draft,
  a fork, docs only) and what `smoke` reports, plus the cost of one pull request in runs and
  job-minutes. Nothing required is weakened; no branch rule or setting changes.
- **Proof.** Reasoned through every ordering (the table); `tests/unit/smoke-matrix.test.mjs` pins
  that nothing but `state` reads the payload's draft flag and that the draft path fails loudly.
- **Unproven.** Actions cannot run locally. Until a pull request exercises it: that the API reflects
  the toggle within the seconds before the newest run's `state` starts, and that `needs` in a job's
  name evaluates as documented.

## 3. No screen may break silently

- **Failure it closes.** A screen that throws, loads a missing file, draws nothing, scrolls sideways
  or prints `undefined` reached students unnoticed whenever no spec happened to open it; the route
  lists in other specs are typed by hand and miss new screens.
- **Mechanism.** `tests/e2e/route-sweep.spec.js` takes its routes from `APP_VIEW_ROUTES`
  (`src/lib/view-route.js`) plus `/wiki` and `/#lab`, and fails when App.jsx renders a view that has
  neither a route nor a reason in its `NOT_ROUTED` list (or the list names a view that is gone).
  Each route is opened at 390x844 as a seeded year-5 student (paper, history of real questions,
  review cards, a bookmark, a streak) and as a first-time visitor, and fails on a console error,
  page error or unhandled rejection, a failed same-origin request (including a script, style,
  picture or font answered with the app's HTML, which is how the preview server hides a missing
  file), a blank main, horizontal overflow, or the visible text `undefined`, `NaN`, `null` or
  `[object Object]`. `/api/*` answers 503 (no model or paid endpoint is reached; every screen must
  survive its functions being down) and third-party hosts are cut off. A self-test page that breaks
  every rule must be caught on all five. `KNOWN` (the allow-list) fails when a listed failure no
  longer happens, so it only shrinks. CI runs it on a runner of its own (`route sweep`,
  chromium-mobile, `VMX_ROUTE_SWEEP=1`); every other runner skips it, because chromium mobile
  already used 6.9 of its 14 minutes on #207.
- **Proof.** 37 routes x 2 personas, 75 tests with the two checks. Chromium mobile alone: all 71
  route tests passed. All four engines at once on one machine (SWEEP_ALL). The detector self-test
  catches all five kinds. Main fails no route today: `KNOWN` is empty.
- **Unproven.** Its CI time (estimated 8-10 job-minutes on its own runner, parallel to the others,
  so no longer wall-clock). Screens that need a running set or an account (topic, config, exam,
  results, review, notes, group, connect) are listed in `NOT_ROUTED` and not opened. Some student
  screens still showed a loading line after 8 s on a loaded machine (reported as a `still-loading`
  annotation, not failed).

## 4. A score can never be wrong

- **Failure it closes.** A wrong mark or total reaches a student's result, history and the
  leaderboard with nothing to notice it.
- **Mechanism.** `tests/unit/scoring-invariants.test.mjs`, a seeded PRNG of its own and no new
  dependency, over 300 generated papers of every type (MCQ, true/false, fill-in with ordered and
  unordered blanks, matching as array and as map, short answer, essay) with blank, right and wrong
  answers. Against an oracle written in the test: every mark and every total (App.jsx's count, pinned
  to App.jsx's text so a change there fails the test); a blank answer in every cleared shape never
  counts; marking does not depend on option shuffling (twelve fresh session seeds, every row, the
  catch-all kept last); answering in any order, changing answers and clearing them, and resuming at a
  random point through the in-flight record App writes, read back by `readOwnedExam` into a fresh
  `useExamSession` (the real hook) give the same score; the server's `scoreSubmission`, fed the body
  `finishExam` builds through JSON, agrees with the client and the oracle, also for a paper resumed
  from storage; when it cannot verify (a custom question, a question edited since, a missing
  version) it keeps the client's count marked `client`, and refuses an impossible claim. Over the
  real bank: every auto-graded question gives the mark for its own key on the client and the server,
  MCQ keys lie inside their options, true/false keys are booleans, and a matching key that uses one
  right side twice has a bank that holds it (the card is one-to-one otherwise).
- **Proof.** All invariants hold on main (no known failure). Mutating the count (counting a typed
  fill-in as right) fails three of the tests.
- **Unproven.** The inline counts in App.jsx are pinned by text, not executed; the race mode's own
  scoring is not covered.
