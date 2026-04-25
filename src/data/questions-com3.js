// ============================================================
// COM III Questions — Companion Animal Clinical Sciences III
// ============================================================
// Sources:
//   - Slide Lecture 2026: 14 lectures (triage, shock, CPCR,
//     acute abdomen, resp/CV emergency, ER anes, metabolic/endo/UT,
//     nutrition, neuro-ER, neuro_exam, neuro_localised,
//     ataxia/tremor, seizure, spinal disorder)
//   - "COM III FINAL 86 เส้นแดงคือรวมโพย" — TJ86 master compilation
//     (มีชุดข้อสอบ ER VET84 22 ข้อ + answer key)
//   - sunsun84 (Vet 84) lecture archive
//
// Topics:
//   neuro-exam, ataxia-tremor, seizure, spinal, neuro-er,
//   triage, shock, cpcr, acute-abdomen, resp-cv-er,
//   metabolic-er, nutrition, er-anes
//
// IDs: 700–899 (room for ~200 questions)
// ============================================================

export const QB_COM3 = [
  // ═══════════════════════════════════════════════════════════
  // TRIAGE — Aj. Chutirat Torsahakul
  // ═══════════════════════════════════════════════════════════

  { id: 700, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'concept'], type: 'mcq',
    q: 'Triage มีรากศัพท์มาจากภาษาฝรั่งเศส แปลว่าอะไร',
    options: ['To treat', 'To sort', 'To save', 'To stabilize'],
    answer: 1, explain: 'Triage = จัดเรียง/แบ่งกลุ่ม → ใครรอได้ ใครต้องช่วยก่อน · ใช้ประเมินทั้ง dx และ tx',
    verified: 'triage 1 hr.pdf + COM V FINAL 86 (Aj. Chutirat)' },

  { id: 701, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'primary-survey'], type: 'mcq',
    q: 'Primary survey ใน emergency triage ใช้หลัก',
    options: ['ABCDE (Airway, Breathing, Circulation, Dysfunction CNS, Exposure)', 'SOAP', 'PQRST', 'OPQRST'],
    answer: 0, explain: 'A,B (Airway+Breathing) → C (Circulation: HR, MM, CRT, pulse, mentation, temp) → D (Dysfunction CNS) → E (Exposure/exam)',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 702, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'perfusion'], type: 'mcq',
    q: '6 perfusion parameters ที่ใช้ประเมิน Circulation ตอน triage คือ',
    options: ['BP, ECG, BUN, Cr, Lactate, glucose', 'Mentation, MM color, CRT, HR, Pulse quality, Extremity temp', 'Temp, RR, HR, BP, SpO2, EtCO2', 'Vomiting, diarrhea, urine output, weight, appetite, behavior'],
    answer: 1, explain: '6 perfusion: mentation + MM + CRT + HR + pulse quality + extremity temp · ทุกตัวเข้าได้แม้ไม่มีเครื่องมือ',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 703, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'mm-color'], type: 'match',
    q: 'จับคู่สีของ mucous membrane กับภาวะที่บ่งบอก',
    pairs: [
      { left: 'Pale / white', right: 'Vasoconstriction / severe anemia' },
      { left: 'Brick red', right: 'Vasodilatory shock / sepsis' },
      { left: 'Cyanotic / blue', right: 'Severe hypoxemia' },
      { left: 'Icteric / yellow', right: 'Hemolysis / hepatobiliary disease' },
    ],
    explain: 'กดที่ inner lip นาน 4 วินาที (กัน gingivitis confound) · แดงมากๆ = sepsis (cytokine vasodilation)',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 704, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'mentation'], type: 'match',
    q: 'จับคู่ระดับ consciousness',
    pairs: [
      { left: 'Alert', right: 'Normal — ตอบสนองต่อสิ่งรอบตัว' },
      { left: 'Obtunded / Depressed', right: 'ตอบสนองน้อยลง · ไม่สนใจรอบตัวเท่าเดิม' },
      { left: 'Stuporous', right: 'ไม่ตอบเสียง แต่ตอบสนองต่อความเจ็บ' },
      { left: 'Comatose', right: 'Unconscious — ไม่ตอบสนองอะไรเลย' },
    ],
    explain: 'ใช้ใน D step (Dysfunction CNS) ของ primary survey',
    verified: 'triage 1 hr.pdf + master p.42 + neuro_exam 1 hr.pdf' },

  { id: 705, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'tachy-brady'], type: 'mcq',
    q: 'ภาวะ shock ในแมวมักทำให้ HR เป็นแบบใด',
    options: ['Tachycardia (เพราะ sympathetic stimulation)', 'Bradycardia (ตรงข้ามกับสุนัข — แมว shock มัก HR ช้าลง)', 'Normal HR', 'Arrhythmia เท่านั้น'],
    answer: 1, explain: 'แมว shock → bradycardia · สุนัข shock → tachycardia · ระวัง! · paradox นี้ของแมว',
    verified: 'triage 1 hr.pdf + master p.41' },

  { id: 706, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'pulse'], type: 'mcq',
    q: 'Pulse แบบใดเป็น signature ของภาวะ sepsis',
    options: ['Thready pulse', 'Bounding pulse — duration สั้นมาก (cytokine → vasodilation)', 'Normal pulse', 'Absent pulse'],
    answer: 1, explain: 'Bounding pulse = sepsis signature · Thready pulse = severe vasoconstriction · pulse strong = sys-dias gap > 50',
    verified: 'triage 1 hr.pdf + master p.42' },

  { id: 707, subject: 'com3', topic: 'triage', year: 4, source: 'triage 1 hr.pdf',
    tags: ['triage', 'color-coded'], type: 'mcq',
    q: 'ในระบบ triage แบบสี (red/yellow/green) สีใดหมายถึง "ฉุกเฉิน ต้องรีบ ต้องช่วยเลย"',
    options: ['Red', 'Yellow', 'Green', 'Blue'],
    answer: 0, explain: 'Red = arrest/critical · Yellow = stable แต่ระวัง · Green = รอได้ 24 ชม.',
    verified: 'triage 1 hr.pdf + master p.40' },

  // ═══════════════════════════════════════════════════════════
  // SHOCK — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 710, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'definition'], type: 'mcq',
    q: 'Definition ของ shock ที่ถูกต้องคือ',
    options: ['BP ต่ำกว่า 60 mmHg เสมอ', 'การที่ tissue ขาด oxygen — เกิดจาก imbalance ระหว่าง O₂ delivery และ O₂ consumption', 'หัวใจหยุดเต้น', 'อุณหภูมิร่างกายต่ำกว่า 36°C'],
    answer: 1, explain: 'Shock = imbalance DO₂ vs VO₂ → ATP ไม่พอ → cell ตาย → organ failure · BP ต่ำเป็นแค่ symptom',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 711, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'types'], type: 'mcq',
    q: 'Type ของ shock ที่ "fluid therapy แล้วแย่ลง" คือ',
    options: ['Hypovolemic shock', 'Cardiogenic shock', 'Distributive shock', 'Hypoxic shock'],
    answer: 1, explain: 'Cardiogenic shock = หัวใจ pump ไม่ได้ → fluid เพิ่ม → preload เพิ่ม → cardiac failure แย่ลง · type อื่น fluid ช่วย',
    verified: 'SHOCK 1 hr.pdf + master p.15' },

  { id: 712, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'distributive'], type: 'mcq',
    q: 'Distributive shock เกิดจากกลไกใดเป็นหลัก',
    options: ['Volume เลือดน้อยลง', 'หัวใจ pump เลือดไม่ได้', 'Inflammatory mediators (NO, cytokines) → vasodilation → VR ↓', 'Mitochondrial dysfunction'],
    answer: 2, explain: 'Distributive: sepsis, SIRS, anaphylaxis · NO → vasodilate → VR ↓ → CO ↓ · "warm shock" — vasodilate',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 713, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'sirs'], type: 'mcq',
    q: 'เกณฑ์การวินิจฉัย SIRS ในสัตว์ ประกอบด้วยกี่ข้อจาก 4 criteria จึงถือว่าเป็น',
    options: ['1 จาก 4', '2 จาก 4', '3 จาก 4', '4 จาก 4 ทั้งหมด'],
    answer: 1, explain: 'SIRS = ≥ 2/4: temp สูง/ต่ำ · HR สูง/ต่ำ · RR เร็ว · WBC สูง/ต่ำ + bands · MODS เมื่อลามไปอวัยวะอื่น',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 714, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'metabolic'], type: 'mcq',
    q: 'Metabolic shock คือ',
    options: ['Tissue ขาด O₂ จาก hypovolemia', 'O₂ ไปถึง cell ปกติ แต่ cell ใช้ O₂ ไม่ได้ (เช่น hypoglycemia, cyanide)', 'Volume ในหลอดเลือดต่ำ', 'Anemia รุนแรง'],
    answer: 1, explain: 'Metabolic shock = mitochondrial dysfunction หรือ no glucose · ตัวอย่าง: hypoglycemia, cyanide poisoning · fluid ไม่ช่วย',
    verified: 'SHOCK 1 hr.pdf + master p.16' },

  { id: 715, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'lactate'], type: 'mcq',
    q: 'Lactate value ที่บ่งบอก hyperlactatemia (ภาวะ shock) คือ',
    options: ['> 1.0 mmol/L', '> 2.5 mmol/L', '> 5 mmol/L', '> 10 mmol/L'],
    answer: 1, explain: 'Hyperlactatemia ≥ 2.5 mmol/L · type A = O₂ delivery ต่ำ (poor perfusion) · type B = cellular use abnormal',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 716, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'shock-index'], type: 'mcq',
    q: 'Shock index (SI) ในสุนัขคำนวณอย่างไร และค่าใดเริ่มสงสัย shock',
    options: ['SI = HR/SBP, > 1.0 สงสัย shock', 'SI = SBP/HR, > 100 สงสัย shock', 'SI = MAP/HR, > 0.5 สงสัย shock', 'SI = HR×SBP, > 10000 สงสัย shock'],
    answer: 0, explain: 'SI = HR/SBP · normal 0.9-1.0 · > 1 มีแนวโน้ม shock',
    verified: 'SHOCK 1 hr.pdf + master p.17' },

  { id: 717, subject: 'com3', topic: 'shock', year: 4, source: 'SHOCK 1 hr.pdf',
    tags: ['shock', 'vasopressor'], type: 'mcq',
    q: 'Vasopressor ที่ใช้บ่อยใน septic shock เพื่อยก BP คือ',
    options: ['Dobutamine', 'Norepinephrine', 'Furosemide', 'Mannitol'],
    answer: 1, explain: 'Norepinephrine = specific α-agonist → vasoconstriction → ↑ BP · ใช้เมื่อ SAP < 80, MAP < 60 · Dobutamine = inotrope',
    verified: 'SHOCK 1 hr.pdf + master p.18' },

  { id: 718, subject: 'com3', topic: 'shock', year: 4, source: 'master p.18',
    tags: ['shock', 'steroid'], type: 'tf',
    q: 'Glucocorticoids แนะนำให้ใช้รักษา shock ทุกประเภทเป็น routine',
    answer: false, explain: 'False! steroid contraindicated ใน shock โดยทั่วไป · ใช้ได้เฉพาะ CIRCI (critical illness-related corticosteroid insufficiency) · NSAIDs ห้ามด้วย',
    verified: 'SHOCK 1 hr.pdf + master p.19' },

  // ═══════════════════════════════════════════════════════════
  // CPCR — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 720, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'recover'], type: 'mcq',
    q: 'ตามแนวทาง RECOVER สำหรับ CPCR ในสัตว์ — ความถี่ในการกดอกที่แนะนำคือ',
    options: ['60 ครั้ง/นาที', '80 ครั้ง/นาที', '100-120 ครั้ง/นาที', '160 ครั้ง/นาที'],
    answer: 2, explain: 'Compression rate 100-120/นาที · depth 1/3-1/2 ของ chest · "Full chest wall recoil" สลับมือทุก 2 นาที',
    verified: 'CPCR 1 hr.pdf + master p.29 (RECOVER 2024)' },

  { id: 721, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'compression-ventilation'], type: 'mcq',
    q: 'อัตรา compression : ventilation ใน CPR ของคนเดียว (no ETT) คือ',
    options: ['15 : 2', '30 : 2', '50 : 2', 'Continuous compression, ventilate ทุก 6 วินาที'],
    answer: 1, explain: 'No ETT → 30 compressions : 2 ventilations · ETT แล้ว → continuous compression + ventilate ทุก 10/min',
    verified: 'CPCR 1 hr.pdf + master p.29' },

  { id: 722, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'epinephrine'], type: 'mcq',
    q: 'Dose ของ low-dose epinephrine ใน CPCR คือ',
    options: ['0.001 mg/kg IV q3-5min', '0.01 mg/kg IV q3-5 min (every other cycle)', '0.1 mg/kg IV bolus', '1 mg/kg IV bolus'],
    answer: 1, explain: 'Low-dose epi 0.01 mg/kg IV ทุก 3-5 นาที (cycle เว้น cycle) · ห้าม shock asystole + PEA · vasopressor → DBP ↑',
    verified: 'CPCR 1 hr.pdf + master p.30 (RECOVER 2024)' },

  { id: 723, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'shockable'], type: 'mcq',
    q: 'Shockable rhythm ที่ต้องใช้ defibrillator คือ',
    options: ['Asystole', 'PEA (Pulseless Electrical Activity)', 'Ventricular Fibrillation (VF) + Pulseless VT', 'Sinus bradycardia'],
    answer: 2, explain: 'Shockable: VF + pulseless VT · NON-shockable: asystole + PEA → ให้ epinephrine แทน',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 724, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'atropine'], type: 'mcq',
    q: 'Atropine ใน CPCR แนะนำให้ใช้ในกรณีใด',
    options: ['Asystole หรือ PEA ที่มี vagal tone เด่น (เช่น vomit, GI obstruction)', 'VF เสมอ', 'Sinus tachycardia', 'ทุก case ของ cardiac arrest'],
    answer: 0, explain: 'Atropine = parasympatholytic · ให้เฉพาะกรณี vagal tone ↑ (ปวดท้อง, vomit, pancreatitis) · Cycle แรกครั้งเดียว (อยู่นาน)',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 725, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'capnography'], type: 'mcq',
    q: 'EtCO₂ (end-tidal CO₂) ที่ดีระหว่าง CPR เพื่อบ่งว่ากดอกได้มีประสิทธิภาพคือ',
    options: ['> 5 mmHg', '> 18 mmHg', '> 40 mmHg', '> 100 mmHg'],
    answer: 1, explain: 'Goal EtCO₂ > 18 mmHg · ค่า EtCO₂ โดดสูง 40 mmHg ทันที = ROSC (Return of Spontaneous Circulation)',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  { id: 726, subject: 'com3', topic: 'cpcr', year: 4, source: 'CPCR 1 hr.pdf',
    tags: ['cpcr', 'reversal'], type: 'match',
    q: 'จับคู่ Reversal agent กับยาที่แก้',
    pairs: [
      { left: 'Naloxone', right: 'Opioid' },
      { left: 'Flumazenil', right: 'Benzodiazepine (diazepam)' },
      { left: 'Atipamezole / Yohimbine', right: 'α2-agonist (xylazine, dexmedetomidine)' },
    ],
    explain: 'ก่อน CPR ถ้ายา anesthesia/sedation ทำให้ arrest → ให้ reversal ก่อน',
    verified: 'CPCR 1 hr.pdf + master p.30' },

  // ═══════════════════════════════════════════════════════════
  // ACUTE ABDOMEN — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 730, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'definition'], type: 'mcq',
    q: 'Acute abdomen หมายถึงอาการอะไร',
    options: ['ท้องเสียเฉียบพลัน', 'ปวดท้องเฉียบพลัน (รวม peritoneum) — เกิดจากการอักเสบของอวัยวะในช่องท้อง', 'อาเจียนเฉียบพลัน', 'ท้องอืดเฉียบพลัน'],
    answer: 1, explain: 'Acute abdomen = ปวดท้องเฉียบพลัน · อาจจาก GI / pancreas / hepatobiliary / spleen / repro / urinary / peritoneum',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 731, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'afast'], type: 'mcq',
    q: '4-point AFAST scan ใช้ตรวจตำแหน่งใดบ้าง',
    options: ['DH (diaphragmaticohepatic), HR (hepatorenal), SR (splenorenal), CC (cystocolic)', 'Heart, Lung, Liver, Kidney', '4 quadrants ของ abdomen', 'CT scan 4 cuts'],
    answer: 0, explain: 'AFAST 4-point: นอน right lateral · DH (diaphragm + liver), SR (spleen + L kidney), CC (UB + colon), HR (liver + R kidney) · score แต่ละจุด มี fluid +1',
    verified: 'Acute Abdomen 1 hr.pdf + master p.22' },

  { id: 732, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'septic'], type: 'mcq',
    q: 'การวินิจฉัย Septic peritonitis จาก fluid analysis ใช้ค่า glucose อย่างไร',
    options: ['Fluid glucose > blood glucose 20 mg/dL', 'Fluid glucose < 50 mg/dL หรือ < blood glucose 20 mg/dL', 'Fluid glucose = blood glucose', 'ไม่ใช้ glucose ในการ Dx'],
    answer: 1, explain: 'Septic peritonitis: fluid glucose < 50 mg/dL · หรือ blood-fluid glucose gap > 20 (bacteria กิน glucose) · + degenerate neutrophil ± bacteria',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 733, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'uroabdomen'], type: 'mcq',
    q: 'Uroabdomen วินิจฉัยจาก fluid analysis โดยใช้ ratio ใด',
    options: ['Fluid Cr : Serum Cr > 2 : 1', 'Fluid albumin : Serum albumin > 1', 'Fluid PCV > Blood PCV', 'Fluid bilirubin > Serum bilirubin'],
    answer: 0, explain: 'Uroabdomen: fluid Cr : serum Cr > 2:1 · K+ ratio: dog > 1.4, cat > 1.9 · + AFAST อาจเห็น ruptured UB',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 734, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'hemoabdomen'], type: 'mcq',
    q: 'Hemoabdomen — fluid analysis ที่ confirm ว่า "เลือด" ในช่องท้องคือ',
    options: ['Fluid PCV < Blood PCV และ clot ปกติ', 'Fluid PCV เท่ากับ Blood PCV และไม่ clot (clotting factors ใช้หมด)', 'Fluid bilirubin > 2 × serum', 'Fluid Cr > Blood Cr'],
    answer: 1, explain: 'Hemoabdomen: fluid PCV ≈ blood PCV และไม่ clot (factors used up in cavity) · Common: hemangiosarcoma, splenic mass rupture, trauma',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 735, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'analgesia'], type: 'mcq',
    q: 'Drug of choice สำหรับ pain management ใน acute abdomen ที่มีปัญหาไต/ตับคือ',
    options: ['NSAIDs (Meloxicam)', 'Opioids (Fentanyl, Morphine, Buprenorphine) — ปลอดภัยใน renal/hepatic impair', 'Acetaminophen', 'Aspirin'],
    answer: 1, explain: 'Opioid = first line + safe ใน renal/hepatic disease · Ketamine + lidocaine (FLK/MLK CRI) ในเคสปวดมาก · NSAIDs contraindicated',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  { id: 736, subject: 'com3', topic: 'acute-abdomen', year: 4, source: 'Acute Abdomen 1 hr.pdf',
    tags: ['acute-abdomen', 'critical'], type: 'mcq',
    q: 'Acute abdomen condition ที่ "ผ่าตัดด่วน" (critical) คือ',
    options: ['Acute pancreatitis', 'Gastroenteritis ไม่มี perforation', 'Septic peritonitis · GDV · Mesenteric torsion · Uncontrolled hemorrhage', 'Hemoabdomen ที่ stable'],
    answer: 2, explain: 'Critical (ผ่าด่วน): septic peritonitis (perforate), GDV, mesenteric torsion, uncontrolled bleed · Pancreatitis = medical mgmt',
    verified: 'Acute Abdomen 1 hr.pdf + master p.23' },

  // ═══════════════════════════════════════════════════════════
  // RESP & CV EMERGENCY — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 740, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pattern'], type: 'mcq',
    q: 'Respiratory pattern ที่บ่งบอก upper airway obstruction (URT) คือ',
    options: ['Inspiratory dyspnea + stridor', 'Expiratory dyspnea + wheeze', 'Restrictive (rapid shallow)', 'Cheyne-Stokes'],
    answer: 0, explain: 'URT obstruction: inspiratory dyspnea + stridor (laryngeal paralysis, brachycephalic) · LRT obstruction: expiratory + wheeze (asthma)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 741, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pleural'], type: 'mcq',
    q: 'การประเมิน paradoxical breathing (chest moves in on inspiration) บ่งบอกอะไร',
    options: ['ปกติในสุนัข', 'Pleural space disease (pneumothorax / pleural effusion) หรือ severe respiratory fatigue', 'Heart failure', 'ปอด normal'],
    answer: 1, explain: 'Paradoxical = abdomen + chest move opposite direction · pleural effusion / pneumothorax / diaphragm fatigue · ต้อง emergency thoracocentesis',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 742, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['resp-er', 'pulmonary-edema'], type: 'mcq',
    q: 'Pulmonary edema จาก left-sided heart failure — first line treatment คือ',
    options: ['IV crystalloid bolus', 'Furosemide IV + O₂ supplementation + minimize stress', 'Steroid IV', 'Bronchodilator inhaler'],
    answer: 1, explain: 'Cardiogenic pulmonary edema: Furosemide 1-4 mg/kg IV ± CRI · O₂ + minimize stress · monitor RR · ห้าม IV fluid (ทำให้แย่ลง)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 743, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'tamponade'], type: 'mcq',
    q: 'Cardiac tamponade — first emergency intervention คือ',
    options: ['Pericardiocentesis', 'IV epinephrine', 'Furosemide', 'Defibrillation'],
    answer: 0, explain: 'Cardiac tamponade → pericardiocentesis ASAP · clinical: muffled heart, pulsus paradoxus, jugular distension · มักเจอ pericardial effusion จาก tumor (HSA)',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  { id: 744, subject: 'com3', topic: 'resp-cv-er', year: 4, source: 'Respiratory and Cardiovascular Emergency 1 hr.pdf',
    tags: ['cv-er', 'arrhythmia'], type: 'match',
    q: 'จับคู่ arrhythmia กับ first-line drug',
    pairs: [
      { left: 'Ventricular tachycardia (sustained, hemodynamically unstable)', right: 'Lidocaine IV bolus 2 mg/kg' },
      { left: 'Supraventricular tachycardia', right: 'Diltiazem หรือ vagal maneuver' },
      { left: 'Atrial fibrillation', right: 'Diltiazem (rate control)' },
      { left: 'Symptomatic bradycardia', right: 'Atropine 0.04 mg/kg' },
    ],
    explain: 'จำ first-line สำหรับ arrhythmia common · VT ในแมวต้องใช้ lidocaine ระวัง dose',
    verified: 'Respiratory and Cardiovascular Emergency 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // EMERGENCY ANESTHESIA — Aj. Sumit
  // ═══════════════════════════════════════════════════════════

  { id: 750, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'gdv'], type: 'mcq',
    q: 'Pre-op management ของ GDV ก่อนวางยาคือ',
    options: ['ฉีดยาวางยาทันที — ผ่าตัดด่วน', 'Stabilize hypovolemic shock ด้วย aggressive fluid (50-60 ml/kg bolus) + decompress กระเพาะ ก่อนค่อยวางยา', 'ให้แค่ NSAIDs ก่อนผ่า', 'รอให้ stable เอง 24 ชม.'],
    answer: 1, explain: 'GDV pre-op: aggressive fluid + gastric decompression (orogastric tube หรือ trocar) → HR < 150, SBP > 90 ก่อนวางยา · premed: benzo + opioid · induct: ketamine ± low-dose fentanyl',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 751, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'urethral-obstruction'], type: 'tf',
    q: 'แมว urethral obstruction ที่มี K+ สูงมาก — สามารถวางยาสลบด้วย propofol ได้ทันทีโดยไม่ต้องแก้ K+ ก่อน',
    answer: false, explain: 'False! HyperK → bradycardia + arrhythmia · ต้องแก้ K+ ก่อน (Ca gluconate, dextrose, fluid) จน stable แล้วค่อยวางยา',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 752, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'contraindicated'], type: 'mcq',
    q: 'ยาวางยาสลบที่ "ห้ามใช้" ใน hypovolemic shock patient คือ',
    options: ['Propofol + inhalant', 'Ketamine', 'Fentanyl', 'Etomidate'],
    answer: 0, explain: 'Propofol + inhalant → vasodilation → BP ตก รุนแรง · ใน shock เลือก: opioid + benzodiazepine + ketamine (low dose) · α2-agonist ห้ามเด็ดขาด',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 753, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'proptosis'], type: 'mcq',
    q: 'Proptosis (ตาโปน) จาก head trauma — anesthesia plan ควร',
    options: ['Premed: opioid + benzodiazepine + anticholinergic · induct: propofol smooth · maintain ETCO₂ 40 mmHg ป้องกัน intracranial pressure', 'Premed: α2-agonist · induct: thiopental', 'ไม่ต้องวางยา', 'ฉีด ketamine bolus เดียว'],
    answer: 0, explain: 'Head trauma: opioid + benzo + anticholinergic · propofol induct · IPPV ETCO₂ ≈ 40 mmHg (ป้องกัน vasodilate → ICP ↑) · ห้าม α2 (depress)',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  { id: 754, subject: 'com3', topic: 'er-anes', year: 4, source: 'Animal_Emerg_Anes 1 hr.pdf',
    tags: ['er-anes', 'dystocia'], type: 'mcq',
    q: 'Anesthesia สำหรับ Dystocia (ผ่าคลอด) — premed ที่ "ห้ามใช้" คือ',
    options: ['Opioid', 'Benzodiazepine', 'α2-adrenergic agonist (xylazine, dexmed)', 'Local anesthesia'],
    answer: 2, explain: 'ห้าม α2-agonist เด็ดขาดในแม่ตั้งครรภ์ · ลูกได้ยาด้วย · เลือก propofol/alfaxalone (sedative สั้น) · sx ด่วน เพื่อให้ลูกออกเร็ว',
    verified: 'Animal_Emerg_Anes 1 hr.pdf + master p.46' },

  // ═══════════════════════════════════════════════════════════
  // METABOLIC / ENDOCRINE / UT — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 760, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'metabolic and endocrine and UT 1 hr.pdf',
    tags: ['dka', 'definition'], type: 'mcq',
    q: 'Diabetic Ketoacidosis (DKA) คือ',
    options: ['DM ที่มี hyperglycemia เพียงอย่างเดียว', 'Severe DM + ketosis (ketone bodies) + metabolic acidosis', 'DM + hypoglycemia', 'Pancreatitis เฉียบพลัน'],
    answer: 1, explain: 'DKA: severe DM → fat breakdown → ketones (acetoacetic, acetone, β-hydroxybutyrate) → acidosis + super-diuresis (polyuria จาก glucose)',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 761, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'treatment-order'], type: 'mcq',
    q: 'Treatment order สำหรับ DKA — ก่อนให้ insulin ต้องทำอะไรก่อน',
    options: ['ให้ insulin bolus ทันที', 'แก้ electrolyte imbalance + dehydration ก่อน · จากนั้น CRI insulin', 'ให้ glucose ก่อน', 'ให้ steroid ก่อน'],
    answer: 1, explain: 'DKA: rehydrate (NSS) + correct K + check phosphate ก่อน → จากนั้น **regular insulin CRI** (dog 2.2 U/kg/d, cat 1.1 U/kg/d) · ห้าม SC route',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 762, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['dka', 'cerebral-edema'], type: 'mcq',
    q: 'Complication ที่อันตรายของการแก้ DKA เร็วเกินไปคือ',
    options: ['Hypothermia', 'Cerebral edema (จาก idiogenic osmole — ลด glucose เร็ว → fluid เข้า cell สมอง)', 'Hyperthyroid crisis', 'Liver failure'],
    answer: 1, explain: 'DKA tx เร็วเกิน → glucose ลดเร็ว → idiogenic osmoles ใน cell ดึงน้ำเข้า → cerebral edema · ลด glucose ช้าๆ + monitor neuro',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.33' },

  { id: 763, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison'], type: 'mcq',
    q: 'Addisonian crisis — lab finding ที่เป็น classic คือ',
    options: ['Na+ สูง / K+ ต่ำ', 'Na+ < 132 + K+ > 7 (Na+:K+ ratio < 25:1) + hypoglycemia', 'Glucose สูง', 'Calcium ต่ำ'],
    answer: 1, explain: 'Addison: hypoNa + hyperK + hypoglycemia + hypovolemia + acidosis · Na:K < 25:1 (parsuspect) < 20 = strong · Confirm: ACTH stim test · cortisol ไม่เพิ่ม',
    verified: 'master p.33' },

  { id: 764, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.33',
    tags: ['addison', 'treatment'], type: 'mcq',
    q: 'Acute treatment ของ Addisonian crisis คือ',
    options: ['Insulin', 'IV fluid + Dexamethasone (ไม่ interfere กับ ACTH stim test) + Calcium gluconate ถ้า bradyarrhythmia', 'Furosemide', 'NSAIDs'],
    answer: 1, explain: 'IV NSS (correct hypoNa ช้าๆ < 0.5 mEq/L/hr ป้องกัน pontine myelinolysis) · Dexamethasone (ไม่ interfere ACTH test) · Ca gluconate stabilize myocardium · maintain: prednisolone + fludrocortisone',
    verified: 'master p.33' },

  { id: 765, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['urethral-obstruction'], type: 'mcq',
    q: 'Urethral obstruction ในแมว — first-line emergency stabilization คือ',
    options: ['ฉีด catheter ทันที', 'Cystocentesis decompress UB → IV fluid → correct hyperK (Ca gluconate, dextrose+insulin) → จากนั้นค่อยสวน catheter ตอนวางยา', 'ให้ steroid', 'ให้ NSAIDs ก่อน'],
    answer: 1, explain: 'Stabilize first: cystocentesis (decompress) + fluid + correct K · sedation/anes ตอนสวน · post-obstructive diuresis ระวังให้ fluid พอ',
    verified: 'metabolic and endocrine and UT 1 hr.pdf + master p.34' },

  { id: 766, subject: 'com3', topic: 'metabolic-er', year: 4, source: 'master p.34',
    tags: ['aki'], type: 'mcq',
    q: 'Acute Kidney Injury (AKI) — ยาที่ "ห้าม" ใช้คือ',
    options: ['Furosemide', 'Mannitol', 'NSAIDs + Aminoglycoside (intrinsic-renal nephrotoxic)', 'Dopamine'],
    answer: 2, explain: 'NSAIDs (vasoconstriction) + aminoglycoside (gentamicin nephrotoxic) · เลือก opioid + furosemide + mannitol + dopamine · severe → dialysis',
    verified: 'master p.34' },

  // ═══════════════════════════════════════════════════════════
  // NUTRITION — Aj. Chutirat
  // ═══════════════════════════════════════════════════════════

  { id: 770, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['rer'], type: 'mcq',
    q: 'สูตรคำนวณ Resting Energy Requirement (RER) ในสัตว์น้ำหนัก 3-25 kg คือ',
    options: ['RER = 70 × BW^0.75', 'RER = 30 × BW + 70', 'RER = 100 × BW', 'RER = 50 + BW^0.5'],
    answer: 1, explain: 'RER (3-25 kg) = 30 × BW(kg) + 70 · นอกช่วง: 70 × BW^0.75 · ตัวอย่าง: แมว 6 kg → 30(6)+70 = 250 kcal/d',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 771, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['starvation'], type: 'mcq',
    q: 'Stress starvation (hypermetabolic) ต่างจาก simple starvation อย่างไร',
    options: ['ใช้ glycogen เป็นหลักเหมือนกัน', 'Stress: catabolism เร็ว, ดึงโปรตีนมาใช้เป็นพลังงานมาก, mobilize fat, immune suppression · Simple: ใช้ fat เป็นหลัก, สงวนโปรตีน', 'ทั้งคู่เหมือนกัน', 'Stress ไม่มี catabolism'],
    answer: 1, explain: 'Stress (sepsis/trauma/burn): glucocorticoid + cytokines → protein catabolism เร่ง + insulin resistance · Simple (fast): สงวน protein, fat dominant',
    verified: 'nutrition 1 hr.pdf + master p.36' },

  { id: 772, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-tube'], type: 'mcq',
    q: 'แมว 6 kg มี caudal esophagus mass — feeding tube ที่เหมาะสมที่สุดคือ',
    options: ['NE (nasoesophageal)', 'NG (nasogastric)', 'E-tube (esophagostomy)', 'G-tube (gastrostomy) — ผ่าน mass ไป'],
    answer: 3, explain: 'NE/NG/E-tube ทุกแบบต้องผ่าน esophagus → ถ้ามี mass → ใช้ G-tube (เข้ากระเพาะตรงผ่าน body wall) · J-tube ถ้ามี gastric problem ด้วย',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 773, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['feeding-protocol'], type: 'mcq',
    q: 'หลังวางสาย feeding (E-tube/G-tube) — 24 ชั่วโมงแรกควรทำอย่างไร',
    options: ['ให้อาหาร RER เต็มที่เลย', 'ไม่ต้องให้อะไร 24 ชม. (ปล่อยรอยปิดสนิท) แล้วค่อยเริ่ม 1/3 RER วันแรก', '1/2 RER + เกลือแร่', 'Bolus 50 ml/kg'],
    answer: 1, explain: 'หลังวางสาย: 24 ชม. แรก rest · D1 = 1/3 RER · D2 = 2/3 RER · D3 = full RER · slow bolus ≤ 5 ml/min · ระวัง refeeding syndrome (hypoP)',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 774, subject: 'com3', topic: 'nutrition', year: 4, source: 'nutrition 1 hr.pdf',
    tags: ['parenteral'], type: 'mcq',
    q: 'Total Parenteral Nutrition (TPN) ต้องให้ผ่าน vein ใด',
    options: ['Cephalic vein (peripheral)', 'Saphenous vein', 'Central vein (jugular) เพราะ hyperosmolar', 'Subcutaneous'],
    answer: 2, explain: 'TPN hyperosmolar → ต้อง central vein (jugular) ป้องกัน thrombophlebitis · PPN diluted กว่า ใช้ peripheral ได้ · ระวัง refeeding syndrome (hypoP, hypoK)',
    verified: 'nutrition 1 hr.pdf + master p.37' },

  { id: 775, subject: 'com3', topic: 'nutrition', year: 4, source: 'master p.36',
    tags: ['arginine', 'taurine'], type: 'match',
    q: 'จับคู่ essential amino acid กับสัตว์ที่ต้องการ',
    pairs: [
      { left: 'Arginine — essential ในแมว (urea cycle)', right: 'แมว — ขาด → hyperammonemia + neuro signs' },
      { left: 'Taurine — essential ในแมว', right: 'แมว — ขาด → DCM + retinal degeneration' },
      { left: 'Glutamine — conditionally essential', right: 'GI mucosa enterocyte fuel — สำคัญใน hypermetabolic' },
    ],
    explain: 'แมวต้องการ arginine + taurine ในอาหาร · enteral nutrition ปกป้อง GI mucosa มากกว่า parenteral',
    verified: 'master p.36' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EXAM + LOCALIZATION — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 780, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'goals'], type: 'mcq',
    q: 'Goals of neurological examination มี 4 ข้อ — ข้อใด **ไม่ใช่**',
    options: ['Confirm ว่า lesion อยู่ใน nervous system', 'Localize lesion', 'Determine pathologic process', 'Determine the anesthetic protocol'],
    answer: 3, explain: 'Goals: confirm neuro problem · localize · pathologic process · severity → prognosis · ไม่เกี่ยวกับ anesthesia plan',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 781, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'mentation'], type: 'mcq',
    q: 'Mental status เปลี่ยนจาก ARAS (ascending reticular activating system) — โครงสร้างที่เกี่ยวข้องคือ',
    options: ['Cerebellum + spinal cord', 'Cerebral cortex + brainstem (ARAS)', 'Peripheral nerve', 'Muscle'],
    answer: 1, explain: 'Consciousness ต้องการ ARAS (ใน brainstem) + cerebral cortex · lesion ที่ใดที่หนึ่ง → mental status change',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 782, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'posture'], type: 'match',
    q: 'จับคู่ abnormal posture กับ lesion location',
    pairs: [
      { left: 'Schiff-Sherrington (forelimb extension + hindlimb paralysis)', right: 'Thoraco-lumbar SC lesion (T2-L3)' },
      { left: 'Decerebellate rigidity (forelimb extension + hip flexion + LOC normal)', right: 'Cerebellum' },
      { left: 'Decerebrate rigidity (extension all 4 + LOC ↓)', right: 'Brainstem (rostral)' },
    ],
    explain: 'Schiff-Sherrington: LOC ปกติ + forelimb extend แต่หลัง paralysis · severe T-L lesion · prognosis ดีกว่า decerebrate',
    verified: 'neuro_exam 1 hr.pdf p.7 + master p.2' },

  { id: 783, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'ataxia'], type: 'match',
    q: 'จับคู่ ataxia กับ lesion location',
    pairs: [
      { left: 'Proprioceptive ataxia — symmetric, knuckling', right: 'Spinal cord / general proprioceptive pathway' },
      { left: 'Vestibular ataxia — asymmetric, drift to one side', right: 'Vestibular system (CN VIII / brainstem / inner ear)' },
      { left: 'Cerebellar ataxia — symmetric, hypermetria, "bouncy"', right: 'Cerebellum' },
    ],
    explain: 'Cerebellar ataxia ไม่มี weakness — strength ปกติ · proprioceptive มัก weakness ร่วม',
    verified: 'neuro_exam 1 hr.pdf' },

  { id: 784, subject: 'com3', topic: 'neuro-exam', year: 4, source: 'neuro_exam 1 hr.pdf',
    tags: ['neuro-exam', 'umn-lmn'], type: 'mcq',
    q: 'Upper motor neuron (UMN) lesion ขาหลัง — spinal reflex จะเป็น',
    options: ['Hyporeflexia (decreased)', 'Areflexia (absent)', 'Hyperreflexia / Normal reflex (intact reflex arc + loss of inhibition)', 'Random'],
    answer: 2, explain: 'UMN lesion = above LMN cell body → ตัด inhibition → spinal reflex normal/hyper · LMN lesion = at/below cell body → hyporeflexia/absent',
    verified: 'neuro_exam 1 hr.pdf + master p.5' },

  { id: 785, subject: 'com3', topic: 'neuro-localised', year: 4, source: 'neuro_localised 1 hr.pdf',
    tags: ['localisation', 'segments'], type: 'match',
    q: 'จับคู่ spinal segment กับ pattern ของ deficit',
    pairs: [
      { left: 'C1-C5', right: 'UMN ขาหน้า + UMN ขาหลัง (4 ขา UMN)' },
      { left: 'C6-T2 (cervicothoracic intumescence)', right: 'LMN ขาหน้า + UMN ขาหลัง' },
      { left: 'T3-L3', right: 'ขาหน้าปกติ + UMN ขาหลัง' },
      { left: 'L4-S3 (lumbosacral intumescence)', right: 'ขาหน้าปกติ + LMN ขาหลัง' },
    ],
    explain: 'Localize ตาม intumescence: ขาหน้าใช้ C6-T2, ขาหลังใช้ L4-S3 · UMN ขาหลังจาก lesion เหนือ L4',
    verified: 'neuro_localised 1 hr.pdf + master' },

  // ═══════════════════════════════════════════════════════════
  // ATAXIA, TREMOR, VESTIBULAR — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 790, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['vestibular', 'peripheral-vs-central'], type: 'mcq',
    q: 'การแยก peripheral vs central vestibular disease — pattern ของ nystagmus ที่ "บ่งบอก central" คือ',
    options: ['Horizontal/rotary, fast phase ออกจากด้าน lesion', 'Vertical nystagmus หรือ direction-changing nystagmus', 'No nystagmus', 'Always horizontal only'],
    answer: 1, explain: 'Central vestibular: vertical nystagmus, direction-changing, มี mental status change, postural reaction deficit · Peripheral: horizontal/rotary fixed, mental status ปกติ',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 791, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-vestibular'], type: 'mcq',
    q: 'Idiopathic (geriatric) vestibular syndrome — clinical clue',
    options: ['สุนัขเด็ก, head tilt + ataxia เป็นๆหายๆ', 'สุนัขแก่, sudden onset head tilt + horizontal nystagmus + ataxia · mental status ปกติ · self-resolve 1-2 weeks', 'ลูกแมวมี seizure', 'แมวอ้วน'],
    answer: 1, explain: 'Geriatric vestibular: dog แก่ · sudden severe peripheral vestibular signs · LOC ปกติ · มัก self-resolve 1-2 wk · supportive care',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master p.8' },

  { id: 792, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['cerebellar-tremor'], type: 'mcq',
    q: 'Cerebellar disease — characteristic tremor / movement คือ',
    options: ['Resting tremor', 'Intention tremor (เห็นชัดตอนจะทำกิจ — เช่น ตอนกินน้ำ) + hypermetria + truncal ataxia', 'Continuous shaking ทั้งตัว', 'No movement'],
    answer: 1, explain: 'Cerebellar: intention tremor + hypermetria (overshoot) + truncal ataxia + menace deficit (with normal vision)',
    verified: 'neuro_ataxia_tremor 1 hr.pdf + master' },

  { id: 793, subject: 'com3', topic: 'ataxia-tremor', year: 4, source: 'neuro_ataxia_tremor 1 hr.pdf',
    tags: ['idiopathic-head-tremor'], type: 'tf',
    q: 'Idiopathic head tremor (Bobblehead) ใน French Bulldog / Doberman / Boxer — มัก self-resolve และไม่ต้องรักษา',
    answer: true, explain: 'IHT: episodic head tremor (yes/no movement), conscious ปกติ, รับสมาธิ → หยุดได้ · breed-related · most self-resolve · no anti-epileptic needed',
    verified: 'neuro_ataxia_tremor 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // SEIZURE — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 800, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'classification'], type: 'mcq',
    q: 'Seizure ที่เกิด **มากกว่า 5 นาที** หรือ ≥ 2 ครั้งใน 24 ชม. โดยไม่ recover ระหว่างนั้น เรียกว่า',
    options: ['Cluster seizure', 'Status epilepticus', 'Focal seizure', 'Absence seizure'],
    answer: 1, explain: 'Status epilepticus = > 5 min single OR ≥ 2 seizures with incomplete recovery · Cluster = ≥ 2 seizures in 24h, recover between',
    verified: 'seizure 1 hr.pdf + IVETF 2015' },

  { id: 801, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'phases'], type: 'match',
    q: 'จับคู่ phases ของ seizure',
    pairs: [
      { left: 'Prodromal (hours-days)', right: 'Behavior change ก่อนชัก' },
      { left: 'Pre-ictal / aura (sec-min)', right: 'อาการก่อน seizure (anxiety, ขนลุก)' },
      { left: 'Ictal', right: 'During seizure' },
      { left: 'Post-ictal', right: 'After — confusion, blindness, ataxia (ชั่วคราว)' },
    ],
    explain: 'Owner education: บันทึก phase, duration, frequency · Differentiate จาก syncope, narcolepsy, REM behavior',
    verified: 'seizure 1 hr.pdf + master p.10' },

  { id: 802, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'first-line'], type: 'mcq',
    q: 'First-line maintenance anti-epileptic drug ในสุนัขคือ',
    options: ['Diazepam (PO)', 'Phenobarbital หรือ Imepitoin · Levetiracetam (KBr ในกรณี renal ปกติ)', 'Acetazolamide', 'Mannitol'],
    answer: 1, explain: 'Dog 1st line: phenobarbital · imepitoin (Pexion — partial GABA-A) · levetiracetam · KBr add-on · monitor PB level + liver',
    verified: 'seizure 1 hr.pdf + ACVIM consensus' },

  { id: 803, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'status'], type: 'mcq',
    q: 'Status epilepticus — emergency management ขั้นแรกคือ',
    options: ['ให้ phenobarbital PO', 'IV access + Diazepam 0.5 mg/kg IV bolus (หรือ rectal 1-2 mg/kg) · per rectum ถ้าไม่มี IV', 'รอให้หยุดเอง', 'Mannitol bolus'],
    answer: 1, explain: 'Diazepam IV 0.5 mg/kg (or rectal 1-2 mg/kg) → ถ้ายังไม่หยุด: midazolam CRI / propofol CRI / phenobarb loading · monitor: airway, glucose, temperature',
    verified: 'seizure 1 hr.pdf + master p.11' },

  { id: 804, subject: 'com3', topic: 'seizure', year: 4, source: 'seizure 1 hr.pdf',
    tags: ['seizure', 'cat'], type: 'tf',
    q: 'Phenobarbital ในแมวต้องระวัง side effect "facial pruritus + lymphadenopathy" หลังใช้ยาไม่กี่สัปดาห์',
    answer: true, explain: 'Cat: phenobarbital อาจเกิด facial pruritus + lymphadenopathy + bone marrow suppression · ถ้าเจอ → switch ยา',
    verified: 'seizure 1 hr.pdf' },

  // ═══════════════════════════════════════════════════════════
  // SPINAL DISORDER — Aj. Kumpanart
  // ═══════════════════════════════════════════════════════════

  { id: 810, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['ivdd', 'hansen'], type: 'match',
    q: 'จับคู่ Hansen IVDD type',
    pairs: [
      { left: 'Hansen Type I', right: 'Sudden onset · annulus ฉีกขาดหมด · NP ทะลักเข้า canal · chondrodystrophoid breed (Dachshund, Corgi, FB) · มัก T12-L2 หรือ C2-3' },
      { left: 'Hansen Type II', right: 'Gradual onset · annulus ฉีกบางส่วน · large/medium breed non-chondrodystrophoid' },
    ],
    explain: 'Type I = acute herniation · Type II = chronic protrusion · ANNPE = acute non-compressive (different)',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 811, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'wobbler'], type: 'mcq',
    q: 'Wobbler\'s syndrome (caudal cervical spondylopathy) — breed predisposed คือ',
    options: ['Dachshund, Corgi', 'Great Dane, Doberman, German Shepherd (โตไว ตัวใหญ่)', 'Chihuahua, Pomeranian', 'Persian, Siamese cat'],
    answer: 1, explain: 'Wobbler: large breed dog, fast growth · UMN ขาหลัง + LMN ขาหน้า · best Dx: MRI · cervical impingement',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 812, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['atlantoaxial-instability'], type: 'mcq',
    q: 'Atlantoaxial instability — concern ที่อันตรายที่สุดคือ',
    options: ['ขาเป๋', 'หัวคอแฉลบ', 'C1-C2 มี medulla oblongata → respiratory failure → death', 'ตามองไม่เห็น'],
    answer: 2, explain: 'C1-C2 ใกล้ medulla oblongata → severe compression → respiratory arrest · พบใน toy breed (Chihuahua) · UMN 4 ขา · จัดเป็น emergency',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 813, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'fracture'], type: 'mcq',
    q: 'Spinal fracture — สิ่งแรกที่ต้องประเมินก่อน decompression Sx คือ',
    options: ['อายุของสัตว์', 'Deep pain perception (DPP) — ถ้ายังมี = prognosis ดี · ถ้าไม่มี = อาจ spinal shock รอ 24 ชม. ประเมินซ้ำ ถ้ายังไม่มี = ไม่ผ่า', 'Heart rate', 'PCV'],
    answer: 1, explain: 'DPP = pinch toe, animal recognize pain consciously · ถ้าไม่มีหลัง 24 ชม. = SC severance · poor prognosis surgery',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 814, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'sx-technique'], type: 'mcq',
    q: 'Hemilaminectomy ใช้กับกรณีใด',
    options: ['IVDD type I (T-L) — ตัดด้านข้าง 1/2 ของ lamina ทำได้ยาวสุด 3 vertebrae', 'Cervical wobbler', 'Atlantoaxial instability', 'Cauda equina syndrome'],
    answer: 0, explain: 'Hemilaminectomy: T-L IVDD type I · Ventral SLOT: cervical (Wobbler, C-IVDD) · เลือกตามตำแหน่ง',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  { id: 815, subject: 'com3', topic: 'spinal', year: 4, source: 'Spinal disorder 2 hr.pdf',
    tags: ['spinal', 'terminology'], type: 'match',
    q: 'จับคู่ neuro terminology',
    pairs: [
      { left: 'Plegia', right: 'อัมพาต (loss of motor function ทั้งหมด)' },
      { left: 'Paresis', right: 'อ่อนแรง (ยังขยับได้บ้าง)' },
      { left: 'Paraplegia', right: '2 ขาหลัง paralysis' },
      { left: 'Tetraplegia', right: '4 ขา paralysis' },
      { left: 'Hemiplegia', right: 'ครึ่งซีก paralysis' },
    ],
    explain: 'Mono = 1 limb · Hemi = 1 ซีก · Para = 2 ขาหลัง · Tetra = 4 ขา · Paresis < Plegia',
    verified: 'Spinal disorder 2 hr.pdf + master p.6' },

  // ═══════════════════════════════════════════════════════════
  // NEURO EMERGENCY — Aj. Krissda
  // ═══════════════════════════════════════════════════════════

  { id: 820, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'icp'], type: 'mcq',
    q: 'การรักษา head trauma + เพิ่ม intracranial pressure (ICP) — first-line drug คือ',
    options: ['Furosemide IV', 'Mannitol 0.5-1 g/kg IV ช้าๆ 15-20 นาที (osmotic diuretic)', 'Dexamethasone (steroid)', 'Diazepam'],
    answer: 1, explain: 'Mannitol = osmotic agent, ลด ICP · Avoid steroid in head trauma (worsens outcome) · keep head 30° elevation · ETCO₂ 35-40',
    verified: 'neuroER 1 hr.pdf + master p.13' },

  { id: 821, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['mgcs'], type: 'mcq',
    q: 'Modified Glasgow Coma Scale (MGCS) ในสัตว์ คะแนน 3-8 หมายถึง',
    options: ['Excellent prognosis', 'Grave prognosis (severe coma)', 'Normal', 'Mild head trauma'],
    answer: 1, explain: 'MGCS 3-8 = grave · 9-14 = guarded · 15-18 = good · ใช้ประเมิน prognosis ใน head trauma',
    verified: 'neuroER 1 hr.pdf + master' },

  { id: 822, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['cushing-reflex'], type: 'mcq',
    q: 'Cushing reflex (ในกรณี ICP สูง) ประกอบด้วย',
    options: ['Tachycardia + hypotension + tachypnea', 'Bradycardia + hypertension + irregular respiration (terminal sign)', 'Normal vitals', 'Fever + cough'],
    answer: 1, explain: 'Cushing reflex (Cushing\'s triad) = bradycardia + ↑ BP + irregular RR · เป็น late sign ของ ↑ ICP → brain herniation imminent',
    verified: 'neuroER 1 hr.pdf' },

  { id: 823, subject: 'com3', topic: 'neuro-er', year: 4, source: 'neuroER 1 hr.pdf',
    tags: ['head-trauma', 'steroid'], type: 'tf',
    q: 'การให้ corticosteroid (เช่น dexamethasone) ใน head trauma เพื่อลด brain edema เป็นแนวทางที่แนะนำ',
    answer: false, explain: 'False! Steroid ใน head trauma → worse outcome (CRASH trial) · ห้ามใช้ · ใช้ mannitol/hypertonic saline แทน',
    verified: 'neuroER 1 hr.pdf + CRASH trial 2004' },

];
