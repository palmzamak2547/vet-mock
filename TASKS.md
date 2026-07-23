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

## Slice 2 — coverage (done)
- [x] All 5 COM5 topics governed (rabies · vaccine · cve · sporo-crypto ·
      gi-protozoa) — 41 sections, one registry row each, no new plumbing
- [x] WSAVA 2024 verified + 2 vaccine claims promoted against it
      (Squires et al. JSAP 2024;65:277-316, doi:10.1111/jsap.13718)
- [x] Guard tests that grow with the registry: every topic loads + validates
      with unique ids; every verification key resolves to a real section
      (renaming a heading now fails loudly — closes RISKS R3)
- [x] Integration #1 — existing note page cross-links to its governed version
      (bidirectional, flag-gated, only for governed topics)

## Slice 3 — retrieval + grounded answers (next)
- [ ] Index governed sections for `⌘K` (return `sectionId`, not prose)
- [ ] Explain endpoint from the `api/grade-summary.js` Claude+rate-limit template
- [ ] `SupportedAnswerClaim[]` output + `validate.js` run BEFORE render
- [ ] Inline source markers in answers → jump to the exact governed section
- [ ] Report-a-concern flow
- [ ] Integration #3 — question explanations link to the governed section that
      supports them (the `(subject,topic)` spine already exists)

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
