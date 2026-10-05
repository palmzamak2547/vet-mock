# System bug audit and local fixes — 2026-10-05

Candidate branch: `codex/bugfix-1005`, based on freshly fetched main `9aa12da9`.
These are local changes, not a production release. The older primary checkout
and its unrelated curriculum, docs, design and scratchpad edits are preserved.

## Reproduced fixes

| Area | Failure repaired |
|---|---|
| Personal questions | New IDs became NaN with legitimate string IDs or collided with unloaded banks; use the existing numeric custom range and explicit capacity guard |
| Personal question editing | Replacing a record lost topic, scope, source and short/essay answer metadata; retain unedited fields and validate before saving; ID zero edits correctly |
| Import/delete | Confirmation callbacks overwrote newer changes with stale arrays; apply against the current stored value |
| Draft/account boundary | Rejected saves closed the editor; keep drafts and use Thai errors; reset the editor on principal change |
| Weak practice | Numeric coercion dropped imported string question IDs; retain each canonical ID's type |
| PDF exit | Leaving before first autosave wrote locally but queued no cloud upload; queue successful durable saves before flushing, with existing owner checks |
| Video selection | A new search intent changed the title while the already-mounted player retained its old clip; key the player by selected URL |
| SVG occlusion | Supported SVG decks blocked the entire supplemental backup; align the existing image MIME allowlist with the editor |
| Imaging Undo | Two comparison panes broadcast duplicate undo events; dispatch within each viewport |
| Imaging Clear | One pane cleared both panes' native measurements and overlays; restrict deletion to its image and viewport |
| Research backup text | Global Infinity string revival corrupted names/raw cells; v2 encodes numeric bounds distinctly and accepts legacy v1 |
| Research dataset order | Export's random-ID order could restore a merge source as the main dataset; retain project.datasetIds order and reject missing records |
| Research frozen results | Snapshot storage ignored frozen:true; persist it and its log atomically, refusing stopped results and later overwrite |
| Research project revision | Codebook/recipe saves advanced the stored project revision but not the UI; refresh both before later design/rename edits |

Main source changes are in `src/views/{QuestionManagerView,PdfAnnotateView,VideoView}.jsx`,
`src/App.jsx`, `src/lib/{custom-question-ids,local-extras}.js`, the three Imaging
viewport/overlay components, and three Research store/workspace modules. Existing
regression suites were extended; Question Manager gained behavioral unit/browser
coverage. No dependency versions, clinical content, numerical methods/fixtures,
backend schemas or production data changed.

## Verification

[Draft PR20](https://github.com/palmzamak2547/vet-mock/pull/20) carries the repairs;
production is unchanged. Local source tests: study data/unit gate 51/51 (2119
units per timezone), build/prerenders, contrast checks, both dependency audits
zero; Chromium desktop/mobile 413 passed/19 declared skips without retries.
Research units 1319 per timezone, build/registry and 60 four-profile journeys pass.

The full Windows gate is **not green**. Its first contrast subprocess exited
without diagnostics and passed unchanged separately. The GL browser run was
stopped after repeated timeouts and increasingly slow Firefox actions; preserve
its failure/skip/partial coverage. Unchanged isolated runs pass: WebKit summary
print1/1 (17.6s), Firefox Imaging + Question Manager + video6/6 (2.1m).
Assertions and timeout budgets were not relaxed.

Hosted Build37316823019 passes on application commit32650d3e. Native R initially
failed before numerical comparisons: the newest dunn.test dropped scrutiny,
while pinned1.4.0 still imports it and the downgrade disabled dependency install.
The workflow now installs required archived dependencies (`dependencies=NA`)
with `upgrade="never"`, retaining every package pin, fixture and tolerance.
The updated PR requires a fresh hosted native-R and Smoke result; final receipts
are recorded in the PR and local handoff rather than inferred from a build.

## Open P1: acknowledged multi-device study-data loss (DA-06)

Current-client blind upsert can overwrite another device's acknowledged data.
A fresh two-device synthetic remote reproduction uses the real current engine;
this is not a new live provider test. The held C10 branch `7146f950` was replayed:
seed255 resurrects a deleted note in 50/50 finish orders versus main's 0/50.

A smaller CAS-only experiment regresses C1a/C1v. A second isolated retry experiment
passes those named cases but has 20 exact-script degradations in 800 comparisons.
They remain regressions even though the baseline fails under other finish orders.
Neither proposal was applied. Correctness, not missing authorization, blocks this
repair: pending intent must be distinguished from copied, already-acknowledged
whole-field state across retries, lost replies, reloads and multiple tabs. Preserve
those exact schedules before changing that contract. Old clients still blind-write.

## Limits and next work

- Complete the candidate's hosted checks and review the draft PR;
  deployment still requires the repository's exact-SHA CI/provider/live-flow chain.
- Resume DA-06 in its isolated lane, minimize the new counterexamples and prove
  no acknowledged loss/resurrection before integration. Refresh live schema/read-
  write semantics before any provider acceptance claim.
- Real OAuth/passkey/account deletion, physical stylus/iOS, remote multi-device
  behavior and every possible route/data combination are not covered by this audit.
- Imaging changes have actual shipping-callback tests and installed dependency
  metadata proof; full DICOM comparison with physical hardware remains unverified.
  SVG has real Chromium upload/draw/save/backup/restore/render proof.
- New custom questions retain INTEGER-compatible 60000–69999 IDs (10000 slots).
  Offline devices are not guaranteed global uniqueness; old IDs are not migrated.
- Research legacy v1 backup ordering is not auto-repaired; literal Infinity in
  old result tables is inherently ambiguous. Dedicated Research offline/network/
  header/layout browser specs and native-R parity were not rerun; numeric methods
  and reference fixtures are unchanged.

Detailed local receipts and reproducible rejected experiments are under
`work/bugfix-20261005/`: `REPORT.md`, `CHECKPOINT.md`, lane reports,
`sync-status.md`, `sync-cas-review.md` and original/rerun logs. The rejected patch
is explicitly named `sync-cas-rejected.patch`; it must not be applied as a fix.
