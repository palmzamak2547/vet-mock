```js
// Changelog entry for the wave's release file (src/data/changelog/<version>.js).
{ kind: 'fix', scope: 'system', title: 'ระบบตรวจตัวเองละเอียดขึ้น', desc: 'ก่อนปล่อยแต่ละรุ่น แอปตรวจการคิดคะแนนทุกแบบข้อสอบโดยอัตโนมัติ และเปิดทุกหน้าบนจอมือถือเพื่อหาหน้าที่พัง คะแนนที่คิดผิดหรือหน้าที่เสียจึงหลุดไปถึงนิสิตได้ยากขึ้น' },
```

# Structural guards

Tooling and tests only: nothing a student sees and nothing about scoring changes. The one app edit
is a `data-view` attribute on `#main` that only tests read. The change to the required `smoke`
workflow is not in this branch: it ships alone on `claude/smoke-state`.

## Scoring finding (first): two Thai look-alikes are marked wrong

A fill-in key typed in a form that looks identical on screen is marked wrong:

- `น้ำตาล` typed with SARA AM as NIKHAHIT + SARA AA (`U+0E4D U+0E32` for `U+0E33`): NFC does not join
  them.
- `กิ่ง` typed with the tone mark before SARA I (`ก่ิง`): NFC reorders only marks that both have a
  combining class, and SARA I has none.

The scoring code is not changed here; both are rows of `KNOWN_FAILURES` in
`tests/unit/scoring-invariants.test.mjs`, asserted to still fail, so the fix deletes them. How
often students type these forms is not measured.

## 1. A release number that main already holds fails `lint:data`

- **Failure it closes.** 5.206.0, 5.207.0 and 5.212.0 were each taken twice on 11 Nov.
- **Mechanism.** `lint:release-number` (in `lint:data`, so in Build) fails when a release file the
  branch adds names a version main already holds from another pull request: the same file with
  other content, main's `changelog.js`, or main's `docs/releases/<v>.md` added after the branch
  started. It works on a branch (merge base) and on a pull request's merge commit (first parent),
  fetching main fresh. Renumbering is written down once, in `src/data/changelog/README.md`.
  `release:new` itself is unchanged except `--help`. A remote reservation was built and removed:
  since rule 7 only the main session takes a number, and its marker commits would have published a
  local email and branch name. `git ls-remote origin "refs/vmx-release/*"` is empty.
- **Proof.** `tests/unit/lint-release-number.test.mjs`: a collision fails on a branch and on a merge
  commit made before main took the number; editing an old release file or taking a free number
  passes; with no main to compare it skips and says so.

## 2. No screen may break silently (on demand, not a gate)

- **Failure it closes.** A screen that throws, loads a missing file, draws nothing, never finishes
  loading, scrolls sideways or prints `undefined` reached students unnoticed whenever no spec
  opened it; the other specs' route lists are typed by hand.
- **Mechanism.** `npm run test:e2e:sweep` (chromium-mobile and webkit-mobile; Playwright arguments
  pass through) runs `tests/e2e/route-sweep.spec.js`, which `playwright.config.js` leaves out of every
  other run unless `VMX_ROUTE_SWEEP=1`. Routes come from `APP_VIEW_ROUTES` plus `/wiki` and `/#lab`; a
  view App.jsx renders with no route and no reason in `NOT_ROUTED` fails. Each route is opened at
  390x844 as a seeded year-5 student and as a first-time visitor, and each visit asserts the screen
  it drew through `#main[data-view]`: the view itself, or the redirect the app is right to make,
  named in `OUTCOME` (the sign-in card on the five pages that need an account, the landing page for
  a first-time visitor on a year-scoped page). A test checks `OUTCOME` against the code that makes
  those redirects (`AUTH_REQUIRED_VIEWS` in App.jsx, `frontDoorFor`). A visit also fails on another
  screen or the error card, still loading after 30 s, a console or page error or unhandled rejection,
  a failed same-origin request (a file answered with the app's page included), a blank main,
  sideways scroll, or visible `undefined`/`NaN`/`null`/`[object Object]`. `/api/*` answers 503 and
  third-party hosts are cut off. A self-test page proves the detectors. `KNOWN` only shrinks.
- **Proof.** 35 routes (33 from `APP_VIEW_ROUTES`, `/wiki`, `/#lab`) x 2 personas, with the
  registry check, the redirect-table check and the detector self-test: 146 tests a run on the two
  phone engines. One local run (chromium-mobile and webkit-mobile, 1.5 min): 140 passed, and every
  visit with an expected redirect drew it (the sign-in card on groups, leaderboard, account, race and
  review queue; the landing page for a first-time visitor on the seven year-scoped pages). The 6
  failures were the spec's own: `/app/atlas` is a separate entry (`atlas.html`) whose `#main` had
  no `data-view` (added in `src/atlas-main.jsx`), and the self-test page was served without a
  charset, so its Thai loading line did not match. Both are fixed; the rerun that proves them waits
  for a short queue on the browser lane. No route failed any other check, so `KNOWN` is empty.
- **Unproven / next.** Not in CI: it becomes an advisory job on `claude/smoke-state` later and a
  gate after 4 Dec. Firefox was not run (the local pre-check is the two phone engines). Screens that
  need a running set or an account are in `NOT_ROUTED` and not opened.

## 3. A score can never be wrong

- **Mechanism.** `tests/unit/scoring-invariants.test.mjs`, a seeded PRNG of its own, no new
  dependency: 300 generated papers of every type (MCQ, true/false, fill-in ordered and unordered,
  matching as array and map, short answer, essay) with blank, right and wrong answers, against a
  count written in the test from what each type means (the independent check). Marks and totals
  (App.jsx's count is inline, modelled and pinned to App.jsx's text); a blank in every cleared shape
  never counts; marking does not depend on option shuffling (twelve fresh session seeds, every row,
  the catch-all kept last); answering in any order, changing and clearing answers, and resuming at a
  random point through the in-flight record into the real `useExamSession` give the same score; the
  fill-in fragment rule on each side of its 60% line; Thai and accented keys with and without NFC;
  short answers one keyword either side of the 75% line and a misspelt keyword; every bank question
  earns the mark for its own key. The server's `scoreSubmission`, fed the body `finishExam` builds
  through JSON, agrees with the client, also for a resumed paper, and keeps the client's count
  marked `client` when it cannot verify. Client and server import the same `isCorrect`, so that
  agreement checks the wiring between them (body, JSON, revisions, fallback), not the marking.
- **Proof.** All hold on main except the two Thai look-alikes above. Breaking the count on purpose
  failed three tests.
- **Unproven.** The tap and digit-key mappings are modelled, not driven: Question.jsx needs a large
  harness to mount, and `option-shuffle-keyboard.test.mjs` already pins the key path. The race
  mode's own scoring is not covered.
