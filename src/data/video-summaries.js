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
  // COM III — Neurological exam + localization
  // ─────────────────────────────────────────────────────────────
  S6uo2I2gfXQ: {
    videoId: 'S6uo2I2gfXQ',
    title: '1. Neurological examination + localization',
    subject: 'com3',
    date: '5 Mar 69',
    durationMin: 113,
    instructor: 'อาจารย์ Neuro',
    examFormat: 'MCQ — exam findings → localization · CN deficit interpretation',
    summary: `# Neurological Examination + Localization

## Purpose of Neuro Exam
1. Confirm clinical signs are NEUROLOGICAL (not orthopedic)
2. **Localize lesion** (which region of nervous system)
3. Identify severity → guide DDx + Tx

---

## Tools Required
- Light source (transilluminator > flashlight = better for PLR)
- Reflex hammer or **artery forceps** (for small dogs)
- Cotton swab (sensation, ray reflex)
- Recording form ⭐ (mandatory for novices — can't remember everything!)

---

## Hand-Off Examination (Watch from afar)

### Mentation (consciousness levels) ⭐⭐
> **DOSCC scale** (or **AODSC**):
> Alert → Depressed (slow response) → Obtund → Stupor (only painful) → Coma

**Localization:**
- **Forebrain (cerebral cortex)** — abnormal mentation, behavior changes, circling
- **Brainstem** — severe consciousness changes
- **Limbic system** — behavior abnormalities (aggression change, vocalization)

### Posture
- **Decerebrate rigidity** ⭐ — extension all 4 limbs + altered consciousness
  - Lesion: **brainstem** or **deep cerebrum**
- **Decerebellate rigidity** ⭐ — extension forelimbs + flexion hindlimbs + NORMAL consciousness
  - Lesion: **cerebellum**
- **Schiff-Sherrington** — extension forelimbs + flaccid paralysis hindlimbs (T3-L3 lesion)

### Spinal alignment
- **Scoliosis, kyphosis, lordosis** (lateral, dorsal, ventral curve)

### Standing posture
- **Plantigrade** = hindlimb hocks down (proprioceptive deficit)
- **Palmigrade** = forelimb wrist down

### Vestibular ataxia (videos)
- Wide-based stance, head tilt, falling to one side, nystagmus

### Gait abnormalities
- **Circling** ⭐ → forebrain or vestibular
- **Head tilt** → vestibular
- **Head turn** → forebrain

### 3 types of Ataxia ⭐
| Type | Cause | Sign |
|------|-------|------|
| **Proprioceptive (sensory)** | spinal cord, nerve | knuckling, dragging foot |
| **Vestibular** | inner ear, brainstem | wide stance, fall to side |
| **Cerebellar** | cerebellum | hypermetria (over-stepping like a soldier!) |

---

## Hand-On Examination

### Postural reactions ⭐⭐ (test conscious processing — passes through 9 segments)
1. **Knuckling** — flip paw → must turn back upright (CN II hot pathway)
2. **Hopping** — lift other limbs, hop on test limb sideways
3. **Visual placing** — animal lifts paw to surface when seeing
4. **Tactile placing** — pet's paw touches table edge → places foot
5. **Wheelbarrow** — lift hind, animal walks on forelimbs
6. **Extensor postural thrust** — drop, animal extends to brace

> 💡 Postural reactions cross **forebrain/cortex** → can be normal in pure peripheral disease, abnormal in cortical disease

### Cranial Nerves (12 pairs!) ⭐⭐⭐

| CN | Name | Test | Localization |
|----|------|------|--------------|
| I | Olfactory | smell food | nasal/forebrain |
| **II** | Optic | **PLR (afferent)**, menace, vision tracking | retina, optic n, forebrain |
| **III** | Oculomotor | **PLR (efferent → constrict)**, eye position, lid opening | midbrain |
| IV | Trochlear | eye dorsoventral | midbrain |
| **V** | Trigeminal | facial sensation, **palpebral reflex (afferent)**, jaw tone, masseter mass | brainstem |
| VI | Abducens | lateral eye movement, retract globe | brainstem |
| **VII** | Facial | **palpebral & menace (efferent)**, lip droop, ear movement, tear production | brainstem |
| **VIII** | Vestibulocochlear | head tilt, nystagmus, hearing | brainstem |
| IX, X | Glossopharyngeal, Vagus | swallow, gag reflex | brainstem |
| XI | Accessory | shoulder muscle | brainstem |
| **XII** | Hypoglossal | tongue motion, deviation | brainstem |

### Spinal Reflexes ⭐⭐
**Hindlimb:**
- **Patellar reflex** (knee jerk) — femoral nerve, **L4-L6** spinal cord
- **Cranial tibial / Sciatic** — sciatic nerve, **L6-S2**
- Withdrawal reflex — sciatic, L6-S2

**Forelimb:**
- **Biceps reflex** — musculocutaneous, **C6-C8**
- **Triceps reflex** — radial, **C7-T2**
- **Withdrawal forelimb** — multiple, C6-T2

### Reflex interpretation
| Pattern | Meaning |
|---------|---------|
| **Hyperreflexia** ⭐ | **Upper Motor Neuron (UMN)** lesion (above the segment) |
| **Hyporeflexia / Areflexia** | **Lower Motor Neuron (LMN)** lesion (at the segment) |

### Pain Sensation ⭐⭐
- **Superficial pain** — pinch skin → withdrawal AND vocalization
- **Deep pain** — pinch toe with hemostat → withdrawal AND CONSCIOUS RESPONSE
- ⚠️ **Withdrawal alone ≠ pain** (can be reflex without pain)
- ⚠️ **Test deep pain only if superficial absent**
- **Loss of deep pain** → severe spinal cord damage, poor prognosis

---

## Localization Summary ⭐⭐
| Lesion | Hindlimb | Forelimb | Mentation | CN |
|--------|----------|----------|-----------|-----|
| Forebrain | normal/proprioceptive | normal | abnormal | normal |
| **C1-C5** | UMN | UMN | normal | normal |
| **C6-T2** | UMN | **LMN** ⭐ | normal | normal |
| **T3-L3** | UMN | normal | normal | normal |
| **L4-S2** | **LMN** ⭐ | normal | normal | normal |
| Brainstem | various | various | abnormal | multiple deficits |
| Cerebellum | hypermetria, intention tremor | same | normal | usually normal |

---

## 📝 Exam Hot Spots
1. **DOSCC** = consciousness scale
2. **Decerebrate** (brainstem) vs **Decerebellate** (cerebellum) — consciousness intact in latter!
3. **Hypermetria** = cerebellar
4. **Knuckling** = proprioceptive deficit
5. **Hyperreflex = UMN**, **Hyporeflex = LMN**
6. **C6-T2 lesion** = UMN hindlimb + LMN forelimb (most concerning for surgery decision)
7. **Withdrawal ≠ pain** (test deep pain consciously)
8. **CN II afferent + CN III efferent** = PLR
9. **CN V afferent + CN VII efferent** = palpebral reflex
10. **Loss of deep pain** = poor prognosis
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Spinal disorder
  // ─────────────────────────────────────────────────────────────
  KiJyyUhIV6M: {
    videoId: 'KiJyyUhIV6M',
    title: '2. Spinal disorder',
    subject: 'com3',
    date: '12 Mar 69',
    durationMin: 74,
    instructor: 'อาจารย์ Surgeon (Spinal)',
    examFormat: 'MCQ — fracture type + spinal pivot points + IVDD breeds',
    summary: `# Spinal Disorders

> 🎯 อ.: "ข้อสอบจะออก compression fracture, spot film, pivot points, breed predisposition" — เน้น 4 จุดนี้

---

## Terminology
- **Plegia** vs **Paresis** ⭐
  - **Plegia** = no ambulation, complete paralysis
  - **Paresis** = weak but can walk
- **Para-** = both hindlimbs
- **Tetra-** = all 4 limbs
- **Hemi-** = one side (L or R)

> Examples: paraplegia, paraparesis, tetraplegia, hemiparesis

---

## Spinal Cord Injury Severity (1-5)
| Grade | Sign |
|-------|------|
| 1 | pain only |
| 2 | ambulatory paresis |
| 3 | non-ambulatory paresis |
| 4 | plegia, deep pain present |
| 5 | plegia, **NO deep pain** ⭐ poor prognosis |

---

## Vertebral Fracture ⭐⭐

### Types
- ⭐ **Compression fracture** = most common (force tracks down vertebral column)
- Luxation fracture
- Pathological (osteoporosis, neoplasia)

### X-ray ⭐⭐
- **MUST do "spot film"** (centered on each vertebra) — central ray must be over the segment
- Don't do whole-body Xray for spine — penumbra distorts
- Look at **3 components**:
  1. **Dorsal** (lamina, spinous process, facets)
  2. **Vertebral canal** (alignment, gap)
  3. **Ventral** (body) — strongest, fractures from compression

### Important: spinal cord status > vertebrae status
- Even if you fix the bone, if cord is severed → no functional recovery
- ⭐ **MRI** before deciding to fix surgically — assess cord intact?

### Acute Tx
- **Methylprednisolone** (used to be standard, now controversial; still used in **first 24 hr** in some protocols)
- **Hyperbaric oxygen** (where available — Chula doesn't have)
- IV fluids, prevent secondary injury

### Surgical fixation
- **Plate fixation** (e.g., Vet Sand plate by Aj. Mar Sak)
- **Pin + PMMA (bone cement)** — like internal external fixator
- ⚠️ Don't fix if cord severed — implant will fail when animal can't walk

## 5 Vertebral Pivot Points ⭐⭐⭐
> Where most diseases happen (pivot = mobile junction = stress)

| Pivot | Reason | Common diseases |
|-------|--------|-----------------|
| **C1-C2** ⭐ | only no IVD here | atlantoaxial subluxation |
| **C5-T1** | C-T junction | Wobbler syndrome, IVDD |
| **T1-T2** ⭐ | rib stops, mobility shifts | rare |
| **T11-L1** ⭐⭐ | thoracolumbar junction | **Hansen Type I IVDD** (most common!) |
| **L7-S1** | lumbosacral | cauda equina syndrome |

---

## Cervical Vertebral Instability (Wobbler Syndrome) ⭐⭐
- Caudal Cervical Spondylomyelopathy
- ⭐ **LARGE breeds**: Doberman, Mastiff, Boxer, **Great Dane**, Old English Sheepdog
- Pathophysiology: instability → ligament hypertrophy/spondylosis → cord compression at C5-C7

### Clinical signs ⭐
- Hindlimb signs FIRST (UMN paraparesis/ataxia)
- Then forelimb LMN (when lesion at C6-T2)
- Neck pain, reluctant to move neck
- Eats lying down (can't bend)

### Dx
- ⭐ **MRI** = gold standard
- X-ray + myelography (older method)

### Tx
- Surgical decompression (ventral slot, dorsal laminectomy, distraction-stabilization)
- Conservative: rest + steroid + neck brace

---

## IVDD (Intervertebral Disc Disease)

### Hansen Type I ⭐ (acute extrusion)
- ⭐ **Chondrodystrophic breeds**: Dachshund, Beagle, Pekinese, Shih Tzu, French Bulldog
- Acute, often T11-L3
- Treatment: **decompressive surgery** (hemilaminectomy)

### Hansen Type II (chronic protrusion)
- Larger non-chondrodystrophic breeds (Lab, GSD)
- Slow progression

### Hansen Type III (acute non-compressive — "high velocity, low volume")
- Sudden lameness, similar to FCE

---

## Other Spinal Diseases

### FCE (Fibrocartilaginous Embolism)
- Sudden non-progressive paralysis after trauma/exercise
- Larger breeds
- Tx: supportive only

### Atlantoaxial Subluxation
- ⭐ **Toy breeds**: Yorkshire Terrier, Chihuahua, Pomeranian
- Cervical pain, neck rigidity, paresis
- C1-C2 instability → cord compression
- Tx: surgical stabilization

### Steroid Responsive Meningitis-Arteritis (SRMA)
- Young large breed (Beagle, Boxer, Bernese)
- Severe neck pain + fever + neutrophilia
- CSF: marked neutrophilic pleocytosis
- Tx: high-dose steroid, dramatic response

### Lumbosacral disease (cauda equina syndrome)
- L7-S1 stenosis
- Tail droop, urinary incontinence, hindlimb weakness
- GSD predisposed

## 📝 Exam Hot Spots ⭐⭐⭐
1. **Compression fracture** = most common spinal fracture
2. **Spot film** for spine X-ray (center on each vertebra)
3. **5 pivot points**: C1-C2, C5-T1, T1-T2, **T11-L1**, L7-S1
4. **Hansen Type I IVDD** = chondrodystrophic, T11-L3, surgery
5. **Wobbler** = large breed (Dane, Doberman, Mastiff)
6. **C6-T2 lesion** = UMN hindlimb + LMN forelimb
7. **AA subluxation** = toy breed, neck stabilization
8. **Loss of deep pain Grade 5** = poor prognosis
9. **MRI** before fixation surgery (cord intact?)
10. **Methylprednisolone** within first 24 hr (controversial but used)
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — AI tools + Neuro ataxia/tremor
  // ─────────────────────────────────────────────────────────────
  'yP72i_yb-DM': {
    videoId: 'yP72i_yb-DM',
    title: '3. AI tools + Neuro ataxia tremor',
    subject: 'com3',
    date: '19 Mar 69',
    durationMin: 117,
    instructor: 'อ.นัทธี (AI workshop) + อ.Neuro',
    examFormat: 'MCQ neuro section: cerebellar abiotrophy breeds + ataxia types',
    summary: `# AI Tools (Workshop) + Neuro Ataxia/Tremor

> 🎯 บทคู่ — ครึ่งแรกเป็น workshop การใช้ AI สำหรับงานวิจัย/การเรียน (อ.นัทธี) · ครึ่งหลัง = neuro ataxia (อ.Neuro)

---

# 🔻 Part 1: AI Tools for Vet Students

## 3 AI Tools Recommended ⭐
| Tool | Best for | Like a friend who... |
|------|----------|---------------------|
| **ChatGPT** | smart "born-to-be" friend | brilliant, less data |
| **Gemini (Google)** | data-rich friend | well-prepared notes |
| **NotebookLM** | "lecture taker" friend | precise note-taking |

## AI Levels (3 layers)
1. **Automation** — door opens, light on (simple sensor)
2. **Machine Learning** — calculates from training data
3. **Deep Learning** ⭐ — combines situations + scenarios (current vet/med use)

## Smart Pet Care 4 Pillars
1. Smart Pet Care (sensors at home — 5 senses analog)
2. Veterinary Clinic (AI-assisted dx for slides, X-ray)
3. Educational Research (data analytics)
4. Drug delivery / monitoring

## Use Cases
- **Personalized diet** (Aj. Hooto's nutrition platform)
- **Smart GPS** for cat tracking
- **Health monitoring** (smart collar like WHOOP for pets)
- Slide cytology / X-ray AI screening (5 conditions)

## ⚠️ Cautions
- **Hallucination** — AI makes up plausible-sounding info
- Don't replace yourself with AI (academic integrity)
- AI improves over use — learns your style → eventually addresses you as "อาจารย์"
- ⭐ **Best time to use**: 7-8 AM (low global server load)

## Workshop Demo
- Use ChatGPT to brainstorm research ideas
- Use Gemini for literature review
- Use NotebookLM to summarize PDFs

---

# 🔻 Part 2: Ataxia & Tremor (Neuro)

## 3 Types of Ataxia ⭐⭐⭐ (review from neuro exam)
| Type | Cause | Lesion | Sign |
|------|-------|--------|------|
| **Proprioceptive** | sensory pathway | spinal cord, peripheral n | knuckling, dragging |
| **Vestibular** | inner ear, brainstem | CN VIII, vestibular nucleus | head tilt, nystagmus, fall to side |
| **Cerebellar** | cerebellum | cerebellum | **hypermetria** (over-stepping), intention tremor, wide stance |

---

## Cerebellar Diseases

### Cerebellar Abiotrophy ⭐⭐
- **Genetic** premature degeneration of Purkinje cells
- ⭐ Breeds: **Old English Sheepdog**, Australian Kelpie, Border Collie, Coton de Tuléar, Bull Terrier, Beagle, Italian Hound, Italian Spinone
- Onset: **young age** (3-12 months typically)
- Progressive
- No treatment, supportive only

### Cerebellar Hypoplasia
- ⭐ **Cats** — feline panleukopenia virus (parvovirus) infection IN UTERO
- Born with non-progressive cerebellar signs
- Static (doesn't worsen)
- Cat can adapt and live well

### Cerebellitis
- Inflammatory (immune-mediated, infectious)
- Acute onset
- Tx: steroid trial

---

## Vestibular Disease

### Peripheral Vestibular ⭐
- **Inner/middle ear** lesion
- Common: otitis media/interna
- Other: tumor, hypothyroidism, **idiopathic geriatric vestibular syndrome** (sudden onset in old dog)
- Signs: head tilt, **horizontal nystagmus** (toward affected side absent), normal mentation

### Central Vestibular ⭐⭐
- **Brainstem** lesion
- More serious! ⚠️ Causes: tumor, infarct, encephalitis
- Signs: head tilt + **vertical or rotary nystagmus** + altered mentation + other CN deficits
- ⭐ **Paradoxical vestibular** = head tilt to OPPOSITE side of lesion (cerebellum lesion)

### Distinguishing Peripheral vs Central
| Feature | Peripheral | Central |
|---------|------------|---------|
| Mentation | normal | **altered** |
| Other CN | usually normal | multiple deficits |
| Nystagmus | horizontal | **vertical or rotary** |
| Postural reactions | normal | abnormal |

---

## Tremors

### Types
- **Resting tremor** — present at rest (often Parkinson-like)
- **Action tremor** — when moving (cerebellar)
- **Intention tremor** ⭐ — worsens approaching target (cerebellar)

### Causes
- **Generalized Tremor Syndrome (GTS / Steroid-Responsive Tremor)** — small white dogs (Maltese, Westy)
  - Tx: **steroid taper** — usually responds well
- **Toxin-induced**: organophosphate, ivermectin, mycotoxin (compost food), pyrethroid (cat!)
- **Hypoglycemia, hypocalcemia**
- **Cerebellar disease**

---

## 📝 Exam Hot Spots
1. **3 ataxia types** (proprioceptive/vestibular/cerebellar)
2. **Hypermetria** = cerebellar
3. **Cerebellar abiotrophy** = Old English Sheepdog (TH question favorite!)
4. **Cerebellar hypoplasia in cats** = panleukopenia in utero
5. **Vertical nystagmus** = CENTRAL vestibular
6. **Paradoxical vestibular** = head tilt opposite side
7. **GTS** (Generalized Tremor) — small white dogs, steroid responsive
8. **Pyrethroid in cats** = serious tremor → death
9. **Ivermectin toxicity** in MDR1 dogs (Collies)
10. AI tools: hallucination caveat + best at 7-8 AM
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Seizure & Narcolepsy
  // ─────────────────────────────────────────────────────────────
  pIcgxusqLag: {
    videoId: 'pIcgxusqLag',
    title: '4. Seizure & Narcolepsy',
    subject: 'com3',
    date: '26 Mar 69',
    durationMin: 113,
    instructor: 'อาจารย์ Neuro',
    examFormat: 'MCQ — seizure type + AED selection + age of onset + first-line drug',
    summary: `# Seizure & Narcolepsy

---

# 🔻 Part 1: Seizure (โรคชัก) ⭐⭐⭐

## Definition vs Other "Loss of Consciousness"
- **Seizure (epileptic seizure)** = abnormal electrical activity in brain
- **Syncope** = cardiac, recovers immediately
- **Vestibular crisis** = balance issue, conscious

## Pathophysiology
- Imbalance between excitatory (**Glutamate**) and inhibitory (**GABA**) neurotransmitters
- Excitatory > Inhibitory → seizure
- Mediated through Na+, Ca2+, K+ channels

## Seizure Types ⭐⭐
| Type | Pattern |
|------|---------|
| **Generalized tonic-clonic** ⭐ | classic — tonic (rigid extension) + clonic (rhythmic jerks), LOC, salivation, urination, paddling |
| **Focal (partial)** | one body part / face only, ± consciousness |
| **Absence (Petit mal)** | "stares into space" 10-30 sec, no fall, retrograde amnesia ⭐ |
| **Generalized after focal** (secondary) | starts focal → spreads to whole body |

> 💡 อ. recounted a real case: 4-yr-old client had absence seizure during history-taking — went silent for ~1 min!

## Classification by Cause ⭐⭐⭐
| Type | Cause | Brain MRI |
|------|-------|-----------|
| **Reactive** | metabolic (hypoglycemia, hepatic encephalopathy, toxin) | Normal |
| **Structural** | tumor, encephalitis, trauma, congenital | **Abnormal** |
| **Idiopathic (genetic)** ⭐ | unknown / inherited | Normal |
| **Cryptogenic / Unknown** | suspect lesion but undetectable | Normal |

## Phases of Seizure (PIPP)
1. **Prodrome** — hours-days before, restlessness
2. **Aura** — minutes before, sensitivity changes (hard to detect in animals — combined with prodrome)
3. **Ictal** — actual seizure
4. **Post-ictal** ⭐ — confusion, blindness (can last days!), pacing, hunger

> 💡 Post-ictal blindness can become permanent if seizures repeat at same focus

## Idiopathic Epilepsy Criteria ⭐⭐
1. ⭐ **First seizure between 6 months - 6 years** (key clue!)
2. Normal interictal exam
3. Generalized tonic-clonic usually
4. Normal MRI + CSF
5. Family history of seizures may exist

**Predisposed breeds** ⭐: Beagle, Labrador, Golden, German Shepherd, Border Collie, Standard Poodle, Boxer, Australian Shepherd

## Status Epilepticus & Cluster Seizures
- **Status epilepticus** = >5 min seizure OR no recovery between seizures (EMERGENCY!)
- **Cluster seizures** = ≥2 seizures in 24 hr
- Treat IMMEDIATELY — high risk of death

## When to Start Anti-Epileptic Drug (AED)? ⭐
1. **Structural seizure** = always (even after 1 episode)
2. **>2 seizures in 6 months**
3. **Cluster or status** episode
4. **Severe post-ictal complications** (blindness)
5. **Single seizure with significant injury**

## Goals
- ⭐ Reduce frequency by **50%+** (not necessarily zero!)
- Maintain quality of life — no zombification

## AEDs ⭐⭐⭐

### First Line
**Phenobarbital** ⭐⭐
- Mechanism: GABA-receptor enhancer
- Dose: 2-2.5 mg/kg PO BID (start)
- Steady state: 2 weeks → recheck level at 6 weeks
- Therapeutic level: **15-35 μg/mL**
- ⚠️ Side effects: sedation/ataxia (1-2 wk transient), polyphagia, polyuria, polydipsia, **hepatotoxicity**, BMS
- Monitor: phenobarbital level + LFT every 6-12 mo

**Levetiracetam (Keppra)** ⭐
- Newer, safer profile
- Dose: 20-30 mg/kg PO TID (frequent dosing!)
- No hepatotoxicity
- Need to source from human pharmacy, expensive

**Imepitoin** (newer)
- 10-30 mg/kg PO BID

### Second Line
- **Potassium bromide (KBr)** — reactive, slow loading
- **Zonisamide** — 5-10 mg/kg BID
- Lacosamide, Topiramate

### Emergency (Status epilepticus)
- ⭐ **Diazepam IV** 0.5-1 mg/kg
- **Midazolam** IV/IM
- **Phenobarbital loading** IV if not on it

### Cat Specifics
- Generally same drugs but CAREFUL doses
- ⚠️ **Phenobarbital cat dose** lower
- ⚠️ **NEVER give bromide to cat** — fatal pulmonary fibrosis!

## Drug Choice Logic
| Scenario | Drug |
|----------|------|
| First seizure, dog | Phenobarbital |
| Cat | Phenobarbital lower dose, or Levetiracetam |
| Severe liver disease | Levetiracetam (no hepatotoxicity) |
| Cluster/status emergency | Diazepam IV first |
| Refractory after pheno | Add Levetiracetam or KBr |

---

# 🔻 Part 2: Narcolepsy

## Definition
- Sudden loss of muscle tone with sleep attack triggered by **excitement or food**
- Cataplexy = sudden muscle weakness without LOC

## Breeds ⭐
- Doberman, Labrador, Poodle (genetic in Doberman — hypocretin/orexin gene)

## Differential
- Vs syncope — narcolepsy has **trigger** (excitement, food)
- Vs seizure — no LOC in cataplexy

## Diagnosis
- **Food challenge** — excited animal at feed → may collapse
- Genetic test in Doberman
- Hypocretin levels (research)

## Treatment
- Imipramine, fluoxetine (serotonergic)
- Methylphenidate (stimulant)
- Lifelong management

---

## 📝 Exam Hot Spots ⭐⭐⭐
1. **Idiopathic epilepsy** = age **6 mo - 6 yr** ⭐
2. **Reactive seizure** = normal MRI, find cause (metabolic/toxin)
3. **Phenobarbital** = first line, level 15-35 μg/mL, monitor LFT
4. **Status epilepticus** = ≥5 min OR no recovery
5. **Diazepam IV** = emergency stop
6. **NEVER bromide to cats** (lung fibrosis)
7. **Goal**: reduce frequency 50%+
8. **Levetiracetam** = no liver toxicity, safer alt
9. **Tonic** = rigid · **Clonic** = jerk · **Absence** = stare/blank
10. **Predisposed**: Beagle, Lab, Golden, GSD, Border Collie
11. **Narcolepsy** = food/excitement trigger, Doberman genetic
12. **Post-ictal blindness** can last days; repeated → permanent
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Circulatory System + Acute abdomen + CPR
  // ─────────────────────────────────────────────────────────────
  agw6OuRWy5A: {
    videoId: 'agw6OuRWy5A',
    title: '6. The Circulatory System + Acute abdomen',
    subject: 'com3',
    date: '9 Apr 69',
    durationMin: 114,
    instructor: 'อ.รัสมา (CPR + Acute abdomen)',
    examFormat: 'MCQ — CPR rate/depth + drug + RECOVER guidelines + acute abdomen DDx',
    summary: `# Circulatory System + Acute Abdomen + CPR

> 🚑 ตามชื่อจริงคลิปเป็น **CPR + Acute Abdomen**

---

# 🔻 Part 1: CPR (Cardio-Pulmonary-Cerebral Resuscitation) ⭐⭐⭐

## Detect Response (10 sec rule!)
1. **Call name + tactile stimulus** (poke) → conscious?
2. **Look at chest** — breathing?
3. ⚠️ **Don't waste time** auscultating heart or feeling pulse — uses 10+ sec

> ⭐ When in doubt → **start CPR immediately**! "Begin first, ask questions later"

### Breathing patterns to start CPR:
- **Apnea** (no breathing)
- **Agonal breathing / gasping** ⭐ — slow deep gasps with NO consciousness = dying
  - But if returning during CPR = positive sign of ROSC!

---

## Team Setting (Optimal CPR ≥ 4-5 people)
| Role | Job |
|------|-----|
| Compressor | chest compression — at **dorsal side** of patient |
| Ventilator | bag/intubation — **head end** |
| Advance Life Support | IV catheter, drugs, monitor |
| Recorder | times, drugs given, response |
| **Leader** ⭐ | directs commands, walks around |
| Abdominal Interpose | press abdomen alternating with chest |

### Communication ⭐
- **Closed-loop**: leader gives order → operator REPEATS back → does action
- Like military to prevent mistakes ("0.4 mL IV epi" → "0.4 mL IV epi giving now")

### CPR Status Color Codes ⭐
- 🔴 **Red** = DNR (Do Not Resuscitate)
- 🟡 **Yellow** = closed-chest CPR only
- 🟢 **Green** = open-chest CPR allowed (during open thoracic surgery)

---

## Basic Life Support (BLS)

### Chest Compression ⭐⭐⭐
- **Rate: 100-120/min** ⭐ (same for dog AND cat!)
- **Depth: 1/3 to 1/2 chest** for lateral; 1/4 for brachycephalic supine
- ⭐ **Allow full chest recoil** — NO leaning between compressions!
- Position: stand on stool to **straddle** dog, **arms locked straight**, force from core/abs (like pushup)
- Switch compressor every **2 min** (fatigue ↓ quality)

### Compression Strategy by Patient
| Body type | Theory | Hand position |
|-----------|--------|---------------|
| **Keel-chested** (Doberman, Greyhound, sighthound) | **Cardiac pump** | directly over heart (4th-6th IC space, 1/3 from ventral) |
| **Round-chested** (large breeds, Lab, Golden) | **Thoracic pump** | apex of chest (most prominent point) |
| **Cat / small (<7 kg)** | Cardiac pump | one-hand grip over heart |
| **Brachycephalic** (Bulldog, Pug) | similar to human | dorsal recumbency, sternal compress 1/4 depth |

### Ventilation
- **10 breaths/min** while intubated (continuous compression + ventilation)
- Mouth-to-snout if no tube
- 1:2 - 1:5 ratio (older protocols)
- Don't over-ventilate

---

## Advanced Life Support (ALS)

### IV Access — establish ASAP

### Drugs ⭐
| Drug | Dose | When |
|------|------|------|
| **Epinephrine (Low dose)** ⭐ | 0.01 mg/kg IV (q3-5 min) | First-line, asystole/PEA |
| **Atropine** ⭐ | 0.04 mg/kg IV | Bradycardia, vagal arrest |
| **High-dose Epinephrine** | 0.1 mg/kg IV | After multiple low-dose failures |
| **Vasopressin** | 0.8 U/kg IV | Alternate to epi |
| **Lidocaine** | 2 mg/kg IV | V-fib, V-tach |
| **Amiodarone** | 5 mg/kg IV | Refractory V-fib |
| **Naloxone** | 0.04 mg/kg | Opioid OD reversal |
| **Flumazenil** | 0.01 mg/kg | Benzo reversal |

### Defibrillation
- For V-fib or pulseless V-tach only (NOT asystole)
- 4-6 J/kg monophasic, 2-4 J/kg biphasic

### ROSC (Return Of Spontaneous Circulation) Care
- Maintain BP, oxygenation
- Treat post-cardiac arrest syndrome

### CPR Outcome
- Survival rate ~5-10% (low!) — that's why early detection matters

---

# 🔻 Part 2: Acute Abdomen

## Definition
- Sudden severe abdominal pain ± systemic illness
- Often surgical or near-surgical decision

## Common Causes (DDx) ⭐⭐
| Category | Examples |
|----------|----------|
| **Inflammation** | Pancreatitis, peritonitis |
| **Infection** | Bacterial/viral enteritis, sepsis |
| **Obstruction** | GDV, foreign body, intussusception |
| **Vascular** | Mesenteric torsion, splenic infarct |
| **Hemorrhage** | Splenic mass rupture, trauma |
| **Urogenital** | Pyometra, ureteral obstruction, ruptured bladder |
| **Trauma** | HBC, fall |

## Approach
1. **Triage ABCDE** (ER section)
2. **History** — recent food, eating, drinking, V/D, urination
3. **Physical**: abdominal palpation (pain, mass, fluid, distension)
4. **Bloods**: CBC, biochem, lactate, electrolytes
5. **Imaging**: X-ray, US (abdominocentesis if fluid)
6. **Specific tests**: SNAP cPL (pancreatitis), urine sediment

## Red Flags Requiring Surgery
- **GDV** ⭐ (gastric rotation visible on Xray = "double bubble")
- **Septic peritonitis** (free abdominal fluid + low glucose vs. blood)
- **Bowel obstruction** (foreign body or intussusception)
- **Hemoabdomen** with hypotension
- **Ruptured bladder** (uroperitoneum)

## Pre-op Stabilization
- Fluid resuscitation
- Pain control (opioid)
- Treat shock
- Antibiotics if sepsis suspected
- Correct electrolyte imbalance

---

## 📝 Exam Hot Spots
1. **CPR rate 100-120/min** (dog & cat same)
2. **Depth 1/3 to 1/2** chest
3. **Full recoil** between compressions
4. **Switch compressor q 2 min**
5. **Cardiac pump** = keel-chest; **Thoracic pump** = round chest
6. **Brachycephalic** = supine 1/4 depth
7. **Epinephrine 0.01 mg/kg IV** = first-line CPR drug
8. **Atropine 0.04 mg/kg** for bradycardia/vagal
9. **Defib only for V-fib** (not asystole)
10. **Closed-loop communication** in CPR
11. **Acute abdomen DDx** by cause categories
12. **GDV** double bubble Xray = surgical emergency
13. **Septic peritonitis** = abdominocentesis fluid analysis (glucose, lactate)
14. **Splenic mass rupture** = elderly large breed hemoabdomen
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Metabolic + Endocrine + UT + Nutrition (Addison/DKA)
  // ─────────────────────────────────────────────────────────────
  U9w_pJNkulc: {
    videoId: 'U9w_pJNkulc',
    title: '7. Metabolic, Endocrine, UT + Nutrition',
    subject: 'com3',
    date: '16 Apr 69',
    durationMin: 100,
    instructor: 'อ.รัสมา (ER metabolic)',
    examFormat: 'MCQ — Addison crisis + DKA management + RER calc + UT obstruction',
    summary: `# Metabolic & Endocrine ER + Urinary Tract + Nutrition

> 🚑 ER section continued — Addison + DKA review + UT obstruction + nutritional support

---

# 🔻 Part 1: Addison Crisis (Hypoadrenocorticism) ⭐
> 📚 Already detailed in Cushing/Addison summary — this is the ER focus

### Acute Tx ⭐⭐
1. **IV fluids** — full shock dose (NaCl 0.9%)
2. **Dexamethasone 0.5-1 mg/kg IV** ⭐ — dramatic 1-2 hr response
3. **Hyperkalemia management:**
   - Glucose ± insulin (drives K+ into cells)
   - Ca gluconate (cardioprotect)
   - NaHCO₃ if acidotic
4. Monitor electrolytes q6h, ECG
5. ⭐ **Dex doesn't interfere with ACTH stim** — give now, confirm later

### Chronic Tx
- **DOCP injection** q25 days (mineralocorticoid only) — not in TH
- **Fludrocortisone (Florinef)** PO — both gluco + mineralo
- 50-60% controlled with Florinef alone; 30-40% need pred too

### Na/K ratio threshold
- **< 27** = suspect Addison
- **< 20** = Crisis
- ⚠️ Don't rule out if Na low alone (early stage K may still normal)

---

# 🔻 Part 2: Diabetic Ketoacidosis (DKA) ⭐⭐⭐

## Definition (3 criteria — all must present!)
1. **Diabetes** (hyperglycemia)
2. **Ketosis** (ketonuria, ketonemia)
3. **Acidosis** (low pH, low HCO₃, ↑ anion gap)

## Pathophysiology
- Insulin deficiency → cells starve → switch to fat metabolism
- **β-oxidation** → ketogenesis: **acetone, acetoacetate, β-hydroxybutyrate** ⭐ (most acidic, most abundant)
- Ketones = strong acids → metabolic acidosis

## Predisposing Factors
- Untreated/under-treated DM
- **Concurrent diseases**: pancreatitis, **UTI** ⭐, hyperadrenocorticism, hepatic lipidosis, neoplasia, viral/bacterial infection (insulin resistance)
- Missed insulin doses

## Clinical Signs ⭐
- **"Sick & sad"** — opposite of regular DM ("happy & hungry")
- Anorexia, vomiting, lethargy
- Severe dehydration
- ⭐ **Kussmaul breathing** — deep + rapid (compensating for metabolic acidosis)
- Acetone breath (rare to detect — pet halitosis covers it)
- Hepatomegaly (fatty liver from massive lipolysis)
- BCS poor
- Polyuria, polydipsia (severe)

## Diagnosis
- **Hyperglycemia** > 360 mg/dL typically (sometimes lower)
- **Glucosuria + ketonuria** (urine dipstick)
- **Blood ketone** test (more reliable than urine)
- **Metabolic acidosis** (pH ↓, HCO₃ ↓, **anion gap > 24**)
- ↑ osmolarity (risk of cerebral edema)
- Azotemia (dehydration prerenal)
- Electrolyte derangements: ↓ K+, ↓ Cl-, ↓ Mg, ↓ PO₄, often ↓ Na+ (dilutional)

## Treatment ⭐⭐⭐ (in order!)
**STEP 1: Address shock with fluids** (NOT insulin first!)
- Crystalloid bolus 10 mL/kg
- ⭐ **Lower osmolarity SLOWLY** (over ~6 hr) to avoid **cerebral edema**!

**STEP 2: Correct electrolytes** (especially K+)
- **K+ MUST be in normal range BEFORE insulin!**
- Insulin drives K+ into cells → if low already → critical hypokalemia
- Add KCl to fluids per Body protocol

**STEP 3: Start insulin**
- ⭐ **Regular (short-acting) insulin** = preferred
- **IM** route: 0.2-0.25 U/kg q1h (good if can't tolerate IV fluid load)
- **IV CRI**: 2.2 U/kg (dog) or 1.1 U/kg (cat) in 250 mL NaCl
- Goal: lower glucose **slowly** (50 mg/dL/hr)
- When glucose < 250-300 mg/dL → add **Dextrose** to fluid (5-10%) so insulin can keep working without hypoglycemia
- Continue until ketones clear (1-3 days)

**STEP 4: Bicarbonate** (only if pH < 7.0 or HCO₃ < 12, severe)

**STEP 5: Treat underlying disease** (pancreatitis, UTI, etc.)

---

# 🔻 Part 3: Urinary Tract Obstruction

## Cat Urethral Obstruction (covered in Triage clip too)
- **Hyperkalemia** = killer (must reduce < 7.5 before GA!)
- Glucose + insulin, Ca gluconate, IV fluid
- Decompress bladder + urethral catheterization

## Dog UT obstruction
- Often males (urethra narrower)
- Stones (struvite, calcium oxalate) common cause
- Tx: catheter or surgery (urethrostomy if recurrent)

## Acute Kidney Injury (AKI)
- Causes: hypotension, toxins (NSAID, ethylene glycol, lily in cat), infection, post-renal
- Tx: IV fluids, treat cause, ± dialysis if severe

---

# 🔻 Part 4: Nutritional Support in Critical Patient

## RER (Resting Energy Requirement) ⭐⭐
> **RER (kcal/day) = 70 × BW(kg)^0.75**
>
> Or simplified: **RER = 30 × BW + 70** (for 2-30 kg only)

### For 20-kg dog:
- 30 × 20 + 70 = **670 kcal/day** ⭐ (this exact number was tested in COM III past paper Q70!)

## Feeding strategies
- Ill animals NEED nutrition — don't starve!
- **Re-feeding rule**: start at 1/3 RER day 1 → ramp up over 2-3 days (avoid refeeding syndrome)

## Routes
- **Voluntary oral** (best if eating)
- **Esophagostomy tube** (preferred for prolonged anorexia in cat)
- **Gastrostomy tube (PEG)** — long-term
- **NG/NE tube** — short-term
- **TPN/PPN** (parenteral) — only when GI not usable

## Concurrent issue: Refeeding syndrome
- Sudden carb load → insulin spike → K+, Mg, PO₄ shift into cells → severe deficiency
- Especially in chronic anorexia

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Addison Crisis
1. **Dex 0.5-1 mg/kg IV** acute
2. Dex doesn't interfere with ACTH stim test
3. Glucose+insulin for hyperK
4. Na/K ratio < 20 = crisis

### DKA ⭐⭐
1. **3 criteria**: Diabetes + Ketosis + Acidosis
2. ⭐ **β-hydroxybutyrate** = main strong-acid ketone
3. **Kussmaul breathing** = deep+rapid (acidosis compensation)
4. ⭐ **Treatment order**: fluid → electrolyte (esp K+) → insulin
5. ⭐ **Lower osmolarity SLOWLY** (cerebral edema risk!)
6. **Regular insulin** = preferred (short-acting)
7. K+ must be corrected BEFORE insulin
8. Insulin IM 0.2 U/kg q1h or IV CRI 2.2/1.1 U/kg
9. When glucose < 300 → add Dextrose to fluid
10. Anion gap > 24 = significant DKA

### UT
1. Hyperkalemia is #1 killer in obstruction
2. ⊘ Avoid Ketamine in cat with renal/UT issue

### Nutrition
1. ⭐ **RER 30 kg dog** (20 kg) = **30×20+70 = 670 kcal/day**
2. Refeeding rule: start 1/3 RER, ramp up
3. Esophagostomy tube preferred for cat anorexia
4. Refeeding syndrome = hypoK/Mg/PO4 with sudden feed
`,
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
  // COM III — Shock + Respiratory & Cardiovascular Emergency
  // ─────────────────────────────────────────────────────────────
  bQNeOLU2nD4: {
    videoId: 'bQNeOLU2nD4',
    title: '5. Shock + Respiratory and Cardiovascular Emergency',
    subject: 'com3',
    date: '2 Apr 69',
    durationMin: 116,
    instructor: 'อ.รัสมา (ER section)',
    examFormat: 'Case-based MCQ — DO₂ formula, shock type, fluid choice, pressor selection, fail quadrant',
    summary: `# Shock + Respiratory & Cardiovascular Emergency

> 🎯 ภาพรวม ER section · Shock = O₂ supply ≠ demand → cardiovascular collapse
> ⚠️ Shock ไม่ใช่ "หมดสติ" — ส่วนใหญ่ยังรู้สึกตัว · ดูจาก perfusion parameter

---

# 🔻 Part 1: Shock

## DO₂ formula ⭐⭐⭐
> **DO₂ = CaO₂ × CO**
>
> CaO₂ = (Hb × SaO₂ × 1.34) + (PaO₂ × 0.003)
> CO = SV × HR

**Factors that lower DO₂:**
- ↓ Hb → anemia
- ↓ SaO₂ → hypoxemia (lung problem)
- ↓ SV → hypovolemia, weak contractility
- ↓ HR → bradycardia

## 6 Types of Shock ⭐⭐⭐

| Type | Sub-class | Cause | Cool/Warm |
|------|-----------|-------|-----------|
| **Hypovolemic** | Circulatory | Blood loss, V/D, polyuria, 3rd space loss | Cold (vasoconstrict) |
| **Cardiogenic** | Circulatory | Pump failure: DCM/HCM/MMVD, arrhythmia, tamponade | Cold |
| **Obstructive** | Circulatory | GDV, tension PTX, pulmonary embolism | Cold |
| **Distributive** ⭐ | Circulatory | **Sepsis**, SIRS, anaphylaxis (vasodilation) | **Warm** ⭐ |
| **Metabolic** | Non-circulatory | Hypoglycemia, cyanide → mitochondrial dysfunction | varies |
| **Hypoxic** | Non-circulatory | Severe anemia, primary lung disease | varies |

> 💡 **Distributive shock = "warm shock"** — vasodilation, brick-red mm, bounding pulse · ตรงข้ามกับ hypovolemic = cold shock

## SIRS / Sepsis Criteria

**SIRS** (in dog) — 2 of 4:
| Parameter | Threshold |
|-----------|-----------|
| Temperature | < 38 or > 39.5°C |
| HR (dog) | > 120 |
| HR (cat) | < 140 OR > 250 ⭐ (cat low rate also counts!) |
| RR | > 20 |
| WBC | > 16k or < 6k or > 3% bands |

> Cat needs **3 of 4** (more strict)

**Sepsis** (new definition, 2 yr ago in human, sỉp into vet):
- Old: SIRS + infection
- **New: organ dysfunction from infection** (no SIRS required)
- **Septic shock** = sepsis + circulatory collapse (lactate ↑ or MAP < 65)
- Most common bug: **E. coli** (gram-negative) from blood culture

**MODS** = Multiple Organ Dysfunction Syndrome (≥ 2 organs dysfunctional)

## Stages (hypovolemic dog ⭐ different in cat)
| Stage | HR | CRT | BP | mm |
|-------|-----|-----|-----|-----|
| Compensate | ↑↑ tachy | < 1 sec (fast) | normal | injected |
| Early decompensate | ↑ but less | 2-3 sec (prolonging) | starting to drop | pale |
| Late decompensate | ↓ bradycardic | > 3 sec | drops sharply | gray/white |

## ⚠️ Cat Shock Triad
1. **Hypotension**
2. **Hypothermia**
3. **Bradycardia** ← cat doesn't tachy like dog!

> 💡 Cat ≠ small dog · cat shock = **bradycardia + hypothermia** classic

## Diagnosis Tools
- **Lactate** > 2.5 mmol/L → suspect shock
  - Type A = ↑ from anaerobic metabolism (true shock)
  - Type B = ↓ excretion only
- **ScvO₂** (central venous O₂ sat): normal 65-75%
- **Shock Index** (dog only) = HR / SBP — > 1 = suspicious

## Treatment

**🎯 ทุก shock → start with O₂ supplementation** (ปลอดภัย, อาจจะช่วย)

| Shock Type | Primary Tx |
|------------|-----------|
| **Hypovolemic** | **Fluids** ⭐ (see below) |
| **Cardiogenic** | ⊘ NO fluids! → **inotrope** (dobutamine), diuretics |
| **Obstructive** | Fluids at **proximal** to obstruction (e.g., GDV → forelimb IV); decompress |
| **Distributive** | Fluids (supplemental) + **pressor** (norepinephrine) + antibiotics ASAP |
| **Hypoxic** | O₂ ± transfusion |
| **Metabolic** | Treat cause (glucose, antidote) |

### Fluid resuscitation (modern approach)
> ⚠️ **เก่า:** 90 mL/kg/hr dog, 60 mL/kg/hr cat — **เลิกใช้แล้ว!**
>
> **ใหม่: Small Volume Resuscitation**
> - Dog: **10 mL/kg over 10 min** (crystalloid bolus)
> - Cat: **5-10 mL/kg over 10-15 min**
> - Reassess perfusion params → repeat ก้อนถัดไปถ้ายังไม่ดี
> - Max **3 boluses** (ไม่งั้นจะบวม)

| Fluid | Dose | Use |
|-------|------|-----|
| **Crystalloid** | 10 mL/kg dog, 5-10 cat / 10 min | first line |
| **Colloid** | 10-20 mL/kg dog, 5-10 cat | switch to ถ้า crystalloid 2-3 boluses ไม่พอ |
| **Hypertonic saline** | 4-5 mL/kg dog, 2-4 cat | ⚠️ contraindicated if dehydrated/hypernatremic |

### Pressors (Distributive/Septic shock)
| Drug | Action | Use |
|------|--------|-----|
| **Norepinephrine** ⭐ first line | α₁ +++ , β₁ + | best for septic shock (focus vessels, not heart) |
| Phenylephrine | α₁ only | alt to NE |
| Dopamine | β₁ +, α + | ↑ mortality, less preferred now |
| **Dobutamine** ⭐ | β₁ ++ (heart) | **first line for cardiogenic shock** |
| Epinephrine | α + β | anaphylaxis |

### Other Adjuncts
- **Bicarb** if pH < 7.2 or HCO₃ < 12
- **Glucose** for metabolic shock with hypoglycemia
- **Antibiotic** for septic shock — earlier = better survival
- **Diuretic (furosemide)** for cardiogenic with fluid overload
- ⚠️ **Steroid (Dex) — DEPRECATED** for routine shock (↑ mortality from GI ulcer)
  - Reserve for **CIRCI** (Critical Illness-Related Corticosteroid Insufficiency) — physiological dose only
- ⚠️ **NSAID — contraindicated** (kidney + GI risk in shock)

### DIC ("Death Is Coming Soon" 💀)
- Disseminated Intravascular Coagulation
- = SIRS + MODS in coagulation system
- **Early (hyper)** — microthrombi form, hard to detect (need TEG)
- **Late (hypo)** — bleeding everywhere (PT/aPTT prolonged) — easy to detect, but mostly fatal

---

# 🔻 Part 2: Respiratory Emergency

## Hypoxemia diagnostic parameters

### Blood Gas
- **PaO₂** (arterial!) — gold standard but hard to draw
- Normal SaO₂ > 95% · < 75 = serious · < 55 = critical → **ventilator**
- **PaCO₂** (CO₂ has 20× higher diffusion than O₂ → better marker for **ventilation**)
  - **Hypo-vent** → ↑ CO₂ (> 50 = significant) → respiratory acidosis
  - **Hyper-vent** → ↓ CO₂

### A-a Gradient ⭐
- A = alveolar O₂ (calculated)
- a = arterial O₂ (measured)
- Normal **< 15** · > 15 = **diffusion problem** = parenchymal lung disease

### PF Ratio
- = PaO₂ / FiO₂
- Normal ~500 (room air FiO₂ 0.21, PaO₂ ~100)
- < 300 = lung injury · **< 200 = ARDS** (acute respiratory distress syndrome)

### SpO₂ (pulse ox)
- Should be > 95% · < 90-92 = significant
- Sites: tongue, ear, lip · noisy → measure repeatedly

## Localization of Respiratory Distress

| Location | Sign | Examples |
|----------|------|----------|
| **Large airway** (upper) | **Stridor** (high pitch larynx) / **Stertor** (low pitch nasopharynx) | BOAS, laryngeal paralysis, FB |
| **Small airway** (lower) | **Wheeze** (expiratory) | Feline asthma, bronchitis |
| **Parenchyma** | Crackles, dull lung | Pneumonia, ARDS, pulm contusion, edema |
| **Pleural space** | Muffled lung, dull on percussion | Pneumothorax, effusion, hemothorax, diaphragmatic hernia |
| **Pulmonary thromboembolism** | sudden tachypnea, normal lung sound | IMHA, pancreatitis, sepsis |
| **Look-alike** | normal lung | Shock (compensatory tachypnea), brain injury, severe pain, neuro paralysis (cobra bite!) |

## Treatment

### O₂ supplementation methods
| Method | FiO₂ achievable | Stress |
|--------|-----------------|-------|
| **Flow-by** (in front of nose) | low | minimal — use during procedure |
| **Mask** | medium | moderate |
| **Nasal cannula** | medium-high | low (long-term) |
| **Oxygen cage** | high | low |
| **High-flow nasal cannula (HFNC)** ⭐ | very high (controlled FiO₂, T°, humidity) | low |
| **Ventilator** | 100% | sedated/intubated |

> 💡 ถ้าไม่แน่ใจ → **flow-by ก่อน** ปลอดภัยที่สุด ไม่มี contraindication

### Ventilator indications
- **PaO₂ < 60 mmHg** (severe hypoxemia)
- **PaCO₂ > 50 mmHg** (hypoventilation)
- Snake bite (cobra) — anticipate diaphragm paralysis
- Severe ARDS

### Pressure vs Volume control
- ICU patients with stiff/diseased lungs → **Pressure control** (safer, prevents barotrauma)
- Don't push 20 mL/kg volume into damaged lungs → pneumothorax!

### O₂ Toxicity ⚠️
- FiO₂ > 60% for > 3-4 hr → free radical damage
- Keep FiO₂ ≤ 50% (safe), or ≤ 60% (acceptable) when prolonged

### Tracheostomy (last resort if airway block)
- Temporary tube placement
- Replaceable tube, smaller bore

---

# 🔻 Part 3: Cardiovascular Emergency

## Heart's Priorities (when failing)
1. **Cardiac filling pressure** ← lose first
2. **Tissue perfusion** (coronary)
3. **Arterial pressure** ← preserved last (until very late)

## Backward vs Forward Fail
- **Backward fail** ⭐ พบก่อนเสมอ
  - LV fail → fluid backs up to **lungs** → pulmonary edema
  - RV fail → fluid backs up to **systemic** → ascites, pleural effusion
  - ⚠️ **Cat exception**: LV fail can cause **pleural effusion** too (different anatomy)
- **Forward fail**
  - = Cardiogenic shock
  - Drop in BP, weak pulse, cold extremities

## 4 Quadrants of Heart Failure ⭐⭐
| | Dry (no edema) | Wet (edema) |
|---|----------------|-------------|
| **Warm** (forward OK) | Compensated | Backward fail (most common!) |
| **Cold** (forward fail) | Pure forward fail (low-output) | Decompensated total fail |

## Treatment by Quadrant

### Warm-Wet (most common ER presentation)
- **Furosemide IV 2 mg/kg** ⭐
  - Repeat q1h until RR < 30
  - ⚠️ Watch kidney function (renal-excreted)
  - Then taper to maintenance (BID/TID)
- **Pimobendan** ⭐ (positive inotrope + vasodilator) — kill 2 birds 1 stone
- O₂ supplementation
- Drain effusion if pleural/abdominal

### Cold-Dry (rare, low-output)
- **Dobutamine CRI** (β₁ inotrope) — kicks heart muscle
- Avoid fluids

### Cold-Wet (severe, both forward + backward)
- **Pimobendan** + dobutamine
- Less aggressive on furosemide (already cold)
- Arterial dilator → dump load forward → indirectly clears edema

### Diastolic dysfunction (e.g., HCM)
- Problem = **can't relax** to receive blood
- Inotrope **doesn't help** — already small chamber
- **Diuretic** + **venodilator** (nitroglycerin) helps
- ⚠️ Don't use arterial dilator — not the issue

## Drug Reference
| Drug | Action | Dose |
|------|--------|------|
| **Furosemide** | Loop diuretic | 2-4 mg/kg IV (acute), 1-2 PO BID (maintenance) |
| **Pimobendan** ⭐ | Ca-sensitizer + Vasodilator | 0.25-0.5 mg/kg PO BID |
| **Dobutamine** | β₁ inotrope | 5-15 μg/kg/min CRI |
| **Sodium nitroprusside** | A+V dilator | CRI; ⚠️ contraindicated in hypotension |
| **Hydralazine** | Arterial dilator | PO |
| **Amlodipine** | Ca channel blocker | First-line for **feline hypertension** |
| **Sedation** in CHF | opioid (butorphanol/methadone, fentanyl) | low dose — DON'T use ace if hypotensive |

> 💡 **Furosemide IV preferred** ใน acute CHF — เร็วกว่า IM และไม่ต้องเสี่ยงเปิดเส้น 2 ครั้ง

## Pericardial Effusion → Tamponade
- ⭐ **Whole heart enlargement** on radiograph (not specific chamber)
- → Echo to confirm
- Signs: muffled heart sounds, weakness, syncope, ascites, tachycardia, weak pulse
- Tx: **Pericardiocentesis** (drain) ± diuretic (don't help much, fluid not the issue)
- Common in **dogs** (rare in cat) · usually atrial mass (hemangiosarcoma) in old large breed

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Shock
1. **DO₂ formula** = CaO₂ × CO
2. **6 types** with classification (4 circulatory + 2 non-circulatory)
3. **Cat shock triad**: hypotension + hypothermia + **bradycardia**
4. **SIRS criteria** (2/4 dog, 3/4 cat — cat HR < 140 also counts)
5. **Sepsis new definition** = infection + organ dysfunction
6. **Septic shock = distributive** (warm shock)
7. **Lactate > 2.5** → suspect shock
8. **Small volume resuscitation** = 10 mL/kg/10 min × ≤ 3 boluses
9. **Fluid in cardiogenic = NO!**
10. **Norepinephrine** = first-line pressor in septic shock
11. **Dobutamine** = first-line for cardiogenic
12. **DIC** = SIRS+MODS in coag, hyper → hypo phase
13. ⚠️ **Steroid for shock = deprecated** (CIRCI exception only, low dose)

### Respiratory
1. **PaCO₂** = ventilation marker (>50 sig) · **PaO₂** = oxygenation
2. **A-a gradient > 15** = parenchymal disease
3. **PF ratio < 300** = lung injury · **< 200 = ARDS**
4. **Stridor** (high) = larynx · **Stertor** (low) = nasopharynx
5. **Ventilator indication**: PaO₂ < 60 OR PaCO₂ > 50
6. **O₂ toxicity** if FiO₂ > 60% for > 3-4 hr
7. **Pressure control** for sick lungs (not volume)
8. **Hyper-vent** → low CO₂ · **Hypo-vent** → high CO₂

### Cardiovascular
1. **Backward fail** comes first → forward fail later
2. **Cat LA fail** can cause **pleural effusion** (≠ dog!)
3. **4 quadrants**: warm/cold × dry/wet
4. **Furosemide 2 mg/kg IV** acute CHF
5. **Pimobendan** = inotrope + vasodilator
6. **Dobutamine** = pure inotrope (β₁)
7. **Whole heart enlargement** on Xray → think **pericardial effusion**
8. **Pericardiocentesis** = treatment of tamponade
9. ⚠️ Diastolic dysfunction (HCM) — **don't add inotrope**

---

> 💡 **อ.รัสมา closing tip:**
> "ทุกอย่างให้ O₂ ก่อน ไม่ผิด"
> "DIC = Death Is Coming Soon — ถ้าเจอแล้ว survival rate ต่ำมาก"
> "แมวไม่ใช่หมาตัวเล็ก — รู้ไว้!"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Triage + Emergency anesthesia
  // ─────────────────────────────────────────────────────────────
  azotEvqwcZo: {
    videoId: 'azotEvqwcZo',
    title: '8. Triage + Emergency anesthesia',
    subject: 'com3',
    date: '23 Apr 69',
    durationMin: 137,
    instructor: 'อ.รัสมา (Triage) + อ. (Emergency anesthesia)',
    examFormat: 'Case-based MCQ — A/B/C/D/E primary survey + drug choice ใน compromised patients ออกบ่อย',
    summary: `# Triage + Emergency Anesthesia

> 🚑 **Triage** = คำฝรั่งเศส แปล "to sort" — แบ่ง emergency vs stable
> ER ≠ Med · ER ซักประวัติสั้น + primary survey ก่อน → resuscitate → secondary survey
> Med ตรวจ full history + full physical exam ก่อน

---

# 🔻 Part 1: Triage (อ.รัสมา)

## Color Coding
| สี | Status | ความเร่งด่วน |
|----|--------|-------------|
| 🔴 **Red — Unstable** | ต้อง resuscitate ทันที (เสี้ยววินาที) | CPR, severe trauma, GDV, choked airway, active bleeding ไม่หยุด, ไส้ไหล |
| 🟡 **Yellow — Potentially unstable** | ภายใน 1 ชม. | open fracture, burn, repeated V/D, urethral obstruction |
| 🟢 **Green — Stable** | รอได้ / ส่งอายุรกรรม | เจ็บขา, คัน, เช็ดหู (เจ้าของชอบมา 2 AM!) |

> ⚠️ **อย่าตัดสินจากภายนอกอย่างเดียว** — IVDD paralyzed 2 ปีแล้ว = ไม่ใช่ ER · นั่งหายใจ effort เยอะ = ER

## ABCDE Primary Survey ⭐⭐⭐

### 🅰️ Airway + 🅱️ Breathing

**Look:**
- Effort เพิ่ม? abdominal breathing? **orthopnea** (ยืดคอกางศอก)?
- Nasal flaring? open-mouth breathing (cat = significant!)
- Apnea? (ช่องอกไม่ขยับ)

**Listen:**
- **Stridor** = high-pitched (lower upper airway: larynx)
- **Stertor** = low-pitched (nasopharynx)
- Crackles, harsh sounds → lower airway disease

**⚠️ Paradoxical breathing** = อกกับท้องไปคนละทิศ
- หายใจเข้า → อกขยายแต่ **ท้องยุบ** (sliding diaphragm)
- = diaphragm fatigue หรือ pleural space disease (effusion)

> 💡 Brachycephalic cat (Persian, Exotic) อ้าปากหายใจตอนร้อนได้ — ไม่ critical เสมอไป

### 🅲 Circulation — perfusion parameters (6 ตัว)
| Parameter | Normal | Abnormal |
|-----------|--------|----------|
| **Mentation** | alert | **DOSCC**: Depressed → Obtund → Stupor → Coma |
| **Mucous membrane** | pink | pale (anemia/perfusion), cyanosis (hypoxia), brick red (sepsis), yellow (icterus) |
| **CRT** | 1-2 sec | < 1 (hyperdynamic), > 2 (poor perfusion) |
| **Heart rate** | giant 60-100, med 70-160, small 100-180, cat/puppy 180-240 | tachycardia (compensate) → bradycardia (decompensate) |
| **Pulse quality** | strong | **weak** (severe shock), **bounding** (compensate/sepsis) |
| **Extremity temp** | warm | cold (peripheral vasoconstriction) |

> ⚠️ **Pulse quality ≠ blood pressure** — ต้องวัด BP เสมอ! ความดัน 80/40 = strong pulse แต่ MAP ต่ำ

> 📌 **CRT ที่ inner lip** ดีกว่ากด gum (gingivitis ทำให้ผิดได้)

> 💡 mucous membrane:
> - **Brick red** = sepsis/distributive shock (vasodilation รุนแรง)
> - **Yellow** = icterus → bilirubin sources (pre/hepatic/post)
> - **Cyanosis** = SpO₂ ต่ำ (CHF, airway, pleural disease)

### 🅳 Disability (CNS)
- Level of consciousness (DOSCC scale)
- **Pupil**: anisocoria, PLR
- Posture (head tilt, opisthotonus)
- Tremor / seizure
- Pain response: ⭐ **superficial pain → deep pain** — ไม่ต้องตรวจ deep ถ้ายังมี superficial
- **Modified Glasgow Coma Score (MGCS)** < 8 = poor prognosis

### 🅴 Exposure
- โกนขนเปิดดู — โดยเฉพาะ long-haired
- Crepitus (fracture), wound, abrasion, bruising
- Abdominal palpation — pain, fluid wave, mass
- ⚠️ ขออนุญาตเจ้าของก่อนโกน (drama ได้)

### Telephone Triage Cues (ให้รีบมา)
- Collapse / unconscious / not breathing
- Severe cough
- Seizure / abnormal tremor
- Multiple vomiting
- HR rapid change
- Bleeding from orifice
- Sudden weakness / pallor
- Distended abdomen + can't urinate
- Toxin ingestion (Postnan! เพราะกลิ่นหวาน)
- Severe pain (won't let touch)

---

## Sample Case: น้องเจนนี่ (อ้วก 10 รอบ)
- Mentation: depressed · CRT 2-3 (prolonged) · HR 160 · weak pulse
- → **Hypovolemic shock, decompensating** → unstable, RED 🔴
- **C is the dominant problem**
- Resuscitate: **small volume fluid bolus** + เก็บเลือดส่งตรวจ
- DDx framework: **VITAMIN D** หรือ **DAMNITV** (D-disability, A-anomaly, M-metabolic, N-neoplasia, I-infection/immune, T-trauma/toxin, V-vascular)
- Final Dx: bacterial enteritis with shock → AB + supportive

---

# 🔻 Part 2: Emergency Anesthesia (อ.)

> 🎯 หลักการ: **stabilize ก่อน วางยาทีหลัง** · ถ้าจำเป็นต้องวาง — ใช้ยาที่ minimal cardiovascular impact

### Pre-anesthetic principles
1. **Pre-oxygenate** — ตุน O₂ ก่อน induction (mask/flow-by/collar)
2. **Choose drugs ที่:**
   - Minimal CV depression
   - Reversible ถ้า possible
   - Titratable
3. **Multi-modal + preemptive analgesia** — opioid เป็น first line
4. **Skilled team** — ใส่ tube ไว, IV เก่ง, แก้ไขเฉพาะหน้าเร็ว

### Sedative groups (3 หลัก)
| Group | Examples | Potency | Use in compromised? |
|-------|----------|---------|---------------------|
| **Phenothiazine** | Acepromazine | Medium | ❌ Hypotension risk |
| **Benzodiazepine** | Diazepam, Midazolam | Low (alone) | ✅ **Choice in ER** — minimal CV effect |
| **Alpha-2 agonist** | Dexmedetomidine, Medetomidine | **High** | ❌❌ **Avoid in compromised!** — for HEALTHY only |

> ⭐ **Compromise patient → use Benzo + Opioid combo** (synergy, low CV impact)
> ⭐ **Healthy + heavy sedation → Alpha-2** (Dex alone or +opioid)

### Opioids (3 ตัวในไทย)
**All work on μ-receptor** — different potency + duration only

| Drug | Equipotent dose | Duration |
|------|-----------------|----------|
| **Pethidine** | 5 mg/kg | ~1.5 hr |
| **Morphine** | 0.5 mg/kg | 3-4 hr |
| **Fentanyl** | 5 μg/kg | ~45 min |

> 💡 เลือกตาม duration ที่ต้องการ · fentanyl สั้น → ใช้ CRI ใน OR

### Induction agents (ในไทย)
| Group | Drug | Use case |
|-------|------|----------|
| Barbiturate | Thiopental | rare now |
| **Dissociative** | **Ketamine**, Tiletamine-zolazepam (Zoletil) | ⭐ **ER preferred** — sympathomimetic, modulation analgesia |
| **Other** | **Propofol**, Alfaxalone (recently delisted), Etomidate | Propofol = fast but CV depressant |

> ⭐ **Ketamine ดีใน ER** เพราะ:
> 1. Sympathomimetic → ไม่กด CV เต็มๆ
> 2. NMDA antagonist → analgesia (modulation level)
> ⚠️ **Ketamine ในแมว** — ขับทางไต — ห้ามใน urethral obstruction!

> ⚠️ **Propofol** = fast onset แต่ **กด CV รุนแรง** → ใช้เฉพาะตอนต้องสลบเร็ว (airway emergency)

### Pain management = preemptive + multimodal
- **Transduction** → NSAID (post-op only ถ้า BP ดี)
- **Transmission** → local block, epidural (lidocaine + opioid)
- **Modulation** → opioid, ketamine
- **Perception** → general anesthetic (Iso, Sevoflurane)

### MAC Reduction Technique
- ใช้ Iso น้อยลง → ลด CV depression
- เสริมด้วย **fentanyl CRI** + ketamine CRI ใน maintenance

---

## 🚨 Common ER Scenarios

### 1. GDV (Gastric Dilation-Volvulus)
- **Hypovolemic shock** → fluid bolus first
- May need **gastric trocarization** (ลด pressure ก่อนผ่า)
- **Pre-med**: Opioid + Benzo (avoid Acepromazine — vasodilator)
- **Induction**: **Ketamine + Benzo** (preferred) or Fentanyl + Midazolam ± Ketamine
- **Monitor for arrhythmia** — common from acidosis/electrolyte/shock — keep lidocaine ready

### 2. Urethral Obstruction (Cat) ⭐⭐⭐
- **Hyperkalemia = #1 killer** — toxic to heart!
- Lower K+ < 7.5 mmol/L **before anesthesia**
  - **Glucose ± insulin** → drive K+ into cells (temporary)
  - **Ca gluconate** → cardioprotect
  - IV fluid → dilute
  - Bicarb if acidotic
- ⚠️ **Avoid ketamine in cat** (renal excretion — kidney already compromised)
- Pre-med: opioid + benzo · Induction: low-dose propofol
- Decompress bladder → manage urethra

### 3. Dystocia
- Pregnant animals = ↑ progesterone → **inherent sedation** → ต้องการยาน้อยลง
- **Big abdomen → ↓ FRC + reflux risk** → secure airway fast (RSI)
- Stay in **lateral recumbency** as long as possible (don't lie supine until cut)
- Prep + clip BEFORE induction — surgeon ready in scrubs
- **Avoid alpha-2** (CV depression for fetus + mom)
- **Alfaxalone** structurally similar to progesterone — natural choice

### 4. Ocular trauma (Proptosis)
- Brachycephalic eye-pop
- ⚠️ **Oculocardiac reflex** = parasympathetic via CN V → CN X → bradycardia
- ถ้า HR < expected (อายุ/พันธุ์) → **add atropine** ใน combo
- ถ้า HR ปกติ → keep atropine in reserve
- Brachycephalic = high vagal tone บ้านเดิม → tend to bradycardia
- **Lower CO₂ (low-normal)** ถ้ากังวล head trauma — ลด ICP

### 5. Hemoabdomen (เลือดตกในช่อง)
- Most common: **splenic mass rupture** in old large breed (Golden, GSD)
- Hypovolemic shock — wax/wane ก่อน rapid deterioration
- Ix: PCV + TP + ultrasound + abdominocentesis
- **Resuscitate first** — fluid bolus, prepare blood
- **Crystalloid → colloid → blood** (best to last)
- ⚠️ ⊘ ใช้ crystalloid เยอะใน old + heart disease (volume overload)
- Cross-match ก่อน transfuse

### 6. Pneumothorax / Pleural disease
- **Open mouth breathing in cat** = critical sign
- Tap chest BEFORE induction
- **Pre-oxygenate** + control ventilation immediately

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Triage
1. **A B C D E** primary survey order
2. **Stridor** (high) vs **Stertor** (low) — anatomic location
3. **Paradoxical breathing** = diaphragm fatigue/pleural disease
4. **6 perfusion parameters** for circulation (mentation, mm, CRT, HR, pulse, temp)
5. **Brick red mm** = sepsis · **yellow** = icterus · **cyanotic** = hypoxia
6. **Stress leukogram absent + ill** = think Addison
7. **Pulse quality ≠ BP** — must measure BP
8. **Triage colors**: red (immediate) / yellow (within 1 hr) / green (stable)
9. **DAMNITV** for DDx framework
10. **MGCS < 8** = poor prognosis

### Emergency Anesthesia
1. **Avoid alpha-2 in compromised** patients (Dex/Medetomidine)
2. **Benzo + opioid** = ER preferred combo
3. **Ketamine in ER** — sympathomimetic + analgesia · BUT avoid in cat with renal/urinary disease
4. **Propofol** = fast but cardiovascular depressant
5. **Pregnant** = ↓ MAC needed (progesterone effect)
6. **Cat urethral obstruction** — must reduce **K+ < 7.5** before GA
7. **HyperK ECG**: bradycardia, peaked T, lost P, wide QRS
8. **Glucose + insulin** drives K into cells (temporary)
9. **Proptosis** → oculocardiac reflex → atropine if HR low
10. **GDV** = fluid resuscitate, decompression, watch for arrhythmia
11. **Hemoabdomen** = splenic mass in old large dog · Resuscitate before surgery
12. **Opioid equipotent**: Morphine 0.5 = Pethidine 5 = Fentanyl 0.005 mg/kg
13. **Preemptive + multimodal** analgesia principles

---

> 💡 **อ.: "ไม่มียาที่ perfect — ทุกตัวมีจุดอ่อน · เลือก individual ตาม situation · ใช้ลด dose ลงให้ต่ำสุด"**
> 💡 **อ.รัสมา: "Triage จะดีต้องประเมิน ABCDE ครบ — อย่าใช้สายตาอย่างเดียวตัดสิน"**`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Ocular examination
  // ─────────────────────────────────────────────────────────────
  '-9iGaiDgagI': {
    videoId: '-9iGaiDgagI',
    title: '1.1 Ocular examination',
    subject: 'com3',
    date: '8 Jan 69',
    durationMin: 67,
    instructor: 'อาจารย์ Ophtho (Med III)',
    examFormat: 'MCQ — anatomy + test names ออก STT/IOP/PLR ทุกปี',
    summary: `# Ocular Examination

> 👁️ ชั่วโมงเปิด ophthalmology — anatomy + diagnostic tools
> 🩺 จักษุแพทย์ใช้เวลา 11-12 ปีเรียน (6+5-6) — งานจริงไม่ง่ายแต่เข้าใจได้

---

## 🔍 Eye Anatomy ⭐⭐

### Front view
| ส่วน | คำศัพท์ |
|------|---------|
| ตาดำใส | **Cornea** (กระจกตา) |
| ม่านตา (สี) | **Iris** |
| ตาขาว | **Sclera** |
| เปลือกตาบน/ล่าง | Upper/Lower lid |
| **หนังตาที่ 3** ⭐ | **Third eyelid (nictitating membrane)** — ปกป้อง + เกลี่ยน้ำตา |
| หัวตา (มี puncta) | Nasal canthus |
| หางตา | Lateral canthus |

> 💡 **Identify ตาขวา/ซ้ายจาก nasal canthus** — ด้านที่มี punctum lacrimale = nasal

### Cross-section (deep anatomy)
- **Anterior chamber** (ระหว่าง cornea + iris) — มี aqueous humor
- **Iridocorneal angle** ⭐ — drainage of aqueous → ถ้าอุดตัน → **glaucoma**
- **Lens** — แบ่ง front/back, รวมแสง, ยึดด้วย **zonules** กับ ciliary body
- **Ciliary body** — สร้าง aqueous humor
- **Vitreous chamber** (ใหญ่สุด ~90%) — **vitreous humor** (เนื้อวุ้น คล้าย "ปีโป้")
- **Retina** → **Optic disc** → **Optic nerve (CN II)** → brain
- **Choroid** — vascular layer (oxygen + nutrients)
- **Tapetum** ⭐ — reflective layer (NIGHT VISION! — สาเหตุที่ตาแมวเรืองแสงตอนปิดไฟ)

### Uvea (vascular layer)
- Anterior uvea: iris + ciliary body
- Posterior uvea: choroid

### Ocular Adnexa (โครงสร้างนอกลูกตา)
- 2 eyelids + 3rd eyelid + conjunctiva + nasolacrimal apparatus
- 7 extraocular muscles (4 rectus + 2 oblique + 1 retractor)

### Heterochromia
- Iris สีต่างกัน 2 ข้าง = **normal anatomical variation** (ไม่ใช่โรค)
- Albinotic fundus → เห็นสีแดงด้านหลัง (ในแมวขาว) — normal

## 📋 Diagnostic Tools (10 ตัว) ⭐⭐⭐

| # | Tool | Use |
|---|------|-----|
| 1 | **ห้องเปิด/ปิดไฟได้** | ตรวจทั้งสว่าง + มืด |
| 2 | **Finoff Transilluminator** | high-intensity focal light |
| 3 | **STT** (Schirmer Tear Test) | กระดาษวัดน้ำตา |
| 4 | **Fluorescein stain** | ย้อมหา corneal ulcer |
| 5 | **Tonometer** | วัด IOP |
| 6 | Magnifying lens | ขยายดู detail |
| 7 | **Tropicamide** | ขยายม่านตา (mydriatic) |
| 8 | **Tetracaine** (ยาชาหยอด) | สำหรับ painful eye |
| 9 | **Eye wash** | ล้างตา (ไม่ใช่ saline ปกติ — pH ใกล้น้ำตา) |
| 10 | Sterile cotton swab + small forceps | culture/manipulate |

## 🎯 Standard Tests ⭐⭐⭐

### **Schirmer Tear Test (STT)**
- กระดาษเสียบใต้เปลือกตาล่าง 1 นาที
- Normal dog: **15-18 mm/min** · cat: also ~15
- **< 15** = early dry eye (KCS)
- **< 10** = moderate dry eye
- **< 5** = severe dry eye

### **IOP (Intraocular Pressure)**
- TonoVet/TonoPen — ยิง probe กระทบ cornea
- Normal **< 20 mmHg**
- **> 25 = glaucoma** (ต้อหิน)
- **< 10 = uveitis** (ช่องหน้าม่านตาอักเสบ)
- ⚠️ Cat may transiently spike to 28-30 from stress — interpret with clinical signs

### **Neuro-ophthalmic Exam** (CN II-VII)
- ⭐ ทุก test = stimulus + response
| Test | Stimulus | Afferent | Efferent |
|------|----------|----------|----------|
| **PLR** (Pupillary Light Reflex) | bright light | CN II | CN III (sphincter constrict) |
| **Menace response** | hand motion → eye | CN II | CN VII (blink) |
| **Dazzle reflex** | very bright focal light | CN II | CN VII |
| **Palpebral reflex** | tap eyelid | CN V | CN VII (blink) |
| **Doll's eye** | head turn | CN VIII | CN III, IV, VI |

### **Fluorescein Staining** ⭐
- หยดสีส้ม → ถ้ามี **corneal ulcer** → สีไปจับ epithelium ที่หายไป
- ใช้ **cobalt blue light** ในห้องมืด → เห็นเป็น **สีเขียวเรืองแสง**
- **Jones test** — ถ้าผ่าน nasolacrimal duct → เห็นสีออกที่จมูก
- **Seidel test** — หยดสีหา corneal perforation (เห็นสีไหลฟุ้ง)

### **Rose Bengal** (deprecated)
- ย้อม dead epithelial cells (ตาแห้ง)
- ⚠️ Toxic ถ้า dilute ผิด → แทนด้วยสีปลอดภัยกว่า

### Additional Tests
- **Bacterial culture** (refractory cases)
- **Imaging**: Xray, CT, MRI, US
- **Gonioscopy** — ส่องมุม iridocorneal angle
- **ERG** (Electroretinogram) — เช็คการทำงาน retina (เหมือน ECG)
- **OCT** (Optical Coherence Tomography) — Chula = เครื่องเดียวใน SE Asia!

---

## 📝 Exam Hot Spots
1. **STT < 15** = dry eye threshold
2. **IOP > 25** = glaucoma · **< 10** = uveitis
3. **PLR**: afferent CN II, efferent CN III
4. **Menace**: CN II → CN VII
5. **Fluorescein** = need cobalt blue + dark room
6. **Tapetum** = night vision reflective layer
7. **Iridocorneal angle** = aqueous drainage site
8. **Heterochromia** = normal variation (white cats often!)
9. Identify R vs L by **nasal canthus** + punctum
10. STT abbreviation = **Schirmer Tear Test** (เขียน full name ตอนสอบ)
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Ophthalmic medication
  // ─────────────────────────────────────────────────────────────
  QOfXfxJqyzU: {
    videoId: 'QOfXfxJqyzU',
    title: '1.2 Ophthalmic medication',
    subject: 'com3',
    date: '8 Jan 69',
    durationMin: 43,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — drug class + route + dose form choice',
    summary: `# Ophthalmic Medication

> 💊 หลังจากตรวจตาเสร็จ → เลือกยา · ผ่านได้ 2 ทาง: corneal absorption + non-corneal (conjunctival)

---

## 🚪 Drug Penetration Routes

### Corneal absorption
| Layer | Property needed |
|-------|-----------------|
| **Epithelium** (lipid bilayer) | **Lipid-soluble** drug |
| **Stroma** (99% of cornea, collagen) | **Polar / water-soluble** |
| Endothelium | mixed |

> 💡 **Drug ที่ดี** = bi-philic (ทั้ง lipid + water soluble) → ผ่านทั้ง 3 ชั้น

### Non-corneal (conjunctiva)
- Lipid-soluble drugs ผ่าน conjunctival epithelium

## 🛡️ Ocular Drug Barriers
- **Dynamic barrier** = น้ำตาไหล + กระพริบตา + blood flow → ล้างยาออก
  - แก้ไข: **เพิ่มความถี่หยอด**
- **Static barrier** = anatomical (cornea, blood-aqueous barrier)
  - Inflammation → barrier broken → ยาเข้าได้ดีขึ้น

## 🔄 Drug Elimination
- Anterior: aqueous humor flow → drains via iridocorneal angle
- Posterior: vitreous → choroidal blood vessels (diffusion only, vitreous doesn't flow)

---

## 💉 4 Routes of Administration ⭐⭐⭐

### 1. Topical (ยาหยอด/ป้าย)
**Eye drops vs Ointment**
| Form | Pros | Cons |
|------|------|------|
| **Drops (น้ำใส)** | ง่าย, ไม่บังตา | washed out fast (q4h-q1h) |
| **Ointment (ครีม)** | longer contact (q12h), moisturizer | hard to apply, blurs vision, ⊘ severe dry eye, ⊘ corneal ulcer (delays healing), contamination risk |

> ⚠️ **Tetracycline ointment** — แสบ ตาเบลอ → ห้ามขับรถหลังป้าย!

### 2. Subconjunctival Injection
- 0.1-0.2 mL ใต้ conjunctiva
- Anti-inflammatory + antibiotic mainly
- **Slow release** depot (Dex SC = 2 days vs drops BID)
- ⚠️ Need: skill, sedation/topical anesthesia, sterile technique
- ⚠️ Drug also enters systemic — count toward total dose

### 3. Intracameral (anterior chamber) / Intravitreal
- Direct injection — for severe disease
- ⚠️ **Currently not done in clinic** (high complication: blindness from bleeding)

### 4. Systemic (PO/IV)
- ใช้สำหรับ posterior segment (vitreous, retina) — topical reaches poorly
- ⚠️ slow onset (PK delay)

## 🎯 Drug-Target Mapping
| Target | Best route |
|--------|-----------|
| **Cornea, conjunctiva** | Topical |
| **Anterior chamber** | Topical (ยาที่ผ่าน cornea ได้) + subconjunctival |
| **Posterior chamber, retina** | **Systemic** (oral/IV) |
| Eyelids | Systemic |

---

## 💊 Drug Classes ⭐⭐

### Antibiotics
- ⭐ **Most ocular surface infections = gram-positive cocci**
- Use **lower-generation first** (avoid resistance from fluoroquinolones)
- 1st-line: gentamicin, tobramycin, chloramphenicol
- Refractory: 3-week trial → then **culture + sensitivity** + higher gen

### Antivirals (cat — herpes virus 1)
- Classic: facial ulcer + URI signs (sneeze, mucopurulent)
- Dx: PCR swab
- ⭐ **Famciclovir 90 mg/kg PO TID × 3 weeks** (oral works better than topical!)

### Antifungals
- Azoles (oral) — for severe keratitis
- Topical antifungals less effective

### Anti-inflammatory ⭐⭐
**Steroid:**
| Drug | Penetration | Note |
|------|------------|------|
| **Prednisolone acetate** ⭐ | passes cornea → anterior chamber | ⭐ Best for anterior uveitis |
| **Dexamethasone (alcohol)** | NOT through cornea | surface only |
| Dexamethasone phosphate | NOT through cornea | surface only |

> 💡 **Acetate** salt = lipid-soluble = penetrates cornea
> 💡 **Phosphate** salt = water-soluble = surface only

**NSAID:**
- **Ketorolac, Nepafenac, Diclofenac** — all penetrate cornea to anterior chamber
- ⊘ Don't reach posterior segment → use systemic NSAID for retina/vitreous

### Mydriatics (ขยายม่านตา)
| Drug | Action | Onset | Duration |
|------|--------|-------|----------|
| **Tropicamide** ⭐ | tricyclic anticholinergic | minutes | 3-4 hr |
| **Atropine** | anticholinergic, **cycloplegic** | 1 day | up to **96 hr** |

> ⚠️ **Atropine ≠ for exam** — too long-lasting · use for **uveitis** (ลด ciliary spasm pain)

### Glaucoma drugs (4 classes)

**Decrease aqueous production:**
- **Beta-blocker** (timolol)
- **Carbonic Anhydrase Inhibitor** (dorzolamide)
- 💡 **Fixed combination** (timolol + dorzolamide) → 4 drops/day instead of 8

**Increase aqueous outflow:**
- **Prostaglandin analog** (latanoprost) — mimics inflammation, opens drainage angle
- **Alpha-2 adrenergic agonist** (brimonidine)

### Tear Replacement (น้ำตาเทียม)
- 3 layers in tear film: lipid + aqueous + mucin
- Choose product matching deficient layer
- For chronic dry eye

### Immunosuppressive (eye drops!)
- **Cyclosporine, Tacrolimus** topical
- 70% canine KCS = T-cell mediated (autoimmune lacrimal gland) → these drugs reverse it
- Surface only, no systemic effect
- ⚠️ 10+ years continuous use → fungal infection risk

### Topical anesthetic
- **Tetracaine 0.5%** (yellow cap)
- For exam comfort + minor procedures
- SE: conjunctival redness/edema (transient, harmless)

---

## 📝 Exam Hot Spots
1. **Cornea = bi-philic drug needed** (lipid + water soluble)
2. **Pred acetate** crosses cornea, **Dex** does not
3. **Phosphate vs Acetate** salt = surface vs penetration
4. **Atropine vs Tropicamide**: 96 hr vs 3-4 hr
5. **Atropine for uveitis** (ciliary spasm pain) — NOT for exam
6. **Cat herpes**: Famciclovir 90 mg/kg PO TID × 3 wk (oral > topical)
7. **Glaucoma 4 drug classes**: BB, CAI, PG analog, α2 agonist
8. **Topical CSA/tacrolimus** for KCS — 70% T-cell mediated
9. **Subconjunctival** injection — need skill, sterile, count systemic dose
10. **Posterior segment** = systemic route
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Ophthalmic surgery
  // ─────────────────────────────────────────────────────────────
  yacB9zJJpTA: {
    videoId: 'yacB9zJJpTA',
    title: '2.1 Ophthalmic surgery',
    subject: 'com3',
    date: '15 Jan 69',
    durationMin: 53,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — surgery type + instrument selection',
    summary: `# Ophthalmic Surgery

> 🔪 ภาพรวมศัลยกรรมตา — ลูกตา = 3D, "what you see ≠ all there is"
> ⭐ Pain management + คุมสัตว์ให้นิ่ง = critical (ตาขยับนิดเดียว = ทำงานไม่ได้)

## 5 Considerations Before Surgery
1. **Skill** — ต้องฝึก, ไม่ใช่ one-man job (need anesthesiologist + skilled nurses)
2. **Patient prep** — systemic disease workup
3. **Method choice** — 3 surgical zones
4. **Aseptic technique** + magnification (loupe/microscope)
5. **Owner cooperation** — POI Treatment compliance

## 3 Surgical Zones ⭐⭐
| Zone | What | Difficulty | Tools |
|------|------|------------|-------|
| **Extra-ocular** | eyelid, conjunctiva, 3rd eyelid, sclera | Easy | regular instruments OK |
| **Intra-ocular** ⭐ | lens (cataract), iris, anterior chamber | **Hardest** | micro-instruments only — closed system → infection risk! |
| **Retro-bulbar / Orbital** | mass behind eye, eye removal | Medium | imaging dx required (CT/MRI) |

## Common Surgical Procedures

### Extra-ocular
- **Entropion repair** (eyelid roll-in) — Hotz-Celsus technique
- **Dermoid removal** — abnormal skin/hair on eye
- 3rd eyelid Cherry eye repositioning

### Intra-ocular
- **Cataract surgery** (phacoemulsification) — lens replacement
- **Lens luxation repair**
- ⚠️ Open system → high infection risk → strict sterile + ultra-fine instruments

### Orbital
- **Enucleation** (entire eye removal)
- **Evisceration** (keep cornea/sclera, replace inside with prosthetic ball — looks like real eye)
- ⚠️ Pulling too hard during one-eye removal → can blind the OTHER eye via optic nerve traction (chiasm)

## Ophthalmic Instruments ⭐⭐ (different from general surgery!)

### Forceps
| Type | Use |
|------|-----|
| **Tissue forceps** (with teeth) | grip skin/sclera |
| **Cornea forceps** (atraumatic) | DO NOT swap with eyelid forceps! ruins delicate cornea |
| **Iris forceps** | grip iris specifically |
| **Conjunctival forceps** | for conjunctiva |
| **Fixation forceps** | hold eyelid open, prevent rotation under GA |

> ⚠️ **Forceps for cornea ≠ forceps for eyelid!** Wrong choice = damaged cornea

### Other tools
- **Iris/conjunctival/cornea scissors** — different curves for L/R sides
- **Needle holder ophthalmic** — uses **finger pinch** (no thumb-ring), no lock (prevents jerk damage)
- **Eyelid speculum** (retractor) — keeps eye open during surgery
- ⚠️ Drop = lost forever (always lands point-first!)

### Suture sizes ⭐
- Skin general surgery: 2-0 or 3-0
- Eyelid: **5-0 or 6-0**
- **Cornea: 8-0, 9-0, or 10-0** ⭐ (VERY tiny — ~size of human hair)
- 11-0 exists but rarely used

## Surgeon Personality (per อ.)
1. **Detail-oriented** (ละเอียด)
2. **Patient** (ใจเย็น)
3. **Precise** (แม่นยำ)
4. **Systematic preparation** lover
- Ability to use **both hands** equally — 2-handed skills
- Hand-eye **coordination** (look in microscope, work below)
- **Communication skills** (delicate work, sensitive owners)
- Physical stamina (long surgeries, no pee breaks!)

## 📝 Exam Hot Spots
1. **3 zones**: extra/intra/retro-bulbar
2. **Intra-ocular = hardest** (closed system, infection risk)
3. **Cornea suture 8-0 to 10-0** — tiny needle, special holder
4. **Cornea forceps ≠ Eyelid forceps**
5. ⚠️ Heavy traction during eye removal → can blind other eye
6. Pre-op: pain control + nil per os + assess systemic
7. Eyelid eversion repair = Hotz-Celsus
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Ocular adnexa
  // ─────────────────────────────────────────────────────────────
  z5Y7FLlthJY: {
    videoId: 'z5Y7FLlthJY',
    title: '2.2 Ocular adnexa',
    subject: 'com3',
    date: '15 Jan 69',
    durationMin: 78,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — diseases of eyelid/conjunctiva/3rd eyelid + treatment',
    summary: `# Ocular Adnexa Diseases

> 👁️‍🗨️ Adnexa = 4 parts: **Eyelids + Conjunctiva + 3rd eyelid + Lacrimal apparatus**

---

## 1️⃣ Eyelid Disorders

### Structural (congenital)
- **Eyelid agenesis (coloboma)** — missing portion of lid (often **lateral upper, in cats**, esp. Maine Coon)
  - Tx: lip-to-lid graft, conjunctival flap, or **buccal mucosa graft**

### Palpebral fissure size
- **Microphthalmia** = small fissure → Shar-Pei, Chow-Chow, Bull Terrier — usually no Tx needed
- **Macroblepharon** = large fissure → brachycephalics → exposure keratitis → may need wedge resection

### Entropion (หนังตาม้วนเข้า) ⭐⭐
3 types:
| Type | Cause | Tx |
|------|-------|-----|
| **Anatomic** | congenital (Maine Coon, brachycephalic) | **Modified Hotz-Celsus** at >1 yr |
| **Spastic** | secondary to corneal pain | treat underlying pain |
| **Cicatricial** | scar tissue from prior trauma/surgery | difficult to fix |

> 💡 Test: **topical anesthesia** → if entropion resolves, it's spastic (not anatomic)

**Hotz-Celsus**: pre-anesthetic measure roll, crescent skin excision, suture skin → flattens lid

### Ectropion (หนังตาม้วนออก) — large breeds (Bloodhound, Saint Bernard)
- V-Y plasty technique → reduces palpebral fissure

### Diamond Eye (Shar-Pei, Chow, Great Dane)
- Combined entropion + ectropion → "diamond" shape
- Combined repair: H-plasty for ectropion + Hotz-Celsus for entropion

### Eyelash disorders ⭐⭐
| Type | Origin | Direction | Tx |
|------|--------|-----------|-----|
| **Distichiasis** ⭐ | Meibomian gland | TOWARD cornea | epilation, cryoepilation |
| **Districhiasis** | one follicle, multiple lashes | TOWARD cornea | same |
| **Ectopic cilia** ⭐ | palpebral conjunctiva | piercing into cornea | wedge resection / cryosurgery |
| **Trichiasis** ⭐ | normal eyelash | abnormal direction toward cornea | EPILATE only — DO NOT cut (creates sharp stub!) |

### Eyelid inflammation
- **Hordeolum** = stye, infected sebaceous/Meibomian gland → AB + warm compress
- **Meibomianitis** = duct obstruction → "creamy plug" at orifice → AB + warm compress
- **Chalazion** = chronic Meibomian → may need 18-G needle drainage
- **Blepharitis** (eyelid skin) — often immune-mediated in cats; check skin disease

### Eyelid trauma / laceration
- Vertical: **figure-of-eight suture** at margin (aligns lid edges)
- Horizontal: simple interrupted suture

### Tumors
- **Dog: usually benign** (Meibomian adenoma, sebaceous adenoma) — wedge resection if < 1/3 lid
- If > 1/3 lid: H-plasty reconstruction
- **Cat: more often malignant** (SCC) — wider margins needed (3 mm)

---

## 2️⃣ Conjunctival Disorders

### Anatomy
- **Palpebral conjunctiva** (inside eyelid)
- **Bulbar conjunctiva** (covers white of eye)
- **Fornix** (curved junction)
- **Limbus** (corneal-conjunctival junction)

### Disease signs (4 types)
1. **Hyperemia** — red, dilated vessels
2. **Chemosis** — edema, swelling
3. **Hemorrhage** — vessel rupture, ecchymosis
4. **Follicular conjunctivitis** — lymphoid inflammation (esp. 3rd eyelid)

### Causes
- Congenital: dermoid (esp. French Bulldog) — surgical removal
- Bacterial (puppy/kitten neonatal — vaginal contamination)
- **Cat conjunctivitis** ⭐ — usually viral:
  - **FHV-1** (Herpes) — dendritic ulcer + URI signs
  - **Calicivirus**
  - **Chlamydia** — chemosis prominent
- Tumors (rare): SCC, hemangiosarcoma

---

## 3️⃣ Third Eyelid (Nictitating Membrane)

- T-shaped cartilage + nictitans gland (produces 30% of tear)

### Disorders
- **Protrusion** (prolapse 3rd eyelid)
  - Bilateral → systemic illness, shock, dehydration
  - Unilateral → **Horner's syndrome** (cats often from inner ear infection)
  - Unilateral + retro-bulbar mass → workup needed

- **Cherry Eye** ⭐ — gland of 3rd eyelid prolapse
  - Beagle, English Bulldog, Boston Terrier, Cocker Spaniel
  - Tx: **Pocket technique** (preferred) — anchor gland back, preserve tear production
  - ⚠️ DO NOT excise — causes lifetime KCS (dry eye)

- **Inverted/Everted T-cartilage** — surgical removal of bent portion only

- **Follicular conjunctivitis** of 3rd eyelid → AB + scrap with scalpel back

---

## 4️⃣ Lacrimal Apparatus

### Tear production glands
- **Lacrimal gland** (dorsal-lateral) — main aqueous
- **Nictitans gland** (3rd eyelid) — 30% aqueous
- **Meibomian glands** — lipid layer

### Tear film 3 layers ⭐
1. **Lipid** (outer) — Meibomian, prevents evaporation
2. **Aqueous** (middle) — lacrimal + nictitans
3. **Mucin** (inner) — conjunctival goblet cells, adheres tear to cornea

### Drainage
- Puncta (upper + lower) → canaliculi → lacrimal sac → **nasolacrimal duct** → nose
- Some flows to pharynx → "salty taste" when crying

### Disorders
- **Hyposecretion** = KCS (dry eye) — most often immune-mediated lacrimal gland
- **Obstructed drainage** → epiphora (tear staining on face) → flush with cannula

## 📝 Exam Hot Spots
1. **Entropion 3 types**: anatomic / spastic / cicatricial — topical anesthesia distinguishes
2. **Hotz-Celsus** = entropion repair
3. **Distichiasis** = Meibomian, **Ectopic cilia** = palpebral conjunctiva
4. ⚠️ **Trichiasis** = epilate, NEVER cut
5. **Cherry Eye Tx**: pocket technique (preserve gland)
6. **Cat conjunctivitis** mostly viral (Herpes, Cali, Chlamydia)
7. **Follicular conjunctivitis 3rd eyelid** = lymphoid hyperplasia
8. **3rd eyelid** = T-cartilage + gland (30% tears)
9. **Tumor**: dog usually benign, **cat often malignant**
10. **Tear film 3 layers**: lipid/aqueous/mucin
11. **Bilateral 3rd eyelid protrusion** → systemic illness check
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Diseases of the cornea
  // ─────────────────────────────────────────────────────────────
  '74q8uuQdK14': {
    videoId: '74q8uuQdK14',
    title: '3. Diseases of the cornea',
    subject: 'com3',
    date: '22 Jan 69',
    durationMin: 119,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — cornea characteristics + ulcer depth + treatment choice',
    summary: `# Diseases of the Cornea

> 🔍 Cornea = 3 properties needed: **Clear + Curved + Smooth (CCS)**
> Loss of any → poor vision/refraction

---

## Cornea Layers (4-5 layers)
| Layer | Notes |
|-------|-------|
| **Epithelium** | regenerates fast, lipophilic barrier |
| **Basement membrane** | thin, between epi and stroma |
| **Stroma** | 90% thickness, collagen fibers (parallel = clear!) |
| **Descemet's membrane** | rare layer, secreted by endothelium |
| **Endothelium** | single cell layer, **Na/K pump** prevents corneal edema |

> 💡 Cornea has **NO blood vessels** but does have **abundant nerves** (CN V trigeminal) — very painful!

---

## When Cornea Loses "Clear" — Color Changes

### Red — Blood Vessels
- **Long, branching** = SUPERFICIAL lesion (from limbus)
- **Brush border, short** ⭐ = DEEP lesion (from sclera, deeper plexus)
- 💡 Vessels start at ~3-5 days (not "yesterday"!)

### Color/Opacity
- **Cornea edema** ⭐ — light blue when epithelium fails (mild), dark blue when endothelium fails (severe)
- **Corneal scar** = white (collagen disorder, post-trauma)
- **Pigmentary keratitis** ⭐ — chronic irritation (Pug! brachycephalic) → pigment migrates from limbus
- **Calcium/lipid deposit (degeneration)** — sparkly metallic white
- **Corneal infiltrate** — endothelial deposit (KP keratic precipitates) → **uveitis sign!**

## When Cornea Loses "Curved" — Shape

- **Microcornea** — small (congenital or post-trauma)
- **Megalocornea** — enlarged (acquired, often glaucoma)

## When Cornea Loses "Smooth" — Surface

### Excessive structures
- **PPM** (Persistent Pupillary Membrane) — strands from iris attach to **endothelium**
- **Dermoid** — skin/hair growing on cornea (always grows toward eye!) → keratectomy

### Depth abnormality
- **Erosion** — only epithelium lost (Fluorescein NEGATIVE if basement membrane intact)
- **Ulcer** ⭐ — exposes stroma (Fluorescein POSITIVE)
- **Descemetocele** — only Descemet's + endothelium left (1-2 cell layers!)
- **Perforation** — full-thickness; if iris bulges through = **anterior staphyloma**

---

## Major Diseases

### Keratitis without ulcer (non-ulcerative)
- **Chronic Superficial Keratitis (CSK / Pannus)** — German Shepherd Dog, UV exposure
  - Pink raised tissue + vessels — immune-mediated
  - Tx: topical steroid, cyclosporine, UV protection (shading)
  - Ensure no ulcer first (Fluorescein-negative) before steroid!

- **KCS / Dry Eye** ⭐⭐ (Sicca conjunctivitis)
  - STT < 15 mm/min → suspect; < 10 = moderate; < 5 = severe
  - **70% canine = T-cell immune-mediated** lacrimal damage
  - Brachycephalic predisposed (Bulldog, Pug, Pekingese)
  - Tx: tear replacement + **topical cyclosporine** or tacrolimus (immunosuppressive)

- **Pigmentary Keratitis** — chronic UV/inflammation/dry eye → migrating melanin
  - Tx: address underlying + topical CSA + considered keratectomy (rare)

- **Deep Keratitis (Blue Eye)** ⭐ — endotheliitis
  - Cornea blue from severe edema
  - Workup for systemic disease (Ehrlichia, blood parasites, immune)
  - No ulcer, no eyelash issues — purely from inside

- **Corneal Degeneration vs Dystrophy** ⭐
  - **Degeneration**: secondary to inflammation/metabolic disorder, deposits Ca or cholesterol
  - **Dystrophy**: hereditary (Husky → endothelial dystrophy → chronic edema), no inflammation, sparkly white

### Ulcerative Keratitis (with ulcer)
> ⚠️ Ulcer = always inflammation present; rule out: lid disease, lash disease, KCS, FB, lagophthalmos

### Healing of cornea
- **Epithelium** regenerates fast (24-48 hr if clean)
- **Stroma** repair: chemotaxis → fibroblasts → fibrosis (= scar)

### Specific ulcers

**1. Refractory ulcer / SCCED / Indolent ulcer** ⭐⭐
- Epithelium NOT adhering to basement membrane → won't heal > 7 days
- Boxer classically
- Tx: **debridement** (dry Q-tip + scalpel) → if fail → **diamond burr** or **grid keratotomy** (PUNCTATE keratotomy)
- ⚠️ Don't drop in steroids!

**2. Stromal ulcer (deep)**
- High risk of progression, "melting cornea"
- Risk: bacterial collagenase / proteinase digesting cornea
- Tx: AB + **anti-collagenase** (EDTA, tetracycline, autologous serum, doxycycline)
- + Mydriatic (atropine) for ciliary spasm pain
- No steroid!

**3. Descemetocele / Perforation**
- Suture cornea (8-0 to 10-0, 80-90% depth, simple interrupted)
- **Conjunctival pedicle graft** for medium ulcer (preserved blood supply)
- **Biological grafts** (porcine SIS, amnion) for deep
- 3rd eyelid flap or conjunctival flap as adjunct

### Special — Cat
- **Feline Herpes Virus (FHV-1)**
  - **Dendritic ulcer** ⭐ (branched pattern with Rose Bengal stain) — pathognomonic!
  - Tx: **Famciclovir 90 mg/kg PO TID × 3 wk**
- **Eosinophilic Keratitis** — pink raised lesion, plaque-like
  - 70% associated with FHV-1
  - Tx: topical steroid (with caution due to virus) + AntiHHV
- **Corneal Sequestrum** ⭐ — black/brown plaque, 55% FHV-related
  - Cat brown tear film
  - Tx: surgical keratectomy

### Tumors of cornea (rare)
- **SCC** — rule out + keratectomy
- **Hemangioma/sarcoma** — surgical, watch for recurrence

## 📝 Exam Hot Spots
1. **Cornea** = clear + curved + smooth + sensitive (NO vessels)
2. **Vessels**: long+branching = superficial; **brush border = deep**
3. **Edema mild = light blue, severe = dark blue** (endothelium)
4. **Endothelium = single layer + Na/K pump**
5. **Pugs** = pigmentary keratitis classic
6. **PPM** mostly affects **endothelium**
7. **Erosion** (epithelium) vs **Ulcer** (into stroma) vs **Descemetocele** (1-2 layers left)
8. **SCCED/Indolent**: epi-basement detachment → Boxer, debridement + grid keratotomy
9. **Anti-collagenase** for melting cornea (EDTA, doxycycline)
10. **Cornea suture**: 8-0 to 10-0, 80-90% depth, simple interrupted
11. **FHV-1 dendritic ulcer** = pathognomonic; famciclovir PO
12. **Cat sequestrum** = FHV-related (55%)
13. **Degeneration** (secondary, with inflam) vs **Dystrophy** (genetic, no inflam)
14. **Husky** = endothelial dystrophy
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Diseases of the Uvea & Lens
  // ─────────────────────────────────────────────────────────────
  kw5a1xIobXs: {
    videoId: 'kw5a1xIobXs',
    title: '4. Diseases of the Uvea & Lens',
    subject: 'com3',
    date: '29 Jan 69',
    durationMin: 116,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — uveitis signs + cataract stages',
    summary: `# Diseases of the Uvea & Lens

> 👁️‍🗨️ **Uvea** = vascular tract: **Iris + Ciliary body + Choroid**
> Anything affecting uvea → high risk of blindness (mechanism not fully understood)

---

## Anterior Chamber

### Aqueous Humor (AH)
- Produced by **ciliary body**, drained at **iridocorneal angle**
- Functions: maintain shape, nutrition (lens, cornea endothelium), waste removal
- Continuously produced lifelong
- Contains nutrients: glucose, amino acids, proteins, ascorbate

### Anterior chamber abnormalities
| Sign | Cause |
|------|-------|
| **Shallow** | corneal perforation, anterior lens luxation, iris bombé |
| **Deep** | posterior lens luxation, microphakia |
| **Aqueous flare** ⭐ | ↑ protein from broken **Blood-Aqueous Barrier (BAB)** — Tyndall phenomenon (slit lamp) |
| **KP** (Keratic Precipitates) | cells/proteins on endothelium → **uveitis sign** |
| **Hyphema** | blood — trauma OR systemic (clotting disorder, etc.) |
| **Hypopyon** | pus (sepsis, severe ocular infection) |
| **Lipid aqueous** | milky from hyperlipidemia |
| **Iris cyst** | dog: brown ball; cat: dark ovals at iris margin (different shape!) |

> ⚠️ Don't surgically drain aqueous abnormalities — opening eye worsens BAB breakdown!

---

## Iris

### Anatomy
- 1 ring (we have **1 iris per eye**, not 2!)
- Pupillary zone (inner) + Ciliary zone (outer), **collarette** = boundary
- Sphincter + dilator muscles
- Pigmented (sex/age varies)

### Disorders
| Disorder | Description |
|----------|-------------|
| **Heterochromia iridis** | bicolor — normal variation (white cats often) |
| **Polycoria** | multiple pupils |
| **Dyscoria** | misshapen pupil (often from synechia/mass) |
| **Iris hypoplasia** | underdeveloped iris (foal/horse breed defects) |
| **Coloboma** | failed to develop sector — congenital |
| **Iris atrophy** | age-related, increases with chronic uveitis |
| **PPM** | residual fetal vessels — to lens, cornea, opposite side |
| **Iris cyst** | round dark ball, usually benign |

---

## Uveitis ⭐⭐⭐

> ⚠️ **Anterior uveitis = serious** — high risk vision loss

### Classification
- Anterior uveitis = iritis + iridocyclitis
- Posterior uveitis = choroiditis + chorioretinitis
- Panuveitis = entire uveal tract

### Signs
- ↓ IOP (< 10 mmHg)
- Aqueous flare (Tyndall)
- KP (keratic precipitates)
- Miosis (pinpoint pupil)
- Hypopyon, hyphema
- Conjunctival hyperemia
- Pain (blepharospasm, photophobia)
- 360° **anterior synechia** = iris stuck to cornea
- **Posterior synechia** = iris stuck to lens

### Causes
- Trauma (blunt, penetrating)
- Lens-induced (cataract, lens luxation)
- Infectious: **Ehrlichia, Rickettsia, Brucella, Lepto, FIP (cat!), FeLV, FIV, Toxoplasma**
- Immune-mediated: Uveodermatologic syndrome (Akita, Husky, Samoyed) — VKH-like
- Neoplasia (lymphoma, melanoma)

### Treatment
1. **Treat underlying cause**
2. **Topical NSAID** (ketorolac/diclofenac/flurbiprofen) or **steroid** (Pred Acetate — penetrates cornea!) — ⚠️ rule out ulcer first
3. **Mydriatic — Atropine** ⭐ — keep pupil dilated to prevent posterior synechia AND relieve ciliary spasm pain
4. Systemic: NSAID, steroid, AB if needed

> ⚠️ **Atropine** in uveitis: GOOD (cycloplegic relieves pain) — different from regular dx use

### Complications
- Cataract (lens-induced uveitis can cause cataract!)
- Glaucoma (from synechia/inflammation)
- Retinal detachment
- Phthisis bulbi (shrunken eye)

---

## Lens

### Anatomy
- Biconvex, behind iris, suspended by zonules from ciliary body
- Avascular — gets nutrition from aqueous & vitreous
- Capsule (Cs anterior + posterior)
- Cortex + Nucleus

### Lens position abnormalities
| Type | Cause |
|------|-------|
| **Lens luxation (anterior)** ⭐ | zonule breakage — Terriers (genetic!) — emergency, blocks aqueous → glaucoma |
| **Lens luxation (posterior)** | falls into vitreous |
| **Subluxation** | partial zonule breakage |

> ⚠️ Anterior lens luxation = surgical emergency

---

## Cataract ⭐⭐

### Definition
- Opacity of lens, blocks light → vision loss
- Different from **nuclear sclerosis** (age-related, NOT cataract — no vision loss)

### Classification by maturity ⭐
| Stage | Description | Vision |
|-------|-------------|--------|
| **Incipient** | < 15% lens, edge | preserved |
| **Immature** | 15-99%, may obscure tapetal reflex | reduced |
| **Mature** | 100% lens opaque, no tapetum visible | blind to dim, sees light only |
| **Hypermature** | shrinking, wrinkled capsule, may cause uveitis ⭐ | partial may return! |
| **Morgagnian** | nucleus sinks in liquefied cortex | varies |

### Etiology
- **Hereditary** ⭐ — Cocker, Poodle, Boston Terrier, Bichon
- **Diabetes mellitus** ⭐⭐ — most common acquired in dog (sorbitol pathway, often **bilateral, rapid**)
- Age-related, post-uveitis, traumatic, congenital

### Pathophysiology of DM cataract
- ↑ glucose → aldose reductase → sorbitol accumulates in lens → osmotic swelling → opacity

### Diagnosis
- Slit lamp / Direct ophthalmoscope through dilated pupil
- **Ocular ultrasound** if mature/hypermature (lens sinks, cataract pattern)
- ERG before surgery (retinal function check — must be intact!)

### Treatment ⭐
- **Surgery** = **Phacoemulsification + IOL** (intraocular lens) — only treatment!
- Best done at **immature** stage (before hypermature complications)
- Pre-op: rule out retinal detachment + uveitis
- Post-op: anti-inflammatory + AB drops + Atropine

### Hypermature complications
- **Lens-Induced Uveitis (LIU)** — leaking lens proteins → severe uveitis → glaucoma
- ⚠️ Even if no surgery, LIU treatment with steroid + atropine essential

---

## 📝 Exam Hot Spots
1. **Uvea** = iris + ciliary body + choroid (vascular, all blood)
2. **Aqueous flare** = broken **BAB** = uveitis sign (Tyndall)
3. **Uveitis IOP**: **< 10 mmHg** (vs glaucoma > 25)
4. **Atropine** = GOOD for uveitis (cycloplegia + miosis prevention)
5. **PPM** affects mainly **endothelium**
6. **Iris bombé** = synechia → fluid pushed iris forward
7. **Lens luxation anterior** = emergency (blocks aqueous, → glaucoma)
8. **Cataract stages**: incipient/immature/mature/hypermature
9. **DM cataract** = bilateral rapid, sorbitol pathway
10. **Phacoemulsification** = only treatment, do at immature
11. **Hypermature** → **LIU** (Lens-Induced Uveitis)
12. **Nuclear sclerosis** ≠ cataract (no vision loss, age-related)
13. Akita/Husky/Samoyed → **VKH/uveodermatologic syndrome**
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Fundus + Glaucoma
  // ─────────────────────────────────────────────────────────────
  V3cpqbldxro: {
    videoId: 'V3cpqbldxro',
    title: '5. Fundus + Glaucoma',
    subject: 'com3',
    date: '5 Feb 69',
    durationMin: 117,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — fundus interpretation + glaucoma classification',
    summary: `# Fundus + Glaucoma

---

# 🔻 Part 1: Fundus

## Vitreous (Vitreous Humor)
- Largest volume in eye (~90%)
- Gel-like (single mass when removed)
- Functions: maintain shape, support **retina** (prevent detachment), transmit light

### Vitreous abnormalities
- **Persistent Hyaloid Artery** (failed to regress) — visible vessel
- **PHPV** (Persistent Hyperplastic Primary Vitreous) — mass of fibrovascular tissue
- **Asteroid hyalosis** ("stars in the sky") — Ca soap deposits, doesn't impair vision
- **Synchysis scintillans** — cholesterol crystals (post-trauma/inflammation), settle when still
- **Vitreous hemorrhage** — from retina/ciliary body, may indicate systemic disorder

---

## Fundus Anatomy ⭐⭐
> 4 components (inside → outside): **Retina → Choroid → Sclera → + Optic disc**

### Retina (10 layers)
- Photoreceptors: **Rods** (dim/B&W) + **Cones** (color/detail)
- Bipolar cells, ganglion cells
- **Phototransduction**: light → chemical → electrical impulse → optic nerve → LGN → visual cortex

### Choroid
- Vascular layer (oxygen + nutrients)
- Contains **tapetum lucidum** ⭐ — reflective layer for night vision!

### Tapetum vs Non-Tapetum zones
| Zone | Color | Location |
|------|-------|----------|
| **Tapetal** ⭐ | yellow/green/blue/orange (varies) | dorsal half always |
| **Non-tapetal** | dark (pigmented) | ventral |

> 💡 **Dog**: tapetum 2/3 of fundus · **Cat**: 3/4 of fundus

### Optic Disc ⭐
- Origin of optic nerve (CN II)
- **Dog**: triangular shape, has **myelin** → ivory/salmon pink color
- **Cat**: round, **no myelin** → dark, blood vessels at edge only

### Vessels
- **Retinal arterioles** (smaller) — 12-20 strands in dog
- **Retinal venules** (larger) — 3-4 strands, anastomose at optic disc
- **Cat**: 3 main vessel pairs, run together

### Fundus Examination
- Direct ophthalmoscope (small field)
- Indirect ophthalmoscope + 20D lens (wide field)
- **Always dilate** (tropicamide) for full view!

### Common Fundus Abnormalities
- **Retinal detachment** ⭐ — billowing curtain on fundus
- **Hemorrhage** — systemic disorders (hypertension, kidney, IMHA)
- **Optic nerve swelling** (papilledema)
- **Hyperreflectivity** — atrophy of retina (PRA, post-detachment scar)
- **Hyporeflectivity** — covered by edema, hemorrhage, infiltrate

### Loss of Vision (blindness)
- ~50% from eye (retina, optic nerve, lens, cornea)
- ~50% from brain (cortex)
- Always **start with eye exam** before brain workup

---

# 🔻 Part 2: Glaucoma ⭐⭐⭐

## Definition
- ↑ IOP causing damage to **optic nerve + retina** → blindness
- Painful (often)

## Classification (3 ways)

### By onset
- **Acute** — sudden, severe pain, eye usually salvageable
- **Chronic** — gradual, often blind by diagnosis

### By cause
- **Primary** ⭐ — Cocker Spaniel, Bouvier, Beagle, **Shiba** ⭐ (rising in TH)
  - Genetic angle abnormality (goniodysgenesis)
  - **Other eye at risk** — prophylactic Tx!
- **Secondary** — from another disease:
  - Lens luxation (anterior)
  - Uveitis → synechia → block angle
  - Hyphema, intraocular tumor
  - Cataract (LIU)

### By anatomic angle
- **Open-angle** (Goniodysgenesis grade 1-2)
- **Closed-angle** (grade 3-4)
- **Narrow-angle**

## Diagnosis
- **IOP > 25 mmHg** ⭐ (TonoVet/TonoPen)
- **Buphthalmos** (large eye - chronic)
- Corneal edema (Descemet's stretch)
- Mydriasis (fixed pupil)
- **Haab's striae** (Descemet's tear)
- **Optic disc cupping**
- Vision loss

## Treatment ⭐⭐ (4 drug classes — repeated from Eye 1.2)

### Decrease aqueous production
- **Timolol** (β-blocker) — q8-12h
- **Dorzolamide** (CAI) — q8-12h
- 💡 Often **fixed combination** (Timolol+Dorz) → 4 drops/day

### Increase aqueous outflow
- **Latanoprost (Prostaglandin analog)** — q12-24h, very potent
- **Brimonidine (α2 agonist)** — q8-12h

### Surgery (if medical fails)
- **Cyclodialysis** — physically separate ciliary body from sclera
- **Iridectomy** — remove iris portion (especially with iris bombé)
- **Drainage device** (Ahmed valve, Baerveldt)
- **End-stage**: Enucleation (entire eye) or Evisceration (replace inside with prosthetic)

### Emergency reduction (acute)
- **Mannitol IV** 1-2 g/kg over 30 min — osmotic diuretic
- + Topical glaucoma drops

## End-stage Eye Treatment
- **Enucleation** — remove entire eye + suture lid (cosmetic OK with hair)
- **Evisceration** — keep cornea/sclera, replace contents with **prosthetic ball** (looks normal)
- Choose based on: pain control, owner preference, eye condition

---

## 📝 Exam Hot Spots

### Fundus
1. **Vitreous = 90% of eye**, gel-like
2. **Asteroid hyalosis** — Ca, "stars in sky", no vision impact
3. **Synchysis scintillans** — cholesterol, settles when still
4. **Tapetum** = night vision reflective (varies color)
5. **Dog optic disc** = triangular + ivory (myelin) · **Cat** = round dark
6. **Retinal arterioles** 12-20 in dog · 3 main pairs in cat
7. **Retinal detachment** = billowing curtain
8. Hemorrhage on retina → think **systemic hypertension/kidney**
9. **PHPV** — fibrovascular vitreous, congenital

### Glaucoma
1. **IOP > 25 mmHg** = glaucoma threshold
2. **Primary glaucoma**: Cocker, Bouvier, Shiba (TH), Beagle — genetic
3. **Other eye at risk** in primary → prophylactic Tx
4. **Buphthalmos + Haab's striae + cupping** = chronic
5. **4 drug classes**: Timolol, Dorzolamide, Latanoprost, Brimonidine
6. **Mannitol IV** for acute crisis
7. **Anterior lens luxation** = secondary glaucoma
8. **End-stage**: Enucleation or Evisceration
9. **Goniodysgenesis** classification 1-4 (1 = open, 4 = closed)
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Glaucoma (cont) + Orbit + Ear examination
  // ─────────────────────────────────────────────────────────────
  Gmk3Omj81vw: {
    videoId: 'Gmk3Omj81vw',
    title: '6. Glaucoma (ต่อ) + Diseases of orbit + Ear examination',
    subject: 'com3',
    date: '12 Feb 69',
    durationMin: 103,
    instructor: 'อาจารย์ Ophtho',
    examFormat: 'MCQ — glaucoma surgery + orbit signs + ear basics',
    summary: `# Glaucoma (cont) + Orbit + Ear Examination

---

# 🔻 Part 1: Glaucoma Surgery (continued)

### Decrease production techniques (drugs covered in Eye 5)

### Increase drainage techniques
1. **Cyclodialysis** ⭐ — separate ciliary body from sclera at angle to open drainage path
   - Use spatula to dissect, restore aqueous flow
2. **Iridectomy** ⭐ — cut out portion of iris (esp. for iris bombé from synechia)
   - Use electrocautery (prevents bleeding)
3. **Glaucoma drainage implant** (gonio implant)
   - Small tube + plate device under conjunctiva, tip in anterior chamber
   - Aqueous flows through tube → pools at plate → reabsorbs
   - Used heavily in human medicine; less in vet (cost)
4. **Cyclophotocoagulation** — laser ciliary body to reduce production

### End-stage Eye
- **Enucleation** — entire eye + adnexa, suture lid
  - Common, cosmetic OK with hair
  - ⚠️ When removing one eye, don't pull too hard — can damage other side via optic chiasm!
- **Evisceration** — keep cornea/sclera, replace inside with **prosthetic ball** (typically black silicone)
  - Looks like real eye outside
  - Cornea & sclera intact ⭐

### Surgical technique (Enucleation)
- **Transpalpebral approach** (most common in vet) — preserve cornea/conjunctiva integrity
  - Suture lid closed first → grip lid → cut around → blunt dissection deep
  - At base: identify + clamp (or not) optic nerve & vessels → remove en bloc
  - **Reduce dead space** with extraocular muscles → suture nice cosmetic result
- **Transconjunctival** (alternative)

---

# 🔻 Part 2: Diseases of the Orbit

## Anatomy
- **Semi-bony orbit** in dog/cat (NOT fully closed like in cat!)
  - Lateral wall: **ligament** (incomplete bone)
  - Floor: zygomatic gland present
  - Periorbital fat = shock absorber
  - 7 extraocular muscles (4 rectus + 2 oblique + 1 retractor bulbi)

## Primary Orbital Signs ⭐⭐
| Sign | Meaning |
|------|---------|
| **Exophthalmos** ⭐ | eye larger/protruding (mass behind eye) |
| **Enophthalmos** | eye retracted into socket (Horner's, dehydration, atrophy) |
| **Strabismus** | misaligned (neuro/muscle issue) |

## Secondary signs
- 3rd eyelid protrusion
- Scleral redness
- Inability to close eyelid → exposure keratitis

## DDx of Exophthalmos (3 categories)
| Category | Speed | Pain |
|----------|-------|------|
| **Inflammation** | fast | painful (++) |
| **Neoplasia** | slow | not painful |
| **Cyst** | medium | mildly |

## Specific Conditions
- **Masticatory muscle myositis (MMM)** ⭐ — Golden Retriever predisposed
  - Muscles around eye + face inflamed → eye pushed forward, jaw pain
  - Tx: steroid + anti-inflammatory + immunosuppressive
- **Retrobulbar abscess** — usually from oral/sinus infection extension
- **Retrobulbar tumor** — older animals
- **Orbital cyst (zygomatic mucocele)** — non-painful slow growth

## Horner's Syndrome ⭐⭐
**4 classic signs:**
1. **Enophthalmos** (eye retracted)
2. **Ptosis** (upper eyelid droops)
3. **Miosis** (constricted pupil)
4. **Third eyelid protrusion**

> ⚠️ NOT blind — looks bad but vision intact

### Phenylephrine test ⭐ (localize lesion)
- Topical phenylephrine drops → wait for pupil to dilate (re-equalize)
| Time to dilate | Localize |
|----------------|----------|
| **15-20 min** | 3rd order (post-ganglionic, near eye) — often **ear infection!** ⭐ |
| **20-40 min** | 2nd order (preganglionic, neck) |
| **> 40 min / never** | 1st order (CNS, brain) — neuroimaging needed |

> 💡 In TH: most common cause = **otitis media affecting facial/sympathetic nerve**

## Proptosis ⭐ (Eye Out of Socket)
- Brachycephalic predisposed (shallow socket)
- Common: head trauma, neck-pull, cat fight
- ⚠️ Always investigate **systemic** — proptosis = severe trauma; check for diaphragmatic hernia, etc.!

### Treatment Decision
**Push back IF:**
- < 12 hours from event
- Pupil still constricts (PLR positive)
- ≤ 2 extraocular muscles damaged
- Cornea intact
- Vision likely intact

**Enucleate IF:**
- > 12 hours
- Mydriasis (no PLR)
- Multiple muscle tears
- Cornea perforated
- Other eye blind already

### Push-back technique
- Like putting on tight pants — gentle progressive pressure
- Forceps + sterile gauze + warm saline
- May need **lateral canthotomy** (extend palpebral fissure) if too tight
- Place 3-0 or 4-0 stay sutures across cornea to bring lid edges together
- Topical Fluo (clear ulcer) + AB + Atropine

### Post-op
- Lateral canthotomy closure 7-10 days
- Stay sutures 10-14 days
- Treat exposure keratitis throughout

---

# 🔻 Part 3: Ear Examination (intro)

## Anatomy (3 parts)
| Part | Components |
|------|------------|
| **External ear** | pinna + vertical ear canal + horizontal ear canal |
| **Middle ear** | tympanic membrane + tympanic bulla + ossicles (malleus/incus/stapes) |
| **Inner ear** | cochlea (hearing) + vestibular system (balance) |

### Connection
- **Eustachian (auditory) tube** — middle ear ↔ pharynx
- Common pathway for infection from URI

## Cranial Nerves Around Ear
- **CN VII (Facial)** ⭐ — runs near ear, can be paralyzed by otitis interna/media
- **CN VIII (Vestibulocochlear)** — hearing + balance
- **Sympathetic chain** — through middle ear, lesion → Horner's

## Diseases — Otitis (3 levels)
- **Otitis externa** — pinna + canals (most common)
- **Otitis media** — tympanic bulla
- **Otitis interna** — cochlea + vestibular (rare, often associated with media)

### Otitis Externa Causes
- Predisposing: long ears, hairy ears, brachycephalic
- Inflammation: allergy, parasites
- Bacteria: Staphylococcus, Pseudomonas
- Yeast: Malassezia

### Clinical Signs
- Head shaking, scratching → aural hematoma risk
- Erythema, dark/yellow discharge
- Foul smell
- If into middle/inner: head tilt, **Horner's**, facial paralysis, vestibular signs

## Diagnosis
- Otoscope exam
- Cytology (ear swab → smear → stain)
- Bacterial culture + sensitivity (refractory)
- **Imaging**: X-ray, **CT scan** ⭐ best for bulla disease

## Medications (will detail in next session)
1. Cleansers (loosen wax, anti-microbial)
2. Antibacterial drops
3. Antifungal (Malassezia)
4. Anti-inflammatory (steroid)
5. Pain control

## 📝 Exam Hot Spots
1. **Surgical glaucoma**: cyclodialysis, iridectomy, drainage implant
2. **Enucleation** vs **Evisceration** — choose by goals
3. **Exophthalmos vs Enophthalmos vs Strabismus**
4. **Horner's 4 signs**: miosis + ptosis + enophthalmos + 3rd eyelid up
5. **Phenylephrine test** localizes Horner's (15/20-40/>40 min)
6. **MMM** = Golden Retriever, jaw pain + bilateral exophthalmos
7. **Proptosis push-back criteria**: < 12 hr, PLR+, ≤ 2 muscles, intact cornea
8. **Lateral canthotomy** for tight proptosis
9. **CN VII** affected by otitis media → facial paralysis
10. **Sympathetic chain** through middle ear → Horner's
11. **CT** = imaging of choice for ear/bulla
12. Otitis: externa → media → interna progression
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Surgery of the ear
  // ─────────────────────────────────────────────────────────────
  AVN3WDyArGk: {
    videoId: 'AVN3WDyArGk',
    title: '7.1 Surgery of the ear',
    subject: 'com3',
    date: '19 Feb 69',
    durationMin: 62,
    instructor: 'อาจารย์ (Ear surgery)',
    examFormat: 'MCQ — surgical technique + indications',
    summary: `# Surgery of the Ear

> 🔪 4 main ear surgeries — choose based on extent of disease

## Anatomy Review (3 parts — same as ear exam)
- External: pinna + vertical canal + horizontal canal
- Middle: tympanic membrane + bulla + ossicles
- Inner: cochlea + vestibular apparatus + Eustachian tube

## Otitis Externa
- Causes (skin disease, Bacteria, Mycotic, etc.)
- Breeds: Poodle, Spaniel, **floppy-eared, Scottish Fold**
- Common organisms: Staph, Pseudomonas, **Malassezia**

## Otitis Media
- **Dog**: usually descending from otitis externa (TM rupture → bulla)
- **Cat**: usually ascending or from inflammatory polyp (intrinsic to bulla)
- Clinical: pain, head tilt, **CN VII deficit** (facial paralysis, ptosis, lip droop)

## Diagnosis
- Physical exam, otoscopy
- X-ray (lateral + DV) — bulla opacity, canal thickness
- **CT/MRI** — best for assessing extent, surgical planning

---

## 4 Surgical Procedures ⭐⭐⭐

### 1. Lateral Wall Resection (LWR) — Zepp's procedure
**Indication:** mild ear canal hyperplasia / lateral vertical lesion / small mass at canal opening

**Technique:**
- U-shaped skin incision over lateral vertical canal
- Reflect skin flap (B-shape)
- Remove muscle + lateral cartilage (down to half of canal)
- Suture cartilage + skin → opens canal laterally
- Result: vertical canal halved + horizontal still patent

**Outcome:** improves ventilation + cleaning, preserves anatomy

### 2. Vertical Canal Ablation (VCA)
**Indication:** complete vertical canal disease (hyperplasia, mass) — but **horizontal preserved**

**Technique:**
- T-shaped incision (around opening + down vertical)
- Dissect ALL vertical cartilage out
- ⚠️ Watch for **facial nerve** at vertical-horizontal junction (D→V direction)
- Cut at junction, evert horizontal canal, suture to skin

**Result:** new opening at horizontal canal level

### 3. Total Ear Canal Ablation (TECA) ⭐⭐
**Indication:** chronic otitis externa with full canal disease, calcification of canals, refractory disease, neoplasia

**Technique:**
- T-incision
- Dissect entire vertical AND horizontal canal out
- ⚠️⚠️ **Critical**: dissect from **caudal to rostral** (back to front)
  - Why? Facial nerve runs caudal → rostral → dissecting wrong direction = high risk of cutting CN VII!
- Stay close to cartilage to avoid nerve

**Question:** Does TECA cause deafness?
**Answer:** ❌ No — only **conductive** mild loss
- Why? Cochlea (hearing) + ossicles (Incus/Malleus/Stapes) intact
- Like wearing earplug — quieter but can hear

**Common with**: Bulla osteotomy

### 4. Bulla Osteotomy (BO) — done with TECA
**Indication:** otitis media + bulla involvement

**Technique:**
- Drill / pin / Lempert rongeur to open bulla
- Curette out infectious material
- Flush + culture
- Place **Penrose drain** if heavy infection or fistulous tract

**Two approaches:**
- **Lateral BO** — done with TECA-LBO (most common in dog)
- **Ventral BO** — better for cat (polyp removal), avoid CN VII

---

## Complications ⭐
1. **Wound dehiscence** (infection, tension)
2. **Facial nerve damage** (VII paralysis) — main concern with TECA
3. **Horner's syndrome** — sympathetic chain damage during BO
4. **Cochlear damage** → vestibular signs / hearing loss (rare)
5. **Recurrence** if pathology not fully removed

## 📝 Exam Hot Spots
1. **4 surgeries**: LWR / VCA / TECA / Bulla osteotomy
2. **TECA does NOT cause complete deafness** — cochlea intact
3. **Facial nerve** at vertical-horizontal junction — watch during VCA
4. **TECA dissection direction**: caudal → rostral (avoid VII)
5. **Cat otitis media** = polyp common
6. **Lateral BO** with TECA / **Ventral BO** for cat polyp
7. **Pseudomonas** common refractory ear bug
8. **Pre-op CT** for bulla disease
9. **Post-op Penrose drain** if abscess
10. Ossicles = malleus, incus, stapes (carry sound to inner ear)
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM III — Diagnostic imaging for eye, ear, nervous tissue
  // ─────────────────────────────────────────────────────────────
  zy6soRaLmeg: {
    videoId: 'zy6soRaLmeg',
    title: '7.2 Diagnostic imaging for eye, ear and nervous tissue',
    subject: 'com3',
    date: '19 Feb 69',
    durationMin: 45,
    instructor: 'อาจารย์ Imaging',
    examFormat: 'MCQ — modality choice for given clinical scenario (5 questions)',
    summary: `# Diagnostic Imaging for Eye, Ear, Nervous System

> 🎯 **Exam format**: 5 case-based questions, each asks "which modality?" — choose Xray/Ultrasound/CT/MRI based on clinical hints

---

## Modality Comparison ⭐⭐⭐

| Modality | Best for | Pros | Cons |
|----------|----------|------|------|
| **Radiography (X-ray)** | bone fracture, screening | Cheap, fast, no GA | 2D superimposition, poor for soft tissue |
| **Fluoroscopy** | real-time procedures | live image | high radiation; less used in vet |
| **Ultrasound** | soft tissue (eye!), abdomen | No radiation, real-time, no GA | Can't penetrate bone/air |
| **CT** ⭐ | bone + soft tissue + vascular (with contrast) | Fast (~2 min), volume data | Radiation, **needs GA**, less specific for soft tissue |
| **MRI** ⭐⭐ | soft tissue (esp. CNS) | No radiation, best soft tissue contrast, multi-sequence | Long (~30 min), GA, expensive, NO metal implants |

---

## 1. Eye Imaging

### Globe (eyeball itself)
- **Ultrasound** ⭐ — modality of choice
- Use **stand-off** or thick gel for better near-field visualization
- Linear/sector probe at frequency > 7 MHz
- Detects: cataract, vitreous changes, lens luxation, **retinal detachment**, hyphema, intraocular mass

### Behind globe (retrobulbar)
- US can but limited (gland, fat shadow)
- ⭐ **CT or MRI** for definitive

### Specific scenarios
| Scenario | Choice |
|----------|--------|
| Unilateral exophthalmos (slow onset) | **CT with contrast** ⭐ — often nasal/sinus tumor invading orbit |
| Acute trauma + eye protrude | CT first |
| Retrobulbar abscess | CT + drain |
| Orbital myositis (MMM) | **MRI preferred** (better soft tissue) |

---

## 2. Ear Imaging

### Outer ear (pinna, vertical canal)
- Direct otoscope (physical exam)
- X-ray useful for canal patency / bulla density
- **CT** if mass or refractory

### Middle ear (bulla)
- X-ray: bulla opacity, sclerosis (chronic otitis)
- ⭐ **CT** = modality of choice
- See: bulla wall thickness, **fluid in bulla**, polyp, neoplasia
- 3D reconstruction excellent for surgical planning

### Inner ear
- **MRI** preferred — soft tissue (cochlea, vestibular)
- CT for bony anatomy

---

## 3. CNS (Brain, Spinal Cord, Nerves)

### Brain
- ⭐ **MRI** = gold standard
- Multi-sequence (T1, T2, FLAIR, STIR) helps differentiate edema vs hemorrhage vs tumor
- Contrast: rule out neoplasia, abscess, granuloma
- CT alternative if MRI unavailable, but less detail

### Spinal cord
- ⭐ **MRI** = gold standard for cord/disc
- See: IVDD (Hansen I/II), neoplasia, syringomyelia, FCE, myelitis
- CT-myelogram alternative — contrast in subarachnoid space

### Peripheral nerves
- MRI specific sequences (DTI)
- Often fluoroscopy for nerve block guidance

---

## 4. Imaging-specific contraindications

### MRI contraindications ⭐
- **Pacemakers, ICD** — magnetic interference
- Cochlear implants
- Aneurysm clips (older ferromagnetic)
- Metal foreign bodies in eye!
- ⚠️ Microchips usually OK but cause local artifact

### CT contraindications
- High GA risk
- Iodine contrast allergy / renal disease

### Ultrasound contraindications
- Almost none (very safe)
- Needs lots of gel + good acoustic window

---

## Sample Cases (sim exam format)

**Case 1:** 8 yo Pug with sudden bilateral cataract, sees light only.
- Ix: **Ultrasound globe** (rule out retinal detachment before phaco surgery)

**Case 2:** 3 yo Persian cat, head tilt + Horner's + facial paralysis 2 wk
- Ix: **CT bulla** ⭐ (suspect otitis media + nerve compression)

**Case 3:** 7 yo Cocker, sudden seizures
- Ix: **MRI brain** ⭐ (rule out neoplasia, encephalitis)

**Case 4:** 9 yo Dachshund, acute paraparesis
- Ix: **MRI thoracolumbar** ⭐ (Hansen I IVDD likely)

**Case 5:** 12 yo Golden, slow exophthalmos OD, normal contralateral
- Ix: **CT with contrast** ⭐ (likely retrobulbar/nasal tumor)

---

## 📝 Exam Hot Spots
1. **MRI = best CNS** (brain, spinal cord)
2. **CT = best bone + bulla** (middle ear, sinus invasion)
3. **Ultrasound = best globe** (intraocular)
4. **X-ray** = screening, then advanced imaging
5. MRI absolute contraindication: **pacemaker, metal in eye**
6. Need GA for CT and MRI
7. **Asymmetric exophthalmos** → CT to find nasal tumor invasion
8. Acute trauma → CT first (fast)
9. Suspected IVDD → MRI thoracolumbar
10. Inner ear = MRI; Middle ear = CT
`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Dermatology intro + Parasitic skin diseases
  // ─────────────────────────────────────────────────────────────
  ytpYnHmuRh0: {
    videoId: 'ytpYnHmuRh0',
    title: '3. Dermatology intro + Parasitic skin diseases',
    subject: 'com4',
    date: '19 Mar 69',
    durationMin: 119,
    instructor: 'อาจารย์ (Dermatology + Endocrinology)',
    examFormat: 'MCQ — primary/secondary lesion identification + drug choice + species-specific treatment ออกเยอะ',
    summary: `# Dermatology Intro + Parasitic Skin Disease

> 🩺 บทเปิดของ derm section · combined ชั่วโมง 1 (intro) + ชั่วโมง 2 (diagnostic) · ตามด้วย parasitic
> 🎯 หลัก: pruritus DDx order = **Parasitic → Bacterial → Fungal → Allergic**

---

# 🔻 Part 1: Skin Anatomy & Physiology

## Skin layers (top → bottom)
| Layer | Notes |
|-------|-------|
| **Stratum corneum** | dead keratinized cells, sheds (= invisible shedding) |
| Stratum lucidum | **only at paw pad** (4 vs 5 layers) |
| Stratum granulosum | granules accumulate |
| Stratum spinosum | bigger cells |
| Stratum basale (basal cell) | germinative — new cells form here |
| ↓ basement membrane (lamina) ↓ | filters drug/blood |
| **Dermis** | blood vessels, nerves, **sebaceous + apocrine glands**, fibroblasts, collagen |
| **Hypodermis (subcutaneous)** | fat, deeper |

> ⚠️ **Epidermis has NO blood vessels** → systemic drugs reach poorly → must use **topical** for shallow lesions
> ⚠️ Deep lesions (dermis/SQ) → systemic drugs work better

## Keratinization cycle ⭐
- **Dog/cat: 3 weeks** · Human: 4 weeks
- 📌 Implication: ประเมินผลรักษา derm = **wait at least 3 weeks** per cycle (not 1-2 wks like human)
- Thicker lesion = more cycles to clear

**Imbalance scenarios:**
- Sebum/keratin produce ↑↑ + slow shed → **hyperkeratosis** (thick skin)
- Produce normal but shed too fast → **scaling/dandruff**

## Skin Barrier
- **Stratum corneum + intercellular lipid (ceramide)** = "ซีเมนต์ระหว่างอิฐ"
- Functions: prevent water loss + block allergens/microbes
- Barrier broken → ↑ TEWL (transepidermal water loss) → dry skin → allergens penetrate easier

## Skin Appendages
| Gland | Where | Function | Disease links |
|-------|-------|----------|---------------|
| **Sebaceous** | follicle opening, dense at neck/interdigital/tail base | Sebum (FA + wax) → physical barrier | hypothyroid → ↓ sebum → dry coat |
| **Apocrine** | follicle, all body | sweat-like, hormone-related | minor in derm |
| **Eccrine** | **paw pad ONLY** in dog/cat | sweat; cooling | dry pad = poor skin health |

> 💡 **No eccrine on body** in dog/cat — they don't sweat through skin like humans

## Hair structure ⭐⭐
- **Primary hair** = coarse, long, pigmented (color) — outer coat
- **Secondary hair (undercoat)** = fine, soft, short — fluff layer

**Single-coat** (primary only — short shed):
- Doberman, Rottweiler, Boxer, Poodle, French Bulldog

**Double-coat** ⭐ (heavy shedders, need daily-EOD brushing):
- Pomeranian, Husky, Alaskan, Samoyed, Shiba, Bangkaew, Chow-Chow, Collie, German Shepherd, **Golden** (less shed)

> 💡 Bulldog = short coat but **double** → cold tolerant
> 💡 **Secondary hair shorter lifespan** → double-coat dogs shed more → daily brushing required!

**Hair cycle**: anagen (growth) → catagen (transition) → telogen (rest/fall)

**Cycle dominance:**
- **Anagen-dominant** = keeps growing → **Poodle, Bichon** (need clipping, no natural shed)
- **Telogen-dominant** = grows to length, sheds → **Pom, Husky, Alaskan**
- **Hairless** = Chinese Crested, American Hairless Terrier (genetic, no follicles)

> ⚠️ Hairless breeds harder to manage — no sebum → very dry, need moisturizer

## Hair growth factors
| Factor | Effect |
|--------|--------|
| **Thyroid hormone** | stimulate anagen → ↑ hair growth |
| **Glucocorticoid** | inhibit growth (excess in Cushing → halt) |
| Genetics, nutrition | varies |
| Day length, T°, drugs | external |

## Dog vs Human skin
| Feature | Dog/Cat | Human |
|---------|---------|-------|
| pH | **7-7.5** (neutral) | 5.5 (acidic) |
| Epidermis | 3-5 layers (thin!) | 5+ layers (thick) |
| Cycle | 3 weeks | 4 weeks |
| Hair growth | cyclical (length-limited) | continuous |

> ⚠️ **Don't use human shampoo on pet** — wrong pH disrupts barrier

## Lesion Types ⭐⭐⭐ (exam favorite)

### Primary lesions (early, specific cause)
| Lesion | Definition | Often = |
|--------|-----------|---------|
| **Macule** | flat color change < 1 cm | erythema, pigmentation |
| **Patch** | flat color change > 1 cm | same, larger |
| **Papule** | red firm bump (raised) | inflammation, neoplasia |
| **Plaque** | papules merged, > 1 cm | chronic inflammation |
| **Pustule** ⭐ | small pus-filled bump | **95% bacterial** (also pemphigus!) |
| Vesicle | small clear fluid bump < 1 cm | rare in vet |
| Bulla | clear fluid > 1 cm | early pemphigus, friction |
| Nodule | deep, > 1 cm | tumor, granuloma |

### Secondary lesions (late, non-specific)
| Lesion | Definition | Implies |
|--------|-----------|---------|
| **Comedo** | "blackhead" — sebum plug | endocrine (Cushing, hypothyroid) |
| **Epidermal collarette** ⭐ | ring of scale (broken pustule!) | post-bacterial pyoderma |
| **Scale** | dandruff | scaling disease, parasitic |
| **Crust** | dried exudate | yellow=pus, dark=blood |
| **Excoriation** | scratch marks | pruritus (itch indicator!) |
| Fissure | linear skin crack | dry, cracked footpad |
| **Erosion** | shallow loss (epidermis only) | minor, not painful (no nerve) |
| **Ulcer** ⭐ | deep loss → dermis | painful, bleeds |
| **Lichenification** ⭐ | thickened "elephant skin" | chronic (months+) inflammation |
| **Hyperpigmentation** | dark patch | chronic inflammation |
| Atrophy (thin skin) | epidermal thinning | Cushing |
| Scar | fibrotic | wound to dermis |

> 💡 **เทคนิคโชว์อาจารย์**: ลง OPD ว่า "Hyper-pigmented patch at left trunk area" → ดูเป็นชนชั้นสูงในสายตาอาจารย์ทันที

> 💡 **Reading lesion timing:**
> - Primary only → recent onset, active cause
> - Secondary only → past disease, healing
> - **Primary + Secondary together** = chronic ongoing (perfect tense — "เป็นมาตั้งแต่อดีตยังต่อเนื่อง")

## Diagnostic Tests

### Simple (basic, every case)
- Skin scraping (superficial + deep)
- Tape strip cytology
- Direct slide cytology
- Wood's lamp (ringworm)
- **Fungal culture** ⭐ (อ.ย้าย: ในไทย = simple test เพราะเจอบ่อย)
- Trichogram (hair examination)
- Flea comb

### Additional/Complex
- Biopsy → histopathology
- Allergy testing (intradermal, serum IgE)
- Bacterial culture + sensitivity
- ANA, immunology panels

---

# 🔻 Part 2: Parasitic Skin Disease

## Pruritus DDx Workflow ⭐⭐⭐

    Pruritic patient
       ↓
    1️⃣ PARASITIC (ticks, fleas, mites, lice) — RULE OUT FIRST
       ↓ negative
    2️⃣ BACTERIAL infection
       ↓ negative
    3️⃣ FUNGAL (Dermatophyte/Malassezia)
       ↓ negative
    4️⃣ ALLERGIC — sub-workflow:
       - Flea allergy (handled in step 1)
       - Contact dermatitis (rule out by history)
       - **Food trial** → if response = food allergy
       - If no response → **Atopy** (environmental)
       - 15-20% have BOTH atopy + food (combination allergy)

> ⚠️ **เมื่อสงสัย — TREAT empirically** (ตัวอย่าง parasitic) · ไม่ต้องรอ confirmed

## 🦟 Tick (เห็บ)
- Female lays **thousands** of eggs · adult lives 2-6 years
- ⭐ เห็น 1 ตัว ≠ มี 1 ตัว · มี environment full of ticks
- Direct damage: bite wound, local inflammation, secondary infection
- **Indirect threat**: vector for **Ehrlichia** → can cause **IMT** → cyclosporine 200mg BID × 3 mo (~30K baht/mo!)

> 📌 อ.: เคสไซบีเรียนเลี้ยงในห้องแอร์ 100% มา รพ.ฉีดวัคซีน → ได้เห็บกลับไป 2 เดือนถัดมา → IMT → 30K/mo

## 🪰 Flea (หมัด)
**Population breakdown (95% in environment!):**
- Adult fleas on animal: **only 5%**
- Eggs, larvae, **pupae** in environment: 95%
- Pupae can dormant **3-6 months** in environment
- → Treat env **at least 3-6 months** to clear

**2 Forms:**
| Type | Difference |
|------|-----------|
| **Flea Investation** | not allergic to saliva → flea bite = pain + anemia + disease vector only |
| **FAD** (Flea Allergic Dermatitis) ⭐ | genetic allergy to flea saliva → severe itch, even 1-2 fleas = disaster |

**FAD lesions (dog):**
- ⭐ **Lumbosacral area** classic (back/tail base)
- Hair loss, papules, excoriation, lichenification, hyperpigmentation
- Secondary pyoderma + Malassezia common

**FAD lesions (cat):**
- ⭐ **Bilateral symmetrical alopecia** (over-grooming)
- Miliary dermatitis · Eosinophilic plaque
- Indolent ulcer at upper lip
- ⚠️ **Cat = mysterious** — same lesion can be ANY allergy type! Can't dx by lesion alone

> ⚠️ **Flea drug paradox**: ยาดีที่สุด → flea bites → dies, BUT **saliva already deposited** → still triggers FAD for 1-2 wk

## 🕷️ Mites

### Sarcoptes scabiei
- Female burrows into epidermis → **intense pruritus**
- Classic lesions: **ear margin crust** + hock + elbow
- ⭐ **Pinnal-pedal scratch reflex** (rub ear → dog scratches with hindlimb) — supportive
- Dx: **Superficial skin scraping** (epidermis only — no blood) — but yield < 20%
- Cat: face/head only
- **Treat empirically if suspect** — high index because hard to find

### Otodectes cynotis (Ear mite)
- Classic: **"coffee-ground" black discharge** in ear
- Cat > dog · intensely pruritic, head shaking → **aural hematoma**
- Dx: ear swab → see white moving dots OR otoscope direct view
- Tx: **Isoxazoline** + ear flush (mechanical removal)

### Demodex ⭐⭐
**3 species:**
| Species | Location | Contagious? |
|---------|----------|-------------|
| **D. canis** (dog), **D. cati** (cat) | **In hair follicle** | ⊘ Only dam → puppy < 72 hrs after birth |
| **D. injai** (dog), **D. gatoi** (cat) | **On skin surface** ⭐ | ✅ **YES, contagious** |

**Classification:**
- By age: **juvenile-onset** (puppy/kitten) vs **adult-onset** (immunocompromised → look for Cushing, lymphoma, etc.)
- By extent: **localized** (< 5 spots) vs **generalized** (≥ 5 spots)

**Lesions:** comedones, follicular hyperpigmentation, alopecia
- May have secondary pyoderma → "demodicosis with pyoderma"

> ⚠️⚠️⚠️ **Demodex = absolute contraindication for steroid!** (immunosuppressive → bloom)

**Tx:** **Isoxazoline** ⭐ (now first-line — old: amitraz dip, ivermectin)

## 🦗 Lice (Pediculosis)
- **Species-specific** (dog lice ≠ cat lice)
- 2 types: sucking (anchored, sucks blood) vs biting (mobile, bites skin)
- Egg = **nit** = stuck to hair
- ⭐ Easy to see — light-colored, slow moving on dark coat
- Common in rural / poor husbandry
- Tx: Isoxazoline 1 dose = done

---

## 💊 Drug Reference

### Current gold standard: **Isoxazoline** ⭐⭐⭐
- Brands: **Bravecto, Simparica, NexGard, Credelio** (all = isoxazoline class)
- Coverage: ticks, fleas, sarcoptes, demodex, otodectes, lice — **almost all parasites!**
- ⚠️ Caution: **patients with seizure / epilepsy** — lowers seizure threshold
- Alternative if seizure: **Moxidectin spot-on, Selamectin**

### Deprecated / Avoid
- **Ivomec injection** ⊘ (poor efficacy, outdated)
- **Mitaban (amitraz dip)** ⊘ (replaced by isoxazoline)
- **Frontline (fipronil)** — still works but less effective for ticks now (resistance)

### Tick collar (Seresto, etc.)
- Marketed 6-8 mo, but tick often grabs **under collar** → not reliable
- Use as adjunct to oral isoxazoline, not primary

## 🎯 Treatment Principles

1. **Treat the animal** (oral isoxazoline first-line)
2. **Treat the environment** (esp. flea — 95% there)
3. **Treat ALL pets in household** (parasites pass between)
4. **Lifelong prophylaxis** for at-risk pets (outdoor, multi-pet)
5. **When in doubt → empirical treatment** (cheap, effective)
6. Manage **secondary issues**: pyoderma, allergic itch (steroids OK after demodex/parasitic ruled out)

---

## 📝 Exam Hot Spots ⭐⭐⭐

### Anatomy/Physiology
1. **Epidermis = no blood vessels** → topical for surface, systemic for deep
2. Keratinization cycle: **3 wk dog/cat** vs 4 wk human → re-evaluate at 3 wk
3. **Dog skin pH 7-7.5** vs human 5.5 → no human shampoo
4. Single vs double coat (Doberman vs Pomeranian/Husky)
5. Anagen-dominant (Poodle) vs telogen-dominant (Pom)
6. Sebum production — sebaceous gland → hypothyroid lowers
7. Sebaceous gland concentrated: **neck, interdigital, tail base**
8. Eccrine sweat glands **only on paw pad**
9. **Skin barrier** = stratum corneum + ceramide intercellular lipid

### Lesions ⭐⭐⭐
1. **Pustule** = mostly bacterial (95%) — but rule out pemphigus
2. **Epidermal collarette** = ring scale = post-pustule
3. **Macule < 1 cm**, **patch > 1 cm**
4. **Excoriation** = scratch mark (itch indicator)
5. **Lichenification** = thick chronic skin
6. **Hyperpigmented patch** = chronic inflammation
7. Erosion (epidermis) vs **Ulcer** (dermis, painful)
8. Comedones = endocrine (Cushing/hypothyroid)
9. Primary alone = recent · Primary+Secondary = chronic active

### Parasitic
1. **Pruritus workflow** = parasitic → bact → fungal → allergic
2. **Flea: 5% on pet, 95% environment**
3. **Pupae survive 3-6 mo** dormant
4. **FAD: lumbosacral dog**, bilateral symmetrical cat
5. **Sarcoptes**: ear margin + hock + elbow + pinnal-pedal reflex
6. **Demodex** ⊘ NEVER STEROID + adult-onset = look for immunosuppression
7. **D. injai/gatoi** = surface, contagious (vs canis/cati = follicle, not contagious adult-adult)
8. **Otodectes**: coffee-ground discharge, head shake, aural hematoma
9. **Isoxazoline** = current gold standard for almost all parasites
10. ⚠️ **Avoid isoxazoline if seizure history**
11. Treat **animal + environment + all in-contact pets**
12. Empirical treatment when in doubt

---

> 💡 **อ. closing tip:**
> "เห็บ/หมัดเล็กน้อย — แต่อาจนำเชื้อ Ehrlichia → IMT → ค่ารักษา 30K/เดือน 3-6 เดือน · อย่ามองข้าม"
> "Cat lesions = mysterious — แมวมี 1 lesion type 1,000 cause · ต้องไล่ทุก step"
> "Demodex อย่าให้ steroid เด็ดขาด — หากดอาการได้ก็จริง แต่ underlying disease กระจายแน่"`,
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

  // ─────────────────────────────────────────────────────────────
  // COM IV — Immune-mediated disease I: Introduction + Vaccine reaction
  // ─────────────────────────────────────────────────────────────
  xh7DdpW3Ft8: {
    videoId: 'xh7DdpW3Ft8',
    title: '7. Immune-mediated disease I: Introduction',
    subject: 'com4',
    date: '19 Feb 69',
    durationMin: 119,
    instructor: 'อาจารย์ (ผู้สอนหลัก) + พี่หมอ specialist',
    examFormat: 'Case-based MCQ — เน้น Type I-IV mediator + Vaccine adverse reaction',
    summary: `# Immune-mediated Disease I — Introduction + Vaccine Reaction

> 🎯 บทนี้สำคัญมาก โดยเฉพาะ **Vaccine adverse reaction** (พี่ specialist ย้ำ "วันนี้พูด adverse reaction เยอะ — เจอบ่อย ทำให้สัตว์ตายได้")
> ครอบคลุม: Hypersensitivity recap (4 types), Pathophysiology approach, **Vaccine adverse reaction = host factor ไม่ใช่ vaccine**

---

## 🔹 Hypersensitivity Recap (อ.วุฒิสอนแล้ว — ออกข้อสอบ DCA)

ยังคงมี **4 types เท่านั้น** (ไม่ใช่ 5/6) แม้ตำราใหม่:

| Type | Mediator | ตัวอย่าง |
|------|----------|---------|
| **I** Immediate | IgE + mast cell | Atopy, asthma, food allergy, anaphylaxis, **vaccine reaction** |
| **II** Cytotoxic | Antibody attack receptor | **IMHA** (เจอบ่อยมาก), Myasthenia gravis, transfusion reaction |
| **III** Immune complex | Ag-Ab complex deposit | **SLE**, serum sickness, Blue eye (CAV-1), vaccine sterile abscess |
| **IV** Cell-mediated | T cell + macrophage | Contact dermatitis, **drug hypersensitivity**, granuloma |

### Type IV ตอนนี้แบ่ง 4 sub-types
- **4A** = TH1 → macrophage/monocyte
- **4B** = TH2 → eosinophil
- **4C** = Cytotoxic T (รุนแรงสุด — รุนแรงทั้งผิวหนัง+organ)
- **4D** = TH17 (ใหม่ล่าสุด)
- 🆕 TH9 coming soon!

---

## 🔹 Approach to Immune-mediated Disease (สำคัญที่สุด)

> ⚠️ พี่ specialist ย้ำ: **"ต้องเข้าใจ pathophysiology — ไม่ใช่แค่ท่องโรค → ยา 1 2 3 4"**
> เพราะออกคลินิกจริงต้อง design treatment ให้เหมาะกับเคส

### 5 ลำดับการดูแล Immune-mediated case
1. **Correct critical/life-threatening** (anaphylactic shock, CV collapse) → CPR, ดึงให้กลับมาหายใจเองก่อน
2. **Communicate with owner** (mortality data — เช่น IMHA โอกาสรอด ~30% — ต้องบอกเจ้าของก่อน)
3. **Remove cost** ที่ทำให้เกิด secondary immune-mediated (heartworm, Babesia, Ehrlichia)
4. **Immunomodulatory drug** — เลือก first-line ตาม guideline → second-line
5. **Aggressive supportive therapy** ⭐⭐⭐ "สำคัญพอๆ กับยากดภูมิ"

### ตัวอย่าง: IMHA + PTE (pulmonary thromboembolism)
- IMHA mortality ~70-80% — ส่วนใหญ่ตายจาก **PTE ไม่ใช่ขาด O2**
- ถ้าเข้าใจ pathophys → เพิ่ม **aspirin** เป็น antiplatelet → **โอกาสรอดสูงขึ้นเยอะ**
- ✅ Lesson: pathophys → drug design

---

## 🔻 Vaccine Adverse Reaction ⭐⭐⭐ (Focus วันนี้)

> 💬 "ฉีดวัคซีนทุกวัน — โอกาสเจอ reaction สูง · ต้องอธิบายและจัดการเป็น"

### ความเข้าใจผิดยุคใหม่
- **❌ "วัคซีนไม่ดี"** ← ห้ามพูดแล้ว!
- **✅ "Host factor / Host genetic"** ← ทุก guideline ปัจจุบันยืนยัน
- → ชี้นิ้วกลับมาที่ **สัตวแพทย์ — ประเมินสุขภาพ host พอหรือยัง?**

### Risk Factors — ท่องไว้ตลอดชีวิต ⭐
1. **พันธุ์เล็ก** (small breed, น้ำหนัก < 5 kg)
2. **อายุน้อย**
3. **Multiple vaccines** ในเข็มเดียว/ครั้งเดียว

### อาการ — หมา vs แมว ไม่เหมือนกัน
| Species | Acute presentation |
|---------|-------------------|
| 🐕 หมา | หน้าบวม → อ้วก → ช็อก/CV collapse (ดึงเข็มออกแล้วล้มทันที) |
| 🐈 แมว | Anaphylactic น้อย — แต่เจอ **FISS** (Feline Injection Site Sarcoma) ในระยะยาว |

### Incidence (จาก papers ล่าสุด)
- อังกฤษ ~20/10K · อเมริกา ~20/10K · **ญี่ปุ่น ~63/10K** (สูงผิดปกติ — น่าสนใจวิจัย)
- น้ำหนักยิ่งน้อย → reaction ยิ่งสูง
- **ตอน vs ไม่ตอน** — ตัวที่ทำหมันแล้ว reaction น้อยกว่า

### 🚨 Acute reaction handling
1. **หยุดการกระตุ้น** ดึงเข็มออก
2. **Epinephrine** SC/IM (1:1000, 0.01 mg/kg)
3. **Diphenhydramine** 2 mg/kg IM
4. **Dexamethasone** 0.5-1 mg/kg IV (กันรอบ 2)
5. **IV fluid** + O2 supplement
6. **Monitor 6-24 hr** — biphasic reaction มีจริง

---

## 📝 Exam Hot Spots

1. **Hypersensitivity 4 types** — mediator + ตัวอย่างโรค (table)
2. **TH17 = Type IV-D** (ใหม่)
3. **IMHA mortality ~70%** — เจ้าของต้องรู้
4. **Vaccine reaction = HOST factor** ห้ามโทษวัคซีน
5. **Risk: small breed + young + multiple vax**
6. **Acute anaphylaxis → epinephrine first**
7. **PTE = leading cause of death in IMHA** (ไม่ใช่ขาด O2)
8. **Aspirin** ลด mortality ใน IMHA อย่างมีนัยสำคัญ
9. **Type II = Antibody attacks receptor** (IMHA, MG, transfusion)
10. **Type III = Immune complex** (SLE, Blue eye CAV-1)

---

> 💡 **Closing message**: "การรักษาเป็นศิลปะ — pickup ได้ไม่เท่ากันทุกคน · อ่าน guideline (worldwide professional org) ก่อน magazine · ความเข้าใจ pathophys = ออกแบบ Tx ที่ดีกว่าได้"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Endocrinology: Hypothyroidism (canine)
  // ─────────────────────────────────────────────────────────────
  Z26xw6gCVrk: {
    videoId: 'Z26xw6gCVrk',
    title: '5. Hypothyroidism',
    subject: 'com4',
    date: '5 Feb 69',
    durationMin: 65,
    instructor: 'พี่หมอ Endocrine specialist',
    examFormat: 'Case-based MCQ — Total T4 + Free T4 + TSH interpretation',
    summary: `# Hypothyroidism — สรุปคลิป (สุนัข เป็นหลัก)

> 🎯 พี่ specialist เล่าจาก practice: **Hypothyroidism = "Common ที่สุดในสุนัข + Over-diagnosed มากที่สุด"**
> 95% ของเคสเป็น **สุนัข** · แมวแทบไม่เจอ (ยกเว้นหลังรักษา hyperthyroid)
> Adult onset ~95% เกิดจาก **immune-mediated destruction** ของ thyroid gland

---

## 🔹 Pathophysiology
- **Primary** (95%) — immune destruction ของ thyroid gland → ฮอร์โมนต่ำ
- **Secondary** (rare) — pituitary ไม่สร้าง TSH
- **Tertiary** (rare) — hypothalamus ไม่สร้าง TRH
- **Congenital/Juvenile** — เกิดมาแล้ว gland ไม่พัฒนา (rare)
- ⚠️ **Non-thyroidal illness syndrome (NTIS / Sick Euthyroid)** — โรคอื่นทำให้ T4 ดูต่ำลวง — pitfall ใหญ่!

---

## 🔹 Hormone Cascade
TRH (hypothalamus) → TSH (pituitary) → **T4** (thyroid, mainly inactive) → peripheral **deiodination** → **T3** (active form)

> 💡 T3 = active หลักจริง · แต่วัด T4 เพราะ stable + measure ได้ง่ายกว่า
> T3 ใน serum dynamic มาก → ไม่ใช้ในคลินิก

---

## 🔹 Signalment
- **Middle age – senior dog** (3-8 ปี · เฉลี่ย 7 ปี)
- ทำหมันแล้ว → risk เพิ่มขึ้น (ทั้งตัวผู้/ตัวเมีย)
- **Predisposed breeds**: Golden, Doberman, Cocker, Boxer, **Bangkaew** (ในไทยเจอ ~30% ของเคส)
- **Sighthound/Husky/Greyhound** — มี T4 baseline ต่ำตามพันธุ์ → **อย่าตกใจ** อย่าวินิจฉัยพลาด

---

## 🔹 Clinical Signs (Multi-system — ขึ้นกับว่า organ ไหนเด่น)

### 1. Dermatological (~60-80%)
- **Easy epilated hair** — ดึงขนเบาๆ หลุดทั้งกระจุก ⭐ key feature
- **Rat tail** — ขนหางหายไปก่อน (แต่ที่อื่นยังมี)
- ขนหยาบแห้งไม่เป็นมัน · Hyperpigmentation
- **Myxedema** ("puffy skin") — hyaluronic acid + น้ำใต้ผิวหนัง — แข็งเหมือน cellulite
- **Tragic facial expression** — หน้าตก หนังตาห้อย "หน้าเศร้า"
- Recurrent infection (immunosuppression)

### 2. Metabolic (~84% — เจอเยอะที่สุด!)
- **Weight gain** แม้กินน้อย ⭐
- **Lethargy / exercise intolerance**
- **Cold intolerance** (เห็นชัดในเมืองนอก · บ้านเรา = อาจสังเกตว่าหนาวสั่นแม้แอร์เย็นเล็กน้อย)

### 3. Less Common
- 🧠 **Neurologic**: facial nerve paralysis, vestibular, neuropathy, ataxia, **megaesophagus**
- 👁️ KCS (dry eye), corneal **lipid deposition** (จาก hyperlipidemia)
- ❤️ **Bradycardia**, low ECG voltage, weak contractility

---

## 🔹 Diagnosis ⭐⭐⭐ (Gray zone!)

> ⚠️ "Hypothyroidism วินิจฉัยยากกว่า hyperthyroidism" — ไม่มี test เดียวฟันธงได้

### Routine Labs (Non-specific แต่ help)
- **Fasting hypercholesterolemia** ⭐ (อดอาหารแล้วยังสูง = แดง flag)
- Mild non-regenerative anemia (normocytic, normochromic)
- ALT/ALP ขึ้นเล็กน้อย (จาก hepatic lipidosis)

### Endocrine Tests
| Test | Normal | Hypo dog | Sensitivity/Specificity |
|------|--------|----------|------------------------|
| **Total T4** | 1.5-3 µg/dL | < 1.5 (ต่ำชัด < 0.5) | High sens, low spec — ลวง NTIS ได้ |
| **Free T4** | 0.6-3 ng/dL | < 1 (ต่ำชัด < 0.5) | Spec สูงกว่า · แต่ไทยไม่มี ED method |
| **TSH (cTSH)** | < 0.6 ng/mL | สูง > 0.6 | 33% ของเคสจริงไม่ขึ้น! → sens ต่ำ |

> 🎯 **3 ค่ารวมกัน** = Total T4 ต่ำ + Free T4 ต่ำ + TSH สูง = น้ำหนักเยอะมากว่า hypothyroid

### พี่หมอ Personal Scoring (4/8 = น่าจะเป็น)
| Finding | Pts |
|---------|-----|
| T4 ต่ำ | 1 |
| ไม่มี non-thyroid illness | 1 |
| T4 < 0.5 (โคตรต่ำ) | 1 |
| TSH > 0.6 | 1 |
| TSH > 0.8 (โคตรสูง) | 2 |
| Hypercholesterolemia | 1 |
| Free T4 ต่ำ | 1 |

### ⚠️ ยาที่ทำ T4 ต่ำลวง (drug-induced low T4 — ไม่ใช่โรค)
- **Glucocorticoid** (prednisolone, dexamethasone)
- **Phenobarbital** (ในเคสชัก)
- **Sulfonamide**
- **NSAID** (เล็กน้อย)
- ✅ **Potassium bromide** = ไม่มีผล (ใช้แทน phenobarbital ได้ในเคสชักที่จะตรวจ T4)

---

## 🔹 Treatment

- **Levothyroxine 20 µg/kg PO** BID (tablet) หรือ SID (Leventa solution — bioavailability ดีกว่า)
- **ตอนท้องว่าง** — อาหารลดการดูดซึม
- หมาตัวใหญ่ → **อย่าให้ตามน้ำหนักจริง** (ใช้ ideal weight) — ป้องกัน side effect
- หมามีโรคหัวใจ → เริ่มที่ **25-50% ของ dose** ก่อน → ค่อยๆ titrate up

### Monitoring (4 weeks หลัง start)
- **Pre-medication**: ไม่ป้อนยามาก่อน → คาดหวังกลางๆ ของ reference (~2.5 ใน 1-4)
- **Peak Total T4**: ป้อน 4-6 ชม. ก่อนมา → คาดหวัง high-normal/supranormal (3.5-5)

### Response Timeline
| System | เริ่มเห็น |
|--------|---------|
| Energy/activity | 1-2 สัปดาห์ |
| Weight loss | 1-2 เดือน |
| Skin/coat | 1-2 เดือน (ขนเต็มอาจหลายเดือน) |
| Neurologic (vestibular, facial nerve) | 2-4 สัปดาห์ |

### Non-response → คิดอะไรบ้าง?
1. **วินิจฉัยผิด** (NTIS จริงๆ ไม่ใช่ hypo)
2. ลำไส้หนา → absorbing ยาไม่ได้
3. เจ้าของไม่ป้อน
4. Concurrent disease

---

## 📝 Exam Hot Spots

1. **95% ใน dog** + middle age + tested breeds
2. **Easy epilated hair + rat tail** = pathognomonic-ish
3. **Tragic facial expression + myxedema + weight gain** classic triad
4. **Fasting hypercholesterolemia** — most consistent biochem
5. **3 endocrine tests** — Total T4 + Free T4 + TSH (ต้องครบ)
6. **NTIS** = T4 ต่ำลวงจากโรคอื่น — pitfall
7. **Phenobarbital + glucocorticoid** ทำ T4 ต่ำลวง · K-Br ไม่มีผล
8. **Levothyroxine 20 µg/kg PO BID** + ตอนท้องว่าง
9. **Pre-medication T4 = mid-reference** · **Peak T4 = high-normal**
10. **Sighthound/Husky baseline ต่ำ** ตามพันธุ์ — ระวังพลาด

---

> 💡 **อ. closing tip:** "อย่าตัด hypothyroid ออกแค่เพราะไม่มีอาการผิวหนัง — เป็น endocrine disease · มี/ไม่มี dermatologic sign ก็ได้"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Endocrinology: Diabetes mellitus
  // ─────────────────────────────────────────────────────────────
  Cpb5HfKStKs: {
    videoId: 'Cpb5HfKStKs',
    title: '6. Diabetes mellitus',
    subject: 'com4',
    date: '12 Feb 69',
    durationMin: 68,
    instructor: 'พี่หมอ Endocrine specialist',
    examFormat: 'Case-based MCQ — ALIVE criteria + insulin curve interpretation + remission',
    summary: `# Diabetes Mellitus (DM) — สุนัขและแมว

> 🎯 บทใหญ่ — ครอบคลุม classification, ALIVE criteria, insulin types, monitoring, glucose curve, **Somogyi phenomenon**
> ⭐ Goal of treatment: **คุณภาพชีวิตดี + ลด clinical sign + ไม่ hypoglycemia** (ไม่ได้บอกว่า "น้ำตาลต้องอยู่ในช่วงปกติ")

---

## 🔹 Classification

### Old → New
- ❌ IDDM / NIDDM (insulin-dependent / not)
- ✅ **Type 1 / Type 2** (ตามคนที่จัด)

| Type | Mechanism | Species typical |
|------|-----------|-----------------|
| **Type 1** | β-cell ขาด insulin จริง (absolute deficiency) | 🐕 **Dog** (95%) |
| **Type 2** | Insulin resistance + β-cell exhaustion | 🐈 **Cat** (Type 2-like) |

> ⚠️ แม้แมวเป็น Type 2 — แต่ **ทั้งคู่ต้องการ insulin** (ไม่เหมือนคน Type 2)

### แมว — โรคแฝงสำคัญ ⭐
- **Hypersomatotropism (Acromegaly)** — มี GH สูง — เจอใน **25% ของแมวเบาหวาน** — ต้องตรวจหา!
- Concurrent: **Pancreatitis, obesity, hyperthyroidism**, dental disease, kidney disease

---

## 🔹 Pathophysiology — Classical Triad ⭐
1. **Hyperglycemia** → osmotic diuresis → **PU/PD**
2. **Glucose ไม่เข้า cell** → ร่างกายขาดพลังงาน → **Polyphagia (PP)**
3. **Fat catabolism** → free fatty acid → ketone → ถ้าหนัก = **DKA**
4. Muscle catabolism → muscle loss (BCS อาจอ้วน · MCS หาย!)

> 💡 ต้องประเมินทั้ง **Body Condition Score (BCS) + Muscle Condition Score (MCS)**

---

## 🔹 Diagnosis — ALIVE Criteria ⭐⭐⭐

> เป็นมาตรฐานใหม่ระดับ worldwide ที่ทุกคนต้อง follow

### 🐕 สุนัข
| Scenario | Required |
|----------|---------|
| Spot glucose **> 200 mg/dL** + classic signs ชัด | = DM ✅ |
| Spot > 200 + ไม่แน่ใจ signs | + 1 ใน 3: **persistent hyperglycemia** / **fructosamine สูง** / **glucosuria** |
| 130-200 (gray zone) | + 2 ใน 3 ที่กล่าวข้างต้น |

### 🐈 แมว — ยากกว่า (มีปัจจัย stress hyperglycemia!)
- **Spot > 270 mg/dL** + signs (ยังไม่ confirm — แมวตกใจขึ้นได้)
- ต้องมี **persistent hyperglycemia** หรือ **glucosuria 2 days** เพิ่ม
- Gray zone 126-270 → ต้อง 2 ใน 3 เกณฑ์เพิ่ม

### Glycated Proteins
- **Fructosamine** — สะท้อน glucose ย้อนหลัง 7-10 วัน · ลด stress factor
- **HbA1c** — ใช้ในคนเป็นหลัก · สัตว์ไม่ค่อยใช้

### Subclinical DM
- เกณฑ์ครบ (น้ำตาล + fructosamine สูง) **แต่ไม่มีอาการ** = subclinical

---

## 🔹 Treatment Goals
1. ⭐ **Quality of life** (สัตว์ + เจ้าของ)
2. **ลด clinical signs** (PU/PD, PP)
3. ⚠️ **ป้องกัน hypoglycemia** (ตายก่อน hyperglycemia!)
4. **ป้องกัน DKA**
5. **คงสภาพ BCS/MCS ปกติ**

---

## 🔹 Insulin — 5 ตัวหลัก

| Insulin | Type | Species | Dose | Frequency |
|---------|------|---------|------|-----------|
| **Caninsulin (Vetsulin/Lenta porcine)** | Intermediate | 🐕 Dog (1st choice) | 0.25 U/kg | BID |
| **Glargine (Lantus U100)** | Long → reclassified intermediate | 🐈 Cat (1st choice) | 1-2 U/cat | BID |
| **PZI (Protamine Zinc)** | Intermediate | Both | — | BID |
| **Detemir** | Long-acting analog | Both | — | BID |
| **NPH (humulin N)** | Intermediate | 🐕 Dog (large) | — | BID |

### Critical Rules ⭐
- **DO NOT DILUTE** insulin — **ยกเว้น Regular insulin (DKA only)**
- ใช้ **insulin syringe** ให้ตรงความเข้มข้น (40 U vs 100 U)
- คำนวณตาม **ideal body weight** (ไม่ใช่ actual ถ้าอ้วน)
- **ห้ามปรับโดสบ่อย** — รอ ≥ 1-2 สัปดาห์

---

## 🔹 Diet & Lifestyle

### 🐕 Dog (~50% importance)
- **High fiber** → ชะลอการดูดซึมน้ำตาล (เหมือนข้าวกล้อง)
- กินมื้อเท่าๆ กัน BID พร้อม insulin

### 🐈 Cat (~80% importance!) ⭐⭐⭐
- **Carb < 10%** ของ ME (cat = obligate carnivore)
- **Wet food** > dry food (low calorie density)
- กินทั้งวันได้ (free feeding) หรือ 4 มื้อ
- Goal: weight loss 0.5-2%/wk

### Spaying important
- Female dog → progesterone causes insulin resistance → ทำหมัน

---

## 🔹 Glucose Curve Monitoring ⭐⭐⭐

> เจาะ **ทุก 2 ชม.** (สุนัข) หรือ **ทุก 4 ชม.** (แมว ใช้ glargine)
> **ห้ามเจาะค่าเดียวแล้วปรับโดส!**

### Parameters ที่ต้องดู
| Parameter | Target | Action |
|-----------|--------|--------|
| **Nadir** (lowest pt) | 80-150 mg/dL | < 80 → ลด dose · > 150 → เพิ่ม dose |
| **Direction of action** | drop > 50 mg/dL | < 50 = dose ไม่พอ |
| **Duration of action** | covers 12 hr | สั้น/ยาวเกิน → ปรับ |
| **Clinical sign** | PU/PD ลด | ใช้เป็น **gold standard** |

---

## 🔹 Somogyi Phenomenon ⭐ Key concept!

> 💡 อย่ารีบเพิ่มโดสตอนน้ำตาลสูง — **อาจเกิด Somogyi**

**Mechanism**: insulin **เกินขนาด** → glucose ลงเร็ว/ต่ำมาก → ร่างกายตกใจ → หลั่ง **cortisol + epinephrine + glucagon** → **rebound hyperglycemia ยาวๆ** → ไม่ตอบ insulin (resistance)

**Pattern**: nadir ต่ำเร็ว → spike สูงยาว
**Action**: **ลด dose** (ไม่ใช่เพิ่ม!)

---

## 🔹 Insulin Resistance
- 🐕 Dog: > 1 U/kg/dose ยังไม่ response · หรือ > 1.5 U/kg ไม่ลง < 300
- 🐈 Cat: > 5 U/dose
- Causes: cortisol/GH excess, infection, obesity, ฮอร์โมนอื่น, ฉีดผิด

---

## 🔹 Continuous Glucose Monitor (CGM)
- Validate ในสัตว์แล้ว
- **Subcutaneous interstitial fluid** glucose — lag 5-12 min
- ติดได้ ~2 wk
- ลด stress hyperglycemia + ลด owner burden
- ⭐ **พี่หมอใช้แทน glucose curve ส่วนใหญ่** — ราคาใกล้กัน · สัตว์ทรมานน้อยกว่า

---

## 🔹 Remission (แมวเด่น!)
- ไม่ต้องฉีด insulin ≥ 4 เดือน = **remission**
- โอกาสครั้งที่ 2 ต่ำมาก → control ครั้งแรกให้ดี
- อาหาร + insulin tight control + แก้ resistance early = remission rate สูง
- 🆕 **SGLT2 inhibitor (oral)** — สำหรับ "Happy DM cat" only (ไม่มี comorbid · β-cell ยังทำงาน)

---

## 📝 Exam Hot Spots

1. **Type 1 = dog (absolute) · Type 2-like = cat (resistance + exhaustion)**
2. **Hypersomatotropism เจอใน 25% แมว DM** — ตรวจ!
3. **ALIVE: dog spot > 200 + sign** · **cat spot > 270 + 1/3 add'l**
4. **Classical triad: PU/PD + PP** + weight loss + muscle wasting
5. **Goal Tx ≠ น้ำตาลปกติ** — Quality of life + ไม่ hypo
6. **Glargine = cat 1st** · **Caninsulin = dog 1st**
7. **DO NOT dilute insulin** (except regular for DKA)
8. **Cat carb < 10% ME** + wet food
9. **Glucose curve q 2 hr (dog) / q 4 hr (cat)** · **อย่าปรับโดสจาก single point!**
10. **Somogyi**: drop เร็ว → rebound — **ลด dose**
11. **Remission แมว**: ≥ 4 เดือนไม่ต้อง insulin
12. **Female dog DM** → ต้องทำหมัน (progesterone effect)
13. **ทำ CGM 2 wk** ลด stress hyperglycemia

---

> 💡 **Closing**: "Quality of life ของเจ้าของสำคัญ — flexible insulin time ±2 hr ได้ · ถ้าทำให้เจ้าของหดหู่จากต้น = ไม่ไปต่อ = สัตว์ตายเร็ว"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Clinical Oncology (Introduction + Diagnostic Approach)
  // ─────────────────────────────────────────────────────────────
  BdHpzNra1rU: {
    videoId: 'BdHpzNra1rU',
    title: '8. Clinical oncology',
    subject: 'com4',
    date: '26 Feb 69',
    durationMin: 110,
    instructor: 'พี่หมอ Oncology specialist',
    examFormat: 'Case-based MCQ — staging + cytology pattern + diagnostic approach',
    summary: `# Clinical Oncology — Introduction + Diagnostic Approach

> 🎯 บทแรกของ Oncology — ครอบคลุม cancer biology, **paraneoplastic syndromes**, diagnostic approach (cytology → biopsy → staging), และวิธีคุยกับเจ้าของ
> Cancer ในสัตว์เลี้ยงเจอบ่อยขึ้นมาก เพราะอายุยืน + เจ้าของดูแลดี

---

## 🔹 Cancer Biology Recap

### 6 Hallmarks of Cancer (Hanahan & Weinberg)
1. **Sustained proliferation** — growth signal autonomous
2. **Evade growth suppressor** (p53, Rb)
3. **Resist apoptosis**
4. **Replicative immortality** (telomerase)
5. **Angiogenesis** (VEGF)
6. **Invasion + metastasis**

### Emerging Hallmarks
- Genome instability + mutation
- **Inflammation** ที่เอื้อต่อ tumor
- Reprogramming energy metabolism (Warburg effect)
- **Evade immune destruction** ⭐ (immunotherapy targets)

---

## 🔹 Tumor Classification

### Benign vs Malignant
| Feature | Benign | Malignant |
|---------|--------|-----------|
| Growth | ช้า | เร็ว |
| Border | ชัด/มี capsule | invasive |
| Mitotic rate | ต่ำ | สูง |
| Metastasis | ❌ | ✅ |
| Recurrence post-excision | ต่ำ | สูง |

### By Cell Origin
- **Epithelial** → carcinoma (squamous, adeno, transitional)
- **Mesenchymal** → sarcoma (fibro, osteo, hemangio)
- **Round cell** → lymphoma, MCT, plasmacytoma, histiocytoma, TVT
- **Hematopoietic** → leukemia

---

## 🔹 Paraneoplastic Syndromes ⭐⭐⭐

> 💡 **Paraneoplastic = อาการจาก tumor ที่ไม่ได้มาจาก mass effect/metastasis**
> มาจาก hormone, cytokine, autoimmune ที่ tumor หลั่ง

| Syndrome | Tumor Association |
|----------|-------------------|
| **Hypercalcemia of malignancy (HCM)** | Lymphoma (T-cell), AGASACA (anal sac), MM, parathyroid tumor |
| **Hypoglycemia** | Insulinoma, large hepatic mass |
| **Polycythemia** | Renal carcinoma |
| **Cachexia** | Many advanced cancers |
| **Hypertrophic osteopathy** | Lung tumor |
| **DIC / coagulopathy** | Hemangiosarcoma |
| **Cutaneous flushing/MCT** | MCT (histamine release) |
| **Myasthenia gravis** | Thymoma |

> ⭐ Hypercalcemia + lymphadenopathy = **think lymphoma** until proven otherwise

---

## 🔹 Diagnostic Approach — TNM staging

### Step 1: Cytology (FNA)
- ⭐ **First-line**, cheap, minimal invasive
- ดี: round cell tumor, lipoma, abscess
- จำกัด: sarcoma (cells ติดกัน), แยก benign vs malignant ของ epithelial

### Step 2: Histopathology (biopsy)
- **Gold standard** — แยก tumor type + grade
- Incisional vs excisional
- Margin assessment

### Step 3: Staging
- **T (Tumor)**: ขนาด + invasion local
- **N (Node)**: regional LN involvement → FNA LN
- **M (Metastasis)**:
  - 🫁 Thoracic radiograph **3 views** (R lat, L lat, VD/DV)
  - Abdominal ultrasound
  - CT/MRI ถ้ามี

---

## 🔹 Communication with Owner

> 💬 พี่ specialist: "Cancer talk ต้องช้าๆ + give realistic prognosis + options + cost"

### Standard Options
1. **Surgery** — primary if resectable
2. **Chemotherapy** — systemic
3. **Radiation** (จุฬามี linear accelerator)
4. **Targeted therapy** (Toceranib for MCT)
5. **Immunotherapy** (vaccine for melanoma)
6. **Palliative** — pain control + quality of life

### Decision Framework
- Aggressive curative vs palliative
- Owner finances + commitment
- Pet's age + comorbidities
- **Quality of life > quantity** ในส่วนใหญ่

---

## 📝 Exam Hot Spots

1. **6 hallmarks of cancer** — ออกแน่
2. **Paraneoplastic syndromes** — table โดยเฉพาะ HCM-lymphoma
3. **Carcinoma vs Sarcoma vs Round cell** — by cell origin
4. **Cytology = first line · biopsy = gold standard**
5. **Thoracic rad 3 views** for metastasis screening
6. **TNM staging** — must know
7. **Insulinoma → hypoglycemia** · **Renal Ca → polycythemia** · **HSA → DIC**
8. **MCT → histamine** → flushing, GI ulcer

---

> 💡 **Closing**: "อย่าพึ่งฟันธงว่าเป็นมะเร็ง — FNA ก่อน · ถ้าผ่าตัดได้และ benign อาจหายขาด · ถ้า malignant ต้อง stage แล้วค่อยตัดสินใจร่วมกับเจ้าของ"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Round Cell Tumors (Lymphoma, MCT, TVT, Plasmacytoma, Histiocytoma)
  // ─────────────────────────────────────────────────────────────
  'LRhlotxM-SI': {
    videoId: 'LRhlotxM-SI',
    title: '9. Round cell tumor',
    subject: 'com4',
    date: '5 Mar 69',
    durationMin: 115,
    instructor: 'พี่หมอ Oncology specialist',
    examFormat: 'Case-based MCQ — cytology pattern + treatment protocol (CHOP, vinblastine)',
    summary: `# Round Cell Tumors — สรุปคลิป

> 🎯 5 round cell tumors ที่ต้องรู้: **Lymphoma, MCT, TVT, Plasmacytoma, Histiocytoma**
> + **Cutaneous histiocytoma** = self-limiting (rare round cell ที่หายเองได้)
> Cytology ดู round cell ได้ง่าย + diagnostic — **first line** ในทุกเคส

---

## 🔹 Cytology Pattern Recognition ⭐⭐⭐

| Tumor | Cytology Hallmark |
|-------|------------------|
| **Lymphoma** | Lymphoblast — large nucleus, scant cytoplasm, prominent nucleolus |
| **MCT** | **Purple/metachromatic granules** (Wright's stain) — eosinophil ปน + |
| **TVT** | Round cell + **multiple cytoplasmic vacuoles** (clear) |
| **Plasmacytoma** | Eccentric nucleus + **perinuclear clear zone (Hof)** |
| **Histiocytoma** | Mixed inflammation + histiocytes |

---

## 🔹 Lymphoma ⭐⭐⭐ (Most common — focus หลัก)

### Classification
- **Multicentric** (~80% canine) — generalized lymphadenopathy
- **Mediastinal** — common in cat (FeLV+)
- **Alimentary** — GI signs
- **Extranodal** — skin, eye, CNS, kidney

### Diagnosis
- **FNA peripheral LN** (NOT mandibular — drainage from tonsil) → choose popliteal/prescapular
- **Cytology** confirm → **flow cytometry / IHC** → B vs T cell
- **CBC** — atypical lymphocyte? cytopenia?
- **Staging**: T (LN), N (further LN), M (BM, organ)
- **WHO Stage I-V** + substage a (no clinical signs) / b (signs)
- **Hypercalcemia** — common in T-cell

### Treatment — CHOP Protocol ⭐ (Madison-Wisconsin)
- **C** = Cyclophosphamide
- **H** = Hydroxydaunorubicin (Doxorubicin)
- **O** = Vincristine (Oncovin)
- **P** = Prednisolone
- 19-25 weeks · ~80% remission · MST 12 mo
- **Doxorubicin alone** = simpler · MST ~ 6-9 mo
- **Single agent prednisolone** = palliative · MST 1-3 mo · INDUCE chemoresistance ⚠️

---

## 🔹 Mast Cell Tumor (MCT)

### Cytology
- Round cell + **purple metachromatic granules** (Wright/Romanowsky)
- Toluidine blue helps if Diff-Quik miss granules

### Grading (Patnaik 1984 — 3 tier)
- **Grade I** — well-differentiated, low metastasis
- **Grade II** — intermediate (variable!)
- **Grade III** — anaplastic, high metastasis

### Kiupel 2-tier (more reproducible)
- **Low grade** vs **High grade**

### Staging
- **Buffy coat** + bone marrow (looking for circulating mast cells)
- **Splenic FNA** — even if normal-sized
- Hepatic FNA
- LN — **regional sentinel** node

### Treatment
- **Surgery** — wide margin (3 cm + 1 fascial plane) ⭐
- Adjuvant if grade II/III, dirty margin, LN+:
  - **Vinblastine + prednisolone**
  - **Lomustine (CCNU)**
  - **Toceranib (Palladia)** — c-KIT mutation tumor → ดี
- **H1 + H2 blocker** before/around surgery (degranulation prophylaxis)

### Darrier's sign
- Rub MCT skin → wheel + flare → degranulation → diagnostic clue

---

## 🔹 Transmissible Venereal Tumor (TVT)

- **Genital region** (penis, vagina) — transmitted by mating
- Round cell + **vacuoles** in cytoplasm
- ⭐ **Vincristine** — single agent, very responsive (4-6 weekly doses)
- Excellent prognosis if IV vincristine

---

## 🔹 Plasmacytoma (Cutaneous)

- Older dog · digit, ear, lip
- Cytology: eccentric nucleus + **Hof zone**
- **Surgery alone** ส่วนใหญ่หาย — benign behavior in skin
- ⚠️ Multiple myeloma (systemic) ≠ cutaneous plasmacytoma — check serum protein electrophoresis

---

## 🔹 Cutaneous Histiocytoma

- **Young dog (< 3 yr)** — solitary "button" tumor
- Self-limiting — **regress in 1-3 months** spontaneously
- **No treatment** ส่วนใหญ่ — แค่ confirm with cytology
- ถ้า persist > 3 mo → biopsy (rule out histiocytic sarcoma)

---

## 🔹 Special: Histiocytic Sarcoma
- Aggressive — Bernese Mountain Dog, Flat-coated Retriever predisposed
- High metastasis · poor prognosis · **Lomustine** = response ~ 50%

---

## 📝 Exam Hot Spots

1. **5 round cell tumors** + cytology hallmark (table)
2. **Lymphoma WHO stage** + CHOP protocol (CCNU/Doxo/Vincristine/Pred)
3. **MCT Patnaik grade I-II-III + Kiupel 2-tier**
4. **MCT surgery margin = 3 cm + 1 fascial plane**
5. **TVT → vincristine** (most responsive!)
6. **Plasmacytoma cutaneous = benign · MM systemic = bad**
7. **Histiocytoma young dog → regress spontaneously**
8. **Hypercalcemia + lymphoma = T-cell**
9. **Buffy coat + spleen FNA in MCT staging**
10. **H1 + H2 blocker before MCT surgery**

---

> 💡 **Tip**: "Cytology round cell tumor ดูง่ายสุด — train ให้ recognize pattern ได้ใน 1 wk ก็พอ · เป็น differential ที่ทำได้เร็ว"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Chemotherapy + Paraneoplastic Syndromes
  // ─────────────────────────────────────────────────────────────
  tlRcao67Kjc: {
    videoId: 'tlRcao67Kjc',
    title: '10. Chemotherapy + Paraneoplastic syndromes',
    subject: 'com4',
    date: '12 Mar 69',
    durationMin: 120,
    instructor: 'พี่หมอ Oncology specialist',
    examFormat: 'Case-based MCQ — drug class + side effects + paraneoplastic recognition',
    summary: `# Chemotherapy + Paraneoplastic Syndromes

> 🎯 บทนี้ภาคหลักของ oncology — ทุก class ของ chemo, side effects, dosing, **paraneoplastic syndromes** (deep dive)
> ⚠️ Chemo ในสัตว์ ≠ ในคน — เป้าหมายคือ **quality of life** ไม่ใช่ aggressive cure (ขนาดยาต่ำกว่า — หาง side effect ลด)

---

## 🔹 Chemotherapy Classes ⭐

### 1. Alkylating agents
- **Cyclophosphamide** — DNA cross-link · BSA dose · **sterile hemorrhagic cystitis** (cat ระวัง — ให้ furosemide ช่วย flush)
- **Lomustine (CCNU)** — oral · cross BBB · **hepatotoxicity** (monitor ALT) + delayed thrombocytopenia
- **Chlorambucil** — oral · gentle · MM, IBD, lymphoma (cat indolent)
- **Melphalan** — MM, MCT

### 2. Anti-tumor antibiotics
- **Doxorubicin (Adriamycin)** — anthracycline · **cardiotoxicity** (cumulative > 180 mg/m² dog) · vesicant (extravasation = necrosis!)
- **Mitoxantrone** — alternative · less cardiotoxicity · TCC (bladder)

### 3. Plant alkaloids
- **Vincristine** — TVT first-line · CHOP · **vesicant**
- **Vinblastine** — MCT first-line
- ⚠️ Both = severe extravasation injury

### 4. Antimetabolites
- **Methotrexate** — folate antagonist
- **Cytarabine (Ara-C)** — leukemia, CNS lymphoma · cross BBB
- **Gemcitabine** — sarcoma, carcinoma

### 5. Platinum
- **Carboplatin** — osteosarcoma · **less nephrotoxic** than cisplatin
- **Cisplatin** — ❌ FATAL in cats (pulmonary edema) · careful renal in dogs

### 6. Targeted therapy ⭐ ใหม่
- **Toceranib (Palladia)** — TKI · MCT (c-KIT+), STS
- **Imatinib** — c-KIT
- **Tigilanol tiglate (Stelfonta)** — intratumoral injection for MCT

### 7. Hormonal
- **Prednisolone** — lymphoma, MCT (single or adjunct)
- ⚠️ ห้าม start prednisolone **ก่อน** lymphoma diagnosis — induce chemoresistance!

---

## 🔹 Chemo Side Effects ⭐⭐⭐

### 1. Myelosuppression (most common)
- Nadir 7-10 days post-Tx
- Monitor **CBC** before each cycle
- ANC < 1500 → delay 1 wk
- Severe neutropenia + fever → **EMERGENCY** (sepsis risk) → IV broad-spectrum antibiotic

### 2. GI toxicity
- Nausea, vomiting, diarrhea
- **Maropitant + ondansetron** → before/during Tx
- Metronidazole + probiotics for diarrhea

### 3. Cardiotoxicity (Doxorubicin)
- Cumulative dose-dependent
- Echo BEFORE start + every 2-3 cycles
- **Dexrazoxane** for extravasation OR cardioprotective

### 4. Nephrotoxicity (Cisplatin, doxo)
- Hydration before/after
- Cisplatin = saline diuresis 4hr pre + 4hr post

### 5. Hypersensitivity (L-asparaginase, doxorubicin)
- Pre-medicate diphenhydramine + dexamethasone
- Slow IV infusion

### 6. Extravasation injury (vesicants)
- **Vincristine, vinblastine, doxorubicin** — necrosis if leak
- Use **central line** if possible · clean butterfly · flush with saline before/after

### 7. Sterile hemorrhagic cystitis (Cyclophosphamide)
- Crystal damage urothelium
- Give morning + furosemide + free water access
- Severe = stop drug · switch to chlorambucil

---

## 🔹 Practical Chemo Administration

### Pre-Tx Checklist
1. **Owner consent** + counsel side effects
2. **CBC + biochem** within 24 hr
3. **PE** + body weight
4. **BSA** (dog > 10 kg) or mg/kg (small/cat)
5. **Re-stage** every 2-3 mo

### Safety
- Cytotoxic PPE (gloves, gown, eye protection)
- Closed-system transfer device
- Dispose: yellow biohazard sharp box
- Owner: gloves cleaning urine/feces × 72 hr post-Tx
- Pregnant/young child contact → caution

---

## 🔻 Paraneoplastic Syndromes ⭐⭐⭐ (Deep Dive)

### Hypercalcemia of Malignancy (HCM)
- ⭐ **Most common paraneoplastic in dog**
- Mechanism: **PTHrP** secretion · IL-6, TNFα
- **Tumors**: T-cell lymphoma, **AGASACA (anal sac adenocarcinoma)**, multiple myeloma
- Dx: **Total Ca > 12.5** + ionized Ca high + **PTH suppressed** + **PTHrP elevated**
- Tx: 0.9% NaCl IV · furosemide · prednisolone · bisphosphonate (pamidronate)

### Hypoglycemia
- **Insulinoma** (β-cell tumor of pancreas)
- Whipple's triad: low BG + neuro signs + relief with glucose
- **Insulin/glucose ratio**: high = insulinoma
- Tx: surgery + diazoxide + frequent feeding

### Polycythemia
- **Renal carcinoma** (EPO-secreting)
- PCV > 65% · low EPO suppression
- Tx: phlebotomy · hydroxyurea

### Cancer cachexia
- Multifactorial: TNF, IL-1, IL-6
- **Muscle wasting** despite calorie intake
- Nutrition: **omega-3 fish oil** · high-calorie diet · appetite stimulant (mirtazapine, capromorelin)

### Hypertrophic osteopathy
- **Lung tumor** (or chronic pulmonary disease)
- Periosteal new bone all 4 limbs · painful
- Tx: treat primary tumor · NSAID

### DIC
- **Hemangiosarcoma** classical · also adenocarcinoma
- **Schistocyte** + thrombocytopenia + prolonged PT/PTT + low fibrinogen + ↑ D-dimer
- Tx: treat tumor · supportive (FFP, heparin)

### Myasthenia gravis
- **Thymoma**
- Acetylcholine receptor antibody
- Megaesophagus, weakness
- Tx: pyridostigmine + thymectomy

### MCT-related
- **Histamine** release → GI ulcer, hypotension
- Pre-Tx: **H1 + H2 blocker** (diphenhydramine + famotidine)

---

## 📝 Exam Hot Spots

1. **6 chemo classes** + 1 example each
2. **Cyclophosphamide → sterile hemorrhagic cystitis** + furosemide prophylaxis
3. **Doxorubicin cardiotoxicity** — cumulative · echo monitor
4. **Cisplatin = FATAL in cats** (pulmonary edema)
5. **Vincristine, vinblastine, doxo = vesicants** — extravasation = necrosis
6. **Toceranib (Palladia)** — TKI · MCT c-KIT
7. **Don't start prednisolone before lymphoma Dx!**
8. **Neutropenic fever = emergency** → IV antibiotic
9. **PTHrP-secreting tumors** = T-cell lymphoma, AGASACA, MM
10. **Insulinoma → hypoglycemia · Renal Ca → polycythemia · HSA → DIC**
11. **Myasthenia gravis ↔ thymoma**
12. **MCT histamine → H1 + H2 blocker pre-surgery/Tx**
13. **CHOP protocol** = Cyclo + Doxo + Vincristine + Pred · 19-25 wk

---

> 💡 **Tip**: "Chemo ในสัตว์ — quality > quantity · ใช้ low dose intensity · เป้าหมายให้ remission แล้วใช้ชีวิตปกติ ไม่ใช่ aggressive cure แล้วทุกข์"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Bacterial + Fungal Skin Diseases
  // ─────────────────────────────────────────────────────────────
  cMPpvQcg0kY: {
    videoId: 'cMPpvQcg0kY',
    title: '4. Bacterial + Fungal skin diseases',
    subject: 'com4',
    date: '26 Mar 69',
    durationMin: 121,
    instructor: 'พี่หมอ Dermatology specialist',
    examFormat: 'Case-based MCQ — pyoderma depth + dermatophyte Dx + Tx duration',
    summary: `# Bacterial + Fungal Skin Diseases

> 🎯 หัวใจของ approach ผิวหนังคัน: **ต้องเคลียร์ infection ก่อน** เสมอ (parasite/bacteria/fungus) ก่อนสงสัย allergy
> Bacterial = **Staphylococcus pseudintermedius** (90-95%) · Fungal = **Microsporum canis** (cat 90-98%)

---

## 🔻 Part 1: Bacterial Skin Disease (Pyoderma)

### 90% เป็น Secondary
> ⚠️ "Bacterial pyoderma คอมมอนสุดในไทย — แต่มักไม่ใช่ primary cause · ต้องหา **underlying disease**"

### Underlying Causes
1. **Allergy** (atopy, food allergy) → skin barrier defect
2. **Endocrine** (Cushing, hypothyroid) — immunosuppression
3. **Parasitic** (demodex, scabies)
4. **Trauma/poor hygiene**
5. **Glucocorticoid use** (down-regulate immune)

### Classification by Depth ⭐⭐⭐

| Depth | Layer | ตัวอย่าง | Treatment |
|-------|-------|---------|-----------|
| **Surface** | Stratum corneum only | Pyotraumatic (hot spot), Skin fold pyoderma, Mucocutaneous | **Topical only** |
| **Superficial** | Epidermis + hair follicle (intact) | Impetigo, Superficial bact folliculitis, Bullous impetigo | Topical ± systemic 4-6 wk |
| **Deep** | Dermis + SC (follicle ruptured) | Deep folliculitis, Furunculosis, Cellulitis | **Systemic 6-12 wk** + culture |

### Common Lesions
- **Crust** (เซoidate แห้ง)
- **Erythematous patch** (> 1 cm แดง)
- **Folliculitis bumps** (papules/pustules)
- **Epidermal collarette** = pus exit ring (oval scaly border)
- **Hot spot** = pyotraumatic dermatitis (acute, fast lamination)

### Skin Fold Pyoderma (Intertrigo)
- Breed: Shar-Pei, Bulldog, Pug, Cocker
- Location: facial / vulvar / tail / inguinal
- **Surgery** if chronic + recurrent (correct fold)

### Mucocutaneous Pyoderma
- Lip margins, eyelid, prepuce
- ⚠️ Cytology can show **gram-negative** (saliva contamination) — not always actual cause

### Diagnosis
1. **Cytology** ⭐ — first line · cocci pattern (Staph) → confirm bacterial
2. **Culture + sensitivity** — for deep, recurrent, MRSP risk
3. **Skin scrape + DTM** — rule out demodex/dermatophyte

### Treatment

#### Topical (Surface + Superficial)
- **Chlorhexidine 2-4% shampoo** — 2x/wk
- **Benzoyl peroxide** — follicular flushing
- **Mupirocin/fusidic acid** — focal
- ❌ Avoid antiseptic for mild — kills good flora

#### Systemic (Superficial deep, Deep)
- **First-line**: **Amoxicillin-clavulanate** (Augmentin) 12.5-25 mg/kg PO BID
- **Cephalexin** 22-30 mg/kg PO BID
- **Cefovecin (Convenia)** 8 mg/kg SC q14d
- **Second-line** (after C&S): clindamycin, erythromycin
- **❌ NOT first-line** without C&S: fluoroquinolones (resistance risk)
- **❌ Avoid**: amoxicillin alone, ampicillin, penicillin (β-lactamase!)

#### Duration
- **Superficial**: 4-6 wk · continue 1-2 wk **after clinical cure**
- **Deep**: **6-12 wk** + 3-4 wk after clinical cure
- Re-culture if no improvement at 4 wk

---

## 🔻 Part 2: Fungal Skin Disease

### Dermatophytosis (Ringworm)

### Common Pathogens (3 main)
| Species | Source | Note |
|---------|--------|------|
| **Microsporum canis** | Cat-to-cat, infected animal | **90-98% of feline cases** · zoonotic |
| **Microsporum gypseum (Nannizzia gypsea)** | Soil | Outdoor dogs (Jack Russell, terrier) |
| **Trichophyton mentagrophytes** | Rodent | Hunting dogs |

### Spore Persistence
- **18 months** in environment (carpet, brush, cage)
- ⚠️ Reinfection risk if environment not decontaminated
- Common from: grooming salon, boarding, multi-cat household

### Lesions
- Classic: **circular alopecia** (ringworm pattern)
- Scale, crust, papule, hyperpigmentation
- **Less itchy** than bacterial/parasitic
- May involve **nail, nasal planum** (cat)

### Diagnosis (4 modalities)
1. **Wood's lamp** — UV light · only **50% of M. canis** fluoresce apple-green · false-positive common (sebum, soap, bacteria)
2. **Trichogram** — pluck hair → KOH 10% (old) or **Diff-Quik B solution** (modern) → look spores around hair shaft
3. **DTM (Dermatophyte Test Medium)** ⭐ — gold standard
   - **Color change yellow → red** within 7-14 days
   - **Colony**: white fluffy (not green/black/colored)
   - **Macroconidia** ID under microscope (key — rule out non-pathogenic fungi)
4. **PCR** — most sensitive · expensive
5. **Tape strip + cytology** for combined Dx

### M. canis Macroconidia
- > 6 cells, **thick wall**, spindle-shaped
- M. gypseum: **3-5 cells, thin wall**
- T. mentagrophytes: rare macroconidia, mostly microconidia "cigar-shaped"

### Treatment

#### Topical
- **Lime sulfur dip** 2x/wk (effective but smelly)
- **Miconazole + chlorhexidine shampoo** 2x/wk (Malaseb)
- **Enilconazole** rinse

#### Systemic (severe, multifocal, deep)
- **Itraconazole** 5-10 mg/kg PO SID (cat 5 mg/kg PO SID alternate week × 4 cycles)
- **Terbinafine** 30-40 mg/kg PO SID
- **Fluconazole** less effective for dermatophyte
- **❌ Ketoconazole** — hepatotoxic, less preferred

#### Duration
- **Until 2 negative fungal cultures 2 wk apart**
- Usually 6-12 wk minimum

#### Environment Decon
- **Bleach 1:10**, accelerated H₂O₂
- Vacuum + discard bedding
- Wash all combs/brushes

### Pseudomycetoma (Granulomatous form)
- Hair follicle ruptured → fungal hyphae in dermis
- Forms **subcutaneous nodule**
- Treat: **systemic antifungal + surgery**

### Other Fungal
- **Malassezia** (yeast) — common ที่หู, lip fold, intertrigo · greasy odor · treat with chlorhexidine + miconazole

---

## 📝 Exam Hot Spots

1. **Pyoderma 3 depths**: Surface · Superficial · Deep — Tx duration table
2. **Staph pseudintermedius** = 90-95% · gram-positive cocci
3. **Amoxicillin-clavulanate** = first-line empirical
4. **❌ Plain amoxicillin/ampicillin/penicillin** — β-lactamase
5. **Superficial 4-6 wk · Deep 6-12 wk** + 1-2/3-4 wk post-cure
6. **Hot spot** = pyotraumatic = surface · topical only
7. **Mucocutaneous pyoderma** ผลตรวจ gram-negative อาจ contamination
8. **M. canis 90-98% in cat** + 50% Wood's lamp +
9. **DTM color change + colony + macroconidia** = 3-step Dx
10. **Spore persists 18 months** — environment decon
11. **Itraconazole** = systemic first-line for dermatophyte
12. **Pseudomycetoma** = ruptured follicle + dermis fungus → granuloma

---

> 💡 **Tip**: "Cytology + DTM + skin scrape — 3 ตัวที่ทำง่ายในคลินิก ก่อน refer · ครบ 80% ของ skin Dx"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Allergic dermatitis + Nutrition skin disease
  // ─────────────────────────────────────────────────────────────
  SWIXruJ9XNs: {
    videoId: 'SWIXruJ9XNs',
    title: '5. Allergic dermatitis + Nutrition skin disease',
    subject: 'com4',
    date: '2 Apr 69',
    durationMin: 120,
    instructor: 'พี่หมอ Dermatology specialist',
    examFormat: 'Case-based MCQ — Food trial protocol + Atopy Tx ladder',
    summary: `# Allergic Dermatitis + Nutritional Skin Disease

> 🎯 หลังเคลียร์ infection แล้ว → **กลุ่ม allergy** เป็น differential หลักของ pruritic dog/cat
> 4 โรค: **Contact, Flea, Food, Atopy** — แต่ Food vs Atopy = identical twin (แยกได้แค่ Food trial!)

---

## 🔹 Decision Tree (Pruritic Skin Disease)

\`\`\`
Pruritic dog/cat
  ↓ Step 1: Clear infection (parasitic/bacterial/fungal)
  ↓ Still pruritic?
  ↓ Step 2: Differentiate 4 allergies:
    1. Contact allergic dermatitis (rare — has location pattern)
    2. Flea allergy dermatitis (FAD) — control flea
    3. Food allergy
    4. Atopic dermatitis (environmental)
\`\`\`

---

## 🔹 1. Contact Allergic Dermatitis (Type IV — least common)

- Lesion **only at contact site** (sparse-haired skin: groin, axilla, plantar)
- History: **new shampoo, ear drop, plastic bowl**, floor cleaner
- Cytology: **eosinophil-rich**
- Tx: avoid allergen + topical steroid

> 💡 Common misconception: "แพ้น้ำยาถูพื้น" ที่ตา/หู — **ไม่จริง** เพราะไม่ได้สัมผัสจริง

---

## 🔹 2. Flea Allergy Dermatitis (FAD)

- **Lumbosacral area** (dog) · neck/inguinal (cat)
- Even **single bite** → severe reaction (saliva allergen)
- Few visible fleas (animal scratches them off)
- Tx: **strict flea control** all pets in house · environmental treatment

---

## 🔹 3. Food Allergy ⭐⭐⭐

### Key Concepts
- **Identical to atopy clinically** — distinguish only by **Food Trial**
- Multiple food allergens common (rarely single ingredient)
- **Cross-reactivity** between similar species:
  - Beef ↔ cow's milk · Cow ↔ lamb/goat (hoofed) ❌
  - Chicken ↔ duck/turkey ❌

### Food Trial (Diet Elimination Trial)

#### Choose New Diet
| Type | Pros | Cons |
|------|------|------|
| **Novel protein (homemade)** ⭐ | Best — single source protein + carb | Time-consuming · need taurine/Ca add'l for cat |
| **Novel protein (commercial)** | Convenient | Other ingredients may cross-react |
| **Hydrolyzed protein** | Best for unknown food history | Expensive · commercial only |

#### Protocol
1. **8 weeks** strict trial — only the test diet + water
2. **Stop other treats, supplements, flavored medications**
3. ⚠️ Counsel grandparents/staff (often the weak link)
4. Modern concept: **continue antibiotic/steroid during trial** — but assess after 4 wk drug-free period

#### Interpretation
- **Complete resolution** → Food allergy
- **Partial response** (~15-20% cases) → combined Food + Atopy
- **No change** → Atopic dermatitis

### Allergy Testing
- ❌ Serology (IgE) for food allergy = NOT reliable in animals
- ✅ Only **Food Trial** confirms

---

## 🔹 4. Atopic Dermatitis (CAD/FAD)

### Definition
- Genetic predisposition + environmental allergen → IgE-mediated → **chronic pruritic + relapsing skin disease**
- Distribution: **face, ear, paw, axilla, ventral abdomen** (ลูกหมาเริ่ม < 3 ปี)

### Breed Predisposition
- 🐕 Westie, French Bulldog, Bulldog, Lab/Golden, Shar-Pei
- 🐈 Less defined breed pattern

### Skin Barrier Defect
- Decreased **intercellular lipid** (ceramide) → allergen penetrate easier
- → bacterial/yeast secondary infection ตามมา

### Diagnosis (Favrot's Criteria)
- ≥ 5 of 8 criteria + clinical picture
- **Allergy testing for ID specific allergen**:
  - **Intradermal skin test (IDT)** ⭐ gold standard
  - **Serum IgE** — convenient, less reliable
- Used **only for immunotherapy planning** (not diagnosis!)

### Treatment Ladder ⭐⭐⭐

#### Tier 1 — Avoid + supportive (always)
- Bathe 1-2x/wk (chlorhexidine + chlorhexidine + ceramide shampoo)
- Omega-3 fatty acids
- Treat secondary infection

#### Tier 2 — Anti-pruritic (acute flare)
- **Glucocorticoid** (prednisolone 0.5-1 mg/kg PO SID × 5-7 d → taper)
- **Oclacitinib (Apoquel)** ⭐ — JAK inhibitor · 0.4-0.6 mg/kg BID × 14 d → SID
- **Lokivetmab (Cytopoint)** ⭐ — anti-IL-31 mAb · SC monthly · super safe + effective
- Antihistamine (CPM) — limited efficacy

#### Tier 3 — Long-term
- **Cyclosporine (Atopica)** 5 mg/kg PO SID — full effect at 4-6 wk
- **Allergen-Specific Immunotherapy (ASIT)** — based on IDT — long-term remission ~ 60-70% response
- Topical tacrolimus

> 💡 พี่หมอ tip: "Apoquel + Cytopoint เปลี่ยน practice ในยุคนี้ — ลด steroid use มาก"

---

## 🔻 Nutritional Skin Disease

### 1. Zinc-Responsive Dermatosis
- **Husky, Malamute, Bull Terrier, Dane**
- Lesion: **crust around eye/mouth/footpad** ("zinc face")
- Tx: **zinc supplement** 2-3 mg/kg PO SID lifelong

### 2. Vitamin A-Responsive Dermatosis
- **Cocker Spaniel** (mostly)
- Hyperkeratosis ventral + dorsal
- Tx: vitamin A 10,000 IU PO SID

### 3. Essential Fatty Acid Deficiency
- Dry, dull coat · scaling
- Tx: omega-3/6 supplement (fish oil)

### 4. Hepatocutaneous Syndrome (Superficial Necrolytic Dermatitis)
- Liver disease (vacuolar hepatopathy) → AA deficiency
- Lesion: **erythema, crust, ulcer footpads + mucocutaneous junction**
- Poor prognosis · IV amino acid infusion + dietary support

### 5. Generic Dog Food Disease
- Cheap food → multi-nutrient deficiency
- Mostly resolves with quality complete-balanced diet

---

## 📝 Exam Hot Spots

1. **4 allergies in approach order** — Contact, Flea, Food, Atopy
2. **Contact = location-specific lesion**
3. **FAD = lumbosacral · single bite enough**
4. **Food trial 8 weeks** + strict + drug-free assess at 4 wk
5. **Novel protein homemade > commercial > hydrolyzed**
6. **Cross-reactivity**: beef-milk, chicken-duck, lamb-goat
7. **❌ Serology unreliable for food allergy** — Food trial only
8. **Atopy distribution**: face/ear/paw/axilla/ventral abdomen
9. **Apoquel = JAK inhibitor 0.4-0.6 mg/kg BID**
10. **Cytopoint = anti-IL-31 mAb · SC monthly**
11. **Cyclosporine 5 mg/kg PO SID** · full effect 4-6 wk
12. **Zinc-responsive = Husky/Malamute** — periocular crust
13. **Hepatocutaneous syndrome** — footpad ulcer + liver disease

---

> 💡 **Tip**: "อย่าตัด food allergy ออกแค่ดูรอยโรค — ต้อง Food trial เท่านั้น · ถ้าทำได้ดี ~30% เคส 'atopy' จริงๆ คือ food allergy"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM IV — Autoimmune skin + Endocrine skin disease
  // ─────────────────────────────────────────────────────────────
  tOo5b1rqAgU: {
    videoId: 'tOo5b1rqAgU',
    title: '6. Autoimmune skin diseases + Endocrine skin diseases',
    subject: 'com4',
    date: '9 Apr 69',
    durationMin: 121,
    instructor: 'พี่หมอ Dermatology specialist',
    examFormat: 'Case-based MCQ — Pemphigus dx + Endocrine skin pattern recognition',
    summary: `# Autoimmune Skin + Endocrine Skin Diseases

> 🎯 บทสุดท้ายของ derm — **Autoimmune** (rare แต่ออกข้อสอบ) + **Endocrine** (Hypothyroid, Cushing, Alopecia X — case-based)
> หลักการ: อย่ารีบเป็น autoimmune ก่อน · 95% ที่เห็นเป็น **bacterial pyoderma** มากกว่า

---

## 🔻 Part 1: Autoimmune Skin Disease

### Pathophysiology — **Acantholysis** ⭐
- Autoantibody → ทำลาย **desmosome** (cell-cell junction) → cells แยกออก = "acantholytic cells"
- เห็นใน cytology = **rounded keratinocyte** ลอยอิสระ

### Desmosome Components (where antibody attacks)
| Molecule | Location | Disease |
|----------|----------|---------|
| **Desmoglein 1** | Upper epidermis | **Pemphigus foliaceus** ⭐ |
| **Desmoglein 3** | Lower epidermis (skin) + all (mucosa) | **Pemphigus vulgaris** |
| **BP180/230** | Basement membrane | Bullous pemphigoid |
| **Type VII collagen** | Sub-basement | EBA (Epidermolysis Bullosa Acquisita) |

---

### Pemphigus Foliaceus (PF) ⭐⭐⭐ Most common autoimmune skin
- Targets: **Desmoglein 1** (upper layer)
- Lesions: **pustule → rupture → crust + scale**
- Distribution: **face (nasal planum, periocular), ear pinnae, footpad**
- Cat: footpad + nail bed common
- **Itching/pain variable**
- Breed: **Akita** (~70%), Chow, Doberman, Collie, Bearded Collie
- ⚠️ DDx = **bacterial folliculitis** — looks identical at first
  - Bacterial pustule = **bulging, red** (active infection)
  - PF pustule = **flat, soft** (clue but not definitive)

### Pemphigus Vulgaris (rare, severe)
- Targets: **Desmoglein 3** (deep layer + mucosa)
- Lesions: **deep ulcer, vesicle, oral mucosa involvement**
- Painful, systemic illness
- **Mucocutaneous junction** = nasal, oral, vulva, prepuce

### Diagnosis ⭐
1. **Cytology** — pustule → impression smear → look **acantholytic cells**
2. **Histopathology** ⭐⭐⭐ gold standard — multiple intact pustules
3. **Immunofluorescence/IHC** — confirm autoantibody (research)
4. **Rule out** infection first (culture)

### Treatment (Immunosuppression Ladder)

#### Induction (high dose)
- **Prednisolone** 2-4 mg/kg PO SID (cat 4-6 mg/kg)
- Until remission (usually 4-8 wk)

#### Adjunctive (steroid-sparing)
- **Azathioprine** 2 mg/kg PO SID (dog only — cat = TOXIC ❌)
- **Cyclosporine** 5 mg/kg PO SID
- **Chlorambucil** 0.1-0.2 mg/kg PO SID (cat preferred)
- **Mycophenolate, oclacitinib** (off-label)

#### Maintenance (taper)
- Reduce 25% every 2-4 wk if stable
- **Lifelong** therapy in most cases

---

### Other Autoimmune Skin Diseases (รู้ไว้)
- **Discoid Lupus Erythematosus (DLE)** — face/nasal planum only · sun-induced · "facial lupoid dermatosis"
- **Systemic Lupus Erythematosus (SLE)** — multi-organ + ANA+ (อ.รัสมาสอน)
- **Vasculitis** — paw/ear/tail tip ulcer · drug-induced common
- **Sebaceous adenitis** — Akita, Standard Poodle · inflammation of sebaceous gland → alopecia + scale

---

## 🔻 Part 2: Endocrine Skin Disease

### Common Pattern
> 💡 **Bilateral symmetrical alopecia + non-pruritic + non-inflammatory** = endocrine ⭐

| Disease | Signalment | Skin Pattern | Other |
|---------|-----------|-------------|-------|
| **Hypothyroid** | Middle-age large breed | Easy epilation, rat tail, myxedema, tragic face | Weight gain, lethargy, ↑cholesterol |
| **Cushing (HAC)** | Older small breed | Thin skin, comedones, calcinosis cutis, pendulous abdomen | PU/PD, PP, ALP↑ |
| **Sex hormone derm** | Intact (not spayed) | Symmetric flank alopecia | Sertoli/ovarian tumor |
| **Alopecia X** | **Pomeranian, Chow** young | "Coat funk" — body alopecia, head/legs spared | Normal hormones |

---

### Hypothyroid Skin (Recap)
- **Easy epilated hair** ⭐ pluck → hair comes off in clumps
- **Rat tail, hyperpigmentation, recurrent pyoderma**
- **Myxedema** (puffy skin, tragic face)
- Tx: levothyroxine 20-40 µg/kg PO BID
- Dermatologic improvement: **8-12 wk** (slower than systemic 2-4 wk)

### Cushing Skin
- Thin skin → easy bruising, easy tearing
- **Calcinosis cutis** ⭐ — chalky deposits + crust (esp. dorsum)
- Comedones (blackheads)
- **Bilateral symmetric truncal alopecia** + thin coat
- Tx: trilostane (PDH most common)

### Alopecia X ⭐
- Synonyms: **growth hormone-responsive dermatosis, castration-responsive, post-clipping alopecia, follicular dysplasia, Adrenal hyperplasia-like syndrome**
- Theory: **hair cycle arrest** at telogen
- **Pomeranian** ~95% of cases · Chow, Samoyed, Husky, Keeshond
- **Body alopecia + head + legs spared** classic distribution
- Hormones (T4, cortisol) **NORMAL** — that's why "X"
- Diagnosis = **rule out** other endocrine + biopsy (telogen hair only)
- Tx ladder:
  1. **Spay/castration** — first try (50% response in intact)
  2. **Melatonin** 3-6 mg/dog PO BID-TID × 3 mo
  3. **Trilostane** (low dose) — sometimes effective
  4. **Microneedling** (newer option)

---

## 🔹 Diagnostic Approach to Endocrine Skin

\`\`\`
Bilateral non-pruritic non-inflammatory alopecia
  ↓ Step 1: Rule out infection (cytology)
  ↓ Step 2: PE for systemic signs (PU/PD, weight, body shape)
  ↓ Step 3: CBC + biochem
    • ↑ ALP + stress leukogram → think HAC
    • ↑ cholesterol + non-regen anemia → think hypothyroid
  ↓ Step 4: Endocrine test
    • Total T4 + Free T4 + TSH
    • LDDS / ACTH stim / UCCR
  ↓ Step 5: If all normal → consider Alopecia X
  ↓ Step 6: Biopsy if uncertain
\`\`\`

### Drug Effects on Hormone Tests ⚠️
- **Glucocorticoid, phenobarbital, sulfonamide** → ↓ T4 (false low)
- Long Tx with these → can't reliably interpret T4

---

## 📝 Exam Hot Spots

1. **Pemphigus foliaceus = most common autoimmune skin** + Akita predisposed
2. **Desmoglein 1 = PF · Desmoglein 3 = PV/mucosa**
3. **Acantholytic cells in cytology** = autoimmune clue
4. **PF distribution**: face, ear, footpad
5. **Pred 2-4 mg/kg PO SID** = induction · adjunct: **azathioprine (dog) / chlorambucil (cat)**
6. **❌ Azathioprine in cat** = bone marrow suppression FATAL
7. **Bilateral symmetric alopecia + non-pruritic** = endocrine
8. **Easy epilated hair + tragic face** = hypothyroid
9. **Calcinosis cutis** = pathognomonic Cushing
10. **Alopecia X = Pomeranian** + body alopecia + head/legs spared
11. **Alopecia X Tx**: spay → melatonin → trilostane
12. **Hypothyroid skin response = 8-12 wk** (slower than energy 2-4 wk)
13. **Phenobarbital, glucocorticoid** → false low T4

---

> 💡 **Closing**: "Autoimmune skin disease = rare แต่ต้องนึกถึงเมื่อ recurrent infection + treat antibiotic ไม่หาย · biopsy หาคำตอบเสมอ"`,
  },

  // ═════════════════════════════════════════════════════════════
  // 🆕 EXOTIC — Final scope (week 7-14) · ปลายภาค 2026
  // 7 lectures by อ.ธวัช + อ.เสาวภางค์ (ZPOT) + อ.ไพศิลป์ + อ.ปัณณวัฒน์
  // Added 2026-04-30 from YouTube transcripts (ช่อง Dai @dai.1387)
  // ═════════════════════════════════════════════════════════════

  // ─── V8 (อ.ธวัช) Bird Treatment Basics ───────────────────────
  'Ml-PPOphv4E': {
    videoId: 'Ml-PPOphv4E',
    title: '1. การรักษาสัตว์ปีกเบื้องต้น',
    subject: 'exotic',
    date: '4 Mar 69',
    durationMin: 75,
    instructor: 'อ.น.สพ.ผศ. ธวัช เล็กดำรงศักดิ์',
    examFormat: 'MCQ — clinical reasoning + technique steps · pitfall (เช่น "นกท้องเสีย" จริงหรือไม่ · NPO กี่ชม.)',
    summary: `# การรักษาสัตว์ปีกเบื้องต้น (Basic Avian Medicine)

> 🦜 "นกป่วยถูกเอาไปหาหมอทีไร ตายทุกที" — ทำไมถึงเป็นภาพจำของเจ้าของ และเราจะแก้อย่างไร

## ⏱️ Timeline
| Time | Topic |
|---|---|
| 10-14 | ทำไมรักษานกยาก · prey species behavior |
| 14-18 | Signalment + history |
| 18-23 | Hands-off exam: respiratory · feather · droppings ⭐ |
| 23-27 | Physical exam: ฟังปอด (ไม่แม่น!) · keel/BCS |
| 27-37 | Restraint + bite warnings (African Grey, Macaw) |
| 37-44 | Blood collection · DNA sexing · CBC volume |
| 44-50 | Anesthesia: isoflurane, NPO 2-3 hr |
| 50-55 | Drug administration (PO/IM/SC pitfalls) |
| 55-60 | Fluid therapy + dehydration |
| 60-71 | Procedures: nare flush, beak/nail trim, wing clip ⭐ |

---

## 🐦 Why Bird Medicine is Hard

### Prey species nature ⭐⭐
- นก = prey species → "เก็บอาการจนถึงที่สุด" ก่อนแสดงอาการ
- เจ้าของจะบอกเสมอ "เมื่อวานยังปกติอยู่เลย" — ไม่ปกติ! แค่ไม่สังเกต

### Triage by visual assessment ⭐⭐⭐
| สภาพ | Prognosis |
|---|---|
| ยืนเกาะคอน · มี activity · จิกอาหาร | ปกติ → ตรวจได้ |
| **นอนพื้นกรง · ขนพอง · ตาปิด** | เสี่ยงตายระหว่างจับ → emergency tx (O₂ + heat + fluid) ก่อน + เตือนเจ้าของ |

> 💡 **อ.ธวัช:** "ถ้าคุณไม่แจ้งเจ้าของแล้วนกตายคามือ คุณจะโดนเบลม — ทั้งที่นกมันก็เห็นอยู่แล้วว่านอนพื้นกรงมา"

---

## 👀 Hands-Off Exam (ก่อนจับ!)

### Respiratory pattern ⭐⭐
- นกปกติ = หายใจเบาๆ หางไม่ขยับ
- ป่วย = **หางกระดกขึ้น-ลง (tail bob)** ตามจังหวะหายใจ
- ⚠️ ห้ามจับก่อนสังเกต — จับแล้ว pattern เปลี่ยน

### Droppings ⭐⭐⭐ (exam fav!)
3 components: **Faeces** (อุจจาระ) + **Urate** (ขาว · ไม่ใช่ urea) + **Urine** (น้ำ)

> ⚠️ **Pitfall**: เจ้าของบอก "นกท้องเสีย" — ไปดูเจอแค่ urate + น้ำ = **ไม่ใช่ diarrhea! นกไม่กิน** ต่างหาก
> Hornbill กินผลไม้ → dropping เหลวปกติ · นกแก้วถ่ายเหลว = abnormal

---

## 🩺 Hands-On Physical Exam

> 💡 **อ.ธวัช (เด็ด!):** "ถ้านกหนัก 100 g แล้วเอา stetth ไปแปะแล้วบอก normal lung sound — รับประกันว่ามั่ว!"
> ปอดนกฝังใน rib groove → auscultate ไม่แม่น · สงสัย respiratory → **X-ray**

### Keel/Pectoral muscle (BCS) ⭐⭐
- กระดูก keel เด่น + กล้าม pectoral แฟบ = **chronic illness** (ไม่ใช่ acute)
- ต้องหา predisposing cause ไม่ใช่แค่อาการปัจจุบัน

### Temperature
- Normal **104-106°F** (สูงกว่าหมาแมว)
- อ.ไม่วัด routine — เสี่ยงโคลก้าบาดเจ็บ

---

## 🤲 Restraint
- ผ้าขนหนูคลุมหัว + จับ **mandibular joint** (TMJ) — กัดไม่ได้
- ⚠️ African Grey 400-500g กัดขาดเหมือนกัดเนย · Macaw หนังหน้า → จับแรง = ช้ำแดง
- Recovery check: ปล่อยกรง → 5 นาทีต้องหายใจปกติ + ขนเรียบ · ถ้านานกว่า = สงสัย respiratory/anemia

---

## 🩸 Blood Collection ⭐⭐
| ตำแหน่ง | ข้อดี | ข้อเสีย |
|---|---|---|
| **Jugular (คอ)** | ปริมาณเยอะ | hematoma มี (ขนคลุม เจ้าของไม่เห็น) |
| **Basilic (ปีก)** | นิยม | hematoma ใต้ปีกขนน้อย → ช้ำ 4-5 วัน |
| **Medial metatarsal (ขา)** | hematoma เห็นยาก | ตำแหน่งหายาก |

### DNA Sexing ⭐⭐
- นกแก้วส่วนใหญ่ sexual monomorphism
- **1 หยดเลือดบนกระดาษกรอง** → ส่งไปรษณีย์ได้
- เพราะ **RBC ของนกมี nucleus** → DNA เยอะมาก (ต่างจาก mammal)

---

## 💉 Anesthesia ⭐⭐

### NPO time ⭐⭐⭐ (HOT EXAM!)
> ⚠️ **อย่า**ใช้ใบสั่งหมาแมว NPO 8-12 hr! นก metabolic สูง → อดนาน = ตาย
- **2-3 ชั่วโมงพอ** · นกเล็กอดสั้น · นกใหญ่อดนานหน่อย

### Drug + Tube
- **Isoflurane** = drug of choice · Sevoflurane แพง ไม่ใช้ routine
- ETT **uncuffed** เท่านั้น (trachea complete ring → cuff = แตก)
- นกเล็กใช้ feeding tube ตัดเอง

---

## 💊 Drug Administration

### IM ⭐
- Pectoral muscle **ส่วนบน** เท่านั้น
- ⚠️ ลึกข้าง = **ปอดทะลุ** · ลึกล่าง = **ตับฉีก** → bleed ตาย

### SC
- Sites: **interscapular** > **inguinal** > axillary
- ⚠️ หนังนกบาง → ต้องเห็น "ลูกโป่งน้ำ" ปูด · ไม่ปูด = ทะลุ
- **Max 5-10 mL/site** (vs หมา 100-200 mL — หนังนกไม่ย้วย)
- ใช้เข็มเล็กสุด G26

### Oral (PO)
- นกแก้ว = ยาน้ำเท่านั้น (กัด → หย่อนเม็ดยาก)
- ยาเม็ด → สงวนสำหรับ **ไก่ เป็ด นกพิราบ raptor**
- ถ้าสำลัก: **ปล่อยมัน!** อย่าจับเช็ด — นกสะบัดหัวออกเอง

---

## 💧 Fluid Therapy
| % Dehydration | Sign |
|---|---|
| 5% | กินน้อย/anorexia |
| 7% | **Basilic vein refill > 2 sec** → ต้องให้ fluid |

> 💡 Glucose-fluid ในนก ≠ contraindicated เหมือนแมว (ไม่ค่อยเกิด abscess)

---

## 🔧 Common Procedures

### Nare Flush ⭐⭐ (sinusitis/rhinitis)
1. **จับนกกลับหัว** (ขาชี้ฟ้า) — MUST!
2. แนบ syringe กับรูจมูก → ฉีด NSS
3. น้ำออก: รูจมูกอีกข้าง + ร่องเพดานปาก
> ⚠️ ไม่กลับหัว → น้ำเข้าหลอดลม → aspiration pneumonia ตาย

### Pin/Blood Feathers ⭐
- ขนยังไม่โต มี blood supply
- หัก → เลือดไหลไม่หยุด (กดไม่ทำงาน, ยาห้ามเลือดไม่ทำงาน)
- 💡 **ถอนทั้งเส้น** + กดที่รูขุมขน → หยุดเลือด

### Wing Clip ⭐⭐
| วิธี | ถูก/ผิด |
|---|---|
| ตัด primary feathers ทั้ง 2 ข้าง 8-10 เส้น จากนอกมาใน | ✅ |
| ตัดเหลือขนปลายปีกนอก 2-3 เส้น (สวย) | ❌ ขนติดซอก → ปีกหัก |
| ตัดข้างเดียว | ❌ บินเฉ → ตกหม้อมาม่าโดนลวก |

จับ humerus (ต้นแขน) อย่าจับ radius/ulna → elbow joint หัก

---

## 📝 Exam Hot Spots
1. ⭐⭐⭐ **Triage visual assessment** — นอนพื้น+ขนพอง = high mortality risk → แจ้งเจ้าของ
2. ⭐⭐⭐ **"นกท้องเสีย" pitfall** — แค่ urate+น้ำ ≠ diarrhea แต่ **นกไม่กิน**
3. ⭐⭐⭐ **NPO = 2-3 hr** (ไม่ใช่ 8-12 hr)
4. ⭐⭐ **Lung auscultate ไม่แม่น** → confirm ด้วย X-ray
5. ⭐⭐ **Keel wasting = chronic** ไม่ใช่ acute
6. ⭐⭐ **ETT uncuffed** (trachea complete ring)
7. ⭐⭐ **DNA sexing**: 1 drop บนกระดาษ · นก RBC มี nucleus
8. ⭐⭐ **Nare flush ต้องจับกลับหัว**
9. ⭐⭐ **IM pectoral upper** (ลึก = ทะลุปอด/ตับ)
10. ⭐⭐ **Wing clip 2 ข้าง · primary feathers · 8-10 เส้น จากนอกมาใน**
11. ⭐ **SC max 5-10 mL/site** + ลูกโป่งน้ำปูด
12. ⭐ **Pin feather หัก → ถอนทั้งเส้น**
13. ⭐ **Body temp 104-106°F**
14. ⭐ **Isoflurane = DOC**

> 💡 "เจาะตรงไหนก็มี hematoma — เพียงแต่เจ้าของเห็นหรือไม่เห็น" → communication > technique`,
  },

  // ─── V9 (อ.ธวัช) Non-infectious Bird Diseases ────────────────
  'izL_CBa697Q': {
    videoId: 'izL_CBa697Q',
    title: '2. โรคไม่ติดเชื้อ',
    subject: 'exotic',
    date: '11 Mar 69',
    durationMin: 86,
    instructor: 'อ.น.สพ.ผศ. ธวัช เล็กดำรงศักดิ์',
    examFormat: 'MCQ + case-based — sign → DDx · history → predisposing cause · Tx (Ca/Vit A/heavy metal/egg bind/crop stasis)',
    summary: `# โรคไม่ติดเชื้อในนก (Non-infectious Diseases)

> 🎯 โรคไม่ติดเชื้อในนก = ผลจาก husbandry/management ผิด · diet+cage+environment ดี → ปัญหาส่วนใหญ่ไม่เกิด

## ⏱️ Timeline
| Time | Topic |
|---|---|
| 27-32 | **Vitamin A deficiency** ⭐ |
| 32-38 | **MBD / Ca deficiency** ⭐⭐ |
| 38-47 | **Heavy metal toxicity** (Pb, Zn) ⭐ |
| 47-59 | **Egg binding / Dystocia** ⭐⭐ |
| 59-71 | **Feather plucking / Self-mutilation** |
| 71-80 | **Crop stasis** + crop burn ⭐ |
| 80-82 | Shock / collapse |
| 82-86 | Abscess + Bumblefoot |

---

## 1. Vitamin A Deficiency ⭐
**กลไก**: Vit A → maintain epithelial integrity (ทุก system ไม่ใช่แค่ตา)
**พบบ่อย**: psittacine ที่กิน **seed-only diet** (ทานตะวัน, millet)

| ระบบ | อาการ |
|---|---|
| Respiratory | **เป็นหวัดบ่อย** (อากาศเปลี่ยนนิดเดียวก็เป็น) |
| Oropharynx | **ตุ่ม/ฝ้าสีขาวในปาก** ⭐ (squamous metaplasia) |
| ผิวหนัง | hyperkeratosis → pododermatitis |

**Tx**: ปรับอาหาร → ผัก/ผลไม้/pellet · เริ่ม Vit A ฉีด/กิน · ⚠️ ระวัง overdose (fat-soluble)

---

## 2. MBD / Ca Deficiency ⭐⭐

### Predisposing diet
| Species | อาหารที่ผิด |
|---|---|
| **Raptor** | **เนื้อหมู/ไก่ล้วน** — ได้ protein แต่ไม่มี Ca/Vit (ใน bone+organ) |
| **Psittacine** | seed-only → **เปลือกไข่บาง + egg bound** |

### Clinical
- **เช้ามาเจอนกนอนแปะพื้น**
- Wing droop (ปีกห้อยข้างเดียว)
- กระดูกหักเอง โดยไม่มี trauma
- **Spinal collapse** กดไขสันหลัง → paralysis
- **"Rubber jaw"** (จงอยปากบิด) ⭐

### Radiograph ⭐
- **Bone cortex บาง** + ความหนาไม่สม่ำเสมอ

### Tx
1. **Ca injection/PO**
2. **Vit D3** (สำคัญในการดูดซึม)
3. **ปรับอาหาร** ⭐ — สำคัญที่สุด ไม่ปรับ → กลับมาเป็นใหม่

---

## 3. Heavy Metal Toxicity ⭐

### 2 metals หลัก
| Metal | แหล่ง |
|---|---|
| **Lead (Pb)** | **ผ้าม่านถ่วงน้ำหนัก, ปลั๊กไฟราคาถูก** (Shopee 20-30 บาท) |
| **Zinc (Zn)** | **ลวดกาวไนซ์** ใน cage นก (galvanized — Zn coating กันสนิม) |

### Clinical signs
- **Urate สีชมพู/แดง** ⭐ (ปกติเขียว-เหลือง + urate ขาว)
- Neurological: seizure, paralysis

### Diagnosis
- **Radiograph** → metallic foreign body ใน GI
- Blood Pb/Zn level (gold std แต่หาแลบยาก ไทย)
- อ. **ไม่แยก Pb vs Zn** — Tx เหมือนกัน

### Tx
- **CaEDTA** chelating (textbook) · หายากในไทย
- **Activated charcoal** — อ.ใช้จริง
- Endoscopic retrieval / surgery ถ้า particle ใหญ่

### Cage prep (ป้องกัน Zn) ⭐
- **ขัดกรงแปรงพลาสติก** (ห้ามลวด)
- **ล้างน้ำส้มสายชู** (กรดอ่อน)
- ก่อนใส่นกเข้ากรงใหม่

---

## 4. Egg Binding / Dystocia ⭐⭐

### พบบ่อย
- นก **< 100 g** (budgie, lovebird, cockatiel)
- Predispose: seed-only, ไข่ติดต่อ 7-8 ฟอง, ฮอร์โมนสูง, แก่/อ้วน

### Clinical
- นั่งหอบ + ขาไม่มีแรง
- รูก้นไม่สะอาด + tissue ตุง (egg/oviduct prolapse)
- **คลำเจอไข่** (อ. dx 80% จากการคลำ)

### Tx cascade ⭐
1. **Stabilize ก่อน** — ตู้ออกซิเจน + warmth + fluid
2. **Ca gluconate + Oxytocin** ⚠️ **Oxytocin ไม่ค่อยเวิร์คในนก** (~2-3 / 50 case)
3. **Manual extraction** — lubricate + saline flush
4. **Percutaneous needle aspiration** ถ้าไข่ลึก
5. **Egg break ≠ disaster** — เปลือก peel ออก → pick out + flush

### Anti-ovulation drug
- ยาคุมเก่า (เลิกใช้ใน mammal เพราะ pyometra)
- ใช้เฉพาะนกที่ไข่ 7-8 ฟองแล้วยังจะไข่ต่อ

---

## 5. Feather Plucking / Self-mutilation

### กฎทอง: **Rule out medical ก่อน behavior** ⭐

### Pattern
| Pattern | สาเหตุ |
|---|---|
| **หัวยังสวย + คอ/อก/ปีกโกร๋น** | Self-pluck |
| **มีรอยที่หัว/หน้า** | Cage-mate aggression |

### Medical DDx ต้อง rule out
1. **Cockatiel ⭐ → Giardia** (abdominal pain → จิกท้อง)
2. **Mites** (ไรลงตัวกลางคืน)
3. PBFD / Polyoma — **PCR**
4. Nutritional (seed-only)
5. **Breeding** — เหยี่ยวจิกขนหน้าอกตัวเองช่วงวางไข่ (ปกติ — ไม่ต้องแก้)

### Tx
- **Elizabethan collar** ถ้าจิกจนแผล
- ขยายกรง + enrichment
- ⚠️ ห้ามสเปรย์น้ำในฤดูฝน → pneumonia

---

## 6. Crop Stasis ⭐

### Normal transit
- Healthy chick: **< 2 hr** (max 3 hr) · ค้าง > 3 hr = pathologic

### Causes
- อาหารร้อน/เย็นเกิน (**ต้องวัดด้วย thermometer** ⭐)
- อาหารข้นเกิน
- Hypothermia (ตู้กกอุณหภูมิไม่พอ)
- Foreign body

### Tx
1. Massage + saline → make liquid → drain
2. Suction ออกด้วย feeding tube
3. **Surgical ingluviotomy** ถ้าเป็นเม็ดแน่น

### Crop Burn ⭐
- จาก **ไมโครเวฟไม่คน** → hot pocket
- เจ้าของบอก "นกมีแผลที่หน้าอก" + "ป้อนแล้วอาหารไหลออกหน้าอก"
- **Pathology**: crop ทะลุไป skin
- **Surgery**: ตัด necrotic + **เย็บแยกชั้น crop กับ skin** (ห้ามเย็บรวบ)

---

## 7. Shock + Abscess

### Shock
- Mucous membrane ซีด (ดู choana — ปกติชมพูเข้ม → กลายเป็นจางเกือบขาว)
- **O₂ + warmth + fluid** · ⚠️ Dexamethasone ไม่แนะนำแล้ว

### Avian Abscess ⭐
- **หนองแข็ง (caseous)** — เจาะไม่ออก!
- **Infraorbital abscess** (รอบตา) — secondary to chronic URI พบบ่อย
- **Tx = surgical opening + culture** · ยาเปล่าไม่หาย

### Bumblefoot
- Cause: perch ขนาดเดียว/ผิดขนาด
- Tx: เปลี่ยนคอนหลายขนาด + soft padding

---

## 📝 Exam Hot Spots
1. **Vit A def** → seed-only psittacine + **white plaque ในปาก** + เป็นหวัดบ่อย
2. **MBD** → raptor+meat-only OR psittacine+seed-only → bone fracture เอง / rubber jaw / wing droop
3. ⭐⭐ **Pink/red urate** = heavy metal toxicity
4. **Pb sources**: ผ้าม่านถ่วงน้ำหนัก, ปลั๊กไฟถูก
5. **Zn sources**: ลวดกาวไนซ์
6. **Heavy metal Tx**: chelating + activated charcoal
7. **Egg bind in นก < 100 g** → คลำได้ + Ca + warmth + manual · **Oxytocin ไม่ค่อยเวิร์ค**
8. **Self-pluck pattern**: หัวสวย+คอ/อกโกร๋น (vs aggression = หัวเป็นแผล)
9. **Cockatiel + feather plucking** ⭐ → screen Giardia
10. **Crop transit < 2 hr** (chick) — > 3 hr = pathologic
11. **Crop burn** ไมโครเวฟไม่คน → surgery แยกชั้น crop+skin
12. **Avian abscess = caseous (แข็ง)** — ต้อง surgical opening · infraorbital พบบ่อย
13. **Cage prep**: galvanized wire ต้องขัด+น้ำส้มสายชู

> 💡 อ.ธวัช: "โรคพวกนี้ส่วนใหญ่ป้องกันได้ถ้า diet+husbandry ถูก — ตอนซักประวัติต้องละเอียด"`,
  },

  // ─── V10 (อ.ธวัช) Bird Infectious Part 1 — Viral ─────────────
  'AxpBGFGGdSg': {
    videoId: 'AxpBGFGGdSg',
    title: '3. โรคติดเชื้อ (ตอน 1) — Viral',
    subject: 'exotic',
    date: '18 Mar 69',
    durationMin: 75,
    instructor: 'อ.น.สพ.ผศ. ธวัช เล็กดำรงศักดิ์',
    examFormat: 'MCQ — viral disease ID จาก clinical sign + lesion · inclusion body location · vaccine availability · PCR certificate validity',
    summary: `# โรคติดเชื้อในนก ตอน 1 — Viral (PBFD/Polyoma/Pacheco/Pox/Papilloma/PDD)

> 🎯 5 โรคไวรัสหลัก + Cloacal papilloma · เน้น **3 โรคที่มี PCR certificate** (PBFD · Polyoma · PDD)

## ⏱️ Timeline
| ช่วง | หัวข้อ |
|---|---|
| 13-18 | Intro · scope |
| 18-37 | **PBFD** (Circovirus) ⭐⭐⭐ |
| 37-46 | **Polyomavirus** ⭐⭐ |
| 46-51 | **Avian Pox** |
| 51-58 | **Pacheco's** (Psittacid Herpesvirus) ⭐ |
| 58-64 | **Cloacal Papilloma** (จริงๆ คือ Herpes!) |
| 64-72 | **PDD / Avian Bornavirus** ⭐ |

---

## 1️⃣ PBFD ⭐⭐⭐
> อ.: "เป็นหมอนกแล้วดูรูป PBFD ไม่ออก เปลี่ยนอาชีพไปทำอย่างอื่นเถอะ"

| Item | Detail |
|---|---|
| **เชื้อ** | **Circovirus** (BFDV) |
| **ความทนทาน** | ทนมากที่สุด → คอนโทรลยาก |
| **Transmission** | ฝุ่นขน · อุจจาระ · feed/water · **vertical via egg** |
| **Incubation** | **≥ 3 สัปดาห์** |
| **Inclusion body** | **Intracytoplasmic** ⭐ (vs Polyoma = intranuclear) |

### 3 รูปแบบ
1. Peracute — ลูกนกตายเลย
2. Acute — feather dystrophy · บางตัวรอด
3. **Chronic** ⭐ — ขนผิดรูป · จงอยปากผิดรูป/หัก/เป็นเงา · ขนหัวร่วงก่อน
   - **ดึงขนเลือดมาดู: รากขนฝ่อ + จุดเลือดออกในก้านขน** → 99.999% PBFD

### Tx ⛔
- **ไม่มี specific treatment**
- ⚠️ อ.เตือน: รพ.บางที่อ้าง "ยากระตุ้นภูมิเคลียร์เชื้อ" → **paper ยืนยันไม่ได้ผล**
- ที่หาย = นกเคลียร์เองได้ (เกิดได้จริง แต่ไม่ใช่จากยา)

### Farm control
- Negative farm = เป็นไปไม่ได้ (อ.: "ทุกฟาร์มใหญ่ในโลกมี")
- **PCR certificate ไว้ใจไม่ได้** ⚠️ — โปรโตคอลจริง: **negative 2 ครั้ง × ห่าง ≥ 90 วัน** · ไม่มีใครทำ

---

## 2️⃣ Polyomavirus ⭐⭐

| Item | Detail |
|---|---|
| **ความทน** | **ไม่ทนเท่า PBFD** → manage ง่ายกว่า |
| **Incubation** | **7–10 วัน** ⭐ (vs PBFD ≥ 3 wks) |
| **Inclusion body** | **Intranuclear** ⭐ |
| **Sensitive species** | Lovebird · นกหงส์หยก · ลูกนก |

### Clinical
- **Acute death + subcutaneous hemorrhage** ⭐⭐ (ปื้นวงๆ ที่เท้า/ลำตัว)
- Nursery ตายเกลื่อน ถ้าใช้อุปกรณ์ร่วมกัน

### Dx + Tx
- **PCR** (รับตรวจคณะ)
- Supportive only — ATB กัน secondary · vit K (ลด hemorrhage)
- ✅ มีวัคซีน recombinant (ไม่มีในไทย commercial)

---

## 3️⃣ Avian Pox

| Item | Detail |
|---|---|
| **Transmission** | **แมลง/ยุงกัด** หรือแผล/เยื่อเมือก |
| **Forms** | Cutaneous + Diphtheritic (มักเป็นทั้งคู่) |
| **Species** | ทุกกลุ่มของนก (ไม่ใช่แค่ไก่/พิราบ) |
| **Inclusion** | **Bollinger bodies (cytoplasmic)** |

### Tx
- Supportive + ATB กัน secondary + antiseptic → หายเอง ~1 เดือน
- ✅ **Fowl pox vaccine** ในไก่/พิราบ · **parrot ไม่มี commercial vaccine**

---

## 4️⃣ Pacheco's Disease (Psittacid Herpesvirus) ⭐

> Herpes property: เคยติด → **latent** · shed ตอน immunosuppress

### Clinical (ไม่ specific!)
- Liver dysfunction → urate เขียว-เหลือง
- ขย่อนอาหาร · อาเจียน · conjunctivitis · sinusitis
- **Acute death**

### Necropsy ⭐
- **ตับโต ขอบมน + necrotic foci + เลือดออกตามอวัยวะ**
- Inclusion = **intranuclear** (ตับ/ไต/ม้าม)

### Tx ⭐⭐
- คณะยังไม่มี PCR สำหรับ Pacheco → **empirical treatment ทันที**
- 💊 **Acyclovir** — โรคไวรัสตัวเดียวในนกที่ **มียาเวิร์คจริง!**
- เคสจริง อ.: flock 7-8 ตัวรอบเคสตาย → ตายเพิ่มแค่ตัวเดียว

---

## 5️⃣ Cloacal Papilloma (จริงๆ Herpes!) ⭐

> ⚠️ **Trick exam**: ชื่อ "papilloma" แต่ **ไม่ได้เกิดจาก papillomavirus** — เป็น **Herpesvirus**!

- รอยโรค: **คล้ายดอกกะหล่ำ** (cauliflower-like) ที่ cloaca
- Species: **Macaw, Amazon** (psittacines)
- **Risk**: นกกลุ่มนี้ incidence **มะเร็งตับ + ตับอ่อน** สูงกว่าปกติ ⭐

### Dx
- **Acetic acid test**: เนื้อปกติชมพู → ทาแล้ว **เปลี่ยนเป็นสีขาว**

### Tx
- ❌ Surgical excision — bleeding มาก
- ✅ **Silver nitrate cauterization** สัปดาห์ละครั้ง × 2-6 wks
- ⚠️ Counsel เจ้าของ: ก้อนยุบได้ แต่อาจกลับมา + เสี่ยงมะเร็งตับ/ตับอ่อนทีหลัง

---

## 6️⃣ PDD (Proventricular Dilatation Disease) ⭐⭐

| Item | Detail |
|---|---|
| **เชื้อ** | **Avian Bornavirus (ABV)** ⭐ |
| **Pathology** | Lymphoplasmacytic ganglioneuritis ใน autonomic NS |

### Clinical ⭐⭐
1. **กินอาหารได้ปกติแต่ผอม** → BCS 1.5/5
2. **เม็ดธัญพืชออกมาในอุจจาระเป็นเม็ดๆ** ⭐ — ย่อยไม่ได้
3. CNS signs: ตัวสั่น โยกเหมือนจะเป็นลม

### Necropsy ⭐
- **Proventriculus ใหญ่จนเต็มช่องท้อง** (ตามชื่อโรค!)

### Dx + Tx
- **PCR** (คณะรับ · accurate มาก — เคยมีเคสแลบอื่น negative 2 ครั้งแต่คณะ positive)
- Diet ย่อยง่าย พลังงานสูง
- มี protocol experimental ที่ดูดีขึ้น แต่ยังไม่ confirmed

---

## 📋 สรุป 3 โรคที่มี PCR cert (สำหรับซื้อ-ขาย)
| โรค | เชื้อ | Inclusion | Tx | Vaccine TH |
|---|---|---|---|---|
| **PBFD** | Circovirus | **Cytoplasmic** ⭐ | ❌ Supportive | ❌ |
| **Polyoma** | Polyomavirus | **Nuclear** | ❌ Supportive | ❌ |
| **PDD** | Bornavirus | — | Diet + experimental | ❌ |
| Pacheco | Herpes | Nuclear | ✅ **Acyclovir** | ❌ |
| Avian Pox | Poxvirus | **Bollinger** (cytoplasmic) | Supportive | ✅ Fowl pox (ไก่/พิราบ) |

---

## 📝 Exam Hot Spots ⭐⭐
1. **PBFD = Circovirus = intracytoplasmic** (vs Polyoma = intranuclear)
2. **Incubation**: PBFD ≥ 3 wks · Polyoma 7-10 d
3. **Polyoma signature**: acute death + **subcut hemorrhage** (ลูกนก/หงส์หยก/lovebird)
4. **PBFD classical**: ขน+จงอยปากผิดรูป + รากขนฝ่อ
5. **Pacheco = Herpes** → **Acyclovir** (ไวรัสตัวเดียวที่ Tx ได้!)
6. **Cloacal "Papilloma" = Herpes** → **Silver nitrate** + เสี่ยงมะเร็งตับ/ตับอ่อน
7. **PDD = Avian Bornavirus** → กินได้แต่ผอม + เม็ดธัญพืชย่อยไม่ได้
8. **PCR cert ไม่ reliable** (ต้อง 2 ครั้ง × 90 วัน)
9. **PBFD negative farm = เป็นไปไม่ได้**
10. **Avian Pox**: เจอในนกทุกกลุ่ม · ติดผ่านยุง

> 💡 "ใบ certificate negative — เชื่อได้แค่วันนั้น · 90 วันต่อมาอาจป่วย"`,
  },

  // ─── V11 (อ.ธวัช) Bird Infectious Part 2 — Bact/Fungal/Proto ──
  'YAVsi8g1VuY': {
    videoId: 'YAVsi8g1VuY',
    title: '4. โรคติดเชื้อ (ตอน 2) — Bacterial / Fungal / Protozoal',
    subject: 'exotic',
    date: '25 Mar 69',
    durationMin: 61,
    instructor: 'อ.น.สพ.ผศ. ธวัช เล็กดำรงศักดิ์',
    examFormat: 'MCQ — drug of choice + duration + zoonosis flag · จับคู่ pathogen ↔ sign ↔ Tx',
    summary: `# โรคติดเชื้อในนก ตอน 2 — Bacterial/Fungal/Protozoal/Parasitic

> 🎯 หัวใจ Final scope — drug of choice + duration ออกข้อสอบทุกปี
> ⚠️ **Chlamydophila = zoonosis** ตัวเดียวในเลคเชอร์นี้ที่คนติดได้!

## ⏱️ Timeline
| ช่วง | หัวข้อ |
|---|---|
| 0-10 | Recap viral + intro bacterial |
| 10-22 | **Chlamydophila psittaci (Psittacosis)** ⭐⭐⭐ |
| 22-30 | Mycoplasma + Avian TB |
| 30-40 | **Candidiasis (fungal)** ⭐⭐ |
| 40-52 | **Protozoa** (Trichomonas/Giardia/Eimeria) ⭐⭐⭐ |
| 52-60 | **Knemidocoptes mites** + Q&A |

---

## 🦠 Bacterial — Chlamydophila psittaci (Psittacosis) ⭐⭐⭐

> ⚠️ **ZOONOSIS!** เจ้าของติดได้ → "Psittacosis fever" / atypical pneumonia
> นี่คือเหตุผลที่ต้องจำ drug+duration ให้แม่น — ป้องกันคนด้วย

### Clinical signs
| ระบบ | อาการ |
|---|---|
| ตา | **Conjunctivitis** + ocular discharge ⭐ |
| Respiratory | Nasal discharge, dyspnea, sinusitis |
| GI | **Green/yellow diarrhea** (biliverdinuria) |
| ทั่วไป | Lethargy, weight loss, ขนฟู |

### Dx
- **PCR** (cloacal/conjunctival swab) — gold standard
- Cytology: elementary bodies (Macchiavello stain)

### Tx ⭐⭐⭐ (ออกข้อสอบทุกปี!)
- 💊 **Doxycycline** = drug of choice
- ⏱️ **Duration: 45 วัน** (4-6 wk) — สั้นกว่านี้ relapse
- เหตุผล: intracellular pathogen
- Alternative: Azithromycin
- ⚠️ Notify owner re: zoonosis precaution

> 💡 Memory hook: "Doxy 45 วัน"

---

## Mycoplasma + Avian TB
- **Mycoplasma**: ไม่มี cell wall → **β-lactam ใช้ไม่ได้!** · Tx = Tylosin/Doxy/Enrofloxacin
- **Avian TB** (M. avium): granuloma · zoonotic ในคน immunocompromise · ไม่นิยมรักษา → euthanasia

---

## 🍄 Fungal — Candidiasis ⭐⭐

### Predisposing ⭐
1. **Long-term broad-spectrum Abx** (kill normal flora)
2. **Hypovitaminosis A** (epithelium ไม่แข็งแรง)
3. **Young birds (parent-fed)**
4. Immunosuppression (PBFD, polyoma)

### Clinical
- **White caseous plaque** ใน oropharynx + crop
- Crop stasis, regurgitation, **"sour crop"** (กลิ่นเปรี้ยว)

### Tx ⭐
- 💊 **Itraconazole** = systemic DOC
- 💊 **Nystatin** PO — topical (ไม่ดูดซึม → เฉพาะใน GI)
- แก้ underlying: หยุด Abx + เสริม Vit A

---

## 🪱 Protozoa ⭐⭐⭐

| โรค | Pathogen | Sign | DOC | Duration |
|---|---|---|---|---|
| **Canker** | Trichomonas | White plaque oropharynx | **Metronidazole** | 5-7d |
| Giardia | Giardia | Diarrhea + feather plucking (cockatiel) | **Metronidazole** | 5-7d |
| Coccidiosis | Eimeria | Bloody/mucoid diarrhea | **Sulfa-TMP** | 5-7d |

### Trichomonas — "Canker / Frounce"
- Host: **นกพิราบ · raptor (frounce) · finch** (frounce ในเหยี่ยวจากกินนกพิราบ)
- **Yellow-white caseous plaque** oropharynx — คล้าย Candida แต่ใหญ่กว่า
- Dx: **wet mount** → motile flagellate

### Giardia
- **Cockatiel** ⭐ = signature species
- อาจมี **feather plucking** + chronic diarrhea
- Dx: fecal direct + zinc sulfate flotation

### Eimeria
- Bloody/mucoid diarrhea
- Dx: fecal flotation → oocyst
- Tx: Sulfa-TMP

> ⚠️ **DDx Canker vs Candida**: wet mount (Trich = motile) vs cytology (Candida = budding yeast)

---

## 🪲 Knemidocoptes mites ⭐

- **Burrowing mite** · **Budgerigar** ⭐ = signature species
- **Scaly face** — honeycomb crust รอบจมูก/ตา/cere
- **Scaly leg / tassel foot** — hyperkeratotic crust ขา
- Beak deformity ถ้านาน

### Tx ⭐
- 💊 **Ivermectin** topical/SC
- ⏱️ **Repeat ทุก 2 สัปดาห์** (ครอบ life cycle)

---

## 💊 Drug Cheatsheet ⭐⭐⭐
| Drug | Indication | Duration |
|---|---|---|
| **Doxycycline** | **Chlamydophila** | **45 วัน** ⭐ |
| Tylosin/Doxy | Mycoplasma | 14-21d |
| **Itraconazole** | Candida systemic | 14-21d |
| Nystatin | Candida topical GI | 7-14d |
| **Metronidazole** | **Trichomonas + Giardia** | 5-7d |
| **Sulfa-TMP** | **Eimeria** | 5-7d |
| **Ivermectin** | **Knemidocoptes** | repeat **q2wk** |

---

## 📝 Exam Hot Spots ⭐⭐⭐
1. **Chlamydophila → Doxycycline 45 วัน** (เลขนี้ออก!)
2. **Chlamydophila = ZOONOSIS** (ตัวเดียวในตอนนี้)
3. **Mycoplasma → ห้ามใช้ β-lactam** (ไม่มี cell wall)
4. **Candida → Itraconazole** (systemic) / **Nystatin** (topical)
5. **Predispose Candida** = long Abx + hypovitaminosis A + young bird
6. **Trichomonas + Giardia → Metronidazole** (จำคู่กัน)
7. **Eimeria → Sulfa-TMP**
8. **Giardia signature = Cockatiel** ⭐
9. **Knemidocoptes signature = Budgerigar** ⭐
10. **Ivermectin q2wk** (life cycle)
11. **Trichomonas dx**: wet mount → motile flagellate
12. **Canker vs Candida** — แยกด้วย cytology

> 💡 อ.: "Psittacine ที่มี conjunctivitis + diarrhea → empirical doxy ก่อนผล PCR · zoonosis รอไม่ได้"`,
  },

  // ─── V12 (อ.เสาวภางค์ ZPOT) Zoo Vet ───────────────────────────
  '4KKnxqEESB0': {
    videoId: '4KKnxqEESB0',
    title: '5. Zoo Vet',
    subject: 'exotic',
    date: '1 Apr 69',
    durationMin: 71,
    instructor: 'อ.สพ.ญ. เสาวภางค์ สนั่นหนู (ZPOT)',
    examFormat: 'MCQ — zoo vet roles · quarantine protocol · IUCN/CITES status · 5 Domains welfare · disease surveillance',
    summary: `# Zoo Vet — สวนสัตว์ & การอนุรักษ์นอกถิ่นอาศัย

> 🦒 อ.หมอใหญ่ จาก **ZPOT** (Zoological Park Organization of Thailand) — Animal Conservation and Research Institute
> ไม่ใช่อาจารย์คณะจุฬาฯ

## What is a Zoo? (พรบ.สงวนและคุ้มครองสัตว์ป่า 2562)
> "Any area where wildlife is kept for **conservation, education, research, or recreation**"
- รัฐ → conservation เป็นหลัก
- เอกชน → education + recreation

---

## Conservation Framework ⭐⭐

### In-situ vs Ex-situ
| Type | Meaning | Who? |
|---|---|---|
| **In-situ** | ในถิ่นอาศัย | กรมอุทยาน (DNP) |
| **Ex-situ** ⭐ | นอกถิ่นอาศัย | **Zoo · ZPOT** |

> นิยาม "อนุรักษ์" ยุคใหม่ = **คงอยู่ + ใช้ประโยชน์ให้มากที่สุด** (ไม่ใช่แค่ห้ามแตะ)

### IUCN Red List ⭐⭐
| Status | Meaning |
|---|---|
| LC | Least Concern |
| NT | Near Threatened |
| **VU** | Vulnerable |
| **EN** | Endangered |
| **CR** | Critically Endangered |
| **EW** | Extinct in the Wild (ยังมีในสวนสัตว์) |
| **EX** | Extinct ⚠️ ไทย = **สมัน** (สูญพันธุ์จากโลก) |

### CITES ⭐
| App | Meaning |
|---|---|
| **App I** | ห้ามค้า (ยกเว้นการศึกษา/แลกเปลี่ยน) |
| **App II** | ค้าได้ มีปริมาณมาก |
| **App III** | ขึ้นกับประเทศเจ้าของ |

> ⚠️ สถานะของชนิดเดียวกัน **ต่างประเทศต่างกัน** เช่น เสือไทย=App I แต่อินเดียอาจไม่ใช่

---

## 4 Roles of Zoo Vet ⭐⭐⭐

### 1. Practitioner — comparative anatomy + species-specific
- **Hippo** = hindgut fermenter (ไม่ใช่ ruminant!)
- **หมี** = Carnivora → ใช้ protocol คล้ายสุนัข
- **เลียงผา** = bovid + **browser** (ไม่ใช่ grazer)

> Grazer (กินหญ้า) vs Browser (กินใบไม้ + fiber สูง)

### 2. Curator — collection plan + welfare design
### 3. Researcher — Reproduction · Genetics · Forensics
- **GRB (Genome Resource Bank / Frozen Zoo)** ⭐ — sperm/oocyte/embryo/fibroblast
### 4. Pathologist — Necropsy → feedback management

---

## Animal Health Management

### Quarantine ⭐⭐ (สำคัญสุด!)
- **30 วัน** · **All in - all out** (เหมือนฟาร์ม)
- ตรวจ 2 จุด: **ก่อนย้าย + ปลายทาง**
- ใบเคลื่อนย้ายขอจาก **กรมปศุสัตว์** (พรบ.โรคระบาดใหม่ครอบสัตว์ป่า)

### Preventive Medicine
- **Vaccine = เชื้อตายเป็นหลัก** ⭐ (ป้องกัน revert/cross-species)
  - CDV → ติดข้ามชนิดในเสือ/สิงโต
  - **Hep B vaccine** ใน great apes ⭐
- Deworming, ป้องกันแมลงพาหะ

### Medical Training (ลด GA stress) ⭐
- Hippo อ้าปาก → ตรวจฟัน
- เสือ → เก็บเลือดจาก **ventral tail vein** (โดยไม่วาง)
- Positive reinforcement

---

## Disease Surveillance ⭐⭐ (Emerging diseases ในไทย)

| โรค | กลุ่มเสี่ยง | หมายเหตุ |
|---|---|---|
| **AHS** ⭐ | ม้า (ม้าลาย=carrier ไม่ตาย, ม้าแข่งตาย) | ก่อนย้ายต้องตรวจ |
| **LSD** | วัวแดง | เคยระบาดในไทย |
| **COVID-19** | Primates · Felidae · Canidae | ตรวจช่วง pandemic |
| **TB (Mycobacterium)** ⭐ | สมเสร็จ + apes + elephant | **ติดจากคนไปสัตว์มากกว่าสัตว์ไปคน** → จัดระยะ |
| **Melioidosis** | อูฐ, จิงโจ้ (ไวมาก) | เชื้ออยู่ในดิน |
| **Chytrid (Bd)** | กบ | ไทยยังไม่เจอ แต่เฝ้าระวัง |
| **Avian Influenza** | นก | ตรวจก่อนเคลื่อนย้าย |

---

## Animal Welfare — 5 Domains ⭐⭐
> เปลี่ยนจาก **5 Freedoms → 5 Domains** (ครอบคลุมขึ้น)

**3C ของ welfare:** **C**omfort · **C**hoice · **C**ontrol

> 💡 "ตู้โทรศัพท์ที่คนเดินรอบตลอดเวลา = สัตว์ใน 360° exhibit" → ต้องมีที่ให้ซ่อน!

### Enclosure Design ⭐
- **2 ส่วน**: front (display) + back (holding/treatment)
- Barriers: wet moat (หมี — ลึก) · dry moat · cage · **electric fence/popsicle cup สำหรับช้าง**

### Enrichment 🎯
| Type | Pros | Cons |
|---|---|---|
| **Food-based** | ทำง่าย ตอบสนองเร็ว | ใช้เวลาสั้น |
| **Non-food** | พฤติกรรมระยะยาว | ทำยากกว่า |

---

## Animal ID ⭐
| สัตว์ | ตำแหน่ง microchip |
|---|---|
| สัตว์เล็ก | subQ ระหว่าง scapula |
| **ช้าง** | **แทงลง** (ไม่ขึ้น เพราะรูใหญ่ chip ไหลออก) |
| **เพนกวิน** | **subQ** (ไม่ใช่ pectoral muscle เหมือนนกอื่น) |
| สัตว์ใหญ่ | หลังหู (ฝั่งซ้าย) |

---

## Reintroduction (ZPOT Success Stories) ⭐
| Species | Status | Note |
|---|---|---|
| ม้าป่า Przewalski | International success | EW → ปล่อยมองโกเลีย |
| **ละมั่งพันธุ์พม่า** | ✅ 30 ปี | ฝูงเพาะพันธุ์ในป่า |
| นกกระเรียนพันธุ์ไทย | สงวน · ปล่อยไป ~186 ตัว | นับนก มี.ค. ทุกปี |
| **พญาแร้ง** ⭐ | EW Thailand (สูญพันธุ์ปี 2535 — ยาเบื่อ 30 ตัวพร้อม) | เริ่มเพาะ → ปล่อยห้วยขาแข้ง · ต้อง ≥10 ตัว |
| วัวแดง | ทำร่วมกรมอุทยาน | ย้ายจากสถานี→ป่า |

---

## 📝 Exam Hot Spots ⭐⭐⭐
1. **Quarantine = 30 วัน · all in - all out**
2. **In-situ (DNP) vs Ex-situ (Zoo/ZPOT)**
3. **IUCN**: LC→NT→VU→EN→CR→**EW**→EX · ไทยมี EX = **สมัน**
4. **CITES App I/II/III** — ขึ้นกับประเทศ (เสือไทย ≠ เสืออินเดีย)
5. **GRB** = frozen zoo (sperm/oocyte/embryo/fibroblast)
6. **Vaccine = เชื้อตายเป็นหลัก** (กัน CDV ติดข้ามชนิด)
7. **Hep B vaccine ใน great apes** ⭐
8. **TB ในสมเสร็จ → คนติดสัตว์** (ไม่ใช่สัตว์ติดคน!)
9. **AHS — ม้าลาย=carrier · ม้าแข่งตาย** → ก่อนย้ายต้องตรวจ
10. **5 Domains** (ไม่ใช่ 5 Freedoms) + **3C** (Comfort/Choice/Control)
11. **Hippo = hindgut fermenter**
12. **Grazer** (หญ้า) vs **Browser** (ใบไม้+fiber)
13. **Microchip ช้าง = แทงลง · เพนกวิน = subQ** (ไม่ใช่ pectoral)
14. **พญาแร้ง EW ปี 2535** (ยาเบื่อ) · **สมัน EX**

> 💡 อ.หมอใหญ่: "งานสวนสัตว์ใช้ DVM 6 ปีคุ้มมาก — รักษา + จัดการ + วิจัย + อนุรักษ์ ครบ loop"`,
  },

  // ─── V13 (อ.ไพศิลป์) Conservation Medicine ───────────────────
  'KjBUKGa6-V4': {
    videoId: 'KjBUKGa6-V4',
    title: '6. Role of vet in conservation medicine',
    subject: 'exotic',
    date: '8 Apr 69',
    durationMin: 70,
    instructor: 'อ. ไพศิลป์ เล็กเจริญ',
    examFormat: 'MCQ concept-based · ecosystem services 4 · 5 vet roles · interface examples · case studies (Gaur/LSD/Rabies/HPAI/Mange/Malaria/Tiger poisoning) · surveillance vs research',
    summary: `# Role of Veterinarian in Conservation Medicine

> **อ.ไพศิลป์ปิดท้าย:** "พี่ออกข้อสอบเอง · อยู่ในเลคเชอร์นี้หมดแหละ" → ฟังจบครบ คือ ครอบคลุมข้อสอบ ⭐

## 🌍 Conservation Medicine คืออะไร?
- **เวชศาสตร์เชิงอนุรักษ์** · interdisciplinary
- ต้องทำงานร่วม นักชีววิทยาสัตว์ป่า / นิเวศวิทยา / public health
- Core = **One Health** (คน+สัตว์+สิ่งแวดล้อม)
- ต่างจาก zoo vet → เน้น **wildlife in nature** ไม่ใช่ captive

---

## 🔄 Body ↔ Ecosystem Analogy ⭐
| Vet Medicine | Conservation Medicine |
|---|---|
| Cell | Species |
| Organ system | Ecosystem |
| Physiology | Ecological process |
| Disease | **Ecosystem disruption / Extinction** |
| Homeostasis | **Biodiversity balance** |

---

## 🤝 4 Interfaces ⭐⭐
| Type | ตัวอย่าง |
|---|---|
| **Ecological** | Species overlap · habitat fragmentation |
| **Epidemiological** | Pathogen transmission · spillover |
| **Human-wildlife** | Conflict · bushmeat · encroachment |
| **Governance** | Wildlife authority + health authority + community |

> 💡 **กระทิง (wildlife) ออกมาใช้พื้นที่ทุ่งวัวเลี้ยง** → wildlife-livestock interface → **LSD spillover**

---

## 🌱 Ecosystem Services 4 ⭐⭐⭐ (อ.ย้ำ "ท่องตาราง")
| Service | ความหมาย | ตัวอย่าง |
|---|---|---|
| **Provisioning** | ผลิตทรัพยากร | อาหาร · น้ำ · ไม้ |
| **Regulating** | ควบคุมกระบวนการ | **Predator regulate host → regulate disease risk** ⭐ |
| **Cultural** | คุณค่าวัฒนธรรม | นกเงือก = flagship |
| **Supporting** | ค้ำจุนระบบ | Forest habitat · soil formation |

> ⭐ **ออกข้อสอบบ่อย**: predator หาย → host เพิ่ม → disease ↑ = **Regulating** (ไม่ใช่ Supporting!)

---

## 💥 5 ภัยคุกคาม Ecosystem ⭐⭐
1. **Land Use Change** — habitat loss + fragmentation
2. **Pollution** — 1 ใน Triple Crisis
3. **Over-exploitation** — ใช้เกิน carrying capacity
4. **Climate Change**
5. **Invasive Species + Disease**

---

## 👨‍⚕️ 5 บทบาทสัตวแพทย์ Conservation ⭐⭐
1. **Wildlife Health & Disease Intelligence** — surveillance · diagnosis · forensic
2. **Conservation Intervention & Mgmt** — population mgmt (translocation)
3. **Human-Wildlife Interface Mgmt** — zoonosis · conflict mitigation
4. **Welfare · Rescue · Rehab · Release** — 4R framework
5. **Research · Policy · Innovation** — camera trap · GPS collar

---

## 🦬 Case Studies (อ.เน้นว่าออกข้อสอบ)

### 1. กระทิงตายที่กุยบุรี (2015) ⭐⭐
- เจอซากตัว 1-2-3 → ทำ **Epidemic Curve**
- Sign: น้ำลายเป็นฟอง + กีบลอก → เหมือน **FMD**
- Sample: FMD virus + **Clostridium novyi** (contamination, ไม่ใช่ primary cause!)
- ⚠️ Lesson: Clostridium = environmental contamination ≠ disease cause
- Intervention: **บ่อจุ่มล้อ** (foot dip)

### 2. LSD ใน Wild Bovids (กระทิง · วัวแดง · เลียงผา)
- เริ่มในวัวเลี้ยง → spread ไปห้วยขาแข้ง · กุยบุรี
- **Reverse spillover** — domestic → wildlife (ไม่ใช่ wild → human)

### 3. Rabies ใน Golden Jackals
- เคสที่ **เลย** + **สระแก้ว** (กระโดดใส่เด็ก)
- ก่อน 2018: focus แค่หมาบ้าน → underdetect wildlife reservoir
- Intervention: GPS collar ตัวปกติ → home range overlap

### 4. HPAI ใน Captive Threatened Carnivores
- เสือขาว Tiger Kingdom กิน **ไก่ดิบ** → ตาย · ปอด red hepatization

### 5. Canine Distemper ใน Civet Farm
- Promote breeding → ลด wildlife exploitation
- เจอ CDV outbreak → linked เสือเชียงใหม่

### 6. Mange ใน Social Carnivores (หมาใน · dhole)
- Empirical: sarcoptic vs demodex
- Trap ตัวปกติได้ · ตัวป่วยจับยาก → diagnostic gap

### 7. Zoonotic Malaria — *P. knowlesi* ⭐
- ราชบุรี · vector = **Anopheles dirus** (ก้นป่อง) · oviposit ในหลุมรากต้นบอนกระดาษ
- Reservoir: ลิง (macaques)

### 8. Tiger Poisoning (Forensic) — เขาแผง · ห้วยขาแข้ง
- เสือ 3 ตัวตายใกล้กัน → toxic intoxication
- Toxin: **Furadan / Carbamate** ผสมในซากเหยื่อ → ล่าหนังโดยไม่เป็นรู

---

## 📡 Surveillance ≠ Research ⭐⭐
| Aspect | **Surveillance** | **Research** |
|---|---|---|
| Goal | Early detection | Hypothesis testing |
| Output | Action-oriented | Publication |
| Duration | **Continuous** | **Time-limited** |
| Use | Decision support | Knowledge generation |

> 💡 **Roadkill = passive surveillance** สำหรับ rabies/AI ใน wildlife

---

## 🐾 Translocation Framework
**Translocation ≠ ปล่อยปลาตามวัด!**
1. Population decline assessment
2. Genetic ID + planning
3. **Health risk assessment**
4. Quarantine + screening
5. **Soft release** (กรงก่อน)
6. **Post-release monitoring** (GPS)

> ตัวอย่าง: **ละมั่ง · พญาแร้ง** กลับห้วยขาแข้ง (สูญพันธุ์ 2534 จาก **diclofenac** ในซากวัว)

---

## 🆘 4R Framework
**Rescue · Rehabilitate · Release · Research**

> ⚠️ **Individual welfare ≠ Population conservation benefit!**
> นกพิราบบาดเจ็บ → ไม่ต้อง rehab (ประชากรอยู่สบาย)
> ช้างสู้กันบาดเจ็บ → อาจไม่ต้องยุ่ง (natural process + ใช้ resource เยอะ)

### เกณฑ์ rehab
- adult mortality เพิ่ม? · small declining population? · **K-selected** (ฟื้นช้า)?
- ห้ามเบียดบัง resource จาก conservation อื่น

---

## 🦠 Disease Spillover
- Domestication → wildlife ↔ livestock ↔ human → **EID**
- **Nipah**: ค้างคาวแม่ไก่ TH มี 20+ ปี · risk communication FAIL → คนพัทยาจะกำจัดค้างคาว

### Diclofenac → Rabies Cascade (Food Web!)
- อินเดีย/บังคลาเทศ: diclofenac → แร้งตาย → ซากเยอะ → หมาจร↑ → **rabies↑**

---

## 📝 Exam Hot Spots ⭐⭐⭐
1. **Ecosystem Services 4** — ท่องให้ได้!
2. **5 บทบาท conservation vet**
3. **Predator regulate disease = Regulating** (ไม่ใช่ Supporting)
4. **5 ภัยคุกคาม** biodiversity
5. **Surveillance vs Research** (continuous vs time-limited)
6. **กระทิงกุยบุรี case** — Clostridium = contamination ไม่ใช่ cause
7. **LSD = reverse spillover** (livestock → wildlife)
8. **P. knowlesi** vector = Anopheles dirus, reservoir = macaque
9. **K-selected species** ควรช่วย rehab > r-selected
10. **Triple Crisis** = biodiversity loss + climate + pollution
11. **Body↔Ecosystem analogy** (cell=species, organ=ecosystem)
12. **4 Interfaces** (Ecological/Epidemiological/Human-wildlife/Governance)
13. **Diclofenac → vulture die-off → rabies cascade**
14. **4R Framework** (Rescue · Rehab · Release · Research)
15. **Translocation ≠ ปล่อยเฉยๆ**

> 💡 อ.ไพศิลป์: "อนาคตไปสายไหน — clinician, นักวิจัย, public health, ฟาร์ม — ก็เกี่ยวข้องกับ conservation medicine"`,
  },

  // ─── V14 (อ.ปัณณวัฒน์) Postgrad Wildlife Course ──────────────
  '-g_IvpY1lTA': {
    videoId: '-g_IvpY1lTA',
    title: '7. Postgraduate Wildlife Course (ทุน/Residency)',
    subject: 'exotic',
    date: '22 Apr 69',
    durationMin: 53,
    instructor: 'อ. ปัณณวัฒน์ สุภาพรรณชาติ',
    examFormat: 'MCQ 7 ข้อ × 5 choices · ออกจากสไลด์ ⭐ 5 สไลด์ · เน้นตารางเปรียบเทียบ + scope 4 + wildlife in nature vs captive + แหล่งทุน',
    summary: `# Postgraduate Wildlife Course — เรียนต่อสายสัตว์ป่า

> 💡 อ.ปัณณวัฒน์: "อ.บอกตรงๆเลยว่าออกอันที่มี ⭐ ในสไลด์ · ท่องตาราง 2 อัน + scope 4 อย่าง + ความต่าง wildlife in nature vs ในสวนสัตว์ + แหล่งทุน"

---

## 1. Career Scope หลังจบ DVM
- **Clinical (รักษา)** → specialty (สูติช้าง, avian)
- **Academic / Lab** → researcher, lab diagnostic (ไม่แตะตัวสัตว์เลย)
- **Researcher** → biology + medicine + hypothesis testing

---

## 2. USA vs EU/AUS — ตารางหลัก ⭐⭐⭐

### Master's Degree
| ประเด็น | **USA** | **EU/AUS** |
|---|---|---|
| **Entrance test** | TOEFL + **GMAT/GRE** ⭐ | **IELTS อย่างเดียว** ⭐ |
| **Duration** | **2 ปี** ⭐ | **1 ปี** ⭐ |
| **Coursework** | Lecture + group/individual + **participation** | Lecture + assignment (ไม่ค่อยมาเรียน, ส่งงานพอ) |
| **Course choice** | Elect ได้ (major/minor) | **Predefined mandatory** ⭐ |

### PhD
| ประเด็น | **USA** | **EU/AUS** |
|---|---|---|
| **Entry path** | จบ **B.S. → PhD ตรง** ⭐ | ต้อง **จบ Master's ก่อน** ⭐ |
| **Duration** | 3.5 – 6-7 ปี | กำหนดชัด |
| **Coursework** | มี basic course 2-3 ปีแรก | **ไม่มี coursework** ⭐ |
| **Topic** | กว้างๆ → uni หา advisor | ต้องมี **topic ชัด** ตามตัว Prof ⭐ |
| **Funding** | TA/RA → stipend ⭐ | UK/Italy = **จ่ายเอง** |
| **Teaching** | ต้องเป็น TA | ไม่ต้อง |
| **Campus** | Big campus (นอกเมือง) | Uni ในเมืองโบราณ |

---

## 3. Wildlife Medicine — 4 Scopes ⭐⭐⭐

| Scope | เน้น |
|---|---|
| **1. Wildlife Medicine** | อายุรศาสตร์สัตว์ป่า · โรค + รักษา |
| **2. One Health** ⭐ | คน-สัตว์-สิ่งแวดล้อม · zoonosis · บูมหลัง COVID |
| **3. Conservation Medicine** ⭐ | อนุรักษ์ · ไม่จำเป็นต้องจบ vet |
| **4. Wildlife Welfare** ⭐ | สวัสดิภาพ + husbandry · ฮิตในม้าแข่ง |

### Conservation Medicine extras
- ART (Assisted Reproductive Technologies): cloning, embryo transfer
- **Conservation Genomics** ⭐ — ฮิตที่สุดตอนนี้
- กฎหมาย National Park, human-wildlife conflict

---

## 4. Wildlife in Nature vs Captive ⭐⭐⭐

| ประเด็น | **Wildlife in Nature** | **Captive (Zoo)** |
|---|---|---|
| **เป้าหมาย** | **ปล่อยคืนธรรมชาติ** ⭐ | อยู่ใน zoo ตลอดชีวิต / breeding |
| **การรักษา** | Herd-based / **husbandry-focused** | จับวางยาสลบ · ฉีดยาเฉพาะตัว |
| **Vaccine** | ไม่ทำ ยกเว้นใกล้สูญพันธุ์ | **ต้องทำเสมอ** |
| **Inbreeding** | ไม่มี | **มี** → vaccine บ่อย |
| **Diet** | ธรรมชาติ | balance + complete diet |
| **Rehab module** ⭐ | **มี** | ไม่ค่อยใช้ |

### Soft vs Hard Release ⭐
- **Hard release** = ปล่อยเลย · ใช้กับสัตว์ที่อยู่ในธรรมชาติอยู่แล้ว (รถชน → รักษาเสร็จปล่อย)
- **Soft release** = monitor 2-6 เดือน + กรงเปิด + ให้อาหาร
  - ตัวอย่าง: ละมั่งพันธุ์พม่า รอบแรก hard release ตายหมด, รอบ 2 soft release รอด

### ⚠ สวนสัตว์ไทย vs ตปท.
- ไทย = พุทธ → เก็บไว้ตลอดชีวิต (หมีหมา, หมีควาย เต็มศูนย์)
- ตปท. = ปล่อยคืนไม่ได้ → **euthanasia**

### Population Control example
- แมวน้ำ Canada/USA: polar bear ลด → seal เกิน → **Open Season ใช้กระบองเหล็ก** ⭐ (ตามกฎหมาย, วิธีอื่นผิด)

---

## 5. Residency Programs ⭐⭐⭐

### USA — **ACZM**
- ต้อง **สอบ license ใหม่** ที่ USA
- 3 ปีขึ้นไป · **3 publications** (case report ก็ได้)
- เว็บไซต์บอก salary, benefit, vacation, case/day

### EU — **ECZM** ⭐⭐ (5 specialty boards)
| Specialty | เน้น |
|---|---|
| **Avian** ⭐ | นก |
| **Herpetological** ⭐ | reptile + amphibian |
| **Wildlife Population Health (WPH)** ⭐ | ประชากร + ปล่อยคืน |
| **Small Mammal** ⭐ | Exotic + small primates |
| **Zoo Health Management (ZHM)** ⭐ | บริหารซู |

- **3 ปี · MAX 6 ปี → terminate**
- **2 papers ใน 2 ปี** + **exam ใน 8 ปี** ⭐
- **Driver's license REQUIRED** ⭐ (ขับเข้าป่า)
- Final = written + practical

---

## 6. Funding Sources ⭐⭐⭐ (ออกแน่!)

### Domestic (ไทย)
| ทุน | รายละเอียด |
|---|---|
| **กพ.** (OCSC) ⭐ | ทุกปี · สาขาขาดแคลน |
| **อานันทมหิดล** (King's Scholarship) ⭐ | เกียรตินิยม 1 · 1 คน/ปี |
| ทุนส่งเสริม ป.โท-เอก | ไม่ใช่ทุนเต็ม · ไป ตปท. 6 เดือน-1 ปี |

### International ⭐⭐⭐ (ท่องคู่ประเทศ — ออกแน่!)
| ทุน | ประเทศ |
|---|---|
| **Fulbright** ⭐ | **USA** |
| **Chevening** ⭐ | **UK** |
| **Erasmus** ⭐ | **EU** |
| **Australia Awards** ⭐ | **Australia** |
| **Monbukagakusho (MEXT)** ⭐ | **Japan** |

---

## 📝 Exam Hot Spots ⭐⭐⭐ (อ.บอกตรงๆ)
> **7 ข้อ × 5 choices · ออกจากสไลด์ ⭐ 5 สไลด์เท่านั้น**

1. **USA = TOEFL + GRE/GMAT, EU/AUS = IELTS เท่านั้น**
2. **PhD: USA จาก B.S. ตรง vs EU ต้องจบ Master's ก่อน**
3. **EU PhD ไม่มี coursework, USA มี basic course 2-3 ปี**
4. **Master's: USA 2 ปี vs EU/AUS 1 ปี**
5. **4 Scopes** = Wildlife Medicine, One Health, Conservation Medicine, Wildlife Welfare
6. **ECZM 5 specialties** = Avian, Herpetological, WPH, Small Mammal, ZHM
7. **ECZM** = 2 papers ใน 2 ปี + exam ใน 8 ปี · MAX 6 ปี · driving license required
8. **ACZM** = สอบ license USA ใหม่ + 3 papers
9. **Funding pairs** ⭐: Fulbright-USA, Chevening-UK, Erasmus-EU, Australia Awards-AUS, Monbukagakusho-Japan, OCSC/King's-Thai
10. **Wildlife in nature** = release goal + husbandry-based · **Captive** = vaccine + treat individual
11. **Soft vs Hard release** — hard=สัตว์ป่าเดิม, soft=monitor 2-6 mo
12. **Salt gland atrophy** ใน penguin captive → release → kidney/gout
13. **Open Season seal** = กระบองเหล็ก only (วิธีอื่นผิดกฎหมาย)
14. **Welfare frameworks**: 5 Freedoms → **Five Domains** (update ใหม่)

> 💡 อ.: "search Google · พิมพ์ scope ที่สนใจ + 'wildlife' จะมี course suggest"`,
  },

  // ─────────────────────────────────────────────────────────────
  // REPRO LECT — Final scope (Lect 15-24) · 5 May 2026 exam
  // ─────────────────────────────────────────────────────────────
  '9piuvH_sdXc': {
    videoId: '9piuvH_sdXc',
    title: '15. Hormonal applications in dogs and cats',
    subject: 'repro-lect',
    date: '6 Mar 69',
    durationMin: 128,
    instructor: 'Aj. Suppawiwat Ponglowhapan (SP) — Theriogenology, Chula Vet',
    examFormat: 'Case-based MCQ + drug class matching · "ออก 2 ล้านข้อ จำไป" Progestin AE',
    summary: `# 15. Hormonal Applications in Dogs and Cats

> 🎯 อ.SP: "ฮอร์โมนในหมาแมวมันไม่เหมือนยาคุมคน · ใช้ผิดช่วง ผิดโดส ผิดสปีชีส์ → AE มหาศาล" · เน้น progestin (นางเอกของบท), aglepristone, deslorelin, PGF2α, cabergoline, oxytocin
> ⚠️ "ยาคุมไม่ใช่ไซยาไนด์ · ใช้ถูกต้องเหมาะสมก็ปลอดภัย · แต่ถ้าไม่ใช่หมอใครจะรู้ว่าเหมาะสม"

---

# 🗺️ Overview — กลุ่มการใช้งาน [3:36]

| กลุ่ม | ตัวอย่าง |
|---|---|
| **A. Contraception** | prevent estrus, prevent pregnancy |
| **B. Reproductive disease** | BPH, pyometra, pseudopregnancy, urinary incontinence, MFH |
| **C. Fertility management** | induce estrus, hypoluteoidism, ovulation induction |
| **D. Diagnostic** | ORS test, cryptorchid test |

# 1️⃣ Progestins (นางเอกของบท) [10:53]

★ **Compound names** (เติม -s = หลายตัว)

| Drug | Form | Note |
|---|---|---|
| **MPA** (Medroxyprogesterone acetate) | IM injection · 50 mg/mL | ★ พระเอกในไทย · ราคาถูก |
| **Megestrol acetate** | tablet | หาได้ยาก |
| **Proligestone** (Covinan) | injection | จดทะเบียนใช้ในหมาแมว · AE น้อยกว่า · เลิกขายในไทย |

## Clinical use #1: Prevention of estrus
- ★★★ **ฉีดในระยะ anestrus เท่านั้น** — [21:18]
- ⛔ ห้ามฉีดในระยะ estrus (estrogen สูง → CEH risk เพิ่ม)
- Dose: **MPA 2.5 mg/kg IM** (สุนัข) · 2 mg/kg (แมว) · ทุก 4-6 เดือน
- ★ ไม่ควรให้ติดต่อกัน > 2 ปี หรือ > 3 injections

> ⛔ **Overdose ที่เจอบ่อย**: 1 ขวด = 1 mL = 50 mg → ถ้าฉีด "1 ขวด/1 ตัว" เหมือนวัคซีน → overdose มาก! · หมา 10 kg dose 2.5 → ใช้แค่ 0.5 mL [33:49]

## ★★★ Progestin Adverse Effects (Q1886) [22:18]

> 🎯 อ.SP: "ออก 2 ล้านข้อ จำไป" · AE จาก long-term/overdose progestin

| AE | Detail |
|---|---|
| **CEH/Pyometra** ★ | progestin กระตุ้น endometrial gland → cystic endometrial hyperplasia |
| **Mammary mass / nodules** ★ | benign mammary mass · long-term use |
| **Diabetes Mellitus** ★ | acromegaly-like effect · GH ↑ → insulin resistance |
| **Mammary Fibroadenomatous Hyperplasia (MFH)** ★★ | ★ ใน cat! · prepubertal female + male cat · ฉีดยาคุมแล้วเต้านมตู้มทั้ง 2 ข้าง [32:15] |
| **Local hair loss + color change** | ฉีด SC → alopecia + เปลี่ยนสีขน → ★ ให้ฉีด IM only [52:06] |
| **Polyphagia · weight gain** | ผลทั่วไป |

> ⛔ **Contraindications** [22:50]:
> 1. ⛔ สัตว์ที่ตั้งท้อง
> 2. ⛔ Prepubertal female cat (→ MFH)
> 3. ⛔ สัตว์อายุ > 5 ปี
> 4. ⛔ Diabetes mellitus
> 5. ⛔ Mammary/ovarian/uterine pathology
> 6. ⛔ ระยะ estrus / proestrus / pseudopregnancy

## ★★ Catastrophic case: ฉีดตอนท้องโดยไม่รู้ [24:24]
1. ฉีด progestin หลังหมาผสม → maintain pregnancy
2. ครบกำหนดคลอด → progesterone exogenous **ยังไม่หมดฤทธิ์** → cervix ไม่เปิด
3. ลูกตาย → **emphysematous fetus** + sepsis → แม่ตาย

> 💡 **ฉีดยาคุมก่อนต้อง pregnancy diagnosis** · U/S ที่ 21-28 วันหลังผสม

# 2️⃣ Aglepristone (P4 Receptor Blocker) [57:19]

★★★ **3 indications (จำให้ได้!)**

| # | Indication | Mechanism |
|---|---|---|
| **1** | Pyometra medical Tx ★★ | block PR → CEH ลด, drainage cervix |
| **2** | Termination of pregnancy ★★ | block PR → abortion |
| **3** | Feline FEH (mammary fibroepithelial hyperplasia) ★ | block PR ที่ mammary → เต้านมยุบใน 10 วัน |

# 3️⃣ Estrogens [59:59]

> ⚠️ ★ "ปัจจุบัน estrogen แทบไม่ใช้แล้ว"

## ⛔ Estrogen Adverse Effects [67:17]
- ★★ **Bone marrow suppression → pancytopenia** (จำให้ได้!)
- Skin: alopecia, hyperpigmentation
- ★ **Squamous metaplasia ใน prostate** ของ male (≠ BPH ของ androgen)
- **Pyometra** (เพิ่ม estrogen → up-regulate PR)

# 5️⃣ Gonadotropins (LH/FSH analogs) [69:56]

| Hormone | Equivalent | Use |
|---|---|---|
| **hCG** | LH-like | induce ovulation, **abdominal cryptorchid Dx** |
| **eCG** | FSH-like | induce estrus |

## ★★ Diagnostic uses
### ORS (Ovarian Remnant Syndrome) [70:58]
1. เจาะเลือด t=0 baseline estradiol → ฉีด gonadotropin → t=1 hr → ถ้า estradiol ↑ = มี ovarian tissue

### Abdominal cryptorchid (dog) [73:06]
1. เจาะเลือด t=0 baseline testosterone → ฉีด **hCG** → t=1 hr → ถ้า testosterone ↑ = testicular tissue

### ★★★ Cat cryptorchid shortcut [73:37]
- **Penile spines = testosterone-dependent**
- 4 weeks หลัง castration → spines หายไป **90%**

# 6️⃣ GnRH Agonists (Deslorelin) [78:20]

★ Drug: **Deslorelin (Suprelorin)** — implant SC · long-term release

## ★★★ Clinical applications

| # | Indication | Mechanism |
|---|---|---|
| **1** | ORS diagnosis | กระตุ้น GnRH → LH/FSH → estradiol |
| **2** | Induce estrus (anestrus) [80:55] | LH/FSH ↑ |
| **3** | BPH | androgen ↓ → prostate ฝ่อ |
| **4** | ★★ Post-spay urinary incontinence [81:58] | LH/FSH ↑ 7-14× post-spay → bladder/urethra LH/FSH receptor |
| **5** | ★ Tom-cat behavior [85:36] | "temporary castration" |

# 7️⃣ PGF2α [86:08]

## Clinical uses
- **Pyometra medical Tx** — สลาย CL → progesterone drop → cervix relaxes
- **Termination of pregnancy** — luteolysis
- **Postpartum metritis**

## ★★★ Dose & Route
- **Dinoprost (PGF2α): 0.025 mg/kg SC** ★★ [89:41]
- ⛔ **ห้าม IM, ห้าม IV**
- AE: Mydriasis, hypersalivation, vomit, panting (~30 นาที)

# 9️⃣ Prolactin Antagonists [91:14]

| Drug | Country | Note |
|---|---|---|
| **Cabergoline** (Galastop) | ตปท. | ★ มี license · ยาน้ำ |
| **Bromocriptine** | ★ มีในไทย | ยาคน Parkinson · 2.5 mg tablet |

## Clinical uses
- **Pseudopregnancy + galactostasis** ★★
- **Lactation suppression**

## ⛔ Side effect
- **★ Vomiting** — ภายใน 30 นาที · Bromocriptine vomit > Cabergoline

# 🎯 ★★★ Exam Hot Spots

1. ★★★ **Progestin AE** (Q1886) — CEH, MFH ในแมว, DM, mammary mass · "ออก 2 ล้านข้อ"
2. ★★★ **Progestin contraindications** — pregnant, prepubertal cat, > 5 yr, DM, estrus
3. ★★★ **Aglepristone 3 uses** — pyometra, abortion, FEH
4. ★★ **MPA dose**: 2.5 mg/kg IM (dog) · 2 mg/kg (cat) · ทุก 4-6 เดือน
5. ★★ **PGF2α**: 0.025 mg/kg **SC only** ⛔ ห้าม IM/IV · AE: mydriasis
6. ★★ **Hypoluteoidism** [48:27]: P4 < 5 ng/mL → MPA 0.1 mg/kg PO sid · หยุด 2 วันก่อน due date
7. ★ **Deslorelin**: post-spay UI, BPH, tom-cat behavior
8. ★ **Cat cryptorchid**: ปลิ้น penis ดู spines · 4 wks หลัง cast spines หายไป 90%
9. ★ **Cabergoline > Bromocriptine** = pseudopregnancy · ★ side effect = vomit
10. ★ **Estrogen AE** = bone marrow suppression / pancytopenia
11. ★★ **Oxytocin** ⛔ contraindicated in **obstructive dystocia**

> 📚 Cross-ref: VetMock Q1886 (Progestin AE), Q1887 (Aglepristone), Q1888 (Oxytocin), Q1889 (Cabergoline)`,
  },

  'q44qQOIMTXk': {
    videoId: 'q44qQOIMTXk',
    title: '17. Preserved Semen & 18. Infertility Problems',
    subject: 'repro-lect',
    date: '13 Mar 69',
    durationMin: 148,
    instructor: 'Aj. Theerawat Tharasanit (TT) — Theriogenology, Chula Vet',
    examFormat: 'Cryobiology concepts + infertility differential dx · cross-refs Q1851-Q1859',
    summary: `# Lect 17 + 18 รวมสองชม. · เน้น concept

อาจารย์ TT [0:35] ลุย 2 พาร์ท: preserve semen + infertility · บอกตรงๆว่า **infertility ยากและวุ่นวายมาก** [1:05] คนทำต้องรู้ basic + normality + abnormality เพราะ abnormality ทุกตัวใน repro = infertility

> ⚠️ **จับ concept ให้ได้ ไม่ต้องจดทุกอย่าง**

---

## 🧊 Part 1 — Semen Preservation [2:07]

### ทำไม sperm cryopreservation success ดีที่สุด?
[3:39] sperm = reproductive cell **เล็กที่สุด** (หัว 3-4 µm) + cytoplasm น้อย · shed proximal droplet ทิ้งแล้ว
- เซลล์ทั่วไปมี water 90% · sperm มีน้อยกว่า → **intracellular ice formation น้อย** → cell damage น้อย
- **Chilled** ไม่เกิด ice (แช่เย็นเฉยๆ) · **Frozen** ถึงเกิด

### Chilled (Short-term) [9:21]
- Dog ~ 2-3 วัน (ใน reproductive tract อยู่ได้ 5-7 วัน)
- Keyword: **ลด metabolism + ลด bacterial growth**

### Frozen (Long-term) [10:21]
- **−196°C (LN₂)** ★ Q1855 — ต่ำกว่า −130°C ถึง eliminate metabolic activity
- ตู้ −20°C / −80°C ไม่พอ
- ตู้เย็นบ้านมี defrost → ทำลายตัวอย่าง

### Extender 1 และ 2 [13:26]
**Uppsala extender** (สวีเดน)
- **Extender 1 = glycerol 3%** · equilibrate **1 ชม. 4°C**
- **Extender 2 = glycerol 7%** · final ~5%
- **อัตราส่วน 1:1 ห้ามผิด** [28:04] — ถ้าใส่ extender 2 มาก → glycerol > 5% → toxic

### CPA — Cryoprotective Agent [12:55]
| ประเภท | ตัวอย่าง | บทบาท |
|---|---|---|
| **Penetrating** | Glycerol, ethylene glycol, DMSO | แทนที่น้ำใน cell → ลด ice |
| **Non-penetrating** | sucrose, trehalose | maintain osmolarity |

### Egg yolk LDL ★ Q1851
- Stabilize sperm membrane จาก cold shock
- โดยเฉพาะใน chilling phase
- ไม่ใส่ glycerol ใน chilled (ไม่เกิด ice) [16:33]

### Vitrification [27:32]
- Ultra-rapid cooling + super-high CPA → skip ice crystal phase
- นิยมใน oocyte/embryo มากกว่า sperm

---

## 🩺 Part 2 — Infertility [38:13]

### Approach 3 factors [46:13]
1. **Female factor** — cycle, hormone, anatomy
2. **Male factor** — semen quality, behavior
3. **Environment + owner** — nutrition, stress, photoperiod

[46:44] Cat = **long-day seasonal breeder** → ห้องมืดสลัว → ovarian activity ลด

### Bitch (Dog Female)
- **Progesterone monitoring** — gold standard
- Frozen semen → ใกล้ maturation (oocyte mature 2-3 วันหลัง ovulation)
- ★ **กฎทอง: 2-3 timed breedings** [115:27]

### Queen (Cat Female) — induced ovulator [195:57]
- 1 mating → ovulation rate ต่ำ
- 3+ matings → ovulation rate สูง
- ~ 20-30% อาจ spontaneous ovulate [199:33]

### Tom (Cat Male) — ALP threshold [137:23]
> 🎯 **cut-off ออกข้อสอบแน่นอน** [139:25]

| ALP level | Interpretation |
|---|---|
| **> 5,000 U/L** | epididymis function ปกติ → **azoospermia จาก testicular failure** |
| **< 5,000 U/L** | blockage / obstruction (สร้างได้แต่ออกไม่ได้) |

> ⚠️ ต้อง dilute ก่อน assay (level สูงมาก เครื่องตรวจไม่ได้)

### Sperm Terminology
| Term | Meaning |
|---|---|
| **Azoospermia** | ไม่มี sperm เลย |
| **Oligozoospermia** | sperm count ต่ำ |
| **Asthenozoospermia** | motility ต่ำ |
| **Teratozoospermia** | morphology ผิดปกติเยอะ |
| **OAT** | Oligo + Astheno + Terato (severe male infertility) |

[133:41] **Motility cutoff = 70%**

### Investigate Azoospermia
1. **Testis นิ่ม/แฟบ** → testicular degeneration
2. **Testis ปกติ** → blockage / retrograde ejaculation
3. **Catheterize bladder** → เจอ sperm = retrograde
4. **ALP test** → bypass test of blockage

### Brucella canis [104:32]
- **Male**: epididymitis, orchitis, abnormal sperm
- **Female**: early embryonic loss, **abortion** (discharge เขียวปนน้ำตาล)
- ★ **Zoonosis**
- Diagnosis: **screening** (antibody, false-positive) → confirm **PCR**

### Herpesvirus [111:48]
- **Latent infection ตลอดชีพ** — eradicate ไม่ได้
- Signs คล้าย Brucella · stress → reactivation

### AMH [141:35]
- **Female**: small antral follicles → indicator **ovarian reserve**
- **Male**: **Sertoli cells** → indicator Sertoli function

---

## 🔗 Cross-ref VetMock Q-bank
- **Q1851** — egg yolk extender (LDL cold-shock)
- **Q1855** — −196°C LN₂
- **Q1856** — oligospermia
- **Q1857** — digital manipulation
- **Q1858, Q1859** — AI dose calculation, hemocytometer math

> 💡 **Take-home**:
> 1. sperm quality perfect ≠ guaranteed pregnancy
> 2. sperm quality poor ≠ no pregnancy (ใช้แค่ 1 ตัว fertilize)
> 3. Unexplained infertility มีจริง`,
  },

  'WF_eMCY5Pqs': {
    videoId: 'WF_eMCY5Pqs',
    title: '19. Conservation and ART (Assisted Reproductive Technology)',
    subject: 'repro-lect',
    date: '20 Mar 69',
    durationMin: 207,
    instructor: 'Aj. Ampika Thongphakdee (AT) — ZPO Wildlife Repro Center',
    examFormat: 'Wildlife conservation + ART pipeline · case-driven · cross-refs Q1820-Q1824, Q1870-Q1873',
    summary: `# Conservation × ART — เทคโนโลยีสืบพันธุ์ในสัตว์ป่า

อาจารย์อัม (รุ่น 61) จาก **องค์การสวนสัตว์แห่งประเทศไทย** (ZPO) — ดูแล 6 สวนสัตว์ + ศูนย์ช้างสุรินทร์

> 🌍 IUCN: **48,000+ species ถูกคุกคาม** · เป้า 2050 ฟื้นฟูความหลากหลายทางชีวภาพ

---

## 🧬 What is ART? [11:00]

> 🎯 **Q1872** ART = **Assisted Reproductive Technology** — เทคโนโลยีช่วยการเจริญพันธ์ ตั้งแต่ basic (preserved semen) → advanced (cloning, stem cells)

---

## 🎯 One Plan Approach [25:30]

| | |
|---|---|
| **Ex-situ** | นอกพื้นที่อาศัย — สวนสัตว์, biobank, frozen zoo |
| **In-situ** | ในพื้นที่ป่า — anti-poaching, habitat protection |

ต้องทำควบคู่ — wildlife conservation + NGO + ภาครัฐ + มหาวิทยาลัย + ชุมชน

### Five Domain Model — Animal Welfare [28:38]
1. **Environment** — habitat ใกล้ธรรมชาติ
2. **Nutrition** — diversity ของอาหาร
3. **Health** — vet care + population management
4. **Behavior** — natural behavior expression
5. **Mental state** — overall wellbeing

---

## 🐯 Wild Felid Teratospermia [112:50]

ใน **clouded leopard / fishing cat / flat-headed cat / marbled cat**:
- **Teratozoospermia** — sperm morphology abnormal สูง
- **Inbreeding depression** — captive population เล็ก
- **Behavioral incompatibility** — ตัวผู้ใหญ่กว่า + ดุมาก → กัดตัวเมียตาย

### Clouded Leopard Hand-rearing [81:25]
- แยกลูกออกจากแม่ตั้งแต่เกิด → hand-raise ให้เชื่อง
- จับคู่ตัวเมีย **อายุมากกว่า** ตัวผู้ → ลด aggression

---

## 🥚 Embryo Development Timeline [127:08]

| Stage | Timing |
|---|---|
| 1-cell → 2-cell | 24 ชม. (cleavage) |
| 4 → 8 → 16 cells | day 2-3 |
| Morula (32+) | day 4-5 |
| **Blastocyst (Q1873)** | **day 7** ★ (มี blastocoel + ICM + trophoblast) |
| Hatching blastocyst | day 8-9 |

> 🎯 **Q1871** Oviduct = **fertilization site + cleavage location**

---

## 🏦 Biobanking — Frozen Zoo [64:20]

เก็บที่ −196°C ใน LN₂ ตั้งแต่ปี 1990
- **Viable cell bank**: sperm, oocyte, embryo, fibroblast (somatic cell)
- พี่อัมเก็บ 12 ปี ละลายมายังใช้ได้ปกติ [67:32]

ประโยชน์:
1. รักษา genetic diversity
2. ลด inbreeding risk
3. ลด disease transmission ระหว่าง mating
4. ลด stress การเคลื่อนย้ายสัตว์
5. แลกเปลี่ยน genetics นานาชาติ

### Painted Terrapin Case [69:09]
น้ำท่วมใต้ตาย → ถ้ามี genome bank ก็ rescue species ได้

---

## 🔬 ART Toolbox

| Tech | Indication |
|---|---|
| **AI** | sperm ปกติ |
| **Laparoscopic AI** | sperm คุณภาพต่ำ → ฉีดเข้าใกล้ oviduct (เสือลายเมฆ 8-10 ล้านตัว/ครั้ง) [91:32] |
| **IVF** | เพิ่มจำนวนลูก/generation |
| **★ ICSI (Q1870)** | sperm 1 ตัวก็พอ — fragile/sexed/biopsy/OAT rescue [154:04] |
| **SCNT (Cloning)** | population เล็กมาก / สัตว์ตายแล้ว |
| **iPSC / Stem cell** | future — ผลิต gametes จาก somatic cell |

### Laparoscopic AI ใน Clouded Leopard [86:49]
1. กระตุ้น eCG → ovulate ด้วย porcine LH (pLH)
2. ส่อง laparoscope → เห็น **CH (corpus hemorrhagicum)** สด
3. catheter ฉีด **8-10 million motile sperm × 10 µl** เข้า **oviduct opening (fimbria)**
4. fecal P4 → 90+ วัน → ลูก 2 ตัว ✓

### Eld's Deer (ละมั่ง) IVF [136:36]
- กระตุ้น follicles → laparoscopic OPU
- IVF in vitro → blastocyst day 7 (~80 cells)
- transfer 11 ตัว → ตั้งท้อง 6 ตัว → ลูก "โรหิสสรัตน์"

---

## 🐺 SCNT Cloning [259:38]

### Black-footed Ferret (อเมริกัน)
- doner cell = somatic cell จาก Smithsonian frozen zoo
- recipient = enucleated oocyte จาก domestic ferret
- electrofusion → activate Ca²⁺ → blastocyst → transfer

ประเภท SCNT:
- **Intra-species** — same species
- **Inter-species** — different species, same genus
- **Inter-generic** — different genus

### Stem Cells [286:38]
- **Embryonic stem cell** จาก ICM blastocyst
- **iPSC** — reprogram fibroblast กลับเป็น stem cell
- Future: ผลิต gametes จาก somatic cell

---

## 🔗 Cross-ref VetMock Q-bank
- **Q1820-Q1824** — ART concepts
- **Q1870** — ICSI for OAT
- **Q1871** — oviduct fertilization site
- **Q1872** — ART definition
- **Q1873** — Day 7 blastocyst (dog)

> 💡 **Take-home**: เทคโนโลยีก้าวไกล แต่ **welfare 5 domains มาก่อน** เสมอ`,
  },

  '6E8Z7p0ufVI': {
    videoId: '6E8Z7p0ufVI',
    title: '20. Reproductive Diseases in Exotic Pets',
    subject: 'repro-lect',
    date: '20 Mar 69',
    durationMin: 201,
    instructor: 'Aj. Chaowaphan Yinharnmingmongkol (CY) — Animal Space Exotic Hospital',
    examFormat: 'Species-by-species clinical · rabbit + guinea pig + ferret + reptile + bird · cross-refs Q1825-Q1829',
    summary: `# Exotic Repro Disease — species by species

พี่อ้อย (Animal Space Exotic Hospital, รุ่น 61) [5:25] เน้น **rabbit + guinea pig** เพราะเจอเยอะที่สุด

> 🐰 **กระต่าย = สัตว์เลี้ยงอันดับ 3 ของไทย**

---

## 🐰 Rabbit — Star

### Reproductive Physiology Quick Facts [13:12]

| Parameter | Value |
|---|---|
| Type | **Induced ovulator** (เหมือน cat) |
| **Gestation** | **~30 วัน** ★ Q1826 |
| **Pseudopregnancy** | **16-18 วัน** ★ |
| Build nest? | **Yes** (altricial young) |
| Litter weaning | ~2 เดือน |

### Pseudopregnancy [10:36]
[16:50] behavior ที่ "ไม่พึงประสงค์":
- **ดึงขนตัวเอง** → กระจายเต็มบ้าน
- เต้านมขยาย + อาจมี milk → mastitis → pain → anorexia → **GI stasis** (admit!)
- 16-18 วัน cycle จะกลับ

### Uterine Adenocarcinoma — โรคเด่นที่สุด ★★★ [27:51]
- **80% ของกระต่ายเพศเมียอายุ > 4 ปี เป็น uterine adenocarcinoma**
- "ต้องทำหมัน" (ไม่ใช่แค่ "ควรทำ")
- Metastasis สู่ **ปอด** เป็นหลัก → **CT > X-ray** sensitivity
- vs. mammary tumor ในกระต่าย แค่ **2%** (ตรงข้ามกับ dog/cat!)

### Hematuria DDx [19:32]
1. **Endometrial venous aneurysm** — ฉี่ใส**ก่อน** แล้วเป็นเลือดสด **แยกกัน** ★
2. **Cystitis / urolithiasis**
3. **Pigmenturia** จาก porphyrin → ฉี่สีแดงเป็นเนื้อเดียว = Normal!
4. ยา / drug-induced

> 🔑 ถามเจ้าของ: "ฉี่กับเลือดเป็นน้ำเดียวกันมั้ย?" → **แยกกัน = aneurysm**

### ASA Score ในกระต่าย [55:29]
| ASA | Risk |
|---|---|
| 1 | 0.7% (vs dog 0.05%) |
| 2 | ~1.5% |
| 3 | 7.3% |
| 4 | 50%+ |

### Castration Approaches [122:21]
| Approach | Pros | Cons |
|---|---|---|
| **Pre-scrotal** | sterile ดี · แผลไม่โดนพื้น | นานกว่า |
| **Scrotal** | เร็วกว่า | แผล 2 จุด · sterile ยาก |
| **Abdominal** | สำหรับ chinchilla | ลึกกว่า |

### Spay (OVH) Precautions [73:46]
- **caudal abdomen approach**
- ⚠️ ระวัง **cecum** ใหญ่มาก
- Ureter cross over เส้นเลือด → ดึง ovary ออกนอกช่องท้องก่อนผูก
- ผูก uterus ใกล้ cervix → กัน **accessory bladder**

---

## 🐹 Guinea Pig

### Ovarian Cyst — โรคเด่น ★ Q1827
- **Female อายุมาก**
- Functional cyst → estrogen excess → **bilateral symmetric alopecia** + behavioral change
- Treatment: OVH หรือ hormonal

### Dystocia [32:26]
- Gestation ~60 วัน
- **Pubic symphysis fuses ตอน 6-7 เดือน**
- ถ้าผสมหลังจากนั้นเป็นครั้งแรก = symphysis ไม่เปิด → **dystocia**

> ⚠️ Best practice: ผสมครั้งแรก **ก่อนอายุ 6 เดือน**

---

## 🦦 Ferret — Estrogen Toxicity ★★ Q1828

ใน **female ferret ที่ไม่ได้ผสมพันธ์ + persistent estrus**:
- estrogen **persistent high** (ไม่มี LH surge → ไม่ ovulate) →
- **Bone marrow suppression** → pancytopenia ★
- **Bilateral symmetric alopecia** ★
- **Vulvar swelling**

### Treatment
- **Spay** (definitive)
- หรือ hCG / GnRH inducer ovulation
- หรือ **deslorelin implant** (suprelorin)
- ถ้า BM suppress → support + transfusion ก่อน

> ⛔ **ห้าม** ปล่อย persistent estrus > 1 เดือน — มี mortality

---

## 🦎 Reptile — Hemipenis Prolapse ★ Q1829

### Acute case (< 24-48 ชม.)
1. **Reduce** — hypertonic dextrose 50% หรือเกลือ → ลดบวม
2. **Replace** — ดันกลับเข้า cloaca
3. Suture cloacal opening (purse-string) ไว้ 5-7 วัน

### Chronic / necrotic case
- **Amputate** — ตัด hemipenis ที่ตายไป
- snake/lizard มี 2 hemipenis แยกกัน → ตัวที่เหลือใช้ผสมพันธ์ได้
- ligate base + transect

### Common causes
breeding stress · dehydration · low calcium · parasites · substrate trauma

---

## 🐦 Bird (สั้นๆ — case-based)

- **Egg binding (dystocia)** — cockatiel, budgie, lovebird → calcium deficiency, oversized egg
- **Cloacal prolapse** — persistent egg-laying behavior
- **Salpingitis** — hormone-suppress (deslorelin) vs spay

---

## 🔗 Cross-ref VetMock Q-bank
- **Q1825** — Rabbit induced ovulator
- **Q1826** — Rabbit gestation 30 days
- **Q1827** — Guinea pig ovarian cyst (older female)
- **Q1828** — Ferret estrogen toxicity (BM suppression + alopecia)
- **Q1829** — Reptile hemipenis prolapse (acute reduce, chronic amputate)

> 💡 **Take-home**: exotic pets เจอบนคลินิก · basic biology + species-specific repro = "10-second answers" ที่เจ้าของคาดหวัง`,
  },

  'jibDxn3Ajsk': {
    videoId: 'jibDxn3Ajsk',
    title: '21. Genetic Considerations in Breeding',
    subject: 'repro-lect',
    date: '27 Mar 69',
    durationMin: 175,
    instructor: 'Aj. Nantapong Kamprasert (NK) — UNE Australia / Roslin Edinburgh',
    examFormat: 'Quantitative genetics applied · concept-heavy · cross-refs Q1830-Q1834',
    summary: `# Quantitative Genetics 101 → BLUP/GBLUP

อาจารย์แบงค์ (นันทพงษ์ คำประเสริฐ) — Vet Sci สงขลาฯ → **MSc + PhD Quantitative Genetics @ University of New England (UNE) Australia** + Roslin Edinburgh, beef cattle breeding specialist

> 💡 [13:30] **"Genetics foundation เหมือนกันหมด"** — ไวรัส, แบคทีเรีย, พืช, สัตว์ · ดีเทลต่าง · concept = ยีน → pass on → next generation

---

## 🧮 The Master Equation — \`P = G + E\` ★ Q1830

[21:01] **สมการพื้นฐาน**

| Symbol | ความหมาย |
|---|---|
| **P** | Phenotype — สิ่งที่ observe ได้ (น้ำนม, น้ำหนัก, สีตา) |
| **G** | Genetic make-up — internal (ครึ่งจากพ่อ ครึ่งจากแม่) |
| **E** | Environment — **ทุกอย่างที่อยู่นอกตัวสัตว์** (อาหาร, อากาศ, treatment, housing, stress) |

> ⚠️ Geneticist mindset: "Environment" = ทุก external factor

[23:06] **Selection = process ที่ improve G ในทิศทางที่ต้องการ** โดย ignore E

---

## 📊 Heritability \`h²\` ★ Q1831

[57:02]

\`\`\`
h² = V_G / V_P
range: 0 → 1
\`\`\`

### Range ใน livestock [60:11]

| Trait | h² |
|---|---|
| Reproduction (conception rate) | **น้อยมาก** (~0.05-0.15) → focus E better |
| Production (milk yield, body weight) | 0.2 - 0.7 |
| Body conformation | 0.3 - 0.5 |
| Human height | **~0.8** |

### Decision rule
- **h² ใกล้ 0** → focus management
- **h² > 0.3** → selection ได้ดี
- **h² > 0.5** → fast genetic gain

---

## 🎯 Types of Selection ★ Q1832 [25:42]

### By effect on population

| Type | Effect on mean | Effect on variance |
|---|---|---|
| **Stabilizing** | คงที่ | **ลด** |
| **Directional** | shift ไปทางใด | คงที่ |
| **Disruptive** | bimodal | **เพิ่ม** |

### By cause
- **Natural selection** — Darwin · pressure จากสิ่งแวดล้อม
- **Artificial selection** = human-made = selective breeding

[104:56] หลัง domestication → **dairy cow** vs **beef cow** แม้เริ่มจาก cattle ตัวเดียวกัน

---

## 🧬 EBV (Estimated Breeding Value) [232:10]

**EBV** (อเมริกาเรียก EPD) = parameter ที่บอก G component

> ใช้เป็น "Breeding catalog" ให้ farmer เลือกพ่อ/แม่พันธุ์

### Process
1. Record phenotype + pedigree
2. Genetic evaluation algorithm (BLUP)
3. EBV per trait per animal
4. Sire/Dam summary catalog → mating decision

---

## 📐 BLUP vs GBLUP ★★ Q1833/Q1834 [241:33]

### BLUP — Best Linear Unbiased Prediction
- **Pedigree-based** (A-matrix)
- Phenotype + pedigree
- ใช้มาตั้งแต่ 1940s

### GBLUP — Genomic BLUP ★
- **Genomic relationship matrix (G-matrix)** จาก SNP markers ทั้ง genome
- ใช้ **DNA markers** ทั้งสายโครโมโซม → relationship แม่นยำกว่า pedigree
- เห็น **Mendelian sampling** — ลูกแฝด clone ก็มี EBV ต่าง
- **Faster genetic gain** — ตรวจ genotype ตั้งแต่ลูกเกิด

\`\`\`
BLUP:    EBV = f(phenotype, pedigree A-matrix)
GBLUP:   GEBV = f(phenotype, pedigree, SNP G-matrix)
\`\`\`

[235:58] genomic sequencing 2003 = $1M, ปัจจุบัน ~$750 → **affordable**

---

## 🔁 Inbreeding Coefficient \`F\` [218:28]

| F value | ความหมาย |
|---|---|
| 0 | ไม่มี inbreeding |
| 0.25 | full-sib mating |
| 0.5 | parent-offspring backcross |
| 1.0 | self-fertilization (พืช) |

### Inbreeding Depression [220:11]
- ทุก ↑0.1 ของ F → milk yield ↓ ~0.3 kg/day (cattle)
- Quantifiable เป็นตัวเลข

> 🛑 **Pure breeds เสี่ยง** — F สูง → recessive disease emerge:
> - **HCM ใน Maine Coon** (MyBPC3 mutation) [7:53] — host professor intro example
> - **Munchkin (MK) cat short-leg** [156:42] — ★ Aj. NK's lecture-specific example · single-allele · MKMK homozygous dominant = lethal in utero (25%)
> - **Hip dysplasia** ใน large breed
> - **PKD** ใน Persian cat

---

## 🐶 Dog/Cat Breeding Application [248:43]

### "Should you breed your pet?"
1. **Companion only** → spay/neuter
2. **Working/herding/guide dog** → functional traits + temperament
3. **Show / private breeder** → breed standard + AKC certification

### Conformation Scoring [259:18]
Scottish Fold มี ideal characteristics checklist · breeder certified ต้อง follow + pedigree ครบ

### โรคทางพันธุกรรมที่ต้องตรวจก่อนผสม
- **Maine Coon HCM** — MyBPC3 mutation test (intro example by host)
- **★ Munchkin (MK) short-leg** — Aj. NK's lecture-specific [156:42] · single dominant allele · lethal homozygous
- **Hip dysplasia** — Labrador, GSD
- **PKD** — Persian cat

---

## 📊 Trait Classification [120:36]

| Type | Characteristic | ตัวอย่าง |
|---|---|---|
| **Qualitative** | discrete, few genes | สีขน, blood type, มี/ไม่มีโรค |
| **Quantitative** | continuous, polygenic | น้ำนม, น้ำหนัก, FCR |

> ใน economic livestock — quantitative traits = profit driver
> ทุก quantitative trait → **normal distribution**

---

## 🔗 Cross-ref VetMock Q-bank
- **Q1830** — P = G + E
- **Q1831** — h² = V_G / V_P
- **Q1832** — Selection types
- **Q1833** — EBV / Breeding value
- **Q1834** — GBLUP (uses **genomic relationship matrix + SNP markers**)

> 💡 **Take-home**:
> 1. P = G + E
> 2. Heritability บอก focus genetic หรือ environment
> 3. **GBLUP > BLUP** เพราะ genomic info จริง
> 4. **Inbreeding** = silent killer ของ pure breeds`,
  },

  'zq5assxVF74': {
    videoId: 'zq5assxVF74',
    title: '22. Surgical Neutering',
    subject: 'repro-lect',
    date: '27 Mar 69',
    durationMin: 207,
    instructor: 'Aj. Sroisuda Chotimanukul (SC) — Theriogenology, Chula Vet',
    examFormat: 'OHE/orchiectomy technique · ligation rules · ORS prevention · cryptorchid',
    summary: `# 22. Surgical Neutering — เทคนิคผ่าตัดทำหมัน

> เลค 3.5 ชม. โดย Aj. SC — เน้น **technique + ข้อควรระวัง** ที่เอาไปใช้จริงในคลินิก/สอบ VCA

---

## 1. Definitions [07:14]

| Term | ความหมาย | เพศ |
|---|---|---|
| **Neutering** | นำ gonad ออก | ทั้ง 2 |
| **Spay** | ตัด ovary + uterus | ♀ |
| **Gonadectomy** | ตัด gonad | ทั้ง 2 |
| **Orchiectomy** | ตัด testis | ♂ |
| **Castration** | ตัด gonad — บ้านเราใช้กับ ♂ | general |
| **OVE** (Ovariectomy) | ตัดแค่รังไข่ — เก็บมดลูก | ♀ |
| **OVH/OHE** | ตัดทั้ง ovary + uterus ★ standard ไทย | ♀ |
| **Hysterectomy** (ovary-sparing) | เก็บรังไข่ ตัดมดลูก | ♀ — ใหม่ตาม WSAVA |
| **Vasectomy** | ตัด vas deferens เก็บ testis | ♂ |

★★ **Standard สัตวแพทยสภาไทย** = OVH (complete) [32:35]

---

## 2. Indications [13:21]

### Therapeutic
- **CEH/Pyometra** → OVH
- **BPH** ตัวผู้
- **Cryptorchid**
- **Neoplasia** (testicular/ovarian/uterine tumor)
- **Vaginal hyperplasia ซ้ำๆ**
- **Diestrus DM** — progesterone-induced [25:13]
- **Alopecia X**

---

## 3. ★★★ OVH Technique [32:35]

### 3.1 Timing — เลือก heat ไหน [33:08]
- ⛔ **proestrus/estrus** — uterus/ovary congestion + edema → bleeding เยอะ
- ⛔ **diestrus** — ตัด progesterone ฉับพลัน → prolactin เด้ง → **pseudopregnancy + mammary** [35:14]
- ✅ **anestrus** — no hormone dominance ปลอดภัยที่สุด

### 3.2 Anatomy [36:20]
- **Ovary** อยู่ caudal to kidney
- ★ **Ovarian bursa**: หมา **คลุม ovary มิด** (complete) · แมวคลุมบางส่วน
- → ในหมา **ต้องเปิด bursa เช็ค** ทุกครั้ง

### 3.3 Position & Incision [47:15]

| Component | Specification |
|---|---|
| Position | **Dorsal recumbency** |
| Incision | **Ventral midline, just caudal to umbilicus** ★ |
| Approach | Linea alba (ดี) / paramedian |

★ VCA exam: ชั้นที่ต้องเย็บแน่นที่สุด = **rectus sheath** (ไม่ใช่ muscle) [52:24]

### 3.4 Step-by-step OVH [54:29]

1. เข้า abdomen → ดัน UB ลงท้าย, ลำไส้ขึ้น → เจอ **uterine body Y-shape ใต้ UB**
2. ★ **ทำข้างขวาก่อน** [57:08] (surgeon ยืนขวา + รังไข่ขวาดึงยากกว่า)
3. ★ **Ligate 2 จุด** (double ligation):
   - **Ovarian pedicle** (ใต้ ovary, ติด kidney)
   - **Proper ligament** (ปลาย uterine horn)
4. **Suture**: monofilament absorbable ★
5. **Knot**: Surgeon's 2-1 หรือ ★ **Modified Miller's knot**
6. ★★ **ห้ามตัดชิดปม** — ตัด ~5 mm ห่างจาก knot
7. ★★ **Double ligation gap ≤ 5 mm** — ห่างเป็นกระเปาะ → **stump pyometra**
8. ★ **เปิด bursa เช็ค ovary** ทั้ง 2 ข้าง — ป้องกัน ORS [80:55]
9. **Cervix**: ตัวเล็ก = double ligation · ตัวใหญ่ = ★ **Transfixation ที่ cervix** (ห้าม transfix ที่ ovarian pedicle!) [65:22]
10. Check bleeding ทั้ง 3 stumps ก่อนปิดแผล

### 3.5 Closure [73:36]
- **Rectus sheath**: long-term absorbable, simple continuous/interrupt
- **Subcutaneous**: ลด dead space
- **Subcuticular**: continuous
- **Skin**: non-absorbable, simple interrupt

---

## 4. OVE vs Sub-total vs Total OHE [40:59]

| Technique | Ovary | Horn | Body | Cervix |
|---|---|---|---|---|
| **OVE** | Remove | Keep | Keep | Keep |
| **Sub-total OVH** | Remove | Remove | Cut at body | Keep |
| **Complete OVH** ★ | Remove | Remove | Remove | Cut at cervix |
| **Hysterectomy** | **Keep** | Remove | Remove | Remove |

---

## 5. Cat OVH — ความต่างจากหมา [91:57]

### 5.1 Position & Incision

| | Dog | Cat |
|---|---|---|
| Position | Dorsal | Dorsal **OR** Lateral |
| Incision | Ventral midline (caudal to umbilicus) | **Mid-point ระหว่าง umbilicus & pubis** ★ **OR** **Flank** |

### 5.2 Flank approach — ★★ Layers ที่ออกสอบ [102:56]
ตำแหน่ง: **mid-point ระหว่าง last rib & iliac crest**, เฉียง 45°

★★★ **VCA exam favorite** — ชั้นกล้ามเนื้อ:
1. **External abdominal oblique**
2. **Internal abdominal oblique + transversus abdominis** ★ (ชั้น 2)
3. Peritoneum

⛔ **trap**: ชั้นใน **ไม่ใช่** rectus abdominis! → คือ **transversus abdominis** [112:11]

### 5.3 Cat-specific cautions [109:08]
- ⛔ **ห้าม clamp uterus/pedicle ก่อนผูกในแมว** — เปราะ ขาดได้
- ⛔ **Right-side preference** — รังไข่ขวาสูงกว่า → **ORS ส่วนใหญ่เกิดข้างขวา** [94:33]

---

## 6. ★★★ ORS — Ovarian Remnant Syndrome [128:14]

### Cross-ref VetMock Qs (Aj. SC's signature topic ★)

| Q | Topic | Answer |
|---|---|---|
| **Q1874** | ORS definition + timing | 1-2 ปีหลังทำหมัน |
| **Q1875** | Cause #1 | **Surgical error** |
| **Q1876** | Galactopoiesis post-spay | **Pseudopregnancy** |
| **Q1877** | Tx of choice | **Surgical removal** |
| **Q1878** | Brown-red discharge OVH dog | **Cervical stump infection** |
| **Q1879** | Hormone dx | **AMH** |
| **Q1880** | Surgical approach | **Caudal midline laparotomy** |

### Diagnosis Workflow

| Method | Note |
|---|---|
| **History** | first — ทำหมันแล้วยังเป็น heat |
| **Vaginal cytology** | ต้องอยู่ในระยะ heat |
| **Ultrasound** | จำกัดที่ remnant ขนาด |
| **★★ AMH** ★ Q1879 | **Most specific** — Sertoli/granulosa cells เท่านั้นที่ผลิต |
| **Progesterone** | luteal phase >0.5 ng/ml |

### Treatment Q1877+1880 [151:59]
- **Surgical removal** via **★ caudal midline laparotomy**
- ส่ง histopath ทุกเคส

---

## 7. ★★ Q1878 — Cervical Stump Infection [128:14]

หมา OVH 2 เดือน → **brown-red discharge** → ★ **Stump pyometra**

★★ **Predisposing factor = ORS** ★ — ★ **ต้อง rule out ORS ก่อนเสมอ**

---

## 8. Hydroureter — Cervix Ligation Complication [125:42]

⛔ ผูก cervix ลึกเกิน → bite **ureter** → hydronephrosis · ค่าไตขึ้นหลังผ่า
✅ Prevention: ยก UB เช็ค ureter ก่อนผูก cervix ทุกครั้ง

---

## 9. Male — Dog Castration [153:29]

### 9.1 Closed vs Open [154:31]

| | Closed | Open |
|---|---|---|
| Tunica vaginalis | ★ ไม่กรีด | กรีดเปิด |
| Ligation | ผูก cord ทั้งก้อน | ★ ผูกแยก vessels vs vas |
| Indication | ★ **Standard** | Giant breed / cord ใหญ่ |
| Bleeding risk | สูงกว่าถ้า cord ใหญ่ | ต่ำกว่า |

### 9.2 Step-by-step Closed dog castration [161:13]

| Step | Detail |
|---|---|
| Position | **Dorsal recumbency** |
| ★★ **Incision** | **Pre-scrotal** ★★ — ดัน testis ขึ้นเป็น "เขียงรอง" |
| Pop testis | กรีดผ่าน skin → fascia → tunica vaginalis (ไม่เปิด!) |
| Spermatic cord | Clamp → **double ligation** → ตัด |
| Side 2 | ★ กรีดผ่านรู edge เดิม (ไม่กรีด skin ใหม่!) [171:41] |
| Closure | ★ Bite **3 fascia layers** — ★ ระวังอย่าปัก urethra ตรงกลาง [177:20] |

⛔ **Real complication**: bite urethra → urine leak จากแผล

### 9.3 ★ ตำแหน่ง incision สรุป

| Species | Incision |
|---|---|
| **Dog** ★ | **Pre-scrotal** ★★ |
| **Cat** ★ | **Scrotal** ★★ |

---

## 10. Cat Castration [183:38]

- Position: **Ventral recumbency** (ที่จุฬา)
- Incision: **Scrotal**
- ★★ **Closure**: ★ **ไม่เย็บ** — ปล่อยให้แผลปิดเอง [186:12]
- **Epididymectomy** (gonad-sparing): สะกิดเปลือก → ดึงเฉพาะ epididymis [188:50]

---

## 11. Cryptorchid Management [189:21]

### Timing
- Inguinal canal ปิดที่ ~6 เดือน
- ★ **Diagnose → รอ 1 ปี**

### Approach

| Location | Approach |
|---|---|
| **Inguinal cryptorchid** | กรีด skin ตรง inguinal → testis pop up → closed castration |
| **Abdominal cryptorchid** | ★ **Laparotomy** — testis **ไม่มี tunica vaginalis** → ★ **open technique** |

### Why castrate?
1. **Testicular tumor risk** สูง (Sertoli cell tumor)
2. **Testicular torsion**
3. **Genetic transmission**

---

## 12. Complications

### OVH/OHE [124:11]
1. **Bleeding** — knot สลิป
2. **Hydroureter / hydronephrosis**
3. **Stump pyometra** ★ (predisposed by ORS)
4. ★★ **ORS** — predominantly right side

### Castration [193:29]
1. **Bleeding** → scrotal hematoma
2. **Funiculitis (champignon/scirrhous cord)**
3. **Urethral injury**

---

## 13. Antibiotics [194:31]

- ★ Healthy + sterile = clean surgery → **ไม่จำเป็น ABx**
- Prophylaxis: **Cefazolin (1st-gen) IV ก่อนผ่า 1 dose**

---

## 14. Pediatric Neutering [196:33]

### Definition
**WSAVA**: 6-16 weeks (~6 wk - 4 mo)

### Pros
✅ Technique ง่ายกว่า · Recovery เร็ว · Surgery time สั้น

### Cautions
⛔ **NPO < 4 hrs** (hypoglycemia)
⛔ Long-term: USMI, growth plate, neoplasia

---

## ★★★ TL;DR — Top 10

1. **Standard ไทย = OVH** ตัดถึง cervix
2. **Anestrus = best timing**
3. **Dorsal recumbency + Ventral midline + just caudal to umbilicus** (dog adult)
4. **Double ligation gap ≤ 5 mm** กันกระเปาะ
5. **เปิด ovarian bursa เช็ค** ทุกครั้ง (หมา)
6. **Transfix = at cervix only**
7. **Cat flank layers**: ext oblique → int oblique + **transversus** (ไม่ใช่ rectus!)
8. **★★★ ORS predominant on right side** · Tx = caudal midline + AMH dx
9. **Dog = pre-scrotal**, **Cat = scrotal + no closure**
10. **Cryptorchid abdominal = open technique** (ไม่มี tunica vaginalis)`,
  },

  'JSD9HlA4PRA': {
    videoId: 'JSD9HlA4PRA',
    title: '23. Risk Benefit Assessment of Gonadectomy',
    subject: 'repro-lect',
    date: '4 Apr 69',
    durationMin: 172,
    instructor: 'Aj. Sroisuda Chotimanukul (SC) — Theriogenology, Chula Vet',
    examFormat: 'MCQ + clinical scenario · breed/sex/age recall heavy',
    summary: `# Lect 23 — Risk-Benefit Assessment of Gonadectomy

> "การทำหมันไม่ใช่ขาวกับดำ" — Aj. SC ★
> ต้อง **ชั่งน้ำหนัก** health benefit vs negative effect เป็น individual case

WSAVA 2024 guideline summarized — ข้อสอบเน้น **breed-specific risk** + **sex-specific risk** + **age at neuter**

---

## 1. Health Benefits [04:00-77:00]

| ระบบ | โรคที่ป้องกัน | เพศ | หลักฐาน |
|---|---|---|---|
| Ovary | Ovarian cyst, tumor | ♀ | ชัด 100% |
| Uterus | Pyometra, CEH | ♀ | OVH = best Tx pyometra |
| Mammary | **Mammary tumor** ★ | ♀ | depend on timing |
| Vagina | Vaginal hyperplasia/prolapse | ♀ | depend on estrogen |
| Prostate | **BPH**, prostatitis, abscess | ♂ | ชัด |
| Testis | Testicular tumor | ♂ | ชัด |
| Anal | Perianal gland adenoma | ♂ intact | ลดได้ |
| STD | TVT (Transmissible Venereal Tumor) | ♂♀ | 100% prevent |
| Endocrine | Diestrus DM | ♀ | ตัด P4 source |

### 1.1 Mammary Tumor — Predisposing breeds ★★ [10:44]

> 🎯 **Q1881** — Aj. SC: "**จำไปให้หมด**"

**Breeds**:
- Springer Spaniel
- Cocker Spaniel
- Boxer
- Poodle
- Dachshund

Timing:
- ทำก่อน heat 1 → ลด ~99.5%
- ทำหลัง heat 1 → ลดน้อยลง
- หลัง heat 3 → ลดน้อยมาก

### 1.2 BPH — Predisposing breeds [61:51]

> 🎯 **Q1882** (past paper canonical)

**Breeds (per past paper / Q1882)**:
- **Doberman**
- **Rottweiler**
- **German Shepherd**
- **Labrador Retriever**

> ⚠️ **Lecture transcript variant** [61:51]: Aj. SC (4 Apr 2026) said "Doberman / Rottweiler / **Rhodesian Ridgeback** / Labrador" instead of GSD. May be year-specific update or auto-transcript mishearing of "Shepherd". **Stick with past paper for exam · know both for safety.**

> สุนัข intact ♂ อายุ >5 → BPH risk **55-60%**
> แนะนำ: U/S prostate ตรวจประจำปีในตัวผู้ที่ไม่ทำหมัน

### 1.3 Other male prostate notes
- Prostatic carcinoma = **ไม่ depend on hormone** → ทำหมันไม่ลด adenocarcinoma (อาจเพิ่ม!) [16:01]
- Perineal hernia → ผ่าตัด + **castrate ร่วมด้วย** ลด recurrence [68:08]

---

## 2. Negative Effects [78:00-141:00]

### 2.1 MCT (Mast Cell Tumor) [114:17] ★ Q1883

> **Female ทำหมัน → develop MCT มากกว่า male**

| Factor | OR / detail |
|---|---|
| Female (gonadectomized) | **2.6×** ★ ตัวที่ **>10 kg** vs ตัวที่ **<10 kg** [114:17] |
| Age | >7 ปี |
| Body weight | >10 kg → เสี่ยงเพิ่ม 2.6× |
| Breeds | **GR, Lab, Boxer, Pug, GSD** |

### 2.2 USMI ★★ Q1884 [121:30]

> "หลีกเลี่ยงไม่ได้" — Aj. SC
> **Focus เฉพาะตัวเมีย** (♂ แทบไม่เจอ)

| Risk factor | Detail |
|---|---|
| เพศ | **ตัวเมียเท่านั้น** |
| BW | **>20 kg (หรือ >25 kg)** |
| Age at neuter | **<3-6 เดือน → risk สูงที่สุด** |
| Breed | German Shepherd, Boxer, Doberman |
| Tail | หางสั้น |

Pathogenesis: post-neuter LH สูง → bind LH receptor ที่ urethral sphincter → control ปัสสาวะไม่ได้

> Incidence: **3-20%** ของตัวเมียที่ทำหมัน

### 2.3 Springer Spaniel post-neuter aggression ★★ Q1885 [138:14]

> ★★ **CRITICAL FACT** — Aj. SC ชอบถามตรงนี้

ทฤษฎีเดิม: castration → ลด aggression
แต่ใน **Springer Spaniel** กลับ **เพิ่ม aggression** หลังทำหมัน — ★ **aggression ต่อเจ้าของ** (ไม่ใช่ต่อหมาด้วยกัน)

### 2.4 Osteosarcoma [116:24]

> **Male, large/giant breed, early gonadectomy** → risk ↑

- **Focus เพศผู้** (incident male > female)
- Predisposing: large/giant (Rott, GSD, GR, Lab)
- ยิ่งทำหมันเร็ว → risk ยิ่งสูง

### 2.5 Hemangiosarcoma [119:59]

> **Female ทำหมัน อายุ >12 เดือน** → risk ↑

ตรงข้ามกับ lymphoma · HSA = late-age neuter ในตัวเมีย เพิ่ม

### 2.6 Lymphoma [117:55]

- Breed: **Australian Shepherd, Golden Retriever**
- Risk ↑ ในตัวเมียที่ทำหมัน **early (<puberty)**

### 2.7 TCC [115:20]

| Factor | Detail |
|---|---|
| เพศ | **Female** |
| Age | **>5-6 ปี** |
| Body | **อ้วน** |
| Breed | **Scottish Terrier** ★ |

### 2.8 Orthopedic disease [125:43]

> **Large/giant breed + neuter <12 mo** → hip dysplasia, CCL rupture
> **<6-7 mo** → risk เพิ่ม **2 เท่า**

Key: ⛔ **ไม่ทำหมันสุนัขใหญ่/ยักษ์ก่อน 6 เดือน** [128:18]

Special: **Dachshund** — เล็ก แต่ neuter เร็ว → IVDD ↑

---

## 3. Pediatric Gonadectomy ★ [141:53]

### Definition
**6-16 weeks**

### Pros
- Population control (shelters)

### Cons
- **Delayed growth plate closure** → epiphyseal fracture
- **Vulva เล็ก** → recessed vulva → perivulvar dermatitis, recurrent UTI
- **Vaginitis ค้างถาวร**
- **USMI risk ↑↑**
- **Penis เล็ก** (secondary characteristic ไม่พัฒนา)

> **Conclusion**: ไม่ recommend ใน owned pet — ยกเว้น shelter

---

## 4. Cat Section (สั้น สบายใจ) [148:39]

### ข้อดี (= dog)
- Reproductive disease
- Pyometra, CEH
- **Mammary tumor** — ★ **ทำก่อน 8-24 mo** = protective; **>24 mo = ไม่ protective**
  - Breed: Siamese, Oriental
  - >80-90% เป็น **adenocarcinoma malignant**

### ข้อเสีย (น้อยกว่าหมา)
- Obesity (♂ เป็นหลัก)
- LUTD: เถียงกันอยู่
- ★ Urethral diameter ไม่เปลี่ยน

**Pediatric ในแมว**: ★ **ทำได้ 3-4 เดือน** — recommend

---

## 5. Decision Framework — Aj. SC Final Rule ★

> **"ไม่ depend on benefit เดี่ยวอันใดอันหนึ่ง"** [165:54]

ต้องพิจารณา:
1. Species
2. Sex
3. Breed
4. Age + maturity
5. Lifestyle
6. Medical indication
7. Owner concern

### WSAVA 2024 Update
- **Large/giant breed**: ไม่ทำก่อน **18 เดือน**
- **Male dogs**: ทำเฉพาะ **medical indication** เท่านั้น
- **Female large breed**: ไม่ก่อน 18 mo
- **GnRH implant** (deslorelin) — reversible option

---

## 6. ★★★ Quick Recall (น่าจะออกข้อสอบ)

| Disease | Sex focus | Predisposing breeds | Age effect |
|---|---|---|---|
| Mammary tumor | ♀ | Springer/Cocker/Boxer/Poodle/Dachshund | early protective |
| BPH | ♂ intact | Doberman/Rott/GSD/Lab | age >5 |
| MCT | ♀ neutered | GR/Lab/Boxer/Pug/GSD | >7 yr, BW high |
| USMI | ♀ | GSD/Boxer/Doberman | <3-6 mo + BW>20 kg |
| Springer aggression | ♂ neutered | **Springer Spaniel** | post-neuter |
| Osteosarcoma | ♂ | large/giant | early ↑ |
| Hemangiosarcoma | ♀ | — | **>12 mo** ↑ |
| Lymphoma | ♀ early | Australian Shep/GR | early <puberty ↑ |
| TCC | ♀ obese | Scottish Terrier | >6 yr |

---

## 7. Cross-ref VetMock Q-bank

- **Q1881** — Mammary tumor breeds (Springer/Cocker/Boxer/Poodle/Dachshund)
- **Q1882** — BPH breeds (Doberman/Rottweiler/GSD/Lab)
- **Q1883** — MCT factors (♀ 2.6×, GR/Lab/Boxer/Pug/GSD)
- **Q1884** — USMI predisposing
- **Q1885** — Springer Spaniel post-neuter aggression ★

---

## 8. Aj. SC Killer Quotes

> "Springer Spaniel ทำหมันแล้วก้าวร้าวกับเจ้าของมากขึ้น" [138:14]
> "Mammary breeds จำให้หมด" [10:44]
> "USMI โฟกัสตัวเมีย ตัวผู้ตัดทิ้งได้เลย" [121:30]
> "ไม่แนะนำ large/giant ก่อน 6 เดือน" [128:18]
> "Pediatric ในแมว 3-4 เดือน — recommend"`,
  },

  'zPgMJzPumXk': {
    videoId: 'zPgMJzPumXk',
    title: '24. Ultrasound Reproductive in the Dog and Cat',
    subject: 'repro-lect',
    date: '10 Apr 69',
    durationMin: 116,
    instructor: 'Aj. Suppawiwat Ponglowhapan (SP) — Theriogenology, Chula Vet',
    examFormat: 'Image-based MCQ · day-by-day timeline · HR thresholds',
    summary: `# Lect 24 — Ultrasound Reproductive in the Dog and Cat

> "Imaging = ทำยังไงก็ได้ให้ตาเราเห็นข้างใน — สัตว์ยังไม่ตายตาเรามองไม่เห็น" — Aj. SP [03:04]

U/S = **first-line tool** สำหรับระบบสืบพันธุ์ · safe (sound wave ≠ X-ray) · early detection (D14-18 หลังตกไข่)

---

## 1. Anatomy & Landmark Strategy [05:14]

### Female reproductive tract
รังไข่ → uterine horn → bifurcation → body of uterus → cervix → vagina → vestibule

### หลักสำคัญ — หา **landmark ก่อน**

| Target | Landmark | Why |
|---|---|---|
| Ovary | **Caudal pole of kidney** | ovary เล็ก หายาก |
| Uterus | **Urinary bladder (UB)** | UB หาง่ายที่สุด |
| Cervix | ระหว่าง body of uterus กับ neck of UB | ตำแหน่ง consistent |

### Male
- **Prostate**: ขอบหน้า pubic bone
- **Cat prostate**: ใน intrapelvic 100% → trans-rectal เท่านั้น
- ★ **Mediastinum testis**: เส้น **hyperechoic** ตรงกลาง = **NORMAL** (ไม่ใช่ pathology!)
- **Full bladder ช่วย locate prostate** ★

---

## 2. Pregnancy Diagnosis ★★ [13:01]

### 4 วิธีตรวจท้อง
1. Abdominal palpation
2. **X-ray** — นับลูก (เห็นกระดูก) + วัด pelvis
3. **Ultrasound** — earliest detection + viability + development
4. **Relaxin** ตรวจฮอร์โมน — ~21 วัน post-ovulation

### ★★★ Timeline Day-by-day (MUST KNOW)

| Day post-LH/ovulation | สิ่งที่เห็น |
|---|---|
| D14-16 (cat) / D16-18 (dog) | Gestational sac — ถุงกลม 3-5 mm |
| **D20-22** | **First sign U/S — gestational sac ชัด** ★ |
| D21+ | **Fetal heartbeat** เริ่มเห็น [54:00] |
| D28 | เห็นเป็นตัวมีหัว |
| D35 | Spine + ribs + limbs |
| **D38-43** | **Fetal sex determination ใน CAT** ★ |
| D45+ | กระดูก calcify เห็นชัดบน X-ray |
| **D55-58** | **Fetal sex determination ใน DOG** ★★ Q1890 |
| D58 | Dental + claw mineralization (last) |

### Bone ossification order ★
"Big bones first, small bones last"
1. Skull, spine
2. Ribs
3. Tibia, scapula, humerus, femur
4. Teeth, claws

---

## 3. ทำไมต้องตรวจท้อง? [38:00]

7 คำถามเจ้าของอยากรู้:
1. ท้อง / ไม่ท้อง
2. **จำนวนลูก** — high-risk if เยอะ หรือ **single pup syndrome**
3. **อายุครรภ์** → predict วันคลอด
4. **Viability** — heart rate, movement
5. **Normal development**
6. **Sex**
7. **Plan C-section** (French Bulldog, English Bulldog, Boston, Pekingese)

---

## 4. ★★★ Fetal Heart Rate Thresholds [66:22]

> **CRITICAL — น่าจะออกข้อสอบ**

| FHR (bpm) | Status | Action |
|---|---|---|
| **>220** | **Normal** ★ [66:22] (ลูกเต้น 2× ของแม่ ~110) | Monitor |
| 180-220 | Mildly low | Monitor closely |
| **<180** (near term) | **Distress** ★ [66:53] | Discuss C-section |
| **<150** | **Critical** † | Immediate intervention |

† **<150 threshold** = textbook reference (Davidson/Lopate) — not stated in this lecture's audio. Lecture-grounded answer: rely on >220 + <180.

> [67:26] "<180 ใน 6-7 wk → ไม่ผ่า ปล่อยให้ครบเทอม · <180 near term → ผ่าคลอด"

---

## 5. Female Disease — U/S findings [42:00]

### 5.1 Pyometra (closed cervix)
> "หลอดที่ขดมาเจอกันในพื้นที่จำกัดของช่องท้อง — เห็นเป็นรังผึ้ง"

- Anechoic to hypoechoic fluid in uterine lumen
- Dilated coiled tubular structure
- Hyperechoic septae

### 5.2 CEH [85:00]
- **Cystic structures** within thickened endometrial wall
- Round anechoic spaces ~4-5 mm

### 5.3 Open-cervix pyometra [89:00]
- Fluid + endometrial hyperplasia
- ของเหลวข้างในไม่เยอะเท่า closed
- Discharge from vulva

### 5.4 Mucometra / Hydrometra
- Fluid-filled uterus, no clinical sign
- เขียน "fluid-filled tubular structure" ก่อน suggest

### 5.5 Ovarian cyst vs follicle [92:00]

| | Follicle (normal) | Cyst |
|---|---|---|
| Size | ≤5-6 mm (small) / ≤9 mm (large) | **>1 cm persistent** |
| Cycle | proestrus | prolonged proestrus (>6 wks) |

> Follicular cyst → estrogen เรื่อย → bone marrow suppression, pancytopenia

### 5.6 Ovarian tumor
- Mass lateral ของ kidney
- ต้องแยกจาก adrenal mass

### 5.7 Postpartum complications
- **Subinvolution of placental sites**: bloody discharge >6 weeks postpartum
- **Postpartum metritis**: thickened wall + intraluminal fluid

---

## 6. Male Disease — U/S findings

### 6.1 BPH — **Prostate-to-aorta ratio** ★

| Ratio | Interpretation |
|---|---|
| Normal | small ratio |
| BPH | uniformly enlarged, symmetric, hyperechoic |
| Prostatitis | mixed echogenicity, irregular |
| Abscess | anechoic pocket |
| Carcinoma | irregular, asymmetric, mineralization |

### 6.2 Testicular tumor
- Sertoli cell tumor: hypoechoic mass
- ★ **Mediastinum testis = hyperechoic line ตรงกลาง = NORMAL** (ห้ามรายงานเป็น tumor!)

---

## 7. Fetal Biometry [149:00]

### Inner Chorionic Cavity (ICC)
- Early (D20-30) — ตอนถุงกลม

### Biparietal Diameter (BPD)
- Late (>D30) — วัด skull
- **ซ้ายไปขวา** (left ear → right ear)

### Formulas
- Separate per **size** (small/medium/large/giant)
- ใช้ **น้ำหนักแม่ก่อนตั้งท้อง** (ไม่ใช่หลังท้อง)
- Accuracy: ±2 days = 93% (ICC early), 85% (BPD)

### Differentiate dog vs cat placenta on U/S [136:00]
- **Dog**: green pigment (uteroverdin) at edges
- **Cat**: ไม่เขียว

---

## 8. Fetal Sex Determination ★★ Q1890 [70:36]

| Feature | Male | Female |
|---|---|---|
| Genital tubercle | Just caudal to **umbilicus** (ventral) | Just ventral to **tail base** |
| Shape | Linear/echogenic line | **Cone-shaped/triangular** |
| Scrotal sac | Visible later | N/A |

### Optimal window — DIFFERENT BY SPECIES ★
- **Dog**: **D55-58 onwards** ★
- **Cat**: **D38-43 (mid-gestation)** ★ (near-term น้ำคร่ำน้อย ดูยาก)

### Accuracy
- 100% if 2 pups + good window
- ↓ accuracy with crowding (5+ pups)

---

## 9. Fetal Abnormality [165:00]

### Hydrocephalus
- เจอตั้งแต่ D7-8 weeks (~D45-55)
- **Dome-shaped skull**
- มักเจอใน Chihuahua, Pug
- Anechoic fluid in ventricles
- Prognosis: poor

### Anasarca (generalized edema) [171:00]
- เจอใน English Bulldog, Westie, Sheltie
- Pleural effusion + ascites + SC fluid
- มักไม่รอด

> [175:00] "ถ้าเจอตั้งแต่ตั้งท้อง บอกเจ้าของก่อน — เจ้าของไม่โทษว่าเราให้น้ำเกลือเร็วไป"

---

## 10. Recording Convention ★ [42:00]

> "เขียนแบบที่ตาเห็น — ห้ามด่วนสรุปเป็นโรค" — Aj. SP

ขั้นตอน:
1. **Describe**: shape, size (cm/mm), echogenicity, location
2. **Quantify**: thickness, diameter, count
3. **Suggest** at the end (not diagnose) — "suggestive of..."
4. **Clinician** is the one who diagnoses

---

## 11. Cross-ref VetMock Q-bank
- **Q1845-1849** — Pregnancy U/S findings
- **Q1890** — Day 55-58 sex determination (dog)

---

## 12. ★★★ Aj. SP Pearls (Quick Recall)

1. **First U/S sign of pregnancy = gestational sac at D20-22**
2. **Fetal HR**: >220 normal · <180 distress · <150 critical
3. **Sex determination**: dog D55-58 · cat D38-43
4. **Mediastinum testis = hyperechoic line = NORMAL**
5. **Cervix landmark** = ระหว่าง body of uterus กับ neck of UB
6. **Full bladder helps locate prostate**
7. **Dog placenta = green edge** (uteroverdin); cat = ไม่เขียว
8. **Skull bones first to ossify, teeth/claws last**
9. **>5 pups = high count error** บน U/S
10. **เขียนตามที่ตาเห็น — ไม่ด่วนสรุปโรค**`,
  },

  // ═══ Poultry + Cliapprum Final scope (12 lectures · added 2026-05-03) ═══
  'jd9eTltQy8g': {
  videoId: 'jd9eTltQy8g',
  title: 'Avian Zoonosis (L10)',
  subject: 'poultry',
  date: '7 Apr 69',
  durationMin: 72,
  instructor: 'Aj. Kamonpan Charoenkul (Vet Public Health, CU) — L10',
  examFormat: 'fill-in / MCQ — table-based exam (Disease × Bird species × Bird signs × Human signs); ออกสอบทุกปี เติมคำง่ายๆ',
  summary: `# L10 — Avian Zoonosis · Aj. Kamonpan Charoenkul

## Intro & Scope [4:22-7:01]

Aj. เปิดคาบบอกชัดเลย "**ข้อสอบเติมคำง่ายๆ ที่สุดถือว่าเป็นคะแนนช่วยของวิชานี้**" [4:22] — แต่ตอนท้ายย้ำอีกรอบว่า **"หน้าสุดท้ายเป็นข้อสอบทุกปี เติมคำ อาการในคน/อาการในสัตว์/เป็นเชื้ออะไร/โฮสตหลักคืออะไร"** [69:43-70:15] ★

**ช่องทางแพร่ zoonosis (3 ทาง)** [5:26]: direct contact (สัมผัสสัตว์เลี้ยง นกแก้ว) · indirect (สิ่งคัดหลั่ง/ปนเปื้อนของเล่น) · **vector-borne** (ยุง·เห็บ·หมัด·ไร).

**Bird population 3 กลุ่ม** [5:57]: (1) **Pet birds** = นกแก้ว/หงส์หยก (2) **Backyard** = เป็ด·ไก่หลังบ้าน — Aj. แซวสว.นโยบายให้เลี้ยงไก่ 2 ตัวเอาไข่กิน [6:29] (3) **Wild bird** = นกอพยพ.

โรคแบ่ง 3 กลุ่ม: **Bacteria · Fungi · Virus**. คาบนี้ครอบ ~11 โรค.

---

## 1. Chlamydiosis / Psittacosis (ไข้หวัดนกแก้ว) [7:01-20:32]

- เชื้อ: ***Chlamydophila psittaci*** [7:31] · obligate **intracellular** bacteria [13:11]
- โฮสตหลัก: **psittacine birds** (นกแก้ว · macaw · cockatiel) อาการรุนแรง / ในไก่อาการเบา [7:31]
- แพร่ในนก: direct, **airborne** (ละอองขนฝุ่น) [8:33], oral, **vertical** (แม่→ลูก), vector
- เชื้อทนสิ่งแวดล้อมได้นาน [9:34]
- **2 strains**: low virulent (mortality 1-4% · ซึม·เบื่ออาหาร·อึเขียว) vs **virulent (~30% mortality)** [9:34-10:05]
- อาการนก: respiratory + enteric · severe → systemic **pericarditis · airsacculitis** · ตาบวมเป็นถุงน้ำ · ตายใน 1-2 วัน · ★ **อึเขียวเหลือง** = typical sign [10:37]
- ไทยเจอ ~7.8% ในนก (PCR) [11:07]
- **อาการคน** [12:09]: asymptomatic ก็ได้ → mild flu (ไข้·ปวดเมื่อย·conjunctivitis·arthritis) → severe **systemic pneumonia · endocarditis · myocarditis · encephalitis** · เคยมีรายงานเสียชีวิต ★
- IP ~2 weeks [13:11]
- **Tx: tetracycline / doxycycline** [13:11] (intracellular)
- **Human-to-human transmission ได้** ผ่านทางเดินหายใจ — เคยระบาดในรพ. (Scotland·Sweden) [14:46-15:46] · เคสจีนโรงเชือดเป็ด 8 คน + secondary/tertiary wave ในญาติ·บุคลากร [15:46-17:21] ★
- **ไทย ก.พ. ปีที่แล้ว มีเคสคนติดจากหงส์หยก** — เลี้ยง 19 ตัว ตาย 11 → คนปวดเมื่อย ไข้ [17:51-18:53]
- คำแนะนำกรมควบคุมโรค: กักนกใหม่ 30 วัน · ใส่ถุงมือ·หน้ากากตอนล้างกรง · อากาศถ่ายเท · สังเกตอึ·ไข้เจ้าของ [19:28-20:32]

---

## 2. Erysipelas [20:32-25:42]

- เชื้อ: ***Erysipelothrix rhusiopathiae*** · **Gram-positive** [21:02]
- ★ **อยู่ในดิน** เป็นหลัก
- **มีวัคซีน** (ไม่กันติด แต่ลดความรุนแรง · unvaccinated mortality 40-50%) [21:35]
- โฮสต susceptible: **ไก่งวง · เป็ด · ห่าน** ★ — โดยเฉพาะไก่งวงอายุเยอะ [21:35-22:08]
- แพร่: direct contact ผ่านบาดแผล · **insemination** · oral · vector [22:08-22:39]
- เชื้อ shed ทุก secretion (อึ·ปัสสาวะ·nasal) · ทนสิ่งแวดล้อม [22:39-23:11]
- อาการ: **ไก่งวง = peracute death** หงอน·งวงแดงบวม [23:11] · ไก่ทั่วไป = ซึม·ท้องเสีย·ตาย/chronic · ผ่าซากเจอ pericarditis · ตับโต [23:41]
- Dx: impression smear (Gram+) · PCR [24:11]
- Tx: **penicillin · erythromycin** + วัคซีน
- **อาการคน 3 แบบ** [24:11-25:12]: (1) **Localized cutaneous** = ติดที่บาดแผล รอยโรครูปวงตัว E ตรงกลางเข้ม ★ (2) **Diffuse cutaneous** กระจายผิวหนัง (3) **Septicemic / endocarditis** ในคนภูมิอ่อนแอ
- กลุ่มเสี่ยง: สัตวแพทย์·คนงานโรงเชือด

---

## 3. Avian Tuberculosis [25:42-29:21]

- เชื้อ: ***Mycobacterium avium complex (MAC)*** [25:42]
- โฮสต: นกทุกชนิด · ติดได้ทุก mammal (W life ด้วย)
- ★ **เจอในไก่หลังบ้าน·สัตว์อายุเยอะ** — **ไม่ค่อยเจอในฟาร์ม** เพราะฟาร์ม cycle เร็ว ไก่ไม่ได้อยู่นานพอที่ Mycobacterium ก่อโรค (chronic disease) [26:12-26:45]
- อาการนก: chronic · น้ำหนักลด · ผอมแกร็น · ไข่รด · ตาย → ผ่าซากเจอ **granulomatous tubercles/ถุงหนอง** [27:16-27:48]
- Dx: ผ่าซาก · **acid-fast stain อึ** · culture · PCR [27:48]
- **คน = non-TB Mycobacterium** [27:48] · 3 อาการ: (1) internal organ infection (2) **chronic pulmonary** (3) **lymphadenitis** [28:20]
- ★ **มัก dื้อยา TB ปกติ** [28:50]
- **ไทยภาคอีสาน prevalence ~17%** [29:21]

---

## 4. Salmonellosis [29:21-35:06]

- ***Salmonella*** spp. · Gram-negative [29:21]
- โฮสต: หลาย species + **reptiles** (เน้นมาก)
- ★ ก่อโรคในสัตว์ปีกอายุน้อย · adult เป็น **carrier** [29:53-30:25]
- 2 serovar ก่อโรคในนกแต่ไม่ทำในคน: **S. Pullorum · S. Gallinarum** [30:25] (vertical transmission)
- ★ **2 serovar ก่อ foodborne ในคน: S. Enteritidis & S. Typhimurium** [30:58]
- คน: foodborne · จะเรียนละเอียดปี 5
- Cycle: ไก่ → egg/ลูก → environment → vector (หนู·แมลงวัน) → คน [31:28]
- ★ **ปัญหาในไข่ดิบ** (US/EU) [31:59]
- **Farm-to-table outbreak control** ทุก step [32:30] — เนื้อหารายละเอียดปี 5
- ★ Salmonella ที่ไม่ทำให้คนป่วย ก็ยังสำคัญเพราะ **ส่งผ่าน AMR genes** สู่คน [33:32]
- CDC guideline: **ล้าง · แยก · ผ่านความร้อน · แช่เย็น** [33:32-34:03]
- บทบาทสัตวแพทย์: ลำดับเข้าโรงเชือด — **ฟาร์ม Salmonella+ ต้องเข้าทีหลัง** เพื่อลด cross-contamination [34:33-35:06] ★

---

## 5. Campylobacteriosis [35:06-37:12]

- ***Campylobacter jejuni*** · Gram-negative [35:38]
- ★ **ในไก่/wild bird ไม่ก่อโรค** แต่ shed → คน
- **คน: foodborne · ไข้·ท้องเสีย** [36:09]
- Cycle: shed อึ → ลูก → environment
- Control: feed additives · vaccine · slaughter (water wash · UV light) [36:39-37:12]
- เนื้อหาเรียนเยอะปี 5

---

## 6. Yersiniosis [37:12-38:14]

- เชื้อ ***Yersinia*** 2 ตัว [37:12]
- ★ เจอใน **wild bird** > ฟาร์มไก่
- สัตว์ปีกไม่แสดงอาการ
- ★ **คน: ปวดท้องรุนแรง คล้ายไส้ติ่งอักเสบ (appendicitis-like)** [37:43] · faecal-oral

---

## 7. Q Fever [38:14-39:49]

- ***Coxiella burnetii*** [38:14]
- ★ **โฮสตหลัก = วัว** (น้ำนม·placenta) — สัตว์ปีก = secondary host (นกพิราบ·domestic birds) [38:47]
- คน: asymptomatic / mild flu (ไข้·ไอ·จาม) → severe → **pneumonia · hepatitis** [39:19]
- กลุ่มเสี่ยง: คนช่วยทำคลอดวัว/แมว/หมา (มือเปล่า) [39:49]

---

## 8. Cryptococcosis [39:49-42:28]

- ***Cryptococcus neoformans*** [40:22]
- ★ **ไม่ติดตรงจากนก** — ติดจาก **environmental contamination** (ดิน·เศษใบไม้ชื้น) [40:22]
- ★ **กลุ่มนกพิราบเป็น carrier** อึออกมา → คนสูดสปอเข้าไป
- ★ Aj. เน้นแยกกับ **Sporothrix** = ติดตรงจากแมว · Crypto **ไม่ติดตรงจากแมว** [40:52] (มัก confuse)
- คน: ติดเข้าปอด · skin · CNS · ★ ติดเมื่อภูมิดรอป·เครียด
- เจอ Southeast Asia · Africa
- Tx: ยาฆ่าเชื้อรา 6 เดือน+ (criteria ไม่ออกสอบ) [42:28]

---

## 9. Newcastle Disease (NDV) [42:28-45:34]

- ★ **เป็น zoonosis ได้!** [44:02] · **ข้อสอบ VCA หลอกบ่อย** — คนมักติ๊ก "ไม่ติดคน" แต่จริง = ติดได้ ★★
- 2 strains: low virulent (respiratory · ไข่รด) vs **velogenic** (mortality สูง · CNS·GIT) [43:31]
- คน: ★ **ส่วนใหญ่ทำให้เกิด conjunctivitis (เยื่อบุตาอักเสบ)** ไข้อ่อนๆ ~1 อาทิตย์ [44:32]
- ★ **ติดตอนทำวัคซีน** = วัคซีนกระเด็นเข้าตา [44:32] · หรือ respiratory/contaminated food
- ไม่มียาจำเพาะ · supportive
- กลุ่มเสี่ยง: **คนทำวัคซีน** → ใส่ mask · ถุงมือ · eye protection [45:34]

---

## 10. West Nile Virus (WNV) [45:34-48:13]

- กลุ่ม encephalitis virus · ★ **vector = ยุง** (Culex) [46:05]
- **Susceptible host = อีกา (crow), terrestrial bird** [46:05]
- อาการนก: อ่อนแรง · convulsion · ตัวสั่น · ★ **ตาบอด** [46:35]
- Cycle: bird ↔ mosquito → **dead-end host = ม้า·คน** [47:11] (Aj. ถามนิยาม dead-end = ไม่แพร่ต่อ ไม่ได้แปลว่าตาย ★)
- ★ ระบาด US·EU · ไม่มีวัคซีนคน
- คน: 20% develop อาการ — ไข้·อาเจียน·ท้องเสีย · severe → **encephalitis/meningitis** [47:41]
- ป้องกัน: surveillance ยุง · ป้องกันยุงกัด

---

## 11. Avian Influenza (AI) [48:13-67:35]

★ ส่วนยาวที่สุด — Aj. เน้นเป็นพิเศษ

**Subtypes**: Influenza A · RNA virus · **HA 16 subtypes · NA 9 subtypes** [49:15-49:45]
- ★ **Zoonotic subtypes**: H5, H7, H9 (จากสัตว์ปีก) · H1, H3 (จากหมู·สุนัข) [49:45-50:18]
- ★ **Aquatic birds = sentinel host** ติดได้ทุก subtype + แพร่ทั้งสัตว์เลี้ยงลูก/avian [52:25]

**Genetic change** [52:56-53:28]:
- 8 segments → **antigenic shift** (รวมกับไวรัสอีกตัว = virus ใหม่)
- **Antigenic drift** (copy error)

**LPAI vs HPAI** [54:29-55:32]:
- LPAI = mild · low zoonotic risk
- ★ **HPAI = H5, H7** = high mortality · zoonotic ★

**H5N1 history** [55:32-58:36]:
- ระบาด ปี 2540 (2003) — ไก่ไทยตาย ~60 ล้านตัว · คนติด 17 ตาย 12 (~70% mortality) — ทั่วโลก ~300 case [57:04-58:06]
- น่ากลัวพอกับโควิด แต่ human-to-human ติดยาก [58:36]
- ★ **2024-25 กลับมา** — กัมพูชาต้นปีนี้ติด ~9 คน · เพื่อนบ้านลาว·เวียดนามเจอแล้ว [56:03]
- 2003-2022: Egypt 359 · Vietnam 127 · Indonesia top เคส [60:14]
- ไทยเป็น white spot บนแผนที่ — ไม่ใช่ไม่มี แต่ไม่รายงาน [59:09]

**Subtypes มากกว่า H5N1**: H5N6, H5N8, H7N9, H9N2 — ทุกตัวเคยติดคน [60:45-61:15]

**Zoo cats indicator** [61:15-63:24] ★:
- ★ **ฟูล่า (felidae) ที่กินไก่ดิบ** = sentinel · ฟาร์มคัดไก่ไม่สวย → ส่งสวนสัตว์เลี้ยงเสือ → เสือตาย = warning sign HPAI
- ข่าวเสือตาย "Distemper" — เคยสงสัย AI [62:20] (ปกติ 2 ฟาร์มคนละที่ → กังวลเรื่องอาหาร)
- ปรุงสุก = ปลอดภัย (RNA virus ตาย)

**Live bird markets** [66:32-67:35] ★:
- ตลาดคลองเตย / พม่าตลาดสด · มิกซ์ไก่หลายฟาร์ม → mixing vessel
- พม่ามี H9N2 report ล่าสุด

**Triangle of disease control** [67:35-69:43] ★:
1. **Host** — early detection · screening
2. **Agent** — antigenic change → ลดเชื้อ · disinfectant · biosecurity
3. **Environment** — farm management · vector control · quarantine new birds

---

## ★ Exam Preparation [69:43-70:15]

★★ **Aj. ย้ำชัด: หน้าสุดท้าย = ข้อสอบทุกปี เติมคำง่ายๆ — ปีนี้อาจเติมมากกว่านี้** เตรียมละเอียด:
- อาการในคน
- อาการในสัตว์
- เป็นเชื้ออะไร (รา·แบคทีเรีย·ไวรัส)
- โฮสต์หลัก

★ จุดเสี่ยงพลาดที่ Aj. เน้น:
- ★ **NDV ติดคนได้** (ข้อสอบ VCA หลอก)
- ★ **Crypto ไม่ติดตรงจากแมว** (สับสนกับ Sporothrix)
- ★ Salmonella **S. Enteritidis + S. Typhimurium** = foodborne คน · **S. Pullorum + Gallinarum** = ในนก
- ★ Erysipelas **โฮสต = ไก่งวง·เป็ด·ห่าน** + รอยโรคคนรูปวงตัว E
- ★ AI **HPAI = H5/H7** + dead-end host concept
- ★ Q fever **โฮสตหลักวัว** (ไม่ใช่นก)
- ★ Avian TB **non-TB · ดื้อยา TB ปกติ**
- ★ Yersinia = ★ **appendicitis-like** ในคน
- ★ WNV vector = **ยุง Culex** · sentinel = **อีกา**

Cross-ref VetMock Q1785-1790, Q1825-1826`
},
'MuvMzjceQa8': {
  videoId: 'MuvMzjceQa8',
  title: 'Biosecurity & Disease Surveillance (L11)',
  subject: 'poultry',
  date: '17 Mar 69',
  durationMin: 117,
  instructor: 'Aj. Nataya/ณทยา เจริญวิศาล (ผศ.สพ.ญ.ดร.) — L11',
  examFormat: 'MCQ + fill-in — mortality threshold / Se-Sp / sample collection / HenHoused vs HenDay',
  summary: `# L11 — Biosecurity & Surveillance · Aj. Nataya

วิชานี้รวบ 2 ครั้งเป็น 1 (เพราะวันอังคารตรงวันหยุด) → ครั้งแรก **Biosecurity + ป้องกัน/ควบคุม/กำจัดโรค** · ครั้งที่ 2 **การประเมิน + เฝ้าระวัง** [0:13–1:14]

## 1. Epidemiology Triad — เน้น Environment [3:49–5:22]
- Host · Agent · Environment — ปี 4 เน้น **Environment** (จัดสิ่งแวดล้อมยังไงให้เชื้อโรค-ไก่ไม่เจอกัน) ปี 5 (Avian Med) จะเน้น Agent
- Environment factors: อุณหภูมิ · ความชื้น · อากาศ · วัสดุรองนอน · **ความหนาแน่น** · น้ำ/อาหาร · การจัดการ → ลด stress (cortisol↓ → immunity↑)

## 2. ความรู้พื้นฐาน 5 ข้อก่อน Biosecurity [6:23–13:09]
1. **Disease classification** — by organ / mode of transmission / shedding
2. **Disease progression** — เชื้อสัมผัส≠ติดเชื้อ · ติด≠ป่วย · ป่วยช่วง clinical (สีฟ้า) อาจ shed มา 1 สัปดาห์แล้ว → diagnosis ขึ้นกับ timing
3. **Disease transmission** — Horizontal Direct (contact/aerosol/droplet) · Horizontal Indirect (น้ำ-อาหาร-คน-รองเท้า-ยานพาหนะ-นกธรรมชาติ) · **Vertical** (พ่อแม่→ลูก)
4. **Flock immunity** — ฝูงไม่มีภูมิ R0=2 → ระบาดทั้งฝูง · ฝูงมีภูมิ 50% → แพร่ 1/2 ตัวเท่านั้น · ขึ้นกับ contact rate (density · social structure · vector)
5. **Prevalence vs Incidence** — Prevalence = เคสเก่า+ใหม่ในช่วงเวลา (ไม่นับตาย/หาย) · Incidence = **เคสใหม่เท่านั้น**
6. **Prevention vs Eradication** — โรครุนแรง (HPAI · ND) ต้อง report กรมปศุสัตว์ → high morbidity · high mortality · production loss · public health · high communicability → depopulation · ↑biosecurity [13:39–14:41]

## 3. Bioscurity 3 Levels [15:43–20:24]
**Concept** — ไม่ตั้งในแหล่งชุมชน · ไม่ติดถนนสายหลัก · ไม่ตั้งในแหล่งสัตว์หนาแน่น · **All-in-all-out** (broiler ได้ · layer ทำไม่ได้)

**Structural** — รั้วรอบขอบชิด · แยกบ้านพักคน-โรงเรือน · พื้นคอนกรีตรอบโรงเรือน (แสงส่อง · ทำความสะอาดง่าย · ไม่มีหญ้า/นกลง) · **ทาง one-way แยกสะอาด-สกปรก** · ลูกไก่เข้า-ซากออก คนละทาง · ป้อมน้ำยาฆ่าเชื้อ-อาบน้ำเข้าโรงเรือน

**Procedural** — Down time **3-7 วัน** (ปัจจุบัน ~3 วัน) ก่อนสัมผัสไก่/นกธรรมชาติ · ล้อรถ spray · คนขับห้ามลง · อาบน้ำ-เปลี่ยนชุด-เปลี่ยนรองเท้า · มือถือ/สมุด-ปากกาผ่านตู้ **UV 10-20 นาที** (15 นาทีก็ได้) [26:33]

## 4. Bath Procedure (เข้าฟาร์ม) [21:54–25:31]
- ห้องแรก เก็บรองเท้าจากบ้าน
- ถอดเสื้อผ้าทั้งหมด (เก็บเสื้อใน-กางเกงในไว้ในมือ)
- เดินซิกแซกผ่านน้ำยาฆ่าเชื้อ (ระวังกางเกงในไม่ให้โดน)
- อาบน้ำ-สบู่-สระผม-ล้างน้ำยาฆ่าเชื้อออก
- ใส่ชุดของฟาร์ม → ใส่บูทเดินทาง → ถึงโรงเรือน เปลี่ยนบูทอีกคู่ + จุ่มเท้า + spray + ล้างมือ

## 5. Cleaning + Disinfection [29:39–32:15]
- ฟอร์มาลิน + ด่างทับทิม **2:1** (น้ำ:ผง) → แก๊สพิษ ต้องอยู่ใน container ปิด · รมควานไข่ก่อนเข้าฟัก
- ลำดับ: เอา bedding/อาหารออก → ล้างน้ำยาทำความสะอาด → ล้างน้ำสะอาด → น้ำยาฆ่าเชื้อ → **ปล่อยให้แห้งเอง** (contact time) ไม่ต้องล้างน้ำตาม
- Foam disinfectant > liquid (เกาะผนังนาน → contact time มากกว่า)
- ✅ Bacterial check ก่อน-หลังทำความสะอาด (เพื่อดูประสิทธิภาพ — แต่จริงๆไม่ค่อยทำ)
- Organic matter ลดประสิทธิภาพ disinfectant → ต้องล้างก่อน

## 6. Mortality Thresholds (★สอบ) [34:19–35:21]
- **Breeder/Layer (พ่อแม่พันธุ์):** ปกติ ≤ **0.3 ตัว/1,000 ตัว/วัน** → 10,000 ตัว = ตายไม่เกิน 3 ตัว/วัน
- **Broiler (ไก่เนื้อ):** ปกติ ≤ **1 ตัว/1,000 ตัว/วัน** → 10,000 ตัว = ตายเกิน 10 ตัวถือผิดปกติ → ต้อง dx หาสาเหตุ

## 7. Visit Order + Pest Control [27:34–34:19]
- สัตวแพทย์เข้า: **โรงอายุน้อย → โรงอายุมาก → โรงเรือนป่วย** (ลำดับสุดท้าย)
- กำจัดหนู (Salmonella!) · จิ้งจก · นก (ตาข่าย-ห้ามปลูกผลไม้-ไม่มีต้นไม้ใหญ่) · แมลงวัน (กระดาษเหลือง) · ไม่เลี้ยงสุนัข/แมว
- เก็บไข่ ≥4 ครั้ง/วัน (บางที่ 6 ครั้ง) · ไข่พื้น = ไม่สะอาด

## 8. Disease Control vs Eradication vs Elimination [41:33–43:43]
- **Control** = ลดสัตว์ติดเชื้อ/ป่วย/ตาย (มีโรคแล้ว)
- **Eradication** = กำจัดให้หมดทั่วโลก/ทั้งประเทศ (ต้องกำจัด reservoir — ในไก่ทำยาก เพราะนกธรรมชาติ/เป็ดเป็น reservoir)
- **Elimination** = กำจัดในบริเวณใดบริเวณหนึ่ง (ฟาร์มเรา) — ใช้กับไก่ส่วนมาก

## 9. Monitoring vs Surveillance [46:22–47:55]
- **Monitoring** — เก็บสถิติ prevalence/incidence ตามเวลา · ดูความรุนแรง
- **Surveillance** — เก็บข้อมูลกลุ่มประชากรเพื่อ analyze + แปรผล + กำหนด action · Active surv. (เฝ้าระวังก่อนเกิด) · Detect outbreak ใหม่ · Public health action
- เปรียบเทียบ COVID: monitoring=นับเคสรายเดือน · surveillance=ตรวจ cluster ใหม่

## 10. Sample Size + Sensitivity/Specificity [53:39–57:25]
- โรค **transmission สูง + incubation สั้น** (HPAI · ND) → จำนวนน้อย (5-10 ตัว/โรงเรือนพอ)
- โรค **transmission ต่ำ + incubation นาน** (Mycoplasma 5 wk) → ต้องเก็บเยอะ 30-40 ตัว
- คำแนะนำกลาง: **20 ตัวอย่าง/โรงเรือน · 1 ไก่=1 sample** (ห้ามเก็บ 5 ml จากไก่ 5 ตัวมารวม!)
- **Sensitivity** = True positive rate · ↑Se → ↑TP, ↓FN (หาผู้ป่วยจริง)
- **Specificity** = True negative rate · ↑Sp → ↑TN, ↓FP
- Test ที่ Sp ต่ำ → FP เยอะ → รักษาเกินจำเป็น

## 11. Sample Collection Table (★สอบ) [62:38–94:04]
| ตัวอย่าง | ใช้ตรวจ | จำนวน | ส่ง |
|---|---|---|---|
| **Blood (1ml)** | Hi/ELISA · serology | **20 ตัว/โรงเรือน** (1ไก่=1 sample) · heart/jugular/brachial | 24h |
| **Boot/Drag swab** | Salmonella | 2 คู่/โรงเรือน · เดินรอบ | แลบ |
| **Choanal cleft / Tracheal swab** | ND · AI · Mycoplasma · respiratory | 10-20/โรงเรือน · แช่เย็น | 24-48h |
| **Cloacal swab** | ND · IBD | 10-20/โรงเรือน | 24-48h |
| **Tissue (formalin)** | histopath | ส่วนปกติ+ไม่ปกติ · หนา ≤1 cm | dorm |
| **Tissue (PCR)** | molecular | เฉพาะ lesion · แช่แข็งได้ | 24h |
| **Water (50ml/sample)** | bact · fungal · pH · heavy metals | nipple ปลายสุด · เช็ดแอลกอฮอล์ก่อน | RT 24h |
| **Feed (200-500g)** | mycotoxin · bact · ฟังไจ | สุ่มจากโรงงาน/ไก่กิน | RT |
| **Litter/Fecal** | Salmonella · พยาธิ · coccidia | 20 จุด รวม 1 sample | แช่เย็น 24-72h |
| **Eggshell/Chick down** | Salm. · Pullorum | ทุก 500 ตัว | แช่เย็น 24h |

## 12. Serology — Antibody Window [60:29–70:59]
- หลังวัคซีน/ติดเชื้อ ใช้ **7-14 วัน** สร้าง Ab ตรวจพบ
- **Paired serum** = เจาะ 2 ครั้ง (วัน 0 + 14 วัน) → titer rise = ติดเชื้อจริง
- ในไก่: IgG = **IgY** (โครงสร้างต่าง)
- **HI (Hemagglutination Inhibition)** = gold standard สำหรับ HPAI + ND · เม็ดเลือดแดงตกก้นหลุม V-bottom = มี Ab จับไวรัสไว้แล้ว · titer 2² → 2³ → 2⁴...
- **HA** = ตรวจ titer ไวรัส
- **ELISA** = ใช้บ่อย · auto-read · เลือก IgG/IgM ตามวัตถุประสงค์
- Geometric Mean Titer (GMT) > Average Mean (เพราะฝูงไม่ Normal distribution)
- **%CV** = uniformity (ต่ำ = uniform = ดี)
- ★ ตัวอย่าง IBD: titer ขึ้นถึง 6,000 หลังวัคซีน → **น่าจะติดเชื้อจริง** (วัคซีนกระตุ้นภูมิไม่ได้สูงขนาดนั้น)

## 13. Building Serological Program [81:59–85:37]
- **Baseline**: 10-20 ตัว/ครั้ง/ฝูง · เก็บหลายอายุ · **ส่งแลบเดียวกัน**
- **Broiler (42 วัน)**: เจาะ 3 ครั้ง — day 1 (maternal Ab) → day 14 (ลดยัง?) → ก่อนจับ
- **Layer/Breeder (1.5-2 ปี)**: maternal Ab (2-3 wk) → 10 wk (post-vacc response) → ก่อนไข่ (15-17 wk) → peak production
- **Window of susceptibility** = ช่วง maternal Ab ลด + vaccine response ยังไม่ขึ้น → **biosecurity สำคัญสุด**
- ไม่มี Universal guideline — ต้องปรับตามฟาร์ม + monitor ทุกครั้งที่เปลี่ยนยี่ห้อวัคซีน

## 14. Risk Assessment 4 Domains (จบบทเรียน) [113:51–114:21]
- ทำเลที่ตั้ง · ลักษณะฟาร์ม · การจัดการฟาร์ม · สุขภาพสัตว์
- คะแนน **exponential** (ไม่ใช่ linear) → เห็น defect ชัด
- มีการ audit จาก กรมปศุสัตว์ + ประเทศผู้ซื้อ (EU · ญี่ปุ่น)

## 15. Hen Housed vs Hen Day Production [99:46–101:48]
- 1,000 แม่ไก่ · 5 wk ตาย 50 → เหลือ 950
- ★ **Hen Housed** = ÷ จำนวนเริ่มต้น (1,000) → 85% (เจ้าของฟาร์มใช้ — ดูคุ้มทุนหรือไม่)
- ★ **Hen Day** = ÷ จำนวนวันนั้น (950) → 89% (คนงาน/หมอใช้ — ดูประสิทธิภาพแม่ไก่)
- ไก่ไข่ออกไข่ทุก 23-25 ชม./ฟอง

## 16. Day-1 Chick Health Check (★ออกข้อสอบ VCA ปีก่อน) [96:37–98:13]
- ตรวจ **crop (ขอบ)** ภายใน 24h หลังลงไก่ — สุ่ม **100 ตัว/วงกบ**
- จับเบาๆ: นิ่ม-ยืดหยุ่นกำลังดี = OK · แข็ง = น้ำไม่พอ → ตรวจคุณภาพน้ำ · บวมนิ่ม = น้ำเยอะ-อาหารน้อย → ตรวจอาหาร

## 17. Egg Break-out Analysis [101:48–112:17]
- แยก **Infertile** (ปัญหาฟาร์มพ่อแม่พันธุ์) vs **Early Death** (ปัญหาโรงฟัก)
- Stages: Early death (1-7d · เห็นเส้นเลือด 3d, ตา 5d, mouse 5d) · Mid death · Late death (มีขน-ปีก-ขา 7-8d+)
- ตู้ฟัก 1-18 วัน (candling แยกฟอง infertile) → ตู้เกิด 18-21 วัน
- **Body Score 3-4 = ดี** (กระดูกอกไม่แหลม-ไม่ผอม) · Pelvic span ใหญ่ = ออกไข่สม่ำเสมอ
- Piping: **internal pip** (เจาะ air cell → หายใจ-ปอดทำงาน) → **external pip** (เจาะเปลือกตามเข็มนาฬิกา) → ดันด้วยปีกขวา
- Normal position: หัวใต้ปีกขวา + เท้าล่าง · ผิดตำแหน่ง (ใต้ปีกซ้าย/เท้าบน) → ฟักไม่ออก
- Malformation: หัวไม่ปิด · สะดือไม่ปิด · แขนขา >1 คู่ → คัดทิ้ง
- ลูกไก่ดี: ขนแห้ง · ยืน-เดินได้ · alert · สะดือปิด

## 18. Misc
- รม **ฟอร์มาลิน:ด่างทับทิม 2:1** = แก๊สพิษ · ใช้รมไข่ก่อนเข้าฟัก [29:39]
- Vertical transmission ในไข่ → ต้อง trace กลับโรงเรือนพ่อแม่
- Trade barrier: ส่งออก EU/ญี่ปุ่น ต้อง monitor HPAI รายเดือน · ND รายสัปดาห์ [53:09]

## ★ ปิดท้าย
"ปี 4 ไม่ยาก แต่ปี 5 (Avian Med) ยากเพราะโรคเยอะ — วันละ 4-5 โรค ต้องจับกลุ่มติวเพื่อน (สอน 90% / อ่านเอง 10%) เจอกันใหม่ปี 5 ขอให้โชคดี" [114:53–115:26]`
},
'nZuRemfTrzQ': {
  videoId: 'nZuRemfTrzQ',
  title: 'Avian Drug & Application Techniques (L13)',
  subject: 'poultry',
  date: '24 Mar 69',
  durationMin: 118,
  instructor: 'Prof. Niwat Chansiripornchai (DVM, MSc, PhD, DTBVM · CU Vet) — L13',
  examFormat: 'MCQ + essay (3 ตัวยาห้ามใช้)',
  summary: `# L13 — Avian Drug · Prof. Niwat

## 0. Mood ของห้อง [0:09–4:20]
อ.นิวัต เปิดด้วย CV: รุ่นพี่ 30 ปีก่อน · ทุนสวีเดน → เนเธอร์แลนด์ → expert OIE ที่ฝรั่งเศส · 8 ปียุโรปติดต่อกัน · ปัจจุบัน Prof. CU Vet · ประธาน Thai Vet Lab Diagnosticians · เปิด lecture ด้วย macro-economic context: **ส่งออกสัตว์ปีกไทย 120,000 ลบ./ปี อันดับ 4 ของโลก, อาหารส่งออก 1 ล้านลบ./ปี อันดับ 9–10** → "หมอต้องเข้าใจเซ้นของตัวเลข" [3:19] · บอกว่าจะเจอจน Vet 86 จบ "หินมา-หินกลับ" mode ตลอด lecture (ถามตอบเร็ว, ตบสวมหัว figurative)

## 1. หลักการใช้ยาในไก่ [4:51–10:00] ⭐
- ไก่ = สัตว์เพื่อการบริโภค → ใช้ยาต้องนึกถึง **คน** (consumer) + **สัตว์**
- **Critical population = ไก่ไข่** (ไม่ใช่ไก่เนื้อ) เหตุผล: เรากินไข่ทุกวัน, ไก่เนื้อเลี้ยงแค่ 42 วัน → exposure คนสั้นกว่า [7:29]
- ไก่เนื้อมาตรฐาน = **42 วัน, น้ำหนัก ~3 กก., FCR ~1.6** → กินอาหาร ~5 กก./ตัว [73:59–75:34]
- ตลาดส่งออก: **ครึ่งญี่ปุ่น + ครึ่งยุโรป** ที่เหลือ HK/ME/SG/MY [8:29]
- คอนเซิร์นหลักไม่ใช่ "สารเคมีตกค้าง" แต่คือ **AMR (antimicrobial resistance)** → ดื้อยา ทำให้คนป่วยตายจากเชื้อที่รักษาไม่ได้ [9:00]

## 2. Withdrawal Time [10:00–11:33]
- ระยะหยุดยา default = **ขึ้นกับชนิดยา** ไม่ใช่ตัวเลขตายตัว
- **ยาที่ไม่มี withdrawal time = ยาที่ไม่ดูดซึมทางเดินอาหาร** [10:31] เช่น **Colistin, Neomycin, Streptomycin** — กินเข้าไป ขับถ่ายออกหมด → safe สำหรับ consumer
- ในการรักษาทางเดินอาหาร นิยมใช้ยาไม่ดูดซึม → ยา concentrate ที่ **site of infection** [29:38]
- **Gentamicin** อยู่กลุ่มเดียวกัน (aminoglycoside) แต่มาเฉพาะรูปฉีด → ใช้น้อยมากในไก่ commercial เพราะฉีดไม่ไหว [31:43]

## 3. AMR & Bactericidal vs Bacteriostatic [12:37–28:35]
- Pet medicine = รักษาเต็มที่; Livestock medicine = **economic scale** "รักษาไม่คุ้มเข้าโรงเชือด" [12:37]
- ปัจจุบันการใช้ยาในไก่ **น้อยลงทุกขณะ** → ไก่ = สัตว์ **ปลอดภัยที่สุด** สำหรับผู้บริโภค (เทียบหมู, กุ้ง) [13:38]
- **ยาเดียวที่อนุญาตให้ผสมในอาหารสัตว์ = ยากันบิด (Anticoccidial)** [15:11–16:00]
- AGP (Antibiotic Growth Promoter) = sub-optimal dose ฆ่า pathogenic GI bacteria → ไก่โตดี · **ห้ามใช้ในไทยตั้งแต่ ค.ศ. 2006** [16:43]
- **Bactericidal** = single dose kills (ต้องเพิ่ม dose) · **Bacteriostatic** = inhibit growth · ยาบางตัว dose-dependent (เช่น **Tetracycline ส่วนมาก = static, Aminoglycoside = cidal**) [26:35]
- Combination: เลี่ยงในปัจจุบัน · classic case = **Sulfa + Trimethoprim** (synergism) แต่ปัจจุบัน sulfa ดื้อมาก = ยาโบราณ [27:05]
- กลไกดื้อยาอยู่ที่ **plasmid** → หยุดใช้ยา ลดดื้อได้แต่ไม่หาย (gene ยังอยู่ ไม่ express) [28:05]
- กลไก: ⭐ DNA gyrase (Quinolone), Folate inhibitor (Sulfa), Cell wall (β-lactam), Cytoplasmic membrane (Polymyxin/Colistin), Protein synthesis (Macrolide/Tetra/Amino), Drug ที่ไม่ค่อยใช้แล้ว = **Nitrofuran (Furazolidone)** [25:02]

## 4. Drug of Choice ตามโรค [32:14–37:23] ⭐
- **Mycoplasmosis** (Mycoplasma gallisepticum/synoviae): **Tylosin, Tilmicosin, Lincomycin, Spectinomycin, Gitasamycin** [33:19]
- **Colibacillosis (E. coli)**: **Quinolone** (แต่ระวัง enrofloxacin ห้ามในไก่ไข่ที่จะเข้า food chain) · Gentamicin ใช้ได้แต่ฉีดไม่ไหว [33:49]
- **Salmonellosis**: Sulfonamide กลุ่ม · **ในไก่บ้านเรา isolate เชื้อ host-specific (S. Gallinarum, S. Pullorum) แทบไม่เจอแล้ว** เพราะ management ดี [34:50]
- **5 Salmonella serovars ห้ามเจอใน export chain**: ⭐ **Typhimurium, Enteritidis, Infantis, Virchow, Hadar** [37:23] — เจอเชื้อตัวใดตัวหนึ่งใน 5 ตัวนี้ = **ห้ามส่งออกทันที**
- **Infectious Coryza (หวัดหน้าบวม)**: Avibacterium paragallinarum (โบราณเรียก Haemophilus) [37:56]
- หลักการ: ทำ **Sensitivity test** ก่อน → drug of choice อาจรักษาไม่ได้เพราะดื้อ [38:28]

## 5. Antiparasitic [41:32–51:30]
### Endoparasite (Helminth)
- ฟาร์มไก่เนื้อ commercial = "ศูนย์" พยาธิ (เลี้ยง 42 วัน + EVAP closed system 100%) [42:35–44:36]
- เจอในไก่ไข่/ไก่พันธุ์ที่เลี้ยงนาน · ตัวเด่น: **Ascaridia, Capillaria, Cestode, Tetrameres** [45:06]
- **Heterakis gallinarum** → vector ของ **Histomonas (Blackhead disease)** [45:37]
- **Antinematodal**: Benzimidazole (Albendazole, Fenbendazole), **Levamisole** (broad-spectrum, นิยมในปัจจุบัน), **Piperazine** (narrow), Phenothiazine (โบราณ) [48:45–51:00]
- **Anticestodal**: ⭐ **Praziquantel = drug of choice ตัวตืด** [50:19]
- **Eye drop ใน สพ.อ. (CU Vet hospital)**: **Levamisole eye drop** สำหรับหยอดตาไก่ [49:47]

### Antiprotozoan
- **Coccidiosis** → genus **Eimeria** (E. tenella, E. necatrix, E. maxima, E. brunetti, E. acervulina) — 4 ตัวหลักไทย [46:09–63:43]
- ยากันบิด: **Toltrazuril, Amprolium, Ionophore (Narasin, Salinomycin), Nicarbazin** [64:13]
- Anti-resistance program: **Rotation Program** (เปลี่ยนยาระหว่างการเลี้ยงรอบเดียว 3-4 อาทิตย์) vs **Shuttle Program** (เปลี่ยนยาระหว่างรุ่น/หรือใช้วัคซีนช่วย) [64:45–66:17]
- **Plasmodium gallinaceum** (yoong-borne), **Leucocytozoon** (ลิ้นไฟ-borne), **Haemoproteus** → เจอในฟาร์มเปิด/ใกล้แหล่งน้ำ (สุพรรณบุรี case study) [47:12–48:14]

### Ectoparasite [58:01–63:12] ⭐
- เจอบ่อยสุด: **เหา (chicken louse) สีขาว** ใต้ปีก
- **Best method = จับจุ่ม (dipping)** เพราะขนไก่มีน้ำมันจาก uropygial gland (ก้น) → ฉีดไม่ค่อยเข้า [59:36]
- Commercial: dip ไม่ไหว → **spray โซกทั้งตัว ทำให้ไก่ตื่น/กระพือปีก** [61:09]
- ยา: **DDT ห้ามใช้แล้ว, Aldrin/Dieldrin ห้าม, ⭐ Pyrethroid = นิยมสุดในปัจจุบัน** เพราะ "สกัดจากดอกพายเรธรัม → consumer-friendly" (ส่งออกสำคัญ) [62:09–63:12] · Cypermethrin = synthetic pyrethroid

### Knemidocoptes mutans (นกแก้ว/นกหงส์ exotic)
- **Scaly leg/face mite** → รักษาด้วย **Ivermectin** (ป้อนปาก หรือ ฉีด) recover เร็ว [110:23]

## 6. Antifungal & Mycotoxin [66:49–72:27]
- เชื้อราในไก่: เจอใน **ไก่พันธุ์** บ่อยสุด (เลี้ยงนาน, stress, immune imbalance) ตามหงอน/เหนียง → ผลต่อ productivity (ไข่มีเชื้อต่ำ ไก่ไม่ผสม) [68:54]
- ยา antifungal **แพง → รักษา topical ที่หงอน-เหนียง** ไม่ค่อยให้กิน [69:24]
- **Mycotoxin (Aflatoxin)**: produced by **Aspergillus flavus** (เจอเยอะสุดในไทย humid+hot climate) → **carcinogen ในคน** + **ทนความร้อน** (ต่างจาก bacteria/virus) [70:54–71:57]
- **Mycotoxin Binders** (อนุญาตผสมในอาหารสัตว์): ⭐ **HSCAS, Zeolite, Activated Charcoal, Bentonite Clay**
- **Mold Inhibitors**: **Organic acid** (Propionic acid), **Probiotic**, **β-glucan, Mannan-oligosaccharide** [72:27]

## 7. ⭐ ยาห้ามใช้ในสัตว์ (Banned Drugs) [72:57–80:47] — "ข้อเขียนออกแน่ 3 ตัว"
- **กลุ่มต้องห้ามตาม พ.ร.บ. ยาสัตว์**:
  - ⭐ **β-agonist (Clenbuterol, Salbutamol)** — ใช้ใน fattening แต่ไก่โตเร็วอยู่แล้ว 42d/3kg → **ไม่ใช้ในไก่** · แต่ห้ามเด็ดขาด [73:29]
  - ⭐ **Diethylstilbestrol (DES)** — hormone, ใช้ในไก่ "3-สาย" (ไก่ไหว้เจ้าจีน, mix Rhode Island × Barred Plymouth Rock × ไก่ชนไทย 50%) → เนื้อตัวผู้กระด้าง/ดุ → **ลักลอบใช้ DES** ทำเนื้อนุ่ม **ผิดกฎหมาย** [76:05–80:15]
  - **Chloramphenicol, Nitrofuran (Furazolidone), Metronidazole, Vancomycin** — ห้าม (impl. โดย Codex/EU) [25:33 + 72:57]
- **Extra-label Use**: ห้าม! ยาคน → ไม่เอามาใช้สัตว์ · ถ้าหมอตัดสินใจใช้ → **รับผิดชอบทางวิชาชีพ (ใบประกอบ-โดน fines/ระงับ)** [80:47]

## 8. ⭐ Drug Application Techniques [81:49–107:46]
### Order of preference:
1. **Water medication** ⭐ (1st choice, drug ของกรมปศุสัตว์ encourage) — ป่วยไก่กินอาหารน้อยแต่ยังกินน้ำ; absorb เร็ว · ระวังตกตะกอน + แคลเซียมในน้ำสูง (เช่น **สระบุรี = หินปูนเยอะ**) จับ tetracycline → ไม่ละลาย [88:55, 102:29]
2. **Feed medication** (2nd) — กรมไม่ encourage (เหตุผลที่ อ.ไม่บอก แต่ implication: ขนาดต่ำกว่ากำหนด, กระจายไม่ทั่ว, batch ผสมขั้นต่ำ ~3 ตัน) [104:39] · **เฉพาะยากันบิดเท่านั้นที่ผสมอาหารถูกกฎหมาย** [105:10]
3. **Injection** (3rd) — onset เร็วสุด, withdrawal ยาวสุด, ฉีดไก่ทั้ง flock ไม่ไหว → ใช้เฉพาะ flock เล็กหรือ aminoglycoside (เช่น gentamicin) [106:45]
- ปริมาณกิน: **ไก่กินน้ำ ≈ 1.7-2× กินอาหาร** [85:54]

### Pharmacokinetic curves [92:35]:
- Injection → ขึ้นเร็ว, ลงเร็ว
- Water → ขึ้นช้ากว่า, ลงเร็ว
- Feed → ขึ้นช้าสุด, ค่อยๆลด
- ทั้ง 3 ต้องอยู่เหนือ MIC level

### Farm system [96:44–99:21]
- Standard house: 10–12 m × 100–110 m
- ความดันน้ำต้องได้ ~0.3 bar เพื่อให้น้ำไหลจากต้นเล้าถึงท้ายเล้า
- **Down-stream proportional pump** (medicator) ดูดยาผสมท่อก่อนถึงรางน้ำ
- ระวัง: ท่อเป็นสนิม/ตะกรัน → ไก่ไม่ได้ยา

### Pause-period (Down-time)
- หลังจับไก่ → **พักเล้า 14 วันตามกฎกรมปศุสัตว์** (นับจากปิดเล้าหลังทำความสะอาด, ไม่ใช่จากวันจับไก่) [99:52]

## 9. 5 Rs (implicit) — ข้อตรวจซ้ำเวลายาไม่ work
ถ้าให้ยา 2 วันแล้วไม่ดีขึ้น ตรวจ: **Right diagnosis, Right drug, Right dose, Right route, Right duration** + ดู water/feed intake (ไก่อาจไม่กินเพราะรสยา → หยุดน้ำให้กระหายแล้วค่อยให้) [88:55, 94:41]

## 10. Key Exam Hooks (Niwat ย้ำชัด)
- ⭐ **5 Salmonella serovar ห้ามส่งออก** (Typhimurium, Enteritidis, Infantis, Virchow, Hadar)
- ⭐ **ยา 1 กลุ่มผสมอาหารถูกกฎหมาย = ยากันบิด**
- ⭐ **Praziquantel = ตัวตืด · Pyrethroid = ectoparasite of choice · Levamisole = broad nematode**
- ⭐ **Aminoglycoside (Colistin/Neomycin/Streptomycin) ไม่ดูดซึม → no withdrawal**
- ⭐ **Aspergillus flavus → Aflatoxin → ทนความร้อน → carcinogen**
- ⭐ **β-agonist & DES = ห้ามเด็ดขาด** (DES ลักลอบใช้ใน "ไก่ 3 สาย")
- ⭐ **Chloramphenicol, Enrofloxacin (in layer/breeder), Nitrofuran = ห้าม**
- ⭐ **Water > Feed > Injection** (order of preference)
- ⭐ **พักเล้า 14 วัน หลังปิดเล้าทำความสะอาด** (กรมปศุสัตว์)
- ⭐ **AGP ห้ามตั้งแต่ 2006**

(Cross-ref VetMock Q1811-1818, Q1823-1824)`
},
'ZRvrSjTlEgc': {
  videoId: 'ZRvrSjTlEgc',
  title: 'Poultry Farm Quality Assurance (L14-15)',
  subject: 'poultry',
  date: '31 Mar 69',
  durationMin: 110,
  instructor: 'Aj. Ekasingh Sareung (เอกสิงห์ สาเรือง · Betagro) — L14-15',
  examFormat: 'T/F ~10 ข้อ + MCQ',
  summary: `# L14-15 — Poultry Farm QA · Aj. Ekasingh

> Lecturer: Aj. Ekasingh Sareung — Betagro Vet '52, ตำแหน่งผู้ช่วยกรรมการผู้จัดการใหญ่ ดูงาน **สัตวแพทย์ + ประกันคุณภาพฟาร์มสัตว์ปีกทั้งเครือ Betagro** [28:51]
> Style: ลุยเร็ว · ใช้ตัวอย่างจากเชนจริง (ฟาร์มปู่ย่า → พ่อแม่พันธุ์ → โรงฟัก → ไก่เนื้อ/ไก่ไข่ → โรงเชือด/Further) · เน้น regulator + customer requirement · Cross-ref VetMock Q1751-1758, Q1806-1810, Q1819-1822

---

## 1) ทำไมต้อง QA ตลอด chain [30:27]

QA = "ใส่ใจ" ในการผลิตสินค้าให้ถึงมือผู้บริโภค — ต้องคุม **ทั้ง chain**: ฟาร์มปู่ย่าพันธุ์ → ฟาร์มพ่อแม่พันธุ์ → โรงฟัก → ฟาร์มไก่เนื้อ/ไก่ไข่ → โรงเชือด → Further → ผลิตภัณฑ์ขาย

**5 องค์ประกอบของงาน QA** [32:35]:
1. **Quality Control** — สินค้าตรงสเปค + ปลอดภัย
2. **Audit (ตรวจสอบ)** — ทำตามที่กำหนดไว้มั้ย ตั้งแต่ฟาร์ม → ผู้บริโภค
3. **Quality Certification** — internal + external (third party)
4. **Quality Assessment** — ประเมินคุณภาพให้สม่ำเสมอ
5. **Traceability** — ตรวจย้อนกลับจากซุปเปอร์มาร์เก็ต → ฟาร์มได้

QA = วิธีบริหาร **systematic problem solving + continuous improvement** ใช้ **Plan-Do-Check-Act (PDCA)** [34:41]

## 2) มาตรฐานที่ต้องศึกษา [36:47]

**ในประเทศ**: กรมปศุสัตว์ · อบต. · มกอช.
**ต่างประเทศ**: EU · ญี่ปุ่น · เกาหลี · จีน · ตะวันออกกลาง
**องค์กรกลาง**: FAO · OIE · NGO อิสระ
**Third Party**: LRQA · Genesis · Halal · NSF · **Sedex** (แรงงาน)

**ลูกค้าเฉพาะกลุ่ม** [40:58]: ไก่โตช้า · ไก่เลี้ยงปล่อยอิสระ · Organic · **Better Chicken Commitment (BCC)** · **ESG**

**Standards**: ISO · GMP/HACCP · GLP · Global GAP · Genesis · LRQA Farm First [43:05]
- **มาตรฐานฟาร์ม กรมปศุสัตว์**: ฟาร์มไก่ >3,000 ตัว ต้องมี · ฟาร์มส่งออก ต้องมี [44:37]
- **RWA = Raised Without Antibiotics** [45:09]

## 3) Scope งาน QA — 6 หมวด [46:13]

### 3.1 Food Safety [46:43]
**4 ด้าน**: Biological (Salmonella + AI ห้าม) · Chemical (antimicrobial · ยากันบิด · ยาฆ่าแมลง · โลหะหนัก · เมลามีน) · Physical (เข็ม · พลาสติก) · Allergen
- หลัก: **GMP + HACCP**
- AMR reduction levels [47:46]:
  - **RU = Reduce Use**
  - **RWA = Raised Without Antibiotics**
  - **NAE = No Antibiotic Ever** (รวม anticoccidial)

### 3.2 Animal Welfare — **Five Freedoms** [49:19] ★
1. ปราศจาก หิว/กระหาย — เข้าถึงน้ำตลอด
2. ปราศจาก ความไม่สบาย — โรงเรือนเหมาะสม
3. ปราศจาก โรค/บาดเจ็บ — dx + tx ทันท่วงที
4. **แสดงพฤติกรรมธรรมชาติ** — มีคอน · ของเล่น (บอล/กระสอบ)
5. ปราศจาก ความหวาดกลัว/Stress

ตัวอย่าง: เดินตรวจ ≥ **2-3 ครั้ง/วัน** · **ห้ามตัดปาก** (ban) [52:30] · **เครื่องปั่นไฟ + น้ำมันสำรอง** [53:00]

### 3.3 Disease Control [53:32]
- Veterinary Health Plan: vaccine · vitamin · disinfectant · monitoring · welfare · vet visit
- Biosecurity: คุมทั้งโซน · ถนนแยก · รั้ว · **อาบน้ำ 2 ครั้ง** (เข้า+ออก) · พักตัวก่อนเข้า · พนักงานพักในฟาร์ม · ใช้ **โฟม** ฆ่าเชื้อรถ (ดีกว่าน้ำ) [58:41] · ตู้ UV
- ยูนิฟอร์ม **แยกสีตามตำแหน่ง**
- Pest control: หนู · แมลงวัน · นกป่า [60:16]
- **Prescription ต้องเขียนโดยสัตวแพทย์เท่านั้น** [62:22] ★

### 3.4 Quality Control [63:27]
**Documents**: Quality Manual · SOP · Work Instruction
**Audit types** [63:57]: Internal Audit (รวม **Surprise Audit**) · Verification · Traceability · Training · 3rd Party Audit · Customer Audit
**Traceability** [64:58]: scan QR → ฟาร์มไก่เนื้อ/โรงฟัก/พ่อแม่พันธุ์ + ชื่อสัตวแพทย์
**Training 9 ข้อ** [65:59]: พฤติกรรมไก่ปกติ · ความหวาดกลัว · ลักษณะสุขภาพ · จับ/บังคับ · humane culling · วัสดุรองพื้น · อุปกรณ์/สุขาภิบาล · ความเครียดจากร้อน · ใช้ยา/เวชภัณฑ์

### 3.5 Labour Standard [67:05]
- **GLP** = Good Labour Practice (กรมปศุสัตว์)
- **BLS** = Betagro Labour Standard
- **Sedex** · **NGO**

**4 หลักของ GLP** [68:09]:
1. ไม่ใช้แรงงานเด็ก
2. ไม่ใช้แรงงานบังคับ
3. ไม่เลือกปฏิบัติ
4. ไม่มีค้ามนุษย์

> "QA ไม่ใช่แค่ประกันสินค้า ต้องประกันความเป็นอยู่ของคนด้วย" [67:38]

### 3.6 Environment [69:11]
- **ISO 14000** [69:43]
- **ใบ อป.2** = ใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ → ทุกฟาร์มต้องมี + ต่ออายุตลอด [72:22] ★
- **จัดการของเสีย**: ฝัง/เผา/ทำลาย · **Vcompost** ~4 อาทิตย์ → ผงป่น → ปุ๋ย · เปลือกไข่ บด+อบ → อาหารสัตว์ · Rendering

## 4) BQM = Betagro Quality Management [100:27] ★★

**สโลแกน 24/7** = 24 ชม. · 7 วัน

**5 หัวใจของ BQM** [102:04]:
- **Food Safety** ★ (ตัวสำคัญสุด)
- คุณภาพอาหาร
- สวัสดิภาพสัตว์
- Corporate Responsibility
- Service Excellence

**Checklist scoring**: Food Safety + Food Quality + Service
- **≥ 60 = ผ่าน** · **≥ 80 = ดี (สีฟ้า)**
- ต่ำกว่า → **PDCA** ปรับปรุง [104:05]

**6 หมวดที่ตรวจ BQM** [106:09]:
1. เอกสาร — Quality Manual · SOP · Work Instruction
2. เวชภัณฑ์ — รับ/สั่ง/จัดเก็บ/ใช้/ทำลาย package
3. ผู้จัดการฟาร์ม + พนักงานเลี้ยง
4. สวัสดิภาพสัตว์
5. ตรวจฟาร์ม — biosecurity · pest control
6. บันทึก

หัวเรือใหญ่ = **ทีมสัตวแพทย์** (ดู animal health + ระบบ + สื่อสาร ตปท.) [105:07]

**NCR = Non-Conformance Request** [107:41] — เจอข้อต้องแก้หลัง audit → ส่ง NCR เพื่อ request **CAPA** (Corrective and Preventive Action)

## 5) Product Specs ตลอด chain

### 5.1 ไข่ฟัก (Hatching Egg) [76:29]
- น้ำหนัก: ไก่ไข่ 45 ก. · ไก่เนื้อ 50 ก. · ผิวสะอาด · ไม่บาง
- ปลอด: Mycoplasma · Salmonella · **ALV-J** · AI [77:29]
- มีภูมิ: CAV · AE

### 5.2 ลูกไก่ (Day-Old Chick) [80:34]
- ไม่มีสะดือดำ/อักเสบ · ไม่ท้องบวม · ภูมิ: ND · IBD · Reo · CAV · AE
- ปลอด: ALV-J · MG · MS

### 5.3 ★★ Salmonella 5 serovars (ไก่พ่อแม่พันธุ์) [84:47]
1. **S. Enteritidis**
2. **S. Typhimurium**
3. **S. Choleraesuis**
4. **S. Pullorum**
5. **S. Gallinarum**

**ไก่เนื้อ (เข้าโรงเชือด)** ห้ามมี [85:21]:
- **S. Enteritidis**
- **S. Typhimurium** + **monophasic Typhimurium** (1,4,[5],12:i:-)

### 5.4 ไข่สด (Table Egg) [90:36] ★
- **เบอร์ไข่**: เลขน้อย = ฟองใหญ่ (เบอร์ 0 > เบอร์ 1 > เบอร์ 2…)
- **ค่า Haugh Unit (HU)** = วัดความสด · สเปคขั้นต่ำ **60-65** [91:38] ★
- ความแข็งแรงเปลือก · สีไข่แดง
- ปลอด: ยาปฏิชีวนะ · ฆ่าแมลง · โลหะหนัก · **Salmonella spp.**

### 5.5 ไก่เนื้อเข้าโรงงาน [87:59]
- น้ำหนัก · uniformity · ปลอดสารตกค้าง · ปลอด AI/Newcastle/Salmonella

## 6) ยาที่ห้ามใช้ [98:22] ★★

**ห้ามเด็ดขาด (กรมปศุสัตว์)**:
- **Colistin** — banned ทันที
- **Cephalosporin** — banned
- **Nitrofuran** — banned นานแล้ว
- **WHO CIA list** — สงวนสำหรับคน

**Approve Vendor List**: Supplier ต้องผ่าน audit → ตรวจ **MRL** (Maximum Residue Limit)

**Receiving control** [92:40]: ลูกไก่ · อาหาร · น้ำ (น้ำบาดาล + ผิวดิน → คลอรีน) · เวชภัณฑ์ · สารเคมี

## 7) Aj. exam quirks (high-yield)
- ★ **5 Salmonella serovars** ในไก่พันธุ์ vs **2 ตัว** ในไก่เนื้อ
- ★ **Five Freedoms** — list ครบ 5
- ★ **BQM 24/7** + 6 หมวดตรวจ + 5 หัวใจ
- ★ **Haugh Unit 60-65** = สด
- ★ **เบอร์ไข่: เลขน้อย = ใหญ่**
- ★ **ใบ อป.2** + **ISO 14000**
- ★ **GLP/BLS/Sedex**
- ★ **Colistin + Cephalosporin** ห้าม
- ★ **Prescription ต้องเขียนโดยสัตวแพทย์**
- ★ **NCR + CAPA** + **PDCA** + **Surprise Audit**
- ★ **debeaking ban**
- ★ **RU vs RWA vs NAE**
- ★ **ALV-J** (Avian Leukosis subgroup J)

## ⚠️ Notes (IRON RULE 0 compliance)
- "FCR" not explicitly mentioned in transcript
- "Slow growth" mentioned only as customer requirement [40:58], not as detailed pros/cons framework
- Lecturer pronounces "Five Freedoms" as "Fight Freedom" (mispronunciation, doesn't change content)

(Cross-ref VetMock Q1751-1758, Q1806-1810, Q1819-1822)`
},
'M64_XJhnZ-Y': {
  videoId: 'M64_XJhnZ-Y',
  title: 'AHRA First Week Mortality (L9)',
  subject: 'poultry',
  date: '21 Apr 69',
  durationMin: 126,
  instructor: 'พี่อู๋ (Poultry course coordinator)',
  examFormat: 'MCQ — Final L9 (~10+ ข้อ ถูก/ผิด · slides ที่มีดอกจัน ★ ออกสอบทั้งหมด · "ข้อสอบไม่ยาก แค่มีสติ" [124:34])',
  summary: `# L9 — AHRA (ShineChick) First Week Mortality Concept · พี่อู๋

> Note: เน้นสอน First Week Mortality concept + Farm Management wrap-up

## 1. Course logistics & exam format [3:03–9:52]
- พี่อู๋ = course coordinator ของ Poultry Health Management
- Mid-term 52.5% / Final 45% / เช็คชื่อ 2.5% (พี่อู๋ให้ทุกคนเต็ม 2.5)
- ของพี่อู๋ = part สุดท้ายของ Final ~7.5% (10+ ข้อ ถูก/ผิด) [5:09]
- "อาจารย์นิวัฒน์ที่บอกว่าไม่ออกสอบ — แต่ก็ออกสอบนะครับ" [5:40]
- พี่อู๋จัดเป็น lecture สุดท้ายเพื่อ wrap up ของอาจารย์กิจ + จักรกิจ + สมศักดิ์ + เอิญ [9:52]

## 2. Why 7 days matter [10:53–12:26] ★
- 7 วันแรก = **ระบบ GI + Immune system กำลังพัฒนา**
- ฟักออกมา → organs ทุกอย่างกำลังโต โดยเฉพาะ **GI tract + Immune system** [11:54]
- ถ้า 7 วันแรกไก่ไม่กินอาหาร: น้ำหนักตามทันได้ใน week 2-6 แต่ **GI กับ immune จะเหลือแค่ ~60% ตลอดชีวิต** [14:33]
- สิ่งที่ได้แทนคือ "โครงกระดูก" ซึ่งเราไม่ต้องการ [15:04]

## 3. ★ สายพันธุ์ไก่ (likely exam · choice-based) [12:26–13:30, 78:42–82:17]
- **ไก่เนื้อ broiler**: COBB **500** · Ross **308** · Arbor Acres · Hubbard [80:46]
  - ⛔ "COBB 400 ผิด — ใช้ที่อินเดีย ทนร้อน 40°C แต่ไม่โต" [80:15]
- **ไก่ไข่ layer**: Hyline · ISA (white/brown — เปลือกขาว/น้ำตาล) [13:30, 81:16]
- ⛔ ตอบสายพันธุ์สลับกัน = ผิดทันที [81:46]
- เมืองไทยเป็นแค่ joint 50% (CP × COBB) — **ไม่มี GGP เป็นของตัวเอง** [82:47, 83:18]

## 4. Field Performance vs Standard [15:35–17:38]
- หน้าที่ชาวฟาร์ม: ทำให้ Field Performance ใกล้ standard สายพันธุ์ที่สุด
- Concept = **optimization** (ไม่ใช่ "the best") [70:59]
- ย่ำอยู่กับที่ = ฉีกจาก standard เพราะสายพันธุ์พัฒนาเรื่อยๆ [17:07]

## 5. ★★ Crop fill 24 ชม.แรก [18:08–19:41]
- 24 ชม.แรก จับลูกไก่ 10 ตัว ต้องเจออาหารใน crop **100%** [19:10]
- ไม่ 100% = error การจัดการน้ำ/อาหาร: อากาศร้อน · อาหารแข็ง · นิปเปิ้ลสูง/ต่ำเกิน
- "ถ้าออกสอบจะให้ลองนึกตัวเรา ไปอยู่ฟาร์ม จะแนะนำคนฟาร์มยังไงเรื่องน้ำ/อาหาร 24 ชม.แรก" [19:41]

## 6. Immune system anatomy [20:12–22:13]
- **Primary lymphoid organs**: **Bursa of Fabricius** (B-cell) + **Thymus** (T-cell) [21:12]
- ไก่ **ไม่มี lymph node** — มีแต่ lymphoid tissue กระจาย (เช่น cecal tonsil) [21:12]
- bursa เสียหาย → B-cell หายตลอดกาล → vaccine ไม่กระตุ้น antibody [21:43]

## 7. Disease challenge 3 ปัจจัย [22:44–24:49]
1. virulence ของเชื้อ
2. infectious dose
3. **frequency of exposure** ← สำคัญสุด (= biosec/error)

## 8. ★★ โรคไวรัสหลัก 7 วันแรก [28:56–43:25]
| โรค | GI | Respi | Nervous | Bursa | Notes |
|---|---|---|---|---|---|
| **ND** | ✓ | ✓ | ✓ | — | ครบทุกระบบ; ไทย report ปลอด ND/AI [29:27] |
| **IB** | — | ✓ | — | — | corona · ทรงเหมือน COVID; respiratory only [31:33] |
| **AI** | ✓ | ✓ | ✓ | — | เหมือน ND; H9=LPAI; ไทยไม่มีวัคซีน [32:35] |
| **IBD (Gumboro)** | ✓ | — | — | ✓ destroy | ★ โรค**เดียว**ที่ทำลาย bursa [34:10] |
| **IBH** | — | — | — | ตับ | hepatitis · non-envelope · aldehyde/halogen [35:13–37:51] |
| **AE** | ✓ | — | ✓ "หัวสั่นๆ" | — | ปีนี้ถามแค่ระบบประสาท [37:51] |
| **CAV** | — | — | — | thymus destroy | ปีกม่วง "blue wing" + Staph [40:54] |

## 9. Bacteria + ลูกไก่ตายไม่ทราบสาเหตุ [43:25–44:27]
- Top causes paper-cited: (1) ตายไม่รู้สาเหตุ (2) yolk sac infection
- Yolk sac ดูดซึม 7-14 วัน — contaminate → bacteria เพิ่ม → ตาย

## 10. Hatchery factors [44:27–50:15]
- ตู้ฟัก 300,000 ฟอง · เซตอุณหภูมิตาม %hatch
- **Heat stress ในตู้ฟัก** = ไก่โตเร็วเกิน → ใช้ yolk หมด → สลายกล้ามเนื้อ
- **Humidity ต่ำ** = ไข่แห้ง · เปลือกแข็ง · ลูกไก่จิกออก ขาเป็นแผลตามข้อ → S. aureus/E. coli infection [49:44]
- **Pasgar score** mentioned at [50:15] BUT 5 components partial: navel · beak · legs dryness · leg lesion · flip reflex (ไม่ใช้คำว่า "Pasgar" หรือ 0-2 scoring system)

## 11. New House Syndrome [54:55–55:27]
- โรงเรือน slat ใหม่ + พลาสติกคม → ลูกไก่เหยียบขาเป็นแผล → Staph infection
- พี่อู๋ใช้คำ "**New House Syndrome**" [55:14]

## 12. Disinfection chemistry ★ [37:19–37:51]
- IBH = **non-enveloped virus** → กรด/แอลกอฮอล์ทำอะไรไม่ได้
- ต้องใช้: **aldehyde** (glutaraldehyde, formaldehyde) หรือ **halogen** [37:19]

## 13. ตายเฉียบพลัน — Ascites/Hypoxia [56:58–57:30]
- ระบายอากาศไม่พอ → hypoxia → metabolic problem → heart failure
- เจอ pericardial effusion + ascites

## 14. Pasty butt / stress diarrhea [63:41–64:13]
- ขี้เหนียวติดตูด ~3-4 วันหลังเครียด (ร้อน/หนาว/ชื้น/อากาศไม่พอ)

## 15. ★ Profit + Science framework [65:14–67:20]
- การจัดการฟาร์ม = **Economy** (คุ้มค่า) + **Science** (มีหลักฐาน)
- ไม่ทำวัคซีนถ้าฟาร์มไม่มีโรค — ทุกการให้ต้องมีหลักฐานวิทย์ ไม่ใช่ "ไสยศาสตร์" [66:48]

## 16. Lab diagnosis 2 approaches [73:35–74:36]
- (1) ตรวจหาเชื้อ (PCR/culture) = ผลวันที่เก็บตัวอย่าง
- (2) ตรวจ antibody (serology) = ติดมาแล้ว ~10-21 วันก่อน
- Seroconversion = confirmation การติดมาแล้ว [27:24]

## 17. ★★ Cost: Prevention << Control << Eradication [77:41–78:12]
- prevention < control (พอเสียหายแล้วค่อยรักษา) << eradication (กำจัดทิ้ง)
- จึงนิยม prevention + biosec [78:12]

## 18. FCR + Performance parameter [92:11–92:44]
- FCR = Feed Conversion Ratio
- ไก่เนื้อ commercial **FCR ~1.55** · ไก่พื้นเมือง **FCR ~2.4** [92:44]
- Performance parameters: feed intake · ADG · mortality % · egg %

## 19. Evaporative Cooling System [94:20–95:55]
- Closed house: pad cooling + negative pressure suction fan
- Analogy: หลอดดูดน้ำ — รั่ว = control อุณหภูมิเสีย

## 20. Litter (แกลบ) — ⛔ ไม่ออกสอบ [97:59–107:25]
- "อันนี้เป็นเรื่องแกลบ ไม่ออกสอบ" [107:25]

## 21. ★★ Biosecurity errors (Canada CCTV study) [105:48–113:37]
- คน = พาหะหลัก
- **Boot dip error rates**:
  - Open sticker line: **73% non-compliance** [110:01]
  - Real door + sign: **20% non-compliance** [110:01]
  - Vet/manager: **80% error**; staff: **60% error** [111:04]
- Solution: **Universal design** — ทุกคนต้องผ่านระบบเดียวกัน [112:07]

## 22. ★ UV cabinet [115:10–117:49]
- **UVC** เท่านั้นที่ฆ่าเชื้อ (ไม่ใช่ UVA/UVB)
- ⛔ "ไฟ FL + กระดาษแก้วม่วง" = หลอก auditor ได้ แต่**ฆ่าเชื้อไม่ได้** [120:46]
- UV target = **99.99% reduction** (ไม่มี 100%) [117:19]
- ระยะทางจากหลอด ↑ → ฤทธิ์ ↓ · ปกติ ~20 นาที

## 23. Rodent control [119:23–121:26] — ⛔ ไม่ออกสอบ
- **แมลง/หนู ไม่ออกสอบปีนี้** [121:57]

## 24. Final exam emphasis recap [124:02–124:34]
> "สไลด์ที่มันมีดอกจันต่างๆ ครับก็อยู่ในข้อสอบทั้งหมดนะครับ"
> "ข้อสอบไม่ยากนะครับ แค่มีสติ"
> "พี่ก็เป็นช้อยส์นะครับ ไม่ยากอะไร"

## ⚠️ ไม่ได้พูดถึงในคาบนี้ (อย่าอ้างว่าอาจารย์พูด)
- ⛔ "AHRA" acronym expansion
- ⛔ "ShineChick" explanation
- ⛔ Mortality thresholds (<1% day-old, <1% wk-1, <1.5% wk-2) — only example graph 3% spike at day 4 = abnormal
- ⛔ "Rolling reaction" vaccine term
- ⛔ Pasgar 5 components named as "Pasgar score" — only 5 evaluation points described
- ⛔ Lecturer "Aj. Kriengwich Limpavithayakul" — speaker is **พี่อู๋** (course coord)
- ⛔ Specific cross-link to biosec L11 by L-number

(Cross-ref VetMock Q1781-1784, Q1797 — vault-side cross-ref)`
},
'91RNoNhi3gI': {
  videoId: '91RNoNhi3gI',
  title: 'Metabolic & Nutrition Disorders in Dairy Cattle',
  subject: 'cliapprum',
  date: '4 Mar 69',
  durationMin: 143,
  instructor: 'verify (ไม่ได้ระบุชื่อ — เรียกตัวเองว่า "พี่" · อ้างถึง อ.วิโรธ + อ.มนชัย ม.ขอนแก่น เป็นผู้พัฒนา KCF)',
  examFormat: 'MCQ — Final scope · 15 ข้อต่อคาบ',
  summary: `# Metabolic & Nutrition Disorders in Dairy Cattle · Aj. (verify)

> **Caveat สำคัญ**: lecture นี้เป็น **workshop-driven** (~143 นาที) เน้น **practical evaluation tools** สำหรับฟาร์มโคนม ไม่ใช่ disease deep-dive · NEB / BCS / R:C ratio / particle size / NRC requirement matching เป็นแกนหลัก

## ★ Big-picture framework [04:46–14:08]
**Master diagram** (ออกสอบ):
- แกน X = day in milk (DIM)
- แกน Y ซ้าย = milk yield · DMI · energy balance
- แกน Y ขวา = body weight (กก.)

**Pattern:**
1. Day 0 = วันคลอด BW ~630 กก. · energy req. พุ่งสูง
2. **Lactation curve**: peak ที่ **60–90 วัน** [06:23]
3. **DMI**: หลังคลอดยังกินไม่เยอะ → physiology + hormone + เปลี่ยนคอก [07:26]
4. ★ **NEB (Negative Energy Balance)** → ดึง fat reserve → BCS/BW loss ทุกตัว [07:57]
5. ต้องเปลี่ยน negative → positive ก่อน 90 วัน
6. Critical period [11:01]: 100 วันแรก · transition ก่อน-หลังคลอด 3 wk

## ★ 2 Pillars ของการประเมินอาหาร [11:33]
1. **Nutrient adequacy** — โคได้ requirement?
2. **Rumen health** — เหมาะกับ rumen function?

## ★ Inputs (Side 1: Nutrient adequacy) [12:36]
- DMI · คุณค่าโภชนะ · Requirement (BW + milk yield → NRC table)
- **Evidence on cow**: BCS · lactation curve · reproductive performance

## ★ Inputs (Side 2: Rumen health)
- R:C ratio · Particle size
- **Evidence on cow**: Rumination % (≥50% ฝูง) · manure score · milk fat % · locomotion score (laminitis %)

> **Take-home** [21:35]: ฟาร์มมีข้อมูลครบ → เข้าฟาร์มไม่เกิน 2 ชม. ตอบได้ว่าอาหารเหมาะมั้ย

## ★ Workshop 1: DMI conversion [27:49]
**สูตร**: DMI = น้ำหนักสด × DM%/100
- ฟาร์ม 0 (ความชื้นสูง): DMI 9.51 (ต่ำสุด)
- ฟาร์ม 9: DMI 14.49 (สูงสุด)
> กินสด 30 กก.เท่ากัน แต่ DMI ต่างกัน 5 กก. [33:04]

## ★ Workshop 2: CP intake [35:46]
**สูตร**: CP intake = DMI × CP%
- ฟาร์ม 9: CP 18.8% + DMI สูง → 2.7 กก./วัน
- โคต้องการ ~1,000+ g/วัน (คน 70 kg ~140 g) [39:02]

## ★ Workshop 3: Energy NEL [44:27]
- ใช้ **ADF** คำนวณ NEL · หน่วย Mcal/kg DM
- ★ **ADF↑ → energy↓** [54:52]
- ฟาร์ม 9: 21.17 Mcal/วัน (สูงสุด)

> **Take-home** [60:00]: เน้น DMI ก่อน · ค่อยปรับสูตร

## ★ Workshop 4: NRC requirement matching [60:32]
**KCF program** (อ.วิโรธ + อ.มนชัย ม.ขอนแก่น · ฟรีบนเว็บกรมปศุสัตว์ตั้งแต่ปี 2020) [62:36]

**โจทย์**: BW 550 · นม 25 กก./วัน · milk fat 4%
- DMI req = 15.4 กก./วัน
- Energy req = 29.2 Mcal NEL/วัน
- CP req = 2,660 g/วัน

→ **ทุกฟาร์ม under requirement** [68:28]

## ★ Workshop 5: ปรับ DMI [68:28]
หลังเปลี่ยน 2 มื้อ → 5 มื้อ + พัดลม + อาบน้ำ:
- ฟาร์ม 4: DMI 19 กก. → CP บวก · energy ยังลบ
- ฟาร์ม 0: DMI 12.68 → ยังลบทั้ง 2 (ความชื้น 70%)

## ★ DMI as % BW [82:26]
- เฉลี่ยปี: **3–3.2% BW** [87:48]
- หน้าหนาว fully managed: **4.5% BW** [87:18]

## ★ Workshop 6: R:C ratio (DM basis!) [96:15]
**ห้ามคิดบนน้ำหนักสด** — ต้องคิดบน DM
- R DM = 700 × 0.30 = 210 กก.
- C DM = 300 × 0.88 = 264 กก.
- R% = 210/474 = **44.3%** · C% = 55.7%
- → R:C = 44:56 ✅

## ★ R:C interpretation [105:36]
**Rule** [106:07]:
- ★ **R ต้องไม่ต่ำกว่า 40%** (DM basis)
- C สูงสุด ≤ 60%

| R:C | Milk yield | Milk fat % |
|---|---|---|
| 80:20 | ต่ำ (req. ไม่พอ) | ปกติ |
| 60:40 | เพิ่มขึ้น | ปกติ |
| **40:60** ★ | peak | ปกติ-ลด |
| 20:80 | spike แล้ว drop | drop ชัด → **acidosis** [110:22] |

## ★ Particle size (Penn State Separator) [111:55]
**4 ชั้น**:
| ชั้น | รูพรุน | TMR target % |
|---|---|---|
| 1 (บน) | >19 mm | 2–8% |
| 2 | 8 mm | (intermediate) |
| 3 | 4 mm | 30–50% |
| 4 (pan) | ไม่มีรู | ≤ 40% |

วิธี: เขย่า ≥ 1.1 Hz (≥1 ครั้ง/60 sec)

**Rumen mat anatomy** [114:33]: 3 ชั้น แก๊สบน · luminal mat กลาง · fluid ล่าง
- 4 mm มาก = ไม่กระตุ้น rumination
- 18 mm มาก = กระตุ้น rumination ดี · ย่อยยาก
- ★ ต้องสมดุลทั้ง 3 size

## ★ Lactation curve interpretation [118:15]
**Normal benchmarks** [123:27]:
- Milk peak: 60–90 วันหลังคลอด
- BCS หยุด loss ภายใน 90 วัน
- BW ไม่ควรลด >10% ใน 1 เดือนแรก
- BCS loss ไม่เกิน 0.5–1 score/เดือน

**Pathology**:
- Early peak (<60 วัน) [122:53] = NEB รุนแรง · อาหารไม่พอ

**Real cases**:
- โค 7916: Early peak · BW 525 → 450 ใน 1 เดือน (ลด 14% เกิน threshold) [122:53]

## ★ Manure score (5 levels) [128:06]
| Score | ลักษณะ |
|---|---|
| 1 | เหลวมาก (ไม่ควรเจอ — โรค) |
| 2 | กระจายมีขอบ — acidosis indicator |
| 3 | ซ้อนเป็นกอง · กลางหลุม (ปกติ lactating) |
| 4 | กองเป็นภูเขา |
| 5 | ก้อนชัด (โครีด/แห้ง) |

> mismatch กับ R:C = ผิดปกติ · acidosis = score 2 เยอะในฝูง

## ★ Laminitis as evidence [131:42]
- Locomotion score สูง = อาจมีปัญหาจากอาหาร
- ยกกีบ → ปื้นเลือด/hemorrhage บน sole = **laminitis from acidosis** ★

## ★ Final exam emphasis [132:44]
1. Master diagram (DIM × milk × BW × DMI × NEB)
2. Peak milk = 60–90 DIM · BW loss ≤10%
3. DMI conversion (สด → DM)
4. CP intake = DMI × CP%
5. NEL · ADF↑ = energy↓
6. DMI %BW: 3–3.2% เฉลี่ย · 4.5% หน้าหนาว
7. **R:C 40:60 บน DM basis (ไม่ใช่สด!)**
8. Particle size Penn State 4-tier
9. R:C 20:80 → acidosis → milk drop
10. Laminitis hemorrhage → acidosis indicator

## ⚠️ ไม่ได้ครอบคลุมในคาบนี้
- Ketosis (Type I/II) · BHB cutoff
- Fatty liver syndrome
- Hypocalcemia · milk fever · Ca cutoffs
- Hypomagnesemia · grass tetany
- SARA pH cutoff (เฉพาะ "acidosis เป็นเหตุ" — ไม่ลง pH)
- LDA · displaced abomasum
- Retained placenta · endometritis
- DCAD · anionic salts
- Mycotoxicosis · aflatoxin

→ Disease topics น่าจะอยู่ในคาบอื่น (อาจ Lect 3 GI Disorder)`
},
'HD0tbvDa-Cc': {
  videoId: 'HD0tbvDa-Cc',
  title: 'Ruminant Anesthesia',
  subject: 'cliapprum',
  date: '11 Mar 69',
  durationMin: 95,
  instructor: 'Aj. (ไม่ระบุชื่อใน transcript — instructor หญิง สอนปีละครั้ง · กล่าวถึงทีม อ.สมิต อ.พล อ.แนน อ.อร อ.มน พี่มด พี่ลี่)',
  examFormat: 'MCQ — Final scope',
  summary: `# Ruminant Anesthesia · Aj. (verify)

> Lab focus: วันจันทร์ที่ 16 = Epidural + Proximal paravertebral [82:39][84:47]

## ★ ทำไมนิยม "Standing + Local"
- 3 species: **Bovine · Caprine · Ovine** [1:51]
- กลัว GA complication ในสัตว์ใหญ่ [2:21]
- Recovery สมูทกว่าม้า · ไม่ violent [4:24]
- GA ต้อง intubate + ventilator (bag ใหญ่มาก) [4:57]

## ★ NPO timing [10:40]
- **ลูกเกิดใหม่**: ★ **ไม่ต้องงด** (กลัว hypoglycemia)
- **ลูกวัว/Small ruminant**: น้ำ 8 ชม. · อาหาร 12 ชม.
- **แม่วัวโต**: 12-24 ชม.
- **พ่อวัวโต**: 24-36 ชม.
- เหตุผล: ลด regurgitation + กดกระบังลม + กด vena cava

## ★ Pre-op checks [6:01]
- HR · hydration · เลือดดูตับไต
- ★ dehydrate → เลี่ยง acepromazine (vasodilate ซ้ำ)

## ★ Catheter [12:45]
- **Cattle**: jugular vein (ขาไม่ได้ — วัวเตะ)
- **Small ruminant**: cephalic / saphenous
- Maintenance: 4-8 ml/kg/hr · hypotension bolus 10-25 ml/kg

## ★ GA Complications
- **Active regurgitation** = วางตื้นไป (กล้ามดัน) [14:50]
- **Passive (silent)** = ลึกเกิน (หูรูดขยาย) [15:21]
- **Bloat**: gas สะสม → กดกระบังลม → trocar [15:52]
- **Hypoventilation** [16:55]

## ★ Pre-medication

### Anticholinergic (Atropine) [17:26]
- ★ Controversial — ลด secretion มากไป → mucus เหนียวอุดตัน
- ให้เมื่อ bradycardia (เหมือนสัตว์เล็ก)

### Benzodiazepines [19:28]
- Diazepam: ★ ไม่ละลายน้ำ → IV only
- Midazolam: water soluble → IV/IM
- ★ ไม่กด CV + ลดโดส induction

### Acepromazine (Phenothiazines) [20:32]
- Sedation moderate · ลด arrhythmia
- ★ ข้อเสีย:
  - vasodilate (block α1) → hypotension
  - Relax esophagus → ★ เพิ่ม regurgitation [21:06]
  - **Penile prolapse** ในม้าพ่อพันธุ์ → เลี่ยงในม้าตัวผู้ + วัวพ่อพันธุ์ [21:37]
  - ลด thermoregulation
- ★ ห้ามใช้: hypovolemic / ใกล้ตาย [23:11]
- โดสวัว: 0.01-0.02 IV · 0.03-0.1 IM

### α2-agonists (Xylazine) — ตัวหลักใน large animal [23:43]
- Sedation + analgesia + muscle relaxation
- Hypertension transient ช่วงแรก + reflex bradycardia
- ลด ADH → ★ ฉี่เยอะมาก
- ★★ **Sensitivity ranking** [24:44]:
  - **Cattle/Buffalo > Goat > Sheep** (cattle เซน์สุด)
  - **Brahman เซน์สุด > Hereford > Holstein** (Holstein resistance สุด)
- ★ ระวัง: α2 → มดลูกบีบเพิ่มไตรมาสสุดท้าย → แท้ง/คลอดก่อน
- ★ ในแกะ: hypoxia + pulmonary edema → บางคนเลี่ยง [26:20]
- โดสวัว: 0.1-0.2 mg/kg IV/IM
- **Reverse: Yohimbine** [43:18]

### Standing sedation วัว [26:51]
- Xylazine 0.1-0.2 mg/kg + opioid + Local
- ★ เป้า: ไม่ให้วัวล้ม (ล้ม → bloat)

## ★ Induction agents [27:22]

### Thiopental
- ★ ห้ามใน <3 เดือน (ตับ metabolize)
- ไม่นิยมในวัวโต

### Ketamine [28:27]
- ★ ห้ามใช้เดี่ยว → muscle rigidity
- ต้องคู่กับ muscle relaxant (Xylazine/Diazepam/Acepromazine)

### Diazepam + Ketamine [29:29]
- procedure 15-30 นาที (เย็บแผล)
- ตปท. เติม butorphanol (ไทยไม่มี)

### Xylazine + Telazol (~60 นาที)
- Telazol = Tiletamine + Zolazepam

### Propofol — ราคาสูง ไม่คุ้ม [30:33]

### Maintenance Inhalation [30:33]
- ★ เหลือใช้ Isoflurane (Halothane ไม่มี · Sevo แพง 3 เท่า)
- Circuit สัตว์ใหญ่ (ถ้า <100-140 kg ใช้ circuit สัตว์เล็กได้)

### Guaifenesin [31:37]
- ★ ไม่ใช่ยาสลบ — เป็น muscle relaxant
- 5% solution (เกิน → hemolysis)
- ★ IV catheter เท่านั้น (leak → tissue necrosis)
- Combo classic: **Guaifenesin + Ketamine + Xylazine** ("triple drip")
- ★ หาซื้อยากในไทย ต้องคิ้วเข้ามา

## ★ Intubation [34:12]
- <300 kg: sternal + laryngoscope + stylet
- วัวโต: ★ ยื่นมือเข้าไปกด epiglottis เป็น guide → สอด blind

## ★ Monitoring [36:21]
- ★ Eye position: ventro-medial = stage ที่ต้องการ · ดำกลาง = ตื้น/ลึกไป [36:51]
- jaw tone · respiratory · MM color · BP · HR · CRT · temp
- Fluid: balanced electrolyte · ลูกสัตว์เพิ่ม dextrose

## ★ Recovery [41:43]
- ★ Extubate เมื่อกลืนเองสมบูรณ์
- ปล่อยตื่นเอง — ห้ามถีบ ห้ามเขย่า
- ★ ท่า sternal + หมอนรองคอ → regurgitation ไหลตามแรงโน้มถ่วง [43:49]

## ★★★ Local & Regional Anesthesia

### Lidocaine 2% [44:19]
- 20 mg/ml · duration 1.5-3 ชม.
- ★ Max safe: **วัว 10 mg/kg · แพะ-แกะ 4 mg/kg**

### 1. Cornual Nerve Block [44:53]
- ★ Innervation: **trigeminal CN V** (ophthalmic division)
- **Cattle**: SC กึ่งกลาง lateral canthus ↔ base of horn (lateral ridge)
- โดส 5-10 ml · รอ 10-15 นาที · ออก ~1 ชม.
- ★ **แพะ ต้อง 2 ตำแหน่ง**:
  - Cornual nerve (เหมือนวัว)
  - Infratrochlear nerve (กึ่งกลาง medial canthus-medial horn) [47:29]

### 2. Eye blocks (3 อัน)
**a) Auriculopalpebral** [48:34]:
- Sensory + motor → orbicularis oculi (กระพริบตา)
- 5-7 cm caudal lateral end ของ zygomatic arch · 10-15 ml

**b) Retrobulbar / 4-point block** [50:10]:
- ใช้: enucleation
- ★ 4 ตำแหน่ง: 12, 3, 6, 9 นาฬิกา · 5-10 ml/ตำแหน่ง (~40 ml)
- ★ Complications: globe penetration · hemorrhage · ★ optic nerve damage = ตาบอด [52:48]
- ★ ถ้าจะเก็บตา → ใช้ Peterson แทน [52:15]

**c) Peterson Eye Block** [53:48]:
- Block CN II, III, IV, V (ophthalmic + maxillary), VI · ★ ยกเว้น CN VII [54:18]
- ★ ปลอดภัยกว่า + effective + บวมน้อยกว่า retrobulbar [55:23]
- 15-20 ml · aim foramen orbitorotundum
- ★ Eyelid ไม่กระพริบหลายชม. → ป้ายตา + เย็บ lid

### 3. Bier Block (IV Regional) [56:25]
- ใช้: ตัดนิ้ว · กีบเน่า · laminitis
- ★ Tourniquet → Lidocaine 2% IV ใต้ tourniquet · 10-30 ml
- ★ Tourniquet ห้ามเกิน 1 ชม. → necrosis [57:56]
- ★★ Onset 5-10 นาที
- เส้น:
  - **ขาหน้า**: Common dorsal metacarpal v. · Palmar metacarpal v. · Radial v.
  - **ขาหลัง**: Lateral saphenous v. · Lateral plantar digital v.
- Small ruminant Bier: 3-4 ml [60:06]

### 4. Standing Laparotomy indications [60:40]
- C-section · rumenotomy · abomasal impaction · displacement

### 5. Line Block [62:15]
- SC ตามแนวกรีด · max 250 ml · duration 60-80 นาที
- ★ ข้อเสีย: ขอบ SC โป่ง → เย็บปิดไม่สวย

### 6. Inverted L Block ★ [63:49]
- รูป L กลับหัว · volume ~100 ml
- ★ ข้อดี: ไม่มี bleb ขวางกรีด → หมอวัวชอบ
- Duration ~60 นาที

### 7. Paravertebral Block [65:51]
**a) Proximal Paravertebral (Farquharson)** ★ — Lab Mon 16!
- ★ Landmark: anterior ของ transverse process L1 (block T13)
- ห่าง midline 5 cm · ลึก 1-2 cm เลย TP ปล่อยยา
- ★ โดส 6-8 ml/จุด
- L1 block: caudal ของ L1 TP
- L2 block: caudal ของ L2 TP [69:27]
- ★ Signs of success [69:58]:
  - Skin flank อุณหภูมิสูงขึ้น
  - เข็มจิ้มไม่เจ็บ
  - ★ **Scoliosis** — วัวเบ้ตัวมาฝั่งที่ block
- Duration ~90 นาที

**b) Distal Paravertebral (Magda)** [66:22]
- Landmark: TP ของ L1, L2, L4
- Vertical fan-shape ใต้ + บน TP
- ★ ข้อเสีย: เทคนิคยาก · วัวเตะ
- ★ ข้อดี: ไม่เกิด scoliosis · หมอวัวมือโปรชอบ
- เข็ม 18 G · 20 ml/ตำแหน่ง

### 8. Epidural Anesthesia [76:50]
**Small ruminant**: lumbosacral space · 2% Lidocaine
- ผ่าช่องท้อง: 1 ml/5 kg
- ผ่า perineum: 1 ml/7 kg

**Cattle** [77:56]: 2 ตำแหน่ง
- Sacrococcygeal (Sa-Co1) — โยกหางท่อนแรก
- Intercoccygeal (Co1-Co2)
- ★ ไม่บล็อกสูง — block แค่ perineum + tail (กลัวล้ม)

### 9. Teat Blocks [79:31]
- V-block: เย็บแผลหัวนม · 5 ml/ขอบ
- Ring block: ตัดก้อน · วงกลมรอบ base
- Teat cistern infusion: tourniquet base + lidocaine ใน cistern · ชา ~2 ชม.
- ★ ส่วนใหญ่ใช้ Ring block (versatile)

## ★ Approach to ruminants [39:36]
- ห้ามกรี๊ด ถ้าวัวกระทืบ
- ★ ขาหนึ่งพร้อมถอยหลังเสมอ · ห้ามยืน 2 ขาคู่
- มีรุ่นพี่ยืนระหว่างวัว 2 ตัว วัวกระทืบ → กรี๊ด → วัวเตะ

## ⚠️ ไม่ได้พูดถึงในคาบนี้
- Procaine vs Lidocaine comparison
- Withdrawal times in food animals
- Specific bloat positioning (left lateral safer)
- Triple drip ratio precise (mentioned แต่ไม่ให้ ratio)
- Specific dose Telazol/Tiletamine

## Lab focus วันจันทร์ 16 [82:39]
- กลุ่มแรก: Epidural + Proximal paravertebral
- ★ ก่อน lab: ทบทวน paravertebral · inverted L · approach
- ★ คาถา อ.: "ทำต้องมั่นใจ · ปักไปเลย — จึ๊กๆจั๊กๆ วัวจะเตะ"`
},
'03mEa46Cg48': {
  videoId: '03mEa46Cg48',
  title: 'Ruminant GI Disorders (Med)',
  subject: 'cliapprum',
  date: '18 Mar 69',
  durationMin: 125,
  instructor: 'อ.ธนศักดิ์ (Aj. Thanasak — verified [3:41]–[4:13])',
  examFormat: 'MCQ — Final scope · LDA/Hardware/bloat high-yield',
  summary: `# Ruminant GI Disorders (Medical) · อ.ธนศักดิ์

## บทนำ [1:30]
field practitioner ที่นครปฐม/กำแพงแสน เคยรอ 2 wk วัวก็ตาย → อ.ธนศักดิ์ (เมดิซีน) สอน dx GI · อ.ศัลย์สอน sx [4:13]

## Anatomy Refresh [5:47]
- ★ **ซ้าย** = Rumen (paralumbar fossa)
- ★ **ขวา** = Abomasum + Omasum
- หลอดอาหาร → **Reticulum** (อยู่หน้าสุด ติด xiphoid + กระบังลม) → Rumen → Omasum → Abomasum
- ★ Reticulum อยู่หน้าสุด → ของหนัก (หิน ตะปู น็อต) ตกที่นี่ [10:58]

### Rumen content stratification [8:20]
1. Top: gas
2. Middle: fiber/roughage
3. Bottom: heavy/digested
4. ★ **Ruminal Mat** (สีเขียว): ขย้อนเคี้ยว → buffer pH · ป้องกัน acidosis [9:55]

## ★ Iatrogenic vs Symptomatic [12:00]
- **Iatrogenic**: คนทำให้เกิด (F:C ผิด · อาหารชื้นย่อยเร็ว → acidosis)
- **Symptomatic**: ป่วยระบบอื่นแล้ว GI หยุด (mastitis · respi)

### Feeding management ที่ต้องถาม [13:40]
- **F:C ratio**: ปกติ 60:40 · high producer 40:60
- กากมัน + กากถั่ว = **concentrate ทั้งคู่** [15:45]
- ★ NaHCO₃ buffer ป้องกัน pH swing [17:19]

### ลูกวัว [17:19]
- เกิดใหม่ = monogastric · rumen ค่อย develop
- ★ ลูกวัวต้องมีน้ำตลอด · เคสบ้าน: ปล่อยทั้งวันไม่ได้น้ำ → bladder แตก ฉี่เหมือน Babesia/Anaplasma [19:22]
- ★ **Esophageal groove**: เงยกินจากเต้านม → groove ปิด → นมเข้า abomasum · ก้มกินจากถัง → groove ไม่ปิด → bloat [20:28]

## ★ Clinical Signs สงสัย GI [21:02]
1. ★ Anorexia / กินลำบาก [21:34]
2. ไม่ regurgitate / ไม่เคี้ยวเอื้อง (ปกติ ≥8/10 นอนเคี้ยว) [22:08]
3. Body contour ผิดปกติ
4. ★ Paralumbar fossa ซ้าย: เรียบ=อิ่ม · บุ๋ม=ว่าง [23:17]
5. ★ Rumen ballotment: นุ่ม=แป้งนวด · แข็ง=impaction · ลม=bloat · น้ำเยอะ=acidosis [23:48]
6. Contraction: 3 นาทีไม่บีบ = atony · บีบถี่ = hypermotility [24:53]
7. ★ Abdominal pain: หลังโก่ง · เตะท้อง · รอยขี้สองข้าง [26:29]

## ★ Stepwise Workup [27:33]
- ตักอาหารทดลองให้กิน
- General PE → focus GI: ปาก → esophagus → rumen → reticulum → omasum → abomasum → intestine
- ขี้ปกติ: 10-20 ครั้ง/วัน · 30-50 kg/ตัว/วัน

## ★★★ Oral Exam — FMD [30:47]
- น้ำลายยืด = สงสัย FMD ทันที
- ไม่พร้อม disinfectant → กลับบ้าน
- จำเป็นต้องเข้า → ★ **ตรวจฟาร์มสุดท้าย** + เก็บ vesicle ส่ง lab
- ★ วัคซีน cross immunity ไม่กัน — ต้องฉีดให้ถูก type
- ★ Lingual epithelium หลุดเป็นปอก = ลิ้นแดงเปลือกหลุด (เจ็บมาก)

### Abscess ที่ปาก [33:23]
- **Lumpy jaw** (Actinomyces) — invade เข้ากระดูก, palpate non-moveable
- **Wooden tongue** (Actinobacillus) — soft tissue, moveable

## ★★★ Rumen Fluid Tap [38:25]

### Technique
- ผู้ช่วยจับหางลอดใต้ขา ดึงไปข้างหน้า
- ★ Landmark: last rib ⊥ × stifle ลากหน้า
- ★ Spinal needle 18G ≥4 นิ้ว · แทงตั้งฉาก [41:05]

### Tests on rumen fluid (★★★ exam-bait)
| Parameter | Normal | Abnormal |
|---|---|---|
| Color | เขียว-น้ำตาล · concentrate สูง=เทา | — |
| Smell | ขี้วัวคุ้นจมูก | ★ **เปรี้ยว = grain engorgement** |
| ★ **pH** | **5.5–7.5** (cutoff 6.5–7) | <5.5 = **acidosis** [44:21] |
| Protozoa | หลาย species เคลื่อนไหว | acidosis → ตาย |
| ★ **MBRT (Methylene Blue)** | สีหายใน **3–6 นาที** | <3 min = bacterial overgrowth (acidosis) · >6 / ไม่หาย = atony [46:46] |
| ★ **Gram stain** | gram-neg > gram-pos | acidosis → gram+ เพิ่ม [48:54] |
| Sedimentation | ตะกอนแยกใน **4–8 นาที** | เร็ว/ไม่มี = ไม่กิน · ช้า = frothy bloat (เพคติน surface tension สูง) [49:24] |

★ ก่อนเปิดหลอด **liquid paraffin ปิดหน้า** เพื่อคง anaerobic [45:05]

## ★★★ Reticulum & Hardware Disease [51:01]

### Auscultation [51:01]
- ฟังที่ **left ventral, ICS 6-7**
- วางมือ paralumbar ซ้าย → ได้ยิน reticulum บีบก่อน rumen ดัน

### Traumatic Reticuloperitonitis [52:32]
- กิน foreign body (ตะปู ลวดเชื่อม) → ตกใน reticulum → บีบทะลุ → peritonitis
- ★ ถ้าเหล็กยาว → ทะลุ diaphragm → **pericarditis** → murmur + pericardial effusion

### ★ Pain tests [55:40]
1. **Withers pinch**: ดึงหนังหัวไหล่ → ฟัง grunting (ตัวโก่ง · กลั้นหายใจ)
2. ★ **Bamboo/Pole test**: 2 คนสอดไม้ใต้ท้อง → กด pressure ที่ reticulum cartilage → ฟัง trachea
3. ★ **Metal Detector**: sensitivity สูง — บอกแค่มีโลหะ
4. ★ **Cattle Magnet**: ฟาร์มเสี่ยง กรอกแม่เหล็กป้องกัน → ★ **ต้องจดเลข**
5. ★ **Compass test**: ถ้าไม่จด → เข็มทิศจริง (ไม่ใช่ iPhone) → ดูเข็มไม่หมุน N-S

## ★ Omasum [69:53]
- หน้าที่: ดูดน้ำกลับ → content แห้ง → impaction
- Location: ขวา ICS 7-9 · ขนาด ~10 นิ้ว
- ★ Dx: deep palp ICS 7-9 + omasum puncture (needle 15-18 cm)
- ★ Pressure: ปกติ ≤2.6 kPa · obstruction = **8-12 kPa** [73:07]
- เคสจริง: omasum โต 10 ซม. → 2 ฟุต · content ทรายแข็ง → ส่งโรงฆ่า

## ★★★ Abomasum: LDA & RDA [78:32]

### LDA (Left Displaced Abomasum)
- จาก position ปกติ (ขวาล่าง) → **ลอยขึ้นซ้ายบน**
- ★ **Dx**: Auscultation + Percussion → **ping sound** (กังวานเหมือนกลอง)
- Area: ปลายข้อศอก → หัวกระดูกเชิงกรานซ้าย
- ★ **Rolling** = หายได้บ้าง · ไม่บิด

### RDA (Right Displaced Abomasum) ± Volvulus
- ลอยขวา-บน · area ping ใหญ่ + ดังชัด
- ★ **Volvulus = emergency** · area กังวาน
- ★ ทั้ง 2 = **ผ่าตัด**
- ★ ★ Caveat: เป็นนาน → tissue necrosis ขั้วบิด → ผ่าสำเร็จแต่อาจตาย [83:48]

## ★ Intestinal Disorders [85:51]

### Intussusception
- ★ Rectal palp ขวา → คำเจอ **เปลือกหอยเชลล์ฮอกไกโด** (ไม่ใช่หอยแครง) วงแหวนหนา
- Output: ขี้น้อย/ไม่มี

### Intestinal Obstruction
- คำเจอ **แท่งทรงกระบอก**
- เคสจริง: ใยมะพร้าวจากกากมะพร้าวอุดลำไส้

### Cecal Dilatation/Torsion
- ขวา · ตึงเหมือน **ลูกโป่งดัดดอกไม้**

## Peritonitis [92:46]
- วัวสร้าง fibrinogen เร็ว → fibrin ล้อม → ★ rectal palp = peritoneum หนา + adhesion = confirm
- ★ Cull recommendation ถ้า adhesion มาก

## ★★★ Fecal Examination [94:54]
| Finding | Cause |
|---|---|
| น้ำตาล-เขียว, ball, mucus บาง, ★ เตะกับบูทไม่ติด | Normal [95:55] |
| เทา-milky, เปรี้ยว | Acidosis |
| เหลว, กลิ่นเหม็น **หัวกุ้ง**, มีเลือด | Infectious diarrhea |
| ★ แห้งดำ, **cookie roll** | Constipation · **Babesia/Anaplasma** [97:48] |
| Whole undigested fiber | ★ **Hardware disease** [99:25] |
| Mucus เน่าเหม็น | Obstruction late |
| เลือดสด | GI ส่วนปลาย |
| สีช็อกโกแลต (digested blood) | GI ส่วนต้น |
| ★ Pattern: เข้ม น้อย ละเอียด มันเงา | LDA/RDA/stenosis/obstruction [101:32] |

## Abdominocentesis [102:37]
- Needle 18G+ ยาว 8-10 cm
- ★ ตำแหน่ง:
  - ทั่วไป: ขวาสะดือ 1 ฝ่ามือ ventral
  - Hardware: หลัง xiphoid แกนกลาง
  - Uterine rupture: ระหว่างเต้านมกับขาหลัง
- Normal: ไม่มีสี/เหลืองจาง · <5 mL · protein <3 g/dL · WBC <10,000

## ★ Exploratory Laparotomy [107:24]
- ★ **เลือกผ่าซ้ายก่อน** — ถ้าไม่เจอ ยังเปิด rumen ตรวจต่อได้ (rumenotomy fallback)

## ★ Decision Algorithm: Distension [109:25]
- หลัง: symmetry · ซ้าย/ขวา · ventral/dorsal
- กดดู: gas / fluid (splashing) / solid
- Pain: เตะท้อง / รอย

**ขวา**: LDA · cecal · intestinal torsion → rectal palp
**ซ้าย ทั้ง 2 ข้าง ventral**: bloat
**ทั้ง 2 ข้าง ventral**: twins / peritonitis with ascites

## ★★★ Bloat Management [113:40]

### Identify type — Stomach tube
- วัด tube paralumbar → ปาก
- Confirm rumen: ดมปลาย / เป่า + ฟัง stethoscope

### Free gas bloat
- ★ แก๊สพุ่งออก tube → ปลาย tube จุ่มน้ำเห็นฟอง
- = diagnostic + therapeutic

### Frothy bloat
- ★ แก๊สไม่ออก · มี content เป็นฟอง
- ดึง tube → fluid เหนียวฟอง

### ★★★ Trocharization [118:26]
1. Local anesthesia
2. ★ **กรีดหนัง scalpel ก่อน** (หนังเหนียว)
3. ★ **แทง trocar+cannula แรงเดียว** ("เหมือนแค้นกันมาเมื่อชาติปางก่อน")
4. ดึง trocar ออก คา cannula → แก๊สออก
5. ★ ★ **Removal**: ประกอบ trocar กลับ → กดฝ่ามือข้าง → ดึงเร็วๆ พร้อมกัน → ลด leak

## ⚠️ ไม่ได้พูดถึงในคาบนี้
- Vagal indigestion / Hoflund's syndrome
- Abomasal ulcer Type 1-4
- Calf diarrhea (E. coli/rota/crypto specifics)
- Rumen acidosis treatment regimen detail
- Formal DDx tables

## ★★★ High-Yield Exam Predictions
1. ★★★ LDA/RDA ping location & rolling vs surgery [80:37]
2. ★★★ Hardware pain tests (5 อย่าง) [55:40]
3. ★★★ Rumen fluid normals: pH 5.5-7.5 · MBRT 3-6 min · sed 4-8 min [44:21]
4. ★★★ Free gas vs frothy bloat by stomach tube [113:40]
5. ★★★ Trocharization technique [118:26]
6. ★★ F:C 60:40 · กากมัน=concentrate
7. ★★ Esophageal groove (เงย vs ก้ม) [20:28]
8. ★★ Exploratory: ซ้ายก่อน [108:28]
9. ★★ Abdominocentesis ตาม DDx [104:47]
10. ★★ Fecal pattern: cookie roll · undigested fiber=hardware`
},
'szG9lXVvqNo': {
  videoId: 'szG9lXVvqNo',
  title: 'Ruminant GI Surgery I (Standing)',
  subject: 'cliapprum',
  date: '25 Mar 69',
  durationMin: 125,
  instructor: 'อ.แฮม (Surgery — สัตว์ใหญ่/ม้า · รับสอน ruminant year นี้) [10:05]',
  examFormat: 'MCQ — Final scope · Standing field surgery · Rumenotomy/Rumenostomy/RDA omentopexy/Cecal typhlotomy high-yield',
  summary: `# Ruminant GI Surgery I · อ.แฮม

> Week 1/3 ของ Surgery series · focus เฉพาะ **standing procedure** ทั้งหมด · week หน้าจะล้มวัวลงนอน [15:47]
> co-coordinator: "อาจารย์พีท" [13:42]

## 1. Pre-op Assessment [16:52]
- PE → blood (PCV · biochem) → ★ **Electrolytes + UA** สำคัญสุด (ดู ketosis · imbalance) [17:54]
- ตัดสินใจ: medicine vs surgery (ปกติ push medicine ก่อน · invasive น้อย · ค่าใช้จ่ายน้อย)
- ★ Key questions: จำเป็น sx? · medicine ก่อนได้? · คุ้ม? · วัว weak? · ทีมพร้อม? · ส่ง referral?

## 2. Field vs Hospital-based [20:59]
| | Field | Hospital |
|---|---|---|
| Anesthesia | Injectable only | Injectable + gas |
| BP monitoring | indirect cuff (ไม่ accurate) | full |
| Common drug (วัว) | ★ **Xylazine (α2)** | หลายตัวเลือก |

## 3. SSI Classification [24:39]
- **Superficial** (skin/SubQ) · **Deep** (muscle) · **Organ/Space** (internal)
- ★ ASEPTIC สำคัญใน field แม้ compete 100% ไม่ได้ก็ทำ maximum

## 4. Wound Classification [27:13]
- **Clean** — vasectomy
- **Clean-contaminated** — C-section
- ★ **Contaminated/Dirty** — Rumenotomy (มีหญ้า ingesta → peritonitis)
- งาน sx วัวส่วนมาก = contaminated → **antibiotic สำคัญใน field**

## 5. Why Standing? [33:55]
- ล้มลงนอน → ★ **GI rupture** · **muscle/nerve paralysis** จาก compression · **hypomotility** · วัวอาจไม่ลุก
- Standing → monitor ได้ · ไม่ต้อง GA ลึก
- GA ในวัว ต้อง stage 3 plane 2-3 → ไม่มี monitor → เสี่ยง

## 6. Restraint + Approach [29:50]
- ★ **ซอง (chute)** จำเป็น — ไม่งั้น Epidural/paravertebral block ทำไม่ได้
- ★ **Standing**: flank approach (left or right paralumbar fossa)
- **Recumbency** ถ้าจำเป็น (week หน้า)
- C-section → standing left flank ส่วนมาก

## 7. Drug Protocol [49:28]
- **Xylazine** ให้เบาๆ ดู head drop · ataxia (วัว sensitive มาก)
- **Regional anesthesia** สำคัญ — ไม่ต้อง spend dose กับ sedation อย่างเดียว

### Local block 3 ทางเลือก [46:24]
1. **Proximal Paravertebral (T13, L1, L2)** ★ — ปัก L1 โดน TP แล้ว walk-off หาช่องด้านหน้า
2. **Inverted L block** — ครอบคลุม incision line
3. **Incision line block** — ใส่หรือไม่ก็ได้ (ทำเยอะ tissue บวม → เย็บยาก)
4. ± **Epidural** — block แค่ perineal · กันวัวสะบัดหางมาโดน field

## 8. Skin Prep + Suture
- ★ **Clean วัวก่อน** — อาบน้ำ ล้างขี้
- ★ **โกนกว้าง** — เผื่อ paravertebral
- Sterile scrub → drape (drape ปิดแค่ window ใน field — ค่าแพง)
- ★ **Suture material**: เบอร์ 1 = minimum ในวัว (หมาใช้ 0-2)
- Strong + ต้านเชื้อ ไม่อม ขี้/ฉี่ · ถ้าไม่พอ: เทป · สายน้ำเกลือ

## 9. Common GI Surgery (Standing)

### A. RUMENOTOMY [54:37]
**Indications**: hardware disease · foreign body · impaction · chronic bloat
**Foreign body พบบ่อย**: ตะปู · ★ **เสื้อในผู้หญิง (bra)** ★ — ตากผ้าใกล้คอก · ถุงพลาสติก · ใบไม้

★ **Key step: Fix rumen ออกข้างนอกก่อนกรีดเปิด** กัน contamination [57:16]

**Fixation methods**:
1. Continuous suture rumen wall + skin/abdominal wall
2. Fixation ring/Guard (ถ้ามีเงิน)
3. Stay suture 4 จุด (วัวเล็ก/แพะ-แกะ)

**Procedure** [67:10]:
- Vertical incision rumen wall (มีดเบอร์ 21 · ค่อยๆ กรีด)
- ใส่ถุงมือล้วงทับ · manual evacuation · suction ไม่ทัน
- หา foreign body ลึกถึง reticulum
- Reticulum impaction → ★ **siphon (กาลักน้ำ)** ใส่น้ำดูดออก

**Closure (2 layers)** [63:03]:
- Layer 1: Absorbable monofilament · **Continuous**
- Layer 2: ★ **Inverting pattern** — Lembert หรือ **Cushing**

### B. RUMENOSTOMY [78:46]
**Indication**: chronic dysfunction · research (เก็บ content)
ในไทยยังไม่ค่อยทำ · ฝรั่งทำเยอะ

**Procedure** [80:52]:
1. **Circular skin incision** ~4 cm
2. External oblique — blunt dissect ถ้าได้
3. ★ **Internal oblique + Transversus = ห้ามตัด · blunt dissect แหวกเป็น valve** (purse-string effect)
4. Peritoneum → กรีด
5. ดึง rumen เป็น cone · fix 4 corners (Horizontal mattress/Cushing)
6. ★ **Quarter-by-quarter opening** — กรีด rumen ทีละ quarter → continuous suture
7. ใส่ cannula (ถ้ามี)
**Healing**: 7-14 days

### C. RIGHT FLANK OMENTOPEXY (LDA/RDA) [95:38]
**Pathophysiology** [97:09]:
- Abomasum normally ventral right
- กิน concentrate → fermentation → gas → ลอยเป็นลูกโป่ง → มุดผ่านใต้ rumen → LDA
- หนัก → torsion (volvulus) = emergency · acute
- เกิดบ่อย **dairy postpartum ~1 เดือน**

**Diagnosis intra-op** [102:17]:
- ★ Right flank → ดู greater omentum + descending duodenum
- Normal: duodenum **horizontal** ใน greater omentum
- **LDA**: duodenum **tilted vertical** (omentum ดึงไปซ้าย)

**Procedure (Right flank)** [101:13]:
1. Right flank incision (เหมือน rumenotomy)
2. **Reposition**: ล้วงข้ามมาฝั่งซ้าย ดัน rumen → จับ abomasum → ดันกลับมาขวา
3. **Decompression** ก่อนถ้าใหญ่:
   - Gas: เข็ม 14/16 จิ้ม dorsal abomasum
   - Content: เจาะ + suction
4. Catch pyloric region → ดึงมา incision line
5. **Omentopexy**: Mattress suture omentum cranial→caudal · absorbable เบอร์ 1 · ทะลุ omentum → peritoneum → transversus
6. ★ **Fix ventral → dorsal** เพื่อกัน omentum slip down

**Variants**:
- Left flank abomasopexy (เปิดซ้าย fix abomasum + ventral wall)
- Paramedian abomasopexy (week หน้า)
- ★ **Roll-and-toggle (Utrecht/blind)** — Aj. **ไม่แนะนำ — อันตราย ต้องมุดใต้วัว** [110:05]

### D. CECAL DILATION → TYPHLOTOMY [110:35]
1. Right flank incision (~20 cm)
2. ดึง cecum apex/tip ออกมา
3. **Typhlotomy at apex**:
   - ★ Incision **3 cm** (content น้อย) · **6 cm** (เยอะ)
4. **Closure (2 layers)**:
   - Layer 1: Absorbable · simple continuous
   - Layer 2: **Inverting** (Cushing/Lembert)
5. Examine intestine (peristalsis · color · tortion check)

## 10. Closure Technique (Right Flank) [117:35]

★ **เย็บจาก ventral → dorsal เสมอ** เพื่อป้องกัน content ปิ้น/ตก:

| Layer | Tissues | Suture | Pattern |
|---|---|---|---|
| 1 | **Peritoneum + Transversus** | Synthetic absorbable | **Continuous** |
| 2 | **Internal + External oblique** | Synthetic absorbable เบอร์ 1-2 | **Simple cont./Mattress** |
| 3 | **Skin** | Polymerized caprolactam | ★ **Ford interlocking** หรือ **Horizontal mattress** |

★ **Pro tip**: ปิด skin ทำ **simple interrupted 2-3 stitches สุดท้าย** เผื่อ SSI ต้องเปิด drain
★ **เข็ม**: หนังวัว/ควายหนามาก → เคย break · ใช้เข็มเบอร์ 18 ร้อยเอง

## ★★★ Key High-Yield (Final)

1. ★ **Left flank** → rumen sx · **Right flank** → abomasum/cecum/intestine
2. ★ Standing > GA ใน field
3. ★ **Xylazine** = sedation หลักวัว
4. ★ **Paravertebral (T13-L2) + Inverted L** standard ของ flank surgery
5. ★ **Rumenotomy fixation ออกข้างนอกก่อนกรีดเปิด** = กัน contamination
6. ★ **Rumenostomy** → blunt dissect internal oblique + transversus = valve
7. ★ **LDA postpartum dairy** ~1 เดือน
8. ★ **Right flank omentopexy** vs **Left flank abomasopexy**
9. ★ **Suture**: absorbable monofilament inner · nylon/caprolactam outer
10. ★ **Closure**: Continuous (muscle) → Inverting (GI) → **Ford interlocking** (skin)
11. ★ Withdrawal time + antibiotic ใน contaminated wound
12. ★ Healing **14 days** ในสัตว์ใหญ่
13. ★ Cecal typhlotomy at apex 3-6 cm · 2-layer inverting
14. ★ Foreign body: ตะปู (hardware) + bra/plastic
15. ★ Roll-and-toggle = Aj. ไม่แนะนำ (มุดใต้วัว อันตราย)

## ⚠️ ไม่ได้พูดถึงในคาบนี้
- Withdrawal time specific numbers
- Cesarean section detail (ไป week หน้า [33:24])`
},
'8n3oMcJXUiY': {
  videoId: '8n3oMcJXUiY',
  title: 'Ruminant GI Surgery II',
  subject: 'cliapprum',
  date: '1 Apr 69',
  durationMin: 78,
  instructor: 'Sawita team (พี่เซฟ + พี่มด สอนภาคของคาบนี้)',
  examFormat: 'MCQ — Final scope',
  summary: `# Ruminant GI Surgery II · Sawita team

## Overview · ขอบเขตของเลคเชอร์

[0:16] อาจารย์เปิดด้วยการบอกว่าวันนี้เป็น **GI surgery ภาคต่อ** จากคราวที่แล้ว (Surgery I พูดเรื่อง standing surgery — เปิด left/right flank แก้ displacement) วันนี้จะ focus เฉพาะ **G** ก่อนเพราะเนื้อหาเยอะ ส่วนระบบอื่นจะไปรวบในคราวหน้า [0:46] หัวข้อหลักคือ **surgery ที่ทำแบบนอน** (recumbent) ที่เป็น common ใน field ต่อจาก standing flank approach

ขอบเขตวันนี้:
1. ★ **Percutaneous abomasopexy** (เข็มเย็บ + roll-and-toggle) สำหรับ LDA
2. ★ **Right paramedian abomasopexy** (ล้มวัวลงนอน เปิดทางท้อง)
3. ★ **Umbilical hernia** + herniorrhaphy
4. ★ **Inguinal / scrotal hernia**
5. ★ **Ventral abdominal hernia**
6. ★ **Diaphragmatic hernia** (เน้น diaphragmatic-reticular hernia ในควาย)

---

## 1. Percutaneous Abomasopexy (Roll & Tack) [1:16]

**Indication**: Left displaced abomasum (LDA) — แก้แบบ minimally invasive

**Principle**: ★ **ห้ามมี volvulus / torsion** — ใช้แค่กรณี simple displacement

### วิธี A · Roll-and-Tack (เข็มเย็บ) [2:24 – 4:59]
1. ล้มวัวลง **นอนตะแคงขวา** (right lateral recumbency) → abomasum ลอยขึ้นด้านบน
2. **Roll** วัวกลับไปกลับมาประมาณ 45°
3. หลัง roll ฟัง **ping sound** บริเวณ xiphoid process / anterior to umbilicus
4. ใช้ **เข็มยาวใหญ่** ปักผ่าน skin → ทุก barrier layer → ถึง abomasum → เกี่ยวขึ้นมา
5. เย็บประมาณ **3–4 sutures** ด้วย **non-absorbable suture** [4:29]

### วิธี B · Roll-and-Toggle [4:59 – 6:31]
1. ล้ม + roll + ฟัง ping
2. ใช้ **trocar/cannula** เจาะผ่าน skin → abomasum
3. ใส่ **toggle** (มี bar กั้น + ไหม/เชือกยาว) เข้า trocar
4. ถอด trocar → toggle bar lock อยู่ใน abomasum
5. **เจาะรูที่ 2** ห่างไปด้านหลัง → ใส่ toggle ตัวที่ 2 → ผูกเชือก 2 เส้นเข้าด้วยกัน
6. ★ **ทิ้งไหมไว้ 4–6 สัปดาห์** เพื่อให้เกิด fibrosis ติดกับ abdominal wall [6:31]

### Demo clip [7:09 – 11:27]
- ★ ฟัง ping แล้วเจาะเลย โดยไม่ roll back-and-forth ครบ
- เข็มใหญ่มาก (เล็กไม่ penetrate ทุกชั้น)
- หลัง surgery: **fluid + electrolyte** (วัวเสีย electrolyte จาก displacement) [9:50]

### Caveat สำคัญ
- ★ **มั่นใจว่าไม่มี volvulus** ก่อนทำ — ถ้าบิดหมุนแล้วทำ closed pexy ไม่ได้

---

## 2. Right Paramedian Abomasopexy [14:29]

**Indication**: ใช้ได้ทั้ง left และ right displacement · ใช้เมื่อ closed pexy ไม่สำเร็จ

### Patient selection ★★ [14:59]
**ห้ามทำ** ถ้าวัวมีภาวะที่ทำให้ลุกลำบาก:
- Muscle disorder
- ★ **Ketosis**
- ★ **Milk fever**
- ภาวะอื่นที่ทำให้ recumbent animal ลุกขึ้นยาก

### Technique [15:32]
1. Roll วัวกลับให้ abomasum อยู่ตำแหน่งปกติ
2. เปิด **paramedian approach** (คล้าย small animal laparotomy)
3. กรีดยาว → เจอ abomasum
4. เกี่ยว **peritoneum + internal sheath ของ rectus abdominis**
5. ใช้ **suture เบอร์ใหญ่ที่สุด** (เบอร์ 0, 1, หรือ 2)
6. เย็บ **horizontal mattress 3 ชั้น**
7. ปิด skin เกี่ยว internal sheath เข้าไปอีกที

---

## 3. Umbilical Hernia [30:20 – 52:07]

### Etiology [30:20]
- ส่วนมาก **congenital** (incomplete development ของ umbilical ring)
- ★ **Genetic predisposition** — พ่อแม่เคยเป็น ลูกมีโอกาส
- เจอบ่อยใน **Holstein-Friesian** · ★ **เพศเมีย > เพศผู้**
- มักเจอตอนวัว ★ **อายุ 1 เดือน** — แก้เล็กง่ายกว่ารอโต

### Classification [31:51]
- **Uncomplicated**: reducible, no infection
- **Complicated**: + infection / urachal remnant / abscess / adhesion / rupture

### Diagnosis [32:23]
- ล้มลงนอน → deep palpation
- **Ultrasound** เพื่อดู content
- Differential: mass

### Treatment by Size

| Size | Approach |
|------|----------|
| **< 2 cm** | Conservative — ผ้ารัด + ดัน ring ทุกวันให้ irritate → heal |
| **> 5 cm** | ★ **Herniorrhaphy** (surgical) |
| **> 10–15 cm** | ★ **Mesh** (synthetic) |

### Pre-op [34:59]
- **GA**
- Fasting:
  - เด็ก (5–7 wk): **< 24 hr**
  - โต: **24–48 hr**
- Local: **box block รอบ hernia**

### Surgical Technique [35:59]
1. Stay suture ตึง prepuce (ตัวผู้)
2. ★ **Elliptical incision** (เสี้ยวพระจันทร์) รอบ hernia
3. Dissect จนเหลือ hernia sac
4. ตัดสินใจ: **closed** หรือ **open** technique

### Closed Technique [36:30]
- ใช้กับ hernia เล็ก · no complication · reducible
- ดัน content กลับ → เย็บปิด ring **โดยไม่เปิด sac**
- ★ Aj. มด ถ่ายภาพให้ใน slide

### Open Technique [37:03]
- ใช้กับ: non-reducible · adhesion · remnant · infection
- เปิด sac → แก้ไข complication (เช่น **resect bowel ถ้า strangulation**) → ดันกลับ → เย็บปิด

### Suture Pattern [45:29, 50:05]
- ★ **Mattress pattern** (horizontal mattress) — strength สูง
- Ventral abdomen → content ตกลง → ต้องการ pattern ประคอง
- ★ **Pre-place sutures ทั้งหมดก่อน แล้วดึงพร้อมกัน** → distribute pressure (hernia ใหญ่)
- **Suture material**: absorbable แต่สลายช้า เช่น **polyglyconate / polydioxanone**
- Hernia ใหญ่ high tension → **non-absorbable** หรือ **overlapping (Mayo) pattern**

### Mesh Hernioplasty [51:36]
- Synthetic mesh (พลาสติก / polypropylene)
- ทำเป็น **open** → วาง mesh ปิด ring → เย็บ interrupted/mattress

### Demo clip (วัว 4 เดือน อินเดีย) [38:12]
- ใช้ **xylazine + ketamine** [43:03]
- Elliptical skin incision → blunt dissect
- Reduce content → เย็บ sac (close) → เย็บ skin
- ★ Horizontal mattress for ventral hernia

---

## 4. Inguinal / Scrotal Hernia [52:39]

### Epidemiology
- เจอบ่อยใน **breeding bulls** (พ่อพันธุ์ราคาแพง)
- ปกติฟาร์มไม่เลี้ยงเพศผู้ ยกเว้นใช้ผสม → ผ่าตัดเพื่อรักษามูลค่า

### Inguinal vs Scrotal [53:10]
- **Inguinal**: content ผ่านแค่ inguinal canal
- **Scrotal**: content ผ่าน inguinal canal ลงมาถึง scrotal sac

### Diagnosis ★ [53:41]
- ★ Scrotal = **"hourglass shape"** — ไม่กลม แต่ shape ยาวลง
- DDx: testicular edema · varicocele · orchitis (กลม) vs hernia (loop)
- **Rectal palpation** — ดู internal inguinal ring เปิดหรือไม่
- **Decreased borborygmus** ถ้า bowel ถูกบีบ
- US ภายนอก → เห็น bowel loops

### Surgical Approach [55:46]
1. **Lateral recumbency** + sterile
2. กรีด skin **15–20 cm**
3. ★ **Castration testis ออก** (ปิด ring สนิท · ไม่ recur)
4. Reduce content → เย็บปิด

---

## 5. Ventral Abdominal Hernia [57:18]

### Etiology
- ★ **Trauma** (ขวิด · วิ่งชน · เตะ) — บางครั้งผิวภายนอกไม่มีแผลแต่ภายในฉีก
- Content ใหญ่: rumen · abomasum · omentum · intestine · cecum

### Locations
- ข้าง flank · pelvic · **prepubic rupture** (ในวัวท้อง)

### Treatment [58:19]
- ล้มนอน → close หรือ open
- ★ เย็บ **muscle 3 ชั้น** ด้วย **mattress pattern**
- ถ้า rumen ออกซ้าย → **ไม่ต้อง pexy** เพิ่ม

---

## 6. Diaphragmatic Hernia [59:22]

### Epidemiology [59:22]
- ★ **ในควาย > วัว**:
  - วัว: อาวุธ = ขาเตะ → ไม่ rupture diaphragm
  - **ควาย: เขาขวิด + กระทืบ** → impact แรง

### Pathophysiology [60:25]
- ★ Content ที่ทะลุเข้าช่องอก = **reticulum** (อยู่หน้าสุด)
- เกิด **reticulo-peritonitis** ถ้า rupture
- เรียก **diaphragmatic-reticular hernia** เมื่อ reticulum involve

### Diagnosis [60:56]
- **Respiratory distress** — ยืนเฉยๆแต่หอบ
- Auscultation: ★ **absence of respiratory sound** ที่ thorax + **muffled** + **GI sound ใน thorax**
- **Ultrasound** — bowel loops ในช่องอก

### Surgical Approach

#### กรณีทั่วไป [62:33]
1. **GA** + ★ **mechanical ventilator**
2. เหตุผล: thoracic = negative → เปิดเป็น positive → **lung collapse**
3. Approach: **midline / cyphoid laparotomy**
4. ดึง content ออก → เย็บปิด diaphragm
5. ใหญ่มาก → **mesh**
6. Watch: pneumothorax · pleural effusion · chest tube

#### Diaphragmatic-Reticular (วัวโต) — 2-Stage Surgery ★ [64:05]
1. **Stage 1**: Standing **left flank rumenotomy** → ดึง body ของ reticulum กลับช่องท้อง
2. **Stage 2**: ★ รอ **2–3 วัน** → GA → midline → เย็บปิด defect
3. (อาจารย์: "ไม่ซีเรียส" สอบ — รู้ concept พอ)

### Complications [65:06]
- Suture abscess · pneumothorax · peritonitis
- ★ พันช่องอก/ท้อง support หลัง surgery (content ใหญ่ดัน suture แตก)

### Demo clip (ควายอินเดีย 6 ขวบ) [66:07]
- 2-stage approach
- ★ **One-hand suturing** (defect ลึก เครื่องมือลงไม่ถึง)
- เอเชียขาดไหม non-absorbable เส้นใหญ่ → ใช้ silk (risk peritonitis)

---

## ⭐ Key Exam Points

1. ★ **Closed pexy** = simple displacement, no volvulus
2. ★ **Right paramedian** = ห้ามใน ketosis / milk fever / muscle disorder
3. ★ **Umbilical hernia** = แก้ตอน 1 เดือน · Holstein-Friesian + เพศเมีย
4. ★ **< 2 cm conservative · > 5 cm herniorrhaphy · > 10-15 cm mesh**
5. ★ **Closed vs Open** ขึ้นกับ reducibility + complication
6. ★ **Mattress + pre-place sutures** สำหรับ ventral hernia
7. ★ **Scrotal hernia** = hourglass · ★ ต้อง castrate
8. ★ **Diaphragmatic-reticular ในควาย** → 2-stage (rumenotomy → 2-3 วัน → diaphragm)
9. ★ Diaphragmatic = **mechanical ventilator** (negative → positive)
10. ★ **Reticulum** = อวัยวะทะลุเข้าช่องอกบ่อยสุด

## Out-of-Scope (อาจารย์ระบุ [72:43])
- ไม่เน้น eye enucleation · จะลงในอนาคต urinary system + dehorning + ตัดนม`
},
'OQIW6zyubcs': {
  videoId: 'OQIW6zyubcs',
  title: 'Ruminant Surgery (Head/Neck/Udder/Urinary/Stifle/Digit)',
  subject: 'cliapprum',
  date: '8 Apr 69',
  durationMin: 95,
  instructor: 'Surgery staff (อ.ตั้ม + อ.ผึ้ง สอนภาคของคาบนี้)',
  examFormat: 'MCQ — Final scope · เน้น **หลักการ** ของแต่ละ procedure · Aj. confirm [90:09] "ข้อสอบง่าย เอาแค่หลักการ ไม่ลงดีเทล"',
  summary: `# Ruminant Surgery (General + Selected) · 8 Apr 69 · ~95 min

> เก็บตก surgery จาก GI · common ที่เจอใน field · ไล่จากหัว → ท้าย → ขา · ★ เน้น **หลักการ** ไม่ลงดีเทล [6:11]
> ⚠️ Lecture นี้ครอบเฉพาะ Head/Neck/Udder/Urinary/Stifle-patella/Digit (BSP + Tendon surgery ไม่ได้สอนในเทปนี้)

---

## 🐄 PART 1 · Dehorning [6:43]

### Why dehorn
- เขา = อาวุธ · cosmetic · prevent trauma · fence space
- ควาย ★ ไม่ค่อย dehorn (เขาสวย = มีราคา)

### Age windows [8:16]
- **<2 mo**: bud ยังไม่ attach skull → ง่าย เลือดน้อย
- **2-4 mo**: cornual process เริ่ม fuse กับ frontal bone
- ★ **>4 mo**: alveolar sinus เชื่อมเขาแล้ว → ต้องอุปกรณ์

### Anesthesia
- **Cornual nerve block**: 2% lidocaine 3-10 ml ใต้เขา หลัง lateral canthus
- bull aggressive → เพิ่ม **xylazine**
- ลูกเล็ก/horn bud อาจไม่ต้อง block

### Methods by age [11:21]
| Age | Method |
|---|---|
| 0-3 mo | **Chemical** (KOH/NaOH/Ca(OH)₂ paste) — ป้าย bud · เทปพันกัน mom เลีย |
| ~3 mo+ | **Thermal/cautery** |
| Older | **Mechanical** — Tubing/Scoop/Electric saw/**Gigli wire** |
| All | **Polled breeding** (genetic) |

### Cosmetic dehorning [18:18]
- Block cornual → กรีด skin → เลาะลงโคนเขา → ตัด → ★ **primary closure**
- Pro: หาย primary · สวย
- Con: cost · ★ risk **frontal sinus fracture** ถ้าตัดแรง

---

## 🦠 PART 2 · Sinusitis/Empyema [21:55]

- **Etiology**: post-horn infection · respi · fungal
- ★ ส่วนมาก **frontal sinus** (communicate กับ horn)
- Maxillary rare · มาจาก oral problem
- **Signs**: น้ำมูกเรื้อรัง · กลิ่น · หน้าบวม
- **Dx**: PE · Xray (ปกติ air-filled · sinusitis = fluid/mass) · endoscopy

### Trephination sites [25:02]
1. Post-orbital diverticulum — 4 cm caudal lateral canthus
2. Turbinate part — 2.5 cm lateral midline · caudal nasal bone
3. Rostral frontal sinus
4. Main frontal sinus — เจาะตรงไหนก็ได้
5. Maxillary: บน facial tubercle [26:43]

### Procedure [26:43]
- ★ Standing
- Local infiltration → กรีด skin ยาว → exposed bone (periosteal elevator) → trephine drill / อ.ตั้ม ใช้อุปกรณ์พิเศษ + ค้อนตอก
- Flush 1-2 ครั้ง/วัน × 2 weeks · saline หรือ **povidone-iodine + saline**
- ★ ขณะ flush: **กดหน้าวัวลง** ไม่ให้เงย → ไหลออกทางจมูก
- + systemic antibiotic
- ★ **secondary intention** — ห้าม primary closure (anaerobic → เชื้อไม่ตาย)

---

## 🌽 PART 3 · Esophageal Obstruction (Choke) [29:16]

- **Cause**: ผลไม้/อาหารแข็ง
- **Signs**: salivation · dehydration · ไอ · bloat (complete obstruction) · ★ ยืดคอ + retching reflex
- **Dx**: คลำคอ · Xray
- **Initial Tx (non-surgical)**:
  1. Stomach tube ดันลง rumen
  2. ล้วงด้วยมือ
  3. เจาะระบายแก๊ส (trocar) ถ้า bloat
  4. ★ Hand extraction ทางปาก (วัวไม่มีฟันหน้า)

### Cervical esophagotomy [32:26]
- Lateral recumbency · ★ **ด้านซ้าย** (esophagus อยู่ left of trachea)
- กรีด → เอา foreign body
- ★ **Primary closure** (ทางผ่านอาหาร · secondary = infection)
- **Suture (2 layers)**:
  - Layer 1 (mucosa+submucosa): continuous/interrupted · long-lasting absorbable หรือ non-absorbable
  - Layer 2 (muscular): interrupted/mattress · absorbable ก็ได้

---

## 👁️ PART 4 · Enucleation [34:28]

- **Indication**: trauma · perforated globe · severe ulcer
- ★ **2 nerve blocks**:
  1. **Auriculopalpebral** — ใต้หู · 5-10 ml lidocaine
  2. **Retrobulbar** — 4 จุด: dorsal · ventral · medial · lateral
- ★ ใหญ่ทำ **standing** ได้ → local แม่นสำคัญ
- Procedure: clamp eyelid (Allis) → กรีด 0.5-1 cm รอบ skin margin → เลาะ extraocular muscles + nerves → ligate → ตัด → เย็บปิด

---

## 🥛 PART 5 · Teat/Udder Laceration Repair [38:08]

### Anatomy [39:10]
- Layers: mucosa → submucosa → muscular → skin
- Gland sinus → annular ring → teat canal → orifice
- Blood: pudendal + mammary artery (ด้านบน) · teat = capillary

### Anesthesia [41:15]
- Sedation: xylazine + butorphanol ถ้าปวดมาก
- ★ **Tourniquet ที่ฐาน teat** (regional + hemostasis)
- **Ring block** รอบ teat + **inverted L** บริเวณกรีด
- Epidural optional

### Repair [42:49]
- Sterile prep · debride · hemostasis
- ★ **Cannula technique**: สอด cannula ใน teat canal
  - Locate canal · ป้องกันเย็บปิด canal · drain นมระหว่างหาย
- Suture in layers: mucosa-submucosa interrupted/continuous (absorbable) · skin interrupted/vertical mattress
- ★ **ห้าม "รีดด้วยมือ"** หลังผ่า → infection · ใช้ **เครื่องปั๊มนม**
- ★ **Intramammary antibiotic** ผ่าน cannula · finger-trap suture เก็บ cannula

---

## 💧 PART 6 · Urolithiasis & Urethrostomy [49:10]

### Anatomy [49:40]
- ★ Male: **diverticulum at ischial arch** + **distal sigmoid flexure** (หลัง scrotum) — site แคบสุด
- ★ **Stone ติด distal sigmoid flexure บ่อยสุด**
- ★ **Steers (ทำหมันเร็ว)** เป็นบ่อย — urethra แคบ (คล้ายแมว)
- Stones: silicate · phosphate

### Approach [51:44]
- Dorsal recumbency (ง่าย) · standing ถ้า bladder ใหญ่
- **Site options**:
  - Perineal (high) — ไม่นิยม · ลึก
  - ★ **Low urethrostomy** ★ — เปิดเหนือ scrotum (above sigmoid flexure) — drain ดี · นิยมสุด

### Procedure (uncomplicated) [53:48]
1. Epidural
2. กรีด skin เหนือ scrotum
3. Blunt dissect → reach penis
4. กรีด tunica → expose penis · disect retractor penis muscle
5. คลำหา stone → clamp + tourniquet
6. **Urethrotomy ทาง ventral surface** ของ penis · เอา stone ออก
7. เย็บปิด layer-by-layer

### Bladder rupture/uroperitoneum [58:08]
- ผ่า + cystopexy
- หรือ **penectomy + permanent urethrostomy** (sex reversal):
  - ★ วัวไม่มี os penis → ตัดได้
  - สอด feeding tube → กรีดเปิด urethra → แบะ (filet) → เย็บ mucosa-skin (เฉพาะ dorsal)
  - ทิ้ง tube **10-14 วัน**

---

## 🍼 PART 7 · Persistent Urachus [64:28]

### Pathology
- Urachus fetus: ต่อ bladder → umbilical cord → drain urine
- หลังเกิดควรปิด · ไม่ปิด = persistent → urine ไหลออกสะดือ

### Signs
- ★ **Urine dripping ที่สะดือ** (pathognomonic)
- คลำ tubular structure จากสะดือไป bladder
- US confirm
- Sequela: omphalitis · uroperitoneum

### Procedure [67:37]
1. Dorsal recumbency
2. Elliptical incision รอบ umbilicus
3. Blunt dissect → tubular structure → reach bladder apex
4. Ligate urachus ที่ bladder · monofilament absorbable
5. ตัด urachus + สะดือ
6. เย็บปิด bladder rim · continuous + Lembert (inverting) — กัน urine leak
7. Close abdomen layer-by-layer
- ★ Risk: **ventral hernia** ถ้า abdominal wall ปิดไม่ดี

---

## 🦵 PART 8 · Upward Fixation of Patella (UFP/"ขาทก") [75:24]

### Pathology
- **Medial patellar ligament** ค้างเหนือ medial trochlear ridge → patella ล็อก extension
- Predisposition: medial trochlea ใหญ่กว่า lateral · poor nutrition · over-exercise
- Aj. confirm "ไม่เคยทำเอง · เล่าให้ฟัง"

### Tx — Medial Patellar Desmotomy [77:25]
**3 methods**:

1. **Standing (Indian-style)** — เคียว/มีดวงพระจันทร์ สอดเข้า medial · ตัดทันที · ไม่เย็บ · พ่นยา
2. **Open desmotomy (textbook)**:
   - Lateral recumbency · ขาที่เป็นด้านบน · ผูก 2 ขา
   - Sedation: xylazine 0.1 mg/kg · local 8-10 ml
   - กรีด skin → locate ligament → dissect ตัด → เย็บปิด skin
   - ★ ปล่อยวัวลุก — ทำถูก = เดินปกติทันที
3. **Wire/needle (advanced, hospital)** [83:23]:
   - เข็มชมพู (large gauge) เป็น guide
   - สอด wire/suture คล้องผ่าน ligament
   - ดึงตัด (Gigli-style)
   - ★ Aj. แนะนำ: "วิธีนี้เวิร์คมาก — แผลเล็ก · infection น้อย"

---

## 🐾 PART 9 · Digit/Claw Amputation [86:31]

- ★ วัว **compensate ด้วยกลีบที่เหลือ** ได้
- **Procedure**:
  1. ★ **Tourniquet เหนือ joint** (hemostasis + regional)
  2. Locate **interphalangeal joint**
  3. Horizontal skin incision รอบ joint
  4. Dissect ผ่าน skin → bone → joint capsule
  5. หนาเกิน → ใช้ **embryotomy wire** ตัด joint capsule + bone
  6. Disect collateral ligament + joint capsule → digit หลุด
  7. ★ **Pressure bandage แน่น × 3 วัน** (ระงับเลือด · กัน edema)
  8. ถอด → หาย **secondary intention**
- **Risks**: pododermatitis · supporting limb laminitis · ascending infection · pathologic fracture

---

## ⚠️ ไม่ได้สอนในคาบนี้ (เทียบกับ exam scope)
- ★ **BSP (Bovine Spastic Paresis)** — Aj. ไม่พูดเลย
- ★ **Tendon surgery / Tenotomy** — ไม่พูดเลย
- Fracture repair (long bone)
- Castration (จะมี hands-on วันที่ 20 [16:45][91:09])
- Hernia repair แยก (touch ผ่านๆ ใน urachus context)

## 📝 Aj.'s exam emphasis [90:09]
> "ข้อสอบง่าย เอาแค่หลักการ · ไม่ลงดีเทล"
> สิ่งที่ต้องจำ:
> - **Position** ของแต่ละ procedure
> - **Suture pattern** ที่เหมาะกับ tissue
> - **Site/landmark**
> - **Local block** ของแต่ละ procedure`
},
'KAbtQmSMgQo': {
  videoId: 'KAbtQmSMgQo',
  title: 'Hoof Health Assessment & Herd Management',
  subject: 'cliapprum',
  date: '22 Apr 69',
  durationMin: 51,
  instructor: 'อ.ศวิตา (per syllabus)',
  examFormat: 'MCQ — Final scope · ★★★ Locomotion scoring application · Foot rot/Laminitis/Sole ulcer/DD mentioned briefly',
  summary: `# Hoof Health Assessment & Herd Management · อ. (likely อ.ศวิตา)

> ⚠️ NOTE: lecture นี้ **ไม่ใช่** lecture สอน Foot rot/Laminitis/Sole ulcer/DD รายโรค — เป็น **applied locomotion scoring + management decision flow** ในฟาร์มจริง · โรคพวกนี้ถูก mention แค่สั้นๆ เป็น differential สาเหตุของวัวเลม

## 🎯 Scope [0:02]
อ.บอกตรงๆ "ไม่ได้มาคุยเรื่องการประเมิน locomotion score รายตัว" (assume เรียนแล้วเทอมก่อน) — แต่จะคุยว่า **เอา locomotion scoring ไปใช้จริงในฟาร์มยังไง** [0:35]

> "ตอบคำถามถูกต้องหมด..แต่ถ้าตั้งโจทย์ว่าลองไปประเมิน locomotion score ในฟาร์มนี้ซิ...อันนี้จะเกิดปัญหา" [1:07]

**Objective** [1:38]:
1. หลักคิดเข้าฟาร์มประเมิน
2. แปลผล % locomotion score
3. บอกสาเหตุกว้างๆก่อน investigate
4. วางแผนจัดการสุขภาพกีบ

## 🧭 4 ประเด็นต้องคิดก่อนเข้าฟาร์ม [3:13]
1. **Timing** — ตอนไหน?
2. **Location** — ตำแหน่งไหน?
3. **ID recording** — จดเบอร์ครบยังไง
4. **Interpretation** — แปลผลก่อน investigate

> "สัตวแพทย์ต้องเข้าไปในฟาร์มสักระยะ...เพื่อให้เห็น **workflow**" [4:46]

## 🏠 Farm example [5:48]
- 50 ตัว · pipeline 12 (6 ฝั่ง)
- ขาไป (โรงเรือน → โรงรีด) = พื้นสโลปชัน
- ขากลับ = พื้นเรียบ

## ⏰ Timing [8:18]
**3 หลักการ**:
1. ไม่รบกวน workflow
2. ใช้คนน้อย (2-3 คน)
3. ★ โค **เดินอย่างอิสระ** (ไม่ถูกไล่)

> ถ้าไล่ → ตัวเจ็บอาจวิ่งไปเลย → score ผิด [10:22]

★ **Answer ฟาร์มตัวอย่าง: หลังรีดนมเสร็จ** [10:55]
- ออกจากโรงรีด 6 ตัว → เดินกลับทางพื้นเรียบ
- มีระยะ + เวลา (รออีกฝั่งรีดเสร็จ)
- เดินอิสระ

**ก่อนรีด theoretical ดี** (น้ำหนักนมโหลด → ↑sensitivity) แต่ practical ทำไม่ได้ (พื้นสโลป + ถูกไล่) [14:30]

## 📍 Location [15:32]
**4 หลักการ**:
1. ไม่รบกวน + safety zone
2. คนน้อย
3. ★ พื้นเรียบ ราดเอียง
4. ★ ระยะตรง **≥ 4 เมตร**

> ใกล้เกิน → โคหยุด → "รถติด" [16:33]

## 🔢 ID recording [18:09]

★★★ **Practical shortcut**:
- เดิน lame มาก = score 4-5 (ไม่สนใจหลัง)
- เดินไม่ lame + หลังตรง = score 1
- เดินไม่ lame แต่หลังโค้ง = score 2-3

★ **ตัวอย่าง**: 6 ตัวออกมา ไม่เลม + หลังตรงหมด → score 1 → ★ **ไม่ต้องจดเบอร์**
★ ออก 6 ตัว มี 3 ตัวเลม 4-5 → ★ **เข้าไปจดเบอร์ในคอกตอนกินอาหาร** (โคไปยืนกินที่รางหลังรีด — Udder Health management ปิดรูหัวนม) [23:22]

## 📊 Interpretation [25:25]

★★★ **Ideal targets** (ฟาร์มควบคุมดี):
- **Score 1 (เขียว) = 70-80%**
- **Score 2-3 (เหลือง) = 20-30%**
- **Score 4-5 (แดง) = 0%** (อุดมคติ · จริงเจอได้)

**3 เงื่อนไขที่ต้องมีพร้อมกัน** [29:38]:
1. Routine trimming **≥ 2 ครั้ง/ปี**
2. Feeding management monitoring (control acidosis)
3. Hygiene โรงเรือน

## 🦠 ทำไมยังเจอวัวแดง [27:33]

> Routine trimming ป้องกัน **sole ulcer โดยตรง**

วัวแดงเกิดจาก **2 สาเหตุ** [28:35]:

**1. โรคติดเชื้อ** [29:08]
- ★★★ **Foot rot**
- ★★★ **ID (Interdigital dermatitis)**
- ★★★ **DD (Digital dermatitis)**
- **Heel (He)**

> ปัจจัยโน้มนำหลัก = **สุขศาสตร์โรงเรือน**
> มูลโคหมัก → physical damage + เชื้อโรคหมัก → irritate
> + แอมโมเนีย → "พิษต่อกลีบ" → keratin cell bond อ่อนแอ [31:43]

**2. Nutrition / Laminitis** [29:08]
- ★★★ **Laminitis = เกิดจาก acidosis**
- Monitor 2 อย่าง: **R/C ratio** + **particle size**
- TMR → acidosis ยาก
- Component feed → swing → acidosis เกิดได้
- ★ Heat stress → หยุดเคี้ยวเอื้อง → โน้มนำ acidosis

## 🩺 Decision tree

### Case 1: ฟาร์มมี routine trimming + score 2-3 = 55%, score 4-5 = 3% [32:49]
**ขึ้นกับ timing เทียบ trimming cycle**:
- กลาง cycle → **ไม่น่ากังวล**
- เพิ่งผ่าน trimming ~1 เดือน → **น่ากังวล · investigate**

**Investigation order**:
1. Hygiene โรงเรือน
2. Feeding management
3. Trimmer skill (ตัดผิด → sole ulcer มาก)

> ★ **Cut-off ไม่ใช่กฎตายตัว** — อย่าตัดสินทันที [36:26]

### Case 2: ฟาร์ม **ไม่มี routine trimming** + score เดียวกัน [38:02]
**น่ากังวลมาก** — score 2-3 รอ turn เป็น 4-5 จาก sole ulcer

**3 differential**:
1. ★★★ Sole ulcer
2. Claw horn disorder
3. โรคติดเชื้อ + Laminitis

## 🔧 Management plan

### Step 1: เอา score 2-5 ทั้งหมดเข้า routine trimming [40:44]
- Hoof Exam: ขา → กีบ (Coronary band + Interdigital + dimension) = 80% info
- ★ **80% ที่เหลือ + final dx = ปาดกลีบบางๆ (routine trimming)**
- ฟาร์ม 50 ตัว · score 2-5 รวม ~58% = **เกือบ 30 ตัว**

### Step 2: Priority — ★ vet ต้อง educate
- เกษตรกรอยากทำวัวแดงก่อน (เห็นชัด) [43:16]
- ★ vet: **วัวเหลือง = impact สูงกว่า** (ทำแล้ว turn เขียวทันที)
- ★ Compromise: 10 ตัว/ครั้ง = **3 แดง + 7 เหลือง** [44:51]

### Step 3: Routine trimming = Final dx [45:22]
ขณะ trim:
- Interdigital + sole ปกติ → ไม่มีปัญหากีบ → focus **infectious cause**
- Sole มีปื้น/จุดเลือดออก → ★★★ **Laminitis** → focus **อาหาร**
- Sole ulcer + ไม่มี routine trimming → trim + **เริ่ม routine trimming ป้องกัน**

## 🚐 Reality [46:55]
ในไทย trimmer ไม่พอ → ทยอย ~10 ตัว/วัน · จดบันทึก track

## ❓ Q&A [47:58]
**Q**: รายย่อยประเมินไม่ได้ แต่มี routine trimming → ต้อง score มั้ย?
**A**: **ไม่จำเป็น** — routine trimming ปีละ 2 ครั้ง **ดีกว่า** locomotion score (เห็นกีบโดยตรง)

## 📝 Exam [49:02]
> "ข้อสอบของพี่ = วันนี้ + เรื่องอาหาร · เป็นช้อยส์ · ไม่ยาก"

★★★ **Series เรื่องกีบทั้งหมดเก็บไว้ทบทวนตอนฝึกงานปี 5**

## ⚠️ ไม่ได้พูดในคาบนี้ (ตาม syllabus checklist)
- **Foot rot pathogens** (Fusobacterium · Bacteroides) — ไม่ได้กล่าวถึง
- **Foot rot Tx** specific drugs — ไม่ได้กล่าวถึง
- **Sole ulcer** = "Rusterholz ulcer" — ไม่ได้กล่าวถึง (เรียก "ulcer" เฉยๆ)
- **Sole ulcer typical location (zone 4)** — ไม่ได้กล่าวถึง
- **Digital dermatitis = Treponema** — ไม่ได้กล่าวถึง (เรียก "DD")
- **Strawberry lesion** — ไม่ได้กล่าวถึง
- **Footbath protocol** (copper/formalin/zinc sulfate) — ไม่ได้กล่าวถึง
- **Sprecher 1-5** detailed — ไม่ได้กล่าวถึง
- **Dutch 5-step** trimming — ไม่ได้กล่าวถึง

> รายละเอียดโรคให้ดูจาก lecture อื่นใน Hoof Health series (lecture 1-6) เทอมก่อน — lecture นี้คือ **applied herd assessment + management decision**`
},

  // ═════════════════════════════════════════════════════════════════
  // COM I (Y4 sem 1) — DekDokVet85 (Vet 85 cohort, recorded 2024)
  // ═════════════════════════════════════════════════════════════════
  // 1.2 Oral Tumor (benign vs malignant + tx planning · pairs with 1.1)
  CQIrJmz3APo: {
    videoId: 'CQIrJmz3APo',
    title: '1.2 : Oral Tumor',
    subject: 'com1',
    date: '5 Aug 2024 (DekDokVet85 recording)',
    durationMin: 68,
    instructor: 'อาจารย์ COM I (small animal oncology / surgery)',
    examFormat: 'Top-3 incidence + bone-vs-metastasis table + Tx planning by tumor type ออกบ่อย · stage I-IV criteria classic',
    summary: `# 1.2 Oral Tumor — Benign vs Malignant + Tx Planning

> 🎯 Surgery = primary Tx for ALL oral tumors · combine with chemo/radiation/immuno depending on tumor type
> ⚠️ **2 critical features per tumor**: bone invasion + metastasis rate → drives Tx planning

---

# 🟢 Part 1: Non-neoplastic Masses (DDx ก่อนเข้า tumor)

| Disease | Key feature | Cause | Tx |
|---|---|---|---|
| **Gingival hyperplasia** | เหงือกหนาเกิน CEJ | **Drug-induced** (cyclosporine, amlodipine, antiepileptics) · bacterial overgrowth | หยุดยา · scaling · excise if severe |
| **Dentigerous cyst** | บวมรอบ unerupted tooth | ฟันไม่โผล่พ้นเหงือก | Extract tooth + remove cyst |
| **FCGS** (lymphoplasmacytic stomatitis) | แดงทั้งช่องปาก esp. fauces (cat) | Immune dysreg + bacteria · worse with FIV/FeLV | Biopsy first (DDx tumor) · steroids · extract all teeth |
| **Eosinophilic granuloma** | Red ring/thickening at lip/palate (cat) | Food allergy (chicken) · immune | **Hypoallergenic diet first** · surgery if persists |

> 💡 ทุก oral mass ต้อง **biopsy/cytology** ก่อนตัดสินว่าเป็น tumor — บางอันเลียนแบบ cancer

---

# 🔬 Part 2: Tumor Categories

## Benign vs Malignant
| | Benign | Malignant |
|---|---|---|
| Local invasion | ส่วนใหญ่ไม่ลุกลาม (**ยกเว้น AA**) | Locally invasive |
| Metastasis | 0% | ผันแปร 0-70% (depends on type) |
| Surgery alone | จบได้ | ต้อง combine therapy |

## Top Incidence (เก็งสอบ ⭐⭐)

### **Dog** (oral tumor = ~6% of all tumors)
| Rank | Type | % | Class |
|---|---|---|---|
| **1** | **Melanoma** | 30-40% | Malignant |
| **2** | **SCC (Squamous Cell Carcinoma)** | ~25% | Malignant |
| **3** | **Fibrosarcoma** | ~25% | Malignant |
| **4** | **Acanthomatous Ameloblastoma (AA)** | — | Benign (but invades bone!) |

### **Cat** (oral tumor = 3-12%)
| Rank | Type | % |
|---|---|---|
| **1** | **SCC** | **~80%** ⭐ |
| **2** | Fibrosarcoma | — |

> 💡 Cat oral cancer ≈ SCC (เกือบทั้งหมด) · prognosis แย่มาก

---

# 📊 Part 3: Bone Invasion + Metastasis Table ⭐⭐⭐ (high-yield)

| Tumor | Bone invasion | Metastasis | Surgery response | MST |
|---|---|---|---|---|
| **Melanoma** | low | **HIGH (40-70% LN)** | Fair-Good | ~5 mo (good if >1 yr) |
| **SCC dog (non-tonsillar)** | **HIGH** | low | Good | better than melanoma |
| **SCC dog (tonsillar)** ⚠️ | high | high | Fair | poor |
| **SCC cat** | high | low | **Poor** ⚠️ | **<45 days** |
| **Fibrosarcoma** | **HIGH** | low | Fair | better |
| **Acanthomatous Ameloblastoma (AA)** | **HIGH** | 0% | Excellent | >64 mo |
| **Peripheral Odontogenic Fibroma (PoF)** | **NONE** | 0% | Excellent | >64 mo |

> 🎯 **จำง่าย**:
> - แพร่กระจายเก่งสุด = **เมลาโนมา** (อันเดียว)
> - Bone invasion = SCC, Fibrosarcoma, **AA (benign แต่ invade bone!)**
> - PoF = ไม่ invade bone (ตัดง่ายสุด)

---

# 🦠 Part 4: Specific Tumor Profiles

## 4.1 Acanthomatous Ameloblastoma (AA) — Benign แต่อย่ามองข้าม
- ชื่อเดิม: **acanthomatous epulis**
- หน้าตา: ก้อน firm, ผิวค่อนข้างเรียบ (compared to malignant)
- ตำแหน่ง: rostral mandible/maxilla รอบ canine teeth
- **Bone invasion → ต้องตัด wide margin (include bone)**
- Tx: **wide excision + bone** (ไม่ใช่แค่ marginal) → curative

## 4.2 Peripheral Odontogenic Fibroma (PoF) — Benign ที่ตัดง่าย
- ชื่อเดิม: **fibrous epulis** / ossifying epulis
- หน้าตา: ก้อน firm-hard (มีเนื้อเหลือ fibrotic/ossifying)
- โตช้า (เจ้าของบอกเจอมาเป็นปี)
- **NO bone invasion** ← key feature
- Tx: marginal excision + extract adjacent tooth → done

## 4.3 Melanoma — Dog #1 malignant
- **Predisposing breeds**: pigmented gingiva (Cocker, German Shepherd, Golden)
- หน้าตา: ก้อนสีดำ classic (90% มี pigment)
- **Amelanotic melanoma** (~1/3 of cases) — ไม่มี pigment, **MORE AGGRESSIVE**
  - Confirmation: **Melan-A IHC** (immunohistochemistry brown stain)
- ⚠️ **High metastasis** → mandatory regional + thoracic staging
- Best at: **rostral location < 2 cm** (can excise wide)

## 4.4 SCC (Squamous Cell Carcinoma) — #2 dog, #1 cat
### Dog
- **Tonsillar SCC** (rare): aggressive · high metastasis · poor prognosis
- **Non-tonsillar SCC**: less metastasis, more bone invasion · better surgery response
- หน้าตา: ก้อนแดงสด, ulcerative

### Cat
- **80% of cat oral tumors** = SCC
- Risk factors:
  - **Canned food** (high tuna)
  - **Smoke exposure** (passive smoke from owner)
  - **Papillomavirus** induction
- Locations: gingiva, sublingual, **nasal planum** (white cat, sun exposure)
- Prognosis: **MST < 45 days** even with surgery — counsel owner honestly
- Look-alike: FCGS — ต้อง biopsy เพื่อ DDx

## 4.5 Fibrosarcoma — Dog #3, Cat #2
- หน้าตา: firm mass, more aggressive looking than benign
- Mostly large breed dogs
- **Locally invasive bone**, low metastasis, **HIGH recurrence rate** post-op

## 4.6 Osteosarcoma (oral) — rare
- Mostly limb (require amputation) but oral exists
- Tx: maxillectomy/mandibulectomy
- Less aggressive than limb osteosarcoma

---

# 🔍 Part 5: Diagnosis Workflow

## History + Clinical
- Owner sees mass / drooling / bleeding / halitosis / weight loss / facial asymmetry
- **Eyeball protrusion** = maxillary tumor pushing orbital socket
- **Loose tooth without PD** = bone resorption from underlying tumor
- **Cervical lymphadenopathy** = nodal involvement
- Paraneoplastic: anorexia, hypercalcemia (rare)

## TNM Staging (WHO classification)
| Stage | T (size) | N (LN) | M (distant) |
|---|---|---|---|
| **1** | T1 (<2 cm) | N0 | M0 |
| **2** | T2 (2-4 cm) | N0 | M0 |
| **3** | T3 (>4 cm) **OR** any T + N1 | varies | M0 |
| **4** | any T + any N + **M1** | — | M1 |

## Imaging
| Tool | Use |
|---|---|
| **Skull radiograph** | First-line · Bone involvement (~40% bone destruction needed to be visible) |
| **Thoracic radiograph** | Pulmonary mets · detects ≥7-9 mm lesions |
| **CT scan** | Best for **maxillary tumors** (overlapping skull anatomy) · pulmonary mets ≥1 mm · bone destruction earlier |
| **MRI** | Soft tissue infiltration depth |
| **Abdominal U/S** | Distant mets esp. melanoma → liver |

## Sampling (in order of preference)
1. **FNA cytology** — first-line, often without sedation. รู้ว่า tumor vs non-tumor ได้
2. **Tissue biopsy (incisional)** — blade or punch · avoid electrocautery (burns sample)
   - ⚠️ Electrocautery = ห้ามใช้เก็บตัวอย่าง (ใช้แค่ห้ามเลือดหลังเก็บ)
   - เก็บใหญ่พอ · เลี่ยง infected/necrotic area

## Lymph Node Assessment
- **Mandibular LN** at caudal mandible · normal <3-5 mm diameter
- ⚠️ **40% of melanoma dogs have LN mets while LN size still normal** → palpation not enough
- Best: **FNA cytology of LN** or **excisional biopsy + histopath**
- True local control: **sentinel LN mapping** (inject dye → trace) — gold standard

---

# 🛠 Part 6: Treatment

## Surgery Margin Rules
| Tumor type | Margin needed | Example |
|---|---|---|
| **Intracapsular** (sample only) | None | Incisional biopsy |
| **Marginal** | Just past reactive zone | PoF (no bone invasion) |
| **Wide excision (>2 cm)** | 2 cm + bone | AA, small SCC, melanoma |
| **Radical resection** | Entire compartment | Large melanoma, large SCC |

## Surgical Procedures
- **Maxillectomy** (sub-types named by area):
  - Rostral · Lateral · Caudal · Hemimaxillectomy · Bilateral · Total
- **Mandibulectomy** (same naming):
  - Rostral · Lateral · Hemimandibulectomy · Total
  - Total mandibulectomy → tongue droops, may need feeding adjustment
- **Cheiloplasty** (lip reconstruction) — for lip tumors
- **Orbitectomy** — when tumor invades orbit
- **Facial reconstruction** — restore appearance after wide excision

## Other Modalities
- **Cryosurgery** (liquid N₂) — small benign masses · rarely used now
- **Chemotherapy** — combine for melanoma, aggressive SCC
- **Radiation therapy**:
  - Melanoma + SCC respond well
  - Fibrosarcoma + cat SCC = poor response
  - Pre-op for shrinking + post-op for residual disease
  - ⚠️ Each session needs GA · facial mucositis side effect
- **Immunotherapy** — **Melanoma vaccine (Tyrosinase DNA plasmid)**:
  - Indications: post-resection Stage 1-2 · prevent metastasis · slow distant disease
  - Course: ~4 doses, ~20,000 THB each (imported)
  - Some Stage 1-2 patients get >1 year extra survival

## Surgical Complications
| Complication | Note |
|---|---|
| **Hemorrhage** (intra-op + post-op) | Cross-match + transfusion ready · ligate major vessels |
| **Infection** | Pre-op dental scaling · clean OP field |
| **Wound dehiscence** | Avoid electrocautery on oral tissue (burns) · proper suture |
| **Functional deficits** | Tongue droop after total mandibulectomy · feeding tube post-op |

---

# 🤝 Part 7: Supportive Care (palliative)

When surgery isn't feasible:
- **Pain management** (NSAID, opioids, gabapentin)
- **Nutritional support**: feeding tube (esophagostomy, gastrostomy)
- **Oral hygiene** if mass open/bleeding
- Honest counseling: median survival reality

---

# 🎯 Exam High-Yield Recap

1. **Dog top 3**: Melanoma > SCC > Fibrosarcoma · #4 benign = **AA (still invades bone!)**
2. **Cat top**: **SCC ~80%** · MST <45 days
3. **High metastasis**: Melanoma (only one) · 40% LN mets while LN normal-sized
4. **Bone invasion**: SCC, Fibrosarcoma, **AA** (NOT PoF)
5. **AA** vs **PoF**: both benign, AA invades bone (wider excision), PoF doesn't
6. **Tonsillar SCC** = much worse than non-tonsillar
7. **Amelanotic melanoma** = 1/3 of cases, more aggressive, IHC Melan-A confirms
8. **Cat SCC risk factors**: canned food (tuna), passive smoke, white cat sun-exposure
9. **TNM**: T1<2cm, T2 2-4cm, T3 >4cm OR LN+, M1=distant
10. **Surgery margin**: 2 cm minimum + bone for malignant · marginal OK for PoF only
11. **Melanoma vaccine** (Oncept) — Stage 1-2 post-op · ~4 doses ~80K THB

> 📚 อ่านควบ: 1.1 Oral cavity (anatomy + DDx of non-tumor masses) · 7.1 Hemolymph Sx (anemia from chronic bleeding tumor) · oncology surgery principles in Y3 com2`,
  },

  // 8.1 Upper Urinary System (AKI vs CKD — diagnosis + management)
  a9cdFzIKIGA: {
    videoId: 'a9cdFzIKIGA',
    title: '8.1 : Upper Urinary System',
    subject: 'com1',
    date: '7 Oct 2024 (DekDokVet85, อ.วชิรา)',
    durationMin: 115,
    instructor: 'อ.วชิรา (Med II) — small animal urology',
    examFormat: 'AKI vs CKD differentiation · IRIS staging · azotemia vs uremia distinction · Cr/BUN/SDMA interpretation ออกบ่อย',
    summary: `# 8.1 Upper Urinary System — AKI vs CKD

> 🎯 Upper UT = kidney + ureter · Lower UT = bladder + urethra
> ⚠️ "โรคไต" คำเดียวยังไม่พอ — ต้องระบุว่า **AKI** หรือ **CKD** (Tx ต่างกัน)

---

# 📚 Part 1: Definitions

| Term | Meaning |
|---|---|
| **AKI** (Acute Kidney Injury) | Sudden, severe decrease in renal function · **reversible if caught early** |
| **CKD** (Chronic Kidney Disease) | **Irreversible**, progressive loss · ≥3 months duration |
| **Acute on top** (acute on chronic) | AKI in patient with pre-existing CKD · trigger event tips them over |

> 💡 Old terms (acute renal failure / chronic renal failure) replaced by AKI/CKD — current standard

## "โรคไต" Communication
- Owner says "โรคไต" — covers both
- ⚠️ As clinicians, ALWAYS distinguish AKI vs CKD — drives Tx + prognosis differently
- AKI early → can fully recover · CKD → manage, never reverse

---

# ⚠️ Part 2: AKI Causes (sniff for these in history)

| Category | Examples |
|---|---|
| **Toxins** | Grapes/raisins (dog), Lily (cat — entire plant lethal), ethylene glycol, NSAIDs, ACE-i overdose |
| **Drugs (nephrotoxic)** | **Aminoglycosides (gentamicin)**, amphotericin B, cisplatin |
| **Ischemia** | Shock, dehydration, sepsis, anesthesia hypotension |
| **Infection** | **Leptospirosis** (dog) ⭐, pyelonephritis |
| **Immune** | Glomerulonephritis (post-infectious) |
| **Obstruction (post-renal)** | Ureter stones, urethral plug |

> 📝 Classic history: "หมาแอบกินองุ่น 2 วันก่อน, อ้วก, ซึม, ค่าไตขึ้น" → grape toxicity AKI

---

# 🔄 Part 3: AKI Phases (caught early = recoverable)

| Phase | Event | Reversibility |
|---|---|---|
| **1. Initiation** | Toxin/insult hits tubules | **Fully reversible** (catch here!) |
| **2. Extension** | Inflammation amplifies damage | Mostly reversible |
| **3. Maintenance** | Stable damage 1-2 wk | Partial recovery only |
| **4. Recovery** | Residual repair | Some loss permanent → may → CKD |

> 💡 **Phase timing unpredictable** — initiation can be hours; maintenance can be days
> 💡 **Patient caught in 1-2 → full recovery possible · 3-4 → likely some permanent CKD**

---

# 🔬 Part 4: Diagnosis

## Lab Markers
| Marker | Use | Caveats |
|---|---|---|
| **Creatinine (Cr)** ⭐ | Primary — produced by muscle, filtered by GFR | ⚠️ Low in emaciated/cachectic (BCS 1) — masked CKD |
| **BUN** | Secondary | ↑ from high-protein diet, GI bleed (not kidney-specific) |
| **SDMA** (Symmetric Dimethylarginine) | More sensitive than Cr · early CKD detection | Expensive (~400฿ vs 60฿) — not routine |
| **Urinalysis (USG)** | Concentrating ability · isosthenuria (1.008-1.012) = lost concentration | Earliest functional change |
| **UPC** (urine protein:creatinine) | Glomerular dysfunction · proteinuria = poor prognosis | |

## Azotemia vs Uremia (semantic but important)
- **Azotemia** = elevated BUN/Cr (lab finding only)
- **Uremia** = azotemia + **clinical signs** (vomiting, anorexia, depression, oral ulcers)
- Uremia → must have azotemia · azotemia → not always uremic

---

# 📊 Part 5: IRIS Staging (gold standard for CKD)

International Renal Interest Society stages CKD by **stable Cr** (after rehydration, on 2 occasions):

| Stage | Cr (dog) | Cr (cat) | Description |
|---|---|---|---|
| **1** | <1.4 | <1.6 | Non-azotemic · subclinical · USG/UPC abnormal |
| **2** | 1.4–2.0 | 1.6–2.8 | Mild azotemia |
| **3** | 2.1–5.0 | 2.9–5.0 | Moderate · clinical signs |
| **4** | >5.0 | >5.0 | End-stage · severe uremia |

## Sub-staging
- **UPC** (proteinuria): non- (<0.2), borderline (0.2-0.5), proteinuric (>0.5)
- **Blood pressure**: normotensive, borderline, hypertensive

---

# 💊 Part 6: Treatment

## AKI (focus on cause + supportive)
1. **Remove inciting cause** (stop toxin, treat infection)
2. **IV fluids** — restore perfusion · 24-48h aggressive
3. **Manage hyperkalemia, acidosis** (see 8.2)
4. **Anti-emetics** (maropitant), GI protectants (omeprazole)
5. **Diuretic challenge** (furosemide) if oliguric/anuric
6. **Hemodialysis / peritoneal dialysis** if available + severe
7. **Specific antidotes**: ethylene glycol → fomepizole + ethanol drip

## CKD (manage progression + symptoms)
1. **Renal diet** — reduced protein (esp. quality), low phosphorus, high omega-3, alkalinizing
2. **Phosphorus binders** — aluminum hydroxide, sevelamer (when serum P stays high despite diet)
3. **Anti-hypertensive** — amlodipine (cat first-line), telmisartan
4. **ACE-i / ARB** — telmisartan for proteinuria (esp. dog)
5. **Erythropoietin / darbepoetin** — for anemia (CKD anemia non-regenerative)
6. **Hydration support** — SQ fluids at home for cat (IV if hospitalized)
7. **Anti-emetics** for symptomatic uremia (mirtazapine, maropitant)

---

# 📈 Part 7: Anemia of CKD

- **Non-regenerative** anemia (chronic)
- Cause: ↓ erythropoietin from peritubular interstitial cells
- Sub-set of CKD only: depends on which kidney compartment damaged
  - Glomerulus + tubule disease without interstitial cell loss → no anemia
  - Diffuse interstitial damage → anemia + uremia together
- Tx: erythropoietin (rhEPO) or darbepoetin · iron supplementation

---

# 🩻 Part 8: Imaging + Other Workup

- **Abdominal radiograph**: kidney size + outline
  - AKI: kidneys often **normal size or enlarged** (edema)
  - CKD: kidneys often **small + irregular** ("ขรุขระ") or sometimes normal
- **Ultrasound**: cortex/medulla differentiation, infarct, abscess, hydronephrosis (= obstruction)
- **CT**: ureteral obstruction localization (stones)
- **Renal biopsy**: if cause unclear · pre/post bleeding risk

---

# 🐈 Part 9: Species-Specific Notes

## Cat
- **CKD incidence: 1 in 43** (very common!)
- Most common chronic disease in older cats
- Risk: high-protein diet, hypertension, smoke exposure
- Often presents with weight loss, polydipsia/polyuria, vomiting

## Dog
- CKD incidence: 1 in 285
- Often genetic predisposition (some breeds)
- AKI more common than chronic in some clinics

---

# 🎯 Exam High-Yield Recap

1. **AKI** = reversible if caught in initiation/extension · **CKD** = always irreversible
2. **Cr** = best marker · **BUN** affected by GI bleed/diet · **SDMA** = early sensitive
3. **Azotemia ≠ Uremia**: uremia = azotemia + clinical signs (vomiting/anorexia/depression)
4. **Emaciated patient** → low Cr can MASK true CKD (muscle mass = Cr source)
5. **IRIS Stage** based on **stable** Cr (after rehydration, 2 measurements)
6. **AKI causes**: grapes/raisins/lily/leptospirosis/aminoglycosides
7. **Acute on top**: AKI in pre-existing CKD patient → ER situation
8. **Phases**: catch in initiation/extension for full recovery
9. **Cat CKD prevalence 1:43** vs dog 1:285 — cat is the model
10. **Anemia of CKD**: non-regenerative, EPO deficiency, depends on interstitial cell damage
11. **CKD Tx pillars**: renal diet · P-binder · BP control · proteinuria control · anti-emetic · hydration

> 📚 อ่านควบ: 8.2 LUT 1 (z0Id0mmM4Fk · obstruction crisis) · 8.3 Stones (vLjnPuFgvj4 · post-renal AKI cause)`,
  },

  // 8.3 Lower Urinary System 2 (urolithiasis — 5 stone types + Tx logic)
  vLjnPuFgvj4: {
    videoId: 'vLjnPuFgvj4',
    title: '8.3 : Lower Urinary System 2',
    subject: 'com1',
    date: '7 Oct 2024 (DekDokVet85, อ.วชิรา)',
    durationMin: 63,
    instructor: 'อ.วชิรา (Med II) — small animal urology',
    examFormat: 'Stone identification × species/age + dissolution vs surgery decision · struvite Tx (dog vs cat different!) ออกบ่อย',
    summary: `# 8.3 Lower Urinary System II — Urolithiasis (Stones)

> 🎯 5 main stone types · each with distinct etiology + Tx
> ⚠️ **Dissolvable vs surgery-only** — pred new from imaging + crystal + species before Tx

---

# 🪨 Part 1: Stone Formation Principle

## Super-saturation
- Urine is **constantly super-saturated** (kidney reabsorbs water → concentrates solutes)
- Crystals can form anytime if conditions allow
- Inhibitors (citrate, peptides) keep crystals from aggregating into stones
- Stone = crystal aggregation when inhibitors fail

## 5 Main Stone Types (memorize!)
1. **Struvite** (Mg ammonium phosphate hexahydrate)
2. **Calcium oxalate (CaOx)**
3. **Urate**
4. **Cystine**
5. **Silica**

> 💡 New 2024: GS-441524 stones in cats treated for FIP (rare, USA/Brazil so far · not yet in Thailand)

---

# 🦠 Part 2: Struvite — Most Important to Distinguish (Dog vs Cat!)

## Composition
**Magnesium Ammonium Phosphate Hexahydrate**
\`\`\`
Mg + NH₄ + PO₄ + 6H₂O
   ↑    ↑     ↑
diet   diet  metab/diet
\`\`\`

## Dog Struvite (most common etiology = INFECTION)
- **Urease-producing bacteria**: Staph, Strep (most), Klebsiella, Proteus, Mycoplasma, Ureaplasma
- Mechanism: bacteria produce urease → splits urea → ammonia → urine pH **alkaline (8-9)**
- Smells of ammonia
- Minor sub-set = **sterile struvite** (no infection) — rare

### **Tx Dog Struvite = Antibiotics** ⭐
- Kill the bacteria → no urease → urine pH drops to normal (~5-6) → **stone dissolves**
- **Dietary alone WRONG** for dog struvite (it's not diet-driven)

## Cat Struvite (most common etiology = IDIOPATHIC/STERILE)
- Mostly NOT infection-driven
- Diet + condition factors
- Minor sub-set = infection (rare in cats)

### **Tx Cat Struvite = Acidifying Diet** ⭐
- Hill's s/d, Royal Canin Urinary SO, etc.
- Antibiotic NOT useful unless culture positive

> ⚠️ **EXAM PITFALL**: Dog vs cat struvite Tx is OPPOSITE — antibiotic vs diet. Memorize!

## Both: **Struvite is dissolvable** if pure (no calcium core)

---

# 💎 Part 3: Calcium Oxalate (CaOx) — Most Common Now

## Etiology (3 mechanisms, often combined)
1. **Hypercalciuria** — too much Ca in urine (diet, hyperCa-emia, renal leak)
2. **Hyperoxaluria** — too much oxalate (diet — spinach, chocolate)
3. **Hypocitraturia** — citrate prevents Ca-Ox binding; if low, Ca + Ox couple in urine

## Pathway
\`\`\`
Diet Ca + Diet Oxalate → absorbed independently → both excreted in urine
                           ↓
                    Meet in urine → Ca-Ox crystal
                    BUT citrate inserts between → prevents binding
                           ↓
                    If citrate LOW → Ca-Ox forms → stone
\`\`\`

## ⚠️ **Cannot dissolve — surgery only**
- No medical Tx for established CaOx stones
- Prevention: alkalinize urine (citrate supplementation), reduce Ca/Ox in diet

---

# 🐾 Part 4: Urate Stones

## 2 Etiology Groups

### Group 1: Dalmatian-type (genetic enzyme defect)
- **Uricase deficiency** + gene mutation (SLC2A9 et al.)
- Cannot convert uric acid → allantoin → urate accumulates
- Note: Dalmatians are now rare as pets in Thailand (so this is less commonly seen)

### Group 2: Non-Dalmatian (acquired)
- **Portosystemic shunt (PSS)** is the main cause
- Liver bypass → can't convert ammonia → ammonium urate stones
- Often Yorkshire Terrier, Maltese, small breeds
- Tx PSS = surgery for shunt + stone management

## Tx
- **Dissolvable** (urate is one of the dissolvable types)
- Allopurinol (xanthine oxidase inhibitor) + low-purine diet
- Address PSS if non-Dalmatian etiology

---

# 🧬 Part 5: Cystine Stones

## Etiology
- **Genetic mutations**: SLC3A1, SLC7A9 (cystine transporter — kidney can't reabsorb cystine)
- 3 sub-types including **androgen-dependent** form (intact male dogs)

## Predisposed breeds (especially intact males)
- **French Bulldog, English Bulldog**
- Other small breeds (some terriers)

## Tx
- **Castration is often curative** for androgen-dependent form
- Dissolvable with diet + alkalinizing therapy
- Recurrence high if not castrated

> 💡 Cystine stone in cat = lifetime rarity (~8 cases per 900 stones analyzed)

---

# 🪨 Part 6: Silica Stones

- Rare · sand/dirt ingestion
- Surgery only · not dissolvable

---

# 🩻 Part 7: Diagnosis

## Imaging
- **X-ray** (first-line):
  - Sees stones ≥3 mm
  - Radiopaque: Struvite, CaOx (most opaque)
  - Radiolucent-ish (low opacity but **STILL VISIBLE**): Urate, Cystine
  - ⚠️ **Old teaching wrongly says urate/cystine = invisible** — they ARE visible, just less opaque
- **Ultrasound**: detects smaller stones, distinguishes structures
- **Radiograph + US together** = best sensitivity

## Urine Analysis (UA)
| Crystal | Shape |
|---|---|
| **Struvite** | "**Coffin lid**" rectangular |
| **Calcium Oxalate** | "**Envelope**" / Maltese cross |
| **Urate** | Brown amorphous/spheroid |
| **Cystine** | **Hexagonal** (typical) |

> ⚠️ **50% of stone cases show NO crystals on UA** — new crystals join existing stone instead of accumulating in urine

## Urine pH × Stone Type
- **Alkaline urine (pH 7-9)** = Struvite (especially dog)
- **Acidic urine** = CaOx, Urate, Cystine

---

# 💊 Part 8: Treatment Decision Tree

## Dissolvable ⭐
1. **Struvite** (always, if pure) — dog: ABO; cat: diet
2. **Urate** — allopurinol + diet + manage PSS
3. **Cystine** — diet + alkalinize + castrate if androgen-dependent

## Surgery Only ⛔
1. **Calcium Oxalate** — cannot dissolve
2. **Silica** — cannot dissolve

## Surgical Options
- **Cystotomy** (open bladder) — most common
- **Lithotripsy** (laser/extracorporeal shockwave) — advanced facilities
- **Voiding urohydropropulsion** — small bladder stones in females, flush out
- **Retrograde urohydropropulsion** — push urethral stone back to bladder for cystotomy

## Pre-op Considerations
- ALWAYS culture + sensitivity (bacterial infection may have driven struvite formation)
- Submit retrieved stone to lab for **quantitative analysis** (confirm composition for prevention)
- Address obstruction emergencies first (see 8.2)

---

# 🎯 Exam High-Yield Recap

1. **5 stone types**: Struvite, CaOx, Urate, Cystine, Silica — memorize all
2. **CaOx = #1 most common now** in both dog + cat
3. **Struvite Tx differs by species**:
   - **Dog**: ANTIBIOTIC (infection-driven)
   - **Cat**: ACIDIFYING DIET (idiopathic)
4. **Dissolvable**: Struvite, Urate, Cystine — **NOT** CaOx, Silica
5. **Urease producers**: Staph, Strep (most), Klebsiella, Proteus, Mycoplasma, Ureaplasma → alkaline urine pH 8-9
6. **Calcium oxalate prevention**: citrate (the inhibitor) + reduce dietary Ca/Ox + alkalinize
7. **Urate non-Dalmatian = PSS** (portosystemic shunt) — surgery for shunt
8. **Cystine in male intact dog**: castrate (androgen-dependent form)
9. **X-ray sees ≥3 mm stones** · all 5 types are visible (urate/cystine just less opaque)
10. **Crystal shapes**: struvite=coffin lid · CaOx=envelope · cystine=hexagonal
11. **50% of stone cases**: no crystals on UA (joined existing stone)
12. **Urine pH 7-9** = think struvite first

> 📚 อ่านควบ: 8.1 Upper Urinary (a9cdFzIKIGA) · 8.2 LUT 1 (z0Id0mmM4Fk · obstruction stabilize) · 10.1 Imaging Urinary (Q0AGFF70m8M)`,
  },

  // 8.2 Lower Urinary System 1 (terminology + species patterns + obstruction)
  z0Id0mmM4Fk: {
    videoId: 'z0Id0mmM4Fk',
    title: '8.2 : Lower Urinary System 1',
    subject: 'com1',
    date: '7 Oct 2024 (DekDokVet85, อ.วชิรา)',
    durationMin: 28,
    instructor: 'อ.วชิรา (Med II) — small animal urology',
    examFormat: 'Define problem + species/age × disease pattern + hyperkalemia management ออกบ่อย',
    summary: `# 8.2 Lower Urinary System I — Terminology + Patterns + Obstruction

> 🎯 Lower urinary tract (LUT) disease ต่าง upper tract → focus communication กับเจ้าของ
> ⚠️ ไม่ใช่แค่ตอบ "FLUTD" — ต้องไปต่อหา **specific diagnosis**

---

# 📚 Part 1: Clinical Sign Terminology (define ก่อน workup)

| Term | Meaning |
|---|---|
| **Hematuria** | เลือดในปัสสาวะ |
| **Stranguria** + **Dysuria** | ในคน = แสบ/ฉี่ขัด · **ในสัตว์รวมเป็นคำเดียว** (สัตว์บอกไม่ได้) → "เบ่งฉี่เหมือนฉี่ไม่ออก / ร้องดังตอนฉี่" |
| **Pollakiuria** | **ฉี่บ่อย กองเล็ก ๆ** (เข้ากระบะทรายบ่อย ๆ) |
| **Polyuria** | ฉี่ **เยอะ กองใหญ่** (ต่างจาก pollakiuria) |
| **Incontinence** | คุมฉี่ไม่ได้ · **"ปัสสาวะเล็ด"** (นอนเสร็จลุกขึ้นมีคราบ) |
| **Periuria** | **ฉี่นอกกระบะทราย** (cat) · "accidental in the house" |
| **Excessive licking of perineum** | เลียอวัยวะเพศบ่อย ๆ — เจ็บ/แสบ |

> 💡 **Pollakiuria vs Incontinence**: เจ้าของพูด "ฉี่กระปริบกระปอย" คลุมเครือ
> - "เข้ากระบะบ่อย" = pollakiuria
> - "ฉี่หยดเอง / นอนเสร็จเปื้อน" = incontinence
> → **คนละโรค คนละทาง treatment**

---

# 🔍 Part 2: Differentials Before Diagnosing LUT

ก่อนไปต่อ ต้อง rule out:

## 1. Reproductive Tract
- **Male dog (intact)**: prostate disease (BPH, prostatitis) → คล้าย LUT
- **Female (estrus/heat)**: bloody discharge → "ฉี่เป็นเลือด" ของเจ้าของ

## 2. GI (อึ vs ฉี่)
- ⚠️ Case story: เด็กตอบ "stranguria" แต่จริง ๆ คือ **constipation/megacolon** (เบ่งอึไม่ออก)
- ตรวจ: คลำลำอึใหญ่ + กระเพาะปัสสาวะเล็ก → constipation, ไม่ใช่ urinary
- **Megacolon, obstipation, constipation** มักเลียนแบบ stranguria

## 3. Hematuria type (เจ้าของบอก "ฉี่แดง" — observation, ไม่ใช่ interpretation)
- **Centrifuge urine**:
  - Supernatant ใส + sediment แดง = **true hematuria** (RBC ตกลง)
  - Supernatant แดง = **myoglobinuria / hemoglobinuria**
- Confirm: **serum/plasma color**:
  - Plasma ใส → muscle (myoglobin from rhabdomyolysis) หรือ **intravesicular hemolysis**
  - Plasma แดง → **intravascular hemolysis** (IMHA)
- ⚠️ **Intravesicular hemolysis** (RBC แตกในกระเพาะปัสสาวะ): hematuria จริง แต่ centrifuge เห็น hemoglobin ปนใน supernatant — เจอบ่อยใน cat ที่ฉี่ไม่ออกนาน · serum/plasma สีปกติ → confusing แต่จริง ๆ คือ hemorrhage in bladder

---

# 🐈 Part 3: Cat — FLUTD Umbrella + Sub-diagnoses

## ⚠️ ห้ามตอบ "FLUDI" — เขียน/พูด **FLUTD** (Feline Lower Urinary Tract Disease)

FLUTD = **umbrella term** สำหรับ cat ที่มีอาการ LUT ใด ๆ:
hematuria · stranguria/dysuria · pollakiuria · periuria · excessive licking

> 💡 ข้อสอบให้ 10 คะแนน ตอบ "FLUTD" ได้แค่ 4 — ต้องไปต่อ identify specific cause:

## Sub-diagnoses by Age (แมว)

### Cat **<10 ปี** (rank by frequency)
1. **FIC** (Feline Idiopathic Cystitis) ⭐ — diagnosis of exclusion
2. **Stones** (urolithiasis)
3. UTI (rare in young cats)

### Cat **>10 ปี** (rank shifts!)
1. **Stones** + **UTI** — climb to top
2. **FIC** drops to bottom
3. + **Neoplasia** (TCC) consideration

> 💡 **FIC = idiopathic cystitis** — model ของ interstitial cystitis ในผู้หญิง · ผู้ชายไม่ค่อยรู้จัก · stress/environment-triggered

## Practical Use
- 6yr Persian male, ฉี่ไม่ออก/ฉี่ปนเลือด → **FIC หรือ stones**
- 13yr cat, ฉี่ไม่ออก → **stones หรือ UTI** (FIC unlikely)

---

# 🐕 Part 4: Dog — LUT Disease Pattern

| Age | Common dx |
|---|---|
| All ages | **UTI + Stones** ยืนพื้น |
| **>10 ปี** | + **TCC (Transitional Cell Carcinoma)** เพิ่มขึ้น |

> 💡 Dog FLUTD pattern simpler — fewer differentials than cat

---

# 🚨 Part 5: Obstruction (Critical — สัตว์ตายเร็ว)

## Pathophysiology
\`\`\`
Obstruction (urethra/ureter) → back pressure UP toward Bowman's
                                ↓
                  GFR drops → can't excrete K, PO₄, H+
                                ↓
        🚨 Hyperkalemia + Hyperphosphatemia + Metabolic acidosis (high anion gap)
                                ↓
                      Bradycardia → death
\`\`\`

## 2 Levels of Obstruction
| Level | Site | Detection | Outcome |
|---|---|---|---|
| **Lower** | Urethra | ง่าย — palpate distended bladder, observe straining | Cath unblock |
| **Upper** | Ureter | **ยาก — looks like AKI** (toxic, depressed, vomiting) → diagnose with imaging | One kidney left long-term |

## Critical Workup
1. **Bloodwork FIRST** in unstable patient: K+, BUN/Cr, blood gas, HR
2. **Bradycardia** (HR cat normal ~200 → if 80, severe hyperkalemia)
3. **STABILIZE before unblocking**:
   - Ca gluconate (cardioprotective)
   - Insulin + dextrose / regular insulin / β-agonist (drive K into cells)
   - Bicarbonate for acidosis
   - IV fluids (gentle to avoid edema)
4. **Then unblock** (urethrocath, manual prostate massage, etc.)

> ⚠️ **Don't rush to unblock unstable cat** — they'll die on the table from K+/acidosis crash

## Urethral Plugs (Cat)
- 10-20 ปีก่อน common — protein matrix + struvite crystals
- Now rare แต่ยังเจอ
- Material: white/cream "cake-like" plug at penile tip
- Trick: **gentle massage of penile tip** เผื่อ plug ปึ๊ดออกเอง → unblock without cath
- ถ้าไม่ออก → urethrocath ด้วย flush

---

# 🩺 Part 6: Workup Workflow

## Triage Rule
- **Unstable** (bradycardia, depressed, severe hyperK): max 10 min for hx + PE → **stabilize first**
- **Stable**: take time for thorough history + PE

## Order
1. **Define problem** (term mapping above)
2. **Rule out** reproductive + GI mimics
3. **Confirm hematuria type** (centrifuge + serum color)
4. **Imaging**: bladder + ureter US, abdominal radiograph
5. **Urinalysis + culture** (mid-stream catch or cystocentesis)
6. **Blood**: CBC, chem (K+, BUN/Cr, PO₄), blood gas

---

# 🎯 Exam High-Yield Recap

1. **Pollakiuria** (ฉี่บ่อย กองเล็ก) ≠ **Polyuria** (กองใหญ่) ≠ **Incontinence** (เล็ดเอง)
2. **FLUTD = umbrella, not diagnosis** — must identify FIC vs stones vs UTI
3. **Cat <10yr top dx**: FIC > Stones > UTI
4. **Cat >10yr top dx**: Stones + UTI (FIC drops)
5. **Dog age >10**: add TCC to differential
6. **Centrifuge red urine**:
   - Supernatant clear + sediment red = true hematuria
   - Supernatant red + plasma normal = intravesicular hemolysis OR myoglobinuria
   - Supernatant red + plasma red = intravascular hemolysis (IMHA)
7. **Obstruction emergencies**:
   - Hyperkalemia → bradycardia → death
   - Stabilize K+ + acidosis BEFORE unblocking
   - Ca gluconate + insulin/dextrose + bicarb
8. **Megacolon mimics stranguria** — palpate abdomen first
9. **Lower obstruction (urethra)** = easier · **upper (ureter)** mimics AKI

> 📚 อ่านควบ: 8.1 Upper Urinary (a9cdFzIKIGA) · 8.3 Lower Urinary 2 (vLjnPuFgvj4) · 10.1 Imaging Urinary (Q0AGFF70m8M)`,
  },

  // 1.1 Oral cavity (foundational anatomy + exam + common diseases)
  // Key string-quoted because videoId contains hyphen (not valid JS identifier).
  'I7M-pekGTIU': {
    videoId: 'I7M-pekGTIU',
    title: '1.1 : Oral cavity',
    subject: 'com1',
    date: '5 Aug 2024 (DekDokVet85 recording)',
    durationMin: 93,
    instructor: 'อาจารย์ COM I (small animal dental)',
    examFormat: 'Anatomy ID, Triadan numbering, normal occlusion criteria, FORL types, and PD complications ออกบ่อย',
    summary: `# 1.1 Oral Cavity — Anatomy + Exam + Common Diseases

> 🎯 Foundation lecture สำหรับ COM I · ครอบคลุม oral anatomy → examination → tooth eruption → numbering → diseases (PD, FORL, malocclusion, stomatitis, cleft palate, salivary disorders)
> ⚠️ **No radiograph, no dentistry** — dental work ต้อง GA + intra-oral X-ray เสมอ

---

# 🦷 Part 1: Oral Anatomy

## 2 Compartments
- **Oral cavity proper** = องค์ประกอบที่เห็นเป็นรูปร่าง: hard palate + soft palate + tongue + floor of mouth
- **Oral vestibule** = ช่องว่างระหว่างฟันกับ lip/cheek
  - **Labial vestibule** = lip ↔ teeth (front: incisors-canines)
  - **Buccal vestibule** = cheek ↔ teeth (back)

## Palate Anatomy
| Region | Note |
|---|---|
| **Hard palate** | กระดูกข้างใต้ · มีรอยหยัก (rugae) |
| **Soft palate** | ต่อจาก hard palate · ไม่มีกระดูก · พื้นผิวเรียบ |
| **Caudal palate** | ส่วนโค้งหลัง soft palate |
| **Fauces** | ลึกสุดต่อจาก soft palate · ⚠️ จุดที่เกิดโรค **stomatitis** ในแมวบ่อย |

## Mucosa Types (สำคัญตอนผ่าตัด)
| Type | ตำแหน่ง | ลักษณะ | กรีด/เย็บ |
|---|---|---|---|
| **Masticatory mucosa** | gingiva (เหงือก) | Keratinized · เหนียว · หนา | กรีดยาก แต่เย็บแน่น |
| **Lining mucosa** | labial · buccal | Non-keratinized · นุ่ม | กรีดง่าย · เป็นแผลง่าย |
| **Specialized mucosa** | papillae บนลิ้น | — | — |

> 💡 รอยต่อ masticatory→lining = **mucogingival junction** (สำคัญตอนทำ flap)

## Salivary Glands (4 หลัก)
- **Mandibular** (ใหญ่สุด, คลำเจอจาก PE) + **Sublingual** = ติดกัน → "submandibular complex"
- **Parotid** (ป้ายปกหู)
- **Zygomatic** (ใต้ตา · ค่อนข้างใหญ่)
- **Minor salivary glands** = molar gland (cat, ใหญ่กว่าหมา) + sublingual ductule openings

## Tooth Anatomy
\`\`\`
        ┌── Crown (เหนือเหงือก)
        │   - Enamel (อาเล) — ขาวสุด, แข็งสุด, ด้านนอก
        │   - Dentin (เดนทีน) — เหลืองกว่า, อยู่ใต้ enamel
        │   - Pulp cavity (ประสาท) — ในสุด, มีหลอดเลือด+เส้นประสาท
        ├── CEJ (Cementoenamel Junction) — รอยต่อ crown↔root
        └── Root (ใต้เหงือก)
            - Cementum (ด้านนอก root)
            - Dentin (เนื้อฟันต่อจาก crown)
            - Pulp continues — ปลายเปิดออกเข้าเส้นประสาท → ปวดฟันถ้า pulp expose
\`\`\`

## Periodontal Probe Reading (ค่า normal)
| สัตว์ | Normal sulcus depth |
|---|---|
| 🐈 Cat | **0.5–1 mm** |
| 🐕 Dog (small/medium) | **1–3 mm** |
| 🐕 Large dog (>40 kg, e.g. St. Bernard) | up to 5 mm |

> ⚠️ ถ้า probe หายเข้าจมูก → **oronasal fistula**

---

# 🔍 Part 2: Oral Examination (3 components)

## 1. Extra-oral exam
- ดูภายนอก: ความสมมาตรของหน้า · facial swelling
- หน้าบวมข้างใดข้างหนึ่ง = มี issue ใน mouth/teeth/sinus

## 2. Intra-oral exam
- เปิดปากดู: tongue, palate, gingival color, mucosa, occlusion
- น้องที่ aggressive/painful → ต้อง sedation เพื่อตรวจ
- Owner อาจช่วยจับเปิดปากในตัวที่ใจดี

## 3. Dentition exam (intra-oral X-ray)
- ⚠️ **General anesthesia เสมอ** — probe sulcus + intra-oral X-ray
- **"No radiograph, no dentistry"** — ดูเฉพาะ crown ภายนอก ไม่พอ
- X-ray ตรวจ:
  - Pulp pathology, root abnormality, alveolar bone loss
  - Tooth resorption (FORL) — รากละลายโดย crown ยังอยู่
  - Persistent deciduous (>6mo)

## Calculus Index (ตอนตรวจสุขภาพช่องปาก)
| Grade | Coverage |
|---|---|
| **C1** | หินปูน 1/3 ของ crown |
| **C2** | 2/3 ของ crown |
| **C3** | คลุม crown ทั้งหมด · มองไม่เห็นเนื้อฟัน |

## Gingival Index
| Grade | Inflammation |
|---|---|
| **G1** | ขอบเหงือกแดงเป็นเส้นบางๆ |
| **G2** | แดงเป็นแถบกว้าง |
| **G3** | แดงทั้งช่องปาก |

---

# 🍼 Part 3: Tooth Eruption + Age Estimation

## Deciduous (น้ำนม) — Total dog 28, cat 26 (ไม่มี molar)
| Age | Tooth |
|---|---|
| 1 mo | Deciduous canines |
| 2 mo | Deciduous incisors |
| 3 mo | Deciduous premolars |

## Permanent — replace deciduous starting 4 mo
| Age | Permanent eruption |
|---|---|
| 4 mo | Canines + incisors begin replacing |
| 5 mo | Premolars |
| **6 mo** | **Molars erupt — full set** |

> 💡 **เปิดปากเห็น molars → อย่างน้อย 6 เดือน**
> 💡 **>6 mo + deciduous still present = persistent deciduous (abnormal)** → ต้องถอน

## Distinguishing Deciduous vs Permanent
- Deciduous: ซี่เล็ก, แหลมกว่า
- Persistent deciduous + permanent ขึ้นมาคู่กัน → **ถอนซี่ deciduous ออก** (เก็บ permanent)

---

# 🔢 Part 4: Triadan Numbering (รหัสฟัน)

\`\`\`
Quadrant (clockwise from operator's view):
   1 (upper R) | 2 (upper L)
  ─────────────────────────
   4 (lower R) | 3 (lower L)

Position (01–11):
   01 = central incisor
   02–03 = lateral incisors
   04 = canine
   05–08 = premolars (P1–P4)
   09–11 = molars (M1–M3)
\`\`\`

> ตัวอย่าง: **104** = upper right canine · **404** = lower right canine

---

# 🦠 Part 5: Periodontal Disease (PD) — most common oral disease

## Pathogenesis
\`\`\`
Plaque → Calculus (tartar) → Gingivitis → Periodontitis
                                                ↓
                          Alveolar bone loss + tooth mobility → tooth loss
\`\`\`

## Treatment Cascade
- Mild: **scaling + polishing** (dental scaling and prophylaxis)
- Severe: **extraction** (gold standard ในหมา · มากกว่า root canal เพราะ practical)

## ⚠️ Complication: Oronasal Fistula
- Upper teeth (canines → caudal molars) แชร์กับ nasal cavity
- ฟันโยก/หลุด + alveolar bone หาย → ช่องปาก-จมูก เชื่อมติด
- **Symptoms (mild → severe)**:
  - Sneezing
  - Nasal discharge (ทาง resp dx ก็ DDx ได้, อย่าลืม dental cause)
  - **Food/water coming out of nose** = severe
  - Aspiration pneumonia = อันตราย
- **Tx**: ถอนฟัน + เย็บปิด fistula

---

# 🛠 Part 6: Dental Equipment Glossary

## Dental Unit (เครื่อง)
- **Ultrasonic scaler** — สั่นสะเทือน + น้ำเย็นปลายอุปกรณ์ (ลด heat)
- **High-speed bur** — ตัด tooth/bone (เช่น sectioning multi-root tooth)
- **Low-speed polisher** — ขัดผิวฟันด้วยผง prophy paste (หลังขูดหินปูน)
- **Air/water syringe** + light + suction

## Hand Instruments
| Tool | Use |
|---|---|
| **Periodontal probe** | วัด sulcus depth (1 ขีด = 1 mm, 1 แถบ = 3 mm) |
| **Calculus scaler** | ขูดหินปูน supragingival เท่านั้น (คม 2 ด้าน, ไม่ลงใต้เหงือก) |
| **Curette** | ขูดหินปูน subgingival (คมด้านเดียว, ด้านคมชิดฟัน) |
| **Periosteal elevator** | แยก masticatory mucosa (gingiva) จาก root ก่อนถอน |
| **Dental elevator** | ตัด periodontal ligament (ใช้คู่กับ luxator) |
| **Luxator** | บาง+แบนกว่า · ตัด periodontal ligament ตรงๆ |
| **Extraction forceps** | ดึงฟันออก (หลัง elevator/luxator ตัด PDL) |
| **Root tip pick** | ตามรากที่หักค้าง |

## Extraction Techniques
- **Simple** = ฟันรากเดี่ยว/โยกแล้ว · ดึงตรงๆ
- **Surgical** = เปิด gingival flap + buccal alveolar bone removal + section tooth + extract roots ทีละราก

---

# 😬 Part 7: Tooth Count Abnormalities

## Persistent Deciduous (ฟันน้ำนมค้าง)
- เห็น 2 ซี่คู่กัน (n้ำนม + permanent)
- Permanent อยู่ด้านหน้ากว่า (incisor) หรือด้านนอก (canine, lower) หรือด้านหลัง (canine, upper)
- **Tx**: ถอน deciduous ออก

## Supernumerary Teeth
- ฟันเกิน, anatomy ปกติ
- มักไม่มีปัญหาเว้นถ้า: ขัดการสบ, ทิ่มฟันตรงข้าม, ทำให้เก็บ plaque ง่าย → ถอนเฉพาะที่มีปัญหา

## Fusion Teeth
- 1 root + 2 crown (หรือ partially fused)
- ปกติไม่มีปัญหา · แค่ทำความสะอาดดี

## Missing Teeth (Hypodontia / Oligodontia)
- เปิดปากแล้วฟันน้อย
- ต้อง X-ray เพื่อ DDx:
  - **True missing** (genetic)
  - **Unerupted tooth** → อาจ develop เป็น **dentigerous cyst** ได้
- Tx: unerupted ที่อายุน้อย (<6mo or <1yr) → **operculectomy** (กรีดเหงือกให้ฟันขึ้นเอง) · cyst → extraction

---

# 🦷 Part 8: Malocclusion (สบฟันผิดปกติ)

## 3 Criteria for Normal Occlusion
1. **Scissor bite of incisors** — ฟันบนคม overlap ฟันล่าง
2. **Diastema of canines** — เขี้ยวล่างอยู่ระหว่าง upper canine + 3rd incisor
3. **Pinking shear of premolars** — interdigitation (ฟันบน-ล่างสบกันแบบฟันปลา)

## Classes
| Class | Name | Description |
|---|---|---|
| **1** | Individual tooth abnormality | ภาพรวม occlusion ปกติ · บางซี่บิด/เคลื่อน |
| **2** | Brachygnathism (overshot) | ฟันบน > ฟันล่าง · upper jaw longer · canine บนทิ่ม fauces ↓ → แผลเรื้อรัง |
| **3** | Prognathism (undershot) | ฟันล่าง > ฟันบน |
| **4** | Wry mouth (ผิดปกติด้านข้าง) | จาว lateral asymmetry |

## Tx Options
- **Orthodontic devices** (braces) — ทำได้แต่ไม่ practical ในสุนัข (อุปกรณ์หลุด, retention ยาก)
- **Crown reduction + restoration** — ตัด canine ที่ทิ่มเหงือกลง + อุด pulp (ป้องกัน expose pulp → painful, septic)
- **Extraction** — ถ้าเป็น minor tooth (ไม่ใช่ canine functional)
- **Maxillectomy / Mandibulectomy + prosthesis** — ในกรณีรุนแรง (rare)

---

# 🔻 Part 9: Tooth Resorption (FORL) — มักในแมว

## Pathogenesis
- รากฟันค่อยๆ ละลาย (root resorption) ภายใน → cementum/dentin หาย
- Pulp expose → painful ปวดมาก
- Internal vs external resorption

## 3 Types
| Type | Root status | Tx |
|---|---|---|
| **Type 1** | Roots intact | **Extract** ตามปกติ |
| **Type 2** | Roots resorbed (ละลาย, เป็น bone-like) | ⚠️ **Crown amputation only** — ไม่ต้องเอา root ออก (เอาไม่ออก) |
| **Type 3** | Mixed: 1 root type 1, อีก root type 2 | Extract type 1 + crown amp type 2 |

> 💡 **Cat exam classic Q**: เห็น tooth resorption ในแมว → ชื่อโรค? **FORL (Feline Odontoclastic Resorptive Lesion)** หรือ **Tooth Resorption (TR)**

---

# 🦠 Part 10: Other Tooth Conditions

## Enamel Hypoplasia
- ฟันเหลืองเป็นจุด/ขาวสะดุด (probe ลากผิวฟัน)
- เกิดจาก **Canine Distemper Virus** ตอนเป็นลูกหมา (when teeth developing)
- Pulp expose → painful, septic
- **Tx**: composite restoration (อุด with light-cured composite)

---

# 🐈 Part 11: Stomatitis (แมว — high yield)

## Spectrum
- **Gingivitis** — แค่ขอบเหงือก
- **Faucitis** — fauces แดง
- **FCGS (Feline Chronic Gingivostomatitis)** — รุนแรงสุด, palate + fauces + caudal areas

## Cause
- **Immune dysregulation** (immune ตอบสนองแย่ต่อ plaque bacteria)
- Worse with **FIV / FeLV** — ต้อง screen เสมอ

## Type
- **Type 1** — gingivitis only (ขอบเหงือก)
- **Type 2** — gingivitis + caudal (palate, fauces)

## Diagnosis
- **Biopsy + histopath** required (DDx eosinophilic granuloma · neoplasia)
- Look for **chronic inflammatory infiltrate**

## Cat Exam Classic
- เปิดปากแมว เจอเหงือก+fauces แดงทั้งสองข้าง → ชื่อโรค? **FCGS / lymphoplasmacytic stomatitis**

---

# 👄 Part 12: Cleft Palate

## 2 Types
| Type | Cause | Population |
|---|---|---|
| **Congenital cleft palate** | Developmental defect (palate not fusing in utero) | Newborn puppies/kittens, brachycephalic breeds |
| **Traumatic cleft** | Falls from height, dog bite, car accident | Mostly cats (small body, fall risk) |

## Symptoms
- Food/milk coming out of nose during eating
- Failure to thrive (congenital)
- Aspiration pneumonia risk

## Surgery
- **Double flap technique** (2 layers — oral + nasal mucosa)
- ต้องวางยา GA · ทำตอนน้องโตพอที่ vital signs เสถียร

---

# 💧 Part 13: Salivary Gland Disorders

## Sialocele / Salivary Mucocele
- น้ำลายรั่วจาก gland หรือ duct → คั่งใต้ผิวหนัง/เยื่อบุ
- 3 ตำแหน่ง:
  - **Cervical mucocele** = บวมที่คอ (sublingual or mandibular gland leak)
  - **Sublingual mucocele = Ranula** = ก้อนใต้ลิ้น
  - **Pharyngeal** = หลังคอ (rare)

## Cause
- Trauma (chain pull, foreign body, biting hard object → mucosal tear)

## Diagnosis
- Palpation: **fluctuant** (ของเหลว, ไม่แข็ง)
- Aspiration: **viscous, stringy fluid** (น้ำลาย — ไม่ใช่ neoplastic solid)
- Optional: cytology to confirm
- Imaging: rule out other structural disease

## Treatment
- **Excise affected gland** (ส่วนใหญ่ sublingual)
- **Marsupialization** (กรีดเปิด ระบายเป็น chronic drain) — for ranula
- ⚠️ **Don't worry**: เอาต่อมเดียวออก ยังมีต่ออื่นๆ ผลิตน้ำลายชดเชย (parotid, zygomatic, contralateral mandibular)

---

# 🎯 Exam High-Yield Recap

1. **No radiograph, no dentistry** (always GA + intra-oral X-ray)
2. **Triadan numbering**: 3-digit code, quadrants 1-4 clockwise
3. **Tooth eruption**: full permanent set by 6 months
4. **Cat probe normal**: 0.5–1mm · **Dog**: 1–3mm
5. **Persistent deciduous**: ถอน **deciduous** ออก (NOT permanent)
6. **FORL Type 2**: crown amputation only (roots can't be extracted)
7. **Oronasal fistula**: signs from sneeze → nasal discharge → food out nose
8. **FCGS**: caudal stomatitis ที่ fauces · biopsy + FIV/FeLV screen
9. **Normal occlusion 3 criteria**: scissor bite + canine diastema + premolar pinking shear
10. **Sialocele**: viscous fluid on aspiration · differentiate from neoplasia by fluctuance

> 📚 อ่านควบ: 1.2 Oral Tumor (CQIrJmz3APo) · GI examination (4.1)`,
  },

  'dn_W-7eWQl0': {
    videoId: 'dn_W-7eWQl0',
    title: '13.1 : Surgical Treatment in Heart Disease',
    subject: 'com1',
    date: '2024-11-11',
    duration: '61 min',
    instructor: 'พี่มด (รุ่นพี่)',
    examFormat: 'MCQ',
    summary: `# 13.1 Surgical Treatment in Heart Disease

> 🎯 Surgery สำหรับ congenital cardiac defects ที่เจอบ่อยในสุนัข + การจัดการ pericardial effusion. เน้น **PDA · PRAA · sub-total pericardiectomy** — 3 หัตถการที่ผ่าน thoracotomy ทางซ้าย ที่ Vet 4-5 ต้องเข้าใจขั้นตอน + landmark anatomy

---

## 1. Patent Ductus Arteriosus (PDA)

### Pathophysiology
- ตอน fetal: ductus arteriosus = ทางผ่านเลือดจาก pulmonary artery → aorta (เลี่ยงปอดที่ยังไม่ทำงาน)
- ตอนเกิด: ductus ต้องตีบลง → กลายเป็น **ligamentum arteriosum**
- ถ้าไม่ตีบ → PDA → **left-to-right shunt** (aorta ความดันสูง → pulmonary artery ความดันต่ำ)
- ผลตามมา: pulmonary hypertension → pulmonary edema → **CHF**
- ถ้าทิ้งไว้: ~50% เสียชีวิตภายใน 1 ปี

### Epidemiology
- **Most common congenital cardiac defect ในสุนัข** (พบในแมวน้อยมาก)
- เพศเมีย > เพศผู้
- ถ่ายทอดทางพันธุกรรม → **แนะนำหมันหลังผ่าตัด**

### Diagnosis
| วิธี | สิ่งที่เจอ |
|---|---|
| **Auscultation** | Continuous (machinery) murmur — ได้ยินทั้ง systolic + diastolic |
| **Echocardiography** | gold standard · ดู shunt direction (left↔right) |
| **CT angiography** | Lateral view: เห็น aorta + pulmonary artery + PDA bridge |
| Thoracic radiograph | LA enlargement |

⚠️ **ต้อง confirm shunt direction ก่อนผ่า** — ถ้าเป็น **right-to-left** แสดงว่า pulmonary HT รุนแรงจน reverse แล้ว → **ห้ามผ่า** (palliative medical management เท่านั้น) เพราะวางยาสลบเสี่ยงเสียชีวิต

### PDA Types
| Type | ลักษณะ | Intervention candidate? |
|---|---|---|
| **Type 1** | คอดเล็กมาก แทบปิด | ❌ ไม่เหมาะ (สอดอุปกรณ์ไม่ผ่าน) |
| **Type 2 (2A/2B)** | คอดเป็นกรวย มีรอยคอด | ✅ เหมาะที่สุด (Amplatzer Canine Duct Occluder) |
| **Type 3** | ทรงท่อใหญ่ ไม่มีคอด | ❌ ไม่เหมาะ |
| **Surgical ligation** | ทำได้ทุก type |

### Treatment options
1. **Coil embolization** (เก่า · complication เยอะ — ไม่นิยม)
2. **Amplatzer Canine Duct Occluder (ACDO)** — interventional via vascular access · candidate: type 2 + ขนาดตัวใหญ่พอใส่ catheter ได้
3. **Surgical ligation** — ทุกขนาด · gold standard ปัจจุบันในเคสที่ทำ ACDO ไม่ได้

### Surgical technique (left lateral thoracotomy)
- **Approach**: dog → **4th intercostal space** · cat → 4th-5th
- ตัดผ่าน latissimus dorsi + scalenus + serratus + intercostal muscle
- **Landmark for rib counting**: scalenus muscle insert ที่ rib 5 → หน้า rib 5 = ICS 4 (⚠️ "อันนี้ข้อสอบ")
- ผ่าน intercostal — กรีดตรงกลาง intercostal space หรือใกล้ rib หลัง (อย่าใกล้ rib หน้า → vessel/nerve อยู่หลัง rib)
- ใช้ **Finochietto retractor** ถ่าง ICS
- Identify: **vagus nerve** (พาดบน aorta) + **phrenic nerve** (วิ่งไป diaphragm)
- PDA วิ่งระหว่าง vagus + phrenic
- ใช้ Penrose drain คล้อง vagus ดึงขึ้น dorsal เพื่อ expose PDA
- **Cranial + caudal window dissection** (ใช้ right-angle forceps) → ใช้ forceps คล้องรอบ PDA
- **Ligate ด้วย 2 silk knots** (non-absorbable หรือ long-term absorbable) — ผูกแบบ **hand tie** (instrument tie ลื่นในที่ลึก)
- **ไม่ตัด** — ผูกอย่างเดียว
- ⚠️ Heart เต้นตลอด → ต้องนิ่ง + ระวังโดน conduction node

### Closure
- ใส่ **chest tube** (ICS 7-8 → ปลายอยู่ ICS 2) — tunnel ผ่าน skin 2 ICS เพื่อกัน air leak
- เย็บ ICS โดย **คล้องรอบ rib 5 + rib 4** (ไม่เย็บ intercostal muscle เพราะไม่แข็งแรง)
- เย็บ scalenus + latissimus + cutaneous trunci + subq + skin
- ใส่ยาชาช่อง intercostal ผ่าน chest tube (lidocaine + bupivacaine)
- Evacuate air/exudate q2h × 8 hr → q4h × 16 hr → q12h. เอา tube ออกประมาณวันที่ 3

### Prognosis
- ทำเร็ว (ก่อน irreversible remodeling) → **excellent · กลับมา normal life**
- ทำช้า + CHF + fibrosis → poor prognosis
- Reverse shunt (R→L) → contraindicated for surgery

---

## 2. Persistent Right Aortic Arch (PRAA)

### Pathophysiology
- **Vascular ring anomaly** — มี 7 types · PRAA คือ type 1 (95% ของ vascular ring anomalies)
- ปกติ aorta พัฒนาจาก left 4th aortic arch → ถ้า persist ทาง right แทน
- Ligamentum arteriosum ยังอยู่ฝั่งซ้าย → **บีบรัด esophagus + trachea** (ที่อยู่ตรงกลาง) เป็นวงแหวน

### Clinical signs
- **อาเจียน/regurgitation** — ตอนเริ่มเปลี่ยนจากนม → อาหารแข็ง (~2-3 เดือน)
- **กระเปาะข้างคอบวม** = อาหารคั่งใน cervical esophagus dilation
- ไม่ใช่ cardiac sign! → presents as GI disease
- Predisposed breeds: **German Shepherd**

### Diagnosis
- **Positive contrast esophagram** → "**Bird beak sign**" (ปากนก) — esophagus คอดกะทันหันที่ระดับ heart base + ป่องด้านหน้า

### Surgery
- **Approach**: dog → **4th ICS** (cat → 5th) — เหมือน PDA
- หา esophagus ป่อง → ตามไปดู ligamentum arteriosum ที่บีบรัด
- ⚠️ ระวัง vagus nerve พาดอยู่บนตำแหน่งที่จะ dissect
- **Ligate 2 ends + cut กลาง** — ตัดเลย (ต่างจาก PDA ที่ผูกอย่างเดียว)
- ใช้ **Foley catheter** สอดเข้า esophagus + พอง balloon ที่ตำแหน่งเดิมของ stricture → สลาย fibrous tissue ที่ล้อมรอบ

### Post-op complications
- **Aspiration pneumonia** — esophageal function อาจไม่กลับ 100%
- บางตัว stricture เกิด permanent megaesophagus

### Long-term management
- **Upright feeding** (ยกชามข้าว/ชามน้ำสูง) — ใช้ gravity ช่วย
- **Bailey chair** — เก้าอี้สูงให้กินอาหารแบบนั่ง
- **Prokinetic agents** เพิ่ม esophageal motility

### Prognosis
- 92% improvement ใน clinical signs (literature) — **แต่ยังต้อง upright feeding ตลอดชีวิต**

---

## 3. Pericardiectomy (Sub-total)

### Indication
- **Pericardial effusion** ที่เกิด **cardiac tamponade** → right heart compression → CHF
- Causes: idiopathic, neoplasia (mesothelioma, hemangiosarcoma), infection

### Sub-total pericardiectomy
- **ไม่สามารถตัด pericardium ทั้งหมด 100%** เพราะมี **phrenic nerve** วิ่งอยู่
- ตัดใต้ phrenic nerve → ตัดเป็นรูป **T** ลงไปที่ apex of heart
- ⚠️ Pericardium มี 2 ฝั่ง (ซ้าย + ขวา) — ผ่าน left ICS แล้วต้องให้ **assistant ควักหัวใจขึ้นมาพลิก** เพื่อตัดด้านขวา (heart เต้นในมือ ไม่บีบ → stroke volume คงเดิม · แค่ EKG หน้าตาประหลาด)
- ตัด **sterno-pericardial ligament** ที่ยึดด้านล่าง

### Outcome หลังเอา pericardium ออก
- หัวใจยังทำงานได้ — แค่ contractility อาจลดลงเล็กน้อย
- ถ้าน้ำเกิดต่อเนื่อง (e.g., neoplasia) → effusion ไหลออก thoracic cavity → ปลอดภัยกว่า cardiac tamponade · pleurocentesis ง่ายกว่า pericardiocentesis

### Minimally invasive: Thoracoscopic pericardiectomy
- **เจาะ port + กล้อง** — ไม่ต้องเปิด open thoracotomy
- ตัด **window** เล็กๆ (ไม่ตัด sub-total)
- ส่ง pericardium ไปทำ culture + cytology

### Always send samples
- **Culture + sensitivity** — หา infectious cause
- **Histopathology** — หา neoplastic cause
- Idiopathic pericardial effusion → ส่งทุกอย่างก่อนจะให้คำว่า "idiopathic"

### Prognosis
- Infectious → ดีถ้าตอบสนองยา
- Neoplastic (mesothelioma, hemangiosarcoma) → ไม่ดี

---

## 🎯 Exam recap (10 ข้อ)

1. **PDA = most common congenital cardiac defect ในสุนัข** · เพศเมีย > เพศผู้
2. **Continuous (machinery) murmur** = pathognomonic auscultation finding
3. **ต้อง confirm shunt direction ก่อนผ่า** — R→L = ห้ามผ่า
4. **Type 2 PDA** = best for ACDO interventional (Type 1 + 3 ไม่เหมาะ)
5. **Surgical approach** = left **4th** ICS in dogs (5th in cats)
6. **Rib counting landmark** = scalenus muscle inserts ที่ rib 5 ⚠️ "อันนี้ข้อสอบ"
7. **PDA technique**: ligate × 2 silk · **ไม่ตัด** · expose ผ่าน vagus nerve retraction
8. **PRAA = vascular ring anomaly** · บีบรัด esophagus → regurgitation ตอนเปลี่ยนเป็นอาหารแข็ง 2-3 เดือน
9. **Bird beak sign** = positive contrast esophagram in PRAA
10. **Sub-total pericardiectomy** — ตัดใต้ phrenic nerve · เก็บ phrenic ไว้

> 📚 อ่านควบ: 11 Cardio Eval CHF (H5z8i1YOteY) · 12.1 Acquired Cardiac Disease (SiLZIu-aWlY) · Anatomy of left thoracotomy approach`,
  },

  FlutqheRR6I: {
    videoId: 'FlutqheRR6I',
    title: '14.1 : Common Respiratory Diseases in dog and cat II',
    subject: 'com1',
    date: '2024-11-18',
    duration: '61 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ',
    summary: `# 14.1 Common Respiratory Diseases II — Lower Airway/Lung/Pleural

> 🎯 ครอบคลุม **lung parenchyma + pleural cavity diseases** ที่เจอบ่อย — bacterial/aspiration pneumonia · pulmonary neoplasia · PTE · pyothorax · chylothorax · hemothorax · pneumothorax. ออกสอบ pulmonary parenchyma + pleural cavity แทร์น ⚠️

---

## 1. Pulmonary parasites

### พยาธิที่ migrate ผ่านปอด
- **Capillaria** (เก่า: Capillaria aerophila) — เจอทั้ง dog + cat · อยู่ที่ trachea/bronchi · diagnosis: fecal exam (Take wash) · Tx: **fenbendazole**
- **Aelurostrongylus abstrusus** — เฉพาะแมว · L1 ใน feces · Intermediate host = หอยทาก/นก/หนู · ตรวจด้วย **Baermann technique** · Tx: fenbendazole หรือ spot-on ที่มี selamectin

### Heartworm (Dirofilaria) larva migration
- ขณะ worm migrate ผ่าน lung → eosinophilic inflammation
- ทำให้เกิด pulmonary eosinophilic granulomatosis ได้

### Diagnosis
- CBC: **eosinophilia** (อาจไม่เจอก็ได้)
- X-ray: **bronchial pattern** หรือ interstitial pattern
- **Fecal exam** + **Baermann** (Aelurostrongylus)

### Treatment
- Steroid → ลด inflammation
- Anti-parasitic ตามชนิด

---

## 2. Bacterial Pneumonia

### Pathway การติดเชื้อ
1. **Inhalation/aspiration** (most common) — sniff หรือ aspiration
2. **From pleural space** หรือ adjacent thoracic structures
3. **Hematogenous** (bloodstream)

### ที่มาเชื้อ
| Bacteria | Note |
|---|---|
| **Bordetella bronchiseptica** | Primary pathogen ของ respiratory tract |
| **Mycoplasma** | Primary pathogen · ส่ง PCR confirm |
| E. coli, Klebsiella | Gut translocation (secondary) |
| Pasteurella, Staph, Strep | URT flora — opportunistic |

⚠️ **Dog > cat สำหรับ bacterial pneumonia**

### Predisposing
- Defense mechanism failure (ciliary dysfunction, mucociliary apparatus damage)
- Immunocompromised: FeLV/FIV, Cushing's, diabetes, immunosuppressive drugs
- Aspiration risk

### Clinical
- **Productive cough** (mucus++) · dyspnea · tachypnea
- Auscultation: **crackles** (mucus), increased lung sounds, decreased lung sound (consolidation)
- Wheezing if airway involvement
- Fever, lethargy, anorexia

### Diagnosis
- **X-ray = primary tool**:
  - **Alveolar pattern with air bronchogram** (เส้นๆ) — most common
  - Interstitial pattern (less common)
  - Distribution clue: **ventral** (general) · **dorsocaudal** (hematogenous) · **cranio-ventral** (aspiration)
- CBC: **neutrophilia ± left shift** + lymphopenia
- Arterial blood gas: hypoxemia (severity-dependent)
- **Airway sampling (BAL/Take wash)** — get cytology + **bacterial culture + sensitivity ก่อน start ATB**
- Cytology: **suppurative inflammation + intracellular bacteria**

### Treatment
- **Empirical ATB ใน 1-2 hr ถ้ามี sepsis signs**
- **Mild + suspect Bordetella/Mycoplasma**: doxycycline (oral)
- **Severe**: parenteral combination — **NOT monotherapy**
  - Sutra 1: fluoroquinolone + β-lactam (ampicillin/amoxiclav/cephalosporin)
  - Sutra 2: fluoroquinolone + clindamycin (anaerobic coverage)
- **Duration**: 4-6 weeks · re-evaluate q10-14 days
- Supportive: O₂, fluids, **nebulization with normal saline 3-4×/day**, bronchodilators, **mucolytics**
- ⛔ **ห้ามให้ antitussives (butorphanol, codeine, hydrocodone)** — productive cough ต้องเอา mucus ออก

### Prognosis
- Depends on severity, organism, host immune status

---

## 3. Aspiration Pneumonia

### Pathophysiology
1. **Large particle aspiration** → acute airway obstruction → post-obstructive pneumonia
2. **Liquid/small particle** → ER (endoplasmic reticulum) damage → lung injury → secondary bacterial colonization
3. Eventually: **non-cardiogenic pulmonary edema** (↑ alveolar capillary permeability) → ARDS · bronchoconstriction · ↑ mucus

### Predisposing
- Anesthesia, seizures, coma → loss of airway protection
- Laryngeal paralysis, megaesophagus, dysphagia, post-pharyngeal surgery
- Force-feeding (ผู้ป่วยที่ป้อนอาหารเร็ว/มาก)
- Persistent vomiting/regurgitation

### Diagnosis
- **X-ray distribution**: **right middle lobe** + **caudal part of left cranial lobe** (ventral cranial = "yodhit lobes") — gravity-dependent (ตอนยืน)
- ⚠️ **Lag time** — radiographic changes lag clinical by hours
- BAL → cytology + culture (if bacterial superinfection suspected)

### Treatment
- **Supportive primary** (not all need ATB)
- O₂ + **bronchodilators** (reduce reflex bronchoconstriction)
- ATB ถ้า bacterial superinfection — same regimen as bacterial pneumonia
- **H2 blocker / PPI** — ลด chemical injury (controversial: เพิ่ม gastric bacterial load)
- **Prokinetics** — ถ้า reflux/regurgitation
- **Upright feeding** (Bailey chair) — ป้องกัน recurrence ใน megaesophagus dogs

### Prognosis
- Depends on extent of lung damage
- Usually survives if managed early

---

## 4. Pulmonary Neoplasia

### Two categories
| Type | Origin | Frequency |
|---|---|---|
| **Primary** | Lung itself | Less common |
| **Metastatic** | จาก primary elsewhere | More common (high blood flow) |

### Primary
- Older animals · most: **adenocarcinoma**
- X-ray: **single mass or few large masses** (caudal lobes) · usually solitary
- Exception: **histiocytic sarcoma** → diffuse nodular interstitial

### Metastatic
- จาก mammary, OSA, melanoma, hemangiosarcoma
- X-ray: **interstitial nodular pattern** (หลายโนด) · **need 4-view radiographs** (DV/VD + lat both sides)
- **CT > X-ray** sensitivity for small mets

### Clinical
- Weight loss, lethargy, **non-productive cough** (mass not mucus)
- ± pleural effusion / pneumothorax / pneumomediastinum if rupture

### Diagnosis
- X-ray + CT (staging)
- **FNA under U/S guidance** — for solid peripheral mass + adjacent to chest wall
- Bronchoscopy + biopsy if central
- BAL — primarily to **rule out pneumonia/bronchitis**

### Treatment
- Primary: **surgery (lobectomy)** — treatment of choice if confined to 1 lobe + LN sampling
- Metastatic: chemotherapy ± resection if few nodules
- ⚠️ ต้องแยก primary vs metastatic — **diagnosis + treatment + prognosis ต่างกัน**

---

## 5. Pulmonary Thromboembolism (PTE)

### Predisposing
- Hyperadrenocorticism (Cushing's), heartworm, **IMHA**, protein-losing nephropathy, neoplasia, sepsis, recent surgery

### Clinical
- **Sudden onset** dyspnea + agitation · tachypnea
- ± hemoptysis
- Auscultation variable

### Diagnosis
- ABG: hypoxemia + **hypocapnia** — but normal ABG ⛔ rule-out PTE
- X-ray: variable · **small pulmonary vessels** · ↑ right heart silhouette · pleural effusion
- **D-dimer** — high sensitivity, low specificity
  - ⚠️ ตรวจภายใน **1-2 hr suspicion** — ระดับ peak แล้วกลับเข้า baseline ภายใน 24-48 hr
  - Normal D-dimer + acute dyspnea → can rule out PTE
- **CT pulmonary angiography** (gold standard) — เห็น filling defect (gray instead of white in pulmonary artery)
- Echo — ถ้าสงสัย cardiac origin หรือ pulmonary HT

### Treatment
- **Anticoagulant**: heparin (target aPTT prolongation) → keep anti-Factor Xa 0.35-0.7
- Long-term: aspirin (especially IMHA), clopidogrel, rivaroxaban
- Sildenafil ถ้ามี pulmonary HT
- Supportive: O₂, fluids, bronchodilators

---

## 6. Pleural Cavity Diseases

### 3 patterns
1. **Effusion** (water) — น้ำตกลงล่าง · muffled lung/heart sounds ด้านล่าง
2. **Pneumothorax** (air) — ลมลอยขึ้นบน · muffled ด้านบน
3. **Mass/organ displacement** (e.g., diaphragmatic hernia)

### Common: Restrictive breathing pattern + abdominal effort

### Approach
- **T-FAST** (4-point ultrasound) — for unstable patients
- X-ray (DV/VD + lat × 2) if stable
- **Thoracocentesis + fluid analysis + cytology** mandatory

---

### A. Pyothorax (Empyema)

- **Causes**: bite wound (cats!), penetrating trauma, FB inhalation, esophageal rupture, pneumonia spread
- **Cats > dogs** — bite wound predisposing
- Cytology: **degenerative neutrophils + intra/extracellular bacteria** = septic exudate
- **Always send culture + sensitivity**
- Treatment: **chest tube drainage** + ATB **4-6 weeks** (parenteral first → oral when stable)

### B. Chylothorax

- Effusion appearance: **milky** (cold milk)
- Fluid analysis: **high triglycerides + small lymphocytes**
- Causes: **idiopathic 50%**, cardiac disease, neoplasia, lung lobe torsion
- Treatment:
  - **Treat underlying cause** (cardiac → cardiac Tx)
  - **Low-fat diet**
  - **Rutin** (cats — clinic mainstay)
  - Octreotide
  - Lymphangiography + CT → surgical correction if recurrent (>1×/week thoracocentesis)

### C. Hemothorax

- **Causes**: trauma, **lung lobe torsion**, neoplasm rupture, **rodenticide (anticoagulant) toxicity**, coagulopathy
- Sign: **hypovolemic shock** > respiratory distress
- Diagnosis: thoracocentesis fluid PCV >20% หรือ >50% ของ peripheral PCV
- ⚠️ Check coagulation profile **before thoracocentesis**
- Treatment: **autotransfusion ถ้าน้อย** · transfusion + IV fluids · surgery if severe

### D. Pneumothorax

3 types:
1. **Open trauma** — penetrating wound
2. **Closed trauma** — blunt → bronchial/alveolar rupture
3. **Spontaneous** —
   - **Primary**: rupture of **bleb (sub-pleural air)** or **bulla (intra-parenchymal air)** — **DOG**
   - **Secondary**: pre-existing lung disease (PTE, neoplasia, asthma in cats, paragonimus)

### Bleb vs Bulla
| | Bleb | Bulla |
|---|---|---|
| Location | Between visceral pleura layers | Within parenchyma |
| Pleural separation | Yes | No |

### Diagnosis
- X-ray: **lung collapse** + **heart elevated** off sternum (pathognomonic)
- T-FAST in unstable

### Treatment
- **Thoracocentesis** = both diagnostic + therapeutic
- **Chest tube** ถ้าต้องเจาะซ้ำๆ
- **Surgery** if continuous leak, ruptured bleb/bulla, severe trauma
- Supportive: O₂, rest, sedation
- Tension pneumothorax = **emergency** (compromises CO)

---

## 🎯 Exam recap (12 ข้อ)

1. **Bacterial pneumonia** — dog > cat · combination ATB ใน severe cases · **NEVER monotherapy in severe**
2. **อย่าให้ antitussive** ใน productive cough ของ pneumonia (จำเป็นต้อง expel mucus)
3. **Aspiration distribution**: right middle + caudal part of left cranial lobe (ventral)
4. **Bordetella + Mycoplasma** = primary pathogens of respiratory tract
5. **Primary lung tumor** → solitary mass · most = adenocarcinoma · Tx = lobectomy
6. **Metastatic** → multiple nodules · need 4-view radiograph
7. **PTE D-dimer** — ตรวจภายใน 1-2 hr · normal = rule out
8. **CT angio** = gold standard for PTE
9. **Pyothorax in cats** ส่วนใหญ่จาก bite wound
10. **Chylothorax** — milky fluid · high TG · low-fat diet + rutin
11. **Pneumothorax pathognomonic radiographic sign** = **heart elevated off sternum**
12. **Bleb (between pleura) vs Bulla (in parenchyma)** — anatomic distinction

> 📚 อ่านควบ: 13.2 Resp Clinical Assessment (az6ZIjbDFwQ) · 13.3 Common Resp I (phyvefbYWqE) · 14.2 Surgical Resp (nzpDNtceKKk) · 14.3 Thoracic Sx (_azRwNxOJas)`,
  },

  Q0AGFF70m8M: {
    videoId: 'Q0AGFF70m8M',
    title: '10.1 : Imaging for Urinary System',
    subject: 'com1',
    date: '2024-10-31',
    duration: '65 min',
    instructor: 'DekDokVet85 — รุ่นพี่ (vet imaging)',
    examFormat: 'Case-based MCQ — เลือก imaging modality ที่เหมาะสม (~5 ข้อ)',
    summary: `# 10.1 Imaging for Urinary System

> 🎯 Integration ของ vet imaging + urinary system. เน้นการ **เลือก modality ให้ถูก** (X-ray vs U/S vs CT) ตาม clinical question. ออกสอบเป็น **case-based MCQ ~5 ข้อ** — case มา → ต้องตอบ "ทำอะไรต่อ"

---

## 1. Plain Radiograph (X-ray)

### Anatomy ที่เห็น
- **Kidneys** — soft tissue opacity ใน retroperitoneal area · เห็นเพราะ retroperitoneal fat ทำ contrast
- **Urinary bladder (UB)** — caudoventral abdomen · soft tissue opacity
- **Ureter + urethra** — **ปกติมองไม่เห็น** ใน plain film

### Kidney location
| | Right | Left |
|---|---|---|
| **Dog** | T13-L1 (สูงกว่า) | L1-L3 |
| **Cat** | L1-L4 | L1-L4 (ใกล้กัน) |

### Kidney shape
- **Dog**: bean-shaped (ยาวกว่า)
- **Cat**: rounder, smaller

### Kidney size — vs L2 vertebra
| Species | Normal ratio (kidney L / L2 L) |
|---|---|
| **Dog** | 2.5-3.5 |
| **Cat (intact/late spay)** | 2.4-3.0 |
| **Cat early-spayed** | < 2.4 (false low — vertebrae longer due to growth plate stays open) |

⚠️ **ต้องซักประวัติ spay age** — ทำหมันก่อน 7 เดือน → growth plate ปิดช้า → vertebrae ยาว → ratio เล็กกว่าจริง

### Urethra in male dogs (ยาวกว่าตัวเมีย)
1. **Prostatic urethra**
2. **Membranous urethra** (ส่วนโค้ง)
3. **Penile urethra** (ปลาย)

⚠️ Male > female สำหรับ urethral obstruction (ยาว + แคบ)

### UB wall thickness
- **Normal: ≤ 2 mm** (วัดที่ **kentral area** = caudoventral region of bladder · ตำแหน่งที่อักเสบก่อน เพราะ gravity-dependent)
- > 2 mm = **cystitis**

---

## 2. Contrast Media — สำคัญมาก

### Positive contrast (radio-opaque · ขาว)
| Type | Use in urinary? |
|---|---|
| **Iodine — non-ionic monomer (iohexol)** ✅ | ใช้ได้ทุก approach |
| Iodine — ionic | ใช้ได้แต่ side effects เยอะ |
| **Barium sulfate** | ❌ **NEVER** — irritate mucosa |

⚠️ "ถึงแม้กระเพาะปัสสาวะไม่แตกแน่ๆ ใช้ barium ได้มั้ย?" — **ห้ามใช้** (Trick question!)

**Iodine side effects**:
- Nausea, vomiting
- Hypotension (high osmolality → fluid shift)
- **Contrast-induced nephropathy** ⚠️
- **Max dose**: ~880 mg/kg (ห้ามเกิน 900)
- เสี่ยง: pre-existing kidney disease, diabetes, dehydration, geriatric, NSAID-using
- ⚠️ ต้องประเมิน **renal function ก่อนฉีด** + ให้ adequate IV fluid

### Negative contrast (radiolucent · ดำ)
- **Room air** ✅ (most common — free, accessible)
- O₂, CO₂, N₂O (rarely used)
- ⚠️ Room air = **non-water-soluble** → **air embolism risk** if over-inflated (มี report เสียชีวิต)

---

## 3. Special Cystographic Techniques

| Technique | Indication |
|---|---|
| **Positive contrast cystography** | **Bladder rupture** suspect (e.g., post-trauma, no urination) |
| **Negative contrast** | Wall thickness (less common now) |
| **Double contrast** ⭐ | **Wall pathology** — cystitis, stones, mass · gold standard for mucosal detail |

### Tip: ใส่ Negative ก่อน Positive → ลด air bubble artifact

### IVP / Excretory urography
- ฉีด iodine IV → ขับออกผ่าน **ไต** → เห็นทั้ง renal pelvis + ureter + bladder
- ใช้ดู: **ectopic ureter** (congenital), ureteral obstruction, urethral rupture (rare)
- Indirectly assess GFR (compare L vs R) — ไม่ใช่ตัวเลข แค่ "ไหนทำงานดีกว่า"
- ⚠️ ปัจจุบัน **CT > IVP** สำหรับ detailed imaging — IVP ไม่ค่อยทำแล้ว

### Urethrography
- ฉีด contrast retrograde → urethra
- Indication: **pelvic fracture + urethral rupture** suspect (peritonitis emergency)
- เจอ urethral fistula/rupture (อาจเกิดจาก iatrogenic catheter trauma)

---

## 4. Ultrasound

### ข้อดี
- **Parenchymal detail** > X-ray (ดู kidney internal structure ได้)
- ไม่มี radiation
- Real-time

### ข้อเสีย
- ขนาดประเมินคลาดเคลื่อน (operator-dependent)
- ดู urethra ใน pelvic canal **ไม่ได้** (sound ไม่ผ่านกระดูก)

### Echogenicity comparison (จำให้แม่น)
- **Spleen = whitest organ in abdomen** (hyperechoic)
- **Renal cortex must be HYPOECHOIC to spleen** (left kidney comparison)
- Right kidney → compare to **liver** (caudate lobe) · normal: similar/slightly hyperechoic
- ⛔ **Renal cortex HYPER-echoic to spleen = abnormal** → **nephropathy** (general term, not specific cause — could be nephritis, fibrosis, etc.)

### Renal pelvis (in transverse plane)
- **Normal: ≤ 2 mm**
- 2-13 mm: possible fluid therapy effect (ask if patient on IV)
- **>13 mm**: **obstruction** — must find cause (stone, mass)
- Term: **pyelectasis** = renal pelvis dilation

### Kidney size (vs aorta)
- **Dog**: 5.5-9.1× aorta
- Just remember: "compare to aorta" — ตัวเลขไม่ต้องจำ

### UB (in U/S)
- **Anechoic fluid** (ดำ) = normal urine
- Kentral area thickness ≤ 2 mm
- Look for: urinary sediment, stones (with **acoustic shadow**), mass, blood clot

### Key sonographic signs
| Sign | Meaning |
|---|---|
| **Acoustic shadow** | Stone or mineralization (sound reflects, dark shadow below) |
| **Acoustic enhancement** | Cyst (sound passes through fluid, hyperechoic below) |

### Elastography (newer)
- Measures kidney stiffness — useful for CKD (fibrotic = stiff)
- Replaces biopsy in human medicine for some indications

---

## 5. CT Scan

### ข้อดี
- **Overall regional detail** (planning, surgery)
- Better than X-ray for fine anatomy
- Multiplanar reconstruction

### ข้อเสีย
- **Parenchymal detail < U/S** (cortex/medulla less detailed)
- Need iodine contrast IV (CIN risk)
- More expensive

### CT phases — สำคัญมาก
| Phase | When to view? |
|---|---|
| **Pre-contrast** | ⭐ **Stones / mineralization** (จะเห็น hyperdense ชัดเจน · ถ้าดู post-contrast จะสับสนกับ contrast) |
| **Post-contrast** | ⭐ **Cysts, masses, infarction, hydronephrosis, vasculature** |

⚠️ จำง่ายๆ: **Stone = pre · ทุกอย่างอื่น = post**

### CT terminology
- **Hyperattenuation** (ขาวขึ้น) — ทดแทน "hyperdense"
- **Volume rendering** — 3D reconstruction · เลือก HU range ที่ต้องการ

---

## 6. Common Diseases & Imaging Findings

### Congenital
| Condition | Imaging finding |
|---|---|
| **Renal agenesis** | ไตข้างเดียว |
| **Renal hypoplasia** | ไตข้างเล็ก + อีกข้าง = **compensatory hypertrophy** |
| **Ectopic ureter** | IVP — ureter เปิดผิดที่ (urethra/vagina) |
| **PKD (Polycystic kidney disease)** | Persian/British shorthair · multiple renal cysts (acoustic enhancement) · ⚠️ inherited — แนะนำงดเพาะพันธุ์ |

### Inflammation
| Condition | Imaging finding |
|---|---|
| **Cystitis** | Wall > 2 mm at kentral area · ± irregular contour |
| **Emphysematous cystitis** | Air in bladder wall + thickening — **diabetic** patients (gas-producing bacteria) |
| **Nephritis** | Kidney bigger + hyperechoic cortex |
| **Pyelonephritis** | Pyelectasis + thickened pelvic wall |

### Stones (Calculi)
- Singular = **calculus** · Plural = **calculi**
- **Sand/grit pattern** = micro-calculi
- All show **acoustic shadow** in U/S
- May or may not be radiopaque on plain film
- **Radiolucent stones** = need cystography (negative contrast) to visualize
- Common types: struvite, calcium oxalate, urate, cystine

### Obstruction
- **Hydronephrosis** = renal pelvis + cortex ballooning + thinning of parenchyma
- **Hydroureter** = ureteral diameter > 2 mm + fluid distention
- Most often: **ureterolith blocking lower ureter**

### Renal Infarction
- **Wedge-shaped** hypoperfused area at cortex (post-contrast)
- Shape: triangular, depressed contour
- Cause: thromboembolism, vasculitis

### CKD findings
- **Small kidneys** (length below normal)
- **Renal contraction** (irregular contour) — describes shape, not size
- "Small kidney + contraction" = chronic kidney disease

### Neoplasia
- **Transitional Cell Carcinoma (TCC)** — most common bladder neoplasia
- **Location**: trigone of bladder (next of bladder) → blocks ureter inflow → hydroureter/hydronephrosis
- Can metastasize/invade ureter (mineralization in ureter)

### Bladder rupture
- Plain film: ascites + lost UB silhouette
- **Positive contrast cystography**: contrast diffuses out of bladder → confirmed
- **Surgery emergency** — peritonitis risk

### Urethral rupture
- **X-ray + positive contrast urethrography** = best (CT not great for pelvic canal)
- Always rule-out with pelvic fracture cases

### Bladder Foreign Body
- Iatrogenic from catheter dropping into UB (cat/dog chewed catheter while no e-collar)
- Surgical removal needed

### Bladder blood clot
- Form after traumatic cystocentesis (struggling cat/dog)
- Will resolve in ~1 week
- Just monitor

---

## 🎯 Imaging selection cheatsheet

| Clinical question | Modality of choice |
|---|---|
| **Bladder rupture** | Positive contrast cystography |
| **Cystitis** | Double contrast cystography or U/S |
| **Renal stone** (radiopaque) | Plain X-ray (then U/S confirm) |
| **Renal stone** (radiolucent) | Negative contrast or U/S |
| **Renal cyst (PKD)** | U/S (acoustic enhancement) |
| **Hydronephrosis** | U/S (>13 mm pelvis) |
| **Renal mass** | U/S → CT post-contrast |
| **Renal infarction** | CT post-contrast (wedge-shaped defect) |
| **Ectopic ureter** | IVP or CT urography |
| **Urethral rupture** | Positive contrast urethrography (X-ray) |
| **Pelvic fracture + can't pee** | Urethrography |
| **CKD assessment** | U/S + elastography |
| **Bladder TCC** | U/S + post-contrast CT |

---

## ⚠️ Common pitfalls

1. **Barium ห้ามใช้ใน urinary system** — irritant
2. **Spay age affects kidney/L2 ratio** in cats → ซักประวัติเสมอ
3. **CIN (Contrast-Induced Nephropathy)** — ประเมิน BUN/Cr ก่อนฉีด · stop NSAIDs
4. **Stone vs Contrast on CT** — view PRE-contrast for stones, POST for everything else
5. **Renal cortex hyperechoic to spleen = ALWAYS abnormal**
6. **Acoustic shadow ≠ acoustic enhancement** (stone vs cyst)
7. **>13 mm pelvis dilation** is not from fluid therapy alone — must find obstructive cause
8. **kentral area** = caudoventral UB = primary cystitis location

---

## 🎯 Exam recap (สำคัญ ออกสอบ)

1. Iodine **only** for urinary contrast — never barium
2. Plain X-ray ratio (kidney/L2): dog 2.5-3.5 · cat 2.4-3.0 (ทำหมันก่อน 7 เดือน → ratio false low)
3. Positive cystography for **rupture** · double contrast for **wall pathology**
4. Renal cortex must be hypoechoic to spleen (left side)
5. Renal pelvis ≤ 2 mm normal · >13 mm = obstruction
6. **Acoustic shadow = stone** · **Acoustic enhancement = cyst**
7. CT pre-contrast for stones · post-contrast for everything else
8. Pelvic fracture → must rule-out urethral rupture with retrograde urethrography

> 📚 อ่านควบ: 8.1 Upper Urinary (a9cdFzIKIGA) · 8.2 LUT 1 (z0Id0mmM4Fk) · 8.3 LUT 2 Stones (vLjnPuFgvj4) · 10.2 Surgical Tx Urinary (WtvWyniLMVE) · 10.3 LUT 3 (eBY8GTlcjiw)`,
  },

  nzpDNtceKKk: {
    videoId: 'nzpDNtceKKk',
    title: '14.2 : Surgical Treatment of Respiratory System',
    subject: 'com1',
    date: '2024-11-18',
    duration: '72 min',
    instructor: 'อ.เกียรติพิเชษฐ์',
    examFormat: 'MCQ + technique-based',
    summary: `# 14.2 Surgical Treatment of Respiratory System

> 🎯 ครอบคลุม upper airway surgery: **nasal cavity · pharynx · larynx · trachea**. หัตถการสำคัญ: **rhinotomy · BAS correction · soft palate resection · laryngeal tieback · tracheal stent · tracheostomy**. ⚠️ Brachycephalic syndrome ออกแน่

---

## 1. Nasal Cavity (Pug-go Jamook)

### Diseases
- **Trauma/wounds** — bite wounds, lacerations
- **Infection** — bacterial, **fungal** (cats — increasing recently!)
- **Foreign body**
- **Stenotic nares** (congenital)
- **Neoplasia**

### Nasal Tumors
- Mean age: **~7 years+**
- **Dogs > cats** · **males > females**
- Origins:
  - **Epithelial** — squamous cell carcinoma
  - **Non-epithelial** — lymphoma (common!)
  - **Melanoma** — also nasal (also tongue, lip)

### Approach
1. **Symmetry** — facial swelling? eye bulging?
2. Discharge — unilateral vs bilateral · which side worse?
3. **Otoscope examination** of nasal cavity (under sedation in big dogs)
4. ⚠️ **In cats** — facial wound = **don't assume tumor first** — ระบาดมาก rec recently · 1-2 cases/month minimum

### Imaging
- **2-view X-ray**: VD + lateral
- Optional: **AP view** + **Open-mouth view** for nasal cavity detail
- ⚠️ **Always X-ray thorax** — rule out metastasis (especially if rapid growth)
- **CT/MRI** for invasive tumors (cribriform plate involvement → brain extension)

### Differential dx of facial swelling
- Bacterial/fungal infection
- Aspergillosis (specifically)
- Systemic hypertension
- Foreign body
- Tooth-root abscess

### Treatment
**Medical**
- **Chemotherapy** (esp. lymphoma)
- ⚠️ Check WBC ก่อนให้ — leukopenic = ห้ามให้

**Surgical**
1. **Biopsy/Nasal flush** — เก็บ tissue
2. **Cryosurgery** — Rapid Freeze + Slow Thaw (เซลล์แตก)
3. **Rhinotomy** — เปิดเข้า nasal cavity เพื่อ remove

**Radiotherapy**
- Chula ส่ง KU (Kasetsart) — ต้องประสาน schedule ตั้งแต่แรก
- Plan: Surgery → wait healing → Radiation
- ⚠️ บอก owner ตั้งแต่ต้น schedule เพราะ tumor อาจ recur ระหว่างรอคิว

### Rhinotomy techniques

#### Dorsal approach
1. Patient ในท่า **prone** (นอนคว่ำ)
2. กรีด skin จาก nose → between eyes
3. Periosteum elevator strip down
4. **Oscillating bone saw** ตัด rectangular flap (dog ใหญ่ทำซ้ายขวาแยก · dog เล็ก/cat ทำเป็นแผ่นเดียว)
5. **Osteotome + mallet** — เคาะเบาๆ งัด flap ออก
6. Curette ขูด tumor + masses · cotton swab roll out
7. Hemostasis: **gauze + dilute epinephrine 1:5** — กดรอ 1-2 min
8. ⚠️ Saline drip during sawing — กัน thermal necrosis
9. ใส่ **antibiotic-soaked gauze** ใน cavity (โผล่ปลายจมูก ดึงออกภายหลัง)
10. **เจาะรู bone flap + lvd ทุกมุมก่อนปิด** (ถ้าผูกก่อน → flap ปิดทับ ทำต่อไม่ได้)
11. เย็บ periosteum + skin

#### Ventral approach
1. Patient **supine** (นอนหงาย)
2. กรีด **hard palate** จากหลัง canine คู่หน้า → maxillary tuberosity (ก่อนถึง tonsil)
3. Periosteum elevation
4. ใช้ **dental burr** กรอกระดูก (พื้นที่จำกัด ใช้ saw ไม่ได้)
5. Remove tumor + curette
6. ⚠️ ปิด: เย็บ gingiva ปิดเลย (กระดูกที่กรอออกใส่กลับไม่ได้)
7. **Soft food only** หลังผ่า — กันแผลถูกกดเวลาเคี้ยว

### Bilateral nasal packing complication
- หายใจไม่ออก → **emergency tracheostomy** (Bypass)

### Subcutaneous emphysema (post-rhinotomy)
- Air leak from imperfect bone seal → palpable crepitus
- Resolves spontaneously in 4-5 days

---

## 2. Stenotic Nares + BAS (Brachycephalic Airway Syndrome)

### Pathology
Normal nostril = **dorsal cartilage + ventral cartilage + accessory cartilage**
- BAS: **dorsal cartilage collapse** → nostrils pinched closed
- Brachycephalic breeds: **Pug, Pekingese, Bulldog, French Bulldog, Boxer, Boston Terrier, Shih Tzu**
- Cat: **Persian** (only common one)

### BAS Components (ออกแน่)
1. **Stenotic nares** ⚠️
2. **Elongated soft palate**
3. **Everted laryngeal saccules**
4. **Hypoplastic trachea**

### Severity
- Mild · Moderate · Severe (CV — Critical/Vital)

### Clinical findings
- Stertor (snoring), exercise intolerance
- **GI distention** — gulping air → bloating → vomiting (เคี้ยวเร็ว + obstruct → swallow air)
- Cyanosis (severe)
- **2-4 yrs**: gradual progression visible

### Stenotic Nares — 5 surgical options

#### Method 1: Alar wing amputation (resection)
- ตัด dorsal cartilage ทิ้งไปเลย
- Hemorrhage profuse — เตรียม dilute epinephrine

#### Method 2: Wedge resection
- ตัด wedge (V-shape) — vertical หรือ horizontal cut
- เย็บ remaining margins กลับเข้าหากัน

#### Method 3: Alapasty
- กรีด ~0.5 cm Skin Flow ข้างปีกจมูก
- เย็บ nasal vs facial skin → pull nostril open

#### Method 4: Mucotaneous junction resection
- เปิด skin flap หลังจมูก → cut wedge ใน cartilage ด้านหลัง → เย็บ skin

#### Method 5: Laser
- ⚠️ **เหี้ยมเสมอ** เพราะ tissue ที่อยู่ด้านล่างจะตัดด้วย
- ห้ามตัดผ่าน **endotracheal tube/oxygen** — ระเบิด/ไฟไหม้
- ป้องกัน: cover ET tube ด้วย wet gauze
- ✅ Auto-hemostasis (heat)
- Used in continuous wave or pulsed mode

### ⚠️ Important warnings
- **Soft palate**: ตัดสั้นเกินไป → **aspiration** (palate ปิด larynx ไม่ได้ตอนกลืน)
- ตัดให้เผื่อ swelling — กันบวมแล้วสั้นเกิน
- ทำ 1 ใน 3 components ไม่หายเสมอ — ต้องคุย owner ก่อนผ่า

---

## 3. Soft Palate Resection (เพดานอ่อนยาว)

### Approach
- Mouth gag (Lange speculum)
- **Tonsils as landmark** (ตรงกลาง = soft palate target)
- Stay suture เกี่ยวปลายของ palate, pull, then **clamp**
- **ตัดทีละครึ่ง** + เย็บเป็น **simple continuous** ก่อนตัดอีกครึ่ง
- ⚠️ ห้ามตัดทั้งหมดก่อนเย็บ — palate retract เข้าไปใน pharynx → เย็บไม่ได้
- Hemorrhage: ใช้ **vessel sealing device (Ligasure)** = น้อยมาก
- Time: ด้วย scissors + suture ~30-45 min · ด้วย Ligasure ~10 min

---

## 4. Larynx

### Diseases
- **Laryngeal cysts** — clamp + cut
- **Laryngeal collapse**
- **Laryngeal paralysis** ⚠️ — ออกบ่อย
- **Devocalization** (debarking — rarely done now)

### Laryngeal Paralysis (LP)
- Innervation fail → arytenoid not abducting on inspiration
- Same disease as **roaring** in horses
- Clinical: stertor, exercise intolerance, dyspnea
- Treatment: **Tieback procedure (laryngeal lateralization)** — suture cricoid → arytenoid permanently abducted

### Devocalization (debarking)
- **Ventriculocordectomy** — ตัด vocal folds
- Reduces sound ~50% หลังผ่า
- ⚠️ **Recurrence in 6 months** — fibrous tissue ทดแทน → bark กลับมา (เบากว่าเดิม)
- Approaches: oral vs **laryngotomy** (ventral midline ผ่าน thyroid cartilage)

---

## 5. Tracheal Collapse

### Epidemiology
- **Toy breeds**: **Pomeranian** (9.5/10!), Yorkshire, Poodle, Chihuahua
- Inherited tendency
- Cause: **dorsal tracheal membrane (Muscle + ligament) laxity** + softened cartilage rings

### Pathophysiology
- Trachea normally **C-shaped cartilage** + dorsal membrane
- Collapse: dorsal membrane sag down → **crescent moon shape** → airway narrows on respiration
- Air rushing past flapping membrane = "**goose honking cough (Kong-Hong)**"

### Severity
- 75% (Mild) · 50% (Moderate) · 25% (Severe — CV)

### Clinical
- **Goose honking cough** (pathognomonic!)
- Worse on tracheal palpation (gentle press on cervical trachea)
- Exercise intolerance, agitation, cyanosis

### Diagnosis
- Cervical palpation reveals "honk"
- **Lateral X-ray** — show narrowing
- Fluoroscopy = best (real-time during respiration)

### Treatment

**Medical (mild-moderate)**
- **Bronchodilators** — terbutaline, etc.
- Cough suppressants
- Weight loss + cool environment + sedation
- Anti-anxiety

**Surgical (severe / refractory)**

**Method 1: Plication of dorsal tracheal ligament**
- Suture dorsal membrane in **horizontal mattress** pattern → tighten
- Approach: ventral, then **rotate trachea** to expose dorsal aspect

**Method 2: Extra-luminal prosthetic ring (PRRC)**
- "Belt" outside trachea — non-absorbable suture to cartilage rings

**Method 3: Intra-luminal stent** ⭐ (popular)
- Materials: **Nitinol** (Ti-Ni alloy), **Stainless steel**, woven NiTi
- Self-expanding
- Length: **C7 → T2** (cervical ↔ thoracic)
- ⚠️ **Permanent** — ถอดออกไม่ได้ (tissue grows around)
- Risk: tissue fibrosis around mesh → re-stenosis

### Post-op
- Antibiotics 7-10 days · pain control · bronchodilators
- Limited exercise

---

## 6. Tracheostomy

### Indications
- Upper airway obstruction (BAS post-op swelling, mass)
- Trauma
- Bypass

### Anatomic landmark
- ตำแหน่ง: **cartilage ring 3-4 หรือ 4-5**
- ⚠️ Don't go lower → tube too deep, hard to secure
- ⚠️ Don't go higher → hits thyroid cartilage

### Technique
1. Patient supine
2. Skin incision midline ventral cervical
3. Sternohyoid muscles split (sternothyrohyoid)
4. Identify trachea
5. Stay suture around cartilage ring (lift trachea up)
6. **Cut tracheal cartilages — half cut, "fold open"**
7. Insert ET tube (already in via mouth) → cut adapter, repurpose tube
8. Secure tube to neck with sutures + tape
9. Stay sutures: 1 cranial + 1 caudal (so when tube removed for cleaning, opening visible)

### Post-op care
- ⚠️ **Clean tube q12h (morning + evening)** — mucus dries + plugs without nasal humidification
- If tube blocks → respiratory distress → emergency
- Permanent vs temporary based on indication

### Standard ET tube depth (reference)
- ~16 cm = bifurcation
- Cut down to fit individual

---

## 7. Tracheal Resection + Anastomosis

### Indications
- Severe trauma (dog bite tear)
- Mass requiring full-thickness removal

### Limit
- ⚠️ **Maximum ~20% of tracheal length** — beyond → primary closure not possible

### Technique
- Cut: **half of cartilage + half of dorsal membrane** (preserve tissue for anchor)
- Suture pattern:
  - Cartilage edges: **simple interrupted** through
  - Adjacent rings: **vertical mattress** (tension-bearing)

---

## 🎯 Exam recap (10+ ข้อ)

1. **Nasal tumor** — older dogs > cats · LSA + SCC + melanoma common · always X-ray thorax
2. **CT > X-ray** for cribriform plate involvement
3. **Rhinotomy** — Dorsal (prone, oscillating saw) vs Ventral (supine, dental burr through hard palate)
4. **Saline drip during bone saw** — prevent thermal necrosis
5. **BAS = Stenotic Nares + Elongated Soft Palate + Everted Saccules + Hypoplastic Trachea**
6. **Brachycephalic breeds** = Pug · Pekingese · Bulldog · Boxer · Persian (cat)
7. **Soft palate cut too short** = aspiration risk (palate can't seal larynx)
8. **Soft palate resection technique** — cut half + suture, then cut other half (palate retracts!)
9. **Laser surgery** — ห้ามตัดผ่าน ET tube (ไฟไหม้), cover with wet gauze
10. **Tracheal collapse** = Pomeranian (9.5/10) · "**goose honking cough**" pathognomonic
11. **Tracheal stent permanent** — can't be removed
12. **Tracheostomy site** = cartilage ring 3-4 or 4-5
13. **Tracheal resection limit** = 20% length
14. **Tracheostomy tube clean q12h** — mucus plugs from absent humidification

> 📚 อ่านควบ: 14.1 Common Resp II (FlutqheRR6I) · 14.3 Thoracic Sx (_azRwNxOJas) · 13.2 Resp Clinical Assessment (az6ZIjbDFwQ)`,
  },

  '9Fvz4J6dMCo': {
    videoId: '9Fvz4J6dMCo',
    title: '7.2 : Fluid Analysis',
    subject: 'com1',
    date: '2024-09-16',
    duration: '82 min',
    instructor: 'DekDokVet85 — รุ่นพี่ (อายุรกรรม)',
    examFormat: 'MCQ + practical case',
    summary: `# 7.2 Fluid Analysis — Thoracocentesis · Abdominocentesis · Effusion Workup

> 🎯 Two main procedures: **thoracocentesis (เจาะช่องอก) + abdominocentesis (เจาะช่องท้อง)**. Then classify fluid by **transudate / modified transudate / non-septic exudate / septic exudate / chylous / hemorrhagic / neoplastic**. Critical skill ก่อนจบอายุรศาสตร์

---

## Bigger picture

Body cavities ที่เจาะได้:
- **Thorax**: pleural cavity (thoracocentesis) ✅ · pericardial sac (US-guided only — specialist skill, not for general medicine vet)
- **Abdomen**: peritoneal cavity (abdominocentesis) ✅ · urinary bladder (US-guided preferred)

⚠️ **Legal risk** — เจ้าของณปัจจุบันมีความรู้ + ฟ้องร้องได้ → ต้อง follow protocol

---

## 1. Thoracocentesis

### When to suspect (auscultation finding)
- **Muffled lung sounds** = fluid (น้ำ) หรือ air (อากาศ) ระหว่าง chest wall + lung
- ⚠️ **Always 2-view X-ray** before procedure (lateral + DV/VD)
- **Distinguish pneumothorax vs effusion**:
  - **Pneumothorax**: lung tissue (white) + air (black) outside
  - **Effusion**: lung pushed dorsal + fluid (gray/white) below

### Equipment
| Item | Note |
|---|---|
| Needle: **21G or 23G** | Small dog/cat = 23G (less aggressive look) |
| Butterfly needle | ✅ alternative — has built-in extension tubing |
| Extension tube | ต่อจาก needle (if regular needle) |
| **3-way stopcock** | ⚠️ **arrow points to OPEN direction** |
| Syringe | Aspirate via stopcock |
| **Used saline bottle** | Collection container (not commercial fluid bag — saves $) |
| Local anesthetic | **Lidocaine 2%** — wait **5 min** for onset |

### Anesthetic onset!
- Lidocaine ≠ instant — must wait ~5 min
- ⚠️ Don't inject + immediately needle in (เด็กชอบทำผิด)

### Patient prep
- **3 personnel**: 1 puncture + 1 restrain + 1 aspirate
- Position: **sternal recumbency** (sitting)
- Sedation: cats almost always · dogs PRN
- aseptic prep + clipping

### Landmarks (ออกสอบ ⚠️)
**Vertical division**: chest wall divided into 3 horizontal zones
**Junction with X-axis (ICS 7-8)**:
- **Upper zone × ICS 7-8** = **AIR** (pneumothorax)
- **Lower zone × ICS 7-8** = **FLUID** (effusion)

### Why ICS 7-8?
- ICS 3-5 = **heart** (avoid!)
- ICS 9+ = **liver** (avoid!)
- ICS 7-8 = **safe zone**
- Mnemonic: "เจาะช่องอกเจ็บ-แปด" (7 = แปด/เจ็บ in Thai phonetics)

### Why caudal aspect of rib 8?
- Vessels + nerves run **caudal to rib** (behind rib 7)
- Cranial aspect of rib 8 = **safe** (no vessel)

### Technique
1. Stopcock arrow → opens to syringe (close to bag)
2. Insert needle **perpendicular** to chest wall
3. **Slowly advance** (not full plunge!)
4. **Aspirate ONLY after needle is in tissue** (not in air!)
5. When fluid/air comes → **stop advancing**
6. ⚠️ Adjust depth — large dog needs **1.5-inch needle** (1-inch ทะลุไม่ถึง)

### After collection
- Use saline bottle for bulk
- Reserve **3-5 mL in syringe** for analysis
- Aspirate to **near-complete drainage** (chest cavity has limited space)

---

## 2. Abdominocentesis

### Suspect when
- X-ray: "**ground glass appearance**" (มัวๆ ฟุ้งๆ · organs unclear)

### Equipment
- **Larger needle** (e.g., 18-20G) — more peritoneum mesentery occlusion in abdomen
- Otherwise same as thoracocentesis

### Position
- **Lateral recumbency** (นอนตะแคง)
- Site: **1 inch caudal to umbilicus**, on midline (linea alba)

### Why this site?
- Linea alba = avascular fibrous band (no muscle, less bleeding)
- 1" caudal of umbilicus → **avoid liver** (cranial)
- Caudal to that → **bladder** — ⚠️ **always palpate UB first** (sterile cath if doubt)

### Skin slide technique ⭐ (different from thoracic!)
- **Slide skin cranially BEFORE inserting needle**
- After withdrawal, skin slides back covering puncture
- ⚠️ Otherwise patient leaks fluid through hole when walking ("หมารั่ว") — เจ้าของไม่ชอบ
- ⚠️ Only do skin-slide for ABDOMINAL — not thoracic (muscle layer prevents leak in thorax)

### Drainage volume
- ⚠️ **Don't drain to flat** in abdominocentesis
- **Drain ~1/3 to 1/2 of fluid** — too rapid drain → **hypovolemic shock** (fluid loss + protein loss)
- Indication for therapeutic drainage: **dyspnea** from large fluid pressing diaphragm

---

## 3. Sample handling

### Tubes
| Tube | Use case |
|---|---|
| **EDTA (purple top)** | ⭐ Preferred for cytology · prevents clotting + preserves cells |
| Heparin (green) | Bad for cytology — distorts cell morphology |

### Field smear
- **Make smear on slide BEFORE sending to lab** if possible
- Read first → then send for confirmation

---

## 4. Fluid Analysis (4 parameters)

| Parameter | What |
|---|---|
| **Gross appearance** | Color, clarity, viscosity (clear/cloudy/milky/blood) |
| **Total Protein (TP)** | Refractometer · g/dL · serum reference 5-8 g/dL |
| **Total Nucleated Cell Count (TNCC)** | Cells/μL · counted on hematocrit |
| **Cytology** | Wright stain → cell types · 10×/40× scan, 100× ID |

### Quick microscopy tips
- **4× or 10×** to find cell clusters
- **40× / 100×** to identify cell types
- ⚠️ **Watch out for stain contaminants** — bacteria in stain bottle can FALSELY appear in fluid
- Confirm bacteria = **intracellular within phagocyte** (proves origin from sample)

---

## 5. Effusion Classification ⭐

### Mechanism overview
Two opposing forces govern fluid in vessel:
1. **Hydrostatic pressure** (pushing out)
2. **Oncotic pressure** (pulling in via protein)

Imbalance → fluid leak

### A. Pure Transudate
- **Mechanism**: ↓ oncotic pressure (low protein/albumin)
- **Total Protein**: < 2.5 g/dL (LOW)
- **TNCC**: < 1,500 cells/μL (LOW)
- **Cells**: small mononuclear, lymphocytes
- **Color**: clear, watery
- **Causes**:
  - **Hypoalbuminemia** (most common): protein-losing nephropathy/enteropathy, liver failure, malnutrition
  - **Albumin < 1.5 g/dL** = threshold for ascites/edema
  - Less common: lymphatic obstruction, ureteral leak

### B. Modified Transudate
- **Mechanism**: ↑ hydrostatic pressure (vessel wall normal, more pressure pushes fluid out)
- **TP**: 2.5-5 g/dL (intermediate)
- **TNCC**: 1,000-7,000 cells/μL
- **Cells**: more lymphocytes, mononuclear, **occasional reactive mesothelial cells**, RBC
- **Color**: clear yellow to slightly cloudy
- **Causes**:
  - **Right-sided heart failure** (most common in CHF dogs/cats)
  - **Liver disease** with portal hypertension
  - **Neoplasia**
  - **FIP** (cats) — cytology has fibrin background, RIVALTA test positive ⚠️ unique exception
  - **Diaphragmatic hernia**
  - **Early uroabdomen** (will progress to exudate)

### FIP & Rivalta test ⭐
- **Effusion in cat suspect FIP** → cytology shows **pink granular background** (fibrin)
- **Rivalta test**: drop fluid into **acetic acid solution**
  - Positive (FIP) = drop persists as visible droplet (jellyfish-like)
  - Negative (transudate) = drop dissolves immediately
- ⚠️ **Screening test only** — must confirm with full cytology + serology

### C. Non-septic Exudate
- **Mechanism**: vasculitis with widened endothelial gaps → larger molecules + cells leak
- **TP**: 3-5 g/dL
- **TNCC**: 5,000-50,000 cells/μL
- **Cells**: many neutrophils + macrophages + lymphocytes
- **Causes**: often **FIP** (most common), early peritonitis, mild inflammation, neoplasia

### D. Septic Exudate
- **Mechanism**: bacterial infection → inflammation
- **TP**: > 3 g/dL (HIGH)
- **TNCC**: > 7,000 cells/μL (often 10,000-100,000+)
- **Cells**: **degenerate neutrophils** (look "ghosting", chromatin loose) + **intracellular bacteria** in phagocytes
- **Color**: cloudy/purulent · foul smell ✋
- **Causes**: GI rupture, bile peritonitis, pancreatitis, foreign body, post-surgical contamination

### E. Chylous Effusion
- **Mechanism**: lymphatic leak (high TG)
- **Color**: **milky white / pink (cold milk)**
- **Cytology**: **small lymphocytes** + lipid droplets in background
- **Triglycerides** > serum (essential lab test)
- **Causes**: cardiac disease, trauma, neoplasia, **idiopathic 50%**, lung lobe torsion

### F. Hemorrhagic Effusion
- **Color**: red/blood
- **Need to determine**: Active bleeding vs old hemorrhage vs iatrogenic
- **Active bleeding** (recent <24 hr):
  - PCV ~ peripheral (35-50%)
  - TP ~ peripheral (5-7 g/dL)
  - **Platelets present** (eat or consume?)
- **Old/Resolved bleeding** (>24 hr):
  - PCV < peripheral
  - **Erythrophagocytosis** in macrophages (cell eat RBC)
  - Pigment-laden macrophages
- **Iatrogenic (you punctured vessel)**:
  - PCV ≈ peripheral
  - **Platelets present** (clots quickly!)
  - Stop puncturing, change site
- **If you puncture spleen**:
  - PCV > peripheral (spleen = blood reservoir)
  - **Hematopoietic precursor cells visible** (red lineage)

### G. Neoplastic Effusion
- **Cells**: tumor cells (lymphoma, carcinoma, mesothelioma)
- ⚠️ **Mesothelioma** vs **reactive mesothelial cells** look identical to non-experts
- **NEVER** diagnose mesothelioma without pathologist confirmation — can lead to unnecessary surgery + lawsuit risk

---

## 6. Quick Diagnosis Algorithm

| Color | Lab finding | Likely diagnosis |
|---|---|---|
| Clear/yellow | TP <2.5 + TNCC <1.5K | Pure transudate (hypoalbuminemia, liver, PLE) |
| Clear/yellow | TP 2.5-5 + TNCC 1-7K | Modified transudate (heart, liver, FIP, neoplasia) |
| Cloudy/purulent | High TNCC + degenerate neutrophils | Septic exudate (peritonitis, pyothorax) |
| Milky | Small lymphs + high TG | Chylous effusion |
| Red/Blood | PCV ~ periph + platelets present | Iatrogenic puncture |
| Red/Blood | PCV ~ periph + no platelets | Active bleeding |
| Red/Blood | PCV < periph + erythrophagocytes | Resolved bleeding |
| Red/Blood | PCV > periph + hematopoietic cells | Splenic puncture |
| Suspicious cells | — | Send to pathologist (do not self-diagnose) |

---

## 🎯 Exam recap (15 ข้อ)

1. **Thoracocentesis site** = ICS 7-8, junction with vertical zones (UPPER for air, LOWER for fluid)
2. **Avoid** ICS 3-5 (heart) + ICS 9+ (liver)
3. **Cranial aspect of rib 8** = safe (vessel runs caudal to rib)
4. **Abdominocentesis site** = 1 inch caudal of umbilicus on linea alba
5. **Skin-slide technique** for abdominocentesis only (not thoracic)
6. **Drainage limit** = thoracic to dryness · abdominal max 1/3 to 1/2 (avoid hypovolemic shock)
7. **Always palpate UB** before abdominocentesis (avoid bladder puncture)
8. **EDTA tube** for cytology (Heparin distorts cells)
9. **Lidocaine** = wait **5 min** before procedure
10. **Pure transudate** = TP < 2.5 + TNCC < 1.5K · cause = hypoalbuminemia
11. **Modified transudate** = TP 2.5-5 + TNCC 1-7K · cause = heart/liver/FIP
12. **Septic exudate** = degenerate neutrophils + intracellular bacteria
13. **Rivalta test for FIP** — droplet persists in dilute acetic acid
14. **Chylous** = milky + small lymphocytes + high TG
15. **Hemorrhagic effusion**: distinguish active vs old vs iatrogenic by PCV/platelets/erythrophagocytes
16. **NEVER diagnose mesothelioma** without pathologist (reactive mesothelial cells look identical)

> 📚 อ่านควบ: 7.1 Anemia + Hemolym (FCRDICfyMlM) · 14.1 Common Resp II Pleural cavity (FlutqheRR6I) · imha video summary (existing)`,
  },

  phyvefbYWqE: {
    videoId: 'phyvefbYWqE',
    title: '13.3 : Common Respiratory Diseases in dog and cat I',
    subject: 'com1',
    date: '2024-11-11',
    duration: '83 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ',
    summary: `# 13.3 Common Respiratory Diseases I — Upper Airway / Trachea / Bronchi

> 🎯 ครอบคลุม **upper airway → trachea → lower airway diseases**: nasal aspergillosis · sinonasal tumor · BAS · laryngeal paralysis · **tracheal collapse** ⭐ · chronic bronchitis · **feline asthma** ⭐

---

## 1. Sinonasal Aspergillosis

### Pathophysiology
- **Aspergillus fumigatus** — ubiquitous spore in air
- Normal immune defense clears spores
- **Pathogenic when**: immunocompromised host OR massive spore exposure (dirty environment)
- **Non-invasive fungal rhinitis** initially — fungus grows in mucosal surface
- ⚠️ Inflammation + fungal enzymes → eventually erode **nasal turbinate bone**

### Predisposing
- Outdoor dogs/long-faced breeds (German Shepherd, etc.) · ⚠️ Brachycephalic = LOW risk (different anatomy)
- Young to middle-age more common (more outdoor activity)

### Clinical signs
- **Chronic rhinitis** (>weeks-months)
- **Hemorrhagic-purulent discharge** (epistaxis + mucopurulent)
- Initially **unilateral** → later bilateral
- **Depigmentation + ulceration of nasal planum** (around external naris) ⚠️ classic sign
- Late: lethargy, anorexia

### Diagnosis
- X-ray: **turbinate destruction**
- CT: extent of destruction, frontal sinus involvement
- **Endoscopy**: see fungal plaques (white/green mat)
- **Biopsy under endoscopic guidance** + fungal culture
- Histopath: numerous Aspergillus hyphae

### Treatment
1. **Debridement under endoscopy** — physically remove plaques
2. **Topical antifungal** ⭐ (treatment of choice if no cribriform involvement):
   - Clotrimazole / Enilconazole instillation
   - Patient under anesthesia → balloon occlude posterior choana → fill nasal cavity
   - Rotation through 4 positions × 15 min each (or single 60 min)
   - **Repeat in 2-4 weeks if needed** — single treatment often insufficient
3. **Systemic antifungal** (when topical contraindicated — e.g., cribriform breach):
   - Itraconazole or terbinafine + posaconazole
   - **18 months** treatment (long!)
   - Lower success rate than topical

### Prognosis
- Confined to nasal cavity → good if 2 sessions of topical
- Cribriform breach (brain extension) → poor

---

## 2. Sinonasal Tumor

### Demographics
- **Older** (mean ~7 yr+) · dog > cat
- Locally invasive · rare metastasis (regional LN if any)
- **Carcinomas** (adenocarcinoma) most common in dog
- **Lymphoma** most common in cat (especially nasal)

### Clinical
- Gradual progressive **chronic discharge** (>8 weeks)
- **Sangineous + hemorrhagic + epistaxis** (turbinate erosion)
- Initial unilateral → bilateral
- **Facial deformity** (late) — push outward
- Eye changes (proptosis, vision loss)
- Neurologic signs (cranial extension)

### Diagnosis
- **CT** = gold standard for staging + extent
- **Biopsy** (endoscopy or via rhinotomy) → histopath
- Submandibular LN palpation + FNA if enlarged
- **Always image thorax** — rule out met

### Treatment
- **Benign**: surgical excision
- **Malignant** (most cases): **Radiation therapy** = treatment of choice
  - Limited by proximity to eyes + brain
  - Combination: surgery → radiation
  - Chemotherapy = adjunct only (less effective)
- Long-term **prognosis = poor** for invasive cases

---

## 3. Brachycephalic Airway Syndrome (BAS)

### Components — 4 + 2 secondary
**Primary** (congenital):
1. **Stenotic nares**
2. **Elongated soft palate**
3. **Hypoplastic trachea**
4. **Aberrant turbinates** (especially Pug)

**Secondary** (develop from primary):
5. **Everted laryngeal saccules**
6. **Laryngeal collapse** (Stage 1: saccule eversion · Stage 2: cuneiform collapse · Stage 3: corniculate collapse)

### Clinical
- **Stertor** (snoring) at rest, especially during sleep
- Stridor if laryngeal involvement
- **Sleep-disordered breathing** — wakes up gasping
- Exercise intolerance, cyanosis
- **GI problems** (gulping air → bloat → vomiting/regurgitation)

### Diagnosis
- Signalment: brachycephalic breed (Pug, Bulldog, Boxer, Shih Tzu, Persian cat)
- **Laryngoscopy** under anesthesia — see soft palate length, larynx structures
- X-ray skull + thorax

### Treatment
- **Surgery is treatment of choice** (correct anatomy permanently)
- Medical: weight control, avoid stress, exercise restriction
- Emergency: O₂, sedation, dexamethasone, intubation if needed

### Prognosis
- Early surgery → good
- Late surgery (laryngeal collapse) → poor

---

## 4. Laryngeal Paralysis

### Demographics
- **Large breeds**: **Labrador Retriever** (most common!), Saint Bernard, Newfoundland
- **Older animals** (>9 yr)
- Cause often **unknown** (idiopathic) — possibly nerve damage, hypothyroidism

### Pathophysiology
- Recurrent laryngeal nerve dysfunction
- Arytenoid cartilage **fails to abduct** during inspiration
- Air rushes through narrowed glottis → **turbulent flow + edema**
- Edema → further obstruction → vicious cycle

### Clinical
- **Stridor** (high-pitched inspiratory)
- **Voice change** ⭐ — bark sounds different (early sign owners notice)
- Mild cough
- Severe: respiratory distress, cyanosis, syncope, dysphagia

### Diagnosis
- **Laryngoscopy under light anesthesia** ⭐
  - Watch arytenoid movement during respiration
  - **Failure to abduct** = LP
  - Bilateral or unilateral
- Need to **rule out laryngeal mass** with U/S

### Treatment

**Emergency**:
- O₂, sedation, dexamethasone (anti-inflammatory)
- Cool environment, restrict activity

**Surgical** (severe + bilateral):
- **Tieback procedure** (laryngeal lateralization)
- Permanently abducts one side

**Medical** (mild + unilateral):
- Avoid heat, exercise restriction, weight control
- ⚠️ Long-term complication: **aspiration pneumonia** (post-tieback, palate doesn't seal)

---

## 5. Tracheal Collapse ⭐ (เจอบ่อยมาก)

### Demographics
- **Toy breeds**: **Pomeranian** (most!), Yorkshire, Poodle, Chihuahua, Maltese
- Middle-age to older
- **Cats rarely** affected
- Inherited tendency (cartilage abnormality)

### Pathophysiology
- Tracheal cartilage = C-shaped + dorsal trachealis muscle (membrane)
- **Cartilage softens** + **dorsal membrane sags**
- Form **crescent moon shape** (dorsal sag)
- Dorsal membrane vibrates against air → "**goose honking cough**" 🦢

### Concurrent diseases worsening symptoms
- **Obesity** — increases airway sensitivity
- **MMVD** (cardiac disease) — left atrial enlargement compresses trachea
- **Allergic/infectious bronchitis** — adds inflammation
- **Bronchomalacia** (cartilage soft in bronchi too)

### Dynamic Collapse — Location matters!
| Location | Worse during |
|---|---|
| **Cervical (extra-thoracic)** | **Inspiration** (negative pressure pulls collapse inward) |
| **Thoracic (intra-thoracic)** | **Expiration** (positive intra-thoracic pressure pushes inward) |
| **Both / mixed** | Both phases |

### Common collapse site
- **Thoracic inlet** (T1) — junction of cervical + intra-thoracic trachea = **HIT zone**
- **Tracheal kinking** — trachea bends, hard to image

### Clinical
- **Goose honking cough** 🦢 = pathognomonic
- **Tracheal palpation reflex+** (gentle press → cough)
- Exercise intolerance, cyanosis if severe
- Worse with excitement, heat, weight gain

### Diagnosis
- **X-ray** — best done at **inspiration AND expiration** to capture dynamic collapse
- **Tangential view** (head up, lateral X-ray) — can show cervical narrowing
- **Fluoroscopy** ⭐ = best (real-time, no anesthesia)
- **CT** = better detail than fluoroscopy
- **Echocardiogram** — rule out concurrent MMVD

### Stages (severity grading)
- Mild — slight narrowing
- Moderate — significant narrowing
- Severe — near complete collapse

### Treatment

**Emergency**:
- O₂, sedation (acepromazine or butorphanol)
- Dexamethasone (anti-inflammatory)
- Anti-tussive (butorphanol, hydrocodone)
- Bronchodilator
- ⚠️ Avoid: stress, heat, excessive handling

**Long-term medical**:
- **Weight control** ⭐ (most important)
- Anti-tussive (suppress cough cycle)
- Bronchodilator (terbutaline, theophylline)
- Steroid (taper to lowest effective)

**Surgical** (severe + refractory):
- **Intra-luminal stent** ⭐ (Nitinol self-expanding) — for thoracic location
- **Extra-luminal prosthetic ring** (PRRC) — for cervical location
- ⚠️ Stent **permanent** — tissue fibrosis can cause re-stenosis

### Prognosis
- Mild + good owner compliance → ok long-term
- Severe + concurrent disease → guarded

---

## 6. Chronic Bronchitis (Dog) ⭐ (เจอเยอะมาก)

### Diagnostic criteria (3 must)
1. **Chronic cough** > **8 weeks**
2. Excess mucus production
3. **Rule out other causes** (heart disease, tracheal collapse, infectious bronchitis, parasites)

### Demographics
- **Small breeds**, middle-age to older
- Dogs > cats

### Pathophysiology
- **Inhaled irritant** (eran/non-allergen) → airway inflammation
- Neutrophilic inflammation
- **Bronchial wall thickening** + **mucus production**
- Eventually: **bronchiectasis** (dilated airways) and/or **bronchomalacia** (collapse)
- Vicious cycle: cough → more inflammation → more cough

### Predisposing
- Air pollution, **PM 2.5**, smoke
- Obesity
- Concurrent dental disease
- History of canine infectious respiratory disease complex (CIRDC, "Kennel cough")

### Clinical
- **Chronic cough** (terminal retching with mucus expectoration)
- Initially non-productive → eventually productive
- Patient still alert/active (no systemic signs early)
- Severe: dyspnea, **expiratory push** (use abdominal muscles), cyanosis

### Diagnosis
- Tracheal palpation — cough reflex+
- Auscultation: wheezes, crackles
- **X-ray pattern**: **Bronchial pattern**
  - "**Donuts**" (cross-section) — thickened bronchi cross-cut
  - "**Tram lines**" (longitudinal) — parallel thickened walls
- BAL: **non-degenerative neutrophils**

### Treatment

**First-line: Steroids** ⭐
- Initial high dose, then taper to lowest effective
- **Inhaled corticosteroid** (ICS): Fluticasone or Beclomethasone
- Use **mask + spacer** for cats/small dogs (7-10 puffs × 2× daily)
- ⚠️ ICS onset ~7-10 days for full effect — not 3 days!

**Adjunct**:
- **Bronchodilator** if dyspnea (terbutaline, theophylline)
- ⚠️ Don't combine theophylline + fluoroquinolones (drug interaction)
- **Cough suppressant** if dry cough · ⛔ NOT productive cough
- **Nebulization with saline** + **coupage** (cup-hand percussion)
- **Doxycycline** if concurrent infection suspected

**Lifestyle**:
- **Weight control** ⭐
- Avoid PM 2.5, air pollutant exposure
- Air purifier indoors

### Prognosis
- **Cannot cure** — chronic management for life
- Compliance + weight control = key

---

## 7. Feline Inflammatory Bronchial Disease (FIBD) ⭐

### 2 distinct diseases
| | Feline Chronic Bronchitis | **Feline Asthma** |
|---|---|---|
| **Mechanism** | Eran-induced inflammation | Allergic (IgE Type 1 hypersensitivity) |
| **Reversibility** | Permanent damage | **Reversible** (with allergen removal) |
| **BAL cytology** | Neutrophilic | **Eosinophilic** |
| **Cell type** | Neutrophils | Eosinophils |

⚠️ Clinical signs IDENTICAL — must do BAL to distinguish

### Demographics
- All ages but middle-age common
- **Predisposed breeds**: Siamese, Oriental, Burmese cats

### Pathophysiology of asthma — 3 hallmarks
1. **Reversible airway inflammation** (allergen-driven)
2. **Airway obstruction** (mucus + bronchoconstriction)
3. **Airway hyperresponsiveness** (sensitive to triggers)

Components:
- Epithelial cell hyperplasia
- **Smooth muscle hypertrophy/constriction** ⭐
- Goblet cell hyperplasia → mucus
- Bronchial wall thickening

### Air Trapping ⭐
- During asthma attack: **smooth muscle contraction**
- Air enters but cannot exit → **trapped in alveoli**
- X-ray finding: **lung hyperinflation** + **flat diaphragm** + radiolucent lung

### Clinical
- Cough, **expiratory dyspnea + abdominal push**
- **Crackles** (mucus) + **wheezes** (bronchoconstriction)
- ⛔ **Air trapping** → muffled lung + heart sounds (deceptive)
- Severe: **status asthmaticus** = life-threatening

### Diagnosis
- X-ray: **bronchial + bronchointerstitial pattern** + **lung hyperinflation** + flat diaphragm
- **Right middle lobe atelectasis** (collapsed lobe) common
- **BAL** → cell count + differential
  - Eosinophilic = asthma
  - Neutrophilic = chronic bronchitis
- ⚠️ **Multiple lobes** for BAL (cell distribution variable)
- **Mycoplasma PCR** on BAL fluid (cats often co-infected)

### Treatment

**Acute crisis (status asthmaticus)**:
- **O₂ supplementation** ⭐
- **Reduce stress** (cats can die from stress!)
- **Bronchodilator** ⭐
  - **Terbutaline** IV/IM/SQ
  - **Albuterol/Salbutamol inhaled** (mask spacer)
- **Steroid IV**: Dexamethasone
- ⚠️ Don't handle excessively until stable

**Long-term**:
- **Prednisolone** systemic (taper to lowest effective)
- **Inhaled steroid** (Fluticasone) BID
- **Bronchodilator** if needed (long-term: not albuterol — beta-agonist tachyphylaxis)
- Avoid known triggers
- Weight control

### Prognosis
- **Cannot cure** — lifelong management
- Asthma → ⚠️ 25% develop **spontaneous pneumothorax** (air trapping → bullae)

---

## 🎯 Exam recap (12 ข้อ)

1. **Aspergillosis** = depigmentation + epistaxis + turbinate destruction · Tx = topical clotrimazole
2. **Sinonasal tumor** = old age + chronic unilateral discharge · Tx = radiation
3. **BAS** = stenotic nares + elongated soft palate + hypoplastic trachea + secondary saccule eversion
4. **Tracheal collapse pathognomonic** = goose honking cough in toy breeds (Pomeranian)
5. **Tracheal collapse worse**: cervical → inspiration · thoracic → expiration
6. **Tracheal collapse Tx**: stent (intra-thoracic) · prosthetic ring (cervical) · medical first
7. **Chronic bronchitis** = chronic cough >8 weeks + rule out others
8. **Bronchial X-ray pattern** = donuts + tram lines
9. **ICS onset** = 7-10 days for full effect (not 3 days)
10. **Feline asthma** = eosinophilic + reversible · vs chronic bronchitis = neutrophilic + permanent
11. **Air trapping** = bronchoconstriction → lung hyperinflation + flat diaphragm
12. **Status asthmaticus** = O₂ + bronchodilator + steroid + stress reduction

> 📚 อ่านควบ: 14.1 Common Resp II Pleural cavity (FlutqheRR6I) · 14.2 Surgical Resp (nzpDNtceKKk) · 13.2 Resp Clinical Assessment (az6ZIjbDFwQ)`,
  },

  eBY8GTlcjiw: {
    videoId: 'eBY8GTlcjiw',
    title: '10.3 : Lower Urinary System 3',
    subject: 'com1',
    date: '2024-10-21',
    duration: '84 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ + clinical reasoning',
    summary: `# 10.3 Lower Urinary System 3 — FIC · UTI · Incontinence · Nutrition

> 🎯 ครอบคลุม **FIC (cat) ⭐ · UTI dx & ATB stewardship · USMI · ectopic ureter · feeding calculation**. FIC + UTI ออกสอบแน่ — case-based reasoning เน้น

---

## 1. Feline Idiopathic Cystitis (FIC) ⭐

### Demographics
- **Top disease in cats < 10 years** (UTI is rare in cats this age)
- Increasing incidence post-COVID (work-from-home stress)
- Cats > 10 years → think nephrolith, UTI first

### Diagnosis = "Diagnosis of Exclusion"
- Cannot diagnose FIC at first visit
- Must **rule out**:
  1. **Urolithiasis** (X-ray + U/S)
  2. **UTI** (urine C&S — but rare in cats!)
  3. Neoplasia (bladder mass)
  4. Other

⚠️ **X-ray often misses lesions** — supplement with **U/S** (sees small stones, bladder wall mass)

### Etiology — UNKNOWN ⛔
- Old name: **idiopathic FLUTD**
- Now part of "**Pandora Syndrome**" — opens many cans of worms
- Multifactorial belief (NOT proof):
  1. **Cat factors** — temperament, obesity, indoor lifestyle
  2. **Environment** — multi-cat household, lack of enrichment
  3. **Owner** — relationship dynamics, stress sources
- **Stress** = strong correlation but NOT proven cause

### Pathophysiology (proposed)
- **Neurogenic inflammation** (stress → nerve signal → inflammation)
- **GAG layer disruption** — protective glycosaminoglycan layer of bladder mucosa lost
- Without GAG → urine directly irritates mucosa → inflammation cycle

### Treatment (5 ยาหลัก — ⚠️ careful, cats stressed by pilling!)

1. **GAG layer supplement** — restore mucosal protection
2. **Pain control** — NSAIDs (cat-safe ones)
3. **Anti-anxiety** — Fluoxetine, Amitriptyline (severe stress signs)
4. **Maropitant (Cerenia)** — blocks substance P (neurogenic inflammation) — newer adjunct
5. **Antibiotics** — ⚠️ **NOT routinely indicated** (FIC ≠ infection!)
6. **Linex** (urethral relaxant) — popular but **little evidence**

⚠️ **Pill aversion** — pilling stresses the cat MORE → worsens FIC. **Pick the most important medication only**, drop the rest if patient won't take

### Diet management ⭐
- **Hill's c/d Multicare Stress** — contains:
  - **Tryptophan** (serotonin precursor)
  - **Alpha-casozepine** (anxiolytic peptide)
- ⚠️ **NEVER abrupt diet change** — cats hate change · gradual transition
- Tip: place new food + small portion of old food side-by-side · let cat choose

### Water intake increase
- Each cat unique preference: stainless bowl, ceramic, bowl height, fountain, drips
- **Flavored water** (chicken/salmon broth) — newer trend in market

### Environmental modification (memo / EE)
- **N+1 rule** (litter boxes, water bowls, feeders) — but **doesn't always work** (multi-cat houses, small condos)
- Adjust **case-by-case** — listen to owner first
- ⚠️ **Don't change everything at once** — sometimes makes worse
- Goal: let cat express predator/explorer behavior (puzzle feeder, hiding spots, climbing)
- ⚠️ **Equal love distribution** — extra attention to one cat triggers jealousy stress in others

### Owner education
- Vet = **coach**, not commander
- Find true stresser (boyfriend? new cat? new apartment? construction noise?)
- Sometimes the answer is "Don't medicate, just adjust environment"

### Prognosis
- **Episodic, recurrent** — many cats relapse with stress events
- Some need **lifelong** environmental + dietary management

---

## 2. Urinary Tract Infection (UTI) ⭐

### Demographics
- **Cats** — RARE if < 10 yr (unless predisposing: spinal injury, paralysis)
- **Cats > 10 yr** — common
- **Dogs** — common, often comorbid (Cushing's, diabetes, CKD)

### Diagnosis
- ⚠️ **Bacterial UTI** (other types — viral/fungal/yeast — rare or hard to prove)
- **Need 3 things for bacterial UTI**:
  1. **Attachment** (key target for prevention!)
  2. **Colonization**
  3. **Persistence**

### Sample collection
- **Cystocentesis** = gold standard (sterile)
- **Catheterization** = OK if cysto contraindicated (e.g., suspected TCC → cysto would seed tumor)
- **Voided/free-catch** — only for tools that have specific cut-offs (like SDMA), not for culture

### Sub-categories (ISCAID Guidelines ⭐)
| Type | Definition |
|---|---|
| **Sporadic UTI** | < 3 episodes / 12 months |
| **Recurrent UTI** | ≥ 3 episodes / 12 months |
| **Relapse** | Recurrent + **same organism** → drug/dose/duration was inadequate |
| **Re-infection** | Recurrent + **different organism** → host factor (concurrent disease) |
| **Subclinical bacteriuria** | Bacteria in urine + NO symptoms → **don't treat** if non-virulent |
| **Super-infection** | New resistant organism appears during ATB course |

⚠️ Old terminology "Simple vs Complicated" — replaced by Sporadic vs Recurrent

### Workup
1. **Urine C&S** (Culture + Drug Sensitivity)
2. ⛔ **NOT "MIC test"** — common mistake! MIC = Minimum Inhibitory Concentration (after culture grows). Use term: "**urine culture and drug sensitivity**"
3. Subsequent: identify type of UTI → treatment plan

### Empirical antibiotics (while waiting C&S — ~7 days)
| Agent | Use |
|---|---|
| **Amoxicillin-clavulanic acid** | First-line ⭐ |
| **Sulfonamides (TMP-S)** | Alternative · ⚠️ caution renal toxicity |
| **Fluoroquinolone** (high dose, short course 3-5 days) | Newer concept for severe cases |

### "We treat the patient, not the lab result"
- If symptoms resolve on chosen ATB despite resistance reported → continue
- If symptoms persist + lab says resistant → switch
- Case-by-case — don't blindly follow lab

### Key principle
- **Sporadic** = mild → empirical OK · don't necessarily need C&S confirmation
- **Recurrent (Relapse)** = drug/dose/duration was inadequate → review regimen
- **Recurrent (Re-infection)** = host factor → look for Cushing's, DM, anatomic abnormality (ectopic ureter)
- **Subclinical bacteriuria** = leave alone if non-virulent · (paralysis cats often have this)

### Prevention principles
- Target **attachment phase** (most important)
- Cranberry products (proanthocyanidins block adhesion) — limited evidence
- Address underlying disease

---

## 3. Urinary Incontinence

### Definitions
- **Continence** = ability to hold urine
- **Incontinence** = loss of voluntary control
- ⚠️ Not the same as **Polyuria** — old dog on diuretics may be polyuric, not incontinent (just can't get up fast enough)

### Micturition phases
| Phase | Detrusor (bladder muscle) | Sphincter |
|---|---|---|
| **Storage** | RELAX | CONTRACT |
| **Voiding** | CONTRACT | RELAX |

Memory: "**ParaSym = Pee · Sym = Storage**"
- Sympathetic (alpha-receptor) → sphincter contracts
- Parasympathetic → bladder contracts

### Clinical clues
| Pattern | Phase issue |
|---|---|
| **Drip drip when lying down (sphincter not closing)** | **Storage failure** (sphincter incompetence) |
| **Urination + dripping during attempts** | **Voiding failure** (obstruction or atony) |

### Bladder size clue
- Storage failure → **small bladder** (constantly leaks empty)
- Voiding failure → **large bladder** (can't empty)

### Neurological exam
- ⚠️ **Don't only check withdrawal + nail-pinch** (femoral/sciatic nerve = LMN spinal lower)
- **Pudendal nerve** (S1-S3) controls external urethral sphincter
- Test: **anal reflex, bulbocavernous reflex** → assess pudendal

---

### A. USMI (Urethral Sphincter Mechanism Incompetence)

**Demographics**: middle-age **large-breed spayed female** (Labrador, Golden, etc.) · spayed at young age

**Pathophysiology**: ↓ estrogen → ↓ alpha-receptor expression on sphincter → sphincter weakness during Storage phase

**Diagnosis**: based on signalment + rule out other causes (UTI, stones)

**Treatment options**
1. **Estrogen** — incomplete response · ⚠️ **risk: aplastic anemia** (estrogen toxicity in dogs)
2. **Alpha-agonist** — Phenylpropanolamine (PPA) ⭐ works best
   - ⛔ **PPA banned in Thailand since 2001** — illegal as veterinary drug
   - Imported "underground" only — risk to clinic if found
3. **Ephedrine** — alternative alpha-agonist
4. **Surgical**: collagen injection (intra-mural) or **artificial sphincter device** (extra-mural) — both **not available in Thailand**
5. **In Thailand reality**: → "**Pampers / diaper**" (Cosmetic management) since meds + surgery not accessible

### B. Ectopic Ureter

**Demographics**: **Young female large breed** (often Labrador puppies 3 months) · ⚠️ owners notice "drip drip from birth"

**Pathophysiology**: ureter opens at wrong location (urethra, vagina) instead of bladder neck

**Diagnosis**:
- **CT urography with IV contrast** ⭐
- **Cystoscopy** — direct visualization

**Types**:
- **Intra-mural** — ureter has tunnel through bladder wall but opens distal — laser ablation possible (not in Thailand)
- **Extra-mural** — ureter completely bypasses bladder — surgical reimplantation only

**Treatment in Thailand** = **Surgery only** (laser ablation not available)
- **Ureteroneocystostomy** (re-implant ureter to bladder)
- ⚠️ Outcome inconsistent — recurrent UTI common post-op (sphincter dysfunction persists)
- Sometimes condition is BETTER LEFT alone if mild — comparison: leaking diaper vs persistent UTI/pyelonephritis

---

## 4. Nutrition Calculation ⭐ (สำคัญ!)

### Step 1: Calculate RER (Resting Energy Requirement)

**Formula** (use this when possible):
- **RER = 70 × (BW kg)^0.75** kcal/day

**Linear shortcut** (only for animals 2-30 kg):
- RER = 30 × BW + 70 kcal/day

⚠️ **Use ideal BW**, not actual BW (don't include fat from obesity)

### Step 2: Apply Factor → DER (Daily Energy Requirement)

| Patient state | Factor |
|---|---|
| Healthy adult dog | 1.6× RER |
| Healthy adult cat | 1.2× RER |
| Growing puppy/kitten | 2-3× RER |
| Pregnant | 1.6-3× RER |
| Lactating | 4-8× RER |
| Working dog | 2-8× RER |
| Obesity weight loss | 0.8-1.0× RER |
| Hospitalized | 1.0-1.4× RER |

### Step 3: Match to food caloric content

**Example calculation** (10 kg dog, factor 1.0 for sick patient):
- RER = 70 × 10^0.75 = 70 × 5.62 = **393 kcal/day**
- Food k/d wet = 422 kcal/can
- Need: 393 / 422 = **~0.93 can/day** ≈ 1 can/day
- Split: morning ¾ can + evening ¼ can

### Apply to all kidney/stone diets
- Hill's k/d (kidney), s/d (struvite stones), c/d (idiopathic cystitis), u/d (urate stones)
- ⚠️ Reading "give x/d" without calorie calc = often wrong
- Always calculate kcal needed → divide into meals

---

## 🎯 Exam recap (15 ข้อ)

1. **FIC** = top diagnosis for **cat < 10 yr** with hematuria/dysuria after rule-outs
2. **FIC etiology** = UNKNOWN · "stress-related belief" but NOT proven
3. **Pandora syndrome** — FIC is a part of it
4. **FIC diet** = c/d Multicare **Stress** (tryptophan + alpha-casozepine)
5. **FIC owner** = case-by-case · don't blindly follow N+1 rule
6. **UTI cats < 10 yr** = rare unless paralysis/spinal disease
7. **UTI workup**: cystocentesis → urine **culture + drug sensitivity** (NOT "MIC")
8. **Sporadic vs Recurrent UTI** = < 3 vs ≥ 3 episodes / 12 months
9. **Relapse vs Re-infection** — same organism = drug/dose/duration issue · different = host factor
10. **Subclinical bacteriuria** = leave alone (paralysis cats)
11. **Empirical ATB**: amoxiclav OR sulfa
12. **USMI** = older spayed female large breed (Lab, Golden)
13. **PPA banned in Thailand** since 2001 — illegal · use diapers as cosmetic management
14. **Ectopic ureter** = young female large breed · surgical only
15. **Pudendal nerve (S1-S3)** controls external sphincter — test with anal reflex
16. **RER formula** = 70 × BW^0.75
17. **DER** = RER × Factor (1.0-3+ depending on state)

> 📚 อ่านควบ: 8.1 Upper Urinary (a9cdFzIKIGA) · 8.2 LUT 1 (z0Id0mmM4Fk · obstruction stabilize) · 8.3 LUT 2 Stones (vLjnPuFgvj4) · 10.1 Imaging Urinary (Q0AGFF70m8M) · 10.2 Surgical Tx Urinary (WtvWyniLMVE)`,
  },

  az6ZIjbDFwQ: {
    videoId: 'az6ZIjbDFwQ',
    title: '13.2 : Clinical Assessment of the Respiratory System',
    subject: 'com1',
    date: '2024-11-11',
    duration: '88 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ — cough receptor location ออกแน่ ⚠️',
    summary: `# 13.2 Clinical Assessment of the Respiratory System

> 🎯 Foundation video สำหรับ Common Resp ทั้งหมด — anatomy split + history + auscultation + clinical signs (sneeze, stridor, stertor, cough, dyspnea) + breathing patterns + workup approach. **Cough receptor location ออกสอบทุกครั้ง** ⚠️

---

## 1. Anatomy Split

### Upper Respiratory Tract
- **Nose → External nares → Nasal cavity → Pharynx → Larynx → Trachea (cervical, before thoracic inlet)**
- = **External / Cervical / Extra-thoracic trachea**

### Lower Respiratory Tract
- **Intra-thoracic trachea → Bronchi → Bronchioles → Alveoli + Interstitium**
- Plus: **Thoracic wall + Diaphragm + Pleural cavity**

⚠️ Critical landmark: **Thoracic inlet (T1)** divides upper vs lower

---

## 2. History Taking

### Signalment
- Age, sex, breed, weight
- ⚠️ Each predisposes different diseases:
  - Brachycephalic → BAS
  - Toy breed older → tracheal collapse
  - Large breed older → laryngeal paralysis
  - Cat (any age) → asthma, bronchitis
  - Young dog → infectious (CIRDC, kennel cough)

### Clinical signs (key clues)
- Nasal discharge (color, amount, side)
- Sneeze · Reverse sneezing
- Stertor / Stridor
- Cough (productive/non-productive)
- Dyspnea / Respiratory distress
- Other systemic signs (fever, lethargy)

### Duration
- **Acute < 3 weeks**
- **Sub-acute 3-8 weeks**
- **Chronic > 8 weeks**

### Character + Location + Onset = full history

---

## 3. Physical Examination

### Observation (ตั้งแต่เดินเข้าห้อง!)
- Posture, gait
- Mental status
- Facial symmetry — **swelling, asymmetric eye, etc.**
- Respiratory rate + effort
- HR, CRT, body temperature

### Examination details
- Inspect both nares (discharge, deformity)
- **Air flow test**: cool glass slide → fog up → check both sides equal/unequal
- Open mouth examine — **rule out oronasal fistula** if discharge contains food
- Palpate: lymph nodes (submandibular), tracheal palpation
- Eyes — proptosis, visual reflex
- Neurological exam if facial deformity

### Auscultation (ฟังให้ครบทุก lobe)
- Imagine **9-grid pattern** on each chest side
- **Bronchial sound** (red zone) — over trachea + main stem bronchi · loud
- **Bronchovesicular sound** (blue/middle) — between
- **Vesicular sound** (peripheral) — soft "leaves rustling"

### Lobe distribution clue
- **Caudoventral** = where left CHF effusion sits → must auscultate caudo-ventrally
- ⚠️ Don't only listen at neck/cranial chest!

### Inspiration:Expiration ratio
- **Normal**: 1:1 to 1:2
- **1:3 or more** → expiratory effort issue (lower airway, chest)
- **2:1 or more** → inspiratory effort issue (upper airway, larynx)

### Percussion (เคาะ)
- Normal lung = resonant (hollow)
- **Dull tone** = fluid or mass

---

## 4. Common Findings & Pathology

### Wheezes
- Whistling sound during airflow through narrowed airway → vibration
- **Mostly heard during EXPIRATION** = lower airway pathology
- During inspiration = upper airway/extra-thoracic trachea
- High-pitched = small airway (bronchioles)
- Low-pitched = large airway (trachea, main bronchi)
- Causes: tracheal collapse, asthma, bronchitis, mass compression
- Often paired with **expiratory abdominal push**

### Crackles
- Air bubbling through fluid OR rapid opening of small airways
- **Coarse crackles** — large airways · low-pitched · throughout breath
  - Causes: pneumonia, edema, fibrosis
- **Fine crackles** — small airways · high-pitched · **end-inspiration only**
  - Sound: rubbing hair near ear
  - Causes: edema, bronchitis, pneumonia, pulmonary fibrosis

### Decreased/absent breath sounds
- Something between chest wall + lung (insulator)
- **Pleural effusion** → muffled VENTRAL (gravity)
- **Pneumothorax** → muffled DORSAL (air rises)
- **Mass/diaphragmatic hernia** → focal silence

### Heart sounds
- Often muffled with same conditions

---

## 5. Clinical Presentations

### A. Nasal discharge

**Defense mechanism**: ciliary apparatus + mucus

**Volume + Frequency + Location + Color** = differentiate

| Type | Color | Cell | Cause |
|---|---|---|---|
| **Serous** | Clear watery | None | Tearing, irritation, viral, allergic |
| **Mucoid** | Clear thick | Mucin | Chronic non-infectious inflammation |
| **Muco-purulent** | Yellow-green | Neutrophils + mucus | Secondary bacterial, neoplasia |
| **Purulent** | Yellow-green thick | Neutrophils | Infected, severe inflammation |
| **Sangineous** | Blood-tinged + other | Mixed | Local trauma, mucosal damage |
| **Epistaxis (กำเดา)** | Pure blood | RBC | Severe trauma, fungal, neoplasm |
| **Food** | Food contents | — | **Oronasal fistula** (cleft palate, neoplasia) |

### Causes by location
- **Intra-nasal**: aspergillosis, nasal tumor, foreign body, trauma → **unilateral first**
- **Extra-nasal**: lower airway disease, systemic (HT, coagulopathy, hyperviscosity) → **bilateral**

### Causes by duration
- **Acute (<2 wk)**: irritation, allergy, viral, foreign body
- **Chronic (months)**: neoplasia, fungal, polyp

### B. Sneezing (จาม)
- Expel particles from cranial nasal cavity
- ⚠️ Pawing at nose suggests intranasal pathology
- Early disease = a lot of sneezing · later = less sneezing + more discharge

### C. Reverse Sneezing (ดูดกลืน)
- Inspiration of air rapidly + neck extension + elbow abduction
- Caused by **nasopharyngeal irritation**
- ✅ **Normal in dogs** if occasional
- ⚠️ Frequent + severe = pathology
- ⚠️ **Cats** — never normal · think **feline asthma**, fungal disease

### D. Stertor (กรน)
- **Low-pitched** snoring sound
- During **inspiration** (mostly)
- Cause: Soft tissue/wall vibration in **nasopharynx + nasal cavity**
- Worse during sleep/relaxation
- Common in: **Brachycephalic breeds** (BAS), pharyngeal mass

### E. Stridor (หวีดแหลม)
- **High-pitched** whistle
- During **inspiration**
- Cause: narrowing of larynx or **extra-thoracic trachea**
- Common in: **laryngeal paralysis**, laryngeal mass, foreign body
- Worse during exercise/excitement

### F. Cough

**Defense mechanism** to clear airway

**Cough receptors** ⭐⭐⭐ **OUT OF EXAM EVERY YEAR**:
| Location | Type |
|---|---|
| **Larynx** | ✅ |
| **Trachea** | ✅ |
| **Bronchi** | ✅ (NOT alveoli, NOT bronchioles!) |

⚠️ **Cough only originates from these 3 locations** — alveolar inflammation alone won't cause cough

**Stimulus → C-fiber → CN X (Vagus) → Cough Center (medulla) → motor → cough**

### Cough triggers
- Mechanical (physical compression — e.g., **enlarged left atrium pressing on left main bronchus** in MMVD)
- Chemical (inhaled irritants)
- Inflammatory mediators

### Cough types
| Type | Description | Causes |
|---|---|---|
| **Non-productive** ("dry") | Harsh, hacking | Tracheal/bronchial stenosis, early infection, chronic bronchitis early |
| **Productive** ("wet") | Lower-pitched, terminal retch with mucus | Pneumonia, late chronic bronchitis, lower airway infection |

### G. Dyspnea / Respiratory Distress

**Definition**: difficulty breathing — variable signs:
- Tachypnea (don't equate alone — also from excitement)
- **Open-mouth breathing**
- Nostril flaring
- Neck extension (straightens airway)
- Stress, fear
- **Orthopnea** = can't lie down comfortably (must sit/stand)
- **Paradoxical respiration** — chest + abdomen out of sync

---

## 6. Breathing Patterns ⭐ (สำคัญ ออกสอบ)

### A. Obstructive
- **Slow + deep** breathing
- ⚠️ **Inspiratory effort + sound** = upper airway (Stertor → nasal/nasopharynx · Stridor → larynx/extra-thoracic trachea)
- ⚠️ **Expiratory effort + abdominal push** = lower airway (intra-thoracic trachea, bronchi)
- **Mixed** = both phases obstructed → think permanent stenosis

| Sign | Likely location |
|---|---|
| Inspiratory + Stertor | Nasal cavity / nasopharynx |
| Inspiratory + Stridor | Larynx / extra-thoracic trachea |
| Expiratory + abdominal push | Lower airway (intra-thoracic) |
| No sound + abdominal distention | Diaphragm impingement |
| No sound + nothing else | Intra-thoracic structure |

### B. Restrictive
- **Fast + shallow** breathing
- Cannot fully expand lung
- Causes:
  - **Lung parenchyma**: pneumonia, edema, fibrosis
  - **Pleural cavity**: effusion, pneumothorax, mass, hernia

### C. Paradoxical
- Chest + abdomen move out of sync
- During inspiration → chest IN, abdomen OUT (instead of normal)
- Causes:
  - **Flail chest** — multiple rib fractures in same rib in 2+ places · floating segment moves opposite to chest wall
  - Severe pleural disease
  - Diaphragmatic dysfunction

---

## 7. Localization Summary

| Sign | Likely location |
|---|---|
| Sneezing + nasal discharge | Nasal cavity / paranasal sinus / nasopharynx |
| Reverse sneeze | Nasopharynx |
| Stertor | Nasal cavity / nasopharynx |
| Stridor | Larynx / extra-thoracic trachea |
| Cough | Larynx / trachea / bronchi |
| Dyspnea (only) | Larynx / intra-thoracic location |
| Cough + dyspnea | Bronchi-alveolar location |

---

## 8. Diagnostic Approach by Location

### Nasal cavity
1. **History + signalment**
2. **Examination** (symmetry, air-flow test, oronasal exam)
3. **Imaging**: X-ray skull (open mouth view) → CT
4. **Endoscopy** (rigid + flexible for nasopharynx)
5. **Biopsy** + histopath
6. **Fungal culture / serology** if aspergillosis suspect
7. ⚠️ **Avoid nasal swab for culture** (normal flora contamination, low value)

### Larynx + Pharynx
1. **History + observation**
2. **Auscultation chest** (always!)
3. **Laryngoscopy under light anesthesia** (see arytenoid abduction during inspiration)
4. ⚠️ **Don't use surgical OR speculum on awake patient**

### Lower airway (trachea, bronchi)
1. **History + auscultation**
2. **Fecal exam, parasite serology** (parasites mimic resp signs)
3. **X-ray thorax** ± CT
4. **Bronchoscopy + BAL/Tracheal wash**
5. Flexible scope through ET tube

### Pulmonary parenchyma
1. **Auscultation**
2. **X-ray + CT** (CT > X-ray sensitivity)
3. **Ultrasound** (peripheral lesions)
4. **FNA / core biopsy** (US-guided)
5. **BAL**

### Pleural cavity
1. **Auscultation** (location of muffling)
2. **T-FAST** ⭐ (point-of-care US, minimal restraint — for unstable patient)
3. X-ray (if stable)
4. **Thoracocentesis** + fluid analysis ± culture

---

## 9. Auscultation Sound Library

| Sound | Phase | Cause |
|---|---|---|
| Bronchial | Inspiration + expiration equal | Normal central airways |
| Vesicular | Soft, expiration brief | Normal periphery |
| **Wheeze** | Mostly expiratory | Lower airway narrowing |
| **Coarse crackle** | Throughout | Fluid/secretions in large airways |
| **Fine crackle** | End-inspiration | Edema/fibrosis in alveoli |
| **Stridor** | Inspiratory | Laryngeal/upper airway stenosis |
| **Stertor** | Inspiratory (low) | Nasopharyngeal vibration |

---

## 🎯 Exam recap (15 ข้อ — สำคัญสุดๆ)

1. **Cough receptors** = **Larynx + Trachea + Bronchi** (NOT alveoli!) ⭐⭐⭐ ออกทุกปี
2. **Vagus nerve (CN X)** = afferent for cough
3. **Stertor** = **inspiratory**, low-pitched, nasopharynx
4. **Stridor** = **inspiratory**, high-pitched, larynx/extra-thoracic trachea
5. **Wheezes** = expiratory mostly, lower airway
6. **Coarse crackles** = throughout, large airway
7. **Fine crackles** = end-inspiration, alveoli
8. **Pleural effusion** → muffled **ventral** auscultation
9. **Pneumothorax** → muffled **dorsal** (air rises)
10. **Reverse sneeze** = normal occasionally in dogs · NEVER normal in cats (think asthma)
11. **Inspiration:Expiration normal** = 1:1 to 1:2
12. **Obstructive breathing** = slow, deep
13. **Restrictive breathing** = fast, shallow
14. **Flail chest** = multiple rib fractures in same rib in 2+ places → paradoxical movement
15. **Dyspnea + cough** = bronchoalveolar location · **dyspnea alone** = larynx or intra-thoracic
16. **Don't use nasal swab for culture** (normal flora) · use **biopsy** instead
17. **T-FAST** = first-line for unstable patient with suspected effusion

> 📚 อ่านควบ: 13.3 Common Resp I (phyvefbYWqE) · 14.1 Common Resp II (FlutqheRR6I) · 14.2 Surgical Resp (nzpDNtceKKk) · 14.3 Thoracic Sx (_azRwNxOJas) · 7.2 Fluid analysis (9Fvz4J6dMCo)`,
  },

  '2SJ4M6IiJeU': {
    videoId: '2SJ4M6IiJeU',
    title: '4.1 : GI Diagnosis (Imaging-based)',
    subject: 'com1',
    date: '2024-08-26',
    duration: '91 min',
    instructor: 'อาจารย์ — vet imaging integration',
    examFormat: 'MCQ — image identification + algorithm',
    summary: `# 4.1 GI Diagnostics — Imaging-based Approach

> 🎯 Foundation video สำหรับ alimentary tract imaging — ใช้ **X-ray + Ultrasound + CT** ในการวินิจฉัย. เน้น **ภาพถ่ายตามอนาตอมี + GI motility + contrast techniques**. เน้น **case-based image MCQ**

---

## 1. Roentgen Signs (อ่านภาพต้องเรียงตามนี้)

### Memorize: **Location · Size · Shape · Contour · Opacity · Motility**
- เหมือน "5 colors" ของ X-ray
- ⚠️ **Motility ต้องใช้ contrast study หรือ Ultrasound** — plain X-ray ไม่เห็น

### Differential diagnosis = ใช้ทั้ง 6 elements ร่วมกัน → narrow down

---

## 2. Imaging Modalities — Quick Compare

| Modality | Strength | Limitation | Cost |
|---|---|---|---|
| **X-ray (plain)** | Screening · GI dilatation · radio-opaque FB | Layer not visible · 2D | ~500 THB |
| **X-ray + Contrast (UGI/BE)** | Mucosal pattern · motility · stricture | Long study (24-48 hr) · Ba aspiration risk | 5,000+ THB |
| **Ultrasound** ⭐ | Real-time · layers visible · peripheral organs · vessels | Operator-dependent · **air poor through** | 1,000-2,000 THB |
| **CT scan** | 3D volume · surgical planning · best resolution | Expensive · radiation · sedation | ~10,000 THB |

⚠️ **Modality ladder**: X-ray → US → Contrast → CT (escalate as needed)

---

## 3. Contrast Media

### Barium Sulfate (suspension)
- ✅ Coats mucosa well · stable · doesn't dilute
- ✅ Cheap · accessible (Vitra Sam, etc., ~chocolate-box packaging)
- ⚠️ **Cannot use if perforation suspected** (causes severe granuloma in peritoneum)
- ⚠️ Aspiration → severe pneumonitis
- Mix ratio: **liquid for stomach/intestine** vs **paste for esophagus** (study muscle contraction)
- Standard dose: **10 mL/kg** (small/medium dog)

### Iodine Solution (water-soluble)
- ✅ Use **if perforation suspected** (absorbed safely)
- ✅ Both **ionic + non-ionic** OK for GI (oral) — non-ionic preferred
- ⚠️ Diluted by GI fluid (less radiopaque)
- ⚠️ Hyperosmolar → can cause diarrhea
- ⚠️ Expensive (~50 THB/mL)
- Dilution: **1:2 with water**

### Aspiration risk
- ⚠️ ALWAYS ask: vomiting? GI rupture suspect?
- Plain film FIRST → if free air seen → switch from barium to iodine

---

## 4. Gastric Emptying Time

| Species | Normal emptying time |
|---|---|
| **Dog** | ~4 hours |
| **Cat** | ~1 hour ⚠️ much faster |

### Used in barium series
- T0 (immediate) → 30 min → 1 hr → 2 hr → 4 hr (dog) → 24 hr if delayed
- Detect: gastric outflow obstruction, ileus, motility disorder

---

## 5. Disease Patterns

### A. Esophageal Disease

#### PRAA (Persistent Right Aortic Arch)
- **Vascular ring anomaly** — most common type · 95%
- Compresses esophagus at **heart base** → megaesophagus
- Clinical: regurgitation **starting when switching to solid food** (~2-3 mo)
- X-ray: **dilated esophagus** with cranial bulging
- Barium: contrast pools cranial to heart base
- ⚠️ Always **CT confirm** before surgery (variants exist: PRAA, double aortic arch, Persistent ductus diverticulum)

#### Esophageal Foreign Body
- Common: bone, stick (kebab skewer!), fishhook, fruit pit
- Stick perforation = emergency
- Diagnosis: X-ray (radiopaque) → endoscopy
- Need surgery or endoscopic removal

#### Megaesophagus
- Other causes: idiopathic, myasthenia gravis, infectious

### B. Gastric Disease

#### Gastric Dilatation-Volvulus (GDV)
**Plain X-ray pathognomonic finding**: **"Popeye Sign"**
- Lateral view: stomach gas pattern with **partition** (dividing wall) → twisted
- ⚠️ MUST distinguish:
  - **Position**: pylorus shifted dorsally
  - **Partition**: rotation creates internal wall

#### Gastric Dilatation (GD only)
- Stomach enlarged · **position normal** (pylorus still right)
- No partition seen
- Causes: gastric outflow obstruction, paralytic ileus, aerophagia

#### Pyloric Stenosis / Pyloric Mucosal Hypertrophy
- Pylorus thickened → outflow obstruction → recurrent vomiting
- Common in **brachycephalic breeds**
- US: thickened pyloric wall + retained ingesta + dilated stomach
- Treatment: pyloroplasty / Y-U pyloroplasty

#### Helicobacter
- Found in dog/cat stomach (controversial pathogen)
- ⚠️ **Zoonotic** — handle with care
- Can erode stomach wall → ulcer · perforation possible

### C. Small Intestine

#### Mechanical Ileus (Obstruction)
- **Cause**: foreign body, intussusception, mass, stricture, hernia
- **Image findings**:
  - **Dilated bowel before lesion** (cranial)
  - **Normal/empty bowel after lesion** (caudal)
  - **Intermixed dilated + normal loops** (key feature!)
- Severity: **Complete vs Partial**
- Complete: severe vomiting, no fecal output, abdominal pain

#### Functional / Paralytic Ileus
- **Causes**: spinal injury, post-anesthesia, peritonitis, hypocalcemia, autonomic dysfunction, severe diarrhea, mesenteric thromboembolism
- **Image findings**:
  - **Diffuse generalized dilatation** (whole bowel similar size)
  - **No focal severity**
  - **No "intermixed pattern"** seen in mechanical

⚠️ Distinguish: mechanical = focal severe + normal · paralytic = uniform diffuse

#### Linear Foreign Body ⭐ (cats!)
- **Common in cats** (string, thread, ribbon, cloth)
- ⚠️ **Always check under tongue** (string anchor)
- Pathophysiology:
  - String anchored at base + bowel peristalsis
  - Bowel "plicates" (folds + bunches up) along string
  - Like: making rose petals from rolled paper
- **Image findings**:
  - **Folded/plicated bowel** with **comma-shaped gas bubbles**
  - On contrast: linear pattern with bowel wrinkled
- **Risk**: bowel perforation along mesenteric border (linear cuts) → peritonitis · POOR prognosis

#### Intussusception
- Bowel telescopes into another segment
- Common: ileocolic
- **Causes**: parvovirus (formerly common), linear FB, peritonitis, mass
- **Palpation**: "**sausage-like structure**" in abdomen
- US ⭐: **"target sign / bullseye"** — concentric rings (outer wall + inner wall + mesentery)
- Often surgical (some need resection)

### D. Large Intestine

#### Constipation / Obstipation
- X-ray: large fecal load, "sausage" segmentation in colon
- ⚠️ **Distinguish from obstipation** (mechanical):
  - Pelvic fracture causing pelvic stenosis
  - Pelvic mass
  - Megacolon (cats)
- **Causes of constipation**: dehydration (CKD), diet, neuro (LMN), drugs

#### Anal Atresia (อิสเอ้)
- Congenital — no anal opening
- **Female (rectovaginal fistula)**: feces exit through vagina · animal can grow → presents later
- **Male**: no escape route → severe early presentation
- **X-ray technique**: head-down, barium under tail → shows distance from skin to rectal pouch
- Surgery technique varies based on rectal pouch position

### E. Other Important Signs

#### Free Air in Abdomen
- ⚠️ = **GI perforation** = surgical emergency
- ⛔ Don't give barium contrast!
- Causes: ulcer rupture, FB perforation, post-op leak

---

## 6. Imaging Algorithm

| Step | Action | If positive | If negative |
|---|---|---|---|
| 1 | **Plain X-ray (2 views)** | Free air? → ⚠️ surgical emergency · no barium | Continue |
| 2 | Obvious FB / massive dilation? | Surgery / endoscopy | Continue |
| 3 | **Ultrasound** | Sees lesion → FNA / biopsy → surgery | Continue |
| 4 | **Contrast study (Ba UGI or BE)** | Motility, stricture, mucosal pattern detected | Continue if complex |
| 5 | **CT scan** | Surgical planning, 3D volume | — |

---

## 7. Ultrasound GI Layers ⭐

**5 layers visible** on high-frequency US:
1. **Mucosa-lumen interface** (white)
2. **Mucosa** (hypoechoic — black)
3. **Submucosa** (hyperechoic — white)
4. **Muscularis** (hypoechoic — black)
5. **Serosa-mesentery** (hyperechoic — white)

Disease patterns:
- **Mural lesion** = wall thickening (neoplasia, inflammation)
- **Loss of layering** = neoplasia
- **Outer-layer effacement** = aggressive neoplasia (penetrating)

### Motility on US (real-time!)
- Normal **peristalsis**: forward propulsion waves
- **Anti-peristalsis**: backward → vomiting suspect
- **Decreased motility** = ileus

---

## 8. Common Diagnoses Cheat Sheet

| Image finding | Likely diagnosis |
|---|---|
| Megaesophagus + bird beak narrowing at heart base | **PRAA** |
| Stomach dilation + partition + Popeye sign | **GDV** |
| Stomach dilation + normal position | **GD only** |
| Pyloric thick wall + retained ingesta | **Pyloric stenosis** |
| Free air in peritoneum | **GI perforation** ⚠️ emergency |
| Dilated bowel (cranial) + normal (caudal) | **Mechanical obstruction** |
| Diffuse uniform dilation | **Paralytic ileus** |
| Plicated/folded bowel + comma gas | **Linear foreign body** (cat) |
| Sausage palpation + target sign US | **Intussusception** |
| Large fecal load + pelvic abnormality | **Obstipation** (pelvic obstruction) |

---

## 🎯 Exam recap (15 ข้อ)

1. **6 Roentgen Signs** — Location, Size, Shape, Contour, Opacity, Motility
2. **Imaging ladder** — X-ray → US → Contrast → CT
3. **Barium = NO if perforation** suspect (use iodine instead)
4. **Gastric emptying** = dog 4 hr · cat 1 hr
5. **PRAA** = vascular ring · regurgitation when switching to solid food (~2-3 mo)
6. **GDV pathognomonic** = Popeye sign + partition wall
7. **GD vs GDV** = position (pylorus location)
8. **Pyloric stenosis** = brachycephalic breeds, recurrent vomiting
9. **Mechanical ileus** = mixed dilated + normal bowel loops
10. **Paralytic ileus** = uniform diffuse dilation
11. **Linear FB** in cats = check under tongue, plicated bowel
12. **Intussusception** = sausage palpation + bullseye US
13. **Free abdominal air** = perforation = NO barium · surgical emergency
14. **Anal atresia female** = rectovaginal fistula (feces through vagina)
15. **US can't see through air** — start with plain X-ray
16. **CT** when you need surgical planning + 3D volume
17. **Helicobacter** = zoonotic, handle stomach samples carefully

> 📚 อ่านควบ: 4.2 Endoscope + Stomach (0C218gD_tZM) · 5.1 Intestine Sx (lS4wSGDKFrY) · 6 Hepato Pancreas Sx (5rcEK-3IW0M) · 10.1 Imaging Urinary (Q0AGFF70m8M)`,
  },

  '6mOoAWOWTDw': {
    videoId: '6mOoAWOWTDw',
    title: '12.2 : Cardiac Arrhythmia + Thromboembolism + Hypertension',
    subject: 'com1',
    date: '2024-11-04',
    duration: '110 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ — ECG ID + drug class + ATE 5P + HT target organs',
    summary: `# 12.2 Cardiac Arrhythmia + Thromboembolism + Hypertension

> 🎯 ครอบคลุม **3 หัวข้อใหญ่**: ECG arrhythmias (brady + tachy) · Anti-arrhythmic drugs (4 classes) · ATE (Arterial thromboembolism · 5P sign) · Systemic Hypertension. **ECG identification + drug selection** ออกสอบ ⭐

---

## 1. Sinus Rhythm — Criteria (ปกติ)

### 5 criteria
1. **P upright** (lead II)
2. Every P followed by **QRS complex**
3. Every QRS preceded by **P**
4. **PR interval < 0.12 sec** (dog) · < 0.09 (cat)
5. Regular rhythm + appropriate rate

### Variations (still normal)
- **Sinus arrhythmia** — irregular but each P→QRS still preserved · respiratory pattern (faster on inspiration, slower on expiration)
- **Wandering pacemaker** — P morphology varies (different cells in SA node firing)

---

## 2. Bradyarrhythmias

### Rate threshold
| Species | Bradycardia |
|---|---|
| **Large dog** | < 60 bpm |
| **Small dog** | < 80 bpm |
| **Cat** | < 130 bpm |

### A. SA Nodal Disorders (3 types)

#### 1. Sinus Bradycardia
- Normal P-QRS-T but slow rate
- ⚠️ **Always check underlying causes first**:
  - High vagal tone (chronic resp disease, BAS, brain mass)
  - **Drugs** (beta-blockers, even **eye drops with anti-glaucoma**)
  - GI upset (severe diarrhea/vomiting)
- Treatment: **find + remove cause**

#### 2. Sinus Pause / Sinus Arrest
- **Definition**: RR interval > 2× normal
- After pause, beat may be sinus, junctional escape, or ventricular escape
- **Sick Sinus Syndrome** = Sinus pause + Syncope (collapse)
- Predisposed: **Miniature Schnauzer**, American Cocker, West Highland Terrier
- Treatment:
  - Asymptomatic → no treatment
  - Symptomatic → trial **Terbutaline** (β2 → β1 cross-effect) or **Theophylline** (methylxanthine)
  - **Pacemaker** if drugs fail

#### 3. Atrial Standstill
- **No P wave** → atrial myocardium not depolarizing
- Causes:
  - **Hyperkalemia** ⚠️ most common (rule out FIRST)
  - Atrial fibrosis (rare)
- Predisposed (rare): English Springer Spaniel, Old English Sheepdog

##### Hyperkalemia treatment (memorize order)
1. **Calcium gluconate** — fastest (corrects membrane potential, doesn't change K+)
2. **Insulin + dextrose** — shifts K+ into cells
3. **Sodium bicarbonate** — alkalosis shifts K+
4. **Furosemide** — excretes K+
5. **Pacemaker** if persistent

### B. AV Nodal Disorders

#### 1st Degree AV Block
- **PR interval prolonged** (dog > 0.12-0.13, cat > 0.09)
- Every P → QRS still present, just delayed
- Causes: high vagal tone, drugs (digoxin)
- Treatment: usually none

#### 2nd Degree AV Block
**Mobitz Type I (low grade)** — PR interval **progressively lengthens** until **dropped beat** (no QRS) → Wenckebach
**Mobitz Type II (high grade)** — fixed PR + sudden dropped beat
- High grade > 1 dropped per 3 = serious

#### 3rd Degree (Complete) AV Block
- **P and QRS dissociated** (independent)
- QRS = **escape beat** (junctional or ventricular)
- ⛔ **Don't suppress escape beats** — they're saving the heart!
- Treatment: **Pacemaker** if symptomatic

### Bradyarrhythmia Summary
| Disease | Treatment |
|---|---|
| Sinus bradycardia | None / address cause |
| Sick sinus syndrome | Terbutaline trial → Pacemaker |
| Atrial standstill | Treat hyperkalemia → Pacemaker |
| 1st degree AV block | None |
| 2nd degree (high grade) | Consider pacemaker if symptomatic |
| 3rd degree complete | Pacemaker |

---

## 3. Tachyarrhythmias — Foundation

### Action Potential — 2 cell types

#### Pacemaker cells (SA, AV node)
- **Resting potential**: less negative (~-55 mV)
- **Phase 4 depolarization** (auto)
- **Calcium-dependent** (Ca channels for Phase 0)
- **Slow upstroke** Phase 0
- **Automaticity** (auto-fire)

#### Non-pacemaker cells (atrial, ventricular myocytes)
- **Resting potential**: very negative (~-90 mV)
- **No auto-firing** normally
- **Sodium-dependent** Phase 0
- **Fast upstroke**

### Mechanisms of arrhythmia
1. **Increased automaticity** — non-pacemaker cells acquire pacemaker properties (injury)
2. **Re-entry** — circular conduction loop · requires **uni-directional block + slowed conduction**

### Distinguishing automaticity vs re-entry
| Pattern | Likely mechanism |
|---|---|
| **Premature beats interspersed in normal rhythm** | Automaticity |
| **Abrupt onset paroxysm** + sustained or terminates abruptly | **Re-entry** |

---

## 4. Anti-Arrhythmic Drug Classes (Vaughan Williams)

| Class | Mechanism | Use | Examples |
|---|---|---|---|
| **I** | **Sodium Channel blocker** | Non-pacemaker cells (VT, atrial premature) | **Lidocaine** ⭐, Procainamide, Mexiletine |
| **II** | **Beta blocker** | Suppress automaticity | Atenolol, Esmolol |
| **III** | **Potassium Channel blocker** (prolong refractory) | Re-entry | **Sotalol**, Amiodarone |
| **IV** | **Calcium Channel blocker** | Pacemaker cells (junctional, AV node) | **Diltiazem**, Verapamil |
| Other | — | — | **Digoxin** (slow AV conduction) |

### Drug selection logic
- **VT (Ventricular)** → Class I (Sodium blocker, especially lidocaine) or Class III
- **SVT** → Class II/III/IV depending on mechanism
- **Junctional tachycardia** → Class IV (calcium blocker)
- **Atrial fib (rate control)** → Diltiazem + Digoxin combo

### Lidocaine specifics
- **Bolus IV** for VT acute
- Short-acting → CRI for maintenance
- **Dose-dependent toxicity**: hand tremor, seizures (CNS)
- ⚠️ No oral form — convert to **Mexiletine** for chronic management

---

## 5. Tachyarrhythmia Identification

### A. Sinus Tachycardia
- All Sinus criteria met but **fast rate**
- Causes: pain, fever, fear, hyperthyroidism, hypovolemic shock, **CHF (compensatory)**, hyperthermia
- Treatment: **address underlying cause** (rarely needs anti-arrhythmic)

### B. Supraventricular Tachycardia (SVT)
- **Origin above AV node**
- **Narrow QRS** (uses normal conduction system)
- ⚠️ Wide QRS possible if AV/conduction system disease (then call it "wide-QRS tachycardia")
- **P waves visible** (usually)

### C. Ventricular Tachycardia (VT)
- **Origin below AV node** (ventricular myocardium)
- **Wide QRS**
- **No P relationship** to QRS (or P→QRS dissociated)
- Causes:
  - **Cardiogenic** (cardiomyopathy, large heart)
  - **Non-cardiogenic** (most common in dogs!): hepatic mass, splenic mass, pain, sympathetic surge, electrolyte imbalance, GDV
- Treatment: **Lidocaine first-line** (Class I)

### D. Atrial Fibrillation (AF) ⭐
**Pathognomonic 4 features**:
1. **Tachycardia**
2. **Narrow QRS** (supraventricular)
3. **No P waves** (multiple re-entry waves)
4. **IRREGULARLY irregular RR** ← **most important key**

⚠️ Auscultation = "tubatu-tutu-bu-tutu" (no pattern)

### E. Atrial Flutter
- Re-entry but **larger circuit**
- **F waves visible** (sawtooth) — not P waves
- RR also irregular but more regular than AF

### AF/Flutter Management
- **Rhythm control**: cardioversion (electrical) or amiodarone — usually **fails** in vet med (heart already big)
- **Rate control** (preferred): **Diltiazem + Digoxin** combo
- ⚠️ Avoid β-blocker in CHF (can worsen)

### Premature beats (non-sustained)
- **VPC (Ventricular Premature Complex)** = early wide QRS without P
- **APC (Atrial Premature Complex)** = early narrow QRS, abnormal P
- **JPC (Junctional Premature)** = early narrow QRS with inverted P
- Treatment: only if frequent, sustained, or symptomatic

---

## 6. Arterial Thromboembolism (ATE) ⭐

### Demographics
- **Cats >>> dogs** (almost exclusively cats!)
- Especially **HCM cats** (12% develop ATE)
- **Acute onset** — owner often thinks "got run over by car"
- Mean age: 5-8 yr (Sphynx, Ragdoll, Maine Coon)

### Pathophysiology — Virchow's Triad
1. **Blood stasis** (low cardiac output)
2. **Endothelial injury**
3. **Hypercoagulability**

### Common location
- **Saddle thrombus** at aortic trifurcation → both hindlimbs paralyzed
- Other: brachial (forelimb), mesenteric (intestinal infarction), renal (AKI)

### Clinical — **5 P's** ⭐
1. **Pulse-less** (first sign!)
2. **Pale** (then cyanotic = Purple)
3. **Poikilothermia** (cold extremity)
4. **Pain** (severe early — first 24-48 hr)
5. **Paresis/Paralysis** (neurologic damage)

### Distinguishing from neurological problem
- ATE: **leg cold + necrotic** (leg dies)
- Spinal cord disease: **leg WARM** (perfusion intact)

### Diagnosis
- **5 P's** clinical exam
- **Doppler probe** on distal artery → no audible pulse confirmation
- **Infrared thermometer** → temp difference
- **Glucose gap** (ATE limb − normal limb) > 30 mg/dL = positive
- **Lab**: hyperkalemia (later), hyperlactatemia, ↑AST (muscle damage)
- **Echocardiography**: spontaneous contrast ("smoke") or visible thrombus in LA

### Treatment

**Goals**:
1. Pain relief (acute) — **Fentanyl** CRI · usually only needed first 48 hr
2. **Prevent further clotting** (NOT lyse the existing clot!)
3. Treat concurrent CHF
4. Address shock

⚠️ **Don't give thrombolytic (TPA, streptokinase)** — risk of **reperfusion injury** (sudden K+ release → cardiac arrest) · 50% mortality

⚠️ **Surgery feasible only within 4-6 hr golden period** — usually too late by presentation

### Anti-platelet drugs
- **Clopidogrel** ⭐ better than aspirin (less GI side effects, more effective)
- **Aspirin** (low dose)

### Anti-coagulant drugs
- **Unfractionated heparin** (UFH) — more bleeding risk
- **Low molecular weight heparin (LMWH)** — Anti-Factor Xa, less bleeding, more expensive
- **Rivaroxaban** — oral Factor Xa inhibitor

### Prognosis indicators (poor)
- Hypothermia (T < 98.6°F = 37°C)
- Bradycardia (cat in shock)
- Absent pain + reflex (severe nerve damage)
- Bilateral involvement
- ⚠️ "Leg gone" if no return of pulse in **72 hours** = amputation

---

## 7. Systemic Hypertension

### Definitions
- **Systolic > 160 mmHg sustained** = systemic hypertension
- 3 types:
  1. **Situational/Environmental** (white coat effect) — exclude first!
  2. **Secondary** — most common in vet med
  3. **Primary/Idiopathic** — uncommon (13-20%)

### Secondary causes
| Cat | Dog |
|---|---|
| **CKD** ⭐ most | **CKD** ⭐ most |
| **Hyperthyroidism** ⭐ | **Cushing's** ⭐ |
| Acromegaly | **Diabetes mellitus** |
| — | Pheochromocytoma |

Other (any species): hyperaldosteronism, drugs (steroids, EPO, NSAIDs), hypothyroidism, liver disease

### Measurement (cuff method)
- Use **Doppler** > **oscillometric** (Doppler more accurate in cat!)
- Cuff width = **30-40% of limb circumference**
- Patient calm, ideally same operator each time
- Take **5-7 readings** → discard outliers → average rest
- Position: limb at heart level

### Target Organ Damage (TOD) ⭐ — 4 organs
1. **Kidney** — glomerular damage → albuminuria, proteinuria
2. **Eye** — retinal detachment, blindness, retinal hemorrhage
3. **Brain** — disorientation, seizures, coma (often missed)
4. **Heart** — concentric LV hypertrophy

### Treatment cutoffs
| BP | Action |
|---|---|
| < 140 mmHg | Normal |
| 140-160 | Pre-hypertensive · monitor q3-6 mo |
| 160-180 with TOD | **Treat now** |
| 160-180 no TOD | Recheck in 2 mo |
| > 180 with TOD | **Treat now** |
| > 180 no TOD | Recheck in 2 weeks |

### Treatment — Drugs

**Dog first-line**:
- **ACE inhibitor (enalapril, benazepril)** OR
- **ARB (telmisartan)** ⭐
- Reduces ~10-20 mmHg
- Need **calcium channel blocker (amlodipine)** for greater reduction (40-60 mmHg)

**Cat first-line**:
- **Amlodipine** ⭐ (works fast, peak 1 hr)
- ACE inhibitor as second-line
- ARB (telmisartan) per IRIS guidelines = newer first-line option

### Re-check timing
- Amlodipine: re-check in **3-4 hours** (fast onset)
- ACE inhibitor: re-check in **7-10 days** (slow steady state)

### Drug warnings
- **ACE inhibitors / ARBs** caution with **dehydration, azotemia** (worsens GFR)
- Goal: keep BP **< 160 systolic** AND > 120 (avoid hypotension)

### Combination therapy
- Dog: ACE inhibitor + Amlodipine OK
- Cat: Amlodipine + ARB OK (different mechanisms)

---

## 🎯 Exam recap (20 ข้อ)

1. **Sinus rhythm** = P upright + every P→QRS + PR < 0.12 (dog) · 0.09 (cat)
2. **Bradycardia threshold** = 60 (large dog) · 80 (small dog) · 130 (cat)
3. **Atrial standstill = Hyperkalemia** until proven otherwise
4. **Hyperkalemia order** = Calcium gluconate → Insulin/dextrose → bicarbonate → furosemide
5. **Sick sinus syndrome** = Sinus pause + Syncope · Schnauzer breed
6. **Don't suppress escape beats** in 3rd degree AV block
7. **Class I = Na blocker** (Lidocaine for VT)
8. **Class II = Beta blocker** (suppress automaticity)
9. **Class III = K blocker** (re-entry, prolong refractory)
10. **Class IV = Ca blocker** (pacemaker cells, junctional, AV nodal)
11. **VT first-line** = Lidocaine
12. **Atrial fibrillation 4 features** = tachycardia + narrow QRS + no P + irregularly irregular RR
13. **AF treatment** = Rate control (Diltiazem + Digoxin) > Rhythm control
14. **ATE = HCM cats** mostly · saddle thrombus most common
15. **5 P's of ATE** = Pulselessness, Pale, Poikilothermia, Pain, Paralysis
16. ⛔ **Don't lyse ATE clot** (reperfusion injury, 50% mortality)
17. **ATE prognosis** = 72 hr no perfusion = amputation
18. **HT 4 target organs** = Kidney, Eye, Brain, Heart
19. **Doppler > oscillometric** in cats for BP
20. **Cat HT first-line** = Amlodipine · **Dog HT first-line** = ACE-I or ARB

> 📚 อ่านควบ: 11 Cardio Eval CHF (H5z8i1YOteY) · 12.1 Acquired Cardiac Disease (SiLZIu-aWlY) · 13.1 Surgical Heart (dn_W-7eWQl0)`,
  },

  'SiLZIu-aWlY': {
    videoId: 'SiLZIu-aWlY',
    title: '12.1 : Acquired + Congenital Cardiac Disease',
    subject: 'com1',
    date: '2024-11-04',
    duration: '117 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ — disease ID by signalment + auscultation + imaging',
    summary: `# 12.1 Acquired + Congenital Cardiac Disease

> 🎯 ครอบคลุม **3 acquired diseases** (MMVD · DCM · HCM) + **5 congenital defects** (PDA · VSD · SAS · PS · ToF). **Don't mix dog/cat/acquired/congenital** in answer ⚠️ ที่ออกสอบบ่อย: **breed + age + murmur location → disease**

---

## ACQUIRED Cardiac Diseases (3 only)

| Disease | Species | Breed |
|---|---|---|
| **MMVD/DMVD** ⭐ | Dog | Small + Toy breeds (CKCS, Poodle, Chihuahua, Shih Tzu) |
| **DCM** | Dog | Large breeds (Boxer, Doberman, Great Dane, Irish Wolfhound) |
| **HCM** ⭐ | Cat | Maine Coon, Persian, Ragdoll, Sphynx, ASH |

⚠️ **NEVER mix species** in exam answers!

---

## 1. MMVD / DMVD (Myxomatous/Degenerative Mitral Valve Disease)

### Demographics
- **Most common cardiac disease in dogs** — small/toy breeds
- **Older dogs** (>6-7 yr) — except **CKCS at 4 yr** (early onset breed)
- **Males > females** · males have **worse prognosis**

### Pathophysiology
- **Primary**: leaflet thickening, chordae tendineae elongation/rupture
- **Mitral regurgitation** during systole → blood backflow to LA
- **Volume overload** → LA enlargement → eccentric LV hypertrophy
- LA pressure ↑ → pulmonary vein congestion → pulmonary edema → **Left CHF**

### Clinical
- **Cough, dyspnea, tachypnea** (Pulmonary edema)
- Exercise intolerance, syncope
- ⚠️ Cough also from cardiomegaly compressing trachea (not just pulmonary edema)

### Murmur
- **Left apex (mitral valve location)** = ICS 4-5 left
- **Systolic murmur** (S1)
- Heard with stethoscope below front-leg level

### Auscultation
- **Wet rales/crackles** if pulmonary edema
- **Increased lung sounds** if early CHF

### Why measure BP in MMVD?
1. Concurrent **systemic hypertension** worsens regurgitation (more resistance → more backflow)
2. Late stage = Cardiac output drops → BP drops

### Imaging Findings
**X-ray** (cardiogenic pulmonary edema pattern):
- ⭐ Distribution: **caudo-dorsal** (most reliable for cardiogenic edema)
- ⭐ **LA enlargement** with **caudal split of caudal lobar bronchi** (look for this!)
- Pulmonary vein > pulmonary artery (vein congestion)
- **Perihilar edema** initially → progressive
- Pattern: interstitial → alveolar

**Echocardiography**:
- LA:Ao ratio **>1.6** = LA enlargement
- Mitral valve thickening, prolapse (cup-shaped)
- Color Doppler: regurgitant jet (large jet area / LA = severity)
- M-mode: LV chamber dilatation

### Classification (ACVIM 2019 Guidelines)
| Stage | Definition |
|---|---|
| **A** | Predisposed breed, no murmur yet |
| **B1** | Has murmur, **no cardiomegaly** |
| **B2** | Has murmur **with cardiomegaly** (LA:Ao >1.6, VHS >10.5) |
| **C** | Active or past CHF |
| **D** | Refractory to standard therapy |

### Treatment

**Acute CHF**:
- **O₂ therapy**
- **Furosemide** (Volume overload removal — first priority!)
- **Pimobendan** (positive inotrope)
- **Vasodilator** (nitroglycerin/hydralazine — adjunct)

**Chronic by stage**:
- A: nothing
- B1: nothing (re-evaluate)
- B2: **Pimobendan** (delay CHF onset) + dietary management
- C: **4-drug combo** = Furosemide + Pimobendan + ACE inhibitor + Spironolactone
- D: Same + dose adjustment, additional diuretics (HCT, etc.)

### Surgical option
- **Mitral valve repair (clip)** — done at Stage B2+ in some centers
- Not yet available in Thailand

---

## 2. DCM (Dilated Cardiomyopathy)

### Demographics
- **Large breeds**: Boxer, Doberman, Great Dane, Irish Wolfhound, Cocker Spaniel
- ⚠️ **Lab + Golden may be diet-induced** (taurine deficiency from boutique foods!)

### Pathophysiology
- **Primary**: systolic dysfunction (genetic) → poor contraction
- **Secondary causes** ⚠️:
  - **Taurine/L-carnitine deficiency** (BARF, exotic protein, grain-free diets)
  - **Doxorubicin chemotherapy** (cardiotoxic)
  - **Chronic tachycardia** (tachycardia-induced cardiomyopathy)
  - **Trypanosoma cruzi** (Chagas — Texas)
  - **Hypothyroidism**
- Dilation **follows** dysfunction (not before)

### Clinical
- Subtle initial: weight loss, exercise intolerance
- Eventually: dyspnea, cough, ascites (right CHF)
- ⚠️ **Sudden death** from arrhythmia (especially Boxer, Doberman) — owner reports "fine yesterday, dead today"

### Murmur
- **Functional MR** — valve normal but ventricle dilated → leaflets pulled apart
- ⚠️ Murmur often absent in **Early stage** — only develops once heart enlarged

### Auscultation
- **Gallop rhythm** (S3) — common
- Weak femoral pulse (low cardiac output)

### Diagnosis
- Echocardiography ⭐
- **Reduced fractional shortening** (poor contraction)
- Dilated LV chamber + thin walls
- Holter monitor for arrhythmia screening (Doberman, Boxer)

### Treatment

**Pre-clinical (asymptomatic)**:
- **Pimobendan** ⭐ first-line (improves contractility)
- ACE inhibitor (RAAS blockade)
- Anti-arrhythmic if VT present

**Symptomatic (overt CHF)**:
- **All 4 drugs**: Furosemide + Pimobendan + ACE-I + Spironolactone
- ⚠️ **Pimobendan REQUIRED** in DCM (different from MMVD — DCM is contractility issue)
- Treat secondary causes (taurine supplementation, diet change)

---

## 3. HCM (Hypertrophic Cardiomyopathy)

### Demographics
- **Cats only** ⭐ — most common cardiac disease in cats
- Breeds: **Maine Coon** (genetic + early onset), Ragdoll, Sphynx, BSH, ASH, Persian
- **Males > females** · usually 6-7 yr (Maine Coon as early as 1-2 yr)

### Pathophysiology
- **Primary**: genetic
- **Secondary causes** (rule out!):
  - **Hypertension** ⭐
  - **Hyperthyroidism** ⭐
  - **Acromegaly** (GH excess)
  - **Subaortic stenosis**
- LV myocardium thickens → **chamber smaller** → **diastolic dysfunction** (can't fill)
- LA pressure ↑ → pulmonary vein congestion → pulmonary edema OR pleural effusion
- LA dilation → **stasis** → **thrombus formation** → **ATE** (saddle thrombus to hindlimbs)

### Clinical
- Often **asymptomatic** (subclinical)
- CHF: dyspnea, tachypnea (often no cough in cats)
- **ATE** (sudden hindlimb paralysis with cyanotic foot)
- Sudden death possible

### Murmur in HCM (different from MMVD!)
1. **Outflow tract velocity ↑** (chamber narrowed) — Reynold number effect
2. **SAM (Systolic Anterior Motion)** ⭐:
   - Normally anterior MV leaflet stays in LV during systole
   - In HCM: leaflet pulled into LVOT during systole due to:
     - **Chordae malposition** (myocardium thick changes geometry)
     - **Venturi effect** — high-velocity LVOT flow sucks leaflet
   - Result: dynamic LVOT obstruction + MR

### Imaging
**X-ray cat CHF**:
- Pulmonary edema **distribution variable** (no specific pattern in cats)
- Common: **diffuse interstitial → alveolar**
- Can be only caudal lobe!
- **LA pushed dorsally** lifting trachea (different from dog where LA pushes caudal)
- Bilateral atrial enlargement → **"Valentine heart shape"** ⚠️ classic
- ± **Pleural effusion** (can be either alone or with edema)

**Echocardiography**:
- LV wall thickness > 6 mm (diastolic) = HCM diagnostic
- LA:Ao **>1.6** OR **>2.0** for severe
- Reduced LV chamber size

### Classification (Stages)
- A: predisposed breed, normal cardiac
- **B1**: HCM + small LA (low risk for ATE/CHF)
- **B2**: HCM + large LA (high risk for ATE/CHF) ⭐
- C: symptomatic
- D: refractory

### Treatment
**B1**: nothing
**B2**: **Clopidogrel** ⭐ (prevent ATE only — no proven benefit on CHF prevention)
**C (symptomatic)**:
- **Furosemide** (only proven beneficial drug)
- ACE inhibitor — controversial benefit
- Pimobendan — **off-label** in cats, sometimes used in late HCM (when contractility fails)
- Clopidogrel for ATE prevention

⚠️ Cats die from **stress** during treatment — handle gently!

---

## CONGENITAL Cardiac Defects (5 only)

| Disease | Murmur | Breed |
|---|---|---|
| **PDA** ⭐ | Continuous, left base | Female small dog (Poodle, CKCS) — recently French Bulldog |
| **VSD** | Right sternal border | Chihuahua, English Bulldog · also cats! |
| **SAS** | Left base | Large breed (Golden, Boxer, Newfoundland) |
| **PS** ⭐ | Left base | English/French Bulldog (rising!), terriers |
| **ToF** | Variable | English Bulldog, Chihuahua · cyanotic disease |

---

## 4. PDA (Patent Ductus Arteriosus)

### Demographics
- **Most common congenital defect** worldwide
- **Females > males**
- Older popularity: Poodle → Pomeranian → CKCS · now French Bulldog rising

### Pathophysiology
- Ductus arteriosus connects pulmonary artery to descending aorta in fetus
- Normally closes at birth (via O₂ + ↓ prostaglandin → smooth muscle contraction)
- ⚠️ Dog/cat PDA = **NO smooth muscle** → prostaglandin inhibitor doesn't work (unlike humans)
- **Surgery required**

### Hemodynamics
- **Left-to-right shunt**: aorta → pulmonary artery (always L→R because aortic pressure higher)
- Volume overload **left** side (pulm vein → LA → LV)
- **Reverse shunt** (R→L) if pulmonary HT progresses → **differential cyanosis** (cranial pink, caudal cyanotic)

### Murmur
- **Continuous "machinery" murmur** at **left base (under axilla)** ⭐
- Audible during **both systole + diastole**

### Pulse
- **Hyperkinetic ("water-hammer") pulse** — wide pulse pressure
- Diastolic BP drops (blood diverted to PA in diastole)

### Imaging
- **3 enlargements at L base**: aorta + pulmonary artery + LA
- Pulmonary venous + arterial congestion
- Caudal lobar pulmonary edema if CHF

### Treatment
- **Surgical ligation** ⭐ first-line
- **Coil embolization / Amplatzer Canine Duct Occluder (ACDO)** — interventional
- ⚠️ **Best prognosis of all congenital defects** — closed PDA = normal life

---

## 5. VSD (Ventricular Septal Defect)

### Demographics
- Common in: Chihuahua, English Bulldog, French Bulldog
- ⚠️ **Common in cats too** (one of few cardiac defects in cats!)

### Pathophysiology
- Hole in interventricular septum
- **Left-to-right shunt** (LV pressure > RV)
- Severity depends on:
  - **Size of hole** (small = no overload; large = severe)
  - **Location** (apical = LV+RV overload; basilar = pure pulmonary)

### Most common location
- **Perimembranous VSD** (just below aortic valve)

### Murmur
- **Right sternal border (low)** — different from MMVD!
- Systolic murmur

### Imaging
- Variable: LV alone (small VSD) or biventricular enlargement (large VSD)
- Pulmonary overcirculation if large shunt
- Possible perihilar edema

### Treatment
- Small VSD = **no treatment**
- Large VSD = surgical (PA banding palliation, patch closure — not in Thailand)
- ⚠️ **Reverse shunt** = poor prognosis (Eisenmenger physiology)

---

## 6. SAS (Subaortic Stenosis)

### Demographics
- **Large breeds**: Golden Retriever, Boxer, Newfoundland, Rottweiler, English Bulldog
- Cat: typically valvular AS (not subvalvular)

### Pathophysiology
- Fibromuscular ring just below aortic valve
- **Pressure overload** on LV → **concentric LV hypertrophy**
- Sub-endocardial ischemia (thick myocardium can't be perfused)
- Risk of **VT/sudden death** from ischemia

### Murmur
- **Systolic murmur at left base** (aortic valve location)
- Slides cranially from apex toward base

### Pulse
- **Hypokinetic (weak) pulse** — opposite of PDA!

### Imaging
- ⭐ **Ascending aorta dilatation** ("**post-stenotic dilatation**") at 1 o'clock on VD view
- Wide cranial mediastinum
- Heart silhouette may appear normal (not dilated unless CHF develops)
- Echo: subvalvular muscular ridge, hyperechoic endocardium (ischemia)

### Treatment
- ⚠️ **Procedures generally don't prolong survival**
- **Beta-blocker** (slow HR, reduce O₂ demand)
- Restrict exercise (reduce risk of syncope/sudden death)
- Balloon dilation, Cutting balloon = limited success

---

## 7. PS (Pulmonic Stenosis) ⭐ Currently rising in popularity

### Demographics
- Was Terriers (Poodle, Chihuahua) · **Now mostly French Bulldog** (90% of cases!)
- ⚠️ Often comorbid with VSD, SAS in same dog

### Pathophysiology
- Stenosis at pulmonic valve → **right-sided pressure overload**
- RV concentric hypertrophy
- **Right CHF** if severe (ascites, pleural effusion)

### Types
- **Type A (Fusion)**: leaflets fused at commissure, normal annulus → **balloon dilation works**
- **Type B (Hypoplastic annulus)**: thickened wall + small ring → **harder to treat, poor prognosis**

### Murmur
- **Systolic at left base (pulmonary area)**
- Highest in pulmonic position

### Imaging
- ⭐ **Right ventricle hypertrophy** + **pulmonary artery post-stenotic dilatation** (2 o'clock VD)
- Pulmonary undercirculation (small PA + PV)
- LA/LV normal size

### Treatment
- **Balloon valvuloplasty** ⭐ for Type A (success rate ~70%)
- Patch graft surgery for Type B
- Stent placement if hypoplastic annulus

---

## 8. Tetralogy of Fallot (ToF)

### "**Tetra**logy" = **4 components** ⭐ memorize all 4
1. **Pulmonic stenosis**
2. **Right ventricular hypertrophy**
3. **Large VSD**
4. **Overriding aorta** (aorta sits over VSD between LV+RV)

### Demographics
- English Bulldog, Chihuahua, Cat (rare)

### Pathophysiology
- Mixed blood (deoxygenated from RV + oxygenated from LV) → systemic circulation
- → **Hypoxemia** (cyanosis, **Blue Baby**)
- Body compensates → **polycythemia** (↑ RBC)
- ⚠️ Hyperviscosity → poor flow → death

### Clinical
- **Cyanosis** (blue → purple)
- **Tachypnea** (compensate for hypoxia, no dyspnea)
- Exercise intolerance, syncope
- Bluish baby at birth/early

### Imaging
- Heart often **normal-sized**
- Wide cranial mediastinum (overriding aorta)
- Pulmonary undercirculation (small vessels)

### Lab
- **Polycythemia** (↑ Hct, often >65%)

### Treatment
- **Beta-blocker** (slow HR)
- **Phlebotomy** if Hct >65% — small volumes, replace with fluids
- **Modified Blalock-Taussig shunt** (artificial connection between subclavian + PA)
- **Modified PDA** (rare creative procedures)
- All complex surgical not in Thailand yet

---

## 🎯 Exam recap (20 ข้อ)

1. **MMVD** = small old dog · left apex systolic murmur
2. **DCM** = large breed · check **diet** (taurine deficiency from BARF/exotic)
3. **HCM** = cats only · LA enlargement + ATE risk
4. **HCM Valentine heart** = bilateral LA + RA enlargement on VD
5. **Cat CHF** can be edema OR pleural effusion (or both)
6. **MMVD murmur location** = left apex (ICS 4-5)
7. **PDA murmur** = continuous machinery, left base
8. **PDA pulse** = hyperkinetic (water hammer)
9. **SAS pulse** = hypokinetic (weak)
10. **VSD murmur** = right sternal border
11. **PS** = English/French Bulldog rising · type A balloon-friendly · type B hard
12. **ToF 4 components** = PS + RVH + VSD + overriding aorta
13. **ToF lab** = polycythemia (Hct >65%) → phlebotomy
14. **DCM treatment** must include **Pimobendan** (contractility issue)
15. **MMVD Stage C** = 4-drug combo (Furosemide + Pimobendan + ACE-I + Spironolactone)
16. **HCM treatment**: Clopidogrel for ATE prevention · Furosemide for CHF
17. **PDA prostaglandin inhibitor** doesn't work in dogs/cats (no smooth muscle in ductus)
18. **Reverse shunt PDA** = differential cyanosis (cranial pink, caudal blue)
19. **SAM (Systolic Anterior Motion)** in HCM = anterior MV leaflet displaced into LVOT
20. **PS Type A vs B** distinction = annulus size (B = hypoplastic, poor outcome)

> 📚 อ่านควบ: 11 Cardio Eval CHF (H5z8i1YOteY) · 12.2 Arrhythmia + ATE + HT (6mOoAWOWTDw) · 13.1 Surgical Heart (dn_W-7eWQl0)`,
  },

  H5z8i1YOteY: {
    videoId: 'H5z8i1YOteY',
    title: '11 : Cardio Evaluate + Diagnosis Method + CHF',
    subject: 'com1',
    date: '2024-10-28',
    duration: '173 min',
    instructor: 'DekDokVet85 — รุ่นพี่',
    examFormat: 'MCQ — clinical eval + workup steps + CHF drug logic',
    summary: `# 11 Cardiac Evaluation + Diagnostic Methods + CHF

> 🎯 Foundation lecture สำหรับ cardiology block — **3 parts**: clinical evaluation · diagnostic methods · congestive heart failure (CHF). 173 min ยาว แต่เนื้อสำคัญสุดคือ **CHF treatment 4 goals** + neurohormonal compensation

---

## PART 1 — Clinical Evaluation

### Signalment
- **Young (<2 yr)**: think congenital defects
- **Old**: think acquired (MMVD, DCM, HCM)
- Breed-specific predisposition (see 12.1 summary)

### History (Dog symptoms)
| Symptom | Disease clue |
|---|---|
| **Cough + dyspnea** | Left CHF (pulmonary edema) |
| Cough alone (chronic, Toy breed) | Tracheal collapse / cardiomegaly compression |
| Exercise intolerance | Generic — could be anything |
| Weakness | Late stage CHF |
| Syncope | Activity-induced (cardiac) vs spontaneous (neuro) |
| Ascites + peripheral edema | Right CHF |
| Cyanotic mucous membranes | Severe hypoxemia |
| Stunted growth | Congenital defect |

### History (Cat symptoms — vague!)
- Anorexia, weight loss, lethargy = generic for any disease
- ⭐ **Specific cardiac signs in cats**:
  - **Tachypnea** (rapid shallow breathing) at rest
  - **Open-mouth breathing** = emergency
  - **Acute hindlimb paralysis** = ATE (saddle thrombus)
  - "Meditation pose" — sphinx-position breathing
  - Hiding behavior

### Sneeze: Acute vs Chronic
- **Syncope** ≠ seizure (3 features)
  - **Syncope**: activity-induced, brief unconsciousness, no aura, no postictal phase
  - **Seizure**: aura + tonic-clonic + postictal lethargy/disorientation

### Distinguishing dyspnea types
| Pattern | Likely cause |
|---|---|
| **Rapid + shallow** | Restrictive (lung parenchyma OR pleural space) — **typical CHF cat** |
| **Inspiratory + sound** | Upper airway obstruction |
| **Expiratory + abdominal push** | Lower airway obstruction |
| **Mixed** | Severe lung pathology |

---

## PART 2 — Physical Exam (5 cardinal findings)

### A. Mucous Membranes + CRT

**Color**:
- Pink = normal
- **Pale** = anemia OR poor perfusion (cardiogenic shock)
- **Cyanotic (blue)** = hypoxemia
- **Yellow** = jaundice (rare cardiac)

**Cyanosis types**:
- **Central**: all mucosa blue → systemic hypoxemia
- **Peripheral**: only one limb/area → local thrombosis (ATE)
- **Differential** ⭐: cranial pink + caudal blue = **reversed PDA shunt**

**CRT (Capillary Refill Time)**:
- Press gum → release → time to refill
- Normal = **1-2 sec**
- Prolonged → poor perfusion (cardiac failure)
- Pale + prolonged CRT + low body temp = **shock**

### B. Jugular Vein

**Distension**: vein bulges + visible
- **Right CHF** (high CVP)
- Pericardial effusion / cardiac tamponade
- Cranial vena cava obstruction (mass, thrombus)

**Pulsation**: vein pulses synchronously with heartbeat above 1/3 of neck height
- **Tricuspid regurgitation**
- **Right CHF**
- Pulmonary hypertension

### C. Femoral Pulse

| Type | Description | Cause |
|---|---|---|
| **Hyperkinetic / Bounding** | Strong | PDA, anemia, fever, hyperthyroidism |
| **Hypokinetic / Weak** | Weak | Subaortic stenosis, low CO, hypovolemia |
| **Pulse deficit** | Audible heart sound but no pulse felt | Arrhythmia (AF, frequent VPCs) |
| **Absent** | No pulse | ATE, shock |

### D. Abdominal Palpation

- **Fluctuation** (palpate fluid wave) = **ascites** (right CHF, neoplasia, hypoalbuminemia)
- **Hepatomegaly** beyond costal arch = right CHF (hepatic congestion)
- Blood pressure indirectly from femoral pulse character

### E. Thoracic Auscultation (5 components)

#### Observation
- Breathing pattern (rapid shallow = pulmonary edema)
- Posture (orthopnea = can't lie down)

#### Palpation
- **Cardiac impulse** (apex beat) — feel at left ICS 4-5
  - Position shift = mass displacement, cardiomegaly
- **Palpable thrill** (vibration from blood turbulence) = severe murmur (Grade IV+)

#### Percussion
- Normal = resonant (gas)
- Dull = fluid/mass (pleural effusion, mass)

#### Auscultation
**Normal heart sounds**: S1 (closure of AV valves at start of systole) + S2 (closure of semilunar valves at end of systole)

**Abnormal sounds**:
- **Murmurs** — turbulent flow during heart cycle
- **Gallop** — S3 or S4 (stiff or dilated heart)
- **Click** — valve abnormality

#### Murmur Grading (1-6)
| Grade | Description |
|---|---|
| 1/6 | Soft, not always audible |
| 2/6 | Soft but consistently heard |
| 3/6 | Easily heard, moderate intensity |
| 4/6 | Loud, NO palpable thrill |
| **5/6** | Loud + **palpable thrill** ⭐ |
| 6/6 | Audible without stethoscope contact |

#### Murmur location → disease
- **Left apex (mitral area)** = MMVD, MR
- **Left base (pulmonary)** = PS, PDA continuous, ToF
- **Left base (aortic)** = SAS
- **Right sternal border** = VSD, TR

#### Murmur timing
- **Systolic** = AV valve regurgitation (MR, TR) OR semilunar stenosis (AS, PS) OR VSD
- **Diastolic** = AR, PR, MS (rare in vet)
- **Continuous** = PDA ⭐

---

## PART 3 — Diagnostic Methods

### Imaging
- **Thoracic radiograph** ⭐ — first line · cardiac silhouette + pulmonary fields
- **Echocardiography (Echo)** — gold standard for cardiac structure
  - **B-mode (2D)**: structure
  - **M-mode**: chamber dimensions over time
  - **Color Doppler**: blood flow direction (red = toward, blue = away)
  - **Spectral Doppler**: velocity measurement
- **CT angiography**: vascular anatomy + congenital defects

### ECG
- **Lead II** standard
- Detects **arrhythmias** (see 12.2 summary)
- Cardiomegaly clues (chamber enlargement criteria)

### Cardiac Biomarkers
| Marker | Indicates | Use |
|---|---|---|
| **Troponin** (cTnI) | Myocardial injury (myocyte necrosis) | Like liver enzymes — non-specific |
| **NT-proBNP** ⭐ | Cardiac dilation | Differentiates cardiac vs respiratory dyspnea |

⚠️ **NT-proBNP** specifically — helps decide: CHF or respiratory disease?
- Normal NT-proBNP + dyspnea = think respiratory (NOT cardiac)
- Elevated NT-proBNP + dyspnea = think CHF

### Blood pressure
- Doppler (cats) > oscillometric
- Cuff = 30-40% of limb circumference

### Other
- **Holter monitor** — 24-hr ECG (Boxer, Doberman screening)
- **Cardiac MRI** — research level

---

## PART 4 — Congestive Heart Failure (CHF) ⭐⭐⭐

### Definition
Heart can't pump enough blood to meet tissue metabolic demand.

### Categorization

**By function**:
- **Systolic failure**: poor contraction (DCM)
- **Diastolic failure**: poor relaxation/filling (HCM)

**By side**:
- **Left CHF** → pulmonary edema (lung)
- **Right CHF** → ascites + pleural effusion (in cats!) + jugular distension + hepatomegaly

⚠️ Cat exception: **pleural effusion can be from LEFT CHF** in cats (different anatomy — bronchial veins drain into LA)

**By cause**:
- **Myocardial failure** — contractility issue
- **Restrictive failure** — diastolic issue
- **Volume overload** — regurgitation, shunt
- **Pressure overload** — stenosis, hypertension

### Forward vs Backward failure
- **Forward** = inadequate cardiac output → weakness, lethargy, syncope, hypotension, cool extremities
- **Backward** = congestion behind failing side → pulmonary edema (L) OR ascites (R)

---

## Compensation Mechanisms ⭐

### Stage 1: Neurohormonal stimulation
4 systems activate to maintain BP:

1. **Sympathetic Nervous System**
   - ↑ HR, contractility, vasoconstriction → ↑ BP

2. **RAAS (Renin-Angiotensin-Aldosterone System)**
   - Renin → Angiotensin I → **Angiotensin II** (via ACE) → potent vasoconstrictor
   - Angiotensin II → adrenal → **Aldosterone** → Na+/H2O retention
   - Aldosterone also released independently of ACE!

3. **ADH (Anti-Diuretic Hormone, Vasopressin)**
   - Posterior pituitary → free water reabsorption
   - Increases preload

4. **Cortisol** + others

### Counter-regulatory (balance system)
- **Prostaglandin E/I** — vasodilation
- **Natriuretic peptides (ANP, BNP)** — Na+ excretion, vasodilation
- Endothelial-derived NO

### Stage 2: Decompensation
- When activation overwhelms the compensation
- Fluid retention → volume overload → cardiac dilation
- Persistent vasoconstriction → afterload ↑ → wall hypertrophy/remodeling
- Edema, ascites manifest

---

## CHF Treatment — 4 Goals ⭐

### Goal 1: Reduce CONGESTION (น้ำท่วม → ระบายน้ำ)

**Two strategies**:
1. **Remove fluid** = Diuretics (sustainable)
2. **Redistribute fluid** = Vasodilators (temporary)

### Diuretics

#### Loop Diuretics
| Drug | Notes |
|---|---|
| **Furosemide (Lasix)** ⭐ | First-line · rapid onset · 1-2 mg/kg IV/PO |
| **Torsemide** | Newer · 10-20× more potent · once daily · use when furosemide resistance |

⚠️ Furosemide loses **ALL electrolytes** → monitor K+, Na+, Cl-, Ca2+, Mg2+

#### Thiazides
- **Hydrochlorothiazide** — distal tubule · moderate potency
- Often combined with amiloride (commercial: **Moducin**)

#### Potassium-sparing
- **Spironolactone** ⭐ — aldosterone antagonist · also has neurohormonal modulation effect
- **Amiloride** — Na channel blocker · NOT neurohormonal modulator

### Vasodilators

#### Venodilators (preload reduction)
- **Nitroglycerin patch** — applied to chest wall · 12-hr cycle on/off
- ⚠️ Less commonly used now (no strong studies)

#### Mixed (preload + afterload)
- **Sodium nitroprusside** — IV CRI · short acting
- **Hydralazine** — arterial dilator · oral

### Diuretic monitoring
1. **Body weight** (volume status)
2. **Respiratory rate + effort**
3. **Hydration status** (skin tent, mucous membranes)
4. **BUN, creatinine** (over-diuresis → renal injury)
5. **Electrolytes** (especially K+)

### Goal 2: Improve FORWARD FLOW

**Positive inotropes**:
- **Pimobendan** ⭐⭐ — calcium sensitizer + PDE3 inhibitor
  - First-line for **DCM, MMVD Stage B2+**
  - Increases contractility WITHOUT increasing O₂ demand
  - 0.25 mg/kg PO BID
- **Dobutamine** — IV CRI · acute decompensation only

⚠️ Avoid in HCM (wrong physiology — diastolic problem, not contractility)

### Goal 3: Normalize HEART RATE + RHYTHM
- Treat tachy/bradyarrhythmias (see 12.2)
- Common: AF rate control with **Diltiazem + Digoxin**

### Goal 4: NEUROHORMONAL MODULATION

**ACE Inhibitors** ⭐
- **Enalapril, Benazepril** — block angiotensin I → II conversion
- Reduces vasoconstriction + aldosterone release
- Benefits demonstrated in MMVD + DCM
- ⚠️ Caution in dehydration (acute renal failure)

**ARBs** (Angiotensin Receptor Blockers)
- **Telmisartan** ⭐ — newer, more selective
- Better tolerated long-term
- Can use when ACE-I not enough

**Aldosterone antagonists**
- **Spironolactone** — completes RAAS blockade
- ⚠️ ACE-I doesn't fully block aldosterone (which can release independently)

**Beta-blockers** (carefully!)
- Used in **early stage** chronic CHF
- Can WORSEN if heart can't compensate the heart rate drop
- Not first-line in vet med

---

## CHF Treatment by Disease

### Acute Decompensated CHF (Emergency)
1. **Oxygen** ⭐
2. **Furosemide** (high dose IV)
3. **Pimobendan** (if MMVD/DCM)
4. **Sedation** if anxious (avoid Beta-blocker; use butorphanol)
5. ± Vasodilator
6. Monitor hourly (RR, MM color)

### MMVD Stage C (Chronic CHF) — 4-Drug Combo ⭐
1. **Furosemide** (taper to lowest effective)
2. **Pimobendan** (BID)
3. **ACE-I** (Enalapril/Benazepril)
4. **Spironolactone**

### DCM (Symptomatic) — Same 4 + treat arrhythmia
- Pimobendan **mandatory** (vs MMVD where it's helpful)

### HCM (Symptomatic Cat)
- **Furosemide** = ONLY proven beneficial drug
- ACE-I controversial
- Pimobendan off-label (late stage only)
- **Clopidogrel** for ATE prevention

---

## Long-term monitoring
- Owner records **resting respiratory rate (RRR)** at home
  - Normal cat: < 30/min
  - Normal dog: < 25/min
  - Increase = imminent decompensation → ↑ furosemide dose
- Vet visits q3-6 months: re-echo, labs, BP
- Adjust diuretics by weight + symptoms

---

## 🎯 Exam recap (15 ข้อ)

1. **5 cardiovascular exam steps**: MM/CRT, jugular, pulse, abdomen, thoracic auscultation
2. **Differential cyanosis** = reversed PDA shunt (cranial pink, caudal blue)
3. **Hyperkinetic pulse** = PDA, anemia · **Hypokinetic** = SAS, low CO
4. **Pulse deficit** = arrhythmia (more heart sounds than pulses)
5. **Murmur grade 5+** = palpable thrill
6. **NT-proBNP** = differentiates cardiac vs respiratory dyspnea
7. **Troponin** = myocardial injury marker (like liver enzymes)
8. **CHF compensation** = SNS + RAAS + ADH + cortisol
9. **Aldosterone released independently of ACE** → must add Spironolactone for full RAAS block
10. **Treatment 4 goals**: reduce congestion + improve forward flow + normalize HR/rhythm + neurohormonal modulation
11. **Furosemide = first-line diuretic** for acute CHF
12. **Pimobendan** = first inotrope for MMVD/DCM
13. **MMVD Stage C 4-drug combo** = Furosemide + Pimobendan + ACE-I + Spironolactone
14. **Cat HCM** = Furosemide is ONLY proven drug · Clopidogrel for ATE prevention
15. **Owner home monitoring** = resting respiratory rate (cat <30, dog <25)

> 📚 อ่านควบ: 12.1 Acquired + Congenital Cardiac (SiLZIu-aWlY) · 12.2 Arrhythmia (6mOoAWOWTDw) · 13.1 Surgical Heart (dn_W-7eWQl0)`,
  },

  WtvWyniLMVE: {
    videoId: 'WtvWyniLMVE',
    title: '10.2 : Surgical Treatment of Urinary System',
    subject: 'com1',
    date: '2024-10-21',
    duration: '104 min',
    instructor: 'อ.ณิโคล',
    examFormat: 'MCQ — surgical decision + technique + suture choice',
    summary: `# 10.2 Surgical Treatment of Urinary System

> 🎯 Surgery สำหรับ urinary system **kidney → ureter → bladder → urethra**. เน้น **technique selection (nephrotomy vs pyelotomy vs nephrectomy)** + **suture choice** + **iatrogenic risks**

---

## 1. Anatomy Review

### Upper urinary tract
- **Kidneys** (right slightly cranial to left)
- **Ureters**

### Lower urinary tract
- **Urinary bladder (UB)**
- **Urethra**

### Male vs Female differences
**Male dog**: long urethra (prostatic + membranous + penile parts) · prostate adjacent
**Male cat**: urethra exits straight + dorsally · much **smaller diameter** ⚠️
**Female (both species)**: shorter, wider urethra · ⚠️ urinary tract close to **reproductive tract** (uterus, ovaries, vagina)

⚠️ During spay/neuter, urinary tract injury risk!

---

## 2. Pre-surgical Workup

### History + Examination first!
- Don't jump to imaging — exam is free + valuable
- Use **proper terminology** in records:
  - **Pollakiuria** = frequent urination
  - **Oliguria** = decreased urine
  - **Anuria** = no urine
  - **Stranguria** = straining
  - **Hematuria** = bloody urine
  - **Dysuria** = painful

### Labs
- **Urinalysis (UA)** + **Sediment**
- **CBC + Chemistry (BUN, Cr, SDMA)** — kidney function
- **Urine Culture & Sensitivity** ⭐
  - ⚠️ **MUST use cystocentesis sample** for culture — voided/catheterized = contaminated
- **Stone analysis** essential — guides post-op prevention

### Imaging
- **X-ray** (radiopaque stones visible)
- **Ultrasound** (radiolucent stones, masses)
- **Cystoscopy** — small dogs only (urethra too small in cats and small breeds)
- **Scintigraphy** = gold standard for GFR but unavailable in Thailand

---

## 3. Suture Selection ⭐

### Avoid in urinary tract
- ⛔ **Multifilament/braided** — biofilm formation in contaminated environment
- ⛔ **Non-absorbable in lumen** — nidus for stone formation
- ⛔ **Natural (silk, catgut)** — reactive, can promote stone formation

### Use
- ✅ **Synthetic absorbable monofilament** ⭐
- Subtypes:
  - **Short-term** (Polyglecaprone 25 / Monocryl) — UB heals in 7-14 days; OK!
  - **Mid-term** (PDS / Polydioxanone) — universal good choice
  - **Long-term** (PDS larger, Maxon) — caution! tail can persist >3 months → stone nidus risk

### Bladder healing rate
- **50% strength regained in 7-14 days** ⭐
- Use **mid-term** for best balance · Short-term OK if tissue healthy
- Long-term only if abnormal healing expected · ⚠️ avoid getting suture into lumen

---

## 4. Kidney Surgery

### Three main procedures
| Procedure | What |
|---|---|
| **Nephrotomy** | Cut into kidney parenchyma to remove large/embedded stone |
| **Pyelotomy** | Cut into renal pelvis only (less damage) |
| **Nephrectomy** | Remove entire kidney |

### Approach
- **Cranial midline laparotomy** ⭐
- May extend caudally for working room
- May add paracostal (lateral) incision in deep-chested dogs

### Decision algorithm
| Situation | Procedure |
|---|---|
| Large stone filling renal pelvis | **Nephrotomy** |
| Small stone obstructing pelvis | **Pyelotomy** ⭐ (less damage) |
| Severe hydronephrosis + non-functional kidney | **Nephrectomy** |
| Severe pyelonephritis (refractory) | **Nephrectomy** |
| Bilateral stones | **Operate better side first** |

### When to operate on stones (not always indicated!)
1. Rapid stone growth compressing parenchyma
2. **Recurrent infection** linked to stone
3. **Pain**
4. **Obstruction (hydronephrosis)**

### Nephrotomy technique
1. **Mobilize kidney** out of retroperitoneal fat
2. **Vascular occlusion** of renal vessels
   - Surgeon/assistant fingertip occlusion (better than clamp/loop)
   - ⚠️ **Max 20 min ischemia** per textbook (instructor uses **5 min cycles** — releases briefly)
3. **Cut kidney longitudinally** along greater curvature
4. Bluntly dissect down to stone
5. Make incision long enough — too short → kidney tears during stone retrieval
6. Remove stone(s)
7. Lavage with saline
8. Close in **simple continuous** with **3-0 to 4-0 monofilament absorbable**
   - Suture should engage **renal capsule** (capsule alone too thin — must include parenchyma)
9. Inspect for bleeding before closing abdomen

⚠️ **Pre-op check**: contralateral kidney must be functional (don't remove the ONE working kidney!)

---

## 5. Bladder Surgery (Cystotomy)

### Indications
- **Bladder stones (uroliths)** — most common
- **Bladder mass** (TCC, polyp)
- **Bladder rupture** (trauma, iatrogenic catheter injury)
- **Foreign body**
- **Ectopic ureter correction**

### Technique
1. **Caudal midline laparotomy** ⭐
2. Pack abdomen with moist gauze (prevent leakage contamination)
3. **Empty bladder** with cystocentesis or syringe before incising
4. **Stay sutures** at apex
5. Incision at **ventral surface** (avoid dorsal — ureteral entries) on **avascular line**
6. Remove stones with spoon · check both sides + urethral entry
7. **Pass urethral catheter** retrograde to confirm urethra patent (rule out urolith stuck in urethra!)
8. Lavage UB lumen
9. **Close in 2 layers**:
   - **First layer**: simple continuous through mucosa-submucosa (or mucosa only if thick)
   - **Second layer**: simple continuous Lembert/Cushing seromuscular
   - ⚠️ Don't penetrate to lumen with suture (stone nidus!)
10. Leak test with saline injection through urethra
11. Submit stone for analysis ⭐

### Suture
- **3-0 or 4-0 monofilament absorbable** (PDS/Monocryl)

---

## 6. Urethral Surgery

### A. Urethral stone removal

#### Retrograde Urohydropulsion
- For male dog with stone in urethra
- Catheter advanced + rectal pressure on penis + flushing → push stone back to bladder
- Then **cystotomy** to remove

#### Urethrotomy
- Direct incision over palpable stone
- Less common now (urohydropulsion preferred)

### B. Urethral Reconstruction (Urethrostomy)

**Indication**: chronic obstruction not relievable by other means

#### Cat: Perineal Urethrostomy ⭐ (PU surgery)
- For obstructive feline lower urinary disease (FIC, calculi)
- **Sacrifice penis** — turn male into "permanent female-like opening"
- Wider urethra at perineum (less stone obstruction)
- ⚠️ **Increased UTI risk** post-op (wider opening, less defense)
- ⚠️ **Strict aseptic technique** + Elizabethan collar 7-14 days

#### Dog:
- **Scrotal urethrostomy** (most common) — for stones recurring at sigmoid flexure
- Pre-scrotal alternative
- Less morbidity than perineal (in dog)

### C. Urethral Rupture
- Cause: trauma, iatrogenic (catheter)
- **Diagnosis**: positive contrast urethrography
- **Management**:
  - **Conservative** — indwelling catheter 7-10 days · small tears
  - **Surgical** — primary anastomosis · large tears

---

## 7. Ureteral Surgery

### Indications
- **Ureteral stone** (most common — small breeds!)
- **Ectopic ureter** (congenital)
- **Ureteral stricture** (post-trauma/surgery)

### Stone removal
- **Ureterotomy** (open small ureteral incision)
- ⚠️ **Strict microsurgical technique** — ureter is tiny + delicate
- Stent placement post-op
- Submit stone for analysis

### Ureteral Stent
- Indication: prevent restenosis post-stone removal
- ⚠️ Specialized procedure — referral

### SUB (Subcutaneous Ureteral Bypass)
- Newer procedure
- Bypass severely strictured ureter
- Subcutaneous device

---

## 8. Iatrogenic Injury Prevention

### During spay (Female)
- **Ovariohysterectomy** — ureters cross close to broad ligament
- ⚠️ **Don't cut/ligate ureter accidentally** when ligating ovarian pedicle/cervix
- Ligature must be tight to avoid bleeding but **not include ureter**

### During neuter (Male)
- **Castration** — testicular vessels close to internal inguinal ring
- Lower risk than spay

### Catheter trauma
- Forceful catheterization of male cat → urethral rupture
- Use **lubricant generously** + **gentle technique**
- Stop if resistance — image first

---

## 9. Post-op Care

### Monitoring
- **Urination** — must pee post-op (catheter if needed)
- **Hydration** — IV fluids 24-48 hr
- **Pain control** — opioid + NSAID (after renal function check)
- **Antibiotics** — based on culture · 7-14 days
- **Activity restriction** — 7-14 days

### Indwelling Catheter (if used)
- Closed collection system (sterile bag)
- Daily evaluation: urine character, output volume
- Monitor for **catheter-associated UTI**
- Remove ASAP when no longer needed

### Long-term Stone Prevention
- Stone analysis → diet recommendation
  - **Struvite** (Hill's s/d) — prevents formation
  - **Calcium oxalate** (low oxalate diet)
  - **Urate** (low purine, e.g., Hill's u/d)
- Encourage **water intake**
- Avoid recurrent UTI (especially struvite)

---

## 🎯 Exam recap (15 ข้อ)

1. **Suture choice**: synthetic absorbable monofilament ⭐ · NEVER multifilament/braided/silk
2. **Bladder healing 50% in 7-14 days** → mid-term absorbable ideal
3. **3 kidney procedures**: nephrotomy / pyelotomy / nephrectomy
4. **Pyelotomy preferred when possible** (less parenchymal damage)
5. **Bilateral stones**: operate better side FIRST
6. **Renal vessel occlusion max** = 20 min textbook (5 min cycles in practice)
7. **Cystotomy site** = ventral bladder surface (avoid dorsal — ureteral entries)
8. **2-layer bladder closure** + don't penetrate lumen
9. **Pass urethral catheter** during cystotomy to rule out urethral stones
10. **Submit ALL removed stones** for analysis
11. **Cystocentesis sample only** for urine culture (sterile)
12. **PU (Perineal Urethrostomy)** in cat — increased UTI risk · need e-collar 7-14 days
13. **Scrotal urethrostomy** for recurrent dog urethral stones
14. **Ureter close to broad ligament** — at risk during spay
15. **Don't remove a kidney** without confirming contralateral function!

> 📚 อ่านควบ: 8.1 Upper Urinary (a9cdFzIKIGA) · 8.2 LUT 1 (z0Id0mmM4Fk) · 8.3 LUT 2 Stones (vLjnPuFgvj4) · 10.1 Imaging Urinary (Q0AGFF70m8M) · 10.3 LUT 3 (eBY8GTlcjiw)`,
  },

  '_azRwNxOJas': {
    videoId: '_azRwNxOJas',
    title: '14.3 : Thoracic Surgery',
    subject: 'com1',
    date: '2024-11-18',
    duration: '105 min',
    instructor: 'รุ่นพี่',
    examFormat: 'MCQ — approach + technique + chest tube placement',
    summary: `# 14.3 Thoracic Surgery

> 🎯 ครอบคลุม **2 main thoracic approaches**: intercostal thoracotomy + median sternotomy + minimally invasive thoracoscopy. Critical: **chest tube placement** + **post-op 4 hypos**

---

## 1. Approach Methods

### A. Intercostal Thoracotomy
- **Most common** approach for vet med
- Enters between ribs (intercostal space)

### B. Median Sternotomy
- Cut through sternum midline
- Allows bilateral access to entire thorax

### C. Minimally Invasive (Thoracoscopy)
- 2 sub-techniques:
  - **Intercostal port** — through ICS
  - **Trans-diaphragmatic** — through subxiphoid + diaphragm
- ✅ Less pain, smaller incisions
- ⚠️ Requires special skill + equipment (used in referrals)

---

## 2. Intercostal Thoracotomy ⭐

### Indications
- Lung lobe biopsy/lobectomy
- PDA ligation
- PRAA correction
- Pericardiectomy
- Pleural exploration / biopsy
- Pulmonary mass excision
- Diaphragmatic hernia
- Esophageal foreign body

### ICS selection table (memorize ⚠️)
| Procedure | ICS |
|---|---|
| **PDA / PRAA** | **4 (left)** |
| Lung lobectomy (cranial) | 5 |
| Lung lobectomy (caudal) | 6 |
| Diaphragmatic hernia | 8-10 |
| Esophageal FB (caudal) | 9-10 |
| Pericardiectomy | 5 (left) |

### Side selection
- **Left**: PDA, PRAA, pericardiectomy
- **Right**: most lung procedures, vena cava
- ⚠️ Wrong side = can't reach!

### Limitations
- Cannot see beyond rib 3 cranially (sternum blocks)
- Cannot see beyond rib 10 caudally (diaphragm blocks)

---

## 3. Anesthesia Prep ⭐

### Pre-oxygenation
- ⚠️ **Always pre-oxygenate** before induction
- Methods (best → worst):
  - O₂ chamber (highest %)
  - O₂ mask flush at face (~30-50%)
  - O₂ "blow-by" loose (~20-30%)

### IPPV / Mechanical Ventilation
- ⭐ **MUST use ventilator** — patient can't breathe spontaneously when chest is open
- Without ventilator: tension pneumothorax risk = death
- Set TV ~10-15 mL/kg, RR 8-12 bpm

### Patient prep
- Wide clip (sternum to spine, all around chest)
- Aseptic prep (chlorhexidine + alcohol)
- Drape with windows for chest tube site

---

## 4. Surgical Technique — Intercostal

### Skin to Pleural Space (steps)
1. **Skin incision** — cranio-caudal
2. **Latissimus dorsi muscle** — cut perpendicular (not retract — too thick)
3. **Identify scalenus muscle** ⭐ (insertion at **rib 5**) — landmark for rib counting
4. **Serratus ventralis** — split between fiber bundles
5. **Internal intercostal muscle** — cut along ICS chosen
6. **Pleura** — final layer
   - ⚠️ **Lift pleura first** before incising (don't cut underlying lung!)
   - As soon as pleura broken → loss of negative pressure → lung deflates → easier to work

### Rib counting ⭐
- Method 1: Count from rib 1 cranially to caudally
- Method 2: Use **scalenus muscle insertion** at rib 5 as anchor
- ⚠️ "อันนี้ข้อสอบ" — remember rib 5 = scalenus insertion

### Caudal vs Cranial aspect of rib
- Vessels + nerves run **CAUDAL to rib**
- Always cut at **CRANIAL aspect of rib** (avoid neurovascular bundle)
- For ICS 4 = cut cranial to rib 5 (= caudal aspect of rib 4)

### Rib retraction
- **Finochietto retractor** ⭐ — adjustable C-shaped
- Provides ~30% additional working space

### Local anesthetic block
- **Intercostal nerve block** at:
  - Site of incision (≥2 ICS)
  - 2 ICS cranial + 2 ICS caudal
- Inject at dorsal aspect (close to nerve root)
- Lidocaine (fast onset, 10 min) or Bupivacaine (slow onset, longer duration)

---

## 5. Median Sternotomy

### Indications
- Bilateral exposure needed
- Thymic mass excision
- Cranial mediastinal mass

### Advantages
- Bilateral pleural access
- ⚠️ In humans, **less painful** than intercostal (no neurovascular bundle damage)

### Disadvantages
- Patient must be in **dorsal recumbency** → dorsal structures (e.g., trachea, hilum) hard to reach
- Requires **bone saw** + **wire closure**
- ⚠️ Risk of osteomyelitis (rare in vet)

### Technique
1. Patient in **strict dorsal recumbency** (use rolled towels to keep aligned)
2. Skin incision midline
3. Through subq + pectoral muscles
4. **Bone saw**: oscillating (riskier — surgeon must control depth) OR **reciprocating** (safer — has foot guard)
   - Cut directly midline! ⚠️ off-midline = damages **internal thoracic arteries** running on either side
5. ⭐ **Leave 1 sternebra intact** — either cranial (manubrium) or caudal (xiphoid) for stability
6. **Finochietto retractor** to spread

### Closure
- **Wires through sternum** in **figure-of-8 pattern**
- Alternate twist directions (X then Y, X then Y) for stability
- Pre-place all wires before closing → twist sequentially
- Then close pectoral muscles, subq, skin

---

## 6. Chest Tube ⭐ (สำคัญมาก)

### Why use chest tube?
- Evacuate residual air after thoracotomy closure
- Drain post-op effusion
- Manage pneumothorax / pleural effusion

### Tube selection
- **Largest size that fits ICS** — typically 10-14 Fr for cats/small dogs, 14-18 Fr for medium dogs, 24+ Fr for large
- Tubes have multiple **fenestrations** (side holes) at the chest end

### Placement technique ⭐
1. **Tunnel through skin first** ⭐ — start at ICS 10
2. Skin tunnel under SQ to ICS 7-8
3. Pierce intercostal muscle at ICS 7-8 entry
4. Advance tube tip toward ICS 2 cranially
5. ⚠️ **Why tunnel?** — creates a **one-way valve** preventing air leak around tube
6. Without tunnel: open pneumothorax risk

### Securing
- **Purse-string + Chinese finger trap** suture
- Mark tube depth with permanent marker
- Connect to closed drainage system (or 3-way stopcock + syringe for intermittent suction)

### Emergency chest tube (for tension pneumothorax)
- **Without thoracotomy** — count ICS externally
- Site: **ICS 7-8** (in animals) — count from rib 13 cranially
- Same skin-tunnel technique

---

## 7. Post-op 4 "Hypos" Management ⭐

### A. Hypothermia
- Lose body heat through open chest
- ⚠️ Pre-warm IV fluids to body temp before infusion (cold fluid worsens hypothermia)
- Goal: T > 99°F (37.2°C) before recovery, then 102°F as patient stabilizes
- Use heating blankets, Bair Hugger, etc.

### B. Hypotension
- Causes: blood loss, pre-existing volume deficit, anesthetic-induced
- Goal: maintain MAP > 60 mmHg
- IV fluids + colloids · vasopressors if needed
- ⚠️ Hypotension during surgery = poor wound healing + organ injury

### C. Hypoxia
**Multiple contributors**:
1. **Hemoglobin** — pre-op anemia worsens · target Hct > 30%
2. **Body temperature** — hypothermia → Hb-O₂ curve **shift left** → O₂ stuck on Hb (won't release to tissues)
3. **Acid-base** — acidosis → curve shifts right (releases O₂ in tissues)
4. **Hypoventilation** (next)

⭐ Hb-O₂ Dissociation Curve concept:
- Hot, acidic, high CO₂ → **shift right** = release O₂ at tissue
- Cold, alkalotic, low CO₂ → **shift left** = retain O₂ on Hb (hypoxia at tissue)

### D. Hypoventilation
- ⚠️ Pain → patient avoids chest expansion → CO₂ retention → respiratory acidosis
- **Treatment = pain management** ⭐
- Pain plan:
  1. **Opioid (Fentanyl CRI)** ⭐ first-line
  2. **Intercostal nerve block** (still effective post-op)
  3. **Intrapleural lidocaine** through chest tube
     - ⚠️ Cardiotoxic in cattle/horses · safe in dogs/cats
     - Bathes pleural surface — direct local anesthesia

---

## 8. Chest Tube Removal Criteria

### Indications for removal
- Volume drained: **< 2-5 mL/kg/day**
- Air leak resolved
- Patient comfortable

### Drainage frequency
- **First 4 hours**: every hour
- Hours 5-24: every 4 hours
- Day 2-3: every 12 hours

### Removal technique
- Cut suture, withdraw tube quickly
- Press skin closed immediately to seal tunnel
- Bandage

---

## 9. Common Procedures Summary

### Lung Lobectomy
- **Partial** vs **complete** lobectomy
- Indication: lung mass, lung lobe torsion, abscess
- **Stapling device** (TA stapler) preferred over hand-sewn
- Air leak test post-staple: submerge in saline, look for bubbles

### Pulmonary Wedge Resection
- Smaller resection of focal lesion
- Typically with stapler

### Pericardiectomy
- See 13.1 summary
- **Sub-total** (saves phrenic nerve)

### Diaphragmatic Hernia Repair
- Approach: cranial midline laparotomy ± thoracic extension
- Chest tube placement at end essential

### PDA Ligation
- See 13.1 summary
- Left ICS 4

---

## 10. Suture Selection

| Layer | Suture |
|---|---|
| **Pleura/intercostal** | Long-term absorbable (PDS) or non-absorbable |
| **Periosteum/sternum** | Wire (18-20G) or non-absorbable |
| **Pectoral muscle** | Long-term absorbable |
| **Subq** | Mid-term absorbable |
| **Skin** | Non-absorbable (Nylon) - cutting needle |

---

## 🎯 Exam recap (15 ข้อ)

1. **Intercostal thoracotomy ICS for PDA** = **4 left**
2. **Scalenus inserts at rib 5** ⭐ — landmark for counting
3. **Cut cranial aspect of rib** (vessels caudal to rib)
4. **Lift pleura before incising** (don't cut lung)
5. **Always use IPPV ventilator** during open chest surgery
6. **Pre-oxygenate** before induction
7. **Median sternotomy** = bilateral access · dorsal recumbency
8. **Leave 1 sternebra intact** for stability
9. **Cut MIDLINE on sternum** (avoid internal thoracic arteries)
10. **Wire closure figure-of-8** alternating directions
11. **Chest tube tunnel** = enter ICS 10, exit at ICS 7-8 (one-way valve)
12. **Tube tip toward ICS 2** cranially
13. **4 hypos post-op** = hypothermia + hypotension + hypoxia + hypoventilation
14. **Hb-O₂ curve shift LEFT** = cold, alkalotic, low CO₂ → tissue hypoxia
15. **Pain management** prevents hypoventilation
16. **Tube removal criteria** = drainage <2-5 mL/kg/day · no air leak

> 📚 อ่านควบ: 13.1 Surgical Heart (dn_W-7eWQl0) · 14.1 Common Resp II (FlutqheRR6I) · 14.2 Surgical Resp (nzpDNtceKKk) · Anatomy of thoracic wall`,
  },

  '0C218gD_tZM': {
    videoId: '0C218gD_tZM',
    title: '4.2 : Endoscope + Stomach + Esophagus Surgery',
    subject: 'com1',
    date: '2024-08-26',
    duration: '126 min',
    instructor: 'รุ่นพี่',
    examFormat: 'MCQ — endoscope use + esophageal/gastric surgery',
    summary: `# 4.2 Endoscope + Stomach + Esophagus Surgery

> 🎯 ครอบคลุม **Endoscopy** (flexible vs rigid · scope use cases) + **Esophageal disease + surgery** + **Gastric disease + surgery**. Big procedures: **GDV repair**, **Y-U pyloroplasty**, **gastrotomy**

---

## 1. Endoscope Equipment

### Two main types
| Type | Use |
|---|---|
| **Flexible** | GI tract, respiratory tract, urinary tract — anywhere with curves |
| **Rigid (Telescope)** | Body cavities (laparoscopy, thoracoscopy), straight tubes, joints |

### Flexible scope subtypes
- **Fiber Optic** — image transmitted through glass fibers
  - ✅ Best image quality (analog)
  - ❌ Fragile fibers can break → **black spots in image**
  - ❌ Expensive (~1 million THB/scope)
- **Video Endoscope** — digital camera at tip
  - ✅ More durable
  - Image to monitor
  - Limited resolution by sensor pixels

### Working channels
- Most scopes have **side channels** for instruments (biopsy forceps, baskets, suction, water flush, air insufflation)

---

## 2. Endoscopy Use Cases

### Foreign Body Retrieval ⭐
- **Common scenarios**:
  - Coins, bone, fishhook, kebab skewer, button, nail
  - Cat: thread/string (linear FB)

### Foreign body management decision
| Type | Action |
|---|---|
| **Smooth + small** (coin in big dog) | Conservative — give laxative + monitor stool |
| **Sharp/spiny** (bone shard, hook) | Endoscopic removal OR surgery — **don't pass through GI** (risk of mucosal trauma along entire path!) |
| **Large** | Endoscopic if accessible OR open surgery |

### Key technique
- **Always orient FB to long axis when extracting** through pylorus/cardia
- Cross-wise FB → must rotate first (use multi-finger graspers)
- Sharp FB → careful retrieval to avoid lacerating esophagus on way out

### Other endoscope uses
- **Biopsy** (esophagus, stomach, intestine, bladder)
- **Foreign body removal**
- **Stricture dilation** (with bougies)
- **Stent placement** (tracheal collapse, esophageal stricture)
- **Cystoscopy** (urinary)
- **Bronchoscopy** (respiratory + BAL)
- **Endo-spay** (laparoscopic ovariectomy)

---

## 3. Esophagus

### Anatomy refresh
- **Cervical part** + **Thoracic part**
- 4 layers: Mucosa, Submucosa, Muscularis (longitudinal + circular), Adventitia (NOT serosa!)
- **Submucosa = strongest layer for healing** ⭐
- ⚠️ **Vagus nerve** runs alongside (dorsal + ventral branches at heart base)
- ⚠️ **Phrenic nerve** runs ventral to esophagus (don't touch!)

### Diseases
1. **Esophageal stricture**
2. **Foreign body in esophagus**
3. **Esophageal rupture (perforation)**
4. **Neoplasia** (rare in dogs/cats)
5. **Vascular ring anomaly** (PRAA — see 13.1)
6. **Diverticulum**
7. **Esophago-bronchial / esophago-tracheal fistula**

### A. Esophageal Stricture

#### Causes
- **Acid reflux** (GERD-like) chronic
- **Caustic substances** (toilet cleaner)
- **Post-surgery** stricture
- ⭐ **Excessive ET tube cuff inflation** (compression of esophagus against trachea) — common iatrogenic cause!

#### Diagnosis
- **Barium swallow** with X-ray
- **Endoscopy + biopsy** (rule out neoplasia)

#### Treatment
- **Bougienage** (rigid dilator) — start small, dilate gradually
- **Balloon dilation**
- ⚠️ Don't dilate too much at once — esophageal rupture risk
- Multiple sessions (every 2-4 weeks initially)

### B. Esophageal Foreign Body

- ⚠️ Best to **PUSH down to stomach** (then retrieve via gastrotomy) rather than pull out (mucosal damage)
- Endoscopic retrieval if cannot push

### C. Esophageal Rupture / Perforation

- ⚠️ Surgical emergency
- Sources: bone perforation, iatrogenic, trauma
- Treatment: NPO + nasogastric tube + IV fluids · or open surgery + repair if leak
- Antibiotic essential (mediastinitis risk!)

### D. Esophageal Diverticulum

- **Pseudo-diverticulum** (mucosa pouches outward through muscle layer) — most common
- **Traction diverticulum** — chronic inflammation pulls esophagus toward fixed structure (lung, etc.)
- **Pulsion diverticulum** (true) — pressure inside bulges full thickness wall
- **Diagnosis**: barium swallow + endoscopy
- **Treatment**: small → conservative (G-tube feeding) · large → surgical excision + closure

### E. Esophago-tracheal Fistula

- Rare congenital defect
- Symptoms: cough/sputum after drinking liquids
- **Diagnosis**: scope shows bubbles in opposite tube during respiration
- **Treatment**: surgical division + closure

---

## 4. Stomach Anatomy + Function

### Five parts
1. **Cardia** (esophageal entry)
2. **Fundus**
3. **Body**
4. **Pyloric antrum**
5. **Pylorus** (exit to duodenum)

### 4 layers (different from esophagus!)
- **Serosa** (outer)
- **Muscularis** (3 layers: longitudinal, circular, oblique)
- **Submucosa** (strongest for healing ⭐)
- **Mucosa** (inner)

### Vasculature
- **Left gastric artery** (Lesser curvature)
- **Right gastric artery** (Lesser curvature)
- **Left gastroepiploic artery** (Greater curvature)
- **Right gastroepiploic artery** (Greater curvature)

### Innervation
- **Vagus nerve**
- **Splanchnic nerves**

### Position
- ⚠️ Stomach **CANNOT be lifted out** of abdomen during surgery (anchored by gastrohepatic + gastrodiaphragmatic ligaments)
- If you can lift it = something is torn!

### Gastric emptying time
- Liquid: ~5-10 min
- Solid: 3-7 hours (depends on content)
- Speed: **carbohydrate > protein > fat**

---

## 5. Gastric Diseases

### A. Pyloric Stenosis / Hypertrophic Gastropathy

#### Two types
- **Congenital pyloric stenosis** — brachycephalic puppies (Boxer, Boston Terrier) <1 yr
- **Acquired chronic hypertrophic pyloric gastropathy (CHPG)** — small breeds <10 kg, older (Shih Tzu, Maltese, Lhasa Apso)

#### Three subtypes (CHPG)
- **Type 1**: muscularis hypertrophy only
- **Type 2**: mucosal hyperplasia + muscularis hypertrophy
- **Type 3**: mucosal only

#### Clinical
- **Vomiting** ~15-30 min POST-meal (delayed)
- ⚠️ Differs from esophageal disease (immediate regurgitation)
- Weight loss, dehydration
- Possible "Bird-beak sign" on barium swallow

#### Diagnosis
- **Barium contrast** — slow gastric emptying + narrow outlet
- **Fluoroscopy** — real-time motility
- **Endoscopy + biopsy** — confirm hyperplasia (rule out neoplasia)
  - ⚠️ **Don't assume neoplasia from gross appearance!** Always biopsy.

### B. Gastric Foreign Body

- ⚠️ **Owner often doesn't know** — pet ate something quietly
- Clinical: chronic intermittent vomiting

### C. Gastric Mucosal Disease

- **Helicobacter** ⚠️ (zoonotic — handle samples carefully)
- Gastric ulcers, erosions
- NSAID-induced disease

### D. GDV (Gastric Dilatation-Volvulus) ⭐⭐⭐ ออกแน่

**Demographics**: large/giant breed deep-chested dogs (Great Dane, GSD, Standard Poodle, Boxer, Setters)

**Pathophysiology**:
- **Stomach distension** with gas/food/fluid
- **Volvulus** — stomach rotates around mesenteric axis
- Most common: **clockwise** rotation (viewed from front)
- Pylorus moves from right → DV (top) → left

**X-ray pathognomonic**: **"Popeye sign"** ⭐
- Stomach gas with internal **partition** (folded over from rotation)
- VD/DV view: pylorus shifts to left dorsal

**Clinical**:
- Sudden abdominal distension
- Non-productive retching ⚠️ (= "trying to vomit but nothing comes up")
- Hyperventilation
- Restless, anxious
- Pale mucous membranes (shock!)
- Cardiac arrhythmia common

**Pathophysiology consequences**:
- **Vena cava + portal vein occlusion** → no return blood → distributive shock
- Splenic torsion → splenic infarction
- Cardiac arrhythmia
- **Gastric necrosis** (vascular compromise)
- Death within hours if untreated!

**Treatment** = **EMERGENCY** ⭐
1. **Decompression** (gastric trocar through abdominal wall) — life-saving stabilization
2. **IV fluids + electrolyte correction**
3. **Cardiac monitoring** (treat VT with lidocaine)
4. **Surgery** — emergency laparotomy:
   - **Derotation**
   - **Gastropexy** (anchor stomach to right body wall — prevents recurrence)
   - **Splenectomy** if splenic infarction
   - **Gastrectomy** if necrotic gastric wall

**Prophylactic gastropexy** in at-risk breeds (concurrent with neuter)

---

## 6. Gastric Surgery

### A. Gastrotomy

**Indication**: foreign body removal, biopsy, ulcer treatment

**Technique**:
1. Cranial midline laparotomy
2. **Identify ventral surface** (the side facing you when stomach exposed)
   - ⚠️ **Operate on ventral side ONLY** — don't flip!
3. Pack abdomen with gauze
4. **Stay sutures** at corners
5. **Incision midway between greater + lesser curvature** ⭐
6. ⭐ **Cut along muscle fiber direction**:
   - **Cardia/pylorus**: longitudinal incision
   - **Body**: transverse incision
   - **Always parallel to muscle fibers**
7. Remove FB
8. Lavage stomach with warm saline
9. **Close in 2 layers**:
   - **First layer**: Cushing or Lembert pattern (mucosa-submucosa, then muscularis-serosa)
   - **Second layer**: Lembert seromuscular (inverting)
   - ⚠️ Don't penetrate to lumen (stone risk)
10. Leak test if possible

### B. Y-U Pyloroplasty ⭐

**Indication**: pyloric stenosis (CHPG, brachycephalic)

**Technique**:
1. Make a Y-shaped incision over pylorus
   - Stem of Y on **antrum**
   - Arms extending toward duodenum **at least 1 cm from greater/lesser curvature**
2. Suture in U pattern (stem + arms reposition to widen lumen):
   - First, place key suture: stem-tip of Y to cross-bar
   - Then close arms with simple interrupted

### C. Fredet-Ramstedt (Pyloromyotomy)

**Technique**: longitudinal cut through serosa + muscularis + ONLY (not full thickness)
- Allow mucosa-submucosa to bulge out without further closure
- ⚠️ Less invasive than full pyloroplasty
- Used for early/mild pyloric stenosis

### D. Heineke-Mikulicz Pyloroplasty

**Technique**:
- Cut **longitudinally** (full thickness)
- Sew **transversely** (perpendicular to incision)
- Use stay sutures to pull edges open
- Suture pattern: Simple Interrupted

### E. Gastropexy (GDV prevention)

**Indication**: After GDV repair · prophylactic in at-risk breed

**Technique** (most common = **incisional gastropexy**):
1. Make 4-6 cm seromuscular incision on **right body wall** at level of pyloric antrum
2. Make matching incision on antral wall
3. Suture stomach to body wall

**Other techniques**: belt-loop, circumcostal, tube gastropexy

---

## 7. Suture for Stomach

| Layer | Suture |
|---|---|
| Submucosa | **Synthetic absorbable monofilament** (PDS) — must include for strength |
| Seromuscular | Same |

⚠️ Stomach **heals quickly** (days)
⚠️ Don't suture through mucosa to lumen (granuloma + stone risk)

---

## 8. Post-op Management

### Diet progression (post-gastrotomy)
- **NPO** 12-24 hr
- Then small frequent feedings
- **Liquid diet** day 1-2
- Soft food day 3-7
- Normal food after day 7

### Post-pyloroplasty
- Liquid only days 1-3
- Soft transition gradually
- Monitor for vomiting — if persistent, repeat imaging

### Post-GDV
- Aggressive fluid + electrolyte
- Monitor for arrhythmia (VT)
- Anti-emetics (Maropitant)
- PPI (omeprazole)
- Sucralfate (if mucosal injury)
- Pain management

---

## 🎯 Exam recap (15 ข้อ)

1. **Flexible scope** for curved tracts · **rigid scope** for straight/cavity
2. **Foreign body retrieval** = orient long-axis, careful with sharp objects
3. **Push esophageal FB to stomach** (don't pull through esophagus)
4. **Esophageal stricture cause** = ET cuff over-inflation (iatrogenic!)
5. **Esophagus 4 layers** (no serosa) · **submucosa = strongest**
6. **Don't lift stomach out of abdomen** — anchored by ligaments
7. **GDV pathognomonic** = Popeye sign + partition on X-ray
8. **GDV breeds** = large + deep-chested dogs
9. **GDV surgery** = derotation + **gastropexy** ⭐ + splenectomy/gastrectomy if needed
10. **Pyloroplasty Y-U** = Y incision, U suture, for pyloric stenosis
11. **CHPG** = small breed older dog · vomiting 15-30 min post-meal
12. **Gastrotomy incision midway** between greater/lesser curvature
13. **Cut along muscle fibers** (cardia longitudinal, body transverse)
14. **Suture in 2 layers** + must include submucosa
15. **Helicobacter zoonotic** — wear gloves with samples

> 📚 อ่านควบ: 4.1 GI Diag (2SJ4M6IiJeU) · 5.1 Intestine Sx (lS4wSGDKFrY) · 6 Hepato/pancreas Sx (5rcEK-3IW0M) · 3 Hepatobiliary (keqE30HxM7Y)`,
  },

  lS4wSGDKFrY: {
    videoId: 'lS4wSGDKFrY',
    title: '5.1 : Intestine Surgery',
    subject: 'com1',
    date: '2024-09-02',
    duration: '136 min',
    instructor: 'รุ่นพี่',
    examFormat: 'MCQ — surgical principles + suture + technique',
    summary: `# 5.1 Intestine Surgery

> 🎯 Surgical principles + techniques for **small + large intestine**: anatomy → suture → cutting → resection-anastomosis → diameter mismatch → unique techniques. Foundation for any GI surgery on Year 5

---

## 1. Anatomy Refresh

### Small intestine parts
| Part | Length | Notes |
|---|---|---|
| **Duodenum** | ~25 cm | Anchored to right body wall by ligament; can't lift out easily |
| **Jejunum** | Longest | Most movable; **best target for surgery** |
| **Ileum** | ~15 cm | Has unique vessel running on **anti-mesenteric** side ⭐ |

### Identifying ileum
- ⭐ Ileum is the **only** small intestine segment with a vessel on the **anti-mesenteric** border
- Other parts: vessels only on mesenteric border

### Vasculature
- **Cranial mesenteric artery** = main trunk for jejunum + ileum
- Gives off **jejunal arteries** in tree-branch pattern
- Each branches into terminal vessels supplying intestinal wall

### Duodenum has TWO blood supplies
- **Cranial pancreaticoduodenal** (from celiac trunk via gastroduodenal artery)
- **Caudal pancreaticoduodenal** (from cranial mesenteric)
- ⚠️ Must preserve BOTH during duodenal surgery

### Wall layers (4)
1. **Serosa** (outer)
2. **Muscularis** (longitudinal + circular)
3. **Submucosa** ⭐ — strongest layer for healing!
4. **Mucosa** (inner)

⚠️ **Always include submucosa in suture** for wound strength

---

## 2. Pre-Op Considerations

### Prophylactic Antibiotics
**Given when**:
1. Procedure breaches hollow organ (intestine, stomach, bladder)
2. Damaged tissue (perforation, ischemia)
3. **Surgery > 2 hours**

**Drug choice**: **First or Second-Generation Cephalosporin** (ceftriaxone, cefazolin)
- Coverage: Gram + and -, anaerobes
- ⚠️ Always include Staph cover (skin flora)

**Timing critical** ⭐
- Give **30-60 min BEFORE skin incision**
- ⚠️ Late = not prophylactic, just therapeutic
- **Repeat every 90 min** during long surgery

### Patient prep
- Standard aseptic technique
- Wide clip for laparotomy access

---

## 3. Surgical Principles (Halstead's)

### 1. Gentle Tissue Handling ⭐
- ⛔ Don't grab/squeeze with teethed forceps
- Use **intestinal forceps** (DeBakey-style, atraumatic)
- ⚠️ When clamping with intestinal forcep: **only first ratchet click** — don't lock fully (prevents tissue death)

### 2. Aseptic Technique
- Drape exclusion ⭐ (see below)
- Lavage frequently
- Glove change after dirty steps

### 3. Preserve Blood Supply
- Identify mesenteric arcade vessels
- Don't ligate too proximal — could compromise upstream segment
- Test viability before closing

### 4. Approximation without Tension
- Sutures must bring edges together without pulling
- ⚠️ Tension = poor healing, dehiscence

### 5. Sharp Dissection (use blade, not scissors!)
- ⛔ Scissors crush tissue ("bruising")
- ✅ Fresh **blade** = clean cut, less crush, better edge for suturing

### 6. Hemostasis

---

## 4. Occlusal Draping (Bowel Pack) ⭐

### Purpose
Isolate working area from rest of abdomen — prevents contamination from accidental spillage.

### Technique
1. Use **abdominal swabs (saline-moistened)** — not dry!
2. Pack **at least 4 layers around the mesenteric base**:
   - North side
   - South side
   - East side
   - West side
3. Stack them **in sequence** (don't pile randomly — easy to leave behind!)
4. Use **6 layers** if time permits
5. ⚠️ **Count packs** before closing — don't leave one in!

---

## 5. Tissue Viability Assessment

### Subjective (Clinical Judgement)
- **Color**: pink + perfused vs blue/purple/black (cyanotic)
- **Peristalsis**: present or absent?
- **Pulsation** of mesenteric vessels visible?
- **Bleeding** from cut edge (capillary ooze = good!)

### Objective
- **Pulse oximeter** ⭐ — clip sterile probe on bowel wall
  - SpO₂ > 95-100% = viable
- **Fluorescein dye + UV lamp** — vessel patency confirmation

⚠️ Use **multiple methods together** — never rely on just one

---

## 6. Suture for Intestine

### Material
- ✅ **Synthetic absorbable monofilament** ⭐
- ⛔ NEVER multifilament/braided (biofilm risk!)
- ⛔ NEVER non-absorbable (foreign body in lumen → granuloma)

### Strength category
- **Mid-term to long-term absorbable** (PDS, Maxon)
- ⛔ NOT short-term/fast-absorbable (Vicryl, Monocryl) — heals too slowly to use

### Size by patient
| Patient | Size |
|---|---|
| Cat / Pomeranian / Chihuahua | **5-0** |
| 15-20 kg dog | **4-0** |
| Large dog | **3-0** |

---

## 7. Suture Pattern

### Best patterns (apposition with no inversion/eversion)
- **Simple Continuous** ⭐ most common in clinic (faster)
- **Simple Interrupted** — slower but each knot independent
- **Modified Gambee** — best apposition but slow + needs thick wall

### Layers
- ⭐ **One layer only** for small intestine (multi-layer = stricture risk)
- ⭐ **Always include submucosa** (strongest layer)

### Mucosal eversion (problem!)
- After cutting, mucosa often everts (curls outward)
- ⚠️ Mucosa-to-mucosa contact = poor healing, granuloma
- ✅ **Trim everted mucosa with scissors** before suturing

### Knot location
- Place outside lumen
- Don't bury knot in mucosa

---

## 8. Resection and Anastomosis (R&A)

### Indications
- **Mass removal** (TCC, lymphoma, leiomyoma)
- **Perforation**
- **Necrosis** (intussusception, volvulus, severe ischemia)
- **Foreign body causing necrosis**
- **Stricture**

### Step-by-step
1. **Identify segment** to remove
2. **Pack abdomen** with bowel pack
3. **Milk content** away from working area + **clamp** with intestinal forceps
4. **Identify mesenteric vessels** to ligate
5. **Ligate vessels** with absorbable suture
6. **Cut bowel** (with #11 or #15 blade)
   - ⚠️ Cut at **slight angle** (60-70° vs perpendicular) — increases circumference + opens diameter
7. **Bring ends together** without tension
8. **Anastomosis suture**:
   - Start at **mesenteric border** (highest tension area)
   - Continue around to anti-mesenteric
9. **Trim eversed mucosa** as needed
10. **Test for leak**:
    - Inject saline through proximal segment
    - Look for leaks at suture line
11. **Close mesenteric defect** (prevent internal hernia)
12. **Lavage** abdominal cavity thoroughly

### Diameter mismatch ⭐
When anastomosing **smaller bowel to larger bowel** (e.g., ileum to colon):
- **Cut smaller bowel at angle** (60-70° from perpendicular)
- Or **cut on anti-mesenteric border** to widen
- Or **add a triangular wedge** of tissue from larger bowel side

### Reinforcement options (after anastomosis)
1. **Omental patch** — wrap omentum around suture line
   - ⚠️ Speeds healing (provides blood supply, lymphatics) but doesn't add strength
2. **Serosal patch** — overlap adjacent loop of bowel and suture
   - Adds true mechanical strength
   - Useful for high-risk anastomosis

---

## 9. Special Procedures

### A. Intestinal Foreign Body (Enterotomy)

**Indication**: foreign body cannot be passed/extracted via endoscopy

**Technique**:
1. Pack abdomen
2. Clamp proximal + distal to FB
3. Make incision at **anti-mesenteric border** (avoid vessels)
4. Use **blade #15** to make full-thickness cut
5. **Linear cut** along bowel axis
6. Remove FB
7. Lavage lumen
8. Close in **simple continuous** (one layer)
9. Test leak

### B. Intussusception Repair

**Indication**: invagination of bowel into adjacent segment

**Technique**:
1. **Manual reduction** (gentle pressure, milking out)
2. ⚠️ If can't reduce → **resect + anastomose**
3. ⚠️ If reduced but tissue compromised → **resect + anastomose**
4. **Enteroplication** (suture loops together) — controversial; some advocate to prevent recurrence

### C. Linear Foreign Body (cats)

**Critical**: do NOT pull single-pull on string!
- String tightens through bowel → multiple perforations along mesenteric border

**Technique**:
1. **Cut anchor** (under tongue)
2. **Multiple enterotomies** along bowel — extract piece by piece
3. Inspect each segment for perforation
4. Resect any necrotic segment

### D. Mass Removal

- Resect with **2-3 cm margin** (depending on tumor type)
- Submit margins for histopath
- Anastomose

### E. Pyloroplasty (Y-U) — see 4.2 summary

---

## 10. Large Intestine (Colon) Differences

### Anatomy
- **Ascending → Transverse → Descending → Rectum → Anus**
- ⚠️ **Higher bacterial load** than small intestine!
- Different vasculature: **caudal mesenteric artery**

### Surgical considerations
- ⭐ **More antibiotics needed** before colonic surgery
- ⭐ **Pre-op enema** (24 hr fasting + warm saline enema)
- **One-layer closure** + reinforce with omental/serosal patch
- ⚠️ **Higher dehiscence rate** — be extra careful

### Common procedures
- **Subtotal colectomy** for **megacolon (cats)**
- Mass removal
- Stricture repair

---

## 11. Anastomosis Comparison: Hand-Sewn vs Stapled

### Hand-sewn (vet med standard)
- All techniques above
- Cheaper, accessible

### Stapled (TA / GIA stapler)
- **Faster** (5 min vs 20-30 min)
- **More uniform** apposition
- **Lower leak rate** (in human med)
- ⚠️ Not commonly available in vet clinics

---

## 12. Post-op Care

### Immediate
- **NPO** 12-24 hr
- **IV fluids + electrolytes**
- **Pain management** (opioid + NSAID after kidney check)
- **Antibiotics** continue 5-7 days
- **Monitor for**:
  - Vomiting (ileus, dehiscence)
  - Abdominal distension
  - Fever (peritonitis)
  - Pale mucous membranes (hemorrhage)

### Diet progression
- Day 1-2: clear liquids
- Day 3-7: bland soft food (chicken + rice)
- Day 7+: gradual normal food

### Activity restriction
- 7-10 days

### Monitor for dehiscence
- ⚠️ Most common at days 3-5
- Signs: vomiting, abdominal pain, fever, distension
- Urgent re-laparotomy if suspected

---

## 🎯 Exam recap (15 ข้อ)

1. **Submucosa = strongest layer** — must include in suture
2. **Jejunum = best target** for surgery (movable)
3. **Ileum unique vessel** on anti-mesenteric side
4. **Duodenum has 2 blood supplies** (preserve both)
5. **Prophylactic antibiotics** = 30-60 min before incision · cephalosporin
6. **Repeat antibiotics every 90 min** during long surgery
7. **Intestinal forceps** — only first ratchet click, atraumatic
8. **Synthetic absorbable monofilament** + mid-to-long term · NEVER multifilament
9. **Simple continuous** = most common pattern · **Modified Gambee** = best apposition
10. **One layer only** for small intestine
11. **Trim everted mucosa** before suturing
12. **Cut at angle** for diameter mismatch (small to large bowel)
13. **Omental patch** = healing acceleration · **Serosal patch** = true strength
14. **Bowel pack** = 4-6 layers around mesentery base
15. **Linear FB in cats** = multiple enterotomies, never pull string!

> 📚 อ่านควบ: 4.1 GI Diag (2SJ4M6IiJeU) · 4.2 Endoscope (0C218gD_tZM) · 6 Hepato Pancreas Sx (5rcEK-3IW0M) · 3 Hepatobiliary (keqE30HxM7Y)`,
  },

  FCRDICfyMlM: {
    videoId: 'FCRDICfyMlM',
    title: '7.1 : Anemia + Surgery of Hemolymphatic System',
    subject: 'com1',
    date: '2024-09-16',
    duration: '145 min',
    instructor: 'รุ่นพี่',
    examFormat: 'MCQ — anemia approach + IMHA + splenectomy',
    summary: `# 7.1 Anemia + Hemolymphatic Surgery

> 🎯 Two parts: **Anemia approach + IMHA** (medical) + **Surgery of bone marrow, spleen, lymph nodes** (surgical). Foundation: distinguish anemia vs other causes of pale mucosa, then narrow down to root cause

---

## PART 1 — Approach to Anemia

### Initial complaint
- Owner says "**pale**" or "**white gums**" — NOT "anemia" directly
- Veterinarian must convert "pale" → diagnose

### Pale ≠ always anemia!
- **Other causes of pale**:
  - Massive epinephrine release → vasoconstriction (cardiogenic/hypovolemic shock — gums white as paper!)
  - Severe peripheral perfusion compromise

### Confirm anemia first
- **Hb (Hemoglobin)** = **most reliable** ⭐ (direct measurement)
- **PCV (Packed Cell Volume)** = fast bedside test (centrifuged blood)
- **RBC count** + Hct = derived calculations

⚠️ When parameters disagree → **trust Hb**

### PCV by spinning
- ✅ Quick (5 min)
- ✅ Visualize plasma color:
  - **Yellow plasma** = ↑ bilirubin (hemolysis OR liver disease)
  - **Red plasma** = intravascular hemolysis (free Hb)
  - **Clear** = normal

---

## Anemia Mechanism Tree

### Three causes of low RBC mass
1. **Decreased production** (hypoplasia)
2. **Lost** (bleeding, chronic loss)
3. **Increased destruction** (hemolysis)

⚠️ Always identify which mechanism → directs treatment

### A. Decreased Production (Hypoplasia)
- Causes:
  - **Bone marrow infiltration** (neoplasia, fibrosis)
  - **CKD** → low erythropoietin
  - Chronic disease
  - Drugs/toxins (estrogen, certain chemo)
  - Iron/B12/folate deficiency
- Diagnosis: **bone marrow biopsy** + decreased reticulocytes

### B. Loss (Bleeding)
- Acute: trauma, surgery, intra-cavitary hemorrhage, GI ulcer, neoplasia rupture (HSA!)
- Chronic: hookworm, ulcers, low-grade GI bleeding
- ⭐ **Body has clotting/hemostasis** = saves you from rapid loss
- ⚠️ Acute massive loss → hypovolemic shock + low Hct

### C. Hemolysis
- Multiple sub-causes:
  1. **Immune-mediated** ⭐ most common in vet
  2. **Mechanical** (microangiopathic hemolysis — DIC, vasculitis)
  3. **Metabolic** (rare in dogs/cats — PFK deficiency)
  4. **Infectious** (Babesia, Mycoplasma haemofelis)
  5. **Oxidative** (acetaminophen, onion, zinc, garlic)

---

## IMHA (Immune-Mediated Hemolytic Anemia) ⭐⭐

### Pathophysiology
- Body recognizes RBC as **antigen** (foreign)
- **Antibody binds RBC** → triggers destruction
- 2 destruction mechanisms:
  1. **Complement-mediated** → membrane attack → **intravascular hemolysis**
  2. **Splenic phagocytosis** → macrophages "eat" RBC → **extravascular hemolysis**

### Triggers
- **Idiopathic** (most common)
- **Vaccine-induced** (~2 weeks post-vaccine in some cases)
- **Drug-induced**
- **Infections** (Babesia, certain viruses)
- **Neoplasia**

### Classification by destruction site

#### Intravascular hemolysis
- ⭐ **Hb spilled into plasma**
- **Plasma color: RED** ⭐
- **Hemoglobinuria** (red urine)
- More severe presentation

#### Extravascular hemolysis (more common in IMHA)
- Splenic macrophages phagocytose RBCs
- Bilirubin produced → enters blood
- **Plasma color: YELLOW** ⭐
- ⚠️ **Yellow plasma also seen in liver disease** — must distinguish!

### Coombs Test (DAT — Direct Antiglobulin Test)
- Detects **antibody on RBC surface**
- Positive = supports IMHA diagnosis
- ⚠️ Negative doesn't rule out IMHA

### Spherocytosis
- ⭐ **Pathognomonic finding** for IMHA in dogs
- RBCs lose biconcave shape → become small dense spheres
- Cause: macrophage partial nibbling → loss of membrane → no longer biconcave
- Easy on cytology (ghost-like, dark, smaller than normal RBC)

### Other clinical findings
- Pale mucous membranes (often very pale!)
- Tachycardia, tachypnea (compensation)
- Lethargy, weakness
- ⚠️ **Splenomegaly common** (since spleen is doing the destruction)
- Bilirubinuria, sometimes hemoglobinuria
- **Regenerative anemia** (reticulocytosis) — bone marrow responds

### Lab findings
- **Anemia** (often severe, Hct < 20%)
- **Spherocytes** ⭐
- **Reticulocytosis** (3-5 days post-onset)
- **Leukocytosis** (left shift)
- **Hyperbilirubinemia**
- **Hemoglobinuria** (if intravascular)

### Treatment

**1. Immunosuppression** ⭐
- **Prednisolone** 2-4 mg/kg/day SID (taper over months)
- ⚠️ Side effects: PU/PD, polyphagia, GI upset
- **Cyclosporine** — adjunct in refractory cases
- **Azathioprine** (dog only — CAUTION) or **Mycophenolate**
- **Atopical doses** + slow taper

**2. Anti-thrombotic** ⭐ (IMHA = high thromboembolism risk!)
- **Clopidogrel** ± aspirin
- ⚠️ DIC + IMHA = lethal combination

**3. Supportive**
- **Blood transfusion** if Hct < 12-15%
- IV fluids (volume support)
- O₂ if dyspneic

### Prognosis
- Survival ~ 50-70% at 1 year
- High recurrence rate
- Acute phase = critical 7-14 days

---

## Other Anemias (Brief)

### Babesiosis
- Tick-borne · in Thailand: **B. canis vogeli, B. gibsoni**
- Causes intra/extracellular RBC parasitism
- Treatment: **Imidocarb diproprionate** (B. canis) · **Atovaquone + Azithromycin** (B. gibsoni)

### Mycoplasma haemofelis (cat)
- Causes feline infectious anemia
- Treatment: **Doxycycline** + supportive

### IVCT (Iron Deficiency Anemia)
- Chronic GI loss → microcytic, hypochromic
- Treatment: iron supplementation + treat underlying cause

### Aplastic Anemia
- Bone marrow failure
- Pancytopenia (low RBC, WBC, platelets)
- Drug-induced or idiopathic

---

## PART 2 — Surgery of Hemolymphatic System

## A. Bone Marrow Biopsy

### Indications
- Pancytopenia investigation
- Suspected hematopoietic neoplasia (lymphoma, leukemia)
- Anemia of unknown cause

### Equipment
- **Jamshidi or Rosenau needle** — special bone marrow needles (thicker than regular)
- ⚠️ Needs to penetrate cortical bone

### Sites
1. **Iliac crest** (Wing of ilium)
2. **Greater trochanter** (femur)
3. **Proximal humerus**

### Technique
1. **General anesthesia** (it's painful)
2. Aseptic prep
3. Small skin incision
4. Insert needle through cortex with twisting motion
5. **Aspirate with negative pressure**
6. ⚠️ Bone marrow is **viscous** (jelly-like) — needs strong negative pressure
7. Push-pull syringe several times
8. Get small amount (0.1-0.2 mL) — don't dilute with blood
9. Make smear immediately on slide
10. Submit for cytology + cellularity

### Avoid
- ⚠️ **Sciatic nerve** runs along ilium — enter cranial 1/3 of wing
- ⚠️ **Sciatic nerve** also wraps around greater trochanter — enter cranial-lateral

---

## B. Splenectomy ⭐

### Anatomy
- **Spleen** = largest lymphoid organ
- Located **left side, ventral to stomach**
- Composed of **white pulp + red pulp**
- ⚠️ **Cannot be lifted out** if attached normally — held by gastrosplenic ligament

### Vasculature
- **Splenic artery** (from celiac trunk) — gives off 5-10 short branches
- **Short gastric arteries** ⭐ — go from spleen to greater curvature of stomach
- ⚠️ **Don't ligate stomach-side of short gastric** in partial splenectomy (compromises stomach blood supply!)

### Indications for splenectomy

**Total splenectomy**:
- **Splenic mass** (HSA, lymphoma)
- **Splenic torsion / GDV with splenic infarction**
- Severe trauma not amenable to repair
- Severe immune-mediated thrombocytopenia (rare)

**Partial splenectomy**:
- Localized lesion
- Hematoma if bleeding stops

### Splenic Mass Differentials
| Disease | Notes |
|---|---|
| **Hemangiosarcoma (HSA)** ⭐ | Most common malignant; high mortality |
| **Hematoma** | Benign; may resolve if bleeding stops |
| **Nodular hyperplasia** | Benign; "active spleen" |
| **Lymphoma** | Diffuse splenic involvement |
| **Histiocytic sarcoma** | Aggressive |
| **Abscess** | Rare |

### Splenectomy Technique
1. **Cranial midline laparotomy**
2. Identify spleen — **pull out gently** (don't tear ligaments)
3. Identify vessels in gastrosplenic ligament
4. ⭐ **Triple ligation** for each vessel:
   - 2 ligatures **proximal** (toward spleen) — leave on patient side
   - 1 ligature **distal** (close to spleen)
   - **Cut between ligature 2 and 3**
5. ⚠️ **Don't ligate short gastric stomach-side** if doing partial spleen
6. Remove spleen
7. Inspect for bleeding
8. Close abdomen routine

### Partial Splenectomy
- Cross-clamp with intestinal forceps
- Cut spleen
- Suture parenchyma in **simple continuous + lock** (or 2 layers)
- Use **synthetic absorbable monofilament**

### Post-op
- Monitor for **bleeding**
- Monitor for **arrhythmia** (HSA + GDV cases)
- Monitor for **peritonitis** (if abscess)

### Splenomegaly causes (general)
- Inflammation/infection
- Hyperplasia (immune response, drug-induced)
- Congestion (heart failure, portal hypertension, GDV)
- Neoplasia
- Splenic torsion

---

## C. Lymphadenectomy / Lymph Node Biopsy

### Major palpable lymph nodes (5)
1. **Submandibular** — under jaw
2. **Pre-scapular (superficial cervical)** — in front of shoulder
3. **Axillary** — armpit
4. **Inguinal (superficial)** — groin
5. **Popliteal** — behind knee

### When to biopsy
- **Lymphadenopathy** (enlarged LN)
- **Suspect lymphoma**
- **Metastatic spread evaluation**

### Methods
| Method | When |
|---|---|
| **FNA** ⭐ | First-line; cell type identification |
| **Tru-Cut biopsy** | Architecture preservation |
| **Excisional biopsy** | Definitive diagnosis · surgical removal |

### Excisional biopsy technique
1. Aseptic prep
2. Incise overlying skin
3. **Wedge biopsy** (triangular section) preferred
4. Suture LN with **horizontal mattress** (tight tissue) using **monofilament absorbable**
5. Or remove entire LN if mass or strong suspicion

### Differentials for enlarged LN
- **Reactive hyperplasia** (infection, inflammation)
- **Lymphoma** (multicentric most common in dogs!)
- **Metastasis**
- **Abscess**

---

## D. Tonsillectomy (rare in vet med)

### Indications
- Recurrent severe tonsillitis
- Tonsillar carcinoma
- **Tonsillar neoplasia** (squamous cell carcinoma — aggressive!)

### Technique
- Mouth gag
- **Stay suture** in tonsil
- Ligate base, excise

---

## E. Thymus Surgery (rare)

### Anatomy
- **Cranial mediastinum** — fades with age (active in puppies/kittens)
- T-cell production site

### Indications
- **Thymoma** (mass)
- Myasthenia gravis association
- Aspiration/biopsy via thoracoscopy or median sternotomy

---

## 🎯 Exam recap (15 ข้อ)

1. **Hb is most reliable** anemia parameter (direct measurement)
2. **Pale ≠ always anemia** — could be vasoconstriction (shock)
3. **Plasma yellow** = ↑ bilirubin (hemolysis OR liver disease)
4. **Plasma red** = intravascular hemolysis
5. **3 anemia mechanisms** = decreased production / loss / increased destruction
6. **IMHA** = most common acquired hemolytic anemia
7. **Spherocytes** = pathognomonic for IMHA in dogs
8. **IMHA treatment**: Prednisolone + Clopidogrel (anti-thrombotic) + supportive
9. **IMHA + DIC** = highly lethal combination
10. **Bone marrow biopsy sites**: iliac crest, greater trochanter, proximal humerus
11. **Sciatic nerve** at risk during ilium biopsy — enter **cranial** to nerve
12. **Splenectomy** = triple ligation per vessel
13. **HSA** = most common splenic malignancy
14. **Short gastric vessels** ⚠️ don't ligate stomach-side in partial spleen
15. **5 palpable LN** for biopsy: submandibular, pre-scapular, axillary, inguinal, popliteal

> 📚 อ่านควบ: 7.2 Fluid analysis (9Fvz4J6dMCo) · 4.2 Endoscope GI (0C218gD_tZM) · 6 Hepato/pancreas Sx (5rcEK-3IW0M) · IMHA disease summaries`,
  },

  '5rcEK-3IW0M': {
    videoId: '5rcEK-3IW0M',
    title: '6 : Hepato/Pancreas Sx + Hernia',
    subject: 'com1',
    date: '2024-09-09',
    duration: '205 min',
    instructor: 'รุ่นพี่',
    examFormat: 'MCQ — surgical decision + hepatic/pancreatic technique + hernia',
    summary: `# 6 Hepato/Pancreas Surgery + Hernia

> 🎯 ครอบคลุม **liver + biliary + pancreas surgery + abdominal hernia**. Foundation Sx for Year 5+. 205 min lecture covering the most complex GI procedures

---

## PART 1 — LIVER

## 1. Liver Anatomy

### 6 lobes
**Left side** (2 lobes):
- **Left lateral** ⭐ — **largest lobe**
- **Left medial**

**Right side** (4 lobes):
- **Quadrate**
- **Right medial** (between quadrate + gallbladder)
- **Right lateral**
- **Caudate** (with caudate process)

Between quadrate + right medial = **Gallbladder**

### Functions
- Bile secretion + emulsification
- Glycogen storage (energy reserve)
- Detoxification
- Drug metabolism
- Coagulation factors synthesis ⭐
- Albumin production
- Urea production from ammonia

### Vasculature
- **Hepatic artery** (from celiac trunk) — oxygenated
- **Portal vein** ⭐ — drains all GI organs to liver (except CV vein)
- **Hepatic veins** → caudal vena cava

### Liver labs
| Test | Normal range | Indicates |
|---|---|---|
| **ALT (sgpt)** | up to ~70 U/L | Hepatocellular damage |
| **AST** | up to ~50 U/L | Liver + muscle damage |
| **ALP** | varies by age | Cholestasis (NOT liver-specific!) |
| **GGT** | up to ~10 U/L | Cholestasis (more specific than ALP) |
| **Albumin** | 2.5-4 g/dL | Liver synthesis function |
| **BUN** | 7-25 mg/dL | Liver/Kidney function |
| **Bilirubin** | < 0.5 mg/dL | Heme metabolism |

⚠️ Surgery considerations with liver disease:
- **Reduce anesthetic doses** (50%) — liver clears drugs
- **Coagulation factor depletion** → check before surgery (or postpone)
- **Hypoalbuminemia** → reduced drug binding
- **Stop NSAIDs** 2-3 days before surgery

---

## 2. Pre-op Liver Disease Management

- ⭐ **Reduce protein intake** (less ammonia)
- **Lactulose** (oral or enema) — reduces ammonia absorption
- **Carbohydrate-rich diet** for energy
- **Vitamin K** if coagulopathy suspected
- Treat underlying cause first (if possible)

---

## 3. Liver Imaging

- **X-ray** = first line · liver size on lateral view (>13 ribs = enlarged)
- Ultrasound = best for parenchyma + masses
- **CT** for surgical planning

### Hepatomegaly signs on X-ray
- Liver shadow extends past rib 13
- Stomach displaced caudally
- Rounded liver edges (vs sharp normal)
- Caudal lobes pushed dorsally

### Distinguishing left vs right lobe enlargement
- **Right lobe**: stomach displaced left + medial
- **Left lobe**: cardia (stomach top) displaced medial
- **Total**: stomach pushed caudally

---

## 4. Liver Surgical Procedures

### A. Liver Biopsy

#### 1. Percutaneous (US-guided)
- ✅ Less invasive
- Sedation usually sufficient (or GA in fractious patients)
- Aseptic prep + small skin incision
- **Tru-Cut needle**:
  - 2-stage spring-loaded
  - Stage 1: needle penetrates tissue
  - Stage 2: cannula slides over → traps tissue
  - Withdraw → tissue in groove

⚠️ Always biopsy **multiple sites** + include normal + abnormal areas

#### 2. Surgical Biopsy (Open)
- Indication: percutaneous fails, multiple lesions, surgical planning
- **Approach**: Cranial midline laparotomy
- ⭐ Easiest target: **Left lateral lobe** (largest, most accessible)

### B. Liver Lobectomy (partial or complete)

**Indication**: focal lesion, mass (HCC, metastasis), trauma with hemorrhage

#### Punch biopsy method
- Use **circular punch** (like a cookie cutter)
- For small focal lesions at lobe edge
- Punch + forceps → close defect

#### Suture method (most common)
- ⭐ **Pre-place suture** at least **1 cm from edge** of lesion
- Cut **0.5 cm** between suture and lesion (so 0.5 cm tissue between margin + suture)
- Why: prevents suture slip-off

#### Overlapping interrupted suture pattern
- For larger lesions
- **Simple interrupted full-thickness** sutures around lesion
- Each suture **overlaps 1/3 of previous**
- Like roof shingles

#### Stapling method
- TA stapler — fast, reliable
- Lobe is divided + stapled simultaneously

### C. Complete Lobectomy

**Indications**: large mass, severe parenchymal disease, trauma

**Technique**:
1. Identify lobe + supplying vessel
2. **Triple ligate** vessel + duct
3. Cut between ligatures 2 + 3
4. ⚠️ **Caudate lobe** = trickiest (close to caudal vena cava)
5. Suture stapler may help

### D. Liver Mass

**Most common types**:
- **Hepatocellular carcinoma (HCC)** ⭐ most common primary
- **Bile duct adenoma/carcinoma**
- **Hemangiosarcoma** (mets from spleen common!)
- **Lymphoma**
- Lipomas (benign, no resection needed)

**Patterns**:
- **Massive** (single large mass) → lobectomy
- **Nodular** (multiple distinct nodules) → consider chemo
- **Diffuse** (entire liver involved) → poor prognosis

---

## 5. Biliary System Surgery

### Anatomy
- **Hepatic ducts** (from each lobe) → **Common hepatic duct**
- **Cystic duct** (from gallbladder) → joins hepatic duct
- **Common bile duct** → empties into duodenum (with pancreatic duct)

### A. Cholecystectomy (gallbladder removal)

**Indications**:
- **Mucocele** ⭐ (immobile gel-like contents)
- **Cholelithiasis** (gallstones — rare in dogs)
- **Severe cholecystitis**
- **Bile peritonitis** from gallbladder rupture

**Technique**:
1. Cranial midline laparotomy
2. Identify gallbladder + cystic duct
3. **Ligate cystic duct** + cystic artery
4. Dissect gallbladder from hepatic fossa
5. Inspect common bile duct patency
6. ⚠️ **Always inspect duodenal papilla** — bile must flow

### B. Cholecystoduodenostomy / Cholecystojejunostomy

**Indication**: common bile duct obstruction (e.g., pancreatic mass)

**Technique**: anastomose gallbladder directly to GI tract bypassing CBD

### C. Bile peritonitis

**Cause**: ruptured gallbladder or CBD
**Diagnosis**:
- Abdominal effusion **bilirubin > 2× serum** = diagnostic ⭐
- Yellow-green fluid
**Treatment**: emergency surgery + drainage + antibiotics

---

## PART 2 — PANCREAS

## 6. Pancreas Anatomy

### Two lobes
- **Right limb** (along duodenum)
- **Left limb** (along greater curvature of stomach + spleen)
- Connected at the **body**

### Functions
**Endocrine**: insulin, glucagon, somatostatin
**Exocrine**: amylase, lipase, trypsinogen

### Ducts
- Pancreatic duct → joins CBD → duodenum
- (Some species have accessory duct)

### Vasculature
- **Pancreaticoduodenal arteries** (cranial + caudal) — also supply duodenum
- ⚠️ **Don't disrupt** during surgery

---

## 7. Pancreas Surgical Procedures

### A. Pancreatic Biopsy

**Indication**: chronic pancreatitis dx, mass

**Technique**:
1. Cranial midline laparotomy
2. Identify pancreas
3. **Suture-fracture technique**: place sutures around tip → cut → tip detaches with closed margin
4. Or **needle biopsy** with US-guided

### B. Partial Pancreatectomy

**Indication**: focal lesion, abscess, mass

**Technique**:
1. Isolate target area
2. **Ligate vessels** carefully
3. Use **suture fracture** or **stapling**
4. Avoid common pancreaticoduodenal artery

### C. Pancreatic Mass

**Types**:
- **Pancreatic adenocarcinoma** — aggressive
- **Insulinoma** ⭐ (functional tumor → hypoglycemia)
- **Gastrinoma** (functional → ulcers)

**Surgery for insulinoma**:
- Localize tumor preoperatively (CT, intra-op US)
- Resect with margin
- Glucose monitoring critical pre/intra/post-op

### D. Pancreatitis Surgery

⚠️ **Most pancreatitis = medical**, NOT surgical!
- Surgery only if:
  - **Abscess** (US-guided drainage may suffice)
  - **Necrosis with sepsis**
  - **Complete duct obstruction**

---

## PART 3 — HERNIA

## 8. Hernia Basics

### Definition
- Protrusion of organ/tissue through a wall defect

### Types
1. **Congenital** (defect from birth)
2. **Acquired** (trauma, surgery)

### Classification
- **True hernia**: hernia sac (peritoneum lining) intact
- **False hernia**: no peritoneum (e.g., post-trauma)

### Components
1. **Hernia sac** (peritoneum)
2. **Hernia ring** (defect)
3. **Hernia content** (omentum, bowel, organ)

---

## 9. Specific Hernias

### A. Umbilical Hernia ⭐

**Demographics**: puppies/kittens · congenital

**Cause**: incomplete umbilical ring closure at birth

**Diagnosis**: palpable defect at umbilicus + reducible mass

**Treatment**: surgical repair (often combined with spay/neuter at 6 months)

### B. Inguinal Hernia

**Demographics**:
- **Male puppies** + **Female adults** (especially intact post-pregnancy)
- Some breed predisposition

**Cause**: defect at inguinal canal · bowel/uterus protrudes

**Severity**: incarcerated (trapped) → strangulated (vascular compromise) = emergency!

**Surgical repair**:
- Reduce contents
- Inspect bowel viability (resect if necrotic)
- Close hernia ring
- Use **non-absorbable monofilament**

### C. Diaphragmatic Hernia ⭐

**Cause**: trauma (HBC) most common · congenital rare

**Clinical**:
- Dyspnea
- Tachypnea
- Decreased lung sounds (one or both sides)
- "Empty" abdomen on palpation
- ⚠️ **Cardiogenic differential** (right CHF can also cause dyspnea)

**Diagnosis**:
- **X-ray** ⭐ — see GI organs in thorax
  - "Cardiac silhouette obscured"
  - Loss of diaphragm line
  - Bowel loops in chest

**Pre-op stabilization**:
- ⚠️ **Wait 24-48 hr** if shock — surgery now = high mortality
- Stabilize cardiovascular system first
- O₂ supplementation
- IV fluids cautiously (avoid worsening pulmonary edema)

**Surgery technique**:
1. **Cranial midline + paracostal extension** (better visualization)
2. **Decompress abdominal organs back into abdomen**
3. Inspect bowel for ischemia
4. Close diaphragm with **non-absorbable monofilament** (PDS or polypropylene)
5. **Chest tube** placement before closing (drain pneumothorax post-op)

**Closure pattern**: Simple continuous or interrupted

### D. Perineal Hernia

**Demographics**: **older intact male dogs** (Boston Terrier, Boxer, etc.)

**Cause**: pelvic diaphragm muscle weakness · testosterone influence

**Clinical**:
- Tenesmus (straining to defecate)
- Perineal swelling (one or both sides)
- Constipation/obstipation
- Urinary retention if bladder herniates

**Treatment**:
- ⭐ **Castration first** (reduces testosterone influence)
- Wait several weeks
- Then surgical repair

**Surgical methods**:
- **Internal obturator transposition**
- **Mesh repair**
- ⚠️ Can recur even after surgery

### E. Scrotal Hernia
- Bowel descends through inguinal canal into scrotum
- Surgery: castrate + close ring

### F. Femoral Hernia
- Below inguinal ligament
- Rare in vet

---

## 10. Hernia Surgery Principles

### General Steps
1. **Identify ring** + **sac** + **contents**
2. **Reduce** contents back to original cavity
3. **Inspect viability** (resect if necrotic)
4. **Close defect** without tension
5. Use **non-absorbable monofilament** for hernia ring
6. **Mesh** if defect too large

### Suture Pattern
- **Simple Interrupted** for small defects
- **Mattress sutures** for larger defects
- **Mesh + Onlay/Inlay** for very large defects

### Closure considerations
- ⚠️ Don't suture too tight (compromises blood supply)
- ⚠️ Don't suture loose (recurrence)
- Use **non-absorbable** to maintain long-term strength

---

## 11. Anesthesia Considerations

### Hepatic disease
- Reduce anesthetic doses by **50%**
- Avoid drugs metabolized by liver (or extend recovery)
- Ketamine OK · NSAIDs avoid

### Diaphragmatic hernia
- **Pre-oxygenate**
- ⚠️ **Don't induce until ready to ventilate** (lungs need IPPV immediately)
- Monitor blood gas
- Capnography essential

### Pancreatic surgery
- Glucose monitoring (insulinoma)
- Anti-emetics + maintain perfusion

---

## 🎯 Exam recap (15 ข้อ)

1. **Left lateral lobe** = largest, easiest to biopsy
2. **Liver biopsy** = US-guided Tru-Cut OR surgical
3. **Liver lobectomy** = triple ligation + cut between 2nd and 3rd
4. **HCC** = most common primary liver tumor
5. **Cholecystectomy** = gallbladder removal · indications: mucocele, stones, severe disease
6. **Bile peritonitis** = abdominal fluid bilirubin >2× serum
7. **Insulinoma** = functional pancreatic tumor → hypoglycemia
8. **Pancreatitis surgery** = rare · only for abscess, necrosis with sepsis, duct obstruction
9. **Diaphragmatic hernia** = trauma cause · stabilize first 24-48hr · then surgery
10. **Diaphragmatic surgery** = cranial midline + paracostal · chest tube essential
11. **Perineal hernia** = older intact male · castrate first
12. **Umbilical hernia** = puppies/kittens · combine with spay/neuter
13. **Inguinal hernia** = male puppies + female post-pregnancy
14. **Hernia repair** = non-absorbable monofilament for ring
15. **Pre-op liver disease** = check coagulation, reduce protein, lactulose

> 📚 อ่านควบ: 4.1 GI Diag (2SJ4M6IiJeU) · 4.2 Endoscope (0C218gD_tZM) · 5.1 Intestine Sx (lS4wSGDKFrY) · 3 Hepatobiliary (keqE30HxM7Y)`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM I — 3. Hepatobiliary system + Diet Manage (Y4/1)
  // ─────────────────────────────────────────────────────────────
  keqE30HxM7Y: {
    videoId: 'keqE30HxM7Y',
    title: '3. Hepatobiliary system + Diet Manage',
    subject: 'com1',
    date: '19 Aug 67',
    durationMin: 227,
    instructor: 'อ. (Med II)',
    examFormat: 'Case-based MCQ — bile acids · ALP/GGT · acetaminophen toxicity · PSS · TLI/PLI cut-offs · diet selection ออกบ่อย',
    summary: `# Hepatobiliary System + Diet Management

> 🎯 คลิป 3 ชม.ครึ่ง · ยาวสุดของ COM I · 2 ส่วน:
> Part 1 = ตับ + ตับอ่อน (~2 ชม.) · Part 2 = Diet Management ของ GIS (~1 ชม.)
> อ.บอกตอนเปิดคลิป: ถ้า completion rate ต่ำ (<30% ดูจบ) → ข้อสอบจะออกเอื้อคนดูคลิป

---

# 🟧 PART 1 — Liver Disease (เฮปาตlogy)

## 1. Anatomy + Function Recap

**Liver lobule** = หน่วยรูปหกเหลี่ยม (hexagon) มี hepatocyte เรียงเป็น hepatic cord + bile canaliculi แทรก
- เลือดวิ่งจาก **periportal area** (zone 1) → **midzonal** (zone 2) → **centrilobular** (zone 3, ใกล้ central vein)
- Zone 3 ขาดเลือดง่ายสุด → ตายก่อน (centrilobular necrosis pattern)

**6 Functions ของตับ**
| Function | รายละเอียด |
|---|---|
| **Metabolism** | CHO · Protein · Lipid · Nucleic acid · Heavy metal |
| **Bile secretion** | Bile acid · Bile component (bilirubin) |
| **Detoxification** | Xenobiotics · ammonia · endogenous hormones |
| **Hemostasis** | Clotting factors · anticoagulants · fibrinolytic proteins |
| **Immunosurveillance** | ผ่าน Kupffer cells (เม็ดเลือดขาวในตับ) |
| **Regeneration** | ตับสามารถ regenerate ตัวเองได้ ถ้าเสียหายเล็กน้อย |

---

## 2. Clinical Signs ที่ทำให้นึกถึงโรคตับ

| Sign | กลไก |
|---|---|
| **Jaundice (icterus)** | Pre-/Hepatic/Post-hepatic — แยกด้วย CBC + imaging |
| **Abdominal distension** | "**7 F's**" → Fluid · Fat · Flatus · Feces · Fetus · Flabby · Foreign mass + Organomegaly |
| **Hepatic encephalopathy (HE)** | NH3 ขึ้น → BBB → behavior change · head pressing · wandering · seizure · hypersalivation |
| **Coagulopathy** | Petechia · ecchymosis · hemoabdomen · hematuria |
| **Acholic feces** | สีขาวเทา (no stercobilin) → bile duct obstruction |
| **Steatorrhea** | สีเหลืองมัน → cholestasis · ต้องแยกกับ EPI |
| **PUPD** | PSS, hepatic dysfunction (urea ↓ → osmotic gradient เสีย) |
| **Small bowel diarrhea** | secondary GI involvement |

**7F detail (Abdominal distension)**:
- **F**luid (effusion) → albumin ↓ (oncotic ↓) · portal hypertension (hydrostatic ↑) · vascular permeability (FIP)
- **F**at, **F**lapping (Cushing's, hormone), **F**lapin abdomen
- **F**eces (constipation), **F**etus, **F**lapinant tumor (HCC, cholangiocarcinoma, lymphoma, hemangiosarcoma)
- **O**rganomegaly: hepatomegaly · splenomegaly (portal hypertension)

---

## 3. Lab Markers — RER Enzymes vs Liver Function

### Hepatocellular Injury Markers
| Enzyme | Source | ขึ้นเมื่อ |
|---|---|---|
| **ALT** | Hepatocyte (mitochondria + cytosol) | Specific ตับ · ขึ้นเมื่อ cell injury |
| **AST** | Hepatocyte + muscle | ถ้า AST >> ALT → muscle origin |

⚠️ **End-stage cirrhosis** → ALT/AST อาจ Normal เพราะไม่เหลือเซลล์ให้ leak

### Cholestasis Markers
| Enzyme | Specifics |
|---|---|
| **ALP** | Bone form (ลูกสัตว์ขึ้นได้) · Cortico-induced form (สุนัขเท่านั้น · แมวไม่มี) · Liver form |
| **GGT** | parallels ALP · ใน cat hepatic lipidosis: **ALP ↑↑ มาก แต่ GGT normal/mild** ⭐ |

### Liver Function Tests
| ลด ↓ (Decrease concentration) | เพิ่ม ↑ (Increase concentration) |
|---|---|
| Albumin · Glucose · Cholesterol · BUN | Bilirubin · Bile acids · Ammonia · Coagulation time |

⚠️ Markers ไม่ sensitive: ตับต้องเสีย **>70-80%** ก่อน function test จะผิดปกติ

---

## 4. Bile Acid Test

ทำเฉพาะกรณี: ALP/ALT ขึ้น แต่ไม่มีตัวเหลืองชัด · สงสัย PSS หรือ hepatic disease · เก็บ pre-prandial + post-prandial (2 ชม.)

| Bile acid | แปลผล |
|---|---|
| < 25 µmol/L | Gray zone — ไม่น่าเป็น PSS |
| 25–35 | กลางๆ |
| > 35 (โดยเฉพาะ > 100) | สงสัย PSS สูงมาก ⭐ → ทำ imaging ต่อ |

⚠️ Cholestasis (extra-hepatic) อาจ bile acid > 100 ได้เหมือน PSS — ไม่ specific 100%

**Ammonia limitation**: ไม่คงตัว · เก็บในหลอดเฉพาะ · ตรวจภายใน 30 นาที · sample ต้องแช่เย็น

---

## 5. Urinalysis ที่บ่งบอกโรคตับ

- **USG ต่ำมาก** → urea ต่ำ → osmotic gradient เสีย (PSS, hepatic insufficiency)
- **Bilirubinuria** — สุนัข 1+ ยังรับได้ · แมว 1+ = abnormal เลย (renal threshold cat สูงกว่าหมา)
- **Ammonium biurate crystal** ⭐ — รูป "apple-puff" หรือ sarcoptic mite-like → สงสัย PSS / hyperammonemia · เคยพบในพันธุ์ Dalmatian

---

## 6. โรคที่เจอบ่อย (Top 8)

### 6.1 Acute Hepatitis
**สาเหตุ**: toxin (aflatoxin · mushroom · xylitol · acetaminophen · carprofen · sulfonamide) · infection (ICH adenovirus · Leptospira) · ischemic disorder (lobe torsion)

**Lab**: ALT ↑↑↑ · ALP ↑ · GGT ↑ · บางทีเจอ hyperbilirubinemia + hyperammonemia + coagulopathy

**Treatment**: หยุด exposure + supportive (fluid + electrolyte + liver supplement + nutrition)
- Specific antidotes: Lepto → Penicillin G IV/Doxycycline · Acetaminophen → **N-acetylcysteine (NAC)**

⚠️ ต้อง follow-up เพราะอาจ progress สู่ chronic hepatitis ภายใน 4-6 wks

---

### 6.2 Acetaminophen Toxicity ⭐ (จำให้แม่น)

**Mechanism**: 3 metabolic pathways = Glucuronidation (หลัก-ปลอดภัย) · Sulfation · Cytochrome P450
- แมวมี glucuronidation/sulfation จำกัด → วิ่งไป CYP450 → ได้ **NAPQI** (toxic metabolite)
- NAPQI ทำลาย hepatocyte + RBC (methemoglobin formation)
- Glutathione (GSH) จับ NAPQI ไปทิ้งในปัสสาวะ — แต่ stock จำกัด

**Clinical signs**:
- Depression · cyanosis · **brown/blueish mucous membrane** (methemoglobinemia)
- Hypersalivation · vomiting · panting (hypoxia)
- ⭐ **Facial edema, paw edema, leg edema** (เห็นแล้วต้องนึกถึง acetaminophen!)
- Brown urine (hemoglobinuria)

**Lab**: ALT/AST/ALP ↑ · hyperbilirubinemia · anemia · **Heinz bodies** บน blood smear

**Treatment**:
| Drug | Dose | Note |
|---|---|---|
| **N-acetylcysteine (NAC)** | Loading 140 mg/kg slow IV → maintenance 70 mg/kg q6-8h × 7 doses | Antidote — GSH precursor |
| Vitamin C | + | Anti-oxidant adjunct |
| Cimetidine | + | Anti-oxidant adjunct |
| SAMe | Switch to PO เมื่อกินได้ | Long-term liver support |
| Silymarin | + | Long-term liver support |

⚠️ NAC long-term ไม่ได้ → กลายเป็น **pro-oxidant** ตัวเอง

---

### 6.3 Chronic Hepatitis
**Causes**: Acute → chronic · long-term chemical (heavy metal — copper) · long-term drug (phenobarbital, glucocorticoid) · idiopathic

**Lab**: ALT/AST ขึ้น · hypoalbuminemia · low cholesterol · hyperammonemia (severe case)

**US**: เห็น irregular surface (fibrosis) · บางทีดู normal

**Treatment**: SAMe · Ursodiol · low-protein diet (ถ้ามี HE) — antifibrotic agent ยังไม่มีที่ work 100%

---

### 6.4 Portosystemic Shunt (PSS)

**Congenital** (vs acquired) = หลอดเลือดเชื่อม Portal vein กับ vena cava/azygous → bypass ตับ
- **Intra-hepatic** vs **Extra-hepatic**
- **Predisposing breeds (สุนัข)**: Yorkshire · Mini Schnauzer · Labrador Retriever ⭐ (แมวไม่มี)
- มักแสดงอาการช่วง > 6 เดือน

**Clinical**: weakness · PUPD · neurological signs (HE) · **stunted growth** · ammonium biurate uroliths

**Lab**: ↑ liver enzymes · hypoalbuminemia · hyperammonemia · ↑ post-prandial bile acid (↑↑↑) · ammonium biurate crystals in UA

**Diagnosis**: Ultrasound + Doppler · CT scan (gold standard for surgical planning)

**Treatment**:
- **Surgical closure** (ของให้ดีที่สุด) — partial close → ค่อยๆ ปิด เพื่อไม่ให้ portal pressure ขึ้นเร็วเกิน
- ถ้าทำไม่ได้ → medical: low-protein diet + lactulose (lactulose ลด ammonia absorption + เพิ่ม colonic transit)

---

### 6.5 Hepatic Tumors

| Tumor | Note |
|---|---|
| **HCC (Hepatocellular carcinoma)** | Common · 3 patterns: massive · nodular · diffuse |
| HCC adenoma | Benign |
| **Cholangiocarcinoma** | More aggressive than HCC · spread เร็ว |
| Mets: lymphoma · hemangiosarcoma · MCT | จาก primary อื่น |

⭐ **Insulin-like Growth Factor** จาก HCC → ดึงน้ำตาลเข้า → **hypoglycemia** → episodic weakness/UVD

---

### 6.6 Hepatic Lipidosis (สำคัญในแมว!)

**Classic case**: แมวอ้วน, middle-age, anorexic 2-14 วัน → ตับบวม

**Pathogenesis**: Negative energy balance → ดึง glycogen หมด → ดึง fat (lipid mobilization) → triglyceride สะสมใน hepatocyte

**Types**:
- **Primary** (idiopathic): ไม่อร่อย · เข้าถึงไม่ได้ · stress event
- **Secondary**: GI disease · liver disease · pancreatitis · CKD · DM · cancer

**Clinical**: anorexia · jaundice · dehydration · vomiting · constipation · weakness · cervical ventroflexion (K+ ↓) · hypersalivation (HE)

**Lab signature** ⭐:
- **ALP ↑↑↑ มาก** (5–10x) แต่ **GGT normal/mild** (ขึ้นต่างจากโรคตับอื่น!)
- ALT mild–moderate · hyperbilirubinemia · ↑ bile acid · hypoalbuminemia · hyperglycemia (stress)
- Electrolytes: ↓ K · ↓ P · ↓ Mg

**Cytology**: hepatocyte บวมด้วย micro/macrovesicular lipid · confirm ด้วย **Oil Red O stain** → สีแดง

**Treatment** ⭐:
- **Nutrition support** = หัวใจของการรักษา — **enteral feeding tube** (esophagostomy)
- **High protein** (cat = obligate carnivore!) · moderate fat · **low CHO**
- คำนวณจาก RER · ค่อยๆ ทยอยให้ 1/3 → 2/3 → 3/3 (refeeding syndrome prevention)
- Fluid + electrolyte · ARG + Taurine + B12 supplement
- Appetite stimulant: mirtazapine
- NAC แรกๆ → switch SAMe เมื่อกินได้

---

### 6.7 Extra-hepatic Bile Duct Obstruction (EHBO)
**สาเหตุ**: Stone · neoplasia · external compression · inflammation จากออร์แกนข้างๆ · **river fluke** (แมวที่กินปลาดิบ/หอยทาก)

**Clinical**: jaundice · vomiting · weight loss · cranial abdominal pain · acholic feces

**Lab**: ALP ↑↑ · GGT ↑ · ALT mild · hyperbilirubinemia · ↑ bile acids

**US**: dilated common bile duct · gallbladder distension · thickened wall

**Treatment**:
- Surgical correction ถ้า complete obstruction — choledochojejunostomy
- River fluke (cat) → **Praziquantel 20 mg/kg PO × 3-5 วัน** ⭐

---

### 6.8 Cholecystitis (ถุงน้ำดีอักเสบ)
**สาเหตุ**: Ascending bacterial (duodenal reflux) — **E. coli · Enterococcus · Streptococcus · Clostridium · Bacteroides**

**Lab**: leukocytosis (neutrophilic) · ALP ↑ · GGT ↑ · hyperbilirubinemia

**US**: thickened gallbladder wall · gallstones · mucocele

**Treatment**:
- **Cholecystocentesis** + culture + cytology
- Empirical: **Amoxicillin-clavulanate + Metronidazole** หรือ Fluoroquinolone (broad spectrum)
- **Ursodeoxycholic acid** (choleretic — ห้ามให้ถ้า complete obstruction!)
- Severe → **cholecystectomy**

---

### 6.9 Cholangitis (ท่อน้ำดีอักเสบ)
4 types (common ในแมวมากกว่าหมา):

| Type | Mechanism | Treatment |
|---|---|---|
| **Neutrophilic (NC)** | Bacterial ascending | Amox-clav + Metro × หลาย wks–เดือน |
| **Lymphocytic (LC)** | Immune-mediated | Immunosuppressive + AB cover |
| **Chronic** | River fluke infection | Praziquantel 20 mg/kg × 3-5d |
| **Destructive** | Idiosyncratic (sulfonamides · canine distemper) | Immune suppressive |

⚠️ Course of treatment ยาว — สัปดาห์ถึง 2-3 เดือน

---

### 6.10 Gallbladder Mucocele ⭐ (เจอเยอะขึ้น)

**Predisposing**: middle-aged dog · small-medium breed (Cocker spaniel · Mini Schnauzer · Pomeranian · Shih Tzu) · risk = endocrine disease · long-term steroid

**Pathogenesis**: bile หนืดข้น → ขยายถุงน้ำดี → bile duct obstruction → biliary peritonitis (rupture)

**6 Types บน Ultrasound** (kiwi pattern!):
| Type | Pattern |
|---|---|
| 1 | Mucin layer เกาะผนัง > 30% |
| 2 | Stellate (เริ่มแฉก) |
| 3 | Stellate complete |
| 4 | Early kiwi pattern |
| 5 | Residual center + kiwi edge |
| 6 | **Complete kiwi pattern** ⭐ — ขีดขาวรอบ (เหมือนผลไม้กีวี) |

**Treatment**:
- **Treatment of choice = cholecystectomy** ตัดถุงน้ำดีออก (esp. type ≥ 2)
- Type 1 + asymptomatic → medical: **Ursodiol 10-15 mg/kg/day with food** + SAMe + Silymarin + low-fat diet
- Follow-up ทุก 4-6 wks (ไม่งั้น progress อาจเป็น rupture)

---

## 7. Liver Supplements (ต้องจำ 4 ตัว!) ⭐⭐⭐

| Drug | Dose | Mechanism | Tip |
|---|---|---|---|
| **Silymarin (Legalon)** | 20-50 mg/kg/day | Anti-oxidant + choleretic + inhibit hepatotoxin binding | **ห้ามให้พร้อมอาหาร** (bioavailability ต่ำ) |
| **SAMe (S-adenosyl methionine)** | 20 mg/kg/day | Anti-oxidant + GSH precursor + anti-inflammatory + anti-fibrotic | **ก่อนอาหาร** · แพง · ดีกว่า silymarin |
| **N-acetylcysteine (NAC)** | Load 140 → 70 mg/kg q6-8h × 7 doses | GSH precursor (acetaminophen antidote) | **Short course** เท่านั้น (long = pro-oxidant) |
| **Ursodeoxycholic acid** | 10-15 mg/kg/day | Choleretic + cytoprotective + immunomodulating | **กับอาหารได้ดูดซึมดี** · ห้ามใช้ใน complete EHBO |

---

# 🟪 PART 2 — Pancreas

## 8. Pancreatitis

### 8.1 Acute vs Chronic
- **Acute**: neutrophilic + necrosis · **reversible** if treated
- **Chronic**: lympho-plasmacytic + **fibrosis** · **permanent histo change** · atrophy

### 8.2 Etiologies (สำคัญ)
- Predisposing breeds: Mini Schnauzer · Boxer · Cocker Spaniel · Collie · Yorkie
- **Obesity + hyperlipidemia + hypertriglyceridemia** ⭐ (เด่นในสุนัข)
- High-fat diet (treats > 10% of caloric needs)
- Hypoperfusion · trauma · obstruction · duodenal reflux
- Drugs: phenobarbital · organophosphate · sulfonamide
- Infection: bacterial · **FIP (cat)** · parvo (dog) · toxoplasma · river fluke

### 8.3 Triaditis (cat ⭐) = Pancreatitis + IBD/cholangitis + cholangiohepatitis รวมกัน

### 8.4 Local vs Systemic Complications
| Local | Systemic |
|---|---|
| Pancreatic necrosis | Electrolyte imbalance |
| Pseudocyst | Acid-base imbalance |
| Abscess | Acute kidney failure |
| | Myocarditis · DIC · neurologic |

⭐ Severity → systemic = bad prognosis

### 8.5 Clinical Signs

| Dog | Cat |
|---|---|
| Vomiting · anorexia · abdominal pain | Anorexia · lethargy · hypothermia · dehydration |
| **Prayer position** ⭐ (หมอบกราบ) | **Feline Grimace Scale** (หู ตา หนวด muzzle tension) |
| Diarrhea · weakness · dehydration | Vague — access pain ยากกว่า |

### 8.6 Diagnosis
- CBC: thrombocytopenia · anemia · neutrophilia (left shift)
- Chemistry: ↑ liver enzymes · pre-renal azotemia · hypoalbuminemia · hypocalcemia · electrolyte imbalance
- UA: ↑ USG (pre-renal)

**Pancreatic Enzymes** ⭐:
| Test | Note |
|---|---|
| Serum amylase/lipase | Low sens/spec — สร้างจากที่อื่นด้วย |
| **Spec PLI (Pancreatic Lipase Immunoreactivity)** | Quantitative · gold standard |
| **Snap PLI** | Qualitative POC test |
| **VCheck PLI** ⭐ | Korean device · ใช้กันใน Thailand · semi-quantitative |

**cPLI cut-offs (dog)** ⭐:
| Old | New | แปลผล |
|---|---|---|
| 0–2.5 normal | 0–5.5 normal | Normal |
| 2.6–5.6 gray zone | 5.6–7.5 / 7.6–10.8 gray | ดู clinical · trial Tx |
| > 4.0 (positive) | > 10.9 = definite | Pancreatitis |

**fPLI cut-off (cat)**: > 5.4 = pancreatitis · gray 3.5–5.4

**Imaging**: US เห็น hypoechoic pancreas + hyperechoic peripancreatic fat (acute) · hyperechoic pancreas (chronic, fibrosis)

### 8.7 Treatment

| Component | Detail |
|---|---|
| **Aggressive supportive** | Admit ถ้าได้ |
| Fluid + electrolyte | IV crystalloid |
| Anti-emetic | Maropitant · ondansetron |
| **Analgesia** | **Opioids** (fentanyl drip/patch · methadone) · NSAIDs ห้ามใน pancreatitis! |
| Antibiotic | เฉพาะถ้า culture positive — ไม่ให้พร่ำเพรื่อ |
| Anti-inflammatory | สเตียรอยด์ controversial ใน acute · ใน chronic อาจให้ cyclosporine |
| **Nutrition support** | Enteral > parenteral · ใน dog = low-fat · ใน cat = ไม่ต้อง low-fat (carnivore) |
| Monitoring | Repeat PLI + Inflammatory markers + US |

---

## 9. Exocrine Pancreatic Insufficiency (EPI) ⭐

### 9.1 Causes
- **Pancreatic acinar atrophy (PAA)** — congenital, polygenic mode · breed: **German Shepherd** · Rough Collie
- **Chronic pancreatitis** → atrophy of acinar cells (middle-old age)
- Pancreatic structural disorder (rare)

### 9.2 Pathophysiology
Acinar cells หาย → enzymes ↓ → maldigestion → **osmotic diarrhea** + steatorrhea
- Lost antibacterial substance → **dysbiosis** → ↑ folate (bacterial production) + ↓ B12
- Lost intrinsic factor → **cobalamin (B12) deficiency** ⭐
- Severe chronic → endocrine pancreas atrophy → **diabetes mellitus**

### 9.3 Classic Clinical Picture ⭐
- Chronic small bowel diarrhea · **steatorrhea** (yellow greasy stool)
- **Severe weight loss** (BCS 1/9)
- **Polyphagia** + **coprophagia** + pica (กินอึตัวเอง · กินสิ่งแปลกปลอม) ⭐
- Cat: greasy soiling of tail
- ขนเสีย · stunted growth (เด็ก)

### 9.4 Diagnosis — TLI (Trypsin-like Immunoreactivity) ⭐⭐⭐

**Key**: ต้อง **อดอาหาร 8-12 ชม.** ก่อนเก็บ · false ↑ ใน renal disease (TLI ขับทาง kidney)

**cTLI cut-off (dog)**:
| Old | **New (in use abroad, TH รออัปเดต)** | แปลผล |
|---|---|---|
| < 2.5 = EPI | < 5.5 = EPI | EPI confirmed |
| 2.6–5.6 gray | 5.6–7.5 / 7.6–10.8 gray | Trial enzyme |
| > 5.7 normal | > 10.9 normal | ไม่ใช่ EPI |

**fTLI (cat)**: < 8.0 = EPI ⚠️ ไม่มีในไทย → ต้อง try empirical enzyme replacement

**Other tests**: fecal smear (Sudan III/Oil Red O for fat) · **proteolytic activity** (3-day test, falling out of use)

### 9.5 Treatment ⭐⭐⭐

**Pancreatic Enzyme Replacement** = **lifelong therapy** (ไม่หาย!)
- Bovine/porcine pancreas extract — powder (preferred) > capsule
- **Mix กับอาหารทันที** (ไม่ต้องรอ) · ทุกมื้อ · ก่อนอาหาร
- Dose: 0.5-1 tsp powder per 10 kg per meal

⚠️ Side effect: **oral bleeding** ในโดสสูง (mucosal irritation) → ลดโดส

**Adjunct**:
- **Cobalamin (B12) supplementation** (lifelong if low)
- **Acid suppressant** (PPI / H2 antagonist) — ป้องกันกรดทำลาย enzyme · taper PPI ถ้าใช้ > 4 wks
- **Manage dysbiosis**: prebiotic/probiotic/symbiotic · Metronidazole/tylosin if confirmed bacterial overgrowth
- Diet: **highly digestible** · avoid high fiber · low-fat depends on individual

⚠️ Counsel เจ้าของ: ห้ามให้อาหารอื่น/ขนม · ไม่ทิ้ง mixed food ไว้นานก่อนป้อน · enzyme **replace ไม่ใช่ regenerate**

**Prognosis**: ดีถ้าไม่มี concurrent disease (DM, chronic enteropathy) · controllable lifelong

---

# 🟦 PART 3 — Diet Management for GI Disease

## 10. Macronutrient Basics

### 10.1 Carbohydrate
- **Complex CHO** (starch) — main source · ย่อยโดยร่างกาย
- **Fiber** — แบคทีเรียย่อย → short chain fatty acids (SCFA) ↗ colon health
- **Lactose** — แมว/หมาโตแล้ว enzyme ↓ → lactose intolerance → osmotic diarrhea (เลี่ยงนมวัว)

### 10.2 Protein
- Essential amino acids · บางตัวกลายเป็น food allergen
- **Hydrolyzed protein** = peptide < 15 kDa (sometimes 1-3 kDa)
- **Novel protein** = แหล่งใหม่ที่สัตว์ไม่เคยกิน (แกะ ปลา จิงโจ้)

### 10.3 Fat
| Type | Note |
|---|---|
| Long-chain triglyceride (LCT) | ส่วนใหญ่ในอาหาร · absorb via lymphatic |
| **Medium-chain triglyceride (MCT)** ⭐ | bypass lymphatic → portal vein direct · MCT oil/coconut oil · ใช้ใน lymphangiectasia |
| Short-chain fatty acid (SCFA) | จาก fiber fermentation · colon energy |

⚠️ MCT = ketogenic potential (caution in acidosis/ketosis)

### 10.4 Fiber Classification
- **Solubility**: Soluble (gel-forming, prebiotic) · Insoluble (bulk laxative)
- **Fermentability**: High (SCFA + gas) · Moderate (preferred) · Low (blocking agent)

### 10.5 Microbiota
- **Prebiotic** = อาหารของแบคทีเรียดี (FOS, inulin, fiber)
- **Probiotic** = เชื้อแบคทีเรียดี (Bifidobacterium, Lactobacillus) · CFU > 10⁸-⁹
- **Symbiotic** = pre + pro รวมกัน
- **Postbiotic** ⭐ ใหม่ = bioactive compound จาก probiotic (SCFA + AMP + amino acid)

⚠️ Yogurt ทั่วไปไม่ confirmed dose — ใช้ commercial product ดีกว่า

---

## 11. The 6 Therapeutic Diet Categories

| Diet | Use | Key feature |
|---|---|---|
| **GI Diet (Highly Digestible)** | First-line ทั่วไป | Protein 87% · CHO 90% digestibility · low fiber |
| **Hydrolyzed Protein** | Food allergy · IBD · acute enteritis | Protein < 15 kDa · low immunogenicity · expensive |
| **Novel Protein** | Food allergy (later phase) | New protein source (lamb, fish) · check label for hidden ingredients |
| **Home-cooked** | Custom (last resort) | Need nutritionist · risk of imbalance |
| **Fiber Enhanced** | Colitis · constipation · diabetes · GDV recovery | Mix soluble + insoluble · ↓ digestibility (need ↑ vol) |
| **Restricted Fat (low-fat)** | Pancreatitis · lymphangiectasia · GDV recovery · esophagitis | < 10% fat (low) · 10-15% (moderate) |

### 11.1 Home-cooked rules
- ปรึกษา nutritionist + ระบุ protein source
- Risk of relapse + ไม่ balanced

---

## 12. Disease-Specific Diet (Recap-style)

### 12.1 Esophageal Disease ⭐
- **Low-fat** (high fat → delay gastric emptying → ↓ LES pressure → reflux ↗)
- Adequate protein (↑ LES pressure)
- **Small frequent meals** + **elevated feeding** (Bailey chair posture)
- Vertical posture × 30 min after meal
- Severe → feeding tube (gastrostomy/jejunostomy)

### 12.2 Gastric Disease (Gastritis)
- GI diet (highly digestible)
- Wet/warm food → ↓ gastric retention
- Small frequent meals
- **Feed through vomiting** (modern approach — preserve villi) ✓ better than 12-24 hr fasting

### 12.3 GDV Recovery ⭐
- **Large particle size > 30 mm** (slow eating)
- Dental care diet หรือ size-appropriate kibble
- Eat alone in quiet area + no exercise post-meal
- Slow-feeder bowl

### 12.4 Enteritis
- Highly digestible · small frequent meals
- ± Hydrolyzed if suspect food allergy

### 12.5 Adverse Food Reaction
- **Food intolerance** (no immune) — eliminate offending food
- **Food allergy** (immune-mediated) — **Elimination Trial × 6-12 wks**:
  - Use hydrolyzed first (small molecule, less immunogenic, preserve gut healing)
  - Switch to novel protein later
  - Re-introduce to confirm (เจ้าของมัก decline)
- Common allergens: beef · chicken · fish · dairy · wheat · soy · egg

⚠️ "Single protein" claim บนถุง = ดูฉลาก! บางทีมี chicken ปนอยู่จริง

### 12.6 Chronic Enteropathy ⭐
Steps: diet → microbiota → biopsy → immunosuppressive
- Use hydrolyzed protein early (gut leaky stage)
- Switch to novel protein later
- + B12 + folate + omega-3 (anti-inflammatory)

### 12.7 Protein-Losing Enteropathy (PLE)
- Highly digestible / hydrolyzed / novel protein
- ⭐ **Lymphangiectasia subtype → Restricted-fat** (< 10-15%) + MCT
- Avoid high fiber (interferes absorption)
- Egg white/albumin tab supplement (slow)
- Severe → IV albumin/synthetic colloid

### 12.8 Colitis / Constipation
- **Fiber adjustment** (key nutrient) — fermentable fiber → SCFA → colonocyte energy
- Megacolon (no motility) → low-fiber + colectomy if intractable
- + wet food + activity + laxative (lactulose) + prokinetic (short-term only)

### 12.9 Hepatic Disease
- **No protein restriction unless HE** (HE → low-protein + lactulose)
- Avoid high-fat if cholestasis/cholecystitis
- **Taurine + Arginine** (esp. cat hepatic lipidosis) · Zinc supplement
- B-complex · Vitamin E + C
- Multiple small meals

### 12.10 Cat Hepatic Lipidosis ⭐
- **High protein** (cat = obligate carnivore!)
- **Moderate fat** (calorie-dense)
- **Low CHO** (avoid hyperinsulinemia → electrolyte shift)
- Energy distribution: Protein 30-40% · Fat 50% · CHO < 20%
- Refeeding protocol: 1/3 → 2/3 → 3/3 ของ RER

### 12.11 Pancreatitis Diet
- **Dog**: low-fat diet (10-15%)
- **Cat**: ไม่ต้อง low-fat (high fat tolerance)
- Enteral feeding > parenteral · feeding tube ถ้าจำเป็น

---

## 13. Refeeding Syndrome ⭐ (สำคัญ-ออกบ่อย)

**Definition**: ภาวะ metabolic derangement ในการให้อาหาร patient ที่ prolong starvation/negative catabolic state

**Pathogenesis**: Insulin surge ดึง K · P · Mg · water เข้าเซลล์ → severe electrolyte deficit

**Clinical**: vomiting · diarrhea · weakness · ventroflexion (severe hypoK) · cardiac arrhythmia

**Lab**: **Hypokalemia · Hypophosphatemia · Hypomagnesemia** (จำ K-P-Mg!)

**Prevention**:
- ค่อยๆทยอยให้: **1/3 → 2/3 → 3/3** ของ RER
- Low CHO (avoid insulin surge)
- Monitor electrolytes daily

**Correction**:
| Electrolyte | Dose |
|---|---|
| Hypokalemia (K < 2.5) | KCl ใน fluid · max 0.5 mEq/kg/hr |
| Hypophosphatemia | K-phosphate · stop เมื่อ > 2 mg/dL |
| Hypomagnesemia | MgSO4 IV |

---

## 📝 EXAM RECAP — 20 Key Points

1. **Liver zones**: Zone 3 (centrilobular) = ตายก่อนเพราะขาดเลือด
2. **7F mnemonic** for abdominal distension (Fluid · Fat · Flatus · Feces · Fetus · Flabby · Foreign mass)
3. **AST > ALT** = muscle origin · isolated **ALT ↑** = liver
4. **Cat hepatic lipidosis**: ALP ↑↑↑ · GGT normal/mild (unique pattern!)
5. **Bile acid > 100** = สงสัย PSS แต่ cholestasis ก็ขึ้นได้
6. **Ammonium biurate crystals** ใน UA = PSS / hepatic insufficiency
7. **Acetaminophen toxicity in cat**: NAPQI (CYP450) → methemoglobin · facial edema · brown mucus membrane → **NAC antidote 140 → 70 mg/kg**
8. **PSS predisposing breeds**: Yorkshire · Mini Schnauzer · Lab Retriever (dog) · cat ไม่มี
9. **Hepatic encephalopathy** = NH3 ขึ้น · low-protein diet + lactulose
10. **River fluke (cat)** → Praziquantel 20 mg/kg PO × 3-5 วัน
11. **Cholangitis 4 types**: NC (bacterial) · LC (immune) · Chronic (fluke) · Destructive (idiosyncratic drug)
12. **GB mucocele kiwi pattern** type 6 = surgical · type 1 = medical (Ursodiol + SAMe)
13. **4 liver supplements**: Silymarin (no food) · SAMe (before food) · NAC (short course) · Ursodiol (with food)
14. **Pancreatitis pain in dog = prayer position** · cat = Feline Grimace Scale
15. **EPI breed = German Shepherd** · TLI < 2.5 (or new < 5.5) · classic = **diarrhea + weight loss + polyphagia + coprophagia**
16. **EPI treatment = lifelong** enzyme + B12 supplement
17. **MCT bypasses lymphatic** → use in lymphangiectasia PLE
18. **Refeeding syndrome**: hypoK + hypoP + hypoMg · prevent with 1/3 → 2/3 → 3/3 protocol
19. **Cat lipidosis diet**: high-protein · moderate-fat · **low-CHO** (NOT low-fat!)
20. **Esophagitis feeding posture**: elevated + vertical post-meal × 30 min

> 📚 อ่านควบ: 6 Hepato/Pancreas Sx (5rcEK-3IW0M) · 7.1 Anemia · 8.1-3 Renal · 12.1-2 Cardio · 14.1-3 Neuro
> 🎬 วิดีโอยาวสุด 227 นาที · ดูจบแล้วเช็ค completion rate ในระบบเพื่อให้ได้ exam advantage`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 1. Basic about fracture (Y4/1) — Orthopedic Surgery
  // ─────────────────────────────────────────────────────────────
  xy6nxu6Sduc: {
    videoId: 'xy6nxu6Sduc',
    title: '1. Basic about fracture',
    subject: 'com2',
    date: '7 Aug 67',
    durationMin: 116,
    instructor: 'พี่พล (อาจารย์รุ่นพี่)',
    examFormat: 'MCQ — biomechanics terms · fracture classification · Salter-Harris types · pre-op management ออกบ่อย',
    summary: `# Basic about Fracture

> 🎯 บทเปิด ortho · 3 ส่วน:
> Part 1 = Biomechanics ของกระดูก (ฟิสิกส์เบสิก)
> Part 2 = Fracture Classification (7 หมวด)
> Part 3 = Pre-op Management + Basic Instruments

---

# 🟧 PART 1 — Biomechanics ของกระดูก

## 1. โครงสร้างกระดูก
| Component | % | Detail |
|---|---|---|
| **Inorganic (mineral)** | 70% | 95% = **Hydroxyapatite** (Ca-P) → ให้ความแข็ง |
| **Organic** | 30% | 98% = matrix (**collagen**) → ให้ความยืดหยุ่น |
| **Cells** | 2% ของ organic | osteocyte/blast/clast |

⭐ จุดเด่นของกระดูก = **แข็ง + ยืดหยุ่น** (ไม่ใช่แค่แข็งเปราะ)

**Functions**:
- **Biological**: Mineral homeostasis (Ca · P · Mg)
- **Mechanical**: Skeletal support + organ protection

**Bone Mineral Density (BMD)** = ความหนาแน่นมวลกระดูก · ลดลงได้จากแก่ · disease · low activity · ยาบางชนิด

---

## 2. Stress vs Strain ⭐ (ห้ามสับสน)

| Term | คำแปล | Definition |
|---|---|---|
| **Stress (ความเค้น)** | ไม่ใช่ "เครียด"! | แรงต่อพื้นที่ (N/m² หรือ Pa) |
| **Strain (ความเครียด)** | แต่ใช่ — "เครียด" | การเปลี่ยนแปลงรูปร่างหลังรับแรง (ΔL/L) |

⚠️ **กระดูกรับแรงเค้น (stress) แล้วเกิดความเครียด (strain)**

---

## 3. Stress-Strain Curve ⭐⭐⭐

| Region | Behavior |
|---|---|
| **Elastic region** | คืนรูปได้ 100% · ไม่มี damage แม้ระดับ micro |
| **Yield Point / Yield Failure** | เริ่มมี structural damage แต่วัตถุยังคงรูปอยู่ |
| **Plastic region** | คืนรูปไม่ได้ทั้งหมด — เริ่มเสียหาย |
| **Ultimate Failure / Failure Point** | แตกหักจริง ๆ |

**Young's Modulus (E)** = slope ของ elastic region = ความแข็ง (stiffness)
- สูง → วัตถุแข็ง (steel)
- ต่ำ → วัตถุยืดหยุ่น (rubber/foam)

| Material | E (GPa) |
|---|---|
| Stainless steel | 200 |
| Titanium | ~110 |
| Cortical bone | < 30 |
| Cancellous bone | < 5 |
| Bone cement | < 3 |

**Ductile vs Brittle**:
- **Ductile (เหนียว)** = plastic region กว้าง · ทนการ deform เยอะก่อนแตก (rubber, bone)
- **Brittle (เปราะ)** = plastic region แคบ · พังตู้ม (glass, ceramic)

---

## 4. คุณสมบัติพิเศษ 2 อย่างของกระดูก ⭐

### 4.1 Anisotropic ⭐
ความแข็งแรง **ขึ้นกับทิศทางของแรง**
- **Longitudinal (ตามแนวยาว) = แข็งแรงสุด** (สำหรับการเดิน-รับน้ำหนัก)
- **Transverse (ตั้งฉาก) = เปราะ** → โดนไม้ฟาดขาตรงๆ หักง่าย

### 4.2 Viscoelastic ⭐
ความแข็งแรง **ขึ้นกับความเร็วของแรง**
- โหลดเร็ว → กระดูกแข็ง (โดดลงน้ำเร็ว = น้ำแข็ง)
- โหลดช้า → กระดูกยอม → หักง่ายกว่า (รถขับช้า ๆ ทับขา = หัก)

---

## 5. Failure Modes (2 อย่างที่จำให้ได้)

| Mode | กลไก | Common in |
|---|---|---|
| **Overload failure** ⭐ | แรงครั้งเดียวเกิน yield/ultimate | ตัวกระดูก + implant ขนาดเล็ก |
| **Fatigue failure** ⭐ | แรงเล็ก ๆ ซ้ำ ๆ → micro damage สะสม | implant ใส่ค้างนาน · กระดูก healing ช้า |

⚠️ Implant ใส่ใหญ่ไปก็ไม่ได้ — กระดูกรับไม่ไหว → **balance**

---

## 6. 4 Factors ของแรงทำให้กระดูกหัก

| Factor | สัมพันธ์กับ |
|---|---|
| **Magnitude** | F = ma · ขนาดแรง |
| **Direction** | Anisotropic (ทิศทาง) |
| **Duration** | Viscoelastic (ความเร็ว) |
| **Number** | Fatigue (ความซ้ำ) |

---

## 7. Bone Healing — Strain Tolerance ⭐⭐⭐

> **กระดูกทน strain ได้แค่ 2%** — ถ้าเกิน ตัวเซลล์ที่จะมาสร้างใหม่จะตาย

**Sequence**:
1. Granulation tissue (ทน strain เยอะที่สุด)
2. Fibrous tissue
3. Cartilage (fibrocartilage)
4. Woven bone → Lamellar bone

⚠️ ถ้า fragment ขยับ > 2% ตลอด → กระดูกใหม่ที่เพิ่งสร้างจะแตกตลอด = non-union
**สรุป**: เพราะฉะนั้นต้อง **immobilize** ในการรักษา fracture

---

## 8. Loading Modes & Fracture Patterns ⭐⭐⭐

| Loading | Pattern | Mnemonic |
|---|---|---|
| **Tension** (ดึง) | **Transverse fracture** (ตรง) | ดึงขนมจีน → ขาดตรง |
| **Compression** (กด) | **Oblique fracture** (เฉียง) | กดกระป๋อง → สลิป |
| **Bending** (งอ) | **Wedge / Butterfly fragment** + Transverse | ด้านยืด + ด้านบี้ → กระเด้งออก |
| **Shearing** (เฉือน) | ตามทิศแรงเฉือน | |
| **Torsion** (บิด) | **Spiral fracture** (เกลียว) | บิดผ้า → ลอยเกลียว |
| **Combined** | **Multiple / Comminuted** ⭐ | tvma จริง ๆ มักผสม |

---

# 🟪 PART 2 — Fracture Classification (7 หมวด)

## 9. ทำไมต้อง classify?
**Communication** — ส่งเคสต้องบอกได้ว่าเท่าไหน · ตรงไหน · แบบไหน
+ สำหรับงานวิจัย/เก็บข้อมูล + การติดตามอาการ

---

## 9.1 Degree (สภาพการแตกหัก)
- **Complete** = แยกออกจากกัน
- **Incomplete**:
  - **Greenstick fracture** ⭐ — เด็ก · กระดูกหัก แต่ไม่แยก (เหมือนกิ่งไม้สด-เหนียว)
  - **Fissure / Crack** — ผู้ใหญ่ · เห็นรอยร้าว แต่กระดูกไม่หัก

---

## 9.2 Pattern (รูปแบบการแตก)

| Pattern | เกิดจาก | Detail |
|---|---|---|
| **Transverse** | Tension | แตกตรง |
| **Short oblique** ⭐ | Compression | แนวรอย < 2× diameter ของกระดูก |
| **Long oblique** ⭐ | Compression | แนวรอย ≥ 2× diameter |
| **Spiral** | Torsion | เกลียว |
| **Wedge / Butterfly** | Bending | แตก 3 ชิ้น (มี wedge fragment) |
| **Segmental** | Combined | แตกเป็น block ตรงกลาง (rare) |
| **Comminuted** | Combined | แตกละเอียด ≥ 3 ชิ้นเล็ก ๆ |

⚠️ Short vs Long oblique → มีผลในการเลือกวิธี repair ต่างกัน!

**Simple vs Multiple**:
- Simple = หยิบ 2 ชิ้นต่อกันได้แบบจิ๊กซอ (transverse · oblique · spiral)
- Multiple = ≥ 3 ชิ้น (segmental · comminuted)

⭐ **Cat tip**: ในแมว ~95% เป็น **comminuted** (กระดูกเปราะแบบไม้ไผ่) · simple/spiral ไม่ค่อยเจอ

---

## 9.3 Displacement ⭐⭐⭐ (งงเยอะที่สุด)

**Rule**: ดูแกนหลักจาก **proximal segment** (ส่วนติดกับตัว) แล้วลากเส้นลงมา · ชิ้น distal เอียงไปทางไหน = displace ไปทางนั้น

**Direction**: medial · lateral · cranial · caudal · proximal · distal · combined (เช่น caudolateral)

⚠️ **ต้องดู 2 views** (VD + lateral) — ฟิล์มเดียวบอกได้แค่มุมเดียว!

⭐ ถ้าเคลื่อนน้อย → **non-displaced** หรือ **minimal displacement**

---

## 9.4 Open vs Closed (Level of Contamination)

**Open fracture detection**: เห็น **air opacity** บน X-ray ใต้ skin ใกล้กระดูก = สงสัยว่า open

⚠️ Open ไม่จำเป็นต้องเห็นกระดูกโผล่ — บางทีโผล่แล้วเด้งกลับเข้าไป

**Open Fracture Types** ⭐:
| Type | Detail | Mechanism |
|---|---|---|
| **Type 1** | รู < 1 cm · "**inside-out**" | ปลายแหลมกระดูกจิ้มทะลุออก · สะอาด |
| **Type 2** | รู ≥ 1 cm · "**outside-in**" | แรงกระแทกจากนอก · สกปรกขึ้น |
| **Type 3A** | รูใหญ่ + soft tissue เสียหาย แต่เย็บปิดได้ |
| **Type 3B** | รูใหญ่ + soft tissue เสียหายเยอะ + ต้องทำ flap |
| **Type 3C** ⭐ | + vascular/nerve injury → **มัก amputate** |

---

## 9.5 Anatomical Location (ตามตำแหน่ง)

| Section | Position | Subdivision |
|---|---|---|
| **Epiphysis** | หัวกระดูก (proximal + distal) | — |
| **Metaphysis** | รอยต่อระหว่าง epi-diaphysis | — |
| **Diaphysis** | ตรงกลางกระดูก (shaft) | Proximal third · Mid-diaphyseal · Distal third |

**Mixed-location names**:
- Diaphyseal · proximal third diaphyseal · mid-diaphyseal · distal third diaphyseal
- **Distal/Proximal metadiaphyseal** = หักรอยต่อระหว่าง metaphysis + diaphysis

---

## 9.6 Salter-Harris Classification ⭐⭐ (Physeal Fracture · เด็กเท่านั้น!)

⚠️ **เกิดเฉพาะเด็ก** — physis (growth plate) closed ในหมาแมวที่ ~1 ปี (ผู้ใหญ่ไม่มี physis แล้ว)

**Mnemonic จากภาพ distal femur** (กลาง-บน-ล่าง):

| Type | Location | Frequency |
|---|---|---|
| **Type 1** | Through **physis only** (กลาง) | Common |
| **Type 2** | Physis + **metaphysis** (กลาง+บน) ⭐ | Most common! |
| **Type 3** | Physis + **epiphysis** (กลาง+ล่าง) | Common |
| **Type 4** | Physis + meta- + epiphysis (ทั้ง 3 zone) | Less common |
| **Type 5** | **Crush** (compression ของ physis) | Rare · hard to see |
| **Type 6** | **Partial crush** (เฉียง) | Rare |

⭐ **ผลกระทบหลัก**: physeal damage → growth disturbance → ขาสั้น/ยืดบิด

⚠️ **Diagnosis tip**: type 5 มัก subtle → X-ray ข้างปกติเทียบเสมอ!

---

## 9.7 Cause (สาเหตุ)
- **Traumatic** ⭐ — ที่เจอบ่อยสุด (รถชน ตกที่สูง ฯลฯ)
- **Pathologic** — กระดูกผิดปกติอยู่แล้ว (มะเร็งกระดูก) → หักจากการเดินธรรมดา
- **Developmental** — ลูกสัตว์ขาดสารอาหาร · กระดูกเปราะ

---

## 10. Full Fracture Description ตัวอย่าง

> "Complete · Closed · Long oblique · Mid-diaphyseal · Traumatic fracture of left femur with **caudo-medial displacement**"

---

# 🟦 PART 3 — Pre-operative Management

## 11. Initial Patient Examination (Phase 1)

⚠️ **กระดูกหักไม่ตาย — ตรวจ life-threatening ก่อน!**

### AMPLE History
| Letter | Detail |
|---|---|
| **A**llergy | แพ้ยาอะไรมั้ย |
| **M**edications | กินยาประจำอะไร |
| **P**ast illness | โรคประจำตัว · เคยผ่าตัด |
| **L**ast meal | กินครั้งสุดท้ายเมื่อไหร่ (สำคัญสำหรับ anesthesia) |
| **E**nvironment | ไปโดนอะไรมา |

### ABCDE Vital Assessment ⭐
| Letter | System | Action |
|---|---|---|
| **A**irway | ทางเดินหายใจ | suction · intubate · emergency tracheostomy |
| **B**reathing | RR · pattern · effort | O2 · re-cate |
| **C**irculation | mucus · CRT · HR · BP | fluid · vasopressor |
| **D**isability | consciousness · response | neurological assessment |
| **E**xternal | external wound | bandage · pressure |

---

## 12. Detailed Examination (Phase 2) — A CRASH PLAN
| Letter | System |
|---|---|
| **A** | Airway |
| **C** | Cardiovascular |
| **R** | Respiratory |
| **A** | Abdomen |
| **S** | Spine |
| **H** | Head |
| **P** | Pelvis |
| **L** | Limbs |
| **A** | Arteries (vessels) |
| **N** | Nerves |

⭐ **Re-assessment เป็นระยะ** — อาการเปลี่ยนใน 15 นาทีได้!

**Add labs**: CBC · chemistry · blood gas · X-ray ตามจำเป็น

---

## 13. Soft Tissue Management

**Open fracture care** ⭐:
1. ป้องกันไม่ให้กระดูกที่โผล่แห้ง — ทาน้ำเกลือ + ปิดผ้าชุ่ม
2. **Lavage เยอะ ๆ** ล้างฝุ่น/ดิน
3. **Antibiotics**: Amoxicillin-clavulanate · cefazolin · ทำ culture ก่อนเริ่มยา
4. **Sedation/anesthesia** ถ้าเจ็บไม่ยอมให้ทำแผล
5. **Aseptic technique** เสมอ

**Don't try to push exposed bone back** ถ้าไม่มีประสบการณ์ — เพิ่ม trauma!

---

## 14. Temporary Immobilization
- **Splint / soft padded bandage** — ป้องกันปลายแหลมแทงเนื้อข้างใน
- **Cage rest** + จำกัดบริเวณ
- ⭐ **Goal**: ป้องกันไม่ให้ closed fracture กลายเป็น open!

---

## 15. Pre-op X-ray (สำคัญมาก!) ⭐

**Mandatory**:
1. **2 orthogonal views** (VD + lateral) — มิติ 3D
2. **Include adjacent joints** — รอยหักเพิ่มอาจอยู่ข้าง ๆ
3. **X-ray ข้างปกติเทียบ** — วินิจฉัย Salter-Harris ง่ายขึ้น
4. **X-ray Marker** L/R — ป้องกันผ่าผิดข้าง! ⚠️

**Calibration Ball** ⭐ (เม็ดเหล็กกลม-ขาว):
- ขนาดมาตรฐาน 2.5 cm
- ใช้คำนวณ magnification ratio ของฟิล์ม
- จำเป็นสำหรับ **TPLO · TTA · osteotomy** ที่ต้องวางแผนแม่นยำ

**CT scan** — ใช้ใน complex/comminuted/pelvic fracture

---

## 16. Pain Management ⭐

| Drug class | Examples |
|---|---|
| **Opioids** | Morphine · Fentanyl drip/patch · Methadone |
| **NSAIDs** | Carprofen · meloxicam (caution if hypotension) |
| **Local anesthesia** | Lidocaine block · epidural |

**ข้อดีของ pain control**:
- ลด stress → metabolism ดีขึ้น
- ป้องกันสัตว์ทุลนทุลาย → ป้องกัน secondary trauma
- พักผ่อนได้ดี

---

# 🟨 PART 4 — Basic Orthopedic Instruments

## 17. Instrument Recap (เห็นจริงใน Lab Sx 3)

| Instrument | Use |
|---|---|
| **Bone holding forceps** | หนีบกระดูก (10+ แบบ) |
| **Mallet** | ตอก (คู่กับ osteotome) |
| **Hohmann retractor** | งัดกระดูก |
| **Periosteal elevator** | แหวก periosteum |
| **Senn retractor** | ดึง |
| **Gelpi retractor** | เปิดแผลค้าง |
| **Bone cutter** | ตัดกระดูก |
| **SS ruler / Caliper** | วัดระยะ (สำคัญในการ planning) |
| **Cerclage wire + Wire twister + Wire cutter** | ดามด้วยลวด |
| **Plates + Screws** | ดามแผ่น (ตัวละ ~1,000 บาท!) |
| **Screwdriver** | 4 แฉก / 6 แฉก / star — ต้อง match กับ screw! ⭐ |
| **Drill bit + Drill guide + Sleeve guide** | เจาะรู screw |
| **Power drill (auto-clavable)** | สว่าน ortho เฉพาะ — แพง |

⚠️ **Wire twister ≠ Needle holder** — needle holder คอบางกว่า · ใช้ผิดพังเร็ว

---

## 📝 EXAM RECAP — 15 Key Points

1. **Bone composition**: 70% mineral (95% hydroxyapatite) + 30% organic (98% collagen) + 2% cells
2. **Stress = แรง/พื้นที่ · Strain = การเปลี่ยนรูป** (อย่าสับสน!)
3. **Stress-strain curve**: Elastic → Yield → Plastic → Ultimate Failure
4. **Young's modulus**: SS 200 · Bone < 30 · Cancellous < 5 · Cement < 3 GPa
5. **Anisotropic**: longitudinal แข็ง · transverse เปราะ
6. **Viscoelastic**: เร็วแข็ง · ช้าหวัย
7. **Bone strain tolerance < 2%** → ต้อง immobilize
8. **Loading-Pattern map**: Tension→Transverse · Compression→Oblique · Bending→Wedge · Torsion→Spiral
9. **Greenstick fracture** = pediatric incomplete (กิ่งไม้สด)
10. **Open fracture types**: 1 (<1cm inside-out) · 2 (≥1cm outside-in) · 3A/B/C (severity by tissue damage)
11. **Salter-Harris**: Type 1 (through physis) · 2 (most common, +metaphysis) · 3 (+epiphysis) · 4 (all 3) · 5 (crush) · 6 (partial)
12. **Displacement** ดูจาก proximal segment เสมอ + ต้องดู 2 views
13. **Cat fractures** ~95% เป็น comminuted (เปราะแบบไม้ไผ่)
14. **AMPLE history + ABCDE vital + A CRASH PLAN** ทุกรายก่อนผ่า
15. **Calibration ball 2.5 cm** จำเป็นสำหรับ planning ที่ต้องการความแม่นยำสูง

> 📚 อ่านควบ: 5 Oral Sx (OzV5BJrJfDc) · 6.2 ESF (LwNNZYoCpZE) · 7 External Immobilization (9cXpZwgUAPI) · 9.3 Patella Luxation (CIUpw8GNtQ4) · 12 Cruciate (9U-Dgu0ouUk) · 14 Spinal fracture (C1Q5SHxSkGw)
> 📐 ฟิสิกส์เบสิกแต่จำเป็น — ทุกหัวข้อ ortho ที่ตามมาในเทอม 1+2 จะใช้ความรู้นี้`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 5. Oral Surgical Treatment (Y4/1)
  // ─────────────────────────────────────────────────────────────
  OzV5BJrJfDc: {
    videoId: 'OzV5BJrJfDc',
    title: '5. Oral Surgical Treatment',
    subject: 'com2',
    date: '4 Sep 67',
    durationMin: 133,
    instructor: 'อ. (Dental/Maxillofacial Sx) — Sx ortho block',
    examFormat: 'MCQ — tooth fracture types · TMJ luxation direction · Salter-Harris in maxilla · 30-min/48-hr time windows · plate placement rules ออกบ่อย',
    summary: `# Oral Surgical Treatment

> 🎯 บทนี้แบ่ง 2 ส่วน:
> Part 1 = **Oral Trauma** (ฟัน · ริมฝีปาก · TMJ)
> Part 2 = **Maxilla + Mandibular Fracture**
> ⚠️ Time-critical windows สำคัญ: 30 นาที (avulsion/luxation) · 48 ชม (vital pulp therapy)

---

# 🟧 PART 1 — Oral Trauma

## 1. Classification

| Type | Detail |
|---|---|
| **Non-maxillary/mandibular** | Dental · Lip · TMJ trauma |
| **Maxillary/Mandibular** | กระดูกใหญ่หัก (ดู Part 2) |

**Common causes**: รถชน · ตกที่สูง · สู้กับสัตว์อื่น · เคี้ยวของแข็ง · เบสบอล/กอล์ฟ (ต่างประเทศ)

---

## 2. Dental (Tooth) Trauma ⭐

### 2.1 Anatomy Recap
**ฟันมีชีวิต** — สร้าง dentin ตลอด · primary dentin (ตอนเด็ก-pulp ใหญ่) → secondary dentin (โต) → **tertiary/reparative dentin** (เมื่อ damage)

### 2.2 Tooth Fracture Types ⭐⭐⭐
| Type | Visual | Detail |
|---|---|---|
| **Uncomplicated crown fracture** | รอยแตก · ไม่มีจุดแดง | ไม่ทะลุ pulp · อาจสร้าง reparative dentin (จุดน้ำตาล/ดำ) |
| **Complicated crown fracture** | รอยแตก + **จุดแดงตรงกลาง** | ทะลุ pulp → bleeding · pulp exposure |

⚠️ **Pulp exposure** → bacterial infection → pulpitis → pulp necrosis → ฟันเปลี่ยนสี (น้ำตาล/ดำ/ชมพู)

### 2.3 Treatment Options ⭐⭐⭐
| Scenario | Treatment | Time window |
|---|---|---|
| **Uncomplicated** | Monitor หรือ **dental restoration** (composite resin filling) | — |
| **Complicated, fresh** | **Vital pulp therapy** — remove pulp บางส่วน + Ca(OH)2 + restoration | **ภายใน 48 ชม.** ⭐ |
| **Complicated, late/dead** | **Root canal therapy** (endodontic Tx) — เก็บฟันเป็น structure | กัตตาเปอร์ชา (gutta-percha) ใส่ในคลอง |
| **Severe / non-restorable** | **Extraction** | always option |

### 2.4 Clinical Signs of Pulp Pain (ถามเจ้าของ)
- เคี้ยวปาก/เลียฟันบ่อย
- น้ำลายไหลเยอะ
- กินข้าวแล้วปล่อยอาหารร่วง
- เกาหน้า · ถูพื้น · หันหน้าหนีตอนถูก
- เลือกอาหารเปียกแทนเม็ด · ไม่กัดของเล่น

**Physical findings**: หน้าบวม (โดยเฉพาะใต้ตาฝั่งฟันบนติดเชื้อ) · sinus tract · submandibular LN โต

---

## 3. Tooth Luxation / Avulsion ⭐⭐

| Condition | Definition |
|---|---|
| **Luxation** | ฟันเคลื่อนแต่ยังอยู่ในเบ้า |
| **Avulsion** | ฟันหลุดจากเบ้าหมด |

**Treatment** ⭐:
| Time | Action |
|---|---|
| **< 30 นาที** ⭐⭐ | Reposition + splint (acrylic/wire) × 1-2 สัปดาห์ |
| **> 30 นาที** | Extraction (เก็บไม่ได้แล้ว) |

⚠️ Avulsion มักมี gum laceration → suture closure ด้วย

---

## 4. Lip Trauma

### 4.1 Lip Laceration
- เย็บปิด **full-thickness** (4 ชั้น): skin · subcutis · mucosa · oral mucosa
- ใช้ **flap closure**

### 4.2 Lip Avulsion ⭐ (พบในแมว)
**Mechanism**: skin-mucosa ลอกออกจากกระดูกเหมือนถลอกถุงเท้า · มักทั้ง lower lip

**Treatment** = **Suture + Wiring technique** ⭐:
1. Stabilize vital signs ก่อน (อาจวางยาไม่ได้วันแรก)
2. กระดูก expose → ปิดกระดูกให้ชุ่มชื้น (bandage)
3. **เจาะรูกระดูกระหว่างฟัน** (ระวัง! ห้ามโดนฟัน)
4. ผ่าน suture/wire ผ่านรูเพื่อยึด lip กลับขึ้นไปที่กระดูก

---

## 5. TMJ Trauma ⭐⭐⭐

### 5.1 Clinical Picture
- **ปากเบี้ยว** (asymmetric)
- ปิดปากไม่สนิท / เปิดปากไม่สุด
- เคี้ยวอาหารลำบาก
- Wound จากฟันทิ่มเหงือก/เพดาน (chronic case)

### 5.2 Differential Diagnosis (ปากเบี้ยว)
| Dx | Clue |
|---|---|
| **TMJ luxation** ⭐ | เพิ่งเกิด · acute |
| **TMJ subluxation** | mild · ปิดปากไม่สนิทแต่ไม่เบี้ยวมาก |
| Mandibular fracture | กระดูกหัก-ยุบ |
| TMJ dysplasia | developmental |
| **TMJ ankylosis** ⭐ | chronic · เปิดปากแคบ < 1-2 cm |
| Foreign body | หินปูนหนาก็เบี้ยวได้! |
| Periodontal disease | เรื้อรัง |
| Trigeminal neuropathy | nerve issue |

### 5.3 Direction Logic ⭐⭐ (สำคัญ-ออกสอบ!)

**Bilateral luxation** → กรามล่างเลื่อนมา **ด้านหน้า** ทั้งคู่

**Unilateral luxation**:
| Direction | ปากเบี้ยวไป |
|---|---|
| **Rostral** (มาด้านหน้า) | **ฝั่งตรงข้าม** ของฝั่งหลุด |
| **Caudal** (ไปด้านหลัง) | **ฝั่งเดียวกัน** กับฝั่งหลุด |

⭐ **Memorize**: rostral = opposite · caudal = same side

### 5.4 Imaging
**X-ray normal**: caudal process รูปรีวางอยู่บนเบ้า, symmetric
**Luxation**: condyle ลอยออกจากเบ้า

⚠️ **CT scan** = gold standard for TMJ (ไม่งั้น duplicate กัน)

### 5.5 Treatment

| Approach | Indication |
|---|---|
| **Closed reduction** | TMJ luxation (no fracture) |
| **Open reduction** | Reduction ไม่ได้ · มี soft tissue ขวาง · มี fracture ของ condyle |
| **Condylectomy** ⭐ | Condylar fracture → ตัด condyle ออก · กล้ามเนื้อรอบ ๆ จะ support · risk = TMJ ankylosis ในอนาคต |

**Closed Reduction Technique**:
- Anesthesia + sternal recumbency
- ใส่ดินสอ/ไม้นิ่มเป็น **fulcrum** ตำแหน่งหลัง M1 ล่าง + หลัง upper P4
- ค่อย ๆ ปิดปาก → fulcrum สไลด์ condyle กลับเข้าเบ้า

⚠️ **ห้าม reduce ถ้า condyle หัก** — จะทำให้แย่ลง + เกิด ankylosis

### 5.6 Post-reduction Restriction (6-8 สัปดาห์) ⭐
| Method | Detail |
|---|---|
| **Tape muzzle** | เปิดช่อง 1-1.5 cm ให้เลียกินได้ · ไม่ใช้ใน mandibular Fx ที่ + maxilla (เพราะกด Mx) |
| **Interdental composite splint** | acrylic เชื่อมเขี้ยวบน-ล่าง |
| **Wiring** (interdental) | ลวดร้อยฟันกรามบน-ล่าง |
| **Labial reverse suture to button** | กระดุมที่หน้า + suture ใต้คาง — ดีกว่า muzzle |

---

# 🟪 PART 2 — Maxillary + Mandibular Fracture

## 6. Anatomy Recap

### 6.1 Maxilla
- เกือบเสมอ involve **incisive bone** + บางครั้ง zygomatic, lacrimal, frontal, nasal
- **PR maxillary fracture** = หักก่อนถึง maxilla proper · มัก wiring repair

### 6.2 Mandible — 7 Sections ⭐
| Section | Description |
|---|---|
| **Symphysis** | ตรงกลาง — fibrous tissue (NOT bone!) → เรียก "mandibular symphyseal **separation**" ไม่ใช่ fracture |
| **Parasymphyseal** | ใกล้ symphysis |
| **Rostral** | บริเวณ incisor + premolar |
| **Lateral / Body** | premolar 2 ถึง molar 1 |
| **Caudal** | หลัง molar |
| **Ramus** | ส่วนตั้ง |
| **Condylar (TMJ)** | (ดู Part 1) |

### 6.3 Inside Mandible (ห้ามลืม!)
- **2/3 dorsal** = ฟัน (รากฟัน)
- **1/3 ventral** = **mandibular canal** = inferior alveolar artery + vein + nerve

⚠️ **Plate ต้องวาง ventral surface** เพื่อหนีรากฟัน · ระวัง screws ไม่ให้โดนฟัน + canal

---

## 7. Causes

| Cause | Detail |
|---|---|
| **Traumatic** | รถชน · กัด · ตี · กระทบกระแทก |
| **Pathologic** ⭐ | Severe periodontitis (สุนัขพันธุ์เล็ก!) · neoplasia · osteomyelitis · iatrogenic จาก extraction (หมอออกแรงมากเกิน!) |

⭐ **Pathologic fracture** ในสุนัขพันธุ์เล็ก = mandible เล็ก-ฟันใหญ่ → cortical bone บาง → หักง่าย

---

## 8. Diagnosis

### 8.1 Signalment + History
- อายุน้อย → traumatic เน้น
- อายุเยอะ → คิดถึง pathologic (cancer · periodontitis)
- สุนัขพันธุ์เล็กแก่ → severe perio + pathologic Fx

### 8.2 Examination
- คลำ symmetric เปรียบเทียบซ้าย-ขวา
- เปิด-ปิดปาก · เสียง crepitus
- ตรวจปากด้วยนิ้ว ดู gum tear (= bone exposed → infection risk!)
- **GA จำเป็น** ในการ exam ละเอียด

### 8.3 Imaging
| Modality | Use |
|---|---|
| **Conventional X-ray** (DV/VD + open-mouth lateral) | First-line |
| **CT scan** ⭐ | Maxilla · TMJ · condylar fx · complex fractures |
| **Dental X-ray** | Concurrent dental trauma |

---

## 9. Fracture Patient Assessment Score ⭐ (เลือกวิธี Tx)

| Score component | Detail |
|---|---|
| **Mechanical** | Pattern (simple > comminuted) · displacement |
| **Biological** | Age · health · concurrent disease · time since injury |
| **Clinical** | Owner compliance · home care |

| Total Score | Treatment recommendation |
|---|---|
| **High** | Conservative — tape muzzle · interdental composite |
| **Moderate** | Inter-fragmentary wiring · ESF · plate-and-screw |
| **Low** | ESF only (last resort) |

---

## 10. Treatment Options ⭐⭐⭐

### 10.1 Conservative
| Method | Use |
|---|---|
| **Tape muzzle** | TMJ luxation, mandibular fx (NOT for Mx + Md fx!) |
| **Dental composite bonding** | Acrylic ครอบฟัน — non-displaced fx + maxillary fx |
| **Interdental composite splint** | เคี้ยวบน-เคี้ยวล่างเชื่อม acrylic |

### 10.2 Surgical — Internal Fixation
| Method | Indication |
|---|---|
| **Orthopedic wire / Cerclage wire** | Simple fx, low cost |
| **Inter-fragmentary wiring** ⭐ | เจาะรูห่าง fx line 5-10 mm · ผ่าน wire mass |
| **Interdental wiring** | ร้อยลวดผ่านฟัน 2 ซี่ขึ้นไป (เหมือนจัดฟัน) |
| **Plate and screw** ⭐⭐ | Strongest · "**mini plate**" 3-4 mm · vent surface ⭐ |
| **Locking plate** | Better stability than non-locking |

⚠️ **IM Pin ห้ามใช้ใน mandible** — โดนฟัน + canal (เคยมีในอดีต)

### 10.3 Surgical — External Fixation
- Type 1, Type 2 ESF
- **Acrylic connecting bar** (แทน metal bar)
- ⚠️ **Last resort** เพราะดูแลยาก-เลอะอาหาร

---

## 11. Mandibular Symphyseal Separation ⭐

**Why "separation" not "fracture"**: symphysis = fibrous tissue (ไม่ใช่กระดูก-กระดูก)

**Treatment**: **Cerclage wire** รวบหลังเขี้ยว → ผูกปมใต้คาง · 6-8 สัปดาห์ → **ต้องเอาลวดออก** (ไม่งั้นเกิด osteomyelitis · เคยเจอเคส 2 ปี)

---

## 12. Palatal Fracture ⭐

**Mechanism**: **High-rise syndrome** ในแมว — ตกที่สูง หน้าฟาดตรง ๆ → cortical bone ของ hard palate แตกตามแนวกลาง

⭐ มักพ่วงกับ **mandibular symphyseal separation** (แตกแนวเดียวกัน บน-ล่าง)

**Treatment**: Wiring เขี้ยวบนซ้าย-ขวาเข้าหากัน → บีบ palate ชิด หรือ open wiring ตำแหน่งที่หัก

---

## 13. Plate Placement Rules (Mandibular Fx) ⭐⭐⭐

| Fracture pattern | Recommended fixation |
|---|---|
| **Transverse Fx** | Plate ventral + interdental wiring บน |
| **Oblique Fx** | Inter-fragmentary wiring → plate ทับ |
| **Ramus Fx** | Plate ที่ลัส (lateral) |
| **Comminuted Fx** | 2 plates (ventral + dorsal) |

⚠️ **Pharyngotomy / oropharyngeal intubation** ⭐ — สอด ET tube ผ่านท่อ ขึ้นด้านหลัง mandible (ไม่ผ่านปาก) เพื่อเช็ค **dental occlusion** ระหว่างผ่า

---

## 14. Post-op Care (4-12 wks)

| Action | When |
|---|---|
| **X-ray** | 1 เดือน = check alignment + device · > 1 เดือน = check healing |
| **Dental occlusion check** | Every visit ⭐ |
| **Suture removal** | 2 wks |
| **Tape muzzle** | Add for extra immobilization (ระวัง skin infection · ทำใหม่ทุกวัน) |
| **Soft food only** + งดของเล่นกัดแทะ | จนกว่าจะ heal |
| **Esophagostomy tube** | Severe case · ไม่ใช้ NG tube > 1 เดือน |
| **Chlorhexidine oral rinse** | 2x/day ถ้ามี oral wound |

---

## 15. Complications ⭐

| Complication | Detail |
|---|---|
| **Malocclusion** ⭐⭐ | **Most common serious** complication · ตามด้วย TMJ arthritis · fractured teeth · periodontitis · → **extraction หรือ ostectomy** แก้ |
| **Osteomyelitis + Bone sequester** | Implant infected · comminuted fragment ตาย → remove implant + culture + antibiotics |
| **Non-union** | Inappropriate stabilization OR pathologic Fx OR poor health → **bone graft** + growth factor |

---

## 16. 4 Keys for Success ⭐
1. **Early fixation**
2. **Stabilize systemic + mental health** (ไม่ใช่แค่กระดูก!)
3. **Nutritional support** (healing requires nutrition)
4. **Pain management** + soft tissue care

---

## 📝 EXAM RECAP — 18 Key Points

1. **Tooth fracture**: Uncomplicated (no pulp) vs Complicated (red dot = pulp exposure)
2. **Vital pulp therapy** = **48 ชม.** · Tooth avulsion/luxation reposition = **30 นาที** ⭐
3. **Reparative dentin** = จุดน้ำตาล-ดำ ตรงกลางฟัน = ร่างกายซ่อมเอง
4. **Lip avulsion** ในแมว → suture + wiring (เจาะรูกระดูกระหว่างฟัน, ห้ามโดนฟัน)
5. **TMJ luxation direction**: rostral = ปากเบี้ยวฝั่งตรงข้าม · caudal = เบี้ยวฝั่งเดียวกัน
6. **Bilateral TMJ luxation** = เลื่อนรอสตรัล (มาหน้า) ทั้งคู่
7. **Closed reduction TMJ** = ใช้ดินสอ/ไม้เป็น fulcrum หลัง M1 ล่าง + P4 บน
8. **ห้าม reduce** ถ้า condyle หัก → **condylectomy** แทน
9. **Tape muzzle** = ห้ามใช้ใน maxilla + mandible Fx (กด maxilla)
10. **Mandibular symphysis** = fibrous tissue → "separation" ไม่ใช่ "fracture"
11. **Symphyseal cerclage** = 6-8 wks · **ต้องเอาออก** (ไม่งั้น osteomyelitis)
12. **Plate placement** = ventral surface (หนีรากฟัน) · screws หลีกรากฟัน
13. **IM pin ห้ามใช้ใน mandible** (โดน canal + ฟัน)
14. **Pathologic Fx** = สุนัขพันธุ์เล็กแก่ + perio · cancer · iatrogenic
15. **Palatal Fx** = high-rise syndrome ในแมว · มักพ่วง symphyseal separation
16. **Pharyngotomy intubation** = สอด ET ข้าม mandible เพื่อเช็ค occlusion ระหว่างผ่า
17. **Most common complication** = **malocclusion** → arthritis · fracture · perio
18. **Post-op X-ray timing**: 1 เดือน = device check · > 1 เดือน = healing check

> 📚 อ่านควบ: 1 Basic Fracture (xy6nxu6Sduc) · 6.1 Muscle/tendon (BLk5OjwlduA) · 7 External immobilization (9cXpZwgUAPI) · 11 Common Joint (MMTtwT_7c94)
> 🦷 หัวข้อนี้ overlap กับ COM 1 oral cavity (ปี 3) — ใช้ความรู้ dental anatomy เดิม`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 6.1 Muscle and Tendon Disorders (Y4/1)
  // ─────────────────────────────────────────────────────────────
  BLk5OjwlduA: {
    videoId: 'BLk5OjwlduA',
    title: '6.1. Muscle and tendon disorders',
    subject: 'com2',
    date: '11 Sep 67 (รุ่นพี่)',
    durationMin: 38,
    instructor: 'พี่ (อาจารย์รุ่นพี่)',
    examFormat: 'MCQ — Quad contracture · Achilles plantigrade · suture choice for tendon · grade-based treatment',
    summary: `# Muscle and Tendon Disorders

> 🎯 บทเสริม ortho — soft tissue ที่อยู่รอบกระดูก (กล้ามเนื้อ + เส้นเอ็น) เสียหายได้พอกัน
> ⚠️ Top 3 keywords ที่ออกสอบ: **Quadriceps contracture · Achilles tendon · Bicipital tendinosis**

---

# 🟧 PART 1 — Muscle Disorders

## 1. Spectrum of Damage

| Stage | กลไก | Detail |
|---|---|---|
| **Strain** | หด-เกร็ง | Office syndrome · ออกกำลังเบา ๆ |
| **Contusion** | กระแทก-ช้ำ | Blunt trauma |
| **Rupture** | ฉีกขาดของ Muscle Fiber | บางส่วนของมัด |
| **Laceration** | ฉีกขาดทั้งมัด | Severe |

## 2. Muscle Damage Grade (1-4) ⭐

| Grade | Damage | Treatment |
|---|---|---|
| **Grade 1** | Few Muscle fibers | **Rest + NSAIDs** + cold pack 48 hr |
| **Grade 2** | More fibers, mild bleeding | Rest + medical |
| **Grade 3** | Many fibers + hematoma + fascia tear | **Surgical repair** |
| **Grade 4** | **Whole muscle belly rupture** | Surgical repair |

⭐ **48-hour rule**: cold pack first 48 hr → switch to **warm pack 50-60°C** (อย่าร้อนจนหนังลอก!)

## 3. Common Muscle Causes
- **Blunt trauma** (รถชน · ตก) → กระดูกหัก + Muscle damage รอบ ๆ
- **Overuse** (Office Syndrome · นักกีฬา · หมาวิ่งกีฬา)
- **Iatrogenic** (จากการผ่าตัด)

---

## 4. Quadriceps Contracture ⭐⭐⭐ (KEY TOPIC!)

> "**Quadriceps contracture**" — ภาวะกล้ามเนื้อหดเกร็งหลัง trauma · กลายเป็น fibrotic myopathy

### 4.1 Pathogenesis
1. **Trauma หรือ femoral fracture** (โดยเฉพาะ distal femoral / Salter-Harris ในเด็ก!)
2. กล้ามเนื้อหดตัวพยายามรักษาตัวเอง
3. หากปล่อย → **fibrosis + scar tissue** → กล้ามเนื้อหดถาวร
4. เห็น **ขาเหยียดตรง · เกร็ง · ใช้งานไม่ได้**

### 4.2 Predisposing Factors ⭐
- **สุนัข/แมวเด็ก** (กระดูกยังพัฒนาอยู่)
- **Distal femoral fracture** หรือ **Salter-Harris** type
- **Delayed fixation** (ปล่อยไว้นาน)
- **Long-term immobilization** ในเฝือกแข็งโดยไม่ขยับ

### 4.3 Prevention ⭐⭐⭐ (ป้องกันดีกว่าแก้!)
1. **Early surgical fixation** — ผ่าตัดเร็วที่สุด!
2. **Modified Robert Jones bandage** (NOT splint แข็ง) ในระหว่างรอผ่า
3. **Early rehabilitation** — กระตุ้น Range of Motion + weight-bearing เร็ว

### 4.4 Treatment (ถ้าเกิดแล้ว · ผลลัพธ์ไม่ 100%)
- **Rehabilitation** — physical therapy
- **Z-plasty** — กรีด fibrous tissue เป็นรูป Z เพื่อยืดออก (แต่บางตัว reaction → fibrosis กลับมาอีก!)
- **Joint fixation** — fix joint ใน position ที่ functional ที่สุด

⭐ **Bottom line**: รักษาแล้วดีขึ้น แต่ไม่ 100% — **defense คือ prevention**

---

## 5. Other Muscle Disorders (Mention)

| Disease | Detail |
|---|---|
| **Myositis ossificans** | Calcification ในกล้ามเนื้อหลัง severe trauma · von Willebrand · tumor-associated · Tx = palliative resection |
| **Infectious myositis** | Parasites · bacterial — common in Thailand! |
| **Myasthenia gravis** | Muscle weakness — neurologic disease |

---

## 6. Muscle Healing Phases ⭐

| Phase | ทำอะไรได้ |
|---|---|
| **Inflammation** | Rest only · ultrasound therapy ลด inflammation ได้ |
| **Repair** | Rest only |
| **Remodelling** ⭐ | **เริ่ม weight-bearing rehab!** กระตุ้น remodelling |

⭐ ขนาด **Gap** มีผลต่อ scar tissue:
- Gap แคบ → scar น้อย
- Gap กว้าง + hematoma → scar มาก → fibrosis

---

## 7. Suture Choice for Muscle ⭐

| Property | Choice |
|---|---|
| **Pattern** | **Mattress suture** (ทนแรงตึงดี) |
| **Material** | **Long-term absorbable monofilament** (PDS/Maxon · Polydioxanone) |
| **Layer** | เย็บ **fascia ทับ** (Strength อยู่ที่ fascia) — ถ้าฟาเชียเสีย = เย็บ muscle ตรง ๆ |

---

# 🟪 PART 2 — Tendon Disorders

## 8. Tendon Background
- **Composition**: คอลลาเจนเป็นหลัก (เหมือนเนื้อตุ๋น!)
- **Vascularity**: ต่ำ → **healing ช้า**

## 9. Healing Timeline ⭐⭐⭐ (สำคัญ-เลือก suture!)
| Time | Process |
|---|---|
| **21 วัน** | เริ่มกระบวนการซ่อมแซม |
| **~1 ปี** | Healing complete |

⭐ **Suture choice = Non-absorbable!**
- **Polypropylene (Prolene)** ⭐ = **Truly non-absorbable** — ดีที่สุด
- **Nylon** = น้อยกว่า Prolene · แต่ยังใช้ได้ในคลินิกเล็ก ๆ
- ❌ Absorbable — แม้ long-term ก็ยังเสีย tensile strength ก่อน 1 ปี

---

## 10. Achilles Tendon Disorder ⭐⭐⭐

### 10.1 Anatomy
- **Aris tendon** = Achilles tendon = N เอ็นร้อยหวาย
- ขาหลัง บริเวณ tarsus

### 10.2 Clinical Signs
| Stage | Sign |
|---|---|
| **Acute** | เจ็บ · lameness |
| **Chronic** ⭐ | **Plantigrade walk** — เดินเอาขาตรงแตะพื้นทั้งหมด · ไม่เจ็บแล้ว แต่เดินผิดรูปถาวร |

### 10.3 Treatment
| Severity | Tx |
|---|---|
| **Partial rupture** | Medical (rest · NSAIDs · splint) |
| **Complete rupture** ⭐ | **Surgical repair** with non-absorbable suture |

### 10.4 Suture Patterns ⭐ (ต้องจำได้)
| Pattern | Use |
|---|---|
| **Three-loop pulley** | High strength |
| **Krackow suture** | High strength · locking |
| **Bunnell suture** | Old standby |
| **Locking-loop (Kessler)** | Variation |

⭐ **อาจารย์ใช้บ่อย**: ฟาเซียเย็บ + locking pattern · ข้อสอบอาจถามรูปแบบ

---

## 11. Bicipital Tendinosis ⭐ (ขาหน้า · หัวไหล่)

### 11.1 Pathology
- **Bicipital tendon** ที่หัวไหล่ (origin ของ biceps brachii)
- เกิด inflammation จาก **overuse**
- เจอบ่อยใน: **Doberman · Golden · Labrador**

### 11.2 Clinical Signs
- เจ็บขาหน้า · bobbing gait (ยกหัวเวลาลงน้ำหนัก)
- เกร็งหัวเวลาลงน้ำหนักขานั้น
- **Stretch test** — ยืดขา + กดเข้าที่ tendon = bicipital pain

### 11.3 Diagnosis
| Method | Detail |
|---|---|
| **Walk test** → localize | เจ็บขาหน้า → หัวไหล่ |
| **Stretch test** | กดที่ bicipital tendon → เจ็บกี๊ด |
| **Skyline radiograph** | เห็น mineralization (chronic only) |
| **Arthroscopy** ⭐ | Gold standard — เห็น tear/inflammation ชัดเจน |

### 11.4 Treatment
- **Medical**: NSAIDs + rest (most cases)
- **Surgical**: **Tenotomy** (ตัด tendon) — ถ้า medical ไม่หาย · มีผลกระทบ ROM ในอนาคต

---

## 12. Other Tendon (Mention)
- **Infraspinatus contracture** — ขาหน้า · เจอน้อย

---

## 13. Post-op Tendon Care
1. **Pain management** (continued)
2. **Immobilization phase** — splint/cast
3. **Gradual weight-bearing** — กระตุ้น remodelling
4. **Rehab** — ROM exercises เมื่อเข้า remodelling phase

---

## 📝 EXAM RECAP — 12 Key Points

1. **Muscle damage 4 grades**: 1-2 = medical · 3-4 = surgical
2. **48-hr rule**: cold pack 48 hr → warm pack 50-60°C
3. **Quadriceps contracture** = สุนัขเด็ก + femoral Fx + delayed fixation → fibrotic myopathy
4. **Quad contracture prevention** = early Sx + Modified Robert Jones (NOT cast) + early rehab ⭐
5. **Quad contracture Tx not 100%** — defense = prevention
6. **Myositis ossificans** = calcification in muscle หลัง trauma
7. **Muscle suture**: Mattress + long-term absorbable monofilament + fascia layer
8. **Tendon healing 21 d → 1 yr** → must use **non-absorbable suture**
9. **Polypropylene > Nylon** for tendon (truly non-absorbable)
10. **Achilles rupture** → **plantigrade walk** (chronic) ⭐
11. **Suture patterns for tendon**: Three-loop pulley · Krackow · Bunnell · Kessler
12. **Bicipital tendinosis** → predisposing breeds Dobermann/Golden/Lab · arthroscopy = Dx of choice

> 📚 อ่านควบ: 1 Basic Fracture (xy6nxu6Sduc) · 6.2 ESF (LwNNZYoCpZE) · 7 External Immobilization (9cXpZwgUAPI) · 12 Cruciate (9U-Dgu0ouUk)
> 🩻 หมายเหตุ — บทนี้แค่ 38 นาที · เอาให้จำ Quad contracture + Achilles plantigrade + non-absorbable suture for tendon ก็ผ่าน`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 6.2 External Skeletal Fixation (Y4/1)
  // ─────────────────────────────────────────────────────────────
  LwNNZYoCpZE: {
    videoId: 'LwNNZYoCpZE',
    title: '6.2. External skeletal fixation (ESF)',
    subject: 'com2',
    date: '11 Sep 67',
    durationMin: 81,
    instructor: 'อ. (Internal/External fixation)',
    examFormat: 'MCQ — ESF type 1A/1B/2/3 · pin sequence · indications/contraindications · post-op pin removal sequence ออกบ่อย',
    summary: `# External Skeletal Fixation (ESF)

> 🎯 **ESF = "ลูกครึ่ง"** ระหว่าง internal และ external fixation
> ครึ่งนึงอยู่ในร่างกาย (pin), ครึ่งนึงอยู่นอก (bar + clamp)
> ⚠️ Top exam: **Type 1/2/3 classification · pin insertion sequence · removal sequence**

---

## 1. ESF Components (3 ส่วนหลัก) ⭐⭐⭐

| Component | Function |
|---|---|
| **Fixation Pin** | เสียบทะลุกระดูก (cortex 2 ฝั่ง) · คล้าย IM pin |
| **Connecting Bar** | "ไม้เท้า" — รับน้ำหนักแทนกระดูกหัก · ขนานกับ long bone |
| **Fixation Clamp** (Linkage Device) | น็อต-ยึดระหว่าง pin กับ bar |

---

## 2. Pin Types ⭐

| Type | Strength | Hold |
|---|---|---|
| **Smooth pin** | สูง (ไม่มีร่อง) | ต่ำ |
| **Threaded pin (full)** | ต่ำ (Weak Point ที่ thread) | สูง (ล็อคเหมือนน็อต) |
| **Mid-thread / Tip-thread / Both-thread** | กึ่งกลาง | ที่ thread = ที่ติด bone |

⭐ Threaded ที่ตำแหน่ง bone = ป้องกัน pin หลุด-เลื่อน

---

## 3. Pin Diameter Rule ⭐
- **ESF pin** = **1/4 ของเส้นผ่านศูนย์กลางกระดูก** (เล็กกว่า IM pin)
- **IM pin** = 65-80% ของ diameter
- เหตุผล: ESF ใช้หลายพินจึงเล็กลงได้

---

## 4. ESF Classification ⭐⭐⭐ (จำให้แม่น!)

### 4.1 Type 1 (Half Pin Splintage = ทะลุ skin 1 ด้าน, cortex 2 ด้าน)

| Subtype | Configuration | Description |
|---|---|---|
| **Type 1A** | Unilateral · Uniplanar | 1 bar, 1 ระนาบ — half pin splintage 1 ชุด |
| **Type 1B** | Unilateral · Biplanar | 2 bars, 2 ระนาบ (2 ทิศ) — เสริม stability |

### 4.2 Type 2 (Full Pin Splintage = ทะลุ skin 2 ด้าน, cortex 2 ด้าน)

| Subtype | Description |
|---|---|
| **Maximum Type 2** ⭐ | **ทุก pin** ทะลุทั้ง 2 ฝั่งของ skin + cortex |
| **Minimal Type 2** | เฉพาะ pin บนสุด-ล่างสุดทะลุ 2 ฝั่ง · ที่เหลือทะลุด้านเดียว |

### 4.3 Type 3 (Bilateral · Biplanar/Multiplanar)

- **Mix ของ Type 1 + Type 2** = multiple planes
- **Circular ESF** (วงกลม) — ใช้ใน complex fracture / limb lengthening
- เสียบ 360 องศา / multiple directions

⚠️ **Type 3 = "ลูกผสม"** — Type 1 + Type 2 ในตัวเดียว

### 4.4 Tie-In Configuration ⭐
- **ESF + IM pin** = "**Type Tie-in**"
- Hybrid for additional stability

---

## 5. Indications ⭐
| Indication | Note |
|---|---|
| **Open fracture** ⭐ (compound Fx) | Top indication — minimize foreign material in wound |
| **Gunshot fracture** | Multiple/comminuted from ballistic trauma |
| **Bone reconstruction / osteotomy** | Correct malunion, deformity, limb lengthening |
| **Comminuted fracture** | Close reduction + ESF (no need to open!) |
| **Stable + Unstable fracture** | ใช้ได้ทุกแบบ |
| **Delayed/Non-union** | ⚠️ ต้อง curette + remove fibrous + freshen bone ก่อน |
| **Joint arthrodesis** | (rare use) |

---

## 6. Contraindications ⭐
- ❌ **Articular fracture** — joint surface · ใช้ screw/plate แทน
- ❌ **Femoral neck/condylar fracture** — ใช้ screw/locking plate
- ❌ **Pelvis** — ใช้ wire/plate
- ❌ **Spinal fracture** — ใช้ "**Pedicle screw**" (ดูเหมือน ESF แต่ฝังใน)

---

## 7. Reduction Methods ⭐

| Method | When |
|---|---|
| **Close reduction** ⭐ | Fresh fracture < 1 week (Golden Period 2-5 days) — ไม่เปิด, preserve periosteum, ไม่เสีย vascular supply → healing เร็ว |
| **Open reduction** | Old fracture (>2-4 weeks) — มี fibrous tissue หุ้ม fracture line → ต้อง curette + freshen bone + อาจต้องใส่ bone graft |

⭐ **ทำไม close ดีกว่า**: รักษา periosteum + soft tissue blood supply

---

## 8. Pin Insertion Rules ⭐⭐

### 8.1 Pin Direction
- เลี่ยงกล้ามเนื้อมัดใหญ่
- แทงผ่านบริเวณที่ muscle น้อย (medial บ่อย)
- **อย่าโยก** → จะทำให้รูกว้าง → pin หลวม

### 8.2 Critical Rules ⭐⭐⭐
1. **Cortex 2 ฝั่งต้องทะลุเสมอ** (ไม่ว่า half pin / full pin)
2. **อย่างน้อย 2 pins ต่อ fragment** (ขั้นต่ำ = บน 2 + ล่าง 2)
3. **Clamp อยู่ห่างจาก skin ~1 cm**
   - ใกล้ไป → กดสกินช้ำ → necrosis
   - ห่างไป → ไม่ stable

---

## 9. Pin Insertion Sequence ⭐⭐⭐ (สำคัญมาก!)

> **กฎ**: **บนสุด-ล่างสุด → ใกล้ Fx Line → ตรงกลาง**

| Step | Pin position | เหตุผล |
|---|---|---|
| **1st (pins 1, 6)** | **บนสุด + ล่างสุด** | Anchor ที่ spongy bone (epiphysis) — แน่นที่สุด · กำหนด **bone length** |
| **2nd (pins 3, 4)** | **ใกล้ Fx line** (ห่าง = ½ diameter) | ควบคุม fracture alignment ⭐ |
| **3rd (pins 2, 5)** | **ตรงกลาง** (ถ้าใส่เพิ่ม) | ความยาวกระดูก + รับน้ำหนักเพิ่ม |

⚠️ **ห้ามใส่ pins 3, 4 ห่าง Fx เกินไป** — fragment จะเอียง / ไม่ชน

⚠️ Fixation clamps ต้องใส่ครบจำนวนตั้งแต่แรก (จะแทรกทีหลังไม่ได้)

---

## 10. Acrylic Bar (ลด cost!) ⭐ (Thai context)

**Problem**: หมาไทย-แมวไทย กัด bar ราคา 5,000-10,000+ บาท พังหมด

**Solution**:
1. แทง pin + ใส่ standard bar + clamp
2. ใส่ท่อพลาสติก / cuff รอบ pin
3. **ใส่ epoxy / acrylic แทน connecting bar**
4. รออะคริลิคแข็ง 10-30 นาที
5. **ถอด standard bar + clamp ออก** → คืนของแพง
6. เหลือแค่ pin + acrylic bar ติดตัวสุนัข

⭐ ของเมืองนอก = ใส่ standard bar ทิ้งไว้ → ถอดคืนได้เงิน · ของไทย = acrylic ถูกกว่า

---

## 11. Post-op Care ⭐

| Action | Timing |
|---|---|
| **Antibiotics** | 4-7 วัน |
| **Bandage rotation** (โคแบน/สำลีพันรอบ pin) | ทุก 2-3 วัน |
| **Wound care** (ทาเบตาดีนตรงรูพิน) | ทุกวัน |
| **E-collar** | ถ้าเลีย |
| **Recheck + X-ray** | ทุก 3-4 สัปดาห์ |
| **Limit activity** | ตลอด |

---

## 12. Pin Removal Sequence ⭐⭐⭐ (ทยอยถอด - REVERSE!)

> **กฎ**: ถอดในลำดับ **ตรงข้าม** กับการใส่ — ใส่ก่อน ถอดทีหลัง

| Stage | Time | Pins removed | Healing % |
|---|---|---|---|
| **Stage 1** | ~1 เดือน | **Pins 2, 5** (ตรงกลาง) | 30-50% |
| **Stage 2** | 1.5-2 เดือน | **Pins 3, 4** (ใกล้ Fx) | 60-70% |
| **Stage 3** | เมื่อ healing > 80% | **Pins 1, 6** (บน-ล่าง) — anchor pins | 80-100% |

⭐ **ทำไม "ทยอย"**: ลด structural support ทีละน้อย → load shifts to bone → กระตุ้น callus formation + healing

---

## 13. After Final Pin Removal — **Splint 2 Weeks!** ⭐

⚠️ **Pin holes = Weak Points** ของกระดูก
- หมาตื่นมา → กระโดด → fracture ที่รูพิน!
- ใส่ **splint** หรือ confine 2 wk เพื่อให้ pin holes heal

---

## 14. Bone Healing Type — ESF vs Plate ⭐
| Method | Healing |
|---|---|
| **Plate + screw** (rigid) | **Primary bone union** — direct healing, NO callus |
| **IM pin / ESF / Cast / Splint** | **Secondary bone union** — callus formation → remodeling |

---

## 📝 EXAM RECAP — 16 Key Points

1. **ESF = 3 components**: Pin · Connecting Bar · Fixation Clamp
2. **Pin diameter = 1/4 ของ bone diameter** (เล็กกว่า IM pin 65-80%)
3. **Type 1A** = Unilateral Uniplanar (1 bar, 1 plane)
4. **Type 1B** = Unilateral Biplanar (2 bars, 2 planes)
5. **Type 2 Maximum** = ทุก pin ทะลุ 2 ด้าน · **Minimal** = เฉพาะ top + bottom
6. **Type 3** = Bilateral Biplanar / multiplanar (Type 1 + 2 mix · Circular ESF)
7. **Tie-in** = ESF + IM pin combined
8. **Indications**: Open Fx ⭐ · gunshot · bone recon · comminuted · delayed/non-union
9. **Contraindications**: articular Fx · femoral neck · spine (use pedicle screws) · pelvis
10. **Close reduction within 5-7 days** = Golden period (preserve periosteum)
11. **Pin insertion sequence**: 1st = top + bottom (anchor + bone length) · 2nd = near Fx (alignment) · 3rd = middle ⭐
12. **Pin tips**: cortex 2 ฝั่งทะลุเสมอ · clamp อยู่ห่าง skin 1 cm · อย่างน้อย 2 pin/fragment · อย่าโยกตอนแทง
13. **Acrylic bar** = ทดแทน standard bar (ลด cost ในไทย)
14. **Pin removal REVERSE order**: 2,5 → 3,4 → 1,6 (top-bottom anchor ออกท้ายสุด)
15. **Splint × 2 weeks หลังถอด pin** = ป้องกัน fracture ที่ pin holes
16. **ESF heals via secondary bone union** (callus) — different from rigid plate (primary union)

> 📚 อ่านควบ: 1 Basic Fracture (xy6nxu6Sduc) · 7 External Immobilization (9cXpZwgUAPI) · 12 Cruciate (9U-Dgu0ouUk) · 14 Spinal Fracture (C1Q5SHxSkGw)
> 🦴 ESF เป็นเทคนิค flexible ที่สุด — ทุก fracture ตั้งแต่ open compound ถึง limb lengthening ใช้ได้
> ⚠️ Pin removal sequence ออกสอบบ่อย — จำลำดับ "บน-ล่าง = ออกสุดท้าย"`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 7. External Immobilization + Fracture Complications (Y4/1)
  // ─────────────────────────────────────────────────────────────
  '9cXpZwgUAPI': {
    videoId: '9cXpZwgUAPI',
    title: '7. External Immobilization + Complications',
    subject: 'com2',
    date: '18 Sep 67',
    durationMin: 170,
    instructor: 'อ. (ortho team)',
    examFormat: 'MCQ — bandage type · cast technique · digit 3-4 marker · sling indications · M/D/N union types ออกบ่อย',
    summary: `# External Immobilization + Fracture Complications

> 🎯 บทที่ยาวสุดของ ortho block (170 นาที = 2 hours 50 mins)
> 2 ส่วน: (A) **External immobilization** — Cast/Splint/Sling · (B) **Fracture complications** — Delayed/Non/Mal-Union
> ⚠️ Top exam: **digit 3-4 visualization rule · cast indications · sling techniques · 3 union types**

---

# 🟧 PART A — External Immobilization

## 1. Classification (2 กลุ่มหลัก) ⭐⭐⭐

| Type | Duration | Examples |
|---|---|---|
| **Long Duration** (> 3 weeks) | จนกระดูกติด | **Cast/Cast** เท่านั้น (1 method) |
| **Temporary** (≤ 3 weeks) | ระยะสั้น | Splint · Modified Thomas Splint · Modified Robert Jones · Ehmer Sling · Velpeau Sling · Spica Cast |

⭐ **Cast = self-complete tool** (ใช้ตัวเดียวจากหักจนติดได้)
⭐ **Temporary devices ≠ self-complete** — ต้องใช้ร่วมกับวิธีอื่น

---

## 2. Anatomic Limitations ⭐⭐⭐

| Bone | Cast applicable? | Reason |
|---|---|---|
| **Radius/Ulna · Tibia/Fibula** | ✅ | ต่ำกว่า elbow/stifle → bracket joints ได้ |
| **Carpus · Tarsus · MC/MT/Phalanges** | ✅ | ใช้ short cast |
| **Humerus** | ❌ | ติดรักแร้ — bracket shoulder ไม่ได้ |
| **Femur** | ❌ | ติดขาหนีบ — bracket hip ไม่ได้ |
| **Pelvis · Spine** | ❌ | ใช้ pedicle screw แทน |

⚠️ **Rule**: Cast ใช้ได้กับ fractures **distal to elbow/stifle เท่านั้น!**

---

## 3. Cast Materials (3 ชนิด)

| Material | Setting time | Pros | Cons |
|---|---|---|---|
| **Plaster of Paris** | 5 นาที (จุ่มน้ำ) | ราคาถูก · ทำง่าย · ดัดง่าย | หนัก · เปียกน้ำไม่ได้ · ไม่ reusable |
| **Thermoplastic (XL)** | กดความร้อนแล้วเย็น | Reusable · เบา | ไม่แนบขา · ไม่นิยมทำ full cast |
| **Fiberglass (3M)** | 5-7 นาที (โดนอากาศ) | เบา · แข็งแรง | ราคาแพง 10× POP · ไม่ reusable |

⭐ **Setting time 5 นาที ดีที่สุด** — เร็วไป = ไม่ทันโม / ช้าไป = สัตว์ขยับ

---

## 4. Cast Lengths

| Type | Coverage |
|---|---|
| **Long Leg Cast** | ปลายนิ้ว → กลาง humerus (ขาหน้า) / กลาง femur (ขาหลัง) — สำหรับ R/U Fx, T/F Fx |
| **Short Leg Cast** | ปลายนิ้ว → กลาง R/U (ขาหน้า) / กลาง T/F (ขาหลัง) — สำหรับ MC/MT/phalanges Fx |

⭐ Spica Cast = พิเศษสำหรับ **fissure** ที่ humerus/femur (ไม่ displaced) — cross over shoulder/hip

---

## 5. Cast Application Procedure (ขั้นตอนสำคัญ!) ⭐⭐⭐

### 5.1 Pre-Cast Setup
1. **Lateral recumbency** ขาหักชี้บน
2. **Counter-traction**: เชือกคล้องรักแร้/ขาหนีบ + ผู้ช่วยดึงปลายเท้า
3. **Reduction** กระดูกให้ overlap > 50%

### 5.2 Stirrup Tape (จุดเริ่มต้น) ⭐
- **2 strips of adhesive tape** ตามแนว medial-lateral หรือ cranial-caudal
- **3rd strip** พันรอบยึด 2 strips แรก
- ⚠️ ถ้าหลุด = **เริ่มใหม่ทั้งหมด!**
- เป็น **load-bearing** สำหรับ cast — ป้องกัน cast เลื่อนลง

### 5.3 Cast Padding (สำลีรองเฝือก)
- **Bottom edge อยู่ระดับ digit 2-5** ⭐
- **Digit 3-4 ต้องโผล่ออกมา** (visualization markers)
- พัน 2 รอบ: ล่างขึ้นบน + บนลงล่าง · ซ้อนทับ 50%
- **ขาหน้า**: เสริมที่ olecranon หนา 4-6 ชั้น (จุดโดน cast บาด!)
- **ขาหลัง**: ไม่ต้องเสริมที่ calcaneus (ไม่โดน)

### 5.4 Cast Material Application
- Cut into strips (1.5 รอบ × ความยาว)
- Overlap ที่ด้าน **caudal** (ขาหน้า) / **cranial** (ขาหลัง) = weight-bearing side
- Width: 2 นิ้ว (สุนัข 5-15 kg) · 3 นิ้ว (> 20 kg)
- 1 layer up + 1 layer down = standard
- ⭐ **เสริมความแข็งแรง**: ใช้ extra layers เฉพาะ weight-bearing side

### 5.5 Stirrup Closure
- พลิก stirrup tape 2 strips กลับขึ้นมาทับ cast → ดึงให้ตึง
- พัน cast strip ทับอีกชั้น = lock stirrup ในตำแหน่ง

### 5.6 Outer Wrap
- Elastic bandage / Co-Ban (ป้องกันเคี้ยว)
- Adhesive tape ปิดปลาย

---

## 6. Digit 3-4 Visualization Rule ⭐⭐⭐ (KEY!)

| Observation | Meaning | Action |
|---|---|---|
| **Digits 3-4 บวม** | Cast แน่นเกิน → ขาดเลือด | Re-do cast (ภายใน 24 hr) |
| **Digits 3-4 ไม่เห็น** (cast เลื่อนลง) | Cast หลวม | Re-do cast → fragment อาจ displace |
| **Digits 3-4 โผล่ปกติ** | OK | Continue monitoring |

⚠️ **Worst-case scenario**: Cast wet + tight + ignored → ขาเน่า → **ตัดขา!**

---

## 7. Cast Care Rules ⭐

| Rule | Reason |
|---|---|
| **24 hr post-cast check** | Detect tight/loose early |
| **ห้ามเปียกน้ำ** | สำลีดูดน้ำ → เน่า ภายใน 3-5 วัน |
| **Replace cast every 3-4 wks** (เด็ก!) | สัตว์โต cast คับ + joint stiffness |
| **Mobilize joints** ตอนเปลี่ยน cast | ป้องกัน joint stiffness |
| **Post-cast X-ray** ทุกครั้ง | Confirm fragment alignment |

⭐ Cast healing time: **6-16 weeks** (1.5-4 months) ขึ้นกับอายุ + Fx type

---

## 8. Splints (Half Cast) ⭐

⭐ Splint = **เฝือกครึ่ง** (half cast) — caudal สำหรับขาหน้า · cranial สำหรับขาหลัง

| Indication | Detail |
|---|---|
| **Pre-op** | ป้องกัน fracture ทิ่มทะลุ |
| **Post-op** | Reduce load on plate/pin |
| **Open Fx** | สามารถจัดการแผลได้ (cast ปิดสนิท ทำไม่ได้) |
| **Severe edema** | ใส่ cast ไม่ได้ |

**Materials**: Plaster of Paris หรือ **Thermoplastic XL** (preferred — เบา · reusable · 1 sheet XL = 2 layers POP)

---

## 9. Modified Thomas Splint ⭐

- ลวดดัดเป็น **ring** ที่ขาหนีบ/รักแร้ + bar ตามแนวขา + tape ยึด
- ใช้ใน **fissure ที่ humerus/femur** (ไม่ displaced) + **fractures ต่ำกว่า elbow/stifle**
- ปัจจุบันไม่ค่อยใช้ในสัตว์เล็ก · ยังใช้ใน **วัว · ม้า**

---

## 10. Modified Robert Jones Bandage ⭐

| Indication | Detail |
|---|---|
| **Pre-op** | ประคองก่อนผ่า |
| **Post-op** | ลด dead space · ลด swelling |
| **Patellar tendon repair** | Support |
| **Soft tissue trauma** | Compression dressing |

**Method**: Cast Padding + Elastic bandage (no plaster!) — softer than splint, more compression

---

## 11. Slings (สำหรับ joint stabilization, NOT bone Fx) ⭐⭐⭐

### 11.1 Ehmer Sling (ขาหลัง)
**Indication**: **Hip luxation post-reduction** (Coxofemoral joint dislocation)

**Goal Position**: Hip in **flexion + abduction + internal rotation** = ปลายเท้าบิดเข้า, hock บิดออก

**Technique** (figure-of-8):
1. Reduce hip first
2. Tape เริ่มจาก metatarsus → slide เข้า medial → up to groin → down
3. พัน 2 รอบ → รอบ 3 บิดเข้า medial หลัง hock → กลับขึ้น groin → repeat
4. **For short legs** (Shih Tzu, Pug, Mini, Pom, Chihuahua): + รอบ T-bia → รอบเอว → กลับ T-bia
5. **ระวัง**: ตัวผู้ — ห้ามรัด penis (urinary obstruction!)

**Duration**: **10 days** · check digits + X-ray confirm

⚠️ **Hip dysplasia → ไม่ควร reduce** (เบาตื้น/หัวกระดูกแบน → จะหลุดอีก)

### 11.2 Velpeau Sling (ขาหน้า)
**Indication**: **Shoulder luxation** post-reduction

**Goal Position**: Shoulder + elbow + carpus all flexed → ขาหน้าซ่อนใน sling, ไม่เห็นนิ้ว

**Method**: Tape เริ่มจาก metacarpus → over scapula → behind opposite axilla → repeat (figure-of-8)

### 11.3 Carpal Flexion (Shoulder) Sling
**Indication**: Lameness · post-op · prevent weight-bearing

**Method**: Tape เริ่ม distal radius → over scapula → behind opposite axilla → repeat
- **Different from Velpeau**: เห็นปลายเท้า · ไม่ flex carpus
- ⚠️ **Never overtighten**: chest expansion → respiratory compromise (esp. brachycephalic)

---

## 12. Tape Application Tip ⭐⭐⭐
- **Stretch tape first → re-roll loosely** before applying
- Reason: tape's adhesive resistance → over-tension when applying directly → 80-90% cases swell!

---

## 13. Cast Removal Criteria ⭐
1. **Clinical Union**: สัตว์ลงน้ำหนักได้
2. **Radiographic union > 70-80%**

⭐ "Clinical union" ≠ "Complete union" — partial healing แต่ functional use แล้ว

| Age | Healing time |
|---|---|
| < 3 months (puppy/kitten) | 2-3 weeks |
| 3-12 months (juvenile) | 4-6 weeks |
| Adult | 6-12 weeks |
| Senior | 12-16+ weeks |

---

# 🟪 PART B — Fracture Complications

## 14. 3 Types of Healing Failure ⭐⭐⭐ (KEY!)

| Type | Definition | X-ray |
|---|---|---|
| **Delayed Union** ⭐ | ติด แต่ช้ากว่าปกติ (เกิน 16-20 wk) | Healing visible แต่ incomplete |
| **Non-Union** ⭐ | ไม่ติด · กระดูกอาจ resorb หรือกลายเป็น false joint | Sclerotic ends · Smooth contour · Possible "elephant foot" pattern |
| **Mal-Union** ⭐ | ติด **แต่ผิดรูป** — ขาบิด/เอียง/สั้น | Fragment heal in displaced position |

⭐ **Goal**: ป้องกัน 3 ภาวะนี้ตั้งแต่ pre-op planning + intra-op + post-op care

---

## 15. Risk Factors for Healing Failure

| Factor | Mechanism |
|---|---|
| **Fracture line movement** | Fragment unstable → callus เปราะ |
| **Poor reduction** | Overlap < 50% · gap กว้าง |
| **Lost blood supply** | ขัดเลือด from tight cast · Aggressive periosteal stripping · Trauma severity |
| **Infection** ⭐ | Pre-op (open Fx · contaminated) · Intra-op (poor sterility) · Post-op (poor wound care) |
| **Bone loss** | Comminuted Fx + missing fragments · Chronic infection |
| **Late repair** | Fibrous tissue + dead bone at Fx ends → must debride |

---

## 16. Patient & Equipment Factors

| Factor | Impact |
|---|---|
| **Age** | Young = fast (< 3 mo: 2-3 wk) · Senior = slow |
| **Breed** | Large + healthy = fast · Toy/small = slow |
| **Health status** | Malnourished, hypothyroid, Cushing → poor healing |
| **Bone location** | Long bone (rich BS) > Phalanges (poor BS) |
| **Fracture pattern** | Stable > Unstable · Simple > Comminuted |
| **Implant choice** | Plate (rigid) > IM pin · Tight > Loose |
| **Time to repair** | **5-7 days = Golden Period** ⭐ — preserve periosteum |

---

## 17. Non-Union Subclassification ⭐⭐

### 17.1 Viable (Vascular) Non-Union — ยังมีเลือดมา · พร้อมจะสร้าง

| Subtype | Characteristic | Cause |
|---|---|---|
| **Hypertrophic** ⭐ | "**Elephant foot**" pattern · callus เยอะมาก · ไม่ติด | Fx unstable + ร่างกายพยายาม heal |
| **Moderately hypertrophic** | "**Horse-hoof**" pattern · callus ปานกลาง | Same — แต่ less reactive |
| **Oligotrophic** | Callus น้อย · ไม่เห็นชัด | Cerclage wire impingement on periosteum · Poor reduction |

**Treatment**: Debride · Re-stabilize with **rigid fixation** (plate) · Bone graft

### 17.2 Non-Viable (Avascular) Non-Union — ขาดเลือด

| Subtype | Detail |
|---|---|
| **Dystrophic** | Bone fragment isolated, no blood supply |
| **Necrotic** | Dead bone segment |
| **Defect** | Large bone gap |
| **Atrophic** | Bone resorption |

**Treatment**: Aggressive debridement of dead bone · Bone graft (autologous from iliac crest / proximal femur / proximal tibia) · Rigid fixation

---

## 18. Bone Healing Types ⭐ (Recap)

| Type | Mechanism | When |
|---|---|---|
| **Primary (1°) bone union** | Direct healing · NO callus | Rigid plate + screws · Compression at Fx site |
| **Secondary (2°) bone union** | External callus → remodeling | IM pin · ESF · Cast/Splint |

⭐ Primary union → **Fx line หายไปเอง** ไม่เห็นใน X-ray
⭐ Secondary union → **Callus formation** เห็นชัด

---

## 19. Treatment Algorithm

### 19.1 Delayed Union Management
1. X-ray → confirm callus formation
2. Add **splint** (extra support) หรือ **ESF**
3. Treat infection if present (culture + sensitivity-specific antibiotic)
4. Restrict activity
5. Re-image weekly

### 19.2 Non-Union Management (Surgical)
1. **Debride** Fx site → fresh bone
2. **Remove fibrous tissue / dead bone**
3. **Bone graft** (cancellous bone from iliac crest)
4. **Rigid fixation** (plate + screws preferred)
5. ⚠️ **Treat infection FIRST** before re-implanting!

### 19.3 Mal-Union Management
- Mild → may leave alone if functional
- Severe → **osteotomy + re-reduction + plate**

---

## 20. Bone Graft Sources ⭐
| Source | Type | Use |
|---|---|---|
| **Iliac crest** | Cancellous (best) | Most common · rich in osteogenic cells |
| **Proximal femur** | Cancellous | Alternative |
| **Proximal tibia** | Cancellous | Alternative |
| **Cortical strut** | Cortical | Bridge defects |

---

## 📝 EXAM RECAP — 22 Key Points

1. **Cast = self-complete tool** · Temporary devices = adjuncts only
2. **Cast applicable ONLY distal to elbow/stifle** ⭐ — not for humerus/femur (except spica for fissure)
3. **3 cast materials**: POP (cheap, heavy) · XL/Thermoplastic (reusable) · Fiberglass (light, expensive)
4. **Setting time 5 min ideal** for all
5. **Stirrup tape** = 2 strips + 1 securing strip = MUST be intact (ถ้าหลุด = restart!)
6. **Cast Padding edge ที่ digit 2-5** · digit 3-4 โผล่ = visualization markers ⭐⭐⭐
7. **Olecranon padding** = 4-6 layers extra (ป้องกัน cast bite)
8. **Overlap 1.5x → caudal (forelimb) / cranial (hindlimb)** = weight-bearing side
9. **Digit 3-4 monitor**: Swollen = tight · Hidden = loose · Both = redo!
10. **NEVER wet cast** → Necrosis in 3-5 days → may amputate ⭐
11. **Replace cast q 3-4 wks** (for puppies → growing!) · Mobilize joint
12. **Post-cast X-ray mandatory** every application
13. **Modified Thomas Splint** = ring at groin/axilla + bar — for fissure or low Fx
14. **Modified Robert Jones** = soft compression dressing (no plaster)
15. **Ehmer Sling** = hip luxation · figure-8 · **flexion + abduction + internal rotation** · 10 days
16. **Velpeau Sling** = shoulder luxation · forelimb hidden in sling · 10 days
17. **Tape technique**: stretch → re-roll loosely BEFORE applying ⭐
18. **3 healing failures**: Delayed (slow) · Non (no heal) · Mal (heal wrong) ⭐
19. **Hypertrophic non-union** = "elephant foot" — callus เยอะ but no union (Fx unstable + reactive bone)
20. **Atrophic non-union** = avascular · need bone graft
21. **Rigid fixation = primary union (no callus)** · IM/ESF/Cast = secondary union (callus)
22. **Golden Period = 5-7 days** for fresh repair · After 2 wk = need debridement

> 📚 อ่านควบ: 1 Basic Fracture (xy6nxu6Sduc) · 6.2 ESF (LwNNZYoCpZE) · 9.2 Hip Dysplasia (hIlH1i845wI) · 9.3 Patella Luxation (CIUpw8GNtQ4)
> ⚠️ **Top exam focus**: Digit 3-4 rule · Cast indications · Sling figure-8 (Ehmer/Velpeau) · 3 union types
> 🦴 **Practical**: Lab Sx 3 จะมี hands-on practice — ทุก technique ในนี้จะได้ทำจริง`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 8.2 Degenerative Joint Disease (Y4/1)
  // ─────────────────────────────────────────────────────────────
  VJ8ixtXP9XU: {
    videoId: 'VJ8ixtXP9XU',
    title: '8.2. Degenerative Joint Disease (DJD/OA)',
    subject: 'com2',
    date: '9 Oct 67 (รุ่นพี่)',
    durationMin: 59,
    instructor: 'อ. (ortho specialist · 50+ international lectures on this topic)',
    examFormat: 'MCQ — OA vs DJD terminology · primary vs secondary OA in cats vs dogs · pain types · multimodal approach ออกบ่อย',
    summary: `# Degenerative Joint Disease (DJD / OA)

> 🎯 **Most common ortho condition** ที่จะเจอใน clinical practice
> ⚠️ "ยาแก้ปวด = ยาขายดีที่สุดในโลก · 99% ใช้กับโรคนี้!"
> Top exam: **OA vs DJD definition · primary vs secondary · cat OA · multimodal Tx**

---

## 1. Terminology ⭐⭐⭐ (สำคัญ-ออกสอบ!)

| Term | Origin | Coverage |
|---|---|---|
| **OA (Osteoarthritis)** | European convention | Joint disease at **extremities** (hip, knee, elbow) |
| **DJD (Degenerative Joint Disease)** | American convention | **Umbrella term** — includes **spinal** as well |

⭐ **ทำไม Americans ปฏิเสธคำว่า OA**: cartilage มี **no blood supply** → strict inflammation (-itis) เกิดไม่ได้
⭐ **Modern consensus**: DJD = umbrella · OA = peripheral joints subset

---

## 2. Primary vs Secondary OA ⭐⭐⭐ (KEY DIFFERENCE!)

| Species | Type | Cause |
|---|---|---|
| **Dog** ⭐ | **Secondary OA** | Develops from underlying disease — Hip Dysplasia · Elbow Dysplasia · Patellar Luxation · OCD · trauma |
| **Cat** ⭐⭐ | **Primary OA** | **Idiopathic!** No underlying cause identified |

⭐ **Cat OA Reality** (last 10 years): "เจอเยอะมาก แต่หมอและเจ้าของไม่สังเกต!"
- Modern indoor cats + breed selection → ↑ incidence
- ตามเก็บแมวปกติฉีดวัคซีน → เจอ OA สูงเกินคาด

---

## 3. Joint Anatomy Recap (ที่ต้องเข้าใจ!) ⭐

| Component | Detail |
|---|---|
| **Articular cartilage** | Hyaline type · NO blood/nerve/lymph supply · เลี้ยงด้วย synovial fluid only |
| **Synovial fluid** | สร้างจาก **pumping mechanism** — joint movement! |
| **Synovial membrane (Capsule)** | นี่คือที่อยู่ของ **nociceptors** (ปวดจริงๆ มาจากที่นี่!) |
| **Subchondral bone** | "เห็นจาก X-ray ก็ต่อเมื่อ cartilage damage แล้ว" |

⭐ **Cartilage Types** (3 ชนิด):
- **Hyaline** = articular cartilage
- **Fibrocartilage** = meniscus
- **Elastic cartilage** = ear

⚠️ **Joint immobilization > 3 weeks** → no pumping → no synovial fluid → **OA**

---

## 4. OA Pathogenesis ⭐⭐

**Simple Concept**:
- **Abnormal stress on Normal cartilage** OR
- **Normal stress on Abnormal cartilage**
- = **OA**

**Common Setup**: น้ำหนักเพิ่ม + ขยับน้อย + คุณนั่งเรียน lecture = OA brewing!

**Molecular**:
- MMPs (Matrix Metalloproteinases) — esp. **MMP-1, 9, 13**
- Collagen Type 2 destruction
- Cytokine release → low-grade inflammation

---

## 5. Pain Generation ⭐⭐⭐

### 5.1 Pain Source Layers
| Stage | Source | Sensation |
|---|---|---|
| **Early** | Synovium (nociceptors) | Joint pain |
| **Late** | Subchondral bone | Bone pain (deep aching) |

⚠️ **Cartilage damage = NOT painful by itself!** (no nerve supply)

### 5.2 The Pain → Disuse → Weight Cycle
1. Pain → ขี้เกียจขยับ
2. ↓ Activity → ↑ Weight
3. ↑ Weight → ↑ Joint stress
4. ↑ Joint stress → ↑ Cartilage damage
5. → ↑ Pain → loop

---

## 6. Pain Classification ⭐⭐⭐

### 6.1 Acute vs Chronic
| Type | Duration | Mechanism |
|---|---|---|
| **Acute Pain** | < 3 months | Adaptive · noise receptor + inflammation |
| **Chronic Pain** ⭐ | > 3 months | **Maladaptive** · pathological — neuropathic + functional |

⚠️ **OA = Always Chronic Pain** (after early stage)

### 6.2 Acute on Chronic
- หมา OA chronic อยู่ + ไปกระแทก → **acute on chronic** flare-up

### 6.3 Sensitization Types ⭐
| Type | Mechanism |
|---|---|
| **Peripheral sensitization** | Local nerve hyperresponsiveness |
| **Central sensitization** | Spinal cord/brain hyperresponsiveness |

---

## 7. Pain Localization → Drug Choice ⭐⭐⭐ (KEY EXAM!)

| Pain Site | Drug Reaches |
|---|---|
| **Local (joint)** | **NSAIDs** |
| **Spinal cord** | NSAIDs + **Opioids** + **Alpha-2 agonist** |
| **Brain** | Only **Opioids** ⭐ |

⭐ "เป็น OA + NSAID อย่างเดียวเอาไม่อยู่!" → ต้อง multimodal

---

## 8. Diseases that Lead to OA ⭐ (ALL of them!)

| Category | Examples |
|---|---|
| **Articular fractures** | Salter-Harris IV · Acetabular Fx · ทุก type |
| **Joint luxation** | Hip · Shoulder · Elbow → **เกิด OA after reduction!** |
| **Developmental** | Hip Dysplasia · Elbow Dysplasia · OCD · MPL/LPL · Premature physeal closure |
| **Trauma** | Articular cartilage exposed to air = OA |
| **Joint surgery** | Even tomy/arthrotomy! |
| **Systemic disease** | Cushing · Hypothyroid · CKD (low protein) · Heart disease (exercise intolerance) |
| **Long immobilization** | Cast > 3 wks → arthrosis (no synovial fluid) |
| **Neurologic disease** | Cauda equina · Wobbler |

⭐ **Conclusion**: หมาทุกตัวกำลังเข้าใกล้ OA · "End-up = OA" — แค่ **เร็ว vs ช้า**

---

## 9. Diagnostic Imaging ⭐

### 9.1 X-ray Settings
- **Low kV, High mAs** ⭐
- **Deep sedation/anesthesia** for accurate exposure

### 9.2 X-ray Signs of OA ⭐⭐⭐
| Sign | Meaning |
|---|---|
| **Osteophyte (กระดูกงอก)** | จาก **enthesitis** (sclerosis at ligament/tendon attachment) → develops into osteophyte |
| **Subchondral bone sclerosis** | สีขาวเข้มที่ joint contact area = chronic inflammation + ↑ Ca |
| **Joint space narrowing** | (only useful in human standing X-ray, not in dogs!) |
| **Subchondral cysts** | Late finding |

⚠️ **Cannot use joint space in animals** — no Reference for breed/size/age standing X-ray exists

### 9.3 Other Modalities
- **CT/MRI** — soft tissue + cartilage detail
- **Ultrasound** — synovial assessment
- **Arthroscopy** — gold standard but expensive

---

## 10. Treatment Goals ⭐⭐⭐

> **OA cannot be cured! · Goals = (1) Relieve Pain (2) Slow Progression**

### 10.1 Decision Framework
| Approach | Goal |
|---|---|
| **Medical Treatment** | Pain release · ↓ inflammation · maintain function |
| **Surgical Treatment** | (1) **Preventive** — fix early disease (OCD, FMP) before OA (2) **Pain release** — late stage (THR, FHO) |

---

## 11. Pharmacotherapy (เลือกตัวให้ถูก!) ⭐

### 11.1 NSAIDs ⭐ (mainstay)
- Top selling drug worldwide
- Modern landscape: **Carprofen · Meloxicam · Robenacoxib · Firocoxib · Mavacoxib · Grapiprant**
- ⚠️ **Each drug has different niche** — เลือกตาม situation

### 11.2 Opioids
- For severe pain · spinal/CNS reach
- Tramadol — ❌ "ในหมา NO evidence ลดปวด เมื่อใช้เดี่ยว!" ⭐
  - ใช้ฉีดร่วมกับยาอื่น OK
  - ในแมว — เซโรโทนิน-related pain OK

### 11.3 Newer Options ⭐
| Drug class | Note |
|---|---|
| **Anti-NGF monoclonal antibody** | "NGF = nerve growth factor" · revolutionary new option |
| **PRP (Platelet-rich plasma)** | "ผมใช้เยอะมาก" — ลด inflammation + delay progression |
| **Stem cell injection** | Investigational |
| **Gene therapy** | Future |

### 11.4 Supplements (Evidence Update!) ⭐
| Supplement | Status |
|---|---|
| **Glucosamine + Chondroitin** | "ผมเลิกใช้แล้ว!" — งานวิจัยไม่ confirm efficacy |
| **PUFA (Omega-3, Omega-6)** | ลด inflammation · evidence-supported |
| **Undenatured Collagen Type 2** | บล็อก T-cell at Peyer's patch → ↓ inflammation (NOT direct cartilage) |
| **Hyaluronic acid** | Joint injection · variable efficacy |

⚠️ **Collagen ขายเป็นซองตามทีวี = ปัญญาอ่อน** — protein digested in stomach!

---

## 12. Pain Management Concepts ⭐⭐⭐

### 12.1 The Two 2022 Guidelines (must know!)
- **AAHA** (American Animal Hospital Association)
- **WSAVA** (World Small Animal Veterinary Association)

⭐ **2 Core Concepts**:
1. **Pre-emptive analgesia** — ป้องกันก่อน pain เกิด
2. **Multimodal treatment** — ใช้ทุกวิธีร่วมกัน · ไม่สนว่าใครเป็นพระเอก

### 12.2 Pain Score Tools
| Tool | Use |
|---|---|
| **Colorado Pain Scale** | Acute pain |
| **Glasgow CMPS** | Acute pain |
| **Liverpool COA** ⭐ | **Chronic OA pain** |
| **CSU OA scale** | Veterinary specific |

---

## 13. Non-Pharmacological Treatment ⭐

### 13.1 Weight Control = Fat Loss (NOT just weight loss!)
- ⭐ **ลดไขมัน · เพิ่มกล้ามเนื้อ** = healthy
- ลดน้ำหนัก = ลดทั้ง muscle + fat = unhealthy

### 13.2 Exercise Concepts
| Type | Effect |
|---|---|
| **Vigorous + Repetitive Impact** ❌ | Damage cartilage (e.g., extreme running) |
| **Moderate + Regular** ✅ ⭐ | Walking · light shocking · daily routine |

⭐ **Walking research**: หมาเดิน regularly = pain reduction = NSAID effect (statistically equivalent)

### 13.3 Swimming ⭐ (Controversial!)
- "Textbook 90% บอกว่าดี — ผม **against**!"
- **เหมาะ**: บางสายพันธุ์ที่ชอบน้ำ + supervised
- **ไม่เหมาะ**: หมาที่กลัวน้ำ · cats · brachycephalic
- เคสจริง: Bernese Mountain Dog ตกน้ำ panic → วิ่งหนี → รถชนหน้าหัก

### 13.4 Rehabilitation Modalities
- Cold/warm packing
- Ultrasound therapy
- Laser therapy
- Hydrotherapy (selected cases)
- Therapeutic exercises (PT)
- Acupuncture

---

## 14. Surgical Options ⭐

| Procedure | Indication |
|---|---|
| **Preventive Sx**: OCD removal · FMP removal · MPL correction · CCL repair | Early disease — block OA development |
| **Joint replacement** (THR · TER · TKR) | End-stage OA |
| **Arthrodesis** | Joint fusion — eliminate motion = pain |
| **Femoral Head Ostectomy (FHO)** | Hip salvage |
| **Amputation** | Last resort severe pain |

---

## 15. Cat OA Recognition ⭐⭐⭐ (ตัว exam ตัวเด็ด!)

### 15.1 Behavioral Signs (ที่หมอ + เจ้าของไม่สังเกต!)
- **Hesitates before jumping** — มองสูง/ต่ำก่อน · เคยกระโดดเลย!
- **Slides down instead of jumping**
- **Reduced grooming**
- **Sleeping in unusual positions**
- **Skin twitch when palpating spine** ⭐ — sign of **spinal pain**

### 15.2 Cat-specific Findings
- Spinal hyperalgesia palpable
- ⭐ **Skin "rolling/twitching"** when paraspinal area touched (similar to horses!)

---

## 16. Multimodal Treatment Algorithm ⭐ (Practice!)

| Step | Action |
|---|---|
| **1. Diagnosis** | X-ray + Pain score |
| **2. Pharmacological** | NSAID (1st line) → + Opioid (severe) → + Adjunct (PUFA, Collagen Type 2) → Consider PRP, Anti-NGF, Stem cell |
| **3. Non-pharmacological** | Weight management (fat loss) · Therapeutic exercise (regular walking) · Rehab (cold/warm, US, laser) |
| **4. Surgical** (if appropriate) | Preventive Sx (early) · Salvage/Replacement (end-stage) |
| **5. Continuous monitoring** | Reassess + adjust |

---

## 📝 EXAM RECAP — 18 Key Points

1. **OA vs DJD** — DJD = umbrella term · OA = peripheral joints
2. **Dog OA = Secondary** (from underlying disease) ⭐⭐⭐
3. **Cat OA = Primary** (idiopathic) ⭐⭐
4. **Cartilage has NO blood/nerve/lymph supply** — fed by synovial fluid only
5. **Synovial fluid sources**: pumping mechanism (joint motion!)
6. **Pain origin**: Synovium (early) → Subchondral bone (late) — NOT cartilage!
7. **Joint immobilization > 3 weeks** → arthrosis
8. **OA pathogenesis**: ↑ stress on N cartilage OR N stress on ↓ cartilage
9. **MMPs (matrix metalloproteinases)** = key enzymes (MMP-1, 9, 13)
10. **Acute vs Chronic Pain**: 3 months cutoff
11. **Pain reach**: NSAID = local · Opioid = brain · Alpha-2 = spinal
12. **Tramadol useless alone in dogs** ⭐
13. **Weight management = fat loss**, not just weight loss
14. **Exercise**: Moderate-Regular > Vigorous-Repetitive
15. **Glucosamine/Chondroitin = controversial** — many specialists abandoning
16. **Multimodal Tx**: AAHA + WSAVA 2022 guidelines
17. **Surgical**: Preventive (early) vs Salvage/Replacement (late)
18. **Cat OA signs**: hesitation before jumping · skin twitch · sliding down

> 📚 อ่านควบ: 9.1 Dev Ortho (Spz38qa5upU) · 9.2 Hip Dysplasia (hIlH1i845wI) · 9.3 Patella Luxation (CIUpw8GNtQ4) · 11 Common Joint (MMTtwT_7c94) · 12 Cruciate (9U-Dgu0ouUk) · 15.1 Elbow (Os6MWLC8oso)
> 🎬 หมายเหตุ: รุ่นพี่บันทึก · clip Mac มีผีหลอก! · video clips ไม่เล่น · slides มี details เพิ่มเติม
> 💊 **Practice tip**: เจ้าของหลายคน "ลดน้ำหนัก" = ลดอาหาร → กินโปรตีนน้อย → กล้ามเนื้อลดด้วย → กลับมา OA ใหม่`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 9.1 Developmental Orthopedic Disease (LCP) (Y4/1)
  // ─────────────────────────────────────────────────────────────
  Spz38qa5upU: {
    videoId: 'Spz38qa5upU',
    title: '9.1. Developmental Orthopedic Disease + LCP',
    subject: 'com2',
    date: '16 Oct 67 (รุ่นพี่)',
    durationMin: 24,
    instructor: 'อ. (รุ่นพี่ — แทน อ.วรพันธ์)',
    examFormat: 'MCQ — DOD multifactorial concept · LCP signalment · pathogenesis (avascular necrosis) · FHO indication ออกบ่อย',
    summary: `# Developmental Orthopedic Disease (DOD) + Legg-Calvé-Perthes (LCP)

> 🎯 บทสั้น (24 นาที) แนะนำ DOD + เจาะลึก LCP โรคแรก
> 🟧 LCP = "**Avascular necrosis ของ femoral head**" ในสุนัขพันธุ์เล็กอายุ 4-12 เดือน
> Top exam: **Predisposing breeds · 4-12 mo onset · FHO indication (< 20 kg)**

---

## 1. Developmental Orthopedic Disease (DOD) Overview ⭐

**Definition**: กลุ่มโรคที่เกิดในช่วง **พัฒนาการจากเด็ก → ผู้ใหญ่** (ปีแรกของชีวิต)

⭐ **DOD diseases ที่อยู่ในกลุ่มนี้**:
- **Canine Hip Dysplasia (CHD)** — 9.2
- **Fragmented Coronoid Process (FMP/FCP)** — Elbow dysplasia
- **Legg-Calvé-Perthes (LCP)** — 9.1 (วันนี้)
- **Osteochondritis Dissecans (OCD)** — 15.2
- **Patellar Luxation (MPL/LPL)** — 9.3
- **Ununited Anconeal Process (UAP)**
- **Premature physeal closure**

---

## 2. DOD Concept ⭐⭐ (สำคัญ!)

**Old idea**: Genetic disease (single dominant/recessive)

**Modern idea** ⭐: **Multifactorial Disorder**
- Multiple Genes (polygenic)
- Environmental factors (อาหาร · เลี้ยงดู · hormone · sex)
- ไม่มี simple genetic test (ยกเว้น Doberman/von Willebrand)

⭐ **Why "Disease" not just "Joint"**: ปัจจัยเด่นรวม muscle + bone + soft tissue · ไม่ใช่กระดูกอย่างเดียว!

---

## 3. Predisposing Breeds Concept ⭐

> "ทำไม CHD เป็น Lab/Golden แต่ MPL เป็น Yorkie?"

⭐ **Breed predisposition** = critical clinical clue
- Always factor in breed signalment
- Different DODs have different breed predispositions

---

# 🟧 PART 2 — Legg-Calvé-Perthes (LCP)

## 4. LCP Definition ⭐⭐⭐

**Names** (multiple):
- **LCP** (Legg-Calvé-Perthes disease)
- **Avascular necrosis of femoral head** ⭐
- Aseptic necrosis

**Key concept**: **เลือดไม่มาเลี้ยงหัวกระดูก femoral** → bone death → fracture → OA

⚠️ **เกิดได้ทั้งคน · หมู · สัตว์ทุก species** — แต่ในหมาเจอเยอะ!

---

## 5. Signalment ⭐⭐⭐

| Feature | Detail |
|---|---|
| **Breeds (top)** | **West Highland White Terrier · Yorkshire Terrier · Cairn Terrier · Poodle · Pinscher · Pomeranian** |
| **Size** | **Small/Toy breeds** เท่านั้น! (ไม่เคยเป็นพันธุ์ใหญ่) |
| **Age onset** | **4-12 months** (peak: **7 months**) ⭐ |
| **Sex** | M = F (50/50) |
| **Laterality** | Usually **Unilateral** · sometimes Bilateral |

⚠️ **Breeding rule**: ห้ามเอาตัวที่เป็น LCP มา breed (genetic component)

---

## 6. Pathogenesis ⭐⭐⭐

### 6.1 Vascular Anatomy (KEY!) ⭐

**Vascular pathway**: Iliac artery → Caudal gluteal artery → Lateral & Medial Circumflex femoral artery → Joint capsule → Femoral head/neck

⭐ **2 supplying arteries**:
- **Lateral circumflex femoral artery**
- **Medial circumflex femoral artery**

(Extra-capsular → Intra-capsular → Intra-osseous)

### 6.2 Mechanism (Cycle)
1. **Vascular injury** (1 หรือทั้ง 2 arteries)
2. **Avascular necrosis** ของ femoral head
3. **Bone death** + **microfractures**
4. Body พยายาม **revascularization**:
   - **Successful** → remodeling → osteophyte/OA
   - **Failed** → severe collapse + fracture → ปวดมาก

### 6.3 Sequence of Events
- Trabecular bone necrosis
- Subchondral collapse
- Cartilage damage
- Femoral head deformity ("**mushroom-shape**" or "**flattened**")
- Secondary OA + capsular thickening

---

## 7. Clinical Signs ⭐⭐⭐

| Sign | Detail |
|---|---|
| **Hindlimb lameness** | Unilateral · progressive |
| **Non-weight bearing (toe-touching)** | ยกขา · ไม่ยอมใช้ขา |
| **Self-mutilation** ⭐ | กัด/แทะที่บริเวณ hip / hind end |
| **Muscle atrophy** ⭐ | **Hamstring atrophy เด่น** (extension ไม่ได้ → ฝ่อ) |
| **Crepitus** | กึ๊บๆ ที่ hip joint (โดยเฉพาะ chronic) |
| **Shortened limb** | เทียบ 2 ขา-ทาบ — ขาที่เป็นสั้นกว่า |

### Pain on Manipulation ⭐
- **Internal rotation** = ปวดมากสุด ⭐
- **Hip extension (Hyper-extension)**
- **Hip abduction**
- "**Bicycle motion**" = sensitive maneuver

---

## 8. Diagnosis (X-ray Findings) ⭐⭐⭐

| Finding | Description |
|---|---|
| **Flattened femoral head** | "Mushroom-shape" |
| **Subchondral bone necrosis** | Lucent areas in femoral head/neck |
| **Femoral neck shortening** | Shortened, widened |
| **Osteophyte / Bone spur** | Periarticular |
| **Joint space widening** | (ตรงข้ามจาก CHD) |
| **Subluxation** | บางราย |
| **Acetabulum** | Usually NORMAL (different from CHD!) |

⚠️ **Compare to contralateral side** — bilateral cases harder to detect

---

## 9. Treatment ⭐⭐⭐

### 9.1 Conservative (Mild/Early Cases) ⭐
**Indication**: Intermittent lameness · pain manageable · early stage

**Plan**:
1. **Cage rest** 1-2 weeks (NOT 3 months — short-term!)
2. **NSAIDs + pain control**
3. **Light physical therapy** (gentle ROM)
4. **Recheck every 2 weeks**
5. **Monitor X-ray** — femoral head deterioration
6. ติดตามจนกระดูกโตเต็ม (~1 ปี)

### 9.2 Femoral Head Ostectomy (FHO) ⭐⭐⭐ (KEY!)

**Indication**:
- **Severe pain** + non-functional
- **Chronic muscle atrophy**
- **End-stage** with collapsed/fractured femoral head
- **Body weight ≤ 20 kg** (preferred — best outcomes!)

⭐ **> 20 kg can do FHO too** — but recovery less complete

**Surgical Technique**:
- Cut from **greater trochanter** to **lesser trochanter**
- Remove femoral head + neck

**Post-FHO Anatomy**:
- Bone removed → space → **Pseudo-joint forms** (fibrous tissue)
- Function via **fibrous union** + **muscle support**

⭐ **Why it works**: Dog has 4 legs · weight distributed → can compensate when 1 hip is salvaged

### 9.3 Total Hip Replacement (THR) ⭐ (Modern Option)

**Indication**:
- Younger dogs needing full function
- Owner can afford expense
- Skilled surgeon available
- **Body weight 1.5 kg → 70+ kg** all possible (technology improved!)

**Components**:
- Acetabular cup (artificial socket)
- Femoral stem (drilled into femoral shaft)
- Femoral head (artificial ball)

⭐ More popular abroad · expensive but excellent outcomes

### 9.4 FHO vs THR Comparison

| Factor | FHO | THR |
|---|---|---|
| Cost | Low | Very high |
| Skill needed | Moderate | Specialist |
| Outcome (small dog) | Good | Excellent |
| Outcome (large dog) | Compromised | Excellent |
| Recovery time | 4-8 weeks | 6-12 weeks |
| Complications | Pseudo-joint stiffness | Infection, luxation, implant fail |

---

## 10. Post-Op Care (FHO)

| Action | Timing |
|---|---|
| **Pain control** | NSAIDs + opioids first 7-10 days |
| **Rehabilitation** ⭐ | **Most important!** Build hamstring + gluteal mass |
| **Hydrotherapy** | (selected — preferred for dogs that swim) |
| **PROM exercises** | Daily |
| **Weight bearing** | Encourage early (oddly — not restricted!) |
| **Recheck X-ray** | 6-8 weeks |

⚠️ **Hamstring rebuilding** = success determinant

---

## 11. Prognosis

| Factor | Outcome |
|---|---|
| Small dog (< 15 kg) + FHO + good rehab | **Excellent** — return to near-normal function |
| 15-20 kg + FHO | Good · slight gait abnormality may persist |
| > 20 kg + FHO | Fair · noticeable gait change |
| THR (any size) | **Excellent** if no complications |

---

## 📝 EXAM RECAP — 12 Key Points

1. **DOD = multifactorial** (genetic + environment), not simple Mendelian
2. **DOD includes**: CHD · ED (FMP/UAP) · LCP · OCD · Patellar Luxation · Premature physeal closure
3. **LCP = Avascular Necrosis** of femoral head ⭐
4. **LCP signalment**: Small/Toy breeds (Westie, Yorkie, Pom, Pug, Poodle) · 4-12 mo · peak 7 mo
5. **Vascular anatomy**: Lateral + Medial Circumflex Femoral Artery
6. **Self-mutilation** = LCP-specific behavior
7. **Internal rotation pain** = sensitive sign
8. **Hamstring atrophy** = signature finding
9. **X-ray**: Flattened/mushroom femoral head + Joint space widening + Normal acetabulum
10. **Conservative Tx**: 1-2 wk cage rest + NSAIDs + monitor (NOT 3 months!)
11. **FHO** = primary surgical Tx · best for **dogs ≤ 20 kg**
12. **THR** = modern alternative · best function · expensive

> 📚 อ่านควบ: 8.2 OA (VJ8ixtXP9XU) · 9.2 Hip Dysplasia (hIlH1i845wI) · 9.3 Patella Luxation (CIUpw8GNtQ4) · 11 Common Joint (MMTtwT_7c94)
> 🩻 LCP X-ray: รอผ่านอาทิตย์หน้าจะเรียน CHD — ตอนนั้นเปรียบเทียบ acetabular morphology
> 💊 Conservative timeline: ขังกรง **1-2 wk** เท่านั้น · "ขังกรง 3 เดือน = wrong concept" — ทำให้ joint ankylosis แทน`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 9.2 Canine Hip Dysplasia (CHD) (Y4/1)
  // ─────────────────────────────────────────────────────────────
  hIlH1i845wI: {
    videoId: 'hIlH1i845wI',
    title: '9.2. Canine Hip Dysplasia (CHD)',
    subject: 'com2',
    date: '16 Oct 67 (รุ่นพี่)',
    durationMin: 68,
    instructor: 'อ. (รุ่นพี่ — แทน อ.วรพันธ์)',
    examFormat: 'MCQ — Hip laxity primary cause · Predisposing breeds (Lab/Golden/GSD) · Norberg angle · Ortolani test · 6 surgical options · age cutoffs ออกบ่อย',
    summary: `# Canine Hip Dysplasia (CHD)

> 🎯 บทยาว 68 นาที · second longest com2 lecture
> ⚠️ **#1 cause of secondary OA in dogs** + most common DOD
> Top exam: **Hip laxity = root cause · Norberg ≥ 105 · Ortolani test · 6 Tx options + age cutoffs**

---

## 1. Definition Evolution ⭐⭐

### 1.1 Original Concept (Old, ~1960s)
"**Continental bilateral subluxation** ของ coxofemoral joint"
- หัวกระดูก subluxation
- ออก-เข้าจาก acetabulum

### 1.2 Modern Definition ⭐ (1970s onwards)
**Hip Dysplasia = "Degree of subluxation due to LAXITY of coxofemoral joint"**

⭐⭐⭐ **Key insight**: **Hip laxity is the PRIMARY cause** — not bone deformity!

---

## 2. Pathogenesis (KEY!) ⭐⭐⭐

> "**Soft tissue origin** that causes bone changes — NOT vice versa!"

### 2.1 Primary Cause = Joint Laxity
- **Joint capsule** หลวม
- **Round ligament (Ligament of femoral head)** weak
- **Surrounding muscles** poorly developed

### 2.2 Sequence of Damage
1. **Stage 0** (3-4 months): **Passive Hip Laxity** develops
2. **Stage 1**: Sliding subluxation during weight-bearing
3. **Stage 2**: **Functional laxity** = subluxation while standing/walking
4. **Stage 3**: Acetabulum begins to **flatten** (no longer cup-shaped)
5. **Stage 4**: Femoral head **flattens**, deforms
6. **Stage 5** (End-stage): Severe OA, osteophytes, joint destruction

### 2.3 Sub-cluster: Femoral Head Position by Gait Phase ⭐
| Phase | Position |
|---|---|
| **Swing phase** (leg lifted) | Hip muscles parallel to femoral axis → low load → can subluxate |
| **Stance phase** (weight-bearing) | Femoral head contacts acetabular rim at single focal point → repetitive damage |

⭐ **Bunny-hopping gait** = compensatory in dogs (วิ่งกระโดดทั้ง 2 ขาหลังพร้อมกัน) — เพื่อลดเจ็บ + ตามเพื่อนทัน

---

## 3. Etiology (Multifactorial) ⭐

| Factor | Detail |
|---|---|
| **Genetic** | Polygenic · breed predisposition |
| **Rapid growth** ⭐ | Body grows faster than bone develops · obesity |
| **Calorie/protein excess** | Bigger pup = more stress on developing joints |
| **Calcium/Phosphorus imbalance** | Excess Ca → poor bone strength |
| **Ca-D-P imbalance** | Vitamin D malabsorption |
| **Hormone factors** | Sex hormones · estrogen |
| **Raw diet trends** | "ปัจจุบันเทรนด์ราว diet มาแรง — ทำให้ imbalance!" |

---

## 4. Predisposing Breeds ⭐⭐⭐

| Common Breeds (Large) ⭐ |
|---|
| **Labrador Retriever** |
| **Golden Retriever** |
| **German Shepherd Dog (GSD)** |
| Saint Bernard |
| Newfoundland |
| Bernese Mountain Dog |
| Rottweiler |
| Alaskan Malamute |
| Siberian Husky |

⭐ ในไทย: เห็นในบ้านเลี้ยงพันธุ์ใหม่ๆ อย่าง Husky, Malamute, Tibetan Mastiff เพิ่มขึ้น

---

## 5. Clinical Signs ⭐⭐⭐

### 5.1 Two Patient Groups
| Group | Age | Pattern |
|---|---|---|
| **Young dogs** ⭐ | 5-10 months | Active disease — laxity + acute pain |
| **Mature dogs** | > 1 year | Chronic OA · stable rocky course |

### 5.2 Typical Signs
| Sign | Detail |
|---|---|
| **Hindlimb lameness** | Bilateral or unilateral · intermittent |
| **Bunny-hopping gait** ⭐ | กระโดดทั้ง 2 ขาหลังพร้อมกัน · ตามเพื่อนทันได้ |
| **Hip-sway gait** ⭐ | "เดินเหมือนนางแบบ" — ก้น swaying side-to-side |
| **Short stride** (small steps) | Pain → ก้าวสั้น |
| **Difficulty rising** | ยกขาลำบาก |
| **Reluctant to climb stairs/jump** | Avoid hip stress |
| **Muscle atrophy** | Hamstring, gluteal, quadriceps |

### 5.3 Pain on Manipulation ⭐
- **Hip extension** (caudal direction)
- **External rotation**
- Joint capsule stretched → painful

### 5.4 Disease Course (Bimodal Pattern)
- **Phase 1**: Severe pain at ~5-10 months (active development)
- **Plateau**: Pain stabilizes by ~1 year (skeletal maturity)
- **50% improve** spontaneously by maturity
- **50% progress to chronic OA** later in life

---

## 6. Diagnosis — Physical Exam ⭐⭐⭐

### 6.1 Ortolani Test ⭐⭐⭐ (KEY!)

**Purpose**: Detect joint **laxity** + **palpable subluxation/reduction**

**Position**:
- **Lateral recumbency** (preferred) OR Dorsal recumbency
- **Femur perpendicular to pelvis · parallel to floor**

**Technique**:
1. ออกแรงกดที่ **stifle (knee)** ไปทาง pelvis
2. หัวกระดูก **subluxates** (เด้งออก)
3. ค่อยๆ **abduct** (กางขาออก)
4. หัวกระดูกจะ **gluck back into acetabulum** = "**clunk**" ที่ได้ยิน/รู้สึก

⭐ **Two key angles**:
| Angle | Definition | Significance |
|---|---|---|
| **Angle of Reduction** | มุม abduction ที่หัวกระดูกกลับเข้าเบ้า | Larger = **more laxity** |
| **Angle of Subluxation** | มุม adduction ที่หัวกระดูกเริ่มหลุดอีก | Smaller = poor dorsal acetabular rim coverage |

⚠️ **Ortolani limitations** (cases where test is negative):
- Normal hip
- End-stage OA (joint frozen by fibrous tissue/osteophyte)
- Severe luxation (out of joint completely)
- Large dog resistance (50+ kg) → use **sedation + muscle relaxant**

### 6.2 Bardens Test
- Variant of laxity assessment
- Useful if Ortolani negative

---

## 7. Diagnosis — Imaging ⭐⭐⭐

### 7.1 Hip Extension View (Standard Ventro-Dorsal)
- Dog in dorsal recumbency
- **Both femurs extended + parallel to each other**
- Pelvis symmetric (obturator foramen = same shape both sides!)

⚠️ **NOT good for laxity assessment** — extended position **forces head into acetabulum** (winching effect)

⭐ Used for: detecting **OA changes** (osteophytes, sclerosis) NOT laxity

### 7.2 Norberg Angle (NA) ⭐⭐⭐
**Method**:
1. Connect centers of both femoral heads
2. Draw line from each femoral head center to its acetabular rim
3. Measure angle

| Norberg Angle | Interpretation |
|---|---|
| **≥ 105°** ⭐ | Normal |
| **99-105°** | Borderline |
| **< 99°** | Abnormal — Hip Dysplasia |

⭐ ใช้ใน OFA scoring system (US)

### 7.3 PennHIP (Distraction Index — DI) ⭐⭐⭐ (KEY!)

**Developed**: 1993 by University of Pennsylvania
**Goal**: Quantify **passive laxity**

**Technique**:
- Dog in dorsal recumbency
- **Femurs perpendicular to pelvis**
- **Distractor** (aluminum rod) wedged between femurs at greater trochanter level
- Force femoral heads laterally → measure laxity

**Calculation**: **DI = D / r**
- D = distance between centers of femoral head and acetabulum
- r = radius of femoral head

| DI Value | Interpretation |
|---|---|
| **< 0.3** | Tight hip · low CHD risk |
| 0.3-0.7 | Moderate laxity |
| **> 0.7** | High laxity · high CHD risk |
| > 1.0 | Severe |

⭐ **Advantages of PennHIP**:
1. Predictive of CHD (not just current state)
2. **Age-independent** ⭐ (consistent across life stages)
3. Can be done as early as **4 months**
4. Weight-independent

### 7.4 CT-based Measurements ⭐
| Index | What it measures |
|---|---|
| **Acetabular Rim Angle (ARA)** | Larger = better coverage (femoral head wrap) |
| **Dorsal Acetabular Rim Angle (DARA)** | **Smaller** = better coverage |

---

## 8. Treatment ⭐⭐⭐

### 8.1 Decision Tree (Age + Severity)

| Age Group | Available Options |
|---|---|
| **3-5 months** ⭐ (early) | JPS · DPO/TPO · THR · FHO (delayed best) |
| **5-12 months** | DPO · TPO · THR · FHO |
| **> 12 months** | THR · FHO only |

### 8.2 Conservative Treatment (ALL ages)
| Component | Detail |
|---|---|
| **Pain control** | NSAIDs (carprofen, meloxicam, etc.) |
| **Weight management** | ⭐ Lifelong! Lean body composition |
| **Diet adjustment** | Switch puppy → adult food earlier |
| **Exercise** | Walking · NOT excessive jumping/running |
| **Rehabilitation** | Hydrotherapy (selected) · TENS · LASER |

⭐ Studies confirm: dogs on **calorie restriction** have **significantly less OA** vs ad-libitum-fed dogs

---

## 9. Surgical Options (6 Methods!) ⭐⭐⭐

### 9.1 JPS (Juvenile Pubic Symphysiodesis) ⭐⭐
- **Earliest age**: 3-4 months
- **Latest age**: 4-5 months (window very narrow!)

**Technique**:
- **Electrocautery** (40 W) burns 1/3 to ½ of pubic symphysis
- Causes premature fusion of pubic growth plate

**Mechanism**: Pubic plate stops growing → other plates continue → **acetabular rim rotates over femoral head**

**Pros**:
- 10-min procedure
- Minimally invasive
- "Preventive" intervention before clinical OA

**Cons**:
- Narrow age window (often missed)
- Won't help if OA already developed

### 9.2 TPO (Triple Pelvic Osteotomy) ⭐⭐
**Age range**: 4-10 months (best at 6-7 months)

**3 osteotomy sites**:
1. **Ilium**
2. **Pubis**
3. **Ischium**

**Result**: Acetabulum rotates → better femoral head coverage

**Special TPO plate**: Has **angle step** (20°, 25°, 30°) determined by laxity severity

**Pros**: Long history · proven technique
**Cons**: **35-70% complication rate** ⚠️
- Screw loosening at sacroiliac
- Pelvic narrowing

### 9.3 DPO (Double Pelvic Osteotomy) ⭐⭐ (Modern!)
**Age range**: < 10 months

**2 osteotomy sites**:
1. **Ilium**
2. **Pubis**
(NO ischium cut — pelvic ring intact!)

**Pros over TPO**:
- Easier surgery
- Lower complication rate
- Less pain post-op
- Smaller incision

**Cons**: Slightly less rotation possible (since ischium not cut)

### 9.4 Selection Criteria for DPO/TPO ⭐
- Dog **< 10 months** (ideally 6-7 mo)
- **No OA** on radiograph
- **DI ≤ 1.0**
- **Angle of Subluxation ≤ 25°**
- **DARA ≤ 20°** (still has dorsal rim)

### 9.5 THR (Total Hip Replacement) ⭐⭐
**Age range**: Any (typically > 12 months)

**Components**:
- Acetabular cup (titanium)
- Femoral head (artificial ball)
- Femoral stem (anchored in shaft)

**Cost (Thailand)**: ~150,000 baht/hip (one side)

**Pros**: Best functional outcome · gold standard
**Cons**: Very expensive · skilled surgeon required

### 9.6 FHO (Femoral Head Ostectomy) ⭐
**See LCP video (9.1) for details**

- Best for dogs **≤ 20 kg**
- Salvage procedure
- Pseudo-joint forms with fibrous tissue

⚠️ **FHO + Greater Trochanter** = "femoral head and neck excision" (FHNE)

### 9.7 Future: Acetabular Rim Implants
- Titanium implant covering only the dorsal acetabular rim
- "อีกประมาณ 2-3 ปีจะตีพิมพ์ออกมา"

---

## 10. Surgical Comparison Table ⭐

| Method | Age | Indication | Pros | Cons |
|---|---|---|---|---|
| **JPS** | 3-4 mo | Hip laxity + no OA | Quick, easy | Narrow window |
| **TPO** | 4-10 mo | Moderate laxity, no OA | Long history | High complications |
| **DPO** | < 10 mo | Moderate laxity, no OA | Lower complications | Less rotation |
| **THR** | > 12 mo | End-stage OA | Best function | Expensive |
| **FHO** | Any | Salvage, small dogs | Cost-effective | Some gait change |

---

## 11. Post-op Care

| Action | Timing |
|---|---|
| **Pain control** | NSAIDs + opioids first 7-10 days |
| **Cage rest** | 4-6 weeks |
| **Rehabilitation** ⭐ | **Critical** for muscle rebuilding |
| **Hydrotherapy** | (selected) — decreased load |
| **Recheck X-ray** | 6, 12 weeks |

---

## 📝 EXAM RECAP — 18 Key Points

1. **Hip laxity = ROOT CAUSE** of CHD ⭐
2. **Soft tissue origin first**, bone changes follow
3. **Predisposing breeds (TOP 3)**: Labrador · Golden · GSD ⭐
4. **Clinical signs**: bunny-hopping · hip-sway gait · short stride
5. **Bimodal disease course**: peak pain 5-10 mo, may plateau by 1 yr
6. **Ortolani test (+)** = laxity present; need GA for accurate result
7. **Angle of Reduction** = larger = more laxity
8. **Norberg angle ≥ 105° = normal · < 99° = abnormal** ⭐
9. **PennHIP DI < 0.3 = tight · > 0.7 = loose** ⭐
10. **PennHIP advantages**: predictive, age-independent, can do at 4 mo
11. **Hip extension view** misses laxity (winching effect)
12. **JPS** = 3-4 mo only · electrocautery 40W on pubic symphysis
13. **TPO** = 3-cut osteotomy (ilium + pubis + ischium) · 35-70% complications!
14. **DPO** = 2-cut · lower complications · modern preferred
15. **THR** = best function but ~150K baht/side
16. **FHO** = salvage, best in dogs < 20 kg
17. **Conservative Tx** for ALL: weight management + NSAIDs + walking
18. **Calorie restriction** scientifically reduces OA development

> 📚 อ่านควบ: 8.2 OA (VJ8ixtXP9XU) · 9.1 LCP (Spz38qa5upU) · 9.3 Patella Luxation (CIUpw8GNtQ4) · 11 Common Joint (MMTtwT_7c94) · 12 Cruciate (9U-Dgu0ouUk) · 15.1 Elbow (Os6MWLC8oso) · 15.3 Rehab (zj4go8swIgM)
> 🩻 8 video clips ใน MyCRView สำหรับ Ortolani technique + osteotomy steps
> 💊 Genetic counseling: ถ้าหมาเป็น CHD → **ไม่ควรเอามา breed!**`,
  },

  // ─────────────────────────────────────────────────────────────
  // COM II — 9.3 Patellar Luxation (MPL/LPL) (Y4/1)
  // ─────────────────────────────────────────────────────────────
  CIUpw8GNtQ4: {
    videoId: 'CIUpw8GNtQ4',
    title: '9.3. Patellar Luxation (MPL/LPL)',
    subject: 'com2',
    date: '16 Oct 67 (รุ่นพี่)',
    durationMin: 127,
    instructor: 'อ. (รุ่นพี่ — ปกติสอน 3 ชม. รวบ 2 ชม.)',
    examFormat: 'MCQ — extensor mechanism · MPL > LPL · 4 grades · varus + external torsion · 6 surgical methods · concurrent CCL rupture (10-40%) ออกบ่อย',
    summary: `# Patellar Luxation (MPL / LPL)

> 🎯 บทยาวสุด 127 นาที (น้อยกว่า com1 video 3 แต่เป็น 2nd longest com2)
> ⚠️ **#1 ortho disease in small breed dogs** — Pomeranian, Chihuahua, Yorkie, Pug...
> Top exam: **Extensor mechanism · MPL = 95% in small dogs · 4 grades · Trochleoplasty types · CCL co-occurrence**

---

## 1. Stifle Joint Anatomy ⭐⭐ (Recap)

### 1.1 Extensor Mechanism ⭐⭐⭐ (KEY!)
**4 muscles ของ Quadriceps femoris**:
| Muscle | Origin | Function |
|---|---|---|
| **Vastus lateralis** | Proximal femur (lateral) | Extend stifle |
| **Vastus medialis** | Proximal femur (medial) | Extend stifle |
| **Vastus intermedius** | Proximal femur (cranial) | Extend stifle |
| **Rectus femoris** ⭐ | **Acetabular rim** (NOT femur!) | Extend stifle + flex hip |

→ All converge into **Quadriceps tendon** → **Patella** (sesamoid) → **Patellar ligament** → **Tibial tuberosity**

### 1.2 Joint Stabilizers
- **Cranial cruciate ligament (CCL)** — prevents tibia from moving cranial
- **Caudal cruciate ligament** — prevents caudal movement
- **Medial + Lateral collateral ligament** — prevents varus/valgus
- **Medial + Lateral menisci** — shock absorption
- **Patella + femoral trochlear sulcus** — extensor articulation

### 1.3 Patellofemoral Articulation
- **Patella** = largest sesamoid bone in body
- **Trochlear groove (sulcus)** with **medial + lateral trochlear ridges**
- Patella moves up-down within groove during flex/extend

---

## 2. Definition + Classification ⭐⭐⭐

### 2.1 Direction
| Type | Direction | Frequency |
|---|---|---|
| **MPL (Medial Patellar Luxation)** ⭐⭐⭐ | Inward | **95% in small breeds** · 60% in large breeds |
| **LPL (Lateral Patellar Luxation)** | Outward | More common in large breeds |
| **Bidirectional / Bilateral** | Both ways | Rare · complex |

### 2.2 4 Grades ⭐⭐⭐ (จำให้แม่น!)

| Grade | Behavior | Manipulation |
|---|---|---|
| **Grade 1** | Patella in groove · won't luxate during normal activity | Need induced (push) to luxate · self-reduces |
| **Grade 2** | Luxates intermittently (during activity) | Easy to push out · self-reduces |
| **Grade 3** ⭐ | **Permanent luxation** but **manually reducible** | Patella outside groove always · can push back |
| **Grade 4** ⭐ | **Permanent luxation** + **NOT reducible** | Locked outside · fibrous tissue holds |

⭐ **Grade 1 = no clinical signs typically** · Grade 2-3 = skipping · Grade 4 = "praying position" gait

---

## 3. Predisposing Breeds ⭐⭐⭐

### 3.1 Small Breeds (95% MPL!) ⭐
| Top breeds |
|---|
| **Pomeranian** ⭐ |
| **Chihuahua** ⭐ |
| **Yorkshire Terrier** |
| **Poodle (Toy/Miniature)** |
| **Shih Tzu** |
| **Pug** |
| **West Highland White Terrier** |

### 3.2 Large Breeds (LPL more common)
- **Bangkaew (Thai)**
- Akita
- Siberian Husky
- Saint Bernard

---

## 4. Etiology

| Cause | Detail |
|---|---|
| **Developmental** ⭐ (most common) | Onset puppyhood (2-12 months) · grows into deformity |
| **Congenital** | Born luxated (rare) |
| **Traumatic** | CCL rupture · acute injury (rare) |

---

## 5. Pathogenesis ⭐⭐⭐ (KEY!)

### 5.1 Cycle Pattern (similar to CHD!)
> **Soft tissue origin → bone deformity** (NOT vice versa!)

### 5.2 MPL Sequence
1. Joint capsule + medial ligaments **weak/lax**
2. Patella shifts **medially**
3. Quadriceps pulls patella + tibia **inward**
4. **Femoral varus** develops (medial deviation distal femur)
5. **External torsion of femur** (compensatory)
6. **Tibial tuberosity** shifts medially
7. **External torsion of tibia** (extreme cases)
8. **Tibial varus** + foot deformities (cow-hocked)
9. Trochlear groove **doesn't develop deep** (no patellar stress to groove)

⭐ **Net result**: "Bow-legged" appearance with knees pointing inward, feet pointing outward in severe MPL

### 5.3 Trochlear Groove Pathology ⭐
| Severity | Groove |
|---|---|
| **Mild** | Shallow but present |
| **Moderate** | Flat |
| **Severe** | **Convex** (hypoplastic ridge) — opposite of normal! |

### 5.4 Concurrent CCL Rupture ⭐⭐⭐
- **10-40% of MPL dogs have concurrent CCL rupture**!
- **Why**: 3 factors:
  1. Extensor mechanism shifted medially → tibial **internal rotation** stress on CCL
  2. **OA inflammatory cytokines** weaken CCL
  3. **Quadriceps atrophy** → joint instability → CCL stress

⚠️ **Always check for CCL in older MPL dogs!**

---

## 6. Clinical Signs ⭐⭐⭐

| Sign | Detail |
|---|---|
| **Skipping gait** ⭐ | กระโดดสั้นๆ · ขาลอย-วาง สลับกัน · MPL Grade 2 typical |
| **Bunny hopping** | Both hindlimbs jump together |
| **"Cowhock" stance** | LPL — แมวน้ำ position · ขาแบะ |
| **Praying position** ⭐ | MPL Grade 4 — เดินย่อขา (extension impossible) |
| **Lameness** | Variable · intermittent or persistent |
| **Reluctance to exercise** | Pain |
| **Quadriceps atrophy** | Chronic disuse |
| **Limb shortening** | When measuring 2 legs together |

⚠️ **Asymptomatic Bilateral MPL Grade 2 is common** — dogs run normally!

---

## 7. Physical Exam — Key Tests ⭐⭐

### 7.1 Patellar Glide Test
- Stifle in extension
- Push patella medially → does it luxate?
- Push laterally → does it luxate?

### 7.2 Reduction Test
- After luxation, does it pop back **spontaneously**? (Grade 1-2)
- Or only with **manual push**? (Grade 3)
- Or **NOT at all**? (Grade 4)

### 7.3 Trochlear Test
- Palpate trochlear ridges → "click" felt during flex/extend
- Can detect groove abnormality through skin in some cases

---

## 8. Imaging ⭐⭐⭐

### 8.1 X-ray Views
1. **VD (frontal/cranio-caudal)** — assess limb alignment + tibial torsion
2. **Lateral** — assess patellar position + height
3. **Skyline view** — direct visualization of trochlear groove cross-section ⭐

### 8.2 True VD Criteria ⭐
- Femurs **parallel + perpendicular** to floor
- Pelvis **symmetric**
- Both **fabellae visible** (patella height markers)
- Trochlear groove visible

### 8.3 CT Scan ⭐
**Indications**:
- Severe deformity (Grade 3-4)
- Pre-op planning for osteotomy
- Bilateral assessment

---

## 9. Bone Angle Measurements ⭐⭐⭐ (สำคัญ!)

### 9.1 Anatomical vs Mechanical AIS
| Type | When to use |
|---|---|
| **Anatomical AIS** (mid-bone landmark) | Straight bones (femur usually) |
| **Mechanical AIS** (proximal-distal joint center) | Curved bones (tibia + deformed femur) |

⭐ **Anatomical AIS** = midpoint at **33% and 50%** of bone length

### 9.2 Naming Convention (4-letter code) ⭐⭐⭐
| Letter | Meaning |
|---|---|
| **m** = mechanical OR **a** = anatomical | AIS type |
| **L** = lateral OR **M** = medial | Side of measurement |
| **P** = proximal OR **D** = distal | Position |
| **F** = femur OR **T** = tibia | Bone |
| **A** = Angle | Always |

**Examples**:
- **mLDFA** = mechanical Lateral Distal Femoral Angle (~95° normal · key for MPL!)
- **mMPTA** = mechanical Medial Proximal Tibial Angle
- **mMDTA** = mechanical Medial Distal Tibial Angle

### 9.3 Femoral Anteversion Angle ⭐
- Normal: **~27°** (range 12-36°)
- **Increased** = excessive femoral antetorsion = MPL risk

### 9.4 Patella Alta vs Baja ⭐⭐
**Reach (Reichelt) Index** = Patellar tendon length / Patella length
- **Normal**: 1.9-2.06
- **Patella Alta** (high-riding): Index > 2.06 → **MPL recurrence risk!**
- **Patella Baja**: low-riding · less common

---

## 10. Surgical Treatment ⭐⭐⭐ (6 Categories!)

### 10.1 Goal
1. **Re-alignment** of extensor mechanism
2. **Stabilization** of patella in trochlea
3. **Restore function** without luxation

---

### 10.2 Soft Tissue Procedures

#### 10.2.1 Medial Desmotomy ⭐
- **Cut/release** medial joint capsule (medial release)
- Required when patella stuck medially → can't reduce

#### 10.2.2 Lateral Imbrication
- **Tighten** lateral joint capsule by overlapping suture (mattress pattern)
- Pulls patella toward lateral → centers it

#### 10.2.3 Sartorius Tenotomy
- **Cut sartorius muscle insertion** at medial side
- Reduces medial pull on extensor mechanism

#### 10.2.4 Rectus Femoris Release ⭐
- **Modify origin** of rectus femoris from acetabular rim
- For "bow-conformation" breeds (Pekingese, Bulldog)

#### 10.2.5 Modified Fascia Lata Transplantation
- **Slide fascia lata** from lateral to medial
- Closes joint capsule defect after large medial release

#### 10.2.6 Anti-Rotational Sutures ⭐
| Type | Detail |
|---|---|
| **Patella Anti-rotational suture** | Loop around lateral fabella + over patella · pulls it laterally |
| **Tibial Anti-rotational suture** | Lateral fabella → tibial tuberosity · prevents internal rotation |

⚠️ **Best in puppies < 1 year** (sutures can guide bone growth)

---

### 10.3 Bone Procedures (Trochleoplasty) ⭐⭐⭐

#### 10.3.1 Trochlear Chondroplasty (1969 - OUTDATED!) ❌
- Scrape away articular cartilage + subchondral bone
- ⚠️ **Causes severe OA** — heals as fibrocartilage (poor!)

#### 10.3.2 Trochlear Wedge Resection ⭐
- Cut **wedge-shaped piece** of trochlea (V-shape)
- Remove some base cartilage
- Replace wedge → groove deeper
- ⭐ **Preserves articular cartilage**

#### 10.3.3 Trochlear Block Resection ⭐
- Cut **rectangular block** (wider area)
- Wider groove than wedge
- ⭐ **Standard technique** today

#### 10.3.4 Modified Trochleoplasty (Flap Technique) ⭐
- Cut **3 sides** only (not 4)
- Lift cartilage as **flap**
- Scrape bone underneath
- Replace flap
- ⚠️ Only works in **young dogs < 6 months** (flexible cartilage)

#### 10.3.5 Asymmetric Wedge Trochleoplasty (2013) ⭐
- Cut **asymmetric wedge** (one side acute, other obtuse)
- **Rotate 180°** → creates new ridge
- Use K-wire to stabilize
- ⭐ Newer modification

#### 10.3.6 Patellar Groove Replacement (PGR)
- **Titanium prosthesis** replaces trochlea
- Salvage procedure for failed surgeries
- Last resort

---

### 10.4 Realignment Procedures

#### 10.4.1 Tibial Tuberosity Transposition (TTT) ⭐⭐⭐
- **Cut tibial tuberosity** with osteotome
- **Move it laterally** (for MPL)
- **Stabilize with 2 K-wires** (or tension band wire if needed)

⭐ **Why 2 pins?**
- 1 pin → bone can rotate around pin
- 2 pins → **anti-rotation** lock

⚠️ Pin direction: **upward parallel to bone axis** (resists quadriceps pull · NOT downward!)

#### 10.4.2 Distal Femoral Osteotomy (dFO) ⭐⭐⭐ (KEY for severe!)

**Indication**: Severe femoral varus deformity (mLDFA significantly off from breed-specific normal)

**Technique**:
1. Measure mLDFA on X-ray (normal ~95° in many breeds)
2. Calculate correction angle needed
3. **Cut wedge of bone** (lateral side, base outward)
4. Remove wedge → close osteotomy → straightens bone
5. **Plate fixation** with 2-screw plates per fragment

⭐ Must use **breed-specific normal mLDFA** values

#### 10.4.3 Distal Tibial Osteotomy
- Same concept, for tibial varus deformity

---

### 10.5 Other Modalities

#### 10.5.1 Ridge Stop ⭐
- **Polyethylene implant** to elevate trochlear ridge
- For cases with hypoplastic single ridge
- Used in cats with large patella

#### 10.5.2 Patellar Plasty (Lateral Patellar Cut)
- Trim **lateral edge** of patella
- For overly wide patella in deep groove
- Last resort

---

## 11. Procedure Selection ⭐⭐⭐

| Scenario | Recommended |
|---|---|
| Grade 1-2 + young + soft tissue origin | **Soft tissue procedures only** (TTT + Anti-rotational sutures) |
| Grade 2-3 + shallow groove | **Trochleoplasty + TTT** + soft tissue |
| Grade 3-4 + bone deformity | **Add dFO ± Tibial osteotomy** (combined) |
| Failed surgery / End-stage | **PGR or arthrodesis** |

---

## 12. Complications ⭐⭐

| Type | Rate | Examples |
|---|---|---|
| **Overall complications** | 18-43% | Swelling · seroma · wound dehiscence |
| **Major complications** | 13-24% | Re-luxation · pin failure · implant failure |
| **Recurrent MPL** ⭐ | **6-20%** | Repeated luxation requiring 2nd surgery |

### Risk Factors for Complications
- **Larger dogs** ⭐
- **Higher grade** (3-4)
- **Obesity**
- **Failure to address bony deformity** (relying on soft tissue alone)

---

## 13. Post-op Management ⭐

| Action | Timing |
|---|---|
| **Pain control** | Multimodal · NSAIDs + opioids |
| **Cold packing** | First 3 days (bvomotsing) |
| **Joint mobilization** | Early — **prevent ankylosis** |
| **Confine** (cage rest) | 4-6 weeks |
| **Restrict jumping** | Long-term |
| **Rehab** | Hydrotherapy · TENS · LASER (covered in 15.3) |
| **Re-luxation appears** | Within 1-2 weeks usually (early problem!) |

---

## 14. Conservative Treatment

**Indication**: Grade 1, asymptomatic, owner declines surgery, very old dog with comorbidities

**Plan**:
- Pain control as needed
- Weight management
- Activity modification (no jumping)
- Monitor progression

⚠️ Bone deformity progresses without surgical intervention

---

## 📝 EXAM RECAP — 22 Key Points

1. **Extensor mechanism** = quadriceps + patella + patellar tendon + tibial tuberosity
2. **Rectus femoris** ≠ other 3 vasti — originates from **acetabular rim** (not femur!)
3. **MPL = 95% in small breeds** ⭐ · LPL more common in large breeds
4. **Predisposing**: Pomeranian · Chihuahua · Yorkie · Pug · Poodle · Shih Tzu · Westy
5. **4 Grades**: 1 (induced only) · 2 (intermittent) · 3 (permanent reducible) · 4 (permanent irreducible)
6. **Pathogenesis**: soft tissue → bone (femoral varus + external torsion + tibial tuberosity shift)
7. **Trochlear groove pathology**: shallow → flat → **convex** in severe cases
8. **CCL rupture co-occurs in 10-40% of MPL** ⭐ — always check older MPL dogs
9. **Skipping gait** = MPL Grade 2 typical
10. **"Praying position"** = MPL Grade 4 (extension impossible)
11. **Bone angle conventions**: m/aLDFA, mMPTA, mMDTA — letter codes for measurement
12. **mLDFA normal ~95°** (breed-specific) · key for dFO planning
13. **Patella Alta** (Reichelt > 2.06) = MPL recurrence risk
14. **Anti-rotational sutures** = best in **puppies < 1 yr** ⭐
15. **Trochleoplasty types**: Chondroplasty (outdated) · Wedge · Block (standard) · Flap · Asymmetric
16. **Block trochleoplasty** = current standard ⭐
17. **TTT** with **2 K-wires** for anti-rotation · upward direction
18. **dFO** for severe femoral varus → wedge osteotomy + plate
19. **PGR (Patellar Groove Replacement)** = salvage with titanium implant
20. **Concurrent disease**: always check Hip Dysplasia, LCP, CCL in MPL cases
21. **Complications**: 18-43% overall · 13-24% major · 6-20% recurrent
22. **Re-luxation appears within 1-2 weeks** post-op typically

> 📚 อ่านควบ: 8.2 OA (VJ8ixtXP9XU) · 9.1 LCP (Spz38qa5upU) · 9.2 Hip Dysplasia (hIlH1i845wI) · 11 Common Joint (MMTtwT_7c94) · 12 Cruciate (9U-Dgu0ouUk) · 15.3 Rehab (zj4go8swIgM)
> 📺 Supplementary clips: 9.3.1-9.3.5 (Normal articulation, MPL/LPL, Femoral torsion, Distal femoral osteotomy I-II)
> 💊 **Practice tip**: เด็กๆ มี MPL Grade 1-2 → ผ่าตัดเร็วป้องกัน bone deformity progression`,
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
