# VetMock — Launch Readiness

## Current checkpoint — 2026-09-30 (Asia/Bangkok)

This is a dated verification record, not a claim that every backlog item is closed.
The isolated improvement checkout starts from
`6774daa1d73bb54a81dab307d8175bcd7f55ad26` (study `package.json` 5.133.1).

| Surface | Observed state |
|---|---|
| Product entry | [vetmock.com](https://vetmock.com) answers 307 to [vetmock.vercel.app](https://vetmock.vercel.app) |
| Study app | GitHub [Build 36411289394](https://github.com/palmzamak2547/vet-mock/actions/runs/36411289394) and [Smoke 36411289431](https://github.com/palmzamak2547/vet-mock/actions/runs/36411289431) succeeded for the base SHA |
| Study deployment | GitHub Production 6708118976 succeeded for the same SHA |
| Research app | [research.vetmock.com](https://research.vetmock.com) answers 200; GitHub Production 6707958321 succeeded for the same SHA |
| Research numerical gate | [Research R parity 36411289442](https://github.com/palmzamak2547/vet-mock/actions/runs/36411289442) failed on that SHA during pinned R package installation; the same solver conflict recurred on rerun |
| MyCourseVille / catalog | Current authorized account: 11 courses / 115 entries, 107 shelved / 8 missing; library 2,034 rows, no null subjects or checked course-mapping mismatches |
| Source worker | Study source has SW v199-2026-09-27; current live worker/body/browser acceptance must be checked separately |

Deployment success and HTTP responses establish reachability and provider state.
They do not prove today's full browser journeys, private-account boundaries,
native-R numerical parity or multi-device durability. New fixes are candidates
until their local and exact-SHA production chain is complete. Local evidence:
`work/loop-20260930/`, including `research-parity-failed.log`.

## Outstanding work and validation limits

### Candidate 5.133.2 — 2026-09-30

- SR cards now include their reading passage and revealed explanation figure,
  with left-aligned article text and the existing safe-image/zoom boundary.
  A held native chunk exposed a separate partial-queue start bug. The candidate
  waits for its requested bank scope, reads a fresh queue, cancels stale intents,
  and offers explicit cached-card review after a load failure. Twenty distinct
  focused browser cases have passing evidence; two original Firefox setup/teardown
  failures passed an unchanged serial rerun and remain retained.
  A second foreground-retry probe found stale planning counts when the parent's
  background promise had rejected; QB.length now invalidates the view's memo.
  Its new case is red on the prior artifact and passes all four profiles against
  the normal rebuilt artifact, workers one and retries zero. The final source and
  test hashes are retained with the failure/recovery evidence in work/loop-20260930/.
- Daily question sharing reuses the preview PNG for repeated native file shares.
- Two transitive advisories are patched: physical brace-expansion 1.1.21 and
  fast-uri 3.1.8; current npm audit reports zero. Unit scripts retain all cases
  and cap file concurrency at two after a recorded esbuild service stop under
  the machine's default parallelism. No speed improvement is claimed.
- Research CI prepares dependencies and restores the fixture-recorded versions
  with remotes before native comparison. Reference values and tolerances are
  unchanged; cold native Linux installation and comparison remain required.
- MyCourseVille now matches 115/115 current account-authorized material entries.
  Catalogue: 2,042 rows (2,034 public, eight newly restricted). All eight remote
  objects match expected bytes/hashes; all eight anonymous file requests return
  401. The owner confirmed the existing course-material hosting authority; the
  student-ID derivative preserves the source. The pointer-open stall was traced
  to prefetch returning its own promise after the access await; a narrow shared
  resolver fix passes 67 security/recovery cases. Authenticated production reader
  acceptance awaits the new release and is not implied by the catalogue or hashes.
- Local data lints, normal production build/prerenders, three contrast audits,
  timezone unit evidence, changed-flow tests and 329 Research fixture parity
  cases have passing evidence. Original resource/cold-navigation failures are
  retained. The full artifact/browser and hosted checks still gate release.


- Resolve the Research R parity failure without silently updating reference values
  or weakening tolerances. Its current failure is a survival package pin conflict,
  not a demonstrated numerical mismatch. Preserve the failing log and verify the corrected seam.
- Two dependency advisories were confirmed in the current refresh; narrow fixes
  are in progress. Earlier zero-advisory receipts do not describe this checkpoint.
- Reconcile the eight missing MyCourseVille entries through the existing checked
  manifest/ingest/catalog pipeline. Evidence is under `work/loop-20260930/integrations/`.
  This account/term check does not establish another user's private LMS access.
- Sync re-land `7146f950` remains separate and held. It needs named/livesim/random
  simulator checks, unit coverage and rollout review; purge must cover
  `vmx-user-ack-v1:<uid>` before release.
- The 2026-09-27 open-items ledger is dated triage input. Recheck reachability,
  current source and real behavior before declaring any item fixed or still open.
- Physical iOS, actual assistive/stylus hardware, new signed-in multi-device journeys
  and external social-platform previews require explicit current proof. Browser emulation,
  generated OG tags and successful fixtures have narrower scope.
- Prior security receipts record HIBP unavailable on the current paid tier and an
  outstanding PostgreSQL host upgrade. Recheck provider settings before carrying those
  forward as current blockers. Applied migrations are not replayed to refresh evidence.

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

Cross-harness ownership follows [CONTINUOUS-IMPROVEMENT.md](CONTINUOUS-IMPROVEMENT.md)
and the single active `work/loop-20260930/COORDINATION.md` claim record.

Historical launch receipts are preserved unchanged in
[handoff/history-2026-09-30/LAUNCH_READINESS-through-2026-09-05.md](handoff/history-2026-09-30/LAUNCH_READINESS-through-2026-09-05.md).
The original and fetched-main AGENTS histories have independent checksum records
in the same archive; their old pending statuses and approval rules are not current.
