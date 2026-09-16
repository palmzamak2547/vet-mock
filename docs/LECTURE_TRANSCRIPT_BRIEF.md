# Lecture transcript brief — for the agent doing the transcription

This is a work order for a second agent (Codex / grok / any assistant with
budget to spare). It covers **transcription only**. Do not write exam questions
from it; that happens in the VetMock repo under a separate pipeline that has an
independent reviewer and three lint ratchets.

## Why this exists

VetMock's questions have been built from senior cohorts' compilations. Those are
one cohort removed, so every use of them needs a judgement about whether the
current cohort sits that content at กลางภาค or ปลายภาค — and that judgement is
what produced a run of real errors: content filed on the wrong paper, an
`examScope` asserted from a report nobody could produce, a whole lecture's worth
of endometritis questions sitting in the midterm set when the department's
schedule puts them after it.

The cohort records its own lectures. A recording removes that entire class of
doubt, because it is evidence of what **this** cohort was taught, in **which**
lecture.

## What the recording settles, and what it does not

**It settles:** what was taught, how the lecturer framed it, what they stressed,
and which lecture number it is. The faculty schedule maps lecture number to
paper, so scope follows for free and with certainty.

**It does not settle:** whether a statement is medically correct. A lecturer can
simplify, misspeak, or be out of date. Question authoring will cross-check every
claim against a reliable source before it ships. Your transcript should
therefore record *what was said*, faithfully, including anything that sounds
doubtful — flag it, do not silently correct it.

## Source

Channel: https://www.youtube.com/@dai.1387 (CUVET86, the current cohort)

Start with **Equine Reproduction (3108515)**, lectures 1 to 6 — those are the
ones the department's schedule places before สอบกลางภาค 21-25 ก.ย. 2569:

1. บทนำ กายวิภาคและการทำหน้าที่ของระบบสืบพันธุ์ม้าเพศเมีย
2. วงจรการเป็นสัดและการควบคุมวงจรการเป็นสัด
3. การตรวจระบบสืบพันธุ์ม้าเพศเมีย
4. เทคโนโลยีชีวภาพทางการสืบพันธุ์ที่สำคัญในม้าเพศเมีย
5. โรคติดเชื้อที่สำคัญของม้าเพศเมีย
6. ภาวะความไม่สมบูรณ์พันธุ์และการตรวจวินิจฉัย

Lectures 7 to 14 are the ปลายภาค material and can follow later.

## Hard rules

1. **Do not paste auto-captions.** Thai auto-caption degrades worst on exactly
   the veterinary terms a question turns on — endometrial cups, pneumovagina,
   maternal recognition of pregnancy, interferon tau. Those are the words that
   decide whether a question is right. Listen and transcribe them.
2. **Timestamp everything.** Every paragraph carries `[mm:ss]`. Question
   authoring cites lecture and timestamp the way it currently cites a PDF page
   and item number; without a timestamp a claim cannot be re-checked.
3. **Transcribe, do not summarise.** Keep the lecturer's own phrasing, including
   repetition and asides. An aside like "ข้อนี้ออกสอบบ่อย" or "อันนี้จำไว้" is
   high-value signal and must be preserved verbatim.
4. **Mark what you could not hear** as `[ฟังไม่ชัด]` rather than guessing. A gap
   is fine; an invented word is not.
5. **Flag, do not fix.** If the lecturer says something that sounds wrong or
   contradicts a textbook, transcribe it as said and add
   `> [ตรวจสอบ] ...your note...` beneath. The authoring step resolves it.
6. **No exam-prediction language in your own words.** You may quote the lecturer
   saying anything. Do not add claims that content will appear on the exam.

## Output format

One Markdown file per lecture, named
`equine-repro-L<N>-<short-slug>.md`, containing:

```markdown
---
subject: equine-repro
lecture: 6
title: ภาวะความไม่สมบูรณ์พันธุ์และการตรวจวินิจฉัย
lecturer: <as named on the recording>
videoUrl: <url>
recordedFor: CUVET86
examPaper: midterm      # lectures 1-6 midterm, 7-14 final
transcribedBy: <agent>
---

## [00:00] <topic heading in the lecturer's own words>

<verbatim transcript>

> [ตรวจสอบ] <anything doubtful>
```

Deliver the files; the VetMock side picks them up from there.

## What happens next, so scope is clear

The VetMock repo turns these into questions under rules this brief does not
cover: an antipattern standard for option writing, an academic-safety vocabulary
lint, a question-standard ratchet that must stay at zero defects, and an
independent reviewer agent that re-opens the source and tries to refute every
item before anything ships. In the last run that reviewer rejected nine of
twenty-six authored questions. Transcription quality is what decides whether
that pipeline has something true to work from.
