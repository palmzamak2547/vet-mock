---
id: com5-domain-owner-review
title: Domain Owner Review & Approval Pack — COM5
type: reference
version: 1.0.0
status: draft
tags: [review, com5, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/com-5/canine-viral-enteritis.md
  - path: wiki/domain/com-5/feline-upper-respiratory-complex.md
  - path: wiki/domain/com-5/rabies-and-vaccine-guidelines.md
  - path: wiki/domain/com-5/systemic-mycoses-and-protozoa.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — COM5 (Companion Animal Infectious Diseases)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) เพื่อตรวจสอบ รับรอง และอนุมัติเนื้อหาวิชาการ Wiki โดเมน COM5 ก่อนเปลี่ยนสถานะเป็น Approved และก่อนเปิดใช้งาน Question Mapping ใน Phase 2B

---

## 1. Approval Rules & Workflow Protocol

การเปลี่ยนสถานะของ Wiki Page และ Section ในโดเมน COM5 ต้องปฏิบัติตามกฎต่อไปนี้:

1. **`sectionStatus: reviewed`**
   - สามารถปรับได้เมื่อผู้ตรวจสอบ (Reviewer) ตรวจสอบและยืนยันว่าข้อความวิชาการ (Claims) และตำแหน่งอ้างอิงสไลด์ (Source Locators) มีความถูกต้องตรงตามสไลด์คำสอนจริง
2. **`sectionStatus: approved`**
   - สามารถปรับได้เมื่อผู้ตรวจสอบอนุมัติให้ใช้เนื้อหา Section นี้เป็น Knowledge Source สำหรับระบบ AI (SmartGrader / AI Question Generator) ได้อย่างปลอดภัย
3. **`mappingEligible: true`**
   - จะสามารถปรับเป็น `true` ได้ก็ต่อเมื่อผ่านเงื่อนไขครบถ้วนทุกข้อดังนี้:
     - `page status` = `approved`
     - `sectionStatus` = `approved`
     - `sourceAvailability` = `original-verified` (มีไฟล์ PDF/Slide ต้นฉบับถูกนำมาตรวจสอบเทียบใน workspace เรียบร้อยแล้ว)
     - `clinicalSafety` ผ่านการอนุมัติตาม Safety Policy
     - ผู้ตรวจสอบ (Reviewer) ลงนามและระบุวันที่อนุมัติจริงใน Review Record

---

## 2. Reviewer Metadata Template

สำหรับใช้บันทึกการอนุมัติในแต่ละ Section หรือในระดับเอกสาร:

```yaml
review:
  decision: pending # "pending" | "approved" | "rejected" | "requires_revision"
  reviewedBy: null  # เช่น "ผศ.สพ.ญ. ดร. ..." หรือชื่ออาจารย์ผู้สอน
  reviewedAt: null  # รูปแบบ YYYY-MM-DD
  approvalScope: null # "full" | "restricted_only" | "academic_only"
  notes: null
```

---

## 3. Section Review Records by Priority

### Priority A — Clinical / Legal Restricted Review
*(ส่วนที่มีความเสี่ยงสูง: ขนาดยา, การรักษาประคับประคอง, ข้อบังคับทางกฎหมาย, และตารางฉีดวัคซีน)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `supportive-treatment-protocol` | Fluid Therapy, Antibiotic & Antiemetic protocols | `CVE.pdf p.10-12` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันขนาดยาและการให้สารน้ำ |
| `com5-feline-upper-respiratory-complex` | `antiviral-and-antibiotic-tx` | Famciclovir, Doxycycline & Ocular treatment | `Feline_URI.pdf p.11-15` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันข้อควรระวัง Esophageal stricture จาก Doxycycline |
| `com5-rabies-and-vaccine-guidelines` | `rabies-legal-and-post-exposure` | พ.ร.บ. โรคพิษสุนัขบ้า, 10-day quarantine, PEP | `Rabies.pdf p.7-10` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันขั้นตอนกักสังเกตอาการ 10 วัน และแนวทาง PEP |
| `com5-rabies-and-vaccine-guidelines` | `wsava-vpat-dog-vaccination` | ตารางวัคซีนสุนัข Core & Non-Core WSAVA/VPAT 2024 | `Vaccine_WSAVA_VPAT_2024.pdf p.1-10` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจเทียบช่วงอายุ 16-20 สัปดาห์ และระยะกระตุ้นทุก 3 ปี |
| `com5-rabies-and-vaccine-guidelines` | `wsava-vpat-cat-vaccination` | ตารางวัคซีนแมว Core & Non-Core WSAVA/VPAT 2024 | `Vaccine_WSAVA_VPAT_2024.pdf p.11-20` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจเทียบโปรโตคอล FeLV ในแมวเด็ก |
| `com5-systemic-mycoses-and-protozoa` | `sporotrichosis-zoonosis-and-tx` | *Sporothrix*, Zoonosis สู่คน และ Itraconazole Tx | `Mycoses.pdf p.1-8` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจระยะเวลาการรักษาด้วย Itraconazole หลังรอยโรคหาย |
| `com5-systemic-mycoses-and-protozoa` | `cryptococcosis-capsule-and-signs` | *Cryptococcus*, Roman nose & Fluconazole Tx | `Mycoses.pdf p.9-18` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจการเลือกใช้ Fluconazole ผ่าน BBB |
| `com5-systemic-mycoses-and-protozoa` | `giardia-and-tritrichomonas` | *Giardia* vs *Tritrichomonas* & Ronidazole Tx | `Protozoa.pdf p.1-14` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจขนาดยา Ronidazole และคำเตือน Neurotoxicity |

---

### Priority B — Academic Fact Review
*(ส่วนข้อเท็จจริงทางวิชาการ: เชื้อก่อโรค, พยาธิกำเนิด, รอยโรค และอาการทางคลินิก)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `virology-and-agents` | Etiology of CPV-2a/b/c, CCV, CRV | `CVE.pdf p.2` | `derived-note` | `standard` | `PENDING` | ตรวจสอบการจำแนกประเภทไวรัส |
| `com5-canine-viral-enteritis` | `pathogenesis-crypt-vs-villi` | Target cells: Intestinal Crypts (CPV) vs Villi (CCV) | `CVE.pdf p.5-6` | `derived-note` | `standard` | `PENDING` | ตรวจสอบความถูกต้องของกลไกพยาธิกำเนิด |
| `com5-canine-viral-enteritis` | `clinical-presentation` | Clinical Signs & Risk factors | `CVE.pdf p.4,7` | `derived-note` | `standard` | `PENDING` | ตรวจสอบสายพันธุ์สุนัขที่มีความเสี่ยง |
| `com5-feline-upper-respiratory-complex` | `etiology-and-differentials` | Etiology of FHV-1, FCV, *Chlamydia*, *Mycoplasma* | `Feline_URI.pdf p.1-3` | `derived-note` | `standard` | `PENDING` | ตรวจสอบคุณสมบัติเชื้อก่อโรค 4 ชนิด |
| `com5-feline-upper-respiratory-complex` | `clinical-distinction-fhv-vs-fcv` | Dendritic corneal ulcer (FHV-1) vs Oral ulcer (FCV) | `Feline_URI.pdf p.4-7` | `derived-note` | `standard` | `PENDING` | ตรวจสอบลักษณะรอยโรคจำเพาะ |
| `com5-feline-upper-respiratory-complex` | `chlamydia-conjunctivitis` | *Chlamydia felis* Conjunctivitis & Inclusion bodies | `Feline_URI.pdf p.8-10` | `derived-note` | `standard` | `PENDING` | ตรวจสอบย้อมสี Cytology inclusion bodies |
| `com5-rabies-and-vaccine-guidelines` | `rabies-pathogenesis-and-stages` | Lyssavirus Neurotropism & Clinical Stages | `Rabies.pdf p.1-6` | `derived-note` | `restricted` | `PENDING` | ตรวจสอบการเคลื่อนตัวแบบ Retrograde axoplasmic flow |

---

### Priority C — Diagnostic Review
*(ส่วนการวินิจฉัยและชุดตรวจ)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `diagnosis-and-antigen-testing` | CPV Ag SNAP Test, False Negative/Positive windows | `CVE.pdf p.9` | `derived-note` | `restricted` | `PENDING` | ตรวจสอบสาเหตุผลลบปลอมและผลบวกปลอมหลังฉีดวัคซีน MLV |

---

## 4. Required Action Checklist for Domain Owner

- [ ] 1. ตรวจสอบข้อเท็จจริงใน **Priority A (Restricted Sections)** ทั้ง 8 ข้อรายการ
- [ ] 2. ตรวจสอบข้อเท็จจริงใน **Priority B (Academic Facts)** ทั้ง 7 ข้อรายการ
- [ ] 3. ตรวจสอบข้อเท็จจริงใน **Priority C (Diagnostic)** 1 ข้อรายการ
- [ ] 4. นำไฟล์ PDF/Slide บรรยายต้นฉบับมาวางเทียบใน workspace เพื่อเปลี่ยน `sourceAvailability` เป็น `original-verified`
- [ ] 5. ลงนามเปลี่ยน `Reviewer Decision` จาก `PENDING` เป็น `APPROVED` ในแต่ละรายการ
