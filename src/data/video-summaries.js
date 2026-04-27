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

```
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
```

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
