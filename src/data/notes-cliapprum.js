// ──────────────────────────────────────────────────────────────────
// Clin App Rum (3108411) Study Notes — Final scope
// Final exam: 8 พ.ค. 2569 · VET6 B01-B03 · 13:00-16:00
// Main scope: อ.ศวิตา (Sawita · 3 lectures × 15 ข้อ = 45 ข้อ)
//
// Source priority:
//   1) Lecture 2026 PDFs/PPTX (อ.ศวิตา GI Sx · อ.ปิยะณัฐ Metabolism+Hoof · อ.ภัทร์มนฉัตร Anesthesia · อ.ธนศักดิ์ GI VDTT)
//   2) Sunsun84 รวมข้อสอบเก่า (Vet 84 senior recall)
//   3) Kim85 + Ploy83 + Master 86 cross-reference
//   4) Smith Internal Medicine Large Animal · AABP standards
//
// Lecturer attribution corrections (2026-05-08, per Palm + TJ p4):
//   - Metabolism & Nutrition lecturer = ผศ.น.สพ. ปิยะณัฐ ประสมศรี (Piyanat Prasomsri)
//     (was "Clin App Rum staff" — same lecturer as Hoof Health, both PP)
// ──────────────────────────────────────────────────────────────────

export const NOTES_CLIAPPRUM = {
  'metabolism-nutrition': {
    topic: 'metabolism-nutrition',
    title: 'Metabolism & Nutrition in Dairy Cows',
    lecturer: 'ผศ.น.สพ. ปิยะณัฐ ประสมศรี (Piyanat Prasomsri, PP)',
    icon: '🌾',
    summary: 'Clinical Dashboard 5 sections · Transition period · Subclinical ketosis (BHBA) · NEFA · BCS · Feces + Locomotion Score',
    sections: [
      {
        heading: 'Clinical Dashboard 5 sections',
        source: 'Clin App Ruminant Final master p.1-8',
        body: [
          { bullets: [
            '**1. DMI (Dry Matter Intake)** — น้ำหนักอาหาร × %DM · target 3-4% BW lactating · 2-2.5% BW dry cow',
            '**2. Nutritional values** — CP / NDF / ADF / NE — analyze ทั้ง forage + TMR',
            '**3. Nutrient requirements** — match supply to need (NRC 2001 dairy tables)',
            '**4. R:C ratio + Milk fat** — 60:40 standard · MFD ที่ <40:60',
            '**5. Particle size** — Penn State 4-layer · ชั้น 1 (>19mm) 2-8% · ชั้น 4 (pan) <30%',
          ] },
        ],
      },
      {
        heading: 'Transition Period (3 weeks pre/post calving)',
        source: 'Master PDF p.1 + NRC',
        body: [
          { bullets: [
            '**Physiological NEB** = ทุก dairy cow มี · DMI ลดลง vs production demand เพิ่มขึ้น',
            '**Pathological**: subclinical/clinical ketosis · hypocalcemia · LDA · retained placenta · metritis · mastitis',
            '⭐ Goal: minimize duration of NEB → ลดความเสี่ยง periparturient diseases',
          ] },
          { sub: 'Markers',
            body: [
              { table: {
                headers: ['Marker', 'Cutoff', 'Meaning'],
                rows: [
                  ['BHBA', '≥1.2 mM (subclinical) · ≥3.0 (clinical ketosis)', 'Ketone body · cowside test (Precision Xtra)'],
                  ['NEFA', '>0.4 pre-partum · >0.7 post-partum', 'Excessive lipolysis'],
                  ['Glucose', '<2.2 mM = hypoglycemia', 'Below normal in ketosis'],
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
          { sub: 'Diagnostic clue',
            body: [
              { bullets: [
                '**Milk fat <2.5% in lactating cow** = MFD',
                '**Milk fat:protein ratio <1.0** = SARA / acidosis',
                '**Milk fat:protein ratio >1.5** = ketosis / negative energy',
              ] },
            ] },
        ],
      },
      {
        heading: 'Body Condition Score (BCS · 1-5 scale)',
        source: 'Master + AABP',
        body: [
          { table: {
            headers: ['Stage', 'Target BCS', 'Reason'],
            rows: [
              ['Dry-off (60d before calving)', '3.25-3.50', 'Avoid fat cow syndrome'],
              ['Calving day', '3.25-3.50', 'Same as dry-off'],
              ['Peak lactation (~60d)', '2.50-2.75', 'Mobilize fat for milk'],
              ['Mid-late lactation', '3.00-3.25', 'Rebuild reserves'],
            ],
          } },
          { callout: 'Loss >1 BCS unit between calving + peak = excessive · risk ketosis + delayed return to estrus', kind: 'warn' },
        ],
      },
      {
        heading: 'Past Exam Mapping (Sunsun84 + Kim85 metabolism)',
        source: 'Sunsun84 Clin App Rum p.1 + Kim85 ketosis Q',
        body: [
          { bullets: [
            'Q DMI calculation → "% BW × DM%" (e.g. 600kg × 3.5% = 21 kg DM)',
            'Q ketosis cutoff → BHBA ≥1.2 mM subclinical · ≥3.0 clinical',
            'Q "Milk fat ลด ทำไง" → R:C ratio · particle size · effective fiber',
            'Q "วัวผอมหลังคลอด" → BCS chart + transition mgt',
            'Q Penn State separator → ชั้น 1 (>19 mm) target 2-8%',
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
            'ASA risk classification: I (healthy) → V (moribund) · score affect drug choice + monitoring',
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
            'NPO เพื่อลด rumen tympany + regurgitation risk',
          ] },
        ],
      },
      {
        heading: 'Pre-medication + Sedation',
        source: 'Aj.PB Master p.9',
        body: [
          { bullets: [
            '⛔ **Atropine** — limited use ในวัว: saliva เหนียวข้น (ไม่ลด) · GI motility ลด → bloat risk',
            '**Xylazine (alpha-2)** — 0.05-0.1 mg/kg IM/IV · Brahman > Hereford > Holstein sensitivity · reverse: yohimbine 0.125 mg/kg IV',
            '**Diazepam/Midazolam (benzo)** — muscle relaxation · minimal CV depression · ไม่มี analgesic · reverse: flumazenil',
            '⚠️ **Acepromazine (phenothiazine)** — penile prolapse risk in bulls (vasodilation) · ห้าม pre-anesthesia bull semen-collecting',
            '**Ketamine** — dissociative · 1-2 mg/kg IV · combine with xylazine (≈ "ketamine stun") · short procedures',
            '**Detomidine** — alpha-2 stronger than xylazine · 10-20 mcg/kg IV · longer duration',
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
            'Aspiration pneumonia = leading cause of post-GA death · → ET cuffed tube essential',
          ] },
          { sub: 'Positioning prevention',
            body: [
              { bullets: [
                'Sternal preferred ถ้า possible (allow eructation + reduce regurgitation)',
                'Lateral: head DOWN · neck extended · cuffed ET tube + saliva drainage',
                'Dorsal: ขึ้น only briefly · risk highest',
                'Padding ขาทั้ง 4 (radial nerve protection)',
                'Eye lubrication',
              ] },
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
              ['Teat surgery', 'Inverted L block / Ring block', 'Lidocaine 2% · multiple SQ injections'],
              ['Castration', 'Intratesticular + line block scrotum', '5-15 ml lidocaine 2%'],
            ],
          } },
        ],
      },
      {
        heading: 'Local Anesthetic Pharmacology',
        source: 'Aj.PB + Plumb Veterinary',
        body: [
          { table: {
            headers: ['Drug', 'Onset', 'Duration', 'Max dose'],
            rows: [
              ['Lidocaine 2%', '5-10 min', '60-90 min', '6-10 mg/kg'],
              ['Lidocaine 2% + epi', '5-10 min', '90-180 min', 'Same · ⛔ NOT in extremities (ear/penis/toe)'],
              ['Bupivacaine 0.5%', '15-30 min', '4-6 hr', '2 mg/kg'],
              ['Procaine', '5-10 min', '30-60 min', '20 mg/kg'],
            ],
          } },
          { callout: '⚠️ Toxicity: tongue numbness → seizures → cardiovascular collapse · IV slow + lipid emulsion rescue', kind: 'warn' },
        ],
      },
      {
        heading: 'Past Exam Mapping (Sunsun84 anesthesia + Vet 85 final85)',
        source: 'Sunsun84 + final85 cross-ref',
        body: [
          { bullets: [
            'Q "ยา pre-med ไหน penile prolapse" → Acepromazine ⭐',
            'Q "Reverse xylazine ใช้อะไร" → Yohimbine',
            'Q "Block ผ่าตัด LDA standing" → Paravertebral T13/L1/L2',
            'Q "Block dystocia + perineum" → Caudal epidural',
            'Q "ทำไมไม่ใช้ atropine ในวัว" → saliva เหนียว + GI atony bloat',
            'Q "Lidocaine + epi ทำไมห้ามที่หาง/ลึงค์/นิ้ว" → vasoconstriction necrosis',
            'Q "Fasting adult cattle ก่อน GA" → 12-24 hr food + 12-24 hr water',
          ] },
        ],
      },
    ],
  },

  'gi-surgery-sawita': {
    topic: 'gi-surgery-sawita',
    title: 'GI Surgery (Sawita 3 lectures · 45 ข้อ ⭐ MAIN SCOPE)',
    lecturer: 'อ.ศวิตา สันติวิภารัตน์ (SS)',
    icon: '🔪',
    summary: 'Rumenotomy · LDA + RDA correction · Abomasal volvulus · Cecal dilatation/dislocation · Hardware disease (TRP) · Intussusception',
    sections: [
      {
        heading: 'Pre-op Assessment + Priority',
        source: 'อ.ศวิตา GI Surgery I p.2-5',
        body: [
          { bullets: [
            '**History**: parturition <30d (LDA · TRP · metritis) · feed change · grain engorgement',
            '**Physical**: HR · RR · temp · CRT · skin tent · BCS',
            '**GI exam**: rumen motility (1-3/min normal) · ping (left/right) · rectal palpation',
            '**Lab**: PCV/TP · Cl/K/Na · BUN/Cr · lactate · BHBA',
            '**Decision**: Standing right flank (most cases) vs general anesthesia (severe RAV · cecal volvulus · ineffective standing approach)',
          ] },
        ],
      },
      {
        heading: 'LDA (Left Displaced Abomasum)',
        source: 'อ.ศวิตา + Sunsun84 p.2 + Smith LA Internal',
        body: [
          { bullets: [
            '**Epidemiology**: first 30 days post-partum peak · 50-90% concurrent ketosis · Holstein > others · high-grain TMR risk',
            '**Pathophysiology**: hypomotile abomasum + gas accumulation → "floats" on rumen left',
            '**Mortality**: <10% with surgery · 50-90% without',
          ] },
          { sub: 'Signs',
            body: [
              { bullets: [
                'Recent calving (≤30d) · ↓ feed intake · drop milk yield 30-50%',
                '**Ping at left flank rib 9-13 upper third** ⭐',
                'Concurrent ketosis (sweet acetone breath · BHBA ↑)',
                'Rumen contraction ↓ · feces ↓ amount',
              ] },
            ] },
          { sub: 'Surgical Approaches (5 options)',
            body: [
              { table: {
                headers: ['Technique', 'Approach', 'Pro', 'Con'],
                rows: [
                  ['Right Flank Omentopexy ⭐ (Hannover)', 'Standing right paralumbar', 'Best · stable · most common', 'Reach across required'],
                  ['Left Flank Abomasopexy (Utrecht)', 'Standing left paralumbar', 'Direct access to LDA', 'Pylorus difficult to identify'],
                  ['Right Paramedian Abomasopexy', 'Dorsal recumbency', 'Direct view', 'GA · risk pneumonia'],
                  ['Toggle pin / blind suture', 'Rolled · percutaneous', 'Cheap fast no Sx', 'Risk peritonitis · lower success'],
                  ['Laparoscopy (Janowitz)', 'Standing 2 ports L+R', 'Minimal invasive', 'Equipment cost'],
                ],
              } },
            ] },
          { sub: 'Right Flank Omentopexy — Step by Step',
            body: [
              { bullets: [
                '1. Standing in chute · clip + scrub right paralumbar fossa',
                '2. **Paravertebral block T13/L1/L2** (proximal Magda) or distal Magda 30-50 ml lidocaine',
                '3. Vertical skin incision 15-20 cm caudal to last rib · midway between transverse processes + costochondral',
                '4. Cut external oblique → internal oblique → transversus → peritoneum (3 muscle layers)',
                '5. Reach hand across abdomen ventrally → palpate LDA on left',
                '6. **Decompress abomasum** with 14-16 ga needle/trocar (release gas · suction)',
                '7. Manipulate abomasum back to ventral right · pylorus → ventrolateral right',
                '8. Identify pylorus + greater omentum',
                '9. **Suture greater omentum** to peritoneum + transversus abdominis (ventral right) — **horizontal mattress** + long-term absorbable (PDS or Vicryl)',
                '10. Close 3 abdominal layers (transversus + IO + EO) + skin',
                '11. Post-op: AB (PCN/oxytet) · NSAID · oral propylene glycol + Ca · re-feed slowly',
              ] },
            ] },
        ],
      },
      {
        heading: 'RDA + RAV (Right Displaced Abomasum + Volvulus) ★ Surgical Emergency',
        source: 'อ.ศวิตา + Smith Internal Medicine',
        body: [
          { bullets: [
            '**RDA** = right displacement without rotation · ping right flank rib 9-13',
            '**RAV** = volvulus 90-360° clockwise (from rear view) · ischemia + necrosis risk',
            'Mortality 25-40% even with surgery (vs LDA <10%)',
            'Mortality DOUBLES if onset >6-12 hr',
          ] },
          { sub: 'Lab pattern (classic)',
            body: [
              { bullets: [
                '**Hypochloremic + hypokalemic metabolic alkalosis** (Cl<85 · K<3 · HCO3>32)',
                'Sequestration of HCl in obstructed abomasum → systemic alkalosis',
                'Hemoconcentration: PCV>40% · TP>8',
                '**Lactate >4 mM = poor prognosis** (tissue ischemia)',
                'Pre-renal azotemia (BUN ↑ disproportionate to Cr)',
              ] },
            ] },
          { sub: 'Surgical Tx',
            body: [
              { bullets: [
                'Right flank approach',
                '**Decompress first** (release gas via trocar)',
                'De-rotate counterclockwise from rear (reverse direction of volvulus)',
                'Assess viability: color · pulse · serosal hemorrhage',
                'If non-viable → consider euthanasia (resection rarely done in cattle)',
                'Omentopexy + post-op IV fluid + Cl/K replacement',
              ] },
            ] },
          { callout: '⚠️ ฉีดยา/IV fluid: NS + KCl supplement (correct hypokalemic hypochloremic alkalosis) · ไม่ใช้ LRS (lactate exacerbates alkalosis)', kind: 'warn' },
        ],
      },
      {
        heading: 'Diagnostic Ping Sound Map',
        source: 'อ.ศวิตา + Sunsun84 p.3',
        body: [
          { bullets: [
            'Simultaneous **auscultation + percussion** (stethoscope + finger flick) → high-pitched metallic ping',
            'Ping = gas-fluid interface in viscus',
          ] },
          { table: {
            headers: ['Location', 'Cause'],
            rows: [
              ['Left flank rib 9-13 upper third', 'LDA ⭐'],
              ['Right flank rib 9-13 upper third', 'RDA / RAV'],
              ['Right flank lower posterior', 'Cecal dilatation / dislocation'],
              ['Wide area both flanks', 'Pneumoperitoneum'],
              ['Left dorsal · diffuse', 'Free gas bloat (frothy bloat = no ping)'],
              ['Cranial right rib 7-9', 'Liver abscess (gas-producing)'],
            ],
          } },
        ],
      },
      {
        heading: 'Cecal Dilatation + Dislocation (CDD)',
        source: 'อ.ศวิตา + Sunsun84 p.2',
        body: [
          { bullets: [
            '**Cecal dilatation**: cecum distended · apex still caudal · palpable at right flank · Ping sound',
            '**Cecal dislocation/retroflexion**: body + apex flipped cranially (90-180° flip) → cecal apex palpable per rectum bulging',
            '**Cecal volvulus**: rotation around mesentery axis → ischemia · poor prognosis',
          ] },
          { sub: 'Signs',
            body: [
              { bullets: [
                'Anorexia · ↓ feces · ↓ rumination',
                'Mild-moderate abdominal distension right',
                'Rectal palpation: distended cecum (firm balloon) feel',
                'Ping right flank lower posterior',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                '**Mild dilatation**: medical (laxative · IV fluid · oral mineral oil) — sometimes self-resolve',
                '**Severe / dislocation**: surgery',
                'Right flank approach',
                'เปิดช่องท้องแก้ไข ventral retroflexion · นำ body + apex ลอกออก',
                '**Typhlotomy** (open cecum drain content) แก้ retroflexion ที่ apex',
                'Post-op: prokinetic (metoclopramide) + IV fluid',
              ] },
            ] },
        ],
      },
      {
        heading: 'Hardware Disease (TRP · Traumatic Reticuloperitonitis)',
        source: 'Sunsun84 p.3 + AABP + อ.ศวิตา',
        body: [
          { bullets: [
            '**Pathophysiology**: metallic FB (wire/nail) ingested → settles in reticulum (cranio-ventral) → contraction pushes through wall → peritonitis · pericarditis (if penetrate diaphragm)',
            'Most common in: late pregnancy (uterus crowds reticulum) · adult cows >2 yo',
          ] },
          { sub: 'Multi-modal Diagnosis',
            body: [
              { bullets: [
                '**Pain tests**: Wither test (pinch wither → grunt) · Pole/Bamboo test (lift bamboo under xiphoid) · Xiphoid pressure',
                '**Auscultation**: muffled heart sounds + rub sounds + decreased reticular contraction',
                '**Metal detector**: positive metallic FB (false positive if magnet already given)',
                '**Bloodwork**: neutrophilia + left shift · ↑ Fibrinogen >700 mg/dL · ↑ AST · ↓ albumin',
                '**Radiography lateral**: confirm metallic FB in reticulum',
                '**Ultrasound**: pericardial effusion · abscess',
              ] },
            ] },
          { sub: 'Treatment Decision Tree',
            body: [
              { bullets: [
                '**Cow magnet PO** (preventive + early Tx) — moves FB to reticulum floor',
                '**Rumenotomy + manual FB removal** ⭐ — definitive',
                '**Pericardiocentesis** if pericardial effusion (drain + AB)',
                '**Broad-spectrum AB** (PCN + oxytet 5-7d) + NSAID (flunixin)',
                'Cull if poor prognosis (chronic pericarditis · liver abscess)',
              ] },
            ] },
          { sub: 'Prognosis',
            body: [
              { bullets: [
                'Early TRP no peritonitis: **good** prognosis (>80% recovery)',
                'Localized peritonitis: **fair** (60-70%)',
                'Generalized peritonitis: **poor** (<40%)',
                'Pericarditis: **grave** (<10%)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Rumenotomy (overlap with Vet Prac Rum Aj.EA)',
        source: 'อ.ศวิตา + อ.เอกพล Rumenotomy lecture 2026',
        body: [
          { bullets: [
            '**Indications**: TRP (FB removal) · grain engorgement (lactic acidosis evacuation) · rumen impaction · plant toxin removal',
            'Standing left paralumbar fossa · paravertebral block',
            'Vertical skin incision 20-25 cm',
            '**Rumen wall fixation** เพื่อกัน contamination — Weingarth ring · skin-to-rumen suture · stay sutures',
            'Open rumen mid-section · evacuate content · explore reticulum · remove FB',
            'Closure: **2 layers** rumen wall · Cushing or Lembert · then 3 abdominal layers',
          ] },
        ],
      },
      {
        heading: 'Intussusception',
        source: 'อ.ศวิตา + Smith',
        body: [
          { bullets: [
            'Telescoping of bowel into adjacent segment → obstruction + ischemia',
            'Most common: jejunojejunal · ileocolic',
            'Adult cow: linked to neoplasia · trauma',
            'Calf: parasitism · enteritis',
            'Signs: anorexia · scant feces · abdominal pain · "doughnut" on rectal',
            'Tx: surgery — resection + anastomosis · poor prognosis if delayed',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (Sunsun84 GI Sx 15+ Q)',
        source: 'Sunsun84 p.2-3 cross-ref + อ.ศวิตา 2026',
        body: [
          { bullets: [
            '**Q LDA peak time** → 30 days post-partum',
            '**Q LDA ผ่าตัดวิธี** → Right flank omentopexy ⭐ + Utrecht left flank · Toggle pin · Laparoscopy',
            '**Q Suture omentum ใช้ pattern** → Horizontal mattress',
            '**Q LDA suture material** → Long-term absorbable (PDS/Vicryl)',
            '**Q ทำไม decompress ก่อน** → ลดแรงดัน + ป้องกัน aspiration content',
            '**Q Hypokalemic hypochloremic alkalosis** → RAV',
            '**Q Lactate cutoff prognosis** → >4 mM = poor',
            '**Q TRP test pain** → Wither pinch · Pole/Bamboo · Xiphoid',
            '**Q TRP fibrinogen** → >700 mg/dL inflammation marker',
            '**Q TRP definitive Tx** → Rumenotomy + magnet',
            '**Q Cecal dislocation Tx** → Right flank · ventral retroflexion · typhlotomy',
            '**Q Ping LDA ตำแหน่ง** → Left flank rib 9-13 upper third',
            '**Q Ping cecal** → Right flank lower posterior',
            '**Q Rumenotomy fixation method** → Weingarth ring · stay sutures',
            '**Q Suture rumen wall layers** → 2 layers (Cushing/Lembert) inverting',
          ] },
          { callout: '⭐ Pattern: Sawita 45 Q heavy weighted on LDA + RAV + TRP · expect 8-12 Q on LDA technique alone', kind: 'tip' },
        ],
      },
    ],
  },

  'gi-vdtt': {
    topic: 'gi-vdtt',
    title: 'GI Medicine (VDTT) · Ruminant GI Disorder',
    lecturer: 'ผศ.น.สพ. ธนศักดิ์ บุญเสริม (TB)',
    icon: '🩺',
    summary: 'Rumen pH + microflora analysis · GI motility · Acidosis/Alkalosis · Methylene blue + Sediment activity + Gram stain · Bloat',
    sections: [
      {
        heading: 'Rumen pH Spectrum',
        source: 'อ.ธนศักดิ์ slide + Sunsun84 p.3',
        body: [
          { table: {
            headers: ['pH range', 'Status', 'Cause'],
            rows: [
              ['<5.0', 'Acute lactic acidosis', 'Grain engorgement (Streptococcus bovis bloom)'],
              ['5.0-5.5', 'SARA (Subacute)', 'Chronic high concentrate · low effective fiber'],
              ['5.5-6.0', 'Mildly acidic', 'Early SARA · monitor'],
              ['5.5-7.5', '**Normal** ⭐', 'Healthy fermentation'],
              ['>7.5', 'Inactive rumen', 'Spoiled feed · prolonged anorexia · post-AB'],
              ['>8.0', 'Putrefaction', 'Decomposition · dead protozoa'],
            ],
          } },
        ],
      },
      {
        heading: 'Acute Lactic Acidosis (Grain Engorgement)',
        source: 'อ.ธนศักดิ์ + Smith',
        body: [
          { bullets: [
            'Sudden access to grain → Strep bovis bloom → lactic acid surge → pH <5',
            '**Stages**:',
            '  Mild: rumen distension · ↓ feed · diarrhea',
            '  Moderate: dehydration · weakness · staggering',
            '  Severe: recumbent · acidemia · death 24-48 hr',
          ] },
          { sub: 'Lab',
            body: [
              { bullets: [
                'Rumen pH <5.0 · methylene blue >6 min (bacteria dead)',
                'Blood: low pH (<7.3) · low HCO3 · ↑ lactate',
                'PCV ↑ (dehydration) · BUN ↑',
              ] },
            ] },
          { sub: 'Treatment Decision Tree',
            body: [
              { bullets: [
                '**Mild**: oral magnesium hydroxide / MgO 500g + IV fluid + restrict grain',
                '**Moderate**: rumen lavage + alkalinize + IV bicarbonate + thiamine + AB',
                '**Severe**: **rumenotomy + total content removal** + transfaunate from healthy cow + IV fluid',
                'Post-recovery: gradual re-feed roughage 5-7 days',
              ] },
            ] },
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
                '<3 min = bacteria เยอะมาก (acidosis · early stage)',
                '**3-6 min = NORMAL** ⭐',
                '>6 min = bacteria inactive (spoiled · acidosis severe · post-AB)',
              ] },
            ] },
          { sub: '2. Sediment Activity Time',
            body: [
              { bullets: [
                'Pour rumen fluid in graduated cylinder',
                '**Normal: complete sedimentation 4-8 min**',
                'Fast (<4 min) = abnormal (high sediment density · decreased motile microflora)',
                'Slow (>8 min) = abnormal (low microflora activity)',
              ] },
            ] },
          { sub: '3. Gram Stain Ratio',
            body: [
              { bullets: [
                '**Normal: G(+) predominate** ⭐',
                'Acidosis shift: G(-) เพิ่ม (Strep bovis killed at low pH · endotoxin → laminitis sequela)',
                'Alkaline rumen: G(-) Bacteroides predominate',
              ] },
            ] },
          { sub: '4. Protozoa Motility',
            body: [
              { bullets: [
                'Normal: active motile protozoa (Entodinium · Diplodinium · Holotrichs)',
                'No protozoa = severe acidosis or post-antibiotic',
                'Sluggish motility = early dysfunction',
                'Examine fresh fluid <30 min · keep at 39°C',
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
            'Cycle: A-cycle (mixing · primary) + B-cycle (eructation · secondary)',
            'Each contraction lasts 5-10 sec · audible gurgling',
          ] },
          { sub: 'Hypomotility DDx',
            body: [
              { bullets: [
                '**Mechanical**: TRP · LDA/RDA · cecal dilatation · severe bloat · vagal indigestion',
                '**Metabolic**: hypocalcemia · acidosis · endotoxemia · hyperkalemia',
                '**Systemic**: sepsis · pneumonia · BVDV · MCF · ketosis · vagal indigestion',
                '**Drug-induced**: atropine · xylazine prolonged · barbiturates',
              ] },
            ] },
          { sub: 'Hypermotility',
            body: [
              { bullets: [
                'Early SARA · stress · early abomasal disease',
                'Toxic plant ingestion (rhododendron · oleander)',
              ] },
            ] },
          { sub: 'Vagal Indigestion (Hoflund syndrome) — 4 types',
            body: [
              { bullets: [
                'Type I (Free gas bloat) — failure of eructation · damage to vagus dorsal trunk',
                'Type II (Failure of omasal transport) — TRP / abscess at omasum',
                'Type III (Pyloric obstruction) — abomasal impaction · "papple"-shaped abdomen',
                'Type IV (Late pregnancy) — partial obstruction by gravid uterus',
              ] },
            ] },
        ],
      },
      {
        heading: 'Bloat (Tympany)',
        source: 'อ.ธนศักดิ์ + Smith',
        body: [
          { table: {
            headers: ['Type', 'Cause', 'Tx'],
            rows: [
              ['**Free gas (primary)**', 'Failure to eructate (esophageal obstruction · vagal damage · choke)', 'Pass orogastric tube → release gas'],
              ['**Frothy (secondary)**', 'Foam over cardia · plant proteins (legume) · finely-ground grain', 'Anti-foaming (poloxalene · vegetable oil 250 ml PO)'],
            ],
          } },
          { sub: 'Emergency Trocharization',
            body: [
              { bullets: [
                'Indication: severe bloat with respiratory distress · life-threatening',
                'Site: **Left paralumbar fossa** · top of swelling',
                'Use 14-16 ga × 12 cm trocar · stab through skin + muscle + rumen wall',
                'Risk: peritonitis → AB cover + monitor',
              ] },
            ] },
        ],
      },
      {
        heading: 'Diarrhea + Abomasitis',
        source: 'อ.ธนศักดิ์ slide cross-ref',
        body: [
          { bullets: [
            '**Abomasal ulcer**: type 1 (subclinical · mild blood) → type 2 (anemia · melena) → type 3 (perforation localized peritonitis) → type 4 (perforation diffuse · grave)',
            'Risk: high concentrate · stress · NSAID · LDA',
            'Tx: H2 blocker (cimetidine) / PPI (omeprazole) · sucralfate · transfusion if anemic',
            '**Calf diarrhea pathogen by age**:',
            '  <5 d: E. coli (enterotoxic) · Rotavirus · Coronavirus',
            '  5-21 d: Cryptosporidium · Coronavirus · Rotavirus',
            '  >21 d: Coccidia · Salmonella · BVDV',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (Sunsun84 GI VDTT)',
        source: 'Sunsun84 p.3 cross-ref',
        body: [
          { bullets: [
            'Q "Methylene blue normal" → 3-6 min ⭐',
            'Q "Sediment activity normal" → 4-8 min',
            'Q "Gram stain normal" → G(+) predominate',
            'Q "Rumen pH normal" → 5.5-7.5 (กลาง 6.5)',
            'Q "Rumen contraction/min" → 1-3/min',
            'Q "Trochar bloat ตำแหน่ง" → Left paralumbar fossa top of swelling',
            'Q "Free gas vs frothy bloat" → Free gas pass tube · frothy ใส่ poloxalene',
            'Q "Vagal indigestion type IV" → late pregnancy uterus compression',
            'Q "Calf diarrhea <5 day" → E. coli · Rotavirus · Coronavirus',
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
        heading: 'Interpretation Tree (Decision Logic)',
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
        heading: 'Common Hoof Lesions (Lameness DDx)',
        source: 'อ.ปิยะณัฐ + AABP cross-ref',
        body: [
          { table: {
            headers: ['Lesion', 'Location', 'Cause', 'Tx'],
            rows: [
              ['Sole ulcer (Rusterholz)', 'Lateral claw zone 4 (sole-heel junction)', 'Laminitis sequela · P3 sink', 'Trim + block on medial · footbath'],
              ['White line disease', 'Abaxial white line zone 3', 'Mechanical separation · concrete trauma', 'Trim · drain abscess'],
              ['Toe ulcer', 'Toe zone 1', 'Long toe · improper trim', 'Corrective trim'],
              ['Digital dermatitis', 'Heel · interdigital', 'Treponema spp.', 'Topical oxytetracycline + bandage'],
              ['Foot rot (interdigital phlegmon)', 'Interdigital skin', 'Fusobacterium + Dichelobacter', 'Systemic AB + bath'],
              ['Heel horn erosion', 'Heel bulb', 'Wet conditions + DD', 'Trim + dry housing + footbath'],
              ['Interdigital fibroma (Corn)', 'Interdigital', 'Chronic friction', 'Sx excision (NOT amputation)'],
              ['Laminitis', 'Whole hoof', 'Carb overload · acidosis', 'Treat underlying · pain mgt'],
            ],
          } },
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
            '**Zinc sulfate 10%** (alternative · gentler than CuSO4)',
            'Frequency: **2x/week routine · daily during outbreak**',
            'Walk-through ≥3 m · alternate CuSO4 ↔ formalin weeks · replace every 200 cow passes',
          ] },
          { sub: 'Bath design',
            body: [
              { bullets: [
                'Length 3-4 m · width 70-90 cm · depth 10-12 cm',
                'Pre-wash bath ก่อน (water + organic matter ลด)',
                'Cover (rain protection)',
                'Drain + fill convenient',
              ] },
            ] },
        ],
      },
      {
        heading: 'Routine Trimming (RT) — Dutch 5-step',
        source: 'อ.ปิยะณัฐ slide 8 + Toussaint Raven',
        body: [
          { bullets: [
            'Frequency: **2x/year (every 6-12 months)** ⭐ at dry-off + mid-lactation',
            'Claw growth ~5 mm/month vs wear ~3-4 mm/month → excess growth = unbalanced weight',
            'Outcome: ↓ sole ulcer 30-50% · ↑ milk 0.5-2 kg/d',
          ] },
          { sub: 'Dutch 5-step',
            body: [
              { bullets: [
                '1. Trim toe to correct length (**7.5 cm dorsal wall**) on **inner claw first** (medial)',
                '2. Match outer claw to inner (level sole)',
                '3. **Bevel** inner claw (slight raise · transfer weight)',
                '4. **Hollow out** lateral claw (relieve pressure on common ulcer site)',
                '5. Remove damaged horn / loose fragments',
              ] },
            ] },
          { callout: '⭐ Hindlimb LATERAL claw bears 60-70% weight (vs medial 30-40%) → corrective trim transfers to medial via bevel + hollow', kind: 'tip' },
        ],
      },
      {
        heading: 'Block Application',
        source: 'อ.ปิยะณัฐ + AABP',
        body: [
          { bullets: [
            'Indication: sole ulcer · white line · toe injury · post-amputation healthy claw',
            'Apply on **healthy claw** (transfer weight away from injured)',
            'Glue: methacrylate · cure 5-10 min',
            'Block height: 2-3 cm · trimming flush to ground every 2-4 wk',
            'Duration: 3-6 weeks usually',
            'Remove if: gait abnormal · loosening · wound healed',
          ] },
        ],
      },
      {
        heading: 'Past Exam Mapping (Sunsun84 + Ploy83 hoof)',
        source: 'Sunsun84 + Ploy83 p.31-35',
        body: [
          { bullets: [
            'Q "RT frequency" → 2x/year',
            'Q "Toe length dorsal" → 7.5 cm',
            'Q "Footbath CuSO4 %" → 5% (50 g/L)',
            'Q "Sole ulcer ตำแหน่ง" → Lateral claw hindlimb zone 4 (heel-sole junction · Rusterholz) ⭐',
            'Q "Digital dermatitis cause" → Treponema spp. (NOT Fusobacterium)',
            'Q "Foot rot cause" → Fusobacterium necrophorum + Dichelobacter nodosus',
            'Q "Block ที่ไหน" → Healthy (medial) claw · transfer weight from lateral',
            'Q "LCS = 3 ทำไง" → เริ่ม intervene · trim/footbath/lift',
            'Q "Hindlimb claw weight ratio" → Lateral 60-70% vs medial 30-40%',
            'Q "ใครคือ TLI ใน Interpretation" → ใช้ RT factor + lameness DDx tree',
          ] },
          { callout: '⭐ Pattern: PP hoof ออก 5-8 Q ใน Sunsun84 · ส่วนใหญ่อิง Dutch 5-step + LCS scoring + footbath Cu', kind: 'tip' },
        ],
      },
    ],
  },
};
