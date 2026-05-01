// ============================================================
// Repro Lecture Study Notes - Companion Animal Reproduction
// ============================================================
// Scope: Lecture final 3108-409, Lect 15-24, Sem 2/2568.
// Source priority used here:
//   1) Slide 2026/Lect PDFs
//   2) schedule course syllabus C Ani Repro.pdf
//   3) Repro final ค่ดโพย by Kimchii85.pdf + sunsun84 summaries
//
// Body item types follow NotesView/RichText conventions:
//   string | { bullets } | { sub, body } | { table } | { callout, kind }
// ============================================================

export const NOTES_REPRO_LECT = {
  'hormonal-applications': {
    topic: 'hormonal-applications',
    title: 'Hormonal Applications',
    lecturer: 'Suppawiwat Ponglowhapan',
    icon: '💊',
    summary: 'Synthetic hormones in dogs/cats: contraception, pyometra, pseudopregnancy, BPH, mammary fibroadenomatous hyperplasia, diagnosis of gonadal status/ORS/cryptorchidism.',
    sections: [
      {
        heading: 'Hormone Groups To Recognize',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf',
        body: [
          { bullets: [
            'Progestogens: MPA, megestrol acetate, proligestone, delmadinone acetate.',
            'Progesterone antagonists: aglepristone, used for pyometra, pregnancy termination, fibroadenomatous hyperplasia.',
            'GnRH agonists: deslorelin implant causes down-regulation after initial flare.',
            'Prostaglandins: evacuate uterus and regress CL, best when combined with progesterone blocker.',
            'Prolactin antagonists: cabergoline or bromocriptine for pseudopregnancy and lactation suppression.',
          ] },
        ],
      },
      {
        heading: 'High-yield Adverse Effects',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf',
        body: [
          { bullets: [
            'Progestins can increase CEH/pyometra risk, especially wrong timing, high dose, repeated use, or MPA.',
            'Progestins in cats can trigger mammary fibroadenomatous hyperplasia.',
            'Prostaglandin toxicity is dose-related; slide emphasizes SC route only and high dose can be fatal.',
            'Oxytocin works best when uterus is estrogen-primed and oxytocin receptors rise near parturition.',
          ] },
        ],
      },
      {
        heading: 'Clinical Matching',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf + Kimchii85 final',
        body: [
          { table: {
            headers: ['Problem', 'Drug logic'],
            rows: [
              ['Pseudopregnancy', 'Cabergoline or bromocriptine blocks prolactin'],
              ['Pyometra medical case', 'Aglepristone plus prostaglandin if appropriate'],
              ['BPH / androgen-dependent disease', 'Anti-androgen or GnRH agonist down-regulation'],
              ['Feline mammary fibroadenomatous hyperplasia', 'Aglepristone if progesterone-driven'],
            ],
          } },
        ],
      },
    ],
  },

  'semen-ai': {
    topic: 'semen-ai',
    title: 'Semen Evaluation + AI',
    lecturer: 'Theerawat Tharasanit',
    icon: '🧪',
    summary: 'Collection and evaluation of dog/cat semen, ovulation timing, and AI route selection.',
    sections: [
      {
        heading: 'Collection Methods',
        source: 'Semen collection, semen evaluation, breeding management and AI in dogs and cats.pdf',
        body: [
          { bullets: [
            'Dog: digital manipulation; collect fractions separately when possible.',
            'Dog fractions: 1st pre-sperm/prostatic clear, 2nd sperm-rich opaque, 3rd prostatic large volume.',
            'Cat: electroejaculation under anesthesia or UrCaPI after medetomidine/dexmedetomidine.',
            'UrCaPI protocol uses high dose medetomidine around 120-140 mcg/kg IM or dexmedetomidine 60 mcg/kg.',
          ] },
        ],
      },
      {
        heading: 'Semen Evaluation Framework',
        source: 'Semen collection, semen evaluation, breeding management and AI in dogs and cats.pdf',
        body: [
          { bullets: [
            'Macroscopic: volume, pH, color, density.',
            'Microscopic: motility, concentration, viability, morphology, other cells.',
            'Special tests: culture/sensitivity, Brucellosis test, special staining.',
            'Dog target values used in infertility workup: progressive motility >70%, morphology >60-80% normal.',
          ] },
        ],
      },
      {
        heading: 'AI Route Selection',
        source: 'Semen collection, semen evaluation, breeding management and AI in dogs and cats.pdf',
        body: [
          { bullets: [
            'AI success needs ovulation timing, semen processing, correct route, and operator skill.',
            'Dog ovulation is around serum progesterone 4-10 ng/mL; P4 rises before ovulation.',
            'Intravaginal AI is simplest and lower equipment demand.',
            'Intrauterine AI is preferred for frozen or poor-quality semen; TCAI/endoscopic route avoids surgery.',
            'Surgical AI is widely used in some places but illegal in many European countries and Australia.',
          ] },
        ],
      },
    ],
  },

  'semen-preservation': {
    topic: 'semen-preservation',
    title: 'Preserved Semen',
    lecturer: 'Theerawat Tharasanit',
    icon: '❄️',
    summary: 'Cold storage and freezing: preserve sperm function by controlling water movement, cryoprotectant exposure, freezing rate, storage, and thaw evaluation.',
    sections: [
      {
        heading: 'What Can Be Cryopreserved',
        source: 'Cold storage and freezing_canine and feline Theriogenology.pdf',
        body: [
          { table: {
            headers: ['Cell/tissue', 'Use', 'Overall possibility'],
            rows: [
              ['Sperm', 'Artificial insemination', 'High'],
              ['Embryo', 'Embryo transfer', 'Medium'],
              ['Oocyte', 'IVM + IVF + IVC + ET', 'Low'],
              ['Testicular/ovarian tissue', 'Culture or xenotransplantation concepts', 'Low to very low'],
            ],
          } },
        ],
      },
      {
        heading: 'Cryobiology Logic',
        source: 'Cold storage and freezing_canine and feline Theriogenology.pdf',
        body: [
          { bullets: [
            'Cryopreservation stops the biological clock at low temperature.',
            'Samples are usually stored in liquid nitrogen at -196 C.',
            'Damage depends on free water and ice crystallization.',
            'Extracellular ice forms first; excessive intracellular ice is damaging.',
            'CPA must be added slowly because cells shrink and swell during water/CPA movement.',
          ] },
        ],
      },
      {
        heading: 'Workflow',
        source: 'Cold storage and freezing_canine and feline Theriogenology.pdf',
        body: [
          { bullets: [
            'Incubate cells with freezing medium and permeable/non-permeable CPA.',
            'Load into straw or container.',
            'Cool and freeze with controlled protocol.',
            'Store in liquid nitrogen, then thaw and evaluate viability/functionality.',
          ] },
        ],
      },
    ],
  },

  infertility: {
    topic: 'infertility',
    title: 'Infertility Problems',
    lecturer: 'Theerawat Tharasanit',
    icon: '🔍',
    summary: 'Approach every case as male vs female and primary vs acquired; confirm timing, infection, anatomy, hormones, semen quality, and breeding management.',
    sections: [
      {
        heading: 'Female Workup',
        source: 'Infertility in dogs and cats Canine feline therio 2026.pdf',
        body: [
          { bullets: [
            'Bitch infertility is suspected after failure to conceive after 2-3 properly timed breedings with a proven fertile male.',
            'Core tools: history, reproductive exam, vaginal cytology, ovarian/uterine ultrasound, progesterone monitoring.',
            'P4 timing: baseline <1 ng/mL, LH surge around 2-3 ng/mL, ovulation around 5-8 ng/mL, range 4-10.',
            'Prolonged anestrus, shortened interval, prolonged estrus, silent heat, ovarian cyst/tumor, CEH/endometritis, and Brucella are key differentials.',
          ] },
        ],
      },
      {
        heading: 'Queen-Specific Traps',
        source: 'Infertility in dogs and cats Canine feline therio 2026.pdf',
        body: [
          { bullets: [
            'Queens are induced ovulators, but spontaneous ovulation can occur.',
            'Ovulation failure: P4 5-7 days after mating remains <2 ng/mL.',
            'Reliable ovulation often needs repeated mating; slide notes LH release is proportional to number of matings.',
            'Silent heat cannot be ruled out by owner observation alone; use weekly vaginal cytology and P4.',
          ] },
        ],
      },
      {
        heading: 'Male Workup',
        source: 'Infertility in dogs and cats Canine feline therio 2026.pdf',
        body: [
          { bullets: [
            'Semen analysis in dog: total sperm 300 million-2 billion, progressive motility >70%, morphology >60-80% normal.',
            'Azoospermia: first decide if collection was complete; ALP >5,000 IU/L supports complete epididymal contribution.',
            'High ALP plus azoospermia points toward testicular origin; low ALP suggests incomplete ejaculation, obstruction, or retrograde issue.',
            'Brucella canis is critical: PCR/serology, zoonotic concern, and semen deterioration can follow infection.',
          ] },
        ],
      },
    ],
  },

  biotech: {
    topic: 'biotech',
    title: 'Reproductive Biotechnology',
    lecturer: 'Ampika Thongphakdee',
    icon: '🧬',
    summary: 'ART in dogs/cats as models for endangered species: AI, IVF, embryo transfer, oocyte collection, cloning/SCNT, genome resource banks.',
    sections: [
      {
        heading: 'Why Dogs/Cats Matter',
        source: 'Biotech.pdf',
        body: [
          { bullets: [
            'Small populations face inbreeding, low genetic diversity, reduced fertility, poor sperm viability, and higher offspring mortality.',
            'Wild felids often show teratospermia; cryopreservation and IVF can help conservation breeding.',
            'One Plan Approach links ex situ breeding with in situ conservation goals.',
            'Zoo/conservation programs need welfare, enrichment, genetic management, and reproductive technology together.',
          ] },
        ],
      },
      {
        heading: 'ART Toolbox',
        source: 'Biotech.pdf',
        body: [
          { bullets: [
            'AI manually deposits sperm into female reproductive tract.',
            'IVF workflow: oocyte preparation, sperm preparation, co-incubation, embryo culture.',
            'Embryo transfer completes the chain from in vitro embryo production to live offspring.',
            'Laparoscopic oocyte aspiration can yield multiple embryos and offspring from valuable females.',
          ] },
        ],
      },
      {
        heading: 'Cloning / SCNT',
        source: 'Biotech.pdf',
        body: [
          { bullets: [
            'Somatic cell nuclear transfer moves donor nucleus into enucleated oocyte.',
            'Inter-species or inter-generic nuclear transfer can be attempted when species-specific oocytes are limited.',
            'Major limits: nuclear-cytoplasmic compatibility, embryo development, implantation, and surrogate matching.',
          ] },
        ],
      },
    ],
  },

  'exotic-repro': {
    topic: 'exotic-repro',
    title: 'Exotic Pets Reproduction',
    lecturer: 'Chaowaphan Yinharnmingmongkol',
    icon: '🐇',
    summary: 'Overview topic matched from 2026 Exotic Repro slide plus sunsun84/Kimchii notes because the main slide extraction is scan-heavy.',
    sections: [
      {
        heading: 'Rabbit Repro/Surgery Pearls',
        source: 'Exotic Repro 69.pdf + 5 exotic repro sunsun84',
        body: [
          { bullets: [
            'Rabbit is induced ovulator; breeding can occur soon after parturition.',
            'Gestation is about 30 days; litter size in notes centers around 4 kits but varies by breed and size.',
            'Pseudopregnancy lasts about 16-18 days and may cause nest-building and mammary enlargement.',
            'For female surgery, caudal midline approach and careful cecum/bladder handling are emphasized.',
          ] },
        ],
      },
      {
        heading: 'Common Exotic Repro Flags',
        source: 'Exotic Repro 69.pdf + Repro Final รวมโพย.pdf',
        body: [
          { bullets: [
            'Guinea pigs: ovarian cysts are a recurring high-yield problem in older females.',
            'Ferrets: prolonged estrus can cause estrogen toxicity with alopecia and bone marrow suppression.',
            'Marmosets/primate notes flag dystocia risk when singleton fetus is oversized.',
            'Reptiles: phallus or hemipenis prolapse requires reducing swelling first; chronic necrotic tissue may need amputation.',
          ] },
        ],
      },
      {
        heading: 'Exam Handling',
        source: 'Kimchii85 final + sunsun84 summary',
        body: [
          { callout: 'This topic relies more heavily on summary notes than other topics because the 2026 PDF is image-heavy. Treat exact numbers as slide-check candidates if Palm later provides clearer OCR/screenshots.', kind: 'flag' },
          { bullets: [
            'Focus on species-specific reproductive physiology and emergency reproductive presentations.',
            'Remember husbandry/anesthesia risk is often part of exotic reproductive case management.',
          ] },
        ],
      },
    ],
  },

  genetics: {
    topic: 'genetics',
    title: 'Genetic Considerations',
    lecturer: 'Nantapong Kamprasert',
    icon: '🧬',
    summary: 'Breeding management through genetics: phenotype, heritability, selection type, domestication, EBV/BLUP/GBLUP, and inbreeding risk.',
    sections: [
      {
        heading: 'Core Formula',
        source: 'Genetic.pdf',
        body: [
          { bullets: [
            'Phenotype is shaped by genetics and environment: P = G + E.',
            'Heritability is the proportion of phenotypic variation explained by genetic variation: h = Vgenetic / Vphenotype.',
            'Breeding selection chooses individuals to genetically improve a population in a specific direction.',
          ] },
        ],
      },
      {
        heading: 'Selection Types',
        source: 'Genetic.pdf',
        body: [
          { table: {
            headers: ['Type', 'Idea'],
            rows: [
              ['Stabilizing', 'Keeps intermediate phenotype favored'],
              ['Directional', 'Pushes population toward one extreme'],
              ['Disruptive', 'Favors both extremes over intermediate'],
              ['Artificial', 'Selection imposed by humans'],
            ],
          } },
        ],
      },
      {
        heading: 'Applied Breeding Tools',
        source: 'Genetic.pdf',
        body: [
          { bullets: [
            'EBV estimates breeding value for selection decisions.',
            'BLUP uses pedigree relationship matrix.',
            'GBLUP uses genomic relationship matrix and genetic markers.',
            'Narrow breeding pools increase inbreeding risk; clinical consequence includes reduced fertility and inherited disease expression.',
          ] },
        ],
      },
    ],
  },

  'surgical-neutering': {
    topic: 'surgical-neutering',
    title: 'Surgical Neutering',
    lecturer: 'Sroisuda Chotimanukul',
    icon: '✂️',
    summary: 'Definitions, indications, OHE/OE/orchiectomy techniques, ligation details, closures, complications, and cryptorchid management.',
    sections: [
      {
        heading: 'Definitions + Indications',
        source: 'Surgical neutering.pdf',
        body: [
          { bullets: [
            'Neutered means testicles or ovaries removed and animal cannot produce offspring.',
            'Spay commonly refers to ovariohysterectomy in females.',
            'Gonadectomy covers orchiectomy/castration, ovariectomy, and ovariohysterectomy.',
            'Therapeutic indications include ovarian cyst/tumor, CEH/pyometra, testicular tumor, cryptorchidism, BPH, pseudopregnancy, diestrus DM, recurrent vaginal hyperplasia, alopecia X.',
          ] },
        ],
      },
      {
        heading: 'OHE Technical Points',
        source: 'Surgical neutering.pdf',
        body: [
          { bullets: [
            'Dog OHE: dorsal recumbency, ventral midline incision just caudal to umbilicus.',
            'Approach through linea alba or right paramedian incision.',
            'Ovarian pedicle and cervix: double ligation, absorbable suture, surgeon knot or modified Miller knot.',
            'Leave at least 0.5 cm tissue tag distal to ligature and check hemorrhage before returning stump.',
          ] },
        ],
      },
      {
        heading: 'Male Techniques',
        source: 'Surgical neutering.pdf',
        body: [
          { bullets: [
            'Dog orchiectomy closed technique: prescrotal incision, push testis forward, break/incise scrotal ligament, double ligation.',
            'Cat orchiectomy: scrotal incision, double ligation/binding knot, elevate scrotal skin so cords retract, usually no closure.',
            'Cryptorchid testes need approach based on location; abdominal cryptorchid requires abdominal exploration.',
          ] },
        ],
      },
    ],
  },

  'gonadectomy-risk': {
    topic: 'gonadectomy-risk',
    title: 'Risk-Benefit Of Gonadectomy',
    lecturer: 'Sroisuda Chotimanukul',
    icon: '⚖️',
    summary: 'Neutering decisions should be individualized by species, breed, sex, body size, age, disease risk, owner goal, and alternatives.',
    sections: [
      {
        heading: 'Benefits To Weigh',
        source: 'Risk-benefit assessment of gonadectomy.pdf',
        body: [
          { bullets: [
            'Prevents pregnancy and many uterine/ovarian/testicular diseases.',
            'Complete uterine removal including cervix prevents pregnancy and prevents/cures uterine disease.',
            'BPH is common in intact male dogs and can be prevented or resolved by gonadectomy or hormonal down-regulation.',
            'Vaginal hyperplasia/prolapse can remit after gonadectomy and recurrence is prevented.',
          ] },
        ],
      },
      {
        heading: 'Detriments To Discuss',
        source: 'Risk-benefit assessment of gonadectomy.pdf',
        body: [
          { bullets: [
            'Risks discussed in dogs include prostate tumor, mast cell tumor, TCC, osteosarcoma, lymphoma, hemangiosarcoma.',
            'USMI risk is important in female dogs, especially heavier or predisposed breeds.',
            'Orthopedic risks increase with early gonadectomy in large/heavy breeds.',
            'Pediatric gonadectomy is 6-16 weeks; slide no longer supports routine use in most owned pets without individualized reasoning.',
          ] },
        ],
      },
      {
        heading: 'Decision Rule',
        source: 'Risk-benefit assessment of gonadectomy.pdf',
        body: [
          { callout: 'Do not justify prophylactic gonadectomy solely by one benefit such as mammary tumor prevention. The slide repeatedly frames it as breed/age/sex-specific risk-benefit assessment.', kind: 'tip' },
          { bullets: [
            'Mammary tumor prevention exists but evidence is more nuanced than old teaching.',
            'For owned large-breed dogs, discuss delayed timing or alternatives when appropriate.',
          ] },
        ],
      },
    ],
  },

  'repro-ultrasound': {
    topic: 'repro-ultrasound',
    title: 'Reproductive Ultrasound',
    lecturer: 'Suppawiwat Ponglowhapan',
    icon: '🩻',
    summary: 'Use ultrasound for pregnancy diagnosis and reproductive disease workup in females and males.',
    sections: [
      {
        heading: 'Major Uses',
        source: 'Ultrasound_Reprod_in_the_dog_and_cat.pdf',
        body: [
          { bullets: [
            'Female: pregnancy diagnosis, gestational age, fetal viability/development, fetal death, parturition prediction.',
            'Female disease: ovarian cyst, pyometra/mucometra/hydrometra, CEH, stump pyometra, granuloma, postpartum metritis, SIPs, ovarian/uterine tumor.',
            'Male: prostate disease, testis/scrotum disease, epididymal disease, cryptorchidism, infertility lesions.',
          ] },
        ],
      },
      {
        heading: 'Pregnancy Diagnosis Mindset',
        source: 'Ultrasound_Reprod_in_the_dog_and_cat.pdf',
        body: [
          { bullets: [
            'Ultrasound was first used in vet practice in 1978 and first indication was pregnancy diagnosis in small animals.',
            'Pregnancy scan answers more than pregnant/not pregnant: age, number, viability, normal development, gender, parturition prediction.',
            'Counting fetus number is often less reliable by ultrasound late in pregnancy than radiography.',
          ] },
        ],
      },
      {
        heading: 'Clinical Pitfall',
        source: 'Ultrasound_Reprod_in_the_dog_and_cat.pdf',
        body: [
          { callout: 'A fluid-filled uterus around apparent pregnancy timing can still be pyometra. Combine ultrasound with history, CBC/inflammation, discharge, and reproductive timing.', kind: 'warn' },
          { bullets: [
            'Use ultrasound in infertility cases to assess ovary, uterus, early fetal death, prostatic/testicular/epididymal lesions.',
          ] },
        ],
      },
    ],
  },
};
