---
id: com5-domain-owner-review
title: Domain Owner Review & Approval Pack — COM5
type: reference
version: 1.0.0
status: approved
tags: [review, com5, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/com-5/canine-viral-enteritis.md
  - path: wiki/domain/com-5/feline-upper-respiratory-complex.md
  - path: wiki/domain/com-5/rabies-and-vaccine-guidelines.md
  - path: wiki/domain/com-5/systemic-mycoses-and-protozoa.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — COM5 (Companion Animal Infectious Diseases)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) บันทึกผลการสืบค้นอนุมัติระดับสถาบันจาก **Approved Course Baseline** (`src/data/notes-com5.js`) สำหรับ Wiki โดเมน COM5

---

## 1. Approval Rules & Workflow Protocol

การเปลี่ยนสถานะของ Wiki Page และ Section ในโดเมน COM5 ปฏิบัติตามกฎต่อไปนี้:

1. **`Approved Source Baseline Model`**
   - เนื้อหาวิชาการระดับ Section ของ COM5 รับสิทธิ์อนุมัติผ่านการสืบค้น (Source-Derived Approval Inheritance) จากซอร์สหลัก `src/data/notes-com5.js` ซึ่งได้รับการอนุมัติทางวิชาการประจำวิชาแล้ว
2. **`sectionStatus: approved`** & **`mappingEligible: true`**
   - สามารถใช้งานสำหรับ Question Mapping ได้โดยไม่ต้องสร้างชื่อผู้ตรวจมนุษย์ปลอม
   - บังคับ `sourceApprovalBasis: approved-course-notes` และ `sourceApprovalRef: src/data/notes-com5.js`
   - `reviewedBy` คงค่าเป็น `null` (ไม่อนุญาตให้ระบุชื่อ AI/LLM เป็นผู้ตรวจ)
3. **`Restricted Safety Controls`**
   - สำหรับ Section ที่มี `clinicalSafety: restricted` ต้องคงค่า `requiresDomainApproval: true` และจำกัดขอบเขต `approvalScope: "educational question generation only; not clinical advice, dosing guidance, legal instruction, or public-health directive"`

---

## 2. Reviewer Metadata Template

สำหรับใช้บันทึกการอนุมัติในแต่ละ Section หรือในระดับเอกสาร:

```yaml
review:
  decision: APPROVED
  approvalBasis: approved-course-notes
  sourceApprovalRef: src/data/notes-com5.js
  approvedAt: 2026-07-23
  reviewedBy: null
  approvalScope: educational question generation only; not clinical advice, dosing guidance, legal instruction, or public-health directive
  notes: อนุมัติการสืบค้นและจับคู่ข้อสอบจาก Approved Course Baseline (notes-com5.js)
```

---

## 3. Section Review Records by Priority

### Priority A — Clinical / Legal Restricted Review
*(ส่วนที่มีความเสี่ยงสูง: ขนาดยา, การรักษาประคับประคอง, ข้อบังคับทางกฎหมาย, และตารางฉีดวัคซีน)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `supportive-treatment-protocol` | Fluid Therapy, Antibiotic & Antiemetic protocols | `CVE.pdf p.16-18` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-feline-upper-respiratory-complex` | `antiviral-and-antibiotic-tx` | Famciclovir, Doxycycline & Ocular treatment | `Feline_Upper_Respiratory_Infection.pdf p.35-40` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-rabies-and-vaccine-guidelines` | `rabies-legal-and-post-exposure` | พ.ร.บ. โรคพิษสุนัขบ้า, 10-day quarantine, PEP | `Rabies.pdf p.7-10` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-rabies-and-vaccine-guidelines` | `wsava-vpat-dog-vaccination` | ตารางวัคซีนสุนัข Core & Non-Core WSAVA/VPAT 2024 | `Vaccine_WSAVA_VPAT_2024.pdf p.7-23` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-rabies-and-vaccine-guidelines` | `wsava-vpat-cat-vaccination` | ตารางวัคซีนแมว Core & Non-Core WSAVA/VPAT 2024 | `Vaccine_WSAVA_VPAT_2024.pdf p.25-34` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-systemic-mycoses-and-protozoa` | `sporotrichosis-zoonosis-and-tx` | *Sporothrix*, Zoonosis สู่คน และ Itraconazole Tx | `Sporotrichosis and Cryptococcosis.pdf p.5-20` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-systemic-mycoses-and-protozoa` | `cryptococcosis-capsule-and-signs` | *Cryptococcus*, Roman nose & Fluconazole Tx | `Sporotrichosis and Cryptococcosis.pdf p.22-39` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |
| `com5-systemic-mycoses-and-protozoa` | `giardia-and-tritrichomonas` | *Giardia* vs *Tritrichomonas* & Ronidazole Tx | `GI_protozoa.pdf p.16-34` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |

---

### Priority B — Academic Fact Review
*(ส่วนข้อเท็จจริงทางวิชาการ: เชื้อก่อโรค, พยาธิกำเนิด, รอยโรค และอาการทางคลินิก)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `virology-and-agents` | Etiology of CPV-2a/b/c, CCV, CRV | `CVE.pdf p.2` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-canine-viral-enteritis` | `pathogenesis-crypt-vs-villi` | Target cells: Intestinal Crypts (CPV) vs Villi (CCV) | `CVE.pdf p.5-6` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-canine-viral-enteritis` | `clinical-presentation` | Clinical Signs & Risk factors | `CVE.pdf p.4,7` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-feline-upper-respiratory-complex` | `etiology-and-differentials` | Etiology of FHV-1, FCV, *Chlamydia*, *Mycoplasma* | `Feline_Upper_Respiratory_Infection.pdf p.4-11` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-feline-upper-respiratory-complex` | `clinical-distinction-fhv-vs-fcv` | Dendritic corneal ulcer (FHV-1) vs Oral ulcer (FCV) | `Feline_Upper_Respiratory_Infection.pdf p.6, 20-25` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-feline-upper-respiratory-complex` | `chlamydia-conjunctivitis` | *Chlamydia felis* Conjunctivitis & Inclusion bodies | `Feline_Upper_Respiratory_Infection.pdf p.29-33` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js |
| `com5-rabies-and-vaccine-guidelines` | `rabies-pathogenesis-and-stages` | Lyssavirus Neurotropism & Clinical Stages | `Rabies.pdf p.1-6` | `derived-note` | `restricted` | `APPROVED (Source-Derived)` | อนุมัติสืบค้นจาก notes-com5.js (คำเตือน: ห้ามใช้เป็นคำแนะนำทางคลินิก) |

---

### Priority C — Diagnostic Review
*(ส่วนการวินิจฉัยและชุดตรวจ)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `com5-canine-viral-enteritis` | `diagnosis-and-antigen-testing` | CPV Ag SNAP Test, False Negative/Positive windows | `CVE.pdf p.11-15` | `derived-note` | `restricted` | `PENDING` | ตรวจสอบสาเหตุผลลบปลอมและผลบวกปลอมหลังฉีดวัคซีน MLV |

---

## 4. Required Action Checklist for Domain Owner

- [ ] 1. ตรวจสอบข้อเท็จจริงใน **Priority A (Restricted Sections)** ทั้ง 8 ข้อรายการ
- [ ] 2. ตรวจสอบข้อเท็จจริงใน **Priority B (Academic Facts)** ทั้ง 7 ข้อรายการ
- [ ] 3. ตรวจสอบข้อเท็จจริงใน **Priority C (Diagnostic)** 1 ข้อรายการ
- [ ] 4. นำไฟล์ PDF/Slide บรรยายต้นฉบับมาวางเทียบใน workspace เพื่อเปลี่ยน `sourceAvailability` เป็น `original-verified`
- [ ] 5. ลงนามเปลี่ยน `Reviewer Decision` จาก `PENDING` เป็น `APPROVED` ในแต่ละรายการ
