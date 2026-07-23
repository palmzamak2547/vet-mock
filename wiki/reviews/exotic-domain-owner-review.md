---
id: exotic-domain-owner-review
title: Domain Owner Review & Approval Pack — EXOTIC
type: reference
version: 1.0.0
status: draft
tags: [review, exotic, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/exotic/avian-and-reptile-medicine.md
  - path: wiki/domain/exotic/small-mammal-medicine.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — EXOTIC (Wildlife & Exotic Pets)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) เพื่อตรวจสอบ รับรอง และอนุมัติเนื้อหาวิชาการ Wiki โดเมน EXOTIC ก่อนเปลี่ยนสถานะเป็น Approved และก่อนเปิดใช้งาน Question Mapping

---

## 1. Reviewer Metadata Template

```yaml
review:
  decision: pending # "pending" | "approved" | "rejected" | "requires_revision"
  reviewedBy: null  # เช่น "ผศ.สพ.ญ. ดร. ..."
  reviewedAt: null  # รูปแบบ YYYY-MM-DD
  approvalScope: null # "full" | "restricted_only" | "academic_only"
  notes: null
```

---

## 2. Section Review Records by Priority

### Priority A — Clinical / Restricted Review
*(ส่วนที่มีความเสี่ยงสูง: สภาวะ MBD, ยาทางเดินอาหารกระต่าย, โรคต่อมไร้ท่อเฟอร์เรต)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `exotic-avian-and-reptile-medicine` | `reptile-husbandry-and-metabolic-bone` | UVB, Ca:P ratio & MBD treatment | `Reptile section p.11-18` | `derived-note` | `restricted` | `PENDING` | MISSING_SOURCE_EVIDENCE in notes-exotic.js (midterm scope uncollected) |
| `exotic-small-mammal-medicine` | `rabbit-gi-stasis-and-dental-disease` | Rabbit GI stasis & Prokinetics Tx | `Rabbit section p.19-27` | `derived-note` | `restricted` | `PENDING` | MISSING_SOURCE_EVIDENCE in notes-exotic.js (midterm scope uncollected) |
| `exotic-small-mammal-medicine` | `ferret-endocrine-diseases` | Ferret Adrenal disease & Insulinoma Tx | `Ferret section p.28-35` | `derived-note` | `restricted` | `PENDING` | MISSING_SOURCE_EVIDENCE in notes-exotic.js (midterm scope uncollected) |

---

### Priority B — Academic Fact Review
*(ส่วนข้อเท็จจริงทางวิชาการ: กายวิภาคปอดนก, เชื้อก่อโรคในนก, ฟันกระต่าย)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `exotic-avian-and-reptile-medicine` | `avian-anatomy-and-common-diseases` | Avian respiratory anatomy & Chlamydia/PBFD/PDD | `Avian section p.1-10` | `derived-note` | `standard` | `APPROVED (Source-Derived)` | Approved via course baseline src/data/notes-exotic.js |

---

## 3. Required Action Checklist for Domain Owner

- [ ] 1. ตรวจสอบข้อเท็จจริงใน **Priority A (Restricted Sections)** ทั้ง 3 รายการ
- [ ] 2. ตรวจสอบข้อเท็จจริงใน **Priority B (Academic Facts)** 1 รายการ
- [ ] 3. นำไฟล์ PDF/Slide บรรยายต้นฉบับมาวางเทียบใน workspace เพื่อเปลี่ยน `sourceAvailability` เป็น `original-verified`
- [ ] 4. ลงนามเปลี่ยน `Reviewer Decision` จาก `PENDING` เป็น `APPROVED` ในแต่ละรายการ
