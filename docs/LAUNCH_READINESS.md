# VetMock — Launch Readiness

> New releases record their proof chain in `docs/releases/<version>.md`, one file per release,
> so releases in flight never edit the same lines. The entries below are the record from before
> release pipeline v2 and stay as written.

## Release 5.149.0 — 2026-10-20 (Claude Code)

VetWiki phase 4 of `work/vetwiki-redesign/BRIEF.md` without the optional crawler copy (D6): the map of VetWiki behind the colophon's Encyclopédie tree (`src/components/WikiMap.jsx`, every topic a link), the checking history in the provenance panel (`reviewHistory`, from the points' own review dates; the strip's date opens it), Mochi on an empty search and at the end of the first shelf. The gate's phase D takes a machine-wide lock (`acquireGateLock`).

One independent review before the push (logic, React, accessibility, copy, lints): nothing serious; the empty Mochi slot when the companion is off now takes no room.

Checks: the first two gates failed from machine load only (five sessions ran e2e at once: CPU 82 %, 3.3 of 31.7 GB free; Firefox opened a tab in 23.6 s; then a second gate held the shared port), which is why the lock exists. Final `npm run gate` on a quiet machine, exit 0: data 52/52, build, dist, e2e Chromium 599 passed / 39 skipped and WebKit + Firefox 586 passed / 50 skipped with 2 flaky: a Playwright worker process crash in Firefox before its test started (exit 0xC0000409), and WebKit waiting 30 s for the exam's "ส่งข้อสอบ ✓" button (6.2 s on retry; the second WebKit stall at the exam submit today, handed to the polish session). The VetWiki e2e ran three times on four profiles (82 passed) and the map and history tests 12/12 on Firefox. Production proof follows the push.

## Release 5.148.0 — 2026-10-17 (Claude Code)

PR #37 (VetMock VCA, vca.vetmock.com) merged into main. For vetmock.com this release is data: VCA round 1/2569 Part 2 (src/data/questions-vca-2569.js, 132 questions, 123 to learners, 9 held with a Thai note each), the VCA topics in curriculum.js and the regenerated counts. A second blind review of all 132 on the local checkout released 61 and 74, held 44, and fixed 14 others (docs/vca-handoff-2026-10-17.md). The VCA site is its own Vercel project, vetmock-vca, root vca/.

Checks: on the final tree before the version bump, unit 3178/3178, lint:data 0 errors, regen:all clean, build; vca/ unit, test:db 13/13 and build; the palette e2e that had expected 455 VCA questions, 10 passed on chromium desktop and mobile. CI on 53a846e7: lint, build, Annotation PostgreSQL and all seven e2e shards green.

## Release 5.147.0 — 2026-10-14 (Claude Code)

VetWiki phase 3 of `work/vetwiki-redesign/BRIEF.md`, on top of 5.146.1 (8c4add0c): numbered source chips with a drawer in place and a numbered source list with back links; a contents rail with the section being read and progress lines; the phone pill "สารบัญ 3/9" with a sheet; a chapter end that marks the topic read in the reading list, the topics either side, the topics sharing two or more sources and the volume; a reading ribbon on the shelves; a topic share card; 21 per-subject link previews. Fixed on the way, each with a test: shared #section links that landed at the top (App ViewEntry), the pill that never appeared after a jump, a jump to the list that overshot by a drawer's height, a right-aligned Thai masthead past the card's live area, 1,722 doubled full stops in citations, and the Practice Ruminant bookplate's rope.

Two independent reviews before the push (logic and edge cases; UX, accessibility and Thai copy): no data risk; every upheld finding fixed and covered.

Checks: `npm run gate` on the final tree, exit 0: data 52/52 steps (lints, units in Bangkok and UTC), build, dist, e2e Chromium 593 passed / 39 skipped and WebKit + Firefox 582 passed / 50 skipped, no failure or retry. The VetWiki and card e2e also ran twice on four profiles, 48 passed. Production proof follows the push.

## Release 5.146.1 — 2026-10-14 (Claude Code)

The 15 Zoonoses sections that read "🚧 รอเติม — body content จาก slide 4+" are written from the decks named in their `source`, slide 4 to the last page (Vector-borne from slide 4: slide 3 is an agenda). Most decks are a 2024 student's annotated copies, so only printed slide content is used and handwriting never is; clean MyCourseVille copies with the same pages were used for Rickettsial, Mycoses and the Sporotrichosis field study. Each section was drafted by one agent and re-read against every page by an independent checker. Slide typos that only misspell a term are corrected; anything that changes meaning stays as printed and is listed in the checker reports, never resolved toward a textbook. One literature conflict is recorded in corrections.js: the slide's direction for Zooanthroponoses and Anthropozoonoses is the reverse of the original sense (Hubálek 2003, PMID 12643844).

VetWiki: the new headings change 15 section ids. The 10 sections that held reference-checked claims keep them under the new ids; the 5 placeholder exemptions are removed and those sections carry 9 new PubMed-resolved claims. ingest-verifications.mjs now appends sources at the end of SOURCES (it used to land them inside SAME_WORK). The works count pinned in vetwiki-sources-work.test.mjs is 2,106 (2,102 plus 4 new works).

Checks: `npm run gate` on base 2c29c17b exit 0: data 52/52 steps (lints, units in Bangkok and UTC), build, dist, e2e Chromium 585 passed / 37 skipped and WebKit + Firefox 574 passed / 48 skipped, no failure or retry. Production proof follows the push.

## Release 5.146.0 / SW v226 — 2026-10-13 (Claude Code)

VetWiki redesigned as a printed reference (owner: "vetwiki ... creative art graphic design polish UX/UI ... มีลูกเล่น ... grokipedia"; brief in work/vetwiki-redesign/BRIEF.md, phases 1 and 2). Wiki styles live in `src/styles-wiki.css` (loaded with KnowledgeView only; Noto Serif Thai for Thai display behind Fraunces; Thai never under 14 px). The index is a library: one shelf per year, a volume per subject whose thickness is its topics and height its subsections, cloth from the subject's bookplate paper in OKLCH, all counted at build time into `src/lib/vetwiki/shelf.generated.js` by the registry generator (`scripts/lib/vetwiki-shelf.mjs`; `lint:wiki-registry` checks it; the masthead totals equal the content inventory). Volumes wrap onto as many boards as the width needs (a phone shows year 4 on 2 boards and year 5 on 3; the first build scrolled sideways and hid 3 of 9 and 5 of 11 with no sign that it scrolled). A spine pulls its contents card out, brought into view when it opens below the fold; the featured book starts from the flagship topic with the five topics with the most practice questions in the reader's year; a list view (remembered) keeps the old index with a conflicts filter; a search and a request by subject always list. The article opens like a chapter with one provenance strip, three actions with a share menu, numbered contents marked only for exceptions (folded on a phone), numbered sections, checked points as a hairline, and conflict notes with both sides side by side (also in the notes).

Reviewed before shipping by three agents (logic and access, CSS and print, numbers and words); every finding was checked against the code and the data, and the real ones fixed with a test seen failing first. Numbers and words: the source line said "ที่มาในเลกเชอร์" on 547 sections that come from Vet 85 summaries, MSD tables or VetMock pages (now "ที่มา"); the lede and the provenance line claimed every point was checked (now they count checked points); "ข้อมูลรายวิชา" tagged all 158 unchecked sections, half of them teaching content (now "ไม่ได้ตรวจทาน"); the byline showed TBD, MSD field names and working notes (the notes data fixed, tests/unit/wiki-bylines.test.mjs); chapters were numbered in id order (the registry now follows the curriculum, `lib/vetwiki/index.js`); one work under several registry ids was counted per id (`SAME_WORK` in `lib/vetwiki/sources.js`, counted by work in the shelf, the article and `scripts/stats.mjs`: 2,114 became 2,102; tests/unit/vetwiki-sources-work.test.mjs fails on a new unnamed duplicate); six subjects shared a cloth on their shelf (the picker now parts every pair on a shelf by 0.02 in both themes, measured after the gamut clip, or the build fails). Logic and access: a failed copy reported success (`copyText` answers `{ ok }`); the conflicts filter silently cut search results; the share menu ran off a phone and under the tab bar (now hung from the right, upward near the tab bar) and dropped focus; Escape missed a volume in Safari (now a document listener); each shelf is one Tab stop; Back from a chapter finds its volume open (history state `vetwikiPulled`); the shelves follow the app's own motion setting. CSS and print: printing kept the strip, contents heading and crumb and prints dark theme in light inks; contents links 44.8 px; the selected view in sage; spine counts and the conflict flag at 4.5:1 or more; the contents pill clear of the sidebar. Thai line breaks: Chromium broke the loanword "เลกเชอร์" before its silent final; `keepSilentFinals` in `lib/richtext.jsx` keeps a silent final with the cluster before it, in RichText everywhere and in wiki titles and headings (a sweep of all 210 articles at 320 px found none left).

CI held 6769996d (13-14 Oct), fixed before 5.146.0 went live. Smoke e2e run 38394172098 failed both attempts on "webkit + firefox, half 1" at its 16-minute step cap although every test passed or passed on retry. Measured causes: `--shard=1/2` over `--project=webkit-mobile --project=firefox-desktop` cuts the ordered list, so half 1 was all 311 WebKit tests (green 9.7-15.1 min over the 13 earlier main runs) and half 2 all 311 Firefox; a WebKit A/B on one machine (168 tests passed on both builds) gave 5.146.0 / 5.145.0 = 1.017, median per test 1.00, so the release was not slower. Attempt 1 lost 120 s on counts-agree:191: the search palette ignored an Escape pressed as it appeared, because its keys were wired in a passive effect (probe: dialog in the DOM at 2,993 ms, Escape 3,139 ms, listener 3,152 ms; stuck 1 of 5 runs on 6769996d and 1 of 8 on d9d9dea9), and stayed over Home. Attempt 2 lost 30 s on share-cards:144, which had also failed its first attempt on 5.145.0's green run: IgCardStudioView read the bank at render and again in its effect, so a year merging in between left its pool at 0 for good (2 of 21 WebKit loads stuck with only the year's 61 chunks fetched). Fixed in the source: `useModalFocus` listens for keys from a layout effect while focus moves stay in the passive one (a layout-effect focus return failed first-tip.spec.js:105 5 of 10 in WebKit), and the studio counts what is loaded on mount and always loads the whole bank; each new unit test was seen failing on the old code. counts-agree asserts the search closed after Escape, origin-move's route ignores an abandoned request's disposed response (failed once in a local chromium-mobile gate), optional-feature-failure types its draft only after the navigation's focus hand-off to `<main>` as update-and-intent already does (WebKit sent the text nowhere in 3 of 20 runs on 5.145.0; 40 of 40 pass after), and Smoke e2e runs each engine in two shards (five runners). On the fixed build the probes read: Escape as the palette appears closes it 10 of 10 (both ways), the IG studio held 0-400 ms past its chunk is stuck 0 of 21, first-tip:105 passes 10 of 10. Local gate green on this tree before the optional-feature-failure wait (chromium 585 passed; WebKit and Firefox 573 passed, that one flaky). No timeout, retry or oracle was loosened.

5.145.0 production proof (2026-10-13): main d9d9dea9, vetmock.com dpl_CjCwoMjqJeeVZWepqXe17LEfEK3u, held STAGED by Vercel until CI on d9d9dea9 was green (Build and Smoke e2e), then promoted itself at 17:27. Live SW v225. All 36 link covers at /og/<name>.png?v=20261013 answer 200 and match the release files byte for byte; the home and wiki pages point og:image at ?v=20261013. The changed-flow e2e against vetmock.com (share-cards, phase-wrapped-home): 16 passed on chromium-mobile and webkit-mobile.

## Release 5.145.0 / SW v225 — 2026-10-13 (Claude Code)

Share cards and link covers redrawn (owner: "การ์ด Phase Wrapped หรืออื่นๆ ... ทำให้อลังการ", then the OG covers). The recap, the daily question and the score card are posters on one kit (`src/lib/share-card`): a 1080x1920 story whose 1080x1350 core is the 4:5 post, Thai set by its ink (no tone mark touches the line above, no break inside a word, a number keeps its unit, การ/ความ keep their word), sizes stepped by 1.5 from 32, every text box checked against the frame by `layoutProblems`, the largest clean layout found by dry runs (`fitCard`). Each story carries a public-domain Muybridge frieze (horse trotting, hound running, horse leaping) and Mochi outside the core. `ShareCardPanel` draws when it opens, follows the app theme, offers light or dark and story or post, and hands the same file to the share sheet, a download, the clipboard, or, inside LINE and Instagram, a press-and-hold note (no button to the system browser: the answers live in the app's own browser, so the recap opened there was empty). Line breaking (`src/lib/canvas-wrap.js` keepTogether and joinAcrossSpaces) keeps a silent final, the rest of an open vowel, a lone consonant, a Thai abbreviation and its year, an exponent, a number and its Thai or Latin unit, a comparison, ๆ, and the vet compounds Chromium's smaller dictionary splits; a sweep of every card the IG studio can draw, in Chromium, measured: a number split from its unit 87 to 1 (a false positive), a break inside a listed compound 100 to 0, a split abbreviation, bound form, ๆ, silent final or exponent 13 to 0, a two-line option ending on one word 1,413 to 0; 28 lines open with an arrow, by design. IG options are balanced and stack by line box, and a light backdrop gets a feathered paper veil under every line. The IG studio draws on the same kit, light or dark. The 36 link covers are rendered by `scripts/render-og-covers.mjs` from `scripts/og/plates.mjs`: one series, each with a public-domain or CC0 artwork printed in two colours or in colour, credited on the cover and in `public/og/ATTRIBUTION.md`. A dismissed recap still opens on its page; its 30-day strip ends with its phase.

5.144.5 production proof (2026-10-13): main 625d9e1c plus the test-only 27999340, vetmock.com dpl_DqYM9T8bdLNKX16R1PQtc7Ppd8MP, held STAGED by Vercel until CI on 27999340 was green (CI on 625d9e1c had failed one Linux WebKit double-tap test, fixed in the test), then promoted itself. Live SW v224. The changed-flow e2e against vetmock.com (motion-integration, feature-categories, motion-kit, palette-current-context): 64 passed on chromium-mobile and webkit-mobile.

## Release 5.144.5 / SW v224 — 2026-10-13 (Claude Code)

One rest place (owner: "รวมเมนูพักใจ", vision 4.3): Home's menu shows one card, พักใจ, for the page that already held the doors to the focus timer and the game. The timer door is the page's main button with the timer's one name; the game door is a quieter ghost button. The desktop tools button keeps the timer and drops its second door to the page; the footer's game link is gone; both stay registered and searchable. A signed-out student now has no social group (it holds only account features). Opened from พักใจ, the timer and the game go back to it (`vmxRestReturn` in the history entry); one name each (จับเวลาโฟกัส, เกมลูกไก่หนีเชื้อโรค), and the old names still search. The search palette no longer clears its box in an effect after it opens (an automated WebKit run on vetmock.com lost the query it had typed). The game's keyboard handler leaves keys typed in a field or dialog alone (Space was swallowed in the search box on the game page, and Escape left the game). Opened from พักใจ, the back controls trust the flag only on their own entry and take one step per tap, and the skip link no longer adds a history entry (a second review found those three). Unit and e2e (Home, the page, both doors' own back controls, a reload on the timer) and the palette test were seen failing first.

5.144.4 production proof: vetmock.com `dpl_6332jhopW7ybwABqzVNhfUeSS5jZ` on 224a11d4. The push deploy built normally; Vercel held it STAGED until all seven GitHub checks passed (smoke, build, lint, Annotation PostgreSQL, e2e chromium, both webkit + firefox halves) and promoted it itself. Live SW v223. On vetmock.com the changed-flow e2e (counts-agree, palette-current-context, video-navigation, sr-card-content) passed 53 with 2 skipped (the worker cases on WebKit) on both phone engines. One WebKit run lost the query it had typed: the palette clears its box in an effect that runs after the box is on screen (fixed in 5.144.5); that test then passed 8 of 8 on both engines.

## Release 5.144.4 / SW v223 — 2026-10-12 (Claude Code)

Another year's course opens for practice, whole: App held only the selected year's banks, so a year-5 student reviewing COM V reached a config screen of none with Start greyed out (5.144.2 then withheld practice on the card). Opening another year's course on the topic or config screen loads that year's banks, and Start waits for them. The period is the selected year's calendar, so it narrows only a course of that year (`phaseForCourse` in lib/exam-scope.js, read by the study card, the topic screen and the pool); under เทอม 1 ปลายภาค the first cut withheld 12 of 22 year-4 courses from a year-5 student. Every finished bank load bumps App's revision (`onQBMerged`); a bump left to the caller was lost when the student left the course mid-load. Bank loads now recover. One App effect keeps the selected year's and an open course's banks loading, retrying on `online` or after 5, 15 and 45 s (a boot load that failed was never retried before). `importBank` (data/questions.js) retries a failed chunk under `?retry=N`, because Chromium keeps a failed dynamic import failed for the page's life; for that, every bank must be its own chunk importing none: COM IV's SVGs left images-com.js (they put COM III's chunk under COM IV), questions-vca-reviewed got its own chunk (merged with questions-vca, a retry read undefined and dropped 437 questions), a bank that is not a list fails the load (`mergeBanks`), and `scripts/lint-bank-chunks.mjs` checks the build manifest in lint:dist and CI. The worker stores a retried chunk under its plain URL. A full load counts as every year (`isQBYearLoaded`). Home does not prefetch the exam views offline. The video shelf writes its history entry in the same task as the change and follows the clip list. Four adversarial reviews (the release, then each round of fixes) found one high defect per round at first and none blocking at the end; each fix has a test seen failing first (unit: card against pool for every other-year course, year and period; the import retry; the merge; the full-load year check; Start waiting for the course year. e2e on three projects: the 1-final walk, leaving mid-load, Start mid-load, offline then online and Start, banks in memory offline, Start pressed offline, a worker-cached course, a failed VCA chunk at boot (455), a failed boot load, a retry that fails after reconnecting, the worker keeping the plain URL, the deleted clip).

5.144.3 production proof: vetmock.com `dpl_BFE8JJridXRbBwmEszJuLnzbgxNv` on 37588028. The push created no deployment for ten minutes during Vercel's incident "Increased build and deployment failures" (upstream GitHub), so an API deploy built and was promoted after smoke, build, PostgreSQL annotation and all e2e checks passed; the late push deploy ended CANCELED. Live SW v222; on vetmock.com the changed-flow e2e 8/8 on both phone engines, and the study card in year 5 under เทอม 1 ปลายภาค names the period for milk-meat-hygiene and shows 108 for avian-medicine.

## Release 5.144.3 / SW v222 — 2026-10-12 (Claude Code)

Two follow-ups from the 5.144.2 reviews. The theme follows the phone, live, until the student picks: vmx-theme holds 'light', 'dark' or 'system' (the default on a new device), lib/theme-pref.js is the one rule App and the Atlas entry apply, index.html already painted it, and the theme menu gains ตามเครื่อง with aria-pressed on all three. Under a chosen exam period the study card's practice count is what the next screen shows: for a course of the selected year, the topic screen's term-and-paper count (Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE, as Home's cards), with a 'not in this period' line when that is 0; for another year's course on its shared banks, what buildExamPool serves (Q_VISIBLE_COUNTS_BY_SUBJECT_BY_BANK_YEAR_BY_PAPER). A unit test checks both over every course, year 1-5 and period. A review of the release found the first version matched the pool but not the topic screen in 90 own-year cases, and a race in the theme hook (a phone change during start-up was lost; WebKit 7/20 before, 20/20 after re-reading on subscribe). Known and left for the next pass: the topic screen itself counts all banks for another year's shared-bank course (VCA in year 4 shows more than loads), and the student's own questions are not on the card.

5.144.2 production proof: vetmock.com `dpl_5KnrYXiiNxJQs3ycybnrSD46QVyM` on 92a85ab5. The push deploy and the first API deploy ended git_info_fail; the second API deploy built, and it was promoted by API after smoke, build, PostgreSQL annotation and all e2e checks passed. Live SW v221; e2e of the changed flows on vetmock.com 10/10 (study card, dark first visit, 44 px targets, welcome button, Pomodoro), the guide tests 4/4, and the Pomodoro test 8/8 in webkit-mobile; a sweep of 32 routes on iPhone, Android and iPad in both themes: 192 loads, 0 console errors, 0 horizontal overflow.

## Release 5.144.2 / SW v221 — 2026-10-12 (Claude Code)

The seven search and reading fixes from the 5.144.0 reviews (practice offered for what the selected year loads, a course's shared banks included and counted as that year serves them, with the year named when it loads none; documents asked for open a course's shelf from any year; "แสดงอีก N ไฟล์" on a capped library subject, no unrelated articles under the nearest topics, the card's VetWiki button lands on its subject, an unknown document count is not zero, the shelf suggestion counted the way the shelf searches, a cut-off reply is retried) and four found after 5.144.1: a phone in dark mode no longer turns light on its first visit (the app now starts from the theme index.html painted), Thai labels at 9-9.5px are 11px with a floor test at 10px, the welcome card's guide button is named by its visible text, and the Pomodoro expiry no longer sticks at 00:00 after a clock jump in WebKit (remaining time was read from Date.now() during render, and a render React bailed out of kept the effect's deps without running it; the clock is now state). A live sweep at phone width then found three surfaces under the 44 px floor (the reading list's notes buttons, the epidemiology lesson's contents rows, the pinboard's year chips, now also aria-pressed), and three words for the home screen (Home, หน้าหลัก, หน้าแรก); Home and หน้าหลัก are gone and the copy lint counts หน้าหลัก (not หน้าหลักสูตร and its kin) as an old spelling. A review of the batch found the practice rule above had hidden VCA (a shared bank) outside year 5 and dropped document cards for nine courses; fixed with the per-bank-year counts the q-counts generator now writes (Q_VISIBLE_COUNTS_BY_SUBJECT_BY_BANK_YEAR). The card's practice count stays phase-blind, as it was: under a chosen exam period the topic screen can serve fewer (next: pass the phase in).

Gate: full run on 1221e210, unit 3079/3079 in Asia/Bangkok and in UTC, lint:data, build, lint:dist, e2e chromium-desktop + chromium-mobile 535 passed / 0 failed, webkit-mobile 257 passed / 0 failed; delta run on the final tree (palette hint, changelog copy), unit 3079/3079 in both zones, lint:data, build, lint:dist, search e2e (palette, library and notes intents, connected study) 51 passed / 0 failed in three projects.

5.144.1 production proof: vetmock.com `dpl_79sw5hXxb7TRghpBdztcEoPHCoQe` PROMOTED after build, smoke, e2e (chromium; webkit + firefox, two halves) and Annotation PostgreSQL passed on 2911d889; `sw.js` serves `v220-2026-10-12`; the how-to guide checked on vetmock.com on a Pixel 7 in the app's light theme (rows rgb(253, 248, 239), text rgb(43, 36, 25)) and dark theme (rows rgb(43, 36, 25), text rgb(240, 230, 210)).

## Hotfix 5.144.1 / SW v220 — 2026-10-12 (Claude Code)

Three adversarial reviews of 5.144.0 found 21 confirmed bugs. This hotfix ships the high one (the how-to guide inherited the old-host move screen's global `.vmx-guide` styles and became unreadable; the move screen's rules are now scoped to `.vmx-move.vmx-guide`) with the exam-flow five (a paper is always a draw, stale phase-return key, rung-1 copy, the unsaved-result question asked once per start, the writing-only snapshot subject) and the Home/profile seven (one graded set is one recent session, level hint, Pomodoro button name, desktop Mochi once, tablet grid of eight, lessons off the desktop menu, the search field's name). The seven search/reading items follow in 5.144.2.

5.144.0 production proof: vetmock.com `dpl_48uPh12H2wuL1KHfg7gMsPtBQhc4` PROMOTED after Build, Smoke e2e, R parity and Lint questions passed on 99570807; production e2e on 22 changed flows 191 passed / 0 failed (chromium-desktop + webkit-mobile); production sweep 192 loads, 0 errors, 0 overflow; Thai asks answered with 6 verified claims each.

## Release 5.144.0 / SW v219 — 2026-10-12 (Claude Code night lane)

The owner review's open slices (phone Home and profile, exam-mode subject picker, practice ladder, how-to rewrite, phone reading surfaces, one buddy everywhere, the installed-app guide), search read as concepts, the reviewed atomic-sync fixes, the CI failures on 919d96b2 (native R nls tolerance, a real lost click on clip cards) and the 2b ledger items listed in AGENTS.md. Gate before the push: unit (Asia/Bangkok and UTC), lint:data, build, lint:dist and e2e on four profiles; production proof follows in this section after the deploy.

## Release 5.143.0 / SW v218 — 2026-10-12 (Claude Code polish sweep)

Review of every commit pushed 2026-10-08 to 2026-10-11 (Codex and Kasem) and the 09-27 open-items ledger, fixed in one release: Google token refresh that never saved, the 3D mascot viewer rebuilding its scene every 2 s, adaptive-practice honesty, FSRS-6 reference fixes, external-docs security and in-app-browser handling, counts and provenance, plain-Thai copy, practice tools, library and offline, imaging, account settings, six server migrations (applied separately, see work/polish-1011/round2/H.md). Gate results, the deploy id and the production checks are recorded in work/polish-1011/RELEASE.md and the COORDINATION log once the deploy is READY.

## Source checkpoint — 2026-10-08 · External Docs and iOS WebKit fix

Study source **5.141.4** adds the external doc reader for Notion and Google Docs, per-user OAuth integration, and iOS WebKit mobile fixes. This entry is a source checkpoint, not a gate receipt: the 320px planner budget and the Firefox smoke were changed afterwards in e793d937, and no CI, deploy or SW receipt was recorded here.

## Source checkpoint — 2026-10-08 · subject bookplates

Study source **5.139.0 / SWv214** adds 85 course covers to Home and subject
selection. Seventy-six new transparent WebP files and nine matching Panic
illustrations are indexed by curriculum identity; All Subjects reuses the
open-book print. Names, question counts, paper scope, availability, Notes intent
and navigation retain their existing contracts.

`lint:art` checks complete course coverage, distinct paths, real WebP bytes,
paper colors and a 120 KiB ceiling per cover. Source PNGs and detailed local
receipts are retained in `work/subject-covers-20261007/`; they are not public
runtime assets. The shared cover reserves its space and hides failed decorative
images without hiding the course or its keyboard action. The ordinary worker
update lifecycle remains unchanged.

Production acceptance requires exact-head Build/Smoke, a matching READY
Production deployment and live changed-flow checks. The dated receipts below
remain evidence for their own releases; they are not the current source version.

### Local acceptance for this source

- Full data/unit gate: 51 checks passed, including the entire unit suite in Bangkok and UTC; build/prerenders and all three contrast audits passed.
- Chromium desktop/mobile: 447 passed, 21 skipped. New cover failure/keyboard checks passed in both, plus WebKit and Firefox. Focused WebKit/Firefox cover/resource flows passed 4/4.
- The full Windows browser gate was stopped after a core-journey WebKit timeout and its retry; its trace reached Home after recorded answers. The identical isolated test passed in 29.9s with the original 30s budget. Preserve the earlier failures; this does not establish a timing root cause or full local-green acceptance. Linux exact-head CI remains the full four-profile gate.
- Sharp is patched to 0.35.5 with librsvg2.63.2 for [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Fresh audit: high/critical0; the eight moderate Cornerstone/VTK-chain findings require separate major-version remediation.
- COM cover filenames were changed to companion-1..5.webp before commit; the Windows-reserved-name guard now prevents checkout/staging failures. The 85 artwork hashes and course IDs remain unchanged.

## Historical production checkpoint — 2026-10-01 (Asia/Bangkok)

**Production 5.133.3 / SWv201 is accepted**, from source
`f90dcf337f6515e097ca67402da635ef156d3e6b`
([PR 19](https://github.com/palmzamak2547/vet-mock/pull/19)).
Independent source review found no actionable issue.

| Evidence | Verified result |
|---|---|
| Main Build | [36821746448](https://github.com/palmzamak2547/vet-mock/actions/runs/36821746448) succeeds, including PostgreSQL 17.6: 40/40 and four real backend-lock races |
| Main Smoke | [36821746055](https://github.com/palmzamak2547/vet-mock/actions/runs/36821746055) succeeds: 806 passed, one retry-flaky, 45 skipped |
| Production | Deployment 6777354252 succeeded at 06:01:26 UTC: [deployment](https://vetmock-3p7zymay8-palmzamak2547s-projects.vercel.app) |
| Actual study origin | Entry main-7WHJR3FR.js reports 5.133.3; SWv201 equals source. vetmock.com retains its 307 to vetmock.vercel.app |
| Member API | 5/5 real API checks: stale writes, tombstones, metadata, anonymous denial and identity guard |
| Signed-in browser | 4/4: draw/save to cloud, restore the same visible ink in a fresh context, erase, then redo with a new ID |
| Test-row cleanup | API probes and the browser's unique synthetic document were removed; read-back is zero and existing Agenda metadata is unchanged |

The browser proof used two fresh desktop contexts and one tiny synthetic PDF.
Both naturally used SWv201; no worker takeover or existing document reload was forced.
It does not establish physical stylus/iOS or actual social-app delivery.

The installed provider migration is `20261001054615` (`pdf_annotations_atomic_merge`).
Its source copy remains
`supabase/migrations/20261001030000_pdf_annotations_atomic_merge.sql`.
Reviewed SQL SHA256:
`82da6da9ede82f2044fa29970bed867cb55bc06d5aa73b2b334805eb930a9715`;
installed function-body MD5: `29ae3d488046de7718c4ba75760c90a2`.
Invoker, fixed search path, trigger, RLS and existing size constraints were verified.
Aggregate-only preflight checked all 12 stored records; every compatibility counter was zero.
SW source SHA256:
`83e7294f97f7622ae3652c69a9763d7c9bd0af43cf81e61ef733b9bb477820b7`.

Local data/unit 51/51, normal build/prerenders, three contrast audits and dependency
audit 0 passed; 192 gradient backgrounds remain unmeasured. Chromium completed 426
cases: 405 passed, two retry-flaky, 19 skipped. **The full Windows gate was not green**:
software-GL hit a 30-second scroll budget, before its final active-navigation assertion.
The unchanged focused test subsequently passed in 18.6 seconds. Trace comparison showed
15.56 versus 0.926 seconds in an earlier theme action; the cause of that variable
actionability remains unproved. Original failures and retries remain recorded, and no
assertion or timeout was loosened. PR checks also passed on d89a3671 before merging.

The original disposable account still awaits the earlier final-delete confirmation;
probe cleanup is not account cleanup. Existing provider notices are unchanged (7 INFO,
4 anonymous-definer, 30 authenticated-definer and one HIBP notice), with no annotation
finding. The [PostgreSQL 17.11 provider upgrade](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes),
held user-data sync, and hardware/OAuth/social validation remain separate work.
Research source is unchanged; its new build was intentionally ignored, so prior
Research receipts below remain dated evidence.

Evidence: managed `work/loop-20261001-release/FINAL-RELEASE.md`,
`MIGRATION-RECEIPT.json`, `live-http.json` and CI/failure logs. Primary browser/API
receipts are under `work/loop-20261001-release/integrations/`.
The shared claim remains `work/loop-20260930/COORDINATION.md`.

## Accepted study baseline — 5.133.2 / SWv200 (dated receipt)

Release source **5.133.2 / SW v200**: [PR 18](https://github.com/palmzamak2547/vet-mock/pull/18)
merged as `41db8c9f6c4c38a0044922cbef0009b0551718ee`; its tree equals accepted
`6dd2e036b530e78e6022921ecd473f33b627480f`. Exact main Build, Smoke attempt 2
(all three expanded matrix jobs) and Research succeed. The SAME app Production
6767296500 now succeeds (latest 18:59:04 UTC), superseding its retained original
"Checks for Deployment have failed" state.

Actual public alias SWv200 normalized SHA256 matches source:
`054885aff91669a83b2c292a605f1149b0f18189f715c116f1e83ed1926e44bb`.
Live SR, member reader/logout and bounded Daily PNG proof pass. Exact fixture
deletion is prepared and held for the action-time human confirmation requested
by the coordinator; cleanup is not complete. This receipt does not declare the
backlog zero or prove physical OS/social delivery, hardware or other held lanes.

| Surface / gate | Observed state |
|---|---|
| Product entry | [vetmock.com](https://vetmock.com) redirects 307 to [vetmock.vercel.app](https://vetmock.vercel.app) |
| Exact main CI | [Build 36757463872](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463872), [Smoke 36757463531](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463531) attempt 2 and [Research 36757463428](https://github.com/palmzamak2547/vet-mock/actions/runs/36757463428) succeed at 41db8c9f |
| App Production | Same deployment 6767296500 SUCCESS; [deployment URL](https://vetmock-77wx9pbn1-palmzamak2547s-projects.vercel.app); actual alias SWv200 hash matches source |
| Research Production | 6766832845 SUCCESS; public [research.vetmock.com](https://research.vetmock.com) shows three-reader signature; protected immutable URL leaves alias-to-deployment-ID attestation unproved |
| Earlier baseline receipt | Source 6774daa1: Build 36411289394, Smoke 36411289431, app 6708118976 and Research 6707958321 succeeded; superseded current state, retained history |
| Final local candidate | Data/unit gate 51/51 with both full timezone suites, normal build/wiki+Atlas+OG prerenders, three contrast audits and fresh npm audit 0 passed; 192 gradients remain unmeasured |
| PR 18 exact 6349b6ea | Build 2103, engine 335 and browser 808 successful/44 skipped passed; previous retry/failure evidence stays retained |
| Hosted native R exact 6349 | 37 files/295 cases/16 recorded pins pass; exact-zero and separation-evidence contracts accepted without new tolerance or reference changes |
| Repaired Research metadata | Three declared actual reader links; all 39 fixture hashes/dates unchanged; Bangkok/UTC 1316 each, build and four-profile 119 passed/17 skipped/0 failed accepted locally |
| New transitive audit repair | One High dependency finding in Axios covers seven advisories; only compatible transitive Node Axios 1.19→1.20 patched, SDK versions unchanged; fresh npm ci/audit 0, 60 consumer units and actual getVoices adapter check pass |
| MCV / catalog | Authorized current account: 11 courses, 115/115 materials matched, NEW 0; catalog 2042 rows (2034 public + 8 new restricted) |
| MCV pull 2026-10-20 | Same 11 courses now list 139 materials; authorized-catalogue diff found 29 not in the anon snapshot, of which 8 were the 09-30 restricted rows (incl. the redacted Sporotrichosis derivative), so 21 new; text scan found no student IDs; 21 rows public under the 09-14/09-19 basis, 110 MB to R2; plus the SharePoint deck Eq Infectious Dz and Biosecurity (10.7 MB) saved from the owner's signed-in browser; catalog 2064 rows (2056 public + 8 restricted); 22/22 mint and stream on vetmock.com anonymously with exact byte counts. Not shelved: 2 instructor web modules on github.io (pages, not files) |
| MCV pull 2026-10-21 | Owner asked to open the 8 restricted 09-30 rows: 7 flipped to public in place after an R2 sha256 and text check; Sporotrichosis (student group work) re-issued as public f86566363805a975 with the page-43 member names removed (text and pixels, all 44 pages eyeballed), old 00ea9a9f3f0c4f92 archived (anon 404). Full re-dump of all 82 courses (1712 materials): 47 MyCourseVille-hosted files missing from the 08-28 mirror, 46 shelved public (38 com1 3107415 and 8 swine-herd 3107408, both 2025/1, 247 MB incl. 7 heart-sound mp4), 46/46 open anonymously on vetmock.com with exact byte counts; skipped GI protozoa (3107417, a 0-byte file at the source). Two archived midterm score sheets reappear in the listing and stay archived. Not mirrored by policy: 35 Google Drive and 35 YouTube links, 1 Dropbox, 2 github.io pages. 5 SharePoint links handed to the Teams/SharePoint pull session. Catalog 2111 rows (2108 public + 3 archived) |
| MCV pull 2026-10-27 | The 11 current courses list 144 materials; the anon diff against library_docs found 4 new MyCourseVille files (Bacterial Zoonoses 2569, One Health approach to address environmental health risks II, Equine surgery & anesthesia 5th year, Exotic2 Case 3); a text scan found no student IDs, phone numbers or e-mail addresses. Exotic2 is a student's case presentation, so the presenter's name on slide 25 was removed before shelving (the Sporotrichosis rule of 10-21) and its 12 images were checked (no owner, HN or student ID). 4 rows public under the 09-14/09-19 basis, 56 MB to R2 (the 40 MB deck went up with curl: Node's fetch timed out on this uplink, about 86 KB/s); page text for the 3 PDFs (120, 94 and 20 pages); 15 topic links; catalog 2121 rows (2118 public + 3 archived); 4/4 mint and stream on vetmock.com anonymously with exact byte counts. Not shelved: 3 instructor web modules on github.io (FMD modules 1-3; pages, not files) |
| Live SR | Actual alias 24/24 across all four profiles, zero retry; managed work/loop-20260930/sr-live-41db.log |
| Member delivery | Eight complete body byte counts match; actual alias hover→mint/blob→Agenda one-page render→back/query retained→logout→anonymous401/private-cache absence PASS |
| Live Daily PNG | Actual v5.133.2 preview decoded 1080×1920/316549 B; normal download and two captured file-share payloads match preview SHA; no physical OS/social-delivery claim |
| Live Research flow | Public Methods shows three actual comparator links; course example computes DEFF1.70/n728 and the four-column CSV agrees. Anonymous on-device context, no off-origin requests; first harness CSV assumption failure retained. Receipt: work/loop-20260930/integrations/research-live-41db/REPORT.md |
| Exact test fixture cleanup | Prepared deletion held; action-time human confirmation requested, exhaustive exact-UID read-back/private-file receipt still pending |

Deployment, installation, numerical comparison and a working user journey are
separate facts. Main Smoke attempt 1 GL half 1 cancelled at its 22-minute cap
after 15m41s apt OS installation; preserve that setup record and original app
deployment checks failure. Same-SHA attempt 2 succeeds across all three jobs.
Exact-deployment connector reads still return 403 scope; direct status and body
proof are separate from connector access.

The original Windows 426-case failures reconciled to 404 successful/19 skipped/
three timing cases. The unchanged original Notes recovery case now passes 1/1
in 15.402s; two other timing cases were open at that older checkpoint. Earlier COM4 stayed pending
about 85s, not merely a 30s overall timeout; its cause is unproved. Original
23 failures/three not-run/nine retry-flaky and rerun evidence remain retained.
Managed receipts: `work/loop-20260930/backlog/CI-MAIN-41DB-CANCELLED-GL1.md`,
`LOCAL-CHROMIUM-QUIET-RECONCILIATION.md` and `NOTES-6DD-RECOVERY-DIAGNOSIS.md`.

## Released behavior and verified scope

- SR includes the passage and revealed safe explanation figure with the existing
  zoom boundary. Foreground readiness prevents partial queues; stale intents cancel,
  failed loads offer retry and explicit cached-card review. Twenty distinct focused
  browser cases have passing evidence. The later rejected-background/foreground-retry
  case proved stale planning counts red on the prior artifact, then passed all four
  profiles against the normal rebuilt artifact, one worker and no retries. Original
  setup/teardown and partial-queue failures remain retained. Actual deployed alias
  SR now passes 24/24 on all four profiles with zero retry; managed
  `work/loop-20260930/sr-live-41db.log` records this live proof.
- Daily sharing reuses the actual preview PNG. Actual live v5.133.2 decoded preview
  is 1080×1920/316549 B; a normal download from the exact preview URL plus two captured
  file-share payloads match SHA256
  `85E334CA0B9340610C662B50B509D5BA4A89E8BED495F956C2169C6AC4D59E06`.
  Actual Canvas was unmodified; only navigator.canShare/share transport was captured
  in a disposable anonymous context. Public writes 0/page errors 0. This proves PNG
  reuse/download payloads, not actual OS/social delivery. First fetch(blob) evidence
  method hit CSP and is retained separately; corrected normal download used no CSP
  bypass. Managed receipt:
  `work/loop-20260930/backlog/daily-share-live-41db-png-download/result.json`.
- Physical transitive versions brace-expansion 1.1.21 and fast-uri 3.1.8 are patched;
  earlier npm audit 0 is dated. A fresh scan found a High Axios dependency finding
  covering seven advisories; the
  compatible transitive Node Axios 1.19→1.20 patch now measures fresh audit 0 after
  npm ci, with SDK versions unchanged. Sixty consumer checks and the actual
  getVoices adapter pass; this does not prove all live voice/OAuth paths.
  Unit file concurrency is capped at two after recorded
  esbuild service-stop failures under default parallelism. No speed claim is made.
- Native Linux now installs every fixture-recorded version via dependency preparation
  and remotes. Six comparison failures are exact-zero roundoff: Dobson's equal
  treatment totals prove the B/z treatment effects zero, and two group-mean residuals
  are zero. The shared comparator now honors committed absoluteZero metadata plus
  only those two proved residual slots under the existing absolute 1e-10 contract.
  Nonzero NATIVE_REL 1e-9, strict webR rel 0, raw datasets/_fixture and R/package
  version guards remain intact. Hosted 5e resolved those six differences. Its one
  remaining separation SE difference is a finite IRLS artifact where the authored
  contract says B/SE are evidence, not finite inference pins. The reviewed native-only
  repair requires finite numbers, valid reference/vector shape, coefficient direction,
  positive SE and unchanged diagnostic signals; it leaves all other fields and the
  three source-evidence counts on their original comparison. All 335 local checks pass;
  the real method still emits three null coefficients/null Wald p/G14 on separation,
  while the steep finite control remains usable. Wrong
  zero injection 1e-6, tiny real probabilities, input drift and metadata changes still
  fail. Fixtures, R scripts and reference numbers were not regenerated or changed.
- Hosted 6349 passes all 37 native files/295 cases/16 pins. Accepted 6dd reader-index
  generator correction declares the actual comparator reader against three fixtures;
  all 39 fixture hashes/dates stay unchanged. Full repaired Research suites pass
  1316 in Bangkok and 1316 in UTC, its build passes, and four-profile browser evidence
  is 119 passed/17 skipped/0 failed. Exact main Research 36757463428 now succeeds;
  no native/role/source or tolerance/reference change follows from this receipt.
- Eight MCV additions are restricted. Original URLs, source authority and the
  redacted student-ID derivative retain provenance. Authenticated complete-body byte
  counts, management hashes and anonymous denial are separate from browser rendering.
  The original pre-release live pointer hung before HTTP; retain that failure.
  Shared-prefetch resolver repair passes 67 security/recovery cases and configured
  build41938 acceptance. Actual deployed alias now passes hover→mint/blob→Agenda
  one-page render→back/query retained→logout→anonymous401/private-cache absence.
  Primary receipt: `work/loop-20260930/integrations/LIVE-READER-PROOF.md`.
  Exact temporary-test-UID deletion is prepared and held after the coordinator's
  action-time human-confirmation request. Provider/exhaustive read-back/private-file
  receipts remain required; existing users and sessions stay outside cleanup scope.
- Normal main build/prerenders exit 0; all 1239 main JS/CSS/HTML bytes are identical
  to the previous artifact. This is an asset comparison, not a runtime/performance
  or whole-system acceptance claim. Final data gate 51/51 and three dist contrast
  audits pass; 192 gradients remain unmeasured. The final 17-file record is
  `work/loop-20260930/release-functional-hashes.json`; prior 16-file receipt remains
  `work/loop-20260930/release-functional-hashes-6349b6ea.json`, and original 14-file receipt
  `work/loop-20260930/release-functional-hashes-b53b3bf.json`.

## Content correction in 5.133.3

Question 8037 now uses the swine topic, matching its literal pig stem. Its answer,
source and review flag are unchanged. Fresh inventory remains 6,731 source questions,
6,663 ready and 68 held; no held answer was promoted. The current release receipt
above records the annotation backend and frontend acceptance.

## Outstanding work and limits

- Exact main CI and same app Production acceptance now succeed. Retain six original
  analytic-zero mismatches, separated SE evidence drift and installer/setup/checks
  failures. No global tolerance/reference replacement was used.
- Current Chromium completed all 426 cases: 405 passed / 2 retry-flaky / 19 skipped.
  The current GL failure consumed the 30-second scroll budget before is-active;
  quiet original-spec/trace rerun passed in 18.6 seconds. Theme action was 15.56 s
  versus 0.926 s before progress; cause remains unproved, assertions/timeouts unchanged.
  Full local gate remains incomplete. Earlier timing counts and the stopped
  418-case run are dated evidence; preserve them without treating them as current.
- Live SR/member flows and bounded PNG preview/download/share-payload acceptance pass.
  Actual OS/social delivery and broader hardware journeys remain outside proof.
  Preserve natural worker activation and active documents; no forced reload,
  activation or site-data clearing.
- Complete exact ephemeral member-test-UID cleanup only after the requested action-time
  human confirmation for final UI deletion. Safe ledger:
  `work/loop-20260930/integrations/member-fixture-safe-ledger.json`; retain exhaustive
  exact-UID provider read-back and private-file receipt. No broad sweep or cleanup
  claim before these receipts.
- Sync re-land 7146f950 remains a held separate lane: named/livesim/random simulations,
  unit coverage, rollout review and account-local purge of `vmx-user-ack-v1:<uid>`
  precede release. The older open-items ledger is dated input, not today's count.
- Physical iOS, actual OAuth completion, assistive/stylus hardware, new multi-device journeys and social previews
  are not newly proved by emulation or generated metadata. Prior HIBP/host-upgrade
  notes need provider refresh before being described as current blockers.

## Release acceptance

1. Recheck `origin/main`, isolate file ownership and retain other lanes' work.
2. Run `npm run stats` for current inventory; regenerate projections from their sources.
3. Run `npm run gate` on a stable checkout and `npm audit --audit-level=high`.
   Dist audits follow a fresh build; `gate:data` does not replace full acceptance.
4. For Research, run its own unit/timezone, build and browser checks plus native-R
   parity. Numerical fixtures keep their reference provenance and tolerances.
5. Verify changed journeys and relevant failure/recovery/account paths. Preserve
   old documents, learner data and the natural service-worker activation contract.
6. Use one coordinated real main push. Confirm exact-SHA GitHub Build + Smoke,
   relevant Research checks and each Vercel Production deployment, then exercise
   the changed flow on the live origin. No extra vercel --prod after the push.
7. Replace this checkpoint with the actual result and remaining limits; update the
   concise AGENTS handoff. Keep raw traces under work/ and retain original failures.

Cross-harness coordination follows [CONTINUOUS-IMPROVEMENT.md](CONTINUOUS-IMPROVEMENT.md)
and `work/loop-20260930/COORDINATION.md`. Grok is unavailable; no acknowledgement is
invented. The standalone live dashboard `http://127.0.0.1:41936/` is separate from production.

Earlier launch receipts and both guide variants are preserved unchanged in
[handoff/history-2026-09-30/](handoff/history-2026-09-30/), with checksum records.
Their previous missing-material, advisory-progress and permission statuses are historical.
