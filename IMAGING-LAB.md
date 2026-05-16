# Imaging Practice Lab — what's shipped & spin-out decision

A summary of the experimental `/lab` route inside VetMock and the analysis Palm needs to decide whether to keep it integrated or spin it out as its own product.

Branch: `feat/imaging-lab` · 14+ commits · NOT merged to `main`.

## Phases shipped (13 phases, 1 session)

| # | commit | what | key fact |
|---|---|---|---|
| 1 | `8bcbc69` | Lazy `LabView` at hash `#lab` · Cornerstone3D 4.22.4 · drag-drop + render | first DICOM rendered: 1748×1211, 12-bit, Explicit VR LE |
| 2 | `67681e2` | W/L + Pan + Zoom tools · 4 tissue presets · Reset view | mouse-button conventions matched PACS |
| 3 | `1ad0b6a` | Length + Angle measurement · Clear annotations | **mm calibration confirmed (0.140 mm/px from PixelSpacing tag)** |
| 4 | `0c661a7` | **🦴 Norberg angle tool** (4-click L/R, world-coord overlay, classifier) | senior project hook |
| 5 | `da0d78b` | Supabase schema — `imaging_cases` + `_case_files` + `_attempts` + RLS | migration ready in `supabase/migrations/` |
| 6 | `49cd4bb` | **📐 VHS tool** (Vertebral Heart Score, 6-click) | canine 8.5–10.5 / feline 6.7–8.1 ref |
| 7 | `b76849e` | Case library UI (Supabase fetch) · LabView mode switching | empty-state handling for pre-migration |
| `8ad783d` | (fix) | hasSupabase boolean + pre-migration graceful empty state | caught in first end-to-end test |
| 8 | `9a0e003` | bug sweep · DICOM anonymizer · recent files history | 22-tag in-browser PII stripper |
| 9 | `81d6657` | **multi-image study viewer** (2-up side-by-side) | VD + Lateral compare |
| 10 | `60b276d` | **DICOM tag inspector** · save measurement to Supabase | 85-tag dictionary + PII highlight |
| 11 | `da75fdb` | **Export annotated PNG** (canvas + SVG composite) | timestamped download |
| 12 | `23bf748` | **Keyboard shortcuts** (W/P/Z/L/A/N/V/1-4/R/C/E/?) + touch targets + help modal | study-mode pseudo-sync via shared keys |
| 13 | `896d70d` | **🤖 AI prediction overlay** (model-agnostic JSON-drop) | hook for Palm CHD AI senior project |

## Bundle footprint (the no-regression promise)

| chunk | baseline (pre-lab) | after Phase 13 | delta on existing users |
|---|---|---|---|
| `index` main | 69.22 KB gzip | 68.60 KB gzip | **-0.62 KB** |
| `vendor-react` | 44.18 KB | 44.18 KB | 0 |
| `vendor-supabase` | 50.73 KB | 50.51 KB | ≈0 |
| `vendor-cornerstone` (NEW, lazy) | — | 475.72 KB gzip | only loads on `/lab` open |
| `LabView` (lazy) | — | 4.30 KB | ditto |
| `DicomViewport` (lazy) | — | 8.60 KB | ditto |
| `CaseLibrary` (lazy) | — | 2.73 KB | ditto |
| `TagInspector` (lazy) | — | 3.22 KB | ditto |
| `anonymizer` (lazy) | — | 0.90 KB | only loads when 🔒 Anonymize clicked |
| `export-image` (lazy) | — | 0.86 KB | only loads when 📤 Export PNG clicked |

**Existing VetMock users (99% of traffic) pay zero bytes for the lab.** First open of `/lab` downloads ~495 KB gzip then SW-caches.

## What `/lab` does today (capability summary)

**Image handling**
- Drag-drop or file-picker single or **two DICOMs** (2-up side-by-side study compare)
- DICOM magic-byte detection (works for files without `.dcm` extension)
- Recent-files history in localStorage (max 5)
- Case library — fetches `imaging_cases` (status=`public`) from Supabase, opens with one-click; multi-view cases (VD + Lat) auto-load to 2-up

**Navigation**
- Window/Level (left drag default; bindable)
- Pan (middle drag always)
- Zoom (right drag always)
- 4 W/L presets: Default (DICOM) · Soft tissue · Bone · Lung
- Reset camera + window in one click

**Measurement**
- Cornerstone Length (mm via PixelSpacing)
- Cornerstone Angle (degrees)
- 🦴 Norberg angle — 4-click guided workflow with L/R results and Normal/Borderline/Dysplastic classification
- 📐 VHS — 6-click guided workflow with L+S vertebrae ratio reported
- Clear all measurements with one click

**Persistence**
- Save Norberg/VHS attempt to Supabase `imaging_attempts` (per user, per case if from library)
- Anonymize: in-browser byte-level PII strip on 22 DICOM tags → downloadable `<name>_anon.dcm`
- Export: canvas + all SVG overlays composited to PNG, downloaded with timestamp

**Inspection / debug**
- 🔍 Tag Inspector side panel — lists every parsed DICOM tag, name-resolved via 85-tag dictionary; filter by name/tag/value; "PII only" toggle highlights identifying info that needs anonymization

**Power-user**
- Keyboard shortcuts (W/P/Z/L/A/N/V/1-4/R/C/E/?/Esc) — apply to ALL open viewports simultaneously in study mode
- Help modal accessible via `?` or ⌨ button

**AI integration (hook ready, model TBD)**
- 🤖 Load AI button: drop a prediction JSON onto the viewer
- Model-agnostic JSON schema (see `src/lib/dicom/AI-INTEGRATION.md`)
- Cyan/magenta diamond overlay distinct from manual measurement colors
- Legend with model name/version/computed values
- Works alongside manual measurement for side-by-side comparison

## Module boundary — spin-out readiness

Every lab file lives in a self-contained namespace. Touching code = grep `lab` and find everything.

```
vet-mock/
├── src/
│   ├── views/LabView.jsx                       ← entry (lazy, hash #lab)
│   ├── components/lab/
│   │   ├── DicomViewport.jsx                   ← Cornerstone3D wrapper + toolbar
│   │   ├── NorbergOverlay.jsx                  ← 4-click angle workflow
│   │   ├── VHSOverlay.jsx                      ← 6-click VHS workflow
│   │   ├── AIOverlay.jsx                       ← AI prediction renderer
│   │   ├── CaseLibrary.jsx                     ← Supabase-backed case grid
│   │   └── TagInspector.jsx                    ← DICOM tags side panel
│   └── lib/dicom/
│       ├── cornerstone-init.js                 ← singleton init
│       ├── anonymizer.js                       ← byte-level PII strip
│       ├── tag-dict.js                         ← 85-tag dictionary
│       ├── export-image.js                     ← canvas+SVG → PNG
│       ├── save-attempt.js                     ← imaging_attempts writer
│       └── AI-INTEGRATION.md                   ← model integration spec
├── supabase/
│   ├── migrations/20260513000000_imaging_lab_init.sql
│   └── README-imaging-lab.md
├── vite.config.js                              ← +viteCommonjs, +cornerstone manualChunk
└── src/App.jsx                                 ← +lazy LabView, +#lab gate (≤20 lines)
```

External coupling = **two thin seams in App.jsx and vite.config.js**. Everything else is its own namespace. Spin-out is straightforward.

## Spin-out steps (if Palm decides yes)

1. New repo `vetlab` (or whatever brand)
2. Copy: `src/views/LabView.jsx`, `src/components/lab/*`, `src/lib/dicom/*`, `supabase/*`
3. New `src/App.jsx` with just `<LabView />` as the root (kill the `view` state machine)
4. Strip from `vite.config.js`: keep CJS plugin + cornerstone manualChunk + esnext + worker:es
5. Strip auth gate logic (lab works anon)
6. New Supabase project (or reuse if comfortable with one DB serving two apps)
7. Apply `imaging_lab_init.sql` to the new project
8. Create the `lab-dicom` storage bucket
9. New Vercel project → new domain (e.g. `vetlab.app` / `vetimaging.cu`)

In VetMock side, removal is one PR:
- Revert the 5 lines of App.jsx
- Revert vite.config.js changes
- `git rm -r src/{views/LabView.jsx,components/lab,lib/dicom}`
- `git rm -r supabase/`
- `npm uninstall @cornerstonejs/{core,tools,dicom-image-loader} dicom-parser @originjs/vite-plugin-commonjs`

## Recommendation: integrate further before spinning out

**Don't decide spin-out yet — collect signal first.**

Three milestones to hit before the decision is real:

1. **Seed 3 cases** — Palm runs DICOM through the in-app anonymizer (🔒 Anonymize → downloads `_anon.dcm`), uploads to `lab-dicom`, inserts `imaging_cases` rows with `status='public'`. Verify the Case Library renders + opens them.

2. **Use it personally for senior project work** — measure 20 real cases for the Norberg/CHD AI project using the in-lab tool. If the tool isn't right for that workflow, that's the biggest signal. Then drop AI model output JSON into the same image (`🤖 Load AI`) for manual-vs-AI comparison.

3. **Tell ~10 Vet 86 / clinical-rotation friends** about the `#lab` hash. Watch what they do.

After 2 weeks: count unique users who measured ≥1 case. Decide based on the four corners:

| signal | action |
|---|---|
| < 5 users + you stopped using it | quietly delete, no harm done |
| < 5 users + you keep using it | spin out — it's a personal research tool, not a VetMock feature |
| 5–20 users + organic word of mouth | **keep in VetMock**, surface in nav, write up for paper as "rapid prototyping case study" |
| 20+ users + clinical clinicians ask for features | **spin out** — there's product-market fit, VetMock identity will drift if it stays |

## Risks to watch

- **Vercel deploy quota** — feature-branch work is safe (no auto-deploy), but each merge to main = 1 production deploy. Don't burst.
- **Identity drift** — current framing is "Practice Lab" (learning). The minute someone tries to use it on a real patient mid-consultation, that's a re-framing event. Either lean into clinical use cases (with all the regulatory weight that entails) or keep the practice-only framing rigid.
- **Patient privacy** — `imaging_cases.consent_documented` is a flag, not an enforcement. The in-app 🔒 Anonymize button helps but isn't a full HIPAA Safe Harbor (doesn't handle private tags, burnt-in image overlays, or SR content). Always spot-check anonymized output before publishing.
- **Drag/measure UX on touch** — Phase 12 bumped tap targets to 36 px and bound `onPointerDown` (touch-compatible) but a real iPad pass on the toolbar is still pending.
- **Bundle creep** — each new measurement tool adds ~3–5 KB to DicomViewport chunk. Currently at 8.6 KB gzip. Past 50 KB the lazy chunk download starts feeling slow on 3G. The eventual refactor is a shared `MeasurementOverlay` base class.

## Phase roadmap (if integrated path)

**Done**: Phases 1–13.

**Next candidates** (in priority order):
- Phase 14: shareable session links (encode case + tool + points in URL hash for "send this view to a colleague")
- Phase 15: per-pane independent vs synced zoom/pan (the 2-up viewer currently has no sync)
- Phase 16: extract shared `MeasurementOverlay` base — refactor NorbergOverlay/VHSOverlay/future tools onto it (DRY + persistence + undo/redo)
- Phase 17: migrate to Cornerstone3D AnnotationTool subclass for proper DICOM SR export
- Phase 18: AI prediction history view — list past `imaging_attempts` (manual + AI) per case
- Phase 19: clinical glossary tooltips on measurement names (Norberg/VHS/etc.)
- Phase 20: mobile/touch pass — collapsible toolbar sections, bottom-sheet UI on phone, pinch-to-zoom hardening

---

Last updated: 2026-05-12 · auto-generated through Phase 13 commit.
