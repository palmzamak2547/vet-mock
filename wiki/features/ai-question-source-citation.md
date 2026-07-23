---
id: ai-question-source-citation
title: AI Question Source Citation Protocol
type: feature
version: 1.0.0
status: approved
tags: [ai, citation, protocol, ui]
sourceRefs:
  - path: src/components/QSourceChip.jsx
  - path: src/components/Question.jsx
  - path: src/lib/ai-grade.js
lastReviewed: 2026-07-23
---

# <a id="overview"></a>AI Question Source Citation Protocol

เอกสารนี้ระบุมาตรฐานและข้อกำหนดสำหรับให้ระบบ AI (เช่น SmartGrader, AI Question Generator หรือ Daily Q) และ UI คลังข้อสอบ สามารถระบุแหล่งอ้างอิงเนื้อหาวิชาการจาก Wiki กลับไปยังข้อสอบและคำอธิบายได้อย่างแม่นยำ

---

## <a id="non-fabrication-policy"></a>1. Non-Fabrication Policy & Wiki as Source of Truth

- ระบบ **Wiki** คือศูนย์กลางความรู้ (Source of Truth) หลักของโปรเจกต์ VetMock
- **4-Layer Citation Chain Contract:**
  `Question / AI Explanation -> wikiRefs[] (pageId + anchorId) -> Wiki Section -> sectionSourceRefs[] -> Original Source Locator`
- **Non-Fabrication Rules for AI Generation:**
  1. AI ต้องไม่กุหรือสร้าง `pageId`, `anchorId`, `sourceId`, `locator`, `wikiVersion`, `status`, `review` metadata หรือ citation object ขึ้นเองโดยเด็ดขาด
  2. AI ต้องเลือก Citation ได้เฉพาะจาก Retrieval Context ที่ระบบ Retrieval Layer ส่งมอบให้เท่านั้น
  3. AI เรียกใช้ได้เฉพาะ Wiki Pages และ Sections ที่มีสถานะ `page status == approved`, `sectionStatus == approved`, `mappingEligible == true` และผ่านการตรวจสอบ Canonical Review Metadata (`review.decision: APPROVED`) หรือ Approved Source Baseline (`sourceApprovalBasis: approved-course-notes`) ใน `<!-- wiki-section-meta -->` เรียบร้อยแล้วเท่านั้น
  4. ระบบ Validator (`validate:wiki`) และ Retrieval Gate เป็นผู้ตรวจบังคับ (Enforce) Policy นี้
  5. หากไม่มี Approved Evidence ที่รองรับ Claim ใน Retrieval Context ให้ตอบ `NEEDS_VERIFICATION` และห้ามสร้างข้อสอบหรือเฉลยเชิงข้อเท็จจริงในส่วนนั้น

---

## <a id="citation-identity"></a>2. Citation Identity (`pageId + anchorId`)

การระบุตำแหน่งอ้างอิงใช้ผสมผสานระหว่าง:
1. `pageId`: Identifer ประจำหน้า Wiki (ตรงกับฟิลด์ `id` ใน Frontmatter)
2. `anchorId`: Identifier ประจำ Section ในหน้านั้น (ตรงกับ `<a id="..."></a>`)

```json
{
  "pageId": "question-bank-engine",
  "anchorId": "question-schema",
  "label": "Question Bank Engine: Question Schema",
  "wikiVersion": "1.0.0",
  "contentHash": null,
  "status": "draft",
  "mappingStatus": "unmapped"
}
```

---

## <a id="difference-source-wiki"></a>3. ความแตกต่างระหว่าง `source` / `sourceRefs` และ `wikiRefs`

- **`source` / `sourceRefs`**: ชี้ไปยังไฟล์ภายนอกดั้งเดิม เช่น ชื่อไฟล์ PDF ข้อสอบเก่า (`Com_5_final_TJ.pdf`) หรือบรรทัดในซอร์สโค้ด
- **`wikiRefs`**: ชี้ไปยังเนื้อหาบทความวิชาการในไดเรกทอรี `wiki/` ของโปรเจกต์ VetMock

---

## <a id="ui-citation-chip"></a>4. UI Citation Chip Behavior (Phase 1 Specifications)

1. **ข้อความบน Chip:** ใช้ข้อความ **`📖 ข้อมูลอ้างอิง Wiki`** (ไม่ใช้คำว่า "ดูเนื้อหาใน Wiki" ใน Phase 1)
2. **เงื่อนไขการแสดงผล:** ชิปจะแสดงผล **เฉพาะเมื่อ `question.wikiRefs` มีรายการอ้างอิงที่ถูกต้องและได้รับอนุมัติแล้วเท่านั้น (`wikiRefs.length > 0`)** หากไม่มี `wikiRefs` หรือเป็น `[]` ชิปจะถูกซ่อน 100%
3. **Read-Only Fallback Modal (Phase 1):** การกดชิปใน Phase 1 จะเปิด Read-only Drawer/Modal แสดงผลเฉพาะ Metadata ของการอ้างอิงอย่างปลอดภัย โดยไม่เปิดหน้าการเรนเดอร์ Markdown ที่ยังไม่ได้รับการผ่านกระบวนการ Sanitize
4. **Phase 2 Preview:** ใน Phase 2 จะมีการเพิ่มระบบ Wiki Viewer และ Deep Linking ไปยัง `pageId#anchorId`

---

## <a id="invalid-citations"></a>5. การจัดการ Invalid & Stale Citations

 Validator (`npm run validate:wiki`) จะปฏิเสธ Citation ในกรณีต่อไปนี้:
- `pageId` ไม่พบในระบบ Wiki (`ERROR`)
- `anchorId` ไม่พบในหน้า Wiki ปลายทาง (`ERROR`)
- โครงสร้างของ Citation Object ไม่ครบถ้วนตาม Schema (`ERROR`)
- `contentHash` ไม่ตรงกับเนื้อหาปัจจุบัน (`WARNING` ใน Phase 2)
