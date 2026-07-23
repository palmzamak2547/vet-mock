# RISKS

Live product with real students. Ranked by what would actually hurt.

---

### R1 · Verified-looking content that is wrong — HIGH impact
A claim marked "ตรวจทานกับแหล่งอ้างอิง" that misstates its source is worse than
no VetWiki at all, especially for dosage / vaccine schedules / legal content.
**Mitigations in place:** every source in one registry with an `availability`
flag; `validate.js` rejects dangling sources, verified-without-source, and
machine-review-claiming-human-method; unit tests assert those rejections;
promotions are hand-curated per claim, never bulk.
**Residual:** a human can still mis-summarise a real source. Clinical-scope
content stays blocked on human sign-off (TASKS `[!]`).

### R2 · Reference cross-check mistaken for clinical approval — HIGH
Users (or future code) treating "ตรวจทานกับแหล่งอ้างอิง" as clinical clearance.
**Mitigations:** distinct label + `method` enum; validator forbids laundering;
the provenance panel carries "ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก";
`approvedScopes` on each review record, scope mismatch warns.

### R3 · Heading rename silently changes a stable id — MEDIUM
`subject--topic--slug(heading)` breaks if a heading is reworded, orphaning any
verification overlay keyed to it.
**Mitigation now:** the overlay is small and reviewed. **Planned:** a lint gate
asserting every overlay key resolves to a real adapter section (so a rename
fails CI instead of silently dropping a verification).

### R4 · Knowledge drifts from the note it derives from — LOW (by design)
D1 makes this mostly structural — the note IS the source. But a note edit could
invalidate a verified claim's wording.
**Planned:** store a content hash per verified section; flag when it changes.

### R5 · Multi-committer churn on `main` — MEDIUM (operational)
Palm + เกษม + agent sessions all push `main` directly; concurrent pushes get
non-fast-forward rejections. Also caused an uncommitted working tree to be
committed by another actor.
**Mitigation:** `git pull --rebase` before push, or short-lived branches.

### R6 · AI cost / abuse when answers get grounded — MEDIUM
Grounded answers mean more LLM calls than today's grading-only usage.
**Mitigation:** reuse the existing `api/_lib/rate-limit.js` (20/hr/IP) pattern,
bounded token/timeout per call, and keep provider logic behind one module so a
cheaper model can be swapped without touching veterinary logic.

### R7 · Scope creep breaking a working app — MEDIUM
The platform vision is large; the app has live users mid-exam.
**Mitigation:** additive routes + feature flags, one slice at a time, full gate
(lint:all · build · unit · cross-engine e2e) + live verification before each
commit. Anything touching the mid-exam contract is proven in the browser first.

### R8 · Windows/cross-platform path traps — LOW (one already bit us)
`com5` (reserved device name) broke checkout on all Windows machines.
**Mitigation:** avoid reserved names (CON, PRN, AUX, NUL, COM0-9, LPT0-9) in
paths; the rename is done. Worth a lint if more content dirs get generated.
