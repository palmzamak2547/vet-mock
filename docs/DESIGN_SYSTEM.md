# VetMock — Design System (current spec)

> The living token spec. Supersedes `design-system/MASTER.md` (stale — dead line
> numbers / resolved sections). Source of truth is `src/styles.css :root`.
> Identity: **warm editorial** — cream paper, sage ink, restrained. Not a
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
primary; buttons keep the tactile 3D `--vmx-press-depth`.

Status must **not be colour-only** — pair with icon/text (correct/incorrect,
flagged, unanswered).

## Scale tokens (added 2026-07-24 — Phase 1 foundation)
Additive. Existing code + magic values still work; new/migrated code uses these.

- **Spacing** (4px grid): `--space-0..16` → `0,4,8,12,16,20,24,32,40,48,64`.
- **Radius**: `--r-sm 8` · `--r-md 12` · `--r-lg 16` · `--r-xl 20` · `--r-pill 999`.
  (Collapses the 9 ad-hoc values; `--vmx-radius-control/card` retained for the
  existing 3D buttons.)
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
(set on `.vmx-app` and `html,body`). Display/wordmark = `Fraunces` (serif). Mono
(codes/kbd) = `JetBrains Mono`. Wiki reference titles carry **no emoji** and no
study annotations (see `lib/vetwiki/schema.js wikiTitle`). *Perf debt: Sarabun is
double-loaded — Phase 1 consolidates to one woff2 (see MIGRATION_PLAN).*

## Accessibility invariants (preserve — do not regress)
44px touch floor · `.vmx-skip-link` · `:focus-visible` (incl. the WebKit
programmatic-focus outline fix) · `prefers-reduced-motion` blocks · iOS 16px
inputs (no zoom) · `env(safe-area-inset)` on app/modals/FABs ·
`overflow-x:clip` safety net · wide tables in `overflow-x:auto`. Target WCAG 2.2 AA.

## Components (state today → target)
Strong: buttons (`.vmx-btn*`, 3D press), `BackBar`, `ViewFallback` skeleton,
`vmx-modal-overlay`, feature cards. **Debt** (Phase 1-3): 2,634 inline
`style={{}}` with no utility layer; 8 duplicate card families → one `.vmx-card`
base; 4× reimplemented press interaction → one `.vmx-pressable`; 42 native
`alert/confirm` → one styled primitive; text "กำลังโหลด…" → reusable Skeleton.

## Rules
1. New visual value → a token, never a magic number.
2. Themed surface → a `--clr-*` var, never a JSX hex.
3. New stacking layer → a `--z-*` token.
4. New motion → a `--dur/--ease` token + reduced-motion fallback.
5. Interactive control → ≥ `--touch-min`, visible focus, non-colour state.
6. No gradients/glass/glow/emoji-as-icon in the app (marketing `.lp-` excepted).
