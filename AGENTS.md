# AGENTS.md — VetMock Project Guide

## System stability candidate — 2026-10-09 (Codex)

- Isolated `codex/system-stability-1009`, base main `14a62d02`; candidate Study5.141.6/SW217 is not released. Primary dirty work and Research M3a are preserved. Root is sole release owner; shared claim remains primary `work/loop-20260930/COORDINATION.md`.
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
- **Current source version**: `version` in `package.json`; the newest release note is the top entry of `src/data/changelog.js`. Verify exact-SHA CI/deployment and live flow before describing production as current.
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

- **A `main` push is the deploy.** One coordinated real commit; no `vercel --prod`
  on top, no empty redeploy commits. A push is not production proof.
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
| VetMock Research | `research/` is a separate Vite app/origin; `docs/research/M1-DESIGN.md` + `M2-DESIGN.md` define contracts. Computation and datasets stay on device; optional auth has its own session. |
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
npm run gate             # Data/unit in Bangkok + UTC, build, contrast, all four E2E profiles
npm run gate:data        # Fast data/unit diagnosis; does not replace the full release gate
npm run test:e2e          # Cross-browser Playwright suite
npm run test:e2e:prod     # Live flows against vetmock.com
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
| Product entry / study runtime | `vetmock.com` (legacy `vetmock.vercel.app` has the migration relay) |
| Research domain | `research.vetmock.com` |
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
