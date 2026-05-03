// ──────────────────────────────────────────────────────────────────
// Clin App Rum (3108411) Study Notes — Final scope
// Final exam: 8 พ.ค. 2569 · VET6 B01-B03 · 13:00-16:00
// Main scope: อ.ศวิตา (Sawita · 3 lectures × 15 ข้อ = 45 ข้อ)
// ──────────────────────────────────────────────────────────────────

export const NOTES_CLIAPPRUM = {
  'metabolism-nutrition': {
    topic: 'metabolism-nutrition',
    title: 'Metabolism & Nutrition in Dairy Cows',
    lecturer: 'Clin App Rum staff',
    icon: '🌾',
    summary: 'Clinical Dashboard 5 sections · Transition period · Subclinical ketosis (BHBA) · NEFA · BCS · Feces + Locomotion Score',
    sections: [
      {
        heading: 'Clinical Dashboard 5 sections',
        source: 'Clin App Ruminant Final master p.1-8',
        body: [
          { bullets: [
            '**1. DMI (Dry Matter Intake)** — น้ำหนักอาหาร × %DM · target 3-4% BW lactating',
            '**2. Nutritional values** — CP / NDF / ADF / NE',
            '**3. Nutrient requirements** — match supply to need',
            '**4. R:C ratio + Milk fat** — 60:40 standard · MFD ที่ <40:60',
            '**5. Particle size** — Penn State 4-layer · ชั้น 1 (>19mm) 2-8%',
          ] },
        ],
      },
      {
        heading: 'Transition Period (3 weeks pre/post calving)',
        source: 'Master PDF p.1 + NRC',
        body: [
          { bullets: [
            '**Physiological NEB** = ทุก dairy cow มี · DMI ลดลง vs production demand เพิ่มขึ้น',
            '**Pathological**: subclinical/clinical ketosis · hypocalcemia · LDA · retained placenta',
          ] },
          { sub: 'Markers',
            body: [
              { table: {
                headers: ['Marker', 'Cutoff', 'Meaning'],
                rows: [
                  ['BHBA', '≥1.2 mM (subclinical) · ≥3.0 (clinical ketosis)', 'Ketone body'],
                  ['NEFA', '>0.4 pre-partum · >0.7 post-partum', 'Excessive lipolysis'],
                  ['BCS drop', '>0.5 unit in transition', 'Body condition loss'],
                  ['Feces Score', '1-5 scale (3 ideal pancake)', 'GI health'],
                  ['Locomotion (LCS)', '1-5 scale (3+ = intervene)', 'Lameness · target <10% with LCS≥3'],
                ],
              } },
            ] },
        ],
      },
      {
        heading: 'Milk Fat Depression (MFD)',
        source: 'Master p.4 + Clinical correlation',
        body: [
          { bullets: [
            'R:C ลด → fermentable CHO เพิ่ม → rumen acidosis (SARA)',
            '→ Lactic acid + propionate เพิ่ม · acetate (milk fat precursor) ลด',
            '→ trans-10 C18:1 fatty acid form → inhibit milk fat synthesis directly',
            'Other consequences: laminitis · LDA · subclinical milk loss',
          ] },
        ],
      },
    ],
  },

  'ruminant-anesthesia': {
    topic: 'ruminant-anesthesia',
    title: 'Ruminant Anesthesia',
    lecturer: 'อ.ภัทร์มนฉัตร บุนนาค (PB) [จัดทำโดย รศ.สุมิตร ดุรงค์พงษ์ธร]',
    icon: '💉',
    summary: 'Local + General anesthesia · ET intubation · Patient prep + fasting · Catheters · Local block selection',
    sections: [
      {
        heading: 'General Considerations',
        source: 'Aj.PB Lecture 2026',
        body: [
          { bullets: [
            '**Local + chemical restraint standing** = preferred for most procedures',
            'GA only for prolonged/complicated sx',
            '**Greater risk in prolonged recumbency**: myopathies + neuropathies (radial · peroneal · sciatic)',
            'Violent recovery NOT typical in ruminants (vs equine)',
          ] },
        ],
      },
      {
        heading: 'Patient Preparation',
        source: 'Aj.PB',
        body: [
          { table: {
            headers: ['Animal', 'Food fasting', 'Water fasting'],
            rows: [
              ['Neonate', 'NOT recommended', 'NOT recommended'],
              ['Calf + small ruminant', '12 hr', '8 hr'],
              ['Adult cattle', '12-24 hr', '12-24 hr'],
              ['Large mature bull', '24-36 hr', '24-36 hr'],
              ['Cow (alt)', '24-48 hr', '12-24 hr'],
            ],
          } },
          { bullets: [
            'Catheter: **Jugular 14 ga** (most common) · Cephalic/saphenous (small ruminant)',
            'Maintenance fluid: 4-8 ml/kg/h · Hypotension correction: 10-25 ml/kg/h',
          ] },
        ],
      },
      {
        heading: 'Pre-medication + Sedation',
        source: 'Aj.PB Master p.9',
        body: [
          { bullets: [
            '⛔ **Atropine** — limited use ในวัว: saliva เหนียวข้น (ไม่ลด) · GI motility ลด → bloat risk',
            '**Xylazine (alpha-2)** — 0.05-0.1 mg/kg IM/IV · Brahman > Hereford > Holstein sensitivity · reverse: yohimbine',
            '**Diazepam/Midazolam (benzo)** — muscle relaxation · minimal CV depression · ไม่มี analgesic · reverse: flumazenil',
            '⚠️ **Acepromazine (phenothiazine)** — penile prolapse risk in bulls (vasodilation)',
          ] },
        ],
      },
      {
        heading: 'GA Potential Problems',
        source: 'Aj.PB',
        body: [
          { bullets: [
            'Active regurgitation = light plane · Passive (silent) = deep plane',
            'Bloat (continued fermentation + stopped eructation) → compress diaphragm',
            'Respiratory: weight + abdominal viscera + ruminal contents + bloat → impaired ventilation',
            'Hypoventilation (anesthetic effect) · Nerve paralysis (malposition + poor padding + hypotension)',
          ] },
        ],
      },
      {
        heading: 'Local + Regional Block Selection',
        source: 'Master p.15 Decision Matrix',
        body: [
          { table: {
            headers: ['Procedure', 'Block', 'Note'],
            rows: [
              ['Eye surgery (eyelid only)', 'Auriculopalpebral', 'Block motor only · eyeball still moves'],
              ['Eye surgery (deep · enucleation)', 'Peterson', 'Block CN III/IV/VI/V · complete akinesia'],
              ['Standing flank sx (rumenotomy · LDA · c-section)', 'Paravertebral T13/L1/L2', 'Proximal or distal Magda'],
              ['Perineal sx · c-section · dystocia', 'Caudal epidural sacrococcygeal (S5-Co1)', 'Lidocaine 1 ml/100 kg · max 6 ml'],
              ['Distal limb (digit · foot abscess)', 'IV regional (Bier block)', 'Lidocaine 20-30 ml · NO epi · ≤90 min'],
              ['Dehorning', 'Cornual nerve block', 'Lidocaine 5-10 ml at frontal ridge'],
            ],
          } },
        ],
      },
    ],
  },

  'gi-surgery-sawita': {
    topic: 'gi-surgery-sawita',
    title: 'GI Surgery (Sawita 3 lectures · 45 ข้อ ⭐ MAIN SCOPE)',
    lecturer: 'อ.ศวิตา สันติวิภารัตน์ (SS)',
    icon: '🔪',
    summary: 'Rumenotomy · LDA + RDA correction · Abomasal volvulus · Cecal dilatation/dislocation · Hardware disease (TRP)',
    sections: [
      {
        heading: 'LDA + RDA Correction',
        source: 'อ.ศวิตา GI Surgery I-II + Sunsun84 p.2',
        body: [
          { bullets: [
            '**LDA (Left Displaced Abomasum)** — first 30 days post-partum peak · 50-90% concurrent ketosis',
            '**RDA (Right Displaced Abomasum)** — risk progress to volvulus (RAV)',
          ] },
          { sub: 'Right Flank Omentopexy (LDA correction)',
            body: [
              { bullets: [
                '1. Standing right paralumbar fossa incision',
                '2. Reach across · palpate LDA on left',
                '3. **Decompress abomasum** with needle/trocar (release gas)',
                '4. Manipulate abomasum back to ventral right',
                '5. Identify pylorus + greater omentum',
                '6. **Suture greater omentum** to peritoneum + transversus abdominis (ventral right) — **horizontal mattress** + long-term absorbable',
                '7. Close 3 abdominal layers + skin',
              ] },
            ] },
          { sub: 'Left Abomasopexy (alternative)',
            body: [
              { bullets: [
                'Standing left flank · pylorus drawn down + sutured to ventral abdominal wall',
                '2 จับปลาย (lumen + final interlocking)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Diagnostic Ping Sound',
        source: 'อ.ศวิตา + Sunsun84 p.3',
        body: [
          { bullets: [
            'Simultaneous **auscultation + percussion** → high-pitched metallic ping',
            'LDA: ping at left flank rib 9-13 upper third',
            'RDA / RAV: ping at right flank same level',
            'Cecal dilatation: ping at right flank lower posterior',
            'Pneumoperitoneum: ping over wide area',
          ] },
        ],
      },
      {
        heading: 'Abomasal Volvulus (RAV) ★ Surgical Emergency',
        source: 'อ.ศวิตา + Smith Internal Medicine',
        body: [
          { bullets: [
            'Pathophysiology: abomasum displaces right + rotates 90-360° (clockwise from rear) → ischemia',
            'Lab pattern: **hypochloremic + hypokalemic metabolic alkalosis** (Cl<85 · K<3 · HCO3>32)',
            'Hemoconcentration: PCV>40% · TP>8',
            '**Lactate >4 mM = poor prognosis** · time from onset >6-12 hr → mortality risk doubles',
            'Mortality 25-40% even with surgery (vs LDA <10%)',
          ] },
          { callout: '⚠️ Right flank approach · decompress first · de-rotate counterclockwise from rear · assess viability post-correction', kind: 'warn' },
        ],
      },
      {
        heading: 'Cecal Dilatation + Dislocation (CDD)',
        source: 'Sunsun84 p.2',
        body: [
          { bullets: [
            '**Cecal dilatation**: cecum distended · apex still caudal · palpable at right flank · Ping sound',
            '**Cecal dislocation/retroflexion**: body + apex flipped cranially (90-180° flip) → cecal apex palpable per rectum bulging',
            '**Tx**: เปิดช่องท้องแก้ไข ventral retroflexion · นำ body + apex ลอกออก · **Typhlotomy** (open cecum drain content) แก้ retroflexion ที่ apex',
          ] },
        ],
      },
      {
        heading: 'Hardware Disease (TRP) — Multi-modal Diagnosis',
        source: 'Sunsun84 p.3 + AABP',
        body: [
          { bullets: [
            '**Pain tests**: Wither test (pinch wither → grunt) · Pole/Bamboo test (lift bamboo under xiphoid) · Xiphoid pressure',
            '**Auscultation**: muffled heart sounds + rub sounds + decreased reticular contraction',
            '**Metal detector**: positive metallic FB (false positive if magnet already given)',
            '**Bloodwork**: neutrophilia + left shift · ↑ Fibrinogen >700 mg/dL · ↑ AST · ↓ albumin',
            '**Radiography lateral**: confirm metallic FB in reticulum',
            '**Ultrasound**: pericardial effusion · abscess',
          ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                'Cow magnet PO (preventive + early Tx)',
                'Rumenotomy + manual FB removal',
                'Pericardiocentesis if pericardial effusion (drain + AB)',
                'Broad-spectrum AB + NSAID + cull if poor prognosis',
                'Early TRP no peritonitis: good prognosis · Advanced + pericarditis: poor',
              ] },
            ] },
        ],
      },
    ],
  },

  'gi-vdtt': {
    topic: 'gi-vdtt',
    title: 'GI Medicine (VDTT) · Ruminant GI Disorder',
    lecturer: 'ผศ.น.สพ. ธนศักดิ์ บุญเสริม (TB)',
    icon: '🩺',
    summary: 'Rumen pH + microflora analysis · GI motility · Acidosis/Alkalosis · Methylene blue + Sediment activity + Gram stain',
    sections: [
      {
        heading: 'Rumen pH + Acidosis',
        source: 'อ.ธนศักดิ์ slide + Sunsun84 p.3',
        body: [
          { table: {
            headers: ['pH range', 'Status', 'Cause'],
            rows: [
              ['<5.0', 'Acute lactic acidosis', 'Grain engorgement (Streptococcus bovis bloom)'],
              ['5.0-5.5', 'SARA (Subacute)', 'Chronic high concentrate · low effective fiber'],
              ['5.5-7.5', '**Normal** ⭐', 'Healthy fermentation'],
              ['>7.0', 'Inactive rumen', 'Spoiled feed · prolonged anorexia · post-AB'],
            ],
          } },
        ],
      },
      {
        heading: 'Rumen Fluid Analysis (cowside)',
        source: 'อ.ธนศักดิ์',
        body: [
          { sub: '1. Methylene Blue Reduction Test',
            body: [
              { bullets: [
                'Add methylene blue to rumen fluid · time to decolorization',
                '<3 min = bacteria เยอะมาก (acidosis)',
                '**3-6 min = NORMAL** ⭐',
                '>6 min = bacteria inactive',
              ] },
            ] },
          { sub: '2. Sediment Activity Time',
            body: [
              { bullets: [
                'Pour rumen fluid in graduated cylinder',
                '**Normal: complete sedimentation 4-8 min**',
              ] },
            ] },
          { sub: '3. Gram Stain Ratio',
            body: [
              { bullets: [
                '**Normal: G(+) predominate** ⭐',
                'Acidosis shift: G(-) เพิ่ม (Strep bovis killed at low pH · endotoxin → laminitis sequela)',
              ] },
            ] },
          { sub: '4. Protozoa Motility',
            body: [
              { bullets: [
                'Normal: active motile protozoa',
                'No protozoa = severe acidosis or post-antibiotic',
              ] },
            ] },
        ],
      },
      {
        heading: 'GI Motility Disorders',
        source: 'อ.ธนศักดิ์',
        body: [
          { bullets: [
            '**Normal rumen contraction**: 1-3/min (auscultate left paralumbar fossa)',
            'Cycle: A-cycle (mixing) + B-cycle (eructation)',
          ] },
          { sub: 'Hypomotility DDx',
            body: [
              { bullets: [
                '**Mechanical**: TRP · LDA/RDA · cecal dilatation · severe bloat',
                '**Metabolic**: hypocalcemia · acidosis · endotoxemia · hyperkalemia',
                '**Systemic**: sepsis · pneumonia · BVDV · MCF · ketosis · vagal indigestion',
              ] },
            ] },
          { sub: 'Hypermotility',
            body: [
              { bullets: [
                'Early SARA · stress · early abomasal disease',
              ] },
            ] },
        ],
      },
    ],
  },

  'hoof-health-fleet': {
    topic: 'hoof-health-fleet',
    title: 'Hoof Health Management ในฝูง · TLI Framework',
    lecturer: 'ผศ.น.สพ. ปิยะณัฐ ประสมศรี (PP)',
    icon: '🐾',
    summary: 'Locomotion scoring · TLI framework · Routine trimming 2x/year · Footbath strategy · interpretation tree',
    sections: [
      {
        heading: 'TLI Framework (4 elements)',
        source: 'อ.ปิยะณัฐ pptx slide 3-7',
        body: [
          { bullets: [
            '**T — Timing**: ประเมินตอนไหน · ไม่รบกวน work flow · ใช้คนน้อย · โคเดินอิสระ · เวลาประณีต',
            '**L — Location**: พื้นเรียบ ไม่ลาดเอียง · ระยะเดินตรง ≥4 m · work flow น้อย',
            '**I — Identification**: จดเบอร์โคให้ครบทุกตัว',
            '**I — Interpretation**: แปลผล LCS ตามปัจจัย Routine Trimming (RT) ของฟาร์ม',
          ] },
        ],
      },
      {
        heading: 'Locomotion Score (LCS · Sprecher 1997)',
        source: 'อ.ปิยะณัฐ + AABP',
        body: [
          { table: {
            headers: ['Score', 'Description', 'Action'],
            rows: [
              ['1 Normal', 'Back ตรง · steps สม่ำเสมอ', 'Routine'],
              ['2 Mild', 'Back arched standing · normal walking', 'Monitor'],
              ['3 Moderate', 'Arched standing+walking · short stride', '⭐ เริ่ม intervene (trim · footbath · lift)'],
              ['4 Lame', 'Marked arch · favors leg · slow', 'Urgent treatment'],
              ['5 Severe', 'Refuses to bear weight', 'Cull or aggressive Tx'],
            ],
          } },
          { callout: 'Industry target: <10% with LCS≥3 · >25% = serious problem · ลด milk yield 5-15% per lame cow', kind: 'tip' },
        ],
      },
      {
        heading: 'Interpretation Tree',
        source: 'อ.ปิยะณัฐ slide 9-10',
        body: [
          { sub: 'ฟาร์มที่มี RT 2 ครั้ง/ปี',
            body: [
              { bullets: [
                'Lameness "ไม่น่ากังวล" → รอรอบ RT (กีบยาวเป็นปัจจัย)',
                'Lameness "น่ากังวล + เพิ่งผ่าน RT" → ไม่ใช่ overgrowth · DDx:',
                '  • Infectious (digital dermatitis · foot rot)',
                '  • Laminitis (feeding mgt · SARA)',
                '  • Iatrogenic (over-trimmed)',
              ] },
            ] },
          { sub: 'ฟาร์มที่ไม่มี RT',
            body: [
              { bullets: [
                '"น่ากังวลมาก" — DDx: sole ulcer · white line · infectious · laminitis',
                'แนะนำเริ่ม RT program ทันที',
              ] },
            ] },
        ],
      },
      {
        heading: 'Footbath Protocol',
        source: 'อ.ปิยะณัฐ + AABP',
        body: [
          { bullets: [
            '**CuSO4 (Copper sulfate) 5%** = 50 g/L (most common · cheap · effective vs Treponema)',
            '**Formalin 3-5%** (kills wider spectrum · irritant · carcinogenic · restricted)',
            '**Glutaraldehyde 1-2%** (less corrosive · stable)',
            'Frequency: **2x/week routine · daily during outbreak**',
            'Walk-through ≥3 m · alternate CuSO4 ↔ formalin weeks · replace every 200 cow passes',
          ] },
        ],
      },
      {
        heading: 'Routine Trimming (RT)',
        source: 'อ.ปิยะณัฐ slide 8 + Dutch 5-step',
        body: [
          { bullets: [
            'Frequency: **2x/year (every 6-12 months)** ⭐ at dry-off + mid-lactation',
            'Claw growth ~5 mm/month vs wear ~3-4 mm/month → excess growth = unbalanced weight',
            'Outcome: ↓ sole ulcer 30-50% · ↑ milk 0.5-2 kg/d',
          ] },
          { sub: 'Dutch 5-step',
            body: [
              { bullets: [
                '1. Trim toe to correct length (7.5 cm dorsal wall) on **inner claw first**',
                '2. Match outer claw to inner',
                '3. Bevel inner claw (slight raise)',
                '4. Hollow out lateral claw (relieve pressure)',
                '5. Remove damaged horn / loose fragments',
              ] },
            ] },
        ],
      },
    ],
  },
};
