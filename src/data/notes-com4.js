// ============================================================
// COM IV Study Notes — สำหรับฟีเจอร์ "ทวนเนื้อหา"
// ============================================================
// Sources verified from extracted lecture text:
//   - Slide Lecture 2026 (14 lectures, คาบ 15-28)
//   - Kim 85 + ข้อสอบเก่ารวบรวม Vet 86 (master compilation)
//   - questions-com4.js (cross-reference for high-yield emphasis)
//
// Body item types same as notes-com5.js:
//   string                                — paragraph
//   { bullets: [string|{label,value}] }    — bulleted list
//   { sub, body }                          — sub-section
//   { table: { headers, rows } }            — table
//   { callout, kind }                      — kind: 'tip'|'warn'|'flag'
// ============================================================

export const NOTES_COM4 = {
  // ─────────────────────────────────────────────────────────────
  'immune-drugs': {
    topic: 'immune-drugs',
    title: 'Drugs for Immune-mediated Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '💊',
    summary: 'Glucocorticoid = first-line · Cyclosporine = T-cell selective · Azathioprine = dog only ★★ (cat ห้าม) · MMF = GI side effect · Chlorambucil = ตัวเลือกในแมว · Leflunomide / IVIG = severe refractory.',
    sections: [
      {
        heading: 'Glucocorticoid (Prednisolone) — first-line',
        source: 'Drug_used_for_immune_mediated_diseases.pdf',
        body: [
          { bullets: [
            'MOA: ↓ phospholipase A2 → ↓ prostaglandin/leukotriene · suppress T cell + macrophage · stabilize lysosome',
            'Immunosuppressive dose: **2-4 mg/kg/day** (dog) · 4-8 mg/kg/day (cat — แมวต้องการสูงกว่า)',
            'Taper หลัง remission ~2-4 wk (ลดทีละ 25%) — หยุดทันทีไม่ได้ → adrenal crisis',
          ] },
          { sub: 'Side effects (chronic high dose)',
            body: [
              { bullets: [
                'Iatrogenic Cushing\'s · PU/PD · polyphagia · hepatomegaly',
                'Muscle atrophy · skin thinning · alopecia · calcinosis cutis',
                'GI ulcer + risk of pancreatitis',
                'แมวทนได้มากกว่าสุนัข แต่อาจเกิด iatrogenic DM',
              ] },
            ] },
        ],
      },
      {
        heading: 'Steroid-sparing agents — comparison',
        source: 'Drug_used_for_immune_mediated_diseases.pdf + FINAL 86',
        body: [
          { table: {
            headers: ['Drug', 'MOA', 'Species', 'Key adverse'],
            rows: [
              ['**Cyclosporine** (Atopica)', 'Calcineurin inhibitor → ↓ IL-2 → T-cell selective', 'Dog + Cat', 'GI (V/D) · gingival hyperplasia · papilloma · monitor cyclosporine level'],
              ['**Azathioprine**', 'Purine analog → ↓ T cell · purine inhibitor', '**Dog only ★★**', 'BM suppression · hepatotoxic · ในแมวห้าม (TPMT deficiency → severe pancytopenia + pancreatic necrosis)'],
              ['**Mycophenolate (MMF)**', 'IMPDH inhibitor → ↓ B/T cell proliferation', 'Dog + Cat', 'GI (V/D, hemorrhagic) · myelosuppression'],
              ['**Chlorambucil**', 'Alkylating agent → DNA crosslink', '**Cat first choice** (steroid-sparing IMHA/IBD/PF)', 'BM suppression · ใน dog ใช้น้อย'],
              ['**Leflunomide**', 'Pyrimidine inhibitor', 'Dog + Cat (refractory)', 'Diarrhea · BM suppression'],
              ['**IVIG (human IgG)**', 'Block FcR · saturate macrophage', 'Severe refractory IMHA/ITP', 'Anaphylaxis · expensive · short effect'],
            ] } },
          { callout: '**Azathioprine ห้ามในแมว** ★★ (Aj. Rosama เน้น) — ขาด TPMT enzyme → severe BM suppression + acute pancreatic necrosis · ใช้ Chlorambucil แทน', kind: 'flag' },
        ],
      },
      {
        heading: 'Approach — drug selection logic',
        source: 'Drug_used_for_immune_mediated_diseases.pdf',
        body: [
          { bullets: [
            '**Step 1**: Pred 2-4 mg/kg/day × 2-4 wk → assess response',
            '**Step 2** (refractory or steroid-intolerant): add second-line — Cyclosporine (atopic, derm) / Azathioprine (dog IMHA/SLE) / MMF (universal)',
            '**Step 3** (severe / acute hemolytic crisis): IVIG + transfusion + low-dose aspirin/clopidogrel for thromboembolism prophylaxis',
            'Monitor: CBC q2wk × 8 wk แล้ว q1mo · LFT · BUN/Crea · cyclosporine trough level',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  imha: {
    topic: 'imha',
    title: 'IMHA + ITP (Immune-mediated cytopenias)',
    lecturer: 'Rosama Pusoonthornthum',
    icon: '🩸',
    summary: 'Type II hypersensitivity → autoAb โจมตี RBC (IMHA) / platelet (ITP) · Spherocytes + autoagglutination + slide agglutination = hallmark of IMHA · Tx: Pred + clopidogrel ± transfusion · Cocker, Poodle predisposed.',
    sections: [
      {
        heading: 'Pathogenesis',
        source: 'Immune-mediated_Hemolytic_anemia.pdf',
        body: [
          { bullets: [
            'Type II hypersensitivity — autoantibody (IgG/IgM) จับ RBC → opsonization → phagocytosis (extravascular) หรือ complement-mediated lysis (intravascular)',
            'Primary IMHA (idiopathic) ~60-75% · Secondary = drug, infection (Babesia/Mycoplasma/Ehrlichia), neoplasia, vaccination, transfusion',
            'Predisposed breeds: **Cocker Spaniel, Poodle, English Springer Spaniel, Old English Sheepdog, Irish Setter** · female > male · 2-8 yr',
          ] },
          { callout: 'แมว IMHA มักเป็น **secondary** — Mycoplasma haemofelis, FeLV/FIV, lymphoma · primary cat IMHA หายาก', kind: 'tip' },
        ],
      },
      {
        heading: 'Clinical signs + diagnosis',
        source: 'Immune-mediated_Hemolytic_anemia.pdf + FINAL 86',
        body: [
          { sub: 'Clinical',
            body: [
              { bullets: [
                'Pale or icteric mm · weakness · lethargy · tachycardia + tachypnea',
                'Splenomegaly + hepatomegaly · pigmenturia (Hb-uria, intravascular)',
                'Fever in 50% · ± petechiae (Evans = IMHA + ITP)',
              ] },
            ] },
          { sub: 'Lab — IMHA triad',
            body: [
              { bullets: [
                '**1) Spherocytes** บน blood smear ★ (small + dense + no central pallor) — pathognomonic ใน dog',
                '**2) Autoagglutination** in-saline test (1 drop blood + 4 drops saline) — true agglutination ≠ rouleaux',
                '**3) Coombs test (DAT)** — direct antiglobulin · positive in 60-80%',
                'Other: regenerative anemia (reticulocytosis), ↑ bilirubin, ↑ LDH, ghost cells, hemoglobinemia',
              ] },
            ] },
        ],
      },
      {
        heading: 'Treatment',
        source: 'Immune-mediated_Hemolytic_anemia.pdf + FINAL 86 ★★',
        body: [
          { bullets: [
            { label: '1st line', value: '**Prednisolone 2-3 mg/kg/day** (dog) / 4 mg/kg/day (cat) — taper หลัง PCV stable ≥ 4 wk' },
            { label: '2nd line', value: 'Add cyclosporine 5 mg/kg/day OR azathioprine 2 mg/kg/day **(dog only ★★)** OR MMF 10 mg/kg q12h' },
            { label: 'Cat refractory', value: '**Chlorambucil** + Pred (Azathioprine ห้าม)' },
            { label: 'Antithrombotic ★', value: '**Clopidogrel (Plavix) 1-3 mg/kg/d** ± low-dose aspirin 0.5 mg/kg/day — thromboembolism prophylaxis' },
            { label: 'Acute crisis', value: 'pRBC transfusion (cross-match!) + IV fluid + IVIG (severe) + LMWH' },
          ] },
          { callout: 'Mortality 30-70% in first 2 weeks · main cause = **pulmonary thromboembolism (PTE)** → ใช้ antiplatelet เสมอ', kind: 'warn' },
          { callout: '★★ Aj. Rosama เน้น: Aspirin 0.5 mg/kg/วัน + Clopidogrel = แก้ thromboembolism', kind: 'flag' },
        ],
      },
      {
        heading: 'ITP (Immune-mediated thrombocytopenia)',
        source: 'Immune-mediated_Hemolytic_anemia.pdf p.30+',
        body: [
          { bullets: [
            'AutoAb โจมตี platelet → platelet < 50,000 (severe < 20,000)',
            'Petechiae + ecchymosis + epistaxis + melena + hematuria',
            'Predisposed: Cocker, Poodle, Old English Sheepdog (overlap with IMHA = Evans syndrome)',
            'Tx: Pred 2-4 mg/kg/day · vincristine 0.02 mg/kg IV (rapid platelet release จาก marrow) · severe → human IgG (hIVIG)',
            'Avoid IM injection · soft food · no aspirin (ใน ITP เพราะ bleeding ความเสี่ยงสูง)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  ibd: {
    topic: 'ibd',
    title: 'IBD + GN (Inflammatory bowel disease + Glomerulonephritis)',
    lecturer: 'Rosama Pusoonthornthum',
    icon: '🌀',
    summary: 'Chronic enteropathy >3wk · histopath = gold standard · LPE most common · step-wise: diet→ATB→steroid (FRE→ARE→IRE) · GN → proteinuria + hypoalbuminemia.',
    sections: [
      {
        heading: 'IBD definition + classification',
        source: 'INFLAMATORY_BOWEL_Disease.pdf',
        body: [
          'Chronic enteropathy ≥ **3 weeks** of GI signs + histopathologic evidence ของ inflammation + exclusion of infectious/parasitic/neoplastic cause',
          { sub: 'Classification by response (BSAVA 2018)',
            body: [
              { bullets: [
                '**FRE** (Food-responsive enteropathy) — most common, dietary trial',
                '**ARE** (Antibiotic-responsive enteropathy) — was "SIBO" — metronidazole / tylosin',
                '**IRE** (Immunosuppressant-responsive enteropathy) — true IBD requiring steroid',
                '**NRE** (Non-responsive enteropathy) — refractory, poor prognosis',
              ] },
            ] },
          { sub: 'Histopathologic classification',
            body: [
              { bullets: [
                '**LPE** (Lymphoplasmacytic enteritis) — most common',
                '**EE** (Eosinophilic enteritis) — food allergy, parasites',
                'Granulomatous · Neutrophilic (rare)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Clinical signs + diagnosis',
        source: 'INFLAMATORY_BOWEL_Disease.pdf',
        body: [
          { sub: 'Clinical (small bowel vs large bowel)',
            body: [
              { table: {
                headers: ['', 'Small bowel', 'Large bowel'],
                rows: [
                  ['Frequency', 'Normal-↑', '↑↑↑ (q1-2hr)'],
                  ['Volume', 'Large', 'Small'],
                  ['Mucus / blood', 'Rare', 'Common (hematochezia + mucus)'],
                  ['Tenesmus', '–', '+++'],
                  ['Weight loss', '+++', '–'],
                  ['Vomiting', '++', 'Mild'],
                ],
              } },
            ] },
          { sub: 'Diagnosis — exclusion + biopsy',
            body: [
              { bullets: [
                'Rule out: parasites (fecal × 3) · GI panel (cobalamin, folate) · Giardia · TLI (EPI)',
                'Imaging: US (thickened wall, layering, lymphadenopathy)',
                '**Histopath = gold standard** — endoscopic biopsy (duodenum + colon) · WSAVA scoring 2008',
                'CCECAI score (clinical activity index) for severity',
              ] },
            ] },
        ],
      },
      {
        heading: 'Treatment — step-wise',
        source: 'INFLAMATORY_BOWEL_Disease.pdf',
        body: [
          { bullets: [
            { label: '**Step 1: Diet (FRE)**', value: 'Hydrolyzed protein (Hill\'s z/d, Royal Canin Hypo) OR novel protein × 2-4 wk' },
            { label: '**Step 2: Antibiotic (ARE)**', value: 'Metronidazole 10-15 mg/kg q12h × 4-6 wk OR tylosin 25 mg/kg/day' },
            { label: '**Step 3: Immunosuppressive (IRE)**', value: 'Pred 1-2 mg/kg/day → taper · refractory → cyclosporine OR chlorambucil (cat)' },
            { label: 'Adjunct', value: 'Probiotic · cobalamin SC if deficient · psyllium for colitis · ω-3 FA' },
          ] },
          { callout: 'Cat IBD → low-grade alimentary lymphoma overlap — biopsy เสมอเพื่อแยก', kind: 'warn' },
        ],
      },
      {
        heading: 'Glomerulonephritis (GN) — overview',
        source: 'INFLAMATORY_BOWEL_Disease.pdf (GN portion)',
        body: [
          { bullets: [
            'Immune-complex deposition ใน glomerulus → proteinuria + hypoalbuminemia + hypercholesterolemia + edema (= **nephrotic syndrome**)',
            'UPC > 2.0 (significant proteinuria) · biopsy = gold standard (membranous, MPGN, FSGS)',
            'Predisposed: Bernese Mtn Dog, Soft-coated Wheaten Terrier, Boxer',
            'Tx: ACEi (enalapril/benazepril 0.5 mg/kg/day) → ARB (telmisartan) · low-protein renal diet · ω-3 FA · clopidogrel (PTE risk)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  sle: {
    topic: 'sle',
    title: 'SLE — Systemic Lupus Erythematosus',
    lecturer: 'Rosama Pusoonthornthum',
    icon: '🦋',
    summary: 'Multi-system autoimmune (≥ 2 organs) + ANA positive · Polyarthritis (#1 sign 70-90%) + non-erosive · ANA = screen, LE cell = supportive · Tx: Pred + cyclosporine.',
    sections: [
      {
        heading: 'Definition + diagnostic criteria',
        source: 'Systemic_Lupus_Erythematosus.pdf',
        body: [
          'SLE = chronic multisystem autoimmune dz · type III hypersensitivity (immune complex)',
          { sub: 'Definite SLE (Halliwell criteria)',
            body: [
              { bullets: [
                'อย่างน้อย **2 organ systems** affected (skin, joint, kidney, blood, etc.)',
                '**ANA positive** (Antinuclear antibody)',
                '**Histopathologic / immunopathologic** evidence',
              ] },
            ] },
          { sub: 'Probable SLE',
            body: [
              { bullets: [
                'อย่างน้อย 1 organ + ANA positive (mild presentation)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Clinical signs — by organ',
        source: 'Systemic_Lupus_Erythematosus.pdf + FINAL 86',
        body: [
          { table: {
            headers: ['System', 'Frequency', 'Manifestation'],
            rows: [
              ['**Polyarthritis** ★', '~70-90% (most common)', 'Non-erosive · shifting · multiple joints · stiffness'],
              ['Cutaneous', '~60%', 'Facial dermatitis · ulcer · alopecia · depigmentation · "butterfly rash"'],
              ['Renal (GN)', '~50%', 'Proteinuria · UPC > 1.0 · membranous GN · nephrotic syndrome'],
              ['Hematologic', '~40%', 'IMHA · ITP · neutropenia · lymphopenia (Coombs +)'],
              ['Polymyositis', '~10%', 'Muscle weakness, ↑ CK, EMG abnormal'],
              ['Pleuritis / pericarditis', 'Rare', 'Effusion'],
              ['CNS', 'Rare', 'Seizure, behavior change'],
            ],
          } },
          { callout: 'Polyarthritis = **#1 most common** sign (Aj. Rosama เน้น) — non-erosive ต่างจาก rheumatoid (erosive)', kind: 'flag' },
        ],
      },
      {
        heading: 'Laboratory diagnosis',
        source: 'Systemic_Lupus_Erythematosus.pdf',
        body: [
          { bullets: [
            '**ANA (Antinuclear antibody)** ★ — primary screen, sensitive but not specific (titer ≥ 1:160)',
            '**LE cell** — neutrophil engulfing nuclear material · classic but less sensitive (~60%)',
            'Coombs test (if hemolytic component)',
            'Joint tap: non-septic, non-erosive synovitis (high TNCC, neutrophilic)',
            'CBC: cytopenia · ↑ globulin · proteinuria · ↑ ALP/ALT (mild)',
            'Skin biopsy: interface dermatitis (lymphocytic, basal degeneration)',
          ] },
        ],
      },
      {
        heading: 'Treatment',
        source: 'Systemic_Lupus_Erythematosus.pdf',
        body: [
          { bullets: [
            { label: '1st line', value: 'Pred 2-4 mg/kg/day → taper หลัง remission ~4-6 wk' },
            { label: '2nd line', value: 'Add cyclosporine 5 mg/kg/day OR azathioprine 2 mg/kg/day (dog) OR MMF' },
            { label: 'Cutaneous-only (DLE)', value: 'Topical tacrolimus / cyclosporine + systemic vit E + ω-3' },
            { label: 'Adjunct', value: 'Sun avoidance (UV → flare) · NSAID for joint pain (if no renal/GI dz) · ACEi if proteinuria' },
          ] },
          { callout: 'Prognosis: guarded — relapse common · renal involvement = poorer prognosis', kind: 'warn' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-intro': {
    topic: 'derm-intro',
    title: 'Dermatology Introduction + Diagnostic Techniques',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🌟',
    summary: '3 layers (Epi/Dermis/Hypodermis) · Eccrine = foot pads only · Hair cycle = Anagen→Catagen→Telogen · Cat = compound follicle · Diagnostics: skin scrape (deep+superficial), tape, KOH, fungal culture (DTM), Wood\'s lamp.',
    sections: [
      {
        heading: 'Skin anatomy — fundamentals',
        source: 'Derm_1__2_Dermatology_introduction.pdf',
        body: [
          { sub: '3 primary layers',
            body: [
              { bullets: [
                '**Epidermis** — keratinocyte (stratum: basale → spinosum → granulosum → lucidum [paws] → corneum)',
                '**Dermis** — collagen + elastic fiber + adnexa (hair follicle, glands)',
                '**Hypodermis (subcutis)** — adipose + connective tissue',
              ] },
            ] },
          { sub: 'Glands',
            body: [
              { bullets: [
                '**Eccrine (true sweat)** — foot pads only ในสุนัขแมว · cholinergic',
                '**Apocrine** — ทั่วผิว (modified for ear ceruminous, perianal, anal sac)',
                '**Sebaceous** — เปิดเข้า hair follicle · holocrine secretion',
              ] },
            ] },
          { sub: 'Hair follicle architecture',
            body: [
              { bullets: [
                '**Dog**: simple compound — primary + secondary hairs (up to 20 hairs/group)',
                '**Cat**: compound follicle — multiple hairs จากรูเดียวกัน',
                '1° hair → sebaceous + apocrine attached · 2° hair → sebaceous only',
              ] },
            ] },
        ],
      },
      {
        heading: 'Hair cycle + hormone control',
        source: 'Derm_1__2_Dermatology_introduction.pdf',
        body: [
          { bullets: [
            '**Anagen** — growth phase (active, long)',
            '**Catagen** — transitional phase (short)',
            '**Telogen** — resting phase (quiescent)',
            'Exogen = sub-phase ของ shedding (ขนเก่าหลุด)',
          ] },
          { sub: 'Hormone effects',
            body: [
              { bullets: [
                '**Stimulator (anagen)**: Thyroid hormone, GH, prolactin',
                '**Inhibitor (catagen/telogen)**: Glucocorticoid, Estrogen, Testosterone',
                '→ Cushing\'s, hypothyroidism, สเตียรอยด์ chronic = endocrine alopecia',
              ] },
            ] },
        ],
      },
      {
        heading: 'Diagnostic techniques — Top 7',
        source: 'Derm_1__2_Dermatology_introduction.pdf + Derm Intro',
        body: [
          { table: {
            headers: ['Test', 'Use for', 'Technique'],
            rows: [
              ['**Skin scraping (deep)**', 'Demodex', 'Squeeze + scrape until capillary ooze'],
              ['Skin scraping (superficial)', 'Sarcoptes, Cheyletiella', 'Wide area, multiple sites'],
              ['**Tape impression**', 'Malassezia, surface bacteria', 'Press tape on lesion → DiffQuick → microscope'],
              ['**KOH 10%**', 'Dermatophyte hair shaft (ectothrix)', 'Pluck hair → KOH 10-20 min → microscope'],
              ['**Wood\'s lamp**', 'Microsporum canis (~50% fluoresce apple-green)', 'Dark room, 5+ min warm-up'],
              ['**Fungal culture (DTM)**', 'Definitive dermatophyte', 'Pluck hair → DTM → red color change ใน 7-14 d (positive)'],
              ['**Skin biopsy**', 'Autoimmune, neoplasia, deep pyoderma', 'Punch 6-8 mm, multi-site, immerse formalin'],
            ],
          } },
          { callout: '**Trichogram** (เด็ดขนตรวจ) ใช้ดูระยะ hair cycle (anagen vs telogen ratio) — ปกติ anagen > 80% ในสุนัขส่วนใหญ่', kind: 'tip' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-parasitic': {
    topic: 'derm-parasitic',
    title: 'Parasitic Skin Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🪲',
    summary: 'Demodex (deep scrape) · Sarcoptes ★ (zoonotic, intense pruritus, ear margin) · Cheyletiella ("walking dandruff") · Notoedres (cat) · Otodectes (ear mite) · Flea = Ctenocephalides felis · FAD = #1 pruritic dz.',
    sections: [
      {
        heading: 'Mites — comparison',
        source: 'Derm_3_Parasitic_skin_diseases.pdf',
        body: [
          { table: {
            headers: ['Mite', 'Location', 'Pruritus', 'Diagnosis', 'Treatment'],
            rows: [
              ['**Demodex canis** (dog)', 'Hair follicle (deep)', 'Mild → severe (deep pyoderma)', '**Deep skin scraping** (ขูดจน capillary ooze)', 'Isoxazoline (afoxolaner, fluralaner) · ivermectin 600 µg/kg/day'],
              ['**Demodex cati** (cat)', 'Hair follicle', 'Mild', 'Skin scraping', 'Lime sulfur · isoxazoline'],
              ['**Sarcoptes scabiei**', 'Stratum corneum (burrow)', '**Severe ★** (zoonotic)', 'Superficial scrape (low yield) · response to trial Tx', 'Selamectin · isoxazoline · lime sulfur · ivermectin'],
              ['**Notoedres cati** (cat)', 'Head + neck', 'Severe', 'Superficial scrape', 'Lime sulfur · selamectin'],
              ['**Cheyletiella**', 'Stratum corneum', 'Mild ("walking dandruff")', 'Tape · superficial scrape', 'Isoxazoline · ivermectin · environmental tx'],
              ['**Otodectes cynotis** (ear mite)', 'External ear canal', 'Otitis externa', 'Otoscope (white moving dot) · ear swab', 'Selamectin · ivermectin · ear cleaner'],
            ],
          } },
          { callout: '**Sarcoptes = zoonotic** — แจ้งเจ้าของให้ระวัง ผู้สัมผัสอาจคันคล้าย allergic reaction (self-limiting in human ~3 wk)', kind: 'warn' },
        ],
      },
      {
        heading: 'Fleas + FAD',
        source: 'Derm_3_Parasitic_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Ctenocephalides felis felis** = #1 species ในไทย (ทั้งใน dog + cat)',
            'Lifecycle: egg → larva → pupa → adult (3-4 wk in optimal env, 30°C 75% humid)',
            'Adult กินเลือดภายใน 5 min ของ host contact · 95% ของ population = egg/larva/pupa ในสิ่งแวดล้อม',
          ] },
          { sub: 'FAD (Flea Allergic Dermatitis)',
            body: [
              { bullets: [
                'Type I + IV hypersensitivity ต่อ flea saliva',
                '**Lumbar / dorsum / tail base / caudal thigh** ★ — pattern จำง่าย',
                'Cat: miliary dermatitis · symmetric alopecia · eosinophilic granuloma',
                'Dx: clinical pattern + flea/dirt detection · response to flea control',
              ] },
            ] },
          { sub: 'Flea control — modern',
            body: [
              { bullets: [
                '**Isoxazoline class** ★ — afoxolaner (NexGard), fluralaner (Bravecto, 12 wk), sarolaner, lotilaner',
                'Topical: imidacloprid + permethrin/pyriproxyfen',
                'IGR (insect growth regulator): pyriproxyfen, methoprene · environmental control',
              ] },
            ] },
        ],
      },
      {
        heading: 'Ticks',
        source: 'Derm_3_Parasitic_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Rhipicephalus sanguineus** (brown dog tick) = #1 ในไทย — vector for Ehrlichia, Babesia, Anaplasma',
            'Lifecycle 3-host (egg → larva → nymph → adult) ~2-4 mo',
            'Risk: tick paralysis (rare in dogs), tick-borne disease',
            'Tx: isoxazoline (kill within 8-12 hr — prevent transmission of most pathogens) · permethrin (cat ห้าม!) · environmental treatment',
          ] },
          { callout: '**Permethrin ห้ามใน cat** ★★ — fatal toxicity (tremor, seizure) · ใช้ fipronil หรือ selamectin แทน', kind: 'flag' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-bacterial': {
    topic: 'derm-bacterial',
    title: 'Bacterial Skin Diseases (Pyoderma)',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🦠',
    summary: 'S. pseudintermedius = #1 · 3 levels: surface / superficial / deep · Cytology required · Empirical: cephalexin 22-30 mg/kg q12h × 3-4 wk · MRSP rising · ระวัง interrupting antibiotics.',
    sections: [
      {
        heading: 'Etiologic agents',
        source: 'Derm__4_Bacterial_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Staphylococcus pseudintermedius** ★ — #1 cause of canine pyoderma (≥ 90%)',
            'S. aureus — less common, more concerning (zoonotic potential, MRSA)',
            'Other: S. schleiferi · Pseudomonas (otitis, deep) · Corynebacterium · Bacillus',
          ] },
          { callout: '**MRSP (methicillin-resistant S. pseudintermedius)** — rising prevalence · risk factor: prior antibiotic use · culture + susceptibility กรณี non-responsive', kind: 'warn' },
        ],
      },
      {
        heading: 'Classification by depth',
        source: 'Derm__4_Bacterial_skin_diseases.pdf',
        body: [
          { table: {
            headers: ['Level', 'Examples', 'Lesion', 'Treatment duration'],
            rows: [
              ['**Surface**', 'Pyotraumatic dermatitis (hot spot), Skin fold pyoderma, Bacterial overgrowth', 'Erythema, exudate, no follicular involvement', 'Topical (chlorhex 2-4%) ± short systemic 7-14 d'],
              ['**Superficial**', 'Impetigo (puppy), Superficial bacterial folliculitis (SBF), Mucocutaneous pyoderma', 'Pustule, papule, epidermal collarette, follicular involvement', 'Systemic ATB **3-4 wk** (≥ 7 d past clinical cure)'],
              ['**Deep**', 'Deep folliculitis, Furunculosis, Cellulitis, Pododermatitis', 'Nodule, fistula, hemorrhagic crust, scar', 'Systemic ATB **6-8 wk** (≥ 2-4 wk past cure) + culture'],
            ],
          } },
        ],
      },
      {
        heading: 'Diagnosis + Treatment',
        source: 'Derm__4_Bacterial_skin_diseases.pdf',
        body: [
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                'Cytology (DiffQuick) — degenerated neutrophils + intracellular cocci = confirmed pyoderma',
                'Culture & susceptibility — recurrent / deep / non-responsive cases',
                'Always identify + treat **underlying cause** (allergy, endocrine, parasites)',
              ] },
            ] },
          { sub: 'Empirical first-line (until culture)',
            body: [
              { bullets: [
                '**Cephalexin 22-30 mg/kg PO q12h** ★ — gold standard, 3-4 wk',
                'Cefadroxil · cefovecin (Convenia) — long-acting',
                'Amox-clav 12.5-25 mg/kg q12h',
                'Avoid empirical fluoroquinolone (resistance)',
              ] },
            ] },
          { sub: 'Topical adjunct',
            body: [
              { bullets: [
                'Chlorhexidine 2-4% shampoo q24-72h × 4 wk',
                'Mupirocin (focal) · benzoyl peroxide (greasy seborrheic)',
                'Surface pyoderma → topical ALONE มักพอ',
              ] },
            ] },
          { callout: 'อย่าหยุดยาก่อน clinical cure + 7 days (superficial) หรือ 14-28 d (deep) — relapse + induced resistance', kind: 'flag' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-fungal': {
    topic: 'derm-fungal',
    title: 'Fungal Skin Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🍄',
    summary: 'Dermatophyte = M. canis (cat #1) · M. gypseum · T. mentag (rodent) — zoonotic. Malassezia pachydermatis = lipophilic yeast in atopic. DTM = gold standard. Itraconazole = TOC.',
    sections: [
      {
        heading: 'Dermatophytosis (ringworm)',
        source: 'Derm__5_Fungal_skin_diseases.pdf',
        body: [
          { sub: 'Etiology',
            body: [
              { bullets: [
                '**Microsporum canis** ★ — #1 ใน cat, zoonotic, fluorescent ~50%',
                '**Microsporum gypseum** — geophilic (soil)',
                '**Trichophyton mentagrophytes** — rodent reservoir',
                'All 3 = **zoonotic** ★',
              ] },
            ] },
          { sub: 'Clinical signs',
            body: [
              { bullets: [
                'Classic: circular alopecia + scaling + crust ("ringworm")',
                'Cat: often subclinical carrier (Persian + long-haired predisposed)',
                'Kerion = inflammatory deep nodular form (M. gypseum, T. mentag)',
                'Onychomycosis (claw involvement) — rare, hard to treat',
              ] },
            ] },
        ],
      },
      {
        heading: 'Diagnosis',
        source: 'Derm__5_Fungal_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Wood\'s lamp** — M. canis ~50% fluoresce apple-green (pteridine in hair) · false negative common',
            '**KOH 10-20%** — see ectothrix arthroconidia on hair shaft',
            '**DTM (Dermatophyte Test Medium) culture** ★ = **gold standard** — pluck hair, place on DTM (Sabouraud + phenol red + cycloheximide) · positive = **red color change + white fluffy colony within 7-14 d**',
            'PCR (definitive species) — research/reference labs',
            'Biopsy with PAS stain for refractory',
          ] },
          { callout: 'DTM red color เกิดจาก dermatophyte ใช้ protein → alkaline pH · contaminant fungi ใช้ carbohydrate → red change ช้า/ไม่เกิด · **อ่านผลทุกวัน**', kind: 'tip' },
        ],
      },
      {
        heading: 'Treatment',
        source: 'Derm__5_Fungal_skin_diseases.pdf + WSAVA derm',
        body: [
          { bullets: [
            { label: '**Topical** (adjunct, for spore decontamination)', value: 'Lime sulfur 2% dip 2× weekly · enilconazole · miconazole/chlorhex shampoo' },
            { label: '**Systemic 1st choice**', value: '**Itraconazole 5-10 mg/kg/day** ★ × 4-8 wk (continue until 2 negative cultures 2 wk apart)' },
            { label: 'Alternatives', value: 'Terbinafine 30-40 mg/kg/day · griseofulvin (older, hepatotoxic, ห้ามใน cat ตั้งครรภ์)' },
            { label: 'Environmental', value: 'Wash bedding hot water + bleach 1:10 · vacuum daily · discard porous items' },
          ] },
          { callout: '**Zoonosis warning ★** — ผู้สัมผัสภูมิคุ้มกันต่ำ (เด็ก, ผู้สูงอายุ, immunocompromised) ระวัง · ใส่ถุงมือ · ห้ามอุ้มหน้า', kind: 'flag' },
        ],
      },
      {
        heading: 'Malassezia dermatitis',
        source: 'Derm__5_Fungal_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Malassezia pachydermatis** = lipophilic yeast, normal flora ที่ overgrowth ใน warm/moist + allergic skin',
            'Predisposed: West Highland White Terrier, Basset Hound, Cocker — ear, lip fold, paw, ventral neck',
            'Clinical: greasy odor (rancid), erythema, hyperpigmentation, lichenification, pruritus',
            'Dx: tape impression → DiffQuick → "peanut-shaped" yeast (~3-7 µm)',
            'Tx topical: miconazole + chlorhex shampoo 2× weekly × 4 wk',
            'Tx systemic (severe): ketoconazole 5 mg/kg/day OR itraconazole pulse therapy',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-endocrine': {
    topic: 'derm-endocrine',
    title: 'Endocrine Skin Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '⚖️',
    summary: 'Endocrine alopecia = bilateral symmetric, non-pruritic. Hypothyroidism (rat tail), HAC (Cushing\'s thin skin + calcinosis), Sex hormone (Sertoli tumor), Alopecia X (Pomeranian "BSC"). Dx: hormone testing + skin biopsy.',
    sections: [
      {
        heading: 'Pattern recognition — endocrine alopecia',
        source: 'Derm_6_Endocrine_skin_diseases.pdf',
        body: [
          'Common features: **bilateral symmetric, non-pruritic, truncal alopecia** + change ในขนคุณภาพ (dull, easy epilation)',
          { bullets: [
            'Hair cycle disruption — anagen arrest → telogen retention',
            'Mostly middle-aged + older dogs · breed predispositions',
            'Confirm by **hormone testing** + skin biopsy (catagen/telogen arrest, follicular atrophy)',
          ] },
        ],
      },
      {
        heading: 'Hypothyroidism',
        source: 'Derm_6_Endocrine_skin_diseases.pdf',
        body: [
          { bullets: [
            'Most common endocrine dz ใน dog · primary (lymphocytic thyroiditis) > 95%',
            'Predisposed: Golden Retriever, Doberman, Cocker, Irish Setter (4-10 yr)',
            'Dermatologic: bilateral truncal alopecia, **rat tail**, hyperpigmentation, scaling, recurrent pyoderma + Malassezia',
            'Systemic: weight gain, lethargy, cold intolerance, bradycardia, "tragic facial expression" (myxedema)',
            'Dx: **Total T4 + Free T4 (ED) + TSH** · low T4 + high TSH = primary hypothyroid',
            'Tx: **Levothyroxine 0.02 mg/kg PO q12h** (start), titrate by post-pill T4 (4-6 hr post)',
          ] },
        ],
      },
      {
        heading: "Hyperadrenocorticism (Cushing's, HAC)",
        source: 'Derm_6_Endocrine_skin_diseases.pdf',
        body: [
          { bullets: [
            '**PDH (pituitary-dependent) ~85%** vs ADH (adrenal) ~15% · iatrogenic from chronic steroid',
            'Predisposed: Poodle, Dachshund, Beagle, Boston Terrier (older, > 6 yr)',
            'Dermatologic: bilateral truncal alopecia, **thin skin** ★, comedone, calcinosis cutis, hyperpigmentation',
            'Systemic: PU/PD, polyphagia, pot-belly, hepatomegaly, panting, muscle weakness',
            'Dx: ALP ↑↑↑ · low USG · **ACTH stim test** + **LDDST** · UCCR (screen)',
            'Tx: **Trilostane 1-3 mg/kg q12h** (1st line) · mitotane (older) · adrenalectomy (ADH)',
          ] },
          { callout: 'Calcinosis cutis (firm dystrophic mineralization in skin) = pathognomonic of HAC', kind: 'tip' },
        ],
      },
      {
        heading: 'Sex hormone dermatosis',
        source: 'Derm_6_Endocrine_skin_diseases.pdf',
        body: [
          { bullets: [
            '**Hyperestrogenism (Sertoli cell tumor)** — intact older male, **cryptorchid risk ★** · feminization (gynecomastia, attract other males), bilateral alopecia, linear preputial dermatosis · Tx = orchiectomy',
            'Hyperestrogenism (cystic ovary) — intact older bitch · alopecia + vulva enlargement · Tx = OHE',
            'Hypoandrogenism — castrated male, gradual alopecia · Tx = methyltestosterone (rare use)',
            'Hyperprogesterone — uncommon',
          ] },
        ],
      },
      {
        heading: 'Alopecia X (BSC — Black Skin Disease)',
        source: 'Derm_6_Endocrine_skin_diseases.pdf',
        body: [
          { bullets: [
            'Adrenal sex hormone dysregulation (still incompletely understood)',
            'Predisposed: **Pomeranian**, Chow Chow, Keeshond, Samoyed, Alaskan Malamute',
            'Bilateral truncal alopecia + **hyperpigmentation** ("BSC") · head + legs spared · non-pruritic · normal CBC + thyroid + cortisol',
            'Tx options: melatonin 3-6 mg q12h (1st line) · trilostane (off-label) · neutering ★ · deslorelin implant',
            'Cosmetic problem mainly — not life-threatening',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-nutrition': {
    topic: 'derm-nutrition',
    title: 'Nutritional Skin Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🥗',
    summary: 'Zinc-responsive (Husky/Mal — Type I genetic, Type II diet) · Vitamin A-responsive (Cocker) · EFA deficiency · Generic dog food disease · Protein/calorie malnutrition. Tx: supplement + balanced diet.',
    sections: [
      {
        heading: 'Zinc-responsive dermatosis',
        source: 'Derm_7_Nutrition_skin_disease.pdf',
        body: [
          { sub: 'Type I (Genetic — Northern breeds)',
            body: [
              { bullets: [
                'Predisposed: **Siberian Husky, Alaskan Malamute, Samoyed**',
                'Defective intestinal Zn absorption · adult onset · chronic',
                'Lesion: crust, scale, alopecia at **mucocutaneous junctions** (lip, eye, ear, scrotum, footpad) + pressure points',
                'Dx: skin biopsy (parakeratosis, basket-weave keratin) + response to Zn supplementation',
                'Tx: Zinc methionine 1.5-2 mg/kg/day OR Zinc sulfate 10 mg/kg/day · **lifelong**',
              ] },
            ] },
          { sub: 'Type II (Dietary — puppy)',
            body: [
              { bullets: [
                'Generic / cereal-based diet · phytates + Ca block Zn absorption',
                'Rapid-growing puppy (3-12 mo) · large breed',
                'Lesion: similar pattern + secondary pyoderma',
                'Tx: switch to balanced AAFCO diet ± temporary Zn supplement · resolves',
              ] },
            ] },
        ],
      },
      {
        heading: 'Vitamin A + EFA deficiency',
        source: 'Derm_7_Nutrition_skin_disease.pdf',
        body: [
          { sub: 'Vitamin A-responsive dermatosis',
            body: [
              { bullets: [
                'Predisposed: **Cocker Spaniel** ★ · adult onset',
                'Lesion: hyperkeratotic plaques (frond-like), alopecia, secondary infection',
                'Tx: vitamin A 10,000 IU PO q24h with food · lifelong · monitor LFT',
              ] },
            ] },
          { sub: 'Essential Fatty Acid (EFA) deficiency',
            body: [
              { bullets: [
                'Linoleic acid (ω-6) + α-linolenic (ω-3) · ↓ ในอาหารเก่าหรือผ่านความร้อนสูง',
                'Lesion: dry dull coat, scaling, slow wound healing, pruritus',
                'Tx: balanced diet (high-quality fat) · ω-3/ω-6 supplement (fish oil, evening primrose oil)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Generic dog food disease + protein malnutrition',
        source: 'Derm_7_Nutrition_skin_disease.pdf',
        body: [
          { bullets: [
            'Generic / unbalanced diet → multi-nutrient deficiency (Zn, EFA, vit A, biotin, Cu)',
            'Common in puppy fed cheap commercial / homemade diet',
            'Coat: dry, brittle, scaling, alopecia + immunosuppression',
            'Protein-energy malnutrition: hair color change ("graying"), thin coat, cachexia',
            'Tx: switch to AAFCO-complete diet · address underlying GI absorption (EPI, IBD)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-allergic': {
    topic: 'derm-allergic',
    title: 'Allergic Dermatitis (CAD/AD + FAD + Food Allergy)',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🤧',
    summary: 'CAD = #1 chronic skin dz · Type I hypersensitivity to environmental Ag · Favrot criteria · Diet trial 8 wk. Tx: allergen avoidance + symptomatic (cyclosporine, oclacitinib, lokivetmab) + ASIT.',
    sections: [
      {
        heading: 'Canine Atopic Dermatitis (CAD/AD) — definition',
        source: 'Derm_8_Allergic_dermatitis.pdf',
        body: [
          'Genetically predisposed inflammatory + pruritic skin dz · type I IgE-mediated hypersensitivity ต่อ environmental allergens (dust mite, pollen, mold, dander)',
          { bullets: [
            'Onset: **6 mo - 3 yr** (most common) · breed predisposition: **WHWT, Boxer, Labrador, Golden, French Bulldog, Shar-Pei**',
            'Pathogenesis: defective skin barrier (filaggrin) + Th2 dominant + microbial dysbiosis',
            'Year-round vs seasonal (depends on allergen)',
          ] },
        ],
      },
      {
        heading: 'Favrot criteria + diagnosis',
        source: 'Derm_8_Allergic_dermatitis.pdf',
        body: [
          { sub: 'Favrot criteria (≥ 5 = AD likely, sensitivity 85%)',
            body: [
              { bullets: [
                'Onset < 3 yr',
                'Mostly indoor dog',
                'Corticosteroid-responsive pruritus',
                'Chronic / recurrent yeast infection',
                'Affected forefeet (paw chewing)',
                'Affected ear pinnae (otitis externa)',
                'Non-affected ear margins (vs Sarcoptes)',
                'Non-affected dorsolumbar (vs flea)',
              ] },
            ] },
          { sub: 'Workup (TRIP)',
            body: [
              { bullets: [
                '**T**reatment trial — flea control × 8 wk (rule out FAD)',
                '**R**ule out infection (cytology, scraping)',
                '**I**ngredient elimination — hydrolyzed/novel protein × **8 wk** (rule out food allergy)',
                '**P**rovocation — re-challenge old diet → relapse confirms food allergy',
              ] },
            ] },
          { callout: 'Allergy testing (intradermal / serum IgE) ใช้สำหรับ **ASIT formulation** เท่านั้น — ไม่ใช่ diagnostic (CAD วินิจฉัยทางคลินิก)', kind: 'tip' },
        ],
      },
      {
        heading: 'Treatment — multimodal',
        source: 'Derm_8_Allergic_dermatitis.pdf + ICADA 2015',
        body: [
          { sub: '1. Avoidance + skin barrier',
            body: [
              { bullets: [
                'HEPA filter, wash bedding hot water, regular bath',
                'Topical: oatmeal shampoo, ceramide spray, EFA spray',
                'Omega-3/6 supplementation (8 wk to effect)',
              ] },
            ] },
          { sub: '2. Symptomatic anti-pruritic',
            body: [
              { table: {
                headers: ['Drug', 'Class', 'Dose', 'Onset'],
                rows: [
                  ['**Glucocorticoid**', 'Steroid', 'Pred 0.5-1 mg/kg/day → taper', 'Hours'],
                  ['**Cyclosporine** (Atopica)', 'Calcineurin inhibitor', '5 mg/kg/day × 4 wk → taper', '4-8 wk'],
                  ['**Oclacitinib** (Apoquel) ★', 'JAK inhibitor', '0.4-0.6 mg/kg q12h × 14 d → q24h', '24 hr (rapid!)'],
                  ['**Lokivetmab** (Cytopoint) ★', 'Anti-IL-31 mAb', '2 mg/kg SC q4-8 wk', '24 hr'],
                ],
              } },
            ] },
          { sub: '3. ASIT (Allergen-Specific Immunotherapy)',
            body: [
              { bullets: [
                'Subcutaneous (SCIT) or sublingual (SLIT) — based on allergy testing',
                'Long-term modifying therapy · 60-70% effective · 6-12 mo to effect',
                'ทุก 1-3 wk lifelong · ลดความต้องการ symptomatic drug',
              ] },
            ] },
        ],
      },
      {
        heading: 'FAD + Food allergy',
        source: 'Derm_8_Allergic_dermatitis.pdf',
        body: [
          { sub: 'FAD (Flea Allergic Dermatitis)',
            body: [
              { bullets: [
                'Type I + IV reaction to flea saliva — even single bite triggers',
                'Pattern: **dorsolumbar, tail base, caudal thigh** (dog) · miliary dermatitis (cat)',
                'Tx: aggressive flea control (isoxazoline year-round) + symptomatic',
              ] },
            ] },
          { sub: 'Food allergy / adverse food reaction',
            body: [
              { bullets: [
                '~10-25% ของ allergic dog · year-round, non-seasonal pruritus',
                'Top allergens: beef, dairy, chicken, wheat (dog) · beef, fish, chicken (cat)',
                'GI sign in 30% (chronic diarrhea, vomit)',
                'Dx: **8-week elimination diet trial** with hydrolyzed/novel protein → re-challenge',
                'Tx: lifelong specific avoidance (read labels, no treats!)',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'derm-autoimmune': {
    topic: 'derm-autoimmune',
    title: 'Autoimmune Skin Diseases',
    lecturer: 'Chaiyot Tanrattana',
    icon: '🛡',
    summary: 'Pemphigus complex (Dsg1/Dsg3 autoAb) — PF most common, "muco-cutaneous nasal planum" · Bullous pemphigoid (BPAg2) · DLE = facial only · SLE skin = part of multi-organ. Tx: Pred + steroid-sparing.',
    sections: [
      {
        heading: 'Pemphigus complex',
        source: 'Derm_9_Autoimmune_skin_diseases.pdf',
        body: [
          { sub: '4 forms (Dsg = desmoglein autoAg)',
            body: [
              { table: {
                headers: ['Form', 'AutoAg', 'Lesion', 'Severity'],
                rows: [
                  ['**PF (Pemphigus foliaceus)** ★ #1', 'Dsg1 (superficial)', 'Pustule → **crust + alopecia ใน nasal planum, ear, periocular, footpad**', 'Mild-moderate'],
                  ['PE (erythematosus)', 'Dsg1 + ANA', 'Mild PF + DLE features (face only)', 'Mild'],
                  ['PV (vulgaris)', 'Dsg3 (deeper)', 'Vesicle + erosion + ulcer **mucocutaneous + oral**', 'Severe'],
                  ['PVeg (vegetans)', 'Dsg3', 'Hyperplastic verrucous lesion', 'Rare'],
                ],
              } },
            ] },
          { sub: 'Diagnosis',
            body: [
              { bullets: [
                '**Skin biopsy** ★ — punch from intact pustule (rare) or crust edge',
                'Histopath: **acantholytic keratinocyte** (rounded, free-floating in pustule) + neutrophil',
                'Direct immunofluorescence (rare) — IgG deposition at intercellular space',
              ] },
            ] },
        ],
      },
      {
        heading: 'Bullous pemphigoid + DLE',
        source: 'Derm_9_Autoimmune_skin_diseases.pdf',
        body: [
          { sub: 'Bullous pemphigoid (BP)',
            body: [
              { bullets: [
                'AutoAb to **BPAg2 (collagen XVII)** at hemidesmosome → subepidermal blister',
                'Vesicle/bullae (large) + ulcer + mucocutaneous + oral involvement',
                'Histopath: subepidermal cleft (deeper than pemphigus) · DIF: linear basement membrane',
                'Predisposed: Collie, Sheltie (rare overall)',
              ] },
            ] },
          { sub: 'DLE (Discoid Lupus Erythematosus) — "facial only" lupus',
            body: [
              { bullets: [
                'Cutaneous-only form ของ lupus · UV-aggravated',
                'Lesion: **depigmentation + erosion + crust at nasal planum** ★ ("loss of cobblestone pattern")',
                'Predisposed: Collie, Sheltie, GSD, Husky',
                'Workup: ANA usually negative (vs SLE) · biopsy = interface dermatitis',
                'Tx: **sun avoidance** + topical tacrolimus 0.1% + systemic vitamin E + ω-3 · severe → systemic Pred',
              ] },
            ] },
        ],
      },
      {
        heading: 'Treatment — autoimmune skin overall',
        source: 'Derm_9_Autoimmune_skin_diseases.pdf',
        body: [
          { bullets: [
            { label: 'Mild (DLE, mild PF)', value: 'Topical tacrolimus 0.1% + sun avoidance + vit E + ω-3' },
            { label: 'Moderate-Severe', value: 'Pred 2-4 mg/kg/day → taper · add cyclosporine 5 mg/kg/day OR azathioprine 2 mg/kg/day (dog)' },
            { label: 'Refractory', value: 'MMF · chlorambucil (cat) · IVIG (severe PV with ulcer)' },
            { label: 'Adjunct', value: 'Treat secondary pyoderma (cephalexin) · monitor CBC q2wk × 8 wk · long-term taper' },
          ] },
          { callout: 'Pemphigus = lifelong therapy in most · prognosis better than SLE · monitor for relapse', kind: 'warn' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'peds-geri': {
    topic: 'peds-geri',
    title: 'Pediatrics & Geriatrics',
    lecturer: 'Punyamanee Yamkate',
    icon: '👶',
    summary: 'Neonatal 4Hs (hypothermia/-glycemia/-hydration/-oxia) · NEI in cat type B blood · Fading puppy syndrome · Geriatric: q6mo screen, ↓ GI motility/HCl/bile, DISHAA cognitive · GI/CKD/HT/neoplasia common in senior.',
    sections: [
      {
        heading: 'Pediatric — neonatal 4Hs',
        source: 'Pediatrics_and_Geriatrics.pdf',
        body: [
          'Neonate (0-2 wk) cannot self-regulate — physiologically distinct from adult',
          { table: {
            headers: ['H', 'Parameter', 'Normal', 'Risk'],
            rows: [
              ['**Hypothermia**', 'Body temp', '95-99°F (35-37°C) week 1 · 100°F by week 4', '< 94°F → poor digestion, immune ↓'],
              ['**Hypoglycemia**', 'Blood glucose', '> 50 mg/dL', 'Toy breed prone · seizure, weakness'],
              ['**Hypoxia**', 'Color + RR', 'Pink mm, RR 15-35 (vary)', 'Cyanosis, gasping → clear airway, O2'],
              ['**Hypohydration**', 'Skin turgor + mm', 'Pink moist mm', 'Quick deteriorate → SC/IO fluid'],
            ],
          } },
          { callout: 'Neonate **cannot shiver** ก่อน 6 days · **cannot urinate/defecate** without dam stimulation · gut sterile at birth → maternal Ab via colostrum (first 24 hr critical)', kind: 'tip' },
        ],
      },
      {
        heading: 'NEI (Neonatal Erythrolysis / Isoerythrolysis)',
        source: 'Pediatrics_and_Geriatrics.pdf',
        body: [
          { bullets: [
            'Cat-specific concern · **Type B queen × Type A tom → kitten Type A** drinks colostrum from Type B queen → anti-A alloAb → hemolysis',
            'Predisposed breeds (high Type B%): **British Shorthair, Devon Rex, Cornish Rex, Birman, Ragdoll**',
            'Sign within 24-72 hr: hemoglobinuria, jaundice, "fading kitten", death',
            'Prevent: blood-type queen + tom before breeding · ถ้า mismatch → ดึง kitten ออก × 24 hr (no colostrum) → ให้ colostrum from Type A queen หรือ replacer',
          ] },
        ],
      },
      {
        heading: 'Fading puppy/kitten syndrome',
        source: 'Pediatrics_and_Geriatrics.pdf',
        body: [
          { bullets: [
            'Puppy/kitten dies within first 2 wk despite normal birth · multifactorial',
            'Causes: low birth weight (< 75% breed avg), hypothermia, hypoglycemia, dehydration, sepsis, congenital defect, parvo, herpesvirus (canine), FPV (feline), NEI',
            'Workup: necropsy + culture + viral PCR · weigh daily (gain ~5-10% body wt/day)',
            'Tx: warm + glucose + fluid + ATB (broad-spectrum) — even prophylactic',
          ] },
        ],
      },
      {
        heading: 'Geriatric — definition + screening',
        source: 'Pediatrics_and_Geriatrics.pdf',
        body: [
          { bullets: [
            'Senior: small dog ≥ 9 yr · large dog ≥ 6 yr · cat ≥ 11 yr',
            '**q6 mo geriatric screen** ★ (vs q12mo adult): PE, weight, BCS, MCS, dental, BP, CBC, chem, UA, T4 (cat), thyroid (dog if symptomatic)',
            { label: 'DISHAA cognitive screen', value: 'Disorientation, Interaction change, Sleep-wake, House-soiling, Activity change, Anxiety' },
          ] },
        ],
      },
      {
        heading: 'Geriatric physiologic changes',
        source: 'Pediatrics_and_Geriatrics.pdf + FINAL 86 ★',
        body: [
          { sub: 'GI (FINAL 86 high yield ★)',
            body: [
              { bullets: [
                '**↓ motility** → constipation (worsened by dehydration + DJD)',
                '**↓ HCl** secretion → malabsorption (B12, Fe), bacterial overgrowth',
                '**↓ bile** production → fat malabsorption, cholestatic dz',
                'Common: chronic enteropathy, IBD, chronic hepatitis, pancreatitis (triaditis ใน cat = cholangitis + IBD + pancreatitis)',
              ] },
            ] },
          { sub: 'Common geriatric diseases',
            body: [
              { table: {
                headers: ['System', 'Dog', 'Cat'],
                rows: [
                  ['Renal', 'CKD (~10-15%)', 'CKD (~30%) #1'],
                  ['Endocrine', 'HAC, hypothyroid, DM', 'Hyperthyroid, DM type II'],
                  ['Neoplasia', 'Lymphoma, MCT, mammary, hemangiosarcoma', 'Lymphoma, MCT, SCC oral, mammary, intestinal adenoCA'],
                  ['MS', 'OA (DJD)', 'OA (under-recognized)'],
                  ['CV', 'MMVD (small breed) · DCM (large)', 'HCM'],
                  ['CNS', 'Cognitive dysfunction', 'Cognitive dysfunction'],
                ],
              } },
            ] },
          { callout: 'Senior cat **CKD = #1 cause of death** (> 30%) · screen with USG + UPC + SDMA + creatinine', kind: 'flag' },
        ],
      },
    ],
  },
};
