```js
{ kind: 'improve', scope: 'system', title: 'แอปโหลดเบาลง', desc: 'คลังข้อสอบและหน้าสรุปก่อนสอบดาวน์โหลดน้อยลง จึงเปิดได้เร็วขึ้น เนื้อหาที่เห็นเหมือนเดิมทุกอย่าง' }
```

# Debt batch: weight (what every student downloads and never uses)

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
