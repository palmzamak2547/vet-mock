---
id: architecture-overview
title: System Architecture & Data Flow Overview
type: architecture
version: 1.1.0
status: draft
tags: [architecture, router, state, lazy-loading]
sourceRefs:
  - path: src/App.jsx
    lines: L1-L200
  - path: vite.config.js
lastReviewed: 2026-08-21
---

# <a id="system-architecture"></a>System Architecture & Data Flow Overview

เอกสารนี้สรุป runtime architecture ที่ตรวจจาก source ของ v5.31.0 โดยสถานะ
ยังเป็น `draft` เพราะเป็นเอกสารปฏิบัติการ ไม่ใช่บทความเนื้อหาสัตวแพทย์ที่ผ่าน
domain review

## <a id="single-page-router"></a>1. Single-Page Router State
แอปใช้ state หลัก `view` ใน `src/App.jsx` ร่วมกับ canonical path map ที่
`src/lib/view-route.js` สำหรับปลายทางที่ restore ได้ครบ เช่น `/app/progress`
และ `/app/videos` ส่วน config/exam/results ยังเป็น stateful flow จึงไม่ทำ URL
ที่ restore ได้เพียงครึ่งเดียว บทความ VetWiki ใช้ `/wiki/<subject>/<topic>`

## <a id="lazy-loading"></a>2. Lazy Loading & Chunk Splitting
หน้า View หลักนำเข้าด้วย `React.lazy()` และ `vite.config.js` แยก vendor,
question banks, note bodies, video summaries, validation และ Imaging Practical
ออกจาก initial path

Notes ใช้ `src/data/note-corpus.js` เป็น literal dynamic-import map เดียวของ
NotesView + VetWiki + registry generator จึงโหลดเฉพาะวิชาที่เปิด

## <a id="storage-sync"></a>3. Storage & State Synchronization
`src/lib/user-data-sync.js` commit ลง local storage ก่อนและใช้ durable outbox
replicate ไป Supabase เมื่อ login การ pull/push ต้องรักษา account isolation และ
offline edits

ไฟล์ backup และข้อสอบส่วนตัวผ่าน `src/lib/user-data-schema.js` ก่อน setter ทุก
ครั้ง ระบบ preview ขอบเขตการเขียนทับและเก็บ `streakData` เต็ม record

## <a id="generated-projections"></a>4. Generated Data Projections

Question counts, delivery, bank registry, Notes availability และ VetWiki runtime
เป็น generated projections จาก canonical sources ต้องแก้ source แล้วใช้คำสั่ง
`regen:*`; `lint:all` ป้องกัน changed/missing/extra projection ก่อน release

## <a id="production-proof"></a>5. Production Proof

Production-ready ต้องมี exact-SHA GitHub Build + Smoke E2E, Vercel Production
deployment และ live flow ที่ `vetmock.vercel.app` ไม่ใช่เพียง local build หรือ
push สำเร็จ ดู `docs/PROJECT_KNOWLEDGE_BASE.md`
