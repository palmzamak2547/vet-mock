// ============================================================
// COM III Study Notes — for "ทวนเนื้อหา" feature
// ============================================================
// Sources verified from extracted lecture text:
//   - Slide Lecture 2026 (14 lectures)
//   - "COM III FINAL 86 เส้นแดงคือรวมโพย" (TJ86 master compilation)
//   - sunsun84 Vet 84 archive
// Body item types same as notes-com5.js
// ============================================================

export const NOTES_COM3 = {
  // ─────────────────────────────────────────────────────────────
  'ai-vet': {
    topic: 'ai-vet',
    title: 'AI in Vet Learning',
    lecturer: 'Aj. Nutthee Am-In',
    icon: '🤖',
    summary: 'NotebookLM (best for study notes, low hallucination) · ChatGPT/Gemini/Claude · Prompt engineering · Verify with primary source · Cite usage · ห้าม upload PHI',
    sections: [
      {
        heading: 'AI Platforms — comparison',
        source: 'COM III ตารางเรียน คาบ 19 + AI literature 2025',
        body: [
          { table: {
            headers: ['Tool', 'Strengths', 'Best for'],
            rows: [
              ['**ChatGPT** (OpenAI)', 'General purpose · conversational · web browse', 'Brainstorming · drafting · Q&A'],
              ['**Gemini** (Google)', 'Multimodal · Google Search integration', 'Image-text tasks · current info'],
              ['**Claude** (Anthropic)', 'Long context · careful reasoning', 'Complex analysis · long documents'],
              ['**NotebookLM** ⭐', 'Document-grounded · cite from uploaded sources only', 'Study notes · clinical research · low hallucination'],
              ['Perplexity', 'Search-grounded answers + citation', 'Research with up-to-date info'],
            ] } },
        ],
      },
      {
        heading: 'Prompt Engineering — best practice',
        source: 'AI literature + clinical use',
        body: [
          { bullets: [
            { label: '1. Context first', value: 'Patient signalment (species/age/sex/breed) + chief complaint + relevant history' },
            { label: '2. Specific question', value: 'Avoid vague "what is wrong" → "differential dx for sudden HL plegia in 6 yo Dachshund"' },
            { label: '3. Format request', value: 'Ask for tables, bullet, citations, evidence level' },
            { label: '4. Iterate', value: 'Refine prompts based on initial output' },
            { label: '5. Verify', value: 'Cross-check with primary source (textbook, paper, guideline)' },
          ] },
        ],
      },
      {
        heading: 'Hallucination — risk + mitigation',
        source: 'AI safety',
        body: [
          { bullets: [
            'Hallucination = AI generates **plausible-sounding but inaccurate** content',
            'Risk: drug doses, specific citations, statistics — can be made up',
            'Mitigation: use document-grounded tools (NotebookLM) · verify all clinical facts',
          ] },
          { callout: '⚠️ ห้าม trust AI สำหรับ drug doses, drug interactions, treatment protocols โดยไม่ verify', kind: 'warn' },
        ],
      },
      {
        heading: 'Ethics & Citation',
        source: 'ICMJE + Chula academic policy',
        body: [
          { bullets: [
            'Transparency: ระบุการใช้ AI tool + version + how used',
            'AI **ไม่ใช่ author** (per ICMJE) — credit แบบ acknowledgment',
            'Format: "Generated/edited with assistance from ChatGPT-4 (OpenAI, accessed Mar 2026)"',
            'Maintain own critical thinking + medical decision responsibility',
          ] },
        ],
      },
      {
        heading: 'Privacy & PHI',
        source: 'GDPR + PDPA Thailand',
        body: [
          { bullets: [
            '**ห้าม upload PHI/PII** (ชื่อเจ้าของ, record number, contact info)',
            'Free-tier AI อาจใช้ data ในการ train',
            'De-identify ก่อน upload (เปลี่ยนชื่อ → "Patient A", remove DOB)',
            'Enterprise version (ChatGPT Enterprise, Claude Pro Team) มี data privacy contract',
          ] },
        ],
      },
      {
        heading: 'Limitations to know',
        source: 'AI in healthcare best practice',
        body: [
          { bullets: [
            'Knowledge cutoff date — ไม่ทัน guideline ใหม่',
            'Training bias (English/Western data dominates)',
            'Cannot examine real patient — vital signs, palpation, smell',
            'Cannot replace clinical judgment + license',
            'Use as **decision support** ไม่ใช่ decision maker',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  triage: {
    topic: 'triage',
    title: 'Triage of Emergency Patients',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '🚦',
    summary: 'แบ่ง emergency: red/yellow/green · Primary survey ABCDE · 6 perfusion: mentation, MM, CRT, HR, pulse, extremity temp · Secondary survey เมื่อ stable',
    sections: [
      {
        heading: 'Approach to Emergency Patients',
        source: 'triage 1 hr.pdf + master p.40',
        body: [
          { bullets: [
            'Triage = ภาษาฝรั่งเศส "to sort"',
            'ขั้นตอน: Brief history → Primary survey → Triage decision → Resuscitation → Secondary survey',
            { label: 'Triage หลัก 3 สี', value: '🔴 Red (immediate) · 🟡 Yellow (stable but critical) · 🟢 Green (รอได้ 24h)' },
          ] },
        ],
      },
      {
        heading: 'Primary Survey — ABCDE',
        source: 'triage 1 hr.pdf p.41-42',
        body: [
          { table: {
            headers: ['Step', 'ตรวจอะไร'],
            rows: [
              ['**A — Airway**', 'Patency · obstruction · stridor'],
              ['**B — Breathing**', 'Pattern · rate · effort · paradoxical breathing · lung sound'],
              ['**C — Circulation**', '6 perfusion params (ดูด้านล่าง)'],
              ['**D — Dysfunction CNS**', 'Mentation level · pupils · seizure · response to pain'],
              ['**E — Exposure**', 'Wound · trauma · UB distension · bleeding'],
            ] } },
        ],
      },
      {
        heading: '6 Perfusion Parameters (Circulation)',
        source: 'triage 1 hr.pdf p.42 + master',
        body: [
          { bullets: [
            '**Mentation** — alert / obtunded / stuporous / comatose',
            '**MM color** — pink (normal) / pale (vasoconstrict, anemia) / brick red (sepsis vasodilate) / cyanotic (hypoxemia) / icteric (hemolysis)',
            '**CRT** — กดที่ inner lip 4s · normal 1-2s · prolonged > 2s = poor perfusion',
            '**HR** — สุนัข shock = tachy · ⚠️ **แมว shock = brady** (paradox)',
            '**Pulse quality** — bounding (sepsis signature) · thready (vasoconstriction) · normal (sys-dias gap)',
            '**Extremity temp** — เย็นปลายมือ-เท้า = poor distal perfusion',
          ] },
        ],
      },
      {
        heading: 'HR ปกติตามขนาดสุนัข',
        source: 'triage 1 hr.pdf p.42',
        body: [
          { table: {
            headers: ['ขนาด', 'HR (bpm)'],
            rows: [
              ['สุนัขเล็ก', '60-140'],
              ['สุนัขกลาง', '70-160'],
              ['สุนัขใหญ่', '100-180'],
              ['ลูกสัตว์ / แมว', '120-240'],
            ] } },
        ],
      },
      {
        heading: 'Resuscitation → Secondary Survey',
        source: 'triage 1 hr.pdf p.43',
        body: [
          { bullets: [
            'Stabilize vital signs ก่อน',
            'Secondary survey: complete history + complete PE + problem list + plan',
            'Progress note → continual reassessment',
          ] },
          { callout: 'RR > 30 ขณะ rest = abnormal · RR > 50 ตอนตื่นเต้น = abnormal', kind: 'tip' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  shock: {
    topic: 'shock',
    title: 'SHOCK',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '⚠️',
    summary: '5 types: hypovolemic / cardiogenic / obstructive / distributive / metabolic-hypoxic · Goal: detect early + restore O₂ delivery · Fluid ช่วยทุก type ยกเว้น cardiogenic',
    sections: [
      {
        heading: 'Definition',
        source: 'SHOCK 1 hr.pdf + master p.15',
        body: [
          'Shock = tissue ขาด O₂ จาก imbalance ระหว่าง O₂ delivery (DO₂) และ consumption (VO₂)',
          'ATP ลด → cell ตาย → organ failure → death · Detection ให้เร็วที่สุด',
          { bullets: [
            'DO₂ formula: CaO₂ × CO · CaO₂ = (1.34 × Hb × SaO₂) + (0.003 × PaO₂)',
            'Factors affecting DO₂: SV · HR · Hb · SaO₂',
          ] },
        ],
      },
      {
        heading: '5 Types of Shock',
        source: 'SHOCK 1 hr.pdf p.15-16',
        body: [
          { table: {
            headers: ['Type', 'กลไก', 'ตัวอย่าง'],
            rows: [
              ['**Hypovolemic** (cold shock)', 'Volume ↓ → VR ↓ → CO ↓', 'Hemorrhage · severe vomit/diarrhea · 3rd-spacing'],
              ['**Cardiogenic** (forward failure)', 'Pump failure → SV ↓ → DO₂ ↓ · ⚠️ fluid ทำให้แย่ลง', 'DCM, HCM · arrhythmia · valve dz · tamponade'],
              ['**Obstructive**', 'Block ขัดการไหลเวียน → VR/CO ↓', 'GDV · pericardial effusion · tension pneumothorax · PE · ATE'],
              ['**Distributive** (warm shock)', 'NO/cytokines → vasodilation → VR ↓', 'Sepsis · SIRS · anaphylaxis'],
              ['**Metabolic / Hypoxic**', 'O₂ delivery ปกติแต่ใช้ไม่ได้ / Hb ขนส่งไม่พอ', 'Cyanide · hypoglycemia (metabolic) · anemia · pneumonia (hypoxic)'],
            ] } },
        ],
      },
      {
        heading: 'SIRS / Sepsis / Septic shock',
        source: 'SHOCK 1 hr.pdf p.16',
        body: [
          { sub: 'SIRS criteria — ≥ 2/4',
            body: [
              { bullets: [
                'Temp > 39 หรือ < 38 °C',
                'HR สูง (สุนัข > 120, แมวมัก ↓)',
                'RR > 40',
                'WBC สูง / ต่ำ / band ↑',
              ] },
            ] },
          { sub: 'Sepsis = SIRS + infection · Septic shock = sepsis + hypotension (MAP ≤ 65) + lactate > 2 mmol/L + hypoperfusion',
            body: [
              { bullets: [
                'Common: gram-negative (E. coli)',
                'Pancreatitis, severe trauma, metastatic cancer, autoimmune ก็ทำให้เกิด SIRS ได้',
                'MODS = lamination ของ inflammation ไปอวัยวะอื่น (kidney, heart, brain)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Stages',
        source: 'SHOCK 1 hr.pdf p.17',
        body: [
          { table: {
            headers: ['Stage', 'Description', 'Vital'],
            rows: [
              ['**1. Compensatory**', 'Compensate ได้ดี ดูไม่ป่วย', 'HR ↑, BP ปกติ, MM ปกติ'],
              ['**2. Early decompensatory**', 'Compensate ไม่ไหว — แก้ทัน', 'HR สูง/ต่ำ, BP เริ่มตก, MM ซีด, CRT ช้า'],
              ['**3. Late decompensatory**', 'Multi-organ failure — กู้ไม่ได้', 'HR ต่ำ, BP ต่ำมาก, hypothermic, coma'],
            ] } },
        ],
      },
      {
        heading: 'Diagnosis',
        source: 'SHOCK 1 hr.pdf p.17',
        body: [
          { bullets: [
            'PE: HR · RR · pulse · CRT · mentation · MM · temp · SBP',
            'CBC + chem + lactate + electrolyte + blood gas + glucose',
            { label: 'Lactate', value: '> 2.5 mmol/L = hyperlactatemia · type A (poor perfusion) · type B (cellular dysfunction)' },
            { label: 'Shock Index (SI)', value: 'SI = HR / SBP · normal 0.9-1.0 · > 1 → suspect shock' },
            { label: 'ScvO₂', value: 'normal 65-75% · < 65% → poor perfusion (ทำยาก ไม่ค่อยใช้)' },
          ] },
        ],
      },
      {
        heading: 'Treatment',
        source: 'SHOCK 1 hr.pdf p.18-19',
        body: [
          { sub: 'Oxygen therapy',
            body: [
              { bullets: [
                'PaO₂ < 80 หรือ SpO₂ < 94% → O₂ supplement',
                'Severe → ARDS / pulmonary edema → mechanical ventilation',
              ] },
            ] },
          { sub: 'Fluid therapy — first choice (ยกเว้น cardiogenic)',
            body: [
              { bullets: [
                '**Crystalloid** (LRS, NSS) — bolus 60-90 ml/kg dog · 30-60 ml/kg cat (titrate by response)',
                '**Hypertonic saline 7%** — 4 ml/kg ใน 5-10 min — ใช้ปริมาณน้อย แต่ดึง fluid เข้า vasc · ตามด้วย crystalloid',
                '**Colloid** (HES) — controversial — ทำให้ stay in vasc นานกว่า',
                'Goal: HR < 150, SBP > 90, lactate ↓',
              ] },
            ] },
          { sub: 'Vasopressor + Inotrope (cardiogenic / refractory)',
            body: [
              { bullets: [
                '**Norepinephrine** — α-agonist · vasoconstriction · ใช้บ่อยใน septic shock (SAP < 80, MAP < 60)',
                '**Dopamine** — α + β · ผลทั้งหัวใจและหลอดเลือด',
                '**Dobutamine** — β1 specific · inotrope (cardiogenic shock)',
              ] },
            ] },
          { sub: 'Additional',
            body: [
              { bullets: [
                'Diuretics: Furosemide (cardiogenic + back failure) · Mannitol (osmotic)',
                'ABO if septic: broad-spectrum within 1 hr',
                'Glucose 0.25-0.5 g/kg IV ถ้า hypoglycemic',
                'Gastroprotectant (sucralfate, H2-blocker, PPI) — gut mucosa damage',
                'NaHCO₃ ถ้า pH < 7.2 หรือ HCO₃⁻ < 14 (slow over 30 min)',
                '⚠️ **Steroid + NSAIDs ห้ามใช้** ยกเว้น CIRCI (critical illness corticosteroid insufficiency)',
                'Nutrition within 24-48 hr (enteral preferred)',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  cpcr: {
    topic: 'cpcr',
    title: 'CPCR (Cardiopulmonary Cerebral Resuscitation)',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '❤️',
    summary: 'RECOVER guidelines: compression 100-120/min, depth 1/3-1/2 chest · 30:2 (no ETT) · Epi 0.01 mg/kg q3-5min · shockable = VF/pulseless VT',
    sections: [
      {
        heading: 'Recognition + Team',
        source: 'CPCR 1 hr.pdf + master p.27-28',
        body: [
          { bullets: [
            'Detect within < 10s — CAB assessment (Consciousness, Airway, Breathing)',
            'Apnea / agonal breathing = arrest — ห้ามรอดู pulse',
            'Team setup: 4 คน — leader + chest compression + airway + meds/monitoring',
            'CPR training every 6 months · closed-loop communication',
          ] },
          { callout: 'ถ้าอยู่คนเดียว: pump ก่อน · ถ้ามีจนท. ส่ง history และ prepare crash cart', kind: 'tip' },
        ],
      },
      {
        heading: 'Step 1-3: Basic Life Support',
        source: 'CPCR 1 hr.pdf + master p.29',
        body: [
          { sub: 'Compression — 100-120/min, depth 1/3-1/2 chest',
            body: [
              { bullets: [
                '**Cardiac pump theory** — สุนัขอกแคบ, แมว, small breed → กดตรงๆ over heart',
                '**Thoracic pump theory** — round chest (Rottweiler, Retriever) → กดตำแหน่งสูงสุดของ rib',
                'Ventral abdomen: rib 4-6 (1/3 จาก ventral)',
                'Sholder กับศอกแนวเดียว · เปลี่ยนคนทุก 2 นาที',
                '"Full chest wall recoil" — กดแล้วรอให้อก expand เต็มที่ก่อนกดต่อ',
              ] },
            ] },
          { sub: 'Ventilation',
            body: [
              { bullets: [
                'No ETT: **30 compressions : 2 ventilations** (ratio)',
                'With ETT: continuous compression + ventilate **10/min** (1 ทุก 6 วินาที)',
                'Ambubag 100/min (squeeze 1/4 chest depth)',
                'ห้าม mouth-to-snout (เชื้อ + เป่าจมูกแมวยาก)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Step 4: Advanced Life Support',
        source: 'CPCR 1 hr.pdf + master p.30',
        body: [
          { sub: 'Monitoring',
            body: [
              { bullets: [
                '**ECG** — ดูตอนเปลี่ยนคน (ตอนกดดูไม่ได้)',
                '**EtCO₂ (capnography)** — goal **> 18 mmHg** · โดดขึ้น 40 mmHg = ROSC',
                'Femoral pulse — ตรวจ ROSC ตอน rotate (ไม่ใช่ during arrest)',
              ] },
            ] },
          { sub: 'Vascular access',
            body: [
              { bullets: [
                'Cephalic vein (ขาหน้า) ดีกว่า · ไม่เจอ → IO (intraosseous) ในลูกสุนัขเล็ก · สุดท้าย → intratracheal (dose 2x)',
              ] },
            ] },
          { sub: 'Drugs',
            body: [
              { bullets: [
                '**Low-dose Epinephrine 0.01 mg/kg IV q3-5 min** (cycle เว้น cycle) · vasopressor → DBP ↑',
                '**Atropine 0.04 mg/kg** ในกรณี vagal tone เด่น (vomit, GI obstruction) · ไม่ใช่ทุก case · 1 cycle เดียว (อยู่นาน)',
                '**Reversal**: Naloxone (opioid) · Flumazenil (benzo) · Atipamezole/Yohimbine (α2)',
                '**NaHCO₃** IV ถ้า CPA > 15 min · acidosis pH < 7.2 (ให้ได้เลยไม่ต้องรอ blood gas)',
                '**Lidocaine** (ในสุนัข) — refractory shockable rhythm',
                '**Amiodarone** (ในแมว) — VF refractory',
                'IV fluid ใช้ตอน flush ยา · ถ้า arrest จาก hypovolemia → bolus',
              ] },
            ] },
        ],
      },
      {
        heading: 'Rhythm interpretation',
        source: 'CPCR 1 hr.pdf + master p.30',
        body: [
          { table: {
            headers: ['Rhythm', 'Treatment'],
            rows: [
              ['**Asystole** (no electrical, no mechanical)', 'Epinephrine + CPR · ห้าม shock'],
              ['**PEA** (electrical OK, no mechanical · HR < 50)', 'Epinephrine + CPR · ห้าม shock'],
              ['**VF** (chaotic, no QRS)', '**Defibrillate 2-4 J/kg biphasic** + CPR + epi + lidocaine'],
              ['**Pulseless VT** (HR > 200, wide QRS, no pulse)', '**Defibrillate** + CPR + lidocaine/amiodarone'],
            ] } },
          { callout: 'Pre-shock: โกนขน + electrode gel · ห้ามใช้ alcohol (ติดไฟ) · พูด "CLEAR!" ทุกคนถอยก่อน shock', kind: 'warn' },
        ],
      },
      {
        heading: 'Post-cardiac arrest care',
        source: 'CPCR 1 hr.pdf + master p.30',
        body: [
          { bullets: [
            'Hemodynamic optimization — fluid + vasopressor + monitor BP',
            'Respiratory: maintain PaCO₂ 35-45, O₂ to keep SpO₂ ≥ 94%',
            'Neurologic: hypothermia (32-34°C 24-48h) — controversial in vet',
            'Treat underlying cause',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'acute-abdomen': {
    topic: 'acute-abdomen',
    title: 'Acute Abdomen',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '🩺',
    summary: 'ปวดท้องเฉียบพลัน · 8-step approach: recognize → triage → minimum DB → AFAST → primary tx → complete H&PE → secondary survey → categorize',
    sections: [
      {
        heading: 'Causes',
        source: 'Acute Abdomen 1 hr.pdf + master p.22',
        body: [
          { table: {
            headers: ['System', 'Conditions'],
            rows: [
              ['GI tract', 'GDV · gastroenteritis · obstruction · perforation · ulcer · neoplasia · intussusception · intestinal torsion'],
              ['Pancreas', '**Acute pancreatitis** (ทำให้เกิด SIRS)'],
              ['Hepatobiliary', 'Bile rupture/obstruction · biliary mucocele · hepatic abscess · liver lobe torsion'],
              ['Spleen', 'Splenic mass · neoplasia · thrombosis · torsion · hematoma'],
              ['Repro', 'Pyometra · uterine rupture/torsion · prostatic abscess · testicular torsion'],
              ['Urinary', 'Urolithiasis · UB rupture · cystitis · kidney issue · obstruction'],
              ['Peritoneal', 'Hemoperitoneum · uroperitoneum · bile peritonitis · septic peritonitis · pneumoperitoneum'],
            ] } },
        ],
      },
      {
        heading: 'Recognition + posture',
        source: 'Acute Abdomen 1 hr.pdf p.22',
        body: [
          { bullets: [
            '**Hunched back** — นอนหลังโก่ง คอตก หูตก',
            '**Prayer position** — ยกหลังเหมือนหมอบกราบ — pathognomonic',
            '**Guarding/splinting** — แตะแล้วขมิบหน้าท้อง',
            'Behavioral: ซึม ไม่อยากขยับ, อาเจียน, ครวญ',
            '⚠️ DDx: refer pain เช่น back pain (คล้าย abdominal pain)',
          ] },
        ],
      },
      {
        heading: 'AFAST 4-point scan',
        source: 'Acute Abdomen 1 hr.pdf p.22',
        body: [
          'นอน Right lateral · probe ฝั่งซ้าย · 4 จุด:',
          { table: {
            headers: ['Site', 'Visualize'],
            rows: [
              ['**DH** (diaphragmaticohepatic)', 'Diaphragm + liver'],
              ['**SR** (splenorenal)', 'Spleen + L kidney'],
              ['**CC** (cystocolic)', 'UB + colon'],
              ['**HR** (hepatorenal)', 'Liver + R kidney'],
            ] } },
          'Score แต่ละจุด: 0 (no fluid) · 1 (มี fluid เล็กน้อย) · 2-3 · 4 (เยอะมาก) — sum = AFS · sensitive แต่ specificity ต่ำ',
        ],
      },
      {
        heading: 'Fluid analysis (key!)',
        source: 'Acute Abdomen 1 hr.pdf p.23',
        body: [
          { table: {
            headers: ['Type', 'Diagnostic finding'],
            rows: [
              ['**Hemoabdomen**', 'Fluid PCV ≈ Blood PCV · ไม่ clot (factors used)'],
              ['**Uroabdomen**', 'Fluid Cr : Serum Cr **> 2 : 1** · K+ ratio: dog > 1.4, cat > 1.9'],
              ['**Septic peritonitis**', 'Degenerate neutrophil ± bacteria · **Fluid glucose < 50 mg/dL** OR fluid-blood glucose gap > 20'],
              ['**Bile peritonitis**', 'Bilirubin in fluid > 2 × serum'],
              ['**Food material**', 'GI perforation'],
              ['**Neoplastic cells**', 'Cytology — malignant cells (ระบุ type ยาก)'],
            ] } },
        ],
      },
      {
        heading: 'Categorization',
        source: 'Acute Abdomen 1 hr.pdf p.23',
        body: [
          { table: {
            headers: ['Category', 'Conditions'],
            rows: [
              ['**Non-surgical (medical)**', 'Acute pancreatitis · gastroenteritis without perforation'],
              ['**Emergent (urgent surgery)**', 'CV-stable hemoabdomen · GI obstruction without peritonitis · uroabdomen with placed catheter'],
              ['**Critical (immediate surgery)**', '**GDV** · mesenteric torsion · **septic peritonitis** · uncontrolled hemorrhage'],
            ] } },
        ],
      },
      {
        heading: 'Pain management',
        source: 'Acute Abdomen 1 hr.pdf p.23',
        body: [
          { bullets: [
            '**1st line: Opioids** — fentanyl, morphine, buprenorphine · safe ใน renal/hepatic',
            'Moderate-severe: loading dose opioid + titrate · ถ้าไม่พอ → MLK/FLK CRI (Morphine/Fentanyl + Lidocaine + Ketamine)',
            'Local: epidural, intra-pleural, acupuncture',
            '⚠️ NSAIDs **contraindicated** ใน acute abdomen (GI/renal/hepatic risk)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'resp-cv-er': {
    topic: 'resp-cv-er',
    title: 'Respiratory & Cardiovascular Emergency',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '🫁',
    summary: 'Resp pattern → localize: URT (inspiratory + stridor), LRT (expiratory + wheeze), pleural (paradoxical), parenchymal (rapid shallow). CV: arrhythmia, edema, tamponade.',
    sections: [
      {
        heading: 'Respiratory patterns',
        source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
        body: [
          { table: {
            headers: ['Pattern', 'Localize'],
            rows: [
              ['Inspiratory dyspnea + **stridor**', 'Upper airway (laryngeal paralysis, brachycephalic, foreign body)'],
              ['Expiratory dyspnea + **wheeze**', 'Lower airway (asthma, chronic bronchitis)'],
              ['**Paradoxical breathing** (chest in, abdomen out)', 'Pleural space disease (pneumothorax, effusion) OR fatigue'],
              ['Rapid + shallow', 'Parenchymal (pneumonia, edema, ARDS)'],
            ] } },
        ],
      },
      {
        heading: 'Pulmonary edema',
        source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
        body: [
          { sub: 'Cardiogenic (left-sided HF)',
            body: [
              { bullets: [
                'Pink frothy sputum · soft murmur · gallop rhythm · cardiomegaly',
                'Tx: **Furosemide 1-4 mg/kg IV bolus** · ทำซ้ำหรือ CRI · O₂ supplement · minimize stress',
                '⚠️ **ห้าม IV crystalloid** — ทำให้แย่ลง',
              ] },
            ] },
          { sub: 'Non-cardiogenic',
            body: [
              { bullets: [
                'Causes: electrocution · choking/upper airway obstruction · neuro (seizure)',
                'Tx: O₂ + ventilation + supportive · resolve ส่วนใหญ่ภายใน 24-48 hr',
              ] },
            ] },
        ],
      },
      {
        heading: 'Pleural space disease',
        source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
        body: [
          { sub: 'Tension pneumothorax — emergency!',
            body: [
              { bullets: [
                'Severe paradoxical breathing + tracheal deviation + ↓ lung sound',
                'Tx: **Thoracocentesis ASAP** (intercostal 7-9, dorsal 1/3) — ก่อน X-ray',
              ] },
            ] },
          { sub: 'Pleural effusion',
            body: [
              { bullets: [
                'Causes: CHF, pyothorax, hemothorax, chylothorax, neoplasia',
                'Tx: thoracocentesis + identify fluid type → cause-specific',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cardiac tamponade',
        source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
        body: [
          { bullets: [
            'Pericardial effusion compress heart → ลด cardiac filling',
            'Clinical: muffled heart sound · pulsus paradoxus · jugular distension · ascites · weak pulse',
            'Common cause: hemangiosarcoma (right atrial/auricular) · idiopathic · neoplasia',
            'Tx: **Pericardiocentesis ASAP** (right 5-6 IC, level of CCJ)',
          ] },
        ],
      },
      {
        heading: 'Common arrhythmias',
        source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
        body: [
          { table: {
            headers: ['Arrhythmia', 'First-line'],
            rows: [
              ['**Sustained / unstable VT**', '**Lidocaine 2 mg/kg IV bolus** (dog) · 0.25 mg/kg cat (ระวัง!) · CRI 25-75 μg/kg/min'],
              ['**Symptomatic bradycardia**', '**Atropine 0.04 mg/kg IV/IM**'],
              ['**SVT** (supraventricular tachy)', 'Vagal maneuver · Diltiazem 0.05-0.25 mg/kg slow IV'],
              ['**Atrial fibrillation**', 'Diltiazem (rate control)'],
              ['**3rd degree AV block**', 'Pacemaker (refractory to atropine)'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'er-anes': {
    topic: 'er-anes',
    title: 'Emergency Anesthesia',
    lecturer: 'Assoc.Prof. Sumit Durongphongtorn',
    icon: '😴',
    summary: 'Stabilize first · ห้าม α2-agonist + propofol ใน hypovolemic shock · เลือก: opioid + benzo + ketamine/etomidate · IPPV ETCO₂ 38-42 mmHg',
    sections: [
      {
        heading: 'Pre-anesthesia stabilization',
        source: 'Animal_Emerg_Anes 1 hr.pdf + master p.46',
        body: [
          { bullets: [
            'Stabilize ก่อน → BP > 90 mmHg · HR < 150 · PCV ≥ 20% · TS ≥ 4 g/dL',
            'Pain control + monitor + correct electrolyte/acid-base',
            'IPPV pre-O₂ก่อน induct',
          ] },
        ],
      },
      {
        heading: 'GDV anesthesia',
        source: 'Animal_Emerg_Anes 1 hr.pdf + master p.46',
        body: [
          { sub: 'Pre-op',
            body: [
              { bullets: [
                'Hypovolemic — aggressive fluid 50-60 ml/kg bolus + decompress (orogastric tube + trocar)',
                'Sedate: benzo + opioid (สอดท่อ + premed)',
                'Goal: HR < 150, SBP > 90 ก่อนวางยา',
              ] },
            ] },
          { sub: 'Operation',
            body: [
              { bullets: [
                'Premed: benzo + opioid',
                'Induction: benzo + ketamine · poor — fentanyl + midazolam ± low-dose ketamine',
                'หลีก propofol — affects CV',
                'Maintain: inhalant + fentanyl CRI (ลด MAC) · dopamine (BP) · lidocaine (V-arrhythmia)',
                'Post-op: ECG monitor (เสี่ยง arrhythmia)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Urethral obstruction (cat)',
        source: 'Animal_Emerg_Anes 1 hr.pdf + master p.46',
        body: [
          { bullets: [
            '**HyperK ก่อน sedation** — Ca gluconate stabilize myocardium · dextrose+insulin shift K · fluid',
            'Sedate: ketamine + benzo + buprenorphine',
            'Maintain: inhalation + IPPV (PaCO₂ 38-42) · ป้องกัน respiratory acidosis (จะเพิ่ม K)',
            '⚠️ NSAIDs contraindicated (renal compromise)',
          ] },
        ],
      },
      {
        heading: 'Dystocia (caesarean)',
        source: 'Animal_Emerg_Anes 1 hr.pdf + master p.46',
        body: [
          { bullets: [
            'PG สูง → prolong sedative effect · ใช้ยาน้อยลง',
            'Functional residual capacity ลด — preoxygenate + careful induction',
            'Premed: หลีก α2 (xylazine, dexmed) — depress fetus',
            'Induction: propofol / alfaxalone (ออกฤทธิ์เร็ว) · ketamine ถ้าออกนาน',
            'Maintain: inhalant + IPPV',
            '**ระวัง regurgitation + aspiration** (อุ้งกรอบ esophagus + pelvic press)',
            'Post: morphine epidural · opioid + NSAIDs (BW OK + MBP > 60)',
          ] },
        ],
      },
      {
        heading: 'Proptosis (head trauma)',
        source: 'Animal_Emerg_Anes 1 hr.pdf + master p.46',
        body: [
          { bullets: [
            'Premed: opioid + benzo + anticholinergic',
            'Induction: propofol smooth + rapid intubation',
            'Maintain: **IPPV ETCO₂ 40 mmHg** — ป้องกัน hypercapnea (cerebral vasodilation → ↑ ICP)',
            'Post: opioid + NSAIDs (ถ้า function OK)',
          ] },
        ],
      },
      {
        heading: 'Drug summary',
        source: 'Animal_Emerg_Anes 1 hr.pdf',
        body: [
          { table: {
            headers: ['Class', 'Drug', 'Use in ER'],
            rows: [
              ['Anticholinergic', 'Atropine, Glycopyrrolate', 'แก้ bradycardia · block parasym'],
              ['Opioid', 'Morphine, Fentanyl, Pethidine', 'Premed + analgesia · safe in shock'],
              ['α2-agonist', 'Xylazine, Dexmedetomidine', '⚠️ ห้ามใน shock / heart dz / pregnancy'],
              ['Benzodiazepine', 'Diazepam, Midazolam', 'Sedation + muscle relax · ใช้คู่ opioid'],
              ['Acepromazine', '—', '⚠️ ห้าม shock / hypotensive / anemic (vasodilate)'],
              ['Ketamine', '—', 'Dissociative — เพิ่ม BP/HR · ใช้ใน shock ได้'],
              ['Propofol', '—', '⚠️ Vasodilate — ใช้ low dose · ไม่ใช่ใน hypovolemia'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'metabolic-er': {
    topic: 'metabolic-er',
    title: 'Metabolic / Endocrine / UT Emergency',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '💊',
    summary: 'DKA: rehydrate + correct K → CRI insulin · Addisonian: hyperK + hypoNa · Urethral obstruct: stabilize K ก่อน sedate · AKI: avoid NSAIDs/aminoglycoside.',
    sections: [
      {
        heading: 'Diabetic Ketoacidosis (DKA)',
        source: 'metabolic and endocrine and UT 1 hr.pdf + master p.33',
        body: [
          { sub: 'Pathophysiology',
            body: [
              { bullets: [
                'Severe DM → fat catabolism → **ketones** (acetoacetic, β-hydroxybutyrate, acetone)',
                'Glucosuria → super-diuresis → polyuria + dehydration',
                'Acidosis (ketoacidosis + lactic) · hyperviscosity',
              ] },
            ] },
          { sub: 'Common predisposing — 2 โรคคู่',
            body: [
              { bullets: [
                'Dog: **Pancreatitis · UTI · Cushing**',
                'Cat: **Pancreatitis · CKD · neoplasia · infection**',
              ] },
            ] },
          { sub: 'Lab',
            body: [
              { bullets: [
                'Hyperglycemia + glucosuria + ketonuria + ketonemia',
                'Metabolic acidosis · hypoK (จาก polyuria) หรือ pseudo-hyperK (acidosis shift)',
                'Pre-renal azotemia · hypophosphatemia',
              ] },
            ] },
          { sub: 'Treatment order ⚠️ (สำคัญ!)',
            body: [
              { bullets: [
                '1. **Rehydrate ก่อน** — NSS IV bolus 4 hr · perfusion ↑ → carry insulin',
                '2. **Replace K**ก่อน insulin — insulin shifts K into cell → fatal hypoK',
                '3. **Insulin CRI** — Regular insulin · dog 2.2 U/kg/d · cat 1.1 U/kg/d · IM ก็ได้ · **ห้าม SC**',
                '4. Coating: ทิ้ง insulin 50 ml ของ tube (ติด plastic)',
                '5. Monitor: glucose q1-2h · UOP q2-4h · K/Na/P q4-24h · neuro q12-24h',
              ] },
            ] },
          { callout: '⚠️ Cerebral edema — แก้ glucose เร็วเกิน → idiogenic osmoles → fluid เข้า cell สมอง · ลด glucose ช้าๆ', kind: 'warn' },
          { callout: '⚠️ Hypophosphatemia — phosphate ต่ำมาก → hemolysis (RBC ขาด ATP) · monitor และ replace', kind: 'warn' },
        ],
      },
      {
        heading: 'Addisonian crisis (Hypoadrenocorticism)',
        source: 'master p.33',
        body: [
          { sub: 'Pathophysiology',
            body: [
              { bullets: [
                'Glucocorticoid deficiency → glucose ลด · catecholamine impair · vasodilate · hypotension',
                'Mineralocorticoid deficiency → Na+ ↓, K+ ↑, Cl- ↓',
                '**K+ > 7** → bradycardia, no P wave, prolonged QRS',
                '**Na+ < 132** → hypovolemic shock + cerebral edema',
              ] },
            ] },
          { sub: 'Lab — classic',
            body: [
              { bullets: [
                'HypoNa + hyperK + hypoCl · **Na : K ratio < 25** (suspect, < 20 strong)',
                'Hypoglycemia · prerenal azotemia · metabolic acidosis · mild anemia',
              ] },
            ] },
          { sub: 'Confirm',
            body: [
              { bullets: [
                '**ACTH stimulation test**: baseline cortisol + ACTH 5 μg/kg IV → cortisol ที่ 1 hr',
                'Normal: cortisol stim ≥ 7-15 μg/dL · Addison: < 2 μg/dL no rise',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                'IV NSS — correct hypovolemic shock (severe — bolus)',
                'Hyponatremia correction **ช้าๆ** — Na↑ < 0.5 mEq/L/hr (กัน pontine myelinolysis)',
                'HyperK: Ca gluconate 0.5-1 ml/kg slow IV (cardiac) · dextrose+insulin shift K · NaHCO₃',
                '**Dexamethasone IV** — ไม่ interfere ACTH test',
                'Maintain: prednisolone PO + fludrocortisone acetate (mineralocorticoid)',
              ] },
            ] },
        ],
      },
      {
        heading: 'Urethral obstruction',
        source: 'master p.34',
        body: [
          { bullets: [
            'พบบ่อย: dog (urolithiasis) · cat (FLUTD)',
            'Pathophys: GFR ↓ → uremic + hyperK + acidosis',
            'Clinical: stranguria · vocalization · hyperK arrhythmia',
            { label: 'Stabilize order', value: '1. Cystocentesis (decompress) → 2. IV fluid (NSS) → 3. Correct hyperK (Ca gluconate, dextrose+insulin) → 4. Sedate + catheterize' },
            'Post-obstructive **diuresis** — UOP เพิ่มมาก ต้องให้ fluid ตาม',
          ] },
        ],
      },
      {
        heading: 'Acute Kidney Injury (AKI)',
        source: 'master p.34',
        body: [
          { sub: 'Causes',
            body: [
              { bullets: [
                '**Pre-renal**: dehydration, shock, sepsis',
                '**Intrinsic**: NSAIDs · aminoglycoside · ethylene glycol (antifreeze) · raisin/lily (cat) · leptospirosis',
                '**Post-renal**: urethral obstruction · UB rupture · ureteroliths',
              ] },
            ] },
          { sub: '3 phases',
            body: [
              { bullets: [
                'Induction → maintenance → recovery',
                'Maintenance: GFR คงที่ — risk fluid overload',
              ] },
            ] },
          { sub: 'Treatment',
            body: [
              { bullets: [
                'Fluid therapy (avoid overload — monitor body weight + UOP)',
                'NaHCO₃ if metabolic acidosis · electrolyte correction',
                'Diuretics: Mannitol 0.5 g/kg IV · Furosemide CRI',
                'Vasodilator: low-dose dopamine (controversial)',
                'Antiemetic + H2-blocker + PPI + sucralfate',
                'Refractory: peritoneal dialysis or hemodialysis',
                '⚠️ **ห้าม NSAIDs · aminoglycosides** (gentamicin) — nephrotoxic',
              ] },
            ] },
        ],
      },
      {
        heading: 'UOP guidelines',
        source: 'master p.34',
        body: [
          { table: {
            headers: ['Status', 'UOP'],
            rows: [
              ['Normal', '1-2 ml/kg/hr'],
              ['On IV fluid', '2-5 ml/kg/hr'],
              ['Oliguria', '0.25-0.5 ml/kg/hr'],
              ['Anuria', '< 0.25 ml/kg/hr'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  nutrition: {
    topic: 'nutrition',
    title: 'Nutrition in Critical Illness',
    lecturer: 'Aj. Chutirat Torsahakul',
    icon: '🥣',
    summary: 'RER = 30(BW) + 70 (3-25 kg) · Stress starvation: hypermetabolic, protein catabolism · Enteral > parenteral · Tube selection ตามตำแหน่ง',
    sections: [
      {
        heading: 'Why nutrition matters',
        source: 'nutrition 1 hr.pdf + master p.36',
        body: [
          { bullets: [
            'Acute malnutrition → immune ↓ → sepsis · cell function ↓ · organ failure',
            'Cat → **hepatic lipidosis** (ตับสะสมไขมัน) ภายใน 24-48 hr ของไม่กิน',
            'Goal: prevent further breakdown + support recovery',
          ] },
        ],
      },
      {
        heading: 'Simple vs Stress starvation',
        source: 'nutrition 1 hr.pdf + master p.36',
        body: [
          { table: {
            headers: ['', 'Simple starvation', 'Stress starvation'],
            rows: [
              ['Metabolism', 'Hypometabolic', '**Hypermetabolic**'],
              ['Hormones', 'Insulin ↓, glucagon ↑', 'Cortisol ↑, catecholamines ↑, cytokines'],
              ['Energy source', 'Fat (glycogen first 24h, then fat-derived ketones)', 'Protein catabolism เร่ง · fat dependent · insulin resistance'],
              ['Protein', 'Spared (2 amino acids ดึงสุดท้าย)', 'Massive breakdown — muscle wasting'],
              ['Examples', 'Healthy fasting', 'Sepsis · trauma · burn · pancreatitis'],
            ] } },
        ],
      },
      {
        heading: 'When to start feeding',
        source: 'nutrition 1 hr.pdf + master p.36',
        body: [
          { bullets: [
            '**Within 24-48 hr** หลัง stabilize',
            'Body condition score < 4/9 · weight loss > 10% · NPO > 3 days',
            'Open wound · burn · sepsis · pancreatitis · IBD',
            'GI absorb impaired? → parenteral',
          ] },
        ],
      },
      {
        heading: 'RER calculation',
        source: 'nutrition 1 hr.pdf + master p.37',
        body: [
          { sub: 'Formulas',
            body: [
              { bullets: [
                'BW 3-25 kg: **RER = 30 × BW(kg) + 70**',
                'BW < 3 kg or > 25 kg: RER = 70 × BW^0.75',
                'Goal in critical: **start at RER, not MER** (illness factor 1.0-1.3 is controversial — start low to avoid refeeding)',
              ] },
            ] },
          { sub: 'Example',
            body: [
              { bullets: [
                'แมว 6 kg: RER = (30×6) + 70 = **250 kcal/day**',
                'อาหาร 128 kcal/156 g → 250÷128 × 156 = **305 g/day**',
              ] },
            ] },
        ],
      },
      {
        heading: 'Feeding tubes — selection',
        source: 'nutrition 1 hr.pdf + master p.37',
        body: [
          { table: {
            headers: ['Tube', 'Indication', 'Note'],
            rows: [
              ['**NE/NG** (naso-esoph/gastric)', 'Short-term · gag reflex ปกติ', 'Liquid food · ระวัง rhinitis · Confirm placement: X-ray, lidocain test'],
              ['**E-tube** (esophagostomy)', 'Long-term (wks-months)', 'Distal end: 8th-9th rib · กรณี ESO mass ขึ้น → ห้ามใช้'],
              ['**G-tube** (gastrostomy)', 'Esophageal disease · long-term', 'Surgical / endoscopic / blind · 24h rest หลังวาง'],
              ['**J-tube** (jejunostomy)', 'Pancreatitis · gastric stasis · diffuse gastric mucosal disease', 'Bypass stomach · 24h rest · CRI feeding'],
            ] } },
        ],
      },
      {
        heading: 'Feeding protocol',
        source: 'nutrition 1 hr.pdf + master p.37',
        body: [
          { bullets: [
            'หลังวางสาย: **24 hr rest** (no food)',
            'D1: **1/3 RER** divided 4-6 meals',
            'D2: **2/3 RER**',
            'D3: **full RER**',
            'Slow bolus < 5 ml/min → ระวัง vomiting',
            'Flush ก่อน-หลัง 5 ml water',
          ] },
          { sub: 'Complications',
            body: [
              { bullets: [
                'Vomiting/regurgitation — slow rate, antiemetic',
                'Diarrhea — fiber + osmolarity adjust',
                '**Aspiration pneumonia** — head elevated 30°',
                'Tube problems: occlude, leak, displace',
                '**Refeeding syndrome** — hypoP/K/Mg → cardiac/respiratory failure',
              ] },
            ] },
        ],
      },
      {
        heading: 'Parenteral nutrition (PN)',
        source: 'nutrition 1 hr.pdf + master p.37',
        body: [
          { bullets: [
            'Indication: GI dysfunction · pancreatitis · severe vomit · coma',
            '**TPN** = full RER, **hyperosmolar** → **central vein (jugular)** เท่านั้น (ป้องกัน thrombophlebitis)',
            '**PPN** = partial (50-70% RER), diluted → **peripheral vein** ได้',
            'Components: dextrose 50% + amino acid 8.5-10% + lipid 20% + electrolyte + vitamin',
            'Aseptic prep · 24-h shelf life at room temp',
          ] },
          { callout: 'Risks: hyperglycemia · hyperlipidemia · infection · refeeding syndrome (hypoP) · villous atrophy', kind: 'warn' },
        ],
      },
      {
        heading: 'Essential amino acids in cats',
        source: 'master p.36',
        body: [
          { table: {
            headers: ['Amino acid', 'Why essential', 'Deficiency'],
            rows: [
              ['**Arginine**', 'Urea cycle', 'Hyperammonemia → neuro signs (cat ไม่กิน 1 มื้อ → toxic)'],
              ['**Taurine**', 'Bile salt + retina + heart', 'DCM · retinal degeneration'],
              ['**Glutamine**', 'Enterocyte fuel', 'GI mucosa atrophy in hypermet · enteral preserves better'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'neuro-exam': {
    topic: 'neuro-exam',
    title: 'Neurological Examination + Localization',
    lecturer: 'Aj. Krissda Boonaramrueng',
    icon: '🔍',
    summary: 'Goals: confirm + localize + pathology + severity. Hand-off (mentation, posture, gait) → Hand-on (postural, CN, reflex, palpation, pain). UMN = hyper · LMN = hypo.',
    sections: [
      {
        heading: 'Goals + workflow',
        source: 'neuro_exam 1 hr.pdf p.1-2',
        body: [
          { bullets: [
            'Confirm sign จาก nervous system lesion?',
            'Localize lesion location',
            'Determine pathologic process',
            'Estimate severity → prognosis',
          ] },
          'Approach: history + signalment + chief complaint + general PE → neuro exam',
        ],
      },
      {
        heading: 'Hand-off examination',
        source: 'neuro_exam 1 hr.pdf p.3-10',
        body: [
          { sub: '1. Mentation / Behavior',
            body: [
              { bullets: [
                '**ARAS** (ascending reticular activating system) ใน brainstem + cerebral cortex',
                { label: 'Levels', value: 'Alert → Obtunded → Stuporous (ตอบ pain ไม่ตอบเสียง) → Comatose (ไม่ตอบอะไรเลย)' },
                'Behavior change → **limbic system** (forebrain): aggression · disorientation · compulsive walking · head pressing',
              ] },
            ] },
          { sub: '2. Attitude / Posture',
            body: [
              { bullets: [
                'Head tilt → **vestibular dysfunction**',
                'Head turn → **forebrain lesion**',
              ] },
              { table: {
                headers: ['Posture', 'Lesion', 'LOC'],
                rows: [
                  ['**Schiff-Sherrington** (FL ext + HL paralysis)', 'Thoraco-lumbar SC', 'Normal'],
                  ['**Decerebellate rigidity** (FL ext + hip flex)', 'Cerebellum', 'Normal'],
                  ['**Decerebrate rigidity** (all limbs ext)', 'Brainstem (rostral)', 'Decreased'],
                  ['Opisthotonos', 'Cerebellum / brainstem / forebrain', 'Variable'],
                ],
              } },
            ] },
          { sub: '3. Gait',
            body: [
              { bullets: [
                'Normal gait needs: brainstem + cerebellum + SC + sensory/motor PN + NMJ + muscle',
                { label: 'Ataxia (incoordination)', value: 'Proprioceptive (symmetric, knuckling — SC) · Vestibular (asymmetric, drift one side — VIII/brainstem/inner ear) · Cerebellar (symmetric, hypermetria, "bouncy" — cerebellum)' },
                { label: 'Paresis/Plegia', value: 'mono- · hemi- · para- (2 hindlimbs) · tetra- (4 limbs)' },
                'Other movements: circling · tremor · myotonia · myoclonus',
              ] },
            ] },
        ],
      },
      {
        heading: 'Hand-on examination',
        source: 'neuro_exam 1 hr.pdf p.11-30',
        body: [
          { sub: '1. Postural reactions',
            body: [
              { bullets: [
                'Proprioception (knuckling), hopping, hemi-walking, wheelbarrow, extensor postural thrust',
                'Most sensitive test for **subtle** spinal/cortical lesion',
              ] },
            ] },
          { sub: '2. Cranial nerve exam',
            body: [
              { table: {
                headers: ['CN', 'Test', 'Lesion site'],
                rows: [
                  ['I (olfactory)', 'Sniff test', 'Forebrain'],
                  ['II (optic)', 'Vision (menace, cotton ball drop) · PLR (afferent)', 'Forebrain (vision) · midbrain (PLR)'],
                  ['III (oculomotor)', 'PLR (efferent) · medial deviation', 'Midbrain'],
                  ['V (trigeminal)', 'Sensory: touch face · jaw tone · corneal · palpebral', 'Pons / brainstem'],
                  ['VII (facial)', 'Lip droop · ear droop · blink (palpebral efferent)', 'Brainstem (caudal)'],
                  ['VIII (vestibulocochlear)', 'Head tilt · nystagmus · oculocephalic', 'Brainstem / inner ear'],
                  ['IX, X (gloss + vagus)', 'Gag reflex', 'Brainstem'],
                  ['XII (hypoglossal)', 'Tongue', 'Brainstem'],
                ],
              } },
              'ตัวย่อ "menace": **menace = II afferent → forebrain → VII efferent (blink)** · cerebellar lesion → menace deficit แม้ vision ปกติ',
            ] },
          { sub: '3. Spinal reflexes',
            body: [
              { bullets: [
                '**Patellar reflex**: femoral n. (L4-L6) — UMN intact = normal/hyper · LMN damaged = hypo/absent',
                '**Withdrawal**: sciatic (L6-S2) HL · radial/median/ulnar (C6-T2) FL — check distal reflex arc',
                '**Crossed extensor**: ขาตรงข้ามเหยียดออก = **abnormal** (UMN lesion above lumbar)',
                '**Cutaneous trunci** (panniculus): cut-off เป็น marker ของ thoracolumbar lesion · ปกติ T2-L4 cranial migration',
                '**Anal tone**: pudendal n. — bladder/anal function · spinal shock (24h) ก็หายชั่วคราว',
              ] },
            ] },
          { sub: '4. Pain perception',
            body: [
              { bullets: [
                '**Superficial pain** — pinch skin (response: vocalize, withdraw, look)',
                '**Deep pain** — pinch periosteum/digit (last to lose) · loss = **prognosis poor** for severe SC injury',
                'Conscious recognition (look, vocalize) ≠ reflex withdrawal',
              ] },
            ] },
        ],
      },
      {
        heading: 'UMN vs LMN',
        source: 'neuro_exam 1 hr.pdf + master',
        body: [
          { table: {
            headers: ['Sign', 'UMN', 'LMN'],
            rows: [
              ['Strength', 'Weak', 'Weak'],
              ['Spinal reflex', '**Normal / Hyper** (loss of inhibition)', '**Hypo / Absent** (reflex arc damaged)'],
              ['Muscle tone', 'Increased', '**Decreased / flaccid**'],
              ['Muscle atrophy', 'Late + mild', '**Early + severe (disuse + denervation)**'],
              ['Crossed extensor', '+', '−'],
            ] } },
        ],
      },
      {
        heading: 'Spinal localization',
        source: 'neuro_localised 1 hr.pdf + master',
        body: [
          { table: {
            headers: ['Segment', 'FL', 'HL'],
            rows: [
              ['**C1-C5**', 'UMN', 'UMN'],
              ['**C6-T2** (cervicothoracic intumescence)', '**LMN**', 'UMN'],
              ['**T3-L3**', 'Normal', 'UMN'],
              ['**L4-S3** (lumbosacral intumescence)', 'Normal', '**LMN**'],
            ] } },
          'Intumescence = ที่ที่มี LMN cell body ออกไปสู่ขา · FL ใช้ C6-T2 · HL ใช้ L4-S3',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'ataxia-tremor': {
    topic: 'ataxia-tremor',
    title: 'Ataxia, Tremor & Vestibular',
    lecturer: 'Aj. Krissda Boonaramrueng',
    icon: '🌀',
    summary: 'Vestibular: peripheral (horizontal/rotary fixed, MS ปกติ) vs central (vertical or direction-changing, MS ↓). Cerebellar tremor = intention. Geriatric vestibular self-resolve.',
    sections: [
      {
        heading: 'Head tilt & nystagmus',
        source: 'master p.7-8',
        body: [
          { bullets: [
            '**Head tilt**: หูข้างหนึ่งต่ำกว่าอีกข้าง · ตาฝั่งเอียงต่ำกว่า · vestibular dysfunction (peripheral or central)',
            '**Nystagmus** — eye oscillation: fast phase + slow phase',
            'Direction: horizontal · vertical · rotary',
          ] },
        ],
      },
      {
        heading: 'Peripheral vs Central vestibular',
        source: 'neuro_ataxia_tremor 1 hr.pdf + master p.8',
        body: [
          { table: {
            headers: ['Feature', 'Peripheral', 'Central'],
            rows: [
              ['Mentation', 'Normal', '**Decreased**'],
              ['Postural reactions', 'Normal', '**Deficits**'],
              ['Nystagmus', 'Horizontal / rotary, **fixed direction**', '**Vertical** OR direction-changing'],
              ['CN deficit', 'CN VII (close to VIII)', 'Multiple CN'],
              ['Head tilt', 'Toward lesion', 'Toward or away (paradoxical)'],
              ['Common causes', 'Otitis interna · idiopathic · ototoxic drug', 'Brainstem tumor · stroke · GME · trauma'],
            ] } },
        ],
      },
      {
        heading: 'Idiopathic (geriatric) vestibular syndrome',
        source: 'neuro_ataxia_tremor 1 hr.pdf + master',
        body: [
          { bullets: [
            'Old dog · sudden onset peripheral vestibular signs',
            'LOC ปกติ · postural reaction OK · CN deficit แค่ VII',
            'Dx: rule out central + otitis · MRI not always needed',
            'Tx: supportive (anti-vertigo: meclizine, prochlorperazine) · IV fluid · soft food',
            '**Self-resolve 1-2 weeks** · head tilt อาจคงอยู่บางส่วน',
          ] },
        ],
      },
      {
        heading: 'Tremor classification',
        source: 'neuro_ataxia_tremor 1 hr.pdf',
        body: [
          { table: {
            headers: ['Type', 'Trigger', 'Localize'],
            rows: [
              ['**Resting tremor**', 'At rest', 'Basal ganglia · drug (steroid) · electrolyte'],
              ['**Intention tremor**', 'During purposeful movement', '**Cerebellum** · cerebellar disease'],
              ['**Postural tremor**', 'Maintaining posture', 'Variable'],
              ['**Idiopathic head tremor (IHT)**', 'Episodic · "yes/no" head movement · conscious', 'French Bulldog, Boxer, Doberman · self-resolve'],
              ['**White Shaker syndrome**', 'Whole body fine tremor, ลูกสุนัขขาวเล็ก', 'Cerebellitis · steroid responsive'],
              ['**Steroid-responsive tremor**', 'After steroid', 'Cerebellitis · responds prednisolone'],
            ] } },
        ],
      },
      {
        heading: 'Cerebellar disease — features',
        source: 'neuro_ataxia_tremor 1 hr.pdf + master',
        body: [
          { bullets: [
            '**Hypermetria** — overshoot ขณะเดิน/ก้าวขา ("goose-stepping")',
            '**Truncal ataxia** — สวิงตัว ทรงตัวไม่ดี',
            '**Intention tremor** — เห็นชัดตอนกินน้ำ',
            '**Menace deficit** — ไม่ blink to threat แม้ vision ปกติ (cerebellum ทำหน้าที่ในนี้)',
            'Wide-based stance · symmetric · NO weakness',
          ] },
          { sub: 'Common cerebellar diseases',
            body: [
              { bullets: [
                'Cerebellar hypoplasia (kitten — in utero parvovirus)',
                'Cerebellar abiotrophy (genetic — Kerry Blue, Gordon Setter)',
                'Inflammation (GME, MUE)',
                'Neoplasia · trauma · stroke',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  seizure: {
    topic: 'seizure',
    title: 'Seizure & Narcolepsy',
    lecturer: 'Aj. Krissda Boonaramrueng',
    icon: '⚡',
    summary: 'Generalized vs focal · Status > 5 min OR ≥2 in 24h no recovery · 1st line dog: phenobarb + levetiracetam · Emergency: diazepam IV/rectal',
    sections: [
      {
        heading: 'Definitions',
        source: 'seizure 1 hr.pdf + IVETF 2015',
        body: [
          { bullets: [
            '**Seizure** = sudden, transient, abnormal neuronal activity',
            '**Epileptic seizure** = self-limiting hypersynchronous neuronal activity in brain',
            '**Epilepsy** = ≥ 2 unprovoked epileptic seizures > 24h apart',
            '**Reactive seizure** = secondary to extra-cranial cause (toxin, hypoglycemia, etc.)',
          ] },
        ],
      },
      {
        heading: 'Phases of seizure',
        source: 'seizure 1 hr.pdf + master p.10',
        body: [
          { table: {
            headers: ['Phase', 'Duration', 'Description'],
            rows: [
              ['**Prodromal**', 'Hours-days', 'Behavior change ก่อนชัก'],
              ['**Pre-ictal / aura**', 'Sec-min', 'Anxiety · vocalization · hide · ขนลุก'],
              ['**Ictal**', 'Sec-min', 'During seizure activity'],
              ['**Post-ictal**', 'Min-hr', 'Confusion · blindness · ataxia (transient)'],
            ] } },
        ],
      },
      {
        heading: 'Classification (IVETF 2015)',
        source: 'seizure 1 hr.pdf + IVETF',
        body: [
          { sub: 'Generalized',
            body: [
              { bullets: [
                'Tonic · clonic · tonic-clonic (most common in dog)',
                'Atonic · myoclonic · absence (rare)',
                'Loss of consciousness',
              ] },
            ] },
          { sub: 'Focal',
            body: [
              { bullets: [
                'Motor (twitching face/limb) · autonomic (drool, vomit) · sensory (fly-biting) · psychological (fear, hide)',
                'Consciousness retained or impaired',
                'อาจ secondarily generalize',
              ] },
            ] },
        ],
      },
      {
        heading: 'Cluster vs Status',
        source: 'seizure 1 hr.pdf + ACVIM consensus',
        body: [
          { bullets: [
            '**Cluster seizure** = ≥ 2 seizures in 24 hr, **recover between** episodes',
            '**Status epilepticus** = > 5 min single OR ≥ 2 seizures **without complete recovery between**',
            'Both = emergency',
          ] },
        ],
      },
      {
        heading: 'Approach: when to start AED?',
        source: 'seizure 1 hr.pdf + ACVIM',
        body: [
          { bullets: [
            '≥ 2 seizures in 6 months',
            'Cluster หรือ status',
            'Severe post-ictal sign',
            'Identified structural cause',
            'Owner concerned about safety',
          ] },
        ],
      },
      {
        heading: 'AED — first line',
        source: 'seizure 1 hr.pdf + ACVIM consensus',
        body: [
          { sub: 'Dog',
            body: [
              { table: {
                headers: ['Drug', 'Mechanism / use'],
                rows: [
                  ['**Phenobarbital**', 'GABA-A potentiate · 1st line · monitor PB level + liver q6mo'],
                  ['**Imepitoin (Pexion)**', 'Partial GABA-A · daily · less monitoring · alternative 1st line'],
                  ['**Levetiracetam (Keppra)**', 'SV2A modulator · safe · use with PB or solo · pulse for cluster'],
                  ['**KBr (potassium bromide)**', 'Add-on · slow loading · diet impact · contraindicated in cat'],
                  ['Zonisamide', 'Multiple mechanisms · alternative'],
                ],
              } },
            ] },
          { sub: 'Cat',
            body: [
              { bullets: [
                '**Phenobarbital** = 1st line · ⚠️ facial pruritus + lymphadenopathy + bone marrow suppression',
                '**Levetiracetam** — safe alternative',
                '⚠️ KBr **ห้าม**ในแมว — bronchitis fatal',
              ] },
            ] },
        ],
      },
      {
        heading: 'Status epilepticus — emergency Tx',
        source: 'seizure 1 hr.pdf + master p.11',
        body: [
          { sub: 'Step 1: Stop seizure',
            body: [
              { bullets: [
                'IV access ASAP',
                '**Diazepam 0.5 mg/kg IV bolus** (or 1-2 mg/kg per rectum if no IV)',
                'Repeat q5-10 min × 2 ถ้าไม่หยุด',
              ] },
            ] },
          { sub: 'Step 2: Refractory',
            body: [
              { bullets: [
                '**Midazolam CRI** 0.1-0.4 mg/kg/hr',
                '**Levetiracetam loading 60 mg/kg IV**',
                '**Phenobarb loading 16-20 mg/kg IV** divided',
                '**Propofol CRI** 0.1-0.6 mg/kg/min (intubate + ventilate)',
              ] },
            ] },
          { sub: 'Step 3: Supportive',
            body: [
              { bullets: [
                'Airway protection · O₂',
                'Glucose check + IV dextrose ถ้า hypoglycemic',
                'Cooling — temperature controlled (severe hyperthermia)',
                'Mannitol 0.5 g/kg IV ถ้าสงสัย cerebral edema',
              ] },
            ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  spinal: {
    topic: 'spinal',
    title: 'Spinal Disorder & Injuries',
    lecturer: 'Aj. Kumpanart Soontornvipart',
    icon: '🦴',
    summary: 'IVDD type I (acute, chondrodystrophoid) vs II (chronic, large breed) · Wobbler (large), AAI (toy) · DPP critical for prognosis · Hemilaminectomy T-L, SLOT cervical',
    sections: [
      {
        heading: 'Terminology',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { bullets: [
            '**Plegia** = อัมพาต (loss of motor)',
            '**Paresis** = อ่อนแรง (partial)',
            'Mono · Hemi · **Para** (2 hindlimbs) · **Tetra** (4 limbs)',
            'Spinal exam: เพื่อ (1) ระบุตำแหน่ง lesion (2) ประเมิน severity → prognosis',
          ] },
        ],
      },
      {
        heading: 'Hansen Type I IVDD',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { bullets: [
            '**Acute / sudden onset** — annulus fibrosus ฉีกขาดหมด → NP ทะลักเข้า canal',
            '**Chondrodystrophoid breeds**: Dachshund, Pekingese, French Bulldog, Beagle, Basset Hound, American Cocker Spaniel, Shih Tzu, Lhasa Apso',
            'Most common location: **T12-L2** หรือ **C2-3**',
            'Treatment: medical (mild) · surgical decompression (Sx — moderate-severe)',
          ] },
        ],
      },
      {
        heading: 'Hansen Type II IVDD',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { bullets: [
            '**Gradual / chronic** — annulus ฉีกบางส่วน · disc protrusion ค่อยๆ',
            '**Non-chondrodystrophoid breeds** — large/medium breeds (Lab, GSD)',
            'Slower progression — months to years',
          ] },
        ],
      },
      {
        heading: 'Other spinal disorders',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { table: {
            headers: ['Disease', 'Breed / feature', 'Key sign'],
            rows: [
              ['**Wobbler\'s syndrome** (caudal cervical spondylopathy)', 'Large breed, fast growth (Great Dane, Doberman, GSD)', 'UMN HL + LMN FL · gait incoord · Dx: MRI'],
              ['**Atlantoaxial instability (AAI)**', 'Toy breed (Chihuahua, Yorkie, Pomeranian)', 'C1-C2 unstable · UMN 4 limbs · ⚠️ medulla → respiratory failure'],
              ['**Cauda equina syndrome / DLSS**', 'Large breed (GSD)', 'L6,7-S1 compression · pseudo-hyperreflexia (patella hyper, sciatic hypo)'],
              ['**Spondylosis deformans**', '—', 'X-ray finding · degenerative · NOT compress SC · single sign: arched back'],
              ['**Discospondylitis**', 'Bacterial / fungal', 'Disc + endplate infection · check sepsis (GI, liver)'],
              ['**Spondylitis**', 'Vertebral body infection', 'Osteomyelitis of spine'],
              ['**ANNPE** (acute non-compressive nucleus pulposus extrusion)', 'Active dog (running)', 'Acute focal myelopathy · MRI shows bruise, no compression'],
              ['**FCE** (fibrocartilaginous embolism)', 'Active dog', 'Sudden non-progressive · lateralized · supportive care'],
            ] } },
        ],
      },
      {
        heading: 'Vertebral fracture',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { bullets: [
            '90% = **compression fracture**',
            '3-compartment theory (dorsal, body, ventral) — ventral most important to stabilize',
            { label: 'Critical assessment', value: '**Deep pain perception (DPP)**' },
            'มี DPP = prognosis ดี · ไม่มี DPP = อาจ spinal shock — รอ 24 ชม. ประเมินซ้ำ',
            '**ถ้ายังไม่มี DPP หลัง 24 ชม. = SC severance — ไม่ผ่าตัด** (poor prognosis)',
          ] },
        ],
      },
      {
        heading: 'Decompressive surgery techniques',
        source: 'Spinal disorder 2 hr.pdf + master p.6',
        body: [
          { table: {
            headers: ['Technique', 'Indication'],
            rows: [
              ['**Hemilaminectomy**', 'IVDD type I T-L · ตัดด้านข้างของ lamina · ทำได้ยาวสุด **3 vertebrae**'],
              ['**Dorsal laminectomy**', 'Lumbosacral or multiple segments T-L'],
              ['**Ventral SLOT decompression**', 'Cervical IVDD · Wobbler · ผ่าน ventral · ทำได้ครึ่งอันหน้า + ครึ่งอันหลัง'],
              ['**Mini-hemilaminectomy / pediculectomy**', 'Smaller window · less destabilizing'],
            ] } },
          { callout: 'Surgery decompresses BUT prognosis depends on initial severity + DPP', kind: 'tip' },
        ],
      },
      {
        heading: 'Modified Frankel scale / Grade',
        source: 'master p.5',
        body: [
          { table: {
            headers: ['Grade', 'Description', 'Prognosis (with Sx)'],
            rows: [
              ['1', 'Pain only, ambulatory', 'Excellent'],
              ['2', 'Ambulatory paresis', 'Excellent'],
              ['3', 'Non-ambulatory paresis', 'Good'],
              ['4', 'Plegia, **DPP intact**', 'Good'],
              ['5', 'Plegia, **NO DPP** < 48 hr', 'Guarded (50%)'],
              ['5+ no DPP > 48 hr', '—', '**Grave**'],
            ] } },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'neuro-er': {
    topic: 'neuro-er',
    title: 'Neurological Emergency',
    lecturer: 'Aj. Krissda Boonaramrueng',
    icon: '🧠',
    summary: 'Acute SC injury · Head trauma · Status epilepticus · MGCS scoring · Mannitol (not steroid) for ICP · Cushing reflex = late warning',
    sections: [
      {
        heading: 'Common emergencies',
        source: 'neuroER 1 hr.pdf + master p.12',
        body: [
          { bullets: [
            'Acute spinal cord injury',
            'Head trauma (TBI)',
            'Status epilepticus + cluster seizure',
            'Acute vestibular crisis',
            'Tetanus, botulism (NMJ)',
            'Brain herniation',
          ] },
        ],
      },
      {
        heading: 'Head trauma — assessment',
        source: 'neuroER 1 hr.pdf + master p.13',
        body: [
          { sub: 'Modified Glasgow Coma Scale (MGCS)',
            body: [
              { bullets: [
                '3 categories: motor activity + brainstem reflex + LOC · each 1-6',
                'Total 3-18',
                { label: 'Score range → prognosis', value: '**3-8 grave** · 9-14 guarded · 15-18 good' },
              ] },
            ] },
          { sub: 'Cushing reflex (terminal triad)',
            body: [
              { bullets: [
                '**Bradycardia + hypertension + irregular respiration**',
                'Late sign of severe ↑ICP',
                'Brain herniation imminent — emergency intervention',
              ] },
            ] },
        ],
      },
      {
        heading: 'Treatment of ↑ ICP',
        source: 'neuroER 1 hr.pdf + master p.13',
        body: [
          { bullets: [
            { label: 'Position', value: 'Head elevated **30°** (avoid jugular compression)' },
            { label: 'Mannitol', value: '**0.5-1 g/kg IV slow over 15-20 min** · osmotic diuretic · q4-6h prn · monitor U/O' },
            { label: 'Hypertonic saline 7%', value: 'Alternative to mannitol · 2-4 ml/kg slow' },
            { label: 'IPPV', value: 'Maintain ETCO₂ 35-40 mmHg (avoid hypocap → vasoconstrict ของ brain)' },
            { label: 'O₂ supplement', value: 'PaO₂ > 80 mmHg' },
            'Treat seizures aggressively',
          ] },
          { callout: '⚠️ ห้าม steroid (CRASH trial 2004 — worse outcome) · ห้ามใช้ใน head trauma routine', kind: 'warn' },
        ],
      },
      {
        heading: 'Acute spinal cord injury',
        source: 'neuroER 1 hr.pdf + master p.13',
        body: [
          { bullets: [
            'Stabilize C-spine (dog/cat ใช้ board)',
            'Assess neuro grade (modified Frankel) + DPP',
            'Imaging: X-ray screen + MRI (ดี surgical planning) · CT (ดี bone)',
            { label: 'Treatment', value: 'Surgical decompression ใน moderate-severe · medical (cage rest 4-6 wk) ใน mild type II' },
            '⚠️ Methylprednisolone (high-dose steroid) — **no longer recommended** (NASCIS 3 controversy)',
            'PEMF (pulsed electromagnetic field) emerging therapy',
          ] },
        ],
      },
      {
        heading: 'Brain herniation',
        source: 'neuroER 1 hr.pdf + master',
        body: [
          { bullets: [
            'Skull = closed box · ↑ ICP → herniation',
            'Tentorial (transtentorial) — uncal herniation',
            'Foramen magnum — cerebellar herniation → respiratory arrest',
            'Sign: progressive mentation deterioration · pupils anisocoria → mydriasis bilateral · postural change · Cushing\'s triad',
            'Tx: aggressive ICP reduction (mannitol + IPPV) · stabilize · surgery if structural',
          ] },
        ],
      },
    ],
  },
};
