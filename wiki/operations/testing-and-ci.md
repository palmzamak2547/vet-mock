---
id: testing-and-ci
title: Testing Automation & CI Quality Gates
type: operation
version: 1.0.0
status: draft
tags: [testing, ci, linting, validation]
sourceRefs:
  - path: package.json
  - path: playwright.config.js
  - path: scripts/lint-questions.cjs
lastReviewed: 2026-07-23
---

# <a id="testing-overview"></a>Testing Automation & CI Quality Gates

`NEEDS_VERIFICATION` - เอกสารนี้อยู่ระหว่างจัดทำร่างคำสั่งทดสอบและ CI Quality Control

## <a id="lint-scripts"></a>1. Academic Safety & Question Linting
สคริปต์ตรวจความสมบูรณ์และข้อผิดพลาดในคลังข้อสอบ (`npm run lint:all`)

## <a id="wiki-validation"></a>2. Wiki Validation Command
สคริปต์ตรวจความถูกต้องของ Wiki แบบ Read-Only (`npm run validate:wiki`)
