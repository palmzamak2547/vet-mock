# VetMock — Launch Readiness

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
  Firefox. `lint:all` 0 errors, build green, unit 97/97.
- **Live cross-engine UI sweep** at 1280 / 390 / 320px: app mounts, 0 horizontal
  overflow, every header/nav/footer target ≥44px, sidebar↔bottom-nav swap
  correct per breakpoint, 0 console errors.
- **Production spot-checks**: fresh visitor gets Thai + real 2,948 + 9 preview
  badges + no fabricated stats; connectivity ping returns 200; Panic Mode 15-min
  yields a real 12-question timed exam.

## Known and deliberate (not launch blockers)
- **VetMock AI ships dormant** — `api/wiki-explain` and `api/grade-summary`
  return 503 without `ANTHROPIC_API_KEY`; the UI degrades honestly and the AI
  sections are preview-badged. Set the key in Vercel to light them up.
- Auth-gated views render nothing on token expiry rather than prompting re-login.
- The PWA manifest pins portrait, so the landscape video layout is unreachable
  when installed on Android.
- Public leaderboard has no minimum-attempt gate (a 1-question run can score
  100%) — needs a product decision, not a bug fix.
- `AdminView` hardcodes its bank total instead of importing `QB_TOTAL`
  (admin-only, correct today).
