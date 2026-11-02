# Video library: our own copy of every lecture video, built on

Palm, 1 Nov 2026, in order:
- "เป็นไปได้ไหม ที่เราจะเก็ยทุกวิดีโอจากช่องITของเพื่อนผม ซึ่งได้รับอนุมัติแล้ว ใส่คลังVetmock และผมว่าเราจะทำอะไรได้ล้ำๆอีกเยอะ และออกแบบUX/UI ให้สวยขึ้นได้อีก"
- "และเราจะทำระบบ สรุปคลิปอัจฉริยะ ล้ำๆที่โลกนี้ไม่เคยมี และ UX/UIสวยขั้นสุด ... ตัวเล่นplayer อัจฉริยะของเราเอง ละถ้ามีคลิปอัพมาเพิ่มเราก็เอาลงคลังอัตโนมัติไรงี้ automatic ทุกอย่าง"
- "บางอย่างเราไม่จำเป็นค้องใช้AI ได้ครับ เราoptimized ให้ใช้ประโยชน์สูงสุดได้ เสถียรและลื่นไหล เป็นระบบ"
- "ก็sessionที่กำลังโหลดมาเก็บเข้าคลังไว้ไงครับ ผมหมายถึงให้เอามาทำต่อยอด"
- "เรื่องความแม่น คุณภาพของoutput ยันไปถึงจุดที่ผู้ใช้เห็นก็ต้องดีที่สุดนะครับ"
- "เรื่องความเวิ้นเว้อ ของสรุปคลิปด้วยดูดีๆ ให้เหมาะสม อย่าให้้ยาวเกินจนเป็นlecture อีกฉบับไรงี้" and "แต่ยังคงเนื้อหาและคุณภาพทุกๆอย่างครบถ้วนนะ ดูความเหมาะสม"

The channel is https://www.youtube.com/@dai.1387. The permission on file, with its date and Palm's words, is `src/data/video-channels.js`; the owner's own written confirmation is still to come.

## 1. What is there today

- `src/data/videos.js` lists the channel by playlist, one card per course.
- 108 of its videos have a long clip summary (`src/data/video-summaries-*.js`) whose `[m:ss]` stamps the AI cites (`api/_lib/ai/retrieve.js`).
- The lecturer sets name 51 recordings by session and deck topic (`src/data/lecturer-sets.js`).
- A question whose source cites `VET86 <id> [m:ss]` opens that minute (`QSourceChip`, `momentHref`, `/app/videos?v=&at=`).
- Missing: a topic does not know which clip and which minutes teach it; there is no short summary, no player of our own, no copy of the files.

## 2. The channel, inventoried 2026-11-01 (YouTube Data API v3)

| Fact | Value |
|---|---|
| Channel | UCCyb7FcNA6xQa0jOwQtNRSQ, display name WW, 0 public videos |
| Playlists reached | 21: 2 public, 19 unlisted, opened from the links in `videos.js` |
| Its own videos | 192, 361.9 hours, every one unlisted and embeddable |
| Captions | none uploaded by the owner; YouTube's automatic Thai captions on 187, none on 5 |
| Chapters | none; 13 descriptions carry the owner's notes ("เริ่ม 27:21", "ไม่มีอัด") |
| Not the owner's | 41 videos in its two public playlists, uploaded by 9 other accounts: outside the permission, kept out |
| Unavailable | 2 playlist items |
| Media | YouTube answers 403 to a download (its anti-download protection); not worked around |

The API lists only public items, so an unlisted upload outside these 21 playlists is invisible from outside: completeness past them needs the owner (section 7).

## 3. Pipeline, deterministic first

| Stage | How | AI |
|---|---|---|
| Inventory | `scripts/video-channel-inventory.mjs`: Data API, seeded from known playlist links | none |
| Captions | YouTube's timed text with word timing (json3) or `npm run fetch:videos` | none |
| Copy | the owner's export (section 7), stored in R2 | none |
| Captions where none exist | faster-whisper large-v3 on Palm's GPU (RTX 5050), from our copy | local model, no API cost |
| Deck | the library deck of the session (lecturer sets, else title and date), per-page text and red marks: `scripts/video-deck-pages.py` | none |
| Slides without a deck | scene-change frames from our copy (ffmpeg), perceptual-hash dedupe, blank and blur filters | none |
| Analysis | `scripts/video-analyse.mjs` | none |
| Summary | `scripts/video-summarise.mjs`, from the slices the analysis picked | yes, the only stage |
| Checks | `src/lib/video-summary-check.js` (code) plus two model readings | two readings |

`video-analyse.mjs` reuses the AI chat's own reader (`api/_lib/ai/textindex.js`, `concepts.js`, VetWiki aliases, the glossary):
- **Breaks:** 45 s or more without speech.
- **Deck alignment:** each page placed at the minute its terms are heard, by a forward-only best path over one-minute windows; a page between two heard pages counts as taught.
- **Chapters:** runs of pages under one heading, at least 2 min, split at a page past 6 min. Without a deck: the topic segments.
- **Topic segments:** each minute scored against each curriculum topic's profile (the bank's questions on the topic and its label, weighted by how specific a term is to the topic), smoothed so a passing mention never flips the topic; under-5-minute detours fold into their host. Each segment carries its evidence (terms and the second they are heard), a margin and a confidence.
- **Must-cover list:** named concepts (VetWiki and glossary names, the slide's acronyms and organisms, English words shaped like medical terms, heard in under a quarter of all cached lectures), stressed moments ("จำไว้", "อย่าลืม", "ข้อสอบ"; "ไม่ต้องจำ" excluded), red marks on taught slides, and the numbers on taught slides (those the bank asks about flagged).
- English terms the captions wrote in Thai script (ซับมิวคซ่า, ไมโอมมิตร) are found by consonant skeleton, five consonants or more.

## 4. The summary (policy and its enforcement)

Purpose: decide what to watch and review the essentials before the exam; never a second lecture.

| Layer | Budget | Where |
|---|---|---|
| One-liner | 30 words | card |
| Key points | 3-5 up to 20 min, 5-7 up to 45, 10 beyond; ceiling 14 | card shows the first 3, the rest behind ดูเพิ่ม |
| จุดเน้น | 3 | card |
| ต้องจำ | 5 short definitions, numbers, differentiators | card |
| Chapter lines | one per chapter, 30 words | player's chapter panel only |
| Topic index | every must-cover concept and slide number, with its jump | player |

The expanded card stays within 250 words and 4% of the transcript. A key point is one sentence, has a timestamp and teaches something examinable; note voice (no "อาจารย์กล่าวว่า", no quote tables, no colour or slide talk, no middle dot, Thai with English terms).

How it is made so the rules hold by construction, not by hope:
- Code fixes the shape first: one key-point slot per equal stretch of teaching time, one line per chapter, at most 3 and 5 of the others. The model fills in text.
- A repeated fact is resolved by code: an emphasis that repeats a key point becomes its star, a repeating ต้องจำ goes.
- A chapter line over its cap sheds its last comma-separated parts while coverage stays complete.
- A jump moves to the caption line that says the point's own number or rarest term, within a minute before and four after.
- Checks, every item: the lint (budgets, voice, one sentence, Thai), coverage, numbers and abbreviations against the evidence of that moment (transcript around it and its chapter's slides), a second model reading against that evidence, a third reading for clarity alone.
- A failed item is rewritten on its own with its evidence, up to four rounds; what still fails holds the summary, which is never published. `--resume` repairs a held summary, `--redo=<item>` is a reviewer's rewrite, `--recheck` rejudges after a checker change. Verdicts are cached with the summary, so an unchanged item is never read twice.

## 5. Player and pages

- Our file in an HTML5 video element with our controls: chapters and topic marks on the timeline, the transcript following playback with click-to-seek, the summary, chapter and index panels, speed, resume and watched stretches. YouTube's own embed is the fallback when our copy is missing: a still and a button until tapped, then `youtube-nocookie.com` through the IFrame API driving the same panels, with YouTube's branding and ads untouched.
- Phone: the player on top, panels as tabs below. iPad and desktop: panels beside the player. Light and dark, reduced motion (no animated transitions), Thai copy from `src/data/glossary.js`, headings line-height 1.2 and letter-spacing 0.
- A topic page lists "ดูช่วงนี้": the clips and minutes that teach it, from the topic segments and the index.
- A wrong answer offers the moment that explains it: its cited minute, else its topic's best segment.
- The AI cites clip and minute for every summarised video, from the summary layers.
- Transcript search runs over the private transcripts, behind sign-in.

## 6. Storage and delivery

- Media, transcripts and slide frames live in Cloudflare R2, private, never in this public repository. They are served as short-lived signed URLs to signed-in students only (`api/_lib/r2.js` `presign`, the `library-file` pattern, behind the Chula sign-in). MP4 with faststart and HTTP range requests, no HLS. The player mints a fresh URL when one expires mid-lecture.
- The registry, summaries and topic index are data in the repository, like today's clip summaries.

## 7. Automatic ingest

- **Discovery:** the owner grants read-only access once (OAuth, `youtube.readonly`) so the job lists every upload, unlisted included; until then, new playlist links are added to `videos.js`.
- **Media:** the owner's originals, from a Google Takeout export for the back catalogue and a shared folder for new recordings. YouTube downloads are refused (403) and are not a clean source.
- **Schedule:** a weekly GitHub Actions run (free on a public repository). It covers inventory, captions, analysis, summary and checks, then opens a pull request with only what passed, which CI gates and auto-merge publishes. Held videos are listed with their reasons.
- **Machine-heavy steps** (transcoding, frames, local ASR) run on Palm's machine as a scheduled task, or on a runner without GPU for frames only.
- **Monitoring:** every run writes its report; a row in `api/_lib/system-status.js` shows the last run, new, published, held and failed on `/app/admin`. A missed week shows as stale, never as healthy.
- Every stage is idempotent: cached by video id plus a hash of its caption text, so a run with nothing new makes no model call.

## 8. Costs

| Item | Measure | Monthly |
|---|---|---|
| Summary model (DeepSeek, project key) | sample: 11-15 calls, 67-84k input and about 3k output tokens per fresh run; the balance fell ¥0.17 (103.28 to 103.11) over every sample run, about half a million input tokens, so one fresh run with its repairs costs roughly ¥0.03-0.05 (the balance posts late: read it the next day) | whole channel about ¥6-10 (US$1-1.5) once; a new lecture about ¥0.05 |
| R2 storage | sample: 1080p H.264 244 kbps + AAC 129 kbps = 207 MB for 74 min; channel 60-100 GB | $0.015/GB-month past 10 GB free: about $0.75-1.35 |
| R2 reads | range requests, Class B $0.36/M past 10M free | $0 at the cohort's size |
| Egress | R2 egress is free | $0 |
| Local ASR, frames | Palm's GPU | $0 |
| GitHub Actions | public repository | $0 |
| Vercel | one small function call per play to sign a URL; no video bytes through Vercel | negligible |

R2 prices: developers.cloudflare.com/r2/pricing, read 2026-11-01.

## 9. Acceptance checks

- **Mapping:** every video-topic link carries its evidence (terms and seconds). A sample is checked by hand; below the bar is held.
- **Timestamps:** every jump lands on the sentence that explains it. Checked by code against caption timing and by hand on the sample.
- **Summary:** lint, coverage, evidence, the two readings; held when any fails.
- **Slides:** readable, matched to their minute, no duplicates or blanks.
- **What students see:** the real pages walked on iPhone and iPad Safari, Android Chrome, desktop Chromium and Firefox, light and dark, reduced motion, loading, error, slow network and offline. Each page is read as text from an accessibility snapshot.
- **Before scaling:** Palm reviews this plan and the sample. After the whole channel, a random 10% is rechecked the same way before calling it done.

## 10. Sample: 7.Endometritis in mare, 1 Oct 69 (0gTn7Up9Vj0, 74 min, final paper)

- Inputs: YouTube captions (1,207 lines, 10,726 words), the library deck (41 pages, 48 red spans), the bank (equine repro questions).
- Analysis, no model: 1 break (0:00-4:50), 19 chapters following the deck, one topic segment 5:00-73:52 `eqrepro-endometritis` at high confidence, must-cover 108 (60 concepts, 20 stressed moments, 12 marks, 16 slide numbers).
- Summary: pass. One-liner 20 words, key points 117 (10 points), จุดเน้น 36 (3), ต้องจำ 21 (3), card 194 of 250, 1.8% of the transcript; chapter lines 388 words.
- Coverage: 108 of 108 (topic index 76, chapter lines 15, key points 14, ต้องจำ 2, จุดเน้น 1).
- Jumps: code confirms 13 of 16 card items against caption timing; read by hand, 15 of 16 land on their sentence (the other two say their term in Thai script or as a two-letter term) and one lands 27 seconds early, at the start of its part.
- What the checks caught on the way, each now a rule: a book author named as the lecturer, every key point bunched in the first half, a pathogen listed as a predisposing factor, BSE for breeding soundness examination, "fertilize" where the lecture said no such thing, "red คือ ..." written into a line.
- Known limits: the clarity reader is strict and stochastic (verdicts are now cached); a fresh run can still end held on one over-long chapter line, which `--resume` repairs.
- Not yet done for the sample: our own copy (the 403), frames, the player.

## 11. Skipping what teaches nothing (built 2 Nov)

"เพราะอย่าลืม ว่าเราสามารถจัดช่วงไม่จำเป็นออกได้ เช่น dead air หรืออื่นๆตามความเหมาะสม"

The skip list is non-destructive. Our copies stay whole, and the player follows a list of stretches per video.

- **Evidence:** `scripts/video-media.mjs` runs ffmpeg `silencedetect` (-40 dB, 4 s or more) on each copy while it is on disk and writes `silence.json`.
- **Rule:** `skipSpans` in `scripts/video-analyse.mjs` skips a stretch only when all of these hold:
  - it has no caption at all;
  - it lasts at least 20 s (`VIDEO_SKIP_MIN`) after 1.5 s is kept on each side of speech;
  - ffmpeg measured it 70% or more silent;
  - in mid-lecture, the slide does not change (a silent clip played in class moves the picture, so it stays). Before the first word and after the last, the screen share starting or ending is not teaching.
- **Without the silence measurement nothing is skipped.** Missing captions alone can hide speech.
- **Off-topic speech** (chat before the lecture, a tail after it) is not judged yet. It needs a model and stays out until that judgment is cached per video.
- **Player:** the study panel's switch "ข้ามช่วงที่ไม่มีเนื้อหา" is on by default and remembered per device. It shows "ประหยัด N นาที" when a video saves at least a minute. The skipped stretches are drawn faintly on the chapter bar.
  - Only playing on into a stretch jumps it. A seek or a cited moment that lands inside one plays it.
  - Stamps and links keep their original times.
- **Sample (0gTn7Up9Vj0, 74 min):** 20 silent stretches of 4 s or more. One stretch is skipped: the 4:48 before the lecture starts. The result is the same for every minimum from 8 to 30 s. Every pause in mid-lecture is shorter, has speech, or shows a changing slide.
- **Checks:** `tests/unit/video-skips.test.mjs` covers the rule. Speech is never inside a skip, and a stretch under the minimum, with sound, or on a moving slide is never skipped.

## 12. Paused 1 Nov 2026, 21:00 (Palm's request)

State on the branch `claude/video-library` (local, not pushed):

- **R2:** 10 copies uploaded, each verified by size. 11 uploads failed on a timeout bug (fixed: the timeout must be an integer) and are redone on resume. `scripts/video-media.mjs` now stops under 20 GB free (`VIDEO_MIN_FREE_GB`) and deletes a local copy after its upload, or after a failure.
- **Local data** (`C:/dev/vetmock-video-data`, outside the repo): captions, analyses and frames only; every local video and deck PDF was removed at the pause.
- **Pipeline:** the deck re-match (`--step=decks --force`) was stopped mid-run. On resume, run it again, then `--step=analyse --force`, then `node scripts/video-registry.mjs`.
- **Code:** status row `videos` on /app/admin (reads `videos/_status.json`), `/api/video-file`, the registry and API tests pass. Open: VideoView's own-copy state must key by clip and skip the registry load, so a clip never makes a YouTube player and throws it away (3 failing cases in `tests/unit/source-label.test.mjs` until then); the player effect is located there by its deps.
- **Waiting on Palm:** the polish pass on the sample comes before scaling the summaries; the go-ahead to summarise every clip after that; the owner's original files.
- **First step on resume:** fix the VideoView state above, rerun `npm run test:unit`, then the sample polish pass (layout on phone, tablet and desktop in both themes, wording, accuracy, accessibility snapshot).
