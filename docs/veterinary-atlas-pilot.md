# Veterinary Atlas: local pilot and expansion requirements

Status: v5.80.0 preview candidate, 6 September 2026. Not released to production.
Route: `/app/atlas`. Source branch: `codex/veterinary-atlas-pilot`.

## Current implementation

The collection now contains three real source-linked specimens in two species:
the University of Edinburgh equine skull, NIH 3D canine skull 3DPX-000282,
and the seven-surface Cornell CUHL 9 skull-base set. Missing downloads do not
appear as selectable specimens. The Edinburgh domestic cat source has been
identified and licensed, but its file has not yet been received locally.

- One WebGL context renders two independent comparison panes with synchronised
  cameras. Model size is normalised for shape comparison, not physical scale.
  The equine source axes use XYZ rotation `-90,0,-90` degrees, recorded in its
  ledger. Visual comparison confirmed that both skulls face the same direction
  with their dorsal surfaces up; matching only the long axis was insufficient.
- Each specimen has quick/detail geometry and a poster rendered from the actual
  mesh. Whole specimens remain whole; no individual bone names are inferred
  from an unsegmented mesh. The CUHL 9 set retains its published part identities.
- SHA-256 verification protects downloads and cached bytes. A bounded 32 MB
  public-model cache supports repeat access without mixing with personal study
  data. A failed comparison pane leaves the first pane usable. Cache writes do
  not delay the first render. Offline readiness requires both stored geometry
  and a complete, verified app shell; an interrupted update keeps the last
  complete shell available.
- PNG export includes creator, source URL and license. Static mode, readable
  fallbacks, 44px controls, keyboard camera controls, full-screen support,
  phone/tablet layouts and theme persistence accompany the 3D interface.
- `/app/atlas` uses a dedicated lightweight entry on direct navigation, reusing
  the same AtlasView as the main app. Exam/account/Home dependencies stay out of
  that entry. Existing DOM-translation and PWA lifecycle protections are shared
  by both entries; blocked sessionStorage cannot cause an automatic reload loop.
- `/atlas/` is a generated, JavaScript-independent discovery page with source
  links and truthful coverage; the build adds it to the shipped sitemap. The
  PWA manifest also includes an Atlas shortcut.

Canonical sources: `src/data/atlas-catalog.js` plus per-specimen conversion
ledgers in `public/atlas/`. `scripts/regen-atlas-registry.mjs` generates
`src/data/atlas-assets.generated.js`. New source geometry is processed with
`scripts/convert-atlas-specimen.mjs`; published original bytes and normalized
display transforms remain traceable in the ledger.

Rebuild the equine display with the recorded orientation:

    node scripts/convert-atlas-specimen.mjs equine-skull-edinburgh <Horse-Skull.stl> -90,0,-90
    npm run regen:atlas

## Measured startup comparison

Three cold runs before and after the dedicated entry, using the same local
production preview, a 390×844 viewport, 4× CPU throttling, 120 ms latency and
200,000 bytes/second downstream:

| Measurement | Main-app entry | Dedicated Atlas entry |
|---|---:|---:|
| Median time until the 3D viewer was ready | 9,100 ms | 5,699 ms |
| Decoded JavaScript loaded | 2,318,051 bytes | 846,676 bytes |

This measured about 37% less startup time and 63.5% less JavaScript. It is a
local simulation, not a physical-phone, battery, production-CDN or competitor
benchmark. The exact trial records remain in local `scratch/atlas-v2/`.
The quick equine model is about 147 KB and the quick NIH canine model 312 KB;
detail levels are optional. Quick/detail are different geometry levels and are
not presented as lossless reductions.

The intended product is a multi-species atlas inside VetMock, with reliable
anatomy, clear visibility, fast interaction, and connections to studying.
The current candidate demonstrates the viewer and evidence workflow across
three specimens in two species. It does not provide full-body or independently
textbook-reviewed coverage.

## Current candidate verification (6 September 2026)

- `npm run test:unit`: 714 passed, no skips.
- `npm run build` and `npm run lint:all`: passed, including Atlas registry,
  existing content gates, Wiki prerender and the static Atlas page. The existing
  contrast audit excludes gradient-backed elements; it is not a comprehensive
  visual certification.
- Atlas plus existing study smoke: 107 distinct browser cases passed across
  Chromium desktop/mobile, WebKit mobile and Firefox desktop. The full run was
  interrupted after case 97; its remaining Firefox smoke cases were rerun in a
  completed single-worker run (12 passed, with one overlapping case).
- One deliberate WebKit offline-emulator case is skipped because this runtime
  rejects even a minimal service-worker navigation when `setOffline` is used.
  The separate real origin-connection-loss test passes on all four profiles,
  including WebKit, from the very first visit without a preparatory reload.
- Browser checks include both panes changing with a camera gesture, quality
  switching, 320px/tablet/landscape layouts, real PNG export, corrupt-cache
  recovery, partial comparison failure, idle rendering and canvas disposal.
- After correcting the equine orientation, the library/entry/offline suites
  were rerun (39 passed, the same one WebKit emulator skip). The 320px species
  selector also now wraps before its text is clipped; its visible text width
  and comparison layout passed a further check on all four browser profiles.
- The generated offline shell contains 19 files (about 1.37 MB), including local
  fonts and specimen posters. Its static dependency graph excludes the exam,
  account, Home and unrelated video-content bundles.
- No physical-device frame-rate/battery study, external anatomy review,
  exact-commit hosted CI or production deployment is claimed. Hosted preview
  checks supplement these local gates; production remains unchanged.

## First pilot checkpoint

- Seven published skull-base surfaces from one juvenile mixed-breed dog,
  specimen CUHL 9: basisphenoid, presphenoid, vomer, and paired palatine and
  pterygoid bones. These are five bone types, not seven species or systems.
- Orbit, zoom, selection by tapping or an accessible list, isolate, hide/show,
  exploded view, fit-to-view, left/right counterpart selection, and optional
  display colours. Exploded offsets and colours are illustrative.
- Thai/English/Latin search, per-part source links and NAV page locators,
  shareable part links, and name-recall practice without persisting study data.
- A dedicated viewing workspace with a clear return action. The canonical
  feature registry supplies the Home menu, sidebar and command palette.
- A self-hosted binary glTF asset. The renderer and geometry load only when
  the atlas is opened; no third-party viewer is embedded. Failed downloads,
  timeouts, unsupported WebGL and lost contexts have a readable retry state.
  Text and references remain available without the model.
- Rendering is requested on changes, resize and visibility restoration. It
  does not use an unconditional animation loop. Disposal aborts fetches and
  releases controls, observers, geometry, materials and the renderer.

## Evidence and content boundaries

**Geometry:** Hooker et al. (2025), *3D Printing an Explodable Dog Skull for
Veterinary Education*, [article](https://doi.org/10.18563/journal.m3.276),
[M3#1859 data](https://www.morphomuseum.com/specimenfiles/view/1859).
Physical collection: Cornell University veterinary teaching collection.
The archive contains seven PLYs, despite the article's broader discussion of
six constituent bone types. Ethmoid is absent from this archive and is not
invented. The separate M3#1858 printing assembly is not imported.

The surfaces come from an educational printing project. Do not assume that
every surface feature is pristine native anatomy simply because its file is
named after a bone. Expert inspection of source and simplified surfaces is a
release requirement; no diagnostic, surgical, measurement or anatomical
accuracy certification is implied by the source publication or build checks.

**Terminology:** [WAVA NAV, 6th edition (2017)](https://wava-amav.org/wava-documents.html),
Osteologia pp. 12, 13, 15 and 16 (PDF pp. 30, 31, 33 and 34). Names and printed
page numbers were checked in the official PDF. Thai labels are reading aids
pending expert review. Left/right identity follows the source filenames.

**Textbooks:** Miller and Evans' Anatomy of the Dog, 5th edition, and Dyce,
Sack, and Wensing's Textbook of Veterinary Anatomy, 5th edition, appear as
further reading only. Their publisher descriptions are not a substitute for
reviewing actual chapters and figures. Do not label the model textbook-verified
until that comparison is completed and recorded. No textbook figures were copied.

**Rights:** M3 data use [CC BY-NC 4.0](https://morphomuseum.com/faq). Keep this
pilot noncommercial and preserve attribution. Commercial deployment or reuse
needs appropriate rights. Other candidates require separate review: the
Sheridan site displays NC/ND restrictions; Z-Anatomy's pig bundle lists
BY-SA plus an NC-SA upstream model. A repository's application license does
not establish rights to all its anatomy assets.

## Rebuild and verification

Download and extract M3#1859 from its official link, then run:

    node scripts/prepare-atlas-model.mjs "<directory containing the original PLYs>"

The converter uses the pinned meshoptimizer version with `LockBorder` and a
0.001 relative error limit, retains source coordinates and named meshes, and
writes a content-hashed GLB plus `public/atlas/model-provenance.json`. The current
asset is 2,744,668 bytes, 2,029,915 bytes with gzip. Browser transfer encoding
depends on the host. This partial skull cannot be fairly benchmarked against
Human Atlas's entire 33 MB body as a claim of equivalent-coverage superiority.

The manifest carries original PLY SHA-256 hashes, output hash, vertex/triangle
counts, bounds and simplifier errors. Numerical simplification error is a
geometry processing metric, not clinical accuracy. After rebuilding, update
the model URL/size in `src/data/atlas.js` and rerun the asset contract test.

Local checks cover exact asset/label correspondence, finite vertices, triangle
indices, three-language search, hash validation, visibility and tap-vs-drag.
Browser checks cover real geometry loading, direct links, isolation, recall,
320px layouts, unavailable WebGL, network failure/retry, and keeping the 3D
payload out of ordinary routes. Re-run against the final production build.

## Further content expansion

1. Establish licensed, anatomically reviewed canine geometry with a documented
   scope, age/breed/sex where known, mesh-to-concept mapping, and explicit gaps.
   Add feline and equine models only when equivalent evidence is available;
   then bovine, porcine and other requested species. Never reshape a human
   model into an animal or substitute one species while changing its label.
2. For each structure, record the actual textbook edition/chapter/page or figure,
   source location, named reviewer, review date, and whether labels, geometry
   and descriptions have each been checked. Unreviewed fields stay unapproved.
3. Add species comparison through reviewed homologous concepts. Camera
   synchronization requires curated orientations; similar file names are
   insufficient. Add hide-label identification tasks before connecting verified
   concepts to existing questions, notes and SM-2; avoid parallel study stores.
4. Add deeper layers, section views and imaging correlations only when the
   corresponding source assets exist. Advanced clinical workstation functions
   remain in Imaging Pro, per the project boundary.
5. Measure comparable cold/warm journeys on representative mobile hardware:
   usable preview time, total bytes, interaction latency, frame stability,
   memory, battery/idle work and failure recovery. Budget by species/system,
   preserve small details during LOD generation, and load additional geometry
   on demand. Code inspection alone cannot certify faster real-device behavior.
6. Include keyboard navigation, contrast, colour-independent selection cues,
   restrained motion and 320px layouts. Add truthful indexable species pages
   only for released content; use stable URLs, explicit coverage and source
   citations instead of indexing placeholders.

Before release: complete the content/rights review above, bump the product
version and service worker, add learner-visible changelog copy, and complete
the repository's exact-SHA CI, production deployment and live-flow checks.

## Original single-specimen checkpoint (superseded by the candidate above)

- `npm run test:unit`: 704 passed, no skips.
- `npm run build`: passed, including the existing Wiki prerender.
- `npm run lint:all`: passed. The existing landing contrast tool explicitly
  excludes gradient-backed elements; that result is not a full-page contrast
  certification. Atlas was also visually inspected in light and dark themes.
- Atlas plus existing smoke E2E against the production preview: 68 passed
  across Chromium desktop/mobile, WebKit mobile and Firefox desktop, no skips.
- `npm audit --audit-level=high`: zero vulnerabilities reported.
- Manual browser checks: visible 3D geometry, selection by tapping the actual
  rendered model, source details, 320px light/dark layouts and return navigation.
- Ordinary-route request checks confirm no atlas renderer/model download.
- No physical-device frame-rate/battery study, external anatomy review,
  exact-commit CI or production deployment was performed for this pilot.

These results describe the original single-specimen pilot, before the current
multi-specimen, dedicated-entry and first-visit offline work.
