// ============================================================
// Repro Lecture Study Notes — Companion Animal Reproduction
// ============================================================
// Scope: Lecture final 3108-409, Lect 15-24, Sem 2/2568.
// สอบ: อังคาร 5 พ.ค. 2569 13:00-16:00
//
// Source priority (เรียงจาก primary → verify):
//   1) Repro final ค่ดโพย by Kimchii85.pdf + sunsun84 mindmap/summaries
//      → senior recall + ตรงโพย ★=85 (high yield exam-prediction)
//   2) Slide 2026/Lect/*.pdf — current-year verification + topic mapping
//   3) schedule course syllabus C Ani Repro.pdf — lecturer/lab structure
//
// Body item types follow NotesView/RichText conventions:
//   string                              — paragraph
//   { bullets: [string|{label,value}] }  — bulleted list
//   { sub, body }                        — sub-section
//   { table: { headers, rows } }          — table
//   { callout, kind }                    — kind: 'tip'|'warn'|'flag'
// ============================================================

export const NOTES_REPRO_LECT = {
  'hormonal-applications': {
    topic: 'hormonal-applications',
    title: 'Hormonal Applications',
    lecturer: 'Suppawiwat Ponglowhapan (SP)',
    icon: '💊',
    summary: 'Synthetic hormones ในสุนัข/แมว — Progestin (MPA/proligestone) · Aglepristone P4 blocker · Deslorelin GnRH agonist · PGF2α · Cabergoline (anti-prolactin) · Oxytocin · Aj. SP เน้น progestin AE "ออก 2 ล้านข้อ จำไป" ★',
    sections: [
      {
        heading: 'Hormone Groups (จำให้ได้)',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf + Kimchii85',
        body: [
          { bullets: [
            'Progestogens — MPA, megestrol acetate, proligestone, delmadinone acetate (anti-androgen)',
            'Progesterone antagonist — aglepristone (Alizine®) · ใช้ใน pyometra, termination 3 wk post-mating, FEH ในแมว ★',
            'GnRH agonist — deslorelin implant · initial flare → down-regulation · ใช้ post-spay UI, BPH',
            'Prostaglandins (PGF2α) — uterine evacuation + CL regression · นิยม pyometra ร่วมกับ aglepristone',
            'Prolactin antagonists — cabergoline, bromocriptine · pseudopregnancy, lactation suppression',
            'Oxytocin — uterine contraction · estrogen-primed receptors near parturition',
          ] },
        ],
      },
      {
        heading: 'Progestin Adverse Effects ★ "ออก 2 ล้านข้อ จำไป"',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf + Kimchii85 p.32',
        body: [
          { callout: 'Aj. SP เน้นมาก — ทุก adverse effect ของ progestin ต้องจำให้ครบ ★ ออกเป็น MCQ + T/F ทุกครั้ง', kind: 'flag' },
          { bullets: [
            '↑ appetite + weight gain',
            'Mammary enlargement + nodules · ในแมวกระตุ้น **mammary fibroadenomatous hyperplasia (FEH/MFH)** ★',
            'Hair coat changes ที่ injection site (สีจาง, alopecia)',
            'GH-stimulating effect → acromegaly + diabetes mellitus ★',
            'CEH (Cystic Endometrial Hyperplasia) → pyometra ในเพศเมีย ★',
            'Pseudopregnancy (เมื่อหยุดยา)',
          ] },
          { sub: 'Use rules',
            body: [
              { bullets: [
                'ใช้ในระยะ anestrus เท่านั้น',
                '⛔ ห้ามใช้ในแม่สุนัขท้อง · ห้าม prepubertal cat (FEH risk)',
                'ไม่เกิน 3 ครั้ง · ห่าง 5-6 เดือน · ไม่ต่อเนื่อง > 2 ปี',
              ] },
            ] },
        ],
      },
      {
        heading: 'Aglepristone — 3 indications หลัก',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf p.33',
        body: [
          { bullets: [
            '(1) Medical Tx pyometra (open-cervix, stable) — 10 mg/kg SC days 1, 2, 8 ± PGF2α',
            '(2) Termination of pregnancy — up to ~ 45 days post-mating · 10 mg/kg SC × 2 days',
            '(3) Feline mammary fibroadenomatous hyperplasia — block P4 effect → mass regress',
          ] },
        ],
      },
      {
        heading: 'Hypoluteoidism (Aj. SP เน้น) ★',
        source: 'Kimchii85 p.32',
        body: [
          { bullets: [
            'P4 < 5 ng/mL ในแม่ท้อง wk 4-5 → bloody discharge / abortion risk',
            { label: 'Tx', value: 'MPA 0.1 mg/kg PO sid' },
            { label: '⚠️ Stop', value: '2 days ก่อนคาดว่า parturition (ให้ P4 drop normal)' },
          ] },
        ],
      },
      {
        heading: 'Oxytocin Critical Use',
        source: 'HHormonal_applications_in_dogs_and_cats.pdf + Kimchii85 p.33',
        body: [
          { callout: '⛔ ห้ามใช้ใน Obstructive dystocia! → uterine rupture risk · ใช้ได้เฉพาะ uterine inertia (non-obstructive) ที่ cervix open + fetus position OK', kind: 'warn' },
          { bullets: [
            'Dose: 0.5-2 IU IM · เริ่ม dose ต่ำ titrate',
            'Adjuncts: Calcium gluconate IV (ถ้าสงสัย hypocalcemia toy breed), glucose ถ้า hypoglycemic',
            'ถ้าไม่ progress 30 min × 3 dose → C-section',
          ] },
        ],
      },
      {
        heading: 'Cabergoline — Pseudopregnancy + Lactation',
        source: 'Kimchii85 p.33',
        body: [
          { bullets: [
            { label: 'MOA', value: 'D2 dopamine agonist → ↓ prolactin' },
            { label: 'Dose', value: '5 µg/kg PO sid × 5-7 days' },
            { label: 'Side effect ★', value: 'อาเจียน (vomit) — ลดได้โดยให้พร้อมอาหาร' },
            'Bromocriptine = older alternative (vomit + ataxia ก็พบบ่อยกว่า)',
          ] },
        ],
      },
      {
        heading: 'Clinical Drug Matching',
        source: 'HHormonal_applications.pdf + Kimchii85 final',
        body: [
          { table: {
            headers: ['Problem', 'Drug logic'],
            rows: [
              ['Pseudopregnancy', 'Cabergoline / bromocriptine (block prolactin)'],
              ['Pyometra (medical)', 'Aglepristone ± PGF2α'],
              ['Termination of pregnancy', 'Aglepristone (≤ 45 d post-mating)'],
              ['BPH / androgen-dependent', 'Anti-androgen (delmadinone) หรือ deslorelin GnRH agonist'],
              ['Feline MFH', 'Aglepristone (P4-driven) ± OVH'],
              ['Lactation suppression', 'Cabergoline'],
              ['Hypoluteoidism (P4 < 5)', 'MPA 0.1 mg/kg sid (stop 2 d ก่อนคลอด)'],
              ['Functional dystocia (no obstruction)', 'Oxytocin 0.5-2 IU IM + Ca²⁺'],
            ],
          } },
        ],
      },
    ],
  },

  'semen-ai': {
    topic: 'semen-ai',
    title: 'Semen Evaluation + Breeding + AI',
    lecturer: 'Theerawat Tharasanit (TT)',
    icon: '🧪',
    summary: 'Semen collection (dog = digital · cat = EE/UrCaPI) · evaluation (macro/micro/functional) · ovulation timing (P4 + cytology + vaginoscopy) · AI route choice · Aj. KC unique dog feature: pre-ovulatory luteinization ★',
    sections: [
      {
        heading: 'Collection Methods (Aj. TT)',
        source: 'Semen collection.pdf + Kimchii85 Q3, Q8, Q9',
        body: [
          { bullets: [
            { label: 'Dog ★', value: 'Digital manipulation (no anesthesia, fraction-separable, every 3-5 days)' },
            'Dog 3 fractions: 1st pre-sperm/prostatic clear · 2nd sperm-rich opaque ★ · 3rd prostatic large volume',
            'Dog AV: less common (penis bulbus glandis ต้องใช้ AV ที่ออกแบบเฉพาะ)',
            'Dog EE: rare (urine contamination, ไม่นิยม)',
            { label: 'Cat ★', value: 'EE under anesthesia · AV with teaser · UrCaPI (medetomidine 130 µg/kg + urethral catheter)' },
          ] },
        ],
      },
      {
        heading: 'Semen Evaluation Framework',
        source: 'Semen collection.pdf + Kimchii85 Q4, Q5',
        body: [
          { sub: 'Macroscopic',
            body: [
              { bullets: ['Volume · pH · Color (white milky normal · yellow = urine · red = blood) · density'] },
            ] },
          { sub: 'Microscopic (essential)',
            body: [
              { bullets: [
                '**Concentration** (sperm count/ml) — hemocytometer formula: N × df × 50 / 1000 × 10⁶',
                '**Motility** % moving + **Progressive motility** +0 ถึง +5 (most important functional ★)',
                '**Morphology** — head + midpiece + tail · dog ≥ 80% normal · cat ≥ 60% normal',
                '**Viability** (eosin-nigrosin) — live/dead',
              ] },
            ] },
          { sub: 'Functional (Aj. TT high-yield ★)',
            body: [
              { bullets: [
                '**Membrane integrity (HOS test)** — swollen tail = intact membrane',
                'Acrosome integrity · DNA integrity · Mitochondrial activity',
              ] },
            ] },
          { sub: 'Special tests',
            body: [
              { bullets: ['Culture/sensitivity · Brucella canis test (zoonotic + infertility) · special staining'] },
            ] },
        ],
      },
      {
        heading: 'Major vs Minor Sperm Defects (Blom classification ★)',
        source: 'Kimchii85 Q3 — past paper screenshot',
        body: [
          { table: {
            headers: ['Type', 'Examples'],
            rows: [
              ['Major (severe — affect fertility)', 'Acrosome defect, narrow base, pear-shape head, midpiece defect, **proximal droplet**, **coil tail**'],
              ['Minor (less impact)', 'Slightly abnormal head, bent tail, distal droplet, abaxial implantation'],
            ],
          } },
          { callout: 'Decrease fertility when major defects > 20%', kind: 'tip' },
        ],
      },
      {
        heading: 'AI Quality Threshold',
        source: 'Semen collection.pdf + Kimchii85 Q9',
        body: [
          { bullets: [
            'Total motility ≥ 70-80% · Progressive ≥ +3 (best ★ +5)',
            'Concentration ≥ 100 × 10⁶/ml · Total ≥ 200×10⁶ fresh / 300-500×10⁶ frozen',
            'Morphology ≥ 80% normal (dog) · ≥ 60% (cat)',
            'Viability ≥ 70-80% live',
          ] },
        ],
      },
      {
        heading: 'Ovulation Timing (Aj. KC) ★★',
        source: 'Semen collection.pdf + Kimchii85 Q1, Q5, Q6, Q7',
        body: [
          { callout: 'Unique dog feature: pre-ovulatory luteinization → P4 measurable ก่อน ovulation (ไม่เหมือนสัตว์อื่น) → ใช้ P4 timing ได้!', kind: 'flag' },
          { table: {
            headers: ['P4 (ng/mL)', 'Stage'],
            rows: [
              ['< 1.0', 'Anestrus / early proestrus'],
              ['**1.5-2.5**', '**LH surge** = Day 0'],
              ['**4-10**', '**Ovulation** (LH+2) — eggs immature ยัง'],
              ['10-20', '**Fertilization period (LH+4 to +6)** — best AI window!'],
              ['> 20', 'Post-ovulation, late'],
            ],
          } },
          { sub: 'AI timing per semen type (from LH surge)',
            body: [
              { bullets: [
                'Natural / Fresh AI = day 3-6 (1-4 d post-ovulation)',
                'Chilled semen = day 4-6 (2-4 d post-ovulation)',
                '**Frozen-thawed = day 5-6** (3-4 d post-ovulation) ★',
              ] },
            ] },
        ],
      },
      {
        heading: 'Vaginal Cytology by Cycle Stage',
        source: 'Kimchii85 Q6 — Day 6 rule',
        body: [
          { table: {
            headers: ['Cell type', 'Proestrus', 'Estrus', 'Diestrus D1-2', 'Anestrus'],
            rows: [
              ['RBC', '++', '+', '-', '-'],
              ['WBC', '+/-', '-', '+++', '-'],
              ['Cornified superficial', '10%', '90%', '30%', '0'],
              ['Intermediate', '50%', '2%', '20%', '3%'],
              ['Basal/parabasal', '10%', '0', '30%', '95%'],
            ],
          } },
          { callout: 'Day 6 Rule (Aj. KC): "วันแรกของ diestrus smear − 6 = วันตกไข่" — เห็น intermediate ↑ + WBC + metestrum cells = D1 of diestrus → ovulation 6 วันก่อนหน้านี้', kind: 'tip' },
        ],
      },
      {
        heading: 'AI Routes',
        source: 'Semen collection.pdf + Kimchii85 Q8',
        body: [
          { bullets: [
            'IVAI (intravaginal) — simplest, no anesthesia, fresh semen only',
            'TCAI (transcervical) ★ — Scandinavian หรือ Norwegian catheter · **no anesthesia** · ใช้ frozen ได้',
            'Surgical / Laparoscopic IUAI — anesthesia required · best for marginal frozen quality · ผิดกฎหมายในยุโรป/ออสเตรเลีย',
          ] },
        ],
      },
      {
        heading: 'Cat AI Specifics',
        source: 'Kimchii85 Q4, Q9, Q10',
        body: [
          { bullets: [
            'Cat = induced ovulator → ใช้ **hCG 250 IU IM** ★ Day 3-4 of estrus (ต้อง E2 priming ก่อน)',
            'AI: 5 French tomcat catheter, 45-50 mm into vagina',
            'Sperm dose ≥ 5 × 10⁶',
            'Held 10 min hindquarter elevated',
            'Repeat AI 24 hr later → ↑ conception rate',
            'Capacitation in cat = 1-2 hr (vs dog 24-48 hr)',
          ] },
        ],
      },
    ],
  },

  'semen-preservation': {
    topic: 'semen-preservation',
    title: 'Preserved Semen (Chilled + Frozen)',
    lecturer: 'Theerawat Tharasanit (TT)',
    icon: '❄️',
    summary: 'Cryopreservation: extender ที่มี egg yolk (cold-shock protection) · CPA (glycerol) ค่อยๆ เติม · LN₂ -196°C · damage จาก ice crystal · thaw + evaluate',
    sections: [
      {
        heading: 'What Can Be Cryopreserved',
        source: 'Cold storage and freezing.pdf',
        body: [
          { table: {
            headers: ['Cell/tissue', 'Use', 'Possibility'],
            rows: [
              ['**Sperm** ★', 'AI', '**High**'],
              ['Embryo', 'ET', 'Medium'],
              ['Oocyte', 'IVM/IVF/IVC/ET', 'Low'],
              ['Testicular/ovarian tissue', 'Culture / xenotransplant', 'Low to very low'],
            ],
          } },
        ],
      },
      {
        heading: 'Cryobiology Logic',
        source: 'Cold storage and freezing.pdf + Kimchii85 Q6',
        body: [
          { bullets: [
            '**LN₂ -196°C** = standard storage ★ (below glass transition → indefinite preservation)',
            'Cell damage จาก **ice crystal** ขนาดใหญ่ (intracellular ice เสียหายเด่น)',
            'Extracellular ice forms first → osmotic shift → cell shrink',
            'CPA (glycerol 6-8%, DMSO, EG) ลด ice formation · permeable + non-permeable',
            'CPA เติมช้า → ลด osmotic shock (cell shrink → swell)',
          ] },
        ],
      },
      {
        heading: 'Egg Yolk Extender (เด่น Aj. TT) ★',
        source: 'Kimchii85 Q2',
        body: [
          { callout: '"ถูกทุกข้อ" — egg yolk มีหน้าที่หลายอย่างพร้อมกัน ★', kind: 'tip' },
          { bullets: [
            'Cold-shock protection (LDL + phospholipid coat membrane)',
            'Energy (fatty acids + cholesterol)',
            'Nutrient (vitamins, AA)',
            'pH buffer · antibacterial (ร่วมกับ ATB)',
            'Osmotic balance',
          ] },
        ],
      },
      {
        heading: 'Cryopreservation Workflow',
        source: 'Cold storage and freezing.pdf',
        body: [
          { bullets: [
            '1. Dilute semen + extender (egg yolk based) + CPA',
            '2. Cool to 5°C slowly (~ 1°C/min)',
            '3. Equilibrate 30-60 min',
            '4. Plunge into LN₂ vapor → -120°C',
            '5. Submerge in LN₂ → -196°C indefinite',
            '6. Thaw rapidly (37-75°C, few seconds) → evaluate motility/membrane',
          ] },
        ],
      },
    ],
  },

  infertility: {
    topic: 'infertility',
    title: 'Infertility Problems (Bitch + Queen + Tom)',
    lecturer: 'Theerawat Tharasanit (TT)',
    icon: '🔍',
    summary: 'Approach: male vs female × primary vs acquired · timing · infection (Brucella!) · anatomy · hormones · semen quality · breeding management',
    sections: [
      {
        heading: 'Bitch Infertility Definition',
        source: 'Infertility in dogs and cats.pdf + Kimchii85',
        body: [
          { bullets: [
            'Suspect: failure to conceive after **2-3 properly timed breedings** กับ proven fertile male',
            'Core tools: history · reproductive exam · vaginal cytology · U/S (ovary + uterus) · P4 monitoring',
            'Differentials: prolonged anestrus, shortened interval, prolonged estrus, silent heat, ovarian cyst/tumor, CEH/endometritis, **Brucella canis** (zoonotic ★)',
          ] },
        ],
      },
      {
        heading: 'Queen-Specific Traps',
        source: 'Infertility.pdf + Kimchii85',
        body: [
          { callout: 'Queen = induced ovulator แต่ spontaneous ovulation เกิดได้ — ห้ามตัดสินจาก single P4 sample!', kind: 'warn' },
          { bullets: [
            'Ovulation failure: P4 5-7 d post-mating ยังคง < 2 ng/mL',
            'Reliable ovulation มัก ต้อง multiple matings · LH release proportional to mating count',
            'Silent heat: ตา observation ไม่พอ → weekly cytology + P4',
            'ใช้ hCG 250 IU IM เป็น induction (Day 3-4 estrus)',
          ] },
        ],
      },
      {
        heading: 'Male Workup (Tom + Stud Dog)',
        source: 'Infertility.pdf + Kimchii85',
        body: [
          { bullets: [
            'Normal dog semen: total 300×10⁶ - 2×10⁹ · progressive motility > 70% · morphology > 60-80% normal',
            { label: 'Azoospermia step 1', value: 'ตรวจว่า ejaculation complete? **ALP > 5,000 IU/L = complete (epididymal contribution)**' },
            'Azoospermia + high ALP → testicular origin (sperm production failure)',
            'Azoospermia + low ALP → incomplete ejaculation / obstruction / retrograde',
            '**Brucella canis** PCR/serology critical — semen deterioration + zoonotic',
          ] },
        ],
      },
      {
        heading: 'Sperm Terminology',
        source: 'Kimchii85 Q7',
        body: [
          { table: {
            headers: ['Term', 'Meaning'],
            rows: [
              ['Oligospermia', 'Low sperm count → semen ใส (clear) macroscopic'],
              ['Azoospermia', 'No sperm at all'],
              ['Aspermia', 'No ejaculate (but erection present)'],
              ['Asthenozoospermia', 'Low motility (< 70% progressive)'],
              ['Teratozoospermia', '> 40% abnormal morphology (dog)'],
              ['Pyospermia / Leukocytospermia', 'High WBC (infection)'],
              ['Haemospermia', 'Blood in semen'],
              ['Urospermia', 'Urine contamination'],
            ],
          } },
        ],
      },
    ],
  },

  biotech: {
    topic: 'biotech',
    title: 'Reproductive Biotechnology (ART)',
    lecturer: 'Ampika Thongphakdee (AT)',
    icon: '🧬',
    summary: 'ART = Assisted Reproductive Technology · IVF + ICSI + ET + IVM + SCNT · ใช้ใน conservation (One Plan Approach) · canine/feline as models for endangered species',
    sections: [
      {
        heading: 'Why Dogs/Cats Matter for Conservation',
        source: 'Biotech.pdf + Kimchii85',
        body: [
          { bullets: [
            'Small populations: inbreeding · low genetic diversity · ↓ fertility · poor sperm viability · ↑ offspring mortality',
            '**Wild felids → teratospermia** (high abnormal sperm) → cryopreservation + IVF helps',
            '**One Plan Approach**: link ex-situ breeding กับ in-situ conservation goals',
            'Zoo programs: welfare + enrichment + genetics + ART rolled together',
          ] },
        ],
      },
      {
        heading: 'ART Toolbox',
        source: 'Biotech.pdf + Kimchii85 Q3, Q5, Q6, Q8',
        body: [
          { table: {
            headers: ['Method', 'Use case'],
            rows: [
              ['AI', 'Sperm deposited to female tract — basic'],
              ['IVF', 'Oocyte + sperm → petri dish → embryo → ET'],
              ['**ICSI** ★', '**Single sperm injected to oocyte** — rescue OAT (severe male infertility)'],
              ['IVM', 'In vitro maturation of oocyte to MII (critical for dog — released as primary oocyte!)'],
              ['ET', 'Embryo transfer (donor → recipient)'],
              ['**SCNT (cloning)**', 'Somatic nucleus → enucleated oocyte'],
            ],
          } },
        ],
      },
      {
        heading: 'Embryo Development Timeline (dog)',
        source: 'Kimchii85 Q8',
        body: [
          { table: {
            headers: ['Day', 'Stage', 'Location'],
            rows: [
              ['Day 0', 'Fertilization', '**Oviduct ampulla** ★'],
              ['Day 1-3', 'Cleavage (2→4→8 cell)', 'Oviduct'],
              ['Day 5', 'Morula', 'Uterus'],
              ['**Day 7**', '**Blastocyst** ★', 'Uterus'],
              ['Day 8-9', 'Hatching blastocyst', 'Uterus'],
              ['Day 16-21', 'Implantation', 'Uterine wall'],
            ],
          } },
        ],
      },
      {
        heading: 'SCNT / Cloning',
        source: 'Biotech.pdf',
        body: [
          { bullets: [
            'Move somatic nucleus into enucleated oocyte → identical clone',
            'Inter-species nuclear transfer attempted when species-specific oocytes limited',
            'Limits: nuclear-cytoplasmic compatibility · embryo development efficiency · implantation · surrogate matching',
          ] },
        ],
      },
    ],
  },

  'exotic-repro': {
    topic: 'exotic-repro',
    title: 'Exotic Pets Reproduction',
    lecturer: 'Chaowaphan Yinharnmingmongkol (CY)',
    icon: '🐇',
    summary: 'Overview species-specific repro: rabbit (induced ovulator) · guinea pig (ovarian cyst) · ferret (estrogen toxicity) · reptile (hemipenis prolapse) — 2026 slide image-heavy ใช้ sunsun84 summary เสริม',
    sections: [
      {
        heading: 'Rabbit Repro Pearls',
        source: 'Exotic Repro 69.pdf + sunsun84 — 5 exotic repro',
        body: [
          { bullets: [
            'Rabbit = **induced ovulator** ★ — breeding can occur soon after parturition',
            'Gestation ~ 30 days',
            'Litter size ~ 4 kits (varies by breed/size)',
            'Pseudopregnancy 16-18 days · nest-building + mammary enlargement',
            'Surgery: caudal midline approach · ระวัง cecum + bladder',
          ] },
        ],
      },
      {
        heading: 'Common Exotic Repro Flags ★',
        source: 'Repro Final รวมโพย + sunsun84',
        body: [
          { bullets: [
            { label: 'Guinea pig (older female) ★', value: '**Ovarian cyst** — recurring high-yield exam item' },
            { label: 'Ferret (intact female) ★', value: 'Prolonged estrus → **estrogen toxicity** → alopecia + bone marrow suppression' },
            { label: 'Marmoset / primates', value: 'Singleton oversized fetus → dystocia risk' },
            { label: 'Reptile', value: 'Phallus / hemipenis prolapse — acute: ลด swelling + replace · chronic/necrotic: amputate' },
          ] },
        ],
      },
      {
        heading: 'Exam Note',
        source: 'Kimchii85 + sunsun84',
        body: [
          { callout: 'Lecture 20 slide PDF ของ 2026 image-heavy → exact numbers อาจต้อง verify · ค่ากลางจำได้ระดับ species + emergency presentation', kind: 'flag' },
          { bullets: [
            'Focus: species-specific physiology + emergency reproductive presentations',
            'Husbandry + anesthesia risk ก็เป็น part ของ exotic repro case management',
          ] },
        ],
      },
    ],
  },

  genetics: {
    topic: 'genetics',
    title: 'Genetic Considerations in Breeding',
    lecturer: 'Nantapong Kamprasert (NK)',
    icon: '🧬',
    summary: 'Phenotype = Genetic + Environment (P=G+E) · Heritability · Selection types · EBV/BLUP/GBLUP · Inbreeding risk',
    sections: [
      {
        heading: 'Core Formulas',
        source: 'Genetic.pdf',
        body: [
          { bullets: [
            { label: 'P = G + E', value: 'Phenotype shaped by Genetics + Environment ★' },
            { label: 'Heritability h²', value: 'h² = V_genetic / V_phenotype' },
            'Breeding selection = ใช้คนเลือกตัว parent เพื่อปรับปรุง population ในทิศทางที่ต้องการ',
          ] },
        ],
      },
      {
        heading: 'Selection Types',
        source: 'Genetic.pdf',
        body: [
          { table: {
            headers: ['Type', 'Pattern'],
            rows: [
              ['Stabilizing', 'Keeps intermediate phenotype favored'],
              ['**Directional** ★', 'Pushes population toward one extreme'],
              ['Disruptive', 'Favors both extremes over intermediate'],
              ['**Artificial** ★', 'Selection imposed by humans (vs natural)'],
            ],
          } },
        ],
      },
      {
        heading: 'Applied Breeding Tools',
        source: 'Genetic.pdf',
        body: [
          { bullets: [
            'EBV (Estimated Breeding Value) — for selection decisions',
            'BLUP — uses **pedigree relationship matrix**',
            '**GBLUP** ★ — uses **genomic relationship matrix + genetic markers** (modern)',
            'Narrow breeding pools → ↑ inbreeding → ↓ fertility + inherited disease',
          ] },
        ],
      },
    ],
  },

  'surgical-neutering': {
    topic: 'surgical-neutering',
    title: 'Surgical Neutering',
    lecturer: 'Sroisuda Chotimanukul (SC)',
    icon: '✂️',
    summary: 'OHE/OE/orchiectomy techniques · ligation + closure · **ORS (Ovarian Remnant Syndrome)** ตัวเอกของ Aj. TT — surgical error #1 cause · AMH dx · caudal midline laparotomy',
    sections: [
      {
        heading: 'Definitions',
        source: 'Surgical neutering.pdf + Kimchii85 ORS Q1',
        body: [
          { bullets: [
            '**Neutered** = testicles or ovaries removed → no offspring',
            '**Spay** = OVH (Ovariohysterectomy) ในเพศเมีย',
            '**Gonadectomy** = umbrella term: orchiectomy/castration · ovariectomy · OVH',
            'Therapeutic indications: ovarian cyst/tumor · CEH/pyometra · testicular tumor · cryptorchidism · BPH · pseudopregnancy · diestrus DM · recurrent vaginal hyperplasia · alopecia X',
          ] },
        ],
      },
      {
        heading: 'OHE Technical Points',
        source: 'Surgical neutering.pdf',
        body: [
          { bullets: [
            'Dog OHE position: dorsal recumbency · ventral midline incision **just caudal to umbilicus**',
            'Approach: linea alba หรือ right paramedian',
            'Ovarian pedicle + cervix: **double ligation** · absorbable suture · surgeon knot or modified Miller',
            'Leave **≥ 0.5 cm tissue tag** distal to ligature ★ · check hemorrhage ก่อน return stump',
          ] },
        ],
      },
      {
        heading: 'Male Techniques',
        source: 'Surgical neutering.pdf',
        body: [
          { bullets: [
            { label: 'Dog orchiectomy (closed)', value: 'Prescrotal incision · push testis forward · break/incise scrotal ligament · **double ligation**' },
            { label: 'Cat orchiectomy', value: 'Scrotal incision · double ligation/binding knot · elevate scrotal skin so cords retract · **usually no closure** ★' },
            'Cryptorchid: location-based approach · abdominal cryptorchid = abdominal exploration',
          ] },
        ],
      },
      {
        heading: 'Ovarian Remnant Syndrome (ORS) ★★ — Aj. TT favorite',
        source: 'Kimchii85 ORS Q1-10 (past-paper screenshots)',
        body: [
          { callout: 'ORS exam Qs จาก Aj. TT ออกบ่อยมาก ★ — definition, cause, diagnosis (AMH), treatment (caudal midline laparotomy), differential (pseudopregnancy, cervical stump infection)', kind: 'flag' },
          { sub: 'Definition + Time',
            body: [
              { bullets: [
                'Persistence ของ functional ovarian tissue หลัง OVH/OVE',
                'Time to dx: **1-2 years post-spay** (when estrus signs return)',
              ] },
            ] },
          { sub: 'Causes ★',
            body: [
              { bullets: [
                '**(1) Surgical error of surgeons** ★ #1 cause (incomplete removal · dull instrument · poor visualization)',
                '(2) Dropping ovarian tissue into peritoneum → revascularize',
                '(3) Accessory / ectopic ovary (rare ~ 1%)',
              ] },
            ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                'Vaginal cytology during suspected estrus → cornified cells (estrogen present)',
                '**AMH (Anti-Mullerian Hormone)** ★ — best practical lab dx · single sample any cycle',
                '  - Normal intact: 0.5-3 ng/mL',
                '  - OVH: undetectable < 0.05 ng/mL',
                '  - **ORS: > 0.1 ng/mL** = ovarian tissue present',
                'Definitive: exploratory laparotomy + histopath',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                '**Surgical removal** of remaining ovarian tissue ★',
                '**Approach: caudal midline laparotomy** ★ (allows bilateral access)',
                'Best timing: during estrus (remnant more vascular + larger)',
                'Examine both ovarian beds + mesovarium + ectopic locations',
                'Send to histopath for confirmation',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cervical Stump Issues (post-OVH)',
        source: 'Kimchii85 ORS Q7',
        body: [
          { bullets: [
            'OVH = removed uterus + ovaries · cervix remains',
            'Brown-red vaginal discharge in OVH dog → **Cervical stump infection/inflammation** ★',
            '⛔ Pyometra ก็ดี CEH ก็ดี — เป็นไปไม่ได้ใน OVH dog (uterus removed!)',
            'Tx: ATB + possible re-excision of stump',
          ] },
        ],
      },
    ],
  },

  'gonadectomy-risk': {
    topic: 'gonadectomy-risk',
    title: 'Risk-Benefit of Neutering',
    lecturer: 'Sroisuda Chotimanukul (SC)',
    icon: '⚖️',
    summary: 'Individualized decision: species × breed × sex × size × age × disease risk · Aj. SC ★ "จำไปให้หมด" — breed lists for mammary tumor, BPH, MCT, USMI · Springer Spaniel post-neuter aggression',
    sections: [
      {
        heading: 'Benefits',
        source: 'Risk-benefit assessment.pdf',
        body: [
          { bullets: [
            'Prevent pregnancy + uterine/ovarian/testicular disease',
            'Complete uterine removal (incl. cervix) prevents/cures uterine disease',
            'BPH common in intact male dog → gonadectomy resolves in 4-6 wks',
            'Vaginal hyperplasia/prolapse remit + recurrence prevented',
            'Eliminate mammary tumor risk if before 1st estrus (small breed) · partial benefit if after 1st-2nd estrus',
          ] },
        ],
      },
      {
        heading: 'Predisposed Breed Lists (Aj. SC) ★ "จำไปให้หมด"',
        source: 'Kimchii85 p.25-29',
        body: [
          { callout: 'Aj. SC ระบุชัด — ออกข้อสอบเป็น breed-matching ★', kind: 'flag' },
          { table: {
            headers: ['Disease', 'Predisposed breeds + Risk factors'],
            rows: [
              ['**Mammary tumor**', 'Springer + Cocker spaniel + **Boxer** + Poodle + Dachshund · large > small'],
              ['**BPH**', 'Doberman + Rottweiler + GSD + Labrador (large breeds, age > 5 yr)'],
              ['**MCT (Mast Cell Tumor)**', 'Female 2.6× ↑ · age > 7 yr · BW 20-30 kg · GR + LR + Boxer + Pug + GSD'],
              ['**Osteosarcoma**', 'Male + large/giant + early gonadectomy (< 6 mo) ↑ risk'],
              ['**Hemangiosarcoma**', 'Female gonadectomy > 12 mo → ↑ risk'],
              ['**Lymphoma**', 'Australian Shepherd + GR · gonadectomized female ↑'],
              ['**TCC (urothelial cancer)**', 'Female · **Scottish Terrier** ★ · age > 6 · obesity'],
              ['**USMI**', 'Female + BW > 20 kg + young gonadectomy (< 3-6 mo) + short urethra · breeds: Boxer, Doberman, GSD, OES'],
            ],
          } },
        ],
      },
      {
        heading: 'Detriments to Discuss',
        source: 'Risk-benefit assessment.pdf',
        body: [
          { bullets: [
            'Tumor risk: prostate (slight ↑) · MCT · TCC · OSA · lymphoma · hemangiosarcoma',
            '**USMI** in female dog (3-20%) · estrogen-dependent sphincter tone loss',
            'Orthopedic disease ↑ if early gonadectomy < 6 mo + large/heavy breed',
            'Pediatric gonadectomy 6-16 wks · slide ไม่แนะนำ routine ใน owned pet (case-by-case)',
            { label: '**Springer Spaniel ★**', value: 'Post-neuter aggression to owner (male > female) — discuss before procedure' },
          ] },
        ],
      },
      {
        heading: 'Decision Rule',
        source: 'Risk-benefit assessment.pdf',
        body: [
          { callout: 'Don\'t justify prophylactic gonadectomy by single benefit (e.g., mammary prevention alone). Frame as breed/age/sex-specific risk-benefit conversation with owner ★', kind: 'tip' },
          { bullets: [
            'Mammary prevention = real benefit but more nuanced than old teaching',
            'Large breed dogs: discuss delayed timing or alternatives',
            'Working/sporting dogs: don\'t base on performance loss alone',
            'Long-acting GnRH agonist (deslorelin) = trial period for behavioral effect',
          ] },
        ],
      },
    ],
  },

  'repro-ultrasound': {
    topic: 'repro-ultrasound',
    title: 'Reproductive Ultrasound',
    lecturer: 'Suppawiwat Ponglowhapan (SP)',
    icon: '🩻',
    summary: 'Pregnancy dx (earliest 20-22d post-LH) · gestational age (CRL/BPD/AD/ICC) · fetal sex Day 55-58 · female disease (CEH/pyometra/ovarian) · male disease (BPH/prostatitis/testis)',
    sections: [
      {
        heading: 'Major Uses',
        source: 'Ultrasound_Reprod_in_the_dog_and_cat.pdf',
        body: [
          { bullets: [
            { label: 'Female pregnancy', value: 'Pregnancy dx · gestational age · fetal viability/development · fetal death · parturition prediction' },
            { label: 'Female disease', value: 'Ovarian cyst · pyometra/mucometra/hydrometra · CEH · stump pyometra · granuloma · postpartum metritis · SIPs · ovarian/uterine tumor' },
            { label: 'Male disease', value: 'BPH/prostatitis/cyst/abscess/cancer · testis/scrotum disease · epididymal disease · cryptorchidism · infertility lesions' },
          ] },
        ],
      },
      {
        heading: 'Pregnancy Timeline (Canine, days post-LH surge)',
        source: 'Ultrasound.pdf + Kimchii85',
        body: [
          { table: {
            headers: ['Day post-LH', 'Finding'],
            rows: [
              ['16-20', 'Implantation begins'],
              ['**20-22**', '**Gestational sac** (1st U/S sign) ★'],
              ['25-30', 'Fetal pole + heartbeat (250 bpm)'],
              ['30-35', 'Fetal body recognizable · count fetuses (US)'],
              ['45-50', 'Skeletal mineralization → radiograph fetal count better'],
              ['**55-58**', '**Fetal sex determination** ★'],
              ['60+', 'Fetal monitoring (HR, viability)'],
              ['**63-65**', '**Parturition** (mean: 63 d post-LH)'],
            ],
          } },
        ],
      },
      {
        heading: 'Fetal Sex Determination',
        source: 'Kimchii85 Q (Lect 24)',
        body: [
          { bullets: [
            'Optimal: **Day 55-58** in dog ★ · Day 38-43 in cat',
            'Female: vulva visible at perineum, prepuce absent',
            'Male: prepuce visible (caudal to umbilicus), testes may be visible later',
            'Best in lateral recumbency, sagittal scan along ventral abdomen',
          ] },
        ],
      },
      {
        heading: 'Fetal Viability',
        source: 'Ultrasound.pdf',
        body: [
          { bullets: [
            'Fetal HR > 220 bpm = normal',
            'HR < 180 bpm → distress',
            'HR < 150 bpm → critical / imminent demise (consider C-section)',
          ] },
        ],
      },
      {
        heading: 'Male U/S Specifics',
        source: 'Ultrasound.pdf',
        body: [
          { bullets: [
            '**Mediastinum testis** = hyperechoic central linear structure = **NORMAL** (don\'t mistake for mass)',
            '**Full bladder** ★ helps locate prostate (prostate caudal to UB)',
            'Cervix between body of bladder and neck of bladder',
            'BPH: symmetric, smooth, mildly hyperechoic, ± cysts',
          ] },
        ],
      },
      {
        heading: 'Clinical Pitfall',
        source: 'Ultrasound.pdf + Kimchii85',
        body: [
          { callout: 'Fluid-filled uterus around D30 — pregnancy vs **pyometra**? Combine U/S + CBC inflammation + discharge + reproductive timing · don\'t rely on imaging alone', kind: 'warn' },
          { bullets: [
            'Use U/S in infertility cases: ovary, uterus, early fetal death, prostate/testicular/epididymal lesions',
          ] },
        ],
      },
    ],
  },
};
