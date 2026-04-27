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
