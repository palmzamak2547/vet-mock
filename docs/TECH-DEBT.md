# Technical debt map, ranked (measured 2026-10-20)

Measured on branch `claude/release-pipeline-v2` from origin/main `58d6fbaa`, on Palm's Windows
machine unless a line says CI. Ranked by value over cost: what it costs every session or every
student, against the work to remove it. Re-measure before acting on any line; numbers drift.

| # | Debt | Measured | Fix | State |
|---|---|---|---|---|
| 1 | `provenanceSummary` written twice (`src/lib/vetwiki/index.js`, `runtime.js`) and the copies disagreed: the browser one counted every claim as "checked", the other only verified ones | 2,984 of 2,984 claims are verified today, so students see the same number; the first unverified claim would have been shown as checked | One `summarizeProvenance` in `schema.js`, each caller passes its source resolver; unit test pins verified-only | Fixed (488ebb99) |
| 2 | Local release gate ran the full e2e matrix | ~70 min (e2e ~65) on 20 Oct with five gates sharing the machine; Firefox took 23.6 s to open a tab | `npm run gate`: phases A-C, Research, then Chromium on smoke plus changed specs; full matrix in CI (7 runners, ~8-9 min) and `gate:full` | Fixed: 541 s green (A 249, B 45, C 92, E 53, D 101) |
| 3 | Every release edited `changelog.js`, `latest-changelog.generated.js`, `package.json` version and `LAUNCH_READINESS.md`; sessions agreed numbers by message | 5.148.0 touched all five (550c4e03) | One file per release in `src/data/changelog/`, `npm run release:new` picks the number, derived modules gitignored, proof in `docs/releases/` | Fixed (42a87bea) |
| 4 | e2e tests near their timeout | WebKit "core mobile journey" 26.4-27.9 s of 30 (93%), ~12 s of it waiting for animated buttons to settle before clicks | Reduced motion in that content journey: 12.0-12.4 s (40-41%). CI now warns at 40% on every test (`scripts/e2e-durations.mjs`) | Fixed (074edb31); the rest wait for the first CI duration report |
| 5 | Every worktree's e2e preview on port 24731, so a second gate failed at once | 6 worktrees on 20 Oct | Ports from the worktree path, 25000-27999 | Fixed (66b17871) |
| 6 | Vercel previews for Research on non-agent branches | 2 billable preview builds on `ccr-207d6695-bl2wyq` (17 Oct) | `research/vercel.json` builds production only, like the other two | Fixed (70069292) |
| 7 | Files too large to review or own | Hand-written: `src/lib/vetwiki/sources.js` 24,947 lines, `PdfAnnotateView.jsx` 2,716, `HomeView.jsx` 2,340, `CommandPalette.jsx` 1,896, `user-data-sync.js` 1,816, `vetwiki/corrections.js` 1,805 | Split by concern when next touched (sources.js by subject, as runtime-data already is); a line-count ceiling lint that only lets them shrink | Open |
| 8 | Notes-by-subject map copied into `vetwiki/index.js` (its own comment says it mirrors NotesView) | 30 notes modules imported eagerly there; the browser path already uses `note-corpus.js` | Build-time API reads `note-corpus.js` too; one map | Open |
| 9 | Chunks carrying more than they need | First load 6 JS files, 659 KB on disk (minified, before compression); `AdminView` 659 KB (whole changelog history), `data-instructors` 1,160 KB, `vendor-cornerstone` 1,688 KB (both lazy); 1,015 JS files, 52 MB in dist | AdminView loads the history list on demand; instructors per subject | Open |
| 10 | Unit suite is the longest phase A step | 173-249 s per timezone, run twice in parallel; 438 test files | Profile the slowest files (`node --test --test-reporter=spec`), move fixture-heavy suites (gate, native-artifacts) behind one shared temp repo | Open |
| 11 | `AGENTS.md` mixes rules with dated release logs | 526 lines, 24 sections, the first ~50 lines are release history | Release history goes to `docs/releases/`; the guide keeps rules and pointers | Open |
| 12 | A merged PR is tested twice | Squash merge makes a new SHA, so CI runs again on main (~9 min) before Vercel promotes, on a tree the PR already tested | Accept for now (it also proves the exact deployed SHA); revisit if promotion latency matters | Accepted |

Cost of a new worktree, for planning lanes: `npm ci` 28 s with a warm npm cache (436 packages),
plus `npm ci` in `research/` when a lane touches it.

The two cheapest high-value items were fixed in this pass: #1 (a latent overclaim on a page
students read) and #4/#5 (the gate's two machine-level failures). Items 7-11 are proposals.
