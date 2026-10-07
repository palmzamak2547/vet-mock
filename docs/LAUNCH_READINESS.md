# VetMock — Launch Readiness

## Source checkpoint — 2026-10-08 · subject bookplates

Study source **5.139.0 / SWv214** adds 85 course covers to Home and subject
selection. Seventy-six new transparent WebP files and nine matching Panic
illustrations are indexed by curriculum identity; All Subjects reuses the
open-book print. Names, question counts, paper scope, availability, Notes intent
and navigation retain their existing contracts.

`lint:art` checks complete course coverage, distinct paths, real WebP bytes,
paper colors and a 120 KiB ceiling per cover. Source PNGs and detailed local
receipts are retained in `work/subject-covers-20261007/`; they are not public
runtime assets. The shared cover reserves its space and hides failed decorative
images without hiding the course or its keyboard action. The ordinary worker
update lifecycle remains unchanged.

Production acceptance requires exact-head Build/Smoke, a matching READY
Production deployment and live changed-flow checks. The dated receipts below
remain evidence for their own releases; they are not the current source version.

### Local acceptance for this source

- Full data/unit gate: 51 checks passed, including the entire unit suite in Bangkok and UTC; build/prerenders and all three contrast audits passed.
- Chromium desktop/mobile: 447 passed, 21 skipped. New cover failure/keyboard checks passed in both, plus WebKit and Firefox. Focused WebKit/Firefox cover/resource flows passed 4/4.
- The full Windows browser gate was stopped after a core-journey WebKit timeout and its retry; its trace reached Home after recorded answers. The identical isolated test passed in 29.9s with the original 30s budget. Preserve the earlier failures; this does not establish a timing root cause or full local-green acceptance. Linux exact-head CI remains the full four-profile gate.
- Sharp is patched to 0.35.5 with librsvg2.63.2 for [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Fresh audit: high/critical0; the eight moderate Cornerstone/VTK-chain findings require separate major-version remediation.
- COM cover filenames were changed to companion-1..5.webp before commit; the Windows-reserved-name guard now prevents checkout/staging failures. The 85 artwork hashes and course IDs remain unchanged.

## Historical production checkpoint — 2026-10-01 (Asia/Bangkok)

**Production 5.133.3 / SWv201 is accepted**, from source
`f90dcf337f6515e097ca67402da635ef156d3e6b`
([PR 19](https://github.com/palmzamak2547/vet-mock/pull/19)).
Independent source review found no actionable issue.

| Evidence | Verified result |
|---|---|
| Main Build | [36821746448](https://github.com/palmzamak2547/vet-mock/actions/runs/36821746448) succeeds, including PostgreSQL 17.6: 40/40 and four real backend-lock races |
| Main Smoke | [36821746055](https://github.com/palmzamak2547/vet-mock/actions/runs/36821746055) succeeds: 806 passed, one retry-flaky, 45 skipped |
| Production | Deployment 6777354252 succeeded at 06:01:26 UTC: [deployment](https://vetmock-3p7zymay8-palmzamak2547s-projects.vercel.app) |
| Actual study origin | Entry main-7WHJR3FR.js reports 5.133.3; SWv201 equals source. vetmock.com retains its 307 to vetmock.vercel.app |
| Member API | 5/5 real API checks: stale writes, tombstones, metadata, anonymous denial and identity guard |
| Signed-in browser | 4/4: draw/save to cloud, restore the same visible ink in a fresh context, erase, then redo with a new ID |
| Test-row cleanup | API probes and the browser's unique synthetic document were removed; read-back is zero and existing Agenda metadata is unchanged |

The browser proof used two fresh desktop contexts and one tiny synthetic PDF.
Both naturally used SWv201; no worker takeover or existing document reload was forced.
It does not establish physical stylus/iOS or actual social-app delivery.

The installed provider migration is `20261001054615` (`pdf_annotations_atomic_merge`).
Its source copy remains
`supabase/migrations/20261001030000_pdf_annotations_atomic_merge.sql`.
Reviewed SQL SHA256:
`82da6da9ede82f2044fa29970bed867cb55bc06d5aa73b2b334805eb930a9715`;
installed function-body MD5: `29ae3d488046de7718c4ba75760c90a2`.
Invoker, fixed search path, trigger, RLS and existing size constraints were verified.
Aggregate-only preflight checked all 12 stored records; every compatibility counter was zero.
SW source SHA256:
`83e7294f97f7622ae3652c69a9763d7c9bd0af43cf81e61ef733b9bb477820b7`.

Local data/unit 51/51, normal build/prerenders, three contrast audits and dependency
audit 0 passed; 192 gradient backgrounds remain unmeasured. Chromium completed 426
cases: 405 passed, two retry-flaky, 19 skipped. **The full Windows gate was not green**:
software-GL hit a 30-second scroll budget, before its final active-navigation assertion.
The unchanged focused test subsequently passed in 18.6 seconds. Trace comparison showed
15.56 versus 0.926 seconds in an earlier theme action; the cause of that variable
actionability remains unproved. Original failures and retries remain recorded, and no
assertion or timeout was loosened. PR checks also passed on d89a3671 before merging.

The original disposable account still awaits the earlier final-delete confirmation;
probe cleanup is not account cleanup. Existing provider notices are unchanged (7 INFO,
4 anonymous-definer, 30 authenticated-definer and one HIBP notice), with no annotation
finding. The [PostgreSQL 17.11 provider upgrade](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes),
held user-data sync, and hardware/OAuth/social validation remain separate work.
Research source is unchanged; its new build was intentionally ignored, so prior
Research receipts below remain dated evidence.

Evidence: managed `work/loop-20261001-release/FINAL-RELEASE.md`,
`MIGRATION-RECEIPT.json`, `live-http.json` and CI/failure logs. Primary browser/API
receipts are under `work/loop-20261001-release/integrations/`.
The shared claim remains `work/loop-20260930/COORDINATION.md`.

## Accepted study baseline — 5.133.2 / SWv200 (dated receipt)

Release source **5.133.2 / SW v200**: [PR 18](https://github.com/palmzamak2547/vet-mock/pull/18)
merged as `41db8c9f6c4c38a0044922cbef0009b0551718ee`; its tree equals accepted
`6dd2e036b530e78e6022921ecd473f33b627480f`. Exact main Build, Smoke attempt 2
(all three expanded matrix jobs) and Research succeed. The SAME app Production
6767296500 now succeeds (latest 18:59:04 UTC), superseding its retained original
"Checks for Deployment have failed" state.

Actual public alias SWv200 normalized SHA256 matches source:
`054885aff91669a83b2c292a605f1149b0f18189f715c116f1e83ed1926e44bb`.
Live SR, member reader/logout and bounded Daily PNG proof pass. Exact fixture
deletion is prepared and held for the action-time human confirmation requested
by the coordinator; cleanup is not complete. This receipt does not declare the
backlog zero or prove physical OS/social delivery, hardware or other held lanes.

| Surface / gate | Observed state |
|---|---|
| Product entry | [vetmock.com](https://vetmock.com) redirects 307 to [vetmock.vercel.app](https://vetmock.vercel.app) |
| Exact main CI | [Build 36757463872](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463872), [Smoke 36757463531](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463531) attempt 2 and [Research 36757463428](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463428) succeed at 41db8c9f |
| App Production | Same deployment 6767296500 SUCCESS; [deployment URL](https://vetmock-77wx9pbn1-palmzamak2547s-projects.vercel.app); actual alias SWv200 hash matches source |
| Research Production | 6766832845 SUCCESS; public [research.vetmock.com](https://research.vetmock.com) shows three-reader signature; protected immutable URL leaves alias-to-deployment-ID attestation unproved |
| Earlier baseline receipt | Source 6774daa1: Build 36411289394, Smoke 36411289431, app 6708118976 and Research 6707958321 succeeded; superseded current state, retained history |
| Final local candidate | Data/unit gate 51/51 with both full timezone suites, normal build/wiki+Atlas+OG prerenders, three contrast audits and fresh npm audit 0 passed; 192 gradients remain unmeasured |
| PR 18 exact 6349b6ea | Build 2103, engine 335 and browser 808 successful/44 skipped passed; previous retry/failure evidence stays retained |
| Hosted native R exact 6349 | 37 files/295 cases/16 recorded pins pass; exact-zero and separation-evidence contracts accepted without new tolerance or reference changes |
| Repaired Research metadata | Three declared actual reader links; all 39 fixture hashes/dates unchanged; Bangkok/UTC 1316 each, build and four-profile 119 passed/17 skipped/0 failed accepted locally |
| New transitive audit repair | One High dependency finding in Axios covers seven advisories; only compatible transitive Node Axios 1.19→1.20 patched, SDK versions unchanged; fresh npm ci/audit 0, 60 consumer units and actual getVoices adapter check pass |
| MCV / catalog | Authorized current account: 11 courses, 115/115 materials matched, NEW 0; catalog 2042 rows (2034 public + 8 new restricted) |
| Live SR | Actual alias 24/24 across all four profiles, zero retry; managed work/loop-20260930/sr-live-41db.log |
| Member delivery | Eight complete body byte counts match; actual alias hover→mint/blob→Agenda one-page render→back/query retained→logout→anonymous401/private-cache absence PASS |
| Live Daily PNG | Actual v5.133.2 preview decoded 1080×1920/316549 B; normal download and two captured file-share payloads match preview SHA; no physical OS/social-delivery claim |
| Live Research flow | Public Methods shows three actual comparator links; course example computes DEFF1.70/n728 and the four-column CSV agrees. Anonymous on-device context, no off-origin requests; first harness CSV assumption failure retained. Receipt: work/loop-20260930/integrations/research-live-41db/REPORT.md |
| Exact test fixture cleanup | Prepared deletion held; action-time human confirmation requested, exhaustive exact-UID read-back/private-file receipt still pending |

Deployment, installation, numerical comparison and a working user journey are
separate facts. Main Smoke attempt 1 GL half 1 cancelled at its 22-minute cap
after 15m41s apt OS installation; preserve that setup record and original app
deployment checks failure. Same-SHA attempt 2 succeeds across all three jobs.
Exact-deployment connector reads still return 403 scope; direct status and body
proof are separate from connector access.

The original Windows 426-case failures reconciled to 404 successful/19 skipped/
three timing cases. The unchanged original Notes recovery case now passes 1/1
in 15.402s; two other timing cases were open at that older checkpoint. Earlier COM4 stayed pending
about 85s, not merely a 30s overall timeout; its cause is unproved. Original
23 failures/three not-run/nine retry-flaky and rerun evidence remain retained.
Managed receipts: `work/loop-20260930/backlog/CI-MAIN-41DB-CANCELLED-GL1.md`,
`LOCAL-CHROMIUM-QUIET-RECONCILIATION.md` and `NOTES-6DD-RECOVERY-DIAGNOSIS.md`.

## Released behavior and verified scope

- SR includes the passage and revealed safe explanation figure with the existing
  zoom boundary. Foreground readiness prevents partial queues; stale intents cancel,
  failed loads offer retry and explicit cached-card review. Twenty distinct focused
  browser cases have passing evidence. The later rejected-background/foreground-retry
  case proved stale planning counts red on the prior artifact, then passed all four
  profiles against the normal rebuilt artifact, one worker and no retries. Original
  setup/teardown and partial-queue failures remain retained. Actual deployed alias
  SR now passes 24/24 on all four profiles with zero retry; managed
  `work/loop-20260930/sr-live-41db.log` records this live proof.
- Daily sharing reuses the actual preview PNG. Actual live v5.133.2 decoded preview
  is 1080×1920/316549 B; a normal download from the exact preview URL plus two captured
  file-share payloads match SHA256
  `85E334CA0B9340610C662B50B509D5BA4A89E8BED495F956C2169C6AC4D59E06`.
  Actual Canvas was unmodified; only navigator.canShare/share transport was captured
  in a disposable anonymous context. Public writes 0/page errors 0. This proves PNG
  reuse/download payloads, not actual OS/social delivery. First fetch(blob) evidence
  method hit CSP and is retained separately; corrected normal download used no CSP
  bypass. Managed receipt:
  `work/loop-20260930/backlog/daily-share-live-41db-png-download/result.json`.
- Physical transitive versions brace-expansion 1.1.21 and fast-uri 3.1.8 are patched;
  earlier npm audit 0 is dated. A fresh scan found a High Axios dependency finding
  covering seven advisories; the
  compatible transitive Node Axios 1.19→1.20 patch now measures fresh audit 0 after
  npm ci, with SDK versions unchanged. Sixty consumer checks and the actual
  getVoices adapter pass; this does not prove all live voice/OAuth paths.
  Unit file concurrency is capped at two after recorded
  esbuild service-stop failures under default parallelism. No speed claim is made.
- Native Linux now installs every fixture-recorded version via dependency preparation
  and remotes. Six comparison failures are exact-zero roundoff: Dobson's equal
  treatment totals prove the B/z treatment effects zero, and two group-mean residuals
  are zero. The shared comparator now honors committed absoluteZero metadata plus
  only those two proved residual slots under the existing absolute 1e-10 contract.
  Nonzero NATIVE_REL 1e-9, strict webR rel 0, raw datasets/_fixture and R/package
  version guards remain intact. Hosted 5e resolved those six differences. Its one
  remaining separation SE difference is a finite IRLS artifact where the authored
  contract says B/SE are evidence, not finite inference pins. The reviewed native-only
  repair requires finite numbers, valid reference/vector shape, coefficient direction,
  positive SE and unchanged diagnostic signals; it leaves all other fields and the
  three source-evidence counts on their original comparison. All 335 local checks pass;
  the real method still emits three null coefficients/null Wald p/G14 on separation,
  while the steep finite control remains usable. Wrong
  zero injection 1e-6, tiny real probabilities, input drift and metadata changes still
  fail. Fixtures, R scripts and reference numbers were not regenerated or changed.
- Hosted 6349 passes all 37 native files/295 cases/16 pins. Accepted 6dd reader-index
  generator correction declares the actual comparator reader against three fixtures;
  all 39 fixture hashes/dates stay unchanged. Full repaired Research suites pass
  1316 in Bangkok and 1316 in UTC, its build passes, and four-profile browser evidence
  is 119 passed/17 skipped/0 failed. Exact main Research 36757463428 now succeeds;
  no native/role/source or tolerance/reference change follows from this receipt.
- Eight MCV additions are restricted. Original URLs, source authority and the
  redacted student-ID derivative retain provenance. Authenticated complete-body byte
  counts, management hashes and anonymous denial are separate from browser rendering.
  The original pre-release live pointer hung before HTTP; retain that failure.
  Shared-prefetch resolver repair passes 67 security/recovery cases and configured
  build41938 acceptance. Actual deployed alias now passes hover→mint/blob→Agenda
  one-page render→back/query retained→logout→anonymous401/private-cache absence.
  Primary receipt: `work/loop-20260930/integrations/LIVE-READER-PROOF.md`.
  Exact temporary-test-UID deletion is prepared and held after the coordinator's
  action-time human-confirmation request. Provider/exhaustive read-back/private-file
  receipts remain required; existing users and sessions stay outside cleanup scope.
- Normal main build/prerenders exit 0; all 1239 main JS/CSS/HTML bytes are identical
  to the previous artifact. This is an asset comparison, not a runtime/performance
  or whole-system acceptance claim. Final data gate 51/51 and three dist contrast
  audits pass; 192 gradients remain unmeasured. The final 17-file record is
  `work/loop-20260930/release-functional-hashes.json`; prior 16-file receipt remains
  `work/loop-20260930/release-functional-hashes-6349b6ea.json`, and original 14-file receipt
  `work/loop-20260930/release-functional-hashes-b53b3bf.json`.

## Content correction in 5.133.3

Question 8037 now uses the swine topic, matching its literal pig stem. Its answer,
source and review flag are unchanged. Fresh inventory remains 6,731 source questions,
6,663 ready and 68 held; no held answer was promoted. The current release receipt
above records the annotation backend and frontend acceptance.

## Outstanding work and limits

- Exact main CI and same app Production acceptance now succeed. Retain six original
  analytic-zero mismatches, separated SE evidence drift and installer/setup/checks
  failures. No global tolerance/reference replacement was used.
- Current Chromium completed all 426 cases: 405 passed / 2 retry-flaky / 19 skipped.
  The current GL failure consumed the 30-second scroll budget before is-active;
  quiet original-spec/trace rerun passed in 18.6 seconds. Theme action was 15.56 s
  versus 0.926 s before progress; cause remains unproved, assertions/timeouts unchanged.
  Full local gate remains incomplete. Earlier timing counts and the stopped
  418-case run are dated evidence; preserve them without treating them as current.
- Live SR/member flows and bounded PNG preview/download/share-payload acceptance pass.
  Actual OS/social delivery and broader hardware journeys remain outside proof.
  Preserve natural worker activation and active documents; no forced reload,
  activation or site-data clearing.
- Complete exact ephemeral member-test-UID cleanup only after the requested action-time
  human confirmation for final UI deletion. Safe ledger:
  `work/loop-20260930/integrations/member-fixture-safe-ledger.json`; retain exhaustive
  exact-UID provider read-back and private-file receipt. No broad sweep or cleanup
  claim before these receipts.
- Sync re-land 7146f950 remains a held separate lane: named/livesim/random simulations,
  unit coverage, rollout review and account-local purge of `vmx-user-ack-v1:<uid>`
  precede release. The older open-items ledger is dated input, not today's count.
- Physical iOS, actual OAuth completion, assistive/stylus hardware, new multi-device journeys and social previews
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
