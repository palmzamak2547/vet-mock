// ============================================================
// Y5 Zoonoses (3109504) Study Notes — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// แต่ละ lecture มี section ของ slide 1-3 และ section ท้ายที่ครอบคลุม
// slide 4 ถึงหน้าสุดท้ายของ deck ตาม `source` ของ section นั้น
//
// section ท้ายเขียนจากตัวพิมพ์บนสไลด์เท่านั้น: deck หลายไฟล์เป็นฉบับที่มี
// ลายมือจดทับ และลายมือไม่ได้ใช้เป็นแหล่งข้อมูล ไม่มีการเติมเนื้อหา
// จากตำราลงในตัวโน้ต จุดที่แหล่งอ้างอิงไม่ตรงกับสไลด์อยู่ใน
// src/lib/vetwiki/corrections.js
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
        heading: 'Zoonosis, EIDs, TADs, การจัดกลุ่มโรค และ One Health',
        source: '1 - 25_1._Intro_Zoonoses_updated_Aug_2024_SET_I-503004.pdf p.4-68',
        body: [
          { sub: 'Zoonosis และ Reverse zoonosis',
            body: [
              { bullets: [
                '**Zoonosis**: Animal-Human',
                '**Reverse zoonosis**: Human–Animal',
                '**Zoonosis** (WHO) คือ diseases and infections ที่ถ่ายทอดระหว่าง vertebrate animals กับคน ทั้งโดยตรงหรือโดยอ้อมผ่าน vector',
                '**Insect vector**: Arboviral zoonotic diseases',
                'ผลกระทบ: serious human health and economic impacts',
              ] },
              { sub: 'ตัวอย่างโรคตามกลุ่ม host',
                body: [
                  { bullets: [
                    'ส่วนที่ **Wildlife** กับ **Human** ซ้อนกัน: Lyme disease, Monkeypox, Hantavirus, Ebola, SARS, MERs, Nipah',
                    'ส่วนที่ **Human** กับ **Livestock** ซ้อนกัน: BSE (Bovine spongiform encephalopathy), E coli (*Escherichia coli*), Pox (Cowpox), Rift Valley fever',
                    'ส่วนที่ **Human**, **Wildlife** และ **Livestock** ซ้อนกันทั้ง 3 กลุ่ม: Rabies, WNV (West Nile Virus), TB (Tuberculosis), Anthrax, Tularemia, Plague, Salmonellosis, AI (Avian influenza), Brucellosis',
                    '**COVID-19** และ **SARS-CoV-2** อยู่ในส่วนที่ **Human**, **Wildlife** และ **Domestic & Captive & Farm animals** ซ้อนกัน',
                  ] },
                ] },
            ] },
          { sub: 'Emerging diseases (EIDs) และ Transboundary Animal Diseases (TADs)',
            body: [
              { sub: 'Emerging zoonotic diseases',
                body: [
                  { bullets: [
                    '**Emerging zoonotic diseases** คือ zoonosis ที่: newly recognize or newly evolved; exist but shows an increase in incidence or expansion in geographical, host or vector range',
                    'ลักษณะอื่น: high: public awareness; serious human health and economic impacts',
                  ] },
                ] },
              { sub: 'Transboundary Animal Diseases (TADs)',
                body: [
                  { bullets: [
                    '**TADs** คือ highly contagious epidemic diseases ที่ spread rapidly, irrespective of national borders',
                    'ก่อ high rates of death and disease ในสัตว์ และมี serious socio-economic and public health consequences',
                    'ตัวอย่าง **TADs** (FAO): Brucellosis, TB, Anthrax, FMD, Swine Fever, Influenza, ASF, AHS',
                    'FAO: **Transboundary animal diseases** เป็น highly contagious epidemic diseases ที่ can spread extremely rapidly, irrespective of national borders; ก่อ high rates of death and disease ในสัตว์ จึงมี serious socio-economic and sometimes public health consequences และเป็น constant threat to the livelihoods of livestock farmers',
                    'Globalization, land encroachment และ climate change มีส่วนทำให้เกิด outbreaks ของโรคสัตว์กลุ่มนี้ (บางโรคติดต่อสู่คนได้) เช่น brucellosis, bovine tuberculosis, parasitic illnesses, anthrax, bovine spongiform encephalopathy (BSE) และ certain strains of influenza viruses',
                    'High-impact animal diseases เช่น foot-and-mouth disease, peste des petits ruminants, classical or African swine fevers ไม่ได้ส่งผลต่อสุขภาพคนโดยตรง (not directly affecting human health) แต่กระทบ food and nutrition security และ livestock production and trade',
                    'Animal diseases มีศักยภาพทำให้ลดลง: quantity and quality of food (เช่น meat and milk), livestock products (hides, skins, fibres), animal power (traction, transport)',
                  ] },
                ] },
            ] },
          { sub: 'WHO: Influenza (avian and other zoonotic)',
            body: [
              { bullets: [
                '**Animal influenza viruses** ต่างจาก human seasonal influenza viruses และไม่ติดต่อระหว่างคนได้ง่าย',
                '**Zoonotic influenza viruses** คือ animal influenza viruses ที่อาจติดคนเป็นครั้งคราวผ่าน direct or indirect contact และก่อโรคในคนได้ตั้งแต่ mild illness ถึงเสียชีวิต',
                '**Birds** เป็น natural hosts ของ **avian influenza viruses**; หลัง outbreak ของ A(H5N1) virus ปี 1997 ใน poultry ที่ Hong Kong SAR, China ตั้งแต่ปี 2003 ไวรัส avian ตัวนี้และ influenza viruses อื่น (this avian and other influenza viruses) แพร่จาก Asia ไป Europe และ Africa',
                'ปี 2013 มีรายงานการติดเชื้อ influenza A(H7N9) virus ในคนที่ China',
                '**Swine influenza viruses** ส่วนใหญ่ไม่ก่อโรคในคน แต่บางประเทศรายงานผู้ติดเชื้อจาก swine influenza viruses บางสายพันธุ์',
                'ในผู้ป่วยส่วนใหญ่มีรายงานว่า close proximity to infected pigs หรือการไปสถานที่ที่มีการแสดงหมู (visiting locations where pigs are exhibited) แต่เคยมี limited human-to-human transmission บางส่วน',
                'สัตว์อื่น เช่น horses และ dogs ก็ติด influenza viruses ของตัวเองได้ เหมือน birds และ pigs (canine influenza viruses, equine influenza viruses, etc.)',
              ] },
            ] },
          { sub: 'WOAH (OIE)',
            body: [
              { bullets: [
                '**World Organisation for Animal Health (WOAH) (OIE)** ก่อตั้งปี **1924** (Founded in 1924); A century of improving animal health and welfare',
                'เมื่อ 100 ปีก่อน 28 founding nations มารวมกันเพื่อ shared purpose คือสุขภาพและ well-being ของสัตว์',
                '**Avian Influenza** (listed disease): avian influenza หรือ bird flu ส่งผลร้ายแรงต่อ poultry industry, farmer\'s livelihoods, international trade และสุขภาพของ wild birds',
                'เมื่อเกิด outbreak มักมี policy to cull all poultry ทั้งที่ติดเชื้อและไม่ป่วย (whether infected or healthy) เพื่อควบคุมการแพร่ของ avian influenza ซึ่งเป็น heavy economic losses ของเกษตรกรและมี long-lasting impact ต่อ livelihoods',
                'Poultry ไม่ใช่กลุ่มเดียวที่ได้รับผลกระทบ: **wild birds** มีบทบาทหลักในการแพร่โรค และก็เป็น victims ของ bird flu viruses ด้วย',
                'Avian influenza เป็น major concern for public health: เมื่อ avian influenza viruses circulate ใน poultry บางครั้งพบ sporadic cases ในคน',
              ] },
            ] },
          { sub: 'Zoonotic diseases classification',
            body: [
              { sub: 'Direction of infection',
                body: [
                  { bullets: [
                    '**Zooanthroponoses** — สัตว์ → คน ตามลูกศรบนสไลด์ ⚠️ ความหมายเดิมของคำนี้คือ คน → สัตว์ และสองคำนี้ถูกใช้กลับทิศกันจนเลิกใช้แล้ว',
                    '**Anthropozoonoses** — คน → สัตว์ ตามลูกศรบนสไลด์ ⚠️ ความหมายเดิมของคำนี้คือ สัตว์ → คน',
                    '**Amphixenoses** — สัตว์ → คน และ คน → สัตว์',
                  ] },
                ] },
              { sub: 'Transmission paths',
                body: [
                  { bullets: [
                    '**Direct zoonoses** — Host A → Host B',
                    '**Latent zoonoses** — Host A → Intermediate host (asymptomatic) → Host B',
                    '**Metazoonoses** — Host A → Intermediate host, vector (Avertebrate) → Host B',
                    '**Saprozoonoses** — Water, soil, plants etc. → Host A → Host B',
                    '**Cyclozoonoses** — Host A → Host B → possibly additional host แล้ววนกลับมา Host A',
                  ] },
                ] },
              { sub: 'Classification ตาม Agent',
                body: [
                  { bullets: [
                    '**Agent**: Viruses, Bacteria, Parasites, Fungi, Prions',
                    'รายชื่อโรคสำหรับฝึกจัดกลุ่มตาม Agent: Anthrax, Campylobacteriosis, Leptospirosis, Tuberculosis, Tularemia, Q fever, Influenza, Giardiasis, Taeniasis, Cysticercosis, MERS, Psittacosis, SARS-CoV-2, Chikungunya, West Nile, Zika, CJD, Arbovirus infection, Rabies, Yellow fever, SARS, Brucellosis, Schistosomiasis, Toxoplasmosis, Leishmaniasis, Trypanosomiasis, Lyme disease, Cryptococcosis, Salmonellosis, Dermatophytes infection, Monkey pox, *Plasmodium*, *Microsporum*',
                  ] },
                ] },
            ] },
          { sub: 'ตัวอย่าง EIDs และ TADs ที่ยกมา',
            body: [
              { sub: 'Avian influenza',
                body: [
                  { bullets: [
                    '**2004** — Avian Flu: Death Threat; Flu Fears: How Real Is the Threat of A Pandemic?',
                    'ตัวอย่าง **Avian Influenza** (Spread of H5N1 Influenza Virus): Rapid Spread, No national border, Economy & Public health',
                  ] },
                ] },
              { sub: 'SARS',
                body: [
                  { bullets: [
                    '**Severe Acute Respiratory Syndrome (SARs)** — **2005**; SARS: Can It Be Stopped? The New Age of Epidemics',
                    'ตัวอย่าง **SARs** (CDC): Rapid Spread, No national border, Economy & Public health',
                  ] },
                ] },
              { sub: 'H1N1 Swine flu',
                body: [
                  { bullets: [
                    '**2009** — H1N1 Swine flu',
                  ] },
                ] },
              { sub: 'Ebola',
                body: [
                  { bullets: [
                    '**2014** — Ebola outbreak',
                    '**Ebola — Signs and Symptoms**: fever, bloody diarrhoea, vomiting blood, muscle or joint pain, skin rash, bleeding; If You Have Fever, Diarrhoea and Vomiting With or Without Bleeding → GO IMMEDIATELY TO THE NEAREST HEALTH FACILITY',
                  ] },
                ] },
              { sub: 'Nipah',
                body: [
                  { bullets: [
                    '**2018 Nipah** — 10 confirmed dead from Nipah virus outbreak in India, including nurse treating patients; death toll ใน southern state of Kerala ขึ้นเป็น 10',
                    'Officials inspect a well to catch bats ใน Kozhikode district ของรัฐ Kerala หลัง outbreak',
                    'ตัวอย่าง **Nipah** (WHO): Rapid Spread, Specific host/reservoir, Public health',
                    'Nipahvirus outbreaks (1997-2008) และ home range ของ *Pteropus* genus of fruit bats',
                  ] },
                ] },
              { sub: 'Rabies',
                body: [
                  { bullets: [
                    '**2018 Rabies** — Thailand rushes to contain rabies outbreak หลัง spike in cases across the country',
                    '13 provinces are rabies red zones: virus kills 3 people, infects 247 animals in two months',
                    '**2018**: 17 Death (14 provinces) (Dec 2018)',
                    'การควบคุม: Vaccination, Population control, Pre, Post exposure Prophylaxis in human & animals, Public health education',
                  ] },
                ] },
              { sub: 'Coronavirus และ SARS-CoV-2',
                body: [
                  { bullets: [
                    '**2020-2021?** — Tracing the origins of the CORONAVIRUS',
                    'ที่มาของ **SARS-CoV-2**: common ancestor → change in evolutionary environment → switch to different host species หรือ switch to different bat tissue → selective change, reduced CpG (generalist nature) → multiple host switches และ recombination events within hosts → potential intermediate host หรือ direct bat transmission → SARS-CoV-2',
                    'บทความ: First cases of SARS-CoV-2 infection in dogs and cats in Thailand (Transboundary and Emerging Diseases)',
                  ] },
                ] },
              { sub: 'Monkeypox และ Mpox',
                body: [
                  { bullets: [
                    '**2022?** — องค์การอนามัยโลกเปลี่ยนชื่อ **ฝีดาษลิง** เป็น **เอ็มพอกซ์**',
                    '**Mpox** (สถานการณ์โรคฝีดาษวานรในไทย, ข้อมูล ณ วันที่ 08-Aug-24, รายงานผู้ติดเชื้อ ณ วันที่ 02-Aug-24): ยอดผู้ติดเชื้อรวม 822; เพศชาย 801 (97.45%), เพศหญิง 21 (2.55%)',
                    'ช่วงอายุ (ปี): 0-14 = 2, 15-19 = 3, 20-24 = 84, 25-29 = 175, 30-39 = 345, 40-49 = 178, 50-59 = 28, 60+ = 7',
                    'TOP5 อาการที่พบบ่อย: มีผื่น, มีไข้, ปวดกล้ามเนื้อ, ต่อมน้ำเหลืองโต, อาการคัน',
                    'กลุ่มสัญชาติ (Nationality Group): Thai 738, Asian 50, Non-Asian 30, Unknown 4',
                    'ผู้ติดเชื้อแต่ละจังหวัด 10 อันดับ: กรุงเทพมหานคร 441, ชลบุรี 74, นนทบุรี 42, สมุทรปราการ 31, ภูเก็ต 31, ปทุมธานี 25, ระยอง 24, เชียงใหม่ 23, สงขลา 12, ขอนแก่น 12',
                  ] },
                ] },
            ] },
          { sub: 'Factors contributing to Zoonoses, EIDs & TADs',
            body: [
              { bullets: [
                '**Human demographic changes**',
                '**Economic development and changes in the use of land**',
                '**International travel and commerce**',
                '**Evolution of pathogenic infectious agents**',
                '**Resistance of the vectors & infectious agents**',
                '**Deterioration in surveillance systems & Laboratory & Policy**',
              ] },
            ] },
          { sub: 'One Health',
            body: [
              { sub: 'One Health Approach: Trend in the Next decade',
                body: [
                  { bullets: [
                    '**One Health** — All linked: connections, impact, feedbacks, interactions ระหว่าง **Environmental Health**, **Human Health** และ **Animal Health** (Mission One Health)',
                    '**75%** human pathogens: Emerge every years',
                    '**60%** human diseases: Zoonotic',
                    '**75%** emerging diseases: From wildlife',
                    '**3 to 4 NEW** human pathogens emerge every year',
                  ] },
                ] },
              { sub: 'One Health Concept',
                body: [
                  { bullets: [
                    '**One Health** คือส่วนที่ **Environmental Health**, **Human Health** และ **Animal Health** ซ้อนกัน',
                    '**CU-EIDAs** (Center of excellence for emerging and re-emerging diseases in animals) เป็น research center focusing on emerging and re-emerging diseases in animals',
                    'Research outcome ของ CU-EIDAs ให้ basic and novel knowledge รวมถึง prevention and control measures ที่เกี่ยวกับ emerging and re-emerging diseases in humans and animals; ยังเน้น capacity building และ laboratory networking',
                  ] },
                ] },
              { sub: 'ONE Health Concept & Diseases Surveillance & monitoring ?',
                body: [
                  { bullets: [
                    '**Spillover** (Karesh et al., Lancet, 2012): จาก wild animal cases → domestic animal cases, จาก wild animal cases → human cases และจาก domestic animal cases → human cases; ในสัตว์เลี้ยงเกิด **Domestic animal amplification** และในคนเกิด **Human amplification**',
                    'ลำดับตาม Time (days): Forecasting readiness → Early detection → Control operations → Rapid response → Control benefits to animals และ Control benefits to people',
                  ] },
                  { callout: '**Diseases surveillance & monitoring**: Early detection, Early warning, Pandemic preparedness', kind: 'tip' },
                ] },
              { sub: 'EID control: One Health Institutional Map',
                body: [
                  { bullets: [
                    '**EID control: One Health Institutional Map** (OIE guideline, 2014) — หน่วยงานและภาคส่วน: OIE and WTO, Vet Statutory Body, Ministries, Veterinary Services, Private Vets, Human Health, Producers, Export Livestock Value Chain Stakeholders, Domestic Livestock Value Chain Stakeholders, Consumers',
                    'องค์ประกอบอื่น: Laws and Regulations, Attitudes and Expectations, Culture and Custom, Values',
                    'โรคที่ระบุคู่กับแผนผังนี้: H5N1; SARS/MERS/COVID-19',
                  ] },
                ] },
              { sub: 'Good model: One Health Approach',
                body: [
                  { bullets: [
                    'วงจร **SURVEILLANCE** นำไปสู่ **ACTION**; Disease reporting, Analysis and communication และ Information management เป็นส่วนหนึ่งของวงจร',
                    '**โรคไข้หวัดนก** หรือโรคไข้หวัดใหญ่สัตว์ปีก เป็นโรคติดต่อที่รุนแรงในนกป่าและสัตว์ปีกพื้นบ้าน เช่น ไก่ เป็ด ห่าน นกพิราบ และนกกระทา ซึ่งจะเริ่มป่วยและตายอย่างรวดเร็วทันทีที่ได้รับเชื้อ; เชื้อไวรัสชนิดนี้เรียกว่า **H5N1**',
                    'โรคไข้หวัดนกติดต่อข้ามสายพันธุ์สู่สัตว์ชนิดอื่นได้ เช่น หมู แมว และสุนัข; **เป็ด** ติดเชื้อได้โดยไม่แสดงอาการ และอาจเป็นพาหะแพร่เชื้อไวรัสไข้หวัดนกสู่ไก่ได้',
                    'ระวัง! อันตราย! อย่าสัมผัส หรือเล่นกับสัตว์ปีกที่ป่วยและตาย',
                    'ประกาศกระทรวงเกษตรและสหกรณ์ ป้องกันไข้หวัดนก: พบสัตว์ปีกป่วย/ตายผิดปกติ ให้รีบแจ้งปศุสัตว์/เจ้าหน้าที่ทันที; ห้ามจับซากสัตว์ด้วยมือเปล่าเด็ดขาด',
                    'ประกาศเดียวกัน: ทำลายซากสัตว์ด้วยการฝังดินลึก 1 เมตร; ห้ามฝังใกล้แหล่งน้ำ หรือทิ้งลงน้ำเด็ดขาด; หลังทำลายซากสัตว์ต้องอาบน้ำ/ซักเสื้อผ้าที่สวมทันที; ห้ามดูดเสลด เลือดหัวไก่ชน; ห้ามจำหน่ายสัตว์ที่ป่วย/ตายโดยเด็ดขาด',
                    'ข่าว: ทีมสัตวแพทย์จุฬาฯ ลงพื้นที่สมุทรสาคร ตรวจโควิด หมา-แมว — วันที่ 14 กุมภาพันธ์ 2564 ทีมแพทย์จากคณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ลงพื้นที่ที่องค์การบริหารส่วนตำบลท่าทราย (อำเภอเมือง จังหวัดสมุทรสาคร) ตรวจเชิงรุกเพื่อเฝ้าระวังโรคโควิด-19 ในสุนัขและแมว',
                    'ประสานความร่วมมือกับองค์การบริหารส่วนตำบลท่าทราย ซึ่งประชาสัมพันธ์ให้ประชาชนในพื้นที่นำสุนัขและแมวเข้ารับการตรวจโดยไม่มีค่าใช้จ่าย',
                    'สื่อ **Fact sheet COVID-19 in Pets** (CU-EIDAs): สัตว์เลี้ยงปลอดภัย ห่างไกลโควิด-19, หมาแมวติดโควิด-2019 ได้หรือไม่?; ปรึกษาสัตวแพทย์ หรือโทรปรึกษาศูนย์เชี่ยวชาญเฉพาะทางโรคอุบัติใหม่และอุบัติซ้ำในสัตว์ (โควิด-19 ในสัตว์)',
                  ] },
                ] },
            ] },
          { sub: 'องค์กรและเอกสารที่อ้างถึง One Health',
            body: [
              { sub: 'US-CDC',
                body: [
                  { bullets: [
                    '**One Health Day** — November 3 (3 พฤศจิกายน)',
                    'Promoting efforts around the world to bring together all human, animal, and environmental health disciplines',
                  ] },
                ] },
              { sub: 'SEAOHUN',
                body: [
                  { bullets: [
                    '**SEAOHUN** — Southeast Asia One Health University Network',
                    'SEAOHUN 2022 International Conference (Catalyzing One Health Citizens of the Future): 5-7 September 2022, Grand Richmond Hotel, Thailand',
                  ] },
                ] },
              { sub: 'THOHUN',
                body: [
                  { bullets: [
                    '**THOHUN** — Thailand One Health University Network',
                    'THOHUN News: Call for Application THOHUN Scholarships 2022 for SEAOHUN International Conference 2022; Call for co-funding and joint projects on One Health approach; Call for application International Short Course on Ecosystem Health (THOHUN-TELI) 2022',
                  ] },
                ] },
              { sub: 'FVE, AVMA',
                body: [
                  { bullets: [
                    '**Day One Competences** 1.10: Use their professional capabilities to contribute to the advancement of veterinary knowledge and One Health concept, in order to improve animal health and welfare, the quality of animal care and veterinary public health',
                    '**Food Safety and Quality, Veterinary Public Health and One Health Concept**: Veterinary legislation including official controls, regulatory veterinary services, forensic veterinary medicine and certification; Control of food, feed and animal by-products; Zoonoses; Food hygiene and food microbiology; Food technology',
                    'EAEVE (European Association of Establishments for Veterinary Education): vision คือ veterinary education, based on high quality standards, research and innovation, เป็น key component ของ veterinary profession in the service of One Health and its recognition by society',
                  ] },
                ] },
              { sub: 'OIE',
                body: [
                  { bullets: [
                    'เอกสาร **OIE recommendations on the Competencies of graduating veterinarians (\'Day 1 graduates\') to assure National Veterinary Services of quality**: สัตวแพทย์ทุกประเทศรับผิดชอบต่อการจัดบริการ National Veterinary Services',
                    '**National Veterinary Services** คือบริการที่จัดภายใต้ legislative framework และ auspices of the governmental authority ของประเทศ เพื่อ implement animal health ให้มั่นใจถึง health and wellbeing ของ animals, people and ecosystems',
                    '**Veterinary Services** ตามคำนิยามของ OIE Terrestrial Animal Health Code (Terrestrial Code) รวมทั้ง public และ private components ของวิชาชีพสัตวแพทย์ที่ทำหน้าที่ส่งเสริม animal and public health รวมถึง animal welfare',
                    'National Veterinary Services ควรเป็นไปตามมาตรฐานที่แต่ละประเทศกำหนด และควรปฏิบัติตาม international standards and recommendations ที่เหมาะสม โดยเฉพาะของ OIE Terrestrial Code',
                    'ในการให้บริการ National Veterinary Services สัตวแพทย์เป็น **integral partner** ใน One Health effort — a collaboration of multiple disciplines working locally, nationally, and globally, to address critical challenges and attain optimal health for people, animals (domestic and wild) and the environment',
                  ] },
                ] },
              { sub: 'MOPH-กรมควบคุมโรค',
                body: [
                  { bullets: [
                    'เครือข่าย สุขภาพหนึ่งเดียว เรียนรู้จากประสบการณ์ ร่วมประกาศเจตนารมณ์เดินหน้าสร้างความร่วมมือด้านสุขภาพหนึ่งเดียวในปัจจุบัน เพื่อความยั่งยืนของสุขภาพองค์รวม ทั้งสุขภาพคน สัตว์ สัตว์ป่า และสิ่งแวดล้อม',
                  ] },
                ] },
              { sub: 'CU research cluster: One Health',
                body: [
                  { bullets: [
                    'Research cluster One Health มี overall goal คือ applying one health concept to promote human health, animal health and environment',
                    'งานวิจัยเกี่ยวข้องกับ 1) One health in emerging and re-emerging zoonotic diseases (EID), 2) One health in antimicrobial resistance (AMR), 3) One health in food safety and food security (FSFS)',
                    'ดำเนินการโดย researchers and expertise from multi-disciplinary of Chulalongkorn university (organized by faculty of Medicine and Veterinary Science)',
                    'Outcome: novel knowledge and high impact research publications related to emerging and re-emerging diseases in humans and animals, food production and food safety by using one health approach; รวมถึง training for young and expertise researchers, networking for one health researches และ pandemic preparedness for emerging diseases in the future',
                    '**Director Strategic Area**: 1. support, implement and conduct researches related to one health in Thailand; 2. conduct investigation, monitoring and surveillance of emerging and reemerging diseases, AMR and Food safety; 3. establish lab networking both national and international level; 4. train skill researchers and scientist in one health',
                  ] },
                ] },
            ] },
          { sub: 'Setting ของสัตว์และตลาดที่ยกมา',
            body: [
              { bullets: [
                '**Backyard animals**',
                '**Free grazing ducks**',
                '**Unique setting (Live bird markets)**',
              ] },
            ] },
          { sub: 'รพ.สต., อสม. และ อสป.',
            body: [
              { bullets: [
                '**โรงพยาบาลส่งเสริมสุขภาพตำบล**: ถ่ายโอนภารกิจ รพ.สต. ให้องค์การบริหารส่วนจังหวัด มีผลตั้งแต่วันที่ 19 ต.ค. 2564',
                '**อสม** — Village Health Volunteer',
                '**อสป** — Village Livestock Volunteer',
                'คู่มืออบรมอาสาปศุสัตว์ ด้านโรคพิษสุนัขบ้า ประจำปี 2563-2; ประกาศรับสมัครอาสาปศุสัตว์ (อสป.ม.)',
              ] },
            ] },
          { sub: 'CU-EIDAs: เว็บไซต์ Facebook หนังสือและโปสเตอร์',
            body: [
              { bullets: [
                '**EIDAs** — Center of Emerging and Re-emerging Infectious Diseases in Animals, Faculty of Veterinary Science Chulalongkorn University: www.eidas.vet.chula.ac.th',
                'Facebook: www.facebook.com/cueidas; มี Book & Posters',
              ] },
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
    summary: 'Coronaviruses 4 genus (Alpha/Beta/Gamma/Delta) — Beta ก่อ pandemic ในช่วง 20 ปี (SARS, MERS, COVID-19), Alpha ส่วนใหญ่ก่อโรค enteric ในสัตว์, Gamma+Delta ในนก/สัตว์น้ำ.',
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
        heading: 'SARS, MERS, SARS-CoV-2: origin, host และการติดเชื้อในสัตว์',
        source: '2 - Coronaviruses_Vet_student_yr.5_2024.8.15.pdf p.4-42',
        body: [
          { sub: 'SARS-CoV, MERS-CoV, SARS-CoV-2: ภาพรวมเปรียบเทียบ',
            body: [
              { table: {
                headers: ['หัวข้อ', 'SARS-CoV', 'MERS-CoV', 'SARS-CoV-2'],
                rows: [
                  ['First report', 'China', 'Saudi Arabia', 'China'],
                  ['Infection', '8,096 (slide 4, 5); 8,098 (slide 9, 18)', '2,581 (slide 4, 12-14); 2,574 (ชื่อกราฟ slide 12)', '775 M (slide 4, 19-21); 281M (slide 22, 23)'],
                  ['Deaths', '774', '866', '7.1 M (slide 4, 19-21); 5.4M (slide 22, 23)'],
                  ['Countries (reported cases)', '29', '27', 'Worldwide'],
                  ['Receptor', 'ACE2', 'DPP4', 'ACE2'],
                  ['Origin', 'Bats', 'Bats', 'Bats'],
                  ['Intermediate Host', '—', '—', 'pangolin?'],
                ],
              } },
              { bullets: [
                'SARS-CoV, MERS-CoV และ SARS-CoV-2 ถูกกำกับว่าเป็น Betacoronaviruses',
              ] },
            ] },
          { sub: 'SARS-CoV',
            body: [
              { sub: 'Timeline ปี 2002-2003 และจำนวนผู้ป่วย',
                body: [
                  { bullets: [
                    '**November 16, 2002** — 1st patient with 4 family members (1st cluster) ใน Guangdong city',
                    '**Dec 2002 - Jan 2003** — More than 250 SARS cases in Guangdong Province',
                    '**Feb 28, 2003** — Dr.Carlo Urbani (WHO officer) examine a pneumonia case in Hanoi, Vietnam',
                    '**March 10, 2003** — Dr.Urbani named Severe Acute Respiratory Syndrome (SARS) and alert to WHO',
                    '**March 12-15, 2003** — WHO issues a global alert of SARS (outbreak in Vietnam, Hong Kong, Singapore and Canada)',
                    '**March 24, 2003** — CDC present the coronavirus might be likely cause of SARS',
                    '**March 29, 2003** — Dr.Urbani died from SARS in Thailand',
                    '**April 9, 2003** — WHO investigative team gives initial report on Guangdong outbreak',
                  ] },
                  { table: {
                    headers: ['Areas', 'Cases', 'Deaths'],
                    rows: [
                      ['Australia', '6', '0'],
                      ['Canada', '251', '43'],
                      ['China', '5327', '349'],
                      ['Hong Kong', '1755', '299'],
                      ['Macao', '1', '0'],
                      ['Taiwan', '346', '37'],
                      ['France', '7', '1'],
                      ['Germany', '9', '0'],
                      ['India', '3', '0'],
                      ['Indonesia', '2', '0'],
                      ['Italy', '4', '0'],
                      ['Kuwait', '1', '0'],
                      ['Malaysia', '5', '2'],
                      ['Mongolia', '9', '0'],
                      ['New Zealand', '1', '0'],
                      ['Philippines', '14', '2'],
                      ['Ireland', '1', '0'],
                      ['Korea', '3', '0'],
                      ['Romania', '1', '0'],
                      ['Russia', '1', '0'],
                      ['Singapore', '238', '33'],
                      ['South Africa', '1', '1'],
                      ['Spain', '1', '0'],
                      ['Sweden', '5', '0'],
                      ['Switzerland', '1', '0'],
                      ['Thailand', '9', '2'],
                      ['UK', '4', '0'],
                      ['United States', '27', '0'],
                      ['Viet Nam', '63', '5'],
                      ['Total', '8096', '774'],
                    ],
                  } },
                ] },
              { sub: 'Origin and Intermediate host',
                body: [
                  { bullets: [
                    'Science (10 October 2003): **Isolation and Characterization of Viruses Related to the SARS Coronavirus from Animals in Southern China**',
                    'The early cases of SARS in Guangdong reportedly occurred in restaurant workers handling wild mammals as exotic food',
                    'Focusing on wild animals market: this study investigated a live animal retail market in Shenzhen',
                    'Nasal and fecal swabs from 25 animals ถูกตรวจ SARS-CoV viral nucleic acid ด้วย RT-PCR สำหรับ N gene ของ human SARS-CoV',
                    'Live wild mammals in a retail market บ่งชี้ route of interspecies transmission (unknown natural reservoir)',
                    '**Antibodies to SARS Coronavirus in Civets**: ~80% ของสัตว์จาก animal market ใน Guangzhou มี SARS-CoV Ab',
                    'No widespread among farmed civets',
                    'The market-civets might be associated with trading activities under the overcrowding conditions and mixing of various animal species',
                    'Science (28 October 2005): **Bats Are Natural Reservoirs of SARS-Like Coronaviruses** — Mar-Dec 2004, 408 bats in China were collected swab and blood samples',
                    'One fecal samples (No. Rp3) obtained complete genome sequence; 92% genetic similarity between SL-CoV Rp3 and SARS-CoV Tor2',
                    'Rp = *Rhinolophus pearsoni* (Pearson\'s Horseshoe Bat)',
                    'PNAS (September 27, 2005): **Severe acute respiratory syndrome coronavirus-like virus in Chinese horseshoe bats** — nasopharyngeal and anal swabs from 29/127 bats, 60 rodents, and 20 monkeys were obtained from rural areas in the HK',
                    '39% (23/59) anal swabs of wild Chinese horseshoe bats (*Rhinolophus sinicus*) were identified as bat-SARS CoV; 88% nucleotide identities to SARS-CoV',
                  ] },
                ] },
            ] },
          { sub: 'MERS-CoV',
            body: [
              { sub: 'ผู้ป่วยรายแรก จำนวนผู้ป่วย และประเทศที่รายงาน',
                body: [
                  { bullets: [
                    'N Engl J Med 367;19 (November 8, 2012): **Isolation of a Novel Coronavirus from a Man with Pneumonia in Saudi Arabia**',
                    'June 13, 2012: A 60-year-old Saudi man was admitted with acute pneumonia and subsequent renal failure',
                    'Sputum sample was examined: Influenza A and B, Parainfluenza viruses types 1 to 3, Respiratory syncytial virus, Adenovirus, Human metapneumovirus, Human herpesvirus types 1 to 3, Paramyxoviruses (ทุกรายการนี้มีเครื่องหมายกากบาทกำกับ) และ Coronavirus (มีเครื่องหมายถูกสีแดงกำกับ)',
                    '**Confirmed global cases of MERS-CoV** (Reported to WHO as of 03 Aug 2021, n=2574); ตารางรายประเทศและการ์ดใน slide 12-14 รวม 2,581 ราย',
                  ] },
                  { table: {
                    headers: ['Area', 'Country', 'Cases'],
                    rows: [
                      ['Middle East', 'Saudi Arabia', '2180'],
                      ['Middle East', 'UAE', '93'],
                      ['Middle East', 'Jordan', '28'],
                      ['Middle East', 'Qatar', '23'],
                      ['Middle East', 'Oman', '24'],
                      ['Middle East', 'Iran', '6'],
                      ['Middle East', 'Kuwait', '4'],
                      ['Middle East', 'Lebanon', '2'],
                      ['Middle East', 'Yemen', '1'],
                      ['Middle East', 'Bahrain', '1'],
                      ['Asia', 'Republic of Korea', '186'],
                      ['Asia', 'Philippines', '2'],
                      ['Asia', 'Thailand', '3'],
                      ['Asia', 'China', '1'],
                      ['Asia', 'Malaysia', '2'],
                      ['Europe', 'United Kingdom', '5'],
                      ['Europe', 'Germany', '3'],
                      ['Europe', 'Netherlands', '2'],
                      ['Europe', 'France', '2'],
                      ['Europe', 'Austria', '2'],
                      ['Europe', 'Turkey', '1'],
                      ['Europe', 'Italy', '1'],
                      ['Europe', 'Greece', '1'],
                      ['Americas', 'US', '2'],
                      ['Africa', 'Tunisia', '3'],
                      ['Africa', 'Algeria', '2'],
                      ['Africa', 'Egypt', '1'],
                      ['—', '—', '2,581'],
                    ],
                  } },
                  { bullets: [
                    '**Republic of Korea**: Total 186 cases, including 38 fatalities',
                    'Index case: Travelled to Bahrain, KSA, UAE → Home in Korea → Hospital A → Hospital B → Hospital C → Isolation Facility',
                    'ข่าวไทย: วันที่ 15 มิถุนายน 2558 ชายชาวโอมานลงเครื่องบินที่สุวรรณภูมิ แล้วนั่งรถลิมูซีนไปโรงแรมแห่งหนึ่งย่านสุขุมวิท จากนั้นนั่งรถแท็กซี่ธรรมดาไปขอรับการตรวจรักษาที่โรงพยาบาลเอกชนแห่งหนึ่ง',
                    'แรกรับมีอาการไอ หายใจลำบาก ไม่มีไข้ แต่ผลถ่ายภาพเอ็กซ์เรย์ทรวงอกเข้าได้กับโรคปอดบวม แพทย์จึงรับไว้รักษาในห้องแยกโรคความดันลบ และเก็บตัวอย่างส่งตรวจหาการติดเชื้อโรคทางเดินหายใจตะวันออกกลาง (เมอร์ส) ทันที',
                    'ข่าว: สธ.ประกาศไทยปลอดเมอร์ส',
                  ] },
                ] },
              { sub: 'Origin and Intermediate host',
                body: [
                  { bullets: [
                    'Emerging Infectious Diseases (Vol. 19, No. 11, November 2013): **Middle East Respiratory Syndrome Coronavirus in Bats, Saudi Arabia**',
                    'October 2012, 96 bats <12 km from index case-patient house were investigated',
                    'One bat showed 100% nucleotide identity to virus from the human index case-patient',
                    'Bats might play a role in human infection',
                    'mBio (March/April 2014): **Middle East Respiratory Syndrome Coronavirus Infection in Dromedary Camels in Saudi Arabia**',
                    'MERS coronaviruses have been circulating in camels since at least 1992',
                    'No evidence of infection in domestic sheep or domestic goats',
                    'TABLE 2 — Analysis of archived DC sera from the KSA from 1992 to 2010',
                  ] },
                  { table: {
                    headers: ['Yr', 'Location', 'Age group', 'No.', '% Seropositive (no. positive/total)'],
                    rows: [
                      ['1992', 'Riyadh', 'Adult', '1', '100 (1/1)'],
                      ['1993', 'Riyadh', 'Adult', '2', '100 (2/2)'],
                      ['1994', 'Empty quarter', 'Adult', '123', '93 (114/123)'],
                      ['1996', 'Riyadh', 'Adult', '6', '100 (6/6)'],
                      ['2004', 'Riyadh', 'Adult', '6', '100 (6/6)'],
                      ['2009', 'Riyadh', 'Juvenile', '56', '72 (40/56)'],
                      ['2009', 'Rumah', 'Adult', '26', '92 (24/26)'],
                      ['2010', 'Riyadh', 'Juvenile', '21', '76 (16/21)'],
                      ['2010', 'Kharj', 'Adult', '23', '91 (21/23)'],
                    ],
                  } },
                  { bullets: [
                    'Dromedary (*Camelus dromedarius*) และ Bactrian camel (*Camelus bactrianus*): Conservation status Domesticated',
                    '**Absence of MERS-Coronavirus in Bactrian Camels, Southern Mongolia, November 2014**',
                    'Bactrian camels จาก southern Mongolia (nasal swab and serum specimens): รวมทุก herd, Age, y: ≤1 = 25, 2-4 = 48, ≥5 = 127; No. sampled/no. total in herd = 200/491',
                  ] },
                ] },
            ] },
          { sub: 'SARS-CoV-2',
            body: [
              { sub: 'จุดเริ่มต้นและ timeline ของ WHO',
                body: [
                  { bullets: [
                    'The majority of early cases of COVID-19 can be traced to the Huanan seafood market in Wuhan; The likely point of origin',
                    '**31 Dec 2019** — Wuhan Municipal Health Commission reported a cluster of cases of pneumonia in Wuhan; a novel coronavirus was eventually identified',
                    '**5 January 2020** — WHO published first Disease Outbreak News; a flagship technical publication to the scientific and public health community: The risk assessment, The public health response on the cluster of pneumonia cases in Wuhan',
                    '**12 January 2020** — China publicly shared the genetic sequence of COVID-19',
                    '**13 January 2020** — Officials confirm a case of COVID-19 in Thailand, the first recorded case outside of China',
                    '**30 January 2020** — WHO reported 7818 total confirmed cases worldwide in 19 countries; WHO gave a risk assessment of high at the global level',
                    '**11 March 2020** — WHO made the assessment that COVID-19 can be characterized as a pandemic',
                  ] },
                ] },
              { sub: 'Origin and intermediate host',
                body: [
                  { bullets: [
                    'Nature (12 March 2020): **A pneumonia outbreak associated with a new coronavirus of probable bat origin**',
                    '96% identical at the whole-genome level between 2019-nCoV and a bat coronavirus RaTG13 (the horseshoe bat; *Rhinolophus affinis* isolated in 2013 in Yunnan, China)',
                    'The close phylogenetic relationship to RaTG13 provides evidence that 2019-nCoV may have originated in bats',
                    '2019-nCoV uses the same receptor angiotensin converting enzyme II (ACE2) as SARS-CoV',
                    'Nature (9 July 2020): **Identifying SARS-CoV-2-related coronaviruses in Malayan pangolins**',
                    'Frozen tissue samples from 18 Malayan pangolins (August 2017–January 2018)',
                    '6/43 samples: coronaviruses from 5 individual pangolins',
                    'Pangolins have been considered as possible hosts of new coronaviruses',
                    'Pangolins should be removed from wet markets to prevent zoonotic transmission',
                    'Nature Communications (9 February 2021): **Evidence for SARS-CoV-2 related coronaviruses circulating in bats and pangolins in Southeast Asia**',
                    'SARS-CoV-2 related coronaviruses (SC2r-CoVs) actively circulating in bats in Southeast Asia',
                    'SARS-CoV-2 neutralizing antibodies were detected in bats and in a pangolin in Southern Thailand',
                    'Cross-border surveillance is urgently needed to find progenitor virus of SARS-CoV-2',
                  ] },
                ] },
            ] },
          { sub: 'SARS-CoV-2 in animals',
            body: [
              { sub: 'สุนัขและแมวในไทย',
                body: [
                  { bullets: [
                    'New COVID-19 cases in Thailand, by date of reporting (Source: MoPH, 3 Jun 2021): 1st Wave, 2nd Wave, 3rd Wave (Beta variant)',
                    'Transboundary and Emerging Diseases: **Serological survey of antibodies against SARS-CoV-2 in dogs and cats, Thailand**',
                    'April to December 2020; Total 3215 sera: dogs (n = 2102) and cats (n = 1113); Bangkok and in the vicinities',
                    'Anti-N-IgG ELISA positive: 1.66% (35/2103) of dogs and 0.36% (4/1112) of cats',
                    'Neutralizing antibodies by sVNT: 0/39',
                    'Zoonoses Public Health (2022 Jan 4): **Survey of SARS-CoV-2 in dogs and cats in high-risk areas during the second wave of COVID-19 outbreak, Thailand**',
                    'Samut Sakhon as the epicenter of outbreak',
                    'ข่าว: ทีมสัตวแพทย์จุฬาฯ ลงพื้นที่สมุทรสาคร ตรวจโควิด หมา-แมว',
                    'Dogs (83) and cats (93) in Samut Sakhon province',
                    '0/523 swab samples (nasal, oral, and rectal swabs)',
                    '3.14% (5/159) had anti-N-IgG of SARS-CoV-2 by ELISA; 0/5 were positive neutralizing antibodies by sVNT',
                    'Transboundary and Emerging Diseases: **First cases of SARS-CoV-2 infection in dogs and cats in Thailand**',
                    '4/17 (23.53%) COVID-19 households found animals positive',
                    '3/35 (8.6%) dogs and 1/9 (11.1%) cat',
                    '**Dog A** (CU27042N) — 5 May 2021: 15-year-old, mixed breed; right hindlimb amputation from fibrosarcoma (right metatarsus); senile disorder: degenerative mitral valve disease (stage B1), multiple hepatic masses; อาการทางเดินหายใจเล็กน้อย: serous nasal discharge, sneezing, coughing; self recovery',
                    '**Cat B** (CU27081N) — 7 May 2021: 1-3 year-old, DSH breed; ไม่มีอาการ (No any symptoms); self recovery',
                    '**Dog C** (CU27184N) — 19 May 2021: 2 year-old, mixed breed; ไม่มีอาการ (No any symptoms); self recovery',
                    '**Dog D** (CU27186N) — 19 May 2021: 4 year-old, Pomeranian breed; ไม่มีอาการ (No any symptoms); self recovery',
                    'ข้อมูลสัตว์แต่ละตัว: Dog A 15 years-old, 20 Kg, mixed breed castrated male dog; Cat B 1 year-old, 3 Kg, DSH breed intact male cat; Dog C 2 years-old, 6 Kg, mixed breed spayed female dog; Dog D 4 years-old, 2.7 kg, Pomeranian spayed female dog',
                    'Genome SARS-CoV-2 ของ dog-A, cat-B และ dog-C เป็น **B.1.1.7 lineage** ซึ่งเป็น lineage ของ 3rd wave outbreak',
                    'Phylogenetic tree: 1st wave (A.6), 2nd wave (B.1.36.16), 3rd wave (B.1.1.7)',
                    '**SARS-CoV-2 delta variant infection in domestic dogs and cats, Thailand**',
                    'June–September 2021: ตรวจ domestic dogs and cats (n = 225) ใน Bangkok and the vicinities; SARS-CoV-2 was detected in a dog and a cat from COVID-19 positive households',
                    'Whole genome sequence analysis: delta variant of concern (B.1.617.2); SARS-CoV-2 ที่แยกจาก dog และ cat จัดอยู่ใน sublineage AY.30 และ AY.85 ตามลำดับ (respectively)',
                    'Antibodies against SARS-CoV-2 ตรวจพบได้ทั้งใน dog (day 9) และ cat (day 14) หลังตรวจพบ viral RNA',
                    'This study raises awareness on spill-over of variant of concern in domestic animals due to human-animal interface; surveillance of SARS-CoV-2 in domestic pets should be routinely conducted',
                    'บ้านที่มีเครื่องหมาย +: 2/19 ตัว (dog 1, cat 1); บ้านที่มีเครื่องหมาย -/?: 0/206 ตัว',
                    'ระลอกของ COVID-19 ในไทย: ระลอก 1, ระลอก 2, ระลอก 3 อัลฟ่า, ระลอก 4 เดลต้า, ระลอก 5 โอมิครอน',
                    'Phylogenetic tree: B.1.36.16, B.1.351 (Beta), B.1.1.7 (Alpha), B.1.617.2.30 (Delta) AY.30, B.1.617.2.85 (Delta) AY.85',
                    'Transboundary and Emerging Diseases (Volume 2024, Published 20 February 2024): **Serological Evidence of SARS-CoV-2 Exposure in Domestic Dogs and Cats, Thailand: Detection of SARS-CoV-2 Omicron Variant in Dogs Living in COVID-19-Positive Households**',
                    'Table 1 (Jan-21 ถึง Aug-22), Total 2,664 samples: dog ELISA positive (suspected)/test 33(5)/1,446 (2.28%), sVNT 2/38 (0.14%); cat ELISA positive (suspected)/test 22(3)/1,218 (1.81%), sVNT 19/25 (1.56%)',
                  ] },
                ] },
              { sub: 'สัตว์ป่าในไทย (wildlife species)',
                body: [
                  { bullets: [
                    'ตรวจสัตว์ป่า (wildlife species) ช่วง Pre-COVID-19 (2017-2019) และ COVID-19 (2020-2023) แยก Free ranging กับ Captive ด้วย Swab/tissue และ Serum',
                    '**Felidae**: Captive serum ช่วง COVID-19 (2020-2023) 7/9; Total animals 7/41',
                    'Total animals 7/364 (Captive serum ช่วง COVID-19: 7/44)',
                    'Songkhla 7/14 animals',
                  ] },
                  { table: {
                    headers: ['กลุ่มสัตว์', 'Total animals'],
                    rows: [
                      ['Primates', '0/171'],
                      ['Cervidae', '0/64'],
                      ['Felidae', '7/41'],
                      ['Musteloidae', '0/42'],
                      ['Viverroidea', '0/16'],
                      ['Elephantidae', '0/10'],
                      ['Suidae', '0/7'],
                      ['Macropodidae', '0/5'],
                      ['Choloepodidae', '0/4'],
                      ['Ursidae', '0/2'],
                      ['Bovidae', '0/1'],
                      ['Manidae', '0/1'],
                      ['Total', '7/364'],
                    ],
                  } },
                  { bullets: [
                    '**Tiger** (CU28108): Anorexia and Dyspnea (Nov 23, 2021), Dead (3 Dec 2021); Staff A (human): COVID-19 positive (25 Nov 2021)',
                    'ตัวอย่างเนื้อเยื่อของ tiger (N, E, RdRp): Lung + (33.89), + (29.26), + (31.55); Trachea, Paratracheal lymph node และ Intestine -, -, -',
                  ] },
                ] },
              { sub: 'Spill over and spill back (mink, white-tailed deer)',
                body: [
                  { bullets: [
                    'Science 371, 172-177 (8 January 2021): **Transmission of SARS-CoV-2 on mink farms between humans and mink and back to humans**',
                    'Emerging Infectious Diseases (Vol. 27, No. 2, February 2021): **SARS-CoV-2 Transmission between Mink (*Neovison vison*) and Humans, Denmark**',
                    'Dead mink in Naestved, Denmark. Mink have suffered outbreaks of Covid-19',
                    '**SARS-CoV-2 infection in free-ranging white-tailed deer** (Published online: 23 December 2021)',
                    'Human to deer และ Deer to deer (ข้อมูลจาก Ohio)',
                  ] },
                ] },
              { sub: 'SARS-CoV-2 from animals to human',
                body: [
                  { bullets: [
                    'Emerging Infectious Diseases (Vol. 28, No. 7, July 2022): **Suspected Cat-to-Human Transmission of SARS-CoV-2, Thailand, July–September 2021**',
                    'Aug 4, 2021: Patients B and C had symptom onset; Aug 8: Patients B and C traveled from Bangkok to Songkhla with their cat, then were admitted to hospital and left the cat',
                    'Aug 9: Patient G had symptom onset; Aug 13: Patient G was tested and confirmed to have COVID-19',
                    'Aug 10: Patients A, E, and F examined and specimens obtained from the cat; the cat was confirmed to have COVID-19 and admitted with Patients B and C',
                    'Aug 13: Patient A had symptom onset; Aug 15: Patient A was tested and confirmed to have COVID-19; Patients E and F were tested and results were negative for COVID-19 (Aug 15 และ Aug 24)',
                    'Aug 22: Patient A and the cat were discharged and quarantined at home for 28 days; Aug 29: Patients A and C were discharged and quarantined at home for 28 days',
                    'Phylogenetic tree: genome sequences จาก patients A, B, and C และแมวของ patients B and C เทียบกับ reference sequences จาก COVID-19 patients ใน Songkhla Province, Thailand, July–September 2021',
                    'Lancet 2022; 399: 1070-78: **Transmission of SARS-CoV-2 delta variant (AY.127) from pet hamsters to humans, leading to onward human-to-human transmission: a case study**',
                    'Transmission of SARS-CoV-2 from humans to other mammals, including pet animals, has been reported; with the exception of farmed mink, there is no previous evidence that these infected animals can infect humans, resulting in sustained human-to-human transmission',
                    'Following a confirmed SARS-CoV-2 infection of a pet shop worker, animals in the shop and the warehouse supplying it were tested for evidence of SARS-CoV-2 infection',
                    'Table 1: Chronology of outbreak investigation (RT-qPCR = quantitative RT-PCR)',
                  ] },
                  { table: {
                    headers: ['Date', 'Animal', 'Human'],
                    rows: [
                      ['Dec 22, 2021', 'Arrival of pet animals to warehouse, with no Syrian hamsters in this shipment', '—'],
                      ['Jan 4, 2022', '—', 'Patient 2 (mother) and patient 4 (daughter) visited pet shop A'],
                      ['Jan 7, 2022', 'Arrival of 1009 pet animals to warehouse, with 118 Syrian hamsters in this shipment; some of these imported Syrian hamsters in the warehouse were transferred to different pet shops belonging to the same retail chain', '—'],
                      ['Jan 8, 2022', '—', 'Patient 2 (mother) and patient 4 (daughter) visited pet shop A'],
                      ['Jan 11, 2022', '—', 'Patient 1 (pet shop A worker) had first symptoms'],
                      ['Jan 12, 2022', '—', 'Patient 2 (mother) had first symptoms'],
                      ['Jan 15, 2022', '—', 'Patient 1 (pet shop A worker) tested positive for SARS-CoV-2 by RT-qPCR'],
                      ['Jan 17, 2022', 'Screening investigation at pet shop A; screening investigation at the warehouse', 'Patient 2 (mother) tested positive for SARS-CoV-2 by RT-qPCR; patient 3 (father) had first symptoms'],
                      ['Jan 18, 2022', 'Follow-up investigation at pet shop A', 'Patient 3 (father) tested positive for SARS-CoV-2 by RT-qPCR'],
                      ['Jan 19, 2022', 'Follow-up investigation at the warehouse; screening investigations at pet shops B to F; Hong Kong Government ordered mass recall and culling of hamsters', 'Patients 4 (daughter) and 5 (son) remained asymptomatic, but tested positive for SARS-CoV-2 by RT-qPCR'],
                      ['Jan 20, 2022', 'Pet shop C with 2 hamsters tested positive for COVID-19', '—'],
                    ],
                  } },
                ] },
            ] },
          { sub: 'คำแนะนำของ CU-EIDAs สำหรับสัตว์เลี้ยงและโรงพยาบาลสัตว์',
            body: [
              { sub: 'Fact sheet COVID-19 in Pets: สัตว์เลี้ยงปลอดภัย ห่างไกลโควิด-19',
                body: [
                  { bullets: [
                    'ปรึกษาสัตวแพทย์ หรือโทรปรึกษาศูนย์เชี่ยวชาญเฉพาะทางโรคอุบัติใหม่และอุบัติซ้ำในสัตว์ (โควิด-19 ในสัตว์)',
                    'สุนัขและแมวติดโรคโควิด-19 ได้หรือไม่ ?: ในต่างประเทศรวมถึงในประเทศไทย มีรายงาน โควิด-19 ในสุนัขและแมว แต่พบน้อยมาก (พบเฉพาะสัตว์ที่ใกล้ชิดกับผู้ป่วย)',
                  ] },
                ] },
              { sub: 'ข้อควรปฏิบัติกับสุนัขและแมว เมื่อคนในบ้านติดโรคโควิด-19',
                body: [
                  { bullets: [
                    'หลีกเลี่ยงการสัมผัสใกล้ชิดกับสุนัขและแมว หรือสัตว์อื่นๆ',
                    'ให้อาหารและน้ำสัตว์เลี้ยงได้ตามปกติ ใส่หน้ากากอนามัย ล้างมือก่อนและหลังสัมผัสตัวสัตว์ และกรงสัตว์',
                    'กรณีไม่สามารถดูแลสัตว์ได้ สามารถให้ผู้อื่นดูแลแทนได้ตามข้อควรปฏิบัติ (ไม่ควรทิ้งหรือปล่อยสัตว์เลี้ยง)',
                  ] },
                  { callout: 'ไม่ควรทิ้งหรือปล่อยสัตว์เลี้ยง เมื่อคนในบ้านติดโรคโควิด-19 (ยังไม่มีรายงานการแพร่เชื้อจากสุนัขและแมวสู่คน)', kind: 'tip' },
                ] },
              { sub: 'ข้อควรปฏิบัติ เมื่อสุนัขและแมวติดโรคโควิด-19',
                body: [
                  { bullets: [
                    'ไม่ควรทิ้งหรือปล่อยสัตว์เลี้ยงที่ติดโรคโควิด-19',
                    'สังเกตอาการในสัตว์เลี้ยง (สัตว์อาจไม่แสดงอาการ หรือแสดงอาการเล็กน้อย เช่น ไอ จาม หอบ หายใจลำบาก อาเจียน ท้องเสีย และมักหายได้เองใน 2 สัปดาห์)',
                    'ควรดูแลและแยกเลี้ยงสัตว์ในบ้านของท่าน โดยแยกขังกรงประมาณ 2 สัปดาห์ หรือจนกว่าได้รับการตรวจยืนยันว่าปลอดจากเชื้อไวรัส (ยังไม่มีรายงานการติดเชื้อจากสุนัขและแมวสู่คน)',
                    'หลีกเลี่ยงการสัมผัสใกล้ชิดกับสุนัขและแมว ควรรักษาระยะห่าง สวมถุงมือ หน้ากากอนามัย และล้างมือทุกครั้ง ที่สัมผัสตัวสัตว์และกรงสัตว์',
                    'ทำความสะอาดและฆ่าเชื้อ ชามน้ำ-อาหาร ผ้าขนหนู เครื่องนอน และกรงสัตว์ ด้วยน้ำยาฆ่าเชื้อ และนำกลับมาใช้ใหม่ได้',
                    'เก็บอุจจาระ ปัสสาวะ หรือของเสียต่างๆ ควรสวมถุงมือ หน้ากากอนามัย และล้างมือทุกครั้ง และใส่ถุง 2 ชั้นก่อนทิ้ง',
                    'ผู้ที่มีความเสี่ยงสูง เช่น ผู้สูงอายุ หรือมีโรคประจำตัว ควรให้สมาชิกในครอบครัวเป็นผู้ดูแลสัตว์แทน',
                    'ในกรณีที่สัตว์แสดงอาการป่วย ควรปรึกษาสัตวแพทย์ หรือโทรปรึกษาศูนย์เชี่ยวชาญเฉพาะทางฯ (โควิด-19 ในสัตว์)',
                  ] },
                ] },
              { sub: 'โรงพยาบาลสัตว์หรือสถานที่รับฝากสัตว์เลี้ยงที่มีความเสี่ยง: ข้อกำหนดสถานที่',
                body: [
                  { bullets: [
                    'ห้องที่รับฝากสัตว์เลี้ยงที่มีความเสี่ยงจะต้องแยกจากห้องฝากสัตว์เลี้ยงอื่นๆ',
                    'กรงที่ใส่สัตว์เลี้ยงจะต้องปิดสนิทแน่นหนาเพื่อป้องกันสัตว์เลี้ยงหลุดออกมา',
                    'ต้องมีระยะห่างระหว่างกรงของสัตว์เลี้ยงแต่ละตัว (อย่างน้อย 1 เมตร)',
                    'บุคคลภายนอกไม่สามารถเข้าไปได้ (แสดงป้ายเฉพาะเจ้าหน้าที่ หรือ ห้ามเข้า ชัดเจน)',
                  ] },
                ] },
              { sub: 'โรงพยาบาลสัตว์หรือสถานที่รับฝากสัตว์เลี้ยงที่มีความเสี่ยง: ข้อแนะนำสำหรับเจ้าหน้าที่',
                body: [
                  { bullets: [
                    'กำหนดเจ้าหน้าที่ ดูแลสัตว์ และเข้าออกห้องพักสัตว์เลี้ยงที่มีความเสี่ยง ให้ชัดเจน',
                    'ผู้ปฏิบัติงานกับสัตว์เลี้ยงต้องสวมใส่อุปกรณ์ป้องกัน (PPE) และ ควรศึกษาขั้นตอนการใส่และถอด PPE ที่ถูกต้อง',
                    'PPE: หน้ากาก, face shield (ถ้ามี), ถุงมือ (สวมถุงมือ 2 ชั้น), ชุดคลุม (สามารถใช้เสื้อคลุมฝนได้), รองเท้าบู๊ท',
                    'มีการบันทึกข้อมูลการเข้าออกของเจ้าหน้าที่ห้องพักสัตว์เลี้ยงทุกครั้ง',
                    'สังเกตสัตว์เลี้ยงอย่างสม่ำเสมอ และรีบรายงานสัตวแพทย์เมื่อสัตว์เลี้ยงมีอาการผิดปกติ เช่น ไอ จาม หอบ หายใจลำบาก อาเจียน ท้องเสีย',
                    'ขยะและของเสียจากห้องพักสัตว์เลี้ยงที่มีความเสี่ยง จะต้องทิ้งลงถังขยะสำหรับของติดเชื้อ ก่อนทิ้งใส่ถุง 2 ชั้น เทน้ำยาฆ่าเชื้อในถุงก่อนผูกปิด ก่อนนำไปทิ้ง',
                    'หลีกเลี่ยงการฉีดน้ำล้างห้องหรือกรงสัตว์เลี้ยงโดยตรง เนื่องจากจะทำให้เกิดละอองฝอย ให้ทำความสะอาดแบบแห้ง เก็บเช็ด อุจจาระ ปัสสาวะ เศษอาหาร',
                    'เมื่อสัตว์เลี้ยงออกจากสถานที่ไปแล้ว ให้ทำความสะอาดและฆ่าเชื้อกรงรวมถึงของใช้ของสัตว์เลี้ยงนั้น เช่น ชามน้ำ-อาหาร เครื่องนอน ผ้าขนหนู ให้เรียบร้อย',
                    'ผู้ปฏิบัติงานควรตรวจสอบสุขภาพ สังเกตอาการ หากมีอาการผิดปกติ เช่น เป็นไข้ ปวดหัว เจ็บคอ ไอ จาม ควรแจ้งผู้จัดการหรือสัตวแพทย์ประจำร้าน',
                  ] },
                ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-ebola-nipah': {
    topic: 'zoo-ebola-nipah',
    title: 'Ebola + Nipah Virus Disease',
    icon: '🩸',
    summary: 'Ebola (Filoviridae) — severe contagious disease ในคนและ non-human primates, Africa outbreak, 6 species (Zaire/Sudan/Bundibugyu/Taï/Reston/Bombali), Reston ไม่เคยก่อโรคในคน. Nipah originate จาก fruit bat.',
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
        heading: 'Ebola + Nipah — การระบาด การแพร่ อาการ การรักษาและป้องกัน',
        source: '3 - Ebola___Nipah_virus_disease_Zoonoses_16_8_2024.pdf p.4-23',
        body: [
          { sub: 'Ebola virus disease (EVD)',
            body: [
              { sub: 'การค้นพบครั้งแรกและช่วงการระบาด',
                body: [
                  { bullets: [
                    'ค้นพบครั้งแรกในปี **1976** ใกล้ **Ebola River** ใน Democratic Republic of Congo & South Sudan',
                    '**Bushmeat** โดยเฉพาะ **fruit bats** (reservoir)',
                    'ช่วง **1976-2012**: Sub-Saharan Africa, West Africa',
                    'ช่วง **2013-2018**: West Africa',
                    'ช่วง **2018-2022**: DRC, Uganda (no new Ebola in 42 days)',
                  ] },
                ] },
              { sub: 'Enzootic cycle และ epizootic cycle',
                body: [
                  { bullets: [
                    '**Enzootic cycle**: หลักฐานใหม่บ่งชี้อย่างมาก (strongly implicates) ว่า **bats** เป็น **reservoir hosts** ของ ebolaviruses แต่ยังไม่รู้ว่าไวรัสคงอยู่แบบ enzootic ในพื้นที่และแพร่ภายในประชากรค้างคาวได้อย่างไร',
                    '**Ebola virus** มีชื่อเดิมว่า Zaire virus',
                    '**Epizootic cycle**: epizootics จาก ebolaviruses เกิดเป็นครั้งคราว (sporadically) ก่อ high mortality ใน **non-human primates** และ **duikers** และอาจเกิดก่อน human outbreaks',
                    'Epidemics จาก ebolaviruses ก่อ **acute disease** ในคน ยกเว้น Reston virus ที่ไม่ก่อโรคที่ตรวจพบได้ในคน',
                    'ยังรู้น้อยว่าไวรัสผ่านเข้าสู่คนครั้งแรกได้อย่างไร ซึ่งเป็นตัวจุดชนวนให้เกิด human-to-human transmission เป็นระลอกและเกิด epidemic',
                    'หลังคนแรกติดเชื้อจากการสัมผัสค้างคาวหรือสัตว์ป่าอื่นที่ติดเชื้อ มักเกิด **human-to-human transmission** ตามมา',
                  ] },
                ] },
              { sub: 'Ebola virus ecology and transmission',
                body: [
                  { bullets: [
                    'Ebola virus disease เป็น **zoonotic disease** คือโรคที่เกี่ยวข้องกับทั้งสัตว์และคน',
                    '**Animal-to-animal transmission**: หลักฐานบ่งว่า **bats** เป็น reservoir hosts ของ Ebola virus และค้างคาวที่มีไวรัสแพร่ต่อให้สัตว์อื่นได้ เช่น apes, monkeys, **duikers** (antelopes) รวมถึงคน',
                    '**Spillover event**: เกิดเมื่อสัตว์ (bat, ape, monkey, duiker) หรือคนติด Ebola virus จากการสัมผัส reservoir host โดยการสัมผัสนี้อาจเกิดจากการล่า (hunting) หรือการเตรียมเนื้อสัตว์เพื่อกิน',
                    '**Human-to-human transmission**: เมื่อไวรัสติดคนแรกแล้ว การแพร่จากคนสู่คนเกิดได้ผ่านการสัมผัส **blood and body fluids** ของคนป่วย หรือศพของผู้ที่ตายจาก Ebola',
                    'ตัวอย่างการแพร่คนสู่คน: traditional funeral practice, unprotected healthcare worker, unprotected contact with blood and body fluids',
                    '**Survivor**: ผู้รอดชีวิตต้องเจอความท้าทายใหม่ บางรายมีผลตามมา เช่น tiredness และ muscle aches และอาจเจอ **stigma** เมื่อกลับเข้าชุมชน',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Direct contact** กับ tissue, blood, excretions และ other body fluids',
                    'Direct contact รวมถึง **sexual contact** กับคนที่กำลังป่วยหรือหายจาก EVD แล้ว',
                    'ไวรัสคงอยู่ใน body fluids บางชนิดได้หลังหายป่วย เช่น **semen**, **breastmilk** และยังไม่ชัดว่าไวรัสยังติดต่อได้ (infectious) นานแค่ไหน',
                  ] },
                ] },
              { sub: 'Signs & symptoms',
                body: [
                  { bullets: [
                    '**Onset** ~ 8-10 วัน (2 - 21 วัน)',
                    '**Case fatality rates** ~ 50% (25-90%)',
                    'อาการ: fever, aches and pains (เช่น severe headache, muscle and joint pain), weakness and fatigue, sore throat, loss of appetite',
                    'อาการทาง GI: abdominal pain, diarrhea, vomiting',
                    '**Unexplained hemorrhaging**, bleeding or bruising',
                    'อาการอื่น: red eyes, skin rash',
                  ] },
                ] },
              { sub: 'Treatment & Prevention',
                body: [
                  { bullets: [
                    'ปัจจุบันมี **FDA-approved treatments** 2 ตัวสำหรับรักษา Ebola disease (species *orthoebolavirus zairense*): **Inmazeb™** และ **Ebanga™**',
                    '**Vaccine**: ใน December 2020 ได้รับอนุมัติจาก US FDA และ prequalified โดย WHO ให้ใช้ในคนอายุ **18 years of age and older** (ยกเว้น pregnant and breastfeeding women) เพื่อป้องกัน Ebola virus disease ที่เกิดจาก Zaïre Ebola virus',
                    'ข่าว (updated December 20, 2019): FDA approves first-ever vaccine for prevention of Ebola virus',
                  ] },
                ] },
            ] },
          { sub: 'Nipah virus disease',
            body: [
              { sub: 'Nipah virus (NiV)',
                body: [
                  { bullets: [
                    '**Family**: *Paramyxoviridae*, **Genus**: *Henipavirus*',
                  ] },
                ] },
              { sub: 'รู้จักครั้งแรก: Malaysia และ Singapore 1998-1999',
                body: [
                  { bullets: [
                    'รู้จักครั้งแรกหลังการระบาดของโรคใน **pigs** และคนใน **Malaysia and Singapore** ช่วง **1998-1999** ซึ่งตอนแรกคิดว่าเป็น **Japanese encephalitis (JE)**',
                    'ชื่อไวรัสตั้งตามหมู่บ้านที่เก็บตัวอย่าง: **Nipah River Village** (Kampung Sungai Nipah), Negeri Sembilan, Malaysia',
                    'ไม่มี known outbreaks ของ NiV อื่นอีกใน Malaysia และ Singapore ตั้งแต่ 1999',
                    'จาก **Tambun** (Ipoh) Nipah แพร่ผ่าน **infected pigs** ไปยังฟาร์มใน Penang, Perak, Selangor, Malacca, Negri Sembilan และ Johor',
                    'เกษตรกรใน Tambun จัด **fire sales** เพื่อขายหมูทิ้ง (to get rid of pigs)',
                  ] },
                ] },
              { sub: 'Bangladesh, India และ natural reservoir',
                body: [
                  { bullets: [
                    'พบใน **Bangladesh** ด้วยในปี **2001** และเกิด outbreaks เกือบทุกปี (nearly annual) ในประเทศนี้นับตั้งแต่นั้น',
                    'มีการตรวจพบโรคเป็นระยะ (periodically) ใน **eastern India** ด้วย',
                    'พบไวรัสใน **natural reservoir** ที่รู้จัก (*Pteropus* bat species) และในค้างคาว species อื่นอีกหลายชนิดในหลายประเทศ รวมถึง Cambodia, Ghana, Indonesia, Madagascar, the Philippines และ Thailand',
                    'ข่าว: 10 confirmed dead from Nipah virus outbreak in India, including nurse treating patients; หลังการระบาด เจ้าหน้าที่ตรวจบ่อน้ำเพื่อจับค้างคาวใน Kozhikode district รัฐ Kerala',
                  ] },
                ] },
              { sub: 'History of Nipah virus: Bangladesh และ India',
                body: [
                  { bullets: [
                    '**Bangladesh**: จำนวน Nipah virus cases and deaths ที่มีรายงาน ช่วง 1 January 2001 – 9 February 2024 รวม **Cases (n=341)** และ **Death (n=242)** (source: Bangladesh Ministry of Health and Family Welfare)',
                    '**India**: ข่าว Indian authorities rush to contain a deadly Nipah virus outbreak in Kerala และข่าว Nipah virus death puts health officials on alert in southern India',
                  ] },
                ] },
              { sub: 'Nipah virus distribution map',
                body: [
                  { bullets: [
                    '**Fruit bats** พบได้แม้ในพื้นที่ที่ยังไม่เคยเกิด Nipah outbreaks',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Direct contact** กับ infected animals, body fluids (เช่น blood, urine หรือ saliva)',
                    'Direct contact รวมถึงการกิน food products ที่ปนเปื้อน เช่น **palm sap** หรือ fruit ที่ปนเปื้อนจากค้างคาวที่ติดเชื้อ',
                    'เส้นทางผ่าน **หมู**: Flying foxes forage in fruit trees on pig farms → Pigs exposed to material dropped by bats → Rapid pig-to-pig transmission (asymptomatic infection & trade facilitate spread) → People infected through close contact with infected pigs',
                    'เส้นทางผ่าน **ม้า**: Unidentified spillover event from putative bat host species → People infected following contact with unwell horses or handling/consumption of horse meat → People infected following contact with an unwell patient',
                    'เส้นทางผ่าน **date palm sap**: Flying foxes feed from date palm sap collection pots → People consume contaminated date palm sap; ติดต่อจากคนสู่คน: People infected through close contact with unwell patients & their secretions',
                  ] },
                ] },
              { sub: 'Signs & symptoms',
                body: [
                  { bullets: [
                    '**Onset** ~ 4-14 วัน',
                    '**Case fatality rates** 40-75%',
                    'อาการมีได้หลายแบบ ตั้งแต่ asymptomatic infection (subclinical) ไปจนถึง acute respiratory infection และ **fatal encephalitis**',
                    'อาการ: fever, headache, cough, sore throat, difficulty breathing, vomiting',
                    'อาการอีกกลุ่ม: disorientation, drowsiness, or confusion; seizures; coma; **brain swelling (encephalitis)**',
                    'ผู้ป่วยประมาณ **20%** มี **residual neurological consequences** หลงเหลือ เช่น seizure disorder และ personality changes',
                  ] },
                ] },
              { sub: 'Treatment & Prevention',
                body: [
                  { bullets: [
                    'ปัจจุบัน **ยังไม่มี drugs หรือ vaccines** ที่ specific สำหรับ Nipah virus infection',
                    'ล้างมือด้วย soap and water เป็นประจำ เลี่ยงการสัมผัส **sick bats or pigs** และเลี่ยงพื้นที่ที่รู้ว่าเป็นที่ค้างคาวเกาะพัก (roost)',
                    'เลี่ยงการกินหรือดื่มผลิตภัณฑ์ที่อาจปนเปื้อนจากค้างคาว เช่น **raw date palm sap**, raw fruit หรือผลไม้ที่พบตกอยู่บนพื้น',
                    'เลี่ยงการสัมผัส blood หรือ body fluids ของคนที่รู้ว่าติด NiV',
                  ] },
                ] },
              { sub: 'Nipah virus in animals',
                body: [
                  { bullets: [
                    'เป็น **highly contagious disease** ใน **pigs**',
                    'Nipah virus มีผลต่อ **respiratory and nervous systems** (porcine respiratory and neurologic syndrome / porcine respiratory and encephalitic syndrome (**PRES**) / **barking pig syndrome (BPS)**)',
                    'อาการ: cough and difficulty breathing; twitching, trembling, muscle fasciculation, spasms; muscle weakness; death',
                  ] },
                ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-ai-basic': {
    topic: 'zoo-ai-basic',
    title: 'Avian Influenza Virus (AI) — Basic',
    icon: '🐦',
    summary: 'Influenza A (Orthomyxoviridae) — 8 segments ssRNA, HA (จับ receptor) + NA (release virion), Wild aquatic birds เป็น natural reservoir (H1-16), HPAI H5N1 จาก A/Goose/Guangdong/1/1996 → 2004 ระบาดทั่วโลก + ติดคน.',
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
        heading: 'Receptor, LPAI/HPAI, AIV subtype และ surveillance ในไทย',
        source: '5 - Avian_Influenza_Virus_(AIV)_22_Aug_2024.pdf p.4-40 + 4 - Basic_of_AI_22_8_24_for_present.pdf p.4-12',
        body: [
          { sub: 'Receptor-binding specificity ของ Influenza A virus',
            body: [
              { bullets: [
                '**Avian virus** จับ **Avian receptor** คือ **SA-α2,3-Gal-β1,3**',
                '**Human virus** จับ **Human receptor** คือ **SA-α2,6**',
                '**The receptor-binding specificity of the HA**: receptor determinant ของ avian virus คือ **SAα2,3-gal** ส่วนของ human virus คือ **SAα2,6-gal**',
                'receptor-binding specificity ของ HA: **E 190 D** (E ฝั่ง avian virus, D ฝั่ง human virus) และ **G 225 E** (G ฝั่ง avian virus, E ฝั่ง human virus)',
                '**RBD** ของ HA คู่กับ receptor **α2,3** (avian) หรือ **α2,6** (human)',
              ] },
            ] },
          { sub: 'Mixing vessel',
            body: [
              { bullets: [
                '**Pig** และ **quail** ต่างมี receptor ทั้ง **SA-α2,6** (human) และ **SA-α2,3-Gal-β1,3** (avian)',
              ] },
              { callout: '**Pigs and quails** เป็น candidates สำหรับการเป็น **mixing vessels** ของ new IAV strains', kind: 'tip' },
            ] },
          { sub: 'Antigenic drift และ antigenic shift',
            body: [
              { bullets: [
                '**Antigenic Drift**: Virus A เกิด **accumulation of mutations** → Virus B ซึ่ง new spikes are no longer recognized by **antibodies**',
                '**Antigenic Shift**: Virus A และ Virus B เกิด **RNA mixes in host cell** ได้ Virus C; this is how viruses can jump to infect totally **new species**',
              ] },
            ] },
          { sub: 'ที่มาของ Pandemic H1N1 2009',
            body: [
              { bullets: [
                '**Pandemic H1N1 2009** มีที่มาจาก **European avian-like H1N1** และ **North American Triple reassortant H1N2**',
                '**North American Triple reassortant H1N2** มีที่มาจาก **Classical swine H1N1**, **Human seasonal H3N2** และ **North American avian**',
              ] },
            ] },
          { sub: 'Pandemic และ epidemic influenza',
            body: [
              { table: {
                headers: ['Year', 'Pandemic and epidemic Influenza', 'Subtype'],
                rows: [
                  ['1918', 'Spanish Flu', 'H1N1'],
                  ['1957', 'Asian Flu', 'H2N2'],
                  ['1968', 'Hong Kong Flu', 'H3N2'],
                  ['2004', 'Bird Flu', 'H5N1'],
                  ['2009', 'Pandemic H1N1 2009', 'H1N1'],
                  ['2013', 'Novel H7N9 2013', 'H7N9'],
                ],
              } },
            ] },
          { sub: 'Avian influenza virus — LPAI และ HPAI',
            body: [
              { table: {
                headers: ['Low pathogenic avian influenza (LPAI)', 'Highly pathogenic avian influenza (HPAI)'],
                rows: [
                  ['All subtypes', 'H5, H7 subtypes'],
                  ['mild disease', 'High mortality rate'],
                  ['Genetic: No multiple basic amino acid', 'Genetic: Multiple basic amino acid'],
                  ['Pathogenicity: IVPI ≤1.2', 'Pathogenicity: IVPI >1.2'],
                ],
              } },
              { bullets: [
                'LPAI → HPAI ผ่าน **Mutation of HA gene**',
                '**H7N9** (ฝั่ง LPAI) และ **H5N1** (ฝั่ง HPAI) ต่างมีลูกศรโยงไปถึงคน',
              ] },
            ] },
          { sub: 'H5 subtypes — Eurasian type และ North American type',
            body: [
              { bullets: [
                '**H5 subtypes** แบ่งเป็น **Eurasian type** และ **North American type**',
                '**Eurasian type**: **GS/GD/1 lineage** (High pathogenic) และ **Outlier** (Low pathogenic)',
                '**North American type**: **Low pathogenic**',
                '**GS/GD/1 lineage** แตกแขนงเป็น clade 0, 1 (1.1), 2.1 (2.1.1, 2.1.3), 2.2 (2.2.1), 2.3.2 (2.3.2.1), 2.3.4 (2.3.4.1), 3, 4, 5, 6, 7, 8 และ 9',
              ] },
            ] },
          { sub: 'HPAI-H5N1 outbreaks (2003 ถึง 2008)',
            body: [
              { bullets: [
                'ปี **2004**: **HPAI-H5N1 outbreaks**',
                'ตั้งแต่ **2003** มีพื้นที่ที่รายงาน confirmed occurrence ของ **H5N1 avian influenza** ทั้งพื้นที่ที่พบใน **poultry** และพื้นที่ที่พบ only in **wild birds** (WHO map, status as of 01 February 2008; data source: OIE and national governments)',
              ] },
            ] },
          { sub: 'ไทม์ไลน์ subtype ต่อจาก H5N1 Gs/GD (1996)',
            body: [
              { sub: 'HPAI-H5N8',
                body: [
                  { bullets: [
                    'ปี **2010**: **H5N8** — Chicken in LBM, China',
                    'การอพยพของนกปี **2014** (Lee et al., 2015): **Spring bird migration (Group A)**, **Fall bird migration (Subgroup A1, A2, A3)** และ **maintenance and circulation of virus** โดยมี **breeding site** และ **wintering site**',
                  ] },
                ] },
              { sub: 'HPAI-H5N6',
                body: [
                  { bullets: [
                    'ปี **2013**: **H5N6** — Avian & Humans, China',
                    '**Human infection with a highly pathogenic avian influenza A (H5N6) virus in Yunnan province, China** (Wen Xu, Hong Li & Li Jiang, 2016)',
                  ] },
                ] },
              { sub: 'HPAI-H5N2',
                body: [
                  { bullets: [
                    'ปี **2014**: **H5N2** — HPAI-H5N8 (EU) + LPAI (NA)',
                  ] },
                ] },
            ] },
          { sub: 'LPAI-H9N2',
            body: [
              { bullets: [
                'ปี **1966**: **H9N2** — Turkey in USA',
                'ปี **1997**: Human case ของ **H9N2**',
              ] },
            ] },
          { sub: 'LPAI-H7N9',
            body: [
              { bullets: [
                'ปี **2013**: **H7N9** — First human case',
                '**LPAI-H7N9 in humans**: **1,568 confirmed cases, 616 deaths**',
                'พื้นที่ที่ระบุ: China, Taiwan, Malaysia, Canada',
                '**Jan 2017**: HPAI-H7N9',
                'หัวข้อรายงาน: Emergence of Avian Influenza A(H7N9) Virus Causing Severe Human Illness — China, February–April 2013',
                'จำนวน human cases ต่อ quarter (Q1 2013 ถึง Q4 2021) แบ่งเป็น **Period 1 ถึง 9** โดยค่าสูงสุดของแต่ละ period คือ Period 1 = 97 (Q2 2013), Period 2 = 255 (Q1 2014), Period 3 = 164 (Q1 2015), Period 4 = 76 (Q1 2016) และ Period 5 = 423 (Q1 2017)',
                'หลัง **Start of the mass poultry vaccination campaign in mainland China** (ลูกศรอยู่ราว Q4 2017) จำนวน human cases ที่ระบุมีเพียง 1 (Q4 2017), 2 (Q1 2018) และ 1 (Q1 2019)',
              ] },
            ] },
          { sub: 'AIV infection in human',
            body: [
              { bullets: [
                '**AIV infection in human**: subtype ที่ระบุ ได้แก่ H5N1, H5N2, H5N6, H6N1, H7N4, H7N9, H9N2, H10N3, H10N5 และ H10N7',
              ] },
            ] },
          { sub: 'H5N1 in Dairy cattle',
            body: [
              { bullets: [
                'หัวข้อข่าว: Bird flu found in dairy herds',
                '**First report**: 25 Mar 2024 ใน USA',
                '**Current situation**: 191 dairy cow herds (13 states) และ 4 humans (cows → humans)',
                '**H5N1 Clade 2.3.4.4b, Strain B3.13** (2024) เชื่อมโยงกับ Cows, Dairy worker, Cats, Raccoons, Wild birds และ Poultry',
                '**CDC**: Wild birds carry bird flu และ H5N1 bird flu has a fatality rate of **up to 90%** in chickens',
                '**Human bird flu transmission routes** (CDC): Ducks and waterfowls → Poultry, Ducks and waterfowls → Cows, Poultry → Cows, Poultry → Humans และ Cows → Humans',
              ] },
            ] },
          { sub: 'AIV in Thailand — H5N1 ใน dog, cat, tigers และ backyard poultry',
            body: [
              { bullets: [
                '**AIV in Thailand**: มีรายงาน Fatal Avian Influenza A H5N1 in a Dog และ Avian Influenza H5N1 in Naturally Infected Domestic Cat',
                '**HPAI-H5N1 outbreak, Tigers**: มีรายงาน Avian Influenza H5N1 in Tigers and Leopards, Probable Tiger-to-Tiger Transmission of Avian Influenza H5N1 และ Genetic characterization of H5N1 influenza A viruses isolated from zoo tigers in Thailand (Virology 344, 2006)',
                '**HPAI-H5N1 outbreak** ใน **Backyard poultry**',
              ] },
            ] },
          { sub: 'AIV surveillance in Thailand',
            body: [
              { bullets: [
                '**AIV surveillance in Thailand** ครอบคลุมกลุ่ม Backyard poultry, Wild birds, FGDs และ LBMs',
              ] },
              { callout: 'AIV surveillance in Thailand: **IAVs reservoirs in Thailand**', kind: 'tip' },
              { sub: 'Wild birds',
                body: [
                  { bullets: [
                    '**Genetic characterization of influenza A virus subtype H12N1 isolated from a watercock and lesser whistling ducks in Thailand** (Arch Virol 2012, 157:1123-1130)',
                  ] },
                ] },
              { sub: 'FGDs',
                body: [
                  { bullets: [
                    '**FGDs** เป็น **potential reservoir of IAVs**',
                    'ลักษณะที่ระบุ: frequent movement, move to long-distance areas และ share habitat with backyard poultry & wild birds',
                  ] },
                ] },
              { sub: 'LBMs',
                body: [
                  { bullets: [
                    '**LBMs** เป็น **potential source of IAV transmission**',
                    'ลักษณะที่ระบุ: different poultry species, various sources of poultry และ human-animal interface',
                    '**Influenza A Virus Surveillance in Live-Bird Markets: First Report of Influenza A Virus Subtype H4N6, H4N9, and H10N3 in Thailand** (28 June 2011)',
                    '**Genetic characterization of influenza A (H7N6) virus isolated from a live-bird market in Thailand** (Arch Virol 2016, 161:1315-1322)',
                  ] },
                ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-siv-civ': {
    topic: 'zoo-siv-civ',
    title: 'SIV + CIV — Swine + Canine Influenza',
    icon: '🐷',
    summary: 'Swine Influenza Virus (SIV) — 2 lineage หลัก (NA-SIV จากอเมริกาเหนือ classical swine + EU-SIV avian-like H1N1). 1918 Spanish flu = pandemic แรก, 1930 First SIV in pigs USA, 2020 China พบ swine flu ที่มี pandemic potential.',
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
        heading: 'Pandemic H1N1 2009, SIV ในไทย และ CIV H3N2 (2012)',
        source: '6 - 3109517_(Zoonoses)_SIV_CIV.pdf p.4-33',
        body: [
          { sub: 'Pandemic H1N1 2009 — Introduction',
            body: [
              { bullets: [
                '**Pandemic H1N1 2009**: first emerged in human population in the Mexico and the US ในปี **2009** (**2009 S-OIV (H1N1)**, Tscherne et al. 2011)',
                '**Reassortant virus**: **NA-SIV** : triple-reassortant; **EU-SIV** : M and NA genes; **TRIG cassette**',
                'แพร่ทั่วโลกด้วย **human-to-human transmission** (spread worldwide)',
                'มี **reverse transmission** จากคนไปสู่หมู (humans-to-pigs)',
              ] },
            ] },
          { sub: 'Swine Influenza, Thailand',
            body: [
              { bullets: [
                'มีรายงาน **Genetic characterization of H1N1, H1N2 and H3N2 swine influenza virus in Thailand** (Arch Virol 2008, 153:1049-1056)',
                'มีรายงาน **Pandemic (H1N1) 2009 Virus on Commercial Swine Farm, Thailand**',
              ] },
            ] },
          { sub: 'Endemic Thai SIV H1N1 และ Pandemic (H1N1) 2009 — ที่มาของ gene',
            body: [
              { bullets: [
                '**Endemic Thai SIV H1N1** แบบ **6+2**: Avian-like (PB2, PB1, PA, NP, NA, M) และ Swine-like (HA, NS)',
                '**Endemic Thai SIV H1N1** แบบ **7+1**: Avian-like (PB2, PB1, PA, NP, NA, M, NS) และ Swine-like (HA)',
                '**Pandemic (H1N1) 2009**: Avian-like (PB2, PA, NA, M), Swine-like (HA, NP, NS) และ Human-like (PB1)',
                '**Thai pandemic H1N1 (Swine)**: CU4, CU9, CU29, CU114, CU15, CU75',
                '**Swine**: infected with pandemic H1N1 2009',
                '**Genetic characteristic**: pH1N1 (swine) similar to pH1N1 (human); Avian & Swine & Human-like',
              ] },
            ] },
          { sub: 'Evolution of SIV, Thailand',
            body: [
              { bullets: [
                'มีรายงาน **Brief report: molecular characterization of a novel reassorted pandemic H1N1 2009 in Thai pigs** (Virus Genes 2011, 43:1-5)',
              ] },
              { table: {
                headers: ['Virus designation', 'Host', 'Name', 'Year', 'TRIG'],
                rows: [
                  ['Nonthaburi/102/09', 'human', 'pH1N1', '2009', '+'],
                  ['Thailand/CU-RA4/10', 'swine', 'pH1N1', '2009', '+'],
                  ['Thailand/CU-RA15/10', 'swine', 'pH1N1', '2010', '+'],
                  ['Ratchaburi/NIAH1481/00', 'swine', 'ThH1N1', '2000', '-'],
                  ['Chonburi/NIAH9469/04', 'swine', 'ThH1N1', '2004', '-'],
                  ['Chachoengsao/NIAH587/05', 'swine', 'ThH1N1', '2005', '-'],
                  ['Thailand/CU-RA20/10', 'swine', 'ThH1N1', '2009', '-'],
                  ['Thailand/CU-RA204/10', 'swine', 'ThH1N1', '2010', '-'],
                  ['Thailand/CU-SA43/10', 'swine', 'rH1N1', '2010', '+'],
                  ['Thailand/CU-SA412/10', 'swine', 'rH1N1', '2010', '+'],
                  ['Thailand/CU-SA432/10', 'swine', 'rH1N1', '2010', '+'],
                ],
              } },
              { bullets: [
                'ที่มาของ gene segments ตาม legend ของตาราง — **pH1N1** (Nonthaburi/102/09, CU-RA4/10, CU-RA15/10): PB2 และ PA = **Avian-TRIG**, PB1 = **Human-TRIG**, HA = **Classical swine (pH1N1 isolates)**, NP และ NS = **Classical swine**, NA และ M = **Eurasian swine**',
                '**ThH1N1** (NIAH1481/00, NIAH9469/04, NIAH587/05, CU-RA20/10, CU-RA204/10): PB2, PB1, PA, NP และ M = **Eurasian swine**, HA = **Classical swine**, NA = **Eurasian swine (ThH1N1 and rH1N1 isolates)**, NS = Classical swine ยกเว้น Ratchaburi/NIAH1481/00 ที่ NS = Eurasian swine',
                '**rH1N1** (CU-SA43/10, CU-SA412/10, CU-SA432/10): ทุก segment เหมือน pH1N1 ยกเว้น **NA** = **Eurasian swine (ThH1N1 and rH1N1 isolates)**',
                '**Swine**: infected with reassort H1N1 2009',
                '**pH1N1**: pH1N1 backbone + NA (SIV)',
              ] },
            ] },
          { sub: 'Genetic diversity of SIV, Thailand 2011-2014',
            body: [
              { bullets: [
                'มีรายงาน **Genetic diversity of swine influenza viruses in Thai swine farms, 2011–2014** (Virus Genes)',
              ] },
            ] },
          { sub: 'H1N1 และ H1N2 (2000 ถึง 2013)',
            body: [
              { bullets: [
                '**Introduction of pandemic H1N1 like virus**: CU-RA4 และ CU-PL65',
                'H1N1: **rH1N1 (7+1)** ได้แก่ CU-SA43; **rH1N1 (TRIG+2)** ได้แก่ CU-S3629 และ CU-S3795; **H1N1 (6+2)** ได้แก่ CU-S3334, CU-S3350 และ CU-S3406',
                'H1N2: **rH1N2 (7+1)** ได้แก่ CU-S3073; **rH1N2 (TRIG+2)** ได้แก่ CU-S3631',
              ] },
            ] },
          { sub: 'H3N2 และ rSIV',
            body: [
              { bullets: [
                '**Swine**: infected with rH1N1, rH1N2, rH3N2',
                '**Genetic characteristic**: **rSIV** คือ pH1N1 backbone (TRIG) + SIV genes',
                '**rSIV** more diverse หลัง introduction of pH1N1',
              ] },
            ] },
          { sub: 'Canine influenza (CIV H3N2) outbreak, January 2012',
            body: [
              { sub: 'Outbreak notification',
                body: [
                  { bullets: [
                    '**January 2012**: clinical cases of dogs with flu-like symptoms in a small animal hospital',
                    'แจ้งไปที่ **CU-VDL** (notified to the CU-VDL)',
                    '**Chula-MCEIRs Outbreak response team** investigated the outbreak ด้วย Observation/History taking, Sample collection และ Laboratory test',
                  ] },
                ] },
              { sub: 'Sample collection',
                body: [
                  { bullets: [
                    '**Total 8 dogs**: 2 dogs from hospital ward และ 6 dogs from kennels',
                    'Gender: male (n = 5) และ female (n = 3); Breed: Westie, Labrador, Old english sheep dog; Age: young adult to old dog (4 – 13 years)',
                    '**Total 49 samples**: Nasal swab (n=28) และ Blood (n=21)',
                    'หลัง Outbreak notification เก็บตัวอย่าง 4 visits: Visit 1 (day 0), Visit 2 (day 4), Visit 3 (day 7) และ Visit 4 (day 14)',
                    'Nasal swab (n=7) ในทุก visit และ Blood (n=7) ใน Visit 1, Visit 3 และ Visit 4',
                  ] },
                ] },
              { sub: 'Clinical findings',
                body: [
                  { bullets: [
                    '**% of dogs shown clinical signs** on visits',
                  ] },
                  { table: {
                    headers: ['Signs', 'Visit 1', 'Visit 2', 'Visit 3', 'Visit 4'],
                    rows: [
                      ['Cough', '75% (6/8)', '75% (6/8)', '50% (4/8)', '0'],
                      ['Sneeze', '75% (6/8)', '50% (4/8)', '0', '0'],
                      ['Nasal discharge', '75% (6/8)', '37.5% (3/8)', '0', '0'],
                      ['Fever', '12.5% (1/8)', '0', '0', '0'],
                    ],
                  } },
                ] },
              { sub: 'Laboratory findings',
                body: [
                  { bullets: [
                    '**Influenza A antibody detection**: Serum samples, **NP ELISA (ID screen®)**',
                    '**95.24%** (20/21) were positive',
                    '% NP ELISA positive: Visit 1 (D0) 6/7, Visit 3 (D7) 7/7 และ Visit 4 (D14) 7/7 ส่วน Visit 2 (D4) ไม่มีค่าแสดง',
                    '**Influenza A virus detection**: **10.71%** (3/28) positive',
                    '1 sample: high viral quantity (ct = 16.66) และ characterized as **avian-like influenza virus H3N2**',
                    '2 samples: low viral quantity (ct ≥ 35)',
                  ] },
                ] },
              { sub: 'Virus Characterization',
                body: [
                  { bullets: [
                    '**Whole genome sequencing**: NIH DC5299N',
                    '**Phylogenetic analysis**: virus belongs to **avian lineage (Eurasian)**',
                    'Genetically related to **canine influenza viruses (H3N2) from Korea and China** (Lin et al., 2012)',
                    'NIH DC5299N อยู่ในกลุ่ม **Canine H3N2** ภายใน **Avian Eurasian lineage** ส่วนอีก lineage ใน tree คือ **Avian NA lineage**',
                  ] },
                ] },
              { sub: 'Discussion และ Summary',
                body: [
                  { bullets: [
                    '**Discussion**: Major Flooding in Thailand 2011',
                    '**January 2012**: serological and virological results indicated an outbreak of **CIV(H3N2)** in a small animal hospital',
                    '**Molecular genetic analysis**: characterized as avian-like influenza virus H3N2; related to CIV(H3N2) from Korea and China; amino acid insertion in the NA gene similar to CIV China (2010)',
                  ] },
                  { callout: 'สรุป: **flooding contributed to the emergence of CIV in Thailand**; **the first to report an outbreak of CIV(H3N2) in Thailand**', kind: 'tip' },
                ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'zoo-vbz': {
    topic: 'zoo-vbz',
    title: 'Vector-borne Viral Zoonoses',
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
        heading: 'รายโรค: RVF, Yellow Fever, JE, West Nile, CCHF, SFTSV',
        source: '7 - Vector_borne_viral_zoonosis_23_8_2024.pdf p.4-39',
        body: [
          { sub: 'Rift Valley fever (RVF)',
            body: [
              { sub: 'เชื้อ สัตว์ที่พบ และอาการ',
                body: [
                  { bullets: [
                    '**RVF** เป็น vector-borne diseases ใน Genus *Phlebovirus*',
                    'Vector คือยุง (mosquitoes): *Aedes* spp., *Culex* spp.',
                    'พบบ่อยใน cattle, sheep, goats, camels and buffalo',
                    'พบใน Africa',
                    'ในสัตว์ทำให้เกิด severe illness: high abortion rates and infant mortality',
                    'ในคน (cause disease in humans), **no symptoms or a mild form**: 8-10%: flu-like fever, muscle pain, joint pain, headache, neck stiffness, sensitivity to light, loss of appetite and vomiting',
                    'ในคน, **severe form**: ocular (eye) disease (0.5-2% of patients), meningoencephalitis (less than 1% of patients), haemorrhagic fever (less than 1% of patients)',
                  ] },
                ] },
              { sub: 'Outbreak ในสัตว์',
                body: [
                  { bullets: [
                    'ปีที่ระบุสถานที่: 1931 Kenya (sheep), 1977 Egypt (livestock), 1997-98 Kenya (flooding), 2000 Saudi Arabia and Yemen',
                    'ปีอื่นใน timeline ที่ไม่ระบุสถานที่: 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2024',
                  ] },
                ] },
              { sub: 'Outbreak ในคน',
                body: [
                  { bullets: [
                    'ปีที่ระบุสถานที่: 2000 Saudi Arabia and Yemen, 2003 Egypt, 2006 Kenya, Tanzania, and Somalia (heavy rainfalls), 2007 Sudan, 2019 Mayotte (France)',
                    'ปีอื่นใน timeline ที่ไม่ระบุสถานที่: 2008, 2009, 2010, 2011, 2012, 2013-14, 2015, 2016, 2017, 2018, 2020, 2021, 2022',
                    'การระบาดในคนเกี่ยวข้องกับ contact with RVF-infected animals',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Vector-borne**: *Aedes* sp. and *Culex* sp.',
                    '**Direct or indirect contact**: blood, organ of infected animals',
                    'ไม่มี **human to human transmission**',
                  ] },
                ] },
              { sub: 'Virus ecology: enzootic และ epizootic-epidemic cycle',
                body: [
                  { bullets: [
                    '**Enzootic cycle**: local enzootic transmission ของ RVF เกิดในระดับต่ำตามธรรมชาติช่วง periods of average rainfall; virus คงอยู่ผ่าน transovarial transmission จาก female *Aedes* mosquito ไปสู่ไข่ และผ่าน occasional amplification cycles ใน susceptible livestock',
                    '**Epizootic-Epidemic cycle**: abnormally high rainfall และ flooding กระตุ้นการฟักของไข่ *Aedes* ที่ติดเชื้อ ทำให้เกิด massive emergence of *Aedes* รวมถึง RVF virus-infected *Aedes*',
                    'infected *Aedes* ดูดเลือด vulnerable livestock → virus amplification และ epizootic; epizootics ทำให้เกิด abortion storms, >90% mortality in newborns และ 10 - 30% mortality in adults',
                    '**Secondary vectors**: ยุง genera อื่น เช่น *Culex* ส่งไวรัสสู่คนและสัตว์จนเกิดโรคได้; คนสัมผัสเลือดและเนื้อเยื่อของ viremic livestock (mostly small ruminants) ได้ระหว่าง slaughtering หรือ birthing activities',
                  ] },
                ] },
              { sub: 'Treatment และ control',
                body: [
                  { bullets: [
                    '**No specific treatment**; mild symptoms and self-limiting; serious case ให้ supportive care',
                    'Control: **no vaccine in human**',
                    'Vaccine in animal, **inactive vaccine**: need multiple dose → not practical in routine animal field',
                    'Vaccine in animal, **modified live vaccine**: cause birth defects and abortion in pregnant livestock',
                  ] },
                ] },
              { sub: 'How to prevent RVF',
                body: [
                  { bullets: [
                    '**Avoid contact with sick animals and meat or milk from sick animals**: call veterinarians if your animals are sick or have had an abortion; wash your hands after touching raw meat or milk; cook meat thoroughly; boil raw milk',
                    '**Avoid mosquito bites**: use bednets to protect you from getting diseases from mosquitos like Rift Valley Fever, malaria, and Yellow fever; wear long clothing to cover the body',
                    'เมื่อสัตว์หรือคนในครอบครัวป่วย (when animals or family members are sick): report sick livestock, abortions, and unexpected deaths to the local veterinarian; do not handle or bury dead livestock, call the local veterinarian to dispose of the body correctly; if you feel sick, visit the local clinic or hospital; seek care early to help your chances of survival if you become seriously ill',
                  ] },
                ] },
            ] },
          { sub: 'Yellow Fever',
            body: [
              { sub: 'เชื้อ ยุง และอาการ',
                body: [
                  { bullets: [
                    'Genus *Flavivirus*, vector-borne diseases; ยุง (mosquitoes) คือ *Aedes* and *Haemagogus* mosquitoes',
                    'พบใน Africa, Central and South America',
                    '**African genotype (80%)**: seven genotypes',
                    '**South American genotype (20%)**: genotypes I and II',
                    'อาการในคน (symptoms in humans): fever, muscle pain, headache, loss of appetite, nausea or vomiting',
                    'ผู้ป่วยส่วนน้อย (a small percentage): jaundice, dark urine, abdominal pain with vomiting and bleeding',
                  ] },
                ] },
              { sub: 'ประวัติและการระบาด',
                body: [
                  { bullets: [
                    'First report ใน 17th century: Africa and South America',
                    '1927: first isolation in human',
                    '2016: large outbreak (Angola); traveler cases (Asia: China)',
                    'Estimate 200,000 cases (30,000 deaths) per year',
                  ] },
                ] },
              { sub: 'Transmission cycle',
                body: [
                  { bullets: [
                    '**South America**, Jungle (Sylvatic): Non-Human Primate กับ Mosquito (*Haemagogus* spp. and *Sabethes* spp.)',
                    '**South America**, Urban: Human กับ Mosquito (*Aedes aegypti*)',
                    '**Africa**, Jungle (Sylvatic): Non-Human Primate กับ Mosquito (*Aedes africanus*)',
                    '**Africa**, Intermediate (Savanna): Non-Human or Human Primate กับ Mosquito (Semi-domestic *Aedes* spp.)',
                    '**Africa**, Urban: Human กับ Mosquito (*Aedes aegypti*)',
                  ] },
                ] },
              { sub: 'Treatment และ prevention',
                body: [
                  { bullets: [
                    'Treatment: **no specific anti-viral drug**; supportive treatment',
                    'Prevention and control, **vaccination** (safe, affordable and a single dose provides life-long protection): endemic area, traveler to endemic area',
                    'Prevention and control, **vector control**',
                  ] },
                ] },
              { sub: 'Information for travellers และ general public',
                body: [
                  { bullets: [
                    'Source of infection: yellow fever เป็น **acute viral haemorrhagic disease** ที่ติดต่อผ่านยุง *Aedes* and *Haemagogus* species',
                    'Symptoms: fever, yellow eyes, dark urine, vomiting blood, diarrhoea, slow pulse',
                    'สำหรับ travellers (planning to travel to a country with yellow fever): get vaccinated; keep the yellow fever vaccination card with you; use a bed net; use mosquito repellent',
                    'สำหรับ general public (prevent it by): getting vaccinated (yellow fever vaccine gives lifelong immunity); avoiding mosquito bites by using repellents; sleeping under bed nets; wearing long sleeved, light-coloured clothing outdoors, especially after sunset; using window nets to prevent mosquitoes from entering; reducing mosquito breeding by clearing bushes, keeping grass short',
                    'Actions to take in case of symptoms: travellers, avoid travel to areas experiencing an outbreak and, if you experience symptoms, seek medical care immediately; general public, if you experience symptoms, seek medical care immediately',
                  ] },
                ] },
            ] },
          { sub: 'Japanese encephalitis (JE)',
            body: [
              { sub: 'เชื้อ พื้นที่ และอาการ',
                body: [
                  { bullets: [
                    'Genus *Flavivirus*, vector-borne disease ที่ติดจากการกัดของยุง (mosquitoes\' bites), *Culex* species',
                    'พบใน Asia: South-East Asia and Western Pacific regions',
                    '**Mild form**: fever and headache or without symptoms',
                    '**Severe illness**: high fever, headache, neck stiffness, disorientation, coma, seizures, spastic paralysis and ultimately death',
                    '**Case-fatality rate** is 30%',
                    'Permanent neurologic or psychiatric sequelae can occur in 30%-50%',
                  ] },
                ] },
              { sub: 'ประวัติและการระบาด',
                body: [
                  { bullets: [
                    '1st case of JE in 1871 in Japan',
                    'ปี 2022 JE outbreak ใน Australia',
                    'Estimate 68,000 cases (13,600-20,400 deaths) per year',
                  ] },
                ] },
              { sub: 'JE in animals',
                body: [
                  { bullets: [
                    '**Pig**: causes abortions and stillbirths',
                    '**Horse**: pyrexia, depression, muscle tremors, and ataxia',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '*Culex* species mosquitoes',
                    '**Pig and water birds** (important amplifiers)',
                    'วงจร: Amplifying Hosts / Natural Reservoirs กับ Mosquito Vector (*Culex* species) แล้วส่งต่อไปยัง **Dead-end Hosts** (คนและม้า)',
                  ] },
                ] },
              { sub: 'Treatment และ prevention',
                body: [
                  { bullets: [
                    'Treatment: **no antiviral treatment**; supportive treatment',
                    'Prevention and control, **vaccination**: endemic area, traveler to endemic area',
                    'Prevention and control, **vector control**',
                  ] },
                ] },
              { sub: 'Symptoms & Prevention',
                body: [
                  { bullets: [
                    'Symptoms: fever, head pain, change in behaviour, difficulties controlling movement/speech',
                    'Prevention: wear long sleeves and trousers to avoid being bitten; wear mosquito repellent; remove stagnant water from neighbourhoods and around homes; explore vaccination if in high risk areas or occupations',
                  ] },
                ] },
            ] },
          { sub: 'West Nile fever',
            body: [
              { sub: 'เชื้อ โฮสต์ และอาการ',
                body: [
                  { bullets: [
                    'Genus *Flavivirus*, vector-borne disease ที่ติดจากการกัดของยุง (mosquitoes\' bites), *Culex* species',
                    'ก่อโรคใน human, horses and birds',
                    'Symptom, **no signs or mild illness**: 1 in 5 people (fever with other symptoms such as headache, body aches, joint pains, vomiting, diarrhea, or rash)',
                    'Symptom, **severe form**: 1 in 150 people (fatal neurological illness)',
                    'Replicates in birds, reptiles, amphibians, mammals, mosquitoes and ticks',
                  ] },
                ] },
              { sub: 'ประวัติ',
                body: [
                  { bullets: [
                    '1937: แยกเชื้อได้ครั้งแรก (first isolated) จากเลือดของหญิงชาว Uganda',
                    '1951: ถูกอธิบายครั้งแรกว่าเป็นสาเหตุของ West Nile fever epidemic ในคนที่ Israel',
                    '1950s: field studies ใน Egypt พบบทบาทของยุงในการแพร่เชื้อ (viral transmission)',
                    '1997: เกี่ยวข้องกับโรคครั้งแรกใน Israeli domestic geese ที่มี neuroparalytic disease',
                    '1999: ปรากฏครั้งแรกใน Western hemisphere เมื่อ wild & zoo birds, horses, & people ตายใน northeast USA',
                  ] },
                ] },
              { sub: 'Transmission cycle',
                body: [
                  { bullets: [
                    'ในธรรมชาติ West Nile virus วนอยู่ระหว่าง mosquitoes (especially *Culex* species) กับ birds ซึ่งเป็น **Bird Amplifier Host**',
                    'นกที่ติดเชื้อบางตัวมี virus ในกระแสเลือดสูงได้ (can develop high levels of the virus in their bloodstream) และยุงติดเชื้อได้จากการกัดนกที่ติดเชื้อเหล่านี้; หลังประมาณ 1 สัปดาห์ (after about a week) ยุงที่ติดเชื้อส่ง virus ต่อให้นกตัวอื่นได้เมื่อกัด',
                    'ยุงที่มี West Nile virus กัดและทำให้ people, horses and other mammals ติดเชื้อได้ แต่ humans, horses and other mammals เป็น **dead end hosts**: ไม่เกิด virus ระดับสูงในกระแสเลือด (do not develop high levels of virus in their bloodstream) และส่ง virus ต่อให้ยุงตัวอื่นที่กัดไม่ได้',
                  ] },
                ] },
              { sub: 'Treatment และ control',
                body: [
                  { bullets: [
                    'Treatment: no specific treatment; supportive treatment',
                    'Prevention and control: **no vaccine**; **vector control**',
                  ] },
                ] },
            ] },
          { sub: 'Crimean-Congo Haemorrhagic fever (CCHF)',
            body: [
              { sub: 'เชื้อและอาการ',
                body: [
                  { bullets: [
                    'Genus *Nairovirus*, vector-borne diseases; vector คือ ticks',
                    'Symptom: fever, headache, flu-like',
                    'Symptom: bleeding (opening)',
                    'Symptom: hemorrhagic fever (severe case)',
                    '**9-50% mortality**',
                  ] },
                ] },
              { sub: 'ประวัติและพื้นที่',
                body: [
                  { bullets: [
                    '1944: 1st identified in Crimea (Crimean hemorrhagic fever)',
                    '1969: Congo → current name',
                    'พื้นที่ที่พบโรค (distribution): Eastern Europe, Mediterranean, Northwestern China, central Asia, Southern Europe, Africa, the Middle East, and the Indian subcontinent',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Ixodid (hard) ticks**',
                    'Numerous wild and domestic animals เป็น amplifying hosts',
                    'Direct and indirect contact',
                  ] },
                ] },
              { sub: 'Virus ecology: enzootic และ epizootic-epidemic cycle',
                body: [
                  { bullets: [
                    '**Enzootic cycle**: ixodid (hard) ticks เป็นทั้ง reservoir และ vector ของ CCHF virus; virus คงอยู่ในธรรมชาติแบบ transovarially และ transstadially; stage ของ tick ที่ระบุ: adult, eggs, larva, nymph',
                    '**Epizootic-Epidemic cycle**: CCHF cases เกิดมากขึ้นในช่วงที่อากาศอุ่น ส่วนใหญ่ช่วง spring และ summer และไม่มี case ในช่วง winter',
                    'Ticks feed on numerous wild and domestic animals เช่น cattle, goats, sheep, birds, and hares; สัตว์เหล่านี้เป็นทั้ง food sources ของ ticks และ amplifying hosts ของ CCHF virus',
                    'คนติดเชื้อผ่านการถูก tick กัดและการสัมผัสโดยตรง (direct contact) กับเลือดหรือเนื้อเยื่อของสัตว์ที่ติดเชื้อ',
                    'Transmission เกิดได้ขณะ slaughtering infected animals, ระหว่าง veterinary procedures และใน hospital settings ที่ขาด proper protective equipment และ appropriate disinfection procedures',
                  ] },
                ] },
              { sub: 'Treatment และ control',
                body: [
                  { bullets: [
                    'Treatment: no specific treatment; supportive care',
                    'Prevention and control, **vector control** (reducing the risk of tick-to-human transmission)',
                    'Prevention and control: **reducing the risk of animal-to-human transmission**',
                    'Prevention and control: **reducing the risk of human-to-human transmission**',
                  ] },
                ] },
            ] },
          { sub: 'Severe fever with thrombocytopenia syndrome virus (SFTSV)',
            body: [
              { sub: 'เชื้อ อาการ และสัตว์',
                body: [
                  { bullets: [
                    'Novel phlebovirus [*Dabie bandavirus*] → **SFTSV** by ICTV',
                    'Vector-borne diseases; vector คือ tick',
                    '6 genotype base on country',
                    'Symptom: acute fever, vomiting, diarrhea, fatigue, myalgia, thrombocytopenia, and leukocytopenia',
                    '**Mortality rate: 6-27%** (base on genotype)',
                    'ในสัตว์ (animal): sub-clinical sign',
                  ] },
                ] },
              { sub: 'ประวัติและการระบาด',
                body: [
                  { bullets: [
                    '2009: 1st identified in China',
                    '2012: Japan and Korea',
                    'Epidemic in several East Asian',
                    '2018: Cat in Japan → 2 veterinarians (PPE); รายงาน direct transmission ของ SFTSV จาก domestic cat สู่ veterinary personnel',
                    '2019-2020: Thailand',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    'Nature → unclear',
                    '**Tick** (base on *Phenuiviridae*): *Haemaphysalis longicornis* → migratory birds',
                    '**Tick** (base on *Phenuiviridae*): *Haemaphysalis flava*, *Rhipicephalus microplus*, *Amblyomma testudinarium*, *Dermacentor nuttalli*, *Hyalomma asiaticum*, and *Ixodes nipponensis*',
                    '(probability) **domestic animals** (amplifying hosts or incidental host)',
                    '**Direct contact with bodily fluids**',
                  ] },
                ] },
              { sub: 'Treatment และ control',
                body: [
                  { bullets: [
                    'Treatment: no specific treatment; supportive care',
                    'Prevention and control: **no vaccine**; **vector control**; avoid to contact infected people or animals',
                  ] },
                ] },
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
    summary: 'Rabies sample collection + diagnosis ที่ NIAH — Lyssavirus (Rhabdoviridae, ssRNA negative-sense, bullet-shape), DFA = WOAH gold standard, Fresh brain tissue (brain stem + cerebellum), Sample แช่เย็น 2-8°C ส่งใน 24 ชม. หรือแช่แข็ง -20°C.',
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
    summary: 'Epidemiology = study of distribution + determinants + application. 2 main types: Observational (descriptive + analytic) vs Experimental (clinical/field/community trial). ใช้กับ AMR, chemical/biological contamination, zoonoses.',
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
        heading: 'Epidemiology approach — aims, triad, study design, genomic',
        source: '10 - Epidemiological_approach_to_zoonoses_2024_SJ.pdf p.4-53',
        body: [
          { sub: 'Descriptive study และ Analytical study',
            body: [
              { sub: 'Descriptive study',
                body: [
                  { bullets: [
                    '**Descriptive study** ได้แก่ Case report, Case series, Cross-sectional, Ecological, Longitudinal',
                    'กำหนด population ที่จะศึกษา (define population to be studied)',
                    'Define disease/health condition',
                    'Describe disease ตาม **Time**, **Place**, **Person**',
                  ] },
                ] },
              { sub: 'Analytical study',
                body: [
                  { bullets: [
                    '**Analytical study** ได้แก่ Cross-sectional study, Case-control study, Cohort study',
                    'Analytic studies ทดสอบ hypotheses เกี่ยวกับความสัมพันธ์ระหว่าง exposure และ outcome',
                    'Measure association ระหว่าง exposure และ outcome',
                    '**Comparison group**',
                  ] },
                ] },
            ] },
          { sub: 'Aims of epidemiological studies',
            body: [
              'Aims of epidemiological studies มี 8 ข้อ',
              { bullets: [
                '1. Nature and extent of disease',
                '2. Causative agents',
                '3. Sources of infection',
                '4. Period of communicability',
                '5. Mode of transmission',
                '6. Susceptibility of population',
                '7. Incubation period',
                '8. Methods of control and prevention',
              ] },
            ] },
          { sub: '1. Nature and extent of disease',
            body: [
              { sub: 'Epidemiology provides basic information',
                body: [
                  { bullets: [
                    'Epidemiology ให้ข้อมูลพื้นฐาน เพื่อระบุว่า where และ what kind of prevention',
                    'เพื่อติดตาม (monitor) ความสำเร็จหรือความล้มเหลวของ prevention strategies',
                    'หัวข้อของ nature and extent of disease: Research method, Prevalence (increase/decrease), Incidence (increase/decrease), Risk factors, Rate of disease, High risk group',
                  ] },
                ] },
              { sub: 'Descriptive statistics of animals infected with rabies',
                body: [
                  { bullets: [
                    'Table 1: Descriptive characteristics of animals infected with rabies virus in Thailand, 2017–2018',
                  ] },
                  { table: {
                    headers: ['Characteristic', 'Year 2017', 'Year 2018'],
                    rows: [
                      ['**Type of animals**', '—', '—'],
                      ['Dog', '742 (87.5%)', '1,286 (87.2%)'],
                      ['Cattle', '57 (6.7%)', '118 (8%)'],
                      ['Cat', '41 (4.8%)', '51 (3.5%)'],
                      ['Others', '8 (0.9%)', '20 (1.4%)'],
                      ['**Ownership**', '—', '—'],
                      ['Owned animals', '449 (52.9%)', '839 (56.9%)'],
                      ['Stray animals', '297 (35.0%)', '502 (34.0%)'],
                      ['Unidentified', '102 (12.0%)', '134 (9.1%)'],
                      ['**Vaccination against rabies**', '—', '—'],
                      ['Unvaccinated', '337 (39.7%)', '575 (39.0%)'],
                      ['Vaccinated', '84 (9.9%)', '171 (11.6%)'],
                      ['Vaccinated < 1 month', '14 (1.7%)', '47 (3.2%)'],
                      ['Vaccinated > 1–6 months', '14 (1.7%)', '55 (3.7%)'],
                      ['Vaccinated > 6–12 months', '25 (2.9%)', '26 (1.8%)'],
                      ['Vaccinated > 12 months', '31 (3.7%)', '43 (2.9%)'],
                      ['Unidentified', '427 (50.4%)', '729 (49.4%)'],
                    ],
                  } },
                  { bullets: [
                    'Spatio-temporal distribution of animal rabies in Thailand, 2017–2018',
                  ] },
                ] },
            ] },
          { sub: '2. Causative agents',
            body: [
              { sub: 'Epidemiologic Triad',
                body: [
                  { bullets: [
                    'Epidemiologic Triad ประกอบด้วย **Agent**, **Host** และ **Environment**',
                    '**Host**: Behavior, Immunity, Health status, Genetic',
                    '**Agent**: Pathogen load, Infectious agents, Non-infectious agents, Present of agents',
                    '**Environment**: Biological aspect (host immunity), Physical aspect (temp, RH, wind), Chemical aspect (heavy metal), Social aspect',
                  ] },
                ] },
              { sub: 'Occurrence of disease',
                body: [
                  { bullets: [
                    'Susceptible Host, Virulent Pathogen และ Favorable Environment → **Disease**',
                    'Susceptible Host, Virulent Pathogen และ Unfavorable Environment → **Less Disease**',
                  ] },
                ] },
            ] },
          { sub: '3. Sources of infection',
            body: [
              { bullets: [
                '**Infectious disease** (communicable disease)',
                '**Cause and effect relation** (Henle-Koch\'s postulates)',
                '**Endemic, epidemic, and pandemic**',
                '**Intermediate and definitive host**',
                '**Environment**',
              ] },
            ] },
          { sub: '4. Period of communicability',
            body: [
              { bullets: [
                '**Incubation period**: Exposure to symptom',
                '**Latent period**: Exposure to communicability',
                '**Period of communicability** เริ่มหลัง Latent period',
                'ช่วง **Asymptomatic** อยู่ใน Incubation period และช่วง **Symptomatic** เริ่มเมื่อ Incubation period สิ้นสุด; Latent period สิ้นสุดก่อน Incubation period จึงมีช่วงที่ยัง Asymptomatic แต่อยู่ใน Period of communicability แล้ว',
              ] },
            ] },
          { sub: '5. Transmission routes',
            body: [
              { bullets: [
                '**Direct contact** transmission',
                '**Fomite** transmission',
                '**Aerosol** (airborne) transmission',
                '**Oral** (consumption) transmission',
                '**Vector-borne** transmission',
                '**Zoonotic** transmission',
                'Transmission routes of infectious diseases ระหว่าง Infected กับ Susceptible: **Close contact** (Airborne viruses), **Airborne** (Airborne viruses), **Fomite** (Surface viruses)',
                'เส้นทางเข้าสู่ Susceptible: **Close contact** ผ่าน inhalation or spray, **Airborne** ผ่าน inhalation, **Fomite** ผ่าน nose/mouth touch; ฝั่ง Infected: expiration และ evaporation; deposition พาเชื้อลงสู่พื้นผิว (fomite) และ resuspension พากลับขึ้นสู่อากาศ',
              ] },
            ] },
          { sub: 'SIR model',
            body: [
              { bullets: [
                'SIR model ประกอบด้วย **Susceptible** → **Infected** → **Recovered**',
                'dS/dt = -βSI ... (1)',
                'dI/dt = βSI - γI ... (2)',
                'dR/dt = γI ... (3)',
                'β = infection rate, γ = recovery rate',
                'I is the total number of people infected; R is the total number of people recovered; S is the total number of susceptible people',
                'β/γ = r (reproductive ratio), r = 3 → New infected persons=3, and recovered person=1',
              ] },
            ] },
          { sub: 'Outbreak reduction',
            body: [
              { bullets: [
                '**Decrease β** (Infection rate): Social distancing, Wear mask, Lockdown, Protective gear, Disinfectant',
                '**Increase γ** (Recovery rate): Case identification and isolation, Vaccine, Antiviral drugs',
              ] },
            ] },
          { sub: 'Chain of infection',
            body: [
              { bullets: [
                'Chain of infection ประกอบด้วย Infectious agent, Reservoir, Portal of exit, Mode of transmission, Portal of entry และ Susceptible host',
              ] },
              { sub: 'Transmission and portal of entry and exit',
                body: [
                  { bullets: [
                    '**Route of transmission**: Direct contact, Fomite, Ingestion, Airborne',
                    'คู่กับ Route of transmission: Handwashing, Sterilization, Air flow control, Food handling, Isolation',
                    '**Portal of entry and exit**: Mucous membrane, GI tract, respiratory tract, and broken skin',
                    '**Portal of entry and exit**: Excretion, secretion, skin, and droplet',
                    'คู่กับ Portal of entry and exit: Aseptic technique, Wound care, Hand washing, Control of excretion, Trash and waste disposal',
                  ] },
                ] },
            ] },
          { sub: '6. Susceptible person and transmission chain',
            body: [
              { bullets: [
                '**Susceptible Host**: Elderly, Infants, Immunocompromised, ANYONE!',
                '**Pathogen**: Bacteria, Virus, Fungi, Parasite',
                '**Reservoir**: People, Animals, Soil, Food, Water',
                '**Portal of Exit**: Coughing/Sneezing, Bodily Secretions, Feces',
                '**Mode of Transmission**: Direct Contact, Indirect Contact, Vectors',
                '**Portal of Entry**: Mouth, Nose, Eyes, Cuts in skin',
              ] },
            ] },
          { sub: '7. Incubation period และ Epidemic curve',
            body: [
              { bullets: [
                '**Epidemic curve** (Epi curve): จำนวน Patients/Sentinel site ตามเวลา (Weeks); **Onset** และ **End** คือจุดที่เส้นกราฟผ่านระดับ 1.0, **Peak** คือจุดสูงสุด (Peak number); **DOP** คือช่วงจาก Onset ถึง Peak และ **DOE** คือช่วงจาก Onset ถึง End',
                'นับจาก **Period of exposure** ถึงวันเริ่มป่วย (date of onset) ของ case: **Minimum incubation period** = จากท้าย period of exposure ถึง case แรก, **Average incubation period** = ถึง peak ของจำนวน case, **Maximum incubation period** = จากต้น period of exposure ถึง case สุดท้าย',
                '*E. coli* ชนิด Shiga toxin-producing มี average incubation period 4 days โดยมี range ตั้งแต่ min 2 days ถึง max 10 days',
              ] },
            ] },
          { sub: 'Tools of measurement',
            body: [
              { bullets: [
                '**Case count**, **Rate**, **Ratio**, **Proportion**',
                'Measure of occurrence of disease/event',
                'Useful for allocation of health resources',
              ] },
            ] },
          { sub: 'Epidemiology approach: Count, Divide, Compare',
            body: [
              { sub: 'Count, Divide, Compare',
                body: [
                  { bullets: [
                    '**Count**: Counts cases or health events → to describe as **time, place, and person**',
                    '**Divide**: Divides # of cases by a denominator → to calculate **rate and ratio**',
                    '**Compare**: เปรียบเทียบ rate ตามเวลา (compares the rate over time) และระหว่างกลุ่มคน (to different groups of people)',
                  ] },
                ] },
              { sub: 'Count → Case definition → Descriptive epidemiology',
                body: [
                  { bullets: [
                    'Count → **Case definition** → **Descriptive epidemiology** (Time, Place, Person)',
                  ] },
                ] },
              { sub: 'Divide, Rate → Analytical epidemiology',
                body: [
                  { bullets: [
                    'Divide, **Rate** → **Analytical epidemiology**: Comparison',
                    'Rate of disease among subgroup',
                    'Increase risk of disease (high risk group): need special intervention, identify risk factors',
                  ] },
                ] },
            ] },
          { sub: 'Case definition',
            body: [
              { sub: 'Case definition คืออะไร',
                body: [
                  { bullets: [
                    'Set a standard criteria for classification',
                    'ใช้กับ disease, syndrome, or other health related outcome',
                    'Case definition บางแบบใช้สำหรับ national surveillance/national standards',
                    'การใช้ case definition เดียวกันช่วยระบุ trend of disease (use the same case definition can identify the trend of disease)',
                    'มี standard case definitions สำหรับ notifiable infectious diseases',
                    'Local VS national case definition',
                  ] },
                ] },
              { sub: 'Case definition of listeriosis',
                body: [
                  { bullets: [
                    '**Clinical description**: produce any clinical syndromes, including stillbirth, listeriosis of the newborn, meningitis, bacteriemia, or localized infections',
                    '**Laboratory criteria for diagnosis**: isolation of agent from a normally sterile site (e.g., blood, cerebrospinal fluid, joint, pleural, or pericardial fluid)',
                    '**Case classification**: confirm case: a clinically compatible case that is laboratory confirmed',
                    'Outbreak Investigation, case definition: clinically compatible illness with *L. monocytogenes* isolated from a normally sterile site',
                    'Identification of place: California, USA',
                    'Time: October 24, 2022 and January 4, 2023',
                  ] },
                ] },
              { sub: 'Examples of case definition',
                body: [
                  { bullets: [
                    '**Modifying case definition**: case definition can change over time',
                    '**Variation in case definition**: depend on purpose of classification the occurrence of disease',
                    '**Sensitive case definition**: severe cases (anthrax); need more broad case definition to collect all of the true cases',
                    '**Strict case definition**: *Salmonella* Agona infection; aim to identify source of outbreak; not include all acute diarrhea persons',
                  ] },
                ] },
            ] },
          { sub: 'Descriptive epidemiology',
            body: [
              { sub: '5W\'s of descriptive epidemiology',
                body: [
                  { bullets: [
                    '**What** = Problem and concern',
                    '**Who** = Person',
                    '**Where** = Place',
                    '**When** = Time',
                    '**Why/How** = Cause, risk factor, and mode of transmission',
                  ] },
                ] },
              { sub: 'Time',
                body: [
                  { bullets: [
                    '**Season**: influenza (winter), West Nile virus infection (Aug-Sep)',
                    '**No season**: salmonellosis (all year round)',
                    'Point source or propagated',
                    'Epidemic curve',
                    'จากนั้น (→): Implement of control measures, Monitor disease occurrence, Assess public health intervention, Make policy decision',
                  ] },
                ] },
              { sub: 'Place',
                body: [
                  { bullets: [
                    'Geographical variation related to disease occurrence (restricted or widespread)',
                    '**Large area**: continent, country',
                    '**Small area**: street address',
                    '**Place category**: urban VS rural, domestic VS foreign, institutional VS noninstitutional',
                    'Relation to food and water supply',
                  ] },
                ] },
              { sub: 'Person',
                body: [
                  { bullets: [
                    '**Inherit characteristics** (age, sex, race)',
                    '**Biologic characteristics** (immune status)',
                    '**Acquired characteristics** (marital status, educational level)',
                    'Age and sex are common variable',
                    '**Sex-related difference** (genetic, hormonal, anatomic, inherent difference)',
                  ] },
                ] },
              { sub: 'Outbreak investigation',
                body: [
                  { bullets: [
                    '1. Identify investigator team and resources',
                    '2. Establish of existing outbreak',
                    '3. Verify the diagnosis',
                    '4. Construct case definition',
                    '5. Find case systematically',
                    '6. Perform descriptive epidemiology and generate hypothesis',
                    '7. Evaluate hypothesis and perform additional studies as necessary',
                    '8. Implement control measures',
                    '9. Communicate finding',
                    '10. Maintain surveillance',
                  ] },
                ] },
            ] },
          { sub: 'Analytical epidemiology',
            body: [
              { bullets: [
                'Descriptive epidemiology → Develop hypothesis → Cause of disease pattern, risk factor of disease → **Analytical epidemiology**',
                'Key feature: **comparison group**',
              ] },
            ] },
          { sub: 'Study design: Observational และ Experimental',
            body: [
              { sub: 'Observational study: Descriptive study และ Analytic study',
                body: [
                  { bullets: [
                    '**Descriptive study**: Distribution of a disease in population; Observing basic feature of its distribution in time, place, and person; Rely on pre-existing data; Surveillance activity',
                    '**Analytic study**: Testing validity of hypothesis by conducting an epidemiological study; Generate new data; Case-control, cohort, randomized control trial',
                  ] },
                ] },
              { sub: 'Research design pyramid',
                body: [
                  { bullets: [
                    'เรียงจากยอดถึงฐานพีระมิด: Systematic review และ meta-analysis, Literature review, Randomized controlled trial, Cohort study, Case-control study, Cross-sectional study, Case report/case series',
                  ] },
                ] },
              { sub: 'Epidemiological study',
                body: [
                  { bullets: [
                    '**Experimental study**: Clinical trial, Community trial',
                    '**Observational study**: Cohort study, Case-control study, Cross-sectional study',
                  ] },
                ] },
              { sub: 'Experimental study',
                body: [
                  { bullets: [
                    '**Clinical trial** → Individual; **Community trial** → Community',
                    'Exposure → Outcome',
                    '**Experiment**: Vaccine → Disease หรือ No disease',
                    '**Control**: Placebo → Disease หรือ No disease',
                  ] },
                ] },
              { sub: 'Cohort study',
                body: [
                  { bullets: [
                    'Prospective VS Retrospective cohort study',
                    'Exposure → Outcome',
                    '**Exposed** → Disease หรือ No disease',
                    '**Unexposed** → Disease หรือ No disease; เป็น Comparison group (baseline)',
                  ] },
                ] },
              { sub: 'Case-control study',
                body: [
                  { bullets: [
                    'Outcome → Exposure',
                    '**Disease** → Expose หรือ No expose',
                    '**No disease** → Expose หรือ No expose; เป็น Control group',
                    'Control group: Baseline or expected amount of exposure',
                  ] },
                ] },
              { sub: 'Cross-sectional study',
                body: [
                  { bullets: [
                    'ดู Outcome และ Exposure (Disease, Expose) พร้อมกัน (simultaneously observe)',
                    'Weaker than cohort and case-control study',
                    'Perfectly fine in descriptive epidemiology',
                  ] },
                ] },
            ] },
          { sub: 'Indices used in different methods',
            body: [
              { bullets: [
                '**Relative risk (RR)**: use in cohort study; measure of strength of association; incidence in exposed/incidence of unexposed',
                '**Attributable risk (AR)**: incidence in exposed - incidence of unexposed',
                '**Odds ratio**: use in case-control study',
                '**Short term fluctuation**: epidemic curve',
                '**Long term fluctuation**: trend',
              ] },
            ] },
          { sub: 'Screening and diagnosis',
            body: [
              { table: {
                headers: ['Screening', 'Diagnosis'],
                rows: [
                  ['Perform in healthy individuals', 'Perform in disease individuals'],
                  ['Apply on population', 'Apply on individual'],
                  ['Know result', 'Diagnosis is never final.'],
                  ['Base on criteria and cut off limit', 'Based on diagnostic test results, lab finding and clinical symptoms'],
                  ['Less accuracy; High sensitivity with moderate specificity', 'More accurate'],
                  ['Quick and less expensive', 'More expensive'],
                  ['Not the basis of treatment', 'Use as basis of treatment'],
                  ['Initiate from investigator or authorities', 'Initiated from patients or recommendation from clinicians'],
                ],
              } },
              { bullets: [
                '**Screening**: Prevention and control; **Diagnosis**: Treatment purpose',
              ] },
            ] },
          { sub: 'Meta analysis',
            body: [
              { bullets: [
                'Observational study',
                'Individual study may lack of power',
                'Combining data from several studies with similar hypotheses',
                'ตัวอย่างผลรวมจากหลาย study (Risk Ratio, RR [95%-CI]): Fixed effect model 0.75 [0.57; 1.00], Random effects model 0.79 [0.59; 1.05]; Heterogeneity: I² = 0%, τ² = 0, p = 0.70',
              ] },
            ] },
          { sub: 'Genomic epidemiology',
            body: [
              { table: {
                headers: ['Pathogen', 'Location', 'Finding of using WGS'],
                rows: [
                  ['Influenza virus', 'Worldwide', 'To observe serological changes and to direct selection and design of seasonal influenza vaccines.'],
                  ['Ebola (virus)', 'West Africa', 'To reconstruct transmission chains and confirm the first case of sexual transmission, and to immediate changes to guidance for male survivors that included a recommendation to have semen tested for presence of viral RNA.'],
                  ['Yellow fever (virus)', 'Brazil', 'To show the recent outbreak caused by repeated sylvatic (mosquito) spillover and not urban transmission. This finding informs vector control strategies.'],
                  ['MRSA (bacteria)', 'Cambridge, UK', 'To reconstruct transmission chains and identify a likely source, and to targeted decolonization.'],
                  ['*Listeria monocytogenes*', 'USA', 'To substantially improve ability to identify the source and cause of outbreaks.'],
                  ['*E. coli* O104:H4', 'Germany and France', 'To dissect a European outbreak of bloody diarrhea and hemolytic uremic syndrome caused by Shiga-toxin-producing *E. coli*.'],
                  ['*Candida auris* (fungus)', 'Oxford, UK', 'To identify contaminated equipment as the source of many infections acquired within a hospital intensive care unit (patient and environmental isolates).'],
                ],
              } },
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
    summary: 'Mycozoonoses = รา/ยีสต์ ที่ติดต่อจากสัตว์สู่คน, Fungi = eukaryote (มี nucleus + mitochondria — ต่างจาก bacteria), 2 forms: Yeast (unicellular, budding) + Mold (filamentous).',
    sections: [
      {
        heading: 'Mycozoonoses — title + course context',
        source: '11 - Z_Mycoses_3_Present.pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Suphachai Nuanualsuwan**, DVM, MPVM, PhD',
            'จากศูนย์เชี่ยวชาญเฉพาะทาง FAWRA (Food and Water Risk Analysis)',
            '**Mycozoonoses** = รา ยีสต์ ที่ติดต่อจากสัตว์สู่คน',
            '⭐ **สรุปข้อสอบเก่า Vet 82 ครอบคลุมหัวข้อนี้มาก** — Mycozoonoses + Protozoa (ดู Z.pdf, Zoonosis Final Vet82 Myco Protozoa)',
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
        heading: 'Mycozoonoses 8 โรค — Dermatophytosis ถึง Cryptococcosis',
        source: '11 - Z_Mycoses_3_Present.pdf p.4-87 + 11.5 - Sporotrichosis_gr.11.pdf',
        body: [
          { sub: 'Introduction — โครงสร้างและการจัดกลุ่มของรา',
            body: [
              { bullets: [
                'โครงสร้างของรา: **Mycelium**, **Hypha**, **Septum**, **Microconidia**',
              ] },
              { sub: 'Classification by living',
                body: [
                  { bullets: [
                    'แบ่งเป็น 4 แบบ: **Saprophyte**, **Obligate saprophyte**, **Facultative parasite**, **Obligate parasite**',
                  ] },
                ] },
              { sub: 'Classification by habitat',
                body: [
                  { bullets: [
                    '**Geophilic** — *Microsporum gypseum*',
                    '**Zoophilic** — *Microsporum canis*',
                    '**Anthropophilic** — *Microsporum audouinii*',
                    '**Entomogenous**',
                  ] },
                ] },
              { sub: 'Classification by morphology',
                body: [
                  { bullets: [
                    '**Mold** — *Aspergillus*',
                    '**Yeast**',
                    '**Yeast-like fungi** — *Candida albicans*',
                    '**Dimorphic (Diphasic)** — *Coccidioides*, *Histoplasma*, *Blastomyces*, *Cryptococcus*',
                  ] },
                ] },
            ] },
          { sub: 'Mycoses — 3 กลุ่ม',
            body: [
              { bullets: [
                '**Superficial & Cutaneous mycoses**: Dermatophytosis',
                '**Subcutaneous mycoses**: Candidiasis',
                '**Systemic mycoses**: Coccidioidomycosis, Histoplasmosis, Blastomycosis, Sporotrichosis, Cryptococcosis',
              ] },
            ] },
          { sub: 'Mycozoonoses — 8 โรคในบทนี้',
            body: [
              { callout: 'Mycozoonoses ที่ครอบคลุมมี 8 โรค: **Dermatophytosis**, **Candidiasis**, **Aspergillosis**, **Coccidioidomycosis**, **Histoplasmosis**, **Blastomycosis**, **Sporotrichosis**, **Cryptococcosis**', kind: 'tip' },
            ] },
          { sub: '1. Dermatophytosis',
            body: [
              { sub: 'Dermatophytes — 3 กลุ่ม',
                body: [
                  { bullets: [
                    '**Dermatophytes** แบ่งเป็น 3 กลุ่ม: **Anthropophilic**, **Zoophilic**, **Geophilic**',
                    '**Synonym**: Tinea or Ringworm',
                    '**Anthropophilic dermatophytes**: *Trichophyton* species, *Microsporum audouinii*, *Epidermophyton floccosum*',
                    '**Geophilic dermatophyte**: *Microsporum gypseum*',
                  ] },
                ] },
              { sub: 'Zoophilic dermatophytes — species และสัตว์ที่ระบุ',
                body: [
                  { table: {
                    headers: ['Species', 'สัตว์/แหล่งที่ระบุ'],
                    rows: [
                      ['*T. verrucosum*', 'โค ม้า'],
                      ['*T. mentagrophytes*', 'สุนัข แมว หนู โค ม้า และดิน'],
                      ['*T. gallinae*', 'ไก่'],
                      ['*T. equinum*', 'ม้า'],
                      ['*T. simii*', 'ลิง'],
                      ['*M. equinum*', 'ม้า'],
                      ['*M. gypseum*', 'ม้า ดิน'],
                      ['*M. canis*', 'สุนัข แมว'],
                      ['*M. nanum*', 'สุกร'],
                    ],
                  } },
                ] },
              { sub: 'Occurrence และ disease in man',
                body: [
                  { bullets: [
                    '**Geographical distribution**: Worldwide',
                    '**Occurrence in man**: anthropophilic และ zoophilic (เช่น *M. canis*, *Trichophyton* spp.)',
                    '**Diseases in man**: Tinea capitis, Tinea barbae, Tinea corporis, Tinea pedis',
                  ] },
                ] },
              { sub: 'Occurrence in animal',
                body: [
                  { bullets: [
                    '*M. canis*: rural and urban, cat > dog',
                    '*T. verrucosum*, *T. mentagrophytes*: livestock, horse',
                  ] },
                ] },
              { sub: 'Disease in animal',
                body: [
                  { bullets: [
                    '**Cat**: inapparent or face & paw',
                    '**Dog**: any skin area',
                    '**Cattle**: face and flank',
                    '**Horse**: harness friction area',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Direct contact**: crowded',
                    '**Indirect**: Debris & Airborne?',
                    '**Zoophilic** ติดต่อจาก animal-to-man เท่านั้น ไม่ใช่ man-to-man',
                  ] },
                ] },
              { sub: 'Role of animal in epidemiology',
                body: [
                  { bullets: [
                    'เป็น **reservoir**',
                    'เจ้าของ dog & cat เป็น ringworm 10% และ 30% ตามลำดับ',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Microscopic exam** — เช่น *Microsporum canis*, *Trichophyton rubrum*, *Epidermophyton floccosum*',
                    '**Wood\'s filter** (UV light)',
                    '**Fungal culture**',
                    '**Dermatophyte test medium (DTM)** หรือ **Fungassay**',
                  ] },
                ] },
              { sub: 'Dermatophyte test medium (DTM) หรือ Fungassay',
                body: [
                  { bullets: [
                    'As early as **48 hours** after inoculation',
                    'Color change within the medium จาก **amber** เป็น **red**',
                    'Ready-to-use สำหรับ culture ของ dermatophytic fungi',
                    'ไม่จำเป็นต้องเตรียม medium',
                    'Refrigerate test medium เพื่อ optimum storage',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    'ควบคุมการแพร่ติดต่อใน **reservoir**',
                    'แยกและรักษาสัตว์',
                    '**Disinfection**',
                    'หลีกเลี่ยงไม่ให้สัตว์สัมผัสโดยตรงกับ disease-causing agents',
                  ] },
                ] },
            ] },
          { sub: '2. Candidiasis',
            body: [
              { sub: 'Etiology, synonym และ distribution',
                body: [
                  { bullets: [
                    '**Synonym**: Candidosis, Moniliasis, Thrush',
                    '**Etiology**: *Candida albicans*, *Candida tropicalis*',
                    '**Geographic distribution**: Worldwide',
                  ] },
                ] },
              { sub: 'Occurrence in man',
                body: [
                  { bullets: [
                    '**Opportunistic mycosis** (most common)',
                    'ใช้ **antimicrobial & corticosteroid** เป็นเวลานาน',
                    '**Sporadic**',
                    '**Nursery**',
                  ] },
                ] },
              { sub: 'Disease in man',
                body: [
                  { bullets: [
                    '**Superficial form**: oropharyngeal moniliasis, cutaneous moniliasis, vulvovaginal thrush',
                    '**Systemic form** (mortality rate 40%): septicemia, pulmonary, pericarditis',
                    'โรคในคนที่ระบุ: **Oropharyngeal moniliasis**, **Vulvovaginal thrush**, **Cutaneous thrush**, **Opportunistic visceral mycoses**',
                    '**Oropharyngeal moniliasis**: mycotic stomatitis, unweaning infant, cheilitis, denture wearing',
                  ] },
                ] },
              { sub: 'Disease in animal (sporadic)',
                body: [
                  { bullets: [
                    '**Avian moniliasis**',
                    '**Oral moniliasis**',
                    '**Mastitis**: cattle',
                    '**Abortion**: cattle, horse',
                  ] },
                ] },
              { sub: 'Avian moniliasis',
                body: [
                  { bullets: [
                    'Sporadic with **Mortality 8-20%**',
                    'Acute + Nervous symptom',
                    'Upper digestive tract',
                    'Post-mortem: plaque or necrosis in **crop**',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Endogenous** (*C. albicans*: normal flora)',
                    '**Opportunistic** with disease, antimicrobial, corticosteroid',
                    '**Direct contact**: secretions',
                  ] },
                ] },
              { sub: 'Role of animals in the epidemiology',
                body: [
                  { bullets: [
                    'Avian moniliasis → poultry processing worker',
                    'Manure of sick animal to meat inspector ??',
                    'Diarrhoeal strain of *C. albicans* to Man ??',
                  ] },
                ] },
            ] },
          { sub: '3. Aspergillosis',
            body: [
              { sub: 'Etiology, synonym และ distribution',
                body: [
                  { bullets: [
                    '**Synonym**: Pneumonomycosis, Bronchomycosis',
                    '**Etiology**: *Aspergillus fumigatus*, *Aspergillus flavus*',
                    '**Geographic distribution**: Worldwide, Saprophyte',
                  ] },
                ] },
              { sub: 'Occurrence in man',
                body: [
                  { bullets: [
                    '**Sporadic**',
                    '**Opportunistic**',
                    'ใช้ **antimicrobial & corticosteroid** เป็นเวลานาน',
                    'Deliberating patients',
                    'Occupation with soil exposure',
                  ] },
                ] },
              { sub: 'Disease in man',
                body: [
                  { bullets: [
                    '**Localized**: asthma & allergy, haemoptysis, Aspergilloma (tubercle)',
                    '**Aspergilloma**: fungus ball ที่ colonize ใน healed lung scar หรือ abscess จาก previous disease',
                    '**Invasive**: Bronchopneumonia, Meningitis, Endocarditis, Otomycosis',
                  ] },
                ] },
              { sub: 'Disease in animal',
                body: [
                  { bullets: [
                    '**Cattle**: 75% of Mycotic abortion; Placentitis; Dermatitis → bronchopneumonia',
                    '**Avian aspergillosis**: Acute, wasting; tubercles in lung and air sac',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Ubiquitous**',
                    '**Opportunistic**',
                    '**Fodder and bedding**',
                    '**Soil**',
                    'Prolonged or Massive dose of **spore inhalation**',
                  ] },
                ] },
              { sub: 'Role of animal in the epidemiology',
                body: [
                  { bullets: [
                    '**Saprophyte**',
                    'ไม่มี direct transmission จาก animal to man',
                  ] },
                ] },
            ] },
          { sub: '4. Coccidioidomycosis',
            body: [
              { sub: 'Etiology, synonym และ occurrence in man',
                body: [
                  { bullets: [
                    '**Synonym**: Desert fever, Desert rheumatism, San Joaquin Valley fever',
                    '**Etiology**: *Coccidioides immitis* (saprophyte)',
                    '**Occurrence in man**: Endemic or Hyperendemic area',
                  ] },
                ] },
              { sub: 'Disease in man',
                body: [
                  { bullets: [
                    '**Pulmonary** coccidioidomycosis',
                    '**Disseminated** coccidioidomycosis',
                    'การหายใจเอา fungus เข้าไปทำให้เกิดการติดเชื้อใน vital organs ได้ (Brain, Lung, Heart, Liver)',
                  ] },
                ] },
              { sub: 'Occurrence in animal',
                body: [
                  { bullets: [
                    'สัตว์ที่ susceptible มากที่สุดคือ **cattle** และ **dog**',
                    'Animal in dry or dusty field',
                    '**Spherule** forms ของ *Coccidioides immitis*',
                  ] },
                ] },
              { sub: 'Disease in animal',
                body: [
                  { bullets: [
                    '**Cattle**: Inapparent symptom; Bronchial & mediastinal lymph nodes; Retropharyngeal lymph node',
                    '**Dog**: Boxer or Doberman',
                    'วงจรของเชื้อ: **dry desert topsoil** (alternating cell atrophy, enteroarthric development) → **airborne arthroconidia** → lung infection ใน dog',
                    'ใน lung: arthroconidia in terminal bronchiole → contact with alveolar epithelium → **spherule** (septation, vacuole, segmentation) → **endosporulation and release**',
                    'Infected macrophages enter capillaries and lymphatic vessels; lymphatics drain to intrathoracic lymph node; osteomyelitis, local swelling and drainage',
                    '**Dog**: Pulmonary; Disseminated',
                  ] },
                ] },
              { sub: 'Dog, disseminated — รอยโรคตามอวัยวะ',
                body: [
                  { bullets: [
                    '**Lung**: numerous yellow nodules throughout the parenchyma',
                    '**Lung**: white nodule partially surrounding the bronchi',
                    '**Heart**: well-delimited and yellowish circular area in the myocardium',
                    '**Epididymis**: diffuse, yellow-white thickening surrounding tunica albuginea',
                    '**Testicle**: parenchymal nodule with the undifferentiated sarcoma area',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Saprophytic**',
                    'เจริญในช่วง rainy → กระจายตัวในช่วง dry and windy',
                  ] },
                ] },
              { sub: 'Role of animal in epidemiology',
                body: [
                  { bullets: [
                    'ไม่มี direct animal-to-man หรือ man-to-man',
                  ] },
                ] },
            ] },
          { sub: '5. Histoplasmosis',
            body: [
              { sub: 'Etiology, synonym และ occurrence in man',
                body: [
                  { bullets: [
                    '**Synonym**: Reticuloendothelial cytomycosis',
                    '**Etiology**: *Histoplasma capsulatum*',
                    '**Occurrence in man**: high incidence of infection but low morbidity',
                    '**Risk factor**: exposure to bird or bat droppings',
                    '*Histoplasma capsulatum* infects organs of the body through the bloodstream',
                  ] },
                ] },
              { sub: 'Disease in man',
                body: [
                  { bullets: [
                    '**Acute pulmonary** → calcified foci',
                    '**Chronic pulmonary**',
                    '**Disseminated pulmonary**',
                  ] },
                ] },
              { sub: 'Occurrence and disease in animal',
                body: [
                  { bullets: [
                    'สัตว์ที่ susceptible มากที่สุดคือ **dog**',
                    'Usually **inapparent**',
                    'Clinical signs are similar to human',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Inhalation**',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    'Avoid inhalation of soil and dust',
                    'Kill the agent by **formalin 3%**',
                  ] },
                ] },
              { sub: 'Role of animal in epidemiology',
                body: [
                  { bullets: [
                    'ไม่มี direct animal-to-man transmission',
                  ] },
                ] },
            ] },
          { sub: '6. Blastomycosis',
            body: [
              { sub: 'Etiology และ occurrence in man',
                body: [
                  { bullets: [
                    '**Etiology**: *Blastomyces dermatitidis*',
                    '**Occurrence in man**: sporadic',
                    'average 38 yrs. 65% man',
                  ] },
                ] },
              { sub: 'Disease in man',
                body: [
                  { bullets: [
                    '**Pulmonary**',
                    '**Disseminated** → skin, bone, genitourinary, CNS',
                    'รอยโรคที่ผิวหนัง: **verrucous lesion of the skin**',
                    'Chest radiograph: พบ **upper lobe cavities**',
                    'Reconstructed coronal CT of the chest: **cavitary disease**',
                    'Staining of biopsy tissue: พบ **broad-based budding yeast cells** ซึ่งเป็นลักษณะเฉพาะของ *Blastomyces dermatitidis*',
                  ] },
                ] },
              { sub: 'Occurrence and disease in animal',
                body: [
                  { bullets: [
                    'สัตว์ที่ susceptible มากที่สุดคือ **canine**',
                    'Canine: male, middle age, black color',
                    'Pulmonary → Disseminated (skin)',
                    'รอยโรคที่ระบุ: **Fistula**, **Granuloma**',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Saprophytic**',
                    '**Direct contact**',
                    '**Airborne**',
                  ] },
                ] },
              { sub: 'Role of animal in epidemiology',
                body: [
                  { bullets: [
                    '**Dog** is a potential source',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    'Avoid soil and dust',
                    'Avoid direct contact dog with disease',
                  ] },
                ] },
            ] },
          { sub: '7. Sporotrichosis',
            body: [
              { sub: 'Etiology และ synonym',
                body: [
                  { bullets: [
                    '**Etiology**: *Sporothrix schenckii* (worldwide), *Sporothrix globosa* (worldwide), *Sporothrix brasiliensis* (US.)',
                    '**Synonym**: rose gardener\'s disease',
                  ] },
                ] },
              { sub: 'Occurrence in man',
                body: [
                  { bullets: [
                    'คนที่สัมผัส **sphagnum moss**, **rose bushes**, **hay** เช่น forestry workers, tree nursery, garden centers และ hay bale',
                    '**Low immune systems**',
                    'โรคอื่น เช่น diabetes, chronic obstructive pulmonary disease (COPD), alcoholism หรือ HIV',
                  ] },
                ] },
              { sub: 'Disease in man — cutaneous (skin) sporotrichosis',
                body: [
                  { bullets: [
                    'Fungus entered through a break in the skin',
                    'ตุ่มเล็กไม่เจ็บ (painless) สีแดง ชมพู หรือม่วง ที่นิ้ว มือ หรือแขน',
                    'ตุ่มโตขึ้นและดูเหมือนแผลเปิด (open sore) หรือ ulcer ที่หายช้ามาก',
                  ] },
                ] },
              { sub: 'Disease in man — pulmonary (lung) sporotrichosis',
                body: [
                  { bullets: [
                    '**Rare**; cough, shortness of breath, chest pain, fever',
                  ] },
                ] },
              { sub: 'Disease in man — disseminated sporotrichosis',
                body: [
                  { bullets: [
                    'ขึ้นกับ body part ที่ได้รับผล',
                    '**Joints** ทำให้ปวดข้อได้ ซึ่งอาจสับสนกับ rheumatoid arthritis',
                    '**Central nervous system** อาจเกี่ยวข้องกับ difficulty thinking, headache และ seizures',
                  ] },
                ] },
              { sub: 'Occurrence in animal',
                body: [
                  { bullets: [
                    'พบใน dogs, cats, horses, cows, camels, dolphins, goats, mules, birds, pigs, rats, armadillos และ humans',
                    'Zoonotic infection จาก **cats to humans** และมีรายงานโดยไม่มีหลักฐานของ trauma',
                    'Transmission จาก infected species อื่นต้องมี inoculation ของ previously traumatized skin',
                    'พบ organisms จำนวนมากใน/บน feline wounds, claws และ manure ซึ่งเป็นสาเหตุให้ feline sporotrichosis มี zoonotic potential เพิ่มขึ้น',
                    '**Cats** มีบทบาทใน zoonotic transmission',
                    'Caretakers ของแมวที่ติดเชื้อมีโอกาสติดเชื้อมากกว่าคนอื่นที่อยู่ในครัวเรือนเดียวกัน 4 เท่า',
                  ] },
                ] },
              { sub: 'Disease in animal — 3 รูปแบบ',
                body: [
                  { bullets: [
                    '**Lymphocutaneous**, **Cutaneous**, **Disseminated**',
                  ] },
                ] },
              { sub: 'Disease in animal — lymphocutaneous',
                body: [
                  { bullets: [
                    '**Most common**',
                    'Small, firm dermal to subcutaneous nodule, 1–3 cm.',
                    'เมื่อการติดเชื้อลามขึ้นตาม lymphatic vessels เกิด **cording** และมี nodules ใหม่',
                    'Lesions ulcerate & discharge a **serohemorrhagic exudate**',
                  ] },
                ] },
              { sub: 'Disease in animal — cutaneous',
                body: [
                  { bullets: [
                    'Localized to the site of inoculation',
                    'Lesions may be **multicentric**',
                  ] },
                ] },
              { sub: 'Disease in animal — disseminated',
                body: [
                  { bullets: [
                    '**Rare**, Potentially fatal',
                    'เกิดเมื่อปล่อยปละละเลย cutaneous & lymphocutaneous forms หรือรักษาด้วย corticosteroids อย่างไม่เหมาะสม',
                    'เกิดจาก hematogenous หรือ tissue spread จากตำแหน่ง inoculation แรกไปยัง bone, lungs, liver, spleen, testes, GI tract หรือ CNS',
                  ] },
                ] },
              { sub: 'Diagnosis in animal',
                body: [
                  { bullets: [
                    '**Cytology**, especially in cats',
                    'Yeasts อาจถูกสับสนกับ fungal organisms อื่น เช่น *Histoplasma*',
                  ] },
                ] },
              { sub: 'Role of animal in epidemiology',
                body: [
                  { bullets: [
                    '**Important zoonosis**',
                    '**Feline-to-human** transmission',
                    'Strict hygiene เมื่อ handling patients (โดยเฉพาะ cats)',
                    'ต้องปฏิบัติ **good biosecurity** รวมถึง personal protective equipment (PPE) และ premises disinfection',
                  ] },
                ] },
            ] },
          { sub: 'Sporotrichosis ในแมว — field observation ที่วัดแห่งหนึ่ง',
            body: [
              { sub: 'Objective, case definition และ method',
                body: [
                  { bullets: [
                    'เหตุผลที่ต้องทำ field observation ซ้ำ: ติดตามการเปลี่ยนแปลงการจัดการหลังจากที่ได้ให้คำแนะนำไป และติดตามการเปลี่ยนแปลงของจำนวนแมวที่เป็นโรคและสงสัยว่าเป็นโรค',
                    '**Objective**: เพื่อสำรวจการเกิดโรค Sporotrichosis ที่วัดแห่งหนึ่ง',
                    'เพื่อสำรวจปัจจัยเสี่ยงเพิ่มเติมที่ทำให้เกิดโรค',
                    'เพื่อติดตามความก้าวหน้าของการป้องกันโรค',
                    'ให้ความรู้แก่เจ้าของแมวเกี่ยวกับโรค การดูแล และป้องกันการแพร่โรคจากสัตว์สู่คน',
                    '**Suspected cases**: พบแผลหลุมที่บริเวณจมูก ใบหน้าหรือตามลำตัว',
                    '**Confirmed cases**: ผล cytology จากการทำ impression smear พบเชื้อ *Sporothrix*',
                    'ตัวอย่างที่เก็บ: **Impression smear** และ **Environmental swab**',
                    'อุปกรณ์: ถุงมือจับแมว, ถุงมือ, Methanol, Slide, Cotton swab, Normal saline, ทิชชู่, Virkon & Alcohol, ดินสอ & ปากกา label, ซองซิปล็อค, ขวดทิ้ง swab & กระป๋องทิ้งของมีคม, ถุงขยะ (แดง & ดำ), Fact sheet',
                    'ตารางเก็บข้อมูลมีหัวข้อ: No., Age, Sex/neutered, BCS, vaccine, Lesion, Respiratory (Air flow, Nasal dc), Specimen type (Impression smear, Swab), Note',
                  ] },
                ] },
              { sub: 'Results',
                body: [
                  { bullets: [
                    '**Suspected cases**: n = 5',
                    '**Confirmed cases**: n = 3 (old 1 ตัว, new 2 ตัว)',
                    '**Sex**: female 100%; **Age**: น้อยกว่า 6 เดือน 67.7%, มากกว่า 6 เดือน 33.3%',
                    '2 months ago: เคสเดิมและลูกแมวที่มาตรวจพร้อมกันมี history แผลหลุมบริเวณใบหน้าและจมูก, ก้อนเลือดออกบริเวณจมูกและเท้า และอาการจาม → **Tentative diagnosis**: Sporotrichosis',
                    'ติดตามผลเคสเดิม: อาการรุนแรงกว่าเดิม มีแผลเพิ่มที่บริเวณใบหู แผลขนาดใหญ่ขึ้น แตกและมีเลือดออก',
                    'ลูกแมวของเคสเดิมที่มาตรวจพร้อมกันเมื่อครั้งก่อน: หลังกินยา ABOs แต่ไม่ได้กินยาต้านเชื้อราร่วมด้วย แผลที่จมูกดูเหมือนดีขึ้น แต่หลังจากนั้นมีอาการซึม ไม่กินอาหาร และเสียชีวิต',
                    'เคสใหม่ 2 ตัวเป็นลูกของเคสเดิม: female (intact), < 6 month, น้ำหนัก 1 kg และ 1.5 kg; lesion ที่จมูกและมี nasal discharge; ตัวที่หนัก 1 kg มี lesion ที่เท้าหน้าด้านซ้ายและขวาและเท้าหลังขวาด้วย และเริ่มมีรอยโรคช่วงที่ลูกแมวตัวที่มาตรวจครั้งก่อนตาย',
                    '**Environmental swab**: NOT FOUND ที่ชามข้าว ถาดข้าว ดิน ที่นอนแมวในกรงไม้ ประตูรั้ว อาหารนกพิราบ และตั่งที่แมวนอน',
                    '**Management**: ไม่ได้แยกเลี้ยงแมวปกติกับแมวที่เป็นโรค; ไม่ได้ใส่ถุงมือก่อนสัมผัสแมวที่เป็นโรค; ไม่ได้มีการทำความสะอาดของใช้หรือกรงด้วยน้ำยาฆ่าเชื้อ',
                  ] },
                ] },
              { sub: 'Potential risk factors — Animal, Human, Environment',
                body: [
                  { table: {
                    headers: ['Factor', 'เคสเดิม (old)', 'เคสใหม่ (new)', 'เคสใหม่ (new)'],
                    rows: [
                      ['Age', '4 Y', '< 6 M', '< 6 M'],
                      ['Sex', 'Female', 'Female', 'Female'],
                      ['ทำหมัน', 'X', 'X', 'X'],
                      ['BCS', '2/9', '4/9', '3/9'],
                    ],
                  } },
                  { bullets: [
                    '**Animal**: ที่อยู่ของทั้ง 3 ตัวระบุเป็นที่เดียวกัน',
                    '**Animal**: **Queen to kitten transmission** — possible factors: Health / underlying diseases; Immune status; Close contact',
                    '**Human** (Management, Attitude): สัมผัสแมวป่วยและแมวตัวอื่นด้วยมือเปล่า',
                    '**Human**: ไม่กักตัวแมวป่วยและไม่สามารถรักษาต่อเนื่องได้; ไม่แยกชามอาหาร/น้ำระหว่างแมวปกติกับแมวป่วย',
                    '**Human**: ใช้วัสดุกรงและที่นอนไม่เหมาะสม; ทำความสะอาดวัสดุอุปกรณ์ไม่ถูกวิธี',
                    '**Environment** (Location, Habitat, Climate): บริเวณวัดเป็นแหล่งท่องเที่ยว/ชุมชน',
                    '**Environment**: บริเวณโดยรอบวัดเป็นดิน ต้นไม้ และกองไม้ทับถม',
                    '**Environment**: ฤดูฝน และอากาศร้อนชื้นเหมาะสมแก่การเจริญเติบโตของเชื้อรา',
                  ] },
                ] },
              { sub: 'Client education',
                body: [
                  { bullets: [
                    'สวมถุงมือขณะสัมผัสแมวป่วย และล้างมือทุกครั้งหลังสัมผัสแมวป่วย',
                    'หากมีบาดแผลไม่ควรไปสัมผัสแมวป่วย โดยเฉพาะบริเวณที่มีรอยโรค',
                    'แยกเลี้ยงแมวป่วยออกจากแมวที่ไม่เป็นโรค และแยกชามน้ำและชามอาหารของแมวป่วยออกจากแมวปกติ',
                    'พยายามให้ยารักษาแมวป่วยอย่างต่อเนื่องจนกว่าจะหาย',
                    'ควรใช้วัสดุกรงขังที่ง่ายต่อการทำความสะอาด และหมั่นทำความสะอาดบริเวณที่อยู่อาศัยด้วยไฮเตอร์ผสมน้ำ (1:3) ทิ้งไว้ 10 นาที',
                    'ทำหมันเพื่อลดพฤติกรรมก้าวร้าว; กำจัด-เก็บกวาดกองไม้บริเวณโดยรอบ; กำจัดซากแมวที่ป่วยตายอย่างเหมาะสม',
                    'เลี้ยงแมวในบ้าน',
                    'เกิดจากเชื้อราที่พบได้ตามสิ่งแวดล้อม พื้นดิน ก่อโรคในแมวสู่แมว และติดคนได้; การติดโรคสู่คนติดต่อทางบาดแผล หรือรอยข่วน-กัด; รักษาหายได้ด้วยการกินยาฆ่าเชื้อราอย่างต่อเนื่อง',
                    'อาการในแมว: แผลหลุมที่จมูก ใบหน้า ลำตัว และขา; น้ำมูกไหล ไอ จาม',
                    'อาการในคน: ผื่น ตุ่มหนอง; แผลที่ผิวหนัง; ต่อมน้ำเหลืองบวมโต; ข้ออักเสบ',
                  ] },
                ] },
            ] },
          { sub: '8. Cryptococcosis',
            body: [
              { sub: 'Etiology',
                body: [
                  { bullets: [
                    '**Etiology**: *Cryptococcus neoformans*',
                    'Variety *neoformans*',
                    'Variety *gattii*',
                    '**Budding yeast with capsule** (India ink, Wright-Giemsa)',
                  ] },
                ] },
              { sub: 'Occurrence and disease in man',
                body: [
                  { bullets: [
                    '**Sporadic**, Male > Female',
                    '**Acute** → **Chronic** pulmonary infection',
                    '**Cryptococcoma**',
                  ] },
                ] },
              { sub: 'Occurrence and disease in animal',
                body: [
                  { bullets: [
                    'Pulmonary → CNS in cat > dog',
                    'Cryptococcal bovine mastitis',
                    'Nasal granuloma in horse',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Saprophyte**',
                    'Pigeon dropping (rich in creatinine as Nitrogen source)',
                  ] },
                ] },
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
    summary: 'Prion = TSE (Transmissible Spongiform Encephalopathy), Neurodegenerative, ไม่ใช่ bacteria/fungi/virus — เป็น abnormal protein, no genetic material. Long incubation + rapidly progressive + always fatal. Human: CJD, vCJD, GSS, FFI, Kuru.',
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
        heading: 'Prion biology, CJD, vCJD, BSE และ Scrapie',
        source: '12 - Prion_diseases_Zoonoses_(5th_year_student___2567).pdf p.4-32',
        body: [
          { sub: 'Introduction — animal prion diseases และ prion',
            body: [
              { sub: 'Animal prion diseases',
                body: [
                  { bullets: [
                    '**Animal prion diseases** ได้แก่ **bovine spongiform encephalopathy (BSE)**, **scrapie**, **chronic wasting disease (CWD)**, **transmissible mink encephalopathy**, **feline spongiform encephalopathy** และ **ungulate spongiform encephalopathy**',
                  ] },
                ] },
              { sub: 'Prion — proteinaceous infectious particle',
                body: [
                  { bullets: [
                    '**Prion** = **proteinaceous infectious particle**',
                    'เป็น protein ที่พบตามปกติใน **harmless form**',
                    'encode โดย *prnp* gene (prion protein, PrP)',
                    'มี **2 forms**: **normal cellular form (PrP^C)** หรือ **normal neural protein** — alpha helices, soluble และ protease sensitive',
                    '**abnormal scrapie form (PrP^SC)** หรือ **pathogenic protein** — beta sheet, insoluble และ protease resistant',
                    'พบตามปกติใน cells แต่ PrP^SC proteins พบในปริมาณน้อยมาก (mainly in the central nervous system)',
                    '**PrP^SC** convert normal **PrP^C** proteins ให้เป็น **infectious form** ได้ โดยการเปลี่ยน **conformation**',
                    '**abnormal folding** ของ normal cellular prion proteins ใน brain นำไปสู่ **brain damage**',
                  ] },
                ] },
              { sub: 'Transmission',
                body: [
                  { bullets: [
                    '**Vertical transmission** หรือ **mutation**: **familial** form (from parents) หรือ mutation ของ *prnp* gene (**sporadic** cases)',
                    '**Horizontal transmission**: consumption of foods containing PrP^SC หรือ **iatrogenic** form ผ่าน contaminated medical instruments',
                    'prion **highly resistant** ต่อ heat และ chemicals',
                  ] },
                ] },
              { sub: 'Clinical symptoms',
                body: [
                  { bullets: [
                    'mainly found in **Caucasian**',
                    '**corpus callosum** and **hypothalamus** as well as muscle, blood, spleen, digestive tract, and mammary gland',
                    '**spongiform encephalitis**',
                    'headache, unsteadiness, involuntary movements, immobile, memory loss และ death',
                    'similar to other brain diseases',
                  ] },
                ] },
              { sub: 'Sites of prion replication และ brain regions affected by TSE',
                body: [
                  { bullets: [
                    '**Sites of prion replication** ในร่างกาย: brain, tonsils, muscles, spleen, appendix และ Peyer\'s patches',
                    '**Major regions of the human brain affected by TSE**: cerebrum, thalamus, spinal cord และ cerebellum',
                    '**CJD** → cerebrum, **vCJD** → thalamus และ cerebellum, **Kuru** → cerebellum, **GSS** → cerebellum และ spinal cord',
                  ] },
                ] },
              { sub: 'Diagnosis and treatment',
                body: [
                  { bullets: [
                    '**Histopathology** (neuronal vacuolation)',
                    '**Prion detection in CSF**',
                    '**Serology is not useful** (no antibodies)',
                    '**No treatment** for prion diseases',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    'โดยทั่วไป**ควบคุมได้ยาก** (generally difficult)',
                    '**avoid consumption** of potential contaminated food of animal origins',
                    '**Denaturation** of a rogue agent จนไม่สามารถ induce abnormal folding ของ normal proteins ได้อีก',
                    'แช่ (immerse) ใน **1N – 2N NaOH** หรือ **sodium hypochlorite** (2% available chlorine) for at least an hour',
                    'rinse in water; **autoclave at 121 °C for 1 hour**; clean; perform routine sterilization process',
                  ] },
                ] },
            ] },
          { sub: 'Creutzfeldt-Jakob disease (CJD)',
            body: [
              { sub: 'Classic CJD',
                body: [
                  { bullets: [
                    '**Classic CJD**: a form of brain damage ที่นำไปสู่การลดลงอย่างรวดเร็วของ mental function และ movement',
                    '**most common TSE in humans**',
                    '**not related to BSE** (mad cow disease)',
                    '**distinct from variant CJD** (the disease that is related to BSE)',
                    'recognized ในช่วง **early 1920s**',
                    'พบทั่วโลก (occurs worldwide): **1 – 2 cases per one million population per year**',
                    '**the risk increases with age**: **3 – 4 cases per million** ใน persons aged over **50 years old**',
                    'แบ่งเป็น **3 forms**',
                    '**Sporadic CJD** (spontaneous mutation): **85%** of cases',
                    '**Familial or inherited CJD**: **5 – 15%** of cases',
                    '**Iatrogenic CJD**: **less than 5%** of cases',
                    'average onset of symptoms ที่อายุ **late 50**',
                    '**Long incubation period** แต่ **extremely rapid progression**',
                    'death usually occurs ภายใน **1 year** of onset of illness',
                    'Brain shrinkage and deterioration occurs rapidly',
                    'Brain section แสดง **spongiform pathology** ที่เป็นลักษณะ (characteristic) ของ Creutzfeldt-Jakob',
                    '**FFI** — aggregates; **CJD** — lacunae',
                  ] },
                ] },
              { sub: 'variant CJD (vCJD)',
                body: [
                  { bullets: [
                    '**vCJD** หรือ **nvCJD** — first described ในปี **1996** ใน the United Kingdom',
                    'believed to be a **zoonotic disease**',
                    'mainly due to consumption of food contaminated by the **BSE agent**',
                    '**corneal transplants** or contaminated medical instruments',
                    'accounts for **less than 1%** of cases',
                    'different clinical and pathologic characteristics จาก classic CJD',
                    'tends to affect **younger people**',
                    '**median age at death** ของผู้ป่วย vCJD = **28 years** (compared to **68 years** for classic CJD)',
                    '**median duration of illness** ของ vCJD = **14 months** (compared to **5 months** for classic CJD)',
                    'mostly **less than 2 years** of incubation period',
                    '**6 – 24 months** duration of illness',
                  ] },
                  { table: {
                    headers: ['Characteristic', 'Classic CJD', 'Variant CJD'],
                    rows: [
                      ['Median age at death', '68 years', '28 years'],
                      ['Median duration of illness', '4 – 5 months', '13 – 14 months'],
                      ['Clinical signs and symptoms', 'Dementia; early neurological signs', 'Psychiatric/behavioral symptoms; delayed neurological signs'],
                      ['Periodic sharp waves on electroencephalogram', 'Often present', 'Often absent'],
                      ['Immunohistochemical analysis of brain tissue', 'Variable accumulation', 'Marked accumulation of protease-resistance prion protein'],
                      ['Presence of agent in lymphoid tissue', 'Not readily detected', 'Readily detected'],
                      ['Increased glycoform ratio on immunoblot analysis of protease-resistance prion protein', 'Not reported', 'Marked accumulation of protease-resistance prion protein'],
                    ],
                  } },
                ] },
            ] },
          { sub: 'Bovine spongiform encephalopathy (BSE)',
            body: [
              { sub: 'Overview',
                body: [
                  { bullets: [
                    '**BSE** = **mad cow disease**',
                    'a **progressive neurological disorder** of **cattle**',
                    'first reported ในปี **1986**',
                    'เป็นผลจากการให้ cattle กิน **bovine meat and bone meal** ที่มี BSE-infected products จาก spontaneously occurring case of BSE หรือ scrapie-infected sheep products',
                    'more than **184,500** confirmed cases of BSE in U.K.',
                    'an **association between vCJD and the outbreak of BSE**',
                  ] },
                ] },
              { sub: 'Transmission และ incubation period',
                body: [
                  { bullets: [
                    '**not contagious** and not transmitted by animal-to-animal contact',
                    'transmitted through the consumption of **BSE-contaminated meat and bone meal supplements** in cattle feed',
                    '**long incubation period** **4 – 5 years** (ranging from **2 – 8 years**)',
                    '**fatal** for cattle within **2 weeks to 6 months** after the onset of symptoms',
                  ] },
                ] },
              { sub: 'Clinical signs',
                body: [
                  { bullets: [
                    'causes **progressive degeneration of the nervous system**: a variety of symptoms ranging from **behavioral changes** to **coordination problems**',
                    '**changes in temperament** (e.g., nervous or aggressive)',
                    'abnormal posture',
                    'lack of coordination',
                    '**difficulty in standing and walking**',
                    '**loss of body weight**',
                    '**decreased milk production**',
                  ] },
                ] },
              { sub: 'Early stage, prion proteins และ diagnosis',
                body: [
                  { bullets: [
                    '**undetectable or unrecognizable symptoms** in the early stage of the disease',
                    'not all affected cattle display all signs of the disease',
                    '**prion proteins** are found in the brain, spinal cord, small intestine, blood, lymph nodes, spleen, and bone marrow',
                    '**no diagnostic methods or effective treatment measures** to cure mad cow disease',
                    '**multiple tiny holes** in brain tissues',
                  ] },
                ] },
              { sub: 'BSE ใน Washington state (U.S.)',
                body: [
                  { bullets: [
                    'USDA ระบุ cow 1 ตัวจาก **Washington state** ว่าเป็น **bovine spongiform encephalopathy (BSE)**',
                    '**How BSE infects cattle**: infectious prion protein เข้าสู่ร่างกายมากับ contaminated food และ attaches itself to normal proteins in the brain',
                    'BSE prion converts normal protein into a BSE prion → BSE prions multiply, convert more normal proteins → BSE prions reach critical amount; disease develops',
                    '**Infection develops**: BSE prion proteins start to develop in the brain **at least 6 months** before typical BSE symptoms occur; severe symptoms such as mad seizures begin **two to eight years** after infection',
                    '**Current prevention**: infected farm animals are destroyed; use of animal parts as a protein source in feeds has been **banned in the U.S. since 1997**',
                    '**Testing**: samples of brain or spinal-cord tissue from suspect cattle are collected at slaughterhouses and sent to labs for testing',
                    'first cow infected with BSE in the United States มาจาก dairy farm ใน **Mabton, Yakima County**',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    '**no vaccine available** for BSE',
                    'avoid feeding **rendered protein products** from ruminant animals to ruminants and other animals',
                    'can withstand high temperatures และไม่ถูกทำลายระหว่าง rendering procedures (do not get destroyed during the rendering procedures)',
                    'an infected animal may enter the **food chain** before the symptoms appear due to a long incubation period',
                    '**isolate and destroy** all infected animals',
                    '**a surveillance program** for BSE',
                    'avoid consumption of beef, especially **ground beef, sausage or hot dogs**',
                    '**no report** of BSE prions in milk or dairy products',
                    '**Specific Risk Materials (SRM)**: Brain, Spinal cord, Dorsal root ganglion, Eye balls (retinas), Trigeminal ganglion, Tonsil, Distal ileum',
                    '**BSE prion in peripheral tissues**: Hypoglossal nerve, Vagus nerve, Thoracic ganglia, Adrenal glands, Splanchnic nerve, Sympathetic nerve, Branchial plexus, Sciatic nerve',
                  ] },
                ] },
            ] },
          { sub: 'Scrapie',
            body: [
              { sub: 'Overview และการแพร่',
                body: [
                  { bullets: [
                    '**Scrapie** = **neurodegenerative disease** ที่เกิดใน **sheep** และพบได้บางครั้งใน **goats** (occasionally goats)',
                    'first recognized ในปี **1732**',
                    'พบทั่วโลก (worldwide) **except Australia and New Zealand**',
                    'infected animals carry the scrapie prion **for life** และ **transmit** the agent ได้แม้ remain asymptomatic',
                    'infection usually occurs either **at or soon after birth**',
                    'lick or ingest **fetal membranes and fluids** after birth',
                    'present in **milk and urine** และ persist in the environment for **years**',
                    'contact with the **placenta or nasal secretions** in **goats**',
                  ] },
                ] },
              { sub: 'Incubation period และ clinical signs',
                body: [
                  { bullets: [
                    '**2 – 5 years** of incubation period',
                    'rarely detected in sheep **less than 1 year old**',
                    '**behavioral changes** at the early stage of disease (stand apart from the flock, become **hyperexcitable**, and have a **high-stepping** or unusual hopping gait)',
                    'ataxia, incoordination, trembling, and convulsion',
                    '**intense pruritus** leading to rubbing, scraping or chewing',
                    'scratching of the **dorsum** or the **base of the tail**',
                    'blindness, weight loss or emaciation',
                  ] },
                ] },
              { sub: 'Goats, course และ pathology',
                body: [
                  { bullets: [
                    'variable clinical signs in **goats**',
                    'behavioral changes, weight loss, and **premature cessation of lactation**',
                    '**less common pruritus** in goats',
                    '**always fatal** once the symptoms appear',
                    'death usually occurs within **1 – 6 months** (average **2 – 6 weeks**) after the onset of symptoms',
                    '**neuronal vacuolation** and **non-inflammatory spongiform changes** in the grey matter of CNS',
                    '**no antibodies** against the scrapie agent',
                  ] },
                ] },
              { sub: 'Control and prevention',
                body: [
                  { bullets: [
                    '**highly resistant** ต่อ disinfectants, heat, UV, ionizing radiation และ formalin',
                    '**quarantine** and **destroy** infected animals',
                    'maintain a **closed flock** or minimize outside purchases of stock',
                    'fetal membranes and placenta should be removed quickly',
                    'bedding should be changed between parturitions',
                    '**separate** goats from sheep of unknown scrapie status',
                    '**no evidence** of scrapie transmission from sheep to human',
                  ] },
                ] },
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
    summary: 'Bacterial + Rickettsial infections — anthrax, brucellosis, strep, TB, salmonellosis, campylo, vibrio, colibacillosis, yersiniosis (foodborne), Chlamydial (psittacosis), Spirochaetal (leptospirosis, borreliosis).',
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
        heading: 'Biological weapons และรายโรค Anthrax ถึง Psittacosis',
        source: '1 - Bacterial_Zoonoses___2567.pdf p.4-118',
        body: [
          { sub: 'Taxonomic Hierarchy (cont.) — Ehrlichiosis, Scrub typhus, Psittacosis, Leptospirosis',
            body: [
              { table: {
                headers: ['Rank', 'Ehrlichiosis', 'Scrub typhus'],
                rows: [
                  ['Domain', 'Bacteria', 'Bacteria'],
                  ['Phylum', 'Proteobacteria', 'Proteobacteria'],
                  ['Class', 'Alphaproteobacteria', 'Alphaproteobacteria'],
                  ['Order', 'Rickettsiales', 'Rickettsiales'],
                  ['Family', 'Anaplasmataceae', 'Rickettsiaceae'],
                  ['Genus', '*Ehrlichia*', '*Orientia*'],
                  ['Species', '*E. chaffeensis*', '*O. tsutsugamushi*'],
                ],
              } },
              { table: {
                headers: ['Rank', 'Psittacosis', 'Leptospirosis'],
                rows: [
                  ['Domain', 'Bacteria', 'Bacteria'],
                  ['Phylum', 'Chlamydiae', 'Spirochaetes'],
                  ['Class', 'Chlamydiae', 'Spirochaetes'],
                  ['Order', 'Chlamydiales', 'Spirochaetales'],
                  ['Family', 'Chlamydiaceae', 'Leptospiraceae'],
                  ['Genus', '*Chlamydophila*', '*Leptospira*'],
                  ['Species', '*C. psittaci*', '*L. interrogans*'],
                ],
              } },
            ] },
          { sub: 'Biological weapons',
            body: [
              { sub: 'Important characteristics',
                body: [
                  { bullets: [
                    'ลักษณะสำคัญ: **invisibility & delayed effects**, **low technological requirement**, can be stored for a long time และ **low cost** of production',
                    'มี **high infectivity** and easy dissemination และ **highly lethal**',
                    'ก่อให้เกิด a large number of sickness and death, fear, panic, confusion, disruption of social and economic activity, etc.',
                  ] },
                ] },
              { sub: 'Biological warfare agents (partial lists)',
                body: [
                  { bullets: [
                    'ได้แก่ anthrax, botulinum toxins, brucellosis, cholera, *C. perfringens* toxins, diphtheria, ebola haemorrhagic fever, glanders, melioidosis, plague, Q fever, ricin, rift valley fever, saxitoxin, smallpox, staphylococcal enterotoxin B, tularemia, yellow fever',
                  ] },
                ] },
            ] },
          { sub: 'Anthrax',
            body: [
              { bullets: [
                '**Anthrax** เป็น an **acute infection of herbivores** และเป็น one of the first zoonoses described',
                'เชื้อ: *Bacillus anthracis* — **gram-positive**, **spore-forming**, rod shaped bacteria',
                '**Spores** capable of surviving in soil for **decades**',
                'เป็น **biological weapon**',
              ] },
              { sub: 'Occurrence',
                body: [
                  { bullets: [
                    'พบ **worldwide** (mainly found in **cattle, sheep, and goats**)',
                    'เป็น **an occupational disease**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Soil** เป็น main source of infection',
                    '**ในคน** ติดเชื้อ mainly via: direct contact with infected animals or their products (through injured skins or mucous membrane); ingestion of undercooked meat from infected animals; inhalation of anthrax spores',
                    '**ไม่มี evidence** ของ person-to-person transmission ของ anthrax',
                    '**ในสัตว์** ติดเชื้อ mainly via: ingestion of pasture or water contaminated with anthrax spores + inhalation of anthrax spores; **flies and mosquitoes**',
                    'วงจร: cattle, sheep, and goats ที่ติดเชื้อ *B. anthracis* → environmental contamination with secretions and excretions → ingestion of pasture or water contaminated with spores → cattle, sheep, and goats',
                    '**Man** ติดเชื้อ mainly by direct contact with infected animals or their products; ingestion of contaminated meat; inhalation of anthrax spores',
                    'Mode of transmission ในคนตามรูปแบบโรค: **cutaneous anthrax** — anthrax spores เข้าทาง open cut, can also be spread by biting insects; **inhaled anthrax** — anthrax spores in surrounding air; **gastrointestinal anthrax** — infected meat',
                  ] },
                ] },
              { sub: 'Disease in humans — cutaneous anthrax',
                body: [
                  { bullets: [
                    'Disease in humans มี **3 forms** ตาม route of infection',
                    '**Cutaneous anthrax**: most common (**95%** of anthrax cases), พบบ่อยที่ **hands and arms**',
                    'รอยโรค: pruritic papule → vesicle → pustule → ulcer → **black necrotic central eschar** with edema',
                    'โดยทั่วไป **not fatal**; **mortality rate about 20%**',
                  ] },
                ] },
              { sub: 'Disease in humans — gastrointestinal anthrax',
                body: [
                  { bullets: [
                    '**Gastrointestinal anthrax**: analogous to cutaneous anthrax แต่เกิดที่ **intestinal or oropharyngeal mucosa**',
                    'มี lesion ที่ base of the **tongue** (sore throat and dysphagia)',
                    'เกิด **acute inflammation of the intestinal tract** (nausea, loss of appetite, fever, abdominal pain, hematemesis and bloody diarrhea)',
                    '**Not common**; **high mortality rate (25% to 60%)**',
                  ] },
                ] },
              { sub: 'Disease in humans — pulmonary anthrax',
                body: [
                  { bullets: [
                    '**Pulmonary anthrax**: หายใจเอา spores เข้าไป (inhaled spores **1-5 microns**), germination (**1-60 days**)',
                    'เป็น **most lethal form** — extremely high mortality rate (**95%**)',
                    'อาการคล้าย **common cold** เช่น sore throat, fever, dry cough, chest pain, severe breathing problems and shock',
                  ] },
                ] },
              { sub: 'Disease in animals',
                body: [
                  { bullets: [
                    'รูปแบบโรคในสัตว์: **peracute** (ruminants), **acute** (horses), and **subacute to chronic** (swine, dogs, and cats)',
                    '**Sudden death** ของสัตว์',
                    '**Bloody discharge** จาก openings (e.g., anus, vulva, nostrils, mouth, and eyes)',
                    'Failure of blood to clot, lack of rigor mortis และ rapid bloating and decomposition',
                    '**High fever** (107 °F), mucosal congestion, depression, anorexia และ **septicemia**',
                    '**Edema of the tongue** และ edematous and swellings of the neck and regional lymph nodes, sternum, abdomen, prepuce, perineum and mammary gland',
                    'Dysphagia, dyspnea และ **severe enteritis**',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    'ถ้าสงสัย anthrax → **ไม่ควรทำ necropsy**',
                    'ใน herbivores: **sudden death** และ **unclotted blood** from the nose, mouth, anus or vulva',
                    'ใน swine และ carnivores: **localized edema of the neck area**',
                    'ในคน: **signs and symptoms**',
                    '**Isolation and identification** ของ causative agent (McFadyean\'s polychrome methylene blue or gram stain)',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    '**Antibiotics** มีประโยชน์ถ้าให้ prior to the onset or immediately after the onset of illness',
                    'ยา: **ciprofloxacin**, **doxycycline**, **penicillin**, **amoxicillin**',
                    'ยาเพิ่มเติม (additional antibiotics): rifampicin, vancomycin, chloramphenicol, clindamycin, or clarithromycin',
                    '**Treat for 60 days** เพราะมี risk of delayed germination of spores',
                    'ให้ **supportive treatment**',
                  ] },
                ] },
              { sub: 'Control and Prevention — in humans',
                body: [
                  { bullets: [
                    '**Control of the infection in animals**',
                    'หลีกเลี่ยง **contact with infected animals** and contaminated animal products; หลีกเลี่ยง **necropsy** of infected carcasses',
                    '**ล้างมือ** (wash hands) after working or handling suspected animals or animal products; ไม่กิน **undercooked meat**',
                    'ควบคุม **dust** ใน industries handling wool or hides',
                    'ล้างและฆ่าเชื้อ (**wash and disinfect**) wool or hair from endemic areas (10% formalin or 5% lye)',
                    'ฆ่าเชื้อ **contaminated surface** ด้วย 5% hypochlorite or 5% phenol',
                    'ใช้ **protective clothes and masks**; **vaccination and chemoprophylaxis**',
                  ] },
                ] },
              { sub: 'Control and Prevention — in animals',
                body: [
                  { bullets: [
                    '**Vaccination**',
                    '**Disposal of infected carcasses** ด้วย incineration or deep burial with a layer of quicklime (anhydrous calcium oxide) added before covering with dirt',
                    '**Treat surrounding soil** with 25% formalin; **prevention of livestock movement**; **sterilization of meat and bone meal**',
                    'สัตว์ที่รอดจาก naturally-acquired anthrax มีภูมิคุ้มกันต่อการติดเชื้อซ้ำ (**immune to reinfection**)',
                  ] },
                ] },
            ] },
          { sub: 'Melioidosis',
            body: [
              { sub: 'Etiology and Occurrence',
                body: [
                  { bullets: [
                    'ชื่ออื่น: **Whitmore\'s disease**, **pseudo-glanders**',
                    'เชื้อ: *Burkholderia pseudomallei* — **gram-negative** rods with **bipolar staining**',
                    'เป็น disease of **tropical climates**, especially in **Southeast Asia**',
                    'Infection occurs primarily during the **rainy season**',
                    'พบใน humans, horses, sheep, goats, swine, and cattle',
                    'เป็น **biological weapon**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    'เชื้อ **can survive in the environment** for quite a long time',
                    '**Direct contact** กับ contaminated soil and surface water especially through skin abrasion',
                    'ติดเชื้อจาก **ingestion** of food originated from infected animals and contaminated water และ **inhalation** of contaminated dust',
                    '**Human-to-human transmission** เกิดได้ (can occur) โดย contact with blood or body fluids of an infected person และ sexual transmission',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**Incubation period** อยู่ในช่วง **2 days to many years**',
                    'มี **a broad spectrum of clinical manifestations** (acute or chronic and localized or systemic)',
                    'รูปแบบหลัก (**major forms**) ของ melioidosis: acute, localized, suppurative **cutaneous infection** — single or multiple nodules and abscesses with regional lymphadenopathy',
                    '**Acute pulmonary infection** — mild bronchitis to severe pneumonia',
                    '**Acute septicemia** — may rapidly follow cutaneous or pulmonary infections; usually results in abscess formation throughout the body และ septic shock',
                    '**Subacute and chronic suppurative infection** — abscess formation in various organs',
                    '**อาการในม้า (horses)**, acute melioidosis: fever, sweating, anorexia, edematous mucous membranes and pulmonary edema',
                    '**อาการในม้า (horses)**, chronic melioidosis: nasal discharge, pulmonary abscesses, purulent inflammation of the respiratory tract, and necroses in the gastrointestinal tract',
                    '**อาการใน swine, sheep, and goats**: trembling gait, torticollis, nystagmus, salivation, mucosal discharge, cough, polyarthritis, paresis of the hind legs, and mastitis',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Isolation and identification** ของ etiologic agent จาก blood, urine, sputum, or skin lesions',
                    '**Detection of antibodies**: indirect hemagglutination (IHA), immunofluorescent assay (IFA), enzyme-linked immunosorbent assay (ELISA)',
                    '**Detection of antigens** ใน clinical samples: latex agglutination, polymerase chain reaction (PCR)',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'ยา: imipenem, meropenem, penicillin, ceftazidime, ceftriaxone, amoxicillin-clavulanic acid, and doxycycline',
                    'สูตรยา: **doxycycline** (100 mg twice a day) plus **chloramphenicol** (500 mg four times a day orally) for 30 days followed by **amoxicillin-clavulanic acid** (875/125 mg twice a day orally) for 2 to 5 months',
                    '**ในรายรุนแรง (severe cases)**: ceftazidime (2 g three times a day i.v.) or imipenem (0.5 to 1 g four times a day i.v.) for 2 to 4 weeks followed by **co-trimoxazole** (one tablet twice a day orally) for 6 months',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    'หลีกเลี่ยง **contact with soil and surface water** particularly persons with skin lesions',
                    'สวม **boots** ระหว่าง agricultural work',
                    '**ไม่มี vaccine**',
                    'ใช้ความระมัดระวังระหว่างทำ **necropsy** ของ infected animals',
                  ] },
                ] },
            ] },
          { sub: 'Glanders',
            body: [
              { bullets: [
                'เชื้อ: *Burkholderia mallei*',
                '**Primarily a disease of horses and donkeys**; other animals (sheep, goats, dogs, and cats)',
                '**Rarely occur in humans**',
                '**Not found in the environment**, existing only in infected animals',
                'ติดจาก **direct contact** with or **ingestion** of infected animals; mainly through **skin and mucosal surfaces of the eyes and nose**',
                'แหล่งเชื้อหลัก (**principal sources of the pathogen**): nasal secretions, ulcerating lesions, and mucus',
                'Veterinarians, horse caretakers, and laboratory workers',
                'เป็น **a potential agent** for biological warfare',
                '**อาการในคน** ขึ้นกับ route of infection',
                '**Localized, pus-forming cutaneous infections**: มี ulceration within 1 to 5 days และ swollen lymph nodes',
                '**Pulmonary infections**: pneumonia, pulmonary abscesses, etc.',
                '**Bloodstream infections**: high fever, myalgias และ death within 7 to 10 days',
                '**Chronic suppurative infections**: มี multiple abscesses ใน the muscles, joints, spleen, or liver',
                'เป็น **a chronic disease** ใน ungulates: nodules, ulcers, and scars ที่ skin และ mucous membranes of the respiratory tract',
                '**Isolation and identification** ของ agent จาก pustules, pus, nasal secretions, or sputum',
                'ยา: sulfonamides, ceftazidime, imipenem, tetracyclines, gentamicin, streptomycin, ciprofloxacin and novobiocin',
                '**Elimination** of the suspected or infected animals และ **dispose** of infected carcasses',
              ] },
            ] },
          { sub: 'Plague',
            body: [
              { sub: 'Etiology and Occurrence',
                body: [
                  { bullets: [
                    'ชื่ออื่น: **Black death**',
                    'เป็น one of the oldest, **most virulent**, and potentially lethal bacterial zoonoses',
                    'เชื้อ: *Yersinia pestis* (gram-negative rods)',
                    'เป็น **flea-borne disease** (rat flea: *Xenopsylla cheopis*)',
                    '**Natural foci** อยู่ใน Asia (Vietnam, Burma, China, and Mongolia), Africa and America',
                    'เป็น **a potential agent of bioterrorism**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Main reservoirs** คือ rodents such as rats, wild rodents, hamsters, ground squirrels, prairie dogs, etc.',
                    'การแพร่ **from rodents to rodents** และ **rodents to other animals** mainly by **infected fleas**',
                    'การแพร่จาก **rodents/animals to humans** by the **bites of infected fleas** (a source of **bubonic plague**) และ direct contact with infected tissues or fluids from handling sick or dead animals (occasionally)',
                    'การแพร่ **human to human** ผ่าน **respiratory droplets** (an important source of **pneumonic plague** in humans)',
                    '**Sylvatic cycle** (wild rodent กับ infective flea) และ **urban cycle** (domestic rodent กับ infective flea)',
                    '**Bubonic plague** may progress to **secondary plague pneumonia** → person to person → **pneumonic plague epidemic**',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    'ในคนมี **three clinical forms**',
                    '**Bubonic plague** — อาการ: fever, chills, headache, myalgias and malaise with a very painful lymphadenopathy (bubo) occurring mostly at inguinal lymph nodes',
                    '**Pneumonic plague** — อาการ: high fever, chills, headache, myalgias, malaise and pulmonary signs (i.e., cough, bloody or purulent sputum, chest pain and dyspnea)',
                    '**Septicemic plague** — อาการ: severe illness, bacteremia and endotoxemia, gastrointestinal symptoms (e.g., abdominal pain, diarrhea, nausea, vomiting), hypotension, tachycardia, disseminated intravascular coagulation, gangrene of the distal extremities, renal failure, shock and death',
                    'ใน wild rodents เกิด **hemorrhagic septicemia**',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Isolation and identification** ของ causative agent (*Y. pestis* is highly infectious)',
                    'Plague bacteria ใน blood smear: **safety pin appearance**',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'ยา: **streptomycin**, **gentamicin**, **tetracyclines** (e.g., doxycycline), or **chloramphenicol**',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**Rodent and flea control**: กำจัด food and shelter ของ rodents; ใช้ appropriate rodenticides and insecticides; treatment of pets (dogs and cats) for flea control',
                    '**Chemoprophylaxis** (pneumonic plague): doxycycline, co-trimoxazole, chloramphenicol, or ciprofloxacin',
                  ] },
                ] },
            ] },
          { sub: 'Tularemia',
            body: [
              { bullets: [
                'ชื่ออื่น: **rabbit fever**',
                'เชื้อ: *Francisella tularensis* (gram-negative coccobacilli)',
                'เกี่ยวข้องกับ **rodents, rabbits and hares**; **rabbit hunting and outdoor activities**',
                'การติดต่อ (transmission): **bitten by infected ticks**, deer flies, mosquitoes, or other insects',
                'การติดต่อ: **handling infected animal (rabbit) carcasses**; **eating or drinking contaminated food or water**; **inhaling dust** from contaminated soil',
                '**Human-to-human transmission** is uncommon',
                'อาการ: **ulcer**, **swollen lymph glands**, **high fever** (3 – 6 weeks if no antibiotic therapy), and **flu-like symptoms** (headache, muscle/joint pain)',
                'อาการ: **pneumonia**, chest pain, difficult breathing',
                'ยา: **doxycycline**, **ciprofloxacin**, **streptomycin** and **gentamicin**',
                '**Control and prevention**: ป้องกัน **insect bites**, i.e., wearing protective clothes or use insect repellants',
                '**Control and prevention**: ลด risk of contracting the bacteria through broken skin (cuts, scratches, open wounds, or abrasions); ปรุง food including rabbit meat ให้สุก **thoroughly**; หลีกเลี่ยงการดื่ม **untreated water**',
                'เป็น **biological weapon**',
              ] },
            ] },
          { sub: 'Brucellosis',
            body: [
              { bullets: [
                'ชื่ออื่น: **undulant fever**, **contagious abortion**, **infectious abortion**, **Bang\'s disease** (in cattle)',
                'เป็น **gram-negative** bacteria',
                '*Brucella* species ได้แก่ *B. abortus*, *B. melitensis*, *B. suis*, *B. canis* and *B. ovis*',
              ] },
              { sub: 'Occurrence',
                body: [
                  { bullets: [
                    'พบ **worldwide**',
                    'Sources of infection และ species/biovars ของ *Brucella* **vary with geographic areas**',
                    '**Prevalence of infection** ใน animal reservoirs provides a key to its occurrence in humans',
                    'เป็น **an occupational disease**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Natural reservoirs** ได้แก่ *B. abortus* (cattle), *B. melitensis* (goats and sheep), *B. suis* (swine), *B. canis* (dogs), *B. ovis* (sheep)',
                    '**ในคน** ติดเชื้อ mainly via: direct contact with secretions and tissues of infected animals; ingestion of raw milk and dairy products; inhalation of infectious aerosols or dust particles',
                    '**ในสัตว์** ติดเชื้อ mainly via: contact with urine, vaginal discharges and aborted fetuses from other infected animals; ingestion of contaminated pasture, feed, or water; sexual transmission (natural or artificial insemination)',
                    'Sources of *Brucella* infection และ mode of transmission สู่คน: cattle (*B. abortus*); goats and sheep (*B. melitensis*); **vaccination accident or laboratory accident with cultures**; swine (*B. suis*): slaughter or veterinary care; dogs (*B. canis*): veterinary care',
                    '**Bovine brucellosis** (*Brucella abortus*): bull → cow ผ่าน **artificial insemination**; cow ปล่อย fetuses, fetal membranes, vaginal secretions → **environmental contamination** → bull and cow ติดผ่าน ingestion, contact',
                    '**Bovine brucellosis** (*Brucella abortus*): คนติดจาก cow ผ่าน direct and indirect contact, ingestion of raw milk and fresh cheeses และจาก environmental contamination ผ่าน contact with fetuses, contaminated environment (pasture, forage, water)',
                    '**Caprine and ovine brucellosis** (*Brucella melitensis*): goats and sheep ปล่อย fetuses, fetal membranes, vaginal secretions → **environmental contamination** → goats and sheep ติดผ่าน ingestion',
                    '**Caprine and ovine brucellosis** (*Brucella melitensis*): คนติดจาก goats and sheep ผ่าน ingestion of raw milk and fresh cheeses; contact และจาก environmental contamination ผ่าน contact with fetuses, contaminated environment (pasture, forage, water)',
                    '**Swine brucellosis** (*Brucella suis*): boar ↔ sow; sow ปล่อย fetuses, fetal membranes, vaginal secretions → **environmental contamination** → boar ติดผ่าน ingestion, contact',
                    '**Swine brucellosis** (*Brucella suis*): คนติดจาก boar mainly by direct and indirect contact, rarely by ingestion of raw meat และจาก environmental contamination ผ่าน contact',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**ในคน**: *Brucella* spp. ที่ **most pathogenic** for humans คือ *B. melitensis* followed by *B. suis*, *B. abortus*, and *B. canis*',
                    '**Incubation period** is variable (1 – 3 weeks to several months)',
                    '**Duration of the disease** can vary from a few weeks (acute) or months (prolonged/undulant) to several years (chronic)',
                    '**Acute form**: อาการ flu-like (fever, sweats, headache, anorexia, myalgia and back pain)',
                    '**Undulant form**: recurrent fevers, arthritis และ orchiepididymitis (in males)',
                    '**Chronic form**: chronic fatigue และ arthritis',
                    '**ในสัตว์**: cross-infections',
                    '**Major symptoms** ในสัตว์: abortion, premature or full-term birth of dead or weak calves/piglets, infertility, orchitis, epididymitis and arthritis',
                    '**Incubation period** (ในสัตว์) is inversely proportional to fetal development: the more advanced the pregnancy, the shorter the incubation period',
                    '**Incubation period** (ในสัตว์) also varies according to such factors as the virulence and dose of bacteria, the route of infection, age and sex of the animal and the susceptibility of individual animal',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Isolation and identification** ของ causative agent',
                    '**Serology**: rose bengal test, serum agglutination test, etc.',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'ยา: **doxycycline plus rifampin** or **doxycycline plus streptomycin** or **co-trimoxazole plus gentamicin**',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**ในคน** (control and prevention of human brucellosis): กำจัด infection ใน animal reservoirs; ใช้ protective clothes; หลีกเลี่ยงการกิน unpasteurized milk, cheese, ice cream, or other dairy products',
                    '**ในสัตว์** (control and prevention of brucellosis in animals): กำจัด infected animals; control of animal transport; **vaccination** (*B. abortus* strain 19, *B. abortus* strain RB51, *B. melitensis* strain Rev.1)',
                  ] },
                ] },
            ] },
          { sub: 'Q fever',
            body: [
              { sub: 'Etiology and Occurrence',
                body: [
                  { bullets: [
                    'ชื่ออื่น: **query fever**, **abattoir fever**, **coxiellosis**',
                    'เชื้อ: *Coxiella burnetii* (gram-negative, obligate intracellular bacteria)',
                    'สร้าง **unusual spore-like structures**',
                    '**Highly resistant** to physical and chemical agents และ **easily spread by aerosols**',
                    'พบ **worldwide except New Zealand**',
                    'พบใน **ruminants** (sheep, goats, and cattle)',
                    'เป็น **an occupational disease**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    'เชื้อ **mainly shed in large quantities at parturition**',
                    'พบใน aborted fetus, placenta, reproductive discharges, urine, feces and milk',
                    '**ในคน**: inhalation of aerosolized organisms, direct contact with infected animals (during the delivery of newborn animals), ingestion of contaminated milk, or from tick bites',
                    '**ในสัตว์**: ingestion or direct contact with secretions from infected animals',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    'ส่วนใหญ่ไม่แสดงอาการ (**asymptomatic in most cases**)',
                    '**ในคน**: **flu-like symptoms** (high fever, severe headache, and myalgia); **pneumonia** or **hepatitis** (acute severe cases); **endocarditis** (chronic infection)',
                    '**ในสัตว์**: **reproduction problems** including abortion during late pregnancy, stillbirth, retained placenta, endometritis, infertility, or weak offspring',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Serology** หรือ **PCR** (isolation requires **biosafety level 3**)',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    '**Early treatment** ด้วย doxycycline, tetracycline, ofloxacin, or pefloxacin',
                    'ใน humans: **shorten the course of illness** และ **reduce the risk of complications**',
                    'ใน animals: **may not eliminate infections**',
                  ] },
                ] },
              { sub: 'Control and Prevention — in humans',
                body: [
                  { bullets: [
                    'หลีกเลี่ยง **contact with placenta, fetal membranes, or aborted fetuses**',
                    'สวม **gloves, mask, and eye protection** ขณะช่วย delivery of newborn animals',
                    'กินและดื่มเฉพาะ **pasteurized milk** and milk products',
                    '**Vaccine** ใน some countries (uncommon)',
                  ] },
                ] },
              { sub: 'Control and Prevention — in animals',
                body: [
                  { bullets: [
                    'แยก **pregnant livestock** ออกจาก other animals',
                    'กำจัด **placenta** and other remaining reproductive tissues after abortion อย่างเหมาะสม (properly dispose)',
                    'ทำความสะอาด **the areas where animals give birth** regularly',
                    '**Vaccine does not eliminate shedding** of the organism',
                  ] },
                ] },
            ] },
          { sub: 'Streptococcus suis infections',
            body: [
              { sub: 'Etiology and Occurrence',
                body: [
                  { bullets: [
                    'เป็น **gram-positive** bacteria, **serotype 2**',
                    'พบ **worldwide**',
                    '**Prevalent in all areas where swine are bred** especially ใน farms with high animal densities and poor ventilation',
                    'เป็น **an occupational disease**',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Natural reservoir** คือ swine (nasal cavities and tonsils)',
                    '**ในคน**: ingestion of raw pork; direct contact with infected pigs and pork via small skin blemishes or via conjunctiva',
                    '**ใน swine**: close contact or exposure to the pathogen in aerosol form and possibly through the digestive and reproductive routes',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**Meningitis, septicemia and permanent hearing loss** เป็น predominant symptoms ของ *S. suis* infection ใน humans',
                    '**Meningitis, arthritis, septicemia and pneumonia** เป็น predominant symptoms ของ *S. suis* infection ใน swine',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Isolation and identification** ของ causative agent',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'ยา: **penicillin G** (drug of choice)',
                    'ยา: **ampicillin** or **chloramphenicol** plus **aminoglycosides**',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**ในคน**: หลีกเลี่ยงการกิน **raw pork** และ pay attention when coming in contact with infected pigs and pork',
                    '**ใน swine**: **vaccination**; **good husbandry**; **prophylactic or strategic medication** (penicillin in feed or tiamulin in water)',
                  ] },
                ] },
            ] },
          { sub: 'Leptospirosis',
            body: [
              { bullets: [
                'ชื่ออื่น: **Weil\'s disease**, **mud fever**, **rice-field fever**, **hemorrhagic jaundice**, and **red water**',
                'เป็น **spirochaete**: genus *Leptospira*',
                '*L. biflexa* (free-living saprophyte, non-pathogenic)',
                '*L. interrogans* (zoonotic agent, pathogenic) มี more than **200 serovars**',
              ] },
              { sub: 'Occurrence',
                body: [
                  { bullets: [
                    'พบ **worldwide** particularly in **tropical regions**',
                    'เป็น **an occupational and recreational hazard**',
                    'ติดเชื้อใน **more than 180 animal species** particularly rodents, wild and domestic animals',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { table: {
                    headers: ['*L. interrogans* serovar', 'Main reservoir'],
                    rows: [
                      ['Bratislava, Pomona', 'Swine'],
                      ['Canicola', 'Dog'],
                      ['Hardjo', 'Cattle'],
                      ['Icterohaemorrhagiae, Grippotyphosa, Bataviae', 'Rodent'],
                    ],
                  } },
                  { bullets: [
                    'ติดเชื้อจาก **contact with urine** or environment contaminated with urine of infected animals',
                    'เชื้อเข้าทาง **skin abrasions** or **nasal, oral and conjunctival mucosa**',
                    'ติดเชื้อจาก **consumption of contaminated food**; **venereal transmission** ใน animals',
                    'Mode of transmission: infected animals (rodents, cattle, swine, dogs) → leptospiruria → **contamination of environment with urine containing leptospires** → susceptible animals (rodents, cattle, swine, dogs) ผ่าน skin and mucus',
                    'คนติดจาก **contamination of environment** ผ่าน skin and mucus',
                    'คนติดผ่าน **skin, oral, nasal, and conjunctival mucous membrane** (อีกเส้นทางหนึ่ง)',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**ในคน**: susceptible to a large number of serovars',
                    '**Incubation period** approximately 1 – 2 weeks',
                    'มี **two distinct clinical syndromes**: anicteric type (90%) และ icteric type (10%)',
                    'เป็น **a biphasic course**: acute leptospiremic phase, lasting 7 to 10 days; immune leptospiruric phase, lasting from a week to several months',
                    '**Acute leptospiremic phase** — อาการ: fever, chill, headache, malaise, myalgia (particularly in the calves), nausea, skin rashes, conjunctival suffusion (red eyes)',
                    '**Immune leptospiruric phase** — อาการ: jaundice, renal failure, meningitis, hemorrhage (lung, kidney, intestine)',
                    'รูปแบบรุนแรง (**severe form**) ของ leptospirosis คือ **Weil\'s disease** associated with serovar Icterohaemorrhagiae',
                    '**ในสัตว์**: range from asymptomatic to severe',
                    'เกิดเป็น **acute severe disease** (meningitis, hepatitis, nephritis, hemoglobinuria, hemorrhage) หรือ **chronic disease** (abortion, stillbirth, infertility)',
                    '**Not specific or pathognomonic**; ขึ้นกับ infecting serovar และ host',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Bacteriological examination**: isolation of leptospires จาก blood or urine samples ด้วย direct culture หรือ inoculation into young hamsters and guinea pigs',
                    '**Serological examination**: microscopic agglutination test (MAT), macroscopic plate test, etc.',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    '**ในคน** (human infections): penicillin G, ampicillin, amoxicillin, or doxycycline',
                    '**ในสัตว์** (animal infections): penicillin G, ampicillin, tetracycline, or dihydrostreptomycin',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**ในคน**: ใช้ protective clothes; หลีกเลี่ยง walking with bare feet and swimming in stagnant water',
                    '**ในคน**: **rodent control**; control of infection in domestic animals; **chemoprophylaxis** of high-risk occupational groups with doxycycline',
                    '**ในสัตว์**: **vaccination** of farm and pet animals with dominant local *Leptospira* strains; **chemotherapy** with dihydrostreptomycin; proper herd management',
                  ] },
                ] },
            ] },
          { sub: 'Lyme Disease',
            body: [
              { bullets: [
                'ชื่ออื่น: **lyme borreliosis**, **borreliosis**',
                'เชื้อ: *Borrelia burgdorferi* (spirochete)',
                'พบ **worldwide**',
                'เกี่ยวข้องกับ **hard ticks** (*Ixodes* spp.)',
                'เกี่ยวข้องกับ **wild rodents, hedgehogs, deer, etc.**',
                'อาการ: **fever, headache, fatigue** and a characteristic skin rash called **erythema migrans**',
                'เกี่ยวข้องกับ **joints, heart and nervous system**',
                '**Symptoms, physical findings** (e.g., rash), and the possibility of exposure to infected ticks',
                'ยา: **doxycycline**, **ceftriaxone**, **penicillin**, **amoxicillin** and **erythromycin**',
                '**Protection from tick bites**, i.e., สวม protective clothes and rubber boots หรือ chemoprophylaxis with penicillin or doxycycline',
              ] },
            ] },
          { sub: 'Zoonotic Tuberculosis',
            body: [
              { bullets: [
                'เป็น **a chronic disease** ใน humans and animals',
                'เป็น **gram-positive**, non-spore forming bacteria',
                '**Strictly aerobic** และ **slow growing**',
                'มี **a high lipid content** ใน cell wall; **highly tolerant to disinfectants** and other environmental factors',
                'แบ่งเป็น **3 major groups**',
                'กลุ่ม *M. tuberculosis* complex (MTBC): *M. tuberculosis* (human tuberculosis), *M. bovis* (bovine tuberculosis) and *M. africanum*',
                'กลุ่ม *M. avium* complex (MAC) such as *M. avium* spp. *avium* (MAA), *M. avium* spp. *hominis* (MAH), and *M. avium* spp. *paratuberculosis* (MAP: the causative agent of Johne\'s disease in cattle)',
                'กลุ่ม mycobacteria ที่ไม่ใช่สมาชิกของ *M. tuberculosis* complex และ *M. avium* complex',
                'ชั้นของ cell wall: **gram-positive** = CM (cytoplasmic membrane), PG (peptidoglycan); **gram-negative** = CM, PG, OM (outer membrane); **mycobacterial** = CM, PG, AG (arabinogalactan), MA (mycolic acids)',
              ] },
              { sub: 'Occurrence',
                body: [
                  { bullets: [
                    'พบ **worldwide**',
                    '**Low prevalence** ของ zoonotic tuberculosis (*M. bovis* infection) ใน countries where boil or pasteurization of milk has been implemented and where successful campaigns to control and eradicate the bovine infection have been carried out',
                    'เป็น **one of the most important causes of economic losses** ใน animal production as well as in public health practice',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Main reservoir** ของ *M. bovis* คือ cattle',
                    'การติดเชื้อในคน **depends on the animal sources**',
                    '**Human-to-human transmission** ของ zoonotic tuberculosis เป็น **rare**',
                    'คน can **retransmit the infection to cattle**',
                    '**ในคน** ติดเชื้อ mainly via: ingestion of raw milk and milk products; inhalation of the organisms',
                    '**ในสัตว์** infection depends on species; however, it is mainly via: inhalation of microorganisms; ingestion of contaminated feed',
                    '**Cattle**: transmission among cattle is mainly via **aerosols**',
                    '**Cattle**: **digestive tract** is an important route ใน calves; **more prevalent among dairy cattle** than among beef cattle',
                    '**Swine, sheep, goats and horses**: generally rare and sporadic',
                    '**Dogs and cats**: resistant to tuberculosis infection; *M. tuberculosis* ใน dogs และ *M. bovis* ใน cats',
                    '**Wild, captive, and domestic animals**: deer, badgers and opossums; natural reservoirs of *M. bovis*; act as sources of re-transmission of the infection to cattle',
                    'Mode of transmission: tuberculous bovine → dairy and beef cattle ผ่าน **airborne route** เป็นหลัก; **digestive route** (suckling calves)',
                    'Tuberculous bovine → swine, sheep, goats, horses, dogs, cats, wild animals ผ่าน **digestive route** เป็นหลัก; less frequently via airborne route',
                    'Tuberculous bovine → man: **digestive route**, mainly through raw milk and milk products; less frequently via airborne route',
                    'Man → bovines: occasionally reinfection of bovines via airborne route',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**ในคน**: long incubation period (4 to 6 weeks)',
                    'อาการ: subfebrile temperature, night sweats, cough (possibly hemoptysis), fatigue, and loss of appetite',
                    '**Pulmonary tuberculosis** is less frequent and is indistinguishable clinically and radiologically from the disease caused by *M. tuberculosis*',
                    '**Extrapulmonary tuberculosis** (pleura, genitourinary tract, skeletal system, meninges and peritoneum)',
                    '**ในคน** (cont.): miliary tuberculosis; tuberculous meningitis; tuberculous peritonitis; bone and joint tuberculosis (hip and knee joints)',
                    'พบ **less calcification** ใน pulmonary tuberculosis caused by *M. bovis* than that caused by *M. tuberculosis*',
                    '**ในสัตว์ (cattle)**: **pulmonary tuberculosis** is the most common clinical and pathological form',
                    'พบ **tubercles** ใน lungs, kidneys, livers, spleen and associated lymph nodes',
                    'อาการ: chronic bronchopneumonia, coughing, and reduced milk production',
                    '**Tuberculous peritonitis** (pearl disease), tuberculous metritis และ mastitis',
                    '**Swelling of retropharyngeal and mesenteric lymph nodes** (oral route)',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Clinical symptoms** เช่น chronic cough (> 14 days), subfebrile temperature, night sweats, anorexia and weight loss',
                    '**Isolation and identification** ของ causative agent: microscopy (Ziehl-Neelsen stain or acid fast bacilli stain); culture (Lowenstein-Jensen media); molecular methods, e.g., PCR',
                    '**Gross and microscopic pathologies**',
                    '**Antigen-antibody assays**: gamma-interferon assay (cell-mediated immunity); enzyme-linked immunosorbent assay or ELISA (humoral immunity)',
                    '**Skin or tuberculin test (Mantoux method) ในคน**: delayed-type hypersensitivity test; purified protein derivative (PPD) made from bovine strain',
                    'Intradermal injection ที่ forearm; อ่านผลหลัง 48 to 72 hours',
                    'Lesion of erythema, raised, and hard swelling with 10 mm or greater',
                    '**False positive** (lesser reactions) เนื่องจาก vaccination with BCG vaccine or prior exposure or infection with other *Mycobacterium* species',
                    '**False negative** ใน AIDS patients เนื่องจาก impaired CMI response',
                    '**Tuberculin test ในสัตว์**: approved method for bovine tuberculosis eradication program; purified protein derivative (PPD) made from bovine strain',
                    'ใน **cattle**: mid-neck or caudal fold of the tail; ใน **sheep and goats**: eyelid, inner thigh, or caudal fold; ใน **swine**: base of the ear with 2,000 IU of mammalian and avian tuberculin',
                    '**Unsatisfactory** สำหรับ horses, dogs, and cats',
                    '**False negative** ใน early stage of infection และใน severely infected animals',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'คล้ายกับการรักษา *M. tuberculosis* infection (human cases)',
                    'ใช้ **a combination of 4 antibiotics** including rifampin (10 mg/ kg/ day; max. 600 mg/ day), isoniazid (5 mg/ kg/ day; max. 300 mg/ day), pyrazinamide (not quite effective against *M. bovis*), ethambutol (15 to 25 mg/ kg/ day) or streptomycin',
                    'นาน **6 to 9 months**',
                    '**Increase of multidrug resistance** ใน *Mycobacterium* strains',
                    'กำจัด **tuberculin-positive animals** ออกจาก herd',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**ในคน**: control and eradication of bovine tuberculosis; consumption only pasteurized milk; vaccination with BCG (a live attenuated strain derived from *M. bovis*)',
                    '**ในสัตว์**: establishing a control and eradication program for bovine tuberculosis — administering tuberculin tests repeatedly until all infected animals are eliminated from the herd',
                  ] },
                ] },
            ] },
          { sub: 'Cat-Scratch Disease',
            body: [
              { sub: 'Etiology and Occurrence',
                body: [
                  { bullets: [
                    'เชื้อ: *Bartonella henselae* (most important agent)',
                    'เป็น **slightly curved**, **gram-negative** rods',
                    'เจริญ **only on media containing blood** ใน moist 5 – 10% CO2 atmosphere',
                    'มี **long incubation period** (9 to 40 days)',
                    'พบทั่วโลก (**worldwide distribution**)',
                    'พบ **only in humans** particularly in children, not in animals',
                  ] },
                ] },
              { sub: 'Source of Infection and Mode of Transmission',
                body: [
                  { bullets: [
                    '**Reservoir** ของ *B. henselae* คือ domestic cats particularly healthy young cats',
                    'เป็น **normal flora of the cat\'s mouth** และถูกถ่ายไปที่ claws เมื่อ grooming',
                    '**Cat fleas** (*Ctenocephalides felis*) are probably the main source ของ *B. henselae* transmission between cats',
                    'การแพร่จาก **cats to humans** ผ่าน a scratch และ less frequently ผ่าน a bite or licking',
                  ] },
                ] },
              { sub: 'Disease in humans and animals',
                body: [
                  { bullets: [
                    '**Incubation period** (1 – 2 weeks)',
                    'เกิด **regional lymphadenitis** particularly at axillary, cervical, or inguinal lymph nodes',
                    '**Affected lymph nodes** ยังคง **enlarged** นาน several weeks to months',
                    'มี **erythematous papule** ที่ portal of entry',
                    'อาการ: fever, chills, anorexia, convulsions, blindness due to optical neuritis, retinitis, choroiditis, endophthalmitis, granulomatous hepatitis, encephalopathy, or pneumonia',
                  ] },
                ] },
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**History of contact with animals**, particularly with cats and dogs (scratching, biting and licking)',
                    '**Symptoms and skin lesions** เช่น scratches with regional lymphadenopathy or lymphadenitis',
                    '**Positive culture** และ histological findings',
                  ] },
                ] },
              { sub: 'Treatment',
                body: [
                  { bullets: [
                    'Cat-scratch disease **generally self-limited**; ไม่ต้องใช้ **antimicrobial therapy**',
                    'ให้ **analgesics and antipyretics** ถ้าจำเป็น (if necessary)',
                    '**Azithromycin** (500 mg on the first day and 250 mg from days 2 to 5 orally) ใน immunocompromised people',
                  ] },
                ] },
              { sub: 'Control and Prevention',
                body: [
                  { bullets: [
                    '**Thoroughly clean** all cat scratches or bites ด้วย soap and water',
                    'ป้องกันไม่ให้ **cats contact open wounds**',
                    'หลีกเลี่ยง **contact with cats** especially kittens (immunocompromised individuals)',
                  ] },
                ] },
            ] },
          { sub: 'Psittacosis',
            body: [
              { bullets: [
                'ชื่ออื่น: **avian chlamydiosis**, **ornithosis**, **parrot fever**',
                'เชื้อ: *Chlamydophila psittaci* (gram-negative, obligate intracellular bacteria)',
                'พบ **worldwide** particularly in **tropical and subtropical regions**',
                'พบใน **parrots, parakeets, pigeons, ducks, and turkeys** (rarely in chickens)',
                '**Asymptomatic carriers** (the most important source of infection) และ **intermittently shed** particularly when stressed',
                'เกี่ยวข้องกับ **droppings and nasal discharges** of infected birds; **biting insects, mites and lice** as well as **fomites**',
                'การติดเชื้อใน **humans and animals** ผ่าน: inhalation of contaminated dust from feathers or dried infected droppings; direct contact with infected birds, excretions of infected animals, or contaminated fomites',
                '**Ingestion** of the bacteria while eating และ **person-to-person transmission** (aerosol or venereal spread)',
                '**Incubation period** ใน humans: 1 - 4 weeks (generally after 10 days)',
                '**Incubation period** ใน animals: 3 days to 2 - 3 weeks (years after infection in the case of latent infections)',
                '**ในคน**: mild flu-like infection with a fever, chills, headache, anorexia, dry cough, sore throat and photophobia',
                '**Pneumonia** and difficult breathing ใน some cases',
                '**Systemic illness** with renal complications, hepatitis, endocarditis, myocarditis, meningitis, encephalitis and myelitis ใน severe cases',
                '**ในสัตว์**: loss of appetite, weight loss, ruffled feathers, weakness, depression, yellowish or greenish diarrhea, difficult breathing, nasal discharge, sinusitis, unilateral or bilateral conjunctivitis, swelling of the tissues surrounding the eyes, and trembling',
                '**Isolation and identification** ของ organism (embryonated eggs, laboratory animals, or cell cultures)',
                '**False negative** เนื่องจาก intermittent shedding ใน carrier birds',
                '**Serology** (complement fixation, ELISA, and microimmunofluorescence tests)',
                '**Tetracyclines** combined with supportive care นาน 2 - 3 weeks',
                '**ไม่มี vaccine**',
                'หลีกเลี่ยง **contact with sick birds**; ใช้ **protective clothing** (gloves, face masks, eye protection and gowns) เมื่อทำความสะอาด bird housing areas or cages',
                'เลี้ยง birds ใน **clean environment** with good air flow, providing healthy nutrition, and avoiding stress or overcrowding',
                '**Quarantine new birds** ก่อน introducing them into the flock',
                'เป็น **a potential bioterrorism agent**',
                'เป็น **an occupational disease** (bird breeders, poultry workers, pet shop employees, veterinarians, etc.)',
              ] },
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
    summary: 'Rickettsia — gram-negative obligate intracellular parasite, Vector-borne (ticks, mites, fleas, lice, chiggers). 4 genera: Rickettsia, Ehrlichia, Orientia, Coxiella. Symptoms: fever, headache, rash + disseminate ไปหลายอวัยวะ.',
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
        heading: 'รายโรค Rickettsial — RMSF ถึง Q fever, dx และ control',
        source: '2 - Rickettsial_Zoonoses_.pdf p.4-49',
        body: [
          { sub: 'ภาพรวม Rickettsial zoonotic diseases',
            body: [
              { sub: 'Rickettsial Zoonotic Diseases — โรคแยกตาม genus',
                body: [
                  { bullets: [
                    '*Rickettsia* → **Spotted fever** (RMSF, Rickettsia pox, *Rickettsia felis*) และ **Typhus** (Epidemic typhus, Murine typhus)',
                    '*Orientia* → **Scrub typhus**',
                    '*Ehrlichia* → **Ehrlichiosis**',
                    '*Coxiella* → **Q fever**',
                  ] },
                ] },
              { sub: 'Genus: Rickettsia & Orientia',
                body: [
                  { bullets: [
                    '**Genus**: *Rickettsia* & *Orientia* (previously Rickettsiae)',
                    '**Gram negative**',
                    '**Obligate intracellular parasites** — intracellular of eukaryotic cells',
                    '**Transmit by**: ticks, mites (bite); lice, fleas (feces)',
                    'Pathogens entry through skin, spread in blood',
                    '*Rickettsia*: RMSF & other spotted fever, Rickettsial pox, Epidemic typhus, Murine typhus',
                    '*Orientia* (previously Rickettsiae): Scrub typhus',
                    '**Symptoms**: nausea, vomit, abdominal pain, encephalitis, respiratory problem, renal failure',
                  ] },
                ] },
            ] },
          { sub: 'Spotted fever group',
            body: [
              { sub: 'Rocky Mountain Spotted Fever (RMSF)',
                body: [
                  { bullets: [
                    '**Rocky Mountain Spotted Fever (RMSF)** — history of being hiking or camping',
                    'เชื้อ *Rickettsia rickettsii*',
                    '**Dog Tick disease**',
                    'Severe headache, vomiting, diarrhea, CNS',
                    '**Rare**',
                    '**USA**',
                  ] },
                ] },
              { sub: 'RMSF — วงจรของเห็บและอาการทางคลินิก',
                body: [
                  { bullets: [
                    '(1) adult females drop off host to lay eggs → (2) eggs hatch into larvae → (3) larvae feed on first host and may acquire *R. rickettsii*',
                    '(4) larvae molt into nymphs → (5) nymphs feed on second host and may acquire *R. rickettsii* → (6) nymphs molt into adults → (7) adults attach to third host for feeding and mating',
                    '*Dermacentor* (Dog tick, Wood tick)',
                    '**Centripetal rash** (from ankles/wrists to trunk)',
                    '**Rumpel-Leede phenomenon**: petechiae formation after blood pressure cuff inflation',
                    '**Clinical presentation**: tick bite, abrupt onset symptoms, fever, headache, myalgias (calf tenderness), rash (palms and soles)',
                    '**Antibiotics**: doxycycline, chloramphenicol',
                  ] },
                ] },
              { sub: 'Rickettsial pox',
                body: [
                  { bullets: [
                    'วงจรของ **Rickettsialpox**: **house mite** และ **house mouse (maintenance host)**',
                    'สาเหตุ *Rickettsia akari*',
                    '**Fever, rash, cutaneous necrosis**',
                    '**Transmit by mites (bites)**',
                    '**USA (NYC)** และ **Europe (Ukraine)**',
                    '**Papulovesicular lesions**',
                  ] },
                ] },
              { sub: '*Rickettsia felis*',
                body: [
                  { bullets: [
                    'Texas, USA, in 1991',
                    '*Ctenocephalides felis*',
                    '*R. felis* infection; human cases — **Asia: 12**, **Thailand: 3** (Sophie et al., 2014)',
                    '**Flea Spotted Fever**',
                    '**Clinical findings**: nonspecific, fever, headache, maculopapular rash, eschar',
                  ] },
                ] },
              { sub: '*Rickettsia felis* และประเทศไทย',
                body: [
                  { bullets: [
                    'Two Human Cases of *Rickettsia felis* Infection, Thailand (Emerg Infect Dis, 2014)',
                    'Cats as potential mammalian reservoirs for *Rickettsia* sp. genotype RF2125 in Bangkok, Thailand (Veterinary Parasitology: Regional Studies and Reports, 2018)',
                    '**SFG Rickettsiae** — Cats: **82/482 (17.01%)**; Fleas: **3/234 (1.28%)**',
                    'Skin lesions ของผู้ป่วย primary infection ด้วย *R. felis*: **ulcerative lesions** และ **vesicles**',
                  ] },
                ] },
            ] },
          { sub: 'Typhus group',
            body: [
              { sub: 'Epidemic typhus (ไข้รากสาดใหญ่ชนิดระบาด)',
                body: [
                  { bullets: [
                    'สาเหตุ *Rickettsia prowazekii*',
                    '**Louse-borne typhus**',
                    'Millions of deaths in previous centuries',
                    'World war',
                    '**Rare disease**',
                  ] },
                ] },
              { sub: 'Epidemic typhus — อาการ การแพร่ และการกระจาย',
                body: [
                  { bullets: [
                    'อาการ: **fever (>39 °C)**, rash, cutaneous necrosis',
                    'ผื่นที่พบ: rose spots-like skin lesion, diffuse petechial rash',
                    '**Transmit by body lice (bite)**',
                    'พบใน Central Africa; Asia; North, Central and South America',
                  ] },
                ] },
              { sub: 'Murine typhus (ไข้รากสาดใหญ่จากหนู)',
                body: [
                  { bullets: [
                    '**Fleas\' feces in skin and mucosa** — *Xenopsylla cheopis* (Rat flea) และ *Ctenocephalides felis* (Cat flea)',
                    'สาเหตุ *Rickettsia typhi*',
                    '**Transmit by fleas (feces)**',
                    'อาการ: **fever, headache, and rash**',
                    '**Associated with rat, cat, dog : fleas**',
                    'พบ **worldwide, port cities**; Thailand **1.7%** (Suputtamongkol, et al, 2009)',
                  ] },
                ] },
            ] },
          { sub: 'Scrub typhus',
            body: [
              { sub: 'Scrub typhus (ไข้รากสาดใหญ่)',
                body: [
                  { bullets: [
                    'สาเหตุ *Orientia (Rickettsia) tsutsugamushi*',
                    '**Transmit by chigger** (larva mites; bites)',
                    '**Symptoms** typically begin **7–14 days** after inoculation และ **incubation period: 6-20 day**',
                    'สัตว์ป่าในตระกูลสัตว์ฟันแทะ หนู กระแต กระจ้อน',
                    'วงจร (Epidemiology of scrub typhus): **free in soil stage** (8-legged deutonymph, 8-legged adult) → **transovarian transmission** → **6-legged larva** → **rodent** → 6-legged larva → กลับสู่ free in soil stage',
                    '6-legged larva หลัง transovarian transmission → คน',
                  ] },
                ] },
              { sub: 'Scrub typhus — อาการและการกระจาย',
                body: [
                  { bullets: [
                    'อาการ: **fever, headache, swollen lymph nodes, myalgia**',
                    '**GI or Res signs (cough)**',
                    'พบใน **South East Asia**',
                    '**Tsutsugamushi Triangle** — การกระจายของ scrub typhus (A review of the global epidemiology of scrub typhus, Guang Xu, 2017)',
                    '**Eschar** ที่ right anterior neck ของผู้ป่วยติดเชื้อ *Orientia tsutsugamushi* dual genotype, Vietnam (Nhiem Le-Viet, 2018)',
                  ] },
                ] },
              { sub: 'Scrub typhus in Thailand',
                body: [
                  { bullets: [
                    'From **2003–2018**; **103,345 cases** of scrub typhus (The estimated burden of scrub typhus in Thailand from national surveillance data (2003-2018), Wangrangsimakul)',
                  ] },
                ] },
              { sub: 'โรคสครับไทฟัส — ข้อมูลสำหรับประชาชน',
                body: [
                  { bullets: [
                    '**โรคสครับไทฟัส** หรือ **โรคไข้รากสาดใหญ่** เป็นโรคติดเชื้อแบคทีเรียชนิดหนึ่ง ที่เกิดจากการถูก**ไรอ่อน**ที่มีเชื้อกัด',
                    '**รอยกัดคล้ายรอยโดนบุหรี่จี้** — หากมีอาการแล้วปล่อยทิ้งไว้ **อาจเสียชีวิตได้**',
                    '**ตัวไรอ่อน** ขนาด **1 mm.** ตัวเล็กมาก แทบมองไม่เห็นด้วยตาเปล่า',
                    '**กลับมาแล้ว** ควรรีบอาบน้ำ สระผม ทำความสะอาดร่างกายทันที และนำเสื้อผ้าที่สวมใส่มาซักให้สะอาด เพราะอาจมีตัวไรอ่อนติดมากับเสื้อผ้า',
                  ] },
                ] },
            ] },
          { sub: 'Ehrlichiosis',
            body: [
              { sub: 'Genus: Ehrlichia',
                body: [
                  { bullets: [
                    '**Gram negative, obligate intracellular parasites**',
                    '**Cause ehrlichiosis**',
                    '*E. sennetsu*, *E. chaffeensis*, *E. phagocytophila*',
                    '**Tick (bites)**',
                    '**Resemble spotted fever (less rash)**, fever, musculoskeletal pain, enlarged liver, neurological, hematological dysfunction',
                  ] },
                ] },
              { sub: 'Human granulocytic ehrlichiosis',
                body: [
                  { bullets: [
                    '**USA (upper Midwest)**; **deer ticks**',
                    '1st **1994**',
                    '*E. phagocytophila* in **neutrophils**',
                  ] },
                ] },
              { sub: 'Human monocytic ehrlichiosis',
                body: [
                  { bullets: [
                    '**USA (southeastern, southcentral states)**; **deer ticks**',
                    '1st **1987**',
                    '*E. chaffeensis*',
                  ] },
                ] },
              { sub: 'วงจรของ ehrlichiosis ในเห็บ',
                body: [
                  { bullets: [
                    '**Infected vertebrate reservoir host** → **infected nymphs** → **infection established in susceptible reservoir or human host** → **infected adults** → **infection established in susceptible reservoir or human host** → **noninfected eggs** → **noninfected larvae** → กลับสู่ infected vertebrate reservoir host',
                  ] },
                ] },
            ] },
          { sub: 'Q fever',
            body: [
              { sub: 'Genus: Coxiella',
                body: [
                  { bullets: [
                    '**Gram negative, obligate intracellular parasites**',
                    '*C. burnetii* (**Q fever**)',
                    '**Q fever is an important zoonosis**',
                    '**Resistance to chemical and dehydration**',
                  ] },
                ] },
              { sub: 'Q fever — เชื้อ สัตว์ที่พบ และการแพร่',
                body: [
                  { bullets: [
                    'สาเหตุ *Coxiella burnetii*',
                    '**First; 1935 Australia**',
                    '**Worldwide**',
                    'Ruminants (sheep, goat), dog, cat, bird and reptile',
                    '**Transmission**: aerosol infection; dust; direct contact; ingestion',
                    '**Tick reservoirs** (spread among animals)',
                  ] },
                ] },
              { sub: 'Q fever — วงจรการแพร่ระหว่างสัตว์และสู่คน',
                body: [
                  { bullets: [
                    'ระหว่างสัตว์: **ticks: bite, feces** และ **predation**',
                    'สู่คน: **inhalation** และ **direct or indirect contact** กับ milk, urine and feces, amniotic fluid, placenta',
                    '**Infected milk** (non pasteurized milk) → **ingestion ?**',
                    '**2-3 weeks** → fever, pneumonia, endocarditis, hepatitis, neurological signs, osteomyelitis',
                  ] },
                ] },
              { sub: 'Q fever ในคน — acute และ chronic (R. Sahu et al. 2021)',
                body: [
                  { bullets: [
                    '**Inhalation of contaminated aerosols** → **Acute Q fever**',
                    'Acute Q fever: **60% cases** asymptomatic; **40% cases** symptomatic',
                    'Symptomatic: **(95-98) % cases** mild (undiagnosed); **(2-5) % cases** severe (hospitalized) — severe fever, pneumonia, hepatitis',
                    'On long run **1-5%** acute Q fever cases develops into **chronic Q fever**',
                    '**Predisposing factors**: immunosuppression, pregnancy, heart valve lesions, vascular abnormalities',
                    '**Chronic Q fever**: valve lesion (**2% cases**) — endocarditis (**30-60% within two years**)',
                    '**Chronic Q fever** อื่นๆ: chronic fatigue syndrome, osteomyelitis, chronic hepatitis, interstitial lung disease, repeated abortions',
                  ] },
                ] },
              { sub: 'Q fever — กลุ่มเสี่ยง อาการในคนและสัตว์',
                body: [
                  { bullets: [
                    '**Occupation risk**: veterinarians, laboratory workers, farmers',
                    '**Human**: febrile illness, pneumonia or chronic infection (endocarditis), liver disease',
                    '**Animal**: mild or asymptomatic; abortion & stillbirth',
                  ] },
                ] },
              { sub: 'Q fever & Thailand',
                body: [
                  { bullets: [
                    'The prevalence in asymptomatic persons varies from **0.4% to 2.6%**',
                    '**Domestic animals** — dogs: **28.1%** (Yupin Suputtamongkol et al, 2003)',
                    '**Ruminant**; 2012-2013 — positive: **76.63%- 79.31%** (Pattarin et al., 2018)',
                    'เก็บ **placenta samples** ระหว่างปี 2012 ถึง 2013 ในภาค **north-east** และ **north** ของ Thailand',
                  ] },
                ] },
              { sub: 'Q fever endocarditis ในประเทศไทย',
                body: [
                  { bullets: [
                    '**First two reported cases** of Q fever endocarditis in Thailand had **contact with cattle** (Infect. Dis. Rep. 2012)',
                    'Immunohistochemical localization of *C. burnetii* antigens predominantly within **macrophages**',
                  ] },
                ] },
            ] },
          { sub: 'Diagnosis และ control',
            body: [
              { sub: 'Diagnosis',
                body: [
                  { bullets: [
                    '**Clinical and laboratory**',
                    '**Parasite culture (viable host cell)**: cell culture; embryonated eggs; susceptible animals',
                    '**Serology** (acute/convalescent)',
                    '**Molecular assays (PCR)**',
                    'Use of **skin eschar swabs** for the diagnosis of tick-borne rickettsioses through **qPCR** analysis (Marion et al., 2014)',
                  ] },
                ] },
              { sub: 'Control',
                body: [
                  { bullets: [
                    '*Rickettsia* susceptible to **broad-spectrum ABO**: doxycycline, tetracycline, chloramphenicol',
                    '**Prevention of exposure**',
                    '**Vaccine** (Endemic typhus)',
                  ] },
                ] },
            ] },
          { sub: 'Conclusion และ take home messages',
            body: [
              { sub: 'Conclusion — Rickettsial Zoonotic Diseases',
                body: [
                  { callout: 'Rickettsial Zoonoses: **Vector borne diseases** — Rickettsia pox, Murine typhus, Human ehrlichiosis, Human granulocytic anaplasmosis, Scrub typhus, Japanese spotted fever, Rocky mountain spotted fever', kind: 'tip' },
                ] },
              { sub: 'Rickettsial Zoonoses ที่สำคัญ',
                body: [
                  { bullets: [
                    '**Important in the US**: Rocky Mountain spotted fever, Q fever, Murine typhus, Human monocytic ehrlichiosis, Human granulocytic ehrlichiosis, Rickettsial pox',
                    '**Important worldwide**: Q fever, Murine typhus, Scrub typhus, Epidemic typhus, Other spotted fever',
                  ] },
                ] },
              { sub: 'Take home messages',
                body: [
                  { callout: 'เชื้อริกเกตเซียที่สำคัญมีเชื้ออะไรบ้างและอธิบายดังนี้: ก่อโรคอะไร, การติดต่อแพร่กระจายของเชื้อเป็นอย่างไร, vector คืออะไร, สัตว์ที่สามารถติดและเป็นพาหะของโรค, อาการ คนและสัตว์, วิธีในการป้องกันและควบคุมโรคทั้งในคนและสัตว์ — และวิธีในการตรวจวินิจฉัย และรักษาโรคติดเชื้อริกเกตเซีย', kind: 'tip' },
                ] },
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
    summary: 'Wildlife = reservoirs of pathogens — A reservoir host harbors agent ของโรค แต่ไม่จำเป็นต้อง develop disease (ex. bats + Ebola/SARS). WWF "COVID-19 and the Rise of Zoonotic Infectious Diseases" → stop the next pandemic.',
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
        heading: 'Spillover, drivers, wildlife zoonoses และ prevention',
        source: '3 - Emerging_Zoonotic_Diseases_and_Wildlife_2024.pdf p.4-86',
        body: [
          { sub: 'Wildlife groups ที่เกี่ยวข้องกับ zoonotic diseases',
            body: [
              { bullets: [
                'กลุ่มสัตว์ป่าหลักที่เกี่ยวข้องกับ zoonotic diseases (special reservoir?): **Bats**, **Rodents**, **Primates**, **Birds**',
                '>10% ของ **rodent** species (244/2,220) เป็น zoonotic hosts (85 zoonotic diseases)',
                '**Primates** มี species น้อยกว่า แต่มีสัดส่วน zoonotic hosts สูงกว่า (77/365, 21%)',
                '**Bats** ทั้งที่มี species richness และ bad reputation แต่พบ zoonoses (25) น้อยกว่า rodents (85), primates (61), carnivores (83) และ ungulates (59) มาก',
              ] },
            ] },
          { sub: 'Spillover — cross-species transmission และกลไกที่ ecosystem boundary',
            body: [
              { sub: 'Cross-species transmission: Spillover',
                body: [
                  { bullets: [
                    'ความสามารถของ parasite ที่เมื่อเข้าสู่ individual ใน secondary host (HS) population แล้วจะทำ infectious cycle ของตัวเองให้ครบได้',
                    'ตัวอย่างใน virus: (1) Adsorption, penetration, and uncoating viral nucleic acid from capsid, (2) Transcription, translation, & replication, (3) Assembly and release',
                    '**Pathogenesis** ใน reservoir host (HR) และใน HS แทบไม่สอดคล้องกัน (bear little correspondence)',
                    '**CeHV-1 (herpesvirus B)**: ใน macaques (HR) ทำให้เกิด oral lesion แต่ใน humans (HS) ทำให้เกิด fatal meningoencephalitis',
                    'Pathologic components ของ intra-HR transmission: strategies to prevent human infection; หากขาดส่วนนี้ (Without this) จะเป็น anthropocentric disease-treatment/vaccine-preventive approach',
                    'เส้นทาง spillover จาก **Reservoir (Wildlife)** → Spillover 1 → Spillover 2 → คน; ตัวอย่าง: Rabies, SADS-CoV, Nipah virus, Ebolavirus, SARS-CoV, MERS-CoV, Hendra, SARS-CoV-2',
                  ] },
                ] },
              { sub: 'Vocabulary',
                body: [
                  { bullets: [
                    '**Spillover**: transmission of a pathogen จาก HR ไปยัง HS',
                    '**Pathogen**: infectious agent ที่มีศักยภาพก่อโรค (an infectious agent with the potential to cause disease)',
                    '**Zoonosis**: โรคที่เกิดจาก pathogen ซึ่งแพร่จากสัตว์สู่คน; แพร่ผ่าน direct contact กับสัตว์ที่ติดเชื้อ (domesticated or wild) หรือผ่านอาหารหรือน้ำที่ปนเปื้อน (contaminated food or water)',
                    '**Spillback**: transmission of a pathogen จาก human HSs ไปยัง other animal HSs',
                    '**Host**: organism ที่เป็น carrier ของ pathogen',
                    '**Vector**: organism ที่ transmit pathogen ไปยัง organisms อื่น',
                    '**Reservoir**: the place (or system) where a pathogen normally lives and reproduces',
                  ] },
                ] },
              { sub: 'ผลลัพธ์หลัง spillover event',
                body: [
                  { bullets: [
                    '**A) End host** (host clears the infection): host immune response (Antibody, T cell) → **Unsuccessful establishment**',
                    '**B) End host** (virulence of pathogen): host death → **Unsuccessful establishment**',
                    '**C) New host** (pathogen conserved): pathogen does not change → **Successful establishment**',
                    '**D) New host** (host-shift): pathogen changes → **Successful establishment**',
                  ] },
                ] },
              { sub: 'Mechanisms and theory of spillover',
                body: [
                  { bullets: [
                    'คำสำคัญของหัวข้อนี้: Bridge host, Ecosystem interior, Ecosystem boundary, Parasite, Permeability, Recipient host, Source host, Spillover',
                  ] },
                  { table: {
                    headers: ['Type of spillover', 'Spatial extent', 'Boundary permeability', 'Example systems'],
                    rows: [
                      ['direct', 'source, recipient', 'permeability determined by host contact rate. When source and recipient host species can enter the boundary but not the adjacent ecosystem interior, spillover can only happen in the boundary', 'pathogen transmission from domestic dogs to African wild dogs'],
                      ['environmental', 'source, parasite, recipient', 'permeability determined by parasite load, survival, and transport. When hosts are limited to their ecosystem interiors, environmental transmission can only occur through passive parasite transport. Increasing dilution with distance from shedding results in spillover risk being highest near the boundary', 'toxoplasma transmission from cats to otters via water runoff'],
                      ['vector-borne', 'source, bridge/vector, recipient', 'permeability determined by vector abundance, competence, biting rates, and by host abundance in the boundary. When bridge hosts are boundary-specific, spillover can only occur in/near the boundary', 'dengue virus transmission from forest-dwelling primates to edge and rural mammals incl. rodents'],
                      ['environmental + direct', 'source, parasite, bridge/vector, recipient', 'permeability determined by host contact rates, parasite shedding, parasite survival and transport. Spillover risk will be highest where the density of hosts is highest. This may be the case in/near boundaries, as this is where species living in different ecosystems are most likely to be present simultaneously', 'Nipah virus is carried by bat reservoir hosts, but spills over into pigs at the forest edge. Pigs act as bridge hosts, allowing for onward transmission to dogs and humans'],
                    ],
                  } },
                ] },
              { sub: 'Mechanisms important for driving spillover near ecosystem boundaries',
                body: [
                  { table: {
                    headers: ['Mechanism', 'State near boundaries', 'Effect on spillover near boundaries'],
                    rows: [
                      ['species richness', 'general expectation for species richness to be higher near boundaries, although there is also evidence for a negative effect', 'higher species diversity provides contact and spillover opportunities between a higher number of species combinations'],
                      ['population density', 'can be affected by boundary conditions, but whether positively or negatively is species-specific. Some species aggregate along boundaries when permeability is low', 'density effects on transmission and spillover will depend on the degree of density-dependence of the parasite. In many cases, higher density increases the transmission rate'],
                      ['perimeter-area ratio (PAR)', 'higher PAR will increase the influence of edge effects, and the potential area over which resources and organisms can flow between ecosystems', 'expected to correlate positively with spillover'],
                      ['patch size', 'larger patch size increases absolute boundary area, and can influence important host population characteristics incl. size and density', 'larger total boundary area increases the area over which spillover near boundaries can happen. Higher core population size and density can increase host movement, transmission rates'],
                      ['temporal variability in host/parasite presence and boundary conditions', 'environmental conditions near the boundary can vary more strongly, which can cause extensive variation in host and parasite presence and survival. Additionally, host movement across boundaries can vary strongly in a regular manner', 'variability in which, and when, hosts and parasites are present simultaneously, can result in a larger combination of different species contacting each other, thereby increasing spillover diversity. Effects on spillover rate are not clear'],
                      ['host traits', 'host traits resulting in broad environmental tolerance and generalist resource use are more conducive to movement near and across boundaries', 'hosts that are generalist resource consumers, and that move across multiple ecosystems, are more likely to encounter different parasites, as well different potential host species. This can make them more important drivers of spillover'],
                      ['parasite traits', 'low host specificity and broad environmental tolerance makes it more likely for parasites to occur in different ecosystems, including the boundary area', 'parasites infecting multiple host species, and/or those able to survive in a wider range of environmental conditions, are expected to be more prevalent in boundary areas, and to be more likely drivers of spillover'],
                      ['boundary permeability', 'determined by a range of mechanisms. Boundaries can be more or less permeable for organisms, which will determine their likelihood of being present in boundary areas and of crossing into the adjacent ecosystem. Highly species-specific', 'hosts and parasites for which a boundary has high permeability will be more important drivers of spillover. Boundaries between highly contrasting ecosystems (e.g. marine-terrestrial) may be more likely to have low permeability, and vice versa'],
                    ],
                  } },
                ] },
            ] },
          { sub: 'Ecology of zoonosis emergence และ modifying factors',
            body: [
              { sub: 'Ecology of zoonosis emergence — 4 transitional stages',
                body: [
                  { bullets: [
                    '**4 transitional stages** ของ ecology of zoonosis emergence',
                    '**2 prerequisite stages** (two essential for any emergence): 1. **Contact**, 2. **Spillover**',
                    '**2 stages required for pandemic emergence** (two non-essential but required for pandemic emergence): 3. **Sustained intra-HS transmission**, 4. **Genetic adaptation & phenotypic change + 3**',
                    'Examples of modifying factors ของ **Contact**: Species invasion/human introduction; HR, HS pop. density/HR species diversity; Type of utilization of HR or HS by the other; Multi-host arthropod vectors',
                    'Examples of modifying factors ของ **Cross-species transmission**: Quasi-species diversity/RNA genome; Conserved viral receptors among HR, HS; Disease pathogenesis/altered behavior; Health (nutritional, immune) of individual HS',
                    'Examples of modifying factors ของ **Sustained intra-HS transmission**: Pathogenesis/mode of virus excretion; Superspreaders; Aggregation of HR, HS, & vectors; Anthropogenic influences (urbanization; social interconnectivity, rapid transport)',
                    'Examples of modifying factors ของ **HS adaptation**: Pathogen mutation & replication rate; Frequency/type of recombination; Number of intra-HS generations increases R0',
                  ] },
                ] },
              { sub: 'Modifying factors in the emergence',
                body: [
                  { bullets: [
                    '**Modifying factors** ของ emergence มี 4 กลุ่ม: Abiotic factors, Evolutionary & intrinsic biotic factors, Extrinsic biotic interactions, **Anthropogenic influences**',
                    '**Anthropogenic influences** ได้แก่: Habitat modification, human encroachment, & modern agricultural practices; Novel niches provided by domestic animals; Human population demographics & urbanization; Modern transport; Modern medicine',
                  ] },
                ] },
              { sub: 'Examples of transitions and modifying factors: SARS CoV and HIVs',
                body: [
                  { table: {
                    headers: ['Transition', 'Initial context and circumstances', 'Examples of modifying factors'],
                    rows: [
                      ['Contact between HR or infectious propagules from HR and HS', '• Coronaviruses extant among sylvatic species of mammals and birds • Coronaviruses extant among commensal and domestic animals, and humans raising potential for coinfection or superinfection • SIVs circulate in at least 40 species of nonhuman primates in West Africa, most of which are used for human consumption. High potential for retrovirus transmission through contact with primate blood as indicated by infection of humans with primate foamy viruses', '• Wildlife consumed as culinary delicacies or medicinal purposes; national and international trade in wildlife • Increased connectivity between humans in remote sites to cities via public and commercial roads (logging, mining, etc.); increased availability of ground transportation • Rapid transportation of game animals to national and international markets • Concentration of diverse wildlife species, domestic animals and humans in wet markets • Exposure to animal blood and tissues during butchering by humans and during predation by animals'],
                      ['Cross-species transmission', '• SARS CoV infected several orders of mammals in wet markets of China • SIVs circulating in nonhuman primates are often mosaics of several SIV subtypes, indicating contact and recombination among nonhuman primate HRs', '• RNA genomes, most notably retroviruses, capable of high-frequency mutation and recombination. High intrahost genetic diversity provides wide range of genotypic/phenotypic viral variants for selection by HS during spillover • SARS CoV ability to infect multiple orders of mammals suggests evolution has of a viral \'generalist\' preadapted for species invasion • Close taxonomic relationship between HR and HS may facilitate viral adaptation once SIV has been introduced into individuals of HS • Contact with blood and other tissues containing high titers of virus ensured by use of HRs as food by human HS'],
                      ['Sustained intra-HS transmission', '• Once SARS CoV or HIV established within a human HS, access to urban setting with high density of susceptibles increases potential for average R0 > 1 • Respiratory transmission of SARS CoV • Long period of infectiousness without overt clinical disease contribute to high R0 with HIV', '• SARS CoV pathology in HS results in respiratory transmission by droplet or possibly aerosols • Superspreader phenomena • Increased number of intrahuman passages may have increased R0 of SARS CoV • Medical technology (reused nonsterile needles, blood transfusion, etc.) provides new routes of transmission for HIV'],
                      ['Sustained intra-HS transmission and adaptation to HS and global emergence', '• High degree of within individual diversity of HIV viral subtypes driven by immune pressure • Long period of infectiousness prior to clinical disease increase number of intrahuman passages of HIV • Infectiousness of SARS CoV coincides with clinical disease and peaks several days after disease onset', '• Rapid international transport of infected persons with SARS or HIV • Recombination may have produced novel SARS CoV adapted to humans • Poor surveillance and reporting in China slowed control measures • SARS controlled by traditional public health measures (quarantine, isolation of exposed persons, etc.) because infectiousness and disease coincident (pandemic averted) • Respiratory transmission aided SARS CoV spread • Sexual transmission and high R0 assured HIV global spread'],
                    ],
                  } },
                ] },
              { sub: 'Abiotic factors in emergence',
                body: [
                  { bullets: [
                    '**Climate change**: El Nino Southern Oscillation (ENSO) → a trophic cascade',
                    'Increased abundance ของ HR หรือ HV → risk ของ human exposure ต่อ zoonotic pathogen',
                    '**Environmental degradation**: Deforestation — displacement ของ HR, closer contact กับ HS',
                    '**Land use changes**: Soil health, water quality, altered ecosystem structure & functions',
                    '**Pollution & contaminations**: Industrial & community runoff, agricultural chemicals, & improper waste disposal contaminate water; Poor air quality weaken respiratory system',
                  ] },
                ] },
              { sub: 'Evolutionary & intrinsic biotic factors in emergence',
                body: [
                  { bullets: [
                    '**RNA viruses** มีแนวโน้มข้าม species barriers (prone to cross species barriers)',
                    'High replication rates, mutation rates, & increased potential for recombination or reassortment → adapt to new fitness landscape',
                    'ตัวอย่าง RNA viruses: HIV, influenza A',
                    '**Susceptibility** to infectious disease แตกต่างกันตาม genetics (genetically varies)',
                    '**Immunologic functions**: nutritional status & age',
                    '**Recombination (Shift)**: Strain 1 + Strain 2 → Dual infection → Virus replication and mixing → Hybrid new strain',
                    '**Accumulated mutations (Drift)**: Single infection → Virus replication → Virus + mutations',
                  ] },
                ] },
              { sub: 'Extrinsic biotic interactions in emergence',
                body: [
                  { bullets: [
                    'Natural หรือ human-assisted translocations ของ infected หรือ latently infected HR หรือ HV',
                    'ตัวอย่าง: African rodent exported to US & monkeypox outbreak, 2003',
                    'Presence ของ indigenous competent species ร่วมกับ introduced infected HV: WNV in US',
                    'Birds spread virus further through their traditional migratory pathways',
                    'Other interactions: host-vector, predator-prey, ecological community structure',
                    'Monkeypox virus: **Rodents** = the largest animal reservoirs',
                  ] },
                ] },
              { sub: 'Anthropogenic: habitat modification, human encroachment, & modern agricultural practices',
                body: [
                  { bullets: [
                    'Primary land clearings for cultivated fields & pastures',
                    'Commercial farming juxtaposing humans & livestock with native animal populations',
                    'Irrigated agricultural lands & dams provide habitat suitability for mosquitoes & waterbird HR',
                  ] },
                ] },
              { sub: 'Anthropogenic: land use-induced spillover',
                body: [
                  { bullets: [
                    'Land use change drives the **infect-shed-spill-spread cascade** (Plowright et al., 2021)',
                    '**Landscape immunity**: ecological condition ที่ลดความเสี่ยงของ pathogen spillover จาก HR',
                    '**Conservation & biosecurity priority**',
                    'Zoonoses spillover cascade: loss of landscape immunity as the pandemic trigger',
                    '**Infect**: wild animal (host) ติด zoonotic pathogen; สัดส่วนสัตว์ที่ติดเชื้อขึ้นกับ exposure และ susceptibility ของ hosts และกับ births ซึ่งนำ new susceptibles เข้ามา; environmental stressors อาจลด host resistance และเพิ่ม viral shedding',
                    'Infection dynamics ใน reservoir hosts: Susceptible, Exposed, Infected, Recovered',
                    '**Shed**: pathogens ออกจาก host และ infect susceptible hosts ได้โดยตรงผ่าน excretions หรือโดยอ้อม (เช่น ทาง blood)',
                    'จังหวะเวลาและปริมาณ shedding ขึ้นกับ host immune status — stressed hosts shed มากกว่า; บาง infected individuals อาจไม่ shed (latent) ขณะที่บางตัวเป็น super-shedders',
                    'hosts ส่วนใหญ่ติดหลาย pathogens ที่อาจ shed หรือไม่ shed พร้อมกัน (synchronously) ก็ได้',
                    '**Spill**: spillover คือ transmission ของ pathogen ระหว่าง animal species; zoonotic spillover คือ spillover สู่คน',
                    'Spillover ต้องให้ recipient host ได้รับ pathogen ในขนาดที่เพียงพอ (sufficient dose) โดยความเพียงพอขึ้นกับ susceptibility; สำหรับ zoonotic spillover virus ต้องเข้ากันได้กับ human tissue',
                    '**Spread**: ขึ้นกับ infectiousness ของ pathogen, host contact และ host susceptibility; ถ้าแต่ละคนโดยเฉลี่ยแพร่ให้มากกว่า 1 คน (R0 > 1) pathogen จะ spread',
                    'ถ้า infection ทำให้เสียชีวิตเร็ว (rapid mortality) virus อาจถูก extirpated; การเคลื่อนที่ของ infected hosts อาจเริ่ม outbreaks ใน populations ใหม่',
                    'Infection dynamics ในคนอยู่ภายใต้หลักการคล้ายกับ infection dynamics ใน wildlife reservoir hosts',
                  ] },
                ] },
              { sub: 'Anthropogenic: domestic animals provide a bounty of novel niches',
                body: [
                  { bullets: [
                    '**Pig** และ **horse** เป็น HI สำหรับ **henipaviruses**',
                    'Endemic cycles ของ **rabies** ใน domestic dogs',
                    '**Swine** เป็น **mammalian mixing vessel** สำหรับ **influenza A viruses** ของ domestic และ wild birds',
                  ] },
                ] },
              { sub: 'Anthropogenic: human population demographics & urbanization',
                body: [
                  { bullets: [
                    'Population growth, distribution & social structuring',
                    'Concentration ของ humans ใน urban environment',
                    '**Poor sanitation** และ environmental degradation ของ shanty towns รอบ urban core ส่งเสริม disease emergence (promote disease emergence)',
                    'Altered land use, ecosystem structure & interactions',
                    'ลำดับ: Decreased diversity → Increased dominance of urban exploiters/adapters → Increased inter- & intra-specific contact → Increased pathogen transmission → Increased risk of zoonotic transmission',
                    'Increased inter- & intra-specific contact และ increased pathogen transmission ยังนำไปสู่ **Decreased viability of rarer species due to conflict & disease** ซึ่งวนกลับเข้าสู่ขั้น decreased diversity → increased dominance of urban exploiters/adapters',
                  ] },
                ] },
            ] },
          { sub: 'Bacterial zoonoses จาก wildlife',
            body: [
              { sub: 'Plague',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Yersinia pestis*',
                    '**Reservoir**: Rodent and flea',
                    '**Transmission**: Flea bites, contact contaminated fluid/tissue, infectious droplets',
                    '**Symptoms**: Bubonic — painful lymph nodes; Septicemic — black skin & other tissue; Pneumonic — pneumonia',
                    '**Prevention**: Reduce rodent habitat, rodent food supplies; Wear protective gear when contacting animals; Use repellent when possible exposure to fleas; Keep fleas off pets; Don\'t allow free-roaming pets to sleep on your bed',
                    '**Plague ecology in the United States** (CDC): plague occurs naturally ใน western U.S. โดยเฉพาะ semi-arid grasslands และ scrub woodlands ของ southwestern states (Arizona, Colorado, New Mexico และ Utah); *Yersinia pestis* แพร่โดย fleas และวนอยู่ตามธรรมชาติใน wild rodents รวมถึง rock squirrels, ground squirrels, prairie dogs และ wood rats',
                    'บางครั้ง (occasionally) infection ใน rodents เพิ่มขึ้นอย่างมากจนเกิด outbreak หรือ **epizootic**; ระหว่าง plague epizootics หนูตายจำนวนมาก ทำให้ hungry fleas หาแหล่งเลือดอื่น (seek other sources of blood); studies suggest ว่า epizootics ใน southwestern U.S. มีแนวโน้มเกิดมากกว่า (more likely) ในช่วง cooler summers ที่ตามหลัง wet winters',
                    'คนและ domestic animals ที่ถูก fleas จากสัตว์ที่ตายแล้วกัด เสี่ยงติด plague โดยเฉพาะช่วง epizootic; **cats** มักป่วยหนัก (usually become very ill) และแพร่เชื้อสู่คนได้โดยตรงเมื่อไอ infectious droplets ออกมา; **dogs** ป่วยน้อยกว่า (less likely to be ill) แต่ยังนำ plague-infected fleas เข้าบ้านได้; นอกจาก flea bites คนยังได้รับเชื้อได้ขณะจับ skins หรือ flesh ของสัตว์ที่ติดเชื้อ',
                    'กรณี wildlife biologist ที่ทำงานใน Grand Canyon National Park เสียชีวิตจาก plague: Eric York (1970 – 2007), **pneumonic plague**',
                    'Collared mountain lion ตาย; เขาทำ postmortem exam เพื่อหาสาเหตุการตาย (to understand the cause of death)',
                    'ป่วยหลังทำ PME ไม่นาน (Became sick shortly after performing PME) และ CDC confirmed pneumonic plague as the cause of his death',
                  ] },
                ] },
              { sub: 'Brucellosis',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Brucella* spp.',
                    '**Source**: domestic animals, wild boar, caribou, elk, camel, bison',
                    '**Transmission**: ingestion of undercooked meat & dairy products, inhalation, contaminated skin wounds',
                    '**Symptoms**: recurrent fever, sweats, muscle pain, fatigue, endocarditis',
                    '**Prevention**: Avoid undercooked products; Prevent when handling animal tissue',
                  ] },
                  { callout: 'Inhaled or ingested infected fetal materials or abortions are the brucellosis transmission vectors', kind: 'tip' },
                  { bullets: [
                    'การแพร่ของ brucellosis จาก elk ไปยัง cattle และ bison ใน Greater Yellowstone Area: *Brucella abortus* transmission vector คือ elk and bison',
                    '**Natural conditions**: ingested/inhaled Brucellosis infected materials; Limited transmission to bison, even less to elk; Scavenger and predators remove infected material from landscape',
                    '**Unnatural conditions**: ingested/inhaled Brucellosis infected materials; Unnatural congregations increases infective material on the ground, exposing greater numbers',
                  ] },
                ] },
              { sub: 'Tuberculosis',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Mycobacterium tuberculosis* complex, *M. bovis*',
                    '**Source**: ungulates, non-human primates, carnivores',
                    'ตัวอย่าง source: White-tailed deer, mule deer, elk, bison, moose; Opossum, raccoon, coyote, grey fox, red fox, wolf, bear, bobcat; (captive) macaque, gibbon; Elephant?',
                    '**Transmission**: human-to-human; aerosol; Consumption of contaminated food & water',
                    'Oregon Zoo staff infected by tuberculosis after exposure to infected elephants',
                    'อาการของ TB ใน elephants: Chronic weight loss, Coughing, Diminished appetite, Chronic nasal discharge, Intolerance to exercise, Drinking abnormal quantities of water',
                    'เก็บตัวอย่างด้วย trunk wash sample (Taking trunk wash sample)',
                  ] },
                ] },
              { sub: 'Tularemia',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Francisella tularensis*',
                    'สัตว์ที่เกี่ยวข้อง: Rabbits, hares, & rodents',
                    '**Transmission**: Tick & deer fly bites; Skin contact with infected animals; Drinking contaminated water; Aerosol inhalation',
                    '**Types of clinical manifestation**: Ulceroglandular (most common); Glandular; Oculoglandular; Oropharyngeal; Pneumonic; Typhoidal',
                    'Life cycles ของ *Francisella tularensis* ในธรรมชาติ: **A** dominant in North America (Lagomorphs, Deer flies, Ticks); **B** dominant in Eurasia (Voles, Mosquitoes, Water / Soil)',
                  ] },
                ] },
              { sub: 'Leprosy',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Mycobacterium leprae*',
                    '**Reservoir**: Nine-banded armadillos',
                    '**Transmission**: Person to person; inhalation of nasal droplets; Skin contact; Rarely from contacting armadillo',
                    '**Symptoms**: Skin patches or nodules if untreated',
                    'Leprosy ถูกนำเข้ามายัง the Americas โดย European immigrants เมื่อกว่า 500 years ago แล้วถูกส่งต่อไปยัง armadillos ซึ่งเป็น the only known case of non-human infection',
                    'Researchers found same DNA sequence ของ leprosy bacteria ที่พบใน armadillo และใน man',
                    'Infected armadillos พบใน Texas, Louisiana, Mississippi, Arkansas and Alabama',
                    'การศึกษาเตือนให้ระวัง frequent handling ของ armadillos และการกินเนื้อของมัน (eating their meat); close monitoring ของการขยาย range ของ armadillo เข้าสู่ northern states ก็ถูกแนะนำด้วย',
                  ] },
                ] },
              { sub: 'Anthrax',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Bacillus anthracis*',
                    '**Affected animals**: mostly in large herbivores — Bison in North America; Black rhinos, African buffalo, African elephants, hippos, and multiple antelopes in Africa',
                    'Carnivores are more resistant but can die',
                    '**Transmission**: Contact infected carcass; Consumption; Inhalation',
                    '(1) *Bacillus anthracis* สร้าง **dormant spores** (not active) ที่อยู่ใน environment เช่น soil ได้นาน แม้นานเป็นสิบปี (even decades)',
                    '(2) เมื่อ spores เข้าสู่ร่างกายของสัตว์หรือคน (a place rich with waters, sugars and other nutrients) spores สามารถถูก \'activated\' ได้ (can be activated) และกลายเป็น **active growing cells**',
                    '(3) เมื่อ active แล้ว bacteria สามารถ (can) multiply, spread out in the body, produce toxins (poisons) และก่อ severe illness and death',
                  ] },
                ] },
              { sub: 'Rat-bite fever',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Streptobacillus moniliformis* (Streptobacillary rat-bite fever) & *Spirillum minus* (Spirillary rat-bite fever: sodoku)',
                    '**Reservoir**: black rats, brown rats, house mice, other pet rats, & squirrels',
                    'Guinea pigs, turkeys, koalas, & NHPs develop similar disease as in humans',
                    '**Transmission**: bitten by rodents, consume contaminated food or water',
                  ] },
                ] },
              { sub: 'Psittacosis and other zoonotic Chlamydia spp.',
                body: [
                  { bullets: [
                    '*Chlamydia psittaci* ทำให้เกิด psittacosis ในคน & avian chlamydiosis ในนก',
                    '**Reservoir**: psittacines (serovar A), pigeons (B), ducks and geese (C), turkey (D), and other birds',
                    '**Transmission**: inhalation – aerosolized particles of dried feces, urine, nasal discharge of infected birds',
                    '**Symptoms**: flu-like, ranging from mild to fatal',
                  ] },
                ] },
              { sub: 'Leptospirosis',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Leptospira* spp. (*L. interrogans* most common)',
                    '**Reservoir hosts**: bats, cattle, dogs, horses, marsupials, rodents, raccoons, pigs, sheep, etc.',
                    '**Transmission**: skin contact with water contaminated by animal urine; Contact with infected animals, blood & urine',
                    '**Risky environment**: Flood; Garbage accumulation; Poor drainage; Poor sanitation',
                    'Spirochetal bacteria hosted by a wide range of mammals; ยังพบใน birds, reptiles, amphibians, fishes',
                    '**60,000 deaths** each year',
                    '**Urbanization** is important risk factor: Climate change events; floods; Increasing poverty & marginalization; Destruction of wildlife habitat; Increasing contacts with rodents & pets',
                  ] },
                ] },
              { sub: 'Lyme disease',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: *Borrelia burgdorferi, B. afzelii* & *B. garinii*',
                    '**Reservoir**: Rodents (esp. white-footed mouse) and ticks; Deer supply great blood meal for tick but do not get infected or infect tick',
                    '**Transmission**: tick bites (nymphal or adult female *Ixodes* ticks)',
                    '**Symptoms**: Rash, fever, muscle and joint pain, cardiac problems',
                    'Tick and host lifecycle: Eggs → Larva 0.5 mm → Nymph 1.0 mm → Adult 2.5 mm; Larvae and nymphs feed on small mammals, lizards and birds; Nymphs and adults feed on humans; Adult ticks feed on medium to large animals',
                  ] },
                ] },
            ] },
          { sub: 'Rabies',
            body: [
              { sub: 'Rabies — reservoir, transmission, symptoms',
                body: [
                  { bullets: [
                    'เชื้อก่อโรค: **Rabies virus**',
                    '**Reservoir**: Domestic dogs; Bats, raccoon, coyote, red fox in US; Mongoose, civets, & genets in Africa',
                    '**Transmission**: bitten by infected animals',
                    '**Symptoms**: Neurological problems; Always fatal when developing symptoms',
                  ] },
                ] },
              { sub: 'Rabies spillover system in Latin America',
                body: [
                  { bullets: [
                    '**Spillover Transmission** ไปยัง **End Host (Pathogen Eliminated)**',
                    '**Spillover Transmission** ไปยัง **New Host (Pathogen Conserved)** ที่เกิด **Endemic Transmission**',
                    '**Spillover Transmission** ไปยัง **New Host (Pathogen Changed)** ที่เกิด **2nd Spillover Transmission**',
                  ] },
                ] },
              { sub: 'Rabies in Thailand — national program และ animal cases',
                body: [
                  { bullets: [
                    'แนวทางสู่ **rabies-free Thailand 2020**: End human rabies deaths by 2030, worldwide',
                    '**90% fewer case** since 1980s in Thailand',
                    'A **One Health** approach',
                    '**Dog vaccination**: 70% of all dogs; 80-100%, DLD',
                    '**PEP** for people who are exposed',
                    'Animal case 2014 – Aug 2020: Mainly in domestic dogs (3547 cases, 87%)',
                    'Sporadically in cats (4%), cattle (8%) and buffalo (1%); Goat, pig, horse, deer',
                    '**JACKAL** (7, 0.17%)',
                    'ข้อจำกัดของ animal rabies surveillance ที่ทำให้จำนวน wildlife rabies ถูก underestimated: **Simplicity of the system** and understanding of responsible officers',
                    '**Owner name**: Wild dog; Ownerless dog',
                    'Put species in family name',
                    '**Ability to identify animal species**: Dog vs jackal vs dhole; Fox is common among perceived name; Even by veterinarian',
                  ] },
                  { table: {
                    headers: ['Date', 'Province', 'District', 'Species', 'Level', 'Source'],
                    rows: [
                      ['10/07/18', 'Khon Kaen', 'Thung Song Hong', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['01/10/19', 'Roi Et', 'Phanom Phrai', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['15/10/19 (estimated date)', 'Roi Et', 'Phanom Phrai', 'Golden jackal', 'Suspected', 'DNP'],
                      ['24/02/20', 'Roi Et', 'Ard Samart', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['21/05/20', 'Nakhon Ratchasima', 'Muaeng Nakhon Ratchasima', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['10/07/20', 'Sa Kaeo', 'Ta Phraya', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['15/07/20', 'Sa Kaeo', 'Ta Phraya', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['15/07/20', 'Sa Kaeo', 'Ta Phraya', 'Golden jackal', 'Confirmed', 'DLD'],
                      ['--/08/20', 'Sa Kaeo', 'Ta Phraya', 'Golden jackal (3)', 'Non-verified (personal communication with assistant chief of the village, 16/9/20)', 'DNP'],
                    ],
                  } },
                ] },
              { sub: 'Rabies in golden jackal in Thailand (2018 – 2020)',
                body: [
                  { bullets: [
                    '**Golden jackal** (*Canis aureus*): rabies ใน Thailand ช่วง July 2018 – July 2020',
                    'สัดส่วน animal rabies สะสม 2014 – Aug 2020 ใน Khon Kaen: Dog 33 (81%), Cattle 6 (15%), Buffalo 1 (2%), Jackal 1 (2%)',
                    'Roi Et: Dog 209 (93%), Cattle 13 (6%), Jackal 2 (1%), Cat 1 (0%), Buffalo 1 (0%)',
                    'Nakhon Ratchasima: Dog 110 (86%), Cat 10 (8%), Cattle 4 (3%), Jackal 1 (1%), Buffalo 1 (1%), Pig 1 (1%)',
                    'Sakaeo: Dog 29 (88%), Jackal 3 (9%), Cattle 1 (3%)',
                    '**Khon Kaen, 2018 (JR1)**: Regarded as a \'breed\' of a dog; Running excitedly, furious; No information about human and animal contacts; No history and manner of death; พื้นที่: Rural, Agriculture',
                    '**Roi Et, 2019 (JR2 and 3)**: Reported as \'ownerless dog\'; Running excitedly, furious, retained jaws, chasing other dogs; 2 human contacts; Another suspected jackal case, app. 2 WK apart; 3 human + 4 dog contacts (+ another human); Near reserved forest; พื้นที่: Rural, Forest, Agriculture',
                    '**Roi Et, 2020 (JR4)**: The other side of the reserved forest where JR3&4 found, 5 months apart; 6 human and 14 dog contacts; พื้นที่: Rural, Forest, Agriculture',
                    '**Nakhon Ratchasima, 2020 (JR5)**: \'Dumb\' form; Found in a military base, notified to wildlife authority as a sick wildlife; CDV positive (test kit), coinfection with canine distemper virus; Human contacts were mostly military and wildlife officer; พื้นที่: Military land, Agriculture',
                    '**Sakaeo, 2020 (JR6, 7 and 8)**: A series of cases near a National Park within 3-5 days; 8 human contacts; พื้นที่: Rural, Forest, Agriculture',
                    '**Camera trap set-up**: Solid waste sites; Interconnection between agricultural land and forest; Backyard chicken pens',
                    '**Interview people for wildlife presence**: 106 people in 7 villages',
                    '**Most frequent**: mongoose, jackal',
                    '**Location**: cassava and watermelon',
                  ] },
                ] },
              { sub: 'Impacts of canine rabies',
                body: [
                  { bullets: [
                    '**Human cases**: 59 000 deaths yr⁻¹',
                    '**Potential human exposure to rabies virus**: 29 million people yr⁻¹ receive PEP; direct costs to health system: $1.7 billion yr⁻¹; patient-borne costs: $1.4 billion yr⁻¹',
                    '**Dog health and welfare**: rabies cases up to 1% of dogs yr⁻¹ in endemic areas; attitudes: hostility to dogs, culling',
                    '**Livestock production and rural livelihoods**: livestock losses: $512 million yr⁻¹',
                    '**Conservation threats**: extinction threat to endangered Ethiopian wolf and African wild dog populations',
                    '**Potential human exposure to canine rabies virus via wildlife**: demand for PEP',
                  ] },
                ] },
              { sub: 'Domestic and wildlife interface: rabies maintenance community',
                body: [
                  { bullets: [
                    '**What is a role of jackal in disease maintenance and spread?** Other wild carnivores?; Peri-urban species; Endangered species',
                    '**Where and what type of interface look like? How to intervene?**',
                    '**Manage disease in target population**: Medication; Vaccination — กรณี reservoir can be ignored',
                    '**Block transmission from reservoir**: Education; Land management; Water sanitation; Food inspection; Agricultural practices',
                    '**Manage pathogen within reservoir**: Ecosystem enhancement; Vaccination; Medication; Population',
                    'สองกลยุทธ์หลังนี้ require correctly identified reservoir and roles of each host',
                  ] },
                ] },
              { sub: 'Rabies and urbanization',
                body: [
                  { bullets: [
                    '54% ของ world population reside in cities',
                    '**Population displacement**: Bring pets and wildlife to cities; Travelers (expose rate 0.4 per 1000 for every month spend abroad)',
                    '**Illegal import, migration, translocation**: Garbage trucks transport raccoon',
                  ] },
                ] },
              { sub: 'Rabies and garbage accumulation',
                body: [
                  { bullets: [
                    'Urban people generate 2-3 times amount of waste as rural people',
                    'ใน Asia, 85% ของ generated garbage อยู่ที่ dumping sites; 97% in Africa; 25% in Europe',
                    'Habitat for, not only stray dogs, but other disease vectors: Provide food, shelter, breeding sites',
                    'สัตว์อื่น (นอกจาก stray dogs) ที่ใช้ garbage เป็น habitat: Raccoon, coyote, bear in US; Cattle, NHP, elephant, wild boar; Rodents, house flies & mosquitoes',
                  ] },
                ] },
              { sub: 'Effects of Food Waste',
                body: [
                  { bullets: [
                    '**Direct effects**: Quantity of food and nutrients; Abundance of animals; Social structure; Habitat use',
                    '**Indirect effects**: Human-wildlife conflict; Disease transmission between domestic animal - wildlife; Livestock damage',
                  ] },
                ] },
            ] },
          { sub: 'Viral zoonoses อื่น ๆ จาก wildlife',
            body: [
              { sub: 'Ebola virus',
                body: [
                  { bullets: [
                    'Filoviridae, RNA',
                    'Zaire, Sudan, Tai forest, Bundibugyo, Reston',
                    '**CFR 30-60%**',
                    '**New Bombali ebolavirus** ใน bats (Sierra Leone, Kenya), **Mengla virus** ใน fruit bat (China)',
                    'Forest degradation & fragmentation',
                    'Drivers ของ Ebola (Mwangi et al., 2016): **Environmental Drivers** — Environmental health, Deforestation; **Animal Drivers** — Primary wildlife reservoir, Spillover species, Animal recipient; **Human Health Drivers** — Healthy individual, Bush meat, Transmission, Disease, Burial practices, Global dissemination, Health care worker risk',
                  ] },
                ] },
              { sub: 'Hantaviruses',
                body: [
                  { bullets: [
                    '**Family Bunyaviridae**: Puumala, Dobrava-Belgrade, Saaremaa, Tula, & Seoul hantaviruses',
                    '**Hantavirus pulmonary syndrome (HPS)** ใน Americas & **hemorrhagic fever with renal syndrome (HFRS)** ใน Asia',
                    '**Reservoir**: rodents — Bank vole, yellow-necked field mouse, striped field mouse, Black sea field mouse, black rat, brown rat',
                    'Bunyaviridae, RNA; **HFRS** (Asia) & **Hantavirus cardiopulmonary syndrome (HCPS)** (America)',
                    '**28 hantaviruses** hosted by rodents, insectivores & bats',
                    '**Human – rodent interactions**: Climatic, land use, vegetation indice, soil, human distribution are key factors',
                    '**Occupational risk**: forest workers, pet rat owners, lab personnel, hunters',
                    'เชื้อ hantavirus ถูกสูดหายใจเข้าไปและทำลายปอด (Hantaviren werden eingeatmet und schädigen die Lunge)',
                    'เชื้อ hantavirus ถูกกระจายออกมากับอุจจาระ (Hantaviren werden durch den Kot verteilt)',
                  ] },
                  { table: {
                    headers: ['Virus', 'Reservoir', 'Disease'],
                    rows: [
                      ['Hantaan virus', '*Apodemus agrarius*', 'HFRS'],
                      ['Dobrava virus', '*Apodemus flavicollis*', 'HFRS'],
                      ['Seoul virus', '*Rattus norvegicus*', 'HFRS'],
                      ['Saaremaa virus', '*Apodemus agrarius*', 'HFRS'],
                      ['Amur virus', '*Apodemus peninsulae*', 'HFRS'],
                      ['Puumala virus', '*Myodes glareolus*', 'HFRS'],
                      ['Sin Nombre virus', '*Peromyscus maniculatus*', 'HCPS'],
                      ['New York-1 virus', '*Peromyscus leucopus*', 'HCPS'],
                      ['Monongahela virus', '*Peromyscus leucopus*', 'HCPS'],
                      ['Bayou virus', '*Oryzomys palustris*', 'HCPS'],
                      ['Black Creek Canal virus', '*Sigmodon hispidus*', 'HCPS'],
                      ['Andes virus', '*Oligoryzomys longicaudatus*', 'HCPS'],
                      ['Laguna Negra virus', '*Calomys laucha*', 'HCPS'],
                      ['Araraquara virus', '*Bolomys lasiurus*', 'HCPS'],
                      ['Choclo virus', '*Oligoryzomys fulvescens*', 'HCPS'],
                      ['Juquitiba virus', '*Oligoryzomys nigripes*', 'HCPS'],
                      ['Castelo dos Sonhos', '*Oligoryzomys utiaritensis*', 'HCPS'],
                      ['Bermejo virus', '*Oligoryzomys chacoensis*', 'HCPS'],
                      ['Lechiguanas virus', '*Oligoryzomys flavescens*', 'HCPS'],
                    ],
                  } },
                  { bullets: [
                    'HFRS = hemorrhagic fever with renal syndrome; HCPS = hantavirus cardiopulmonary syndrome',
                  ] },
                ] },
              { sub: 'Henipaviruses',
                body: [
                  { bullets: [
                    '**Family Paramyxoviridae**: Nipah virus, Hendravirus; Langya virus',
                    '**Reservoir**: Fruit bats (Hendra and nipah viruses); Shrews (Langya virus)',
                    '**Transmission**: Contact with animal and bodily fluids; Human infected from contact with pigs and horses or with drinking contaminated juice or fruits',
                    '**Symptoms**: neurological and respiratory failure',
                    'Nipah virus transmission: Fruit Bat (Blood, Urine, Saliva) → Pig, Contaminated Fruit, Date Palm Sap; Contaminated Fruit → Pig และ Human; Date Palm Sap → Human; Pig → Human; Outbreak Pig > Pig; Outbreak Human > Human; **Human: 40-75% Mortality**',
                  ] },
                ] },
              { sub: 'Hendravirus',
                body: [
                  { bullets: [
                    'Paramyxoviridae, RNA; **Genus Henipavirus**',
                    '**Severe infection in horse**, experimental infection in cats & guinea pigs',
                    '**Severe encephalitis and respiratory distress** in humans',
                    'Fruit bats in genus *Pteropus* are **main reservoir**: *P. alecto, P. poliocephalus, P. scapulatus, P. conspicillatus*',
                    'Expansion of human populations into wildlife habitats',
                    'Transmission: Fruit bats to horse transmission; Horse to horse transmission; Horse to human transmission (Khusro et al., 2020)',
                  ] },
                ] },
              { sub: 'Nipah virus',
                body: [
                  { bullets: [
                    'Paramyxoviridae, RNA',
                    '*Pteropus* spp. are **main reservoir**',
                    '**Factors**: Human density — Kerala (Bangladesh) & south Indian states: High rate of interaction; Co-exist with farm animals',
                    '**Factors**: Deforestation; Reservoir distribution; Socio-economic factors — Income; Poor health care facilities',
                    'Date palm sap to human transmission; Bats to pigs transmission; Pigs to human transmission; Man to man transmission (Singh et al., 2018)',
                    'Pigs- Intermediate as well as amplifying host; Consumption of NiV infected pork; Pork meat exported to other parts of the world',
                  ] },
                ] },
              { sub: 'New Langya virus emerged in China, 2018',
                body: [
                  { bullets: [
                    'Novel Zoonotic Langya Virus (LayV) is suspected to have caused Febrile Illness in 35 people in China\'s Shandong and Henan provinces',
                    '**Origin**: Henipavirus; Hendra Virus — first reported in Queensland in 1994, causing the deaths of 14 horses; Nipah Virus — outbreaks frequently reported in Bangladesh',
                    '**Transmission**: Direct contact; Natural Reservoir: Shrew; Intermediate Animal',
                    '**Symptoms**: Fever, Headache, Fatigue, Cough, Nausea, Leukopenia, Liver & Renal Dysfunction',
                    '**Recommendations**: Active Surveillance; Early detection & Treatment; Contact Tracing; Safety regulations; Adequate Sanitation Measures; Rapid outbreak response; Raising Awareness; Research with higher sample size to rule out human-to-human transmission',
                  ] },
                ] },
              { sub: 'Coronaviruses',
                body: [
                  { bullets: [
                    'Coronaviridae, RNA',
                    'ชนิด coronavirus ที่พบตาม host: Avian: gamma; Pig: alpha, beta, delta; Dog: alpha, beta; Cat: alpha; Cattle: beta; horse: beta; Human: alpha, beta',
                    '**Factors of transmission and spread**: Wet markets; Globalization; Demographic change',
                    'SARS-CoV-2 infection ใน domestic และ wild animals — **Naturally infected**: cat, dog, ferret, lion, tiger, snow leopard, puma, fishing cat, lynx, coati, binturong, mink, white tailed deer, hippo',
                    '**Experimentally infected**: hamster, mouse, primates, ferret, cat, treeshrew',
                  ] },
                ] },
              { sub: 'Coronaviruses in human',
                body: [
                  { bullets: [
                    'Realm: Riboviria → Order: Nidovirales → Suborder: Cornidovirineae → Family: Coronaviridae → Subfamily: Orthocoronavirinae และ Letovirinae (Letovirinae → Alpha letovirus)',
                    'Delta-coronavirus และ Gamma-coronavirus: both genera infect birds, marine, and mammals',
                  ] },
                  { table: {
                    headers: ['Genus', 'Subgenus → Species (human coronavirus)'],
                    rows: [
                      ['Alpha-coronavirus', 'Duvinacovirus → hCoV-229E; Setracovirus → NL63'],
                      ['Beta-coronavirus', 'Embecovirus → hCoV-HKU1, hCoV-OC43; Sarbecovirus → SARS-CoV, SARS-CoV-2; Merbecovirus → MERS-CoV'],
                    ],
                  } },
                ] },
              { sub: 'Emerging coronaviruses by primary host',
                body: [
                  '**Primary host: Human**',
                  { table: {
                    headers: ['Emerging coronavirus (or new virulent strain)', 'Year and location of first reported cases', 'Intermediate spillover host or host of viral predecessor', 'Potential reservoir host', 'Environment associated with emergence'],
                    rows: [
                      ['SARS-CoV-1', '2002 Guangdong, China', 'Masked palm civet (*Paguma larvata*)', 'Bat (*Rhinolophus* spp.)', 'Wet market'],
                      ['MERS-CoV', '2012 Saudi Arabia', 'Dromedary camel (*Camelus dromedarius*)', 'Bat (*Taphozous perforatus*, *Rhinopoma hardwickii* and *Pipistrellus kuhlii*)', 'Camel farm and market'],
                      ['SARS-CoV-2', '2019 Wuhan, China', 'Malayan pangolin (*Manis javanica*)?', 'Bat (*Rhinolophus* spp.)', 'Wildlife trade and/or wet market?'],
                    ],
                  } },
                  '**Primary host: Pig**',
                  { table: {
                    headers: ['Emerging coronavirus (or new virulent strain)', 'Year and location of first reported cases', 'Intermediate spillover host or host of viral predecessor', 'Potential reservoir host', 'Environment associated with emergence'],
                    rows: [
                      ['Porcine epidemic diarrhea virus (PEDV)', '1978 Belgium', 'Unknown', 'Bat (*Scotophilus kuhlii*)', 'Swine farm'],
                      ['*New virulent PEDV strain*', '2010 Southern China', 'Unknown', 'Bat (*Scotophilus kuhlii*)', 'Swine farm'],
                      ['Porcine deltacoronavirus (PDCoV)', '2009 Hong Kong', 'Asian leopard cat (*Prionailurus bengalensis*)?; Ferret badger (*Melogale moschata*)?', 'Avian, sparrow and bulbul', 'Illegal live-animal market?'],
                      ['Swine acute diarrhea syndrome coronavirus (SADS-CoV)', '2016 Guangdong, China', 'Unknown', 'Bat (*Rhinolophus* spp.)', 'Swine farm'],
                    ],
                  } },
                  '**Primary host: Dog**',
                  { table: {
                    headers: ['Emerging coronavirus (or new virulent strain)', 'Year and location of first reported cases', 'Intermediate spillover host or host of viral predecessor', 'Potential reservoir host', 'Environment associated with emergence'],
                    rows: [
                      ['Canine respiratory coronavirus (CRCoV)', '2003 United Kingdom', 'Cattle (BCoV)', 'Rodents? Bats?', 'Kennel'],
                      ['Canine enteric coronavirus (CCoV)', '1971 Germany', 'Unknown', 'Bat (*Rhinolophus* spp.?)', 'Military dog kennel'],
                      ['*Pantropic CCoV-IIa*', '2005 Italy', 'Unknown', 'Bat (*Rhinolophus* spp.?)', 'Pet shop'],
                    ],
                  } },
                  '**Primary host: Cat**',
                  { table: {
                    headers: ['Emerging coronavirus (or new virulent strain)', 'Year and location of first reported cases', 'Intermediate spillover host or host of viral predecessor', 'Potential reservoir host', 'Environment associated with emergence'],
                    rows: [
                      ['Feline coronavirus (FCoV)', '1963 United States', 'FCoV-I: Unknown; FCoV-II: Cat and/or dog (FCoV-I × CCoV-II)', 'Bat (*Rhinolophus* spp.?)', 'Shelters and catteries'],
                      ['*Horizontally-transmitted FIP FCoV-II*', '2011 Taiwan', 'Cat and/or dog (FCoV-I × CCoV-II)', 'Bat (*Rhinolophus* spp.?)', 'Shelter'],
                    ],
                  } },
                  { bullets: [
                    'The entry \'Unknown\' may either suggest that an intermediate spillover host exists but it has not been identified, or that it may not exist. Question marks represent uncertainty. FCoV-I × CCoV-II denotes recombination between FCoV-I and CCoV-II',
                  ] },
                ] },
              { sub: 'Zoonosis and reverse zoonosis: COVID-19',
                body: [
                  { bullets: [
                    '**SARS-CoV-2**: Bats-Natural host → Direct transmission from bat → คน; Intermediate hosts: Pangolin → Transmission from intermediate host → คน; Human-to-human transmission',
                    '**Susceptible animals**: Pet animals (Dog-cats: Asymptomatic); Wild animals (Lion-tiger); Farmed animals (Mink)',
                    '**Experimental infections**: Hamster, Ferret, Primates, Mouse',
                    '**Nonsusceptible animals**: Duck, Turkey, Chicken, Pig',
                  ] },
                ] },
              { sub: 'Mpox virus',
                body: [
                  { bullets: [
                    'Poxviridae, DNA',
                    'Possible primary host: rats, squirrels',
                    'NHPs are incidental host',
                    'Transmission cycle of monkeypox: Primary host i.e., Rodents (Rats/Squirrels) → Biting/Scratch etc. → คน; Incidental host such as Primates → Bushmeat eating → คน; Human to Human transmission',
                    '**Symptoms and Indications**: Headache, Fever, Backache, Swollen lymph nodes, Rash, Muscle aches',
                  ] },
                ] },
              { sub: 'Influenza A viruses',
                body: [
                  { bullets: [
                    'Orthomyxoviridae, RNA',
                    '**Wild waterfowls** are main reservoir',
                    'Subtype H ของ influenza A ที่พบในแต่ละ host (Mittleholzer et al., 2006): waterfowl — H1-H16; Humans — H1, H2, H3, H5, H7, H9; Pigs — H1, H3; Horses — H3, H7; Domestic poultry — H5, H7; Seals — H7; Whales — H13, H1; Minks — H10; Cats — H5; Dogs — H3; Camels — H1',
                    'Host ของ influenza viruses แต่ละชนิด (Kushipudi et al., 2018): **Influenza A viruses** — Duck, Turkey, Leopard, Tiger, Chicken, Emu, Quail, Raccoon, Ferret, Water fowl, Ostrich, Dog, Cat, Bat, Whale, Horse, Seal, Man, Pig; **Influenza B viruses** — Seal, Man, Pig; **Influenza C viruses** — Man, Pig; **Influenza D viruses** — Cattle, Camel, Sheep, Goat, Horse, Man, Pig',
                    '**Family Orthomyxoviridae**: Influenza A viruses (16H and 11N); H5 and H7 can cause severe disease',
                    '**Reservoir**: aquatic birds including waterfowls & waders; Zoonotic infection from intermediate species: poultry and pigs',
                    '**Transmission**: Mainly human-to-human via droplets; Zoonotic influenza has limited transmissibility between humans',
                    'Influenza A viruses: H1-H16, N1-N9; Influenza A-like viruses: HL17-HL18, NL10-NL11',
                  ] },
                ] },
            ] },
          { sub: 'Angiostrongylosis',
            body: [
              { sub: 'Agents, reservoir และ life cycle',
                body: [
                  { bullets: [
                    '*Angiostrongylus cantonensis* & *A. malayensis*',
                    '**Reservoir**: Definitive host: rodents; Intermediate host: snails and flat worms',
                    'Life cycle ของ *Angiostrongylus* spp.: **Definitive hosts** (lungworm reproduction) → **Rat feces** (L1 larvae) → **Intermediate hosts** (infective L3 larvae) → กลับสู่ definitive hosts; และ intermediate hosts → **Accidental or Paratenic hosts**',
                  ] },
                ] },
              { sub: 'Definitive hosts',
                body: [
                  { bullets: [
                    'Murine rodents ใน genera *Bandicota* spp. และ *Rattus* spp. เป็น important **definitive hosts** ของ *A. cantonensis* in the wild',
                    'ตัวอย่าง: *Bandicota indica*; *Rattus exulans*, *Rattus norvegicus* และ *Rattus rattus* ซึ่งเป็น invasive species',
                    '**Synanthropic rodent species**',
                  ] },
                ] },
              { sub: 'Intermediate hosts',
                body: [
                  { bullets: [
                    'Terrestrial snails (e.g., *Achatina fulica*, *Cryptozona siamensis*), aquatic snails (*Pila* spp., *Pomacea* spp.) และ slugs (e.g., *Veronicella* spp.) เป็น main mollusc hosts (**intermediate hosts**) ใน *A. cantonensis* life cycle',
                    '*Achatina fulica* และ *Pomacea canaliculata* ระบุว่าเป็น invasive species',
                    'ตัวอย่าง mollusc host อีกชนิด: *Parmarion* sp.',
                  ] },
                ] },
              { sub: 'Paratenic hosts',
                body: [
                  { bullets: [
                    '**Paratenic hosts** involve in the life cycle of the parasite, and play important role particularly for parasitic transmission to carnivores and humans',
                    'ตัวอย่าง paratenic hosts: Fresh-water prawn, Land crab, Land planarian, Monitor lizard',
                  ] },
                ] },
            ] },
          { sub: 'Prevention: pre-spillover prevention และ ecological interventions',
            body: [
              { sub: 'Pre-spillover prevention of emerging zoonotic diseases',
                body: [
                  { bullets: [
                    'Wildlife disease surveillance',
                    'Research on role of wildlife on zoonotic disease emergence',
                  ] },
                  { table: {
                    headers: ['Stage', 'Prevention and control', 'Measures', 'Stages of pathogen spread'],
                    rows: [
                      ['Pre-emergence', 'Anticipation', 'Viral surveillance', 'Pathogen evolution in wild animals'],
                      ['Pathogen spillover', 'Primary prevention', 'Reduction of deforestation, agriculture, wildlife trade', 'Direct spillover (Vectors, Domestic animals)'],
                      ['Emergence', 'Early detection', 'Syndromic surveillance', '—'],
                      ['Localized transmission', 'Containment', 'Contact tracing, Isolation', '—'],
                      ['Epidemic', 'Control & mitigation', 'Widespread testing, quarantine, scale-up health care, school and business closure', 'Human amplification'],
                      ['Pandemic', 'All prior measures brought to a larger scale', '—', 'Global spread'],
                    ],
                  } },
                ] },
              { sub: 'Zoonotic infection pathways & where to target',
                body: [
                  { bullets: [
                    '**Wildlife zoonotic reservoirs and vectors** ↔ **Humans**: Human encroachment leads to exposure, emergence of zoonoses',
                    '**Urban and peri-urban species** (Companion animals, Livestock, Zoo animals) ↔ **Humans**: Weaknesses in hygiene and public health policies; Diseases within settlements',
                    'ระหว่าง wildlife กับ urban/peri-urban species: Overlap in sylvatic and peri-urban habitats, recurring infection of secondary reservoirs',
                    'Amplification in primary reservoirs; Outbreaks in human populations',
                    '**Prevention strategies**: Sharing of epidemiological data; Routine testing of sentinel species; Identifying and vaccinating high-risk groups; Limit wildlife-domestic contact, e.g. fences, planning around migration routes',
                  ] },
                ] },
              { sub: 'Ecological interventions targeting different spillover barriers',
                body: [
                  { bullets: [
                    'Targeting reservoir hosts',
                    'Targeting the environment: habitat, vector control & ecosystem management',
                    'Targeting the interface b/w Hr & Hs',
                    'Targeting susceptibility & infection in Hs',
                    'Spillover barriers ตามลำดับ: reservoir density or distribution → pathogen prevalence → infection intensity or pathogen shedding → pathogen survival and spread → spillover host exposure → susceptibility and infection → spillover',
                    'ตัวอย่างโรค: rabies, avian influenza, Nipah, Hendra, brucellosis, primate malaria, Lyme',
                  ] },
                ] },
              { sub: 'Targeting reservoir host',
                body: [
                  { bullets: [
                    '**Culling & test-and-slaughter**: Economic & ecological costs (Nipah virus); Negative consequences: increase in pathogen transmission/virulence (rabies)',
                    '**Reservoir density/distribution** — Fences, culling →',
                    '(1) **Habitat modification**: altered food distribution (elk-brucellosis)',
                    '(2) **Natural enemies**: maintenance of leopards to limit rabid feral dogs',
                    '**Pathogen prevalence** — Chemotherapy, vaccination, test-and-remove →',
                    '(3) **Dilution hosts**: increased diversity of host community (Lyme disease)',
                    '(4) **Genetic management**: reducing poultry stay-time in markets (HPAI)',
                    '**Infection intensity/pathogen shedding** — (5) **Hr nutrition & susceptibility**: flowering tree for fruit bat/ maintain prey community for vampire bat',
                  ] },
                ] },
              { sub: 'Targeting the environment',
                body: [
                  { bullets: [
                    '**Pathogen survival & spread** — Insecticides, disinfection →',
                    '(6) **Habitat modification**: fish addition to rice field to reduce mosquitoes',
                    '(7) **Genetic management**: gene drive in *Anopheles gambiae*',
                    '(8) **Natural enemies**: maintaining scavenger community to manage infected carcasses (brucellosis, anthrax)',
                  ] },
                ] },
              { sub: 'Targeting spillover host',
                body: [
                  { bullets: [
                    '**Spillover host exposure** — Chemical repellents, biosecurity →',
                    '(9) **Human behavior modification**: bamboo skirts over date palm sap collection pots (Nipah virus)',
                    '**Spillover host susceptibility & infection** — Chemotherapy, vaccination →',
                    '**Managing co-infections or microbiome**: use of fecal transplant procedures to treat *Clostridium difficile* with microbial competitor',
                    '**Genetic management**',
                  ] },
                ] },
            ] },
          { sub: 'Key activities, response components และ conceptual frameworks',
            body: [
              { sub: 'Key activities of vet practices on disease emergence from wildlife',
                body: [
                  { bullets: [
                    'กิจกรรมที่นำไปสู่ **Emerging zoonotic disease** และโรคตัวอย่าง: **Live animal markets** — SARS, COVID-19, Avian Influenza',
                    '**Wildlife hunting** — HIV, Ebola',
                    '**Intensive wildlife farming** — COVID-19, Rabies, Avian Influenza',
                    '**Domestic animals** — Hendra, Nipah, Avian Influenza',
                  ] },
                ] },
              { sub: 'Measures to prevent pathogen spillover from wildlife to human',
                body: [
                  { bullets: [
                    'คำถามอภิปราย: What measure you would like to suggest the authorities to establish to prevent pathogen spillover from wildlife to human?',
                  ] },
                  { callout: 'Protect where bats eat, protect where bats roost, protect people at risk', kind: 'tip' },
                  { bullets: [
                    'ไล่ตาม Increasing land-use and land-use change intensity: Natural habitats → Natural-rural interface → Suburban/urban environments',
                    '**Natural habitats** — Prevent loss & fragmentation of natural habitats: Manage natural habitats to maintain ecosystem function; Protect foraging sites across the landscape; Protect habitats around roosts; Protect roosts',
                    '**Natural-rural interface** — Establish landscape connectivity & resource continuity: Restore critical habitats & water resources around roosts; Replant native trees & vegetation; Manage livestock to minimize interactions with bats; Do not disturb or kill bats',
                    '**Suburban/urban environments** — Keep urban expansion away from large wildlife populations: Engage communities & urban planners in bat conservation & risk mitigation; Protect food & water supplies from bats; Create safe exclusions and bat-proof house designs',
                  ] },
                ] },
              { sub: 'Surveillance, Prevention, and Control of Zoonotic Diseases',
                body: [
                  { bullets: [
                    'กลุ่มที่เกี่ยวข้อง: **Wildlife** (Viral reservoirs, Endangered animals), **Feral / Stray animals** (including escapees from mink farms), **Domestic / Pet / Farmed / Captive animals** (including pet ferrets and captive zoo animals), **Humans**',
                    'มาตรการ: **Active / Passive surveillance**; **Vaccination and transport restrictions**',
                  ] },
                ] },
              { sub: 'Components involved in responding to emerging infectious diseases',
                body: [
                  { bullets: [
                    '**Prevention**: Monitoring and tackling the factors increasing the emergence of infectious diseases including climate and anticipating, detecting new outbreaks among the population and communicating those risks effectively',
                    '**Preparedness**: Building stronger health care systems able to cope with health emergencies (e.g., having personal protective equipment available, staff, areas to quarantine, etc.)',
                    '**Prediction and early detection**: Anticipating, detecting new outbreaks among the population and communicating those risks effectively',
                    '**Response**: Diminishing the spread of the virus (e.g., non pharmaceutical interventions, quarantine, or also vaccination)',
                    '**Recovery**: Building back better, (e.g., adapting national resilience strategies and warning systems, creating a new pandemic treaty)',
                    '**Primary focus** of infectious-diseases strategies, warning and response systems: Prediction and early detection และ Response; **Secondary focus** as a result of the COVID-19 pandemic: ครอบคลุม Preparedness ถึง Recovery; **Missing links** to strategies focused on prevention: Prevention (Fernandez de Cordoba, 2023)',
                  ] },
                ] },
              { sub: 'Ecological and biomedical individualist conceptual frameworks',
                body: [
                  { bullets: [
                    'กรอบสำหรับทำความเข้าใจที่มาของ SARS-CoV-2 และ zoonoses อื่น: **Ecological Framework** — Human encroachment the root problem',
                    'Solutions ของ Ecological Framework: Reduce environmental encroachment & degradation; Humans balanced interaction with biosphere',
                    '**Biomedical Individualist Framework** — Viruses/Animals the root problem',
                    'Solutions ของ Biomedical Individualist Framework: Reduce contact between humans and animals; Ban wildmeat',
                  ] },
                ] },
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
    summary: 'Helminth zoonoses — 3 groups: Trematode (Opisthorchiasis, Paragonimiasis), Cestode (Spirometriasis, Taeniasis, Dipylidiasis, Echinococcosis), Nematode (Ancylostomiasis, Toxocariasis, Trichuriasis, Anatrichosomiasis) และ Dirofilaria repens ท้ายบท.',
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
        heading: 'รายโรคพยาธิ — Opisthorchiasis ถึง Dirofilaria repens',
        source: '4 - Helminthic zoonoses.pdf p.4-69',
        body: [
          { sub: 'Cestode และ Nematode — โรคที่ครอบคลุม',
            body: [
              { bullets: [
                'กลุ่ม **Cestode** ได้แก่ **Spirometriasis**, **Taeniasis**, **Dipylidiasis** และ **Echinococcosis**',
                'กลุ่ม **Nematode** ได้แก่ **Ancylostomiasis**, **Toxocariasis**, **Trichuriasis** และ **Anatrichosomiasis** (NEW)',
              ] },
            ] },
          { sub: 'Opisthorchiasis',
            body: [
              { bullets: [
                '**Etiologic Agent:** *Opisthorchis viverrini*',
                '**Distribution:** พบในเอเชีย โดยเฉพาะในประเทศไทย (Asia, especially in Thailand)',
                '**Morphology** (adult worm): 7.4 X 1.5 mm in human และ 4.6 X 2.0 mm in cats',
              ] },
              { sub: 'Life cycle',
                body: [
                  { bullets: [
                    '**ขั้น 1** — Embryonated eggs passed in feces (**Diagnostic Stage**)',
                    '**ขั้น 2** — Eggs are ingested by the snail: **Miracidia** (2a) → **Sporocysts** (2b) → **Rediae** (2c) → **Cercariae** (2d)',
                    '**ขั้น 3** — Free-swimming cercariae encyst in the skin or flesh of fresh water fish',
                    '**ขั้น 4** — Metacercariae in flesh or skin of fresh water fish are ingested by human host (**Infective Stage**)',
                    '**ขั้น 5** — Excyst in duodenum',
                    '**ขั้น 6** — Adults in biliary duct',
                  ] },
                ] },
              { sub: 'Pathology and Symptomatology',
                body: [
                  { bullets: [
                    'Epithelium proliferates และ wall thickening ของ bile duct',
                    '**Hepatic cirrhosis**, **Ascites**, **Jaundice**, **Cholecystitis** และ **Cancer**',
                    '**Adult worm** ทำให้ biliary mucosa เสียหาย (adult worm damage biliary mucosa)',
                  ] },
                ] },
              { sub: 'Pathogenesis',
                body: [
                  { bullets: [
                    '**Liver fluke infection** → **Immunopathology** → **Inflammation** → fibrosis → **Blockage bile duct**',
                    '**Liver fluke infection** → **Molecular product** → **ES product** → **Nitric oxide, Oxygen radicals** → **DNA damage** → **Oncogenic mutation** → **Cholangiocarcinoma**',
                    '**Inflammation** → Induction of NO3 → **Nitric oxide, Oxygen radicals**',
                  ] },
                ] },
              { sub: 'Cholangiocarcinoma (CCA)',
                body: [
                  { bullets: [
                    '**Carcinogenic food-borne trematode**',
                    'CCA พบได้เฉพาะในคนเท่านั้น (can only be found in humans)',
                    'liver fluke-associated CCA ไม่ค่อยพบว่าเกิดใน naturally infected animals (not common to develop)',
                    '*O. viverrini*-associated CCA ใน animal reservoirs ไม่เคยมีรายงาน ณ ปัจจุบัน (never been reported at this time)',
                  ] },
                ] },
              { sub: 'Why CCA does not develop in the infected animals',
                body: [
                  { bullets: [
                    '**lifespan** ของสัตว์ที่ติดเชื้อไม่ยาวพอให้เกิด CCA',
                    '**host immune response** โดยเฉพาะ inflammation ไม่ aggressive หรือ highly active มากพอที่จะ trigger the eruption of CCA',
                    '**species specificity** เป็น determinant ของการเกิด CCA',
                  ] },
                ] },
              { sub: 'Treatment and Prophylaxis',
                body: [
                  { bullets: [
                    '**Praziquantel** ถูกใช้อย่างกว้างขวางที่สุด (has been most extensively used)',
                    'หลีกเลี่ยงอาหารที่มี **raw fish** (Food containing raw fish should be avoided)',
                    'Stool ของผู้ป่วยต้องได้รับการ treat อย่างเพียงพอ (adequately treated) เพื่อป้องกันไม่ให้ eggs แพร่กระจาย (being spread)',
                  ] },
                ] },
            ] },
          { sub: 'Paragonimiasis',
            body: [
              { bullets: [
                '**Etiologic agent:** *Paragonimus westermani*',
                '**Morphology:** 7-12 mm in length, 4-8 mm in width, 4-6 mm in thickness',
                '**Distribution:** widely distributed in Asia',
              ] },
              { sub: 'Pathology and Symptomatology',
                body: [
                  { bullets: [
                    'Bleeding และ inflammation ของ hepatic parenchyma',
                    'Fibrous granulation tissue of lung',
                    '**Cerebral paragonimiasis** → accidentally',
                  ] },
                ] },
              { sub: 'Diagnosis & treatment',
                body: [
                  { bullets: [
                    '**Diagnosis:** Egg in sputum',
                    '**Diagnosis:** Chest radiograms ต้องระวังแยกจาก **pulmonary tuberculosis** (caution must be taken to differentiate)',
                    '**Treatment:** **Praziquantel** มีประสิทธิภาพ (efficacious) แต่บางรายต้องผ่าตัดเอาออก (some case require surgical remove)',
                  ] },
                ] },
            ] },
          { sub: 'Spirometriasis',
            body: [
              { bullets: [
                '**Etiologic agent:** *Spirometra mansoni*',
                '**Distribution:** ทั่วโลก (widely world)',
                '**Morphology:** usually 1 mm long และกว้างน้อยกว่า 1 cm (less than 1 cm in width)',
                '**Egg:** 55-76 X 30-43 μ',
              ] },
              { sub: 'Life cycle',
                body: [
                  { bullets: [
                    '**Dog & cat** มีความสำคัญทางการแพทย์ (medically important)',
                    'คนเป็น final host ได้น้อย (Human can rarely be final host)',
                    '**1st:** Cyclops',
                    '**2nd:** bird, reptile, amphibian',
                  ] },
                ] },
              { sub: 'Route of infection & prophylaxis',
                body: [
                  { bullets: [
                    'คนติดโดยการดื่มน้ำที่ treat ไม่เพียงพอ (inadequately treated water)',
                    'หรือกิน raw or insufficiently heated meat ของ **2nd I.H**',
                    'หลีกเลี่ยงการนำ **fresh frog meat** มาใช้ (applying) รักษาส่วนที่เป็นโรค (to treat some of disease part)',
                  ] },
                ] },
              { sub: 'Pathology & symptomatology',
                body: [
                  { bullets: [
                    '**Anorexia**, **Diarrhea**, **Marasmus** และ **Intestinal obstruction**',
                  ] },
                ] },
              { sub: 'Diagnosis & Treatment',
                body: [
                  { bullets: [
                    'Diagnosis ทำได้ง่ายโดยสังเกต **eggs** หรือแน่นอนกว่านั้นคือพบ **proglottids** ใน stool',
                    '**Tx:** **niclosamide** และ **bithionol** are efficacious',
                    '**Larvae** must be removed by surgery',
                  ] },
                ] },
            ] },
          { sub: 'Taeniasis',
            body: [
              { bullets: [
                'Disease ที่เกิดจาก tapeworms ใน Genus *Taenia* เรียกว่า **Taeniasis**',
                'มีหลาย zoonoses ที่สำคัญทางการแพทย์ (medical importance)',
                '*Taenia saginata* และ *Taenia solium* มีความสำคัญเป็นพิเศษ (especially significant)',
              ] },
              { sub: 'Taeniasis and Cysticercosis in man',
                body: [
                  { bullets: [
                    '**Pig:** *Cysticercus cellulosae* → **Poor cooked meat** → **Man:** *Taenia solium*',
                    '**Eggs** → **Cysticercosis in man** (Aberrant migration to CNS = neurocysticercosis)',
                  ] },
                ] },
              { sub: 'Cysticercus cellulosae',
                body: [
                  { bullets: [
                    '**Cysticercus cellulosae** — parasitic zoonosis',
                    '**Intermediate host:** swine; **Final Host:** Human',
                    '**The most dangerous taeniasis in humans**',
                    '**Clinical sign:** No clinical sign in intermediate host',
                    '**Cysticercosis in human:** Brain',
                    '**Diagnosis:** Cyst in muscle; Cyst (scolex: rostellum, hook 2 rows)',
                    '**Prevention:** Cook well before eat; Sanitation',
                    '**Cyst** can be destroyed at 90-100 °C',
                    'หรือ Freeze at -8 to -10 °C 4 days',
                    '**Treatment:** Intermediate host: No',
                    '**Treatment:** Final host: **Niclosamide**, adult: 2g, children: 1 g',
                  ] },
                ] },
              { sub: 'Cysticercus bovis',
                body: [
                  { bullets: [
                    '**Intermediate Host:** cattle',
                    '**Adult:** small intestine',
                    '**Final Host:** Human',
                    '**Zoonosis**',
                    '**วงจรชีวิต** *Taenia saginata*: Egg pass through with feces → eat → **Hexacanth embryo** → **Eat raw beef**',
                    '**Biology:** Maturation period ของ *C. bovis* 18 wks',
                    'Cyst in muscle',
                    'Cyst ~ 2-5 years (experiment)',
                    '*Taenia* egg > 2.5 months in feces, > 159 days in grassland',
                    '**Clinical sign:** adult → irritate mucous membrane of small intestine, malnutrition',
                    'No clinical sign in intermediate host',
                    '**Diagnosis:** Necropsy, Serology, found *Taenia* egg',
                    '**Treatment & control:** In animal → No Tx',
                    'In human: **Praziquantel** 5-20 mg/kg PO',
                    '**Prevention:** Sanitation; Cook food with 100 °C',
                  ] },
                ] },
            ] },
          { sub: 'Dipylidiasis',
            body: [
              { bullets: [
                '**Etiologic Agent:** *Dipylidium caninum*',
                '**Morphology:** **scolex** และ **mature proglottid** (testes, sperm duct, cirrus sac, genital pore, vagina, ovary, seminal receptacle, Mehlis\' gland, vitellarium)',
              ] },
              { sub: 'Life cycle',
                body: [
                  { bullets: [
                    '**Final host:** dog, cats, foxes',
                    '**IH:** flea & louse (*Trichodectes canis*)',
                    'Tapeworm segments containing egg packets are passed in the feces; occasionally, egg packets are present in feces',
                    '*Dipylidium caninum* egg packets contain individual eggs',
                    'Eggs are ingested by flea larvae; tapeworm eggs develop to infective larvae within the developing flea',
                    'Fleas are ingested as the pet grooms; tapeworm larvae within the flea will develop to adult tapeworms in the small intestine',
                  ] },
                ] },
              { sub: 'Route of infection, Diagnosis & Tx',
                body: [
                  { bullets: [
                    '**Route of infection:** Dog and cat bite & swallow fleas and lice that carry **cysticercoids**',
                    '**Diagnosis** is easy if one finds **gravid proglottids** crawling out the anus',
                    '**Tx:** **Praziquantel** is drug of choice',
                  ] },
                ] },
              { sub: 'Case report — Dipylidium caninum ในเด็กอายุ 11 เดือน (Colombia)',
                body: [
                  { bullets: [
                    'Benitez-Bolivar et al., Parasites & Vectors (2022): **morphological and molecular characterization** ของ *Dipylidium caninum* ที่ infecting an infant ใน Colombia (**a case report**)',
                    '**Background:** *Dipylidium caninum* is the causal agent of dipylidiasis affecting mainly cats and dogs worldwide; human cases of dipylidiasis are rare และ diagnosis is prevalently based on morphological features of the parasite',
                    '**Case:** *D. caninum* infecting an 11-month-old boy in Cajicá, Colombia',
                    '**Methods:** fresh faecal samples จากเด็ก; morphological identification of the parasite จาก faecal smears; DNA จาก **proglottids** ใช้ใน PCR amplification of a 653-bp fragment of the nuclear ribosomal RNA (rRNA) encoding the 28S rRNA gene; phylogeny study ใช้ maximum likelihood method และ Tamura-Nei model',
                    '**Results:** *D. caninum* was identified as the etiological agent causing the infection in the infant; the obtained sequence clusters within the **feline genotype clade**; หลัง diagnosis ให้ **effective treatment with praziquantel**',
                    '**Conclusions:** third human case of dipylidiasis reported in Colombia และเป็น first study in South America ที่ให้ molecular identification ของ *D. caninum*',
                    'ผู้ปกครองพา patient อายุ 11 เดือน (Cajicá, Cundinamarca Department, Colombia) มาพบ paediatric service ใน March 2020 เพราะ 15-day evolution ของ **expulsion of white mobile forms in the stool**',
                    '**Initial treatment:** **pyrantel pamoate** (an antiworm medication) → no clinical improvement was noted; ต่อมา **albendazole** → also with no effect; จึงให้ **metronidazole** for 7 days',
                    'ส่งต่อ paediatric gastroenterology service ใน May 2020; ผู้ปกครองให้ video ของผ้าอ้อมที่มี evident mobile structures และปฏิเสธ other associated symptoms',
                    'ผู้ปกครองรายงานว่ามี **pet (dog)** และพาเด็กไป green area ในโซนที่อยู่อาศัยเป็นประจำ (regularly took the child to a green area in the zone where they live)',
                  ] },
                ] },
            ] },
          { sub: 'Echinococcosis',
            body: [
              { bullets: [
                '**Echinococcosis** มีสาเหตุจากพยาธิตืด *Echinococcus* spp.',
                'พบได้ทั่วโลก รายงานส่วนใหญ่ในปัจจุบันพบในต่างประเทศ ส่วนรายงานในประเทศไทยยังไม่มีข้อมูลที่ชัดเจน',
                'พยาธิชนิดนี้มี **สุนัข** เป็นโฮสต์สุดท้าย และมี **แกะ** เป็นโฮสต์กึ่งกลาง',
                '**วงจรชีวิต:** พยาธิตัวเต็มวัยอาศัยอยู่ในลำไส้เล็กของสุนัข ปล่อยปล้องสุกซึ่งภายในมีไข่พยาธิปนออกมากับมูลสุนัข',
                'เมื่อโฮสต์กึ่งกลางกินไข่ที่มีตัวอ่อนระยะที่ 1 เข้าไป ตัวอ่อนจะเคลื่อนที่ไปยังอวัยวะต่าง ๆ โดยเฉพาะที่ตับและปอด และเจริญเป็นตัวอ่อนระยะที่ 2 ที่เรียกว่า *Echinococcus* ซึ่งเป็นตัวอ่อนระยะติดต่อ',
                'เมื่อสุนัขได้รับตัวอ่อนระยะที่ 2 นี้ จะเจริญเป็นตัวเต็มวัยที่ลำไส้เล็ก ครบวงจรชีวิตใช้เวลาประมาณ **6-8 สัปดาห์**',
                '**ในคน** มีโอกาสติดโดยการกินไข่พยาธิที่ปนเปื้อนออกมากับมูลสุนัข ตัวอ่อนจะเคลื่อนที่ไปยังอวัยวะภายในส่วนต่าง ๆ ของร่างกาย และพัฒนาเป็นตัวอ่อนระยะที่ 2 ซึ่งมีลักษณะเป็นถุงน้ำขนาดใหญ่ ภายในมีตัวอ่อนอยู่',
                'วงจรชีวิตอ้างอิงจาก CDC (**Cystic Echinococcosis**)',
              ] },
              { callout: 'จากวงจรชีวิตที่กล่าวไป โอกาสที่สุนัขของเราจะติดพยาธิตืด *Echinococcus* จึงเป็นไปค่อนข้างยากสำหรับการเลี้ยงสัตว์เลี้ยงในประเทศไทย', kind: 'tip' },
              { bullets: [
                '**การรักษาและป้องกัน:** ยาถ่ายพยาธิ **Praziquantel** มีประสิทธิภาพสูงในการกำจัดพยาธิตัวเต็มวัย',
                'ควรสวมถุงมือในการเก็บมูลสุนัข และควรล้างมือให้สะอาดทุกครั้ง',
                'ควรถ่ายพยาธิให้สุนัขอย่างสม่ำเสมอ ช่วยลดโอกาสการติดโรคสัตว์สู่คนที่มาจากสัตว์เลี้ยงของเราได้',
              ] },
            ] },
          { sub: 'Ancylostomiasis',
            body: [
              { bullets: [
                '**Etiologic agent:** *Ancylostoma caninum*',
                '**Distribution:** World-wide',
                '**Morphology:** ตัวเมีย (14 x 0.6 mm) > ตัวผู้ (10 x 0.4 mm)',
              ] },
              { sub: 'Life cycle',
                body: [
                  { bullets: [
                    '**วงจรชีวิต** *Ancylostoma* spp. ประกอบด้วย **egg**, **L3**, **Ingest L3**, **Tissue migration**, **Transmammary** และ **Eating Fecal contaminated & Skin penetration of L3**',
                  ] },
                ] },
              { sub: 'Pathology & symptomatology',
                body: [
                  { bullets: [
                    '**Tarry diarrhea** → death',
                    '**Anemia**',
                    '**Creeping eruption** และ **dermatitis** — จาก **Larvae**',
                  ] },
                ] },
              { sub: 'Pathology — Larval stage',
                body: [
                  { bullets: [
                    '**Larval stage** — Skin penetration',
                    '**Protease** → Digestion of skin molecule, CNT',
                    '**Hyaluronidase** → **Cutaneous larval migrans**',
                    '**Larva:** **Hyaluronic acid** — constitutes the ground substance of dermis; cell adhesion molecule',
                  ] },
                ] },
              { sub: 'Pathology — Adult stage',
                body: [
                  { bullets: [
                    '**Anticoagulant peptide** → Blood feeding ↑↑',
                    '**Hookworm platelet inhibitor** → Inhibit platelet aggregation → Blood feeding ↑↑',
                    '**Coagulation pathway** มี 2 สาย: **INTRINSIC** (surface contact) และ **EXTRINSIC** (tissue damage)',
                    '**AcAP2**, **AcAP3**, **AcAP4** ยับยั้งที่ **F VIIa**; **AcAP5**, **AcAP6** ยับยั้งที่ **F Xa**',
                  ] },
                ] },
              { sub: 'Pathology — Blood loss และ Protease inhibitor',
                body: [
                  { bullets: [
                    '**Blood loss** → anemia, iron deficiency',
                    '**Protease inhibitor** (secreted from cuticle) → inhibit chymotrypsin, pancreatic elastase, neutrophil elastase → **Inhibit worm destroyed**',
                  ] },
                ] },
              { sub: 'Ancylostoma ceylanicum',
                body: [
                  { bullets: [
                    '**Completely mature** in the intestine of humans',
                    '**Diagnosis & Tx:** clinical sign, found Egg in feces',
                    '**Tx:** **Pyrantel**, **Nitroscanate**, **Ivermectin**',
                  ] },
                ] },
            ] },
          { sub: 'Toxocariasis',
            body: [
              { bullets: [
                '**Etiologic agent:** *Toxocara canis*',
                '**Distribution:** world-wide',
                '**Morphology:** male (5-8 cm), Female (8-13 cm)',
              ] },
              { sub: 'Life cycle',
                body: [
                  { bullets: [
                    'Embryonated egg with larva → **Human (and other paratenic hosts)**; Human is paratenic hosts (no adult worm in the intestine)',
                    '**Dogs < 5 weeks:** Eggs Ingested → Larvae released in intestine → Circulation → Lungs → Bronchial tree → Esophagus → Adults in lumen of intestine → Eggs passed in feces',
                    'In heavy infections, larvae can be passed in feces',
                    '**Dogs > 5weeks (non-pregnant):** Larvae released in intestine → Circulation → Larvae migrate to various organs where their development is arrested',
                    '**In pregnant and lactating dogs,** the larvae can be reactivated and cause: intestinal infection in the mother; infection of the offspring (by transplacental and transmammary transmission)',
                    '**External Environment:** Eggs → Embryonated egg with larva (**Infective Stage**)',
                  ] },
                ] },
              { sub: 'Prophylaxis',
                body: [
                  { bullets: [
                    '**Avoid swallowing mature egg**',
                    'ล้างมือให้สะอาดหลังเล่นกับสุนัข (Washing hands well after playing with dog)',
                    'เด็กชอบเล่นที่ sandpit ซึ่งเป็นที่ที่สุนัขและแมวถ่ายอุจจาระกันบ่อย (children love to play at sandpit which is a common place of defecation for dogs & cats)',
                    '**Avoid eating meat or liver uncooked**',
                  ] },
                ] },
              { sub: 'Pathology & Symptomatology',
                body: [
                  { bullets: [
                    'ขึ้นกับ **site of invasion** (Depending on the site of invasion): **Hepatomegaly**, **Pulmonary infiltration**, **Neuropathy**, **Ophthalmological disorders including loss of vision**',
                  ] },
                ] },
              { sub: 'Diagnosis & Tx',
                body: [
                  { bullets: [
                    'ในคน diagnosis ง่ายและ definite ถ้าพบ larvae ใน tissue ที่ตัดออกด้วย biopsy หรือ surgical operation แต่ไม่สามารถทำได้เสมอไป (it is not always possible)',
                    '**Tx** is not easy in general but **thiabendazole** is fairly useful',
                  ] },
                ] },
            ] },
          { sub: 'Trichuriasis',
            body: [
              { bullets: [
                '**Etiology:** *Trichuris vulpis*',
                '**Host:** Dog',
                '**Organ:** caecum',
                '**Infected:** L1 in Egg',
                '**Life cycle:** Direct, non-migratory, ppp~3 mo.',
                '**Whipworm** ตัวเต็มวัยฝังตัวอยู่ในผนังของ large intestine และ cecum (embedded in the wall of the large intestine and cecum)',
                '**Infective larva** พัฒนาอยู่ภายใน egg แต่ไม่ฟักออก เว้นแต่ egg ถูกกลืนเข้าไป (does not hatch unless the egg is swallowed)',
                'Eggs ถูกขับออกมากับ feces (Eggs are passed in the feces)',
                '**Importance:** No clinical sign (Low), Typhlitis (Heavy), Muco-bloody diarrhea',
                '**Diagnosis:** Floatation technique',
                '**Control & Prevention:** Sanitation; DW every 3 mo.',
              ] },
            ] },
          { sub: 'Deworming program for puppy',
            body: [
              { table: {
                headers: ['Age', 'Vaccine', 'DW'],
                rows: [
                  ['2 months', '1st visit', '1 time'],
                  ['2.5 months', '2nd visit', '2 time'],
                  ['3 months', '3rd visit', '3 time'],
                  ['6 months', '4th visit', '4 time'],
                ],
              } },
              { bullets: [
                '**1 time:** Hookworm, Ascarids, Taenia',
                '**2 time:** Hookworm',
                '**3 time:** Whipworm, Ascarids, Taenia and **Heartworm prevention**',
                '**4 time:** Whipworm',
              ] },
            ] },
          { sub: 'Anatrichosomiasis — โรคพยาธิที่พบในอุ้งเท้าแมว',
            body: [
              { bullets: [
                'Case report (Jitsamai et al., published 14 October 2021): Molecular and Pathological Investigations of Zoonotic *Anatrichosoma* Spp.-Induced Ulcerative Pododermatitis in a Domestic Cat in Thailand',
                '**Ulcerative pododermatitis** caused by *Anatrichosoma* spp. พบที่เท้า 4 ข้าง (four feet); 2 weeks post-treatment with emodepside/praziquantel led to complete recovery',
                '**Histopathology** (haematoxylin and eosin): พบ necrosis ใน epidermis และ nematode-like lesions ใน dermis',
                'พบ inflammatory cell infiltration ใน dermis และ egg ใน uterus ของ adult female',
                '**Anatrichosomiasis** is a neglected parasitic disease caused by *Anatrichosoma* spp.; clinical presentation depends on the parasite species and host',
                'ใน non-human primates พบปรสิตใน mucosal และ submucosal tissues ของ nasal cavity; ส่วนใน cats พบใน epidermis และ dermis ของ carpal และ tarsal pads ทำให้เกิด ulcerative pododermatitis',
                'The life cycle of *Anatrichosoma* spp. is poorly understood, and the transmission route is still unclear',
                'first report of feline anatrichosomiasis ใน Thailand จาก pathological findings และ molecular confirmation (คาดว่าจะนำไปสู่การศึกษาต่อในหัวข้อวิจัยนี้)',
              ] },
            ] },
          { sub: 'Dirofilaria repens',
            body: [
              { bullets: [
                '**Adults:** dermal connective tissues',
                '**Final hosts:** dogs, cats and man',
                '**Intermediate hosts:** *Armigeres sp.* & *Mansonia uniformis*',
                '**Veterinary importance:** dermatitis',
              ] },
              { sub: 'Emergence of Dirofilaria repens in dogs in Eastern Thailand',
                body: [
                  { bullets: [
                    '**Background and Aim:** *D. repens* is a zoonotic vector-borne parasite of dogs and cats; not commonly found in every part of Thailand, except the southern part; ศึกษา prevalence ใน Eastern Thailand ปี 2019',
                    '**Methods:** 8003 blood samples จาก private veterinary clinics and animal hospitals ใน Eastern Thailand; blood parasites examined using buffy coat thin blood smears with Wright-Giemsa staining; *D. repens* was morphologically identified and confirmed using the acid phosphatase activity technique',
                    '**Results:** The first case of *D. repens* was found in March 2019; prevalence from January to December 2019 was 0.44% (35/8003) (95% confidence interval 0.30-0.61)',
                  ] },
                ] },
              { sub: 'Life cycle of D. repens',
                body: [
                  { bullets: [
                    '**ขั้น 1** — Infective L3 are transmitted during a blood meal to the next host',
                    '**ขั้น 2** — L3 move to the subcutaneous tissue and grow in 5-9month to mature adults',
                    '**ขั้น 3** — Adult worms live in nodules under the skin and release microfilaria which circulate in the blood',
                    '**ขั้น 4** — Mosquito takes up microfilaria from an infected dog',
                    '**ขั้น 5** — The development from microfilaria to infective L3 happens inside the mosquito and takes approximately 10-30 days',
                    '**Dogs** are the primary host of the skin worm *Dirofilaria repens*',
                    '**Zoonotic risk:** Humans can be infected as well and develop a similar disease; worms develop in subcutaneous nodules and inner organs',
                    '**PPP:** 5 months',
                  ] },
                ] },
              { sub: 'Subconjunctival dirofilariasis',
                body: [
                  { bullets: [
                    '**First report** on **subconjunctival dirofilariasis** in Thailand caused by a *Dirofilaria* sp. closely related to *D. hongkongensis* (Academia Journal of Scientific Research, March 2018)',
                  ] },
                ] },
            ] },
          { sub: 'Control of filarial infection in pets',
            body: [
              { bullets: [
                '**Preventive Medications** for filarial Infection',
                '**Ivermectin** — work by killing the microfilariae and sterile of adult female worms',
                '**Milbemycin Oxime** — effective against microfilariae and immature worms',
                '**Doxycycline** — can help reduce the number of bacteria in microfilariae and make the infection less transmissible',
                '**Moxidectin** — effective against microfilariae and can prevent the development of adult *Brugia* parasites',
              ] },
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
    summary: 'Emerging zoonotic disease in Thailand — outbreak situation + strategic plans for prevention + control (Dept. of Disease Control, MoPH). EID timeline 1957-2022 (Dengue → COVID → Mpox). 75% of EID in humans is from animals.',
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
        heading: 'Anthrax, Brucellosis, Leptospirosis, Rabies, Nipah, IHR/JEE',
        source: '5 - EID_Zoonoses_CU_Vet ⭐️ซซดาวข้อสอบ.pdf p.4-87',
        body: [
          { sub: 'Epidemic curve — ช่องทางตรวจจับโรค',
            body: [
              { callout: '**Quicker detection = smaller epidemics** และ smaller epidemics => better response', kind: 'tip' },
              { bullets: [
                '**Routine disease reporting**',
                '**Clinician reports** (ชั้นเดียวกับ **Astute clinician reports**)',
                '**Sentinel networks**',
                '**Digital disease detection**',
                '**Participatory epidemiology and future innovations**',
                '**Even earlier: disease surveillance in animals**',
              ] },
            ] },
          { sub: 'Steps in Outbreak Investigation — 10 ขั้นตอน',
            body: [
              { bullets: [
                '1) เตรียมการปฏิบัติงานภาคสนาม',
                '2) ตรวจสอบยืนยันการวินิจฉัยโรค',
                '3) ตรวจสอบยืนยันการระบาด',
                '4) กำหนดนิยามผู้ป่วยเพื่อค้นหาผู้ป่วยเพิ่มเติม',
                '5) ศึกษาระบาดวิทยาเชิงพรรณนา — ตาม เวลา สถานที่ บุคคล',
                '6) สร้างสมมุติฐานการเกิดโรค',
                '7) ศึกษาระบาดวิทยาเชิงวิเคราะห์ — เพื่อทดสอบสมมุติฐาน',
                '8) การศึกษาเพิ่มเติม เช่น สำรวจสิ่งแวดล้อม ตรวจทางห้องปฏิบัติการ',
                '9) แนะนำและดำเนินการควบคุมและป้องกันโรค',
                '10) นำเสนอผลการสอบสวน และติดตามผลมาตรการที่ดำเนินการ',
              ] },
            ] },
          { sub: 'Anthrax',
            body: [
              { sub: 'วงจรการติดต่อ',
                body: [
                  { bullets: [
                    '**From terminally infected animal, or carcass after death** → **biting fly** → คน (**cutaneous**) และสัตว์',
                    'สัตว์รับ **SPORES** ทาง **Ingested** (grazing, browsing, drinking) และ inhaled sometimes? (spore-laden dust)',
                    'ในสัตว์: **Germination & multiplication** in lymphatics & spleen, **vegetative forms** released in massive numbers into blood in final hours of life',
                    '**VEGETATIVE FORMS** (shed at death in haemorrhagic exudate from nose, mouth or anus or in spilt blood) → **sporulate** on exposure to O2 → **SPORES**',
                    'คนรับ spores ได้ 3 แบบ: **Pulmonary** (spore-laden dust), **Gastrointestinal** (infected meat, contaminated water?), **Cutaneous** (via lesion)',
                  ] },
                ] },
              { sub: 'Situation of Anthrax in Thailand',
                body: [
                  { bullets: [
                    'ในช่วงปี พ.ศ. 2535-2543 อัตราการเกิดโรคอยู่ระหว่าง **0.02–0.17 ต่อประชากรแสนคน** มีผู้ป่วยจำนวนสูงสุด **102 คน** ในปี พ.ศ. **2538**',
                    'ก่อนปี พ.ศ. 2543 เคยมีรายงานการเกิดโรคแอนแทรกซ์จากทุกภาคของประเทศไทย ส่วนใหญ่พบในภาคเหนือ ภาคตะวันออกเฉียงเหนือ และภาคกลาง',
                    'การเกิดโรคส่วนมากจะพบตามจังหวัดชายแดนที่ติดต่อกับสหภาพ พม่า ลาว',
                  ] },
                ] },
              { sub: 'ตัวอย่างการควบคุมโรค Anthrax เบื้องต้น',
                body: [
                  { bullets: [
                    'ถ้าสัตว์ตาย และสงสัยโรคแอนแทรกซ์ **ห้ามผ่าซาก**',
                    'อย่าให้สุนัขหรือสัตว์อื่นเข้าใกล้ซากสัตว์นั้น',
                    'ทำลายซากอย่างด่วน โดยการเผาหรือฝังพร้อมโรยปูนขาว',
                    '**ห้าม**ให้ประชาชนรับประทานเนื้อหรือเลือดจากสัตว์ที่ป่วยตาย',
                    'ระวังอย่าให้มีบาดแผลเล็ก ๆ และรักษาสุขอนามัย',
                    'แจ้งปศุสัตว์โดยด่วน เพื่อฉีดวัคซีนสัตว์โดยรอบรัศมี',
                  ] },
                ] },
              { sub: 'Burial of anthrax-dead animal',
                body: [
                  { bullets: [
                    'ฝังซากสัตว์ที่ตายด้วย anthrax ในหลุมลึก **2 m**',
                    '**1) Ca hydroxide**',
                    '**2) animal corpse contain**',
                    '**3) cover up with mixed soil & Ca hydroxide**',
                    '**4) cover up with soil**',
                    '**5) Pour 5% Ca hydroxide solution 10 L/m2**',
                    '**6) Cover up with soil ≥ 50 cm over ground surface**',
                    'Distance from ground surface to corpse **≥ 1 m**',
                  ] },
                ] },
              { sub: 'Risk of zoonotic diseases along border zones',
                body: [
                  { bullets: [
                    'กลุ่มโรค **NEGLECTED TROPICAL AND ZOONOTIC DISEASES** (Parasites, Vector borne, Food water borne, Respiratory infection etc.) ซึ่งโรคแอนแทรกซ์เป็นเพียงหนึ่งตัวอย่าง',
                    'พื้นที่เสี่ยงสำคัญ → **บริเวณชายแดน**',
                  ] },
                ] },
              { sub: 'เหตุการณ์สำคัญใน Wk ที่ 47 — Anthrax จ.ตาก',
                body: [
                  { bullets: [
                    'ProMED-mail post: **ANTHRAX - THAILAND: (TAK) HUMAN, CAPRINE, ex MYANMAR, SUSPECTED** (Date: 26 Nov 2017)',
                    'ข่าวภาษาไทย: โรคแอนแทร็กซ์ ระบาดวุ่น ชายแดนไทย-เมียนมา พบผู้ป่วยต้องสงสัยแล้ว **2 ราย** (ในพื้นที่ **อ.แม่สอด จ.ตาก** หลังมีข่าวลือสะพัดแพร่ระบาดหนักแถบชายแดนไทย-เมียนมา)',
                    'แพทย์เตือน อย่าตื่นตระหนก แนะทานเนื้อสัตว์ปรุงสุก ไม่กินเนื้อสัตว์ที่ป่วยตาย',
                  ] },
                ] },
              { sub: 'เหตุการณ์ในอดีต ที่ อ.แม่สอด จ.ตาก',
                body: [
                  { bullets: [
                    '**ปี 2540** — แผลแอนแทรกซ์ในคนงานชาวพม่าที่ชำแหละควายตาย',
                    '**ปี 2543** — การระบาดของโรคแอนแทรกซ์จากแพะที่ อ.แม่สอด สู่การเกิดโรคใน จ.พิจิตร',
                    'สัตว์: วันที่ 6 และ 8 พค. 2543 มีการขนแพะครั้งละ **140 ตัว** จาก อ.แม่สอด จ.ตาก มาที่ฟาร์ม ม.6 ต.หนองโสน อ.สามง่าม จ.พิจิตร (แพะตายเฉลี่ยวันละ 2-3 ตัว)',
                    'สัตว์: 17 พค. นำแพะแกะจาก อ.แม่สอด จ.ตาก มาเลี้ยงที่ฟาร์มอีก **150 ตัว**',
                    'สัตว์: 18 พค. แพะแกะป่วยตาย **19 ตัว** ปศจ. ตรวจพบวิการของโรคปอดบวม ฉีดยา Tylan-50 ทั้งฝูง',
                    'คน: 17 พค. ชาวบ้าน ม.12 ต.หนองโสน อ.สามง่าม มาขอซากแพะ',
                    'คน: 18 พค. ชาวบ้าน ม.12 ต.หนองโสน อ.สามง่าม มาขอซากแพะ',
                  ] },
                ] },
              { sub: 'มาตรการที่ดำเนินการแล้วในปศุสัตว์',
                body: [
                  { bullets: [
                    'ห้ามมีการเคลื่อนย้ายสัตว์และซากสัตว์จากประเทศเมียนมาร์ **1 เดือน**',
                    'ตรวจสอบ เก็บตัวอย่างเลือด และฉีดยา **penicillin-streptomycin** ให้แพะที่เลี้ยงในบริเวณดังกล่าว',
                    'กรมปศุสัตว์ส่งวัคซีนแอนแทรกซ์ **6000 doses** ให้ปศจ.ตาก ขณะนี้ฉีดโค **1501** ตัว ควาย **46** ตัว ไปแล้ว',
                    'ทำลายเชื้อบริเวณดังกล่าวรวมที่ชำแหละแพะ',
                    'เฝ้าระวังโรคในสัตว์บริเวณดังกล่าวเป็นเวลา **5 ปี** และดำเนินการฉีดวัคซีนแอนแทรกซ์ให้สัตว์ทุกปี ติดต่อกันเป็นระยะเวลา **5 ปี**',
                  ] },
                ] },
              { sub: 'ความยากในการสอบสวน Anthrax',
                body: [
                  { bullets: [
                    '**สร้างสมมติฐานการเกิดโรค** — บางพื้นที่นิยมรับประทานอาหารจากเนื้อสัตว์ที่ดิบหรือดิบ ๆ สุก ๆ และเสียดายที่จะทิ้งเนื้อสัตว์ที่ตายโดยไม่ทราบสาเหตุ',
                    '**สร้างสมมติฐานการเกิดโรค** — บางครั้งเป็นเนื้อสัตว์ที่นำเข้าจากชายแดนอย่างหลบ ๆ ซ่อน ๆ ทำให้หา source of infection ค่อนข้างยาก',
                    '**การศึกษาเพิ่มเติม เช่น สำรวจสิ่งแวดล้อม ตรวจทางห้องปฏิบัติการ** — สปอร์ของแอนแทรกซ์สามารถอยู่ในสิ่งแวดล้อมได้นานหลายสิบปี',
                    '**แนะนำและดำเนินการควบคุมและป้องกันโรค** — โรคเกิดในสัตว์ก่อน ซึ่งมีสัตว์ตายเกิดขึ้นแล้ว ทำให้บางครั้งการควบคุมโรคช้าเกินไป',
                  ] },
                ] },
            ] },
          { sub: 'Brucellosis',
            body: [
              { sub: 'ชนิดเชื้อและสัตว์ที่เกี่ยวข้อง',
                body: [
                  { bullets: [
                    '**Cattle** — *B. abortus*; **Swine** — *B. suis*; **Goats and sheep** — *B. melitensis*; **Dogs** — *B. canis*',
                    'ช่องทางที่ระบุสำหรับคน: **Milk**, **Slaughter**, **Veterinary care**, **Vaccination accident or laboratory accident, with cultures**',
                  ] },
                ] },
              { sub: 'ข้อมูลที่ได้จากการสอบสวนโรค',
                body: [
                  { bullets: [
                    'พ.ศ. 2548 เริ่มมาตรการป้องกันควบคุมโรคในแพะ - แกะ',
                    'พ.ศ. 2551 จำนวนการระบาดในปศุสัตว์ลดลงอย่างมาก',
                    'พ.ศ. 2553 ความชุกโรคระดับฝูงในแพะลดลง',
                    '**90%** ของผู้ป่วยพบเชื้อ *B. melitensis* ซึ่งมีรายงานพบเชื้อชนิดนี้ในแพะ',
                    '**80%** ของผู้ป่วยมีประวัติสัมผัสจากการบริโภค ชำแหละรับประทาน รวมถึงการเลี้ยงแพะ',
                    '**< 10%** — ปี 52 พบผู้ป่วย *B. suis* 2 ราย มีประวัติสัมผัสกับซากสุกรและหมูป่า',
                    'พื้นที่ที่พบโรคบ่อย เช่น เพชรบูรณ์ กาญจนบุรี นครปฐม โคราช ราชบุรี กทม',
                  ] },
                ] },
              { sub: 'Iceberg – Phenomenon–Brucellosis',
                body: [
                  { bullets: [
                    '**Passive case** (รง.506) ปีละไม่ถึง **10 ราย** ด้วยอาการ **Chronic** ดังนั้นในช่วงแรกมักถูกรายงานเป็น **PUO**',
                    '**Active case** (จากการลงสอบสวนโรค) มักพบผู้ป่วยเพิ่มประมาณ **2 เท่า** จากที่ได้รับรายงานในตอนแรก',
                    '1 ปีมีรายงานผู้ป่วย PUO ในไทยประมาณ **400,000 รายต่อปี** มีรายงานพบ **9%** ของ PUO ให้ผลบวกต่อ Brucellosis → ผู้ป่วย Brucellosis ในไทยอาจมากกว่าที่คาดการณ์ไว้',
                    'เชิงอรรถของตัวเลข 9%: Pathak AD. et al. Human brucellosis among pyrexia of unknown origin cases and occupationally exposed individuals in Goa Region, India. Emerg Health Threats J. 2014',
                  ] },
                ] },
              { sub: 'ข้อมูลระบาดวิทยาจากการสอบสวนโรคแสดงให้เห็นถึงอะไร',
                body: [
                  { bullets: [
                    '**Sporadic cases**',
                    '**Most likely to occur in Central part**',
                    '**Goat — major source of infection in human**',
                    '**Severely underreported**',
                  ] },
                ] },
              { sub: 'ตัวอย่างการควบคุมโรค Brucellosis เบื้องต้น',
                body: [
                  { bullets: [
                    'เตือนประชาชน ดื่มเฉพาะนมที่ต้มสุก หรือผ่านความร้อนอย่างถูกวิธีเท่านั้น',
                    'แจ้งสัตวแพทย์ พ่อค้าสัตว์ เกษตรกรเลี้ยงสัตว์ คนงานในโรงฆ่าสัตว์ ใช้ **PPE** และตรวจร่างกายเป็นประจำ',
                    'ถ้ามีรายงานสัตว์แท้ง ให้ฝังลูกสัตว์ที่แท้ง และรก พร้อมกับเผาหญ้า ฟาง ตรงบริเวณที่สัตว์คลอดลูก',
                    'แจ้งสัตวแพทย์ให้ทราบเพื่อตรวจการเกิดโรคในสัตว์ และทำลายตามมาตรการของกรมปศุสัตว์',
                  ] },
                ] },
              { sub: 'ประเด็นสำคัญและข้อเสนอแนะ',
                body: [
                  { bullets: [
                    '**คัดกรองประวัติเสี่ยง** — ในผู้ป่วย PUO ให้มีการคัดกรองสอบถามประวัติการเลี้ยงสัตว์โดยเฉพาะแพะ แกะ และ โคเนื้อ ที่มาตรการป้องกันควบคุมโรคในประชากรสัตว์เหล่านี้ยังไม่ทั่วถึง',
                    '**อาหารเสี่ยง** — ถ้าสาเหตุเกิดจากการรับประทานอาหาร ส่วนใหญ่เกิดจากการบริโภคเนื้อ นมของแพะ โค ที่ไม่ผ่านการปรุงสุก และอาหารที่เกี่ยวกับใช้รกเป็นส่วนประกอบ',
                    '**อาหารเสี่ยง** — ให้เน้นย้ำสุขศึกษาในกลุ่มอาหารเสี่ยง',
                    '**กำจัดแหล่งรังโรคในพื้นที่เกิดโรคเดิม** — พื้นที่ซึ่งพบการรายงานผู้ป่วยอย่างต่อเนื่อง ควรทำการศึกษาเกี่ยวกับแหล่งรังโรค และพฤติกรรมเสี่ยงของกลุ่มผู้เลี้ยงปศุสัตว์ที่เป็นผลให้เกิดการหมุนเวียนของโรคภายในพื้นที่',
                  ] },
                ] },
              { sub: 'ความยากในการสอบสวน Brucellosis',
                body: [
                  { bullets: [
                    '**เตรียมการปฏิบัติงานภาคสนาม** — ต้องประสานกับทีมงานปศุสัตว์และองค์กรปกครองส่วนท้องถิ่นเป็นอย่างดี ในการปฏิบัติงานในฟาร์มสัตว์',
                    '**กำหนดนิยามผู้ป่วยเพื่อค้นหา** — อาการของโรคไม่มีความจำเพาะ มีความคล้ายคลึงกับโรคหลายชนิด',
                    '**กำหนดนิยามผู้ป่วยเพื่อค้นหา** — ระยะฟักตัวของโรคมีระยะเวลาหลายสัปดาห์ถึงหลายเดือน',
                    '**แนะนำและดำเนินการควบคุมและป้องกันโรค** — สัตว์ไม่ค่อยแสดงอาการป่วย แต่ถ้าผลการตรวจยืนยันทางซีโรโลยีพบบวกให้ทำลายสัตว์ที่เป็นพาหะของโรค แต่สัตว์มีมูลค่าทางเศรษฐกิจ เจ้าของสัตว์ไม่ค่อยให้ความร่วมมือในการทำลายสัตว์',
                  ] },
                ] },
            ] },
          { sub: 'Leptospirosis',
            body: [
              { sub: 'องค์ความรู้พื้นฐาน: เชื้อเลปโตสไปราในสัตว์',
                body: [
                  { bullets: [
                    '**โค กระบือ**: ไข้ ผลิตน้ำนมลด แท้ง ผสมไม่ติด',
                    '**สุกร**: แท้ง ตัวเหลือง ตาเหลือง ฉี่เป็นเลือด',
                    '**สุนัข**: ไข้ ตับ/ ไตวาย',
                    'ส่วนใหญ่ไม่แสดงอาการ แต่เชื้อจะอยู่ตามท่อไต และปล่อยมากับปัสสาวะเป็นจำนวนมากและเป็นเวลานาน (หลายเดือนถึงหลายปี โดยเฉพาะหนู)',
                  ] },
                ] },
              { sub: 'สถานการณ์โรคเลปโตสไปโรซิสในประเทศไทยและประเทศเพื่อนบ้าน',
                body: [
                  { bullets: [
                    'อัตราป่วยสูงเกินกว่า **10 ราย ต่อ 100,000 คน**: กัมพูชา ลาว ไทย เวียดนาม',
                    'อัตราป่วยระหว่าง **1-10 ราย ต่อ 100,000 คน**: มาเลเซีย ฟิลิปปินส์',
                  ] },
                ] },
              { sub: 'เพาะแยกเชื้อจากปัสสาวะของสัตว์',
                body: [
                  { bullets: [
                    'เพาะแยกเชื้อเลปโตสไปราจากปัสสาวะของสัตว์ เพื่อตรวจสอบสัตว์ที่เป็นแหล่งรังโรคของการเกิดโรคในคน',
                    'ฉี่ ดินและน้ำ เนื้อเยื่อ อวัยวะ ปนเปื้อนเชื้อเลปโตสไปรา',
                    'ชื่อที่ระบุคู่กับสัตว์แต่ละชนิด: โค — *hardjo*; สุนัข — *canicola*; หนู — *icterohaemorrhagiae*; สุกร — *Pomona* (cattle, porcine, skunks, opossums)',
                  ] },
                ] },
              { sub: 'ตัวอย่างการควบคุมโรค Leptospirosis เบื้องต้น',
                body: [
                  { bullets: [
                    'แจ้งเตือนหลีกเลี่ยงการสัมผัสฉี่สัตว์',
                    'เน้นย้ำเรื่องสุขอนามัย ถ้าเป็นเกษตรกรเลี้ยงสัตว์ แนะนำให้แยกเสื้อผ้าใส่ในเวลาทำงานกับสัตว์หรือในฟาร์ม',
                    'เชื้อเลปโตตายเมื่อเจอแดด ให้แนะนำประชาชนตากชุดทำงานในฟาร์ม หรืออุปกรณ์รองเท้าบู้ท ถุงมือในที่ที่แดดแรง ๆ',
                    'ระบายน้ำท่วมขังออกให้มากที่สุด',
                    'ควบคุมหนู',
                    'เตือนประชาชนหลีกเลี่ยงการว่ายน้ำ แช่น้ำ อาบน้ำให้แหล่งน้ำจืดที่คาดว่ามีฉี่สัตว์ปนเปื้อน',
                  ] },
                ] },
              { sub: 'สถานการณ์โรคเลปโตสไปโรซิส ปี 2553-2564',
                body: [
                  { bullets: [
                    'จำนวนผู้ป่วย: 2553 = 4944, 2554 = 4261, 2555 = 4122, 2556 = 3093, 2557 = 2251, 2558 = 2151, 2559 = 2295, 2560 = 3508, 2561 = 2876, 2562 = 2170, 2563 = 1641, 2564 = 908',
                    'อัตราป่วย (Morbidity): 2556 = 4.83, 2557 = 3.47, 2558 = 3.3, 2559 = 3.51, 2560 = 5.31, 2561 = 4.34, 2562 = 3.26, 2563 = 2.48, 2564 = 1.37',
                    'อัตราป่วยตาย (CFR %): 2556 = 0.94, 2557 = 1.07, 2558 = 2.37, 2559 = 1.57, 2560 = 1.97, 2561 = 1.25, 2562 = 1.38, 2563 = 1.34, 2564 = 0.55',
                    'ข้อมูล ณ วันที่ 25 พ.ย. 64',
                  ] },
                  { callout: '**เป้าหมายปี 2565** — 1. อัตราป่วย ไม่เกิน **3.16 ต่อแสนประชากร** 2. อัตราป่วยตาย ไม่เกิน **1%**', kind: 'tip' },
                ] },
              { sub: 'กลุ่มเสี่ยง',
                body: [
                  { bullets: [
                    'อาชีพที่พบอัตราป่วยสูงสุด คือ **เกษตรกร (50%)** รองลงมา คือ **รับจ้าง (20%)**',
                    'อายุระหว่าง **25-65 ปี**',
                    'ผู้ป่วยและผู้เสียชีวิตเป็นเพศชายมากกว่าเพศหญิง',
                    'พฤติกรรมเสี่ยง ได้แก่ แช่น้ำหรือลุยน้ำเป็นเวลานาน มีบาดแผลที่ขาหรือเท้า',
                    'ผู้เสียชีวิตส่วนใหญ่ไปพบแพทย์ช้า ซื้อยามารับประทานเอง เนื่องจากอาการเริ่มแรกจะคล้ายคลึงโรคติดเชื้อทั่วไป',
                    'ผู้ที่มีภาวะความดันโลหิตสูงเรื้อรัง ติดสุราเรื้อรัง มักจะมีอาการรุนแรงกว่าคนทั่วไป',
                  ] },
                ] },
              { sub: 'การสำรวจเชื้อในสัตว์',
                body: [
                  { table: {
                    headers: ['เขต', 'จังหวัด', 'ชนิดสัตว์', 'จำนวน', 'จำนวนบวก', 'ร้อยละ'],
                    rows: [
                      ['1', 'กรุงเทพฯ', 'โคเนื้อ', '15', '14', '93'],
                      ['1', 'กรุงเทพฯ', 'สุกร', '30', '2', '7'],
                      ['2', 'ชลบุรี', 'โคเนื้อ', '30', '27', '90'],
                      ['2', 'ชลบุรี', 'สุกร', '60', '8', '13'],
                      ['3', 'บุรีรัมย์ สุรินทร์', 'โคเนื้อ', '17', '15', '88'],
                      ['3', 'บุรีรัมย์ สุรินทร์', 'สุกร', '30', '13', '43'],
                      ['4', 'มุกดาหาร', 'โคเนื้อ', '16', '14', '88'],
                      ['4', 'มุกดาหาร', 'สุกร', '30', '11', '37'],
                      ['5', 'เชียงใหม่', 'โคเนื้อ', '27', '18', '67'],
                      ['5', 'เชียงใหม่', 'สุกร', '34', '4', '12'],
                      ['6', 'ตาก พิจิตร พิษณุโลก', 'โคเนื้อ', '15', '14', '93'],
                      ['6', 'ตาก พิจิตร พิษณุโลก', 'สุกร', '66', '7', '11'],
                      ['7', 'ราชบุรี', 'โคเนื้อ', '17', '7', '41'],
                      ['7', 'ราชบุรี', 'สุกร', '31', '0', '0'],
                      ['8', 'พังงา พัทลุง', 'โคเนื้อ', '29', '26', '90'],
                      ['8', 'พังงา พัทลุง', 'สุกร', '30', '0', '0'],
                      ['8', 'พังงา พัทลุง', 'กระบือ', '22', '17', '77'],
                      ['9', 'สงขลา', 'โคเนื้อ', '24', '24', '100'],
                      ['9', 'สงขลา', 'สุกร', '30', '13', '43'],
                    ],
                  } },
                  { bullets: [
                    'จำนวนบวก ตรวจด้วยวิธี **MAT** ผลบวก คือ **Titer ≥ 1:100**',
                    'พบ Ab ในโคเนื้อทุกเขตปศุสัตว์ **84% (159/190)** สำหรับสุกรพบทุกเขต ยกเว้นเขต **7 และ 8**',
                    'ที่มา: Duangjai et al. NAIH (2017-2019)',
                  ] },
                ] },
              { sub: 'การระบาดใหญ่ และการระบาดเล็ก ๆ',
                body: [
                  { bullets: [
                    '**การระบาดใหญ่มีกลุ่มเสี่ยงกว่า 100 คน** — วิเคราะห์พื้นที่เสี่ยงที่ประชาชนมีแผนทำกิจกรรมลอกแหล่งน้ำตามโครงการฯ ของเกษตรจังหวัด',
                    '**การระบาดใหญ่มีกลุ่มเสี่ยงกว่า 100 คน** — ประสานขอความร่วมมือผู้ว่าราชการจังหวัด ประชุมเจ้าหน้าที่ในพื้นที่เสี่ยงให้มีการปรับปรุงสิ่งแวดล้อมในชุมชนบริเวณแหล่งน้ำก่อนกิจกรรมลอกแหล่งน้ำ',
                    '**การระบาดเล็ก ๆ หรือลักษณะแบบกระจัดกระจาย** — เจ้าหน้าที่สาธารณสุขในพื้นที่ควรวิเคราะห์ข้อมูลการพบผู้ป่วยตามแนวคิด 5 มิติ เพื่อพิจารณาพื้นที่เสี่ยง กลุ่มเสี่ยง',
                    '**การระบาดเล็ก ๆ หรือลักษณะแบบกระจัดกระจาย** — ควรมีป้ายประชาสัมพันธ์การห้ามใช้น้ำ ปรับปรุงแหล่งน้ำ โดยตัดหญ้าบริเวณรอบสระ สร้างชานตักน้ำ',
                    '**การระบาดเล็ก ๆ หรือลักษณะแบบกระจัดกระจาย** — ค้นหาแหล่งรังโรคในสัตว์ ถ้าพบสัตว์ที่สงสัยให้เก็บฉี่สัตว์ส่งตรวจโดยประสานกับหน่วยงานปศุสัตว์ในพื้นที่',
                  ] },
                ] },
              { sub: 'HOW TO AVOID THE OUTBREAK OF LEPTOSPIROSIS IN HUMAN? — การระบาดในช่วงน้ำท่วม',
                body: [
                  { bullets: [
                    'สสจ. ประสานหน่วยงานที่เกี่ยวข้องในการติดตามการพยากรณ์น้ำท่วมและแจ้งเตือนประชาชน เพื่อให้ประชาชนเตรียมอุปกรณ์ป้องกันร่างกาย',
                    'ประชาสัมพันธ์เกี่ยวกับโรคที่มากับน้ำท่วมให้ประชาชนเข้าใจถึงอาการของโรค รวมทั้งแจ้งแพทย์ให้ตระหนักถึงการระบาดของโรค',
                    'เมื่อน้ำเริ่มลง ควรรอให้น้ำลงจนหมด และโคลนเริ่มแห้ง จึงทำความสะอาดบ้านที่อยู่อาศัย ไม่ควรทำความสะอาด ขุดโคลนระหว่างที่น้ำไม่ลดทั้งหมด',
                    'ควรทำความสะอาดบ้านโดยสวม ถุงมือ รองเท้าบู๊ต',
                    'แจ้งเตือนให้ประชาชนหลีกเลี่ยงสัมผัสหนู',
                    'เมื่อมีรายงานผู้ป่วยสงสัย ทีม **SRRT** ดำเนินการสอบสวนโรคและค้นหาผู้ป่วยรายอื่นในชุมชนทันที',
                  ] },
                ] },
              { sub: 'ความยากในการสอบสวน Leptospirosis',
                body: [
                  { bullets: [
                    '**กำหนดนิยามผู้ป่วย** — อาการของโรคไม่มีความจำเพาะ มีความคล้ายคลึงกับโรคหลายชนิด',
                    '**กำหนดนิยามผู้ป่วย** — ความไว ความจำเพาะ ของ Test ยังเป็นปัญหาสำคัญในการช่วยการวินิจฉัยโรค',
                    '**สร้างสมมติฐานการเกิดโรค** — ปัจจัยเสี่ยงส่วนใหญ่ มักเป็นกิจกรรมที่ดำเนินเป็นประจำในชีวิตประจำวัน',
                    '**สร้างสมมติฐานการเกิดโรค** — ระยะฟักตัวของโรคมีระยะเวลาหลายสัปดาห์',
                    '**แนะนำและดำเนินการควบคุมและป้องกันโรค** — มีสัตว์ที่เป็นแหล่งรังโรคหลายชนิด',
                  ] },
                ] },
            ] },
          { sub: 'นโยบายการป้องกันควบคุมโรค (ไม่ได้ระบุชื่อโรค)',
            body: [
              { callout: 'นโยบายการป้องกันควบคุมโรค: **ลดโรค ลดตาย**', kind: 'tip' },
              { bullets: [
                '1) เฝ้าระวัง และชี้เป้าเตือนภัยพื้นที่เสี่ยง',
                '2) สื่อสารความเสี่ยงเชิงรุก',
                '3) จัดการสุขาภิบาลและสิ่งแวดล้อมในชุมชน',
                '4) คัดกรอง วินิจฉัย และดูแลรักษาผู้ป่วยได้อย่างถูกต้องเหมาะสม',
                '5) เร่งรัดการควบคุมโรคในพื้นที่ระบาด',
              ] },
            ] },
          { sub: 'Rabies',
            body: [
              { sub: 'นักเดินทาง-Human rabies (2013-2019)',
                body: [
                  { bullets: [
                    'Kuwait, Israel, US, Netherlands และ Qatar รับเชื้อจาก **India**',
                    'USA, Taiwan และ Norway รับเชื้อจาก **Philippines**',
                    'Spain, UK และ Saudi Arabia รับเชื้อจาก **Morocco**',
                    'France รับเชื้อจาก **Mali**, **Sri Lanka** และ **Bangladesh**',
                    'South Africa รับเชื้อจาก **Zimbabwe**; Italy รับเชื้อจาก **Tanzania**; Netherlands รับเชื้อจาก **Haiti**; USA รับเชื้อจาก **Guatemala**; Hongkong รับเชื้อจาก **Indonesia**; Qatar รับเชื้อจาก **Nepal**',
                  ] },
                ] },
              { sub: 'ประเด็นข้อค้นพบที่สำคัญในการตรวจราชการแบบบูรณาการ — โครงการสัตว์ปลอดโรค คนปลอดภัย จากโรคพิษสุนัขบ้า',
                body: [
                  { bullets: [
                    '**01** — สัตวแพทย์ประจำมีจำนวนจำกัดและมีภารกิจในงานด้านอื่น ๆ ทำให้การควบคุมประชากรสัตว์จรจัดยังไม่ครอบคลุม',
                    '**02** — ประชาชนยังขาดความรู้ความเข้าใจในการได้รับวัคซีนที่ถูกต้อง ครบถ้วนทั้งของสัตว์และคน',
                    '**03** — การควบคุมและป้องกันโรคพิษสุนัขบ้าทั้งในคนและในสัตว์ของจังหวัดที่มีพรมแดนติดประเทศเพื่อนบ้านทำได้ลำบาก',
                    '**04** — การประชาสัมพันธ์เรื่องพิษสุนัขบ้า อาจยังเข้าถึงแรงงานต่างด้าวได้ไม่ครบทั้งหมด',
                    '**05** — สถานสงเคราะห์สัตว์ของอปท มีสถานที่และบุคลากรในการดูแลจัดการสวัสดิภาพสัตว์ไม่เพียงพอต่อจำนวนสุนัขและแมวจรจัดในพื้นที่',
                  ] },
                ] },
              { sub: 'หลักเกณฑ์พื้นที่ปลอดโรคพิษสุนัขบ้าของประเทศไทย',
                body: [
                  { bullets: [
                    'พื้นที่ที่สามารถผ่านเกณฑ์ฯ ได้นั้น จะต้องมีผลการดำเนินงานผ่านเกณฑ์ **6 ข้อ**',
                    '**1. โรคพิษสุนัขบ้าในคน** — ไม่มีผู้เสียชีวิตในพื้นที่มากกว่า 2 ปี ติดต่อกัน; ผู้เสียชีวิตด้วยโรคไข้สมองอักเสบต้องได้รับการวินิจฉัย ทุกราย; มีการติดตามผู้สัมผัสสัตว์ยืนยันให้รับวัคซีน 100%',
                    '**2. โรคพิษสุนัขบ้าในสัตว์** — มีการเฝ้าระวังทั้งเชิงรับและเชิงรุก; ไม่พบสัตว์พบเชื้อโรคพิษสุนัขบ้าในพื้นที่มากกว่า 2 ปี ติดต่อกัน',
                    '**3. การสำรวจสุนัขและแมว** — มีการสำรวจครอบคลุม; มีการบริหารจัดการสัตว์ที่ไม่มีเจ้าของในพื้นที่',
                    '**4. การฉีดวัคซีนป้องกันโรคในสัตว์** — ฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าให้สัตว์ในพื้นที่ มากกว่าร้อยละ 80 ของจำนวนประชากรสัตว์',
                    '**5. การควบคุมจำนวนประชากรสัตว์** — มีการทำหมันสุนัขในพื้นที่; มีการขึ้นทะเบียนสุนัขมากกว่า 80% ของจำนวนสุนัขในพื้นที่; มีการบริหารจัดการสุนัขและแมวไม่มีเจ้าของ; มีแผนการเฝ้าระวังการเคลื่อนย้ายสัตว์',
                    '**6. ความยั่งยืนของการปลอดโรคพิษสุนัขบ้า** — มีการบูรณาการการดำเนินงานระหว่างหน่วยงาน; มีการสื่อสารความเสี่ยงและประชาสัมพันธ์; ประชาชนมีความรู้เรื่องโรคพิษสุนัขบ้า',
                  ] },
                ] },
              { sub: 'Rabies-free Status in Japan for 65 Years',
                body: [
                  { bullets: [
                    '**Dog registrations**',
                    '**Annual rabies vaccination**',
                    '**Surveillance**',
                    '**Strict quarantine on imported animals**',
                  ] },
                ] },
              { sub: 'What have we learned?',
                body: [
                  { callout: '**Trusted multi-sectoral collaboration**', kind: 'tip' },
                  { bullets: [
                    'ภาคส่วน: **Human sectors**, **Universities**, **Animal sectors**, **Office of Prime Minister**, **Local Administration sectors**',
                    'องค์ประกอบ: Research and Innovations; Animal Rabies Surveillance Prevention and Control; Public Relations; Monitoring and Evaluation; Human Rabies Surveillance Prevention and Control; Practice and Fund',
                  ] },
                ] },
              { sub: 'Risk of zoonotic diseases along border zones',
                body: [
                  { bullets: [
                    '**Rabies** — Reported of rabid animals; Reported of human cases',
                    'พบการระบาดของ rabies ในสัตว์ที่ **Chiang Rai** (along cross border) ในปี **2012 and 2013**',
                    'ผู้ป่วยคน **2 ราย** จาก **Laos** (resided along cross border) เข้ารับการรักษาที่โรงพยาบาล **Loei** และ **Nong Khai** ในปี **2013**',
                  ] },
                ] },
            ] },
          { sub: 'One Health, SRRT, ThaiFlu Project และ poultry value chain',
            body: [
              { sub: 'One Health — Integrative health risk management',
                body: [
                  { bullets: [
                    '**ONE HEALTH**: HUMAN HEALTH, ANIMAL HEALTH, ENVIRONMENTAL HEALTH และ **SUSTAINABILITY**',
                    'หัวข้อที่ล้อมรอบ One Health: water sanitation & hygiene (WASH), food safety & security, agriculture, equity, climate change, resource management, urbanisation, energy, ecosystem services',
                    '**INTEGRATIVE HEALTH RISK MANAGEMENT**: PREVENTION, INTERVENTION, RECOVERY/REHABILITATION',
                  ] },
                ] },
              { sub: 'One Health MOUs',
                body: [
                  { bullets: [
                    'ลงนามโดย **8 organizations** (Ministry level) และ **Areas of Collaboration** มีดังนี้',
                    'Information sharing of emerging diseases, zoonoses and any suspicious health threats',
                    'Integrated working at all levels',
                    'Develop young generation and support personnel using One Health Approach',
                    'Increase level of One Health Attitude at community level',
                  ] },
                ] },
              { sub: 'SRRT and H5N1 Avian Influenza Control',
                body: [
                  { bullets: [
                    'องค์ประกอบ: **Hospital**, **Active case finding**, **Animal team**, **Laboratory**, **Pathological Examination**, **Wild bird surveillance**',
                    'บุคลากร: MD, DVM, Livestock and Health Officers, Lab Scientists, Pathologists, Wildlife Experts',
                  ] },
                ] },
              { sub: 'ThaiFlu Project = One Health Collaboration',
                body: [
                  { bullets: [
                    'ผู้ร่วมโครงการ: Thai Ministry of Public Health (MoPH) — กรมควบคุมโรค Department of Disease Control, CDC Thailand, Thai Department of Livestock Development (DLD), Johns Hopkins Bloomberg School of Public Health, Mahidol University Faculty of Veterinary Science, Mae Fah Luang University Faculty of Public Health',
                  ] },
                ] },
              { sub: 'Human-Poultry Interface & Avian Influenza',
                body: [
                  { bullets: [
                    'Emerging influenza virus → **Poultry** ↔ **Poultry Sector Workers** → **General Community** และ **Poultry Sector Workers**',
                  ] },
                ] },
              { sub: 'Poultry Value Chain in Thailand',
                body: [
                  { bullets: [
                    '**Producer** → **Trader** → **Processor** → **Retailer** → **Consumer**',
                    '**Producer**: Backyard farmers (small, medium, large); Biosecurity certified farmers; Commercial/corporate contract farmers',
                    '**Trader**: Poultry traders (for meat/eggs); Cock traders (cock fighting)',
                    '**Processor**: Butchers; Slaughterhouse workers; Other informal processors',
                    '**Retailer**: Live bird markets (LBMs); Fresh markets; Fresh shops; Supermarkets',
                    '**Consumer**: Poultry sector workers; General community',
                    'ทุกกลุ่มเป็น **Study Participants** — Varying Avian Influenza Risk',
                  ] },
                ] },
            ] },
          { sub: 'Costs of selected zoonotic disease outbreaks',
            body: [
              { bullets: [
                'ต้นทุนที่ระบุตัวเลข (US $ billion): **BSE (UK) 1986** = 16 (16,396,000,000); **HPAI (Asia) 2004** = 20 (20,000,000,000); **BSE (USA) 2004** = 11 (11,000,000,000); **RVF (Kenya, Somalia, Tanzania) 2006** = 0 (30,000,000)',
                'เหตุการณ์อื่นในรายการ: SARS (Asia, Canada, rest of the world) 2002; Plague (India) 1994; Nipah virus (Malaysia) 1998; HPAI (Europe) 2005; WNV 1999',
              ] },
            ] },
          { sub: 'Nipah virus',
            body: [
              { sub: 'Contagion the Movie: How real was it?',
                body: [
                  { bullets: [
                    '**Nipah virus** คือไวรัสโรคระบาดจริงที่อยู่เบื้องหลังภาพยนตร์เรื่อง Contagion (The real pandemic virus behind the movie Contagion)',
                  ] },
                ] },
              { sub: 'Nipah virus in Malaysia and Singapore',
                body: [
                  { bullets: [
                    'จาก **Tambun (Ipoh)** Nipah แพร่ผ่านสุกรที่ติดเชื้อไปยังฟาร์มใน **Penang**, **Perak**, **Selangor**, **Malacca**, **Negri Sembilan** และ **Johor**',
                    'เกษตรกรใน Tambun ทำ fire sales เพื่อกำจัดสุกร',
                  ] },
                ] },
              { sub: 'Reservoir',
                body: [
                  { bullets: [
                    '**Flying foxes (fruit bats)** — carry the virus; are not affected',
                    'Virus found in: **urine** และ **partially eaten fruit (saliva)**',
                  ] },
                ] },
              { sub: 'A possible transmission cycle for Nipah virus (Malaysian Singapore outbreak 1998-1999)',
                body: [
                  { bullets: [
                    '**Reservoir, Amplification and dissemination** = **MEGACHIROPTERA**',
                    '**Amplification** = **PIGS** → **ZOONOSIS**',
                  ] },
                ] },
              { sub: 'Tangail Nipah outbreak 2005 (N=11)',
                body: [
                  { bullets: [
                    'Nipah cases were more likely than controls to have drunk **raw date palm sap**',
                    '**Odds Ratio 7.0**, 95% Confidence Interval 1.6, 305',
                    'Fruit bats are a nuisance: 1) Drink juice 2) Defecate into juice 3) Occasionally drown in the pot',
                  ] },
                ] },
              { sub: 'NIPAH — เส้นทางการติดต่อสู่คน',
                body: [
                  { bullets: [
                    '**ผ่านสุกร**: Flying foxes forage in fruit trees on pig farms → Pigs exposed to material dropped by bats → Rapid pig-to-pig transmission (asymptomatic infection & trade facilitate spread) → People infected through close contact with infected pigs',
                    '**ผ่าน date palm sap**: Flying foxes feed from date palm sap collection pots → People consume contaminated date palm sap',
                    'ติดต่อจากคนสู่คน: People infected through close contact with unwell patients & their secretions',
                    '**ผ่านม้า**: Unidentified spillover event from putative bat host species → People infected following contact with unwell horses or handling/ consumption of horse meat → People infected following contact with an unwell patient',
                  ] },
                ] },
            ] },
          { sub: 'Influenza A และ H5N1',
            body: [
              { sub: 'Influenza A Viruses',
                body: [
                  { bullets: [
                    '**H1-18; N1-11**',
                    '**Natural Host**: Wild Water fowl, Duck etc. — **H1-16 N1-9**, **Low Pathogenic** (H: Hemagglutinin, N: Neuraminidase)',
                    '**H5N1: Highly Pathogenic**',
                    '**Chicken**: H1-7, 9-11; N1-4, 6-9; H5N1, H7N7, H7N9',
                    '**Quail**: H9N2',
                    '**Seal**: H7N7, H4N5, H3N2',
                    '**Horse**: H7N7, H3N8',
                    '**Dog, Greyhound**: H3N8',
                    '**Ferret**: H10N4, H5N1, H1N1, H3N2',
                    '**Whale**: H1N3, H13N2, H13N9',
                    '**Pig** (Intermediate Host): H1N1, H1N2, H3N1, H3N2, H3N1, H3N3, H3N8, H4N6, H5N1, H5N2, H9N2',
                    '**Human**: H1N1, H2N2, H3N2, H5N1, H9N2, H7N7, H7N9; **Pandemic** H1N1 2009',
                    '**Cat**: H5N1',
                    '**Direct Transmission**: Chicken, Quail → Human; **Host Restriction**: Natural Host (Wild Water fowl, Duck etc.) → Human',
                  ] },
                ] },
              { sub: 'Avian Influenza A(H5N1) in Cambodia, 2023',
                body: [
                  { bullets: [
                    'สมาชิกครอบครัว 2 คน (พ่อและลูกสาว) ติดเชื้อ **H5N1** และลูกสาวเสียชีวิต',
                    'ผู้สัมผัส **11 คน** บางคนมีอาการ ตรวจแล้วผลเป็นลบ ตามที่ W.H.O. รายงาน',
                  ] },
                ] },
            ] },
          { sub: 'SARS-CoV-2',
            body: [
              { sub: 'Possible role of animals in the transmission of SARS-CoV-2',
                body: [
                  { bullets: [
                    '**Bat** = Natural host; **Snake** และ **Pangolin** = potential intermediate hosts',
                    '**Natural infection**: Farmed animals — **Mink** (Animal-to-human transmission); Wild animals — **Tiger**, **Lion**; Pet animals — **Cat**, **Dog**',
                    '**Experimental infection**: Hamster, Mouse, Treeshrew, Cat, Ferret, Primates; ลูกศร Experimental infection ที่ไปยัง Pig, Chicken, Duck, Turkey, Rabbit, Guinea pig ถูกกากบาท (X)',
                    'ส่วนประกอบของไวรัสที่ระบุ: Spike (S), Nucleocapsid (N), Membrane (M), Envelope (E), RNA viral genome',
                  ] },
                ] },
              { sub: 'Potential transmission routes from SARS-CoV-2',
                body: [
                  { bullets: [
                    '**Zoonotic**: Foodborne? Close contact?',
                    '**Human-to-human**: Small droplets <5 – <50 µm; Larger droplets 50 – 100 µm; Direct contact; Direct contact with contaminated surfaces',
                    'เส้นทางที่ระบุพร้อมเครื่องหมาย ?: Accidental laboratory exposure?, Blood transfusion?, Organ transplantation?, Transplacental?, Perinatal?',
                  ] },
                ] },
            ] },
          { sub: 'Health security preparedness — IHR (2005) และ JEE',
            body: [
              { sub: 'Why Health Security Preparedness matters?',
                body: [
                  { bullets: [
                    '**COVID-19 PANDEMIC** ตามด้วย: ECONOMIC PROBLEMS, SOCIAL PROBLEMS, WEAK GOVERNANCE, STRAINED HEALTH SYSTEMS, INEQUALITIES',
                  ] },
                ] },
              { sub: 'The 2nd IHR Joint External Evaluation in Thailand',
                body: [
                  { bullets: [
                    '**The 2nd IHR Joint External Evaluation** in Thailand: **31 October - 4 November 2022**',
                    '**Joint External Evaluation Tool, Third Edition** (INTERNATIONAL HEALTH REGULATIONS (2005), World Health Organization)',
                  ] },
                ] },
              { sub: 'JEE first edition เทียบกับ third edition',
                body: [
                  { bullets: [
                    'คะแนน **JEE, first edition** (Score 2017) เทียบกับ **JEE, third edition** (Score 2022) ตามหัวข้อที่วางคู่กันในแต่ละแถว; คะแนนในช่องเรียงจากบนลงล่าง และหลายหัวข้อมีจำนวนช่องคะแนนไม่เท่ากันระหว่างสองฉบับ จึงไม่ได้จับคู่คะแนนรายช่อง; — คือไม่มีหัวข้อคู่กันในแถวนั้น',
                  ] },
                  { table: {
                    headers: ['JEE, first edition', 'Score (2017)', 'JEE, third edition', 'Score (2022)'],
                    rows: [
                      ['P1. National legislation, policy and financing', '5, 4', 'P1. Legal instruments', '5, 4'],
                      ['—', '—', 'P2. Financing', '4, 4'],
                      ['P2. IHR coordination, communication and advocacy', '4', 'P3. IHR coordination, National IHR Focal Point functions and advocacy', '4, 5, 5'],
                      ['P3. Antimicrobial resistance', '4, 3, 3, 2', 'P4. Antimicrobial resistance', '5, 4, 4, 4, 4'],
                      ['P4. Zoonotic diseases', '4, 4, 4', 'P5. Zoonotic diseases', '4, 4, 5'],
                      ['P5. Food safety', '3', 'P6. Food safety', '4, 4'],
                      ['P6. Biosafety and biosecurity', '4, 4', 'P7. Biosafety and biosecurity', '4, 4'],
                      ['P7. Immunization', '5, 5', 'P8. Immunization', '3, 5, 5'],
                      ['D1. National laboratory system', '4, 4, 4, 3', 'D1. National laboratory system', '4, 4, 4, 5'],
                      ['D2. Real-time surveillance', '4, 4, 4, 4', 'D2. Surveillance', '4, 5, 5'],
                      ['D3. Reporting', '3, 3', '—', '—'],
                      ['D4. Workforce development', '4, 5, 3', 'D3. Human resource', '4, 4, 4, 5'],
                      ['R1. Preparedness; R2. Emergency response operations', 'R1: 4, 2; R2: 3, 3, 3, 3', 'R1. Health emergency management', '4, 4, 4, 4, 4, 4'],
                      ['R3. Linking public health and security authorities', '4', 'R2. Linking public health and security authorities', '4'],
                      ['—', '—', 'R3. Health services provision', '5, 4, 4'],
                      ['R4. Medical countermeasures and personnel deployment', '4, 4', 'R4. Infection prevention and control', '4, 4, 4'],
                      ['R5. Risk communication', '4, 4, 4, 4, 4', 'R5. Risk communication and community engagement', '5, 5, 4'],
                      ['PoE. Points of entry', '4, 3', 'PoE. Points of entry and border health', '4, 4, 3'],
                      ['CE. Chemical events', '4, 4', 'CE. Chemical events', '4, 5'],
                      ['RE. Radiation emergencies', '4, 4', 'RE. Radiation emergencies', '4, 5'],
                    ],
                  } },
                ] },
              { sub: 'STRONG NETWORK AND COLLABORATION',
                body: [
                  { bullets: [
                    '**STRONG NETWORK AND COLLABORATION** to strengthen preparedness for and response to disease and health threats',
                    '**National Strategic Plan of EID**, **Training Project** (FETN, FETP-V, FETP-W), **Multisectoral Networks**, **The National Strategic sub-committee on One Health** และ **Collaboration Platform** เชื่อมเข้าสู่ **Thailand 20 years Strategy**',
                    '**National Strategic Plan of EID** เชื่อมกับ MoA, MoF, MoD, MoNRE, MoFA, MoSci, MoEDU, NGO, MoPH',
                    '**Multisectoral Networks**: Detection, Surveillance, Response, Promotion',
                    '**TPEIR** เชื่อม Training Project กับ **SEAOHUN** และทั้งสองเชื่อมไปยัง Multisectoral Networks',
                    '**Collaboration Platform** — Asia Pacific region: LMI, MBDS, GMS, ASEAN, APEC, CMECS; Global: WHO, FAO, OIE, GHSA, WTO, UN',
                    'คำเต็มของตัวย่อ (หน่วยงาน): MoA - Ministry of Agriculture and Cooperatives; MoF - Ministry of Finance; MoD - Ministry of Defence; MoNRE - Ministry of Natural Resources and Environment; MoFA - Ministry of Foreign Affairs; MoSci - Ministry of Higher Education, Science, Research and Innovation; MoEDU - Ministry of Education; MoPH - Ministry of Public Health; NGO - Non-governmental organizations',
                    'คำเต็มของตัวย่อ (การฝึกอบรม): FETN - Field Epidemiology Training Network; FETP-V - Field Epidemiology Training Program for Veterinarians; FETP-W - Field Epidemiology Training Program for Wildlife',
                  ] },
                ] },
              { sub: 'ข้อความปิดท้าย',
                body: [
                  { callout: '**Nothing on earth is more International than Disease** — Keerti Bhusan Pradhan, WHO', kind: 'tip' },
                ] },
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
    summary: 'Protozoal zoonoses — 4 major: Toxoplasmosis, Giardiasis, Cryptosporidiosis, Leishmaniosis. 4 types of parasitic zoonoses: Direct/Cyclo/Meta/Sapro. Sources: ground/water-borne/handling pets/meat-borne/vector-borne.',
    sections: [
      {
        heading: 'Protozoal Zoonoses — course intro',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.1',
        body: [
          { bullets: [
            'อาจารย์: **Woraporn Sukhumavasi**, DVM, PhD',
            'Parasitology Unit, Department of Pathology, Faculty of Veterinary Science, Chulalongkorn University',
            'Email: vetkwan@hotmail.com',
            '⭐ **สรุปข้อสอบเก่า Vet 82 ครอบคลุมหัวข้อนี้มาก** — ดู "Zoonosis Final Vet82 Myco Protozoa ตรงมาก.pdf"',
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
        heading: 'Toxoplasmosis ถึง Sarcocystosis — รายโรคโปรโตซัว',
        source: '6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.4-22',
        body: [
          { sub: 'Toxoplasmosis',
            body: [
              { sub: 'Case report — ฝีในสมองจากการเลี้ยงแมว',
                body: [
                  { bullets: [
                    'ผู้ป่วยชายไทยอายุ **49 ปี** มาด้วยแขนขาข้างซ้ายอ่อนแรง 3 สัปดาห์ มีไข้ต่ำๆ ปวดหัวบ้าง ตรวจพบ**ฝีในสมอง**จาก **Toxoplasmosis**',
                    'ผู้ป่วยเลี้ยงแมว 2 ตัว แมวนอนในห้องนอนกับผู้ป่วย ผู้ป่วยทำความสะอาดกระบะทราย ตักอุจจาระแมวไปทิ้งโดยไม่ได้สวมถุงมือเป็นเวลา **9 เดือน**',
                    'แมวคงรับเชื้อโปรโตซัวชื่อ *Toxoplasma* (ท็อกโซพลาสมา) จากการไปกินอุจจาระของแมวตัวอื่น เชื้อนี้จะเติบโตอยู่ในลำไส้แมว โดยแมวสบายดี ไม่ป่วย แล้วขับถ่ายออกมากับอุจจาระ',
                    'คนรับเชื้อผ่านทางมือเวลาใช้ที่ตักทรายที่ปนเปื้อนอุจจาระแมว แล้วไปจับอาหารใส่ปาก เชื้อนี้จะทะลุผ่านผนังลำไส้เข้าสู่ระบบไหลเวียนเลือดไปตามอวัยวะต่างๆ เช่น สมอง ตา กล้ามเนื้อ',
                    'ภูมิคุ้มกันปกติ → เชื้ออยู่เงียบๆ ไม่ทำอันตรายต่อร่างกายของคน; ภูมิคุ้มกันบกพร่องอย่างผู้ป่วยรายนี้ที่ติดเชื้อ **เอชไอวี** → เชื้อแบ่งตัวทำลายเนื้อสมองเกิดเป็น**ฝีหลายตำแหน่ง** (ผู้ป่วยได้รับยาต้านไวรัสและยารักษาเชื้อท็อกโซพลาสมา แล้วอาการอ่อนแรงดีขึ้นและฝีในสมองเล็กลง)',
                    'หญิงตั้งครรภ์ต้องระวังเป็นพิเศษ เพราะถ้ารับเชื้อ จะไปติดทารกในครรภ์ อาจแท้ง คลอดก่อนกำหนด ทารกที่คลอดอาจผิดปกติ',
                  ] },
                ] },
              { sub: 'Facts: Toxoplasmosis',
                body: [
                  { bullets: [
                    '**A common infection** among people with HIV and AIDS',
                    'Usually affect the **CNS** including brain',
                    'Many people infected with Toxo have **no symptoms**',
                    'People with HIV or AIDS often get ill from Toxo infection — the most common: **headache, confusion, fever**; other symptoms: **seizures, poor coordination, nausea**',
                  ] },
                ] },
              { sub: 'Biology: *Toxoplasma gondii*',
                body: [
                  { bullets: [
                    '**Consumption**: undercooked meat; contamination of sporulated oocyst',
                    'ระยะ: **Tachyzoite**, **Bradyzoite-containing tissue cyst**, **Oocyst**',
                  ] },
                ] },
              { sub: 'Case: What is your diagnosis?',
                body: [
                  { bullets: [
                    '**Signalment**: 3 month-old kitten, DSH, intact',
                    '**History**: caught and ate a mouse last week',
                    '**Physical exam**: Temp. 103° F, lymphadenopathy, icterus; ตามด้วย **fecal exam**',
                  ] },
                ] },
              { sub: 'Dx: *Toxoplasma gondii*',
                body: [
                  { bullets: [
                    '**Physical exam**',
                    '**Fecal examination** — not practical as DDx is required; short shedding period',
                    '**Laboratory test** — serology test: **MAT**',
                  ] },
                ] },
              { sub: 'Oocysts in the fresh feces',
                body: [
                  { table: {
                    headers: ['Oocysts in the fresh feces', 'Dog', 'Cat'],
                    rows: [
                      ['Unsporulated large oocysts', '*I. canis*', '*I. felis*'],
                      ['Unsporulated medium oocysts', '*I. ohioensis*-like', '*I. rivolta*'],
                      ['Unsporulated small oocysts', '*H. heydorni*, *N. caninum*', '*H. hammondi*, *B. darlingi*, *T. gondii*'],
                      ['Sporulated small oocysts or sporocysts', '*Sarcocystis* spp.', '*Sarcocystis* spp.'],
                      ['Sporulated very small oocysts without sporocysts', '*Cryptosporidium* spp.', '*Cryptosporidium* spp.'],
                    ],
                  } },
                ] },
              { sub: 'Antemortem definitive Dx: feline toxoplasmosis',
                body: [
                  { bullets: [
                    '**The organism is demonstrated** — uncommon due to sublethal disease',
                    '**Bradyzoites or tachyzoites** are rarely detected in tissues, effusions, BAL, aqueous humor, or CSF',
                    '**Feces**: 10x12 µm oocyst in cats with diarrhea — DDx with *Besnoitia* and *Hammondia*',
                    '**PCR** detecting *T. gondii* from feces',
                    'Cat only shed significant numbers of oocysts **once** in their lives after primary infection',
                    'The shedding phase is only **7-10 days** — millions of oocysts are passed',
                    'Requires optimal conditions for couple days to develop into infective stage (oxygen, humidity, temp.)',
                    '**10x12 µm sporulated oocyst = infective stage**',
                  ] },
                ] },
              { sub: 'PCR: feline toxoplasmosis',
                body: [
                  { bullets: [
                    '*T. gondii* DNA can be amplified from the **blood of healthy cats**',
                    '**Positive PCR results do not correlate to clinical disease**',
                    'Most frequently used with tissues or with aqueous humor to confirm organisms seen',
                    'PCR (Polymerase Chain Reaction): **30 - 40 cycles of 3 steps** — denaturation 1 minute 94 °C → annealing 45 seconds 54 °C (forward and reverse primers) → extension 2 minutes 72 °C (only dNTP\'s)',
                  ] },
                ] },
              { sub: 'บทบาทของแมวใน Toxoplasmosis',
                body: [
                  { bullets: [
                    '**Toxoplasmosis** หรือ **โรคขี้แมว** เป็นโรคสัตว์สู่คนที่ติดต่อจากแมวได้ ที่ถูกกล่าวถึงมากที่สุดโรคหนึ่ง โดยเฉพาะหญิงตั้งครรภ์ที่มักได้ยินคำเตือนให้ระมัดระวังเป็นพิเศษ แต่มีความเข้าใจผิดไม่น้อยเกี่ยวกับโรคและบทบาทของแมวในการก่อโรคในคน',
                    'สาเหตุคือ *Toxoplasma gondii* ซึ่งเป็นเชื้อโปรโตซัว โดยแมวและสัตว์ตระกูลแมวเป็น **definitive host** เชื้อต้องอาศัยทางเดินอาหารของแมวในการทำให้วงจรชีวิตสมบูรณ์',
                    'เมื่อแมวกินเชื้อระยะติดโรคเข้าไป เชื้อจะสืบพันธุ์แบบอาศัยเพศ แล้วปล่อยไข่ (**oocyst**) ปนออกมากับอุจจาระของแมว',
                    'อุจจาระแมวที่มี oocyst ติดต่อ**ไม่ได้ทันที** เพราะตัวอ่อนภายใน oocyst ต้องใช้เวลา **1-5 วัน** ในการพัฒนาให้เป็นระยะติดโรค (**sporulated oocyst**) ซึ่งต้องอาศัยอุณหภูมิ ความชื้น และออกซิเจนในระดับที่เหมาะสม',
                    'แม้แมวมีความสำคัญในวงชีวิตและระบาดวิทยาของการติดเชื้อ Toxoplasma แต่แมวมัก**ไม่มี**บทบาทสำคัญต่อการติดเชื้อในคน และความเสี่ยงต่อการติดโรคจากแมวสู่คนมี**น้อยมาก** — สาเหตุหลักของการติดเชื้อในคนมักมาจาก**การบริโภคเนื้อสุกรดิบหรือปรุงไม่สุกที่มีซีสต์ของเชื้อ**',
                    'การติดเชื้อ Toxoplasma แทบจะไม่เป็นสาเหตุให้เกิดโรคในแมว แต่อาการป่วยที่อาจพบ ได้แก่ มีไข้ เบื่ออาหาร น้ำหนักลด ปอดบวมทำให้หายใจลำบาก ตาอักเสบ ตับอักเสบทำให้มีภาวะดีซ่าน อาการทางระบบประสาท เช่น ชัก สั่น',
                    'อาการที่พบไม่บ่อย เช่น ต่อมน้ำเหลืองโต อาเจียน ท้องเสีย ปวดกล้ามเนื้อ',
                    'หากแมวมีภูมิคุ้มกันบกพร่องหรือไม่แข็งแรง การติดเชื้อ Toxoplasma อาจทำให้เกิดปัญหาได้: เช่นเดียวกับในคน หากภูมิคุ้มกันไม่สามารถตอบสนองต่อการติดเชื้อได้อย่างมีประสิทธิภาพ เชื้อสามารถแพร่กระจายไปตามอวัยวะต่างๆ และทำให้เกิดการอักเสบอย่างรุนแรงของอวัยวะภายใน และมีอาการผิดปกติได้',
                    'แมวที่ใช้ชีวิตอิสระ สามารถออกไปนอกบ้าน ชอบล่าเหยื่อ เช่น นก หนู และแมวที่กินเนื้อดิบหรือปรุงไม่สุก จะมีความเสี่ยงสูงต่อการติดเชื้อ',
                    'งานวิจัยแสดงว่าการสัมผัสแมวหรือการเป็นเจ้าของแมวไม่เพิ่มความเสี่ยงต่อการติดเชื้อ *T. gondii* ในคน เพราะโอกาสน้อยที่จะพบแมวที่เคยติดเชื้อแล้วปล่อย oocyst อยู่ และตรวจไม่พบ oocyst บนขนแมวแม้ว่าแมวตัวนั้นอยู่ในช่วงปล่อย oocyst ก็ตาม',
                    'เด็กที่เล่นดินหรือทรายที่อาจมี oocyst ปนเปื้อนอยู่ จะมีความเสี่ยงต่อการติดเชื้อ',
                  ] },
                ] },
              { sub: 'Prevention: toxoplasmosis',
                body: [
                  { bullets: [
                    '**Toxoplasmosis can be prevented** — people with HIV infection should be **tested for Toxo**',
                    'Toxo usually causes illness in people whose **CD4 count is below 100**',
                    '**TMP-SMX**, also known as Bactrim, Septra, or Cotrim, is the best drug for preventing Toxo',
                  ] },
                ] },
              { sub: 'ป้องกันการติดเชื้อจากอาหาร ดิน และน้ำ',
                body: [
                  { bullets: [
                    '**Do not eat undercooked or raw red meat** — inside temp. reaches **150°F (66°C)** or no longer pink in the center; **frozen for at least 24 hours**, smoked or cured',
                    'Chicken and eggs almost never contain Toxo but risk for other diseases if eating it raw',
                    '**Wash your hands** well after touching raw meat and after gardening, yard work, and other outdoor activities — สวมถุงมือเมื่อทำสวน และล้างมือให้สะอาดเสมอก่อนและหลังเตรียมอาหาร',
                    '**Wash all fruits and vegetables** well before eating them raw',
                    'ดื่มน้ำที่ต้มสุกหรือกรองแล้ว',
                    'ปิดกระบะทรายที่ใช้สำหรับเด็กเล่นเมื่อไม่ใช้ เพื่อป้องกันแมวมาถ่าย',
                  ] },
                ] },
              { sub: 'เจ้าของแมว — กระบะทรายและการเลี้ยงแมว',
                body: [
                  { bullets: [
                    'Take special care if you have a cat — **you do not need to give up your cat**',
                    'คนที่มีความเสี่ยงสูง (เช่น หญิงตั้งครรภ์ หรือคนที่มีภูมิคุ้มกันต่ำ รวมถึงเด็กเล็ก) ไม่ควรสัมผัสหรือจัดการกระบะทรายแมว — ให้คนที่ไม่ได้ติดเชื้อ HIV และไม่ได้ตั้งครรภ์ **change the litter box daily**',
                    'กำจัดอุจจาระแมวจากกระบะเป็นประจำ**ทุกวัน** — หลีกเลี่ยงการสัมผัสอุจจาระแมวขณะทำความสะอาดกระบะทราย ถ้าหลีกเลี่ยงไม่ได้ต้อง**สวมถุงมือ** และล้างมือด้วยสบู่และน้ำทันทีหลังเปลี่ยนทราย โดยเฉพาะก่อนเอามือมาจับปากหรือหยิบอาหาร',
                    'รองกระบะทรายด้วยแผ่นรอง และทำความสะอาดกระบะทรายเป็นครั้งคราวด้วยน้ำยาทำความสะอาด หรือลวกน้ำร้อน (ซึ่งสามารถฆ่า oocyst ได้)',
                    'กำจัดอุจจาระและทรายแมวอย่างปลอดภัย โดยใส่ในถุงพลาสติกและมัดให้แน่น ก่อนนำไปใส่ในถังขยะ',
                    '**Keep your cat indoors** to prevent from hunting',
                    'Feed your cat only cat food or **cook all meat thoroughly** before giving it to your cat — do not give your cat raw or undercooked meat',
                    'If you adopt or buy a cat, get one that is **healthy and at least 1 year old**',
                    '**Avoid stray cats and kittens** — more likely than other cats to be infected with Toxo',
                    'หากดูแลด้านสุขอนามัยเป็นประจำทุกวัน ก็สามารถลดความเสี่ยงต่อการติดเชื้ออื่นๆ จากแมว สัตว์เลี้ยงอื่น และจากสภาพแวดล้อมได้',
                  ] },
                ] },
              { sub: 'Seroprevalence ของ *T. gondii* ใน outdoor dogs and cats, Bangkok',
                body: [
                  { bullets: [
                    '**Dogs**: 7.9% (25/318; 95% CI: 4.9-10.8%) — risk factors identified were being a **mixed-breed** animal and living **totally outdoors**',
                    '**Cats**: 18.7% (95% CI: 14.4-23.0%) — **increasing age** was shown to be a risk factor in cats',
                    '**Seroconversion was not detected** and titers from positive animals remained constant over longitudinal study',
                  ] },
                ] },
            ] },
          { sub: 'Giardiasis',
            body: [
              { sub: 'Facts: *Giardia*',
                body: [
                  { bullets: [
                    '**Worldwide** and more prevalent in warm climates and in children',
                    '**Stages**: trophozoite and cysts',
                    '**Infective stage: cyst** — hardy and can survive several months in cold water',
                    'Cyst is infectious when passed in the stool or shortly afterward; trophozoites are also passed in stool but they do not survive in the environment',
                    '**Transmission**: ingestion of cysts — contaminated water, food; **fecal-oral route** (hands or fomites): person-to-person',
                  ] },
                ] },
              { sub: 'Proposed, existing species and genotypes of *Giardia*',
                body: [
                  { table: {
                    headers: ['Species', 'Hosts'],
                    rows: [
                      ['*G. duodenalis* (=Assemblage A)', 'Wide range of domestic and wild mammals including humans'],
                      ['*G. enterica* (=Assemblage B)', 'Humans and other primates, dogs, some species of wild mammals'],
                      ['*G. agilis*', 'Amphibians'],
                      ['*G. muris*', 'Rodents'],
                      ['*G. ardeae*', 'Birds'],
                      ['*G. psittaci*', 'Birds'],
                      ['*G. microti*', 'Rodents'],
                      ['*G. canis* (=Assemblage C/D)', 'Dogs, other canids'],
                      ['*G. cati* (=Assemblage F)', 'Cats'],
                      ['*G. bovis* (=Assemblage E)', 'Cattle and other hoofed livestock'],
                      ['*G. simondi* (=Assemblage G)', 'Rats'],
                    ],
                  } },
                ] },
              { sub: 'Pets vs *Giardia*',
                body: [
                  { bullets: [
                    'The risk of humans acquiring *Giardia* infection from dogs or cats is **small**',
                    'The exact type of *Giardia* that infects humans is usually **not the same type** that infects dogs and cats',
                    'If you own other household or exotic pets, please contact your veterinarian and seek further information, as some **rodents and other species can harbor human strains** of *Giardia*',
                  ] },
                ] },
              { sub: 'Prairie dogs vs *Giardia*',
                body: [
                  { bullets: [
                    'Detection of *Giardia duodenalis* **zoonotic assemblages AI and BIV** in pet prairie dogs (*Cynomys ludovicanus*) in Bangkok, Thailand',
                  ] },
                  { table: {
                    headers: ['Factor', 'Total number', 'Positive number: total intestinal parasites (%)', 'Positive number: *Giardia* spp. (%)', 'Positive number: coccidia (%)', 'Positive number: nematodes (%)', 'Positive number: amoeba (%)'],
                    rows: [
                      ['Gender: Female', '44', '14 (31.8%)', '3 (6.8%)', '5 (11.4%)', '1 (2.3%)', '1 (2.3%)'],
                      ['Gender: Male', '35', '11 (31.4%)', '8 (22.9%); p-value < 0.05', '5 (14.3%)', '3 (8.6%)', '1 (2.9%)'],
                      ['Age: <6 months', '39', '14 (35.9%)', '5 (12.8%)', '9 (23.1%)', '4 (10.3%)', '1 (2.6%)'],
                      ['Age: >6 months', '40', '8 (20.0%)', '6 (20.0%)', '1 (2.5%)', '0 (0.0%)', '1 (2.6%)'],
                      ['Total', '79', '25 (31.6%)', '11 (13.9%)', '10 (12.7%)', '4 (5.1%)', '2 (2.5%)'],
                    ],
                  } },
                ] },
              { sub: 'How long does *Giardia* survive in the environment?',
                body: [
                  { bullets: [
                    '**In the soil**: in cold temperatures (around 4°C/39.2°F) *Giardia* can survive for approximately **7 weeks (49 days)**; at room temperature (around 25°C/77°F) approximately **1 week (7 days)**',
                    '**Dry vs. moist**: in a dry, warm environment that experiences direct sunlight *Giardia* can survive for only **a few days**; in a moist, cool environment for up to **several weeks**',
                    '**Water**: below 10°C/50°F (for example, lake water or puddle water during the winter, refrigerated water) *Giardia* can survive for **1–3 months**; above 10°C/50°F (for example, river water during the fall, tap water, and puddles during the summer) for less time than in colder temperatures — in water above 37°C/98.6°F, **less than 4 days**',
                  ] },
                ] },
              { sub: 'How long should I clean and disinfect my home after my pet diagnosed with *Giardia* infection?',
                body: [
                  { bullets: [
                    '**Clean and disinfect** potentially contaminated items (toys, water bowls and food bowls, pet bedding, floors, dog crates, linens, towels, litter box, etc.) **regularly for as long as your pet is sick**',
                    'If your pet is taking medication, clean and disinfect frequently (**daily if possible**) until a few days after the last dose of medication is given; *Giardia* survival depends on many factors, so consult your veterinarian for further advice',
                  ] },
                ] },
              { sub: 'Clinical presentation in human: *Giardia*',
                body: [
                  { bullets: [
                    '**Asymptomatic carriage** to **severe diarrhea and malabsorption**',
                    '**Acute giardiasis** develops after an incubation period of **1 to 14 days** (average of **7 days**) and usually lasts **1 to 3 weeks**',
                    '**Symptoms**: diarrhea, abdominal pain, bloating, nausea, and vomiting',
                    'In **chronic giardiasis** the symptoms are recurrent and malabsorption and debilitation may occur',
                  ] },
                ] },
              { sub: 'Dx: *Giardia*',
                body: [
                  { bullets: [
                    '**Repeat fecal analyses** are needed due to cyst shedding intermittently',
                    '**Direct fecal smear**: trophozoite in diarrheal feces',
                    '**Lugol\'s iodine solution** staining — stain trophozoites and cysts; increase contrast of the nuclei within the organisms',
                    '**Fecal flotation** (centrifugal flotation) — ZnSO4 (SG 1.18); sucrose: shrink and distorted cyst',
                    '**IFA**: MeriFluor *Cryptosporidium*/*Giardia*; **PCR**',
                    '**Antigen detection kits** — SNAP *Giardia* antigen test (IDEXX) ELISA: *Giardia* cyst wall protein during encystation process; Anigen Rapid CPV/CCV/*Giardia* Ag Test kit',
                  ] },
                ] },
              { sub: 'Public health (CDC, USA): *Giardia*',
                body: [
                  { bullets: [
                    'Giardiasis is a **nationally notifiable disease** — health care providers and laboratories that diagnose cases of laboratory-confirmed giardiasis are **required to report** those cases to their local or state health departments, which in turn report the cases to CDC',
                    'Outbreaks of giardiasis affecting multiple people that are related to water, food, or person-to-person transmission **should be reported** to CDC by state health departments',
                  ] },
                ] },
              { sub: 'Prevention and control: *Giardia*',
                body: [
                  { bullets: [
                    '**Practice good hygiene**',
                    '**Avoid water** (drinking and recreational) that may be contaminated',
                    '**Avoid eating food** that may be contaminated',
                    '**Prevent contact and contamination with feces during sex**',
                    '**Clean up** after ill pets and people',
                  ] },
                ] },
              { sub: 'Hygienic practice',
                body: [
                  { bullets: [
                    '**Wash hands** with soap and clean, running water for at least **20 seconds**; rub your hands together to make a lather and be sure to scrub the backs of your hands, between your fingers, and under your nails; help young children and other people you are caring for with handwashing as needed',
                    'ช่วงที่ต้องล้างมือ: before, during, and after preparing food; before eating food; before and after caring for someone who is sick; before and after treating a cut or wound; after using the toilet; after changing diapers or cleaning up a child who has used the toilet; after blowing your nose, coughing, or sneezing; after touching an animal or animal waste; after handling pet food or pet treats; after touching garbage',
                    '**At childcare facilities**: to reduce the risk of spreading the disease, children with diarrhea should be removed from childcare settings until the diarrhea has stopped',
                    '**At recreational water venues** (for example, pools, beaches, fountains): protect others by not swimming if you have diarrhea (this is most important for children in diapers); wash children thoroughly (especially their bottoms) with soap and water after they use the bathroom or after their diapers are changed and before they enter the water',
                    '**Around animals**: minimize contact with the feces (poop) of all animals, especially young animals; when cleaning up animal feces (poop), wear disposable gloves and always wash hands when finished; wash hands after any contact with animals or their living areas',
                    '**Outside**: wash hands after gardening, even if wearing gloves',
                  ] },
                ] },
              { sub: 'Clean up after ill pets and people — cleaning and disinfection',
                body: [
                  { bullets: [
                    '*Giardia* is hard to completely eliminate from the environment, but you can decrease the risk of human infection or of your dog\'s or cat\'s reinfection if it has been ill',
                    '**Hard surfaces** (for example: cement and tile floors, pet crates, tables, trash cans, etc.): wear gloves; remove feces and discard in a plastic bag; clean and scrub surfaces using soap; rinse thoroughly until no obvious visible contamination is present',
                    '**Disinfection of hard surfaces**: wear gloves; disinfect according to manufacturer guidelines using **one** of — **quaternary ammonium compound products (QATS)** (found in some household cleaning products; the active ingredient may be listed as alkyl dimethyl ammonium chloride) or **bleach mixed with water** (3/4 cup of bleach to 1 gallon of water); keep the product in contact with the surface for the recommended amount of time, then rinse with clean water',
                    '**Carpet / upholstered furniture**: wear gloves; remove feces with absorbent material (for example, double layered paper towels) and discard in a plastic bag; clean with regular detergent or carpet cleaning agent; allow to fully dry',
                    '**Disinfection of carpet**: wear gloves; **steam clean** the area at **158ºF for 5 minutes** or **212ºF for 1 minute**; QATS found in some carpet cleaning products can also be used after cleaning (follow the product labels)',
                    '**Other items** (toys, clothing, pet bed, etc.): household items should be cleaned and disinfected **daily** while a dog or cat is being treated for *Giardia* infection',
                    '**Dishwasher**: dishwasher-safe toys and water and food bowls can be disinfected in a dishwasher that has a dry cycle or a final rinse that exceeds **one** of: 113ºF (45C) for 20 minutes, 122ºF (50C) for 5 minutes, 162ºF (72C) for 1 minute; without a dishwasher, submerge in boiling water for at least **1 minute** (at elevations above 6,500 feet, boil for 3 minutes)',
                    '**Washer and dryer**: clothing, some pet items (for example, bedding and cloth toys) and linens (sheets and towels) can be washed and then heat-dried on the highest heat setting for **30 minutes**; without a clothes dryer, allow clothes to thoroughly air dry under direct sunlight',
                  ] },
                ] },
            ] },
          { sub: 'Cryptosporidiosis',
            body: [
              { sub: '*Cryptosporidium*',
                body: [
                  { bullets: [
                    '**Tiny oocyst (3-5 um)** containing **4 sporozoites**, **without sporocyst**',
                    'Merozoite lacks of **mitochondria**',
                    '**Category B Biothreat Pathogen (NIH)**',
                  ] },
                ] },
              { sub: '*Cryptosporidium* in animals',
                body: [
                  { table: {
                    headers: ['Species', 'Major hosts', 'Site'],
                    rows: [
                      ['*C. muris*', 'Rodents', 'Stomach'],
                      ['*C. parvum*', 'Cattle and other livestock, humans', 'Small intestine'],
                      ['*C. meleagridis*', 'Birds', 'Small intestine'],
                      ['*C. wrairi*', 'Guinea pigs', 'Small intestine'],
                      ['*C. felis*', 'Cats', 'Small intestine'],
                      ['*C. serpentis*', 'Reptiles', 'Stomach'],
                      ['*C. baileyi*', 'Poultry', 'Bursa'],
                      ['*C. saurophilum*', 'Lizards', 'Stomach and small intestine'],
                      ['*C. galli*', '—', 'Proventriculus'],
                      ['*C. andersoni*', 'Cattle', 'Abomasum'],
                      ['*C. canis*', 'Dogs', 'Small intestine'],
                      ['*C. molnari*', 'Fish', 'Stomach and small intestine'],
                      ['*C. hominis*', 'Humans', 'Small intestine'],
                      ['*C. suis*', 'Pigs', 'Small and large intestine'],
                    ],
                  } },
                ] },
              { sub: 'Cryptosporidiosis',
                body: [
                  { bullets: [
                    'A disease that causes **watery diarrhea** — pathogen: *Cryptosporidium*',
                    'Water, food, soil, surface, dirty hands **contaminated with feces of infected humans or animals**',
                    '**Waterborne disease**; recreational water',
                    'An infected person can shed **10,000,000 to 100,000,000** Crypto germs in a single bowel movement',
                    'Shedding of Crypto in poop begins when symptoms like diarrhea begin and can last for **weeks after symptoms stop**',
                    'Swallowing as few as **10** Crypto germs can cause infection',
                  ] },
                ] },
              { sub: 'Cryptosporidiosis: symptoms',
                body: [
                  { bullets: [
                    'Generally begin **2 to 10 days (average 7 days)** after becoming infected with the parasite',
                    'Symptoms: watery diarrhea (the most common symptom), stomach cramps or pain, dehydration, nausea, vomiting, fever, weight loss; some people with Crypto will have **no symptoms at all**',
                    'In persons with healthy immune systems, symptoms usually last about **1 to 2 weeks** (with a range of a few days to 4 or more weeks); occasionally a **recurrence of symptoms** after a brief period of recovery before the illness ends — symptoms can come and go for up to **30 days**',
                    'While the small intestine is the site most commonly affected, in immunocompromised persons *Cryptosporidium* infections could possibly affect other areas of the digestive tract or the respiratory tract',
                    'The risk of developing severe disease may differ depending on each person\'s degree of immune suppression — people with weakened immune systems may develop **serious, chronic, and sometimes fatal illness**',
                    'Examples of people with weakened immune systems: HIV/AIDS; inherited diseases that affect the immune system; cancer and transplant patients who are taking certain immunosuppressive drugs',
                  ] },
                ] },
              { sub: 'Swimming hygiene',
                body: [
                  { bullets: [
                    '**Keep the pee, poop, sweat, and dirt out of the water!** — stay out of the water if you have diarrhea; shower before you get in the water; don\'t pee or poop in the water; don\'t swallow the water',
                    '**Every hour—everyone out!** — take kids on bathroom breaks; check diapers, and change them in a bathroom or diaper-changing area–not poolside–to keep germs away from the pool; reapply sunscreen; drink plenty of fluids',
                    '**Check the free chlorine level and pH** before getting into the water — **pools**: proper free chlorine level (**1–3 mg/L** or parts per million [ppm]) and pH (**7.2–7.8**) maximize germ-killing power',
                    '**Hot tubs/spas**: proper disinfectant level (chlorine [**3–10** ppm] or bromine [**4–8** ppm] and pH [**7.2–7.8**]) maximize germ-killing power; pool test strips are sold in most superstores, hardware stores, and pool-supply stores',
                  ] },
                ] },
            ] },
          { sub: 'Leishmaniosis',
            body: [
              { sub: 'Leishmaniosis — transmission และวงจรชีวิต',
                body: [
                  { bullets: [
                    '**Transmission**: bites of infected female phlebotomine sandflies',
                    'ใน **female sandfly**: amastigotes released in the midgut → amastigotes transform into promastigotes → simple division → promastigotes migrate to the proboscis → transferred during feeding',
                    'ใน **mammals**: promastigotes phagocytized by macrophages → promastigotes transform in amastigotes and multiply by simple division → amastigotes leave infected cells → amastigotes infect other cells or are phagocytized → transferred during feeding',
                  ] },
                ] },
              { sub: 'Prevention and control: general และ when outdoors',
                body: [
                  { bullets: [
                    '**No vaccines or drugs** to prevent infection are available',
                    'The best way for travelers to prevent infection is to **protect themselves from sand fly bites** — avoid outdoor activities, especially **from dusk to dawn**, when sand flies generally are the most active',
                    '**When outdoors (or in unprotected quarters)**: minimize the amount of exposed (uncovered) skin — to the extent that is tolerable in the climate, wear long-sleeved shirts, long pants, and socks; and tuck your shirt into your pants',
                    'Apply insect repellent to exposed skin and under the ends of sleeves and pant legs (follow the instructions on the label) — the most effective repellents generally are those that contain the chemical **DEET** (N,N-diethylmetatoluamide)',
                    'Bed nets, repellents, and insecticides should be purchased before traveling (hardware, camping, and military surplus stores); bed nets and clothing that already have been treated with a **pyrethroid-containing insecticide** also are commercially available',
                  ] },
                ] },
              { sub: 'Prevention and control: when indoors',
                body: [
                  { bullets: [
                    'Stay in **well-screened or air-conditioned** areas — **sand flies are much smaller than mosquitoes** and therefore can get through smaller holes',
                    'Spray living/sleeping areas with an insecticide to kill insects',
                    'If you are not sleeping in a well-screened or air-conditioned area, use a **bed net** and tuck it under your mattress — if possible, one that has been soaked in or sprayed with a **pyrethroid-containing insecticide**',
                    'The same treatment can be applied to screens, curtains, sheets, and clothing (clothing should be **retreated after five washings**)',
                  ] },
                ] },
            ] },
          { sub: 'Trypanosomiasis',
            body: [
              { sub: '*Trypanosoma cruzi* — วงจรชีวิต',
                body: [
                  { bullets: [
                    '**Triatomine bug stages**: (1) triatomine bug takes a blood meal and passes metacyclic trypomastigotes in feces; trypomastigotes enter bite wound or mucosal membranes, such as the conjunctiva (**infective stage**)',
                    '**Mammalian stages**: (2) metacyclic trypomastigotes penetrate various cells at bite wound site; inside cells they transform into **amastigotes**',
                    '(3) amastigotes multiply by **binary fission** in cells of infected tissues',
                    '(4) intracellular amastigotes transform into trypomastigotes, then burst out of the cell and enter the bloodstream (**diagnostic stage**); trypomastigotes can infect other cells and transform into intracellular amastigotes in new infection sites',
                    '**Triatomine bug stages** (ต่อ): (5) triatomine bug takes a blood meal (trypomastigotes ingested) → (6) **epimastigotes** in midgut → (7) multiply in midgut → (8) metacyclic trypomastigotes in hindgut',
                    'Many mammalian species have been recognized as *T. cruzi* **reservoir hosts**',
                  ] },
                ] },
              { sub: 'Is *T. evansi* zoonosis?',
                body: [
                  { bullets: [
                    '**Very rare** human cases have been described from **India, Vietnam, Sri Lanka, and Egypt**',
                    'Clinical presentation among humans is quite similar to the **first stage of the chronic form of human sleeping sickness** caused by *T. brucei*',
                  ] },
                ] },
              { sub: '*Trypanosoma evansi* — biology และ morphology',
                body: [
                  { bullets: [
                    '**Biology**: trypomastigotes multiply by **binary fission** in body fluids (e.g., blood, lymph, and spinal fluid)',
                    '**No epimastigote or amastigote forms**',
                    '**No intermediate host**',
                    '**Morphology**: length **25–35 µm**; free flagellum; large undulating membrane; central nucleus; small and subterminal kinetoplast; thin posterior extremity',
                  ] },
                ] },
              { sub: '*Trypanosoma evansi* — transmission',
                body: [
                  { bullets: [
                    'Parasites are **mainly transmitted mechanically by biting flies**',
                    '**Other minor transmission routes**: orally to carnivorous animals; vertically (transplacental, colostrum, milk)',
                    '**Very rare cases of human infection**: iatrogenically, butchering ...',
                  ] },
                ] },
            ] },
          { sub: 'Babesiosis',
            body: [
              { sub: 'Babesiosis — zoonotic *Babesia* และวงจรชีวิต',
                body: [
                  { bullets: [
                    '**Zoonotic** *Babesia*: *B. microti*, *B. divergens*, *B. duncani*, and a currently un-named strain designated **MO-1**',
                    '**Tick**: (1) tick takes a blood meal and sporozoites are introduced into host (mouse) → (2) trophozoite and merozoite → (3) gamete',
                    '(4) tick takes a blood meal (ingests gametes) → fertilization in gut → (5) ookinete enters salivary gland → sporogony → **sporozoites** (infective stage)',
                    '(6) tick takes a blood meal (sporozoites introduced into host) → in human: trophozoite (**diagnostic stage**) and merozoite (7)',
                    '(8) **transmitted from human-to-human via blood transfusion**',
                  ] },
                ] },
            ] },
          { sub: 'Sarcocystosis',
            body: [
              { sub: '*Sarcocystis* species in livestock: cattle (*Bos taurus*)',
                body: [
                  { table: {
                    headers: ['Sarcocystis species', 'Sarcocysts: maximum length (mm)', 'Sarcocysts: wall (mm)', 'Pathogenicity', 'Definitive hosts'],
                    rows: [
                      ['*S cruzi*', '<1', '7', '++', 'Dog, coyote, red fox, raccoon, wolf'],
                      ['*S hirsuta*', '7', '10', '+/−', 'Cat'],
                      ['*S hominis*', '7', '10', '+/−', 'Man, other primates'],
                    ],
                  } },
                ] },
              { sub: '*Sarcocystis* species in livestock: sheep (*Ovis aries*)',
                body: [
                  { table: {
                    headers: ['Sarcocystis species', 'Sarcocysts: maximum length (mm)', 'Sarcocysts: wall (mm)', 'Pathogenicity', 'Definitive hosts'],
                    rows: [
                      ['*S tenella*', '0.7', '14', '++', 'Dog, coyote, red fox'],
                      ['*S arieticanis*', '0.9', '7', '+', 'Dog'],
                      ['*S gigantea*', '10', '21', '−', 'Cat'],
                      ['*S medusiformis*', '8', '20', '−', 'Cat'],
                    ],
                  } },
                ] },
              { sub: '*Sarcocystis* species in livestock: goat (*Capra hircus*)',
                body: [
                  { table: {
                    headers: ['Sarcocystis species', 'Sarcocysts: maximum length (mm)', 'Sarcocysts: wall (mm)', 'Pathogenicity', 'Definitive hosts'],
                    rows: [
                      ['*S capracanis*', '1', '14', '++', 'Dog, coyote, red fox'],
                      ['*S hircicanis*', '2.5', '7', '++', 'Dog'],
                      ['*S moule*', '7.5', '7', '?', 'Cat'],
                    ],
                  } },
                ] },
              { sub: '*Sarcocystis* species in livestock: pigs (*Sus scrofa*)',
                body: [
                  { table: {
                    headers: ['Sarcocystis species', 'Sarcocysts: maximum length (mm)', 'Sarcocysts: wall (mm)', 'Pathogenicity', 'Definitive hosts'],
                    rows: [
                      ['*S miescheriana*', '1.5', '10 (?)', '+', 'Dog, raccoon, wolf, red fox, jackal'],
                      ['*S porcifelis*', '?', '?', '?', 'Cat'],
                      ['*S suihominis*', '1.5', '10', '+', 'Humans, primates'],
                    ],
                  } },
                ] },
              { sub: 'Human intestinal sarcocystosis',
                body: [
                  { bullets: [
                    '**Human as a definitive host** by consumption of **raw meat**: **beef** (*S. hominis*), **pork** (*S. suihominis*)',
                    '**Dead-end host** after accidental ingestion of non-human *Sarcocystis* oocysts',
                    '**Cycle**: (1) sporocysts and thin-walled oocysts passed in feces (**infective stage** และ **diagnostic stage**) → sporocysts ingested by cows and pigs → sporocyst ruptures releasing sporozoites that enter endothelial cells of blood vessels and undergo schizogony → schizonts rupture releasing merozoites → merozoites penetrate muscle cells, and develop into cysts with bradyzoites',
                    '(2) cysts with bradyzoites ingested in undercooked meat (**infective stage** และ **diagnostic stage**) → (3) bradyzoites released from ruptured cyst → (4) enter intestinal cells (microgamete, macrogamete) → (5) fertilization → (6) immature oocyst → (7) exits host',
                  ] },
                ] },
              { sub: 'Clinical features of human sarcocystosis',
                body: [
                  { bullets: [
                    '**Definitive host — intestinal sarcocystosis**: asymptomatic; clear spontaneously; mild fever; diarrhea; chills; vomiting; respiratory problems',
                    '**Dead-end intermediate host — accidental infection**: muscle cysts; myalgia; muscle weakness; transitory edema',
                  ] },
                ] },
              { sub: 'Parasite development และ disease manifestations in humans',
                body: [
                  { table: {
                    headers: ['Characteristic', 'Muscular infection', 'Intestinal infection'],
                    rows: [
                      ['Source of infection', 'Water or food contaminated with feces from unknown carnivore or omnivore', 'Raw or undercooked meat'],
                      ['Infective stage', 'Oocyst or free sporocysts', 'Sarcocyst containing bradyzoites'],
                      ['Developmental stages', 'Intravascular schizonts (not seen); intramuscular sarcocysts', 'Sexual stages in lamina propria; oocysts excreted in feces'],
                      ['Time from ingestion of infective stage to symptoms', 'Weeks to months, lasting months to years', '3–6 h, lasting 36 h'],
                      ['Symptoms', 'Musculoskeletal pain, fever, rash, cardiomyopathy, bronchospasm, subcutaneous swelling', 'Nausea, loss of appetite, vomiting, stomach ache, bloat, diarrhea, dyspnea, and tachycardia'],
                      ['Diagnosis', 'Biopsy specimen containing sarcocyst; antibodies to bradyzoites', 'Oocysts or sporocysts in feces, beginning 5–12 days after ingestion'],
                      ['Therapy (none approved)', 'Co-trimoxazole, furazolidone, albendazole, anticoccidials, pyrimethamine, anti-inflammatories', 'None'],
                    ],
                  } },
                ] },
              { sub: 'Encysted protozoan parasites in human feces',
                body: [
                  { table: {
                    headers: ['Parasite', 'General size (µm)', 'Shape', 'Features'],
                    rows: [
                      ['*Sarcocystis hominis* and *S. suihominis*', '—', '—', 'Excreted sporulated'],
                      ['*Sarcocystis* oocysts', '15–19 by 15–20', 'Spherical', 'Contain 2 sporocysts'],
                      ['*Sarcocystis* sporocysts', '15–19 by 8–10', 'Oval', 'Contain 4 sporozoites'],
                      ['*Isospora belli*', '20–33 by 10–19', 'Ovoid with tapered ends', 'Excreted unsporulated'],
                      ['*Cyclospora cayetanensis*', '7.7–10', 'Spherical', 'Excreted unsporulated'],
                      ['*Giardia duodenalis*', '11–14', 'Ovoid to ellipsoid', '4 nuclei'],
                      ['*Balantidium coli*', '50–70', 'Spherical to oval', 'Large macronucleus, thick wall'],
                      ['*Cryptosporidium hominis* and *C. parvum*', '4.5 by 5.0', 'Nearly spherical', 'Excreted sporulated, but sporozoites hard to see'],
                      ['*Entamoeba histolytica* and *E. dispar*', '12–15', 'Spherical', 'Uni- and binucleate, usually with distinct karyosome'],
                    ],
                  } },
                ] },
            ] },
        ],
      },
    ],
  },
};

export default NOTES_Y5_ZOONOSES;
