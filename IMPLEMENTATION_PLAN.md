# VetMock → Veterinary Intelligence Platform · Implementation Plan

**Status:** first VetWiki vertical slice SHIPPED (2026-07-24)
**Rule:** reuse-first, additive, never break the live app. Every change is a
pure addition, display-only fix, or feature-flagged surface until proven.
Authoritative content numbers come from `npm run stats` (see
`docs/content-inventory.md`) — never from memory or a hand-written figure.

---

## 1. Where we actually started (grounded baseline, 2026-07-23 audit)

Measured from the repo, not assumed:

| Asset | Reality | Verdict |
|---|---|---|
| Question bank | **2,948 Qs** across 41 `questions-*.js`, every Q has a stable numeric id + `(subject, topic, year, source, verified)` | **reuse** — the identity backbone |
| Study notes | 12 `notes-*.js`, **720 source-cited sections** (150 topics), all wired into `NotesView` via `RichText` | **reuse + improve** — but had **zero stable section ids** |
| Video summaries | 400 videos across 27 files, keyed by YouTube videoId | reuse (2nd adapter target) |
| Taxonomy | `curriculum.js` `(subject, topic)` used by notes AND questions | **reuse** — the canonical join spine |
| Governed knowledge | `wiki/**` — 2 hand-authored pages + review packs (เกษม), full schema, **markdown-only, 0 governance tokens in `src/`** | **complete it** — schema was right, runtime was missing |
| AI | server-side Claude in `api/grade-summary.js` (grading only) + rate-limit/CORS lib. No in-browser ML | **extend** — the tool-endpoint template |
| Backend | Supabase (15 tables, 24 RLS policies, all `auth.uid()`-scoped) + 5 Vercel functions | reuse as-is |
| Imaging | Cornerstone3D DICOM viewer + deterministic Norberg/VHS/Length/Angle math | reuse → expose as deterministic tools |
| Design system | **154 `vmx-*` classes / 19 `--clr-*` tokens**, light+dark, 44px touch floor | **reuse — do not invent components** |
| Gates | `lint:all` (6 linters) + build CI + cross-engine Playwright smoke | reuse, extend |

**Conclusion:** almost nothing needed building from scratch. The real gap was a
**runtime knowledge layer with provenance** — everything else already existed.

---

## 2. VetWiki architecture (as built)

Knowledge is **derived live** from the existing note corpus. No content copy,
no second source of truth, no migration.

```
src/data/notes-com5.js        (existing corpus — untouched, still NotesView's source)
        │
        ▼  adapter.js — synthesises STABLE ids: `subject--topic--slug(heading)`
KnowledgeTopic { sections[] }   ← every section imported honestly as
        │                          evidenceStatus:'derived-note', reviewStatus:'draft'
        ▼  verification.js — the ONLY promoter, and only against a real source
KnowledgeSection { claims[] }   ← 'verified' + real citation
        │
        ├─ validate.js  — trust gate (rejects dangling/fabricated/laundered)
        ▼
KnowledgeView.jsx             — read page + "VetMock รู้เรื่องนี้ได้อย่างไร?"
```

The markdown `wiki/**` layer (เกษม's domain pages + review packs) stays the
**human editorial/review artefact**; this is the **app runtime** layer. They
deliberately share field names (`evidenceStatus` / `reviewStatus` /
`sourceRefs`) so a section can move between them with no translation table.

### Why verification-by-reference (not "wait for a professor")
The review packs gate `mappingEligible` behind a domain-owner signature. That
may never arrive. So we added a second, honest path: cross-check a claim
against an **authoritative external source** and record it as
`reviewedBy:'reference-verified'`, `method:'reference-cross-check'`.
The validator **forbids** a machine check from claiming
`method:'human-domain-owner'`, and the UI labels it "ตรวจทานกับแหล่งอ้างอิง" —
never as qualified human sign-off.

---

## 3. Shipped (slice 1 · COM5 Rabies)

- `src/lib/vetwiki/` — schema, adapter, sources, verification, validate, index
- `src/views/KnowledgeView.jsx` — governed read page + provenance panel
- 3 claims verified against **real** sources:
  - WOAH Terrestrial Manual **ch 3.1.18** (Lyssavirus taxonomy; FAT/DFA as the
    WHO+WOAH-recommended standard) — URL verified
  - **Tepsumethanon V, Wilde H, Meslin FX.** J Med Assoc Thai 2005;88(3):419-22
    (6 criteria, sens 90.2% / spec 96.2%) — citation verified
- Contextual actions route into existing features (practice / notes)
- Rollback: `FEATURE_FLAGS.VETWIKI_ENABLED = false`

**Verified:** lint:all 0 errors · build green · unit 9/9 · cross-engine e2e
28/28 · live desktop+mobile, 0 console errors, 0 overflow.

---

## 4. Next (in order — one at a time, verified before the next)

1. **Coverage** — adapt the remaining COM5 topics (`cve`, `vaccine`), then a
   second subject. One registry row each; no new plumbing.
2. **Search/retrieval** — index governed sections so `⌘K` and the AI can find a
   section by meaning, returning `sectionId` (not prose).
3. **Answer grounding** — extend `api/grade-summary.js`'s Claude+rate-limit
   template into an explain endpoint that returns `SupportedAnswerClaim[]`, and
   run `validate.js` over the result **before** rendering.
4. **Question explanations** — link each Q's `verified` locator to the governed
   section that supports it (the `(subject, topic)` spine already exists).
5. Imaging measurements as deterministic tools → attach results to knowledge.

**Not doing yet (deliberately):** vector DB (no benchmark justifies it),
multi-agent loops, a rewrite of the home IA, or migrating all 720 sections
before the pattern is proven on one topic.
