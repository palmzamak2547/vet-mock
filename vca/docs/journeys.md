# VCA journeys: evidence before design

Phase 1 of the journey work on vca.vetmock.com (owner brief, 2026-10-21): who uses the site, what
each journey costs a candidate today, and a performance baseline to hold every later change to.
No code changed for this page. Everything below is measured, read from the code or the data, or
cited; anything not checked says so.

Measured on production (`https://vca.vetmock.com`, main at `17756b88`) on 2026-10-21, Bangkok
afternoon. Tools: `scripts/journey-audit.mjs` (every page at 360, 390, 768, 1280 and 1440 px, light
and dark) and `scripts/perf-journeys.mjs` (each journey timed in Chromium and WebKit), both added
with this page so a later release can run the same measure.

## 1. Who uses it

From data only. There is no analytics on the site (no script in `index.html` or `src/`, no Vercel
Web Analytics), so how many people visit, from where and on what device is **not known**. What is
known:

| Source | What it says |
|---|---|
| The exam itself (`src/data/exam.js`, from the evaluation centre's announcement 10/2568) | Round 2/2569 sits on Sat 23 Jan 2570 (part 2, 13:30 to 16:30) and Sun 24 Jan 2570 (part 3, 09:30 to 12:30); results 25 Feb 2570. Three hours and, by the cohorts' record, 200 questions a part, so 54 seconds a question. Today that is 94 days away. |
| The recalled paper (`../src/data/questions-vca-2569.js`) | 132 questions recalled from round 1/2569 part 2 (6 Jun 2569); 9 carry an unsettled answer and are held back, so **123 reach learners**. Most-recalled topics: theriogenology 14, parasitology 12, dog and cat 11, ruminant 11, epidemiology 10. 9 have a figure. |
| The bank on the site | 5,906 questions in 19 domains; 1,853 from past papers the cohorts recorded, 437 VCA-style, 1,050 aligned to the paper, 1,276 from lectures, 1,290 course banks; 76 more held back. Smallest domains: imaging 35, micro and immuno 42, juris 54. |
| The community (`vca` schema, read-only aggregate, 2026-10-21) | 3 profiles, all created since launch on 17 Oct; 0 posts, 0 comments, 0 likes; 1 chat message in 5 rooms; 0 reports. |
| Account | The same VetMock account (Google, LINE through LIFF, or an email link). The LINE Login channel was published on 2026-10-21 (no-demo session), so students outside the tester list can sign in with LINE from today. |

What this means for design, without inventing anyone:

- The candidate is someone sitting a three-hour, 200-question licensing paper in about three months,
  paying 2,000 baht a part (procedure page), studying from the same recalled papers their seniors
  kept. The site's job is calm, honest readiness for a fixed date.
- The community is empty. Every community journey today is its first-post moment, so the empty state
  is the product.
- Practice needs no account and stores everything in the browser it ran in. That fact interacts badly
  with in-app browsers (section 3.2).

## 2. Method

- **Journeys walked** on a phone profile (390 x 844, touch) through the accessibility snapshot, as a
  reader would meet them, and every page captured at five widths in both themes.
- **Static audit** per page, width and theme: console errors, sideways overflow, visible Thai text
  under 14 px, tap targets under 44 px, controls without a name (`journey-audit.mjs`; 120 page loads).
- **Performance** per journey (`perf-journeys.mjs`, median of 3 runs): Chromium headed with the GPU on
  a phone profile and 4x CPU slowdown; WebKit on the same phone size (no CPU slowdown exists there);
  Chromium at 1440 px unthrottled. LCP and CLS where the engine reports them, the slowest interaction
  (INP-like, Event Timing), total blocking time, the wait the candidate sees (a tap until the next
  screen can be used), and frame gaps while scrolling or while a transition plays.
- **Evidence from shipped products**: Lazyweb (two saved searches, linked in section 5). Mobbin is
  not connected. Lazyweb holds almost no real exam-prep apps (no UWorld, Amboss, Magoosh, Kaplan,
  Anki or Khan Academy screens surfaced); the references are adjacent learning and consumer apps.
- **In-app browsers**: official LINE and Google documents, plus the site run under LINE, Facebook and
  Instagram user agents in Chromium and WebKit (section 3.2 says what that can and cannot show).

## 3. Journeys

Each journey: what happens today, the friction found (taps, waits, dead ends, copy), the emotional
moment, and what shipped products do. Timings come from section 4.

### 3.1 First visit from a shared LINE link

**Today.** A link tapped in a LINE chat opens in LINE's in-app browser unless the link carries
`?openExternalBrowser=1` or the reader's LINE setting says otherwise
([LINE URL schemes](https://developers.line.biz/en/docs/line-login/using-line-url-scheme/)). The
first phone viewport (390 px) holds the countdown chip "สอบรอบ 2/2569 อีก 94 วัน", the headline,
"5,906 ข้อ ครบ 19 หมวด เฉลยทุกข้อ ไม่ต้องสมัคร", "เริ่มเลย 10 ข้อ", "สอบจำลอง", "ตั้งชุดเอง", a
sample question to answer in place, and the top bar's own "เริ่มฝึก". One tap starts ten questions.
No account is asked for.

**Friction.**
- Four ways to start in one viewport (เริ่มเลย, สอบจำลอง, ตั้งชุดเอง, the bar's เริ่มฝึก) plus the
  sample question: five choices on a first look (Hick-Hyman: choice time grows with log2(n + 1)).
- The page is long: 8,998 px at 390 wide (10.7 screens) and 5,705 px at 1440. The exam-date plan
  ("สอบวันไหน", the block that turns a date into a daily amount) is the last section.
- Section kickers are English ("The collection", "Three ways in", "Provenance", "The archive",
  "Mock exam", "YOUR PROGRESS", "THE COMMONS", "THE NEXT SITTING"). This is the editorial look Palm
  chose and it stays; noted only because mixed languages on one screen is a known stumble.
- Visible Thai under 14 px: 47 pieces on home at 390 (counters "ข้อ" 12.5 to 13.5 px, the button's
  "10 ข้อ" 12.5 px, the sample's plate 12 px, footer headings 13 px).

**Emotional moment.** A candidate opening a friend's link 94 days before the paper. What calms:
the countdown as a fact, not an alarm; "ไม่ต้องสมัคร"; a question to answer right there. All three
are already on the first screen.

**What shipped products do.** NYT Games invites an account only "to track progress" and never gates
play; Duolingo puts a first short lesson before any sign-up and asks to save progress after value;
Target's sign-in wall as a first screen is the anti-pattern (Lazyweb search A, section 5). VCA
already follows the good pattern; the work here is subtraction, not addition.

### 3.2 Sign-in (Google GIS popup, LINE LIFF, email link) and in-app browsers

**Today.** The person icon in the top bar opens a sheet: Google's own button (a GIS popup naming
vetmock.com), "ดำเนินการต่อด้วย LINE", and an email link. The sheet says practice needs no
account. Every browser gets the same order, Google first.

LINE sign-in leaves the site: VCA, LINE Login (`access.line.me`), back to `/auth/line`, VetMock's
`line-auth` function and a Supabase link, `/auth/callback`, then the page the reader left. Five
hops, each a page load on a phone connection.

**Friction (documented; not reproducible on this machine).**
- **Google in an in-app browser.** Google refuses OAuth inside embedded webviews (Android WebView,
  WKWebView) with `403 disallowed_useragent`, enforced since 30 Sep 2021
  ([Google](https://developers.googleblog.com/2021/06/upcoming-security-changes-to-googles-oauth-2.0-authorization-endpoint.html)).
  LINE, Facebook and Instagram open links in such webviews, so the first button a LINE visitor sees
  may be the one that fails. A user-agent change in desktop Chromium does not reproduce it: the popup
  opened normally ("ลงชื่อเข้าใช้ ไปยัง vetmock.com") under LINE's and Instagram's Android user
  agents. Whether the GIS popup fails, opens a tab, or works in LINE's in-app browser on iOS and
  Android needs a real phone.
- **LINE inside LINE.** LINE says a LIFF app opened from a plain https link in a chat runs in LINE's
  in-app browser, which LIFF treats as an external browser (`liff.getContext().type` is
  `external`), with several LIFF features unavailable
  ([LINE](https://developers.line.biz/en/docs/liff/differences-between-liff-browser-and-line-in-app-browser/)).
  Whether `liff.login` there signs in without asking again is not stated; check on a phone.
- **An email link** opens in the mail app's browser or the default browser, not back in LINE. The
  candidate ends up signed in somewhere else.
- **"เก็บในเครื่องนี้".** Practice and results live in the storage of the browser they ran in. A
  candidate who practised in LINE's in-app browser and later opens Safari finds nothing there. The
  copy says "this device"; it means "this browser".

**Emotional moment.** Signing in is optional here, which is right. The risk is a failure on the
first try that reads as "the site is broken" weeks before an exam.

**What shipped products do.** Bottom sheets that keep the reader's context (IFTTT, MAC, Webnovel)
and say what signing in gives (Webnovel). No Lazyweb example handles in-app browsers; that guidance
comes from LINE's and Google's documents.

### 3.3 Exam countdown and calendar

**Today.** `/exam` opens on "อีก 94 วัน", "สอบ VCA รอบ 2/2569", "ประกาศผล 25 ก.พ. 2570", then
"ใช้เป็นวันสอบของฉัน", "ลงปฏิทิน" (an .ics file) and "แชร์", then a ticket per part (date, time,
200 ข้อ, 3 ชั่วโมง), each fact with its source. On home the plan block asks for the date again
("ยังไม่ได้ตั้งวันสอบ" with "ใช้รอบ 2/2569 23 ม.ค. 2570").

**Friction.**
- The date is known (one announced round ahead), yet the plan starts empty and asks on two pages.
- Once set, the daily amount is the unseen part of the whole bank over the days left: 5,906 over
  94 days is 63 questions a day today, one large number handed to an anxious reader.
- Small targets on `/exam` at 390: eight footnote markers 6 x 14 px ("หมายเหตุ 1" to "8"), the
  almanac table's domain links 26 px tall, the source link 23 px tall.

**Emotional moment.** The countdown is the strongest motivator and the strongest stressor on the
site. Calm comes from a plan that is small today and visibly enough.

**What shipped products do.** BetterMe and Alma ask for the event date first, build the plan toward
it and show the countdown once; Duolingo lets the learner choose the daily goal (Lazyweb A and B).

### 3.4 Practice by section

**Today.** "เริ่มเลย 10 ข้อ" draws ten questions and opens the first; a domain page or `/practice`
opens the builder (mode, 19 domain chips, mix, size, source, status) with a sticky glass bar holding
the count and "เริ่มฝึก". In a set, an answer turns the option red or green at once, says
"ยังไม่ถูก คำตอบคือ C" and opens "ทำไม" with the reasoning; the bottom bar holds "ข้อถัดไป"; "คุยข้อนี้"
links the community.

**Friction.**
- The builder is six choices deep and 3,613 px long at 390. Defaults are good, so start works at
  once; the depth costs only those who read it.
- 23 pieces of Thai under 14 px on the builder (legends and option hints 13 px).

**Emotional moment.** Being wrong. The feedback does this well: the right answer and the reason come
together, in plain words.

**What shipped products do.** Duolingo gives a short takeaway first and more on demand; Mathway puts
the explanation behind a paywall (anti-pattern). VCA gives the full reason, free.

### 3.5 Mock exam

**Today.** `/practice?mode=mock` defaults to 50 questions at 54 seconds each ("เท่าสนามจริง"). The
run shows a timer, a progress bar, a flag button and the question map (a grid, legend "ตอบแล้ว /
ปักธง / ยังไม่ตอบ", and "ส่งคำตอบ"). The close button offers "พักไว้ก่อน กลับหน้าแรก", sending now
or ending here, and "ทิ้งชุดนี้". A started set survives a reload and a later visit.

**Friction.**
- Sending early is reached only through the map or the close button; the bottom bar shows
  "ส่งคำตอบ" on the last question only.
- Submitting takes about a second before the result can be used (1.05 s at 4x CPU, section 4).

**Emotional moment.** The timer. Leaving and pausing are safe, which removes the worst fear (losing
work).

**What shipped products do.** Lazyweb holds no real exam navigator, flag or submit-summary screens
(thin evidence). Mimo's hearts modal over a quiz is the anti-pattern (punitive interruptions); VCA
has none.

### 3.6 Results and weak areas

**Today.** The result opens on a ring with the score and "ถูก 2 จาก 10", a handwritten verdict
chosen by score ("แม่นมาก!", "ไปได้ดี", "ยังมีที่ต้องเก็บ", "เริ่มจากข้อที่พลาดก่อน"), then
"อีก 10 ข้อ", "ฝึกข้อที่พลาด 8 ข้อ", "ทำชุดใหม่แบบเดิม", export to Anki, Quizlet and Sheets, and
"ชวนเพื่อนมาซ้อม". Below: "รายหมวด" (a meter per domain) and the review filtered by wrong, right,
skipped and flagged.

**Friction.**
- "รายหมวด" lists domains in the order they first appeared in the set (`byDomain` in
  `lib/session.js`), not weakest first, and each row opens the domain page, not practice on it.
  After a 50-question mock over many domains, the weakest is found by reading every meter.
- The share text carries the score ("ซ้อมสอบ VCA ได้ 20% จาก 10 ข้อ มาซ้อมด้วยกัน"): an odd
  default for inviting friends after a low score.

**Emotional moment.** The end of a run decides how the run is remembered (peak-end). The verdict is
kind at every score and the first action fixes what was missed. That stays.

**What shipped products do.** Elevate and BoldVoice show a score, then a per-skill breakdown; Babbel
and Codecademy make review of the weak part the next step; Capwords pairs the score with
encouragement (Lazyweb A).

### 3.7 Community: board and chat

**Today.** The `vca` schema holds 0 posts and 1 chat message. `/community` opens on its heading, a
"แชท" button, a sign-in card, four kind chips and a domain select; "ยังไม่มีกระทู้" sits below the
fold at 390. The phone tab bar has no community entry; the board is reached from the footer and from
"คุยข้อนี้" under each answer.

**Friction.** The first thing a visitor meets on an empty board is the controls for a full one.

**What shipped products do.** BuzzFeed's empty comments give one clear first action; Sololearn and
Brainly tie discussion to the content (as "คุยข้อนี้" does).

### 3.8 Profile and share card

**Today.** Signed out, `/me` shows one card ("เข้าสู่ระบบด้วยบัญชี VetMock เพื่อมีโปรไฟล์ในชุมชน"
and a button) above empty space. Three things answer to "me": the tab "ฉัน" (progress), the footer's
"โปรไฟล์ของฉัน" (`/me`) and the top bar's person icon (sign in). A signed-in profile has an
`/u/<handle>` page with its own link preview.

**Friction.** The naming overlap, and a signed-out page that does not say what a profile adds.

**What shipped products do.** Alma and Partiful let people choose what a share card shows; share
progress, not rank (Lazyweb B).

### 3.9 Offline

**Today.** The service worker serves pages network-first with a 3 s fallback to the cached copy,
keeps the app and the bank in separate caches, and a set opened once can be practised offline. A new
set offline draws only from shards already on the phone; a start that cannot load says so ("ตอนนี้
ออฟไลน์อยู่ ข้อสอบชุดนี้ยังไม่เคยเปิดในเครื่องนี้ ต่อเน็ตแล้วลองอีกครั้ง"). There is no standing
offline indicator. The scripted offline pass did not finish (the machine froze mid-run), so this is
read from `public/sw.js` and `pages/Home.jsx`, not re-observed.

## 4. Performance baseline

Production, 2026-10-21 evening. **The caveat over every number:** the machine ran at 71 to 100% CPU
from other sessions (measured before each profile), so absolute values are inflated and noisy (home
LCP read 3.6 s in a headless pass and 13.7 s in the headed pass an hour later). They are a record,
not a target. Every Phase 3 release is measured **A/B in one run**, its build against main's,
alternating run by run (`node scripts/perf-journeys.mjs <main build> <change build>`), so load hits
both alike.

Chromium, headed with the GPU, phone 390 x 844, 4x CPU, median of 3 (machine load 71% at start):

| Journey | Wait the reader sees | LCP | CLS | Slowest interaction | Frames over 50 ms (p95 frame) |
|---|---|---|---|---|---|
| Home, cold, then scroll | | 13.7 s (`p.lede`) | 0 | | 54 (206 ms) |
| Start 10 from home | 1.18 s | | 0.078 | 184 ms | 12 (134 ms) |
| Answer one, then next | 0.55 s | | 0 | 160 ms, then 96 ms | 1 |
| Mock: start, map, submit | 0.97 s, , 1.05 s | | 0 | 96, 216, 168 ms | result scroll 19 (72 ms) |
| Sign-in sheet | 1.56 s | | 0 | 224 ms | 12 (139 ms) |
| Tab change (home to คลัง) | 1.28 s | | 0 | 152 ms | 12 (79 ms) |
| /exam, then scroll | | 2.9 s | 0.002 | | 32 (127 ms) |
| /practice, then scroll | | 2.1 s | 0 | | 52 (115 ms) |
| /bank, then scroll | | 16.4 s (a button) | 0 | | 56 (158 ms) |
| /progress, then scroll | | 3.0 s | 0 | | 63 (139 ms) |
| /community, then scroll | | 3.2 s | 0 | | 9 (31 ms) |

0 console errors in every journey. Two numbers stand out whatever the load: starting a set shifts
the layout (CLS 0.078; a headless unthrottled pass gave 0, so it depends on timing), and `/bank`'s
LCP is a late button as the list fills in (the LCP-candidate trap: not a 16 s load).

WebKit through Playwright on Windows, phone 390 x 844: every journey completed with 0 console errors
and 0 layout shift. Its frame times (p95 0.5 to 1.6 s) come from Windows WebKit without GPU
compositing on a loaded machine and say nothing about Safari on an iPhone, so they are not used. It
does not draw `backdrop-filter` either, so the sign-in sheet looks transparent there; Chromium
draws the blur.

The desk profile (Chromium 1440 px, no slowdown) was stopped by the freeze and not re-run.

### What can and cannot be tested here for in-app browsers

| Question | Here | Needs |
|---|---|---|
| Layout and copy under LINE, Facebook, Instagram user agents | Yes (the app does not branch on the user agent today) | |
| Google's `disallowed_useragent` in a webview | No (a spoofed user agent is not refused) | A real phone with LINE and Facebook |
| LIFF login from LINE's in-app browser | No | A real phone with LINE |
| Storage shared or not between LINE's browser and Safari or Chrome | No | A real phone |
| `openExternalBrowser=1` handing off to the default browser | No (documented by LINE) | A real phone |
| WebKit layout, focus and errors | Yes (Playwright WebKit) | A real iPhone for motion and glass |

## 5. Evidence

- Lazyweb search A (sign-in, countdown, practice, mock, results):
  https://www.lazyweb.com/agentic-search/b5da7ff9-d2ba-4a00-a9d4-dcb53e78941f
- Lazyweb search B (topic picker, mock, community, share cards, offline, calm):
  https://www.lazyweb.com/agentic-search/74b3e9a5-78f9-4da9-9e7b-681fa945d049
- Google, embedded webviews: https://developers.googleblog.com/2021/06/upcoming-security-changes-to-googles-oauth-2.0-authorization-endpoint.html
- LINE, URL schemes (`openExternalBrowser`): https://developers.line.biz/en/docs/line-login/using-line-url-scheme/
- LINE, LIFF browser and LINE's in-app browser: https://developers.line.biz/en/docs/liff/differences-between-liff-browser-and-line-in-app-browser/

## 6. Where the evidence points (input to Phase 2)

Ranked by how many candidates it reaches and how sure the evidence is. None rebuilds a screen; each
is a targeted change that keeps the look and the motion.

1. **Sign-in that works where the link was opened.** In LINE's in-app browser, LINE first and
   Google behind an "open in your browser" step (`openExternalBrowser=1`); in Facebook and Instagram,
   a plain way to open the browser. "In this browser" where the copy means it.
2. **The exam date already set** from the announced round (changeable), and today's amount stated
   gently.
3. **Results: weakest domain first, one tap to practise it.**
4. **Thai at 14 px and up, targets at 44 px and up**, on the pieces listed above.
5. **The top bar's join off the main thread** (handed over by the scroll session: about 10 ms of
   lifecycle a frame at 4x CPU while the bar runs together), measured with `scripts/perf-join.mjs`.
6. **The layout shift when a set starts** (CLS 0.078 at 4x CPU).
7. **The empty board's first action first.**

## 7. Phase 3 status (paused 2026-10-22 at the weekly-usage pause; resume after 2026-10-25 13:00 UTC)

Direction shown to Palm: https://claude.ai/artifact/GRc9XHcuVNyxRZrVw3WFYb. Five draft PRs, one
change each, every one on its own branch from main (worktrees under `C:/dev/vca-*`, node_modules
junctioned to `C:/dev/vca-journeys`; never run `npm ci` in the junctioned ones):

| PR | Branch | Change | Proven so far |
|---|---|---|---|
| #48 | `claude/vca-journeys` | This page, the two probes, sign-in in LINE/Facebook/Instagram browsers | inapp + boundaries unit tests pass locally; e2e written |
| #49 | `claude/vca-results` | Result domains weakest first, one-tap practice of the weakest | session unit tests pass locally (17/17); e2e written |
| #50 | `claude/vca-thai-14` | Thai at 14 px and up on every rule the audit found; note links 44 px on touch | not yet re-audited |
| #51 | `claude/vca-exam-date` | Plan uses the announced round until a date is chosen; smaller first goal over 40 a day | e2e written |
| #52 | `claude/vca-steady-start` | `BusyLabel`: start buttons keep their width (CLS 0.078 on start, cause found) | e2e written |

Not yet done, in order:
1. Read each PR's CI (GitHub runs the VCA job and the e2e matrix).
2. Slot A of the heavy-job gate: `scratchpad/verify-a.sh` (unit, build, full VCA e2e for the five
   branches). Slot B: `verify-b.sh` (base build, previews 4301-4305, perf A/B per PR with
   `perf-journeys.mjs`, `perf-join.mjs` on main). Turn tokens come from the coordinating session.
3. With CI green and A/B no worse than main: mark ready, `gh pr merge --squash --auto`, one at a time.
4. Then: the top bar's join off the main thread (measure with `perf-join.mjs` first; needs a real
   iPhone to confirm the look), and the real-phone checks in section 4.
