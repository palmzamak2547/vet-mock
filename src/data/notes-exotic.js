// ============================================================
// Exotic Study Notes — Final exam scope (week 7-14)
// ============================================================
// อ้างอิง:
//   - Slide Lecture 2026: ZOO_VET_CU2026.pdf, RolesVeterinarians.pdf
//    , ABOARD POST-GRADUATE Wildlife COURSES.pdf, โรคไม่ติดเชื้อ.pptx
//    , โรคติดเชื้อ.pptx, การรักษานกสวยงาม.pptx
//   - EXOTIC Master 86 .pdf (master compilation)
//   - course syllabus.docx (รหัส 3107414, ผศ.น.สพ. ธวัช เล็กดำรงศักดิ์)
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
    summary: 'Handling, blood collection, anesthesia, husbandry-related diseases (Vit A/D, MBD), feather plucking, crop stasis, พื้นฐานก่อนเรียน infectious diseases',
    sections: [
      {
        heading: 'Handling + Blood Collection',
        source: 'การรักษานกสวยงาม.pptx + EXOTIC FINAL 86',
        body: [
          { bullets: [
            'จับนกใช้ผ้าขนหนู คลุมหัว → ลด stress, ระวัง keel ไม่ให้กดหายใจ',
            'เจาะเลือดได้ที่ **ปีก (basilic vein)**, **คอ (jugular vein)**, **ขา (medial metatarsal)**',
            'ห้ามเจาะลิ้น/หัว/หาง, ปริมาณเลือด ≤ 1% body weight',
          ] },
        ],
      },
      {
        heading: 'Anesthesia',
        source: 'การรักษานกสวยงาม.pptx',
        body: [
          { bullets: [
            '**Isoflurane** = drug of choice, safety ดี, rapid induction + recovery',
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
                'พบบ่อยในนกที่กิน seed-only diet, แก้โดยให้ pellet + vegetable',
              ] },
            ] },
          { sub: 'Metabolic Bone Disease (MBD)',
            body: [
              'Vit D3/Ca deficiency → soft bones, พบในนกที่ไม่ได้รับ UVB หรือ Ca ไม่พอ',
              'แก้: UVB exposure + Ca supplement + balanced diet',
            ] },
          { sub: 'Hypocalcemia (African Grey ที่พบบ่อย)',
            body: [
              'African Grey ไวต่อ low Ca, seizure, ตอบสนองดีต่อ Ca gluconate IV',
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
            'Mass-like lesion ที่ cloaca, associated กับ **Herpesvirus + Papillomavirus**',
            '**Diagnosis**: 5% acetic acid → tissue เปลี่ยนสีขาว (acetowhite test)',
            '**Treatment**: Silver nitrate (AgNO₃) จี้ chemical cauterization, อาจ recur',
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
            'Scaly leg / scaly face mite, พบบ่อยใน budgerigar (parakeet)',
            'Burrows ในผิวหนัง → hyperkeratotic crust',
            'Tx: **Ivermectin** topical/SC, repeat 2-week interval',
          ] },
        ],
      },
      {
        heading: 'Popular Pet Birds — Species, Lifespan & Clinical Features',
        source: 'MSD Veterinary Manual (Table: Popular Pet Birds)',
        body: [
          'ตารางสรุปสายพันธุ์นกเลี้ยงยอดนิยม แหล่งกำเนิดในธรรมชาติ อายุเฉลี่ย พฤติกรรม และข้อควรระวังทางคลินิกอ้างอิง MSD Veterinary Manual:',
          { table: {
            headers: ['Species / Popular Name', 'Origin', 'Lifespan', 'Clinical & Owner Considerations'],
            rows: [
              ['African Grey Parrots', 'Africa', '30–50 yrs', 'ฉลาดที่สุดในตระกูล parrot เสี่ยงต่อพฤติกรรมขนร่วง (feather plucking) ถ้าเครียด หรือขี้เบื่อ, ไวต่อ Hypocalcemia (ซีซัวร์), ลอกเลียนเสียงเก่ง'],
              ['Amazon Parrots', 'Central & South America', '40–50 yrs', 'ตัวสีเขียวเป็นหลัก ร้องเสียงดัง ชอบพูด/ร้องเพลง Mood เปลี่ยนง่าย มักผูกพันกับเจ้าของคนเดียว (single-person bond)'],
              ['Budgerigars (Budgies)', 'Australia', '5–10 yrs', 'ขนาดเล็ก เสียงไม่ดัง เหมาะกับอพาร์ตเมนต์ เป็นเป้าหมายหลักของ Knemidocoptes (scaly face/leg mite)'],
              ['Caiques', 'South America', '20–30 yrs', 'ร่าเริง กระโดดเล่น (hopping) มีสองชนิดหลัก (Black-headed / White-bellied) นกตัวผู้มักผายลม/นกหวีดเก่ง'],
              ['Canaries', 'Canary Islands', 'Up to 15 yrs', 'ตัวผู้มีเสียงร้องไพเราะ (song canary) หวงถิ่น (territorial) ควรเลี้ยงเดี่ยวหรือคู่ผสมพันธุ์ ไม่ชอบให้จับ'],
              ['Cockatiels', 'Australia', 'Up to 20 yrs', 'มีหงอน สีเหลือง-เทา-ขาว พบบ่อยในคลินิก เสี่ยงต่อ Giardia enteritis และ feather plucking เสียงไม่ดังเท่า macaw/cockatoo'],
              ['Cockatoos', 'Australia & Pacific', '25–50 yrs', 'สีขาว/ชมพู ต้องการความรักและออดอ้อนสูง หากขาดความสนใจจะแผดเสียงกรีดร้อง (screaming) และกัดทำลายไม้/พลาสติก ยอดพฤติกรรมเบี่ยงเบน'],
              ['Conures (Small / Large)', 'Central & South America', '25–30 yrs', 'Pyrrhura (small, green-cheeked) น่ารัก เสียงเบา / Aratinga (large, Sun conure) สีสด แผดเสียงแหลมสูง (piercing scream)'],
              ['Doves & Pigeons', 'Global / US / Europe', 'Up to 20 yrs', 'สงบ เสียงขัน cooing ตระกูลนกเขา/นกพิราบ ไม่ค่อยมีพฤติกรรมเรียกร้องสนใจแบบ parrot'],
              ['Eclectus Parrots', 'Indonesia & Pacific', '20–50 yrs', 'Sexual dimorphism ชัดเจน: ตัวผู้สีเขียวมรกต ตัวเมียสีแดงสด/น้ำเงิน ไม่กรีดร้องบ่อยเท่า cockatoo/macaw'],
              ['Finches', 'Africa & Global', '5–10 yrs', 'เลี้ยงเป็นฝูง (flock-housed) ไม่ค่อยปฏิสัมพันธ์กับคน เสียงร้อง peep ถี่ๆ เหมาะกับเลี้ยงในกรงใหญ่'],
              ['Lories & Lorikeets', 'Australia & Pacific', '15 yrs', 'สีสันฉูดฉาด ลิ้นเป็นแปรง (brush-tongue) ต้องการอาหารเหลว/เกสร (nectar diet) ทำให้ถ่ายเหลวพุ่ง messy'],
              ['Lovebirds', 'Africa', 'Up to 20 yrs', 'ขนาดเล็ก เสียงหวาน ไม่ดังมาก แต่อาจก้าวร้าวและอารมณ์แปรปรวนช่วงฤดูผสมพันธุ์ (breeding season)'],
              ['Macaws', 'Central & South America', '30–60 yrs', 'นกแก้วขนาดใหญ่ที่สุด (Blue & Gold, Scarlet, Hyacinth) จะงอยปากแข็งแรงมาก เสียงกรีดร้องดังมาก ต้องการพื้นที่ขยับร่างกายสูง'],
              ['Mynas (Nok Khun Thong)', 'Southeast Asia', '12+ yrs', 'พูดเลียนแบบเสียงมนุษย์ได้ชัดเจน ถ่ายเหลวและสกปรกง่าย ไม่ค่อยออดอ้อน'],
              ['Parrotlets', 'Central & South America', 'Up to 20 yrs', 'Pocket parrot ขนาดเล็กที่สุด เชื่องง่ายถ้าฝึกตั้งแต่เล็ก เสียงเบาเมื่อเทียบกับ parrot อื่น'],
              ['Poicephalus (Senegal)', 'Africa', '2–25 yrs', 'ขนาดเล็กถึงกลาง Senegal parrot พบบ่อยที่สุด ขี้เล่น เสียงค่อนข้างเงียบ'],
              ['Psittacula (Ringnecked)', 'Asia & Africa', 'Up to 20 yrs', 'Indian ringneck มีวงแหวนรอบคอ สีสวย พูดเก่ง แต่ถ้าตกใจจะร้องเสียงแหลมสูง'],
              ['Quaker (Monk) Parakeets', 'South America', '20–30 yrs', 'ทำรังขนาดใหญ่ ในหลายรัฐของสหรัฐฯ ผิดกฎหมายเพราะถือเป็นศัตรูพืชทางการเกษตร ชอบแทะ'],
            ],
          } },
        ],
      },
      {
        heading: 'Common Household Poisons in Pet Birds',
        source: 'MSD Veterinary Manual (Table: Common Household Poisons)',
        body: [
          'ระบบหายใจของนกมีประสิทธิภาพสูงมาก (one-way air flow + air sacs) ทำให้ sensitive ต่อสารพิษระเหยในอากาศและสารเคมีในบ้านอย่างรุนแรง ตารางจำแนกสารพิษในบ้านตาม MSD Veterinary Manual:',
          { bullets: [
            { label: 'Inhalants & Volatile Gases (พิษทางการหายใจ — อันตรายที่สุด)', value: 'PTFE/Teflon (กระทะสารเคลือบไหม้ -> acute pulmonary edema & sudden death), Ammonia, Bleach fumes, Perfume, Hair dyes, Spray starch, Window cleaners, Charcoal lighter fluid, Kerosene fumes' },
            { label: 'Heavy Metals (โลหะหนัก — พบบ่อยในนกปล่อยบินในบ้าน)', value: 'Lead (ตะกั่วในผ้าม่าน, ลิโนเลียม, สีเก่า) & Zinc (สังกะสีในกรง galvanized metal wire, เหรียญกษาปณ์, น้ำยาล้างทองเหลือง/ทองแดง) -> GI erosion, anemia, seizures, hemoglobinuria' },
            { label: 'Chemical Solvents & Cleaners (ตัวทำละลายและน้ำยาล้าง)', value: 'Acetone (น้ำยาล้างเล็บ), Drain cleaners, Toilet bowl cleaner, Epoxy/Super glue, Turpentine, Paint remover/thinner, Mothballs (naphthalene)' },
            { label: 'Toxic Foods & Plants (อาหารและพืชพิษต่อนก)', value: 'Avocado (สาร Persin -> myocardial necrosis & hydropericardium), เห็ดพิษ (mushrooms), พืชประดับในบ้านบางชนิด (house plants)' },
            { label: 'Pesticides & Drugs (ยาฆ่าแมลงและยาคน)', value: 'Insecticides, Rodenticides (ยาเบื่อหนู), Weed killers, Garden sprays, ยาคนทั้งชนิด prescription & OTC (Paracetamol, NSAIDs, Heart medications)' },
          ] },
          { callout: '⚠️ สัตว์ป่วยด้วยพิษระเหย (Teflon/Ammonia) ต้องย้ายออกสู่แดด/อากาศบริสุทธิ์ทันที และให้ออกซิเจนเสริม (Oxygen therapy) ป้องกันปอดบวมน้ำ', kind: 'warn' },
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
    summary: 'Pacheco / PDD / PBFD / Polyoma / Pox + Chlamydophila + Candida + Trichomonas + Giardia + Eimeria, เป็นหัวใจ Final scope (สัปดาห์ 9-11, 3 weeks)',
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
          { callout: '💡 PCR ใช้ confirm ทุกตัวยกเว้น Pox (ทำได้แต่ไม่นิยม), ดู feather/blood/cloacal swab',
            kind: 'tip' },
        ],
      },
      {
        heading: "Pacheco's Disease (PsHV)",
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            '**Acute hepatic necrosis** + sudden death, "found dead" ในกรง',
            'Histopath: intranuclear inclusion bodies ใน liver/kidney/spleen',
            '**Tx**: Acyclovir (antiviral) + supportive, prognosis poor หลังมี clinical sign',
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
            'Wasting + regurgitation + undigested seeds in feces, neuro signs (ataxia, seizure)',
            'Dx: PCR (cloacal swab), endoscopic biopsy of crop/proventriculus',
            'Tx: NSAIDs (celecoxib) + supportive feeding, no cure',
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
            'Dx: PCR feather/blood, No vaccine, No cure → cull',
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
          { callout: '⚠️ ZOONOSIS — ระวังคนติด, psittacosis fever ในเจ้าของ', kind: 'warn' },
          { bullets: [
            'Conjunctivitis + nasal/ocular discharge + diarrhea + lethargy',
            '**Antibiotic of choice**: **Doxycycline**',
            '**Duration**: **45 วัน** (4-6 สัปดาห์) — สำคัญมาก สั้นกว่านี้ relapse',
            'Penetrates intracellular pathogen ได้ดี, macrolide (azithromycin) เป็น alternative',
            'Notify owner re: zoonosis precautions',
          ] },
        ],
      },
      {
        heading: 'Fungal — Candidiasis (Thrush)',
        source: 'EXOTIC FINAL 86',
        body: [
          { bullets: [
            'White plaque ใน oropharynx + crop, พบใน **young birds** (parent-fed)',
            'Predispose: long Abx use, immunosuppression, hypovitaminosis A',
            'Dx: cytology — budding yeast / hyphae',
            'Tx: **Itraconazole** (systemic), **Nystatin** (topical/oral) สำหรับเฉพาะที่',
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
                'พบในนกพิราบ, raptor, finch, transmitted via crop secretions',
                'Tx: **Metronidazole** PO 5-7 วัน',
              ] },
            ] },
          { sub: 'Giardia spp.',
            body: [
              { bullets: [
                'พบบ่อยใน **Cockatiel** (อาจร่วม feather plucking + diarrhea)',
                'Dx: fecal direct/zinc sulfate, Tx: **Metronidazole**',
              ] },
            ] },
          { sub: 'Eimeria / Coccidia',
            body: [
              { bullets: [
                'GI signs, oocyst ใน feces',
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
            '✅ **Pox** (fowl pox, live attenuated)',
            '✅ **Polyomavirus** (recombinant)',
            '❌ PBFD, PDD, Pacheco, Chlamydophila — ไม่มี commercial vaccine',
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
            { label: 'In situ', value: 'ในถิ่นอาศัยจริง — Wildlife Department, National Park' },
            { label: 'Ex situ', value: 'นอกถิ่นอาศัย — Zoo, Captive breeding' },
            'ZPOT (Zoological Park Organization of Thailand) ดูแล 6 zoos ในไทย',
          ] },
        ],
      },
      {
        heading: 'Zoo Vet Roles (4 บทบาท)',
        source: 'ZOO_VET_CU2026.pdf p.16',
        body: [
          { sub: '1. Practitioner — General, Epidemiologist, Pathologist',
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
                'Genome Resource Bank (GRB) — frozen zoo, sperm/embryos/oocytes/fibroblasts',
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
            '**All in - all out**: รับสัตว์เป็น batch, ไม่ผสมกับ batch อื่น',
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
            'Nipah, MERS, SARS, Avian Influenza, COVID-19',
            'Melioidosis (Burkholderia pseudomallei) — soil/water, พบในไทย',
            'African Swine Fever, African Horse Sickness, Lumpy Skin Disease',
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
          { callout: 'Senior cat **CKD = #1 cause of death** (> 30%), screen with USG + UPC + SDMA + creatinine', kind: 'flag' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'small-mammal-amphibian-medicine': {
    topic: 'small-mammal-amphibian-medicine',
    title: 'Small Mammal Physiology & Amphibian Infectious Diseases',
    lecturer: 'Exotic & Amphibian Medicine',
    icon: '🐸',
    summary: 'Ferret/Mouse/Hamster physiological constants, hamster pregnancy & cannibalism risks, and amphibian chytridiomycosis & red-leg syndrome.',
    sections: [
      {
        heading: 'Ferret & Mouse Physiological & Reproductive Constants',
        source: 'MSD Veterinary Manual (Tables: Ferrets & Mice at a Glance)',
        body: [
          'ค่าทางสรีรวิทยาและระบบสืบพันธุ์ของเฟอร์เรตและหนูไมซ์:',
          { table: {
            headers: ['Parameter', 'Ferret (Mustela putorius furo)', 'Mouse (Mus musculus)', 'Clinical Significance'],
            rows: [
              ['Average Lifespan', '6–10 years', '1.5–3 years', 'เฟอร์เรตอายุยืนยาว เสี่ยงต่อ Geriatric diseases (Insulinoma, Adrenal)'],
              ['Adult Body Weight', 'Hob (M): 1.0–2.0 kg; Jill (F): 0.5–1.0 kg', '20–40 grams', 'เฟอร์เรตตัวผู้ขนาดใหญ่กว่าตัวเมียเท่าตัว'],
              ['Gestation Period', '41–42 days', '19–21 days', 'หนูระยะตั้งท้องสั้น ขยายพันธุ์ได้รวดเร็ว'],
              ['Estrous Cycle', 'Induced ovulator (seasonally polyestrous)', '4–5 days (spontaneous polyestrous)', 'Jill Ferret ที่เป็นสัดแล้วไม่ได้ผสม เสี่ยงต่อ Hyperestrogenism & Aplastic anemia'],
            ],
          } },
        ],
      },
      {
        heading: 'Hamster Breeds, Gestation & Maternal Cannibalism Risks',
        source: 'MSD Veterinary Manual (Tables: Hamster Breeds & If Your Hamster is Pregnant)',
        body: [
          'สายพันธุ์แฮมสเตอร์และข้อควรระวังในการดูแลแฮมสเตอร์ตั้งท้อง:',
          { bullets: [
            '1. **Breeds**: Syrian/Golden Hamster (*Mesocricetus auratus*) ต้อง **เลี้ยงแยกตัวเดียว (solitary)** เมื่อโตเต็มวัยเพราะจะต่อสู้กันรุนแรง; Dwarf hamsters (Campbell, Winter White, Roborovski) เลี้ยงเป็นคู่/กลุ่มได้หากเลี้ยงมาด้วยกัน',
            '2. **Shortest Gestation**: แฮมสเตอร์มีระยะตั้งท้องสั้นที่สุดในบรรดาสัตว์เลี้ยงลูกด้วยนมมีรก (**15-18 วัน**)',
            '3. **Preventing Maternal Cannibalism**: ห้ามรบกวนกรง เปลี่ยนวัสดุรองกรง หรือจับสัมผัสลูกแฮมสเตอร์อย่างน้อย **7-10 วันหลังคลอด** (ความเครียดและกลิ่นแปลกปลอมกระตุ้นแม่กินลูก)',
          ] },
        ],
      },
      {
        heading: 'Infectious Diseases of Amphibians (Chytridiomycosis & Red-leg)',
        source: 'MSD Veterinary Manual (Table: Infectious Diseases of Amphibians)',
        body: [
          'โรคติดเชื้อสำคัญในกบและสัตว์ครึ่งบกครึ่งน้ำ:',
          { table: {
            headers: ['Pathogen / Disease', 'Etiology / Agent', 'Clinical Signs & Pathogenesis', 'Management / Treatment'],
            rows: [
              ['Chytridiomycosis', '*Batrachochytrium dendrobatidis* (Bd) / *B. salamandrivorans* (Bsal)', 'เชื้อราทำลายชั้น Keratin บนผิวหนัง เกิด Cutaneous hyperkeratosis & sloughing, ขัดขวางการหายใจและการแลกเปลี่ยนไอออนทางผิวหนัง จนหัวใจล้มเหลว (cardiac arrest)', 'Antifungal bath (Itraconazole bath protocol), อุณหภูมิอบอุ่น'],
              ['Red-leg Syndrome', '*Aeromonas hydrophila* (Bacterial septicaemia)', 'ผิวหนังใต้ท้องและโคนขาสีแดงขึ้นผื่น (ventral erythema/petechiae), ขาบวมน้ำ (edema), ซึม อัตราตายสูง', 'ปรับปรุงคุณภาพน้ำ, Antibiotic bath (Enrofloxacin) ตามผล C/S'],
              ['Ranavirus Infection', 'Ranavirus (Family Iridoviridae)', 'เนื้อเยื่อตายและมีเลือดออกตามผิวหนัง (systemic hemorrhages), แผลเปื่อย รุนแรงในลูกอ๊อดและกบโต', 'Biosecurity strictly, ไม่มียารักษาเฉพาะเจาะจง'],
            ],
          } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'rabbit-nutritional-requirements': {
    topic: 'rabbit-nutritional-requirements',
    title: 'Rabbit Nutritional Requirements & Passive Calcium Physiology',
    lecturer: 'Exotic Clinical Nutrition',
    icon: '🥕',
    summary: 'Rabbit dietary fiber, protein, and passive calcium absorption mechanism, risk of bladder sludge & urolithiasis.',
    sections: [
      {
        heading: 'Nutrient Requirements & Fiber Balance in Rabbits',
        source: 'MSD Veterinary Manual (Table: Nutrient Requirements of Rabbits)',
        body: [
          'ความต้องการสารอาหารและโภชนาการที่เหมาะสมสำหรับกระต่าย:',
          { table: {
            headers: ['Nutrient Component', 'Recommended Level', 'Primary Dietary Source', 'Clinical & Physiological Role'],
            rows: [
              ['Indigestible Crude Fiber (CF)', '18–22% (minimum 14–16%)', 'Timothy hay, Grass hay', 'กระตุ้น Cecal motility, ขัดถูฟัน (prevent elodont malocclusion), ป้องกัน GI stasis & Trichobezoars'],
              ['Crude Protein (CP)', '12–14% (maintenance); 16–18% (growth/lactation)', 'Grass hay + quality pellets', 'ซ่อมแซมส่วนสึกหรอ (การได้โปรตีนเกินทำให้เกิด cecal dysbiosis)'],
              ['Calcium (Ca)', '0.6–1.0%', 'Timothy hay (low Ca); Alfalfa hay (high Ca - เติบโตเท่านั้น)', 'ดูดซึมผ่านลำไส้แบบ Passive absorption โดยไม่พึ่ง Vitamin D'],
            ],
          } },
        ],
      },
      {
        heading: 'Rabbit Calcium Metabolism & Bladder Sludge Physiology',
        source: 'MSD Veterinary Manual (Table: Nutrient Requirements of Rabbits)',
        body: [
          'สรีรวิทยาการเมแทบอลิซึมของแคลเซียมในกระต่ายและภาวะปัสสาวะเป็นตะกอน:',
          { bullets: [
            '1. **Passive Calcium Absorption**: กระต่ายดูดซึมแคลเซียมจากอาหารผ่านลำไส้ตามระดับแคลเซียมในอาหารโดยตรง (Passive diffusion) โดยไม่ขึ้นกับ Vitamin D ทำให้ระดับ Ca ในเลือดสูงขึ้นตามอาหารที่กิน',
            '2. **Renal Excretion**: แคลเซียมส่วนเกินจะถูกขับออกทางไตและระบบทางเดินปัสสาวะเป็นหลัก ทำให้ปัสสาวะกระต่ายปกติมีความขุ่น (cloudy/milky urine จาก Calcium carbonate crystals)',
            '3. **Bladder Sludge & Urolithiasis**: หากให้อาหารที่มีแคลเซียมสูงเกินไป (เช่น ให้ Alfalfa hay หรือถั่วผักยาวแก่กระต่ายโตเต็มวัยต่อเนื่อง) จะเกิดตะกอนแคลเซียมสะสมในกระเพาะปัสสาวะ (Bladder sludge / Hypercalciuria) และเกิดนิ่วในทางเดินปัสสาวะ (Urolithiasis)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'exotic-emergencies-nursing': {
    topic: 'exotic-emergencies-nursing',
    title: 'Exotic Emergencies, Safe Environment & Ferret Nursing',
    lecturer: 'Exotic Emergency & Critical Care',
    icon: '🚨',
    summary: 'Emergency indicators in exotic pets, environmental safety & substrate hazards, sick ferret syringe feeding, gerbil sore nose & seizures.',
    sections: [
      {
        heading: 'Critical Emergency Indications in Exotic Pets',
        source: 'MSD Veterinary Manual (Table: Emergencies)',
        body: [
          'ภาวะฉุกเฉินวิกฤตที่ต้องได้รับการรักษาทางสัตวแพทย์ทันที:',
          { table: {
            headers: ['Emergency Category', 'Clinical Signs', 'Affected Species', 'Immediate Action / Triage'],
            rows: [
              ['Respiratory Distress', 'Open-mouth breathing, dyspnea, cyanosis', 'Birds, Rabbits, Reptiles', 'ให้ Oxygen therapy ทันที, ลดความเครียด, ห้ามป้อนอาหารปั่น'],
              ['Severe Trauma / Hemorrhage', 'Active bleeding, fracture, open wound', 'All exotic pets', 'Direct pressure, fluid resuscitation, warm environment'],
              ['GI Stasis / Tympanism', 'Severe pain, abdominal distension, teeth grinding', 'Rabbits, Chinchillas, Guinea pigs', 'Pain control (Meloxicam), warm fluids, rule out obstruction'],
              ['Hypoglycemic Collapse', 'Paws at mouth, weakness, seizures, coma', 'Ferrets (Insulinoma)', 'ทา Corn syrup / Dextrose ที่เหงือก, IV Dextrose'],
              ['Heat Stroke / Hyperthermia', 'Panting, salivation, collapse (temp >25°C)', 'Chinchillas, Gerbils', 'Cooling ด้วยผ้าชุบน้ำอุณหภูมิห้อง (ห้ามใช้น้ำแข็ง)'],
            ],
          } },
        ],
      },
      {
        heading: 'Safe Environment & Substrate Safety Guidelines',
        source: 'MSD Veterinary Manual (Table: Ensuring a Safe Environment)',
        body: [
          'หลักการจัดสิ่งแวดล้อมที่ปลอดภัยสำหรับสัตว์เลี้ยงพิเศษ:',
          { bullets: [
            '1. **Substrate Hazards**: หลีกเลี่ยงขี้เลื่อยไม้ซีดาร์และสน (cedar/pine shavings) เนื่องจาก **Aromatic phenols** ระเหยกระตุ้น Hepatic microsomal enzymes และระคายเคืองทางเดินหายใจ ควรใช้ขี้เลื่อยกระดาษ (paper-based bedding)',
            '2. **Humidity & Gerbil Sore Nose**: หนูเจอร์บิลต้องการความชื้นสัมพัทธ์ < 50% หากความชื้นสูงเกินไปจะทำให้ Harderian gland หลั่ง porphyrin มากผิดปกติ เกิด **Nasal dermatitis (Sore nose)** และติดเชื้อแบคทีเรียแทรกซ้อน',
            '3. **Wire Spacing & Enclosure**: ระยะห่างกรงต้องแคบพอป้องกันหัวติด และมีพื้นที่ออกกำลังกายเพียงพอ',
          ] },
        ],
      },
      {
        heading: 'Nutritional Support & Syringe Feeding for Sick Ferrets',
        source: 'MSD Veterinary Manual (Table: Feeding a Sick Ferret)',
        body: [
          'โปรโตรคอลการป้อนอาหารประคับประคองในเฟอร์เรตป่วย:',
          { bullets: [
            '1. **Strict Carnivore Requirement**: อาหารต้องมีโปรตีนสูง (35-40%), ไขมันสูง (20%) และคาร์โบไฮเดรต/ไฟเบอร์ต่ำมาก (< 3-5%)',
            '2. **Syringe Feeding Slurry**: ใช้อาหารเหลวพลังงานสูง (Carnivore Care / Hills a/d / Duck soup formula) อุ่นเท่าอุณหภูมิร่างกาย ป้อนทีละน้อย 5-10 mL ทุก 3-4 ชั่วโมง เพื่อป้องกันกระเพาะขยายตัวและสำลัก',
            '3. **Insulinoma Warning**: หากเกิดภาวะ Hypoglycemia ให้ทาน้ำเชื่อม Corn syrup ที่เหงือกก่อน แล้วตามด้วยอาหารโปรตีนสูงทันที **ห้ามป้อนคาร์โบไฮเดรตเชิงเดี่ยวอย่างเดียว** เพราะจะกระตุ้น Insulin surge ทำให้น้ำตาลตกซ้ำ',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'aquarium-water-quality-ph': {
    topic: 'aquarium-water-quality-ph',
    title: 'Aquarium Water Chemistry, pH Dynamics & Filter Maintenance',
    lecturer: 'Aquatic Animal Medicine',
    icon: '🐠',
    summary: 'Aquarium maintenance schedule, nitrifying bacteria protection, pH logarithmic scale, and ammonia toxicity dynamics.',
    sections: [
      {
        heading: 'Essential Aquarium Maintenance & Nitrogen Cycle Protection',
        source: 'MSD Veterinary Manual (Table: Essential Maintenance)',
        body: [
          'ตารางการดูแลตู้ปลาและการปกป้องจุลินทรีย์ในระบบกรองชีวภาพ (Biofilter):',
          { bullets: [
            '1. **Daily**: ตรวจอุณหภูมิน้ำ, สังเกตการกินอาหารและพฤติกรรมการว่ายน้ำของปลา, ตรวจการทำงานของปั๊มกรอง',
            '2. **Weekly / Bi-weekly**: เปลี่ยนถ่ายน้ำ **10-20%** ร่วมกับดูดตะกอนก้นตู้ (partial water change ช่วยลด Nitrate โดยไม่ทำลายกรองชีวภาพ)',
            '3. **Monthly Filter Cleaning**: ล้างวัสดุกรองใน **น้ำตู้ปลาเก่า** ที่ถ่ายออกเท่านั้น **ห้ามล้างด้วยน้ำประปาที่มีคลอรีนเด็ดขาด** เพราะคลอรีนจะฆ่าแบคทีเรีย *Nitrosomonas* และ *Nitrobacter* ในระบบกรอง ทำให้เกิด Ammonia spike',
          ] },
        ],
      },
      {
        heading: 'Explaining Water pH & Ammonia Toxicity Dynamics',
        source: 'MSD Veterinary Manual (Table: Explaining pH)',
        body: [
          'เคมีของน้ำ ความเป็นกรด-ด่าง (pH) และพยาธิสรีรวิทยาของแอมโมเนีย:',
          { bullets: [
            '1. **pH Scale**: เป็น Logarithmic scale (เปลี่ยน 1 หน่วย = ความเข้มข้น $H^+$ เปลี่ยน 10 เท่า) ปลาเขตร้อนชอบ pH 6.5–7.5, ปลา Cichlids ชอบ pH 7.8–8.5 (น้ำด่าง/น้ำแข็ง), ปลาทะเลชอบ pH 8.1–8.4',
            '2. **Ammonia Toxicity Shift**: เมื่อ pH สูงขึ้น (> 8.0) สัดส่วนของ **Unionized Ammonia ($NH_3$)** ซึ่งเป็นพิษรุนแรงต่อเหงือกและสมองจะเพิ่มขึ้นสูงมากเมื่อเทียบกับ **Ionized Ammonium ($NH_4^+$)** ที่เป็นพิษน้อยกว่า',
            '3. **pH Shock**: การเปลี่ยนค่า pH กะทันหัน (> 0.3-0.5 unit ในเวลาอันสั้น) ทำให้ปลาเกิด pH shock และระบบควบคุมแรงดันออสโมซิสล้มเหลว (osmoregulatory collapse)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'small-mammal-pig-zoonoses': {
    topic: 'small-mammal-pig-zoonoses',
    title: 'Zoonotic Diseases of Exotic Small Mammals & Pigs',
    lecturer: 'Exotic Zoonoses & Public Health',
    icon: '🦠',
    summary: 'Zoonoses transmitted from ferrets, rabbits, hamsters, gerbils, mice, and potbellied pigs to humans.',
    sections: [
      {
        heading: 'Zoonoses Spread from Ferrets & Rabbits to Humans',
        source: 'MSD Veterinary Manual (Tables: Diseases Spread from Ferrets & Rabbits)',
        body: [
          'โรคติดต่อจากเฟอร์เรตและกระต่ายสู่คน อ้างอิง MSD Veterinary Manual:',
          { table: {
            headers: ['Host Species', 'Zoonotic Pathogen / Disease', 'Transmission Mode', 'Human Manifestations & Clinical Notes'],
            rows: [
              ['Ferret', 'Human Influenza A & B', 'Respiratory droplets (bidirectional)', 'ไข้หวัดใหญ่ (ติดจากคนสู่เฟอร์เรต และเฟอร์เรตสู่คนได้)'],
              ['Ferret', '*Salmonella* spp. / *Campylobacter jejuni*', 'Fecal-oral, raw meat diet', 'ท้องเสีย คลื่นไส้ ปวดท้อง ไข้'],
              ['Ferret / Rabbit', 'Dermatophytosis (*Trichophyton* / *Microsporum*)', 'Direct contact with skin/fur', 'โรคกลาก ผื่นแดงคันขอบนูนบนผิวหนังคน'],
              ['Rabbit', 'Tularemia (*Francisella tularensis*)', 'Direct contact, bites, ticks/fleas', 'Rabbit fever: ไข้สูง ต่อมน้ำเหลืองโต แผลเปื่อยบริเวณที่ถูกกัด/สัมผัส'],
              ['Rabbit', 'Encephalitozoonosis (*E. cuniculi*)', 'Spore ingestion / inhalation', 'Microsporidiosis ในผู้ป่วยภูมิคุ้มกันบกพร่อง (HIV/transplant)'],
              ['Rabbit', 'Pasteurellosis (*Pasteurella multocida*)', 'Bites, scratches, contact', 'แผลติดเชื้ออักเสบรุนแรง (Cellulitis / abscess)'],
              ['Rabbit', 'Cheyletiellosis (*Cheyletiella parasitovorax*)', 'Direct contact with fur', 'Walking dandruff: ผื่นคันชั่วคราวบนผิวหนังคน (transient pruritic papules)'],
            ],
          } },
        ],
      },
      {
        heading: 'Zoonoses Spread from Rodents & Potbellied Pigs to Humans',
        source: 'MSD Veterinary Manual (Tables: Diseases Spread from Rodents & Pigs)',
        body: [
          'โรคติดต่อจากหนูเลี้ยง (Hamster, Gerbil, Mouse) และหมูแคระ (Potbellied Pig) สู่คน:',
          { table: {
            headers: ['Host Species', 'Zoonotic Pathogen / Disease', 'Transmission Mode', 'Human Manifestations & Clinical Notes'],
            rows: [
              ['Hamster / Mouse', 'LCMV (Lymphocytic Choriomeningitis Virus)', 'Urine, saliva, feces, transplacental', 'ไข้คล้ายไข้หวัดใหญ่, Aseptic meningitis, พิการแต่กำเนิดในทารกในครรภ์'],
              ['Gerbil / Hamster', 'Dwarf Tapeworm (*Hymenolepis nana*)', 'Ingestion of eggs from feces/bedding', 'พยาธิตัวตืดในเด็ก ท้องเสีย ปวดท้อง'],
              ['Mouse', 'Leptospirosis (*Leptospira* spp.)', 'Contact with urine-contaminated water', 'ไข้ฉี่หนู ปวดกล้ามเนื้อ ตัวเหลือง ตาแดง ไตวาย'],
              ['Mouse', 'Rat-Bite Fever (*Streptobacillus moniliformis*)', 'Bites, scratches, ingestion of waste', 'ไข้ ผื่น ปวดข้อ แผลเปื่อย'],
              ['Potbellied Pig', 'Erysipeloid (*Erysipelothrix rhusiopathiae*)', 'Direct contact with swine skin/wounds', 'แผลติดเชื้อผิวหนังสีม่วงแดง (Cellulitis/Erysipeloid), Endocarditis'],
              ['Potbellied Pig', 'Swine Influenza / *Streptococcus suis*', 'Respiratory / Contact with pig secretions', 'ไข้หวัดหมู, *S. suis* meningitis (เยื่อหุ้มสมองอักเสบ หูหนวก)'],
              ['Potbellied Pig', 'Brucellosis (*Brucella suis*)', 'Contact with reproductive tissues/fluids', 'ไข้แกว่ง (Undulant fever), ปวดข้อ, เหงื่อออกมืดค่ำ'],
            ],
          } },
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
    summary: 'Conservation medicine = One Health applied to biodiversity, 4 interfaces, surveillance ≠ research, case studies (LSD, rabies, HPAI, mange, malaria, poisoning), translocation framework',
    sections: [
      {
        heading: 'What is Conservation Medicine?',
        source: 'RolesVeterinarians.pdf p.4',
        body: [
          'Conservation medicine = interdisciplinary field examining reciprocal relationships among biodiversity, ecosystem integrity, animal health, and human health.',
          { bullets: [
            'Wildlife + Livestock + Humans + Environment (4-pillar)',
            'Key terms: One Health, Biodiversity, Ecosystem health, Spillover',
          ] },
        ],
      },
      {
        heading: '4 Interfaces (Wegner et al., 2022)',
        source: 'RolesVeterinarians.pdf p.6',
        body: [
          { bullets: [
            { label: 'Ecological', value: 'species overlap, habitat fragmentation' },
            { label: 'Epidemiological', value: 'pathogen transmission, spillover' },
            { label: 'Human-wildlife', value: 'conflict, encroachment' },
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
          { callout: '💡 Roadkill = passive surveillance proxy, ใช้ตรวจ rabies/AI ใน wildlife', kind: 'tip' },
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
            { label: 'Detection', value: 'carcass detection bias, scavenger removal, inaccessible terrain' },
            { label: 'Capture/Sampling', value: 'species behavior, stress risk, legal permits, endangered ethics' },
            { label: 'Diagnostic', value: 'postmortem degradation, small sample size, no baseline data' },
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
    summary: 'MSc/PhD comparison (USA vs EU/AUS), Residency boards (ACZM USA, ECZM EU, 5 specialties), Funding sources (national + international)',
    sections: [
      {
        heading: 'MSc / Master\'s Degree — USA vs EU/AUS',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.3',
        body: [
          { table: {
            headers: ['Aspect', 'USA', 'EU / AUS'],
            rows: [
              ['Requirement', 'GMAT/GRE/TOEFL, IEP/Pathway', 'IELTS, pre-sessional'],
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
            'Duration: **3 years** (ACZM), **3 yrs (max 6)** (ECZM)',
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
            '3. **Wildlife Population Health (WPH)** — free-ranging wildlife, disease surveillance + epi (minimal clinical)',
            '4. **Small Mammal** Medicine and Surgery',
            '5. **Zoo Health Management (ZHM)** — captive collection + preventive medicine + studbook',
          ] },
          { callout: '💡 WPH = field-level + population health, ZHM = facility-level + clinical zoo med', kind: 'tip' },
        ],
      },
      {
        heading: 'Funding Sources',
        source: 'ABOARD POST-GRADUATE Wildlife COURSES.pdf p.16',
        body: [
          { sub: 'National (Thailand)',
            body: [
              { bullets: [
                '**OCSC** (สำนักงาน ก.พ.) — รัฐบาลไทย, ocsc.go.th/scholarship',
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

  // ─────────────────────────────────────────────────────────────
  'rabbit-chinchilla-care': {
    topic: 'rabbit-chinchilla-care',
    title: 'Rabbit Breeds, Buying Checklist & Chinchilla Care',
    lecturer: 'Exotic Mammal Medicine',
    icon: '🐇',
    summary: 'Rabbit breed categories, physical examination checklist for new rabbits, and chinchilla dust bath & cooling requirements.',
    sections: [
      {
        heading: 'Breeds of Rabbits & Size Classification',
        source: 'MSD Veterinary Manual (Table: Breeds of Rabbits)',
        body: [
          'กระต่ายเลี้ยงจำแนกตามน้ำหนักและขนาดร่างกายเพื่อการดูแลและการให้อาหารที่เหมาะสม:',
          { table: {
            headers: ['Category', 'Adult Weight', 'Representative Breeds', 'Clinical / Husbandry Notes'],
            rows: [
              ['Dwarf / Small', '< 2 kg', 'Netherland Dwarf, Polish, Lionhead, Holland Lop', 'กระโหลกเล็ก เสี่ยงต่อ dental malocclusion สูง, BMR สูง'],
              ['Medium', '2–4 kg', 'Mini Rex, Dutch, Florida White, Havana', 'ขนาดมาตรฐานที่นิยมเลี้ยงในบ้าน'],
              ['Large', '4–5 kg', 'Rex, New Zealand White, Californian, English Lop', 'พันธุ์การค้า/ทดลอง ทนทาน'],
              ['Giant', '> 5 kg', 'Flemish Giant, French Lop, Checkered Giant', 'เสี่ยงต่อ pododermatitis (sore hocks) และโรคข้อเข่าเสื่อมสูง'],
            ],
          } },
        ],
      },
      {
        heading: 'Buying & Physical Exam Checklist for First-Time Rabbits',
        source: 'MSD Veterinary Manual (Table: Buying Your First Rabbit)',
        body: [
          'รายการตรวจร่างกายเบื้องต้นก่อนรับกระต่ายมาเลี้ยงเพื่อป้องกันโรคติดเชื้อและโรคฟัน:',
          { bullets: [
            '1. **Eyes**: แจ่มใส ไม่มีขี้ตาหรือน้ำตาไหลริน (no epiphora/discharge) ซึ่งบ่งบอกถึง dacryocystitis หรือฟันกรามยาวดันท่อน้ำตา',
            '2. **Nose**: แห้ง สะอาด ไม่มีมูกใส/หนอง (no mucopurulent nasal discharge) บ่งบอกถึง *Pasteurella multocida* (Snuffles)',
            '3. **Ears**: สะอาด ไม่มีสะเก็ดหนาหรือขี้หูสีน้ำตาลเข้ม บ่งบอกถึง *Psoroptes cuniculi* (Ear mite infestation)',
            '4. **Perineum & Fur**: ขนสะอาด บริเวณก้นไม่มีคราบอุจจาระติดเปรอะเปื้อน (no diarrhea/cecotrope staining) ป้องกัน flystrike',
            '5. **Incisors & Chin**: ฟันหน้าสบกันพอดี (no incisor malocclusion), คางแห้งไม่เปียกชื้น (no slobbers) จากโรคฟันกราม',
          ] },
        ],
      },
      {
        heading: 'Chinchilla Husbandry & Dust Bath Care Checklist',
        source: 'MSD Veterinary Manual (Table: Chinchilla Care Checklist)',
        body: [
          'ข้อควรปฏิบัติในการเลี้ยงและดูแลสุขภาพชินชิลล่า (Chinchilla):',
          { bullets: [
            '1. **Volcanic Dust Bath**: ต้องคลุกฝุ่นภูเขาไฟละเอียด (chinchilla dust) 2-3 ครั้ง/สัปดาห์ เพื่อขจัดไขมันและสิ่งสกปรกบนขน **ห้ามอาบน้ำด้วยน้ำเด็ดขาด** (ขนหนาแน่นมาก หากเปียกน้ำจะไม่แห้ง เกิดเชื้อราและขนพันกันเป็นก้อน)',
            '2. **Temperature Control**: ต้องเลี้ยงในอุณหภูมิเย็น (< 25°C / 77°F) เนื่องจากชินชิลล่าไม่มีต่อมเหงื่อ เสี่ยงต่อ **Heat stroke** รุนแรงหากอากาศร้อน',
            '3. **Dietary High-Fiber**: ให้หญ้าแห้ง (Timothy hay) แบบไม่จำกัด ร่วมกับ pellet คุณภาพสูง ป้องกัน GI stasis และฟันยาว (elodont/hypsodont)',
            '4. **Enclosure**: ต้องการกรงทรงสูงหลายชั้น (multi-level cage) สำหรับกระโดดเล่น พร้อมไม้ธรรมชาติสำหรับแทะ',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'rodent-fish-health': {
    topic: 'rodent-fish-health',
    title: 'Signs of Illness in Rodents, Fish & Small Animal Biting',
    lecturer: 'Lab Animal & Aquatic Medicine',
    icon: '🐭',
    summary: 'Clinical illness signs in mice, rats, and aquarium fish, plus biting triggers and handling protocols in small animals.',
    sections: [
      {
        heading: 'Signs of Illness in Mice & Rats',
        source: 'MSD Veterinary Manual (Tables: Signs of Illness in Mice & Rats)',
        body: [
          'การสังเกตอาการป่วยในหนูไมซ์ (Mice) และหนูแรท (Rats):',
          { table: {
            headers: ['Clinical Sign', 'Mice (Mouse)', 'Rats (Rat)', 'Potential Causes / Significance'],
            rows: [
              ['Posture & Appearance', 'Hunched posture, piloerection (ขนตั้ง)', 'Hunched posture, rough coat', 'Non-specific illness, pain, hypothermia'],
              ['Eye / Nose Discharge', 'Squinting, porphyrin staining', 'Red porphyrin tears (Chromodacryorrhea)', 'Harderian gland secretion จากความเครียด/ป่วย'],
              ['Respiratory Signs', 'Dyspnea, clicking sound', 'Rales, dyspnea, nasal clicking', 'Murine Respiratory Mycoplasmosis (*Mycoplasma pulmonis*)'],
              ['Physical Masses', 'Mammary adenocarcinoma', 'Mammary fibroadenoma (benign)', 'เนื้องอกเต้านม (พบสูงมากในหนูแรทเมีย)'],
              ['Neurological', 'Head tilt, circling', 'Head tilt, circling', 'Otitis media / inner ear infection / Pituitary adenoma'],
            ],
          } },
        ],
      },
      {
        heading: 'Common Signs of Illness in Aquarium Fish',
        source: 'MSD Veterinary Manual (Table: Common Signs of Illness in Fish)',
        body: [
          'อาการป่วยและพฤติกรรมผิดปกติในปลาสวยงาม (Aquarium Fish):',
          { bullets: [
            '1. **Behavioral**: ลอยหัวฮุบอากาศผิวน้ำ (gasping at surface -> hypoxia/ammonia toxicity), ถูตัวกับวัตถุ/หิน (flashing -> ectoparasites), ว่ายหมุน/เสียการทรงตัว (whirling/swim bladder disease), หุบครีบ (clamped fins)',
            '2. **Physical / Skin**: จุดขาวคล้ายเกลือเม็ดบนตัว/ครีบ (*Ichthyophthirius multifiliis* / Ich), ครีบเปื่อย/เปื่อยรุ่ย (Fin rot / *Columnaris*), เกล็ดตั้งพองคล้ายลูกสน + ท้องบวม (Pinecone scales / Dropsy -> bacterial septicaemia), แผลเปื่อยบนผิวหนัง (skin ulcers)',
          ] },
        ],
      },
      {
        heading: 'Biting Triggers & Safe Handling in Small Animals',
        source: 'MSD Veterinary Manual (Table: Biting)',
        body: [
          'สาเหตุการกัดและการจับบังคับสัตว์เล็กอย่างปลอดภัย:',
          { bullets: [
            '1. **Triggers**: ความกลัว (fear/defense), ความเจ็บปวด (pain), การปกป้องถิ่น (territoriality), การหวงลูก (maternal), และการจับบังคับไม่ถูกวิธี',
            '2. **Handling Rules**: ห้ามต้อนสัตว์จนมุม (cornering), ใช้ผ้าขนหนูช่วยห่อบังคับ (towel restraint) ในนกและแมว',
            '3. **Rabbit Handling**: ต้องรองรับสะโพกและหลังเสมอ (support hindquarters) ป้องกัน **Lumbar vertebral fracture (L7 dislocation)** จากการดิ้นสะบัดขาหลัง',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'reptile-lifespan-husbandry': {
    topic: 'reptile-lifespan-husbandry',
    title: 'Captive Reptile Lifespan & Species Husbandry',
    lecturer: 'Herpetological Medicine',
    icon: '🦎',
    summary: 'Average lifespans of captive snakes, lizards, and tortoises, and species-specific husbandry requirements.',
    sections: [
      {
        heading: 'Average Life Span of Reptiles in Captivity',
        source: 'MSD Veterinary Manual (Table: Average Life Span of Reptiles in Captivity)',
        body: [
          'อายุขัยเฉลี่ยในสถานเลี้ยงของสัตว์เลื้อยคลานชนิดต่างๆ อ้างอิง MSD Veterinary Manual:',
          { table: {
            headers: ['Reptile Group', 'Common Species Name', 'Average Lifespan', 'Clinical & Husbandry Considerations'],
            rows: [
              ['Snakes', 'Ball python', '20–30 yrs', 'ให้อาหารเหยื่ออุ่น ป้องกัน anorexia จากความเครียด/อุณหภูมิเย็นเกินไป'],
              ['Snakes', 'Corn snake / King snake', '15–20 yrs', 'เลี้ยงง่าย ทนทาน เหมาะกับผู้เริ่มต้น'],
              ['Snakes', 'Boa constrictor', '20–30 yrs', 'ขนาดใหญ่ ต้องการพื้นที่กรงกว้างขวาง'],
              ['Lizards', 'Bearded dragon', '10–15 yrs', 'ต้องการแสง UVB สูง และอาหารผสมผัก+แมลง เสี่ยงต่อ MBD'],
              ['Lizards', 'Leopard gecko', '15–20 yrs', 'Nocturnal (ไม่ต้องแสง UVB สูงมาก) หางสะสมไขมัน'],
              ['Lizards', 'Green iguana', '15–20 yrs', 'Herbivorous ต้องการใยอาหารสูงและ UVB เข้มข้น ตัวใหญ่เมื่อโต'],
              ['Lizards', 'Veiled chameleon', '5–8 yrs', 'อายุขัยสั้น ไวต่อความเครียด ต้องการหยดน้ำเคลื่อนไหว (dripper system) ไม่ดื่มน้ำนิ่ง'],
              ['Turtles / Tortoises', 'Red-eared slider', '20–40 yrs', 'ต้องการพื้นที่ว่ายน้ำ + Basking area เสี่ยงต่อ Vit A deficiency และ shell rot'],
              ['Turtles / Tortoises', 'Box turtle / Russian tortoise', '30–50+ yrs', 'อายุยาวนาน ต้องการพื้นที่เดินสำรวจและกรงภายนอก'],
              ['Turtles / Tortoises', 'Sulcata tortoise', '50–100+ yrs', 'เต่าบกขนาดใหญ่มาก ต้องการพื้นที่กว้างขวาง อารมณ์แข็งแรง ปิรามิดเกล็ดกระดูกจากการขาด UVB/Ca'],
            ],
          } },
        ],
      },
    ],
  },
};
