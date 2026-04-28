// ============================================================
// Exotic Study Notes — Final exam scope (week 7-14)
// ============================================================
// อ้างอิง:
//   - Slide Lecture 2026: ZOO_VET_CU2026.pdf · RolesVeterinarians.pdf
//     · ABOARD POST-GRADUATE Wildlife COURSES.pdf · โรคไม่ติดเชื้อ.pptx
//     · โรคติดเชื้อ.pptx · การรักษานกสวยงาม.pptx
//   - EXOTIC FINAL 86 เส้นแดงคือรวมโพย .pdf (master compilation)
//   - course syllabus.docx (รหัส 3107414 · ผศ.น.สพ. ธวัช เล็กดำรงศักดิ์)
//
// Body item types:
//   string                                — paragraph
//   { bullets: [string|{label,value}] }    — bulleted list
//   { sub, body }                          — sub-section
//   { table: { headers, rows } }            — table
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
//
// Midterm scope (week 1-6: turtle/hamster/rabbit/sugar glider/chicken)
// — รอเก็บปิดเทอม
// ============================================================

export const NOTES_EXOTIC = {
  // ─────────────────────────────────────────────────────────────
  'bird-noninfect': {
    topic: 'bird-noninfect',
    title: 'นกสวยงาม + โรคไม่ติดเชื้อในนก',
    lecturer: 'ธวัช เล็กดำรงศักดิ์',
    icon: '🦜',
    summary: 'Handling, blood collection, anesthesia, husbandry-related diseases (Vit A/D, MBD), feather plucking, crop stasis · พื้นฐานก่อนเรียน infectious diseases',
    sections: [
      {
        heading: 'Handling + Blood Collection',
        source: 'การรักษานกสวยงาม.pptx + EXOTIC FINAL 86',
        body: [
          { bullets: [
            'จับนกใช้ผ้าขนหนู คลุมหัว → ลด stress · ระวัง keel ไม่ให้กดหายใจ',
            'เจาะเลือดได้ที่ **ปีก (basilic vein)** · **คอ (jugular vein)** · **ขา (medial metatarsal)**',
            'ห้ามเจาะลิ้น/หัว/หาง · ปริมาณเลือด ≤ 1% body weight',
          ] },
        ],
      },
      {
        heading: 'Anesthesia',
        source: 'การรักษานกสวยงาม.pptx',
        body: [
          { bullets: [
            '**Isoflurane** = drug of choice · safety ดี · rapid induction + recovery',
            '**Fasting**: นกตัวเล็ก 2-3 ชม. (อดนานเสี่ยง hypoglycemia เพราะ BMR สูง)',
            'นกตัวใหญ่ (raptor, parrot) อด 6-12 ชม.',
          ] },
        ],
      },
      {
        heading: 'Nutritional / Husbandry Diseases',
        source: 'โรคไม่ติดเชื้อ.pptx + EXOTIC FINAL 86',
        body: [
          { sub: 'Vitamin A deficiency',
            body: [
              { bullets: [
                'Squamous metaplasia of epithelium → plaque ใน oropharynx + cloaca',
                'พบบ่อยในนกที่กิน seed-only diet · แก้โดยให้ pellet + vegetable',
              ] },
            ] },
          { sub: 'Metabolic Bone Disease (MBD)',
            body: [
              'Vit D3/Ca deficiency → soft bones · พบในนกที่ไม่ได้รับ UVB หรือ Ca ไม่พอ',
              'แก้: UVB exposure + Ca supplement + balanced diet',
            ] },
          { sub: 'Hypocalcemia (African Grey ที่พบบ่อย)',
            body: [
              'African Grey ไวต่อ low Ca · seizure · ตอบสนองดีต่อ Ca gluconate IV',
            ] },
        ],
      },
      {
        heading: 'Crop Stasis (delayed crop emptying)',
        source: 'การรักษานกสวยงาม.pptx',
        body: [
          { bullets: [
            'Crop ไม่ลด → palpate มีอาหารค้าง > 4 ชม. (parent-fed) หรือ > 12 ชม. (adult)',
            'Causes: hypothermia, poor crop motility, infection, foreign body',
            'Tx: warming + IV fluid + **Metoclopramide** (motility) + soft diet/syringe feed',
          ] },
        ],
      },
      {
        heading: 'Cloacal Papilloma',
        source: 'โรคไม่ติดเชื้อ.pptx + EXOTIC FINAL 86',
        body: [
          { bullets: [
            'Mass-like lesion ที่ cloaca · associated กับ **Herpesvirus + Papillomavirus**',
            '**Diagnosis**: 5% acetic acid → tissue เปลี่ยนสีขาว (acetowhite test)',
            '**Treatment**: Silver nitrate (AgNO₃) จี้ chemical cauterization · อาจ recur',
            'พบบ่อยใน New World psittacine (macaw, conure)',
          ] },
        ],
      },
      {
        heading: 'Feather Plucking / Self-mutilation',
        source: 'โรคไม่ติดเชื้อ.pptx',
        body: [
          'Multifactorial — ต้อง rule out medical ก่อนเหมา behavior',
          { bullets: [
            'Medical: skin disease (PBFD, mites, infection), nutritional, hormonal',
            'Behavioral: boredom, stress, sexual frustration, abusive history',
            'Workup: PCR (PBFD/Polyoma), CBC, biochem, environmental review',
          ] },
        ],
      },
      {
        heading: 'Ectoparasites — Knemidocoptes',
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            'Scaly leg / scaly face mite · พบบ่อยใน budgerigar (parakeet)',
            'Burrows ในผิวหนัง → hyperkeratotic crust',
            'Tx: **Ivermectin** topical/SC · repeat 2-week interval',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'bird-infect': {
    topic: 'bird-infect',
    title: 'โรคติดเชื้อในนก (Viral / Bacterial / Fungal / Protozoal)',
    lecturer: 'ธวัช เล็กดำรงศักดิ์',
    icon: '🦠',
    summary: 'Pacheco / PDD / PBFD / Polyoma / Pox + Chlamydophila + Candida + Trichomonas + Giardia + Eimeria · เป็นหัวใจ Final scope (สัปดาห์ 9-11 · 3 weeks)',
    sections: [
      {
        heading: 'Viral Diseases — Top 5 ที่ออกข้อสอบบ่อย',
        source: 'โรคติดเชื้อ.pptx + EXOTIC FINAL 86',
        body: [
          { table: {
            headers: ['Disease', 'Virus', 'Inclusion', 'Tx', 'Vaccine'],
            rows: [
              ['Pacheco\'s', 'Psittacid Herpesvirus (PsHV)', 'Intranuclear', 'Acyclovir', '❌'],
              ['PDD', 'Avian Bornavirus (ABV)', 'Lymphoplasmacytic infiltrate', 'Supportive (NSAIDs)', '❌'],
              ['PBFD', 'Beak & Feather Disease Virus (Circovirus)', 'Intracytoplasmic', 'Supportive', '❌'],
              ['Polyoma', 'Avian Polyomavirus', 'Intranuclear', 'Supportive', '✅ available'],
              ['Avian Pox', 'Poxvirus', 'Bollinger bodies (cytoplasmic)', 'Supportive', '✅ Fowl pox'],
            ],
          } },
          { callout: '💡 PCR ใช้ confirm ทุกตัวยกเว้น Pox (ทำได้แต่ไม่นิยม) · ดู feather/blood/cloacal swab',
            kind: 'tip' },
        ],
      },
      {
        heading: "Pacheco's Disease (PsHV)",
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            '**Acute hepatic necrosis** + sudden death · "found dead" ในกรง',
            'Histopath: intranuclear inclusion bodies ใน liver/kidney/spleen',
            '**Tx**: Acyclovir (antiviral) + supportive · prognosis poor หลังมี clinical sign',
            'Carrier birds (latent infection) shed virus เมื่อ stress',
          ] },
        ],
      },
      {
        heading: 'PDD (Proventricular Dilatation Disease)',
        source: 'โรคติดเชื้อ.pptx',
        body: [
          { bullets: [
            'Avian Bornavirus → lymphoplasmacytic ganglioneuritis ใน autonomic nervous system',
            'Wasting + regurgitation + undigested seeds in feces · neuro signs (ataxia, seizure)',
            'Dx: PCR (cloacal swab), endoscopic biopsy of crop/proventriculus',
            'Tx: NSAIDs (celecoxib) + supportive feeding · no cure',
          ] },
        ],
      },
      {
        heading: 'PBFD (Psittacine Beak and Feather Disease)',
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            '**Beak and Feather Disease Virus (BFDV) = Circovirus**',
            'Feather dystrophy + beak deformity + immunosuppression',
            'Affected feathers → loss of pigment, abnormal shaft, retained sheath',
            'Inclusion: **intracytoplasmic** (key differentiator vs Polyoma which is intranuclear)',
            'Dx: PCR feather/blood · No vaccine · No cure → cull',
          ] },
        ],
      },
      {
        heading: 'Polyomavirus',
        source: 'โรคติดเชื้อ.pptx',
        body: [
          { bullets: [
            'Affects **young birds** (esp. budgies, macaws) — high mortality',
            'Feather abnormalities + liver necrosis + sudden death',
            'Inclusion: **intranuclear** (vs PBFD intracytoplasmic)',
            'Vaccine: **available** (commercial) — recombinant',
          ] },
        ],
      },
      {
        heading: 'Bacterial — Chlamydophila psittaci (Psittacosis)',
        source: 'EXOTIC FINAL 86',
        body: [
          { callout: '⚠️ ZOONOSIS — ระวังคนติด · psittacosis fever ในเจ้าของ', kind: 'warn' },
          { bullets: [
            'Conjunctivitis + nasal/ocular discharge + diarrhea + lethargy',
            '**Antibiotic of choice**: **Doxycycline**',
            '**Duration**: **45 วัน** (4-6 สัปดาห์) — สำคัญมาก สั้นกว่านี้ relapse',
            'Penetrates intracellular pathogen ได้ดี · macrolide (azithromycin) เป็น alternative',
            'Notify owner re: zoonosis precautions',
          ] },
        ],
      },
      {
        heading: 'Fungal — Candidiasis (Thrush)',
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            'White plaque ใน oropharynx + crop · พบใน **young birds** (parent-fed)',
            'Predispose: long Abx use, immunosuppression, hypovitaminosis A',
            'Dx: cytology — budding yeast / hyphae',
            'Tx: **Itraconazole** (systemic) · **Nystatin** (topical/oral) สำหรับเฉพาะที่',
          ] },
        ],
      },
      {
        heading: 'Protozoal Diseases',
        source: 'EXOTIC FINAL 86',
        body: [
          { sub: 'Trichomonas gallinae (Canker)',
            body: [
              { bullets: [
                'White caseous plaque ใน oropharynx (frownish-yellow)',
                'พบในนกพิราบ, raptor, finch · transmitted via crop secretions',
                'Tx: **Metronidazole** PO 5-7 วัน',
              ] },
            ] },
          { sub: 'Giardia spp.',
            body: [
              { bullets: [
                'พบบ่อยใน **Cockatiel** (อาจร่วม feather plucking + diarrhea)',
                'Dx: fecal direct/zinc sulfate · Tx: **Metronidazole**',
              ] },
            ] },
          { sub: 'Eimeria / Coccidia',
            body: [
              { bullets: [
                'GI signs · oocyst ใน feces',
                'Tx: **Sulfa-trimethoprim** (drug of choice) 5-7 วัน',
              ] },
            ] },
        ],
      },
      {
        heading: 'Vaccine Availability — Summary',
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            '✅ **Pox** (fowl pox · live attenuated)',
            '✅ **Polyomavirus** (recombinant)',
            '❌ PBFD · PDD · Pacheco · Chlamydophila — ไม่มี commercial vaccine',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-vet': {
    topic: 'zoo-vet',
    title: 'สัตวแพทย์กับงานสวนสัตว์',
    lecturer: 'เสาวภางค์ สนั่นหนู',
    icon: '🦓',
    summary: 'Conservation framework (IUCN, CITES, ZPOT) + 4 roles ของ zoo vet (Practitioner / Curator / Researcher / Pathologist) + key protocols (quarantine, vaccination, surveillance)',
    sections: [
      {
        heading: 'IUCN Red List — Conservation Status',
        source: 'ZOO_VET_CU2026.pdf p.7',
        body: [
          { table: {
            headers: ['Code', 'Status (TH)', 'Trend'],
            rows: [
              ['LC', 'Least Concern', 'ปลอดภัย'],
              ['NT', 'Near Threatened', 'ใกล้ถูกคุกคาม'],
              ['VU', 'Vulnerable', 'มีแนวโน้มสูญพันธุ์'],
              ['EN', 'Endangered', 'ใกล้สูญพันธุ์'],
              ['CR', 'Critically Endangered', 'ใกล้สูญพันธุ์ขั้นวิกฤต'],
              ['EW', 'Extinct in the Wild', 'สูญพันธุ์จากธรรมชาติ'],
              ['EX', 'Extinct', 'สูญพันธุ์'],
            ],
          } },
        ],
      },
      {
        heading: 'CITES Appendices',
        source: 'ZOO_VET_CU2026.pdf p.8',
        body: [
          { bullets: [
            { label: 'Appendix I', value: 'ใกล้สูญพันธุ์ที่สุด — ห้ามค้าระหว่างประเทศ (เว้นแต่ permit)' },
            { label: 'Appendix II', value: 'ยังไม่ใกล้สูญพันธุ์ แต่ต้องควบคุมการค้า' },
            { label: 'Appendix III', value: 'ปกป้องในประเทศใดประเทศหนึ่ง — ต้องขอ CITES ในการค้า' },
          ] },
        ],
      },
      {
        heading: 'In situ vs Ex situ Conservation',
        source: 'ZOO_VET_CU2026.pdf p.6',
        body: [
          { bullets: [
            { label: 'In situ', value: 'ในถิ่นอาศัยจริง — Wildlife Department · National Park' },
            { label: 'Ex situ', value: 'นอกถิ่นอาศัย — Zoo · Captive breeding' },
            'ZPOT (Zoological Park Organization of Thailand) ดูแล 6 zoos ในไทย',
          ] },
        ],
      },
      {
        heading: 'Zoo Vet Roles (4 บทบาท)',
        source: 'ZOO_VET_CU2026.pdf p.16',
        body: [
          { sub: '1. Practitioner — General · Epidemiologist · Pathologist',
            body: [
              { bullets: [
                'Animal health management — preventive medicine, surgery, neonatal',
                'Necropsy — investigate cause of death + clinical research support',
                'Translocation + collection plan',
              ] },
            ] },
          { sub: '2. Curator',
            body: ['Exhibit + Nutrition + Welfare + Identification (microchip/photo/tag)'] },
          { sub: '3. Researcher',
            body: [
              { bullets: [
                'Genome Resource Bank (GRB) — frozen zoo · sperm/embryos/oocytes/fibroblasts',
                'Hormonal analysis (non-invasive — fecal/urine) — estrogen/progesterone/cortisol',
                'Artificial Insemination + IVF + Embryo Transfer',
              ] },
            ] },
        ],
      },
      {
        heading: 'Quarantine Protocol',
        source: 'ZOO_VET_CU2026.pdf p.20',
        body: [
          { bullets: [
            '**Period**: 30 days minimum (ขึ้นกับ species)',
            '**All in - all out**: รับสัตว์เป็น batch · ไม่ผสมกับ batch อื่น',
            'Separate area from main collection',
            'Disease testing + behavior recording during quarantine',
            'Transportation protocol → DLD permit ก่อน move',
          ] },
        ],
      },
      {
        heading: 'Vaccination Protocols',
        source: 'ZOO_VET_CU2026.pdf p.24',
        body: [
          { table: {
            headers: ['Species group', 'Vaccine', 'Type'],
            rows: [
              ['Mammals (carnivore)', 'Rabies', 'Killed'],
              ['Felidae / Viveridae', 'Fel-O-Vax (FRCP)', 'Killed'],
              ['Carnivore (ferret/related)', 'Distemper', 'Live'],
              ['Apes (Gibbon/Orangutan)', '**Hepatitis B (recombinant)**', 'Recombinant'],
              ['Canidae', 'CDV/CAV-2/CPi/CPV/Lepto/Coronavirus', 'Killed + Live'],
            ],
          } },
        ],
      },
      {
        heading: 'Disease Surveillance — Top concerns',
        source: 'ZOO_VET_CU2026.pdf p.27',
        body: [
          { callout: '⚠️ Zoonosis — TB, Brucellosis, Avian flu, COVID-19 — เฝ้าระวัง keeper + vet ด้วย', kind: 'warn' },
          { bullets: [
            'Tuberculosis (apes/elephants → human zoonosis)',
            'Nipah · MERS · SARS · Avian Influenza · COVID-19',
            'Melioidosis (Burkholderia pseudomallei) — soil/water · พบในไทย',
            'African Swine Fever · African Horse Sickness · Lumpy Skin Disease',
          ] },
        ],
      },
      {
        heading: 'Five Domains of Animal Welfare',
        source: 'ZOO_VET_CU2026.pdf p.34',
        body: [
          { bullets: [
            '1. **Nutrition** — ให้อาหารคุณภาพดี + เพียงพอ',
            '2. **Environment** — กรง/ที่อยู่/อุณหภูมิ',
            '3. **Health** — ป้องกันโรค + รักษา',
            '4. **Behaviour** — แสดงพฤติกรรมตามธรรมชาติได้',
            '5. **Mental state** — ภาวะจิตใจ (positive/negative experience)',
          ] },
          { callout: '💡 ❌ Economic — ไม่อยู่ใน Five Domains (ออกข้อสอบบ่อย)', kind: 'tip' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'field-vet': {
    topic: 'field-vet',
    title: 'สัตวแพทย์กับงานนอกสวนสัตว์ (Conservation Medicine)',
    lecturer: 'ไพศิลป์ เล็กเจริญ',
    icon: '🌳',
    summary: 'Conservation medicine = One Health applied to biodiversity · 4 interfaces · surveillance ≠ research · case studies (LSD, rabies, HPAI, mange, malaria, poisoning) · translocation framework',
    sections: [
      {
        heading: 'What is Conservation Medicine?',
        source: 'RolesVeterinarians.pdf p.4',
        body: [
          'Conservation medicine = interdisciplinary field examining reciprocal relationships among biodiversity, ecosystem integrity, animal health, and human health.',
          { bullets: [
            'Wildlife + Livestock + Humans + Environment (4-pillar)',
            'Key terms: One Health · Biodiversity · Ecosystem health · Spillover',
          ] },
        ],
      },
      {
        heading: '4 Interfaces (Wegner et al., 2022)',
        source: 'RolesVeterinarians.pdf p.6',
        body: [
          { bullets: [
            { label: 'Ecological', value: 'species overlap · habitat fragmentation' },
            { label: 'Epidemiological', value: 'pathogen transmission · spillover' },
            { label: 'Human-wildlife', value: 'conflict · encroachment' },
            { label: 'Governance', value: 'wildlife authority + health authority + local communities' },
          ] },
          { callout: '💡 Example: Gaur (wildlife) เข้าทุ่งหญ้าวัว (livestock) = wildlife-livestock interface → LSD spillover risk', kind: 'tip' },
        ],
      },
      {
        heading: 'Veterinary Analogy — Body to Ecosystem',
        source: 'RolesVeterinarians.pdf p.8',
        body: [
          { table: {
            headers: ['Vet Medicine', 'Conservation Medicine'],
            rows: [
              ['Organ system', 'Ecosystem'],
              ['Cells', 'Species'],
              ['Physiology', 'Ecological processes'],
              ['Disease', 'Ecosystem disruption'],
              ['Homeostasis', 'Biodiversity balance'],
            ],
          } },
        ],
      },
      {
        heading: 'Case Studies — เจอบ่อยในข้อสอบ',
        source: 'RolesVeterinarians.pdf p.13-22',
        body: [
          { sub: 'LSD (Lumpy Skin Disease) ใน Wild Bovids',
            body: ['Livestock disease spillover into threatened wildlife (gaur)', 'Concept: protected areas not isolated from production systems'] },
          { sub: 'Rabies ใน Golden Jackals',
            body: ['Fatal zoonosis beyond domestic dog cycle', 'Strategy: oral rabies vaccination + roadkill surveillance'] },
          { sub: 'HPAI ใน Captive Threatened Carnivores',
            body: ['Conservation breeding population vulnerable to single introduction', 'Need: feed-chain biosecurity + outbreak preparedness'] },
          { sub: 'Mange ใน Social Carnivores (e.g., dholes)',
            body: ['Pack-level disease dynamics + difficult capture', 'Use: camera trap monitoring + non-invasive surveillance'] },
          { sub: 'Macaques as Reservoirs (zoonotic malaria)',
            body: ['Wildlife as reservoir host in vector-borne system'] },
          { sub: 'Tiger Poisoning',
            body: ['Forensic pathology + wildlife crime investigation', 'Food-web consequences — secondary poisoning'] },
        ],
      },
      {
        heading: 'Surveillance ≠ Research',
        source: 'RolesVeterinarians.pdf p.27',
        body: [
          { table: {
            headers: ['Aspect', 'Surveillance', 'Research'],
            rows: [
              ['Goal', 'Early detection', 'Hypothesis testing'],
              ['Output', 'Action-oriented', 'Publication-oriented'],
              ['Duration', 'Continuous', 'Time-limited'],
              ['Use', 'Decision support', 'Knowledge generation'],
            ],
          } },
          { callout: '💡 Roadkill = passive surveillance proxy · ใช้ตรวจ rabies/AI ใน wildlife', kind: 'tip' },
        ],
      },
      {
        heading: 'Translocation Framework',
        source: 'RolesVeterinarians.pdf p.34',
        body: [
          'Translocation **ไม่ใช่** การย้ายสัตว์เฉยๆ — เป็น population-level health intervention',
          { bullets: [
            '1. Population decline assessment',
            '2. Conservation planning',
            '3. **Health risk assessment**',
            '4. **Quarantine + screening**',
            '5. Release',
            '6. **Post-release monitoring**',
          ] },
          'Example: Eld\'s deer (Rucervus eldii) reintroduction program',
        ],
      },
      {
        heading: 'Operational Challenges',
        source: 'RolesVeterinarians.pdf p.30',
        body: [
          { bullets: [
            { label: 'Detection', value: 'carcass detection bias · scavenger removal · inaccessible terrain' },
            { label: 'Capture/Sampling', value: 'species behavior · stress risk · legal permits · endangered ethics' },
            { label: 'Diagnostic', value: 'postmortem degradation · small sample size · no baseline data' },
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'wildlife-career': {
    topic: 'wildlife-career',
    title: 'การศึกษาต่อด้าน Wildlife / Exotic Animal Medicine',
    lecturer: 'ปัณณวัฒน์ สุภาพรรณชาติ',
    icon: '🎓',
    summary: 'MSc/PhD comparison (USA vs EU/AUS) · Residency boards (ACZM USA · ECZM EU · 5 specialties) · Funding sources (national + international)',
    sections: [
      {
        heading: 'MSc / Master\'s Degree — USA vs EU/AUS',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.3',
        body: [
          { table: {
            headers: ['Aspect', 'USA', 'EU / AUS'],
            rows: [
              ['Requirement', 'GMAT/GRE/TOEFL · IEP/Pathway', 'IELTS · pre-sessional'],
              ['Duration', '2 years', '1-2 years'],
              ['Module', 'Coursework + thesis', 'Coursework + thesis'],
              ['Course choice', 'Optional (Major/Minor)', 'Predefined mandatory'],
              ['Grading', 'Quizzes + projects + presentations + exams', 'Assignments + final exam'],
            ],
          } },
        ],
      },
      {
        heading: 'PhD — USA vs EU/AUS',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.4',
        body: [
          { table: {
            headers: ['Aspect', 'USA', 'EU / AUS'],
            rows: [
              ['Pre-req', "Bachelor's may suffice*", "Master's completion required"],
              ['Duration', '3.5 yrs +', '3.5 yrs +'],
              ['Thesis topic', 'Decided in year 2-3', 'Required at application'],
              ['Teaching', 'Required (TA 2-3 yrs)', 'Not required (most countries)'],
              ['Coursework', '2-3 yrs courses + seminars', 'Little to no coursework'],
              ['Salary', 'TA/RA stipend', 'Employee status (except UK/Italy)'],
            ],
          } },
        ],
      },
      {
        heading: 'Residency — ACZM (USA) vs ECZM (EU)',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.10',
        body: [
          { bullets: [
            'Both: graduated AVMA/EAEVE-approved school + 1-2 yr internship + license + TOEFL/IELTS',
            'Duration: **3 years** (ACZM) · **3 yrs (max 6)** (ECZM)',
          ] },
          { table: {
            headers: ['Cert requirement', 'ACZM (USA)', 'ECZM (EU)'],
            rows: [
              ['Peer-reviewed papers', '**3** discipline-relevant', '**2** discipline-relevant (within 2 yrs)'],
              ['Exam window', 'After residency', 'Pass all parts within **8 yrs**'],
              ['Examination', 'Written + practical', 'Written + practical'],
            ],
          } },
        ],
      },
      {
        heading: 'ECZM 5 Specialty Boards',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.12',
        body: [
          { bullets: [
            '1. **Avian** Medicine and Surgery',
            '2. **Herpetological** Medicine and Surgery',
            '3. **Wildlife Population Health (WPH)** — free-ranging wildlife · disease surveillance + epi (minimal clinical)',
            '4. **Small Mammal** Medicine and Surgery',
            '5. **Zoo Health Management (ZHM)** — captive collection + preventive medicine + studbook',
          ] },
          { callout: '💡 WPH = field-level + population health · ZHM = facility-level + clinical zoo med', kind: 'tip' },
        ],
      },
      {
        heading: 'Funding Sources',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.16',
        body: [
          { sub: 'National (Thailand)',
            body: [
              { bullets: [
                '**OCSC** (สำนักงาน ก.พ.) — รัฐบาลไทย · ocsc.go.th/scholarship',
                'University funding — ทุน chula/ม.อื่น',
              ] },
            ] },
          { sub: 'International',
            body: [
              { bullets: [
                '**Fulbright** — USA',
                '**Chevening** — UK',
                '**Erasmus Mundus** — Europe',
                '**Australia Awards** — Australia',
                '**Monbukagakusho** — Japan',
              ] },
            ] },
        ],
      },
      {
        heading: 'Module Examples — Wildlife Medicine programs',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.6-9',
        body: [
          { bullets: [
            'Wildlife Care + Rehabilitation (capture, transport, husbandry, release)',
            'Captive Wildlife Management (enclosure, behavior, breeding)',
            'Conservation Medicine (biodiversity threats, GIS, satellite tracking)',
            'Wildlife Diseases + One Health (epi, zoonosis, surveillance)',
            'Animal Behavior, Welfare, Ethics, Law (Five Freedoms / Domains)',
          ] },
        ],
      },
    ],
  },
};
