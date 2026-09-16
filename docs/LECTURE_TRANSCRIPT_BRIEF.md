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

## Source — checked on the channel, 2026-09-16

Channel: https://www.youtube.com/@dai.1387 (CUVET86, the current cohort)

**Equine Reproduction is NOT on this channel.** The home page carries five
sections — ปี3 เทอม1 Final, ปี3 เทอม2, ปี4 เทอม1, ปี4 เทอม2, ปี5 เทอม1 — and no
playlist for it in any of them; "equine", "horse" and "ม้า" do not appear in the
fully-scrolled page text. The public /playlists tab lists only two items, so the
rest of the playlists are unlisted and surface only through the home sections.

**ปี5 เทอม1 actually holds six subjects:**

| playlist | videos |
|---|---|
| Epidemiology VET86 | 12 |
| Aquatic animal medicine VET86 | 10 |
| Avian medicine VET86 | 7 |
| Clinical Problem Solving Comp VET86 | 5 |
| One health VET86 | 5 |
| Milk hygiene VET86 | 4 |

Of these, Epidemiology has no midterm paper at all (checked against the faculty
timetable), so for midterm work the targets are Milk hygiene, Avian medicine,
One health and Aquatic animal medicine.

**Lecture length is about two hours.** The first Milk hygiene video
("2.Milk Introduction + Mastitis & Milk quality 19 Aug 69") runs 7,798 seconds.
Budget accordingly: four Milk hygiene videos is roughly eight hours of audio.

## How to get the transcript — the route that actually works

The videos are **unlisted** and carry a **Thai auto-generated (ASR)** caption
track. Two things that do NOT work, both verified:

- Fetching `captionTracks[0].baseUrl` (with `&fmt=json3`, `&fmt=srv3`, or bare)
  returns **HTTP 200 with a zero-byte body**. YouTube has required a
  proof-of-origin token on that endpoint since 2024. Signing in does not change it.
- The player's CC button reports "คำบรรยาย/คำบรรยายแทนเสียงไม่พร้อมใช้งาน".

What works is the **transcript panel in the page**:

1. Load the watch URL and let the player initialise (allow ~5 s).
2. Click the button whose label is `แสดงข้อความถอดเสียง` (Show transcript).
3. Read `ytd-engagement-panel-section-list-renderer` whose text contains
   `ข้อความถอดเสียง`. Cues render as `m:ss` followed by the line.

Caution learned the hard way: the cue list is **virtualised**. Scrolling it in a
tight loop (50 iterations) froze the renderer and the tab stopped responding.
Scroll in small steps with real waits, or drive the panel by seeking the video.

## What the ASR actually produces, and why step 1 of the hard rules matters

Verbatim from the first minute of the Milk hygiene lecture:

> `0:02` มันเป็น horor มีเวลาเราพูดถึงฝุ่น the food chนมันจะมีพีฮharวestกับ poost harvest
> `0:09` ใช่ป่ะของอาจารย์จักกฤตอ่ะค่ะเป็นพีฮ harวest

The Thai is readable. **The English technical terms are destroyed** — "pre-harvest"
became `พีฮharวest` and `พีฮ harวest`, "post-harvest" became `poost harvest`,
"food chain" became `the food chน`. Those terms are precisely what a question
turns on, which is why the ASR text is raw material and never the answer.

The lecturer's own emphasis does survive, and that is the part worth having:
asides, repetition, and `[เสียงหัวเราะ]` markers all come through, so "what was
stressed" is recoverable even where the terminology is not.

**Therefore:** repair every English term against the lecture slides (visible in
the video frame) or a textbook before it reaches a question, and mark anything
still uncertain as `[ฟังไม่ชัด]`.

## Hard rules

1. **Never ship raw ASR.** The Thai auto-caption is your starting material, not
   your output. It destroys exactly the veterinary terms a question turns on —
   see the sample above, where pre-harvest and post-harvest both came out
   unrecognisable. Repair every English term against the slide on screen or a
   textbook. If you cannot confirm a term, write `[ฟังไม่ชัด]` and move on.
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

One Markdown file per lecture, named `<subject>-L<N>-<short-slug>.md`
(e.g. `milk-hygiene-L2-intro-mastitis.md`), containing:

```markdown
---
subject: milk-meat-hygiene          # the VetMock subject id
lecture: 2
title: Milk Introduction + Mastitis & Milk quality
lectureDate: 19 Aug 69               # printed in the video title
lecturer: <as named on the recording, or omit>
videoUrl: <url>
recordedFor: CUVET86
examPaper: midterm                   # from the faculty timetable, by lecture date
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
