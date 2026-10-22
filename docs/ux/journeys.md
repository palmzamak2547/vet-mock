# VetMock user journeys: evidence, friction, opportunities (2026-10-21)

Scope: the study app at https://vetmock.com (src/), production build Study 5.152.1 (main 17756b88).
Not in scope: vca/ (own lane), research/. VetWiki files belong to the VetWiki lane; findings about
them are listed for that owner only.

Method: four evidence lanes on 2026-10-21, read-only against production. Raw reports, scripts and
screenshots stay in `work/ux-journeys/` (gitignored): 01-users, 02-journeys-study, 03-journeys-reading,
04-evidence, 05-perf-baseline. Every number below was printed by a query or a script; the machine was
shared with other sessions, so waits are upper bounds. Top claims were re-checked against the code
before they were ranked (file:line given).

## OWNER DECISION (2026-10-21)

- Glass may be used where it fits ("ใช้ glass ได้เลยถ้าคุณคิดว่าเข้า ลองพิจารณาดูครับ"). This amends
  docs/DESIGN_SYSTEM.md ("the only glass/glow is quarantined to the marketing landing"): the cream/sage
  editorial identity stays the base; glass is a material for a few small chrome surfaces only.
- Scope (relayed from Palm): redesign the journeys where evidence shows friction, not a rebuild. Keep
  well-liked screens and motion. Each change small, targeted at a measured problem, proven not to break
  anything (perf, e2e, both themes).

## 1. Who the students are (real data only)

Signed-in accounts only; the app works signed out and guests are in none of these numbers.

| Signal | Value (measured 2026-10-21) | Source |
|---|---|---|
| Accounts | 44 (32 Google, 12 email); last sign-in within 7 days 5, within 30 days 10 | auth.users |
| Synced answers | 13,167 from 30 users, median 94 each | user_data.history |
| Rhythm | bursts around exams: Apr 6,584, May 4,363, Sep 1,993, Oct 1 (to 10-17) | same |
| Years | year 4: 8,313 answers (9 users), year 5: 2,296 (7), year 1: 82 (2); years 2, 3, 6: none | history year tag |
| Hours (Bangkok) | late night 00:00-05:59 and evening 19:00-23:59 are the peaks; 14:00-15:00 the trough | history timestamps |
| Modes | full exam mode mostly year 4 (137 results, 12 users); year 5 quick sets run ~15 min | public.exam_results (313 rows) |
| Social features | groups 1 (0 members), races 0, comments 0, shared questions 0 | public.* |
| Devices (UA stored at sign-in) | desktop 29 users, iOS 11, Android 3, Instagram in-app 1; LINE sign-in only shipped 2026-10-21 | signed-in UAs |
| Content | 6,786 learner-ready questions: Y1 297, Y2 144, Y3 62, Y4 2,076, Y5 4,207 | `npm run stats` |

What this means for design: the core student is a year 4 or 5 student cramming before an exam,
often late at night (dark theme matters), coming back in bursts rather than daily. Social features are
unused, so they should not take space on primary screens.

Not known: guest behaviour (the majority, probably), the real device mix (Vercel Web Analytics is
installed; its dashboard was not reachable here), feedback themes (feedback is sent as email and not
stored), and the text of the owner's handwritten phone review (scores: phone 4/10, iPad 8/10; the
repo's notes record what was fixed in 5.142.0-5.149.1, no phone re-score since).

## 2. Journeys (390x844 touch unless noted; Chromium, WebKit for J1, J4, J7)

### J1 First visit from a shared LINE link
- `/` shows the marketing landing. The cookie dock covers y 684-844 (19% of the screen) on first paint,
  over the hero demo question; the question cannot be tapped until the dock is answered.
- Taps to the first recorded answer: 5 (เริ่มฝึกเลย, year, phase, เริ่มทำ, option). The hero demo gives
  a first success in 3 taps but is not connected to the app flow.
- Shared `/app/study` and `/app/review` links open the landing under that URL; after year and phase the
  student lands on Home, not the page the link named (`App.jsx:457-470`, `view-route.js:125-133`, by design
  for the year question; the lost destination is the friction).
- `/wiki/...` and `/app/library` open the real page directly (good).
- Landing has 171 Thai text nodes under 14 px (11-13.5 px).

### J2 Year and exam phase
- Phase change is a full-page detour from the header; three names for one idea ("ช่วงสอบ", "Phase",
  "ทม.1 ปลาย"/"เทอม 1 ปลาย").
- Out-of-phase subjects show grading-scheme text ("Final 40% (Mid 40 + Final 40 + งาน 20)") instead of a
  count. Keep: the "แนะนำ" tag by exam calendar.

### J3 Daily return
- The plan card ("ทบทวนข้อผิด 6 ข้อ ... ประมาณ 12 นาที [เริ่มฝึก]", time chooser 15/30/60) is the strongest
  screen in the app: one named action with a reason and a time. 1 tap to resume.
- Home is 5,248 px (6.2 screens). The sign-in nudge reads as a pending task ("1 รายการ"). The exam
  countdown ticks seconds next to the one action.

### J4 Practice to results
- 3 taps Home to question 1. Feedback in 63-214 ms (Chromium) with per-option reasons and a source.
- Default config for a first-timer: 60 s per question, auto-advance on timeout.
- After a wrong answer at 390 the correct option sits partly under the sticky bar.
- The last question turns the button into "ส่งข้อสอบ ✓" and opens a "ส่งข้อสอบ?" dialog although every
  answer was already revealed (`ExamView.jsx:198,244`).
- Results at 60%: "ทำได้ดีมาก! ถึงเกณฑ์ซ้อมแล้ว" next to "ยังไม่ถึง 70% ... ทำขั้นนี้อีกชุด"; at 70% the
  retry-wrong action drops to third. Results copy "ข้อไหนที่พลาดซ้ำเป็นครั้งที่สอง จะถูกดึงเข้าคิวทบทวน"
  contradicts the landing's "ข้อที่ตอบผิด ... จะเข้ารอบทบทวน" (`landing/dict.js:214,244`).

### J5 Exam mode
- Config label "วินาทีต่อข้อ (รวมเป็นงบของทั้งชุด)" is hard to parse; map title "แผนผังข้อสอบ (EXAM MAP)".
- Submit dialog counts unanswered and states the cost (keep). Results offer a path for the answered-wrong
  questions only; 6 skipped questions get none.

### J6 Review (ทบทวน tab)
- After 14 answers (6 wrong) the tab says "Due 0 ... 0 การ์ดทั้งหมด" while Home says "ทบทวนข้อผิด 6".
  Cause: a question joins the card queue only after the same miss twice (`App.jsx:2251` threshold 2,
  reasoned in `ResultsView.jsx:1036-1040`). The rule is sound; the empty tab without a path is the problem.
- "ทบทวน" names five things (tab, plan card, pinboard, panic mode, queue). Six settings with "Due",
  "SM-2", "FSRS" sit above the one action.

### J7 Notes reading
- High: the reader is wider than the phone and is clipped: 15 px at 390, 45 px at 360, text cut
  mid-line ("chief complai"), also in WebKit. Cause: `.vmx-notes-grid { grid-template-columns: 1fr }`
  (`styles.css:3456`): `1fr` is `minmax(auto, 1fr)`, so a wide child sets the track width.
- 3 taps Home to text, ~1 s warm. The reading route starts in practice copy with a disabled
  "รวมทุกหัวข้อ 0 ข้อ"; topic list and reader keep URL `/` (not shareable).
- Keep: 16 px body, source under each section, collapsible sections.

### J8 VetWiki (for the VetWiki owner, not changed here)
- 3 taps to an article, eight controls before the first paragraph; the "สารบัญ 1/7" pill covers text;
  the map entry is at the bottom of /wiki; "หลักฐานไม่ตรงกับที่บรรยาย ... พร้อมคำแนะนำเวลาสอบ" leaves the
  student unsure who is right.

### J9 Library
- 1,916 documents. Search ranks other years first (browse puts own year first, search does not:
  `LibraryView.jsx:640-650`). First PDF page 7.4 s on the loaded machine. Opening an original uses the
  sync window.open + redirect pattern (keep).

### J10 Videos
- ~55 playlist cards in one list; ".md" download label; downloads via `<a download>` are silent in iOS
  in-app browsers (`SummaryModal.jsx:280`, `LecturerSets.jsx:85-103`, which also says "เริ่มดาวน์โหลดแล้ว").

### J11 Offline
- Opened views work offline (banner "ออฟไลน์ — ใช้งานส่วนที่เปิดไว้แล้วได้ตามปกติ" + game). A view never
  opened online shows "หน้านี้ขัดข้อง" with an honest body; tiles stay active and lead there.

### J12-J13 Sign-in and in-app browsers
- Inside LINE, Facebook and Instagram (UA tested) the page warns that Google usually fails there, then
  still shows the Google button first (`AuthView.jsx:528-543`). Inside LINE, LINE login is 4th
  (`AuthView.jsx:577`), while it is the one method that can work without leaving the app.

| Testable here (UA spoof, Chromium/WebKit) | Needs a real LINE/FB/IG app on a phone |
|---|---|
| in-app detection, notices, exit link, button order | Google refusing (disallowed_useragent), LIFF login inside LINE |
| layout clipping at 360/390, WebKit rendering | `<a download>`/blob in WKWebView, window.open hand-off |
| | 100vh vs dvh with real toolbars, safe areas, keyboard resize |
| | backdrop-filter cost on low-end Android, SW and storage persistence |

## 3. Shipped-product evidence (Lazyweb, 42 screens)

Agentic search: https://www.lazyweb.com/agentic-search/b0bd8f3a-5023-4c7d-86b5-990823a48900 (private).
Descriptions come from Lazyweb's per-screen text; open the link before copying a layout.

| Moment | What shipped products do | Implication |
|---|---|---|
| First run | Duolingo, Codecademy Go, Strava: one level picker as big single-select cards, then the first task | year as the one question; carry the destination through it |
| Daily home | Duolingo "Time to review" names one lesson; BoldVoice "Today's Plan" | keep the plan card as the one action; quiet the rest |
| Feedback | Duolingo bottom panel, Sololearn explanation + helpfulness | answer feedback near the thumb; correct option visible |
| Results | Capwords: accuracy, "mastered vs needs review", primary "Review Again" | one primary next action: the missed questions |
| Exam | Guardian crossword check modal (correct/incorrect/unsolved); Alma hold-to-commit | count unanswered in the confirm (already done) |
| Review queue | Capwords empty state with a Start button; anti-pattern Speak locks review behind collecting | an empty queue says what fills it and offers the next task |
| Offline | Showtime routes to downloaded content; anti-pattern Falou full-screen retry only | say what works offline, route there |
| Sign-in | Duolingo/Drops ask after value, "so you don't lose progress" | sign-in after a set, named stakes |
| Glass tab bar | no shipped example found | design from liquid-glass-web; test on device |

Dark patterns seen and excluded: streak-loss warnings and paid streak repair (Mimo, Gentler, Sololearn),
quest countdowns (Duolingo), lives that gate practice (Mimo).

## 4. Performance baseline

Not measured yet (2026-10-22). The machine-wide heavy-job queue (C:\dev\HEAVY-GATE-RULE.md) never
reached the baseline run on 21 Oct; the harness is written (work/ux-journeys/perf/run.mjs: headed Chromium
with GPU, 4x CPU, 390x844 touch; WebKit iPhone 13 for load metrics) and has not run end to end.
Consequence: no PR that could cost frames (glass, motion, view transitions; item 11) ships before this
baseline exists. Release 5.159.0 (items 1-3) changes one grid track, a button order and one note with a
button, none of which runs per frame.

## 5. Ranked opportunities

Impact on students (H/M/L) vs effort (S/M/L) vs risk to what already works (L/M/H).

| # | Opportunity | Impact | Effort | Risk | Plan |
|---|---|---|---|---|---|
| 1 | Notes reader clipped at 360/390 | H | S | L | PR 1: `minmax(0, 1fr)` + `min-width: 0` on the grid child; e2e at 360 asserts no element past the viewport |
| 2 | In-app browsers: Google shown first although it fails; LINE login buried inside LINE | H | S | M (auth UI) | PR 2: in an in-app UA, LINE first inside LINE, Google behind the "open in browser" notice; unit test on the order |
| 3 | Review tab empty by rule with no path while Home lists N wrong answers | H | S | L | PR 3: the empty state names the rule in plain Thai and offers "ทบทวนข้อผิด N ข้อ" (the same pool Home uses) |
| 4 | Shared /app/* link loses its destination after year/phase | M | S | M (routing) | PR 4: keep the routed view and open it after the year (and phase) pick |
| 5 | Practice ends with an exam-style "ส่งข้อสอบ?" after every answer was shown | M | S | L | PR 5: in instant-feedback practice with all answered, the last button is "ดูผลลัพธ์" with no dialog |
| 6 | Results: praise and "not yet" at once; missed questions demoted at 70% | M | S | L | PR 5: one verdict per threshold; retry-missed stays primary whenever there are misses |
| 7 | Cookie dock covers 19% of the first screen and the hero question | H (first visit) | M | M | PR 6: compact dock that does not cover the hero question |
| 8 | Offline "หน้านี้ขัดข้อง" for a view never opened online | M | S | M (specs assert the heading) | later: different heading for the not-yet-saved case only |
| 9 | Library search ignores the student's year | M | S | L | later: own-year boost in search ranking |
| 10 | Downloads silent in iOS in-app browsers | M | M | L | later: in-app branch opens the file instead of `<a download>` |
| 11 | Glass material on the bottom nav and sheets (owner decision) | M (feel) | M | M (perf) | PR 7, only with perf numbers not worse than section 6 |

Not planned (evidence says keep): the plan card, per-option feedback, the submit dialog's unanswered count,
the 63-214 ms feedback, the offline banner, the honest empty states, the five-tab bar.

## 6. Where this stands (2026-10-22)

- Release 5.159.0 ships items 1-3 (first written as 5.156.0, renumbered after main moved): notes grid
  `minmax(0, 1fr)` (red on production first: the column measured 405 px on a 360 px phone), `signInPlan` in
  lib/inapp.js (unit test), the review page's still-wrong button. What was checked is in
  docs/releases/5.159.0.md and its pull request.
- Next, round two: item 4 (carry a shared /app/* destination through the year pick), items 5-6 (practice end
  and results verdict: smoke.spec.js asserts the current dialog, update it in the same PR), item 7 (cookie dock).
- Perf baseline (section 4) before item 11.
