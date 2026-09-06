# VetMock Atlas: sources and model rights

Rights apply per specimen. A repository, viewer or hosting service does not
replace the rights of the original model creators. Credits are also shown in
the viewer and in exported study images.

## Equine skull, University of Edinburgh

Applies to `equine-skull-edinburgh-*` geometry and poster files.

Original CT information: Dr. Tobias Schwarz. Adapted and prepared by Brian
Mather / The University of Edinburgh Open.Ed, The Royal (Dick) School of
Veterinary Studies, University of Edinburgh.

Source model: https://sketchfab.com/3d-models/horse-equus-ferus-caballus-ea9a974658fc4cab9860b75024f51791
Institutional source and reuse statement: https://open.ed.ac.uk/3d-skeletons-and-skulls/

License: Creative Commons Attribution 4.0 International (CC BY 4.0).
https://creativecommons.org/licenses/by/4.0/

Changes: converted the original STL into two glTF display levels, normalised
coordinates, used 16-bit position quantisation, recomputed display normals,
and generated a static poster from the same geometry. The source was rotated
for comparative display; its exact transform, input hash, output hashes and
simplification parameters are in `equine-skull-edinburgh-provenance.json`.

## Canine skull, NIH 3D entry 3DPX-000282

Applies to `canine-skull-nih282-*` geometry and poster files.

Creator: LeeDock. Source description: dog skull from CT, converted with Bespoke
Modeling software from 3D Systems. Source: https://3d.nih.gov/entries/282

The entry declares Public Domain and links to CC0 1.0:
https://creativecommons.org/publicdomain/zero/1.0/

Changes: produced quick/detail glTF display levels, normalised coordinates,
quantised positions and generated a model-derived poster. Original identifiers,
input/output hashes and conversion metrics are in
`canine-skull-nih282-provenance.json`. NIH hosting is not an assertion of
clinical review, normality, age or breed.

## CUHL 9 skull-base surfaces

Applies to `canine-skull-base-cuhl9-*`, the original `cuhl9-base-*` pilot
geometry and their model-derived posters. This specimen has a different,
noncommercial license from the models above.

Original data: M3#1859, https://doi.org/10.18563/m3.sf.1859

William C. Hooker, Ruihan R. Liu, Alexis M. Slack, Emma R. Schachner,
William G. Ryerson and Brandon P. Hedrick (2025).
3D Printing an Explodable Dog Skull for Veterinary Education.
MorphoMuseuM e276. https://doi.org/10.18563/journal.m3.276

Physical specimen: CUHL 9, Cornell University veterinary teaching collection,
Ithaca, USA. We acknowledge the institution curating this specimen.

Data license: Creative Commons Attribution-NonCommercial 4.0 International.
https://creativecommons.org/licenses/by-nc/4.0/
License policy: https://morphomuseum.com/faq

Adaptation: the seven supplied PLY surfaces were converted to binary glTF.
The original pilot used a relative simplification error limit of 0.001.
The current quick/detail levels use limits of 0.003/0.001 and 16-bit positions;
their separate ledger is `canine-skull-base-cuhl9-provenance.json`.
Relative spatial relationships and named left/right surfaces were retained;
the normalising transform is recorded in the conversion ledger. Display colours
and exploded offsets aid selection; they are not tissue colours or anatomical
positions. Numerical simplification error is not a clinical accuracy guarantee.
The hashes and conversion results are in model-provenance.json. The original
PLY files remain downloadable from the source above.

Scope: selected skull-base bones of one juvenile mixed-breed dog, not a complete
skull, skeleton, adult reference, or collection of species. M3#1858, which includes
magnet housings and printing supports, is not included. The M3#1859 archive has
seven surfaces; ethmoid is not supplied in this archive and is not reconstructed.

Terminology reference: Nomina Anatomica Veterinaria, 6th edition (2017), WAVA,
Osteologia pp. 12, 13, 15, 16 (PDF pp. 30, 31, 33, 34).
https://wava-amav.org/wava-documents.html
Thai display labels are reading aids. No publisher illustrations or textbook
pages are reproduced. Recommended textbooks are further reading, not evidence
that the model or its translations have received independent expert review.

The CUHL 9 model assets are provided for noncommercial educational use.
Commercial reuse of this specimen requires an appropriate license from its
rights holders. Asset licenses do not change the license of the independently
written viewer.
## Full-body canine musculoskeletal model

Source: [FSU Jena / Heiko Stark, SimTK DogModel](https://simtk.org/projects/dogmodel),
`Full linear.zip` (20 October 2021 working German Shepherd model).
[Publication](https://doi.org/10.1038/s41598-021-90058-0).
Copyright (c) 2021, FSU Jena, Heiko Stark. Distributed under the
[MIT notice](./stark-LICENSE.txt), also embedded in the derived GLB files.

The source supplies 24 skeletal segments and 158 muscle paths, not 182
individual bones or volumetric muscles. Some skeletal segments contain several
bones. Skin and internal organs are absent. The published OpenSim default pose
is resolved into common coordinates and rotated for web display. Surface
geometry is simplified and quantized. Fixed muscle path points are connected
with thin display tubes; the tube radius is illustrative, not anatomical
thickness. Ground and non-muscle actuators are omitted.

Original mesh hashes, body transforms and path points are recorded in
[the source manifest](./canine-musculoskeletal-stark-source.json).
Thai reading labels and converted anatomy remain pending independent review.

## Canine CT organ surfaces, Pixelbeaker

Applies to `canine-abdomen-pixelbeaker-*`.
Creator: Pixelbeaker. Original model:
https://sketchfab.com/3d-models/3d-canine-anatomy-normal-abdomen-962de878d2e94b75b10075931f0edaa3
License: Creative Commons Attribution 4.0 International:
https://creativecommons.org/licenses/by/4.0/

Five named OBJ composites are retained: bones, vascular, lungs,
vascular_liver_pancreas and intestines. Groups are not individual organ
segmentations. Converted to quick/detail GLB, normalized and quantized; colors
are display aids. Original hashes and derivation are in the source and
provenance JSON files. This specimen is not registered to the other dogs.

## Visible dog, Ajou University

Applies to `canine-visible-ajou-*`.
Source: https://sites.google.com/ajou.ac.kr/anatomy
Research by Jin Seo Park and colleagues. Related publication:
https://doi.org/10.1002/ar.23200

The downloaded PDF's original PRC hierarchy supplies 32 named surfaces in
12 systems. Skin, Muscle and Bones are source surfaces; Muscle and Bones are
composites. All source coordinate relationships were retained before a shared
upright display rotation and normalization. Zero-area triangles were removed;
quick/detail display simplification and position quantization are recorded in
`canine-visible-ajou-provenance.json`. Exact input hashes, original names and
hierarchy are retained in `canine-visible-ajou-source.json`.

The source package does not specify a redistribution license. No Creative
Commons license is asserted for this dataset. Creator attribution and the
original source link are retained. Physical units and independent anatomical
review are not confirmed; original terminology, including Sigmoid_colon, is
preserved for review rather than silently renamed.
