# VetMock Gitflow — one main, many harnesses

This repo runs with several agents and the owner committing into the same tree,
often at the same time. The rules here consolidate what already lived in
AGENTS.md's durable rules and docs/CONTINUOUS-IMPROVEMENT.md into one place, so
a harness does not have to re-derive them (or learn them by causing a regression).

---

## 1. Releases are pull requests; a merge to `main` is the deploy

Release pipeline v2 (owner-approved 2026-10-20), simplified on 2026-10-22 (OWNER DECISION at the top
of AGENTS.md): CI is the gate. Before v2 sessions negotiated push order and version numbers by message
and each ran a ~70 min local gate; now:

1. **Worktree from origin/main.** `git worktree add C:/dev/vetmock-<lane> -b <prefix>/<lane> origin/main`,
   its own `npm ci` (and `npm ci` in research/ when you touch research/).
2. **Release note as its own file.** User-observable work runs `npm run release:new -- minor`
   (or `patch`): it writes `src/data/changelog/<version>.js` with the next number free on
   origin/main and in every open pull request. Proof goes in `docs/releases/<version>.md`.
   `package.json`'s version is not bumped. Nothing else is edited by every release, so two
   releases do not conflict.
3. **No local gate before the pull request.** CI runs everything the local gate runs and more (WebKit,
   Firefox, Postgres), free on GitHub, while a local gate waited behind the machine-wide lock
   (`C:\dev\heavy-gate.lock`, held 35-45 min by other projects' gates) and the RAM floor: on 2026-10-22
   six finished changes sat unmerged for hours. Run a spec locally only to debug a CI failure.
   `npm run gate` stays for that, and for anyone who wants local evidence: phases A-C (data, unit in
   Bangkok and UTC, build, contrast and size budgets, Research when research/ changed), then every e2e spec on Chromium
   desktop and phone (about 13 min; it used to be smoke plus the specs a branch touched, and PR #42 went
   red in CI in a spec it never touched). Its ports are derived from the worktree path
   (`tests/e2e/local-port.js`). `npm run gate:full` runs the full four-profile matrix.
4. **Push the branch and open the PR.** `git push -u origin <branch>`, `gh pr create`, then
   `gh pr merge --squash --auto`. CI runs Build, Annotation PostgreSQL, Smoke e2e (7 runners),
   VCA and Research R parity (the last two do real work only when their files changed).
5. **Merging.** The ruleset on `main` requires those five checks. It no longer requires the branch to be
   up to date with main, and the Queue workflow (`.github/workflows/queue.yml`) is disabled: its bot
   updates left runs waiting in `action_required` (#45 waited 215 min). A pull request merges when its
   own checks pass. Rebase, or merge main into the branch, only when GitHub reports a conflict.
6. **Deploy, then watch main.** The merge is a push to `main`: CI runs again on that SHA and Vercel
   promotes the production build once `build` and `smoke` pass. Watch that run; if it goes red, fix
   forward or `git revert` at once. Vercel builds nothing else: every project's Ignored Build Step
   skips non-production builds (`vercel.json`, `research/vercel.json`, `vca/scripts/vercel-ignore.sh`).
7. **Prove it** (unchanged): exact-SHA CI, the Vercel production deployment, the live flow on
   vetmock.com, recorded in `docs/releases/<version>.md`. A merge is not proof.
8. **Performance budgets** (2026-10-22): smoothness must not regress, and the check must never be the thing
   that is flaky, so CI fails only on numbers a machine cannot move, and timings are measured by hand.
   - *What CI enforces* (`perf-budgets.json`, the measured number written beside every budget):
     the gzip size of the JavaScript and CSS of the first load and of the key lazy views (Home, the exam,
     results, a VetWiki article), read from the build's manifest by `npm run perf:budget` (a step of Build,
     and phase C of `npm run gate`, no browser); Home's request count and image bytes on a first visit; and
     layout shift (CLS) of Home, a practice set, its results and `/wiki/com5/rabies`, the median of 3 fresh
     visits against 0.01 (`tests/e2e/perf-budget.spec.js`, Chromium projects of Smoke e2e; other hosts are
     aborted, so a font CDN cannot move it). A page that is above 0.01 today is budgeted at its measured value,
     so the check is green on the day it lands, and AGENTS.md lists the gap as work to do.
   - *Changing a budget* needs a measured reason in the pull request body. Measure again
     (`node scripts/perf-budget.mjs --write` for sizes; `UPDATE_PERF_BUDGETS=1 npx playwright test
     tests/e2e/perf-budget.spec.js --project=chromium-desktop --workers=1`, then `chromium-mobile`, for the rest) and
     commit the file. `tests/unit/perf-budget.test.mjs` rejects a budget that is not its measured value plus the
     stated rule (3%, or 0.01 for CLS), so a looser number cannot be typed in. A breach is fixed at its cause, not rerun.
   - *Timing, by hand, never in CI*: `npm run perf` (`scripts/perf.mjs`) runs headed Chromium with the GPU, a 4x CPU
     throttle and a 390x844 touch context, median of 5, under `C:\dev\heavy-gate.lock` (a runner has no GPU, and
     headless Chromium times transform and opacity animations on the main thread). It measures the slowest
     interaction (Event Timing) on answer, next, the exam map and a tab bar navigation, LCP of Home and of a VetWiki
     article, long tasks over 50 ms during the interactions, and frame times while scrolling and while a screen
     changes. A metric fails only when it is above `perf-baseline.json` by more than max(3 x its median absolute
     deviation, 5%, 2 ms), after the slower scenario is measured again and the runs are pooled.
     `npm run perf -- --update` records a new baseline after a change that moves timings on purpose.
     **Every release pull request body includes the table `npm run perf` prints.**

Rules that stay:

- Never push to `main` directly, never `vercel --prod`, never an empty redeploy commit.
- A red check is fixed at its cause, never rerun hoping it passes; no timeout raise or
  `test.slow()` without a measured cause. CI warns on any e2e test over 40% of its timeout
  (`scripts/e2e-durations.mjs`, report artifact `e2e-durations-*` on every run).
- One PR is one squash commit on main. Keep a PR to one release; 88 commits in one push
  (5.143.0) once tripped GitHub's rate limit for Vercel's fetch (section 6).

## 2. Lanes and the one claim record

- All harnesses share **one** claim record: `work/loop-20260930/COORDINATION.md`
  (gitignored, local). Each claim states: objective, branch/base, owned files or
  hunks, current checks, blockers, next step.
- **File ownership is disjoint.** Before touching a file, read the claim record
  and the working tree. If another lane holds it, take a different slice or wait.
  Shared surfaces — `src/App.jsx`, `src/data/*`, `package.json`, sync and schema
  files — need explicit hunk ownership, not just file ownership.
- Reading another lane's record does not mean it acknowledged a handoff. Mark
  acknowledgement only after an actual reply; never infer another harness's
  activity from a branch, a process, or an absent objection.
- Untracked work belongs to whoever created it. Never sweep another lane's
  untracked files into your commit.

## 3. Worktrees for competing changes

When two lanes must edit overlapping or build-coupled files, separate them into
worktrees instead of serializing on one checkout:

```bash
git worktree add ../vet-mock-<lane> -b <lane-branch>
cd ../vet-mock-<lane> && npm ci   # the worktree's OWN install — always
```

- **A worktree runs its own `npm ci` after any lockfile change.** A node_modules
  junction into the primary checkout silently bundles the primary checkout's
  packages and produces results the worktree cannot reproduce.
- E2E ports are per worktree already (derived from its path); `PLAYWRIGHT_PORT` still
  overrides when two paths happen to hash alike.
- Integrate back to `main` with the standard checklist below; recheck `main`
  immediately before integrating, and retain the other lanes' edits when
  resolving any conflict.

## 4. Commit conventions

- Imperative title, ≤72 chars; body explains *why*.
- HEREDOC for multi-line bodies. **No agent co-author trailer — this is a
  public repo** (see Critical Rule 1).
- Quote object keys that start with `-` or a digit (Critical Rule 5).
- User-observable changes need a `src/data/changelog.js` entry (Critical Rule 2);
  refactor/SEO/build work lives in git history only.
- Split unrelated concerns into separate commits (e.g., visual icon pass in one
  component ≠ layout rework in another). Stage **exact files only** — `git add`
  paths, never `git add -A` in a shared checkout.

## 5. Integration checklist

Before a lane's pull request is set to auto-merge:

1. Branch from a fresh origin/main.
2. CI on the pull request is the gate; a red check is diagnosed at its cause (section 1).
3. Stage exactly your files; confirm `git status` shows no other lane's work staged.
4. A release note file from `npm run release:new` when the change is user-observable.
5. `gh pr merge --squash --auto`; after the merge, watch main's CI and Vercel for that exact SHA.
6. Verify the real user journey against the deployed URL; record the proof chain in
   `docs/releases/<version>.md` and update the claim record.

## 6. When something goes wrong

- **Bad commit already on `main`:** `git revert` it with a new commit. Never
  force-push `main`, never rewrite published history.
- **A lane's commit swept another lane's files:** stop, leave the tree alone,
  and reconcile on the claim record before any further push. Do not "fix" it
  with a second sweeping commit.
- **Gate failed after push:** the deploy is still live; revert forward (revert
  commit) rather than re-running the deploy hoping it passes.
- **Vercel reports `git_info_fail` for the push** (the deploy fails before any
  build step, e.g. "GitHub fetch error 403 secondary rate limit"): do not push
  again and do not add an empty commit. Create one production deployment of the
  same SHA through the Vercel API (`POST /v13/deployments` with a `gitSource`
  naming this repo, `ref: main` and that `sha`). It builds as usual but lands
  **STAGED**, not serving the domains, so promote it with
  `POST /v10/projects/{projectId}/promote/{deploymentId}`, confirm every
  production alias points at that deployment, then run the usual proof chain on
  the exact SHA. It replaces the failed deploy, so it is not a second deploy on
  top of a good one.
