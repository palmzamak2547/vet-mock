# The VetMock Standard

What "good" means for every part of VetMock, each clause a sentence that is true or false, and the command that says which. `npm run standard` prints one line per clause (`--json` for machines); it reports and never fails the build until the owner picks which clauses gate. Where the product falls short today is listed with numbers by the same command.

The owner, 14 Nov 2026: "การoptimizedทุกๆอย่างในระดับที่สูงสุด ... ไม่มีจุดแปลก ไม่AI slop", then "มาตรฐานที่ผมพูดถึงคือเราต้องยกระดับที่เหนือกว่า world class silicon valley class". So every measurable clause carries three figures: the usual "good" line, what the best products measurably reach (with its source), and VetMock's target, set at or above the second. Where no measured best figure was found, the page says so and sets the target from what a person can perceive. A target the product misses today is written as missed.

This page links to the detail and does not repeat it: Critical Rules 11 and 12 and "Traps and rules by area" in [AGENTS.md](../AGENTS.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [ux/journeys.md](ux/journeys.md), [../STABILITY.md](../STABILITY.md), [QUESTION-STANDARD.md](QUESTION-STANDARD.md), [DATA-INTEGRITY-ROADMAP.md](DATA-INTEGRITY-ROADMAP.md), [THAI-STYLE.md](THAI-STYLE.md).

## 1. Who it is for, and what the best output is

Two students, measured in [ux/journeys.md](ux/journeys.md) section 1:
- **The student in the week of a paper.** On a phone, often between 19:00 and 06:00 (the measured peaks), tired, short of time, with one paper in mind. Each minute spent finding something is a minute not studied.
- **The student who returns daily.** Opens the app for the plan card, does one set, leaves. Remembers where things are and notices when they move.

So every screen answers one question and makes the next action obvious:
- One primary action per screen, visible without scrolling at 390 x 844.
- The app decides what it can for the student (`src/lib/decide.js`, [DECIDE-FOR-STUDENT.md](DECIDE-FOR-STUDENT.md)); every choice it made stays one tap away.
- Counts beside a button are the counts the next screen serves.
- Nothing on a screen is there because it was easy to add. A panel nobody uses (social features had 0 members, 0 races, 0 comments on 21 Oct) does not take space on a primary screen.

## 2. Design and layout

- Type, spacing, colour, radius, elevation and motion come from the tokens in `src/styles.css :root` and nothing else ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)). A new value is a token first.
- Thai text is never under 14 px; `--text-xs` is for Latin-only labels. A heading that can carry Thai has line-height 1.2 and letter-spacing 0, checked at 2x.
- Reading text reaches 7:1 contrast; every other text 4.5:1, measured on the rendered page in both themes and all palettes.
- A tap target is at least 44 px; a primary action 48 px.
- Every screen designs its four other states: loading (shaped like the content, never a spinner on a list), empty (with the next action), error (with a retry) and offline (what still works).
- Pictures and structure before a wall of text: a table, a timeline, a real figure. Never invented medical imagery.
- Icons are line SVG through `src/components/NavIcon.jsx` (24 px grid, 1.7 stroke, `currentColor`); emoji are content, not controls.

## 3. Motion

Motion is used when it explains something: where a thing came from, where it went, that a tap was received, that something changed. Decoration that explains nothing is removed, not optimised.

- **Built so it never janks.** Animate transform and opacity; colour and shadow only on small elements. Never animate width, height, top, left, margin or padding, and never `transition: all`. Measure once, then move (FLIP). No scroll listeners driving animation: use IntersectionObserver, or scroll timelines where every engine has them. Pause anything off-screen. Durations come from `--dur-*`; interface transitions last at most 300 ms, and a tap shows its pressed state in the next frame. Sources: web.dev RAIL; [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) (motion guides: compositor-only motion, enter and leave, top-layer animation).
- **Reduced motion, per effect.** Each animation has its own `prefers-reduced-motion` rule. Decoration stops; motion that carries information (where you are, what changed) becomes a short fade or an instant move. Never a blanket `animation: none` on `*`.
- **Frames.** Opening a screen and scrolling keep the 95th-percentile frame within one 60 Hz frame (16.7 ms) on a phone with the CPU slowed 4x; RAIL's best is 10 ms of work a frame.
- **Baseline.** Prefer features that are Baseline widely available. The test matrix (Chromium desktop and phone, WebKit phone, Firefox desktop) is the limit: view transitions, scroll-driven animations and anchor positioning ship only as enhancement, checked in WebKit and Firefox, with the screen complete without them.

## 4. Language

1. Plain Thai that a tired student gets on the first read; one idea per line; each thing said once; calm, no hype, no pressure.
2. One word per concept, from `src/data/glossary.js`; one spelling per word (เช็ก, อัป, หน้าแรก, the ellipsis character).
3. No middle dot as a separator, no นักศึกษา (the reader is นิสิต), no English where the app has the Thai word.
4. No build-process or tooling words on a screen (beta, mock, placeholder, coming soon), and nothing that claims what a paper will ask.
5. Words are reviewed like code: every rule that can be a lint is one, and a new screen's strings are read top to bottom before it ships.

The full guide is [THAI-STYLE.md](THAI-STYLE.md). Explanations and model answers follow `lint:answer-voice`; stems follow `lint:question-voice`.

## 5. Data

Organised (one home per item, no duplicates), correct (keys agree with this year's slide or a reliable source), linked (question to slide page, topic, video minute, wiki, and every link resolves), retrievable (a count agrees with what a tap serves), stable, and predictive only where it claims to be. Each property has a number on the data scorecard: `npm run scorecard` (`scripts/scorecard.mjs`), whose work list is [DATA-INTEGRITY-ROADMAP.md](DATA-INTEGRITY-ROADMAP.md). Questions follow [QUESTION-STANDARD.md](QUESTION-STANDARD.md); scope follows Critical Rule 10.

## 6. Speed

Measured on a phone profile (390 x 844 at 3x, CPU slowed 4x) from the built bundle: `npm run perf` by hand, plugged in, against `perf-baseline.json`; sizes by `npm run perf:budget` in CI against `perf-budgets.json`. A budget there is an alarm at today's size plus 3%; the targets below are where the product is going.

- Every tap answers within 100 ms (INP), the answer tap included, and no task over 50 ms runs inside an interaction. When the work takes longer, the tap is acknowledged within 100 ms and the work follows.
- Home and a wiki article paint their main content within 1.5 s; nothing moves after first paint (layout shift 0).
- The next screen is ready before the tap: the main screens are prefetched while Home is idle (Modern Web Guidance, "prefetch or prerender likely next pages").
- First load at most 150 KB of JavaScript, gzipped; Home's first visit at most 40 requests and 250 KB of images; at most three text font files, 150 KB, all served from vetmock.com.
- Functions run beside their data (`vercel.json` regions, AGENTS.md "Performance").

## 7. Stability and bugs

- Main is green on every commit; a red run is diagnosed from its log and fixed, never only rerun.
- Every bug fix lands with the smallest guard that fails on the old code (Rule 12). Known failures sit on lists that only shrink.
- No screen prints a console error, fails a request, draws blank, stays loading, scrolls sideways or prints `undefined`, `NaN` or `null`: the route sweep (`npm run test:e2e:sweep`), whose `KNOWN` list is empty today.
- No flake: a spec that fails both attempts on a commit its pull request passed is fixed at its cause.

## 8. Works everywhere

- Every route renders at 320, 390 and 1280 px with no sideways scroll, in all four engines of the test matrix.
- Nothing that could work offline waits on the network: a screen opened once opens offline; one never opened says so in plain words and offers a retry.
- Every action is reachable by keyboard and named for a screen reader; the page declares `lang="th"`; images carry `alt`.
- Modern Web Guidance's accessibility guides apply as written: errors announced with the visible state, the OS text size respected.

## 9. The release rule: nothing odd reaches a student

A wave (one or more pull requests merged together) merges only when:
1. CI is green on the pull request (Build, the four-engine e2e, Annotation PostgreSQL).
2. The route sweep passes on the built bundle, phone width, Chromium and WebKit, with `KNOWN` no longer than on main.
3. Every changed path is walked on a production build at phone and desktop width, in both themes, and every changed Thai heading looked at in a 2x crop.
4. The pull request states the layout, the reason for each element and its four states (Rule 11), and lists the old-screen problems it fixed.
5. `npm run standard` shows no clause that was met on main now not met.

The author signs items 2 to 5 in the pull request; the owner signs any change to what a student sees first on Home, any new motion (as a playable prototype), and any change to a target on this page. After the merge, Rule 9 proves it live.

## 10. The measure

Today's numbers from `npm run standard` on main 77d2cbe8, 14 Nov 2026 (the route sweep from that night's run on the phone engines). "Walked by hand" names the smallest automated check that would replace the walk.

| Id | Clause | Check | Today | Good line | Best measured | Target | Detail |
|---|---|---|---|---|---|---|---|
| D1 | No font size under 14 px outside a Latin-only list | `npm run standard` (static) | 379 (200 CSS, 179 inline) | none published | not found; Thai marks need 14 px | 0 unlisted | AGENTS.md (UI and study flow) |
| D2 | Thai-capable headings: line-height at least 1.2, no negative tracking | `npm run standard` (static) | 7 rules | none published | not found; first principles | 0 | AGENTS.md Rule 11 |
| D3 | No hex colour in app source outside the token layer | `npm run lint:hex-budget` | 630 in 57 files | ratchet passes | 0 literals (token systems) | 0 | DESIGN_SYSTEM.md |
| D4 | Every `var(--token)` is defined | `npm run lint:css-tokens` | 9 undefined | ratchet passes | 0 | 0 | `docs/css-token-baseline.json` |
| D5 | Reading text reaches 7:1 in both themes | `npm run standard`; `npm run audit:contrast` | min 5.49:1 (soft ink, dark surface-2) | 4.5:1 (WCAG AA) | 7:1 (WCAG AAA) | 7:1 reading, 4.5:1 other | `scripts/audit-contrast.mjs` |
| D6 | Accent text tokens clear 4.5:1 on every surface | `npm run lint:accent-tokens` | met | 4.5:1 | 4.5:1 | 4.5:1 | `scripts/lint-accent-tokens.mjs` |
| D7 | No literal z-index above 1 | `npm run standard` (static) | 56 (23 CSS, 33 inline) | none | one ladder | 0 | DESIGN_SYSTEM.md |
| D8 | No inline style objects in the six core study files | `npm run standard` (static) | 199 (2,345 app-wide) | none | one system | 0 | DESIGN_SYSTEM.md |
| D9 | Tap targets 44 px, primary actions 48 px | walked by hand; add box sizes to the route sweep | not measured | 24 px (WCAG 2.2 AA) | 48 dp (Material), 44 pt (Apple) | 44 / 48 | STABILITY.md section 4 |
| D10 | Four designed states on every screen | walked by hand; a sweep pass with network failed and empty storage | not measured | spinner and blank | not found | 4 of 4 | AGENTS.md Rule 11 |
| M1 | No layout or `all` transitions | `npm run standard` (static) | 24 | none | compositor-only (web.dev, Modern Web Guidance) | 0 | DESIGN_SYSTEM.md Rule 4 |
| M2 | No keyframes animate layout | `npm run standard` (static) | 0 | none | compositor-only | 0 | DESIGN_SYSTEM.md Rule 4 |
| M3 | Every animation has its own reduced-motion rule, no blanket rule | `npm run standard` (static) | 81 of 114, 1 blanket | WCAG 2.3.3 | per effect (Modern Web Guidance) | 114 of 114, 0 blanket | DESIGN_SYSTEM.md (Motion) |
| M4 | No interface transition over 300 ms | `npm run standard` (static) | 43 | 50-400 ms (Material 3) | feedback within 100 ms (RAIL) | 0 over 300 ms | `--dur-*` tokens |
| M5 | Opening a screen: p95 frame within 16.7 ms | `npm run perf` | navigate 30.1, practice 24.1, results 30.2 ms | 16.7 ms (RAIL) | 10 ms of work (RAIL) | 16.7 ms | `perf-baseline.json` |
| M6 | Scrolling: p95 frame within 16.7 ms | `npm run perf` | 12.1 to 12.2 ms | 16.7 ms | 10 ms | 16.7 ms | `perf-baseline.json` |
| L1 | No middle dot, no นักศึกษา on screens | `npm run lint:ui-copy` | 0 and 0 | none | a copy lint on every change | 0 | `scripts/lint-ui-copy.mjs` |
| L2 | No English where the Thai word exists | `npm run lint:ui-copy` | 42 | budget holds | one term per concept | 0 | `docs/ui-copy-budget.json` |
| L3 | One spelling per word | `npm run lint:ui-copy` | 19 | budget holds | one spelling | 0 | `docs/ui-copy-budget.json` |
| L4 | No explanation narrates its source | `npm run lint:answer-voice` | 0 of 9,439 | none | 0 | 0 | `scripts/lint-answer-voice.mjs` |
| L5 | Stems read as questions; no broken Thai spelling | `npm run lint:question-voice`, `npm run lint:thai-orthography` | met | none | 0 | 0 | QUESTION-STANDARD.md |
| L6 | Glossary has no ambiguous term | `npm run lint:glossary` | met (166 entries) | none | one term per concept | 0 | `src/data/glossary.js` |
| L7 | Every string follows the Thai style guide | THAI-STYLE.md checks | not measured (guide on its own branch) | none | rules as lints | all rules at 0 | THAI-STYLE.md |
| A1 | Every data scorecard property meets its target | `npm run scorecard` | not measured (scorecard on its own branch) | none | not found | all met | DATA-INTEGRITY-ROADMAP.md |
| A2 | No question-standard defect | `npm run lint:question-standard` | 0 of 9,052 | ratchet | 0 | 0 | QUESTION-STANDARD.md |
| A3 | Stated counts match the inventory | `npm run stats:check` | met | none | derived counts | no drift | AGENTS.md Rule 6 |
| A4 | Every data lint passes on main | `npm run lint:data` (CI Build) | met (Build green on 77d2cbe8) | green | green | green every commit | `package.json` |
| S1 | Every tap within 100 ms (INP) | `npm run perf` | answer 192, next 72, navigate 72, sheet 80 ms | 200 ms (Core Web Vitals) | 50 ms handling, 100 ms response (RAIL) | 100 ms | `perf-baseline.json` |
| S2 | No long task inside an interaction | `npm run perf` | 7 tasks, 200 ms blocking | 50 ms chunks (RAIL) | 0 | 0 | AGENTS.md (Performance) |
| S3 | Largest paint within 1.5 s (Home, wiki) | `npm run perf` | 2,096 and 2,148 ms | 2.5 s (59% of mobile sites, Web Almanac 2024) | repeat load under 2 s (RAIL) | 1,500 ms | `perf-baseline.json` |
| S4 | Layout shift 0 after first paint | `tests/e2e/perf-budget.spec.js` (CI) | 0 on 8 page and engine pairs | 0.1 (Core Web Vitals) | 0 | 0 | `perf-budgets.json` |
| S5 | First load at most 150 KB of JS, gzipped | `npm run perf:budget` | 221,245 bytes | 365 KiB at 3 s on a P75 phone (Russell 2024) | first-party JS median 168 KB, p25 68 KB (Web Almanac 2024) | 150,000 bytes | `perf-budgets.json` |
| S6 | No route outgrows its size budget | `npm run perf:budget` (CI Build) | met (Build green) | alarm silent | same | every route | `perf-budgets.json` |
| S7 | Home first visit: at most 40 requests, 250 KB of images | `tests/e2e/perf-budget.spec.js` (CI) | 136 requests, 1,479,720 image bytes (budget file) | median 66 requests, 900 KB images (Web Almanac 2024) | p10-p25: 22-39 requests, 62-263 KB images | 40 and 250,000 | AGENTS.md (Performance) |
| S8 | At most 3 text font files, 150 KB, none from another host | `npm run standard` (static) | 7 local files, 375,492 bytes; 3 families from Google Fonts | median 111 KB (Web Almanac 2024) | p25: 1 font request | 3 and 150,000 | DESIGN_SYSTEM.md |
| S9 | The next screen is ready before the tap | walked by hand; count requests on a bottom-bar tap after idle | not measured | spinner | prefetch or prerender (Modern Web Guidance) | 0 requests on tap | ux/journeys.md |
| B1 | Main's last Smoke E2E passed | `gh run list --branch main` | met (Smoke green on 77d2cbe8) | mostly green | every commit | every commit | AGENTS.md (OWNER DECISION) |
| B2 | Every route passes the sweep, KNOWN empty | `npm run test:e2e:sweep` | 146 of 146, KNOWN 0 | 0 console errors (Lighthouse) | every route and persona | all, KNOWN 0 | AGENTS.md Rule 12 |
| B3 | The sweep runs on every pull request | `npm run standard` (reads CI) | on demand only | on demand | every change | required check | AGENTS.md Rule 12 |
| B4 | No flake on main | `node scripts/ci-reuse-shadow-report.mjs` | 2 (report of 9 Nov) | retries | 0 | 0 in 30 days | AGENTS.md (E2E and CI) |
| B5 | Every fix lands with a guard | walked by hand; a required "Guard" section | not measured | a fix | fix plus test | every fix | AGENTS.md Rule 12 |
| W1 | e2e on all four engines every pull request | `npm run standard` (reads CI) | 4 of 4 | one engine | every engine used | 4 of 4 | AGENTS.md (E2E and CI) |
| W2 | Every route at 320, 390, 1280 px in every engine | `npm run test:e2e:sweep` | 390 px, 2 engines | one width | 320 px to desktop, all engines | 3 x 4 | `tests/e2e/route-sweep.spec.js` |
| W3 | No clickable div or span without a role or key handler | `npm run standard` (static) | 11 | WCAG 2.1.1 (A) | native controls | 0 | DESIGN_SYSTEM.md |
| W4 | Every image has `alt` | `npm run standard` (static) | 0 missing | WCAG 1.1.1 (A) | same | 0 | DESIGN_SYSTEM.md |
| W5 | The page declares Thai | `npm run standard` | `lang="th"` | WCAG 3.1.1 (A) | same | `th` | `index.html` |
| W6 | Nothing that could work offline waits on the network | e2e connectivity specs; a sweep pass offline | not measured | offline banner | offline-first | every opened screen | ux/journeys.md J11 |
| W7 | Keyboard alone and screen reader on every screen | walked by hand; an accessibility rule engine in the sweep | not measured | WCAG 2.2 AA | 0 violations, every route | 0 | UX_AUDIT.md |
| R1 | The pull request template asks for the four states | `npm run standard` (reads `.github`) | no template | free text | a checked template | template | AGENTS.md Rule 11 |
| R2 | A wave merges only after the walk and the sweep, signed | walked by hand; R1 plus B3 | not measured | green CI | not found | every wave | this page, section 9 |

Static scans are proxies and say so in their output: a selector match for headings, a regex for durations, a JSX tag reader for clicks. A finding is a place to look, never an automatic edit.

## Sources

- Core Web Vitals thresholds (LCP 2.5 s, INP 200 ms, CLS 0.1): web.dev.
- RAIL model (response 100 ms, input handled in 50 ms, frames in 10 ms, idle chunks of 50 ms): web.dev, "Measure performance with the RAIL model".
- HTTP Archive Web Almanac 2024, chapters Performance, Page Weight and JavaScript (shares of sites passing, percentiles of requests, image, font and JavaScript bytes on mobile).
- Alex Russell, "The Performance Inequality Gap, 2024" (365 KiB compressed JavaScript for a 3 s load on a P75 phone and network).
- WCAG 2.2 (SC 1.1.1, 1.4.3, 1.4.6, 2.1.1, 2.3.3, 2.5.8, 3.1.1); Material Design (48 dp targets, motion durations); Apple Human Interface Guidelines (44 pt).
- Modern Web Guidance, by the Chrome, Edge, Firefox and MDN teams (Apache-2.0): [developer.chrome.com/docs/modern-web-guidance](https://developer.chrome.com/docs/modern-web-guidance) and [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance). Its performance, motion, forms and accessibility guides inform S1, S3, S9, M1, M3, W6 and W7 above; it uses Baseline data for browser support.
