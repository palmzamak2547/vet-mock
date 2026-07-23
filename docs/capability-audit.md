# Capability audit — what VetMock already had (2026-07-23)

Ground-truth inspection before the platform work. Every row was verified
against the repo (file, count, or `file:line`) — nothing assumed missing.

Classification: **reuse** · **improve** · **complete** · **integrate** ·
**build** · **replace**

---

## Content + knowledge

| Capability | Evidence | Verdict |
|---|---|---|
| Question bank | `q-counts.js` `QB_TOTAL=2948`; 41 `questions-*.js`; each Q has stable numeric `id` + `subject/topic/year/source/verified` | **reuse** — identity backbone |
| Study notes | 12 `notes-*.js`; 654 `heading:` and 654 `source:` (1:1); shape `{topic,title,lecturer,icon,summary,sections:[{heading,source,body}]}` | **improve** — rich + cited, but `grep '\bid:'` = **0** (no stable ids) |
| Note read page | `NotesView.jsx` maps 12 subjects, renders via `RichText` (`lib/richtext.jsx`) | **reuse** — the renderer, wrapped with governance chrome |
| Video summaries | 28 files keyed by stable YouTube videoId + `video-summaries-meta.js` | **reuse** — 2nd adapter target |
| Taxonomy | `curriculum.js` `SUBJECTS[].topics[]`; same topic ids used by notes AND questions | **reuse** — canonical join spine |
| Governed knowledge | `wiki/**`: 2 domain pages + 2 review packs; full frontmatter + per-section `wiki-section-meta`; **0 governance tokens in `src/`** | **complete** — schema right, runtime missing |
| Review workflow | review packs define `draft→reviewed→approved` + the `mappingEligible` predicate | **reuse** — as the editorial policy |
| Source provenance | `sources.js` per-subject `{files,contributors,topics}` | **improve** — page-level only; section-level evidence grading was new |

## AI + backend

| Capability | Evidence | Verdict |
|---|---|---|
| LLM integration | `api/grade-summary.js` — Anthropic Claude (`claude-sonnet-4-5`), grading written answers only | **improve** — the template for new tool endpoints |
| API layer | 5 Vercel functions + `api/_lib/rate-limit.js` (20/hr/IP, origin-aware CORS) | **reuse** |
| In-browser ML | grep transformers/onnx/web-llm = **none** | **build** (if ever needed) |
| Auth + data | Supabase, 15 tables, 24 RLS policies all `auth.uid()`-scoped; `useAuth.js` lazy SDK | **reuse** |
| Offline/PWA | service worker (cache-first hashed assets, network-first HTML) | **reuse** |
| Imaging/DICOM | Cornerstone3D 4.22 viewer + pure client-side Norberg / VHS / Length / Angle math | **reuse** → expose as deterministic tools |
| Imaging adoption | 17 seeded cases, **0** saved attempts | **complete** — loop built, unproven |

## UX / IA

| Capability | Evidence | Verdict |
|---|---|---|
| Routing | single `view` string, ~37 destinations, no per-view URLs (only `#lab`) | **improve** |
| Feature registry | `lib/feature-registry.js` — 30 features/4 categories, feeds home grid + ⌘K + FAB | **reuse** — the IA backbone |
| Home | 2067-line `HomeView`, ~16 stacked sections (the code itself calls it รก) | **improve** |
| Context actions | `NextActionCard` — proven pattern, but only on home | **reuse + generalise** |
| Persistent nav | none (header + scroll + ⌘K + FAB) | **build** (later) |
| Cases | no "cases" concept anywhere | **build** (later) |

## Quality / security

| Capability | Evidence | Verdict |
|---|---|---|
| Commit gate | `lint:all` = 6 linters (ids, dupes, academic-safety, questions, curriculum, registry) | **reuse** |
| CI | `build.yml` (Vite + data-consistency), `smoke-e2e.yml` (Playwright, 4 projects / 3 engines), `lint-questions.yml` MAX_ERRORS=0 ratchet | **reuse** |
| Tests | 6 e2e smoke + 2 node:test unit | **improve** — thin but sharp |
| Design system | 154 `vmx-*` classes, 19 `--clr-*`/`--shadow-*` tokens, light/dark + 6 palettes | **reuse — do not reinvent** |
| a11y | 44px touch floor, skip link, focus-visible, `prefers-reduced-motion` ×3 | **reuse** — preserve invariants |
| Security | 24 RLS policies, strict CSP + hardening headers, `safeImageUrl` allow-list, only 2 escaped `dangerouslySetInnerHTML` sinks | **reuse** |

---

## What this changed about the plan

The instinct "build a knowledge platform" was wrong: **the content, taxonomy,
renderer, design system, gates, auth, and even the governance *schema* already
existed.** The single genuine gap was a **runtime layer that turns existing
notes into governed knowledge with traceable provenance** — which is exactly
(and only) what slice 1 built.
