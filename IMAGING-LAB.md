# Imaging Practice Lab — what's shipped & spin-out decision

A summary of the `/lab` route inside VetMock and the analysis Palm needs to decide whether to keep it integrated or spin it out as its own product.

**Status: LIVE in production** at https://vetmock.vercel.app/#lab and surfaced via the 🛠 FAB + footer link.

---

## Phase log (33 phases shipped)

| group | phases | landmark commits |
|---|---|---|
| **Foundation** | 1–7 | viewer · tools · measurements · Supabase schema · case library shell |
| **Privacy + multi-image** | 8–9 | DICOM anonymizer · recent files · 2-up study compare |
| **Persistence + sharing** | 10–11 | tag inspector · save attempt to Supabase · export annotated PNG |
| **Power user + AI hook** | 12–13 | keyboard shortcuts · mobile tap targets · AI prediction overlay |
| **Polish + launch prep** | 14 | decision doc |
| **Production launch** | 21 | verified deploy + Supabase migration applied + storage bucket + seeded น้องคอฟฟี่ case + Lab visible in FAB+footer |
| **Sync + JSON round-trip** | 22–23 | 2-up camera sync · measurement-state JSON export (round-trips via AI Load) |
| **UX wave 1** | 25–29 | ▶️ "ลอง demo" CTA · Reset confirm · 🪄 smart auto-contrast · adaptive height · animated loader |
| **UX wave 2** | 30, 32, 35 | ⛶ Fullscreen (F) · 🐶/🐱 species-adapted VHS reference · drag JSON on viewport |
| **Polish wave 3** | 37, 39, 42 | banner phrasing · per-file recent delete · case-library skeleton |
| **Drag-to-refine** | 33 | drag any placed Norberg/VHS point to nudge — no more redo |

Skipped intentionally (low value / high break risk for this session):
- Phase 31 — shared toolbar in 2-up. Two independent toolbars actually fit vet workflow better (Norberg on VD, VHS on Lateral).
- Phase 34 — pre-rendered case thumbnails. Useful with >5 cases; we have 1.
- Phase 44 — refactor Norberg/VHS to shared base class. Cleanup, no user impact, holds for next session.

## Bundle footprint (the no-regression promise still holds)

| chunk | pre-lab baseline | now | delta on existing users |
|---|---|---|---|
| `index` main | 69.22 KB gzip | **69.15 KB gzip** | **-0.07 KB** |
| `vendor-cornerstone` (lazy) | — | 475 KB | only loads on /lab open |
| `LabView` (lazy) | — | 6.4 KB | ditto |
| `DicomViewport` (lazy) | — | 12.0 KB | ditto |
| `CaseLibrary` (lazy) | — | 3.0 KB | ditto |
| `TagInspector` (lazy) | — | 3.2 KB | ditto |
| `anonymizer` (lazy) | — | 0.9 KB | only when 🔒 clicked |
| `export-image` (lazy) | — | 0.9 KB | only when 📤 clicked |

**99% of VetMock traffic pays zero bytes.** First /lab open downloads ~500 KB gzip, then SW-cached.

## What `/lab` actually does today

**Discovery**
- 🛠 FAB → 🔬 Imaging Lab (every screen)
- Footer "เครือข่าย Vet 86:" → 🔬 Imaging Lab
- URL hash `#lab` direct + bookmarkable

**Image handling**
- ▶️ One-click "ลอง demo case" — fetches most-recent public case
- 📁 Drag-drop 1–2 DICOMs (auto 2-up if 2)
- 📚 Browse case library (Supabase) with skeleton loader
- DICOM magic-byte detection (handles files without `.dcm` ext)
- Recent files (localStorage) with per-file delete

**Navigation**
- W/L · Pan · Zoom · 5 presets (🪄 Auto, DICOM, Soft, Bone, Lung) · Reset
- **🪄 Smart auto-contrast** = P1–P99 histogram stretch; applied as default on every image so opens look sharp not washed out
- **🔗 Sync views** (2-up) — camera mirrors with bounce suppression
- **⛶ Fullscreen** (F key)
- **Adaptive height** — viewport fits laptop screens without scroll cut

**Measurement**
- Cornerstone Length + Angle (mm via PixelSpacing)
- 🦴 **Norberg** (4-click guided, L/R classifier — Normal/Borderline/Dysplastic)
- 💗 **VHS** (6-click guided, species-aware reference range)
- **Drag any placed point to refine** — no Reset+redo needed
- 2-step Reset confirm — prevents fat-finger wiping work
- Undo last point (U key + button)
- Clear all annotations

**Persistence + sharing**
- 💾 Save attempt → Supabase `imaging_attempts` (per user, per case)
- 📥 Export measurement JSON (Norberg/VHS) — schema round-trips via 🤖 Load AI
- 📤 Export annotated PNG (canvas + SVG composite, timestamped filename)
- 🔒 In-browser anonymizer (22 PII tags) — downloadable `<name>_anon.dcm`

**Inspection**
- 🔍 Tag Inspector — 85-tag dictionary, PII highlight, filter by name/tag/value

**AI integration**
- 🤖 Load AI button OR drag JSON onto viewport
- Model-agnostic JSON schema in `src/lib/dicom/AI-INTEGRATION.md`
- Cyan/magenta diamonds, distinct from manual measurement colors
- Legend with model name/version/computed values

**Power-user**
- 17 keyboard shortcuts (W/P/Z/L/A/N/V/1–5/R/C/E/F/U/?/Esc)
- Help modal (? key)
- Onboarding banner (first visit, dismissible)

**Mobile**
- Responsive tap targets (36 px min)
- Compact tool labels on phone (icon + letter)
- Result cards become full-width bottom-sheets

## Production database state

Already applied to VetMock Supabase (`mpovsdzdggvksmeehqfj`):
- 3 tables — `imaging_cases`, `imaging_case_files`, `imaging_attempts`
- 4 RLS policies (public read · owner write · attempts own-only)
- 5 indexes
- 1 storage bucket — `lab-dicom` (private)
- 1 trigger — `imaging_cases_touch_updated_at`
- 1 SECURITY INVOKER function with locked search_path
- 1 seeded public case — น้องคอฟฟี่ (whole-body VD + Lateral, 15 PII tags stripped, status='public', consent_documented=true)

Security advisors: zero warnings from lab migration.

## Module boundary — spin-out ready

```
src/
├── views/LabView.jsx                       ← entry (lazy, hash #lab)
├── components/lab/
│   ├── DicomViewport.jsx                   ← Cornerstone3D wrapper + toolbar + sync + fullscreen
│   ├── NorbergOverlay.jsx                  ← 4-click guided + drag-refine
│   ├── VHSOverlay.jsx                      ← 6-click guided + species ref + drag-refine
│   ├── AIOverlay.jsx                       ← AI prediction renderer
│   ├── CaseLibrary.jsx                     ← Supabase-backed case grid + skeleton
│   └── TagInspector.jsx                    ← DICOM tags side panel
└── lib/dicom/
    ├── cornerstone-init.js                 ← singleton init
    ├── anonymizer.js                       ← 22-tag byte-level PII strip
    ├── tag-dict.js                         ← 85-tag dictionary
    ├── export-image.js                     ← canvas+SVG → PNG
    ├── save-attempt.js                     ← imaging_attempts writer
    ├── use-media-query.js                  ← responsive hook
    └── AI-INTEGRATION.md                   ← integration spec

supabase/
├── migrations/20260513000000_imaging_lab_init.sql
└── README-imaging-lab.md

vite.config.js                              ← +viteCommonjs, +cornerstone manualChunk
src/App.jsx                                 ← lazy LabView + #lab gate + footer link + FAB onLab
src/components/ToolsFAB.jsx                 ← onLab menu item
```

External coupling = three thin seams: App.jsx, vite.config.js, ToolsFAB.jsx. Spin-out remains straightforward.

## Recommendation: 2-week soft launch

The lab is now discoverable, measurable, savable, and the demo case is one click away. **Stop adding features, start watching usage.**

Action items for Palm:
1. Tell ~10 Vet 86 / clinical-rotation friends to try `#lab` (or just click 🛠 → Imaging Lab)
2. Sanity-check on iPhone Safari + iPad — touch UX is the biggest untested surface
3. Watch `imaging_attempts` table for organic activity over 2 weeks
4. Anonymize + seed any new DICOMs you'd like as public cases (use the in-app 🔒 button, then 1 SQL insert)
5. After 2 wk, decide integrate-deeper vs spin-out using the matrix below

| signal | action |
|---|---|
| < 5 unique users + you stopped using | quietly delete, no harm |
| < 5 users + you keep using | spin out — personal research tool |
| 5–20 users + organic word of mouth | keep in VetMock, add to nav, write up |
| 20+ users + clinicians ask for features | spin out — there's product-market fit |

## Phase backlog (next session)

- Phase 31 — shared toolbar in 2-up (only if real users ask)
- Phase 34 — pre-rendered case thumbnails (when >5 cases)
- Phase 44 — refactor MeasurementOverlay base class (when adding a 3rd tool)
- Phase 45 — Cornerstone3D AnnotationTool subclass migration (proper DICOM SR export)
- Phase 46 — guest mode: save attempts to localStorage if not signed in
- Phase 47 — attempts history view (list past Norberg/VHS per case per user)
- Phase 48 — `<LabApp/>` standalone build (for spin-out)
- Phase 49 — mobile-real-device test pass (iPad pen + iPhone landscape)

---

Last updated: through Phase 33 (Wave 4 commit).
