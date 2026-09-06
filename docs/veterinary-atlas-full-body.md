# Veterinary Atlas: full-body expansion

Status: release candidate, 6 September 2026. The Visible dog specimen
includes 32 original PRC surfaces across 12 source systems, including skin,
muscle, bones and viscera in one shared frame. Muscle and Bones remain composite
surfaces, not individually named muscles or bones. The six Atlas
specimens remain separate, including the Stark skeletal/path model and the
Pixelbeaker CT organ specimen. No complete anatomical certification is claimed.

## Intended outcome

One canine body in a consistent anatomical coordinate system, with separately
selectable published structures. The intended layers are skin, skeleton,
muscles and internal organs. Each available system can be shown, hidden or
isolated; parts can be separated and restored. Keyboard, mobile and static
fallbacks remain available. Coverage is recorded per structure, not inferred
from the appearance of a full-body silhouette.

Every imported structure requires a source mesh, original name, species,
coordinate transform, license, hash, anatomical identity and review status.
Textbook chapter/page locators must be checked against the actual source text.
Source-linked and independently reviewed are different statuses. Missing
structures do not receive substitute geometry or selectable placeholders.

## Source inspection

### FSU Jena / Heiko Stark: DogModel

- Project: https://simtk.org/projects/dogmodel
- Downloads: https://simtk.org/frs/?group_id=2032
- Paper: https://doi.org/10.1038/s41598-021-90058-0
- Full simplified model: `Full linear.zip`, file 6458, published 20 October 2021,
  listed as 47 MB. The provider identifies it as a working German Shepherd
  model, distinct from the validated forelimb publication package.
- The download panel publishes the MIT Use Agreement, copyright 2021 FSU Jena,
  Heiko Stark. Retain the actual notice with imported derivatives. The internal
  archive still needs inspection for any separate geometry notices.
- Acquired `Full linear.zip`: 49,391,860 bytes, ZIP CRC passed, SHA-256
  `20836f8cbda9f9f8f55a05f1ef9a9fe653ee971e34a7cf8a261beb70bbe96d20`.
  Its archive contains OBJ geometry and OpenSim/JNT/MSL data plus a screenshot.
  The importer never executes archive files.
- Intended assessment: inspect OpenSim body frames and geometry names; resolve
  the transform graph and preserve published segment groupings. Muscle paths
  must remain explicitly labelled as paths, never as volumetric muscle shapes.
  This package has 24 skeletal body segments and 158 muscle paths. Individual
  composite segments are preserved; this is not 182 separate bones or muscles.
  It contains no skin or internal organs.

### Dongguk University / Park and Jung: sectioned dog body

- Paper: https://doi.org/10.1002/ar.23200
- Published download site: http://anatomy.dongguk.ac.kr/dog
- Paper reports a whole-body dataset with 29 segmented structures, STL surface
  models and a 283 MB interactive PDF. Some structures are composite systems;
  this does not imply individually segmented bones throughout the body.
- Acquisition: the old HTTP and HTTPS hosts timed out, but the relocated Ajou
  site provided the files now used in the workstation pipeline below.
  Free access stated in an article is not a verified redistribution license.

### Other inspected candidates

- Pixelbeaker, `3D Canine Anatomy: Normal Abdomen`, Sketchfab UID
  `962de878d2e94b75b10075931f0edaa3`: original OBJ downloaded from the logged-in
  download panel; the public API and panel both publish CC BY 4.0. The original
  ZIP is 35,593,528 bytes. Its nested archive contains `Z01A.obj` and `Z01A.mtl`.
  The five source objects are bones, vascular, lungs, vascular_liver_pancreas
  and intestines. Exported mmGroup fragments are not anatomical labels; the
  importer retains the five composites. The unused skin material is not skin
  geometry. Source units, age, sex and breed are unspecified. No independent
  anatomical review is claimed. See the public source/provenance manifests.
  Reproduce with `node scripts/assemble-atlas-abdomen.mjs <extracted-directory>`,
  then `node scripts/convert-atlas-specimen.mjs canine-abdomen-pixelbeaker
  <extracted-directory>/assembled.glb 0,90,0 --named-parts` and `npm run regen:atlas`.
- The current Ajou Anatomy site, https://sites.google.com/ajou.ac.kr/anatomy,
  provides working Google Drive links for the dog 3D PDF and browsing software.
  Both were downloaded for local inspection. PDF v1.5 contains a PRC model and
  the 2014 paper; the browsing archive contains an installer with "29 structures"
  in its filename, which was not run. Its 711 sectioned images, 711 segmented
  images and 29-entry color table were extracted as data. No explicit permission for
  adapted public GLB redistribution was found in the inspected PDF or site.
  Original archives remain outside public assets. The selected display
  derivatives are included in the shared Atlas catalog. The source record retains
  the fact that the package does not specify a redistribution license; no CC
  license or independent anatomical certification has been invented.

- Vak.Expert dog, Sketchfab UID `7587ebe24ee2464f982154ed610f7e56`: full-body
  appearance with organs, but the current public model API says
  `isDownloadable: false` and supplies no license. Not imported.
- Sheridan canine skeleton: the published site states CC BY-NC-ND 4.0.
  Adaptation into our converted/segmented asset pipeline is not cleared.
- Z-Anatomy veterinary repository: currently publishes a pig package. Its
  attribution includes an upstream NC-SA model alongside BY-SA terms. It is
  not a canine substitute and needs asset-level review before reuse.

## Viewer work completed in this increment

The part directory groups available geometry using published `systemLabel`
metadata when present and existing source `group` labels otherwise. It supports
collapsing groups, mixed-visibility feedback, show/hide/isolate per group, and
showing all parts together. Search-scoped actions affect only the matching
parts; hidden structures outside the search do not accidentally reappear.
Showing one part while another is isolated preserves the actual visible set.

The local catalog now includes `canine-musculoskeletal-stark`, backed by real
geometry and source records. It has explicit controls for the two available
systems. Large directory groups start collapsed; searching reveals matches.

## Reproduce the imported model

After obtaining and safely extracting the licensed source archive, run:

    python scripts/prepare-atlas-dogmodel.py <extracted-directory> <original-archive.zip>
    node scripts/assemble-atlas-dogmodel.mjs <extracted-directory>
    node scripts/convert-atlas-specimen.mjs canine-musculoskeletal-stark <extracted-directory>/assembled.glb 0,0,0 --named-parts
    npm run regen:atlas

The Python adapter requires NumPy. It reads the source's default generalized
coordinates, resolves parent body transforms, and supports only the observed
CustomJoint + Constant/LinearFunction + fixed PathPoint subset. Unknown joint
orientations, reverse joints, constraints and moving points fail closed.
Rotation composition follows Simbody's FunctionBased implementation (R1 R2 R3),
with translations expressed in the fixed parent joint frame. Display axes map
source (x,y,z) to (y,z,x), a proper rotation rather than a mirror.

Published path points are rendered as 1.3 mm-radius tubes solely to make the
centerlines visible; their thickness does not represent tissue or force.
Simulation ground and non-muscle actuator objects are excluded. The MIT notice
is embedded in both GLB levels and shipped in `public/atlas/stark-LICENSE.txt`.
`public/atlas/canine-musculoskeletal-stark-source.json` records original OBJ
hashes, source default coordinates, body frames and the published path points.

Further work: obtain licensed volumetric anatomy for the missing systems, have
the source-derived labels and geometry independently reviewed, and measure
performance on representative physical devices. No clinical/anatomical
certification or competitor speed superiority is claimed.

## Visible dog conversion pipeline

The current task acquired both Ajou archives and extracted the NSIS data with
an existing 7-Zip installation without running the installer. All 711 segmented
BMPs have matching sectioned images. All 29 color-table entries occur in exact
RGB pixels; each BMP has its own palette and antialiased boundaries, so palette
indices are not stable segmentation IDs across slices.

The PDF has a 146,157,927-byte PRC stream. Local extraction with nanoprc-py 0.1.2
produced 32 meshes / 7,070,990 triangles. Matching the wheel's actual July 2026 C ABI
was necessary for the representation-item tree. The tree maps all 32 names
bijectively to tessellations. Product placements and representation local
coordinate indices are all identity/absent. No inferred registration is used.

Source and validation ledgers are under `scratch/atlas-full-body/ajou-prc-meshes`.
The original files remain intact. Display assembly removes 2,812 zero-area
triangles and preserves every other source triangle before display reduction.
Physical units are not confirmed; display rotation 0,90,180 makes the body
upright without reflection. `Sigmoid_colon` is a source term pending review.

After local extraction, reproduce the viewer assets:

    python scripts/assemble-atlas-prc.py
    node scripts/convert-atlas-specimen.mjs canine-visible-ajou scratch/atlas-full-body/ajou-prc-meshes/assembled.glb 0,90,180 --named-parts --output-dir=scratch/atlas-local
    node scripts/prepare-atlas-local-catalog.mjs
    npm run dev -- --host 127.0.0.1 --port 4183 --strictPort

The optional Vite plugin loads only `scratch/atlas-local/catalog.json` for a dev
server and serves only its declared GLB/WebP/JSON basenames. Restart the dev
server after regenerating the local catalog. Production builds and production
previews never automatically load this workstation catalog. The release uses
an explicit shared definition in `src/data/atlas-visible-dog.js` and only the
selected content-hashed display profiles, poster and provenance in `public/atlas`.
Original PDF/PRC/NPZ/sectioned images remain outside public/ and dist/. The model opens at
`/app/atlas#specimen=canine-visible-ajou&part=skin` on that dev server.

For models with more than four source systems, the layer controls can be
expanded from one compact button. Existing specimens retain their direct
controls. This keeps the canvas reachable on narrow screens.
