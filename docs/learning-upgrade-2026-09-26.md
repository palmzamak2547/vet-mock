# Learning upgrade candidate — 26 September 2026

Original base: `9fb038d5`. Integrated base: security commit `69e7f158`.
Branch: `codex/learning-upgrade-0926`. Candidate: **5.131.0 / SWv196**.
This is an isolated local candidate, not a production release. The rebase
conflicted only in `AGENTS.md`; both handoffs were retained and every owned
feature/test blob was unchanged. Release metadata was then prepared locally.
The security base is released: exact-SHA Build `36249430184`, Smoke
`36249430130` and Production deployment `6680280408` were read back successful.
Those receipts cover the base, not this learning candidate.

## Observable changes

- The daily plan keeps the chosen 15/30/60-minute budget between visits, puts
  an imminent exam before the review backlog, and uses remaining practice time
  when the wrong-answer set is small. It shows the reason and reading reserve.
- A subject is suggested for extra practice only with at least five valid
  attempts, accuracy below 75%, and available questions. Counts come from
  `buildExamPool`, the same function used to start the session; a thin paper
  cannot promise more questions than it contains. These are planning estimates,
  not claims about mastery or a prediction of scores.
- Home and spaced repetition share a paper-context filter and include personal
  cards in their counts. Home review actions open the context they advertised.
  Midterm/final selection excludes the other paper; unknown and personal cards
  remain available. “ทุกช่วง” restores every paper and continuous material.
  Stored schedules and an already-dealt session are retained.
- Review uses a native subject selector, keeping the paper, session size and
  start controls close together on a phone instead of below dozens of chips.
- A failed optional loading animation leaves plain loading and the requested
  page intact. Idle prefetch rechecks offline and Save-Data status before imports.

## Implementation and integration

- `src/lib/daily-plan.js`, `src/components/NextActionCard.jsx`: one bounded plan
  builder; removed the obsolete recommendation branch that the plan overwrote.
- `src/views/HomeView.jsx`: actual pool counts, lazy Home-only review statistics,
  and one launcher for all three Home review actions. Failed preference writes
  explain that the student must check the retained filters before starting.
- `src/App.jsx`: passes `srCards` to Home; the former eager Home-only count is
  removed. Personal-card loaders stay in the lazy Home chunk.
- `src/hooks/sr-filter.js`, `src/views/SRSessionView.jsx`: shared context, the
  all-paper control, and recovery for a saved subject absent from loaded cards.
- `src/app/lazy-views.js`, `src/components/TopLoadingBar.jsx`: reuse the existing
  idle callback and `OptionalFeature` boundary; no new dependency or framework.

Other active work is excluded: security, bughunt, sync reland, content and
Research Studio. App/Home are narrow integration seams that must be merged
with the other lane's edits, never replaced wholesale. No schema, backend,
clinical content, domain, service worker, or global model settings changed.

## Verification

The results below cover the final integrated 5.131.0 candidate on `69e7f158`.
Functional file hashes were unchanged throughout the browser matrix.

| Check | Result |
|---|---|
| Data/content gates and full unit suites in UTC + Asia/Bangkok | All 51 steps passed |
| Production build and prerenders | Passed |
| Dependency audit | 0 reported vulnerabilities |
| Home, landing and exam contrast audits | Passed, no unexcused failures |
| New/changed browser flows, four profiles | All 28 cases passed in the integrated full run |
| Full regression suite | Chromium: 372 passed, 18 skipped. WebKit/Firefox: 365 passed, 1 flaky that passed retry, 24 skipped. Both commands exit 0: 738 successful cases including the retry, 42 skipped |
| Independent source review | Miswired count prop found and fixed; no remaining actionable finding reported |
| CI, Vercel and live production for 5.131.0 | Not run; no push/deployment from this lane |

The first browser probes caught fixture mistakes (the due label includes `ใบ`,
and saved flashcards mirror `front` into `q`); those were fixed in tests, not
hidden by weakening product assertions. The thin-subject test checks the count
from the Home card through the actual opened set. Other cases cover grading a
private card without deleting other-paper/year records, preserved budget,
320px scope controls, preference-write failure and delayed/failed chunks.

The integrated run's flaky case was the unchanged WebKit landing scroll-state
test; it passed its retry and 3/3 isolated runs with retries disabled. Before
integration, the unchanged Pomodoro expiry test also needed a retry and then
passed 3/3 isolated runs. No timer, landing code or test assertion was changed.
These are observed timing instabilities, not proven root causes or zero-flake
claims; ongoing Pomodoro changes remain owned by the other bugfix lane.

Detailed local evidence: `work/astra-upgrade-20260926/`, including
`SYSTEM-MAP.md`, `CHECKPOINT.md`, gate/build/audit/browser logs, and a SHA-256
manifest of the functional files under test. The system map inventories the
existing surfaces and canonical data graph; it is not a claim that every
medical fact or production integration was revalidated.

## Remaining release work

Recheck the then-current `origin/main` and concurrent App/Home edits before
the approved release. The candidate already includes its version, learner-facing
changelog and worker version. Rerun checks affected by further integration. Production proof
still requires exact-SHA Build + Smoke CI, a successful Vercel Production
deployment and live changed-capability flows. Browser profiles here emulate
devices; physical iOS, signed-in production data and real multi-device sync are
outside this candidate's new validation.
