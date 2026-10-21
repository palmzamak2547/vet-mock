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

PERF_AND_JOURNEYS
