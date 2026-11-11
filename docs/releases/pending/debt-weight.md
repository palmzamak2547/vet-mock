```js
{ kind: 'improve', scope: 'system', title: 'แอปโหลดเบาลง', desc: 'คลังข้อสอบและหน้าสรุปก่อนสอบดาวน์โหลดน้อยลง จึงเปิดได้เร็วขึ้น เนื้อหาที่เห็นเหมือนเดิมทุกอย่าง' }
```

# Debt batch: weight (what every student downloads and never uses)

Checks on this branch's build: `npm run perf:budget` ok; e2e smoke, source-line-spoiler,
answer-evidence, vca-practice, phase-wrapped-home, connected-study, phase-advance,
notes-sidebar-scroll, atlas-entry, atlas, wiki-indexing, mobile-compat on chromium-mobile and
webkit-mobile: 111 passed, 7 skipped (the wave's pull request runs all four engines);
`npm run test:unit` 4,140 tests, 0 failed; `npm run lint:data` ok.

Register rows PERF-3, PERF-4, PERF-2, PERF-5, PERF-6, CSS-2, DEAD-3. Nothing a student sees changes and
nothing on the exam path is touched. Numbers: one bundle build of the branch point (ef993a0e, `vite build`
without the public/ copy) and one full `npm run build` of this branch, gzip level 9 per file, 11 Nov 2026.

## First load (perf:budget, index.html entry, its static imports and CSS)

| | before | after | budget |
|---|---|---|---|
| JS | 225,486 B | 225,505 B | 227,900 B |
| CSS | 46,506 B | 46,442 B | 47,900 B |

The JS difference (+19 B) is the entry chunk naming the renamed data chunks; no first-load module changed.
This batch frees no first-load JavaScript (PERF-2 below was not done). The budgets are unchanged.

## Three modules moved out of the first load

Each its own commit and guard, listed in `perf-budgets.json` `lazyOnly` (perf:budget fails when one is a
static import of the first load again, read from the build manifest; tests/unit/first-load-lazy.test.mjs
holds the same on the source graph), tested in tests/e2e/first-load-lazy.spec.js.

- `origin-move.js` + `move-base.js`: loaded only when `lib/move-gate.js` finds move work (an inbox waiting:
  the app starts after the merge; only after-load work: loaded without waiting). The gate mirrors the
  module's own early returns (tests/unit/move-gate.test.mjs). A failed load starts the app and keeps the
  inbox. Measured alone: first-load JS 225,505 -> 220,895 B gzip (-4,610).
  - The start-up jobs are one table, `MOVE_JOBS` in move-gate.js (inbox, records, notice, note), and
    origin-move.js runs only the jobs it says are due, so a new job cannot leave the gate behind.
  - A chunk that stalls gets 4 s (`MOVE_WAIT_MS`), then the app starts and `window.__vmxMoveSkip` tells a
    late origin-move.js not to merge under the running store; the same flag is set before the module is
    asked for on the after-load path. The inbox waits for the next boot.
  - A job that keeps failing is tried 3 times (`MAX_ATTEMPTS`): the inbox merge counts in
    `vmx-move-inbox-attempts`, the record import in `vmx-move-received.attempts`. Only a merge or import
    that actually ran counts: a boot that timed out or was reloaded during the wait never ends a move. The
    inbox job of `MOVE_JOBS` writes the count just before the merge and clears it when the merge goes
    through; `api/move-in.js` clears it whenever it writes an inbox, so a retried move gets its own tries.
    After the merge's last try the app shows one notice that stays until closed: "ย้ายข้อมูลการเรียนจาก
    vetmock.vercel.app มาที่นี่ไม่สำเร็จ ข้อมูลทั้งหมดยังอยู่ที่ที่อยู่เดิม" with the link "ลองย้ายอีกครั้ง"
    (the old address's `?vmx-move=retry`). Then boots stop fetching and waiting. What the student keeps: everything
    stays where it was (the unmerged inbox in localStorage, the PDF ink and study events in the IndexedDB
    inbox, and the old address's own copy); what the app no longer does is show that carried data here.
    This hits only a device whose storage is full or whose IndexedDB refuses writes three boots running.
- `native-app.js`: loaded only when `lib/native-detect.js` (IS_APP) says this is the Android app, and the
  app starts after it; app-lifecycle reads IS_APP so no worker registers in the app.
- `MotionSettings.jsx` + `lib/haptics.js`: loaded with the theme panel (and on pointer or focus at its
  button), the same closed row holding the place; the component's export and props are unchanged. A tap
  on the row meanwhile opens the settings when they arrive, and keyboard focus on it moves to the real row.
  Accepted: offline, a student who never opened the theme panel while online sees only the closed row
  (the worker caches an `/assets/` chunk once it has been requested); the other theme controls work.
- Not moved: `SyncStatusNotice.jsx`. `public/sw.js` precaches only `/`, `/manifest.webmanifest`,
  `/favicon.svg` and `/icon-192.png`; `/assets/` chunks are cached only once requested, so a lazy notice
  could be missing offline, the moment it exists for.
- The first-load budget is not lowered: the room is for the screen lanes.

## Where the first load goes (a ranked list, not a change)

First-load JS is 225,505 B gzip in six files: main 110,608, daily-q 58,915, vendor-react 46,462,
app-lifecycle 4,840, supabase 3,299, storage-gc 1,381. Per-module sizes below are each module minified
with esbuild and gzipped alone (static import walk from src/main.jsx, 114 modules); alone they overstate
by about a fifth, so read them as ranks. "Loads it" is the static importer that puts it in the first load.

Movable without touching the exam path, largest first (estimated together 11.9 KB, so about 10 KB real):

| Module | gzip (alone) | Loads it | Deferred, does the first screen change? |
|---|---|---|---|
| lib/origin-move.js + lib/move-base.js | 3,650 + 1,575 | main.jsx (side-effect import) | No for anyone not moving from vetmock.vercel.app. Its boot work exists only when `vmx-move-inbox` is in localStorage; import it only then. It must still finish before user data is read, so a mover's first paint waits for one small chunk |
| components/SyncStatusNotice.jsx | 2,505 | App.jsx | No: it renders only when sync has a problem; lazy behind that condition, a notice due at boot shows a moment later |
| lib/native-app.js | 2,440 | main.jsx | No in a browser (it is a no-op there); import it only when the Android bridge is present |
| components/MotionSettings.jsx + lib/haptics.js | 1,390 + 422 | ThemePicker.jsx | No: it is inside the theme panel, which opens on a tap |

Not movable without the exam path or a first-screen change:

| What | gzip | Loads it | Verdict |
|---|---|---|---|
| Curriculum topic lists (`topics` in SUBJECTS_BY_YEAR) | about 38,300 of curriculum.js's 53,600 (JSON measure: 51,537 with topics, 13,227 without) | statically by App.jsx, lib/exam-scope.js, lib/exam-pool.js, lib/daily-q.js, data/questions.js, lib/quests.js, lib/feature-registry.js, hooks/useSelectedPhase.js, lib/user-data-row.js | Home's subject cards (names, years, colours) come from the part without topics. Home's per-subject counts read topics (`hiddenTopicIdsFor`, `visibleQuestionCount`), but they also wait for the banks, so a topic map loaded with the banks probably leaves the first paint as it is (not verified). exam-scope, exam-pool, the quiz start in App.jsx and the boot migration `migrateUniqueTopicProgress` read topics synchronously, so this is an exam-path change. Saves about 38 KB of first load |
| The selected year's question banks (Year 5: 74 chunks) | 2,581,598 (2,622,621 before this branch) | not in the first-load budget: App.jsx's boot effect calls `loadQBForYear(selectedYear)` for a student with a saved year | Yes. Home reads `QB` for the due-today cards, the exam-pool counts and the one-tap random question, so deferring them leaves those numbers waiting. The pool is the exam path. A generated per-subject count index could serve Home's numbers first; the review queue and the pool still need the banks |
| data/exam-origins.js | 4,715 | lib/question-metadata.js, from App.jsx (`panicPool`) and lib/exam-pool.js | Exam path |
| lib/feature-registry.js, the nav and header components | 5,644 and under 3,000 each | App.jsx, Sidebar, HeaderBar, BottomNav | Yes: they draw the first screen |
| lib/user-data-sync.js, user-data-atomic.js, api.js | 8,506, 6,350, 3,761 | hooks/useUserDataSync.js from App.jsx | Yes: the store reads the student's progress before the first paint |

## PERF-3: question-bank and wrap-up fields no screen reads (done)

- `scripts/strip-unread-fields.mjs`, a Vite transform (first in `vite.config.js` plugins), removes from
  `src/data/questions-*.js`: `sourcePages`, `_pdfRef`, `_confidence`; and from each wrap-up bullet
  (`src/data/wrapups/*.js`, `groups[].items[]`): `sources`. Source files are untouched; scripts
  (lint-source-docs, provenance build, ingest) and the VCA bank build (which whitelists its own fields
  in `vca/scripts/build-bank.mjs`) read src/ with Node.
- Kept, because something reads them: `verificationSources` and `sourceDocument` (the source chip),
  `flag.sources` (Question.jsx), the prediction fields (`predictionSignals`, `predictionEvidence`,
  `predictionTier`, `answerStatus`, `curriculumVersion`: lib/question-prediction.js, current-scope.js),
  `confidence` (PrivateNotes), `imageCredit`/`imageSourceUrl`, and every other field the bank holds.
  Each kept field has a reader under src, api, vca/src or ai/src (grep, comments excluded).
- Proof of "unread": `rg -w` over src (data files excluded), api, vca/src, ai/src finds `sourcePages` only
  in a comment (src/data/source-docs.js) and in wrap-up prose; `_pdfRef`, `_confidence` nowhere. The
  wrap-up page reads `name, th, agent, topic, keywords, emphasis[].text/src, examined[].text/src,
  pitfall` and never `sources`; no other module loads a wrap-up.
- Saved: 54 chunks, raw 693,058 B, gzip 78,635 B in total. Largest: zoonoses wrap-up 226,419 -> 124,387 B
  raw (48,562 -> 26,453 gzip); data-q-y5-epid-final-marked 764,804 -> 697,017 (104,915 -> 98,870);
  data-q-y5-milk-meat-final-recall 463,764 -> 405,886 (63,371 -> 59,211); data-q-vca-super 2,021,998 ->
  1,971,790 (354,920 -> 352,291); data-q-y5-milk-meat-final-marked 625,454 -> 581,193 (86,868 -> 82,948);
  the other wrap-ups 2.6 to 16 KB raw each. The built dist/assets holds none of the three names.
- Guard: `tests/unit/strip-unread-fields.test.mjs` fails when code under src, api, vca/src or ai/src
  reads a dropped question field (checked by planting a reader: it failed), when a module that loads a
  wrap-up mentions `sources`, when a chip field joins the list, and unless every served bank and wrap-up
  deep-equals its source minus exactly those fields.

## PERF-4: glossary `synonyms` (not done, the premise was wrong)

238,538 B is the size of the whole `src/data/glossary.js`; its `synonyms` are 301 B over 166 entries,
and they are read: `resolveGlossaryEntry` looks a tapped term up in `SYNONYM_INDEX`, and
`getAllSearchableStrings` uses them. Nothing to strip. The file's weight is `defLong` (161 KB).

## PERF-2: curriculum in the first-load chunk (not done)

The shared first-load chunk `daily-q` is 249,079 B raw / 58,915 B gzip and `src/data/curriculum.js`
alone is 60.6 KB gzip as source. Nine first-load modules import it statically (walk from src/main.jsx):
App.jsx (SUBJECTS, YEARS, CURRENT_YEAR, yearForSubject), lib/exam-scope.js and lib/exam-pool.js
(SUBJECTS with topics, hiddenTopicIdsFor, semesterForSubject), data/questions.js, lib/daily-q.js
(hiddenTopicIdsFor), lib/quests.js, lib/feature-registry.js (SUBJECTS_BY_YEAR), hooks/useSelectedPhase.js,
lib/user-data-row.js. App.jsx also needs topic lists at boot (`migrateUniqueTopicProgress(readingChecklist,
SUBJECTS)`) and in the quiz start path. A slim generated extract (id, name, year, semester, scaffold,
no topics) would serve App, quests, feature-registry, useSelectedPhase and user-data-row, but exam-scope,
exam-pool and the quiz start in App.jsx read topics, so the split goes through the exam path. Needed:
the extract plus a lazy topic map awaited where the quiz starts and the migration runs, reviewed as an
exam-path change after the finals. Then lower firstLoad js to the measured value plus 3%.

## PERF-5: oversized images and PNGs (no change)

- 64 PNGs in public/; 58 over 20 KB, of which 55 are OG cards (crawlers fetch them, students do not).
  A lossless re-encode (sharp, compression 9, effort 10, checked by decoding both files to RGBA and
  comparing every byte, refusing files with iCCP/gAMA/cHRM) saves 168,417 B of 8,418,136 (2%), all on
  OG cards. Not applied: 8.2 MB of new blobs in history for 168 KB nobody in the app downloads.
- 203 images over 200 KB are lossy WebP figures (largest public/figures/vet-parasit-1/.../p7-0.webp
  550 KB, histology micrographs 450-525 KB). Recompressing or resizing them is a visual judgement (they
  open zoomed), so left for the owner. grid-A-L.png and mochi-sleep.webp named in the register are no
  longer in the tree as PNG (the grid is WebP since 5.203.0).

## PERF-6: Atlas models (no change)

16 of the 17 specimen GLBs already use KHR_mesh_quantization (cuhl9-base, 2.74 MB, does not) and none carries a texture (largest
canine-visible-ajou-detail 10.15 MB, quick 5.49 MB). The next step is EXT_meshopt_compression
(gltfpack -cc) with MeshoptDecoder set on the GLTFLoader and the hashed file names and offline Atlas
revision updated: a loader change plus a look at each specimen, left for the owner.

## CSS-2: 100vh without dvh (done outside the question screens)

Most of the register's hits were already paired (vmx-app, player modal, dicom tags dialog, landing,
gate, evidence scroll, VCA run/wait/wall/chat). Paired now, 100vh kept first as the fallback: the notes
sidebar and the lesson contents (src/styles.css), the VetWiki rail (src/styles-wiki.css), the VCA page
body (vca/src/styles/base.css). Left for the exam-path batch with two reviews: `.vmx-image-lightbox__frame`
`--zoom-max-h` (figure zoom), `.vmx-q-passage-pane`, `.vmx-flashcard` wide-screen figure height,
`AnswerEvidence.jsx:154` (inline width). Also left: `DicomViewport.jsx:601` (inline clamp in the imaging
lab; a React style object cannot hold both units) and ai/src `.ocean` (already 100lvh).

## DEAD-3: CSS classes nothing writes (17 removed)

Method: every class in the 36 stylesheets against every token of every non-CSS file in the repository
(src, api, vca, ai, research, scripts, public, tests, docs, html), plus a check that no prefix of the
class ends at a template interpolation or a quote-plus concatenation, and no base plus quoted suffix.
37 classes had neither. Removed (whole rules, or the selector from a list; 2,583 B from
styles-atlas.css, 614 B from styles.css): vmx-atlas-header, -pilot, -breadcrumb, -count, -canvas,
-loading, -overlay, -gesture, -share, -share-status, -empty; vmx-home-quick-context, vmx-subject-head,
vmx-subject-id, vmx-search-input, vmx-wiki-meta, vmx-wiki-meta-link. Bytes: AtlasView.css 21,853 ->
19,868 raw (3,865 -> 3,548 gzip), first-load CSS 46,506 -> 46,442 gzip.
Left, dead by the same test but on the question, feedback or quiz setup screens: vmx-match-row, -left,
-status-pill, -status-cancel and the 13 vmx-match-dnd-* (leftcol, chip-text, rightcol, rightcol-header,
rightcol-title, rightcol-count, cards-list, grip, card-text, used-badge, selected-tag, floating-ghost),
vmx-q-advance, vmx-q-back, vmx-feedback-kicker, vmx-config-note. Left as possibly built (146), e.g.
`k-*`, `kf-*`, `mode-*` (ai), `rs-*` (research), `lp-tile-*`, `is-gold/sage/rose/sky` (landing),
vmx-atlas-stage-bottom.
Guard: lint:css-tokens, tests/unit/atlas-scene-compare, the Atlas, Home and wiki e2e specs.
