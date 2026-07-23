# TASKS

`[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

## Slice 1 — VetWiki foundation + governed read page (COM5 Rabies)
- [x] Ground-truth repo audit (5 dimensions, real file:line evidence)
- [x] Knowledge schema + stable ids (`subject--topic--slug(heading)`) + Thai labels
- [x] Legacy adapter: `notes-*.js` → governed knowledge (no content copy)
- [x] Real external source registry (no fabricated DOI/URL/author)
- [x] Reference-verification overlay (WOAH ch 3.1.18 · Tepsumethanon 2005)
- [x] Validator: dangling/fabricated/unsupported/laundered-review rejection
- [x] Read page reusing `RichText` + `vmx-*` kit + design tokens
- [x] "VetMock รู้เรื่องนี้ได้อย่างไร?" provenance panel
- [x] Contextual actions → existing practice + notes features
- [x] Feature flag rollback (`FEATURE_FLAGS.VETWIKI_ENABLED`)
- [x] Unit tests 9/9 · cross-engine e2e 28/28 · live desktop+mobile verified

## Repo health (found + fixed along the way)
- [x] `wiki/domain/com5/` renamed → `com-5/` — `com5` is a Windows reserved
      device name (COM1–COM9) and broke `git pull`/`clone` on every Windows machine
- [x] Data-layer consistency gate added to `build.yml` CI
- [x] Exam: deadline-based timer · clock survives resume · quota-safe autosave ·
      SW cache survives version bumps
- [x] a11y: black-frame regression on WebKit dialogs (`tabindex="-1"` +
      `:focus-visible` `!important` interaction)

## Slice 2 — coverage + retrieval (next)
- [ ] Adapt remaining COM5 topics (`cve`, `vaccine`) — one registry row each
- [ ] Verify 2–3 more claims per topic against real references
- [ ] Index governed sections for `⌘K` + retrieval (return `sectionId`, not prose)
- [ ] Lint gate: every governed section resolves to a real note section

## Slice 3 — grounded answers
- [ ] Explain endpoint from the `api/grade-summary.js` Claude+rate-limit template
- [ ] `SupportedAnswerClaim[]` output + `validate.js` run BEFORE render
- [ ] Inline source markers in answers → jump to the exact governed section
- [ ] Report-a-concern flow

## Later
- [ ] Question explanations ↔ governed sections (via the `(subject,topic)` spine)
- [ ] Imaging measurements exposed as deterministic tools
- [ ] Video-summary adapter (2nd corpus, stable YouTube ids)

## Blocked / needs a human
- [!] Human domain-owner sign-off for `mappingEligible: true` on clinical
      content (dosage, vaccine schedules, legal). Reference cross-check is
      deliberately NOT a substitute — the validator enforces the distinction.
