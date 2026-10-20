# VetMock Gitflow — one main, many harnesses

This repo runs with several agents and the owner committing into the same tree,
often at the same time. The rules here consolidate what already lived in
AGENTS.md's durable rules and docs/CONTINUOUS-IMPROVEMENT.md into one place, so
a harness does not have to re-derive them (or learn them by causing a regression).

---

## 1. Releases are pull requests; a merge to `main` is the deploy

Release pipeline v2 (owner-approved 2026-10-20). Until then sessions negotiated push order and
version numbers by message and each ran a ~70 min local gate; now:

1. **Worktree from origin/main.** `git worktree add C:/dev/vetmock-<lane> -b <prefix>/<lane> origin/main`,
   its own `npm ci` (and `npm ci` in research/ when you touch research/).
2. **Release note as its own file.** User-observable work runs `npm run release:new -- minor`
   (or `patch`): it writes `src/data/changelog/<version>.js` with the next number free on
   origin/main and in every open pull request. Proof goes in `docs/releases/<version>.md`.
   `package.json`'s version is not bumped. Nothing else is edited by every release, so two
   releases do not conflict.
3. **Local gate: `npm run gate`.** Phases A-C as before (data, unit in Bangkok and UTC, build,
   contrast, Research when research/ changed since origin/main), then e2e on Chromium for smoke
   and the specs your branch changed. Its preview, concurrent and contrast ports are derived from
   the worktree path (`tests/e2e/local-port.js`), so gates in different worktrees never collide.
   `npm run gate:full` runs the full four-profile matrix here when you need it.
4. **Push the branch and open the PR.** `git push -u origin <branch>`, `gh pr create`, then
   `gh pr merge --squash --auto`. CI runs Build, Annotation PostgreSQL, Smoke e2e (7 runners),
   VCA and Research R parity (the last two do real work only when their files changed).
5. **The queue.** The ruleset on `main` requires those checks and an up-to-date branch. The
   Queue workflow (`.github/workflows/queue.yml`) brings the oldest auto-merge PR that is behind
   main up to date and re-runs its checks; GitHub squash-merges it when they pass. One PR lands
   at a time, each tested on the exact main it lands on. GitHub's own merge queue needs an
   organization-owned repository, which this is not.
6. **Deploy.** The merge is a push to `main`: CI runs again on that SHA and Vercel promotes the
   production build once `build` and `smoke` pass. Vercel builds nothing else: every project's
   Ignored Build Step skips non-production builds (`vercel.json`, `research/vercel.json`,
   `vca/scripts/vercel-ignore.sh`).
7. **Prove it** (unchanged): exact-SHA CI, the Vercel production deployment, the live flow on
   vetmock.com, recorded in `docs/releases/<version>.md`. A merge is not proof.

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

1. Branch from a fresh origin/main (the Queue updates it again before merging).
2. `npm run gate` passes in the tree you are committing; read the gate's own exit code.
3. Stage exactly your files; confirm `git status` shows no other lane's work staged.
4. A release note file from `npm run release:new` when the change is user-observable.
5. `gh pr merge --squash --auto`; after the merge, watch Vercel for that exact SHA.
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
