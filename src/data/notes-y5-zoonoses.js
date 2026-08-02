// ============================================================
// Y5 Zoonoses (3109504) Study Notes — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// Outline-only build (slide 1-3 ของแต่ละ lecture) — ใช้สำหรับ
// scaffold ก่อน fill body content รอบหน้า
//
// ทุก section อ้างอิง slide ตาม `source` ที่ระบุไว้
// (ไม่ extrapolate medical body content จาก outline เท่านั้น)
//
// Body item types:
//   string                                — paragraph
//   { bullets: [string|{label,value}] }    — bulleted list
//   { sub, body }                          — sub-section
//   { table: { headers, rows } }            — table
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
// ============================================================

export const NOTES_Y5_ZOONOSES = {
  // ─────────────────────────────────────────────────────────────
  'zoo-intro': {
    topic: 'zoo-intro',
    title: 'Intro Zoonoses + One Health',
    lecturer: 'Alongkorn Amonsin',
    icon: '📖',
    summary: 'หลักสูตร 3109504 — One Health concept, definition/classification, emerging zoonotic disease (model: Influenza, COVID-19) + Special lecture ที่อาจารย์เน้นว่า "ต้องเข้า" (Rabies / Emerging Threat / EID).',
    sections: [
      {
        heading: 'ภาพรวมรายวิชา 3109504',
        source: '1 - 25_1._Intro_Zoonoses_updated_Aug_2024_SET_I-503004.pdf p.1',
        body: [
          { bullets: [
            'รหัสวิชา: **3109504 Zoonoses** (โรคสัตว์→คน)',
            'จัดโดย Department of Veterinary Public Health, Faculty of Veterinary Sciences, Chulalongkorn University',
            'อาจารย์: Alongkorn Amonsin, DVM, PhD (Henri-Dunant Road, Patumwan, Bangkok 10330)',
            'ติดต่อ: Alongkorn.a@chula.ac.th · Tel 0-2218-9577',
          ] },
        ],
      },
      {
        heading: 'Course outline — หัวข้อหลัก 6 หมวด',
        source: '1 - 25_1._Intro_Zoonoses_updated_Aug_2024_SET_I-503004.pdf p.2',
        body: [
          { bullets: [
            '**Intro to zoonoses** (9 Aug 24) — one health concept · definition · classification · emerging zoonotic disease (model: Influenza, COVID-19)',
            '**Viral zoonoses** — coronavirus · Ebola/Nipah · AI · SIV/CIV · vector-borne viral',
            '**Bacterial zoonoses**',
            '**Mycozoonoses** (รา ยีสต์)',
            '**Prion zoonoses**',
            '**Parasitic zoonoses** (helminth + protozoa)',
          ] },
          { sub: 'Special lecture (ต้องเข้า!)',
            body: [
              { bullets: [
                'Rabies (30 Aug)',
                'Emerging Threat (8 Nov)',
                'Emerging Zoonotic Diseases (15 Nov)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Zoonoses: Emerging Diseases — historical model',
        source: '1 - 25_1._Intro_Zoonoses_updated_Aug_2024_SET_I-503004.pdf p.3',
        body: [
          { bullets: [
            '**1918 H1N1 Pandemic: "The Unknown Killer"** — case study เปิดหัวข้อ emerging disease',
            'มาจาก animal source (influenza)',
            'คนตายทั่วโลกราว **50 ล้านคน** (เป็นค่าประมาณ และอาจต่ำกว่าความจริง) คิดเป็นราว 3% ของประชากรโลกในเวลานั้น ส่วนสัดส่วน 1/5 ถึง 1/3 ที่มักอ้างกันคือสัดส่วนคน **ติดเชื้อ** ไม่ใช่คนตาย — สไลด์เขียนว่าตาย ≈ 1/5 ของประชากรโลก',
            'ใช้เป็น model ของ emerging zoonotic disease ตลอด course',
          ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '1 - 25_1._Intro_Zoonoses_updated_Aug_2024_SET_I-503004.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — One Health framework, definitions (zoonosis / anthroponosis / sapronosis), classification (orthozoonosis / cyclozoonosis / metazoonosis / saprozoonosis), emerging vs re-emerging concepts',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-corona': {
    topic: 'zoo-corona',
    title: 'Coronaviruses',
    lecturer: 'Alongkorn Amonsin',
    icon: '🦠',
    summary: 'Coronaviruses 4 genus (Alpha/Beta/Gamma/Delta) — Beta ก่อ pandemic ในช่วง 20 ปี (SARS, MERS, COVID-19) · Alpha ส่วนใหญ่ก่อโรค enteric ในสัตว์ · Gamma+Delta ในนก/สัตว์น้ำ.',
    sections: [
      {
        heading: 'Coronaviruses overview — 4 genus',
        source: '2 - Coronaviruses_Vet_student_yr.5_2024.8.15.pdf p.2',
        body: [
          { sub: 'Alpha-CoV',
            body: [
              { bullets: [
                'ไม่ทำให้คนติด COVID-19',
                'ก่อโรคทาง **enteric** (เด่น)',
                'Respiratory ทำได้แต่ไม่เด่นเท่า Beta',
                'ตัวอย่าง: FIP (Feline Infectious Peritonitis), HCoV-229E, HCoV-NL63',
              ] },
            ] },
          { sub: 'Beta-CoV',
            body: [
              { bullets: [
                'ทำให้เกิด **pandemic outbreak** ในช่วง 20 ปี: SARS-CoV (2002), MERS-CoV (2012), SARS-CoV-2 / COVID-19 (2019)',
                'HCoV-OC43, HCoV-HKU1 ก็อยู่กลุ่มนี้ (common cold)',
              ] },
            ] },
          { sub: 'Gamma-CoV + Delta-CoV',
            body: [
              { bullets: [
                'Gamma: avian + สัตว์น้ำ (เช่น dolphin)',
                'Delta: **PDCoV (Porcine Deltacoronavirus)** — ลูกหมูท้องเสีย อาเจียน ขาดน้ำ ⚠️ **PEDV ไม่ได้อยู่ใน Delta แต่เป็น Alphacoronavirus** เป็นคนละตัวกันแม้อาการคล้ายกัน — สไลด์เขียนว่า Delta คือ PED',
              ] },
            ] },
        ],
      },
      {
        heading: 'Human coronaviruses timeline (1965-2020) — 7 ตัว',
        source: '2 - Coronaviruses_Vet_student_yr.5_2024.8.15.pdf p.3',
        body: [
          { table: {
            headers: ['Virus', 'Year', 'Origin', 'Genus', 'Receptor', 'Note'],
            rows: [
              ['HCoV-229E', '1966', 'Unknown / Bats', 'α', 'APN', 'Common cold'],
              ['HCoV-OC43', '1967', 'Unknown / Mice', 'β', '9-O-acetyl sialic acid', 'Common cold'],
              ['SARS-CoV', '2002', 'China / Bats (civet 2nd host)', 'β', 'ACE2', 'Pandemic outbreak'],
              ['HCoV-NL63', '2004', 'Netherlands / Bats', 'α', 'ACE2 / HSPGs', 'Common cold'],
              ['HCoV-HKU1', '2005', 'Hong Kong / Mice', 'β', '9-O-acetyl sialic acid', 'Common cold'],
              ['MERS-CoV', '2012', 'Middle East / Bats (camel 2nd host)', 'β', 'DPP4', 'Pandemic outbreak'],
              ['SARS-CoV-2', '2019', 'China-worldwide / Bats (pangolin?)', 'β', 'ACE2', 'COVID-19 pandemic'],
            ],
          } },
          { callout: 'รูปแบบ 6 ค่าต่อ virus: 1) Year 2) Location 3) Origin 4) Genome length 5) Receptor 6) Cleavage 7) Major proteins (S, E, M, N — บางตัวมี HE)', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '2 - Coronaviruses_Vet_student_yr.5_2024.8.15.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — SARS-CoV-2 origin/pathogenesis, animal CoVs (FIP, PED, IBV), zoonotic spillover, prevention',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-ebola-nipah': {
    topic: 'zoo-ebola-nipah',
    title: 'Ebola + Nipah Virus Disease',
    lecturer: 'TBD',
    icon: '🩸',
    summary: 'Ebola (Filoviridae) — severe contagious disease ในคนและ non-human primates · Africa outbreak · 6 species (Zaire/Sudan/Bundibugyu/Taï/Reston/Bombali) · Reston ไม่เคยก่อโรคในคน · Nipah originate จาก fruit bat.',
    sections: [
      {
        heading: 'What is Ebola virus disease',
        source: '3 - Ebola___Nipah_virus_disease_Zoonoses_16_8_2024.pdf p.2',
        body: [
          { bullets: [
            'ชื่อเดิม: **Ebola haemorrhagic fever** (EHF) → ปัจจุบันเรียก **Ebola virus disease (EVD)**',
            'Severe contagious disease — ติดง่าย รุนแรง ตายสูง',
            'Affects **humans + non-human primates** (monkeys, gorillas, chimpanzees)',
            'Occasional outbreaks — mostly in **Africa** (เจอบ่อย)',
          ] },
        ],
      },
      {
        heading: 'Ebola virus — taxonomy + species',
        source: '3 - Ebola___Nipah_virus_disease_Zoonoses_16_8_2024.pdf p.3',
        body: [
          { bullets: [
            '**Family**: *Filoviridae*',
            '**Genus**: *Ebolavirus*',
          ] },
          { sub: 'Species ที่ก่อโรคในคน (รุนแรง)',
            body: [
              { bullets: [
                '*Zaire ebolavirus* (Zaire/Congo)',
                '*Sudan ebolavirus* (Sudan)',
                '*Bundibugyu ebolavirus* (Bundibugyu, Uganda)',
                '*Taï forest ebolavirus* (Taï national park, Côte d\'Ivoire)',
              ] },
            ] },
          { sub: 'Species ที่ไม่ก่อโรคในคน',
            body: [
              { bullets: [
                '*Reston ebolavirus* (Reston, VA, USA) — ยังไม่เจอก่อโรคในคน',
                '*Bombali ebolavirus* (Bombali district, Sierra Leone) — เจอในค้างคาว',
              ] },
            ] },
        ],
      },
      {
        heading: 'Nipah virus — overview',
        source: '3 - Ebola___Nipah_virus_disease_Zoonoses_16_8_2024.pdf p.1',
        body: [
          { bullets: [
            'Nipah virus originate จาก **fruit bat**',
            'อยู่ในกลุ่ม emerging viral zoonoses',
            'รวมในชั่วโมงเดียวกับ Ebola',
          ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '3 - Ebola___Nipah_virus_disease_Zoonoses_16_8_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Ebola pathogenesis/transmission/clinical signs/diagnosis/prevention, Nipah outbreak Malaysia 1998/India/Bangladesh, treatment',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-ai-basic': {
    topic: 'zoo-ai-basic',
    title: 'Avian Influenza Virus (AI) — Basic',
    lecturer: 'TBD',
    icon: '🐦',
    summary: 'Influenza A (Orthomyxoviridae) — 8 segments ssRNA · HA (จับ receptor) + NA (release virion) · Wild aquatic birds เป็น natural reservoir (H1-16) · HPAI H5N1 จาก A/Goose/Guangdong/1/1996 → 2004 ระบาดทั่วโลก + ติดคน.',
    sections: [
      {
        heading: 'Influenza A virus — structure + transmission',
        source: '5 - Avian_Influenza_Virus_(AIV)_22_Aug_2024.pdf p.1 (ref slide ใน Intro) + 4 - Basic_of_AI_22_8_24_for_present.pdf p.1',
        body: [
          { bullets: [
            '**Family**: Orthomyxoviridae · **Genus**: Influenza A virus (สายพันธุ์ A)',
            'Single-stranded **RNA**, 8 segments',
            'Lipoprotein envelope + capsid',
          ] },
          { sub: 'Surface proteins — 2 ตัวสำคัญ',
            body: [
              { bullets: [
                '**Hemagglutinin (H/HA)** — จับ receptor ของ host cell → ทำหน้าที่ entry · viral recognition',
                '**Neuraminidase (N/NA)** — enzyme ที่ช่วย release virion จาก host cell (เอาตัวเองออก)',
                'อยู่บนผิว cell → ใช้จำแนก Influenza A subtype (H1-16, N1-9)',
              ] },
            ] },
          { sub: 'Transmission',
            body: [
              { bullets: [
                'Inhalation of **aerosolized respiratory secretions**',
                'Contact with **contaminated surfaces**',
              ] },
            ] },
        ],
      },
      {
        heading: 'Host range + natural reservoir',
        source: '4 - Basic_of_AI_22_8_24_for_present.pdf p.2-3',
        body: [
          { bullets: [
            '**Wild aquatic birds** (นกเป็ดน้ำ) = natural reservoir — เจอ subtype H1-H16 ทุกชนิด',
            '**Domestic poultry** = H5, H7, H9 subtypes หลากหลาย',
            '**Humans** = H1N1, H3N2 (ที่เจอบ่อย)',
            '**Swine** = H1N1, H1N2, H3N2',
          ] },
          { sub: 'Cross-species transmission — สามารถติดข้ามสัตว์/คน/สายพันธุ์ได้!',
            body: [
              { bullets: [
                'Swine ↔ Human: H1N1, H3N2',
                'Wild bird → poultry: H1-H13 subtypes (H2N2, HP H5N1, H9N2, H7N2, HP H7N3, LP/HP H7N7, H10N7)',
                'Wild bird → seal/marine mammal: H13N2, H13N9, H3N2, H4N5, H4N6, H7N7',
                'Wild bird → cat: HP H5N1 · Wild bird → horse: H3N8 · Wild bird → dog: H3N8, H3N2',
                'Bat: HP H5N1, H3N2 (และ H17/H18 ใน bat-specific)',
              ] },
            ] },
        ],
      },
      {
        heading: 'HPAI H5N1 outbreak — origin + spread',
        source: '5 - Avian_Influenza_Virus_(AIV)_22_Aug_2024.pdf p.2-3',
        body: [
          { bullets: [
            '**A/Goose/Guangdong/1/1996 (Gs/GD)** = origin lineage ของ HPAI H5N1',
            'ระบาดจากจีน → ทั่วโลก (2004) + ติดคนด้วย',
            'H5N1 ทำให้ไก่ตาย (HPAI) — แต่ LPAI ในไก่ก็เจอได้',
            'ปกติ พฤติกรรมอยู่ดี ๆ แล้วตายต้องสงสัย AIV',
          ] },
          { sub: 'HPAI-H5N1 outbreaks — 1997 Hong Kong (เหตุการณ์ landmark)',
            body: [
              { bullets: [
                '1997: เริ่มพบ H5N1 ติดคน (Hong Kong)',
                'Hong Kong begins to **kill all 1.25 million chickens** → stop spread',
                'Reference papers: Claas et al. (1998) Virology 252:331-342, Shortridge et al. — characterization of HPAI H5N1 from poultry in Hong Kong',
              ] },
            ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '5 - Avian_Influenza_Virus_(AIV)_22_Aug_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — HA/NA cleavage site differentiation HPAI/LPAI, pathogenesis ในไก่, clinical signs, diagnosis, surveillance, control (depopulation/biosecurity), human cases Thailand',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-siv-civ': {
    topic: 'zoo-siv-civ',
    title: 'SIV + CIV — Swine + Canine Influenza',
    lecturer: 'TBD',
    icon: '🐷',
    summary: 'Swine Influenza Virus (SIV) — 2 lineage หลัก (NA-SIV จากอเมริกาเหนือ classical swine + EU-SIV avian-like H1N1) · 1918 Spanish flu = pandemic แรก, 1930 First SIV in pigs USA · 2020 China พบ swine flu ที่มี pandemic potential.',
    sections: [
      {
        heading: 'Course context — Viral zoonoses',
        source: '6 - 3109517_(Zoonoses)_SIV_CIV.pdf p.1',
        body: [
          { bullets: [
            'อยู่ใน module **Viral zoonoses** (30 Jul 20)',
            'หัวข้อ: one health concept, definition, classification, emerging zoonotic disease',
            'Model: **Influenza** + **Swine Influenza**',
          ] },
        ],
      },
      {
        heading: 'Swine Influenza — pandemic potential (recent news)',
        source: '6 - 3109517_(Zoonoses)_SIV_CIV.pdf p.2',
        body: [
          { bullets: [
            'CNN headline (1 July 2020): "China researchers discover **new swine flu with pandemic potential**"',
            'Pandemic potential = virus มี evolve ได้ → เฝ้าระวัง virus อยู่ตลอดในหลายๆ ประเทศ',
            'เพราะ virus มี evolve ตลอดเวลา',
          ] },
        ],
      },
      {
        heading: 'Swine Influenza Virus (SIV) — history + lineages',
        source: '6 - 3109517_(Zoonoses)_SIV_CIV.pdf p.3',
        body: [
          { bullets: [
            '**1918**: "Spanish flu" — human influenza pandemic (start ของ flu pandemic ในคน)',
            '**1930-1931**: First SIV in pigs in **USA** (สไลด์เขียน 1930 ซึ่งเป็นช่วง outbreak ที่ศึกษา ส่วนงานที่พิสูจน์ว่าเกิดจาก filtrable virus คือ Shope ตีพิมพ์ปี 1931 และ model เดิมเป็น co-infection ของ virus ร่วมกับ Haemophilus influenzae suis)',
            '**1997-98**: Mix กันกับของ NA',
            '**2003-05**: δ1 H1N2, δ2 H1N1 emerge',
            '**2009**: pH1N1 pandemic',
          ] },
          { sub: 'Two main lineages',
            body: [
              { bullets: [
                '**North American lineage (NA-SIV)**: Classical swine lineage from North America',
                '**Eurasian lineage (EU-SIV)**: Avian-like SIV H1N1',
                'Reassortants: cH1N1, H2N3, H4N6, current H3N2/rH1N1/H1N2',
              ] },
            ] },
          { callout: 'หมูสามารถ host ทั้ง avian + human flu — เป็น "mixing vessel" สำหรับ reassortment', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '6 - 3109517_(Zoonoses)_SIV_CIV.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — SIV subtypes Thailand, CIV (Canine Influenza H3N8/H3N2), 2009 pH1N1 pandemic origin, mixing vessel concept, surveillance',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-vbz': {
    topic: 'zoo-vbz',
    title: 'Vector-borne Viral Zoonoses',
    lecturer: 'TBD',
    icon: '🦟',
    summary: 'Vector-borne viral diseases — 2 vector หลัก: Mosquito (Rift Valley fever, Yellow Fever, Japanese encephalitis, West Nile fever) + Tick (Crimean-Congo Haemorrhagic fever, SFTS virus).',
    sections: [
      {
        heading: 'Vector-borne viral zoonosis — overview',
        source: '7 - Vector_borne_viral_zoonosis_23_8_2024.pdf p.1',
        body: [
          { bullets: [
            'Vector-borne = โรคที่ติดผ่าน vector (พาหะ)',
            'เน้น **ยุง + เห็บ** เป็น vector หลักของ viral zoonoses',
            'ตัวอย่าง vector control campaign ในไทย: "5 ป." ปราบยุงลาย (ปิด-ปล่อย-เปลี่ยน-ปรับ-ปฏิบัติ)',
          ] },
        ],
      },
      {
        heading: 'Mosquito-borne viral zoonoses',
        source: '7 - Vector_borne_viral_zoonosis_23_8_2024.pdf p.2',
        body: [
          { bullets: [
            '**Rift Valley fever** (RVF) — เน้นพิเศษในสไลด์ (red highlight)',
            '**Yellow Fever**',
            '**Japanese encephalitis (JE)**',
            '**West Nile fever**',
          ] },
        ],
      },
      {
        heading: 'Tick-borne viral zoonoses',
        source: '7 - Vector_borne_viral_zoonosis_23_8_2024.pdf p.2',
        body: [
          { bullets: [
            '**Crimean-Congo Haemorrhagic fever (CCHF)**',
            '**Severe Fever with Thrombocytopenia Syndrome virus (SFTSV)**',
          ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '7 - Vector_borne_viral_zoonosis_23_8_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — RVF pathogenesis/outbreak Africa, Yellow Fever vaccine, JE Thailand context, WNV ecology, CCHF/SFTS clinical + prevention, vector ecology',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-rabies': {
    topic: 'zoo-rabies',
    title: 'Rabies — Sample Collection + Diagnosis',
    lecturer: 'NIAH (National Institute of Animal Health)',
    icon: '🐕',
    summary: 'Rabies sample collection + diagnosis ที่ NIAH — Lyssavirus (Rhabdoviridae, ssRNA negative-sense, bullet-shape) · DFA = WOAH gold standard · Fresh brain tissue (brain stem + cerebellum) · Sample แช่เย็น 2-8°C ส่งใน 24 ชม. หรือแช่แข็ง -20°C.',
    sections: [
      {
        heading: 'NIAH — National Institute of Animal Health',
        source: '8 - การเก็บตัวอย่างและวินิจฉัยrabiesในสัตว์ (ไม่แจกสไลด์).pdf p.1',
        body: [
          { bullets: [
            'NIAH = สถาบันสุขภาพสัตว์แห่งชาติ',
            'อยู่ภายใต้กรมปศุสัตว์ ใต้กระทรวงเกษตรฯ',
            'มี 10 lab — เน้น livestock + aquatic + wildlife',
            'รายงานเลย:  swine ASFV · bovine FMD · equine AHS · companion rabies COVID · poultry AI/ND · aquatic กรมประมง · wildlife DNP',
            'มาตรฐานเลย: ISO 17025 — เพื่อบอก standard ทาง lab + ผลที่ได้จากเอกสารน่าเชื่อถือ',
          ] },
        ],
      },
      {
        heading: 'Rabies virus — characteristics + pathogenesis',
        source: '8 - การเก็บตัวอย่างและวินิจฉัยrabiesในสัตว์ (ไม่แจกสไลด์).pdf p.2',
        body: [
          { bullets: [
            '**Family**: Rhabdoviridae · **Genus**: *Lyssavirus*',
            'Negative-sense single-stranded RNA, ~12 kb (วัดได้ 11,923 nt), 5 genes (N, P, M, G, L) — สไลด์เขียนว่า 11 kb',
            'Linear RNA genome · ใช้ตามใจไหน + dx ทาง molecular ตามเชื่อ',
            'Shape: **Bullet shape** · size ~180 nm × 75 nm (เล็ก)',
            'genome ~12 kb ประกอบด้วย: nucleoprotein (N), phosphoprotein (P), matrix protein (M), glycoprotein (G), RNA-dependent RNA polymerase (L) โดยความยาวของ 5 coding region ค่อนข้างคงที่ระหว่าง strain',
          ] },
          { sub: 'Pathogenesis',
            body: [
              { bullets: [
                'เข้าทาง peripheral nerve → replicate ผ่านทางกระดูก → spinal cord → brain',
                'Virus replicates ในสมอง → สมองอักเสบ → clinical sign (กลืนยาก, agresss, ก.กลืนพา)',
                'Virus moves to salivary glands → shed ทาง saliva',
                'ต้องตรวจ pathogenesis ภายใต้ EM (electron microscopy)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Sample collection — official protocol',
        source: '8 - การเก็บตัวอย่างและวินิจฉัยrabiesในสัตว์ (ไม่แจกสไลด์).pdf p.2',
        body: [
          { sub: 'PPE — Personal Protective Equipment',
            body: [
              { bullets: [
                'Mask · Glove · hair net · goggle · Boots · Disinfectants',
                'ผ่าหัวสัตว์ด้วยความระมัดระวัง — สัตว์เล็กตัดหัวด้วยมีดคม, สัตว์ใหญ่ใช้ขวานปอกหัวคน',
              ] },
            ] },
          { sub: 'Sample handling',
            body: [
              { bullets: [
                'เก็บตัวอย่างน้อย **2 ชิ้น** ที่ใส่ **3 ชั้น** เพื่อ leak proof + ก่อนแช่เย็นใส่ถุงดำ',
                '**แช่เย็น 2-8°C** ส่งห้อง lab ภายใน **24 ชม.**',
                'หรือ **แช่แข็ง -20°C** ส่งห้อง lab ให้เร็วที่สุด',
                'รายงานทุก สนง.ปศจ. ในพื้นที่ → จนท.ปศุสัตว์',
                'Sample เป็น **organic** ที่ autolyze ง่ายมาก!',
              ] },
            ] },
        ],
      },
      {
        heading: 'Good sample → Good tests → Good result',
        source: '8 - การเก็บตัวอย่างและวินิจฉัยrabiesในสัตว์ (ไม่แจกสไลด์).pdf p.3',
        body: [
          { bullets: [
            'Patterns ของ rabies virus spread ใน CNS — เน้น **brain stem + cerebellum**',
            '**Fresh brain tissue** ดีที่สุด (แต่ถ้า blood/decomposed มาก TAT ช้า)',
            'Examples of samples for rabies RNA: hippocampus, spinal cord, skin, saliva, cortex',
            'ตัวอย่าง interfere ผลโลก (ตรวจ DFA ไม่ได้)',
            'รับสุดคือ epithelium เป็น **DFA-grade**',
          ] },
        ],
      },
      {
        heading: 'Diagnostic methods — WOAH + CDC',
        source: '8 - การเก็บตัวอย่างและวินิจฉัยrabiesในสัตว์ (ไม่แจกสไลด์).pdf p.3',
        body: [
          { sub: 'Antigen detection (ต้องใช้ fresh brain tissue)',
            body: [
              { bullets: [
                '**Direct Fluorescent Antibody (DFA) Test** = WOAH **Gold standard method** ⭐',
                'RT-PCR · Real-time RT-PCR — molecular technique (หาสายพันธุ์ของเชื้อ)',
              ] },
            ] },
          { sub: 'Antibody detection (สำหรับ export)',
            body: [
              { bullets: [
                '**Fluorescent Antibody Viral Neutralization Test (FAVN)** — gold standard for export',
                '**ELISA** — commercial kit ราคาถูกกว่า ใช้ได้เฉพาะการติดตาม immune status หลังฉีดวัคซีนและงานสนับสนุนนโยบายกำจัดโรค ⚠️ WOAH **ไม่รับ ELISA** สำหรับการเคลื่อนย้ายสัตว์ระหว่างประเทศและการค้า ต้องเป็น VN method เท่านั้น คือ FAVN หรือ RFFIT — สไลด์เขียนว่า ELISA specific สูงเท่า FAVN',
                'ผลต้องมี ≥ 0.5 IU = มากกว่า standard ที่ทศก.กำหนด',
                'ใช้กรณี export สัตว์เลี้ยงไปประเทศ free of rabies (เช่น EU, AU)',
              ] },
            ] },
          { callout: 'Antigen detection สำคัญสุด — ใช้ในการวินิจฉัย rabies ในสัตว์ที่สงสัย', kind: 'tip' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-epi-approach': {
    topic: 'zoo-epi-approach',
    title: 'Epidemiological Approach to Zoonoses',
    lecturer: 'Saharuetai Jeamsripong',
    icon: '📊',
    summary: 'Epidemiology = study of distribution + determinants + application · 2 main types: Observational (descriptive + analytic) vs Experimental (clinical/field/community trial) · ใช้กับ AMR · chemical/biological contamination · zoonoses.',
    sections: [
      {
        heading: 'Course intro — Epidemiology + Zoonoses',
        source: '10 - Epidemiological_approach_to_zoonoses_2024_SJ.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Saharuetai Jeamsripong**, DVM, MPVM, PhD',
            'Department of Veterinary Public Health, Faculty of Veterinary Science, CU',
            'เอา epidemiology มาใช้ในงาน adaptive กับโรคอาจารย์ที่ไม่เกิน',
            'ตัวอย่าง application: AMR (antimicrobial resistance) · chemical/biological contamination · etc.',
          ] },
        ],
      },
      {
        heading: 'Definition of Epidemiology — 3 องค์ประกอบ',
        source: '10 - Epidemiological_approach_to_zoonoses_2024_SJ.pdf p.2',
        body: [
          'Study of the **distribution** and **determinants** of health-related states in specified populations, and the **application** of this study to prevent and control of health problems.',
          { sub: '1) Distribution — ก.กจ.ของโรค (magnitude + trend of dz)',
            body: [
              { bullets: [
                '**Prevalence** + **incidence** in specified period',
                'อาจรู้ว่าโรค กจ.บ่อย และอาจารย์ต้องดูจังหวะเสริม เคลื่อน',
              ] },
            ] },
          { sub: '2) Determinant — risk factors',
            body: [
              { bullets: [
                'Refer to **risk factors** (causal / not causal)',
                'บางอย่างไม่ขับ, แต่ดร, ก็ดู (หาความหายได้ ex. nhanis multifactorial)',
              ] },
            ] },
          { sub: '3) Application — prevention',
            body: [
              { bullets: [
                'Refer in part to **prevention of disease** by manipulating causal risk factors',
                'คาดประมาณก่อนะเกิดโรค',
                'แต่จากที่ไม่ขับว่ามัน 9-ระบาด ก็อาจเก็บ "หลัง" ระบาดเกิด ex. COVID',
              ] },
            ] },
        ],
      },
      {
        heading: 'Type of epidemiological study — 2 main branches',
        source: '10 - Epidemiological_approach_to_zoonoses_2024_SJ.pdf p.3',
        body: [
          { sub: 'A) Observational study (เก็บข้อมูลโดยไม่ intervene)',
            body: [
              { bullets: [
                '**Descriptive** (บรรยาย): Case report (case เดียว, รายงานอาการที่ใหม่/dx แบบใหม่) · Case series · Cross-sectional · Ecological · Longitudinal',
                '**Analytic** (วิเคราะห์ — มักทำกัน!): Cross-sectional (prevalence ratio/odds ratio) · Case-control (prevalence) · Cohort (relative risk)',
                'ตัวอย่าง: ก.มี.ระบาด ของ สัตว์ในเดือนนี้ไม่ได้ ก.ระบาดมาก่อน',
              ] },
            ] },
          { sub: 'B) Experimental study (มี intervention)',
            body: [
              { bullets: [
                'Intervention = anything ที่ไปใส่ลงๆ ex. ให้อาหาร, ให้ยา etc.',
                'ให้ผลแม่นยำ > observational — ใช้เวิร์น มาก เลย นิยมหา observational > experimental',
                '**Clinical trial** — anything ที่ทำในโรงพยาบาล',
                '**Field trial** — ทดลองใน field จริง',
                '**Community trial** — implement สัก ทป.ใน community ex. ให้เด็กกิน fluoride ในหมู่บ้านนี้',
              ] },
            ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '10 - Epidemiological_approach_to_zoonoses_2024_SJ.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — disease frequency measures (prevalence/incidence), measures of association (RR/OR), study design pitfalls (selection bias/confounding), outbreak investigation steps, zoonoses-specific epi (One Health surveillance, AMR monitoring)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-mycoses': {
    topic: 'zoo-mycoses',
    title: 'Mycozoonoses (Fungal Zoonoses)',
    lecturer: 'Suphachai Nuanualsuwan',
    icon: '🍄',
    summary: 'Mycozoonoses = รา/ยีสต์ ที่ติดต่อจากสัตว์สู่คน · Fungi = eukaryote (มี nucleus + mitochondria — ต่างจาก bacteria) · 2 forms: Yeast (unicellular, budding) + Mold (filamentous). ⭐ **Vet 82 final ตรงมาก** — สำคัญสุดในกลุ่ม final.',
    sections: [
      {
        heading: 'Mycozoonoses — title + course context',
        source: '11 - Z_Mycoses_3_Present.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Suphachai Nuanualsuwan**, DVM, MPVM, PhD',
            'จากศูนย์เชี่ยวชาญเฉพาะทาง FAWRA (Food and Water Risk Analysis)',
            '**Mycozoonoses** = รา ยีสต์ ที่ติดต่อจากสัตว์สู่คน',
            '⭐ **ข้อสอบ Vet 82 final "ตรงมาก"** — Mycozoonoses + Protozoa (ดู Z.pdf, Zoonosis Final Vet82 Myco Protozoa)',
          ] },
        ],
      },
      {
        heading: 'Fungi — basic biology',
        source: '11 - Z_Mycoses_3_Present.pdf p.2',
        body: [
          { sub: 'Fungi = Eukaryote',
            body: [
              { bullets: [
                'มี **nucleus + mitochondria** (cell แท้จริง — ต่างจาก bacteria ที่เป็น prokaryote)',
              ] },
            ] },
          { sub: '2 forms: Yeast + Mold',
            body: [
              { bullets: [
                '**Yeast** is **unicellular** (เซลล์เดี่ยว)',
                '**Mold** is **filamentous** (เป็นเส้นใย)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Yeast — appearance (culture + microscopic)',
        source: '11 - Z_Mycoses_3_Present.pdf p.3',
        body: [
          { bullets: [
            '**Yeast culture**: ลักษณะ colony ขึ้นกับ **ชนิดอาหารเลี้ยงเชื้อ** เสมอ — บน blood agar ตามสไลด์คือ กลม นูน เรียบ ส่วนบน CHROMagar Candida ขึ้นเป็น colony สีชมพูจาง จึงควรระบุ media กำกับทุกครั้งเวลาบรรยาย colony',
            '**Microscopic**: cell เดี่ยว, เพิ่ม จำนวนแบบ **budding** (แตกหน่อ)',
          ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+ (Sporotrichosis + อื่นๆ)',
        source: '11 - Z_Mycoses_3_Present.pdf p.4+ + 11.5 - Z_Mycoses_Text.pdf + 11.5 - Sporotrichosis_gr.11.pdf',
        body: [
          { bullets: [
            '🚧 รอเติม — Dermatophytosis (Microsporum, Trichophyton), Sporotrichosis (จาก slide 11.5 + student presentation), Cryptococcosis, Histoplasmosis, Candidiasis, Aspergillosis — clinical + dx + prevention',
            '📝 Note: Vet 82 final ออกตรงมาก → priority สูงในการเติม body content',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-prion': {
    topic: 'zoo-prion',
    title: 'Prion Diseases',
    lecturer: 'Taradon Luangtongkum',
    icon: '🧬',
    summary: 'Prion = TSE (Transmissible Spongiform Encephalopathy) · Neurodegenerative · ไม่ใช่ bacteria/fungi/virus — เป็น abnormal protein, no genetic material · Long incubation + rapidly progressive + always fatal · Human: CJD, vCJD, GSS, FFI, Kuru.',
    sections: [
      {
        heading: 'Prion Diseases — course intro',
        source: '12 - Prion_diseases_Zoonoses_(5th_year_student___2567).pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Taradon Luangtongkum**, DVM, PhD',
            'Dept. of Veterinary Public Health, Faculty of Veterinary Science, Chulalongkorn University',
          ] },
        ],
      },
      {
        heading: 'Introduction — what are prion diseases?',
        source: '12 - Prion_diseases_Zoonoses_(5th_year_student___2567).pdf p.2',
        body: [
          { bullets: [
            '**Prion diseases = Transmissible Spongiform Encephalopathies (TSE)**',
            'A family of **rare progressive neurodegenerative disorders** that affect both humans and animals',
            'Caused by an agent that is **neither bacteria nor fungi nor virus**',
            'An abnormal, transmissible agent that contains **no genetic material** (no DNA/RNA → หา PCR dx ไม่ได้)',
            '**Long incubation period** — ต่างจาก infectious dz อื่นๆ ที่หลายปี',
            '**Rapidly progressive** — หลังแสดงอาการป่วยโรค progressed ไว',
            '**Always fatal** — คนป่วยตายทุกคน, no Tx',
          ] },
          { callout: 'Prion = misfolded protein → induce normal PrP^C → PrP^Sc → vacuolation in brain → spongiform appearance', kind: 'tip' },
        ],
      },
      {
        heading: 'Human prion diseases — 5 known',
        source: '12 - Prion_diseases_Zoonoses_(5th_year_student___2567).pdf p.3',
        body: [
          { bullets: [
            '**Creutzfeldt-Jakob disease (CJD)** — เจอบ่อยที่สุดในกลุ่ม (1st)',
            '**variant Creutzfeldt-Jakob disease (vCJD)** — เกี่ยวข้องกับ BSE (mad cow disease) (2nd)',
            '**Gerstmann-Sträussler-Scheinker syndrome (GSS)** — เคยมีรายงาน',
            '**Fatal Familial Insomnia (FFI)** — เคยมีรายงาน',
            '**Kuru** — กินสมองคนตาย, เจอใน คน Papua New Guinea',
          ] },
          { callout: 'CJD เจอเอง · vCJD เกี่ยวกับ BSE (จากเนื้อวัว) — เป็น "true zoonosis" ของกลุ่ม prion', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+ (animal TSE + diagnosis)',
        source: '12 - Prion_diseases_Zoonoses_(5th_year_student___2567).pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Animal TSEs (BSE, Scrapie ในแกะ, CWD ในกวาง, FSE ในแมว), prion biology (PrP^C → PrP^Sc), pathogenesis, diagnosis (histopath, IHC, Western blot, PMCA), prevention (feed ban, surveillance), BSE crisis UK 1990s',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-bacterial': {
    topic: 'zoo-bacterial',
    title: 'Bacterial Zoonoses',
    lecturer: 'Taradon Luangtongkum',
    icon: '🧫',
    summary: 'Bacterial + Rickettsial infections — anthrax, brucellosis, strep, TB, salmonellosis, campylo, vibrio, colibacillosis, yersiniosis (foodborne) · Chlamydial (psittacosis) · Spirochaetal (leptospirosis, borreliosis). ⭐ **Vet 84 ออกซซดาว** — สำคัญสุด.',
    sections: [
      {
        heading: 'Bacterial Zoonoses — course intro',
        source: '1 - Bacterial_Zoonoses___2567.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Taradon Luangtongkum**, DVM, PhD',
            'Dept. of Veterinary Public Health, Faculty of Veterinary Science, Chulalongkorn University',
            '⭐ **ข้อสอบ Vet 84 "ออก ซซดาว"** — สำคัญสุดในกลุ่ม final',
            '📝 ดูใน "สรุป มีพาร์ทbact ซซดาวบันทึก84.pdf" + "2 Bacterial zoonoses ซซดาวบันทึก84.pdf"',
          ] },
        ],
      },
      {
        heading: 'Bacterial Zoonoses — main groups',
        source: '1 - Bacterial_Zoonoses___2567.pdf p.2',
        body: [
          { sub: 'Bacterial + Rickettsial infections',
            body: [
              { bullets: [
                '**Anthrax**, **brucellosis**, **streptococcal infections**, **zoonotic tuberculosis**, etc.',
                'Foodborne: **salmonellosis**, **campylobacteriosis**, **vibriosis**, **colibacillosis**, **yersiniosis**, etc.',
                'Rickettsial: **Q fever**, **ehrlichiosis**, **Rocky Mountain spotted fever**, **scrub typhus**, etc.',
              ] },
            ] },
          { sub: 'Chlamydial infections',
            body: [
              { bullets: [
                '**Psittacosis**, etc.',
              ] },
            ] },
          { sub: 'Spirochaetal infections',
            body: [
              { bullets: [
                '**Leptospirosis**, **borreliosis** (Lyme disease), etc.',
              ] },
            ] },
        ],
      },
      {
        heading: 'Taxonomic Hierarchy — example: Colibacillosis vs Q fever',
        source: '1 - Bacterial_Zoonoses___2567.pdf p.3',
        body: [
          { table: {
            headers: ['Rank', 'Colibacillosis', 'Q fever'],
            rows: [
              ['Domain', 'Bacteria', 'Bacteria'],
              ['Phylum', 'Proteobacteria', 'Proteobacteria'],
              ['Class', 'Gammaproteobacteria', 'Gammaproteobacteria'],
              ['Order', 'Enterobacterales (สไลด์เขียน Enterobacteriales)', 'Legionellales'],
              ['Family', 'Enterobacteriaceae', 'Coxiellaceae'],
              ['Genus', '*Escherichia*', '*Coxiella*'],
              ['Species', '*E. coli*', '*C. burnetii*'],
            ],
          } },
          { callout: 'จำง่าย: same domain หมดเลย แต่จะให้ดูว่ามันอยู่ order ใด → บอกว่าเป็น bacterial zoonosis', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+ (per-disease detail)',
        source: '1 - Bacterial_Zoonoses___2567.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — per-disease: agent + reservoir + transmission + clinical sign (human/animal) + dx + Tx + prevention',
            'Priority diseases (Vet 84 ออก ซซดาว): Anthrax · Brucellosis · TB · Leptospirosis · Salmonellosis · Streptococcus suis · Lyme · Q fever',
            '📝 Cross-check กับสรุป: "2 Bacterial zoonoses ซซดาวบันทึก84.pdf"',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-rickettsial': {
    topic: 'zoo-rickettsial',
    title: 'Rickettsial Zoonoses',
    lecturer: 'Kamonpan Charoenkul',
    icon: '🕷️',
    summary: 'Rickettsia — gram-negative obligate intracellular parasite · Vector-borne (ticks, mites, fleas, lice, chiggers) · 4 genera: Rickettsia, Ehrlichia, Orientia, Coxiella · Symptoms: fever, headache, rash + disseminate ไปหลายอวัยวะ.',
    sections: [
      {
        heading: 'Rickettsial Zoonoses — course intro',
        source: '2 - Rickettsial_Zoonoses_.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Kamonpan Charoenkul**, DVM, PhD',
            'Department of Veterinary Public Health, Faculty of Veterinary Sciences, Chulalongkorn University',
          ] },
        ],
      },
      {
        heading: 'Rickettsia — basic characteristics',
        source: '2 - Rickettsial_Zoonoses_.pdf p.2',
        body: [
          { bullets: [
            '**Gram-negative bacteria** — **obligate intracellular parasites** (อยู่ใน cell host เท่านั้น, growth in viable eukaryotic host cells)',
            'Found in **mammals + vectors** (ต้องอาศัย host/vector!)',
            '**Vector-borne** — vector ที่สำคัญ: **ticks (เห็บ), mites, fleas, lice, chiggers (หมัด หรือหรา)**',
          ] },
        ],
      },
      {
        heading: 'Rickettsial Zoonoses — 4 genera + clinical pattern',
        source: '2 - Rickettsial_Zoonoses_.pdf p.3',
        body: [
          { sub: '4 genera',
            body: [
              { bullets: [
                '***Rickettsia*** (e.g. Rocky Mountain spotted fever)',
                '***Ehrlichia*** (e.g. *E. canis*, etc.)',
                '***Orientia*** (e.g. scrub typhus — *O. tsutsugamushi*)',
                '***Coxiella*** (e.g. Q fever — *C. burnetii*)',
              ] },
            ] },
          { sub: 'Zoonotic pathogens — clinical pattern',
            body: [
              { bullets: [
                '**Spread through vectors**',
                '**Symptoms**: fever, headache, **rash** ⭐ (ลักษณะของผื่น depends on ชนิดเชื้อ), ปวดตามเนื้อตามตัว',
                '**Disseminate infection** in blood → to many organs (อวัยวะไหนติดเหลว ก่ออาการตามอวัยวะนั้นๆ)',
              ] },
            ] },
          { callout: 'Rash pattern (เช่น spotted vs typhus group) depends on ชนิดเชื้อ — รายละเอียดดูใน slide ต่อๆไป', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '2 - Rickettsial_Zoonoses_.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — spotted fever group vs typhus group, individual diseases (RMSF, Mediterranean spotted fever, murine typhus, scrub typhus Thailand, Q fever, ehrlichiosis canine/human), dx (Weil-Felix, IFA, PCR), Tx (doxycycline), vector control',
            '📝 Cross-check กับ "Rickettsia Very Short.pdf" ในสรุป',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-eid-wildlife': {
    topic: 'zoo-eid-wildlife',
    title: 'Emerging Zoonotic Diseases + Wildlife',
    lecturer: 'Paisin Lekcharoen',
    icon: '🦊',
    summary: 'Wildlife = reservoirs of pathogens — A reservoir host harbors agent ของโรค แต่ไม่จำเป็นต้อง develop disease (ex. bats + Ebola/SARS) · WWF "COVID-19 and the Rise of Zoonotic Infectious Diseases" → stop the next pandemic.',
    sections: [
      {
        heading: 'Course intro — Wildlife Epidemiology',
        source: '3 - Emerging_Zoonotic_Diseases_and_Wildlife_2024.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Paisin Lekcharoen**, DVM, MVSc (conservation medicine), DTBVPH',
            'Wildlife Epidemiologist',
            'Reference textbook: **"Emerging Zoonotic & Wildlife Pathogens — disease ecology, epidemiology, & conservation"** (Salkeld, Hopkins, Hayman — Oxford)',
          ] },
        ],
      },
      {
        heading: 'COVID-19 and the rise of zoonotic infectious diseases (WWF)',
        source: '3 - Emerging_Zoonotic_Diseases_and_Wildlife_2024.pdf p.2',
        body: [
          { bullets: [
            'WWF (World Wildlife Fund) campaign: **"COVID-19 and the Rise of Zoonotic Infectious Diseases"**',
            'Tagline: **"Stop the next pandemic"**',
            'Video reference: https://www.youtube.com/watch?v=JgA-CjgZTlw',
            'เน้นบทบาท wildlife ในการเป็น source ของ pandemic ใหม่',
          ] },
        ],
      },
      {
        heading: 'Wildlife as Reservoirs of Pathogens',
        source: '3 - Emerging_Zoonotic_Diseases_and_Wildlife_2024.pdf p.3',
        body: [
          { bullets: [
            'เป็นต้นกำเนิดของโรคคน หลายโรคเลย',
            'เป็นวุฒฯาห! = อาจารย์ไม่ใช่แค่สัตว์ชนิดเดียว',
            '**A reservoir host harbors an agent of a disease but often does not develop the disease**',
            'It will instead serve as a **habitat for the agent to grow, live, and reproduce**',
            'อาจ developed ได้ ex. **rabies** (raccoons, bats — ทั้ง reservoir + clinical)',
          ] },
          { callout: 'Reservoir ≠ Host: reservoir มัก asymptomatic; host clinical sign ออก — distinction สำคัญใน wildlife epi', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '3 - Emerging_Zoonotic_Diseases_and_Wildlife_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — wildlife reservoirs by pathogen (bats: SARS-CoV/MERS/Nipah/Hendra/Ebola/Marburg · rodents: hantavirus/lassa · primates: HIV/Ebola/yellow fever), spillover dynamics, disease ecology, conservation medicine, wildlife trade/wet markets, wildlife surveillance Thailand, One Health approach',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-helminthic': {
    topic: 'zoo-helminthic',
    title: 'Helminthic Zoonoses',
    lecturer: 'Piyanan Taweethavonsawat',
    icon: '🪱',
    summary: 'Helminth zoonoses — 3 groups: Trematode (Opisthorchiasis, Paragonimiasis), Cestode (รอเติม), Nematode (รอเติม).',
    sections: [
      {
        heading: 'Helminthic Zoonoses — course intro',
        source: '4 - Helminthic zoonoses.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Assoc. Prof. Dr. Piyanan Taweethavonsawat**',
            'DVM, MSc, PhD, DTBVP',
            'CUVET — Faculty of Veterinary Science, Chulalongkorn University',
          ] },
        ],
      },
      {
        heading: 'Outline — 3 helminth groups',
        source: '4 - Helminthic zoonoses.pdf p.2',
        body: [
          { bullets: [
            '**Helminthes**',
            '— **Trematode** (พยาธิใบไม้)',
            '— **Cestode** (พยาธิตัวตืด)',
            '— **Nematode** (พยาธิตัวกลม)',
          ] },
        ],
      },
      {
        heading: 'Trematode — 2 priority zoonoses',
        source: '4 - Helminthic zoonoses.pdf p.3',
        body: [
          { bullets: [
            '**Opisthorchiasis** (พยาธิใบไม้ตับ — *Opisthorchis viverrini*, สำคัญ ใน อีสาน, ก่อ cholangiocarcinoma)',
            '**Paragonimiasis** (พยาธิใบไม้ปอด — *Paragonimus*)',
          ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '4 - Helminthic zoonoses.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Trematode life cycles (Opisthorchis viverrini + Paragonimus westermani — IH/DH/eggs/cercaria), Cestode (Taenia solium/saginata, Echinococcus, Diphyllobothrium), Nematode (Trichinella, Toxocara, Ascaris, hookworms, Strongyloides, Anisakis), clinical sign + dx + Tx + prevention',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-eid-cuvet': {
    topic: 'zoo-eid-cuvet',
    title: 'EID Zoonoses in Thailand — Outbreak + Strategic Plans',
    lecturer: 'Soawapak Hinjoy',
    icon: '🚨',
    summary: 'Emerging zoonotic disease in Thailand — outbreak situation + strategic plans for prevention + control (Dept. of Disease Control, MoPH). EID timeline 1957-2022 (Dengue → COVID → Mpox). **75% of EID in humans is from animals**. ⭐ ซซดาวข้อสอบ.',
    sections: [
      {
        heading: 'EID Zoonoses in Thailand — course intro',
        source: '5 - EID_Zoonoses_CU_Vet ⭐️ซซดาวข้อสอบ.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Soawapak Hinjoy**, DVM, MSc, MPH, DrPH',
            'Office of International Cooperation, Department of Disease Control (กรมควบคุมโรค), Ministry of Public Health (กระทรวงสาธารณสุข), Thailand',
            '⭐ **ซซดาวข้อสอบ** (highlighted in filename — high priority)',
            'หัวข้อ: outbreak situation + strategic plans for prevention + control',
            '📝 Includes anthrax outbreak case study (วิชับ ก.จัดก. ก.anthraxออกละเอียด!)',
          ] },
        ],
      },
      {
        heading: 'Our journey in dealing with EIDs — timeline',
        source: '5 - EID_Zoonoses_CU_Vet ⭐️ซซดาวข้อสอบ.pdf p.2',
        body: [
          { bullets: [
            '**Epidemic = เริ่มก.คาดเดา** · น่ากลัวสุดคือ "ความไม่รู้"',
            'ตอนนี้เป็น **endemic** ไปแล้ว: ก็ไม่เคยเจอมาก่อน = emerging infectious dz',
            '**1957** — Dengue (ไข้เลือดออก) → ปัจจุบัน endemic',
            '**1970s** — Chikungunya',
            '**1984** — HIV (สมัยก่อนกลัวมาก, ตอนนี้ Tx ได้แล้ว)',
            '**1987** — VC O139 (cholera)',
            '**Late 1980s** — MDR-TB',
            '**1994** — Plague India',
            '**1999** — Nipah',
            '**2000s** — Antimicrobial Resistant',
            '**2002** — Anthrax hoax',
            '**2003** — SARS · **2004** — H5N1 · **2009** — H1N1',
            '**2010** — Cholera in Haiti · **2012** — MERS · **2013** — H7N9',
            '**2014** — Ebola in West Africa · **2016** — Zika',
            '**2018** — Ebola in DRC · **2019** — COVID-19 (ตอนนี้เป็น endemic ไปแล้ว)',
            '**2022** — Mpox (สมัยก่อนชื่อ monkeypox · สถานการณ์ในไทย ปัจจุบัน ≈ 10-20 คน/wk แต่สื่อตามไม่ค่อยลงข่าว, สังคมไม่ค่อยสนใจ)',
          ] },
        ],
      },
      {
        heading: 'Improving Integrated Surveillance for Early Detection of Zoonoses',
        source: '5 - EID_Zoonoses_CU_Vet ⭐️ซซดาวข้อสอบ.pdf p.3',
        body: [
          { bullets: [
            '**75% of EID in humans is from animals** ⭐ (core stat ที่ต้องจำ)',
            'พื้นฐานทำให้ vet สำคัญมาก ✨',
            'Pattern: สัตว์ป่า → สัตว์ท้องถิ่น → คน (ลำดับการ spillover)',
            'ตัวอย่าง: ทำไม่ส่อง surveillance ในกอ การะบาด',
          ] },
          { sub: 'Response framework — เมื่อพบ outbreak',
            body: [
              { bullets: [
                '1. Surge ทากคน — fast house, ทาวันตามก.กจ. ex. management supplies',
                'อาหารามารถไปทำการก.กับหน่ายงานอื่นๆ ได้',
                '📝 ดูใน "EOC" (Emergency Operation Center) framework',
              ] },
            ] },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+',
        source: '5 - EID_Zoonoses_CU_Vet ⭐️ซซดาวข้อสอบ.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — anthrax outbreak (recent case Thailand), surveillance system Thailand (DDC + DLD coordination), One Health Joint Plan of Action, IHR 2005, JEE assessment, strategic plans for major EIDs',
            '⭐ Priority สูงสุดในการเติม — Vet 86 ก็น่าจะออกอีก',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-protozoal': {
    topic: 'zoo-protozoal',
    title: 'Protozoal Zoonoses',
    lecturer: 'Woraporn Sukhumavasi',
    icon: '🦠',
    summary: 'Protozoal zoonoses — 4 major: Toxoplasmosis, Giardiasis, Cryptosporidiosis, Leishmaniosis · 4 types of parasitic zoonoses: Direct/Cyclo/Meta/Sapro · Sources: ground/water-borne/handling pets/meat-borne/vector-borne. ⭐ **Vet 82 final ตรงมาก**.',
    sections: [
      {
        heading: 'Protozoal Zoonoses — course intro',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Woraporn Sukhumavasi**, DVM, PhD',
            'Parasitology Unit, Department of Pathology, Faculty of Veterinary Science, Chulalongkorn University',
            'Email: vetkwan@hotmail.com',
            '⭐ **Vet 82 final ตรงมาก** — ดู "Zoonosis Final Vet82 Myco Protozoa ตรงมาก.pdf"',
          ] },
        ],
      },
      {
        heading: 'Outline of lecture',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.1',
        body: [
          { bullets: [
            'Type of parasitic zoonoses',
            'Veterinary public health on parasitic zoonoses',
            'List of zoonotic parasitic pathogens',
            'Source of zoonotic protozoal infection',
            'Selected major zoonotic protozoal diseases:',
            '— **Toxoplasmosis** (Toxoplasma gondii — tissue cyst forming coccidia)',
            '— **Giardiasis** (Giardia — waterborne, อยู่บ้าง endemic ใน TH, test kit มักเทสต์ร่วมกับ crypto)',
            '— **Cryptosporidiosis** (Cryptosporidium — oocyst ดื่มน้ำขนาดเล็กกว่า RBC)',
            '— **Leishmaniosis** (Leishmania — vector-borne sandfly, endemic ใน TH ในเตยอุ่น)',
          ] },
        ],
      },
      {
        heading: 'Type of parasitic zoonoses — 4 categories',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.1',
        body: [
          'Diseases of mankind associated with animal parasites · classified according to various **biological pathways** that lead to human infection.',
          { sub: '1) Direct zoonoses',
            body: [
              { bullets: [
                'Direct transfer from animal to human',
                'Example: *Cheyletiella* mites from an infested lap-dog (walking dandruff)',
              ] },
            ] },
          { sub: '2) Cyclozoonoses',
            body: [
              { bullets: [
                'Where humans **infect animals and vice versa** (rotation cycle)',
                'Example: Pork tapeworm (*Taenia solium*)',
              ] },
            ] },
          { sub: '3) Metazoonoses',
            body: [
              { bullets: [
                'Involve a **vector** as intermediary (พาหะ)',
                'Example: **Phlebotomine sandflies** carrying *Leishmania* from dogs to humans',
              ] },
            ] },
          { sub: '4) Saprozoonoses',
            body: [
              { bullets: [
                '**Indirect transfer via the environment**',
                'Example: Children playing on ground contaminated with *Toxocara* eggs from a dog',
              ] },
            ] },
        ],
      },
      {
        heading: 'Sources of zoonotic protozoal infection — 5 routes',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.3',
        body: [
          { table: {
            headers: ['Source', 'Protozoa involved'],
            rows: [
              ['The ground (soil)', 'Toxoplasma, Giardia, Cryptosporidium, Sarcocystis'],
              ['Water-borne', 'Giardia, Cryptosporidium, (Toxoplasma)'],
              ['Handling pets / litter tray', 'Toxoplasma, Giardia, Cryptosporidium'],
              ['Meat-borne', 'Toxoplasma, Sarcocystis'],
              ['Vector-borne (mosquito/sandfly/tsetse fly)', 'Leishmania, Trypanosoma, Babesia, Plasmodium'],
            ],
          } },
          { sub: '3 modes of transmission',
            body: [
              { bullets: [
                '① **Environmental zoonoses** (soil, water)',
                '② **Food-borne zoonoses** (อาหารที่กินดิบๆ → เนื้อไม่สุก, ผักล้างไม่สะอาด — เน้นเรื่องนี้ ex. หมู, ที่, ปลา, ผัก)',
                '③ **Vector-borne zoonoses** (mosquitoes, sandflies, ticks, stable flies, fleas, lice)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Major zoonotic protozoal diseases — list',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.2-3',
        body: [
          { table: {
            headers: ['Source', 'Cestode', 'Trematode', 'Nematode', 'Protozoa', 'Arthropod'],
            rows: [
              ['Plants', '—', 'Fasciola', '—', '—', '—'],
              ['Fish', 'Diphyllobothrium', 'Opisthorchis', 'Anisakis', '—', '—'],
              ['Meat', 'Spirometra, Taenia', '—', 'Trichinella', 'Toxoplasma, Sarcocystis', '—'],
              ['Ground', 'Echinococcus (hydatid + alveolar)', '—', 'Ascaris, Strongyloides, Toxocara, Baylisascaris, Hookworms', 'Toxoplasma, Giardia, Cryptosporidium, Sarcocystis', 'Many fleas, ticks, etc.'],
              ['Water-borne', 'Schistosoma', '—', '—', 'Giardia, Cryptosporidium', '—'],
              ['Air-borne', '—', '—', 'Fecal-derived eggs/oocysts in dust', '—', 'Many biting + myiasis flies'],
              ['Home', 'Echinococcus (hydatid)', '—', 'Toxocara (larva migrans)', 'Toxoplasma, Giardia, Cryptosporidium', 'Fleas, Rhipicephalus, Dermanyssus'],
              ['Handling pets', '—', '—', 'Toxocara (larva migrans)', 'Toxoplasma, Giardia, Cryptosporidium', 'Sarcoptes, Cheyletiella'],
              ['Vector-borne', '—', '—', 'Dirofilaria (larva)', 'Leishmania, Trypanosoma, Babesia', 'Dermatobia'],
            ],
          } },
          { callout: 'หลายโรค overlap หลาย source — มัก dx จาก clinical + history exposure', kind: 'tip' },
        ],
      },
      {
        heading: '🚧 รอเติม — body content จาก slide 4+ (per-disease detail)',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.4+ (Toxoplasmosis onwards)',
        body: [
          { bullets: [
            '🚧 รอเติม — **Toxoplasmosis** (tachyzoite/bradyzoite, tissue cyst, oocyst, cat as definitive host, pregnancy risk, dx serology/PCR, Tx pyrimethamine+sulfa)',
            '🚧 รอเติม — **Giardiasis** (cyst/trophozoite, waterborne, dx ZN stain/PCR/Ag test)',
            '🚧 รอเติม — **Cryptosporidiosis** (oocyst smaller than RBC, immunocompromised risk, dx ZN/IFA/PCR)',
            '🚧 รอเติม — **Leishmaniosis** (promastigote/amastigote, sandfly vector, cutaneous vs visceral, Thailand endemic, dx LST/serology/PCR)',
            '⭐ Priority สูง — Vet 82 final ออกตรงมาก',
          ] },
        ],
      },
    ],
  },
};

export default NOTES_Y5_ZOONOSES;
