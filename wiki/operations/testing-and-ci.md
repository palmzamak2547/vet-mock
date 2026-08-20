---
id: testing-and-ci
title: Testing Automation & CI Quality Gates
type: operation
version: 1.1.0
status: draft
tags: [testing, ci, linting, validation]
sourceRefs:
  - path: package.json
  - path: playwright.config.js
  - path: scripts/lint-questions.cjs
  - path: tests/e2e/system-polish.spec.js
  - path: scripts/stats.mjs
lastReviewed: 2026-08-21
---

# <a id="testing-overview"></a>Testing Automation & CI Quality Gates

Operational snapshot ที่ตรวจจาก package scripts และ GitHub workflow ของ
v5.31.0 สถานะยังเป็น `draft` เพราะเป็นคู่มือภายใน ไม่ใช่เนื้อหา domain review

## <a id="lint-scripts"></a>1. Academic Safety & Question Linting
`npm run lint:all` รวม ID/duplicate/academic-safety/question bias/deck refs/
question standard/delivery/Thai orthography/empty sections/generated registries/
VetWiki/curriculum/instructor/content inventory gates

## <a id="wiki-validation"></a>2. Wiki Validation Command
สคริปต์ตรวจความถูกต้องของ Wiki แบบ Read-Only (`npm run validate:wiki`)

## <a id="release-baseline"></a>3. Release Baseline

```powershell
npm run test:unit
npm run lint:all
npm run build
npm audit --audit-level=high
```

เพิ่ม targeted Playwright สำหรับ flow/failure path ที่แก้ แล้วให้ GitHub
Actions รัน 4 profiles: Chromium desktop/mobile, WebKit mobile และ Firefox
desktop

## <a id="current-evidence"></a>4. v5.31.0 Evidence

- Unit 218 ผ่าน
- Build + 209 Wiki prerenders ผ่าน; dependency audit 0
- GitHub Build `32415996906` ผ่าน
- GitHub Smoke E2E `32415996900`: 144 ผ่าน, 40 intentional skips, 0 fail
- Production alias targeted journeys 20/20 รวม Notes offline recovery

Windows local full runner อาจเหลือ Firefox/WebKit worker ค้างใน teardown หลัง
assertions จบ จึงห้ามสรุป pass จาก output กลางทาง ให้รัน spec ที่เกี่ยวข้องแบบ
single-worker และใช้ Linux CI exit code เป็น release gate
