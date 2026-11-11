// ============================================================
// slide-figure-placements.mjs: what a person decided about a deck figure
// ============================================================
// Three tables, read by scripts/extract-slide-figures.mjs (which applies
// them), by lint:media (scripts/lib/media.mjs) and by the tests. They name
// files, so they are true of the figures as they are numbered today: after a
// fresh extraction of a deck, look at each of its rows' pictures again.
// ============================================================

// ── Figures placed by hand ───────────────────────────────────────────
// Page matching files a figure under every section whose source cites its
// page. Some figures land nowhere because their section was cut (B35, 2026-09:
// 11 keys, 24 figures), some land under the wrong section because the PDF
// matched by name was a handout rather than the deck the note follows, and
// some are not teaching figures at all. Each entry
// below is a content call made from the words printed on the figure, or the
// slide text the note records, and `label` says which. The table is applied
// after every extraction, so a re-run cannot undo it, and `--rekey` applies it
// to the existing map without the decks: a dry run exits 1 when the map is
// missing a placement, `--rekey --write` writes it.
//
//   { figure, to: [topic, heading], label }  file it under that note section
//   { figure, drop }                         take it out of the map; a file no
//                                            section lists is removed by --clean
//
// A listed figure is shown where its rows say and nowhere else, so a figure
// that belongs in two sections has two rows. --clean fails, naming the row to
// add, when a section showed a second file of a hand-placed picture.
//
// A figure whose place would need the original deck is NOT listed here. It
// stays an orphan in tests/unit/slide-figures-resolve.test.mjs until someone
// can read the deck.
export const REKEYS = [
  // The same drawing sits on slides p.8 and p.18. It is one file, the hand-placed
  // p18-0, and it left this section when its p.8 copy went (11 Nov 2026).
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p18-0.webp', to: ['neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi'],
    label: 'the drawing on slide p.8, which this section cites: the brainstem from above, numbered 1 to 14, the colliculi at 6 and 7, nerves II, IV, V and VIII printed beside it' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p9-0.webp', to: ['neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi'],
    label: 'printed on the figure: Rostral colliculus, Lateral geniculate nucleus, Optic tract, Optic chiasm, Optic nerve' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p9-1.webp', to: ['neuroanat--midbrain', 'Tectum: rostral และ caudal colliculi'],
    label: 'slide p.9 labels around it (note 37c53eff): Medial geniculate body, Caudal colliculus, Trapezoid nuclei, Cochlear nuclei, Lateral lemniscus' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p18-0.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'slide p.18 caption: Level of caudal part of caudal colliculus' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p18-1.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'printed on the figure: Caudal colliculus of the midbrain, Trochlear nerve in the rostral medullary velum' },
  { figure: '/figures/vet-neuroanat/neuroanat--midbrain/p19-0.webp', to: ['neuroanat--midbrain', 'Cross section ที่ระดับ caudal colliculus (ภาพ label)'],
    label: 'printed on the figure: Motor nucleus IV, Trochlear nerve, Nerve in rostral medullary velum; slide labels Caudal colliculus' },
  { figure: '/figures/vet-neuroanat/neuroanat--diencephalon/p3-0.webp', to: ['neuroanat--diencephalon', 'Lateral nuclei ของ thalamus: ส่วนบนกับส่วนล่าง'],
    label: 'printed legend: Lateral nuclei, Medial nuclei, Anterior nuclei, Pulvinar, LD, LP, VA, VL, VPM, VPL' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p9-1.webp', to: ['histo--bone-marrow', 'Vascular compartment'],
    label: 'printed on the figure: Nutrient Artery, Central Artery, Radial Arteries, Venous Sinuses, Central Vein, Nutrient Vein' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p39-0.webp', to: ['histo--bone-marrow', 'ความต่างหลักระหว่างเซลล์ต้นกำเนิดของ erythropoiesis กับ granulopoiesis'],
    label: 'printed on the figure: COLOR OF CYTOPLASM, Originating cell of RBC, Originating cell of WBC' },
  { figure: '/figures/vet-histo/histo--epithelium/p6-0.webp', to: ['histo--epithelium', 'Simple columnar epithelium และ cell modification'],
    label: 'printed on the figure: Simple columnar epithelium with goblet cell, goblet cell, Jejunum' },
  { figure: '/figures/vet-histo/histo--lymphatic-organs-ii/p4-0.webp', to: ['histo--lymphatic-organs-ii', 'Diffuse lymphoid tissue และ lymphatic nodules'],
    label: "printed on the figure: Peyer's patch and M cells, V, N; slide p.4 title Aggregated lymphatic nodules" },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p11-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Route of inoculation ทั้ง 3 ทาง'],
    label: 'printed on the figure: Chorioallantoic membrane, Amniotic, Yolk sac and Allantoic inoculation; slide p.11 title Route of inoculation' },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p13-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Route of inoculation ทั้ง 3 ทาง'],
    label: 'printed on the figure: Chorioallantoic membrane, Amniotic, Allantoic and Yolk sac inoculation; slide p.13 title Route of inoculation' },
  { figure: '/figures/vet-microbio-1/microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout/p19-0.webp', to: ['microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout', 'Recognition of virus-infected eggs'],
    label: 'the note itself places p.19 in this heading; the figure is labelled control against numbered embryos' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p9-0.webp', drop: 'blank dark vignette from the slide template, byte-identical to 33 other figure files' },
  { figure: '/figures/vet-histo/histo--bone-marrow/p39-1.webp', drop: 'blank dark vignette from the slide template, byte-identical to 33 other figure files' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p2-0.webp', drop: 'a web text snippet pasted onto the source copy, not part of the PBL handout; it names the diagnosis the case leaves open' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p2-1.webp', drop: 'a web text snippet pasted onto the source copy, not part of the PBL handout; it names the diagnosis the case leaves open' },
  // Live sections showing the wrong picture, found while doing the above.
  { figure: '/figures/vet-neuroanat/neuroanat--diencephalon/p5-0.webp', to: ['neuroanat--diencephalon', 'Obesity และ Narcolepsy'],
    label: 'printed on the figure: Obesity, Narcolepsy, lateral hypothalamic area, paraventricular nucleus; it came from handout p.5, not the fill-in diagram on deck p.5' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p1-0.webp', drop: 'a web page snippet (Clinical Findings of Endocrine Diseases in Animals) pasted onto the source copy; it names the diagnosis the case leaves open' },
  { figure: '/figures/vet-physio-lab-1/physio-lab-1--pbl-case-6-endocrinology/p1-2.webp', drop: 'a web text snippet on diabetes symptoms pasted onto the source copy, not part of the PBL handout' },
  // Found while looking at every repeated figure, 11 Nov 2026.
  { figure: '/figures/vet-microbio-1/microbio-1--fungal-culture-and-identification-lab/p5-1.webp', drop: 'an empty dark frame, the backdrop of the photograph beside it; it shows nothing' },
  { figure: '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p21-1.webp', drop: 'an empty dark frame, the backdrop of the photograph beside it; it shows nothing' },
  // Two shapes the pixel rule keeps, looked at beside what it takes, 11 Nov 2026.
  { figure: '/figures/vet-histo/histo--bone-marrow/p51-1.webp', drop: 'a grey rectangle with a blurred edge, 84 by 134 pixels: the shadow of the picture beside it; it shows nothing' },
  { figure: '/figures/vet-microbio-1/microbio-1--fungal-disease-and-classification-lect1/p10-2.webp', drop: 'an empty frame from the slide: white inside, teal waves along its edge; it shows nothing' },
];

// ── Figures that repeat and are not template art ─────────────────────
// A picture drawn four or more times in one deck is taken for its template
// (scripts/lib/slide-figure-clean.mjs says why four). A real figure a lecturer
// does show on four slides is listed here with what it shows, and stays:
//   { figure: '/figures/<subject>/<topic>/p<page>-<n>.webp', shows: '...' }
// Empty on 11 Nov 2026: every group of four or more was looked at, and all
// nine were pictures a deck repeats on its own pages, in no section's subject.
//
// Seven were backgrounds and banners (197 files). Two were biological pictures
// the histology deck on cytology draws on nearly every page and its note never
// mentions (95 files): histo--cytology/p10-0, a skin section stained H&E (56
// copies), and p10-1, a cell drawing without labels (39 copies). Those two
// could not be checked against the deck, which is not on the build machine. To
// bring one back without the deck, restore one copy from git history
//   git log --diff-filter=D --format=%H -1 -- public/figures/vet-histo/histo--cytology/p10-0.webp
//   git show <that commit>^:public/figures/vet-histo/histo--cytology/p10-0.webp > public/figures/vet-histo/histo--cytology/p10-0.webp
// and place it with a REKEYS row (`--rekey --write` then lists it under that
// section, and --clean leaves a single copy alone). A row here matters to a
// fresh extraction, which meets the picture on every page again: with the row,
// and --furniture-repeats raised past its count for that deck, the group stays
// as one file, shown where its REKEYS row places it.
export const KEEP_REPEATED = [];

// ── Figures whose pixels read as a shape and are real ────────────────
// A flat mask, a smoothly filled shape and a single flat colour are taken for
// slide shapes (scripts/lib/slide-figure-shape.mjs holds the rule and its
// numbers). A real figure that measures as one is listed here and stays:
//   { figure: '/figures/<subject>/<topic>/p<page>-<n>.webp', shows: '...' }
// Empty on 11 Nov 2026: all 75 pictures the rule took were looked at and none
// was a figure.
export const KEEP_FLAT = [];
