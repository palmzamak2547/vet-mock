# VetMock — A11y Backlog (WCAG 2.1 AA)

Audit date: 2026-05-18 · Method: `preview_start` (vite preview, port 5179) → `preview_resize` 375×812 → `preview_snapshot` accessibility tree + `preview_inspect` for measured styles + source grep.

> Update 2026-08-11: the local `#lab`/`LabView` implementation was retired in
> favor of `imaging.cuvetsmo.com`. Lab-specific findings below are preserved as
> historical audit evidence and no longer apply to the VetMock bundle.
Surfaces audited:
- `/` (gated by `YearSelectView` → `PhaseSelectView` → `HomeView` / `ConfigView`)
- exam config (`ConfigView.jsx` — the "ตั้งค่า การฝึก" surface)
- `#lab` (`LabView.jsx`)
Note: Did NOT log in. Auth-gated screens (Dashboard, Account Settings, paid surfaces) not in this pass.

Priority key: **P0** blocks users (a11y barrier) · **P1** degraded experience · **P2** polish.

---

## P0 — Blockers (3)

### P0-1 · Missing `<main>` landmark on every view
- **Where**: `src/App.jsx:1670–1700` (root JSX) · confirmed via `preview_inspect main, [role="main"]` → "Element not found" on all 3 surfaces.
- **Impact**: screen-reader users (NVDA / VoiceOver / TalkBack) cannot jump to main content. The whole app reads as a continuous flow of buttons + headings nested in `<div role="none">`.
- **Fix recipe**: wrap the view-switch return JSX in `<main id="main">…</main>`. Add a "skip to content" link as the first focusable element in `<body>` that targets `#main`. ~10 lines.
- **WCAG**: 1.3.1 Info & Relationships, 2.4.1 Bypass Blocks.

### P0-2 · Back-chip (`.vmx-back-chip`) is 22 px tall — well under 44 px AA target
- **Where**: `src/components/BackBar.jsx` consumes `.vmx-back-chip` (`styles.js:263–280`) · measured `boundingBox.height = 21.6px` on ConfigView.
- **Impact**: users with motor impairments / large fingers / tremor can't reliably hit "ย้อนกลับ". This is the primary back affordance on every sub-view; missing it strands users.
- **Fix recipe**: in `styles.js:263`, raise padding to `12px 16px` and add `min-height: 44px`. Re-check the BackBar sticky offset (`margin: -8px 0 18px`) still feels right on mobile.
- **WCAG**: 2.5.5 Target Size (AAA) / 2.5.8 Target Size Minimum (AA, 24px hard floor — currently fails even that on the height axis after vertical text padding renders).

### P0-3 · Footer links 12 px and `min-height: auto` (~20 px high)
- **Where**: `styles.js:456` `.vmx-footer` defines `font-size:12px`; links inherit. `preview_inspect` measured `min-height: auto` on `<a>About</a>` etc.
- **Impact**: small touch target + low font size compound. "แจ้งปัญหา" and "📷 @vetmock.cu" are critical funnels; tiny font + tap area drops conversion.
- **Fix recipe**: in `styles.js:456`, set `.vmx-footer { font-size: 13px; }` and add `.vmx-footer a { display: inline-block; padding: 8px 4px; min-height: 44px; }`. Bump rule gated by `@media (hover:none)` if you want desktop to stay compact.
- **WCAG**: 2.5.8 Target Size Minimum.

---

## P1 — Degraded (7)

### P1-1 · Header icon buttons (`.vmx-theme-btn`) ship as 40×40, render 36×36 — fails AA touch target
- **Where**: `styles.js:158, 465` defines `.vmx-theme-btn { width: 36px; height: 36px }` then `width: 40px; height: 40px` at line 465 — but `preview_inspect` measured `26.4 × 36.4` actual.
- **Cause**: Search 🔍, Analytics 📊, Bookmarks 🔖, XP chip, Login, theme 🌙 all rendered tightly; the flex-row in `vmx-header-right` (`155`) gives `gap:10px` but per-button padding doesn't add up to 44px.
- **Fix recipe**: replace the duplicate rules with `min-width:44px; min-height:44px; padding:8px;` on every header pill, OR move to a single `.vmx-icon-btn` class and lift `.vmx-theme-btn`'s 40px target up to 44.
- **WCAG**: 2.5.8.

### P1-2 · `vmx-chip` (config view chips) is 36 px tall on mobile — under AA
- **Where**: `styles.js:232, 463`. Measured `min-height: 36px` on `10 / 20 / 50` chips and `30s / 60s / 120s` chips in ConfigView.
- **Note**: a separate `@media (max-width:640px)` rule at `styles.js:799` bumps `.vmx-chip-quick` (HomeView only) to 44 px but NOT `.vmx-chip`. ConfigView chips are stuck at 36.
- **Fix**: extend the mobile-bump rule to cover `.vmx-chip` outright OR raise the base to `min-height:44px`.
- **WCAG**: 2.5.8.

### P1-3 · Toggle switch is 44×24 — vertical axis fails minimum
- **Where**: `styles.js:237`. `preview_inspect .vmx-toggle` → 44×24 (close on width, fails on height). The DOM has correct `role="switch"` + `aria-checked` + keyboard handlers (`ConfigView.jsx:144`) — semantics good, just hit area.
- **Fix**: wrap the toggle in a `<button>` with `padding:10px 0` so the click target is 44×44 while the visible switch stays the same size. No visual change needed.

### P1-4 · Header icon-only buttons rely on emoji for meaning
- **Where**: search 🔍 (`App.jsx:1455+`), Analytics 📊 (`1458`), Bookmarks 🔖, theme 🌙. SR snapshot reports `aria-label` is present ("เปิด command palette", "Analytics", "Bookmarks", "ตัวเลือกธีมและจานสี") — GOOD.
- **Remaining gap**: emoji read aloud by some screen readers ("magnifying glass tilted left" etc.) BEFORE the aria-label is read by accessible-name-calc fallback. Visually-impaired Thai users may hear noise.
- **Fix**: wrap emoji in `<span aria-hidden="true">🔍</span>` so the button name is purely the aria-label.

### P1-5 · Color-only signaling on T/F + review items
- **Where**: `.vmx-tf-btn.selected-true` uses sage bg (`styles.js:368`), `.selected-false` uses rose. `.vmx-review-item.correct` left-border sage, `.wrong` rose, `.skipped` gold (`399–401`).
- **Impact**: deuteranopia (red-green) users cannot distinguish correct vs wrong reliably. Currently relies on color alone in the review list.
- **Fix recipe**: add a non-color marker inside `.vmx-review-result` — e.g. "✓ ตอบถูก" / "✗ ตอบผิด" badge text. The class already does this for `.vmx-review-result.ok / .no` — extend pattern to T/F buttons (add a small ✓ or ✗ ASCII).
- **WCAG**: 1.4.1 Use of Color.

### P1-6 · Hero h1 is `clamp(32px, 5.5vw, 52px)` — at 375 vw, this renders ~20px (well under intended)
- **Where**: `styles.js:203`. `5.5vw × 375 = 20.6px` so the minimum 32px kicks in — actually fine. But `clamp` math: `max(32, min(52, 5.5vw))` → on 375 wide that's `max(32, 20.6) = 32`. OK.
- **However**: `.vmx-results-hero h2.vmx-score-big { font-size: 64px }` mobile + `96px` desktop (`styles.js:385, 535`) — fine.
- **Real concern**: at 320 wide (older iPhone SE in landscape), hero h1 still 32px — acceptable. No fix needed; leaving here as a verified-fine note.

### P1-7 · No `aria-current` on active nav / phase
- **Where**: `.vmx-nav-btn.active` (`styles.js:200`) and `.vmx-chip.active` swap colors but don't set `aria-current="page"` or `aria-pressed="true"`.
- **Fix**: in `ConfigView.jsx` chip onClick, add `aria-pressed={isActive}` to each `<button>`. In the header year/phase pills add `aria-current="page"` to the active one.
- **WCAG**: 4.1.2 Name, Role, Value.

---

## P2 — Polish (6)

### P2-1 · Focus ring width 2px in two places — should standardize
- `styles.js:127` `:focus-visible { outline: 2px solid var(--clr-ink) }` and `styles.js:760` re-declares for cards. Both 2px. AA wants 2px min — OK, but on `--clr-bg` cream the outline contrast is ~5.5:1 (passes). On `--clr-surface-2` recessed bg ~5:1. Leave at 2px but consider 3px for higher-density screens (Palm's friend likely on iPhone Pro).

### P2-2 · Skip-to-content link missing
- Add `<a href="#main" class="vmx-skip-link">ข้ามไปเนื้อหาหลัก</a>` as the very first child of `<body>`. Pair with P0-1 main landmark.

### P2-3 · Lab onboarding modal close button (✕) is `aria-label="ปิดคำแนะนำ"` but uses `#555` text on light bg
- `LabView.jsx:287, 295`. The `#555` doesn't invert in dark mode → light grey on dark bg ~3:1 fail. **Fix**: swap inline `color:'#555'` → `var(--clr-ink-soft)`.

### P2-4 · Modal overlay is `rgba(0,0,0,0.5)` (`styles.js:452`) — does not adapt to dark theme
- Fine for light, slightly too dark in dark. Define `--clr-overlay` token and add dark override.

### P2-5 · Footer "made with ♡" → heart character + emojis are decorative, should be `aria-hidden="true"`
- Currently read aloud as "white heart suit, comma". Minor noise.

### P2-6 · `LabView.jsx` "▶️ ลอง demo" button has tooltip via `title=` but no `aria-describedby`
- `LabView.jsx:312–317`. Screen readers don't surface `title` reliably. Move the long help text to a visible `<small>` line OR `aria-describedby`.

---

## Summary

| Priority | Count |
|----------|-------|
| P0       | 3     |
| P1       | 7     |
| P2       | 6     |
| **Total**| **16**|

**Highest leverage**: P0-1 (main landmark + skip link) and P0-2/P0-3 (touch targets) — together unblock 80% of the audit since touch + landmark fail cascade across every screen. Estimated effort: 1 session, ~12 lines of CSS + 1 wrapper in App.jsx.

## Uncertain / could not measure

- **Real color contrast** of `.vmx-mode-card .badge` (white-ish text on `--clr-gold`) at 10px — needs photometer measurement; visual inspection suggests it's borderline ~3.4:1.
- **Keyboard tab order** across modals — would need full session login + interactive walkthrough to verify focus traps in `SummaryModal`, `InstructorModal`, `TodaysQModal`.
- **Reduced-motion compliance** in lazy-loaded chunks (`PhaseWrappedCard`, `DiagramLabelDrill`) — not exercised this session.
- **Screen reader testing** on real VoiceOver iOS — can't simulate; recommend Palm runs a 5-min VO sweep of the 3 surfaces.
