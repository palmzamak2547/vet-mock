---
id: readme
title: VetMock Wiki System Overview
type: reference
version: 1.1.0
status: approved
tags: [readme, overview, wiki]
lastReviewed: 2026-08-21
---

# VetMock Wiki

ยินดีต้อนรับสู่ศูนย์กลางความรู้และสถาปัตยกรรม (Knowledge Base Center / Source of Truth) ของโปรเจกต์ **VetMock**

Current operational map, measured inventory และ release evidence อยู่ที่
`docs/PROJECT_KNOWLEDGE_BASE.md`; ตัวเลขในบทความ/session เก่าเป็น dated snapshot
และต้องตรวจใหม่ด้วย `npm run stats`

## โครงสร้างไดเรกทอรี
- `SCHEMA.md` - ข้อกำหนดการเขียนเอกสาร, Frontmatter, Anchor Identity และ Wiki References Contract
- `index.md` - หน้าดัชนีสารบัญหลัก (Table of Contents)
- `unmapped-questions.md` - รายงานแสดงข้อสอบที่ยังไม่มีบทความ Wiki รองรับ (สร้างโดย `npm run sync:wiki-unmapped`)
- `architecture/` - เอกสารสถาปัตยกรรมระดับระบบ, State Router, Lazy Chunks และ Storage Sync
- `domain/` - เอกสารโดเมนหลัก เช่น Question Bank Engine, SM-2 Spaced Repetition และ Study Groups
- `features/` - ข้อกำหนดฟีเจอร์ เช่น AI Question Source Citation Protocol
- `integrations/` - เอกสาร API Endpoints, Upstash Redis Rate Limiting และ Auth Integrations
- `operations/` - เอกสารสคริปต์ตรวจคุณภาพ, Testing Suites และ CI Quality Gates
- `guides/` - คู่มือขั้นตอนการทำงาน เช่น Content Pipeline
