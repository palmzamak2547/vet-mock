# VetMock — Design System (current spec)

> Last verified against production: **v5.31.0 · 2026-08-21**. Notes loading,
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
