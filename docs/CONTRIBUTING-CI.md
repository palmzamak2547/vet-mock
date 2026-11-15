# Before you push: the short rules

For everyone who changes VetMock, on any machine. The long forms are [GITFLOW.md](GITFLOW.md) and
AGENTS.md; this page is what to do so a pull request goes green the first time.

Why it exists: from 9 to 15 Nov 2026, 100 pull requests needed a median of 2 pushes and 47.5% of first
pushes were green. Of the 84 CI rounds lost, 51 were things a few minutes on your machine find (a unit
test, the spec the pull request itself changed, the size budget, the env contract, a lint), and 22 were
browser tests that pass only on their retry.

## 1. Run the gate before you push (the hook does it for you)

`npm ci` in your worktree installs a pre-push hook (`.githooks/pre-push`, through the `prepare` script).
Every `git push` then runs `npm run gate:push` first:

| step | what | why |
|---|---|---|
| data | every step of `scripts/lint-data.list`, to the end | lints, stale generated files, `lint:env`, `stats:check`, typecheck |
| unit | the unit suite in UTC, as CI runs it | |
| build | `npm run build` | after the lints, so they judge the committed files |
| budget | `perf:budget` (`perf-budgets.json`) | 8 rounds lost to bytes over a budget |
| dist | bank chunks and the contrast audits | |
| specs | every spec file your branch adds or changes, on Chromium desktop and WebKit phone, with one retry and `--fail-on-flaky-tests` | 16 rounds lost to a spec the same pull request changed |

CI's first job (`build`) runs the same script, so a push that passes here passes that job.

- It tests the working tree, so it refuses to run while a tracked file differs from the commit you push:
  commit or stash first. A tree that already passed is not run again.
- One-off bypass, printed in the push output and logged in the git dir (`vetmock-gate/bypass.log`):
  `VMX_SKIP_GATE=1 git push`. Use it for a docs-only push or when CI is what you want to see; never to
  get around a red step.
- To run it by hand: `npm run gate:push`. `npm run gate` is the older, longer local gate (every spec on
  Chromium) and stays optional.

## 2. What CI runs, in order

One workflow, `Smoke e2e` (`.github/workflows/smoke-e2e.yml`): `build` (the gate above) first; then
`changed specs` (your changed spec files on all four engines); then the eleven e2e runners. Beside them:
`unit (clock windows)`, `Annotation PostgreSQL`, VCA and Research R parity when their files changed. A
draft runs `build` only; mark it ready once it is done (GITFLOW.md, section 1). Every required check
stays required: `build`, `smoke`, `Annotation PostgreSQL`, `VCA`, `Research R parity`.

A run marked **cancelled** because you pushed again is not a failure: read the newest run for the newest
commit.

## 3. Tests that hold on every engine and at every hour

- **The clock.** Never build "today" from the machine's date or zone. Pass one fixed instant, and count
  study days in Bangkok through `src/lib/study-day.js`. `npm run test:unit:clock` runs the unit suite in
  UTC with the clock moved to 17:05 and 23:55 UTC, the last day of the month and 29 February; CI runs it
  on every pull request. (A test that built today from the runner's date failed every build from 17:00
  to 24:00 UTC on 15 Nov.)
- **WebKit under Playwright** (CI runs Linux WebKit; three new tests failed only there on 15 Nov):
  - It drops Cache Storage between page loads: seed data a test needs after a navigation through
    `page.addInitScript` (localStorage, IndexedDB written in the page) or a route, not by filling a cache
    on one page and reading it on the next.
  - It rejects a forwarded or fulfilled cross-origin response without CORS headers: give a
    `route.fulfill` for another origin `access-control-allow-origin` (and the headers the request asks
    for).
  - It never fetches again a lazy chunk that failed once in the page, even after a reload: test
    recovery on Chromium and Firefox, and on WebKit only up to the reload offer.
  - It refuses a request started while the next document is pending; wait for the navigation, never
    filter the error.
- **Text from a PDF** comes out in a different order on Linux than on Windows (Thai especially): assert
  on what is drawn, not on the extracted text order.
- **Focus.** A spec that types or presses keys in a view it just opened first awaits
  `expect(page.locator('#main')).toBeFocused()`.
- **Retries.** CI gives each test one retry, but only a test listed in `tests/e2e/unsteady.json` may
  use it: any other test that passes only on its retry fails its job. The list holds the reason and the
  date, and `tests/unit/e2e-unsteady.test.mjs` pins its length to a budget that only goes down. Fix an
  unsteady test at its cause (read its trace first); never raise a timeout without a measured cause.

## 4. Files that two pull requests both touch

- **A new lint** is one script in package.json and one line in `scripts/lint-data.list`, in alphabetical
  order (after `lint:untracked`). Two pull requests that each add a lint then merge without a conflict.
- **Generated files** (`npm run regen:all`): regenerate after merging main, never hand-edit, and commit
  what changed. The gate's data step names any that are stale.
- **The size budget** is absolute: a pull request that grows a budgeted chunk measures it again
  (`node scripts/perf-budget.mjs --write`) and says why in its description.

## 5. The pull request

- **Description:** what changed for a student (or for contributors, for tooling) and how it was tested.
  Nothing private: no machine paths, no account names, nothing about how the work was organised, and no
  tool, model or agent names anywhere in the repository (it is public).
- **Release number:** a change a student can notice takes one when the pull request opens,
  `npm run release:new -- minor` (or `patch`), and keeps it; a collision is resolved by running it again
  (`src/data/changelog/README.md`). Tooling, CI, tests and docs take no number.
- Stage files by name, never `git add -A`. One pull request is one squash commit.

## 6. Proving a release is live

A merge is not proof. For the merge commit's SHA:

1. CI on main's push is green (`build` and `smoke` of that SHA; main reruns a failed job once by itself,
   `main-rerun-once.yml`).
2. The Vercel production deployment of that SHA is READY.
3. vetmock.com serves it: `curl -s https://vetmock.com/ | grep -o 'vmx-build" content="[0-9a-f]*'` shows
   that SHA or a later main commit that contains it. Judge by the SHA, not the version string: a release
   with a lower number can merge after a higher one.
4. Walk the changed flow on vetmock.com, phone and desktop.

Record it in `docs/releases/<version>.md`.
