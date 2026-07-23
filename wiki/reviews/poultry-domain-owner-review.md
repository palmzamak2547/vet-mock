---
id: poultry-domain-owner-review
title: Domain Owner Review & Approval Pack — POULTRY
type: reference
version: 1.0.0
status: draft
tags: [review, poultry, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/poultry/poultry-viral-and-bacterial-diseases.md
  - path: wiki/domain/poultry/poultry-parasites-and-flock-hygiene.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — POULTRY (Poultry Health Management)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) เพื่อตรวจสอบ รับรอง และอนุมัติเนื้อหาวิชาการ Wiki โดเมน POULTRY ก่อนเปลี่ยนสถานะเป็น Approved และก่อนเปิดใช้งาน Question Mapping

---

## 1. Reviewer Metadata Template

```yaml
review:
  decision: PENDING # "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED"
  reviewedBy: null  # เช่น "อ.ดร.เกรียงวิชญ์ ลิมป์วิทยาคุณ"
  reviewedAt: null  # รูปแบบ YYYY-MM-DD
  approvalScope: null # "educational question generation"
  notes: null
```

---

## 2. Section Review Records by Priority

### Priority A — Clinical / Restricted Review
*(ส่วนที่มีความเสี่ยงสูง: โรคระบาดสัตว์ปีกร้ายแรง HPAI/NDV, ขนาดยาปฏิชีวนะ, โปรแกรมวัคซีน)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `poultry-viral-and-bacterial-diseases` | `major-avian-viral-diseases` | NDV, HPAI, IBV, IBD Lesions | `notes-poultry.js (L10)` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันรอยโรคผ่าซาก Proventriculus |
| `poultry-viral-and-bacterial-diseases` | `avian-mycoplasmosis-and-bacteriology` | MG, MS, Fowl Cholera Pathology | `notes-poultry.js (L11-L13)` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจชนิดรอยโรค Eggshell apex abnormality |
| `poultry-parasites-and-flock-hygiene` | `flock-biosecurity-and-vaccination` | Biosecurity & Vaccination Methods | `notes-poultry.js (L9)` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจวิธีฉีดวัคซีน In ovo และสเปรย์ |

---

### Priority B — Academic Fact Review
*(ส่วนข้อเท็จจริงทางวิชาการ: ชนิด Eimeria, รอยโรคไส้ติ่ง, วงชีวิตพยาธิ)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `poultry-parasites-and-flock-hygiene` | `avian-coccidiosis-and-protozoa` | *Eimeria* species & Blackhead | `notes-poultry.js (Parasite)` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจความถูกต้องตำแหน่งพยาธิสภาพ *E. tenella* vs *E. necatrix* |
