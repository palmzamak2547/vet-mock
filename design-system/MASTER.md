# VetMock — Design System Master Doc

Audit date: 2026-05-18 · Read-only.
Current Source of Truth: `src/styles.css` + `src/styles-landing.css` + component inline `style={{...}}`.
> 💡 **Migration Note (2026-05-27):** Styles originally exported from `src/styles.js` were migrated to `src/styles.css` and `src/styles-landing.css`. Historical line number references below (`styles.js:N`) refer to audit declarations now residing in `src/styles.css`.

## 1. Architecture

- **Single global stylesheet** injected once by `App.jsx` via `<style>{STYLES}</style>` (no CSS-in-JS framework, no Tailwind).
- **CSS custom properties** scoped to `:root` / `[data-theme="…"]` / `[data-palette="…"]` — theme + palette switching done at the root element. App.jsx persists `vmx-theme` + `vmx-palette` in localStorage.
- **`.vmx-` class namespace** for all named patterns. JSX components apply these classnames; one-off layout flex/gap/font-size lives in inline `style={{}}` (very heavy use — see Gaps §6).

---

## 2. Color tokens

### Base palette (`:root` / `[data-theme="light"]` — `styles.js:2`)
| Token            | Value     | Role                              |
|------------------|-----------|-----------------------------------|
| `--clr-bg`       | `#f6efe4` | App background (warm cream)       |
| `--clr-surface`  | `#fdf8ef` | Card / panel surface              |
| `--clr-surface-2`| `#f0e6d2` | Recessed surface (alt-rows, kbd)  |
| `--clr-ink`      | `#2b2419` | Primary text                      |
| `--clr-ink-soft` | `#5c4f3d` | Secondary text                    |
| `--clr-sage`     | `#4a6b4a` | Primary accent (correct, CTA hover, sage links) |
| `--clr-sage-soft`| `#a8c0a8` | Sage subtle bg                    |
| `--clr-rose`     | `#c26d6d` | Danger / wrong / FALSE            |
| `--clr-rose-soft`| `#e8b8b8` | Weak-tag pill bg                  |
| `--clr-gold`     | `#b88940` | Warning / badge / SR hard / bookmark |
| `--clr-gold-soft`| `#e8d4a8` | Gold subtle bg                    |
| `--clr-ocean`    | `#3d6b82` | Note button / SR easy             |
| `--clr-plum`     | `#7d4a7d` | Unused in body (reserved palette switch) |
| `--clr-border`   | `#d8c9a8` | Border / divider                  |

Dark theme (`styles.js:21`) reuses the same names with inverted L*. Palettes (`ocean`, `plum`, `cherry`, `mono`, `forest` — `styles.js:48–107`) override `--clr-sage` + `--clr-gold` only, keeping bg/ink stable so contrast never breaks.

Examples in components:
- `--clr-ink` body text: `styles.js:131`, `Question.jsx`, `HomeView.jsx:1100+`
- `--clr-sage` correct answer: `vmx-tf-btn.selected-true` (`styles.js:368`), `vmx-bar-fill` (`416`)
- `--clr-rose` warning timer + wrong: `vmx-timer.warn` (`286`), `vmx-review-item.wrong` (`399`)
- `--clr-gold` bookmark badge: `vmx-bookmark-btn.active` (`294`), mode-card badge (`216`)
- `--clr-ocean` note button: `vmx-note-btn.has-note` (`297`)

### Hardcoded color leaks (consolidation opportunities)

These DON'T use the token system and will not flip in dark mode:

| File:Line                      | Color        | Should use            |
|--------------------------------|--------------|------------------------|
| `views/LabView.jsx:287`        | `#555`       | `var(--clr-ink-soft)`  |
| `views/LabView.jsx:288–290`    | hex strings  | tokens                 |
| `styles.js:344`                | `rgba(0,0,0,0.18)` shadow | reuse `--shadow-md` |
| `styles.js:452`                | `rgba(0,0,0,0.5)` overlay | could be `--clr-overlay` token |
| `styles.js:641`                | `rgba(0,0,0,0.02)` zebra  | low-priority           |
| 87 files using inline styles   | various hex/rgba | mostly layout-only but many color leaks too |

### Contrast spot-checks (against light theme)

- `--clr-ink-soft` (#5c4f3d) on `--clr-bg` (#f6efe4) ≈ **6.2:1** — passes AA body.
- `--clr-ink-soft` on `--clr-surface-2` (#f0e6d2) ≈ **5.6:1** — passes AA.
- Mode-card sub text 13px, ink-soft on surface → passes.
- Badge text on `--clr-gold` (#b88940) ≈ ~3.4:1 white on gold — **fails AA for 10–11px badges** (`vmx-mode-card .badge` `styles.js:216`). See a11y P1.
- `--clr-ink-soft` placeholder on inputs: not separately defined — uses 0.6 opacity native — uncertain ratio without measuring.

---

## 3. Typography

### Font families
| Stack                                                        | Use                          | Where               |
|--------------------------------------------------------------|------------------------------|---------------------|
| `'IBM Plex Sans Thai', 'Fraunces', system-ui, sans-serif`    | App body (Thai-first)        | `.vmx-app` (`131`)  |
| `'Fraunces', serif`                                          | Display: logo, hero, headings, big score, option letters | `.vmx-logo`, `.vmx-hero h1`, `.vmx-mode-card .title`, `.vmx-score-big` |
| `'JetBrains Mono', monospace`                                | Numeric / chip / kbd / progress | `.vmx-cmdk-kbd`, `.vmx-chip`, `.vmx-timer`, `.vmx-progress`, `.vmx-stat-num`, `.vmx-kbd` |
| `'Sarabun', 'Inter', sans-serif`                             | Markdown summary body (Thai reading) | `.vmx-summary-body` (`585`) |

### Size scale (extracted)
- 10px — `.vmx-mode-card .badge`, `.vmx-qtype-badge`, `.vmx-review-head`, `.vmx-cmdk-kbd` (decorative chrome)
- 11px — `.vmx-stat-lbl`, `.vmx-section-label`, `.vmx-tag-pill`, `.vmx-kbd`, `.vmx-fill-label`
- 12px — `.vmx-subtitle`, `.vmx-subject-card .sub`, `.vmx-nav-btn`, `.vmx-btn-sm`, `.vmx-footer`, `.vmx-summary-body code`
- 13px — `.vmx-mode-card .sub`, `.vmx-streak`, `.vmx-cmdk-btn`, `.vmx-chip`, `.vmx-review-ans`, `.vmx-summary-body .vmx-md-table`, `.vmx-back-chip`
- 14px — `.vmx-btn`, `.vmx-form-group input`, `.vmx-match-select`, `.vmx-note-textarea`, `.vmx-sr-btn .label`
- 15px — `.vmx-hero p`, `.vmx-option-text`, `.vmx-fill-input`, `.vmx-review-q`, `.vmx-md-h3`
- 16px — `.vmx-progress strong`, `.vmx-timer`, `.vmx-sr-btn .label`, **all inputs (iOS no-zoom rule `styles.js:448`)**
- 17px — `.vmx-qtext`, `.vmx-flashcard .back`
- 18px — `.vmx-subject-card .title`, `.vmx-dash-card h3`, `.vmx-md-h2`
- 20px — `.vmx-mode-card .title`, `.vmx-tf-btn`, `.vmx-flashcard .front`, `.vmx-score-msg`, `.vmx-modal h2 (mobile)`
- 22px — `.vmx-logo`, `.vmx-score-frac`, `.vmx-flashcard .back .answer`, `.vmx-md-h1`
- 24px — `.vmx-modal h2`
- 32px — `.vmx-stat-num`
- 52px hero h1 max (`clamp(32px, 5.5vw, 52px)`)
- 64px / 96px — `.vmx-score-big` (mobile / desktop)

### Weights
- 400 system normal (body)
- 500 italic accents (`.vmx-logo span`, `.vmx-hero h1 em`)
- 600 used most (headings, labels, btn, chip-active, option-letter)
- 700 `.vmx-review-result`
- 800 `.vmx-logo`, `.vmx-score-big`

### Line-height
- 0.95 hero h1
- 1.0 stat-num, score-big
- 1.4 option-text, print
- 1.5 mode-card sub, qtext, review-q, flashcard
- 1.55 qtext, md-pre
- 1.6 hero p, empty-state
- 1.65 md-ul li

### Letter-spacing
- `-0.04em` score-big
- `-0.03em` hero h1
- `-0.02em` logo, mode-card title
- `0.04em` cmdk-kbd
- `0.05em` mode-card badge
- `0.08em` review-head, subtitle, tag-pill, stat-lbl
- `0.12em` section-label
- `0.15em` score-label

---

## 4. Spacing scale

Inferred from `padding` / `margin` / `gap`:
- 2 4 6 8 10 12 14 16 18 20 24 28 32 40 48px — multiples of 2/4 (no strict 4-grid; lots of one-offs)
- Container: `max-width: 820px` default, `1100px` wide (NotesView)
- Cards inner pad: 16px (sm), 20px (subject), 24px (mode), 28px (config-panel, modal), 32px (question-card), 40px (flashcard, results-hero)
- Safe-area: `padding: max(20px, env(safe-area-inset-top)) max(16px, env(...))` (`135`) — strong on iOS

### Border-radius scale
- 4px — kbd, focus-ring, code, fill-label badge
- 8px — md-code, skeleton-line, match-select, note-textarea, summary-body bg
- 10px — fill-input, form-group input, options, note-panel
- 12px — option, qimage, focus on subject-card, note-panel, mode-card press
- 14px — stat-card
- 16px — subject-card, review-item, dash-card, tf-btn (mobile)
- 18px — mode-card
- 20px — config-panel, question-card, modal, flashcard
- 24px — results-hero
- 999px — chips, pills, btn (fully round)

---

## 5. Component patterns

| Pattern        | Class                          | Examples / paths                   |
|----------------|--------------------------------|------------------------------------|
| **Button — primary** | `.vmx-btn.vmx-btn-primary` (`242–245`) | `ConfigView.jsx`, exam start across views |
| **Button — ghost / back** | `.vmx-btn-ghost`, `.vmx-back-chip` (`251`, `263`) | `BackBar.jsx`, results / review nav |
| **Card — mode (top-level)** | `.vmx-mode-card` (`211`) | `HomeView.jsx` mode grid, `YearSelectView`, `PhaseSelectView` |
| **Card — subject** | `.vmx-subject-card` (`219`) | `SubjectSelectView.jsx`, `HomeView.jsx` |
| **Card — question** | `.vmx-question-card` (`291`) | `Question.jsx`, `ExamView.jsx` |
| **Card — dash** | `.vmx-dash-card` (`413`) | `DashboardView.jsx` |
| **Card — review** | `.vmx-review-item` + `.correct/.wrong/.skipped` (`397`) | `ReviewView.jsx` |
| **Card — flashcard** | `.vmx-flashcard` (`439`) | `SRSessionView.jsx` |
| **Input — text** | `.vmx-fill-input`, `.vmx-form-group input` (`373`, `446`) | `AuthView.jsx`, `ExamView.jsx` fill-in |
| **Input — textarea** | `.vmx-note-textarea`, `.vmx-form-group textarea` (`382`, `450`) | `NotesView`, `QComments` |
| **Chip — toggle** | `.vmx-chip` + `.active` (`232`) | `ConfigView.jsx` qty/time picker, `HomeView.jsx` filters |
| **Chip — quick** | `.vmx-chip-quick` (`712`, `799`) | `HomeView.jsx` quick-action buttons |
| **Chip — back** | `.vmx-back-chip` (`263`) | `BackBar.jsx` everywhere |
| **Pill — tag** | `.vmx-tag-pill` + `.weak` (`421`) | `DashboardView.jsx` weak-tag panel |
| **Badge — q-type** | `.vmx-qtype-badge` (`299`) | `Question.jsx` |
| **Badge — mode** | `.vmx-mode-card .badge` (`216`) | `HomeView.jsx` LIVE/NEW tags |
| **Toggle — switch** | `.vmx-toggle` (`237`) + role="switch" | `ConfigView.jsx:144` (correct ARIA) |
| **Modal** | `.vmx-modal-overlay` + `.vmx-modal` (`452`) | `SummaryModal`, `InstructorModal`, `TodaysQModal`, player |
| **Modal — fullscreen player** | `.vmx-modal:has(.vmx-player-grid)` (`488–502`) | `VideoView` mobile |
| **FAB** | `.vmx-passage-fab` (`330`), `.vmx-vetcalc-fab`, `ToolsFAB` | floating bottom-right |
| **Section label** | `.vmx-section-label` (`207`) | `HomeView.jsx`, `DashboardView.jsx` (divider with text) |
| **Skeleton** | `.vmx-skeleton`, `.vmx-skeleton-line`, `.vmx-skeleton-card` (`736–747`) | `NotesView`, `VideoView` lazy chunks |
| **Empty state** | `.vmx-empty-state` (`770`) | applied across empty lists |
| **Progress bar** | `.vmx-progress-bar` + `.vmx-progress-fill` (`288`) | `ExamView.jsx`, `vmx-bar` on dash (`415`) |
| **Timer chip** | `.vmx-timer` + `.warn` (`285`) | `ExamView.jsx` |
| **Option — MCQ** | `.vmx-option` + `.selected` (`358`) | `Question.jsx` |
| **Option — T/F** | `.vmx-tf-btn` + `.selected-true/false` (`366`) | `Question.jsx` true-false |
| **Option — match** | `.vmx-match-item`, `.vmx-match-select` (`377`) | `Question.jsx` match-pairs |
| **SR grade row** | `.vmx-sr-grade` + `.vmx-sr-btn.again/hard/good/easy` (`425`) | `SRSessionView.jsx` |

---

## 6. Consolidation gaps (top design-system findings)

### 6a. Inline-style sprawl (BIGGEST gap)
- **1,835 `style={{...}}` occurrences across 87 files**. `App.jsx` alone has 45; `HomeView.jsx` 103; `LabView.jsx` 48; `ImageAnnotator.jsx` 19.
- Many encode pure layout (`{flex:1, gap:8}`) which is fine — but many duplicate token values (`fontSize: 13, color: '#555'` instead of `--clr-ink-soft` class).
- **Action**: introduce 5–8 utility classes (`vmx-row`, `vmx-col`, `vmx-gap-8/12/16`, `vmx-text-soft`, `vmx-text-sm/xs`) and grep-replace the high-occurrence patterns. Will also help dark-mode parity (the `#555` in `LabView.jsx:287` doesn't invert).

### 6b. Three back-button affordances co-exist
- `.vmx-btn-ghost` (long with arrow animation, line 251)
- `.vmx-back-chip` (sticky chip in `BackBar.jsx`, line 263)
- "← Home" inline button in `LabView.jsx:280+`
- Visually similar but separately styled. **Action**: collapse to one `BackBar` component everywhere; delete the bespoke Lab implementation.

### 6c. Card radii are scattered (8 different values)
- 14, 16, 18, 20, 24, plus pills 999. **Action**: pick 3-4 radii tokens (`--r-sm 8` `--r-md 12` `--r-lg 16` `--r-xl 20`).

### 6d. Shadow tokens are present (`--shadow-sm`, `--shadow-md`) but bypassed
- FAB uses `0 4px 14px rgba(0,0,0,0.18)` inline at `styles.js:344` — should be `var(--shadow-md)`.

### 6e. Touch target spec drift
- `.vmx-btn` says `min-height: 40px` (`461`), `.vmx-btn-sm` `36px`, `.vmx-chip` `36px`, `.vmx-theme-btn` `40×40`.
- WCAG 2.1 AA minimum is 44×44 (Apple HIG too). Mobile-bump rule at line 798 brings `.vmx-chip-quick` and `.vmx-option` to 44 but leaves other chips/buttons at 36.
- **Action**: define `--touch-min: 44px` and apply it once.

### 6f. Two `:focus-visible` rule blocks (`127` + `760`) — same outcome, different selectors
- Already mostly consolidated; minor cleanup.

### 6g. Modal body fonts disagree
- App body uses IBM Plex Sans Thai; `.vmx-summary-body` uses Sarabun (line 585). Both are good Thai webfonts but the visual shift between exam view and "view summary" is noticeable. **Action**: pick one or document the rationale.

---

## 7. Theme variants

- **Themes**: `light` (default) + `dark` (data-theme="dark"). Switched via header button (`.vmx-theme-btn`).
- **Palettes**: `(none) | ocean | plum | cherry | mono | forest`. Stacked on top of theme — only swap `--clr-sage` + `--clr-gold`. App.jsx persists in localStorage `vmx-palette`.
- **Prefers-reduced-motion** (`193`, `545`, `789`) — all keyframe animations disabled.
- **Prefers-color-scheme** — NOT auto-detected. Manual toggle only (intentional based on `styles.js:159` `theme-btn` UI).
- **Print** stylesheet (`555`) — hides chrome, retains content, expands NotesView sidebar.
- **iOS-specific**: `font-size: max(16px, 1em)` on inputs prevents zoom (`448`); safe-area insets honoured.

---

## 8. Recommendations (prioritised)

1. **Stop the inline-style bleed** — add 5-8 utility classes, then grep-fix the top 3 files (App, HomeView, LabView). Quick win, biggest payoff.
2. **Unify touch targets at 44px** — single `--touch-min` token, applied to all interactive `.vmx-btn / .vmx-chip / .vmx-theme-btn / .vmx-back-chip / .vmx-cmdk-btn`. A11y P1.
3. **One BackBar component** — kill the three back-button affordances.
4. **Three radius tokens, three shadow tokens** — replace the magic numbers.
5. **Audit `#hex` in JSX** — only `var(--clr-*)` allowed in `color:`/`background:` inline styles going forward.
6. **Document the system in this file when you change it** — bump a small CHANGELOG block at the bottom each time tokens move.
