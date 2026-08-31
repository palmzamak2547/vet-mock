# VetMock — Design System (current spec)

> Last verified against production: **v5.55.0 · 2026-08-30**. Notes loading,
> offline error/retry, backup previews, and JSON validation dialogs follow the
> same Thai-first hierarchy, shared dialog focus behavior, semantic colours,
> and 44px interaction floor as the rest of the product.

> The living token spec. Supersedes `design-system/MASTER.md` (stale — dead line
> numbers / resolved sections). Source of truth is `src/styles.css :root`.
> Identity: **warm accessible editorial** — cream paper, sage ink, restrained
> flat controls and Thai-first hierarchy. Not a
> gamified/gradient/glass SaaS look; the only glass/glow is quarantined to the
> marketing landing under `.lp-`.

## Colour (semantic — theme-aware)
Never hardcode a hex in JSX for a themed surface; use a token so dark mode +
the 5 palettes flip it. `[data-theme="dark"]` inverts; `[data-palette=*]` swaps
only the accent so bg/ink contrast never breaks.

| Token | Light | Role |
|---|---|---|
| `--clr-bg` | `#f6efe4` | app background (cream) |
| `--clr-surface` | `#fdf8ef` | cards / raised |
| `--clr-surface-2` | `#f0e6d2` | muted / hover |
| `--clr-ink` | `#2b2419` | primary text |
| `--clr-ink-soft` | `#5c4f3d` | secondary text |
| `--clr-sage` | `#4a6b4a` | **primary accent / actions** |
| `--clr-rose` | `#c26d6d` | danger / warning |
| `--clr-gold` | `#b88940` | highlight / streak |
| `--clr-border` | `#d8c9a8` | hairlines |
| `--clr-{sage,gold,rose}-text` | — | AA-contrast text-on-surface variants |

Interaction tokens (`--vmx-color-*`, `--vmx-surface*`, `--vmx-text*`) are
**harmonized to the palette above** (2026-07-24 — they used to be a cold
Duolingo blue/slate scheme that clashed). `--vmx-color-learning` = the sage
primary; shared buttons use stable 1px borders and never change layout depth
when pressed.

Status must **not be colour-only** — pair with icon/text (correct/incorrect,
flagged, unanswered).

## Scale tokens (added 2026-07-24 — Phase 1 foundation)
Additive. Existing code + magic values still work; new/migrated code uses these.

- **Spacing** (4px grid): `--space-0..16` → `0,4,8,12,16,20,24,32,40,48,64`.
- **Radius**: `--r-sm 8` · `--r-md 12` · `--r-lg 16` · `--r-xl 20` · `--r-pill 999`.
  (Collapses the 9 ad-hoc values; `--vmx-radius-control/card` remains as a
  compatibility alias for legacy views.)
- **Elevation**: `--shadow-sm`, `--shadow-md` (existing).
- **Z-index ladder** — always use a token, never a fresh magic number:
  `--z-base 0` · `--z-raised 10` · `--z-sidebar 100` · `--z-fab 600` ·
  `--z-nav 700` · `--z-modal 1000` · `--z-overlay 1100` · `--z-toast 1500` ·
  `--z-skip 9999`. (Modal 1000 / skip 9999 match the existing CSS.)
- **Motion**: `--dur-fast 120ms` · `--dur 180ms` · `--dur-slow 300ms` ·
  `--ease-out cubic-bezier(.22,1,.36,1)` (the "float, don't bounce" ease) ·
  `--ease-in-out cubic-bezier(.4,0,.2,1)`. Honour `prefers-reduced-motion`
  (never blanket-disable info-carrying motion — animate a safe fallback).
- **Touch**: `--touch-min 44px` (already enforced in rules; now a token).

## Typography
Thai-first. Base stack `'Sarabun','IBM Plex Sans Thai','Fraunces',system-ui`
(set on `.vmx-app` and `html,body`). Core UI headings and controls use Sarabun;
the brand wordmark alone keeps `Fraunces`. Mono
(codes/kbd) = `JetBrains Mono`. Wiki reference titles carry **no emoji** and no
study annotations (see `lib/vetwiki/schema.js wikiTitle`). *Perf debt: Sarabun is
double-loaded — Phase 1 consolidates to one woff2 (see MIGRATION_PLAN).*

## Accessibility invariants (preserve — do not regress)
44px touch floor · `.vmx-skip-link` · `:focus-visible` (incl. the WebKit
programmatic-focus outline fix) · `prefers-reduced-motion` blocks · iOS 16px
inputs (no zoom) · `env(safe-area-inset)` on app/modals/FABs ·
`overflow-x:clip` safety net · wide tables in `overflow-x:auto`. Target WCAG 2.2 AA.

## Components (state today → target)
Strong: flat buttons (`.vmx-btn*`), `BackBar`, `ViewFallback` skeleton,
`vmx-modal-overlay`, `useModalFocus`, `StatePanel`, feature cards. Dialogs use
`data-vmx-modal="true"` so nested focus/Escape ownership is deterministic;
remote loading/empty/error views reuse `StatePanel`. **Debt** (Phase 1-3): legacy
views still contain thousands of inline `style={{}}` declarations; shared shell
and core study views migrate to named classes first. Eight duplicate card families → one `.vmx-card`
base; remaining press interactions → `.vmx-pressable-card`; long-list skeleton
patterns can still converge further.

## Rules
1. New visual value → a token, never a magic number.
2. Themed surface → a `--clr-*` var, never a JSX hex.
3. New stacking layer → a `--z-*` token.
4. New motion → a `--dur/--ease` token + reduced-motion fallback.
5. Interactive control → ≥ `--touch-min`, visible focus, non-colour state.
6. No gradients/glass/glow/emoji-as-icon in the app (marketing `.lp-` excepted).

## Guidelines — DO / DON'T
> Format after styles.refero.design (DESIGN.md written for agents). Every rule
> below was PAID FOR: it cites the measured incident that earned it. When one
> blocks you, read the incident before overriding the rule.

**DO**
- Give a navigation surface its own class family; never compose rows from
  `.vmx-btn`. *(2026-08-30: `.vmx-sidebar-item` declared `flex-start`, `.vmx-btn`
  declared `center` 800 lines later at equal specificity — source order won,
  icons scattered 14px, and the author before us had already lost this fight
  once, leaving `!important` on border but not justify.)*
- Keep text tokens at `opacity: 1`; say "secondary" with size, weight and
  letter-spacing. *(2026-08-30: opacity 0.65/0.6 on rail heading/version took
  AA-passing tokens to 3.2:1 and 2.87:1 — under the 4.5 floor, on the very
  request that said "ได้มาตรฐาน".)*
- Interface icons are line SVG in `NavIcon`; registry emoji are content, and
  the only acceptable FALLBACK so unmapped features degrade into view, not out
  of it. Two glyphs in one rail must be distinguishable at 17px (`wiki` vs
  `book` were near-identical; the library got `files`).
- One-shot brand/settle motion: `animation-fill-mode: backwards`, finish on
  the element's natural resting state, and gate to once per page LOAD, not per
  mount. *(2026-08-30: `both` held the final keyframe forever and a filling
  animation outranks transitions — the paw's hover did nothing while the pad
  and text still moved. Half-working is the kind that ships.)*
- Derive every navigation list from `lib/nav.js` or `feature-registry.js`.
  Two surfaces listing destinations independently WILL disagree — same class
  as the two streak numbers (freeze-aware vs naive walk) fixed 2026-08-30.
- Treat compact landing navigation as a modal contract, not an animation:
  keep the link tree mounted, close it with `visibility` + `inert`, pair the
  trigger with `aria-expanded`/`aria-controls`, move and return focus, contain
  Tab, close on Escape, lock the actual page scroller, and keep reduced-motion
  completion under 150ms. The fixed curtain sits below the sticky header so
  opening it never changes page height. CSS owns the responsive breakpoint;
  behavior observes whether the trigger is actually hidden and closes the
  curtain, rather than copying a pixel cutoff that can drift and strand body
  scroll lock after rotation. *(2026-08-31: the old conditional mobile row
  pushed the hero and owned none of those interaction states.)*
- Treat a duplicate JSX prop or a build warning as a behavior defect. The last
  prop wins, so `className="vmx-press"` followed by another `className` silently
  removed tactile feedback from the Quest claim action. Also avoid inline
  `all: unset` on a control that depends on component classes; it resets the
  same transition the class is trying to provide.
- Prefer an explicit `returnFocusRef` when a modal's launcher is known. Touch
  event heuristics remain a fallback, but WebKit may not deliver the same
  pointer path as desktop. Keep the launcher mounted when closing the modal;
  permanent banner dismissal is a separate action.
- Keep landing motion within its budget: CSS hover/press feedback and
  `IntersectionObserver` for discrete scroll state. This preserves location
  cues without scroll-frame React updates, pointermove transforms, injected
  progress rails, or cursor spotlights.
- Want a wash? Grain over gradient. Texture is what separates "watercolour on
  paper" from "SaaS mesh": static inline feTurbulence tile at 4-7% opacity
  over at most 2-3 brand-hue radials (technique studied on feralui.dev,
  rebuilt in-house — no request, no dependency, no animation).

**DON'T**
- Never animate the hero wash or add blur() orbs on first paint — the old
  four-colour animated mesh was removed for measured phone composite cost.
  The wash is STATIC; the grain tile is rasterised once and cached.
- Never conditional-mount or push the landing menu into document flow. That
  deletes navigation from the closed DOM, shifts the page on open, and makes
  focus/scroll ownership an afterthought. Keep one mounted curtain and change
  only its interactive state.
- Never attach continuous scroll or pointer physics to a low-motion landing
  just to make it feel designed. If movement does not communicate hierarchy,
  feedback, or state, remove it instead of optimizing it.
- Never win a specificity fight with `!important` — restructure so the fight
  cannot exist (own class, no inherited role).
- Never render a decorative motion under `prefers-reduced-motion`, and never
  suppress POSITION under it either: the sidebar marker still lands on the
  active row (duration ~0), because where-you-are is information.
- Never hardcode an outgrowable product fact in copy or tests ("ปี 1, 2, 4, 5
  เปิดแล้ว", a draft badge that exists to disappear) — derive from the data
  the UI reads. *(2026-08-29: 23/25 CI runs red for a day; the failure email
  became noise and a real regression would have sailed through.)*
- Never let a required gate depend on a third party (youtube.com in the
  geometry audit) — abort those routes in the spec; a red gate nobody can fix
  teaches everyone to ignore the gate.
