---
id: api-and-edge
title: API Endpoints & Edge Integration Contracts
type: integration
version: 1.0.0
status: draft
tags: [api, serverless, rate-limit, edge]
sourceRefs:
  - path: api/_lib/rate-limit.js
  - path: api/send-feedback.js
  - path: api/tts.js
lastReviewed: 2026-07-23
---

# <a id="api-overview"></a>API Endpoints & Edge Integration Contracts

`NEEDS_VERIFICATION` - เอกสารนี้อยู่ระหว่างจัดทำร่างข้อกำหนด API และ Serverless Functions

## <a id="serverless-routes"></a>1. Vercel Serverless API Routes
รายการ Endpoints สำหรับส่ง feedback, ทำ TTS และตรวจข้อสอบเอสเซย์

## <a id="rate-limiting"></a>2. Upstash Redis Rate Limiting
การจำกัดโควตาการเรียกใช้งาน API เพื่อป้องกันการใช้งานเกินขอบเขต
