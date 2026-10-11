# VetMock Gitflow — one main, many harnesses

This repo runs with several agents and the owner committing into the same tree,
often at the same time. The rules here consolidate what already lived in
AGENTS.md's durable rules and docs/CONTINUOUS-IMPROVEMENT.md into one place, so
a harness does not have to re-derive them (or learn them by causing a regression).

---

## 1. `main` is the deploy

- Every push to `main` auto-deploys via Vercel. There is no staging branch and
  no separate deploy step. **A main push is a production event, not a save.**
- Push **one coordinated real commit**. Never add `vercel --prod` on top of it,
  never push an empty redeploy commit, never burst-push a series.
- **A release lands as a squashed `main`: one commit, or a handful.** Integrate
  the lanes on a release branch, then put the result on `main` squashed
  (`git merge --squash`, or a soft reset onto `origin/main` and one commit); the
  lane history stays on its branches. One push of 88 commits (5.143.0,
  2026-10-11) sent Vercel's GitHub fetch into a secondary rate limit (403), and
  the production deploy failed with `git_info_fail` before it built anything.
  Recovery is in section 6.
- Docs-only commits deploy too, which is harmless — but do not push while
  another lane is mid-work on `src/` unless the change is independent of it.
  When in doubt, commit locally and let the owner time the push.
- Production proof stays multi-step (exact-SHA CI + smoke E2E, successful Vercel
  deployment, live flow against `vetmock.com`), recorded in
  [LAUNCH_READINESS.md](LAUNCH_READINESS.md). A push is not proof.

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
- Keep `PLAYWRIGHT_PORT` scoped to E2E only so parallel lanes do not steal each
  other's dev server port.
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

Before a lane's work lands on `main`:

1. Recheck `main` (`git fetch` + diff against it) — integrate a fresh base, not
   the base you started from.
2. `npm run build` passes in the tree you are committing.
3. Applicable gates pass: `npm run gate:data` for fast data/unit diagnosis, the
   full `npm run gate` for a release. Read the gate process's own exit code,
   not a filter's.
4. Stage exactly your files; confirm `git status` shows no other lane's work
   staged.
5. One commit, one push. Watch the Vercel build for that exact SHA.
6. Verify the real user journey against the deployed URL; record the proof
   chain in [LAUNCH_READINESS.md](LAUNCH_READINESS.md) and update the claim record.

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
