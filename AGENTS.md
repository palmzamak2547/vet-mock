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
| Vercel serverless functions | `api/*.js` (wiki-explain, tts, library-file/blob, send-feedback, …) |
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
- Traps worth remembering: PowerShell `Get-Content`/`Set-Content` round-trips CORRUPT Thai source - use Python with explicit utf-8 or the editor tools; `PINBOARD_MAX` is exported, not `MAX_PINS`, and Vite ships an undefined identifier silently; `overscroll-behavior: contain` belongs to overlays only, never an in-page panel.
