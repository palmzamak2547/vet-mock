# Atlas labels: anchored name labels on the 3D veterinary atlas

*   **Author:** Kasem
*   **Status:** Proposed
*   **Date:** 2026-11-07

--------------------------------------------------------------------------------

## Overview

VetMock's study atlas (`atlas` view at `/app/atlas`, plus the standalone `atlas.html` shell) shows eight published 3D specimens built from licensed geometry: the visible dog (`canine-visible-ajou`), the abdomen specimen (`canine-abdomen-pixelbeaker`), the stark musculoskeletal dog (`canine-musculoskeletal-stark`), the whole canine skull (`canine-skull-nih282`), the segmented skull base (`canine-skull-base-cuhl9`), the equine skull (`equine-skull-edinburgh`), and the feline skeleton and écorché pair (`feline-skeleton-westerly`, `feline-ecorche-westerly`; écorché — the skinless muscle figure). Students rotate the model, explode it apart with a slider, compare two specimens side by side, toggle system layers, and run a name-recall quiz — but the model itself never says what the student is looking at. Names live in the part directory and the inspector, which answer "what is this pick called" only after the student has already picked.

This design adds a **label layer**: name labels anchored to structures and projected over the model. Labels show Thai with the Latin name underneath, are visible by default in Explore, hide by one toggle, and selecting any structure — by tapping the model or clicking the directory — emphasizes that structure's label. One segmented specimen ships first: **`canine-visible-ajou`** with 10-20 curated labels. Later specimens adopt the same regen-and-lint pipeline.

## The Problem

The atlas has the names and has the geometry, but keeps them in separate UI surfaces:

- The part directory lists 32 named parts for the visible dog, yet a student learning from the rotating model cannot ask "which one am I looking at?" without naming first, by definition of the list.
- The recall quiz ("ทบทวนชื่อ" — "review names") can reward recall, but nothing on screen helps a student who is still building the vocabulary.

The feature is justified by **spatial learning**: which shape sits where on the model. A list cannot teach position; that is why the near-free alternative — a one-line nudge pointing students at the directory — was considered and declined (Alternative F). Students studying anatomy from real atlases read labels directly on the plate; our 3D equivalent is missing that surface. The solution: an anchored label layer whose data goes through the same regen gate as the specimen models, with explicit per-mode states so it never leaks answers into the existing quiz.

## Owner decisions

All decisions below were made by the owner (Palm) on 2026-11-07; items 11-12 were added during the review round the same day. They are constraints, not proposals.

1.  Pilot specimen: `canine-visible-ajou`.
2.  Latin: drafted for the chosen label set only — hard rule (draft, then review).
3.  Small screens: labels collapse to anchor dots below a measured stage-size threshold.
4.  Compare mode v1: labels off entirely.
5.  Recall mode v1: labels hidden.
6.  PNG export v1: label-free, existing credit line unchanged.
7.  Data placement: authored input → regen scripts → generated registry, covered by `lint:atlas`, offline-safe. (Refined in review: the authored file is a **sibling input** to the ledger pipeline, not a member of the `public/atlas/*-provenance.json` family — the converter rewrites those on reconversion.)
8.  Performance: a dedicated measured budget row for the new dynamic chunk.
9.  Occlusion: none in v1 at 10-20 density; revisit from real-use feedback.
10. Toggle persistence: session-only.
11. Latin visibility across surfaces (review decision): v1 keeps Latin in the label layer only; the inspector and directory keep their current behavior, and the divergence is accepted for v1 with a named phase-2 home (Future Improvements). The atlas budget row stays byte-identical. **Never** write drafted Latin back into `src/data/atlas-visible-dog.js` — that file is hand-authored data, and write-back would turn it into a generated file.
12. Toggle rendering on unlabeled specimens (review decision): the toggle renders **disabled**, so its position stays stable across specimens.

## Goals

-   **On-model identity** — In Explore, `canine-visible-ajou` shows 10-20 curated labels (Thai primary, Latin secondary) anchored to structures, visible by default; one toggle hides or restores all; selecting a structure — by tapping the mesh or the directory — shows and emphasizes its label while obeying the existing visibility, cut, isolation, and explode state (a label never floats over a hidden, clipped, or exploded-away structure).
-   **Label content is authored data, never baked into geometry** — No label text and no anchor point lives in a geometry file or the GLB. Anchors and drafted names are authored inputs; the regen scripts project them into a generated registry that `lint:atlas` pins. The registry ships inside the JS bundle — inside the PWA cache and the Android on-demand bundle — with no separate label fetch and no `public/atlas/` label file; model files keep their own on-demand path.
-   **Two-line naming, drafted once, reviewed by the owner** — Latin exists today on none of the visible-ajou parts, so the implementer drafts Latin for the chosen labels only, from NAV (Nomina Anatomica Veterinaria) and the free-license sources verified in the research file; Palm corrects and signs off the full label set per specimen before merge.
-   **Small screens stay readable** — Labels collapse to anchor dots below the measured stage-size threshold. Crowding at larger widths is accepted for v1 per owner decision 9 and revisited from feedback.
-   **Per-mode states are explicit** — Labels on in Explore, off in Compare, hidden in Recall, off when the scene is static/error. The toggle is session-only and renders disabled for unlabeled specimens and in Compare/Recall.
-   **Measured cost** — The label layer ships as a dynamic chunk with a dedicated budget row measured in the same PR (the atlas route's headroom is 2,799 B JS / 1,489 B CSS, so a new row is required).
-   **No regression surface** — the existing recall flow, part directory, inspector, export credit line, and `atlas-*` unit/e2e pins keep their behavior.

## Non-Goals

-   No quiz scoring, answer recording, or recall-flow changes — recall stays exactly what it is; labels hide inside it.
-   No baked label text in canvas PNG exports (`exportView` stays label-free with its existing credit line and disclaimer).
-   No labels on stark's 158 muscle paths — the app disclaims them as force lines, not anatomy; only its 24 bones remain pilot-eligible later.
-   No naming of the feline whole-models in v1 — that needs the anchor-picking workflow and is the designated next phase.
-   No shipping of third-party imagery; free-license sources serve label-name checking only.
-   No per-label overlap suppression, no hysteresis band, and no per-mesh (explode-following) anchoring in v1 — all three are named phase-2 upgrades with triggers in Future Improvements.
-   No new views, routes, or menu entries — the feature lives inside the existing atlas stage.

## Open Questions

-   **Density-rule threshold number**: the stage-size value where labels collapse to dots is measured on the real 320 px layout during implementation and pinned by test. The axis is decided (stage size only); only the number is open.

## Critical User Journeys (CUJs)

### CUJ 1: Study with labels (Explore · phone)

-   **Given**: a student on a ~390 px phone opens the atlas and selects `canine-visible-ajou` with the quick quality profile loaded
-   **When**: the model finishes loading in Explore
-   **Then**: labels appear anchored on the model (Thai + Latin); rotation, zoom, explode, and quality switching behave exactly as today, with labels fading out while the model is exploded; the atlas route's budgets hold with the new row

### CUJ 2: Self-test with the toggle (Explore)

-   **Given**: the student pressed the hide-labels toggle for self-testing
-   **When**: they tap a structure on the model
-   **Then**: that structure's label appears and is emphasized while the rest stay collapsed to dots; clearing the selection or changing specimen returns to the hidden state; the toggle restores all labels; labels render only for structures that `visibleIds` and the cut plane leave visible

### CUJ 3: Recall stays honest (Recall mode)

-   **Given**: the student entered "ทบทวนชื่อ" ("review names") with labels previously visible
-   **When**: the recall quiz presents a part
-   **Then**: labels are hidden regardless of the toggle's session state, and pick/quiz behavior is unchanged from today

### CUJ 4: Offline and in the Android app

-   **Given**: the Android app or an offline PWA with the specimen already cached
-   **When**: the student opens that specimen
-   **Then**: labels render from the bundle (the label chunk is included in the offline shell manifest like the renderer chunk); no separate label-data fetch exists, and no `public/atlas/` label file is requested

### CUJ 5: Owner sign-off loop

-   **Given**: the implementer drafted the label set (names + source-space anchors) from NAV and the verified open sources, and captured preview screenshots with the dev tool
-   **When**: Palm reviews the screenshots and the authored file
-   **Then**: corrections land in the authored input, `lint:atlas` and the atlas checks re-verify, and the release document records the per-specimen sign-off — which also discharges the specimen-level pending terminology review for the labeled parts

## Technical Plan (Architecture)

### Principles

1.  **Labels are authored data.** No label lives in geometry. Anchors and drafted names are authored inputs, projected into the generated registry by the same regen pipeline that already guards the atlas, so reconversion cannot silently make them stale.
2.  **Label content is authored data, never baked into geometry.** The rendered labels are DOM elements; the *content and positions* are data. This is why canvas-sprite rendering (Alternative D) and GLB-embedded anchors (Alternative G) are rejected.
3.  **Anchors ride the three-space pipeline; explode fades them for v1.** Three coordinate spaces exist (source → `sourceToDisplay` baked at conversion → runtime group transform with per-quality renormalization, `AtlasScene.jsx:508-511`). Anchors are authored in source space, projected to display space at regen time (display space is model space, not screen space — the group matrix still moves them to world/screen), and reach world space at runtime through the same group matrix the meshes use. Because the explode slider moves individual meshes (`placeParts`, `AtlasScene.jsx:197-202`), v1 fades labels out while `exploded > 0` instead of following per-mesh motion; per-mesh anchoring is the phase-2 upgrade (Future Improvements).
4.  **The layer is lazy and measured.** A dynamic chunk (component + its own CSS file) imported only via AtlasView, with a dedicated budget row measured in the same PR.

### Data model (authored input, per specimen)

```text
scripts/atlas-labels/<specimen-id>.json        # committed, hand-authored
{
  "specimen": "canine-visible-ajou",
  "labels": [
    {
      "partId": "heart",              # must match a part id of the specimen
      "source": [x, y, z],            # anchor point in SOURCE space
      "pickedAt": "2026-11-08",       # authoring provenance for review
      "pickedAgainst": "fa2b0cf1…",   # source GLB sha256 the point was picked on
      "latin": "Cor",                 # drafted; source data has latin:"" today
      "th": "หัวใจ"                    # optional override; defaults from part data
    }
  ]
}
```

The authored file is a **sibling input** to the ledger pipeline, not the ledger itself — anchors do not live in `public/atlas/*-provenance.json` because the converter rewrites those files on reconversion. The regen step and `lint:atlas --check` give the drift guarantee owner decision 7 asked for.

Regen (`scripts/regen-atlas-registry.mjs`, extended) reads this file, validates `partId` against the specimen's provenance part list, applies the recorded transform, and emits:

```text
src/data/atlas-labels.generated.js             # generated, lint-pinned
{
  "canine-visible-ajou": {
    "labels": [
      { "partId": "heart", "display": [x, y, z], "latin": "Cor" }
    ]
  }
}
```

Generated rows carry `partId`, `display`, `latin` — plus `th` only when the authored file overrode it. Thai otherwise resolves from part data at render time, which keeps one source of truth. The transform applied is the converter's exact composition, in order: **rotate by Euler XYZ degrees → compute bounds/center on the rotated geometry → translate by −center → scale by ×2/extent** (`center` in the provenance is in rotated space). Converter and regen share one transform implementation (an extracted module both import); the provenance records `rotationDegreesXYZ`, `center`, `scale`, so inverse transforms need no new data.

`lint:atlas` (`regen-atlas-registry.mjs --check`) pins both registries — the specimen/model registry and the new label registry — so drift between authored anchors, provenance, and generated output fails the same gate that already fails for model bytes. `--check` regenerates in memory and writes nothing on pass or drift.

### Rendering and interaction

```text
NAV (Nomina Anatomica Veterinaria) + verified open sources
        │  implementer drafts: names + source-space anchors
        ▼
scripts/atlas-labels/<id>.json ──► regen-atlas-registry.mjs (shared transform module)
        │                                 │ reads <id>-provenance.json
        │                                 ▼ rotate → −center → ×scale
        ▼
src/data/atlas-labels.generated.js ── lint:atlas --check pins drift
        │  (reachable ONLY through the dynamically imported label chunk)
        ▼
AtlasView (dynamic import on every specimen resolution)
        ▼
AtlasLabels.jsx (lazy chunk + its own CSS, imported by the chunk)
   • per-render callback from AtlasScene (fired at the end of render())
   • worldPos = groupMatrix × displayAnchor; hidden while exploded > 0
   • project → screen px; behind-camera/off-frustum/cut-plane → hidden
   • DOM: non-interactive labels (Thai + Latin) or dots per density rule
        ▼
selection (mesh tap or directory click) → label emphasized via existing select path
```

-   **Non-interactive overlay.** Labels and dots are `pointer-events: none` and `aria-hidden`; the overlay container is `pointer-events: none` so all stage gestures stay with AtlasScene's interaction panes. The part directory remains the accessible list of parts. No `revealedIds` state is added: **reveal is selection** — the currently selected part's label renders as emphasized text even while the toggle hides the rest. (`AtlasView` already uses `revealed` for the recall answer state; a second "reveal" concept would collide with it.) Selection changes and `clearView`/specimen changes are the only reveal transitions.
-   **Projection mechanics.** `AtlasScene` renders on demand (`requestRender` schedules one frame; frames repeat only while motion is active). The overlay subscribes to the **end of each render** rather than a second rAF loop, and its mount requests one render so first positions are not stale. With 10-20 anchors, per-frame projection is a few vector multiplies. v1 sets no frame-time target — the chunk-size budget row is the layer's performance gate — and per-frame positions are written directly to `style.transform` via refs; React state changes only for membership/presentation changes (toggle, density flip, selection).
-   **State contract.** The overlay renders nothing until the model reports ready, hides on error/WebGL context loss/static mode (the scene unmounts in static mode), and unmounts cleanly. An anchor hides when it is behind the camera, outside the frustum, or on the far side of the cut plane (`clipping.distanceToPoint(anchorWorld) < 0`, mirroring the pick filter), and while `exploded > 0`.
-   **Density rule (pure function).** Inputs: stage size, label count. Output: `text` or `dots`. Below the measured stage-size threshold every label renders as a dot; crossing back restores text. The threshold changes only on discrete layout changes (resize/orientation), so no hysteresis band is needed in v1; per-label overlap suppression is deferred (owner decision 9).
-   **Per-mode states.** Session state lives in `AtlasView` (a preference, not view state): `labelsVisible` defaults on, is not persisted, and survives `clearView`/specimen changes for the session. `atlas-workspace.js` — a pure-function module — gains only the selector: Explore → `labelsVisible` AND density rule; Compare → off; Recall → off; static/error → off; exploded → faded. The toggle button joins the existing visibility-details row, renders disabled in Compare/Recall and for unlabeled specimens (owner decision 12).
-   **Selected-tag yield.** When the selected part has a visible anchored label, the static `.vmx-atlas-selected-tag` hides (or reduces to counts) so one structure never shows in two floating boxes. This is rollback-safe: it keys on a label that cannot exist without the registry.

### Latin visibility across surfaces (owner decision 11)

v1 keeps drafted Latin in the label layer only. The inspector's Latin line and the directory search keep today's behavior (both read `part.latin`, which is empty for visible-ajou), so the two surfaces will disagree about Latin for labeled parts — an accepted v1 inconsistency with a named phase-2 home (merge at part assembly in `atlas-catalog.js`, which would also give the directory Latin search for free, at the cost of moving the atlas budget row once). The regen scripts never write Latin back into `src/data/atlas-visible-dog.js`.

### Performance and budget

-   The label component, its helpers, and `src/styles-atlas-labels.css` form one dynamic chunk imported by `AtlasView` when a specimen resolves. The chunk statically imports the generated registry, and **nothing in the statically-imported atlas graph may import the registry** — AtlasView learns "labeled or not" from the loaded chunk (the chunk no-ops on an empty registry). No label-related bytes appear in the `atlas.html` first-load graph; the `perf-budget` test and the e2e pin fail the build if any do. Vite's modulepreload list is trimmed by adding `/AtlasLabels/` to `SKIP_PRELOAD_PATTERNS` in `vite.config.js`, so unlabeled visits fetch no label bytes.
-   `perf-budgets.json` gains one row: `"atlasLabels": { "label": "Atlas label layer, added to an atlas visit when a labeled specimen renders", "entries": ["AtlasLabels"], "after": "atlas", "js": {…}, "css": {…} }` — `after: "atlas"`, unlike the other lazy rows' `after: "firstLoad"`, because the chunk loads inside an atlas visit and its measured number must be what the layer *adds to an atlas visit*. `npm run perf:budget --write` (the only sanctioned writer; sizes are machine-independent) fills measured + budget (measured + 3%) in the same PR; the diff must touch only the new row. The existing `atlas` row stays byte-identical.

## Alternatives Considered

### Alternative A: `feline-skeleton-westerly` as the pilot specimen

-   **Pros**: newest specimen (5.165.0), visually striking.
-   **Cons**: `kind:'whole'` — the catalog synthesizes one part id for the whole mesh; no per-structure segments, names, or NAV references exist for it. Labels would require inventing structure names *and* anchors with no verification rails, and every later fix would be manual.
-   **Reason for Rejection**: Rejected by author: labels need named segments to anchor to. The feline pair becomes the designated **phase-2** target once an anchor-picking workflow exists.

### Alternative B: `canine-musculoskeletal-stark` as the pilot specimen

-   **Pros**: 24 named bone segments with existing part data.
-   **Cons**: its 158 muscle paths are force lines, not anatomical surfaces — the app's own copy disclaims them (`AtlasView.jsx:446`, `ATTRIBUTION.md:103-104`); labeling them would teach something the specimen itself disclaims. Geometry and terminology reviews are still pending in the catalog.
-   **Reason for Rejection**: Rejected by author: only its bones are label-eligible, which undercuts the pilot's purpose and ships on an unreviewed specimen. Eligible for a later batch.

### Alternative C: `canine-skull-base-cuhl9` as the pilot specimen

-   **Pros**: the only specimen whose parts already carry verified Latin names and NAV pages — zero drafting for the Latin goal.
-   **Cons**: 7 parts total, below the owner-agreed 10-20 label count; a skull base is a narrow first demo of an on-model label system.
-   **Reason for Rejection**: Rejected by author: kept as the fallback if Latin drafting stalls, but label count rules it out as the primary pilot.

### Alternative D: Labels baked as sprites inside the WebGL canvas

-   **Pros**: occlusion could be computed against depth; pixel-perfect integration with the scene.
-   **Cons**: text rendering in-canvas couples label styling, theming, and accessibility to the renderer, costs per-frame sprite upkeep, and tangles with the export path (baked text would change what `exportView` produces, which owner decision 6 keeps label-free).
-   **Reason for Rejection**: Rejected by author: a DOM overlay achieves the v1 goals while keeping the renderer, export, theming, and accessibility independent.

### Alternative E: Standalone label JSON per specimen in `public/atlas/<id>-labels.json`

-   **Pros**: data next to the model files; trivially editable.
-   **Cons**: the offline shell's asset regex (`atlas-offline.js:20-21`) would exclude it — offline students get models without labels; a brand-new file class also needs its own lint and cache rules.
-   **Reason for Rejection**: Rejected by author: the regen route reuses existing gates (`lint:atlas`) and is offline-safe with no new file class.

### Alternative F: No new layer — extend only the part directory and inspector (or add a directory nudge)

-   **Pros**: smallest possible change; a one-line nudge toward the directory costs almost nothing.
-   **Cons**: it answers "what is this pick called" but never "what am I looking at" — spatial learning, the gap the feature exists to close, needs position on the model.
-   **Reason for Rejection**: Rejected by author: insufficient for the learning goal; the nudge was considered and declined. The directory stays as the fallback UX alongside labels.

### Alternative G: Embed anchors as GLB extras at conversion time

-   **Pros**: anchors travel with the model bytes; nothing else to load.
-   **Cons**: makes label content part of geometry (violating the data principle), complicates the converter, and pins label text edits to GLB rebuilds.
-   **Reason for Rejection**: Rejected by author for v1; noted as a possible phase-2 optimization if the registry route shows a real cost.

### Alternative H: Remember the toggle across sessions (localStorage)

-   **Pros**: returns students to their last state.
-   **Cons**: adds a persisted preference for a one-button state, plus a storage-read on the atlas path the app currently does not need.
-   **Reason for Rejection**: Rejected by author: session-only per owner decision 10; revisit if students ask for memory.

--------------------------------------------------------------------------------

## Non-Functional Requirements

| Risk | Mitigation (owned by) |
|---|---|
| Anchor drift after reconversion | Shared transform module + `lint:atlas --check` on both registries + round-trip/containment unit tests |
| Answer leakage into Recall | Mode rule in the selector + e2e CUJ 3 |
| Label bytes leaking into atlas first load | Chunk-loading contract (registry reachable only via the chunk), `SKIP_PRELOAD_PATTERNS` line, manifest unit check, e2e pin regex extended |
| Explode detaching labels | Fade-while-exploded selector clause + e2e clause |
| Unreadable labels on small screens | Stage-size density rule + 320 px e2e assertion |
| Budget breach | Dedicated `atlasLabels` row (`after: "atlas"`) enforced by `perf-budget.test.mjs`; `atlas` row byte-identical |
| Offline students missing labels | `prerender-atlas.mjs` includes the label chunk in the offline shell manifest |
| Feature cannot be rolled back | Registry-absent contract: every label-consuming surface treats an absent or empty generated registry as "render exactly as today"; nothing outside the chunk branches on label data except through that contract |

Security/privacy: no user data, no network calls, no new origins. Rollout: additive behind data presence — a specimen without an authored label file renders exactly as today; removing the authored input (and regen output) reverts the feature with no code deletion.

## Additional Resources

*   Ideation brief and owner decisions: `work/atlas-labels-2026-11-07/concepts_brief.md` (gitignored on fresh clones — the decisions are inlined above)
*   Review evidence (gitignored on fresh clones): `work/atlas-labels-2026-11-07/goldfish-report.md`, `zoom_out_report.md`, `comprehension_report.md`, `critic_report.md`, `intermediate_zoom_out_report.md`, `consolidated_review_report.md`
*   Free-license anatomy source research (license pages verified 2026-11-07): `work/atlas-labels-2026-11-07/research-free-sources.md`
*   Repo knowledge base: [docs/PROJECT_KNOWLEDGE_BASE.md](../PROJECT_KNOWLEDGE_BASE.md)

## Future Improvements

*   **Per-mesh anchoring (explode-following)**: bake anchors into part-local frames and resolve via `mesh.matrixWorld`; kept cheap because the loader enforces one uniquely-named mesh per part id. Trigger: real-use feedback that labels during explode matter.
*   **Per-label overlap suppression + hysteresis**: the light occlusion pass. Trigger: feedback of crowding at ordinary zoom on large screens.
*   **Latin merge at part assembly**: registry Latin visible to inspector and directory search (owner decision 11's phase-2 home); costs one atlas budget-row move.
*   **Phase-2 feline labeling**: an anchor-picking workflow for whole-model specimens, reusing this pipeline.
*   **Public-domain plate shelf**: verified PD (public-domain) ~1900 atlas scans as a separate 2D reference surface.
*   **Baked export labels**: labeled PNG exports if students ask.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

Implementation order: the dev tool first (so drafting and sign-off have a surface), then the data pipeline (content review can start before UI exists), pure helpers, UI, measurement, journeys last.

### Target Files to Create/Modify

#### 1. `scripts/atlas-labels/capture.mjs` + a dev-only preview guard in AtlasView (Create)

*   **Type / Scope**: dev-only authoring and sign-off tooling; never ships (guard is `import.meta.env.DEV` + `?labels=dev`)
*   **Proposed Changes**: one surface serving drafting and sign-off: loads the scene with the current authored label set rendered, lets the author click structures to dump source-space points (inverse of the recorded transform), and saves screenshots at 360/900/1400 px per revision into `work/atlas-labels-2026-11-07/`. The release doc links the screenshots as the sign-off record.

#### 2. `scripts/atlas-labels/canine-visible-ajou.json` (Create)

*   **Type / Scope**: authored data (committed, hand-edited input to regen)
*   **Proposed Changes**: the pilot label set — 10-20 entries chosen from the 29 eligible parts of 32 (the three composite surfaces `skin`/`muscle`/`bones` are excluded per owner decision 1's guardrail). Each entry: `partId` (validated against the specimen's provenance part list), `source` point in source space, `pickedAt` + `pickedAgainst` provenance, drafted `latin`, optional `th` override. Latin is drafted from NAV and the verified open sources, then corrected by Palm in the sign-off pass.

#### 3. `src/data/atlas-labels.generated.js` (Create, generated — never hand-edited)

*   **Type / Scope**: generated data module, reachable only via the dynamic label chunk
*   **Proposed Changes**: per-specimen label entries (`partId`, display-space anchor, `latin`, `th` only when overridden). Presence in this file is what makes a specimen "labeled" (no catalog flag). Thai otherwise resolves from part data at render time.

#### 4. `scripts/regen-atlas-registry.mjs` (Modify)

*   **Type / Scope**: generator + lint gate (`lint:atlas` runs it with `--check`)
*   **Proposed Changes**: read `scripts/atlas-labels/*.json`; validate partIds against the specimen's provenance part list (keeps the script reading only `public/atlas`); transform source anchors with the shared transform module (rotate → −center → ×scale, per the pinned order); emit the label registry via an exported pure function `buildLabelRegistry(provenance, authored)` that both the CLI and the unit tests call — the writing path never runs under `node --test`. `--check` regenerates in memory and writes nothing on pass or drift; register the second output in `tests/unit/generated-check-line-endings.test.mjs`'s GENERATORS list.

#### 5. `scripts/lib/atlas-label-transform.mjs` (Create)

*   **Type / Scope**: shared transform module
*   **Proposed Changes**: the one implementation of the source→display composition (and its inverse) imported by both `convert-atlas-specimen.mjs` and `regen-atlas-registry.mjs`, so the transform whose drift the design prevents cannot fork.

#### 6. `src/lib/atlas-labels.js` (Create)

*   **Type / Scope**: pure helpers (no three.js import — node --testable)
*   **Proposed Changes**: (a) density rule — stage size + label count → `text | dots`, threshold pinned by test; (b) per-mode effective visibility — Explore → session toggle AND density; Compare → off; Recall → off; static/error → off; exploded → faded; (c) anchor filtering — drop labels behind the camera, off-frustum, or on the far side of the cut plane (`clipping.distanceToPoint(anchorWorld) < 0`), and while exploded; (d) projection math (world → NDC → CSS px) as a pure function.

#### 7. `src/components/AtlasLabels.jsx` (Create)

*   **Type / Scope**: React component, loaded as a dynamic chunk; statically imports the generated registry and `../styles-atlas-labels.css` (AtlasView must not import the CSS)
*   **Proposed Changes**: renders the DOM label layer: non-interactive labels (`aria-hidden`, `pointer-events: none` container) — Thai + Latin two-line, Latin row in `--text-xs` per the existing Latin-only micro-label convention — or anchor dots below the threshold. Subscribes to AtlasScene's per-render callback; writes positions to `style.transform` via refs; React state only for membership/presentation changes; mount requests one render; renders nothing until the model is ready and hides on error/context-loss/static mode. No animation; reduced-motion needs no exception.

#### 8. `src/styles-atlas-labels.css` (Create)

*   **Type / Scope**: chunk-scoped stylesheet
*   **Proposed Changes**: label/dot visuals from `--clr` and text-size tokens only. **No registration** in `lint:css-tokens`' `STYLESHEETS` list — that list is for token *definitions*, and registered files are exempt from the usage scan; this file is a consumer and is usage-scanned automatically. Do not add it to the list.

#### 9. `src/components/AtlasScene.jsx` (Modify)

*   **Type / Scope**: three.js stage component
*   **Proposed Changes**: fire the per-render callback at the end of the existing `render()` (no second clock), exposing camera state and the specimen group matrix; record the anchor-space contract in a comment at the subscription API. Picking, export, and loading paths untouched. The change must keep the source-cutting harness `tests/unit/atlas-scene-compare.test.mjs` passing; extend its fakes if the callback needs new browser APIs.

#### 10. `src/lib/atlas-workspace.js` (Modify)

*   **Type / Scope**: pure-function module
*   **Proposed Changes**: gains only the effective-visibility selector (mode rule AND density AND explode/static/error). No state lives here — session state stays in AtlasView.

#### 11. `src/views/AtlasView.jsx` (Modify)

*   **Type / Scope**: atlas page view
*   **Proposed Changes**: dynamic `import()` of `AtlasLabels` on every specimen resolution (the chunk no-ops on an empty registry; the toggle's disabled state derives from the loaded chunk, keeping the atlas row byte-identical); session `labelsVisible` state lives here, defaults on, survives `clearView`/specimen change; the toggle joins the existing visibility-details row, disabled in Compare/Recall and for unlabeled specimens; the overlay mounts inside the stage container above the canvas, below dialogs; the selected tag yields when the selected part has a visible anchored label; the dev-only preview guard lives here behind `import.meta.env.DEV && ?labels=dev`.

#### 12. `vite.config.js` (Modify)

*   **Type / Scope**: build configuration
*   **Proposed Changes**: add `/AtlasLabels/` to `SKIP_PRELOAD_PATTERNS` so the chunk never joins `atlas.html`'s modulepreload list — otherwise every visit fetches label bytes the budget system cannot see.

#### 13. `scripts/prerender-atlas.mjs` (Modify)

*   **Type / Scope**: offline shell manifest generator (runs in build)
*   **Proposed Changes**: add `includeEntry('src/components/AtlasLabels.jsx')` beside the existing AtlasScene line so the offline shell carries the label chunk (the `atlas-offline.js` regex already allows `/assets/*.js|css`; no regex change needed). Harmless when the registry is empty.

#### 14. `perf-budgets.json` (Modify)

*   **Type / Scope**: CI budget config
*   **Proposed Changes**: one new row — `"atlasLabels": { "label": "Atlas label layer, added to an atlas visit when a labeled specimen renders", "entries": ["AtlasLabels"], "after": "atlas", "js": {…}, "css": {…} }` — filled by `npm run perf:budget --write` in the same PR; the diff touches only this row. The existing `atlas` row stays byte-identical.

#### 15. `tests/unit/atlas-labels.test.mjs` (Create)

*   **Type / Scope**: node --test unit suite
*   **Proposed Changes**: density-rule boundaries (stage size); selector truth table (modes, explode fade, static/error); anchor filter incl. the cut-plane formula; projection math on synthetic matrices; generated-registry shape (partId resolves, `latin` non-empty — guards against any chosen label shipping with an empty `latin` field); idempotent regen via the exported `buildLabelRegistry` (output equals the committed file's bytes; the writing path never runs); anchor containment (inverse-transformed anchor inside the part's source bounds, reusing the shared transform); and a manifest check that the built atlas entry graph carries no AtlasLabels entry/preload.

#### 16. `tests/e2e/atlas-labels.spec.js` (Create)

*   **Type / Scope**: Playwright e2e (Chromium desktop + mobile, WebKit, Firefox per CI matrix)
*   **Proposed Changes**: re-create or extract the file-local `openAtlas`/`ready` helpers from `tests/e2e/atlas.spec.js` and wait on `data-atlas-state="ready"`. Cases: CUJ 1 (labels appear on specimen load; explode slider moves labels out of view); CUJ 2 (toggle hides to dots; mesh tap reveals + emphasizes one; hidden structures never render labels); CUJ 3 (labels absent in Recall regardless of toggle); CUJ 4 (no request matches `/AtlasLabels|atlas-labels/` on the atlas route; the offline-shell manifest includes the chunk); static-mode flip hides labels; 320 px — dots render and no text labels do; the existing renderer-isolation pin's regex extended with `AtlasLabels|atlas-labels`.

#### 17. `docs/releases/<next-version>.md` (Create, at ship time)

*   **Type / Scope**: release proof document per repo convention
*   **Proposed Changes**: headline (user-observable: labels on the atlas), the pilot's per-specimen sign-off record (screenshots + corrections + approval; discharges the specimen-level pending terminology review for the labeled parts), checks section (unit/build/budgets/CI receipts).

#### 18. `src/data/changelog/<next-version>.js` (Create, at ship time)

*   **Type / Scope**: release changelog via `npm run release:new`
*   **Proposed Changes**: one user-observable entry (labels on the atlas), voice and length per the repo's changelog rules; no mechanism talk.

### Explicit non-changes (guard against scope creep)

-   `src/data/atlas-catalog.js` — untouched (owner decision 11 horn (i): Latin stays label-only in v1; part assembly is the phase-2 merge point).
-   `src/data/atlas-visible-dog.js` — never written by regen (hand-authored data stays hand-authored).
-   `public/atlas/ATTRIBUTION.md`, license fields — labels add no new licensed assets.
-   `package.json` dependencies — none added.
-   Recall quiz logic, part directory, inspector — behavior unchanged (labels hide inside Recall; Latin divergence accepted for v1 per owner decision 11).
-   Export path `exportView` — unchanged (label-free PNG per owner decision 6).

### Verification Plan

-   **Build**: `npm run build` (includes `prerender-atlas.mjs` and produces the manifest `perf:budget` measures from).
-   **Budgets**: `npm run perf:budget --write`; check the diff touches only the new `atlasLabels` row and confirm via `npm run perf:budget` that the `atlas` row (perf-budgets.json) is unchanged. Sizes are machine-independent — no battery caveat applies to this step. `tests/unit/perf-budget.test.mjs` enforces every row automatically.
-   **Unit**: `npm run test:unit` — the new `atlas-labels.test.mjs` plus the existing `atlas-*` suites (the test runner picks up new files automatically).
-   **Lint/gates**: the full lint sweep (`npm run lint:all`) before PR, which includes `lint:atlas` (now pinning labels too) and `lint:css-tokens`; CI is the release gate — local runs only to debug CI failures.
-   **E2E**: the new `atlas-labels.spec.js` in the standard CI matrix (Chromium desktop/mobile, WebKit thirds, Firefox halves) plus the existing atlas suite untouched.
-   **Manual/content**: Palm's per-specimen sign-off on the pilot label set using the dev tool's screenshots, recorded in the release doc — no merge of pilot content without it.

--------------------------------------------------------------------------------

<!-- Provenance: Indicates initial structural drafting via EGM. -->

*Drafted with EGM*
