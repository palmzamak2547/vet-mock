# AGENTS.md — VetMock Project Guide

## OWNER DECISION 2026-10-22: CI is the release gate

Palm asked why VetMock ships slowly. Measured that day: no merge after 06:29 while six finished changes waited for the machine-wide lock (other projects' 35-45 min gates) or the 4 GB free-RAM floor; CI already runs everything the local gate runs plus WebKit, Firefox and Postgres, free on GitHub; and the local gate had not caught the recent red runs (#42 failed in a spec it never touched, #48 on WebKit, which the local gate does not run).

- No local gate before a pull request: CI is the gate. Run a spec locally only to debug a CI failure.
- Since 22 Oct 21:35 (Palm, for every project) no run waits on `C:\dev\heavy-gate.lock` or a free-RAM floor, also where an older note below still says to take it. Every gate step and production check stays.
- The main ruleset no longer requires an up-to-date branch, and the Queue workflow is disabled (its bot updates left runs in `action_required`; #45 sat 215 min). A pull request merges when its own checks pass; rebase only when GitHub reports a conflict.
- After each merge, watch main's push CI for that commit: red means fix forward or revert at once.
- VetMock does not use `C:\dev\heavy-gate.next` (Tipjai's turn file).

## VetMock AI, ai.vetmock.com (research preview) — 2026-10-27/28 (Claude Code)

- **Where.** `ai/` is its own Vite app (Vercel project `vetmock-ai`, root `ai`, git-linked to main, domain ai.vetmock.com by a Cloudflare CNAME); its CI check is "AI" (`.github/workflows/ai.yml`). The answer route `api/ai-chat.js` + `api/_lib/ai/*` and the microphone's `api/ai-transcribe.js` live in the main vetmock project, pinned to sin1 in `vercel.json`. Read `ai/README.md` and `ai/ARCHITECTURE.md` first. Shipped in #77, #78, #81, #84, #85.
- **Local.** `npm run dev --prefix ai` (43130, proxies `/api` to 43139) and `node scripts/ai-dev-api.mjs --no-kv` (43139: ai-chat and ai-transcribe; restart it after any `api/` change, it imports the handlers once). `?mock` is a dev-only scripted stream.
- **Engine traps, both paid for on a real iPad.** The glyph index crosses passes in an 8-bit channel: store `idx / 255`, read `floor(x * 255 + 0.5)` (`(idx + 0.5) / 255` is a rounding tie that Apple GPUs round up: grey tiles over the whole sea; `ai/tests/unit/shaders.test.mjs`). The WebGL canvas is opaque: `resize()` returns early when nothing changed and redraws in the same call, the canvas is `100lvh`, and nothing resizes it on `visualViewport` scroll.
- **The study library is a knowledge source.** `api/_lib/ai/library.js` over `library_search` (page text): a planner intent `files` (and `asksForFiles()`: "ขอสไลด์/ชีท/ไฟล์", "ข้อสอบเก่า" beat a model that read it as a question); answers get the 3 related documents as a card and their best 2 pages as citable sources (open at `#page=N`). Ranking is by title hit, hit density, kind and subject (raw counts favour 900-page compilations); covers never become sources; syllabus titles are penalised; garbled Thai is never shown. Retrieval needles are `{ thai }` / `{ re }` objects, never strings. Answers wait 0.9 s for it, then its card follows during the answer. Every file added to the library is found without a code change.
- **Retrieval is measured.** `tests/unit/ai-chat-retrieval-eval.test.mjs` runs `tests/fixtures/ai-retrieval-eval.json` (questions as students type them, with the plan the production planner made, so no network) and needs one of the first two sources on topic: 44 of 50 (6 known misses are marked `todo` with the reason; most are topics the corpus has little on, so check the corpus before tuning ranking). Add a case whenever a question cites the wrong material, never loosen one; patterns avoid `\b`, which JSON reads as a backspace. What the eval caught (10-28): planner extras counted as part of the question ("morbillivirus" turned a distemper question into rinderpest citations; extras now only add score when the question names its disease), a transliteration cut into rare fragments (เลป, ซิส: a Thai term glossed in English counts once, through the gloss), a facet lift that raised every Treatment section of any article mentioning the disease, disease names that opened a facet (แท้งติดต่อ is not a transmission question), CSF and ASF in one alias group, and other animals' articles (a title naming only another species keeps 0.75 of its score and is cited only when nothing on the asked animal answers, which also keeps fowlpox pages out of a cat question: FPV is both; an animal inside พิษสุนัขบ้า or ฉี่หนู names a carrier, not the patient). `chooseSearch()` keeps the typed question's sources when the planner's reading answers nothing. Aliases VetWiki does not cover go in `CHAT_ALIAS_GROUPS` (concepts.js): `vocabularyGaps()` holds VetWiki's own list to what its sections contain.
- **Files turns are answered by the card.** The line above a files card is made from the card (`filesLead`), not written by the model (it once added that rabies "ออกสอบบ่อย").
- **Downloads.** `/api/library-file?open=1&dl=1&name=` passes `dl`/`name` to `library-blob` (attachment under the title).
- **Reading.** A new question is placed under the header and the answer flows down; the page follows the answer only after the jump button, and any wheel-up, touch or up-key stops following.
- **Sharing.** LINE, the share sheet and calendar notes keep `[n]` and list the sources; a long answer is cut at a paragraph and marked; every export labels a source with its section (`sourceLabel`). line.me answers 414 past about 8,190 bytes of URL (a Thai letter is 9 bytes encoded), so `lineShareUrl()` fits the text to 8,000 bytes (#87); Google Calendar takes about 14 KB. The copy button copies the same text without a length limit, so `[n]` never arrives without its sources; an answer VetMock's sources did not cover carries `GENERAL_NOTE` (the page's note) into every export (#89).
- **Gaps are answered, not announced.** Where sources stop, the writer continues from standard textbook knowledge without `[n]`; it never writes "คลังไม่มีข้อมูล" in place of content (it had filled table cells with it) and does not repeat the page's note. Specific numbers from general knowledge (doses, durations, prevalence) stay forbidden (`prompt.js`, #89).
- **Tables on phones.** `.msg` wraps anywhere, which lets a table cell shrink to one letter; cells reset to `overflow-wrap: break-word` and `min-width: 5.5em`, or a phone stacks หัวข้อ letter by letter (#89).
- **Keep the "Research preview" tag** (Palm, 10-28). "Not beta" from Palm means quality and completeness, not removing the tag.
- **Microphone.** Web Speech where the browser has it; elsewhere a recorder (16 kHz WAV) to `/api/ai-transcribe` (Cloudflare Workers AI Whisper with `CF_AI_TOKEN`, then iApp with `IAPP_API_KEY`). A cached GET probe decides whether that browser shows a microphone at all. **Open, Palm's call:** today neither works (the `CLOUDFLARE_API_TOKEN` has no Workers AI permission; the iApp account has 0 credits, production `/api/tts-iapp` answers 402), so Firefox and in-app browsers show no microphone.
- **Specimen plates.** `node ai/scripts/specimens.mjs [--preview out.png]` makes the 64 and 24 dot SVG masks from VetMock's own bookplates; `lib/species.js` decides which source names which animal.
- **Preview builds of old branches.** A branch cut before #77 has no `ai/`, and the `vetmock-ai` project mails "Root Directory ai does not exist" when it is pushed; harmless.

## Bug sweep and e2e flakes — 2026-10-27 (Claude Code)

- Sweep of vetmock.com (57 routes on a Chromium phone and a WebKit iPhone, 210 VetWiki articles, every year x phase x subject topic list, VCA's pages): clean except a missing VetWiki article opening the index silently (5.164.1, #82). Production client error counts (`private.client_error_counts`, 14 days): one render TypeError on topic-select on 23 Oct (5.163.3), no stack kept, not reproduced.
- A typed count can be lost on WebKit under load (Playwright's keystroke and input event split by a render): use `setPracticeCount(page, n)` from `tests/e2e/fixtures.js`, which retypes until the start button names the count. Seeds that hold dates read `PINNED_NOW`, never the runner's clock.
- Intermittent, cause not found, both passed on retry: `service-worker-live-update.spec.js` "updates preserve every open document" read worker B where A was expected (webkit, third 3, run 40519163580); and on WebKit under load "ดูผลลัพธ์ →" never became stable for Playwright within 90 s (unloaded it holds still for 12 frames). Look at a trace before changing anything.
- A docs-only pull request (only `docs/` and root markdown) now skips the e2e runners and Annotation PostgreSQL (#76); it waits on Build only.

## Performance budgets — 2026-10-22 (Claude Code)

- The rule is `docs/GITFLOW.md` section 1, item 8: CI fails on numbers a machine cannot move (`perf-budgets.json`, each budget beside the number it was set from) and timings are measured by hand (`npm run perf`, `perf-baseline.json`). A budget is an alarm, not a target; it must never turn CI red for a reason that is not the code.
- Sizes (`npm run perf:budget`, a Build step and phase C of the gate): gzip JS and CSS of the first load, the Atlas page and, after the first load, Home, the exam, results, the VetWiki index and an article. A lazy view is named by chunk name, not manifest key: a chunk that another chunk also imports statically loses its source path and is keyed `_Name-<hash>.js`. In the browser (`tests/e2e/perf-budget.spec.js`, Chromium only, median of 3 fresh contexts, other hosts aborted): Home's requests and image bytes on a first visit, and CLS of Home, a practice set, its results and `/wiki/com5/rabies`.
- The first numbers (22 Oct; requests on main `4cf1e64d`, timings on `3f099e6f`; sizes measured again on `2bb1d429`, 27 Oct) are work to do, not CLS gaps, because every page measures 0: Home's first visit asks for 136 requests and 1.48 MB of images (103 scripts, 24 images), and the first-load JS is 215 KB gzipped.
- Against the targets set for this work (INP 100 ms, no long task over 50 ms during an interaction, CLS 0): CLS is 0 on every page measured. The 22 Oct baseline (4x CPU) has the answer tap at 192 ms (next 72, the exam map 80, a tab bar navigation 72) and 7 long tasks over 50 ms in a practice journey (200 ms past 50 ms in all). Those two are the gaps; 5.163.3 worked on the answer tap, so measure it again plugged in before deciding what is left.
- Traps found: Playwright's `networkidle` fires once per navigation, so the idle prefetch is invisible to it (`scripts/lib/perf-browser.mjs` watches requests instead); `useOnlineStatus` sends a HEAD to /favicon.ico 1.5 s after mount, so a request count taken earlier depends on machine speed; Event Timing rounds to 8 ms and a frame is a whole display refresh (Palm's panel runs about 164 Hz), so those two metrics move in steps (`FLOORS` in `scripts/lib/perf-logic.mjs`). A laptop on battery slows every timing: on 27 Oct, unplugged at 31% with OneDrive syncing, the `3f099e6f` build read 9 to 14 s for the article's LCP that it read as 2.1 s on 22 Oct, so `npm run perf` warns on battery and refuses `--update`.

## UX journeys 5.159.0 — 2026-10-22 (Claude Code)

- Evidence, ranked opportunities and where the work stopped: `docs/ux/journeys.md` (5.159.0 shipped items 1-3; round two, items 4-7, and the perf baseline are next, section 6). Owner decision: glass is allowed on a few small chrome surfaces (nav, sheets, chips), never on reading text; no frame-costing change ships before the perf baseline in that file exists.
- In app browsers (`src/lib/inapp.js` `signInPlan`): no Google button (Google refuses OAuth there), LINE login first inside LINE.

## Android app (Capacitor 8) — 2026-10-22 (Claude Code)

- Decision and evidence: `docs/ADR-android-app.md`. The app is `mobile/` (its own package.json; `mobile/android` is the Gradle project). It serves the production build from its own storage under `https://vetmock.com` (`server.hostname`), so `location.origin`, auth redirects and the CSP are production's. `mobile/android/.../AppWebViewClient.kt` sends `/api/*` and any file the bundle does not carry (figures, atlas, og, pre-renders) to the real site.
- `src/lib/native-app.js` is the only web code that knows about the app; in a browser it is a no-op. Inside the app it defines `window.VetMockApp` (haptic, studyDay, notifications, reminders, happyMoment, googleIdToken) and fills the WebView's missing `navigator.share` (files), `speechSynthesis` (Android TTS) and `display-mode: standalone`. Other modules feature-detect `window.VetMockApp`; never import Capacitor into the web build.
- Updates: `npm run build` writes `dist/app-bundle.json` (`scripts/app-bundle-manifest.mjs`: carried files with SHA-256, the production CSP). `BundleUpdater.kt` downloads only changed files, verifies each hash, switches at the next cold start and rolls back a build that never calls `VetMock.ready`. Change `ON_DEMAND` in the manifest script, not the native code, to move files in or out of the app. Raise `MIN_NATIVE` there when a bundle needs native code older installs lack.
- No service worker inside the app (`app-lifecycle.js` returns early), no GIS popup (`google-gis.js`), Google sign-in tries Android's account sheet first (`supabase.js`).
- Build and measure in CI: `.github/workflows/android.yml` (not required; path-filtered). Locally: `. mobile/scripts/env.sh`, take `C:\dev\heavy-gate.lock`, `cd mobile && npm ci && node scripts/fetch-bundle.mjs --dist ../dist && npx cap sync android`, then `cd android && ./gradlew --no-daemon assembleRelease` (JVM capped at 3 GB in gradle.properties). This laptop has no accelerated emulator (Windows Hypervisor Platform is off).
- Owner steps: `bash mobile/scripts/wizard.sh` (upload key in `~/.vetmock-android`, signed AAB, Play Console, internal testing, the assetlinks file through `mobile/scripts/assetlinks.mjs`, Google Cloud Android OAuth client). Store texts and form answers: `mobile/store/`.

## Mochi driven by inputs 5.160.0, smoother 3D 5.161.1, results 5.163.0, tap speed 5.163.3, reminder (local) — 2026-10-22 (Claude Code)

- `src/components/MochiLive.jsx`: the screen passes a still `pose` and one `play` state; `src/lib/mochi-live.js` plays it on the Motion Kit 2D rig (the source the 27 stills are drawn from, `scripts/regen-mochi-poses.mjs` draws a pose at 0.4 of its duration) and ends on that still's own frame, blending 240 ms when the states differ. The rig is a lazy chunk (`preloadMochiRig`, idle in ExamView). What plays is decided by `src/lib/mochi-reactions.js` (`feedbackReaction`, `correctRun`): the stamp stays 'correct' or 'encourage'; hop at a run of 3, highfive at 5, dance from 10. Reduced motion, a failed chunk or a stamp below the fold keep the still and its CSS greeting.
- The practice verdict panel is keyed per question (`key={compoundId}`): moving between two answered questions used to reuse one panel and its mount-time "answered just now". A verdict is fresh only when that visit to the question began unanswered (`visit` ref in QuestionComponent).
- Haptics: `src/lib/haptics.js` (`haptic(kind, prefs)`, kinds correct, wrong, milestone), only after a tap, never in a hidden tab, setting `haptics` in motion preferences; inside the Android app `window.VetMockApp.haptic(kind)` takes over (contract with the Android lane, PR #63, its native-app.js; also `studyDay`, `happyMoment`, `notifications.status/request/openSettings`, `reminders.set({ enabled, minute })`).
- Test harnesses that bundle Question.jsx stub `MochiLive`, `useMotionPreferences` and `haptics` (tests/unit/reveal-timing-shared.test.mjs); a harness window may have no timers, so ExamView's idle preload uses the global `setTimeout`.
- 3D Mochi (`model-3d.js`): sphere segments come from on-screen size (sagitta r(1 - cos(pi/n)) within 0.35 px, the 1.01-unit head about 150 px in the buddy stage), cached per count; `shape(..., round)` rounds polygon corners with quadratic curves (stars stay sharp). The unused 2.4 MB exporter dump in public/motion/assets/3d is gone. `Mochi.jsx` no longer keys `Picture` by pose: a new pose keeps the element and its image (no blank frame).
- Where this lane stopped (2026-10-22 evening, paused by Palm): shipped 5.160.0 (#59), 5.161.1 (#62), 5.163.0 (#66: practice ends with "ดูผลลัพธ์ →" when every answer is in, the day count after the first set of a day via lib/streak-moment.js, misses first, buddy copy agrees with the ladder), 5.163.3 (#72: the rig is built in idle time and starts after the verdict paints, because on vetmock.com, headed with the GPU at 4x CPU, the tap's event time had gone 184 to 232 ms and long tasks 142 to 275 ms with the rig; the after numbers are not measured yet). Records for 5.160.0 and 5.161.1 are in docs/releases (#71); 5.163.0 and 5.163.3 have none yet.
- Next, in this order: (1) done 27 Oct: the A/B re-run on vetmock.com and docs/releases/5.163.0.md and 5.163.3.md (the script now needs its imports pointed at a worktree that has node_modules; `C:/dev/vetmock-teardown-r2` is gone); (2) done 27 Oct: the daily reminder shipped as 5.164.0 (#75; the offer is a lazy chunk, warmed when an exam starts); (3) the Mochi contact sheets (`capture-slots.mjs`), then streak care (freeze earned by study, repair window, one streak place) and URLs for every main screen.
- Study behind these: MycOS vault `knowledge/learnings/app-teardowns-2026-10.md` (beat targets, capability matrix). Never name the studied apps in this public repo.

## Read-aloud from shared Gemini clips 5.155.0 — 2026-10-21 (Claude Code)

- `speakQuestion` (src/lib/tts.js) first plays pre-generated clips (src/lib/tts-shared.js) from https://tts.vetmock.com (R2 bucket `vetmock-tts`, custom domain on the vetmock.com zone, CORS GET from any origin): stem, then "ตัวเลือก A" + option per row in screen order. Clip names are `clipKey(text)` from `src/lib/tts-text.js`; the generator `scripts/tts-clips.mjs` uses the same functions. Any change to `stripForSpeech`, `normalizeSymbols`, `expandUnits`, `clipText`, `optionLabel`, `questionLang` or `SHARED_TTS` renames every clip: rerun the generator for the covered subjects in the same release (`tests/unit/tts-shared.test.mjs` pins one name). Clips are `.mp4` (Cloudflare caches it by default; `.m4a` is never edge-cached).
- Coverage: avian-medicine only (1,945 clips). The rest needs about $29 of Gemini TTS (OpenRouter credit left: $7.64 on 21 Oct; the lab's Gemini key has no prepaid credit). Generate with `node scripts/tts-clips.mjs --subject <id>` (resumable, `--dry` for counts and cost).
- Live voices are down on 21 Oct: Microsoft Edge TTS answers 403 to every client (vetmock.com/api/tts too) and iApp 402, so a question without clips reads in the device voice.
- Question.jsx passes raw text, options in display order (`getShuffledOptions`) and `subject`; it used to read options in source order.

## Polish sweep 5.149.1 — 2026-10-20 (Claude Code)

- Four press-sweep lanes on a production build (360 to 1920, both themes, Chromium/WebKit/Firefox, 4x CPU jank traces). Ranked findings, what was fixed and what stays open: `docs/polish-2026-10-20.md`.
- A failed lazy screen is recognised by `src/lib/chunk-error.js` (`isChunkLoadError`, also Vite's "Unable to preload CSS"); ErrorBoundary's card follows online/offline. Keep the heading "หน้านี้ขัดข้อง": several specs assert its absence.
- Progress fills (exam bar, SR bar, Home subject bars) scale by `--p` (0-1) with `transform: scaleX`, never width. The Pomodoro ring steps once a second (no dashoffset transition).
- `useExamSession` exposes `timedOutIdx`; ExamView says when a per-question clock moved the set on. Subject cards say "ไม่อยู่ในช่วงสอบนี้" when the picked paper holds none of a course that has questions (never "ยังไม่มีเนื้อหา").
- Phone `.vmx-btn-sm` is 14 px (was forced to 11 px); bottom nav labels 14 px (round 2; checked at 360 before push).
- Round 2: ketamine route is "IV" (its range is the IV induction one; numbers unchanged). Read-aloud: `speakChunk` has a watchdog and `speakQuestion` reports `onFail`, because a device with no voice never fires end/error. The palette input is a combobox with listbox/option rows: e2e find it with `getByRole('combobox', { name: 'ค้นหาใน VetMock' })`. Schedule and Scores print the curriculum name (`examTitle`). `--text-sm` is 14 px and Thai text app-wide is 14 px or more; `--text-xs` (11 px) is for Latin-only micro labels. Library cards print `displayDocTitle(doc.title)`; the stored title is untouched. Lecturer lines go through `topicLecturerLabel` (TBD prints nothing).

## Night release 5.144.0 / SW v219, hotfixes 5.144.1-5.144.4 / SW v220-v223, rest merge 5.144.5 / SW v224, cards 5.145.0 / SW v225, VetWiki 5.146.0 / SW v226, zoonoses 5.146.1, VetWiki phase 3 5.147.0 / SW v227, VetWiki phase 4 5.149.0 — 2026-10-12/20 (Claude Code)

- 5.149.0: VetWiki phase 4 of `work/vetwiki-redesign/BRIEF.md`, without the optional crawler copy (owner decision D6, still open). The map: the index colophon's Encyclopédie tree (`public/art/wiki-tree.webp`, derived from the cover mask by `node scripts/og/wiki-tree.mjs`; never hand-edit) opens `src/components/WikiMap.jsx`, a dialog listing the index's own year groups (`yearGroups`), every topic a real link (a modified click is left to the browser). It is a static import: as a lazy chunk the first tap waited 7.3 s in Firefox while the index's other chunks loaded (0.17 s bundled). Only the branch lines draw on (`--vw-d` = 200 (1 - 0.8^k) ms); names are never animated, because a background tab never runs the animation and `both` fill kept them invisible. The checking history: `reviewHistory` (cite.js) groups the claims by `review.reviewedAt`, newest first, with the sections and distinct works of each day; it is part of the provenance panel, which `WikiArticle` now owns (it needs the sections and `jumpTo`); the strip's date opens the panel at the history. No reviewer names: all 3,240 claims are `reference-verified` by `reference-cross-check`; conflict notes carry no date, so they are not in the history. Mochi: `wiki-empty` (think) on an empty search, `wiki-shelf` (peek) after the last volume of the first shelf. Tests that load WikiShelves stub `(^|/)Mochi\.jsx$`. Gate: phase D takes a machine-wide lock (`%TEMP%\vetmock-gate-e2e.lock`, `acquireGateLock` in scripts/gate.mjs; a dead holder is taken over; `VMX_GATE_LOCK` moves it) because several sessions share this machine: on 20 Oct five ran e2e at once (CPU 82 %, 3.3 of 31.7 GB free) and the first 5.149.0 gate failed from load alone (Firefox opened a tab in 23.6 s, a 21 s WebKit journey passed its 30 s cap); ad-hoc e2e runs do not take the lock, so hold them while another session's gate runs.

- 5.147.0: VetWiki phase 3 of `work/vetwiki-redesign/BRIEF.md` (phase 4, the map and the remaining Mochi places, is not built). Sources are numbered per article by `src/lib/vetwiki/cite.js` (`articleCitations`: one number per work, first use first; the strip counts the same list); `src/components/WikiEvidence.jsx` draws the chips, a drawer that opens in place (not a floating popover: no position maths, never covers text on a phone) and the numbered list with back links. Layout `.vw-grid` in styles-wiki.css: one column, a contents rail from a main area of 852 px, a margin for the evidence from 1,100 px; media queries derived from the shell's widths (not container queries: iOS 14). Reading position, the rail's entry, both progress lines and the phone pill come from one rAF-throttled scroll handler in `WikiArticle`: an IntersectionObserver never fired for a jump past the contents box. The chapter end writes the reading checklist through `setTopicRead` (App passes `readingChecklist`/`setReadingChecklist` to KnowledgeView), only for topics the checklist lists (198 of 210: `inReadingList`; the shelves count read topics the same way) and focus moves to the button that replaces the pressed one; the shelves show a ribbon on a volume with a read topic. The evidence drawer has a close button, closes on a tap outside, and takes Escape only with focus inside it or nowhere. Sections are a memoised `Section`, so the reading position does not re-render a long article. Citations show through `citationText` (1,722 imported ones read "title.. Journal"; the importer is fixed). The Practice Ruminant bookplate lost its rope, which read as a noose in a link preview. `SHELF_RELATED` (shelf.generated.js) lists topics sharing two or more sources. The topic card is `src/lib/share-card/topic-card.js` (lazy `WikiTopicCard.jsx`); the kit's masthead now sets right-aligned text by its ink. Articles preview with `public/og/wiki-<subject>.png` (21, drawn by `render-og-covers.mjs` from the course bookplates, VetMock's own art; `lint:og` checks each, 150 KB at most). `ViewEntry` (App.jsx) leaves a wiki view alone when the URL carries a #section: its first-frame scroll to the top undid shared section links. In e2e, a scroll before the first frame is undone by that same reset: wait two frames first.
- 5.146.1: the 15 zoonoses "🚧 รอเติม" sections are written from their own decks, slide 4 to the end, printed slide content only: most decks are a 2024 student's annotated copies, so handwriting is never a source (clean MyCourseVille copies, same pages, for Rickettsial, Mycoses and the Sporotrichosis study). One writer agent per deck, then an independent checker re-read every page; spelling-only slide typos corrected, meaning-level slide doubts kept as printed (list in the checker reports). The new headings changed 15 section ids: the 10 sections' claims moved with them (verification.js, verification-generated.js, one pointer in questions-y5-zoonoses-0925b.js), the 5 PLACEHOLDER_SECTIONS exemptions are gone, and those 5 carry 9 new PubMed claims. `ingest-verifications.mjs` used to insert new sources before the file's last `};`, which since 5.146.0 closes SAME_WORK: fixed to append at the end of SOURCES. Never run `apply-note-corrections.mjs` to add one correction: it rewrites corrections.js from its input alone and drops every existing entry (5.146.1 added its one entry through the same emitter, file round-trip checked).
- 5.146.0: VetWiki redesign, phases 1 and 2 of `work/vetwiki-redesign/BRIEF.md`. Wiki styles are `.vw-*` in `src/styles-wiki.css` (in `lint:css-tokens`' sheets); the shelves and the featured book are `src/components/WikiShelves.jsx`; their numbers and cloth come from `src/lib/vetwiki/shelf.generated.js`, regenerated with `node scripts/regen-vetwiki-topic-registry.mjs` (never typed). Tests that read the index as a list set `vmx-wiki-layout` to `list`; the index opens on the shelves. Phases 3 and 4 (source chips and popovers, a contents rail, chapter ends, per-subject link previews, one concept search, the map) are not built. Since the review: a source registered twice is named in `SAME_WORK` (sources.js), never counted per id; wiki topics follow the curriculum order; the cloth picker throws when two subjects on a shelf would look alike; `keepSilentFinals` (richtext.jsx) wraps plain Thai text that is not a search highlight; `WikiIndex` is exported so tests can drive its state. The 15 zoonoses placeholders were filled in 5.146.1.
- 5.146.0 CI (13-14 Oct): Smoke e2e runs every engine on runners of its own (`matrix.project`): Chromium desktop and mobile (the connected specs on the desktop runner, `matrix.connected`), WebKit in thirds, Firefox in halves. One `--shard` over both projects had put all 311 WebKit tests in "half 1", green at 9.7-15.1 of 16 min, so one retry ran it out of time; Chromium's two projects on one runner took 12.2-12.3 of 14 min in three of five runs. Keep each shard near 40% of its cap and add one when it passes that. Dialog keys are wired in a layout effect (`useModalFocus`), focus moves stay passive. After a key closes something in e2e, assert it closed. A red run is diagnosed from its log and fixed, never only rerun.
- CI, 14 Oct (tests only): the Chromium flake in `tests/e2e/mochi-presence.spec.js` "practice feedback follows the actual verdict" (first attempt failed in 5 of the 40 Smoke runs to 5384c323) and `tests/e2e/instant-feedback.spec.js` "keeps keyboard focus" was App.jsx's focus hand-off to `#main` on the first frame after a view change. With ExamView cached, the card is in the DOM before that frame; Playwright focused an option there, and the hand-off landed before the Enter (which then reads as next question: no verdict) or after the answer (focus leaves the option). Holding that frame until an option takes focus reproduces it 30/30. A student never reaches the card before that frame (52/52 Chromium runs, 40 at 6x CPU throttle: the hand-off ran before the first frame that painted the card), so the app is unchanged. A spec that focuses, types or presses keys in a view it has just navigated to waits for `await expect(page.locator('#main')).toBeFocused()` first, as these two, update-and-intent and optional-feature-failure do.
- WebKit, 14 Oct (app + tests): "Fetch API cannot load …/favicon.ico?t=… due to access control checks." in `mochi-presence.spec.js` "Mochi inhabits" (webkit-mobile, 1/30 at 6 workers, 15/30 at 12, also against vetmock.com) is WebKit refusing a request a page STARTS while its next document is pending (CachedResource::load, provisional state). WebKit logs it as a JS-source error and Playwright's WebKit backend reports every such line as a page error (name split at the first colon); a request already in flight when the navigation starts is cancelled silently. useOnlineStatus's ping (1.5 s after mount) landed there, and on a slow navigation away the ping and its 2 s retry were both refused and the page still on screen said ออฟไลน์. The ping is now `keepalive` (WebKit exempts keepalive loads; pagehide fires after the refusal, beforeunload is not reliable on iOS); `connectivity-status.spec.js` holds the next document and requires the probe to reach the network (red on WebKit before). connected-study's `/favicon\.ico.*access control/` filter, which hid the same thing as a "CORS warning", is gone. "Cache API operation failed: Context is stopped" is the other WebKit teardown line: a Cache API call (setLibraryAccess runs on every load) still pending when the next document commits. No app change avoids it, so the Mochi test ignores that exact text only. Lazy chunks started in the pending window fail the same way and show ErrorBoundary's card on the leaving page (not fixed yet). Playwright locators wait for a held navigation: watch the old page through request and console events.
- 5.145.0: share cards and link covers. Every share picture goes through `src/lib/share-card` (kit, fonts, share) and `components/ShareCardPanel.jsx`; check a card with `layoutProblems` (the e2e reads `data-layout`). Colours live in `kit.js` PALETTES only (hex-budget exempt, mirrors the --clr tokens). Covers: edit `scripts/og/plates.mjs`, run `node scripts/og/prepare-art.mjs --from <originals>` for new art, then `node scripts/render-og-covers.mjs`; never hand-edit `public/og/*.png` or its ATTRIBUTION.md. Card friezes are registered in `src/data/art.js` CARD_PLATES. Line breaking lives in `src/lib/canvas-wrap.js` (keepTogether, joinAcrossSpaces, COMPOUNDS): Chromium's Thai dictionary is smaller than Node's (it splits พ.ศ., ขั้นตอน, กล้ามเนื้อ where Node does not), so check a wrap change by drawing cards in the browser as well as with the unit tests.
- 5.144.5: one rest place. Home's policy (`lib/nav.js` HOME_MENU_HIDDEN) keeps `pomodoro` and `offline-game` off the menu; the `mochi` card is named พักใจ and its page's doors open both. Keep the three view ids; search, the desktop tools button (timer) and the offline notice (game) still reach them.
- 5.144.4: another year's course loads its year's banks, and the period narrows only a course of the selected year (`phaseForCourse`, read by the study card, the topic screen and `buildExamPool`; keep the three on it). Bank loading: every merge bumps App's revision (`onQBMerged`); one effect (`banksToEnsure`) keeps the needed years loading with retries; `importBank` retries a failed chunk under `?retry=N` (Chromium keeps failed imports failed), which needs every question bank to be its own chunk importing none: `npm run lint:dist` runs `scripts/lint-bank-chunks.mjs` on the manifest. Never share a module between two banks, and give a new bank file an exact manualChunks rule (substring rules merged questions-vca-reviewed into questions-vca). The video shelf writes its history entry in the same task as the change, never from a [filter] effect.
- 5.144.3: the theme follows the phone until a pick (lib/theme-pref.js; vmx-theme 'system' is the new-device default; toggles flip the effective theme), and the study card's practice count is what the next screen shows under a chosen period (own-year courses: the topic screen's scoped count; another year's shared banks: buildExamPool; a test checks both for every course, year and period). A hook that reads matchMedia in useState must read it again after subscribing (lib/theme-pref.js).
- 5.144.2: the seven search/reading fixes plus four found after 5.144.1 (dark phone first visit, Thai under 10px, the welcome button's name, the Pomodoro expiry stuck at 00:00 in WebKit). Never feed a value read from the wall clock during render into an effect's deps: keep the clock in state the tick writes. React's bail-out keeps a render's deps without running its effect.
- 5.144.1: three reviews of 5.144.0 found 21 bugs; the high one (the how-to guide styled by index.html's global `.vmx-guide` rules) and twelve more are fixed with failing-first tests; seven search/reading items follow in 5.144.2. Never give an app component a class that index.html's inline screens already style (scope inline-screen CSS to its own root).

- Owner review "Vet Mock.pdf" (phone 4/10 vs iPad 8/10) finished: phone Home as an app home (search, icon grid, plan; HomeQuickGrid + one nav list in lib/nav.js), the profile hub as the personal place (lib/study-record.js), exam-mode subject picker on every size, the practice ladder (lib/practice-ladder.js, LadderStrip; rung 1 = gentlePick, measured difficulty only at DIFFICULTY_MIN_ATTEMPTS), sticky start/next bars, the how-to rewritten as goals (src/data/how-to.js; a unit test fails if a quoted button disappears), one buddy everywhere (lib/buddy.js, hooks/useBuddy.js, styles-buddy.css), reading surfaces on phones (lib/reading-layout.js: own year first, subjects fold at 640 px), search read as concepts (lib/vetwiki/query-terms.js, omni-intents.js; `npm run eval:vetwiki`; recall@5 59% to 94%), the installed-app guide on the old host (lib/install-guide.js).
- Fixed from the 2b ledger: OV-exam-2 (an unsaved result is protected before replay or a new set), OV-exam-5, OV-tools-38, OV-exam-3, OV-content-24 + OV-tools-41, OV-data-6 bytes half (library-blob 300 per 10 min per address and link, fails open), OV-data-8, COPY-08 Home kicker, COPY-18. Summary middle dots are gone (package L; the summary lint now fails on one). Explanation backlog M: 41 rows sourced, budget 48 to 42 after six key fixes (23, 35, 49, 70, 134, 138) that contradicted the cohort's lectures; 202139 stem neutral, 105347 distractor D. variabilis (a proven experimental vector) replaced by Argas persicus.
- Sync: the four atomic-engine fixes were reviewed (SHIP WITH CHANGES; D2 corrected), rebased and merged: "ใช้ข้อมูลในเครื่อง" keeps what the account gained meanwhile and carries only the old build's own unsent work; the prompt reopens only for work an old tab still has to send. Evidence work/night-1012/sync.md; claude/sync-atomic-tests-1011 and vmu/sync-reland-1011 are retired.
- CI: native R parity tolerates 5e-8 for the iterative nls fixture only; the Firefox smoke failure was a real lost click (a clip card's cover replacing the pressed node), fixed by making the cover ignore the pointer; two e2e flakes wait for the app's own focus move. A release lands on main squashed (docs/GITFLOW.md).
- Accounts done tonight: Google JS origin https://vetmock.com on the VetMock Web client (GIS_AUTHORISED_ON_VETMOCK_COM true), consent-screen branding links, Search Console domain property verified by DNS with the sitemap submitted, sync proven on vetmock.com (a bookmark wrote user_data through sync_user_data_v2). Owner-only, still open: the LIFF endpoint (LINE login needed; then flip LIFF_ENDPOINT_ON_VETMOCK_COM), Palm's passkey re-enrol on vetmock.com, Google Drive/Notion OAuth credentials (the connect buttons stay hidden until the env vars exist; drive.file + Picker avoids the restricted-scope review), DNSSEC DS still pending at the registrar.

## Polish sweep release 5.143.0 / SW v218 — 2026-10-12 (Claude Code)

- Reviewed all 31 commits pushed 2026-10-08 to 2026-10-11 (Codex 14a62d02, 9d20d850; Kasem's 28 incl. external docs, FSRS/Elo/adaptive, 3D mascots, d55f709d student feedback) with adversarial verification: 58 + 19 upheld findings, all fixed on claude/polish-1011 except what the release notes list as held. Re-triaged work/loop-2026-09-26/OPEN-ITEMS.md and the Codex audits (194 items: 83 open, 9 partial) and fixed 12 file-disjoint packages; plan and handoffs in work/polish-1011/ (ROUND2-PLAN.md, round2/*.md).
- Decisions: the sync re-land (sync/reland-0926) is retired, because cc742166 replaced the engine with the atomic RPC sync_user_data_v2; four candidate fixes to the atomic engine sit unreviewed on claude/sync-atomic-tests-1011 (vmu/sync-reland-1011). The library link rate limit fails open when the shared limiter is down (it guards the bill, not access). FSRS review events are labelled vetmock-fsrs6-v2 after the reference fixes. Adaptive practice says how many questions have measured difficulty (production had 0 with 20+ answers on 2026-10-11).
- Server: six migrations 20261011120100..120600 (imaging policies match live, exam receipt idempotent ack, admin answers by version, q_comments admin delete, private study-buddies channel, race join rate limit); apply order and read-backs in work/polish-1011/round2/H.md (H6 only after the RaceView client is live). The delete-account edge function now revokes Google/Notion grants and needs a deploy.
- Held for later: the figure-extractor deck choice (round 3, see round2/K.md). Packages L and M, Kasem's slices and the GIS origin and Search Console shipped in 5.144.0 (section above).

## System stability candidate — 2026-10-09 (Codex)

- Isolated `codex/system-stability-1009`, base main `14a62d02`; Study5.141.6/SW217 was released on 2026-10-09 (9d20d850, see the release section below). Primary dirty work and Research M3a are preserved. Root is sole release owner; shared claim remains primary `work/loop-20260930/COORDINATION.md`.
- Confirmed fixes cover retired exam-start intent, equal-size review pagination, repeated offline PDF deletion, cross-tab restored image decks, duplicate wake locks/realtime retries, and external-document account isolation, connection recovery, Google provider/token renewal and selected-sheet reads. Existing controls/imports/normal learning paths remain required checks.
- Evidence and current status: `work/system-20261009/CHECKPOINT.md`; portable scope: `docs/system-audit-2026-10-09.md`. Focused failure regressions, data/unit52/52, production build, contrast3 and configured native40/40 across4profiles with0retries pass. Windows full gate stopped before browsers on its retained preview port; exact Linux CI and production proof remain pending. External provider/account traffic is modeled; no real OAuth, schema or provider-configuration mutation is claimed.
- Own locked dependencies installed; audit high0/critical0/moderate8 in the existing Imaging chain. The upstream sprintf advisory has no patched version; do not claim dependency zero or replace the Imaging major version without its own verification.

## Previous study polish — released 2026-10-08 (Codex)

- PR35/main `14a62d029dd5af40902751cf9892cc49dbdbed00`, Study5.141.5/SW216, exact Build/Smoke pass and READY Vercel `dpl_3DsTPoVbSgyycUnt4QzbBEMwRCmw` with all five aliases; rechecked 2026-10-09. Previous changed public flows48/48 across4profiles passed with0retries.
- Receipt in retained `vetmock-polish-1008/vet-mock`, `work/polish-20261008/RELEASE.md`. Windows full-gate and original Firefox failures remain retained; no permanent-cause or zero-flake claim. Study origin is `https://vetmock.com`; old host keeps its migration relay.
Read this guide before changing VetMock. The portable current architecture map
is [docs/PROJECT_KNOWLEDGE_BASE.md](docs/PROJECT_KNOWLEDGE_BASE.md); dated release
proof and remaining work live in [docs/LAUNCH_READINESS.md](docs/LAUNCH_READINESS.md).
Shared coordination across Claude Code, Grok and other harnesses follows
[docs/CONTINUOUS-IMPROVEMENT.md](docs/CONTINUOUS-IMPROVEMENT.md) and its one active claim file.
Branching, commits and parallel-harness discipline are in
[docs/GITFLOW.md](docs/GITFLOW.md).
MycOS is additional context when available, not a requirement for another host.
Historical handoffs are preserved in [docs/handoff/history-2026-09-30/](docs/handoff/history-2026-09-30/).

---

## 🧭 Ecosystem role (canonical · locked 2026-05-29)
- **Role:** Standalone vet study platform — own brand, may consume cuvetsmo-source/mcp, NOT part of the council site.
- **Layer:** Product · **Entry:** https://vetmock.com · **Research:** https://research.vetmock.com
- **OWNS:** the question bank + lint/fix tooling + exam/SRS engine (MCQ/TF/Fill/Match/Short/Writing · Quick/Exam/SM-2 · analytics · groups) + a deliberately simple educational Imaging Practical. Re-run `npm run stats` before quoting current totals.

### ⛔ No-duplication — rules mirrored from `cuvetsmo-docs/NO_DUPLICATION.md` (sibling repo, not in this tree)
Do NOT rebuild knowledge backend (→ cuvetsmo-source) · MCP (→ cuvetsmo-mcp) · AI inference (→ shared ai-chat) · the full clinical/pro DICOM workstation (→ cuvetsmo-imaging).

> 🩻 PRODUCT SPLIT 2026-08-11: VetMock keeps its own approachable **Imaging Practical** for quick study, local files, public teaching cases, and basic measurements. `https://imaging.cuvetsmo.com` is the separate **Imaging Pro** product for the full toolset. Keep the Practical intentionally narrow; advanced workflows belong in Pro.

---

## 🎯 Project At a Glance

- **VetMock** — คลังข้อสอบสัตวแพทย์ จุฬา (Vet question bank for Vet 86 + future years)
- **Stack**: React 18 + Vite 6.4.3 + Supabase (auth/DB) + PWA · plain JSX app code, TS only at the edges (`supabase/functions/*`)
- **Current source version**: the newest release file in `src/data/changelog/` (or, for releases before pipeline v2, the top entry of `src/data/changelog.js`); `package.json`'s version is no longer bumped per release. Verify exact-SHA CI/deployment and live flow before describing production as current.
- **Hosting**: Vercel (auto-deploy on push to `main` · `api/*.js` are Vercel serverless functions · `vercel.json` also CSP-rewrites `/venipuncture/*` to a separate app and `/wiki/*` + `/app/*` to the SPA)
- **Production**: https://vetmock.com serves the study app; Research runs separately at https://research.vetmock.com. The legacy vetmock.vercel.app host retains the migration relay. Recheck the dated release record before changing an origin.
- **Audience**: Thai-speaking veterinary students; curriculum cohorts are data, not a fixed public landing audience. User totals require a fresh measurement.

---

## 🚦 Critical Rules (MUST FOLLOW)

### 1. Never mention agent tooling or generative assistance in public content
- ❌ Changelog entries, tooltips, blog articles, About page, public commit trailers
- ⛔ NO `Co-Authored-By` agent trailer in this repo — vet-mock is public
- Keep public copy focused on the product and verifiable contributors.

### 2. Changelog (`src/data/changelog.js`) shows ONLY user-observable changes
- ✅ New features (UI, content, fixes that affect usage)
- ❌ SEO / build / refactor / infrastructure → git history only
- ❌ Root causes and mechanism: no "สาเหตุคือ…", no model or quota talk. Each change is a title
  plus at most two sentences, 300 characters at most, on what the student will notice.
  `tests/unit/changelog-voice.test.mjs` enforces the voice from 5.124.0 and the length after 5.128.0.
- **One file per release**: `npm run release:new -- minor` (or `patch`) writes
  a file named `<version>.js` in `src/data/changelog/` with the next free number (checked against origin/main and
  every open pull request), so no session negotiates numbers and two releases never edit the
  same lines. Fill in its headline and changes; kinds and scopes are in changelog.js's header.
  Releases from before pipeline v2 stay in `src/data/changelog.js`; `src/data/changelog-all.js` merges both.
- The banner and sidebar badge read `src/data/latest-changelog.generated.js`, derived and
  gitignored with `changelog-releases.generated.js` (build, dev and the unit suite write them;
  `npm run regen:changelog` by hand). `lint:changelog-latest` validates names, uniqueness, shape.
- The release's proof chain goes in `docs/releases/<version>.md`, not LAUNCH_READINESS.md.

### 3. Backticks in template literals are landmines
- `src/data/video-summaries-*.js` uses large template-literal strings for markdown
- Triple backticks (```) inside the literal will close it early → SyntaxError
- Use **indented blocks** (4 spaces) for code/pseudocode instead

### 4. Commit conventions
- Imperative title (≤72 chars)
- Body explains *why*
- Never add an agent co-author trailer
- Use HEREDOC for multi-line:
  ```bash
  git commit -m "$(cat <<'EOF'
  Title

  Body...

  (no agent co-author trailer — public repo)
  EOF
  )"
  ```

### 5. Question keys with leading `-` or digits need quotes
- `'-9iGaiDgagI':` not `-9iGaiDgagI:`
- Same for `'74q8uuQdK14':`, `'LRhlotxM-SI':`

### 6. Current counts come only from generated stats
- Run `npm run stats`; `docs/content-inventory.md` is generated with `npm run stats -- --write`.
- Do not copy totals from old plans, session logs, or release notes into new current-state claims.

### 7. Notes have one browser loader map
- `src/data/note-corpus.js` is shared by NotesView, VetWiki runtime, and the notes-registry generator.
- Add/change a note source there, then run `npm run regen:notes-registry`; never recreate a loader map in a view.
- Preserve lecture-first + Vet 85 append order and the offline retry contract in `src/lib/note-retry.js`.

### 8. Imported JSON is untrusted
- Dashboard backup and Question Manager imports must pass `src/lib/user-data-schema.js` before any setter runs.
- Respect explicit empty arrays/objects, preserve legacy-safe defaults, and preview exact overwrite scope.

### 9. Production proof is multi-step
- A build or push is not production proof. Require exact-SHA GitHub Build + Smoke E2E, successful Vercel Production deployment, and a live flow against `vetmock.com`.
- Push one real commit; avoid burst pushes and empty redeploy commits.

### 10. A paper examines TOPICS — never mix กลางภาค with ปลายภาค

Palm, 2026-09-16: "กลางภาคก็ควรอยู่กลางภาค ปลายภาคก็ต้องอยู่ปลายภาค ... แยกให้ชัด สร้างมาตรฐาน
และความมั่นคง". The separation had been a label, not a filter: `'1-mid'` and `'1-final'` both
mapped to semester 1 and nothing else, so the two picks served an identical pool.

**The model, in one line: scope belongs to the TOPIC, and a question inherits it.** Resolution
lives in `src/lib/exam-scope.js`, first hit wins:

1. `question.examScope: 'continuous'` — the course has no written paper. Nothing overrides it.
2. `topic.examScope` in `curriculum.js` — **the normal path, the one to reach for, and the one
   that DECIDES.** A topic's scope is this year's timetable; a question's is the paper it was
   transcribed from, often another cohort's. When they disagree the topic wins, which is Palm's
   own instruction: "อาจมีบางปีที่ไม่ตรงกับรุ่นปัจจุบันก็ให้เทียบหัวข้อเอา".
3. `subject.examScope` — a subject taught and examined as one block (POA is `'continuous'`).
   Then `question.examScope`, read only when nothing above answers.
4. The faculty timetable, via `src/data/exam-papers.generated.js` — a subject sitting exactly
   one paper is settled with no data entry at all (epidemiology sits only the final, so all 100
   of its questions are final scope and can never pad a midterm set).
5. Unknown — and **unknown is never filtered out**. Missing metadata must not silently shrink a
   student's practice set; `lint:exam-scope` is what stops unknown from becoming the norm.

Rules that follow from it, and they are not negotiable:

- **Never read an absence as a fact.** "Not in the timetable" does NOT mean "no exam": the
  year-4 COM III/IV/V banks and the VCA compilation (2,000 questions) are absent from the
  current timetable and would have vanished from every phase-filtered pool. A course with no
  written paper says so out loud with `examScope: 'continuous'`.
- **Never require both scopes to agree.** An AND between the question's scope and its topic's is
  unsatisfiable for a question tagged `midterm` on a `final` topic, and it hid eleven of them
  from midterm and final alike on 2026-09-19. `tests/unit/exam-scope-reachable.test.mjs` fails if
  any question is invisible in every phase; a hidden question is worse than a loosely placed one.
- **A question on the wrong topic is a scope bug, not a topic bug.** 24 frog/amphibian/turtle/
  ornamental questions sat on `aqua-aquarium-vet` (a post-midterm lecture), so กลางภาค showed
  none of them. When a set looks thin, check what its questions are filed under before writing
  new ones — `node scripts/audit-scope-contradictions.mjs` lists the disagreements, and the
  cohort's own midterm sheet is the evidence for where a lecture actually sat.
- **Adding a topic means declaring its paper.** `npm run lint:exam-scope` fails when a topic in
  a both-paper subject does not say which paper it sits, against a budget that may only
  shrink. Lower the budget when you map a batch; never raise it.
- **`examScope` is not prediction metadata.** It is a fact about the syllabus and is validated
  on its own; `predictionMetadataIssues` deliberately excludes it. Folding the two together
  meant labelling a legacy question's paper flipped it to "partial metadata, invalid" and would
  have failed 5,169 questions against the standard ratchet.
- **The timetable is the source of truth for which papers exist.** After it changes, run
  `npm run regen:exam-papers`; `lint:exam-scope` fails if the generated map has drifted.
- **Copy may promise only what the engine keeps.** The phase subtitles say *"ไม่รวมเนื้อหา
  ปลายภาค"* (what is excluded), never *"เฉพาะกลางภาค"* (that what remains is exhaustive),
  because unmapped topics are still shown. `audit-sense-fixes.test.mjs` pins both halves.

---

## 🔀 Gitflow & parallel harnesses

Full rules: [docs/GITFLOW.md](docs/GITFLOW.md). The short form:

- **Releases are pull requests, and CI is the gate** (OWNER DECISION 2026-10-22, top of this
  file). Branch from origin/main in your own worktree, push the branch, `gh pr create`, then
  `gh pr merge --squash --auto`; no local gate first. CI runs the full matrix on the PR and
  GitHub squash-merges it when its own checks pass (no up-to-date rule, no Queue workflow;
  rebase only on a reported conflict). No messages about push order or version numbers.
- **A merge to `main` is the deploy.** Vercel builds main only and promotes once Build and
  smoke pass on that SHA; watch that run and fix forward or revert when it goes red. Never
  push to main directly, never `vercel --prod`. A merge is not production proof.
- **Disjoint file ownership across harnesses.** Check the one claim record
  (`work/loop-20260930/COORDINATION.md`) and the working tree before touching a
  file; shared surfaces need explicit hunk ownership. Never stage or commit
  another lane's files or untracked work — stage exact paths only.
- **Competing lanes use separate worktrees**, each with its own `npm ci` after
  lockfile changes (a node_modules junction silently bundles the primary
  checkout's packages).
- **Integrate with the checklist**, not from memory: recheck main, build,
  applicable gates, exact-path staging, one push, verify the live journey,
  update the claim record.
- **Bad commit on main → revert forward.** Never force-push or rewrite history.

---

## 🗂️ Where Things Live

| What | Where |
|------|-------|
| Routing/state | `src/App.jsx` + `src/lib/view-route.js` (`view` state; readable stable `/app/*` routes) |
| Views (lazy) | `src/views/*.jsx` |
| VetMock Research | `research/` is a separate Vite app/origin; `docs/research/M1-DESIGN.md` + `M2-DESIGN.md` define contracts. Computation and datasets stay on device; optional auth has its own session. Its full unit suite + build run as gate phase E when `research/` moves. |
| VetMock VCA | `vca/` is a separate Vite app/origin (vca.vetmock.com) for licensing-exam practice. It reads `src/data` read-only through `vca/scripts/build-bank.mjs`; map a new subject in `vca/src/data/domains.js` or exclude it with a reason (its unit suite fails otherwise). Each domain is built as a small index plus shards of 12 questions (`vca/src/lib/bank-index.js`, `vca/scripts/bank-shards.mjs`): read questions only through `vca/src/lib/bank.js` (indexes to draw, then just the shards drawn), never a whole domain, and keep a failed load out of any pending map (`.finally`, not the second argument of `.then`). Its service worker keeps the bank in a cache of its own so hundreds of shards cannot evict the app. Its community (accounts, board, chat) is `vca/src/online/` plus the `vca` schema, off until configured. See `vca/README.md` and `vca/ARCHITECTURE.md`. |
| Mochi / Motion | `src/components/Mochi.jsx` + `src/lib/mochi-presence.js` embed contextual companions in existing views; one device preference hides all; 3D stays on demand in `/app/mochi`. Exam feedback requires a revealed practice answer; focused drawing/imaging workspaces stay clear. |
| Motion in real flows | `MotionFeedback.jsx` owns visual responses on real controls; `ReadingEffects.jsx` enhances actual Notes/VetWiki text; `FocusBackdrop.jsx` + `StudyBreak.jsx` follow Pomodoro state. Global settings live in ThemePicker. See `docs/motion-kit-real-usage.md`; preview actions are never evidence of a real save or answer. |
| Vercel serverless functions | `api/*.js` (wiki-explain, study-coach, grade-summary, tts, library-file/blob, send-feedback, …) · shared model chain in `api/_lib/llm.js`, output guards in `api/_lib/grounding.js` |
| Gitflow / parallel-harness discipline | `docs/GITFLOW.md` |
| DB schema | `supabase/migrations/*.sql` is the schema source of truth |
| Supabase edge functions | `supabase/functions/*` (LINE auth, account deletion — TS) |
| Question banks / loader | `src/data/questions-*.js` + `bank-registry.generated.js` |
| VCA source inventory | `src/data/vca-materials.js` + `src/lib/vca-library.js`; verified R2 copies and original Drive provenance; recovery in `docs/vca-archive.md` |
| Notes / shared lazy loader | `src/data/notes-*.js` + `src/data/note-corpus.js` |
| VetWiki | `src/lib/vetwiki/` + `wiki/` editorial/review layer |
| JSON validation | `src/lib/user-data-schema.js` |
| User-data durability | `src/lib/user-data-sync.js` + Supabase replica |
| Video summaries | `src/data/video-summaries-*.js` + metadata barrel |
| Changelog (homepage banner) | `src/data/changelog.js` |
| Curriculum / subjects / topics | `src/data/curriculum.js` |
| Styles (all CSS) | `src/styles.css` + `src/styles-landing.css` + `src/styles-admin.css` (`.ad-*`, the back-office only) + `src/styles-atlas.css` (AtlasView) + `src/styles-motion-kit.css` (MotionLoader, MotionSurface, StudyBreak) + `src/styles-buddy.css` (BuddySelector, PomodoroTimer, MascotSquad3DViewer) + `src/styles-connect.css` (`.vmx-conn-*`, ConnectAppsView) |
| Back-office (one account) | `src/views/AdminView.jsx` at `/app/admin`; reads `src/lib/admin-api.js` (RPCs gated by `is_admin()`), flags from `src/lib/question-quality.js`; schema in `supabase/migrations/20260915121049_admin_backoffice_v1.sql` |
| Static blog (SEO) | `public/blog/*.html` |
| SEO config | `public/{robots.txt,sitemap.xml}` + `index.html` meta |
| Scripts (transcript, lint, ping) | `scripts/*.{mjs,cjs}` |
| Tests | `tests/unit/*.test.mjs` (node --test) · `tests/e2e/` (Playwright) |

---

## 🛠️ Common Commands

```bash
npm run dev               # Vite dev server (predev regenerates latest-changelog)
npm run build             # Production build + wiki prerender (always run before commit)
npm run preview           # Preview built dist
npm run test:unit         # Node contract suite (tests/unit/*.test.mjs)
npm run gate             # Local gate, optional since 2026-10-22 (CI is the release gate): data lints +
                         # unit in Bangkok/UTC (+ SQL harnesses when a DB-touching file moved and pglite
                         # is reachable), build, contrast, Research (auto when research/ changed since
                         # origin/main), then every e2e spec on Chromium desktop + phone (~13 min).
                         # Not smoke + changed specs: PR #42 went red in a spec it never touched.
npm run gate:full        # Same, with the full four-profile e2e here (~65 min on this machine)
npm run gate:fast        # gate:full with the two e2e steps concurrent
npm run release:new      # -- minor|patch: a release file in src/data/changelog/ with the next free number
npm run gate:data        # Fast data/unit diagnosis; does not replace the full release gate
npm run gate:serial      # Root steps plus the Research suite and build as one && chain; no SQL harnesses (the orchestrator decides those)
npm run test:e2e          # Cross-browser Playwright suite
npm run test:e2e:prod     # Live flows against vetmock.com
npm run lint:all          # All generated/data/content integrity gates — a SUBSET of the gate:
                         # no unit suite, no build, no e2e. The release gate is CI on the pull request
npm run stats             # Authoritative current inventory
npm run stats:check       # Fail if README/docs inventory drifted
npm run lint:questions    # Detect bias issues (release gate: 0 errors; warnings tracked separately)
npm run fix:questions     # Auto-balance answer position
npm run fix:length        # Auto-trim trailing parentheticals from correct option
npm run regen:changelog   # Write the derived changelog modules by hand
npm run fetch:videos      # Fetch YouTube transcripts to data-cache/transcripts/
npm run flat:transcript   # Flatten transcript JSON → text (with timestamps)
npm run ping:indexnow     # Notify Bing/Yandex/Naver after deploy
```

Gate flags (`node scripts/gate.mjs ...`): `--with-research` (force the Research phase),
`--with-sql` / `--no-sql` (the pglite SQL harnesses — auto-run when a file under
`supabase/migrations/`, the RPC-backed libs or a harness script moved; without a reachable
pglite module the gate prints why and CI postgres remains the concurrent-lock proof),
`--audit` (append a warn-only dependency audit that never changes the verdict).
A mid-run working-tree change is a failure, never green: `gate` is the proof of the tree.

Generated files — never hand-edit; the matching `lint:*` or `regen:*` script owns them:
`bank-registry.generated.js`, `docs/content-inventory.md`,
notes/wiki/citation registries (`regen:notes-registry`, `regen:wiki-registry`,
`regen:citation-index`, `regen:wiki-runtime`), question delivery + q-counts.

---

## 🔄 Content Pipeline (video summaries)

1. `npm run fetch:videos` → JSON in `data-cache/transcripts/{videoId}.json` (gitignored)
2. `node scripts/flatten-transcript.mjs <videoId> > data-cache/flat/<name>.txt`
3. Read flat text (use `offset+limit` if file > 25K tokens)
4. Draft markdown summary in established style:
   - Sections: Pathophys → Signalment → Clinical Signs → Dx → Tx → Monitoring
   - Always end with "📝 Exam Hot Spots" + "💡 Closing" blockquote
5. Edit the matching `src/data/video-summaries-<subject>.js` file and keep metadata in sync
6. Commit per batch (3-8 clips per commit) to avoid losing progress

---

## 🔗 Constants You'll Need

| Item | Value |
|------|-------|
| Product entry / study runtime | `vetmock.com` (legacy `vetmock.vercel.app` has the migration relay) |
| Research domain | `research.vetmock.com` |
| VCA domain | `vca.vetmock.com` (Vercel project rooted at `vca/`, not yet created) |
| GitHub repo | `palmzamak2547/vet-mock` |
| IndexNow API key | `e1e4e0feff0c42b1a0cb1118045ff82f` |
| Google Search Console verification | `14yg3AaHe91BC8VgVxjhxTrJsHCgvDSUIKetsJozHX0` |
| Default subject filter | `'all'` |
| Current academic year | `5` (Vet 86, ภาคต้น 2569 — `CURRENT_YEAR` in `src/data/curriculum.js`) |
| Cohort | `Vet 86` (year 86 of Chula vet school) |

---

## 📚 Detailed Context (in MycOS vault)

When you need deeper context than this file, read from
`C:\Users\palmz\OneDrive\Desktop\MycOS\projects\vetmock\`:

- `01-project-context.md` — what + why + audience
- `02-tech-and-architecture.md` — stack, lazy loading, state mgmt
- `03-file-structure.md` — full directory tree, critical IDs
- `04-content-pipeline.md` — transcript→summary workflow detail
- `05-progress-tracking.md` — what's done, version history
- `06-features-history.md` — recent commits + decision log
- `07-seo-deployment.md` — Vercel + GSC + IndexNow detail
- `08-conventions-issues.md` — full rules + known bugs (this file is summary)
- `09-roadmap.md` — what's next + ideas
- `11-production-operations-and-knowledge.md` — current architecture/release/OSS operations

Local reusable skill for future agents:
- `C:\Users\palmz\.codex\skills\vetmock-project-operations\SKILL.md`

Canonical repo knowledge map:
- `docs/PROJECT_KNOWLEDGE_BASE.md` — portable current architecture map
- `docs/LAUNCH_READINESS.md` — dated release proof, blockers and validation limits
- `docs/CONTINUOUS-IMPROVEMENT.md` — shared cross-harness ownership and improvement loop
- `docs/QUESTION-STANDARD.md` — before writing/editing questions
- `docs/EXAM-SUBJECT-PIPELINE.md` — before taking a new exam subject from timetable to release
- `docs/DESIGN_SYSTEM.md` + `docs/css-token-baseline.json` — before styling changes
- `docs/DATA-INTEGRITY-ROADMAP.md` — **read before any change to provenance, citations, counts,
  `question-metadata.js`, or the gate's shape.** It records why the same class of bug keeps
  recurring (facts that should be references are stored as free text), the rule that these are
  fixed by correcting DATA and adding a guardrail rather than by loosening a predicate, and a
  measured breakdown of where the gate actually spends its time: about 9 min on a quiet machine
  at the local default of 6 workers, about 15 min at CI parity (`CI=1`), about 25 min on a busy
  machine. Playwright is 86-92% of it; the vite build takes 17-73 s.
- `wiki/guides/content-pipeline.md` — content pipeline detail
- `wiki/operations/testing-and-ci.md` — lint/CI gates detail
- `STABILITY.md` — regression guardrails
- `ADDING-QUESTIONS.md` / `DECISIONS.md` / `RISKS.md` — as referenced

User profile + communication style:
- `MycOS/people/palm.md`
- `MycOS/_meta/communication-style.md`

---

## 🧠 Communication

Palm prefers:
- **Thai primary, English keywords mixed** (typical Thai vet/med student style)
- **Concise, direct, with emoji + tables**
- **Bias toward action** — ship over over-plan
- **Reality checks** when something's a bad idea (he'll thank you)

Avoid:
- Long prose paragraphs
- "I think..." / "It seems..." (be direct)
- Asking permission repeatedly before doing
- Mentioning Codex/AI in any user-facing artifact (see Rule 1)

## Durable rules promoted from historical handoffs

- Fixture semantics are part of the oracle: honor authored exact-zero and
  non-pinned separation evidence with strict input/shape/signal guards. The real
  method must return null inference/G14 on separation. Never repair replay drift
  by globally widening tolerance or replacing the reference numbers.
- A view that loads QB itself must invalidate its question memo when QB appends;
  parent qbReady/qbRevision may stay unchanged after a failed background load.
  Start review from the fresh scoped registry, and label any cached-card fallback.
- A prefetched resolver promise inserted during an awaited access check can become
  its own cache result. Capture the pre-await intent and recheck the current entry;
  preserve owner/access invalidation. See the library sign-out/prefetch regression.
- Restricted catalogue rows are absent from anonymous snapshots. Reconcile MCV
  against the authorized catalogue before calling an item NEW; verify member
  reading separately from upload/hash/anonymous-denial checks.
- Every open document may contain a draft, local PDF, playback or reading position.
  Keep natural worker activation: no skipWaiting, clients.claim, activation handshake
  or automatic document reload. Retain the old asset graph and OptionalFeature boundaries.
  See docs/UPDATE-AND-FLOW-CONTRACT.md. Earlier eight-view denylist notes are superseded.
- Scope follows Critical Rule 10: the current topic decides. Never intersect topic
  and old question scope. Counts beside launch buttons must use the pool's rule.
  Provenance sourceType means how material arrived; examOrigin names the sat paper.
  Correct evidenced data and guard the invariant; do not loosen a predicate or ratchet.
- Before lecture-summary edits, read docs/SUMMARY-CHECK-STANDARD.md and the
  fact-check ledger. Do not infer missing facts, terms, units, timestamps or lecturer
  names. Preserve genuine quotations and evidence pointers; no blind corpus rewrite.
- MyCourseVille uses .mcv/dump-current.py → .mcv/diff-current.mjs → manifest →
  scripts/ingest-library.mjs → a hash/slug-guarded catalog insert. Keep original
  source URLs and both dedup checks. Uploaded bytes alone do not prove shelf completion.
  Refresh the current term before coverage claims; never expose credentials or other
  users' private LMS material. Use the available authorized account's actual entitlements.
- After a library ingest, run `python -I scripts/library-pages.py extract` then `load`
  (per-page PDF text for in-document search; env SUPABASE_ACCESS_TOKEN + .r2env).
  A document showing a student or national ID is held (`text_status = 'pii_held'`,
  no page stored); a person decides what happens to its file. Never store its text.
- tests/e2e/fixtures.js owns the pinned calendar; projects use Asia/Bangkok.
  Specs that drive page.clock must opt out explicitly. Keep broad gates quiet and
  run day-boundary units in UTC too. A rerun must retain the first failure record.
- Use a worktree's own npm ci after lockfile changes; a node_modules junction can
  silently bundle the primary checkout's packages. Read the gate process exit code,
  not a filter's exit code. Scope PLAYWRIGHT_PORT to E2E only.
- Recheck main before integration; assign collaborators disjoint files/hunks and
  retain other lanes' edits. Stage exact files only. Push one coordinated real commit;
  a main push is the deploy, so do not add vercel --prod or an empty redeploy commit.
- Keep Claude Code, Grok and other harnesses on the same claim record,
  work/loop-20260930/COORDINATION.md, following docs/CONTINUOUS-IMPROVEMENT.md.
  Local .claude/work records are inputs; no acknowledgement is claimed without a reply.
- Keep user data, IDs, accessibility, clinical/source accuracy and existing motion
  quality intact. A measured improvement needs comparable evidence; fewer tokens,
  a passing build or a happy-path HTTP response cannot establish completion.

## Current coordination checkpoint — production 5.133.3 · 2026-10-01

- The owner resumed for review and production. PR 19 merged as f90dcf33;
  production is 5.133.3 / SWv201. Exact CI, deployment and live receipts are in
  docs/LAUNCH_READINESS.md; the earlier CLOSEOUT remains dated history.
- Atomic PDF annotation merge is installed as provider migration 20261001054615.
  The source copy is supabase/migrations/20261001030000_pdf_annotations_atomic_merge.sql.
  Native PostgreSQL 17.6 passed 40 cases, including four real lock races; ordinary
  member API 5/5 and signed-in browser draw/reopen/erase/redo 4/4 passed.
  New test rows were removed and existing Agenda metadata was preserved.
- Main Build/Smoke passed: 806 passed, one retry-flaky, 45 skipped. Local data/unit
  51/51, build/prerenders, three contrast audits and audit 0 passed. Full Windows
  gate was not green: preserve its timeout/retries and the unchanged focused test's
  18.6-second pass. Slow actionability's cause remains unproved; no timeout was raised.
- Question 8037 changes only dogcat to swine; answer/source/review remain.
  Fresh stats: 6,731 source, 6,663 ready, 68 held, 94 banks. No held answer was promoted.
- The original disposable account still awaits the prior deletion confirmation.
  Held sync 7146f950, provider maintenance and hardware/OAuth/social validation
  remain separate; completed probe cleanup is not account cleanup.
- Preserve the primary checkout's unrelated curriculum/design/scratchpad work.
  One claim record: work/loop-20260930/COORDINATION.md. Current evidence:
  work/loop-20261001-release/FINAL-RELEASE.md. Grok remains unavailable;
  do not infer another harness's acknowledgement from a branch.

## Historical release candidate - 2026-10-05

- User authorized complete verification and production release. Isolated branch `codex/bugfix-1005`, PR20, base `9aa12da9`; preserve the primary checkout's unrelated edits. Candidate is study 5.134.1 / SW202 and Research 0.1.1. Production proof is still pending at this checkpoint.
- Repairs cover personal-question identity/import/edit/delete/account boundaries, weak-practice string IDs, PDF exit autosave, video clip identity, SVG backup, Imaging compare ownership, Research backup/dataset/freeze/revision and delayed-focus failures. See `docs/bugfix-audit-2026-10-05.md`.
- DA-06 now has an immutable operation/receipt candidate: owner-scoped local intent, atomic row-locked RPC, per-key clocks/tombstones, explicit legacy recovery/export/archive, cancel barriers and stale-account request guards. Source migration `20261005140235_user_data_operation_sync.sql`; native harness `scripts/test-user-data-db.mjs`. Do not apply the earlier rejected CAS patch. See `docs/data-durability-and-operations.md` for rollout boundaries.
- All-new simulator exact 10/10, random 200/200, C10 50/50 and named 10/10 pass. Raw mixed-version strict results remain 18/20 and 265/400: remaining failures explicitly refuse old writes and require recovery, not transparent mixed-version success. Clean old-reader projection regressions were fixed. No automatic document reload or worker takeover.
- Latest local SQL PGlite 69/69; real lock waiting is pending native PostgreSQL CI. Study data/unit 51/51, build and three contrast audits passed; full Windows browser gate remains incomplete. Research 1319/1319 in each timezone passed sequentially; first concurrent timing failures retained. Final auth/sync focused 38/38 and both dependency audits pass. No numerical fixtures or tolerances changed.
- Next: push coherent candidate, require exact-head Build/Smoke/Research including native SQL races; apply migration once; verify new-fixture member API and browser, merge once, prove exact main CI/Production/live journeys, then clean only the new fixtures. The original retained account still has separate deletion authorization outstanding. Active claim: primary `work/loop-20260930/COORDINATION.md`; detailed receipts: `work/release-20261005/`.

## Research staged release preparation — 2026-10-06

- Frozen local candidate `codex/research-release-1006`, base `278ca1daa2dfc4f0a8f36c28d5230cf96a5dc39c`; Research 0.1.2 only. Main package remains 5.137.0 and worker/source unchanged. Commit/push/merge/deployment/live proof belong to the coordinating release owner; preparation is not production release.
- Corrected 34-path Research slice includes atomic derived saves, export privacy, OLS reference and frozen interpretation hash. Integration's explicit-Show regression is repaired by effective visibility plus `hiddenExplicit` choices; inherited hiding remains the default and explicit Show survives native save/Grid/CSV/reload. Legacy snapshots without the interpretation hash retain their data-hash check; mathematical fixtures/tolerances and natural worker lifecycle remain intact.
- Fresh corrected Research acceptance: units **1,342/1,342 Bangkok and 1,342/1,342 UTC** sequential, **0 skips**; own build and lazy artifacts **6/6**, audit **0**; native changed flows **16/16**, **0 retries**, exit 0, **2.9m** across Chromium desktop/mobile, WebKit mobile and Firefox desktop. Raw-header presence-before-hide and same-locator absence-after-hide prevent vacuous privacy assertions.
- Input/dependency manifests in `work/research-release-20261006/`: all **634/634** Research inputs match sourceRoot after the approved stronger native test was synchronized. Root/Research dependency records match. Root lock patch is source-map-js 1.2.2 plus alignment of stale lock metadata to existing 5.137.0; root high/critical0, existing moderate8.
- Dated unchanged main/root-lock full gate exit 0: data51/51, build/prerenders, contrast3/3; Chromium411 passed/19 skipped/2 retry-flaky and WebKit+Firefox404 passed/25 skipped/3 retry-flaky, total54.7m. These receipts protect unchanged main inputs and do not assert whole-tree full-local-green after the corrected Research copy. First text diagnostics and GL artifacts retained; the standard runner removed original Chromium attachments when GL started.
- All candidate files are frozen. Next release owner commits/opens PR, requires exact-head hosted Build/Smoke/Research before merge, then verifies deployment/alias/live changed flows before reporting released. Tracked handoff: `docs/research-engineering-2026-10-06.md`; detailed receipts/history: `work/research-release-20261006/report.md`.

## Active connected engineering candidate - 2026-10-06

- Owner requested repeated in-chat defect/flow/data/design/assets cycles; option1 selected, no automation. Stages released: Study5.137.1/SW203 PR22 main7c15823c and Research0.1.2 PR21 mainc0be16fc. Primary dirty work/old fixture and other lanes preserved. Post-release notes remain local; no extra deployment push.
- Repairs: compound/fresh weak history, scoped count/cap, Dashboard curated destinations, remembered cross-year SRS/Hard summary, validID0 and retained ISO chronology; recovery choices activate only after snapshot commit, receipts survive failed reads, cleanup uses one captured scan so peer work survives; Research derived save is atomic, privacy survives transformations/exports, OLS honors codebook reference and frozen interpretation has a separate hash; search recents resolve current authorized entries and owner/private caches invalidate across auth and delayed responses.
- Source and graph: `docs/engineering-loop-2026-10-06.md`; detailed receipts `work/loop-20261006/{learning,learning-atomic-review,durability,research,ux-assets}.md`. Existing RPC/schema, numerical fixtures, tolerances, natural worker lifecycle and original artwork remain intact.
- Current Study evidence: stable data51/51, build/contrast3 pass; changed learning/search native20/20 and active-exam read/retry regression4/4,0 retries; actual current SDK17/17 and member/guest two-context UI8/8, existing40-row aggregate unchanged. Parent App now shows local read/write failures during exams; preserve its original failed UI receipt and the corrected semester fixture traces. Broad local browser sweep was stopped at the owner's precision instruction, not green; require exact-head hosted CI.
- Both apps lock patched source-map-js1.2.2. Current study dependency audit high/critical0, moderate8 in the Cornerstone/vtk legacy formatting chain; Research audit0. No major imaging migration, production write or old fixture deletion. Source-map patch does not establish all-dependency security.
- Exact PR/main CI and both production SHA/aliases verified. Root READY dpl_BhJGKMsaKF3f4awVZaYV3UHxVz1H, worker203/header4; Research READY dpl_DYrbHsEuJNnfzbCr3Zmt67atYdon, public16/16/header4. Root main runner Unicode crash was retained; failed-job-only unchanged rerun passes. Actual root production member/guest two-context UI8/8/pageErrors0 and SDK17/17 pass; both new fixtures globally signed out/refresh denied/deleted with six dependent counts0, existing40-row digest unchanged.
- Root production guest matrix is incomplete:18 passed/4 failed/2 unrun; WK control failed later after cumulative click/render delay despite200 Topic chunk/correct Bookmark config. Preserve first/raw/finalized traces; do not claim24/24 or invent a cause. Next bounded cold-render diagnosis, then confirmed Pinboard ID0/qKey recovery edges. Receipt work/loop-20261006/RELEASE.md and CHECKPOINT.md. Goal active; retain natural-update, legacy/hash and physical/OAuth limits. No source/timeout weakening.

## Released pin recovery — 2026-10-06

- Branch codex/pin-recovery-1006, base92324342, PR23 released as e01c1e19cfe866f0747998cc954d1d90d14c6a1a/Study5.138.1/SW204. External VetWiki/notes/citation additions preserved. Pinboard opens validID0 and restored bare-note qKey; shared replay and bank-await retain the original owner before session/navigation writes and consume stale requests without next-account fallback. No new abstraction/provider/schema/clinical change.
- Actual-source regressions: original pin cases0/4 and owner races3fail; current7/7 + adjacent36/36. Unit2250/2250, lint:data, build/prerenders, contrast3, native two guest flows Chrome+WK4/4 with0retries pass. Audit high/critical0/moderate8 unchanged. Dependency records unchanged, lock version metadata aligned.
- Latency diagnostics remain unproven: old production18/4/2 and WK control retained; newer public probes used changed923, not7c. Host memory pressure/current-version variance prevents a source-cause claim. No timing/product change or blanket pass. Current state/evidence: work/loop-20261006/CHECKPOINT.md and pin-release/pinboard-owner logs.
- Exact PR Build37476415619/Smoke37476415639 and main Build37478322660/Smoke37478322723 SUCCESS. Root READY dpl_Gg6DM8H3rwXLC2UbYzpg123J8Q61 has matching e01 SHA/public aliases; actual worker204/headers4 verified. Unique production pin flows Chrome+WK4/4 first attempt,0retries,24.7s. Native guest fixtures only; no accounts created, old fixture/dirty primary/natural worker lifecycle preserved. PR earlyCI registered late/reopened-event supersession recorded; only explicit latest runs used as gates. Standard CI includes recorded retry-flaky diagnostics, not zero-flake proof.
- Next continuous cycle remains bounded cold-render diagnosis on a frozen deployment/environment; no permanent cause or all-bugs-free claim. Receipts work/loop-20261006/{CHECKPOINT,RELEASE}.md and pin-production-header-worker.json, pin-recovery-production-first.log. Post-release handoff local only; no extra deployment push.

## Active summary-pin return — 2026-10-06

- Branch codex/summary-return-1006, base e01c1e19; candidate5.138.2/SW205 not released. Preserve all collaborator lanes, including external VetWiki/notes work, dirty primary and old fixture. Ownership: Pinboard summary branch, VideoView reader intent, optional SummaryModal failure-body reload button, focused tests and release metadata only. No App/store/registry/clinical/provider changes.
- Existing known-clip handoff now returns a saved summary to its authored reader without playback. Explicit same-view mode wins over stale ticket; obsolete async loads cancel; denied storage cannot launch a stale player. Failed import recovery is user-triggered reload after fresh exact-summary ticket write; denied write stays put, no automatic reload/cache/worker change.
- Shared pending-clip consumer now captures during render and deletes only the identical ticket after commit; discarded native WebKit renders retain their destination and newer replacements survive. Actual mounted red7/8 corrected; final focused27/27 includes8 mounted cases. Source/test matchers retain known-ID, freshness, citation, normal playback and same-view consumption guards.
- Local initial full unit2256/2256, lint:data, contrast3 and unchanged audit high/critical0/moderate8 pass; final build and native Chrome/WebKit happy+explicit-reload4/4 pass with0retries (34.8s). Hosted full exact-head gates remain required. Failed native attempts retained: native ESM same-document retry, clock fixture reset, then actual pre-commit ticket loss. Spec uses existing flowing page.clock across reload; product TTL unchanged.
- Current state and original failure receipts: work/loop-20261006/CHECKPOINT.md, summary-return-local-first.log and test-results/summary-return-local-first. Cold-render cause remains unproved; preserve earlier guest18/4/2 and frozen timing receipts, no blanket green or timeout changes.

## Released Library filter handoff — 2026-10-06

- Isolated branch codex/library-return-1006, base b2abeb89 (PR24 main tree equals reviewed c553). Parent summary release verified before PR25 integration; PR25 now released as main300b200e. Preserve every collaborator and dirty primary. Own LibraryView initial query/subject capture and post-commit cleanup, focused tests and release metadata only; no App/auth/catalog/provider/clinical changes.
- Actual subject-card/search/recent-document writers were losing q/subject when the initial render was discarded. LibraryView now captures existing values and consumes only identical values after commit; newer replacements survive, URL-only restoration and same-view filter reset stay intact. Source9 additions/2 deletions, no new helper/dependency.
- Actual mounted discarded-render red failed; final focused28/28 includes the one mounted multi-boundary regression. Data lint/build/contrast3 pass. Native Chrome/WebKit actual subject-card→Library→reader→return and recent-document query handoff2/2 pass0retries23.6s. First native locator failure retained; corrected resources tab/control matches real source/DOM, no timeout/assertion change.
- Audit high/critical0/moderate8 reused from unchanged dependency records; only root package version metadata changed. Released5.138.3/SW206. Existing global/account/storage/worker boundaries preserved. Evidence/checkpoint: work/library-intent-20261006/CHECKPOINT.md; first/final native traces under test-results/library-intent-local-*. Prior cold-render latency remains evidence-limited; no blanket green claim.


- PR25 Study5.138.3/SW206 released300b200e, exact PR/main Build+Smoke SUCCESS/fullunit2259, READY dpl_JCSQnppFuxVwaNx7dyc8WEYg6fdQ/exactSHA/aliases before-after unchanged; worker206/header4/http200. Production actual Library filter→reader→return/recent-query Chrome/WK2/2 first attempt0retries30.5s, unchanged assertions/timeouts/traceoff. Provider/catalog fixtures isolate UI proof; no live provider-health claim. Source9+/2-, localfocused28/native2/data/build/contrast3 pass. Audit moderate8/cold-render limitations remain; primary/all collaborators/oldfixture preserved, no forced worker/account/schema/provider/clinical changes.
- Detailed receipt/checkpoint: vetmock-library-1006/vet-mock work/library-intent-20261006/{RELEASE,CHECKPOINT}.md. Postrelease docs local only, no extra push. Next bounded readonly remaining one-shot consumer audit; runtime300 stays immutable until another confirmed slice. Handoff2026-10-07.

## Active Notes feature intent — 2026-10-07

- Branch codex/notes-intent-1007/base300. Candidate5.138.4/SW207 not released. Scope shared pure feature-registry takeViewIntent/consumeViewIntent and SubjectSelect/TopicSelect initializer/post-commit hunks only; no App/store/auth/provider/clinical changes. Preserve all collaborators/primary dirty work and prior releases.
- Real Notes feature writers (FeatureMenu/Palette/Tools) led to both views deleting the intent during initialization. Actual abandoned-render tests fail in both before fix; shared capture and exact-value post-commit consume now retain it, preserving default same-view consumption, normal/unknown/empty/refused storage, newer replacements and explicit resources shortcut.
- Current focused25/25 includes2 actual mounted cases plus existing20 adjacent; data/build pass. Native actual feature→subject→resources/normal-practice Chrome/WK2/2 pass0retries15.0s; contrast3 pass. Dependency records unchanged except root version metadata, existing moderate8 limit retained. Root owns release metadata/reconciliation; runtime300 stays public until verified release.
- Evidence/checkpoint: work/notes-intent-20261007/{red,green-first,adjacent,build,lint-data}.log; current broader loop checkpoint work/library-intent-20261006/CHECKPOINT.md. No new account/provider/schema/forced worker/automation or repeated old SDK/Research suites.
- Confirmed same-flow aggregate trap folded before release: hide only All under reading intent; ordinary practice All remains visible/enabled and its actual handler stillconfig. Mounted All red4/5 corrected5/5 plus adjacent20; updated same native scenario Chrome/WK2/2 pass0retries25.3s, finalbuild/copy gates pass. No aggregate Notes/type invention. Olda48 CI is superseded by one substantive follow-up commit; require latesthead gates.


## Subject covers source checkpoint — 2026-10-08

- Study5.139.0/SW214, based on main4fc69665: 85 distinct course bookplates (76 new WebP +9 unchanged Panic assets), shared by Home/SubjectSelect. All Subjects reuses the open-book print. Source: `src/data/subject-covers.js`, `src/components/SubjectCover.jsx`; names/counts/scopes/callbacks and Panic behavior remain intact.
- Asset gate85/85; Chromium all85 Home cards across6years at375px, desktop/light/dark, missing-image keyboard navigation and All-to-config verified. Regression: `tests/e2e/subject-covers.spec.js`. Detailed source-art/check receipts: `work/subject-covers-20261007/`.
- Preserve ignored original PNGs and diagnostics separately from shipped WebP. Source version is not deployment proof; require exact-SHA CI/READY aliases/live checks in `docs/LAUNCH_READINESS.md`. Other lanes and primary dirty work remain outside this patch.

- Release checks: full data/unit51/51 across Bangkok/UTC, build/prerenders and contrast3 passed; Chromium447passed/21skipped. New cover regression also passes WebKit/Firefox; their focused cover/resources run4/4. Original Windows core-journey30s failures retained; unchanged isolated control passed29.9s. Require exact-head Linux4profile CI before release.
- COM artwork uses portable `companion-1..5.webp` filenames; keep Windows device names out of asset paths. Sharp0.35.5/rsvg2.63.2 closes GHSA-wq5f-xc86-pv6w; audit0high/critical,8existing moderate Imaging dependencies remain.
