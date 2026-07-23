---
id: question-bank-engine
title: Question Bank & Spaced Repetition Engine
type: domain
version: 1.0.0
status: draft
tags: [question-bank, sm2, id-migration]
sourceRefs:
  - path: src/hooks/sm2.js
  - path: src/lib/id-migration.js
  - path: scripts/regen-bank-registry.mjs
lastReviewed: 2026-07-23
---

# <a id="engine-overview"></a>Question Bank & Spaced Repetition Engine

`NEEDS_VERIFICATION` - เอกสารนี้อยู่ระหว่างจัดทำร่างโดเมนคลังข้อสอบและ SM-2

## <a id="question-schema"></a>1. Question Schema Standard
รองรับโหมดคำถาม 4 รูปแบบ: `mcq`, `tf`, `fill`, `match`

## <a id="sm2-algorithm"></a>2. SM-2 Spaced Repetition Algorithm
การคำนวณทบทวนความจำตามระดับความยากง่าย (Ease Factor, Interval, Repetitions)

## <a id="id-migration"></a>3. Question ID Migration & Registry
ระบบคงความสอดคล้องของ ID ข้อสอบ และการสร้าง Registry โดยอัตโนมัติ
