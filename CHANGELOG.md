# CHANGELOG (developer-facing)

> The in-app, user-facing changelog lives in the app data (`LATEST_CHANGELOG`)
> and follows its own rules. This file is the engineering log.

## 2026-07-24 — VetWiki slice 2 + CI repair

**Added**
- All 5 COM5 topics governed (rabies · vaccine · cve · sporo-crypto ·
  gi-protozoa) — 41 sections derived live from `notes-com5.js`, one registry
  row each.
- WSAVA 2024 verified as a source (Squires et al. J Small Anim Pract.
  2024;65(5):277-316, doi:10.1111/jsap.13718) and 2 vaccine claims promoted
  against it, with explicit limitations for rabies/legal schedules and VPAT.
- Existing note pages now cross-link to their governed version, and back.
- Registry-growth guards: every topic must load + validate with unique stable
  ids, and every verification key must resolve to a real section (a renamed
  heading now fails the tests instead of silently orphaning a verified claim).

**Fixed**
- **Build CI had been red on every push.** `scripts/regen-bank-registry.mjs`
  sorted banks with `localeCompare()` and no locale, so it followed the
  machine's: this dev box is `th-TH` (whose collation ignores the `.`, giving
  `lect2, lect3, lect4, lect`) while the Linux CI runner is `C`/`en-US`
  (`lect, lect2, lect3, lect4`). A registry generated here therefore always
  looked STALE on CI even though its content was identical. Now sorted by code
  unit, which is the same on every platform. Counts unchanged (41 banks ·
  2948 Qs); the order-sensitive question-loader merge test was run explicitly.

## 2026-07-24 — VetWiki slice 1

**Added**
- `src/lib/vetwiki/` — governed-knowledge runtime: schema + stable ids, legacy
  adapter over `notes-*.js`, real external source registry, reference-
  verification overlay, validator, topic registry/loader.
- `src/views/KnowledgeView.jsx` — governed read page, honest per-section status
  in Thai, inline verified claims with real citations, and the
  "VetMock รู้เรื่องนี้ได้อย่างไร?" provenance panel.
- First governed topic: **COM5 · Rabies**, with 3 claims cross-checked against
  WOAH Terrestrial Manual ch 3.1.18 and Tepsumethanon et al. 2005.
- `FEATURE_FLAGS` in the feature registry (`visibleFeatures` now honours a
  `flag` field) — one-line rollback.
- Tests: `tests/unit/vetwiki.test.mjs` (9) + a VetWiki e2e spec (runs on
  chromium/webkit/firefox).

**Fixed**
- `wiki/domain/com5/` → `com-5/`: `com5` is a Windows reserved device name, so
  `git pull`/`clone` failed on every Windows machine.
- Exam reliability: deadline-based timer (background-tab + reload no longer
  hand out free time), exam clock restored on resume, quota-safe autosave,
  service-worker asset cache survives version bumps.
- a11y: black frame around dialogs on WebKit/Safari (`tabindex="-1"` +
  `:focus-visible !important` interaction).
- CI: data-layer consistency gate (`lint:curriculum` + `lint:registry`) added to
  the build workflow.

**Unchanged on purpose**
- `NotesView`, every existing route, the question banks, and user data.
