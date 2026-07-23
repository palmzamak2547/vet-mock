# DECISIONS

Architectural decisions with the reasoning, so future work doesn't re-litigate.

---

### D1 — Knowledge is derived live from `notes-*.js`, not copied into a new store
**Why:** the audit found 654 already-source-cited note sections. Copying them
would create a second source of truth that silently drifts from what students
read in `NotesView`. The adapter reads the note object by reference.
**Consequence:** editing a note updates VetWiki automatically; no migration, no
sync job, no "which one is right?".

### D2 — Structured runtime knowledge; markdown wiki stays the editorial layer
**Why:** เกษม's `wiki/**` pages are hand-authored markdown with HTML-comment
metadata — excellent as a human review artefact, poor as a runtime format
(needs a parser, no type safety, hard to validate). The app needs structured
objects for retrieval + validation + provenance.
**Decision:** two layers, **one vocabulary** (`evidenceStatus` / `reviewStatus` /
`sourceRefs`). Not a fork — a section can move between them without translation.

### D3 — Stable ids are `subject--topic--slug(heading)`
**Why:** note sections had NO ids (array index + heading string only). Identity
must not depend on index/filename/route/position.
**Trade-off:** renaming a heading changes the id. Accepted for now — headings are
stable in practice, and the alternative (hand-assigning ids to 654 sections)
blocks the whole slice. If churn appears, add an explicit `id:` to the note
section and have the adapter prefer it.

### D4 — Everything imports as `derived-note` / `draft`
**Why:** honesty by default. A lecture note is a paraphrase, not a verified fact.
Nothing is presented as verified because it happens to be in the app.

### D5 — Reference cross-check is a real, separate verification path — but never
### laundered as human review
**Why:** waiting for a professor's signature may block the product forever, but
pretending a machine check is a clinical sign-off is worse than doing nothing.
**Decision:** `reviewedBy:'reference-verified'`, `method:'reference-cross-check'`,
UI label "ตรวจทานกับแหล่งอ้างอิง". `validate.js` **errors** if a
`reference-verified` record claims `method:'human-domain-owner'`.
Clinical-scope promotion still requires a human (see TASKS blocked item).

### D6 — No fabricated citations, ever — enforced by code, not discipline
**Why:** a plausible-looking fake reference is the single most damaging thing a
knowledge product can ship.
**Decision:** sources live in one registry with an `availability` flag
(`verified-online` vs `named`). A URL is present only when actually checked.
`validate.js` rejects dangling sources and verified-claims-without-source. Unit
tests assert the rejection.

### D7 — Reuse `vmx-*` + `RichText`; do not start a new design system
**Why:** 154 existing component classes and 19 design tokens already give
light/dark, palette switching, 44px touch targets and focus rings for free.
**Exception:** `KnowledgeView` has a small local note-body renderer rather than
refactoring the live `NotesView` for this slice — a ~20-line duplication traded
against touching a working, high-traffic view. Revisit when a 2nd consumer appears.

### D8 — Additive route + feature flag instead of changing the IA now
**Why:** the audit found a real IA problem (37 flat views, "wall of cards" home).
Fixing it is valuable but is NOT this slice, and doing both at once makes
rollback impossible.
**Decision:** one lazy import + one dispatch line + one registry entry.
`FEATURE_FLAGS.VETWIKI_ENABLED=false` fully hides it.

### D9 — No vector database yet
**Why:** ~660 sections is small. Nothing has been benchmarked to show embedding
retrieval beats the existing `(subject, topic)` spine + text search.
**Decision:** defer until a measured retrieval failure justifies the cost and
operational surface. Keep knowledge portable so this stays cheap to change.

### D10 — `wiki/domain/com5/` → `com-5/`
**Why:** `com5` matches a Windows reserved device name (COM1–COM9); Windows
cannot create the folder, so `git pull`/`clone` failed on every Windows machine.
Not a preference — a correctness fix. `domainId: 'com5'` in frontmatter unchanged.
