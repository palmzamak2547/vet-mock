// ============================================================
// COM V Study Notes — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// ทุก section อ้างอิง lecture / master compilation โดยตรง
// (ไม่เขียนจากความจำ) — ถ้าจุดไหนต้องการความ precise สูง เช่น
// drug dose / vaccine schedule / threshold / mortality rate
// ผมใส่ source ที่ระบุหน้า slide ไว้ใต้แต่ละ section
//
// Body item types:
//   string                                — paragraph
//   { bullets: [string|{label,value}] }    — bulleted list
//   { sub, body }                          — sub-section
//   { table: { headers, rows } }            — table
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
// ============================================================

export const NOTES_COM5 = {
  // ─────────────────────────────────────────────────────────────
  cve: {
    topic: 'cve',
    title: 'CVE — Canine Viral Enteritis',
    lecturer: 'Aj. Punyamanee Yamkate',
    icon: '🦠',
    summary: 'CPV (โจมตี crypt → bloody diarrhea) + CCV (mature enterocyte ที่ villi tip → mild) + CRV. ไม่มี specific Tx → supportive care + early ABO + nutrition.',
    sections: [
      {
        heading: 'Agents — 3 viruses',
        source: 'CVE.pdf p.2',
        body: [
          { sub: 'Canine Parvovirus (CPV)',
            body: [
              { bullets: [
                'Family: **Parvoviridae**, Genus: Parvovirus',
                'Small, **non-enveloped**, single-stranded **DNA** virus',
                'Highly resistant in environment — 5-7 เดือน',
                '**CPV-1** (original): ส่วนใหญ่ subclinical · อาจรุนแรงในลูกสุนัข **5-21 วัน**',
                '**CPV-2** (a/b/c): highly contagious — **2c รุนแรงสุด**',
              ] },
            ] },
          { sub: 'Canine Coronavirus (CCV / CCoV)',
            body: [
              { bullets: [
                '**Enveloped**, single-stranded **RNA** virus (Coronaviridae)',
                '2 biotypes: enteric **α-CoV** (เป็นหลัก) / respiratory **β-CoV** (CRCoV)',
                'Short-lived in env (ต่างจาก CPV)',
              ] },
            ] },
          { sub: 'Canine Rotavirus (CRV)',
            body: [
              { bullets: [
                'Reoviridae, segmented **double-stranded RNA**, non-enveloped',
                'Mild, self-limiting diarrhea ใน enterocyte',
              ] },
            ] },
        ],
      },
      {
        heading: 'Risk factors — CPV',
        source: 'CVE.pdf p.4',
        body: [
          { bullets: [
            'อายุ **6 wk – 6 mo** (window of susceptibility)',
            'Unvaccinated dogs',
            'Crowded / unsanitary environment',
            'Co-infection กับ endoparasitism (พยาธิ → ทำลาย mucosal barrier)',
            'Certain breeds: **Rottweiler, Doberman, Labrador, GSD, Pitbull, Yorkshire** (เกี่ยวกับ lifestyle ไม่ใช่ genetics)',
            '± Seasonality (ในไทยร้อนทั้งปี ไม่ค่อยเห็น seasonal pattern)',
          ] },
        ],
      },
      {
        heading: 'Pathogenesis',
        source: 'CVE.pdf p.5-6 + COM V FINAL 86 p.4',
        body: [
          'Fecal-oral route (และ fomite — ชาม, ผ้า, เจ้าของ) — ติดง่ายมาก',
          'Incubation **4-14 วัน** · Ingestion → infection → viremia → replication → shedding (10-12 วัน post-infection)',
          { sub: 'Target cells — CPV ชอบ rapidly dividing cells',
            body: [
              { bullets: [
                'Intestinal epithelium — โดยเฉพาะ **germinal cells of crypts** → villous atrophy → bloody diarrhea',
                'Lymphoid tissues (lymph nodes, thymus) → lymphopenia',
                'Bone marrow precursor → panleukopenia',
                'Myocardium (rare) → infection in utero / first 2 weeks of life → **myocarditis**',
              ] },
            ] },
          { sub: 'Target cells — CCV',
            body: [
              { bullets: [
                'Mature enterocytes ที่ **tips of villi** (ต่างจาก CPV ที่โจมตี crypt)',
                'Necrosis / hemorrhage rare',
              ] },
            ] },
          { callout: 'ลูกสุนัข < 12 weeks → severe infection · adult dog → ส่วนใหญ่ subclinical', kind: 'tip' },
        ],
      },
      {
        heading: 'Clinical signs — CPV',
        source: 'CVE.pdf p.7 + COM V FINAL 86 p.4',
        body: [
          { bullets: [
            'Small bowel diarrhea — **foul-smelling + bloody** (mucohemorrhagic)',
            'Phase progression: ถ่ายเหลว → mucohemorrhagic → clear content + เลือด (intestinal lining ลอกหมด)',
            'Vomiting, anorexia',
            'Dehydration → **hypovolemic shock**: tachycardia, poor pulse, pale MM, prolonged CRT',
            'Fever **หรือ** hypothermia · abdominal pain',
          ] },
          { callout: 'Mortality: puppy ≈ 70% / adult ≈ 1%', kind: 'warn' },
        ],
      },
      {
        heading: 'Diagnosis',
        source: 'CVE.pdf p.11-15',
        body: [
          { sub: 'Lab findings (non-specific แต่ช่วย support)',
            body: [
              { bullets: [
                'Leukopenia + lymphopenia ± neutropenia (parvo โจมตี LN)',
                'Hypoproteinemia (GI loss)',
                'Hypoglycemia, electrolyte imbalance (hypoK / hypoNa / hypoCl)',
                'Pre-renal azotemia (severe dehydration)',
                '↑ liver enzymes + bilirubin · ↑ CRP (acute phase)',
              ] },
            ] },
          { sub: 'Viral antigen detection',
            body: [
              { bullets: [
                'Fecal **ELISA test kit** — POC, ง่าย, ไว',
                '**False neg:** low viral load · neutralizing Ab จับ Ag ใน bloody stool',
                '**False pos:** 3-10 วันหลัง MLV vaccine → แยกด้วย **PCR**',
                'Negative ELISA ≠ ไม่มีเชื้อ — ถ้าสงสัย ส่ง PCR ต่อ',
              ] },
            ] },
          { sub: 'Histopathology (necropsy)',
            body: [
              { bullets: [
                'Gross: segmental hemorrhage + congestion · mesenteric lymphadenomegaly · thymus atrophy',
                'Micro: **intestinal crypt necrosis** + dilated crypts + villous collapse',
              ] },
            ] },
        ],
      },
      {
        heading: 'Treatment — supportive (ไม่มี specific antiviral)',
        source: 'CVE.pdf p.16-18 + COM V FINAL 86 p.5',
        body: [
          { sub: '1. Fluid + electrolyte restoration',
            body: [
              { bullets: [
                '**IV fluid** เป็นหลัก (Lactated Ringer\'s / NSS) · ลูกสุนัข/shock → **intraosseous** ได้',
                'ห้าม SC / IP (ดูดซึมช้า + เพิ่มความเสี่ยงติดเชื้อ)',
                'เสริม glucose + potassium · ปรับ rate ตาม shock state',
              ] },
            ] },
          { sub: '2. Early enteral nutrition',
            body: [
              { bullets: [
                'ช่วย healing ของ GI tract',
                'ถ้ากินเองไม่ได้ → feeding tube (esophageal / NG)',
              ] },
            ] },
          { sub: '3. Broad-spectrum antibiotics (parenteral)',
            body: [
              { bullets: [
                'Combination: **β-lactam + aminoglycoside** หรือ **β-lactam + enrofloxacin**',
                'ระวัง: aminoglycoside ห้ามใน dehydrated (nephrotoxic) · enrofloxacin ระวัง cartilage ในลูกสัตว์',
              ] },
            ] },
          { sub: '4. อื่นๆ',
            body: [
              { bullets: [
                'Antiemetic: maropitant, ondansetron, metoclopramide',
                'Acid suppressants: H₂-blockers, PPI, sucralfate (ห่างจากยาอื่น 1-2 ชม.)',
                'Pain: butorphanol, fentanyl',
                'Plasma transfusion ถ้า severe hypoalbuminemia',
                'Immunotherapy: **rFeIFN-ω 2.5 MU/kg IV × 3 d** + Oseltamivir 2 mg/kg PO q12h × 5 d',
                'Ongoing: nitazoxanide, mAb, FMT',
              ] },
            ] },
        ],
      },
      {
        heading: 'Prevention + client communication',
        source: 'CVE.pdf p.20-21',
        body: [
          { bullets: [
            'Disinfectant: **NaOCl 1:30-32** (5% bleach) หรือ accelerated H₂O₂ — chlorhex/QUAT/alcohol ใช้กับ CPV ไม่ได้',
            'Virus อยู่ในสิ่งแวดล้อมได้ **5-7 เดือน** — บ้านที่เคยติดเชื้อ ห้ามรับลูกสุนัขใหม่อย่างน้อย 6 เดือน',
            'Isolate ผู้ป่วยจากตัวอื่น',
          ] },
          { sub: 'Vaccination program',
            body: [
              { bullets: [
                'MDA persist up to **16 weeks** → ฉีดเข็มสุดท้ายต้อง ≥ 16 wk',
                'Puppy: เริ่ม **6-8 wk** · q2-4 wk จน ≥ 16 wk · บูสเตอร์ 1 ปี · ไทย annual',
                'Initial > 16 wk: 2 doses, 2-4 wk apart',
                'MLV ≫ inactivated (ระยะป้องกันยาวกว่า)',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'sporo-crypto': {
    topic: 'sporo-crypto',
    title: 'Sporotrichosis & Cryptococcosis (in cats)',
    lecturer: 'Aj. Siwaporn Pengpis (DTBVM)',
    icon: '🍄',
    summary: 'Sporo = zoonosis, dimorphic, 3 forms (cut/cut-lymph/dissem), Itra TOC. Crypto = NON-zoonosis, 4 forms (nasal/cut/CNS/syst), LCAT antigen test, Fluconazole TOC.',
    sections: [
      {
        heading: '⚖️ เปรียบเทียบ Sporo vs Crypto',
        source: 'Sporotrichosis and Cryptococcosis.pdf',
        body: [
          { table: {
            headers: ['', 'Sporotrichosis', 'Cryptococcosis'],
            rows: [
              ['Zoonosis', '**ใช่** (cat-to-human)', '**ไม่** (env-to-host เท่านั้น)'],
              ['Source', 'Plants/soil + infected cat', 'Pigeon droppings (env)'],
              ['Transmission', 'Traumatic inoculation', 'Inhalation of basidiospore'],
              ['Forms', 'Cutaneous · Cutaneolymphatic · Disseminated', 'Nasal · Cutaneous · CNS · Systemic'],
              ['Most common form', 'Cutaneous (timeline progression)', 'Nasal — "Roman nose"'],
              ['Test of choice', 'Fungal culture (SDA, room temp)', '**LCAT** antigen test'],
              ['DOC (cat)', '**Itraconazole**', '**Fluconazole**'],
              ['DOC (dog)', '**Potassium iodide**', 'Fluconazole / Itra'],
              ['Tx duration', '≥ 1 month past cure', 'จนกว่า antigen → negative'],
            ] } },
        ],
      },
      {
        heading: 'Sporotrichosis — overview',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.5-9',
        body: [
          'AKA: **Rose gardener\'s disease** / Rosebush mycosis · **Zoonosis**',
          { bullets: [
            'Pathogenic species: **S. schenckii** (ในไทย), S. brasiliensis (Brazil), S. globosa',
            '**Dimorphic fungi** — Mold phase (env, < 30°C) ↔ Yeast phase (in host, 35-40°C)',
            'พบบ่อยในแมว **stray, intact male** (ออกข้างนอก + กัดกัน)',
          ] },
        ],
      },
      {
        heading: 'Sporotrichosis — pathogenesis + 3 clinical forms',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.12-20',
        body: [
          'Transmission: **traumatic inoculation** (จากดิน/พืช) + contact กับแมวติดเชื้อ',
          'เรียงตาม timeline: Cutaneous → Cutaneolymphatic → Disseminated',
          { table: {
            headers: ['Form', 'ลักษณะ'],
            rows: [
              ['1. Cutaneous', 'Ulcerative-nodular lesions ที่ผิวหนัง (head, limb, ear, tail) · multifocal ได้จาก hematogenous spread'],
              ['2. Cutaneolymphatic', 'Lesion + regional lymphangitis/lymphadenitis (LN ตามระบายน้ำเหลือง · biopsy/necropsy พบเชื้อ)'],
              ['3. Disseminated', 'Liver + lung + multi-organ · systemic non-specific (lethargy, anorexia, fever) · มัก FIV+'],
            ] } },
          { callout: 'FIV+ cats รักษาได้ — แต่หายช้ากว่าปกติ (เพราะภูมิตก ไม่ใช่ตัวเชื้อโดยตรง)', kind: 'tip' },
        ],
      },
      {
        heading: 'Sporotrichosis — diagnosis',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.22-32',
        body: [
          { sub: 'Cytology — quick',
            body: [
              { bullets: [
                'Sample: impression smear from ulcerative wound + FNA from nodule',
                'Stain: **Romanowsky** (Diff-Quik)',
                'Yeast: **oval / tear-drop** · single round pink nucleus · blue cytoplasm · non-staining cell wall · 2-5 μm + 1 μm clear capsule',
                'มักเจอใน **macrophage**',
              ] },
            ] },
          { sub: 'Fungal culture — confirmatory',
            body: [
              { bullets: [
                'Best: **deep area ของ ulcer** (กัน contamination) · exudate · เลือด (disseminated form)',
                'Media: **Sabouraud Dextrose Agar (SDA)** ที่ room temp',
                'Colony: off-white → dark brown/black hyphal',
              ] },
            ] },
        ],
      },
      {
        heading: 'Sporotrichosis — treatment',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.33-39',
        body: [
          { table: {
            headers: ['Drug', 'Dose', 'Note'],
            rows: [
              ['**Itraconazole** ⭐', '5-10 mg/kg q24h PO', '**TOC ในแมว** · ต่อ 1 เดือน หลัง cure · monthly liver enzyme'],
              ['Ketoconazole', '10 mg/kg q24h PO', 'ใช้ในสุนัข · **ห้ามในแมว** (hepatotoxicity รุนแรง)'],
              ['Terbinafine', '30 mg/cat q24h PO', 'Combined with Itraconazole'],
              ['Fluconazole', '50 mg/cat q24h PO', 'Combined with Itraconazole'],
              ['Amphotericin B (IV)', '0.25-0.5 mg/kg in 5% dextrose IV q48h', 'Disseminated form · diluted infusion 4-6 hr · **nephrotoxic**'],
              ['Amphotericin B (IL)', '1 mg/kg q1wk intralesional', 'Localized lesion'],
              ['**Potassium iodide** ⭐', '2.5-20 mg/kg q24h PO', '**TOC ในสุนัข** · ในแมวระวัง hepatotoxicity'],
            ] } },
        ],
      },
      {
        heading: 'Cryptococcosis — overview',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.55-60',
        body: [
          { bullets: [
            '**NON-contagious** systemic fungal disease (ต่าง Sporo!)',
            '2 species: **C. neoformans** (พบบ่อยกว่า) + **C. gattii**',
            'Source: ดิน + **มูลนกพิราบ** (basidiospore + desiccated yeast)',
            'Transmission: **inhalation** → nasal cavity (primary site) → CNS / lower resp / systemic',
            'Incubation: เดือน-ปี',
          ] },
        ],
      },
      {
        heading: 'Cryptococcosis — 4 clinical forms',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.61-69',
        body: [
          { table: {
            headers: ['Form', 'ลักษณะเด่น'],
            rows: [
              ['1. Nasal — most common', 'Chronic sinonasal disease · **nasofacial swelling = "Roman nose"** (มักข้างเดียว)'],
              ['2. Cutaneous', 'Multiple dermal/subcutaneous **nodules** · alopecic, **ไม่คัน, ไม่เจ็บ** · regional LN-pathy'],
              ['3. CNS', 'Local spread ผ่าน **cribriform plate** → sudden blindness (optic neuritis), seizures, behavior change'],
              ['4. Systemic', 'Hematogenous spread → meningoencephalomyelitis, uveitis, chorioretinitis, osteomyelitis, polyarthritis, multi-organ'],
            ] } },
          { callout: 'แมวบางตัวเข้าจมูก → ข้ามไป systemic เลย (ไม่จำเป็นต้องเป็น nasal form ก่อน)', kind: 'tip' },
        ],
      },
      {
        heading: 'Cryptococcosis — diagnosis',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.71-79',
        body: [
          { sub: '⭐ Antigen detection — TEST OF CHOICE',
            body: [
              { bullets: [
                '**LCAT (Latex Cryptococcal Antigen agglutination Test)** — high sensitivity',
                'Sample: **serum, CSF, urine**',
                'ใช้ติดตามการรักษาด้วย — ฉีดยาจน antigen → negative',
              ] },
            ] },
          { sub: 'Cytology',
            body: [
              { bullets: [
                'Round / budding **extracellular yeast** ขนาด 4-15 μm (ใหญ่กว่า Sporo)',
                'Surrounded by **clear thick mucopolysaccharide capsule** (clear halo)',
                'Diff-Quik พบ pink-violet ตัวกลม',
              ] },
            ] },
          { sub: 'Histology',
            body: [
              { bullets: [
                'H&E: eosinophilic body + clear halo + pyogranulomatous reaction',
                '**Mayer\'s mucicarmine** — ย้อม **capsule** เฉพาะ (specific!)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cryptococcosis — treatment',
        source: 'Sporotrichosis and Cryptococcosis.pdf p.81-85',
        body: [
          { table: {
            headers: ['Drug', 'Dose', 'Note'],
            rows: [
              ['**Fluconazole** ⭐', '50 mg/cat q12h PO', '**TOC ในแมว (no CNS/systemic)** · กินจน antigen negative · liver monitoring'],
              ['Itraconazole', '5-10 mg/kg q24h PO', 'Oral solution > capsule · liver monitoring'],
              ['Terbinafine', '10 mg/kg q24h PO', 'Use ถ้า resistant to azole'],
              ['**Amphotericin B**', '0.25 mg/kg q48h IV', '**TOC สำหรับ CNS / systemic** · significant nephrotoxicity'],
              ['Flucytosine', '25-50 mg/kg q6h PO', '**Synergistic with Amphotericin** — ห้ามใช้เดี่ยว'],
              ['Surgical excision', '—', 'Skin/nostril granuloma ที่กระทบการใช้ชีวิต'],
            ] } },
          { callout: 'Prognosis แย่: disseminated, lower resp, CNS damage permanent (ตาบอด/ชักไม่หาย แม้ antigen → neg)', kind: 'warn' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'gi-protozoa': {
    topic: 'gi-protozoa',
    title: 'GI Protozoa in Companion Animals',
    lecturer: 'Aj. Woraporn Sukhumavasi',
    icon: '🪱',
    summary: 'Mucosoflagellate (Giardia, T.foetus) vs Coccidia (Cystoisospora, Crypto, Toxo, Neospora, Sarcocystis). Oocyst ratio: 1:2:4 (ทั่วไป) / 1:0:4 (Crypto).',
    sections: [
      {
        heading: 'Classification',
        source: 'GI_protozoa.pdf p.3 + COM V FINAL 86',
        body: [
          { table: {
            headers: ['Group', 'Species', 'Bowel'],
            rows: [
              ['**Mucosoflagellate**', 'Giardia spp., Tritrichomonas foetus, Entamoeba histolytica', 'Giardia: small bowel · T.foetus: **large bowel**'],
              ['**Enteric coccidia**', 'Cystoisospora, Cryptosporidium', 'Small bowel'],
              ['**Tissue cyst-forming coccidia**', 'Toxoplasma, Neospora, Sarcocystis, Hammondia, Besnoitia', 'Small bowel + tissue cyst'],
            ] } },
          { sub: 'Oocyst structure (ratio = oocyst : sporocyst : sporozoite)',
            body: [
              { bullets: [
                '**1 : 2 : 4** — ทั่วไป (Cystoisospora, Toxoplasma, Neospora, Sarcocystis, Hammondia)',
                '**1 : 0 : 4** — **Cryptosporidium** (no sporocyst!)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Giardia',
        source: 'GI_protozoa.pdf p.24-34 + COM V FINAL 86 p.17',
        body: [
          { sub: 'Morphology + biology',
            body: [
              { bullets: [
                '**Trophozoite**: tear-drop, 12-17 × 7-10 μm, **2 nuclei**, ventral sucking disc, 4 pairs of flagella · **falling-leaf motility**',
                '**Cyst**: 9-13 × 7-9 μm, มี 4 nuclei (2 trophozoites inside) — infective stage',
                'Cyst resistant ต่อ disinfectants ส่วนใหญ่ + cool wet env → infectious for months',
                'Assemblages: dog A,B,C,D · cat A,B,F · **A+B = zoonotic**',
              ] },
            ] },
          { sub: 'Pathogenesis',
            body: [
              { bullets: [
                '10-100 cysts → infection in human (low ID)',
                'Loss of microvillus brush border + disaccharidase insufficiency → malabsorption',
                'Disrupt epithelial tight junctions · destruction of enterocytes',
              ] },
            ] },
          { sub: 'Clinical signs (small bowel diarrhea, **self-limiting**)',
            body: [
              { bullets: [
                'Steatorrhea, voluminous, no blood, no straining',
                'Asymptomatic ก็พบได้',
              ] },
            ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                '**Wet fecal mount** (อึสด, ไม่แช่แข็ง) — เห็น trophozoite falling-leaf',
                '**Centrifugal flotation (ZnSO4)** + **Lugol\'s iodine** → cyst with 4 nuclei',
                '**SNAP Giardia / FASTest Giardia Strip** → ELISA ตรวจ **cyst wall protein** (encystation antigen) ในอุจจาระ',
                'Repeat fecal — cyst shed intermittent',
                'ระวัง pseudoparasites: yeast, plant remnants',
              ] },
            ] },
          { sub: 'Treatment (CAPC)',
            body: [
              { bullets: [
                'Dog: **Fenbendazole 50 mg/kg SID × 5 d** ⭐ (CAPC primary) · Metronidazole 22 mg/kg BID × 5 d · combination ดีกว่าเดี่ยว',
                'Cat: **Metronidazole 22-25 mg/kg BID × 5-7 d** (>50 mg/kg/d → CNS toxicity)',
                'Febantel-pyrantel-praziquantel (Drontal Plus) × 3 days',
                'Vaccine ไม่แนะนำ (efficacy ไม่ proven)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Tritrichomonas foetus (in cats)',
        source: 'GI_protozoa.pdf p.16-21 + COM V FINAL 86',
        body: [
          { bullets: [
            '**Mucosoflagellate** · pear-shaped 8-11 × 3-4 μm · **1 nucleus** · 3 anterior flagella + undulating membrane · **NO cyst stage**',
            'Movement: **erratic / jerky** (ต่าง Giardia ที่ falling-leaf)',
            'พบในแมว — densely housed young cats (cattery, shelter)',
          ] },
          { sub: 'Clinical signs',
            body: [
              { bullets: [
                '**Chronic large bowel diarrhea** (weeks/months/years) — มี mucus + fresh blood (hematochezia) ± straining',
                'แมวยังคงกินดี + active + ไม่ผอม',
                'Spontaneous resolution ได้ (อาจถึง 2 ปี)',
              ] },
            ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                'Direct wet fecal mount sensitivity **< 14%** เท่านั้น — ตรวจไม่เจอไม่ได้แปลว่าไม่ติด',
                'Colon flush เพิ่ม sensitivity',
                'Fecal culture **(InPouch TF-Feline)** sensitivity ~55% — gold standard ในการ confirm',
                '**Fecal PCR** — sensitivity สูงสุด',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                '**Ronidazole 30 mg/kg PO q24h × 10 d** — ใช้ caution: **neurologic AE**',
                'ไม่มี approved drug',
                'Sanitation cattery สำคัญ',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cystoisospora (canis/felis)',
        source: 'GI_protozoa.pdf p.7-11',
        body: [
          { bullets: [
            'Apicomplexa enteric coccidia — **1:2:4 ratio** (sporulated)',
            'Pathogenesis: cell lysis ของ enterocyte → small bowel diarrhea (mostly puppy/kitten)',
            'Dx: **centrifugal flotation** (saturated NaCl) — oocyst ขนาดประมาณ ½ ไข่ hookworm',
          ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                'Dog: **Sulfa-Trimethoprim** หรือ **Toltrazuril**',
                'Cat: Sulfa-Trimethoprim',
              ] },
            ] },
          { sub: 'Control (kennel/cattery)',
            body: [
              { bullets: [
                '**Daily fecal removal** ก่อน sporulation (oocyst sporulate เร็ว → ทน disinfectant ทั่วไป)',
                'Disinfectant: **high concentration ammonia**',
                'Steam / pressure washing',
                'Treat all in-contact animals',
                'Prevent predation (paratenic host)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cryptosporidium',
        source: 'GI_protozoa.pdf p.44-46',
        body: [
          { bullets: [
            '**Tiny oocyst 3-5 μm** — เล็กกว่าเม็ดเลือดแดง · **1:0:4 ratio** (no sporocyst!)',
            'Sporulated already in host → **immediate infection** (ไม่ต้อง sporulate ใน env)',
            'Species: **C. canis** (dog), **C. felis** (cat) — rare zoonosis · **C. parvum** (cattle) — major zoonosis (vet students!)',
            'Form parasitophorous vacuole on **brush border** ของ microvillus',
          ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                'Fecal centrifugal flotation **+ concentrated sucrose (SG 1.33)**',
                'Stain: **Modified acid-fast (Ziehl-Neelsen)** หรือ Immunofluorescent',
                'Histopathology: brush border (tips of villi)',
                'Fecal ELISA',
              ] },
            ] },
          { sub: 'Treatment (no specific Tx)',
            body: [
              { bullets: [
                'Cat: **Tylosin** 10-15 mg/kg q8h × 2-3 wk · **Azithromycin** 5-10 mg/kg q12h × 5-7 d',
                'Cat/Dog: **Paromomycin** 150 mg/kg q24h × 5 d — **avoid in bloody stool!** (nephrotoxic)',
                'Nitazoxanide — FDA approved ในคน',
              ] },
            ] },
        ],
      },
      {
        heading: 'Toxoplasma gondii',
        source: 'GI_protozoa.pdf p.36-42',
        body: [
          { bullets: [
            '**Cat = definitive host** (ตัวเดียว!) · warm-blooded animals = intermediate host',
            'Oocyst: **10 × 12 μm** · ratio **1:2:4**',
            '**Cat shed oocyst หลัง primary infection ครั้งเดียวในชีวิต** × 7-10 วัน (millions)',
            'Stages: tachyzoite (acute) ↔ bradyzoite (chronic, in tissue cyst)',
            'Reactivation จาก immunosuppression (AIDS, steroids)',
          ] },
          { sub: 'Clinical signs (cat)',
            body: [
              { bullets: [
                'Fever, dyspnea, icterus, lymphadenopathy',
                'Neuro signs · **chorioretinitis + uveitis**',
                'Pneumonitis, encephalitis, hepatitis, pancreatitis, myocarditis',
                'Prenatal toxo (severe!) > postnatal',
              ] },
            ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                'Direct: fecal flotation (oocyst 10×12 μm) — DDx Besnoitia, Hammondia',
                'PCR: tissue, aqueous humor, blood (positive PCR ≠ active disease)',
                'Histo + IHC: cysts/tachyzoites + anti-Toxoplasma Ab',
                '**Serology** — most frequently used clinically (MAT, IFA, ELISA, latex agglutination)',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                '**Clindamycin** ⭐ first line · ± Sulfonamide/Trimethoprim',
              ] },
            ] },
          { sub: 'Host pairing (memorize!)',
            body: [
              { table: {
                headers: ['Parasite', 'Definitive', 'Intermediate'],
                rows: [
                  ['Toxoplasma gondii', '**Cat**', 'Warm-blooded animals (incl. human)'],
                  ['Neospora caninum', '**Dog**', 'Ruminant'],
                  ['Sarcocystis spp.', 'Carnivore (predator)', 'Prey (specific to species)'],
                ],
              } },
            ] },
        ],
      },
      {
        heading: 'Differentiating bowel diarrhea',
        source: 'GI_protozoa.pdf overview',
        body: [
          { table: {
            headers: ['Feature', 'Small bowel', 'Large bowel'],
            rows: [
              ['Frequency', 'Mild ↑', '**Marked ↑**'],
              ['Volume per pass', 'Voluminous', 'Small'],
              ['Mucus', 'Rare', '**Common**'],
              ['Fresh blood (hematochezia)', 'Rare', '**Common**'],
              ['Straining (tenesmus)', 'No', '**Yes**'],
              ['Steatorrhea', 'Possible', 'No'],
              ['Weight loss', 'Often', 'Rare (T. foetus = ภาวะดี)'],
              ['Common protozoa', 'Giardia, Cystoisospora, Crypto', '**T. foetus**'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  rabies: {
    topic: 'rabies',
    title: 'Rabies — โรคพิษสุนัขบ้า',
    lecturer: 'Aj. Vachira Hunprasit',
    icon: '🦇',
    summary: 'Lyssavirus (Rhabdoviridae), zoonotic, fatal · 3 phases (prodromal/excitative/paralytic) · DFA = main Dx · prevention only · 3 ป + 5 ย.',
    sections: [
      {
        heading: 'Overview',
        source: 'Rabies.pdf p.1-6 + COM V FINAL 86 p.23',
        body: [
          { bullets: [
            'Family **Rhabdoviridae**, Genus **Lyssavirus**, bullet-shaped, ssRNA, enveloped',
            'Zoonosis ที่ฆ่า — เป็นแล้วตายสถานเดียว · ป้องกันได้แต่ **รักษาไม่ได้**',
            'ภายใต้ พรบ.โรคระบาดสัตว์ + พรบ.โรคพิษสุนัขบ้า (ของตัวเอง)',
            'ไทย = endemic (with control) · top 2 จังหวัด: **อุบลราชธานี + ชลบุรี**',
            'Distribution: **Dogs ~91% · Cats ~2% · others (rabbit, bat, rat, cattle) ~7%**',
            '**World Rabies Day = 28 กันยายน** (วันตายของ Louis Pasteur)',
          ] },
        ],
      },
      {
        heading: 'Transmission + pathogenesis',
        source: 'Rabies.pdf p.7-9',
        body: [
          { sub: 'Transmission routes',
            body: [
              { bullets: [
                '**Bite exposure** (หลัก) — viral load สูงในน้ำลาย',
                '**Non-bite**: scratch (เลีบที่เลีย), lick to MM/wound, **trans-placenta**',
                'Human-to-human: rare, ผ่าน **organ/cornea transplant**',
              ] },
            ] },
          { sub: 'Pathogenesis',
            body: [
              'Bite → **virus replicate ใน muscle** → **centripetal/retrograde** ขึ้น nerve → spinal cord → brain',
              '→ **centrifugal/anterograde** ลงไป **salivary gland** → shedding 1-7 วันก่อนแสดงอาการ',
            ] },
        ],
      },
      {
        heading: 'Clinical signs — 3 phases',
        source: 'Rabies.pdf p.10',
        body: [
          { table: {
            headers: ['Phase', 'อาการ'],
            rows: [
              ['1. Prodromal (1-2 วัน)', '**พฤติกรรมเปลี่ยน**'],
              ['2. Excitative (1-7 วัน)', '**ดุร้าย / บ้าคลั่ง** (furious form)'],
              ['3. Paralytic', '**อัมพาต / ตาย** ("หมาหางตก น้ำลายฟูมปาก")'],
            ] } },
        ],
      },
      {
        heading: 'Diagnosis',
        source: 'Rabies.pdf p.12-18',
        body: [
          { sub: 'Post-mortem (routine)',
            body: [
              { bullets: [
                '**DFA (Direct Fluorescent Antibody)** — main routine method, **ภายในวันเดียว** (สถานเสาวภา)',
                'Sample: **brain impression smear**',
                'Histopathology: **Negri bodies** (intracytoplasmic eosinophilic inclusion) — เจอ = positive แต่ไม่เจอ ≠ negative',
              ] },
            ] },
          { sub: 'Antemortem (สัตว์มีชีวิต)',
            body: [
              { bullets: [
                '**6 criteria for rabies in living dog** (Tepsumethanon et al., J Med Assoc Thai 2005;88:419-22)',
                'Rabies test kit (saliva): sens/spec ไม่สูง + เก็บน้ำลายเสี่ยง',
                'ในคน: ใช้ DFA on skin biopsy + RT-PCR',
              ] },
            ] },
        ],
      },
      {
        heading: 'Prevention — pre-exposure (Thai Rabies CPG)',
        source: 'Rabies.pdf p.20 + Vaccination_guideline.pdf p.30',
        body: [
          { sub: 'สุนัข/แมวอายุ < 4 เดือน',
            body: [
              { bullets: [
                '2 เข็ม: เริ่ม **อายุ 12 wk** → ซ้ำห่าง 2-4 wk',
                'บูสเตอร์ที่อายุ 1 ปี → จากนั้น **ทุกปี (annual)**',
                'ปีแรก แนะนำใช้ **monovalent rabies** (กระตุ้น Ab สูงกว่า polyvalent)',
              ] },
            ] },
          { sub: 'อายุ > 4 เดือน',
            body: [
              { bullets: [
                '2 เข็ม ห่างกัน 2-4 wk → annual booster',
              ] },
            ] },
        ],
      },
      {
        heading: 'Post-exposure — สัตว์',
        source: 'Rabies.pdf p.21',
        body: [
          { table: {
            headers: ['Status สัตว์', 'การจัดการ'],
            rows: [
              ['ไม่เคยวัคซีน / ไม่ทราบประวัติ', '**Euthanize** หรือ restricted quarantine **180 วัน**'],
              ['Vaccine ครบโปรแกรม', 'ฉีดกระตุ้น + monitor **45 วัน**'],
              ['เคยวัคซีน แต่ขาดช่วง (out-of-date)', '**Booster + observe 45 วัน** (Moore JAVMA 2015 — anamnestic response เหมือน up-to-date)'],
            ] } },
        ],
      },
      {
        heading: 'Animal management — สัตว์ที่กัดคน',
        source: 'Rabies.pdf p.23',
        body: [
          { table: {
            headers: ['สถานการณ์', 'การจัดการ'],
            rows: [
              ['สัตว์ดูปกติ (มีเจ้าของ)', '**ขังกรงดูอาการ 10 วัน** · ห้ามฉีดวัคซีนทับ (สับสนกับ adverse effect)'],
              ['สัตว์ป่วย', '**Euthanize + ส่งตรวจ** (DFA brain)'],
              ['ไม่มีเจ้าของ', '**Euthanize + ส่งตรวจ**'],
            ] } },
        ],
      },
      {
        heading: 'Post-exposure — คน (WHO/Thai categories)',
        source: 'Rabies.pdf p.21',
        body: [
          { table: {
            headers: ['ระดับ', 'ลักษณะ', 'การปฏิบัติ'],
            rows: [
              ['1', 'ถูกต้องตัว · ถูกเลียที่ผิวหนังปกติ', 'ล้างผิวหนัง · **ไม่ต้องฉีดวัคซีน**'],
              ['2', 'งับเป็นรอยช้ำ · ข่วนเป็นรอยถลอก · ถูกเลียโดน MM/แผล', 'ล้าง+รักษาแผล · **ฉีดวัคซีน**'],
              ['3', 'ฟันแทงทะลุ + เลือดออก · ข่วนผิวหนังขาด · น้ำลาย/สารคัดหลั่งโดนเยื่อบุตา/ปาก/จมูก/แผลลึก', 'ล้าง+รักษา · **วัคซีน + immunoglobulin** โดยเร็วที่สุด'],
            ] } },
          { sub: 'Wound care',
            body: [
              { bullets: [
                'Wash with **soap solution หรือ QUAT**',
                'Apply ethanol / povidone iodine',
                '**ห้าม** ใช้รองเท้าตบแผล / พอกแผลด้วยสมุนไพร (ตามความเชื่อ)',
              ] },
            ] },
        ],
      },
      {
        heading: 'หลัก 3 ป + คาถา 5 ย',
        source: 'Rabies.pdf p.27 + COM V FINAL 86 p.24',
        body: [
          { sub: '3 ป — Prevention',
            body: [
              { bullets: [
                '**ป้องกันสัตว์เป็นโรค** — vaccine + ทำหมันคุมประชากร + ตาย→ส่งตรวจ',
                '**ป้องกันการถูกกัด**',
                '**ป้องกันหลังถูกกัด** — ล้างแผล / ใส่ยา / กักหมา / หาหมอ / ฉีดวัคซีนให้ครบ',
              ] },
            ] },
          { sub: '5 ย — สอนเด็ก',
            body: [
              { bullets: [
                '**อย่าแหย่** · **อย่าแยก** · **อย่าเหยียบ** · **อย่ายุ่ง** · **อย่าหยิบ**',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  vaccine: {
    topic: 'vaccine',
    title: 'Pet Vaccination Guidelines (WSAVA 2024 / VPAT 2024)',
    lecturer: 'Prof. Sanipa Suradhat',
    icon: '💉',
    summary: 'WSAVA 2024 + VPAT 2024 ใหม่: Lepto + FeLV เป็น core (with conditions). 6-mo booster แทน 1-yr. Out-of-date → booster + 45 วัน (ไม่ใช่ euthanize).',
    sections: [
      {
        heading: 'WSAVA 2024 highlights',
        source: 'Vaccination_guideline.pdf p.3 (Squires et al. JSAP 2024;65:277-316)',
        body: [
          { bullets: [
            '**Vaccine categories ใหม่:**',
            '— **Core**: ALL animals ต้องฉีด (revised definition)',
            '— **Non-core (Optional)**: highly recommended ตาม geographical/lifestyle risk',
            '— **Not recommended**: insufficient scientific evidence',
            'เพิ่ม **Leptospirosis + FeLV** เป็น core สำหรับ population เฉพาะ',
            '**Booster เข็มแรก: 6 เดือน** (ไม่ใช่ 1 ปีเหมือนเดิม)',
            'จากนั้น revaccinate **ทุก 3 ปี** (low-risk) / **ทุกปี** (high-risk)',
            'Encourage annual health check + **support serological titer testing** (≥ 20 wks)',
            'แยก program สำหรับ **shelter / sanctuary**',
          ] },
        ],
      },
      {
        heading: 'Canine vaccines summary (WSAVA 2024)',
        source: 'Vaccination_guideline.pdf p.7-16',
        body: [
          { table: {
            headers: ['Category', 'Vaccines'],
            rows: [
              ['**Core (always)**', 'CDV, CPV, CAV-2'],
              ['**Core with conditions**', 'Rabies (endemic) · Leptospirosis (endemic + known serogroups + suitable vaccines)'],
              ['Non-core (optional)', 'CaPiV, B. bronchiseptica, B. burgdorferi, Canine influenza (H3N8/H3N2), Leishmaniosis, Canine herpesvirus-1'],
              ['Not recommended', 'Killed CPV, CCoV, Giardia, Microsporum canis'],
            ] } },
        ],
      },
      {
        heading: 'Feline vaccines summary (WSAVA 2024)',
        source: 'Vaccination_guideline.pdf p.20-23',
        body: [
          { table: {
            headers: ['Category', 'Vaccines'],
            rows: [
              ['**Core (always)**', 'FPV, FHV, FCV'],
              ['**Core with conditions**', 'Rabies (endemic) · FeLV (endemic + < 1 yr or older with risk + FeLV-negative)'],
              ['Non-core', 'B. bronchiseptica, C. felis, FIV'],
              ['Not recommended', 'FIP, Giardia, Microsporum canis'],
            ] } },
        ],
      },
      {
        heading: 'VPAT 2024 (ไทย) — ความต่างจาก WSAVA',
        source: 'Vaccination_guideline.pdf p.25-34 + COM V FINAL 86 p.34',
        body: [
          { bullets: [
            'Launched: 12 มิ.ย. 2024 ที่ VRVC',
            '**Cat FeLV**: VPAT ใช้ **< 2 ปี** (WSAVA ใช้ < 1 ปี)',
            'Booster แรก: 6 เดือน เหมือน WSAVA',
            'ความต่อเนื่อง: VPAT แนะนำ **เข็มกระตุ้น 1 ปี (1 ขวบครึ่ง)** → annually หรือ q3y (WSAVA q3y เลย)',
          ] },
        ],
      },
      {
        heading: 'Canine puppy schedule (WSAVA 2024 / VPAT 2024)',
        source: 'Vaccination_guideline.pdf p.9, 32',
        body: [
          { sub: 'Core (CDV, CPV, CAV-2)',
            body: [
              { bullets: [
                'Start no earlier than **6 wks** (suggested 8 wks)',
                'Revaccinate **q3-4 wks until 16 wks of age**',
                'High-risk: ต่อจน 20 wks · q2-3 wks',
                'Booster: **6 months of age** (เปลี่ยนจาก 12-16 mo)',
                'Then: 3 yrs intervals',
              ] },
            ] },
          { sub: 'Rabies',
            body: [
              { bullets: [
                'Start **12 wks** · 2nd dose 2-4 wks later',
                '**1 yr booster → annual**',
                'ปีแรก: monovalent rabies > polyvalent',
              ] },
            ] },
          { sub: 'Leptospirosis (Thai context)',
            body: [
              { bullets: [
                'Start **8 wks** · 2nd dose 2-4 wks later · annual booster',
                '⚠️ Top 5 Thai serogroups: **Sejroe, Icterohaemorrhagiae, Bataviae, Canicola, Australis** (Altheimer 2020)',
                '⚠️ Commercial vaccines (2-/4-serovar) **ไม่ครอบคลุม Sejroe + Bataviae** ที่เป็นกลุ่มหลัก!',
              ] },
            ] },
          { callout: 'Top 3 breeds เกิด VAE: French Bulldog, Dachshund, Boston Terrier · ≤ 5 kg · young · multiple vaccines · 25% เพิ่มต่อวัคซีนเข็มที่เพิ่ม', kind: 'warn' },
        ],
      },
      {
        heading: 'Feline kitten schedule',
        source: 'Vaccination_guideline.pdf p.21-22',
        body: [
          { sub: 'Core (FPV, FHV, FCV)',
            body: [
              { bullets: [
                'Start **6-8 wks** · q3-4 wks until 16 wks',
                'Booster 6 months · then q3 yrs (low-risk) or annual (high-risk)',
              ] },
            ] },
          { sub: 'FeLV (with conditions)',
            body: [
              { bullets: [
                '**ตรวจ FeLV-ve ก่อนฉีดเสมอ** — ฉีด FeLV+ cat = ไม่มีประโยชน์',
                'Start **8 wks** · 2nd dose 3-4 wks later',
                'Annual revaccination ใน high-risk (ปล่อยอิสระ, multi-cat)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Out-of-date rabies post-exposure (anamnestic response)',
        source: 'Vaccination_guideline.pdf p.12 (Moore et al. JAVMA 2015;246:205-211)',
        body: [
          'สุนัข/แมว ที่เคยฉีดแต่ขาดช่วง → โดน rabid animal กัด',
          { callout: 'แนวทางใหม่: **booster vaccine ทันที + observe 45 วัน** (เหมือน up-to-date) — **ไม่ใช่ euthanize หรือ quarantine 6 เดือน**', kind: 'tip' },
          'เหตุผล: anamnestic Ab response ของสัตว์ที่เคยฉีด เหมือน up-to-date (ไม่ว่านานแค่ไหน)',
        ],
      },
      {
        heading: 'Window of susceptibility (CPV)',
        source: 'Vaccination_guideline.pdf p.4 (Pollock & Carmichael 1982)',
        body: [
          'MDA decay graph: HI titer drop ตามอายุ',
          { bullets: [
            '**HI ≥ 80**: protective (MDA ป้องกันได้ + อาจ neutralize vaccine)',
            '**HI ≤ 10**: ไม่ interfere vaccine แต่ไม่ป้องกันโรค',
            '**Window** = ช่วง MDA ลดต่ำกว่า protective แต่ยัง interfere vaccine',
            '→ **ฉีดซ้ำ q2-4 wk จน 16 wk** เพื่อคล่อม window นี้',
          ] },
        ],
      },
      {
        heading: 'Protective antibody titers (canine)',
        source: 'Vaccination_guideline.pdf p.10 (Gonzalez 2023)',
        body: [
          { table: {
            headers: ['Antigen', 'Protective titer'],
            rows: [
              ['CDV', '≥ 32 (1:32)'],
              ['CAV-2', '≥ 16 (1:16)'],
              ['CPV', '≥ 80 (1:80)'],
            ] } },
          'ที่ > 5 ปีหลังวัคซีน: 62% (CDV) ถึง 92% (CAV2/CPV) ยัง protective titer',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'feline-uri': {
    topic: 'feline-uri',
    title: 'Feline Upper Respiratory Infection (FURI / FRDC)',
    lecturer: 'Aj. Nattawan Tangmahakul',
    icon: '🐈',
    summary: '5 pathogens (FCV/FHV-1/Mycoplasma/B.bronch/C.felis). Doxy 1st line. Famciclovir 90 mg/kg q8-12h สำหรับ FHV-1. Vaccine ลด severity แต่ไม่ป้องกัน 100%.',
    sections: [
      {
        heading: 'Overview',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.4-5 + COM V FINAL 86 p.27',
        body: [
          { bullets: [
            'FRDC = **Acute upper respiratory or ocular disease** จาก 1 หรือหลาย pathogens',
            '**Multifactorial** disease — pathogen + host immunity + environment',
            '**Morbidity ≫ Mortality** (ติดง่าย แต่ตายไม่บ่อย)',
            'Incubation: **2-10 วัน**',
            'อาการ: 5-10 วัน (uncomplicated) · 6 wk (severe ในลูก/แก่/ภูมิตก)',
            'Transmission: direct contact + respiratory droplets + fomites + owners/caregivers',
            'พบบ่อยใน shelter, cattery, multi-cat household',
            '**No way to eradicate** → minimize transmission + manage infections',
          ] },
        ],
      },
      {
        heading: '5 pathogens — overview',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.6-11',
        body: [
          { table: {
            headers: ['Pathogen', 'Type', 'Key feature'],
            rows: [
              ['**FCV** (Feline Calicivirus)', 'ssRNA, non-env', 'Oral vesico-erosive lesions · limping syndrome · FCGS · stable in env'],
              ['**FHV-1** (Feline Herpesvirus-1)', 'dsDNA, env', '**Dendritic corneal ulcer** · latent in **trigeminal ganglia + cornea**'],
              ['**Mycoplasma felis**', 'Bacteria (no cell wall)', 'Normal flora ของ URT · culture ยาก · conjunctivitis'],
              ['**Chlamydia felis**', 'Obligate intracellular G-neg', '**Conjunctivitis (chemosis)** เด่น · shed via ocular secretion 60 d'],
              ['**Bordetella bronchiseptica**', 'Aerobic G-neg', '**Cough เด่น** · ติดจากสุนัขได้ · **zoonotic** (immunocompromised owner)'],
            ] } },
          { callout: 'Combinations พบบ่อย → severity เพิ่ม · 80-90% ไม่ต้อง identify เชื้อในการรักษา', kind: 'tip' },
        ],
      },
      {
        heading: 'FCV — details',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.7-8, 22-25',
        body: [
          { bullets: [
            'ssRNA non-enveloped · **high mutation rate** → vaccine ไม่ครอบคลุมทุก strain',
            'Replicate ใน oropharynx + transient viremia',
            'Shed via respiratory + oral + ocular secretion · ~1 wk หลังติดเชื้อ (intermittent ตลอดชีวิตได้)',
          ] },
          { sub: 'Classical signs',
            body: [
              { bullets: [
                '**Vesico-erosive lesions** ที่ oral mucosa + URT',
                'Hypersalivation, fever, conjunctivitis',
                '**Limping syndrome** = transient fever + alternating leg lameness · มักหลังฉีด FCV vaccine ที่อายุ 6-12 wk · self-resolve 4-5 d',
                'Pneumonia ในลูกแมว (severe)',
                '**Feline chronic gingivostomatitis (FCGS)**',
              ] },
            ] },
          { sub: 'VS-FCV (Virulent Systemic FCV)',
            body: [
              { bullets: [
                'Mutant strain · core vaccine **ไม่ป้องกัน**',
                '**Mortality 30-70%** · รุนแรงใน adult > kitten',
                'Severe vasculitis → cutaneous edema (head + limbs)',
                'Crusts/ulcers (philtrum, palate, tongue, lip commissure)',
                'Hepatic necrosis · pancreatitis · DIC · sepsis',
                'Confirm: IHC of FCV ใน internal organs (necropsy)',
              ] },
            ] },
        ],
      },
      {
        heading: 'FHV-1 (Feline Viral Rhinotracheitis) — details',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.6, 20-21',
        body: [
          { bullets: [
            'dsDNA enveloped — **easily killed by disinfectants** (ต่าง FCV ที่ทน)',
            'Replicate ใน cold mucosa: URT, ocular epithelium, neurons',
            'Latency: **trigeminal ganglia + cornea** · stress → reactivation',
            'Shed via ocular/nasal/oral secretion',
          ] },
          { sub: 'Classical signs',
            body: [
              { bullets: [
                'Sneezing, nasal discharge, congestion, stertor, fever',
                'Conjunctivitis, hyperemia, chemosis, ocular discharge (อาจเลือดปน)',
                '**Dendritic corneal ulceration ⭐** (pathognomonic!)',
                'Stromal keratitis · chronic rhinosinusitis (turbinate damage permanent)',
                'Ulceration on lips/nares (cytolysis)',
                'Adult: recrudescent — milder',
                'Kitten: severe — tracheitis, pneumonia',
              ] },
            ] },
        ],
      },
      {
        heading: 'Diagnosis',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.31-33',
        body: [
          { bullets: [
            'History + signalment + clinical signs (kitten + acute URT signs ± conjunctivitis)',
            'Mixed infection → mixed lesion',
            '**ปกติไม่ต้อง identify เชื้อ** — supportive Tx เหมือนกัน',
            'Identify เมื่อ: outbreak ใน shelter / cattery, severe/persistent, antibiotic resistance',
          ] },
          { sub: 'Sampling',
            body: [
              { bullets: [
                'Oropharyngeal / conjunctival swab → PCR',
                'Bacterial culture · cytology · serum Ab',
                'VS-FCV: necropsy → IHC',
              ] },
            ] },
          { callout: 'FCV และ FHV-1 พบใน healthy cat ก็ได้ — เจอเชื้อ ≠ ป่วย', kind: 'tip' },
        ],
      },
      {
        heading: 'Treatment',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.35-40 + COM V FINAL 86 p.28',
        body: [
          { sub: 'Supportive (key!)',
            body: [
              { bullets: [
                '**Appetite stimulant**: Mirtazapine, Cyproheptadine',
                'Aromatic warm soft food · esophagostomy tube ใน severe',
                'Rehydration: parenteral crystalloid (NSS, ACETAR)',
                'Unblock nose: clean discharge + saline nebulization + nasal flush',
                'Analgesia สำหรับ oral ulcer',
              ] },
            ] },
          { sub: 'Antimicrobial',
            body: [
              { bullets: [
                '**Doxycycline 10 mg/kg PO q24h × 7-10 d** ⭐ — 1st line, ครอบคลุม Mycoplasma + Bordetella + C. felis',
                'C. felis: doxycycline ≥ 4 wks',
                '**Amoxicillin-clavulanate** — สำหรับ 2° infection · **ineffective** ต่อ Mycoplasma + C. felis',
                'Azithromycin → Mycoplasma',
                'Pradofloxacin (oral suspension) — safer in cats',
                '⚠️ **Enrofloxacin > 5 mg/kg → retinopathy / blindness** ในแมว',
                '⚠️ ห้าม Cefazolin/Cefadroxil/Cephalexin ใน FRDC (ineffective ต่อ Bordetella + Myco + C. felis)',
              ] },
            ] },
          { sub: 'Antiviral (FHV-1)',
            body: [
              { bullets: [
                '**Famciclovir 90 mg/kg PO q8-12h × 7-21 d** ⭐ — safe ในแมว · ใช้ต่อ 1 wk หลังหาย',
                'Ophthalmic: **Cidofovir q12** · Trifluridine q4 (eye irritation) · Idoxuridine q4',
                'Acyclovir, Ribavirin = **toxic** ในแมว (อย่าใช้)',
              ] },
            ] },
          { sub: 'Adjunctive',
            body: [
              { bullets: [
                '**L-lysine** · Vitamin A, B-complex',
                'Recombinant feline interferon-ω · human IFN-α (immunomodulatory)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Differential by feature',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.29',
        body: [
          { table: {
            headers: ['Feature', 'Pathogen เด่น'],
            rows: [
              ['Dendritic corneal ulcer', '**FHV-1**'],
              ['Oral ulcer + limping syndrome', '**FCV**'],
              ['VS-FCV (cutaneous edema, DIC)', '**FCV (virulent strain)**'],
              ['Chemosis, ocular > respiratory', '**Chlamydia felis**'],
              ['Cough เด่น + zoonotic', '**Bordetella bronchiseptica**'],
              ['Severe pneumonia', 'Mycoplasma · Bordetella · severe FHV-1'],
            ] } },
        ],
      },
      {
        heading: 'Vaccination + management',
        source: 'Feline_Upper_Respiratory_Infection.pdf p.41-44',
        body: [
          { bullets: [
            'Core: **FPV + FHV-1 + FCV** (วัคซีนรวม)',
            'Non-core (selectively): C. felis, B. bronchiseptica',
            'Vaccine ลด severity + transmission แต่**ไม่ป้องกัน infection / shedding 100%**',
            'FCV multiple strains → vaccine ไม่ครอบคลุมทุก strain',
            '**MLV ห้ามใน FeLV/FIV/pregnant** → ใช้ inactivated แทน',
            'Schedule: 6-9 wk · q3-4 wk จน 16 wk · annual',
            'Intranasal MLV → mucosal IgA, rapid onset, อาจมี mild respiratory signs',
          ] },
          { sub: 'Disinfection',
            body: [
              { bullets: [
                'FCV ทน chlorhex/QUAT/alcohol → ต้องใช้ **1:32 of 5.25% NaOCl (bleach)** หรือ accelerated H₂O₂',
              ] },
            ] },
          { sub: 'Population',
            body: [
              { bullets: [
                'Quarantine แมวใหม่ 1-2 wks ก่อนเข้าฝูง · ฉีดวัคซีนแมวในฝูงก่อน',
                'Stress reduction: feline pheromones (Feliway), hiding places, group compatible cats',
              ] },
            ] },
        ],
      },
    ],
  },
};
