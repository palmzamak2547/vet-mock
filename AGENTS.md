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
| Styles (all CSS) | `src/styles.css` + `src/styles-landing.css` |
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
