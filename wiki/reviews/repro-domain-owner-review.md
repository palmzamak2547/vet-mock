---
id: repro-domain-owner-review
title: Domain Owner Review & Approval Pack — REPRO-LECT
type: reference
version: 1.0.0
status: draft
tags: [review, repro-lect, approval, domain-owner, evidence-audit]
sourceRefs:
  - path: wiki/domain/repro/canine-feline-theriogenology.md
  - path: wiki/domain/repro/semen-evaluation-preservation.md
lastReviewed: 2026-07-23
---

# Domain Owner Review & Approval Pack — REPRO-LECT (Animal Reproduction)

เอกสารตรวจรับสำหรับอาจารย์ผู้สอนและสัตวแพทย์ผู้เชี่ยวชาญ (Domain Owner / Lecturer) เพื่อตรวจสอบ รับรอง และอนุมัติเนื้อหาวิชาการ Wiki โดเมน REPRO-LECT ก่อนเปลี่ยนสถานะเป็น Approved และก่อนเปิดใช้งาน Question Mapping

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
*(ส่วนที่มีความเสี่ยงสูง: ภาวะผสมไม่ติด, การประเมินทำหมัน, การเก็บรักษาน้ำอสุจิ, การทำ AI)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `repro-canine-feline-theriogenology` | `canine-feline-infertility` | Infertility factors in bitch & queen | `Infertility p.9-20` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจยืนยันสาเหตุผสมไม่ติดและเชื้อ *B. canis* |
| `repro-canine-feline-theriogenology` | `gonadectomy-risk-benefit` | Gonadectomy Risk-Benefit Assessment | `Risk-benefit assessment p.1-15` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจเทียบช่วงอายุทำหมันสุนัขพันธุ์ใหญ่ |
| `repro-semen-evaluation-preservation` | `semen-chilled-frozen-preservation` | Semen Extenders & Cryopreservation | `Semen preservation p.1-15` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจสูตร Tris-extender และ Glycerol % |
| `repro-semen-evaluation-preservation` | `theriogenology-ultrasound-biotech` | AI methods & Gestational Ultrasound | `AI and Ultrasound p.1-10` | `derived-note` | `restricted` | `PENDING` | รออาจารย์ตรวจ Fetal heart rate cutoff (< 150 bpm) |

---

### Priority B — Academic Fact Review
*(ส่วนข้อเท็จจริงทางวิชาการ: วงรอบการเป็นสัด, สไลด์ cytology, การตรวจอสุจิ)*

| Page ID | Anchor ID | Claim Area | Source Locator | Evidence Status | Clinical Safety | Reviewer Decision | Reviewer Notes |
|---|---|---|---|---|---|---|---|
| `repro-canine-feline-theriogenology` | `estrus-cycle-and-cytology` | Estrus cycle phases & Vaginal Cytology | `Infertility p.1-8` | `derived-note` | `standard` | `PENDING` | ตรวจสอบ % cornified cells ในช่วง estrus |
| `repro-semen-evaluation-preservation` | `semen-collection-and-evaluation` | Semen 3 fractions & Motility/Morphology | `Semen evaluation p.1-12` | `derived-note` | `standard` | `PENDING` | ตรวจสอบตัวแปรประเมินอสุจิ |

---

## 3. Required Action Checklist for Domain Owner

- [ ] 1. ตรวจสอบข้อเท็จจริงใน **Priority A (Restricted Sections)** ทั้ง 4 รายการ
- [ ] 2. ตรวจสอบข้อเท็จจริงใน **Priority B (Academic Facts)** ทั้ง 2 รายการ
- [ ] 3. นำไฟล์ PDF/Slide บรรยายต้นฉบับมาวางเทียบใน workspace เพื่อเปลี่ยน `sourceAvailability` เป็น `original-verified`
- [ ] 4. ลงนามเปลี่ยน `Reviewer Decision` จาก `PENDING` เป็น `APPROVED` ในแต่ละรายการ
