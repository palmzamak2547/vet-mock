# VetMock — UX / Frontend Audit

> **Current closure 2026-08-21 (v5.31.0):** the live product now uses the calm
> Thai-first hierarchy introduced in v5.30.0, lazy subject Notes shared with
> VetWiki, explicit loading/offline/retry states, and schema-validated backup
> previews. The Notes view gzip chunk is 94.3% smaller. Release proof is 218
> unit tests, all integrity gates, GitHub E2E 144 passed / 40 intentional skips,
> and 20/20 targeted production journeys. The audit below is retained as dated
> rationale, not as a current defect list.

> **Implementation update 2026-08-12 (v5.27.0):** the original audit below is
> historical. Vite is now 6.4.3. Readable `/app/*` routes resolve finding 9;
> shared `StatePanel` plus retry states address the highest-value part of 11/12;
> legacy public/admin/orphan runtime routes were removed from the bundle (13/15);
> app-wide modal focus behavior, form labels and 44px touch fixes complete the
> scoped WCAG pass. Full release proof: 196 unit tests and 120 cross-engine E2E
> tests passed, with 28 layout tests intentionally skipped on inapplicable mobile
> projects. Remaining inline-style/font consolidation items are maintainability
> debt, not launch blockers.

> Grounded audit of the live codebase (read-only, `file:line` evidence).
> Method: 6 parallel dimension auditors over the real repo + a synthesis pass.
> Date: 2026-07-24. Stack (verified): **React 18.3.1 + Vite 5.4.8**, plain JS/JSX
> (no TS in app code), Supabase auth, state-based view switching (no react-router),
> PWA. This document is the input to [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

## TL;DR

The foundation is **stronger than a redesign brief assumes** — the correct
strategy is *extend, don't rebuild*. The token system, the accessibility layer,
the exam session engine, lazy-loading, and the feature-registry single-source
are all genuinely good and are on the **preserve list** below. The real problems
are (a) one broken primary-nav destination, (b) the mobile navigation gap,
(c) an unguarded exam submit, and (d) design-system *scale* debt (inline-style
sprawl + missing token scales) that blocks any systematic restyle.

## Preserve (do NOT break in the redesign)

| Thing | Where | Why it stays |
|---|---|---|
| CSS custom-property token system + dark + 5 palettes | `styles.css:14-160` | semantic `--clr-*`, full `[data-theme=dark]` inversion, palettes only swap accent so contrast never breaks. **Extend, don't replace.** |
| a11y layer | `styles.css` | 44px touch floors, `.vmx-skip-link`, `:focus-visible`, `prefers-reduced-motion`, iOS 16px inputs, `env(safe-area-inset)`, `overflow-x:clip` safety net — accreted over many audits |
| Exam session engine | `useExamSession.js`, `App.jsx:810-849,1356-1372` | 500ms debounced autosave to `vmx-inflight-exam`, boot resume-detect (6h stale auto-clear), "tag submitted don't delete" recovery. Any new exam surface must reuse this lifecycle. |
| Guarded exits | `ExamView.jsx:20-26`, `App.jsx:516-535` | X button + browser-back both confirm and re-push exam state |
| Keyed ErrorBoundary + skeleton Suspense | `App.jsx:1701-1747` | crash-in-one-view auto-resets on nav via `key={view}` |
| Lazy views + manualChunks | all 43 views, `vite.config.js` | single active view mounts, first-paint ~500KB. Do not collapse to eager/router-mounted trees. |
| feature-registry single source | `feature-registry.js:56-295` | 29 features feed HomeView grid + ⌘K + ToolsFAB with no drift. New nav must render **from** it, never a parallel list. |
| AuthView state model | `AuthView.jsx` | styled error/info/loading, rate-limit countdown, OAuth-cancel detection — the template for styled states elsewhere |
| VetWiki real paths | `lib/vetwiki/url.js` + vercel rewrite | correct deep-link pattern; the template the app-wide VIEW↔PATH map should generalize |

## Findings (ranked by user impact)

> **Status 2026-07-31:** findings 1, 2, 3 and 10 are RESOLVED (see notes inline).
> Numbers below are as-measured on the audit date and are not re-counted.

### P0 — broken core flow
1. ✅ **RESOLVED.** ~~**Primary-nav "Mock Exam" opens an unwired demo stub.**~~ `App.jsx:1742` renders
   `<MockExamView/>` with no session/questions/onSaveChoice → `MockExamView.jsx:8`
   falls back to 2 hardcoded English "DEMO ONLY" bird questions; `MockResultsView`
   always shows 2/2. Only entry is the desktop `Sidebar` (hidden <1024px) and it's
   absent from ⌘K. → **Phase 2**: wire to real data through the `vmx-inflight-exam`
   lifecycle, or feature-flag it out of nav until wired. Do not ship the stub in
   primary nav.
   → **Done:** nav goes through `config` into the real exam engine;
   `MockExamView.jsx`/`MockResultsView.jsx` are deleted and a history guard
   bounces stale `mock-exam` entries home.

### P1 — major UX / architecture
2. ✅ **RESOLVED.** ~~**No mobile bottom nav; desktop/mobile expose different destinations.**~~ The real
   section nav (`Sidebar`) is `display:none` <1024px (`styles.css:340`); no BottomNav
   existed. → **Done:** `src/components/BottomNav.jsx` renders below 1024px and both
   navs read the same model from `src/lib/nav.js`, so they cannot diverge.
3. ✅ **RESOLVED.** ~~**Final MCQ submit has no confirmation / unanswered guard.**~~ `ExamView.jsx:112` +
   `App.jsx:908-910` bind Space/Enter/ArrowRight to submit the whole exam on the last
   question; the *mock* engine already confirms (inconsistent). `answered/remaining`
   already computed in `NavGrid.jsx:130-131`. → **Phase 2**, additive confirm modal +
   re-entry latch in `finishExam`. → **Done:** styled confirm showing
   answered/remaining, plus a `finishingRef` latch so a timer timeout and a user
   submit cannot both finish the same session.
4. **Design-system scale debt blocks systematic restyle.** 2,634 inline `style={{}}`
   across ~103 files (was 1,835 on 2026-05-18) + **no** spacing/z-index/motion token
   scales; z magic values 50→9999 in CSS and up to 1600 in JSX; radius has 2 tokens
   for 9 in-use values; 8 near-identical card families. → **Phase 1** (token scales
   **added 2026-07-24**; utility layer + card base + migration next).
5. **233 hardcoded hex in JSX won't dark-flip.** Worst: `LabView.jsx` (~50, a
   *deliberate* dark clinical theme = intentional exception), `LandingBody.jsx` (18),
   `PomodoroView.jsx` (15). → **Phase 2** bulk hex→var. Imaging intentionally stays split: a focused local Practical plus the separate full Pro product.
6. **Sarabun double-loaded + redundant second Thai family.** `styles.css:267-313`
   self-host 6 TTF `@font-face` while `index.html:52-67` *also* pulls Sarabun from
   Google Fonts; `public/Sarabun` ships 17 TTF (~1.4MB, 6 referenced) + a duplicate at
   repo root. → **Phase 1** consolidate to one woff2 source + preload (needs Thai
   glyph QA).
7. **HomeView (1962 lines) not memoized** → full re-render on Supabase Presence sync +
   per-second exam timer (`HomeView.jsx:54`, `useOnlineCount.js:62-68`). → **Phase 4**.
8. **HomeView is "everything at once"** — ~10 stacked sections, ~5 redundant practice
   launchers, no clear primary action. → **Phase 3** progressive disclosure.
9. **State-based routing: ~40 of 43 views not deep-linkable**; refresh drops to
   home/year-select (`App.jsx:1703-1745,488-504`). → **Phase 1** VIEW↔PATH map
   (generalize the VetWiki pattern; keep pushState, no react-router).

### P2 — polish / consistency
10. ✅ **RESOLVED.** ~~**42 native `alert()/confirm()`**~~ in critical flows (exit exam, empty pool,
    dashboard resets, logout) break the warm-editorial look. Standardize on the
    existing `vmx-modal-overlay`. → **Phase 3**.
11. **Empty-pool / QB-load-failure dead-end into `alert()`** with no in-view retry
    (`App.jsx:1116/1217/1221-1224`). → **Phase 3**, model on `ReviewView.jsx:282`.
12. **Loading inconsistent** — real skeleton only for chunk-load; data views + boot use
    text "กำลังโหลด…" (contradicts the team's own "lists never spin" rule). → **Phase 4**.
13. **Two competing "wiki" destinations** — `PublicWikiView` (header 📖/Sidebar) vs
    `KnowledgeView`/VetWiki (registry card + ⌘K); no cross-link. → **Phase 3**.
14. **Resume card lost its "discard/start fresh"** — `dismissPendingExam` wired but its
    UI is dead-coded behind `{false && …}` (`HomeView.jsx:652-699`). → **Phase 2**.
15. **Two orphan views** — `domain-detail` and `admin` are rendered but unreachable;
    `AdminView.jsx` still checks Clerk `publicMetadata` (stale vs Supabase). → **Phase 1**.
16. **LabView `minmax(420px,1fr)` clips on phones** (`overflow-x:clip` hides it);
    exam bookmark/note buttons shrink to 32×32 below the 44px floor
    (`styles.css:997-998`). → **Phase 3 / Phase 4**.

## Risks carried into the plan
- **z-index** is the highest-risk foundation item — a new bottom-nav/toast/modal will
  fight the existing stack unless the `--z` ladder is adopted first (**added 2026-07-24**).
- 2,634 inline styles mean a broad restyle touches JSX, not CSS — migrate incrementally
  (top-5 files pilot), keep builds green.
- Keep the two imaging products intentionally distinct: VetMock owns the focused,
  approachable Practical at `#lab`; `imaging.cuvetsmo.com` owns the full Pro
  workstation and advanced clinical workflows.
- Touching the exam submit keybinding or `finishExam` risks the autosave/resume/
  leaderboard contract — add confirm/latch **additively**, regression-test resume + score.
- Per-view URLs must preserve the `FOCUS_VIEWS` gate + mid-exam popstate confirm, or
  nav reappearing / back-swipe mid-exam becomes data loss.
- Font consolidation needs Thai glyph + tone-mark QA after dropping the second family.

## Gaps in this audit
The `a11y` and `stack-arch` dimension agents misfired (one returned a schema stub, one
hit the structured-output retry cap). Their scope is substantially covered by the
design-system, responsive-perf, ia-nav and ux-states findings above; a dedicated
WCAG 2.2 pass is scheduled as **Phase 4** where a11y is the explicit focus.
