// ──────────────────────────────────────────────────────────────────
// Vet Prac Rum (3108412) Study Notes — Final scope (Week 8-13 post-mid)
// Final exam: 6 พ.ค. 2569, VET6 B01-B03, 13:00-16:00
// Coordinator: อ.น.สพ.ดร.รุจิกร จงสุวรรณวัฒนา (RJ)
//
// Source priority:
//   1) Lecture 2026 PDFs (อ.เอกพล Rumenotomy, Penile deviation)
//   2) ตารางสอน 3108412 schedule
//   3) Sunsun84 รวมข้อสอบเก่า (Vet 84 senior recall) + pp's final85 (Vet 85)
//   4) Background ruminant surgery + AABP standards
// ──────────────────────────────────────────────────────────────────

export const NOTES_PRACTRUM = {
  'penile-deviation': {
    topic: 'penile-deviation',
    title: 'Penile Deviation Surgery + Caudal Epididymectomy',
    lecturer: 'Surgery staff (ST/TS/RJ + team)',
    icon: '🩺',
    summary: 'Week 8, ผ่าตัดเบนลึงค์เพื่อเตรียม heat-detector bull + semen-collecting bull, sterile via caudal epididymectomy (sterile in 30-60 days post-op)',
    sections: [
      {
        heading: 'Indications + Mechanism',
        source: 'Lecture 2026 Deviation_of_Penis_and_Caudal_epididymectomy.pdf p.2',
        body: [
          { bullets: [
            '**Heat detector bull** — penis เบนลาทาง lateral, mount + stimulation ได้ แต่ไม่สามารถ intromission, ใช้ตรวจ estrus ของฝูง',
            '**Semen collecting bull** — train mount artificial vagina (AV)',
            '**Caudal epididymectomy** ทำคู่ — ตัด caudal epididymis → sterile แต่ libido + testosterone ยังมี',
          ] },
          { callout: '⚠️ Sterile ใน 30-60 วันหลังผ่าตัด, sperm ค้างใน vas deferens + ampulla ยังมี viable → quarantine ก่อนใช้กับฝูง female', kind: 'warn' },
        ],
      },
      {
        heading: 'Drug Protocol (Lecture 2026)',
        source: 'Deviation_of_Penis lecture slides 4-9',
        body: [
          { table: {
            headers: ['Drug', 'Class', 'Dose', 'Route'],
            rows: [
              ['Xylazine HCl', 'Sedation (alpha-2)', '0.05-0.1 mg/kg', 'IM/IV'],
              ['Lidocaine 2%', 'Local anesthesia', 'ring + line block', 'SC'],
              ['Pendistrep L.A.', 'Antibiotic (PCN combo)', '20,000 IU/kg', 'IM'],
              ['Phenylbutazone', 'NSAID', '2-5 mg/kg', 'IV'],
              ['Banocin powder', 'Topical (clioquinol+bacitracin+neomycin)', 'site dressing', 'topical'],
            ],
          } },
          { bullets: [
            'Restraint: **Hannover trolley** (mobile stand)',
            'Position: lateral recumbency, scrotum exposed',
            'Reference video (slide 11): https://www.youtube.com/watch?v=fCWc-cww_1g',
          ] },
        ],
      },
    ],
  },

  'hoof-trim': {
    topic: 'hoof-trim',
    title: 'Hoof Care + Trimming',
    lecturer: 'ผศ.น.สพ.ปิยะณัฐ ประสมศรี (PP)',
    icon: '🐾',
    summary: 'Week 8/10-12, routine hoof care + trim + DDx infectious vs non-infectious lameness, digital amputation S2 indication',
    sections: [
      {
        heading: 'Routine Care + Disease Categories',
        source: 'Sunsun84 p.7 + AABP standards',
        body: [
          { bullets: [
            '**Routine claw care**: foot bath (CuSO4 5% / Formalin 3-5%), claw trimming 2x/year',
            '**Infectious lameness**:',
          ] },
          { table: {
            headers: ['Disease', 'Cause', 'Treatment'],
            rows: [
              ['Digital dermatitis', 'Treponema spp.', 'Topical oxytetracycline + bandage'],
              ['Foot rot (interdigital phlegmon)', 'Fusobacterium necrophorum + Dichelobacter nodosus', 'Systemic AB + Tx hoof bath'],
              ['Interdigital fibropapilloma', 'Bovine papillomavirus', 'Sx excision NBA block'],
            ],
          } },
          { bullets: [
            '**Non-infectious lameness**:',
          ] },
          { table: {
            headers: ['Condition', 'Cause', 'Notes'],
            rows: [
              ['Laminitis', 'Carb overload → acidosis → endotoxemia', 'Subclinical → P3 sinks → sole ulcer 2-3 mo later'],
              ['Sole ulcer (Pododermatitis circumcripta, Rusterholz)', 'Lateral claw hindlimb, zone 4', 'Corrective trim + block on medial claw'],
              ['Interdigital fibroma (Corn)', 'Chronic friction', 'ตัดเฉพาะเนื้องอก ไม่ตัดนิ้ว'],
            ],
          } },
        ],
      },
      {
        heading: 'Digital Amputation S2 (sole ulcer / osteomyelitis)',
        source: 'Sunsun84 p.7 + Ploy83 past paper',
        body: [
          { callout: '⭐ Indication: severe claw injury, toe ulcer + bone necrosis, septic arthritis, white line disease + deep digital sepsis, severe traumatic claw disease', kind: 'tip' },
          { bullets: [
            '⛔ NOT indication: interdigital fibroma (ตัดเฉพาะก้อน, ไม่ amputate)',
            '**S2 = distal third of middle phalanx (P2)**',
            'Position: lateral recumbency, ขาที่ผ่าตัดอยู่บน',
            'Anesthesia: NBA (4-point hindfoot nerve block) หรือ IV regional Bier block',
            'Skin incision: เปิดเหนือ coronet ~**0.5 cm** (ไม่ใช่ 2 cm — ระวัง wound dehiscence)',
            'Bone cut: embryotomy wire เฉียงจาก abaxial 2 cm ลงระดับไรกีบ',
            'ตัด interdigital ligament + curette ขูดเนื้อตาย + ห่อ bandage',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (Vet 83 Lameness, 5 Q)',
        source: 'Ploy83 รวมข้อสอบเก่า p.31-35, ศิรินันท์ พรรณระวี (lecturer year-change, ปี 86 = PP)',
        body: [
          { bullets: [
            'Q1 ดูแลกีบโค → "ถูกทุกข้อ" (footbath + trim + nutrition + housing hygiene, 4 pillars)',
            'Q2 sole ulcer ตำแหน่ง → **เบอร์ 4** (sole-heel junction, Rusterholz)',
            'Q3 digital amputation S2 ผิด → ตัวเลือก "เปิดผิวหนังเหนือไรกีบ 2 ซม" (จริง = 0.5 ซม)',
            'Q4 NOT indication for digital amputation → **Interdigital fibroma** (ตัดแค่เนื้องอก)',
            'Q5 digital dermatitis cause → **Treponema spp.** (ไม่ใช่ Fusobacterium, นั่นคือ foot rot)',
          ] },
          { callout: '⭐ Pattern: Ploy83 (Vet 83) lameness exam 5 Q นี้ ตรง content กับ slide PP 2026 ทุกข้อ → ใช้ผลที่จริงเป็น study guide ได้', kind: 'tip' },
        ],
      },
      {
        heading: 'Hoof Anatomy, Claw Zones',
        source: 'Sunsun84 p.7 + Ploy83 zone diagram',
        body: [
          { table: {
            headers: ['Zone', 'Location', 'Common pathology'],
            rows: [
              ['1', 'Toe (abaxial white line)', 'White line disease'],
              ['2', 'Axial white line', 'White line abscess'],
              ['3', 'Abaxial sole (lateral side)', 'Bruise / sole hemorrhage'],
              ['4', '**Sole-heel junction (Rusterholz)** ⭐', '**Sole ulcer** ⭐ (most common, lateral claw hindlimb)'],
              ['5', 'Mid sole', 'Foreign body penetration'],
              ['6', 'Heel bulb', 'Heel horn erosion, DD'],
            ],
          } },
          { bullets: [
            '**Lateral claw of hindlimb** ⭐ = sole ulcer site (asymmetric weight distribution post-first-calving)',
            'Medial claw of forelimb = bears more weight in front',
          ] },
        ],
      },
    ],
  },

  'animal-nutrition': {
    topic: 'animal-nutrition',
    title: 'Ruminant Nutrition, DMI calculation',
    lecturer: 'ผศ.น.สพ.ปิยะณัฐ ประสมศรี (PP)',
    icon: '🌾',
    summary: 'Week 9, DMI calculation จาก feed wet weight × %DM, CP/NDF/ADF/NE evaluation, R:C ratio 60:40, Penn State Particle Separator',
    sections: [
      {
        heading: 'DMI Calculation',
        source: 'PP Lecture + NRC 2001 Dairy',
        body: [
          { bullets: [
            '**DMI = น้ำหนักอาหาร (as-fed) × %DM**',
            'ตัวอย่าง: TMR 30 kg/d at 48% DM → DMI = 30 × 0.48 = 14.4 kg DM/d',
            'Holstein lactating peak: ~3-4% ของ BW (= 18-25 kg DM for 600 kg cow)',
            '⚠️ DMI <2.5% BW = severely depressed → flag disease (mastitis, ketosis, LDA, lameness)',
          ] },
        ],
      },
      {
        heading: 'Nutritional Values',
        source: 'NRC 2001',
        body: [
          { table: {
            headers: ['Parameter', 'Meaning', 'Target (lactating)'],
            rows: [
              ['CP (%)', 'Crude protein', '16-18% peak, 12-14% dry'],
              ['NDF (%)', 'Total fiber (cellulose+hemicellulose+lignin)', '<40% (limit DMI if higher)'],
              ['ADF (%)', 'Less digestible fiber', '<25%'],
              ['NE (Mcal/kg)', 'Net energy', '~1.6-1.7 lactating'],
            ],
          } },
        ],
      },
      {
        heading: 'R:C Ratio + Particle Size',
        source: 'NRC + Penn State Extension',
        body: [
          { bullets: [
            '**Lactating: R:C = 60:40** ⭐',
            'Early lactation high producer: อาจ 40:60 ชั่วคราว, Late/dry: 70:30-80:20',
            '⚠️ R:C ต่ำกว่า 40:60 → SARA, laminitis, LDA, milk fat depression',
            '**peNDF (physically effective NDF) ≥21% ของ DM**',
          ] },
          { sub: 'Penn State Particle Separator (4 ชั้น)',
            body: [
              { table: {
                headers: ['ชั้น', 'Size', 'Target %'],
                rows: [
                  ['1 (top)', '>19 mm', '2-8% (peNDF)'],
                  ['2', '8-19 mm', '30-50%'],
                  ['3', '4-8 mm', '10-20%'],
                  ['4 (bottom)', '<4 mm', '30-40%'],
                ],
              } },
              { bullets: [
                '⚠️ ชั้น 4 >50% = SARA risk, cow sorting',
              ] },
            ] },
        ],
      },
    ],
  },

  'cow-restraint': {
    topic: 'cow-restraint',
    title: 'Cow Restraint, Low-Stress Handling',
    lecturer: 'CN, CK, PD, AC, TA, SP + Husb staff',
    icon: '🪢',
    summary: 'Week 10-12 rotation, halter, Reuff casting, Hannover trolley, Temple Grandin flight zone',
    sections: [
      {
        heading: 'Halter + Standing Restraint',
        source: 'AABP handling standards',
        body: [
          { bullets: [
            '**Halter fitting**: muzzle band ใต้ตา 2-3 ซม (ครึ่งทางระหว่าง nostrils + ตา), throat latch ปล่อยพอใส่ 2 นิ้ว',
            'ผูก post: **quick-release knot** (ปลดได้ง่ายเมื่อ emergency)',
            '**Foot work standing**: ขาหน้า leg rope พาดข้อเท้าด้านตรงข้ามไหล่, ขาหลัง leg raising ยกด้านหลัง',
          ] },
        ],
      },
      {
        heading: 'Casting Methods (recumbent)',
        source: 'AABP + Sunsun84',
        body: [
          { table: {
            headers: ['Method', 'Loop pattern', 'Use'],
            rows: [
              ['Reuff', '3 จุด: คอ, sternum, หน้าขาหลัง', 'Foot trim, castration'],
              ['Burley', '2 loops (หน้าขาหน้า + ระหว่างขาหลัง)', 'ปลอดภัยกว่า, ไม่บีบ neck'],
              ['Hannover trolley', 'Mobile stand', 'Penile deviation surgery'],
              ['Tilt table (foot bath)', 'Hydraulic', 'ดีสุดสำหรับ hoof work'],
            ],
          } },
          { callout: '⚠️ Casting อันตราย: bloat ระหว่าง recumbency, ระวัง regurgitation', kind: 'warn' },
        ],
      },
      {
        heading: 'Low-Stress Handling (Temple Grandin)',
        source: 'Temple Grandin handling principles',
        body: [
          { bullets: [
            'Flight zone: ~5-15 m radius depending on cow domestication',
            '**Point of balance** = หัวไหล่ของ cow',
            'เข้าหา **ด้านหลัง point of balance** → cow เดินไปข้างหน้า ⭐',
            'เข้าหา **ด้านหน้า point of balance** → cow ถอย/หยุด',
            '45° angle = optimal, ไม่ตรงหน้าจน cow รู้สึกถูกขู่',
            'Benefit: ↓ cortisol + adrenaline, ↓ injury, ↑ meat/milk quality',
          ] },
        ],
      },
    ],
  },

  'bovine-anesthesia': {
    topic: 'bovine-anesthesia',
    title: 'Bovine Local + Regional Anesthesia ⭐ (14 Q, highest yield)',
    lecturer: 'Surgery staff + อ.เอกพล (EA)',
    icon: '💉',
    summary: 'Week 10-12, Paravertebral, Caudal epidural sacrococcygeal, Inverted L block, Peterson, Auriculopalpebral, Lidocaine 2%, highest-yield section per past-paper coverage',
    sections: [
      {
        heading: 'Sedation (alpha-2 agonist)',
        source: 'Sunsun84 p.1',
        body: [
          { bullets: [
            '**Xylazine 0.05-0.1 mg/kg IM/IV** (sedation), 0.02 mg/kg = light standing',
            '**Species sensitivity**: วัว > แพะ > แกะ',
            '**Breed sensitivity (cattle)**: Brahman > Hereford > Holstein ⭐ (Bos indicus ไวมาก)',
          ] },
          { sub: 'Mechanism + Side effects',
            body: [
              { bullets: [
                'Phase 1 (vasoconstriction): BP สูง → reflex bradycardia, CO ลด',
                'กดหลั่ง insulin → hyperglycemia, กด ADH → diuresis',
                '⚠️ ระวัง **hypoxia + pulmonary edema**',
                'Reversal: **Yohimbine** หรือ atipamezole',
              ] },
            ] },
          { callout: '❌ Acepromazine (phenothiazine): ไม่มี analgesic + **ผลข้างเคียง penile prolapse** (รู้โพล่) → ห้ามใช้ในเพศผู้', kind: 'warn' },
        ],
      },
      {
        heading: 'Local Anesthesia (Lidocaine 2%)',
        source: 'Aj.เอกพล Rumenotomy lecture 2026 + Sunsun84',
        body: [
          { table: {
            headers: ['Block', 'Site', 'Volume/Dose', 'Indication'],
            rows: [
              ['Auriculopalpebral', 'Eyelid motor (orbicularis oculi)', '5-10 ml', 'Eye exam, minor lid procedure'],
              ['Peterson', 'CN III/IV/VI/V (eyeball + sensory)', '10-15 ml retrobulbar', 'Enucleation, deep eye sx'],
              ['Cornual', 'Cornual branch CN V (zygomaticotemporal)', '5-10 ml lat canthus-horn', 'Dehorning'],
              ['Paravertebral Proximal', 'TP of L1, L2, L3 → block T13/L1/L2 root', '5-10 ml/site', 'Standing flank sx'],
              ['Paravertebral Distal (Magda)', 'TP of L1, L2, L4 → block T13/L1/L2', '5-10 ml/site', 'Standing flank sx'],
              ['Caudal epidural (cow)', '**Sacrococcygeal S5-Co1** หรือ Co1-Co2', '1 ml/100 kg, max 6 ml', 'Perineal sx, c-section, dystocia'],
              ['Caudal epidural (sheep/goat)', 'Lumbosacral L6-S1', '1 ml/5 kg', 'Same'],
              ['Inverted L block', 'Vertical caudal to last rib + horizontal ventral to TP', '~30-40 ml', 'Standing flank, alternative paravertebral'],
              ['Line block', 'SC injection along incision', 'up to 250 ml 2% lidocaine', 'Most procedures'],
              ['IV regional (Bier)', 'Distal limb IV under tourniquet', '20-30 ml 2%', 'Foot procedures, ≤90 min'],
            ],
          } },
          { callout: '⚠️ Lidocaine duration ~3 ชม (180 min), max safe dose adult cattle ≤ 250 ml of 2%', kind: 'warn' },
        ],
      },
      {
        heading: 'Past Exam Mapping ⭐ (Vet 85 Final, 6/10 Q = anesthesia)',
        source: 'pp\'s vet prac rum final85 p.2 (Vet 85 = 2025 Final, marked answers)',
        body: [
          { callout: 'Anesthesia ออกข้อสอบ 60% ของหน้านี้ใน Vet 85 Final, ทำซ้ำได้น่าจะดีกับ Vet 86', kind: 'tip' },
          { table: {
            headers: ['Q', 'Topic', 'Answer, Key fact'],
            rows: [
              ['Q4', 'Xylazine dose calc 500 kg vasectomy standing', '0.5 ml of 20mg/ml stock (= 0.02 mg/kg light std sedation)'],
              ['Q5', 'Lidocaine duration', '180 นาที (3 ชม)'],
              ['Q6', 'Paravertebral block at L1 nerve, landmark', 'TP of L2 (distal Magda)'],
              ['Q7', 'Caudal epidural in cow, location', 'S5-Co1 (sacrococcygeal)'],
              ['Q8', 'Best indicator of paravertebral block success', 'Loss of pain sensation (pin prick test)'],
              ['Q9', 'Drug NOT used in rumenotomy', 'Cefazolin (no label/withdrawal in cattle)'],
            ],
          } },
        ],
      },
      {
        heading: 'Block Decision Tree (clinical scenario)',
        source: 'AABP standards, Aj.PB',
        body: [
          { sub: 'Scenario: Standing flank rumenotomy',
            body: [
              { bullets: [
                '1. Light sedation: Xylazine 0.02 mg/kg IM (low-end, standing tolerable)',
                '2. **Paravertebral block T13/L1/L2**: Lidocaine 5-10 ml/site (proximal or distal Magda)',
                '3. Optionally + Inverted L block (rescue) or Line block at incision',
                '4. Verify: pin prick → no response = success',
              ] },
            ] },
          { sub: 'Scenario: C-section / dystocia',
            body: [
              { bullets: [
                'Xylazine pre-med (low dose, ระวัง premature labor)',
                '**Caudal epidural sacrococcygeal**: 1 ml/100 kg of 2% lidocaine (max 6 ml)',
                'Loss of resistance + hanging drop technique',
                '+ Line block at flank if standing approach',
              ] },
            ] },
          { sub: 'Scenario: Foot abscess drainage / digital amputation',
            body: [
              { bullets: [
                '**IV regional (Bier block)** under tourniquet: Lidocaine 20-30 ml of 2% (NO epinephrine)',
                'Tourniquet ≤90 min, release gradually',
                'Alternative: **NBA 4-point** ring block at hindfoot',
              ] },
            ] },
          { sub: 'Scenario: Eye surgery (enucleation)',
            body: [
              { bullets: [
                'Sedation + restraint',
                '**Peterson nerve block**: 10-15 ml retrobulbar at orbital fossa (block CN III/IV/VI/V)',
                '+ Auriculopalpebral block: 5-10 ml at zygomatic arch (paralyze eyelid, cow ไม่กระพริบ)',
                'Alternative: 4-point retrobulbar (single 10-15 ml deep behind globe)',
              ] },
            ] },
        ],
      },
      {
        heading: 'GA Risks in Ruminants',
        source: 'Aj.ภัทร์มนฉัตร PB, Sunsun84 p.1',
        body: [
          { bullets: [
            '**Active regurgitation/vomiting** = light plane (LES tone partial)',
            '**Passive regurgitation** = deep plane (LES loss, silent flow)',
            'Bloat (continued fermentation + stopped eructation)',
            'Respiratory complication (weight + abdominal viscera + ruminal contents compress diaphragm)',
            'Hypoventilation, nerve paralysis (radial, peroneal, sciatic)',
            'Myopathies (prolonged recumbency, compartment compression)',
          ] },
          { sub: 'Fasting requirements',
            body: [
              { table: {
                headers: ['Animal', 'Food fasting', 'Water fasting'],
                rows: [
                  ['Neonate', 'NOT recommended (hypoglycemia risk)', 'NOT recommended'],
                  ['Calf + small ruminant', '12 hr', '8 hr'],
                  ['Adult cattle', '12-24 hr', '12-24 hr'],
                  ['Large mature bull', '24-36 hr', '24-36 hr'],
                ],
              } },
            ] },
        ],
      },
    ],
  },

  'rumenotomy': {
    topic: 'rumenotomy',
    title: 'Rumenotomy, Aj.เอกพล (EA, 11 Q, high yield)',
    lecturer: 'ผศ.น.สพ.ดร.เอกพล อัครพุทธิพร (EA)',
    icon: '🐂',
    summary: 'Week 13, Left flank standing rumenotomy, 2-layer closure, Hardware disease (TRP) main indication, Vet 85 Final coverage 4/10 Q',
    sections: [
      {
        heading: 'Indications (6 ข้อจากสไลด์)',
        source: 'Aj.เอกพล Lecture 2026 + Sunsun84',
        body: [
          { bullets: [
            '1. **Hardware disease (TRP — Traumatic Reticuloperitonitis)** ⭐',
            '2. Other foreign bodies in rumen + reticulum',
            '3. Persistent rumen impaction',
            '4. Frothy bloat (ที่ trochar/orogastric tube ระบายไม่ออก)',
            '5. Some forms of choke (FB ติดที่ผ่านไม่ได้)',
            '6. Exploration of rumen + reticulum + parts of omasum',
          ] },
        ],
      },
      {
        heading: 'Surgical Procedure',
        source: 'Aj.เอกพล lecture slides 5-7',
        body: [
          { bullets: [
            '**Approach: Left flank standing** (left paralumbar fossa)',
            'Surgical site: **3-5 cm caudal + parallel ต่อ last rib**',
            'Incision length: **20-25 cm**',
            'Layers: Skin > SC > External oblique > Internal oblique > Transversus > Peritoneum',
            'Anesthesia: Paravertebral block (T13/L1/L2) + Caudal epidural, Lidocaine 20 ml + 3 ml respectively',
          ] },
          { sub: 'Closure (2-layer ⭐)',
            body: [
              { bullets: [
                '**Stay suture** rumen wall to skin (Continuous Cushing pattern, size 1-2) ก่อนเปิด — ป้องกัน content leak',
                'Layer 1: **Simple continuous** (mucosa-submucosa)',
                'Layer 2: **Continuous Lembert** (seromuscular inverting, serosa-to-serosa fibrin seal)',
                'Mid-term absorbable suture (Vicryl/PDS) size 1-2, lavage before release',
                'Abdominal muscle: simple continuous, long-term absorbable',
                'Skin: simple interrupted หรือ horizontal mattress, non-absorbable, gauze stent',
              ] },
            ] },
        ],
      },
      {
        heading: 'Pre-op + Post-op',
        source: 'Aj.เอกพล',
        body: [
          { bullets: [
            '**Pre-op**: PE + lab, weight measurement (cow weight tape), fasting (calf NOT, adult 12-24 hr, large bull 24-36 hr)',
            '**Post-op medication**:',
            '  • NSAID: **Flunixin meglumine 1.1-2.2 mg/kg IV**',
            '  • Antibiotic: **Procaine penicillin 22,000-66,000 U/kg IM/SC** (NOT IV) ≥ 3 วัน',
            '⚠️ Cefazolin = NOT used in cattle (no label, withdrawal undefined)',
            'Complications: lack of improvement, peritonitis, incisional infection',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping ⭐ (Vet 85 Final Q1-3, Q9-10)',
        source: 'pp\'s vet prac rum final85 p.2 + Sunsun84 p.2',
        body: [
          { table: {
            headers: ['Q', 'Topic', 'Answer, Trap'],
            rows: [
              ['Q1', 'Rumen anatomy false statement', '"แม่เหล็กอยู่ส่วนนี้" — magnet อยู่ใน reticulum NOT rumen'],
              ['Q2', 'NOT rumenotomy indication', '"Software disease" (joke distractor, trap)'],
              ['Q3', 'Calf NPO duration before sx', 'NOT recommended (ไม่อด, hypoglycemia risk)'],
              ['Q9', 'Drug NOT for rumenotomy', 'Cefazolin (avoid in food animals)'],
              ['Q10', 'Rumen closure pattern', 'Simple continuous + Continuous Lembert (2-layer inverting)'],
            ],
          } },
          { callout: '5/10 Q ของ Vet 85 Final = rumenotomy + rumen anatomy (50%) → must drill', kind: 'tip' },
        ],
      },
      {
        heading: 'Cow Magnet (Hardware Disease prevention)',
        source: 'Sunsun84 p.3 + AABP',
        body: [
          { bullets: [
            'Cylindrical magnet (Alnico/SmCo) ~7-10 cm long, 1-2 cm diameter',
            'Administer PO via balling gun → swallow → travels through esophagus → reticulum (gravity + reticular groove reflex)',
            '**Stays in reticulum permanently** (heaviest stomach compartment in adult cow, reticulum collects FB)',
            'Iron FB attracts to magnet, prevents penetration of pericardium → prevents TRP',
            'Both prevention (calves @ 6mo) + treatment (TRP early stage)',
          ] },
          { callout: '⚠️ Q1 trap: นักศึกษามักเลือก "magnet อยู่ใน rumen" — ผิด, อยู่ใน reticulum', kind: 'warn' },
        ],
      },
      {
        heading: 'Reticulum-specific procedures',
        source: 'Aj.เอกพล + Sunsun84 p.3',
        body: [
          { bullets: [
            '**Hardware disease (TRP)** = sharp metal FB pierces reticulum wall → migrates → diaphragm → pericardium',
            'Pain test classics: **Wither test** (pinch wither, grunt = pain), Pole/Bamboo test (bar lifted under xiphoid, grunt), Xiphoid percussion',
            'Auscultation: muffled heart sounds (pericardial effusion), friction rub (pericarditis)',
            'Lab: neutrophilia + left shift, ↑Fibrinogen >700 mg/dL, ↑AST, ↓albumin',
            'Radiography lateral: confirm metallic FB in reticulum',
            'Ultrasound: pericardial effusion, abscess',
            'Treatment ladder: cow magnet (early) → rumenotomy + manual FB removal → pericardiocentesis (if effusion) + broad-spectrum AB + NSAID → cull if poor prognosis',
          ] },
        ],
      },
    ],
  },

  'dehorning': {
    topic: 'dehorning',
    title: 'Dehorning, Cornual Block + Sinus Risk',
    lecturer: 'Surgery staff (อ.เอกพล + team)',
    icon: '🐃',
    summary: 'Week 13, Cornual nerve block, debudding <2m vs adult dehorning, frontal sinus risk',
    sections: [
      {
        heading: 'Anatomy + Anesthesia',
        source: 'Sunsun84 p.6',
        body: [
          { bullets: [
            '**Horn = แกนกระดูกเขา** (osseous, extension of frontal bone)',
            '**Coronary corium = เนื้อเขา** (vascular tissue, สร้าง keratin sheath)',
            '**Cornual diverticulum** = extension ของ frontal sinus เข้าใน horn core (ทำให้ adult dehorning เสี่ยง sinusitis)',
            'อายุ <2 เดือน = แค่ horn bud, ไม่มี sinus communication',
          ] },
          { sub: 'Cornual nerve block',
            body: [
              { bullets: [
                'Cornual branch ของ zygomaticotemporal nerve (CN V/V1)',
                'ฉีด lidocaine 2% × 5-10 ml ที่ frontal ridge ครึ่งทางระหว่าง lateral canthus + horn base',
              ] },
            ] },
        ],
      },
      {
        heading: 'Method by Age',
        source: 'Sunsun84 p.6',
        body: [
          { table: {
            headers: ['อายุ', 'Method', 'อุปกรณ์'],
            rows: [
              ['<6 wk (calf, horn bud)', 'Debudding/disbudding', 'Hot iron, hoof knife, calf dehorner gauge, 50% CaCl2 caustic paste'],
              ['Adult (full horn)', 'Dehorning', 'Tube/Robert dehorner, Obstetric wire (Gigli), Trephine'],
            ],
          } },
        ],
      },
      {
        heading: 'Post-op Complication: Sinusitis',
        source: 'Sunsun84 p.6',
        body: [
          { bullets: [
            'Frontal sinus communication exposed → bacterial entry → sinusitis + empyema',
            'Sign: nasal discharge, ทำหน้าผิดจากการเจ็บ',
            '**Treatment: Open drainage (Trephination)** Dia ~2.5 cm:',
            '  • Frontal sinus: ลากเส้น lat canthus 2 ข้าง × midline, เปิดระหว่างจุดตัดบน/ล่าง ~1 cm',
            '  • Maxillary sinus: เส้นเชื่อม medial canthus → maxillary protuberance, เปิดที่กึ่งกลาง',
            '⚠️ AB ทาง IV อย่างเดียวไม่พอ — ต้อง drainage (pus ใน sinus ไม่ระบายเอง)',
          ] },
        ],
      },
      {
        heading: 'Decision Tree: When to dehorn vs not',
        source: 'AABP + Sunsun84 p.6',
        body: [
          { sub: 'Indication (dehorn)',
            body: [
              { bullets: [
                'Reduce injury risk to other cows + handlers',
                'Increase carcass market value',
                'Handling/transport easier',
                'Reduce trauma during squeeze chute work',
                'Treatment of horn injuries (chronic infection, fracture)',
              ] },
            ] },
          { sub: 'Contraindication (do not dehorn)',
            body: [
              { bullets: [
                'Adult bull with mature horn (frontal sinus heavily exposed → high sinusitis risk)',
                'Heat stress / poor weather (incision exposed)',
                'Pregnant late gestation',
                'Active disease (immune compromise)',
                'Show animal where horn is breed standard',
              ] },
            ] },
        ],
      },
      {
        heading: 'Disbudding Methods Comparison',
        source: 'Sunsun84 p.6 + dairy industry standards',
        body: [
          { table: {
            headers: ['Method', 'Age', 'Pros', 'Cons'],
            rows: [
              ['Hot iron (cautery)', '<6 wk', 'No bleeding, cheap, fast', 'Pain, heat damage, need restraint'],
              ['Hoof knife / scoop', '<6 wk', 'Cheap, simple', 'Bleeding, regrowth if incomplete'],
              ['Calf dehorner gauge (cup)', '2-6 wk', 'Quick, sharp removal', 'Bleeding'],
              ['50% CaCl2 caustic paste', '<2 wk only', 'Painless if used early', 'Caustic spread risk, eye damage if rubs'],
              ['Tube/Robert dehorner (adult)', 'Adult', 'Full removal', 'Frontal sinus exposed → sinusitis risk'],
              ['Obstetric wire (Gigli)', 'Adult', 'Clean cut, controlled', 'Slow, need anesthesia + analgesia'],
              ['Trephine + saw', 'Adult', 'Surgical control', 'Most invasive, longest recovery'],
            ],
          } },
        ],
      },
    ],
  },
};
