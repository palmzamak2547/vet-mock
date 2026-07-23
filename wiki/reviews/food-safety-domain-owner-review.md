---
id: food-safety-domain-owner-review
title: Domain Owner Review & Approval Pack — FOOD-SAFETY
type: reference
version: 1.0.0
status: draft
tags: [review, food-safety, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/food-safety/food-safety-milk-and-meat-hygiene.md
  - path: wiki/domain/food-safety/food-safety-major-zoonoses-and-public-health.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — FOOD-SAFETY (Milk & Meat Hygiene / Zoonoses)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) เพื่อตรวจสอบ รับรอง และอนุมัติเนื้อหาวิชาการ Wiki โดเมน FOOD-SAFETY ก่อนเปลี่ยนสถานะเป็น Approved และก่อนเปิดใช้งาน Question Mapping

---

## 1. Reviewer Metadata Template

```yaml
review:
  decision: PENDING # "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED"
  reviewedBy: null  # เช่น "ศ.สพ.ญ.ดร.รุ่งทิพย์ ชวนชื่น"
  reviewedAt: null  # รูปแบบ YYYY-MM-DD
  approvalScope: null # "educational question generation"
  notes: null
```

---

## 2. Section Review Records by Priority

### Priority A — Clinical & Public Health Restricted Review
*(ส่วนที่มีความเสี่ยงสูงด้านสัตวแพทย์สาธารณสุข: กฎหมายโรงฆ่าสัตว์, อุณหภูมิพาสเจอร์ไรส์, โรคติดเชื้อ Zoonoses รุนแรง)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `food-safety-milk-and-meat-hygiene` | `raw-milk-quality-and-pasteurization` | CMT, SCC, LTLT/HTST/UHT Standards | `notes-y5-milk-meat-hygiene.js` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจอุณหภูมิและเวลามาตรฐาน Pasteurization |
| `food-safety-milk-and-meat-hygiene` | `slaughterhouse-meat-inspection-standards` | Ante/Post-mortem & Condemnation | `notes-y5-milk-meat-hygiene.js` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจมาตรฐานคัดทิ้งซากสัตว์ (Condemnation rules) |
| `food-safety-major-zoonoses-and-public-health` | `bacterial-foodborne-zoonoses` | *Salmonella*, *Campylobacter*, *Listeria* | `notes-y5-zoonoses.js` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันสปีชีส์และพยาธิกำเนิด Zoonoses |
| `food-safety-major-zoonoses-and-public-health` | `parasitic-zoonoses-and-prions` | *Toxoplasma*, *Trichinella*, BSE Prion | `notes-y5-zoonoses.js` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจวงชีวิตพยาธิและเชื้อ Prion |
