// ============================================================
// Food Safety (Y4 Sem 1)
// ============================================================
//
// AUTO-MERGED from tmp/y4-patches/food-safety-y4.json via
// scripts/apply-y4-patches.mjs.
// Built: 2026-05-17
//
// Subject slug: food-safety-y4
// ID range: 92500–92530 (31 Qs)
// Topics: dose-response, drug-residues, e-coli-stec, food-additives, food-laws-thailand, food-pathogens, food-spoilage, haccp, listeria, milk-pasteurization, norovirus, qmra-quantitative-microbial-risk, risk-analysis-cac-framework, risk-assessment-steps, salmonella
// Flagged: 0
//
// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).
// Each Q cross-checked against ≥2 sources per extraction-agent brief.
// Academic-safety vocab sanitized across q/options/explain/verified/
// examOrigin/source per Palm rule (lint:academic-safety gates commits).
// ============================================================

export const QB_FOOD_SAFETY_Y4 = [
  {
    "id": 92500,
    "subject": "food-safety-y4",
    "topic": "risk-analysis-cac-framework",
    "year": 4,
    "source": "Food Safety Final 86, Mid 86",
    "tags": [
      "risk-analysis",
      "cac",
      "framework"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "การวิเคราะห์ความเสี่ยง (Risk analysis) ตามแนวทาง Codex Alimentarius Commission ประกอบด้วยองค์ประกอบใดบ้าง",
    "options": [
      "การสืบค้นความเสี่ยง การหลบหลีกความเสี่ยง และการปฏิบัติความเสี่ยง",
      "การประเมินความเสี่ยง การจัดการความเสี่ยง และการสื่อสารความเสี่ยง",
      "การประเมินความเสี่ยง การสืบค้นความเสี่ยง และการอธิบายความเสี่ยง",
      "การประกันความเสี่ยง การบูรณาการความเสี่ยง และการสื่อสารความเสี่ยง",
      "การประเมินความเสี่ยง การพิสูจน์ความเสี่ยง และการประเมินการสัมผัส"
    ],
    "answer": 1,
    "explain": "Risk analysis (Codex / CAC framework) = 3 องค์ประกอบหลัก: (1) Risk assessment = ประเมินทางวิทยาศาสตร์, (2) Risk management = ตัดสินใจ/ลด risk ให้อยู่ใน acceptable level, (3) Risk communication = สื่อสารกับ stakeholder ทุกฝ่าย\n\nCodex Alimentarius Commission (CAC) ภายใต้ FAO/WHO เป็นองค์กรหลักที่กำหนดแนวทาง Risk analysis สำหรับ food safety ระดับสากล",
    "verified": "Food Safety Final 86 Q3, QMRA slide"
  },
  {
    "id": 92501,
    "subject": "food-safety-y4",
    "topic": "risk-assessment-steps",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "risk-assessment",
      "hazard-identification",
      "cac"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "การประเมินความเสี่ยง (Risk assessment) ตาม Codex ประกอบด้วยกี่ขั้นตอนหลัก",
    "options": [
      "2 ขั้นตอน — Hazard identification + Risk characterization",
      "3 ขั้นตอน — Hazard identification + Hazard characterization + Risk characterization",
      "4 ขั้นตอน — Hazard identification + Hazard characterization + Exposure assessment + Risk characterization",
      "5 ขั้นตอน — Hazard identification + Hazard analysis + Exposure + Dose-response + Risk characterization",
      "6 ขั้นตอน รวม Risk communication"
    ],
    "answer": 2,
    "explain": "Risk assessment (CAC) = 4 ขั้นตอน:\n1. Hazard identification — ระบุอันตราย biological/chemical/physical ที่อาจอยู่ในอาหาร\n2. Hazard characterization — อธิบายความรุนแรง (dose-response, severity)\n3. Exposure assessment — ประเมินการสัมผัส (prevalence × concentration × consumption)\n4. Risk characterization — บูรณาการ 2+3 เพื่อประมาณ probability + severity ในประชากร\n\nRisk communication + Risk management อยู่นอก risk assessment แต่อยู่ใน risk analysis",
    "verified": "QMRA slides 4-42, Food Safety Final 86 Q8"
  },
  {
    "id": 92502,
    "subject": "food-safety-y4",
    "topic": "qmra-quantitative-microbial-risk",
    "year": 4,
    "source": "QMRA slides, Food Safety Final 86",
    "tags": [
      "exposure-assessment",
      "qmra"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "การประเมินการสัมผัส (Exposure assessment) ควรทราบข้อมูลสำคัญใดบ้าง",
    "options": [
      "ความชุกของอันตรายในอาหาร (prevalence) เท่านั้น",
      "ปริมาณการบริโภคอาหาร (consumption) เท่านั้น",
      "Prevalence + Concentration + Consumption รวมกัน",
      "Prevalence + Consumption เท่านั้น (ไม่ต้องดู concentration)",
      "ความเข้มข้นของอันตรายในอาหาร (concentration) เท่านั้น"
    ],
    "answer": 2,
    "explain": "Exposure assessment ใน QMRA ต้องการ 3 ข้อมูลรวมกัน:\n- P (prevalence) = ความชุกของเชื้อในอาหาร\n- C (concentration) = ปริมาณเชื้อต่อหน่วยอาหาร (log MPN/g)\n- m (mass) = ปริมาณการบริโภค (g)\n\nสูตร: PE = P × (1 - e^(-m × 10^C))\nDose = 10^C × m\n\nครบทั้ง 3 ตัวจึงจะคำนวณ PE และ Dose ได้",
    "verified": "QMRA slides 31-34, Food Safety Final 86 Q7"
  },
  {
    "id": 92503,
    "subject": "food-safety-y4",
    "topic": "dose-response",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "dose-response",
      "hazard-characterization"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "เส้นโค้ง dose response ของอันตรายทางจุลินทรีย์ส่วนมากมักเป็นลักษณะใด",
    "options": [
      "เส้นโค้งแบบคลื่น (sinusoidal)",
      "เส้นฟันปลา (saw-tooth)",
      "เส้นโค้งแบบลาดขึ้น (monotonic increasing — เช่น Beta-Poisson)",
      "เส้นโค้งแบบลาดลง (decreasing)",
      "เส้นตรง (linear ตลอดช่วง)"
    ],
    "answer": 2,
    "explain": "Dose-response curve สำหรับ microbial hazard ส่วนใหญ่ใช้ Beta-Poisson model:\nP(D) = 1 - [1 + Dose/β]^(-α)\n\nลักษณะเส้น = ลาดขึ้น (probability of illness เพิ่มเมื่อ dose เพิ่ม) แบบ S-curve / sigmoidal, ไม่ใช่เส้นตรง เพราะมี threshold effect ที่ low dose และ saturation ที่ high dose\n\nค่าตัวอย่าง Salmonella: α = 0.1324, β = 51.45 (slide 26)",
    "verified": "QMRA slide 26, Food Safety Final 86 Q6"
  },
  {
    "id": 92504,
    "subject": "food-safety-y4",
    "topic": "food-laws-thailand",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "sps-agreement",
      "wto",
      "codex"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ความตกลงระหว่างประเทศที่ใช้บังคับมาตรการสุขอนามัยและสุขอนามัยพืช (Sanitary and Phytosanitary measures) อยู่ภายใต้องค์กรหรือข้อตกลงใด",
    "options": [
      "World Trade Organization (WTO) ภายใต้ SPS Agreement",
      "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (ACFS)",
      "Codex Alimentarius Commission (CAC) เท่านั้น",
      "World Health Organization (WHO)",
      "World Organisation for Animal Health (WOAH/OIE)"
    ],
    "answer": 0,
    "explain": "SPS Agreement = Agreement on the Application of Sanitary and Phytosanitary Measures ภายใต้ WTO เป็นกรอบกฎหมายระหว่างประเทศที่กำกับการกำหนดมาตรการ food safety/animal-plant health ที่กระทบการค้าระหว่างประเทศ\n\nCodex = องค์กรกำหนด standards ที่ใช้อ้างอิงภายใต้ SPS\nWTO/SPS = กรอบการค้า + ระงับข้อพิพาท",
    "verified": "Food Safety Final 86 Q2, Q9"
  },
  {
    "id": 92505,
    "subject": "food-safety-y4",
    "topic": "salmonella",
    "year": 4,
    "source": "Food safety Kim85, Food Safety Final 86",
    "tags": [
      "salmonella",
      "growth-factor",
      "mesophile"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "ช่วงอุณหภูมิที่เหมาะสม (Optimal temperature) สำหรับการเจริญของ Salmonella spp. (mesophilic bacteria) คือ",
    "options": [
      "12-15 °C (psychrophilic range)",
      "25-35 °C",
      "30-45 °C",
      "50-75 °C (thermophilic range)",
      "75-100 °C"
    ],
    "answer": 2,
    "explain": "Salmonella = mesophile → Optimal 30-45 °C, Tmax ~54 °C, สามารถเจริญที่ pH 4.5-9.5 (optimum 6.5-7.5), aw > 0.93\n\nDanger zone สำหรับ food safety = 4-60 °C (40-140 °F) — ช่วงที่เชื้อ mesophile (รวม Salmonella) เจริญได้ ต้องเก็บอาหารต่ำกว่า 4 °C หรือสูงกว่า 60 °C",
    "verified": "QMRA slide 11, Food Safety Mid Choice Q3"
  },
  {
    "id": 92506,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "campylobacter",
      "guillain-barre",
      "macrolides"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ผู้หญิงคนหนึ่งคลื่นไส้ อาเจียน ท้องเสียรุนแรง หลังพบแพทย์ได้รับยาปฏิชีวนะกลุ่ม macrolides อาการดีขึ้น ต่อมาเริ่มมีอาการกล้ามเนื้อแขนขาอ่อนแรง (flaccid paralysis) ต้องนอนรักษาตัวที่โรงพยาบาล เชื้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "Campylobacter jejuni (มี Guillain-Barré syndrome เป็น sequela)",
      "Escherichia coli O157:H7",
      "Listeria monocytogenes",
      "Salmonella enterica",
      "Yersinia enterocolitica"
    ],
    "answer": 0,
    "explain": "C. jejuni → bloody diarrhea + sequela = Guillain-Barré syndrome (autoimmune-mediated flaccid paralysis เนื่องจาก molecular mimicry ของ LOS กับ ganglioside ของเส้นประสาท)\n\nClue ในโจทย์:\n- ยา macrolides (erythromycin/azithromycin) = first-line สำหรับ Campylobacter\n- Flaccid paralysis หลังท้องเสีย = pathognomonic ของ post-Campylobacter GBS\n\nเชื้อ microaerophilic ที่เจริญ 42 °C, reservoir = สัตว์ปีก/นมดิบ",
    "verified": "Food Safety Final 86 Q1, Kim85 p3"
  },
  {
    "id": 92507,
    "subject": "food-safety-y4",
    "topic": "e-coli-stec",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "ehec",
      "shiga-toxin",
      "hus",
      "hamburger"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "เด็กชายอายุ 6 ปี รับประทาน hamburger เนื้อบดสุกไม่ทั่ว 3 วันต่อมาท้องเสียเป็นเลือดรุนแรง ไม่มีไข้ ต่อมาพบ thrombocytopenia + acute kidney injury + hemolytic anemia (HUS) เชื้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "ETEC (Travelers' diarrhea — heat-labile toxin)",
      "EPEC (Infant diarrhea)",
      "EIEC (invasive, bloody mucoid)",
      "EHEC O157:H7 (Shiga toxin Stx1/Stx2 → HUS)",
      "EAEC (Aggregative, chronic diarrhea)"
    ],
    "answer": 3,
    "explain": "EHEC O157:H7 (Enterohemorrhagic E. coli) = Shiga toxin-producing E. coli (STEC)\n- Reservoir = วัว (cow)\n- Source = hamburger เนื้อบดดิบ/สุกไม่ทั่ว, นมดิบ, ผักปนเปื้อนมูลวัว\n- Toxin = Stx1, Stx2 (heat-labile) → ทำลาย 28S rRNA → endothelial damage\n- Triad ของ HUS (Hemolytic Uremic Syndrome) = MAHA + thrombocytopenia + AKI\n- ไม่มีไข้ (vs EIEC/Shigella ที่มีไข้สูง)\n\n⚠️ ห้ามให้ antibiotic ใน EHEC — เพิ่มการปล่อย Shiga toxin → HUS แย่ลง",
    "verified": "Kim85 p2, Food Safety Final 86 fill-in"
  },
  {
    "id": 92508,
    "subject": "food-safety-y4",
    "topic": "listeria",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "listeria",
      "psychrotroph",
      "abortion",
      "zero-tolerance"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Listeria monocytogenes",
    "options": [
      "Gram-negative, mesophile, ไม่ทนเค็ม",
      "Gram-positive, psychrotroph (เจริญที่ 0-4 °C), ทนเค็ม, ทนกรด, ผ่านรกได้ → abortion",
      "Gram-negative, spore-forming, สร้าง neurotoxin",
      "Gram-positive, halophilic เท่านั้น, ไม่สามารถผ่านรกได้",
      "Gram-positive, thermophile (เจริญที่ > 50 °C เท่านั้น)"
    ],
    "answer": 1,
    "explain": "L. monocytogenes (Gram +, facultative anaerobe, psychrotroph):\n- เจริญที่ 0-4 °C → อยู่ในตู้เย็นได้\n- ทนเกลือ, ทนกรด, ทนความแห้ง\n- พบใน ready-to-eat food (post-processing contamination), นมดิบ, deli meat\n- ผ่าน placenta → abortion / stillbirth ในหญิงตั้งครรภ์\n- High mortality rate (~30% ใน invasive disease)\n- Zero-tolerance policy (ห้ามมีในอาหาร 0%) — ใช้กับ Salmonella และ Listeria\n- คนติดเชื้อโดยไม่แสดงอาการได้ และ shed เชื้อในอุจจาระ\n- แยกจาก L. innocua โดย CAMP test + β-hemolysis",
    "verified": "Kim85 p3, Food Safety Final 86 Q5, Q6, Q17"
  },
  {
    "id": 92509,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "clostridium-botulinum",
      "neurotoxin",
      "low-acid-canning"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "อาหารใดเป็นตัวการสำคัญของโรคอาหารเป็นพิษจาก Clostridium botulinum",
    "options": [
      "ไก่ทอดที่ทิ้งไว้ที่อุณหภูมิห้อง",
      "ข้าวผัดที่ทิ้งไว้นาน",
      "อาหารกระป๋อง low-acid (pH > 4.6) ที่บรรจุไม่ปลอดภัย เช่น หน่อไม้ปี๊บ",
      "นมพาสเจอไรซ์",
      "ผักสดล้างน้ำสะอาด"
    ],
    "answer": 2,
    "explain": "C. botulinum:\n- Gram +, spore-forming, anaerobe → spore ทนความร้อน 121 °C\n- ปัจจัย 4 ที่ทำให้สร้าง toxin: anaerobic + low acid (pH > 4.6) + temp > 4 °C + high moisture (aw สูง)\n- อาหารเสี่ยง = อาหารกระป๋อง home-canned low-acid, หน่อไม้ปี๊บ, ปลาร้า\n- Botulinum toxin = neurotoxin ยับยั้ง acetylcholine release ที่ NMJ → descending flaccid paralysis\n- ทำลาย toxin: 80 °C 10 นาที (อุ่นก่อนเสิร์ฟ)\n- ป้องกัน: pressure canning (115 °C+) สำหรับ low-acid food, ปรับ pH < 4.6, ลด aw (salt/sugar)",
    "verified": "Kim85 p5, Food Safety Final 86 Q15, Q19, Mid Q9"
  },
  {
    "id": 92510,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "staphylococcus-aureus",
      "preformed-toxin",
      "heat-stable"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "นิสิตปี 5 กินข้าวสลัดมันฝรั่งตอน 12:00 น. เริ่มอาเจียน คลื่นไส้ ปวดท้อง ตอน 15:00 น. ไม่มีไข้ อาการดีขึ้นวันรุ่งขึ้น เชื้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "Salmonella enterica (incubation 12-36 ชม.)",
      "Staphylococcus aureus (incubation 2-4 ชม., preformed enterotoxin, ไม่มีไข้)",
      "Listeria monocytogenes",
      "Clostridium botulinum",
      "Norovirus"
    ],
    "answer": 1,
    "explain": "S. aureus food intoxication:\n- Incubation period สั้นมาก = 2-4 ชม. (เพราะกิน preformed toxin ที่อยู่ในอาหารแล้ว ไม่ต้องรอเชื้อเจริญใน GI)\n- Toxin = Staphylococcal enterotoxin (SEA, SED) → heat-stable (ต้อง 100 °C 30 นาทีจึงสลาย — การอุ่นซ้ำไม่ทำลาย)\n- กระตุ้น vagus nerve → vomiting center → คลื่นไส้/อาเจียน เด่น\n- ไม่มีไข้, หายเองภายใน 24 ชม.\n- อาหารเสี่ยง = อาหารโปรตีนสูง (สลัดมันฝรั่ง, แฮม, ไก่, ครีม) ที่คน handle ด้วยมือเปล่า\n- การวินิจฉัย = Thermostable nuclease test + Immunodiffusion test (ตรวจ enterotoxin)",
    "verified": "Food Safety Final 86 short Q1, Q6 (S. aureus mortality False), Kim85"
  },
  {
    "id": 92511,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "bacillus-cereus",
      "emetic-toxin",
      "diarrheal-toxin"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "Bacillus cereus สร้าง toxin ใดและคุณสมบัติทนความร้อนเป็นอย่างไร",
    "options": [
      "Emetic toxin (heat-resistant ทน 121 °C) + Diarrheal enterotoxin (heat-sensitive)",
      "Cholera toxin (heat-labile) เท่านั้น",
      "Shiga toxin (heat-labile) เท่านั้น",
      "Botulinum toxin (heat-labile) เท่านั้น",
      "ไม่สร้าง toxin เลย — เป็น invasive infection อย่างเดียว"
    ],
    "answer": 0,
    "explain": "B. cereus (Gram +, spore-forming) สร้าง 2 toxins:\n1. Emetic toxin (cereulide) — heat-resistant (ทน 121 °C 30 นาที), เป็น preformed toxin → intoxication → อาเจียนเร็ว (1-5 ชม.) → อาหารเสี่ยง = cooked fried rice (ข้าวผัด)\n2. Diarrheal enterotoxin — heat-sensitive, เป็น toxicoinfection (เชื้อสร้าง toxin ใน GI) → ท้องเสีย ปวดท้อง 8-16 ชม. หลังกิน → กลไกคล้าย C. perfringens (ขัดขวางการดูดซึม Na+/Cl-)\n\nการอุ่นอาหารร้อนก่อนกินไม่สามารถทำลาย emetic toxin ได้ (Final 86 Q4 → False)",
    "verified": "Kim85 p5, Food Safety Final 86 Q4"
  },
  {
    "id": 92512,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "vibrio-parahaemolyticus",
      "halophile",
      "seafood"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "เชื้อใดที่แยกได้จากน้ำและอาหารทะเลส่วนใหญ่เป็นสายพันธุ์ที่ไม่ก่อโรค ต้องการโซเดียม 1-8% ในการเจริญ และต้องมีปริมาณเชื้อจำนวนมากจึงจะก่อโรค",
    "options": [
      "Vibrio cholerae",
      "Vibrio parahaemolyticus",
      "Vibrio vulnificus",
      "Aeromonas hydrophila",
      "Listeria monocytogenes"
    ],
    "answer": 1,
    "explain": "V. parahaemolyticus:\n- Gram-, halophile (ต้องการ NaCl 1-8%)\n- พบในอาหารทะเล (หอย ปลา ปู), seasonal blooms ในน้ำทะเลอุ่น\n- ส่วนใหญ่ไม่ก่อโรค — pathogenic strain มี Kanagawa phenomenon (β-hemolysis) สร้าง hemolysin\n- ไม่สร้าง cholera toxin → invasive แต่ไม่รุนแรงเท่า cholera\n- ต้องการ infective dose สูง (~10^5-10^7 CFU)\n\n⚠️ V. cholerae ก่อ rice water stool — ไม่ใช่ V. parahaemolyticus\n⚠️ V. vulnificus → septicemia ใน underlying liver disease",
    "verified": "Food Safety Final 86 Q15 fill, Kim85 p4"
  },
  {
    "id": 92513,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "psychrotrophs",
      "cold-storage",
      "listeria-yersinia"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "เชื้อแบคทีเรียคู่ใดเป็น Gram+ และ Gram- ตามลำดับ ที่เจริญได้ในตู้เย็นที่อุณหภูมิ 0-4 °C (psychrotroph)",
    "options": [
      "Salmonella + Shigella",
      "Listeria monocytogenes + Yersinia enterocolitica",
      "Vibrio cholerae + E. coli",
      "Staphylococcus aureus + Campylobacter jejuni",
      "Clostridium botulinum + Bacillus cereus"
    ],
    "answer": 1,
    "explain": "Psychrotrophic foodborne pathogens (เจริญได้ที่ 0-4 °C):\n- L. monocytogenes (Gram +) ✓\n- Y. enterocolitica (Gram -) ✓\n- Aeromonas spp. (Gram -)\n- Bacillus cereus บางสายพันธุ์\n\nดังนั้น L. monocytogenes + Y. enterocolitica ตรงกับโจทย์ (G+/G-)\n\n💡 ตู้เย็นไม่ฆ่าเชื้อ — ต้องรู้ว่าเชื้อ psychrotroph เจริญได้ในนมที่เก็บนาน, deli meat, soft cheese",
    "verified": "Food Safety Final 86 Q14 fill-in"
  },
  {
    "id": 92514,
    "subject": "food-safety-y4",
    "topic": "norovirus",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "norovirus",
      "cruise-ship",
      "projectile-vomiting"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ระหว่างท่องเที่ยวบนเรือสำราญ มีคนจำนวนหนึ่งบนเรือป่วยด้วยอาการคลื่นไส้และอาเจียนแบบ projectile เชื้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "Salmonella enterica",
      "Hepatitis A virus",
      "Clostridium botulinum",
      "Bacillus cereus",
      "Norovirus"
    ],
    "answer": 4,
    "explain": "Norovirus:\n- non-enveloped, ssRNA, ทนทานมาก (resistant ต่อ alcohol-based hand sanitizer)\n- เป็นไวรัสที่ก่อ foodborne illness มากที่สุดในโลก\n- Hallmark = projectile vomiting + watery diarrhea ระยะสั้น 24-48 ชม.\n- Outbreak ที่มีชื่อเสียง = cruise ships, schools, nursing homes (close quarters + high attack rate)\n- Reservoir = คน (human-only)\n- ป้องกัน: hand wash ด้วยสบู่ + น้ำ (alcohol ไม่พอ), แยกผู้ป่วย, ทำความสะอาดด้วย bleach",
    "verified": "Food Safety Final 86 Q7, Q12 fill"
  },
  {
    "id": 92515,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "hepatitis-a",
      "hepatitis-e",
      "acute-hepatitis"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Hepatitis A virus (HAV) และ Hepatitis E virus (HEV)",
    "options": [
      "ก่อโรคตับเรื้อรัง (chronic hepatitis) คล้าย HBV/HCV",
      "ก่อ acute hepatitis เท่านั้น ไม่ก่อตับเรื้อรัง/มะเร็งตับ; ติดทาง fecal-oral; HEV รุนแรงในหญิงตั้งครรภ์",
      "ติดต่อทางเพศสัมพันธ์เป็นหลัก",
      "ทำให้เกิดอาการรุนแรงในเด็กเล็กมากกว่าผู้ใหญ่เสมอ",
      "วัคซีนไม่มีสำหรับ HAV"
    ],
    "answer": 1,
    "explain": "HAV + HEV (foodborne hepatitis):\n- ติดทาง fecal-oral (น้ำ/อาหารปนเปื้อน, เนื้อหมูสุกไม่ทั่ว = HEV)\n- ก่อ acute hepatitis เท่านั้น ไม่กลายเป็น chronic / cirrhosis / HCC (ต่างจาก HBV, HCV)\n- HEV ในหญิงตั้งครรภ์ → fulminant hepatitis, mortality สูง 20-25%\n- HAV อาการรุนแรงในผู้ใหญ่มากกว่าเด็ก (เด็กมักไม่แสดงอาการ)\n- มี vaccine สำหรับ HAV และ HEV (HEV vaccine ในจีน)\n\n❌ Final 86 Q3 → False (HAV+HEV ไม่ทำให้ prolonged liver damage)\n❌ Q11 → False (มี lifelong immunity หลังติดเชื้อ HAV)",
    "verified": "Food Safety Final 86 Q3, Q11, Q10 fill (HEV from pork)"
  },
  {
    "id": 92516,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "entamoeba",
      "amoebic-dysentery",
      "hyaluronidase"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "นิสิตชอบรับประทานผักสดและผลไม้ ปวดท้องรุนแรง ถ่ายเป็นมูกเลือด อุจจาระมีกลิ่นเหม็นคล้ายหัวกุ้งเน่า เชื้อใดน่าจะเป็นสาเหตุ",
    "options": [
      "Vibrio vulnificus",
      "Entamoeba histolytica",
      "E. coli O157:H7",
      "Shigella dysenteriae",
      "Vibrio parahaemolyticus"
    ],
    "answer": 1,
    "explain": "E. histolytica → amoebic dysentery:\n- ติด cyst ปนเปื้อนน้ำ/อาหาร (ผักสด/ผลไม้ล้างไม่สะอาด)\n- Trophozoite สร้าง hyaluronidase → ทำลาย mucosa colon → ulcer (flask-shape)\n- เข้า circulation → amoebic liver abscess\n- Hallmark: bloody mucoid diarrhea + กลิ่นเหม็นเฉพาะตัว (anchovy paste-like / หัวกุ้งเน่า)\n\n⚠️ Balantidium coli ก็สร้าง hyaluronidase แต่ต้องมีแผลก่อนแล้วจึงทำให้แผลใหญ่ขึ้น (E. histolytica ทำลายผนังลำไส้ปกติได้เลย → Final Q10 → False)\n\nReservoir Balantidium = หมู → Balantidiasis เป็นโรคที่หมูเป็นพาหะสำคัญ",
    "verified": "Food Safety Final 86 Q14, Q10, Q9 fill, Kim85 p6"
  },
  {
    "id": 92517,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "giardia",
      "steatorrhea",
      "malabsorption"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "เด็กมีอาการจุกแน่นบริเวณลิ้นปี่ ท้องอืดเฟ้อ อุจจาระมีไขมันปนออกมาจำนวนมาก (steatorrhea) ปรสิตชนิดใดน่าจะเป็นสาเหตุ",
    "options": [
      "Sarcocystis suihominis",
      "Cryptosporidium parvum",
      "Toxoplasma gondii",
      "Balantidium coli",
      "Giardia lamblia"
    ],
    "answer": 4,
    "explain": "G. lamblia (Giardia duodenalis):\n- Cyst → excystation ใน duodenum\n- Trophozoite เกาะ mucosa → malabsorption (non-invasive)\n- Hallmark: steatorrhea (ไขมันปน), จุกแน่นลิ้นปี่, ท้องอืด, น้ำหนักลด\n- เด็ก/นักท่องเที่ยว/ผู้ภูมิคุ้มกันบกพร่อง = เสี่ยง\n- ติดต่อทางน้ำ/อาหารปนเปื้อน cyst\n- ป้องกัน = ต้มน้ำหรือกรองก่อนดื่ม (cyst ทนคลอรีน)\n\n💡 Cryptosporidium ก็ก่อ watery diarrhea แต่ไม่มี steatorrhea เด่น และมักก่อโรครุนแรงใน HIV/immunocompromised + ลูกวัว",
    "verified": "Food Safety Final 86 Q18, Q12 (water treatment), Q16 fill, Kim85 p6"
  },
  {
    "id": 92518,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "taenia-solium",
      "neurocysticercosis",
      "pork"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ชายปวดศีรษะต่อเนื่องหลายสัปดาห์ มีอาการลมชักเป็นครั้งคราว ตรวจพบก้อน cyst ในเนื้อสมอง (neurocysticercosis) สาเหตุน่ามาจากอะไร",
    "options": [
      "Sarcocystis hominis",
      "Taenia saginata",
      "Cryptosporidium parvum",
      "Taenia solium (กินไข่/proglottid ปนเปื้อนอุจจาระ → cysticerci ฝังในสมอง)",
      "Sarcocystis suihominis"
    ],
    "answer": 3,
    "explain": "Cysticercosis (กลไกในคน) = คนกิน eggs/proglottid ของ T. solium (autoinfection หรือ fecal-oral contamination) → ตัวอ่อนทะลุลำไส้ → เลือด → ฝัง CNS/กล้ามเนื้อ/ตา = neurocysticercosis\n\nต่างจาก Taeniasis = คนกิน cysticercus ในเนื้อหมูดิบ → เติบโตเป็นพยาธิตัวเต็มวัยในลำไส้คน\n\nT. solium: คน = final host + intermediate host ได้\nT. saginata: คน = final host only (วัว = IH) → Final 86 fill Q (False — T. solium มีคนเป็น IH ได้)\n\nClue ของ neurocysticercosis: ลมชักโตวัยกลางคน, brain cyst หลายอัน, calcified lesions",
    "verified": "Food Safety Final 86 Q20, Kim85 p7"
  },
  {
    "id": 92519,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86",
    "tags": [
      "prion",
      "bse",
      "vcjd",
      "scrapie"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Prion disease และความสัมพันธ์ระหว่าง BSE, vCJD, scrapie",
    "options": [
      "ความร้อนและความดันในกระบวนการผลิตอาหารและเครื่องมือแพทย์ทำลาย prion ได้",
      "Prion = ระยะฟักตัวสั้น/นาน? = นานกว่าโรคติดต่อทางอาหารอื่น และผู้ป่วยเสียชีวิตทุกราย; คนติด vCJD จากการบริโภคเนื้อวัวที่เป็น BSE",
      "Scrapie ในแกะไม่สามารถถ่ายให้วัวได้",
      "คนติด CJD (ไม่ใช่ vCJD) จากการกินเนื้อวัว BSE",
      "CJD มี incubation period สั้นกว่าและตายไวกว่า vCJD"
    ],
    "answer": 1,
    "explain": "Prion (proteinaceous infectious particle):\n- ระยะฟักตัวนานมาก (หลายปี — สิบ ปี) นานกว่าโรคติดต่อทางอาหารอื่น\n- ไม่มีการรักษา → mortality 100%\n- BSE (Bovine spongiform encephalopathy / โรควัวบ้า) ในวัว → คนกินเนื้อวัวติด BSE → variant CJD (vCJD)\n- Scrapie (ในแกะ) → ถ้านำเนื้อ/กระดูกแกะที่เป็น scrapie ไปให้วัวกิน → วัวเป็น BSE ได้ (origin ของ BSE epidemic)\n- คน → vCJD (ไม่ใช่ classical CJD — classical CJD = sporadic, ไม่เกี่ยวกับการกินอาหาร)\n- vCJD มี incubation period นานกว่าและอายุน้อยกว่า classical CJD; classical CJD ก้าวหน้าเร็วกว่า\n- ความร้อน/ความดันปกติทำลาย prion ไม่ได้ → ต้อง autoclave 134 °C 1 ชม. + NaOH",
    "verified": "Food Safety Final 86 last page fills (scrapie→BSE True, vCJD True, HAV/HEV chronic False, ความร้อนทำลาย prion False)"
  },
  {
    "id": 92520,
    "subject": "food-safety-y4",
    "topic": "food-additives",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "sodium-nitrite",
      "botulinum",
      "preservative",
      "cured-meat"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "วัตถุประสงค์ของการใช้สารประกอบไนไตรท์ (Sodium nitrite) ในการถนอมอาหารประเภทเนื้อสัตว์ คือข้อใด",
    "options": [
      "ยับยั้ง C. botulinum, เป็นสารกันเสีย และสารแต่งสี (สีแดง/ชมพูของ cured meat)",
      "ยับยั้ง C. perfringens, เป็นสารกันเสีย และสารทำตัว",
      "ยับยั้ง C. botulinum, เป็นสารกันเสีย และสารทำตัว",
      "ยับยั้ง C. perfringens, เป็นสารกันเสีย และสารแต่งสี",
      "ยับยั้ง C. perfringens, เป็นสารกันเสีย และสารฟอกขาว"
    ],
    "answer": 0,
    "explain": "Sodium nitrite (NaNO2) ใน cured meats (เบคอน, แฮม, ไส้กรอก):\n1. ยับยั้ง C. botulinum spore germination (สำคัญสุดสำหรับ food safety) — ป้องกัน botulism\n2. Preservative (กันเสีย — ยับยั้ง spoilage bacteria)\n3. Color fixative — NaNO2 → NO → จับกับ myoglobin → nitrosomyoglobin (สีแดง/ชมพูสด)\n4. Flavor enhancer\n\n⚠️ Risk = nitrite + secondary amines (ในกระเพาะ) → nitrosamines = IARC Group 2A (probable carcinogen) → จำกัด max residue level\n\n💡 จำคู่: nitrite ↔ botulinum (low-acid food → botulinum spore เสี่ยงสุด)",
    "verified": "Food Safety Mid Choice Q4"
  },
  {
    "id": 92521,
    "subject": "food-safety-y4",
    "topic": "food-additives",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "banned-additives",
      "dulcin",
      "formaldehyde",
      "borax"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "ข้อใดเป็นกลุ่มสารที่กระทรวงสาธารณสุขประกาศ ห้าม ใช้เป็นส่วนประกอบในอาหารทุกชนิด",
    "options": [
      "Salicylic acid, steviol glycosides, formalin",
      "Cyclamate, coumarin, dihydrocoumarin",
      "Borax, boric acid, benzoic acid",
      "Potassium chlorate, monopotassium glutamate, sodium nitrate",
      "Dulcin, formaldehyde, diethylene glycol"
    ],
    "answer": 4,
    "explain": "สารห้ามใช้ในอาหารตามประกาศกระทรวงสาธารณสุขไทย (vatthu thi haam):\n- Dulcin (สารให้ความหวาน carcinogen)\n- Formaldehyde (formalin — ฟอร์มาลีน, ใช้ดองศพ ห้ามใน food)\n- Diethylene glycol (พิษต่อไต)\n- Boric acid / Borax (น้ำประสานทอง — toxic ต่อ kidney/GI)\n- Salicylic acid (anti-microbial เก่า — toxic)\n- Potassium chlorate (toxic)\n\n💡 อย่าสับสน:\n- Steviol glycosides = อนุญาต (sweetener ธรรมชาติ)\n- Cyclamate = ห้ามในสหรัฐ แต่ไทยอนุญาตในบาง category\n- Benzoic acid = อนุญาต (preservative มาตรฐาน, ADI 5 mg/kg)\n- Sodium nitrate / nitrite = อนุญาตใน cured meat ภายในขีดจำกัด",
    "verified": "Food Safety Mid Choice Q15"
  },
  {
    "id": 92522,
    "subject": "food-safety-y4",
    "topic": "food-additives",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "adi",
      "jecfa",
      "toxicology"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "Acceptable Daily Intake (ADI) มีความหมายตามข้อใด",
    "options": [
      "ปริมาณวัตถุเจือปนอาหารที่มนุษย์สามารถบริโภคได้ต่อวันเป็นเวลาตลอดชีวิตโดยไม่ก่อให้เกิดอาการผิดปกติใดๆ มีหน่วยเป็น mg/kg-bw/day",
      "ปริมาณสูงสุดของสารตกค้างที่ใส่ในอาหารสัตว์ทดลองแล้ว ไม่ทำให้เกิดความผิดปกติในสัตว์นั้น มีหน่วยเป็น mg/kg-food/day",
      "ปริมาณสูงสุดของสารตกค้างที่ใส่ในอาหารสัตว์ทดลองแล้ว ไม่ทำให้เกิดความผิดปกติในสัตว์นั้น มีหน่วยเป็น mg/kg-bw/day",
      "ปริมาณต่ำสุดของสารตกค้างที่ใส่เข้าสัตว์ทดลองแล้ว ไม่สังเกตเห็นความผิดปกติ มีหน่วยเป็น mg/kg-bw/day",
      "ปริมาณสูงสุดของสารเจือปนอาหารที่มนุษย์สามารถบริโภคได้ต่อวันเป็นเวลาตลอดชีวิต มีหน่วยเป็น mg/kg-food/day"
    ],
    "answer": 0,
    "explain": "ADI (Acceptable Daily Intake) = ปริมาณวัตถุเจือปน/สารพิษที่บริโภคได้ทุกวันตลอดชีวิตโดยไม่เกิดความเสี่ยงต่อสุขภาพ\n- หน่วย: mg/kg body weight/day\n- คำนวณจาก NOAEL ÷ Safety factor (มักใช้ 100 = 10×inter-species × 10×intra-species)\n\nองค์กรกำหนด ADI:\n- JECFA (Joint FAO/WHO Expert Committee on Food Additives) → food additives + contaminants\n- JMPR (Joint Meeting on Pesticide Residues) → pesticide MRLs\n\n⚠️ อย่าสับสน:\n- ADI = หน่วย mg/kg-bw/day (น้ำหนักตัว ไม่ใช่อาหาร)\n- MRL = mg/kg อาหาร (สำหรับ residue limit)\n- NOAEL = ค่าสูงสุดที่ไม่พบ adverse effect ในสัตว์ทดลอง\n- LOAEL = ค่าต่ำสุดที่ยังพบ adverse effect (LOAEL ≥ NOAEL เสมอ)",
    "verified": "Food Safety Mid Choice Q17, Q20 (JECFA)"
  },
  {
    "id": 92523,
    "subject": "food-safety-y4",
    "topic": "food-additives",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "iarc-groups",
      "carcinogen-classification"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "การจัดกลุ่มสารก่อมะเร็งของ International Agency for Research on Cancer (IARC) กลุ่ม 2A หมายถึงข้อใด",
    "options": [
      "Carcinogenic to humans (ข้อมูลในมนุษย์เพียงพอ)",
      "Probably carcinogenic to humans (ข้อมูลในมนุษย์ จำกัด/น่าจะ + ข้อมูลในสัตว์ เพียงพอ)",
      "Possibly carcinogenic to humans (ข้อมูลในมนุษย์ จำกัด + ข้อมูลในสัตว์ ไม่เพียงพอ)",
      "Not classifiable as to its carcinogenicity to humans",
      "Probably not carcinogenic to humans"
    ],
    "answer": 1,
    "explain": "IARC carcinogen classification:\n- Group 1 = Carcinogenic to humans (มีหลักฐานในมนุษย์เพียงพอ — เช่น aflatoxin B1, asbestos, vinyl chloride, tobacco)\n- Group 2A = Probably carcinogenic (ข้อมูลในมนุษย์ limited + ข้อมูลในสัตว์ sufficient — เช่น styrene, antimony trioxide, red meat)\n- Group 2B = Possibly carcinogenic (ข้อมูลในมนุษย์ inadequate + ข้อมูลในสัตว์ limited/sufficient — เช่น DEHP, BPA bisphenol, ochratoxin, fumonisin)\n- Group 3 = Not classifiable (insufficient evidence — DON, zearalenone)\n- Group 4 = Probably not carcinogenic (เลิกใช้แล้วใน IARC 2019)\n\n💡 จำตัวอย่าง: vinyl chloride = 1, styrene = 2A, DEHP = 2B, DON/zearalenone = 3",
    "verified": "Food Safety Mid Choice Q16, packaging Q1-Q10 (IARC groups)"
  },
  {
    "id": 92524,
    "subject": "food-safety-y4",
    "topic": "food-additives",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "packaging",
      "dehp",
      "endocrine-disruptor",
      "phthalate"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "สารใดต่อไปนี้ที่ปนเปื้อนจากบรรจุภัณฑ์อาหารและเป็น endocrine disruptor (สารรบกวนระบบต่อมไร้ท่อ)",
    "options": [
      "Antimony trioxide เท่านั้น",
      "Lead เท่านั้น",
      "Bisphenol A (BPA) + Di(2-ethylhexyl)phthalate (DEHP) + Nonylphenol (3 ตัวร่วม)",
      "Vinyl chloride monomer เท่านั้น",
      "Styrene เท่านั้น"
    ],
    "answer": 2,
    "explain": "Endocrine disruptors จากบรรจุภัณฑ์อาหาร (3 ตัวสำคัญ):\n1. BPA (Bisphenol A) — จาก polycarbonate + epoxy lining ของกระป๋อง → estrogen-mimicking\n2. DEHP (Di(2-ethylhexyl)phthalate) — plasticizer ใน PVC → anti-androgen, IARC Group 2B\n3. Nonylphenol — surfactant + impurity → estrogen-mimicking\n\nรบกวน hormone signaling (estrogen, androgen, thyroid) → reproductive disorders, developmental defects\n\n⚠️ Antimony trioxide จาก PET = IARC 2B carcinogen แต่ไม่ใช่ endocrine disruptor\n⚠️ Styrene จาก polystyrene = IARC 2A + CNS effect แต่ไม่ใช่ endocrine disruptor",
    "verified": "Food Safety Mid Choice Q2, Q12, packaging Q3-Q5"
  },
  {
    "id": 92525,
    "subject": "food-safety-y4",
    "topic": "drug-residues",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "withdrawal-period",
      "mrl",
      "drug-residue"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับระยะเวลาการหยุดยา (Withdrawal period) ในสัตว์",
    "options": [
      "เป็นระยะเวลาที่สัตว์ได้รับยาครั้งสุดท้ายจนถึงสัตว์ถูกส่งเข้าเชือดหรือเก็บผลิตภัณฑ์เพื่อบริโภค ซึ่งจะอาจพบยาตกค้างในเนื้อแต่ต่ำกว่า MRL",
      "ระยะเวลาที่หยุดยาแล้วต้องไม่พบยาตกค้างในเนื้อ/ผลิตภัณฑ์เลย",
      "ยาทุกชนิดมีระยะเวลาการหยุดยาเท่ากันเสมอ ไม่ขึ้นกับสัตว์/วิธีการให้ยา",
      "MRL = ปริมาณยาตกค้างสูงสุด เท่ากันทุกอวัยวะของสัตว์ทุกชนิด",
      "Premi®Test (microbial tube test) สามารถตรวจยาตกค้างได้ทุกชนิด/ทุกกลุ่ม"
    ],
    "answer": 0,
    "explain": "Withdrawal period (WDT) = ช่วงเวลาตั้งแต่สัตว์ได้รับยาครั้งสุดท้ายจนถึงเชือด/เก็บผลิตภัณฑ์ (นม ไข่ เนื้อ) เพื่อให้มั่นใจว่ายาตกค้างในเนื้อเยื่อ ≤ MRL\n- พบยาตกค้างได้ แต่ต้อง < MRL (ไม่ใช่ 0)\n- แตกต่างกันตามชนิดยา + ชนิดสัตว์ + วิธีให้ + dose + frequency + animal health\n\n⚠️ ข้อสอบ Mid Q20 → True (WDT = ระยะเวลาที่กล่าว, แต่ในที่นี้ผู้สอนตอบว่าจะไม่พบยาเลย — ตามข้อมูล Final ตอบ False เพราะพบบ้างแต่น้อย)\n\nMRL (Maximum Residue Limit):\n- หน่วย mg/kg อาหาร (ไม่ใช่ bw)\n- แตกต่างกันตามชนิดยา + ชนิดสัตว์ + tissue (liver/kidney/muscle/fat) — แต่ละ tissue อาจมี MRL ต่างกัน\n\nPremi®Test = screening (broad-spectrum antibiotic detection) ไม่ใช่ confirmatory + ไม่ครอบคลุมยาทุกกลุ่ม",
    "verified": "Food Safety Mid Choice Q8, Q20, Q21"
  },
  {
    "id": 92526,
    "subject": "food-safety-y4",
    "topic": "drug-residues",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "chloramphenicol",
      "aplastic-anemia",
      "banned-veterinary"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "ยาสัตว์ตกค้างที่ก่อความเป็นพิษโดยกดการทำงานของไขกระดูก ทำให้เกิดภาวะ aplastic anemia ในมนุษย์ และถูกห้ามใช้ในสัตว์ที่ให้ผลผลิตเป็นอาหาร (food-producing animals) ได้แก่",
    "options": [
      "Chloramphenicol และ Phenylbutazone",
      "Penicillin และ Tetracycline",
      "Sulfonamide และ Trimethoprim",
      "Amoxicillin และ Ampicillin",
      "Enrofloxacin และ Marbofloxacin"
    ],
    "answer": 0,
    "explain": "Chloramphenicol:\n- ห้ามใช้ใน food-producing animals ทั่วโลก (รวมไทย)\n- กลไกพิษ = idiosyncratic aplastic anemia (genetic susceptibility, dose-independent, fatal)\n- ไม่มี safe MRL → ห้ามตกค้างเลย\n\nPhenylbutazone:\n- NSAID, ห้ามใน food-producing animals (ใช้ได้เฉพาะม้าแข่ง/สัตว์เลี้ยง)\n- กดไขกระดูก → aplastic anemia + agranulocytosis\n\n⚠️ Nitrofurans (furazolidone) = ห้ามเช่นกัน, เป็น carcinogen + mutagen → จำคู่ banned drugs: chloramphenicol + nitrofurans + phenylbutazone + dapsone (บางประเทศ) + metronidazole (บางกรณี)",
    "verified": "Food Safety Mid Choice Q14, Q9 (nitrofurans banned)"
  },
  {
    "id": 92527,
    "subject": "food-safety-y4",
    "topic": "milk-pasteurization",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "uht",
      "pasteurization",
      "coxiella-burnetii"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "วิธี UHT (Ultra-High Temperature) สำหรับน้ำนมที่ทำให้เก็บได้ที่อุณหภูมิห้องและมีอายุการเก็บนานกว่าน้ำนม pasteurized คือข้อใด",
    "options": [
      "72 °C 30 นาที (LTLT pasteurization)",
      "135 °C 20 นาที (overcooked)",
      "135 °C 2-3 วินาที — ทำลายจุลินทรีย์ทั้งหมดรวม spore + บรรจุปลอดเชื้อในภาชนะปลอดเชื้อ",
      "72 °C 15 วินาที (HTST pasteurization)",
      "63 °C 30 นาที (vat pasteurization)"
    ],
    "answer": 2,
    "explain": "Milk thermal processing:\n- Vat / LTLT (Low Temp Long Time): 63 °C 30 min — pasteurization\n- HTST (High Temp Short Time): 72 °C 15 sec — pasteurization (target = Coxiella burnetii — most heat-resistant non-spore-former ในนม)\n- UHT (Ultra-High Temp): 135-150 °C 2-5 sec — commercial sterility + aseptic packaging → shelf-stable at room temp 6+ เดือน\n\nUHT ฆ่าเชื้อรวม spore (ทำลายจุลินทรีย์เป้าหมายในนมดิบ = spore-forming bacteria) แต่ heat-resistant enzyme อาจเหลือ → flavor change\n\n⚠️ Pasteurization (HTST) target = Coxiella burnetii (Q fever) — เชื้อที่ทนความร้อนสุดที่ไม่ใช่ spore\n⚠️ Liquid egg pasteurization target = Salmonella Seftenberg (heat-resistant Salmonella)",
    "verified": "Food Safety Mid Choice Q11, Mid Q9-Q11 (heat target organisms)"
  },
  {
    "id": 92528,
    "subject": "food-safety-y4",
    "topic": "food-spoilage",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "maillard-reaction",
      "melanoidin",
      "lipid-oxidation"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "Melanoidin เป็นสารสีน้ำตาลเข้ม-ดำที่เกิดขึ้นในอาหารทำให้อาหารมีสีน้ำตาลเข้ม ซึ่งเป็นผลผลิตของปฏิกิริยาใด",
    "options": [
      "Caramelization (น้ำตาลเดี่ยวด้วยกันเอง)",
      "Melanosis โดยเอนไซม์ lipase เปลี่ยนกรดไขมันเป็น melanoidin",
      "Melanosis โดยเอนไซม์ tryptophanase เปลี่ยน tryptophan เป็น melanoidin",
      "Maillard reaction ระหว่าง reducing sugar กับกรดไขมันในอาหาร",
      "Maillard reaction ระหว่าง reducing sugar กับกรดอะมิโนในอาหาร"
    ],
    "answer": 4,
    "explain": "Maillard reaction (non-enzymatic browning):\n- Reducing sugar (glucose, fructose, lactose) + กรดอะมิโน (amine group ของ protein) → Amadori products → melanoidin (สีน้ำตาลเข้ม) + aroma compounds\n- เกิดได้ที่ T สูง (>140 °C) + aw ปานกลาง (0.6-0.7)\n- ตัวอย่าง: ขนมปังกรอบ, เนื้อย่าง, กาแฟคั่ว, นมข้นหวาน, อาหารที่ผ่านความร้อน\n\nผลต่อคุณภาพอาหาร:\n- เปลี่ยน color, flavor (positive — desired ใน roast)\n- ลด nutritional value (lysine ลดลง)\n- เกิด acrylamide (carcinogen 2A) ในอาหารคาร์โบไฮเดรตสูงที่ผ่านความร้อนสูง (มันฝรั่งทอด, ขนมปังไหม้)\n\n⚠️ ต่าง Caramelization = sugar-only (ไม่มี amino acid), เกิดที่ T > 160 °C",
    "verified": "Food Safety Mid Choice Q2, Q18"
  },
  {
    "id": 92529,
    "subject": "food-safety-y4",
    "topic": "haccp",
    "year": 4,
    "source": "Food Safety Mid Choice 86",
    "tags": [
      "sampling-plan",
      "n-c-m-M",
      "two-class-plan"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Mid 86",
    "q": "แผนสุ่มตัวอย่างของอาหาร Poultry meat กำหนด SPC, n=20, c=12, m=5×10⁵, M=5×10⁶ ถ้าสุ่ม 20 ตัวอย่างพบว่า 12 ตัวอย่างมีปริมาณเชื้อ 5×10⁶ จะยอมรับหรือปฏิเสธอาหาร lot นี้",
    "options": [
      "ยอมรับ — เพราะจำนวนตัวอย่างที่เกินค่า m แต่ไม่เกินค่า M (= 12 = c) ยังอยู่ในเกณฑ์",
      "ปฏิเสธ — เพราะเกิน c",
      "ยอมรับ — เพราะเกิน M ไม่กี่ตัวอย่าง",
      "ปฏิเสธ — เพราะเชื้อเกิน m เพียงเล็กน้อย",
      "ยอมรับโดยไม่เงื่อนไข"
    ],
    "answer": 0,
    "explain": "Sampling plan (3-class):\n- n = จำนวนตัวอย่างทั้งหมดที่สุ่ม (20)\n- c = จำนวนตัวอย่างสูงสุดที่อนุญาตให้อยู่ระหว่าง m-M (marginal)\n- m = limit ที่ยอมรับ (ตัวอย่างควรอยู่ ≤ m)\n- M = limit ที่ปฏิเสธทันที (เกิน M = reject)\n\nกฎ:\n- ถ้ามีตัวอย่างใด > M → reject (ไม่ว่ากี่ตัว)\n- ถ้าจำนวนตัวอย่างระหว่าง m-M > c → reject\n- ถ้าจำนวนระหว่าง m-M ≤ c และไม่มีใครเกิน M → accept\n\nโจทย์: 12 ตัวอย่างมีค่า 5×10⁶ = ค่า M พอดี (ไม่เกิน M)\n- 12 = c พอดี (ไม่เกิน c)\n→ Accept\n\n⚠️ ถ้า 2 ตัวอย่างมี 6×10⁶ (เกิน M) → reject ทันที (Mid Q2)",
    "verified": "Food Safety Mid Choice sampling-plan Q1, Q2"
  },
  {
    "id": 92530,
    "subject": "food-safety-y4",
    "topic": "food-pathogens",
    "year": 4,
    "source": "Food Safety Final 86, Kim85",
    "tags": [
      "rotavirus",
      "non-enveloped",
      "children-diarrhea"
    ],
    "type": "mcq",
    "examOrigin": "Food Safety Final 86",
    "q": "ข้อใดถูกต้องเกี่ยวกับ Rotavirus",
    "options": [
      "Enveloped, dsRNA, ทำลายด้วย alcohol-based sanitizer ได้ง่าย",
      "Non-enveloped, dsRNA, highly contagious, ทนทานในสิ่งแวดล้อม, ก่อโรคในเด็กเล็กที่สุด, ติดเชื้อซ้ำได้แต่อาการอ่อนลง",
      "Enveloped, ssRNA, ก่อโรคในผู้ใหญ่เท่านั้น",
      "Non-enveloped, ssDNA, ก่อ chronic hepatitis",
      "Lifelong immunity หลังติดครั้งแรก ไม่ติดซ้ำเลย"
    ],
    "answer": 1,
    "explain": "Rotavirus:\n- non-enveloped, dsRNA virus (Reoviridae)\n- Highly contagious (low infectious dose ~10 viral particles)\n- ทนทานในสิ่งแวดล้อม → พบทั่วโลก (พัฒนาแล้ว+กำลังพัฒนา) — non-enveloped จึงทนต่อ alcohol/heat ปานกลาง\n- ก่อโรคในเด็กเล็ก (< 5 ปี) — เป็น leading cause of severe diarrhea ในเด็กทั่วโลก\n- ติดเชื้อซ้ำได้ แต่อาการลดลงตามอายุ (partial immunity)\n- มี vaccine (Rotarix, RotaTeq) — ลด severe diarrhea + mortality\n- ทำให้เกิดอาการนอก GI ได้บางครั้ง (encephalopathy, seizure, RTI) → Final Q13 → True\n\n⚠️ Norovirus = ไวรัสที่ก่อ foodborne illness มากที่สุดในผู้ใหญ่ — Rotavirus = ก่อในเด็ก",
    "verified": "Food Safety Final 86 Q2 fill (Rotavirus), Q12 fill (Norovirus vs Rotavirus), Q13, Kim85 p5"
  }
];
