// ──────────────────────────────────────────────────────────────────
// Poultry Health Management (3107409) Study Notes — Final scope (L9-L15)
// Final exam: 7 พ.ค. 2569 · VET6 702 · 13:00-15:00
// Coordinator: อ.ดร.เกรียงวิชญ์ ลิมป์วิทยาคุณ
// ──────────────────────────────────────────────────────────────────

export const NOTES_POULTRY = {
  'first-week-mortality': {
    topic: 'first-week-mortality',
    title: 'L9 · First Week Mortality + Immunology (AHRA)',
    lecturer: 'อ.สมศักดิ์ + พี่อู๋ (course coordinator)',
    icon: '🐣',
    summary: 'AHRA framework · Pasgar score · IgY/MDA/Harderian gland · Rolling reaction · vaccine principles',
    sections: [
      {
        heading: 'Avian Immunology',
        source: 'อ.สมศักดิ์ Lecture + Kim85 + Nicky 86',
        body: [
          { bullets: [
            '**Lymphoid organs**: Bursa of Fabricius (B-cell) · Thymus (T-cell) · cecal tonsils',
            '**IgY** (avian homologue ของ IgG) — ส่งจากแม่ผ่านไข่แดง (yolk) → MDA ป้องกันลูกไก่ ~3 wk',
            'IgM ส่งผ่านไข่ขาวในปริมาณน้อย · ไม่มีรกในไก่',
            '**Harderian gland** — secretory IgA · upper respiratory immunity',
          ] },
        ],
      },
      {
        heading: 'First Week Mortality',
        source: 'AHRA / ShineChick framework',
        body: [
          { bullets: [
            '**Target: <1% day-old · <1% wk-1 · <1.5% wk-2** (slide showed 3% spike day 4 = abnormal)',
            'Common causes: omphalitis · yolk sac infection · chilling/overheating · dehydration',
            '**Pasgar score** (5 points) — eval chick quality at 24h',
            '**Rolling reaction** — vaccine response timing concept',
          ] },
        ],
      },
    ],
  },

  'avian-zoonosis': {
    topic: 'avian-zoonosis',
    title: 'L10 · Avian Zoonosis',
    lecturer: 'อ.กมลพรรณ จรัญกุล (Vet Public Health, CU)',
    icon: '🧬',
    summary: 'Zoonotic diseases ที่ติดจากสัตว์ปีกมาคน · bacteria + virus + fungi',
    sections: [
      {
        heading: 'Major Avian Zoonoses',
        source: 'Aj.กมลพรรณ slide L10',
        body: [
          { table: {
            headers: ['Disease', 'Pathogen', 'Notes'],
            rows: [
              ['Chlamydiosis (Psittacosis)', 'Chlamydia psittaci', 'Gram-neg obligate intracellular'],
              ['Erysipelas', 'Erysipelothrix rhusiopathiae', 'Skin lesions in handlers'],
              ['Avian TB', 'Mycobacterium avium', 'Chronic granuloma'],
              ['Salmonellosis', 'Salmonella spp.', 'Common foodborne'],
              ['Campylobacteriosis', 'Campylobacter jejuni', 'Common foodborne'],
              ['Yersiniosis', 'Yersinia pseudotuberculosis', ''],
              ['Q Fever', 'Coxiella burnetii', 'Aerosol transmission'],
              ['Cryptococcosis', 'Cryptococcus neoformans (yeast)', 'Pigeon droppings'],
              ['Newcastle disease (NDV)', 'Paramyxovirus', 'Conjunctivitis ใน handler'],
              ['West Nile (WNV)', 'Flavivirus', 'Mosquito-borne'],
              ['Avian Influenza', 'Influenza A H5N1/H7N9', 'Pandemic potential'],
            ],
          } },
        ],
      },
    ],
  },

  'biosecurity': {
    topic: 'biosecurity',
    title: 'L11 · Biosecurity + Disease Surveillance',
    lecturer: 'อ.ณทยา เจริญวิศาล (ผศ.สพ.ญ.ดร.)',
    icon: '🛡',
    summary: '3-level biosecurity (Conceptual/Structural/Procedural) · sample size + Se/Sp · disease prevention vs control',
    sections: [
      {
        heading: '3 Levels of Biosecurity',
        source: 'Aj.ณทยา slide L11 + Nicky 86 master p.28',
        body: [
          { table: {
            headers: ['Level', 'Definition', 'Examples'],
            rows: [
              ['**Conceptual**', 'แผนผังโครงสร้างฟาร์ม', 'Zoning · fencing · pest exclusion · ระยะห่างจากฟาร์มอื่น'],
              ['**Structural**', 'อุปกรณ์ + ระบบ', 'Boot dip · perimeter fence · shower-in · dedicated equipment per house'],
              ['**Procedural**', 'SOP + monitoring', 'Employee training · water quality (pH + heavy metal + bacterial count) · feed QC · recordkeeping'],
            ],
          } },
        ],
      },
      {
        heading: 'Sampling for Surveillance',
        source: 'OIE + Cannon-Roe formula',
        body: [
          { bullets: [
            '**Sample size depends on test Se/Sp** — low Se/Sp → ต้องเพิ่ม n เพื่อ statistical power',
            '**Boot swab** — environmental sampling (Salmonella · AI)',
            '**Cloacal swab** — individual bird (NDV · AI · LT)',
            '**Cleft palate swab** — respiratory pathogens',
            '**Hen Housed (HH) production** = total eggs / hens housed at start',
            '**Hen Day (HD) production** = eggs that day / hens alive that day',
          ] },
        ],
      },
      {
        heading: 'Disease Prevention vs Control',
        source: 'Nicky 86 master p.28',
        body: [
          { bullets: [
            '**Prevention** (ก่อนติด): vaccine + biosecurity + surveillance + immunity check',
            '**Control** (หลังติด): isolation · culling · treatment · disinfection · trace + restrict movement',
            'ถ้าโรคไวรัสที่รักษาไม่ได้ (เช่น HPAI) → stamp out (กำจัดทั้งฝูง + ทำลายซาก)',
          ] },
        ],
      },
    ],
  },

  'avian-drugs': {
    topic: 'avian-drugs',
    title: 'L13 · Avian Drugs · AMR',
    lecturer: 'Prof.นิวัตร จันทร์ศิริพรชัย (DTBVM · CU Vet)',
    icon: '💊',
    summary: 'Antimicrobial classification · time- vs concentration-dependent · Mycoplasma Tx · banned drugs · AMR 5 Rs',
    sections: [
      {
        heading: 'Antimicrobial Classification',
        source: 'Prof.นิวัตร slide L13',
        body: [
          { table: {
            headers: ['Class', 'Mechanism', 'Example'],
            rows: [
              ['Cidal vs Static', 'Kill vs inhibit growth', 'Cidal: PCN, FQs · Static: tetra, macrolide'],
              ['Time-dependent', 'Effect = time above MIC', 'β-lactams (PCN) · macrolides — give frequent doses'],
              ['Concentration-dependent', 'Effect = peak/MIC ratio', 'FQs · aminoglycosides — give high doses less often'],
            ],
          } },
        ],
      },
      {
        heading: '⛔ Banned Drugs (Thailand poultry)',
        source: 'Prof.นิวัตร · Thai DLD regulations',
        body: [
          { bullets: [
            '**Vancomycin** — last-resort human · ห้ามในสัตว์อาหาร',
            '**DES (Diethylstilbestrol)** — synthetic estrogen · carcinogen',
            '**Chloramphenicol (CAP)** — bone marrow toxicity in humans',
            '**Nitrofurans** (Furazolidone, Nitrofurazone) — carcinogenic + mutagenic',
          ] },
          { callout: 'Reason: ตกค้างในผลิตภัณฑ์ → carcinogen/mutagen + AMR concern', kind: 'warn' },
        ],
      },
      {
        heading: 'Common Conditions',
        source: 'Slide L13',
        body: [
          { bullets: [
            '**Mycoplasmosis (MG/MS)** — Tylosin, Tilmicosin, Enrofloxacin (NOT β-lactams · no cell wall)',
            '**Plasmodium (Avian malaria)** — chloroquine + primaquine',
            '**Knemidocoptes (scaly leg mite)** — ivermectin',
            '**Mold binders** (mycotoxin) — clay binders + activated charcoal',
          ] },
        ],
      },
      {
        heading: 'AMR 5 Rs (responsible use)',
        source: 'WHO + OIE',
        body: [
          { bullets: [
            'Right **Drug** (narrow spectrum if possible)',
            'Right **Dose** (full therapeutic · ไม่ underdose)',
            'Right **Duration** (ไม่ short course)',
            'Right **Time** (early · culture-guided ถ้าเป็นไปได้)',
            'Right **Patient** (correct ID · withdrawal time)',
          ] },
        ],
      },
    ],
  },

  'quality-assurance': {
    topic: 'quality-assurance',
    title: 'L14-15 · Quality Assurance · Betagro framework',
    lecturer: 'น.สพ.เอกสิงห์ สาเรือง (Betagro)',
    icon: '🏆',
    summary: 'QA 5 ด้าน · PDCA cycle · Five Freedoms · BQM 4 มิติ · Haugh Unit · FCR',
    sections: [
      {
        heading: 'Quality Assurance 5 ด้าน',
        source: 'น.สพ.เอกสิงห์ slide L14',
        body: [
          { bullets: [
            '**Quality Control** — inspection ระหว่างผลิต',
            '**Quality Audit** — internal/external review',
            '**Accreditation** — certification body (GAP · HACCP · ISO)',
            '**Quality Assessment** — outcome metrics (Haugh Unit, FCR, mortality)',
            '**Traceability** — track product back to farm/batch',
          ] },
        ],
      },
      {
        heading: 'PDCA Cycle (Deming wheel)',
        source: 'Quality management standard',
        body: [
          { bullets: [
            '**Plan** — ระบุปัญหา + วางแผน (เช่น egg quality drop)',
            '**Do** — ลงมือทำตามแผน (test new feed in 1 house)',
            '**Check** — เก็บข้อมูล + ประเมิน (Haugh Unit · egg weight)',
            '**Act** — Standardize ถ้าสำเร็จ · revise ถ้าไม่ · loop กลับ Plan',
          ] },
        ],
      },
      {
        heading: 'Five Freedoms (Welfare)',
        source: 'FAWC + AVMA',
        body: [
          { bullets: [
            '1. Freedom from hunger + thirst',
            '2. Freedom from discomfort (proper environment)',
            '3. Freedom from pain · injury · disease',
            '4. Freedom to express normal behavior',
            '5. Freedom from fear + distress',
          ] },
        ],
      },
      {
        heading: 'BQM 4 มิติ + Key Metrics',
        source: 'Betagro QA framework',
        body: [
          { bullets: [
            '**BQM (Better Quality Management) 4 มิติ**: Productivity · Quality · Safety · Welfare',
            '**Haugh Unit (HU)** — egg quality · log of albumen height adjusted for egg weight · >72 = AA grade',
            '**FCR (Feed Conversion Ratio)** = feed consumed / weight gain · target broiler 1.6-1.8',
            '**Slow-growth trade-offs** — better welfare · slower growth · higher cost vs intensive',
            '**NCR (Non-Conformance Report)** — log + corrective action',
          ] },
        ],
      },
    ],
  },
};
