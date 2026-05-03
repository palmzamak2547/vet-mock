// ──────────────────────────────────────────────────────────────────
// Short-Answer + Fill-In + Essay Questions — separated from MCQ pool
// ──────────────────────────────────────────────────────────────────
// Per Palm 2026-05-04: "อยากให้มีเติมคำหรือเขียนตอบสั้นๆหรือข้อเขียน
// ตามในข้อสอบเก่าที่มีด้วย แต่แยกส่วนก็ดีไม่งั้นจะปนกับข้อสอบที่มีอยู่ไปหมด"
//
// 🎯 Separation mechanism (already built into the system):
//   • type: 'short' / 'essay' → questionCategory(q) = 'writing'
//   • Default ConfigView chip = 'mcq' → these Qs auto-excluded
//   • To practice these, user picks chip = 'writing' (or 'all')
//   • Auto-graded via keywords (≥75% coverage = correct)
//   • Excluded from spaced-repetition scheduler (sr-filter.js)
//
// 🔬 Q types used:
//   'short'  → free text, graded by keyword match (q.keywords array)
//   'fill'   → fill-in-the-blank, exact match per slot (q.blanks array)
//   'essay'  → open-ended writing, never auto-graded (manual review)
//
// Sources: same past-paper / lecture / background as MCQ banks
// Q ID range: 2200-2299 (free range · separate from MCQ ranges)
// ──────────────────────────────────────────────────────────────────

export const QB_SHORT = [
  // ═══════════════════════════════════════════════════════════
  // POULTRY · Final scope · Short-answer + Fill-in
  // ═══════════════════════════════════════════════════════════

  { id: 2200, subject: 'poultry', topic: 'avian-zoonosis', year: 4,
    source: 'Aj. Kamonpan slide L10 + Kim85 Poultry Final',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['zoonosis', 'fill'], type: 'fill',
    q: 'จงเติมเชื้อก่อโรคของ avian zoonoses ต่อไปนี้ให้ถูกต้อง:\n1) Chlamydiosis (psittacosis) เกิดจากเชื้อ ___ \n2) Avian TB เกิดจาก Mycobacterium ___\n3) Q Fever เกิดจาก ___ burnetii',
    blanks: ['Chlamydia psittaci', 'avium', 'Coxiella'],
    explain: 'Chlamydiosis = Chlamydia psittaci (Gram-neg obligate intracellular) · Avian TB = Mycobacterium avium · Q Fever = Coxiella burnetii (zoonotic from poultry/livestock)' },

  { id: 2201, subject: 'poultry', topic: 'avian-drugs', year: 4,
    source: 'Aj. Niwat slide L13 banned drugs',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['banned-drugs', 'short'], type: 'short',
    q: 'ในการเลี้ยงสัตว์ปีกเชิงพาณิชย์ของไทย ยา/สารห้ามใช้เด็ดขาดมี 4 กลุ่มหลัก จงระบุชื่อยาในแต่ละกลุ่มอย่างน้อย 1 ตัวอย่าง',
    keywords: ['Vancomycin', 'DES', 'Diethylstilbestrol', 'Chloramphenicol', 'CAP', 'Nitrofurans', 'Furazolidone'],
    explain: 'ยาห้ามใช้ใน poultry production (Aj. Niwat L13):\n1. **Vancomycin** — last-resort human antibiotic, ห้ามใช้ในสัตว์อาหาร\n2. **DES (Diethylstilbestrol)** — synthetic estrogen, carcinogen\n3. **Chloramphenicol (CAP)** — bone marrow toxicity in humans\n4. **Nitrofurans** (Furazolidone, Nitrofurazone) — carcinogenic\n\n💡 Common reason: ตกค้างในผลิตภัณฑ์ → ผู้บริโภคได้รับ → mutagenic/carcinogenic/AMR' },

  { id: 2202, subject: 'poultry', topic: 'biosecurity', year: 4,
    source: 'Aj. Nataya slide L11 + Nicky 86 master p.28',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['biosecurity', '3-levels', 'fill'], type: 'fill',
    q: 'Biosecurity ในฟาร์มสัตว์ปีกแบ่งเป็น 3 levels: \n1) ___ Biosecurity = แผนผังโครงสร้างฟาร์ม (zoning, fencing) \n2) ___ Biosecurity = อุปกรณ์ + ระบบ (boot dip, shower-in) \n3) ___ Biosecurity = ขั้นตอนปฏิบัติ + monitoring',
    blanks: ['Conceptual', 'Structural', 'Procedural'],
    explain: '3 Levels of Biosecurity (Aj. Nataya):\n1. **Conceptual** = แนวคิดและแผนผังของฟาร์ม (ระยะห่าง · zone separation · pest exclusion)\n2. **Structural** = สิ่งก่อสร้าง + อุปกรณ์ (boot dip, perimeter fence, dedicated equipment per house)\n3. **Procedural** = SOP / monitoring (employee training, water quality test pH+heavy metals+bacterial count, feed quality, recordkeeping)' },

  { id: 2203, subject: 'poultry', topic: 'quality-assurance', year: 4,
    source: 'Aj. Ekasingh L14-15 Quality Assurance',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['QA', 'PDCA', 'short'], type: 'short',
    q: 'PDCA cycle เป็น quality framework ที่ Aj. Ekasingh สอนใน Poultry QA · จงอธิบายแต่ละ step ของ PDCA สั้นๆ และยกตัวอย่าง 1 case ในฟาร์มไก่',
    keywords: ['Plan', 'Do', 'Check', 'Act', 'continuous improvement', 'PDCA'],
    explain: 'PDCA cycle (Deming wheel):\n• **Plan** — ระบุปัญหา + วางแผน (เช่น egg quality drop)\n• **Do** — ลงมือทำตามแผน (test new feed formulation in 1 house)\n• **Check** — เก็บข้อมูล + ประเมิน (egg quality scores, Haugh Unit)\n• **Act** — ปรับใช้ + standardize (rollout if successful · revise if not)\n\n💡 Continuous improvement → loop กลับ Plan ใหม่' },

  // ═══════════════════════════════════════════════════════════
  // VET PRAC RUM · Final scope · Short-answer
  // ═══════════════════════════════════════════════════════════

  { id: 2210, subject: 'practrum', topic: 'rumenotomy', year: 4,
    source: 'Aj. Ekkapol Lecture 2026 + pp\'s vet prac rum final85',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['rumenotomy', 'indication', 'fill'], type: 'fill',
    q: 'Indications หลักของ rumenotomy ในวัวมี 6 ข้อ จงเติม 4 ข้อแรก:\n1) Hardware disease / ___ disease\n2) Frothy ___\n3) Persistent ___ impaction\n4) Some forms of ___',
    blanks: ['Traumatic Reticuloperitonitis', 'bloat', 'rumen', 'choke'],
    explain: 'Rumenotomy indications (Aj. Ekkapol L13):\n1. Hardware disease / Traumatic Reticuloperitonitis (TRP)\n2. Frothy bloat (ระบาย gas + foam)\n3. Persistent rumen impaction\n4. Some forms of choke (FB stuck)\n5. Other foreign bodies in reticulum\n6. Exploration of rumen, reticulum, parts of omasum' },

  { id: 2211, subject: 'practrum', topic: 'bovine-anesthesia', year: 4,
    source: 'Sunsun84 anesthesia + Aj. Ekkapol L13 epidural',
    sourceType: 'student-compilation',
    confidence: 'EXTRACTED',
    tags: ['epidural', 'sacrococcygeal', 'fill'], type: 'fill',
    q: 'Caudal epidural block ในวัว: ฉีด lidocaine 2% ที่ ___-___ space (between vertebrae) · dose ___ ml/100 kg · max ___ ml',
    blanks: ['S5', 'C1', '1', '6'],
    explain: 'Caudal epidural block (Aj. Ekkapol):\n• Site: **Sacrococcygeal (S5-Co1) space** หรือ first intercoccygeal (Co1-Co2)\n• Anesthetic: 2% Lidocaine\n• Dose: **1 ml/100 kg**\n• Maximum: **6 ml**\n• Technique: loss of resistance + hanging drop\n• Indication: perineal sx, c-section, dystocia' },

  // ═══════════════════════════════════════════════════════════
  // CLIN APP RUM · Final scope · Short-answer
  // ═══════════════════════════════════════════════════════════

  { id: 2220, subject: 'cliapprum', topic: 'metabolism-nutrition', year: 4,
    source: 'Clin App Ruminant master p.6',
    sourceType: 'student-compilation',
    confidence: 'EXTRACTED',
    tags: ['feces-score', 'short'], type: 'short',
    q: 'ฟาร์มโคนมหนึ่งทำการประเมิน feces score ทั้งฝูง พบว่ามี cow >40% ที่ score 1-2 (เหลว) จงวินิจฉัยแยกโรคที่เป็นไปได้ + แนวทางจัดการเบื้องต้น',
    keywords: ['acidosis', 'subacute rumen', 'SARA', 'parasitism', 'Johne', 'over-feeding protein', 'fiber', 'concentrate'],
    explain: 'ฝูงที่มี feces score 1-2 มากกว่า 40% — DDx:\n1. **Subacute Rumen Acidosis (SARA)** — high concentrate, low effective fiber\n2. **Over-feeding protein** หรือ fresh lush pasture\n3. **Parasitism** (gastrointestinal nematodes — fecal egg count)\n4. **Johne\'s disease** (paratuberculosis · chronic, weight loss)\n5. **Mineral imbalance** (high K, low Na)\n\n💡 แนวทางจัดการ:\n• Review TMR formula → check R:C ratio + peNDF >21%\n• Sample fecal for parasites + Johne\'s ELISA\n• Adjust feeding sequence (forage first then concentrate)\n• Add buffer (NaHCO3 1-2% of DM)\n• Monitor rumen pH (cowside test)' },

  { id: 2221, subject: 'cliapprum', topic: 'gi-surgery-sawita', year: 4,
    source: 'อ.ศวิตา GI Surgery I lecture',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['LDA', 'omentopexy', 'short'], type: 'short',
    q: 'อธิบาย procedure การทำ Right Flank Omentopexy เพื่อแก้ LDA · ระบุ approach, key steps (≥4 ขั้น), suture pattern + ภาวะแทรกซ้อนที่ต้องระวัง',
    keywords: ['right flank', 'paralumbar', 'standing', 'decompress', 'omentum', 'horizontal mattress', 'peritonitis', 'absorbable'],
    explain: '**Right Flank Omentopexy** (LDA correction · standing):\n\n📋 Procedure:\n1. **Right paralumbar fossa incision** (3-5 cm caudal to last rib · standing position)\n2. Reach into abdomen, palpate LDA on left side\n3. **Decompress abomasum** with needle/trocar (release gas)\n4. Manually pull abomasum back to ventral right position\n5. Identify pylorus + greater omentum\n6. **Suture greater omentum** to peritoneum + transversus abdominis (ventral right)\n7. Pattern: **horizontal mattress** with long-term absorbable suture\n8. Close 3 layers (peritoneum/transversus → internal oblique → external oblique) + skin\n\n⚠️ Complications:\n• Re-displacement (10-20% risk)\n• Peritonitis from contamination\n• Adhesions\n• Suture line failure if absorbable too rapidly\n\n💡 Post-op: NSAID + AB (Pendistrep IM × 5d) + monitor DMI return' },

  // ═══════════════════════════════════════════════════════════
  // REPRO LECT · Final scope · Short-answer
  // ═══════════════════════════════════════════════════════════

  { id: 2230, subject: 'repro-lect', topic: 'hormonal-applications', year: 4,
    source: 'Aj. SP L15 Hormonal Applications',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['contraception', 'progestin', 'fill'], type: 'fill',
    q: 'Synthetic progestins ใช้ใน contraception ของแมวเพศเมีย: \n1) ตัวอย่างยา ___ acetate (MPA)\n2) ผลข้างเคียงสำคัญที่พบบ่อย = ___ endometrial hyperplasia\n3) ทำให้แมวเสี่ยง mammary ___ เพิ่มขึ้น',
    blanks: ['Medroxyprogesterone', 'Cystic', 'tumor'],
    explain: 'Progestin contraceptives (Aj. SP L15):\n• **Medroxyprogesterone acetate (MPA)** · Megestrol acetate · Altrenogest\n• Mechanism: negative feedback → ↓LH/FSH → no ovulation\n\n⚠️ Side effects:\n1. **Cystic Endometrial Hyperplasia (CEH)** → pyometra risk\n2. **Mammary tumor** (cats: very strong link · MPA = carcinogen)\n3. Diabetes mellitus (insulin resistance)\n4. Adrenal suppression\n5. Pyometra\n\n💡 Modern alternative: surgical neutering (OHE/OE) preferred over long-term progestin' },

  { id: 2231, subject: 'repro-lect', topic: 'infertility', year: 4,
    source: 'Aj. TT L18 Infertility',
    sourceType: 'lecture-verified-draft',
    confidence: 'EXTRACTED',
    tags: ['brucellosis', 'short'], type: 'short',
    q: 'ผู้เลี้ยงนำสุนัขเพศเมียที่แท้งช่วงท้ายของท้อง (>45 days gestation) มาตรวจ + รายงานว่าตัวผู้ที่ผสมก็มี testicular atrophy · จงระบุโรคที่ต้องตัดออก + ขั้นตอนการตรวจ + ความเสี่ยง zoonosis',
    keywords: ['Brucella canis', 'brucellosis', 'RSAT', 'rapid slide agglutination', 'PCR', 'culture', 'zoonosis', 'cull', 'isolation'],
    explain: '**Canine Brucellosis** (Aj. TT L18):\n\n📋 Clinical signs:\n• Female: late-term abortion (45-59 days · classic dog) · stillbirth · weak puppies · infertility\n• Male: testicular atrophy / scrotal dermatitis / orchitis · epididymitis\n\n📋 Tests:\n1. **RSAT** (Rapid Slide Agglutination Test) — screening · 2-5 wks post-infection · false positive common\n2. **AGID** (Agar Gel Immunodiffusion) — confirmatory\n3. **PCR** — definitive · blood/tissue\n4. **Culture** — gold standard · BUT slow + biohazard\n\n⚠️ **Zoonosis** — Brucella canis can infect humans (flu-like → undulant fever)\n• Owner counseling: PPE, no breeding, isolate\n• Lab personnel: BSL-3 handling\n\n💡 Tx: lifelong tetracycline + rifampin · BUT poor cure rate · **culling (euthanasia)** often recommended for kennels\n\n⚠️ Reportable disease in some jurisdictions' },

  // ═══════════════════════════════════════════════════════════
  // ENG VET PROF II · Essay (already exists in questions-engprof.js · references for cross-subject)
  // ═══════════════════════════════════════════════════════════
  // (engprof essay Qs in questions-engprof.js · these short Qs supplement that)
];
