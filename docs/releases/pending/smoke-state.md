```js
// No changelog entry: this changes CI only, nothing a student notices (AGENTS.md Rule 2).
```

# The required `smoke` check reads the draft state when its run starts

Ships alone: it changes the workflow behind the required `smoke` check, so a problem has one cause
and one revert.

- **Failure it closes.** PR #200 sat blocked with every check green: a push and "ready for review"
  seconds apart made two Smoke e2e runs on one commit; the newer came from the push, whose payload
  still said draft, so its job was `smoke (draft, ...)`, and GitHub, which reads a required check
  from the newest run, answered `Required status check "smoke" is expected`.
- **Mechanism.** A first job, `state`, reads whether the pull request is a draft from the API when
  the run starts (`ready_for_review` is ready by definition; if the API does not answer, the payload
  decides, with a warning). `changes`, every job after it and the name of the job behind `smoke` use
  that answer. A draft run's last step reads the API three times over about a minute and fails on
  any answer that is not "draft" (a stale `false` and an API error alike), naming the way out:
  `gh pr update-branch <n>` or a push (a re-run of failed jobs keeps `state`'s first answer and fails
  again). The workflow header has the table of every ordering and the cost of one pull request.
- **Proof so far.** Reasoned through every ordering; `tests/unit/smoke-matrix.test.mjs` pins that
  only `state` reads the payload's draft flag and the three-read rule of the draft step.
- **Unproven.** Actions cannot run locally; see the checklist.

## Checklist for the first pull request that carries it

1. The head commit's check-runs (`gh api repos/palmzamak2547/vet-mock/commits/<sha>/check-runs --jq '.check_runs[].name'`)
   show exactly `smoke` on a ready pull request, never the raw `${{ ... }}` expression, also while
   the run is still pending; on a draft they show `smoke (draft, e2e runs once marked ready)`.
2. The `state` job's log has the line `event pull_request/<action>, payload draft=..., now draft=...`
   and its answer matches the pull request.
3. The merge API's state (`gh api repos/palmzamak2547/vet-mock/pulls/<n> --jq .mergeable_state`) is
   `clean` once every required check passed, and `blocked` while `smoke` is pending.
4. One deliberate `gh pr ready <n>` within a second of a push, on a draft: the newest run is named
   `smoke`, runs e2e, and the pull request becomes mergeable without another event.
5. Fallback if the job name does not behave (the raw expression shows, or the name stays draft on a
   ready pull request): revert only the `name:` line of the `smoke` job to plain `smoke`, keep `state`
   for gating, and say so in the next release notes.
