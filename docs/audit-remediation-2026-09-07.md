# VetMock — audit remediation, 7 September 2026

This register separates implemented repairs from work that requires content
evidence or a provider-plan change. Release verification must refer to the exact
commit; this document does not itself certify a deployment.

| Audit item | Result in v5.81 | Remaining boundary |
| --- | --- | --- |
| 1 PDF ownership and concurrent saves | Owner-scoped keys, explicit legacy recovery, transactional merge and bound upload queue | Test on each supported browser; retain legacy data until claimed |
| 2 Sign-out failures | SDK errors propagate to the UI | Global session revocation depends on the identity provider |
| 3 Passkeys | Same-origin permissions and actual policy capability check | Authenticator availability is device-dependent |
| 4 Backup partial imports | One validated, checked command for the complete core patch | A refused local write remains visible |
| 5 Silent note and pin writes | Checked add/edit/delete; preserve drafts; no automatic deck eviction | Device-local tools stay local |
| 6 Lost result submissions | Durable owner-bound outbox and idempotent receipts | Pending results require connectivity |
| 7 Uncertain account deletion | Unknown/partial outcomes are described accurately | Do not treat a lost response as proof that data remains |
| 8 Provider network failure | Try the next configured provider within one deadline | Provider availability is external |
| 9 Large SRS backlog | A bounded review step remains available | No claim that one short session clears the backlog |
| 10 Editable leaderboard preferences | Safe value parsing and minimum five-question run | Users may opt out of the board |
| 11 Browser-trusted scores | Server canonical grading, provenance categories, conflict detection | Self-study is not proctored; historical scores cannot be retroactively verified |
| 12 Race sender and host trust | Database-owned room, host, membership and sequential grading | Recreate rooms from older clients |
| 13 Limiter failure | Bounded timeout and fail-closed production quotas | Shared limiter outage temporarily pauses metered features |
| 14 Leaked password setting | Configuration checked; provider rejected enablement on current plan | Requires Supabase Pro or higher |
| 15 Backup coverage | Reading checklist, local tools and detailed events added; account export uses active data | Separate archives; other local widget settings and downloaded files are not a universal cloud backup |
| 16 Attempt/review ledger | Versioned answers, question revisions, visible time and explicit ratings | No fabricated backfill for historical answers/confidence |
| 17 Time-aware plan | 15/30/60-minute plans size practice and review sets | Durations are estimates, not readiness predictions |
| 18 Coverage labels | Show ready subjects alongside curriculum scope | Source coverage is still uneven by year |
| 19 Held questions | Preserve fail-closed delivery; repair queue exported | 65 items still need answer, scope or source-figure evidence |
| 20 Question bias | Existing gates retained and findings tracked | 166 length warnings and 25 bank-position warnings remain; no unsafe bulk rewriting of faithful source questions |
| 21 Governed notes and citations | Existing verification pipeline retained | Governed coverage 43.9%; 4,727 questions still lack explicit wikiRefs |
| 22 Current course scope | Existing strict current-scope gate retained | Expand only from current syllabus/teaching evidence |
| 23 Atlas scope and review | Feature description matches current specimens and composite granularity | No invented individual structures or expert review |
| 24 Public learning claims | Removed unsupported numeric benefits; primary references retained | No product-specific efficacy claim |
| 25 Privacy and lifecycle | Public data inventory, export/deletion explanation and analytics controls | Browser profiles can expose device-local tools to other users of that profile |
| 26 CI quality gates | Full lint:all and runtime-binding checks | Warnings are tracked separately from errors |
| 27 Deployment ordering | Vercel requires build and smoke before alias promotion | Verify check state and production alias for each release |
| 28 Browser diagnostics | Consent-gated, bounded private aggregate error reports | No full exception messages or personal-content collection |
| 29 Verification gaps | Added real browser storage-failure/reload coverage and account/race checks | Device-specific passkey and graphics behavior still requires appropriate devices |
| 30 Documentation drift | Updated storage, score/race and release guidance | Regenerate authoritative content totals when content changes |

Current inventory was measured with npm run stats: 4,890 source questions,
4,825 learner-ready, 65 held, 74 banks, 43 subjects with questions.
Notes: 4,032 sections; governed VetWiki: 1,769 sections.

The exact-commit verification of v5.81.1, the isolated browser check, the
temporary QA account cleanup and the one follow-up fix (v5.81.2) are recorded
in [the verification and cleanup receipt](reports/qa-cleanup-receipt-2026-09-07.md).

See [the held-content queue](content-repair-queue.csv) for every retained
question key, reason and source bank. For each item, locate the original
question and figure, verify the answer and current scope, then rerun delivery,
registry, question counts, question lint and inventory checks. A matching file
name or a plausible answer is insufficient evidence to release an item.

For bias review, run npm run lint:questions. Review each flagged item in context:
keep faithful transcriptions faithful; for original practice items, make options
comparable without adding facts to distractors or deleting essential qualifiers.
For governed links, use npm run wiki:gap and npm run wiki:link-candidates, then
review candidate source passages before approving links.
