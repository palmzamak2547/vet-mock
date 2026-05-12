// ============================================================
// Y5 Equine Medicine & Surgery Study Notes (3106510) — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// Source: slide-deck headings + 1-3 page outlines per topic
// (extracted from C:\Users\palmz\Downloads\Year5\extracted\term 1\equine med surg\)
//
// Course director + main lecturer: Teerapol Chinkangsadarn (TC) — infectious dz,
// lameness, diagnostic analgesia, hoof, tendon, GI (anatomy/exam/mgmt),
// dentistry, respiratory
// Guest lecturers: Thapana Jarutummasiri (nutrition), Piyanan Taweethavonsawat
// (parasites), Weerapongse Tangjitjaroen (acupuncture), Suphannika Phutthachalee
// (KKU — neonatal), Aree Laikul (KU — colic mgmt, surgical colic, tumors, LapOVE),
// Nalinee Tuntivanich (ophthalmology), Piyanan Tawiparsanan (dentistry-related/ortho)
//
// Body item types: same schema as notes-com5.js
//   string                                — paragraph
//   { bullets: [...] }                     — bulleted list
//   { sub, body }                          — sub-section
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
//
// IRON RULE 0: ห้าม fabricate. ถ้าหน้า 1-3 ยังไม่ลงรายละเอียด → ใส่ '🚧 รอเติม'
// แทนการเดาเนื้อหา. Source-cite ทุก section.
// ============================================================

export const NOTES_Y5_EQUINE_MEDICINE = {
  // ─────────────────────────────────────────────────────────────
  'equine-intro': {
    topic: 'equine-intro',
    title: 'Course intro — Equine Medicine & Surgery (3106510)',
    lecturer: 'Teerapol Chinkangsadarn (course director)',
    icon: '📖',
    summary: 'Welcome + meet team (course director + 3 CU lecturers + 4 guest lecturers). Grading 70% สอบ + 10% เข้าเรียน + ที่เหลือ. Exam style = MCQ + case-based; lameness ใช้ฟอร์ม POA + case ออกสอบรวม.',
    sections: [
      {
        heading: 'Welcome + course code',
        source: '1 - Intro 67.pdf p.1',
        body: [
          { bullets: [
            'Course: Equine medicine and Surgery — code **3106 510**',
            'Note ในสไลด์: lameness เป็นหัวข้อยาก ออกสอบเป็น case-based · ม้ารวมๆ กลับ lameness',
            'Grading note: **70% สอบ + 10% เข้าเรียน** (ที่เหลือ activity/case)',
            'ออกสอบเรื่อง vet กับการขี่ม้า/เชือก/อุปกรณ์ → ตอนฝึกงานเทอมหน้า',
          ] },
        ],
      },
      {
        heading: 'Course director + Vet CU lecturers',
        source: '1 - Intro 67.pdf p.2',
        body: [
          { bullets: [
            '**รศ.น.สพ.ดร. ปิยะนันท์ ทวีถาวรสวัสดิ์** — full anesthesia',
            '**รศ.น.สพ.ดร. สุมิตร ดุรงค์พงษ์ธร**',
            '**ผศ.สพ.ญ.ดร. นลินี ตันติวนิช** — ophthalmology',
            '**น.สพ.ดร. ธีรพล ชินกังสดาร** (Teerapol C.) — อาจารย์ผู้ดูแลรายวิชา',
            'Note: field anaesthesia ในม้า = **knock-them-down anes** (AUS style) → ตอนฝึกงานเทอมหน้า',
          ] },
        ],
      },
      {
        heading: 'Guest lecturers',
        source: '1 - Intro 67.pdf p.3',
        body: [
          { bullets: [
            '**น.สพ. ฐาปนา จารุธรรมสิริ** (Zoo.one.siri) — nutrition · "ออกข้อสอบเกตร"',
            '**ผศ.น.สพ.ดร. วีระพงษ์ ตั้งจิตเจริญ** — acupuncture',
            '**ผศ.สพ.ญ. สุพรรณิกา พุทธชาลี** — คณะสัตวแพทย์ ม.ขอนแก่น · ลูกม้า/neonatal',
            '**สพ.ญ. ทศร สง่างาม** — รพส. จุฬา นครปฐม',
          ] },
        ],
      },
      {
        heading: 'Exam format hints (จากสไลด์ + handwritten note)',
        source: '1 - Intro 67.pdf p.1 + course chatter',
        body: [
          { bullets: [
            'Final รวม **infectious dz + POA + lameness + ทุกอย่างรวมกัน** (case-based)',
            'POA ออกสอบตอน final ~2 ข้อ',
            'Mock exam ก่อนสอบจริง — ต้อง sign in account มหาลัย',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-nutrition': {
    topic: 'equine-nutrition',
    title: 'Equine nutrition — Basic + What diet provides + Feeds',
    lecturer: 'Thapana Jarutummasiri (Zoo One Siri)',
    icon: '🌾',
    summary: 'นิยาม nutrition + Equine Well-being Triad (Genetic / Management / Nutrition) + BCS (1-9) + Topline Evaluation Score (TES) → BCS 5 ฝ้ายอ่อน, BCS 7-9 = obese · same breed/age/sex/env ก็ต้องการอาหารต่างกันได้ (genetic + history + intrauterine).',
    sections: [
      {
        heading: 'Basic Nutrition for Your Partner — opening',
        source: '2 - Nutrition_CU_2024.pdf p.1-2',
        body: [
          { bullets: [
            'Speaker: **Thapana Jarutummasiri, D.V.M.** — ZOO ONE SIRI Equine Ambulatory Services',
            '"The best feed of a horse is his master\'s eye" — เจ้าของต้องสังเกตม้าเองเป็น',
            'Nutrition: ทุกคนสำคัญหมด (ทั้ง vet + เจ้าของ + groom)',
          ] },
        ],
      },
      {
        heading: 'Equine Well-being Triad',
        source: '2 - Nutrition_CU_2024.pdf p.3',
        body: [
          { bullets: [
            '**Genetic** — เลือกไม่ได้ มีปัจจัยเสี่ยงโดยกำเนิด',
            '**Management** — การดูแลรายวัน',
            '**Nutrition** — ที่เน้นในคาบนี้',
            'ม้าใช้สุขภาพดี = 3 มุมนี้ต้องครบ',
          ] },
        ],
      },
      {
        heading: 'Importance of Equine Nutrition',
        source: '2 - Nutrition_CU_2024.pdf p.4',
        body: [
          { bullets: [
            'ม้าตามธรรมชาติ = หากินเองอยู่ในทุ่งหญ้า กินหญ้าทุกวัน (free-range grazer)',
            'แต่ ม้าบ้าน/ม้าเลี้ยง = กินอาหารตามที่เราจัด → ขาด/เกินได้',
            'TH ร้อนชื้น: ม้าจะชอบ temp 20°C humidity 40% → ในบ้านเราต้องระวัง',
            '**Laminitis stance** + ฟันงอก (จากอาการ) เป็น sign ของม้าอ้วน',
          ] },
        ],
      },
      {
        heading: 'Individual variation — same parameters, different needs',
        source: '2 - Nutrition_CU_2024.pdf p.5',
        body: [
          { bullets: [
            'Same breed / age / sex / environment / health / activity → Nutritional requirements **may still differ** between individuals',
            'ตัวแปร: **Genetics** (ex. metabolic horse) · **History** (ex. previous pain) · **Intrauterine events** (nutritional status of the mare)',
            'TH เลย: ยกธรรมชาติเข้าเป็นเล็กที่สุด · ภัยพิบัติ ออก ตัดเชื้อก่อน',
          ] },
        ],
      },
      {
        heading: 'BCS + TES — Scoring Your Horse',
        source: '2 - Nutrition_CU_2024.pdf p.6-9',
        body: [
          { bullets: [
            '**Body Condition Score (BCS)** — Fat Thickness, scale 1-9',
            '**Topline Evaluation Score (TES)** — Muscle Development → Amino Acid Balance + Genetics + Training Level',
            'BCS linked → Calories · TES linked → Protein',
            'BCS 5 = ฝ้ายอ่อน (ปกติ), BCS 7-9 = obese, BCS 1-3 = emaciate',
            'BCS + TES ไม่จำเป็นต้องเหมือนกัน → ex. คนใหญ่ fat แต่ไม่ค่อย trained · muscle ก็ต้องการ TES มากกว่า',
          ] },
        ],
      },
      {
        heading: 'รายละเอียดต่อ (slides 10+) — diet provides / feeds',
        source: '2.5 - What_must_diet_provide___CU_2024.pdf + Feeds_for_horse___CU_2024.pdf',
        body: [
          { bullets: [
            '🚧 รอเติม — จาก slides 10+: water · energy (DE) · protein (AA) · vitamins/minerals · forage:concentrate ratio · feeding behavior',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-infectious': {
    topic: 'equine-infectious',
    title: 'Equine infectious diseases & vaccination',
    lecturer: 'Teerapol Chinkangsadarn',
    icon: '🦠',
    summary: 'Outline 4 หมวด: Virus (Rabies / AHS / EHV / EIA / EI / EE / JE) · Bacteria (Strangles / Tetanus / Glanders / CEM) · Protozoa (Trypanosomiasis / Equine piroplasmosis) · Fungi (Pythiosis / Guttural pouch mycosis). เน้น viral disease ที่ "เจอใน TH".',
    sections: [
      {
        heading: 'Course / lecturer intro',
        source: '3 - Eq_inf_dz_67.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine infectious disease and vaccination**',
            'Speaker: Teerapol T Chinkangsadarn — DVM PhD DTBVS',
            'CUVET department',
          ] },
        ],
      },
      {
        heading: 'Outline — agents 4 หมวด',
        source: '3 - Eq_inf_dz_67.pdf p.2',
        body: [
          { sub: 'Virus',
            body: [
              { bullets: [
                'Rabies',
                'African Horse Sickness (AHS)',
                'Equine Herpesvirus (EHV)',
                'Equine infectious Anemia (EIA)',
                'Equine Influenza (EI)',
                'Equine Encephalomyelitis (EE)',
                'Japanese encephalitis (JE)',
              ] },
            ] },
          { sub: 'Bacteria',
            body: [
              { bullets: [
                'Strangles (Streptococcus equi)',
                'Tetanus',
                'Glanders',
                'Contagious equine metritis (CEM)',
              ] },
            ] },
          { sub: 'Protozoa',
            body: [
              { bullets: [
                'Trypanosomiasis (Surra)',
                'Equine Piroplasmosis (Babesia / Theileria)',
              ] },
            ] },
          { sub: 'Fungi',
            body: [
              { bullets: [
                'Equine Pythiosis (technically oomycete)',
                'Guttural pouch mycosis',
              ] },
            ] },
        ],
      },
      {
        heading: 'Viral disease (เน้นที่เจอใน TH)',
        source: '3 - Eq_inf_dz_67.pdf p.3',
        body: [
          { bullets: [
            'List ซ้ำจาก outline — แต่ TC ระบุว่าจะ deep-dive เน้นที่ "เจอใน TH"',
            'Rabies + AHS + EHV + EIA + EI + EE + JE',
          ] },
          { callout: 'AHS — outbreak ใหญ่ TH 2020 ตายเยอะ → notifiable disease', kind: 'flag' },
        ],
      },
      {
        heading: 'Deep-dive แต่ละ agent + vaccination schedule',
        source: '3 - Eq_inf_dz_67.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — slide 4+ ยังไม่ได้เปิด: pathogenesis · CS · Dx · Tx · vaccine schedule (core vs risk-based)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-parasites': {
    topic: 'equine-parasites',
    title: 'Equine parasites in Thailand',
    lecturer: 'Piyanan Taweethavonsawat',
    icon: '🪱',
    summary: 'วัตถุประสงค์: อธิบายความสำคัญของโรคปรสิตในม้าใน TH + อธิบายความก่อโรคของปรสิตตามอวัยวะ. Outline 4 หมวด: GI parasite · Blood parasite · Skin disease · Eyes disease due to parasite.',
    sections: [
      {
        heading: 'Course intro — speaker',
        source: '4 - equine_med_2024.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine Parasites in Thailand**',
            'Speaker: Assoc.Prof.Dr. **Piyanan Taweethavonsawat** — DVM, M.Sc., Ph.D., DTBVP',
            'หน้าปกแสดงม้าฝูง outdoor → context = pasture/grazing horses',
          ] },
        ],
      },
      {
        heading: 'วัตถุประสงค์ (โรคปรสิตหนอนพยาธิในม้า)',
        source: '4 - equine_med_2024.pdf p.2',
        body: [
          { bullets: [
            'สามารถอธิบายความสำคัญของโรคปรสิตในม้าในประเทศไทย',
            'สามารถอธิบายความก่อโรคที่เกิดจากปรสิตที่อยู่ตามอวัยวะต่างๆ ของม้า',
          ] },
        ],
      },
      {
        heading: 'Outline — 4 หมวดตามอวัยวะ',
        source: '4 - equine_med_2024.pdf p.3',
        body: [
          { bullets: [
            '**GI parasite** — หนอนพยาธิทางเดินอาหาร (Strongyles · Parascaris · Strongyloides · Anoplocephala · Oxyuris · bots/Gasterophilus)',
            '**Blood parasite** — Trypanosoma · Babesia/Theileria',
            '**Skin disease due to parasite** — ectoparasites (lice · mites · ticks · Habronema)',
            '**Eyes disease due to parasite** — Thelazia · Habronema/Draschia · Onchocerca',
          ] },
          { callout: 'Outline page เท่านั้น p.1-3 — รายละเอียดต่อปรสิต อยู่ slide 4+', kind: 'tip' },
        ],
      },
      {
        heading: 'รายละเอียดแต่ละหมวด',
        source: '4 - equine_med_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — life cycle · CS · Dx · Tx · anthelmintic resistance · deworming schedule',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-acupuncture': {
    topic: 'equine-acupuncture',
    title: 'Veterinary Acupuncture in Equine Practice',
    lecturer: 'Weerapongse Tangjitjaroen (CVA — Certified Vet Acupuncturist)',
    icon: '🪡',
    summary: 'Intro to TCVM (Traditional Chinese Veterinary Medicine) → 3 หมวดในคาบ: TCVM in brief · TCVM essentials · Case examples. Note บนสไลด์: ออกสอบ choice ~20 ข้อ.',
    sections: [
      {
        heading: 'Title + speaker',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.1',
        body: [
          { bullets: [
            'Title: **Introduction to Veterinary Acupuncture in Equine Practice**',
            'Speaker: **Weerapongse Tangjitjaroen** — DVM, CVA, PhD',
            'Note บน slide (handwritten): "ออก choice 20 ข้อ"',
          ] },
        ],
      },
      {
        heading: 'Covering topics (3 หมวด)',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.2',
        body: [
          { bullets: [
            '**TCVM in brief** = Traditional Chinese Veterinary Medicine — context, philosophy',
            '**TCVM essentials** — Yin-Yang · 5 elements · meridians · acupoints',
            '**Case examples** — clinical applications ในม้า',
            'รูปประกอบ: case ไก่ที่ใช้ electroacupuncture (technique generalizable)',
          ] },
        ],
      },
      {
        heading: 'Reference textbooks (สไลด์โชว์)',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.3',
        body: [
          { bullets: [
            '**Xie\'s Veterinary Acupuncture** (Huisheng Xie & Vanessa Preast) — main reference',
            '**Veterinary Acupuncture: Ancient Art to Modern Medicine** (Allen M. Schoen, 2nd ed)',
            'ตำราแพทย์จีน (TH translation)',
          ] },
        ],
      },
      {
        heading: 'TCVM theory + cases',
        source: '5 - Acupuncture_BW_Sep_2024_CU_.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Yin/Yang/Qi · meridians · acupoint techniques · equine-specific points · dry needle vs electroacupuncture · indications (lameness, GI, behavior) · case-based examples',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-lameness': {
    topic: 'equine-lameness',
    title: 'Equine lameness — An introduction + Diagnostic analgesia',
    lecturer: 'Teerapol Chinkangsadarn',
    icon: '🐎',
    summary: 'Lameness = symptom (ไม่ใช่โรคต่อ); ต้อง "Assume nothing and question everything". Diagnostic analgesia = the most valuable tool to localize lameness. Approach: baseline (visual + palpation) → perineural / intra-articular / intra-bursal / specific site blocks.',
    sections: [
      {
        heading: 'Definition + History',
        source: '1 - _Eq_lame.pdf p.1-3',
        body: [
          { bullets: [
            'Speaker: TC (Teerapol C.)',
            '**Liautard 1888 quote**: "If your horse is lame in his shoulder, take off his shoes…" — เตือนว่าตอน Dx อย่าข้าม foot',
            '**Lameness ≠ disease**; it is a *symptom*/manifestation of vital physical lesion affecting locomotive apparatus',
            'Lameness vs soundness — สำคัญแยกให้ออก',
            'Note (handwritten): "Assume nothing and question everything!!!"',
          ] },
        ],
      },
      {
        heading: 'Diagnostic analgesia — Basic considerations',
        source: '2 - _Diagnostic_analgesia_in_horses.pdf p.1-2',
        body: [
          { bullets: [
            'Speaker: Teerapol C. DVM PhD DTBVS',
            '**Local anaesthetics** — เลือกชนิด, onset, duration ให้เหมาะ',
            '**Pharmacology / Tissue interactions** — ฉีดแล้วแพร่ไปอยู่ไหนบ้าง',
            'Review **regional anatomy** ก่อนทำเสมอ',
            'Diagnostic analgesia = the most valuable tool to localize lameness — แต่ต้อง technique ดี + clinical experience',
          ] },
        ],
      },
      {
        heading: '4 routes ของ diagnostic analgesia',
        source: '2 - _Diagnostic_analgesia_in_horses.pdf p.2',
        body: [
          { bullets: [
            '**Perineural** (nerve block) — ฉีดรอบเส้นประสาท',
            '**Intra-articular** — เข้า joint',
            '**Intra-bursal** — ex. navicular bursa',
            '**Specific site** — ex. splint bone',
          ] },
        ],
      },
      {
        heading: 'Baseline establishment — Visual + Palpation',
        source: '2 - _Diagnostic_analgesia_in_horses.pdf p.3',
        body: [
          { bullets: [
            'FULL clinical examination ก่อนเสมอ',
            '**VISUAL** — LOOK! (swellings / wounds / shod or unshod / asymmetry)',
            '**PALPATION** — FEEL! (Heat / pain / swelling / hoof testers)',
            'ทำให้ครบก่อน → ไม่ข้าม',
          ] },
        ],
      },
      {
        heading: 'Approach + nerve blocks detail',
        source: '1 - _Eq_lame.pdf + 2 - Diagnostic_analgesia p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — full gait evaluation · AAEP lameness scale (0-5) · flexion tests · low PD / abaxial / low 4 / high 4 / median-ulnar / TMR blocks · troubleshooting false +/−',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-hoof': {
    topic: 'equine-hoof',
    title: 'Pathologic conditions of the equine foot',
    lecturer: 'Teerapol Chinkangsadarn',
    icon: '🐴',
    summary: 'External anatomy + ground surface anatomy ก่อน → pathologic conditions (laminitis · navicular · abscess · canker · thrush · cracks). หมายเหตุ TC: "ปัญหาที่ foot ~60% ของ lameness cases".',
    sections: [
      {
        heading: 'Lecture title + scope',
        source: '3 - _Eq_pathologic_of_hoof.pdf p.1',
        body: [
          { bullets: [
            'Title: **Pathologic condition of equine foot**',
            'Speaker: Teerapol C. DVM PhD DTBVS',
            'Note (handwritten): "ปัญหาเท้าหมา (~60%) ตอนจะอยู่ตามครีบ" — เน้นว่าหา lameness ส่วนใหญ่จบที่ foot',
          ] },
        ],
      },
      {
        heading: 'External structure of the hoof (lateral view)',
        source: '3 - _Eq_pathologic_of_hoof.pdf p.2',
        body: [
          { bullets: [
            '1. **Heel bulb** — ปลายหลัง',
            '2. **Periople at the heel**',
            '3. **Heel**',
            '4. **Quarter** — ด้านข้าง',
            '5. **Toe** — ปลายหน้า',
            '6. **Periople** (ส่วนติด coronary band)',
            '7. **Coronary band**',
          ] },
        ],
      },
      {
        heading: 'Ground surface structure (sole view)',
        source: '3 - _Eq_pathologic_of_hoof.pdf p.3',
        body: [
          { bullets: [
            '1. **Frog** — rubbery wedge-shaped structure positioned between the bars (ลิ่มยาง — ดับเสียง/กระแทก)',
            '2. **Bars** — 2 bars ข้างละข้างของ frog',
            '3. **Sole** — ครอบบุของ foot',
            '4. **White line** — interconnected lamina (จุดแยก sensitive vs non-sensitive lamina; ถ้ามีปาก/ตอกตะปูแล้วไม่เลย white line = เป็น sensitive lamina จะเจ็บ)',
            '5. **Walls** — โครงสร้างเดียวกับเล็บคน',
          ] },
        ],
      },
      {
        heading: 'Pathologic conditions',
        source: '3 - _Eq_pathologic_of_hoof.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — laminitis (acute/chronic, rotation, founder) · navicular syndrome · sub-solar abscess · canker · thrush · quarter/heel cracks · hoof wall avulsion · keratoma',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-tendon': {
    topic: 'equine-tendon',
    title: 'Tendon / Ligament injuries and treatments',
    lecturer: 'Teerapol Chinkangsadarn (with material courtesy Dr. Cedric Chang, HKJC)',
    icon: '💪',
    summary: '"Bowed tendon" / sprain เจอเยอะในม้าฝึก — incidence 18-48% (อาจถึง 80% in training). Recurrence สูงมาก **30-87.5%**. Tendinopathies: SDFT (Fore >> Hind) · Suspensory lig · Inferior check lig · DDFT (rare) · others (biceps, ext, calcaneal).',
    sections: [
      {
        heading: 'Title + speaker',
        source: '4 - _Tendon_injuries_and_treatments.pdf p.1',
        body: [
          { bullets: [
            'Title: **Tendon/Ligament injuries and treatment**',
            'Speaker: Teerapol C. DVM PhD',
            'Material courtesy: Dr. Cedric Chang, **HKJC** (Hong Kong Jockey Club)',
          ] },
        ],
      },
      {
        heading: 'Incidence',
        source: '4 - _Tendon_injuries_and_treatments.pdf p.2',
        body: [
          { bullets: [
            '"**Bowed tendon**" / sprain — common in racehorse / training',
            '**18% (Japan) – 48% (Marr et al. 1993)** of horses in training; possibly **80%?**',
            'True incidence unclear (อาจ underreport)',
            '**Recurrence 30-87.5%** — ผ่านครั้งแรกแล้วเสี่ยงเป็นซ้ำสูง',
            'มักเจอใน "ม้าฝึก/training" → กระดูก vs เอ็นการลดสมดุล',
          ] },
        ],
      },
      {
        heading: 'Tendinopathies — anatomical breakdown',
        source: '4 - _Tendon_injuries_and_treatments.pdf p.3',
        body: [
          { bullets: [
            '**SDFT** (Superficial Digital Flexor Tendon) — **Fore >> Hind**',
            '**Suspensory ligament** — Fore ≥ Hind ใน flat racehorses · Hind ≥ Fore ใน trotters + show jumpers',
            '**Inferior check ligament** — มักเข้าลำตอน 70-80% (ม้าเข้าลำตาก)',
            '**DDFT** (Deep Digital Flexor Tendon, tenosynovitis) — RARE',
            '**Others**: biceps, extensor, calcaneal',
          ] },
        ],
      },
      {
        heading: 'Pathology + Tx',
        source: '4 - _Tendon_injuries_and_treatments.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — pathophysiology (collagen damage → fibrosis) · grading (US bands) · Tx options (rest · cold/laser/SWT · IRAP / PRP / stem cell injections · platelets · controlled rehab · prognosis return-to-race rates)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-anesthesia': {
    topic: 'equine-anesthesia',
    title: 'Equine anesthesia (2024)',
    lecturer: 'Piyanun Tawiparsanan (course director — full anes) / Thapana Jarutummasiri (field anes)',
    icon: '💉',
    summary: 'แบ่ง 2 ส่วน: full anesthesia (in-hospital, GA + recovery) · field anesthesia (knock-them-down anes, AUS style). Source PDF ใหญ่ >100MB ไม่สามารถเปิดสไลด์ได้ — ใช้เนื้อหา anchored จาก intro slide deck + course chatter เท่านั้น.',
    sections: [
      {
        heading: 'Course position (จาก Intro deck)',
        source: '1 - Intro 67.pdf p.2 (anes annotation)',
        body: [
          { bullets: [
            '**Full anes** — ใน hospital, GA + recovery (รับผิดชอบโดย รศ.น.สพ.ดร. ปิยะนันท์ ทวีถาวรสวัสดิ์)',
            '**Field anes** ในม้า = "knock-them-down anes" (AUS-style) — ใช้ตอนฝึกงานเทอมหน้า',
          ] },
        ],
      },
      {
        heading: 'แหล่งอ่านสำรอง — สรุป Equine Med (mid) + สรุป Anes พี่อันนา',
        source: 'midterm/สรุป + สรุป/ + final/สรุป + สรุป/Equine Med สรุปนี้Anes.pdf',
        body: [
          { bullets: [
            'PDF 6 - 2024 Equine Anesthesia .pdf >100MB → ไม่สามารถ extract pages ได้',
            'มี **"สรุป Anes พี่อันนา ตรงมากแบบเป็นไม้บรรทัด"** ใน final/สรุป + สรุป/ → ใช้อ่านเสริม',
            'มี **"Equine Med สรุปนี้Anes.pdf"** เพิ่มเติม',
          ] },
        ],
      },
      {
        heading: 'หัวข้อมาตรฐาน equine anesthesia (ขอบเขตคาด)',
        source: 'ทั่วไป — รอเปิดสไลด์จริงที่ลดขนาดแล้ว',
        body: [
          { bullets: [
            '🚧 รอเติม — pre-anesthetic assessment (BCS, blood, sedation choice) · sedation/standing chemical restraint (α-2 + opioid) · induction (ketamine + diazepam vs guaifenesin) · maintenance (TIVA — triple drip; or inhalant) · recovery (assisted vs unassisted; main mortality risk!) · field anes considerations · post-anes myopathy/neuropathy · monitoring (HR, RR, MAP, SpO2)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-dentistry': {
    topic: 'equine-dentistry',
    title: 'Equine dentistry',
    lecturer: 'Teerapol Chinkangsadarn ("Tum")',
    icon: '🦷',
    summary: 'Intro: ทำไม dental สำคัญในม้า (มันบุญไม่ได้ → ต้องหา sign เอง) · Dental morphology (anatomy + physiology) · Dental nomenclature · Ageing change in dentition. Key concepts: hypsodont (high-crown) + reserve crown · anisognathism (upper arcade 30% wider than lower) · infundibulum (incisors + upper cheek teeth only).',
    sections: [
      {
        heading: 'Title + speaker',
        source: '7 - Equine_dent_CU_2024.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine Dentistry**',
            'Speaker: **Tum Chinkangsadarn** — D.V.M. PhD DTBVS',
            'หน้าปก: image with cadaver skull + dental endoscope',
          ] },
        ],
      },
      {
        heading: 'Introduction to dentistry — 4 หัวข้อหลัก',
        source: '7 - Equine_dent_CU_2024.pdf p.2',
        body: [
          { bullets: [
            'Why dental is important for equine vet — ม้าบ่นเองไม่ได้ ต้องหาเอง',
            '**Dental morphology**: Dental Anatomy + Dental Physiology',
            '**Dental nomenclature** — ระบบเขียนชื่อ position',
            '**Ageing change in dentition** — ดูอายุม้าจากฟัน',
          ] },
        ],
      },
      {
        heading: 'Dental anatomy — Hypsodont + Anisognathism',
        source: '7 - Equine_dent_CU_2024.pdf p.3',
        body: [
          { bullets: [
            '**Hypsodont dentition** (High crown teeth) — peripheral crown cementum + reserve crown',
            'Reserve crown = ส่วนที่ฝัง alveolus ค่อยๆ erupt ออกมาตลอดอายุ',
            '**"Anisognathism"** — upper cheek teeth arcade **30% wider** than lower',
            'ผลของ anisognathism: lower mandible เคลื่อนข้าง → wear pattern → wave/step mouth, hooks',
            '**Infundibulum** — only ใน incisors + upper cheek teeth (**lower cheek teeth ไม่มี!**)',
            'Layered: peripheral enamel → central enamel → central cement → dentin → pulp cavity',
            'Pulp cavity — overlaid by **dental star** (secondary dentin) เมื่อฟันสึก',
          ] },
        ],
      },
      {
        heading: 'Dental nomenclature + ageing + pathology',
        source: '7 - Equine_dent_CU_2024.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Triadan numbering (101-411) · eruption schedule · Galvayne\'s groove · cup/star/ring change · common pathology (sharp enamel points, hooks, ramps, wave/step mouth, EOTRH, apical infection, EORTH) · floating · extraction techniques',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-gi': {
    topic: 'equine-gi',
    title: 'Equine GI — Anatomy + Physiology + Exam + Medical mgmt',
    lecturer: 'Teerapol Chinkangsadarn',
    icon: '🐴',
    summary: 'Horse = grazing animal · non-ruminant herbivore · **hindgut fermenter** (cecum). Foregut: mouth · esophagus · stomach · SI. Hindgut: cecum · large colon · small colon · rectum. Exam: PE/auscultation · mouth/teeth · fecal · NGT · rectal palp · abdominocentesis · radiograph · endoscopy · blood. Mgmt classification by pathology: obstruction · strangulation · ulceration · enteritis & colitis · peritonitis · non-strangulation infarction.',
    sections: [
      {
        heading: 'Lecture 1 — GI anatomy + physiology',
        source: '8 - GI anatomy 67.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine Digestive Anatomy and Physiology**',
            'Speaker: Teerapol Chinkangsadarn DVM PhD DTVBS',
            'Course tag: CUVET 67',
          ] },
        ],
      },
      {
        heading: 'Overview — horses = grazing + hindgut fermenters',
        source: '8 - GI anatomy 67.pdf p.2',
        body: [
          { bullets: [
            'Nowadays, horses are **grazing animals** — eat primary forages (pasture + hay)',
            'Horses = **non-ruminant herbivores** or **hindgut fermenters** (@ cecum — ดักจริงทาง gut)',
            'Implication: nutrition + colic biology ผูกกับ hindgut fermentation',
          ] },
        ],
      },
      {
        heading: 'Foregut vs Hindgut — anatomic split',
        source: '8 - GI anatomy 67.pdf p.3',
        body: [
          { sub: 'Foregut',
            body: [
              { bullets: [
                'Mouth',
                'Esophagus',
                'Stomach (small volume!)',
                'Small intestine',
              ] },
            ] },
          { sub: 'Hindgut (เก็บสารอาหารตามนี้!)',
            body: [
              { bullets: [
                'Cecum',
                'Large colon',
                'Small colon',
                'Rectum',
              ] },
            ] },
        ],
      },
      {
        heading: 'Lecture 2 — Exam techniques for equine alimentary',
        source: '9 - GI Exam 67.pdf p.1-2',
        body: [
          { bullets: [
            'Title: **Examination Techniques for Equine alimentary**',
            'Speaker: Teerapol C. DVM PhD DTVBS',
          ] },
          { sub: 'Signs of GI dysfunction',
            body: [
              { bullets: [
                'Problem with mastication, swallowing, dysphagia',
                'Diarrhea (increase motility)',
                '**Colic (abdominal pain)** — เจอเยอะที่สุด',
                'Incretion of gastric reflux',
                'GI tract obstruction',
                'Abdominal distention (gas from fermentation)',
                'Weight loss',
                '**Primary or secondary GI** — สำคัญต้องแยก!',
              ] },
            ] },
        ],
      },
      {
        heading: 'Exam techniques — 9 tools',
        source: '9 - GI Exam 67.pdf p.3',
        body: [
          { bullets: [
            '**Physical examination / Auscultation** — short sounds vs runs vs silent (HR ~40 normal, ม้ามาก = pain)',
            '**Examination of mouth/teeth** — ดูฟันโกง',
            '**Fecal exam** — ก่อน check ว่าเป็นซีกอะไรบ้าง · normal ไม่เหลือเศษเนื้อ + ตรวจพยาธิ',
            '**Nasogastric intubation** — vital! ม้า vomit ไม่ได้ → ต้อง decompress + check reflux (>2L = sig)',
            '**Rectal palpation** — มั่งมือใน rectum, สำคัญสุดในประเทศ',
            '**Abdominocentesis** — peritoneal fluid; sepsis → น้ำในช่องท้องจะเปลี่ยน',
            '**Radiography** — sand, enteroliths, gas pattern (ม้าเด็กทำได้, ม้าใหญ่ทำ x)',
            '**Endoscopy / Gastroscopy** — gastric ulcer (เจอตรงผิวด้าน ventral)',
            '**Blood exam** — inflam markers · BUN · serum AA',
          ] },
        ],
      },
      {
        heading: 'Lecture 3 — Management of equine GI disorders',
        source: '10 - GI Mg 67.pdf p.1-2',
        body: [
          { bullets: [
            'Title: **Management of Equine GI disorder**',
            'Speaker: Teerapol C. DVM PhD DTVBS',
          ] },
          { sub: 'Classification by Pathology',
            body: [
              { bullets: [
                '**Obstruction** — normal movement restricted but no change in blood supply',
                '**Strangulation** — flow of ingesta + blood supply BOTH interrupted',
                '**Ulceration** — loss of mucosal epithelial cell',
                '**Enteritis & Colitis** — inflammation of SI / LI',
                '**Peritonitis** — inflammation of peritoneal lining',
                '**Non-strangulation infraction** — loss of blood supply without displacement (ไม่ได้พันกัน · ขาดเลือด)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Esophagus — Choke',
        source: '10 - GI Mg 67.pdf p.3',
        body: [
          { sub: 'Presentation',
            body: [
              { bullets: [
                '**Bilateral frothy/purulent discharge** (จมูกสีเขียว = อาหารผสมน้ำลาย)',
                'Coughing',
                'Slightly elevated HR',
                'Increased RR (obstruction = ทำงานหนัก)',
              ] },
            ] },
          { sub: 'Management',
            body: [
              { bullets: [
                'PE — especially assess lung sounds (กลัว aspirate ลงปอด)',
                'Sedation',
                'Gently pass **nasogastric tube** + water lavage (ดันลงๆ ดูว่าผ่านได้ก่อน, ถ้าตัดเลยขเอาเข้าไป → ไม่ค่อยดี → อาจคุมแล้ว stricture)',
                'Endoscopy (ส่องดู mucosa ปกติแล้วไหม)',
                'Radiograph (check ขนาด obstruction)',
              ] },
            ] },
        ],
      },
      {
        heading: 'GI tx by anatomic site (slides 4+)',
        source: '10 - GI Mg 67.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — stomach (EGUS, ulcer Tx omeprazole + sucralfate) · SI (ileus, strangulation, EPE) · cecum (impaction, perforation) · large colon (impaction, displacement, volvulus) · small colon (impaction, RDC) · enteritis/colitis (salmonella, clostridia, PHF) · peritonitis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-colic-bestfit': {
    topic: 'equine-colic-bestfit',
    title: 'Colic best-fit (KU lecture)',
    lecturer: 'Asst.Prof. Aree Laikul (Kasetsart University)',
    icon: '😣',
    summary: 'การจัดการที่เหมาะสมสำหรับปัญหาโคลิกในม้า — colic = สาเหตุการตายอันดับ 1 ในม้า · ปวดท้องแบบ acute (ER). Lecture จาก KU (KSU large animal + wildlife clinical sciences).',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '11 - colic_Best_fit.pdf p.1',
        body: [
          { bullets: [
            'Title: **การจัดการที่เหมาะสมสำหรับปัญหาโคลิกในม้า**',
            'Speaker: **ผศ.สพ.ญ. อารีย์ ไหลกุล** (Aree Laikul)',
            'ภาควิชาเวชศาสตร์คลินิกสัตว์ใหญ่และสัตว์ป่า · คณะสัตวแพทยศาสตร์ · มหาวิทยาลัยเกษตรศาสตร์ (KU)',
            'Annotation: colic = **สาเหตุการตายอันดับ 1 ในม้า** · ปวดท้องแบบ acute (ER)',
          ] },
        ],
      },
      {
        heading: 'Approach + classification + decision tree',
        source: '11 - colic_Best_fit.pdf p.2+',
        body: [
          { bullets: [
            '🚧 รอเติม — initial triage · medical vs surgical decision criteria (HR > 60 = ผ่า; pain not controllable; gastric reflux > 4L; rectal palpation findings; abdominocentesis values [WBC, TP, lactate]) · fluid therapy · analgesia (NSAIDs, α-2, butorphanol) · sedation · NGT decompression · pain management protocol · referral timing',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-colic-surgery': {
    topic: 'equine-colic-surgery',
    title: 'Surgical colic + cases (KU)',
    lecturer: 'Asst.Prof. Aree Laikul (Kasetsart University)',
    icon: '🔪',
    summary: 'Surgical colic = ผ่าตัดเปิดช่องท้องเพื่อแก้ obstruction/strangulation. Techniques: ventral midline celiotomy → manual exploratory → exteriorize → enterotomy (SI/cecum/large colon/small colon) · **pelvic flexure enterotomy** (นิยม) · resection & anastomosis · abdominal closure. Pre-op pic: ม้าเทกพ์ + dorsal recumbency + GA.',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '12 - surgical colic cases.pdf p.1',
        body: [
          { bullets: [
            'Title: **SURGICAL COLIC CASES**',
            'Speaker: **Assist Prof. Aree Laikul** · Faculty of Veterinary Medicine · Kasetsart University',
          ] },
        ],
      },
      {
        heading: 'Techniques — step-by-step',
        source: '12 - surgical colic cases.pdf p.2',
        body: [
          { bullets: [
            '**Ventral midline celiotomy** — เปิดหน้าท้องตาม linea alba · skin → SC → fat → linea alba → retroperitoneal fat → peritoneum',
            '**Manual exploratory** — duodenum ออกไม่ได้ · ileocecal valve ออก x · base ของ cecum ออกได้',
            '**Exteriorize** — ดึงไส้ออกมาผูกผ่า',
            '**Enterotomy** of small intestine, cecum, large colon, small colon',
            '**Pelvic flexure enterotomy** ⭐ — นิยมที่สุด (เปิดลำใส้ที่ pelvic flexure of large colon, dorsal/ventral ออกถาด)',
            '**Resection and anastomosis** — ตัดและต่อ ระยอด ด้วยผูกล',
            '**Abdominal closure** — ปิดช่องท้อง · 1 simple continuous + 2 cushing (เย็บ double layer)',
            'ม้ามีลำดับ checklist ตามลำดับ!',
          ] },
        ],
      },
      {
        heading: 'Pre-op + intra-op pictures (Case slides)',
        source: '12 - surgical colic cases.pdf p.3+',
        body: [
          { bullets: [
            'Pre-op pic: ม้าหมดสติ · dorsal recumbency · ห้องวางยาและพักฟื้นม้า (induction and recovery)',
            'Pre-op: ล้างเท้าสะอาดปากให้ละเอียดก่อน · because จะลอดท่อ (ET) ผ่านทาง oropharynx',
            'Intra-op pics: enterolith (หิน) ในลำไส้, pelvic flexure exteriorized, double-layer suture',
            'Post-op: enterolith สาเหตุไม่ใส่ก. อาหาร · post-op สำคัญมาก! ดูทุกวัน',
            'Wound care: ล้างแผลด้วย betadine every 5 days · ผูกใจหมูก่อนจะอักษกใหม่',
          ] },
        ],
      },
      {
        heading: 'Specific surgical cases (slides 4+)',
        source: '12 - surgical colic cases.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — case 1-N: nephrosplenic entrapment · large colon volvulus · cecal impaction · SI strangulation (lipoma, epiploic foramen, Meckel\'s) · enterolith · sand impaction · adhesions · post-op complications (incisional infection/dehiscence, post-op ileus, laminitis, peritonitis) · long-term prognosis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-farabella': {
    topic: 'equine-farabella',
    title: 'Farabella (miniature horse / Falabella)',
    lecturer: 'TBD',
    icon: '🐎',
    summary: 'Lecture เรื่อง Farabella / Falabella (miniature horse breed). หน้า 1-3 ของ PDF เปิดแล้วเป็น content ภาพ X-ray / orthopedic case images (mandible fracture + plate fixation) → suggest lecture covers physical/orthopedic differences ใน mini horses.',
    sections: [
      {
        heading: 'Lecture content (จาก PDF preview)',
        source: '15 - Farabella.pdf p.1-3',
        body: [
          { bullets: [
            'หน้า 1: pre-op X-ray ของ mandible แตก (lateral skull radiograph) — handwritten note "mandible แตก"',
            'หน้า 2: close-up X-ray of mandibular fracture',
            'หน้า 3: post-op X-ray showing **bone plate + screws** for mandibular fixation — handwritten note "ลำไม่ฝังในเหง bone อาจปนมาขอบแตก → ทำได้ใน parasite ลาย (ทำในชั้นเล็ก)"',
          ] },
          { callout: 'PDF 15 - Farabella.pdf เปิดได้แต่ p.1-3 เป็น case image (mandible fracture repair). หัวข้อบรรยายจริงเกี่ยวกับ Falabella breed/orthopedic — น่าจะอยู่ slides ต่อไป.', kind: 'tip' },
        ],
      },
      {
        heading: 'Falabella breed + orthopedic relevance',
        source: '15 - Farabella.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Falabella breed history (Argentina, smallest horse breed) · congenital conditions (chondrodysplasia, ALD/FLD) · anesthesia considerations · orthopedic surgery indications and fixation methods · mandibular fracture repair technique in mini horses',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-tumors': {
    topic: 'equine-tumors',
    title: 'Equine tumor series',
    lecturer: 'Aree Laikul (KU)',
    icon: '🦠',
    summary: 'Tumor series 4 ตัวหลัก: Squamous cell carcinoma · Fibroma · Sarcoid · Melanoma. Case-based teaching. Case 01: 10-yr stallion, mixed breed, mass at medial canthus OD → SCC suspect → surgical remove + histopath + chemotherapy.',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '16 - Tumor series - CUVET83.pdf p.1',
        body: [
          { bullets: [
            'Title: **Tumor Series — Equine Med/Surg**',
            'Speaker: **Aree Laikul, DVM, DTBVS** · Dept of Large Animal and Wildlife Clinical Sciences · KU',
            'CUVET 83 tag — ดูเหมือนเป็นชุดสไลด์ที่ใช้สอน CU Vet 83 ด้วย',
          ] },
        ],
      },
      {
        heading: '4 tumor types covered',
        source: '16 - Tumor series - CUVET83.pdf p.1',
        body: [
          { bullets: [
            '**Squamous cell carcinoma (SCC)** — periocular + genitalia most common',
            '**Fibroma** — benign fibrous',
            '**Sarcoid** — most common equine skin tumor; BPV1/2 etiology',
            '**Melanoma** — gray horses; perineum, tail base',
          ] },
        ],
      },
      {
        heading: 'Case 01 — SCC at medial canthus',
        source: '16 - Tumor series - CUVET83.pdf p.2-3',
        body: [
          { sub: 'Signalment',
            body: [
              { bullets: [
                'Species: Equine',
                'Breed: Mixed',
                'Age: 10 yr',
                'Sex: Stallion',
              ] },
            ] },
          { sub: 'Chief complaint',
            body: [
              { bullets: [
                'Mass at medial canthus, OD (right eye)',
              ] },
            ] },
          { sub: 'History',
            body: [
              { bullets: [
                'Found mass since six months ago and it keeps growing',
              ] },
            ] },
          { sub: 'Clinical Examination',
            body: [
              { bullets: [
                'Pink proliferative mass with rough surface at medial palpebral conjunctiva and corneal limbus of OD',
                'No ocular discharge',
              ] },
            ] },
          { sub: 'Plan',
            body: [
              { bullets: [
                '✓ Surgical remove',
                '✓ Histopathology',
                '✓ Plan for Chemotherapy',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cases 02-N + detail per tumor type',
        source: '16 - Tumor series - CUVET83.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — additional cases · SCC etiology (UV, lack of pigment) · sarcoid 6 types (occult, verrucous, nodular, fibroblastic, mixed, malevolent) · sarcoid Tx options (cisplatin, BCG, surgery, cryotherapy, immunomodulation) · melanoma Tx · prognosis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-rvf': {
    topic: 'equine-rvf',
    title: 'Rectovaginal fistula (RVF)',
    lecturer: 'TBD',
    icon: '🩹',
    summary: 'Rectovaginal fistula tract = ม้าหายจาก vagina เปิดเข้า rectum (มักจากคลอดยาก). Technique: standing sedation + epidural block (xylazine + mepivacaine) → ตัดแยกเป็น 2 ชั้น (vagina + rectum) → suture pattern เช่น **six-bite** (Auer, Equine Surgery).',
    sections: [
      {
        heading: 'Anatomy — RVF diagram',
        source: '17 - Rectovaginal Fistula Tract.pdf p.1',
        body: [
          { bullets: [
            'Anatomy diagram: Rectum (dorsal) / Vagina (ventral) — separated by **Shelf** (perineal body)',
            'RVF = communication ตรงกลางระหว่าง rectum + vagina · anal ring ไม่ดับเดน · ดู่ม้าเอาเท้าหุ้มกะดู',
            'Etiology hint: คลอดถ่กลูกม้ามีฟิ่นเขาก่ายค่ → ฉีกผนัง vagina + rectum',
          ] },
        ],
      },
      {
        heading: 'Anesthesia + approach',
        source: '17 - Rectovaginal Fistula Tract.pdf p.1 (annotations)',
        body: [
          { bullets: [
            '**Standing sedation → epidural block** ⭐⭐ (caudal epidural)',
            'Anesthetic: **xylazine + mepivacaine**',
            'Approach: คนสอดมือกูดเงินฉีกขาภายใจ → เข้าซื้อออกมาทาง vagina',
            'ตัวเย็บแยกชั้น (rectal layer + vaginal layer) ก่อนต่อ',
          ] },
        ],
      },
      {
        heading: 'Suture technique — six-bite (Auer, Equine Surgery)',
        source: '17 - Rectovaginal Fistula Tract.pdf p.2-3',
        body: [
          { bullets: [
            'ทำเทคนิค **six-bite** = ปักเข็ม 6 ครั้ง (Auer, Equine Surgery reference)',
            'ขั้น: ① ผูก/พันลำ vagina',
            '② หฺเctum เว้นทาง (รอบครั้ว) ที่ ออกกล้าม',
            '③ ด้าน rectum ออกตรง vagina between rectum & vagina',
            '④ ทะดู ⑤ ปักชั้น ⑥ ปักลก ⑦ ผูก #',
            'ติดดอกค-led space ให้แน่น! แผลละเอียดไม่แตก',
          ] },
        ],
      },
      {
        heading: 'Post-op + complications',
        source: '17 - Rectovaginal Fistula Tract.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — post-op care · dehiscence rate · second-intention vs primary repair · staged approach (Aanes technique) · breeding prognosis',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-lapove': {
    topic: 'equine-lapove',
    title: 'Laparoscopic Ovariectomy (LapOVE)',
    lecturer: 'Aree Laikul (KU)',
    icon: '🔬',
    summary: 'LapOVE = Minimally Invasive Surgery (MIS) ทำใน standing & flock standing/sedated. ใช้ port เล็กในช่องท้อง → small incision · reduced tissue damage · better visualization. Cover 2 parts: Laparoscopic Fundamental (laparoscopy + general rules) + LapOVE case study (patient prep · port entry · surgery).',
    sections: [
      {
        heading: 'Title + lecturer',
        source: '18 - LapOVE - CUVET.pdf p.1',
        body: [
          { bullets: [
            'Title: **Laparoscopic Ovariectomy (LapOVE)**',
            'Speaker: **Aree Laikul, DVM, DTBVS** · Dept of Large Animal and Wildlife Clinical Sciences · KU',
            'Indications: OVH แผลในตัว, colic management · annotation: "manage GI ด้วย ลาpara ก็ทำได้ด้วย"',
            'ต้อง prepare for laparotomy เสมอนะ (convert ถ้าจำเป็น)',
          ] },
        ],
      },
      {
        heading: 'Outline — 2 parts',
        source: '18 - LapOVE - CUVET.pdf p.2',
        body: [
          { sub: '01 Laparoscopic Fundamental',
            body: [
              { bullets: [
                'Laparoscopy basics',
                'General Rules',
              ] },
            ] },
          { sub: '02 LapOVE case study',
            body: [
              { bullets: [
                'Patient Preparation',
                'Port entry',
                'LapOVE technique',
              ] },
            ] },
        ],
      },
      {
        heading: '01 Laparoscopic fundamental — MIS principles',
        source: '18 - LapOVE - CUVET.pdf p.3',
        body: [
          { bullets: [
            '**MIS: Minimally Invasive Surgery** — "Insert small surgical devices into the abdominal cavity"',
            'Performed: **standing & flock** style (ม้ายืน sedate + 3 port)',
            '✓ **Small incision**',
            '✓ **Reduced tissue damage**',
            '✓ **Better visualization** (HD camera)',
          ] },
        ],
      },
      {
        heading: 'Case study + ovariectomy steps',
        source: '18 - LapOVE - CUVET.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — fasting protocol · sedation (xylazine + butorphanol detomidine) · paralumbar fossa port placement (3 ports — camera + 2 working) · pneumoperitoneum (CO2) · mesovarium injection (mepivacaine) · ligation methods (LigaSure, harmonic, ENDO GIA, ligature) · specimen retrieval · port closure · post-op care · indications (granulosa cell tumor, behavior problems, mare-stallion conversion)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-ortho': {
    topic: 'equine-ortho',
    title: 'Equine orthopedic',
    lecturer: 'Niphapha (ดู Vet 84 final reference)',
    icon: '🦴',
    summary: 'Orthopedic — PDF p.1-3 แสดง case-based images (mandibular fracture repair: pre-op X-ray + post-op plate/screw fixation). Slides น่าจะคลุม fracture management, internal fixation, plate/screw systems, region-specific approaches.',
    sections: [
      {
        heading: 'Lecture intro + case images',
        source: '19 - Nicole ortho.pdf p.1-3',
        body: [
          { bullets: [
            'หน้า 1: pre-op X-ray of mandible — handwritten "pre-op X-ray กลางถนนไป" + "mandible แตก"',
            'หน้า 2: close-up X-ray detail of fracture site',
            'หน้า 3: post-op X-ray showing **plate + screws** for fixation · handwritten: "ลำใหญ่ใน long bone อาจปนของแตก → ทำได้ใน parasite ลาย (ทำในชั้นเล็ก ๆ)"',
          ] },
        ],
      },
      {
        heading: 'Topics expected (จาก lecturer hint)',
        source: '19 - Nicole ortho.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — fracture classification (open vs closed; configuration) · stabilization principles (4 A\'s + AO/ASIF) · external coaptation vs internal fixation · plate/screw systems · region-specific: mandible · long-bone (radius/tibia/MC3/MT3) · pastern arthrodesis · luxations · prognosis · post-op rehabilitation',
            'Reference: ดู Vet 84 final past papers + lecture notes ของ อ. Niphapha',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-pythium': {
    topic: 'equine-pythium',
    title: 'Pythium / Equine pythiosis',
    lecturer: 'TBD',
    icon: '🦠',
    summary: 'Pythium insidiosum (oomycete, ไม่ใช่เชื้อรา true fungus). PDF filename: "20 - pythium ไม่แจกชีท เพราะอะไรอีก.pdf" → ผู้บรรยายไม่แจกชีท → outline ส่วนใหญ่จาก infectious disease lecture (3 - Eq_inf_dz_67.pdf) ที่ list pythiosis ใน Fungi category.',
    sections: [
      {
        heading: 'Source caveat — no handout',
        source: 'filename: "20 - pythium ไม่แจกชีท เพราะอะไรอีก.pdf"',
        body: [
          { bullets: [
            'PDF filename บอกตรง: **"ไม่แจกชีท"** → ผู้บรรยายไม่ให้สไลด์',
            'Reference: equine pythiosis อยู่ในหมวด Fungi ของ infectious dz lecture (3 - Eq_inf_dz_67.pdf p.2)',
            '🚧 รอเติม — pathogen (Pythium insidiosum, oomycete) · habitat (stagnant water TH/Australia) · CS (granulomatous skin lesion with kunkers, GI form) · Dx (culture + serology + PCR + biopsy histopath) · Tx (surgery + immunotherapy vaccine + amphotericin B / itraconazole; difficult) · prognosis · prevention',
          ] },
          { callout: 'อ่านเพิ่ม: textbook + journal — ไม่มีสไลด์ official.', kind: 'warn' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-ophth': {
    topic: 'equine-ophth',
    title: 'Equine ophthalmology',
    lecturer: 'Nalinee Tuntivanich (DVM, PhD, DipAiCVO, DipTBVS)',
    icon: '👁',
    summary: '"A horse is NOT a big dog" ⭐ — equine eye ≠ canine eye (เพิ่มเป็น comparative). Lecture guideline: (1) Normal ocular organs, (2) Each ocular organ — Normal function · Ophthalmic examinations · Common abnormalities.',
    sections: [
      {
        heading: 'Title + speaker',
        source: '21 - Equine Ophthalmology_67_NT.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine Ophthalmology — 3106510**',
            'Speaker: **Nalinee Tuntivanich** — DVM, PhD, DipAiCVO (Asian College of Vet Ophth), DipTBVS',
            'Annotation: "เห็นเป็น comparative" — เปรียบเทียบกับสัตว์เลี้ยงเล็ก',
          ] },
        ],
      },
      {
        heading: 'Key principle',
        source: '21 - Equine Ophthalmology_67_NT.pdf p.2',
        body: [
          { bullets: [
            '⭐ **"A horse is NOT a big dog"** — anatomy, drug response, healing patterns, exam approach แตกต่าง',
            'Implication: protocols ที่ใช้กับ canine ophth ไม่สามารถ extrapolate ตรงๆ',
          ] },
        ],
      },
      {
        heading: 'Lecture guideline',
        source: '21 - Equine Ophthalmology_67_NT.pdf p.3',
        body: [
          { bullets: [
            '**1. Normal ocular organs** — anatomy + physiology',
            '**2. Each ocular organ:**',
            '  a. Normal function',
            '  b. Ophthalmic examinations',
            '  c. Common abnormalities',
          ] },
        ],
      },
      {
        heading: 'Per-organ deep-dive',
        source: '21 - Equine Ophthalmology_67_NT.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — orbit · adnexa (eyelids, third eyelid, NLD) · conjunctiva · cornea (ulcer, melting, abscess) · uvea (ERU/uveitis — leptospirosis link, moon blindness) · lens (cataract) · retina · optic nerve · medical mgmt vs surgical mgmt (lavage system, sub-palpebral lavage)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-respi': {
    topic: 'equine-respi',
    title: 'Equine respiratory diseases',
    lecturer: 'Teerapol Chinkangsadarn',
    icon: '🫁',
    summary: 'Outline 4 หัวข้อ: Sign of respiratory problems · Equine respiratory examination · Upper respiratory problems · Lower respiratory problems. Exam: PE + breathing sound (URT vs LRT) + auscultation (↑/↓/adventitious) + percussion + radiograph + ultrasound + CT/MRI.',
    sections: [
      {
        heading: 'Title + speaker',
        source: '22 - EQ CU Respi 67.pdf p.1',
        body: [
          { bullets: [
            'Title: **Equine respiratory diseases**',
            'Speaker: Teerapol C. DVM PhD DTBVS',
            'Course tag: EQ CU 67',
          ] },
        ],
      },
      {
        heading: 'Outline — 4 หัวข้อ (อาการ → exam → upper → lower)',
        source: '22 - EQ CU Respi 67.pdf p.2',
        body: [
          { bullets: [
            '**Sign of respiratory problems** (อาการ)',
            '**Equine respiratory examination**',
            '**Upper respiratory problems**',
            '**Lower respiratory problems**',
          ] },
        ],
      },
      {
        heading: 'Respiratory examination — methods',
        source: '22 - EQ CU Respi 67.pdf p.3',
        body: [
          { bullets: [
            '**History taking and Signalment**',
            '**Physical examination**',
            '**Breathing sound** — define problem origin: Upper respiratory tract OR Lower respiratory tract',
            '**Auscultation** — Increase / Decrease / Adventitious sounds',
            '**Percussion**',
            '**Radiograph** — Sinus + Technique and position',
            '**Ultrasound** — ใช้ใจ.ในกา.หายใจ ใช้เยอะเลย · ม.ชั้นกลาง lower abdomen เห็นมามากกล',
            '**CT and MRI** — ในศัตว์อื่นไม่ค่อยเจอ',
          ] },
        ],
      },
      {
        heading: 'URT vs LRT specific diseases',
        source: '22 - EQ CU Respi 67.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — URT: nostrils, paranasal sinuses (primary/secondary sinusitis), guttural pouch (mycosis, empyema, tympany), pharyngitis, laryngeal hemiplegia (RLN), DDSP, EIPH, arytenoid chondritis',
            '🚧 LRT: pneumonia (foal vs adult), Rhodococcus equi (foals), pleuropneumonia, RAO/heaves (equine asthma), IAD, EIPH, exercise intolerance workup',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-neonatal': {
    topic: 'equine-neonatal',
    title: 'Neonatal & Foal management',
    lecturer: 'Asst.Prof. Suphannika Phutthachalee (KKU)',
    icon: '🐎',
    summary: 'TOC 8 หัวข้อ: Parturition in the mare · Stage of labor · Newborn examination · Placental examination · Intensive care of neonatal foal · Foal\'s immune system · Neonatal disorder · Foal health care. Gestation length: 320-380 days (~11 months) · pony 320-345d · Thoroughbred 320-360d · donkeys 360-380d.',
    sections: [
      {
        heading: 'Title + speaker',
        source: '23 - neonatal & foal management.pdf p.1',
        body: [
          { bullets: [
            'Title: **Neonatal & Foal management**',
            'Speaker: **Suphannika Phutthachalee** · Faculty of Veterinary Medicine · Khon Kaen University (KKU), Thailand',
            'Note: ⭐ มีสรุปจากรุ่นพี่ไว้ (จาก filename)',
          ] },
        ],
      },
      {
        heading: 'Table of Contents — 8 หัวข้อ',
        source: '23 - neonatal & foal management.pdf p.2',
        body: [
          { bullets: [
            '01 **Parturition in the Mare**',
            '02 **Stage of Labor**',
            '03 **The Newborn Examination**',
            '04 **The Placental Examination**',
            '05 **Intensive Care of the Neonatal Foal**',
            '06 **Foals Immune System**',
            '07 **Neonatal Disorder**',
            '08 **Foals Health Care**',
          ] },
        ],
      },
      {
        heading: 'Parturition in the Mare — Gestation length',
        source: '23 - neonatal & foal management.pdf p.3',
        body: [
          { bullets: [
            '**Gestation length: 320-380 days (~11 months)**',
            '**Pony breeds**: 320-345 days (pony สั้นกว่า)',
            '**Thoroughbred**: 320-360 days (เทบาลง)',
            '**Donkeys**: 360-380 days (นานสุด)',
            'Implication: ดู signalment ก่อนตัดสินใจ "เกินกำหนด" หรือไม่',
          ] },
        ],
      },
      {
        heading: 'Stages of labor + neonatal critical care',
        source: '23 - neonatal & foal management.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — Stages I/II/III of labor · dystocia + obstetric assistance · APGAR score adapted to foal · 1-2-3 rule (1h stand, 2h nurse, 3h pass meconium) · IgG snap test (failure of passive transfer if < 800 mg/dL at 18-24h) · sepsis score · NMS (neonatal maladjustment syndrome, "dummy foal") · prematurity vs dysmaturity · placentitis · placental check (F-shape, weight, color, umbilicus, allantochorionic surface)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'equine-poa': {
    topic: 'equine-poa',
    title: 'POA equine (Practical / Objective Approach)',
    lecturer: 'TBD',
    icon: '🩺',
    summary: 'POA = Practical Objective Assessment-style station(s) เน้น lameness + infectious dz workup. PDF เปิด p.1-3 แสดง: history-taking (9-best-question approach), PE checklist (BCS, palpation), lameness scoring (5-grade), nerve block ladder (PD → abaxial → low 4 → high 4), hoof tester, radiograph diff-dx (navicular bone dz). POA ออกสอบ final ~2 ข้อ.',
    sections: [
      {
        heading: 'Source PDF — POA workflow snapshots',
        source: 'POA.pdf p.1',
        body: [
          { bullets: [
            'PDF: POA.pdf (36MB)',
            'หน้า 1: case Pretty, 13yr Thoroughbred-Thai Pony, 516kg, dressage discipline → ลามครั้งติด',
            'Question approach: "Choose the nine best questions" จาก list (history-taking framework)',
            'Examples ของ good question: How old? · Where housed? · Color? · Sire/dam? · Duration of lameness? · Last day shod? · Bedding? · Medications?',
          ] },
        ],
      },
      {
        heading: 'PE + lameness diagnostic workflow (กรอบ POA)',
        source: 'POA.pdf p.2',
        body: [
          { sub: 'PE findings',
            body: [
              { bullets: [
                'มัดเล็บ ไม่มี heat / swelling',
                'Left eye cloudy · ไม่ม uncration',
                'ทำให้ lame หน้าซ้าย',
              ] },
            ] },
          { sub: 'Diagnostic ladder',
            body: [
              { bullets: [
                '① Nerve block — sequential: 2 → 4 → 1 → 5',
                '② Flexion test — 2 → 4 → 1 → 5',
                '③ Roll the horse — ทำจากเล็กไป (lower limb → carpus → upper limb)',
                '④ Hoof testers — 2 → 4 → 1',
                '⑤ Radiograph — further DX (รอเอา xr ก่อน)',
                '⑥ Give up VV (if stuck)',
              ] },
            ] },
          { sub: 'Nerve block landmarks',
            body: [
              { bullets: [
                '① Palmar Digital (PD)',
                '② Abaxial sesamoid (low 4)',
                '③ Low 4-point',
                '④ High 4-point',
              ] },
            ] },
          { sub: 'Diagnostic interpretation',
            body: [
              { bullets: [
                'PD ⊕ at coffin → ทำได้/ไม่ได้ทำ navicular block:',
                'Lower limb = fetlock down → ⊕ VV แสดงว่า pain ตรงนี้!',
                'Carpus = ตรงกะดูราย (negative)',
                'Upper limb = ขนกะดูส (negative)',
                'Check navicular pain — coffin pain? laminitis?',
                'Diff Dx รอ: **navicular bone dz**',
              ] },
            ] },
        ],
      },
      {
        heading: 'POA answer key + station 2 (lameness video questions)',
        source: 'POA.pdf p.3',
        body: [
          { bullets: [
            'Congratulations sheet เปิดเฉลย: hoof testers used → bar shoe identified → flexion tests → palmar digital nerve block (using mepivacaine or carbocaine sciatic block) → radiograph จะ confirm navicular disease',
            'Station 2: ดูม้าวิ่ง → answer "ใช้เทคนิคไหนต่อ" (Lunge in circle / Lunge in soft ground (check tendon) / Hand palpation per leg / Plantar nerve block / Abaxial nerve block / Low 6-points nerve block / Tell owner horse fine + go shopping ❌)',
            'Note: lameness scoring 4/5, 5/5 grades visible',
          ] },
        ],
      },
      {
        heading: 'POA infectious dz station (final exam ~2 questions)',
        source: 'POA.pdf p.4+',
        body: [
          { bullets: [
            '🚧 รอเติม — infectious dz workup: signalment-based suspicion list, blood smear (Surra/Babesia/EIA), CBC+blood chem, PCR (DNA fragment detection) interpretation, Ca²⁺/K⁺ ต่ำจาก สภาวะ แสดงผลใน blood chem, petechial hemorrhage @ mucosa, etc.',
          ] },
        ],
      },
    ],
  },
};
