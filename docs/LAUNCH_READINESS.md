# VetMock — Launch Readiness

## Current source candidate — v5.79.0 (2026-09-05)

VCA archive coverage and recovery are recorded in
[`vca-archive.md`](./vca-archive.md). Current question counts come from
[`content-inventory.md`](./content-inventory.md). The last production baseline
checked before this candidate was v5.78.0, SHA `fdff304`, with successful Build
`33962635917`, Smoke `33962635916`, and Production deployment `6280280811`.

The candidate must pass the full release gate and a live changed-capability
flow before being described as the production release. Historical evidence
below applies to its named version only.

## Historical release gate — v5.56.0 (2026-08-31)

VetMock is production-ready as a public study app. The current gate covers the
whole product, not only Imaging:

- `npm run stats`: 4,551 source and learner-ready questions, 0 held
  fail-closed for verified figures, 66 banks, 43 subjects with questions,
  4,032 sourced note sections, and 208 governed VetWiki topics.
- All generated counts, IDs, curriculum links, registries, note-corpus mapping,
  delivery gates and VetWiki projections pass drift checks.
- Stable destinations now own readable `/app/*` URLs with direct-load,
  refresh, Back/Forward and auth-boundary coverage. Stateful exam screens stay
  deliberately in-memory and return to `/` rather than restoring half a session.
- Notes and VetWiki share `note-corpus.js` and lazy-load one subject at a time.
  NotesView's gzip chunk fell from 631,956 to 36,331 bytes. Offline failure
  stays on the same view; online retry reloads back into the selected subject.
- Backup and custom-question JSON are validated with a shared Valibot schema
  before setters run. The UI previews exact overwrite scope, respects explicit
  empty data, preserves the full streak record, and accepts safe legacy files.
- Shared modal focus management covers initial focus, Tab containment, Escape,
  nested dialogs and explicit WebKit-safe focus restoration. The compact
  landing menu is a fixed, inert-when-closed curtain whose responsive state
  follows rendered CSS, so rotation cannot strand body scroll lock.
- Landing motion is limited to tokenized CSS feedback and observer-driven
  navigation state. Quest actions retain tactile classes, a 44px touch floor,
  and theme-aware on-accent contrast.
- Remote views use a shared loading/empty/recoverable-error language; a failed
  request no longer masquerades as an empty success state.
- The public sign-in view no longer exposes provider-dashboard setup details.
  Dormant article-assistant UI is not rendered in VetWiki.
- Local release evidence: 402 unit tests, `lint:all` green, production build +
  209 Wiki prerenders, `npm audit` 0 vulnerabilities, targeted interaction E2E
  16/16, mobile compatibility 2/2, and production console/request errors 0.
- Exact-SHA proof: GitHub Build `33386364695` and Smoke `33386364715` succeeded
  for `a6dfad1`; Smoke finished with 192 passed / 40 deliberate matrix skips /
  0 failed / no flaky retry across Chromium, WebKit and Firefox.
- Vercel Production deployment `6180037450` succeeded for `a6dfad1`. The alias
  exposed SW `v122-2026-08-31` and passed 4/4 changed-capability journeys.
- Question lint is at 0 blocking errors. The remaining 18 source-position
  advisories are neutralized by session-stable runtime option shuffling and are
  tracked as data-quality nudges, not learner-visible answer tells.

The 2026-07-26 audit below remains as historical rationale; superseded counts
and open findings should not be read as the current release state.

> Source: a 5-dimension grounded audit of the live repo (landing promises vs
> reality · runtime bugs · cross-platform · first-run clarity · data accuracy),
> every serious finding re-checked by an adversarial verifier, then fixed and
> **verified by driving the real app** (not by reading the diff).
> Date: 2026-07-26.

## Standing verdict

The engine was never the problem — exam scoring, XP, per-subject counts and the
stats pipeline all audited honest. The gap was **truth-in-labelling and
load-state**, and it is now closed.

## Fixed for launch

### Honesty (the front door)
| Was | Now |
|---|---|
| Hero: "10K+ Questions / 500+ Students / 95% Pass Rate" — all hardcoded, no data source | Questions + subjects **derived from `q-counts.js`** (2,948 / real subject count), third tile states the true "ฟรี" |
| Landing defaulted to **English** for a Thai audience | Defaults to **Thai**; EN toggle stays |
| "Difficulty selection" advertised | Removed — questions carry no difficulty field |
| Readiness / Revision-plan / Generator sections looked live | Badged **ตัวอย่าง / Preview**, matching Panic + Lab |

### Promises that now work (the explicit launch bar)
Every landing CTA used to call the same generic `onEnterApp` and drop the user
on the year picker.
- **Start a Mock Exam** → the real 50-Q × 60s exam config
- **Enter Panic Mode** → a **real** timed cram sized to the time picked
  (15m→12 Q, 30m→25, 1h→50, tonight→120 — the numbers the section advertises),
  drawn from weak topics once there's enough history, else cross-subject
- **Lab** → the real imaging lab
- First-time visitors still pick a year first; the intent is **parked and
  replayed**, so the click still ends where it promised

### Data integrity
- **Cloud sync could delete a user's history.** Pull and push both fired on the
  same `user` transition and pull failures were silent, so a new device (or a
  failed read) pushed empty local state over real cloud data. Push is now gated
  on a completed pull.
- **Dashboard accuracy was understated** — numerator filtered by the loaded
  bank, denominator was the whole history. Both use the same set now.
- **Streak counted the wrong thing** — it incremented when an exam *opened*,
  before a single answer (and so disagreed with HomeView's history-derived
  streak). Now granted only when graded answers are recorded.
- **Resume card** could describe a session that no longer existed, with a button
  that did nothing.

### Stability / platform
- `useAuth` had no `catch`: a failed SDK chunk fetch wedged the app on
  "กำลังโหลด..." **forever**. Now degrades to a usable signed-out app.
- Subject picker and SR session reported "empty" while the lazy Q-bank was
  still loading — loading is now its own state.
- iOS auto-zoom guard was beaten by CSS specificity on 4 controls, **2 inside
  the exam**. Restored.
- VetWiki copy-link always claimed success; now uses the project's clipboard
  fallback chain and reports the real outcome.

## Verified
- **Cross-engine e2e 32/32** — chromium desktop + mobile, WebKit (iPhone),
  Firefox. `lint:all` 0 errors, build green, unit 117/117, e2e 32/32.
- **Live cross-engine UI sweep** at 1280 / 390 / 320px: app mounts, 0 horizontal
  overflow, every header/nav/footer target ≥44px, sidebar↔bottom-nav swap
  correct per breakpoint, 0 console errors.
- **Production spot-checks**: fresh visitor gets Thai + real 2,948 + 9 preview
  badges + no fabricated stats; connectivity ping returns 200; Panic Mode 15-min
  yields a real 12-question timed exam.

## Known and deliberate (not launch blockers)
- **VetMock AI ships dormant** — `api/wiki-explain` and `api/grade-summary`
  return 503 without `ANTHROPIC_API_KEY`; the UI degrades honestly. The landing
  no longer advertises it at all (the AI section was removed).
- `AdminView` hardcodes its bank total instead of importing `QB_TOTAL`
  (admin-only, correct today).

### Closed since (2026-07-30)
- ~~Public leaderboard has no minimum-attempt gate (a 1-question run can
  score 100%)~~ → closed 2026-09-03 (v5.68.0): runs under 5 questions no
  longer rank, enforced identically in the `get_global_leaderboard` RPC
  (`p_min_total`, migration `20260903000000`), the RLS fallback query, and
  the client aggregation (`lib/leaderboard-gate.js`). Gate is per-run
  question count, not run count.
- ~~Auth-gated views render nothing on token expiry~~ → `AUTH_REQUIRED_VIEWS` +
  `AuthRequiredState` prompt for sign-in.
- ~~PWA manifest pins portrait~~ → `orientation: any`.
- **Cloud sync upgraded from "gated" to actually correct** — `lib/user-data-sync.js`
  merges per field (set-array / append-array / keyed-object / streak) with a
  durable offline queue, pre-push rebase and account isolation, behind
  `useUserDataSync()` + a user-visible `SyncStatusNotice`.
- **Service worker rewritten** (now at v30) — `/api` network-only and never cached,
  version-scoped runtime cache beside a shared immutable asset cache, updates
  wait for explicit `SKIP_WAITING`.
- Landing AI / generator / revision-plan sections deleted rather than
  preview-badged; nav and footer anchors updated to match.

---

## Academic data integration (2026-07-26)

The faculty's published documents for **ภาคการศึกษาต้น 2569** are now live data
in the app rather than posters in a chat: the Y5 weekly timetable, both exam
tables (midterm 21-25 ก.ย. · final 23 พ.ย. - 4 ธ.ค.), the registrar's
registration + CUNEX payment calendar, and the course-group registration
(3190501 · 11 วิชา · 23 หน่วยกิต). All transcribed verbatim; missing fields stay
`null`.

**Data errors found and fixed:** six of the eleven Y5 course codes in
`curriculum.js` disagreed with the registrar's own group list — AVIAN was
carrying **3107507**, which is actually SWINE's code. Also corrected MILK HYG
(→3109503), ONE HEALTH (→3109502), FOOD IND (→3109501), CLI PROB SOLV
(→3107522), SWINE (→3107507). All 11 now match. Because ⌘K already indexed
course codes, correcting them fixed search as a side effect.

**Integrity check on the transcription:** the 10 courses that have exams sum to
22 credits; plus CLI PROB SOLV COMP (1 credit, no scheduled exam) = the 23
credits the official group states.

**Where it surfaces** (all reusing existing destinations):
- `ScheduleView` is now the academic hub — this week's timetable (today
  highlighted, current class marked, each row opens that subject's practice),
  the registration/payment calendar (what's open now + days left), then the real
  exam list (term · code · Thai date · time · room · credits).
- Home chips: next class today, and the most urgent open deadline. The existing
  exam countdown lights up on its own now that the data is real.
- ⌘K: every upcoming exam is searchable — `3109503` returns the subject plus
  both of its exams with date/time/room.
