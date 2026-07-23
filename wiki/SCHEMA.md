---
id: schema
title: VetMock Wiki Schema & Conventions Standard
type: reference
version: 1.0.0
status: approved
tags: [schema, standard, conventions, citation]
lastReviewed: 2026-07-23
---

# VetMock Wiki Schema & Conventions Standard

เอกสารนี้กำหนดมาตรฐานการเขียนเอกสาร การสร้างดัชนี และข้อกำหนดสัญญาการอ้างอิงระหว่างคลังข้อสอบ (Question Bank) กับระบบ Wiki ของโปรเจกต์ VetMock

---

## 1. Frontmatter Standard

ทุกหน้าเอกสาร Markdown ใน `wiki/` จะต้องมี YAML Frontmatter อยู่ที่ส่วนหัวของไฟล์ตามรูปแบบมาตรฐานดังนี้:

```yaml
---
id: <stable-kebab-case-id>
title: <page-title>
type: <architecture|domain|feature|integration|operation|guide|reference>
version: 1.0.0
status: <draft|reviewed|approved>
tags: []
sourceRefs: []
relatedQuestions: []
lastReviewed: YYYY-MM-DD
---
```

### รายละเอียดฟิลด์:
- `id` (required): รหัสประจำหน้าในรูปแบบ kebab-case ต้องไม่ซ้ำกันทั่วทั้ง Wiki
- `title` (required): ชื่อเรื่องของเอกสาร
- `type` (required): ประเภทของเอกสาร (`architecture`, `domain`, `feature`, `integration`, `operation`, `guide`, `reference`)
- `version` (required): เวอร์ชันเอกสารตาม Semantic Versioning (เริ่มต้น `1.0.0`)
- `status` (required): สถานะการตรวจสอบ (`draft`, `reviewed`, `approved`)
- `tags` (optional): อาร์เรย์ของคำค้นหา
- `sourceRefs` (optional): อาร์เรย์ของไฟล์ซอร์สโค้ดและบรรทัดที่เกี่ยวข้อง เช่น `[{ path: "src/App.jsx", lines: "L1-L200" }]`
- `relatedQuestions` (optional): อาร์เรย์ของ Question IDs ที่เกี่ยวข้อง
- `lastReviewed` (required): วันที่ตรวจสอบล่าสุดในรูปแบบ `YYYY-MM-DD`

---

## 2. Stable Anchor Standard

เพื่อให้อ้างอิงเนื้อหาเฉพาะส่วนได้อย่างแม่นยำ ทุก Section ที่สามารถอ้างอิงได้จะต้องกำหนด Explicit Anchor ด้วยแท็ก HTML `<a id="..."></a>`:

```markdown
## <a id="stable-anchor-id"></a>Section Title
```

### กติกาการใช้ Anchor:
1. `anchorId` ต้องเป็น kebab-case (เช่น `question-citation-contract`)
2. `anchorId` ต้องไม่ซ้ำกันภายในหน้าเอกสารเดียวกัน
3. ห้ามใช้ Line Number เป็น Citation Identity
4. การอ้างอิงตำแหน่งใน Wiki ต้องใช้คู่ของ `pageId` + `anchorId` เสมอ

---

## 3. Question Citation Schema (`wikiRefs`)

ข้อสอบในคลังข้อสอบสามารถกำหนดฟิลด์ `wikiRefs` (อาร์เรย์ของ Citation Objects) เพื่ออ้างอิงกลับมายัง Wiki ได้ โดยมีโครงสร้างดังนี้:

```javascript
wikiRefs: [
  {
    pageId: "question-bank-engine",
    anchorId: "question-schema",
    label: "Question Bank Engine: Question Schema",
    wikiVersion: "1.0.0",
    contentHash: null,        // optional/null ใน Phase 1
    status: "draft",          // "draft" | "reviewed" | "approved"
    mappingStatus: "unmapped" // "verified" | "candidate" | "unmapped"
  }
]
```

### กติกาและข้อบังคับ:
1. ข้อสอบเดิมทั้งหมดที่ไม่ได้รับความเห็นชอบให้ระบุอ้างอิงจะ **ไม่มีฟิลด์ `wikiRefs`** หรือกำหนดเป็น `wikiRefs: []`
2. **ห้ามสร้าง Dummy Placeholders:** ห้ามใส่ `wikiRefs` ที่ชี้ไปยังหน้า Wiki ที่ไม่สัมพันธ์กับเนื้อหาในข้อสอบ
3. `mappingStatus: "unmapped"` ใช้ในรายงานหรือ `wiki/unmapped-questions.md` เพื่อระบุสถานะข้อสอบที่ยังไม่มีบทความรองรับ ไม่ใช่ใช้สร้าง Citation Object หลอกลวง
4. สถานะ `mappingStatus: "verified"` ต้องกำหนดโดย Domain Owner หรือ Workflow ตรวจสอบที่ได้รับความเห็นชอบแล้วเท่านั้น (AI หรือ Migration script ห้ามตั้งค่าเอง)
5. `contentHash` เป็น optional ใน Phase 1 และสามารถเป็น `null` ได้ โดย Validator จะออก `WARNING` แต่ไม่ออก `ERROR`

---

## 4. Internal Link Integrity

- ลิงก์ภายในไดเรกทอรี `wiki/` ให้ใช้รูปแบบ Standard Markdown Relative Link: `[Label](./path/file.md)` หรือ `[Label](../path/file.md)`
- การอ้างอิงข้ามส่วนของหน้าเดียวกันหรือข้ามไฟล์ ให้ระบุ Anchor: `[Label](./path/file.md#anchor-id)`
- ห้ามใส่ Wikilinks หลอกลอย (`[[...]]`) ที่ชี้ไปยังไฟล์ที่ไม่มีอยู่จริง หากพบและยังหาไฟล์ปลายทางไม่ได้ ให้ทำเครื่องหมาย `NEEDS_VERIFICATION: broken knowledge reference`

---

## 5. Machine-Readable Section Metadata (`wiki-section-meta`)

เพื่อควบคุมระดับความปลอดภัย ความน่าเชื่อถือของเนื้อหา (Safety & Evidence Attribution) ในระดับหัวข้อย่อย ทุก Section ที่มี Explicit Anchor (`<a id="..."></a>`) และมีข้อความอ้างอิงทางวิชาการ จะต้องมีบล็อก Metadata รูปแบบ HTML Comment `<!-- wiki-section-meta ... -->` อยู่ใต้ Anchor เสมอ:

```html
<a id="pathogenesis-crypt-vs-villi"></a>
<!-- wiki-section-meta
anchorId: pathogenesis-crypt-vs-villi
sectionStatus: draft
clinicalSafety: standard
requiresDomainApproval: false
mappingEligible: false
sectionSourceRefs:
  - sourceId: com5-cve-slides
    title: Canine Viral Enteritis lecture slides
    locator: "CVE.pdf p.5-6"
    derivedFrom: "src/data/notes-com5.js"
    evidenceStatus: derived-note
    sourceAvailability: note-only
-->
```

### ฟิลด์ใน `wiki-section-meta`:
- `anchorId` (required): รหัส Anchor ต้องตรงกับ `<a id="..."></a>` ด้านบน
- `sectionStatus` (required): สถานะของ Section (`draft`, `reviewed`, `approved`)
- `clinicalSafety` (required): ระดับความปลอดภัยทางคลินิก (`standard` | `restricted`)
- `requiresDomainApproval` (required): ต้องผ่านการอนุมัติจากอาจารย์/สัตวแพทย์ผู้เชี่ยวชาญก่อนหรือไม่ (`true` | `false`)
- `mappingEligible` (required): อนุญาตให้นำไป Map กับข้อสอบหรือสร้าง AI Question ได้หรือไม่ (ต้องเป็น strict boolean `true` | `false`)
- `sectionSourceRefs` (required): อาร์เรย์ของแหล่งอ้างอิงระดับ Section:
  - `sourceId`: รหัสอ้างอิงซอร์ส
  - `title`: ชื่อคำอธิบายสไลด์หรือเอกสาร
  - `locator`: ตำแหน่งสไลด์/หน้า (เช่น `"CVE.pdf p.5-6"`)
  - `derivedFrom`: ไฟล์ที่ใช้สกัดข้อมูลใน workspace (เช่น `"src/data/notes-com5.js"`)
  - `evidenceStatus`: สถานะหลักฐาน (`derived-note` | `original-verified`)
  - `sourceAvailability`: สถานะความพร้อมของไฟล์ต้นฉบับใน workspace (`note-only` | `original-verified`)
- `review` (canonical review metadata for reviewed/approved sections):
  - `decision`: `PENDING` | `REVIEWED` | `APPROVED` | `CHANGES_REQUESTED` | `REJECTED`
  - `reviewedBy`: ชื่ออาจารย์ผู้สอนหรือสัตวแพทย์ผู้ตรวจ (เช่น `"ผศ.สพ.ญ. ดร. ..."`)
  - `reviewedAt`: วันที่อนุมัติในรูปแบบ ISO-8601 full-date (`YYYY-MM-DD` เช่น `"2026-07-23"`)
  - `approvalScope`: ขอบเขตการอนุมัติ (สำหรับ `restricted` section ที่ตั้ง `mappingEligible: true` จะต้องระบุคำว่า `"educational question generation"`)

---

### บทบาทของ Review Pack vs Canonical Section Metadata:
1. เอกสาร `wiki/reviews/*-domain-owner-review.md` คือ **Human Review Workflow Document** สำหรับให้อาจารย์/ผู้เชี่ยวชาญอ่านและลงนาม
2. เมื่อ Domain Owner ตรวจรับรองแล้ว ผู้มีสิทธิ์จะนำผลที่อนุมัติแล้วมาบันทึกเข้าในบล็อก `<!-- wiki-section-meta -->` ของ Section นั้นๆ ซึ่งเป็น **Machine-Readable Source of Truth** เดียวที่ Validator (`validate:wiki`) ใช้ประเมิน
3. ห้าม AI สร้างชื่อผู้ตรวจ วันที่ หรือการอนุมัติปลอมขึ้นเองโดยเด็ดขาด
4. การอ้างอิงระหว่าง Review Pack และ Section Metadata ให้ใช้คู่ `pageId` + `anchorId` เป็น Key หลักเสมอ (ห้าม match ด้วย label หรือข้อความอิสระ)

---

### Wiki Lifecycle State Matrix Rules:
1. **Draft State (Phase 2A):**
   - Page status `draft` ➔ `sectionStatus` ต้องเป็น `draft`, `mappingEligible: false`, `sourceAvailability: note-only` หรือ `original-verified`
2. **Reviewed State (Phase 2B):**
   - Page status `reviewed` ➔ `sectionStatus` เป็น `draft` หรือ `reviewed`
   - `sectionStatus: reviewed` ➔ บังคับ `sourceAvailability: original-verified`, `review.decision: REVIEWED` หรือ `APPROVED`, มี `reviewedBy` และ `reviewedAt` (ISO-8601)
3. **Approved & Mapping State (Phase 2C):**
   - `mappingEligible: true` ➔ บังคับ `page status: approved`, `sectionStatus: approved`, `sourceAvailability: original-verified`, `review.decision: APPROVED`, มี `reviewedBy`, `reviewedAt` (ISO-8601) และ `approvalScope`
   - **Restricted Section Scope Rule:** หาก `clinicalSafety: restricted` และ `mappingEligible: true` บังคับ `requiresDomainApproval: true` และ `approvalScope` จะต้องมีคำว่า `"educational question generation"`
4. **Approved Source Baseline (Course-Derived Approval Inheritance):**
   - เมื่อซอร์สเนื้อหาการสอนได้รับการอนุมัติเป็นฐานข้อมูลความรู้หลัก (เช่น `src/data/notes-com5.js`) Section สามารถรับอนุมัติผ่านการสืบค้น (Source-Derived Approval Inheritance) ได้โดยไม่ต้องสร้างชื่อผู้ตรวจมนุษย์ปลอม
   - บังคับระบุใน `wiki-section-meta`:
     - `sourceApprovalBasis: approved-course-notes`
     - `sourceApprovalRef: src/data/notes-com5.js`
     - `sourceApprovalStatus: approved`
   - เมื่อ `sourceApprovalBasis: approved-course-notes` และ `sourceApprovalRef: src/data/notes-com5.js`:
     - `sectionStatus: approved` และ `mappingEligible: true` สามารถใช้กับ `sourceAvailability: note-only` ได้โดยตรง
     - ห้ามระบุชื่อ AI/LLM ใน `reviewedBy` (ต้องเป็น `null` หรือไม่ตั้งค่า)
     - `review.decision: APPROVED` และ `approvedAt: YYYY-MM-DD`
     - สำหรับ `clinicalSafety: restricted` ต้องตั้ง `requiresDomainApproval: true` และ `approvalScope` ระบุคำว่า `"educational question generation"`



