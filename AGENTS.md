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
- **Stack**: React 18 + Vite 6.4.3 + Supabase (auth/DB) + PWA · plain JSX app code, TS only at the edges (`supabase/functions/*`)
- **Current source version**: `version` in `package.json`; the newest release note is the top entry of `src/data/changelog.js`. Verify exact-SHA CI/deployment and live flow before describing production as current.
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
- ❌ Root causes and mechanism: no "สาเหตุคือ…", no model or quota talk. Each change is a title
  plus at most two sentences, 300 characters at most, on what the student will notice.
  `tests/unit/changelog-voice.test.mjs` enforces the voice from 5.124.0 and the length after 5.128.0.
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

## 🗂️ Where Things Live

| What | Where |
|------|-------|
| Routing/state | `src/App.jsx` + `src/lib/view-route.js` (`view` state; readable stable `/app/*` routes) |
| Views (lazy) | `src/views/*.jsx` |
| Mochi / Motion | `src/components/Mochi.jsx` + `src/lib/mochi-presence.js` embed contextual companions in existing views; one device preference hides all; 3D stays on demand in `/app/mochi`. Exam feedback requires a revealed practice answer; focused drawing/imaging workspaces stay clear. |
| Motion in real flows | `MotionFeedback.jsx` owns visual responses on real controls; `ReadingEffects.jsx` enhances actual Notes/VetWiki text; `FocusBackdrop.jsx` + `StudyBreak.jsx` follow Pomodoro state. Global settings live in ThemePicker. See `docs/motion-kit-real-usage.md`; preview actions are never evidence of a real save or answer. |
| Vercel serverless functions | `api/*.js` (wiki-explain, study-coach, grade-summary, tts, library-file/blob, send-feedback, …) · shared model chain in `api/_lib/llm.js`, output guards in `api/_lib/grounding.js` |
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
| Styles (all CSS) | `src/styles.css` + `src/styles-landing.css` + `src/styles-admin.css` (`.ad-*`, the back-office only) + `src/styles-atlas.css` (AtlasView) + `src/styles-motion-kit.css` (MotionLoader, MotionSurface, StudyBreak) |
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

---

## 🗒️ Session log

**Latest state.** The newest archived entry is *2026-09-23 — Equine Med Surg and Equine
Reproduction* (the two papers shipped as 5.127.0), at the end of
[`docs/handoff/2026-09.md`](docs/handoff/2026-09.md). Entries below this section are
newer. Read the newest few before resuming work; the open follow-ups are recorded in them.

**Archive.** Every dated entry from 2026-09-06 to 2026-09-23 was moved verbatim, in its
original order, to [`docs/handoff/2026-09.md`](docs/handoff/2026-09.md). Code comments
that cite "AGENTS.md" with one of those dates (`src/data/exam-origins.js`,
`scripts/lint-provenance.mjs`, the `questions-mid86-*.js` headers) mean that file.

**Adding an entry.** Append it at the end of this file, dated, newest last. When this
file passes about 400 lines, move the dated entries verbatim into
`docs/handoff/<yyyy-mm>.md` and update the two paragraphs above.
