// ============================================================
// VIDEO SUMMARIES — สรุปคลิปอาจารย์ ที่ Claude อ่าน YouTube transcript
// แล้วถอดเป็น markdown ภาษาไทย พร้อม timestamps + key concepts
// ============================================================
// แต่ละ entry คือคลิปหนึ่ง keyed by YouTube videoId (จาก videos.js)
//
// ที่มา: data-cache/transcripts/{videoId}.json (ดึงผ่าน
//   `npm run fetch:videos`) → Claude ในแชทอ่านแล้วถอดเป็น summary
//
// ⚠️  ข้อจำกัด: YouTube auto-caption ภาษาไทยมีคุณภาพปานกลาง —
// คำศัพท์แพทย์/ภาษาอังกฤษบางคำ ASR เพี้ยน เช่น "อิม 5" = IMHA,
// "metnidaose" = metronidazole, "anniบติ" = antibiotic ฯลฯ
// Claude พยายาม normalize ในการสรุปแล้ว แต่อ่านควบคู่กับสไลด์
// อาจารย์ยังดีกว่า · summary นี้ใช้เป็น "skim guide" ก่อน-หลังดู
// คลิป + เป็นไฟล์ download .md ได้ด้วย
//
// วิธีเพิ่มสรุปคลิปใหม่:
// 1. รัน `npm run fetch:videos` (ดึง transcript ใส่ data-cache/)
// 2. รัน `node scripts/flatten-transcript.mjs <videoId>`
// 3. ขอให้ Claude อ่านแล้ว draft entry ใส่ไฟล์นี้
// ============================================================

export const VIDEO_SUMMARIES = {
  // ─────────────────────────────────────────────────────────────
  // COM IV — Drug used for immune-mediated diseases + IMHA
  // ─────────────────────────────────────────────────────────────
  SVJ7i6ES9DU: {
    videoId: 'SVJ7i6ES9DU',
    title: '1. Drug used for immune mediated diseases + IMHA',
    subject: 'com4',
    date: '5 Mar 69',
    durationMin: 119,
    instructor: 'อาจารย์ (Med II) + อาจารย์รัสมา (สนใจเรื่อง IMHA มา 20+ ปี)',
    examFormat: 'Case-based MCQ — โดสยา + side effects + ห้ามใช้ใน species ออกบ่อย',
    summary: `# Drug for Immune-mediated Diseases + IMHA

> 🎯 บทนี้แบ่ง 2 ส่วน · ส่วนแรก = drug review (อ.) · ส่วน 2 = IMHA + IMT (อ.รัสมา)
> Immune-mediated = ภูมิคุ้มกัน inappropriate/excessive → chronic inflammation → tissue damage

---

# 🔻 Part 1: Immunosuppressive Drugs

## Hypersensitivity Recap (อ.สันนิภาสอนแล้ว)
| Type | Mediator | ตัวอย่าง |
|------|----------|---------|
| **I** (immediate) | IgE + mast cell | Asthma, atopy, food allergy, anaphylaxis |
| **II** (cytotoxic) | IgG/IgM + complement | Drug-induced **IMHA**, IMT |
| **III** (immune complex) | Ag-Ab complex | Drug reactions, SLE, GN |
| **IV** (delayed, A/B/C) | T cell, macrophage | Contact dermatitis, granuloma |

> ⚠️ **เลือกยาตาม pathogenesis** — type I (rapid) ต้องใช้ยา rapid-onset (steroid) · ไม่ใช้ cyclosporine (4-6 wk onset)

---

## 💊 First Line: **Glucocorticoids** ⭐⭐⭐

### Action
- **Genomic** (delayed, main mechanism) → ↑ anti-inflam genes, ↓ pro-inflam genes (TNF, IL-1/4/5, COX-2, NOS, PLA₂)
- **Non-genomic** (rapid, minor) → itaconate-mediated, NRF2 antioxidant

### Classification by potency × duration
| Group | Examples | Duration | Use |
|-------|----------|----------|-----|
| Short | Hydrocortisone, Cortisone | < 12h | rare clinical use |
| **Intermediate** ⭐ | **Prednisolone**, methylprednisolone, triamcinolone | 12-36h | first-line clinical |
| Long | **Dexamethasone**, betamethasone | > 36h | high potency, more SE |

### Dose
| Purpose | Dog | Cat |
|---------|-----|-----|
| Physiologic replacement (Addison) | 0.1-0.2 mg/kg/d | same |
| **Anti-inflammatory** | **0.5-1 mg/kg/d** | **1-2 mg/kg/d** |
| **Immunosuppressive** | **2-4 mg/kg/d** | **2-4 mg/kg/d** |

> 💡 Large dogs (>35-40 kg) — ใช้ **body surface area (BSA)** แทน mg/kg เพื่อลด SE
> 💡 อ้วนแมว — ใช้ **lean body mass** ไม่ใช่ total weight

### Chronotherapy
- 🐕 Dog cortisol สูงเช้า → ให้เช้า (mimic natural)
- 🐈 Cat cortisol สูงเย็น → ให้เย็น
- (รายงานใหม่บอก no difference แต่ traditional ยังยึดหลักนี้)

### Tapering Rule
- Reduce 10-25% **every 1-4 weeks** เมื่อคุมอาการได้
- Goal: at minimum **alternate-day** (เพื่อให้ axis ฟื้น)
- ⚠️ ห้ามหยุดทันที → axis shock → Addison

### Side Effects
- PU/PD/PP, muscle wasting, hepatomegaly
- **GI ulcer** (loss of mucosal PG) — esp. with NSAID เช่น carprofen → high risk
- Iatrogenic Cushing (long-term)
- Behavior change, panting, secondary infection
- Delayed wound healing

---

## 💊 Second Line Drugs

### 🔹 Cyclosporine (Atopica) ⭐⭐
- **Calcineurin inhibitor** (block T-cell IL-2)
- **Dog: 5 mg/kg/day** (range 3-7) · **Cat: 7 mg/kg/day** (range 5-7.5)
- IBD: 5 mg/kg **BID** · Perianal fistula/severe AI: **5-8 mg/kg q12h**
- ⏰ **Slow onset 4-6 weeks** ⚠️
- Side effects: **vomiting 10-30%** (dog > cat), gingival hyperplasia, hypercoagulability, ↓ insulin secretion (avoid in DM)
- 💡 **Tip ลด vomiting:** แช่แคปซูลในช่องแข็ง → ป้อนเป็นแคปซูลแข็งทั้งเม็ด
- Empty stomach = dig.bioavail. ดีกว่า แต่อาจอาเจียน → ถ้ารับไม่ได้ให้กินพร้อมอาหารช่วงแรก

**Topical forms:**
- 🐶 Tacrolimus ointment — pemphigus, perianal fistula, atopy
- 👁️ Cyclosporine eye drops — KCS

### 🔹 Azathioprine
- Antimetabolite (purine analog) → ↓ DNA/RNA synthesis, ↓ WBC
- Dog: 2 mg/kg/day → taper to 1-2 mg/kg q48h
- Onset 3-5 weeks
- Side effects: **GI, myelosuppression, hepatotoxicity** — must monitor CBC + liver
- ❌ **DO NOT use in cats** (lack TPMT → severe myelosuppression) ⭐

### 🔹 Leflunomide
- DHODH inhibitor (pyrimidine synthesis)
- 2 mg/kg dog & cat
- Less reliable than pred/CSA — use when first lines fail

### 🔹 Mycophenolate (CellCept)
- Antimetabolite — targets B + T lymphocytes
- 10 mg/kg BID
- SE: GI upset · ใช้ร่วมกับ glucocorticoid/CSA
- ใช้ในโรคเดียวกับ CSA

### 🔹 Chlorambucil
- Alkylating agent · slow onset 2 weeks
- ⭐ **โดสในแมวสำคัญ:** **0.1-0.2 mg/kg q24h** initial → q48h maintenance
- ในสุนัขใช้ **BSA** dosing
- ดีมากในแมว — เริ่มจาก pred แล้ว switch/add ตัวนี้สำหรับ long-term

---

## 💊 Newer Drugs

### 🔹 Oclacitinib (Apoquel) — JAK inhibitor
- Block **IL-31 receptor signaling**
- ใช้ **atopic dermatitis** ในสุนัข **อายุ > 12 เดือน** เท่านั้น
- Dose: **0.6 mg/kg BID × 2 weeks** → SID maintenance
- 70% caseคุมได้ด้วย SID · 20-30% ต้อง BID ตลอด
- SE น้อย (mild GI possible)
- Off-label: ใช้ในแมว (extra-label, dose สูงกว่า) สำหรับ DM/liver disease cat ที่ต้อง alt to steroid · pemphigus (high dose)
- ราคาแพง 100+ บาท/เม็ด

### 🔹 Lokivetmab (Cytopoint) — monoclonal Ab
- **Caninized anti-IL-31 antibody** — neutralize IL-31 in circulation ก่อนจับ receptor
- SC injection **q3-5 weeks** (เฉลี่ย 4 wk)
- ⭐ ใช้สำหรับ atopy ที่ "**คันเด่น**" (ไม่เน้น inflammation/บวม)
- ⚠️ **Dog only — ห้ามใช้ในแมว!**
- Safe (no liver/kidney metabolism), แต่แพง 3,000-4,500 บาท/dose
- ถ้ามีอักเสบเยอะ → start with pred ก่อน คุมแล้วค่อย switch

### 🔹 Frunevetmab (Solensia) — feline anti-NGF
- For **feline OA pain** (q monthly)

### 🔹 Bedinvetmab (Librela) — canine anti-NGF
- For **canine OA pain** (q monthly)

---

## 🎯 Combination Therapy Principles

1. **Start with first-line** (steroid) — onset เร็ว, คุมอาการก่อน
2. **Clear infection ก่อน immunosuppress** — ไม่งั้น sepsis → death
3. **Monitor secondary infection** ตลอด treatment (UTI, skin, GI)
4. **Long-term**: taper steroid → add 2nd line (เพื่อหลีกเลี่ยง iatrogenic Cushing)
5. **Don't taper too fast** — relapse risk
6. ลดได้ทั้ง dose และ frequency

---

# 🔻 Part 2: IMHA (Immune-mediated Hemolytic Anemia)

> 🩸 อ.รัสมา (Chula สนใจโลกนี้ 20+ ปี)
> "20 ปีก่อนคิดว่าโรคนี้ rare — ปัจจุบันเจอบ่อยมาก เกิดเพราะใช้ยา/วัคซีนเยอะขึ้น"

### Pathogenesis
**Antibody/complement → จับ RBC → ทำลายโดย**
1. **Intravascular hemolysis** — RBC แตกในเส้นเลือด → hemoglobinemia/uria
2. **Extravascular hemolysis** — phagocytosis โดย **spleen + liver** → splenomegaly + hepatomegaly

### 2 Types
| Type | Cause | พบใน |
|------|-------|------|
| **Primary** | Idiopathic / post-vaccine (1 mo) / post-doxycycline | 🐕 dog (Chula research) |
| **Secondary** | **FeLV/FIV**, neoplasia, drug, chronic infection (Mycoplasma, Ehrlichia, Babesia, Leptospira), onion toxicity, autoimmune | 🐈 **Cat — secondary > primary** |

### Signalment
- US breeds: Cocker Spaniel, Poodle, Old English Sheepdog, Irish Setter
- 🇹🇭 ไทย: Shih Tzu, Spitz, Pomeranian (พันธุ์เล็ก) เจอเยอะกว่า
- เพศเมีย > ผู้
- ทุกอายุ

### Clinical Signs
**Acute / severe** (เห็นง่าย)
- 🚨 **PCV ดรอปเร็ว** (e.g., 30→20→10 in days) — classic clue ⭐
- Pale gums (white as paper) · jaundice · collapse · tachycardia · tachypnea
- **Dark/red urine** (hemoglobinuria) — เจ้าของแมวบอก "ทรายแมวเป็นสีแดง/ชา"
- Splenomegaly + hepatomegaly + lymphadenopathy
- Melena (dark stool)
- Pica (กินดิน หิน อิฐ — anemia drive)

**Chronic** (เห็นยาก)
- Anorexia · weight loss · mild pallor · fatigue
- Need serial PCV monitoring

### Diagnosis ⭐⭐⭐

**1. Auto-agglutination (slide test)** — screening, ฟรี
- Method: เลือดสุนัข 1 หยด + saline 1 หยด → คนด้วยไม้จิ้มฟัน → พลิก slide
- **Positive** = เห็นเป็น "**เม็ดทรายในนาฬิกาทราย**" (ไม่ใช่สี่เหลี่ยม) → strong IMHA
- ⚠️ **แยกจาก Rouleaux formation** — Rouleaux จะหายเมื่อใส่ saline · auto-agglutination ไม่หาย
- ⚠️ **Dog only — แมวใช้ไม่ได้!**

**2. Coombs' test (direct)** — commercial strip ~800-1,000 บาท
- Confirmatory · ใช้ได้ทั้ง dog + cat

**3. Spherocytes** in blood smear
- RBC โดน macrophage กินบางส่วน → กลม เล็ก ไม่มี central pallor
- ⭐ **Dog only** — ในแมวไม่มี significant central pallor → ใช้ไม่ได้

**4. Other**
- Regenerative anemia (high reticulocyte)
- ↑ bilirubin → icterus
- UA: hemoglobinuria, bilirubinuria
- CBC: WBC สูง (inflammation)
- X-ray: splenomegaly (สามเหลี่ยมตรงกลางท้องที่หัวอยู่บน)

### ⚠️ Complication: Thromboembolism (TE) ⭐⭐
- Hypercoagulable state จากการ hemolysis
- Microthrombi ในไต/ปอด/ตับ → ตายแม้ PCV กลับมาปกติ
- เจ้าของไม่เข้าใจ "ให้ยาแพง 20K แล้วทำไมตาย" — TE ตรวจยาก, มาเจอตอนผ่าซาก

### Treatment

**🚨 Acute / Severe**
1. **Prednisolone 2 mg/kg BID** ⭐ (ไม่ว่าหมาหรือแมว)
   - Large dogs > 35 kg: ใช้ **BSA** dosing แทน mg/kg
2. **Cat โหดมาก:** **Dexamethasone 0.2 mg/kg SC** (รุนแรงพอ pred ไม่พอ) → respond ทันที
3. **Antithrombotic** ⭐
   - **Clopidogrel** SID (preferred, แพงเล็กน้อย)
   - or **Aspirin 1-2 mg/kg/day**
4. **GI protectant** (pantoprazole)
5. **Antibiotic** (cover secondary infection)
6. **Blood transfusion** ถ้า PCV < 12-15
   - Chula มี blood bank · ข้างนอกแพงกว่า 3 เท่า

**💊 Long-term Management**
- เมื่อ stable (PCV > 30, ไม่ hemolyse)
  - **Taper pred 25% q2 weeks**
  - ⏬ จาก BID → SID → q48h → q72h
  - ⚠️ **อย่าหยุดเร็ว** — relapse → ตาย
- Add **second line** ถ้ามี SE จาก pred หรือ refractory:
  - **Azathioprine** (dog only) — 2 mg/kg/day → q48h
  - **Cyclosporine** — dog 5 / cat 7 mg/kg/day
  - **Mycophenolate** 10 mg/kg BID
  - IVIG 0.5-1 g/kg single infusion (refractory)
- ⭐ **Don't taper second line** — taper เฉพาะ pred · keep second line
- Recheck q3 wk · UA culture q1-2 mo (UTI risk)
- Relapse rate ~15%
- Often **lifelong therapy**

---

# 🔻 Part 3: IMT (Immune-mediated Thrombocytopenia)

> ⏱️ Bonus 7 นาที — basic เหมือน IMHA

### Pathogenesis
- Antibody/complement → จับ platelet → splenic phagocytosis
- ⚠️ Common in Thailand: **secondary to Ehrlichia** (blood parasite)

### Clinical Signs
- **Petechiae** (pinpoint hemorrhage) — ดูที่ **ท้อง** (ไม่ใช่ขา เพราะขนเยอะ)
- **Ecchymosis** (large purple patches) → bleed in body cavity
- Bleeding sites: gum, hyphema (eye), epistaxis, melena, hematuria
- ⚠️ พฤติกรรม "หนามตำแล้วตาย" จาก platelet ต่ำในคน (rare in vet)
- ⚠️ **IMT ในแมวเจอน้อยมาก** — แมวลึกลับ

### Treatment ⭐
1. **Vincristine** single dose ⭐⭐
   - หลอก macrophage ให้จับ vincristine แทน platelet
   - **ใช้ครั้งเดียว** ในตอนเริ่มรักษา — boosts platelet count rapidly
2. **Prednisolone 2 mg/kg BID** (เหมือน IMHA)
3. ระยะยาว: เหมือน IMHA — taper pred, add 2nd line ถ้าจำเป็น

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Drug
1. **Pred dose**: 0.5-1 anti-inflam dog · 1-2 anti-inflam cat · **2-4 mg/kg IMS** ทั้งคู่
2. **Cyclosporine**: dog 5, cat 7 mg/kg/d · **slow onset 4-6 wk**
3. **Azathioprine ห้ามใน cat** ⭐ (lack TPMT)
4. **Chlorambucil cat dose**: 0.1-0.2 mg/kg q24h
5. **Apoquel (oclacitinib)**: 0.6 mg/kg BID × 2 wk → SID · dog > 12 mo · JAK inhibitor IL-31R
6. **Cytopoint (lokivetmab)**: anti-IL-31 mAb · dog only · q3-5 wk SC
7. **Solensia/Librela**: anti-NGF for OA pain (cat/dog respectively)
8. Chronotherapy: dog AM, cat PM
9. Taper steroid 10-25% q1-4 wk · alternate-day target
10. Steroid + NSAID = GI ulcer risk

### IMHA
1. **Auto-agglutination test** = slide method · **dog only** · Rouleaux disappears with saline
2. **Spherocytes** = dog only diagnostic
3. **Cat IMHA usually secondary** (FeLV/FIV/Mycoplasma)
4. **PCV drops fast** = classic clue
5. **Pred 2 mg/kg BID** acute Tx
6. **Cat severe** → Dex 0.2 mg/kg SC
7. **Antithrombotic** = clopidogrel or aspirin (TE = leading cause of death)
8. Don't stop pred too fast — 15% relapse, often fatal
9. Common 2nd line: aza (dog), CSA, MMF

### IMT
1. **Petechiae on abdomen** (not legs)
2. **Vincristine single shot** = first-line acute
3. Ehrlichia screen — Thailand frequent secondary cause

---

> 💡 **อ.รัสมา closing tip:** "เจ้าของยุคใหม่ access internet เก่งกว่าเรา · อย่าดูถูกประวัติเจ้าของ"
> "เลือดออก 20K + ยา immunosuppressive แพงตลอดชีวิต — ต้องอธิบายให้เจ้าของเข้าใจตั้งแต่แรก"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Cushing's & Addison's
  // ─────────────────────────────────────────────────────────────
  KZK4rKve1tQ: {
    videoId: 'KZK4rKve1tQ',
    title: '4. Cushing & Addison',
    subject: 'com4',
    date: '29 Jan 69',
    durationMin: 115,
    instructor: 'อาจารย์ (ผู้สอนหลัก ภาควิชา Med II)',
    examFormat: 'Case-based MCQ — อาจารย์ย้ำว่าตารางสรุป LDDS/ACTH stim "พี่จะเอาตรงนี้ไปออกข้อสอบ"',
    summary: `# Cushing & Addison — Adrenal Endocrine Disorders

> 🧠 รีวิว HPA axis ก่อน: Hypothalamus → CRH → Pituitary → ACTH → Adrenal cortex → Cortisol
> Cortisol หลั่งแบบ **pulsatile** (ขึ้นๆ ลงๆ) → เจาะเลือดครั้งเดียวบอกไม่ได้ → ต้องใช้ **dynamic test**

---

## 🔹 Adrenal Cortex zones (ต้องจำ)
| Zone | Product | ควบคุมโดย |
|------|---------|-----------|
| Glomerulosa (นอกสุด) | **Aldosterone** (mineralocorticoid) | RAAS |
| **Fasciculata (กลาง, ใหญ่สุด)** | **Cortisol** (glucocorticoid) | **ACTH** ⭐ |
| Reticularis (ในสุด) | Androgens | ACTH (เล็กน้อย) |
| Medulla | Epi/Norepi (catecholamine) | sympathetic |

> ⚠️ ทุก zone สร้างจาก **cholesterol** ผ่าน enzyme 3β-HSD2 → Trilostane block enzyme นี้ทำให้ทุก zone โดนกด

---

# 🔻 Part 1: Cushing's (Hyperadrenocorticism)

> ใช้คำว่า **syndrome** ไม่ใช่ disease — ต้องมีทั้ง **lab สูง + clinical sign** จึงรักษา · แค่ค่าสูงไม่มีอาการ → ไม่รักษา

### 3 Subtypes
| Type | Cause | % | Tx |
|------|-------|---|-----|
| **PDH** (Pituitary-dependent) | Pituitary tumor → ACTH สูง → adrenal โต 2 ข้าง | **85%** | Trilostane |
| **ADH** (Adrenal-dependent) | Adrenal tumor (adenoma/carcinoma) → cortisol เยอะเอง | 15% | Surgery > Trilostane |
| **Iatrogenic** | Steroid overuse จากหมอ | (varies) | Taper ยา ค่อยๆ ลด |

> 💡 **Spontaneous Cushing** = PDH + ADH รวมกัน · Iatrogenic แยกออก

### Signalment
- 🐕 Middle-aged → senior (5-6 ปีขึ้นไป) · เพศเมีย ≥ ผู้ (ไม่ใช้ตัดสิน)
- Breeds: **Poodle, Terrier, Beagle, German Shepherd**
- ในไทย: **Pomeranian + Chihuahua** เจอเยอะ (เพราะนิยมเลี้ยง)

### Clinical Signs

**Skin signs (ไม่ทุกตัวมี)**
- Bilateral symmetrical alopecia (**ไม่คัน ไม่อักเสบ**)
- Pendulous abdomen (ท้องใหญ่ย้อยห้อย — กล้ามเนื้อ catabolism)
- Thin skin · prominent blood vessels · calcinosis cutis (Ca สะสม คล้ายกระดูกอ่อน)
- Recurrent skin infection · delayed wound healing

**Systemic signs (เด่นกว่า)**
- ⭐ **PU/PD/PP** (กินน้ำมาก ฉี่มาก กินเก่ง — cortisol กดศูนย์อิ่ม)
- Muscle wasting · abdominal enlargement (hepatomegaly + abdominal fat)
- Recurrent UTI

> ⚠️ Cushing **= โรคต่อมไร้ท่อ** ไม่ใช่โรคผิวหนัง — อาการ systemic เด่นกว่าผิวหนัง

### Workup

**1. PUPD threshold:** กินน้ำ > **100 mL/kg/day** = polydipsia, ฉี่ > 50 mL/kg/day = polyuria

**2. Urine specific gravity (USG)** — ทำก่อนเสมอ
| USG | DDx |
|-----|-----|
| < 1.008 | Psychogenic, DI, hyperCa, **Cushing**, post-hepatic |
| 1.008-1.030 | Renal disease, hyperCa, **Cushing**, **DM**, **Addison** |
| > 1.030 | Osmotic diuresis (DM ส่วนใหญ่) |

**3. CBC + Biochem**
- **Stress leukogram** = neutrophilia + **lymphopenia + eosinopenia** + monocytosis ⭐ ต้องมี
- **↑↑ ALP** (moderate-high, อาจถึง 3,000-4,000 IU/L) — เด่นมาก
- ↑ ALT (mild)
- ↑ glucose (mild — cortisol ยับยั้ง insulin)

**4. Imaging**
- **X-ray:** hepatomegaly · adrenal เห็นยาก (ยกเว้นมี calcification)
- **Ultrasound** ⭐ sensitivity/specificity สูง
  - **PDH:** dumbbell **2 ข้างโตเท่าๆ กัน** รูปร่างเดิม (เหมือนเล่นกล้าม)
  - **ADH:** **ข้างเดียว/asymmetric** + รูปร่างผิดปกติ + cavitation · อีกข้างอาจฝ่อ

**5. Endocrine tests**

| Test | Normal | Equivocal | Cushing | Note |
|------|--------|-----------|---------|------|
| **UCCR** (urine cortisol:creatinine ratio) | low | — | สูง | ทำ 3 วันติด, 1,500฿/วัน · ใช้ **rule OUT** ดี (high NPV) |
| **Resting cortisol** | จ.5-6 µg/dL | — | — | ❌ ใช้ Dx ไม่ได้ (pulsatile) |
| **ACTH stim** ⭐ | post < 17 | 17-22 | **> 22 µg/dL** | ใช้ Dx ได้ทั้ง Cushing + Addison · ไม่แยก ADH/PDH |
| **LDDS** (low-dose dex suppression 0.01 mg/kg IV) ⭐⭐ | 8h < 1.4 | — | **8h > 1.4** | Dx Cushing แต่ไม่แยก ADH/PDH ชัดเจน |

**LDDS pattern interpretation**
- **Normal:** กดได้ที่ 4hr และ 8hr (ต่ำตลอด)
- **PDH (microadenoma):** กดได้ช่วงกลาง 4hr → 8hr **เด้งกลับขึ้น** > 1.4
- **PDH (macroadenoma) หรือ ADH:** กดไม่ลงเลย — flat สูงตลอด

> 📌 **ดู 8hr ก่อน** — ถ้า > 1.4 = Cushing แน่ · ค่อยมาดู pattern (กดได้กลาง vs กดไม่ลง)

### Treatment

**ADH (Adrenal tumor)**
- 1st choice: **Surgery (adrenalectomy)** — ถ้า attach vena cava ไม่ได้แล้ว
- Inoperable → Trilostane

**PDH หรือ inoperable ADH**
- ⭐ **Trilostane** — competitive inhibitor of 3β-HSD2
- Dose: **0.5-2.5 mg/kg PO BID** (q12h, ไม่เกิน 5 mg/kg/day)
- Monitor: clinical + ALT/ALP trend + **ACTH stim 6 ชม.หลังกินยา** (target post-cortisol < 17)
- ⚠️ **ระวัง hyperkalemia** → ถ้า block ลึกเกิน → กลายเป็น Addison

**Iatrogenic**
- หยุด steroid **ค่อยๆ ลด dose ลง** ไม่ใช่หยุดทันที (axis อาจ shock → Addison)
- Topical/eye drops/asthma inhaler — รายงาน iatrogenic ได้บ้าง (โดยเฉพาะ inhaler ในคน)

> 💡 **ห้ามใช้ Mitotane แล้ว** (ของเก่า) — ทำ adrenal necrosis โดยตรง คุม dose ยาก เสี่ยง Addison

### Chronotherapy ⭐
- 🐕 **สุนัข cortisol สูงเช้า** → ให้ steroid **ตอนเช้า** (วันละครั้ง)
- 🐈 **แมว cortisol สูงเย็น** → ให้ steroid **ตอนเย็น**
- เลียนแบบ natural rhythm → ให้ negative feedback ทำงานได้

### Response Timeline
| Sign | เริ่มเห็นผล |
|------|------------|
| PUPD ดีขึ้น | 2-4 สัปดาห์ |
| Polyphagia ดีขึ้น | 3-4 เดือน |
| ขนกลับขึ้น | 3-4 เดือน |

---

# 🔻 Part 2: Addison's (Hypoadrenocorticism)

> 🎭 **"Great pretender / imitator"** — เลียนแบบโรคได้สารพัด · classic = **wax & wane** (3 วันดี 4 วันไข้)

### Subtypes
- **Primary (~95%)** — ปัญหาที่ adrenal เอง (atrophy/destruction)
  - Idiopathic atrophy · immune-mediated · ischemia · trauma · metastasis · ยาเกิน (mitotane > trilostane)
  - Bilateral adrenalectomy → Addison ทันที
- **Secondary (rare)** — pituitary failure → ขาด ACTH

### Hormone deficiency types
| Type | ขาด | อาการเด่น |
|------|-----|----------|
| **Glucocorticoid only** | Cortisol | ซึม · เบื่ออาหาร · GI sign |
| **Both gluco + mineralo** ⭐ พบบ่อยกว่า | Cortisol + Aldosterone | + electrolyte derangement, crisis |

### Signalment
- Young → middle-aged (โตเต็มวัยแต่ยังไม่แก่)
- เพศเมีย > ผู้ · Poodle, Westy, Great Dane (US)
- ในไทย: **Pomeranian + Chihuahua** เจอเยอะ (เหมือน Cushing)

### Clinical Signs (vague!)
**Non-crisis (chronic, subtle)**
- Wax & wane · intermittent vomiting/diarrhea · ซึม เหงา หงอย · เบื่ออาหาร · น้ำหนักลด · weakness · PUPD บ้าง

**Crisis (emergency!)** ⭐
- Collapse · bradycardia · hypothermia · severe dehydration · hypotensive shock
- อาจชัก · coma

### Lab Clues ⭐⭐⭐

**1. NO stress leukogram despite illness** — ⭐ **HUGE clue!**
> ป่วยเรื้อรังแต่ neutrophilia/lymphopenia ไม่มี → ต้องสงสัย Addison

**2. Electrolyte (Na/K ratio)** — กดดี Na cortex zona glomerulosa ฝ่อ
| Na/K ratio | Significance |
|------------|--------------|
| > 27:1 | Normal (ปกติ 30-40) |
| < 27:1 | สงสัย Addison |
| **< 20:1** | **Crisis!** |

> ⚠️ บางตัว Na ต่ำชัด แต่ K ยังอยู่ใน range — **อย่าตัด Addison ออก** ยังเป็นได้ (early stage)

**3. อื่นๆ**
- Hyperkalemia + hyponatremia ± hypochloremia
- Azotemia (BUN ↑ + Cr ↑) — prerenal จาก hypovolemia
- Hypoglycemia · USG ต่ำ (เนื่องจาก mineralo ขาด)
- Hypoalbuminemia + ↑ globulin (chronic inflammation)

**4. ECG (hyperkalemia)** ⭐
- Bradycardia · peaked **T-wave** · wide QRS · **lost P-wave** · low amplitude
- หลัง correct → P-wave กลับ · QRS แคบลง

**5. X-ray:** **Microcardia** (hypovolemia → blood volume น้อย → หัวใจเล็ก)

### Diagnosis
| Test | Result | Interpretation |
|------|--------|----------------|
| **ACTH stim** ⭐ gold | pre + post **< 0.5** µg/dL (flat low) | Addison แน่ |
| **Resting cortisol** | > 2 µg/dL | **Rule OUT** Addison ได้ |
| | < 0.5 + อาการ | สงสัยมาก |
| | 0.5-2 | ก้ำกึ่ง — ต้อง ACTH stim |

> 💡 ACTH หายากในไทย — ถ้า rest cortisol > 2 → ตัด Addison ออกได้เลย

### Treatment

**🚨 Crisis (emergency!)**
1. **IV fluids** (NaCl 0.9% — full shock dose)
2. **Dexamethasone 0.5-1 mg/kg IV** ⭐ — ตอบสนอง dramatic ภายใน 1-2 ชม. (ฟื้นเหมือนเป็นตัวใหม่)
   - ⚠️ **Dex ไม่ interfere กับ ACTH stim** → ฉีดช่วยชีวิตก่อน แล้วยัง confirm test ได้ทีหลัง
3. **HyperK management:**
   - Glucose ± insulin (ดึง K+ เข้า cell)
   - NaHCO₃ ถ้า acidotic
4. Monitor electrolyte q6h, ECG, CRT (target 1-2 sec จากเดิม 3-4 sec)

**💊 Long-term**
| ยา | กลไก | Dose | Note |
|----|------|------|------|
| **DOCP injection** (Zycortal/Percorten) | mineralocorticoid only | q25 days SC | ไม่มีของถูกในไทย, แพง |
| **Fludrocortisone (Florinef)** | mineralo + gluco | PO daily | มีของคน, หาง่ายในไทย |

> 💡 50-60% ของเคสคุมได้ด้วย **Florinef เดี่ยว** · 30-40% ต้องเสริม **prednisolone** เพิ่ม (สำหรับ glucocorticoid)

### Prognosis
- เก่า: 6 เดือน - 1 ปี
- ปัจจุบัน: **3-5+ ปี** ถ้าเจ้าของป้อนยาสม่ำเสมอ → ใช้ชีวิตปกติได้
- เป้าหมาย: lifelong therapy

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Cushing
1. **3 subtypes** + percentage (PDH 85%, ADH 15%, iatrogenic)
2. **Stress leukogram** = neutrophilia + lymphopenia + eosinopenia + monocytosis (must memorize!)
3. **↑↑ ALP** เด่นกว่า ALT
4. **ACTH stim cut-off**: < 17 normal, 17-22 gray, **> 22 = Cushing**
5. **LDDS:** 8hr **> 1.4 µg/dL = Cushing** · ดู 8hr ก่อน · ไม่แยก ADH/PDH
6. **US:** PDH = bilateral symmetric dumbbell, ADH = asymmetric/cavitation
7. **Trilostane**: 3β-HSD2 blocker, 1-2 mg/kg BID, monitor K+
8. Iatrogenic: **taper steroid ค่อยๆ** อย่าหยุดเฉียบ
9. Chronotherapy: dog → AM, cat → PM
10. PUPD threshold: > 100 mL/kg/day

### Addison
1. **Wax & wane** = classic clue
2. **No stress leukogram + ป่วยเรื้อรัง** → สงสัย Addison ⭐
3. **Na/K ratio**: < 27 sus, < 20 crisis
4. **ACTH stim** = gold (flat low pre/post)
5. **Resting cortisol > 2** = rule out
6. ECG hyperK: peaked T, lost P, wide QRS
7. Crisis Tx: **Dex 0.5-1 mg/kg IV** + IV fluids + treat hyperK
8. Long-term: **DOCP q25d** หรือ **Florinef PO**
9. Dex ไม่ interfere ACTH stim → ใช้ก่อน confirm หลังได้
10. ⚠️ ห้ามตัด Addison ออกแม้ K ปกติ ถ้า Na ต่ำชัดเจน

---

> 💡 **อาจารย์ tip ปิดท้าย:**
> "ตรวจกว้างไว้ก่อน — เพิ่ม electrolyte แค่ 120-150 บาท แต่ได้ข้อมูลเยอะ
> เคยมีหมอตรวจไม่ครบ → DM ที่แค่เจาะ glucose 60 บาทก็เจอ → ปล่อยให้เคสรักษาแผลหายช้าจน complaint หลายหมื่นบาท
> Addison มา er แล้วไม่รู้สาเหตุ ECG + Na/K + Dex IV = ฟื้นทันใน 1-2 ชม.พิสูจน์โรคได้"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Drug used for immune mediated diseases ➜ IBD + SLE
  // ─────────────────────────────────────────────────────────────
  pewBPGWFqoo: {
    videoId: 'pewBPGWFqoo',
    title: '2. IBD + SLE',
    subject: 'com4',
    date: '12 Mar 69',
    durationMin: 57,
    instructor: 'อาจารย์ (ผู้สอนหลัก ภาควิชา Med II)',
    examFormat: 'Case-based MCQ — อาจารย์บอกย้ำว่าข้อสอบเป็น "เคสกรณีเคส"',
    summary: `# IBD + SLE — Immune-mediated GI & Multi-organ disease

> 📌 หัวข้อนี้เดิมอาจารย์สอน 4-5 โรค (IMHA / IMT / IBD / SLE / GN-GL disease)
> แต่ปีนี้เหลือ 2 ชม. → ตัด GN/glomerulonephritis ออก เน้น **IBD** + **SLE**
> เพราะอุบัติการณ์สูงในคลินิกปัจจุบัน

---

## 🔹 Part 1: Inflammatory Bowel Disease (IBD)

### Epidemiology
- 10 ปีก่อนเป็นโรค "ในตำรา" — ปัจจุบัน **เจอบ่อยมากทั้งสุนัขและแมว**
- **สุนัข** → ส่วนใหญ่ลำไส้ใหญ่ (large bowel signs เด่น)
- **แมว** → กระเพาะอาหาร + ลำไส้เล็ก (vomiting + small bowel diarrhea)
- คลาสสิก: เป็นๆ หายๆ ซ้ำเรื้อรัง — เจ้าของย้ายโรงพยาบาลซ้ำๆ

### 4 Characteristics ⭐ ที่ต้องจำ
| # | Feature |
|---|---------|
| 1 | Clinical sign > **3 สัปดาห์** |
| 2 | เบื่ออาหาร / อาเจียน / น้ำหนักลด / ท้องเสียมีเลือดหรือเมือก |
| 3 | ต้องวินิจฉัยเชิงลึก ไม่ใช่แค่ให้ยาแก้อาเจียน |
| 4 | **Histopathology = Gold Standard** (แต่เจ้าของมักปฏิเสธ biopsy) |

### Breed Predisposition
- 🐕 Miniature Schnauzer · Boxer · German Shepherd · Rottweiler · Brittany
- 🐈 Persian · Persian-cross · พันธุ์ขนยาว

### Pathophysiology (สั้น)
GI mucosa **react มากผิดปกติ** ต่อ antigen / bacteria → cytokine cascade (IL-1, IL-2, IL-3, IL-4, IL-30, IL-32) → chronic inflammation
> 💡 อาจารย์ไม่ออกข้อสอบ pathway โดยตรง แต่ให้รู้ไว้เผื่อยามี mechanism-specific (ยาที่ block IL-13, etc.)

### Diagnosis Workflow
1. **History taking** ละเอียด (esp. แมว — diet history สำคัญมาก, environmental stress)
2. แยก acute vs chronic diarrhea
   - Acute → CPV / FPV / coronavirus combo test (~300฿)
   - Chronic + systemic well → ไป deep workup
3. **Minimum database** (MDB):
   - CBC + biochem + UA (มักปกติ — ใช้ exclude อื่น)
   - Stool: bacteria เยอะมาก, ไม่มีไข่พยาธิ
   - Folate + Cobalamin (~2,000฿) → screen PLE
   - PLI (pancreatitis), UPC (protein-losing nephropathy)
   - Abdominal ultrasound → bowel wall thickening, colon shortening
4. **Rectal exam**: เลือด + เมือกปนอุจจาระ (พบเฉพาะ IBD ไม่พบใน parvo)
5. C-reactive protein + Serum amyloid A → inflammation marker
6. **Canine IBD Activity Index** (research only)
7. **Biopsy + histopath** = Gold Standard (lymphoplasmacytic infiltration)

### Large bowel vs Small bowel diarrhea ⭐ ออกบ่อย
| Feature | Large bowel (IBD ในสุนัข) | Small bowel (CPV-like) |
|---------|---------------------------|--------------------------|
| Stool | เมือก + เลือดเล็กน้อย | เหลวมาก, น้ำนอง |
| Tenesmus (ปวดเบ่ง) | ✅ มี | ❌ ไม่มี |
| Weight loss | น้อย | มาก |
| Dehydration | น้อย | มาก |

### Treatment — Modern Concept ⭐⭐⭐ (แตกต่างจากตำราเก่า)
1. **Diet** (สำคัญสุด — "อาหารเป็นยา")
   - 🥇 Hydrolyzed protein diet (~4,000-5,000฿/ถุง) — ดีมากกับสุนัข
   - 🐈 Novel protein source (เปลี่ยน source — ไก่ → ไข่ → ฯลฯ)
   - 🥚 Medium-chain triglyceride supplementation
   - 🌾 **Fiber supplementation** (Gastro Fiber, Fiber Boost ~200฿/กระป๋อง) — ผลดีมาก
   - **เปลี่ยน diet ค่อยๆ ภายใน 7 วัน** (1/7 → 7/7)
2. **Exercise** — สุนัข: เดินทุกวันช่วย GI motility · แมว: ปล่อยเดินบ้าน อย่าขัง
3. **Antibiotics** — ❌ **deprecated** (เมื่อก่อนใช้ metronidazole — ตอนนี้แทบเลิก)
4. **Probiotics** ⭐ พระเอกใหม่ — บางตัวมีทั้ง pre-/probiotic
5. ❌ Sulfasalazine, Imodium → ห้ามใช้ในสุนัขแมว (banned)
6. **Cyclosporine** — refractory case, severe immune-mediated (Aj. Chaiyot ใช้)
7. **Behavioral modification** — ฮิตมาก! (Aj. Chompoo, Aj. Param)
   - ฟอร์ม 25 หน้า + consult 6 ชม.
   - เน้น stress management

### Prognosis
- **Short-term**: ดี (ตอบสนองต่อ diet + probiotics)
- **Long-term**: ค่อนข้างแย่ — recurrent, "public problem"
- ต้องเน้น "วินิจฉัยเชิงลึก" ตั้งแต่แรก ไม่ทำ symptomatic อย่างเดียว

---

## 🔹 Part 2: Systemic Lupus Erythematosus (SLE)

### Naming
- ชื่อเล่น: **"โรคพุ่มพวง"** (ตั้งตามนักร้องที่เป็นโรคนี้)
- เคสในวงการ: อาจารย์สิรินธร (อดีต ผอ. รพ. คณะ) เป็น SLE → เสียจาก side-effect ของ steroid
- เพื่อนอาจารย์ที่เคยเป็น: ปัจจุบันใช้ยาดี → กลับมาใช้ชีวิตปกติได้

### Definition
> **SLE = autoimmune disease ที่ทำลาย ≥ 2 อวัยวะพร้อมกัน**

### Etiology
- **Idiopathic / autoimmune** — ไม่ทราบ trigger
- เป็นได้ทุกอายุ ทั้งหมาแมว
- **Genetic predisposition** ชัดเจน

### Breed Predisposition
- 🐕 Old English Sheepdog · Collie · Beagle · Afghan Hound · Pointer · Akita · Whippet
- 🐈 Siamese · Persian · Persian-cross · พันธุ์ไทย (ขาวมณี · ศรีสวาส · สุพลรักษ์ · โคราช)

### Clinical Signs (ข้อใหญ่ — เคสมาด้วย)
1. ⭐ **Polyarthritis** — classic! ปวดหลายข้อ เป็นทั้งคอ เข่า ทั้งตัว
   - เคสตัวอย่าง: Doberman 2 ปี — บิดคอทำให้ร้องลั่นโรงพยาบาล
2. **Skin disease** — atopy-like, hair loss
3. **Mucocutaneous junction inflammation** — ริมฝีปาก หู ปาก
4. **Glomerulonephritis** — proteinuria, peripheral edema
5. **Cardiovascular disease**
6. **Myositis** (กล้ามเนื้ออักเสบ)
7. **Pleural disease**
8. **Hematological** — anemia + thrombocytopenia (petechiae ที่เหงือก)
9. **Cutaneous SLE** ในแมว — crusty lesion ระหว่างนิ้ว เดินลำบาก

### Special Diagnostic Tests
| Test | Purpose | Status |
|------|---------|--------|
| **ANA (Antinuclear Antibody)** | SPECIFIC for SLE | ⚠️ ยังไม่ commercial ในไทย |
| **CD4/CD8 ratio** | Aj. Theerawut develop ที่ Chula | ใช้ได้ |

#### CD4/CD8 reference values ⭐
| Species | Normal | SLE |
|---------|--------|-----|
| Dog | 2.25 | > 5 (2-3× normal) |
| Cat | 2.19 | > 5 (2-3× normal) |

### General Workup (เหมือน immune disease ทั่วไป)
- Coombs' test (cf. IMHA, IMT)
- Biochemistry — kidney profile
- Skin biopsy (if skin lesion)
- Radiograph — pleural effusion?
- **Synovial fluid analysis** — joint involvement?
- ถ้า cat: rule out **FeLV + FIV ก่อน** (immune confounder)

### Special Case: Sharpei (พันธุ์เฉพาะ) ⭐
- ชาไป่ → มักเจอ **glomerular disease** + **amyloidosis**
- Pattern: บวมตามตัว · หอบจาก pleural effusion · ค่าไตขึ้นๆ ลงๆ
- Pathophys: Amyloid deposit ที่ renal pelvis → protein-losing nephropathy → **nephrotic syndrome**

### Treatment (เหมือน immune disease ทั่วไป)
1. **First-line**: Prednisolone (immunosuppressive dose 1-2 mg/kg/d)
2. หลัง 1 เดือน → ลด 25% ทุก 2 สัปดาห์เมื่อ stable
3. **Second-line**: Cyclosporine (Aj. Chaiyot recommended)
4. เป้าหมาย: ลดถึง lowest effective dose หรือ alternate-day
5. **SLE rarely tapers off completely** — ต้องกินยาเกือบตลอดชีวิต

### Prognosis
- ถ้าวินิจฉัยถูก + treat ทัน → ใช้ชีวิตปกติได้
- ถ้าวินิจฉัยช้า / treat ผิด → fatal (เหมือนเคสอ.สิรินธร)

---

## 📝 Exam Hot Spots
อาจารย์ย้ำ "ข้อสอบเป็น case-based MCQ" — ต้องจำลำดับ workup + threshold values:

1. **IBD criteria** — clinical > 3 สัปดาห์, mucus + blood stool, refractory
2. **Modern Tx of IBD** — diet (hydrolyzed/novel) + probiotics + fiber > antibiotic (deprecated)
3. **Refeeding ใน IBD** — 1/7 → 7/7 over 7 days
4. **Large vs small bowel diarrhea** — distinguishing features (table above)
5. **SLE** = "โรคพุ่มพวง" = ≥ 2 organ failure
6. **Polyarthritis** = classic SLE presentation
7. **ANA test** = SPECIFIC for SLE (แต่ไทยยังไม่มี commercial)
8. **CD4/CD8** > 5 → suggest SLE
9. **Cat with SLE-suspected** — must rule out FeLV/FIV first
10. **Sharpei + edema + ↑ kidney values** → think amyloidosis → glomerular disease
11. **First-line immunosuppressive** = Prednisolone (taper 25% q2wk)

---

> 💡 **Tip จากอาจารย์**: "วินิจฉัยเชิงลึก" — เจอเคสเรื้อรังให้คุยกับเจ้าของก่อนว่าต้อง workup ครบ ไม่ใช่แค่ symptomatic
> เจ้าของจะเข้าใจถ้าเราอธิบายดี ส่วนใหญ่จะยอมจ่าย`,
  },
};

// ─────────────────────────────────────────────────────────────
// Helper: lookup summary by URL or videoId
// ─────────────────────────────────────────────────────────────
export function getSummaryForVideo(videoOrUrl) {
  if (!videoOrUrl) return null;
  // Extract videoId from URL
  const m = String(videoOrUrl).match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:[?&]|$)/);
  const videoId = m ? m[1] : videoOrUrl;
  return VIDEO_SUMMARIES[videoId] || null;
}

// Returns { count, subjects } for stats display
export function summaryStats() {
  const subjects = {};
  for (const v of Object.values(VIDEO_SUMMARIES)) {
    subjects[v.subject] = (subjects[v.subject] || 0) + 1;
  }
  return { count: Object.keys(VIDEO_SUMMARIES).length, subjects };
}
