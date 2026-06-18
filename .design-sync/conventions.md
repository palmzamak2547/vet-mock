# VetMock Design System — build conventions

Real, shipped UI of **VetMock** (`vet-mock-exam`) — a Thai vet-student exam-prep PWA (React + Vite, **plain CSS** — no Tailwind; JSX, no TypeScript). Build new screens with these components as-is.

## Styling idiom — CSS custom properties (not Tailwind)

Styling is plain CSS in a global `styles.css` driven by **CSS custom properties** as design tokens. Reference them with `var(--token)`; don't hardcode hex (the app themes by swapping these vars via `ThemePicker`).

### Color tokens (`var(--clr-*)`)
| Token | Role |
|---|---|
| `--clr-ink` / `--clr-ink-soft` | text — primary / muted |
| `--clr-bg` / `--clr-surface` / `--clr-surface-2` | backgrounds — page / card / raised |
| `--clr-border` | borders, dividers |
| `--clr-sage` / `--clr-sage-soft` | **primary** (calm green) — accent, active, success |
| `--clr-gold` / `--clr-gold-soft` | highlight, streak, reward |
| `--clr-rose` / `--clr-rose-soft` | error, urgent |
| `--clr-ocean` | info, link |
| `--clr-plum` | secondary accent |

Elevation: `var(--shadow-sm)`, `var(--shadow-md)`. The palette is soft + editorial (a calm study aesthetic); multiple themes swap the `--clr-*` values, so always build on tokens.

## Setup

Components are JSX (no TS → `.d.ts` contracts are minimal). Most leaves render standalone; editor / data / overlay components (graders, editors, command palette, modals) need props or app context and floor-card in the design pane.

## Where the truth lives

Read `styles.css` for the full token + class vocabulary, and each component's source for its props.
