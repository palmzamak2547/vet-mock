# System bug audit — 5.134.0 release candidate

Candidate: `codex/bugfix-1005`, originally based on main `9aa12da9`.
Source versions are **VetMock 5.134.0 / SW202** and **Research 0.1.1**.
Production release is authorized and in progress; final exact-SHA CI, native
PostgreSQL, provider migration and live production proof are still pending.
The primary checkout's unrelated work remains preserved.

## Reproduced fixes

| Area | Resulting behavior |
|---|---|
| Personal questions | Allocate INTEGER-compatible IDs in the reserved 60000–69999 range; avoid loaded/unloaded banks and IDs still referenced by study data; refuse exhaustion and server-detected identity conflicts |
| Personal question editing | Preserve topic, scope, source and short/essay answer metadata; validate before saving; ID zero edits the existing question |
| Import/delete | Apply delayed confirmations against the current stored value instead of replacing newer edits |
| Draft/account boundary | Keep refused-save drafts, show Thai errors and reset the editor on principal change; asynchronous account requests reject stale principals |
| Weak practice | Preserve canonical string question IDs rather than dropping them through numeric coercion |
| PDF exit | Queue a successful durable first save for cloud upload before leaving, with owner checks intact |
| Video selection | An already-open player follows the newly selected clip, together with its title |
| SVG occlusion | Supported SVG decks survive supplemental backup and restore |
| Imaging Undo/Clear | Apply undo and deletion to the selected comparison viewport and its overlays |
| Research backup text | Version 2 distinguishes literal Infinity text from numeric bounds; legacy v1 keeps categorical text in the saved analysis spec |
| Research dataset order | Export the declared dataset order; repair v1 ordering when exactly one main dataset is identifiable, preserving ambiguous order rather than guessing |
| Research frozen results | Persist a frozen snapshot and its log atomically; refuse stopped-result freezing and later overwrite |
| Research project revision | Refresh the project revision after codebook/recipe saves so the next design or rename succeeds |
| Research first edit | Deferred route focus no longer takes focus away from a field the student has already started editing |
| Study-data sync (DA-06) | Send immutable owned operations through an atomic receipt-backed RPC; preserve pending legacy work for explicit recovery instead of replaying copied whole-field state |

The sync continuation adds `src/lib/user-data-{atomic,operations,row}.js`, the
existing API/hook/recovery integration, and
`supabase/migrations/20261005140235_user_data_operation_sync.sql`. Historical
question-ID and year normalization is shared by pull, receipt responses and
history deltas. Signup no longer has a separate blind-upsert path. No clinical
content, numerical methods, reference fixtures or comparison tolerances changed.
Research's package version is separate from its unchanged numerical engine version.

## DA-06: candidate repair; release proof pending

The previous client-only CAS proposals remain rejected. This candidate changes
the storage contract: the server locks the owner's row, applies per-key intent,
and records immutable operation receipts in the same transaction. Duplicate
retries return the current row. Per-key clocks/tombstones prevent older operations
from undoing a newer acknowledged change. Local receipts are saved before outbox
cleanup; ID-conflict recovery retains an archive and cancels discarded operations.

Old blind writes are explicitly refused after an account enrolls in v2. Pending
legacy data stays visible and exportable until the user chooses recovery. Clean
retained v1 readers receive a guarded acknowledged snapshot projection; old dirty
metadata and outboxes are preserved. No forced reload or worker activation is added.

Independent simulation retained the original scripts and strict oracle:

| Corpus | Verified result and limit |
|---|---|
| All-new exact schedules | 10/10; complete original exact-20 score is 18/20 |
| C10 minimized seed255 | 50/50 using the archived completion-order seeds 1–50 |
| Preserved random scripts | All-new 200/200; complete strict score is 265/400 |
| Named RPC / explicit recovery cases | 10/10: C1a/C1v, SOLO1 variants, TC1, LR1 and both explicit legacy recovery choices |
| Retained clean v1 readers | Nine same-script stale-display regressions reproduced, repaired and rechecked |

The two remaining exact mixed cases and 135 mixed random failures retain their
original strict errors: v1 writes are refused or legacy recovery is required.
They are **not** relabeled as the old automatic-sync workflow passing. Separate
refusal, retained-data and explicit recovery tests verify the new compatibility
contract. The final simulated source and adapter hashes were stable before/after
each run; receipts are in `work/release-20261005/sync/sim/FINAL.md`. The subsequent
history/API compatibility integration still needs the final protocol stamp and
release gates. Simulation does not replace native PostgreSQL, RLS or provider tests.

## Verification status

Earlier [PR20](https://github.com/palmzamak2547/vet-mock/pull/20) head
`241cdb9dba2e8bd488d38dee90e8ab8020d8d11d` passed
[Build37318039181](https://github.com/palmzamak2547/vet-mock/actions/runs/37318039181),
[Smoke37318039423](https://github.com/palmzamak2547/vet-mock/actions/runs/37318039423)
(819 passed, one retry-flaky, 44 skips), and
[Research parity37318039217](https://github.com/palmzamak2547/vet-mock/actions/runs/37318039217)
(engine335/335; native R matched 37 files). These are dated receipts preceding the
v2 continuation, not proof of the final release candidate.

Current local evidence:

- Sequential Research units pass **1319/1319 in each timezone** (Bangkok and UTC).
  The initial concurrent import-preview timing failure remains recorded; no
  performance budget, assertion or timeout was relaxed.
- Research build, registry checks and focused storage tests pass. Both changed
  browser flows—delayed focus and legacy restore/export—pass all four profiles.
  The earlier 60 M1/M2 journeys passed; expanded coverage includes offline entry,
  all-method network silence and workspace/layout flows.
- Browser runs retain their original failures: expanded Research coverage had
  77 passes, one expected WebKit service-worker skip and two failures. The focus
  failure was causally reproduced and fixed. Final focused coverage had 15 passes
  and one Chromium DOM-evaluation timeout; the unchanged isolated landing rerun
  passed 2/2. An isolated pass does not establish the cause of a timeout.
- The **Windows full gate is incomplete, not green**. Earlier Chromium completed
  413 passes/19 skips; the GL run stopped with timeouts. Original contrast,
  WebKit/Firefox and retry receipts remain preserved. Hosted final-head checks
  must establish the release result.

The earlier native-R setup failure came from an archived package dependency
missing from the latest package's dependency graph. Installing required archived
dependencies with `dependencies=NA, upgrade="never"` fixed setup without changing
numerical pins or tolerances; the prior hosted parity run verifies that repair.
This R evidence is distinct from the pending native PostgreSQL gate for sync v2.

## Remaining release gates and limits

- Finish final protocol/source stamping, integrated checks and exact-head hosted
  CI, including native PostgreSQL operation/receipt/RLS/race validation.
- Apply the reviewed migration once, then prove ordinary-member writes, lost-reply
  retry, owner isolation, retained-client refusal and cleanup on the real provider.
- Verify both production deployments and user flows at their exact release SHAs;
  Research security/cache headers require its deployed origin, not Vite preview.
- Real OAuth/passkey/account deletion, physical stylus/iOS and every possible
  route/data combination remain outside this bounded audit.
- Custom IDs remain a finite numeric namespace; existing IDs are not bulk-migrated.
  Allocation/reference guards and explicit conflict recovery prevent silent reuse.
- Legacy v1 result-table cells literally named Infinity remain inherently ambiguous
  with old numeric bounds. Missing/multiple-main backup metadata is not guessed.

Detailed candidate evidence is under `work/release-20261005/` (checkpoint,
Research review, sync simulation and provider verification plan). Earlier receipts
and rejected experiments remain under `work/bugfix-20261005/`; specifically,
`sync-cas-rejected.patch` is historical evidence and must not be applied as a fix.
