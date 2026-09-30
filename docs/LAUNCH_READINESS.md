# VetMock — Launch Readiness

## Current checkpoint — 2026-09-30 (Asia/Bangkok)

Baseline source and successful Production records:
`6774daa1d73bb54a81dab307d8175bcd7f55ad26`; observed live study UI 5.133.1.
The live alias-to-SHA mapping requires its own final verification.
Candidate: **5.133.2 / SW v200**, [PR 18](https://github.com/palmzamak2547/vet-mock/pull/18),
initial head `b53b3bf274c8d4fe24ca5c264dab9ab0d696a571`. The reviewed comparator
follow-up has local proof and still needs its exact-head hosted result. The
candidate is **not deployed**; this checkpoint does not declare the backlog zero.

| Surface / gate | Observed state |
|---|---|
| Product entry | [vetmock.com](https://vetmock.com) redirects 307 to [vetmock.vercel.app](https://vetmock.vercel.app) |
| Live study baseline | Exact-base [Build 36411289394](https://github.com/palmzamak2547/vet-mock/actions/runs/36411289394), [Smoke 36411289431](https://github.com/palmzamak2547/vet-mock/actions/runs/36411289431) and Production 6708118976 succeeded |
| Live Research baseline | [research.vetmock.com](https://research.vetmock.com) reachable; Production 6707958321 succeeded for the same base |
| Local candidate | Data/unit gate 51/51, normal build/wiki+Atlas+OG prerenders, three contrast audits and npm audit 0 passed |
| PR 18 at b53b3bf2 | Build passed with 2103 units; both WebKit/Firefox smoke halves passed. Chromium cancelled during browser installation at the 22-minute job cap, before application build/E2E |
| Hosted native R | Recorded package installation passed; comparison reported six analytic-zero differences. The reviewed local repair passes 332/332 M1/M2/comparator tests; hosted follow-up pending |
| MCV / catalog | Authorized current account: 11 courses, 115/115 materials matched, NEW 0; catalog 2042 rows (2034 public + 8 new restricted) |
| Member delivery | Eight authenticated mint/body responses 200 with complete received byte counts matching the objects. Management hashes and 8 anonymous 401 denials passed separately; new live pointer/reader UI pending |

Deployment, installation, numerical comparison and a working user journey are
separate facts. A cancelled setup job supplies no Chromium application result.
Final local Chromium coverage is ongoing with failures retained. Logs and
receipts are under `work/loop-20260930/` and `integrations/`.

## Candidate behavior and verified scope

- SR includes the passage and revealed safe explanation figure with the existing
  zoom boundary. Foreground readiness prevents partial queues; stale intents cancel,
  failed loads offer retry and explicit cached-card review. Twenty distinct focused
  browser cases have passing evidence. The later rejected-background/foreground-retry
  case proved stale planning counts red on the prior artifact, then passed all four
  profiles against the normal rebuilt artifact, one worker and no retries. Original
  setup/teardown and partial-queue failures remain retained.
- Daily sharing reuses the actual preview PNG for repeated native file shares.
- Physical transitive versions brace-expansion 1.1.21 and fast-uri 3.1.8 are patched;
  npm audit 0 is measured. Unit file concurrency is capped at two after recorded
  esbuild service-stop failures under default parallelism. No speed claim is made.
- Native Linux now installs every fixture-recorded version via dependency preparation
  and remotes. Six comparison failures are exact-zero roundoff: Dobson's equal
  treatment totals prove the B/z treatment effects zero, and two group-mean residuals
  are zero. The shared comparator now honors committed absoluteZero metadata plus
  only those two proved residual slots under the existing absolute 1e-10 contract.
  Nonzero NATIVE_REL 1e-9, strict webR rel 0, raw datasets/_fixture and R/package
  version guards remain intact. All 332 local parity/comparator checks pass; wrong
  zero injection 1e-6, tiny real probabilities, input drift and metadata changes still
  fail. Fixtures, R scripts and reference numbers were not regenerated or changed.
- Eight MCV additions are restricted. Original URLs, source authority and the
  redacted student-ID derivative retain provenance. Authenticated complete-body byte
  counts, management hashes and anonymous denial are separate from browser rendering.
  The old live pointer still hangs before HTTP; the shared-prefetch resolver repair
  passes 67 security/recovery cases. New live member-reader acceptance awaits release.
  Exact temporary-test-UID cleanup needs provider/read-back evidence; existing users
  and sessions remain outside cleanup scope.
- All 13 application/test files remain unchanged from b53b3bf2. Only the numerical
  comparator, its new test and the workflow test command change in the follow-up.
  The 16-file functional record is `work/loop-20260930/release-functional-hashes.json`;
  the original 14-file receipt remains
  `work/loop-20260930/release-functional-hashes-b53b3bf.json`.

## Outstanding work and limits

- Obtain exact-head hosted native numerical acceptance after the reviewed repair;
  retain the six original failures and successful installer evidence.
- Complete required browser gates on the fixed artifact and exact head. The initial
  418-case local run was stopped as superseded and is not counted as completed;
  the final 426-case local run is ongoing. PR Chromium's setup cancellation is distinct.
- After exact-SHA checks and Production success, verify SR/repeated PNG sharing and
  the real member pointer → PDF → return flow. Preserve natural worker activation;
  no forced reload, activation or site-data clearing.
- Close and record the exact ephemeral member-test-UID cleanup. Its safe ledger is
  `work/loop-20260930/integrations/member-fixture-safe-ledger.json`; never use a broad
  account sweep or claim completed cleanup without read-back.
- Sync re-land 7146f950 remains a held separate lane: named/livesim/random simulations,
  unit coverage, rollout review and account-local purge of `vmx-user-ack-v1:<uid>`
  precede release. The older open-items ledger is dated input, not today's count.
- Physical iOS, assistive/stylus hardware, new multi-device journeys and social previews
  are not newly proved by emulation or generated metadata. Prior HIBP/host-upgrade
  notes need provider refresh before being described as current blockers.

## Release acceptance

1. Recheck `origin/main`, isolate file ownership and retain other lanes' work.
2. Run `npm run stats` for current inventory; regenerate projections from their sources.
3. Run `npm run gate` on a stable checkout and `npm audit --audit-level=high`.
   Dist audits follow a fresh build; `gate:data` does not replace full acceptance.
4. For Research, run its own unit/timezone, build and browser checks plus native-R
   parity. Numerical fixtures keep their reference provenance and tolerances.
5. Verify changed journeys and relevant failure/recovery/account paths. Preserve
   old documents, learner data and the natural service-worker activation contract.
6. Use one coordinated real main push. Confirm exact-SHA GitHub Build + Smoke,
   relevant Research checks and each Vercel Production deployment, then exercise
   the changed flow on the live origin. No extra vercel --prod after the push.
7. Replace this checkpoint with the actual result and remaining limits; update the
   concise AGENTS handoff. Keep raw traces under work/ and retain original failures.

Cross-harness coordination follows [CONTINUOUS-IMPROVEMENT.md](CONTINUOUS-IMPROVEMENT.md)
and `work/loop-20260930/COORDINATION.md`. Grok is unavailable; no acknowledgement is
invented. The standalone live dashboard `http://127.0.0.1:41936/` is separate from production.

Earlier launch receipts and both guide variants are preserved unchanged in
[handoff/history-2026-09-30/](handoff/history-2026-09-30/), with checksum records.
Their previous missing-material, advisory-progress and permission statuses are historical.
