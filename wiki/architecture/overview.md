---
id: architecture-overview
title: System Architecture & Data Flow Overview
type: architecture
version: 1.0.0
status: draft
tags: [architecture, router, state, lazy-loading]
sourceRefs:
  - path: src/App.jsx
    lines: L1-L200
  - path: vite.config.js
lastReviewed: 2026-07-23
---

# <a id="system-architecture"></a>System Architecture & Data Flow Overview

`NEEDS_VERIFICATION` - เอกสารนี้อยู่ระหว่างจัดทำร่างโครงสร้างสถาปัตยกรรมระบบ

## <a id="single-page-router"></a>1. Single-Page Router State
แอปพลิเคชันใช้การจัดการ Router ผ่าน State หลัก `view` ใน `src/App.jsx`

## <a id="lazy-loading"></a>2. Lazy Loading & Chunk Splitting
หน้า View แต่ละหน้าจะถูกนำเข้าด้วย `React.lazy()` เพื่อรักษาขนาด Initial Bundle ให้เบาที่สุด

## <a id="storage-sync"></a>3. Storage & State Synchronization
ใช้การจัดเก็บข้อมูลแบบ Hybrid ระหว่าง Local Storage และ Supabase Cloud Sync
