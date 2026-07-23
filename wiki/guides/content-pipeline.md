---
id: content-pipeline
title: Video Summaries & Content Pipeline Guide
type: guide
version: 1.0.0
status: draft
tags: [content, youtube, transcript, summary]
sourceRefs:
  - path: scripts/fetch-video-transcripts.mjs
  - path: scripts/flatten-transcript.mjs
  - path: src/data/video-summaries.js
lastReviewed: 2026-07-23
---

# <a id="pipeline-overview"></a>Video Summaries & Content Pipeline Guide

`NEEDS_VERIFICATION` - เอกสารนี้อยู่ระหว่างจัดทำร่างคู่มือการดึงและสรุปเนื้อหาวิดีโอ

## <a id="transcript-fetching"></a>1. Fetching & Flattening Transcripts
ขั้นตอนการรัน `npm run fetch:videos` และ `npm run flat:transcript`

## <a id="summary-drafting"></a>2. Summary Formatting Rules
โครงสร้างการสรุปวิดีโอ: Pathophys -> Signalment -> Clinical Signs -> Dx -> Tx -> Monitoring -> 📝 Exam Hot Spots
