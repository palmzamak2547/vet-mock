# Stability Guardrails — VetMock

Architectural patterns that have caused recurring bugs. Each entry has a
1-line rule, the bug it prevents, and a concrete example of the wrong code.

This file exists because Palm's app stability matters more than clever
optimizations. When in doubt, choose the boring stable pattern.

---

## Exam clocks and library snapshots (2026-09-05)

- Timed questions retain `questionDeadline` in the in-flight snapshot. Derive
  the remaining seconds from wall time; background tabs do not receive reliable
  timer callbacks. A delayed skip confirmation must check the current question.
- Only `42P01` and `PGRST205` mean a missing library table. Permission failures
  and database outages must remain retryable errors, not an empty catalog.
- Persist only public library metadata and clear empty snapshots. Account
  changes invalidate both the catalog and prefetched document URLs.
- Original Drive documents open as validated external links, never as PDF bytes.
  Duplicate binary copies retain their alternate source links on one card.

## 0. Shared dialogs use `useModalFocus` — DO NOT reimplement focus traps

**Rule:** every modal dialog uses `src/hooks/useModalFocus.js`, carries
`data-vmx-modal="true"`, a dialog name, `tabIndex={-1}`, and lets the hook own
Escape/Tab/focus restoration. Nested dialogs depend on that marker to ensure
only the top-most dialog responds.

**Why:** local `keydown` handlers repeatedly lost focus when a conditional step
unmounted its focused control, and iOS/WebKit taps can leave `activeElement` on
`body`. The shared hook captures the real pointer launcher and has cross-engine
regression coverage.

## 0.1 Stable views own canonical routes; stateful flows do not

**Rule:** add shareable destinations through `src/lib/view-route.js`. Do not add
active config/exam/results screens to the map unless their complete state can be
reconstructed from the URL. Add the matching Vercel rewrite and route tests.

## 0.2 Browser projections are generated, never hand-edited

**Rule:** canonical VetWiki notes/evidence remain the editing source. Update
browser chunks with `npm run regen:wiki-runtime`; `lint:wiki-runtime` must catch
changed, missing and extra generated files before release.

## 0.3 Notes use one lazy corpus map — never rebuild it in a view

**Rule:** `src/data/note-corpus.js` is the only browser source map for
`notes-*.js`. NotesView, VetWiki runtime, and `regen-notes-registry.mjs` must
consume it rather than maintain parallel subject maps.

**Why:** NotesView previously imported more than 30 note files eagerly. Its
gzip chunk reached 631,956 bytes and its map could drift from VetWiki/registry
availability. v5.31.0 reduced the view chunk 94.3% and made all three consumers
share the same lecture-first merge policy.

**Retry invariant:** a rejected loader promise must be evicted. Native ESM also
caches a failed import for the document lifetime, so online retry preserves the
subject in `src/lib/note-retry.js` and reloads. `vite:preloadError` must not
mistake a genuinely offline device for a stale deploy.

## 0.4 Imported JSON must validate before any user-data setter runs

**Rule:** Dashboard backup and Question Manager imports go through
`src/lib/user-data-schema.js`. Never write parsed-but-unvalidated JSON directly
into bookmarks, history, notes, SR cards, streaks, or custom questions.

**Why:** a valid JSON file can still carry the wrong shape and silently replace
working local/cloud data. Validation must fail closed, respect explicit empty
arrays, preserve legacy-safe defaults, cap file size, and preview the exact
overwrite scope.

## 0.5 Internal Markdown can skip deploy; `wiki/**/*.md` cannot

**Rule:** Vercel `ignoreCommand` may exclude root/docs/internal Markdown, but it
must leave `wiki/**/*.md` deploy-worthy because the build prerenders those files
into public pages.

**Bug caught (2026-08-21):** the old blanket `:(exclude)*.md` treated a Wiki
content change like an internal README edit. A docs commit could be correct in
Git while production kept the previous prerender forever.

---

## 1. `::before` / `::after` pseudo-elements with negative `inset` to
##    expand hit-zone — BANNED

**Rule:** Never use `::before { position: absolute; inset: -Npx }` to
expand a button's touch area without inflating its visual box.

**Bug it caused (2026-05-24):** `.vmx-link-btn::before { inset: -10px }`
was supposed to give compact pills a 44px touch zone invisibly. Two
failure modes hit production:

1. **`position: relative` escaped by inline `all: 'unset'`.** Several
   `.vmx-link-btn` buttons use `style={{ all: 'unset', ... }}` which
   resets `position` to `static`. The `::before { position: absolute }`
   then resolves against BODY → fills the whole viewport → every click
   anywhere on the page lands on this overlay → routed to the pseudo's
   parent button. Palm: "กดตรงไหนก็ชอบไปหน้าเลือกช่วงสอบ" (clicking
   anywhere navigates to phase-select).
2. **Even with positioning fixed, the expansion overlaps neighbors.**
   Header pills are 11 px apart → phase pill's `::before` covered part
   of year pill → taps on year pill landed on phase pill.

**Why pseudo elements own clicks:** A `::before` of element X is part
of X's pointer-event surface unless `pointer-events: none` is set. But
setting that defeats the whole purpose of the expansion.

**Stable replacement:** Give the host element actual `min-height` +
`padding`. Visual grows slightly; clicks are reliable.

```css
/* ⛔ BANNED */
.compact-btn { /* visual 14px */ }
.compact-btn::before { position: absolute; inset: -15px; content: ''; }

/* ✓ STABLE */
.compact-btn {
  min-height: 36px;       /* visual + tap reliability */
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
}
```

---

## 2. State that bleeds across navigation — RESET ON EVERY ENTRY

**Rule:** When a user enters a new flow (clicks a subject card, picks a
phase, opens a view), explicitly RESET any state that the previous flow
set implicitly. Sticky state is invisible and breaks intent.

**Bug it caused (2026-05-20):** Palm clicks "🎯 ทบทวนข้อที่ตอบผิด" →
`setPracticeMode('wrong')` → goes back home → clicks COM I subject →
ConfigView → "🚀 เริ่มฝึก". `startExam` reads stale `practiceMode='wrong'`
and builds the pool from wrong-history only, ignoring the freshly picked
subject. Pool ends up empty → alert "ไม่มีข้อสอบในหมวดนี้". Looked like
a data bug; was a state-management bug.

**Stable pattern:** at every fork in the navigation tree where the user
makes a new pick, reset *implicit* state. Don't rely on the next view
to defensively re-read the right values.

```jsx
// ⛔ Subject click that ONLY sets subject
onClick={() => { setSubject(s.id); setView('topic-select'); }}

// ✓ Subject click that resets implicit modes too
onClick={() => {
  setSubject(s.id);
  setPracticeMode('all');  // ← reset sticky mode from HomeView shortcuts
  setTopic(null);          // ← clear any stale topic from a prior flow
  setView('topic-select');
}}
```

**Belt-and-suspenders defense** in `startExam` (App.jsx):

```js
// If subject picked explicitly AND mode is sticky user-curated, force 'all'.
if (!explicitMode && _subject !== 'all' &&
    (_practiceMode === 'wrong' || _practiceMode === 'weak' ||
     _practiceMode === 'bookmarks')) {
  _practiceMode = 'all';
}
```

---

## 3. `!important` should be used SPARINGLY — only for a11y floors

**Rule:** `!important` is a debugging crutch that hides the real
specificity problem. Use it only when:

1. Enforcing a WCAG-mandated floor (e.g. min-height for touch).
2. The override target is inline-styled and there's no other way.

For everything else, fix the selector specificity. Documented bug:
my round-3 `:where(...)` rule had zero specificity and lost to a
later `.vmx-btn-sm { min-height: 36px }` rule. The fix wasn't
`!important`; it was reorganizing the rules so the floor comes
after the per-class overrides AND using a non-`:where()` selector.

---

## 4. Touch targets — visual size = tap size; don't fake it

**Rule:** A button's hit area is its CSS box. Don't try to expand
the tap area beyond the visual. If WCAG 44px conflicts with design,
choose ONE:

- Visual 44px (boring but correct)
- Visual 36px (workable compromise; WCAG 2.5.8 has exceptions for
  inline links + essential controls)
- Visual smaller than 36px (only for tertiary actions, document the
  a11y debt)

Never use the `::before` hack (see rule 1).

---

## 5. ~~CSS rules inside JS template literals — NO BACKTICKS IN COMMENTS~~ ✅ RESOLVED 2026-05-27

**RESOLVED:** `src/styles.js` (a backtick template-literal export) was
converted to a real `src/styles.css` file, imported via `import
'./styles.css'` in App.jsx. CSS lives in a `.css` file now — backticks,
`${...}`, and any character are safe inside CSS comments. The entire
bug class is gone; there is no template literal left to break.

Bonus wins from the conversion:
- index JS chunk dropped ~48 kB (the 48 KB CSS string is no longer
  baked into the JS bundle — it's a separate cached stylesheet).
- Stylesheet loads in `<head>` before JS runs → better FOUC behavior
  (was injected at React render time via `<style>{STYLES}</style>`).

**Original rule (kept for history):** backtick characters inside the
CSS string — including in comments — used to terminate the template
literal early and fail the build. Caught twice (r3, r6 of touch-target
work). Vercel would silently fail-and-skip → old broken deploy stays
live → looked like a non-bug to the dev while production stayed broken.
This is why the pre-commit checklist still says "run build locally" for
any CSS change, but the specific backtick trap no longer exists.

---

## 6. CSS modern features — provide longhand fallback for `inset`

**Rule:** The CSS `inset` shorthand requires Safari 14.1+. iOS 13-14.0
users (~2-3% of mobile market) ignore the rule. If `inset` is used for
positioning (not just margin), provide the longhand `top/right/bottom/left`
FIRST so older Safari has something to use:

```css
/* ⛔ Safari < 14.1 sees nothing */
.x { position: absolute; inset: 0; }

/* ✓ Universal */
.x { position: absolute; top: 0; right: 0; bottom: 0; left: 0; inset: 0; }
```

JSX inline styles follow the same rule. React doesn't dedup inline
style keys — both declarations are written.

---

## 7. `target: 'esnext'` in Vite — DON'T

**Rule:** Always pin Vite `build.target` to a concrete ECMAScript
version (e.g. `es2020`). `esnext` means "newest spec features, no
transpile" — could emit syntax (top-level await, logical assignment
`||=`) that older iOS Safari can't parse → blank screen on iPhone with
no error in dev.

Current setting: `target: 'es2020'` + `browserslist` includes `ios >= 14`.

---

## 8. Service Worker version bump on every CSS/JS-shape change

**Rule:** When you change CSS rules or the index chunk hash, bump
`SW_VERSION` in `public/sw.js`. The SW caches assets by content hash
but indexes them by URL — without a bump, returning users get a mix
of new code referencing old chunks → cryptic errors.

Format: `vN-YYYY-MM-DD`. Current: `v89-2026-08-21`.

---

## 9. Build verification before push (universal)

**Rule:** When touching `src/styles.css`, `vite.config.js`, or
`package.json`, run `npm run build` locally before commit. If the
build breaks, the next commit-push fails-silently at Vercel and the
previous (possibly broken) deploy stays live.

---

## 10. Question-bank changes — `option` text trimming

**Rule:** When trimming a Q's correct option for length-bias lint
(see `scripts/lint-questions.cjs --triage`), NEVER touch the answer
index. The shuffle in `Question.jsx` already handles position bias;
your job is purely to balance string lengths.

```js
// Q1075 - WAS: 162 chars correct vs 30 mean distractor
// SAFE TRIM (this commit OK):
options: ['Only one virus', 'Multifactorial', 'Just genetic', ...]
// ⛔ NEVER (changes meaning):
options: [...],
answer: 2,  // ← changing this would re-key history + break replay
```

---

## 11. Trigger-anchored popovers — use `useDropdownAnchor` hook

**Rule:** Any `position: absolute` dropdown anchored to a trigger
button (theme picker, user menu, XP chip, etc.) MUST use the
`useDropdownAnchor(wrapRef, open, minWidth)` hook from
`src/hooks/useDropdownAnchor.js`. Never hardcode `right: 0` or
`left: 0` without considering where the trigger lands on mobile.

**Bug it caused (2026-05-24):** ThemePicker hardcoded `right: 0`.
On desktop the theme button is on the right of the header → drop
extends leftward, fits fine. On mobile the same button is at x=16
from the LEFT viewport edge → dropdown extends 220px LEFTWARD →
160px goes OFF the left side of the viewport. Palm: "กดเปลี่ยน
theme กลายเป็นว่าตัวเลือกที่ให้เปลี่ยนโดนบังเพราะอยู่ขอบจอซ้าย".

Same hardcoded pattern in 3 places (ThemePicker, UserMenu, XpChip).
ToolsFAB was safe because it uses `position: fixed; right: 16`
(viewport-anchored, not button-anchored).

**Correct usage:**
```jsx
import { useDropdownAnchor } from '../hooks/useDropdownAnchor.js';

const wrapRef = useRef(null);
const MIN_WIDTH = 220;
const anchorSide = useDropdownAnchor(wrapRef, open, MIN_WIDTH);
// ...
<div ref={wrapRef} style={{ position: 'relative' }}>
  <button onClick={() => setOpen(o => !o)}>...</button>
  {open && (
    <div role="menu" style={{
      position: 'absolute', top: 'calc(100% + 6px)',
      ...(anchorSide === 'left' ? { left: 0 } : { right: 0 }),
      minWidth: MIN_WIDTH,
      maxWidth: 'calc(100vw - 24px)',  // viewport safety net
    }}>...</div>
  )}
</div>
```

The `maxWidth: 'calc(100vw - 24px)'` is a defense-in-depth — even
if a future redesign pushes minWidth past viewport-24, the dropdown
shrinks rather than clipping. The hook handles the LEFT vs RIGHT
anchor decision; the maxWidth handles the "minWidth is too wide
for viewport" edge case.

---

## 12. Supabase embedded selects — FK must point at the EXACT joined table

**Rule:** When a Supabase query uses an embedded select like
`.select('... profiles(username, avatar_emoji)')`, the underlying
table MUST have a foreign-key constraint pointing directly at
`public.profiles(id)` — NOT at `auth.users(id)` (which uses the same
UUID 1:1). PostgREST resolves embeds via FK metadata in the schema
cache and does NOT bridge implicit relationships across schemas,
even when IDs match.

**Bug it caused (2026-05-24):** LeaderboardView called
`getLeaderboard()` which runs:
```js
.from('exam_results')
.select('id, user_id, ... profiles(username, avatar_emoji)')
```
The `exam_results` table had FK `user_id → auth.users(id)` but no
FK to `public.profiles(id)`. PostgREST returned: **"Could not find
a relationship between 'exam_results' and 'profiles' in the schema
cache"** — even though `profiles.id = auth.users.id` for every row.

**Stable replacement:** add a SECOND FK with a distinct name. Both
constraints coexist on the same column (PostgreSQL allows it when
the referenced columns share values):
```sql
ALTER TABLE public.exam_results
  ADD CONSTRAINT exam_results_user_id_profiles_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

NOTIFY pgrst, 'reload schema';
```

**Before adding the FK, ALWAYS audit for orphans:** rows whose
`user_id` doesn't match any row in the referenced table. In this
project we had 91 orphan rows from 11 distinct users — backfilled
their profiles from `auth.users` first, then added the FK.

**Generalization:** any table designed to embed another via PostgREST
needs:
1. A FK pointing at the exact table being embedded (not a "parent"
   table that happens to share IDs).
2. Zero orphan rows at the time of the ALTER (otherwise migration
   fails or silently breaks RLS).
3. `NOTIFY pgrst, 'reload schema'` at the end so the cache picks
   up the new relationship instantly.

See migration `supabase/migrations/20260524000000_leaderboard_fk_to_profiles.sql`
for the full backfill + FK pattern.

---

## Process checklist before any commit touching UI / data layer

- [ ] Did this change `src/styles.css`? → Run `npm run build` locally (verify the CSS chunk still extracts to `dist/assets/*.css`).
- [ ] Did this add a `::before` or `::after` pseudo with `position: absolute`?
      → Read rule 1. If you still want to ship it, set `pointer-events: none`.
- [ ] Did this set new React state in a click handler?
      → Will another click handler also see that state and misinterpret it?
- [ ] Did this add a new view route?
      → Does it reset implicit state from the previous view?
- [ ] Did this change CSS rules or the entry chunk hash?
      → Bump `SW_VERSION`.
- [ ] Did this touch `vite.config.js`?
      → Keep `target: 'es2020'` (or older); never `esnext`.
- [ ] Did this change a Q-bank file?
      → Run `npm run lint:all` and confirm error count didn't regress.
- [ ] Did this add or move a `notes-*.js` source?
      → Update `note-corpus.js`, regenerate notes registry, and run its contract tests.
- [ ] Did this parse backup/custom-question JSON?
      → Validate with `user-data-schema.js` before any setter and test malformed + empty data.
- [ ] Is this being described as "live"?
      → Require exact-SHA CI, Vercel Production status, and a production-alias user flow.
- [ ] Did this add a position: absolute dropdown anchored to a button?
      → Use `useDropdownAnchor` hook (rule 11) — never hardcode left/right.
- [ ] Did this add a Supabase `.select(... related(...))` embed?
      → Confirm a FK exists from the source table to the EXACT
        referenced table (rule 12). `auth.users` is NOT the same as
        `public.profiles` to PostgREST even when their IDs match 1:1.

---

_Append a rule whenever a repeatable architectural fragility is proven. Include
the bug it caught and the stable replacement so the next maintainer does not
have to rediscover it._
