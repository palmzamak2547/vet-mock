# AGENTS.md — VetMock Project Guide

> ⭐ **Read this first when working on VetMock.** Detailed context lives in
> the **MycOS vault** (Obsidian) at `C:\Users\palmz\OneDrive\Desktop\MycOS\`.
> Read `MycOS/AGENTS.md` for full context — this file is just the quick refresh.
>
> ⚠️ The vault lives on the owner's Windows machine. On other checkouts
> (e.g. this macOS one) those paths do not exist — use the in-repo
> `docs/PROJECT_KNOWLEDGE_BASE.md` as the fallback knowledge map.

---

## 🧭 Ecosystem role (canonical · locked 2026-05-29)
- **Role:** Standalone vet study platform — own brand, may consume cuvetsmo-source/mcp, NOT part of the council site.
- **Layer:** Product · **Live:** https://vetmock.vercel.app
- **OWNS:** the question bank (**4,769 source questions / 4,704 learner-ready across 73 banks** at the 2026-09-07 checkpoint) + lint/fix tooling + exam/SRS engine (MCQ/TF/Fill/Match/Short/Writing · Quick/Exam/SM-2 · analytics · groups) + a deliberately simple educational Imaging Practical. Re-run `npm run stats` before quoting current totals.

### ⛔ No-duplication — rules mirrored from `cuvetsmo-docs/NO_DUPLICATION.md` (sibling repo, not in this tree)
Do NOT rebuild knowledge backend (→ cuvetsmo-source) · MCP (→ cuvetsmo-mcp) · AI inference (→ shared ai-chat) · the full clinical/pro DICOM workstation (→ cuvetsmo-imaging).

> 🩻 PRODUCT SPLIT 2026-08-11: VetMock keeps its own approachable **Imaging Practical** for quick study, local files, public teaching cases, and basic measurements. `https://imaging.cuvetsmo.com` is the separate **Imaging Pro** product for the full toolset. Keep the Practical intentionally narrow; advanced workflows belong in Pro.

---

## 🎯 Project At a Glance

- **VetMock** — คลังข้อสอบสัตวแพทย์ จุฬา (Vet question bank for Vet 86 + future years)
- **Stack**: React 18 + Vite 6.4.3 + Supabase (auth/DB) + PWA · plain JSX app code, TS only at the edges (`db/schema.ts` + `src/db/schema.ts`, `drizzle.config.ts`, `supabase/functions/*`)
- **Current source version**: v5.85.1 (2026-09-08); verify exact-SHA CI/deployment and live flow before describing production as current.
- **Hosting**: Vercel (auto-deploy on push to `main` · `api/*.js` are Vercel serverless functions · `vercel.json` also CSP-rewrites `/venipuncture/*` to a separate app and `/wiki/*` + `/app/*` to the SPA)
- **Production**: https://vetmock.vercel.app
- **Audience**: ~50-100 vet students at Chulalongkorn (Vet 86 cohort) · Thai-language

---

## 🚦 Critical Rules (MUST FOLLOW)

### 1. Never mention agent tooling or generative assistance in public content
- ❌ Changelog entries, tooltips, blog articles, About page, public commit trailers
- ⛔ NO `Co-Authored-By` agent trailer in this repo — vet-mock is public
- Keep public copy focused on the product and verifiable contributors.

### 2. Changelog (`src/data/changelog.js`) shows ONLY user-observable changes
- ✅ New features (UI, content, fixes that affect usage)
- ❌ SEO / build / refactor / infrastructure → git history only
- See header comment in changelog.js
- The homepage banner and sidebar badge read `src/data/latest-changelog.generated.js`
  (newest entry only, so the entry chunk does not carry the whole history).
  `npm run build` / `npm run dev` regenerate it; `npm run regen:changelog` by hand;
  `lint:changelog-latest` fails when it is stale. Never hand-edit the generated file.

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
- A build or push is not production proof. Require exact-SHA GitHub Build + Smoke E2E, successful Vercel Production deployment, and a live flow against `vetmock.vercel.app`.
- Push one real commit; avoid burst pushes and empty redeploy commits.

### 10. A paper examines TOPICS — never mix กลางภาค with ปลายภาค

Palm, 2026-09-16: "กลางภาคก็ควรอยู่กลางภาค ปลายภาคก็ต้องอยู่ปลายภาค ... แยกให้ชัด สร้างมาตรฐาน
และความมั่นคง". The separation had been a label, not a filter: `'1-mid'` and `'1-final'` both
mapped to semester 1 and nothing else, so the two picks served an identical pool.

**The model, in one line: scope belongs to the TOPIC, and a question inherits it.** Resolution
lives in `src/lib/exam-scope.js`, first hit wins:

1. `question.examScope` — a hand-set fact about that one question. Use it only when a past
   paper disagrees with where its topic sits **this** year ("อาจมีบางปีที่ไม่ตรงกับรุ่นปัจจุบัน
   ก็ให้เทียบหัวข้อเอา").
2. `topic.examScope` in `curriculum.js` — **the normal path, and the one to reach for.**
3. `subject.examScope` — a subject taught and examined as one block (POA is `'continuous'`).
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

## 🗂️ Where Things Live

| What | Where |
|------|-------|
| Routing/state | `src/App.jsx` + `src/lib/view-route.js` (`view` state; readable stable `/app/*` routes) |
| Views (lazy) | `src/views/*.jsx` |
| Mochi / Motion | `src/components/Mochi.jsx` + `src/lib/mochi-presence.js` embed contextual companions in existing views; one device preference hides all; 3D stays on demand in `/app/mochi`. Exam feedback requires a revealed practice answer; focused drawing/imaging workspaces stay clear. |
| Motion in real flows | `MotionFeedback.jsx` owns visual responses on real controls; `ReadingEffects.jsx` enhances actual Notes/VetWiki text; `FocusBackdrop.jsx` + `StudyBreak.jsx` follow Pomodoro state. Global settings live in ThemePicker. See `docs/motion-kit-real-usage.md`; preview actions are never evidence of a real save or answer. |
| Vercel serverless functions | `api/*.js` (wiki-explain, study-coach, grade-summary, tts, library-file/blob, send-feedback, …) · shared model chain in `api/_lib/llm.js`, output guards in `api/_lib/grounding.js` |
| DB schema (drizzle) | `db/schema.ts` ≡ `src/db/schema.ts` · push via `npm run db:push` |
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
| Styles (all CSS) | `src/styles.css` + `src/styles-landing.css` + `src/styles-admin.css` (`.ad-*`, the back-office only) |
| Back-office (one account) | `src/views/AdminView.jsx` at `/app/admin`; reads `src/lib/admin-api.js` (RPCs gated by `is_admin()`), flags from `src/lib/question-quality.js`; schema in `supabase/migrations/20260915121049_admin_backoffice_v1.sql` |
| Tailwind v4 (scoped) | `src/styles-tailwind.css` — utilities ONLY for `src/components/shadcn-space/**`; no preflight, everything layered so hand-written CSS always wins; `@` alias → `src/` |
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
npm run test:e2e          # Cross-browser Playwright suite
npm run test:e2e:prod     # Live flows against vetmock.vercel.app
npm run lint:all          # All generated/data/content integrity gates (release gate)
npm run stats             # Authoritative current inventory
npm run stats:check       # Fail if README/docs inventory drifted
npm run lint:questions    # Detect bias issues (release gate: 0 errors; warnings tracked separately)
npm run fix:questions     # Auto-balance answer position
npm run fix:length        # Auto-trim trailing parentheticals from correct option
npm run regen:changelog   # Hand-regen latest-changelog.generated.js
npm run fetch:videos      # Fetch YouTube transcripts to data-cache/transcripts/
npm run flat:transcript   # Flatten transcript JSON → text (with timestamps)
npm run ping:indexnow     # Notify Bing/Yandex/Naver after deploy
npm run db:push           # Push drizzle schema to Postgres (drizzle-kit)
```

Generated files — never hand-edit; the matching `lint:*` or `regen:*` script owns them:
`bank-registry.generated.js`, `latest-changelog.generated.js`, `docs/content-inventory.md`,
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
| Production domain | `vetmock.vercel.app` |
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
- `docs/PROJECT_KNOWLEDGE_BASE.md` (read this when the vault is unavailable)
- `docs/QUESTION-STANDARD.md` — before writing/editing questions
- `docs/DESIGN_SYSTEM.md` + `docs/css-token-baseline.json` — before styling changes
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

## 2026-09-06 — Vercel cost pass (Claude)

The whole Vercel team got paused by the Pro spend limit (see vault `knowledge/learnings/vercel-spend-audit-2026-09.md`
and skill `~/.claude/skills/vercel-cost-discipline/SKILL.md`). vetmock itself is cheap ($1.64/cycle), but its
builds are not: 48 production + 23 preview builds in 5 days, 19 previews from a single `claude/*` branch.

- Push to `main` is the deploy; never run `vercel --prod` on top of a push.
- The Ignored Build Step now skips `claude/*`, `codex/*`, `agent/*`, `grok/*` branches and production pushes
  that only touch `docs/`, root `*.md`, `.github/`, `.claude/`. `[skip ci]` still works for anything else.
- One session = one push. Squash content batches (Q-bank, notes, summaries) before pushing.
- Vercel runtime logs keep 1 day now (Observability Plus is off). Use Supabase logs and the app's own tables for history.

## 2026-09-08 — Library shelf: MyCourseVille check + SharePoint/OneDrive links (Claude)

For codex and any other agent touching `library_docs` or `scripts/ingest-library.mjs`:

- **Shelf today: 2,012 rows / 59 subjects / 12 GB on R2** (`select count(*), pg_size_pretty(sum(byte_size)) from library_docs`). R2's free 10 GB-month is behind us; storage above it bills at $0.015 per GB-month, so weigh a video-heavy batch before shelving it.
- **The MyCourseVille check is a pipeline, not a hand job**: `.mcv/dump-current.py` (current-semester listings through the mcv client in `MycOS/scripts/mcv-mcp`, creds in its `.env`) → `.mcv/diff-current.mjs` (diff by original filename against every `storage_key`/`source_url` on the shelf) → `scripts/mcv-manifest.mjs` → `scripts/ingest-library.mjs --manifest … [--dry-run] [--rows-out …]` → an INSERT guarded by `not exists (sha256_16 or slug)`. `.mcv/` is gitignored; `.mcv/insert-*.sql` show the exact INSERT shape (null-only columns such as `page_count`/`lecturer` must be left out of VALUES or Postgres reads the column as text).
- **`ingest-library.mjs` now accepts a manifest item with `path`** (a file already on disk) next to the network path; `url` stays the share link so the catalogue row still points home. That is how SharePoint/OneDrive shares behind the university sign-in get shelved: resolve the share to its server path from inside the owner's signed-in browser session (`fetch(shareLink)` on the SharePoint origin + `_api/web/GetFolderByServerRelativeUrl(...)/Files` for folders), navigate `_layouts/15/download.aspx?SourceUrl=…` per file (top-level navigations, so Chrome's multiple-download throttle never fires), then ingest from `path`. Pinned by `tests/unit/library-ingest-local-path.test.mjs`.
- **Dedup is two-layered and both layers are real**: the diff by filename before any download, and the sha256 guard at INSERT. A file downloaded three times (identical sha) still yields one row. Never bypass either.
- **Equine Medicine (3106510) is complete on the shelf** — all ten MyCourseVille links, 45 files, 1.13 GB (3 decks, the 4 dental-exam recordings, 37 Respi/GI clips, Dr. Thapana's nutrition deck). Twenty clips carry Google's mp4 muxer tag (YouTube downloads the instructor placed in the folder) or are colic animations of unstated origin; they went in `restricted` first and Palm opened them to `public` the same day — the `permission_evidence` text records that sequence. `status = 'restricted'` (sign-in only, RLS tier that already exists) is the honest default for third-party material until the owner decides.
- **Read mp4 headers instead of guessing origin**: the first 64 KB carry the muxer (`mp42`/`isom` phone or clinic recordings, `Lavf` re-encodes, `Google` = YouTube-served). It settled the public/restricted split without a single guess.
- Local staging (`.mcv/equine-0908/`, 1.2 GB) was deleted after the INSERT on Palm's instruction; R2 + `library_docs` are the only copies.

## 2026-09-09 — Library shelf: the daily MyCourseVille check, 7 more files (Claude)

For codex, so nothing here gets redone or "fixed":

- **Shelf today: 2,019 rows / 59 subjects / 12 GB.** The 09-09 check found 96 files on MyCourseVille 2026/1 (89 the day before): 79 already shelved, 10 external links already shelved, **7 new, 0 duplicates** — POA sneezing/cough/dyspnea **(full version)** next to the student version, FIQC_ML_ACFS_1 + _2, OHVPH_SP_E2 + E3, Equine Parasites, Helminthic Zoonoses 2026. All `public`, evidence line dated 09-09.
- **`.mcv/diff-current.mjs` now takes a date arg and treats an external link as shelved when its share URL (minus `?e…`) is a row's `source_url`** — the ten Equine SharePoint/OneDrive rows stop being reported as "not mirrorable". Rerun on the same dump must print `NEW: 0` before the day is called done.
- **A Thai-named zip on MyCourseVille**: its S3 key is the Thai title with the backslashes stripped (`u0e01u0e32…`), so a plain GET answers `AccessDenied`; `repairMcvUrl()` in `scripts/ingest-library.mjs` restores the percent-encoding. The zip held one 51.7 MB PDF, which is what went on the shelf (a zip would only be a download button) as a `path` item, with the zip's **original** MyCourseVille URL kept as `source_url` — that is the string the diff compares, so keep it verbatim, never the repaired form.
- **`.mcv/rows-to-sql.mjs`** (gitignored, in `.mcv/`) now carries subject/kind/status/evidence per row and only batch-wide constants in the SELECT; a folder without a label (`_other`) must become a real `NULL` description, not the string `'null'`. Same `not exists (sha256_16 or slug)` guard as always.
- **21 same-title pairs exist on the shelf and are not duplicates** (18 from the VCA archive, 3 older MyCourseVille rows such as two different "ANS" handouts): different bytes, different sizes, sha differs. Leave them; a title-dedup pass would delete real files.

## 2026-09-09 — Bug hunt over the 5.83-5.85.1 arc, and two findings left open (Claude)

Ground-truth pass over `f57803e3..HEAD` (the Mochi motion kit, the reading effects, the PDF flows, the
tour). Six confirmed defects shipped as **5.85.2**, each pinned by a test proven red on the old code
(`tests/unit/polish-feedback-and-delete.test.mjs`). Three other reported findings were refuted against
production and are NOT bugs — do not "fix" them.

Fixed, with the reason so the shape does not come back:

- **`finishTourStart` must not be memoized** (`src/App.jsx`). It was `useCallback(…, [])`, so it kept the
  FIRST render's `startExam` — which closes over `session.startNewSession`, memoized on `ownerId`. Auth
  resolves asynchronously, so render 0 always has `user === null`; the set was stamped `sessionOwner=null`
  and `finishExam` then refused to submit it for **every signed-in student**, every time, with
  "บัญชีเปลี่ยนระหว่างทำข้อสอบ". Signed-out was fine, which is why the e2e stayed green. **Rule: anything that
  calls `startExam` from a stored callback must read the current render's copy.**
- **A motion family name must not collide with a catalog id** (`src/components/MotionSurface.jsx`). The
  remount key folded `mochi-*` lab poses onto `'mochi'`, but `'mochi'` is itself the cursor-follower effect,
  so switching between the two never re-mounted and the stage kept the wrong rig. The family is now
  `'mochi-lab'`; the test asserts no catalog id ever takes that name.
- **`useMotionFeedback` fires on any change of its signal**, so keying the bookmark bounce to the boolean
  replayed the "saved" animation on plain ถัดไป navigation onto an already-bookmarked question, and again
  while the star emptied. Both call sites (`Question.jsx`, `PinButton.jsx`) now pass a press counter.
- **The reading-checklist confetti** was keyed to a derived count, so a cloud pull or a second tab fired a
  "chapter complete" for work done elsewhere. Gated on a flag the local writers raise.
- **The recent-list trash button did not delete** (`src/views/PdfAnnotateView.jsx`). `deleteAnnotations` is
  local-only and there is no remote delete anywhere in `annotation-sync.js`, so the next open ran
  `pullAndMerge` — which restores unconditionally when the local record is gone — and every stroke came
  back. It now **tombstones every stroke id and pushes that** before dropping the local record, which is the
  two-phase set the eraser already uses; a failed push keeps the (now ink-free) record so the deletion can
  still travel. Do not replace this with a raw remote DELETE: an offline device would re-push its strokes.
- **The local PDF path promised the ink would return** even when `storageHealth().persistent` is false. The
  shelf path already warned; the two branches now match.

Left open, deliberately, with the reason:

- **Shelf documents dead-end in the reader's recent list.** `ingestRemote` writes a record for library docs,
  so they appear under "ไฟล์ล่าสุด" — and `pickRecent` opens the OS file chooser, asking for a file that only
  exists on the shelf. The clean fix needs the shelf identity on the record (`slug` through
  `saveAnnotations`'s field whitelist **and** `mergeRecords`, which rebuilds from an explicit literal and
  drops anything not named there) plus the sync payload. A cheaper route that touches no schema: look the
  hash up in the already-cached library catalogue (`sha256_16`) and route those rows to `onOpenLibrary`.
- **Completing the 7-step tour does not dismiss the first-visit welcome banner.** `showWelcome` is gated on
  `history.length === 0 && !welcomeDismissed`, and `setWelcomeDismissed(true)` is only called by the banner's
  own dismiss. เกษม owns that surface and made a deliberate banner decision in `a654ca94`; the call is his.

Refuted against production, do not re-report: the PDF trash button is owner-bound (the reader builds an
owner-bound facade at `PdfAnnotateView.jsx:117-131`, so `deleteAnnotations(hash)` does carry the account);
Ctrl+K does not open the palette during the tour; the tour's stale closure does not affect signed-out use.

## 2026-09-12 — Read-only UX, coherence, and connected-flow audit

- User requested findings only; no application fixes, commit, or deployment were made. Detailed 36-item report, browser evidence, source references, and refutations: `work/audit-sense-20260912/REPORT.md` (local, gitignored). Base: `adfa1048`, package 5.86.0; production displayed v5.86.0, exact deployment SHA was not checked.
- Reproduced on production: Library's shared 150-card limit makes another expanded year empty; Wiki search from an already-open article leaves the previous article; article → Home → browser Back returns the index; Library year/type filters reset after PDF return. Mobile PDF search/overflow controls extend beyond the 390px viewport.
- Reproduced on an isolated local origin: pinned question opens an unrelated Bookmarks pool and produces an empty set; global Mock retains a previously selected topic despite the all-subject label; Notes' local subject switch does not update the parent used by Back; invalid YouTube URL warning still permits save. Notes' selected Fish Biology article started around y=1,877px at 390×844 because the full subject/topic sidebar stacks above it.
- `npm run stats` and `work/audit-sense-20260912/learning-contracts.mjs` supplied current inventory and synthetic-history logic evidence. Source-only findings and design judgments are explicitly separate in the report; auth, groups/races, multi-device sync/restore, and actual iOS/screen-reader behavior were not end-to-end verified.
- Next step, only if fixes are requested: preserve current unrelated PDF/Mochi/E2E work, start with item identity/navigation/return context and silent pin eviction, then reconcile exam scope, learning metrics, and mobile reading. Do not treat this audit as remediation or release proof.

## 2026-09-12 — Full verification continuation, no fixes

- User requested complete testing and explicitly accepted WebKit emulation because no physical iOS device was available. Consolidated evidence and findings #37–43: `work/audit-full-20260912/REPORT.md`; this extends the prior 36-item report without resolving those findings.
- Detached exact `adfa1048` baseline: unit 795/795, build, lint:all and atlas lint passed; existing E2E 535 distinct project-cases passed, 41 intentional skips, 0 failures. A Firefox random-no-MCQ skip passed on a targeted rerun. Initial generated-file warnings were CRLF comparison artifacts, not changed HEAD content. All preview/test browsers stopped; isolated worktree and evidence retained.
- Additional backup/failure/recovery checks passed 48/48 across Chromium, Firefox, WebKit. Real production test identities verified auth/passkey/session 9/9, reading sync/account isolation 5/5, exam/bookmark/note/detail export 9/9, race 11/11 and PDF cross-engine sync/deletion/isolation 8/8. Passkey used a virtual authenticator; email delivery, provider OAuth completion and physical assistive/stylus behavior were not claimed verified.
- New production defects: signed-in 320/390px header controls overlap and a phase-center click opens account/search instead; group detail fails PGRST200 because `group_members` has no relationship to `profiles` for the embed query; actual account deletion returns 401 `Auth session missing!` despite a validated token, then mislabels the error as network uncertainty. Source/evidence paths are in the report. No repair was applied.
- Additional confirmed defects: PDF overflow/color Escape loses focus in all three engines; a cold offline result-detail save needs Home recovery after online retry reloads the app (answers recover, no duplicates); online Wiki chunk recovery clears query. Dependency audit has one High `js-yaml` advisory chain affecting six package nodes; app exploitability remains unproven.
- Cleanup is verified: app deletion failed, so exact-ledger admin cleanup revoked sessions and removed all three ephemeral users and their test group/data. Public rows, auth sessions/refresh tokens/passkeys/challenges and private race/join-rate rows all reconcile to zero; temporary credential file removed. See `production/cleanup-admin-result.json` and `production/cleanup-database-verification.json`. Do not reuse old QA credentials or claim the app delete flow passed.
- Next work still requires a request to fix: prioritize signed-in header, group detail relation and account deletion, then the prior identity/navigation defects. Preserve unrelated main-checkout PDF/Mochi/E2E edits; do not confuse test completion with remediation/deployment.

## 2026-09-13 - The 2026-09-12 audit fixed and shipped (5.87.0, SW v162)

- Owner asked for all 43 findings from `work/audit-sense-20260912/REPORT.md` (36) and `work/audit-full-20260912/REPORT.md` (37-43) to be fixed and deployed. Every finding was re-verified against current source before anything was touched: 7 grouped read-only verifiers returned 30 CONFIRMED, 8 PARTIAL, 0 REFUTED, and their per-finding verdicts and anchors are saved at `work/audit-verdicts.json`. The audit was accurate; do not re-litigate it.
- Shipped in four commits. Routing and identity: a pinned question, a question note and a palette hit now open THAT question through the new `openQuestionById` (App.jsx, deliberately not memoized - the bank is empty on the first render); KnowledgeView follows its subject/topic props, keyed only on `[subject, topic]` so leaving an article does not bounce back into it; `onPopState` lifts subject+topic out of a wiki path, guarded to wiki paths because `subject` doubles as the exam scope; `startMockExam` and Schedule's practice shortcut clear the topic; App passes `setSubject` to NotesView.
- Exam scope: `buildExamPool` applies the phase's SEMESTER to ordinary practice, placed before the curated branch so it is not gated behind it, and never borrowing `isCurrentScopeQuestion` (that predicate needs verified prediction metadata and would empty ordinary practice). Measured against real counts: year 4 term 1 1,981 -> 348, term 2 -> 1,633, year 5 term 2 -> 590, reproducing the audit probe exactly. Mid-vs-final is NOT scopeable from ordinary question data; the phase screen's wording was corrected instead of faking it.
- One definition of "wrong" now lives in `src/lib/wrong-pool.js` (latest verdict wins) and three surfaces use it: the exam pool, the home chip, the weak list. Keep them together - when they disagreed, a button promised one number and handed over a different set. Weak tags need `pct < WEAK_TAG_MAX_PCT` (70).
- Production defects: the delete-account function called `getUser()` with no argument under `persistSession:false`, so every delete answered 401 "Auth session missing" - it could not have worked for anyone; the client now reports a status line as `__server__` rather than `__network__`, because the old path told the student their data might already be deleted when nothing had been. **That function does not ship with the web build and was deployed separately; it is live as `delete-account` version 2 (verify_jwt still true), and the deployed source was read back and compared to this repo's copy afterwards.** Version 1 had been broken since 2026-05-20. The env guard now also requires `SUPABASE_ANON_KEY`, because `createClient` throws on an empty key and an uncaught throw answers 500 with no CORS headers - the browser then reports a CORS error and hides the real cause. Users never upload to Storage (no `.upload(` anywhere in `src/`; the shelf and lab buckets are read-only), so there are no per-user objects for the purge to miss. Group members are read with two queries joined in JS because `group_members` has no FK to `profiles` (checked in pg_constraint); `profiles` is world-readable by design (username and emoji only). Header overflow was `flex: 1 1 auto` without `min-width: 0`.
- `js-yaml` override 3.15.1 -> 3.15.2; `npm audit` now reports 0 vulnerabilities (was 1 High).
- Deliberately NOT done, both owner decisions rather than defects: (1) finding 22, the home screen stacking seven "what to do today" surfaces - the verifier's own verdict is that this is a design-priority call; the proposed minimal move is QuestsPanel + DailyGoalCard behind one collapsed disclosure below the subject grid. (2) finding 18's engine half - making the exam clock a single non-refillable session budget. The per-question timer refills on back/jump, so the copy was corrected to "60 วิ ต่อข้อ"; changing the clock touches anyone mid-exam at deploy time. Do not ship either without asking.
- The PDF zoom-anchor and shape-snap work that had been sitting uncommitted in the main checkout since 09-09 was reviewed and shipped WITH attribution in its own commit, not folded into the audit commits. It was not mine; `git add -A` swept it in once and the commit was split rather than left mislabelled.
- Gates on the shipped tree: build 0, unit 819/819 (23 new guards in `tests/unit/audit-sense-fixes.test.mjs`, including real behavioural tests for `stillWrong`, `semesterForSubject`, `mergeRecords` slug survival and the local-extras validators), lint:all 0, npm audit 0. Two pre-existing source pins were superseded on purpose, with the reason written into the test: the ConfigView topic-clearing pin (clearing the topic was damage control for landing in a pool at all) and the 'wrong' pool pin (membership moved to the shared rule).
- Two more e2e flake classes were root-caused and closed at the same time, both firefox-desktop, both timing rather than behaviour. (1) `expect.timeout` was 5s; the slowest engine paints a cold entry chunk in ~1.1s when it has the machine to itself, but the suite is `fullyParallel` across four projects and under that contention the first assertion after a `goto` crossed 5s and failed on the app's own "กำลังโหลด…" state - three different specs failed that way on two consecutive runs, never the same one twice. Specs bitten earlier had been hand-patched with an explicit `{ timeout: 15_000 }`, so the global is now that same number rather than a new allowance; an expect timeout bounds how long a condition may take to become true and cannot make a false assertion pass, and the 30s test timeout still catches a stuck wait. (2) Three specs carry a hand-rolled allowlist for retrying a transient navigation abort, and Gecko reports some of those aborts as a bare `<unknown error>` with no code, which matched none of the named patterns - so the retry rethrew on its first attempt. All three lists now include it; they had already drifted apart (`system-polish` was missing two patterns the others had). If a fourth copy appears, give them a shared helper.
- **A pre-push review of that first pass found 14 defects it had introduced, one of them a blocker, and they were fixed before anything was pushed. Do not skip this step on a change of this size.** Six read-only lenses over `git diff origin/main` (engine logic, routing, Thai copy, CSS, storage, release metadata), each finding then put to two independent refuters — one asked to disprove the mechanism, one to disprove that a student ever reaches it — and only findings both failed to refute were kept. The blocker: the new phase→semester filter had no empty-guard, and every question-bearing subject in years 1 and 3 is semester 2, so any เทอม 1 phase filtered the whole year away. `detectCurrentPhase()` assigns '1-mid' the moment a student taps ปี 1 in September, so today that student saw a card advertising 298 ข้อ and then an empty set; years 2, 4 and 5 were unaffected, which is why nothing else caught it. The filter now applies only when it leaves something behind. Measured term-1/term-2 pools per year: 1 → 0/298, 2 → 104/40, 3 → 0/62, 4 → 348/1633, 5 → 2094/590.
- The other 13, each now with a test: `stillWrong` trusted array order for "most recent attempt", but `applySetArrayChanges` appends this device's local-only rows after the remote ones whatever their date, so a two-device student kept being served a question they had just got right — it compares `item.date` now. The results screen ran three gates off two different bases (message on the rounded pct, banner on exact counts, colour on a hardcoded 60), so 28/47 printed "ถึงเกณฑ์ซ้อมของแอปแล้ว" and "ยังไม่ถึงเกณฑ์ซ้อมของแอป (60%)" together, in green; one `reached` now drives all of them and `buildScoreCard` too, so the shared card cannot contradict the screen it came from. `openQuestionById` compared `q.id === id` strictly, but notes and pins are keyed inside a localStorage OBJECT and come back as strings while bank ids are numbers — every note in the palette missed, pulled the whole bank down looking again, and dropped the student in the bookmarks pool; it compares as strings now, and says so when the question really is gone. A reading intent stashed on the no-topics branch was never consumed, so the next subject card the student tapped opened on the reading tab. The PDF reader's shelf toast was local state rendered by a view that `onOpenLibrary` unmounts in the same batch, so it never painted (it is `alertDialog` now), and its shelf query searched "<title>.pdf" against an index built only from title/description/subject/topics. Plus: the library cap blamed open years when one is open by default, VetWiki counted per-article rejections and reported more failed วิชา than exist, re-picking the wiki article you just left did nothing because App still held its subject/topic (an `openNonce` signals every request), Escape from the eraser panel focused a swatch the eraser does not render, and one landing heading kept a literal Fraunces stack.

## 2026-09-13 — 5.88.0: the lecture corpus finished, and the two owner decisions taken

- **The Vet 85/86 lecture corpus is now complete to the limit of what YouTube will give us: 593 summaries, 535 of the 552 clips on the two channels.** The 17 that remain are not work left undone — 16 have captions disabled by the uploader (`Transcript is disabled on this video`), and one is an 18-second fragment whose whole caption is 366 garbled characters. Do not "finish" these by writing from the title; there is nothing to write from. Re-check with `node scripts/video-coverage.mjs` if the uploader ever turns captions on.
- The count I reported the day before (39 remaining) was wrong; it was 97. `video-coverage.mjs` is the only number to trust, and the transcript files, not the channel enumeration, are where a clip's title and duration live — Innertube left `title` empty for 512 of 552 videos, so a work list built from the coverage report alone produces summaries with no titles.
- How the 80 were written: 42 writer agents (batched to ~230k transcript chars each, subject kept together) then 42 independent verifiers re-reading each summary against its transcript. **The verify stage found 69 real problems and was worth every token.** 28 were invented facts — a writer filling a garbled caption with a plausible term, which is the single most damaging thing this pipeline can do: one rendered a blood parasite as พยาธิในลำไส้ (that lecture's caption engine writes "blood" as "บัตร" throughout), one moved a field-trip return from Thursday to Friday, one named a drug the lecturer never named. 31 were timestamps interpolated at section boundaries rather than copied, which sends a student to the wrong minute. A correction pass then fixed 76 and **rejected 1 as a reviewer error**, having been told to verify each claim before acting on it.
- `scripts/rebuild-video-summaries.mjs` now normalises CRLF in the body. Four summaries edited in place on Windows came back with CRLF while the generated module stores LF, and the round-trip check reported drift on files that were character-for-character identical — a real failure signal spent on an invisible difference.
- `scripts/lint-academic-safety.mjs`: the `ตรง(มาก|เลย|เป๊ะ|…)` claim pattern is now **context-guarded** rather than narrowed. Thai does not space its words, so it was matching inside ตรงไปตรง**มาก**ว่า, ยืนตัวตรง**มาก**, ไม่**ตรงเลย** (a vaccine serovar) and มาไม่**ตรงเป๊ะ** (a puppy's vaccination week) — four ordinary sentences, no exam in sight. Narrowing the pattern is what let real violations through last time, so the pattern stays broad and the claim only counts when an exam word appears within 60 characters. The exact-spelling substitution table is separate and still unguarded; one line was reworded to satisfy it.
- Owner decisions, both asked and both taken: the exam clock is now **one budget for the whole paper** (50 questions = 50 minutes, spent where the student needs it, no refill on back/jump, time up ends the paper where they stand) and the home screen folds **quests + daily goal into one closed disclosure** under the subject grid. In-flight exams keep the clock they started under: the saved record carries `clock: 'session' | 'per-question'`, and a record without that field predates the change and resumes per-question — those records hold a PER-QUESTION deadline, so reading it as a whole-paper deadline would end someone's exam the moment they reopened it.
- 21st was consulted for the summary-reading polish and its components were **not** installed: Scroll Progress and Reading Text Reveal both pull in `motion/react`, a new dependency for what a scroll listener and a transform already do. The reading bar and the block reveal are built natively, off under reduced motion, and structured so they cannot fail closed — the class that hides a block is added only by the code that observes it, after both guards, and removed on cleanup.
- Traps worth remembering: PowerShell `Get-Content`/`Set-Content` round-trips CORRUPT Thai source - use Python with explicit utf-8 or the editor tools; `PINBOARD_MAX` is exported, not `MAX_PINS`, and Vite ships an undefined identifier silently; `overscroll-behavior: contain` belongs to overlays only, never an in-page panel.

## 2026-09-16 — The cohort's own lectures become the source (Claude)

Palm pointed at the channel his year records its lectures on and asked for
summaries built from what the lecturer actually says. Two things had to be
repaired before that was even possible, and the second was invisible.

**The transcript fetcher had been fetching nothing.** YouTube moved playlist
rows to the `LockupView` renderer, so `item.id`, `item.title` and
`item.duration` all read undefined, and the loop's `if (!videoId) continue`
swallowed every row. A run over a 12-video playlist reported **0 new, 0 cached,
0 failed** — which reads as "nothing to do", not "nothing works". It had been
silently broken across all 46 playlists. `readPlaylistItem()` now reads
`content_id`, `metadata.title.text` and the runtime from a thumbnail badge, and
**an unreadable row counts as failed and prints its renderer type** — that one
line is what would have surfaced this on day one.

**The channel cannot be enumerated by browsing it.** The playlists tab and
channel search show only the two public playlists; the other 52 are unlisted and
reachable only through the home shelves. Browsing it signed-out produced a
confident wrong answer twice — I reported that Equine Reproduction was not on
the channel and that the videos had no captions. Both were false, and Palm had
to push back hard before I checked properly. **Innertube reads the home shelves
directly**: `yt.getChannel(id)` then the shelves, giving all 52 playlists with
no browser and no login. That is the method. Do not click through YouTube.

Fetched: **59 new transcripts**, 17 failures all of them DekDokVet85 videos whose
owner disabled captions. All ten VET86 year-5 subjects came back complete —
62 clips, 4.13M characters, into `data-cache/` which is gitignored.

**Three Equine Repro summaries, at the standard that was asked for.** The bank
measures median 5,891 characters and p75 12,941; the thinnest are 380-630 and
two of those were equine-repro, which is what "มีแค่ overview" referred to. The
new ones are **30,616 / 29,881 / 33,928** characters across 18, 19 and 23
sections. Each was written by one agent and then fact-checked against the
transcript by another, which found and fixed real fabrications:

- `PGE2` throughout, where in 93 minutes the lecturer only ever said
  "prostaglandin E" — the subscript was the author's addition
- a "Caslick vulvoplasty" synonym that was never spoken
- a student exchange that never happened; the lecturer asked and answered his
  own rhetorical question
- "Microsoft Teams" where the audio stops at "Micros"
- a quotation attributed 13 minutes away from where it was said

Two things worth keeping. The summaries carry the lecturer's emphasis verbatim
("จำนะครับ ม้าไม่มี LH surge", the 3 ยอ mnemonic, the trap question about
follicle versus corpus luteum, and the grading split). And the fact-checker
resolved the garbled name of the lecture-8 teacher against this repo's own
instructor roster to **Theerawat Swangchan-Uthai** — independently confirming
the endometritis lecturer correction made earlier the same day from the faculty
schedule, by a completely different route.

**Next, and already paid for:** transcripts for the other nine VET86 subjects
are on disk. Summarising them needs no fetching, only the same two-agent pass —
write, then fact-check against the transcript with permission to edit the file.
The fact-check is not optional; it caught an invented subscript that a student
would have memorised.

## 2026-09-16 — 5.103.5: the first matching questions, and nine that did not survive review (Claude)

**17 questions added, 9 authored-then-dropped.** Five agents transcribed the
matching sets and essay prompts out of the MID 86 compilations; a sixth pass
re-opened the same pages and tried to refute every pair. All five batches came
back PROBLEMS, which is the point. What the review caught:

- The milk processing set: page 2 has handwritten corrections over four of the
  twenty dropdowns, and the author used the letters in the boxes that had been
  REPLACED. Two pairs were wrong. Dropped.
- Two left-hand cards carried words ("เรียงขวาง", "หนา") the page does not
  print — checked at 6x zoom by the reviewer.
- An explain claimed cecal core is "ชนิดเดียวที่ลงไส้ตัน". Not true; E. necatrix
  also reaches the caeca.
- An HPAI written answer had pulled in the egg sign the page tags to H9 (LPAI).
- An H7N2/H9N2 explain imported "E. coli หรือ Mycoplasma" from the Infectious
  bronchitis page — a different disease.

Kept only where the reviewer confirmed content AND key and asked for metadata
alone. **milk-meat-hygiene went from 0 matching questions to 7**; avian gained
10. `lint:question-standard` then caught one more: an explain saying a fact sat
"ในสไลด์คนละใบของชุดเดียวกัน" narrates the document instead of teaching. Reworded.
0 defects across 5664.

**The "อิงแนวเดิม 15/1, 1500%" chip.** My own regression from 5.103.1: the
denominator became phase-scoped and the numerator (`topic.pastPaperCount`) did
not, so a topic reduced to one midterm question still counted fifteen
past-papers. Fixed at the source with `Q_PAST_PAPER_COUNTS_BY_TOPIC_BY_SCOPE`,
counted in the same loop over the same set; the "รวมทุกหัวข้อ" card had the same
break and reads the same table now; and `Math.min(ppCount, count)` means no
future mismatch can print a ratio above 1. An invariant check over all 499
topic/phase cells passes.

**Caslick, and why a lecture title is not the last word.** Palm sat the lecture and reported Caslick was taught before the midterm; the surgery question had just left the midterm pool with topic `eqrepro-surgery` (lecture 12). Both are true: Caslick corrects pneumovagina, which is lecture 6 (ภาวะไม่สมบูรณ์พันธุ์, before the paper), and lecture 12 is ศัลยกรรมของม้าเพศผู้และเพศเมีย. The content is taught twice, so 105488 and 105555 are `both`, not `final`. Note that 105488 was the ONLY non-castration item among the eight questions in `eqrepro-surgery` — a topic whose other members are scrotal hernia, emasculator, scirrhous cord and penile paralysis. **A question sitting alone in a topic it does not resemble is a signal worth checking.** 105570 (when to open the sutures in a pregnant mare) stays final: that genuinely is lecture 13.

**fiqc-livestock-qc stays TBD on purpose.** The faculty timetable for 3109501 names สพ.ญ.ดร. มินตรา ลักขณา for the 9 ก.ย. 69 lecture, and I filled it in — `lint:instructors` then failed, correctly. The `lecturer` field is contractually bound to a profile in `instructors-directory.js` carrying publications with URLs and a verification source, and no profile exists for that name. Fabricating one to clear a lint is the precise failure this repo exists to prevent, so the field went back to TBD. **The name is evidenced and ready** — it needs a verified profile, not another reading of the timetable.

**Lecturers, from documents only.** Six TBDs filled in equine repro and one in
food industry, and **two wrong names corrected**: endometritis was Theerawat
Tharasanit where the schedule says TS (Theerawat Swangchan-Uthai), and pregnancy
was Nawapen Phutikanit where lecture 13 says SSa (Sawita Santiviparat).
Spellings checked against `instructors-directory.js`; มินตรา ลักขณา is not in it,
so the Thai spelling from the timetable is used rather than a transliteration I
invented. 760 TBDs remain across years 1-4 and stay TBD — there is no document
for them and a guessed name is exactly the failure mode being guarded against.

**Two process traps, both mine, both already written down before I hit them:**
- PowerShell `Set-Content` for a one-line version bump wrote a UTF-8 BOM into
  `package.json` (Vite's JSON loader threw, build dead in 100 ms) and mojibaked
  44 Thai lines in `sw.js`. The trap was already in this file. Use node or the
  editor tools for every repo file regardless of edit size, and check
  `git diff --stat` matches the intent.
- A Monitor filtering only for success lines is silent identically whether the
  job is running or died. Thirty minutes were spent watching a dead log.
  Always include `Build failed`, `ERR!`, `✗`.

**Left for next time, with the work already done:** MILK HYGIENE p3 is a second
20-item matching set, not yet converted. The nine dropped questions each carry
the reviewer's exact correction in the workflow journal, so they can be repaired
without re-reading a PDF.

## 2026-09-16 — MID 86 paper audit: what the three unread papers actually hold (Claude)

Nine agents read every page of AVIAN MED (82), MILK HYGIENE (145) and FOOD
INDUSTRY (22). Full structured report, with a page cite on every item, is
checked in at `docs/mid86-paper-audit-2026-09-16.json`. Read that before any
ingest rather than re-reading 249 pages.

**FOOD INDUSTRY carries a second faculty timetable** (page 2, อุตสาหกรรมอาหารและ
การควบคุมคุณภาพ 3109501, ภาคต้น 2569). สอบกลางภาค 21-25 ก.ย. covers exactly four
lectures: บทนำ + การคุ้มครองด้านสุขภาพ, การควบคุมคุณภาพอาหารสัตว์, การควบคุม
กระบวนการฆ่าและการจำหน่ายเนื้อสัตว์, การควบคุมคุณภาพในกระบวนการผลิตปศุสัตว์.
HACCP, มาตรฐานเพื่อการส่งออก, สัตว์น้ำ and the meat-inspection practical are
ปลายภาค. **The bank already matches this exactly** — fiqc-intro, fiqc-feed-qc,
fiqc-slaughter-qc, fiqc-livestock-qc midterm; fiqc-haccp, fiqc-poultry-export
final. No change needed, and that is now evidenced rather than assumed.

**`fiqc-aquatic` looked like a conflict and is not one.** The topic is scoped
`continuous` and hidden, and this timetable does list it as a taught lecture on
28 ต.ค. 69. But the curriculum's own `lecturerNote` on that topic reads
"ไม่ออกสอบ — handout only", attributed to the lecturer who teaches it. **A
timetable says what is TAUGHT; the lecturer said what is EXAMINED**, and the
second is the more specific claim about the thing we are deciding. It stays
as it is. The 16 questions are already written and the topic carries a note
saying to drop `hidden: true` if the year turns out otherwise — no work needed
to reverse it.

**What is actually in the two big papers, and it is more than was assumed:**
- MILK HYGIENE p38-145 is not notes. It is ~119 reproduced exam questions,
  one per page, as online-quiz screenshots with the correct option highlighted
  green. p1-37 adds 42 matching items. 199 items total.
- AVIAN MED p43-82 is the same shape: 40 pages, one quiz item per page with the
  answer visible. p1-42 adds the senior's summary sheets plus 34 matching items
  and 7 essay prompts. 186 items total.
- FOOD INDUSTRY: 48 items, mostly slide content behind the four midterm topics.

Against the bank today (avian 329 / milk 450 / food 154, of which matching
questions number 6 and 0), the matching sets alone are a large un-ingested
seam. **Nothing from this audit has been ingested** — it is an inventory, and
each item still needs the question-writing rules, dedup against the existing
bank, and the lints.

**Two hazards the agents recorded, worth obeying:**
- AVIAN p3-4 have a live text layer whose Thai font substitutes tone marks with
  ASCII (`+`=ไม้โท, `E`/`1`=ไม้เอก): naive extraction yields เชื+อ, ทีE. Read
  those pages as images. This is the tone-mark corruption already in memory,
  now with the exact substitution map.
- The AVIAN compiler states a colour key on p1: anything not blue or black is
  lifted from the senior key, and a pink star marks a disease they could NOT
  find in it. The highlighting is exam signal, not emphasis. The same compiler
  warns "อย่าจำแต่โพย เพราะท่าจะเปลี่ยนข้อสอบบ้าง" and records that two
  lecturers did not follow it at all — so nothing here may be ingested with a
  claim that it will appear.

## 2026-09-16 — 5.103.4: the department's own schedule settles equine repro (Claude)

Palm asked one question — "คุณมั่นใจใช่ไหมครับว่ารุ่นผมออกกลางภาคจริง" — and the
answer was no. Measuring the evidence actually attached to each question:
**20** equine-repro questions scoped midterm cite a real `Equine Repro Mid 86.pdf`
or `Equine reprod mid TJ.pdf` by page and number. **15** cite nothing but a
document called `Repro horse final`, and I had marked them midterm anyway from
`scope-audit/equine-repro-mid.report.md` — a file that is **not in this repo and
that I could not produce**. Three of those 15 sat in topics the curriculum
itself marks `final`. That was the "final ติดมาด้วย" Palm kept seeing, and it
was mine, not the data's.

He then sent the thing that settles it: **Horse reproduction (3108515) Course
Schedule 2026**, the department's own sheet. สอบกลางภาค 21-25 ก.ย. 2569 covers
**lecture 1-6**; สอบปลายภาค 23 พ.ย.-4 ธ.ค. covers **lecture 7-14**. A sheet like
that outranks every senior paper for THIS cohort, and it moved three topics:

- `eqrepro-endometritis` **midterm → final** (lecture 7). Sixteen questions had
  been sitting in the midterm pool; not one of them cited Mid 86.
- `eqrepro-pregnancy` **both → final** (lecture 13, การตั้งท้องและการคลอด).
- `eqrepro-infertility` **both → midterm** (lecture 6).

The split now reproduces the sheet exactly — กลางภาค 58 (anatomy-cycle 12,
exam-mare 14, art-female 13, infertility 6, stallion-infect 12, pregnancy 1),
ปลายภาค 108. The single pregnancy question left at midterm is 202249, day-14
ultrasound pregnancy diagnosis, which is lecture 3 content and cites the real
Mid 86 paper. `eqrepro-stallion-infect` stays `both` on purpose: lecture 5 is
โรคติดเชื้อของม้าเพศเมีย and lecture 11 is เพศผู้, the topic straddles them, and
two of its questions carry genuine Mid 86 citations.

**Rule to carry forward:** a per-question `examScope` that contradicts its
topic's may only stand when the question cites the paper it claims. 44 overrides
were cleared here for failing that test.

 the marker was in a third field, and a senior's final is this cohort's midterm (Claude)

Two reports, both correct, both with a cause one layer under where the symptom
sat. Neither was a leak of the wrong paper into a cram; 5.103.1's pool filter
holds. They were a detector reading two fields out of three, and a label
telling the student the truth about the wrong cohort.

**One Health opened with three written questions.** Panic Mode serves two bands
and nothing else — transcribed from a real paper, or written from what a senior
cohort marked — so a subject's whole cram is decided by `panicRank`. The 46 One
Health questions ingested from the Mid 86 compilation carry their
`อิงแนวข้อสอบ` marker in **`examOrigin`**; `isExamAlignedQuestion` read `tags`
and `verified` only. So all 46 ranked 2 and were filtered out, the subject's
seven past-paper MCQ are final-scoped, and what survived a midterm cram was
three short-answer questions. The detector now reads all three fields, which is
where the marker has actually been written across successive ingests. One
Health midterm Panic: **3 → 49** (39 MCQ, 5 short, 3 matching, 2 T/F). It is
the only subject that moves — every other bank already put the marker somewhere
the detector looked, which is exactly why this stayed invisible.

**Equine Repro looked like it still carried final.** It does not: all 28
questions in its midterm Panic pool resolve to midterm. What Palm was reading
is `examOrigin`, printed verbatim by `QSourceChip` — twenty of those questions
say **"Equine reproduction final exam"**, because that is the paper the senior
cohort sat. His own message contains the answer he was checking against
("หรือเนื้อหาไฟนอลรุ่นอื่นมันตรงรุ่นผม"), and it is yes: the pregnancy block
moved papers between cohorts, and the PDF audit resolved those ids one by one.
The origin string is evidence and is never rewritten. Instead:

- `originPaperNote()` in `src/lib/exam-scope.js` compares the paper the origin
  names with the paper the question resolves to, and returns a sentence when
  they differ. `QSourceChip` prints it under the source line.
- `Question.jsx`'s scope chip read the raw `examScope` field, so a question
  taking its paper from its topic printed **nothing** — leaving an origin that
  names the other paper as the only scope signal on screen. It now resolves
  through `scopeOfQuestion()`, so every scoped question says which paper it is
  on beside the origin that names the other one.

**One Health WAS re-read, and its split is confirmed by the faculty's own
timetable** on page 2 of the PDF. Six lectures sit before the midterm block of
21-25 ก.ย. 69 — role of vets, One World One Health concept, emerging and
re-emerging diseases, global activity network, communication skills,
transdisciplinary collaboration — and the bank's 107 midterm questions sit in
exactly those six topics and no others. The seven One Health **past-paper** MCQ
are all risk analysis (exposure assessment, risk characterization), which is
the 7 ต.ค. lecture, AFTER the midterm: correctly final-scoped, and the reason a
midterm Panic could never reach them. The three written questions on pages 5-6
are ingested as 108000 / 108002 / 108004. Nothing is missing from this paper
that the split would explain.

**One concrete gap, found and NOT closed:** page 7 carries a senior's note that
the emerging and re-emerging diseases lecture was examined with **17 ถูกผิด**
items. `oh-disease-prevention` holds 2 T/F. That is a specific ~15-question
lead for the next ingest, with the source page named.

**Not re-audited this round:** Avian Med, Milk Hygiene and Food Industry MID 86.
Usage was at 3% and the choice was between shipping the two fixes with One
Health verified or starting three audits that could not finish. Present state
for whoever picks it up: avian-medicine 329 (306 midterm, 95 panic),
milk-meat-hygiene 450 (450, 240), food-industry 154 (104, 67).

## 2026-09-16 — 5.103.1: the count and the set agree again (Claude)

5.103.0 taught `buildExamPool` which paper a question sits and left **ten of the twelve count
tables in q-counts.js not knowing**. Every question count outside the exam session reads one of
those tables, so for a day the app promised one number and opened another. Palm found it in
under an hour: "จำนวนข้อ Panic mode ตรงแสดงกับกดเข้าไปจริงก็ไม่ตรง ... One health ทำไมเหลือแค่
ข้อเขียน และทำไม Equine Repro มี final ติดมาด้วย". A four-lens sweep measured **25 divergences
across 54 places**; `counts.md`, `panic.md`, `regressions.md` in the sweep output carry the full
tables.

**The rule this leaves behind: a number printed beside a button that opens a session must be
computed by the same rule the session applies.** `Q_*_BY_SCOPE` tables are keyed by the phase id
a student can actually pick (`'1-mid'`…`'2-final'`) so BOTH the term and the paper are in them —
a table that knew only the paper still promised year 4 1,772 where a midterm serves 139.

Fixed:
- **The never-empty guard was the real leak.** It is kind when the student NAMED a subject or a
  topic and the opposite across all subjects: a subject with nothing for the chosen paper had
  its whole other-paper bank handed back. A midterm cram served all 100 epidemiology questions
  (no midterm paper), all 47 vet-juris, all 97 POA (no written paper at all) and every com1
  topic. Now `if (onPaper.length || !named) pool = onPaper`.
- Panic card: `Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE`, one-health 10→3 printed and served, 28=28
  for equine-repro. `panic-pool-size.test.mjs` now RECOMPUTES both sides from the live bank for
  every subject × both papers; the old test matched a string, and a string cannot notice that a
  card says 10 and a session gives 3.
- Home subject cards, topic cards and their collection roll-ups, the phase screen's "N วิชา"
  (it counted epidemiology under กลางภาค on the very screen that explains phases).
- **equine-repro per-question overrides applied, 44 questions** — foaling presentation, dystocia
  timing, red bag, teat waxing are final. These were resolved by the PDF audit during 5.103.0
  and I deferred them while reporting the work finished; that deferral is what Palm saw.

Checks: `npm run gate` alone — build, lint:all, unit 993/0, **e2e 536 passed / 0 failed in
6.0 min**, the first clean four-browser run of this arc.

**5.103.2, found on production not in a test:** the subject-select screen (`/app/study`) was
still printing whole-subject counts — ระบาดวิทยา 100 under กลางภาค for a course with no
midterm, and รวมทุกวิชา 2,986 where the phase serves 2,437. It now takes `selectedPhase` and
reads the scoped table; the all-card keeps its no-bank-scan guarantee. **The lesson: after a
pool rule changes, walk the real screens on production, because the four surfaces a test
names are never all of them.** Gate: 538 passed / 0 failed.

Left, deliberately, and none of it sits beside a session button:
- The landing proof band (5,471 / 1,736) is a bank figure; max reachable in one phase is 3,040.
- The year card on the year screen, where no phase is chosen yet.
- `computeSubjectProgress` denominators and the "เรียนไป X%" chips.
- `Q_CURRENT_SCOPE_COUNTS` buckets on the raw `question.examScope` field rather than
  `scopeOfQuestion()`, so it is exact today and will drift the first time a question inherits its
  paper from its topic. Switch it when it is next touched.
- `SRSessionView` receives `selectedPhase` and ignores it entirely.

## 2026-09-16 — 5.103.0: กลางภาค and ปลายภาค become two different piles (Claude)

Palm: "การแยกกลางภาคกับปลายภาค มันยังแปลกๆอยู่ เหมือนมันปนกัน ... แยกให้ชัด สร้างมาตรฐานและ
ความมั่นคง ... เราไม่ได้มีแค่ข้อสอบ choice อย่างเดียว". He was right on every count.

### What was actually wrong

`PHASE_SEMESTER = { '1-mid': 1, '1-final': 1, ... }` — mid and final mapped to the SAME
semester and `buildExamPool` filtered by nothing else, so **the two picks served an identical
pool, 2,641 questions, id for id.** `examScope` existed but only 218 of 5,387 questions carried
it and the pool never read it. The separation was a label.

### The model (now Critical Rule 10)

Scope belongs to the TOPIC; a question inherits it. `src/lib/exam-scope.js` resolves
question → topic → subject → faculty timetable → unknown, and **unknown is kept**, never
filtered out. Three consequences worth remembering:

- The timetable settles a whole subject for free when it sits one paper: epidemiology has no
  midterm, so its 100 questions can never pad a midterm set. POA sits no written paper
  (`examScope: 'continuous'` on the subject) so it pads neither.
- **Absence is not a fact.** The first cut read "not in the timetable" as "no exam" and
  silently removed the year-4 COM III/IV/V banks and VCA — 2,000 questions — from every
  phase-filtered pool. Only an explicit declaration means continuous.
- The filter runs AFTER the topic narrowing. Before that, picking หัวข้อ fiqc-aquatic (marked
  "ไม่ออกสอบ — handout only") under เทอม 1 กลางภาค returned zero questions; now the never-empty
  guard hands the student what they named.

### The data, and how it was decided

424 topics across years 4 and 5 now declare their paper, from the faculty timetable, the
lecture dates either side of the midterm week, and the senior compilations themselves.
Result for year 5 term 1: midterm 2,449 / final 1,125, with 1,663 midterm-only and 339
final-only. Year 4 term 1: 139 / 303.

Two cross-checks changed a verdict, and both are the rule in action:
- `milk-cleaning` was mapped `final` from the lecture list, but the Mid 86 paper Palm supplied
  examines it — 10 of the 25 questions in its set F are CIP sequence, the 4-hour stop rule,
  85 °C sanitising, the phenol coefficient table. **A real past paper outranks a lecture date.**
- `zoo-epi-approach` and `zoo-eid-wildlife` had evidence pointing both ways (bank header says
  midterm; Paisin taught Emerging threat diseases on 14 พ.ย.). Contested evidence takes
  `'both'` — visible in either pile, hidden from neither. Never coin-flip a split.

### The 15 PDFs, read page by page

Eight parallel auditors read every page of the compilations Palm sent. **260 questions were
missing from the bank** and are now in `questions-mid86-<subject>.js`: aquatic-clinic 62,
equine-medicine 59, one-health 46, zoonoses 29, avian-medicine 27, food-industry 19,
equine-repro 8, swine-clinic 7, milk-meat-hygiene 3. Not only MCQ, as he insisted: 24 short
answer, 8 true or false, 5 matching, 2 fill-in. Bank 5,322 → 5,647; the whole corpus now reads
mcq 5,293 / tf 200 / short 71 / match 49 / fill 29 / essay 5.

### Guardrails, so it cannot drift back

- `npm run lint:exam-scope` (in `lint:all`): fails when a topic in a both-paper subject does not
  declare its paper (budget 0, may only shrink), when a scope contradicts the timetable, and
  when `exam-papers.generated.js` has drifted from `EXAM_SCHEDULE`.
- `npm run regen:exam-papers` after the faculty timetable changes.
- `examScope` was removed from the all-or-nothing prediction-metadata bundle — folding the two
  axes together would have invalidated 5,169 questions against the standard ratchet the moment
  labelling began.
- `tests/unit/exam-scope.test.mjs` (5), plus the phase-copy pin in `audit-sense-fixes` which now
  also asserts `buildExamPool` applies the filter, so the subtitle cannot become a lie again.

### Left for the next batch

- **Per-question overrides.** Several auditors resolved split topics down to individual ids
  (equine-repro `eqrepro-pregnancy` 35 questions split 24 midterm / 9 final / 2 both,
  `eqrepro-surgery`, `eqrepro-ai`). The topic split is correct without them; these refine it.
- **com1 has zero midterm questions.** Commit b2b78c51 added 26 midterm TOPICS but its diff to
  `questions-com1.js` was three cosmetic edits — the questions were never applied. A real gap.
- **Four dairy topics are filed under swine-herd** (mastitis-subclinical-scc,
  contagious-vs-environmental-mastitis-pathogens, milking-machine-pulsation,
  milk-letdown-oxytocin), all sourced from the same `Udder Health.pdf` deck that feeds
  herd-health-rum. They look cross-filed.
- 228 topics in years 1-3 subjects are unscoped; they sit outside the current timetable, so the
  lint does not hold them yet.

Production proof (v188, promoted 18:22Z 2026-09-16, Smoke run 35005739645 success): on
vetmock.vercel.app with year 5 selected, the config screen for ทุกวิชา reads **"มี 2,443
ข้อในชุดนี้" under เทอม 1 กลางภาค and "มี 1,118 ข้อในชุดนี้" under เทอม 1 ปลายภาค.** The same
screen showed the same number for both picks before this release. (2,443 and 1,118 rather than
the 2,449 and 1,125 the pool holds: the config default asks for the mcq category, which leaves
out the handful of new written items.)

Checks: `npm run gate` alone on the final tree — build, lint:all (every generated artifact
re-checked), unit 992/0, e2e 536 passed / 1 failed in 6.1 min; the one failure is the known
Firefox `NS_BINDING_ABORTED` on `page.reload` in system-polish, which passes alone in 7 s.
`lint:question-standard` 0 defects across 5,647 questions, `lint:exam-scope` 0 unscoped topics.
Four earlier gate runs failed on generated artifacts going stale behind the new questions
(glossary links, written-questions, q-counts, stats/README) — **after a question ingest,
regenerate registry, q-counts, delivery, written-questions, glossary-related, citation-index,
conflict-summary, notes-registry AND `npm run stats -- --write` before starting the gate.**

## 2026-09-15 — 5.102.1: the fourth auditor's twelve, eleven fixed (Claude)

The auditor over the 09-13/14 shipments reported after 5.102.0 had shipped. Fixed here, each
re-checked by hand: glossary "ข้อที่เกี่ยวข้อง" links opened 67 blocked questions in 39 entries —
`regen-glossary-related.mjs` now skips `!isQuestionDeliverable` (2,913 → 2,846 links) and the
`onlyIds` branch of `startExam` applies the gate too; a Panic set started from the exam-mode
config screen ran on one paper clock (the hook's `sessionBudget` prop is derived from `mode`
STATE and the handler sets mode and starts in one go) — `startNewSession(picked, firstTime,
{ sessionBudget })` names the clock and the in-flight record reads `session.clockKind()`;
ScreeningBench: a dial move after a committed guess re-entered guess mode (`setGuess(null)` with
`setCommitted(null)`), and guess mode leaked the answer through the 2x2 table, the
false-alerts-per-hit row and the curve marker (all gated on `!hidden`); BenchView เริ่มนับใหม่
remounts the checks (`resetCount` in the key); SummaryModal's observer used a −8% bottom margin
so the last block never revealed above ~1,320px viewports; `MissCoach` is keyed by question;
`badges.js` read `h.id` where rows carry `questionId`, and `perfect` read the rounded percent;
`agent-action.js` budgeted the shared LLM key at 600 (now `LLM_DAILY_BUDGET`, test pins it);
the game shield's `=== 0` never hit on fractional frames; `NextActionCard` gets `lastExamDate`
so `exam-finished`/`holiday` Mochi can appear.

Seen on production 5.102.0 (`/app/admin` as Palm, real data: 29 accounts, 140 attempts in 30 days,
8 exams, the people table with emails and sign-ins): the accuracy percentages in all three tables
rendered as an 8px sliver — `.ad-bar > span` styled the number span like the track; now
`:first-child`. And the online tile read "realtime ไม่ต่อ" after a reload: `useOnlineCount` set
`error` on the first CHANNEL_ERROR and never retried; it now re-subscribes up to three times.

Left open: `stats.phaseCompleted` is still set nowhere (the `exam-finished` badge is unreachable);
set it in `PhaseWrappedView` from the phase's last paper date. The 5.102.0 open list stands.

Checks: unit 987/0 (badge, clock and route pins repinned to the new truth); `npm run gate` alone on
the final tree — build, lint:all, then e2e 531 passed / 5 failed / 3 did not run in 9.4 min, and
**all 8 pass alone on the same dist in 35.6 s** (`--last-failed`): the five were the same load
shape as gate 2 (a 30 s journey test running out of budget at its last click, the 120 s
whole-app 320px audit, two wiki chunk loads). The offline-banner failure did not recur. Glossary
links regenerated: 143 entries, 2,846 links (was 2,913).

## 2026-09-15 — 5.102.0: the back-office, for one account (Claude)

Palm: "หลังบ้านให้เฉพาะผมคนเดียวเข้าไปดูได้ ... มีสถิติทุกอย่าง ... ยันไปว่าใครเคยทำผิดข้อไหนบ้าง
เผื่อจะเอาไปปรับปรุงคุณภาพโจทย์ โดยไม่ต้องรอคนแจ้ง".

### The gate is the database, not a flag

- `supabase/migrations/20260915121049_admin_backoffice_v1.sql` (applied to prod as
  `admin_backoffice_v1`): `admin_users` (RLS on, zero policies, every grant revoked — REST cannot
  read or write it), `is_admin()` (SECURITY DEFINER, so it may consult that table), and six
  jsonb readers — `admin_overview(days)`, `admin_questions(days, min_attempts, lim)`,
  `admin_question_detail(qid)`, `admin_users_list(days)`, `admin_user_detail(uid)`,
  `admin_subjects(days)` — each `raise exception 'forbidden'` (42501) unless `is_admin()`.
  `admin_history(days)` flattens `user_data.history` and is executable by nobody but the owner.
  Verified with a stranger's JWT claims: 42501 on every call, no rows; as Palm: data.
- The client never decides who may look. `feature-registry` `adminOnly` + App's `isAdmin`
  state (from `checkIsAdmin()`, `src/lib/admin-api.js`) only decide whether the door is drawn.
  Adding an admin is one row in `admin_users`; no deploy.

### The page — `src/views/AdminView.jsx`, `src/styles-admin.css` (`.ad-*`), `/app/admin`

- Order: range chips (7/30/90/ทั้งหมด) → six KPI tiles (the ink one is "โจทย์ที่ควรดู", the count
  of flagged questions) → one-series daily bars with a hover tooltip → the questions table,
  worst-first → subjects → people. The questions table is the point: a row opens the options
  with the keyed answer marked and how many chose each, who got it wrong and how often, and
  "เปิดข้อนี้" through `openQuestionById`. A person opens their subjects, the questions they
  got wrong, and the exams they submitted.
- Chosen-option counts come from `study_event_batches` attempt events (only ~60 so far —
  history rows carry correct/incorrect, not the option), so the distribution is thin until
  the event stream grows. The page says so instead of showing an empty bar.
- Flags are pure, `src/lib/question-quality.js` (6 tests): always-wrong (≥3 attempts, 0
  correct), high-wrong (≥5, ≥70%), most-users-wrong (≥3 people, ≥75% of them), one-distractor
  (≥4 answer events, one wrong option ≥60% — needs the bank's key, so it appears once the
  registry has loaded). Blunt thresholds on purpose: a wrong key on 8 attempts must show.
- Stems come from the local bank (`BANK_REGISTRY`, every bank loaded lazily on the page);
  the database stores ids only. Field names in the view were checked against
  `pg_get_functiondef` of the six functions before the first render.
- Data at build time: 26 users with history, 10,805 rows, 1,974 distinct questions. Top of
  the 30-day list: 4012 (poultry) 8/8 wrong by 2 people; 2051 and 2210 (practrum) 6/6 by 4.
- The old `src/views/AdminView.jsx` was a Clerk-era stub, never routed, with `checkIsAdmin`
  by "email contains admin" — replaced. **App.jsx had a safety net bouncing view `'admin'` to
  Home** (leftover from that stub); it is removed from the list, or the new view would have
  gone straight back to Home. Registration followed the five-place rule above; `admin` is
  cover index 35.

### v2 and v3, the same evening

- Palm: "จำนวนคนออนไลน์เอาไปใส่ admin ก็ได้ รวมถึง changelog ทั้งหมด ใส่ให้ครบ ให้หน้า admin
  powerful ที่สุด". `admin_backoffice_v2` adds `email`/`last_sign_in_at`/`providers` to the people
  list (joins `auth.users`, `auth.identities`) and `admin_extras(days)`: sign-ins in range, recent
  sign-ins, identity providers, 40 recent exams, `daily_q_pulse`, event kinds, the client error
  counts (`private.client_error_counts`, 14-day rolling, written by `record_client_diagnostic`),
  contributors, submissions, groups, what people keep (bookmarks/notes/SR/custom/checklist/PDF
  ink), library by status/kind/year, imaging, and a row count for every table. The page renders
  all of it in sections with a sticky jump bar, plus the online count from `useOnlineCount`
  (anonymous presence keys only — never track usernames, presence state is readable by every
  client) and the whole `CHANGELOG` (168 releases) searchable in `<details>` rows.
- `admin_backoffice_v3` came out of the audit: v1 cast unvalidated JSON, so one malformed
  `user_data.history` row (a 20-digit questionId, a non-boolean `correct`, a history that is not
  an array) would have raised inside every admin reader. Every cast is guarded now; days are
  bucketed in Asia/Bangkok and a range of N days is N calendar days ending today, so the bars
  and the KPI agree. All three files are in `supabase/migrations/`.

### Bug hunt, 2026-09-15 (four read-only auditors, then verified by hand)

Fixed in 5.102.0:

- Home: the class chip contradicted the countdown on exam days (`getClassesForDay` now returns
  `[]` inside `SEMESTER.midtermPeriod`/`finalPeriod`); after the last class it says
  "พรุ่งนี้ 09:00 น." (`getNextClass`, 3 tests) instead of vanishing; the ซ้อมใกล้สอบ card names the
  date instead of a day count that disagreed with the hero every morning; `hasQuickChips` lists
  the first-load hint. Countdown: `useRollUp` rolls once (a `first` ref), `sitting` derives from
  the live tick. Wordmark holds on `:focus-visible` too.
- Landing: the skip link never showed (`.lp-skip:focus` lost specificity to `.lp-root a.lp-skip`;
  now `:focus-visible` at the same specificity, above `--z-nav`); a focused marquee chip could sit
  in unreachable negative overflow (`:focus-within { animation: none }`); "most past-paper
  questions" ranked by Panic counts (past + senior-marked) — now `Q_PAST_PAPER_COUNTS_BY_TOPIC`
  summed per subject, 37 subjects not 38; the headline stat is the visible total (5,211) like
  the chips beneath it; EN countdown labels/range come from the dict; five stray strings moved
  into the dict; inert showcase cards are no longer focusable; `facultyExamWindow` and
  `msUntilExam` parse 'YYYY-MM-DD' locally (UTC-midnight parsing is a day early west of UTC).
- Storage/sync: the daily sweep deleted every `vmx-todays-q-<date>` but today's, which the
  daily-Q streak (365-day walk) and the 7-day share grid read — streak 7 became 1 on every
  boot. The family now keeps a year; the pulse flag stays one-day. `hydrate` still wrote the
  old `{base, value}` record after replaying an unpushed outbox (3x history in one setItem) —
  now `changeRecord`. `UPDATE_UNSAFE_VIEWS` gains results/review/config/topic-select: none has
  a URL, so an update applied there reloaded onto Home with the score screen gone.
- `useOnlineStatus`: the HEAD ping was starved by the service worker's first-install precache
  (a 200 arriving after the 4 s abort) and two such timeouts showed "ออฟไลน์" on a healthy link
  — the cause of the `core mobile journey` e2e failing locally under load. A timeout now
  counts as 'slow' (three strikes while `navigator.onLine`), a refusal as 'down' (two), and the
  ping asks for `priority: 'high'`.

- Exam flows (fifth auditor, the 09-13 audit-fix batch): `replayQuestions` (pins, notes,
  palette hits, admin "เปิดข้อนี้", the Home 1-question button) overwrote a parked, unsubmitted
  mock under the same inflight key without a word — it now reads `readOwnedExam` through
  `eventContextRef` (the callback is memoised once) and asks first; `openQuestionById` applies
  `isQuestionDeliverable`, so a pin from before a key was held back cannot open it; the Home
  wrong-count chip used array order while the pool used latest-by-date (`stillWrong`), so two
  synced devices saw a number that did not match the set — the chip now calls `stillWrong`;
  ResultsView's 100/80 messages read the rounded percent (199/200 said ถูกทุกข้อ) — now exact
  counts; the PDF reader's `wheel` → `stop` cancelled the zoom anchor on every ctrl/meta wheel
  event, which is exactly what a trackpad pinch sends.

Left open, with the analysis (all pre-existing):

- `openQuestionById`: a failed `loadQB()` is swallowed and both callers then say the question
  was removed ("ไม่พบข้อนี้ในคลังแล้ว") — offline or cold cache. Return 'unavailable' and route it
  to `offerBankRetry()`.

- Outbox cap (`storage-gc.js` keep-4 + `app-lifecycle.js` boot sweep): when the dataset journal
  cannot be written on a nearly full device, the op record is the only copy of an answer and the
  cap can delete it. Fix: delete records only after the commit that absorbed them succeeded
  (the anonymous path already does), or stamp `committedAt`.
- `controllerchange` reload (`app-lifecycle.js`) is not re-checked against the current view: a
  student who taps into an exam within the activation window is reloaded mid-exam (autosave
  recovers it). Fix: keep the flag armed and reload on the next `vmx-view-change` when the view
  is unsafe.
- `admin_questions`/`admin_question_detail` `jsonb_each` every event batch per call — fine at 60
  events, O(all events) later; add a range filter when the stream grows.
- Dev-only: StrictMode's double render flips the once-per-load flags in `ExamCountdown` and
  `Wordmark` during render, so `npm run dev` never plays the entrance; flip them in an effect.

Refuted or by design, do not re-report: `useNow` cleanup and drift; `splitCountdown` clamps;
the window rolls to the final at 11:30 on 25 Sep; `admin_users` reachable by nothing but
`is_admin()`; every admin reader raises before any read; `service_role` gets `forbidden` too
(`auth.uid()` is null — a footgun, not a hole); all i18n keys exist in both locales; the
marquee copy is `aria-hidden`; `home-desktop.jpg` is exactly 2x its attributes.

### The gate, this time

- The first full run had 14 failures: 9 Firefox atlas/motion GFX crashes (RenderCompositorSWGL,
  the known local flake), 1 Firefox teardown hang, 2 load flakes that passed alone (library PDF
  render, WebKit theme toggle), and `core mobile journey` on chromium + WebKit — the offline
  banner above (a real product finding, fixed). Four auditors and a Firefox rerun were running
  beside that gate; the machine was oversubscribed. **Run the gate alone.** It also outlives the
  Bash tool's 10-minute cap: start it detached (`Start-Process cmd /c npm run gate > log`) and
  watch the log.

### OG covers: a runner again

- `bench.png` re-rendered: its legend said "ปลุกผิด", a word that does not exist — now
  "ผลบวกลวง"; its description no longer says "การปลุก". `admin.png` is index 35. Both come from
  `work/og-covers-20260915/make-og.mjs <cover.html> <out.png>` (Playwright, Sarabun TTFs
  inlined as data URIs — `page.setContent` cannot load `file://` fonts, and a PDF writer cannot
  shape Thai marks). `work/` is untracked, so the runner lives outside git; it is 30 lines.

### The countdown after the exams (Palm asked)

- `examWindow` takes the first paper whose end (start + duration) is still ahead. After the
  last midterm paper it rolls to the final by itself; in the two-month gap the day strip hides
  (`STRIP_MAX_DAYS`) and only the day count shows; after the final it returns null, the card
  renders nothing and `NextActionCard` gets `examContext={false}`, so the old chip returns.
  The landing's `facultyExamWindow` is null after 4 Dec 17:00. No date is hard-coded.

### Checks

- Gate 2 (`npm run gate`, detached, alone, on the final tree): build (32 routes prerendered, 35
  covers), lint:all (contrast light/dark across five palettes), unit 987/0, e2e 529 passed /
  9 failed in 11.4 min. The nine (wiki share URL, cold video shelf, motion-kit WebGL fallback,
  wiki chunk retry, exam-clock resume, exam-scope midterm, VCA share set, Mochi presence, Firefox
  atlas panes) were all timeouts in one stretch of the chromium phase, and **all nine pass alone
  on the same dist in 18.8 s** (`npx playwright test --last-failed`). Every test in the suite is
  green on this build, in one run or the other. Gate 1 earlier: 525/14, triaged above. If the
  local flake rate keeps this shape, cap local workers at 4 in `playwright.config.js` (CI runs 2).
- Preview after the build: `/app/admin` signed out shows the locked card and fires no RPC; Home
  shows "พรุ่งนี้ 08:00 น. CLI PROB SOLV COMP, VET6 807" in the evening; no horizontal overflow at
  372px; the two console errors (a 404 and a 401) are the same on Home and predate this work.
- Production 5.102.0: Smoke run 34976425333 success, `sw.js` v186 at 13:54Z; `/app/admin` opened as
  Palm in his Chrome: real data (29 accounts, 140 attempts / 137 distinct in 30 days, 8 exams, the
  people table with emails and sign-ins, subjects, the daily chart). Production 5.102.1: Smoke run
  34980143541 success, v187 at 14:28Z; sidebar reads v5.102.1, the accuracy percentages are in the
  table as text ("74%", "56%", ...) beside the bars, the online tile reads "แท็บที่เปิดอยู่ตอนนี้"
  (connected). Screenshots of that tab timed out (CDP) while it loaded its 82 bank chunks; text
  queries were the proof.

## 2026-09-15 — 5.101.0: the landing rebuilt, and the gate rule that stops Smoke failing (Claude)

### The rule, first

Two consecutive pushes failed the Smoke gate (5.100.0 on every browser, 5.100.1 on Firefox
only). Palm: "รอบนี้และรอบต่อ ๆ ไปต้องห้าม failed อีก ต้องแก้ให้หายขาด". The fix is not a test
tweak, it is the process: **before every push, run the full suite exactly as CI does —
`npm run build` then `npx playwright test` with all four projects (chromium-desktop,
chromium-mobile, webkit-mobile, firefox-desktop) — and push only on green.** A subset is not a
gate: 5.100.1 passed the three browsers I ran and failed the one I skipped. It takes ~13 min;
run it in the background and do other work. `npm run gate` chains build, lint:all, unit and
the full e2e for exactly this.

- Trap: `gh run list --commit <sha>` returned nothing here, so a watcher keyed on it reported
  "not started" while the run had already failed. List without the filter and match `headSha`.
- `mobile-compat.spec.js` audits every surface, the landing included, at 320/390/667 in every
  engine: an element escapes when its rect leaves the viewport, UNLESS an ancestor is a real
  horizontal scroller (`overflow-x: auto|scroll`, wider than its box, itself inside the
  viewport). `overflow: hidden` is not a scroller — a clipped child still reports its rect.
  Firefox measures Thai and mono text wider than Blink/WebKit, so a row that just fits in
  Chromium overflows there. The phone ticker now wraps instead of clipping; the marquee lives
  in an `overflow-x: auto` viewport with the scrollbar hidden.
- `getByRole("status")` in connected-study is now scoped by id: the sync/offline notice is a
  second status region, and a network blink during a run made the bare query ambiguous.

### Landing, stage 1 (`src/views/landing/*`, `src/styles-landing.css`)

Seven sections, none alike: hero (title, live CUVET86 midterm countdown from the timetable,
the real question card), proof band (three counted-up numbers from q-counts and a marquee of
real subjects with real counts, each a working link), three things (01/02/03 with a live piece
of the product each — top past-paper subjects from `Q_PANIC_COUNTS_BY_SUBJECT`, an explanation
in the app's own shape, the time chips), Panic band (dark, the real next paper and clock),
subjects (kept), lab (kept, film comes up like a light box), your home (a real screenshot at
`public/images/landing/home-desktop.jpg`, captured from the app), CTA with Mochi.

Cut, because they were invented: trust bullets, problem cards, how-it-works, the 72% gauge,
the 68% dashboard, the weakness cards. Copy rewritten in both locales — นิสิต not นักศึกษา, no
section labels, no emoji as icons, no middle dots. The brief with the six art prompts is at
claude.ai/artifact/VREPximoX2tCQSKYZ5gBn8; slots A1 to A6 are marked in comments in
LandingBody.jsx and the layout stands without them.

e2e contract kept: `#progress` exists and is a nav target, `.lp-navlink[href="#progress"]`,
the bookmark button with its svg in the hero, `.lp-nav-burger`, `#lp-mobile-menu`, the cookie
dock, and no `.lp-rail`/`.lp-spotlight`. One contract CHANGED on purpose: two smoke tests find
the landing by its h1 text, and the regex now reads `Past papers from the years above
you|ข้อสอบเก่าของรุ่นพี่`. Change the headline again and change that regex with it.

Full-suite result before this push: 526 passed, 13 failed on the first run — 8 were that regex
(fixed, then green on all four projects), 1 was a WebKit CORS wobble on the imaging stub, 4
were local Firefox crashes (`RenderCompositorSWGL failed mapping default framebuffer`,
`browserContext.close` protocol errors). Every one of the 13 was re-run and passed; the Firefox
matching-smoke test 3 of 3 on both engines. Local Firefox under parallel load is flaky on this
Windows machine in a way CI's Linux/xvfb Firefox is not; when a Firefox-only failure shows up
here, re-run it in isolation before treating it as a regression.

Three corrections from Palm during the build, all kept as rules:

- **No cohort on the landing.** The first cut counted down to "สอบกลางภาค CUVET86" and named the
  first paper. "ปีอื่นเข้ามาเห็นละ จะไม่งงหรอ" — a signed-out reader has no year. The hero and
  the Panic band now count to the FACULTY exam week from `SEMESTER.midtermPeriod`/`finalPeriod`
  (`facultyExamWindow` in exam-countdown.js: every year sits the same week, 08:30 on the first
  day to 17:00 on the last, rolls to the final, null after), and the header/login context chips
  lost their "ปี 5". The year-specific countdown stays on Home, where a year is known.
- **Thai display type.** "ดูเรื่องฟอนต์และวรรณยุกต์ดี ๆ อย่าให้ทับหรือชนกัน". Headlines had
  `line-height: 1` with `letter-spacing: -.03em` inherited from the design handoff; at 48px the
  ุ of "พรุ่ง" sat on the ึ่ of "ครึ่ง" on the next line. Fraunces has no Thai, so those lines
  are Sarabun and take Sarabun's metrics: **line-height 1.2 and no negative tracking** on any
  heading that can carry Thai. Verified with 2x element crops, not a full-page screenshot.
- **Contrast is audited per palette.** `audit:contrast -- --landing` runs light and dark across
  ocean/plum/cherry/mono/forest. `--clr-gold` becomes a mid grey in mono and an olive in
  forest, so gold digits on a dark band measured 2.3:1 there. On an inverted (ink) panel use
  `--clr-gold-soft` in light themes and `--clr-gold-text` in dark ones — both are the light
  member of the pair in every palette — and keep the Panic band dark in dark mode
  (`--clr-surface-2`) instead of letting the ink/bg inversion turn it cream.

## 2026-09-15 — 5.100.1: the Smoke gate caught the countdown on phones (Claude)

5.100.0 failed `connected-study.spec.js:202` on every browser: on a 375x812 phone the first
subject card must sit at y < 650, and the full countdown card (number, clock, caption, strip)
is ~380px tall there, so the card landed at y = 830. The alias never moved; nobody saw it.

- Phones now get a one-row ticker (label, days, clock) at 56px including margin. The two-line
  compact version I tried first still left the card at y = 680 — measured locally with the
  same test before pushing this time (`npx playwright test tests/e2e/connected-study.spec.js
  -g "core mobile journey" --project=chromium-mobile --project=webkit-mobile`).
- **Rule this encodes:** anything added above the subject cards on Home has to be checked
  against that assertion on a phone BEFORE pushing. A green desktop screenshot says nothing.
- The other failure in that run (`pdf-annotate.spec.js:185`, ink pixels 0) passed on retry and
  the run tallied it as flaky; it is unrelated to this change.

**Is a deploy safe for someone mid-exam?** Yes, by construction, checked in code:
`app-lifecycle.js` only sends SKIP_WAITING on `beforeunload`/`pagehide` or on an explicit
`vmx-sw-apply-update`, and `App.jsx` refuses to apply while the view is in
`UPDATE_UNSAFE_VIEWS = [exam, sr-session, race, pomodoro]`. And the alias only moves after
Smoke passes. Palm asked because he saw someone start a paper; the DB at that moment showed
0 exam results and 0 sync writes in the previous hour (last activity 2026-09-14 16:51 UTC),
so the presence he saw was either an anonymous session or his own tab.

### Queue Palm has asked for, in order (he asked not to drop any of it)

1. **Landing redesign, stage 1** — brief with section plan, Thai copy rules and six art
   prompts is published (claude.ai/artifact/VREPximoX2tCQSKYZ5gBn8). Stage 1 = new copy
   (นิสิต, not นักศึกษา), cut the five fake sections (72% gauge, fake dashboard, weakness
   cards, problem cards, how-it-works), add the live countdown to the hero, a real-subject
   marquee, 01/02/03 with real app screenshots, motion. Art slots reserved for A1 to A6.
   Constraints from e2e: keep `.lp-nav-burger`, `#lp-mobile-menu`, `.lp-mobile-menu-link`,
   `.lp-sound-toggle`, `.lp-theme-toggle`, `.lp-navlink[href="#progress"]`, the cookie dock
   classes, a button matching /เริ่มฝึกเลย|Start Practicing/, and NO `.lp-rail`/`.lp-spotlight`.
2. **Admin back-office for Palm only** — shipped in 5.102.0 (section above). Left for later, not
   asked: the submission review queue and bank/panic-pool health are not on the page yet.
3. Art assets arrive from GPT Image → stage 2 of the landing (drop-in), then photos → stage 3.
4. Still open from earlier sessions: five past-paper questions that could not be recovered
   (8040, 8044, 8047, 8049, 70037), and explains that cite a document mid-sentence.

## 2026-09-15 — 5.100.0: the exam countdown, and a wordmark that plays with words (Claude)

Two asks from Palm in one message: "ตรง sidebar ที่เขียนว่า VetMock ... สลับไปมาระหว่าง Mock Love
CU 86 87 88 89 90" and "นาฬิกานับถอยหลังกลางภาคที่จะถึงด้วย ลองออกแบบดูเอาสวยๆ creative ๆ".

### Wordmark cycle — `src/components/Wordmark.jsx`, `cycle` prop, sidebar only

- The wordmark was already two voices (bold ink lead, rose italic tail). Every phrase keeps that
  split — `Mock`·*Love*, `CUVET`·*86* — so the brand changes WORDS, never typeface. The list is
  one array (`PHRASES`); the cohort numbers are every year in the building and go stale
  together with `YEARS.current` in curriculum.js.
- **Corrected by Palm mid-build, twice:** I had written "CU 86". A cohort is written CUVET86,
  one token — "มีแต่ CUVET86 อย่ามั่ว". I then over-corrected and dropped "CU Vet" as well; that
  one is the faculty's own name and is fine — "CU Vet ก็ถูก แต่ CU86 ไม่ถูก". Never abbreviate a
  name the faculty already has a spelling for, and fix exactly what was wrong, not its neighbours.
- All phrases sit in ONE grid cell (`grid-area: 1/1`), so the button is as wide as its widest
  phrase from first paint. Measured: 145.83px before, during and after cycling. Nothing shifts.
- `backwards` fill, not `both` — same reason as the settle: a filling animation outranks a
  transition and would pin the tail, killing the hover nudge.
- Held still while the pointer is on the button (`closest("button").matches(":hover")`), while
  the tab is hidden, and never started under prefers-reduced-motion. The brand phrase dwells
  6.4 s, the wordplay 3.2 s. The first swap waits 5.2 s so it never lands on top of the settle.
- The five old `.vmx-wordmark-text > span` selectors became `.vmx-wordmark-tail`, because the
  phrase spans are now the direct children and would have inherited the italic.

### Exam countdown — `src/lib/exam-countdown.js` (pure, 5 tests) + `ExamCountdown.jsx`

- **Corrected by Palm mid-build:** the first cut showed days only, on my own theory that
  seconds are anxiety. He had asked for a countdown — "อยากให้มี หลักนาที วินาที ด้วย คุณเข้าใจ
  คำว่า countdown ไหม". A countdown counts. The clock now ticks live (hours, minutes, seconds,
  tabular, paused while the tab is hidden, owned by the component so Home does not re-render
  every second). Rule: do not narrow an ask on taste without saying so first.
- Evidence, per the routing rule: Lazyweb "one-year" (days-left number over a dot grid of
  days) and "days" (big numeral hero). Coverage for exam-specific countdowns was weak (0.43);
  those two were the useful neighbours. No 21st/shadcn — VetMock is custom CSS on tokens.
- Everything about WHEN comes from `EXAM_SCHEDULE` via `getUpcomingExams`, so it is the same
  clock as the schedule page and `shortCountdown` gives the imminent text. The window rolls
  from midterm to final by itself; a year with no timetable returns null and the hero renders
  nothing. That null is the entire year gate — nothing is special-cased per year.
- Pinned to the published ภาคต้น 2569 timetable at three moments: a week out (6 days, 9 papers,
  strip 15th to 25th, exam days 2/2/2/2/1), mid-week mid-paper (4 sat, running paper is next,
  sat days read as done, strip starts at the first paper), and the morning after (rolls to
  the final; the 58-day gap exceeds `STRIP_MAX_DAYS` so the strip hides and the number stands).
- The strip is a BUTTON that opens ตารางสอบ; the cells are decoration with `title` tooltips.
  Exam pills take `--exam-color` from the schedule entry inline, mixed with `color-mix` — no
  new hex in CSS, so hex-budget and css-tokens stay green.
- `NextActionCard` gained `examContext`; Home passes `!examWindow` so the old "สอบถัดไป N วัน"
  chip hides whenever the hero countdown shows. Two counters for one paper is clutter.
- Verified with Playwright at 1280x820 / 390x844 / dark, NOT the Browser pane: the pane is
  ~365px wide and scales a desktop emulation down to an unreadable thumbnail (again). Mobile:
  scrollWidth == clientWidth, the strip scrolls inside its own box.

## 2026-09-14 — 5.99.0: the Vet 85 Mid-86 ingest, and a guessability class no lint caught (Claude)

218 questions from five senior compilations. Swine contributed 0 — its page-5 content already
ships as 105621-105628, which is the dedup working, not a failure.

**Panic Mode pools:** equine-medicine 0 to 60, zoonoses 2 to 33, aquatic-clinic 23 to 147,
equine-repro 65 to 68. อายุรศาสตร์ม้า was the subject `panicPool` fell back to whole-subject on;
that is closed. Of the eleven subjects Panic Mode covers, only ระบาดวิทยา still has an empty pool.
The comment in `question-metadata.js` was updated with it — it names specific subjects, so it
goes stale every time a paper arrives.

### The Thai in these PDFs is corrupt in three different ways

Natural Thai runs 0.10-0.15 tone marks per Thai character. Measured before repair: Aqua 0.024,
Zoonosis 0.041, Equine Med 0.072. **Always measure this before writing anything from a PDF.**

1. **PUA** — display fonts put shifted tone-mark glyphs at U+F700-U+F71D. 19 mappings, all
   derived from context in the files (`เป<F712>นฝ<F710><F713>ง` = เป็นฝั่ง pins three at once).
2. **ASCII cmap** (Equine Repro) — `N . 0` = mai ek, `8 I` = mai tho. Safe only because all 106
   hits sit BETWEEN two Thai letters. It still turned `ซม.` into `ซม่` six times.
3. **XMind export** (Aqua p.45-52) — scrambled cmap, ~15% of Thai becomes random Latin. Not
   recoverable, and those eight pages really are mind maps with no numbered questions.
   **Corrected 2026-09-16, and the correction is the lesson:** this entry used to include
   p.17-18 and describe p.19-42 as "image-only slides", concluding "nothing exam-shaped was
   lost". Both claims were wrong. p.17-18 are legible Vet 80 midterm recall — about 13 written
   questions, 4 essay prompts and 26 fill-in items with answers — and p.19-42 are 23 pages of
   screenshots of a COMPLETE 41-item past paper with stems, five options each and the marked
   key. 62 questions were sitting there unread for two days. A page with no text layer has not
   been read until someone has LOOKED at it: render it and view the image (the 204 MB file
   exceeds the Read tool's limit, so PyMuPDF at 140 dpi into the scratchpad), and never write
   "nothing was lost" about pages that were only sampled.

Scripts: `<scratchpad>/repair-thai.py` then `repair-thai-2.py`. **Scan page by page** — corruption
was confined to 8 of 52 content pages in Aqua while the rest was clean.

### Guessable from the SHAPE of the options — 24 of 218

The old workflow's verify stage found one and named it well: "ถูกทุกข้อ in disguise". Three
distractors each carried "โดยไม่...", only the key did not, so the key is findable without
knowing any medicine. **No existing lint catches this** — there is no banned phrase, no length
bias, no position clustering.

Generalised to: no feature may split the options 3-against-1 and land on the correct one.
Checked: Latin/English term, digit, negation, compound-and-longest, trailing qualifier clause,
shared opening prefix (at 3/5/8 chars, BOTH directions). Found 11 in equine-medicine, 24 in
aquatic-clinic, 1 each in zoonoses and equine-repro.

- **Calibrate before trusting the checker.** First version flagged 19/60; two rules over-fired —
  `ไม่สบาย` is one lexical word, not a negated clause, and bare `และ` is too common in Thai to be
  a tell unless the option is also the longest. Real count was 11.
- **A tell fix reliably creates the mirror tell.** Strip `และ` from three distractors and the key
  becomes the only compound one. This happened to me once and to two agents twice each. **Re-run
  the same rule over the fix** — never accept an agent's "0 flags" self-report.
- Subtle case worth keeping: `ควรให้` and `ควรใช้` share the 4-char prefix `ควรใ`, because ใ is a
  leading vowel. Aligning three options to "start with ควร" still left 3-against-1.
- Fix by giving the DISTRACTORS the missing feature, not by stripping it from the key — a
  distractor naming a real disease teaches something; a flattened key just gets vaguer.

### One file per subject, or the registry drops it

`regen-bank-registry.mjs` registers exactly ONE export per file. The first write put all four
subjects in `questions-mid86-vet85.js`; the registry took `QUESTIONS_MID86_AQUATIC_CLINIC` and
**silently dropped 94 questions**. Both `regen:registry` and `regen:q-counts` reported success.
Caught only by recomputing the panic pools and seeing they had not moved. **Verify an ingest by
the metric it was supposed to change, never by the fact that the generators exited 0.**

### What was deliberately NOT written

A senior compilation is a study aid, not a verified source. Dropped rather than guessed:
yellow fever "2016 ระบาดใหญ่ที่จีน" (the 2016 outbreak was Angola/DRC), RVF "2019 ฝรั่งเศส"
(Mayotte), CEM as a cause of poor stallion semen quality (stallions are asymptomatic carriers),
eCG for superovulation in mares (eFSH is what works), a 42 °C hatchery temperature, and every
item whose recalled answer was crossed out or whose two source lines had merged. Also five
past-paper questions that remain unrecoverable without the original paper: 8040, 8044, 8047,
8049, 70037.

## 2026-09-14 — 5.98.2: the voice lint had a hole the width of "ตามสรุปชุดนี้" (Claude)

Found while checking the swine bank for overlap before ingesting the Mid-86 compilations.

- **29 stems referenced the compilation they were written from** — "ตามสรุปชุดนี้",
  "ตามคำตอบที่บันทึกไว้", "ที่ควรตอบในข้อบอกรอยโรค". Exactly the D1 defect Palm raised in August
  ("ทำไมคำถามถึงชอบถามว่าสไลด์นี้"), in different words. `lint-question-voice` never fired because
  its patterns named เอกสาร / สไลด์ / เลกเชอร์ / กระดาษคำตอบ and none of them says สรุป or คำตอบ.
  **A word list is only as good as the words someone thought of** — the same lesson the deck-alias
  work produced, relearned on a different field.
- Fixed all 29 by hand plus 168 explains whose opening clause narrated the source, and extended
  the lint with three pattern groups so the class cannot return. id 8503 stays: its "ในสถานีนี้"
  names an OSCE station the stem itself introduces, so it still stands alone.
- The five OSCE equine items asked "which answer scored marks at this station". Rewritten to ask
  what is clinically correct — which is what the options and explanations already supported, and
  is the thing worth knowing.

- **Near miss worth recording.** The first version of the explain fixer normalised whitespace with
  `/\s{2,}/g → " "`, which eats the blank line before "❌ ทำไมข้ออื่นผิด" — a line every explain in
  the repo has. It reported **2,380 proposals**. A blind `--apply` would have reformatted the whole
  bank while claiming to fix 52 defects. The review file is what caught it. Rule: a proposal must
  exist because a RULE fired, never because normalisation changed something; and collapse
  `[ \t]` only, never `\s`.

## 2026-09-14 — 5.98.1: a lesson is content, not a destination (Claude)

Palm, on finding "ระบาดวิทยา Module 5" in the left rail: "อย่าลืมสิเรามีชั้นปีอื่นด้วย
มันไม่ควรอยู่ sidebar ตั้งแต่แรกแล้ว". Correct, and a sharper point than the 5.97.0 one — that
release bounded the rail's LENGTH but left the wrong thing in it. **The rail is one list shared
by every year.** A single module of one year-5 subject is content; it was never a destination.

- `src/data/lessons.js` registers a lesson against its SUBJECT. `TopicSelectView` renders it as a
  study-resource card in the สื่อเรียนและโหมดสอบ tab, beside สรุปบทเรียน, VetWiki and คลังเอกสาร —
  where someone taking that subject already looks.
- `rail: false` on the registry entry, honoured by `Sidebar`. The entry stays so the command
  palette still finds it by name; `years: [5]` keeps it out of every other year entirely
  (verified: year 3 does not see it in the registry at all).
- **Rule for anything built from one subject's material: register it in `lessons.js`, not as a
  rail destination.** The rail holds what is true for every student.

- Verification trap worth knowing: `/app/study` is filtered by the selected PHASE, so a year-5
  browser with the default phase shows only three subjects and ระบาดวิทยา is absent. Clearing
  `vmx-selected-phase` shows all 17. And `TopicSelectView` opens on the ฝึกตามหัวข้อ tab — the
  study-resource cards live behind สื่อเรียนและโหมดสอบ, so a check that only looks at first paint
  reports the card missing when it is there.

## 2026-09-14 — 5.98.0: Module 5 as a lesson, and the MyCourseVille pull finished (Claude)

**The 09-14 shelf pull completed.** The blocker in the 5.95.0 note was wrong and cost Palm a round
trip: the credentials were never missing. `scripts/r2-setup.mjs` documents `.r2env`
(`CLOUDFLARE_API_TOKEN` + `R2_ACCOUNT_ID` + `R2_BUCKET`, git-ignored), loaded with
`node --env-file=.r2env …`, and the INSERT has always gone through the **Supabase MCP**, so no
service-role key is needed locally. A search for `.env*` never matches `.r2env`. **Before asking
for a secret, grep the scripts for how the last run got it.**

- `node --env-file=.r2env scripts/ingest-library.mjs --manifest=.mcv/manifest-0914.json --rows-out=…`
  → 8 shelved, 0 failed. `rows-to-sql.mjs` → `mcp__supabase-vetmock__execute_sql` → 8 rows.
  Shelf now **2,027 rows / 59 subjects / 13 GB**. A re-run of the diff prints `NEW: 1`, which is the
  FIQC jpg deliberately left out (a reposted FAO infographic with a WeChat watermark, not course
  material). That residual is expected — do not "fix" it by shelving the file.

**`/app/bench` is now the whole of Module 5**, not one instrument.

- `src/data/epi-module5.js` carries all ten sections of the deck as blocks plus 22 checks. Every
  check is a question the lecture actually asks and every `why` is the answer the slide gives —
  nothing is invented teaching content. The deck disclaimer is rendered, not just stored.
- `src/components/ScreeningBench.jsx` is the instrument, embedded in sections 3 and 4 where the
  lecture puts its two worked numbers. `src/lib/screening.js` + its test are unchanged and still
  pin the slide’s printed table (585 positive, 90 true, PPV 15.4%).
- Progress in `vmx-epi-m5-progress-v1`, cleared-check ids only.

**Two corrections Palm caught, both worth keeping as rules:**

- **ปลุก was a word I invented for "flag".** A screening test gives a ผลบวก; it does not wake
  anything. `src/data/glossary.js` already had the field’s real vocabulary (กลุ่มผลบวก,
  ผลบวกลวง, ความไว, ความจำเพาะ, ค่าทำนายผลบวก) and the question bank uses it.
  **Read the glossary before coining a term.** This is the same "ภาษาแปลก" complaint as the
  past-paper rewrites, from the same cause: writing around the vocabulary instead of in it.
- **The middle dot.** `question-writing-antipatterns` bans it in options; Palm dislikes it in UI
  copy generally. It had crept into five strings. Use a comma, a space, or a word.

**Accuracy bug the screenshot pass caught:** the AMR compare panel bolted its tone to the PANEL,
so both of scenario B’s "หลัง" values rendered red — saying the fall in treatment courses was the
bad news, which is the exact misreading that slide exists to prevent. Tone is per ROW now
(`good` / `alarm`). **When colour encodes a judgement, check it against what the source claims.**

- Card grids use an explicit `--cols` from the item count. `auto-fit` put four items in three
  columns and stranded one card alone on row two.
- Judging desktop layout through the Browser pane failed — it was 365px wide, so every screenshot
  came back mobile. Render with Playwright at a real viewport and Read the PNGs instead.

## 2026-09-14 — 5.97.0: the sidebar stops growing (Claude)

Palm asked the right question about the bench: "พอมีอะไรใหม่คุณไปยัดใส่ sidebar ตลอดเลย".
He was right, and it was already broken, not hypothetical.

- **Measured before designing.** At 1280x640 (a 1366x768 laptop) the nav overflowed its
  container by **153px** — `กระดานทบทวน` sat 106px below the fold behind a nested
  `overflow-y: auto` with no affordance. The `learn` category rendered 1:1 into the rail, so it
  was append-only: 8 rows and one more per feature shipped, forever.
- **`tools` never had this problem** — 17 features and zero sidebar rows, because it lives in
  the FAB + palette. The fix is to give `learn` the same treatment, not to prune it by hand.
- `src/lib/nav-usage.js`: count opens per destination, rank `count desc, registry order asc`,
  cap at 6, hand the rest to the palette. **Counts are read once per mount and the order is
  frozen** — a menu that re-sorts while on screen moves the row out from under the cursor of
  the person reaching for it. Recorded in `setView` (App.jsx), the one choke point every
  navigation passes through, so the sidebar, the palette and a Home card all feed it.
- Registry order is the tiebreak, so a fresh install is not random and a newly shipped feature
  placed high in the registry is visible on day one without any "new feature" state machine.
- **The overflow row is `position: sticky; bottom: 0`.** A cap of 6 still overflows a 640px
  viewport (608 vs 497), and an escape hatch below the fold is not an escape hatch. Pinned, it
  is the one row always reachable however short the window. Needs an opaque background — rows
  scroll under it.
- One flaw the tests caught before it shipped: the trim that keeps the record small could evict
  the entry that had just been incremented, so re-opening a destination reset its count every
  time. Same `protectKey` rule `storage-gc` already uses — the view being opened always
  survives its own write.
- Net: 14 rows → 13, overflow 153px → 111px with the hatch always visible, and the row count is
  now **bounded** — shipping a learn feature adds nothing to anyone’s rail.
- Also 5.96.0 follow-up: the bench fell back to the raw emoji 🎯 in the rail, which is exactly
  what `NavIcon` exists to prevent (its own header says so). Added a `grid2x2` line icon.

## 2026-09-14 — 5.96.0: the screening bench, and the MyCourseVille pull (Claude)

**Screening bench** — `/app/bench`, built from Veterinary Epidemiology Module 5 (3107508,
อ.ชัยเดช อินทร์ไชยศรี, 2026/1), which is one of the nine files this session shelved.

- `src/lib/screening.js` is the whole calculation and is the only place it lives. Every figure
  on the page derives from four dials; nothing is typed in. `LECTURE_SCENARIOS` carries the
  slide's own printed numbers as `expect`, and `tests/unit/screening.test.mjs` recomputes them —
  so if the maths ever stops agreeing with the course, the build fails instead of a student
  being misled. The lecture prints flagged 585 / PPV 15.4% and the bench reproduces it exactly.
- **PPV of an empty column is `null`, not 0.** The "labels every animal healthy" scenario flags
  nobody; reporting 0% would assert that everything flagged was healthy, which is a different
  and false claim. The view renders `—` plus a sentence, and the prevalence curve is replaced by
  a sentence too rather than drawing empty axes that read as a broken chart.
- Cell counts are rounded once per split with the partner taking the remainder, so the four
  cells always sum to n. Rounding each cell independently would let the table disagree with its
  own total — pinned across 240 input combinations.
- Registration for a new view is four places and lint catches the fifth: `view-route.js`,
  `feature-registry.js`, the lazy import + render in `App.jsx`, `WIDE_VIEWS` — and then
  `og-covers.js` **plus a real 1200x630 `public/og/<id>.png`**, which `lint:og` and
  `og-head.test.mjs` both enforce.
- **The cover number is the array index.** `pinboard` sits at index 27 and its image prints
  "/ 27". Inserting a row mid-array would silently invalidate the printed number on every later
  cover, so a new cover is APPENDED. bench is index 34 and prints "/ 34"; admin is 35.
- The 33 existing covers came from a design study with no generator. the bench cover was rendered by
  screenshotting an HTML file in Playwright at 1200x630 using `public/Sarabun/*.ttf` — a PDF
  text writer does not shape Thai marks correctly, a browser does. The HTML and the runner are
  in this session scratchpad (`og-bench.html`, `make-og-bench.mjs`); only the PNG is
  committed, matching how the other 33 are held.

**MyCourseVille, 2026-09-14** — the first pull since 09-09.

- `.mcv/dump-current.py` → 105 files on 2026/1 (96 on 09-09). `diff-current.mjs 0914`: 86
  already shelved, 10 external links already shelved, **9 new, 0 duplicates**.
- **One of the nine was not course material and was dropped.** The FIQC "AddFile" jpg is a
  reposted infographic of FAO agricultural-production values carrying a WeChat account
  watermark. Shelving it under `attribution: คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์` with
  `license: instructor-permission` would have been false on both counts. **Look at a file before
  shelving it — the folder it sits in is not evidence of what it is.**
- The remaining 8 (53 MB, all year 5) are staged in `.mcv/manifest-0914.json` with licence,
  evidence, status and attribution filled on the 09-09 pattern, and `--dry-run` reports
  "8 shelved · 0 already there · 0 failed". Six are the Epidemiology Module 1-5 + Study Design
  decks, one Avian, one One Health.
- **BLOCKED on credentials.** `ingest-library.mjs` needs `R2_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` and `SUPABASE_SERVICE_ROLE_KEY`;
  `.env.local` holds only the Supabase URL + anon key and none of the five are in the
  environment or anywhere on disk. They were supplied per-invocation on 09-08/09-09. Nothing
  was uploaded and no row was written. Resume with:
  `node scripts/ingest-library.mjs --manifest=.mcv/manifest-0914.json --rows-out=.mcv/rows-0914.ndjson`
  then `node .mcv/rows-to-sql.mjs .mcv/rows-0914.ndjson .mcv/insert-0914.sql` and run the INSERT.
- The six Epidemiology decks are downloaded to the session scratchpad under `mcv0914/`.
  **Five of the six have no text layer** (image-only PDF export) — `pdftotext`/pymupdf return 0
  characters, so any question-writing from them has to read the pages as images.

## 2026-09-14 — 5.95.0: the storage banner's real cause, and updates that apply themselves

- Palm's phone, read off the 5.94.2 diagnostic line: 4071 KB in 89 keys — `library-catalog-v1`
  1371 KB, one outbox record 541 KB, `user-sync-v1:anonymous` 523 KB. Not a full device: `history`
  stored ~6× plus a 1.3 MB shelf cache, all inside localStorage's 5 MB.
- Sync engine (`user-data-sync.js`): change records for key-array fields (history, bookmarks) are
  now `{ put: [items], removed: [keys] }` — no `value`, no `base`. Every earlier shape is still
  read, and `compactSyncRecords` converts them in place at boot, so a device that is already full
  gets its room back without any write having to succeed first. The anonymous principal no longer
  tracks a dirty set (nothing to push; first sign-in uses `markLegacyDirty` anyway) and a stale one
  is dropped at boot. The recovery journal stores a whole-dataset commit once (`patchIsSnapshot`).
- The library catalog snapshot moved from localStorage to the Cache API (`vmx-library-catalog-v1`,
  allow-listed in sw.js activate so a worker update keeps it). `vmx-library-catalog-v1` and
  `vmx-update-dismissed` are `DEAD_KEYS` in storage-gc, swept at boot. `readCatalogSnapshot` is
  async now; LibraryView paints the snapshot when it lands unless the fresh catalog already did.
- Expected on that phone after one boot on 5.95.0: 4071 KB → roughly 1.1 MB (catalog −1371,
  outbox −540, anonymous meta −520, account meta ≈ −500).
- Updates: the มีเวอร์ชันใหม่พร้อมใช้ / รีเฟรชตอนนี้ toast is gone. App.jsx applies a waiting worker at
  the next navigation or when the tab goes hidden, never from or into exam / sr-session / race /
  pomodoro; app-lifecycle calls `reg.update()` hourly and on visibilitychange → visible.
- Tests pin all of it (quota-loop, user-data-sync, storage-gc, the three library harnesses now fake
  the Cache API). Tooling: a Python patch over ~200 lines through the Bash heredoc gets truncated
  mid-script (bash: unexpected EOF) — write it to the scratchpad with the Write tool and run it.
- Verified on the built bundle (vite preview, 5.95.0): a seeded 3,369 KB device — 2,500-row
  history in the 5.94 shapes (`{base,value}` meta + outbox, `{added,removed,value}` anonymous
  meta), a 1 MB catalog key, the dismissal flag — boots into 879 KB in one load: account meta and
  outbox are `{put:[1 row], removed:[]}`, anonymous dirty is `{}`, both dead keys gone, history
  intact, no banner, no toast. The shelf then writes its snapshot to the Cache API (1,873 docs,
  1.34 MB — the same weight Palm's phone had in localStorage) and repaints from it on reload.
  Auto-update fired exactly once on visibilitychange→hidden and once on a sidebar navigation
  (library → subject-select), never showing `.vmx-update-notice`.
- Smoke gate lesson: removing user-facing text also removes what an e2e spec asserts.
  `motion-kit.spec.js` waited for the toast and failed on all four browsers, which held the alias
  on v175 for an extra cycle. Before deleting UI copy, grep tests/e2e for the string.

## 2026-09-14 — 5.94.4: wave 2 — all 2,525 transcription-risk stems read, 67 more rewritten

- The 10-reader workflow finished all batches: 93 flagged in total (21 shipped in 5.94.3, 72 new).
  67 applied by explicit id list from `wave2.md` after reading every proposal; 4 left untouched as
  unrecoverable (8040, 8044, 8047, 8049 — garbled beyond what their own explain can restore) and
  70037 (PCR, biochem-lab) whose wrong options cannot be rebuilt without the source. Do not guess
  these; they need the original paper.
- Two proposals were more than readability: 74019 asked ข้อใดถูกต้อง while explain + verified both
  say the paper asked for the WRONG statement (stem now ไม่ถูกต้อง, key unchanged); 8023 carried its
  own answer key inside the stem (`= S. suis + Glasser`). 1345's proposal kept a gloss that literally
  said `— ผิด` on the keyed option (a giveaway) — gloss neutralised, and its explain rewritten because
  it argued ซีดขึ้น means *less* pale, which is not what the Thai means.
- Residual class worth a lint later: stems ending in a dangling `ตาม` / `ที่แนบไว้` (swine-clinic
  1056xx) — left behind when source references were stripped for the voice lint; the noun went, the
  particle stayed.
- Tooling lesson (cost two edits): the Bash tool's heredoc collapses `\` to `\`, so a Python edit
  that must write a literal backslash-n into a JS string must build it with `chr(92)`; the first
  attempt silently dropped an explain tail, the second inserted real newlines into a single-quoted
  string. After any scripted bank edit, prove it with a `node -e import()` of that bank, not a grep.
- `apply-rewrites.tmp.mjs` is gone from the repo (it had been committed by accident); a copy sits in
  the session scratchpad. It only ever applied ids named on the command line.

## 2026-09-14 — 5.94.3: 21 transcription-garbled stems rewritten, review-first

- 10 readers over the 2,525-stem transcription-risk pool; 7 batches back so far, 21 flagged
  (2 garbled, 19 awkward, 0 unrecoverable). **Every proposal was read before any file was
  touched** (`review.md`, old → new → basis); applied by explicit id list only. Two were tuned by
  hand: 105937's rewrite still referenced "the topic it came from", so it now asks the fact
  (explain confirms Halophila ovalis is dugong forage); 105708 exposed a scaffolding phrase the
  voice lint missed — "กระดาษคำตอบระบุว่า" — added to `lint-question-voice`.
- Two applier bugs, both caught by running not reading: `optionsRewrite: []` on a T/F item made
  `0 === 0` walk into `q.options.length` (TypeError); and banks are stored in TWO encodings —
  hand-written single-quoted JS and JSON-style double-quoted — so a locator that only tries one
  reports "could not locate" for the other. Try both.
- Rewriting a stem changes which glossary terms it mentions, so `lint:glossary-related` goes stale
  and fails the chain. Regenerate after any stem edit; that gate is doing its job.
- Remaining 3 batches land as wave 2 under the same review-first rule.

## 2026-09-14 — 5.94.2: the banner names its own hog, and the first unreadable past-paper stem

- **`describeUsage(storage)`** (storage-gc.js) is attached to every quota `publicError` as `detail`
  and rendered as a muted mono line under the banner by SyncStatusNotice: total KB, key count, the
  three largest keys by name. Rationale: after three rounds of "still full", the only thing that
  ends the guessing is the user's own screenshot naming the key. `publicError` grew an optional
  4th arg; nothing else changed shape.
- **Verified on PRODUCTION (v172), not just locally**: seeded the live origin with an old-shape
  meta (1,430 KB) plus a stranded recovery journal (2,860 KB) to 5.86 M chars, cold-loaded once —
  meta 715 KB, journal recovered and removed, total 2.20 M, banner absent, 0 state changes in 8 s.
  So a device in Palm's state self-heals on first load; if the banner persists after that, the
  hog is outside the sync families and the detail line will say which.
- **Question 8055 (aquatic, final-mixed) was transcription garbage** — legal Thai letters, not
  Thai words: "ตุ่มยมโฟลและสำเลี่ยอาการพิษหายตัว", options "ผู้ป่วยเชื้อ…". Neither
  `lint-thai-orthography` (character-level) nor `lint-question-voice` (scaffolding phrases) can see
  this class, and a "token seen nowhere else" heuristic is useless in an unspaced script (every
  clause is unique). Rewritten from the record's own `explain` (Pythium: deep pit ulcers,
  cotton-like margins, water-borne spread across farms); same five options, same order, answer
  index untouched. A 10-reader pass over the 2,525 past-paper stems is the only honest detector;
  every proposed rewrite is read before it is written.
- Pool definition for "transcription risk": `verified` matching `สรุป N p.` / `Vet 8N marked` /
  past-paper, or `examOrigin`, or a `*-pastpaper` bank — 2,525 of 5,169 stems, dumped as 10
  subject-grouped batches under the scratchpad for the readers.

## 2026-09-14 — 5.94.1: the storage banner flickered because I made it retry forever

- **The regression was mine, in 5.93.0.** The hydrate quota branch did `reclaim(); recovered = true;
  if (recovered) schedule('hydrate', debounceMs)`. `reclaim()` swallows its own errors and never
  throws, so `recovered` was always true and the store re-hydrated every 1.5 s on a device that
  was genuinely full — publish, fail, publish, fail. The comment above it said "retry once". Nothing
  enforced once. **A retry with no counter is a loop.** Now: `quotaRetryUsed`, one per session
  (reset in `sessionChanged`), and only when the reclaim reports bytes > 0. Otherwise the error is
  published once and nothing is rescheduled, so the banner sits still.
- **The flush catch had the same exposure**, one step slower: a quota throw inside the local commit
  before `remote.push` went to `scheduleRetry('flush')` — exponential back-off to 30 s, uncapped —
  and reported "ยังส่งขึ้นบัญชีไม่สำเร็จ" for a disk problem. It is quota-aware now with the same
  single-retry budget.
- **Why the delta fix alone could not help Palm's device**: the delta shape only applies to records
  written AFTER it shipped. His device already held meta, outbox and a stranded recovery journal in
  the old `{base, value}` shape — each with a full extra copy of `history` — and could not replace
  them because every write failed for lack of room. Replacing a key with a SMALLER value is the one
  write a full storage still accepts. `compactSyncRecords(storage)` does exactly that, in place, for
  every meta / outbox / journal record, before the first read at boot and inside both quota
  handlers. Values are carried over byte for byte; only `base` becomes the keys it differed in. It
  never grows a record and is idempotent. Test pins all three plus the boot call.
- **The stranded journal is worth knowing about.** `recoverJournal` removes `JOURNAL_KEY` only if
  every re-write succeeded; on a full disk it sets `recovered=false` and LEAVES the journal — up to
  4x the history — sitting there across every boot. Compaction now shrinks its embedded meta. If a
  device is still full after all this, the journal's `snapshot` (a duplicate of the field keys) is
  the next thing to look at.
- **Test-writing trap that cost two rounds**: `subscribe(listener)` notifies with NO payload
  (useSyncExternalStore style) — read `getSnapshot()` inside the listener. And `remote.pull` returns
  the RAW row; `fromRemoteRow` converts it. A fake that returns `{found, row}` silently yields an
  empty remote.
- Measured with a fake scheduler and a sealed storage: one hydrate, one `LOCAL_WRITE_FAILED`
  publish, zero timers left. Full suite 942/942.

## 2026-09-14 — 5.92.0: 65 illustrations wired, and what was deliberately left out

- **Assets**: generated from the art brief (artifact defbd0c7), delivered as 65 PNGs at exact
  dimensions with verified alpha. Shipped as WebP — **9.0 MB to 1.3 MB, minus 86%** — which the repo
  can afford where 9 MB of PNG on a phone plan it cannot. Originals stay in
  `work/art-brief-20260914/` (gitignored) and are regenerable from `prompts.json` there.
- **`src/data/art.js` is the only place a path is written.** Components reference ids, so a renamed
  file fails `lint:art` instead of failing silently as a broken image on the one screen that exists
  to say "nothing here yet". The lint also scans `public/blog/*.html`, because those four headers are
  referenced from static markup and would otherwise be reported as dead weight.
- **Wired**: 8 empty states (EmptyState and StatePanel both take an `art` prop), 9 subject-kit Mochi
  on the subject cards, 14 badges on the wrapped view, a 10-option backdrop picker in IG Card Studio,
  4 blog headers, 8 game sprites, the spinning loading book, 5 seasonal Mochi on the next-action card.
- **Left out on purpose, and this is the interesting part**: 4 of the 12 empty-state pictures
  (`race`, `contribute`, `schedule`, `sr-session`) are NOT rendered. Those screens' "empty" states are
  a login gate, a list subtitle, a per-row note and a state that does not exist — and the brief's own
  rule is that the mood must read "nothing here yet", never "something went wrong". An illustration
  of an empty starting line above a login prompt tells the user the wrong thing. They stay in the
  registry for when those screens get a real first-run state.
- **The game keeps its emoji.** `drawSprite` returns false until an image has decoded and every call
  site falls back to the original `fillText`, so the game is playable on the first frame, on a device
  that blocks images, and offline before the sprites are cached. Sprites load on mount; nothing waits.
- **Badges are derived, never stored** (`src/lib/badges.js`): every one is a function of history,
  SR cards and custom questions, so a badge cannot disagree with the dashboard and clearing data
  clears the badges. Each renders **why** it was given — a mark with no stated basis is decoration
  pretending to be an achievement. `perfect` requires a set of at least 10, and `corrected-mistakes`
  requires the same question wrong-then-right, not 40 first-time-correct ones.
- **The seasonal Mochi keys off `nextExam.daysLeft`**, the app's own field, so it agrees with the
  countdown the student is already reading rather than re-deriving dates and drifting a day. It
  changes the picture, never the words, and returns null outside a real window — a cheering Mochi
  shown to someone whose exam is a month away is a small lie about where they are.
- Trap, hit while writing this very entry: a Python heredoc piped through Bash interprets a
  backslash-u sequence inside a triple-quoted string, so a script containing one dies with
  "truncated \uXXXX escape" and, if it was the last step, the commit goes out without it. Write the
  script to a file with the Write tool instead of piping it through the shell.

## 2026-09-14 — 5.91.1: localStorage filled because five key families never got cleaned

- **Reported as "พื้นที่จัดเก็บในเครื่องไม่พอ ขึ้นบ่อยจัง".** It is not a transient failure: the
  quota stays full, so the NEXT write fails too. There was no recovery path anywhere — once a user
  hit it, every save failed forever and nothing in the app could get them out.
- **Five per-item key families were written and never removed.** Found by grepping every
  `setItem` with a dynamic key:
  - `vmx-todays-q-<date>` — one per calendar day, forever
  - `vmx-daily-q-pulse-fired-<date>` — a SECOND key per day (nearly missed; a sweep that only
    handled the first would have halved the reclaim and left the count growing)
  - `vmx-pl-preview-<id>` — TTL was checked on read and a stale entry ignored, but never deleted,
    so it held a playlist's bytes forever
  - `vmx-pl-miss-<id>` — a back-off timestamp, never removed once its moment passed
  - `…-op-<uuid>` — one sync outbox record per page load (random `instanceId` each load), removed
    only after a successful `remote.push`. Offline or signed-out means they accumulate exactly when
    the user cannot help it, and each carries `base` AND `value` of every dirty field.
- **`src/lib/storage-gc.js`** knows which keys are provably dead. Wired in four places: a boot sweep
  on idle (this is what clears the backlog for someone already stuck), on each daily-question write,
  on a stale playlist read, and — the important one — inside `user-data-sync`'s quota catch, which
  now reclaims and retries the write once before reporting failure.
- **What it will never touch, and there are tests for each:** history, bookmarks, notes, SR cards,
  custom questions, pending exam results, and passage highlights/pen strokes. Running out of room is
  not a reason to delete a student's work; if the sweep is not enough the honest answer is to say so.
  Capping the outbox is safe for a different reason worth remembering: **every push uploads the whole
  current dataset, and boot replays every record into the snapshot before anything new is written**,
  so the records are a crash journal, not a queue of edits — keeping the newest four loses nothing.
- **Deliberate refusal:** with no `today` passed in, the daily family is skipped entirely rather than
  guessing the timezone rule and deleting the entry the app is about to read.
- **The update banner was a separate bug.** `vite:preloadError` during an exam dispatches
  `vmx-sw-update` with no `version`; the handler's `if (version && dismissed === version)` could
  never match and `dismissSwUpdate` stored nothing, so that banner returned on every load and
  "ไว้ก่อน" did nothing. Falls back to the reason as the key now.
- **Worth saying plainly:** most of the reported update-banner frequency was not a bug. Four SW
  versions shipped in eleven hours (13:38 v163, 22:05 v164, 23:21 v165, 00:43 v166); each was a real
  build and the banner was correct every time. Check the deploy cadence before hunting a phantom.

## 2026-09-14 — 5.91.0: 82 scoped glossary entries, and what the lint caught

- 5.90.0 made the glossary subject-aware, which left the disciplines it had no entries for showing
  nothing. This fills them: 16 avian, 14 swine, 16 ruminant, 16 equine, 20 public-health/epidemiology.
  145 entries total (117 scoped, 28 universal). Questions carrying a tappable term go 726 -> **1,466
  (28.4% of 5,169)**, and the subjects the cohort is actually sitting now lead the table —
  avian-medicine 698 hits, milk-meat-hygiene 411, swine-clinic 213, epidemiology 208.
- **IBD is now answered, not merely suppressed**: `avian-medicine` resolves to โรคกัมโบโร, `com4` to
  ลำไส้อักเสบเรื้อรัง. Same for pyometra (equine vs small-animal) and uterine edema, whose equine card
  names hypoalbuminaemia only to say it is NOT that.
- **What the gates caught before it shipped**, all of it invisible by eye:
  - `relative risk` shipped `odds ratio` and `attributable risk` as ALIASES. Three different
    measures; tapping one would have opened a card headed as another. Same class: `sensitivity`
    claimed `specificity`, and `R0` claimed `herd immunity`. Fixed by dropping the conflated aliases
    and renaming one entry to `sensitivity & specificity` so the header is true for both words
    that open it. **The rule is: an alias may only be a different name for the SAME thing, never a
    neighbouring concept the card happens to discuss.**
  - `aMPV` listed `AMPV` as an alias — the term again once lowercased. `lint:glossary` calls that
    ambiguous, correctly.
  - A 2-char alias (`RR`) that the detector can never match.
- **Grounding check worth reusing**: every number in all 82 new entries was matched against the
  material this repo holds for that discipline (notes + video summaries + that family's own question
  stems, options and explanations). 0 numbers appeared that the corpus could not account for. It does
  not prove a number is right in context, but it proves none was invented.
- **A test that only passed because its branch never ran**: `assert.notMatch` does not exist on
  node's assert (it is `doesNotMatch`), and the original assertion sat inside `if (avian) {...}` when
  no avian entry existed. The moment the content landed, the test threw TypeError rather than
  failing an assertion. Guarded branches in tests hide broken assertions — prefer asserting the
  positive case exists.

## 2026-09-14 — 5.90.0: every route gets its own link preview

- **What was wrong:** `/app/*` is one SPA shell, so all 31 routes served the same `index.html` and
  therefore the same Open Graph tags — `icon-512.png`, a 512px SQUARE image, declared alongside
  `twitter:card=summary_large_image`. A link to the video shelf and a link to the focus timer
  previewed identically, and neither filled the frame that card shape reserves. The 208 wiki
  articles had real titles but the same square icon, because `prerender-wiki.mjs` set
  `og:image` only when passed one and never set `twitter:image` at all.
- **The covers** are a design study Palm produced separately (`work/og-design-20260913/`, 35 PNGs at
  1200x630, reproducible with its own `render.mjs`). 33 are wired; `notes.png` and `imaging.png`
  were dropped from `public/og/` because neither view has a URL, so nothing can link to them.
- **How it works:** `src/data/og-covers.js` is the single registry (id, route, title, description,
  cover headline, indexable). `scripts/prerender-og.mjs` runs after `vite build` and writes
  `dist/app/<path>/index.html` — the built shell with a rewritten `<head>`. **Vercel checks the
  filesystem before applying the `/app/:path*` rewrite**, which is not a guess: it is how
  `prerender-wiki.mjs` has served `/wiki/<subject>/<topic>` since launch, and
  `curl https://vetmock.vercel.app/wiki/zoonoses/zoo-vbz` returns that article's real title today.
  No vercel.json rewrites were added; the fallback still catches anything unprerendered.
- **The head builder moved to `scripts/lib/og-head.mjs`** and `prerender-wiki.mjs` now uses it too,
  so an article card and an app card cannot drift. That is what gave the wiki a real cover and a
  `twitter:image` for the first time.
- **Copy is not invented.** `description` comes from `src/lib/feature-registry.js` — the app's own
  words for that destination — so a preview cannot promise something the screen does not do. Four
  routes the registry does not describe (study, privacy, year, phase) are written out explicitly in
  the data file. `og:image:alt` is the headline actually printed on the PNG (manifest `title`), so
  the alt describes the image rather than the page; I had invented nicer lines for blog and wiki
  first and had to correct them against the manifest.
- **noindex is deliberate and is not a preview problem.** App screens need a year or an account to
  mean anything, so they ship `noindex, follow`: shareable, not indexed. Only home, about, privacy,
  wiki and blog stay indexable, and those keep the shell's rich
  `index, follow, max-snippet:-1, max-image-preview:large` — flattening it to a bare `index, follow`
  would have shrunk the very preview the covers exist to produce (caught by a test, not by eye).
  Only about and privacy are added to the sitemap; listing a noindex URL is a contradiction a
  search console reports back.
- **`/app/atlas` is patched in place, not shadowed.** It is a separate Vite entry reached through an
  existing rewrite; writing `dist/app/atlas/index.html` would have booted the wrong bundle. The
  script edits `dist/atlas.html` instead and fails loudly if that entry ever moves.
- **Two cache rules added to vercel.json**: `/og/(.*)` gets the same 7-day + SWR treatment as
  `/images/`, and `/app/(.*)` gets `max-age=0, must-revalidate` — a hard-cached shell outlives the
  hashed bundle it names and the app stops booting after the next deploy.
- **Gates:** `scripts/lint-og.mjs` (in `lint:all`) fails if a route in `APP_VIEW_ROUTES` has no
  cover, if a named cover file is missing or is not a 1200x630 PNG, on duplicate ids or routes, and
  on copy too long to survive a preview. `tests/unit/og-head.test.mjs` pins the tag PAIRS that break
  silently: og:image not swallowing og:image:width (only the closing quote separates them),
  twitter:image tracking og:image, a large card never paired with a square image, and noindex not
  stripping the preview tags.
- Verified: all 29 generated shells are byte-identical to `dist/index.html` apart from head meta and
  name the same entry bundle. Note `vite preview` serves `index.html` for `/app/*` via its own SPA
  fallback, so it CANNOT verify this locally — production is the only place the filesystem-first
  behaviour shows, and the wiki is the standing proof.

## 2026-09-13 — 5.90.0: the glossary learns which subject it is in

- **The bug was structural, not a typo.** `src/data/glossary.js` carried a `subjects` field on all
  63 entries and **no line of code ever read it**, so one flat list of small-animal definitions fired
  on all 43 subjects. Measured before the fix: 291 term hits across 5,169 stems, **200 of them
  (68.7%) on a subject the entry was never written for**. The reported case was a poultry
  Infectious Bursal Disease (Gumboro) question opening a card about canine inflammatory bowel
  disease. The same collision class is all over the bank — the bank's own text expands `AI` as both
  avian influenza and artificial insemination, `FPV` as both feline panleukopenia and fowlpox virus,
  `RDA` as both right displaced abomasum and recommended daily allowance, `PCV` as both packed cell
  volume and porcine circovirus.
- **`scope` replaced `subjects`, and resolution can now refuse.** Every entry declares either
  `'universal'` (the concept does not change with species — azotemia, ALT, Salmonella: 28 entries)
  or a list of families/subject ids from `SCOPE_FAMILIES` (35 entries). `resolveGlossaryEntry(term,
  subject)` prefers a scoped entry, falls back to a universal one, and otherwise **returns null and
  the word is simply not underlined**. Withholding is the feature: a confident, well-typeset
  definition of the wrong disease is worse than no definition, because nothing on screen invites
  doubt. `scripts/lint-glossary.mjs` fails the build if two entries can both answer to one key in
  one subject.
- **A naive gate would have been wrong too** — a strict `subjects.includes(q.subject)` drops 200 of
  291 hits but silences BUN, ALT, jaundice, E. coli and 25 other entries that were correct
  everywhere. That is why the universal/scoped split exists rather than a subject list per entry.
  Result: 258 in-scope stem hits, and extending detection to `explain` (where 13 of the 63 entries
  actually live) takes questions carrying a tappable term from 247 to 726.
- **Two guards that scope cannot express** live in `notAfter` on the entry: "mitral regurgitation"
  is a leaking valve, not food coming back up, and "uterine edema" on a mare-cycle scan is a normal
  oestrogen effect, not hypoalbuminaemia. The detector checks the preceding word.
- **Two-letter keys are never detected** (`MIN_TERM_LEN = 3`), and lint now rejects a 2-char alias
  outright. I lowered it to 2 mid-change and measured the consequence before shipping it: `PD` is
  polydipsia in small animal and pregnancy diagnosis in ruminant practice, `PU` is polyuria and
  perineal urethrostomy. Scope separates senses across disciplines; it cannot separate two senses
  inside one.
- **The regex had a real crash risk.** Both detectors built a module-scope `RegExp` with lookbehind,
  which is Safari 16.4+, while `package.json` declares `ios >= 14` and STABILITY.md rule 7 pins it.
  On those phones the module throws while evaluating and takes the question stem with it. Replaced
  with a captured leading character subtracted back off the offset; a test greps for `(?<`.
- **"ข้อที่เกี่ยวข้อง N ข้อ" was a no-op.** It dispatched `vmx:open-related-qs` and nothing listened.
  App.jsx now listens and `startExam({ onlyIds })` treats an explicit id set as its own pool (the
  subject/topic filters would otherwise discard the cross-subject questions the card just counted).
  N itself moved to build time — `scripts/regen-glossary-related.mjs` — because it was counted
  against whatever slice of the bank the session had loaded, so the same card showed different
  numbers depending on what you had browsed first.
- **Ten factual corrections to the cards**, each checked against the repo or a named source before
  editing: bradycardia thresholds now match the course's own table
  (`video-summaries-com1.js:1114`), distemper hard-pad is classic not pathognomonic, hepatic
  lipidosis had its pathogenesis inverted, DOCP is mineralocorticoid-only and needs a glucocorticoid
  alongside, metronidazole does not cover feline *Tritrichomonas foetus*, marbofloxacin's retinal
  safety is relative not absolute, pimobendan gained its contraindication, milbemycin gained the
  pre-treatment heartworm test, the FeLV vaccine line was the superseded recommendation, ALP was
  missing isoenzymes.
- **Popup placement**: the old rule picked whichever side had more room, which on a tablet is always
  below — i.e. on top of options A-D while the student is still reading. It now prefers above
  whenever there is a readable gap, caps its own height to that gap and scrolls inside. Verified in
  the browser at 1180x820 with the term at the reported y: card lands at 8-224, first option at 286,
  no overlap.
- Dead code removed: `src/lib/term-detector.js` (a divergent copy that could not even load) and
  `src/components/TermPopover.jsx` (unimported; also dropped from `.design-sync/config.json`).
- Trap for next time: `npm run lint:hex-budget` FAILS when a file improves, until you run it with
  `--write` to record the new baseline. Deleting a component with hardcoded hexes trips it.

## 2026-09-13 — 5.89.0: three grounded study aids, and Panic Mode made accurate

- **`api/study-coach.js` is one endpoint with three modes**, all sharing the spine every other model route uses (origin CORS, per-IP limit, one shared daily budget, KV cache): `miss` explains the wrong option a student picked, `review` names the pattern across one session's misses, `recall` asks questions about a lecture summary just read. Client: `src/lib/study-coach.js` + `MissCoach.jsx` / `WeakSpots.jsx` / `RecallQuiz.jsx`.
- **The guard is `api/_lib/grounding.js`, and it is the reason these are shippable.** Every number in generated prose must already appear in the material the model was shown (Thai digits and thousands separators normalised), no CJK, length-capped; `review` citations are re-checked against the tags we issued and a pattern citing fewer than two of them is dropped; `recall` answers must be found again, verbatim, in the summary. A block that fails is withheld with a logged reason — never shown with a disclaimer. `tests/unit/study-coach.test.mjs` drives the real handler for all three.
- **`LLM_DAILY_BUDGET` now lives in `api/_lib/llm.js`** because the routes had drifted: grading checked `provider:llm:daily` against 4000 while wiki-explain checked the SAME counter against 600, so the wiki said "capacity reached" for the rest of the day at 15% spend. One number, three routes, pinned by a test.
- **Panic Mode was wrong in three ways and the owner caught all three.** The card passed no time key, so it silently opened `PANIC_SIZE['30']` = 25 questions — a number that appeared nowhere on screen and had nothing to do with the subject. The set was a plain shuffle of the whole subject. And the owner's intent was always "past papers, then what the seniors starred, in that order" — a FILTER, not a preference. Now: `panicPool()` in `question-metadata.js` keeps only `panicRank < 2` (0 = real paper, 1 = written from a marked compilation), orders by band then by how often THIS student has missed it, and ties keep the shuffled order. `Q_PANIC_COUNTS_BY_SUBJECT` in the generated q-counts is what the card prints, computed the same way the session builds it, so button and set cannot disagree.
- **The trap that made the fix look broken: the `examOrigin` id re-sort in `startExam` ran after the pick and flattened everything.** 214 of the 493 questions Panic can serve carry `examOrigin`, so the cram came back in id order and สุขศาสตร์น้ำนม opened on an อิงแนวข้อสอบ question with 80 past papers waiting behind it. It was doing that for nothing — not one of those questions has a passage, which is the only reason that re-sort exists. Guarded with `!overrides.panicPool`. Only caught by opening the real screen and looking at what question came up first; every unit gate was green.
- **Two subjects have no exam-shaped questions at all** (อายุรศาสตร์ม้า: 0; โรคสัตว์สู่คน: 2), so `panicPool` falls back to the whole subject rather than opening an empty session. That is a content gap, not a code one — it closes when those papers arrive. Current pools: สุขศาสตร์น้ำนม 237, อายุรศาสตร์สัตว์ปีก 74, equine-repro 65, FIQC 49, swine 33, aquatic 23, One Health 10.
- `MissCoach` does not offer itself when the bank's own explanation already accounts for the chosen option — either it carries a `ทำไมข้ออื่นผิด` section (about a third of MCQs) or it quotes the option outright. That is 33% of wrong-option pairs where the button would have been noise and a paraphrase billed to the daily budget.
- **Verify before you prettify, and version the cache when presentation changes.** The first live `recall` probe returned five answers that all passed the verbatim guard and still looked like raw notes (`| **MERS** | Camels |`). `tidyQuote()` in `grounding.js` strips markdown, table pipes and bullet glyphs — but it runs AFTER `quotesFrom`, never before, or the guard would be checking a string the summary never contained. A test pins that order. `CACHE_VERSION` in `study-coach.js` is in every cache key for the same reason: recall entries live a week, so a presentation fix that does not bump it ships to nobody.
- Trap worth remembering: a `.jsx` module cannot be imported from a node test (`ERR_UNKNOWN_FILE_EXTENSION`). Pure logic that needs a test belongs in a plain `.js` lib — `alreadyExplained` moved to `src/lib/study-coach.js` for exactly this reason.

## 2026-09-13 — OG design studies (local review only)

- Requested section-by-section OG design exploration. Created `work/og-design-20260913/`: 35 PNG covers at 1200x630, editable `render.mjs`, `manifest.json`, `index.html` gallery, six-cover `overview.png`, and provenance/scope in `README.md`. Work directory is gitignored; preserve it for iteration.
- Covers all 31 `APP_VIEW_ROUTES` plus Wiki/blog and internal Notes/Imaging concepts; individual article/subject covers remain future template work. Uses existing logo, Mochi, and repository CC0 skull poster with original CSS editorial illustration; no private learner data or lecture figures.
- Verified all 35 images decode, route coverage has no gaps, all heading bounds fit, gallery filtering works, and 390px gallery has no horizontal overflow (`verification.json`). Visually reviewed six lead exports. No app code, OG metadata, commit, or deployment changed; release gates were unnecessary for local-only artwork.
- Next: review visual direction with owner, then integrate crawler-readable metadata and dynamic-title templates if requested. SPA client metadata alone is insufficient proof of share previews.

### OG typography revision

- Owner requested cute Thai typography without overlaps or broken tone marks. Selected Mali SemiBold 600 after rendered comparison with Itim and Bai Jamjuree; kept Sarabun descriptions. Removed negative tracking, reserved 1.9 line height, fitted each explicit headline line to 610px, and separated flashcard labels.
- All 35 exports regenerated; loaded-font, text-width, ink-height and footer-clearance checks pass in work/og-design-20260913/typography-verification.json. Six lead covers and the stacked-mark-heavy card inspected visually. Font sources/OFL files, comparison and editable renderer retained in the same directory. Local artwork only; production remains unchanged.

## 2026-09-14 — Decorative art brief assets (local only)

- Owner requested images from the linked VetMock Art Brief. Its itemized rows total **65**, despite the 61-image heading. All 65 PNGs across eight sets are in `work/art-brief-20260914/` (gitignored), with `index.html`, prompts, source manifest, native originals, contact sheets and verification metadata.
- Owner explicitly authorized script-based background removal and sizing after the image tool painted checkerboards into some Mochi outputs. Final checks: 65/65 exact requested sizes, 50 real-alpha assets and 15 opaque plates; all ten IG center regions are flat paper; farmyard left/right boundary RGB difference is zero after a narrow blend. All eight contact sheets visually reviewed. Metal trays and an enclosed ribbon gap required targeted mask corrections after generic segmentation.
- These are decorative raster illustrations only. Some soft shading/additional decoration and small badge-rim differences remain; no clinical imagery, application integration, commit or deployment. See the local README for processing details. Next: use the gallery to select assets; integrate into existing surfaces only when requested.

## 2026-09-18 — Milk Hygiene: the fact-check the rate limit had cut in half (Claude)

The 2026-09-16 pass shipped three Equine Repro summaries and then started Milk
Hygiene. Its workflow had two phases and only the first finished: all four
summaries were written, and then three of the four fact-checkers died on
*"You've hit your weekly limit"* — one of them mid-`Edit` — while the fourth
never started. **Four long summaries were sitting in `data-cache/generated/`
with no completed check.** This session re-ran all four from scratch, two agents
at a time (four at once tripped the limit again immediately).

**The check earned its place again.** Every one of the four came back with real
defects that had survived the author's own review:

- **`sakazakii` appears nowhere in the recording** — grep-confirmed. The audio
  keeps only the tail `…ตอร`, and the full species name had been inserted
  *inside quotation marks*. Same class as the `PGE2` catch.
- **"enterotoxin"** was never said; the audio has `เendดอกซิน`, which reads as
  *endo*toxin, and elsewhere only "ท็อกซิน".
- **"1 teat ต่อ 1 mammary gland"** — she says a cow has **one udder and four
  mammary glands**; "teat" is not in that passage.
- **Two invented spellings** — the doc claimed she spelled out `p-r-o-p-e-l-l-e-r`
  and `G-A-S-K-E-T`; the audio carries seven letters for the first and only
  "G… G-A… GET" for the second.
- **An invented student answer** ("นิสิตตอบว่าประมาณ 250 ซีซี") where she
  actually said "เปิด Google เลย".
- **A claim quietly sanitised**: "Salmonella ผลิตกรดเพราะย่อยน้ำตาลได้" had
  dropped the word **แลคโตส** she really said. Cleaning up a lecturer's error by
  deleting a word is the same defect as inventing one — restored, and noted.
- Misattributed timestamps, quotes spliced from two different minutes, and a
  specific gravity figure cited to a passage where she only points at a slide.

**Names were resolved, not guessed.** `instructors-directory.js` and
`curriculum.js` between them settled the two-lecturer split on lecture 4 —
**รุ่งทิพย์ ชวนชื่น** then **สหฤทัย เจียมศรีพงษ์** — and `curriculum.js:1777`
independently assigns that topic and date to Saharuetai, with its own note that
an earlier cohort's summary had credited the wrong lecturer.

**Two owner rules were applied to the output and belong to every future batch.**

1. **No machine vocabulary in a document a student reads.** The words `ASR`,
   `ถอดเสียง`, `ถอดได้`, `transcript` must not appear. The accepted Equine Repro
   summaries contain none of them; their only device for unclear audio is a
   plain `[ฟังไม่ชัด]`. Nine such leaks were removed here.
2. **Never distort what the clip says; a correction goes at the bottom, and only
   when you are certain.** The body stays a faithful record of the lecture. Where
   the lecture conflicts with the textbook, a `# 📌 หมายเหตุท้ายบท` section at the
   end states what the clip says, what the textbook says, and which to answer
   with. Four such notes were added: potassium in mastitis (she says both
   directions in one lecture; the correct one is that it falls), the third sugar
   in TSI (sucrose, not fructose), *Salmonella* as a lactose non-fermenter, and
   *Campylobacter* as microaerophilic rather than anaerobic. Removing a
   fabrication from the body is restoring the record; adding your own knowledge
   to the body is not.

**A generator trap worth knowing.** `rebuild-video-summaries.mjs` never lets a
staged `data-cache/generated/<id>.md` overwrite an id that is already in
`src/data/`. Editing a summary *after* the first rebuild therefore changes
nothing. Restore the generated files to HEAD and rebuild, or edit before the
first run.

**Gates:** `lint:video-summaries` 0 errors, 574 warnings against a 572 baseline —
the two new ones are `no sections`, which the *accepted* shipped summary
`zFsNom4JMC8` also raises, so they are the house style rather than a defect.
`lint:all` green, `test:unit` 993/993, `npm run build` green, stats regenerated
(596 → 600 summarised videos). No existing entry was lost: the milk file went
23 → 27.

**Next:** Avian Medicine, 7 recordings, transcripts already on disk. Then Food
Industry (4), One Health (5), Swine Medicine (5), Equine Medicine (5), Zoonoses
(8), Aquatic (9), Epidemiology (12). Nothing needs re-fetching —
`data-cache/transcripts/` holds 695 files covering all ten VET86 year-5
playlists. Write, then fact-check against `data-cache/plain/<id>.txt`, then the
two rules above, then rebuild and ship one subject per commit.

## 2026-09-18 (later) — a subject is never finished, and Avian in progress (Claude)

**Milk Hygiene gained a sixth lecture hours after the first four shipped.** The
owner noticed a topic missing and said it looked like it had appeared about six
hours earlier; re-fetching the playlist found `aZGyfwMEKCM`, "6.Standard of milk
industry and products + Processing", 95,172 characters. The cached four were
lectures 2 to 5 — there is no lecture 1 on that playlist at all.

**So: the cohort uploads as the term runs, and a subject reading `0 todo` in
`npm run video:progress` only means nothing is outstanding as of the last
fetch.** Re-run `node scripts/fetch-video-transcripts.mjs --playlist=<subject>`
before calling a subject done. The progress output now says so itself. Its
plain transcript is ready; the summary is not written.

**Tooling added this session, all of it because the same mistakes kept
repeating:**

- `npm run lint:staged-summaries` — checks a `data-cache/generated/*.md` before
  the generator takes it: middle dots, machine vocabulary, a correction that
  escaped the closing note, front matter, timestamps, length. It earned its
  keep on the first file it ever saw: Avian lecture 1 came back with **279
  middle dots**, lecture 2 with **155**. Both were written from prompts that
  told them the other rules but not that one. **A rule in a prompt is a wish; a
  rule behind a non-zero exit is a rule.**
- `npm run video:progress` — which lectures have no summary, read from
  `src/data` rather than from anyone's memory, and marking the ones that are
  written but not shipped.
- `rebuild-video-summaries.mjs --refresh <id>` — pull a corrected staged file
  back in after its id has already shipped. Without it the fix is silently
  ignored, and once the bad text is in HEAD even restoring the generated files
  does not help.

**Avian Medicine, in flight:** lectures 1, 2 and 3 are written and pass the
staged linter (62.5k, 67.0k and 61.8k characters); lecture 1 is being
fact-checked; lecture 4 is being written; 5, 6 and 7 are not started. Plain
transcripts for **every** remaining VET86 lecture are already on disk, so no
subject needs a fetch except to pick up new uploads.

**Cost, measured on this batch, for whoever plans the remaining subjects:** a
write agent runs about 465-490k tokens and 35 minutes, a fact-check about
460-480k and 10-20 minutes — roughly 950k tokens per lecture. Two agents at a
time is the ceiling that works; four tripped the session limit immediately and
killed all four at once.

## 2026-09-18 — Interactive experience handoff (planning only)

- Owner clarified that interactive includes playful, tactile UI and asked for an actionable handoff. `docs/INTERACTIVE-EXPERIENCE-HANDOFF.md` contains IX-00–IX-08, dependencies, existing source seams, acceptance criteria and release boundaries.
- Direction: a living veterinary study notebook — continuous navigation/item feedback, explorable teaching images, personal Pinboard collections, and contextual Mochi. Existing ripple/tilt/reveal/reading effects and break activities must be reused rather than proposed as absent.
- Documentation only: no application changes, commit, push or deploy. Current summary-pipeline edits belong to concurrent work and were preserved. Next implementer should recheck current source and the user's implementation/release scope, then begin IX-00; this handoff does not establish release authorization or completion.

### Interactive asset preparation (same day)

- Owner requested necessary assets, avoiding generic decorative output. Created `design/interactive-assets-v1/`: 12 original layered SVGs, editable generator, manifest, interaction gallery, PNG contact sheet and integration README. Covers/desk props/stickers/folio/closing card map to IX-02/04/05/06/07. Existing Mochi identity is reused; no clinical teaching imagery was invented.
- File checks and bounded gallery observations live in `verification.json` and `browser-review.json`. Rebuild with `build.mjs`; preview with `preview.mjs`. Sample motion CSS is preview-only and must be adapted to existing application preferences/scopes and real action success.
- No application imports, public asset replacements, commit or deployment. Next: implement from the handoff using this pack selectively; IX-03 needs sourced teaching images separately. Preserve concurrent video-summary work.

### Motion revision 2 after user review

- User asked for larger, smoother and less strange movement. The initial CSS offsets are superseded by explicit SVG rigs plus `motion-model.mjs` / `motion-runtime.js`: spine opening/page turn, connected lamp joints, phased leaves, whole-sticker motion, staged folder opening and a bookmark parented to its card. Gallery supports clicking artwork, horizontal drag, range/keyboard control, interruption and reduced motion.
- Checks: `verify-motion.mjs` samples 132 poses for edge clipping and checks spring settling/reversal and rigid/hinge invariants. Browser checks include actual drag, all 12 native range controls, cancelled drag followed by keyboard activation, and prefers-reduced-motion emulation. See current JSON receipts for exact scope; no app release or measured device-FPS claim.
- Rebuild `build.mjs` after changing motion sources (they are inlined for local HTML compatibility). Runtime is preview-only: adapt it to existing motion scopes and learner-data actions rather than importing its global bootstrap.

### Final asset handoff preparation

- Start at `design/interactive-assets-v1/START-HERE.md`; `INTEGRATION.md` maps assets to IX tasks and existing app seams. `prepare.mjs` rebuilds/checks the pack. Added 24 static rest/open exports and shared spring presets; verification now covers 156 poses including overshoot and all three spring families. Fixed unclaimed pointer drag remaining after release outside the artwork; browser verified subsequent hover does not drag and keyboard still toggles.
- `package.ps1` creates `work/interactive-delivery-20260918/vetmock-interactive-ready.zip` with preview dependencies, notices, handoff and per-file hashes, then reads the archive back to verify it. Check `delivery.json` for the actual receipt. This is the portable review/implementation reference, not an app build.
- Preparation is complete; actual IX implementation, clinical-image selection/review, cross-browser app QA and release remain with the receiving implementation task. No changes to application source, user data, production asset registry or deployment in this preparation.

### Status at 2026-09-18 21:40 — Avian, four written, three checked

Session limit reached; it resets at midnight Bangkok. Banked on disk, all four
passing `npm run lint:staged-summaries` with 0 errors:

| lecture | written | fact-checked | fixes found |
|---|---|---|---|
| 1 ND, IB, ILT, AMPV, pox | yes, 62.5k | yes | 11 |
| 2 Mycoplasmosis | yes, 67.0k | yes | 10 |
| 3 Colibacillosis, fowl cholera, coryza | yes, 61.8k | yes | 9 |
| 4 Avian influenza | yes, 64.5k | **no** | — |
| 5, 6, 7 | no | no | — |

Nothing is committed yet; Avian ships as one commit when all seven are written
and checked. Also uncommitted and waiting to ride along: the three new scripts,
the `--refresh` flag, and a two-dot fix in the Milk `3ihoAGQwxGk` front matter
that the new staged linter found **after** that batch had already shipped —
`lint:video-summaries` reads only the summary body, so front matter had never
been checked by anything.

**Defect classes this course has produced so far**, all now in the write prompts:
inventing a fact; supplying an **English term the lecturer never said** (`synovitis`
for his "ซิโนวี", the species *synoviae* — a different word); printing **units onto
bare numbers** he recited without them; **correcting him towards the textbook in
silence** (Giemsa where he twice said Gram); **deleting a word** to tidy an error;
splicing a quote from two minutes; and **guessing at a garbled word** where
refusing to guess is the correct output. The closing note is not exempt from any
of this — one note warned of a contradiction that existed only because the units
underneath it had been invented.

## 2026-09-18 — MyCourseVille check: four new files on R2, rows not yet inserted (Claude)

Ran the usual pipeline. MyCourseVille now lists **108 files across the 11
current courses**, up from 96 at the 09-09 check. The diff against the shelf
found **4 new, 0 external links pending, nothing duplicated**:

| course | file |
|---|---|
| 3106510 Equine Medicine and Surgery | Eq Respi (5.5 MB pdf) |
| 3107522 Clinical Problem Solving | POA - anorexia and weight loss (1.6 MB pdf) |
| 3109501 Food Industry and QC | AddFile (0.2 MB jpg) |
| 3109504 Zoonoses | Protozoal zoonoses, Dr. Woraporn (7.2 MB pdf) |

The manifest carries the same licence wording the 09-09 and 09-14 batches used
(`instructor-permission`, evidence naming the 2026/1 cohort and stating that no
new instructor statement was collected), dated for today.

**The bytes are on R2 — "4 shelved, 0 failed". The catalog rows are NOT in the
database.** `ingest-library.mjs` only inserts when `SUPABASE_SERVICE_ROLE_KEY`
is present; without it the rows go to `.mcv/rows.ndjson` for a session to load
through the Supabase MCP. That is where they are now, as the last four lines:
`eq-respi-57f2ab`, `poa-anorexia-and-weight-loss-cc16ec`, `addfile-966cb6`,
`protozoal-zoonoses-dr-woraporn-4c615e`.

**Why it stopped there, and what unblocks it.** VetMock's Supabase project is
`mpovsdzdggvksmeehqfj`, and this session has MCP servers for arnfa, cuvetsmo,
miracle and tipjai only — none of them is it (checked: `library_docs` does not
exist in either candidate). The service-role key is not in `.env.local`, not in
the shell, and not in the project's Vercel environment, which holds only the URL
and the anon key. So the insert needs **either** an MCP server pointed at
`mpovsdzdggvksmeehqfj`, **or** `SUPABASE_SERVICE_ROLE_KEY` exported before
re-running the same command — the ingest is content-addressed by sha256, so
re-running it uploads nothing and only writes the four missing rows.

Do **not** re-run the fetch or the upload to fix this. The bytes are already
there; only the four rows are missing.

**R2 credentials note for whoever picks this up:** they are not on disk. They
come from the project's own Vercel production environment
(`R2_ACCOUNT_ID`, `R2_BUCKET`, `CLOUDFLARE_API_TOKEN` — all three pull with real
values, none is marked sensitive). Pull to a temp file, source it, run, delete
the file.

## 2026-09-18 (late) — a ledger for what has been checked, and status (Claude)

**A session was killed with seven avian lectures staged and no record of which
had been fact-checked.** Reading the files did not settle it: fact-checked files
in this subject usually gain an "as heard" caveat, and one file had none, which
could mean unchecked or could mean it needed none. An ambiguous measurement is a
reason to write things down, not to measure harder, so there is now
`data-cache/fact-checked.txt` — one videoId per line, appended by hand when a
check has reported and its fixes are on disk. `npm run video:progress` reads it
and prints **STAGED, NOT fact-checked — do not ship** for anything missing.

It is deliberately hand-written. Whether a summary has been checked is a
judgement someone made; a script can infer that a file changed, not that
anybody read it against the audio. Anything not in the ledger gets checked
again, because a redundant check costs tokens and shipping an unchecked summary
costs a student the exam.

**Status.** Avian all 7 written; 1, 2, 3, 5 checked and in the ledger; 4, 6, 7
in check now. Milk 6 written, in check. Food Industry 1 and 3 checked, 2 in
check, 4 being written. One Health 1, 2, 3, 4 being written. Not started: One
Health 5, Swine 5, Equine Medicine 5, Zoonoses 8, Aquatic 9, Epidemiology 12.

**My own briefs were wrong three times today**, each time by asserting a lecture
contained something it did not — chilling temperatures and carcass pH that the
Food Industry lecturer defers to year 5 five separate times, a section number
and penalty in an hour on a public-health act that contains no four-digit number
at all, and a transcript size off by a factor of two. Every write and check
prompt now ends with a line telling the agent the recording outranks the brief
and to say so when they disagree. All three times the agent followed the
recording and reported the discrepancy, which is the behaviour to keep.

**How to prove an absence.** State the searches and name the false positives.
The lecture-1 check did not say "I could not find a section number", it said
`มาตรา` appears 0 times, the transcript contains no four-digit number, and the
only `บาท` hit is the substring inside **บทบาท**. A grep that returns hits
disproves nothing until you look at what the hits are.

**Marek and the UK.** Avian lecture 5 says at [37:11] that Marek's disease was
named after its discoverer, reported in **1907**, and **first found in the UK**.
The check left it as said and flagged it rather than deciding. It is now a third
closing-note item, because the sentence does not hold together on its own terms:
1907 is exactly the year József Marek, a **Hungarian** veterinarian, described
the disease **in Hungary**, so the year and the attribution are right and only
the country is out of place. The body still says UK. The note is explicit that
this one item needed a fact from outside the recording, unlike the two beside
it, and it carries the usual advice: answer as she taught for this course's
paper, carry Hungary for a textbook or council paper.

Writing that note I made the mistake the prompts forbid: I first quoted her as
"เขาตั้งชื่อมาเล็ก", tidying the audio's garbled
"เขาจ้างชื่อมาเลก" inside quotation marks. Fixed to quote as heard with
the garble named. Quotation marks are a promise about bytes, and cleaning one
word is how the Giemsa-for-Gram class of defect starts.

### Shipped 2026-09-19, and verified by content rather than by bundle hash

Four commits: Milk lecture 6 with the staging gate, the PDF export, seven Avian
lectures, four Food Industry lectures. All three subjects confirmed live —
the content-hashed data chunk built locally is served from production with the
new ids inside it. **The entry bundle hash differed and that proved nothing**;
comparing `main-*.js` would have reported "not promoted" while the content was
already there. Fetch the chunk whose name is a hash of what you shipped.

Sixty defects came out of the seven avian checks, thirty out of the four food
ones, seven out of Milk 6. Two defect classes were named for the first time
today and belong in every check prompt from here:

- **Numbers written off as unusable that were audible all along.** Four in one
  Food Industry lecture, including "ก่อนปี 25" read as noise when it is the
  same two-digit register as "ปี 58", and "19590", which has one digit too many
  rather than too few. This is the mirror of an over-cautious ฟังไม่ชัด.
- **The transcript splits words.** A search for ข้อสอบ missed a real hit
  rendered as "ข้อ สอบ", and a search for CCP hit "HAC CP". Any absence proof
  has to say which spellings it searched and name the false positives, or it is
  only a claim that nothing was found.

Still true and still not done: 388 middle dots sit in shipped summary bodies
across 17 files. Most belong to older content with no staged source, so the
refresh path cannot reach them, and a blind sweep is unsafe because `·` is a
real character in chemical hydrate formulae. It needs its own careful pass.

### 2026-09-19 — four subjects shipped, and two holes on the exam path

Live on production: **Milk lecture 6, seven Avian, four Food Industry, five One
Health** — 22 lectures, each written from the cohort's own recording and read
back against the audio by an independent pass. Roughly 140 defects came out of
those checks. `docs/SUMMARY-CHECK-STANDARD.md` now holds the standard so it
does not have to be retyped into every prompt, and `data-cache/fact-checked.txt`
is a hand-written ledger the generator refuses to ship without.

**Two user-facing bugs, both found because Palm said so.**

The PDF export printed a blank page. The handout rendered inside `.vmx-app`,
and the print sheet hides `.vmx-app`. A descendant of a `display:none` ancestor
is not painted. It now hangs off `<body>` through a portal. **The test could
not have caught it**: it asked `getComputedStyle(doc).display` and got "block",
because that reports an element's own value and knows nothing about a hidden
ancestor. It now measures paint — client rects, height, `checkVisibility()` —
and reverting the portal turns it red.

The answer screen was one chunk away from a deploy. Warming ResultsView and
ReviewView at exam start has been in place since a student was stranded at
submit on 2026-05-08, but **ReviewView lazy-loads ImageAnnotator and QComments
itself and those were never warmed** — the failure had moved one screen later,
not been fixed. `tests/unit/exam-path-prewarm.test.mjs` now reads the dynamic
imports out of the answer path and fails if any is unwarmed.

**On whether a student was hit: the app cannot say who, by design.**
`client-diagnostics.js` records `{release, view, kind, category}` and
deliberately discards messages, stacks, URLs and identifiers, because exception
text can contain a learner's own input. Whether anyone was hit is answerable
from `client_diagnostics` (look for `view` review/results with `kind`
render/rejection); reading it needs the VetMock Supabase, which no MCP here
reaches. Do not route around the anonymity to answer the "who".

**Still open:** Swine (5 written or in flight, checks starting) is the last
subject in this run. Zoonoses 8, Aquatic 9 and Epidemiology 12 are untouched —
about 29 lectures, and starting a subject that cannot be finished wastes the
whole spend, because a half-checked subject cannot ship. The 388 middle dots in
shipped summary bodies still need their own careful pass; `·` is a real
character in chemical hydrate formulae, so no blind sweep.

### 2026-09-19 close — six subjects done, four to go

Live: Equine Reproduction 3, Milk Hygiene 5, Food Industry 4, Avian Medicine 7,
One Health 5, Swine Medicine 5 — **29 lectures**. Left untouched: Equine
Medicine and Surgery 5, Zoonoses 8, Aquatic Animal Medicine 9, Epidemiology 12
— **34 lectures, 2.73M characters of speech**, against 1.50M already done.

Resuming is cheap and does not need this conversation:

- `npm run video:progress` joins the playlists, the transcripts and the shipped
  ids, and prints **STAGED, NOT fact-checked — do not ship** for any draft
  without an entry in `data-cache/fact-checked.txt`.
- `docs/SUMMARY-CHECK-STANDARD.md` is the whole standard. A write or check
  prompt points at it and adds only what is specific to its lecture.
- `rebuild --only <subject>` ships one subject per commit; `--refresh <id>`
  pulls a correction back into a summary that already shipped.

**Two gates were found broken today and both are worth remembering, because
each was reporting success.** The staged-summary linter located the closing
note by the first mention of its name anywhere, so on seventeen of twenty files
its correction check read between three and forty-eight percent of the
document. And the academic-safety lint was one `--apply` from rewriting three
of a lecturer's own words inside quotation marks; it now shields verbatim
speech marked `**"…"**`, on the reasoning already written into it for
filenames.

A green gate is a claim about coverage as much as about correctness. When you
fix one, measure the before and after coverage rather than re-running it and
trusting the same green.

### 2026-09-19 — the bug sweep, and what the timetable settled

Palm sent a queue of screenshots and nine of his own subject summaries with
one rule above the rest: **ห้ามมั่ว, and the current year decides.** The full
queue with evidence is `docs/BUG-SWEEP-2026-09-19.md`. What matters for the
next person:

**The first page of a "Mid 86" summary is a primary source.** Each one carries
the cohort's own course outline or timetable — lecture by lecture, with the
lecturer, and with MIDTERM EXAMINATION printed in its place in the sequence.
That is what settled eight aquatic topics, two equine ones and three zoonoses
ones that were describing the senior cohort's papers. The senior cohort's
folders are not a substitute: Vet 85 sat conservation before their midterm and
shrimp immunology after it, and Vet 86 is the other way round.

**Read a row's own comment before overriding it.** `eqrepro-endometritis`
carries `/* lecture 7 = ปลายภาค (Course Schedule 2026) */`. A pass that knew
the lecture number beat an inference from a deck title, and the change was
reverted. Rows that carry a lecture number are the strongest scope evidence in
the file.

**The two examScope fields answer different questions.** A topic's is this
year's timetable. A question's is the paper it was recorded from. They are
intersected now: a question cannot sit on a paper its own lecture is not on.
`node scripts/audit-scope-contradictions.mjs` prints every disagreement; it was
79 before this sweep and 37 after, and most of what is left is `both` against a
specific paper, which is harmless.

**MyCourseVille reaches the current syllabus.** `.mcv/dump-current.json` already
holds this semester's listings; the Zoonoses and One Health syllabi and the
Avian timetable are files in it. A Thai filename arrives with its characters
escaped as `u0e15...` and 403s — `repairMcvUrl` in `scripts/ingest-library.mjs`
is the fix.

**A number next to a button must count the pool that button will serve.** Three
separate bugs this sweep were the same bug: the subject card counted the whole
subject, the reading list counted the whole year, and Panic counted 158 on the
card and 302 on the next screen. `tests/e2e/counts-agree.spec.js` now walks that
chain and insists the number does not change.

**A serverless function with no `maxDuration` gets ten seconds.** `study-coach`
waited thirty internally, so every long review was cut off mid-flight and the
browser saw a 504. Check the export before blaming the model.

### 2026-09-19 — unfinished: four MyCourseVille files are on R2 but not on the shelf

`npm`-side is done; the INSERT is not, because no Supabase MCP in that session
reached VetMock's project (`mpovsdzdggvksmeehqfj` — the four configured ones are
cuvetsmo, miracle, tipjai, arnfa), and no service-role key exists in any Vercel
environment for it.

The bytes are uploaded and addressed by hash. What remains is one statement:

```
.mcv/insert-0919.sql        ← 4 rows, guarded by `not exists (sha256_16 or slug)`
```

It is idempotent, so running it twice is safe. The four files:

| file | subject | note |
|---|---|---|
| Eq Respi | equine-medicine | the 2026 course links a file that lives under the 2025_1 folder; said so in its description rather than restamping the year |
| POA - anorexia and weight loss | poa-clinical | |
| Protozoal zoonoses (Dr. Woraporn) | zoonoses | |
| อินโฟกราฟิก มูลค่าผลผลิตการเกษตรโลก 2024 (FAO) | food-industry | MyCourseVille called it **AddFile**, which is its placeholder, not a title — a student cannot search for that. Renamed from the image itself. |

A previous pull on 09-18 found the same four and stopped at the manifest: it
wrote `.mcv/manifest-0918.json` and never produced rows or SQL, and nobody
noticed because the diff prints "NEW: 4" and exits 0 either way. If a pull ends
without an `insert-<date>.sql`, it did not finish.
