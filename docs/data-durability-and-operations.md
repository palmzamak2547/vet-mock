# Data durability and operations — v5.81

Exam answers can outlive a network failure, an account switch, or a failed
storage write. A completion is cleared from recovery only after both compact
progress and the detailed answer log are durable.

## Storage boundaries

| Data | Local copy | Account replica | Export |
| --- | --- | --- | --- |
| History, bookmarks, question notes, custom questions, SRS, reading checklist | Owner-scoped user-data store | Supabase user_data | Dashboard / account settings, format 5.2 |
| Pending result receipts | Owner-scoped outbox | Acknowledged exam_results only | Original answers remain in detailed history |
| Answers, question revision, visible time, explicit SRS rating | Owner-scoped IndexedDB | study_event_batches | Dashboard, vetmock-study-events-v1 |
| PDF strokes and tombstones | Owner-scoped IndexedDB | pdf_annotations | PDF reader export |
| Video notes, Pinboard, personal Flashcard/Cloze, image occlusion | Device-local, shared by that browser profile | None | Dashboard, vetmock-local-extras-v1 |
| Other tool preferences, daily checklist widgets and downloaded files | Device-local | None | Not included in the above archives |

Legacy unowned PDF ink and in-flight exams require an explicit ownership
claim. They are never silently attached to the account that happens to sign in.
Unsubmitted exams retain the existing six-hour resume window. Failed submitted
work remains recoverable beyond that window. Deleting browser site data still
removes local-only work; export before doing so.

Detailed events record only measured fields. Confidence is null because the
exam UI does not collect it. Visible time excludes a hidden tab; it is not a
measurement of attention or mastery. Existing compact history is retained and
does not acquire invented historical answers or timings.

## Score and race authority

New standard exam results are recomputed against the canonical question
revision in /api/exam-result. Stale and custom sets remain explicitly client
scored. The global board defaults to server-checked results; historical and
custom scores remain available in a separate category. The board selects each
user's best qualifying result before limiting the number of users.

Results use a stable UUID and a fingerprint of question revisions and answers.
The same submission is safe to retry after a lost response. Conflicting
submissions with the same UUID are refused and remain visible as pending.
Server-checked results are self-study results, not proctored examinations.

Race rooms last 24 hours. A room has a database-owned host and membership;
only that host can start it. Canonical answers and revisions stay in private
room storage. Sequential answer RPCs derive the player from the authenticated
session, grade server-side, and accept exact retries without another score.
Snapshots support rejoining after reconnect. Old broadcast-only rooms must be
recreated after the upgrade; old stored race results are preserved.

## Backend configuration

Production requires the shared Upstash quota configuration. Missing credentials,
a timeout, or a failed shared counter returns a retryable service-unavailable
response. It does not create a separate allowance for each function instance.

Signed receipt, race-start and diagnostic RPCs require a random server-only
VETMOCK_RPC_SIGNING_KEY in Vercel and the identical secret in
private.application_signing_keys under name app-rpc. Provision it outside Git.
Do not use a public VITE_ variable or expose the key in logs. Rotate both copies
together during a maintenance window; no browser holds this secret.

Optional browser diagnostics run only after analytics consent. Their payload
is restricted to release, a known view identifier, exception category and event
kind. Messages, stacks, user IDs and referrer URLs are omitted. Private daily
aggregate counts older than 14 days are pruned on the next accepted report.
Review these counts through an authorized database connection; they are not
publicly queryable.

## Release gates

Run npm run test:unit, npm run build, npm run lint:all and npm run lint:atlas.
Build runs the complete generated-data, content and contrast gates in CI.
Smoke runs the production bundle across Chromium desktop/mobile, WebKit and
Firefox. Vercel project checks require GitHub checks named build and smoke
before changing production aliases. A failed check leaves the existing alias
in place. Verify the exact commit, deployment and live workflow after release.

Leaked-password protection through Supabase's managed HIBP setting remains
unavailable on the current plan: the management API requires Pro or higher.
No plan change is part of this maintenance release.
