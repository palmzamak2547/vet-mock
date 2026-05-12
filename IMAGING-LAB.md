# Imaging Practice Lab — what's shipped & spin-out decision

A summary of the experimental `/lab` route inside VetMock and the analysis Palm needs to decide whether to keep it integrated or spin it out as its own product.

Branch: `feat/imaging-lab` · 7 commits · NOT merged to `main`.

## What's in (7 phases, one session)

| # | commit | what | key fact |
|---|---|---|---|
| 1 | `8bcbc69` | Lazy `LabView` at hash `#lab` · Cornerstone3D 4.22.4 · drag-drop + render | first DICOM rendered: 1748×1211, 12-bit, Explicit VR LE |
| 2 | `67681e2` | W/L + Pan + Zoom tools · 4 tissue presets · Reset view | toolbar with mutually-exclusive Primary binding |
| 3 | `1ad0b6a` | Length + Angle measurement · Clear annotations | mm calibration confirmed (0.140 mm/px from PixelSpacing tag) |
| 4 | `0c661a7` | **Norberg angle tool (4-click L/R)** | world-coord overlay, classifier: Normal/Borderline/Dysplastic |
| 5 | `da0d78b` | Supabase schema — `imaging_cases` + `_case_files` + `_attempts` + RLS | migration in `supabase/migrations/`, README with anonymization checklist |
| 6 | `49cd4bb` | VHS tool (Vertebral Heart Score, 6-click) | canine 8.5–10.5 / feline 6.7–8.1 reference |
| 7 | (this) | Case library UI · LabView mode-switching · decision doc | reads `imaging_cases` where status='public', signed-URL fetch from Storage |

## Bundle footprint (the no-regression promise)

| chunk | baseline (pre-lab) | after Phase 7 | delta on existing users |
|---|---|---|---|
| `index` main | 69.22 KB gzip | 68.60 KB gzip | **-0.62 KB** |
| `vendor-react` | 44.18 KB | 44.18 KB | 0 |
| `vendor-supabase` | 50.73 KB | 50.51 KB | ≈0 |
| `vendor-cornerstone` (NEW, lazy) | — | 475.71 KB gzip | only loads on `/lab` open |
| `LabView` (lazy) | — | 2.28 KB | ditto |
| `DicomViewport` (lazy) | — | 4.68 KB | ditto |
| `CaseLibrary` (lazy) | — | 2.59 KB | ditto |

**Existing VetMock users (99% of traffic) pay zero bytes for the lab.** First open of `/lab` downloads ~480 KB gzip then SW-caches.

## Module boundary — spin-out readiness

Every lab file lives in a self-contained namespace. Touching code = grep `lab` and find everything.

```
vet-mock/
├── src/
│   ├── views/LabView.jsx                       ← entry (lazy, hash #lab)
│   ├── components/lab/
│   │   ├── DicomViewport.jsx                   ← Cornerstone3D wrapper + toolbar
│   │   ├── NorbergOverlay.jsx                  ← 4-click angle measurement
│   │   ├── VHSOverlay.jsx                      ← 6-click VHS measurement
│   │   └── CaseLibrary.jsx                     ← Supabase-backed case list
│   └── lib/dicom/cornerstone-init.js           ← singleton init
├── supabase/
│   ├── migrations/20260513000000_imaging_lab_init.sql
│   └── README-imaging-lab.md
└── vite.config.js                              ← +viteCommonjs, +cornerstone manualChunk
   src/App.jsx                                  ← +lazy LabView, +#lab gate (≤20 lines)
```

External coupling = **two thin seams in App.jsx and vite.config.js**. Everything else is its own namespace. Spin-out is straightforward.

## Spin-out steps (if Palm decides yes)

1. New repo `vetlab` (or whatever brand)
2. Copy: `src/views/LabView.jsx`, `src/components/lab/`, `src/lib/dicom/`, `supabase/`
3. New `src/App.jsx` with just `<LabView />` as the root (kill the `view` state machine)
4. Strip from `vite.config.js`: keep CJS plugin + cornerstone manualChunk + esnext + worker:es
5. Strip auth gate logic (LabView already works anon)
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

1. **Seed 3 cases** — Palm runs DICOM through an anonymizer (or uses an open vet dataset like the OFA reference set), uploads to `lab-dicom`, inserts `imaging_cases` rows with `status='public'`. Verify the Case Library renders + opens them.

2. **Use it personally for senior project work** — measure 20 real cases for the Norberg/CHD AI project using the in-lab tool. If the tool isn't right for that workflow, that's the biggest signal you'll get.

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
- **Patient privacy** — `imaging_cases.consent_documented` is a flag, not an enforcement. Operational discipline only. One mis-flipped case = a problem. Consider a future migration that REQUIRES `consent_documented = true` for `status='public'` rows via a check constraint.
- **Drag/measure UX on touch** — the overlay tools use `onPointerDown` which works on mouse + touch + pen, but the toolbar buttons are small for mobile. A touch pass before opening to wider audience.
- **Bundle creep** — each new measurement tool adds ~3–5 KB to DicomViewport chunk. Acceptable, but past 50 KB the lazy chunk download starts feeling slow on 3G. The eventual refactor is a shared `MeasurementOverlay` base class.

## Next phases (if integrated path)

- Phase 8 — Migration to Cornerstone3D AnnotationTool subclass for proper DICOM SR export, undo/redo, persistence
- Phase 9 — Save measurements to `imaging_attempts` table (Norberg/VHS results per user per case)
- Phase 10 — AI overlay slot (load model prediction alongside manual measurement, compare)
- Phase 11 — Multi-view comparison (open VD + Lateral side-by-side)
- Phase 12 — Mobile touch UX pass (larger hit targets, pinch zoom)

---

Last updated: 2026-05-12 · auto-generated by Phase 7 commit.
