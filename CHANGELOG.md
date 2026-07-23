# CHANGELOG (developer-facing)

> The in-app, user-facing changelog lives in the app data (`LATEST_CHANGELOG`)
> and follows its own rules. This file is the engineering log.

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
