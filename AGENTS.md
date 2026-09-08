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
- **Current source version**: v5.85.0 (2026-09-08); verify exact-SHA CI/deployment and live flow before describing production as current.
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
