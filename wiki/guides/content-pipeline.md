---
id: content-pipeline
title: Video Summaries & Content Pipeline Guide
type: guide
version: 1.1.0
status: draft
tags: [content, youtube, transcript, summary]
sourceRefs:
  - path: scripts/fetch-video-transcripts.mjs
  - path: scripts/flatten-transcript.mjs
  - path: src/data/video-summaries-meta.js
  - path: src/data/video-summaries-com5.js
lastReviewed: 2026-08-21
---

# <a id="pipeline-overview"></a>Video Summaries & Content Pipeline Guide

คู่มือ operational draft ที่ตรวจ path/commands กับ v5.31.0 เนื้อหาทางสัตวแพทย์
ทุกส่วนยังต้องอิง transcript/slide/source จริงและห้ามเติมจากความคุ้นเคย

## <a id="transcript-fetching"></a>1. Fetching & Flattening Transcripts
ขั้นตอนการรัน `npm run fetch:videos` และ `npm run flat:transcript`

1. `npm run fetch:videos` เก็บ transcript JSON ใน `data-cache/transcripts/`
2. `node scripts/flatten-transcript.mjs <videoId>` สร้างข้อความพร้อม timestamp
3. อ่าน transcript จริงแบบเป็นช่วงเมื่อไฟล์ใหญ่ ห้ามสรุปจากชื่อคลิปอย่างเดียว

## <a id="summary-drafting"></a>2. Summary Formatting Rules
โครงสร้างการสรุปวิดีโอ: Pathophys -> Signalment -> Clinical Signs -> Dx -> Tx -> Monitoring -> 📝 Exam Hot Spots

สรุปแยกอยู่ใน `src/data/video-summaries-<subject>.js`; metadata search ใช้
`video-summaries-meta.js` การเพิ่ม/แก้ต้องรักษา template literal ให้ parse ได้
และรัน build + gates ก่อน commit
